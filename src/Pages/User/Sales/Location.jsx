import React, { useContext, useRef, useState } from "react";
import ButtonGroup from "../../../Components/Buttons/TopBarControls";
import { FilterContext } from "../../../Contexts/FilterContext";
import DateRangeSelector from "../../../Components/DateRange/DateRangeModalViewer";
import DynamicDropdown from "../../../Components/Dropdowns/Dropdown";
import AutoCompleteDropdown from "../../../Components/Dropdowns/AutoCompleteDropdown";
import InfoTooltip from "../../../Components/Tooltip/InfoTooltip";
import ToggleViewButton from "../../../Components/Buttons/SwitchToCT";
import ToggleSwitchButton from "../../../Components/Buttons/Toggle2ndAxis";
import PrintAndCSV from "../../../Components/Buttons/PrintAndDownloadCSV";
import { Box, Stack } from "@mui/material";
import { FaUser, FaCog, FaChartLine, FaMapMarkedAlt } from "react-icons/fa";
import SearchBar from "../../../Components/Buttons/SearchBar";
import ChartDataGroupedTable from "../../../Components/GridTables/ChartDataTable";
import chartData from "./DummyData.js";
import { HourglassBottomOutlined } from "@mui/icons-material";
import DynamicCategoryChart from "../../../Components/Charts/DynamicChart.jsx";
import SalesTransactionsTable from "./SalesSnapshotTable.jsx";

const options = [
  { value: "profile", label: "Profile", icon: FaUser },
  { value: "settings", label: "Settings", icon: FaCog },
  { value: "analytics", label: "Analytics", icon: FaChartLine },
];

const Location = () => {
    const tablePrintRef = useRef();
  const { filters } = useContext(FilterContext);
  const [selectedAreas, setSelectedAreas] = useState(null);
    const handlePrint = () => {
    // Call child function when button is clicked
    tablePrintRef.current?.handlePrint();
  };
  console.log("filtersfilters", filters);
  const buttonData = [
    { id: 0, title: "Snapshot", type: "snapshot", phase: 1 },
    { id: 1, title: "Trends", type: "trends", phase: 2 },
  ];
  const areaOptions = [
    { value: "north", label: "North" },
    { value: "south", label: "South" },
    { value: "east", label: "East" },
    { value: "west", label: "West" },
  ];
  const timePeriod = [
    { value: "auto", label: "Auto" },
    { value: "day", label: "Day" },
    { value: "month", label: "Month" },
    { value: "week", label: "Week" },
  ];
  const data = [
    { name: "John Doe", email: "john@example.com", age: 28 },
    { name: "Jane Smith", email: "jane@example.com", age: 32 },
  ];

  const [region, setRegion] = useState("overall");
  const valueFields = ["guest_total", "count"]; // fields to show
  const labelFields = ["Sales, $", "Transactions"];
  let dummyText = `Lorem ipsum, dolor sit amet consectetur...`;

  const handleButtonClick = (btn) => {
    if (btn.type === "report")
      alert(`Opening ${btn.title} for Phase ${btn.phase}`);
  };

  return (
    <Box p={1} mt={1}>
      <Box mb={1}>
        <ButtonGroup buttons={buttonData} onButtonClick={handleButtonClick} />
      </Box>
      <Box>
        <Stack direction="row" spacing={0.5} width="100%">
          <DateRangeSelector />

          <DynamicDropdown
            title="Area"
            icon={FaMapMarkedAlt}
            options={areaOptions}
          />
          {filters?.topBarSelectedSection?.id === 1 ? (
            <DynamicDropdown
              icon={HourglassBottomOutlined}
              options={timePeriod}
            />
          ) : null}
        </Stack>

        {filters?.topBarSelectedSection?.id === 1 ? (
          <Box my={1} zIndex={100}>
            <AutoCompleteDropdown
              showLogoTitle
              logo="https://cdn-icons-png.flaticon.com/512/25/25694.png"
              title="Areas"
              options={[
                // { value: "north", label: "North" },
                { value: "south", label: "South" },
                { value: "east", label: "East" },
                { value: "west", label: "West" },
              ]}
              onChange={(vals) => setSelectedAreas(vals)}
              width="100%"
            />
          </Box>
        ) : null}

        <Stack
          direction={{ xs: "column", md: "column", lg: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          marginTop={4}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            width={{ xs: "100%", lg: "70%" }}
            flexWrap="wrap"
          >
            <InfoTooltip text={dummyText} />
            {filters?.topBarSelectedSection?.id === 1 ? (
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
              >
                <ToggleViewButton />
                {!filters?.switchToChart ? <ToggleSwitchButton /> : null}
              </Stack>
            ) : null}
            <PrintAndCSV data={data} actions={["print"]} />
<button onClick={handlePrint}>Call Child Function</button>

            {!filters?.switchToChart ? null : (
              <PrintAndCSV
                data={[chartData.detail]}
                contentId="print-section"
                actions={["csv"]}
              />
            )}

            {filters?.switchToChart &&
            filters?.topBarSelectedSection?.id === 1 ? (
              <SearchBar placeholder="Search" debounceTime={300} width={200} />
            ) : null}
            {filters?.topBarSelectedSection?.id === 0 && (
              <SearchBar placeholder="Search" debounceTime={300} width={200} />
            )}
          </Stack>

          <Box width={{ xs: "100%", lg: "30%" }}>
            <DynamicDropdown
              options={options}
              onChange={(opt) => console.log("Selected:", opt)}
              width="100%"
            />
          </Box>
        </Stack>
      </Box>
      <Box>
        <Box
          style={{
            width: "100%",
            marginTop: "10px",
          }}
        >
          {filters?.topBarSelectedSection?.id === 1 ? (
            filters?.switchToChart ? (
              <Box id="grid-section">
                <ChartDataGroupedTable
                  data={chartData}
                  categories={
                    selectedAreas?.length > 0
                      ? selectedAreas?.map((el) => el.value)
                      : ["all"]
                  }
                />
              </Box>
            ) : (
              <Box id="chart-section">
                <DynamicCategoryChart
                  data={chartData}
                  height={500}
                  showBar={filters?.chart2ndAxis}
                  categories={
                    selectedAreas?.length > 0
                      ? selectedAreas?.map((el) => el.value)
                      : ["all"]
                  }
                />
              </Box>
            )
          ) : (
            <Box>
              <SalesTransactionsTable
              ref={tablePrintRef} 
                data={chartData}
                defaultRegion={region}
                valueFields={valueFields}
                labelFields={labelFields}
                COLORS={{ green: "#2ecc71", red: "#e74c3c" }}
                searchText={
                  filters?.searchedValue.length > 0
                    ? filters?.searchedValue
                    : null
                }
                sectionName="Location"
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Location;
