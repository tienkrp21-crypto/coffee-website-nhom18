import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "https://coffee-website-nhom18-admin.onrender.com/users";

const isActiveUser = (status) =>
  status === "active" || status === 1 || status === true;

const normalizeUser = (user) => ({
  id: user.id,
  name: user.name || user.fullName || user.username || "-",
  email: user.email || "-",
  phone: user.phone || user.phoneNumber || user.mobile || "-",
  role: user.role || user.type || "Người dùng",
  joinDate: user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("vi-VN")
    : user.joinDate || "-",
  status: isActiveUser(user.status) ? "active" : "inactive",
  address: user.address || user.location || "-",
  raw: user,
});

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(API_BASE);
        const payload = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.content)
          ? response.data.content
          : Array.isArray(response.data?.data)
          ? response.data.data
          : [];

        setUsers(payload.map(normalizeUser));
      } catch (fetchError) {
        console.error("Error fetching users:", fetchError);
        setError("Không thể tải dữ liệu người dùng.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const fetchUserDetail = async (id) => {
    setDetailError(null);
    setDetailLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/${id}`);
      setSelectedUser(normalizeUser(response.data));
    } catch (fetchError) {
      console.error("Error fetching user detail:", fetchError);
      setDetailError("Không thể tải chi tiết người dùng.");
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.phone.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term)
    );
  });

  const activeCount = users.filter((user) => user.status === "active").length;
  const inactiveCount = users.length - activeCount;

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            👥 Quản lý Người dùng
          </h1>
          {/* <p className="text-sm text-gray-500 mt-1">
            Kết nối API người dùng thật và thiết kế lại giao diện quản lý.
          </p> */}
        </div>
        <div className="w-full md:w-96">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-orange-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        <div className="rounded-3xl border border-orange-100 bg-orange-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-orange-600">Tổng người dùng</p>
          <p className="mt-3 text-3xl font-semibold text-orange-700">
            {users.length}
          </p>
        </div>
        <div className="rounded-3xl border border-green-100 bg-green-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-green-600">Hoạt động</p>
          <p className="mt-3 text-3xl font-semibold text-green-700">
            {activeCount}
          </p>
        </div>
        <div className="rounded-3xl border border-red-100 bg-red-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-red-600">Không hoạt động</p>
          <p className="mt-3 text-3xl font-semibold text-red-700">
            {inactiveCount}
          </p>
        </div>
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Đã lọc</p>
          <p className="mt-3 text-3xl font-semibold text-gray-900">
            {filteredUsers.length}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center text-gray-600 shadow-sm">
          Đang tải dữ liệu người dùng...
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="overflow-x-auto w-full">
              <table className="w-full table-auto border-collapse text-left">
                <thead className="bg-gray-50 text-sm uppercase tracking-wide text-gray-600">
                  <tr>
                    <th className="px-4 py-3">Tên</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Điện thoại</th>
                    <th className="px-4 py-3">Ngày tham gia</th>
                    <th className="px-4 py-3 text-center">Trạng thái</th>
                    <th className="px-4 py-3 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-10 text-center text-gray-500"
                      >
                        Không tìm thấy người dùng phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-t border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 font-medium text-gray-800 break-words">
                          {user.name}
                        </td>
                        <td className="px-4 py-3 text-gray-600 break-words">
                          {user.email}
                        </td>
                        <td className="px-4 py-3 text-gray-600 break-words">
                          {user.phone}
                        </td>
                        <td className="px-4 py-3 text-gray-600 break-words">
                          {user.joinDate}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                              user.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {user.status === "active" ? "Hoạt động" : "Khóa"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => fetchUserDetail(user.id)}
                            className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
                          >
                            Chi tiết
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Chi tiết người dùng
            </h2>
            {detailLoading ? (
              <p className="text-gray-600">Đang tải chi tiết...</p>
            ) : detailError ? (
              <p className="text-red-600">{detailError}</p>
            ) : selectedUser ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">ID</p>
                  <p className="mt-1 text-base font-medium text-gray-900">
                    {selectedUser.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tên</p>
                  <p className="mt-1 text-base font-medium text-gray-900">
                    {selectedUser.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="mt-1 text-base font-medium text-gray-900">
                    {selectedUser.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Điện thoại</p>
                  <p className="mt-1 text-base font-medium text-gray-900">
                    {selectedUser.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vai trò</p>
                  <p className="mt-1 text-base font-medium text-gray-900">
                    {selectedUser.role}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Địa chỉ</p>
                  <p className="mt-1 text-base font-medium text-gray-900">
                    {selectedUser.address}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày tham gia</p>
                  <p className="mt-1 text-base font-medium text-gray-900">
                    {selectedUser.joinDate}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trạng thái</p>
                  <p
                    className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                      selectedUser.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedUser.status === "active" ? "Hoạt động" : "Khóa"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-gray-200 p-6 text-center text-gray-500">
                Chọn một người dùng để xem chi tiết.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
