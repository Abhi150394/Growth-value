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
import React, { useState } from "react";
import ControlMenuModal from "../../../Components/Modals/ControlMenuModal";
import DynamicDropdown from "../../../Components/Dropdowns/Dropdown";
import DateRangeSelector from "../../../Components/DateRange/DateRangeModalViewer";
import {
  HourglassBottomOutlined,
  LocationOnOutlined,
} from "@mui/icons-material";
import DynamicSalesTransactionsTable from "../../../Components/GridTables/NestedDynamicGrid";
import DrilldownBeautifulGrid from "../../../Components/GridTables/NestedDropdownDynamicGrid";

const WastagebyItem2 = ({ showExploreButton = true, handleExplore }) => {
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
        mt: 2,
        height: { xs: "auto", sm: "auto" },
        borderRadius: "10px",
        padding: 2,
        border: "1px solid #c2c0c0ff",
        backgroundColor: "#fff",
      }}
    >
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
              Wastage by Item
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
        <Box sx={{ width: "100%" }}>
          <Grid container spacing={2}>
            {/* Left: Sales */}
            <Grid item xs={12} md={6}>
              <Stack spacing={0.75} sx={{ width: "100%" }}>
                <DateRangeSelector
                  size={showExploreButton ? "small" : undefined}
                />

                <DynamicDropdown
                  icon={LocationOnOutlined}
                  options={locationOptions}
                  placeholder="Location"
                  width="100%"
                  isClearable
                  size="small"
                />
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={0.75} sx={{ width: "100%" }}>
                <DynamicDropdown
                  icon={HourglassBottomOutlined}
                  options={dayOptions}
                  placeholder="Day of week"
                  width="100%"
                  isClearable
                  size="small"
                />
                <DynamicDropdown
                  icon={HourglassBottomOutlined}
                  options={dayOptions}
                  placeholder="Day of week"
                  width="100%"
                  isClearable
                  size="small"
                />
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Box mt={1}>
        <DrilldownBeautifulGrid
          data={[
            {
              location: "Boston",
              payments: 6164,
              details: [
                { date: "09/29/2025", tender: "Card1", payments: 918 },
                { date: "09/29/2025", tender: "Cash2", payments: 74 },
                { date: "09/29/2025", tender: "Deliveroo2", payments: 251 },
                { date: "09/30/2025", tender: "Card3", payments: 1263 },
                { date: "09/30/2025", tender: "Cash43", payments: 86 },
                { date: "09/29/2025", tender: "Ca35rd", payments: 918 },
                { date: "09/29/2025", tender: "Cas35h", payments: 74 },
                { date: "09/29/2025", tender: "Deli34veroo", payments: 251 },
                { date: "09/30/2025", tender: "Car24d", payments: 1263 },
                { date: "09/30/2025", tender: "Ca24sh", payments: 86 },
                { date: "09/29/2025", tender: "C24ard", payments: 918 },
                { date: "09/29/2025", tender: "Ca42sh", payments: 74 },
                { date: "09/29/2025", tender: "Deli45veroo", payments: 251 },
                { date: "09/30/2025", tender: "Card64", payments: 1263 },
                { date: "09/30/2025", tender: "Cash", payments: 86 },
              ],
            },
            {
              location: "Chicago",
              payments: 5281,
              details: [
                { date: "09/29/2025", tender: "Card", payments: 650 },
                { date: "09/30/2025", tender: "Cash", payments: 300 },
              ],
            },
            {
              location: "New York",
              payments: 8241,
              details: [
                { date: "09/29/2025", tender: "Card", payments: 650 },
                { date: "09/30/2025", tender: "Cash", payments: 300 },
              ],
            },
            {
              location: "Boston1",
              payments: 6164,
              details: [
                { date: "09/29/2025", tender: "Card", payments: 918 },
                { date: "09/29/2025", tender: "Cash", payments: 74 },
                { date: "09/29/2025", tender: "Deliveroo", payments: 251 },
                { date: "09/30/2025", tender: "Card", payments: 1263 },
                { date: "09/30/2025", tender: "Cash", payments: 86 },
              ],
            },
            {
              location: "Chicago1",
              payments: 5281,
              details: [
                { date: "09/29/2025", tender: "Card", payments: 650 },
                { date: "09/30/2025", tender: "Cash", payments: 300 },
              ],
            },
            {
              location: "New York1",
              payments: 8241,
              details: [
                { date: "09/29/2025", tender: "Card", payments: 650 },
                { date: "09/30/2025", tender: "Cash", payments: 300 },
              ],
            },
            {
              location: "Boston2",
              payments: 6164,
              details: [
                { date: "09/29/2025", tender: "Card", payments: 918 },
                { date: "09/29/2025", tender: "Cash", payments: 74 },
                { date: "09/29/2025", tender: "Deliveroo", payments: 251 },
                { date: "09/30/2025", tender: "Card", payments: 1263 },
                { date: "09/30/2025", tender: "Cash", payments: 86 },
              ],
            },
            {
              location: "Chicago2",
              payments: 5281,
              details: [
                { date: "09/29/2025", tender: "Card", payments: 650 },
                { date: "09/30/2025", tender: "Cash", payments: 300 },
              ],
            },
            {
              location: "New York2",
              payments: 8241,
              details: [
                { date: "09/29/2025", tender: "Card", payments: 650 },
                { date: "09/30/2025", tender: "Cash", payments: 300 },
              ],
            },
          ]}
        />
      </Box>
    </Box>
  );
};

export default WastagebyItem2;
