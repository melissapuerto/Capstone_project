<<<<<<< HEAD
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { useMemo } from "react";
=======
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useMemo, useEffect } from "react";
>>>>>>> origin/Melissa
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
<<<<<<< HEAD
  SustainabilityBacklogIndex, // Import the index as the main component
  KnowledgeSharing,
  Accessibility,
  AuthScreen,
} from "scenes";
import { useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import { setUser, $user } from "store/user";
import { setStoryPoints } from "store/storyPoints";
import { useStore } from "@nanostores/react";
import ProtectedRoute from "ProtectedRoutes";
import axios from "axios";

=======
  SustainabilityBacklog,
  KnowledgeSharing,
  Accessibility
} from "scenes";
import AuthScreen from "scenes/auth";
import axios from "axios";
import { $user, setUser } from "store/user";
import { setSustainabilityBacklog } from "store/selector";
import { useStore } from "@nanostores/react";
import secureLocalStorage from "react-secure-storage";
>>>>>>> origin/Melissa

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const user = useStore($user);

<<<<<<< HEAD

  useEffect(() => {
    const session = secureLocalStorage.getItem("session");
    if (session) {
      setUser(session);
    }
  }, []);

  useEffect(() => {
    if (user.id) {
      const getStoryPoints = async () => {
        await axios
          .get(
            `${
              process.env.REACT_APP_BACKEND_URL || "http://localhost:3001"
            }/api/backlog/getAllProjects?uid=${user.id}`,
            { withCredentials: true }
          )
          .then((response) => {
            setStoryPoints({
              projects: response.data.projects,
              storyPoints: response.data.totalStoryPoints,
            });
          })
          .catch((error) => {
            console.error("Error fetching story points:", error);
          });
      };
      getStoryPoints();
    }
  }, [user]);

=======
  useEffect(() => {
    setUser(secureLocalStorage.getItem("user"));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { id } = user;
      if (!id) {
        console.log("No user id found");
        return;
      }

      await axios
        .get(`http://localhost:3002/api/backlog/backlog?uid=${id}`)
        .then((response) => {
          //setSustainabilityBacklog(response.data.data);
          console.log("Sustainability backlog data: ", response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        });
    };

    fetchData();
  }, [user]);
>>>>>>> origin/Melissa

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
<<<<<<< HEAD
            <Route element={<Layout />}>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/carbon-footprint"
                element={
                  <ProtectedRoute>
                    <CarbonFootprint />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/energy-efficiency"
                element={
                  <ProtectedRoute>
                    <EnergyEfficiency />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/water-conservation"
                element={
                  <ProtectedRoute>
                    <WaterConservation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/waste-management"
                element={
                  <ProtectedRoute>
                    <WasteManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/daily-impact"
                element={
                  <ProtectedRoute>
                    <DailyImpact />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/monthly-report"
                element={
                  <ProtectedRoute>
                    <MonthlyReport />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/knowledge-sharing"
                element={
                  <ProtectedRoute>
                    <KnowledgeSharing />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/accessibility"
                element={
                  <ProtectedRoute>
                    <Accessibility />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sustainability-backlog"
                element={
                  <ProtectedRoute>
                    <SustainabilityBacklogIndex />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sustainability-backlog/create-new"
                element={
                  <ProtectedRoute>
                    <SustainabilityBacklogIndex />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sustainability-backlog/:projectKey"
                element={
                  <ProtectedRoute>
                    <SustainabilityBacklogIndex />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="/" element={<AuthScreen />} />
=======
            <Route path="/auth" element={<AuthScreen />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/carbon-footprint" element={<CarbonFootprint />} />
              <Route path="/energy-efficiency" element={<EnergyEfficiency />} />
              <Route path="/water-conservation" element={<WaterConservation />} />
              <Route path="/waste-management" element={<WasteManagement />} />
              <Route path="/daily-impact" element={<DailyImpact />} />
              <Route path="/monthly-report" element={<MonthlyReport />} />
              <Route path="/sustainability-backlog" element={<SustainabilityBacklog />} />
              <Route path="/knowledge-sharing" element={<KnowledgeSharing />} />
              <Route path="/accessibility" element={<Accessibility />} />
            </Route>
>>>>>>> origin/Melissa
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
