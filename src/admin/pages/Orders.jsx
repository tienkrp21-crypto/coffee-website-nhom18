import React, { useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([
    {
      id: "ORD001",
      customer: "Nguyễn Văn A",
      date: "2024-04-07",
      amount: 250000,
      status: "Đã giao",
      items: 3,
    },
    {
      id: "ORD002",
      customer: "Trần Thị B",
      date: "2024-04-07",
      amount: 180000,
      status: "Chờ xử lý",
      items: 2,
    },
    {
      id: "ORD003",
      customer: "Phạm Văn C",
      date: "2024-04-06",
      amount: 150000,
      status: "Đã giao",
      items: 1,
    },
    {
      id: "ORD004",
      customer: "Đỗ Thị D",
      date: "2024-04-06",
      amount: 300000,
      status: "Đang giao",
      items: 4,
    },
    {
      id: "ORD005",
      customer: "Hoàng Văn E",
      date: "2024-04-05",
      amount: 200000,
      status: "Đã giao",
      items: 2,
    },
  ]);

  const [showDetails, setShowDetails] = useState(null);

  const updateStatus = (id, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Đã giao":
        return "bg-green-100 text-green-700";
      case "Chờ xử lý":
        return "bg-yellow-100 text-yellow-700";
      case "Đang giao":
        return "bg-blue-100 text-blue-700";
      case "Hủy":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          🛒 Quản lý Đơn hàng
        </h1>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Mã đơn
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-center font-semibold text-gray-700">
                Ngày
              </th>
              <th className="px-6 py-3 text-center font-semibold text-gray-700">
                Số lượng
              </th>
              <th className="px-6 py-3 text-right font-semibold text-gray-700">
                Tiền
              </th>
              <th className="px-6 py-3 text-center font-semibold text-gray-700">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-center font-semibold text-gray-700">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-blue-600">
                  {order.id}
                </td>
                <td className="px-6 py-4 text-gray-800">{order.customer}</td>
                <td className="px-6 py-4 text-center text-gray-600">
                  {order.date}
                </td>
                <td className="px-6 py-4 text-center text-gray-800 font-semibold">
                  {order.items}
                </td>
                <td className="px-6 py-4 text-right font-semibold text-gray-800">
                  {order.amount.toLocaleString()}đ
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded font-semibold text-sm ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="Chờ xử lý">Chờ xử lý</option>
                    <option value="Đang giao">Đang giao</option>
                    <option value="Đã giao">Đã giao</option>
                    <option value="Hủy">Hủy</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
