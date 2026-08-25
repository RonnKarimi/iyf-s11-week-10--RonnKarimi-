const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let posts = [
    { id: 1, title: "Getting Started with Node.js", author: "John Doe" },
    { id: 2, title: "Express.js Fundamentals", author: "Jane Smith" }
];

// Comments stored separately, keyed by postId
let comments = [
    { id: 1, postId: 1, author: "Reader One", text: "Great intro!" },
    { id: 2, postId: 1, author: "Reader Two", text: "Very clear, thanks." }
];
let nextCommentId = 3;

const findPostOr404 = (req, res, next) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    req.post = post;
    next();
};

// GET comments for a post
app.get('/api/posts/:id/comments', findPostOr404, (req, res) => {
    const postComments = comments.filter(c => c.postId === req.post.id);
    res.json(postComments);
});

// POST add a comment to a post
app.post('/api/posts/:id/comments', findPostOr404, (req, res) => {
    const { author, text } = req.body;

    if (!author || !text) {
        return res.status(400).json({ error: 'Author and text are required' });
    }

    const newComment = {
        id: nextCommentId++,
        postId: req.post.id,
        author,
        text
    };

    comments.push(newComment);
    res.status(201).json(newComment);
});

// DELETE a comment from a post
app.delete('/api/posts/:id/comments/:commentId', findPostOr404, (req, res) => {
    const commentId = parseInt(req.params.commentId);
    const commentIndex = comments.findIndex(
        c => c.id === commentId && c.postId === req.post.id
    );

    if (commentIndex === -1) {
        return res.status(404).json({ error: 'Comment not found' });
    }

    comments.splice(commentIndex, 1);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
