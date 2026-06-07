# AI Kitchen Hero — Monorepo

This repository houses both the frontend and backend components for the AI Kitchen Hero project, deployed as a single monorepo on Vercel.

## Architecture Overview
- A single Git repository housing both frontend and backend apps with a monorepo strategy.
- Frontend: React + TypeScript + Vite + Tailwind CSS. Consumes the backend API whose base URL is configured in production via environment variables.
- Backend: FastAPI Python app coordinating with Supabase for data storage, user auth, and data orchestration; integrates AI services for recipe generation and vision processing.
- Database: Supabase (PostgreSQL) with Row-Level Security. The backend handles data operations; the frontend never talks to Supabase directly in production.
- AI integrations: OpenRouter Gemini (Gemma 4 31B) for recipe generation; Google Gemini Vision for vision tasks. Claude/Anthropic is not used in this setup.
- Deployment: Vercel monorepo deployment with a single root vercel.json routing API and frontend assets.

## Tech Stack
- Frontend: React 18, TypeScript, Vite, Tailwind CSS, React Context (AuthContext, FridgeContext, RecipeContext).
- Backend: FastAPI, Python, Supabase SDK, OpenRouter Gemini, Gemini Vision.
- Database: Supabase (PostgreSQL with RLS).
- Environment/config: .env.production for prod; .env.local for local development; Vercel environment variables for production.

## Setup / Installation
- Prerequisites: Node.js, npm, Python 3.x, pip, and a Vercel account.
- Backend setup: go to backend/, create a virtual environment, install dependencies, and run the API using uvicorn.
- Frontend setup: go to frontend/, run npm install, then npm run dev.
- Environment variables: do not commit secrets. Use the provided .env.example templates to set up local development environments.
- Production deployment: Vercel monorepo with a single root vercel.json.

## Deployment on Vercel (Monorepo)
- Create a single Vercel project at the repository root.
- Ensure root vercel.json routes all /api to the backend and serve the frontend from the root.
- Configure environment variables in Vercel: SUPABASE_URL, SUPABASE_SERVICE_KEY or SUPABASE_PUBLISHABLE_KEY, DATABASE_URL, OPENROUTER_API_KEY, GEMINI_API_KEY, APP_BASE_URL.
- Deploy and test health and UI on the Vercel domain:
- Health: https://ai-kitchen-hero.vercel.app/api/health
- Frontend: https://ai-kitchen-hero.vercel.app

## Key Features
- User signup/login (authentication, token-based access)
- Fridge item management with expiry tracking
- Vision-based ingredient recognition
- AI-generated recipes
- Supabase activity logs and data storage
- Production-grade deployment via Vercel

## Directory Layout (high level)
- Root
  - backend/        (FastAPI API and auth)
  - frontend/       (React app)
  - api/            (Wrapper to load backend app in production)
  - vercel.json     (Deployment config)
  - requirements.txt (Backend dependencies)

Notes
- This document is a starter template and should be updated as the project evolves.
