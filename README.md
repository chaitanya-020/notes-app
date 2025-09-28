# Notes App — Quick Start (Minimal)

A small full‑stack Notes app with React + Vite + Tailwind (frontend), Express + Mongoose (backend), and MongoDB Atlas. Auth uses a JWT in an HTTP‑only cookie.

> For deployment/env notes, see **[DEPLOY.md](./DEPLOY.md)**.

---

## Prerequisites
- Node.js 18+ and npm
- A MongoDB Atlas cluster + database user
- Two terminals (one for server, one for client)

---

## 1) Backend (server)

```bash
cd server
npm install
```

Create `server/.env` (no quotes):
```ini
PORT=4000
CLIENT_URL=http://localhost:5173
MONGO_URL=<your Atlas URI ending with /notesapp>
JWT_SECRET=<any long random string>
COOKIE_NAME=token
NODE_ENV=development
```

Run the server:
```bash
npm run dev
# expect:
# ✅ Mongo connected
# 🚀 API listening on http://localhost:4000
```

Health check: open `http://localhost:4000/health` → `{ "status": "ok", ... }`

---

## 2) Frontend (client)

```bash
cd client
npm install
```

Create `client/.env.local`:
```ini
VITE_API_URL=http://localhost:4000
```

Run the dev server:
```bash
npm run dev
# open http://localhost:5173
```

Login/Signup, then create/edit/delete notes.
