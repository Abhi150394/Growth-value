import { Menu } from "antd";
import React, { useEffect, useState } from "react";
import logo from "../../Assests/Images/logo.png";
import { NavLink, useLocation } from "react-router-dom";
import { GrNotes, GrSearch } from "react-icons/gr";
import { RiHome5Line } from "react-icons/ri";
import { FiHelpCircle } from "react-icons/fi";
import TranslatedText from "../Controls/TranslatedText"; // Import TranslatedText

const Sidebar3 = (props) => {
  const location = useLocation();
  const [buttonSelected, setButtonSelected] = useState("");
  
  useEffect(() => {
    setButtonSelected(location.pathname.replace("/", ""));
  }, [location]);

  const handleClick = () => {
    if (props.setVisible) {
      props.setVisible(false);
    }
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-body">
        <div className="logo-div">
          <img className="company-logo" src={logo} alt="Moksa-AI Logo" />
        </div>

        <hr />

        <Menu selectedKeys={buttonSelected}>
          <Menu.Item key="account/home" onClick={handleClick}>
            <NavLink to="/account/home" />
            <RiHome5Line />
            <span><TranslatedText>Home</TranslatedText></span>
          </Menu.Item>
          <Menu.Item key="account/personal-info" onClick={handleClick}>
            <NavLink to="/account/personal-info" />
            <GrSearch />
            <span><TranslatedText>Personal Info</TranslatedText></span>
          </Menu.Item>
          {/* <Menu.Item key="account/payment-history" onClick={handleClick}>
            <NavLink to="/account/payment-history" />
            <GrNotes />
            <span>Payment History</span>
          </Menu.Item> */}
          {props.userData?.role !== "admin" && (
            <Menu.Item key="account/subscription" onClick={handleClick}>
              <NavLink to="/account/subscription" />
              <FiHelpCircle />
              <span><TranslatedText>Subscription</TranslatedText></span>
            </Menu.Item>
          )}
        </Menu>
      </div>
    </div>
  );
};

export default Sidebar3;
