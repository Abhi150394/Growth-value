
export default function getYOYComparison(payload) {
  const currentSummary = payload?.current_period?.summary || {};
  const lastYearSummary = payload?.last_year_period?.summary || {};

  // helper to format YYYY-MM-DD
  const fmt = (d) => {
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // Get sorted list of current dates (ascending)
  const currentDates = Object.keys(currentSummary)
    .slice()
    .sort((a, b) => new Date(a) - new Date(b));

  const result = currentDates.map((currentDate) => {
    const curr = currentSummary[currentDate] || {
      totalAmount: 0,
      itemsCount: 0,
    };

    // compute the same calendar date last year by subtracting 1 year
    const d = new Date(currentDate);
    d.setFullYear(d.getFullYear() - 1);
    const lastYearKey = fmt(d);

    const last = lastYearSummary[lastYearKey] || {
      totalAmount: 0,
      itemsCount: 0,
    };

    const currentSales = Number(curr.totalAmount || 0);
    const lastSales = Number(last.totalAmount || 0);
    const currentItems = Number(curr.itemsCount || 0);
    const lastItems = Number(last.itemsCount || 0);

    // absolute differences
    const salesDiff = Number((currentSales - lastSales).toFixed(2));
    const itemsDiff = currentItems - lastItems;

    // sales YoY %: numeric (number) or null when not computable
    let salesYOYNumeric = null;
    if (lastSales === 0) {
      // If both are zero, treat as 0% change (no change).
      // If last is zero but current > 0, percent is undefined (we return null and mark as 'N/A').
      salesYOYNumeric = currentSales === 0 ? 0 : currentSales;
    } else {
      salesYOYNumeric = ((currentSales - lastSales) / lastSales) * 100;
    }

    // items YoY %: numeric or null
    let itemsYOYNumeric = null;
    if (lastItems === 0) {
      itemsYOYNumeric = currentItems === 0 ? 0 : currentItems;
    } else {
      itemsYOYNumeric = ((currentItems - lastItems) / lastItems) * 100;
    }

    // formatted strings for display/UI
    const fmtPct = (val) =>
      val === null || val === undefined || Number.isNaN(val)
        ? "N/A"
        : `${val.toFixed(2)}%`;

    return {
      date: currentDate,
      currentSales,
      lastSales,
      salesDiff, // current - last (signed) in currency
      salesYOY: salesYOYNumeric, // numeric (useful for plotting). null means not computable (LY=0 && current>0)
      salesYOYFormatted: fmtPct(salesYOYNumeric),

      currentItems,
      lastItems,
      itemsDiff,
      itemsYOY: itemsYOYNumeric,
      itemsYOYFormatted: fmtPct(itemsYOYNumeric),
    };
  });

  return result;
}

function capitalize(word = "") {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function convertToOptions(arr) {
  return arr?.map(item => ({
    value: item,//.toLowerCase().trim(),
    label: item
  }));
}

const round2 = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

function aggregateSection(rows = []) {
  const sumKeys = [
    "total", "total_ly",
    "count", "count_ly",
    "guest_count", "guest_count_ly",
    "void_count", "void_count_ly",
    "void_total", "void_total_ly",
    "guest_total", "guest_total_ly",
    "budget", "budget_ly"
  ];

  const avgKeys = [
    "time_to_serve",
    "time_to_serve_ly"
  ];

  const result = {};
  const avgCount = {};

  [...sumKeys, ...avgKeys].forEach(k => {
    result[k] = 0;
    avgCount[k] = 0;
  });

  for (const row of rows) {
    // SUM fields
    for (const key of sumKeys) {
      result[key] += Number(row[key] || 0);
    }

    // AVG fields
    for (const key of avgKeys) {
      if (row[key] > 0) {
        result[key] += row[key];
        avgCount[key]++;
      }
    }
  }

    // 🔥 finalize SUM fields (FIXED)
  for (const key of sumKeys) {
    result[key] =result[key].toFixed(2);
  }
  // finalize averages
  for (const key of avgKeys) {
    result[key] = avgCount[key]
      ? +(result[key] / avgCount[key]).toFixed(2)
      : 0;
  }

  return result;
}

export function aggregateByEachOption(data = {}) {
  return Object.entries(data).map(([direction, rows]) => ({
    direction: capitalize(direction),
    ...aggregateSection(rows)
  }));
}



function aggregateLabourSection(rows = []) {
  const sumKeys = [
    "actual_base_cost",
    "actual_base_cost_ly",
    "actual_fully_loaded_cost",
    "actual_fully_loaded_cost_ly",
    "actual_shift_num_mins",
    "actual_shift_num_mins_ly",
    "forecast_base_cost",
    "forecast_base_cost_ly",
    "forecast_fully_loaded_cost",
    "forecast_fully_loaded_cost_ly",
    "forecast_shift_num_mins",
    "forecast_shift_num_mins_ly"
  ];

  const avgKeys = [
    "total_employee",
    "total_employee_ly"
  ];

  const result = {};
  const avgCount = {};

  [...sumKeys, ...avgKeys].forEach(k => {
    result[k] = 0;
    avgCount[k] = 0;
  });

  for (const row of rows) {
    // SUM fields
    for (const key of sumKeys) {
      result[key] += Number(row[key] || 0);
    }

    // AVG fields
    for (const key of avgKeys) {
      if (row[key] > 0) {
        result[key] += Number(row[key]);
        avgCount[key]++;
      }
    }
  }

  // finalize SUM fields
  for (const key of sumKeys) {
    result[key] = +result[key].toFixed(2);
  }

  // finalize AVG fields
  for (const key of avgKeys) {
    result[key] = avgCount[key]
      ? +(result[key] / avgCount[key]).toFixed(2)
      : 0;
  }

  return result;
}


export function aggregateLabourByEachOption(data = {}) {
  return Object.entries(data).map(([direction, rows]) => ({
    direction: capitalize(direction),
    ...aggregateLabourSection(rows)
  }));
}
