import { Layout as AntLayout, Menu, Badge, Button, Dropdown } from 'antd';
import { ShoppingCartOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const { Header, Content, Footer } = AntLayout;

const Layout = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: <Link to="/profile">Profile</Link>
      },
      {
        key: 'orders',
        icon: <UserOutlined />,
        label: <Link to="/orders">Orders</Link>
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
        onClick: handleLogout
      }
    ]
  };

  return (
    <AntLayout className="min-h-screen">
      <Header className="bg-white shadow-md px-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Link to="/" className="text-xl font-bold text-blue-600">
            LUXEVIA
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/cart">
                  <Badge count={totalItems} showZero>
                    <ShoppingCartOutlined className="text-xl" />
                  </Badge>
                </Link>

                {user?.role === 'admin' && (
                  <Link to="/admin">
                    <Button type="primary">Admin</Button>
                  </Link>
                )}

                <Dropdown menu={userMenu} placement="bottomRight">
                  <Button icon={<UserOutlined />}>
                    {user?.name}
                  </Button>
                </Dropdown>
              </>
            ) : (
              <div className="space-x-2">
                <Link to="/login">
                  <Button>Login</Button>
                </Link>
                <Link to="/register">
                  <Button type="primary">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </Header>

      <Content className="flex-1">
        {children}
      </Content>

      <Footer className="text-center bg-gray-100">
        Luxevia ©2024
      </Footer>
    </AntLayout>
  );
};

export default Layout;