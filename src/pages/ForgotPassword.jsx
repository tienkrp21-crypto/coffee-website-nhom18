import { Link } from "react-router-dom";

const ForgotPassword = () => (
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
          Nhập địa chỉ email của bạn và chúng tôi sẽ gửi liên kết đặt lại mật khẩu.
        </p>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ Email
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark"
            />
          </div>

          <button className="w-full bg-dark text-white py-4 rounded-full font-medium tracking-wide hover:bg-dark/90 transition-all">
            Gửi liên kết đặt lại
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="text-sm text-dark hover:text-dark/70 transition">
            ← Quay lại đăng nhập
          </Link>
        </div>
      </div>

      {/* Back to Shop */}
      <div className="text-center mt-6">
        <Link to="/" className="text-sm text-gray-600 hover:text-dark transition">
          ← Quay lại cửa hàng
        </Link>
      </div>
    </div>
  </div>
);

export default ForgotPassword;
