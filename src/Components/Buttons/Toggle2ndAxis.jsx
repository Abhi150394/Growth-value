import React, { useContext, useState } from "react";
import { Switch } from "antd";
import { FilterContext } from "../../Contexts/FilterContext";

const ToggleSwitchButton = ({ onToggle }) => {
  const { filters, updateFilter } = useContext(FilterContext);

  const handleChange = (value) => {
    updateFilter("chart2ndAxis", value);
    // if (onToggle) onToggle(value); // optional callback
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        color: "#1f1f1f",
        fontSize: 14,
      }}
    >
      <Switch
      size="small"
        checked={filters?.chart2ndAxis}
        onChange={handleChange}
        style={{ backgroundColor: filters?.chart2ndAxis ? "black" : undefined,tabSize:10 }}
      />
      <span>Toggle 2nd Axis</span>
    </div>
  );
};

export default ToggleSwitchButton;
