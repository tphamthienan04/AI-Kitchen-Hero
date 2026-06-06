import os
import datetime
from typing import Optional  
from supabase import create_client, Client
from dotenv import load_dotenv


load_dotenv(override=True)

def get_supabase() -> Optional[Client]:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    
    if not url or not key:
        print(f"DEBUG: URL={url}, KEY={key}") 
        return None
        
    return create_client(url, key)

def log_user_activity(user_id: str, activity: str, metadata: Optional[dict] = None) -> dict:
    client = get_supabase()
    if client is None:
        return {"success": False, "error": "Supabase client not configured"}
    payload: dict = {
        "user_id": user_id,
        "activity": activity,
        "created_at": datetime.datetime.utcnow().isoformat(),
    }
    if metadata is not None:
        payload["metadata"] = metadata
    try:
        res = client.table("user_activities").insert(payload).execute()
        return {"success": True, "data": res.data}
    except Exception as e:
        return {"success": False, "error": str(e)}

def log_ai_action(user_id: Optional[str], action_name: str, metadata: Optional[dict] = None) -> dict:
    user = user_id or "anonymous"
    client = get_supabase()
    if client is None:
        return {"success": False, "error": "Supabase client not configured"}
    payload = {
        "user_id": user,
        "action": action_name,
        "created_at": datetime.datetime.utcnow().isoformat(),
    }
    if metadata:
        payload["metadata"] = metadata
    try:
        res = client.table("user_activities").insert(payload).execute()
        return {"success": True, "data": res.data}
    except Exception as e:
        return {"success": False, "error": str(e)}
