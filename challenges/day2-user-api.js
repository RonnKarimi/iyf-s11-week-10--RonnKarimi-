const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];
let nextId = 3;

// GET all users
app.get('/api/users', (req, res) => {
    res.json(users);
});

// GET single user
app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
});

// Simple email regex - good enough for basic validation
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// POST create user, with validation
app.post('/api/users', (req, res) => {
    const { name, email } = req.body;
    const errors = [];

    if (!name || name.trim().length === 0) {
        errors.push('Name is required');
    }
    if (!email || !isValidEmail(email)) {
        errors.push('A valid email is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const newUser = { id: nextId++, name, email };
    users.push(newUser);
    res.status(201).json(newUser);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
