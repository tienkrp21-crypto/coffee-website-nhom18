import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

//const BASE_URL = 'http://localhost:8080';
const BASE_URL = 'https://coffee-website-nhom18.onrender.com';
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

      // Backend đang trả về String (chữ) nên dùng response.text()
      const data = await response.text(); 

      if (response.ok && data.includes("thành công")) { // Chỉnh lại theo đúng chữ Backend báo về
        alert(data); // Hiện thông báo "Đăng nhập thành công"
        navigate('/'); // Về trang chủ
      } else {
        alert(data || "Sai email hoặc mật khẩu!");
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
            <h1 className="font-heading text-4xl text-dark uppercase mb-2">Đăng Nhập</h1>
            <p className="text-gray-500">Chào mừng bạn quay trở lại</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-dark font-heading uppercase text-sm mb-2">Email</label>
              <input type="email" name="email" required onChange={handleChange} className="w-full bg-secondary border border-gray-200 px-4 py-3 focus:outline-none focus:border-primary transition" placeholder="Nhập địa chỉ email" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-dark font-heading uppercase text-sm">Mật khẩu</label>
                <Link to="/forgot-password" className="text-primary text-xs hover:underline">Quên mật khẩu?</Link>
              </div>
              <input type="password" name="password" required onChange={handleChange} className="w-full bg-secondary border border-gray-200 px-4 py-3 focus:outline-none focus:border-primary transition" placeholder="Nhập mật khẩu" />
            </div>

            <button type="submit" className="w-full bg-dark text-white font-heading uppercase text-lg py-4 hover:bg-primary border-inner transition">
              Đăng Nhập
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-500">
            Chưa có tài khoản? <Link to="/register" className="text-primary font-bold hover:underline">Tạo tài khoản mới</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;