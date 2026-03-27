import { Box, Typography, IconButton, Tooltip, Stack } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import DateRangeSelector from "../../../Components/DateRange/DateRangeModalViewer";
import { useState } from "react";
import ControlMenuModal from "../../../Components/Modals/ControlMenuModal";
import ManagerSectionDynamicTable from "../../../Components/GridTables/ManagerSectionTable";
const serviceData=[
  {
    "Location": "Boston",
    "Labour cost": "1045.92",
    "Sales": "2316.62",
    "CoL%": "45%"
  },
  {
    "Location": "Chicago",
    "Labour cost": "973.12",
    "Sales": "2075.48",
    "CoL%": "47%"
  },
  {
    "Location": "Dallas",
    "Labour cost": "1057.9",
    "Sales": "2066.26",
    "CoL%": "51%"
  },
  {
    "Location": "Houston",
    "Labour cost": "990.68",
    "Sales": "2125.24",
    "CoL%": "47%"
  },
  {
    "Location": "Los Angeles",
    "Labour cost": "1652.89",
    "Sales": "2882.11",
    "CoL%": "57%"
  },
  {
    "Location": "Nashville",
    "Labour cost": "863.16",
    "Sales": "1884.89",
    "CoL%": "46%"
  },
  {
    "Location": "New York",
    "Labour cost": "1290.51",
    "Sales": "3070.04",
    "CoL%": "42%"
  },
  {
    "Location": "Philadelphia",
    "Labour cost": "668.35",
    "Sales": "1822.92",
    "CoL%": "37%"
  },
  {
    "Location": "San Francisco",
    "Labour cost": "1208.64",
    "Sales": "2617.83",
    "CoL%": "46%"
  },
  {
    "Location": "Seattle",
    "Labour cost": "694.96",
    "Sales": "1126.43",
    "CoL%": "62%"
  }
]

const Test1 = ({ showExploreButton = true, handleExplore }) => {
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
    Location: "Location",
    full_name: "Employee Name",
    Sales: "Sales",
    "Service Charge": "Service Charge",
    "Service Charge %": "Service Charge %",
  };
  return (
    <>
      <Box >
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
                Test 1
              </Typography>
              <Tooltip title="Info">
                <InfoOutlinedIcon
                  sx={{ fontSize: 18, color: "text.secondary" }}
                />
              </Tooltip>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Week to date
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
         
        </Stack>
      </Box>

        <Box
          className="ag-theme-quartz"
          style={{
            height: 500,
            width: "100%",
            //   backgroundColor: "#f5f7fbff",
          }}
        >
          <ManagerSectionDynamicTable
            data={serviceData}
            columnMap={serviceColumnMap}
            tableHeight={400}
            enableFilter={false}
            enableSorting={true}
            enableResize={false}
          />
        </Box>
      </Box>
    </>
  );
};

export default Test1;
