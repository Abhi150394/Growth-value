import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { LanguageProvider } from "./API/LanguageContext";
import { FilterProvider } from "./Contexts/FilterContext";
import { ModuleRegistry } from "ag-grid-community";
import { AllCommunityModule } from "ag-grid-community";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Register all community modules
ModuleRegistry.registerModules([AllCommunityModule]);

// import { LanguageProvider } from "./context/LanguageContext";
const theme = createTheme();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={theme}>
    <FilterProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </FilterProvider>
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
