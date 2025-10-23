import React from "react";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import ShareIcon from "@mui/icons-material/Share";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

const menuOptions = [
  { label: "Open this card", icon: <OpenInNewIcon />, action: "open" },
  { label: "Add to dashboard", icon: <DashboardIcon />, action: "add" },
  { label: "Edit this card", icon: <EditIcon />, action: "edit" },
  { label: "Edit as new card", icon: <EditIcon />, action: "editNew" },
  { label: "Refresh", icon: <RefreshIcon />, action: "refresh" },
  { label: "Share", icon: <ShareIcon />, action: "share" },
  { label: "Download CSV", icon: <DownloadIcon />, action: "download" },
  { label: "Print", icon: <PrintIcon />, action: "print" },
];

const ControlMenuModal = ({ anchorEl, open, onClose, onAction }) => {
  const handleClick = (action) => {
    if (onAction) onAction(action);
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{
          sx: {
            borderRadius: 4, // 4 * 8px = 32px radius
            boxShadow: "0px 10px 30px rgba(0,0,0,0.2)", // custom shadow
            mt: 1, // margin top if needed
          },
        }}
    >
      {menuOptions.map((item) => (
        <MenuItem key={item.action} onClick={() => handleClick(item.action)} sx={{py:1}}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText>{item.label}</ListItemText>
        </MenuItem>
      ))}
    </Menu>
  );
};

export default ControlMenuModal;
