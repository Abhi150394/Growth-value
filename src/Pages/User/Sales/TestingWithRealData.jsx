import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { AgCharts } from "ag-charts-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import data from "./dummy.js";

function SalesDashboard() {
  // 🧠 Extract from JSON safely using useMemo
  console.log("datadatadata", data);
  const { products, revenues, payments } = useMemo(() => {
    try {
      const report = data.PosiosExport.DayReport;

      // 🧩 Category + Product flattening with structure guard
      const categories = Array.isArray(report.CategoryRevenues.CategoryRevenue)
        ? report.CategoryRevenues.CategoryRevenue
        : [report.CategoryRevenues.CategoryRevenue];

      const allProducts = categories.flatMap((cat) => {
        const productList = cat.ProductRevenues?.ProductRevenue;

        // 🔒 Normalize into array form
        const products = Array.isArray(productList)
          ? productList
          : productList
          ? [productList]
          : [];

        return products.map((p) => ({
          category: cat._name,
          name: p._name,
          quantity: Number(p._amount ?? 0),
          total: Number(p._total ?? 0),
          avgPrice:
            p._amount && p._amount !== "0"
              ? (Number(p._total) / Number(p._amount)).toFixed(2)
              : "0.00",
        }));
      });

      // 💶 Revenue by order type
      const revList = report.Summary.Revenues?.Revenue || [];
      const revenues = Array.isArray(revList) ? revList : [revList];
      const revData = revenues.map((r) => ({
        type: r._type,
        total: Number(r._total),
      }));

      // 💳 Payment breakdown
      const payList = report.Summary.Payments?.Payment || [];
      const payments = Array.isArray(payList) ? payList : [payList];
      const payData = payments.map((p) => ({
        method: p._type,
        total: Number(p._total),
      }));

      return { products: allProducts, revenues: revData, payments: payData };
    } catch (err) {
      console.error("Error parsing JSON:", err);
      return { products: [], revenues: [], payments: [] };
    }
  }, [data]);
  console.log("products, revenues, payments", products, revenues, payments);
  // 🧱 AG Grid setup
  const columnDefs = [
    { field: "category", headerName: "Category", filter: true, sortable: true },
    { field: "name", headerName: "Product", flex: 1, filter: true },
    {
      field: "quantity",
      headerName: "Qty",
      sortable: true,
      width: 100,
      cellStyle: { textAlign: "right" },
    },
    {
      field: "avgPrice",
      headerName: "Avg Price (€)",
      width: 150,
      cellStyle: { textAlign: "right" },
    },
    {
      field: "total",
      headerName: "Total (€)",
      sortable: true,
      width: 150,
      cellStyle: { textAlign: "right" },
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 📋 Product Table */}
      <div className="ag-theme-quartz" style={{ height: 400, width: "80%" }}>
        <h2 className="text-xl font-semibold mb-2">Product Sales</h2>
        <AgGridReact
          rowData={products}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
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

      {/* 📊 Charts Section */}
      <div className="space-y-8">
        {/* Revenue by Order Type */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Revenue by Order Type</h2>
          <AgCharts
            options={{
              autoSize: true,
              data: revenues,
              series: [
                {
                  type: "bar",
                  xKey: "type",
                  yKey: "total",
                  label: { formatter: ({ value }) => `€${value.toFixed(2)}` },
                },
              ],
              legend: { enabled: false },
              axes: [
                {
                  type: "category",
                  position: "bottom",
                  title: { text: "Order Type" },
                },
                {
                  type: "number",
                  position: "left",
                  title: { text: "Revenue (€)" },
                },
              ],
            }}
          />
        </div>

        {/* Payment Breakdown */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Payment Methods</h2>
          <AgCharts
            options={{
              autoSize: true,
              data: payments,
              series: [
                {
                  type: "pie",
                  angleKey: "total",
                  calloutLabelKey: "method",
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default SalesDashboard;
