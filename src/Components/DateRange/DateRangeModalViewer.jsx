import React, { useContext, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { FilterContext } from "../../Contexts/FilterContext";
import { FaCalendar } from "react-icons/fa";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Stack, Typography, IconButton } from "@mui/material";
import DashboardDateRangePicker from "./DateRangeSelector";

/**
 * Props:
 *  - size: "default" | "small"
 *  - maxRange?: number  // optional max allowed days (e.g., 7)
 */
const DateRangeSelector = ({ size = "default", maxRange }) => {
  const { filters, updateFilter } = useContext(FilterContext);
  const { dateRange } = filters || {};
  const [showPicker, setShowPicker] = useState(false);
  const dropdownRef = useRef(null);

  const togglePicker = () => setShowPicker(!showPicker);

  const handleRangeChange = (selection) => {
    // selection has shape { startDate, endDate }
    updateFilter("dateRange", {
      startDate: selection.startDate,
      endDate: selection.endDate,
    });
  };

  const clearRange = (e) => {
    e.stopPropagation();
    const today = new Date();
    updateFilter("dateRange", {
      startDate: new Date(today),
      endDate: new Date(today),
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isSmall = size === "small";

  // safe fallback for display
  const startDisplay = dateRange?.startDate ? new Date(dateRange.startDate) : new Date();
  const endDisplay = dateRange?.endDate ? new Date(dateRange.endDate) : new Date();

  return (
    <Box ref={dropdownRef} position="relative" width={{ xs: "100%", sm: "auto" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems="center"
        spacing={isSmall ? 0.2 : 2}
        onClick={togglePicker}
        sx={{
          padding: isSmall ? "2px 6px" : "4px 10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          cursor: "pointer",
          userSelect: "none",
          backgroundColor: "#f9f9f9",
          maxWidth: isSmall ? 450 : 700,
        }}
      >
        <FaCalendar
          style={{
            color: "#101011ff",
            fontSize: isSmall ? "12px" : "15px",
          }}
        />

        <Typography
          variant="body2"
          fontWeight={400}
          sx={{ fontSize: isSmall ? "0.75rem" : "0.9rem" }}
        >
          Custom
        </Typography>

        <Typography variant="body2" mx={0.5} fontWeight={500}>
          |
        </Typography>

        <Typography
          variant="body2"
          fontWeight={400}
          sx={{
            fontSize: isSmall ? "0.75rem" : "0.9rem",
            minWidth: isSmall ? 70 : 90,
          }}
        >
          {format(new Date(startDisplay), "MM/dd/yyyy")}
        </Typography>

        <Typography variant="body2" mx={0.5} fontWeight={500}>
          →
        </Typography>

        <Typography
          variant="body2"
          fontWeight={400}
          sx={{
            fontSize: isSmall ? "0.75rem" : "0.9rem",
            minWidth: isSmall ? 70 : 90,
          }}
        >
          {format(new Date(endDisplay), "MM/dd/yyyy")}
        </Typography>

        <IconButton
          size="small"
          onClick={clearRange}
          sx={{
            marginLeft: "auto",
            padding: isSmall ? "2px" : "4px",
            color: "#000",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
          }}
        >
          <CloseIcon fontSize={isSmall ? "inherit" : "small"} />
        </IconButton>
      </Stack>

      {showPicker && (
        <Box
          position="absolute"
          zIndex={1000}
          mt={1.5}
          width={{ xs: "100%", sm: "auto" }}
          sx={{ boxShadow: 3 }}
        >
          {/* pass maxRange down; DashboardDateRangePicker handles undefined gracefully */}
          <DashboardDateRangePicker onChange={handleRangeChange} maxRange={maxRange} />
        </Box>
      )}
    </Box>
  );
};

export default DateRangeSelector;


// import React, { useContext, useEffect, useRef, useState } from "react";
// import { format } from "date-fns";
// import DashboardDateRangePicker from "./DateRangeSelector";
// import { FilterContext } from "../../Contexts/FilterContext";
// import { FaCalendar } from "react-icons/fa";
// import CloseIcon from "@mui/icons-material/Close";
// import { Box, Stack, Typography, IconButton } from "@mui/material";

// const DateRangeSelector = ({ size = "default" }) => {
//   const { filters, updateFilter } = useContext(FilterContext);
//   const { dateRange } = filters;
//   const [showPicker, setShowPicker] = useState(false);
//   const dropdownRef = useRef(null);

//   const togglePicker = () => setShowPicker(!showPicker);

//   const handleRangeChange = (selection) => {
//     updateFilter("dateRange", {
//       startDate: selection.startDate,
//       endDate: selection.endDate,
//     });
//   };

//   const clearRange = (e) => {
//     e.stopPropagation();
//     const today = new Date();
//     updateFilter("dateRange", {
//       startDate: new Date(today),
//       endDate: new Date(today),
//     });
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowPicker(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // 🎨 Dynamic styles for "small" vs "default"
//   const isSmall = size === "small";

//   return (
//     <Box ref={dropdownRef} position="relative" width={{ xs: "100%", sm: "auto" }} >
//       <Stack
//         direction={{ xs: "column", sm: "row" }}
//         alignItems="center"
//         spacing={isSmall ? 0.2 : 2}
//         onClick={togglePicker}
//         sx={{
//           padding: isSmall ? "2px 6px" : "4px 10px",
//           border: "1px solid #ccc",
//           borderRadius: "4px",
//           cursor: "pointer",
//           userSelect: "none",
//           backgroundColor: "#f9f9f9",
//           // transform: isSmall ? "scale(0.95)" : "scale(1)",
//           maxWidth: isSmall ? 450 : 700,
//         }}
//       >
//         <FaCalendar
//           style={{
//             color: "#101011ff",
//             fontSize: isSmall ? "12px" : "15px",
//           }}
//         />

//         <Typography
//           variant="body2"
//           fontWeight={400}
//           sx={{ fontSize: isSmall ? "0.75rem" : "0.9rem" }}
//         >
//           Custom
//         </Typography>

//         <Typography variant="body2" mx={0.5} fontWeight={500}>
//           |
//         </Typography>

//         <Typography
//           variant="body2"
//           fontWeight={400}
//           sx={{
//             fontSize: isSmall ? "0.75rem" : "0.9rem",
//             minWidth: isSmall ? 70 : 90,
//           }}
//         >
//           {format(new Date(dateRange?.startDate), "MM/dd/yyyy")}
//         </Typography>

//         <Typography variant="body2" mx={0.5} fontWeight={500}>
//           →
//         </Typography>

//         <Typography
//           variant="body2"
//           fontWeight={400}
//           sx={{
//             fontSize: isSmall ? "0.75rem" : "0.9rem",
//             minWidth: isSmall ? 70 : 90,
//           }}
//         >
//           {format(new Date(dateRange?.endDate), "MM/dd/yyyy")}
//         </Typography>

//         <IconButton
//           size="small"
//           onClick={clearRange}
//           sx={{
//             marginLeft: "auto",
//             padding: isSmall ? "2px" : "4px",
//             color: "#000",
//             "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
//           }}
//         >
//           <CloseIcon fontSize={isSmall ? "inherit" : "small"} />
//         </IconButton>
//       </Stack>

//       {showPicker && (
//         <Box
//           position="absolute"
//           zIndex={1000}
//           mt={1.5}
//           width={{ xs: "100%", sm: "auto" }}
//           sx={{ boxShadow: 3 }}
//         >
//           <DashboardDateRangePicker onChange={handleRangeChange} />
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default DateRangeSelector;


// import React, { useContext, useEffect, useRef, useState } from "react";
// import { format } from "date-fns";
// import DashboardDateRangePicker from "./DateRangeSelector";
// import { FilterContext } from "../../Contexts/FilterContext";
// import { FaCalendar } from "react-icons/fa";
// import CloseIcon from "@mui/icons-material/Close";
// import { Box, Stack, Typography, IconButton } from "@mui/material";

// const DateRangeSelector = () => {
//   const { filters, updateFilter } = useContext(FilterContext);
//   const { dateRange } = filters;
//   const [showPicker, setShowPicker] = useState(false);
//   const dropdownRef = useRef(null);

//   const togglePicker = () => setShowPicker(!showPicker);

//   const handleRangeChange = (selection) => {
//     updateFilter("dateRange", {
//       startDate: selection.startDate,
//       endDate: selection.endDate,
//     });
//   };

//   const clearRange = (e) => {
//     e.stopPropagation();
//     const today = new Date();
//     updateFilter("dateRange", {
//       startDate: new Date(today),
//       endDate: new Date(today),
//     });
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowPicker(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <Box
//       ref={dropdownRef}
//       position="relative"
//       width={{ xs: "100%", sm: "auto" }}
//     >
//       <Stack
//         direction={{ xs: "column", sm: "row" }}
//         alignItems="center"
//         spacing={2}
//         onClick={togglePicker}
//         sx={{
//           padding: "3px 10px",
//           border: "1px solid #ccc",
//           borderRadius: "4px",
//           cursor: "pointer",
//           userSelect: "none",
//           width: "100%",
//           maxWidth: 700,
//           backgroundColor: "#f9f9f9",
//         }}
//       >
//         <FaCalendar style={{ color: "#101011ff", fontSize: "15px" }} />

//         <Typography
//           variant="subtitle3"
//           fontWeight={400}
//           textAlign="center"
//           flex={{ xs: "1 1 100%", sm: "0 0 auto" }}
//         >
//           Custom
//         </Typography>
//         <Typography variant="body2" mx={1} fontWeight={500}>
//           |
//         </Typography>

//         <Typography
//           variant="body2"
//           fontWeight={400}
//           textAlign="center"
//           flex={{ xs: "1 1 100%", sm: "0 0 auto" }}
//           sx={{ minWidth: 90 }}
//         >
//           {format(new Date(dateRange?.startDate), "MM/dd/yyyy")}
//         </Typography>

//         <Typography variant="body2" mx={1} fontWeight={500}>
//           →
//         </Typography>

//         <Typography
//           variant="body2"
//           fontWeight={400}
//           textAlign="center"
//           flex={{ xs: "1 1 100%", sm: "0 0 auto" }}
//           sx={{ minWidth: 90 }}
//         >
//           {format(new Date(dateRange?.endDate), "MM/dd/yyyy")}
//         </Typography>

//         <IconButton
//           size="small"
//           onClick={clearRange}
//           sx={{
//             marginLeft: "auto",
//             padding: "4px",
//             color: "#000", // black icon
//             backgroundColor: "transparent",
//             "&:hover": {
//               backgroundColor: "rgba(0,0,0,0.05)", // subtle hover
//             },
//           }}
//         >
//           <CloseIcon fontSize="small" />
//         </IconButton>
//       </Stack>

//       {/* Modal */}
//       {showPicker && (
//         <Box
//           position="absolute"
//           zIndex={1000}
//           mt={1.5}
//           width={{ xs: "100%", sm: "auto" }}
//           sx={{ boxShadow: 3 }}
//         >
//           <DashboardDateRangePicker onChange={handleRangeChange} />
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default DateRangeSelector;
