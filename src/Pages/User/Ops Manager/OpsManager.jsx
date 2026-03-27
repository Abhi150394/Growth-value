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
import SalesFigureCard from "../../../Components/Cards/SalesCard/SalesFigureDynamicCard";
import WastagebyItem2 from "./WastageByItem2";
import { openInNewWindowModal } from "../../../Components/Modals/NewPageComponentModal";
import { useNavigate } from "react-router-dom";
import { registerDynamicRouteByName } from "../../../Utils/dynamicRouteService";

const OpsManager = () => {
  const [visible, setVisible] = useState(false);
  const { filters } = useContext(FilterContext);
  console.log("filtersfilters", filters);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState("Explore");

  const navigate = useNavigate();

  const openAsPage = (Component, props) => {
    const id = registerDynamicRouteByName(Component, props);
    // navigate to the dynamic route (updates URL)
    navigate(`/modal/${id}`);
  };

  //
  const handleOpenInNewTab = (Component, props) => {
    const id = registerDynamicRouteByName(Component, props);
    const url = `${window.location.origin}/modal/${id}`;
    window.open(url, "_blank"); // ✅ opens new tab
  };

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
  const openWastagebyItemModal = () => {
    // setModalTitle("Forecast Details");
    setModalContent(<WastagebyItem showExploreButton={false} />);
    setVisible(true);
  };
  const openSalesFigureCardModal = () => {
    // setModalTitle("Forecast Details");
    setModalContent(
      <SalesFigureCard
        value={4548930}
        currency="$"
        changePercent={1}
        previousValue={4502535}
        showExploreButton={false}
      />
    );
    setVisible(true);
  };

  const openItemSalesbyEmployeeNewPageModal = () => {
    // openAsPage("ItemSalesbyEmployee", {
    //   handleExplore: openItemSalesbyEmployeeModal,
    //   handleNewPageModal: openItemSalesbyEmployeeNewPageModal,
    //   showExploreButton:false
    // });

    handleOpenInNewTab("ItemSalesbyEmployee", {
      handleExplore: openItemSalesbyEmployeeModal,
      handleNewPageModal: openItemSalesbyEmployeeNewPageModal,
    })
  };

  const openInventorySummaryNewPageModal = () => {
    // openAsPage("InventorySummary", {
    //   handleExplore: openSalesByDayAndHourModal,
    //   handleNewPageModal: openInventorySummaryNewPageModal,
    //   showExploreButton:false
    // });
    // handleOpenInNewTab(InventorySummary, {
    //   handleExplore: openItemSalesbyEmployeeModal,
    //   handleNewPageModal: openItemSalesbyEmployeeNewPageModal,
    // })
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
            <WastagebyItem handleExplore={openWastagebyItemModal} />
          </Box>

          <Box>
            <WastagebyItem2 handleExplore={openWastagebyItemModal} />
          </Box>
        </Box>
      )}

      {filters?.topBarSelectedSection?.id === 1 && (
        <Box>
          <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
            <Box mt={2} width={"50%"}>
              <ItemSalesbyEmployee
                handleExplore={openItemSalesbyEmployeeModal}
                handleNewPageModal={openItemSalesbyEmployeeNewPageModal}
              />
            </Box>
            <Box mt={2} width={"50%"}>
              <InventorySummary handleExplore={openSalesByDayAndHourModal}
                handleNewPageModal={openInventorySummaryNewPageModal}
               />
            </Box>
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
            <Box mt={2} width={"50%"}>
              <SalesFigureCard
                value={4548930}
                currency="$"
                changePercent={1}
                previousValue={4502535}
                handleExplore={openSalesFigureCardModal}
              />
            </Box>
            <Box mt={2} width={"50%"}>
              <SalesFigureCard
                title="Sales, WTD"
                value={12345.67}
                currency="₹"
                precision={2}
                changePercent={-2.3}
                previousValue={2535}
                size="md"
              />
            </Box>
          </Stack>
          <Box mt={2} width={"50%"}>
            <SalesFigureCard
              title="ATV"
              // mainTag="Main"
              // value={11.44}
              currency="$"
              precision={2}
              extraRows={[
                {
                  label: "ATV",
                  sublabel: "Last week",
                  value: 11.44,
                  currency: "$",
                  precision: 2,
                },
                {
                  label: "ATV",
                  sublabel: "2 weeks ago",
                  value: 11.59,
                  currency: "$",
                  precision: 2,
                },
                {
                  label: "WoW",
                  value: -1.2,
                  isPercent: true,
                  precision: 1,
                  color: "error.main",
                },
              ]}
              showExploreButton={true}
              handleExplore={() => console.log("open modal")}
            />
          </Box>
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
