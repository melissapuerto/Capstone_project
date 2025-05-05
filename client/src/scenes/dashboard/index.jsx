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
  Grid,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveRadar } from "@nivo/radar";
import { ResponsiveHeatMap } from "@nivo/heatmap";
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
  const [selectedMetric, setSelectedMetric] = useState("all");

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

  // Prepare data for the bar chart (Project Status Distribution)
  const barChartData = [
    {
      status: "Completed",
      count: data.projects.filter(p => p.status === "Completed").length,
      color: theme.palette.success.main,
    },
    {
      status: "In Progress",
      count: data.projects.filter(p => p.status === "In Progress").length,
      color: theme.palette.warning.main,
    },
    {
      status: "Planned",
      count: data.projects.filter(p => p.status === "Planned").length,
      color: theme.palette.info.main,
    },
  ];

  // Prepare data for the radar chart (Sustainability Metrics)
  const radarChartData = [
    {
      metric: "Code Optimization",
      current: data.sustainabilityMetrics.codeOptimization.current,
      previous: data.sustainabilityMetrics.codeOptimization.previous,
    },
    {
      metric: "Energy Efficiency",
      current: data.sustainabilityMetrics.energyEfficiency.current,
      previous: data.sustainabilityMetrics.energyEfficiency.previous,
    },
    {
      metric: "Resource Utilization",
      current: data.sustainabilityMetrics.resourceUtilization.current,
      previous: data.sustainabilityMetrics.resourceUtilization.previous,
    },
  ];

  // Prepare data for the heatmap (Daily Impact)
  const heatmapData = [
    {
      day: "Monday",
      "Morning": Math.floor(Math.random() * 100),
      "Afternoon": Math.floor(Math.random() * 100),
      "Evening": Math.floor(Math.random() * 100),
    },
    {
      day: "Tuesday",
      "Morning": Math.floor(Math.random() * 100),
      "Afternoon": Math.floor(Math.random() * 100),
      "Evening": Math.floor(Math.random() * 100),
    },
    {
      day: "Wednesday",
      "Morning": Math.floor(Math.random() * 100),
      "Afternoon": Math.floor(Math.random() * 100),
      "Evening": Math.floor(Math.random() * 100),
    },
    {
      day: "Thursday",
      "Morning": Math.floor(Math.random() * 100),
      "Afternoon": Math.floor(Math.random() * 100),
      "Evening": Math.floor(Math.random() * 100),
    },
    {
      day: "Friday",
      "Morning": Math.floor(Math.random() * 100),
      "Afternoon": Math.floor(Math.random() * 100),
      "Evening": Math.floor(Math.random() * 100),
    },
  ];

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
        {/* ROW 1 - StatBoxes */}
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

        {/* ROW 2 - Line Chart and Pie Chart */}
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

        {/* ROW 3 - Bar Chart and Radar Chart */}
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Project Status Distribution
          </Typography>
          <Box height="300px">
            <ResponsiveBar
              data={barChartData}
              keys={["count"]}
              indexBy="status"
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
              padding={0.3}
              valueScale={{ type: "linear" }}
              colors={{ scheme: "nivo" }}
              borderColor={{
                from: "color",
                modifiers: [["darker", 1.6]],
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Status",
                legendPosition: "middle",
                legendOffset: 32,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Count",
                legendPosition: "middle",
                legendOffset: -40,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{
                from: "color",
                modifiers: [["darker", 1.6]],
              }}
              legends={[
                {
                  dataFrom: "keys",
                  anchor: "bottom-right",
                  direction: "column",
                  justify: false,
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: "left-to-right",
                  itemOpacity: 0.85,
                  symbolSize: 20,
                  effects: [
                    {
                      on: "hover",
                      style: {
                        itemOpacity: 1,
                      },
                    },
                  ],
                },
              ]}
              animate={true}
              motionStiffness={90}
              motionDamping={15}
            />
          </Box>
        </Box>

        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Sustainability Metrics Comparison
          </Typography>
          <Box height="300px">
            <ResponsiveRadar
              data={radarChartData}
              keys={["current", "previous"]}
              indexBy="metric"
              maxValue="auto"
              margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
              borderColor={{ from: "color" }}
              gridLabelOffset={36}
              dotSize={10}
              dotColor={{ theme: "background" }}
              dotBorderWidth={2}
              colors={{ scheme: "nivo" }}
              blendMode="multiply"
              motionConfig="gentle"
              legends={[
                {
                  anchor: "top-left",
                  direction: "column",
                  translateX: -50,
                  translateY: -40,
                  itemWidth: 80,
                  itemHeight: 20,
                  itemTextColor: theme.palette.secondary[200],
                  symbolSize: 12,
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

        {/* ROW 4 - Heatmap */}
        <Box
          gridColumn="span 12"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Daily Impact Heatmap
          </Typography>
          <Box height="300px">
            <ResponsiveHeatMap
              data={heatmapData}
              keys={["Morning", "Afternoon", "Evening"]}
              indexBy="day"
              margin={{ top: 100, right: 60, bottom: 60, left: 60 }}
              forceSquare={true}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Day",
                legendOffset: 36,
                legendPosition: "middle",
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Time of Day",
                legendOffset: -40,
                legendPosition: "middle",
              }}
              colors={{
                type: "sequential",
                scheme: "blues",
              }}
              labelTextColor={{
                from: "color",
                modifiers: [["darker", 2]],
              }}
              animate={true}
              motionConfig="gentle"
              hoverTarget="cell"
              tooltip={({ xKey, yKey, value }) => (
                <Box
                  sx={{
                    background: theme.palette.background.alt,
                    padding: "8px",
                    borderRadius: "4px",
                    border: `1px solid ${theme.palette.secondary[200]}`,
                  }}
                >
                  <Typography variant="body2" color={theme.palette.secondary[100]}>
                    {xKey} - {yKey}: {value}%
                  </Typography>
                </Box>
              )}
            />
          </Box>
        </Box>

        {/* ROW 5 - Data Grid */}
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
