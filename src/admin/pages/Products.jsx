import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE =
  "https://coffee-website-nhom18-admin.onrender.com/api/products";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    categoryName: "Cà phê",
    price: "",
    unit: "hộp",
    stockQuantity: "",
    imageUrl: "",
    description: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(API_BASE);
        const payload = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.content)
          ? response.data.content
          : Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data?.products)
          ? response.data.products
          : [];
        setProducts(payload);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Không thể tải danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      sku: "",
      name: "",
      categoryName: "Cà phê",
      price: "",
      unit: "hộp",
      stockQuantity: "",
      imageUrl: "",
      description: "",
    });
    setSaveError(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      sku: product.sku || "",
      name: product.name || "",
      categoryName: product.categoryName || "Cà phê",
      price: product.price ?? "",
      unit: product.unit || "hộp",
      stockQuantity: product.stockQuantity ?? "",
      imageUrl: product.imageUrl || "",
      description: product.description || "",
    });
    setSaveError(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (
      !formData.sku ||
      !formData.name ||
      !formData.price ||
      !formData.stockQuantity
    ) {
      setSaveError("Vui lòng nhập đầy đủ SKU, tên, giá và tồn kho.");
      return;
    }

    setSaving(true);
    setSaveError(null);

    const payload = {
      sku: formData.sku,
      name: formData.name,
      price: Number(formData.price),
      unit: formData.unit,
      stockQuantity: Number(formData.stockQuantity),
      imageUrl: formData.imageUrl || null,
      description: formData.description,
      status: 1,
      categoryName: formData.categoryName,
    };

    try {
      if (editingId) {
        const response = await axios.put(`${API_BASE}/${editingId}`, payload);
        const updatedProduct = response.data;
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === editingId ? updatedProduct : product
          )
        );
      } else {
        const response = await axios.post(API_BASE, payload);
        const newProduct = response.data;
        setProducts((prevProducts) => [...prevProducts, newProduct]);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        sku: "",
        name: "",
        categoryName: "Cà phê",
        price: "",
        unit: "hộp",
        stockQuantity: "",
        imageUrl: "",
        description: "",
      });
    } catch (error) {
      console.error("Error saving product:", error);
      setSaveError("Không thể lưu sản phẩm. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) return;

    try {
      await axios.delete(`${API_BASE}/${id}`);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Không thể xóa sản phẩm. Vui lòng thử lại.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          ☕ Quản lý Sản phẩm
        </h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          + Thêm sản phẩm
        </button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Đang tải danh sách sản phẩm...</p>
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
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {editingId ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
              </h2>

              {saveError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <p>{saveError}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Tên sản phẩm"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  disabled={saving}
                />
                <select
                  value={formData.categoryName}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryName: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  disabled={saving}
                >
                  <option value="Cà phê">Cà phê</option>
                  <option value="Đồ uống">Đồ uống</option>
                  <option value="Bánh miếng">Bánh miếng</option>
                </select>
                <input
                  type="text"
                  placeholder="Mã SKU"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  disabled={saving}
                />
                <input
                  type="number"
                  placeholder="Giá"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  disabled={saving}
                />
                <input
                  type="number"
                  placeholder="Tồn kho"
                  value={formData.stockQuantity}
                  onChange={(e) =>
                    setFormData({ ...formData, stockQuantity: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  disabled={saving}
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  {saving ? "Đang lưu..." : "Lưu"}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  disabled={saving}
                  className="bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Tên sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Đơn vị
                  </th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-700">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">
                    Tồn kho
                  </th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Không có sản phẩm nào.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                            ) : (
                              "☕"
                            )}
                          </span>
                          <div>
                            <div className="font-semibold text-gray-800">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {product.sku}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {product.categoryName || "Chưa có"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {product.unit || "-"}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-800">
                        {(product.price || 0).toLocaleString()}đ
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded font-semibold ${
                            product.stockQuantity > 20
                              ? "bg-green-100 text-green-700"
                              : product.stockQuantity > 5
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.stockQuantity ?? 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleEdit(product)}
                          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm mr-2 transition-colors"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm transition-colors"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
