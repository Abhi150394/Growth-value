import React, { useState, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

const InfoTooltip = ({ text, size = 15, className = "" }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({});
  const [arrowLeft, setArrowLeft] = useState("50%");
  const [arrowDirection, setArrowDirection] = useState("down"); // arrow direction
  const wrapperRef = useRef(null);
  const tooltipRef = useRef(null);

  useLayoutEffect(() => {
    if (visible && wrapperRef.current && tooltipRef.current) {
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const margin = 8;

      let left = wrapperRect.left + wrapperRect.width / 2;
      let top = wrapperRect.bottom + margin;
      let transform = "translateX(-50%)";
      let arrowDir = "up"; // default arrow points up (bottom of tooltip)

      // Horizontal adjustments
      if (left - tooltipRect.width / 2 < margin) {
        left = margin + tooltipRect.width / 2;
      }
      if (left + tooltipRect.width / 2 > viewportWidth - margin) {
        left = viewportWidth - margin - tooltipRect.width / 2;
      }

      // Vertical flip if tooltip overflows bottom
      if (top + tooltipRect.height > viewportHeight - margin) {
        top = wrapperRect.top - tooltipRect.height - margin; // place above
        arrowDir = "down"; // arrow points downward
      } else {
        arrowDir = "up"; // arrow points upward
      }

      // Calculate arrow horizontal position relative to tooltip
      const arrowPos = Math.min(
        Math.max(
          wrapperRect.left +
            wrapperRect.width / 2 -
            (left - tooltipRect.width / 2),
          6
        ),
        tooltipRect.width - 6
      );

      setPosition({ left, top, transform });
      setArrowLeft(`${arrowPos}px`);
      setArrowDirection(arrowDir);
    }
  }, [visible]);

  const tooltipElement = visible
    ? createPortal(
        <div
          ref={tooltipRef}
          style={{
            position: "fixed",
            left: position.left || 0,
            top: position.top || 0,
            transform: position.transform || "translateX(-50%)",
            backgroundColor: "#fff",
            color: "#000",
            padding: "12px",
            borderRadius: "6px",
            fontSize: "13px",
            lineHeight: "1.4",
            minWidth: "300px",
            maxWidth: "600px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            zIndex: 9999,
            textAlign: "justify",
            boxSizing: "border-box",
          }}
        >
          {text}
          {/* Arrow */}
          <div
            style={{
              position: "absolute",
              left: arrowLeft,
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              ...(arrowDirection === "up"
                ? {
                    bottom: "100%",
                    borderTop: "6px solid #ffffff",
                    transform: "translateX(-50%)",
                  }
                : {
                    top: "100%",
                    borderBottom: "6px solid #ffffff",
                    transform: "translateX(-50%)",
                  }),
            }}
          />
        </div>,
        document.body
      )
    : null;

  return (
    <span
      ref={wrapperRef}
      className={`info-tooltip-wrapper ${className}`}
      style={{
        position: "relative",
        display: "inline-block",
        cursor: "pointer",
      }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="info-circle"
        className="svg-inline--fa fa-info-circle fa-fw"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        width={size}
        height={size}
        fill={visible ? "#f6ce3eff" : "#000000"}
        style={{ transition: "fill 0.3s ease" }}
      >
        <path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></path>
      </svg>
      {tooltipElement}
    </span>
  );
};

export default InfoTooltip;
