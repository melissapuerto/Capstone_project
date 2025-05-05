import React from "react";
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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

import { useGetDashboardQuery } from "state/api";
import {
  FlexBetween,
  Header,
  BreakdownChart,
  OverviewChart,
  StatBox,
} from "components";

const Dashboard = () => {
  // theme
  const theme = useTheme();
  // is large desktop screen
  const isNonMediumScreen = useMediaQuery("(min-width: 1200px)");
  // get data
  const { data, isLoading, error } = useGetDashboardQuery();

  // Log data and error states
  React.useEffect(() => {
    console.log('Dashboard Data:', data);
    console.log('Loading State:', isLoading);
    console.log('Error State:', error);
  }, [data, isLoading, error]);

  // Handle download report
  const handleDownloadReport = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/dashboard/download-report', {
        responseType: 'blob'
      });
      
      // Create a blob from the response data
      const blob = new Blob([response.data], { type: 'text/csv' });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sustainability-report.csv');
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  // Show error state if there's an error
  if (error) {
    return (
      <Box m="1.5rem 2.5rem">
        <Typography variant="h4" color="error">
          Error loading dashboard data: {error.message}
        </Typography>
      </Box>
    );
  }

  // data columns
  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "projectName",
      headerName: "Project Name",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
    },
    {
      field: "impactScore",
      headerName: "Impact Score",
      flex: 0.5,
      renderCell: (params) => params.value,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
      renderCell: (params) => params.value,
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        {/* Header */}
        <Header title="SUSTAINABILITY DASHBOARD" subtitle="Welcome to Elisa's Sustainability Dashboard" />

        {/* Content */}
        <Box>
          {/* Download Reports */}
          <Button
            onClick={handleDownloadReport}
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
        {/* Total Projects */}
        <StatBox
          title="Active Projects"
          value={data && data.totalProjects}
          increase="+14%"
          description="Since last month"
          icon={
            <Nature
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        {/* Carbon Reduction */}
        <StatBox
          title="Carbon Reduction"
          value={data && data.carbonReduction}
          increase="+21%"
          description="Since last month"
          icon={
            <LocalFlorist
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        {/* Overview Chart */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <OverviewChart view="impact" isDashboard={true} />
        </Box>

        {/* Monthly Impact */}
        <StatBox
          title="Monthly Impact"
          value={data && data.monthlyImpact}
          increase="+5%"
          description="Since last month"
          icon={
            <Assessment
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        {/* Yearly Impact */}
        <StatBox
          title="Yearly Impact"
          value={data && data.yearlyImpact}
          increase="+43%"
          description="Since last month"
          icon={
            <TrendingUp
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        {/* ROW 2 */}
        {/* Projects */}
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
            loading={isLoading || !data}
            getRowId={(row) => row._id}
            rows={(data && data.projects) || []}
            columns={columns}
          />
        </Box>

        {/* Impact by Category */}
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

          <BreakdownChart isDashboard={true} />
          <Typography
            p="0 0.6rem"
            fontSize="0.8rem"
            sx={{
              color: theme.palette.secondary[200],
            }}
          >
            Breakdown of environmental impact and sustainability initiatives by category
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
