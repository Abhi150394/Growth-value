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
import DynamicProductPerformanceChart from "../../../Components/Charts/BarChart";

const sampleData2 = [
  {
    full_name: "Allen Cruz",
    Quantity: "523.0",
  },
  {
    full_name: "Archie Hughes",
    Quantity: "256.0",
  },
  {
    full_name: "Chester Myers",
    Quantity: "190.0",
  },
  {
    full_name: "Jessie Morales",
    Quantity: "85.0",
  },
  {
    full_name: "Philip Reyes",
    Quantity: "481.0",
  },
  {
    full_name: "Raymond Foster",
    Quantity: "60.0",
  },
  {
    full_name: "Rufus Sanders",
    Quantity: "316.0",
  },
  {
    full_name: "Stephen Price",
    Quantity: "526.0",
  },
  {
    full_name: "Warren Ross",
    Quantity: "41.0",
  },
  {
    full_name: "Willis Long",
    Quantity: "539.0",
  },
  {
    full_name: "Alexander Diaz",
    Quantity: "51.0",
  },
  {
    full_name: "Edgar Rogers",
    Quantity: "457.0",
  },
  {
    full_name: "Guy Gomez",
    Quantity: "166.0",
  },
  {
    full_name: "Hugh Ward",
    Quantity: "47.0",
  },
  {
    full_name: "Ira Bailey",
    Quantity: "381.0",
  },
  {
    full_name: "Isaac Morgan",
    Quantity: "479.0",
  },
  {
    full_name: "Lawrence Reed",
    Quantity: "386.0",
  },
  {
    full_name: "Luther Cooper",
    Quantity: "263.0",
  },
  {
    full_name: "Oliver Kelly",
    Quantity: "164.0",
  },
  {
    full_name: "Otto Peterson",
    Quantity: "292.0",
  },
  {
    full_name: "Patrick Bell",
    Quantity: "378.0",
  },
  {
    full_name: "Theodore Howard",
    Quantity: "42.0",
  },
  {
    full_name: "Adam Murray",
    Quantity: "237.0",
  },
  {
    full_name: "Alvin Alvarez",
    Quantity: "61.0",
  },
  {
    full_name: "Fredrick Owens",
    Quantity: "228.0",
  },
  {
    full_name: "Gilbert Mendoza",
    Quantity: "53.0",
  },
  {
    full_name: "Jay Mcdonald",
    Quantity: "366.0",
  },
  {
    full_name: "Jess Harrison",
    Quantity: "242.0",
  },
  {
    full_name: "Lester Ellis",
    Quantity: "462.0",
  },
  {
    full_name: "Lloyd Ford",
    Quantity: "302.0",
  },
  {
    full_name: "Mack Marshall",
    Quantity: "317.0",
  },
  {
    full_name: "Melvin Ruiz",
    Quantity: "30.0",
  },
  {
    full_name: "Noah Kennedy",
    Quantity: "75.0",
  },
  {
    full_name: "Winfield Stevens",
    Quantity: "383.0",
  },
  {
    full_name: "Amos Jordan",
    Quantity: "323.0",
  },
  {
    full_name: "Anthony Simmons",
    Quantity: "502.0",
  },
  {
    full_name: "Clifford Hamilton",
    Quantity: "233.0",
  },
  {
    full_name: "Dave Coleman",
    Quantity: "514.0",
  },
  {
    full_name: "Dennis Reynolds",
    Quantity: "288.0",
  },
  {
    full_name: "Eddie Patterson",
    Quantity: "351.0",
  },
  {
    full_name: "Garfield Alexander",
    Quantity: "72.0",
  },
  {
    full_name: "Leroy Graham",
    Quantity: "89.0",
  },
  {
    full_name: "Perry Henderson",
    Quantity: "505.0",
  },
  {
    full_name: "Wesley Kim",
    Quantity: "85.0",
  },
  {
    full_name: "Alfred King",
    Quantity: "70.0",
  },
  {
    full_name: "Andrew Harris",
    Quantity: "277.0",
  },
  {
    full_name: "Benjamin Allen",
    Quantity: "283.0",
  },
  {
    full_name: "Charlie Lopez",
    Quantity: "394.0",
  },
  {
    full_name: "Clarence Lee",
    Quantity: "402.0",
  },
  {
    full_name: "Daniel Clark",
    Quantity: "132.0",
  },
  {
    full_name: "Ernest Lewis",
    Quantity: "170.0",
  },
  {
    full_name: "Frederick Sanchez",
    Quantity: "249.0",
  },
  {
    full_name: "Herbert Baker",
    Quantity: "29.0",
  },
  {
    full_name: "Jesse Walker",
    Quantity: "313.0",
  },
  {
    full_name: "Lewis Hall",
    Quantity: "379.0",
  },
  {
    full_name: "Oscar Perez",
    Quantity: "252.0",
  },
  {
    full_name: "Peter Young",
    Quantity: "272.0",
  },
  {
    full_name: "Richard Gonzalez",
    Quantity: "182.0",
  },
  {
    full_name: "Roy Green",
    Quantity: "82.0",
  },
  {
    full_name: "Sam Scott",
    Quantity: "115.0",
  },
  {
    full_name: "Willie Wright",
    Quantity: "283.0",
  },
  {
    full_name: "Will Robinson",
    Quantity: "132.0",
  },
  {
    full_name: "Adolph Simpson",
    Quantity: "275.0",
  },
  {
    full_name: "Christopher Burns",
    Quantity: "444.0",
  },
  {
    full_name: "Cornelius Jimenez",
    Quantity: "283.0",
  },
  {
    full_name: "Felix Porter",
    Quantity: "210.0",
  },
  {
    full_name: "Jake Henry",
    Quantity: "374.0",
  },
  {
    full_name: "Maurice Crawford",
    Quantity: "431.0",
  },
  {
    full_name: "Mike Vasquez",
    Quantity: "230.0",
  },
  {
    full_name: "Percy Snyder",
    Quantity: "138.0",
  },
  {
    full_name: "Reuben Mason",
    Quantity: "155.0",
  },
  {
    full_name: "Wallace Shaw",
    Quantity: "165.0",
  },
  {
    full_name: "Albert Moore",
    Quantity: "71.0",
  },
  {
    full_name: "Arthur Thomas",
    Quantity: "106.0",
  },
  {
    full_name: "Charles Brown",
    Quantity: "413.0",
  },
  {
    full_name: "David Jackson",
    Quantity: "57.0",
  },
  {
    full_name: "Edward Martinez",
    Quantity: "208.0",
  },
  {
    full_name: "Frank Miller",
    Quantity: "283.0",
  },
  {
    full_name: "Fred Hernandez",
    Quantity: "43.0",
  },
  {
    full_name: "George Jones",
    Quantity: "345.0",
  },
  {
    full_name: "Harry Anderson",
    Quantity: "164.0",
  },
  {
    full_name: "Henry Rodriguez",
    Quantity: "385.0",
  },
  {
    full_name: "James Williams",
    Quantity: "503.0",
  },
  {
    full_name: "Joe White",
    Quantity: "65.0",
  },
  {
    full_name: "John Smith",
    Quantity: "510.0",
  },
  {
    full_name: "Joseph Davis",
    Quantity: "392.0",
  },
  {
    full_name: "Robert Wilson",
    Quantity: "235.0",
  },
  {
    full_name: "Thomas Garcia",
    Quantity: "289.0",
  },
  {
    full_name: "Walter Taylor",
    Quantity: "102.0",
  },
  {
    full_name: "William Johnson",
    Quantity: "484.0",
  },
  {
    full_name: "Abraham Meyer",
    Quantity: "464.0",
  },
  {
    full_name: "Clinton Mills",
    Quantity: "343.0",
  },
  {
    full_name: "Elbert Warren",
    Quantity: "159.0",
  },
  {
    full_name: "Jose Holmes",
    Quantity: "558.0",
  },
  {
    full_name: "Leslie Fox",
    Quantity: "151.0",
  },
  {
    full_name: "Marshall Rose",
    Quantity: "68.0",
  },
  {
    full_name: "Virgil Boyd",
    Quantity: "164.0",
  },
  {
    full_name: "Wilbur Stone",
    Quantity: "528.0",
  },
  {
    full_name: "Bert Phillips",
    Quantity: "296.0",
  },
  {
    full_name: "Carl Ramirez",
    Quantity: "320.0",
  },
  {
    full_name: "Earl Collins",
    Quantity: "58.0",
  },
  {
    full_name: "Ed Flores",
    Quantity: "81.0",
  },
  {
    full_name: "Elmer Hill",
    Quantity: "454.0",
  },
  {
    full_name: "Eugene Edwards",
    Quantity: "81.0",
  },
  {
    full_name: "Francis Torres",
    Quantity: "332.0",
  },
  {
    full_name: "Harvey Parker",
    Quantity: "130.0",
  },
  {
    full_name: "Herman Evans",
    Quantity: "344.0",
  },
  {
    full_name: "Howard Mitchell",
    Quantity: "251.0",
  },
  {
    full_name: "Jim Turner",
    Quantity: "259.0",
  },
  {
    full_name: "Lee Campbell",
    Quantity: "299.0",
  },
  {
    full_name: "Martin Roberts",
    Quantity: "241.0",
  },
  {
    full_name: "Michael Carter",
    Quantity: "342.0",
  },
  {
    full_name: "Curtis Pierce",
    Quantity: "307.0",
  },
  {
    full_name: "Edmund Arnold",
    Quantity: "104.0",
  },
  {
    full_name: "Harley Stephens",
    Quantity: "202.0",
  },
  {
    full_name: "Jeff Tran",
    Quantity: "100.0",
  },
  {
    full_name: "Marvin Kelley",
    Quantity: "234.0",
  },
  {
    full_name: "Newton Gardner",
    Quantity: "167.0",
  },
  {
    full_name: "Ross Dunn",
    Quantity: "247.0",
  },
  {
    full_name: "Timothy Payne",
    Quantity: "223.0",
  },
  {
    full_name: "Alex Sullivan",
    Quantity: "0.0",
  },
  {
    full_name: "Clyde Cox",
    Quantity: "0.0",
  },
  {
    full_name: "Aaron Wells",
    Quantity: "0.0",
  },
  {
    full_name: "Elijah Castillo",
    Quantity: "0.0",
  },
  {
    full_name: "Norman Woods",
    Quantity: "0.0",
  },
  {
    full_name: "Victor Olson",
    Quantity: "0.0",
  },
  {
    full_name: "Alonzo Gonzales",
    Quantity: "0.0",
  },
  {
    full_name: "Franklin Ramos",
    Quantity: "0.0",
  },
  {
    full_name: "Leon Griffin",
    Quantity: "0.0",
  },
  {
    full_name: "Jacob Adams",
    Quantity: "0.0",
  },
  {
    full_name: "Tom Nelson",
    Quantity: "0.0",
  },
  {
    full_name: "Claud Gordon",
    Quantity: "0.0",
  },
  {
    full_name: "Earnest Romero",
    Quantity: "0.0",
  },
  {
    full_name: "Roscoe Wagner",
    Quantity: "0.0",
  },
  {
    full_name: "Sylvester Hunter",
    Quantity: "0.0",
  },
  {
    full_name: "Samuel Martin",
    Quantity: "0.0",
  },
  {
    full_name: "Ralph Stewart",
    Quantity: "0.0",
  },
];
const ItemSalesbyEmployee = ({ showExploreButton = true, handleExplore,handleNewPageModal }) => {
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
        borderRadius: "5px",
        padding: 2,
        border: "1px solid #c2c0c0ff",
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
            <IconButton onClick={handleNewPageModal}>
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
      </Box>

      <Box>
        <DynamicProductPerformanceChart
          data={sampleData2}
          labelKey="full_name"
          yKeys={["Quantity"]}
          xAxisLabel="Employee Name"
          yAxisLabel="Total Quantity Sold"
          showBar
          height={350}
        />
      </Box>
    </Box>
  );
};

export default ItemSalesbyEmployee;
