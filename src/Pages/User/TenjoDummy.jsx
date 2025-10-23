import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import chartData from "../../Components/Charts/dummyChartData";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DateRangeDropdown from "../../Components/DateRange/DateRangeSelector";
import AreaDropdown from "../../Components/Dropdowns/Dropdown";
import DynamicDropdown from "../../Components/Dropdowns/Dropdown";
import { FaMapMarkedAlt, FaUser, FaCalendar } from "react-icons/fa";
import SearchBar from "../../Components/Buttons/SearchBar";
import ExportButton from "../../Components/Buttons/ExportToCSVButton";
import PrintButton from "../../Components/Buttons/PrintButton";
import InfoTooltip from "../../Components/Tooltip/InfoTooltip";
import DateRangeSelector from "../../Components/DateRange/DateRangeModalViewer";
import AutoCompleteDropdown from "../../Components/Dropdowns/AutoCompleteDropdown";
import PrintAndCSV from "../../Components/Buttons/PrintAndDownloadCSV";
import ControlMenuModal from "../../Components/Modals/ControlMenuModal";
import { IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { MoreHoriz } from "@mui/icons-material";
import ButtonGroup from "../../Components/Buttons/TopBarControls";
import getDummyData from "../../API/dummyShipdayData";
import DynamicTable from "../../Components/GridTables/GridTable";
import MyChart from "../../Components/Charts/TestingChart";
import MultiCategoryChart from "../../Components/Charts/MultiLineChart";
import DynamicCategoryChart from "../../Components/Charts/DynamicChart";
import ChartDataGroupedTable from "../../Components/GridTables/ChartDataTable";
import ManagerSectionDynamicTable from "../../Components/GridTables/ManagerSectionTable";
import myData from "../../Components/GridTables/DummyUserData";
import serviceData from "../../Components/GridTables/servicChargeDummyData";
import SalesTransactionsTable from "../../Components/GridTables/SalesGrid";
import DrilldownGrid from "../../Components/GridTables/DummyNestedgrid";

const dummyFAQs = [
  {
    question: "What is the vision of Growth Value?",
    answer:
      "The vision of Growth Value is to create a cutting-edge platform that revolutionizes how people interact with technology...",
  },
  {
    question: "How does Growth Value ensure data security?",
    answer:
      "Growth Value implements robust data encryption, multi-factor authentication, and regular security audits...",
  },
  {
    question: "What are the key features of Growth Value?",
    answer:
      "Growth Value offers a user-friendly interface, real-time data analytics, customizable workflows, and integration with popular third-party tools...",
  },
];
const cityOptions = [
  { value: "dallas", label: "Dallas" },
  { value: "san-francisco", label: "San Francisco" },
  { value: "new-york", label: "New York" },
  { value: "chicago", label: "Chicago" },
];

const SalesPage = ({ userToken }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [shipdayData, setShipdayData] = useState(null);
  console.log("shipdayDatashipdayData", shipdayData);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDummyData(userToken);
        console.log("data------", data);
        setShipdayData(data?.data);
      } catch (err) {
        console.error("Error fetching Shipday data:", err);
      }
    };

    fetchData();
  }, [userToken]);

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

  const areaOptions = [
    { value: "north", label: "North" },
    { value: "south", label: "South" },
    { value: "east", label: "East" },
    { value: "west", label: "West" },
    { value: "central", label: "Central" },
  ];

  const userOptions = [
    { value: "admin", label: "Admin" },
    { value: "editor", label: "Editor" },
    { value: "viewer", label: "Viewer" },
  ];

  const handleDateChange = (range) => {
    console.log("Selected range:", range);
  };
  const handleSearch = (value) => {
    console.log("Searching in MyComponent:", value);
  };
  const handleCityChange = (selected) => {
    console.log("Selected Cities:", selected);
  };

  const data = [
    { name: "John Doe", email: "john@example.com", age: 28 },
    { name: "Jane Smith", email: "jane@example.com", age: 32 },
  ];

  const buttonData = [
    { id: 1, title: "Phase 1 Report", type: "report", phase: 1 },
    { id: 2, title: "Phase 2 Report", type: "report", phase: 2 },
    { id: 3, title: "Other Reports", type: "report", phase: "other" },
    { id: 4, title: "Snapshot", type: "report", phase: "other" },
    { id: 5, title: "Trends", type: "report", phase: "other" },
  ];

  const handleButtonClick = (btn) => {
    console.log("Button clicked:", btn);
    // example usage
    if (btn.type === "report") {
      alert(`Opening ${btn.title} for Phase ${btn.phase}`);
    }
  };

  const columnMap = {
    full_name: `Employee Name`,
    Covers: "Covers",
    Sales: "Sales ,$",
    ASPH: "ASPH,$",
  };
  const serviceColumnMap = {
    location_name: "Location",
    full_name: "Employee Name",
    Sales: "Sales",
    "Service Charge": "Service Charge",
    "Service Charge %": "Service Charge %",
  };
  let dummyText = `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae nemo velit ducimus in impedit ipsum veniam voluptate, quasi aliquid accusamus praesentium delectus asperiores officiis enim repudiandae vel nesciunt ex. Doloribus.
    Delectus, aliquam, est earum quos ea id at officiis sapiente aliquid accusantium, optio ab laboriosam expedita eum ullam consequatur? Explicabo, aut itaque? Eveniet rerum possimus mollitia totam praesentium! Explicabo, facere!
    Magni alias omnis distinctio aliquid minima dolores quia repudiandae similique eligendi, odit culpa natus magnam facere obcaecati unde et dolorem placeat debitis sint esse voluptates! Sapiente mollitia rerum soluta quis.
    Distinctio nemo, tempora vero quibusdam dolore repellendus, quo numquam consequatur doloremque est suscipit, accusantium eos enim praesentium impedit. Quo iure ducimus molestias quos delectus earum ullam eveniet voluptates quibusdam numquam.
    In repudiandae ratione, atque exercitationem veritatis suscipit asperiores explicabo enim dolor soluta tempore optio distinctio culpa nam incidunt dolorem debitis quo, similique quos ipsum amet. At nesciunt fugiat iusto omnis.`;

  return (
    <Container
      maxWidth={false}
      sx={{ width: "100%", mt: 5, mb: 5, overflowX: "hidden" }}
    >
      <div style={{ marginBottom: "10px" }}>
        <ButtonGroup buttons={buttonData} onButtonClick={handleButtonClick} />
      </div>
      <DrilldownGrid />
      <div id="print-section">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>john@example.com</td>
              <td>28</td>
            </tr>
            <tr>
              <td>Jane Smith</td>
              <td>jane@example.com</td>
              <td>32</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <SalesTransactionsTable
          data={[
            {
              id: "18999560927969340",
              identifier: "South",
              count: 369,
              count_ly: 381,
              total: 4306.295,
              total_ly: 4411.23,
              void_count: 0,
              void_count_ly: 0,
              void_total: 0,
              void_total_ly: 0,
              guest_count: 748,
              guest_count_ly: 774,
              guest_total: 4306.295,
              guest_total_ly: 4411.23,
              time_to_serve: 0,
              time_to_serve_ly: 0,
              budget: 5136.83968,
            },
            {
              id: "18999565222936577",
              identifier: "East",
              count: 560,
              count_ly: 493,
              total: 6540.53,
              total_ly: 5776.185,
              void_count: 0,
              void_count_ly: 0,
              void_total: 0,
              void_total_ly: 0,
              guest_count: 1087,
              guest_count_ly: 1015,
              guest_total: 6540.53,
              guest_total_ly: 5776.185,
              time_to_serve: 0,
              time_to_serve_ly: 0,
              budget: 7821.640239,
            },
            {
              id: "18999565222936578",
              identifier: "West",
              count: 421,
              count_ly: 318,
              total: 4816.304,
              total_ly: 3589.36,
              void_count: 0,
              void_count_ly: 0,
              void_total: 0,
              void_total_ly: 0,
              guest_count: 847,
              guest_count_ly: 634,
              guest_total: 4816.304,
              guest_total_ly: 3589.36,
              time_to_serve: 0,
              time_to_serve_ly: 0,
              budget: 5747.262135,
            },
          ]}
        />
      </div>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div style={{ padding: "0px", width: "auto " }}>
          {/* <h2>Dynamic Date Range Picker</h2> */}
          {/* <DateRangeDropdown onChange={handleDateChange} /> */}
          <DateRangeSelector />
        </div>
        <DynamicDropdown
          title="Area"
          icon={FaMapMarkedAlt}
          options={areaOptions}
        />
        <DynamicDropdown options={userOptions} />
        <div>
          <IconButton onClick={handleMenuOpen}>
            <MoreHoriz />
          </IconButton>

          <ControlMenuModal
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onAction={handleMenuAction}
            data={data}
            contentId="print-section"
          />
        </div>
        <div style={{ width: "300px", margin: "auto" }}>
          <SearchBar
            placeholder="Search"
            debounceTime={300}
            onSearch={handleSearch}
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div
        //   style={{
        //     padding: "0px",
        //     fontSize: "16px",
        //     alignContent: "center",
        //     alignItems: "center",
        //   }}
        >
          <InfoTooltip text={dummyText} />
        </div>
        {/* <div style={{ marginTop: "0px" }}>
                    <PrintButton contentId="print-section" buttonText="Print " />
                </div>
                <div style={{ padding: "0px" }}>
                    <ExportButton data={data} filename="users_export.csv" />
                </div> */}

        <PrintAndCSV
          data={data}
          contentId="print-section"
          fileName="users_export.csv"
          actions={["print", "csv"]}
        />
      </div>

      <div style={{ padding: "20px" }}>
        {/* <h3>Select Cities</h3> */}
        <AutoCompleteDropdown
          options={cityOptions}
          placeholder="Auto"
          onChange={handleCityChange}
          isMulti={false}
        />
      </div>
      <div style={{ padding: "20px", zIndex: 100 }}>
        <AutoCompleteDropdown
          showLogoTitle
          logo="https://cdn-icons-png.flaticon.com/512/25/25694.png"
          title="Areas"
          options={[
            { value: "north", label: "North" },
            { value: "south", label: "South" },
            { value: "east", label: "East" },
            { value: "west", label: "West" },
          ]}
          onChange={(vals) => console.log("Selected:", vals)}
          width="100%"
        />
      </div>

      {shipdayData && shipdayData.length && (
        <div>
          <DynamicTable
            data={shipdayData}
            options={{ pagination: true, pageSize: 5 }}
            // columnOverrides={{
            //     // custom rendering / formatting
            //     placementTime: {
            //         valueFormatter: (p) => new Date(p.value).toLocaleString(),
            //     },
            //     // totalCost: {
            //     //     valueFormatter: (p) => `€${p.value?.toFixed(2)}`,
            //     // },
            //     // trackingLink: {
            //     //     cellRenderer: (params) => (
            //     //         <a href={params.value} target="_blank" rel="noreferrer">
            //     //             Track
            //     //         </a>
            //     //     ),
            //     // },
            //     // customer: {
            //     //     valueGetter: (p) => p.data.customer?.name,
            //     // },
            //     // restaurant: {
            //     //     valueGetter: (p) => p.data.restaurant?.name,
            //     // },
            //     // orderStatus: {
            //     //     valueGetter: (p) => p.data.orderStatus?.orderState,
            //     // },
            // }}
          />
        </div>
      )}

      <div>
        <h1>My AG Chart Example</h1>
        <MyChart data={chartData} />
      </div>
      <MultiCategoryChart data={chartData} />
      <div id="chart-section">
        <DynamicCategoryChart
          data={chartData}
          categories={["salad", "cold drinks", "snacks"]}
        />
      </div>
      {/* Show both line + bar for all categories */}
      <DynamicCategoryChart data={chartData} />

      {/* Only Line Chart */}
      <DynamicCategoryChart data={chartData} showBar={false} />

      {/* Only Bar Chart, with custom categories */}
      <DynamicCategoryChart
        data={chartData}
        categories={["sandwiches"]}
        showLine={true}
      />

      <div
        style={{
          width: "100%",
        }}
      >
        <ChartDataGroupedTable
          data={chartData}
          categories={["cold drinks", "sandwiches", "hot drinks"]}
        />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <div
          style={{
            height: 600,
            width: "48%",
          }}
        >
          <ManagerSectionDynamicTable
            data={myData}
            columnMap={columnMap}
            // tableHeight={600}
            enableFilter={false}
            enableSorting={true}
            enableResize={false}
          />
        </div>
        <div
          style={{
            height: 600,
            width: "48%",
          }}
        >
          <ManagerSectionDynamicTable
            data={myData}
            columnMap={columnMap}
            // tableHeight={600}
            enableFilter={false}
            enableSorting={true}
            enableResize={false}
          />
        </div>
      </div>

      <div
        className="ag-theme-quartz"
        style={{
          height: 600,
          width: "100%",
          backgroundColor: "#bfd1ecff",
        }}
      >
        <ManagerSectionDynamicTable
          data={serviceData}
          columnMap={serviceColumnMap}
          tableHeight={600}
          enableFilter={false}
          enableSorting={true}
          enableResize={false}
        />
      </div>

      {/* Hero Section */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "40px",
          marginTop: "200px",
        }}
      >
        <Typography variant="h3" gutterBottom>
          Growth Value Platform
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Boost your productivity and streamline workflows with AI-powered
          solutions
        </Typography>
        <Button variant="contained" color="primary" size="large">
          Get Started
        </Button>
      </div>

      {/* Feature Cards */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Real-time Analytics</Typography>
              <Typography variant="body2">
                Monitor your projects and team performance in real-time with
                smart dashboards.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Seamless Integration</Typography>
              <Typography variant="body2">
                Connect with popular tools like Google Workspace, Microsoft 365,
                and Trello effortlessly.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Custom Workflows</Typography>
              <Typography variant="body2">
                Personalize workflows to suit your team’s needs and increase
                efficiency.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* FAQ Section */}
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Frequently Asked Questions
      </Typography>

      {dummyFAQs.map((faq, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{faq.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Call to Action */}
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Button variant="outlined" color="secondary" size="large">
          Contact Sales
        </Button>
      </div>
    </Container>
  );
};

export default SalesPage;
