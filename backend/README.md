# Kitchen Hero Backend

This directory hosts a Python FastAPI backend that coordinates AI-driven features and data orchestration with Supabase. The frontend calls these endpoints to perform AI generation, vision processing, and manage fridge/recipe data.

Architecture overview:
- FastAPI-based backend server exposing a clean API surface for the frontend.
- AI services integrated via:
  - OpenRouter (Gemma 4 31B) for recipe generation.
  - Google Gemini AI Studio for vision analysis (Scan) to minimize costs on Free Tier.
- Supabase is used as a data store and activity log; the backend directly reads/writes fridge_items and recipes using the Supabase Python SDK, acting as the data orchestration layer.
- This backend is designed to be deployed together with the frontend (e.g., on Vercel).

API Endpoints (current implementation):
- GET /health
  - Health check endpoint returning a simple status payload.
- POST /api/ai-chef/generate-recipes
  - Accepts ingredients/items and returns AI-generated recipes (via Gemma 4 31B).
- POST /api/vision/scan
  - Accepts an image (base64) and metadata to perform vision-based item recognition (via Gemini Vision).

Data CRUD Endpoints (planned/at design time):
- GET /api/fridge
- POST /api/fridge/add
- GET /api/recipes
- POST /api/recipes/save
- DELETE /api/recipes/{id}
- These endpoints would operate on Supabase tables fridge_items and recipes using the Supabase Python SDK. The current codebase primarily implements health and AI/vision; CRUD endpoints are part of the intended design roadmap.

Prerequisites & Setup:
- Python 3.8+ (or compatible Python 3.x runtime)
- Install dependencies: pip install -r backend/requirements.txt
- Environment variables (provide at runtime, e.g., via a .env file):
  - OPENROUTER_API_KEY: API key for OpenRouter (Gemma 4 31B) integration
  - GEMINI_API_KEY: API key for Google Gemini Vision integration
  - SUPABASE_URL: Supabase project URL
  - SUPABASE_SERVICE_KEY: Supabase service role key (server-side access)
- Example .env values:
  OPENROUTER_API_KEY=your_openrouter_gemma_api_key
  GEMINI_API_KEY=your_google_gemini_api_key
  SUPABASE_URL=https://your-supabase-url.supabase.co
  SUPABASE_SERVICE_KEY=your_supabase_service_key

Development & Testing:
- Run: uvicorn backend.main:app --reload --port 8000
- Tests: pytest -q (if tests available in backend/test_api.py)
- Environment variables can be supplied via a .env file or deployment settings.

Deployment Info:
- This backend is designed to be deployed with the frontend on Vercel. Ensure environment variables are configured in your deployment settings.

Dependencies:
- See backend/requirements.txt for pinned dependencies.

Environment Variables (summary):
- OPENROUTER_API_KEY: Gemma 4 31B API key for recipe generation
- GEMINI_API_KEY: Google Gemini Vision API key
- SUPABASE_URL: Supabase project URL
- SUPABASE_SERVICE_KEY: Supabase server-side service key

Licensing:
- This project may be subject to its own license terms as defined in the repository.
