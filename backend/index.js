const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.send('CampusFlow backend is running');
});

app.get('/api/projects', (req, res) => {
    db.query('SELECT * FROM projects', (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Database query failed' });
            return;
        }
        res.json(results);
    });
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});