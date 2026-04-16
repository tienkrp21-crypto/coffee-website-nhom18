import React, { useState } from "react";

export default function Inventory() {
  const [items, setItems] = useState([
    {
      id: 1,
      product: "Cà phê Robusta",
      quantity: 5,
      unit: "kg",
      minStock: 10,
      status: "low",
    },
    {
      id: 2,
      product: "Cà phê Arabica",
      quantity: 25,
      unit: "kg",
      minStock: 15,
      status: "good",
    },
    {
      id: 3,
      product: "Sữa tươi",
      quantity: 3,
      unit: "hộp",
      minStock: 5,
      status: "low",
    },
    {
      id: 4,
      product: "Đường",
      quantity: 50,
      unit: "kg",
      minStock: 20,
      status: "good",
    },
    {
      id: 5,
      product: "Cốc giấy 12oz",
      quantity: 200,
      unit: "cái",
      minStock: 100,
      status: "good",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    unit: "kg",
    minStock: "",
  });

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      product: item.product,
      quantity: item.quantity,
      unit: item.unit,
      minStock: item.minStock,
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.product || !formData.quantity || !formData.minStock) return;

    setItems(
      items.map((item) =>
        item.id === editingId
          ? {
              ...item,
              ...formData,
              quantity: parseInt(formData.quantity),
              minStock: parseInt(formData.minStock),
              status:
                parseInt(formData.quantity) < parseInt(formData.minStock)
                  ? "low"
                  : "good",
            }
          : item
      )
    );
    setShowForm(false);
  };

  const getStatusBadge = (status) => {
    return status === "low"
      ? "bg-red-100 text-red-700"
      : "bg-green-100 text-green-700";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">📦 Quản lý Tồn kho</h1>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Cập nhật tồn kho
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Tên sản phẩm"
              value={formData.product}
              onChange={(e) =>
                setFormData({ ...formData, product: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Số lượng"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <select
              value={formData.unit}
              onChange={(e) =>
                setFormData({ ...formData, unit: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="kg">kg</option>
              <option value="hộp">hộp</option>
              <option value="cái">cái</option>
              <option value="chai">chai</option>
            </select>
            <input
              type="number"
              placeholder="Tồn kho tối thiểu"
              value={formData.minStock}
              onChange={(e) =>
                setFormData({ ...formData, minStock: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2 mt-4">
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
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Sản phẩm
              </th>
              <th className="px-6 py-3 text-center font-semibold text-gray-700">
                Số lượng
              </th>
              <th className="px-6 py-3 text-center font-semibold text-gray-700">
                Đơn vị
              </th>
              <th className="px-6 py-3 text-center font-semibold text-gray-700">
                Tối thiểu
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
            {items.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-800">
                  {item.product}
                </td>
                <td className="px-6 py-4 text-center text-gray-800 font-semibold">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 text-center text-gray-600">
                  {item.unit}
                </td>
                <td className="px-6 py-4 text-center text-gray-800">
                  {item.minStock}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded font-semibold text-sm ${getStatusBadge(
                      item.status
                    )}`}
                  >
                    {item.status === "low" ? "⚠️ Thấp" : "✓ Bình thường"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-orange-500 hover:bg-orange-600 text-white py-1 px-3 rounded text-sm transition-all hover:scale-105 shadow-md"
                  >
                    Cập nhật
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
