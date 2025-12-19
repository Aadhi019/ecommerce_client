import { Card, Button, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';

const { Meta } = Card;

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      message.warning('Please login to add items to cart');
      return;
    }

    const result = await addToCart(product._id);
    if (result.success) {
      message.success('Added to cart successfully');
    } else {
      message.error(result.message);
    }
  };

  const price = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;

  return (
    <Card
      hoverable
      className="w-full"
      cover={
        <Link to={`/products/${product._id}`}>
          <img
            alt={product.name}
            src={product.images[0]?.url}
            className="h-48 w-full object-cover"
          />
        </Link>
      }
      actions={[
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      ]}
    >
      <Meta
        title={
          <Link to={`/products/${product._id}`} className="text-gray-800 hover:text-blue-600">
            {product.name}
          </Link>
        }
        description={
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg font-bold text-green-600">
                {formatPrice(price)}
              </span>
              {originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm line-clamp-2">
              {product.description}
            </p>
            <div className="text-xs text-gray-500 mt-1">
              Stock: {product.stock}
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default ProductCard;