import React, { useMemo } from "react";
import { AgCharts } from "ag-charts-react";

const DynamicSalesYoyChart = ({
  data = [],

  // key mappings – you can reuse this for items etc.
  xKey = "date",
  barKey = "salesYOY",
  lineKey = "currentSales",

  // labels
  barLabel = "Growth YoY (%)",
  lineLabel = "Last Year Sales",

  showBar = true,
  showLine = true,
  showLegend = true,

  height = 500,
}) => {
  const { chartData, barMin, barMax, lineMin, lineMax } = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return {
        chartData: [],
        barMin: 0,
        barMax: 0,
        lineMin: 0,
        lineMax: 0,
      };
    }

    const barValues = [];
    const lineValues = [];

    const chartData = data.map((d) => {
      // Safely normalise null / undefined to 0 so chart axes don't explode
      let barValue = d[barKey];
      let lineValue = d[lineKey];

      if (barValue == null || Number.isNaN(barValue)) barValue = 0;
      if (lineValue == null || Number.isNaN(lineValue)) lineValue = 0;

      if (typeof barValue === "number") barValues.push(barValue);
      if (typeof lineValue === "number") lineValues.push(lineValue);

      return {
        ...d,
        [barKey]: barValue,
        [lineKey]: lineValue,
      };
    });

    const barMin = barValues.length ? Math.min(...barValues, 0) * 1.5 : 0;
    const barMax = barValues.length ? Math.max(...barValues, 0) * 1.5 : 0;
    const lineMin = lineValues.length ? Math.min(...lineValues, 0) * 1.5 : 0;
    const lineMax = lineValues.length ? Math.max(...lineValues, 0) * 1.5 : 0;

    return { chartData, barMin, barMax, lineMin, lineMax };
  }, [data, barKey, lineKey]);

  const series = [];
  console.log("chartData", chartData);
  if (showBar) {
    series.push({
      type: "bar",
      xKey: "date",
      yKey: barKey,
      yName: barLabel,
      data: chartData,
      // Green for positive YoY, red for negative
      itemStyler: ({ datum }) => {
        const value = datum[barKey];
        return {
          fill: value >= 0 ? "green" : "red",
          stroke: value >= 0 ? "darkgreen" : "darkred",
        };
      },
      showInLegend: true,
    });
  }

  if (showLine) {
    series.push({
      type: "line",
      xKey: "date",
      yKey: lineKey,
      yName: lineLabel,
      data: chartData,
      marker: { enabled: true, size: 5 },
      interpolation: { type: "smooth" },
      showInLegend: true,
    });
  }

  const options = {
    series,
    axes: [
      {
        type: "category",
        position: "bottom",
        title: { text: "Date" },
      },
      ...(showBar
        ? [
            {
              type: "number",
              position: "right",
              title: { text: barLabel },
              nice: true,
              min: barMin<lineMin?barMin:barMax,  //make it intentially
              max: barMax>lineMax?barMax:lineMax, //make it intentially
            },
          ]
        : []),
      ...(showLine
        ? [
            {
              type: "number",
              position: "left",
              title: { text: lineLabel },
              nice: true,
              min: lineMin,
              max: lineMax,
            },
          ]
        : []),
    ],
    legend: showLegend
      ? {
          enabled: true,
          position: "top",
          item: { label: { fontSize: 13, fontWeight: "bold" } },
        }
      : { enabled: false },
    height,
    theme: {
      palette: {
        fills: ["#2a9d8f", "#e76f51"],
        strokes: ["#225c58", "#8c2c15"],
      },
    },
    background: { fill: "#fafafa" },
    navigator: { enabled: true },
  };

  return (
    <div style={{ width: "100%", height: "auto" }}>
      <AgCharts options={options} />
    </div>
  );
};

export default DynamicSalesYoyChart;
