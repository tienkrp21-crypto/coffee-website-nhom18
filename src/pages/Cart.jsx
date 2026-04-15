import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, ChevronLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  // Lấy dữ liệu và hàm xử lý từ CartContext 
  const { cartItems, addToCart, removeFromCart } = useCart();
  // Thuật toán tính tổng tiền bằng hàm .reduce() của ES6.
  // Lặp qua từng 'item' trong giỏ, lấy giá (price) * số lượng (quantity) cộng dồn vào biến 'sum'
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="font-sans text-gray-600 bg-white pb-20 min-h-screen">
      
      {/* 1. PAGE HEADER*/}
      <div 
        className="container-fluid bg-dark p-12 mb-12 flex items-center justify-center relative"
        style={{
          backgroundImage: 'linear-gradient(rgba(43, 40, 37, .7), rgba(43, 40, 37, .7)), url("https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1920")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="text-center z-10 py-10">
          <h1 className="display-4 text-uppercase text-white font-heading text-5xl mb-4">Giỏ hàng của bạn</h1>
          <div className="flex items-center justify-center gap-3 text-white font-heading text-lg">
            <Link to="/" className="hover:text-primary transition">Trang chủ</Link>
            <span className="text-primary text-xs">■</span>
            <span className="text-gray-400">Giỏ hàng</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl">
        {cartItems.length === 0 ? (
          // HIỂN THỊ KHI GIỎ HÀNG TRỐNG
          <div className="bg-secondary border-inner p-12 text-center">
            <ShoppingBag size={64} className="mx-auto text-gray-400 mb-6" />
            <h2 className="text-3xl font-heading text-dark uppercase mb-4">Giỏ hàng đang trống</h2>
            <p className="text-gray-500 mb-8">Có vẻ như bạn chưa chọn nguyên liệu nào. Hãy quay lại menu để khám phá nhé!</p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-primary text-white font-heading px-8 py-3 uppercase hover:bg-opacity-90 transition border-inner">
              <ChevronLeft size={20}/> Quay lại Menu
            </Link>
          </div>
        ) : (
          // HIỂN THỊ KHI CÓ SẢN PHẨM
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              <div className="bg-secondary border-inner p-6">
                <h3 className="font-heading text-2xl text-dark uppercase mb-6 border-b border-gray-300 pb-4">Chi tiết đơn hàng</h3>
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 border border-gray-100 shadow-sm relative group">
                      <img src={item.image} alt={item.name} className="w-24 h-24 object-cover border-inner border-inner-dark" />
                      <div className="flex-1 text-center sm:text-left">
                        <Link to={`/product/${item.id}`}>
                          <h4 className="font-heading text-lg text-dark uppercase hover:text-primary transition">{item.name}</h4>
                        </Link>
  
                        <p className="text-primary font-bold">{item.price.toLocaleString('vi-VN')}đ</p>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="flex items-center border border-gray-300 bg-secondary">
                          <span className="px-4 py-2 font-heading text-dark">SL: {item.quantity}</span>
                          <button 
                            onClick={() => addToCart(item)} 
                            className="px-3 py-2 bg-dark text-primary hover:bg-primary hover:text-white transition font-bold"
                          >+</button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)} 
                          className="text-red-500 hover:text-red-700 p-2 transition"
                        >
                          <Trash2 size={24} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cột Tổng tiền & Thanh toán */}
            <div className="w-full lg:w-1/3">
              <div className="bg-dark text-white border-inner p-8 sticky top-24">
                <h3 className="font-heading text-2xl text-primary uppercase mb-6 border-b border-gray-600 pb-4">Tóm tắt</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tạm tính:</span>
                    <span className="font-heading">{totalPrice.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Phí giao hàng:</span>
                    <span className="font-heading">Chưa tính</span>
                  </div>
                </div>
                <div className="border-t border-gray-600 pt-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-heading uppercase text-primary">Tổng cộng:</span>
                    <span className="text-3xl font-heading text-primary">{totalPrice.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
                <Link to="/checkout" className="block w-full text-center bg-primary text-dark font-heading text-lg uppercase py-4 hover:bg-white transition border-inner border-inner-dark">
                  Tiến hành thanh toán
                </Link>
                <Link to="/products" className="block w-full text-center text-gray-400 mt-4 hover:text-primary transition text-sm">
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;