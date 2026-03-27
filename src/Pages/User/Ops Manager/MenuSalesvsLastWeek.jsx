import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Stack,
  Grid,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import DateRangeSelector from "../../../Components/DateRange/DateRangeModalViewer";
import React, { useState } from "react";
import ControlMenuModal from "../../../Components/Modals/ControlMenuModal";
import LaborHoursComparisonChart from "../../../Components/Charts/LaborHoursComparisonChart";
import DynamicDropdown from "../../../Components/Dropdowns/Dropdown";
import {
  HourglassBottomOutlined,
  LocationOnOutlined,
} from "@mui/icons-material";

const sampleData2 = [
  {
    child_cat_name: "Cold Drinks",
    Sales: "3052.8",
    "Previous Sales": "3631.6",
  },
  {
    child_cat_name: "Hot Drinks",
    Sales: "4797.86",
    "Previous Sales": "5811.46",
  },
  {
    child_cat_name: "Not Available",
    Sales: "-261.75",
    "Previous Sales": "-307.77",
  },
  {
    child_cat_name: "Salad",
    Sales: "10811.95",
    "Previous Sales": "13981.25",
  },
  {
    child_cat_name: "Sandwiches",
    Sales: "11133.1",
    "Previous Sales": "13457.4",
  },
  {
    child_cat_name: "Snacks",
    Sales: "2531.38",
    "Previous Sales": "3139.04",
  },
];
const MenuSalesvsLastWeek = ({ showExploreButton = true, handleExplore }) => {
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

  const locationOptions = [
    { value: "boston", label: "Boston" },
    { value: "chicago", label: "Chicago" },
    { value: "new_york", label: "New York" },
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
        width: "100%",
        height: { xs: "auto", sm: "auto" },
        borderRadius: 3,
        padding: 2,
        border: "1px solid #c2c0c0ff",
        // borderColor: "divider",
        backgroundColor: "#fff",
      }}
    >
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
                Menu Sales vs Last Week
              </Typography>
              <Tooltip title="Info">
                <InfoOutlinedIcon
                  sx={{ fontSize: 18, color: "text.secondary" }}
                />
              </Tooltip>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Week to date vs. Last week to date
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
          {/* <Stack direction={{ xs: "column", sm: "column" }} spacing={0.5} width="100%">
            <Typography variant="caption" gutterBottom ml={5}>
                Sales
            </Typography>
            <DateRangeSelector size={showExploreButton?"small":null} />
              
          </Stack> */}
          <Box sx={{ width: "100%" }}>
            <Grid container spacing={2}>
              {/* Left: Sales */}
              <Grid item xs={12} md={6}>
                <Stack spacing={0.75} sx={{ width: "100%" }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", display: "block" }}
                  >
                    Sales
                  </Typography>

                  <DateRangeSelector
                    size={showExploreButton ? "small" : undefined}
                  />

                  <DynamicDropdown
                    icon={LocationOnOutlined}
                    options={locationOptions}
                    placeholder="Location"
                    width="84%"
                    isClearable
                    size="small"
                  />
                </Stack>
              </Grid>

              {/* Right: Previous Sales Compare */}
              <Grid item xs={12} md={6}>
                <Stack spacing={0.75} sx={{ width: "100%" }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", display: "block" }}
                  >
                    Previous Sales Compare
                  </Typography>

                  <DateRangeSelector size="small" compare />

                  <DynamicDropdown
                    icon={HourglassBottomOutlined}
                    options={dayOptions}
                    placeholder="Day of week"
                    width="84%"
                    isClearable
                    size="small"
                  />
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>

      <Box>
        <LaborHoursComparisonChart
          data={sampleData2}
          seriesLabels={{
            Sales: "Sales-Week to date",
            "Previous Sales": "Previous Sales - Last week to date",
          }}
        />
      </Box>
    </Box>
  );
};

export default MenuSalesvsLastWeek;
