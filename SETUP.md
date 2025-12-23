# DB Connector - Setup Guide

## Prerequisites

- Python 3.9 or higher
- Node.js 18 or higher
- npm or yarn package manager

### Database-specific requirements:

#### MySQL
```bash
# No additional system packages needed
# Python driver installed via requirements.txt
```

#### PostgreSQL
```bash
# Debian/Ubuntu
sudo apt-get install libpq-dev

# macOS
brew install postgresql
```

#### MS SQL Server
```bash
# Debian/Ubuntu
sudo apt-get install unixodbc-dev
# Install ODBC Driver 17 for SQL Server
curl https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
sudo add-apt-repository "$(wget -qO- https://packages.microsoft.com/config/ubuntu/$(lsb_release -rs)/prod.list)"
sudo apt-get update
sudo apt-get install msodbcsql17

# macOS
brew tap microsoft/mssql-release https://github.com/Microsoft/homebrew-mssql-release
brew update
brew install msodbcsql17
```

#### Oracle
```bash
# Download Oracle Instant Client from:
# https://www.oracle.com/database/technologies/instant-client/downloads.html

# Set environment variables:
export ORACLE_HOME=/path/to/instantclient
export LD_LIBRARY_PATH=$ORACLE_HOME:$LD_LIBRARY_PATH
```

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# Linux/macOS
source venv/bin/activate

# Windows
venv\Scripts\activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Run the backend server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at http://localhost:8000

API Documentation (Swagger UI): http://localhost:8000/docs

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:3000

## Production Build

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm run build
# or
yarn build

# Serve the built files with a static server
npm run preview
# or
yarn preview
```

## Docker Setup (Optional)

Coming soon: Docker and Docker Compose configuration for easy deployment.

## Troubleshooting

### Connection Issues

If you cannot connect to a database:
1. Verify the database server is running
2. Check firewall settings
3. Confirm credentials are correct
4. Ensure the database driver is properly installed

### CORS Errors

If you see CORS errors in the browser console:
1. Check that the backend is running on port 8000
2. Verify the frontend proxy configuration in `vite.config.ts`
3. Restart both frontend and backend servers

### Database Driver Issues

If you encounter driver-related errors:
- **MySQL**: `pip install pymysql`
- **PostgreSQL**: `pip install psycopg2-binary`
- **MS SQL**: Ensure ODBC Driver 17 is installed
- **Oracle**: Ensure Oracle Instant Client is installed and environment variables are set
