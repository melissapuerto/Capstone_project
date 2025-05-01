module.exports = {
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,        // Ensure cookies are sent over HTTPS
        httpOnly: true,      // Prevent client-side JavaScript from accessing cookies
        sameSite: 'none',    // Allow cookies to be sent across different origins
    },
};
