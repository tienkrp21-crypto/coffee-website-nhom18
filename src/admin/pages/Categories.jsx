import React, { useState } from "react";

export default function Categories() {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Cà phê",
      description: "Các loại cà phê nguyên chất",
      productsCount: 12,
    },
    {
      id: 2,
      name: "Đồ uống",
      description: "Các loại đồ uống khác",
      productsCount: 8,
    },
    {
      id: 3,
      name: "Bánh miếng",
      description: "Bánh và pastry",
      productsCount: 15,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ name: "", description: "" });
    setShowForm(true);
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setFormData({ name: category.name, description: category.description });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.name) return;

    if (editingId) {
      setCategories(
        categories.map((c) => (c.id === editingId ? { ...c, ...formData } : c))
      );
    } else {
      setCategories([
        ...categories,
        {
          id: Date.now(),
          ...formData,
          productsCount: 0,
        },
      ]);
    }
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa danh mục này?")) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          📁 Quản lý Danh mục
        </h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          + Thêm danh mục
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {editingId ? "Sửa danh mục" : "Thêm danh mục mới"}
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Tên danh mục"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <textarea
              placeholder="Mô tả"
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
                Tên danh mục
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Mô tả
              </th>
              <th className="px-6 py-3 text-center font-semibold text-gray-700">
                Sản phẩm
              </th>
              <th className="px-6 py-3 text-center font-semibold text-gray-700">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-800">
                  {category.name}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {category.description}
                </td>
                <td className="px-6 py-4 text-center text-gray-800 font-semibold">
                  {category.productsCount}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleEdit(category)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm mr-2 transition-colors"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
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
  );
}
