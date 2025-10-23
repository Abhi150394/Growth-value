import React, { useContext, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import DashboardDateRangePicker from "./DateRangeSelector";
import { FilterContext } from "../../Contexts/FilterContext";
import { FaCalendar } from "react-icons/fa";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Stack, Typography, IconButton } from "@mui/material";

const DateRangeSelector = () => {
  const { filters, updateFilter } = useContext(FilterContext);
  const { dateRange } = filters;
  const [showPicker, setShowPicker] = useState(false);
  const dropdownRef = useRef(null);

  const togglePicker = () => setShowPicker(!showPicker);

  const handleRangeChange = (selection) => {
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

  return (
    <Box ref={dropdownRef} position="relative"  width={{ xs: "100%", sm: "auto" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems="center"
        spacing={2}
        onClick={togglePicker}
        sx={{
          padding: "3px 10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          cursor: "pointer",
          userSelect: "none",
          width: "100%",
          maxWidth: 700,
          backgroundColor: "#f9f9f9",
        }}
      >
        <FaCalendar style={{ color: "#101011ff", fontSize: "15px" }} />

        <Typography
          variant="subtitle3"
          fontWeight={400}
          textAlign="center"
          flex={{ xs: "1 1 100%", sm: "0 0 auto" }}
        >
          Custom
        </Typography>
        <Typography variant="body2" mx={1} fontWeight={500}>
          |
        </Typography>

        <Typography
          variant="body2"
          fontWeight={400}
          textAlign="center"
          flex={{ xs: "1 1 100%", sm: "0 0 auto" }}
          sx={{ minWidth: 90 }}
        >
          {format(new Date(dateRange?.startDate), "MM/dd/yyyy")}
        </Typography>

        <Typography variant="body2" mx={1} fontWeight={500}>
          →
        </Typography>

        <Typography
          variant="body2"
          fontWeight={400}
          textAlign="center"
          flex={{ xs: "1 1 100%", sm: "0 0 auto" }}
          sx={{ minWidth: 90 }}
        >
          {format(new Date(dateRange?.endDate), "MM/dd/yyyy")}
        </Typography>

        <IconButton
  size="small"
  onClick={clearRange}
  sx={{
    marginLeft: "auto",
    padding: "4px",
    color: "#000", // black icon
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.05)", // subtle hover
    },
  }}
>
  <CloseIcon fontSize="small" />
</IconButton>
      </Stack>

      {/* Modal */}
      {showPicker && (
        <Box
          position="absolute"
          zIndex={1000}
          mt={1.5}
          width={{ xs: "100%", sm: "auto" }}
          sx={{ boxShadow: 3 }}
        >
          <DashboardDateRangePicker onChange={handleRangeChange} />
        </Box>
      )}
    </Box>
  );
};

export default DateRangeSelector;
