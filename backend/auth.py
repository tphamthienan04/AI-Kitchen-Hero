from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Function to verify the Bearer token from the Authorization header.
    This is a placeholder implementation. In production, you should decode and verify the token properly.
    """
    token = credentials.credentials
    
    if not token:
        raise HTTPException(
            status_code=403, 
            detail="Forbidden: No token provided"
        )

    return token