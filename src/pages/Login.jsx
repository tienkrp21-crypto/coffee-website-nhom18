import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BASE_URL = 'https://coffee-website-nhom18-1.onrender.com';

const Login = () => {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate(); // Công cụ điều hướng trang 
  
  //Tạo hộp chứa để lưu Email và Password khách nhập
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // HÀM CẬP NHẬT DỮ LIỆU 
  // Mỗi khi gõ phím, hàm này sẽ lấy 'name' của ô input để biết sếp gõ ở ô nào,
  // sau đó lấy 'value' (nội dung sếp gõ) để cập nhật vào formData.
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // HÀM XỬ LÝ KHI BẤM NÚT ĐĂNG NHẬP
  const handleSubmit = async (e) => {
    e.preventDefault(); // Chặn trang web tự động load lại 
    
    try {
      // Gửi yêu cầu lên Backend
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: 'POST', // Dùng POST để gửi thông tin bảo mật
        headers: { 'Content-Type': 'application/json' }, // Báo cho Backend biết gửi file JSON
        body: JSON.stringify(formData) // Biến formData thành chuỗi JSON để truyền đi
      });
      
      //Kiểm tra kết quả phản hồi từ Backend
      if (response.ok) {
        // Nếu thành công nhận dữ liệu User (id, tên, mail...) từ máy chủ
        const userData = await response.json(); 
        // LƯU TRỮ BỀN VỮNG (LOCALSTORAGE)
        // Lưu toàn bộ Object User vào trình duyệt để khi sang trang Profile 
        localStorage.setItem('user', JSON.stringify(userData));
        
        alert("Đăng nhập thành công!");
        
        // Dùng window.location.href để ép trang web tải lại toàn bộ.
        // Việc này giúp Header nhận diện được User mới và cập nhật con số Giỏ hàng ngay lập tức.
        window.location.href = '/'; 
      } else {
        // Nếu thất bại (401: sai pass, 400: sai định dạng), lấy lỗi từ Backend gửi về in ra
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
            <h2 className="font-serif text-4xl text-[#2B2825] uppercase mb-2">Đăng Nhập</h2>
            <div className="w-16 h-1 bg-[#E88F2A] mx-auto"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              {/* Ô NHẬP EMAIL: Sếp để name="email" để hàm handleChange bắt được */}
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
              {/* Ô NHẬP PASSWORD: Sếp để name="password" */}
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
              VÀO CỬA HÀNG
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