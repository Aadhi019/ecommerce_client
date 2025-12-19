import { Button, Card, InputNumber, Empty, Divider, message } from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, convertToINR } from '../utils/currency';

const Cart = () => {
  const { items, totalAmount, updateCartItem, removeFromCart, loading } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = async (productId, quantity) => {
    const result = await updateCartItem(productId, quantity);
    if (!result.success) {
      message.error(result.message);
    }
  };

  const handleRemoveItem = async (productId) => {
    const result = await removeFromCart(productId);
    if (result.success) {
      message.success('Item removed from cart');
    } else {
      message.error(result.message);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!items || items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Your cart is empty"
        >
          <Link to="/">
            <Button type="primary" icon={<ShoppingOutlined />}>
              Continue Shopping
            </Button>
          </Link>
        </Empty>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.product._id} className="p-4">
            <div className="flex items-center space-x-4">
              <img
                src={item.product.images[0]?.url}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded"
              />
              
              <div className="flex-1">
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-gray-600">{formatPrice(item.price)}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <InputNumber
                  min={1}
                  max={item.product.stock}
                  value={item.quantity}
                  onChange={(value) => handleQuantityChange(item.product._id, value)}
                />
                
                <div className="font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </div>
                
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveItem(item.product._id)}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Total: {formatPrice(totalAmount)}</h3>
            <p className="text-gray-600">{items.length} items</p>
          </div>
          
          <div className="space-x-4">
            <Link to="/">
              <Button size="large">Continue Shopping</Button>
            </Link>
            <Button
              type="primary"
              size="large"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Cart;