import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// 1. Địa chỉ máy chủ Backend (Tiến/Biện cung cấp)
const BASE_URL = 'https://coffee-website-nhom18-1.onrender.com';

const Register = () => {
  // 2. Dùng để chuyển hướng trang (ví dụ: đăng ký xong tự sang trang Login)
  const navigate = useNavigate();
  
  // 3. Khởi tạo "hộp chứa" dữ liệu người dùng nhập vào
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: ''
  });

  // 4. HÀM CẬP NHẬT DỮ LIỆU: Tự động nhặt phím sếp gõ để bỏ vào formData
  const handleChange = (e) => {
    // [e.target.name] giúp xác định sếp đang gõ ở ô fullName, email hay phone...
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 5. HÀM XỬ LÝ KHI BẤM NÚT ĐĂNG KÝ
  const handleSubmit = async (e) => {
    e.preventDefault(); // Chặn trang web load lại từ đầu khi gửi Form

    // --- PHẦN RÀNG BUỘC (VALIDATION) - "HÀNG RÀO" BẢO VỆ DỮ LIỆU ---
    
    // Chỉ cho phép chữ cái và khoảng trắng, ít nhất 3 ký tự
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]{3,}$/; 
    // Phải bắt đầu bằng số 0 và đủ 10 chữ số
    const phoneRegex = /^0\d{9}$/; 
    // Ít nhất 8 ký tự và PHẢI CÓ 1 CHỮ IN HOA
    const passRegex = /^(?=.*[A-Z]).{8,}$/; 

    // Kiểm tra từng ô, nếu sai thì báo "alert" và dừng lại không gửi lên server
    if (!nameRegex.test(formData.fullName.trim())) {
      return alert("Vui lòng nhập đúng Họ và tên!");
    }
    if (!phoneRegex.test(formData.phone)) {
      return alert("Số điện thoại không hợp lệ (Phải đủ 10 số và bắt đầu bằng 0)!");
    }
    if (!passRegex.test(formData.password)) {
      return alert("Mật khẩu cần ít nhất 8 ký tự và 1 chữ IN HOA!");
    }

    // --- GỌI API GỬI DỮ LIỆU LÊN BACKEND ---
    try {
      const response = await fetch(`${BASE_URL}/users/register`, {
        method: 'POST', // Dùng POST để gửi thông tin bảo mật
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData) // Chuyển Object thành chuỗi JSON để truyền đi
      });

      if (response.ok) {
        alert("Đăng ký thành công!");
        navigate('/login'); // Chuyển khách sang trang Đăng nhập
      } else {
        // Nếu Backend báo lỗi (ví dụ: trùng Email), in thông báo đó ra
        const errorMsg = await response.text();
        alert(errorMsg || "Đăng ký thất bại!");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Lỗi kết nối máy chủ!");
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