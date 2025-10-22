import React, { useEffect, useState } from "react";
import { Col, Row, Input, Button, Popover } from "antd";
import { GrHomeRounded, GrSearch } from "react-icons/gr";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { handleLogout, handleUpdate } from "../../Utils/updateUserStates";
import female from "../../Assests/Images/female-generic-avatar.jpeg";
import male from "../../Assests/Images/male-generic-avatar.jpeg";
import { CgMenuLeft } from "react-icons/cg";
import LanguageSwitcher from "../Controls/LanguageSwitcher";
import TranslatedText from '../Controls/TranslatedText'  

const Navbar = ({
  setVisible,
  setUserData,
  userData,
  setUserToken,
  type,
  user,
  search,
  setSearch,
  language,
  onLanguageChange,
}) => {
  const location = useLocation();
  const path = location.pathname.replace("/", "");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    setKeyword(search);
  }, [search]);

  const handleSearch = () => {
    setSearch(keyword);
    navigate("/search&compare");
  };

  const MenuIcon = {
    transform: "rotate(180deg)",
  };

  const content = (
    <div className="logout-dropdown">
      <div className="user-information">
        <img
          src={user?.gender?.toLowerCase() === "female" ? female : male}
          alt="profile"
        />
        <div className="user-information-container">
          <div className="information-details">
            <span className="username">{user?.name}</span>
            <span className="user-email">{user?.email}</span>
          </div>
          {type !== "payment" && (
            <div
              onClick={() => {
                handleUpdate(true, userData, setUserData);
                setOpen(false);
              }}
            >
              <NavLink to="/account/home">
                <span>
                  <TranslatedText>Manage your Growth-Value account</TranslatedText>
                </span>
              </NavLink>
            </div>
          )}
        </div>
      </div>
      <Button
        className="action-button"
        onClick={() => handleLogout(setUserData, setUserToken)}
      >
        <TranslatedText>Logout</TranslatedText>
      </Button>
    </div>
  );

  const handleBack = () => {
    handleUpdate(false, userData, setUserData);
    userData.role === "user" ? navigate("/dashboard") : navigate("/home");
  };

  const input = {
    background: "#fff",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#ffdfa0",
  };

  return (
    <Row gutter={[24, 0]} align="middle">
      <Col
        lg={0}
        md={2}
        sm={3}
        xs={3}
        className="toggler-div"
        onClick={() => setVisible(true)}
      >
        {type !== "payment" && <CgMenuLeft style={MenuIcon} size={25} />}
      </Col>
      <Col lg={1} md={0} sm={0} xs={0} className="toggler-div">
        {type !== "payment" && <CgMenuLeft style={MenuIcon} size={25} />}
      </Col>

      <Col lg={12} md={12} sm={10} xs={8} className="page-name">
        {type === "payment" ? (
          decodeURI(path?.toUpperCase()).split("/")[0]
        ) : (
          <TranslatedText>{decodeURI(path?.toUpperCase())}</TranslatedText>
        )}
      </Col>

      <Col
        lg={6}
        md={6}
        sm={6}
        xs={8}
        style={{ display: "flex", alignItems: "center" }}
      >
        {userData?.role === "admin" || type === "accounts" ? (
          type === "accounts" ? (
            <div style={{ width: "100%", textAlign: "right" }}>
              <GrHomeRounded
                onClick={handleBack}
                style={{ cursor: "pointer" }}
              />
            </div>
          ) : null
        ) : (
          type !== "payment" &&
          path !== "dashboard" && (
            <Input
              style={input}
              placeholder="Search"
              suffix={
                <GrSearch className="search-button" onClick={handleSearch} />
              }
              value={keyword}
              onChange={(e) => setKeyword(e?.target?.value)}
              onPressEnter={handleSearch}
            />
          )
        )}
      </Col>


      <Col lg={2} md={2} sm={3} xs={3} className="img-container" style={{paddingLeft:"0px"}}>
        <Popover
          content={content}
          placement="bottomLeft"
          arrow={false}
          trigger="click"
          open={open}
          onOpenChange={(e) => setOpen(e)}
        >
          <img
            src={user?.gender?.toLowerCase() === "female" ? female : male}
            alt="profile"
            style={{ cursor: "pointer" }}
          />
        </Popover>
      </Col>

      <Col lg={1} md={1} sm={2} xs={2} style={{paddingLeft:"2px"}}>
        <LanguageSwitcher />
      </Col>

     
    </Row>
  );
};

export default Navbar;
