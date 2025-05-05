import React, { useState } from "react";
import {
  DownloadOutlined,
  Nature,
  TrendingUp,
  Assessment,
  LocalFlorist,
  WaterDrop,
  Code,
  ElectricBolt,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  LinearProgress,
  Card,
  CardContent,
  Grid,
  Slider,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FlexBetween, Header, StatBox } from "components";

// Hardcoded data for sustainability metrics
const sustainabilityData = {
  carbonReduction: "2.5 tons",
  treesSaved: 150,
  energySaved: "45,000 kWh",
  waterConserved: "120,000 L",
  greenCodeImpact: "85%",
  projects: [
    {
      _id: 1,
      projectName: "Green Code Optimization",
      createdAt: "2024-03-01",
      impactScore: "High",
      status: "Active",
    },
    {
      _id: 2,
      projectName: "Energy-Efficient Algorithms",
      createdAt: "2024-03-15",
      impactScore: "Medium",
      status: "Completed",
    },
    {
      _id: 3,
      projectName: "Sustainable Data Centers",
      createdAt: "2024-04-01",
      impactScore: "High",
      status: "In Progress",
    },
  ],
};

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreen = useMediaQuery("(min-width: 1200px)");
  const [treesValue, setTreesValue] = useState(150);
  const [energyValue, setEnergyValue] = useState(45);

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
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: 
              params.value === "High" ? theme.palette.success.main :
              params.value === "Medium" ? theme.palette.warning.main :
              theme.palette.error.main,
            padding: "4px 8px",
            borderRadius: "4px",
            color: "white",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: 
              params.value === "Active" ? theme.palette.success.main :
              params.value === "Completed" ? theme.palette.info.main :
              theme.palette.warning.main,
            padding: "4px 8px",
            borderRadius: "4px",
            color: "white",
          }}
        >
          {params.value}
        </Box>
      ),
    },
  ];

  const handleDownload = () => {
    const report = {
      title: "Sustainability Report",
      date: new Date().toLocaleDateString(),
      metrics: sustainabilityData,
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sustainability-report.json';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header 
          title="SUSTAINABILITY DASHBOARD" 
          subtitle="Track Your Green Impact" 
        />
        <Button
          onClick={handleDownload}
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
          Download Report
        </Button>
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
          title="Carbon Reduction"
          value={sustainabilityData.carbonReduction}
          increase="+21%"
          description="Since last month"
          icon={
            <Nature
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        <StatBox
          title="Trees Saved"
          value={sustainabilityData.treesSaved}
          increase="+15%"
          description="Equivalent trees saved"
          icon={
            <LocalFlorist
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        <StatBox
          title="Energy Saved"
          value={sustainabilityData.energySaved}
          increase="+25%"
          description="Since last month"
          icon={
            <ElectricBolt
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        <StatBox
          title="Water Conserved"
          value={sustainabilityData.waterConserved}
          increase="+18%"
          description="Since last month"
          icon={
            <WaterDrop
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100], mb: "1rem" }}>
            Green Coding Impact
          </Typography>
          <Box sx={{ width: '100%', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Code Optimization Level
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={85} 
              sx={{ 
                height: 10, 
                borderRadius: 5,
                backgroundColor: theme.palette.background.default,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: theme.palette.success.main,
                },
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              85% - Excellent
            </Typography>
          </Box>
          <Box sx={{ width: '100%' }}>
            <Typography variant="body2" color="text.secondary">
              Energy Efficiency
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={75} 
              sx={{ 
                height: 10, 
                borderRadius: 5,
                backgroundColor: theme.palette.background.default,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: theme.palette.info.main,
                },
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              75% - Good
            </Typography>
          </Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100], mb: "1rem" }}>
            Interactive Impact
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Trees Saved: {treesValue}
            </Typography>
            <Slider
              value={treesValue}
              onChange={(e, newValue) => setTreesValue(newValue)}
              min={0}
              max={300}
              sx={{
                color: theme.palette.success.main,
              }}
            />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Energy Saved (kWh): {energyValue * 1000}
            </Typography>
            <Slider
              value={energyValue}
              onChange={(e, newValue) => setEnergyValue(newValue)}
              min={0}
              max={100}
              sx={{
                color: theme.palette.info.main,
              }}
            />
          </Box>
        </Box>

        {/* ROW 3 */}
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
            rows={sustainabilityData.projects}
            columns={columns}
            getRowId={(row) => row._id}
            autoHeight
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
