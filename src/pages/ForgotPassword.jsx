import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';

const BASE_URL = 'https://coffee-website-nhom18.onrender.com'; //

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  // MẸO 2: Biến useState ngầm để lưu Token từ Backend gửi về
  const [otpToken, setOtpToken] = useState(''); 
  
  // MẸO 1: Trạng thái đồng hồ đếm ngược
  const [countdown, setCountdown] = useState(0); 
  
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);

  // Logic chạy đồng hồ đếm ngược
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // 1. Hàm xử lý Lấy mã OTP
  const handleGetOtp = async () => {
    if (!email) return alert("Dũng ơi, nhập Email trước khi lấy mã nhé!");
    
    setLoadingSend(true);
    try {
      const response = await fetch(`${BASE_URL}/users/got-pforassword/send-otp?email=${email}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const data = await response.json();
        // MẸO 2: Cất Token ẩn vào State ngay khi nhận được
        setOtpToken(data.token); 
        
        // MẸO 1: Khởi động đếm ngược 60 giây và khóa nút
        setCountdown(60); 
        alert("Mã OTP đã được gửi! Dũng kiểm tra hòm thư nhé.");
      } else {
        alert("Email này chưa đăng ký tài khoản rồi!");
      }
    } catch (error) {
      alert("Lỗi kết nối máy chủ rồi Dũng ơi!");
    } finally {
      setLoadingSend(false);
    }
  };

  // 2. Hàm xử lý Xác nhận đổi mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword) return alert("Dũng điền nốt mã OTP và mật khẩu mới nha!");
    
    setLoadingConfirm(true);
    try {
      const response = await fetch(`${BASE_URL}/users/confirm-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          newPassword, 
          otp,
          token: otpToken // MẸO 2: Đính kèm Token ẩn để Tiến kiểm duyệt
        }),
      });

      if (response.ok) {
        alert("Tuyệt vời! Mật khẩu mới đã sẵn sàng.");
        navigate('/'); // Về Home để hiện Modal đăng nhập mới
      } else {
        alert("Mã OTP bị sai hoặc đã hết hạn rồi Dũng ơi!");
      }
    } catch (error) {
      alert("Lỗi hệ thống khi đổi mật khẩu!");
    } finally {
      setLoadingConfirm(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF3EB] flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-md shadow-2xl p-10 border-t-4 border-primary">
        
        <div className="text-center mb-10">
          <h2 className="font-serif text-4xl text-dark italic mb-2">Quên Mật Khẩu</h2>
          <div className="w-16 h-1 bg-primary mx-auto"></div>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Địa chỉ Email</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full px-4 py-3 border border-gray-100 focus:border-primary outline-none transition bg-gray-50 font-serif"
            />
          </div>

          {/* Mật khẩu mới */}
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Mật khẩu mới</label>
            <input 
              type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-100 focus:border-primary outline-none transition bg-gray-50"
            />
          </div>

          {/* OTP & Nút lấy mã */}
          <div className="flex gap-2 items-end">
            <div className="flex-grow">
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Mã OTP</label>
              <input 
                type="text" required value={otp} onChange={(e) => setOtp(e.target.value)}
                placeholder="6 ký tự"
                className="w-full px-4 py-3 border border-gray-100 focus:border-primary outline-none transition bg-gray-50"
              />
            </div>
            
            {/* Nút Lấy mã: Bị khóa nếu đang đếm ngược */}
            <button 
              type="button" 
              onClick={handleGetOtp} 
              disabled={loadingSend || countdown > 0}
              className={`px-4 py-3.5 text-xs font-bold uppercase transition-all min-w-[100px]
                ${countdown > 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-dark text-white hover:bg-primary'}`}
            >
              {loadingSend ? <Loader2 className="animate-spin mx-auto" size={18} /> : (countdown > 0 ? `${countdown}s` : "Lấy mã")}
            </button>
          </div>

          <button 
            type="submit" disabled={loadingConfirm}
            className="w-full bg-dark text-white py-4 font-black uppercase text-xs tracking-[0.3em] hover:bg-primary transition-all flex items-center justify-center gap-3 shadow-lg"
          >
            {loadingConfirm ? <Loader2 className="animate-spin" /> : "Xác nhận đổi mật khẩu"}
          </button>
        </form>

        <div className="mt-8 text-center border-t pt-6">
          <Link to="/" className="text-gray-400 hover:text-primary transition-all text-xs font-bold uppercase flex items-center justify-center gap-2">
            <ArrowLeft size={14} /> Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;