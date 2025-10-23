import React, { useMemo } from "react";
import { AgCharts } from "ag-charts-react";

const DynamicCategoryChart = ({
    data,
    categories = ["salad", "cold drinks", "hot drinks", "sandwiches", "snacks"], // default
    showLine = true,
    showBar = true,
    showLegend = true,
    width = 1200,
    height = 600,
}) => {
    const { chartData, yoyMin, yoyMax, diffMin, diffMax } = useMemo(() => {
        if (!data?.detail) {
            return { chartData: {}, yoyMin: 0, yoyMax: 0, diffMin: 0, diffMax: 0 };
        }

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
            yoyMin: Math.min(...allYoy, 0),
            yoyMax: Math.max(...allYoy, 0),
            diffMin: Math.min(...allDiff, 0),
            diffMax: Math.max(...allDiff, 0),
        };
    }, [data, categories]);

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
                yName: cat==='all'?'Overall':!cat.includes(" ")?cat.charAt(0).toUpperCase() + cat.slice(1):cat.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
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
                        min: yoyMin,
                        max: yoyMax,
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
                        min: diffMin,
                        max: diffMax,
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

export default DynamicCategoryChart;




// import React, { useMemo } from "react";
// import { AgCharts } from "ag-charts-react";

// const DynamicCategoryChart = ({ data, categories }) => {
//     // Process chart data
//     const { chartData, yoyMin, yoyMax, diffMin, diffMax } = useMemo(() => {
//         if (!data?.detail || !categories?.length)
//             return { chartData: {}, yoyMin: 0, yoyMax: 0, diffMin: 0, diffMax: 0 };

//         let allYoy = [];
//         let allDiff = [];

//         const chartData = categories.reduce((acc, cat) => {
//             if (!data.detail[cat]) return acc;

//             acc[cat] = data.detail[cat].map((d) => {
//                 const yoy = d.total_ly ? d.total - d.total_ly : 0;
//                 const diff = d.count_ly ? d.count : 0;
//                 allYoy.push(yoy);
//                 allDiff.push(diff);

//                 return {
//                     date: d.period,
//                     yoy,
//                     diff,
//                     total: d.total,
//                     total_ly: d.total_ly,
//                     count: d.count,
//                     count_ly: d.count_ly,
//                 };
//             });

//             return acc;
//         }, {});

//         return {
//             chartData,
//             yoyMin: Math.min(...allYoy, 0),
//             yoyMax: Math.max(...allYoy, 0),
//             diffMin: Math.min(...allDiff, 0),
//             diffMax: Math.max(...allDiff, 0),
//         };
//     }, [data, categories]);

//     // Generate a color palette dynamically if not provided
//     const colors = [
//         "#2a9d8f",
//         "#e76f51",
//         "#f4a261",
//         "#264653",
//         "#457b9d",
//         "#8ac926",
//         "#ff595e",
//     ];
//     const getColor = (index) => colors[index % colors.length];

//     const series = [];
//     Object.entries(chartData).forEach(([cat, values], idx) => {
//         // BAR → YoY
//         series.push({
//             type: "bar",
//             xKey: "date",
//             yKey: "yoy",
//             yName: `${cat} YoY`,
//             data: values,
//             fill: getColor(idx),
//             stroke: getColor(idx),
//             cornerRadius: 3,
//             highlightStyle: { item: { fill: "#000", strokeWidth: 2 } },
//             tooltip: {
//                 renderer: ({ datum }) => ({
//                     title: `${cat} (${datum.date})`,
//                     content: `YoY: ${datum.yoy}\nLY Total: ${datum.total_ly}\nThis Year: ${datum.total}`,
//                 }),
//             },
//         });

//         // LINE → Δ Quantity
//         series.push({
//             type: "line",
//             xKey: "date",
//             yKey: "diff",
//             yName: `${cat} Δ Quantity`,
//             data: values,
//             stroke: getColor(idx),
//             marker: { enabled: true, size: 5, fill: getColor(idx) },
//             interpolation: { type: "smooth" },
//             showInLegend: false,
//             tooltip: {
//                 renderer: ({ datum }) => ({
//                     title: `${cat} (${datum.date})`,
//                     content: `Δ Quantity: ${datum.diff}\nLY Count: ${datum.count_ly}\nThis Year: ${datum.count}`,
//                 }),
//             },
//         });
//     });

//     const options = {
//         series,
//         axes: [
//             { type: "category", position: "bottom", title: { text: "Date" }, crosshair: { enabled: true } },
//             {
//                 type: "number",
//                 position: "right",
//                 title: { text: "YoY Growth" },
//                 min: yoyMin * 1.2,
//                 max: yoyMax * 1.2,
//                 gridLine: { style: [{ stroke: "#e0e0e0", lineDash: [4, 2] }] },
//             },
//             {
//                 type: "number",
//                 position: "left",
//                 title: { text: "Δ Quantity vs LY" },
//                 min: diffMin,
//                 max: diffMax,
//                 gridLine: { style: [{ stroke: "#e0e0e0", lineDash: [4, 2] }] },
//             },
//         ],
//         legend: {
//             enabled: true,
//             position: "top",
//             item: { marker: { shape: "circle", size: 14 }, label: { fontSize: 13, fontWeight: "bold" } },
//         },
//         background: { fill: "#fafafa" },
//         animation: { enabled: true },
//         width: 1200,
//         height: 600,
//     };

//     return (
//         <div style={{ width: "100%", height: "auto" }}>
//             <AgCharts options={options} />
//         </div>
//     );
// };

// export default DynamicCategoryChart;
