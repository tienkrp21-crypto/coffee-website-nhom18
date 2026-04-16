import React, { useState, useEffect } from "react";
import axios from "axios";

const getStatusColor = (status) => {
  const statusLower = status?.toLowerCase() || "";
  if (["đã giao", "delivered"].includes(statusLower))
    return "bg-green-100 text-green-700";
  if (["chờ xử lý", "pending"].includes(statusLower))
    return "bg-yellow-100 text-yellow-700";
  if (["đang giao", "shipping"].includes(statusLower))
    return "bg-orange-100 text-orange-700";
  if (["hủy", "cancelled"].includes(statusLower))
    return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch orders
        const ordersResponse = await axios.get(
          "https://coffee-website-nhom18-admin.onrender.com/api/admin/orders"
        );
        const orders = Array.isArray(ordersResponse.data)
          ? ordersResponse.data
          : Array.isArray(ordersResponse.data?.data)
          ? ordersResponse.data.data
          : Array.isArray(ordersResponse.data?.content)
          ? ordersResponse.data.content
          : [];

        // Fetch products
        const productsResponse = await axios.get(
          "https://coffee-website-nhom18-admin.onrender.com/api/products"
        );
        const products = Array.isArray(productsResponse.data)
          ? productsResponse.data
          : Array.isArray(productsResponse.data?.data)
          ? productsResponse.data.data
          : Array.isArray(productsResponse.data?.content)
          ? productsResponse.data.content
          : Array.isArray(productsResponse.data?.products)
          ? productsResponse.data.products
          : [];

        // Fetch categories
        const categoriesResponse = await axios.get(
          "https://coffee-website-nhom18-admin.onrender.com/api/categories"
        );
        const categories = categoriesResponse.data
          ? Array.isArray(categoriesResponse.data)
            ? categoriesResponse.data
            : Array.isArray(categoriesResponse.data?.data)
            ? categoriesResponse.data.data
            : Array.isArray(categoriesResponse.data?.content)
            ? categoriesResponse.data.content
            : []
          : [];

        // Fetch users
        const usersResponse = await axios.get(
          "https://coffee-website-nhom18-admin.onrender.com/users"
        );
        const users = Array.isArray(usersResponse.data)
          ? usersResponse.data
          : Array.isArray(usersResponse.data?.data)
          ? usersResponse.data.data
          : Array.isArray(usersResponse.data?.content)
          ? usersResponse.data.content
          : [];

        // Update stats
        setStats({
          totalOrders: orders.length,
          totalProducts: products.length,
          totalCategories: categories.length,
          totalUsers: users.length,
        });

        // Format and set recent orders (last 5)
        const formattedOrders = orders.slice(0, 5).map((order) => ({
          id: order.id || order._id || order.orderId || "-",
          customer:
            order.customerName ||
            order.customer?.name ||
            order.user?.name ||
            "-",
          date: order.createdAt
            ? new Date(order.createdAt).toLocaleDateString("vi-VN")
            : order.orderDate || order.date || "-",
          amount: order.totalAmount ?? order.amount ?? order.price ?? 0,
          status: order.status || order.orderStatus || "Chờ xử lý",
        }));
        setRecentOrders(formattedOrders);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Không thể tải dữ liệu bảng điều khiển");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <div
      className={`bg-white rounded-lg shadow-lg p-4 sm:p-6 border-l-4 ${color} hover:shadow-xl transition-shadow`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-orange-600 text-xs sm:text-sm">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-orange-800 mt-1 sm:mt-2">
            {loading ? "..." : value}
          </p>
        </div>
        <span className="text-2xl sm:text-4xl opacity-20 flex-shrink-0">
          {icon}
        </span>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-orange-800">
        Thống kê
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Tổng đơn hàng"
          value={stats.totalOrders.toLocaleString()}
          icon="🛒"
          color="border-orange-500"
        />
        <StatCard
          title="Sản phẩm"
          value={stats.totalProducts}
          icon="☕"
          color="border-orange-400"
        />
        <StatCard
          title="Danh mục"
          value={stats.totalCategories}
          icon="📁"
          color="border-orange-300"
        />
        <StatCard
          title="Người dùng"
          value={stats.totalUsers.toLocaleString()}
          icon="👥"
          color="border-pink-500"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 border border-orange-200">
        <h2 className="text-lg sm:text-xl font-bold text-orange-800 mb-4">
          🛒 Đơn hàng gần đây
        </h2>
        {loading ? (
          <div className="text-center py-8 text-gray-600">Đang tải...</div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-600">Chưa có đơn hàng</div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full px-4 sm:px-0">
              <table className="w-full text-xs sm:text-sm">
                <thead className="bg-orange-100 border-b border-orange-200">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 text-left font-semibold text-orange-800">
                      Mã đơn
                    </th>
                    <th className="px-2 sm:px-4 py-2 text-left font-semibold text-orange-800 hidden sm:table-cell">
                      Khách hàng
                    </th>
                    <th className="px-2 sm:px-4 py-2 text-left font-semibold text-orange-800 hidden md:table-cell">
                      Ngày
                    </th>
                    <th className="px-2 sm:px-4 py-2 text-right font-semibold text-orange-800">
                      Tiền
                    </th>
                    <th className="px-2 sm:px-4 py-2 text-center font-semibold text-orange-800">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-orange-100 hover:bg-orange-50 transition-colors"
                    >
                      <td className="px-2 sm:px-4 py-2 font-bold text-orange-600 text-xs sm:text-sm">
                        {order.id}
                      </td>
                      <td className="px-2 sm:px-4 py-2 text-gray-700 hidden sm:table-cell text-xs sm:text-sm">
                        {order.customer}
                      </td>
                      <td className="px-2 sm:px-4 py-2 text-gray-600 hidden md:table-cell text-xs sm:text-sm">
                        {order.date}
                      </td>
                      <td className="px-2 sm:px-4 py-2 text-right font-semibold text-gray-800 text-xs sm:text-sm">
                        {order.amount.toLocaleString()}đ
                      </td>
                      <td className="px-2 sm:px-4 py-2">
                        <span
                          className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            order.status
                          )}`}
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
        )}
      </div>
    </div>
  );
}
