import { Menu } from "antd";
import React, { useEffect, useState } from "react";
import logo from "../../Assests/Images/logo.png";
import { NavLink, useLocation } from "react-router-dom";
import { GrNotes, GrSearch } from "react-icons/gr";
import { RiHome5Line } from "react-icons/ri";
import { FiHelpCircle } from "react-icons/fi";
import TranslatedText from "../Controls/TranslatedText"; 

const Sidebar2 = (props) => {
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
          <Menu.Item key="home" onClick={handleClick}>
            <NavLink to="/home" />
            <RiHome5Line />
            <span><TranslatedText>Home</TranslatedText></span>
          </Menu.Item>
          {/* <Menu.Item key="earning" onClick={handleClick}>
            <NavLink to="/earning" />
            <GrSearch />
            <span>Earning</span>
          </Menu.Item> */}
          <Menu.Item key="scraping" onClick={handleClick}>
            <NavLink to="/scraping" />
            <GrNotes />
            <span><TranslatedText>Scraping</TranslatedText></span>
          </Menu.Item>
          <Menu.Item key="user-management" onClick={handleClick}>
            <NavLink to="/user-management" />
            <FiHelpCircle />
            <span><TranslatedText>User Management</TranslatedText></span>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
};

export default Sidebar2;
