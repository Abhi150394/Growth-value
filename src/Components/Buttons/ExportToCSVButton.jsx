import React from "react";

// Utility to convert JSON data to CSV
const convertToCSV = (data) => {
    if (!data || !data.length) return "";
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(field => JSON.stringify(row[field] || "")).join(","));
    return [headers.join(","), ...rows].join("\n");
};

const ExportButton = ({ data, filename = "export.csv", className = "" ,handleCSV }) => {
    const handleExport =handleCSV?handleCSV: () => {
        const csv = convertToCSV(data);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();

        URL.revokeObjectURL(url);
    };

    return (
        <div className={`export-button ${className}`}>
            <button
                onClick={handleExport}
                style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 20px",
                    // borderRadius: "25px",
                    border: "none",
                    // background: "linear-gradient(90deg, #007BFF, #00CFFF)",
                    background:'#ffffff',
                    color: "#000000",
                    cursor: "pointer",
                    fontWeight: "500",
                    fontSize: "14px",
                    // transition: "all 0.3s ease",
                    whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => (e.target.style.opacity = 0.85)}
                onMouseLeave={(e) => (e.target.style.opacity = 1)}
            >
                {/* Download Icon */}
                <svg
                    className="fa-file-download"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fa"
                    data-icon="file-download"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                    width="16"
                    height="16"
                    style={{ marginRight: "0.5em" }}
                >
                    <path
                        fill="#0000000"
                        d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm76.45 211.36l-96.42 95.7c-6.65 6.61-17.39 6.61-24.04 0l-96.42-95.7C73.42 337.29 80.54 320 94.82 320H160v-80c0-8.84 7.16-16 16-16h32c8.84 0 16 7.16 16 16v80h65.18c14.28 0 21.4 17.29 11.27 27.36zM377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z"
                    ></path>
                </svg>
                Export to CSV
            </button>
        </div>
    );
};

export default ExportButton;
