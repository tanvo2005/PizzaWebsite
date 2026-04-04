import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { formatCurrency } from '../utils/format';
import { PLACEHOLDER_IMAGE, resolveImageUrl } from '../utils/images';
import Button from './Button';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);

  const imageSrc = imageError ? PLACEHOLDER_IMAGE : resolveImageUrl(product.image);
  const handleAddToCart = () => {
    const result = addToCart(product);

    if (result?.reason === 'AUTH_REQUIRED') {
      navigate('/login');
    }
  };

  return (
    <article className="product-card">
      <div className="product-card-media">
        <img
          src={imageSrc}
          alt={product.name}
          className="product-image"
          onError={() => setImageError(true)}
        />
        <span className="product-category">{product.category}</span>
      </div>

      <div className="product-info">
        <div className="product-copy">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">{product.description}</p>
        </div>

        <div className="product-footer">
          <p className="product-price">{formatCurrency(product.price)}</p>
          <div className="product-actions">
            <Button variant="secondary" size="small" onClick={() => navigate(`/products/${product.id}`)}>
              View Details
            </Button>
            <Button
              variant="primary"
              size="small"
              disabled={!product.isAvailable}
              onClick={handleAddToCart}
            >
              {product.isAvailable ? 'Add to Cart' : 'Unavailable'}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
