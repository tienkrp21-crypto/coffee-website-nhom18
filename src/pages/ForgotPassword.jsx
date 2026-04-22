import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const BASE_URL = 'https://coffee-website-nhom18-1.onrender.com';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0); 
  
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // 1. Xử lý Lấy mã OTP
  const handleGetOtp = async () => {
    if (!email) return alert("Vui lòng nhập Email trước nhé!");
    setLoadingSend(true);
    
    try {
      const response = await fetch(`${BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      });
      
      // FIX LỖI: Vì Backend trả về String nên dùng .text() thay vì .json()
      const message = await response.text(); 
      
      if (response.ok) {
        setCountdown(60); 
        alert(message); // "Đã gửi mã OTP..."
      } else {
        alert(message || "Email này chưa đăng ký!");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Không kết nối được với máy chủ Render!");
    } finally {
      setLoadingSend(false);
    }
  };

  // 2. Xử lý Xác nhận đổi mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword) return alert("Điền đủ mã OTP và mật khẩu mới nha!");
    
    setLoadingConfirm(true);
    try {
      const response = await fetch(`${BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email, 
          newPassword: newPassword, 
          otpCode: otp // FIX LỖI: Đổi tên từ otp thành otpCode cho khớp Backend
        }),
      });

      const message = await response.text();

      if (response.ok) {
        alert("Thành công! Mật khẩu đã được thay đổi.");
        navigate('/'); 
      } else {
        alert(message || "Mã OTP không đúng hoặc hết hạn!");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Lỗi hệ thống khi đổi mật khẩu!");
    } finally {
      setLoadingConfirm(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF3EB] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md shadow-2xl p-10 border-t-4 border-[#8B4513]">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Quên Mật Khẩu</h2>
          <div className="w-16 h-1 bg-[#8B4513] mx-auto"></div>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Email</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-100 outline-none bg-gray-50 focus:border-[#8B4513]" 
              placeholder="Nhập email đã đăng ký"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Mật khẩu mới</label>
            <input 
              type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-100 outline-none bg-gray-50 focus:border-[#8B4513]" 
            />
          </div>

          <div className="flex gap-2 items-end">
            <div className="flex-grow">
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Mã OTP</label>
              <input 
                type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} 
                className="w-full px-4 py-3 border border-gray-100 outline-none bg-gray-50 focus:border-[#8B4513]" 
              />
            </div>
            
            <button 
              type="button" onClick={handleGetOtp} disabled={loadingSend || countdown > 0}
              className={`px-4 py-3.5 text-xs font-bold uppercase min-w-[100px] h-[50px] flex items-center justify-center
                ${countdown > 0 ? 'bg-gray-200 text-gray-400' : 'bg-black text-white hover:bg-[#8B4513]'}`}
            >
              {loadingSend ? <Loader2 className="animate-spin" size={18} /> : (countdown > 0 ? `${countdown}s` : "Lấy mã")}
            </button>
          </div>

          <button type="submit" disabled={loadingConfirm} className="w-full bg-black text-white py-4 font-black uppercase text-xs tracking-widest hover:bg-[#8B4513] flex items-center justify-center gap-3">
            {loadingConfirm ? <Loader2 className="animate-spin" /> : "Xác nhận đổi mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;