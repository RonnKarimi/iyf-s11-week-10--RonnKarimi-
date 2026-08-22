const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// In-memory data store
let posts = [
    {
        id: 1,
        title: "Getting Started with Node.js",
        content: "Node.js is a JavaScript runtime...",
        author: "John Doe",
        createdAt: "2026-01-15T10:00:00Z",
        likes: 10
    },
    {
        id: 2,
        title: "Express.js Fundamentals",
        content: "Express is a web framework...",
        author: "Jane Smith",
        createdAt: "2026-01-16T14:30:00Z",
        likes: 15
    }
];

let nextId = 3;

// GET all posts
app.get('/api/posts', (req, res) => {
    const { author, sort } = req.query;

    let result = [...posts];

    if (author) {
        result = result.filter(post =>
            post.author.toLowerCase().includes(author.toLowerCase())
        );
    }

    if (sort === 'newest') {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'popular') {
        result.sort((a, b) => b.likes - a.likes);
    }

    res.json(result);
});

// GET single post
app.get('/api/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const post = posts.find(p => p.id === id);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
});

// POST create new post
app.post('/api/posts', (req, res) => {
    const { title, content, author } = req.body;

    if (!title || !content || !author) {
        return res.status(400).json({
            error: 'Title, content, and author are required'
        });
    }

    const newPost = {
        id: nextId++,
        title,
        content,
        author,
        createdAt: new Date().toISOString(),
        likes: 0
    };

    posts.push(newPost);
    res.status(201).json(newPost);
});

// PUT update post
app.put('/api/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const postIndex = posts.findIndex(p => p.id === id);

    if (postIndex === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }

    const { title, content } = req.body;

    posts[postIndex] = {
        ...posts[postIndex],
        title: title || posts[postIndex].title,
        content: content || posts[postIndex].content,
        updatedAt: new Date().toISOString()
    };

    res.json(posts[postIndex]);
});

// DELETE post
app.delete('/api/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const postIndex = posts.findIndex(p => p.id === id);

    if (postIndex === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }

    posts.splice(postIndex, 1);
    res.status(204).send();
});

// PATCH like a post
app.patch('/api/posts/:id/like', (req, res) => {
    const id = parseInt(req.params.id);
    const post = posts.find(p => p.id === id);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    post.likes++;
    res.json(post);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
