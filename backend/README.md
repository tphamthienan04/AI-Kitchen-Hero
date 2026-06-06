# Kitchen Hero Backend

This folder hosts a Python FastAPI backend that centralizes the Anthropic Claude AI logic (vision & recipe generation) and the database CRUD operations. The frontend will call these endpoints to perform AI generation and vision tasks.

How to run locally:
- Install dependencies: pip install -r requirements.txt
- Run the API: uvicorn main:app --reload --port 8000
- Create a .env file with ANTHROPIC_API_KEY and any other secrets you need
