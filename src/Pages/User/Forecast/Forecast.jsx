import { Box } from "@mui/material";
import ButtonGroup from "../../../Components/Buttons/TopBarControls";
import DynamicModal from "../../../Components/Modals/ExploreModal";
import { useContext, useEffect, useState } from "react";
import { FilterContext } from "../../../Contexts/FilterContext";
import ForecastAccuracy from "./ForecastAccuracy";
import LaborModal from "./LaborModal";
import SalesForecast from "./SalesForecast";
import AccessDeniedCard from "../../../Components/Cards/ErrorCard/AccessDeniedCard";

const Forecast = ({ userToken }) => {
  const [visible, setVisible] = useState(false);
  const { filters } = useContext(FilterContext);
  console.log("filtersfilters", filters);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState("Explore");

  //   useEffect(() => {
  //     const fetchForecastData = async () => {
  //       try {
  //         const data = await getForecastDetailsData(userToken);
  //         console.log(
  //           "getForecastDetailsDatagetForecastDetailsData------",
  //           data
  //         );
  //       } catch (err) {
  //         console.error("Error fetching Shipday data:", err);
  //       }
  //     };

  //     fetchForecastData();
  //   }, [userToken]);

  const openSalesForecastModal = () => {
    // setModalTitle("Forecast Details");
    setModalContent(<SalesForecast showExploreButton={false} />);
    setVisible(true);
  };
  const openLaborModal = () => {
    // setModalTitle("Forecast Details");
    setModalContent(<LaborModal showExploreButton={false} />);
    setVisible(true);
  };
  const openForecastAccuracyModal = () => {
    // setModalTitle("Forecast Details");
    setModalContent(<ForecastAccuracy showExploreButton={false} />);
    setVisible(true);
  };

  return (
    <>
      <Box p={1} mt={1}>
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
            <SalesForecast handleExplore={openSalesForecastModal} />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              //   px: 3,
              gap: 1,
              py: 1.5,
              //   borderBottom: "1px solid #e0e0e0",
              backgroundColor: "#fff",
            }}
          >
            <Box
              sx={{
                border: "1px solid #c2c0c0ff",
                borderRadius: "5px",
                padding: "10px",
                height: "auto",
                marginRight: "5px",
                width: "50%",
              }}
            >
              <LaborModal handleExplore={openLaborModal} />
            </Box>
            <Box
              sx={{
                border: "1px solid #c2c0c0ff",
                borderRadius: "5px",
                padding: "10px",
                height: "auto",
                marginRight: "5px",
                width: "50%",
              }}
            >
              <ForecastAccuracy handleExplore={openForecastAccuracyModal} />
            </Box>
          </Box>
          <AccessDeniedCard />
        </>
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

export default Forecast;
