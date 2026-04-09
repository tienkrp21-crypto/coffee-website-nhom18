import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import LoadingPage from '../components/LoadingPage';

// Cập nhật URL Backend mới
const BASE_URL = 'https://coffee-website-nhom18-1.onrender.com';

const Checkout = () => {
  const { cartItems, clearCart } = useCart(); 
  const navigate = useNavigate();
  
  // 1. Quản lý trạng thái Form
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    note: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 30000;

  // 2. Tự động điền thông tin nếu đã đăng nhập 
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // fetch profile ở đây để điền sẵn tên/sđt/email vào form
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 3. LOGIC GỬI ĐƠN HÀNG LÊN BACKEND
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderData = {
      customer: formData,
      items: cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: totalPrice + shippingFee,
      paymentMethod,
      orderDate: new Date().toISOString()
    };

    try {
      const response = await fetch(`${BASE_URL}/checkout`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Gửi token nếu Backend yêu cầu xác thực
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Đặt hàng thành công! CafeMaterial đang chuẩn bị món cho bạn.");
        if (clearCart) clearCart(); // Xóa sạch giỏ hàng
        navigate('/payment-result', { state: { orderId: result.orderId || result.id } }); // Chuyển sang trang kết quả với ID thật
      } else {
        const errorMsg = await response.text();
        alert(`Lỗi đặt hàng: ${errorMsg}`);
      }
    } catch (error) {
      alert("Không thể kết nối với server thanh toán kiểm tra lại nhé!");
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
      {/* HEADER TRANG  */}
      <div className="container-fluid bg-dark p-12 mb-12 flex items-center justify-center relative shadow-lg"
        style={{ backgroundImage: 'linear-gradient(rgba(43, 40, 37, .8), rgba(43, 40, 37, .8)), url("https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1920")', backgroundSize: 'cover' }}>
        <div className="text-center z-10 py-10">
          <h1 className="text-white font-serif text-6xl mb-4 italic">Thanh toán</h1>
          <div className="flex items-center justify-center gap-3 text-white font-black uppercase text-xs tracking-widest">
            <Link to="/cart" className="hover:text-primary transition">Giỏ hàng</Link>
            <span className="text-primary">■</span>
            <span className="text-gray-400">Xác nhận đơn hàng</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-10">
          
          {/* CỘT TRÁI: THÔNG TIN GIAO HÀNG */}
          <div className="w-full lg:w-2/3">
            <div className="bg-secondary p-10 shadow-xl border-t-4 border-primary">
              <h3 className="font-serif text-3xl text-dark mb-8 border-b border-gray-200 pb-4 italic">Thông tin giao hàng</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Họ và tên người nhận *</label>
                  <input name="fullName" type="text" required value={formData.fullName} onChange={handleInputChange} className="w-full bg-white border border-gray-100 px-4 py-3 focus:border-primary outline-none transition font-serif" placeholder="VD: Trương Hùng Dũng" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Số điện thoại *</label>
                  <input name="phone" type="tel" required value={formData.phone} onChange={handleInputChange} className="w-full bg-white border border-gray-100 px-4 py-3 focus:border-primary outline-none transition" placeholder="09xxxxxxxx" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Email (Nhận hóa đơn điện tử)</label>
                <input name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white border border-gray-100 px-4 py-3 focus:border-primary outline-none transition font-serif" placeholder="dung100504@gmail.com" />
              </div>

              <div className="mb-6">
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Địa chỉ giao hàng chi tiết *</label>
                <input name="address" type="text" required value={formData.address} onChange={handleInputChange} className="w-full bg-white border border-gray-100 px-4 py-3 focus:border-primary outline-none transition" placeholder="Số nhà, tên đường, phường, quận..." />
              </div>

              <div className="mb-10">
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Ghi chú (Tùy chọn)</label>
                <textarea name="note" rows="3" value={formData.note} onChange={handleInputChange} className="w-full bg-white border border-gray-100 px-4 py-3 focus:border-primary outline-none transition" placeholder="Ví dụ: Giao vào giờ hành chính..."></textarea>
              </div>

              <h3 className="font-serif text-2xl text-dark mb-6 italic">Phương thức thanh toán</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PaymentOption id="cod" label="Tiền mặt (COD)" current={paymentMethod} set={setPaymentMethod} />
                <PaymentOption id="vnpay" label="Chuyển khoản VNPAY" current={paymentMethod} set={setPaymentMethod} />
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
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-sm" />
                      <div>
                        <p className="font-serif text-sm line-clamp-1">{item.name}</p>
                        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">SL: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-serif text-primary text-sm">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-8 pt-4 border-t border-gray-700">
                <div className="flex justify-between text-gray-400 text-xs font-black uppercase tracking-widest">
                  <span>Tạm tính:</span>
                  <span className="text-white font-serif text-base">{totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-gray-400 text-xs font-black uppercase tracking-widest">
                  <span>Phí giao hàng:</span>
                  <span className="text-white font-serif text-base">{shippingFee.toLocaleString('vi-VN')}đ</span>
                </div>
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