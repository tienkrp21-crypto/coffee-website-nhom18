import React, { useState, useEffect } from 'react';
import { Package, Eye, XCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingPage from '../components/LoadingPage';

// Link Backend trên Render của sếp
const BASE_URL = 'https://coffee-website-nhom18-1.onrender.com';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Gọi API Lấy lịch sử mua hàng thật của User
    const fetchOrders = async () => {
      const savedUser = localStorage.getItem('user');
      if (!savedUser) {
        navigate('/login');
        return;
      }
      
      try {
        const userObj = JSON.parse(savedUser);
        const response = await fetch(`${BASE_URL}/orders/history/${userObj.id}`);
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Lỗi lấy lịch sử đơn hàng:", error);
      } finally {
        // Đợi 1 xíu cho mượt giao diện
        setTimeout(() => setLoading(false), 600);
      }
    };

    fetchOrders();
  }, [navigate]);

  // HÀM HỦY ĐƠN HÀNG
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Sếp có chắc chắn muốn hủy đơn hàng này không?")) return;
    
    try {
      const response = await fetch(`${BASE_URL}/orders/${orderId}/cancel`, {
        method: 'PUT'
      });
      const msg = await response.text();
      
      if (response.ok) {
        alert("Đã hủy đơn hàng thành công!");
        window.location.reload(); 
      } else {
        alert(msg || "Không thể hủy đơn hàng này.");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Lỗi kết nối khi hủy đơn!");
    }
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="py-12 bg-white min-h-screen font-sans">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        
        {/* Nút quay lại */}
        <button 
          onClick={() => navigate('/profile')} 
          className="flex items-center gap-2 text-dark font-black uppercase text-[10px] tracking-widest mb-8 hover:text-primary transition"
        >
          <ArrowLeft size={16} /> Quay lại Hồ sơ
        </button>

        <h1 className="font-serif text-4xl text-dark mb-12 uppercase border-b-2 border-primary pb-4 inline-block italic">
          Lịch sử đơn hàng
        </h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-secondary border-inner">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 shadow-sm">
              <Package size={40} className="text-primary" />
            </div>
            <h2 className="font-heading text-2xl text-dark mb-4 uppercase">Chưa có đơn hàng nào</h2>
            <p className="text-gray-500 mb-8 px-4">Sếp chưa đặt đơn hàng nào với CafeMaterial. Hãy quay lại chọn món nhé!</p>
            <button 
              onClick={() => navigate('/products')} 
              className="bg-dark text-white px-10 py-3 uppercase font-heading hover:bg-primary transition-all border-inner"
            >
              Bắt đầu mua sắm
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {orders.map(order => (
              <div key={order.orderId} className="bg-white border-2 border-gray-100 shadow-xl p-8 hover:border-primary/30 transition-all relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-6">
                  <div>
                    <h3 className="font-serif text-3xl text-dark mb-1 italic">Mã đơn: <span className="text-primary">#CF{order.orderId}</span></h3>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em]">
                      Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`font-black px-4 py-1 uppercase text-[10px] tracking-[0.2em] text-white shadow-sm ${
                      order.orderStatus === 'PENDING' ? 'bg-yellow-500' : 
                      order.orderStatus === 'CANCELLED' ? 'bg-red-500' : 
                      'bg-green-600'
                    }`}>
                      {order.orderStatus === 'PENDING' ? 'Đang chờ xử lý' : 
                       order.orderStatus === 'CANCELLED' ? 'Đã Hủy' : 
                       order.orderStatus}
                    </span>
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                      Thanh toán: {order.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Danh sách món ăn trong đơn */}
                <div className="space-y-6 mb-8">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-6 border-b border-gray-50 border-dashed pb-4 last:border-0">
                      
                      {/* ĐÃ FIX: Nối BASE_URL cho ảnh hiện lên mượt mà */}
                      <img 
                        src={item.imageUrl?.startsWith("http") ? item.imageUrl : `${BASE_URL}/${item.imageUrl?.replace(/^\//, "")}`} 
                        alt={item.productName} 
                        className="w-20 h-20 object-cover border-inner border-inner-dark shadow-sm" 
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=400"; }}
                      />

                      <div className="flex-1">
                        <h4 className="font-serif text-xl text-dark mb-1">{item.productName}</h4>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Số lượng: {item.quantity}</p>
                      </div>
                      <p className="font-serif text-lg text-primary">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</p>
                    </div>
                  ))}
                </div>

                <div className="bg-secondary p-6 flex flex-col md:flex-row justify-between items-center border-t-2 border-primary/20">
                  <div className="text-center md:text-left">
                    <span className="text-gray-400 uppercase text-[10px] font-black tracking-[0.2em]">Tổng thanh toán:</span>
                    <p className="font-serif text-4xl text-primary">{order.finalAmount.toLocaleString('vi-VN')}đ</p>
                  </div>
                  
                  {/* Chỉ hiện nút HỦY ĐƠN nếu trạng thái đang là PENDING */}
                  {order.orderStatus === 'PENDING' && (
                    <button 
                      onClick={() => handleCancelOrder(order.orderId)}
                      className="mt-6 md:mt-0 flex items-center gap-3 bg-white text-red-600 px-8 py-3 uppercase text-[10px] font-black tracking-[0.2em] border-2 border-red-100 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm"
                    >
                      <XCircle size={18} /> Hủy Đơn Hàng
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;