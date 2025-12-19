import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Dashboard from './admin/Dashboard';
import ProductManagement from './admin/ProductManagement';
import CategoryManagement from './admin/CategoryManagement';
import OrderManagement from './admin/OrderManagement';
import UserManagement from './admin/UserManagement';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/products/:id" element={<Layout><ProductDetail /></Layout>} />
            
            <Route path="/cart" element={
              <ProtectedRoute>
                <Layout><Cart /></Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Layout><Checkout /></Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/orders" element={
              <ProtectedRoute>
                <Layout><Orders /></Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout><Profile /></Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/products" element={
              <ProtectedRoute adminOnly>
                <ProductManagement />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/categories" element={
              <ProtectedRoute adminOnly>
                <CategoryManagement />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/orders" element={
              <ProtectedRoute adminOnly>
                <OrderManagement />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/users" element={
              <ProtectedRoute adminOnly>
                <UserManagement />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;