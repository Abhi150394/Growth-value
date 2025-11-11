import React, { useMemo } from "react";
import { AgCharts } from "ag-charts-react";

/**
 * Dynamic, schema-agnostic grouped bar chart for AG Charts.
 *
 * Props:
 *  - data: Array<object>
 *  - height: number (default 500)
 *  - width: number|string (default "100%")
 *  - categoryKey?: string            // optional override (e.g., "House part" or "child_cat_name")
 *  - seriesKeys?: string[]           // optional override (e.g., ["Labor Model Hours","Scheduled Hours"])
 *  - seriesLabels?: Record<string,string> // map data keys -> legend labels
 *  - seriesColors?: Record<string,{fill?:string,stroke?:string}>
 */
const DynamicComparisonChart = ({
  data = [],
  height = 500,
  width = "100%",
  categoryKey: categoryKeyOverride,
  seriesKeys: seriesKeysOverride,
  seriesLabels = {},
  seriesColors = {},
}) => {
  // Helpers
  const isNumericLike = (v) => {
    if (v === null || v === undefined) return false;
    if (typeof v === "number") return true;
    if (typeof v === "string") {
      const trimmed = v.trim();
      if (trimmed === "") return false;
      const n = Number(trimmed);
      return Number.isFinite(n);
    }
    return false;
  };

  // Infer schema if not provided
  const { categoryKey, seriesKeys } = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return {
        categoryKey: categoryKeyOverride,
        seriesKeys: seriesKeysOverride ?? [],
      };
    }

    const sample = data.find((d) => d && typeof d === "object") || {};
    const keys = Object.keys(sample);

    // Choose category key: first key whose value in sample is NOT numeric-like
    let inferredCategory =
      categoryKeyOverride ||
      keys.find((k) => !isNumericLike(sample[k])) ||
      keys[0]; // fallback

    // Series keys: all other keys that are numeric-like in sample
    let inferredSeries =
      seriesKeysOverride ||
      keys.filter((k) => k !== inferredCategory && isNumericLike(sample[k]));

    // If nothing numeric found (edge case), pick all except category
    if (!inferredSeries || inferredSeries.length === 0) {
      inferredSeries = keys.filter((k) => k !== inferredCategory);
    }

    return { categoryKey: inferredCategory, seriesKeys: inferredSeries };
  }, [data, categoryKeyOverride, seriesKeysOverride]);

  const processedData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];
    return data.map((row) => {
      const out = { __cat__: row?.[categoryKey] };
      seriesKeys.forEach((k) => {
        const raw = row?.[k];
        const num =
          typeof raw === "number" ? raw : Number((raw ?? "").toString().trim());
        out[k] = Number.isFinite(num) ? num : 0;
      });
      return out;
    });
  }, [data, categoryKey, seriesKeys]);

  // Palette for series (you can extend/override with seriesColors prop)
  const defaultPalette = [
    { fill: "#f4b44a", stroke: "#d18c2b" }, // amber-ish
    { fill: "#e74c3c", stroke: "#b32d26" }, // red
    { fill: "#4aa3f4", stroke: "#2b78c4" }, // blue
    { fill: "#58d68d", stroke: "#28b463" }, // green
    { fill: "#9b59b6", stroke: "#7d3c98" }, // purple
    { fill: "#95a5a6", stroke: "#7f8c8d" }, // gray
  ];

  const series = useMemo(() => {
    return seriesKeys.map((k, idx) => {
      const palette =
        seriesColors[k] || defaultPalette[idx % defaultPalette.length];
      return {
        type: "bar",
        xKey: "__cat__",
        yKey: k,
        yName: seriesLabels[k] || k,
        fill: palette.fill,
        stroke: palette.stroke,
        cornerRadius: 1,
        // optional: nice hover style
        highlightStyle: { item: { fillOpacity: 0.85 } },
      };
    });
  }, [seriesKeys, seriesLabels, seriesColors]);

  // Cross lines for each category tick
  const crossLines = useMemo(() => {
    return processedData.map((d) => ({
      type: "line",
      value: d.__cat__,
      stroke: "#cbc5c5ff",
      strokeWidth: 1,
      lineDash: [8, 2],
    }));
  }, [processedData]);

  const options = {
    data: processedData,
    series,
    axes: [
      {
        type: "category",
        position: "bottom",
        title: { text: "" },
        label: { fontSize: 13, rotation: 0 },
        crossLines,
        gridStyle: [
          { stroke: "#e0e0e0", lineDash: [] }, // solid light gray
          { stroke: "#f9f9f9", lineDash: [] }, // alternate even lighter
        ],
      },
      {
        type: "number",
        position: "left",
        title: { text: "" },
        nice: true,
        gridStyle: [
          { stroke: "#e0e0e0", lineDash: [] },
          { stroke: "#f9f9f9", lineDash: [] },
        ],
      },
    ],
    legend: {
      enabled: true,
      position: "top",
      item: { label: { fontSize: 11, fontWeight: "light" } },
    },
    tooltip: {
      enabled: true,
      renderer: ({ datum, yKey, yName }) => {
        const val = datum?.[yKey];
        const cat = datum?.__cat__;
        const formatted = typeof val === "number" ? val.toLocaleString() : val;
        return { title: cat, content: `${yName}: ${formatted}` };
      },
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

export default DynamicComparisonChart;
