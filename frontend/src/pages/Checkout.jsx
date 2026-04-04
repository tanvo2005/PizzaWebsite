import { useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { useCart } from '../context/useCart';
import { useAuth } from '../context/useAuth';
import api from '../utils/api';
import { SHIPPING_FEE, formatCurrency } from '../utils/format';
import './Checkout.css';

const Checkout = () => {
  const { user } = useAuth();
  const { cart, subtotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    phoneNumber: '',
    deliveryAddress: '',
    paymentMethod: 'cash',
    specialInstructions: '',
  });
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');
  const [orderResult, setOrderResult] = useState(null);

  const shipping = cart.length > 0 ? SHIPPING_FEE : 0;
  const total = subtotal + shipping;

  const items = useMemo(() => (
    cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      size: item.size || 'medium',
      toppings: item.toppings || [],
    }))
  ), [cart]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setPlacingOrder(true);
    setError('');

    try {
      const response = await api.post('/orders', {
        ...formData,
        items,
        shippingFee: shipping,
      });

      setOrderResult(response.data.data?.order || null);
      clearCart();
    } catch (requestError) {
      console.error('Checkout failed:', requestError);
      setError(requestError.response?.data?.message || 'Failed to place order.');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="checkout-page">
      <Navbar />

      <main className="container checkout-container">
        <section className="checkout-header">
          <div>
            <p className="section-kicker">Checkout</p>
            <h1>Confirm delivery and payment</h1>
            <p>Shipping fee is fixed at {formatCurrency(SHIPPING_FEE)} and COD is selected by default.</p>
          </div>
        </section>

        {orderResult ? (
          <div className="checkout-success">
            <h2>Order placed successfully</h2>
            <p>Your order #{orderResult.id} has been created and is now waiting for confirmation.</p>
            <div className="checkout-success-grid">
              <div>
                <span>Total amount</span>
                <strong>{formatCurrency(orderResult.totalAmount)}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{orderResult.status}</strong>
              </div>
              <div>
                <span>Payment</span>
                <strong>{orderResult.paymentMethod}</strong>
              </div>
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div className="checkout-success">
            <h2>Your cart is empty</h2>
            <p>Add a few pizzas to the cart before continuing to checkout.</p>
          </div>
        ) : (
          <div className="checkout-layout">
            <form className="checkout-form" onSubmit={handleSubmit}>
              <div className="checkout-card">
                <h2>Delivery Information</h2>

                <label>
                  Full name
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Phone number
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+84901234567"
                    required
                  />
                </label>

                <label>
                  Delivery address
                  <textarea
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    rows="4"
                    required
                  />
                </label>
              </div>

              <div className="checkout-card">
                <h2>Payment Method</h2>

                <label className="checkout-radio">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleChange}
                  />
                  <div>
                    <strong>COD</strong>
                    <span>Pay in cash when the order arrives.</span>
                  </div>
                </label>

                <label className="checkout-radio">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                  />
                  <div>
                    <strong>Card</strong>
                    <span>Card payment option is prepared in the order payload.</span>
                  </div>
                </label>

                <label className="checkout-radio">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === 'online'}
                    onChange={handleChange}
                  />
                  <div>
                    <strong>Online</strong>
                    <span>Use this value when integrating a gateway later.</span>
                  </div>
                </label>

                <label>
                  Special instructions
                  <textarea
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Extra chili flakes, call before delivery..."
                  />
                </label>
              </div>

              {error && <div className="checkout-error">{error}</div>}

              <Button type="submit" variant="primary" size="large" disabled={placingOrder}>
                {placingOrder ? 'Placing order...' : 'Place Order'}
              </Button>
            </form>

            <aside className="checkout-summary">
              <div className="checkout-card">
                <h2>Order Summary</h2>

                <div className="checkout-lines">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.quantity}`}>
                      <span>{item.name} x{item.quantity}</span>
                      <strong>{formatCurrency(item.price * item.quantity)}</strong>
                    </div>
                  ))}
                </div>

                <div className="checkout-totals">
                  <div>
                    <span>Subtotal</span>
                    <strong>{formatCurrency(subtotal)}</strong>
                  </div>
                  <div>
                    <span>Shipping</span>
                    <strong>{formatCurrency(shipping)}</strong>
                  </div>
                  <div className="checkout-grand-total">
                    <span>Total</span>
                    <strong>{formatCurrency(total)}</strong>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
