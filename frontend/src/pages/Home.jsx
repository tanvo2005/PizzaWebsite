import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero.png';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { useAuth } from '../context/useAuth';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    // Home loads a short featured list so the landing page feels alive
    // without forcing the user to open the full menu first.
    const fetchFeaturedProducts = async () => {
      try {
        setLoadingProducts(true);
        const response = await api.get('/products', {
          params: { available: true },
        });

        setFeaturedProducts((response.data.data?.products || []).slice(0, 4));
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setFeaturedProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="home">
      <Navbar />

      {/* Hero section changes CTA based on auth state to avoid showing
          "Create Account" to an already logged-in user. */}
      <section className="hero-home">
        <div className="container hero-home-grid">
          <div className="hero-home-copy">
            <p className="section-kicker">Pizza Ordering Experience</p>
            <h1>Delicious Pizza Delivered Fast</h1>
            <p>
              Fresh dough, quality toppings, and a smoother ordering flow from menu to checkout.
            </p>

            {isAuthenticated ? (
              <div className="hero-auth-card">
                <strong>Welcome, {user.name}</strong>
                <span>Your cart is now isolated to your account, so each user sees only their own order.</span>
              </div>
            ) : null}

            <div className="hero-home-actions">
              <Link to="/menu">
                <Button variant="primary" size="large">Order Now</Button>
              </Link>

              {!isAuthenticated && (
                <>
                  <Link to="/login">
                    <Button variant="outline" size="large">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="outline" size="large">Create Account</Button>
                  </Link>
                </>
              )}

              {isAuthenticated && (
                <Button variant="secondary" size="large" onClick={handleLogout}>
                  Logout
                </Button>
              )}
            </div>
          </div>

          <div className="hero-home-visual">
            <div className="hero-card">
              <img src={heroImage} alt="Fresh pizza on a board" />
              <div className="hero-card-badge">
                <strong>Freshly baked every day</strong>
                <span>Search, order, and checkout with a cleaner storefront experience.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products reuse ProductCard so the home page and menu page
          stay visually and behaviorally consistent. */}
      <section className="home-featured">
        <div className="container">
          <div className="home-section-heading">
            <p className="section-kicker">Featured Products</p>
            <h2>Popular pizzas customers keep reordering</h2>
          </div>

          {loadingProducts ? (
            <div className="home-state-card">Loading featured pizzas...</div>
          ) : (
            <div className="home-featured-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why choose us gives the landing page stronger marketing content
          instead of feeling like only a technical demo. */}
      <section className="home-why">
        <div className="container">
          <div className="home-section-heading">
            <p className="section-kicker">Why Choose Us</p>
            <h2>Built around fresh ingredients and reliable delivery</h2>
          </div>

          <div className="why-grid">
            <article className="why-card">
              <div className="why-icon">FI</div>
              <h3>Fresh Ingredients</h3>
              <p>We prep vegetables, cheese, and sauces daily to keep every pizza bright and balanced.</p>
            </article>
            <article className="why-card">
              <div className="why-icon">FD</div>
              <h3>Fast Delivery</h3>
              <p>The ordering flow is optimized so hot pizzas leave the kitchen quickly and reach you sooner.</p>
            </article>
            <article className="why-card">
              <div className="why-icon">BT</div>
              <h3>Best Taste</h3>
              <p>We keep the menu focused on combinations people actually love, from classic to signature pies.</p>
            </article>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
