const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const mongoose = require('mongoose');

const passportConfig = require('./config/passport');
const sessionConfig = require('./config/sessionConfig');
const authRoutes = require('./routes/authRoutes');
const backlogRoutes = require('./routes/backlogRoutes');

const app = express();

app.set('trust proxy', 1);

// CORS setup
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Session & Passport setup
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);        // Routes for authentication
app.use("/api/backlog", backlogRoutes);     // Routes for fetching backlog

// Test route
app.get('/test', (req, res) => {
    res.status(200).json({ message: 'Test route is working' });
});

// Starting the server
app.listen(process.env.PORT, () => {
    console.log(`Server running on ${process.env.PORT}`);
});
