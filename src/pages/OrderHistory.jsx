import { Package, Eye } from 'lucide-react';

const OrderHistory = () => {
  const orders = [
    {
      id: '#001',
      date: '1 Tháng 4, 2026',
      status: 'Đã giao',
      total: '850.000đ',
      items: 3,
      statusColor: 'text-green-600'
    },
    {
      id: '#002',
      date: '28 Tháng 3, 2026',
      status: 'Đang giao',
      total: '450.000đ',
      items: 2,
      statusColor: 'text-blue-600'
    },
    {
      id: '#003',
      date: '15 Tháng 3, 2026',
      status: 'Đang xử lý',
      total: '1.200.000đ',
      items: 5,
      statusColor: 'text-yellow-600'
    }
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <h1 className="font-serif text-4xl text-dark mb-12">
          Lịch sử đơn hàng
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <Package size={40} className="text-gray-400" />
            </div>
            <h2 className="font-serif text-2xl text-dark mb-4">
              Chưa có đơn hàng
            </h2>
            <p className="text-gray-600 mb-8">
              Bạn chưa đặt đơn hàng nào.
            </p>
            <a 
              href="/products"
              className="inline-block bg-dark text-white px-8 py-3 rounded-full font-medium tracking-wide hover:bg-dark/90 transition-all"
            >
              Bắt đầu mua sắm
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-serif text-xl text-dark mb-1">
                      Đơn hàng {order.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Đặt ngày {order.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-medium ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Tổng đơn hàng</span>
                      <p className="font-medium text-dark mt-1">{order.total}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Sản phẩm</span>
                      <p className="font-medium text-dark mt-1">{order.items} sản phẩm</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Thanh toán</span>
                      <p className="font-medium text-dark mt-1">Thẻ tín dụng</p>
                    </div>
                    <div className="flex items-end">
                      <button className="flex items-center gap-2 text-dark hover:text-dark/70 transition">
                        <Eye size={18} />
                        <span className="font-medium">Xem chi tiết</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {orders.length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 hover:border-dark hover:text-dark transition">
              Trước
            </button>
            <button className="px-4 py-2 bg-dark text-white rounded-full">1</button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 hover:border-dark hover:text-dark transition">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 hover:border-dark hover:text-dark transition">
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
