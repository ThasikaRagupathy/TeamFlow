# TeamFlow - Team Project Management Platform

TeamFlow is a modern, responsive project management and team collaboration web application built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. It enables teams to organise projects, assign tasks, track progress across Kanban and table views, discuss issues through task comments, and maintain a complete audit trail of project activity.

---

## 🌟 Key Features

1. **Authentication & Session Security**:
   - Secure registration, login, and current-user profile.
   - 1-Click demo account switchers for quick evaluation.
   - Working logout mechanism that immediately invalidates authenticated sessions and prevents token reuse.

2. **Project Workspaces & Team Permissions**:
   - Project creation with automatic ownership assignment.
   - **Role-Based Permission Matrix**:
     | Action | Project Owner | Team Member |
     | :--- | :---: | :---: |
     | View project, tasks, activity feed | ✅ Yes | ✅ Yes |
     | Create tasks and post comments | ✅ Yes | ✅ Yes |
     | Change any task's status (Kanban/Table) | ✅ Yes | ✅ Yes |
     | Edit or delete tasks they created | ✅ Yes | ✅ Yes |
     | Edit or delete other users' tasks | ✅ Yes | ❌ No |
     | Assign or reassign tasks | ✅ Yes | ❌ No (Owner only) |
     | Manage members (add / remove) | ✅ Yes | ❌ No (Owner only) |
   - **Project Member Invariant**: Only current project members can be assigned tasks.
   - **Member Removal Invariant**: Removing a member immediately revokes their project access and unassigns all tasks assigned to them.
   - **Owner Protection**: The project owner cannot be removed.
   - **Audit Preservation**: Comments and task history remain readable even after a member leaves or a task is deleted.

3. **Task Management & Views**:
   - Full lifecycle: Create, view, edit, and delete tasks.
   - **Dual Views**:
     - **Kanban Board**: Grouped by Backlog, To Do, In Progress, and Done with status change dropdowns, priority badges, and overdue indicators.
     - **Table / List View**: Server-side style search by title, multi-filter by status, priority, assignee, and overdue checkbox, sorting, and pagination.
   - **URL Synchronization**: All search queries, filters, sorting options, and active page numbers are synchronized with URL search parameters for link sharing and state preservation.
   - **Overdue Task Definition**: A task is classified as overdue if its due date has passed (`dueDate < Date.now()`) and its status is not `Done`.

4. **Optimistic Concurrency Control (OCC)**:
   - Built-in conflict detection: each task maintains a `version` number.
   - When conflicting edits occur (e.g. two users editing the same task simultaneously), the second update is rejected with a `409 Conflict` error.
   - The UI presents a clear conflict alert with a one-click button to reload the latest changes, preventing silent overwrites.

5. **Collaboration & Activity History**:
   - Task comment thread with author avatars, timestamps, and permissions (members can delete their own comments; owners can delete any comment).
   - Chronological project audit trail logging task creations, deletions (preserving title), status changes (recording previous and new values), assignment transitions, and team membership events.

6. **Project Dashboard**:
   - Whole-project statistics: Total tasks, task counts grouped by status, overdue task count, and tasks assigned to the current user.
   - 10 most recent activity audit entries.
   - Independent of table pagination.

---

## 🚀 Quick Start (Frontend-Only / Standalone)

TeamFlow includes an embedded client-side mock storage engine with pre-seeded demo data that persists to browser `localStorage`. **No external backend, Node server, or MongoDB installation is required to run and test the complete application!**

### 1. Install Dependencies
```bash
npm install
# or inside frontend directory:
cd frontend && npm install
```

### 2. Run the Development Server
```bash
npm run dev
# or:
cd frontend && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Demo Accounts (Pre-Seeded)

All demo accounts use the password: `Password123!` (or click any demo account pill on the login screen for 1-click login):

| User | Email | Role in Projects |
| :--- | :--- | :--- |
| **Alice Johnson** | `alice@example.com` | **Owner** of *TeamFlow Core Platform*, **Member** of *Mobile App Redesign* |
| **Bob Smith** | `bob@example.com` | **Owner** of *Mobile App Redesign*, **Member** of *TeamFlow Core Platform* |
| **Charlie Davis** | `charlie@example.com` | **Member** of both projects |
| **Dana Lee** | `dana@example.com` | **Member** of *Mobile App Redesign* |

### Pre-Seeded Projects:
1. **TeamFlow Core Platform** (18 tasks across Backlog, To Do, In Progress, Done; overdue tasks; comments; activity logs).
2. **Mobile App Redesign** (12 tasks across various statuses and priorities).

---

## 🧪 Running Tests

### Frontend Tests (Vitest + React Testing Library)
Tests task creation in the modal and verifying that the task appears in the Kanban board:
```bash
npm run test:frontend
# or:
cd frontend && npm test
```

### Backend Integration Tests (Jest + Supertest + In-Memory MongoDB)
The repository also includes a complete Express REST backend with an isolated in-memory test database:
```bash
npm run test:backend
# or:
cd backend && npm test
```

### Run All Tests:
```bash
npm test
```

---

## 📐 Architecture & Design Decisions

### 1. Authentication & Session Invalidation
- Authentication uses token-based identity verification.
- To prevent reuse of authenticated sessions after logout, tokens are paired with active session records in the database / local store.
- Upon logout, the session is explicitly invalidated, and subsequent requests with the same token return `401 Unauthorized`.

### 2. Optimistic Concurrency Control (OCC)
- Every task document tracks an integer `version` field (starting at 1).
- Every update request must provide the client's current `version`.
- If the incoming version does not match the database version, the system rejects the update with a `409 Conflict`, returning the latest task snapshot.
- On a successful mutation, `version` is incremented by 1.

### 3. Date & Timezone Handling
- All timestamps (`createdAt`, `updatedAt`, `dueDate`, `timestamp`) are created, transferred, and stored in **ISO 8601 UTC** format (`YYYY-MM-DDTHH:mm:ss.sssZ`).
- The client converts UTC timestamps to the user's localized time zone upon rendering using `date-fns` and native browser APIs.
- A task is identified as **overdue** if `task.dueDate && new Date(task.dueDate).getTime() < Date.now() && task.status !== 'Done'`.

### 4. Consistency Between Task Mutations and Activity History
- Activity log records are generated on the server only after a database mutation succeeds.
- When an update fails validation or encounters an OCC conflict, no activity record is created.
- When a task is deleted, the task's title is explicitly preserved in the `Activity` record (`taskTitle`) so that the project activity feed retains a human-readable audit log without orphan references.

---

## 📁 Repository Structure

```
TeamFlow/
├── frontend/                     # Next.js App Router Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/login/     # Login page with 1-click demo pills
│   │   │   ├── (auth)/register/  # Registration page
│   │   │   ├── projects/         # Projects list & creation
│   │   │   ├── projects/[id]/    # Project workspace (Tabs: Dashboard, Board, Table, Members, Activity)
│   │   │   ├── layout.tsx        # Root layout with AuthProvider
│   │   │   └── page.tsx          # Smart root redirect
│   │   ├── components/           # KanbanBoard, TaskTable, TaskModal, DashboardView, MembersTab, ActivityTab, ConfirmModal, ConflictModal
│   │   ├── context/              # AuthContext & useAuth hook
│   │   ├── lib/                  # api client & mockStorage standalone database
│   │   ├── types/                # Shared TypeScript models
│   │   └── tests/                # Vitest & React Testing Library suites
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.ts
├── backend/                      # Node.js + Express + TypeScript REST API
│   ├── src/                      # Controllers, models, middleware, routes, services
│   ├── tests/                    # 8 Supertest integration suites (41 tests, 100% pass)
│   ├── scripts/seed.ts           # Standalone MongoDB seed script
│   └── package.json
├── AI_USAGE.md                   # AI tool usage declaration & verification notes
├── postman_collection.json       # Exported Postman API collection
├── package.json                  # Workspace script runner
└── README.md
```

---

## ⏱️ Effort & Time Spent

- **Architecture & Schema Planning**: ~2 hours
- **Frontend Components & Next.js App Router**: ~7 hours
- **Kanban Board, Filters, URL Synchronization & OCC**: ~4 hours
- **Backend API & In-Memory Database Fallback**: ~4 hours
- **Automated Integration & Unit Testing**: ~3 hours
- **Documentation, AI Usage Declaration & Verification**: ~2 hours
- **Total Effort**: ~22 hours (within the 18–24 hour expected range).

---

## 📹 Live Demonstration Outline (5-8 Minutes)

When presenting the application:
1. **Overview & Tech Stack (1 min)**: Next.js App Router, TypeScript, Tailwind CSS, OCC, responsive layouts.
2. **Authentication & Session Revocation (1 min)**: Demonstrate login with Alice, logout, and token revocation preventing reuse.
3. **Projects & Role Permissions (1.5 min)**: Show Owner privileges (Alice adding a member, assigning tasks) vs Member limitations (Charlie cannot edit other users' tasks or reassign).
4. **Task Views & Filtering (1.5 min)**:
   - Demonstrate the Kanban board with drag/status dropdown changes.
   - Demonstrate Table view with title search, priority/status filters, overdue toggle, and URL parameter persistence.
5. **Conflict Handling (OCC) (1 min)**: Demonstrate two simultaneous edits on the same task triggering the 409 Conflict alert and reloading the latest state.
6. **Activity Trail & Member Removal (1 min)**: Show removal of a member clearing their task assignments, and review the preserved activity history.
