import React, { useMemo } from "react";
import { AgCharts } from "ag-charts-react";

const DEFAULT_LABEL_KEYS = ["productName", "full_name", "name", "title"];

function detectLabelKey(sample, candidates = DEFAULT_LABEL_KEYS) {
  if (!sample) return "__label";
  for (const k of candidates) if (k in sample) return k;
  // fallback: first string-ish key
  const firstStringKey = Object.keys(sample).find(
    (k) => typeof sample[k] === "string"
  );
  return firstStringKey || "__label";
}

function coerceNumbers(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    // leave arrays/objects alone
    if (v != null && typeof v === "object") {
      out[k] = v;
      continue;
    }
    // try numeric coercion for number-like strings
    if (typeof v === "string" && v.trim() !== "" && !isNaN(+v)) {
      out[k] = +v;
    } else {
      out[k] = v;
    }
  }
  return out;
}

function detectNumericKeys(rows, ignoreKeys = []) {
  if (!rows.length) return [];
  const counts = {};
  rows.forEach((r) => {
    Object.entries(r).forEach(([k, v]) => {
      if (ignoreKeys.includes(k)) return;
      const n =
        typeof v === "number"
          ? v
          : typeof v === "string" && !isNaN(+v)
          ? +v
          : NaN;
      if (!Number.isNaN(n)) counts[k] = (counts[k] || 0) + 1;
    });
  });
  // keep keys that are numeric for most rows
  return Object.keys(counts).filter(
    (k) => counts[k] >= Math.max(1, rows.length * 0.5)
  );
}

// const DynamicProductPerformanceChart = ({
//   data = [],
//   labelKey, // e.g., "productName" or "full_name"
//   yKeys, // e.g., ["total"] or ["Quantity"]
//   showBar = true,
//   showLine = false,
//   showLegend = true,
//   height = 500,
//   xAxisLabel = "", // ✅ Custom X-axis title
//   yAxisLabel = "", // ✅ Custom Y-axis title
//   xLabelFormatter, // ✅ Optional custom formatter for X labels
//   yLabelFormatter, // ✅ Optional custom formatter for Y labels
//   numberFormatter = (v) => (typeof v === "number" ? v.toLocaleString() : v),
// }) => {
//   // Prepare chart data
//   const chartData = useMemo(() => {
//     if (!Array.isArray(data) || data.length === 0) return [];
//     return data.map((d, i) => {
//       const newRow = {};
//       for (const [key, val] of Object.entries(d)) {
//         if (typeof val === "string" && !isNaN(+val)) {
//           newRow[key] = +val;
//         } else {
//           newRow[key] = val;
//         }
//       }
//       // fallback label
//       if (!labelKey && !("name" in newRow)) {
//         newRow.name = `Row ${i + 1}`;
//       }
//       return newRow;
//     });
//   }, [data, labelKey]);

//   const effectiveLabelKey = labelKey || "name";
//   const effectiveYKeys = yKeys?.length
//     ? yKeys
//     : Object.keys(chartData[0] || {}).filter(
//         (k) => k !== effectiveLabelKey && typeof chartData[0]?.[k] === "number"
//       );

//   // Compute min/max dynamically
//   const [min, max] = useMemo(() => {
//     const vals = chartData.flatMap((d) =>
//       effectiveYKeys.map((k) => d[k]).filter((v) => typeof v === "number")
//     );
//     return [Math.min(0, ...vals), Math.max(0, ...vals)];
//   }, [chartData, effectiveYKeys]);

//   // Build chart series
//   const series = effectiveYKeys.map((k) => {
//     const base = {
//       xKey: effectiveLabelKey,
//       yKey: k,
//       yName: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
//       tooltip: {
//         renderer: ({ datum }) => ({
//           title: datum[effectiveLabelKey],
//           content: `${k}: ${numberFormatter(datum[k])}`,
//         }),
//       },
//     };
//     if (showBar) return { ...base, type: "bar", cornerRadius: 3 };
//     if (showLine)
//       return {
//         ...base,
//         type: "line",
//         marker: { enabled: true, size: 6 },
//         strokeWidth: 2,
//       };
//     return base;
//   });

//   const options = {
//     data: chartData,
//     series,
//     axes: [
//       {
//         type: "category",
//         position: "bottom",
//         title: { text: xAxisLabel }, // ✅ your custom X-axis title
//         label: {
//           rotation: -45,
//           fontSize: 11,
//           formatter: xLabelFormatter
//             ? (params) => xLabelFormatter(params.value)
//             : undefined,
//         },
//       },
//       {
//         type: "number",
//         position: "left",
//         title: { text: yAxisLabel }, // ✅ your custom Y-axis title
//         min,
//         max,
//         label: {
//           formatter: yLabelFormatter
//             ? (params) => yLabelFormatter(params.value)
//             : undefined,
//         },
//       },
//     ],
//     legend: showLegend
//       ? { enabled: true, position: "top" }
//       : { enabled: false },
//     theme: {
//       palette: {
//         fills: [
//           "#2a9d8f",
//           "#e76f51",
//           "#f4a261",
//           "#264653",
//           "#457b9d",
//           "#8ac926",
//         ],
//         strokes: [
//           "#225c58",
//           "#8c2c15",
//           "#ad6a2a",
//           "#122b34",
//           "#1d3557",
//           "#588157",
//         ],
//       },
//     },
//     background: { fill: "#fafafa" },
//     height,
//     animation: { enabled: true },
//   };

//   return (
//     <div style={{ width: "100%", height: "auto" }}>
//       <AgCharts options={options} />
//     </div>
//   );
// };

const DynamicProductPerformanceChart = ({
  data = [],
  // optional overrides
  labelKey,                 // e.g., "productName" or "full_name"
  yKeys,                    // e.g., ["total","profit"] or ["Quantity"]
  showBar = true,
  showLine = false,
  showLegend = true,
  height = 500,
  labelKeyCandidates = DEFAULT_LABEL_KEYS,
  numberFormatter = (v) => (typeof v === "number" ? v.toLocaleString() : v),
}) => {
  // 1) Normalize / coerce numeric strings
  const normalized = useMemo(() => (Array.isArray(data) ? data.map(coerceNumbers) : []), [data]);

  // 2) Detect label key if not provided
  const inferredLabelKey = useMemo(
    () => labelKey || detectLabelKey(normalized[0], labelKeyCandidates),
    [labelKey, normalized, labelKeyCandidates]
  );

  // Ensure there is a label field; if not, synthesize one
  const chartData = useMemo(() => {
    if (!normalized.length) return [];
    const lk = inferredLabelKey;
    return normalized.map((row, i) => ({
      ...row,
      __label: row[lk] != null ? row[lk] : `Row ${i + 1}`,
    }));
  }, [normalized, inferredLabelKey]);

  // 3) Detect numeric y-keys if not provided
  const inferredYKeys = useMemo(() => {
    if (yKeys && yKeys.length) return yKeys;
    const ignore = [inferredLabelKey, "__label"];
    const detected = detectNumericKeys(chartData, ignore);
    // If nothing detected, fallback to ["total"] if present
    if (detected.length === 0 && chartData[0] && "total" in chartData[0]) return ["total"];
    return detected;
  }, [yKeys, chartData, inferredLabelKey]);

  // 4) Compute min/max across all chosen y-keys (for nice scaling)
  const [min, max] = useMemo(() => {
    if (!chartData.length || !inferredYKeys.length) return [0, 0];
    const vals = [];
    chartData.forEach((d) => {
      inferredYKeys.forEach((k) => {
        const v = d[k];
        if (typeof v === "number" && isFinite(v)) vals.push(v);
      });
    });
    if (!vals.length) return [0, 0];
    return [Math.min(0, ...vals), Math.max(0, ...vals)];
  }, [chartData, inferredYKeys]);

  // 5) Build series (multi-series if multiple y-keys)
  const series = [];
  inferredYKeys.forEach((k) => {
    if (showBar) {
      series.push({
        type: "bar",
        xKey: "__label",
        yKey: k,
        yName: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        tooltip: {
          renderer: ({ datum }) => ({
            title: datum.__label,
            content: `${k}: ${numberFormatter(datum[k])}`,
          }),
        },
        cornerRadius: 2,
      });
    }
    if (showLine) {
      series.push({
        type: "line",
        xKey: "__label",
        yKey: k,
        yName: `${k} Trend`,
        marker: { enabled: true, size: 6 },
        strokeWidth: 2,
        tooltip: {
          renderer: ({ datum }) => ({
            title: datum.__label,
            content: `${k}: ${numberFormatter(datum[k])}`,
          }),
        },
      });
    }
  });

  const options = {
    data: chartData,
    series,
    axes: [
      {
        type: "category",
        position: "bottom",
        title: { text: "" },
        label: { rotation: -45, fontSize: 11 },
        nice: true,
      },
      {
        type: "number",
        position: "left",
        title: { text: inferredYKeys.length === 1 ? inferredYKeys[0] : "Values" },
        min,
        max,
      },
    ],
    legend: showLegend ? { enabled: true, position: "top" } : { enabled: false },
    theme: {
      palette: {
        // add enough colors for multiple series
        fills: ["#2a9d8f", "#e76f51", "#f4a261", "#264653", "#457b9d", "#8ac926", "#f77f00", "#6a4c93"],
        strokes: ["#225c58", "#8c2c15", "#ad6a2a", "#122b34", "#1d3557", "#588157", "#9a4a00", "#40265e"],
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

export default DynamicProductPerformanceChart;
