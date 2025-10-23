
import React, { useContext, useState } from "react";
import { DateRange } from "react-date-range";
import { addDays, startOfMonth, startOfQuarter, startOfYear, format, subDays, endOfMonth } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./DashboardDateRangePicker.css";
import { FilterContext } from "../../Contexts/FilterContext";

const predefinedRanges = [
    { label: "Today", range: () => ({ startDate: new Date(), endDate: new Date() }) },
    {
        label: "Yesterday", range: () => {
            const yesterday = subDays(new Date(), 1);
            return { startDate: yesterday, endDate: yesterday };
        }
    },
    { label: "Week to Date", range: () => ({ startDate: subDays(new Date(), 6), endDate: new Date() }) },
    { label: "Month to Date", range: () => ({ startDate: startOfMonth(new Date()), endDate: new Date() }) },
    { label: "Quarter to Date", range: () => ({ startDate: startOfQuarter(new Date()), endDate: new Date() }) },
    { label: "Year to Date", range: () => ({ startDate: startOfYear(new Date()), endDate: new Date() }) },
    // All past 12 months
    ...Array.from({ length: 12 }, (_, i) => {
        const today = new Date();
        const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
        return {
            label: monthDate.toLocaleString("default", { month: "long" }),
            range: () => ({
                startDate: startOfMonth(monthDate),
                endDate: endOfMonth(monthDate),
            }),
        };
    }),
];

const DashboardDateRangePicker = ({ onChange }) => {
    const { filters, updateFilter, resetFilters } = useContext(FilterContext);
    const { dateRange } = filters
    const [selectionRange, setSelectionRange] = useState({
        startDate: new Date(dateRange?.startDate),
        endDate: new Date(dateRange?.endDate),
        key: "selection",
    });

    const handleSelect = (ranges) => {
        setSelectionRange(ranges.selection);
        if (onChange) onChange(ranges.selection);
    };

    const handleQuickSelect = (rangeFunc) => {
        const range = rangeFunc();
        setSelectionRange({ ...range, key: "selection" });
        if (onChange) onChange({ ...range, key: "selection" });
    };

    const clearSelection = () => {
        const today = new Date();
        setSelectionRange({ startDate: today, endDate: today, key: "selection" });
        if (onChange) onChange({ startDate: today, endDate: today, key: "selection" });
    };

    return (
        <div style={{ display: "flex", border: "1px solid #e0e0e0", borderRadius: "8px", overflow: "hidden", fontFamily: "Arial, sans-serif", width: "auto", background: '#ffffff' }}>

            {/* Left Panel: Predefined Ranges */}
            <div style={{ width: "200px", borderRight: "1px solid #e0e0e0", padding: "10px 0", display: "flex", flexDirection: "column", gap: "10px", height: "410px", overflow: "scroll" }}>
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
                        <div style={{ fontWeight: "thin",fontSize: "12px", }}>{r.label}</div>
                        <div style={{ fontSize: "10px", color: "#555" }}>
                            {format(r.range().startDate, "MMM dd, yyyy")} - {format(r.range().endDate, "MMM dd, yyyy")}
                        </div>
                    </button>
                ))}
                {/* <button
                    onClick={clearSelection}
                    style={{
                        marginTop: "auto",
                        padding: "8px 12px",
                        borderRadius: "5px",
                        border: "none",
                        backgroundColor: "#ff4d4f",
                        color: "#fff",
                        cursor: "pointer",
                    }}
                >
                    Clear
                </button> */}
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
            </div>
        </div>
    );
};

export default DashboardDateRangePicker;
