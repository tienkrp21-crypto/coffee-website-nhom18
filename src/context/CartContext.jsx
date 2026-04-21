/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. TẠO NGỮ CẢNH (CONTEXT) - Giống như tạo một cái "hố chứa" dữ liệu chung
const CartContext = createContext();

// 2. TẠO PROVIDER - Nhà cung cấp dữ liệu, bọc ngoài các component khác để truyền dữ liệu
export const CartProvider = ({ children }) => {
  
  // Khởi tạo state giỏ hàng (cartItems). 
  // Kiểm tra xem trong LocalStorage (bộ nhớ trình duyệt) có giỏ hàng cũ không.
  // Nếu có thì lấy ra dùng (JSON.parse), nếu không thì tạo mảng rỗng [].
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 3. ĐỒNG BỘ DỮ LIỆU - Mỗi khi mảng cartItems thay đổi (thêm, sửa, xóa), 
  // tự động lưu lại vào LocalStorage để khách tắt web mở lại không bị mất hàng.
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 4. HÀM THÊM VÀO GIỎ HÀNG
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Kiểm tra xem món hàng khách chọn đã có trong giỏ chưa (tìm theo id)
      const isExist = prevItems.find((item) => item.id === product.id);
      
      if (isExist) {
        // Nếu CÓ RỒI: Giữ nguyên các món khác, tìm đúng món đó và tăng số lượng (quantity) lên 1
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Nếu CHƯA CÓ: Thêm món mới vào cuối mảng, đặt số lượng mặc định là 1
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // 5. HÀM CẬP NHẬT SỐ LƯỢNG (Dùng cho nút Cộng/Trừ trong trang Giỏ hàng)
  const updateQuantity = (id, quantity) => {
    // Nếu khách bấm trừ về 0 hoặc số âm thì tự động gọi hàm Xóa món đó luôn
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    // Nếu số lượng hợp lệ (>0): Duyệt qua mảng, tìm đúng id và cập nhật số lượng mới
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // 6. HÀM XÓA 1 MÓN HÀNG
  const removeFromCart = (id) => {
    // Dùng filter để giữ lại những món KHÁC id cần xóa (nghĩa là loại bỏ món cần xóa ra khỏi mảng)
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // 7. HÀM DỌN SẠCH GIỎ HÀNG (Dùng sau khi thanh toán thành công hoặc Đăng xuất)
  const clearCart = () => {
    setCartItems([]); // Đưa mảng về rỗng
    localStorage.removeItem('cart'); // Xóa luôn lịch sử trong bộ nhớ trình duyệt
  };

  // 8. TÍNH TỔNG SỐ LƯỢNG MÓN HÀNG (Để hiện lên con số ở icon giỏ hàng trên Header)
  // Dùng hàm reduce để cộng dồn quantity của tất cả các món trong giỏ
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // 9. PHÁT SÓNG DỮ LIỆU - Truyền tất cả các biến và hàm này xuống cho các trang con (children)
  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

// 10. TẠO HOOK TÙY CHỈNH (Custom Hook)
// Thay vì trang nào cũng phải import useContext và CartContext dài dòng, 
// giờ chỉ cần gọi `const { cartItems, addToCart } = useCart();` là xài được ngay, rất gọn!
export const useCart = () => {
  return useContext(CartContext);
};