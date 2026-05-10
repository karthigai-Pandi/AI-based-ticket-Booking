# AI-Based Service Ticket Management System

## Project Overview

Enterprise-grade service desk platform built with modern full-stack technologies.

- Frontend: React.js, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express.js, Socket.IO
- Database: MySQL
- Auth: JWT + bcrypt
- Real-time notifications, SLA dashboards, AI-assisted issue analysis

## Folder Structure

- `backend/`
  - `src/controllers/`
  - `src/models/`
  - `src/routes/`
  - `src/middleware/`
  - `src/utils/`

- `frontend/`
  - `src/components/`
  - `src/pages/`
  - `src/routes/`
  - `src/services/`
  - `src/hooks/`
  - `src/assets/`
  - `src/styles/`

## Next Steps

1. Define MySQL database schema
2. Setup backend project and install dependencies
3. Implement authentication and role-based access
4. Build dashboard UI and ticket CRUD

## Deployment

### Frontend (Vercel)

- Deploy the `frontend/` folder as a static site.
- Build command: `npm ci && npm run build`
- Output directory: `dist`
- Set environment variable: `VITE_API_URL=https://<backend-domain>/api`
- The repository includes `frontend/vercel.json` for SPA routing.

### Backend (Render)

- Deploy the `backend/` folder as a Node service.
- Build command: `npm ci`
- Start command: `npm start`
- Set required environment variables in Render: `JWT_SECRET`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `CORS_ORIGIN`

### Database (Railway MySQL)

- Create a Railway MySQL database.
- Add the Railway connection details to the backend service environment.
- Use `backend/db/schema.sql` to initialize the schema.

## Local Run

The application is now configured to run with SQLite for development when MySQL is not available.

1. Backend is running on `http://localhost:5000` with SQLite database
2. Frontend is running on `http://localhost:5174/`
3. Open `http://localhost:5174/` in your browser

### Testing Authentication

- Go to the registration page and create a new account
- Try logging in with the created credentials
- The app should now work without database connection errors

### Database

- Uses SQLite (`backend/data/dev.db`) when MySQL is unavailable
- Automatically creates tables and seeds default roles/departments
- All authentication and ticket functionality should work

You can also run both from the repo root with PowerShell:

- `./run-dev.ps1` 
users can also contibute 

## Environment Examples

- `frontend/.env.example`
- `backend/.env.example`

## Notes

This repository is being built module-wise per project requirements.
