import { Box, Typography, IconButton, Tooltip, Stack } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import DateRangeSelector from "../../../../Components/DateRange/DateRangeModalViewer";
import { MoreHoriz } from "@mui/icons-material";
import { useState } from "react";
import ControlMenuModal from "../../../../Components/Modals/ControlMenuModal";
import ManagerSectionDynamicTable from "../../../../Components/GridTables/ManagerSectionTable";
// import serviceData from "../../Components/GridTables/servicChargeDummyData";
import serviceData from "./VendorGratuity.js";
import DynamicDropdown from "../../../../Components/Dropdowns/Dropdown.jsx";

const GratuityByVendor = ({ showExploreButton = true, handleExplore }) => {
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
  const locationOptions = [
    { value: "boston", label: "Boston" },
    { value: "new_york", label: "New York" },
    { value: "chicago", label: "Chicago" },
    { value: "los_angeles", label: "Los Angeles" },
    { value: "seattle", label: "Seattle" },
    { value: "miami", label: "Miami" },
    { value: "san_francisco", label: "San Francisco" },
    { value: "denver", label: "Denver" },
  ];
  return (
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
              Gratuity by Vendor
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

      <Box>
        <Stack direction="row" spacing={0.5} width="100%">
          <DateRangeSelector size="small" />
          <DynamicDropdown
            options={locationOptions}
            placeholder="Location"
            size="small"
            width="45%"
          />
        </Stack>
      </Box>

      <Box
        className="ag-theme-quartz"
        style={{
          height: 700,
          //   width: "45%",
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
          subTitle="Period to date"
        />
      </Box>
    </Box>
  );
};

export default GratuityByVendor;
