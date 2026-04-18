/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import LoadingPage from '../components/LoadingPage';

const BASE_URL = 'https://coffee-website-nhom18-1.onrender.com';

const Checkout = () => {
  const { cartItems, clearCart } = useCart(); 
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '', phone: '', email: '', address: '', note: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  // ĐÃ DỌN SẠCH CHỮ .PRODUCT
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 30000; 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault(); 
    setLoading(true);

    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
        alert("Sếp ơi, sếp phải đăng nhập mới đặt hàng được nhé!");
        setLoading(false);
        navigate('/login');
        return;
    }
    const userObj = JSON.parse(savedUser);
    const currentUserId = userObj.id; 

    const orderData = {
      receiverName: formData.fullName,
      receiverPhone: formData.phone,
      shippingAddress: formData.address,
      paymentMethod: paymentMethod === 'vnpay' ? 'VNPAY' : 'COD',
      userId: currentUserId, 
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      }))
    };

    try {
      const response = await fetch(`${BASE_URL}/checkout`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.paymentUrl) {
            window.location.href = result.paymentUrl;
        } else {
            if (clearCart) clearCart(); 
            alert("Đặt hàng thành công! CafeMaterial đang chuẩn bị món cho bạn.");
            navigate('/order-history'); 
        }
      } else {
        const errorMsg = await response.text();
        alert(`Lỗi đặt hàng: ${errorMsg}`);
      }
    } catch (error) {
      console.error(error); 
      alert("Lỗi mạng: Không thể kết nối với server thanh toán, vui lòng kiểm tra lại!");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-secondary">
        <h1 className="font-heading text-4xl text-dark mb-4 uppercase">Giỏ hàng đang trống!</h1>
        <Link to="/products" className="text-primary hover:underline font-heading uppercase text-lg tracking-widest">Quay lại Menu ngay</Link>
      </div>
    );
  }

  if (loading) return <LoadingPage />;

  return (
    <div className="font-sans text-gray-600 bg-white pb-20">
      <div className="container-fluid bg-dark p-12 mb-12 flex items-center justify-center relative shadow-lg"
        style={{ backgroundImage: 'linear-gradient(rgba(43, 40, 37, .8), rgba(43, 40, 37, .8)), url("https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1920")', backgroundSize: 'cover' }}>
        <div className="text-center z-10 py-10">
          <h1 className="text-white font-serif text-6xl mb-4 italic">Thanh toán</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-10">
          {/* CỘT TRÁI */}
          <div className="w-full lg:w-2/3">
            <div className="bg-secondary p-10 shadow-xl border-t-4 border-primary">
              <h3 className="font-serif text-3xl text-dark mb-8 border-b border-gray-200 pb-4 italic">Thông tin giao hàng</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Họ tên *</label>
                  <input name="fullName" type="text" required value={formData.fullName} onChange={handleInputChange} className="w-full bg-white border border-gray-100 px-4 py-3 focus:border-primary outline-none transition font-serif" placeholder="VD: Trương Hùng Dũng" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Số điện thoại *</label>
                  <input name="phone" type="tel" required value={formData.phone} onChange={handleInputChange} className="w-full bg-white border border-gray-100 px-4 py-3 focus:border-primary outline-none transition" placeholder="09xxxxxxxx" />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Địa chỉ giao hàng *</label>
                <input name="address" type="text" required value={formData.address} onChange={handleInputChange} className="w-full bg-white border border-gray-100 px-4 py-3 focus:border-primary outline-none transition" placeholder="Số nhà, tên đường..." />
              </div>

              <h3 className="font-serif text-2xl text-dark mb-6 mt-8 italic">Phương thức thanh toán</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PaymentOption id="cod" label="Tiền mặt (COD)" current={paymentMethod} set={setPaymentMethod} />
                <PaymentOption id="vnpay" label="Chuyển khoản VNPay" current={paymentMethod} set={setPaymentMethod} />
              </div>
            </div>
          </div>
          
          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
          <div className="w-full lg:w-1/3">
            <div className="bg-dark text-white p-8 sticky top-28 shadow-2xl border-b-4 border-primary">
              <h3 className="font-serif text-2xl text-primary mb-6 border-b border-gray-700 pb-4 italic">Đơn hàng của bạn</h3>
              <div className="space-y-4 mb-8 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b border-gray-800 pb-3">
                    <div className="flex gap-3 items-center">
                      {/* ĐÃ DỌN SẠCH CHỮ .PRODUCT */}
                      <img 
                        src={item.image?.startsWith("http") ? item.image : `${BASE_URL}/${item.image?.replace(/^\//, "")}`} 
                        alt={item.name} 
                        className="w-12 h-12 object-cover rounded-sm border border-gray-700" 
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=400"; }}
                      />
                      <div>
                        <p className="font-serif text-sm line-clamp-1">{item.name}</p>
                        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">SL: {item.quantity}</p>
                      </div>
                    </div>
                    {/* ĐÃ DỌN SẠCH CHỮ .PRODUCT */}
                    <span className="font-serif text-primary text-sm">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-8 pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                  <span className="text-primary font-black uppercase text-sm tracking-widest">Tổng cộng:</span>
                  <span className="text-3xl font-serif text-primary">{(totalPrice + shippingFee).toLocaleString('vi-VN')}đ</span>
                </div>
              </div>
              
              <button type="submit" className="w-full flex items-center justify-center gap-3 bg-primary text-dark font-black uppercase text-xs py-5 hover:bg-white transition-all tracking-[0.2em] shadow-lg">
                <CheckCircle size={20} /> Xác nhận đặt hàng
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const PaymentOption = ({ id, label, current, set }) => (
  <label className={`flex items-center p-4 border-2 cursor-pointer transition-all ${current === id ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white hover:border-primary/30'}`}>
    <input type="radio" checked={current === id} onChange={() => set(id)} className="mr-3 w-4 h-4 accent-primary" />
    <span className="font-black uppercase text-[10px] tracking-widest text-dark">{label}</span>
  </label>
);

export default Checkout;