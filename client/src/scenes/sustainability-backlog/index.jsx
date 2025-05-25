<<<<<<< HEAD
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import ProjectListPage from './ProjectListPage';
import ProjectSelectionPage from './ProjectSelectionPage';
import SustainabilityBacklog from './SustainabilityBacklog';

function SustainabilityBacklogIndex() {
  const { projectKey } = useParams();

  if (projectKey) {
    return <SustainabilityBacklog projectKey={projectKey} />;
  } else if (window.location.pathname === '/sustainability-backlog/create-new') {
    return <ProjectSelectionPage />;
  } else {
    return <ProjectListPage />;
  }
}

export default SustainabilityBacklogIndex;
=======
import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { Edit as EditIcon, Login as LoginIcon } from '@mui/icons-material';
import SustainabilityAppBar from '../../components/sustainabilityBacklog/SustainabilityAppBar';
import ProjectSelector from '../../components/sustainabilityBacklog/ProjectSelector';
import BacklogList from '../../components/sustainabilityBacklog/BacklogList';
import SustainabilityList from '../../components/sustainabilityBacklog/SustainabilityList';
import ImportDialog from '../../components/sustainabilityBacklog/ImportDialog';
import useAuth from '../../hooks/useAuth';
import useBacklog from '../../hooks/useBacklog';
import {$sustainabilityBacklog, $currentProjectId, addSustainabilityBacklog, addTaskToSustainabilityBacklog, setCurrentProjectId} from '../../store/selector';

import { useStore } from '@nanostores/react';


function SustainabilityBacklog() {
  const { authenticated, loading, apiError, handleLogin, handleLogout } = useAuth();
  const [selectedProject, setSelectedProject] = useState(null);
  const { projects, backlog, setBacklog, error, setError } = useBacklog(authenticated, selectedProject);
  const [sustainabilityBacklog, setSustainabilityBacklog] = useState(() => {
    const saved = localStorage.getItem('sustainabilityBacklog');
    return saved ? JSON.parse(saved) : [];
  });
  const [isEditing, setIsEditing] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropTargetIndex, setDropTargetIndex] = useState(null);
  const [dropTargetList, setDropTargetList] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('details');
  const [importMode, setImportMode] = useState('backlog');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [manualIssue, setManualIssue] = useState({
    summary: '',
    description: '',
    priority: 'Medium',
    storyPoints: '',
  });
  const backlogStore = useStore($sustainabilityBacklog);
  const currentProjectId = useStore($currentProjectId);

  useEffect(() => {
    if (selectedProject) {
      setCurrentProjectId(selectedProject.id);
      const project = {...selectedProject, tasks: []};
      addSustainabilityBacklog({ ...backlogStore, ...project });
    }
  }, [selectedProject]);

  useEffect(() => {
    localStorage.setItem('sustainabilityBacklog', JSON.stringify(sustainabilityBacklog));
  }, [sustainabilityBacklog]);

  const handleDragStart = (e, item, sourceList) => {
    if (!isEditing) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', JSON.stringify({ item, sourceList }));
    setDraggedItem(item);
  };

  const handleDragEnter = (e, index, list) => {
    if (!isEditing) return;
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const dropIndex = e.clientY < rect.top + rect.height / 2 ? index : index + 1;
    setDropTargetIndex(dropIndex);
    setDropTargetList(list);
  };

  const handleDragLeave = (e) => {
    if (!isEditing) return;
    e.preventDefault();
    setDropTargetIndex(null);
    setDropTargetList(null);
  };

  const handleDragOver = (e) => {
    if (!isEditing) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetList) => {
    if (!isEditing) return;
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const { item, sourceList } = data;
      addTaskToSustainabilityBacklog(item, selectedProject.id);
      const dropIndex = dropTargetIndex !== null ? dropTargetIndex : targetList === 'backlog' ? backlog.length : sustainabilityBacklog.length;

      if (sourceList === targetList) {
        const list = sourceList === 'backlog' ? backlog : sustainabilityBacklog;
        const newList = [...list];
        const currentIndex = newList.findIndex(i => i.id === item.id);
        newList.splice(currentIndex, 1);
        newList.splice(dropIndex, 0, item);
        sourceList === 'backlog' ? setBacklog(newList) : setSustainabilityBacklog(newList);
      } else {
        if (sourceList === 'backlog' && targetList === 'sustainability') {
          setBacklog(backlog.filter(i => i.id !== item.id));
          setSustainabilityBacklog([...sustainabilityBacklog.slice(0, dropIndex), item, ...sustainabilityBacklog.slice(dropIndex)]);
        } else if (sourceList === 'sustainability' && targetList === 'backlog') {
          setSustainabilityBacklog(sustainabilityBacklog.filter(i => i.id !== item.id));
          setBacklog([...backlog.slice(0, dropIndex), item, ...backlog.slice(dropIndex)]);
        }
      }
    } catch (err) {
      console.error('Error handling drop:', err);
    }
    setDraggedItem(null);
    setDropTargetIndex(null);
    setDropTargetList(null);
  };

  const handleViewDetails = (issue) => {
    setSelectedIssue(issue);
    setDialogMode('details');
    setOpenDialog(true);
  };

  const handleAddToSustainability = (issue) => {
    if (!sustainabilityBacklog.some(item => item.id === issue.id)) {
      setSustainabilityBacklog([...sustainabilityBacklog, issue]);
    }
  };

  const handleRemoveFromSustainability = (issue) => {
    setSustainabilityBacklog(sustainabilityBacklog.filter(i => i.id !== issue.id));
  };

  const handleManualImport = () => {
    if (!manualIssue.summary) return;
    const fields = {
      summary: String(manualIssue.summary),
      description: String(manualIssue.description || ''),
      priority: { name: String(manualIssue.priority) },
      customfield_10016: manualIssue.storyPoints ? parseInt(manualIssue.storyPoints) : null,
      updated: new Date().toISOString(),
    };
    const newIssue = {
      id: `manual-${Date.now()}`,
      key: `MAN-${Date.now()}`,
      fields,
    };
    setBacklog([...backlog, newIssue]);
    setManualIssue({ summary: '', description: '', priority: 'Medium', storyPoints: '' });
  };

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        let issues = [];
        if (file.name.endsWith('.json')) {
          const parsedContent = JSON.parse(content);
          issues = (Array.isArray(parsedContent) ? parsedContent : [parsedContent]).map(item => ({
            id: `imported-${Date.now()}-${item.id || Math.random()}`,
            key: String(item.key || `IMPORT-${Date.now()}`),
            fields: {
              summary: String(item.summary || ''),
              description: String(item.description || ''),
              priority: { name: String(item.priority || 'Medium') },
              customfield_10016: item.storyPoints ? parseInt(item.storyPoints) : null,
              updated: new Date().toISOString(),
            },
          }));
        } else if (file.name.endsWith('.csv')) {
          const lines = content.split('\n');
          issues = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim());
            return {
              id: `imported-${Date.now()}-${values[0] || Math.random()}`,
              key: String(values[0] || `IMPORT-${Date.now()}`),
              fields: {
                summary: String(values[1] || ''),
                description: String(values[2] || ''),
                priority: { name: String(values[3] || 'Medium') },
                customfield_10016: values[4] ? parseInt(values[4]) : null,
                updated: new Date().toISOString(),
              },
            };
          });
        }
        if (issues.length > 0) {
          setBacklog([...backlog, ...issues]);
          setError(null);
        } else {
          setError('No valid issues found in the file.');
        }
      } catch (err) {
        setError('Error parsing file: ' + err.message);
      }
    };
    if (file.name.endsWith('.json') || file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      setError('Unsupported file format. Please use JSON or CSV.');
    }
  };

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
          Please log in to view the sustainability backlog
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          startIcon={<LoginIcon />}
        >
          Login
        </Button>
      </Box>
    );
  }



  return (
    <Box sx={{ flexGrow: 1 }}>
      {JSON.stringify(backlogStore)}
      <hr />
      {
        JSON.stringify(currentProjectId)
      }
      <SustainabilityAppBar authenticated={authenticated} handleLogout={handleLogout} handleLogin={handleLogin} />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Elisa Sustainability Initiatives
          </Typography>
          {isEditing ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsEditing(false)}
              sx={{ minWidth: '120px' }}
            >
              Save Changes
            </Button>
          ) : (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(true)}
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
              handleDrop={handleDrop}
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
              handleDrop={handleDrop}
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
          handleFileImport={handleFileImport}
          manualIssue={manualIssue}
          setManualIssue={setManualIssue}
          handleManualImport={handleManualImport}
          selectedIssue={selectedIssue}
        />
      </Container>
    </Box>
  );
}

export default SustainabilityBacklog;
>>>>>>> origin/Melissa
