# Task Management System (Full-Stack Assessment)

This repository implements **Track A: Full-Stack** from the Software Engineering assessment: a **Node.js + TypeScript** backend with **PostgreSQL** (via **Prisma**), plus a **Next.js (App Router) + TypeScript** web client. Users can **register, log in, and manage their own tasks** (create, list with pagination/filter/search, read, update, delete, and advance status).

The UI product name in the app is **TaskFlow**.

## Links

| Resource | URL |
|----------|-----|
| **Live app** (Next.js) | [task-crud-assignment.vercel.app](https://task-crud-assignment.vercel.app/) |
| **API** (Node.js backend) | [task-crud-wwey.onrender.com](https://task-crud-wwey.onrender.com) — OpenAPI UI: [`/docs`](https://task-crud-wwey.onrender.com/docs), health: [`/health`](https://task-crud-wwey.onrender.com/health) |
| **Repository** | [github.com/deveshcse/task-crud-assignment](https://github.com/deveshcse/task-crud-assignment) |

## Repository layout

| Path | Role |
|------|------|
| [`task-crud-server/`](./task-crud-server/) | REST API (Express 5), Prisma, JWT auth, Swagger docs |
| [`task-crud-client/`](./task-crud-client/) | Next.js 16 frontend, React Query, forms, toasts |
| [`screenshots/`](./screenshots/) | UI screenshots referenced below |

## Assessment coverage

### Backend (mandatory)

- **Authentication:** `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `POST /api/v1/auth/refresh`, `POST /api/v1/auth/logout`
- **JWT:** Short-lived **access token** (Bearer) and **refresh token** (httpOnly cookie on register/login; refresh accepts body or cookie). Refresh token is stored in the database as a **bcrypt hash** (raw token never persisted).
- **Passwords:** Hashed with **bcrypt** before storage.
- **Tasks (user-scoped):** `GET/POST /api/v1/tasks`, `GET/PATCH/DELETE /api/v1/tasks/:id`, `PATCH /api/v1/tasks/:id/toggle`
- **`GET /tasks` list:** **Pagination** (`page`, `limit`), **filter** by `status`, **search** by title (`search`, case-insensitive).
- **ORM:** Prisma · **Validation / errors:** Zod + consistent JSON errors and HTTP status codes (400, 401, 404, 409, etc.).

### Frontend (Track A)

- **Auth pages:** Login and registration wired to the API; **access token** kept in an in-memory store and attached by Axios; **refresh** uses the httpOnly cookie (`withCredentials`) and an interceptor to renew the access token on 401.
- **Task dashboard:** Task table, **debounced search**, **status tabs**, **pagination**, loading and empty states.
- **CRUD UI:** Create/edit in a side sheet, delete with confirmation, status changes (including toggle-style flow). **Toasts** (Sonner) for success and error feedback.
- **Responsive layout** using Tailwind CSS and shared UI primitives (e.g. shadcn-style components).

### Beyond the brief (optional extras implemented)

- **Swagger UI** at `/docs` on the API server.
- **Forgot / reset password** flow (`/auth/forgot-password`, `/auth/reset-password`) with email via **Resend** (requires API key in env).
- **Task status rules:** Updates respect a one-way state machine; `toggle` advances **PENDING → IN_PROGRESS → DONE**.

## Tech stack

**Server:** Express 5 · TypeScript · Prisma 7 + PostgreSQL · Zod · JWT · bcrypt · Helmet · CORS · Pino · cookie-parser · Swagger  

**Client:** Next.js 16 (App Router, Turbopack dev) · React 19 · TypeScript · TanStack Query · Axios · React Hook Form · Zod · Tailwind CSS 4 · Radix UI · Lucide · Sonner · next-themes  

## Prerequisites

- **Node.js** (LTS recommended)
- **PostgreSQL** database
- **npm** (or compatible package manager)

## Environment variables

### Backend (`task-crud-server/.env`)

Create a `.env` file (see keys validated in `src/config/env.config.ts`):

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string (required) |
| `PORT` | API port (default `3000`) |
| `NODE_ENV` | `development` \| `production` \| `test` |
| `JWT_SECRET` | Signing secret for access tokens |
| `JWT_REFRESH_SECRET` | Signing secret for refresh tokens |
| `JWT_ACCESS_EXPIRES` | Access token TTL (e.g. `15m`) |
| `JWT_REFRESH_EXPIRES` | Refresh token TTL (e.g. `7d`) |
| `RESEND_API_KEY` | For transactional email (password reset) |
| `FRONTEND_URL` | Used in reset links (defaults to `http://localhost:5173`; set to your Next.js origin, e.g. `http://localhost:3001`, in local dev) |

### Frontend (`task-crud-client/.env`)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Base URL of the API including `/api/v1`, e.g. `http://localhost:3000/api/v1` or `https://task-crud-wwey.onrender.com/api/v1` for the deployed backend |

## Local setup

### 1. Database and API

```bash
cd task-crud-server
npm install
# Configure .env with DATABASE_URL and secrets
npx prisma migrate dev
npm run dev
```

- Health: `GET http://localhost:<PORT>/health`
- OpenAPI UI: `http://localhost:<PORT>/docs`

### 2. Web app

```bash
cd task-crud-client
npm install
# Set NEXT_PUBLIC_API_URL to match your API
npm run dev
```

Production builds: `npm run build` then `npm start` in each project.

If the API and Next.js both use port **3000**, run one of them on a different `PORT` / dev port and point `NEXT_PUBLIC_API_URL` at the API.

## API quick reference

Base path: **`/api/v1`**

**Auth**

| Method | Path | Notes |
|--------|------|--------|
| POST | `/auth/register` | Body: email, password, optional name. Sets refresh cookie; returns user + `accessToken` + `refreshToken` in JSON. |
| POST | `/auth/login` | Same response shape as register. |
| POST | `/auth/refresh` | Reads refresh token from **cookie** or optional body. Rotates refresh token. |
| POST | `/auth/logout` | **Bearer** required. Clears server-side refresh hash and cookie. |
| POST | `/auth/forgot-password` | Email reset request. |
| POST | `/auth/reset-password` | Token + new password. |

**Tasks** (all require **Bearer** access token)

| Method | Path | Notes |
|--------|------|--------|
| GET | `/tasks` | Query: `page`, `limit`, `status`, `search`. Returns `tasks`, `total`, `page`, `limit`, `totalPages`. |
| POST | `/tasks` | Create. |
| GET | `/tasks/:id` | Single task (must belong to user). |
| PATCH | `/tasks/:id` | Partial update; status transitions validated. |
| DELETE | `/tasks/:id` | Delete. |
| PATCH | `/tasks/:id/toggle` | Advance to next status in PENDING → IN_PROGRESS → DONE. |

Successful responses use:

```json
{ "success": true, "data": { ... } }
```

## Frontend routes (high level)

- `/` — landing
- `/login`, `/register` — authentication
- `/forgot-password`, `/reset-password` — password recovery
- `/tasks` — protected dashboard (task list and CRUD)

## Screenshots

All images live in [`screenshots/`](./screenshots/). Filenames contain parentheses; image URLs **encode** `(` as `%28` and `)` as `%29` so Markdown parsers do not treat `)` as the end of the image path (which was hiding images in preview and on GitHub).

### Index (quick reference)

| File | What it shows |
|------|----------------|
| [`Screenshot (93).png`](./screenshots/Screenshot%20%2893%29.png) | **TaskFlow** workspace: search, status filters, task table, pagination |
| [`Screenshot (94).png`](./screenshots/Screenshot%20%2894%29.png) | **Edit Task** side sheet (title, description, status, save) |
| [`Screenshot (95).png`](./screenshots/Screenshot%20%2895%29.png) | **Delete** confirmation dialog |
| [`Screenshot (96).png`](./screenshots/Screenshot%20%2896%29.png) | Workspace variant (table, filters, pagination) |
| [`Screenshot (97).png`](./screenshots/Screenshot%20%2897%29.png) | Workspace with **Next page** pagination tooltip |
| [`Screenshot (98).png`](./screenshots/Screenshot%20%2898%29.png) | Workspace with **Edit Task** tooltip on row action |
| [`Screenshot (99).png`](./screenshots/Screenshot%20%2899%29.png) | Workspace with **Delete Task** tooltip on row action |
| [`Screenshot (100).png`](./screenshots/Screenshot%20%28100%29.png) | Status column **dropdown** (Pending / In Progress / Done) |
| [`Screenshot (101).png`](./screenshots/Screenshot%20%28101%29.png) | **Create New Task** sheet (**Create** / **Create & Close**) |
| [`Screenshot (102).png`](./screenshots/Screenshot%20%28102%29.png) | **Login** page |
| [`Screenshot (103).png`](./screenshots/Screenshot%20%28103%29.png) | **Register** — create account form |
| [`Screenshot (104).png`](./screenshots/Screenshot%20%28104%29.png) | **Landing** page — hero, Get Started / Sign In, feature cards |
| [`Screenshot (105).png`](./screenshots/Screenshot%20%28105%29.png) | **Forgot password** — request reset link |
| [`Screenshot (141).png`](./screenshots/Screenshot%20%28141%29.png) | **Check your email** — post–forgot-password confirmation |
| [`Screenshot (146).png`](./screenshots/Screenshot%20%28146%29.png) | **Reset password** page (token in query string) |
| [`Screenshot (188).png`](./screenshots/Screenshot%20%28188%29.png) | Login with **success toast** after password reset |
| [`Screenshot (189).png`](./screenshots/Screenshot%20%28189%29.png) | Login with **error toast** (invalid credentials) |
| [`Screenshot (191).png`](./screenshots/Screenshot%20%28191%29.png) | **Empty** workspace / no matches state |

### Embedded gallery

![Screenshot (93) — task dashboard](./screenshots/Screenshot%20%2893%29.png)

![Screenshot (94) — edit task](./screenshots/Screenshot%20%2894%29.png)

![Screenshot (95) — delete confirm](./screenshots/Screenshot%20%2895%29.png)

![Screenshot (96) — workspace](./screenshots/Screenshot%20%2896%29.png)

![Screenshot (97) — pagination tooltip](./screenshots/Screenshot%20%2897%29.png)

![Screenshot (98) — edit tooltip](./screenshots/Screenshot%20%2898%29.png)

![Screenshot (99) — delete tooltip](./screenshots/Screenshot%20%2899%29.png)

![Screenshot (100) — status dropdown](./screenshots/Screenshot%20%28100%29.png)

![Screenshot (101) — create task sheet](./screenshots/Screenshot%20%28101%29.png)

![Screenshot (102) — login](./screenshots/Screenshot%20%28102%29.png)

![Screenshot (103) — register](./screenshots/Screenshot%20%28103%29.png)

![Screenshot (104) — landing page](./screenshots/Screenshot%20%28104%29.png)

![Screenshot (105) — forgot password](./screenshots/Screenshot%20%28105%29.png)

![Screenshot (141) — check your email](./screenshots/Screenshot%20%28141%29.png)

![Screenshot (146) — reset password](./screenshots/Screenshot%20%28146%29.png)

![Screenshot (188) — success toast](./screenshots/Screenshot%20%28188%29.png)

![Screenshot (189) — error toast](./screenshots/Screenshot%20%28189%29.png)

![Screenshot (191) — empty state](./screenshots/Screenshot%20%28191%29.png)
