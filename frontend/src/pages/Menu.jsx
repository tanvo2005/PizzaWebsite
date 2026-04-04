import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import './Menu.css';

const categories = [
  { key: 'all', label: 'All pizzas' },
  { key: 'vegetarian', label: 'Vegetarian' },
  { key: 'meat', label: 'Meat lovers' },
  { key: 'vegan', label: 'Vegan' },
  { key: 'special', label: 'Special' },
];

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await api.get('/products', {
          params: { available: true },
        });

        setProducts(response.data.data?.products || []);
      } catch (requestError) {
        console.error('Error fetching products:', requestError);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const searchTerm = searchParams.get('q') || '';
  const deferredSearchTerm = useDeferredValue(searchTerm.trim().toLowerCase());

  const filteredProducts = useMemo(() => (
    products.filter((product) => {
      const matchesCategory = filter === 'all' || product.category === filter;
      const matchesSearch = !deferredSearchTerm
        || product.name.toLowerCase().includes(deferredSearchTerm)
        || product.description.toLowerCase().includes(deferredSearchTerm);

      return matchesCategory && matchesSearch;
    })
  ), [deferredSearchTerm, filter, products]);

  return (
    <div className="menu-page">
      <Navbar />

      <main className="menu-content">
        <section className="menu-hero">
          <div className="container menu-hero-inner">
            <div>
              <p className="section-kicker">Menu</p>
              <h1>Choose your next hot slice.</h1>
              <p>
                Browse the full pizza catalog, filter by category, and add items to cart in one click.
              </p>
            </div>

            <div className="menu-hero-stats">
              <div>
                <strong>{products.length}</strong>
                <span>Products</span>
              </div>
              <div>
                <strong>{filteredProducts.length}</strong>
                <span>Results</span>
              </div>
              <div>
                <strong>{searchTerm ? 'Live' : 'Ready'}</strong>
                <span>{searchTerm ? `Search: "${searchTerm}"` : 'Search from navbar'}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="container menu-toolbar">
          <div className="category-pills">
            {categories.map((category) => (
              <button
                key={category.key}
                type="button"
                className={filter === category.key ? 'active' : ''}
                onClick={() => setFilter(category.key)}
              >
                {category.label}
              </button>
            ))}
          </div>

          {searchTerm && (
            <div className="search-indicator">
              Filtering by <strong>{searchTerm}</strong>
            </div>
          )}
        </section>

        <section className="container">
          {loading && <div className="menu-state-card">Loading products...</div>}
          {!loading && error && <div className="menu-state-card error">{error}</div>}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="menu-state-card">
              <h2>No pizzas found</h2>
              <p>Try another keyword or switch to a different category.</p>
            </div>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Menu;
