import React, { useMemo } from "react";
import { AgCharts } from "ag-charts-react";

const MultiCategoryChart = ({ data }) => {

    const categories = ["salad", "cold drinks", "hot drinks", "sandwiches", "snacks"];

    const { chartData, yoyMin, yoyMax, diffMin, diffMax } = useMemo(() => {
        if (!data?.detail) return { chartData: {}, yoyMin: 0, yoyMax: 0, diffMin: 0, diffMax: 0 };

        const categories = ["salad", "cold drinks", "hot drinks", "sandwiches", "snacks"];

        let allYoy = [];
        let allDiff = [];

        const chartData = categories.reduce((acc, cat) => {
            if (!data.detail[cat]) return acc;

            acc[cat] = data.detail[cat].map((d) => {
                const yoy = d.total_ly ? d.total - d.total_ly : 0;
                const diff = d.count_ly ? d.count : 0;
                allYoy.push(yoy);
                allDiff.push(diff);

                return { date: d.period, yoy, diff };
            });

            return acc;
        }, {});

        return {
            chartData,
            yoyMin: Math.min(...allYoy, 0), // include 0 so axis baseline is safe
            yoyMax: Math.max(...allYoy, 0),
            diffMin: Math.min(...allDiff, 0),
            diffMax: Math.max(...allDiff, 0),
        };
    }, [data]);



    const series = []
    Object.entries(chartData).forEach(([cat, values]) => {
        series.push({
            type: "bar",
            xKey: "date",
            yKey: "yoy",
            yName: cat,
            data: values,
            // strokeWidth: 0,
            // cornerRadius: 2,
            grouped: true,
        });

        series.push({
            type: "line",
            xKey: "date",
            yKey: "diff",
            yName: `${cat} Δ Quantity`,
            data: values,
            // strokeWidth: 2,
            marker: { enabled: true, size: 5 },
            interpolation: { type: "smooth" },
            showInLegend: false,
        });
    });
    console.log("ChartData", chartData);
    console.log("series", series);

    const options = {
        series,
        axes: [
            {
                type: "category",
                position: "bottom",
                title: { text: "Date" },
            },
            {
                type: "number",
                position: "right",
                title: { text: "YoY Growth" },
                nice: true,
                min: yoyMin,
                max: yoyMax,
            },
            {
                type: "number",
                position: "left",
                title: { text: "Δ Quantity vs LY" },
                min: 0,
                nice: true,
                min: diffMin,
                max: diffMax,
            },
        ],
        legend: {
            enabled: true,
            position: "top",
            item: { label: { fontSize: 13, fontWeight: "bold" } },
        },
        // width: 1200,
        height: 600,
         theme: {
    palette: {
      fills: ["#2a9d8f", "#e76f51", "#f4a261", "#264653"],
      strokes: ["#225c58", "#8c2c15", "#ad6a2a", "#122b34"],
    },
  },
  background: { fill: "#fafafa" },
  navigator: { enabled: true },
//   highlightStyle: { series: { strokeWidth: 4 } }


    };

    return (
        <div style={{ width: "100%", height: "auto" }}>
            <AgCharts options={options} />
        </div>
    );
};

export default MultiCategoryChart;
