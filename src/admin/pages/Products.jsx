import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductForm from "../components/ProductForm";

const API_BASE =
  "https://coffee-website-nhom18-admin.onrender.com/api/products";

const generateSku = () => {
  const timestamp = Date.now();
  const randomPart = Math.floor(Math.random() * 900 + 100);
  return `SKU-${timestamp}-${randomPart}`;
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [allProducts, setAllProducts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    categoryName: "",
    price: "",
    unit: "hộp",
    stockQuantity: "",
    imageUrl: "",
    description: "",
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        if (!isSearching) {
          setIsSearching(true);
          fetchProducts(0, true);
        }
      } else {
        if (isSearching) {
          setIsSearching(false);
          fetchProducts(0, false);
        }
      }
    }, 300); // Debounce 300ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    fetchProducts(0);
  }, []);

  const fetchProducts = async (page = 0, searchAll = false) => {
    setLoading(true);
    try {
      if (searchAll) {
        // Fetch all pages for comprehensive search
        const allProductsData = [];
        let currentPage = 0;
        let hasMorePages = true;

        while (hasMorePages) {
          const response = await axios.get(
            `${API_BASE}?page=${currentPage}&size=10`
          );
          const payload = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response.data?.content)
            ? response.data.content
            : Array.isArray(response.data?.data)
            ? response.data.data
            : Array.isArray(response.data?.products)
            ? response.data.products
            : [];

          allProductsData.push(...payload);

          const totalPages =
            response.data?.totalPages || response.data?.total_pages || 1;
          hasMorePages = currentPage < totalPages - 1;
          currentPage++;

          // Prevent infinite loop
          if (currentPage > 100) break;
        }

        setAllProducts(allProductsData);
        setProducts(allProductsData);
        setTotalPages(1);
        setTotalElements(allProductsData.length);
        setCurrentPage(0);
      } else {
        // Normal pagination
        const response = await axios.get(`${API_BASE}?page=${page}&size=10`);
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
        setTotalPages(
          response.data?.totalPages || response.data?.total_pages || 1
        );
        setTotalElements(
          response.data?.totalElements ||
            response.data?.total_elements ||
            payload.length
        );
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Không thể tải danh sách sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      sku: generateSku(),
      name: "",
      categoryId: "",
      categoryName: "",
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
      categoryId:
        product.categoryId || product.category_id || product.category?.id || "",
      categoryName:
        product.categoryName ||
        product.category?.name ||
        product.category_name ||
        "",
      price: product.price ?? "",
      unit: product.unit || "hộp",
      stockQuantity: product.stockQuantity ?? "",
      imageUrl: product.imageUrl || product.image_url || "",
      description: product.description || "",
    });
    setSaveError(null);
    setShowForm(true);
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      fetchProducts(page);
    }
  };

  const handleSave = async () => {
    if (
      !formData.sku ||
      !formData.name ||
      !formData.price ||
      !formData.stockQuantity ||
      !formData.categoryId
    ) {
      setSaveError("Vui lòng nhập đầy đủ tên, danh mục, giá và tồn kho.");
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
      categoryId: Number(formData.categoryId),
      categoryName: formData.categoryName || undefined,
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
        if (isSearching) {
          setAllProducts((prevProducts) =>
            prevProducts.map((product) =>
              product.id === editingId ? updatedProduct : product
            )
          );
        }
      } else {
        const response = await axios.post(API_BASE, payload);
        const newProduct = response.data;
        setProducts((prevProducts) => [...prevProducts, newProduct]);
        if (isSearching) {
          setAllProducts((prevProducts) => [...prevProducts, newProduct]);
        }
        setTotalElements((prev) => prev + 1);
        // Recalculate total pages if needed
        const newTotalPages = Math.ceil((totalElements + 1) / 10);
        setTotalPages(newTotalPages);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        sku: "",
        name: "",
        categoryId: "",
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

  const handleStatusUpdate = async (id, newStatus) => {
    const action = newStatus === 1 ? "kích hoạt" : "vô hiệu hóa";
    if (!window.confirm(`Bạn chắc chắn muốn ${action} sản phẩm này?`)) return;

    try {
      const payload = { status: newStatus };
      await axios.put(`${API_BASE}/${id}`, payload);

      // Update local state
      if (isSearching) {
        setAllProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === id ? { ...product, status: newStatus } : product
          )
        );
      } else {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === id ? { ...product, status: newStatus } : product
          )
        );
      }
    } catch (error) {
      console.error("Error updating product status:", error);
      alert("Không thể cập nhật trạng thái sản phẩm. Vui lòng thử lại.");
    }
  };

  const filteredProducts =
    isSearching && searchTerm.trim()
      ? allProducts.filter((product) => {
          const term = searchTerm.trim().toLowerCase();
          return (
            product.name?.toLowerCase().includes(term) ||
            product.sku?.toLowerCase().includes(term) ||
            product.categoryName?.toLowerCase().includes(term)
          );
        })
      : products;

  const currentProducts = isSearching ? filteredProducts : products;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-orange-800">
          ☕ Quản lý Sản phẩm
        </h1>
        <button
          onClick={handleAdd}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition-all hover:scale-105 shadow-md text-sm sm:text-base"
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
            <ProductForm
              showForm={showForm}
              editingId={editingId}
              formData={formData}
              setFormData={setFormData}
              handleSave={handleSave}
              setShowForm={setShowForm}
              saving={saving}
              saveError={saveError}
            />
          )}

          <div className="flex flex-col gap-4 mb-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full lg:w-1/2">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              {isSearching
                ? `${filteredProducts.length} sản phẩm tìm thấy / Tổng số: ${allProducts.length} sản phẩm`
                : `${currentProducts.length} sản phẩm (Trang ${
                    currentPage + 1
                  } / ${totalPages}) / Tổng số: ${totalElements} sản phẩm`}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-x-auto -mx-4 sm:m-0">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-gray-100 border-b sticky top-0">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left font-semibold text-gray-700">
                    Tên sản phẩm
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left font-semibold text-gray-700 hidden sm:table-cell">
                    Danh mục
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">
                    Đơn vị
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right font-semibold text-gray-700">
                    Giá
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-center font-semibold text-gray-700 hidden md:table-cell">
                    Tồn kho
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-center font-semibold text-gray-700 hidden lg:table-cell">
                    Trạng thái
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-center font-semibold text-gray-700">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-3 sm:px-6 py-8 text-center text-gray-500 text-xs sm:text-sm"
                    >
                      Không tìm thấy sản phẩm phù hợp.
                    </td>
                  </tr>
                ) : (
                  currentProducts.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded"
                              />
                            ) : (
                              "☕"
                            )}
                          </span>
                          <div className="min-w-0">
                            <div className="font-semibold text-gray-800 text-xs sm:text-sm truncate">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500 sm:hidden">
                              {product.categoryName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-gray-700 hidden sm:table-cell text-xs sm:text-sm">
                        {product.categoryName}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-gray-700 hidden md:table-cell text-xs sm:text-sm">
                        {product.unit}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-right font-semibold text-gray-800 text-xs sm:text-sm">
                        {product.price.toLocaleString()}đ
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-center text-gray-700 hidden md:table-cell text-xs sm:text-sm">
                        {product.stockQuantity}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-center hidden lg:table-cell">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            product.status === 1
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.status === 1 ? "Hoạt động" : "Vô hiệu"}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4">
                        <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
                          <button
                            onClick={() => handleEdit(product)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 sm:py-2 sm:px-3 rounded text-xs sm:text-sm transition"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(
                                product.id,
                                product.status === 1 ? 0 : 1
                              )
                            }
                            className={`font-bold py-1 px-2 sm:py-2 sm:px-3 rounded text-xs sm:text-sm transition ${
                              product.status === 1
                                ? "bg-red-500 hover:bg-red-600 text-white"
                                : "bg-green-500 hover:bg-green-600 text-white"
                            }`}
                          >
                            {product.status === 1 ? "Vô hiệu" : "Kích hoạt"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-100 px-3 sm:px-6 py-4">
            <div className="text-xs sm:text-sm text-gray-600">
              {isSearching
                ? `Hiển thị ${currentProducts.length} sản phẩm tìm thấy`
                : `Hiển thị ${currentProducts.length} sản phẩm (Trang ${
                    currentPage + 1
                  } / ${totalPages})`}
            </div>
            {!isSearching && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded"
                >
                  ‹ Trước
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i;
                  } else if (currentPage < 3) {
                    pageNum = i;
                  } else if (currentPage > totalPages - 3) {
                    pageNum = totalPages - 5 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 text-sm rounded ${
                        currentPage === pageNum
                          ? "bg-orange-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded"
                >
                  Sau ›
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
