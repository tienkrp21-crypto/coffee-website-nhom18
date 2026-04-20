import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts & Context
import MainLayout from "./layouts/MainLayout";
import { CartProvider } from "./context/CartContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentResult from "./pages/PaymentResult";
import Profile from "./pages/Profile";
import OrderHistory from "./pages/OrderHistory";
import About from "./pages/About";

// === DÒNG CẦN BỔ SUNG ĐỂ HẾT TRẮNG TRANG ===
import PaymentCancel from "./pages/PaymentCancel"; 
import PaymentSuccess from "./pages/PaymentSuccess";
// ===========================================

// Các trang khác
import CoffeeShop from "./CoffeeShop";
import Users from "./User";
import AdminApp from "./admin/AdminApp";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* NHÓM 1: Các trang dùng chung Header/Footer (MainLayout) */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="products" element={<ProductList />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="payment-result" element={<PaymentResult />} />
            <Route path="profile" element={<Profile />} />
            <Route path="order-history" element={<OrderHistory />} />
            
            {/* Đã sửa đường dẫn cho đồng bộ (bỏ dấu / ở đầu vì nằm trong MainLayout) */}
            <Route path="thanh-toan-huy" element={<PaymentCancel />} />
            <Route path="thanh-toan-thanh-cong" element={<PaymentSuccess />} />
          </Route>

          {/* NHÓM 2: Các trang độc lập */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          <Route path="/coffee-shop-info" element={<CoffeeShop />} />
          <Route path="/users-list" element={<Users />} />
          
          {/* NHÓM 3: Hệ thống Admin */}
          <Route path="/admin/*" element={<AdminApp />} />
          
          <Route path="*" element={<div className="text-center py-20 uppercase font-bold">404 - Không tìm thấy trang này sếp ơi!</div>} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;