import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import CartItem from '../components/CartItem';
import { useCart } from '../context/useCart';
import { SHIPPING_FEE, formatCurrency } from '../utils/format';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, subtotal, clearCart, updateQuantity, removeFromCart } = useCart();
  const shipping = cart.length > 0 ? SHIPPING_FEE : 0;
  const grandTotal = subtotal + shipping;

  return (
    <div className="cart-page">
      <Navbar />

      <main className="container cart-container">
        <section className="cart-header">
          <div>
            <p className="section-kicker">Cart</p>
            <h1>Your pizza order</h1>
            <p>Review items, adjust quantities, then move to checkout.</p>
          </div>
          {cart.length > 0 && (
            <Button variant="outline" size="small" onClick={clearCart}>Clear Cart</Button>
          )}
        </section>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <h2>Your cart is empty</h2>
            <p>Head back to the menu and add a few pizzas first.</p>
            <Link to="/menu">
              <Button variant="primary" size="large">Browse Menu</Button>
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <section className="cart-list">
              {cart.map((item) => (
                <CartItem
                  key={`${item.id}-${item.size}-${JSON.stringify(item.toppings || [])}`}
                  item={item}
                  onDecrease={() => updateQuantity(item.id, item.size, item.toppings, item.quantity - 1)}
                  onIncrease={() => updateQuantity(item.id, item.size, item.toppings, item.quantity + 1)}
                  onRemove={() => removeFromCart(item.id, item.size, item.toppings)}
                />
              ))}
            </section>

            <aside className="cart-summary">
              <h2>Order Summary</h2>
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

              <Button variant="primary" size="large" onClick={() => navigate('/checkout')}>
                Continue to Checkout
              </Button>
              <Link to="/menu" className="cart-link">Continue Shopping</Link>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
