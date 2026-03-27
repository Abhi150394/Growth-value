import React, { useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import Select from "react-select";
import { Pagination } from "antd";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { COLORS } from "../../../constants";
import { exportCSV } from "./Utils";

const ProductSalesTable = ({ data = [] }) => {
  const gridApi = useRef(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  //   const handlePrint = () => {
  //     if (gridApi.current) printAgGrid(gridApi, "Product Sales Table");
  //   };

  const { columnDefs } = useMemo(() => {
    const columnDefs = [
      { headerName: "Product Name", field: "productName", minWidth: 180 },
      { headerName: "Product ID", field: "pid", minWidth: 100 },
      { headerName: "VAT Rate (%)", field: "vatRate", minWidth: 120 },
      { headerName: "VAT (€)", field: "vat", minWidth: 100 },
      { headerName: "Amount Sold", field: "amount", minWidth: 120 },
      { headerName: "Unit Price (€)", field: "price", minWidth: 120 },
      { headerName: "Total Sales (€)", field: "total", minWidth: 140 },
      { headerName: "Cost (Excl. VAT)", field: "costVatExcl", minWidth: 140 },
      { headerName: "Profit (€)", field: "profit", minWidth: 120 },
    ];

    return { columnDefs };
  }, []);

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
      <div style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
        {/* <button onClick={handlePrint}>Print Table</button> */}
        <button onClick={() => exportCSV(gridApi)}>Export CSV</button>
      </div>

      <div className="ag-theme-quartz" style={{ height: 460, width: "100%" }}>
        <AgGridReact
          rowData={data}
          columnDefs={columnDefs}
          pagination={true}
          suppressPaginationPanel={true}
          onGridReady={onGridReady}
          rowHeight={45}
          headerHeight={50}
          defaultColDef={{
            sortable: true,
            resizable: true,
            flex: 1,
            minWidth: 100,
            cellStyle: {
              fontSize: "14px",
              padding: "8px",
              fontWeight: 300,
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

export default ProductSalesTable;
