/**
 * ========================================
 * ADMIN LAYOUT - Layout chính của Admin Panel
 * ========================================
 *
 * Tập tin này xử lý:
 * - Bố cục trang admin chứa Sidebar và TopBar
 * - Kiểm tra xác thực người dùng
 * - Quản lý responsive layout (desktop/mobile)
 * - Cung cấp Sidebar context cho các component con
 */

import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom"; // Outlet: render các trang con
import Sidebar, { SidebarProvider } from "../components/Sidebar"; // 📍 Menu bên trái
import TopBar from "../components/TopBar"; // 📍 Thanh trên cùng
import { useAdmin } from "../context/AdminContext"; // 🔐 Dữ liệu xác thực
import { useSidebar } from "../components/Sidebar"; // 📍 State của sidebar

/**
 * 🎨 AdminLayoutContent Component
 * Chứa bố cục thực tế với Sidebar và TopBar
 *
 * Cấu trúc:
 * - Sidebar (menu bên trái)
 * - TopBar (thanh trên cùng)
 * - Outlet (nơi render các trang con)
 */
function AdminLayoutContent() {
  // 📍 Lấy state sidebar từ context
  // - isExpanded: boolean - sidebar có mở rộng hay không
  // - isMobileOpen: boolean - có mở sidebar trên mobile hay không
  // - setIsMobileOpen: function - để mở/đóng sidebar trên mobile
  const { isExpanded, isMobileOpen, setIsMobileOpen } = useSidebar();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* 📍 Sidebar - Menu điều hướng bên trái */}
      <Sidebar />

      {/* 📱 Mobile Overlay - Che phủ content khi mở sidebar trên mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden" // z-30: layer phía trên content
          onClick={() => setIsMobileOpen(false)} // Đóng sidebar khi click vào overlay
        />
      )}

      {/* 📄 Main Content Area - Khu vực hiển thị nội dung chính */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isExpanded ? "ml-0 lg:ml-64" : "ml-0 lg:ml-20" // Lề trái thay đổi khi expand/collapse sidebar
        }`}
      >
        {/* 📍 TopBar - Thanh trên cùng với menu và thông tin người dùng */}
        <TopBar />

        {/* 📝 Page Content - Outlet render trang hiện tại */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
          {/* 🔄 Outlet: Render các component trang theo route được chọn */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}


export default function AdminLayout() {
  
  const { isLoggedIn, checkAuth } = useAdmin();

  // ✅ Kiểm tra xác thực khi component tải
  useEffect(() => {
    checkAuth(); // Lấy token từ localStorage và khôi phục phiên
  }, []);

  // 🔒 Nếu chưa đăng nhập, chuyển hướng đến trang login
  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  // ✅ Nếu đã đăng nhập, hiển thị layout
  return (
    <SidebarProvider>
      <AdminLayoutContent />
    </SidebarProvider>
  );
}
