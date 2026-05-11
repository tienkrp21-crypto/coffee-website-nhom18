/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Wallet, Banknote } from 'lucide-react';
import LoadingPage from '../components/LoadingPage';

// Cấu hình địa chỉ máy chủ
const BASE_URL = 'http://localhost:8080';

const Checkout = () => {
  const { cartItems, clearCart } = useCart(); 
  const navigate = useNavigate();
  
  // 1. STATE LƯU THÔNG TIN KHÁCH HÀNG & LỖI[cite: 3]
  const [formData, setFormData] = useState({
    fullName: '', phone: '', email: '', address: '', note: ''
  });
  const [errors, setErrors] = useState({}); // Lưu trữ các thông báo lỗi[cite: 3]

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  // Tính toán tiền bạc[cite: 3]
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 30000; 

  // 2. HÀM CẬP NHẬT INPUT & XÓA LỖI TẠM THỜI[cite: 3]
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Nếu đang gõ vào ô có lỗi, xóa thông báo lỗi đó đi[cite: 3]
    if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // const validateForm = () => {
  //   let newErrors = {};
  //   const nameRegex = /^[a-zA-ZÀ-ỹ\s]{3,}$/; // Ít nhất 3 chữ cái[cite: 1, 2]
  //   const phoneRegex = /^0\d{9}$/;           // Đủ 10 số, bắt đầu bằng 0[cite: 1, 2]

  //   if (!nameRegex.test(formData.fullName.trim())) {
  //     newErrors.fullName = "Họ tên người nhận không hợp lệ (ít nhất 3 chữ cái).";
  //   }
  //   if (!phoneRegex.test(formData.phone)) {
  //     newErrors.phone = "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0.";
  //   }
  //   if (formData.address.trim().length < 10) {
  //     newErrors.address = "Địa chỉ giao hàng quá ngắn, vui lòng nhập chi tiết hơn.";
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi[cite: 3]
  // };

  // 4. HÀM XỬ LÝ ĐẶT HÀNG[cite: 3]
  const handlePlaceOrder = async (e) => {
    e.preventDefault(); 
    
    // Kiểm tra ràng buộc trước khi gửi dữ liệu[cite: 3]
    // if (!validateForm()) return;

    setLoading(true);

    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
        alert("Bạn phải đăng nhập mới đặt hàng được nhé!");
        setLoading(false);
        navigate('/login');
        return;
    }
    const userObj = JSON.parse(savedUser);
    const mappedPaymentMethod = paymentMethod.toUpperCase();

    const orderData = {
      userId: userObj.id,
      receiverName: formData.fullName,
      receiverPhone: formData.phone,
      shippingAddress: formData.address,
      paymentMethod: mappedPaymentMethod, 
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
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
            window.location.href = result.paymentUrl; // Thanh toán Online[cite: 3]
        } else {
            if (clearCart) clearCart();
            alert("Đặt hàng thành công!");
            navigate('/order-history'); 
        }
      } else {
        const errorMsg = await response.text();
        alert(`Lỗi đặt hàng: ${errorMsg}`);
      }
    } catch (error) {
      alert("Lỗi kết nối máy chủ!");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF3EB]">
        <h1 className="font-heading text-4xl text-dark mb-4 uppercase text-center">Giỏ hàng đang trống!</h1>
        <Link to="/products" className="text-primary hover:underline font-heading uppercase text-lg tracking-widest">Quay lại Menu</Link>
      </div>
    );
  }

  if (loading) return <LoadingPage />;

  return (
    <div className="font-sans text-gray-600 bg-white pb-20">
      <div className="container-fluid bg-dark p-12 mb-12 flex items-center justify-center relative shadow-lg"
        style={{ backgroundImage: 'linear-gradient(rgba(43, 40, 37, .8), rgba(43, 40, 37, .8)), url("https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1920")', backgroundSize: 'cover' }}>
        <div className="text-center z-10 py-10">
          <h1 className="text-white font-serif text-6xl mb-4 italic uppercase tracking-tighter">Thanh toán</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-10">
          {/* CỘT TRÁI: THÔNG TIN GIAO HÀNG[cite: 3] */}
          <div className="w-full lg:w-2/3">
            <div className="bg-[#FAF3EB] p-10 shadow-xl border-t-4 border-primary">
              <h3 className="font-serif text-3xl text-dark mb-8 border-b border-gray-200 pb-4 italic">Thông tin giao hàng</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Họ tên người nhận *</label>
                  <input name="fullName" type="text" value={formData.fullName} onChange={handleInputChange} 
                    className={`w-full bg-white border ${errors.fullName ? 'border-red-500' : 'border-gray-100'} px-4 py-3 focus:border-primary outline-none transition font-serif`} 
                    placeholder="VD: Trương Hùng Dũng" />
                  {errors.fullName && <p className="text-red-500 text-[10px] mt-1 italic font-bold">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Số điện thoại *</label>
                  <input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} 
                    className={`w-full bg-white border ${errors.phone ? 'border-red-500' : 'border-gray-100'} px-4 py-3 focus:border-primary outline-none transition`} 
                    placeholder="09xxxxxxxx" />
                  {errors.phone && <p className="text-red-500 text-[10px] mt-1 italic font-bold">{errors.phone}</p>}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Địa chỉ giao hàng chi tiết *</label>
                <input name="address" type="text" value={formData.address} onChange={handleInputChange} 
                  className={`w-full bg-white border ${errors.address ? 'border-red-500' : 'border-gray-100'} px-4 py-3 focus:border-primary outline-none transition`} 
                  placeholder="Số nhà, tên đường, phường/xã..." />
                {errors.address && <p className="text-red-500 text-[10px] mt-1 italic font-bold">{errors.address}</p>}
              </div>

              <h3 className="font-serif text-2xl text-dark mb-6 mt-8 italic">Phương thức thanh toán</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PaymentOption id="cod" label="Tiền mặt (COD)" icon={<Banknote size={18}/>} current={paymentMethod} set={setPaymentMethod} />
                <PaymentOption id="payos" label="Cổng PayOS" icon={<Wallet size={18}/>} current={paymentMethod} set={setPaymentMethod} />
              </div>
            </div>
          </div>
          
          {/* CỘT PHẢI: TỔNG KẾT ĐƠN HÀNG[cite: 3] */}
          <div className="w-full lg:w-1/3">
            <div className="bg-dark text-white p-8 sticky top-28 shadow-2xl border-b-4 border-primary">
              <h3 className="font-serif text-2xl text-primary mb-6 border-b border-gray-700 pb-4 italic">Đơn hàng</h3>
              
              <div className="space-y-4 mb-8 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b border-gray-800 pb-3">
                    <div className="flex gap-3 items-center">
                      <img src={item.image?.startsWith("http") ? item.image : `${BASE_URL}/${item.image?.replace(/^\//, "")}`} 
                        alt={item.name} className="w-12 h-12 object-cover border border-gray-700" 
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=400"; }} />
                      <div>
                        <p className="font-serif text-sm line-clamp-1">{item.name}</p>
                        <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">Số lượng: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-serif text-primary text-sm">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-8 pt-4 border-t border-gray-700 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400 uppercase font-bold text-[10px] tracking-widest">Tạm tính:</span>
                  <span className="font-serif">{totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 uppercase font-bold text-[10px] tracking-widest">Phí vận chuyển:</span>
                  <span className="font-serif">{shippingFee.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                  <span className="text-primary font-black uppercase text-xs tracking-[0.2em]">Tổng cộng:</span>
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

// Component con cho phương thức thanh toán[cite: 3]
const PaymentOption = ({ id, label, icon, current, set }) => (
  <label className={`flex flex-col items-center justify-center p-4 border-2 cursor-pointer transition-all gap-2 ${current === id ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white hover:border-primary/20'}`}>
    <input type="radio" checked={current === id} onChange={() => set(id)} className="hidden" />
    <div className={`${current === id ? 'text-primary' : 'text-gray-400'}`}>{icon}</div>
    <span className={`font-black uppercase text-[9px] tracking-widest text-center ${current === id ? 'text-dark' : 'text-gray-400'}`}>{label}</span>
  </label>
);

export default Checkout;