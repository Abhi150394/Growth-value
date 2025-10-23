import React, { useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import Select from "react-select";
import { Pagination } from "antd";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { COLORS } from "../../constants"; // make sure COLORS has green/red shades

const SalesTransactionsTable = ({ data }) => {
    const gridApi = useRef(null);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);

    // prepare table data
    const { tableData, columnDefs } = useMemo(() => {
        if (!data) return { tableData: [], columnDefs: [] };

        // compute total row
        const total_guest = data.reduce((s, r) => s + r.guest_total, 0);
        const total_guest_ly = data.reduce((s, r) => s + r.guest_total_ly, 0);
        const total_count = data.reduce((s, r) => s + r.count, 0);
        const total_count_ly = data.reduce((s, r) => s + r.count_ly, 0);

        const totalRow = {
            identifier: "Total",
            guest_total: total_guest,
            guest_total_ly: total_guest_ly,
            count: total_count,
            count_ly: total_count_ly,
        };

        const tableData = [totalRow, ...data];

        // column definitions
        const columnDefs = [
            { headerName: "Area", field: "identifier", minWidth: 140 },
            {
                headerName: "Sales, $",
                children: [
                    {
                        headerName: "This Year",
                        field: "guest_total",
                        valueFormatter: (p) =>
                            p.value?.toLocaleString(undefined, { maximumFractionDigits: 0 }),
                    },
                    {
                        headerName: "Last Year",
                        field: "guest_total_ly",
                        valueFormatter: (p) =>
                            p.value?.toLocaleString(undefined, { maximumFractionDigits: 0 }),
                    },
                    {
                        headerName: "YoY, %",
                        valueGetter: (p) =>
                            p.data.guest_total_ly
                                ? ((p.data.guest_total - p.data.guest_total_ly) /
                                    p.data.guest_total_ly) *
                                100
                                : 0,
                        cellRenderer: (p) => {
                            const val = p.value || 0;
                            const isUp = val >= 0;
                            return (
                                <span style={{ color: isUp ? "green" : "red", fontWeight: 600 }}>
                                    {Math.round(val)}% {isUp ? "↑" : "↓"}
                                </span>
                            );
                        },
                    },
                ],
            },
            {
                headerName: "Transactions",
                children: [
                    { headerName: "This Year", field: "count" },
                    { headerName: "Last Year", field: "count_ly" },
                    {
                        headerName: "YoY, %",
                        valueGetter: (p) =>
                            p.data.count_ly
                                ? ((p.data.count - p.data.count_ly) / p.data.count_ly) * 100
                                : 0,
                        cellRenderer: (p) => {
                            const val = p.value || 0;
                            const isUp = val >= 0;
                            return (
                                <span style={{ color: isUp ? "green" : "red", fontWeight: 600 }}>
                                    {Math.round(val)}% {isUp ? "↑" : "↓"}
                                </span>
                            );
                        },
                    },
                ],
            },
        ];

        return { tableData, columnDefs };
    }, [data]);

    // pagination controls
    const pageSizeOptions = [
        { value: 5, label: "5" },
        { value: 10, label: "10" },
        { value: 20, label: "20" },
    ];

    const onGridReady = (params) => {
        gridApi.current = params.api;
        params.api.setGridOption("paginationPageSize", pageSize);
    };

    const handlePageSizeChange = (selected) => {
        const newSize = selected.value;
        setPageSize(newSize);
        gridApi.current.setGridOption("paginationPageSize", newSize);
        setCurrentPage(0);
    };

    const goToPage = (page) => {
        gridApi.current.paginationGoToPage(page);
        setCurrentPage(page);
    };

    return (
        <div>
            <div
                className="ag-theme-quartz"
                style={{
                    height: 400,
                    width: "100%",
                }}
            >
                <AgGridReact
                    rowData={tableData}
                    columnDefs={columnDefs}
                    pagination={true}
                    suppressPaginationPanel={true}
                    onGridReady={onGridReady}
                    rowHeight={50}
                    headerHeight={50}
                    // getRowStyle={(params) => {
                    //     console.log("===============", params);
                    //     if (params.node.rowIndex === 0) {
                    //         return { fontWeight: "1000", backgroundColor: "#f9f9f9" };
                    //     }
                    //     // if (params.data.identifier === "Total") {
                    //     //     return { fontWeight: "bold", background: "#f5f5f5" };
                    //     // }
                    //     return {};
                    // }}
                    defaultColDef={{
                        sortable: true,
                        resizable: true,
                        flex: 1,
                        minWidth: 120,
                        cellStyle: (params) => {
                            if (params.node?.rowIndex === 0) {
                                return { fontWeight: 700 };
                            }
                            return {
                                fontSize: "14px",
                                padding: "10px",
                                fontWeight: 500,
                                // textAlign: "center",
                            };
                        },
                    }}
                />
            </div>

            {/* Custom Pagination */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                }}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <Select
                        value={pageSizeOptions.find((opt) => opt.value === pageSize)}
                        onChange={handlePageSizeChange}
                        options={pageSizeOptions}
                        styles={{
                            container: (base) => ({ ...base, width: 80, fontSize: "14px" }),
                            control: (base, state) => ({
                                ...base,
                                minHeight: "30px",
                                borderColor: state.isFocused ? COLORS.bgSelected : "#ccc",
                            }),
                            dropdownIndicator: (base) => ({
                                ...base,
                                padding: "2px 4px",
                            }),
                            valueContainer: (base) => ({
                                ...base,
                                padding: "0 6px",
                            }),
                        }}
                        isSearchable={false}
                    />
                    <span style={{ fontSize: "12px", color: "#555" }}>
                        {tableData.length > 0
                            ? `${currentPage * pageSize + 1} - ${Math.min(
                                (currentPage + 1) * pageSize,
                                tableData.length
                            )} of ${tableData.length}`
                            : "0 of 0"}
                    </span>
                </div>

                <Pagination
                    current={currentPage + 1}
                    total={tableData.length}
                    pageSize={pageSize}
                    showSizeChanger={false}
                    onChange={(page) => goToPage(page - 1)}
                />
            </div>
        </div>
    );
};

export default SalesTransactionsTable;
