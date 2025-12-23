# DB Connector

A web-based database management tool to connect to various databases from Intagram to fetch data.

## Features

- **Multi-Database Support**: Connect to MySQL, PostgreSQL, Oracle, and MS SQL Server
- **Database Navigation**: Browse database structure with an intuitive tree view (similar to DBeaver)
- **SQL Query Editor**: Write and execute SELECT statements with syntax highlighting
- **Results Display**: View query results in a paginated table
- **Data Export**: Export query results as TAB-delimited files for direct use in Excel or Intagram

## Quick Start

See [SETUP.md](SETUP.md) for detailed installation instructions.

**Для пользователей Windows 10**: См. [WINDOWS_SETUP_RU.md](WINDOWS_SETUP_RU.md) для подробной инструкции по установке на русском языке.

**For Windows 10 users**: See [WINDOWS_SETUP_RU.md](WINDOWS_SETUP_RU.md) for detailed installation instructions in Russian.

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Access the application at http://localhost:3000

## Usage

You may setup a connection and navigate the structure and data at the remote database.
The service enables you to write SELECT statements and execute those at the remote DB.
Once you selected a table or a query result at the remote DB, you can import their data as TAB-delimited file with the header.

For detailed usage instructions, see [USAGE.md](USAGE.md).

## Architecture

- **Backend**: FastAPI (Python) with SQLAlchemy for database connectivity
- **Frontend**: React + TypeScript with Ant Design UI components
- **Query Editor**: Monaco Editor (VS Code editor)
- **Supported Databases**: MySQL, PostgreSQL, Oracle, MS SQL Server

## Project Structure

```
.
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── main.py      # Application entry point
│   │   ├── models.py    # Pydantic models
│   │   ├── db_manager.py # Database connection manager
│   │   └── routes/      # API endpoints
│   └── requirements.txt
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API client
│   │   ├── App.tsx      # Main application
│   │   └── main.tsx     # Entry point
│   └── package.json
├── SETUP.md            # Setup instructions
└── USAGE.md            # Usage guide
```

## License

This project is provided as-is for use with Intagram data fetching.
