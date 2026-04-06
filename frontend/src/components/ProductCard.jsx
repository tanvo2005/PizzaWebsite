import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { getCategoryLabel } from '../constants/categories';
import { formatCurrency } from '../utils/format';
import { PLACEHOLDER_IMAGE, resolveImageUrl } from '../utils/images';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart, layout = 'horizontal' }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);

  const imageSrc = imageError ? PLACEHOLDER_IMAGE : resolveImageUrl(product.image);
  const categoryLabel = getCategoryLabel(product.category);

  const handleAddToCart = () => {
    // Nếu cha đã truyền hàm thêm vào giỏ thì ưu tiên dùng để giữ luồng xử lý tập trung ở trang Menu.
    if (onAddToCart) {
      onAddToCart(product);
      return;
    }

    // Fallback này giúp các trang khác như Home vẫn dùng lại ProductCard mà không bị gãy logic cũ.
    const result = addToCart(product);

    if (result?.reason === 'AUTH_REQUIRED') {
      navigate('/login');
    }
  };

  return (
    <article className={`product-card product-card--${layout}`}>
      <div className="product-card-media">
        <img
          src={imageSrc}
          alt={product.name}
          className="product-image"
          onError={() => setImageError(true)}
        />
      </div>

      <div className="product-info">
        <div className="product-copy">
          {/* Badge category nhỏ để người dùng nhìn nhanh được nhóm món ăn. */}
          <span className="product-category">{categoryLabel}</span>
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">{product.description}</p>
        </div>

        <p className="product-price">{formatCurrency(product.price)}</p>
      </div>

      <div className="product-actions">
        {/* Nút detail là CTA phụ nên mình giữ style viền xanh để card nhìn nhẹ hơn. */}
        <button
          type="button"
          className="product-detail-button"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          Xem chi tiết
        </button>

        {/* Nút tròn với dấu + là CTA chính cho thao tác thêm nhanh vào giỏ hàng. */}
        <button
          type="button"
          className="product-add-button"
          disabled={!product.isAvailable}
          onClick={handleAddToCart}
          aria-label={`Thêm ${product.name} vào giỏ`}
          title={product.isAvailable ? 'Thêm vào giỏ' : 'Sản phẩm tạm hết'}
        >
          +
        </button>

        {!product.isAvailable && <span className="product-status-text">Tạm hết hàng</span>}
      </div>
    </article>
  );
};

export default ProductCard;
