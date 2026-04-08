import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import CartItem from "../components/CartItem";
import { useCart } from "../context/useCart";
import { SHIPPING_FEE, formatCurrency } from "../utils/format";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, subtotal, clearCart, updateQuantity, removeFromCart } =
    useCart();
  const shipping = cart.length > 0 ? SHIPPING_FEE : 0;
  const grandTotal = subtotal + shipping;

  return (
    <div className="cart-page">
      <Navbar />

      <main className="container cart-container">
        <section className="cart-header">
          <div>

            <p className="section-kicker">Giỏ hàng</p>
            <h1>Đơn Hàng Của Bạn</h1>
            <p>Kiểm tra lại các mặt hàng, điều chỉnh số lượng, sau đó tiến hành thanh toán.</p>
          </div>
          {cart.length > 0 && (
            <Button variant="outline" size="small" onClick={clearCart}>Xoá hết</Button>
          )}
        </section>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <h2>Giỏ hàng của bạn trống</h2>

            <p>Quay lại thực đơn và hãy thêm một vài chiếc pizza.</p>
            <Link to="/menu">
              <Button variant="primary" size="large">Thực Đơn</Button>

            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <section className="cart-list">
              {cart.map((item) => (
                <CartItem
                  key={`${item.id}-${item.size}-${JSON.stringify(item.toppings || [])}`}
                  item={item}
                  onDecrease={() =>
                    updateQuantity(
                      item.id,
                      item.size,
                      item.toppings,
                      item.quantity - 1,
                    )
                  }
                  onIncrease={() =>
                    updateQuantity(
                      item.id,
                      item.size,
                      item.toppings,
                      item.quantity + 1,
                    )
                  }
                  onRemove={() =>
                    removeFromCart(item.id, item.size, item.toppings)
                  }
                />
              ))}
            </section>

            <aside className="cart-summary">

              <h2>Thông Tin Đơn Hàng</h2>

              <div>
                <span>Tổng tiền</span>
                <strong>{formatCurrency(subtotal)}</strong>
              </div>
              <div>
                <span>Phí vận chuyển</span>
                <strong>{formatCurrency(shipping)}</strong>
              </div>
              <div className="cart-summary-total">
                <span>Tổng cộng</span>
                <strong>{formatCurrency(grandTotal)}</strong>
              </div>


              <Button
                variant="primary"
                size="large"
                onClick={() => navigate("/checkout")}
              >
                Tiếp tục thanh toán
              </Button>
              <Link to="/menu" className="cart-link">
                Tiếp tục mua sắm
              </Link>

            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
