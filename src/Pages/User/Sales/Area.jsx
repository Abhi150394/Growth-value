import React, { useContext, useEffect, useState } from "react";
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
import { FaUser, FaCog, FaChartLine } from "react-icons/fa";
import SearchBar from "../../../Components/Buttons/SearchBar";
import ChartDataGroupedTable from "../../../Components/GridTables/ChartDataTable";
import chartData from "./DummyData.js";
import { HourglassBottomOutlined } from "@mui/icons-material";
import DynamicCategoryChart from "../../../Components/Charts/DynamicChart.jsx";
import SalesTransactionsTable from "./SalesSnapshotTable.jsx";
import XMLUploader from "./XMLUploading.jsx";
import {
  getFinancialDetailsData,
  getProductSales,
} from "../../../API/lightspeedAPI.js";
import { formatToYMD } from "../../../Utils/dateUtils.js";
import ProductSalesTable from "./NewGroupTable.jsx";
import ProductPerformanceChart from "./NewChartCompo.jsx";
import DynamicProductPerformanceChart from "../../../Components/Charts/BarChart.jsx";
import getYOYComparison from "../../../Utils/commonFunction.js";
import SalesYoYChart from "../../../Components/Charts/AreaSalesChart.jsx";
import DynamicSalesTrendsTable from "../../../Components/GridTables/SalesAreaTrendsTable.jsx";
import DynamicSalesSnapshotTable from "./SalesAreaSnapshotTable.jsx";
import { getSalesAreaData } from "../../../API/reportsData.js";

const options = [
  { value: "profile", label: "Profile", icon: FaUser },
  { value: "settings", label: "Settings", icon: FaCog },
  { value: "analytics", label: "Analytics", icon: FaChartLine },
];

const Area = ({ userToken }) => {
  const { filters } = useContext(FilterContext);
  const [selectedAreas, setSelectedAreas] = useState(null);
  const [salesdata, setSalesData] = useState(null);
  // console.log("filtersfilters", filters);
  console.log("salesdatasalesdata", salesdata);
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
  const valueFields = ["guest_total", "count"]; // fields to show.
  const labelFields = ["Sales, $", "Transactions"];
  let dummyText = `Lorem ipsum, dolor sit amet consectetur...`;

  const handleButtonClick = (btn) => {
    if (btn.type === "report")
      alert(`Opening ${btn.title} for Phase ${btn.phase}`);
  };
  useEffect(() => {
    const fetchSalesData = async () => {
      setSalesData(null);
      try {
        const fromDate = formatToYMD(filters?.dateRange?.startDate);
        const toDate = formatToYMD(filters?.dateRange?.endDate);
        const data = await getSalesAreaData(userToken, fromDate, toDate);
        setSalesData(data?.data);
      } catch (err) {
        console.error("Error fetching Shipday data:", err);
      }
    };

    fetchSalesData();
  }, [filters?.dateRange?.startDate, filters?.dateRange?.endDate]);

  // useEffect(() => {
  //   const fetchFinanceData = async () => {
  //     try {
  //       const fromDate = formatToYMD(filters?.dateRange?.startDate);
  //       const toDate = formatToYMD(filters?.dateRange?.endDate);
        
  //       const data = await getFinancialDetailsData(userToken, fromDate, toDate);
  //       console.log(
  //         "getFinancialDetailsDatagetFinancialDetailsData------",
  //         data
  //       );
  //       const convertedData = getYOYComparison(data.data);
  //       // console.log("converted dtaa--------", convertedData);
  //       setSalesData(convertedData);
  //     } catch (err) {
  //       console.error("Error fetching Shipday data:", err);
  //     }
  //   };

  //   fetchFinanceData();
  // }, [filters?.dateRange?.startDate, filters?.dateRange?.endDate]);

  return (
    <Box p={1} mt={1}>
      {/* <XMLUploader token={userToken} /> */}
      <Box mb={1}>
        <ButtonGroup buttons={buttonData} onButtonClick={handleButtonClick} />
      </Box>
      <Box>
        <Stack direction="row" spacing={0.5} width="100%">
          <DateRangeSelector maxRange={25}/>
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
            {/* <DynamicDropdown
              options={options}
              onChange={(opt) => console.log("Selected:", opt)}
              width="100%"
            /> */}
          </Box>
        </Stack>
      </Box>

      <div>
        {/* <h2>Product Profit Comparison</h2> */}
        {/* <ProductPerformanceChart data={salesdata} metric="profit" /> */}

        {/* <DynamicProductPerformanceChart data={salesdata} yKeys={["profit"]} /> */}
      </div>

      <Box>
        {salesdata?.length < 1 || !salesdata? (
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
                  {/* <DynamicSalesTrendsTable data={salesdata}/> */}
                  <ChartDataGroupedTable
                    data={salesdata}
                    categories={
                      selectedAreas?.length > 0
                        ? selectedAreas?.map((el) => el.value)
                        : ["all"]
                    }
                  />
                </Box>
              ) : (
                <Box id="chart-section">
                  {/* <SalesYoYChart data={salesdata} height={500} showBar={filters?.chart2ndAxis}/> */}
                  <DynamicCategoryChart
                    data={salesdata}
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
                {/* <DynamicSalesSnapshotTable data={salesdata} /> */}
                <SalesTransactionsTable
                  data={salesdata}
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
        )}
      </Box>
    </Box>
  );
};

export default Area;
