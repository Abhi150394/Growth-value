
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


export function convertToOptions(arr) {
  return arr?.map(item => ({
    value: item,//.toLowerCase().trim(),
    label: item
  }));
}
