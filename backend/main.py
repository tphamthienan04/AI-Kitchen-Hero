import os
import json
import traceback


try:
    from supabase_config import log_user_activity
except Exception:
    
    def log_user_activity(*args, **kwargs):
        pass

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from openai import OpenAI


client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

def generate_recipes_with_gemma(ingredients):
    system_prompt = """You are a professional chef. Suggest 3 recipes based on the ingredients provided.
    You MUST return the output in EXACTLY the following JSON format:
    {
      "recipes": [
        {
          "id": "1",
          "title": "Recipe Name",
          "description": "Short description",
          "cuisine": "Cuisine type",
          "prep_time_min": 10,
          "cook_time_min": 20,
          "servings": 2,
          "difficulty": "Easy",
          "ingredients": [{"name": "item", "quantity": "amount"}],
          "steps": [{"step": 1, "instruction": "do this"}],
          "created_at": "2026-06-06"
        }
      ]
    }
    DO NOT include any extra text, only the raw JSON."""

    user_prompt = f"Ingredients: {', '.join(ingredients)}"

    try:
        completion = client.chat.completions.create(
            model="google/gemma-4-31b-it:free",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Error: {str(e)}"

# Lazy import: switch to Gemini backend client
try:
    from gemini_client import (
        generate_recipes_from_ingredients,
        parse_scanned_image,
        DEMO_RECIPES
    )
except Exception:
    # Fallback dummy implementations will be provided below if imports fail
    generate_recipes_from_ingredients = None  # type: ignore
    parse_scanned_image = None  # type: ignore
    DEMO_RECIPES = []  # type: ignore

app = FastAPI(title="Kitchen Hero Backend API")

# Allow the frontend (Vite) during local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRecipesRequest(BaseModel):
    items: List[dict]
    preferences: Optional[str] = None

class ScanRequest(BaseModel):
    image_base64: str
    mime_type: str
    scan_type: str

class Recipe(BaseModel):
    id: str
    title: str
    description: str
    cuisine: str
    prep_time_min: int
    cook_time_min: int
    servings: int
    difficulty: str
    tags: List[str] = []
    ingredients: List[dict]
    steps: List[dict]
    ai_generated: Optional[bool] = True
    created_at: str

class RecipesResponse(BaseModel):
    recipes: List[Recipe]

class ScanResult(BaseModel):
    items: List[dict]
    confidence: float

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/api/ai-chef/generate-recipes", response_model=RecipesResponse)
async def generate_recipes(req: GenerateRecipesRequest):
    log_user_activity("user_id_demo", "GENERATE_RECIPES", {"items_count": len(req.items)})
    
    ingredients_names = [item["name"] for item in req.items]
    result_text = generate_recipes_with_gemma(ingredients_names)
    
    try:
        data = json.loads(result_text)
        return data 
    except:
        return {"recipes": []}

@app.post("/api/vision/scan", response_model=ScanResult)
async def vision_scan(req: ScanRequest):
    try:
        log_user_activity("user_id_demo", "VISION_SCAN", {"scan_type": req.scan_type})
        
        if parse_scanned_image is None:
            return {"items": [{"name": "Demo Item", "category": "other", "quantity": "1"}], "confidence": 0.9}
            
        result = await parse_scanned_image(req.image_base64, req.mime_type, req.scan_type)
        return result
    except Exception as e:
        print(f"Detailed fault is: {str(e)}")
        print(traceback.format_exc())
        raise