import React, { useState, createContext, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import {
  LayoutDashboard,
  FolderTree,
  Coffee,
  ShoppingCart,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

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
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <SidebarContext.Provider
      value={{ isExpanded, setIsExpanded, isMobileOpen, setIsMobileOpen }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export default function Sidebar() {
  const { logout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const { isExpanded, setIsExpanded, isMobileOpen, setIsMobileOpen } =
    useSidebar();

  const menuItems = [
    {
      label: "Thống kê",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    { label: "Quản lý Danh mục", path: "/admin/categories", icon: FolderTree },
    { label: "Quản lý Sản phẩm", path: "/admin/products", icon: Coffee },
    { label: "Quản lý Đơn hàng", path: "/admin/orders", icon: ShoppingCart },
    { label: "Quản lý Người dùng", path: "/admin/users", icon: Users },
  ];

  const handleMenuClick = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`bg-white text-slate-700 transition-all duration-300 ${
          isExpanded ? "w-64" : "w-20"
        } h-screen fixed left-0 top-0 overflow-y-auto border-r border-slate-200 shadow-sm hidden lg:flex flex-col`}
      >
        <div className="p-5 flex items-center gap-3 border-b border-slate-200">
          <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200 text-white">
            <Coffee className="w-5 h-5" />
          </div>
          {isExpanded && (
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Coffee Admin
              </p>
              <p className="text-xs text-slate-500">Bảng điều khiển</p>
            </div>
          )}
        </div>

        <nav className="mt-4 px-1 flex-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
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
                {isExpanded && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full inline-flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            {isExpanded ? "Thu nhỏ" : "Mở rộng"}
            <span className="ml-2">
              {isExpanded ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </span>
          </button>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="mt-3 w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
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
