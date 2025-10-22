import React, { useState } from "react";
import { Affix, Drawer, Layout } from "antd";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "../../Assests/Styles/Layout.css";
import Sidebar2 from "./Sidebar2";
import Sidebar3 from "./Sidebar3";
const { Header: AntdHeader, Content, Sider } = Layout;

const Main = ({
  updateUser,
  setUserData,
  setUserToken,
  userToken,
  children,
  type,
  userData,
  user,
  search,
  setSearch,
  language,
  onLanguageChange,
}) => {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <Layout
        className={`layout-dashboard${type === "payment" ? "-payment" : ""}`}
        style={{ minHeight: "100vh" }}
      >
        {type !== "payment" && (
          <Drawer
            className="drawer-sidebar"
            title={false}
            placement="left"
            onClose={() => setVisible(false)}
            closable={false}
            open={visible}
            width={300}
          >
            <Layout className="">
              <Sider theme="light" className="sider-primary" trigger={null}>
                {type === "user" ? (
                  <Sidebar updateUser={updateUser} user={user} setVisible={setVisible} />
                ) : type === "admin" ? (
                  <Sidebar2 updateUser={updateUser} setVisible={setVisible} />
                ) : (
                  <Sidebar3 updateUser={updateUser} setVisible={setVisible} />
                )}
              </Sider>
            </Layout>
          </Drawer>
        )}

        {type !== "payment" && (
          <Sider
            breakpoint={"lg"}
            collapsedWidth="0"
            width={300}
            theme="light"
            trigger={null}
            className="sider-primary"
          >
            <div className="sider-fixed">
              {type === "user" ? (
                <Sidebar updateUser={updateUser} />
              ) : type === "admin" ? (
                <>
                  <Sidebar2 updateUser={updateUser} />
                </>
              ) : (
                <Sidebar3
                  updateUser={updateUser}
                  type={type}
                  userData={userData}
                />
              )}
            </div>
          </Sider>
        )}

        <Layout>
          <Affix>
            <AntdHeader className="ant-nav">
              <Navbar
                setVisible={setVisible}
                setUserData={setUserData}
                userData={userData}
                type={type}
                userToken={userToken}
                setUserToken={setUserToken}
                user={user}
                search={search}
                setSearch={setSearch}
              
              />
            </AntdHeader>
          </Affix>
          <Content>{children}</Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default Main;
