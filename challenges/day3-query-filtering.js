const express = require('express');
const app = express();
const PORT = 3000;

let posts = [
    { id: 1, title: "Getting Started with Node.js", author: "John Doe", createdAt: "2026-01-15T10:00:00Z", likes: 10 },
    { id: 2, title: "Express.js Fundamentals", author: "Jane Smith", createdAt: "2026-01-16T14:30:00Z", likes: 15 },
    { id: 3, title: "Advanced Node Patterns", author: "John Doe", createdAt: "2026-01-18T09:00:00Z", likes: 5 },
    { id: 4, title: "REST API Design", author: "Ana Lee", createdAt: "2026-01-14T08:00:00Z", likes: 22 }
];

app.get('/api/posts', (req, res) => {
    const { author, search, sort, page = 1, limit = 10 } = req.query;

    let result = [...posts];

    // Filter by author
    if (author) {
        result = result.filter(p =>
            p.author.toLowerCase().includes(author.toLowerCase())
        );
    }

    // Search in title
    if (search) {
        result = result.filter(p =>
            p.title.toLowerCase().includes(search.toLowerCase())
        );
    }

    // Sort
    if (sort === 'newest') {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'popular') {
        result.sort((a, b) => b.likes - a.likes);
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const total = result.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = result.slice(startIndex, startIndex + limitNum);

    res.json({
        data: paginated,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum)
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
