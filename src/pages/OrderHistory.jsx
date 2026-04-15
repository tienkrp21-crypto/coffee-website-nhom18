import React, { useState, useEffect } from 'react';
import { Package, Eye, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'https://coffee-website-nhom18-1.onrender.com';

const OrderHistory = () => {
  const navigate = useNavigate();
  // [BẢO VỆ]: Khai báo state để lưu danh sách đơn hàng từ API và trạng thái loading.
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // [BẢO VỆ]: Hàm chuyển đổi Trạng thái từ chữ sang màu sắc tương ứng để UI sinh động.
  const getStatusDetails = (status) => {
    switch (status?.toUpperCase()) {
      case 'DELIVERED': return { text: 'Đã giao', color: 'text-green-600' };
      case 'SHIPPING': return { text: 'Đang giao', color: 'text-blue-600' };
      case 'PENDING': return { text: 'Đang xử lý', color: 'text-yellow-600' };
      case 'CANCELLED': return { text: 'Đã hủy', color: 'text-red-600' };
      default: return { text: status, color: 'text-gray-600' };
    }
  };

  // [BẢO VỆ]: useEffect gọi API ngay khi trang vừa tải.
  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/orders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log("📦 Dữ liệu Đơn hàng từ API:", data); // In ra để kiểm tra
          
          // Logic chống sập web: Tìm đúng cái mảng để lưu vào orders
          if (Array.isArray(data)) {
            setOrders(data);
          } else if (data && Array.isArray(data.orders)) {
            setOrders(data.orders);
          } else if (data && Array.isArray(data.data)) {
            setOrders(data.data);
          } else {
            console.error("Dữ liệu không phải là mảng:", data);
            setOrders([]); // Ép về mảng rỗng để không bị sập hàm map()
          }
        }
      } catch (error) {
        console.error("Lỗi kết nối server:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 lg:px-8">
        <h1 className="font-serif text-4xl text-dark mb-12">Lịch sử đơn hàng</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <Package size={40} className="text-gray-400" />
            </div>
            <h2 className="font-serif text-2xl text-dark mb-4">Chưa có đơn hàng</h2>
            <p className="text-gray-600 mb-8">Dũng ơi, bạn chưa đặt món nào tại CafeMaterial cả.</p>
            <button onClick={() => navigate('/products')} className="bg-dark text-white px-8 py-3 font-medium hover:bg-primary transition-all">
              Bắt đầu mua sắm ngay
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => {
              const statusInfo = getStatusDetails(order.status);
              return (
                <div key={order.id} className="bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-serif text-xl text-dark mb-1">Đơn hàng #{order.id}</h3>
                      <p className="text-sm text-gray-600">
                        Đặt ngày: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-bold uppercase text-xs tracking-widest ${statusInfo.color}`}>
                        ● {statusInfo.text}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-[10px] font-black uppercase text-gray-400">Tổng thanh toán</span>
                        <p className="font-serif text-lg text-primary mt-1">{order.totalAmount?.toLocaleString('vi-VN')}đ</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-gray-400">Sản phẩm</span>
                        <p className="font-medium text-dark mt-1">{order.items?.length || 0} món</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-gray-400">Thanh toán</span>
                        <p className="font-medium text-dark mt-1">{order.paymentMethod}</p>
                      </div>
                      <div className="flex items-end">
                        <button 
                          onClick={() => navigate(`/order-detail/${order.id}`)}
                          className="flex items-center gap-2 text-dark hover:text-primary transition font-bold uppercase text-[10px] tracking-widest"
                        >
                          <Eye size={16} /> Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;