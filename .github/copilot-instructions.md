# Copilot instructions for CyberZens repository

This file gives focused, actionable knowledge to an AI coding assistant so it becomes productive quickly in this repo.

1) Big picture
- Frontend: React app under `client/` (Create React App). Main entry is `client/src/index.js`, pages under `client/src/pages/` and reusable UI under `client/src/components/`.
- Backend: Express app under `server/`. Entry: `server/server.js` (ES modules, `type: module` in `server/package.json`). Database connect helper: `server/DB/connect.js`.
- Data & flows: API routes are mounted under `/api` from `server/routes/routes.js`. Report-related routes are in `server/routes/reportRoutes.js`. Controllers live in `server/controller/` (e.g. `UserController.js`, `reportController.js`) and models in `server/models/`.

2) How to run & debug
- Run server (dev):
  - Open a terminal, cd into `server` and run: `npm run dev` (uses `nodemon server.js`).
  - Server uses ES modules — files use `import`/`export` and `package.json` contains `"type": "module"`.
- Run client (dev):
  - cd into `client` and run: `npm start` (CRA default). The client `package.json` sets `proxy` to `http://localhost:5000`.
- Health check: `GET /health` implemented in `server/server.js`.

3) Key patterns & conventions (do not invent alternatives)
- Authentication: JWT-based middleware at `server/middleware/auth.js`. Requests need an `Authorization: Bearer <token>` header for protected endpoints (e.g. `GET /api/users/me`). The middleware stores user id on `req.userId` for controllers.
- File uploads: `server/middleware/upload.js` uses Multer — report creation uses `upload` middleware (see `router.post('/reports', upload, createReport)` in `server/routes/routes.js`).
- Database: `server/DB/connect.js` reads `process.env.MONGO_URL`. Controllers commonly check `mongoose.connection.readyState` for graceful fallback during dev.
- Controllers: Located in `server/controller/` and exported functions are used directly in routes. Example: `createReport` in `reportController.js`.
- Error handling: `server/server.js` contains a global error handler that returns JSON; prefer throwing errors in controllers and let the global handler format the response.

4) Data models (quick reference)
- User model: `server/models/UserName.js` — used by `UserController.js`.
- Report model: `server/models/Report.js` — used by `reportController.js` and routes under `/api/reports`.

5) Integration & external services
- Cloudinary config: `server/cloudinaryConfig.js` — used for report/image uploads.
- Environment variables: server expects at least `MONGO_URL` and `JWT_SECRET` in `.env` under `server/`.

6) Where to make common edits
- Add new API route: add controller in `server/controller/` and wire in `server/routes/*.js` then export via `server/routes/routes.js`.
- Add DB model: create file in `server/models/` and import in controllers.
- Add client page: add file in `client/src/pages/` and a route in `client/src/index.js` or `App.js` (follow existing router pattern).

7) Tests & linting
- This repo does not include a test harness or CI config. Use `client` CRA test runner or add simple Node/mocha scripts under `server/package.json` if needed.

8) Quick examples (copy-paste style)
- Fetch all reports from the client:
  axios.get('/api/reports/all')
- Protected request (server expects JWT):
  fetch('/api/users/me', { headers: { Authorization: `Bearer ${token}` } })

9) Project gotchas and tips
- `server` runs as ES modules — do not switch to CommonJS imports in server files unless you update `package.json`.
- Controllers include fallback behavior when DB is disconnected; this is useful for local UI development without a DB connection.
- The client uses `proxy` in `client/package.json` — when calling the API from the browser, use relative paths (e.g., `/api/...`) during development.

10) Good first small tasks for AI assistance
- Add a new `/api/messages` route and a `Message` model to support chat history (follow existing model/controller pattern found in `server/models/Report.js` and `server/controller/*`).
- Implement Socket.IO integration (if required) — add server `socket` initialization in `server/server.js` and keep it optional behind a feature flag or config so the server still runs if sockets are not used.

If any of these notes are unclear or you want more examples (e.g., exact shape of `Report` or `User` documents, or a suggested `Message` model), tell me which area to expand and I will iterate.
