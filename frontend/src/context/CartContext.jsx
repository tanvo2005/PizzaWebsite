import { createContext, useContext, useState, useEffect } from 'react';

// Tạo CartContext
const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // Mảng các item: { id, name, price, quantity, size, toppings }

  // Load cart từ localStorage khi khởi tạo
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Lưu cart vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Thêm sản phẩm vào giỏ
  const addToCart = (product, quantity = 1, size = 'medium', toppings = []) => {
    const existingItem = cart.find(item => item.id === product.id && item.size === size && JSON.stringify(item.toppings) === JSON.stringify(toppings));
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id && item.size === size && JSON.stringify(item.toppings) === JSON.stringify(toppings)
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity, size, toppings }]);
    }
  };

  // Cập nhật số lượng
  const updateQuantity = (id, size, toppings, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id, size, toppings);
    } else {
      setCart(cart.map(item =>
        item.id === id && item.size === size && JSON.stringify(item.toppings) === JSON.stringify(toppings)
          ? { ...item, quantity }
          : item
      ));
    }
  };

  // Xóa sản phẩm khỏi giỏ
  const removeFromCart = (id, size, toppings) => {
    setCart(cart.filter(item => !(item.id === id && item.size === size && JSON.stringify(item.toppings) === JSON.stringify(toppings))));
  };

  // Tính tổng tiền
  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Xóa toàn bộ giỏ
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, getTotal, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook để sử dụng CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};