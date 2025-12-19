import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Spin } from 'antd';
import { UserOutlined, ShoppingOutlined, ShoppingCartOutlined, DollarOutlined } from '@ant-design/icons';
import AdminLayout from './AdminLayout';
import api from '../services/api';
import { formatPrice, convertToINR } from '../utils/currency';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const { data } = await api.get('/admin/dashboard');
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: '_id',
      key: '_id',
      render: (id) => `#${id.slice(-8)}`
    },
    {
      title: 'Customer',
      dataIndex: ['user', 'name'],
      key: 'customer'
    },
    {
      title: 'Total',
      dataIndex: 'totalPrice',
      key: 'total',
      render: (price) => formatPrice(price)
    },
    {
      title: 'Status',
      dataIndex: 'orderStatus',
      key: 'status',
      render: (status) => status.toUpperCase()
    }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={stats.totalUsers}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Products"
                value={stats.totalProducts}
                prefix={<ShoppingOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Orders"
                value={stats.totalOrders}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Revenue"
                value={stats.totalRevenue ? convertToINR(stats.totalRevenue) : 0}
                prefix="₹"
                precision={0}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
        </Row>

        <Card title="Recent Orders">
          <Table
            dataSource={stats.recentOrders}
            columns={orderColumns}
            rowKey="_id"
            pagination={false}
          />
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;