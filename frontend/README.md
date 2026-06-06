# AI Kitchen Hero — Frontend README

AI Kitchen Hero is a modern web application that helps you manage your smart refrigerator contents and discover recipe ideas powered by AI. Built with React, Vite, and Tailwind CSS, it delivers a fast, responsive, mobile-first experience that scales from small screens to desktops.

This README documents the frontend project that interacts with a FastAPI backend and a Supabase data store to orchestrate fridge data, recipe generation, and vision-based ingredient recognition.

## 1) Project Overview
- Purpose: Manage fridge items, generate AI-driven recipes, and visualize ingredients using a camera or uploaded images.
- Tech stack: React, Vite, Tailwind CSS, React Context API for state management, and a clean API surface consumed from a separate backend service.
- Design goal: Provide a smooth, delightful user experience for home cooks and meal planners.

## 2) Design Philosophy (UI/UX Focus)
- Dominant green color: Symbolizes freshness and healthy food, creating a calm, confident user experience for kitchen tasks.
- Tailwind CSS: Enables consistent aesthetics across components and pages.
- Mobile-first design: Prioritizes small screens with scalable layouts; designed with support from design tools like Figma Auto Layout to ensure polish on all devices.
- Clear information architecture: State is managed via dedicated contexts to avoid prop drilling and improve maintainability.

## 3) Key Features & Demo Workflow
Describe the user journey to make the demo video easy to understand:
- Step 1: Capture or upload an image of ingredients. The image is sent to the backend Vision service for recognition.
- Step 2: The backend analyzes the image, extracts ingredients, and stores them in Supabase.
- Step 3: The user taps “Generate Recipe” to request AI-generated recipe suggestions. The backend coordinates the AI workflow and returns recipe options.

## 4) Technical Architecture
- Tech Stack: React, Tailwind CSS, React Context API.
- Flow: React Frontend -> FastAPI Backend -> Supabase Database.
- State Management:
  - FridgeContext handles fridge items and their state and syncing with Supabase.
  - RecipeContext manages generated recipes and any associated metadata.
- Backend Connection: The frontend is decoupled from the backend. API calls are made via environment-configured endpoints, enabling easy deployment and flexibility.

## 5) Environment Configuration
Detailed instructions on setting up the .env file in the /kitchen-hero directory:
- Create a .env file at kitchen-hero/.env (do not commit this to GitHub).
- Essential variables (prefixed with VITE_ for the Vite frontend):
  - VITE_API_URL: URL to the FastAPI backend (e.g., http://localhost:8000 or a deployed URL)
  - VITE_SUPABASE_URL: Your Supabase project URL
  - VITE_SUPABASE_ANON_KEY: Supabase anon/public key (for client-side access to public data)
- If you need a more restricted access pattern, you can also use VITE_SUPABASE_SERVICE_KEY for server-side operations via the backend, but this is typically not exposed to the frontend.
- Do not commit the real keys. Use a sample file (example.env) as a template.

Note: The repo contains kitchen-hero/.env (example values may be present in a template). Create your own .env with real keys following the above structure.

## 6) Deployment & Running
- Install dependencies: npm install
- Start the development server: npm run dev
- Deployment: This frontend is designed to be deployed together with the backend on a platform like Vercel. Ensure the environment variables are configured in the deployment settings (Vercel Project Settings).

7) Project Layout (high-level)
- src/ - React source code with pages and components such as AIChefPage, FridgePage, RecipesPage, DashboardPage, and AppLayout.
- src/context/ - AuthContext, FridgeContext, RecipeContext for state management.
- src/lib/ - Utility modules (supabase.ts, ai.ts) for API integration and helpers.
- supabase/ - Database schema and related resources used by the frontend if any.

8) Environment Reference (example)
- Create an example.env to help new developers understand required keys. Do not commit real keys.
- Example keys (do not copy into production):
  VITE_API_URL=http://localhost:8000
  VITE_SUPABASE_URL=https://xyz.supabase.co
  VITE_SUPABASE_ANON_KEY=example_anon_key

9) Licensing
- This project is released under the terms defined in the repository licenses.