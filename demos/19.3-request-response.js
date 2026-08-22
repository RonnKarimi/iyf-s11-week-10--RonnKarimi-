const express = require('express');
const app = express();
const PORT = 3000;

// --- Response methods ---
app.get('/text', (req, res) => {
    res.send('Plain text response');
});

app.get('/json', (req, res) => {
    res.json({ message: 'JSON response', success: true });
});

app.get('/error', (req, res) => {
    res.status(400).json({ error: 'Bad request' });
});

app.get('/old-page', (req, res) => {
    res.redirect('/new-page');
});

// --- Route parameters ---
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.json({ message: `Getting user ${userId}` });
});

app.get('/posts/:postId/comments/:commentId', (req, res) => {
    const { postId, commentId } = req.params;
    res.json({ postId, commentId });
});

// --- Query strings ---
// /search?q=hello&limit=10
app.get('/search', (req, res) => {
    const { q, limit = 10, page = 1 } = req.query;
    res.json({
        query: q,
        limit: parseInt(limit),
        page: parseInt(page)
    });
});

// /posts?category=tech&sort=newest
app.get('/posts', (req, res) => {
    const { category, sort = 'newest' } = req.query;
    res.json({
        message: 'Getting posts',
        filters: { category, sort }
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
