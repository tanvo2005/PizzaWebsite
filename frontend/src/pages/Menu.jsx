import { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import './Menu.css';

// Page Menu (Danh sách sản phẩm)
const Menu = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch products từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get('/products');
        // Backend returns: { success: true, data: { products: [...] } }
        const productsData = response.data.data?.products || [];
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter sản phẩm
  useEffect(() => {
    if (filter === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === filter));
    }
  }, [filter, products]);

  if (loading) {
    return (
      <div className="menu">
        <Navbar />
        <div className="container">
          <div className="loading">Loading products...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="menu">
      <Navbar />
      <div className="container">
        <h1>Our Menu</h1>
        {error && <div className="error-message">{error}</div>}
        <div className="filter-buttons">
          <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
          <button onClick={() => setFilter('vegetarian')} className={filter === 'vegetarian' ? 'active' : ''}>Vegetarian</button>
          <button onClick={() => setFilter('meat')} className={filter === 'meat' ? 'active' : ''}>Meat</button>
        </div>
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Menu;