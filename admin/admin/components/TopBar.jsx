import React from "react";
import { useAdmin } from "../context/AdminContext";
import { useSidebar } from "./Sidebar";
import { Search, Bell, Menu } from "lucide-react";

export default function TopBar() {
  const { adminUser } = useAdmin();
  const { setIsMobileOpen } = useSidebar();

  return (
    <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between gap-2 sm:gap-4 px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden text-slate-600 hover:text-slate-900 transition"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Title - Hidden on very small screens */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-2xl font-semibold text-slate-900">
            Quản trị viên
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1 hidden sm:block">
            Chào mừng trở lại, {adminUser?.name || "Admin"}.
          </p>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-xs lg:max-w-lg">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 px-10 py-2 text-sm text-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 outline-none"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notification Bell */}
          <button className="relative rounded-full bg-slate-50 p-2 sm:p-3 text-slate-500 hover:bg-slate-100 transition">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 sm:top-2 right-1 sm:right-2 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 sm:gap-3 rounded-full border border-slate-200 bg-slate-50 px-2 sm:px-4 py-1.5 sm:py-2">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-orange-100 text-orange-700 font-bold text-sm">
              {adminUser?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="min-w-0 hidden sm:block">
              <p className="truncate text-sm font-semibold text-slate-900">
                {adminUser?.name || "Admin"}
              </p>
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
