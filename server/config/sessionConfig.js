module.exports = {
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'none',         // Needed for cross-site requests
        secure: isProd,           // Enforce HTTPS in production
        httpOnly: true,           // Prevent JavaScript access to cookies
    },
};
