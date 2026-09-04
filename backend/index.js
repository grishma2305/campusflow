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
        const { project_id, title, status, priority, due_date } = req.body;
        db.query(
            'INSERT INTO tasks (project_id, title, status, priority, due_date) VALUES (?, ?, ?, ?, ?)',
            [project_id, title, status || 'To Do', priority || 'Medium', due_date || null],
            (err, result) => {
                if (err) {
                    res.status(500).json({ error: 'Failed to create task' });
                    return;
                }
                res.json({ id: result.insertId, project_id, title, status: status || 'To Do', priority: priority || 'Medium', due_date: due_date || null });
            }
        );
    });

    app.put('/api/tasks/:id', (req, res) => {
        const { status } = req.body;
        const { id } = req.params;
        db.query(
            'UPDATE tasks SET status = ? WHERE id = ?',
            [status, id],
            (err) => {
                if (err) {
                    res.status(500).json({ error: 'Failed to update task' });
                    return;
                }
                res.json({ id, status });
            }
        );
    });

    app.delete('/api/tasks/:id', (req, res) => {
        const { id } = req.params;
        db.query('DELETE FROM tasks WHERE id = ?', [id], (err) => {
            if (err) {
                res.status(500).json({ error: 'Failed to delete task' });
                return;
            }
            res.json({ id });
        });
    });
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});