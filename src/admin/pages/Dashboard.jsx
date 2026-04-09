import React, { useState } from "react";

export default function Dashboard() {
  const [stats] = useState({
    totalOrders: 1250,
    totalRevenue: 125500000,
    totalProducts: 48,
    totalCategories: 5,
    activeUsers: 356,
    lowStockItems: 8,
  });

  const [recentOrders] = useState([
    {
      id: "ORD001",
      customer: "Nguyễn Văn A",
      date: "2024-04-07",
      amount: 250000,
      status: "Đã giao",
    },
    {
      id: "ORD002",
      customer: "Trần Thị B",
      date: "2024-04-07",
      amount: 180000,
      status: "Chờ xử lý",
    },
    {
      id: "ORD003",
      customer: "Phạm Văn C",
      date: "2024-04-06",
      amount: 150000,
      status: "Đã giao",
    },
    {
      id: "ORD004",
      customer: "Đỗ Thị D",
      date: "2024-04-06",
      amount: 300000,
      status: "Đang giao",
    },
  ]);

  const [topProducts] = useState([
    { id: 1, name: "Cà phê đen đá", sales: 325, revenue: 3250000 },
    { id: 2, name: "Cà phê sữa nóng", sales: 285, revenue: 2850000 },
    { id: 3, name: "Cappuccino", sales: 210, revenue: 2520000 },
    { id: 4, name: "Latte", sales: 198, revenue: 1980000 },
  ]);

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <span className="text-4xl opacity-20">{icon}</span>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Bảng điều khiển</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard
          title="Tổng đơn hàng"
          value={stats.totalOrders.toLocaleString()}
          icon="🛒"
          color="border-blue-500"
        />
        <StatCard
          title="Doanh thu"
          value={`${(stats.totalRevenue / 1000000).toFixed(1)}M`}
          icon="💰"
          color="border-green-500"
        />
        <StatCard
          title="Sản phẩm"
          value={stats.totalProducts}
          icon="☕"
          color="border-yellow-500"
        />
        <StatCard
          title="Danh mục"
          value={stats.totalCategories}
          icon="📁"
          color="border-purple-500"
        />
        <StatCard
          title="Người dùng"
          value={stats.activeUsers.toLocaleString()}
          icon="👥"
          color="border-pink-500"
        />
        <StatCard
          title="Tồn kho thấp"
          value={stats.lowStockItems}
          icon="⚠️"
          color="border-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            🛒 Đơn hàng gần đây
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    Mã đơn
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    Khách hàng
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    Ngày
                  </th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-700">
                    Tiền
                  </th>
                  <th className="px-4 py-2 text-center font-semibold text-gray-700">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-bold text-blue-600">
                      {order.id}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {order.customer}
                    </td>
                    <td className="px-4 py-2 text-gray-600">{order.date}</td>
                    <td className="px-4 py-2 text-right font-semibold text-gray-800">
                      {order.amount.toLocaleString()}đ
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === "Đã giao"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Chờ xử lý"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            ☕ Top sản phẩm bán chạy
          </h2>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-600">{product.sales} bán</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">
                    {product.revenue.toLocaleString()}đ
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
