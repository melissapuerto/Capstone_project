import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
  Container,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Nature as NatureIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const SustainabilityAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#2E7D32', // Green color for sustainability theme
  marginBottom: theme.spacing(4),
}));

function Product() {
  const [backlog, setBacklog] = useState([]);
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

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
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:3000"}/api/backlog`, { withCredentials: true });
          setBacklog(response.data.issues);
        } catch (err) {
          setError('Error fetching backlog');
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
            <Typography variant="h4" component="h1" gutterBottom>
              Sustainability Initiatives
            </Typography>
            {error && (
              <Typography color="error" gutterBottom>
                {error}
              </Typography>
            )}
            <Grid container spacing={3}>
              {backlog.map((issue) => (
                <Grid item xs={12} sm={6} md={4} key={issue.id}>
                  <StyledCard>
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
                      <Typography variant="caption" color="text.secondary">
                        Last updated: {new Date(issue.fields.updated).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" color="success">
                        View Details
                      </Button>
                      <Button size="small" color="success">
                        Track Progress
                      </Button>
                    </CardActions>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Product;
