import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle, Home, ShoppingBag } from "lucide-react";

const PaymentResult = () => {
  const location = useLocation();
  // LẤY MÃ ĐƠN HÀNG THẬT TỪ CHECKOUT CHUYỂN SANG
  const orderId = location.state?.orderId || "Đang cập nhật...";

  return (
    <div className="font-sans text-gray-600 bg-white pb-20 min-h-screen">
      <div
        className="container-fluid bg-dark p-12 mb-12 flex items-center justify-center relative"
        style={{ backgroundImage: 'linear-gradient(rgba(43, 40, 37, .7), rgba(43, 40, 37, .7)), url("https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1920")', backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="text-center z-10 py-10">
          <h1 className="display-4 text-uppercase text-white font-heading text-5xl mb-4">Hoàn Tất</h1>
          <div className="flex items-center justify-center gap-3 text-white font-heading text-lg">
            <Link to="/" className="hover:text-primary transition">Trang chủ</Link>
            <span className="text-primary text-xs">■</span>
            <span className="text-gray-400">Thành công</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-secondary border-inner p-10 md:p-16 text-center shadow-sm">
          <CheckCircle size={80} className="mx-auto text-primary mb-6" />

          <h2 className="text-4xl md:text-5xl font-heading text-dark uppercase mb-4">Đặt hàng thành công!</h2>
          <p className="text-lg text-gray-600 mb-2">Cảm ơn bạn đã tin tưởng và lựa chọn nguyên liệu tại CafeMaterial.</p>

          <p className="text-gray-500 mb-8">
            Mã đơn hàng của bạn là:{" "}
            <strong className="text-primary font-heading text-2xl tracking-wider">
              #CF{orderId}
            </strong>
          </p>

          <div className="p-6 bg-white border border-gray-200 mb-10 inline-block text-left max-w-lg w-full shadow-inner">
            <h4 className="font-heading text-xl text-dark mb-3 border-b pb-2 uppercase">Thông tin giao hàng</h4>
            <ul className="text-sm text-gray-600 space-y-3">
              <li className="flex gap-2"><span className="text-primary font-bold">•</span>Hóa đơn chi tiết đã được lưu vào Lịch sử mua hàng của bạn.</li>
              <li className="flex gap-2"><span className="text-primary font-bold">•</span>Đơn hàng sẽ được đóng gói và giao đến bạn trong vòng 2-4 ngày làm việc.</li>
              <li className="flex gap-2"><span className="text-primary font-bold">•</span>Nhân viên cửa hàng sẽ gọi điện xác nhận trước khi giao hàng.</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/products" className="flex items-center justify-center gap-2 bg-primary text-dark font-heading px-8 py-4 uppercase text-lg hover:bg-white border-inner border-inner-dark transition">
              <ShoppingBag size={20} /> Tiếp tục mua sắm
            </Link>
            <Link to="/" className="flex items-center justify-center gap-2 bg-dark text-white font-heading px-8 py-4 uppercase text-lg hover:bg-primary border-inner transition">
              <Home size={20} /> Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;