import React, { createContext, useState, useContext } from "react";

// 📌 Tạo AdminContext - dùng để chia sẻ dữ liệu xác thực giữa các component
const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  // 📊 State quản lý trạng thái đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  /**
   
   * @param {string} username - Tên đăng nhập (mặc định: "admin")
   * @param {string} password - Mật khẩu (mặc định: "admin123")
   * @return {boolean} - true nếu đăng nhập thành công, false nếu thất bại
   */
  const login = (username, password) => {
    // ⚠️ Lưu ý: Đây là xác thực cứng, nên được thay thế bằng API backend trong thực tế
    if (username === "admin" && password === "admin123") {
      // 👤 Đối tượng admin chứa thông tin người dùng
      const admin = {
        id: 1, // ID duy nhất của admin
        username: username, // Tên đăng nhập
        email: "admin@coffee.com", // Email admin
        name: "Administrator", // Tên hiển thị
      };
      setAdminUser(admin); // Cập nhật state với thông tin admin
      setIsLoggedIn(true); // Đánh dấu là đã đăng nhập
      // 🔒 Lưu token vào localStorage để xác thực lần sau
      localStorage.setItem("adminToken", "token_" + Date.now());
      return true; // Đăng nhập thành công
    }
    return false; // Đăng nhập thất bại
  };

  const logout = () => {
    setIsLoggedIn(false); // Đánh dấu chưa đăng nhập
    setAdminUser(null); // Xóa thông tin admin
    localStorage.removeItem("adminToken"); // Xóa token khỏi bộ nhớ cục bộ
  };

  const checkAuth = () => {
    const token = localStorage.getItem("adminToken"); // Lấy token từ bộ nhớ cục bộ
    if (token) {
      // Nếu token tồn tại, khôi phục trạng thái
      setIsLoggedIn(true); // Đánh dấu đã đăng nhập
      setAdminUser({
        id: 1,
        username: "admin",
        email: "admin@coffee.com",
        name: "Administrator",
      });
    }
  };

  // 📤 Cung cấp dữ liệu context cho các component con
  return (
    <AdminContext.Provider
      value={{ isLoggedIn, adminUser, login, logout, checkAuth }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
};
