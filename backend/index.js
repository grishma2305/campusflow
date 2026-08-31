const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

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

app.get('/api/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Database query failed' });
            return;
        } res.json(results);
    });

    app.post('/api/tasks', (req, res) => {
        const { project_id, title, status } = req.body;
        db.query(
            'INSERT INTO tasks (project_id, title, status) VALUES (?, ?, ?)',
            [project_id, title, status || 'To Do'],
            (err, result) => {
                if (err) {
                    res.status(500).json({ error: 'Failed to create task' });
                    return;
                }
                res.json({ id: result.insertId, project_id, title, status: status || 'To Do' });
            }
        );
    });
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});