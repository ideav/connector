import React, { useState } from 'react';
import { Button, Space, message } from 'antd';
import { PlayCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import { executeQuery, exportQuery, QueryResult } from '../services/api';

interface QueryEditorProps {
  connectionId: string;
  onQueryResult: (result: QueryResult | null) => void;
}

const QueryEditor: React.FC<QueryEditorProps> = ({ connectionId, onQueryResult }) => {
  const [query, setQuery] = useState('SELECT * FROM table_name LIMIT 10;');
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExecuteQuery = async () => {
    if (!connectionId) {
      message.warning('Please select a connection first');
      return;
    }

    if (!query.trim()) {
      message.warning('Please enter a query');
      return;
    }

    setLoading(true);
    try {
      const result = await executeQuery({
        connection_id: connectionId,
        query: query.trim(),
        page: 1,
        page_size: 50,
      });
      onQueryResult(result);
      message.success(`Query executed successfully. ${result.total_rows} rows returned.`);
    } catch (error: any) {
      message.error(error.response?.data?.detail || 'Failed to execute query');
      onQueryResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!connectionId) {
      message.warning('Please select a connection first');
      return;
    }

    if (!query.trim()) {
      message.warning('Please enter a query');
      return;
    }

    setExporting(true);
    try {
      await exportQuery({
        connection_id: connectionId,
        query: query.trim(),
      });
      message.success('Export completed successfully');
    } catch (error: any) {
      message.error(error.response?.data?.detail || 'Failed to export query results');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 8 }}>
        <Space>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={handleExecuteQuery}
            loading={loading}
            disabled={!connectionId}
          >
            Execute Query
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
            loading={exporting}
            disabled={!connectionId}
          >
            Export TAB-delimited
          </Button>
        </Space>
      </div>

      <div style={{ flex: 1, border: '1px solid #d9d9d9', borderRadius: 4 }}>
        <Editor
          height="100%"
          defaultLanguage="sql"
          value={query}
          onChange={(value) => setQuery(value || '')}
          theme="vs-light"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
};

export default QueryEditor;
