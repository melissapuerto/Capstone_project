require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

const passportConfig = require('./config/passport');
const sessionConfig = require('./config/sessionConfig');
const authRoutes = require('./routes/authRoutes');
const backlogRoutes = require('./routes/backlogRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');
const socialRoutes = require('./routes/posts');

const app = express();

app.set('trust proxy', 1);

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-frontend-url.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session(sessionConfig));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);        // Routes for authentication
app.use("/api/backlog", backlogRoutes);     // Routes for fetching backlog
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/user", userRoutes);
app.use("/api/social", socialRoutes); // Social media routes

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
