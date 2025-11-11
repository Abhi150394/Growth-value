import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { AgGridReact } from "ag-grid-react";
import Select from "react-select";
import { Pagination } from "antd";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ChevronRight } from "@mui/icons-material";
import { ascending, descending, noSorting } from "../../constants";

const COLORS = {
  bgBase: "#f6f7f9",
  bgLayout: "#ffffff",
  bgSelected: "#e6f4ff",
  bgHoverColor: "#f0f7ff",
  textBase: "#222",
  borderColor: "#d9d9d9",
  success: "#1a7f37",
  danger: "#d0302f",
  muted: "#777",
  header: "#111",
};

const CustomHeader = (props) => {
  const colId = props.column?.colId;
  const align =
    colId === "identifier" || colId === "location" ? "left" : "right";
  const [sortState, setSortState] = React.useState(props.column.getSort());

  React.useEffect(() => {
    const onSortChanged = () => setSortState(props.column.getSort());
    props.column.addEventListener("sortChanged", onSortChanged);
    return () => props.column.removeEventListener("sortChanged", onSortChanged);
  }, [props.column]);

  const handleClick = () => {
    if (props.enableSorting !== false) {
      const currentSort = props.column.getSort();
      props.setSort(currentSort === "asc" ? "desc" : "asc");
    }
  };

  const getSortIcon = () => {
    if (sortState === "asc") return ascending;
    if (sortState === "desc") return descending;
    return noSorting;
  };

  // For left-most identifiers we skip the subtitle row (cleaner look)
  const showSubtitle =
    (props.subTitle ?? "") && !(colId === "identifier" || colId === "location");

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
          gap: 6,
          fontWeight: 700,
          padding: "0 10px",
          color: COLORS.header,
        }}
      >
        <span>{props.title || props?.column?.colDef?.headerName}</span>
        <span style={{ fontSize: 12, opacity: 0.8 }}>{getSortIcon()}</span>
      </div>
      {showSubtitle && (
        <div
          style={{
            fontSize: 12,
            color: COLORS.muted,
            textAlign: align,
            padding: "0 10px",
          }}
        >
          {props.subTitle}
        </div>
      )}
    </div>
  );
};

/** --------- Main Component (Beautified Drilldown) ---------- */
const DrilldownBeautifulGrid = ({
  data = [],
  tableHeight = 420,
  tableWidth = "100%",
  subTitle = "Week to date",
  enableFilter = false,
  enableSorting = true,
  enableResize = true,
}) => {
  const gridApi = useRef(null);
  const [breadcrumb, setBreadcrumb] = useState(["Top"]);
  const [rowData, setRowData] = useState(data);
  const [isDetail, setIsDetail] = useState(false);

  // pagination
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    // initialize with top-level data from props
    setRowData(data);
    setIsDetail(false);
    setBreadcrumb(["Top"]);
    setCurrentPage(0);
    gridApi.current?.paginationGoToFirstPage?.();
  }, [data]);

  const moneyFmt = (v) =>
    (v ?? 0).toLocaleString(undefined, { minimumFractionDigits: 0 });

  const pctCell = (val) => {
    const num = Number.isFinite(val) ? val : 0;
    const isUp = num >= 0;
    return (
      <span
        style={{
          color: isUp ? COLORS.success : COLORS.danger,
          fontWeight: 700,
        }}
      >
        {num.toLocaleString(undefined, { maximumFractionDigits: 0 })}%{" "}
        {isUp ? "↑" : "↓"}
      </span>
    );
  };

  /** Columns — follow reference header style + alignment/formatting */
  const locationCols = useMemo(
    () => [
      {
        headerName: "Location",
        field: "location",
        minWidth: 160,
        sortable: enableSorting,
        filter: enableFilter,
        resizable: enableResize,
        flex: 1.2,
        headerComponent: CustomHeader,
        headerComponentParams: { title: "Location", subTitle, key: "location" },
        cellRenderer: (params) => {
          const hasDetails = (params.data?.details?.length ?? 0) > 0;
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                gap: 8,
                fontWeight: 600,
              }}
            >
              {hasDetails && (
                <span aria-hidden style={{ color: "#999", display: "flex" }}>
                  <ChevronRight fontSize="small" />
                </span>
              )}
              <span>{params.value}</span>
            </div>
          );
        },
        cellStyle: {
          fontSize: 14,
          padding: "10px",
          textAlign: "left",
        },
      },
      {
        headerName: "Payments",
        field: "payments",
        sortable: enableSorting,
        filter: enableFilter,
        resizable: enableResize,
        flex: 1,
        headerComponent: CustomHeader,
        headerComponentParams: {
          title: "Payments",
          subTitle,
          key: "payments",
        },
        valueFormatter: (p) => moneyFmt(p.value),
        cellStyle: {
          fontSize: 14,
          padding: "10px",
          textAlign: "right",
          fontWeight: 600,
        },
      },
    ],
    [enableFilter, enableResize, enableSorting, subTitle]
  );

  const detailCols = useMemo(
    () => [
      {
        headerName: "Date",
        field: "date",
        minWidth: 140,
        sortable: enableSorting,
        filter: enableFilter,
        resizable: enableResize,
        flex: 1,
        headerComponent: CustomHeader,
        headerComponentParams: { title: "Date", subTitle, key: "date" },
        cellStyle: { fontSize: 14, padding: "10px", textAlign: "right" },
      },
      {
        headerName: "Tender type",
        field: "tender",
        minWidth: 140,
        sortable: enableSorting,
        filter: enableFilter,
        resizable: enableResize,
        flex: 1,
        headerComponent: CustomHeader,
        headerComponentParams: {
          title: "Tender type",
          subTitle,
          key: "tender",
        },
        cellStyle: {
          fontSize: 14,
          padding: "10px",
          textAlign: "right",
          fontWeight: 600,
        },
      },
      {
        headerName: "Payments",
        field: "payments",
        minWidth: 120,
        sortable: enableSorting,
        filter: enableFilter,
        resizable: enableResize,
        flex: 1,
        headerComponent: CustomHeader,
        headerComponentParams: {
          title: "Payments",
          subTitle,
          key: "d-payments",
        },
        valueFormatter: (p) => moneyFmt(p.value),
        cellStyle: {
          fontSize: 14,
          padding: "10px",
          textAlign: "right",
          fontWeight: 600,
        },
      },
    ],
    [enableFilter, enableResize, enableSorting, subTitle]
  );

  /** Events */
  const onRowClicked = useCallback(
    (params) => {
      const hasDetails = (params?.data?.details?.length ?? 0) > 0;
      if (!isDetail && hasDetails) {
        setRowData(params.data.details);
        setIsDetail(true);
        setBreadcrumb(["Top", params.data.location]);
        setCurrentPage(0);
        gridApi.current?.paginationGoToFirstPage?.();
      }
    },
    [isDetail]
  );

  const goBack = useCallback(() => {
    setRowData(data);
    setIsDetail(false);
    setBreadcrumb(["Top"]);
    setCurrentPage(0);
    gridApi.current?.paginationGoToFirstPage?.();
  }, [data]);

  const onGridReady = useCallback(
    (params) => {
      gridApi.current = params.api;
      params.api.setGridOption?.("paginationPageSize", pageSize);
      params.api.paginationSetPageSize?.(pageSize); // older versions
      const syncPage = () =>
        setCurrentPage(params.api.paginationGetCurrentPage?.() ?? 0);
      params.api.addEventListener("paginationChanged", syncPage);

      // cleanup to avoid duplicate listeners if the grid remounts
      return () => {
        try {
          params.api.removeEventListener?.("paginationChanged", syncPage);
        } catch {}
      };
    },
    [pageSize]
  );

  // keep grid page size in sync if user changes it
  useEffect(() => {
    if (!gridApi.current) return;
    gridApi.current.setGridOption?.("paginationPageSize", pageSize);
    gridApi.current.paginationSetPageSize?.(pageSize);
    gridApi.current.paginationGoToFirstPage?.();
    setCurrentPage(0);
  }, [pageSize]);

  const goToPage = (page) => {
    const api = gridApi.current;
    if (!api) return;
    api.paginationGoToPage(page);
    setCurrentPage(api.paginationGetCurrentPage?.() ?? page);
  };

  /** Pagination UI */
  const pageSizeOptions = [
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 50, label: "50" },
  ];

  const handlePageSizeChange = (selected) => {
    const newSize = selected.value;
    setPageSize(newSize);
  };

  return (
    <div
      style={{
        width: tableWidth,
        overflow: "hidden",
        border: `1px solid ${COLORS.borderColor}`,
        borderRadius: 8,
        background: COLORS.bgLayout,
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      {/* Breadcrumb */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: `1px solid ${COLORS.borderColor}`,
          fontSize: 14,
          background: COLORS.bgBase,
          fontWeight: 600,
        }}
      >
        {breadcrumb.map((b, idx) => {
          const isLast = idx === breadcrumb.length - 1;
          return (
            <span
              key={idx}
              style={{
                cursor: isLast ? "default" : "pointer",
                color: isLast ? COLORS.textBase : "#1677ff",
              }}
              onClick={!isLast ? goBack : undefined}
              aria-current={isLast ? "page" : undefined}
            >
              {b}
              {idx < breadcrumb.length - 1 && " / "}
            </span>
          );
        })}
      </div>

      {/* Grid */}
      <div
        className="ag-theme-quartz"
        style={{
          height: tableHeight,
          width: tableWidth,
        }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={isDetail ? detailCols : locationCols}
          defaultColDef={{
            sortable: enableSorting,
            resizable: enableResize,
            filter: enableFilter,
            flex: 1,
            minWidth: 130,
          }}
          onRowClicked={onRowClicked}
          pagination
          suppressPaginationPanel
          onGridReady={onGridReady}
          rowHeight={46}
          headerHeight={56}
          getRowStyle={(params) => {
            const zebra =
              params.node.rowIndex % 2 === 0 ? "#fafafa" : "#ffffff";
            return {
              backgroundColor: zebra,
              borderBottom: `1px solid ${COLORS.borderColor}`,
              cursor:
                !isDetail && (params.data?.details?.length ?? 0) > 0
                  ? "pointer"
                  : "default",
            };
          }}
        />
      </div>

      {/* Footer: Page size + Range + Pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 12px",
          borderTop: `1px solid ${COLORS.borderColor}`,
          backgroundColor: COLORS.bgBase,
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Select
              value={pageSizeOptions.find((opt) => opt.value === pageSize)}
              onChange={handlePageSizeChange}
              options={pageSizeOptions}
              styles={{
                container: (base) => ({ ...base, width: 90, fontSize: 14 }),
                control: (base, state) => ({
                  ...base,
                  minHeight: 32,
                  borderColor: state.isFocused ? COLORS.borderColor : "#ccc",
                  boxShadow: state.isFocused
                    ? `0 0 0 1px ${COLORS.borderColor}`
                    : "initial",
                  "&:hover": { borderColor: COLORS.borderColor },
                }),
                dropdownIndicator: (base) => ({
                  ...base,
                  padding: "2px 4px",
                }),
                valueContainer: (base) => ({
                  ...base,
                  padding: "0 8px",
                }),
                option: (base, state) => ({
                  ...base,
                  fontSize: 14,
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
              menuPortalTarget={
                typeof document !== "undefined" ? document.body : null
              }
              isSearchable={false}
            />
            <span style={{ fontSize: 12, color: "#555" }}>
              {rowData.length > 0
                ? `${currentPage * pageSize + 1} - ${Math.min(
                    (currentPage + 1) * pageSize,
                    rowData.length
                  )} of ${rowData.length}`
                : "0 of 0"}
            </span>
          </div>
        </div>

        <Pagination
          current={currentPage + 1}
          total={rowData.length}
          pageSize={pageSize}
          showSizeChanger={false}
          onChange={(page) => goToPage(page - 1)}
        />
      </div>
    </div>
  );
};

export default DrilldownBeautifulGrid;
