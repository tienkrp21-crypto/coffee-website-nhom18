import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminProvider } from "./context/AdminContext"; //  Context quản lý xác thực
import AdminLayout from "./layouts/AdminLayout"; //  Layout chính của admin
import AdminLogin from "./pages/AdminLogin"; //  Trang đăng nhập
import AdminIndex from "./pages/Index"; //  Trang chỉ mục (redirect)
import Dashboard from "./pages/Dashboard"; // Trang thống kê
import Categories from "./pages/Categories"; //  Trang quản lý danh mục
import Products from "./pages/Products"; // Trang quản lý sản phẩm
import Orders from "./pages/Orders"; // Trang quản lý đơn hàng
import Users from "./pages/Users"; // Trang quản lý người dùng

function AdminApp() {
  return (
    //  Bao bọc tất cả routes bằng AdminProvider để cung cấp context xác thực
    <AdminProvider>
      <Routes>
        {/*  Route trang đăng nhập - Không cần bảo vệ */}
        <Route path="login" element={<AdminLogin />} />

        {/* Admin Dashboard Routes - Được bảo vệ bởi AdminLayout (kiểm tra xác thực) */}
        <Route path="" element={<AdminLayout />}>
          {/* Trang chỉ mục - Tự động chuyển hướng đến dashboard */}
          <Route index element={<AdminIndex />} />

          {/* Bảng điều khiển - Hiển thị thống kê tổng quan */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Quản lý Danh mục - Thêm/sửa/xóa danh mục sản phẩm */}
          <Route path="categories" element={<Categories />} />

          {/* Quản lý Sản phẩm - Thêm/sửa/xóa sản phẩm với hình ảnh */}
          <Route path="products" element={<Products />} />

          {/* Quản lý Đơn hàng - Xem/cập nhật trạng thái đơn hàng */}
          <Route path="orders" element={<Orders />} />

          {/* Quản lý Người dùng - Quản lý tài khoản khách hàng */}
          <Route path="users" element={<Users />} />
        </Route>

        {/* Route mặc định - Chuyển hướng về trang chủ admin */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminProvider>
  );
}

export default AdminApp;
