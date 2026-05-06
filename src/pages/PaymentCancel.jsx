import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { XCircle, ShoppingBag, Loader2 } from 'lucide-react'; 

//const BASE_URL = 'https://coffee-website-nhom18-1.onrender.com';
const BASE_URL = 'http://localhost:8080';

const PaymentCancel = () => {
  const location = useLocation();
  const [status, setStatus] = useState('processing'); 
  
  // 1. LẤY MÃ ĐƠN CẦN HỦY
  // PayOS đá về kèm mã orderCode (VD: ?orderCode=123456)
  const queryParams = new URLSearchParams(location.search);
  const orderCode = queryParams.get('orderCode');

  // 2. GỌI API BÁO BACKEND HỦY ĐƠN VÀ TRẢ HÀNG VỀ KHO
  useEffect(() => {
    const cancelOrder = async () => {
      if (!orderCode) {
        setStatus('error'); // Nếu không có mã thì báo lỗi
        return;
      }

      try {
        // Dùng phương thức PUT để cập nhật trạng thái đơn thành CANCELLED
        const response = await fetch(`${BASE_URL}/orders/cancel-by-code/${orderCode}`, {
          method: 'PUT'
        });

        if (response.ok) {
          setStatus('success'); // Thành công thì đổi giao diện
        } else {
          setStatus('error');
        }
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setStatus('error');
      }
    };

    cancelOrder(); // Kích hoạt ngay khi trang vừa load xong
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
            <p className="text-gray-500 italic">
              Đơn hàng đã được hủy. Các món vẫn đang nằm trong giỏ, sếp quay lại kiểm tra và đặt lại nhé!
            </p>
            {/* Đã đổi link dẫn khách quay lại Giỏ hàng để thanh toán lại */}
            <Link to="/cart" className="inline-flex items-center gap-2 bg-primary text-dark px-8 py-3 uppercase font-black text-xs tracking-widest hover:bg-white border-inner border-inner-dark transition shadow-lg">
              <ShoppingBag size={16} /> Quay lại Giỏ hàng
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