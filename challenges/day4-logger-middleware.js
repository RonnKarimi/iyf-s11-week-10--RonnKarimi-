const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const LOG_FILE = path.join(__dirname, 'access.log');

const requestLogger = (req, res, next) => {
    const start = Date.now();
    const timestamp = new Date().toISOString();

    // Hook into 'finish' to capture response time once the response is sent
    res.on('finish', () => {
        const duration = Date.now() - start;
        const line = `${timestamp} - ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms\n`;

        console.log(line.trim());

        // Bonus: append to a log file
        fs.appendFile(LOG_FILE, line, (err) => {
            if (err) console.error('Failed to write log:', err);
        });
    });

    next();
};

app.use(requestLogger);

app.get('/', (req, res) => {
    res.send('Welcome to CommunityHub API');
});

app.get('/slow', (req, res) => {
    // Simulate work so you can see the response time differ
    setTimeout(() => res.json({ message: 'That took a moment' }), 300);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
