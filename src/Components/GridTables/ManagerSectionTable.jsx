import React, { useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import Select from "react-select";
import { Pagination } from "antd";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ascending, COLORS, descending, noSorting } from "../../constants";


const ManagerSectionDynamicTable = ({
    data = [],
    columnMap = {},
    tableHeight = 500,
    tableWidth = "100%",
    enableFilter = false,
    enableSorting = true,
    enableResize = false,
}) => {
    const gridApi = useRef(null);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);

    // Dynamic columns
    const columnDefs = useMemo(() => {
        if (!data || data.length === 0) return [];

        return Object.keys(data[0]).map((key) => ({
            headerName: columnMap[key] || key,
            field: key,
            sortable: enableSorting,
            filter: enableFilter,
            resizable: enableResize,
            flex: 1,
            headerComponent: CustomHeader,
            headerComponentParams: { title: columnMap[key] || key, key: key },
            cellStyle: {
                fontSize: "14px",
                padding: "10px",
                // textAlign: typeof data[0][key] === "number" ? "right" : "left",
                // textAlign: "left",
                textAlign: key === 'full_name' || key === 'location_name' ? "left" : "right",
            },
            valueFormatter: (p) =>
                typeof p.value === "number"
                    // ? p.value.toLocaleString(undefined, { maximumFractionDigits: 2 })
                    ? `${columnMap[key]}`.includes('$') ? `$${p.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : `${columnMap[key]}`.includes('%') ? `${p.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}%` : p.value.toLocaleString(undefined, { maximumFractionDigits: 2 })
                    // ? <span>
                    //     💲 {p.value?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    // </span>
                    : p.value,

        }));
    }, [data, columnMap, enableFilter, enableSorting, enableResize]);

    const pageSizeOptions = [
        { value: 5, label: "5" },
        { value: 10, label: "10" },
        { value: 20, label: "20" },
        { value: 50, label: "50" },
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
        <div style={{ width: tableWidth, overflowX: "auto" }}>
            <div
                className="ag-theme-quartz"
                style={{
                    height: tableHeight,
                    width: tableWidth,
                }}
            >
                <AgGridReact
                    rowData={data}
                    columnDefs={columnDefs}
                    pagination={true}
                    masterDetail={true}
                    suppressPaginationPanel={true}
                    onGridReady={onGridReady}
                    rowHeight={50}
                    headerHeight={50}
                    getRowStyle={(params) => {
                        if (params.node.rowIndex === 0) {
                            return { fontWeight: "700", backgroundColor: "#f9f9f9" };
                        }
                        // if (params.node.rowIndex === 0) {
                        //     return "bold-row"; // apply class for first row
                        // }
                        // if (params.data?.ASPH > 7) {
                        //     return "highlight-row"; // condition example
                        // }
                        return null;
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
                                borderColor: state.isFocused ? `${COLORS.bgSelected}` : "#ccc",
                                boxShadow: state.isFocused ? `0 0 0 1px ${COLORS.borderColor}` : 'initial',
                                "&:hover": { borderColor: `${COLORS.borderColor}` },
                            }),
                            dropdownIndicator: (base) => ({
                                ...base,
                                padding: "2px 4px",
                            }),
                            valueContainer: (base) => ({
                                ...base,
                                padding: "0 6px",
                            }),
                            option: (base, state) => ({
                                ...base,
                                fontSize: "14px",
                                color: "#333",
                                backgroundColor: state.isSelected
                                    ? COLORS.bgSelected
                                    : state.isFocused
                                        ? COLORS.bgBase
                                        : COLORS.bgLayout,
                                color: state.isSelected ? "#000" : COLORS.textBase,
                                "&:hover": { backgroundColor: COLORS.bgHoverColor },
                            }),
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        menuPortalTarget={document.body}
                        isSearchable={false}
                    />
                    <span style={{ fontSize: "12px", color: "#555" }}>
                        {data.length > 0
                            ? `${currentPage * pageSize + 1} - ${Math.min(
                                (currentPage + 1) * pageSize,
                                data.length
                            )} of ${data.length}`
                            : "0 of 0"}
                    </span>
                </div>

                <Pagination
                    current={currentPage + 1}
                    total={data.length}
                    pageSize={pageSize}
                    showSizeChanger={false}
                    onChange={(page) => goToPage(page - 1)}
                />
            </div>
        </div>
    );
};

export default ManagerSectionDynamicTable;


const CustomHeader = (props) => {
    const align = props.column?.colId === 'full_name' || props.column?.colId === 'location_name'
        ? 'left'
        : 'right';

    const [sortState, setSortState] = React.useState(props.column.getSort());

    // AG Grid will call this when column is sorted
    React.useEffect(() => {
        const onSortChanged = () => {
            setSortState(props.column.getSort());
        };

        props.column.addEventListener('sortChanged', onSortChanged);

        return () => {
            props.column.removeEventListener('sortChanged', onSortChanged);
        };
    }, [props.column]);

    const handleClick = () => {
        if (props.enableSorting) {
            const currentSort = props.column.getSort();
            props.setSort(currentSort === 'asc' ? 'desc' : 'asc');
        }
    };

    const getSortIcon = () => {
        if (sortState === 'asc') return ascending;
        if (sortState === 'desc') return descending;
        return noSorting;
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                cursor: props.enableSorting ? "pointer" : "default",
                width: "100%",
                boxSizing: "border-box",
            }}
            onClick={handleClick}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: align === "right" ? "flex-end" : "flex-start",
                    alignItems: "center",
                    gap: 4,
                    fontWeight: 600,
                    padding: "0 10px",
                }}
            >
                <span>{props.title}</span>
                <span style={{ fontSize: "12px" }}>{getSortIcon()}</span>
            </div>

            {props.column?.colId !== 'full_name' && props.column?.colId !== 'location_name' && (
                <div
                    style={{
                        fontSize: 12,
                        color: "#777",
                        textAlign: align,
                        padding: "0 10px",
                    }}
                >
                    Week to date
                </div>
            )}
        </div>
    );
};
