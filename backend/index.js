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

app.post('/api/projects', (req, res) => {
    const { name, description, start_date, end_date } = req.body;
    if (!name || !name.trim()) {
        res.status(400).json({ error: 'Project name is required' });
        return;
    }
    db.query(
        'INSERT INTO projects (name, description, start_date, end_date) VALUES (?, ?, ?, ?)',
        [name, description || null, start_date || null, end_date || null],
        (err, result) => {
            if (err) {
                res.status(500).json({ error: 'Failed to create project' });
                return;
            }
            res.json({
                id: result.insertId,
                name,
                description: description || null,
                start_date: start_date || null,
                end_date: end_date || null,
            });
        }
    );
});

app.get('/api/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Database query failed' });
            return;
        } res.json(results);
    });

    app.post('/api/tasks', (req, res) => {
        const { project_id, title, status, priority, due_date, description } = req.body;
        db.query(
            'INSERT INTO tasks (project_id, title, status, priority, due_date, description) VALUES (?, ?, ?, ?, ?, ?)',
            [project_id, title, status || 'To Do', priority || 'Medium', due_date || null, description || null],
            (err, result) => {
                if (err) {
                    res.status(500).json({ error: 'Failed to create task' });
                    return;
                }
                res.json({ id: result.insertId, project_id, title, status: status || 'To Do', priority: priority || 'Medium', due_date: due_date || null, description: description || null });
            }
        );
    });

    app.put('/api/tasks/:id', (req, res) => {
        const { status, priority, due_date, description } = req.body;
        const { id } = req.params;

        const fields = [];
        const values = [];

        if (status !== undefined) {
            fields.push('status = ?');
            values.push(status);
        }
        if (priority !== undefined) {
            fields.push('priority = ?');
            values.push(priority);
        }
        if (due_date !== undefined) {
            fields.push('due_date = ?');
            values.push(due_date || null);
        }
        if (description !== undefined) {
            fields.push('description = ?');
            values.push(description || null);
        }

        if (fields.length === 0) {
            res.status(400).json({ error: 'No fields to update' });
            return;
        }

        values.push(id);

        db.query(
            `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`,
            values,
            (err) => {
                if (err) {
                    res.status(500).json({ error: 'Failed to update task' });
                    return;
                }
                res.json({ id, status, priority, due_date, description });
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

app.delete('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM tasks WHERE project_id = ?', [id], (err) => {
        if (err) {
            res.status(500).json({ error: 'Failed to delete project tasks' });
            return;
        }
        db.query('DELETE FROM projects WHERE id = ?', [id], (err2, result) => {
            if (err2) {
                res.status(500).json({ error: 'Failed to delete project' });
                return;
            }
            res.json({ id, deleted: true });
        });
    });
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});