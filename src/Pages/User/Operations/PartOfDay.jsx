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
import chartData from "../Sales/DummyData.js";
import { HourglassBottomOutlined } from "@mui/icons-material";
import DynamicCategoryChart from "../../../Components/Charts/DynamicChart.jsx";
import SalesTransactionsTable from "../Sales/SalesSnapshotTable.jsx";
import { getOperationPartOfDayData } from "../../../API/reportsData.js";
import { formatToYMD } from "../../../Utils/dateUtils.js";
import { aggregateByEachOption, subtractYearsUTC } from "../../../Utils/commonFunction.js";
import TranslatedText from "../../../Components/Controls/TranslatedText";

const options = [
  { value: "guest", label: "Guest", icon: FaUser },
  { value: "guest_total", label: "Guest Total", icon: FaCog },
  {
    value: "delivery",
    label: "Delivery",
    icon: FaChartLine,
  },
  { value: "sales", label: "Sales", icon: FaChartLine },
];

const PartOfDay = ({ userToken }) => {
  const { filters } = useContext(FilterContext);
  const [selectedAreas, setSelectedAreas] = useState(null);
  const [operationsData, setOperationsData] = useState(null);
  const [selectedFilterOption, setSelectedFilterOption] = useState(null);
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
  const valueFields = ["guest_total", "count"]; // fields to show
  const labelFields = ["Sales, $", "Transactions"];
  // let infoTooltipText = (
  //   <div
  //     style={{
  //       display: "grid",
  //       gridTemplateColumns: "140px 1fr",
  //       rowGap: "8px",
  //     }}
  //   >
  //     <strong><TranslatedText>YoY Date Range:</TranslatedText></strong>
  //     <span>
  //       {subtractYearsUTC(filters?.dateRange?.startDate)} to{" "}
  //       {subtractYearsUTC(filters?.dateRange?.endDate)}
  //     </span>

  //     <strong><TranslatedText>Sales:</TranslatedText></strong>
  //     <ul style={{ margin: 0, paddingLeft: "18px" }}>
  //       <li><TranslatedText>Excludes VAT</TranslatedText></li>
  //       <li><TranslatedText>Excludes service charge</TranslatedText></li>
  //       <li><TranslatedText>After deducting promos/discounts</TranslatedText></li>
  //       <li><TranslatedText>After deducting comps/staff meals</TranslatedText></li>
  //     </ul>
  //   </div>
  // );

  const handleButtonClick = (btn) => {
    if (btn.type === "report")
      alert(`Opening ${btn.title} for Phase ${btn.phase}`);
  };

  useEffect(() => {
    const fetchOperationsData = async () => {
      setOperationsData(null);
      try {
        const fromDate = formatToYMD(filters?.dateRange?.startDate);
        const toDate = formatToYMD(filters?.dateRange?.endDate);
        const data = await getOperationPartOfDayData(
          userToken,
          fromDate,
          toDate
        );
        setOperationsData(data?.data);
      } catch (err) {
        console.error("Error fetching Shipday data:", err);
      }
    };

    fetchOperationsData();
  }, [filters?.dateRange?.startDate, filters?.dateRange?.endDate]);

  let snapshotTableData;
  if (operationsData) {
    snapshotTableData = aggregateByEachOption(operationsData.detail);
  }

  return (
    <Box p={1} mt={1}>
      <Box mb={1}>
        <ButtonGroup buttons={buttonData} onButtonClick={handleButtonClick} />
      </Box>
      <Box>
        <Stack direction="row" spacing={0.5} width="100%">
          <DateRangeSelector />

          {/* <DynamicDropdown
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
          ) : null} */}
        </Stack>

        {filters?.topBarSelectedSection?.id === 1 ? (
          <Box my={1} zIndex={100}>
            <AutoCompleteDropdown
              showLogoTitle
              logo="https://cdn-icons-png.flaticon.com/512/25/25694.png"
              title="Areas"
              options={[
                { value: "breakfast", label: "Breakfast" },
                { value: "dinner", label: "Dinner" },
                { value: "lunch", label: "Lunch" },
                { value: "late_night", label: "Late night" },
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
            <InfoTooltip />
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
            {filters?.topBarSelectedSection?.id === 1 &&
              !filters?.switchToChart && (
                <PrintAndCSV data={data} actions={["print"]} />
              )}

            {filters?.topBarSelectedSection?.id === 1 &&
              !filters?.switchToChart && (
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
        {operationsData?.length < 1 || !operationsData ? (
          <Box
            direction={{ xs: "column", md: "column", lg: "row" }}
            justifyContent="center"
            alignItems="center"
            sx={{ width: "100%", height: "100%", textAlign: "center" }}
          >
            <img
              src="/gif/growthValue_animated_loader.gif"
              style={{ width: "200px", height: "200px" }}
              alt="Loading..."
            />
          </Box>
        ) : (
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
                    data={operationsData}
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
                  <DynamicCategoryChart
                    data={operationsData}
                    height={500}
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
                <SalesTransactionsTable
                  data={snapshotTableData}
                  defaultRegion={region}
                  valueFields={valueFields}
                  labelFields={labelFields}
                  COLORS={{ green: "#2ecc71", red: "#e74c3c" }}
                  searchText={
                    filters?.searchedValue?.length > 0
                      ? filters?.searchedValue
                      : null
                  }
                  sectionName="Part of day"
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PartOfDay;
