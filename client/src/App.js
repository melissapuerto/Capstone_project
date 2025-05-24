import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import {
  Dashboard,
  Layout,
  CarbonFootprint,
  EnergyEfficiency,
  WaterConservation,
  WasteManagement,
  DailyImpact,
  MonthlyReport,
  SustainabilityBacklogIndex, // Import the index as the main component
  KnowledgeSharing,
  Accessibility,
  AuthScreen,
} from "scenes";
import { useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import {setUser} from "store/user";
import ProtectedRoute from "ProtectedRoutes";


function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);


  useEffect(() => {
    const session = secureLocalStorage.getItem("session");
    if(session){
      setUser(session);
    }
  }, []);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/carbon-footprint" element={
                <ProtectedRoute>
                  <CarbonFootprint />
                </ProtectedRoute>
              } />
              <Route path="/energy-efficiency" element={
                <ProtectedRoute>
                  <EnergyEfficiency />
                </ProtectedRoute>
              } />
              <Route path="/water-conservation" element={
                <ProtectedRoute>
                  <WaterConservation />
                </ProtectedRoute>
              } />
              <Route path="/waste-management" element={
                <ProtectedRoute>
                  <WasteManagement />
                </ProtectedRoute>
              } />
              <Route path="/daily-impact" element={
                <ProtectedRoute>
                  <DailyImpact />
                </ProtectedRoute>
              } />
              <Route path="/monthly-report" element={
                <ProtectedRoute>
                  <MonthlyReport />
                </ProtectedRoute>
              } />
              <Route path="/knowledge-sharing" element={
                <ProtectedRoute>
                  <KnowledgeSharing />
                </ProtectedRoute>
              } />
              <Route path="/accessibility" element={
                <ProtectedRoute>
                  <Accessibility />
                </ProtectedRoute>
              } />
              <Route path="/sustainability-backlog" element={
                <ProtectedRoute>
                  <SustainabilityBacklogIndex />
                </ProtectedRoute>
              } />
              <Route path="/sustainability-backlog/create-new" element={
                <ProtectedRoute>
                  <SustainabilityBacklogIndex />
                </ProtectedRoute>
              } />
              <Route path="/sustainability-backlog/:projectKey" element={
                <ProtectedRoute>
                  <SustainabilityBacklogIndex />
                </ProtectedRoute>
              } />
            </Route>
            <Route path="/" element={<AuthScreen />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;