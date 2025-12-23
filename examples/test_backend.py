"""
Test script for DB Connector backend API

This script tests the backend API endpoints without requiring a real database.
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}
    print("✓ Health endpoint test passed")

def test_root_endpoint():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()
    print("✓ Root endpoint test passed")

def test_list_connections_empty():
    """Test listing connections when none exist"""
    response = client.get("/api/connections/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    print("✓ List connections endpoint test passed")

def test_connection_validation():
    """Test connection config validation"""
    invalid_config = {
        "name": "Test",
        "db_type": "invalid_type",
        "host": "localhost",
        "port": 3306,
        "username": "test",
        "password": "test"
    }
    response = client.post("/api/connections/test", json=invalid_config)
    assert response.status_code == 422  # Validation error
    print("✓ Connection validation test passed")

if __name__ == "__main__":
    print("\n=== Testing DB Connector Backend API ===\n")

    try:
        test_health_endpoint()
        test_root_endpoint()
        test_list_connections_empty()
        test_connection_validation()

        print("\n✓ All tests passed successfully!\n")
    except AssertionError as e:
        print(f"\n✗ Test failed: {e}\n")
        sys.exit(1)
    except Exception as e:
        print(f"\n✗ Unexpected error: {e}\n")
        sys.exit(1)
