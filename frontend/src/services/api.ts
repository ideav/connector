import axios from 'axios';

const API_BASE_URL = '/api';

export interface DatabaseType {
  MYSQL: 'mysql';
  POSTGRES: 'postgres';
  ORACLE: 'oracle';
  MSSQL: 'mssql';
}

export interface ConnectionConfig {
  id?: string;
  name: string;
  db_type: 'mysql' | 'postgres' | 'oracle' | 'mssql';
  host: string;
  port: number;
  username: string;
  password: string;
  database?: string;
}

export interface DatabaseObject {
  name: string;
  type: string;
  children?: DatabaseObject[];
}

export interface QueryRequest {
  connection_id: string;
  query: string;
  page?: number;
  page_size?: number;
}

export interface QueryResult {
  columns: string[];
  rows: any[][];
  total_rows: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface ExportRequest {
  connection_id: string;
  query: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const testConnection = async (config: ConnectionConfig) => {
  const response = await api.post('/connections/test', config);
  return response.data;
};

export const createConnection = async (config: ConnectionConfig) => {
  const response = await api.post('/connections/', config);
  return response.data;
};

export const listConnections = async (): Promise<ConnectionConfig[]> => {
  const response = await api.get('/connections/');
  return response.data;
};

export const deleteConnection = async (connectionId: string) => {
  const response = await api.delete(`/connections/${connectionId}`);
  return response.data;
};

export const getDatabaseStructure = async (connectionId: string): Promise<DatabaseObject[]> => {
  const response = await api.get(`/database/${connectionId}/structure`);
  return response.data;
};

export const executeQuery = async (request: QueryRequest): Promise<QueryResult> => {
  const response = await api.post('/query/execute', request);
  return response.data;
};

export const exportQuery = async (request: ExportRequest) => {
  const response = await api.post('/query/export', request, {
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'export.tsv');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
