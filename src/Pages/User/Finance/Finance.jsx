import { Box } from "@mui/material";
import ButtonGroup from "../../../Components/Buttons/TopBarControls";
import Phase1Report from "./Phase1Reports/Phase1Report";
import DynamicModal from "../../../Components/Modals/ExploreModal";
import { useContext, useEffect, useState } from "react";
import { FilterContext } from "../../../Contexts/FilterContext";
import Phase2Report from "./Phase2Report";
import SalesByDayAndHour from "./Phase1Reports/SalesByDayAndHour";
import GratuityByVendor from "./Phase1Reports/GratuityByVendor";
import { getFinancialDetailsData } from "../../../API/lightspeedAPI";
import { formatToYMD } from "../../../Utils/dateUtils";
import getYOYComparison from "../../../Utils/commonFunction";

const Finance = ({ userToken }) => {
  const [visible, setVisible] = useState(false);
  const { filters } = useContext(FilterContext);
  console.log("filtersfilters", filters);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState("Explore");
  const buttonData = [
    { id: 0, title: "Phase 1 Report", type: "phase_1_report", phase: 1 },
    { id: 1, title: "Phase 2 Report", type: "phase_2_report", phase: 2 },
    { id: 2, title: "Other Report", type: "other_report", phase: 3 },
  ];

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const fromDate = formatToYMD(filters?.dateRange?.startDate);
        const toDate = formatToYMD(filters?.dateRange?.endDate);
        const data = await getFinancialDetailsData(userToken, fromDate, toDate);
        console.log(
          "getFinancialDetailsDatagetFinancialDetailsData------",
          data
        );
        console.log("converted dtaa--------", getYOYComparison(data.data));
      } catch (err) {
        console.error("Error fetching Shipday data:", err);
      }
    };

    fetchFinanceData();
  }, [userToken, filters?.dateRange?.startDate, filters?.dateRange?.endDate]);

  const openPhase1V7Modal = () => {
    // setModalTitle("Product Details");
    setModalContent(<Phase1Report showExploreButton={false} />);
    setVisible(true);
  };

  const openSalesByDayAndHourModal = () => {
    // setModalTitle("Product Details");
    setModalContent(<SalesByDayAndHour showExploreButton={false} />);
    setVisible(true);
  };
  const openGratuityByVendor = () => {
    //  setModalTitle("Product Details");
    setModalContent(<SalesByDayAndHour showExploreButton={false} />);
    setVisible(true);
  };

  return (
    <>
      <Box p={1} mt={1}>
        <Box mb={1}>
          <ButtonGroup buttons={buttonData} />
        </Box>
        {filters?.topBarSelectedSection?.id === 0 && (
          <>
            <Box
              sx={{
                border: "1px solid #c2c0c0ff",
                borderRadius: "5px",
                padding: "10px",
                height: "auto",
                marginRight: "5px",
                width: "100%",
              }}
            >
              <Phase1Report handleExplore={openPhase1V7Modal} />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                // alignItems: "center",
                //   px: 3,
                gap: 2,
                py: 1.5,
                //   borderBottom: "1px solid #e0e0e0",
                backgroundColor: "#fff",
              }}
            >
              <SalesByDayAndHour handleExplore={openSalesByDayAndHourModal} />
              <GratuityByVendor handleExplore={openGratuityByVendor} />
            </Box>
          </>
        )}
        {filters?.topBarSelectedSection?.id === 1 && (
          <Box
            sx={{
              border: "1px solid #c2c0c0ff",
              borderRadius: "5px",
              padding: "10px",
              height: "auto",
              marginRight: "5px",
              width: "100%",
            }}
          >
            <Phase2Report />
          </Box>
        )}
      </Box>

      <DynamicModal
        visible={visible}
        onClose={() => setVisible(false)}
        title={modalTitle}
        width="90vw"
        height="80vh"
      >
        {modalContent}
      </DynamicModal>
    </>
  );
};

export default Finance;
