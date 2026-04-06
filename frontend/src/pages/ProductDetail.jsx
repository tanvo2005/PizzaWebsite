import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { formatCurrency } from '../utils/format';
import { PLACEHOLDER_IMAGE, resolveImageUrl } from '../utils/images';
import { useCart } from '../context/useCart';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.data?.product || null);
      } catch (requestError) {
        console.error('Error fetching product detail:', requestError);
        setError('Unable to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const result = addToCart(product, quantity);

    if (result?.reason === 'AUTH_REQUIRED') {
      navigate('/login');
      return;
    }

    navigate('/cart');
  };

  const imageSrc = imageError ? PLACEHOLDER_IMAGE : resolveImageUrl(product?.image);

  return (
    <div className="product-detail-page">
      <Navbar />

      <main className="container product-detail-container">
        {loading && <div className="product-detail-state">Loading product details...</div>}

        {!loading && error && (
          <div className="product-detail-state">
            <h1>Product not available</h1>
            <p>{error}</p>
            <Link to="/menu">Back to menu</Link>
          </div>
        )}

        {!loading && product && (
          <section className="product-detail-card">
            <div className="product-detail-media">
              <img src={imageSrc} alt={product.name} onError={() => setImageError(true)} />
            </div>

            <div className="product-detail-copy">
              <Link to="/menu" className="product-detail-back">← Back to Menu</Link>
              {/* <span className="product-detail-category">{product.category}</span> */}
              <h1>{product.name}</h1>
              <p className="product-detail-price">{formatCurrency(product.price)}</p>
              <p className="product-detail-description">{product.description}</p>

              <div className="product-detail-meta">
                <div>
                  <span>Status</span>
                  <strong>{product.isAvailable ? 'Ready to order' : 'Currently unavailable'}</strong>
                </div>
                <div>
                  <span>Ingredients</span>
                  <strong>
                    {Array.isArray(product.ingredients) && product.ingredients.length > 0
                      ? product.ingredients.join(', ')
                      : 'Fresh house ingredients'}
                  </strong>
                </div>
              </div>

              <div className="product-detail-actions">
                <div className="quantity-picker">
                  <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))}>-</button>
                  <span>{quantity}</span>
                  <button type="button" onClick={() => setQuantity((current) => current + 1)}>+</button>
                </div>

                <Button
                  variant="primary"
                  size="large"
                  disabled={!product.isAvailable}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
