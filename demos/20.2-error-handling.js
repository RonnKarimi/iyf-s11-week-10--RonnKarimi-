const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Custom error class
class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

// Route that throws error
app.get('/api/error-test', (req, res, next) => {
    try {
        throw new ApiError('Something went wrong', 500);
    } catch (error) {
        next(error);  // Pass to error handler
    }
});

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Example async route using the wrapper
app.get('/api/users', asyncHandler(async (req, res) => {
    const users = await Promise.resolve([{ id: 1, name: 'Demo User' }]);
    res.json(users);
}));

// Validation middleware
const validatePost = (req, res, next) => {
    const { title, content, author } = req.body;
    const errors = [];

    if (!title || title.length < 3) {
        errors.push('Title must be at least 3 characters');
    }
    if (!content || content.length < 10) {
        errors.push('Content must be at least 10 characters');
    }
    if (!author) {
        errors.push('Author is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

app.post('/api/posts', validatePost, (req, res) => {
    res.status(201).json({ message: 'Post created (validation passed)' });
});

// Error handling middleware (must be last!)
app.use((err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        error: { message, status: statusCode }
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
