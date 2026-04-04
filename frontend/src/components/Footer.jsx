import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-panel">
          <p className="footer-eyebrow">Green Slice Pizza</p>
          <h3>Fresh dough, bright ingredients, reliable delivery.</h3>
          <p>
            Built for a smoother ordering flow from menu browsing to checkout.
          </p>
        </div>

        <div className="footer-links">
          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/checkout">Checkout</Link></li>
            </ul>
          </div>

          <div>
            <h4>Support</h4>
            <ul>
              <li><a href="mailto:hello@greenslice.vn">hello@greenslice.vn</a></li>
              <li><a href="tel:+84901234567">+84 901 234 567</a></li>
              <li><span>Open daily 09:00 - 22:00</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© 2026 Green Slice Pizza. Crafted for fast ordering and clean UX.</p>
      </div>
    </footer>
  );
};

export default Footer;
