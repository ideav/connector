from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import connections, database, query

app = FastAPI(title="DB Connector", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(connections.router, prefix="/api/connections", tags=["connections"])
app.include_router(database.router, prefix="/api/database", tags=["database"])
app.include_router(query.router, prefix="/api/query", tags=["query"])

@app.get("/")
async def root():
    return {"message": "DB Connector API"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
