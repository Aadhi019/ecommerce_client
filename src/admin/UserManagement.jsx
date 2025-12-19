import { useState, useEffect } from 'react';
import { Table, Button, Tag, message, Popconfirm, Switch } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import AdminLayout from './AdminLayout';
import api from '../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (error) {
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, isActive) => {
    try {
      await api.put(`/admin/users/${userId}/status`, { isActive });
      message.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
      fetchUsers();
    } catch (error) {
      message.error('Failed to update user status');
    }
  };

  const handleDelete = async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => phone || 'N/A'
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'status',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'ACTIVE' : 'INACTIVE'}
        </Tag>
      )
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="space-x-2">
          <Switch
            checked={record.isActive}
            onChange={(checked) => handleStatusChange(record._id, checked)}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
          />
          
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">User Management</h1>

        <Table
          dataSource={users}
          columns={columns}
          rowKey="_id"
          loading={loading}
        />
      </div>
    </AdminLayout>
  );
};

export default UserManagement;