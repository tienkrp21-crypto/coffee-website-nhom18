import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, MapPin, Phone, Mail, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

const MainLayout = () => {
  const { cartCount } = useCart() || { cartCount: 0 };
  const location = useLocation();

  // Hàm kiểm tra link đang active để đổi màu
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* ============================================
          1. TOPBAR (Thanh thông tin nhỏ ở trên cùng)
      ============================================ */}
      <div className="bg-primary text-dark py-2 px-4 hidden lg:block">
        <div className="container mx-auto flex justify-between items-center text-sm font-heading uppercase tracking-wider">
          <div className="flex gap-6">
            <span className="flex items-center gap-2"><Mail size={16} /> info@cafematerial.com</span>
            <span className="flex items-center gap-2"><Phone size={16} /> +012 345 6789</span>
          </div>
          <div>Giờ mở cửa: Thứ 2 - Thứ 7, 8:00 AM - 5:00 PM</div>
        </div>
      </div>

      {/* ============================================
          2. HEADER / NAVBAR (Thanh Menu chính)
      ============================================ */}
      <header className="bg-dark sticky top-0 z-50 shadow-lg border-b-2 border-primary/30">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="text-3xl font-heading font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <span className="text-primary">Cafe</span>Material
          </Link>

          {/* Menu Links */}
          <nav className="hidden md:flex gap-8 items-center">
            <Link to="/" className={`font-heading uppercase text-lg transition ${isActive('/') ? 'text-primary' : 'text-white hover:text-primary'}`}>Trang Chủ</Link>
            <Link to="/products" className={`font-heading uppercase text-lg transition ${isActive('/products') || location.pathname.includes('/product/') ? 'text-primary' : 'text-white hover:text-primary'}`}>Menu Sản Phẩm</Link>
          </nav>

          {/* Icons (Giỏ hàng & User) */}
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-white hover:text-primary transition flex items-center gap-2 font-heading uppercase">
              <User size={24} />
              <span className="hidden sm:inline">Tài khoản</span>
            </Link>
            
            <Link to="/cart" className="relative text-white hover:text-primary transition flex items-center gap-2 font-heading uppercase">
              <ShoppingCart size={24} />
              <span className="hidden sm:inline">Giỏ hàng</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -left-2 bg-primary text-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
          
        </div>
      </header>

      {/* ============================================
          3. MAIN CONTENT (Nội dung các trang con)
      ============================================ */}
      <main className="flex-grow bg-white">
        <Outlet />
      </main>

      {/* ============================================
          4. FOOTER (Chân trang)
      ============================================ */}
      <footer 
        className="bg-dark text-secondary pt-16 pb-8 border-t-4 border-primary mt-auto"
        style={{
          backgroundImage: 'linear-gradient(rgba(43, 40, 37, .95), rgba(43, 40, 37, .95)), url("https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1920")',
          backgroundSize: 'cover'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            
            {/* Cột 1: Thông tin liên hệ */}
            <div>
              <h4 className="text-primary font-heading text-xl uppercase mb-6 border-b border-gray-700 pb-2">Liên Hệ</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start gap-3"><MapPin size={20} className="text-primary shrink-0 mt-1" /> 123 Đường Cà Phê, Quận 1, TP. HCM</li>
                <li className="flex items-center gap-3"><Phone size={20} className="text-primary shrink-0" /> +012 345 6789</li>
                <li className="flex items-center gap-3"><Mail size={20} className="text-primary shrink-0" /> info@cafematerial.com</li>
              </ul>
            </div>

            {/* Cột 2: Đường dẫn nhanh */}
            <div>
              <h4 className="text-primary font-heading text-xl uppercase mb-6 border-b border-gray-700 pb-2">Liên Kết</h4>
              <ul className="space-y-3">
                <li><Link to="/" className="text-gray-400 hover:text-primary transition flex items-center gap-2">▸ Trang chủ</Link></li>
                <li><Link to="/products" className="text-gray-400 hover:text-primary transition flex items-center gap-2">▸ Menu sản phẩm</Link></li>
                <li><Link to="/cart" className="text-gray-400 hover:text-primary transition flex items-center gap-2">▸ Giỏ hàng</Link></li>
              </ul>
            </div>

            {/* Cột 3: Thời gian mở cửa */}
            <div>
              <h4 className="text-primary font-heading text-xl uppercase mb-6 border-b border-gray-700 pb-2">Giờ Hoạt Động</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex justify-between border-b border-gray-700 pb-2"><span>Thứ 2 - Thứ 6:</span> <span>8.00 AM - 5.00 PM</span></li>
                <li className="flex justify-between border-b border-gray-700 pb-2"><span>Thứ 7:</span> <span>8.00 AM - 12.00 PM</span></li>
                <li className="flex justify-between pb-2"><span>Chủ Nhật:</span> <span className="text-primary">Nghỉ</span></li>
              </ul>
            </div>

            {/* Cột 4: Đăng ký nhận tin */}
            <div>
              <h4 className="text-primary font-heading text-xl uppercase mb-6 border-b border-gray-700 pb-2">Bản Tin</h4>
              <p className="text-gray-400 mb-4">Đăng ký để nhận thông tin ưu đãi mới nhất về các dòng hạt cà phê.</p>
              <div className="flex">
                <input type="text" placeholder="Email của bạn" className="w-full px-4 py-2 bg-white text-dark focus:outline-none" />
                <button className="bg-primary px-4 py-2 text-dark font-bold hover:bg-white transition">GỬI</button>
              </div>
            </div>

          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2026 <span className="text-primary font-heading">CafeMaterial</span>. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default MainLayout;