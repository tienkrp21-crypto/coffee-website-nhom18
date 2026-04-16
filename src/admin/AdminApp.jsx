import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminProvider } from "./context/AdminContext";
import AdminLayout from "./layouts/AdminLayout";
import AdminLogin from "./pages/AdminLogin";
import AdminIndex from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Users from "./pages/Users";

function AdminApp() {
  return (
    <AdminProvider>
      <Routes>
        {/* Admin Login */}
        <Route path="login" element={<AdminLogin />} />

        {/* Admin Dashboard Routes */}
        <Route path="" element={<AdminLayout />}>
          <Route index element={<AdminIndex />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
        </Route>

        {/* Catch all - redirect to admin home */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminProvider>
  );
}

export default AdminApp;
