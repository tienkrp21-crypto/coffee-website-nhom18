import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  // 1. Tạo "bộ nhớ" để lưu email người dùng nhập vào
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 2. Hàm "Động cơ" xử lý khi bấm nút Gửi
  const handleSubmit = async (e) => {
    e.preventDefault(); // Thần chú chống load lại trang!
    setLoading(true);

    try {
      // Gọi sang Backend Render của bạn
      const response = await fetch(
        `https://coffee-website-nhom18.onrender.com/users/forgot-password?email=${email}`,
        {
          method: "POST",
        },
      );

      const message = await response.text();

      if (response.ok) {
        alert("Thành công! Kiểm tra Email để nhận mật khẩu mới nhé.");
        navigate("/login"); // Chuyển về trang đăng nhập
      } else {
        alert(message || "Có lỗi xảy ra, vui lòng thử lại sau.");
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
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="font-serif text-3xl font-bold text-dark tracking-wider">
              Xutore
            </h1>
          </Link>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-white border border-gray-200 p-10">
          <h2 className="font-serif text-3xl text-dark text-center mb-4">
            Quên mật khẩu
          </h2>

          <p className="text-gray-600 text-center mb-8 text-sm">
            Nhập địa chỉ email của bạn và chúng tôi sẽ gửi liên kết đặt lại mật
            khẩu.
          </p>

          {/* Lắp động cơ handleSubmit vào Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ Email
              </label>
              <input
                type="email"
                required
                value={email} // Gắn giá trị vào bộ nhớ
                onChange={(e) => setEmail(e.target.value)} // Cập nhật bộ nhớ khi gõ chữ
                placeholder="email@example.com"
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-dark text-white py-4 rounded-full font-medium tracking-wide hover:bg-dark/90 transition-all disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Gửi liên kết đặt lại"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="text-sm text-dark hover:text-dark/70 transition"
            >
              ← Quay lại đăng nhập
            </Link>
          </div>
        </div>

        {/* Back to Shop */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-dark transition"
          >
            ← Quay lại cửa hàng
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
