import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  // Bắt lấy cái mã Token từ trên thanh URL
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); 

  // Bộ nhớ lưu mật khẩu
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Kiểm tra xem có token trên URL không
    if (!token) {
      alert("Đường link không hợp lệ hoặc đã bị lỗi!");
      return;
    }

    // 2. Kiểm tra xem gõ lại pass có khớp không
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }

    setLoading(true);

    try {
      // 3. Gọi API sang Backend Render (truyền token và pass mới)
      const response = await fetch(`https://coffee-website-nhom18.onrender.com/users/reset-password?token=${token}&newPassword=${newPassword}`, {
        method: 'POST'
      });

      const message = await response.text();

      // 4. Xử lý kết quả
      if (response.ok) {
        alert("Thành công! Mật khẩu của bạn đã được thay đổi.");
        navigate('/login'); // Đá về trang đăng nhập
      } else {
        alert(message || "Có lỗi xảy ra. Đường link có thể đã hết hạn 15 phút.");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi kết nối đến máy chủ!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="font-serif text-3xl font-bold text-dark tracking-wider">
              Xutore
            </h1>
          </Link>
        </div>

        <div className="bg-white border border-gray-200 p-10">
          <h2 className="font-serif text-3xl text-dark text-center mb-4">
            Tạo mật khẩu mới
          </h2>
          
          <p className="text-gray-600 text-center mb-8 text-sm">
            Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
          </p>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu mới
              </label>
              <input
                type="password"
                required
                minLength="6"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập ít nhất 6 ký tự"
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhập lại mật khẩu mới
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Xác nhận lại mật khẩu"
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-dark text-white py-4 rounded-full font-medium tracking-wide hover:bg-dark/90 transition-all disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Lưu mật khẩu mới"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;