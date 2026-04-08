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
            <p className="section-kicker">Cart</p>
            <h1>Đơn đặt hàng pizza của bạn</h1>
            <p style={{ paddingTop: 10 }}>
              Kiểm tra lại các mặt hàng, điều chỉnh số lượng, sau đó tiến hành
              thanh toán.
            </p>
          </div>
          {cart.length > 0 && (
            <Button variant="outline" size="small" onClick={clearCart}>
              Clear Cart
            </Button>
          )}
        </section>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <h2>Giỏ hàng của bạn trống</h2>
            <p>Quay lại thực đơn và thêm một vài chiếc pizza trước.</p>
            <Link to="/menu">
              <Button variant="primary" size="large">
                Duyệt Menu
              </Button>
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
              <h2>Tóm tắt đơn hàng</h2>
              <div>
                <span>Subtotal</span>
                <strong>{formatCurrency(subtotal)}</strong>
              </div>
              <div>
                <span>Shipping</span>
                <strong>{formatCurrency(shipping)}</strong>
              </div>
              <div className="cart-summary-total">
                <span>Total</span>
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
