// DrilldownBeautifulGrid.jsx
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
  // Safe, robust header that toggles sort using multiple available APIs
  const colId = props.column?.colId;
  const align =
    colId === "identifier" || colId === "location" ? "left" : "right";
  const [sortState, setSortState] = React.useState(() =>
    typeof props.column?.getSort === "function" ? props.column.getSort() : null
  );

  React.useEffect(() => {
    if (!props.column?.addEventListener) return;
    const onSortChanged = () =>
      setSortState(
        typeof props.column.getSort === "function"
          ? props.column.getSort()
          : null
      );
    props.column.addEventListener("sortChanged", onSortChanged);
    return () => props.column.removeEventListener("sortChanged", onSortChanged);
  }, [props.column]);

  const notifyGrid = () => {
    try {
      if (
        props.api &&
        typeof props.api.refreshClientSideRowModel === "function"
      ) {
        props.api.refreshClientSideRowModel("sort");
      }
      if (props.api && typeof props.api.onSortChanged === "function") {
        props.api.onSortChanged();
      }
    } catch {}
  };

  const handleClick = () => {
    if (props.enableSorting === false) return;
    try {
      const currentSort =
        typeof props.column?.getSort === "function"
          ? props.column.getSort()
          : null;
      const next = currentSort === "asc" ? "desc" : "asc";

      if (typeof props.setSort === "function") {
        props.setSort(next);
        notifyGrid();
        return;
      }

      if (props.column && typeof props.column.setSort === "function") {
        props.column.setSort(next);
        notifyGrid();
        return;
      }

      const colIdSafe = props.column?.getColId
        ? props.column.getColId()
        : props.column?.colId;
      if (
        props.columnApi &&
        typeof props.columnApi.applyColumnState === "function"
      ) {
        props.columnApi.applyColumnState({
          state: [{ colId: colIdSafe, sort: next }],
          applyOrder: false,
        });
        notifyGrid();
        return;
      }

      if (props.api && typeof props.api.setSortModel === "function") {
        props.api.setSortModel([{ colId: colIdSafe, sort: next }]);
        notifyGrid();
        return;
      }
    } catch {}
  };

  const getSortIcon = () => {
    if (sortState === "asc") return ascending;
    if (sortState === "desc") return descending;
    return noSorting;
  };

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
  const [expandedSet, setExpandedSet] = useState(new Set());
  const [breadcrumb, setBreadcrumb] = useState(["Top"]);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    setExpandedSet(new Set());
    setBreadcrumb(["Top"]);
    setCurrentPage(0);
    gridApi.current?.paginationGoToFirstPage?.();
  }, [data]);

  const moneyFmt = (v) =>
    (v ?? 0).toLocaleString(undefined, { minimumFractionDigits: 0 });

  // labels for injected mini-header (match your detailCols)
  const CHILD_HEADER_LABELS = {
    c1: "Date",
    c2: "Tender type",
    c3: "Payments",
  };

  // processed (flattened) data: parent -> optional childHeader -> child rows
  const processedData = useMemo(() => {
    const out = [];
    data.forEach((row, idx) => {
      const parentKey = row.location ?? `parent-${idx}`;
      out.push({
        ...row,
        __rowType: "parent",
        __parentKey: parentKey,
        __parentIndex: idx,
      });

      if (
        expandedSet.has(parentKey) &&
        Array.isArray(row.details) &&
        row.details.length > 0
      ) {
        out.push({
          __rowType: "childHeader",
          __parentKey: parentKey,
          __parentIndex: idx,
          __childHeaderLabels: CHILD_HEADER_LABELS,
        });

        row.details.forEach((child, cidx) => {
          out.push({
            ...child,
            __rowType: "child",
            __parentKey: parentKey,
            __parentIndex: idx,
            __childIndex: cidx,
          });
        });
      }
    });
    return out;
  }, [data, expandedSet]);

  /** Columns — with valueGetters/comparators so both parent & child rows sort correctly */
  const columns = useMemo(() => {
    return [
      {
        headerName: "Location",
        colId: "locationCol",
        field: "__left",
        minWidth: 160,
        sortable: enableSorting,
        filter: enableFilter,
        resizable: enableResize,
        flex: 1.2,
        headerComponent: CustomHeader,
        headerComponentParams: { title: "Location", subTitle, key: "location" },
        // return primitive for sorting
        valueGetter: (params) => {
          const r = params.data;
          if (!r) return "";
          if (r.__rowType === "parent") return r.location ?? "";
          if (r.__rowType === "child") return r.date ?? "";
          if (r.__rowType === "childHeader")
            return r.__childHeaderLabels?.c1 ?? "";
          return "";
        },
        cellRenderer: (params) => {
          const t = params.data?.__rowType;
          if (t === "childHeader") {
            return (
              <div
                style={{
                  fontWeight: 700,
                  paddingLeft: 10,
                  fontSize: 13,
                  color: COLORS.muted,
                  textAlign: "left",
                }}
              >
                {params.data.__childHeaderLabels?.c1 ?? CHILD_HEADER_LABELS.c1}
              </div>
            );
          }
          if (t === "child") {
            const label = params.data.date ?? "";
            return (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 24 }} />
                <div style={{ paddingLeft: 6 }}>{label}</div>
              </div>
            );
          }
          // parent row
          const hasDetails = (params.data?.details?.length ?? 0) > 0;
          const parentKey = params.data.__parentKey;
          const isExpanded = expandedSet.has(parentKey);
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
                <span
                  aria-hidden
                  style={{
                    color: "#999",
                    display: "flex",
                    cursor: "pointer",
                    transform: isExpanded ? "rotate(90deg)" : "none",
                    transition: "transform 120ms ease",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedSet((prev) => {
                      const next = new Set(prev);
                      if (next.has(parentKey)) next.delete(parentKey);
                      else next.add(parentKey);

                      if (next.size === 1) {
                        const only = Array.from(next.values())[0];
                        const found = data.find(
                          (r, i) => (r.location ?? `parent-${i}`) === only
                        );
                        setBreadcrumb(
                          found ? ["Top", found.location] : ["Top"]
                        );
                      } else {
                        setBreadcrumb(["Top"]);
                      }

                      setTimeout(
                        () => gridApi.current?.paginationGoToFirstPage?.(),
                        0
                      );
                      return next;
                    });
                  }}
                >
                  <ChevronRight fontSize="small" />
                </span>
              )}
              <span>{params.data.location}</span>
            </div>
          );
        },
        cellStyle: { fontSize: 14, padding: "10px", textAlign: "left" },
      },

      // Parent payments column (for parent rows) and Tender for child rows
      {
        headerName: "Payments",
        colId: "paymentsParent",
        field: "__mid1",
        minWidth: 140,
        sortable: enableSorting,
        filter: enableFilter,
        resizable: enableResize,
        flex: 1,
        headerComponent: CustomHeader,
        headerComponentParams: { title: "Payments", subTitle, key: "payments" },
        valueGetter: (params) => {
          const r = params.data;
          if (!r) return null;
          if (r.__rowType === "parent")
            return typeof r.payments === "number"
              ? r.payments
              : r.payments ?? null;
          if (r.__rowType === "child") return r.tender ?? "";
          if (r.__rowType === "childHeader")
            return r.__childHeaderLabels?.c2 ?? "";
          return null;
        },
        comparator: (a, b) => {
          // handle numbers first, fallback to string compare
          const na = a == null ? "" : a;
          const nb = b == null ? "" : b;
          const aNum =
            typeof na === "number"
              ? na
              : parseFloat(String(na).replace(/,/g, ""));
          const bNum =
            typeof nb === "number"
              ? nb
              : parseFloat(String(nb).replace(/,/g, ""));
          if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) return aNum - bNum;
          return String(na).localeCompare(String(nb));
        },
        cellRenderer: (params) => {
          const t = params.data?.__rowType;
          if (t === "childHeader") {
            return (
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 13,
                  textAlign: "right",
                  color: COLORS.muted,
                }}
              >
                {params.data.__childHeaderLabels?.c2 ?? CHILD_HEADER_LABELS.c2}
              </div>
            );
          }
          if (t === "child") {
            const val = params.data.tender ?? "";
            return (
              <div style={{ fontWeight: 600, textAlign: "right" }}>{val}</div>
            );
          }
          // parent
          const parentPayments = params.data.payments;
          return (
            <div style={{ fontWeight: 600, textAlign: "right" }}>
              {parentPayments != null ? moneyFmt(parentPayments) : ""}
            </div>
          );
        },
        cellStyle: {
          fontSize: 14,
          padding: "10px",
          textAlign: "right",
          fontWeight: 600,
        },
      },

      // Child payments column (numeric) — parent rows keep blank here
      {
        headerName: "Payments",
        colId: "paymentsChild",
        field: "__mid2",
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
        valueGetter: (params) => {
          const r = params.data;
          if (!r) return null;
          if (r.__rowType === "child")
            return typeof r.payments === "number"
              ? r.payments
              : r.payments ?? null;
          if (r.__rowType === "childHeader")
            return r.__childHeaderLabels?.c3 ?? "";
          return null;
        },
        comparator: (a, b) => {
          const aNum = Number(a);
          const bNum = Number(b);
          if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) return aNum - bNum;
          return String(a ?? "").localeCompare(String(b ?? ""));
        },
        cellRenderer: (params) => {
          const t = params.data?.__rowType;
          if (t === "childHeader") {
            return (
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 13,
                  textAlign: "right",
                  color: COLORS.muted,
                }}
              >
                {params.data.__childHeaderLabels?.c3 ?? CHILD_HEADER_LABELS.c3}
              </div>
            );
          }
          if (t === "child") {
            const val = params.data.payments ?? null;
            if (val == null) return null;
            return (
              <div style={{ fontWeight: 600, textAlign: "right" }}>
                {typeof val === "number" ? val.toLocaleString() : val}
              </div>
            );
          }
          return <div />;
        },
        cellStyle: {
          fontSize: 14,
          padding: "10px",
          textAlign: "right",
          fontWeight: 600,
        },
      },

      // WoW column — only relevant for parents
      {
        headerName: "WoW",
        colId: "wow",
        field: "__right",
        minWidth: 120,
        sortable: enableSorting,
        filter: enableFilter,
        resizable: enableResize,
        flex: 0.8,
        headerComponent: CustomHeader,
        headerComponentParams: { title: "WoW", subTitle, key: "wow" },
        valueGetter: (params) => {
          const r = params.data;
          if (!r) return null;
          if (r.__rowType === "parent") return r.wow ?? null;
          return null;
        },
        comparator: (a, b) => {
          const aNum = Number(a);
          const bNum = Number(b);
          if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) return aNum - bNum;
          return String(a ?? "").localeCompare(String(b ?? ""));
        },
        cellRenderer: (params) => {
          const t = params.data?.__rowType;
          if (t === "childHeader" || t === "child") return <div />;
          const val = params.data?.wow;
          const num = Number.isFinite(val) ? val : null;
          if (num == null) return null;
          const isUp = num >= 0;
          return (
            <span
              style={{
                color: isUp ? COLORS.success : COLORS.danger,
                fontWeight: 700,
                display: "block",
                textAlign: "right",
              }}
            >
              {num.toLocaleString(undefined, { maximumFractionDigits: 0 })}%{" "}
              {isUp ? "↑" : "↓"}
            </span>
          );
        },
        cellStyle: { fontSize: 14, padding: "10px", textAlign: "right" },
      },
    ];
  }, [enableFilter, enableResize, enableSorting, subTitle, expandedSet, data]);

  // Grid ready
  const onGridReady = useCallback(
    (params) => {
      gridApi.current = params.api;
      try {
        params.api.setGridOption?.("paginationPageSize", pageSize);
        params.api.paginationSetPageSize?.(pageSize);
      } catch {}
      const syncPage = () =>
        setCurrentPage(params.api.paginationGetCurrentPage?.() ?? 0);
      params.api.addEventListener("paginationChanged", syncPage);
      return () => {
        try {
          params.api.removeEventListener?.("paginationChanged", syncPage);
        } catch {}
      };
    },
    [pageSize]
  );

  // After AG Grid finishes its internal sort, regroup rows so children remain under their parent.
  const onPostSort = useCallback(
    (params) => {
      try {
        const nodes = params.nodes ?? [];
        if (!nodes.length) return;

        // Build ordered lists: when iterating nodes in sorted order, collect child/header nodes grouped by parent
        const groupedChildren = new Map();
        for (const n of nodes) {
          const d = n.data;
          if (!d) continue;
          if (d.__rowType === "childHeader" || d.__rowType === "child") {
            const arr = groupedChildren.get(d.__parentKey) ?? [];
            arr.push(n);
            groupedChildren.set(d.__parentKey, arr);
          }
        }

        // Now assemble regrouped nodes: iterate nodes in their sorted order; when see parent push it and its grouped children (if expanded)
        const regrouped = [];
        for (const n of nodes) {
          const d = n.data;
          if (!d) continue;
          if (d.__rowType === "parent") {
            regrouped.push(n);
            if (expandedSet.has(d.__parentKey)) {
              const childs = groupedChildren.get(d.__parentKey) ?? [];
              for (const cn of childs) regrouped.push(cn);
            }
          }
        }

        // Apply regrouped order by re-setting rowData (AG Grid will keep sort indicators)
        const newData = regrouped.map((n) => n.data);
        params.api.setRowData(newData);
      } catch (e) {
        // fail silently
        // console.error("onPostSort error", e);
      }
    },
    [expandedSet]
  );

  // sync pageSize or processedData changes to grid
  useEffect(() => {
    if (!gridApi.current) return;
    try {
      gridApi.current.setGridOption?.("paginationPageSize", pageSize);
      gridApi.current.paginationSetPageSize?.(pageSize);
      gridApi.current.paginationGoToFirstPage?.();
    } catch {}
    setCurrentPage(0);
  }, [pageSize, processedData.length]);

  const goToPage = (page) => {
    const api = gridApi.current;
    if (!api) {
      setCurrentPage(page);
      return;
    }
    try {
      api.paginationGoToPage(page);
      setCurrentPage(api.paginationGetCurrentPage?.() ?? page);
    } catch {
      setCurrentPage(page);
    }
  };

  const visibleRangeText = useMemo(() => {
    const total = processedData.length;
    if (total === 0) return "0 of 0";
    const start = currentPage * pageSize + 1;
    const end = Math.min((currentPage + 1) * pageSize, total);
    return `${start} - ${end} of ${total}`;
  }, [processedData.length, currentPage, pageSize]);

  const getRowId = useCallback((params) => {
    const t = params.data?.__rowType;
    if (t === "child")
      return `child-${params.data.__parentKey}-${params.data.__childIndex}`;
    if (t === "childHeader") return `childHeader-${params.data.__parentKey}`;
    return `parent-${params.data.__parentKey}`;
  }, []);

  // Parent row click toggles expansion; ignore clicks on children/header
  const onRowClicked = useCallback(
    (params) => {
      const t = params.data?.__rowType;
      if (t !== "parent") return;
      const parentKey = params.data.__parentKey;
      const hasDetails = (params.data.details?.length ?? 0) > 0;
      if (!hasDetails) return;
      setExpandedSet((prev) => {
        const next = new Set(prev);
        if (next.has(parentKey)) next.delete(parentKey);
        else next.add(parentKey);

        if (next.size === 1) {
          const only = Array.from(next.values())[0];
          const found = data.find(
            (r, i) => (r.location ?? `parent-${i}`) === only
          );
          setBreadcrumb(found ? ["Top", found.location] : ["Top"]);
        } else {
          setBreadcrumb(["Top"]);
        }

        setTimeout(() => gridApi.current?.paginationGoToFirstPage?.(), 0);
        return next;
      });
    },
    [data]
  );

  const getRowStyle = useCallback((params) => {
    const idx = params.node.rowIndex ?? 0;
    const zebra = idx % 2 === 0 ? "#fafafa" : "#ffffff";
    const t = params.data?.__rowType;
    if (t === "childHeader") {
      return {
        backgroundColor: "#f4f6f8",
        borderBottom: `1px solid ${COLORS.borderColor}`,
        cursor: "default",
      };
    }
    if (t === "child") {
      return {
        backgroundColor: zebra,
        borderBottom: `1px solid ${COLORS.borderColor}`,
        cursor: "default",
      };
    }
    return {
      backgroundColor: zebra,
      borderBottom: `1px solid ${COLORS.borderColor}`,
      cursor: (params.data?.details?.length ?? 0) > 0 ? "pointer" : "default",
    };
  }, []);

  const pageSizeOptions = [
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 50, label: "50" },
  ];
  const handlePageSizeChange = (selected) => setPageSize(selected.value);

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
              onClick={
                !isLast
                  ? () => {
                      setExpandedSet(new Set());
                      setBreadcrumb(["Top"]);
                      setTimeout(
                        () => gridApi.current?.paginationGoToFirstPage?.(),
                        0
                      );
                    }
                  : undefined
              }
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
        style={{ height: tableHeight, width: tableWidth }}
      >
        <AgGridReact
          rowData={processedData}
          columnDefs={columns}
          defaultColDef={{
            sortable: enableSorting,
            resizable: enableResize,
            filter: enableFilter,
            flex: 1,
            minWidth: 110,
          }}
          getRowId={getRowId}
          onGridReady={onGridReady}
          onRowClicked={onRowClicked}
          onPostSort={onPostSort}
          pagination
          suppressPaginationPanel
          rowHeight={46}
          headerHeight={56}
          getRowStyle={getRowStyle}
          rowSelection={"single"}
        />
      </div>

      {/* Footer */}
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
                dropdownIndicator: (base) => ({ ...base, padding: "2px 4px" }),
                valueContainer: (base) => ({ ...base, padding: "0 8px" }),
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
              {visibleRangeText}
            </span>
          </div>
        </div>

        <Pagination
          current={currentPage + 1}
          total={processedData.length}
          pageSize={pageSize}
          showSizeChanger={false}
          onChange={(page) => goToPage(page - 1)}
        />
      </div>
    </div>
  );
};

export default DrilldownBeautifulGrid;
