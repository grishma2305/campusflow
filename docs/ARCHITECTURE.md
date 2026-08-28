# CampusFlow Architecture

## Database Schema

**users** — stores account info (name, email, password).

**organizations** — clubs/orgs like SparkSF. Linked to the user who created it.

**organization_members** — connects users to organizations with a role (Admin, Project Manager, Member). One user can belong to many orgs.

**projects** — events like "Startup Networking Night." Each belongs to one organization.

**tasks** — the Kanban cards. Each belongs to one project, assigned to one user, with a status (To Do / In Progress / Blocked / Done), priority, and due date.

## Relationships
- One organization → many members, many projects
- One project → many tasks
- One user → many tasks, many org memberships