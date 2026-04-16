import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductForm = ({
  showForm,
  editingId,
  formData,
  setFormData,
  handleSave,
  setShowForm,
  saving,
  saveError,
}) => {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://coffee-website-nhom18-admin.onrender.com/api/categories"
        );
        const payload = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.content)
          ? response.data.content
          : Array.isArray(response.data?.data)
          ? response.data.data
          : [];
        const activeCategories = payload.filter(
          (category) => category.status === 1
        );
        setCategories(activeCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategoriesError("Không thể tải danh mục sản phẩm.");
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!categoriesLoading && categories.length > 0 && !formData.categoryId) {
      setFormData({ ...formData, categoryId: categories[0].id });
    }
  }, [categoriesLoading, categories, formData, setFormData]);

  const categoryOptions =
    categories.length > 0
      ? categories
      : [
          { id: 1, name: "Cà phê" },
          { id: 2, name: "Đồ uống" },
          { id: 3, name: "Bánh miếng" },
        ];
  if (!showForm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => !saving && setShowForm(false)}
      />
      <div
        className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
          {editingId ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
        </h2>

        {saveError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded mb-4 text-xs sm:text-sm">
            <p>{saveError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <input
            type="text"
            placeholder="Tên sản phẩm"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            disabled={saving}
          />
          <input
            type="text"
            placeholder="Mã SKU"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            disabled={saving}
          />
          <select
            value={formData.categoryId}
            onChange={(e) =>
              setFormData({ ...formData, categoryId: e.target.value })
            }
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            disabled={saving || categoriesLoading}
          >
            {categoriesLoading ? (
              <option value="" disabled>
                Đang tải danh mục...
              </option>
            ) : (
              categoryOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            )}
          </select>
          {categoriesError && (
            <div className="col-span-1 sm:col-span-2 text-xs sm:text-sm text-red-600">
              {categoriesError}
            </div>
          )}
          <input
            type="number"
            placeholder="Giá"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            disabled={saving}
          />
          <input
            type="number"
            placeholder="Tồn kho"
            value={formData.stockQuantity}
            onChange={(e) =>
              setFormData({ ...formData, stockQuantity: e.target.value })
            }
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            disabled={saving}
          />
          <input
            type="text"
            placeholder="Đơn vị"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            disabled={saving}
          />
          <input
            type="text"
            placeholder="URL hình ảnh"
            value={formData.imageUrl}
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            disabled={saving}
          />
          <textarea
            placeholder="Mô tả"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 col-span-1 sm:col-span-2 text-sm"
            rows="3"
            disabled={saving}
          />
        </div>
        <div className="flex gap-2 mt-4 flex-wrap">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-2 px-4 rounded transition-colors text-sm"
          >
            {saving ? "Đang lưu..." : "Lưu"}
          </button>
          <button
            onClick={() => setShowForm(false)}
            disabled={saving}
            className="bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded transition-colors text-sm"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
