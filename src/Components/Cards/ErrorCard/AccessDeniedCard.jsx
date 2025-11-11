import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

export default function AccessDeniedCard({
  title = "Oops! You do not have access to this card",
  lines = [
    "You do not have permission to access this card",
    "or",
    "your business does not have a connected integration that supports this data type",
  ],
  footnote = "Required permissions: see budget data",
  width = 640,
  height = 420,
}) {
  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: width,
        height: { xs: "auto", sm: height },
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "#fff",
      }}
    >
      <CardContent
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 4, sm: 6 },
        }}
      >
        <Box textAlign="center" maxWidth={520}>
          {/* “little character” badge */}
          <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: "#FF974D", // orange circle
                width: 72,
                height: 72,
                boxShadow: 1,
              }}
            >
              {/* empty circle face look */}
            </Avatar>
            <Box
              sx={{
                position: "absolute",
                right: -8,
                bottom: -6,
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#fff",
                boxShadow: 1,
                display: "grid",
                placeItems: "center",
              }}
            >
              <WarningAmberRoundedIcon
                sx={{ fontSize: 22, color: "#F97316" }}
              />
            </Box>
          </Box>

          {/* Title */}
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}
          >
            {title}
          </Typography>

          {/* Body lines */}
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
          >
            {lines.map((l, i) => (
              <React.Fragment key={i}>
                {l}
                {i !== lines.length - 1 && (
                  <>
                    <br />
                  </>
                )}
              </React.Fragment>
            ))}
          </Typography>

          {/* Footnote */}
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontWeight: 600 }}
          >
            {footnote}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
