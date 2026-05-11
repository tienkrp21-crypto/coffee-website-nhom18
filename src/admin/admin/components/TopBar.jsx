

import React from "react";
import { useAdmin } from "../context/AdminContext"; // 🔐 Dữ liệu admin
import { useSidebar } from "./Sidebar"; // 📍 State sidebar
import { Bell, Menu } from "lucide-react"; // 🔔 Icons


export default function TopBar() {
  // 🔐 Lấy thông tin admin từ context
  // adminUser = { id, username, email, name }
  const { adminUser } = useAdmin();

  // 📍 Lấy hàm mở/đóng sidebar trên mobile
  const { setIsMobileOpen } = useSidebar();

  return (
    <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between gap-2 sm:gap-4 px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        {/* 📱 Nút Menu Mobile - Chỉ hiển thị trên mobile */}
        <button
          onClick={() => setIsMobileOpen(true)} // Mở sidebar khi click
          className="lg:hidden text-slate-600 hover:text-slate-900 transition"
        >
          <Menu className="h-6 w-6" /> {/* ☰ Icon menu hamburger */}
        </button>

        {/* 📝 Tiêu đề và Chào mừng Message */}
        <div className="flex-1 min-w-0">
          {/* 📌 Tiêu đề chính */}
          <h2 className="text-lg sm:text-2xl font-semibold text-slate-900">
            Quản trị viên
          </h2>

          {/* 👋 Chào mừng message - ẩn trên mobile */}
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1 hidden sm:block">
            Chào mừng trở lại, {adminUser?.name || "Admin"}.
          </p>
        </div>

        {/* 🔔 Phần Bên Phải - Thông báo + User Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* 🔔 Nút Thông báo */}
          <button className="relative rounded-full bg-slate-50 p-2 sm:p-3 text-slate-500 hover:bg-slate-100 transition">
            <Bell className="h-5 w-5" /> {/* 🔔 Icon chuông */}
            {/* 🔴 Indicator thông báo - Chấm đỏ ở góc phải trên */}
            <span className="absolute top-1 sm:top-2 right-1 sm:right-2 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white" />
          </button>

          {/* 👤 User Profile Card */}
          <div className="flex items-center gap-2 sm:gap-3 rounded-full border border-slate-200 bg-slate-50 px-2 sm:px-4 py-1.5 sm:py-2">
            {/* 👤 Avatar - Hiển thị chữ cái đầu tiên của tên */}
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-orange-100 text-orange-700 font-bold text-sm">
              {adminUser?.name?.charAt(0).toUpperCase() || "A"}
            </div>

            {/* 📝 Thông tin User - Ẩn trên mobile nhỏ */}
            <div className="min-w-0 hidden sm:block">
              {/* 👤 Tên admin */}
              <p className="truncate text-sm font-semibold text-slate-900">
                {adminUser?.name || "Admin"}
              </p>
              {/* 📧 Email admin */}
              <p className="truncate text-xs text-slate-500">
                {adminUser?.email || "admin@example.com"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
