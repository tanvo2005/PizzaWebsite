import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import './Home.css';

// Page Home
const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to PizzaApp</h1>
            <p>Delicious pizzas made with fresh ingredients, delivered hot to your door.</p>
            <Link to="/menu">
              <Button variant="primary" size="large">Order Now</Button>
            </Link>
          </div>
        </div>
      </section>
      <section className="featured">
        <div className="container">
          <h2>Featured Pizzas</h2>
          <div className="featured-grid">
            {/* Giả lập dữ liệu, thực tế fetch từ API */}
            <div className="featured-item">
              <img src="/pizza1.jpg" alt="Margherita" />
              <h3>Margherita</h3>
              <p>Fresh tomatoes, mozzarella, basil</p>
              <p className="price">$12.99</p>
            </div>
            <div className="featured-item">
              <img src="/pizza2.jpg" alt="Pepperoni" />
              <h3>Pepperoni</h3>
              <p>Spicy pepperoni, cheese, tomato sauce</p>
              <p className="price">$14.99</p>
            </div>
            <div className="featured-item">
              <img src="/pizza3.jpg" alt="Vegetarian" />
              <h3>Vegetarian</h3>
              <p>Bell peppers, mushrooms, olives, cheese</p>
              <p className="price">$13.99</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;