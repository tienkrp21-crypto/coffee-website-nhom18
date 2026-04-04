import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCart, ChevronLeft, Check } from "lucide-react";

//const BASE_URL = 'http://localhost:8080';
const BASE_URL = "https://coffee-website-nhom18.onrender.com";

const ProductDetail = () => {
  const { id } = useParams(); // Lấy ID từ thanh địa chỉ (URL)
  const { addToCart } = useCart();

  // State lưu dữ liệu sản phẩm từ API
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // GỌI API LẤY CHI TIẾT 1 SẢN PHẨM
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${BASE_URL}/products/${id}`); // Gọi API theo ID
        if (!response.ok) throw new Error("Không tìm thấy sản phẩm");

        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Lỗi:", error);
        setProduct(null);
      } finally {
        setLoading(false); // Tắt trạng thái đang tải
      }
    };

    fetchProduct();
  }, [id]);

  // Hiển thị lúc đang chờ data từ Backend
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <h2 className="font-heading text-3xl text-primary animate-pulse uppercase">
          Đang tải thông tin...
        </h2>
      </div>
    );
  }

  // Nếu API trả về rỗng (ID sai)
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-secondary">
        <h1 className="font-heading text-4xl text-dark mb-4">
          Sản phẩm không tồn tại!
        </h1>
        <Link
          to="/products"
          className="text-primary hover:underline font-heading text-lg"
        >
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

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
            Chi tiết sản phẩm
          </h1>
          <div className="flex items-center justify-center gap-3 text-white font-heading text-lg">
            <Link to="/" className="hover:text-primary transition">
              Trang chủ
            </Link>
            <span className="text-primary text-xs">■</span>
            <Link to="/products" className="hover:text-primary transition">
              Menu
            </Link>
            <span className="text-primary text-xs">■</span>
            <span className="text-gray-400">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-dark hover:text-primary transition font-heading uppercase text-sm tracking-wider"
          >
            <ChevronLeft size={16} /> Quay lại danh sách
          </Link>
        </div>

        <div className="bg-secondary border-inner p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            {/* ============================================
                2. ẢNH SẢN PHẨM
            ============================================ */}
            <div className="w-full md:w-1/2">
              <div className="relative border-inner border-inner-dark bg-white p-2">
                <img
                  src={
                    product.image?.startsWith("http")
                      ? product.image
                      : `${BASE_URL}/${product.image?.replace(/^\//, "")}`
                  }
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  alt={product.name}
                  // Thêm cái này để nếu ảnh vẫn lỗi thì hiện ảnh mặc định cho đẹp
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=400";
                  }}
                />
              </div>
            </div>

            {/* ============================================
                3. THÔNG TIN & MUA HÀNG
            ============================================ */}
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <div className="mb-2">
                <span className="bg-dark text-primary font-heading px-3 py-1 uppercase text-xs tracking-widest inline-block mb-3">
                  {/* Lấy tên danh mục (xử lý trường hợp Backend trả về dạng Object) */}
                  {product.category?.name ||
                    product.category ||
                    "Chưa phân loại"}
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-heading text-dark uppercase mb-4 leading-tight">
                {product.name}
              </h1>

              <p className="text-4xl font-heading text-primary mb-6">
                {product.price.toLocaleString("vi-VN")}đ
              </p>

              <p className="text-gray-500 leading-relaxed mb-8">
                {product.description ||
                  "Sản phẩm chất lượng cao, được tuyển chọn kỹ lưỡng từ các vùng nguyên liệu hàng đầu, đảm bảo hương vị thơm ngon đặc trưng dành riêng cho các quán cà phê chuyên nghiệp."}
              </p>

              <ul className="space-y-3 mb-10">
                <li className="flex items-center gap-3 text-sm">
                  <div className="bg-primary text-white rounded-full p-1">
                    <Check size={14} />
                  </div>
                  <span className="text-dark font-medium">
                    Cam kết nguyên chất 100%
                  </span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <div className="bg-primary text-white rounded-full p-1">
                    <Check size={14} />
                  </div>
                  <span className="text-dark font-medium">
                    Nguồn gốc xuất xứ rõ ràng
                  </span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <div className="bg-primary text-white rounded-full p-1">
                    <Check size={14} />
                  </div>
                  <span className="text-dark font-medium">
                    Hỗ trợ đổi trả nếu lỗi từ nhà sản xuất
                  </span>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => addToCart(product)}
                  className="flex-1 flex items-center justify-center gap-3 bg-primary text-white py-4 px-8 font-heading text-lg uppercase border-inner hover:bg-opacity-90 transition shadow-lg active:scale-95"
                >
                  <ShoppingCart size={24} /> Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
