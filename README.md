# Ethara — Team Task Manager

A full-stack team task management application built with a Go backend and a Next.js frontend. Teams can create projects, assign tasks, track completion progress, and collaborate with role-based membership.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [API Reference](#api-reference)
- [Frontend Overview](#frontend-overview)
- [Data Models](#data-models)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Language | Go 1.25 |
| HTTP Framework | [Gin](https://github.com/gin-gonic/gin) |
| ORM | [GORM](https://gorm.io) with PostgreSQL driver |
| Database | PostgreSQL 15 |
| Auth | JWT (`golang-jwt/jwt/v5`) |
| Config | Viper (env vars + optional `.env` file) |
| CORS | `gin-contrib/cors` |

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.7 |
| Styling | Tailwind CSS v4 |
| UI Components | Radix UI primitives + shadcn/ui |
| Server State | TanStack React Query v5 |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios |
| Notifications | Sonner |
| Icons | Lucide React |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Next.js Frontend                    │
│                                                         │
│  App Router pages  →  React Query hooks  →  Services    │
│  (app/(dashboard))    (hooks/queries/)     (services/)  │
│                              │                          │
│                         Axios client                    │
│                    (lib/api/client.ts)                  │
└──────────────────────────────┬──────────────────────────┘
                               │ HTTP / JSON
                               ▼
┌─────────────────────────────────────────────────────────┐
│                      Go API Server                      │
│                                                         │
│  Gin Router  →  Handlers  →  Services  →  Repositories  │
│  (cmd/api)     (internal/)  (internal/)  (internal/)    │
│                              │                          │
│                           GORM ORM                      │
└──────────────────────────────┬──────────────────────────┘
                               │
                               ▼
                        PostgreSQL 15
```

The backend follows a clean layered architecture: HTTP handlers delegate to service objects that contain business logic, which in turn call repository functions that interact with the database via GORM. The frontend uses React Query for all server state — every mutation invalidates and immediately refetches the relevant query keys so the UI stays in sync without manual polling.

---

## Project Structure

```
ethara/
├── cmd/
│   └── api/
│       └── main.go              # Entry point — wires up router, DI, graceful shutdown
├── internal/
│   ├── auth/
│   │   └── handler.go           # POST /signup, POST /login
│   ├── dashboard/
│   │   └── handler.go           # GET /api/dashboard
│   ├── project/
│   │   └── handler.go           # Project CRUD + member management
│   ├── task/
│   │   └── handler.go           # Task CRUD
│   ├── middleware/
│   │   └── auth_middleware.go   # JWT validation for protected routes
│   ├── model/                   # GORM model structs (User, Project, Task, ProjectMember)
│   ├── dto/                     # Request/response data transfer objects
│   ├── service/                 # Business logic layer
│   └── repository/              # Database access layer
├── pkg/
│   ├── config/
│   │   └── config.go            # Viper-based config loader
│   ├── response/
│   │   └── response.go          # Standardised JSON response helpers
│   └── validator/
│       └── validator.go         # Request validation utilities
├── frontend/
│   ├── app/                     # Next.js App Router pages
│   │   ├── (auth)/              # Login & signup (unauthenticated layout)
│   │   └── (dashboard)/         # Protected app pages
│   │       ├── dashboard/       # Analytics overview
│   │       ├── projects/        # Project cards grid
│   │       └── tasks/           # Task table with filters
│   ├── components/
│   │   ├── auth/                # Login & signup forms
│   │   ├── common/              # EmptyState, ErrorFallback, LoadingSpinner
│   │   ├── dashboard/           # AnalyticsCards, DashboardSkeleton
│   │   ├── layout/              # MainLayout, Navbar, Sidebar, UserMenu
│   │   ├── projects/            # ProjectCard, CreateProjectModal, AddMemberModal
│   │   ├── tasks/               # TaskTable, CreateTaskModal, TaskFilters
│   │   └── ui/                  # shadcn/ui primitives (Button, Card, Dialog, …)
│   ├── hooks/
│   │   └── queries/             # React Query hooks (useProjects, useTasks, useDashboard, useAuth)
│   ├── services/                # Axios service modules (projects, tasks, dashboard, auth)
│   ├── types/                   # TypeScript interfaces (Project, Task, DashboardStats, …)
│   ├── lib/
│   │   ├── api/
│   │   │   └── client.ts        # Axios instance with JWT interceptor
│   │   └── constants.ts         # API endpoint map, token keys, status enums
│   └── package.json
├── docker-compose.yml           # Local PostgreSQL container
└── go.mod
```

---

## Getting Started

### Prerequisites

- **Go** 1.21 or later
- **Node.js** 18 or later (LTS recommended)
- **Docker** (for the local PostgreSQL container) — or a running PostgreSQL 15 instance

### Environment Variables

#### Backend (`.env` in the repo root)

```env
APP_PORT=8080

DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=password
DB_NAME=teamtaskdb
DB_SSLMODE=disable

JWT_SECRET=your-super-secret-key-change-in-production
```

#### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_ROOT_API_URL=http://localhost:8080
```

### Running Locally

**1. Start the database**

```bash
docker compose up -d
```

This starts a PostgreSQL 15 container on port `5432` with the credentials from `docker-compose.yml`. GORM will auto-migrate all tables on first boot.

**2. Start the backend**

```bash
# From the repo root
go run ./cmd/api/main.go
```

The API server starts on `http://localhost:8080`. You should see:

```
Database connected successfully
Database migrated successfully
Server running on port 8080
```

**3. Start the frontend**

```bash
cd frontend
npm install
npm run dev
```

The Next.js dev server starts on `http://localhost:3000`.

---

## API Reference

All routes under `/api/*` require a `Bearer <token>` `Authorization` header obtained from `/login`.

### Auth

| Method | Path | Description |
|---|---|---|
| `POST` | `/signup` | Register a new user |
| `POST` | `/login` | Authenticate and receive a JWT |

**POST /signup**
```json
{ "name": "Alice", "email": "alice@example.com", "password": "secret123" }
```

**POST /login**
```json
{ "email": "alice@example.com", "password": "secret123" }
```
Returns `{ "token": "<jwt>" }`.

---

### Projects

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/projects` | List all projects the user belongs to |
| `POST` | `/api/projects` | Create a new project |
| `POST` | `/api/projects/:id/members` | Add a member to a project |

**POST /api/projects**
```json
{ "name": "Website Redesign", "description": "Q3 redesign initiative" }
```

**POST /api/projects/:id/members**
```json
{ "email": "bob@example.com", "role": "MEMBER" }
```
Valid roles: `ADMIN`, `MEMBER`.

---

### Tasks

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/tasks` | List tasks (filterable by `project_id`, `status`, `assigned_to`) |
| `POST` | `/api/tasks` | Create a new task |
| `PATCH` | `/api/tasks/:id` | Update a task (status, title, assignee, due date) |
| `DELETE` | `/api/tasks/:id` | Delete a task |

**POST /api/tasks**
```json
{
  "title": "Design mockups",
  "description": "Figma wireframes for the new dashboard",
  "project_id": "<uuid>",
  "assigned_to": "<user-uuid>",
  "due_date": "2025-09-01"
}
```

**PATCH /api/tasks/:id**
```json
{ "status": "done" }
```
Valid statuses: `todo`, `in_progress`, `done`.

---

### Dashboard

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/dashboard` | Aggregate stats + per-project progress |

Response shape:
```json
{
  "total_tasks": 12,
  "completed_tasks": 5,
  "overdue_tasks": 2,
  "assigned_to_me": 4,
  "project_progress": [
    {
      "project_id": "<uuid>",
      "project_name": "Website Redesign",
      "total_tasks": 8,
      "completed_tasks": 3,
      "progress": 37.5
    }
  ]
}
```

---

### User

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/me` | Returns the authenticated user's ID and email |

---

## Frontend Overview

### React Query Cache Strategy

The frontend uses TanStack React Query with three primary query keys:

| Key | Data | staleTime |
|---|---|---|
| `['projects']` | Project list with task counts and members | 10 seconds |
| `['tasks', filters]` | Filtered task list | 5 minutes |
| `['dashboard']` | Aggregate stats and project progress | 10 seconds |

**Cache invalidation rules** — every mutation that changes task or member data invalidates and immediately refetches both `['projects']` and `['dashboard']`. This ensures the task completion bar and member count on project cards update in real time, even when `getProjects` falls back to the `/api/dashboard` endpoint.

**Optimistic updates** — `useAddProjectMember` applies an optimistic member entry to the `['projects']` cache before the request completes, giving instant visual feedback. On error the cache is rolled back to the pre-mutation snapshot.

### Key Hooks

| Hook | File | Purpose |
|---|---|---|
| `useProjects` | `hooks/queries/useProjects.ts` | Fetch project list |
| `useCreateProject` | `hooks/queries/useProjects.ts` | Create project + invalidate cache |
| `useAddProjectMember` | `hooks/queries/useProjects.ts` | Add member with optimistic update |
| `useTasks` | `hooks/queries/useTasks.ts` | Fetch tasks with optional filters |
| `useCreateTask` | `hooks/queries/useTasks.ts` | Create task + refetch projects & dashboard |
| `useUpdateTask` | `hooks/queries/useTasks.ts` | Update task status + refetch projects & dashboard |
| `useDashboardStats` | `hooks/queries/useDashboard.ts` | Fetch dashboard aggregate stats |

### Projects Service Fallback

`projectsService.getProjects()` first tries `GET /api/projects`. If the backend returns 404 it falls back to `GET /api/dashboard` and derives the project list from the `project_progress` array. This means task count data on project cards is always sourced from the same endpoint as the dashboard stats, so invalidating `['dashboard']` on task mutations keeps both views consistent.

---

## Data Models

### User
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | string | |
| `email` | string | Unique |
| `password_hash` | string | bcrypt |
| `created_at` | timestamp | |

### Project
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | string | |
| `description` | string | Optional |
| `created_by` | UUID | FK → User |
| `created_at` | timestamp | |

### ProjectMember
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK → User |
| `project_id` | UUID | FK → Project |
| `role` | string | `ADMIN` or `MEMBER` |
| `joined_at` | timestamp | |

### Task
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `title` | string | |
| `description` | string | Optional |
| `status` | string | `todo`, `in_progress`, `done` |
| `project_id` | UUID | FK → Project |
| `assigned_to` | UUID | FK → User, nullable |
| `created_by` | UUID | FK → User |
| `due_date` | timestamp | Nullable |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

---

## Development Workflow

```bash
# Backend — run with live reload (requires air)
air

# Backend — run directly
go run ./cmd/api/main.go

# Frontend — development server
cd frontend && npm run dev

# Frontend — production build
cd frontend && npm run build && npm start

# Frontend — lint
cd frontend && npm run lint
```

### Adding a New API Endpoint

1. Add the route constant to `frontend/lib/constants.ts` under `API_ENDPOINTS`.
2. Create or extend a service function in `frontend/services/`.
3. Add a React Query hook in `frontend/hooks/queries/`.
4. Implement the handler in `internal/<domain>/handler.go`.
5. Register the route in `cmd/api/main.go`.

---

## Deployment

The application is deployed on [Railway](https://railway.app).

- **Backend service**: Go binary, reads config from Railway environment variables.
- **Frontend service**: Next.js, set `NEXT_PUBLIC_API_URL` to the backend Railway service URL.
- **Database**: Railway PostgreSQL plugin (or any managed PostgreSQL instance).

### Required Environment Variables in Production

**Backend**
```
APP_PORT        (Railway sets PORT automatically — the app reads PORT first)
DB_HOST
DB_PORT
DB_USER
DB_PASSWORD
DB_NAME
DB_SSLMODE=require
JWT_SECRET
```

**Frontend**
```
NEXT_PUBLIC_API_URL=https://<backend-service>.up.railway.app/api
NEXT_PUBLIC_ROOT_API_URL=https://<backend-service>.up.railway.app
```

---

## Troubleshooting

**`Failed to connect database` on startup**
Verify your `DB_*` environment variables match the running PostgreSQL instance. If using Docker Compose locally, ensure the container is healthy with `docker compose ps`.

**`401 Unauthorized` on all API calls**
The JWT has expired or the `JWT_SECRET` on the backend doesn't match the one used to sign the token. Clear `localStorage` in the browser and log in again.

**Project cards show stale task counts**
This was a known issue where the `['dashboard']` cache wasn't invalidated on task mutations. It is fixed — both `['projects']` and `['dashboard']` are now invalidated and immediately refetched after every task create/update/delete.

**Member count doesn't update immediately after adding a member**
Also fixed. `useAddProjectMember` now applies an optimistic update to the `['projects']` cache before the request completes, and forces a refetch on success.

**`CORS` errors in the browser**
Ensure the frontend origin is listed in the `AllowOrigins` slice in `cmd/api/main.go`. For local development `http://localhost:3000` is already included.

**`next: command not found` after `npm install`**
Run `npm install` from inside the `frontend/` directory, not the repo root.

---

## Contributing

1. Fork the repository and create a feature branch from `main`.
2. Follow the existing code style — Go standard formatting (`gofmt`), TypeScript strict mode.
3. Keep mutations and their cache invalidation logic co-located in the relevant React Query hook file.
4. Open a pull request with a clear description of what changed and why.
