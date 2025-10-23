import React from "react";

const PrintAndCSV = ({
  data,
  contentId,
  fileName = "data.csv",
  actions = ["print", "csv"],
}) => {
  //   const handlePrint = () => {
  //     const content = document.getElementById(contentId);
  //     if (!content) {
  //       console.error(`Element with ID "${contentId}" not found!`);
  //       return;
  //     }

  //     const printWindow = window.open("", "_blank", "width=800,height=600");
  //     if (!printWindow) {
  //       console.error("Failed to open print window. Check popup blockers.");
  //       return;
  //     }

  //     printWindow.document.write(`
  //       <html>
  //         <head>
  //           <title>${"Print"}</title>
  //           <style>
  //             body { font-family: Arial, sans-serif; padding: 20px; }
  //             table { border-collapse: collapse; width: 100%; }
  //             th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
  //             th { background-color: #007BFF; color: white; }
  //           </style>
  //         </head>
  //         <body>
  //           ${content.outerHTML}
  //         </body>
  //       </html>
  //     `);

  //     printWindow.document.close();

  //     // Small delay to ensure content is rendered before printing
  //     setTimeout(() => {
  //       printWindow.focus();
  //       printWindow.print();
  //       printWindow.close();
  //     }, 300);
  //   };

  const handlePrint = () => {
    // Collect sections you want to print
    const sections = [
      document.getElementById("grid-section"),
      document.getElementById("chart-section"),
      document.getElementById("summary-section"),
    ];

    // Verify existence
    const validSections = sections.filter(Boolean);
    if (validSections.length === 0) {
      console.error("No valid print sections found!");
      return;
    }

    // Create new print window
    const printWindow = window.open("", "_blank", "width=800,height=800");
    if (!printWindow) {
      console.error("Failed to open print window. Check popup blockers.");
      return;
    }

    // Clone chart canvases as images
    const clonedSections = validSections.map((section) => {
      const clone = section.cloneNode(true);

      // Convert any <canvas> inside (AG Charts use canvas/SVG)
      const canvases = section.querySelectorAll("canvas");
      const cloneCanvases = clone.querySelectorAll("canvas");

      canvases.forEach((canvas, index) => {
        const dataURL = canvas.toDataURL();
        const img = new Image();
        img.src = dataURL;
        img.style.maxWidth = "100%";
        img.style.display = "block";
        cloneCanvases[index].replaceWith(img);
      });

      return clone.outerHTML;
    });

    // Write content to print window
    printWindow.document.write(`
    <html>
      <head>
        <title>Growth Value | Web Development</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2 { color: #333; margin-bottom: 10px; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #007BFF; color: white; }
          img { margin: 10px 0; }
          .section { margin-bottom: 40px; }
        </style>
      </head>
      <body>
        ${clonedSections
          .map(
            (html, idx) => `
            <div class="section">
              ${html}
            </div>`
          )
          .join("")}
      </body>
    </html>
  `);

    printWindow.document.close();

    // Delay to allow rendering
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleDownloadCSV = () => {
    if (!data || !data.length) return;
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(",")); // Header row

    data.forEach((row) => {
      const values = headers.map((header) => {
        const escaped = ("" + row[header]).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAction = (action) => {
    if (action === "print") handlePrint();
    else if (action === "csv") handleDownloadCSV();
  };

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      {actions.map((action) => {
        return action !== "print" ? (
          <button
            key={action}
            onClick={() => handleAction(action)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 20px",
              // borderRadius: "25px",
              border: "none",
              // background: "linear-gradient(90deg, #007BFF, #00CFFF)",
              background: "#ffffff",
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
        ) : (
          <button
            key={action}
            onClick={() => handleAction(action)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 20px",
              border: "none",
              background: "#ffffff",
              color: "#000000",
              cursor: "pointer",
              fontWeight: "400",
              fontSize: "14px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = 0.85)}
            onMouseLeave={(e) => (e.target.style.opacity = 1)}
          >
            {/* Print Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              viewBox="0 0 24 24"
              style={{ marginRight: "0.5em" }}
            >
              <path d="M16 8.308V5.308H8v3H6.5V4.708C6.5 4.453 6.587 4.239 6.76 4.067S7.148 3.808 7.404 3.808H16.592c.26 0 .477.087.649.26.172.173.259.386.259.642V8.308H16ZM8.308 19h7.384c.09 0 .164-.029.222-.087s.087-.123.087-.212v-3.962H8.308v3.962c0 .09.029.164.087.222.058.058.132.087.222.087ZM19.712 15V10.808c0-.283-.096-.521-.288-.713S18.995 10 18.712 10H5.288c-.283 0-.521.096-.712.288S4.288 10.525 4.288 10.808V15H6.5v-1.769h11V15h2.212Z" />
            </svg>
            Print
          </button>
        );
      })}
    </div>
  );
};

export default PrintAndCSV;
