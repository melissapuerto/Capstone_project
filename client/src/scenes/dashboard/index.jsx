import React, { useState, useEffect } from "react";
import {
  DownloadOutlined,
  Nature,
  TrendingUp,
  Assessment,
  LocalFlorist,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

import {
  FlexBetween,
  Header,
  BreakdownChart,
  OverviewChart,
  StatBox,
} from "components";

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreen = useMediaQuery("(min-width: 1200px)");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL || "http://localhost:3000"}/api/dashboard`
        );
        console.log("Dashboard data received:", response.data);
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Error loading dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleDownloadReport = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL || "http://localhost:3000"}/api/dashboard/download-report`,
        { responseType: 'blob' }
      );
      
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sustainability_report.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h5">
          No data available
        </Typography>
      </Box>
    );
  }

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
    },
    {
      field: "name",
      headerName: "Project Name",
      flex: 1,
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
    },
    {
      field: "storyPoints",
      headerName: "Story Points",
      flex: 0.5,
    },
    {
      field: "impactScore",
      headerName: "Impact Score",
      flex: 0.5,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="SUSTAINABILITY DASHBOARD" subtitle="Welcome to Elisa's Sustainability Dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              "&:hover": {
                backgroundColor: theme.palette.background.alt,
                color: theme.palette.secondary.light,
              },
            }}
            onClick={handleDownloadReport}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            Download Sustainability Reports
          </Button>
        </Box>
      </FlexBetween>

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": {
            gridColumn: isNonMediumScreen ? undefined : "span 12",
          },
        }}
      >
        {/* ROW 1 */}
        <StatBox
          title="Active Projects"
          value={data.activeProjects}
          increase={`${Math.round((data.activeProjects / data.totalProjects) * 100)}%`}
          description="Of total projects"
          icon={
            <Nature
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        <StatBox
          title="Code Optimization"
          value={data.sustainabilityMetrics.codeOptimization.current + "%"}
          increase={`+${data.sustainabilityMetrics.codeOptimization.current - data.sustainabilityMetrics.codeOptimization.previous}%`}
          description="Since last month"
          icon={
            <Assessment
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        <StatBox
          title="Energy Efficiency"
          value={data.sustainabilityMetrics.energyEfficiency.current + "%"}
          increase={`+${data.sustainabilityMetrics.energyEfficiency.current - data.sustainabilityMetrics.energyEfficiency.previous}%`}
          description="Since last month"
          icon={
            <LocalFlorist
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        <StatBox
          title="Resource Utilization"
          value={data.sustainabilityMetrics.resourceUtilization.current + "%"}
          increase={`+${data.sustainabilityMetrics.resourceUtilization.current - data.sustainabilityMetrics.resourceUtilization.previous}%`}
          description="Since last month"
          icon={
            <TrendingUp
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 3"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              borderRadius: "5rem",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: theme.palette.background.alt,
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderTop: "none",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButtom-text": {
              color: `${theme.palette.secondary[200]} !important`,
            },
          }}
        >
          <DataGrid
            loading={isLoading}
            rows={data.projects}
            columns={columns}
          />
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Impact by Category
          </Typography>

          <Box mt="2rem">
            {Object.entries(data.impactByCategory).map(([category, value]) => (
              <Box
                key={category}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb="1rem"
              >
                <Typography color={theme.palette.secondary[100]}>
                  {category}
                </Typography>
                <Typography color={theme.palette.secondary[200]}>
                  {value}%
                </Typography>
              </Box>
            ))}
          </Box>

          <Typography
            p="0 0.6rem"
            fontSize="0.8rem"
            sx={{
              color: theme.palette.secondary[200],
            }}
          >
            Breakdown of sustainability initiatives by category
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
