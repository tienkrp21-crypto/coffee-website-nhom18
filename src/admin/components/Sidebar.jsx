import React, { useState, createContext, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <SidebarContext.Provider value={{ isExpanded, setIsExpanded }}>
      {children}
    </SidebarContext.Provider>
  );
};

export default function Sidebar() {
  const { logout } = useAdmin();
  const navigate = useNavigate();
  const { isExpanded, setIsExpanded } = useSidebar();

  const menuItems = [
    { label: "Bảng điều khiển", path: "/admin/dashboard", icon: "📊" },
    { label: "Quản lý Danh mục", path: "/admin/categories", icon: "📁" },
    { label: "Quản lý Sản phẩm", path: "/admin/products", icon: "☕" },
    { label: "Quản lý Tồn kho", path: "/admin/inventory", icon: "📦" },
    { label: "Lịch sử Nhập kho", path: "/admin/goods-receipt", icon: "📋" },
    { label: "Quản lý Đơn hàng", path: "/admin/orders", icon: "🛒" },
    { label: "Quản lý Người dùng", path: "/admin/users", icon: "👥" },
    { label: "Cấu hình hệ thống", path: "/admin/settings", icon: "⚙️" },
  ];

  return (
    <div
      className={`bg-gray-900 text-white transition-all duration-300 ${
        isExpanded ? "w-64" : "w-20"
      } h-screen fixed left-0 top-0 overflow-y-auto`}
    >
      {/* Logo */}
      <div className="p-4 bg-gray-800 flex items-center justify-between">
        {isExpanded && <h1 className="text-xl font-bold">☕ CoffeeAdmin</h1>}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white hover:bg-gray-700 p-2 rounded"
        >
          {isExpanded ? "◀" : "▶"}
        </button>
      </div>

      {/* Menu */}
      <nav className="mt-8">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200 border-l-4 border-transparent hover:border-blue-500"
          >
            <span className="text-2xl min-w-[30px]">{item.icon}</span>
            {isExpanded && <span className="ml-3">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-800">
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors duration-200 flex items-center justify-center"
        >
          <span className="text-lg mr-2">🚪</span>
          {isExpanded && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
}
