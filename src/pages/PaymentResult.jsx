import React, { useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom"; // Thêm useNavigate
import { CheckCircle, Home, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext"; 

const PaymentResult = () => {
  const { clearCart } = useCart(); 
  const location = useLocation();
  const navigate = useNavigate(); // Khai báo hook điều hướng
  
  const queryParams = new URLSearchParams(location.search);
  const vnpResponseCode = queryParams.get("vnp_ResponseCode");
  const orderId = location.state?.orderId || queryParams.get("orderId") || "Đang cập nhật...";

  useEffect(() => {
    const isSuccess = location.state?.orderId || vnpResponseCode === "00";

    if (isSuccess) {
      clearCart(); 
      console.log("Đã dọn dẹp giỏ hàng sau khi thanh toán thành công!");
    }
  }, [location, vnpResponseCode, clearCart]);

  // Hàm xử lý quay về trang chủ cưỡng ép
  const handleGoHome = (e) => {
    e.preventDefault(); // Chặn hành vi mặc định
    navigate("/", { replace: true }); // Chuyển hướng và xóa lịch sử URL cũ (VNPay params)
  };

  return (
    <div className="font-sans text-gray-600 bg-white pb-20 min-h-screen">
      <div
        className="container-fluid bg-dark p-12 mb-12 flex items-center justify-center relative"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(43, 40, 37, .7), rgba(43, 40, 37, .7)), url("https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1920")', 
          backgroundSize: "cover", 
          backgroundPosition: "center" 
        }}
      >
        <div className="text-center z-10 py-10">
          <h1 className="display-4 text-uppercase text-white font-heading text-5xl mb-4">Hoàn Tất</h1>
          <div className="flex items-center justify-center gap-3 text-white font-heading text-lg">
            {/* Sử dụng onClick thay vì Link to trực tiếp để đảm bảo điều hướng sạch */}
            <button onClick={handleGoHome} className="hover:text-primary transition">Trang chủ</button>
            <span className="text-primary">//</span>
            <span>Kết quả thanh toán</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center mb-6">
            <CheckCircle size={80} className="text-primary animate-bounce" />
          </div>
          
          <h2 className="font-heading text-4xl text-dark mb-4 uppercase">Thanh toán thành công!</h2>
          <p className="text-gray-500 text-lg mb-8">
            Cảm ơn bạn đã tin tưởng CafeMaterial. Đơn hàng <span className="text-primary font-bold">#{orderId}</span> của bạn đã được tiếp nhận.
          </p>

          <div className="p-6 bg-white border border-gray-200 mb-10 inline-block text-left max-w-lg w-full shadow-inner">
            <h4 className="font-heading text-xl text-dark mb-3 border-b pb-2 uppercase">Thông tin đơn hàng</h4>
            <ul className="text-sm text-gray-600 space-y-3">
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                Hóa đơn chi tiết đã được lưu vào Lịch sử mua hàng của bạn.
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                Đơn hàng sẽ được đóng gói và giao đến bạn trong vòng 2-4 ngày làm việc.
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                Nhân viên cửa hàng sẽ gọi điện xác nhận trước khi giao hàng.
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/products" className="flex items-center justify-center gap-2 bg-primary text-dark font-heading px-8 py-4 uppercase text-lg hover:bg-white border-inner border-inner-dark transition">
              <ShoppingBag size={20} /> Tiếp tục mua sắm
            </Link>
            
            {/* FIX: Đổi thẻ Link thành button điều hướng navigate */}
            <button 
                onClick={handleGoHome}
                className="flex items-center justify-center gap-2 bg-dark text-white font-heading px-8 py-4 uppercase text-lg hover:bg-primary border-inner transition w-full sm:w-auto"
            >
              <Home size={20} /> Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;