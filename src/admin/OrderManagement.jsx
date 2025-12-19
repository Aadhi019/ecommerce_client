import { useState, useEffect } from 'react';
import { Table, Tag, Select, message, Card } from 'antd';
import AdminLayout from './AdminLayout';
import api from '../services/api';
import { formatPrice } from '../utils/currency';

const { Option } = Select;

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders/all');
      setOrders(data);
    } catch (error) {
      message.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus: status });
      message.success('Order status updated');
      fetchOrders();
    } catch (error) {
      message.error('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'orange',
      processing: 'blue',
      shipped: 'purple',
      delivered: 'green',
      cancelled: 'red'
    };
    return colors[status] || 'default';
  };

  const columns = [
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
      title: 'Email',
      dataIndex: ['user', 'email'],
      key: 'email'
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
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Payment',
      dataIndex: 'isPaid',
      key: 'payment',
      render: (isPaid) => (
        <Tag color={isPaid ? 'green' : 'red'}>
          {isPaid ? 'PAID' : 'UNPAID'}
        </Tag>
      )
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Select
          value={record.orderStatus}
          onChange={(value) => handleStatusChange(record._id, value)}
          style={{ width: 120 }}
        >
          <Option value="pending">Pending</Option>
          <Option value="processing">Processing</Option>
          <Option value="shipped">Shipped</Option>
          <Option value="delivered">Delivered</Option>
          <Option value="cancelled">Cancelled</Option>
        </Select>
      )
    }
  ];

  const expandedRowRender = (record) => {
    const itemColumns = [
      {
        title: 'Product',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity'
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render: (price) => formatPrice(price)
      }
    ];

    return (
      <div className="space-y-4">
        <Card title="Order Items" size="small">
          <Table
            dataSource={record.orderItems}
            columns={itemColumns}
            pagination={false}
            size="small"
          />
        </Card>
        
        {record.shippingAddress && (
          <Card title="Shipping Address" size="small">
            <p>
              {record.shippingAddress.street}, {record.shippingAddress.city}, {' '}
              {record.shippingAddress.state} {record.shippingAddress.zipCode}, {' '}
              {record.shippingAddress.country}
            </p>
          </Card>
        )}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Order Management</h1>

        <Table
          dataSource={orders}
          columns={columns}
          rowKey="_id"
          loading={loading}
          expandable={{
            expandedRowRender,
            rowExpandable: (record) => record.orderItems?.length > 0
          }}
        />
      </div>
    </AdminLayout>
  );
};

export default OrderManagement;