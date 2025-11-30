# NexGuard Deployment Guide

## 1. Local Deployment (Docker)
To run the entire stack locally using Docker:

1.  Ensure Docker Desktop is running.
2.  Run:
    ```bash
    docker-compose up --build
    ```
3.  Access the app at `http://localhost`.

## 2. Frontend Deployment (Netlify/Vercel)
The frontend is a static React app (Vite).

### Netlify
1.  Connect your GitHub repository.
2.  Base directory: `packages/frontend`
3.  Build command: `npm run build`
4.  Publish directory: `packages/frontend/dist`
5.  **Environment Variables**:
    - `VITE_API_URL`: URL of your deployed backend (e.g., `https://nexguard-backend.up.railway.app`)

### Vercel
1.  Import project from GitHub.
2.  Root Directory: `packages/frontend`
3.  Framework Preset: Vite
4.  **Environment Variables**:
    - `VITE_API_URL`: Your backend URL.

## 3. Backend Deployment (Railway/Render)
The backend is a Node.js Express app with SQLite.

### Railway
1.  Connect GitHub repo.
2.  Root Directory: `packages/backend`
3.  Start Command: `npm start`
4.  **Environment Variables**:
    - `PORT`: `5000` (or let Railway assign one)
    - `GEMINI_API_KEY`: Your Google Gemini API Key.
    - `YACI_STORE_URL`: URL to Yaci DevKit (if accessible publicly) or leave blank to use simulation.
5.  **Persistence**:
    - Since we use SQLite (`audit.db`), data will be lost on redeploy unless you use a persistent volume.
    - *Recommendation for Production*: Switch `services/db.js` to use PostgreSQL (Railway provides a plugin) for true persistence.

## 4. Yaci DevKit (Blockchain)
For the hackathon, run Yaci DevKit locally or on a VPS.
- If local: Backend connects via `http://localhost:8080`.
- If VPS: Update `YACI_STORE_URL` in backend env.
