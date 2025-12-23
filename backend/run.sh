#!/bin/bash
# Script to run the DB Connector backend

echo "Starting DB Connector backend..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
