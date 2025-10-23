import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { AgGridReact } from "ag-grid-react";
import Select from "react-select";
import { Pagination } from "antd";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import printAgGrid, { exportCSV } from "./Utils";
import PrintButton from "../../../Components/Buttons/PrintButton";
import ExportButton from "../../../Components/Buttons/ExportToCSVButton";

const SalesTransactionsTable = forwardRef(
  (
    {
      data,
      defaultRegion = "overall",
      regionMapKey = "id_name_map",
      valueFields = ["guest_total", "count"],
      labelFields = ["Sales, $", "Transactions"],
      COLORS = { green: "#2ecc71", red: "#e74c3c" },
      searchText = "",
      sectionName = "Area",
    },
    ref
  ) => {
    const gridApi = useRef(null);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedRegion, setSelectedRegion] = useState(defaultRegion);

    const handlePrint = () => {
      if (gridApi.current) {
        printAgGrid(gridApi, "Sales Table");
      }
    };
    useImperativeHandle(ref, () => ({
      handlePrint,
    }));
    
    // extract region data dynamically
    const regionData = useMemo(() => {
      if (!data) return [];
      if (selectedRegion === "overall") return data.overall || [];
      return data.detail?.[selectedRegion] || [];
    }, [data, selectedRegion]);

    // build table data with totals
    const { tableData, columnDefs } = useMemo(() => {
      if (!regionData) return { tableData: [], columnDefs: [] };

      const totals = {};
      valueFields.forEach((field) => {
        totals[field] = regionData.reduce((s, r) => s + (r[field] || 0), 0);
        totals[`${field}_ly`] = regionData.reduce(
          (s, r) => s + (r[`${field}_ly`] || 0),
          0
        );
      });

      const totalRow = { identifier: "Total", ...totals };

      const tableData = [
        totalRow,
        ...regionData.map((r) => {
          const obj = { identifier: r.period || r.identifier };
          valueFields.forEach((field) => {
            obj[field] = r[field];
            obj[`${field}_ly`] = r[`${field}_ly`];
          });
          return obj;
        }),
      ];

      // create dynamic column definitions
      const columnDefs = [
        { headerName: sectionName, field: "identifier", minWidth: 140 },
        ...labelFields.map((label, idx) => ({
          headerName: label,
          children: [
            {
              headerName: "This Year",
              field: valueFields[idx],
              valueFormatter: (p) =>
                p.value?.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                }),
            },
            {
              headerName: "Last Year",
              field: `${valueFields[idx]}_ly`,
              valueFormatter: (p) =>
                p.value?.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                }),
            },
            {
              headerName: "YoY, %",
              valueGetter: (p) =>
                p.data[`${valueFields[idx]}_ly`]
                  ? ((p.data[valueFields[idx]] -
                      p.data[`${valueFields[idx]}_ly`]) /
                      p.data[`${valueFields[idx]}_ly`]) *
                    100
                  : 0,
              cellRenderer: (p) => {
                const val = p.value || 0;
                const isUp = val >= 0;
                return (
                  <span
                    style={{
                      color: isUp ? COLORS.green : COLORS.red,
                      fontWeight: 600,
                    }}
                  >
                    {Math.round(val)}% {isUp ? "↑" : "↓"}
                  </span>
                );
              },
            },
          ],
        })),
      ];

      return { tableData, columnDefs };
    }, [regionData, valueFields, labelFields, COLORS]);

    // pagination
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
    useEffect(() => {
      if (
        gridApi.current &&
        typeof gridApi.current.setFilterModel === "function"
      ) {
        if (searchText) {
          const model = {};
          columnDefs.forEach((col) => {
            if (!col.children) {
              model[col.field] = {
                filterType: "text",
                type: "contains",
                filter: searchText,
              };
            } else {
              col.children.forEach((child) => {
                model[child.field] = {
                  filterType: "text",
                  type: "contains",
                  filter: searchText,
                };
              });
            }
          });
          gridApi.current.setFilterModel(model);
        } else {
          gridApi.current.setFilterModel(null);
        }
        gridApi.current.onFilterChanged();
      }
    }, [searchText, tableData, columnDefs]);

    return (
      <div>
        {/* Region Selector */}
        {/* {data[regionMapKey] && (
        <Select
          value={data[regionMapKey].find((r) => r.id === selectedRegion)}
          onChange={(opt) => setSelectedRegion(opt.id)}
          options={data[regionMapKey]}
          getOptionLabel={(opt) => opt.name}
          getOptionValue={(opt) => opt.id}
          styles={{
            container: (base) => ({ ...base, width: 150, marginBottom: 12 }),
          }}
        />
      )} */}
        <div style={{ marginBottom: "10px", display: "flex" }}>
          {/* <button onClick={handlePrint}>Print Table</button> */}
          <PrintButton handlePrint={handlePrint} />
          <ExportButton handleCSV={() => exportCSV(gridApi)} />
        </div>
        {/* <button onClick={() => exportCSV(gridApi)}>Export CSV</button> */}

        {/* AG Grid */}
        <div className="ag-theme-quartz" style={{ height: 400, width: "100%" }}>
          <AgGridReact
            rowData={tableData}
            columnDefs={columnDefs}
            pagination={true}
            suppressPaginationPanel={true}
            onGridReady={onGridReady}
            rowHeight={50}
            headerHeight={50}
            height={600}
            defaultColDef={{
              sortable: true,
              resizable: true,
              flex: 1,
              minWidth: 120,
              filter: true,
              cellStyle: (params) =>
                params.node?.rowIndex === 0
                  ? { fontWeight: 700 }
                  : { fontSize: "14px", padding: "10px", fontWeight: 500 },
            }}
          />
        </div>

        {/* Pagination */}
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
                control: (base) => ({ ...base, minHeight: "30px" }),
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
  }
);

export default SalesTransactionsTable;
