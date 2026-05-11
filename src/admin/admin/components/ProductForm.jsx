import React, { useState, useEffect } from "react";
import axios from "axios";

// Component form thêm/sửa sản phẩm
const ProductForm = ({
  showForm, // boolean: hiển thị form hay không
  editingId, // id sản phẩm đang sửa (nếu có)
  formData, // object chứa dữ liệu form
  setFormData, // hàm cập nhật formData
  handleSave, // hàm lưu sản phẩm (gọi API bên ngoài)
  setShowForm, // đóng/mở form
  saving, // trạng thái đang lưu
  saveError, // lỗi khi lưu
}) => {
  // ===== STATE =====
  const [categories, setCategories] = useState([]); // danh sách danh mục
  const [categoriesLoading, setCategoriesLoading] = useState(true); // loading danh mục
  const [categoriesError, setCategoriesError] = useState(null); // lỗi danh mục

  const [errors, setErrors] = useState({}); // lỗi validate form

  const [uploading, setUploading] = useState(false); // trạng thái upload ảnh
  const [uploadError, setUploadError] = useState(null); // lỗi upload ảnh

  // ===== VALIDATE FORM =====
  const validateForm = () => {
    const validationErrors = {};

    // kiểm tra tên sản phẩm
    if (!formData.name?.trim())
      validationErrors.name = "Tên sản phẩm là bắt buộc.";

    // kiểm tra danh mục
    if (!formData.categoryId)
      validationErrors.categoryId = "Danh mục là bắt buộc.";

    // kiểm tra giá
    if (!formData.price && formData.price !== 0)
      validationErrors.price = "Giá là bắt buộc.";
    else if (Number(formData.price) <= 0)
      validationErrors.price = "Giá phải lớn hơn 0.";

    // kiểm tra tồn kho
    if (!formData.stockQuantity && formData.stockQuantity !== 0)
      validationErrors.stockQuantity = "Tồn kho là bắt buộc.";
    else if (Number(formData.stockQuantity) < 0)
      validationErrors.stockQuantity = "Tồn kho không thể là số âm.";

    // kiểm tra đơn vị
    if (!formData.unit?.trim()) validationErrors.unit = "Đơn vị là bắt buộc.";

    // kiểm tra URL ảnh nếu có
    if (formData.imageUrl?.trim()) {
      try {
        new URL(formData.imageUrl);
      } catch {
        validationErrors.imageUrl = "URL hình ảnh không hợp lệ.";
      }
    }

    setErrors(validationErrors);

    // trả về true nếu không có lỗi
    return Object.keys(validationErrors).length === 0;
  };

  // ===== SUBMIT FORM =====
  const handleSubmit = () => {
    if (!validateForm()) return; // nếu lỗi thì không submit
    handleSave(); // gọi hàm lưu
  };

  // ===== UPLOAD ẢNH =====
  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // kiểm tra loại file
    if (!file.type.startsWith("image/")) {
      setUploadError("Vui lòng chọn một tệp hình ảnh.");
      return;
    }

    // kiểm tra dung lượng (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Tệp hình ảnh không được vượt quá 5MB.");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file); // thêm file vào form

      // gọi API upload
      const response = await axios.post(
        "https://coffee-website-nhom18-admin.onrender.com/api/admin/upload/image",
        formDataUpload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // xử lý nhiều kiểu response khác nhau
      const imageUrl =
        response.data?.imageUrl ||
        response.data?.url ||
        response.data?.data?.imageUrl ||
        response.data?.data?.url ||
        response.data;

      // nếu trả về đúng URL thì set vào form
      if (typeof imageUrl === "string") {
        setFormData({ ...formData, imageUrl });
      } else {
        setUploadError("Phản hồi API không hợp lệ.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);

      setUploadError(
        error.response?.data?.message ||
          "Không thể tải lên hình ảnh. Vui lòng thử lại."
      );
    } finally {
      setUploading(false);
      event.target.value = ""; // reset input file
    }
  };

  // ===== LOAD DANH MỤC =====
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://coffee-website-nhom18-admin.onrender.com/api/categories"
        );

        // chuẩn hóa dữ liệu API
        const payload = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.content)
          ? response.data.content
          : Array.isArray(response.data?.data)
          ? response.data.data
          : [];

        // chỉ lấy danh mục active
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

  // ===== SET GIÁ TRỊ MẶC ĐỊNH CHO CATEGORY =====
  useEffect(() => {
    if (!categoriesLoading && categories.length > 0) {
      // nếu chưa có categoryId → chọn mặc định cái đầu
      if (!formData.categoryId) {
        setFormData({
          ...formData,
          categoryId: categories[0].id,
          categoryName: categories[0].name,
        });

        // nếu có id nhưng chưa có name → tìm name
      } else if (!formData.categoryName) {
        const selectedCategory = categories.find(
          (category) => String(category.id) === String(formData.categoryId)
        );

        if (selectedCategory) {
          setFormData({
            ...formData,
            categoryName: selectedCategory.name,
          });
        }
      }
    }
  }, [categoriesLoading, categories, formData, setFormData]);

  // ===== DANH SÁCH CATEGORY FALLBACK =====
  const categoryOptions =
    categories.length > 0
      ? categories
      : [
          { id: 1, name: "Cà phê" },
          { id: 2, name: "Đồ uống" },
          { id: 3, name: "Bánh miếng" },
        ];

  // nếu không hiển thị form thì return null
  if (!showForm) return null;

  // ===== UI =====
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* nền mờ */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => !saving && setShowForm(false)}
      />

      {/* form */}
      <div
        className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* tiêu đề */}
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
          {editingId ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
        </h2>

        {/* lỗi khi lưu */}
        {saveError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4">
            <p>{saveError}</p>
          </div>
        )}

        {/* ===== FORM INPUT ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* tên sản phẩm */}
          <input
            type="text"
            placeholder="Tên sản phẩm"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          {/* SKU (readonly) */}
          <input type="text" value={formData.sku} readOnly />

          {/* category */}
          <select
            value={formData.categoryId}
            onChange={(e) => {
              const selectedCategory = categories.find(
                (c) => String(c.id) === e.target.value
              );
              setFormData({
                ...formData,
                categoryId: e.target.value,
                categoryName: selectedCategory?.name || "",
              });
            }}
          >
            {categoryOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* giá */}
          <input
            type="number"
            placeholder="Giá"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />

          {/* tồn kho */}
          <input
            type="number"
            placeholder="Tồn kho"
            value={formData.stockQuantity}
            onChange={(e) =>
              setFormData({ ...formData, stockQuantity: e.target.value })
            }
          />

          {/* đơn vị */}
          <input
            type="text"
            placeholder="Đơn vị"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          />

          {/* upload ảnh */}
          <input type="file" accept="image/*" onChange={handleImageUpload} />

          {/* preview ảnh */}
          {formData.imageUrl && <img src={formData.imageUrl} alt="preview" />}

          {/* mô tả */}
          <textarea
            placeholder="Mô tả"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        {/* button */}
        <div className="flex gap-2 mt-4">
          <button onClick={handleSubmit}>
            {saving ? "Đang lưu..." : "Lưu"}
          </button>

          <button onClick={() => setShowForm(false)}>Hủy</button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
