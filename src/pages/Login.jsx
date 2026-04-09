import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

//const BASE_URL = 'https://coffee-website-nhom18.onrender.com';
const BASE_URL = 'https://coffee-website-nhom18-1.onrender.com';
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const token = await response.text(); 

      if (response.ok) {
        localStorage.setItem('token', token);
        
        alert("Đăng nhập thành công! Hệ thống đã lưu Token.");
        navigate('/'); 
      } else {
        alert(token || "Sai email hoặc mật khẩu!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi kết nối đến máy chủ!");
    }
  };

  return (
    <div className="font-sans text-gray-600 bg-[#FAF3EB] min-h-screen py-20 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white border-2 border-[#2B2825]/10 p-8 md:p-12 shadow-2xl relative">
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl text-[#2B2825] uppercase mb-2">Đăng Nhập</h1>
            <p className="text-gray-500 italic">Chào mừng bạn quay trở lại</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[#2B2825] font-bold uppercase text-sm mb-2">Email</label>
              <input 
                type="email" 
                name="email" 
                required 
                onChange={handleChange} 
                className="w-full bg-[#FAF3EB] border border-gray-200 px-4 py-3 focus:outline-none focus:border-[#E88F2A] transition" 
                placeholder="Nhập địa chỉ email" 
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-[#2B2825] font-bold uppercase text-sm">Mật khẩu</label>
                <Link to="/forgot-password" size="sm" className="text-[#E88F2A] text-xs hover:underline">Quên mật khẩu?</Link>
              </div>
              <input 
                type="password" 
                name="password" 
                required 
                onChange={handleChange} 
                className="w-full bg-[#FAF3EB] border border-gray-200 px-4 py-3 focus:outline-none focus:border-[#E88F2A] transition" 
                placeholder="Nhập mật khẩu" 
              />
            </div>

            <button type="submit" className="w-full bg-[#2B2825] text-white font-bold uppercase text-lg py-4 hover:bg-[#E88F2A] transition-all">
              Đăng Nhập
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-500">
            Chưa có tài khoản? <Link to="/register" className="text-[#E88F2A] font-bold hover:underline">Tạo tài khoản mới</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;