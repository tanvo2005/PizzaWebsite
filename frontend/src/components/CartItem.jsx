import { useState } from 'react';
import { formatCurrency } from '../utils/format';
import { PLACEHOLDER_IMAGE, resolveImageUrl } from '../utils/images';
import './CartItem.css';

const CartItem = ({ item, onDecrease, onIncrease, onRemove }) => {
  const [imageError, setImageError] = useState(false);
  const imageSrc = imageError ? PLACEHOLDER_IMAGE : resolveImageUrl(item.image);

  return (
    <div className="cart-item">
      <img src={imageSrc} alt={item.name} onError={() => setImageError(true)} />

      <div className="cart-item-copy">
        <div>
          <h3>{item.name}</h3>
          <p>Size: {item.size || '9""'}</p>
          {item.toppings?.length > 0 && <p>Toppings: {item.toppings.join(', ')}</p>}
        </div>
        <button type="button" className="cart-remove" onClick={onRemove}>Xoá</button>
      </div>

      <div className="cart-item-price">
        <span>Giá</span>
        <strong>{formatCurrency(item.price)}</strong>
      </div>

      <div className="cart-quantity">
        <button type="button" onClick={onDecrease}>-</button>
        <span>{item.quantity}</span>
        <button type="button" onClick={onIncrease}>+</button>
      </div>

      <div className="cart-line-total">
        <span>Tổng tiền</span>
        <strong>{formatCurrency(item.price * item.quantity)}</strong>
      </div>
    </div>
  );
};

export default CartItem;
