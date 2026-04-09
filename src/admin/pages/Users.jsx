import React, { useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "vanA@email.com",
      phone: "0987654321",
      joinDate: "2024-01-15",
      status: "active",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "thib@email.com",
      phone: "0912345678",
      joinDate: "2024-02-10",
      status: "active",
    },
    {
      id: 3,
      name: "Phạm Văn C",
      email: "vanc@email.com",
      phone: "0901234567",
      joinDate: "2024-03-05",
      status: "inactive",
    },
    {
      id: 4,
      name: "Đỗ Thị D",
      email: "thid@email.com",
      phone: "0923456789",
      joinDate: "2024-03-20",
      status: "active",
    },
  ]);

  const toggleStatus = (id) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user
      )
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          👥 Quản lý Người dùng
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
          <p className="text-blue-600 text-sm font-semibold">Tổng người dùng</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {users.length}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
          <p className="text-green-600 text-sm font-semibold">Hoạt động</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {users.filter((u) => u.status === "active").length}
          </p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
          <p className="text-red-600 text-sm font-semibold">Không hoạt động</p>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {users.filter((u) => u.status === "inactive").length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Tên người dùng
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Email
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Điện thoại
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Ngày tham gia
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
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-800">
                  {user.name}
                </td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-gray-600">{user.phone}</td>
                <td className="px-6 py-4 text-gray-600">{user.joinDate}</td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded font-semibold text-sm ${
                      user.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status === "active" ? "✓ Hoạt động" : "✗ Khóa"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => toggleStatus(user.id)}
                    className={`px-3 py-1 rounded text-sm font-semibold text-white transition-colors ${
                      user.status === "active"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {user.status === "active" ? "Khóa" : "Kích hoạt"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
