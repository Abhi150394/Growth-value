import React, { useContext, useEffect, useState } from "react";
import ButtonGroup from "../../../Components/Buttons/TopBarControls.jsx";
import { FilterContext } from "../../../Contexts/FilterContext.js";
import DateRangeSelector from "../../../Components/DateRange/DateRangeModalViewer.jsx";
import DynamicDropdown from "../../../Components/Dropdowns/Dropdown.jsx";
import AutoCompleteDropdown from "../../../Components/Dropdowns/AutoCompleteDropdown.jsx";
import InfoTooltip from "../../../Components/Tooltip/InfoTooltip.jsx";
import ToggleViewButton from "../../../Components/Buttons/SwitchToCT.jsx";
import ToggleSwitchButton from "../../../Components/Buttons/Toggle2ndAxis.jsx";
import PrintAndCSV from "../../../Components/Buttons/PrintAndDownloadCSV.jsx";
import { Box, Stack } from "@mui/material";
import { FaUser, FaCog, FaChartLine, FaMapMarkedAlt } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import SearchBar from "../../../Components/Buttons/SearchBar.jsx";
import ChartDataGroupedTable from "../../../Components/GridTables/ChartDataTable.jsx";
// import chartData from "./DummyData.js";
import { HourglassBottomOutlined } from "@mui/icons-material";
import DynamicCategoryChart from "../../../Components/Charts/DynamicChart.jsx";
import SalesTransactionsTable from "../Sales/SalesSnapshotTable.jsx";
import chartData from "../../../Components/Charts/dummyChartData.js";
import { getLabourAreaData } from "../../../API/reportsData.js";
import { formatToYMD } from "../../../Utils/dateUtils.js";
import LabourSnapshotTransactionsTable from "./SnapshotDynamicTable.jsx";
import LabourDynamicCategoryChart from "../../../Components/Charts/labour/LabourDynamicChart.jsx";
import LabourChartDataGroupedTable from "../../../Components/GridTables/labour/LabourChartDataTable.jsx";
import { aggregateByEachOption, aggregateLabourByEachOption } from "../../../Utils/commonFunction.js";
// import SalesTransactionsTable from "./SalesSnapshotTable.jsx";

const options = [
  { value: "actual_hours", label: "Guest", icon: FaUser },
  { value: "labour", label: "Employee", icon: FaCog },
  {
    value: "base_cost",
    label: "Base cost",
    icon: FaChartLine,
  },
  { value: "fully_loaded_cost", label: "Fully loaded cost", icon: FaChartLine },
];

const Area = ({ userToken }) => {
  const { filters } = useContext(FilterContext);
  const [selectedAreas, setSelectedAreas] = useState(null);
    const [selectedFilterOption, setSelectedFilterOption] = useState(null);
  const [labourData,setLabourData]=useState()

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
  const locationOptions = [
    { value: "boston", label: "Boston" },
    { value: "chicago", label: "Chicago" },
    { value: "new_york", label: "New York" },
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
  const valueFields = ["actual_base_cost", "actual_shift_num_mins"]; // fields to show
  const labelFields = ["Acctual Cost, $", "Working minutes"];
  let dummyText = `Lorem ipsum, dolor sit amet consectetur...`;

  const handleButtonClick = (btn) => {
    if (btn.type === "report")
      alert(`Opening ${btn.title} for Phase ${btn.phase}`);
  };
  useEffect(() => {
      const fetchLabourData = async () => {
        setLabourData(null);
        try {
          const fromDate = formatToYMD(filters?.dateRange?.startDate);
          const toDate = formatToYMD(filters?.dateRange?.endDate);
          const data = await getLabourAreaData(userToken, fromDate, toDate);
          setLabourData(data?.data);
        } catch (err) {
          console.error("Error fetching Shipday data:", err);
        }
      };
  
      fetchLabourData();
    }, [filters?.dateRange?.startDate, filters?.dateRange?.endDate]);

  let snapshotTableData;
  if (labourData) {
    snapshotTableData = aggregateLabourByEachOption(labourData.detail);
    console.log("aggregateByEachOption(labourData.detail)", snapshotTableData);
  }
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
            isClearable={true}
          />

          <DynamicDropdown
            title="Location"
            icon={HiLocationMarker}
            options={locationOptions}
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
              onChange={(opt) => setSelectedFilterOption(opt.value)}
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
                <LabourChartDataGroupedTable
                  data={labourData}
                  selectedFilterOption={selectedFilterOption}
                  categories={
                    selectedAreas?.length > 0
                      ? selectedAreas?.map((el) => el.value)
                      : ["all"]
                  }
                />
              </Box>
            ) : (
              <Box id="chart-section">
                <LabourDynamicCategoryChart
                  data={labourData}
                  height={400}
                  selectedFilterOption={selectedFilterOption}
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
              <LabourSnapshotTransactionsTable
                data={snapshotTableData?snapshotTableData:[]}
                defaultRegion={region}
                valueFields={valueFields}
                labelFields={labelFields}
                COLORS={{ green: "#2ecc71", red: "#e74c3c" }}
                searchText={
                  filters?.searchedValue?.length > 0
                    ? filters?.searchedValue
                    : null
                }
                sectionName="Area"
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Area;
