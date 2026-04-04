<<<<<<< HEAD
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Import tất cả 11 trang
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PaymentResult from './pages/PaymentResult';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CoffeeShop from "./CoffeeShop";
import Users from "./User";
>>>>>>> f3298702f0e56e585dd2c0c106e846685015f51d

function App() {
  return (
    <BrowserRouter>
      <Routes>
<<<<<<< HEAD
        {/* Nhóm các trang dùng chung Header/Footer */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<ProductList />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="payment-result" element={<PaymentResult />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<OrderHistory />} />
        </Route>

        {/* Các trang không dùng chung Header (như Login, Register) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
=======
        <Route path="/" element={<CoffeeShop />} />
        <Route path="/users" element={<Users />} />
>>>>>>> f3298702f0e56e585dd2c0c106e846685015f51d
      </Routes>
    </BrowserRouter>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> f3298702f0e56e585dd2c0c106e846685015f51d
