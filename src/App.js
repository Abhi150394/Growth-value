import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Main from "./Components/Layout/Main";
import Signin from "./Pages/Signin";
// import Dashboard from "./Pages/User/Dashboard";
// import Wishlist from "./Pages/User/Wishlist";
// import FAQs from "./Pages/User/FAQs";
// import SearchandCompare from "./Pages/User/Search&Compare";
// import Summary from "./Pages/User/Summary";
// import HelpandSupport from "./Pages/User/Help&Support";
// import Earning from "./Pages/Admin/Earning";
// import Scraping from "./Pages/Admin/Scraping";
// import UserManagement from "./Pages/Admin/UserManagement";
// import AdminDashboard from "./Pages/Admin/Dashboard";
import Home from "./Pages/User/Home";
import PersonalInfo from "./Pages/User/PersonalInfo";
// import PaymentHistory from "./Pages/User/PaymentHistory";
import Subscription from "./Pages/User/Subscription";
import Signup from "./Pages/Signup";
import { useEffect, useState } from "react";
import updateUserStates, {
  handleLogout,
  handleUpdate,
} from "./Utils/updateUserStates";
import "./App.css";
import { userDetails } from "./API/user";
import { refresh } from "./API/auth";
import { decryptText, encryptText } from "./Utils/encryption";
import axios from "axios";
// import Payment from "./Pages/User/Payment/Payment";
// import Plans from "./Pages/User/Payment/Plans";
// import Success from "./Pages/User/Payment/Success";
import PaymentWarningModal from "./Components/Common/paymentErrorModal";
import { ConfigProvider } from "antd";
// import Demo from "./Pages/Demo/Demo";
import ResetPassword from "./Pages/ResetPassword";
// import SalesPage from "./Pages/User/TenjoDummy";
// import Area from "./Pages/User/Sales/Area";
// import Location from "./Pages/User/Sales/Location";
// import ProductDivision from "./Pages/User/Sales/ProductDivision";
// import OrderType from "./Pages/User/Sales/OrderType";
// import RevenueCenter from "./Pages/User/Sales/RevenueCenter";
// import ProductCategory from "./Pages/User/Sales/ProductCategory";
// import SalesDashboard from "./Pages/User/Sales/TestingWithRealData";
// import Finance from "./Pages/User/Finance/Finance";
// import Forecast from "./Pages/User/Forecast/Forecast";
// import LaborDash from "./Pages/User/Labor Dash/LaborDash";
// import OpsManager from "./Pages/User/Ops Manager/OpsManager";
// import DynamicRouteHost from "./Components/Modals/DynamicRouteHost";
// import DayOfWeek from "./Pages/User/Operations/DayOfWeek";
// import PartOfDay from "./Pages/User/Operations/PartOfDay";
// import Hour from "./Pages/User/Operations/Hour";
// import LabourArea from "./Pages/User/Labour/Area";
// import LabourLocation from "./Pages/User/Labour/Location";
import APP_ROUTES from "./routeConfig";
const ROLE_ACCESS_MAP = Object.freeze({
  superadmin: "admin",
  admin: "admin",
  business_leader: "business_leader",
  regional_manager: "regional_manager",
  manager: "manager",
  vendor: "vendor",
  user: "user",
});

/**
 * Central route config:
 * - path: react-router path
 * - allowedRoles: which resolvedRole values can see this
 * - requiresPaidForUser: extra flag that says "user role must be paid to access"
 * - render: function returning the element to render
 */
// const APP_ROUTES = [
//   // ==== Common/User/Admin basic app routes (paid for user) ====
//   {
//     path: "/dashboard",
//     allowedRoles: [
//       "user",
//       "admin",
//       "business_leader",
//       "regional_manager",
//       "manager",
//       "vendor",
//     ],
//     requiresPaidForUser: true,
//     render: ({ userToken, userData, search, setSearch, user }) => (
//       <Dashboard
//         userToken={userToken}
//         userData={userData}
//         search={search}
//         setSearch={setSearch}
//         user={user}
//       />
//     ),
//   },
//   {
//     path: "/search&compare",
//     allowedRoles: ["user", "admin"],
//     requiresPaidForUser: true,
//     render: ({ userToken, userData, search, setSearch }) => (
//       <SearchandCompare
//         userToken={userToken}
//         userData={userData}
//         search={search}
//         setSearch={setSearch}
//       />
//     ),
//   },
//   {
//     path: "/summary",
//     allowedRoles: ["user", "admin"],
//     requiresPaidForUser: true,
//     render: ({ userToken, userData, search, setSearch }) => (
//       <Summary
//         userToken={userToken}
//         userData={userData}
//         search={search}
//         setSearch={setSearch}
//       />
//     ),
//   },
//   {
//     path: "/help&support",
//     allowedRoles: ["user", "admin"],
//     requiresPaidForUser: true,
//     render: ({ userToken, userData }) => (
//       <HelpandSupport userToken={userToken} userData={userData} />
//     ),
//   },
//   {
//     path: "/faqs",
//     allowedRoles: [
//       "user",
//       "admin",
//       "business_leader",
//       "regional_manager",
//       "manager",
//       "vendor",
//     ],
//     requiresPaidForUser: true, // for user role only; others ignore this flag
//     render: ({ userToken, userData }) => (
//       <FAQs userToken={userToken} userData={userData} />
//     ),
//   },
//   {
//     path: "/wishlist",
//     allowedRoles: ["user", "admin", "vendor"],
//     requiresPaidForUser: true,
//     render: ({ userToken, userData }) => (
//       <Wishlist userToken={userToken} userData={userData} />
//     ),
//   },

//   // ==== Payment / subscription routes (do NOT require paid for user) ====
//   {
//     path: "/home",
//     // For admin and unpaid user landing (original code had both)
//     allowedRoles: ["admin", "user"],
//     requiresPaidForUser: false,
//     render: ({ userToken, userData }) => (
//       <AdminDashboard userToken={userToken} userData={userData} />
//     ),
//   },
//   {
//     path: "/checkoutForm",
//     allowedRoles: ["user", "admin"],
//     requiresPaidForUser: false,
//     render: ({ userToken, userData }) => (
//       <Payment userToken={userToken} userData={userData} />
//     ),
//   },
//   {
//     path: "/demo",
//     allowedRoles: ["user", "admin"],
//     requiresPaidForUser: false,
//     render: ({ userToken, userData }) => (
//       <Demo userToken={userToken} userData={userData} />
//     ),
//   },
//   {
//     path: "/plans",
//     allowedRoles: ["user"],
//     requiresPaidForUser: false,
//     render: ({ userToken, userData }) => (
//       <Plans userToken={userToken} userData={userData} />
//     ),
//   },
//   {
//     path: "/success/:checkout_id",
//     allowedRoles: ["user"],
//     requiresPaidForUser: false,
//     render: ({ userToken, userData, setUserData }) => (
//       <Success
//         userToken={userToken}
//         userData={userData}
//         setUserData={setUserData}
//       />
//     ),
//   },

//   // ==== Admin-only routes ====
//   {
//     path: "/scraping",
//     allowedRoles: ["admin"],
//     render: ({ userToken, userData }) => (
//       <Scraping userToken={userToken} userData={userData} />
//     ),
//   },
//   {
//     path: "/user-management",
//     allowedRoles: ["admin"],
//     render: ({ userToken, userData }) => (
//       <UserManagement userToken={userToken} userData={userData} />
//     ),
//   },
//   {
//     path: "/account/subscription",
//     allowedRoles: ["admin"],
//     render: ({ userToken, userData, setUserData }) => (
//       <Subscription
//         userToken={userToken}
//         userData={userData}
//         setUserData={setUserData}
//       />
//     ),
//   },
//   // Uncomment if you later use Earning page
//   // {
//   //   path: "/earning",
//   //   allowedRoles: ["admin"],
//   //   render: ({ userToken, userData }) => (
//   //     <Earning userToken={userToken} userData={userData} />
//   //   ),
//   // },

//   // ==== Admin Advanced routes ====
//   {
//     path: "/home/advanced/scraping",
//     allowedRoles: ["admin"],
//     render: ({ userToken, userData }) => (
//       <Scraping userToken={userToken} userData={userData} />
//     ),
//   },
//   {
//     path: "home/advanced/user-management",
//     allowedRoles: ["admin"],
//     render: ({ userToken, userData }) => (
//       <UserManagement userToken={userToken} userData={userData} />
//     ),
//   },
//   {
//     path: "home/advanced/dashboard",
//     allowedRoles: ["admin", "vendor"],
//     render: ({ userToken, userData, search, setSearch, user }) => (
//       <Dashboard
//         userToken={userToken}
//         userData={userData}
//         search={search}
//         setSearch={setSearch}
//         user={user}
//       />
//     ),
//   },
//   {
//     path: "home/advanced/search&compare",
//     allowedRoles: ["admin"],
//     render: ({ userToken, userData, search, setSearch }) => (
//       <SearchandCompare
//         userToken={userToken}
//         userData={userData}
//         search={search}
//         setSearch={setSearch}
//       />
//     ),
//   },
//   {
//     path: "home/advanced/summary",
//     allowedRoles: ["admin"],
//     render: ({ userToken, userData, search, setSearch }) => (
//       <Summary
//         userToken={userToken}
//         userData={userData}
//         search={search}
//         setSearch={setSearch}
//       />
//     ),
//   },
//   {
//     path: "home/advanced/subscription",
//     allowedRoles: ["admin"],
//     render: ({ userToken, userData, setUserData }) => (
//       <Subscription
//         userToken={userToken}
//         userData={userData}
//         setUserData={setUserData}
//       />
//     ),
//   },
//   {
//     path: "/home/advanced/help&support",
//     allowedRoles: ["admin"],
//     render: ({ userToken, userData }) => (
//       <HelpandSupport userToken={userToken} userData={userData} />
//     ),
//   },
//   {
//     path: "home/advanced/faqs",
//     allowedRoles: ["admin", "vendor"],
//     render: ({ userToken, userData }) => (
//       <FAQs userToken={userToken} userData={userData} />
//     ),
//   },
//   {
//     path: "home/advanced/wishlist",
//     allowedRoles: ["admin", "vendor"],
//     render: ({ userToken, userData }) => (
//       <Wishlist userToken={userToken} userData={userData} />
//     ),
//   },
//   {
//     path: "home/advanced/checkoutForm",
//     allowedRoles: ["admin"],
//     render: ({ userToken, userData }) => (
//       <Payment userToken={userToken} userData={userData} />
//     ),
//   },
//   {
//     path: "home/advanced/demo",
//     allowedRoles: ["admin", "vendor"],
//     render: ({ userToken, userData }) => (
//       <Demo userToken={userToken} userData={userData} />
//     ),
//   },

//   // ==== Sales routes (Admin, Business leader, Manager, Vendor) ====
//   {
//     path: "/home/sales/product-item",
//     allowedRoles: ["admin", "business_leader", "manager", "vendor"],
//     render: ({ userToken }) => <SalesPage userToken={userToken} />,
//   },
//   {
//     path: "/home/sales/area",
//     allowedRoles: ["admin", "business_leader", "manager", "vendor"],
//     render: ({ userToken }) => <Area userToken={userToken} />,
//   },
//   {
//     path: "/home/sales/location",
//     allowedRoles: ["admin", "business_leader", "manager", "vendor"],
//     render: ({ userToken }) => <Location userToken={userToken} />,
//   },
//   {
//     path: "/home/sales/product-division",
//     allowedRoles: ["admin", "business_leader", "manager", "vendor"],
//     render: ({ userToken }) => <ProductDivision userToken={userToken} />,
//   },
//   {
//     path: "/home/sales/revenue-center",
//     allowedRoles: ["admin", "business_leader", "manager", "vendor"],
//     render: ({ userToken }) => <RevenueCenter userToken={userToken} />,
//   },
//   {
//     path: "/home/sales/product-category",
//     allowedRoles: ["admin", "business_leader", "manager", "vendor"],
//     render: ({ userToken }) => <ProductCategory userToken={userToken} />,
//   },
//   {
//     path: "/home/sales/order-type",
//     allowedRoles: ["admin", "business_leader", "manager", "vendor"],
//     render: ({ userToken }) => <OrderType userToken={userToken} />,
//   },

//   // ==== Operations / Labour / Finance / Forecast / etc. ====
//   {
//     path: "home/operations/day-of-week",
//     allowedRoles: ["admin", "regional_manager", "manager"],
//     render: ({ userToken }) => <DayOfWeek userToken={userToken} />,
//   },
//   {
//     path: "home/operations/part-of-day",
//     allowedRoles: ["admin", "regional_manager", "manager"],
//     render: ({ userToken }) => <PartOfDay userToken={userToken} />,
//   },
//   {
//     path: "home/operations/hour",
//     allowedRoles: ["admin", "regional_manager", "manager"],
//     render: ({ userToken }) => <SalesDashboard userToken={userToken} />,
//   },
//   {
//     path: "home/labour/area",
//     allowedRoles: ["admin"],
//     render: ({ userToken }) => <LabourArea userToken={userToken} />,
//   },
//   // This was only in manager's (unreachable) block earlier, but keeping for future
//   {
//     path: "/home/labour/location",
//     allowedRoles: ["manager"],
//     render: ({ userToken }) => <LabourLocation userToken={userToken} />,
//   },
//   {
//     path: "home/finance",
//     allowedRoles: ["admin"],
//     render: ({ userToken }) => <Finance userToken={userToken} />,
//   },
//   {
//     path: "home/forecast",
//     allowedRoles: ["admin"],
//     render: ({ userToken }) => <Forecast userToken={userToken} />,
//   },
//   {
//     path: "home/labor-dash",
//     allowedRoles: ["admin"],
//     render: ({ userToken }) => <LaborDash userToken={userToken} />,
//   },
//   {
//     path: "home/ops.-manager",
//     allowedRoles: ["admin"],
//     render: ({ userToken }) => <OpsManager userToken={userToken} />,
//   },

//   // ==== Vendor special advanced routes already covered above ====

//   // ==== Modal / dynamic route ====
//   {
//     path: "/modal/:dynId",
//     allowedRoles: ["admin"],
//     render: ({ userToken }) => <DynamicRouteHost userToken={userToken} />,
//   },
// ];

function App() {
  const [userData, setUserData] = useState({
    email: "",
    role: "",
    id: 0,
    account: false,
    paid: false,
    payment_status: false,
  });
  const [userToken, setUserToken] = useState({
    access: "",
    refresh: "",
  });

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [search, setSearch] = useState("");
  const [notificationType, setNotificationType] = useState(null);
  const [openWarningModal, setOpenWarningModal] = useState(false);

  const normalizedRole = userData?.role?.toLowerCase() || "";
  const resolvedRole = ROLE_ACCESS_MAP[normalizedRole] || null;

  const isUserBucket = resolvedRole === "user";
  const isAdminBucket = resolvedRole === "admin";
  const isBusinessLeader = resolvedRole === "business_leader";
  const isRegionalManager = resolvedRole === "regional_manager";
  const isManagerBucket = resolvedRole === "manager";
  const isVendor = resolvedRole === "vendor";

  const RoleGate = ({ allowedRoles, fallback = null, children }) => {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!roles.includes(resolvedRole)) {
      return fallback;
    }
    return children;
  };

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (
        error?.response?.status === 401 &&
        error?.response?.data?.detail ===
          "Given token not valid for any token type"
      ) {
        const localStorageItems = localStorage;
        if (localStorageItems.length !== 0) {
          for (let key in localStorageItems) {
            if (localStorageItems[key] && decryptText(key) === "user") {
              localStorage.removeItem(key);
            }
            if (localStorageItems[key] && decryptText(key) === "token") {
              localStorage.removeItem(key);
            }
          }
        }
        window.location.href = "/sign-in";
      }
    }
  );

  const refreshCall = async (x) => {
    if (userToken.access && userToken.refresh && userData.email) {
      const data = await refresh(userToken);
      if (data?.status === 200) {
        const localStorageItems = localStorage;
        if (localStorageItems.length !== 0) {
          for (let key in localStorageItems) {
            if (localStorageItems[key] && decryptText(key) === "token") {
              localStorage.removeItem(key);
            }
          }
        }
        localStorage.setItem(
          encryptText("token"),
          encryptText(
            JSON.stringify({
              access: data?.data?.access,
              refresh: data?.data?.refresh,
            })
          )
        );
        setUserToken({
          access: data?.data?.access,
          refresh: data?.data?.refresh,
        });
        if (
          userData?.paid !== data?.data?.paid ||
          userData?.payment_status !== data?.data?.payment_status
        ) {
          handleUpdate(
            false,
            userData,
            setUserData,
            data?.data?.paid,
            data?.data?.payment_status
          );
        }
      } else {
        handleLogout(setUserData, setUserToken);
        setUser({});
      }
    }
  };

  useEffect(() => {
    const func = async () => {
      if (userData.role === "" || userToken.access === "")
        updateUserStates(setUserData, setUserToken);
    };
    func();
  }, []);

  useEffect(() => {
    if (userToken?.access && userToken?.refresh && userData?.email && loading) {
      refreshCall(1);
    }
    setLoading(false);
  }, [userToken]);

  useEffect(() => {
    userData?.payment_status === false &&
      userData?.paid === true &&
      userData?.email &&
      setOpenWarningModal(true);
  }, [userData]);

  useEffect(() => {
    if (userData?.role && !resolvedRole) {
      handleLogout(setUserData, setUserToken);
      setUser({});
    }
  }, [userData?.role, resolvedRole]);

  useEffect(() => {
    const interval = setInterval(async () => {
      refreshCall(2);
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [userToken, userData, window.location.pathname]);

  useEffect(() => {
    const func = async () => {
      if (userData?.id) {
        const res = await userDetails(userToken, userData?.id);
        setUser(res?.data);
        localStorage.setItem(
          encryptText("loggedUser"),
          encryptText(JSON.stringify(res?.data))
        );
      }
    };
    func();
  }, [userData]);

  const layoutType = isAdminBucket ? "admin" : "user";

  const getDefaultRedirect = () => {
    if (!resolvedRole) return "/sign-in";
    if (resolvedRole === "admin") return "/home";
    if (resolvedRole === "user") return userData.paid ? "/dashboard" : "/plans";
    if (resolvedRole === "vendor") return "/home/advanced/faqs";
    return "/faqs";
  };

  return (
    <div>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#AF8639",
            colorTextBase: "#00000066",
            colorBgLayout: "#FFF",
            colorLink: "#AF8639",
            colorBgContainer: "#F1E4CB",
            colorPrimaryText: "#00000099",
            colorBgBase: "#FFF9ED",
            borderRadiusLG: 20,
            borderRadiusSM: 8,
            fontSizeHeading1: 40,
            fontSizeHeading2: 30,
            fontSizeHeading3: 24,
            fontSizeHeading4: 20,
            fontSizeHeading5: 18,
            fontSizeHeading6: 16,
            fontSizeSM: 12,
            fontSizeLG: 14,
            fontSizeXLG: 16,
            fontSizeXXL: 18,
            fontSizeXXXL: 20,
          },
        }}
      >
        {loading ? null : (
          <BrowserRouter>
            {userData?.account ? (
              // ===== Account settings layout remains separate =====
              <Main
                type={"accounts"}
                setUserData={setUserData}
                userToken={userToken}
                setUserToken={setUserToken}
                userData={userData}
                user={user}
                setUser={setUser}
              >
                <Routes>
                  <Route
                    path="/account/home"
                    element={
                      <Home
                        userToken={userToken}
                        userData={userData}
                        user={user}
                        setUser={setUser}
                      />
                    }
                  />
                  <Route
                    path="/account/personal-info"
                    element={
                      <PersonalInfo
                        userToken={userToken}
                        userData={userData}
                        user={user}
                        setUser={setUser}
                      />
                    }
                  />
                  {/* <Route
                    path="/account/payment-history"
                    element={<PaymentHistory userToken={userToken} />}
                  /> */}
                  {!isAdminBucket && (
                    <Route
                      path="/account/subscription"
                      element={
                        <Subscription
                          userToken={userToken}
                          userData={userData}
                          setUserData={setUserData}
                        />
                      }
                    />
                  )}
                  <Route path="*" element={<Navigate to={"/account/home"} />} />
                </Routes>
              </Main>
            ) : resolvedRole ? (
              // ===== All logged-in roles (admin, user, business_leader, regional_manager, manager, vendor) =====
              <Main
                type={layoutType}
                setUserData={setUserData}
                userData={userData}
                userToken={userToken}
                setUserToken={setUserToken}
                user={user}
                setUser={setUser}
                search={search}
                setSearch={setSearch}
              >
                <Routes>
                  {APP_ROUTES.map((route) => (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={
                        <RoleGate
                          allowedRoles={route.allowedRoles}
                          fallback={
                            <Navigate to={getDefaultRedirect()} replace />
                          }
                        >
                          {route.requiresPaidForUser &&
                          resolvedRole === "user" &&
                          !userData?.paid ? (
                            <Navigate to={"/plans"} replace />
                          ) : (
                            route.render({
                              userToken,
                              userData,
                              user,
                              setUser,
                              search,
                              setSearch,
                              setUserData,
                              resolvedRole,
                            })
                          )}
                        </RoleGate>
                      }
                    />
                  ))}

                  {/* Default fallback per role */}
                  <Route
                    path="*"
                    element={<Navigate to={getDefaultRedirect()} replace />}
                  />
                </Routes>
              </Main>
            ) : (
              // ===== Not logged in: Auth routes =====
              <Routes>
                <Route
                  path="/sign-in"
                  element={
                    <Signin
                      setUserData={setUserData}
                      setUserToken={setUserToken}
                      notificationType={notificationType}
                      setNotificationType={setNotificationType}
                    />
                  }
                />
                <Route
                  path="/sign-up"
                  element={<Signup setNotificationType={setNotificationType} />}
                />
                <Route
                  path="/reset_password/:userId"
                  element={
                    <ResetPassword setNotificationType={setNotificationType} />
                  }
                />
                <Route path="*" element={<Navigate to={"/sign-in"} />} />
              </Routes>
            )}
          </BrowserRouter>
        )}
        {openWarningModal && (
          <PaymentWarningModal
            open={
              !userData?.payment_status &&
              userData?.email.length &&
              userData?.paid
            }
            setUserData={setUserData}
            setUserToken={setUserToken}
          />
        )}
      </ConfigProvider>
    </div>
  );
}

export default App;

// import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import Main from "./Components/Layout/Main";
// import Signin from "./Pages/Signin";
// import Dashboard from "./Pages/User/Dashboard";
// import Wishlist from "./Pages/User/Wishlist";
// import FAQs from "./Pages/User/FAQs";
// import SearchandCompare from "./Pages/User/Search&Compare";
// import Summary from "./Pages/User/Summary";
// import HelpandSupport from "./Pages/User/Help&Support";
// import Earning from "./Pages/Admin/Earning";
// import Scraping from "./Pages/Admin/Scraping";
// import UserManagement from "./Pages/Admin/UserManagement";
// import AdminDashboard from "./Pages/Admin/Dashboard";
// import Home from "./Pages/User/Home";
// import PersonalInfo from "./Pages/User/PersonalInfo";
// import PaymentHistory from "./Pages/User/PaymentHistory";
// import Subscription from "./Pages/User/Subscription";
// import Signup from "./Pages/Signup";
// import { useEffect, useState } from "react";
// import updateUserStates, {
//   handleLogout,
//   handleUpdate,
// } from "./Utils/updateUserStates";
// import "./App.css";
// import { userDetails } from "./API/user";
// import { refresh } from "./API/auth";
// import { decryptText, encryptText } from "./Utils/encryption";
// import axios from "axios";
// import Payment from "./Pages/User/Payment/Payment";
// import Plans from "./Pages/User/Payment/Plans";
// import Success from "./Pages/User/Payment/Success";
// import PaymentWarningModal from "./Components/Common/paymentErrorModal";
// import { ConfigProvider } from "antd";
// import Demo from "./Pages/Demo/Demo";
// import ResetPassword from "./Pages/ResetPassword";
// import SalesPage from "./Pages/User/TenjoDummy";
// import Area from "./Pages/User/Sales/Area";
// import Location from "./Pages/User/Sales/Location";
// import ProductDivision from "./Pages/User/Sales/ProductDivision";
// import OrderType from "./Pages/User/Sales/OrderType";
// import RevenueCenter from "./Pages/User/Sales/RevenueCenter";
// import ProductCategory from "./Pages/User/Sales/ProductCategory";
// import SalesDashboard from "./Pages/User/Sales/TestingWithRealData";
// import Finance from "./Pages/User/Finance/Finance";
// import Forecast from "./Pages/User/Forecast/Forecast";
// import LaborDash from "./Pages/User/Labor Dash/LaborDash";
// import OpsManager from "./Pages/User/Ops Manager/OpsManager";
// import DynamicRouteHost from "./Components/Modals/DynamicRouteHost";
// import DayOfWeek from "./Pages/User/Operations/DayOfWeek";
// import PartOfDay from "./Pages/User/Operations/PartOfDay";
// import Hour from "./Pages/User/Operations/Hour";
// import LabourArea from "./Pages/User/Labour/Area";
// import LabourLocation from "./Pages/User/Labour/Location";

// const ROLE_ACCESS_MAP = Object.freeze({
//   superadmin: "admin",
//   admin: "admin",
//   business_leader: "business_leader",
//   regional_manager: "regional_manager",
//   manager: "manager",
//   vendor: "vendor",
//   user: "user",
// });

// function App() {
//   const [userData, setUserData] = useState({
//     email: "",
//     role: "",
//     id: 0,
//     account: false,
//     paid: false,
//     payment_status: false,
//   });
//   const [userToken, setUserToken] = useState({
//     access: "",
//     refresh: "",
//   });

//   console.log("userDatauserData", userData);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState({});
//   const [search, setSearch] = useState("");
//   const [notificationType, setNotificationType] = useState(null);
//   const [openWarningModal, setOpenWarningModal] = useState(false);
//   const normalizedRole = userData?.role?.toLowerCase() || "";
//   const resolvedRole = ROLE_ACCESS_MAP[normalizedRole] || null;
//   const isUserBucket = resolvedRole === "user";
//   const isAdminBucket = resolvedRole === "admin";
//   const isBusinessLeader = resolvedRole === "business_leader";
//   const isRegionalManager = resolvedRole === "regional_manager";
//   const isManagerBucket = resolvedRole === "manager";
//   const isVendor = resolvedRole === "vendor";

//   const RoleGate = ({ allowedRoles, fallback = null, children }) => {
//     const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
//     if (!roles.includes(resolvedRole)) {
//       return fallback;
//     }
//     return children;
//   };

//   axios.interceptors.response.use(
//     (response) => {
//       return response;
//     },
//     (error) => {
//       if (
//         error?.response?.status === 401 &&
//         error?.response?.data?.detail ===
//           "Given token not valid for any token type"
//       ) {
//         const localStorageItems = localStorage;
//         if (localStorageItems.length !== 0) {
//           for (let key in localStorageItems) {
//             if (localStorageItems[key] && decryptText(key) === "user") {
//               localStorage.removeItem(key);
//             }
//             if (localStorageItems[key] && decryptText(key) === "token") {
//               localStorage.removeItem(key);
//             }
//           }
//         }
//         window.location.href = "/sign-in";
//       }
//     }
//   );

//   const refreshCall = async (x) => {
//     if (userToken.access && userToken.refresh && userData.email) {
//       const data = await refresh(userToken);
//       if (data?.status === 200) {
//         const localStorageItems = localStorage;
//         if (localStorageItems.length !== 0) {
//           for (let key in localStorageItems) {
//             if (localStorageItems[key] && decryptText(key) === "token") {
//               localStorage.removeItem(key);
//             }
//           }
//         }
//         localStorage.setItem(
//           encryptText("token"),
//           encryptText(
//             JSON.stringify({
//               access: data?.data?.access,
//               refresh: data?.data?.refresh,
//             })
//           )
//         );
//         setUserToken({
//           access: data?.data?.access,
//           refresh: data?.data?.refresh,
//         });
//         if (
//           userData?.paid !== data?.data?.paid ||
//           userData?.payment_status !== data?.data?.payment_status
//         ) {
//           handleUpdate(
//             false,
//             userData,
//             setUserData,
//             data?.data?.paid,
//             data?.data?.payment_status
//           );
//         }
//       } else {
//         handleLogout(setUserData, setUserToken);
//         setUser({});
//       }
//     }
//   };

//   useEffect(() => {
//     const func = async () => {
//       if (userData.role === "" || userToken.access === "")
//         updateUserStates(setUserData, setUserToken);
//     };
//     func();
//   }, []);

//   useEffect(() => {
//     if (userToken?.access && userToken?.refresh && userData?.email && loading) {
//       refreshCall(1);
//     }
//     setLoading(false);
//   }, [userToken]);

//   useEffect(() => {
//     userData?.payment_status === false &&
//       userData?.paid === true &&
//       userData?.email &&
//       setOpenWarningModal(true);
//   }, [userData]);

//   useEffect(() => {
//     if (userData?.role && !resolvedRole) {
//       handleLogout(setUserData, setUserToken);
//       setUser({});
//     }
//   }, [userData?.role, resolvedRole]);

//   useEffect(() => {
//     const interval = setInterval(async () => {
//       refreshCall(2);
//     }, 60000);

//     return () => {
//       clearInterval(interval);
//     };
//   }, [userToken, userData, window.location.pathname]);

//   useEffect(() => {
//     const func = async () => {
//       if (userData?.id) {
//         const res = await userDetails(userToken, userData?.id);
//         setUser(res?.data);
//         localStorage.setItem(
//           encryptText("loggedUser"),
//           encryptText(JSON.stringify(res?.data))
//         );
//       }
//     };
//     func();
//   }, [userData]);

//   return (
//     <div>
//       <ConfigProvider
//         theme={{
//           token: {
//             colorPrimary: "#AF8639",
//             colorTextBase: "#00000066",
//             colorBgLayout: "#FFF",
//             colorLink: "#AF8639",
//             colorBgContainer: "#F1E4CB",
//             colorPrimaryText: "#00000099",
//             colorBgBase: "#FFF9ED",
//             borderRadiusLG: 20,
//             borderRadiusSM: 8,
//             fontSizeHeading1: 40,
//             fontSizeHeading2: 30,
//             fontSizeHeading3: 24,
//             fontSizeHeading4: 20,
//             fontSizeHeading5: 18,
//             fontSizeHeading6: 16,
//             fontSizeSM: 12,
//             fontSizeLG: 14,
//             fontSizeXLG: 16,
//             fontSizeXXL: 18,
//             fontSizeXXXL: 20,
//           },
//         }}
//       >
//         {loading ? null : (
//           <BrowserRouter>
//             {userData?.account ? (
//               <Main
//                 type={"accounts"}
//                 setUserData={setUserData}
//                 userToken={userToken}
//                 setUserToken={setUserToken}
//                 userData={userData}
//                 user={user}
//                 setUser={setUser}
//               >
//                 <Routes>
//                   {/* Account Settings Pages */}
//                   <Route
//                     path="/account/home"
//                     element={
//                       <Home
//                         userToken={userToken}
//                         userData={userData}
//                         user={user}
//                         setUser={setUser}
//                       />
//                     }
//                   />
//                   <Route
//                     path="/account/personal-info"
//                     element={
//                       <PersonalInfo
//                         userToken={userToken}
//                         userData={userData}
//                         user={user}
//                         setUser={setUser}
//                       />
//                     }
//                   />
//                   {/* <Route
//                   path="/account/payment-history"
//                   element={<PaymentHistory userToken={userToken} />}
//                 /> */}
//                   {!isAdminBucket && (
//                     <Route
//                       path="/account/subscription"
//                       element={
//                         <Subscription
//                           userToken={userToken}
//                           userData={userData}
//                           setUserData={setUserData}
//                         />
//                       }
//                     />
//                   )}

//                   <Route path="*" element={<Navigate to={"/account/home"} />} />
//                 </Routes>
//               </Main>
//             ) : isUserBucket ? (
//               userData.paid ? (
//                 <RoleGate
//                   allowedRoles={["user"]}
//                   fallback={<Navigate to={"/sign-in"} replace />}
//                 >
//                   <Main
//                     type={"user"}
//                     setUserData={setUserData}
//                     userData={userData}
//                     userToken={userToken}
//                     setUserToken={setUserToken}
//                     user={user}
//                     setUser={setUser}
//                     search={search}
//                     setSearch={setSearch}
//                   >
//                     <Routes>
//                       {/* User Pages */}
//                       <Route
//                         path="/dashboard"
//                         element={
//                           <Dashboard
//                             userToken={userToken}
//                             userData={userData}
//                             search={search}
//                             setSearch={setSearch}
//                             user={user}
//                           />
//                         }
//                       />
//                       <Route
//                         path="/search&compare"
//                         element={
//                           <SearchandCompare
//                             userToken={userToken}
//                             userData={userData}
//                             search={search}
//                             setSearch={setSearch}
//                           />
//                         }
//                       />
//                       <Route
//                         path="/summary"
//                         element={
//                           <Summary
//                             userToken={userToken}
//                             userData={userData}
//                             search={search}
//                             setSearch={setSearch}
//                           />
//                         }
//                       />
//                       <Route
//                         path="/help&support"
//                         element={
//                           <HelpandSupport
//                             userToken={userToken}
//                             userData={userData}
//                           />
//                         }
//                       />
//                       <Route
//                         path="/faqs"
//                         element={
//                           <FAQs userToken={userToken} userData={userData} />
//                         }
//                       />
//                       <Route
//                         path="/wishlist"
//                         element={
//                           <Wishlist userToken={userToken} userData={userData} />
//                         }
//                       />
//                       {normalizedRole === "manager" && (
//                         <>
//                           <Route
//                             path="/home/operations/day-of-week"
//                             element={<DayOfWeek userToken={userToken} />}
//                           />
//                           <Route
//                             path="/home/operations/part-of-day"
//                             element={<PartOfDay userToken={userToken} />}
//                           />
//                           <Route
//                             path="/home/operations/hour"
//                             element={<Hour userToken={userToken} />}
//                           />
//                           <Route
//                             path="/home/labour/area"
//                             element={<LabourArea userToken={userToken} />}
//                           />
//                           <Route
//                             path="/home/labour/location"
//                             element={<LabourLocation userToken={userToken} />}
//                           />
//                         </>
//                       )}
//                       <Route
//                         path="*"
//                         element={<Navigate to={"/dashboard"} />}
//                       />
//                     </Routes>
//                   </Main>
//                 </RoleGate>
//               ) : (
//                 <RoleGate
//                   allowedRoles={["user"]}
//                   fallback={<Navigate to={"/sign-in"} replace />}
//                 >
//                   <Main
//                     // type={"payment"}
//                     type={"user"}
//                     setUserData={setUserData}
//                     userToken={userToken}
//                     setUserToken={setUserToken}
//                     userData={userData}
//                     user={user}
//                     setUser={setUser}
//                   >
//                     <Routes>
//                       <Route
//                         path="/home"
//                         element={
//                           <AdminDashboard
//                             userToken={userToken}
//                             userData={userData}
//                           />
//                         }
//                       />
//                       <Route
//                         path="/checkoutForm"
//                         element={
//                           <Payment userToken={userToken} userData={userData} />
//                         }
//                       />
//                       <Route
//                         path="/demo"
//                         element={
//                           <Demo userToken={userToken} userData={userData} />
//                         }
//                       />
//                       <Route
//                         path="/plans"
//                         element={
//                           <Plans userToken={userToken} userData={userData} />
//                         }
//                       />
//                       <Route
//                         path="/success/:checkout_id"
//                         element={
//                           <Success
//                             userToken={userToken}
//                             userData={userData}
//                             setUserData={setUserData}
//                           />
//                         }
//                       />
//                       <Route path="*" element={<Navigate to={"/plans"} />} />
//                     </Routes>
//                   </Main>
//                 </RoleGate>
//               )
//             ) : isAdminBucket ? (
//               <RoleGate
//                 allowedRoles={["admin"]}
//                 fallback={<Navigate to={"/sign-in"} replace />}
//               >
//                 <Main
//                   type={"admin"}
//                   setUserData={setUserData}
//                   userData={userData}
//                   userToken={userToken}
//                   setUserToken={setUserToken}
//                   user={user}
//                   setUser={setUser}
//                 >
//                   <Routes>
//                     {/* Admin Pages */}
//                     <Route
//                       path="/home"
//                       element={
//                         <AdminDashboard
//                           userToken={userToken}
//                           userData={userData}
//                         />
//                       }
//                     />
//                     {/* <Route
//                   path="/earning"
//                   element={
//                     <Earning userToken={userToken} userData={userData} />
//                   }
//                 /> */}
//                     <Route
//                       path="/scraping"
//                       element={
//                         <Scraping userToken={userToken} userData={userData} />
//                       }
//                     />
//                     <Route
//                       path="/user-management"
//                       element={
//                         <UserManagement
//                           userToken={userToken}
//                           userData={userData}
//                         />
//                       }
//                     />
//                     {/* ========================================================================================== */}
//                     <Route
//                       path="/home/advanced/scraping"
//                       element={
//                         <Scraping userToken={userToken} userData={userData} />
//                       }
//                     />
//                     <Route
//                       path="home/advanced/user-management"
//                       element={
//                         <UserManagement
//                           userToken={userToken}
//                           userData={userData}
//                         />
//                       }
//                     />
//                     <Route
//                       path="home/advanced/dashboard"
//                       element={
//                         <Dashboard
//                           userToken={userToken}
//                           userData={userData}
//                           search={search}
//                           setSearch={setSearch}
//                           user={user}
//                         />
//                       }
//                     />
//                     <Route
//                       path="home/advanced/search&compare"
//                       element={
//                         <SearchandCompare
//                           userToken={userToken}
//                           userData={userData}
//                           search={search}
//                           setSearch={setSearch}
//                         />
//                       }
//                     />
//                     <Route
//                       path="home/advanced/summary"
//                       element={
//                         <Summary
//                           userToken={userToken}
//                           userData={userData}
//                           search={search}
//                           setSearch={setSearch}
//                         />
//                       }
//                     />
//                     <Route
//                       path="home/advanced/subscription"
//                       element={
//                         <Subscription
//                           userToken={userToken}
//                           userData={userData}
//                           setUserData={setUserData}
//                         />
//                       }
//                     />
//                     <Route
//                       path="/home/advanced/help&support"
//                       element={
//                         <HelpandSupport
//                           userToken={userToken}
//                           userData={userData}
//                         />
//                       }
//                     />
//                     <Route
//                       path="home/advanced/faqs"
//                       element={
//                         <FAQs userToken={userToken} userData={userData} />
//                       }
//                     />
//                     <Route
//                       path="home/advanced/wishlist"
//                       element={
//                         <Wishlist userToken={userToken} userData={userData} />
//                       }
//                     />

//                     <Route
//                       path="home/advanced/checkoutForm"
//                       element={
//                         <Payment userToken={userToken} userData={userData} />
//                       }
//                     />
//                     <Route
//                       path="home/advanced/demo"
//                       element={
//                         <Demo userToken={userToken} userData={userData} />
//                       }
//                     />

//                     <Route
//                       path="/home/sales/product-item"
//                       element={<SalesPage userToken={userToken} />}
//                     />
//                     <Route
//                       path="/home/sales/area"
//                       element={<Area userToken={userToken} />}
//                     />
//                     <Route
//                       path="/home/sales/location"
//                       element={<Location userToken={userToken} />}
//                     />
//                     <Route
//                       path="/home/sales/product-division"
//                       element={<ProductDivision userToken={userToken} />}
//                     />
//                     <Route
//                       path="/home/sales/revenue-center"
//                       element={<RevenueCenter userToken={userToken} />}
//                     />
//                     <Route
//                       path="/home/sales/product-category"
//                       element={<ProductCategory userToken={userToken} />}
//                     />
//                     <Route
//                       path="/home/sales/order-type"
//                       element={<OrderType userToken={userToken} />}
//                     />
//                     <Route
//                       path="home/operations/day-of-week"
//                       element={<DayOfWeek userToken={userToken} />}
//                     />
//                     <Route
//                       path="home/operations/part-of-day"
//                       element={<PartOfDay userToken={userToken} />}
//                     />
//                     <Route
//                       path="home/operations/hour"
//                       element={<SalesDashboard userToken={userToken} />}
//                     />
//                     <Route
//                       path="home/labour/area"
//                       element={<LabourArea userToken={userToken} />}
//                     />
//                     <Route
//                       path="home/finance"
//                       element={<Finance userToken={userToken} />}
//                     />
//                     <Route
//                       path="home/forecast"
//                       element={<Forecast userToken={userToken} />}
//                     />
//                     <Route
//                       path="home/labor-dash"
//                       element={<LaborDash userToken={userToken} />}
//                     />
//                     <Route
//                       path="home/ops.-manager"
//                       element={<OpsManager userToken={userToken} />}
//                     />

//                     <Route
//                       path="/modal/:dynId"
//                       element={<DynamicRouteHost userToken={userToken} />}
//                     />

//                     <Route
//                       path="/dashboard"
//                       element={
//                         <Dashboard
//                           userToken={userToken}
//                           userData={userData}
//                           search={search}
//                           setSearch={setSearch}
//                           user={user}
//                         />
//                       }
//                     />
//                     <Route
//                       path="/search&compare"
//                       element={
//                         <SearchandCompare
//                           userToken={userToken}
//                           userData={userData}
//                           search={search}
//                           setSearch={setSearch}
//                         />
//                       }
//                     />
//                     <Route
//                       path="/summary"
//                       element={
//                         <Summary
//                           userToken={userToken}
//                           userData={userData}
//                           search={search}
//                           setSearch={setSearch}
//                         />
//                       }
//                     />
//                     <Route
//                       path="/account/subscription"
//                       element={
//                         <Subscription
//                           userToken={userToken}
//                           userData={userData}
//                           setUserData={setUserData}
//                         />
//                       }
//                     />
//                     <Route
//                       path="/help&support"
//                       element={
//                         <HelpandSupport
//                           userToken={userToken}
//                           userData={userData}
//                         />
//                       }
//                     />
//                     <Route
//                       path="/faqs"
//                       element={
//                         <FAQs userToken={userToken} userData={userData} />
//                       }
//                     />
//                     <Route
//                       path="/wishlist"
//                       element={
//                         <Wishlist userToken={userToken} userData={userData} />
//                       }
//                     />
//                     {/* -================================================================================================ */}
//                     <Route path="*" element={<Navigate to={"/home"} />} />
//                   </Routes>
//                 </Main>
//               </RoleGate>
//             ) : isBusinessLeader ? (
//               <Main
//                 type={"user"}
//                 setUserData={setUserData}
//                 userData={userData}
//                 userToken={userToken}
//                 setUserToken={setUserToken}
//                 user={user}
//                 setUser={setUser}
//                 search={search}
//                 setSearch={setSearch}
//               >
//                 <Routes>
//                   {/* User Pages */}
//                   <Route
//                     path="/dashboard"
//                     element={
//                       <Dashboard
//                         userToken={userToken}
//                         userData={userData}
//                         search={search}
//                         setSearch={setSearch}
//                         user={user}
//                       />
//                     }
//                   />
//                   <Route
//                     path="/home/sales/product-item"
//                     element={<SalesPage userToken={userToken} />}
//                   />
//                   <Route
//                     path="/home/sales/area"
//                     element={<Area userToken={userToken} />}
//                   />
//                   <Route
//                     path="/home/sales/location"
//                     element={<Location userToken={userToken} />}
//                   />
//                   <Route
//                     path="/home/sales/product-division"
//                     element={<ProductDivision userToken={userToken} />}
//                   />
//                   <Route
//                     path="/home/sales/revenue-center"
//                     element={<RevenueCenter userToken={userToken} />}
//                   />
//                   <Route
//                     path="/home/sales/product-category"
//                     element={<ProductCategory userToken={userToken} />}
//                   />
//                   <Route
//                     path="/home/sales/order-type"
//                     element={<OrderType userToken={userToken} />}
//                   />
//                   <Route
//                     path="/faqs"
//                     element={<FAQs userToken={userToken} userData={userData} />}
//                   />

//                   <Route path="*" element={<Navigate to={"/faqs"} />} />
//                 </Routes>
//               </Main>
//             ) : isRegionalManager ? (
//               <Main
//                 type={"user"}
//                 setUserData={setUserData}
//                 userData={userData}
//                 userToken={userToken}
//                 setUserToken={setUserToken}
//                 user={user}
//                 setUser={setUser}
//                 search={search}
//                 setSearch={setSearch}
//               >
//                 <Routes>
//                   {/* User Pages */}
//                   <Route
//                     path="/dashboard"
//                     element={
//                       <Dashboard
//                         userToken={userToken}
//                         userData={userData}
//                         search={search}
//                         setSearch={setSearch}
//                         user={user}
//                       />
//                     }
//                   />
//                   <Route
//                     path="home/operations/day-of-week"
//                     element={<DayOfWeek userToken={userToken} />}
//                   />
//                   <Route
//                     path="home/operations/part-of-day"
//                     element={<PartOfDay userToken={userToken} />}
//                   />
//                   <Route
//                     path="home/operations/hour"
//                     element={<SalesDashboard userToken={userToken} />}
//                   />
//                   <Route
//                     path="/faqs"
//                     element={<FAQs userToken={userToken} userData={userData} />}
//                   />

//                   <Route path="*" element={<Navigate to={"/faqs"} />} />
//                 </Routes>
//               </Main>
//             ) : isManagerBucket ? (
//               <Main
//                 type={"user"}
//                 setUserData={setUserData}
//                 userData={userData}
//                 userToken={userToken}
//                 setUserToken={setUserToken}
//                 user={user}
//                 setUser={setUser}
//                 search={search}
//                 setSearch={setSearch}
//               >
//                 <Routes>
//                   {/* User Pages */}
//                   <Route
//                     path="/dashboard"
//                     element={
//                       <Dashboard
//                         userToken={userToken}
//                         userData={userData}
//                         search={search}
//                         setSearch={setSearch}
//                         user={user}
//                       />
//                     }
//                   />
//                   <Route
//                     path="/home/sales/product-item"
//                     element={<SalesPage userToken={userToken} />}
//                   />
//                   <Route
//                     path="/home/sales/area"
//                     element={<Area userToken={userToken} />}
//                   />
//                   <Route
//                     path="/home/sales/location"
//                     element={<Location userToken={userToken} />}
//                   />
//                   <Route
//                     path="/home/sales/product-division"
//                     element={<ProductDivision userToken={userToken} />}
//                   />
//                   <Route
//                     path="/home/sales/revenue-center"
//                     element={<RevenueCenter userToken={userToken} />}
//                   />
//                   <Route
//                     path="/home/sales/product-category"
//                     element={<ProductCategory userToken={userToken} />}
//                   />
//                   <Route
//                     path="/home/sales/order-type"
//                     element={<OrderType userToken={userToken} />}
//                   />
//                   <Route
//                     path="home/operations/day-of-week"
//                     element={<DayOfWeek userToken={userToken} />}
//                   />
//                   <Route
//                     path="home/operations/part-of-day"
//                     element={<PartOfDay userToken={userToken} />}
//                   />
//                   <Route
//                     path="home/operations/hour"
//                     element={<SalesDashboard userToken={userToken} />}
//                   />
//                   <Route
//                     path="/faqs"
//                     element={<FAQs userToken={userToken} userData={userData} />}
//                   />

//                   <Route path="*" element={<Navigate to={"/faqs"} />} />
//                 </Routes>
//               </Main>
//             ) : isVendor ? (
//               <Main
//                 type={"user"}
//                 setUserData={setUserData}
//                 userData={userData}
//                 userToken={userToken}
//                 setUserToken={setUserToken}
//                 user={user}
//                 setUser={setUser}
//                 search={search}
//                 setSearch={setSearch}
//               >
//                 <Routes>
//                   {/* User Pages */}
//                   <Route
//                     path="home/advanced/dashboard"
//                     element={
//                       <Dashboard
//                         userToken={userToken}
//                         userData={userData}
//                         search={search}
//                         setSearch={setSearch}
//                         user={user}
//                       />
//                     }
//                   />

//                   <Route
//                     path="home/advanced/faqs"
//                     element={<FAQs userToken={userToken} userData={userData} />}
//                   />
//                   <Route
//                     path="home/advanced/wishlist"
//                     element={
//                       <Wishlist userToken={userToken} userData={userData} />
//                     }
//                   />
//                   <Route
//                     path="home/advanced/demo"
//                     element={<Demo userToken={userToken} userData={userData} />}
//                   />
//                   <Route
//                     path="/home/sales/product-item"
//                     element={<SalesPage userToken={userToken} />}
//                   />
//                   <Route
//                     path="/home/sales/area"
//                     element={<Area userToken={userToken} />}
//                   />
//                   <Route
//                     path="/home/sales/location"
//                     element={<Location userToken={userToken} />}
//                   />
//                   <Route
//                     path="/home/sales/product-division"
//                     element={<ProductDivision userToken={userToken} />}
//                   />
//                   <Route
//                     path="/home/sales/revenue-center"
//                     element={<RevenueCenter userToken={userToken} />}
//                   />
//                   <Route
//                     path="/home/sales/product-category"
//                     element={<ProductCategory userToken={userToken} />}
//                   />
//                   <Route
//                     path="/home/sales/order-type"
//                     element={<OrderType userToken={userToken} />}
//                   />
//                   <Route
//                     path="/faqs"
//                     element={<FAQs userToken={userToken} userData={userData} />}
//                   />

//                   <Route
//                     path="*"
//                     element={<Navigate to={"/home/advanced/faqs"} />}
//                   />
//                 </Routes>
//               </Main>
//             ) : (
//               <Routes>
//                 <Route
//                   path="/sign-in"
//                   element={
//                     <Signin
//                       setUserData={setUserData}
//                       setUserToken={setUserToken}
//                       notificationType={notificationType}
//                       setNotificationType={setNotificationType}
//                     />
//                   }
//                 />
//                 <Route
//                   path="/sign-up"
//                   element={<Signup setNotificationType={setNotificationType} />}
//                 />
//                 <Route
//                   path="/reset_password/:userId"
//                   element={
//                     <ResetPassword setNotificationType={setNotificationType} />
//                   }
//                 />
//                 <Route path="*" element={<Navigate to={"/sign-in"} />} />
//               </Routes>
//             )}
//           </BrowserRouter>
//         )}
//         {openWarningModal && (
//           <PaymentWarningModal
//             open={
//               !userData?.payment_status &&
//               userData?.email.length &&
//               userData?.paid
//             }
//             setUserData={setUserData}
//             setUserToken={setUserToken}
//           />
//         )}
//       </ConfigProvider>
//     </div>
//   );
// }

// export default App;
