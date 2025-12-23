# DB Connector - Usage Guide

## Overview

DB Connector is a web-based database management tool that allows you to:
- Connect to multiple databases (MySQL, PostgreSQL, Oracle, MS SQL Server)
- Browse database structure (schemas, tables, columns)
- Execute SQL queries
- View results with pagination
- Export query results as TAB-delimited files for Excel or other tools

## Getting Started

### 1. Add a Database Connection

1. Click the **"New Connection"** button in the left sidebar
2. Fill in the connection details:
   - **Connection Name**: A friendly name for this connection
   - **Database Type**: Select from MySQL, PostgreSQL, Oracle, or MS SQL Server
   - **Host**: Database server hostname or IP address
   - **Port**: Database server port (default: MySQL=3306, PostgreSQL=5432, MSSQL=1433, Oracle=1521)
   - **Username**: Database username
   - **Password**: Database password
   - **Database**: (Optional) Specific database/schema name
3. Click **"Add Connection"**

The system will test the connection before adding it. If the test fails, verify your credentials and network connectivity.

### 2. Browse Database Structure

Once connected:
1. Click on a connection in the left sidebar to select it
2. The database structure will load automatically below
3. Expand schemas, tables, and view columns in a tree structure

The tree view shows:
- **Schemas/Databases**: Top-level organization
- **Tables**: Individual tables within each schema
- **Columns**: Column names and data types

### 3. Execute SQL Queries

1. Ensure a connection is selected
2. In the **Query Editor** (right panel, top section):
   - Write or paste your SQL query
   - The editor supports SQL syntax highlighting
3. Click **"Execute Query"** to run the query
4. Results appear in the table below

**Example queries:**
```sql
-- Select all rows from a table
SELECT * FROM customers LIMIT 100;

-- Filter results
SELECT name, email FROM users WHERE active = true;

-- Join tables
SELECT o.id, c.name, o.total
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.created_at > '2024-01-01';
```

### 4. Navigate Results

The results table supports:
- **Pagination**: Use the pagination controls at the bottom
- **Page size**: Change the number of rows per page (10, 20, 50, 100)
- **Total count**: See the total number of rows returned
- **Scrolling**: Horizontal scroll for wide tables

### 5. Export Data

To export query results:
1. Write your SQL query in the editor
2. Click **"Export TAB-delimited"**
3. A `.tsv` file will be downloaded
4. Open directly in Excel or paste into Intagram

**Export format:**
- Column headers in the first row
- Data rows follow
- TAB character separates values
- Works perfectly with Excel's "Paste Special" or direct file open

## Tips and Best Practices

### Performance
- Use `LIMIT` clauses for large result sets
- Test queries with small limits before running on large datasets
- Pagination helps manage large result sets

### Security
- Connections are stored in memory only (not persisted)
- Use read-only database users when possible
- Avoid running destructive queries (DROP, DELETE) without backups

### Query Examples by Database

**MySQL:**
```sql
SHOW TABLES;
DESCRIBE table_name;
SELECT * FROM table_name LIMIT 10;
```

**PostgreSQL:**
```sql
\dt -- (Use SELECT from information_schema instead)
SELECT * FROM information_schema.tables WHERE table_schema = 'public';
SELECT * FROM table_name LIMIT 10;
```

**MS SQL Server:**
```sql
SELECT * FROM sys.tables;
SELECT * FROM table_name;
```

**Oracle:**
```sql
SELECT table_name FROM user_tables;
SELECT * FROM table_name WHERE ROWNUM <= 10;
```

## Keyboard Shortcuts

In the Query Editor:
- **Ctrl+Enter** / **Cmd+Enter**: Execute query
- **Ctrl+A** / **Cmd+A**: Select all
- **Ctrl+Z** / **Cmd+Z**: Undo
- **Ctrl+Shift+Z** / **Cmd+Shift+Z**: Redo

## Troubleshooting

### "Connection not found" error
- The connection may have been deleted
- Try creating a new connection

### Query timeout
- The query may be too complex or the dataset too large
- Try adding a LIMIT clause or optimizing the query

### Empty results
- Verify the table/schema name is correct
- Check that the user has SELECT permissions
- Ensure the table contains data

### Export issues
- Check browser's download settings
- Ensure pop-ups are not blocked
- Try a smaller dataset first
