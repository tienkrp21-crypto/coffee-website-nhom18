import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, History } from 'lucide-react';
import { useCart } from '../context/CartContext';

const PaymentSuccess = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    // Dọn sạch giỏ hàng trên giao diện sau khi khách đã trả tiền thành công
    if (clearCart) clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-[#FAF3EB] flex items-center justify-center p-4 font-sans text-center">
      <div className="bg-white w-full max-w-md shadow-2xl p-10 border-t-4 border-green-600">
        <CheckCircle className="mx-auto text-green-600 mb-6 animate-bounce" size={72} />
        <h1 className="text-3xl font-bold text-dark uppercase mb-4">Thanh toán thành công</h1>
        <p className="text-gray-500 mb-8 italic">Cảm ơn bạn đã tin tưởng CafeMaterial! Đơn hàng của bạn đang được Barista chuẩn bị và sẽ sớm giao tới bạn.</p>
        
        <div className="space-y-4">
          <Link to="/order-history" className="flex items-center justify-center gap-3 bg-dark text-white w-full py-4 uppercase font-black text-xs tracking-widest hover:bg-primary transition shadow-lg">
            <History size={18} /> Theo dõi đơn hàng
          </Link>
          
          <Link to="/products" className="flex items-center justify-center gap-3 border-2 border-gray-100 text-gray-400 w-full py-4 uppercase font-black text-xs tracking-widest hover:border-primary hover:text-primary transition">
            <ShoppingBag size={18} /> Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;