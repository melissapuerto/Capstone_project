module.exports = {
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'none',              // REQUIRED for cross-site (frontend <> API)
        secure: true,               // cookie only over HTTPS in prod
        httpOnly: true,                // keeps JS from poking at it
    },
};
