from fastapi import APIRouter, HTTPException
from app.models import DatabaseObject
from app.db_manager import db_manager
from typing import List

router = APIRouter()

@router.get("/{connection_id}/structure", response_model=List[DatabaseObject])
async def get_database_structure(connection_id: str):
    try:
        structure = db_manager.get_database_structure(connection_id)
        return structure
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
