import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        country: user.address?.country || ''
      });
    }
  }, [user, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const updateData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: {
          street: values.street,
          city: values.city,
          state: values.state,
          zipCode: values.zipCode,
          country: values.country
        }
      };

      await api.put('/auth/profile', updateData);
      message.success('Profile updated successfully');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card title="Profile Information">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
          >
            <Input prefix={<PhoneOutlined />} />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="street" label="Street Address">
              <Input />
            </Form.Item>

            <Form.Item name="city" label="City">
              <Input />
            </Form.Item>

            <Form.Item name="state" label="State">
              <Input />
            </Form.Item>

            <Form.Item name="zipCode" label="ZIP Code">
              <Input />
            </Form.Item>
          </div>

          <Form.Item name="country" label="Country">
            <Input />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
            >
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;