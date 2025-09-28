# DEPLOY.md — Notes App (Minimal)

This is a tiny, copy‑friendly deployment guide for Vercel (frontend) + Render/Railway (backend). No secrets here.

---

## Backend → Render (or Railway)

**Repo/Path:** `server/`

**Build:** `npm install`  
**Start:** `npm start` (or `node src/index.js`)

**Environment Variables (required):**
```
# Render will inject PORT; your app must use process.env.PORT
CLIENT_URL=https://<your-vercel-domain>          # exact origin for CORS & cookies
MONGO_URL=mongodb+srv://<user>:<pass>@<host>/notesapp?retryWrites=true&w=majority
JWT_SECRET=<long-random-string>
COOKIE_NAME=token
NODE_ENV=production
```

**CORS & Cookies:**
- Server uses `cors({ origin: CLIENT_URL, credentials: true })`.
- Cookie is HTTP‑only, `sameSite: 'lax'`, `secure: true` in production.
- Ensure your backend is **HTTPS** and `CLIENT_URL` matches Vercel origin exactly.

---

## Frontend → Vercel

**Repo/Path:** `client/`

**Build Command:** `npm run build`  
**Output Directory:** `dist`

**Environment Variable (required):**
```
VITE_API_URL=https://<your-backend-domain>
```

Deploy, then visit your Vercel URL.

---

## Smoke Test (Production)

1. Open frontend URL → **Signup** a user (or Login).
2. Header shows **Hi, your‑name**.
3. **Create** a note → appears in list.
4. Refresh page → note persists (Mongo).
5. **Edit** the note → changes visible.
6. **Search** and **tag filter** behave as expected.
7. **Logout** → calling `/api/notes` returns **401**.

---

## Common Pitfalls

- **401 in prod:** `CLIENT_URL` (backend) and `VITE_API_URL` (frontend) mismatch or http→https.  
- **Mongo auth failed:** wrong user/pass or special chars in password not URL‑encoded (`@` → `%40`, etc.).  
- **Cookie missing:** make sure fetch uses `credentials: 'include'` (already handled) and backend is on HTTPS.  
- **CORS errors:** `CLIENT_URL` must equal your deployed frontend origin exactly.
