import { Box, Typography, IconButton, Tooltip, Stack } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import DateRangeSelector from "../../../Components/DateRange/DateRangeModalViewer";
import { MoreHoriz } from "@mui/icons-material";
import { useState } from "react";
import ControlMenuModal from "../../../Components/Modals/ControlMenuModal";
import ManagerSectionDynamicTable from "../../../Components/GridTables/ManagerSectionTable";
// import serviceData from "../../Components/GridTables/servicChargeDummyData";
import serviceData from "../../../Components/GridTables/servicChargeDummyData";

const Phase1Report = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (action) => {
    console.log("Menu action clicked:", action);
    // Add your logic here for download, print, etc.
  };

  const serviceColumnMap = {
    location_name: "Location",
    full_name: "Employee Name",
    Sales: "Sales",
    "Service Charge": "Service Charge",
    "Service Charge %": "Service Charge %",
  };
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          //   px: 3,
          py: 1.5,
          //   borderBottom: "1px solid #e0e0e0",
          backgroundColor: "#fff",
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Phase 1 v7
            </Typography>
            <Tooltip title="Info">
              <InfoOutlinedIcon
                sx={{ fontSize: 18, color: "text.secondary" }}
              />
            </Tooltip>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Period to date
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              color: "#f57c00",
            }}
          >
            <SearchIcon sx={{ fontSize: 20, mr: 0.5 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Explore
            </Typography>
          </Box>
          <IconButton>
            <NotificationsNoneOutlinedIcon />
          </IconButton>
          {/* <IconButton>
            <MoreVertOutlinedIcon />
          </IconButton> */}
          <Box>
            <IconButton onClick={handleMenuOpen}>
              <MoreVertOutlinedIcon />
            </IconButton>

            <ControlMenuModal
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              onAction={handleMenuAction}
              contentId="print-section"
            />
          </Box>
        </Box>
      </Box>

      <Box>
        <Stack direction="row" spacing={0.5} width="100%">
          <DateRangeSelector />
          {/* {filters?.topBarSelectedSection?.id === 1 ? (
            <DynamicDropdown
              icon={HourglassBottomOutlined}
              options={timePeriod}
            />
          ) : null} */}
        </Stack>
      </Box>

      <Box
        className="ag-theme-quartz"
        style={{
          height: 700,
          width: "100%",
          //   backgroundColor: "#f5f7fbff",
        }}
      >
        <ManagerSectionDynamicTable
          data={serviceData}
          columnMap={serviceColumnMap}
          tableHeight={600}
          enableFilter={false}
          enableSorting={true}
          enableResize={false}
        />
      </Box>
    </Box>
  );
};

export default Phase1Report;
