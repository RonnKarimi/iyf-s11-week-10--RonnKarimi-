const express = require('express');
const app = express();
const PORT = 3000;

// Logger middleware
const logger = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();  // Pass to next middleware/route
};
app.use(logger);

// Request time middleware
const addRequestTime = (req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
};
app.use(addRequestTime);

app.get('/api/time', (req, res) => {
    res.json({ requestTime: req.requestTime });
});

// Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Auth check middleware
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'No authorization header' });
    }

    next();
};

app.get('/api/protected', requireAuth, (req, res) => {
    res.json({ message: 'This is protected data' });
});

app.use('/api/admin', requireAuth);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
