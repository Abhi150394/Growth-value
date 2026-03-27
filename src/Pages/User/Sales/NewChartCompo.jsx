import React, { useMemo } from "react";
import { AgCharts } from "ag-charts-react";

const ProductPerformanceChart = ({
  data = [],
  metric = "total", // can be "total", "profit", "amount", etc.
  showBar = true,
  showLine = false,
  showLegend = true,
  height = 500,
}) => {
  // Prepare chart data
  const chartData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];

    return data.map((item) => ({
      name: item.productName,
      total: item.total,
      profit: item.profit,
      amount: item.amount,
      price: item.price,
      vat: item.vat,
    }));
  }, [data]);

  // Compute min/max for dynamic scaling
  const [min, max] = useMemo(() => {
    const values = chartData.map((d) => d[metric]);
    return [Math.min(...values, 0), Math.max(...values, 0)];
  }, [chartData, metric]);

  // Create series dynamically
  const series = [];
  if (showBar) {
    series.push({
      type: "bar",
      xKey: "name",
      yKey: metric,
      yName: metric.charAt(0).toUpperCase() + metric.slice(1),
      tooltip: {
        renderer: ({ datum }) => ({
          title: datum.name,
          content: `${metric.toUpperCase()}: ${datum[metric]}`,
        }),
      },
      cornerRadius: 2,
    });
  }

  if (showLine) {
    series.push({
      type: "line",
      xKey: "name",
      yKey: metric,
      yName: `${metric} Trend`,
      marker: { enabled: true, size: 6 },
      strokeWidth: 2,
      tooltip: {
        renderer: ({ datum }) => ({
          title: datum.name,
          content: `${metric.toUpperCase()}: ${datum[metric]}`,
        }),
      },
    });
  }

  const options = {
    data: chartData,
    series,
    axes: [
      {
        type: "category",
        position: "bottom",
        title: { text: "Product Name" },
        label: { rotation: -45, fontSize: 11 },
      },
      {
        type: "number",
        position: "left",
        title: { text: metric.charAt(0).toUpperCase() + metric.slice(1) },
        min,
        max,
      },
    ],
    legend: showLegend ? { enabled: true, position: "top" } : { enabled: false },
    theme: {
      palette: {
        fills: ["#2a9d8f", "#e76f51", "#f4a261", "#264653", "#457b9d", "#8ac926"],
        strokes: ["#225c58", "#8c2c15", "#ad6a2a", "#122b34", "#1d3557", "#588157"],
      },
    },
    background: { fill: "#fafafa" },
    height,
    animation: { enabled: true },
  };

  return (
    <div style={{ width: "100%", height: "auto" }}>
      <AgCharts options={options} />
    </div>
  );
};

export default ProductPerformanceChart;
