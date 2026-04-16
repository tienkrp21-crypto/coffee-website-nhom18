import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://coffee-website-nhom18-admin.onrender.com/api/categories"
        );
        // Filter active categories (status === 1) and add productsCount
        const activeCategories = response.data
          .filter((category) => category.status === 1)
          .map((category) => ({
            ...category,
            productsCount: 0, // API doesn't provide this, set to 0
          }));
        setCategories(activeCategories);
        setLoading(false);
      } catch {
        setError("Không thể tải danh sách danh mục");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
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

  const handleSave = async () => {
    if (!formData.name) return;

    setSaving(true);
    setSaveError(null);

    try {
      if (editingId) {
        // Edit existing category via API
        const response = await axios.put(
          `https://coffee-website-nhom18-admin.onrender.com/api/categories/${editingId}`,
          {
            name: formData.name,
            description: formData.description,
            status: 1, // Keep active status
          }
        );

        // Update the category in the list
        const updatedCategory = {
          ...response.data,
          productsCount: 0, // API might not return this
        };
        setCategories(
          categories.map((c) => (c.id === editingId ? updatedCategory : c))
        );
      } else {
        // Add new category via API
        const response = await axios.post(
          "https://coffee-website-nhom18-admin.onrender.com/api/categories",
          {
            name: formData.name,
            description: formData.description,
            status: 1, // Assuming new categories are active by default
          }
        );

        // Add the new category to the list
        const newCategory = {
          ...response.data,
          productsCount: 0, // API might not return this
        };
        setCategories([...categories, newCategory]);
      }
      setShowForm(false);
    } catch (error) {
      setSaveError("Không thể lưu danh mục. Vui lòng thử lại.");
      console.error("Error saving category:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa danh mục này?")) return;

    try {
      await axios.delete(
        `https://coffee-website-nhom18-admin.onrender.com/api/categories/${id}`
      );

      // Remove the category from the list
      setCategories(categories.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Không thể xóa danh mục. Vui lòng thử lại.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-orange-800">
          📁 Quản lý Danh mục
        </h1>
        <button
          onClick={handleAdd}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition-all hover:scale-105 shadow-md"
        >
          + Thêm danh mục
        </button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Đang tải danh sách danh mục...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {showForm && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-orange-200">
              <h2 className="text-xl font-bold text-orange-800 mb-4">
                {editingId ? "Sửa danh mục" : "Thêm danh mục mới"}
              </h2>

              {saveError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <p>{saveError}</p>
                </div>
              )}

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Tên danh mục"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                  disabled={saving}
                />
                <textarea
                  placeholder="Mô tả"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="3"
                  className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                  disabled={saving}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-2 px-4 rounded transition-all hover:scale-105 shadow-md"
                  >
                    {saving ? "Đang lưu..." : "Lưu"}
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    disabled={saving}
                    className="bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded transition-all hover:scale-105 shadow-md"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-orange-200">
            <table className="w-full">
              <thead className="bg-orange-100 border-b border-orange-200">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-orange-800">
                    Tên danh mục
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-orange-800">
                    Mô tả
                  </th>
                  <th className="px-6 py-3 text-center font-semibold text-orange-800">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-center font-semibold text-orange-800">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b border-orange-100 hover:bg-orange-50 transition-colors">
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
                        className="bg-orange-500 hover:bg-orange-600 text-white py-1 px-3 rounded text-sm mr-2 transition-all hover:scale-105 shadow-md"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm transition-all hover:scale-105 shadow-md"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
