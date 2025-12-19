import { useState, useEffect } from 'react';
import { Card, Tag, Spin, Empty } from 'antd';
import api from '../services/api';
import { formatPrice } from '../utils/currency';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Empty description="No orders found" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order._id}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">Order #{order._id.slice(-8)}</h3>
                <p className="text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <Tag color={getStatusColor(order.orderStatus)}>
                  {order.orderStatus.toUpperCase()}
                </Tag>
                <p className="font-bold text-lg">{formatPrice(order.totalPrice)}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-2 bg-gray-50 rounded">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{formatPrice(item.price)}</p>
                </div>
              ))}
            </div>
            
            {order.shippingAddress && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <h4 className="font-semibold mb-2">Shipping Address</h4>
                <p className="text-gray-600">
                  {order.shippingAddress.street}, {order.shippingAddress.city}, {' '}
                  {order.shippingAddress.state} {order.shippingAddress.zipCode}, {' '}
                  {order.shippingAddress.country}
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Orders;