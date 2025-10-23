import React, { useState } from "react";
import { Row, Col, Tooltip } from "antd";
import { GrNotification, GrDocument, GrSettingsOption, GrHelp, GrUser } from "react-icons/gr";

const Topbar = ({ title }) => {
  const [activeIcon, setActiveIcon] = useState(null);

  const handleClick = (icon) => {
    setActiveIcon(icon);
    console.log(`${icon} clicked`);
  };

  return (
    <Row
      gutter={[24, 0]}
      align="middle"
      style={{
        background: "#fff",
        padding: "10px 20px",
        boxShadow: "0 2px 8px #f0f1f2",
      }}
    >
      {/* Left side Title */}
      <Col lg={12} md={12} sm={12} xs={12}>
        <h4 style={{ margin: 0 }}>{title}</h4>
      </Col>

      {/* Right side Icons */}
      <Col
        lg={12}
        md={12}
        sm={12}
        xs={12}
        style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}
      >
        <Tooltip title="Notifications">
          <GrNotification
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => handleClick("Notifications")}
          />
        </Tooltip>

        <Tooltip title="Documents">
          <GrDocument
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => handleClick("Documents")}
          />
        </Tooltip>

        <Tooltip title="Settings">
          <GrSettingsOption
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => handleClick("Settings")}
          />
        </Tooltip>

        <Tooltip title="Help">
          <GrHelp
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => handleClick("Help")}
          />
        </Tooltip>

        <Tooltip title="Profile">
          <GrUser
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => handleClick("Profile")}
          />
        </Tooltip>
      </Col>
    </Row>
  );
};

export default Topbar;
