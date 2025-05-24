import React from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { StatBox } from "components";
import {
    Nature,
    LocalFlorist,
    AssignmentTurnedIn,
    ElectricBolt,
} from "@mui/icons-material";

const StatsRow = ({ totalStoryPoints }) => {
    const theme = useTheme();
    const isNonMediumScreen = useMediaQuery("(min-width: 1200px)");

    return (
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
            <StatBox
                title="Total Story Points"
                value={totalStoryPoints}
                increase=""
                description="In sustainability backlog"
                icon={
                    <AssignmentTurnedIn
                        sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
                    />
                }
            />
            <StatBox
                title="Carbon Reduction"
                value={`${totalStoryPoints * 2} kg`}
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
                value={`${totalStoryPoints * 5} trees`}
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
                value={`${totalStoryPoints * 3} kWh`}
                increase="+25%"
                description="Since last month"
                icon={
                    <ElectricBolt
                        sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
                    />
                }
            />
        </Box>
    );
};

export default StatsRow; 