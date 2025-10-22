import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Main from "./Components/Layout/Main";
import Signin from "./Pages/Signin";
import Dashboard from "./Pages/User/Dashboard";
import Wishlist from "./Pages/User/Wishlist";
import FAQs from "./Pages/User/FAQs";
import SearchandCompare from "./Pages/User/Search&Compare";
import Summary from "./Pages/User/Summary";
import HelpandSupport from "./Pages/User/Help&Support";
import Earning from "./Pages/Admin/Earning";
import Scraping from "./Pages/Admin/Scraping";
import UserManagement from "./Pages/Admin/UserManagement";
import AdminDashboard from "./Pages/Admin/Dashboard";
import Home from "./Pages/User/Home";
import PersonalInfo from "./Pages/User/PersonalInfo";
import PaymentHistory from "./Pages/User/PaymentHistory";
import Subscription from "./Pages/User/Subscription";
import Signup from "./Pages/Signup";
import { useEffect, useState } from "react";
import updateUserStates, {
  handleLogout,
  handleUpdate,
} from "./Utils/updateUserStates";
import { userDetails } from "./API/user";
import { refresh } from "./API/auth";
import { decryptText, encryptText } from "./Utils/encryption";
import axios from "axios";
import Payment from "./Pages/User/Payment/Payment";
import Plans from "./Pages/User/Payment/Plans";
import Success from "./Pages/User/Payment/Success";
import PaymentWarningModal from "./Components/Common/paymentErrorModal";
import { ConfigProvider } from "antd";
import Demo from "./Pages/Demo/Demo";
import ResetPassword from "./Pages/ResetPassword";

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
        localStorage.setItem(encryptText("loggedUser"), encryptText(JSON.stringify(res?.data)))
      }
    };
    func();
  }, [userData]);

  return (
    <div>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#AF8639',
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

          }
        }}
      >
        {loading ? null : (
          <BrowserRouter>
            {userData?.account ? (
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
                  {/* Account Settings Pages */}
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
                  {userData?.role !== "admin" && (
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
            ) : userData?.role === "user" ? (
              userData.paid ? (
                <Main
                  type={"user"}
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
                    {/* User Pages */}
                    <Route
                      path="/dashboard"
                      element={
                        <Dashboard
                          userToken={userToken}
                          userData={userData}
                          search={search}
                          setSearch={setSearch}
                          user={user}
                        />
                      }
                    />
                    <Route
                      path="/search&compare"
                      element={
                        <SearchandCompare
                          userToken={userToken}
                          userData={userData}
                          search={search}
                          setSearch={setSearch}
                        />
                      }
                    />
                    <Route
                      path="/summary"
                      element={
                        <Summary
                          userToken={userToken}
                          userData={userData}
                          search={search}
                          setSearch={setSearch}
                        />
                      }
                    />
                    <Route
                      path="/help&support"
                      element={
                        <HelpandSupport
                          userToken={userToken}
                          userData={userData}
                        />
                      }
                    />
                    <Route
                      path="/faqs"
                      element={<FAQs userToken={userToken} userData={userData} />}
                    />
                    <Route
                      path="/wishlist"
                      element={
                        <Wishlist userToken={userToken} userData={userData} />
                      }
                    />
                    <Route path="*" element={<Navigate to={"/dashboard"} />} />
                  </Routes>
                </Main>
              ) : (
                <Main
                  type={"payment"}
                  setUserData={setUserData}
                  userToken={userToken}
                  setUserToken={setUserToken}
                  userData={userData}
                  user={user}
                  setUser={setUser}
                >
                  <Routes>
                    <Route
                      path="/checkoutForm"
                      element={
                        <Payment userToken={userToken} userData={userData} />
                      }
                    />
                    <Route
                      path="/demo"
                      element={
                        <Demo
                          userToken={userToken}
                          userData={userData}
                        />
                      }
                    />
                    <Route
                      path="/plans"
                      element={
                        <Plans userToken={userToken} userData={userData} />
                      }
                    />
                    <Route
                      path="/success/:checkout_id"
                      element={
                        <Success
                          userToken={userToken}
                          userData={userData}
                          setUserData={setUserData}
                        />
                      }
                    />
                    <Route path="*" element={<Navigate to={"/plans"} />} />
                  </Routes>
                </Main>
              )
            ) : userData?.role === "admin" ? (
              <Main
                type={"admin"}
                setUserData={setUserData}
                userData={userData}
                userToken={userToken}
                setUserToken={setUserToken}
                user={user}
                setUser={setUser}
              >
                <Routes>
                  {/* Admin Pages */}
                  <Route
                    path="/home"
                    element={
                      <AdminDashboard userToken={userToken} userData={userData} />
                    }
                  />
                  {/* <Route
                  path="/earning"
                  element={
                    <Earning userToken={userToken} userData={userData} />
                  }
                /> */}
                  <Route
                    path="/scraping"
                    element={
                      <Scraping userToken={userToken} userData={userData} />
                    }
                  />
                  <Route
                    path="/user-management"
                    element={
                      <UserManagement userToken={userToken} userData={userData} />
                    }
                  />
                  <Route path="*" element={<Navigate to={"/home"} />} />
                </Routes>
              </Main>
            ) : (
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
                  element={<ResetPassword setNotificationType={setNotificationType} />}
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
