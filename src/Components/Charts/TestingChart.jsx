import React, { useMemo } from "react";
import { AgCharts } from "ag-charts-react";

const SaladChart = ({ data }) => {
    const chartData = useMemo(() => {
        if (!data || !data.detail?.salad) return [];

        return data.detail.salad.map((d) => {
            const yoy = Math.round(d.total_ly ? (d.total - d.total_ly) : 0); // bar values (can be negative)
            const diff = d.count_ly ? d.count : 0; // line values (always ≥ 0)
            return { date: d.period, diff, yoy, color: yoy >= 0 ? "#2a9d8f" : "#e76f51" };
        });
    }, [data]);

    const yoyMin = Math.min(...chartData.map((d) => d.yoy));
    const yoyMax = Math.max(...chartData.map((d) => d.yoy));


    console.log("chartDatachartData", chartData, yoyMin, yoyMax);
    const options = useMemo(
        () => ({
            data: chartData,
            series: [
                // YoY as BAR (negative or positive)
                {
                    type: "bar",
                    xKey: "date",
                    yKey: "yoy",
                    yName: "YoY Growth %",
                    fill: ({ datum }) => (datum.yoy >= 0 ? "#2a9d8f" : "#e76f51"),
                    itemStyler:({ datum }) => ({
                            fill: datum.yoy >= 0 ? "green" : "red",
                            stroke: datum.yoy >= 0 ? "darkgreen" : "darkred",
                        }),

                    strokeWidth: 0,
                    cornerRadius: 1,
                    shadow: { color: "rgba(0,0,0,0.2)", xOffset: 2, yOffset: 2, blur: 6 },

                },
                // Diff as LINE
                {
                    type: "line",
                    xKey: "date",
                    yKey: "diff",
                    yName: "Δ Quantity vs LY",
                    stroke: "#f4a261",
                    strokeWidth: 2,
                    marker: { enabled: true, size: 5, fill: "#f4a261" },
                    interpolation: { type: "smooth" },
                },
            ],
            axes: [
                {
                    type: "category",
                    position: "bottom",
                    title: { text: "Date" },
                },
                {
                    type: "number",
                    nice: true,
                    position: "right",
                    title: { text: "YoY Growth %" },
                    min: yoyMin * 1.2, // force negative + positive space
                    max: yoyMax * 1.2,

                    label: { formatter: (params) => `${params.value}%` },
                },
                {
                    type: "number",
                    position: "left",
                    title: { text: "Δ Quantity vs LY" },
                    min: 0, // line chart always from 0 upwards
                    max: yoyMax,
                    nice: true,
                },
            ],


            legend: { enabled: true, position: "top", item: { label: { fontSize: 13, fontWeight: "bold" } }, },
            // width: 1200,
            height: 600,


        }),
        [chartData, yoyMin, yoyMax]
    );

    return <div style={{ width: "100%", height: "auto" }}>
        <AgCharts options={options} />
    </div>;
};

export default SaladChart;
