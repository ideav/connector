import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message, List, Card, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, DatabaseOutlined } from '@ant-design/icons';
import { ConnectionConfig, createConnection, listConnections, deleteConnection, testConnection } from '../services/api';

interface ConnectionManagerProps {
  onConnectionSelect: (connectionId: string) => void;
  selectedConnectionId?: string;
}

const ConnectionManager: React.FC<ConnectionManagerProps> = ({ onConnectionSelect, selectedConnectionId }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [connections, setConnections] = useState<ConnectionConfig[]>([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const loadConnections = async () => {
    try {
      const conns = await listConnections();
      setConnections(conns);
    } catch (error) {
      message.error('Failed to load connections');
    }
  };

  useEffect(() => {
    loadConnections();
  }, []);

  const handleAddConnection = async (values: ConnectionConfig) => {
    setLoading(true);
    try {
      const testResult = await testConnection(values);
      if (!testResult.success) {
        message.error(`Connection test failed: ${testResult.message}`);
        setLoading(false);
        return;
      }

      const newConnection = await createConnection(values);
      message.success('Connection added successfully');
      setIsModalVisible(false);
      form.resetFields();
      await loadConnections();
      onConnectionSelect(newConnection.id!);
    } catch (error: any) {
      message.error(error.response?.data?.detail || 'Failed to add connection');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConnection = async (connectionId: string) => {
    try {
      await deleteConnection(connectionId);
      message.success('Connection deleted');
      await loadConnections();
      if (selectedConnectionId === connectionId) {
        onConnectionSelect('');
      }
    } catch (error) {
      message.error('Failed to delete connection');
    }
  };

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: 16, width: '100%' }}
      >
        New Connection
      </Button>

      <List
        dataSource={connections}
        renderItem={(conn) => (
          <Card
            size="small"
            style={{
              marginBottom: 8,
              cursor: 'pointer',
              backgroundColor: selectedConnectionId === conn.id ? '#e6f7ff' : undefined,
            }}
            onClick={() => onConnectionSelect(conn.id!)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <DatabaseOutlined style={{ marginRight: 8 }} />
                <strong>{conn.name}</strong>
                <div style={{ fontSize: 12, color: '#888' }}>
                  {conn.db_type} - {conn.host}:{conn.port}
                </div>
              </div>
              <Popconfirm
                title="Delete this connection?"
                onConfirm={(e) => {
                  e?.stopPropagation();
                  handleDeleteConnection(conn.id!);
                }}
                onCancel={(e) => e?.stopPropagation()}
              >
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={(e) => e.stopPropagation()}
                />
              </Popconfirm>
            </div>
          </Card>
        )}
      />

      <Modal
        title="New Database Connection"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddConnection} layout="vertical">
          <Form.Item name="name" label="Connection Name" rules={[{ required: true }]}>
            <Input placeholder="My Database" />
          </Form.Item>

          <Form.Item name="db_type" label="Database Type" rules={[{ required: true }]}>
            <Select placeholder="Select database type">
              <Select.Option value="mysql">MySQL</Select.Option>
              <Select.Option value="postgres">PostgreSQL</Select.Option>
              <Select.Option value="oracle">Oracle</Select.Option>
              <Select.Option value="mssql">MS SQL Server</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="host" label="Host" rules={[{ required: true }]}>
            <Input placeholder="localhost" />
          </Form.Item>

          <Form.Item name="port" label="Port" rules={[{ required: true }]}>
            <Input type="number" placeholder="3306" />
          </Form.Item>

          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input placeholder="root" />
          </Form.Item>

          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password placeholder="password" />
          </Form.Item>

          <Form.Item name="database" label="Database">
            <Input placeholder="mydb" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Add Connection
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ConnectionManager;
