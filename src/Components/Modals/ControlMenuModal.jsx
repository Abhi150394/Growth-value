import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Menu, MenuItem, ListItemIcon, ListItemText, Box } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import ShareIcon from "@mui/icons-material/Share";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

/**
 * ControlMenuModal
 *
 * Props:
 *  - anchorEl, open, onClose, onAction: standard menu control
 *  - showOnlyIcon: when true, menu renders slim icon-only items
 */
const ControlMenuModal = ({
  anchorEl,
  open,
  onClose,
  onAction,
  showOnlyIcon = false,
}) => {
  const handleClick = (action) => {
    if (typeof onAction === "function") onAction(action);
    if (typeof onClose === "function") onClose();
  };

  const menuOptions = useMemo(() => {
    const base = [
      { label: "Open this card", icon: <OpenInNewIcon />, action: "open" },
      { label: "Edit as new card", icon: <EditIcon />, action: "editNew" },
      { label: "Refresh", icon: <RefreshIcon />, action: "refresh" },
      { label: "Share", icon: <ShareIcon />, action: "share" },
      { label: "Download CSV", icon: <DownloadIcon />, action: "download" },
    ];

    if (showOnlyIcon) {
      // slim icon-only menu: reuse subset (no text)
      return base;
    }

    // full menu with more options
    return [
      { label: "Open this card", icon: <OpenInNewIcon />, action: "open" },
      { label: "Add to dashboard", icon: <DashboardIcon />, action: "add" },
      { label: "Edit this card", icon: <EditIcon />, action: "edit" },
      { label: "Edit as new card", icon: <EditIcon />, action: "editNew" },
      { label: "Refresh", icon: <RefreshIcon />, action: "refresh" },
      { label: "Share", icon: <ShareIcon />, action: "share" },
      { label: "Download CSV", icon: <DownloadIcon />, action: "download" },
      { label: "Print", icon: <PrintIcon />, action: "print" },
    ];
  }, [showOnlyIcon]);

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{
        sx: {
          borderRadius: showOnlyIcon ? 1.5 : 2, // slightly smaller when icon-only
          boxShadow: "0px 10px 30px rgba(0,0,0,0.12)",
          mt: 1,
          // width control: slim for icon-only, standard for full menu
          minWidth: showOnlyIcon ? 56 : 200,
          px: showOnlyIcon ? 0.5 : 1,
          py: showOnlyIcon ? 0.5 : 0.5,
        },
      }}
      MenuListProps={{
        "aria-label": "control menu",
        dense: true,
        sx: {
          // center icon-only items
          ".MuiMenuItem-root": {
            px: showOnlyIcon ? 0.5 : 1.5,
            py: showOnlyIcon ? 0.5 : 1,
          },
        },
      }}
    >
      {menuOptions.map((item) => (
        <MenuItem
          key={item.action}
          onClick={() => handleClick(item.action)}
          disableRipple={showOnlyIcon} // reduce visual noise for icon-only
          sx={{
            display: "flex",
            alignItems: "center",
            gap: showOnlyIcon ? 0 : 1,
            justifyContent: showOnlyIcon ? "center" : "flex-start",
            minHeight: showOnlyIcon ? 40 : "auto",
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: showOnlyIcon ? 0 : 1,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {item.icon}
          </ListItemIcon>

          {!showOnlyIcon && <ListItemText>{item.label}</ListItemText>}
          
        </MenuItem>
      ))}
    </Menu>
  );
};


export default ControlMenuModal;
