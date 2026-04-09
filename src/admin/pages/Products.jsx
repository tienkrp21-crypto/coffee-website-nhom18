import React, { useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Cà phê đen đá",
      category: "Cà phê",
      price: 25000,
      stock: 50,
      image: "☕",
    },
    {
      id: 2,
      name: "Cà phê sữa nóng",
      category: "Cà phê",
      price: 30000,
      stock: 35,
      image: "☕",
    },
    {
      id: 3,
      name: "Cappuccino",
      category: "Cà phê",
      price: 40000,
      stock: 28,
      image: "☕",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Cà phê",
    price: "",
    stock: "",
    image: "☕",
  });

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      name: "",
      category: "Cà phê",
      price: "",
      stock: "",
      image: "☕",
    });
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData(product);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.stock) return;

    if (editingId) {
      setProducts(
        products.map((p) =>
          p.id === editingId
            ? {
                ...p,
                ...formData,
                price: parseInt(formData.price),
                stock: parseInt(formData.stock),
              }
            : p
        )
      );
    } else {
      setProducts([
        ...products,
        {
          id: Date.now(),
          ...formData,
          price: parseInt(formData.price),
          stock: parseInt(formData.stock),
        },
      ]);
    }
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) {
      setProducts(products.filter((p) => p.id !== id));
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

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {editingId ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Tên sản phẩm"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="Cà phê">Cà phê</option>
              <option value="Đồ uống">Đồ uống</option>
              <option value="Bánh miếng">Bánh miếng</option>
            </select>
            <input
              type="number"
              placeholder="Giá"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Tồn kho"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
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
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Danh mục
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
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{product.image}</span>
                    <span className="font-semibold text-gray-800">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{product.category}</td>
                <td className="px-6 py-4 text-right font-semibold text-gray-800">
                  {product.price.toLocaleString()}đ
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded font-semibold ${
                      product.stock > 20
                        ? "bg-green-100 text-green-700"
                        : product.stock > 5
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.stock}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
