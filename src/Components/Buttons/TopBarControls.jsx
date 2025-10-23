import React, { useContext, useEffect, useState } from "react";
import { Button } from "antd";
import { BORDER_RADIUS, COLORS } from "../../constants";
import { FilterContext } from "../../Contexts/FilterContext";
import { useSearchParams } from "react-router-dom";

const ButtonGroup = ({ buttons = [], onButtonClick }) => {
  const { filters, updateFilter } = useContext(FilterContext);
  const [rippleStyle, setRippleStyle] = useState({});
  const [rippleVisible, setRippleVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleButtonClick = (btn, e) => {
    updateFilter("topBarSelectedSection", btn);
    setSearchParams({ active_tab: btn.id });

    // Ripple effect position
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    setRippleStyle({
      top: y + "px",
      left: x + "px",
      width: size + "px",
      height: size + "px",
      position: "absolute",
      borderRadius: "50%",
      background: "rgba(0,123,255,0.3)",
      transform: "scale(0)",
      animation: "ripple-animation 0.5s linear",
      pointerEvents: "none",
    });

    setRippleVisible(true);
    setTimeout(() => setRippleVisible(false), 500);
    if (onButtonClick) onButtonClick(btn);
  };

  useEffect(() => {
    const activeTab = searchParams.get("active_tab");
    if (activeTab) {
      const matchedBtn = buttons.find((btn) => btn.id === activeTab);
      if (matchedBtn) updateFilter("topBarSelectedSection", matchedBtn);
    }
  }, [searchParams, buttons]);
  
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      {/* Inject keyframes dynamically */}
      <style>
        {`
          @keyframes ripple-animation {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
        `}
      </style>

      {buttons.map((btn, index) => (
        <Button
          key={btn.id || index}
          onClick={(e) => handleButtonClick(btn, e)}
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: `${BORDER_RADIUS.sm}px`,
            backgroundColor:
              btn?.id === filters?.topBarSelectedSection?.id
                ? COLORS.bgContainer
                : COLORS.bgBase,
            border: "none",
            color: `${COLORS.primary}`,
            fontWeight: 500,
          }}
        >
          {btn.title}
          {rippleVisible && btn?.id === filters?.topBarSelectedSection?.id && (
            <span style={rippleStyle} />
          )}
        </Button>
      ))}
    </div>
  );
};

export default ButtonGroup;
