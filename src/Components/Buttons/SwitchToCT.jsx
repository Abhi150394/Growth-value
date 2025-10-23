import React, { useContext, useState } from "react";
import { Button } from "antd";
import { TableChartOutlined, BarChartOutlined } from "@mui/icons-material";
import { FilterContext } from "../../Contexts/FilterContext";

const ToggleViewButton = ({ onToggle }) => {
      const { filters, updateFilter } = useContext(FilterContext);
    

  const handleClick = () => {
    const newValue = !filters?.switchToChart;
    updateFilter('switchToChart',newValue)
    // if (onToggle) onToggle(newValue); // optional callback for parent
  };

  return (
    <Button
      type="text"
      icon={filters?.switchToChart ? <TableChartOutlined /> : <BarChartOutlined />}
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        // gap: 6,
        color: "#1f1f1f",
        fontWeight: 400,
      }}
    >
      {filters?.switchToChart ? "Switch to Chart" : "Switch to Table"}
    </Button>
  );
};

export default ToggleViewButton;
