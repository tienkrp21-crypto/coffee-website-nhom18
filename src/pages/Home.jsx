import React, { useState } from 'react';
import { products } from '../data/products';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Truck, CreditCard, Coffee, Mail, ArrowRight } from 'lucide-react';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const Home = () => {
  const [activeTab, setActiveTab] = useState('coffee');
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const { addToCart } = useCart();

  return (
    <div className="font-sans text-gray-600 bg-white">
      
      {/*  1. HERO SECTION */}
      <motion.div 
        initial="hidden" animate="visible" variants={fadeUpVariants}
        className="relative min-h-[700px] bg-dark flex items-center" 
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1920")', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-dark/70"></div>
        <div className="relative z-10 container mx-auto px-4 text-center lg:text-left pt-32 pb-20">
          <h2 className="font-cursive text-primary text-4xl mb-4">Thơm ngon đậm vị</h2>
          <h1 className="font-heading text-white text-6xl lg:text-8xl uppercase mb-4">CafeMaterial</h1>
          <h3 className="font-heading text-white text-3xl lg:text-4xl uppercase mb-8">Nguồn nguyên liệu tốt nhất</h3>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4">
            <Link to="/products" className="bg-primary text-white font-heading px-10 py-4 text-lg uppercase border-inner hover:bg-opacity-90 transition shadow-lg">
              Mua ngay
            </Link>
            <div onClick={() => setIsVideoOpen(true)} className="flex items-center gap-4 cursor-pointer group">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75"></div>
                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-primary border-b-[10px] border-b-transparent ml-1 relative z-10"></div>
              </div>
              <h5 className="font-heading text-white text-lg m-0 hidden sm:block group-hover:text-primary transition">Xem Video</h5>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. DANH MỤC NỔI BẬT*/}
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerVariants}
        className="container mx-auto px-4 py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-[-100px] relative z-20">
          {[
            { name: 'Hạt Cà Phê Mộc', img: 'https://images.pexels.com/photos/10541145/pexels-photo-10541145.jpeg' },
            { name: 'Syrup & Mứt', img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=600' },
            { name: 'Dụng Cụ Pha Chế', img: 'https://images.pexels.com/photos/9444074/pexels-photo-9444074.jpeg' }
          ].map((cat, idx) => (
            <motion.div key={idx} variants={fadeUpVariants} className="group relative h-64 overflow-hidden border-inner shadow-xl cursor-pointer bg-dark">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-dark/40 group-hover:bg-dark/60 transition duration-300"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h3 className="font-heading text-2xl uppercase mb-2 tracking-wider">{cat.name}</h3>
                <Link to="/products" className="text-primary font-bold uppercase text-sm tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition duration-300 translate-y-4 group-hover:translate-y-0">
                  Khám phá <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 3. ABOUT SECTION */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUpVariants} className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="section-title text-center mx-auto mb-12 pb-6 max-w-2xl">
            <h2 className="font-cursive text-primary text-3xl mb-2">Về Chúng Tôi</h2>
            <h1 className="font-heading text-dark text-4xl md:text-5xl uppercase">Chào mừng đến với CafeMaterial</h1>
          </div>
          <div className="flex flex-col lg:flex-row gap-10 bg-white p-8 border-inner shadow-sm">
            <div className="lg:w-5/12 min-h-[400px] relative overflow-hidden group">
              <img className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110" src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800" alt="About Us" />
            </div>
            <div className="lg:w-7/12 pb-8 flex flex-col justify-center">
              <h4 className="font-heading text-2xl text-dark mb-4 uppercase">Tuyển chọn những hạt cà phê tinh túy nhất từ các nông trại hàng đầu.</h4>
              <p className="mb-8 text-gray-500 leading-relaxed">Chúng tôi tự hào là đơn vị cung cấp nguyên vật liệu pha chế, máy móc thiết bị chất lượng cao cho hàng ngàn quán cà phê và Barista chuyên nghiệp trên toàn quốc. Đảm bảo hương vị đồng nhất và tuyệt hảo cho từng ly cà phê.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <div className="bg-primary border-inner w-16 h-16 flex items-center justify-center mb-4 text-white text-3xl hover:bg-dark transition duration-300">♥</div>
                  <h4 className="font-heading text-dark text-xl uppercase mb-2">100% Nguyên chất</h4>
                  <p className="text-sm text-gray-500">Không pha tẩm, giữ trọn hương vị tự nhiên của hạt cà phê mộc.</p>
                </div>
                <div>
                  <div className="bg-primary border-inner w-16 h-16 flex items-center justify-center mb-4 text-white text-3xl hover:bg-dark transition duration-300">★</div>
                  <h4 className="font-heading text-dark text-xl uppercase mb-2">Chất lượng cao</h4>
                  <p className="text-sm text-gray-500">Được chứng nhận an toàn vệ sinh thực phẩm và đạt chuẩn xuất khẩu.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      {/* 4. STATS/FACTS*/}
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeUpVariants}
        className="bg-dark py-20" style={{ backgroundImage: 'linear-gradient(rgba(43, 40, 37, 0.85), rgba(43, 40, 37, 0.85)), url("https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1920")', backgroundAttachment: 'fixed' }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[ { icon: '⭐', label: 'Kinh nghiệm', count: '10+' }, { icon: '👥', label: 'Barista', count: '50+' }, { icon: '✓', label: 'Sản phẩm', count: '150+' }, { icon: '☕', label: 'Khách hàng', count: '5000+' } ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center group">
                <h1 className="text-primary font-heading text-6xl m-0 mb-2 group-hover:scale-110 transition">{stat.count}</h1>
                <h6 className="text-white font-heading uppercase tracking-widest text-sm">{stat.label}</h6>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 5. QUY TRÌNH MUA HÀNG*/}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerVariants} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div variants={fadeUpVariants} className="text-center mb-16">
            <h2 className="font-cursive text-primary text-3xl mb-2">Đơn giản & Nhanh chóng</h2>
            <h1 className="font-heading text-dark text-4xl uppercase">Quy trình mua sắm</h1>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gray-200 z-0"></div>
            {[
              { icon: Coffee, title: '1. Chọn sản phẩm', desc: 'Khám phá menu đa dạng với hàng trăm nguyên liệu cao cấp.' },
              { icon: CreditCard, title: '2. Thanh toán', desc: 'An toàn, tiện lợi với nhiều hình thức (COD, Chuyển khoản).' },
              { icon: Truck, title: '3. Giao hàng', desc: 'Đóng gói cẩn thận, giao hỏa tốc đến tận cửa quán của bạn.' }
            ].map((step, idx) => (
              <motion.div key={idx} variants={fadeUpVariants} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-secondary border-2 border-primary rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white text-primary transition duration-300">
                  <step.icon size={40} />
                </div>
                <h3 className="font-heading text-xl uppercase text-dark mb-3">{step.title}</h3>
                <p className="text-gray-500 px-4">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 6. MENU PRODUCTS */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerVariants} className="bg-secondary py-20">
        <div className="container mx-auto px-4">
          <motion.div variants={fadeUpVariants} className="section-title text-center mx-auto mb-12 pb-6 max-w-2xl">
            <h2 className="font-cursive text-primary text-3xl mb-2">Bảng Giá & Menu</h2>
            <h1 className="font-heading text-dark text-4xl md:text-5xl uppercase">Khám Phá Nguyên Liệu</h1>
          </motion.div>

          <motion.div variants={fadeUpVariants} className="text-center mb-12">
            <div className="inline-flex justify-center bg-dark border-inner p-4 shadow-lg">
              <button onClick={() => setActiveTab('coffee')} className={`px-6 py-2 font-heading uppercase text-lg transition ${activeTab === 'coffee' ? 'text-primary' : 'text-white hover:text-primary'}`}>Hạt Cà Phê</button>
              <button onClick={() => setActiveTab('syrup')} className={`px-6 py-2 font-heading uppercase text-lg transition ${activeTab === 'syrup' ? 'text-primary' : 'text-white hover:text-primary'}`}>Syrup & Bột</button>
              <button onClick={() => setActiveTab('machine')} className={`px-6 py-2 font-heading uppercase text-lg transition ${activeTab === 'machine' ? 'text-primary' : 'text-white hover:text-primary'}`}>Dụng Cụ</button>
            </div>
          </motion.div>

          <motion.div variants={fadeUpVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="flex h-40 bg-white border-inner border-inner-dark group cursor-pointer hover:shadow-xl transition duration-300 hover:-translate-y-1">
                <div className="relative w-40 shrink-0 overflow-hidden z-10">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  <h4 className="absolute bottom-0 left-0 bg-dark text-primary font-heading text-lg px-3 py-2 m-0 w-full text-center bg-opacity-95">{product.price.toLocaleString('vi-VN')}đ</h4>
                </div>
                <div className="flex-1 flex flex-col justify-center text-left px-6 py-2 z-10">
                  <Link to={`/product/${product.id}`}><h5 className="font-heading text-dark text-xl uppercase mb-1 group-hover:text-primary transition line-clamp-1">{product.name}</h5></Link>
                  <p className="text-sm line-clamp-2 mb-3 text-gray-500">{product.description}</p>
                  <button onClick={(e) => { e.preventDefault(); addToCart(product); }} className="text-xs font-heading uppercase text-dark bg-primary/20 inline-block w-fit px-3 py-1 hover:bg-primary hover:text-white transition mt-auto">+ Thêm vào giỏ</button>
                </div>
              </div>
            ))}
          </motion.div>
          
          <div className="text-center mt-12">
            <Link to="/products" className="inline-block bg-primary text-white font-heading px-8 py-3 uppercase hover:bg-dark transition">Xem toàn bộ Menu</Link>
          </div>
        </div>
      </motion.div>

      {/* 7. BANNER ĐĂNG KÝ NHẬN TIN */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeUpVariants} className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <Mail className="mx-auto text-white mb-4" size={48} />
          <h2 className="font-heading text-3xl md:text-4xl uppercase text-dark mb-4">Nhận báo giá & Khuyến mãi</h2>
          <p className="text-dark/80 mb-8 max-w-2xl mx-auto">Đăng ký email để trở thành khách hàng đầu tiên nhận được thông tin về các sản phẩm mới và chương trình giảm giá đặc biệt cho quán của bạn.</p>
          <form className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Nhập email của bạn..." required className="flex-1 px-6 py-4 bg-white border-2 border-transparent focus:border-dark focus:outline-none font-sans" />
            <button type="submit" className="bg-dark text-white font-heading uppercase px-8 py-4 hover:bg-white hover:text-dark transition shadow-lg">Đăng ký ngay</button>
          </form>
        </div>
      </motion.div>

      {/* MODAL VIDEO */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black shadow-2xl border-2 border-primary">
            <button onClick={() => setIsVideoOpen(false)} className="absolute -top-12 right-0 text-white hover:text-primary text-4xl font-bold transition">&times;</button>
            <iframe className="w-full h-full" src="https://www.youtube.com/embed/gUGrMtaxveE?si=wj6V8ktyeipHAn_W" title="YouTube video player" frameBorder="0" allowFullScreen></iframe>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;