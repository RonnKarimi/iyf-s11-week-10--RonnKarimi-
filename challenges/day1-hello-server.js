const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Welcome to CommunityHub API');
});

app.get('/about', (req, res) => {
    res.send('CommunityHub - A community platform');
});

app.get('/api/time', (req, res) => {
    res.json({ time: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
