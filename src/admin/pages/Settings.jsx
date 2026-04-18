import React, { useState } from "react";

export default function Settings() {
  const [vouchers, setVouchers] = useState([
    {
      id: 1,
      code: "CAFE10",
      discount: 10,
      type: "percent",
      maxUse: 100,
      used: 45,
      expiryDate: "2024-05-31",
    },
    {
      id: 2,
      code: "SAVE50K",
      discount: 50000,
      type: "fixed",
      maxUse: 50,
      used: 28,
      expiryDate: "2024-06-30",
    },
  ]);

  const [shippingFees] = useState([
    {
      id: 1,
      location: "Nội thành",
      fee: 20000,
      description: "Giao hàng trong nội thành",
    },
    {
      id: 2,
      location: "Ngoại thành gần",
      fee: 35000,
      description: "Khoảng cách 20-30km",
    },
    {
      id: 3,
      location: "Ngoại thành xa",
      fee: 50000,
      description: "Khoảng cách >30km",
    },
  ]);

  const [showVoucherForm, setShowVoucherForm] = useState(false);
  const [voucherForm, setVoucherForm] = useState({
    code: "",
    discount: "",
    type: "percent",
    maxUse: "",
    expiryDate: "",
  });

  const handleAddVoucher = () => {
    if (!voucherForm.code || !voucherForm.discount || !voucherForm.expiryDate)
      return;

    setVouchers([
      ...vouchers,
      {
        id: Date.now(),
        ...voucherForm,
        discount: parseInt(voucherForm.discount),
        maxUse: parseInt(voucherForm.maxUse),
        used: 0,
      },
    ]);
    setShowVoucherForm(false);
    setVoucherForm({
      code: "",
      discount: "",
      type: "percent",
      maxUse: "",
      expiryDate: "",
    });
  };

  const deleteVoucher = (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa voucher này?")) {
      setVouchers(vouchers.filter((v) => v.id !== id));
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        ⚙️ Cấu hình hệ thống
      </h1>

      {/* Vouchers Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            🎟️ Quản lý Mã giảm giá
          </h2>
          <button
            onClick={() => setShowVoucherForm(!showVoucherForm)}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition-all hover:scale-105 shadow-md"
          >
            + Tạo mã mới
          </button>
        </div>

        {/* Voucher Form */}
        {showVoucherForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Tạo mã giảm giá
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Mã voucher (VD: CAFE10)"
                value={voucherForm.code}
                onChange={(e) =>
                  setVoucherForm({
                    ...voucherForm,
                    code: e.target.value.toUpperCase(),
                  })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <select
                value={voucherForm.type}
                onChange={(e) =>
                  setVoucherForm({ ...voucherForm, type: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="percent">Phần trăm (%)</option>
                <option value="fixed">Cố định (đ)</option>
              </select>
              <input
                type="number"
                placeholder="Giá trị giảm"
                value={voucherForm.discount}
                onChange={(e) =>
                  setVoucherForm({ ...voucherForm, discount: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="Số lần sử dụng tối đa"
                value={voucherForm.maxUse}
                onChange={(e) =>
                  setVoucherForm({ ...voucherForm, maxUse: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="date"
                value={voucherForm.expiryDate}
                onChange={(e) =>
                  setVoucherForm({ ...voucherForm, expiryDate: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAddVoucher}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Tạo mới
              </button>
              <button
                onClick={() => setShowVoucherForm(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* Vouchers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Mã
                </th>
                <th className="px-6 py-3 text-center font-semibold text-gray-700">
                  Giá trị
                </th>
                <th className="px-6 py-3 text-center font-semibold text-gray-700">
                  Loại
                </th>
                <th className="px-6 py-3 text-center font-semibold text-gray-700">
                  Sử dụng
                </th>
                <th className="px-6 py-3 text-center font-semibold text-gray-700">
                  Hạn sử dụng
                </th>
                <th className="px-6 py-3 text-center font-semibold text-gray-700">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((voucher) => (
                <tr key={voucher.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-blue-600">
                    {voucher.code}
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-800">
                    {voucher.discount}
                    {voucher.type === "percent" ? "%" : "đ"}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">
                    {voucher.type === "percent" ? "Phần trăm" : "Cố định"}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-800">
                    {voucher.used}/{voucher.maxUse}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">
                    {voucher.expiryDate}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => deleteVoucher(voucher.id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm transition-colors"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shipping Fees Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          🚚 Phí giao hàng
        </h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Khu vực
                </th>
                <th className="px-6 py-3 text-right font-semibold text-gray-700">
                  Phí
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Mô tả
                </th>
              </tr>
            </thead>
            <tbody>
              {shippingFees.map((fee) => (
                <tr key={fee.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {fee.location}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-gray-800">
                    {fee.fee.toLocaleString()}đ
                  </td>
                  <td className="px-6 py-4 text-gray-600">{fee.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
