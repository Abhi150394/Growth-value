import React, { useMemo } from "react";
import { AgCharts } from "ag-charts-react";

const OperationsHourDynamicCategoryChart = ({
  data,
  categories = ["salad", "cold drinks", "hot drinks", "sandwiches", "snacks"], // default
  showLine = true,
  showBar = true,
  showLegend = true,
  width = 1200,
  height = 600,
  selectedFilterOption = null,
}) => {
  console.log("datadata",data)
  console.log("selectedFilterOption", selectedFilterOption);
  const { chartData, yoyMin, yoyMax, diffMin, diffMax } = useMemo(() => {
    if (!data?.detail) {
      return { chartData: {}, yoyMin: 0, yoyMax: 0, diffMin: 0, diffMax: 0 };
    }

    let allYoy = [];
    let allDiff = [];

    const chartData = categories.reduce((acc, cat) => {
      if (!data.detail[cat]) return acc;

      acc[cat] = data.detail[cat].map((d) => {
        let yoy = 0;
        let diff = 0;
        let v1 = Number(d.actual_base_cost) || 0;
        let v2 = Number(d.actual_base_cost_ly) || 0;
        if (selectedFilterOption === "guest") {
          v1 = Number(d.guest_count) || 0;
          v2 = Number(d.guest_count_ly) || 0;
        } else if (selectedFilterOption === "transactions") {
          v1 = Number(d.total) || 0;
          v2 = Number(d.total_ly) || 0;
        } else if (selectedFilterOption === "delivery") {
          v1 = Number(d.time_to_serve) || 0;
          v2 = Number(d.time_to_serve_ly) || 0;
        } else if (selectedFilterOption === "sales") {
          v1 = Number(d.guest_total) || 0;
          v2 = Number(d.guest_total_ly) || 0;
        }else{
            v1 = Number(d.guest_count) || 0;
          v2 = Number(d.guest_count_ly) || 0;
        }

        if (v1 !== 0 || v2 !== 0) {
          yoy = ((v1 - v2) / ((v1 + v2) / 2)) * 100;
        }

        yoy = Number(yoy.toFixed(2));
        // diff = d.count_ly ? d.count - d.count_ly : d.count || 0;
        diff = v1;
        // console.log("diff", diff, "yoy", yoy);
        allYoy.push(yoy);
        allDiff.push(diff);

        return { date: d.hour_of_day, yoy, diff };
      });

      return acc;
    }, {});

    return {
      chartData,
      yoyMin: Math.min(...allYoy, 0),
      yoyMax: Math.max(...allYoy, 0),
      diffMin: Math.min(...allDiff, 0),
      diffMax: Math.max(...allDiff, 0),
    };
  }, [data, categories, selectedFilterOption]);

  console.log("chartDatachartData",chartData)
  // Dynamically build series
  const singleCategory = categories.length === 1;
  const series = [];
  Object.entries(chartData).forEach(([cat, values]) => {
    if (showBar) {
      series.push({
        type: "bar",
        xKey: "date",
        yKey: "yoy",
        yName: cat,
        data: values,
        grouped: true,
        showInLegend: false,
        itemStyler: singleCategory
          ? ({ datum }) => ({
              fill: datum.yoy >= 0 ? "green" : "red",
              stroke: datum.yoy >= 0 ? "darkgreen" : "darkred",
            })
          : undefined,
      });
    }

    if (showLine) {
      series.push({
        type: "line",
        xKey: "date",
        yKey: "diff",
        yName:
          cat === "all"
            ? "Overall"
            : !cat.includes(" ")
            ? cat.charAt(0).toUpperCase() + cat.slice(1)
            : cat
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
        data: values,
        marker: { enabled: true, size: 5 },
        interpolation: { type: "smooth" },
        showInLegend: true, // avoids duplicate legends
      });
    }
  });

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
              title: { text: "YoY Growth" },
              nice: true,
              keys: ["yoy"],
              min: yoyMin * 1.2,
              max: yoyMax * 1.2,
            },
          ]
        : []),
      ...(showLine
        ? [
            {
              type: "number",
              position: "left",
              title: { text: "Δ Quantity vs LY" },
              nice: true,
              keys: ["diff"],
              min: diffMin * 1.2,
              max: diffMax * 1.2,
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
    // width,
    height,
    theme: {
      palette: {
        fills: ["#2a9d8f", "#e76f51", "#f4a261", "#264653"],
        strokes: ["#225c58", "#8c2c15", "#ad6a2a", "#122b34"],
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

export default OperationsHourDynamicCategoryChart;
