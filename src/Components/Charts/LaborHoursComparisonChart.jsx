import React, { useMemo } from "react";
import { AgCharts } from "ag-charts-react";

const LaborHoursComparisonChart = ({
  data = [],
  height = 500,
  width = "100%",
}) => {
  const processedData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];
    // Convert numeric fields from strings to numbers
    return data.map((d) => ({
      housePart: d["House part"],
      laborModelHours: parseFloat(d["Labor Model Hours"]),
      scheduledHours: parseFloat(d["Scheduled Hours"]),
    }));
  }, [data]);

  const options = {
    data: processedData,
    series: [
      {
        type: "bar",
        xKey: "housePart",
        yKey: "laborModelHours",
        yName: "Labor Model Hours",
        fill: "#f4b44a",
        stroke: "#d18c2b",
        cornerRadius: 1,
      },
      {
        type: "bar",
        xKey: "housePart",
        yKey: "scheduledHours",
        yName: "Scheduled Hours - Tomorrow",
        fill: "#e74c3c",
        stroke: "#b32d26",
        cornerRadius: 1,
      },
    ],
    axes: [
      {
        type: "category",
        position: "bottom",
        title: { text: "" },
        label: { fontSize: 13, rotation: 0 },
        crossLines: processedData.map((d) => ({
          type: "line",
          value: d.housePart,
          stroke: "#b7aeaeff",     
          strokeWidth: 1,
          lineDash: [8, 2],    
        })),
        
      },
      {
        type: "number",
        position: "left",
        title: { text: "" },
        nice: true,
      },
    ],
    legend: {
      enabled: true,
      position: "top",
      item: { label: { fontSize: 11, fontWeight: "light" } },
    },
    theme: {
      overrides: {
        bar: {
          series: {
            strokeWidth: 0,
            highlightStyle: { item: { fillOpacity: 0.8 } },
          },
        },
      },
    },
    background: { fill: "#ffffff" },
    height,
    width,
    animation: { enabled: true },
  };

  return (
    <div style={{ width, height }}>
      <AgCharts options={options} />
    </div>
  );
};

export default LaborHoursComparisonChart;
