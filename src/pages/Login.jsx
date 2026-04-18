import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Đảm bảo BASE_URL này khớp với link Render của sếp
const BASE_URL = 'https://coffee-website-nhom18-1.onrender.com';

const Login = () => {
  // eslint-disable-next-line no-unused-vars
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
      
      // Kiểm tra trạng thái phản hồi từ Backend
      if (response.ok) {
        // FIX: Nhận dữ liệu dạng JSON Object (chứa id, fullName, email, phone...)
        const userData = await response.json(); 

        // LƯU TRỮ THÔNG TIN USER VÀO TRÌNH DUYỆT
        // Lưu cả cục Object để trang Profile có thể lấy ra hiển thị ngay lập tức
        localStorage.setItem('user', JSON.stringify(userData));
        
        alert("Đăng nhập thành công!");
        window.location.href = '/'; // Dùng cái này để đồng bộ Giỏ hàng ngay lập tức
      } else {
        // Nếu Backend trả về 401 hoặc 400, lấy thông báo lỗi trả về
        const errorMsg = await response.text();
        alert(errorMsg || "Sai email hoặc mật khẩu!");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Lỗi: Không thể kết nối đến máy chủ Render!");
    }
  };

  return (
    <div className="font-sans text-gray-600 bg-[#FAF3EB] min-h-screen py-20 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white border-2 border-[#2B2825]/10 p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl text-[#2B2825] uppercase mb-2">Đăng Nhập</h1>
            <div className="w-16 h-1 bg-[#E88F2A] mx-auto"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[#2B2825] font-bold uppercase text-[10px] tracking-widest mb-2">Email</label>
              <input 
                type="email" 
                name="email" 
                required 
                onChange={handleChange} 
                className="w-full bg-[#FAF3EB] border border-gray-100 px-4 py-3 outline-none focus:border-[#E88F2A] transition" 
                placeholder="Nhập địa chỉ email" 
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-[#2B2825] font-bold uppercase text-[10px] tracking-widest">Mật khẩu</label>
                <Link to="/forgot-password" size="sm" className="text-[#E88F2A] text-[10px] font-bold uppercase hover:underline">Quên mật khẩu?</Link>
              </div>
              <input 
                type="password" 
                name="password" 
                required 
                onChange={handleChange} 
                className="w-full bg-[#FAF3EB] border border-gray-100 px-4 py-3 outline-none focus:border-[#E88F2A] transition" 
                placeholder="Nhập mật khẩu" 
              />
            </div>

            <button type="submit" className="w-full bg-[#2B2825] text-white font-bold uppercase text-xs tracking-[0.2em] py-4 hover:bg-[#E88F2A] transition-all duration-300">
              Đăng Nhập
            </button>
            
            <div className="text-center mt-6">
              <p className="text-[10px] uppercase font-bold text-gray-400">
                Chưa có tài khoản? <Link to="/register" className="text-[#E88F2A] hover:underline ml-1">Đăng ký ngay</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;