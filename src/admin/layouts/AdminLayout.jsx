import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar, { SidebarProvider } from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { useAdmin } from "../context/AdminContext";
import { useSidebar } from "../components/Sidebar";

function AdminLayoutContent() {
  const { isExpanded } = useSidebar();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isExpanded ? "ml-64" : "ml-20"
        }`}
      >
        <TopBar />
        <div className="flex-1 overflow-auto p-8">
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
