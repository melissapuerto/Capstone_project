import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, useTheme } from '@mui/material';
import { Edit as EditIcon, Login as LoginIcon } from '@mui/icons-material';
import SustainabilityAppBar from '../../components/sustainabilityBacklog/SustainabilityAppBar';
import ProjectSelector from '../../components/sustainabilityBacklog/ProjectSelector';
import BacklogList from '../../components/sustainabilityBacklog/BacklogList';
import SustainabilityList from '../../components/sustainabilityBacklog/SustainabilityList';
import ImportDialog from '../../components/sustainabilityBacklog/ImportDialog';
import useAuth from '../../hooks/useAuth';
import useBacklog from '../../hooks/useBacklog';
import useSustainabilityBacklog from '../../hooks/useSustainabilityBacklog';

function SustainabilityBacklog() {
  const theme = useTheme();
  const { authenticated, loading, apiError, handleLogin, handleLogout } = useAuth();
  const [selectedProject, setSelectedProject] = useState(null);
  const { projects, backlog, setBacklog, error, setError } = useBacklog(authenticated, selectedProject);

  const {
    sustainabilityBacklog,
    setSustainabilityBacklog,
    isEditing,
    setIsEditing,
    draggedItem,
    dropTargetIndex,
    dropTargetList,
    openDialog,
    setOpenDialog,
    dialogMode,
    setDialogMode,
    importMode,
    setImportMode,
    selectedIssue,
    setSelectedIssue,
    manualIssue,
    setManualIssue,
    handleDragStart,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleViewDetails,
    handleAddToSustainability,
    handleRemoveFromSustainability,
    handleManualImport,
    handleFileImport,
  } = useSustainabilityBacklog();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!authenticated || apiError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" flexDirection="column" gap={2}>
        <Typography variant="h5" color="text.secondary">
          Please log into JIRA to view the sustainability backlog
        </Typography>
        <Button
          onClick={handleLogin}
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
          startIcon={<LoginIcon />}
        >
          Login
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <SustainabilityAppBar authenticated={authenticated} handleLogout={handleLogout} handleLogin={handleLogin} />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Elisa Sustainability Initiatives
          </Typography>
          {isEditing ? (
            <Button
              onClick={() => setIsEditing(false)}
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
              Save Changes
            </Button>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
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
              startIcon={<EditIcon />}
            >
              Manage Initiatives
            </Button>
          )}
        </Box>
        {error && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
            <Typography variant="body1" gutterBottom>
              {error}
            </Typography>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => setError(null)}
            >
              Dismiss
            </Button>
          </Box>
        )}
        <ProjectSelector projects={projects} selectedProject={selectedProject} setSelectedProject={setSelectedProject} />
        {!selectedProject ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Please select a project to view its sustainability initiatives
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 3 }}>
            <BacklogList
              backlog={backlog}
              isEditing={isEditing}
              draggedItem={draggedItem}
              dropTargetIndex={dropTargetIndex}
              dropTargetList={dropTargetList}
              handleDragStart={handleDragStart}
              handleDragEnter={handleDragEnter}
              handleDragLeave={handleDragLeave}
              handleDragOver={handleDragOver}
              handleDrop={(e) => handleDrop(e, 'backlog', backlog, setBacklog)}
              handleViewDetails={handleViewDetails}
            />
            <SustainabilityList
              sustainabilityBacklog={sustainabilityBacklog}
              isEditing={isEditing}
              draggedItem={draggedItem}
              dropTargetIndex={dropTargetIndex}
              dropTargetList={dropTargetList}
              handleDragStart={handleDragStart}
              handleDragEnter={handleDragEnter}
              handleDragLeave={handleDragLeave}
              handleDragOver={handleDragOver}
              handleDrop={(e) => handleDrop(e, 'sustainability', backlog, setBacklog)}
              handleViewDetails={handleViewDetails}
              handleRemove={handleRemoveFromSustainability}
              openImportDialog={() => {
                setDialogMode('import');
                setOpenDialog(true);
              }}
            />
          </Box>
        )}
        <ImportDialog
          open={openDialog}
          onClose={() => {
            setOpenDialog(false);
            setDialogMode('details');
            setSelectedIssue(null);
          }}
          dialogMode={dialogMode}
          setDialogMode={setDialogMode}
          importMode={importMode}
          setImportMode={setImportMode}
          backlog={backlog}
          sustainabilityBacklog={sustainabilityBacklog}
          handleAddToSustainability={handleAddToSustainability}
          handleFileImport={(e) => handleFileImport(e, backlog, setBacklog, setError)}
          manualIssue={manualIssue}
          setManualIssue={setManualIssue}
          handleManualImport={() => handleManualImport(backlog, setBacklog)}
          selectedIssue={selectedIssue}
        />
      </Container>
    </Box>
  );
}

export default SustainabilityBacklog;