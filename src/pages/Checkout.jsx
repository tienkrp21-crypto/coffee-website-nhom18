import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const Checkout = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 30000; // Phí ship mặc định 30k

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    navigate('/payment-result');
  };
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-secondary">
        <h1 className="font-heading text-4xl text-dark mb-4">Bạn chưa chọn sản phẩm nào!</h1>
        <Link to="/products" className="text-primary hover:underline font-heading uppercase text-lg">Quay lại Menu</Link>
      </div>
    );
  }

  return (
    <div className="font-sans text-gray-600 bg-white pb-20">
      
      {/* 1. PAGE HEADER*/}
      <div 
        className="container-fluid bg-dark p-12 mb-12 flex items-center justify-center relative"
        style={{
          backgroundImage: 'linear-gradient(rgba(43, 40, 37, .7), rgba(43, 40, 37, .7)), url("https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1920")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="text-center z-10 py-10">
          <h1 className="display-4 text-uppercase text-white font-heading text-5xl mb-4">Thanh toán</h1>
          <div className="flex items-center justify-center gap-3 text-white font-heading text-lg">
            <Link to="/cart" className="hover:text-primary transition">Giỏ hàng</Link>
            <span className="text-primary text-xs">■</span>
            <span className="text-gray-400">Thanh toán</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-10">
          
          {/*   CỘT TRÁI: THÔNG TIN GIAO HÀNG*/}
          <div className="w-full lg:w-2/3">
            <div className="bg-secondary border-inner p-8">
              <h3 className="font-heading text-2xl text-dark uppercase mb-8 border-b border-gray-300 pb-4">Thông tin giao hàng</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-dark font-heading uppercase text-sm mb-2">Họ và tên *</label>
                  <input type="text" required className="w-full bg-white border border-gray-200 px-4 py-3 focus:outline-none focus:border-primary transition" placeholder="Nhập họ tên người nhận" />
                </div>
                <div>
                  <label className="block text-dark font-heading uppercase text-sm mb-2">Số điện thoại *</label>
                  <input type="tel" required className="w-full bg-white border border-gray-200 px-4 py-3 focus:outline-none focus:border-primary transition" placeholder="Nhập số điện thoại" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-dark font-heading uppercase text-sm mb-2">Email</label>
                <input type="email" className="w-full bg-white border border-gray-200 px-4 py-3 focus:outline-none focus:border-primary transition" placeholder="Email để nhận biên lai" />
              </div>

              <div className="mb-6">
                <label className="block text-dark font-heading uppercase text-sm mb-2">Địa chỉ giao hàng *</label>
                <input type="text" required className="w-full bg-white border border-gray-200 px-4 py-3 focus:outline-none focus:border-primary transition" placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố" />
              </div>

              <div className="mb-8">
                <label className="block text-dark font-heading uppercase text-sm mb-2">Ghi chú đơn hàng (Tùy chọn)</label>
                <textarea rows="4" className="w-full bg-white border border-gray-200 px-4 py-3 focus:outline-none focus:border-primary transition" placeholder="Ghi chú về thời gian giao hàng, chỉ dẫn địa chỉ..."></textarea>
              </div>

              {/* CHỌN PHƯƠNG THỨC THANH TOÁN */}
              <h3 className="font-heading text-xl text-dark uppercase mb-4 border-b border-gray-300 pb-2">Phương thức thanh toán</h3>
              <div className="space-y-4">
                <label className={`flex items-center p-4 border cursor-pointer transition ${paymentMethod === 'cod' ? 'border-primary bg-primary/10' : 'border-gray-300 bg-white hover:border-primary'}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="mr-4 w-5 h-5 accent-primary" />
                  <span className="font-heading text-dark text-lg">Thanh toán khi nhận hàng (COD)</span>
                </label>
                
                <label className={`flex items-center p-4 border cursor-pointer transition ${paymentMethod === 'banking' ? 'border-primary bg-primary/10' : 'border-gray-300 bg-white hover:border-primary'}`}>
                  <input type="radio" name="payment" value="banking" checked={paymentMethod === 'banking'} onChange={() => setPaymentMethod('banking')} className="mr-4 w-5 h-5 accent-primary" />
                  <span className="font-heading text-dark text-lg">Chuyển khoản ngân hàng</span>
                </label>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG*/}
          <div className="w-full lg:w-1/3">
            <div className="bg-dark text-white border-inner p-8 sticky top-24">
              <h3 className="font-heading text-2xl text-primary uppercase mb-6 border-b border-gray-600 pb-4">Đơn hàng của bạn</h3>
              
              {/* Danh sách món thu gọn */}
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b border-gray-700 pb-2">
                    <div className="flex gap-3 items-center">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover" />
                      <div>
                        <p className="font-heading text-sm line-clamp-1">{item.name}</p>
                        <p className="text-gray-400 text-xs">SL: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-heading text-sm text-primary">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                  </div>
                ))}
              </div>

              {/* Tính tiền */}
              <div className="space-y-3 mb-6 pt-4 border-t border-gray-600">
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Tạm tính:</span>
                  <span className="font-heading text-white">{totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Phí giao hàng:</span>
                  <span className="font-heading text-white">{shippingFee.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>
              
              <div className="border-t border-gray-600 pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-heading uppercase text-primary">Tổng cộng:</span>
                  <span className="text-3xl font-heading text-primary">{(totalPrice + shippingFee).toLocaleString('vi-VN')}đ</span>
                </div>
              </div>
              
              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-dark font-heading text-xl uppercase py-4 hover:bg-white transition border-inner border-inner-dark">
                <CheckCircle size={24} /> Đặt hàng ngay
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Checkout;