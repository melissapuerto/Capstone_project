import React from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DataGridCustomToolbar } from "components";

const ProjectsTable = ({ rows }) => {
    const theme = useTheme();

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

    return (
        <Box
            mt="20px"
            height="400px"
            sx={{
                "& .MuiDataGrid-root": {
                    border: "none",
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
                    backgroundColor: theme.palette.background.light,
                },
                "& .MuiDataGrid-footerContainer": {
                    backgroundColor: theme.palette.background.alt,
                    color: theme.palette.secondary[100],
                    borderTop: "none",
                },
                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                    color: `${theme.palette.secondary[200]} !important`,
                },
            }}
        >
            <DataGrid
                rows={rows}
                columns={columns}
                getRowId={(row) => row._id}
                components={{
                    Toolbar: DataGridCustomToolbar,
                }}
            />
        </Box>
    );
};

export default ProjectsTable; 