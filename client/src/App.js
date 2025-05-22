import { BrowserRouter, Routes, Route } from "react-router-dom";
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
  SustainabilityBacklog,
  KnowledgeSharing,
} from "scenes";
import AuthScreen from "scenes/auth";
import { useEffect } from "react";
import axios from "axios";
import { $user, setUser } from "store/user";
import { setSustainabilityBacklog } from "store/selector";
import { useStore } from "@nanostores/react";
import secureLocalStorage from "react-secure-storage";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const user = useStore($user); // {id: null, name: null} > { id: 1, name: "John Doe" }

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

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/carbon-footprint" element={<CarbonFootprint />} />
              <Route path="/energy-efficiency" element={<EnergyEfficiency />} />
              <Route
                path="/water-conservation"
                element={<WaterConservation />}
              />
              <Route path="/waste-management" element={<WasteManagement />} />
              <Route path="/daily-impact" element={<DailyImpact />} />
              <Route path="/monthly-report" element={<MonthlyReport />} />
              <Route
                path="/sustainability-backlog"
                element={<SustainabilityBacklog />}
              />
              <Route path="/knowledge-sharing" element={<KnowledgeSharing />} />
            </Route>
            <Route path="/" element={<AuthScreen />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
