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
import serviceData from "../Finance/Phase1Reports/DayAndHour.js";
import DynamicDropdown from "../../../Components/Dropdowns/Dropdown.jsx";

const InventorySummary = ({ showExploreButton = true, handleExplore }) => {
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
    date_of_business: "Date",
    Sales: "Sales",
    "Service Charge": "Service Charge",
    "Service Charge %": "Service Charge %",
  };
  const timePeriod = [
    { value: "hour-1", label: "1" },
    { value: "hour-2", label: "2" },
    { value: "hour-3", label: "3" },
    { value: "hour-4", label: "4" },
    { value: "hour-5", label: "5" },
    { value: "hour-6", label: "6" },
    { value: "hour-7", label: "7" },
    { value: "hour-8", label: "8" },
  ];
  const mealOptions = [
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
  ];
  const dayOptions = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ];
  return (
    <Box
      sx={{
        border: "1px solid #c2c0c0ff",
        borderRadius: "5px",
        padding: "10px",
        height: "auto",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          //   px: 3,
          //   width:"45%",
          py: 1.5,
          //   borderBottom: "1px solid #e0e0e0",
          backgroundColor: "#fff",
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Sales By Day & Hour
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
          {showExploreButton && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                color: "#f57c00",
              }}
              onClick={handleExplore}
            >
              <SearchIcon sx={{ fontSize: 20, mr: 0.5 }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Explore
              </Typography>
            </Box>
          )}
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

      <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
        <Stack direction="row" spacing={0.5} width="100%">
          <DateRangeSelector size="small" />
          <DynamicDropdown
            size="small"
            placeholder="Hour"
            options={timePeriod}
            width="50%"
          />
        </Stack>
        <Stack direction="row" spacing={0.5} width="100%">
          <DynamicDropdown
            size="small"
            placeholder="Day Part"
            options={mealOptions}
            width="50%"
          />

          <DynamicDropdown
            size="small"
            placeholder="Day of Week"
            options={dayOptions}
            width="50%"
          />
        </Stack>
      </Box>

      <Box
        className="ag-theme-quartz"
        style={{
          height: 387,
          //   width: "45%",
          //   backgroundColor: "#f5f7fbff",
        }}
      >
        <ManagerSectionDynamicTable
          data={serviceData}
          columnMap={serviceColumnMap}
          tableHeight={300}
          enableFilter={false}
          enableSorting={true}
          enableResize={false}
          subTitle="Period to date"
        />
      </Box>
    </Box>
  );
};

export default InventorySummary;
