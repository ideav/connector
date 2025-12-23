import React, { useState, useEffect } from 'react';
import { Tree, Spin, Empty } from 'antd';
import { DatabaseOutlined, TableOutlined, ColumnWidthOutlined, FolderOutlined } from '@ant-design/icons';
import { getDatabaseStructure, DatabaseObject } from '../services/api';
import type { DataNode } from 'antd/es/tree';

interface DatabaseTreeProps {
  connectionId: string;
}

const DatabaseTree: React.FC<DatabaseTreeProps> = ({ connectionId }) => {
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [loading, setLoading] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'schema':
        return <DatabaseOutlined />;
      case 'table':
        return <TableOutlined />;
      case 'column':
        return <ColumnWidthOutlined />;
      default:
        return <FolderOutlined />;
    }
  };

  const convertToTreeData = (objects: DatabaseObject[]): DataNode[] => {
    return objects.map((obj, index) => ({
      title: obj.name,
      key: `${obj.type}-${obj.name}-${index}`,
      icon: getIcon(obj.type),
      children: obj.children ? convertToTreeData(obj.children) : undefined,
    }));
  };

  const loadStructure = async () => {
    if (!connectionId) return;

    setLoading(true);
    try {
      const structure = await getDatabaseStructure(connectionId);
      const treeNodes = convertToTreeData(structure);
      setTreeData(treeNodes);
    } catch (error) {
      console.error('Failed to load database structure:', error);
      setTreeData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStructure();
  }, [connectionId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <Spin tip="Loading database structure..." />
      </div>
    );
  }

  if (!connectionId) {
    return <Empty description="Select a connection to view database structure" />;
  }

  if (treeData.length === 0) {
    return <Empty description="No database objects found" />;
  }

  return (
    <Tree
      showIcon
      defaultExpandAll
      treeData={treeData}
      style={{ background: 'transparent' }}
    />
  );
};

export default DatabaseTree;
