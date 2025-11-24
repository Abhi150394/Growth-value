import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropUp from "@mui/icons-material/ArrowDropUp";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import ControlMenuModal from "../../Modals/ControlMenuModal";

/**
 * extraRows: [
 *   { label: "ATV", sublabel: "Last week", value: 11.44, currency: "$", precision: 2 },
 *   { label: "ATV", sublabel: "2 weeks ago", value: 11.59, currency: "$", precision: 2 },
 *   { label: "WoW", value: -1.2, isPercent: true, precision: 1, color: "error.main" }
 * ]
 */
export default function SalesFigureCard({
  title = "Sales, YTD",
  subtitle = "",
  value,
  currency = "",
  precision = 0,
  changePercent = null,
  previousValue = null,
  size = "lg",
  color = "#ef7f2f",
  showControls = true,
  formatter,
  showExploreButton = true,
  handleExplore,
  // NEW:
  extraRows = [], // array described above
  mainTag = null, // optional small tag chip shown above the main value (e.g. "Main")
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleMenuAction = (action) => {
    console.log("Menu action clicked:", action);
  };

  const sizes = {
    lg: { fontSize: 120, percentSize: 28, spacing: 4 },
    md: { fontSize: 64, percentSize: 20, spacing: 3 },
    sm: { fontSize: 40, percentSize: 16, spacing: 2 },
  };
  const s = sizes[size];

  const formatNumber = (v, opts = {}) => {
    if (formatter && !opts.isPercent) return formatter(v);
    const prec =
      typeof opts.precision === "number" ? opts.precision : precision;
    if (opts.isPercent) {
      // percent formatting (just number + %)
      return `${Number(v).toFixed(prec)}%`;
    }
    const cur = opts.currency ?? currency ?? "";
    return `${cur}${new Intl.NumberFormat(undefined, {
      maximumFractionDigits: prec,
      minimumFractionDigits: prec,
    }).format(v)}`;
  };

  const mainText = `${formatNumber(value, { precision })}`; // still use default behavior

  const isPositive = (changePercent ?? 0) > 0;
  const isNegative = (changePercent ?? 0) < 0;

  const changeColor = isPositive
    ? "success.main"
    : isNegative
    ? "error.main"
    : "text.primary";

  return (
    <Card
      elevation={1}
      sx={{
        borderRadius: 1,
        minHeight: 400,
        width: "100%",
        border: "1px solid #c2c0c0ff",
      }}
      data-testid="single-metric-large"
    >
      <CardContent sx={{ pb: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{display:'flex',gap:'5px', alignItems:'center'}}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            <Tooltip title="Info">
              <InfoOutlinedIcon
                sx={{ fontSize: 18, color: "text.secondary" }}
              />
            </Tooltip>
          </Box>

          {showControls && (
            <Stack direction="row" spacing={1} alignItems="center">
              {showExploreButton && (
                <Box onClick={handleExplore}>
                  <Tooltip title="Explore">
                    <IconButton size="small">
                      <Typography variant="body2">Explore</Typography>
                    </IconButton>
                  </Tooltip>
                  <IconButton size="small">
                    <SearchIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
              <Box>
                <IconButton onClick={handleMenuOpen}>
                  <MenuIcon fontSize="small" />
                </IconButton>

                <ControlMenuModal
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  onAction={handleMenuAction}
                  contentId="print-section"
                  showOnlyIcon={true}
                />
              </Box>
            </Stack>
          )}
        </Box>

        <Stack my={10} alignItems="center">
          {/* optional small tag above main value */}
          {mainTag && (
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "inline-block",
                  px: 1.2,
                  py: 0.6,
                  bgcolor: "grey.800",
                  color: "common.white",
                  borderRadius: 0.5,
                  boxShadow: 3,
                  fontSize: 12,
                }}
              >
                {mainTag}
              </Box>
            </Box>
          )}

          {extraRows?.length < 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: s.spacing,
              }}
            >
              <Typography
                component="div"
                sx={{
                  fontSize: 50,
                  lineHeight: 1,
                  fontWeight: 500,
                  color: color,
                  letterSpacing: 2,
                  textAlign: "center",
                }}
              >
                {mainText}
              </Typography>
            </Box>
          )}

          {/* Extra rows area: two-column stacked rows centered (left: label+sublabel, right: value) */}
          {extraRows && extraRows.length > 0 && (
            <Box
              sx={{
                mt: 1,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <Box
                sx={{
                  // fix width to keep left and right columns tidy; adjust as needed
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  alignItems: "center",
                  justifyContent: "center",
                  rowGap: 2,
                }}
              >
                {extraRows.map((r, idx) => {
                  const isPercent = !!r.isPercent;
                  const val = r.value;
                  const rowColor =
                    r.color ??
                    (isPercent
                      ? val > 0
                        ? "success.main"
                        : val < 0
                        ? "error.main"
                        : "text.primary"
                      : "text.primary");
                  return (
                    <React.Fragment key={idx}>
                      {/* Left column: label + optional sublabel */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          pr: 2,
                        }}
                      >
                        <Typography sx={{ fontWeight: 700 }}>
                          {r.label}
                        </Typography>
                        {r.sublabel && (
                          <Typography variant="body2" color="text.secondary">
                            {r.sublabel}
                          </Typography>
                        )}
                      </Box>

                      {/* Right column: formatted value */}
                      <Box
                        sx={{ display: "flex", alignItems: "center", pl: 2 }}
                      >
                        {/* If percent and you want a big display */}
                        {isPercent ? (
                          <Typography
                            sx={{
                              fontSize: 48,
                              fontWeight: 700,
                              color: rowColor,
                              ml: 1,
                              letterSpacing: 1,
                            }}
                          >
                            {`${val > 0 ? "" : val < 0 ? "-" : ""}${Math.abs(
                              Number(val)
                            ).toFixed(
                              typeof r.precision === "number" ? r.precision : 1
                            )}%`}
                          </Typography>
                        ) : (
                          <Typography
                            sx={{
                              fontSize: 40,
                              fontWeight: 700,
                              color: rowColor,
                              ml: 1,
                            }}
                          >
                            {formatNumber(val, {
                              precision:
                                typeof r.precision === "number"
                                  ? r.precision
                                  : 2,
                              currency: r.currency ?? currency,
                            })}
                          </Typography>
                        )}
                      </Box>
                    </React.Fragment>
                  );
                })}
              </Box>
            </Box>
          )}

          {/* change row (existing YoY) */}
          {extraRows?.length < 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 2,
                alignItems: "center",
              }}
            >
              <Typography variant="h6" sx={{ mr: 1 }}>
                YoY:
              </Typography>

              {changePercent === null ? (
                <Typography variant="body1" color="text.secondary">
                  —
                </Typography>
              ) : (
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Typography
                    sx={{
                      color: changeColor,
                      fontWeight: 600,
                      fontSize: 20,
                    }}
                  >{`${isPositive ? "" : "-"} ${Math.abs(
                    Number(changePercent).toFixed(precision)
                  )}%`}</Typography>

                  {/* Arrow */}
                  {isPositive ? (
                    <ArrowDropUp sx={{ color: changeColor }} />
                  ) : isNegative ? (
                    <ArrowDropDown sx={{ color: changeColor }} />
                  ) : (
                    <Box sx={{ width: 24 }} />
                  )}

                  {previousValue !== null && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      ({formatNumber(previousValue)})
                    </Typography>
                  )}
                </Stack>
              )}
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
