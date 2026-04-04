import './Footer.css';

// Component Footer tái sử dụng
const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>PizzaApp</h3>
            <p>Delicious pizzas delivered to your door.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/menu">Menu</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact Us</h4>
            <p>Email: info@pizzaapp.com</p>
            <p>Phone: +1 234 567 890</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 PizzaApp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;