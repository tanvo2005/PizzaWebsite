import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-panel">
          <p className="footer-eyebrow">PizzaHub</p>
          <h3>Pizza nóng hổi, nguyên liệu tươi, giao nhanh từng phút.</h3>
          <p>
            Từ khâu chọn món đến thanh toán, mọi thứ được tối ưu để bạn đặt pizza nhanh chóng và dễ dàng.
          </p>
        </div>

        <div className="footer-links">
          <div>
            <h4>Khám Phá</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/checkout">Checkout</Link></li>
            </ul>
          </div>

          <div>
            <h4>Hổ Trợ</h4>
            <ul>
              <li><a href="mailto:PizzaHub@gmail.vn">PizzaHub@gmail.vn</a></li>
              <li><a href="tel:+84901234567">0275493377</a></li>
              <li><span>Mở Cửa 09:00 - 22:00</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© 2026 PizzaHub. Bản quyền thuộc về nhóm 13.</p>
      </div>
    </footer>
  );
};

export default Footer;
