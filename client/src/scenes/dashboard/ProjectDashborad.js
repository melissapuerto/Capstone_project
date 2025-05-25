import React, { useState, useMemo } from "react";
import { DownloadOutlined } from "@mui/icons-material";
import {
    Box,
    Button,
    Typography,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { FlexBetween, Header } from "components";
import StatsRow from "components/Dashboard/StatsRow";
import MonthlyImpactChart from "components/Dashboard/MonthlyImpactChart";
import ImpactDistributionChart from "components/Dashboard/ImpactDistributionChart";
import ResourceUsageChart from "components/Dashboard/ResourceUsageChart";
import ProjectsTable from "components/Dashboard/ProjectsTable";
import {
    sustainabilityData,
    monthlyImpactData,
    impactDistributionData,
    resourceUsageData,
} from "components/Dashboard/DefaultDashboardData";
import useAuth from "../../hooks/useAuth";
import useBacklog from "../../hooks/useBacklog";


const ProjectDashborad = ({ projectKey }) => {
    const theme = useTheme();
    const isNonMediumScreen = useMediaQuery("(min-width: 1200px)");

    const { authenticated, loading } = useAuth();
    const { loading: backlogLoading, selectedProject } = useBacklog(authenticated, projectKey);

    // Calculate total story points using useMemo
    const totalStoryPoints = useMemo(() => {
        if (!selectedProject?.sustainabilityBacklog) return 0;
        return selectedProject.sustainabilityBacklog.reduce((total, item) => {
            const storyPoints = item.fields.customfield_10016 || 0; // Treat null as 0
            return total + storyPoints;
        }, 0);
    }, [selectedProject]);



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

    if (loading || backlogLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    return (
        <Box m="1.5rem 2.5rem">
            <FlexBetween>
                <Header
                    title={`${selectedProject?.projectName} ( ${selectedProject?.jiraProject.name})`}
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

            <StatsRow totalStoryPoints={totalStoryPoints} />

            <Box
                mt="20px"
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gap="20px"
            >
                <MonthlyImpactChart data={monthlyImpactData} />
                <ImpactDistributionChart data={impactDistributionData} />
                <ResourceUsageChart data={resourceUsageData} />
            </Box>

            <ProjectsTable rows={sustainabilityData.projects} />
        </Box>
    );
};

export default ProjectDashborad;
