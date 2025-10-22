import { Dropdown, Menu } from "antd";
import React, { useEffect, useState } from "react";
import {
  CodeOutlined,
  DesktopOutlined,
  ExclamationCircleFilled,
  EyeFilled,
  HomeFilled,
  UserAddOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  HeatMapOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import logo from "../../Assests/Images/logo.png";
import { NavLink, useLocation } from "react-router-dom";
import { GrCircleInformation, GrNotes, GrSearch } from "react-icons/gr";
import { RiHome5Line } from "react-icons/ri";
import { FiHelpCircle } from "react-icons/fi";
import { GoChecklist } from "react-icons/go";
import TranslatedText from "../Controls/TranslatedText";

const Sidebar = (props) => {
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
          <Menu.Item key="dashboard" onClick={handleClick}>
            <NavLink to="/dashboard" />
            <RiHome5Line size={25} />
            <span>
              <TranslatedText>Dashboard</TranslatedText>
            </span>
          </Menu.Item>

          <Menu.Item key="search&compare" onClick={handleClick}>
            <NavLink to="/search&compare" />
            <GrSearch size={25} />
            <span>
              <TranslatedText>Search & Compare</TranslatedText>
            </span>
          </Menu.Item>

          <Menu.Item key="summary" onClick={handleClick}>
            <NavLink to="/summary" />
            <GrNotes size={22} />
            <span>
              <TranslatedText>Summary</TranslatedText>
            </span>
          </Menu.Item>

          <Menu.Item key="wishlist" onClick={handleClick}>
            <NavLink to="/wishlist" />
            <GoChecklist size={25} />
            <span>
              <TranslatedText>Wishlist</TranslatedText>
            </span>
          </Menu.Item>

          <Menu.Item key="help&support" onClick={handleClick}>
            <NavLink to="/help&support" />
            <FiHelpCircle size={25} />
            <span>
              <TranslatedText>Help & Support</TranslatedText>
            </span>
          </Menu.Item>

          <Menu.Item key="faqs" onClick={handleClick}>
            <NavLink to="/faqs" />
            <GrCircleInformation size={25} />
            <span>
              <TranslatedText>FAQs</TranslatedText>
            </span>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
};

export default Sidebar;
