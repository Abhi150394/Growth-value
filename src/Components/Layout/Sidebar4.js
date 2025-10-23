import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    Collapse,
    Divider,
    Box,
    useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import logo from "../../Assests/Images/logo.png";
import TranslatedText from "../Controls/TranslatedText";
import sidebarData from "../../Json/sidebarData.json";
import { COLORS } from "../../constants";

const SidebarMui = ({ drawerWidth = 300, visible, setVisible, hamburger }) => {
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery("(max-width:992px)");

    const [openSubMenus, setOpenSubMenus] = useState({});
    const [selectedKey, setSelectedKey] = useState("");

    // detect current route ,expand submenu
    useEffect(() => {
        const currentPath = location.pathname.toLowerCase();
        setSelectedKey(currentPath);

        sidebarData.forEach((menu) => {
            if (menu.subMenu) {
                const hasMatch = menu.subMenu.some((sub) =>
                    currentPath.includes(
                        `/${sub.menuName.replace(/\s+/g, "-").toLowerCase()}`
                    )
                );
                if (hasMatch) {
                    setOpenSubMenus((prev) => ({ ...prev, [menu.id]: true }));
                }
            }
        });
    }, [location]);

    const isMenuSelected = (menu) => {
        if (!menu.subMenu) return false;
        return menu.subMenu.some((sub) => {
            const path = `/${sub.menuName.replace(/\s+/g, "-").toLowerCase()}`;
            return selectedKey === path;
        });
    };

    const handleSubMenuClick = (id) => {
        setOpenSubMenus((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleItemClick = () => {
        if (setVisible && isMobile) setVisible(false);
    };

    return (
        <Drawer
            variant={isMobile && !hamburger ? "temporary" : "permanent"}
            open={!isMobile || visible}
            onClose={() => setVisible?.(false)}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                },
            }}
        >

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    p: 2,
                    position: "sticky",
                    top: 0,
                    backgroundColor: "white",
                    zIndex: 1,
                }}
            >
                <img src={logo} alt="Logo" style={{ maxWidth: "100%" }} />
            </Box>
            <Divider />

            <List>
                {sidebarData.map((menu) => {
                    if (menu.subMenu) {

                        return (
                            <Box key={menu.id}>
                                <ListItemButton onClick={() => handleSubMenuClick(menu.id)}
                                    selected={isMenuSelected(menu)}
                                    sx={{
                                        "& .MuiListItemText-primary": {
                                            fontWeight: "bold",
                                            fontSize: "1.1rem",
                                        },
                                        "&.Mui-selected": {
                                            color: `${COLORS.bgSelected}`,
                                            // color: "white",
                                            "&:hover": { color: `${COLORS.bgHoverColor}` },
                                        },
                                        "&:hover": { color: `${COLORS.bgHoverColor}` },
                                        my: '12px'
                                    }}
                                >
                                    <ListItemText
                                        primary={<TranslatedText>{menu.menuName}</TranslatedText>}
                                    />
                                    {openSubMenus[menu.id] ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                                <Collapse in={openSubMenus[menu.id]} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {menu.subMenu.map((sub) => {
                                            const path = `/home/${menu.menuName?.replace(/\s+/g, "-")
                                                .toLowerCase()}/${sub.menuName
                                                .replace(/\s+/g, "-")
                                                .toLowerCase()}`;
                                            return (
                                                <ListItemButton
                                                    key={sub.menuName}
                                                    component={NavLink}
                                                    to={path}
                                                    selected={selectedKey === path}
                                                    sx={{
                                                        "&.Mui-selected": {
                                                            color: `${COLORS.bgSelected}`,
                                                            "&:hover": {
                                                                color: `${COLORS.bgHoverColor}`,
                                                            },
                                                        }, pl: 4
                                                    }}
                                                    onClick={handleItemClick}

                                                >
                                                    <ListItemText primary={sub.menuName} />
                                                </ListItemButton>
                                            );
                                        })}
                                    </List>
                                </Collapse>
                            </Box>
                        );
                    } else {
                        const path = `/home/${menu.menuName.replace(/\s+/g, "-").toLowerCase()}`;
                        return (
                            <ListItemButton
                                key={menu.menuName}
                                component={NavLink}
                                to={path}
                                selected={selectedKey === path}
                                onClick={handleItemClick}
                                sx={{
                                    "& .MuiListItemText-primary": {
                                        fontWeight: "bold",
                                        fontSize: "1.1rem",
                                    },
                                    "&.Mui-selected": {
                                        color: `${COLORS.bgSelected}`,
                                        "&:hover": { color: `${COLORS.bgHoverColor}` },
                                    },
                                    "&:hover": { color: `${COLORS.bgHoverColor}` },
                                    my: '12px'
                                }}
                            >
                                <ListItemText
                                    primary={<TranslatedText>{menu.menuName}</TranslatedText>}
                                />
                            </ListItemButton>
                        );
                    }
                })}
            </List>
        </Drawer>
    );
};

export default SidebarMui;
