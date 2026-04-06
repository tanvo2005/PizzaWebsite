import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/useCart';
import { PRODUCT_CATEGORIES, normalizeCategoryKey } from '../constants/categories';
import api from '../utils/api';
import './Menu.css';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

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
      // normalizeCategoryKey giúp dữ liệu cũ vẫn đi đúng tab mới mà không cần đổi API trả về.
      const productCategory = normalizeCategoryKey(product.category);
      const matchesCategory = filter === 'all' || productCategory === filter;
      const matchesSearch = !deferredSearchTerm
        || product.name.toLowerCase().includes(deferredSearchTerm)
        || product.description.toLowerCase().includes(deferredSearchTerm);

      return matchesCategory && matchesSearch;
    })
  ), [deferredSearchTerm, filter, products]);

  const handleAddToCart = (product) => {
    const result = addToCart(product);

    if (result?.reason === 'AUTH_REQUIRED') {
      navigate('/login');
    }
  };

  return (
    <div className="menu-page">
      <Navbar />

      <main className="menu-content">
        <section className="menu-hero">
          <div className="container menu-hero-inner">
            <div>
              <p className="section-kicker">Thực Đơn</p>
              <h1>Chọn pizza nóng hổi cho bạn ngay hôm nay</h1>
              <p>
                Hàng trăm lựa chọn hấp dẫn – đặt nhanh, giao tận nơi trong 30 phút.
              </p>
            </div>

            <div className="menu-hero-stats">
              <div>
                <img src="/pizzangon.png" alt="Hương vị tuyệt vời" />
              </div>
            </div>
          </div>
        </section>

        <section className="container menu-toolbar">
          <div className="category-pills">
            {PRODUCT_CATEGORIES.map((category) => (
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
              Đang lọc theo từ khóa <strong>{searchTerm}</strong>
            </div>
          )}
        </section>

        <section className="container">
          {loading && <div className="menu-state-card">Loading products...</div>}
          {!loading && error && <div className="menu-state-card error">{error}</div>}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="menu-state-card">
              <h2>Không tìm thấy món phù hợp</h2>
              <p>Hãy thử đổi từ khóa tìm kiếm hoặc chọn một danh mục khác.</p>
            </div>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
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
