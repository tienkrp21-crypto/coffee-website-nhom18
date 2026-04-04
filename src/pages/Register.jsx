import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

//const BASE_URL = 'http://localhost:8080';
const BASE_URL = 'https://coffee-website-nhom18.onrender.com';
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        navigate('/login'); // Chuyển sang trang đăng nhập
      } else {
        alert("Đăng ký thất bại. Email hoặc số điện thoại có thể đã tồn tại!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi kết nối đến máy chủ!");
    }
  };

  return (
    <div className="font-sans text-gray-600 bg-secondary min-h-screen py-20 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white border-inner border-inner-dark p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="font-heading text-4xl text-dark uppercase mb-2">Tạo Tài Khoản</h1>
            <p className="text-gray-500">Tham gia cùng CafeMaterial ngay hôm nay</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-dark font-heading uppercase text-sm mb-2">Họ và tên *</label>
              <input type="text" name="fullName" required onChange={handleChange} className="w-full bg-secondary border border-gray-200 px-4 py-3 focus:outline-none focus:border-primary transition" placeholder="VD: Trương Hùng Dũng" />
            </div>
            
            <div>
              <label className="block text-dark font-heading uppercase text-sm mb-2">Số điện thoại *</label>
              <input type="tel" name="phone" required onChange={handleChange} className="w-full bg-secondary border border-gray-200 px-4 py-3 focus:outline-none focus:border-primary transition" placeholder="Nhập số điện thoại" />
            </div>

            <div>
              <label className="block text-dark font-heading uppercase text-sm mb-2">Email *</label>
              <input type="email" name="email" required onChange={handleChange} className="w-full bg-secondary border border-gray-200 px-4 py-3 focus:outline-none focus:border-primary transition" placeholder="Địa chỉ Email" />
            </div>

            <div>
              <label className="block text-dark font-heading uppercase text-sm mb-2">Mật khẩu *</label>
              <input type="password" name="password" required onChange={handleChange} className="w-full bg-secondary border border-gray-200 px-4 py-3 focus:outline-none focus:border-primary transition" placeholder="Tạo mật khẩu" />
            </div>

            <button type="submit" className="w-full bg-primary text-white font-heading uppercase text-lg py-4 mt-4 hover:bg-dark border-inner transition">
              Đăng Ký Ngay
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-500">
            Đã có tài khoản? <Link to="/login" className="text-primary font-bold hover:underline">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;