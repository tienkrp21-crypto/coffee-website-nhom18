import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const categoriesResponse = await axios.get(
        "https://coffee-website-nhom18-admin.onrender.com/api/categories"
      );

      const productsResponse = await axios.get(
        "https://coffee-website-nhom18-admin.onrender.com/api/products?page=0&size=1000"
      );

      const productsData = productsResponse?.data;
      const products = Array.isArray(productsData)
        ? productsData
        : productsData?.content || productsData?.data || [];

      const productCountByCategory = {};
      products.forEach((product) => {
        const categoryId = product.categoryId || product.category_id;
        if (categoryId) {
          productCountByCategory[categoryId] =
            (productCountByCategory[categoryId] || 0) + 1;
        }
      });

      const categoriesData = categoriesResponse?.data;

      if (!Array.isArray(categoriesData)) {
        setCategories([]);
        setError("Dữ liệu danh mục không hợp lệ");
        return;
      }

      const allCategories = categoriesData.map((category) => ({
        ...category,
        productsCount: productCountByCategory[category.id] || 0,
      }));

      setCategories(allCategories);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Không thể tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const [togglingId, setTogglingId] = useState(null);

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
        const category = categories.find((c) => c.id === editingId);
        if (!category) return;

        const response = await axios.put(
          `https://coffee-website-nhom18-admin.onrender.com/api/categories/${editingId}`,
          {
            id: category.id,
            name: formData.name,
            description: formData.description,
            status: category.status,
          }
        );

        const updatedCategory = {
          ...response.data,
          productsCount: category.productsCount,
        };

        setCategories(
          categories.map((c) =>
            c.id === editingId ? updatedCategory : c
          )
        );
      } else {
        const response = await axios.post(
          "https://coffee-website-nhom18-admin.onrender.com/api/categories",
          {
            name: formData.name,
            description: formData.description,
            status: 1,
          }
        );

        const newCategory = {
          ...response.data,
          productsCount: 0,
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

  // 🔥 CÁCH 1: gửi FULL payload + id
  const handleToggleStatus = async (id) => {
    const category = categories.find((c) => c.id === id);
    if (!category) return;

    const newStatus = category.status === 1 ? 0 : 1;
    const actionText = newStatus === 1 ? "kích hoạt" : "vô hiệu hóa";

    if (!window.confirm(`Bạn chắc chắn muốn ${actionText} danh mục này?`))
      return;

    setTogglingId(id);

    try {
      const payload = {
        id: category.id, // 🔥 QUAN TRỌNG
        name: category.name,
        description: category.description,
        status: newStatus,
      };

      console.log("SEND:", payload);

      const response = await axios.put(
        `https://coffee-website-nhom18-admin.onrender.com/api/categories/${id}`,
        payload
      );

      console.log("RESPONSE:", response.data);

      const updatedCategory = {
        ...response.data,
        productsCount: category.productsCount,
      };

      setCategories(
        categories.map((c) => (c.id === id ? updatedCategory : c))
      );
    } catch (error) {
      console.error("Error updating category status:", error);
      alert("Không thể cập nhật trạng thái danh mục.");
    } finally {
      setTogglingId(null);
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
                  className="w-full px-4 py-2 border border-orange-300 rounded-lg"
                  disabled={saving}
                />
                <textarea
                  placeholder="Mô tả"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  rows="3"
                  className="w-full px-4 py-2 border border-orange-300 rounded-lg"
                  disabled={saving}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-green-600 text-white py-2 px-4 rounded"
                  >
                    {saving ? "Đang lưu..." : "Lưu"}
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    disabled={saving}
                    className="bg-gray-400 text-white py-2 px-4 rounded"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}

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
                    Trạng thái
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
                {Array.isArray(categories) &&
                  categories.map((category) => (
                    <tr key={category.id}>
                      <td className="px-6 py-4">{category.name}</td>
                      <td className="px-6 py-4">{category.description}</td>
                      <td className="px-6 py-4 text-center">
                        {category.status === 1
                          ? "Hoạt động"
                          : "Vô hiệu hóa"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {category.productsCount}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleEdit(category)}
                          className="bg-orange-500 text-white px-3 py-1 mr-2 rounded"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() =>
                            handleToggleStatus(category.id)
                          }
                          disabled={togglingId === category.id}
                          className={`px-3 py-1 rounded text-white ${
                            category.status === 1
                              ? "bg-red-500"
                              : "bg-green-500"
                          }`}
                        >
                          {togglingId === category.id
                            ? "Đang xử lý..."
                            : category.status === 1
                            ? "Vô hiệu hóa"
                            : "Kích hoạt"}
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