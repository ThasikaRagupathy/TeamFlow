# 🚀 TeamFlow

### Team Project Management & Collaboration Platform

TeamFlow is a modern full-stack team project management platform designed to help teams **organise projects, manage tasks, collaborate efficiently, and track progress** from one central workspace.

It provides a clean, responsive interface with secure authentication, project management, task tracking, comments, and a modern dashboard experience.

---

## ✨ Features

### 🔐 Authentication
- User registration and login
- Secure authentication
- Session management
- Protected application routes
- Automatic authentication-based redirection
- Password validation

### 📁 Project Management
- Create and manage projects
- View project details
- Organise projects in a central workspace
- Track project progress
- Manage project-related activities

### ✅ Task Management
- Create and assign tasks
- Update task status
- Track task progress
- Organise tasks within projects
- Manage task information efficiently

### 💬 Team Collaboration
- Add comments to project/task activities
- Support team communication
- Keep project discussions organised

### 📊 Dashboard
- Overview of projects
- Task progress tracking
- Team activity
- Quick access to important project information

### 🎨 Modern UI
- Responsive design
- Premium dark TeamFlow interface
- Glassmorphism-inspired components
- Gradient accents
- Smooth animations
- Accessible focus states
- Responsive layouts for different screen sizes

### 🛡️ Backend & Security
- RESTful API architecture
- MongoDB database integration
- Express.js backend
- CORS configuration
- Helmet security middleware
- API rate limiting
- Request logging with Morgan
- Centralised error handling
- Environment-based configuration

---

# 🛠️ Tech Stack

## Frontend

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Lucide React**
- **Next.js App Router**

## Backend

- **Node.js**
- **Express.js**
- **TypeScript**
- **REST API**

## Database

- **MongoDB**
- **Mongoose**

## Development Tools

- **Git**
- **GitHub**
- **npm**
- **ESLint**
- **VS Code**

---

# 🏗️ Project Architecture

```text
TeamFlow/
│
├── frontend/
│   ├── app/
│   │   ├── login/
│   │   ├── register/
│   │   ├── projects/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │
│   ├── context/
│   │   └── AuthContext.tsx
│   │
│   └── ...
│
├── backend/
│   ├── config/
│   │   └── db.ts
│   │
│   ├── controllers/
│   │
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   └── rateLimiter.ts
│   │
│   ├── models/
│   │
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── projectRoutes.ts
│   │   ├── taskRoutes.ts
│   │   └── commentRoutes.ts
│   │
│   ├── app.ts
│   └── server.ts
│
└── README.md
