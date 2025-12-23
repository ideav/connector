from fastapi import APIRouter, HTTPException
from app.models import ConnectionConfig, ConnectionTestResult
from app.db_manager import db_manager
from typing import List

router = APIRouter()

@router.post("/test", response_model=ConnectionTestResult)
async def test_connection(config: ConnectionConfig):
    success, message = db_manager.test_connection(config)
    return ConnectionTestResult(success=success, message=message)

@router.post("/", response_model=ConnectionConfig)
async def create_connection(config: ConnectionConfig):
    try:
        success, message = db_manager.test_connection(config)
        if not success:
            raise HTTPException(status_code=400, detail=message)

        connection_id = db_manager.add_connection(config)
        config.id = connection_id
        return config
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[ConnectionConfig])
async def list_connections():
    connections = db_manager.get_all_connections()
    for conn in connections:
        conn.password = "***"
    return connections

@router.delete("/{connection_id}")
async def delete_connection(connection_id: str):
    try:
        db_manager.remove_connection(connection_id)
        return {"message": "Connection deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
