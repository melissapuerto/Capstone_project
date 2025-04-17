import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Container,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
  Paper,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox
} from '@mui/material';
import {
  Nature as NatureIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  AccountCircle as AccountCircleIcon,
  Edit as EditIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme, isDragging }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  cursor: 'grab',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
  ...(isDragging && {
    opacity: 0.5,
    cursor: 'grabbing',
  }),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const DropIndicator = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  height: '2px',
  backgroundColor: theme.palette.primary.main,
  opacity: 0,
  transition: 'opacity 0.2s',
  pointerEvents: 'none',
}));

const DropZone = styled(Box)(({ theme, isDropTarget }) => ({
  position: 'relative',
  minHeight: '20px',
  marginBottom: theme.spacing(2),
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    right: 0,
    height: '2px',
    backgroundColor: theme.palette.primary.main,
    opacity: isDropTarget ? 1 : 0,
    transition: 'opacity 0.2s',
  },
  '&:hover::before': {
    opacity: 0.5,
  },
}));

const SustainabilityAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#2E7D32', // Green color for sustainability theme
  marginBottom: theme.spacing(4),
}));

function Product() {
  const [backlog, setBacklog] = useState([]);
  const [sustainabilityBacklog, setSustainabilityBacklog] = useState([]);
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropTargetIndex, setDropTargetIndex] = useState(null);
  const [dropTargetList, setDropTargetList] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('details');

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:3000"}/auth/check-auth`, { withCredentials: true });
        setAuthenticated(response.data.authenticated);
      } catch (err) {
        console.error('Error checking authentication:', err);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  useEffect(() => {
    if (authenticated) {
      const fetchBacklog = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL || "http://localhost:3000"}/api/backlog`, 
            { withCredentials: true }
          );
          
          if (!response.data || !response.data.issues) {
            throw new Error('Invalid response format from server');
          }

          const issues = response.data.issues;
          setBacklog(issues);
          setError(null);
        } catch (err) {
          console.error('Error fetching backlog:', err.response?.data || err.message);
          setError(err.response?.data?.error || err.response?.data?.details || 'Error fetching backlog');
        }
      };

      fetchBacklog();
    }
  }, [authenticated]);

  const handleLogin = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL || "http://localhost:3000"}/auth/atlassian`;
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:3000"}/auth/logout`, { withCredentials: true });
      setAuthenticated(false);
      setBacklog([]);
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Highest':
        return 'error';
      case 'High':
        return 'warning';
      case 'Medium':
        return 'info';
      case 'Low':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleAccept = () => {
    setIsEditing(false);
  };

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
      const dropIndex = dropTargetIndex !== null ? dropTargetIndex : targetList === 'backlog' ? backlog.length : sustainabilityBacklog.length;

      if (sourceList === targetList) {
        // Reordering within the same list
        const list = sourceList === 'backlog' ? backlog : sustainabilityBacklog;
        const newList = [...list];
        const currentIndex = newList.findIndex(i => i.id === item.id);
        newList.splice(currentIndex, 1);
        newList.splice(dropIndex, 0, item);
        
        if (sourceList === 'backlog') {
          setBacklog(newList);
        } else {
          setSustainabilityBacklog(newList);
        }
      } else {
        // Moving between lists
        if (sourceList === 'backlog' && targetList === 'sustainability') {
          const newBacklog = backlog.filter(i => i.id !== item.id);
          const newSustainability = [...sustainabilityBacklog];
          newSustainability.splice(dropIndex, 0, item);
          setBacklog(newBacklog);
          setSustainabilityBacklog(newSustainability);
        } else if (sourceList === 'sustainability' && targetList === 'backlog') {
          const newSustainability = sustainabilityBacklog.filter(i => i.id !== item.id);
          const newBacklog = [...backlog];
          newBacklog.splice(dropIndex, 0, item);
          setSustainabilityBacklog(newSustainability);
          setBacklog(newBacklog);
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

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedIssue(null);
    setDialogMode('details');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <SustainabilityAppBar position="static">
        <Toolbar>
          <NatureIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sustainability Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" onClick={handleMenu}>
              <AccountCircleIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <DashboardIcon sx={{ mr: 1 }} /> Carbon Efficiency
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <AssessmentIcon sx={{ mr: 1 }} /> Sustainability Efforts
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <TrendingUpIcon sx={{ mr: 1 }} /> Performance
              </MenuItem>
              <Divider />
              {authenticated ? (
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} /> Logout
                </MenuItem>
              ) : (
                <MenuItem onClick={handleLogin}>
                  <LoginIcon sx={{ mr: 1 }} /> Login
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </SustainabilityAppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {!authenticated ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <Button
              variant="contained"
              color="success"
              size="large"
              startIcon={<LoginIcon />}
              onClick={handleLogin}
            >
              Login to View Sustainability Metrics
            </Button>
          </Box>
        ) : (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h4" component="h1">
                Sustainability Initiatives
              </Typography>
              {isEditing ? (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckIcon />}
                  onClick={handleAccept}
                >
                  Accept Changes
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                >
                  Edit Backlog
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
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper 
                  sx={{ p: 2, minHeight: '60vh' }}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, 'backlog')}
                >
                  <Typography variant="h6" gutterBottom>
                    All Backlog Items
                  </Typography>
                  {backlog.map((issue, index) => (
                    <React.Fragment key={`backlog-${issue.id}-fragment`}>
                      <DropZone
                        draggable={false}
                        onDragEnter={(e) => handleDragEnter(e, index, 'backlog')}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, 'backlog')}
                        isDropTarget={dropTargetIndex === index && dropTargetList === 'backlog'}
                      />
                      <Box 
                        key={`backlog-${issue.id}-box`}
                        draggable={isEditing}
                        onDragStart={(e) => handleDragStart(e, issue, 'backlog')}
                        onDragEnter={(e) => handleDragEnter(e, index, 'backlog')}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, 'backlog')}
                        mb={2}
                        sx={{
                          position: 'relative',
                          cursor: isEditing ? 'grab' : 'default',
                          '&:active': {
                            cursor: isEditing ? 'grabbing' : 'default',
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            height: '2px',
                            backgroundColor: 'primary.main',
                            opacity: 0,
                            transition: 'opacity 0.2s',
                          },
                          '&[data-is-drop-target="true"]::before': {
                            opacity: 1,
                          },
                        }}
                      >
                        <StyledCard isDragging={draggedItem?.id === issue.id}>
                          <CardContent>
                            <Typography variant="h6" component="h2" gutterBottom>
                              {issue.fields.summary}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {issue.fields.description || 'No description available'}
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                              <Chip
                                label={`Priority: ${issue.fields.priority.name}`}
                                color={getPriorityColor(issue.fields.priority.name)}
                                size="small"
                                sx={{ mr: 1 }}
                              />
                              {issue.fields.customfield_10016 && (
                                <Chip
                                  label={`Story Points: ${issue.fields.customfield_10016}`}
                                  color="primary"
                                  size="small"
                                />
                              )}
                            </Box>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleViewDetails(issue)}
                              sx={{ mt: 1 }}
                            >
                              View Details
                            </Button>
                          </CardContent>
                        </StyledCard>
                      </Box>
                    </React.Fragment>
                  ))}
                  <DropZone
                    key="backlog-end-zone"
                    draggable={false}
                    onDragEnter={(e) => handleDragEnter(e, backlog.length, 'backlog')}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'backlog')}
                    isDropTarget={dropTargetIndex === backlog.length && dropTargetList === 'backlog'}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper 
                  sx={{ p: 2, minHeight: '60vh' }}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, 'sustainability')}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Sustainability Backlog
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setDialogMode('import');
                        setOpenDialog(true);
                      }}
                    >
                      Import from Backlog
                    </Button>
                  </Box>
                  {sustainabilityBacklog.length === 0 ? (
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        height: '50vh',
                        textAlign: 'center',
                        color: 'text.secondary'
                      }}
                    >
                      <Typography variant="body1" gutterBottom>
                        No sustainability items yet
                      </Typography>
                      <Typography variant="body2">
                        Drag items from the All Backlog Items column or use the Import button above
                      </Typography>
                    </Box>
                  ) : (
                    sustainabilityBacklog.map((issue, index) => (
                      <React.Fragment key={`sustainability-${issue.id}-fragment`}>
                        <DropZone
                          draggable={false}
                          onDragEnter={(e) => handleDragEnter(e, index, 'sustainability')}
                          onDragLeave={handleDragLeave}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, 'sustainability')}
                          isDropTarget={dropTargetIndex === index && dropTargetList === 'sustainability'}
                        />
                        <Box 
                          key={`sustainability-${issue.id}-box`}
                          draggable={isEditing}
                          onDragStart={(e) => handleDragStart(e, issue, 'sustainability')}
                          onDragEnter={(e) => handleDragEnter(e, index, 'sustainability')}
                          onDragLeave={handleDragLeave}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, 'sustainability')}
                          mb={2}
                          sx={{
                            position: 'relative',
                            cursor: isEditing ? 'grab' : 'default',
                            '&:active': {
                              cursor: isEditing ? 'grabbing' : 'default',
                            },
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              left: 0,
                              right: 0,
                              height: '2px',
                              backgroundColor: 'primary.main',
                              opacity: 0,
                              transition: 'opacity 0.2s',
                            },
                            '&[data-is-drop-target="true"]::before': {
                              opacity: 1,
                            },
                          }}
                        >
                          <StyledCard isDragging={draggedItem?.id === issue.id}>
                            <CardContent>
                              <Typography variant="h6" component="h2" gutterBottom>
                                {issue.fields.summary}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" paragraph>
                                {issue.fields.description || 'No description available'}
                              </Typography>
                              <Box sx={{ mb: 2 }}>
                                <Chip
                                  label={`Priority: ${issue.fields.priority.name}`}
                                  color={getPriorityColor(issue.fields.priority.name)}
                                  size="small"
                                  sx={{ mr: 1 }}
                                />
                                {issue.fields.customfield_10016 && (
                                  <Chip
                                    label={`Story Points: ${issue.fields.customfield_10016}`}
                                    color="primary"
                                    size="small"
                                  />
                                )}
                              </Box>
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleViewDetails(issue)}
                                sx={{ mt: 1 }}
                              >
                                View Details
                              </Button>
                            </CardContent>
                          </StyledCard>
                        </Box>
                      </React.Fragment>
                    ))
                  )}
                  <DropZone
                    key="sustainability-end-zone"
                    draggable={false}
                    onDragEnter={(e) => handleDragEnter(e, sustainabilityBacklog.length, 'sustainability')}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'sustainability')}
                    isDropTarget={dropTargetIndex === sustainabilityBacklog.length && dropTargetList === 'sustainability'}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {dialogMode === 'details' && selectedIssue ? (
          // View Details mode
          <>
            <DialogTitle>
              {selectedIssue.fields.summary}
              <Typography variant="subtitle2" color="text.secondary">
                {selectedIssue.key}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" paragraph>
                  {selectedIssue.fields.description || 'No description available'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Chip
                    label={`Priority: ${selectedIssue.fields.priority.name}`}
                    color={getPriorityColor(selectedIssue.fields.priority.name)}
                    size="small"
                  />
                  {selectedIssue.fields.customfield_10016 && (
                    <Chip
                      label={`Story Points: ${selectedIssue.fields.customfield_10016}`}
                      color="primary"
                      size="small"
                    />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Last updated: {new Date(selectedIssue.fields.updated).toLocaleDateString()}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} variant="contained" color="primary">
                Close
              </Button>
            </DialogActions>
          </>
        ) : dialogMode === 'import' ? (
          // Import mode
          <>
            <DialogTitle>Import to Sustainability Backlog</DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" paragraph>
                  Select items from the backlog to add to the sustainability backlog:
                </Typography>
                {backlog.map((issue) => (
                  <Box 
                    key={issue.id} 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 1,
                      p: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1
                    }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1">{issue.fields.summary}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {issue.key}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={async () => {
                        if (!sustainabilityBacklog.some(item => item.id === issue.id)) {
                          const newSustainabilityBacklog = [...sustainabilityBacklog, issue];
                          setSustainabilityBacklog(newSustainabilityBacklog);
                        }
                        handleCloseDialog();
                      }}
                      disabled={sustainabilityBacklog.some(item => item.id === issue.id)}
                    >
                      Add
                    </Button>
                  </Box>
                ))}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} variant="contained" color="primary">
                Close
              </Button>
            </DialogActions>
          </>
        ) : null}
      </Dialog>
    </Box>
  );
}

export default Product;
