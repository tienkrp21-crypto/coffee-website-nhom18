import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Search } from "lucide-react";

// Cấu hình URL API
//const BASE_URL = 'http://localhost:8080';
const BASE_URL = "https://coffee-website-nhom18.onrender.com";
const ProductList = () => {
  const { addToCart } = useCart();

  // State management
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // --- KHO CHỨA DỮ LIỆU TỪ API ---
  const [apiCategories, setApiCategories] = useState([]);
  const [apiProducts, setApiProducts] = useState([]); 

  // --- GỌI API LẤY CẢ DANH MỤC & SẢN PHẨM ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Lấy danh mục
        const catResponse = await fetch(`${BASE_URL}/categories`);
        if (catResponse.ok) {
          const catData = await catResponse.json();
          setApiCategories(catData);
        }

        // 2. Lấy sản phẩm
        const prodResponse = await fetch(`${BASE_URL}/products`); // Đảm bảo Backend có API /products
        if (prodResponse.ok) {
          const prodData = await prodResponse.json();
          setApiProducts(prodData);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu từ Backend:", error);
      }
    };

    fetchData();
  }, []);

  // --- LOGIC LỌC VÀ SẮP XẾP SẢN PHẨM ---
  const filteredProducts = useMemo(() => {
    // SỬ DỤNG DỮ LIỆU THẬT TỪ API Ở ĐÂY
    let filtered = [...apiProducts];

    // Lọc theo danh mục được chọn
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => {
        // Phòng trường hợp Backend trả về category là 1 Object (có chứa name)
        const catName = p.category?.name || p.category;
        return catName === selectedCategory;
      });
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Sắp xếp
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name, "vi"));
        break;
      case "newest":
      default:
        filtered.sort((a, b) => b.id - a.id);
        break;
    }

    return filtered;
  }, [selectedCategory, sortBy, searchQuery, apiProducts]);

  // --- PHÂN TRANG ---
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // --- XỬ LÝ THÊM GIỎ HÀNG ---
  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="font-sans text-gray-600 bg-white pb-20">
      {/* ============================================
          1. PAGE HEADER
      ============================================ */}
      <div
        className="container-fluid bg-dark p-12 mb-12 flex items-center justify-center relative"
        style={{
          backgroundImage:
            'linear-gradient(rgba(43, 40, 37, .7), rgba(43, 40, 37, .7)), url("https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1920")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-center z-10 py-10">
          <h1 className="display-4 text-uppercase text-white font-heading text-5xl mb-4">
            Menu & Bảng Giá
          </h1>
          <div className="flex items-center justify-center gap-3 text-white font-heading text-lg">
            <Link to="/" className="hover:text-primary transition">
              Trang chủ
            </Link>
            <span className="text-primary text-xs">■</span>
            <span>Menu</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* ============================================
            2. TIÊU ĐỀ & TABS DANH MỤC
        ============================================ */}
        <div className="section-title relative text-center mx-auto mb-12 pb-6 max-w-2xl">
          <h2 className="text-primary font-cursive text-3xl mb-2">
            Khám phá nguyên liệu
          </h2>
          <h1 className="text-4xl md:text-5xl text-dark font-heading uppercase">
            Sản phẩm của chúng tôi
          </h1>
        </div>

        {/* Thanh Tabs Danh Mục Đổ từ API */}
        <div className="text-center mb-12">
          <ul className="inline-flex justify-center bg-dark uppercase border-inner p-4 mb-5 flex-wrap gap-2 shadow-lg">
            <li>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setCurrentPage(1);
                }}
                className={`px-6 py-2 font-heading uppercase transition text-lg tracking-wider ${
                  selectedCategory === "all"
                    ? "text-primary"
                    : "text-white hover:text-primary"
                }`}
              >
                Tất cả
              </button>
            </li>

            {apiCategories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setCurrentPage(1);
                  }}
                  className={`px-6 py-2 font-heading uppercase transition text-lg tracking-wider ${
                    selectedCategory === cat.name
                      ? "text-primary"
                      : "text-white hover:text-primary"
                  }`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* ============================================
            3. THANH TÌM KIẾM & SẮP XẾP
        ============================================ */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-secondary border-inner p-4 mb-10 shadow-sm">
          <div className="flex items-center space-x-3 z-10 relative">
            <span className="font-heading uppercase text-dark font-bold">
              Sắp xếp:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border-b-2 border-dark bg-transparent px-2 py-1 font-heading uppercase text-sm focus:outline-none focus:border-primary text-dark cursor-pointer"
            >
              <option value="newest">Mới nhất</option>
              <option value="price-low">Giá thấp đến cao</option>
              <option value="price-high">Giá cao đến thấp</option>
              <option value="name">Tên A-Z</option>
            </select>
          </div>

          <div className="flex-1 max-w-md z-10 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm nguyên liệu..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-white border border-gray-200 px-4 py-2 pr-10 focus:outline-none focus:border-primary font-sans"
              />
              <Search
                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
                size={20}
              />
            </div>
          </div>
        </div>

        {/* ============================================
            4. LƯỚI SẢN PHẨM
        ============================================ */}
        {paginatedProducts.length === 0 ? (
          <div className="text-center py-20 bg-secondary border-inner">
            <p className="text-gray-500 text-xl font-heading uppercase z-10 relative">
              Đang tải sản phẩm hoặc không có sản phẩm nào phù hợp.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {paginatedProducts.map((product) => (
              <div
                key={product.id}
                className="flex h-40 bg-secondary border-inner group cursor-pointer hover:shadow-md transition duration-300"
              >
                {/* Khung Ảnh & Giá */}
                <div className="relative w-40 shrink-0 overflow-hidden z-10">
                  <Link to={`/product/${product.id}`}>
                    <img
                      // Logic chuẩn để hiển thị ảnh dù Backend trả về kiểu gì
                      src={
                        product.image?.startsWith("http")
                          ? product.image
                          : `${BASE_URL}/${product.image?.replace(/^\//, "")}`
                      }
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      alt={product.name}
                      // Thêm dòng này để nếu ảnh lỗi thì hiện một ảnh mặc định
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=400";
                      }}
                    />
                  </Link>
                  <h4 className="absolute bottom-0 left-0 bg-dark text-primary font-heading text-lg px-3 py-2 m-0 w-full text-center bg-opacity-95">
                    {product.price.toLocaleString("vi-VN")}đ
                  </h4>
                </div>

                {/* Khung Thông tin */}
                <div className="flex-1 flex flex-col justify-center text-left px-6 py-3 z-10">
                  <Link to={`/product/${product.id}`}>
                    <h5 className="font-heading text-dark text-xl uppercase mb-1 group-hover:text-primary transition line-clamp-1">
                      {product.name}
                    </h5>
                  </Link>
                  <p className="text-sm line-clamp-2 text-gray-500 mb-3">
                    {product.description ||
                      "Nguyên liệu pha chế cao cấp, đảm bảo hương vị tuyệt hảo."}
                  </p>

                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">
                      {product.category?.name || product.category}
                    </span>
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="text-xs font-heading uppercase text-dark bg-primary/20 px-4 py-2 hover:bg-primary hover:text-white transition"
                    >
                      + Thêm giỏ hàng
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============================================
            5. PHÂN TRANG
        ============================================ */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 flex items-center justify-center font-heading uppercase text-lg border-inner transition z-10 ${
                  currentPage === page
                    ? "bg-primary text-white"
                    : "bg-dark text-white hover:bg-primary"
                }`}
              >
                <span className="z-10 relative">{page}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
