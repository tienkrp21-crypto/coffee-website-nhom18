import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';

const BASE_URL = 'https://coffee-website-nhom18-1.onrender.com';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  const [otpToken, setOtpToken] = useState(''); 
  const [countdown, setCountdown] = useState(0); 
  
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);

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
    if (!email) return alert("Vui lòng nhập Email trước khi lấy mã nhé!");
    setLoadingSend(true);
    
    try {
      const response = await fetch(`${BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      });
      
      if (response.ok) {
        const data = await response.json();
        setOtpToken(data.token); 
        
        setCountdown(60); 
        alert("Mã OTP đã được gửi! Bạn kiểm tra hòm thư nhé.");
      } else {
        alert("Email này chưa đăng ký tài khoản!");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Lỗi kết nối máy chủ!");
    } finally {
      setLoadingSend(false);
    }
  };

  // 2. Hàm xử lý Xác nhận đổi mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword) return alert("Điền đủ mã OTP và mật khẩu mới nha!");
    
    setLoadingConfirm(true);
    try {
  
      const response = await fetch(`${BASE_URL}/users/confirm-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          newPassword, 
          otp,
          token: otpToken 
        }),
      });

      if (response.ok) {
        alert("Tuyệt vời! Mật khẩu mới đã sẵn sàng.");
        navigate('/'); 
      } else {
        alert("Mã OTP bị sai hoặc đã hết hạn!");
      }
    // eslint-disable-next-line no-unused-vars
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
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Địa chỉ Email</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-100 focus:border-primary outline-none transition bg-gray-50 mb-1" 
              placeholder="email@example.com"
            />
            <p className="text-[10px] text-primary italic">
              * Vui lòng kiểm tra cả mục Spam/Quảng cáo nếu không thấy mã.
            </p>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Mật khẩu mới</label>
            <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-100 focus:border-primary outline-none transition bg-gray-50" />
          </div>

          <div className="flex gap-2 items-end">
            <div className="flex-grow">
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Mã OTP</label>
              <input type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full px-4 py-3 border border-gray-100 focus:border-primary outline-none transition bg-gray-50" />
            </div>
            
            <button 
              type="button" 
              onClick={handleGetOtp} 
              disabled={loadingSend || countdown > 0}
              className={`px-4 py-3.5 text-xs font-bold uppercase transition-all min-w-[100px] h-[50px] flex items-center justify-center
                ${countdown > 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-dark text-white hover:bg-primary'}`}
            >
              {loadingSend ? <Loader2 className="animate-spin" size={18} /> : (countdown > 0 ? `${countdown}s` : "Lấy mã")}
            </button>
          </div>

          <button type="submit" disabled={loadingConfirm} className="w-full bg-dark text-white py-4 font-black uppercase text-xs tracking-[0.3em] hover:bg-primary transition-all flex items-center justify-center gap-3 mt-4">
            {loadingConfirm ? <Loader2 className="animate-spin" /> : "Xác nhận đổi mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;