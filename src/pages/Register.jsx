import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
        alert("Đăng ký thành công! Hãy dùng tài khoản mới để đăng nhập nhé.");
        navigate('/login');
      } else {
        const errorMsg = await response.text();
        alert(errorMsg || "Đăng ký thất bại. Email hoặc SĐT có thể đã tồn tại!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi kết nối đến máy chủ!");
    }
  };

  return (
    <div className="font-sans text-gray-600 bg-[#FAF3EB] min-h-screen py-20 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white border-2 border-[#2B2825]/10 p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl text-[#2B2825] uppercase mb-2">Tạo Tài Khoản</h1>
            <p className="text-gray-500 italic">Tham gia cùng CafeMaterial ngay hôm nay</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[#2B2825] font-bold uppercase text-sm mb-2">Họ và tên *</label>
              <input type="text" name="fullName" required onChange={handleChange} className="w-full bg-[#FAF3EB] border border-gray-200 px-4 py-3 focus:outline-none focus:border-[#E88F2A] transition" placeholder="VD: Trương Hùng Dũng" />
            </div>
            
            <div>
              <label className="block text-[#2B2825] font-bold uppercase text-sm mb-2">Số điện thoại *</label>
              <input type="tel" name="phone" required onChange={handleChange} className="w-full bg-[#FAF3EB] border border-gray-200 px-4 py-3 focus:outline-none focus:border-[#E88F2A] transition" placeholder="Nhập số điện thoại" />
            </div>

            <div>
              <label className="block text-[#2B2825] font-bold uppercase text-sm mb-2">Email *</label>
              <input type="email" name="email" required onChange={handleChange} className="w-full bg-[#FAF3EB] border border-gray-200 px-4 py-3 focus:outline-none focus:border-[#E88F2A] transition" placeholder="Địa chỉ Email" />
            </div>

            <div>
              <label className="block text-[#2B2825] font-bold uppercase text-sm mb-2">Mật khẩu *</label>
              <input type="password" name="password" required onChange={handleChange} className="w-full bg-[#FAF3EB] border border-gray-200 px-4 py-3 focus:outline-none focus:border-[#E88F2A] transition" placeholder="Tạo mật khẩu" />
            </div>

            <button type="submit" className="w-full bg-[#E88F2A] text-white font-bold uppercase text-lg py-4 mt-4 hover:bg-[#2B2825] transition-all">
              Đăng Ký Ngay
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-500">
            Đã có tài khoản? <Link to="/login" className="text-[#E88F2A] font-bold hover:underline">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;