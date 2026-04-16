import React, { useState, useEffect } from 'react';
import { Package, Eye, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingPage from '../components/LoadingPage';

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
      const userObj = JSON.parse(savedUser);

      try {
        const response = await fetch(`${BASE_URL}/orders/history/${userObj.id}`);
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Lỗi lấy lịch sử đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // HÀM HỦY ĐƠN HÀNG
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;
    
    try {
      const response = await fetch(`${BASE_URL}/orders/${orderId}/cancel`, {
        method: 'PUT'
      });
      const msg = await response.text();
      
      if (response.ok) {
        alert(msg);
        window.location.reload(); // Tải lại trang để thấy đơn đã bị hủy
      } else {
        alert(msg);
      }
    } catch (error) {
      alert("Lỗi kết nối khi hủy đơn!");
    }
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        <h1 className="font-serif text-4xl text-dark mb-12 uppercase border-b-2 border-[#E88F2A] pb-4 inline-block">
          Lịch sử đơn hàng
        </h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-16 bg-[#FAF3EB] border border-gray-200">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 shadow-sm">
              <Package size={40} className="text-[#E88F2A]" />
            </div>
            <h2 className="font-serif text-2xl text-dark mb-4 uppercase">Chưa có đơn hàng</h2>
            <p className="text-gray-600 mb-8">Bạn chưa đặt đơn hàng nào với chúng tôi.</p>
            <a href="/products" className="inline-block bg-[#2B2825] text-white px-8 py-3 uppercase tracking-wide hover:bg-[#E88F2A] transition-all">
              Bắt đầu mua sắm
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map(order => (
              <div key={order.orderId} className="bg-white border-2 border-gray-100 shadow-md p-6 hover:border-[#E88F2A]/30 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="font-serif text-2xl text-dark mb-1">Mã đơn: <span className="text-[#E88F2A]">#CF{order.orderId}</span></h3>
                    <p className="text-sm text-gray-500 uppercase font-bold tracking-widest">
                      Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`font-bold px-4 py-1 uppercase text-[10px] tracking-widest text-white ${order.orderStatus === 'PENDING' ? 'bg-yellow-500' : order.orderStatus === 'CANCELLED' ? 'bg-red-500' : 'bg-green-500'}`}>
                      {order.orderStatus === 'PENDING' ? 'Đang chờ xử lý' : order.orderStatus === 'CANCELLED' ? 'Đã Hủy' : order.orderStatus}
                    </span>
                    <span className="text-xs text-gray-400 font-bold">Thanh toán: {order.paymentMethod}</span>
                  </div>
                </div>

                {/* Danh sách món ăn trong đơn */}
                <div className="space-y-4 mb-6">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <img src={item.imageUrl} alt={item.productName} className="w-16 h-16 object-cover border border-gray-200" />
                      <div className="flex-1">
                        <h4 className="font-serif text-lg text-dark">{item.productName}</h4>
                        <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-dark">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</p>
                    </div>
                  ))}
                </div>

                <div className="bg-[#FAF3EB] p-4 flex flex-col md:flex-row justify-between items-center mt-4">
                  <div>
                    <span className="text-gray-500 uppercase text-[10px] font-bold tracking-widest">Tổng thanh toán:</span>
                    <p className="font-serif text-3xl text-[#E88F2A]">{order.finalAmount.toLocaleString('vi-VN')}đ</p>
                  </div>
                  
                  {/* Chỉ hiện nút HỦY ĐƠN nếu trạng thái đang là PENDING */}
                  {order.orderStatus === 'PENDING' && (
                    <button 
                      onClick={() => handleCancelOrder(order.orderId)}
                      className="mt-4 md:mt-0 flex items-center gap-2 bg-red-50 text-red-600 px-6 py-2 uppercase text-xs font-bold tracking-widest border border-red-200 hover:bg-red-600 hover:text-white transition-all"
                    >
                      <XCircle size={16} /> Hủy Đơn Hàng
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