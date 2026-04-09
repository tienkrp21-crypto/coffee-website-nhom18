import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, MapPin, Phone, Mail, User, X, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const BASE_URL = 'https://coffee-website-nhom18.onrender.com';

const MainLayout = () => {
  const { cartCount } = useCart() || { cartCount: 0 };
  const location = useLocation(); // ĐÃ SỬA: Bỏ đoạn lặp lại gây lỗi build
  const navigate = useNavigate();

  // 1. Quản lý trạng thái Modal
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const token = localStorage.getItem('token');

  // State cho Đăng nhập
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);

  // State cho Đăng ký
  const [fullName, setFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [loadingReg, setLoadingReg] = useState(false);

  const isActive = (path) => location.pathname === path;

  // --- LOGIC ĐĂNG NHẬP ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoadingLogin(true);
    try {
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const result = await response.text();
      if (response.ok) {
        localStorage.setItem('token', result);
        alert('Đăng nhập thành công!');
        setIsLoginOpen(false);
        window.location.reload();
      } else {
        alert(result || 'Sai email hoặc mật khẩu!');
      }
    } catch (error) {
      alert('Lỗi kết nối đến máy chủ!');
    } finally {
      setLoadingLogin(false);
    }
  };

  // --- LOGIC ĐĂNG KÝ ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoadingReg(true);
    try {
      const response = await fetch(`${BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phone: regPhone, email: regEmail, password: regPassword }),
      });
      const result = await response.text();
      if (response.ok) {
        alert('Đăng ký thành công! Bạn có thể đăng nhập ngay.');
        setIsRegisterOpen(false);
        setIsLoginOpen(true);
      } else {
        alert(result || 'Đăng ký không thành công!');
      }
    } catch (error) {
      alert('Lỗi hệ thống khi đăng ký!');
    } finally {
      setLoadingReg(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative font-sans">
      
      {/* 1. TOPBAR */}
      <div className="bg-primary text-dark py-2 px-4 hidden lg:block">
        <div className="container mx-auto flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
          <div className="flex gap-6">
            <span className="flex items-center gap-2"><Mail size={14} /> nhom18@cafematerial.com</span>
            <span className="flex items-center gap-2"><Phone size={14} /> +09 999 999 999</span>
          </div>
          <div>Giờ mở cửa: Thứ 2 - Thứ 7, 8:00 AM - 5:00 PM</div>
        </div>
      </div>

      {/* 2. HEADER */}
      <header className="bg-dark sticky top-0 z-50 shadow-lg border-b-2 border-primary/30 h-24">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link to="/" className="text-3xl font-serif font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <span className="text-primary">Cafe</span>Material
          </Link>

          <nav className="hidden md:flex gap-10 items-center">
            <Link to="/" className={`font-black uppercase text-xs tracking-widest transition ${isActive('/') ? 'text-primary' : 'text-white hover:text-primary'}`}>Trang Chủ</Link>
            <Link to="/products" className={`font-black uppercase text-xs tracking-widest transition ${isActive('/products') || location.pathname.includes('/product/') ? 'text-primary' : 'text-white hover:text-primary'}`}>Menu Sản Phẩm</Link>
            <Link to="/about" className={`font-black uppercase text-xs tracking-widest transition ${isActive('/about') ? 'text-primary' : 'text-white hover:text-primary'}`}>Về Chúng Tôi</Link>
          </nav>

          <div className="flex items-center gap-8">
            <button 
              type="button"
              onClick={() => token ? navigate('/profile') : setIsLoginOpen(true)}
              className={`flex items-center gap-2 font-black uppercase text-xs tracking-widest transition-all duration-300
                ${isActive('/profile') ? 'text-primary' : 'text-white hover:text-primary'}`}
            >
              <User size={20} />
              <span className="hidden sm:inline">{token ? "Cá nhân" : "Tài khoản"}</span>
            </button>
            
            <Link to="/cart" className="relative text-white hover:text-primary transition flex items-center gap-2 font-black uppercase text-xs tracking-widest">
              <ShoppingCart size={20} />
              <span className="hidden sm:inline">Giỏ hàng</span>
              {cartCount > 0 && (
                <span className="absolute -top-3 -left-3 bg-primary text-dark text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-dark">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* 3. MODAL ĐĂNG NHẬP */}
      <AnimatePresence>
        {isLoginOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsLoginOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md"></motion.div>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white w-full max-w-md relative shadow-2xl p-12 overflow-hidden">
              <button onClick={() => setIsLoginOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-primary transition-all"><X size={24} /></button>
              <div className="text-center mb-10">
                <h2 className="font-serif text-4xl text-dark mb-2 uppercase italic">Đăng Nhập</h2>
                <div className="w-16 h-0.5 bg-primary mx-auto"></div>
              </div>
              <form onSubmit={handleLogin} className="space-y-6">
                <input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Email của bạn" className="w-full px-5 py-4 border border-gray-100 focus:border-primary outline-none transition bg-gray-50 font-serif" />
                <input type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Mật khẩu" className="w-full px-5 py-4 border border-gray-100 focus:border-primary outline-none transition bg-gray-50" />
                <button type="submit" disabled={loadingLogin} className="w-full bg-dark text-white py-5 font-black uppercase text-xs tracking-[0.3em] hover:bg-primary transition-all flex items-center justify-center gap-3 shadow-lg">
                  {loadingLogin ? <Loader2 className="animate-spin" /> : "Vào cửa hàng"}
                </button>
              </form>
              <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                <p className="text-gray-400 text-xs font-medium">Bạn là người mới? 
                  <button onClick={() => { setIsLoginOpen(false); setIsRegisterOpen(true); }} className="text-primary font-black uppercase tracking-widest hover:underline ml-2">Tạo tài khoản</button>
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. MODAL ĐĂNG KÝ */}
      <AnimatePresence>
        {isRegisterOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsRegisterOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md"></motion.div>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white w-full max-w-md relative shadow-2xl p-10 overflow-hidden">
              <button onClick={() => setIsRegisterOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-primary"><X size={24} /></button>
              <div className="text-center mb-8">
                <h2 className="font-serif text-3xl text-dark mb-1 uppercase tracking-tight">Tạo Tài Khoản</h2>
                <p className="text-gray-400 text-xs italic">Tham gia cùng CafeMaterial ngay hôm nay</p>
                <div className="w-12 h-1 bg-primary mx-auto mt-4"></div>
              </div>
              <form onSubmit={handleRegister} className="space-y-4">
                <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Họ và tên *" className="w-full px-4 py-3 border border-gray-100 focus:border-primary outline-none bg-gray-50 font-serif text-sm" />
                <input type="text" required value={regPhone} onChange={(e) => setRegPhone(e.target.value)} placeholder="Số điện thoại *" className="w-full px-4 py-3 border border-gray-100 focus:border-primary outline-none bg-gray-50 text-sm" />
                <input type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="Email *" className="w-full px-4 py-3 border border-gray-100 focus:border-primary outline-none bg-gray-50 text-sm" />
                <input type="password" required value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="Mật khẩu *" className="w-full px-4 py-3 border border-gray-100 focus:border-primary outline-none bg-gray-50 text-sm" />
                <button type="submit" disabled={loadingReg} className="w-full bg-primary text-white py-4 font-black uppercase text-xs tracking-[0.2em] hover:bg-dark transition-all mt-4 flex items-center justify-center">
                  {loadingReg ? <Loader2 className="animate-spin" /> : "Đăng ký ngay"}
                </button>
              </form>
              <div className="mt-6 text-center border-t pt-4">
                <p className="text-gray-400 text-xs font-medium">Đã có tài khoản? 
                  <button onClick={() => { setIsRegisterOpen(false); setIsLoginOpen(true); }} className="text-primary font-bold hover:underline ml-2">Đăng nhập</button>
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="flex-grow bg-white"><Outlet /></main>

      <footer className="bg-dark text-secondary pt-20 pb-10 border-t-4 border-primary mt-auto" style={{ backgroundImage: 'linear-gradient(rgba(43, 40, 37, .97), rgba(43, 40, 37, .97)), url("https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1920")', backgroundSize: 'cover' }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <h4 className="text-primary font-serif text-2xl uppercase mb-8 border-b border-gray-800 pb-4">Liên Hệ</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="flex items-start gap-3"><MapPin size={18} className="text-primary shrink-0 mt-1" /> 123 Đường Cà Phê, Quận 1, TP. HCM</li>
                <li className="flex items-center gap-3"><Phone size={18} className="text-primary shrink-0" /> +012 345 6789</li>
                <li className="flex items-center gap-3"><Mail size={18} className="text-primary shrink-0" /> info@cafematerial.com</li>
              </ul>
            </div>
            <div>
              <h4 className="text-primary font-serif text-2xl uppercase mb-8 border-b border-gray-800 pb-4">Liên Kết</h4>
              <ul className="space-y-3">
                <li><Link to="/" className="text-gray-400 hover:text-primary transition flex items-center gap-2">▸ Trang chủ</Link></li>
                <li><Link to="/products" className="text-gray-400 hover:text-primary transition flex items-center gap-2">▸ Menu sản phẩm</Link></li>
                <li><Link to="/cart" className="text-gray-400 hover:text-primary transition flex items-center gap-2">▸ Giỏ hàng</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-primary font-serif text-2xl uppercase mb-8 border-b border-gray-800 pb-4">Giờ Mở Cửa</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex justify-between border-b border-gray-800 pb-2"><span>Thứ 2 - Thứ 6:</span> <span>8:00 - 17:00</span></li>
                <li className="flex justify-between border-b border-gray-800 pb-2"><span>Thứ 7:</span> <span>8:00 - 12:00</span></li>
                <li className="flex justify-between pb-2"><span>Chủ Nhật:</span> <span className="text-primary font-bold">Nghỉ</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-primary font-serif text-2xl uppercase mb-8 border-b border-gray-800 pb-4">Bản Tin</h4>
              <p className="text-gray-400 mb-6 text-sm">Đăng ký email để nhận ưu đãi mới nhất.</p>
              <div className="flex border-2 border-primary/30">
                <input type="text" placeholder="Email của bạn" className="w-full px-4 py-2 bg-white text-dark focus:outline-none" />
                <button className="bg-primary px-4 py-2 text-dark font-black text-xs hover:bg-white transition">GỬI</button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-[10px] font-black uppercase tracking-widest">
            <p>&copy; 2026 <span className="text-primary">CafeMaterial</span>. Crafted with Coffee.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;