from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum

class DatabaseType(str, Enum):
    MYSQL = "mysql"
    POSTGRES = "postgres"
    ORACLE = "oracle"
    MSSQL = "mssql"

class ConnectionConfig(BaseModel):
    id: Optional[str] = None
    name: str
    db_type: DatabaseType
    host: str
    port: int
    username: str
    password: str
    database: Optional[str] = None

class ConnectionTestResult(BaseModel):
    success: bool
    message: str

class DatabaseObject(BaseModel):
    name: str
    type: str
    children: Optional[List['DatabaseObject']] = None

DatabaseObject.model_rebuild()

class QueryRequest(BaseModel):
    connection_id: str
    query: str
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=50, ge=1, le=1000)

class QueryResult(BaseModel):
    columns: List[str]
    rows: List[List[Any]]
    total_rows: int
    page: int
    page_size: int
    has_more: bool

class ExportRequest(BaseModel):
    connection_id: str
    query: str
