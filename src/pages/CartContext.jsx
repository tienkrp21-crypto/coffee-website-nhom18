/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const isExist = prevItems.find((item) => item.id === product.id);
      if (isExist) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // Logic xóa 1 sản phẩm
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // FIX LỖI: Thêm hàm dọn sạch giỏ hàng (Dùng khi đặt hàng xong)
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart'); // Xóa luôn rác trong bộ nhớ máy
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    // Nhớ cấp quyền cho clearCart được gọi ở các file khác
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};