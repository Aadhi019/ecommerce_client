import { Layout, Menu } from 'antd';
import { DashboardOutlined, ShoppingOutlined, TagsOutlined, UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Sider, Content } = Layout;

const AdminLayout = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: <Link to="/admin">Dashboard</Link>
    },
    {
      key: '/admin/products',
      icon: <ShoppingOutlined />,
      label: <Link to="/admin/products">Products</Link>
    },
    {
      key: '/admin/categories',
      icon: <TagsOutlined />,
      label: <Link to="/admin/categories">Categories</Link>
    },
    {
      key: '/admin/orders',
      icon: <ShoppingCartOutlined />,
      label: <Link to="/admin/orders">Orders</Link>
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: <Link to="/admin/users">Users</Link>
    }
  ];

  return (
    <Layout className="min-h-screen">
      <Sider width={250} theme="light" className="shadow-md">
        <div className="p-4">
          <h2 className="text-lg font-bold text-center">Admin Panel</h2>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>
      <Content className="p-6 bg-gray-50">
        {children}
      </Content>
    </Layout>
  );
};

export default AdminLayout;