import React, { useContext, useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import {
  addDays,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  format,
  subDays,
  endOfMonth,
  differenceInCalendarDays,
} from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./DashboardDateRangePicker.css";
import { FilterContext } from "../../Contexts/FilterContext";
import TranslatedText from "../Controls/TranslatedText";

const predefinedRanges = [
  { label: <TranslatedText>Today</TranslatedText>, range: () => ({ startDate: new Date(), endDate: new Date() }) },
  {
    label: <TranslatedText>Yesterday</TranslatedText>,
    range: () => {
      const yesterday = subDays(new Date(), 1);
      return { startDate: yesterday, endDate: yesterday };
    },
  },
  { label: <TranslatedText>Week to Date</TranslatedText>, range: () => ({ startDate: subDays(new Date(), 6), endDate: new Date() }) },
  { label: <TranslatedText>Month to Date</TranslatedText>, range: () => ({ startDate: startOfMonth(new Date()), endDate: new Date() }) },
  { label: <TranslatedText>Quarter to Date</TranslatedText>, range: () => ({ startDate: startOfQuarter(new Date()), endDate: new Date() }) },
  { label: <TranslatedText>Year to Date</TranslatedText>, range: () => ({ startDate: startOfYear(new Date()), endDate: new Date() }) },
  // All past 12 months
  ...Array.from({ length: 12 }, (_, i) => {
    const today = new Date();
    const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
    return {
      label: <TranslatedText>{monthDate.toLocaleString("default", { month: "long" })}</TranslatedText>,
      range: () => ({
        startDate: startOfMonth(monthDate),
        endDate: endOfMonth(monthDate),
      }),
    };
  }),
];

const DashboardDateRangePicker = ({ onChange, maxRange }) => {
  const { filters } = useContext(FilterContext);
  const { dateRange } = filters || {};

  const initialStart = dateRange?.startDate ? new Date(dateRange.startDate) : new Date();
  const initialEnd = dateRange?.endDate ? new Date(dateRange.endDate) : new Date();

  const [selectionRange, setSelectionRange] = useState({
    startDate: initialStart,
    endDate: initialEnd,
    key: "selection",
  });

  // simple warning UI:
  const [warning, setWarning] = useState({ show: false, message: "" });

  useEffect(() => {
    // keep internal selection in sync if external filters change
    setSelectionRange({
      startDate: initialStart,
      endDate: initialEnd,
      key: "selection",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange?.startDate, dateRange?.endDate]);

  const showTemporaryWarning = (msg, ms = 3500) => {
    setWarning({ show: true, message: msg });
    setTimeout(() => setWarning({ show: false, message: "" }), ms);
  };

  const clampRangeIfNeeded = (start, end) => {
    if (!maxRange) return { startDate: start, endDate: end, clamped: false };

    const days = differenceInCalendarDays(end, start) + 1; // inclusive
    if (days <= maxRange) {
      return { startDate: start, endDate: end, clamped: false };
    }

    const clampedEnd = addDays(start, maxRange - 1);
    return { startDate: start, endDate: clampedEnd, clamped: true };
  };

  const emitSelection = (rangeObj) => {
    setSelectionRange({ ...rangeObj, key: "selection" });
    if (onChange) onChange({ startDate: rangeObj.startDate, endDate: rangeObj.endDate });
  };

  const handleSelect = (ranges) => {
    const start = ranges.selection.startDate;
    const end = ranges.selection.endDate;
    const { startDate, endDate, clamped } = clampRangeIfNeeded(start, end);

    if (clamped) {
      showTemporaryWarning(`Range limited to ${maxRange} ${maxRange === 1 ? "day" : "days"}.`);
    }
    emitSelection({ startDate, endDate });
  };

  const handleQuickSelect = (rangeFunc) => {
    const range = rangeFunc();
    const { startDate, endDate, clamped } = clampRangeIfNeeded(range.startDate, range.endDate);
    if (clamped) {
      showTemporaryWarning(`Range limited to ${maxRange} ${maxRange === 1 ? "day" : "days"}.`);
    }
    emitSelection({ startDate, endDate });
  };

  const clearSelection = () => {
    const today = new Date();
    const { startDate, endDate, clamped } = clampRangeIfNeeded(today, today);
    if (clamped) {
      showTemporaryWarning(`Range limited to ${maxRange} ${maxRange === 1 ? "day" : "days"}.`);
    }
    emitSelection({ startDate, endDate });
  };

  return (
    <div
      style={{
        display: "flex",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
        width: "auto",
        background: "#ffffff",
        position: "relative",
      }}
    >
      {/* Warning popup */}
      {warning.show && (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "#fff3cd",
            border: "1px solid #ffeeba",
            padding: "8px 12px",
            borderRadius: 6,
            zIndex: 1200,
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            fontSize: 13,
          }}
        >
          <TranslatedText>{warning.message}</TranslatedText>
        </div>
      )}

      {/* Left Panel: Predefined Ranges */}
      <div
        style={{
          width: "200px",
          borderRight: "1px solid #e0e0e0",
          padding: "10px 0",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          height: "410px",
          overflow: "auto",
        }}
      >
        {predefinedRanges.map((r) => (
          <button
            key={r.label}
            onClick={() => handleQuickSelect(r.range)}
            style={{
              textAlign: "left",
              padding: "8px 12px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#fff",
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f8ff")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#fff")}
          >
            <div style={{ fontWeight: "300", fontSize: "12px" }}>{r.label}</div>
            <div style={{ fontSize: "10px", color: "#555" }}>
              <TranslatedText>{format(r.range().startDate, "MMM dd, yyyy")}</TranslatedText> - <TranslatedText>{format(r.range().endDate, "MMM dd, yyyy")}</TranslatedText>
            </div>
          </button>
        ))}

        <div style={{ marginTop: "auto", padding: "0 12px 12px 12px" }}>
          <button
            onClick={clearSelection}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "5px",
              border: "1px solid #e0e0e0",
              backgroundColor: "#fff",
              cursor: "pointer",
            }}
          >
            <TranslatedText>Clear</TranslatedText>
          </button>
        </div>
      </div>

      {/* Right Panel: Calendar */}
      <div style={{ flex: 1, padding: "10px" }}>
        <DateRange
          ranges={[selectionRange]}
          onChange={handleSelect}
          months={window.innerWidth < 1024 ? 1 : 2}
          direction="horizontal"
          showSelectionPreview={true}
          moveRangeOnFirstSelection={false}
          rangeColors={["#c3b66eff"]}
        />
        {/* Optional small helper text */}
        {maxRange && (
          <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
          <TranslatedText>Maximum selectable range: {maxRange} {maxRange === 1 ? "day" : "days"}</TranslatedText>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardDateRangePicker;

// import React, { useContext, useState } from "react";
// import { DateRange } from "react-date-range";
// import { addDays, startOfMonth, startOfQuarter, startOfYear, format, subDays, endOfMonth } from "date-fns";
// import "react-date-range/dist/styles.css";
// import "react-date-range/dist/theme/default.css";
// import "./DashboardDateRangePicker.css";
// import { FilterContext } from "../../Contexts/FilterContext";

// const predefinedRanges = [
//     { label: "Today", range: () => ({ startDate: new Date(), endDate: new Date() }) },
//     {
//         label: "Yesterday", range: () => {
//             const yesterday = subDays(new Date(), 1);
//             return { startDate: yesterday, endDate: yesterday };
//         }
//     },
//     { label: "Week to Date", range: () => ({ startDate: subDays(new Date(), 6), endDate: new Date() }) },
//     { label: "Month to Date", range: () => ({ startDate: startOfMonth(new Date()), endDate: new Date() }) },
//     { label: "Quarter to Date", range: () => ({ startDate: startOfQuarter(new Date()), endDate: new Date() }) },
//     { label: "Year to Date", range: () => ({ startDate: startOfYear(new Date()), endDate: new Date() }) },
//     // All past 12 months
//     ...Array.from({ length: 12 }, (_, i) => {
//         const today = new Date();
//         const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
//         return {
//             label: monthDate.toLocaleString("default", { month: "long" }),
//             range: () => ({
//                 startDate: startOfMonth(monthDate),
//                 endDate: endOfMonth(monthDate),
//             }),
//         };
//     }),
// ];

// const DashboardDateRangePicker = ({ onChange }) => {
//     const { filters, updateFilter, resetFilters } = useContext(FilterContext);
//     const { dateRange } = filters
//     const [selectionRange, setSelectionRange] = useState({
//         startDate: new Date(dateRange?.startDate),
//         endDate: new Date(dateRange?.endDate),
//         key: "selection",
//     });

//     const handleSelect = (ranges) => {
//         setSelectionRange(ranges.selection);
//         if (onChange) onChange(ranges.selection);
//     };

//     const handleQuickSelect = (rangeFunc) => {
//         const range = rangeFunc();
//         setSelectionRange({ ...range, key: "selection" });
//         if (onChange) onChange({ ...range, key: "selection" });
//     };

//     const clearSelection = () => {
//         const today = new Date();
//         setSelectionRange({ startDate: today, endDate: today, key: "selection" });
//         if (onChange) onChange({ startDate: today, endDate: today, key: "selection" });
//     };

//     return (
//         <div style={{ display: "flex", border: "1px solid #e0e0e0", borderRadius: "8px", overflow: "hidden", fontFamily: "Arial, sans-serif", width: "auto", background: '#ffffff' }}>

//             {/* Left Panel: Predefined Ranges */}
//             <div style={{ width: "200px", borderRight: "1px solid #e0e0e0", padding: "10px 0", display: "flex", flexDirection: "column", gap: "10px", height: "410px", overflow: "scroll" }}>
//                 {predefinedRanges.map((r) => (
//                     <button
//                         key={r.label}
//                         onClick={() => handleQuickSelect(r.range)}
//                         style={{
//                             textAlign: "left",
//                             padding: "8px 12px",
//                             borderRadius: "5px",
//                             border: "none",
//                             backgroundColor: "#fff",
//                             cursor: "pointer",
//                             transition: "0.2s",
//                         }}
//                         onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f8ff")}
//                         onMouseLeave={(e) => (e.target.style.backgroundColor = "#fff")}
//                     >
//                         <div style={{ fontWeight: "thin",fontSize: "12px", }}>{r.label}</div>
//                         <div style={{ fontSize: "10px", color: "#555" }}>
//                             {format(r.range().startDate, "MMM dd, yyyy")} - {format(r.range().endDate, "MMM dd, yyyy")}
//                         </div>
//                     </button>
//                 ))}
//                 {/* <button
//                     onClick={clearSelection}
//                     style={{
//                         marginTop: "auto",
//                         padding: "8px 12px",
//                         borderRadius: "5px",
//                         border: "none",
//                         backgroundColor: "#ff4d4f",
//                         color: "#fff",
//                         cursor: "pointer",
//                     }}
//                 >
//                     Clear
//                 </button> */}
//             </div>

//             {/* Right Panel: Calendar */}
//             <div style={{ flex: 1, padding: "10px" }}>
//                 <DateRange
//                     ranges={[selectionRange]}
//                     onChange={handleSelect}
//                     months={window.innerWidth < 1024 ? 1 : 2}
//                     direction="horizontal"
//                     showSelectionPreview={true}
//                     moveRangeOnFirstSelection={false}
//                     rangeColors={["#c3b66eff"]}
//                 />
//             </div>
//         </div>
//     );
// };

// export default DashboardDateRangePicker;
