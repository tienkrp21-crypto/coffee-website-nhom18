import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { XCircle, ArrowLeft, Loader2 } from 'lucide-react';

const BASE_URL = 'https://coffee-website-nhom18-1.onrender.com';

const PaymentCancel = () => {
  const location = useLocation();
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
  
  // Lấy mã orderCode từ URL (Ví dụ: ?orderCode=123456) [cite: 33, 35]
  const queryParams = new URLSearchParams(location.search);
  const orderCode = queryParams.get('orderCode');

  useEffect(() => {
    const cancelOrder = async () => {
      if (!orderCode) {
        setStatus('error');
        return;
      }

      try {
        // Gọi API báo Backend hủy đơn và trả lại kho [cite: 37]
        const response = await fetch(`${BASE_URL}/orders/cancel-by-code/${orderCode}`, {
          method: 'PUT'
        });

        if (response.ok) {
          setStatus('success'); // Hiển thị: Bạn đã hủy thanh toán thành công [cite: 38]
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error("Lỗi gọi API hủy đơn:", error);
        setStatus('error');
      }
    };

    cancelOrder();
  }, [orderCode]);

  return (
    <div className="min-h-screen bg-[#FAF3EB] flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-md shadow-2xl p-10 border-t-4 border-red-500 text-center">
        
        {status === 'processing' && (
          <div className="space-y-4">
            <Loader2 className="mx-auto text-gray-400 animate-spin" size={48} />
            <h2 className="text-xl font-bold text-gray-800">Đang xử lý hủy đơn hàng...</h2>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <XCircle className="mx-auto text-red-500" size={64} />
            <h2 className="text-2xl font-bold text-gray-800 uppercase">Hủy thanh toán thành công</h2>
            <p className="text-gray-500 italic">Bạn đã hủy thanh toán đơn hàng #{orderCode} thành công. Cảm ơn bạn đã báo cho chúng tôi.</p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-dark text-white px-8 py-3 uppercase font-bold text-xs tracking-widest hover:bg-primary transition">
              <ArrowLeft size={16} /> Quay lại Menu
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <XCircle className="mx-auto text-gray-400" size={64} />
            <h2 className="text-2xl font-bold text-gray-800 uppercase">Có lỗi xảy ra</h2>
            <p className="text-gray-500">Hệ thống không tìm thấy mã đơn hàng cần hủy hoặc đơn đã được xử lý.</p>
            <Link to="/" className="inline-block text-primary font-bold hover:underline">Về trang chủ</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentCancel;