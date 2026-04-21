import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Search } from "lucide-react";

const BASE_URL = 'https://coffee-website-nhom18-1.onrender.com';

const ProductList = () => {
  // 1. KẾT NỐI GIỎ HÀNG: Lấy hàm addToCart từ Context để dùng cho nút "Thêm vào giỏ"
  const { addToCart } = useCart();

  // 2. KHAI BÁO CÁC STATE QUẢN LÝ BỘ LỌC
  const [selectedCategory, setSelectedCategory] = useState("all"); // Lọc theo danh mục
  const [sortBy, setSortBy] = useState("newest"); // Kiểu sắp xếp
  const [searchQuery, setSearchQuery] = useState(""); // Từ khóa tìm kiếm
  const [currentPage, setCurrentPage] = useState(1); // Đang ở trang số mấy
  const itemsPerPage = 8; // Quy định mỗi trang chỉ hiện 8 món

  // 3. STATE LƯU TRỮ DỮ LIỆU TỪ API
  const [apiCategories, setApiCategories] = useState([]); // Chứa danh mục từ Backend
  const [apiProducts, setApiProducts] = useState([]); // Chứa toàn bộ SP từ Backend

  // 4. GỌI API KHI VỪA MỞ TRANG (Chạy 1 lần duy nhất nhờ mảng rỗng [])
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy danh mục
        const catResponse = await fetch(`${BASE_URL}/categories`);
        if (catResponse.ok) setApiCategories(await catResponse.json());
        
        // Lấy sản phẩm
        const prodResponse = await fetch(`${BASE_URL}/products`);
        if (prodResponse.ok) setApiProducts(await prodResponse.json());
      } catch (error) {
        console.error("Lỗi tải dữ liệu từ Backend:", error);
      }
    };
    fetchData();
  }, []);

  // 5. BỘ NÃO XỬ LÝ LỌC & SẮP XẾP (Dùng useMemo để tối ưu hiệu năng)
  // useMemo giúp React ghi nhớ kết quả tính toán, chỉ tính lại khi 1 trong 4 biến ở mảng cuối thay đổi.
  const filteredProducts = useMemo(() => {
    let filtered = [...apiProducts]; // Tạo bản sao để không làm hỏng dữ liệu gốc

    // Bước A: Lọc theo Danh mục
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => {
        // Phòng hờ API trả về object category hoặc string category
        const catName = p.category?.name || p.category;
        return catName === selectedCategory;
      });
    }

    // Bước B: Lọc theo Thanh tìm kiếm (Tìm trong tên hoặc mô tả)
    if (searchQuery.trim()) {
      filtered = filtered.filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Bước C: Sắp xếp
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price); // Giá tăng dần
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price); // Giá giảm dần
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name, "vi")); // Tên A-Z theo tiếng Việt
        break;
      case "newest":
      default:
        filtered.sort((a, b) => b.id - a.id); // Mới nhất (ID lớn xếp trước)
        break;
    }

    return filtered; // Trả về danh sách đã được xử lý xong
  }, [selectedCategory, sortBy, searchQuery, apiProducts]);

  // 6. THUẬT TOÁN PHÂN TRANG (Pagination)
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage); // Tính tổng số trang (làm tròn lên)
  
  // Dùng hàm .slice() để cắt đúng 8 sản phẩm cho trang hiện tại
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage, // Vị trí bắt đầu
    currentPage * itemsPerPage        // Vị trí kết thúc
  );

  // 7. XỬ LÝ KHI BẤM NÚT THÊM VÀO GIỎ Ở TRANG DANH SÁCH
  const handleAddToCart = (product, e) => {
    e.preventDefault(); 
    e.stopPropagation(); // QUAN TRỌNG: Ngăn không cho click này lan ra ngoài (gây ra việc vô tình chuyển sang trang Chi tiết)
    addToCart(product);
  };

  return (
    <div className="font-sans text-gray-600 bg-white pb-20">
     
      <div className="container-fluid bg-dark p-12 mb-12 flex items-center justify-center relative" style={{ backgroundImage: 'linear-gradient(rgba(43, 40, 37, .7), rgba(43, 40, 37, .7)), url("https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1920")', backgroundSize: "cover" }}>
        <h1 className="display-4 text-uppercase text-white font-heading text-5xl mb-4">Menu & Bảng Giá</h1>
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <ul className="inline-flex justify-center bg-dark uppercase border-inner p-4 mb-5 flex-wrap gap-2 shadow-lg">
            <li>
              <button onClick={() => { setSelectedCategory("all"); setCurrentPage(1); }} className={`px-6 py-2 font-heading uppercase transition text-lg tracking-wider ${ selectedCategory === "all" ? "text-primary" : "text-white hover:text-primary" }`}>
                Tất cả
              </button>
            </li>

            {apiCategories.map((cat) => (
              <li key={cat.id}>
                <button
                //nút tương tác với danh mục, khi click sẽ cập nhật danh mục được chọn và đặt lại trang hiện tại về 1
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setCurrentPage(1);
                  }}
                  // tô màu nút đang được chọn, các nút khác sẽ có hiệu ứng hover
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
          {/*tìm kiếm và sắp xếp*/}
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

        {/* LƯỚI SẢN PHẨM  */}
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

        {/*5. PHÂN TRANG*/}
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
