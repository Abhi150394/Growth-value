import Dashboard from "./Pages/User/Dashboard";
import Wishlist from "./Pages/User/Wishlist";
import FAQs from "./Pages/User/FAQs";
import SearchandCompare from "./Pages/User/Search&Compare";
import Summary from "./Pages/User/Summary";
import HelpandSupport from "./Pages/User/Help&Support";
import Subscription from "./Pages/User/Subscription";
import Scraping from "./Pages/Admin/Scraping";
import UserManagement from "./Pages/Admin/UserManagement";
import Payment from "./Pages/User/Payment/Payment";
import Demo from "./Pages/Demo/Demo";
import SalesPage from "./Pages/User/TenjoDummy";
import Area from "./Pages/User/Sales/Area";
import Location from "./Pages/User/Sales/Location";
import ProductDivision from "./Pages/User/Sales/ProductDivision";
import OrderType from "./Pages/User/Sales/OrderType";
import RevenueCenter from "./Pages/User/Sales/RevenueCenter";
import ProductCategory from "./Pages/User/Sales/ProductCategory";
import DayOfWeek from "./Pages/User/Operations/DayOfWeek";
import PartOfDay from "./Pages/User/Operations/PartOfDay";
import Hour from "./Pages/User/Operations/Hour";
import LabourArea from "./Pages/User/Labour/Area";
import LabourLocation from "./Pages/User/Labour/Location";
import LabourRole from "./Pages/User/Labour/Role";
import LabourHour from "./Pages/User/Labour/Hour";
import Finance from "./Pages/User/Finance/Finance";
import Forecast from "./Pages/User/Forecast/Forecast";
import LaborDash from "./Pages/User/Labor Dash/LaborDash";
import OpsManager from "./Pages/User/Ops Manager/OpsManager";
import DynamicRouteHost from "./Components/Modals/DynamicRouteHost";
import AdminDashboard from "./Pages/Admin/Dashboard";
import Plans from "./Pages/User/Payment/Plans";
import Success from "./Pages/User/Payment/Success";
import SalesDashboard from "./Pages/User/Sales/TestingWithRealData";
import ProductItem from "./Pages/User/Sales/ProductItem";
import InventoryLocation from "./Pages/User/Inventory/Location";
import InventoryCategory from "./Pages/User/Inventory/Category";
import InventoryItem from "./Pages/User/Inventory/Item";
import InventoryVendor from "./Pages/User/Inventory/Vendor";

/**
 * Route config:
 * - path: URL
 * - menuId: sidebar id (or dashboard id) used in SIDEBAR_ROLE_CONFIG
 * - subMenuName: submenu name (exactly as in sidebar JSON, not normalized)
 * - layoutType: "admin" | "user"
 * - render: function receiving common props from App (userToken, userData, etc.)
 */

const APP_ROUTES = [
  // ==== Common/User/Admin basic app routes (paid for user) ====
  {
    path: "/dashboard",
    allowedRoles: [
      "user",
      "admin",
      "business_leader",
      "regional_manager",
      "manager",
      "vendor",
    ],
    requiresPaidForUser: true,
    render: ({ userToken, userData, search, setSearch, user }) => (
      <Dashboard
        userToken={userToken}
        userData={userData}
        search={search}
        setSearch={setSearch}
        user={user}
      />
    ),
  },
  {
    path: "/search&compare",
    allowedRoles: ["user", "admin"],
    requiresPaidForUser: true,
    render: ({ userToken, userData, search, setSearch }) => (
      <SearchandCompare
        userToken={userToken}
        userData={userData}
        search={search}
        setSearch={setSearch}
      />
    ),
  },
  {
    path: "/summary",
    allowedRoles: ["user", "admin"],
    requiresPaidForUser: true,
    render: ({ userToken, userData, search, setSearch }) => (
      <Summary
        userToken={userToken}
        userData={userData}
        search={search}
        setSearch={setSearch}
      />
    ),
  },
  {
    path: "/help&support",
    allowedRoles: ["user", "admin"],
    requiresPaidForUser: true,
    render: ({ userToken, userData }) => (
      <HelpandSupport userToken={userToken} userData={userData} />
    ),
  },
  {
    path: "/faqs",
    allowedRoles: [
      "user",
      "admin",
      "business_leader",
      "regional_manager",
      "manager",
      "vendor",
    ],
    requiresPaidForUser: true, // for user role only; others ignore this flag
    render: ({ userToken, userData }) => (
      <FAQs userToken={userToken} userData={userData} />
    ),
  },
  {
    path: "/wishlist",
    allowedRoles: ["user", "admin", "vendor"],
    requiresPaidForUser: true,
    render: ({ userToken, userData }) => (
      <Wishlist userToken={userToken} userData={userData} />
    ),
  },

  // ==== Payment / subscription routes (do NOT require paid for user) ====
  {
    path: "/home",
    // For admin and unpaid user landing (original code had both)
    allowedRoles: ["admin", "user"],
    requiresPaidForUser: false,
    render: ({ userToken, userData }) => (
      <AdminDashboard userToken={userToken} userData={userData} />
    ),
  },
  {
    path: "/checkoutForm",
    allowedRoles: ["user", "admin"],
    requiresPaidForUser: false,
    render: ({ userToken, userData }) => (
      <Payment userToken={userToken} userData={userData} />
    ),
  },
  {
    path: "/demo",
    allowedRoles: ["user", "admin"],
    requiresPaidForUser: false,
    render: ({ userToken, userData }) => (
      <Demo userToken={userToken} userData={userData} />
    ),
  },
  {
    path: "/plans",
    allowedRoles: ["user","admin"],
    requiresPaidForUser: false,
    render: ({ userToken, userData }) => (
      <Plans userToken={userToken} userData={userData} />
    ),
  },
  {
    path: "/success/:checkout_id",
    allowedRoles: ["user","admin"],
    requiresPaidForUser: false,
    render: ({ userToken, userData, setUserData }) => (
      <Success
        userToken={userToken}
        userData={userData}
        setUserData={setUserData}
      />
    ),
  },

  // ==== Admin-only routes ====
  {
    path: "/scraping",
    allowedRoles: ["admin"],
    render: ({ userToken, userData }) => (
      <Scraping userToken={userToken} userData={userData} />
    ),
  },
  {
    path: "/user-management",
    allowedRoles: ["admin"],
    render: ({ userToken, userData }) => (
      <UserManagement userToken={userToken} userData={userData} />
    ),
  },
  {
    path: "/account/subscription",
    allowedRoles: ["admin"],
    render: ({ userToken, userData, setUserData }) => (
      <Subscription
        userToken={userToken}
        userData={userData}
        setUserData={setUserData}
      />
    ),
  },
  // Uncomment if you later use Earning page
  // {
  //   path: "/earning",
  //   allowedRoles: ["admin"],
  //   render: ({ userToken, userData }) => (
  //     <Earning userToken={userToken} userData={userData} />
  //   ),
  // },

  // ==== Admin Advanced routes ====
  {
    path: "/home/advanced/scraping",
    allowedRoles: ["admin"],
    render: ({ userToken, userData }) => (
      <Scraping userToken={userToken} userData={userData} />
    ),
  },
  {
    path: "home/advanced/user-management",
    allowedRoles: ["admin", "user"],
    render: ({ userToken, userData }) => (
      <UserManagement userToken={userToken} userData={userData} />
    ),
  },
  {
    path: "home/advanced/dashboard",
    allowedRoles: ["admin", "vendor","user"],
    render: ({ userToken, userData, search, setSearch, user }) => (
      <Dashboard
        userToken={userToken}
        userData={userData}
        search={search}
        setSearch={setSearch}
        user={user}
      />
    ),
  },
  {
    path: "home/advanced/search&compare",
    allowedRoles: ["admin", "user"],
    render: ({ userToken, userData, search, setSearch }) => (
      <SearchandCompare
        userToken={userToken}
        userData={userData}
        search={search}
        setSearch={setSearch}
      />
    ),
  },
  {
    path: "home/advanced/summary",
    allowedRoles: ["admin", "user"],
    render: ({ userToken, userData, search, setSearch }) => (
      <Summary
        userToken={userToken}
        userData={userData}
        search={search}
        setSearch={setSearch}
      />
    ),
  },
  {
    path: "home/advanced/subscription",
    allowedRoles: ["admin", "user"],
    render: ({ userToken, userData, setUserData }) => (
      <Subscription
        userToken={userToken}
        userData={userData}
        setUserData={setUserData}
      />
    ),
  },
  {
    path: "/home/advanced/help&support",
    allowedRoles: ["admin", "user"],
    render: ({ userToken, userData }) => (
      <HelpandSupport userToken={userToken} userData={userData} />
    ),
  },
  {
    path: "home/advanced/faqs",
    allowedRoles: ["admin", "vendor","user"],
    render: ({ userToken, userData }) => (
      <FAQs userToken={userToken} userData={userData} />
    ),
  },
  {
    path: "home/advanced/wishlist",
    allowedRoles: ["admin", "vendor","user"],
    render: ({ userToken, userData }) => (
      <Wishlist userToken={userToken} userData={userData} />
    ),
  },
  {
    path: "home/advanced/checkoutForm",
    allowedRoles: ["admin","user"],
    render: ({ userToken, userData }) => (
      <Payment userToken={userToken} userData={userData} />
    ),
  },
  {
    path: "home/advanced/demo",
    allowedRoles: ["admin", "vendor","user"],
    render: ({ userToken, userData }) => (
      <Demo userToken={userToken} userData={userData} />
    ),
  },

  // ==== Sales routes (Admin, Business leader, Manager, Vendor) ====
  {
    path: "/home/sales/tenzo-dummy",
    allowedRoles: ["admin", "business_leader", "manager", "vendor","user"],
    render: ({ userToken }) => <SalesPage userToken={userToken} />,
  },
  {
    path: "/home/sales/area",
    allowedRoles: ["admin", "business_leader", "manager", "vendor","user"],
    requiresPaidForUser: true,
    render: ({ userToken }) => <Area userToken={userToken} />,
  },
  {
    path: "/home/sales/location",
    allowedRoles: ["admin", "business_leader", "manager", "vendor","user"],
    requiresPaidForUser: true,
    render: ({ userToken }) => <Location userToken={userToken} />,
  },
  {
    path: "/home/sales/product-division",
    allowedRoles: ["admin", "business_leader", "manager", "vendor","user"],
    requiresPaidForUser: true,
    render: ({ userToken }) => <ProductDivision userToken={userToken} />,
  },
  {
    path: "/home/sales/product-item",
    allowedRoles: ["admin", "bussiness_leader","user"],
    requiresPaidForUser: true,
    render: ({ userToken }) => <ProductItem userToken={userToken} />,
  },
  {
    path: "/home/sales/revenue-center",
    requiresPaidForUser: true,
    allowedRoles: ["admin", "business_leader", "manager", "vendor"],
    render: ({ userToken }) => <RevenueCenter userToken={userToken} />,
  },
  {
    path: "/home/sales/product-category",
    requiresPaidForUser: true,
    allowedRoles: ["admin", "business_leader", "manager", "vendor","user"],
    render: ({ userToken }) => <ProductCategory userToken={userToken} />,
  },
  {
    path: "/home/sales/order-type",
    requiresPaidForUser: true,
    allowedRoles: ["admin", "business_leader", "manager", "vendor","user"],
    render: ({ userToken }) => <OrderType userToken={userToken} />,
  },

  // ==== Operations / Labour / Finance / Forecast / etc. ====
  {
    path: "home/operations/day-of-week",
    allowedRoles: ["admin", "regional_manager", "manager","user"],
    render: ({ userToken }) => <DayOfWeek userToken={userToken} />,
  },
  {
    path: "home/operations/part-of-day",
    allowedRoles: ["admin", "regional_manager", "manager","user"],
    render: ({ userToken }) => <PartOfDay userToken={userToken} />,
  },
  {
    path: "home/operations/hour",
    allowedRoles: ["admin", "regional_manager", "manager","user"],
    render: ({ userToken }) => <Hour userToken={userToken} />,
  },
  {
    path: "home/labour/area",
    allowedRoles: ["admin","user"],
    render: ({ userToken }) => <LabourArea userToken={userToken} />,
  },
  // This was only in manager's (unreachable) block earlier, but keeping for future
  {
    path: "/home/labour/location",
    allowedRoles: ["admin", "manager","user"],
    render: ({ userToken }) => <LabourLocation userToken={userToken} />,
  },
  {
    path: "/home/labour/role",
    allowedRoles: ["admin", "manager","user"],
    render: ({ userToken }) => <LabourRole userToken={userToken} />,
  },
  {
    path:"/home/labour/hour",
    allowedRoles:["admin","manager","user"],
    render:({userToken})=><LabourHour userToken={userToken}/>
  },
  {
    path:"/home/inventory/location",
    allowedRoles:["admin","manager"],
    render:({userToken})=><InventoryLocation userToken={userToken}/>
  },
  // {
  //   path:"/home/inventory/category",
  //   allowedRoles:["admin","manager"],
  //   render:({userToken})=><InventoryCategory userToken={userToken}/>
  // },
  // {
  //   path:"/home/inventory/item",
  //   allowedRoles:["admin","manager"],
  //   render:({userToken})=><InventoryItem userToken={userToken}/>
  // },
  // {
  //   path:"/home/inventory/vendor",
  //   allowedRoles:["admin","manager"],
  //   render:({userToken})=><InventoryVendor userToken={userToken}/>
  // },
  {
    path: "home/finance",
    allowedRoles: ["admin", "admin"],
    render: ({ userToken }) => <Finance userToken={userToken} />,
  },
  {
    path: "home/forecast",
    allowedRoles: ["admin"],
    render: ({ userToken }) => <Forecast userToken={userToken} />,
  },
  {
    path: "home/labor-dash",
    allowedRoles: ["admin"],
    render: ({ userToken }) => <LaborDash userToken={userToken} />,
  },
  {
    path: "home/ops.-manager",
    allowedRoles: ["admin"],
    render: ({ userToken }) => <OpsManager userToken={userToken} />,
  },

  // ==== Vendor special advanced routes already covered above ====

  // ==== Modal / dynamic route ====
  {
    path: "/modal/:dynId",
    allowedRoles: ["admin"],
    render: ({ userToken }) => <DynamicRouteHost userToken={userToken} />,
  },
];

export default APP_ROUTES;
