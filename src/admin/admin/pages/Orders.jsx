/**
 * ========================================
 * TRANG QUẢN LÝ ĐƠN HÀNG (Orders.jsx)
 * ========================================
 *
 * Chức năng: Quản lý đơn hàng của khách hàng
 * - Hiển thị danh sách đơn hàng
 * - Tìm kiếm đơn hàng
 * - Xem chi tiết đơn hàng
 * - Cập nhật trạng thái đơn hàng
 * - Hiển thị thông tin khách hàng
 * - Hiển thị danh sách sản phẩm trong đơn hàng
 */

import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE =
  "https://coffee-website-nhom18-admin.onrender.com/api/admin/orders";

// 🟢 API cho người dùng
const USER_API = "https://coffee-website-nhom18-admin.onrender.com/users";

// 📍 Hàm chuyển đổi trạng thái từ tiếng Anh sang tiếng Việt
const mapStatus = (status) => {
  switch (status) {
    case "PENDING":
      return "Chờ xử lý";
    case "CANCELLED":
      return "Đã hủy";
    case "DELIVERED":
      return "Đã giao";
    case "SHIPPING":
      return "Đang giao";
    default:
      return status;
  }
};

// 🎨 Hàm định dạng màu sắc trạng thái đơn hàng
const getStatusColor = (status) => {
  switch (status) {
    case "Đã giao":
    case "delivered":
      return "bg-green-100 text-green-700";
    case "Chờ xử lý":
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "Đang giao":
    case "shipping":
      return "bg-orange-100 text-orange-700";
    case "Hủy":
    case "cancelled":
    case "Đã hủy":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// 🔄 Hàm chuẩn hóa dữ liệu đơn hàng từ API
const normalizeOrder = (order) => ({
  id: order.id?.toString() || "-",
  customer:
    order.customerName || order.customer?.name || order.user?.name || "-",

  // 📧 Email sẽ tải sau
  email: "-",

  // 📞 Số điện thoại
  phone: order.receiverPhone || order.customer?.phone || "-",

  // 📅 Ngày tạo đơn hàng
  date: order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("vi-VN")
    : "-",

  // 💰 Tổng tiền
  amount: Number(order.totalAmount ?? order.amount ?? 0),

  // 📦 Số lượng sản phẩm
  items: Array.isArray(order.orderDetails)
    ? order.orderDetails.length
    : order.quantity ?? 0,

  // 📍 Trạng thái đơn hàng
  status: mapStatus(order.orderStatus || order.status),

  // 💳 Phương thức thanh toán
  paymentMethod: order.paymentMethod || "-",

  // 🏠 Địa chỉ giao hàng
  address:
    order.shippingAddress || order.deliveryAddress || order.address || "-",

  // 📋 Chi tiết các sản phẩm trong đơn hàng
  itemsDetail: Array.isArray(order.orderDetails) ? order.orderDetails : [],

  // 👤 ID người dùng
  userId: order.userId,

  // 🔧 Dữ liệu nguyên gốc từ API
  raw: order,
});

export default function Orders() {
  // 📊 State quản lý danh sách đơn hàng
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Đang tải hay không
  const [error, setError] = useState(null); // Thông báo lỗi

  // 🔍 State quản lý tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");

  // 🔎 State quản lý chi tiết đơn hàng
  const [selectedOrder, setSelectedOrder] = useState(null); // Đơn hàng được chọn
  const [detailLoading, setDetailLoading] = useState(false); // Đang tải chi tiết
  const [detailError, setDetailError] = useState(null); // Lỗi tải chi tiết

  // ⚙️ State quản lý cập nhật trạng thái
  const [updatingStatus, setUpdatingStatus] = useState(false); // Đang cập nhật trạng thái
  const [newStatus, setNewStatus] = useState(""); // Trạng thái mới

  // 🔀 Hàm cập nhật trạng thái đơn hàng
  const updateOrderStatus = async (orderId, status) => {
    if (!status) return;

    setUpdatingStatus(true);
    try {
      const response = await axios.patch(
        `https://coffee-website-nhom18-admin.onrender.com/api/admin/orders/${orderId}/status`,
        null,
        { params: { status } }
      );

      // Cập nhật state local
      const updatedOrder = normalizeOrder(response.data);
      setOrders(
        orders.map((order) => (order.id === orderId ? updatedOrder : order))
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updatedOrder);
      }

      alert("Cập nhật trạng thái đơn hàng thành công!");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // 📥 Tải danh sách đơn hàng khi component render
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(API_BASE);
        const payload = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data?.content)
          ? response.data.content
          : [];

        setOrders(payload.map(normalizeOrder));
      } catch (fetchError) {
        console.error("Error fetching orders:", fetchError);
        setError("Không thể tải dữ liệu đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // 📋 Hàm tải chi tiết đơn hàng (bao gồm thông tin khách hàng)
  const fetchOrderDetail = async (orderId, userId) => {
    setSelectedOrder(null);
    setDetailError(null);
    setDetailLoading(true);
    setNewStatus(""); // Reset trạng thái mới
    try {
      const [orderRes, userRes] = await Promise.all([
        axios.get(`${API_BASE}/${orderId}`),
        axios.get(`${USER_API}/${userId}`),
      ]);

      const orderData = normalizeOrder(orderRes.data);
      const userData = userRes.data;

      setSelectedOrder({
        ...orderData,
        email: userData.email || "-",
        phone: userData.phone || orderData.phone,
      });
    } catch (fetchError) {
      console.error("Error fetching order detail:", fetchError);
      setDetailError("Không thể tải chi tiết đơn hàng.");
    } finally {
      setDetailLoading(false);
    }
  };

  const safe = (val) => (val || "").toString().toLowerCase();

  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      safe(order.id).includes(term) ||
      safe(order.customer).includes(term) ||
      safe(order.email).includes(term) ||
      safe(order.status).includes(term)
    );
  });

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            🧾 Quản lý Đơn hàng
          </h1>
        </div>
        <div className="w-full md:w-96">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo mã đơn, khách hàng, trạng thái..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-orange-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Danh sách đơn hàng
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {filteredOrders.length} đơn hàng hiển thị
            </p>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-600">
              Đang tải đơn hàng...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-white text-gray-600">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Mã đơn</th>
                    <th className="px-6 py-4 font-semibold">Khách hàng</th>
                    <th className="px-6 py-4 font-semibold text-center">
                      Ngày
                    </th>
                    <th className="px-6 py-4 font-semibold text-center">
                      Số lượng
                    </th>
                    <th className="px-6 py-4 font-semibold text-right">
                      Tổng tiền
                    </th>
                    <th className="px-6 py-4 font-semibold text-center">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 font-semibold text-center">
                      Chi tiết
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        Không tìm thấy đơn hàng phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className={`border-t border-gray-100 hover:bg-gray-50 ${
                          selectedOrder?.id === order.id ? "bg-orange-50" : ""
                        }`}
                      >
                        <td className="px-6 py-4 font-semibold text-orange-600">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-600">
                          {order.date}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-700">
                          {order.items}
                        </td>
                        <td className="px-6 py-4 text-right text-gray-800 font-semibold">
                          {order.amount.toLocaleString()}đ
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            disabled={detailLoading}
                            onClick={() =>
                              fetchOrderDetail(order.id, order.userId)
                            }
                            className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
                          >
                            Xem
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Chi tiết đơn hàng
          </h2>
          {detailLoading ? (
            <p className="text-gray-600">Đang tải chi tiết đơn hàng...</p>
          ) : detailError ? (
            <p className="text-red-600">{detailError}</p>
          ) : selectedOrder ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Mã đơn</p>
                <p className="mt-1 text-base font-semibold text-gray-900">
                  {selectedOrder.id}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Khách hàng</p>
                <p className="mt-1 text-base font-semibold text-gray-900">
                  {selectedOrder.customer}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="mt-1 text-base text-gray-900">
                  {selectedOrder.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Điện thoại</p>
                <p className="mt-1 text-base text-gray-900">
                  {selectedOrder.phone}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Địa chỉ giao hàng</p>
                <p className="mt-1 text-base text-gray-900">
                  {selectedOrder.address}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                <p className="mt-1 text-base text-gray-900">
                  {selectedOrder.paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng tiền</p>
                <p className="mt-1 text-base font-semibold text-gray-900">
                  {selectedOrder.amount.toLocaleString()}đ
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trạng thái</p>
                <p
                  className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status}
                </p>
              </div>

              {/* 🔥 THÊM: Cập nhật trạng thái */}
              <div>
                <p className="text-sm text-gray-500">Cập nhật trạng thái</p>
                <div className="mt-2 flex gap-2">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                    disabled={updatingStatus}
                  >
                    <option value="">Chọn trạng thái mới</option>
                    <option value="PENDING">Chờ xử lý</option>
                    <option value="SHIPPING">Đang giao</option>
                    <option value="DELIVERED">Đã giao</option>
                    <option value="CANCELLED">Đã hủy</option>
                  </select>
                  <button
                    onClick={() =>
                      updateOrderStatus(selectedOrder.id, newStatus)
                    }
                    disabled={updatingStatus || !newStatus}
                    className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50"
                  >
                    {updatingStatus ? "Đang cập nhật..." : "Cập nhật"}
                  </button>
                </div>
              </div>

              {/* 🔥 HIỂN THỊ CHI TIẾT SẢN PHẨM */}
              <div>
                <p className="text-sm text-gray-500">Sản phẩm</p>
                {selectedOrder.itemsDetail.length > 0 ? (
                  <ul className="mt-2 space-y-2 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    {selectedOrder.itemsDetail.map((item, index) => (
                      <li
                        key={index}
                        className="grid grid-cols-3 text-sm text-gray-700"
                      >
                        <span>{item.productName}</span>
                        <span className="text-center">
                          {item.quantity} x{" "}
                          {item.priceAtPurchase.toLocaleString()}đ
                        </span>
                        <span className="text-right font-semibold">
                          {item.subTotal.toLocaleString()}đ
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">
                    Không có chi tiết sản phẩm.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-200 p-6 text-center text-gray-500">
              Chọn một đơn hàng để xem chi tiết.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
