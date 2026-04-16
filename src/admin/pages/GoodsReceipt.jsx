import React, { useState } from "react";

export default function GoodsReceipt() {
  const [receipts, setReceipts] = useState([
    {
      id: "GR001",
      date: "2024-04-05",
      supplier: "Công ty Cà phê XYZ",
      items: 5,
      amount: 2500000,
      status: "Đã nhập",
    },
    {
      id: "GR002",
      date: "2024-04-03",
      supplier: "Nhà cung cấp ABC",
      items: 3,
      amount: 1500000,
      status: "Đã nhập",
    },
    {
      id: "GR003",
      date: "2024-03-30",
      supplier: "Công ty Đại lý",
      items: 8,
      amount: 4200000,
      status: "Đã nhập",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    supplier: "",
    items: "",
    amount: "",
    description: "",
  });

  const handleAdd = () => {
    setFormData({ supplier: "", items: "", amount: "", description: "" });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.supplier || !formData.items || !formData.amount) return;

    setReceipts([
      ...receipts,
      {
        id: "GR" + String(receipts.length + 1).padStart(3, "0"),
        date: new Date().toISOString().split("T")[0],
        supplier: formData.supplier,
        items: parseInt(formData.items),
        amount: parseInt(formData.amount),
        status: "Đã nhập",
      },
    ]);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          📋 Lịch sử Nhập kho
        </h1>
        <button
          onClick={handleAdd}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition-all hover:scale-105 shadow-md"
        >
          + Tạo phiếu nhập
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Tạo phiếu nhập hàng mới
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Tên nhà cung cấp"
              value={formData.supplier}
              onChange={(e) =>
                setFormData({ ...formData, supplier: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Số lượng mặt hàng"
                value={formData.items}
                onChange={(e) =>
                  setFormData({ ...formData, items: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="Tổng tiền"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <textarea
              placeholder="Ghi chú"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Lưu
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Mã phiếu
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Ngày nhập
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Nhà cung cấp
              </th>
              <th className="px-6 py-3 text-center font-semibold text-gray-700">
                Số mặt hàng
              </th>
              <th className="px-6 py-3 text-right font-semibold text-gray-700">
                Tổng tiền
              </th>
              <th className="px-6 py-3 text-center font-semibold text-gray-700">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody>
            {receipts.map((receipt) => (
              <tr key={receipt.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-blue-600">
                  {receipt.id}
                </td>
                <td className="px-6 py-4 text-gray-600">{receipt.date}</td>
                <td className="px-6 py-4 text-gray-800">{receipt.supplier}</td>
                <td className="px-6 py-4 text-center text-gray-800 font-semibold">
                  {receipt.items}
                </td>
                <td className="px-6 py-4 text-right font-semibold text-gray-800">
                  {receipt.amount.toLocaleString()}đ
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="px-3 py-1 rounded bg-green-100 text-green-700 font-semibold text-sm">
                    ✓ {receipt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
