import { useEffect, useMemo, useState } from 'react';
import { CartContext } from './cart-context';
import { useAuth } from './useAuth';

// Each user gets an isolated localStorage bucket.
// Example: user id 1 -> "cart_1", user id 2 -> "cart_2"
const getCartStorageKey = (userId) => `cart_${userId}`;

// Load every saved user cart once at startup so switching accounts
// does not accidentally reuse the last in-memory cart.
const getStoredCartMap = () => {
  const cartMap = {};
  const legacyCartKey = localStorage.getItem('cart');

  // Clean up the old shared cart key from the previous implementation.
  // That generic key is the root cause of "user A sees user B cart".
  if (legacyCartKey !== null) {
    localStorage.removeItem('cart');
  }

  for (let index = 0; index < localStorage.length; index += 1) {
    const storageKey = localStorage.key(index);

    if (!storageKey || !storageKey.startsWith('cart_')) {
      continue;
    }

    try {
      const storedValue = localStorage.getItem(storageKey);
      cartMap[storageKey] = storedValue ? JSON.parse(storedValue) : [];
    } catch (error) {
      console.error(`Error parsing cart from ${storageKey}:`, error);
      localStorage.removeItem(storageKey);
      cartMap[storageKey] = [];
    }
  }

  return cartMap;
};

// A stable cart item key lets us detect the "same" pizza line item even if
// quantity changes, as long as product + size + toppings are identical.
const buildCartItemKey = (item) => `${item.id}-${item.size || 'medium'}-${JSON.stringify(item.toppings || [])}`;

// Normalize price and optional fields before saving to state/localStorage.
const normalizeProduct = (product, quantity = 1, size = 'medium', toppings = []) => ({
  ...product,
  quantity,
  size,
  toppings,
  price: Number.parseFloat(product.price || 0)
});

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  // We store all carts in memory, keyed by user storage key.
  // This avoids cross-user leakage when auth state changes.
  const [cartStore, setCartStore] = useState(getStoredCartMap);

  const activeUserId = user?.id ? String(user.id) : null;
  const activeCartKey = activeUserId ? getCartStorageKey(activeUserId) : null;

  // The visible cart is always derived from the currently authenticated user.
  // When user logs out, activeCartKey becomes null and UI instantly sees [].
  const cart = useMemo(() => {
    if (!activeCartKey) {
      return [];
    }

    return cartStore[activeCartKey] || [];
  }, [activeCartKey, cartStore]);

  // Persist every scoped cart bucket back to localStorage.
  // This keeps cart_1, cart_2, ... separated and durable across reloads.
  useEffect(() => {
    Object.entries(cartStore).forEach(([storageKey, storedCart]) => {
      localStorage.setItem(storageKey, JSON.stringify(storedCart));
    });
  }, [cartStore]);

  // Central helper: update only the active user's cart bucket.
  // If no user is logged in, we reject the action so callers can redirect to login.
  const updateActiveUserCart = (updater) => {
    if (!activeCartKey) {
      return { success: false, reason: 'AUTH_REQUIRED' };
    }

    setCartStore((currentStore) => {
      const currentCart = currentStore[activeCartKey] || [];
      const nextCart = updater(currentCart);

      return {
        ...currentStore,
        [activeCartKey]: nextCart,
      };
    });

    return { success: true };
  };

  // addToCart:
  // 1. Build a normalized line item.
  // 2. Check whether the same pizza variant already exists.
  // 3. If yes, increase quantity.
  // 4. If not, append a new line item to the active user's cart bucket.
  const addToCart = (product, quantity = 1, size = 'medium', toppings = []) => {
    const nextItem = normalizeProduct(product, quantity, size, toppings);
    const nextItemKey = buildCartItemKey(nextItem);

    return updateActiveUserCart((currentCart) => {
      const existingItem = currentCart.find((item) => buildCartItemKey(item) === nextItemKey);

      if (existingItem) {
        return currentCart.map((item) => (
          buildCartItemKey(item) === nextItemKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ));
      }

      return [...currentCart, nextItem];
    });
  };

  // updateQuantity:
  // 1. Target the correct cart line by product + size + toppings.
  // 2. Remove it if quantity <= 0.
  // 3. Otherwise only patch the quantity for that active user's line item.
  const updateQuantity = (id, size, toppings, quantity) => {
    const targetItemKey = buildCartItemKey({ id, size, toppings });

    return updateActiveUserCart((currentCart) => {
      if (quantity <= 0) {
        return currentCart.filter((item) => buildCartItemKey(item) !== targetItemKey);
      }

      return currentCart.map((item) => (
        buildCartItemKey(item) === targetItemKey
          ? { ...item, quantity }
          : item
      ));
    });
  };

  // removeFromCart:
  // Remove a single line item from only the active user's cart bucket.
  const removeFromCart = (id, size, toppings) => {
    const targetItemKey = buildCartItemKey({ id, size, toppings });

    return updateActiveUserCart((currentCart) => (
      currentCart.filter((item) => buildCartItemKey(item) !== targetItemKey)
    ));
  };

  // clearCart:
  // Clear only the current user's cart bucket.
  // On logout the UI also becomes empty because there is no active user anymore.
  const clearCart = () => updateActiveUserCart(() => []);

  const subtotal = useMemo(
    () => cart.reduce((total, item) => total + Number.parseFloat(item.price || 0) * item.quantity, 0),
    [cart]
  );

  const itemCount = useMemo(
    () => cart.reduce((count, item) => count + item.quantity, 0),
    [cart]
  );

  const value = {
    cart,
    subtotal,
    itemCount,
    activeCartKey,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
