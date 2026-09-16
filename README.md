# CampusFlow

A full-stack project management tool built for small teams — organize projects into Kanban boards, assign tasks to teammates, track priority and due dates, and manage it all behind secure, JWT-based authentication.

Built as a solo full-stack project to practice and demonstrate end-to-end web development: React frontend, Express/Node backend, MySQL database, and real user authentication.

---

## ✨ Features

- **User authentication** — signup and login with hashed passwords (bcrypt) and JWT-based sessions. Sessions persist across page refreshes.
- **Projects** — create and delete projects, each with its own name, description, start date, and end date.
- **Kanban task board** — every project gets four columns (To Do, In Progress, Blocked, Done) with full drag-and-drop support between columns, powered by `@dnd-kit`.
- **Task details** — each task supports a title, description, priority (Low / Medium / High), due date, and status.
- **Task assignees** — assign any task to a registered user from a dropdown; reassign anytime.
- **Smart sorting** — tasks are sorted by priority first, then by due date, so the most urgent work always floats to the top of each column.
- **Overdue highlighting** — tasks past their due date (and not yet Done) are visually flagged with a red border and bold date.
- **Filtering & search** — filter tasks by priority and search by title/description across all projects at once.
- **Form validation** — both project and task creation forms validate required fields and surface clear error messages instead of failing silently.
- **Protected API routes** — all create/update/delete operations require a valid JWT; only project/task viewing is public.

---

## 🛠️ Tech Stack

**Frontend**
- React (with Vite)
- [`@dnd-kit`](https://dndkit.com/) for drag-and-drop
- Vanilla CSS / inline styles (no UI framework)

**Backend**
- Node.js + Express
- MySQL (via `mysql2`)
- `bcrypt` for password hashing
- `jsonwebtoken` for JWT-based authentication

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MySQL](https://www.mysql.com/) running locally or accessible remotely
- npm (comes with Node.js)

### 1. Clone the repository

```bash
git clone https://github.com/grishma2305/campusflow.git
cd campusflow
```

### 2. Set up the database

Create a MySQL database and run the following to set up the required tables:

```sql
CREATE DATABASE campusflow;
USE campusflow;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE
);

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    assigned_to INT NULL,
    status VARCHAR(50) DEFAULT 'To Do',
    priority VARCHAR(20) DEFAULT 'Medium',
    due_date DATE,
    is_blocked TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);
```

### 3. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with:

```
DB_PASSWORD=your_mysql_password
JWT_SECRET=a_long_random_string_of_your_choosing
```

Start the backend:

```bash
node index.js
```

The API will run on `http://localhost:5000`.

### 4. Set up the frontend

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` with:

```
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The app will run on `http://localhost:5173`.

### 5. Create an account and start using it

Open `http://localhost:5173`, click **Sign up**, and create your first account. From there you can create projects, add tasks, and invite teammates to sign up so you can assign work to them.

---

## 📁 Project Structure

```
campusflow/
├── backend/
│   ├── index.js          # Express server, all API routes
│   ├── db.js              # MySQL connection setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx    # Main board, drag-and-drop, filters
│   │   │   ├── ProjectForm.jsx  # New project form
│   │   │   ├── TaskForm.jsx     # New task form
│   │   │   └── AuthForm.jsx     # Login / signup form
│   │   ├── App.jsx        # Auth state, routing between login and dashboard
│   │   └── main.jsx
│   └── package.json
└── README.md
```

---

## 🔌 API Overview

All routes are prefixed with `/api`. Routes marked 🔒 require an `Authorization: Bearer <token>` header.

| Method | Route | Description |
|---|---|---|
| POST | `/auth/signup` | Create a new account |
| POST | `/auth/login` | Log in and receive a JWT |
| GET | `/users` 🔒 | List all users (for assigning tasks) |
| GET | `/projects` | List all projects |
| POST | `/projects` 🔒 | Create a project |
| DELETE | `/projects/:id` 🔒 | Delete a project and its tasks |
| GET | `/tasks` | List all tasks |
| POST | `/tasks` 🔒 | Create a task |
| PUT | `/tasks/:id` 🔒 | Update a task (status, priority, due date, description, assignee) |
| DELETE | `/tasks/:id` 🔒 | Delete a task |

---

## 🗺️ Possible Future Improvements

- Deploy to a live environment (frontend on Vercel/Netlify, backend on Render/Railway)
- Per-project team membership instead of a single shared workspace
- Comments or an activity log on tasks
- Email notifications for task assignments and due dates
- Loading states and skeleton UI while data fetches

---

## 📄 License

This project was built for educational and portfolio purposes.