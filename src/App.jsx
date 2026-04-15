import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import CoffeeShop from "./CoffeeShop";
import Users from "./User";
import About from "./pages/About";
import AdminApp from "./admin/AdminApp";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Nhóm các trang dùng chung Header/Footer */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="products" element={<ProductList />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="payment-result" element={<PaymentResult />} />
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="/order-history" element={<OrderHistory />} />
          </Route>
          {/* Các trang không dùng chung Header */}
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/coffee-shop-info" element={<CoffeeShop />} />
          <Route path="/users-list" element={<Users />} />
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
