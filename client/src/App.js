import React, { useMemo } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Theme
import { themeSettings } from "theme";

// Scenes
import {
  Layout,
  Dashboard,
  Products,
  CarbonFootprint,
  EnergyEfficiency,
  WaterConservation,
  WasteManagement,
  Overview,
  DailyImpact,
  MonthlyReport,
  Breakdown,
  Admin,
  Performance,
} from "scenes";

// App
const App = () => {
  // Dark/Light mode
  const mode = useSelector((state) => state.global.mode);
  // theme setting
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <BrowserRouter>
        {/* Theme Provider */}
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            {/* Routes */}
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/sustainability-backlog" element={<Products />} />
              <Route path="/carbon-footprint" element={<CarbonFootprint />} />
              <Route path="/energy-efficiency" element={<EnergyEfficiency />} />
              <Route path="/water-conservation" element={<WaterConservation />} />
              <Route path="/waste-management" element={<WasteManagement />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/daily-impact" element={<DailyImpact />} />
              <Route path="/monthly-report" element={<MonthlyReport />} />
              <Route path="/breakdown" element={<Breakdown />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/performance" element={<Performance />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
