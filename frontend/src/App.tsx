import React, { useState } from 'react';
import { Layout, Typography, Divider } from 'antd';
import ConnectionManager from './components/ConnectionManager';
import DatabaseTree from './components/DatabaseTree';
import QueryEditor from './components/QueryEditor';
import ResultsTable from './components/ResultsTable';
import { QueryResult, executeQuery } from './services/api';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  const [selectedConnectionId, setSelectedConnectionId] = useState<string>('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [loadingResults, setLoadingResults] = useState(false);
  const [currentQuery, setCurrentQuery] = useState<string>('');

  const handlePageChange = async (page: number, pageSize: number) => {
    if (!selectedConnectionId || !currentQuery) return;

    setLoadingResults(true);
    try {
      const result = await executeQuery({
        connection_id: selectedConnectionId,
        query: currentQuery,
        page,
        page_size: pageSize,
      });
      setQueryResult(result);
    } catch (error) {
      console.error('Failed to fetch page:', error);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleQueryResult = (result: QueryResult | null, query?: string) => {
    setQueryResult(result);
    if (query) setCurrentQuery(query);
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Header style={{ background: '#001529', padding: '0 24px' }}>
        <Title level={3} style={{ color: 'white', margin: '16px 0' }}>
          DB Connector
        </Title>
      </Header>

      <Layout>
        <Sider width={300} style={{ background: '#fff', padding: 16, overflow: 'auto' }}>
          <ConnectionManager
            onConnectionSelect={setSelectedConnectionId}
            selectedConnectionId={selectedConnectionId}
          />

          <Divider />

          <Typography.Title level={5}>Database Structure</Typography.Title>
          <DatabaseTree connectionId={selectedConnectionId} />
        </Sider>

        <Layout style={{ padding: 16 }}>
          <Content
            style={{
              background: '#fff',
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <div style={{ height: '40%', marginBottom: 16 }}>
              <Typography.Title level={5}>Query Editor</Typography.Title>
              <QueryEditor
                connectionId={selectedConnectionId}
                onQueryResult={(result) => {
                  handleQueryResult(result, result ? currentQuery : '');
                }}
              />
            </div>

            <div style={{ flex: 1, overflow: 'hidden' }}>
              <Typography.Title level={5}>Results</Typography.Title>
              <ResultsTable
                result={queryResult}
                loading={loadingResults}
                onPageChange={handlePageChange}
              />
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
