from sqlalchemy import create_engine, inspect, text
from sqlalchemy.engine import Engine
from typing import Dict, List, Any, Tuple
from app.models import DatabaseType, ConnectionConfig, DatabaseObject
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DatabaseManager:
    def __init__(self):
        self.connections: Dict[str, Engine] = {}
        self.configs: Dict[str, ConnectionConfig] = {}

    def _build_connection_string(self, config: ConnectionConfig) -> str:
        if config.db_type == DatabaseType.MYSQL:
            return f"mysql+pymysql://{config.username}:{config.password}@{config.host}:{config.port}/{config.database or ''}"
        elif config.db_type == DatabaseType.POSTGRES:
            return f"postgresql+psycopg2://{config.username}:{config.password}@{config.host}:{config.port}/{config.database or 'postgres'}"
        elif config.db_type == DatabaseType.MSSQL:
            return f"mssql+pyodbc://{config.username}:{config.password}@{config.host}:{config.port}/{config.database or 'master'}?driver=ODBC+Driver+17+for+SQL+Server"
        elif config.db_type == DatabaseType.ORACLE:
            return f"oracle+cx_oracle://{config.username}:{config.password}@{config.host}:{config.port}/{config.database or 'XE'}"
        else:
            raise ValueError(f"Unsupported database type: {config.db_type}")

    def test_connection(self, config: ConnectionConfig) -> Tuple[bool, str]:
        try:
            connection_string = self._build_connection_string(config)
            engine = create_engine(connection_string, pool_pre_ping=True)
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            engine.dispose()
            return True, "Connection successful"
        except Exception as e:
            logger.error(f"Connection test failed: {str(e)}")
            return False, f"Connection failed: {str(e)}"

    def add_connection(self, config: ConnectionConfig) -> str:
        import uuid
        connection_id = str(uuid.uuid4())
        config.id = connection_id

        connection_string = self._build_connection_string(config)
        engine = create_engine(connection_string, pool_pre_ping=True, pool_size=5, max_overflow=10)

        self.connections[connection_id] = engine
        self.configs[connection_id] = config

        return connection_id

    def remove_connection(self, connection_id: str):
        if connection_id in self.connections:
            self.connections[connection_id].dispose()
            del self.connections[connection_id]
            del self.configs[connection_id]

    def get_connection(self, connection_id: str) -> Engine:
        if connection_id not in self.connections:
            raise ValueError(f"Connection not found: {connection_id}")
        return self.connections[connection_id]

    def get_database_structure(self, connection_id: str) -> List[DatabaseObject]:
        engine = self.get_connection(connection_id)
        inspector = inspect(engine)

        databases = []

        try:
            schema_names = inspector.get_schema_names()
        except:
            schema_names = [None]

        for schema in schema_names:
            if schema in ['information_schema', 'pg_catalog', 'pg_toast', 'sys', 'mysql', 'performance_schema']:
                continue

            tables = []
            try:
                table_names = inspector.get_table_names(schema=schema)
                for table_name in table_names:
                    columns = []
                    try:
                        column_info = inspector.get_columns(table_name, schema=schema)
                        for col in column_info:
                            columns.append(DatabaseObject(
                                name=f"{col['name']} ({col.get('type', 'unknown')})",
                                type="column"
                            ))
                    except Exception as e:
                        logger.warning(f"Could not get columns for {table_name}: {e}")

                    tables.append(DatabaseObject(
                        name=table_name,
                        type="table",
                        children=columns if columns else None
                    ))
            except Exception as e:
                logger.warning(f"Could not get tables for schema {schema}: {e}")

            if tables:
                if schema:
                    databases.append(DatabaseObject(
                        name=schema,
                        type="schema",
                        children=tables
                    ))
                else:
                    databases.extend(tables)

        return databases

    def execute_query(self, connection_id: str, query: str, page: int = 1, page_size: int = 50) -> Dict[str, Any]:
        engine = self.get_connection(connection_id)

        offset = (page - 1) * page_size

        with engine.connect() as conn:
            result = conn.execute(text(query))

            columns = list(result.keys())

            all_rows = result.fetchall()
            total_rows = len(all_rows)

            paginated_rows = all_rows[offset:offset + page_size]

            rows = [[self._serialize_value(val) for val in row] for row in paginated_rows]

            return {
                "columns": columns,
                "rows": rows,
                "total_rows": total_rows,
                "page": page,
                "page_size": page_size,
                "has_more": offset + page_size < total_rows
            }

    def _serialize_value(self, value: Any) -> Any:
        if value is None:
            return None
        if isinstance(value, (str, int, float, bool)):
            return value
        return str(value)

    def get_all_connections(self) -> List[ConnectionConfig]:
        return list(self.configs.values())

db_manager = DatabaseManager()
