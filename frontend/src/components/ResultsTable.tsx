import React from 'react';
import { Table, Empty } from 'antd';
import { QueryResult } from '../services/api';
import type { ColumnsType } from 'antd/es/table';

interface ResultsTableProps {
  result: QueryResult | null;
  loading?: boolean;
  onPageChange?: (page: number, pageSize: number) => void;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ result, loading, onPageChange }) => {
  if (!result) {
    return <Empty description="Execute a query to see results" />;
  }

  const columns: ColumnsType<any> = result.columns.map((col) => ({
    title: col,
    dataIndex: col,
    key: col,
    ellipsis: true,
    width: 150,
  }));

  const dataSource = result.rows.map((row, index) => {
    const rowData: any = { key: index };
    result.columns.forEach((col, colIndex) => {
      rowData[col] = row[colIndex];
    });
    return rowData;
  });

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={{
          current: result.page,
          pageSize: result.page_size,
          total: result.total_rows,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} rows`,
          onChange: onPageChange,
        }}
        scroll={{ x: 'max-content', y: 'calc(100vh - 400px)' }}
        size="small"
        bordered
      />
    </div>
  );
};

export default ResultsTable;
