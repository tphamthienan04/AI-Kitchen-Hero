import os
import json
import logging
import datetime
from typing import List, Optional
try:
    from backend.supabase_config import log_ai_action, log_user_activity
except Exception:
    def log_ai_action(*args, **kwargs): pass
    def log_user_activity(*args, **kwargs): pass
from dotenv import load_dotenv
import google.generativeai as palm

# Configuration
current_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(current_dir, '.env'))
palm.configure(api_key=os.getenv('GEMINI_API_KEY'))

MODEL_NAME = 'gemini-2.5-flash'
DEMO_RECIPES: List[dict] = []

async def generate_recipes_from_ingredients(items: List[dict], preferences: Optional[str] = None, user_id: Optional[str] = None) -> List[dict]:
    try:
        ingredients = ', '.join([i.get('name', '') for i in items])
        # The prompt is now structured to match the successful response format
        prompt = f"""
        Create recipe suggestions for: {ingredients}. 
        Return strictly JSON with the following structure:
        {{
            "recipes": [
                {{
                    "id": "1",
                    "title": "Dish Name",
                    "description": "A short tasty description",
                    "cuisine": "Vietnamese",
                    "prep_time_min": 10,
                    "cook_time_min": 20,
                    "servings": 2,
                    "difficulty": "easy",
                    "tags": [],
                    "ingredients": [{{"name": "Egg", "amount": "2 units"}}],
                    "steps": [{{"step_number": 1, "instruction": "Step instruction"}}],
                    "ai_generated": true,
                    "created_at": "{datetime.datetime.now().isoformat()}"
                }}
            ]
        }}
        """
        
        model = palm.GenerativeModel(MODEL_NAME)
        resp = model.generate_content(prompt)
        
        # Clean and parse
        clean_text = resp.text.strip().replace('```json', '').replace('```', '')
        data = json.loads(clean_text)
        return data.get('recipes', [])
    except Exception as e:
        logging.error(f"--- 🧨 FORMAT ERROR: {e} ---")
        # Log AI action using available data (ingredients length as fallback)
        try:
            ing_list = [i.get('name', '') for i in items]
            log_ai_action(user_id or "anonymous", "generate_recipes", {
                "ingredients": ing_list,
                "preferences": preferences,
                "recipes_count": len(ing_list)
            })
        except Exception:
            pass
        return []

async def parse_scanned_image(base64_str: str, mime: str, scan_type: str, user_id: Optional[str] = None) -> dict:
    try:
        model = palm.GenerativeModel('gemini-2.5-flash')
        
        image_part = {
            "mime_type": mime,
            "data": base64_str
        }
        
        prompt = f"Identify ingredients from this {scan_type} image. Return strictly JSON with 'items' (name, quantity, unit) and 'confidence'."
        
        resp = model.generate_content([prompt, image_part])
        clean_text = resp.text.strip().replace('```json', '').replace('```', '')
        try:
            result = json.loads(clean_text)
        except Exception:
            result = {"items": [], "confidence": 0.0}
        # Log AI action
        try:
            log_ai_action(user_id or "anonymous", "vision_scan", {
                "scan_type": scan_type,
                "mime": mime,
                "count": len(result.get("items", [])),
                "confidence": result.get("confidence", 0.0)
            })
        except Exception:
            pass
        return result
    except Exception as e:
        print(f"--- 🧨 VISION ERROR: {e} ---")
        # Log AI action for vision scan analytics with safe defaults
        try:
            log_ai_action(user_id or "anonymous", "vision_scan", {"scan_type": scan_type, "mime": mime, "count": 0, "confidence": 0.0})
        except Exception:
            pass
        return {'items': [], 'confidence': 0.0}