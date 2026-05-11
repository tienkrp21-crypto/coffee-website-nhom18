

import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

export default function AdminIndex() {
  // Lấy trạng thái đăng nhập và hàm kiểm tra xác thực từ context
  const { isLoggedIn, checkAuth } = useAdmin();

  // 🔐 Kiểm tra xác thực khi component tải
  useEffect(() => {
    checkAuth();
  }, []);

  // ➡️ Chuyển hướng dựa trên trạng thái đăng nhập
  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Navigate to="/admin/dashboard" replace />;
}
