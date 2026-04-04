import { Link } from 'react-router-dom';
import heroImage from '../assets/hero.png';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <Navbar />

      {/* Hero section: a brand-level introduction page replacing the old profile screen. */}
      <section className="about-hero">
        <div className="container about-hero-content">
          <p className="section-kicker">About Our Pizza</p>
          <h1>About Our Pizza</h1>
          <p>
            We started with one idea: build a neighborhood pizza brand that feels modern online
            but still tastes handcrafted and warm in every box.
          </p>
        </div>
      </section>

      {/* Story section explains founding and mission so the page feels like
          a real restaurant landing page, not a placeholder. */}
      <section className="about-story">
        <div className="container about-story-grid">
          <div className="about-story-copy">
            <p className="section-kicker">Our Story</p>
            <h2>From a small kitchen to a trusted pizza stop</h2>
            <p>
              Green Slice began as a compact kitchen focused on a short menu done well.
              Instead of adding everything, we refined dough texture, sauce balance, and oven timing.
            </p>
            <p>
              Our mission is simple: serve pizza that feels fresh, reliable, and worth ordering again,
              while keeping the digital experience clear enough that customers never feel lost.
            </p>
          </div>

          <div className="about-story-visual">
            <img src={heroImage} alt="Pizza close-up" />
          </div>
        </div>
      </section>

      {/* Ingredient cards use stylized visual blocks to communicate freshness
          without needing extra image assets in the repo. */}
      <section className="about-ingredients">
        <div className="container">
          <div className="home-section-heading">
            <p className="section-kicker">Ingredients</p>
            <h2>Fresh materials, no unnecessary shortcuts</h2>
          </div>

          <div className="ingredients-grid">
            <article className="ingredient-card">
              <div className="ingredient-media ingredient-cheese" />
              <h3>Cheese</h3>
              <p>We focus on creamy melt and clean flavor so the topping supports the pizza instead of overwhelming it.</p>
            </article>
            <article className="ingredient-card">
              <div className="ingredient-media ingredient-tomato" />
              <h3>Tomato</h3>
              <p>Our sauce is bright and slightly sweet, designed to stay balanced even after a fast delivery ride.</p>
            </article>
            <article className="ingredient-card">
              <div className="ingredient-media ingredient-dough" />
              <h3>Dough</h3>
              <p>We work toward a crust that stays light inside and crisp at the edge, without preservatives.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Team cards humanize the brand and make the About page feel complete. */}
      <section className="about-team">
        <div className="container">
          <div className="home-section-heading">
            <p className="section-kicker">Team</p>
            <h2>The people behind the oven and the order flow</h2>
          </div>

          <div className="team-grid">
            <article className="team-card">
              <div className="team-avatar">AL</div>
              <h3>Anh Long</h3>
              <p className="team-role">Head Chef</p>
              <p>Leads dough consistency, oven timing, and menu development.</p>
            </article>
            <article className="team-card">
              <div className="team-avatar">MT</div>
              <h3>Minh Thu</h3>
              <p className="team-role">Kitchen Lead</p>
              <p>Keeps prep quality high and makes sure every order leaves the pass correctly.</p>
            </article>
            <article className="team-card">
              <div className="team-avatar">QN</div>
              <h3>Quang Nam</h3>
              <p className="team-role">Delivery Ops</p>
              <p>Coordinates dispatch, timing, and handoff so hot pizzas arrive in better shape.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Final CTA points users back into the main revenue path: the menu. */}
      <section className="about-cta">
        <div className="container about-cta-card">
          <div>
            <p className="section-kicker">Ready to Order</p>
            <h2>Taste what all this preparation is for</h2>
            <p>Browse the menu, pick a favorite, and let us handle the rest.</p>
          </div>

          <Link to="/menu">
            <Button variant="primary" size="large">Order Now</Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
