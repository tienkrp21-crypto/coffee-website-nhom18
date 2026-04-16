import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Đảm bảo BASE_URL này khớp với link Render của sếp
const BASE_URL = 'https://coffee-website-nhom18-1.onrender.com';

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

      // FIX: Xử lý phản hồi dựa trên trạng thái HTTP
      if (response.ok) {
        alert("Chúc mừng! Đăng ký tài khoản thành công. Giờ ông có thể đăng nhập rồi đó!");
        navigate('/login');
      } else {
        // Nếu lỗi (ví dụ: trùng email), lấy thông báo từ Backend trả về
        const errorMsg = await response.text();
        alert(errorMsg || "Đăng ký thất bại. Email có thể đã tồn tại!");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Lỗi: Không thể kết nối đến máy chủ Render!");
    }
  };

  return (
    <div className="font-sans text-gray-600 bg-[#FAF3EB] min-h-screen py-16 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white border-2 border-[#2B2825]/10 p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl text-[#2B2825] uppercase mb-2">Đăng Ký</h1>
            <div className="w-16 h-1 bg-[#E88F2A] mx-auto"></div>
            <p className="mt-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Gia nhập cộng đồng CoffeeMaterial</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[#2B2825] font-bold uppercase text-[10px] tracking-[0.2em] mb-2">Họ và Tên *</label>
              <input 
                type="text" 
                name="fullName" 
                required 
                onChange={handleChange} 
                className="w-full bg-[#FAF3EB] border border-gray-100 px-4 py-3 outline-none focus:border-[#E88F2A] transition" 
                placeholder="Nhập họ tên của bạn" 
              />
            </div>

            <div>
              <label className="block text-[#2B2825] font-bold uppercase text-[10px] tracking-[0.2em] mb-2">Số điện thoại *</label>
              <input 
                type="tel" 
                name="phone" 
                required 
                onChange={handleChange} 
                className="w-full bg-[#FAF3EB] border border-gray-100 px-4 py-3 outline-none focus:border-[#E88F2A] transition" 
                placeholder="Số điện thoại liên lạc" 
              />
            </div>

            <div>
              <label className="block text-[#2B2825] font-bold uppercase text-[10px] tracking-[0.2em] mb-2">Địa chỉ Email *</label>
              <input 
                type="email" 
                name="email" 
                required 
                onChange={handleChange} 
                className="w-full bg-[#FAF3EB] border border-gray-100 px-4 py-3 outline-none focus:border-[#E88F2A] transition" 
                placeholder="Email để đăng nhập" 
              />
            </div>

            <div>
              <label className="block text-[#2B2825] font-bold uppercase text-[10px] tracking-[0.2em] mb-2">Mật khẩu *</label>
              <input 
                type="password" 
                name="password" 
                required 
                onChange={handleChange} 
                className="w-full bg-[#FAF3EB] border border-gray-100 px-4 py-3 outline-none focus:border-[#E88F2A] transition" 
                placeholder="Tạo mật khẩu bảo mật" 
              />
            </div>

            <button type="submit" className="w-full bg-[#2B2825] text-white font-bold uppercase text-xs tracking-[0.2em] py-4 mt-4 hover:bg-[#E88F2A] transition-all duration-300 shadow-lg">
              Đăng Ký Tài Khoản
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-[10px] uppercase font-bold text-gray-400">
              Đã có tài khoản? <Link to="/login" className="text-[#E88F2A] hover:underline ml-1">Đăng nhập tại đây</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;