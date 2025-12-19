import { useState } from 'react';
import { Form, Input, Button, Card, Divider, message } from 'antd';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { formatPrice, convertToINR } from '../utils/currency';

const stripePromise = loadStripe('pk_test_your_stripe_publishable_key');

const CheckoutForm = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const stripe = useStripe();
  const elements = useElements();
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    if (!stripe || !elements) return;

    setLoading(true);
    
    try {
      // Create order
      const orderData = {
        shippingAddress: values,
        paymentMethod: 'stripe'
      };
      
      const { data: order } = await api.post('/orders', orderData);
      
      // Create payment intent
      const { data: paymentData } = await api.post('/payment/create-intent', {
        orderId: order._id
      });

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        paymentData.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          }
        }
      );

      if (error) {
        message.error(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        await api.post('/payment/confirm', {
          paymentIntentId: paymentIntent.id
        });
        
        await clearCart();
        message.success('Order placed successfully!');
        navigate('/orders');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const taxAmount = totalAmount * 0.18; // GST in India
  const shippingAmount = totalAmount > 50 ? 0 : 5; // Free shipping above ₹4150
  const finalTotal = totalAmount + taxAmount + shippingAmount;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card title="Shipping Information">
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                name="street"
                label="Street Address"
                rules={[{ required: true, message: 'Please enter street address' }]}
              >
                <Input />
              </Form.Item>
              
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="city"
                  label="City"
                  rules={[{ required: true, message: 'Please enter city' }]}
                >
                  <Input />
                </Form.Item>
                
                <Form.Item
                  name="state"
                  label="State"
                  rules={[{ required: true, message: 'Please enter state' }]}
                >
                  <Input />
                </Form.Item>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="zipCode"
                  label="ZIP Code"
                  rules={[{ required: true, message: 'Please enter ZIP code' }]}
                >
                  <Input />
                </Form.Item>
                
                <Form.Item
                  name="country"
                  label="Country"
                  rules={[{ required: true, message: 'Please enter country' }]}
                >
                  <Input />
                </Form.Item>
              </div>
              
              <Divider />
              
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Payment Information</h3>
                <div className="p-3 border rounded">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#424770',
                          '::placeholder': {
                            color: '#aab7c4',
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
              
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={!stripe}
                size="large"
                className="w-full"
              >
                Place Order - {formatPrice(finalTotal)}
              </Button>
            </Form>
          </Card>
        </div>
        
        <div>
          <Card title="Order Summary">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product._id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
              
              <Divider />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%):</span>
                  <span>{formatPrice(taxAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{formatPrice(shippingAmount)}</span>
                </div>
                <Divider />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Checkout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;