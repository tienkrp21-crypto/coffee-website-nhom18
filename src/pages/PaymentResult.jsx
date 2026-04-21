import React, { useEffect } from "react";
import { useLocation } from "react-router-dom"; 
import { CheckCircle, Home, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext"; 

const PaymentResult = () => {
  const { clearCart } = useCart(); 
  const location = useLocation();
  
  // 1. NHẶT MÃ ĐƠN HÀNG TRÊN URL
  // PayOS sẽ trả về các tham số trên đường dẫn (VD: ?orderId=123&vnp_ResponseCode=00)
  const queryParams = new URLSearchParams(location.search);
  const vnpResponseCode = queryParams.get("vnp_ResponseCode");
  
  // Rào chắn nhiều nguồn: Ưu tiên orderId trong state (COD), nếu không có thì lấy trên URL (Online)
  const orderId = location.state?.orderId || queryParams.get("orderId") || queryParams.get("vnp_TxnRef") || "Đang cập nhật...";

  // 2. DỌN DẸP GIỎ HÀNG
  useEffect(() => {
    // Xác định giao dịch thành công khi: Có orderId (COD) HOẶC mã trả về là '00' (VNPay/PayOS)
    const isSuccess = location.state?.orderId || vnpResponseCode === "00";

    if (isSuccess) {
      clearCart(); // Dọn giỏ hàng để khách đặt đơn mới
    }
  }, [location, vnpResponseCode, clearCart]);

  return (
    <div className="font-sans text-gray-600 bg-white pb-20 min-h-screen">
      {/* Background Header */}
      <div
        className="container-fluid bg-dark p-12 mb-12 flex items-center justify-center relative"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(43, 40, 37, .7), rgba(43, 40, 37, .7)), url("https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1920")', 
          backgroundSize: "cover", 
          backgroundPosition: "center" 
        }}
      >
        <div className="text-center z-10 py-10">
          <h1 className="display-4 text-uppercase text-white font-heading text-5xl mb-4 italic">Hoàn Tất</h1>
          <div className="flex items-center justify-center gap-3 text-white font-heading text-lg">
            <a href="/" className="hover:text-primary transition">Trang chủ</a>
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

          {/* Hộp thông tin chi tiết */}
          <div className="p-6 bg-[#FAF3EB] border border-gray-200 mb-10 inline-block text-left max-w-lg w-full shadow-inner">
            <h4 className="font-heading text-xl text-dark mb-3 border-b pb-2 uppercase">Thông tin đơn hàng</h4>
            <ul className="text-sm text-gray-600 space-y-3 italic">
              <li className="flex gap-2"><span className="text-primary font-bold">•</span> Hóa đơn đã được lưu vào Lịch sử mua hàng.</li>
              <li className="flex gap-2"><span className="text-primary font-bold">•</span> Đơn hàng sẽ được giao đến bạn trong vòng 2-4 ngày.</li>
              <li className="flex gap-2"><span className="text-primary font-bold">•</span> Barista sẽ gọi điện xác nhận trước khi giao.</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {/* Ép tải lại trang để làm sạch toàn bộ State cũ */}
            <button 
                onClick={() => window.location.href = "/products"}
                className="flex items-center justify-center gap-2 bg-primary text-dark font-heading px-8 py-4 uppercase text-lg hover:bg-white border-inner border-inner-dark transition w-full sm:w-auto"
            >
              <ShoppingBag size={20} /> Tiếp tục mua sắm
            </button>
            
            <button 
                onClick={() => window.location.href = "/"}
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