

import React, { useState, createContext, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Router hooks
import { useAdmin } from "../context/AdminContext"; // 🔐 Xác thực
import {
  LayoutDashboard, // 📊 Icon thống kê
  FolderTree, // 📁 Icon danh mục
  Coffee, // ☕ Icon sản phẩm
  ShoppingCart, // 🛒 Icon đơn hàng
  Users, // 👥 Icon người dùng
  ChevronLeft, // ◀ Icon mũi tên trái
  ChevronRight, // ▶ Icon mũi tên phải
  X, // ✕ Icon đóng
} from "lucide-react"; // Icon library


const SidebarContext = createContext();


export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
};


export const SidebarProvider = ({ children }) => {
  // 📊 State quản lý sidebar
  const [isExpanded, setIsExpanded] = useState(true); // Desktop: mở rộng hay thu nhỏ
  const [isMobileOpen, setIsMobileOpen] = useState(false); // Mobile: có mở hay không

  return (
    <SidebarContext.Provider
      value={{ isExpanded, setIsExpanded, isMobileOpen, setIsMobileOpen }}
    >
      {children}
    </SidebarContext.Provider>
  );
};


export default function Sidebar() {
  // 🔐 Hàm logout từ context xác thực
  const { logout } = useAdmin();

  // 🧭 Router hooks
  const navigate = useNavigate(); // Điều hướng trang
  const location = useLocation(); // Lấy đường dẫn hiện tại

  // 📍 Lấy state sidebar từ context
  const { isExpanded, setIsExpanded, isMobileOpen, setIsMobileOpen } =
    useSidebar();

  
  const menuItems = [
    {
      label: "Thống kê",
      path: "/admin/dashboard",
      icon: LayoutDashboard, // 📊 Hiển thị thống kê tổng quan
    },
    {
      label: "Quản lý Danh mục",
      path: "/admin/categories",
      icon: FolderTree, // 📁 Quản lý danh mục sản phẩm
    },
    {
      label: "Quản lý Sản phẩm",
      path: "/admin/products",
      icon: Coffee, // ☕ Quản lý sản phẩm cà phê
    },
    {
      label: "Quản lý Đơn hàng",
      path: "/admin/orders",
      icon: ShoppingCart, // 🛒 Quản lý đơn hàng khách hàng
    },
    {
      label: "Quản lý Người dùng",
      path: "/admin/users",
      icon: Users, // 👥 Quản lý tài khoản khách hàng
    },
  ];

  // 📱 Hàm đóng sidebar trên mobile khi click vào menu
  const handleMenuClick = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* 🖥️ DESKTOP SIDEBAR */}
      <div
        className={`bg-white text-slate-700 transition-all duration-300 ${
          isExpanded ? "w-64" : "w-20" // 64px (mở) hoặc 20px (thu)
        } h-screen fixed left-0 top-0 overflow-y-auto border-r border-slate-200 shadow-sm hidden lg:flex flex-col`}
      >
        {/* 🏠 Header - Logo và tên ứng dụng */}
        <div className="p-5 flex items-center gap-3 border-b border-slate-200">
          {/* 📍 Logo */}
          <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200 text-white">
            <Coffee className="w-5 h-5" /> {/* ☕ Icon cà phê */}
          </div>
          {/* 📝 Tên ứng dụng (ẩn khi thu nhỏ) */}
          {isExpanded && (
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Coffee Admin {/* Tên ứng dụng */}
              </p>
              <p className="text-xs text-slate-500">Bảng điều khiển</p>
            </div>
          )}
        </div>

        {/* 🧭 Navigation Menu */}
        <nav className="mt-4 px-1 flex-1">
          {menuItems.map((item) => {
            // ✅ Kiểm tra xem menu item có phải trang hiện tại hay không
            const isActive = location.pathname === item.path;
            const Icon = item.icon; // Lấy icon component

            return (
              <Link
                key={item.path}
                to={item.path}
                // 🎨 Style: nếu active thì hiển thị cam, không thì xám
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 mb-1 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-orange-50 text-orange-700 border border-orange-100 shadow-sm" // Active: cam
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900" // Inactive: xám
                }`}
              >
                {/* 📍 Icon */}
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    isActive ? "text-orange-600" : "text-slate-400"
                  }`}
                />
                {/* 📝 Tên menu (ẩn khi thu nhỏ) */}
                {isExpanded && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* 🔽 Footer - Nút mở rộng/thu nhỏ và đăng xuất */}
        <div className="p-4 border-t border-slate-200">
          {/* 📌 Nút mở rộng/thu nhỏ sidebar */}
          <button
            onClick={() => setIsExpanded(!isExpanded)} // Toggle expand state
            className="w-full inline-flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            {isExpanded ? "Thu nhỏ" : "Mở rộng"}
            <span className="ml-2">
              {isExpanded ? (
                <ChevronLeft className="w-4 h-4" /> // ◀ Khi mở rộng
              ) : (
                <ChevronRight className="w-4 h-4" /> // ▶ Khi thu nhỏ
              )}
            </span>
          </button>

          {/* 🚪 Nút đăng xuất */}
          <button
            onClick={() => {
              logout(); // Gọi hàm logout từ context
              navigate("/"); // Chuyển hướng về trang chủ
            }}
            className="mt-3 w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition"
          >
            Đăng xuất
          </button>
        </div>
      </div>
      <div
        className={`bg-white text-slate-700 transition-all duration-300 w-64 h-screen fixed left-0 top-0 overflow-y-auto border-r border-slate-200 shadow-sm lg:hidden flex flex-col z-40 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200 text-white">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Coffee Admin
              </p>
              <p className="text-xs text-slate-500">Bảng điều khiển</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="text-slate-500 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-4 px-1 flex-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleMenuClick}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 mb-1 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-orange-50 text-orange-700 border border-orange-100 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    isActive ? "text-orange-600" : "text-slate-400"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={() => {
              logout();
              navigate("/");
              setIsMobileOpen(false);
            }}
            className="w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </>
  );
}
