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
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import axios from "axios";

import {
  FlexBetween,
  Header,
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

  // Prepare data for the line chart
  const lineChartData = [
    {
      id: "Story Points",
      color: theme.palette.secondary.main,
      data: data.monthlyTrends.labels.map((label, index) => ({
        x: label,
        y: data.monthlyTrends.storyPoints[index],
      })),
    },
    {
      id: "Energy Savings",
      color: theme.palette.secondary[600],
      data: data.monthlyTrends.labels.map((label, index) => ({
        x: label,
        y: data.monthlyTrends.energySavings[index],
      })),
    },
  ];

  // Prepare data for the pie chart
  const pieChartData = Object.entries(data.impactByCategory).map(([category, value]) => ({
    id: category,
    label: category,
    value: value,
    color: theme.palette.secondary[Math.floor(Math.random() * 5) * 100],
  }));

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

        {/* ROW 2 - Line Chart */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Monthly Trends
          </Typography>
          <Box height="300px">
            <ResponsiveLine
              data={lineChartData}
              theme={{
                axis: {
                  domain: {
                    line: {
                      stroke: theme.palette.secondary[200],
                    },
                  },
                  legend: {
                    text: {
                      fill: theme.palette.secondary[200],
                    },
                  },
                  ticks: {
                    line: {
                      stroke: theme.palette.secondary[200],
                      strokeWidth: 1,
                    },
                    text: {
                      fill: theme.palette.secondary[200],
                    },
                  },
                },
                legends: {
                  text: {
                    fill: theme.palette.secondary[200],
                  },
                },
                tooltip: {
                  container: {
                    color: theme.palette.primary.main,
                  },
                },
              }}
              margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
              xScale={{ type: "point" }}
              yScale={{
                type: "linear",
                min: "auto",
                max: "auto",
                stacked: false,
                reverse: false,
              }}
              yFormat=" >-.2f"
              curve="catmullRom"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                orient: "bottom",
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Month",
                legendOffset: 36,
                legendPosition: "middle",
              }}
              axisLeft={{
                orient: "left",
                tickValues: 5,
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Value",
                legendOffset: -40,
                legendPosition: "middle",
              }}
              enableGridX={false}
              enableGridY={false}
              pointSize={10}
              pointColor={{ theme: "background" }}
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              pointLabelYOffset={-12}
              useMesh={true}
              legends={[
                {
                  anchor: "bottom-right",
                  direction: "column",
                  justify: false,
                  translateX: 100,
                  translateY: 0,
                  itemsSpacing: 0,
                  itemDirection: "left-to-right",
                  itemWidth: 80,
                  itemHeight: 20,
                  itemOpacity: 0.75,
                  symbolSize: 12,
                  symbolShape: "circle",
                  symbolBorderColor: "rgba(0, 0, 0, .5)",
                  effects: [
                    {
                      on: "hover",
                      style: {
                        itemBackground: "rgba(0, 0, 0, .03)",
                        itemOpacity: 1,
                      },
                    },
                  ],
                },
              ]}
            />
          </Box>
        </Box>

        {/* ROW 2 - Pie Chart */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Impact by Category
          </Typography>
          <Box height="300px">
            <ResponsivePie
              data={pieChartData}
              theme={{
                axis: {
                  domain: {
                    line: {
                      stroke: theme.palette.secondary[200],
                    },
                  },
                  legend: {
                    text: {
                      fill: theme.palette.secondary[200],
                    },
                  },
                  ticks: {
                    line: {
                      stroke: theme.palette.secondary[200],
                      strokeWidth: 1,
                    },
                    text: {
                      fill: theme.palette.secondary[200],
                    },
                  },
                },
                legends: {
                  text: {
                    fill: theme.palette.secondary[200],
                  },
                },
                tooltip: {
                  container: {
                    color: theme.palette.primary.main,
                  },
                },
              }}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              borderWidth={1}
              borderColor={{
                from: "color",
                modifiers: [["darker", 0.2]],
              }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor={theme.palette.secondary[200]}
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: "color" }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{
                from: "color",
                modifiers: [["darker", 2]],
              }}
              defs={[
                {
                  id: "dots",
                  type: "patternDots",
                  background: "inherit",
                  color: "rgba(255, 255, 255, 0.3)",
                  size: 4,
                  padding: 1,
                  stagger: true,
                },
                {
                  id: "lines",
                  type: "patternLines",
                  background: "inherit",
                  color: "rgba(255, 255, 255, 0.3)",
                  rotation: -45,
                  lineWidth: 6,
                  spacing: 10,
                },
              ]}
              legends={[
                {
                  anchor: "bottom",
                  direction: "row",
                  justify: false,
                  translateX: 0,
                  translateY: 56,
                  itemsSpacing: 0,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: theme.palette.secondary[200],
                  itemDirection: "left-to-right",
                  itemOpacity: 1,
                  symbolSize: 18,
                  symbolShape: "circle",
                  effects: [
                    {
                      on: "hover",
                      style: {
                        itemTextColor: theme.palette.primary[500],
                      },
                    },
                  ],
                },
              ]}
            />
          </Box>
        </Box>

        {/* ROW 3 - Data Grid */}
        <Box
          gridColumn="span 12"
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
      </Box>
    </Box>
  );
};

export default Dashboard;
