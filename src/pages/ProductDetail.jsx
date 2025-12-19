import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Button, InputNumber, Image, Spin, message, Divider } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { formatPrice } from '../utils/currency';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (error) {
      message.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      message.warning('Please login to add items to cart');
      return;
    }

    const result = await addToCart(product._id, quantity);
    if (result.success) {
      message.success('Added to cart successfully');
    } else {
      message.error(result.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  const price = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <Row gutter={[32, 32]}>
        <Col xs={24} md={12}>
          <Image.PreviewGroup>
            {product.images.map((image, index) => (
              <Image
                key={index}
                src={image.url}
                alt={product.name}
                className="w-full rounded-lg"
              />
            ))}
          </Image.PreviewGroup>
        </Col>
        
        <Col xs={24} md={12}>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-green-600">
                {formatPrice(price)}
              </span>
              {originalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            <Divider />

            <div className="space-y-4">
              <div>
                <span className="font-semibold">Category: </span>
                <span>{product.category?.name}</span>
              </div>
              
              <div>
                <span className="font-semibold">Stock: </span>
                <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </span>
              </div>

              {product.stock > 0 && (
                <div className="flex items-center space-x-4">
                  <span className="font-semibold">Quantity:</span>
                  <InputNumber
                    min={1}
                    max={product.stock}
                    value={quantity}
                    onChange={setQuantity}
                  />
                </div>
              )}

              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full md:w-auto"
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetail;