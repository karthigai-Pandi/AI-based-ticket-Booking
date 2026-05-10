# Frontend - AI-Based Service Ticket Management System

## Overview

React + Vite frontend for the enterprise service desk platform. Includes a modern dark-themed dashboard, authentication pages, and reusable UI components.

## Setup

1. Copy `.env.example` to `.env`
2. Update `VITE_API_URL` if needed
3. Run `npm install`
4. Start the dev server with `npm run dev`

## Available Scripts

- `npm run dev` - start development server
- `npm run build` - build production assets
- `npm run preview` - preview production build

## Notes

- Uses Tailwind CSS for styling
- `src/services/api.js` configures Axios
- Protected pages require `aiTicketToken` in localStorage
