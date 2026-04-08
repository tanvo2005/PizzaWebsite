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
      setError('Giỏ hàng của bạn đang trống.');
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
      setError(requestError.response?.data?.message || 'Không thể đặt hàng. Vui lòng thử lại.');
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
            <p className="section-kicker">Thanh toán</p>
            <h1>Xác nhận giao hàng và thanh toán</h1>
            {/* <p>Phí ship cố định {formatCurrency(SHIPPING_FEE)} và mặc định thanh toán tiền mặt.</p> */}
          </div>
        </section>

        {orderResult ? (
          <div className="checkout-success">
            <h2>Đặt hàng thành công</h2>
            <p>Đơn hàng #{orderResult.id} đã được tạo và đang chờ xác nhận.</p>
            <div className="checkout-success-grid">
              <div>
                <span>Tổng tiền</span>
                <strong>{formatCurrency(orderResult.totalAmount)}</strong>
              </div>
              <div>
                <span>Trạng thái</span>
                <strong>{orderResult.status}</strong>
              </div>
              <div>
                <span>Thanh toán</span>
                <strong>{orderResult.paymentMethod}</strong>
              </div>
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div className="checkout-success">
            <h2>Giỏ hàng đang trống</h2>
            <p>Hãy thêm vài món trước khi tiếp tục thanh toán.</p>
          </div>
        ) : (
          <div className="checkout-layout">
            <form className="checkout-form" onSubmit={handleSubmit}>
              <div className="checkout-card">
                <h2>Thông tin giao hàng</h2>

                <label>
                  Họ và tên
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Số điện thoại
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
                  Địa chỉ giao hàng
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
                <h2>Phương thức thanh toán</h2>

                <label className="checkout-radio">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleChange}
                  />
                  <div>
                    <strong>Tiền mặt</strong>
                    <span>Thanh toán khi nhận hàng.</span>
                  </div>
                </label>

                <label>
                  Ghi chú
                  <textarea
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Ít cay, gọi trước khi giao..."
                  />
                </label>
              </div>

              {error && <div className="checkout-error">{error}</div>}

              <Button type="submit" variant="primary" size="large" disabled={placingOrder}>
                {placingOrder ? 'Đang đặt hàng...' : 'Đặt hàng'}
              </Button>
            </form>

            <aside className="checkout-summary">
              <div className="checkout-card">
                <h2>Tóm tắt đơn hàng</h2>

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
                    <span>Tạm tính</span>
                    <strong>{formatCurrency(subtotal)}</strong>
                  </div>
                  <div>
                    <span>Phí giao hàng</span>
                    <strong>{formatCurrency(shipping)}</strong>
                  </div>
                  <div className="checkout-grand-total">
                    <span>Tổng cộng</span>
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
