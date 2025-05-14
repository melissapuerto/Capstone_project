import React, { useState } from 'react';
import { Box, Typography, List, ListItem, TextField, Button, Paper, Select, MenuItem, FormControl, InputLabel, Avatar, Card, CardContent, CardMedia, Grid, IconButton, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions, Divider, InputAdornment, Tooltip } from '@mui/material';
import { PhotoCamera, VideoLibrary, Edit, Delete, Favorite, FavoriteBorder, Share, Comment, Search } from '@mui/icons-material';

const KnowledgeSharing = () => {
  const userDetails = {
    'Alice Johnson': { role: 'Senior Software Engineer', email: 'alice.johnson@elisa.fi' },
    'Bob Smith': { role: 'UX Designer', email: 'bob.smith@elisa.fi' },
    'Charlie Brown': { role: 'DevOps Engineer', email: 'charlie.brown@elisa.fi' },
    'David Wilson': { role: 'Junior Developer', email: 'david.wilson@elisa.fi' },
    'Melissa Test': { role: 'Software Developer', email: 'melissa.test@elisa.fi' }
  };

  const [posts, setPosts] = useState([
    { 
      id: 1, 
      title: 'Optimizing Code for Energy Efficiency', 
      content: 'Using efficient algorithms and data structures can significantly reduce the energy consumption of your applications.', 
      author: 'Alice Johnson', 
      project: 'Project A', 
      department: 'Engineering', 
      timestamp: '2023-10-01T10:00:00Z', 
      media: 'https://www.youtube.com/embed/yxU1TawzROI', 
      isEditable: false, 
      isFavorite: false, 
      comments: [{ id: 1, text: 'Great post!', author: 'Bob Smith', timestamp: '2023-10-01T11:00:00Z' }],
      avatar: 'A'
    },
    { 
      id: 2, 
      title: 'Green Coding Practices', 
      content: 'Adopting practices like code reuse, modular design, and minimizing resource usage helps in creating sustainable software.', 
      author: 'Bob Smith', 
      project: 'Project B', 
      department: 'Design', 
      timestamp: '2023-10-02T11:30:00Z', 
      media: 'https://www.youtube.com/embed/bFyjzleofxs', 
      isEditable: false, 
      isFavorite: false, 
      comments: [{ id: 1, text: 'Very informative!', author: 'Alice Johnson', timestamp: '2023-10-02T12:00:00Z' }],
      avatar: 'B'
    },
    { 
      id: 3, 
      title: 'Sustainable Development Workflow', 
      content: 'Implementing CI/CD pipelines that include energy profiling can help identify and reduce energy-intensive code paths.', 
      author: 'Charlie Brown', 
      project: 'Project A', 
      department: 'Engineering', 
      timestamp: '2023-10-03T09:15:00Z', 
      media: 'https://www.youtube.com/embed/erXQSQ8DH9Y', 
      isEditable: false, 
      isFavorite: false, 
      comments: [{ id: 1, text: 'Thanks for sharing!', author: 'Melissa Test', timestamp: '2023-10-03T10:00:00Z' }],
      avatar: 'C'
    },
    {
      id: 4,
      title: 'Getting Started with Green Coding',
      content: 'I\'m new to the concept of green coding and would love to learn more about it. What are some good resources or practices to get started? Any advice from experienced developers would be greatly appreciated!',
      author: 'David Wilson',
      project: 'Project C',
      department: 'Engineering',
      timestamp: '2023-10-04T14:30:00Z',
      media: null,
      isEditable: false,
      isFavorite: false,
      comments: [
        { id: 1, text: 'I recommend starting with "Clean Code" by Robert C. Martin and then moving on to specific green coding practices.', author: 'Alice Johnson', timestamp: '2023-10-04T15:00:00Z' },
        { id: 2, text: 'Check out the Green Software Foundation\'s resources. They have great documentation for beginners!', author: 'Bob Smith', timestamp: '2023-10-04T15:30:00Z' }
      ],
      avatar: 'D'
    }
  ]);

  const [newPost, setNewPost] = useState({ title: '', content: '', author: 'Melissa Test', project: '', department: 'Engineering', media: null, avatar: 'M' });
  const [filter, setFilter] = useState({ author: 'all', project: 'all', department: 'all' });
  const [editingPost, setEditingPost] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPost({ ...newPost, media: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPost.title && newPost.content && newPost.project) {
      const post = { id: posts.length + 1, ...newPost, timestamp: new Date().toISOString(), isEditable: true, isFavorite: false, comments: [] };
      setPosts([...posts, post]);
      setNewPost({ title: '', content: '', author: 'Melissa Test', project: '', department: 'Engineering', media: null, avatar: 'M' });
    }
  };

  const handleEdit = (post) => {
    if (post.isEditable && post.author === 'Melissa Test') {
      setEditingPost(post);
      setNewPost({ ...post });
    }
  };

  const handleUpdate = () => {
    if (editingPost) {
      const updatedPosts = posts.map(post => post.id === editingPost.id ? { ...newPost, id: post.id, timestamp: post.timestamp, isEditable: true } : post);
      setPosts(updatedPosts);
      setEditingPost(null);
      setNewPost({ title: '', content: '', author: 'Melissa Test', project: '', department: 'Engineering', media: null, avatar: 'M' });
    }
  };

  const handleDelete = (postId) => {
    const postToDelete = posts.find(post => post.id === postId);
    if (postToDelete && postToDelete.isEditable && postToDelete.author === 'Melissa Test') {
      setPosts(posts.filter(post => post.id !== postId));
    }
  };

  const handleFavorite = (postId) => {
    setPosts(posts.map(post => post.id === postId ? { ...post, isFavorite: !post.isFavorite } : post));
  };

  const handleShare = (post) => {
    setSelectedPost(post);
    setShareDialogOpen(true);
  };

  const handleCloseShareDialog = () => {
    setShareDialogOpen(false);
  };

  const handleCopyLink = () => {
    const link = `http://localhost:3000/knowledge-sharing/${selectedPost.id}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  const handleEmailShare = () => {
    const subject = `Check out this post: ${selectedPost.title}`;
    const body = `I thought you might be interested in this post: ${selectedPost.content}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleAddComment = (postId) => {
    if (newComment.trim()) {
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, { id: post.comments.length + 1, text: newComment, author: 'Melissa Test', timestamp: new Date().toISOString() }]
          };
        }
        return post;
      });
      setPosts(updatedPosts);
      setNewComment('');
    }
  };

  const handleDeleteComment = (postId, commentId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.filter(comment => comment.id !== commentId)
        };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch && 
      (filter.author === 'all' || post.author === filter.author) &&
      (filter.project === 'all' || post.project === filter.project) &&
      (filter.department === 'all' || post.department === filter.department);
  });

  const myPosts = posts.filter(post => post.author === 'Melissa Test');
  const likedPosts = posts.filter(post => post.isFavorite);

  const handleEmailClick = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const UserTooltip = ({ name }) => {
    const details = userDetails[name];
    return (
      <Box sx={{ p: 1 }}>
        <Typography variant="subtitle2">{name}</Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>{details.role}</Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#2196f3', 
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
          onClick={() => handleEmailClick(details.email)}
        >
          {details.email}
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3, maxWidth: '800px', margin: '0 auto' }}>
      <Paper sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', borderRadius: '12px' }}>
        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>M</Avatar>
        <Typography variant="h6">Knowledge Sharing Feed</Typography>
      </Paper>
      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="All Posts" />
        <Tab label="My Posts" />
        <Tab label="Liked Posts" />
      </Tabs>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        {tabValue === 0 && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Filter by Author</InputLabel>
                <Select value={filter.author} onChange={(e) => setFilter({ ...filter, author: e.target.value })}>
                  <MenuItem value="all">All</MenuItem>
                  {Array.from(new Set(posts.map(post => post.author))).map(author => (
                    <MenuItem key={author} value={author}>{author}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Filter by Project</InputLabel>
                <Select value={filter.project} onChange={(e) => setFilter({ ...filter, project: e.target.value })}>
                  <MenuItem value="all">All</MenuItem>
                  {Array.from(new Set(posts.map(post => post.project))).map(project => (
                    <MenuItem key={project} value={project}>{project}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Filter by Department</InputLabel>
                <Select value={filter.department} onChange={(e) => setFilter({ ...filter, department: e.target.value })}>
                  <MenuItem value="all">All</MenuItem>
                  {Array.from(new Set(posts.map(post => post.department))).map(department => (
                    <MenuItem key={department} value={department}>{department}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}
      </Box>
      <List>
        {(tabValue === 0 ? filteredPosts : tabValue === 1 ? myPosts : likedPosts).map((post) => (
          <ListItem key={post.id} sx={{ mb: 2 }}>
            <Card sx={{ width: '100%', borderRadius: '12px', boxShadow: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>{post.avatar}</Avatar>
                  <Box>
                    <Typography variant="h6">{post.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      <Tooltip title={<UserTooltip name={post.author} />} arrow placement="top">
                        <span style={{ cursor: 'pointer', textDecoration: 'underline' }}>{post.author}</span>
                      </Tooltip>
                      {' • '}{post.project} • {post.department} • {new Date(post.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>{post.content}</Typography>
                {post.media && (
                  <Box sx={{ mb: 2 }}>
                    <iframe
                      width="100%"
                      height="315"
                      src={post.media}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ borderRadius: '8px' }}
                    />
                  </Box>
                )}
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={() => handleFavorite(post.id)}>
                      {post.isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
                    </IconButton>
                    <IconButton onClick={() => handleShare(post)}><Share /></IconButton>
                    {post.isEditable && post.author === 'Melissa Test' && (
                      <>
                        <IconButton onClick={() => handleEdit(post)}><Edit /></IconButton>
                        <IconButton onClick={() => handleDelete(post.id)}><Delete /></IconButton>
                      </>
                    )}
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Comments</Typography>
                  {post.comments.map(comment => (
                    <Box key={comment.id} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Avatar sx={{ mr: 1, width: 32, height: 32, fontSize: '0.875rem' }}>
                        {comment.author.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Tooltip title={<UserTooltip name={comment.author} />} arrow placement="top">
                            <Typography variant="subtitle2" sx={{ cursor: 'pointer', textDecoration: 'underline' }}>
                              {comment.author}
                            </Typography>
                          </Tooltip>
                          {comment.author === 'Melissa Test' && (
                            <IconButton size="small" onClick={() => handleDeleteComment(post.id, comment.id)}>
                              <Delete fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                        <Typography variant="body2">{comment.text}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(comment.timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                  <Box sx={{ display: 'flex', mt: 2 }}>
                    <Avatar sx={{ mr: 1, width: 32, height: 32, fontSize: '0.875rem' }}>M</Avatar>
                    <TextField
                      fullWidth
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Button 
                      variant="contained" 
                      onClick={() => handleAddComment(post.id)}
                      disabled={!newComment.trim()}
                    >
                      Post
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </ListItem>
        ))}
      </List>
      <Dialog open={shareDialogOpen} onClose={handleCloseShareDialog}>
        <DialogTitle>Share Post</DialogTitle>
        <DialogContent>
          <Typography>Share this post via email or copy the link.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEmailShare}>Email</Button>
          <Button onClick={handleCopyLink}>Copy Link</Button>
          <Button onClick={handleCloseShareDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Paper sx={{ p: 2, mt: 2, borderRadius: '12px' }}>
        <Typography variant="h6" gutterBottom>{editingPost ? 'Edit Post' : 'Add a New Post'}</Typography>
        <form onSubmit={editingPost ? handleUpdate : handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={newPost.title}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Content"
            name="content"
            value={newPost.content}
            onChange={handleInputChange}
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            label="Author"
            name="author"
            value={newPost.author}
            onChange={handleInputChange}
            margin="normal"
            disabled
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Project</InputLabel>
            <Select
              name="project"
              value={newPost.project}
              onChange={handleInputChange}
            >
              <MenuItem value="Project A">Project A</MenuItem>
              <MenuItem value="Project B">Project B</MenuItem>
              <MenuItem value="Project C">Project C</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Department"
            name="department"
            value={newPost.department}
            onChange={handleInputChange}
            margin="normal"
            disabled
          />
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <input
              accept="image/*,video/*"
              style={{ display: 'none' }}
              id="media-upload"
              type="file"
              onChange={handleMediaChange}
            />
            <label htmlFor="media-upload">
              <IconButton color="primary" component="span">
                <PhotoCamera />
              </IconButton>
            </label>
            <Typography variant="body2" sx={{ ml: 1 }}>
              {newPost.media ? 'Media uploaded' : 'Upload media'}
            </Typography>
          </Box>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>{editingPost ? 'Update' : 'Submit'}</Button>
        </form>
      </Paper>
    </Box>
  );
};

export default KnowledgeSharing; 