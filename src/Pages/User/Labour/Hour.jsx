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

import SearchBar from "../../../Components/Buttons/SearchBar.jsx";
import ChartDataGroupedTable from "../../../Components/GridTables/ChartDataTable.jsx";
import { HourglassBottomOutlined } from "@mui/icons-material";
import DynamicCategoryChart from "../../../Components/Charts/DynamicChart.jsx";
import SalesTransactionsTable from "../Sales/SalesSnapshotTable.jsx";
import chartData from "../../../Components/Charts/dummyChartData.js";
import { getLabourHourData } from "../../../API/reportsData.js";
import { formatToYMD } from "../../../Utils/dateUtils.js";
import LabourSnapshotTransactionsTable from "./SnapshotDynamicTable.jsx";
import LabourDynamicCategoryChart from "../../../Components/Charts/labour/LabourDynamicChart.jsx";
import LabourChartDataGroupedTable from "../../../Components/GridTables/labour/LabourChartDataTable.jsx";
import {
  aggregateByEachOption,
  aggregateLabourByEachOption,
  subtractYearsUTC,
} from "../../../Utils/commonFunction.js";
import TranslatedText from "../../../Components/Controls/TranslatedText";
import LabourHourDynamicCategoryChart from "../../../Components/Charts/labour/LabourHourChart.jsx";
import LabourHourChartDataGroupedTable from "../../../Components/GridTables/labour/LabourHourDataTable.jsx";

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

const Hour = ({ userToken }) => {
  const { filters } = useContext(FilterContext);
  const [selectedHours, setSelectedHours] = useState(null);
  const [selectedFilterOption, setSelectedFilterOption] = useState(null);
  const [labourData, setLabourData] = useState();

  console.log("filtersfilters", filters);
  const buttonData = [
    { id: 0, title: "Snapshot", type: "snapshot", phase: 1 },
    { id: 1, title: "Trends", type: "trends", phase: 2 },
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
    const fetchLabourData = async () => {
      setLabourData(null);
      try {
        const fromDate = formatToYMD(filters?.dateRange?.startDate);
        const toDate = formatToYMD(filters?.dateRange?.endDate);
        const data = await getLabourHourData(userToken, fromDate, toDate);
        setLabourData(data?.data);
      } catch (err) {
        console.error("Error fetching Shipday data:", err);
      }
    };

    fetchLabourData();
  }, [filters?.dateRange?.startDate, filters?.dateRange?.endDate]);
  console.log("labourDatalabourData", labourData);
  let snapshotTableData;
  if (labourData) {
    snapshotTableData = aggregateLabourByEachOption(labourData.detail);
  }
  return (
    <Box p={1} mt={1}>
      <Box mb={1}>
        <ButtonGroup buttons={buttonData} onButtonClick={handleButtonClick} />
      </Box>
      <Box>
        <Stack direction="row" spacing={0.5} width="100%">
          <DateRangeSelector />
        </Stack>

        {filters?.topBarSelectedSection?.id === 1 ? (
          <Box my={1} zIndex={100}>
            <AutoCompleteDropdown
              showLogoTitle
              logo="https://cdn-icons-png.flaticon.com/512/25/25694.png"
              title="Hours"
              options={[
                { value: "monday", label: "Monday" },
                { value: "tuesday", label: "Tuesday" },
                { value: "wednesday", label: "Wednesday" },
                { value: "thursday", label: "Thursday" },
                { value: "friday", label: "Friday" },
                { value: "saturday", label: "Saturday" },
                { value: "sunday", label: "Sunday" },
              ]}
              onChange={(vals) => setSelectedHours(vals)}
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
        {labourData?.length < 1 || !labourData ? (
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
                  <LabourHourChartDataGroupedTable
                    data={labourData}
                    selectedFilterOption={selectedFilterOption}
                    categories={
                      selectedHours?.length > 0
                        ? selectedHours?.map((el) => el.value)
                        : ["all"]
                    }
                  />
                </Box>
              ) : (
                <Box id="chart-section">
                  <LabourHourDynamicCategoryChart
                    data={labourData}
                    height={400}
                    showBar={filters?.chart2ndAxis}
                    selectedFilterOption={selectedFilterOption}
                    categories={
                      selectedHours?.length > 0
                        ? selectedHours?.map((el) => el.value)
                        : ["all"]
                    }
                  />
                </Box>
              )
            ) : (
              <Box>
                <LabourSnapshotTransactionsTable
                  data={snapshotTableData ? snapshotTableData : []}
                  defaultRegion={region}
                  valueFields={valueFields}
                  labelFields={labelFields}
                  selectedFilterOption={selectedFilterOption}
                  COLORS={{ green: "#2ecc71", red: "#e74c3c" }}
                  searchText={
                    filters?.searchedValue?.length > 0
                      ? filters?.searchedValue
                      : null
                  }
                  sectionName="Hour"
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Hour;
