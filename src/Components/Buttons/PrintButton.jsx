import React from "react";

const PrintButton = ({
    contentId,      // ID of the element to print
    buttonText = "Print",
    className = "",
    handlePrint
}) => {
    const handlePrint1 =handlePrint?handlePrint: () => {
        const content = document.getElementById(contentId);
        if (!content) {
            console.error(`Element with ID "${contentId}" not found!`);
            return;
        }

        const printWindow = window.open("", "_blank", "width=800,height=600");
        if (!printWindow) {
            console.error("Failed to open print window. Check popup blockers.");
            return;
        }

        printWindow.document.write(`
      <html>
        <head>
          <title>${buttonText}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #007BFF; color: white; }
          </style>
        </head>
        <body>
          ${content.outerHTML}
        </body>
      </html>
    `);

        printWindow.document.close();

        // Small delay to ensure content is rendered before printing
        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }, 300);
    };

    return (
        <button
            onClick={handlePrint1}
            className={className}
            style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 20px",
                border: "none",
                background:'#ffffff',
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
            {buttonText}
        </button>
    );
};

export default PrintButton;
