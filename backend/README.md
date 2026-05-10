# Backend - AI-Based Service Ticket Management System

## Overview

Backend API for the enterprise ticket management platform using Express.js, MySQL, JWT authentication, and Socket.IO.

## Setup

1. Copy `.env.example` to `.env`
2. Update database credentials and JWT secret
3. Run `npm install`
4. Create the database schema from `backend/db/schema.sql`
5. Start the server:
   - `npm run dev` for development
   - `npm start` for production

## API Routes

- `GET /api/health` - health check
- `POST /api/auth/register` - user registration
- `POST /api/auth/login` - user login
- `POST /api/auth/logout` - logout simulation
- `GET /api/users/me` - authenticated profile
- `PATCH /api/users/me` - update current profile
- `GET /api/users` - admin-only user list
- `GET /api/roles` - authenticated role list

## Notes

- Authentication uses JWT tokens in `Authorization: Bearer <token>` header
- Role-based permissions are enforced in middleware
- Public registration assigns the `User` role by default
- Socket.IO starts automatically when the server boots
