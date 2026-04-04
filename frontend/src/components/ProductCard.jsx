import { Link } from 'react-router-dom';
import Button from './Button';
import './ProductCard.css';

// Component ProductCard tái sử dụng cho danh sách sản phẩm
const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <p className="product-price">${product.price}</p>
        <Link to={`/product/${product.id}`}>
          <Button variant="primary" size="small">View Details</Button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;