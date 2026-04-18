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

  // 🔴 ĐÃ FIX LỖI: Thêm hàm updateQuantity để xử lý nút Cộng/Trừ
  const updateQuantity = (id, quantity) => {
    // Nếu khách bấm trừ về 0 thì tự động gọi hàm Xóa món đó luôn
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    // Cập nhật lại số lượng mới
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // Logic xóa 1 sản phẩm
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Logic dọn sạch giỏ hàng
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart'); 
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    // 🔴 ĐÃ FIX LỖI: Bổ sung chữ updateQuantity vào đây để Cart.jsx có thể xài được
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};