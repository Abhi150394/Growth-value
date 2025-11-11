import React, { useContext, useState } from "react";
import ButtonGroup from "../../../Components/Buttons/TopBarControls";
import { Box, Stack } from "@mui/material";
import AccessDeniedCard from "../../../Components/Cards/ErrorCard/AccessDeniedCard";
import DynamicModal from "../../../Components/Modals/ExploreModal";
import { FilterContext } from "../../../Contexts/FilterContext";
import MenuSalesvsLastWeek from "./MenuSalesvsLastWeek";
import ItemSalesbyEmployee from "./ItemSalesbyEmployee";
import SalesByDayAndHour from "../Finance/Phase1Reports/SalesByDayAndHour";
import Column from "antd/es/table/Column";
import InventorySummary from "./InventorySummary";
import WastagebyItem from "./WastagebyItem";

const OpsManager = () => {
  const [visible, setVisible] = useState(false);
  const { filters } = useContext(FilterContext);
  console.log("filtersfilters", filters);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState("Explore");

  const openMenuSalesvsLastWeekModal = () => {
    // setModalTitle("Forecast Details");
    setModalContent(<MenuSalesvsLastWeek showExploreButton={false} />);
    setVisible(true);
  };

  const openItemSalesbyEmployeeModal = () => {
    // setModalTitle("Forecast Details");
    setModalContent(<ItemSalesbyEmployee showExploreButton={false} />);
    setVisible(true);
  };
  const openSalesByDayAndHourModal = () => {
    // setModalTitle("Forecast Details");
    setModalContent(<InventorySummary showExploreButton={false} />);
    setVisible(true);
  };
  const openWastagebyItemModal= () => {
    // setModalTitle("Forecast Details");
    setModalContent(<WastagebyItem showExploreButton={false} />);
    setVisible(true);
  };
  const buttonData = [
    { id: 0, title: "Overview", type: "overview", phase: 1 },
    { id: 1, title: "By Employee", type: "by_employee", phase: 2 },
  ];

  return (
    <Box p={1} mt={1}>
      <Box mb={1}>
        <ButtonGroup buttons={buttonData} />
      </Box>

      {filters?.topBarSelectedSection?.id === 0 && (
        <Box>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 2 }}
          >
            <AccessDeniedCard />
            <AccessDeniedCard />
          </Stack>
          <Box mt={2}>
            <MenuSalesvsLastWeek handleExplore={openMenuSalesvsLastWeekModal} />
          </Box>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 2 }}
            mt={2}
          >
            <Box mt={2} width={"50%"}>
              <InventorySummary handleExplore={openSalesByDayAndHourModal} />
            </Box>
            <Box mt={2} width={"50%"}>
              <InventorySummary handleExplore={openSalesByDayAndHourModal} />
            </Box>
          </Stack>
          <Box mt={2}>
            <MenuSalesvsLastWeek handleExplore={openMenuSalesvsLastWeekModal} />
          </Box>
          <Box>
            <WastagebyItem handleExplore={openWastagebyItemModal}/>
          </Box>
        </Box>
      )}

      {filters?.topBarSelectedSection?.id === 1 && (
        <Box>
          <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
            <Box mt={2} width={"50%"}>
              <ItemSalesbyEmployee
                handleExplore={openItemSalesbyEmployeeModal}
              />
            </Box>
            <Box mt={2} width={"50%"}>
              <InventorySummary handleExplore={openSalesByDayAndHourModal} />
            </Box>
          </Stack>
        </Box>
      )}

      <DynamicModal
        visible={visible}
        onClose={() => setVisible(false)}
        title={modalTitle}
        width="90vw"
        height="80vh"
      >
        {modalContent}
      </DynamicModal>
    </Box>
  );
};

export default OpsManager;
