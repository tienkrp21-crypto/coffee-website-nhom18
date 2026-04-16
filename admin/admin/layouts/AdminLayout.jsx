import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar, { SidebarProvider } from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { useAdmin } from "../context/AdminContext";
import { useSidebar } from "../components/Sidebar";

function AdminLayoutContent() {
  const { isExpanded, isMobileOpen, setIsMobileOpen } = useSidebar();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar />
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isExpanded ? "ml-0 lg:ml-64" : "ml-0 lg:ml-20"
        }`}
      >
        <TopBar />
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { isLoggedIn, checkAuth } = useAdmin();

  useEffect(() => {
    checkAuth();
  }, []);

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <SidebarProvider>
      <AdminLayoutContent />
    </SidebarProvider>
  );
}
