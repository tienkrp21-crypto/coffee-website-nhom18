import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Edit2, Save, LogOut, ArrowLeft, Package } from 'lucide-react'; // Thêm Package icon
import LoadingPage from '../components/LoadingPage'; 
import { useCart } from '../context/CartContext';

const BASE_URL = 'https://coffee-website-nhom18-1.onrender.com';

const Profile = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    
    if (!savedUser) {
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(savedUser);
      setUserData(user);
    } catch (error) {
      console.error("Lỗi đọc dữ liệu user:", error);
      navigate('/login');
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    clearCart(); // <- DÒNG MỚI THÊM: Xóa sạch giỏ hàng trên giao diện!
    alert('Đăng xuất thành công! Hẹn gặp lại bạn tại CafeMaterial.');
    navigate('/');
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="font-sans text-gray-600 bg-[#FAF3EB] min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Nút quay lại trang chủ */}
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#2B2825] font-bold uppercase text-[10px] tracking-widest mb-8 hover:text-[#E88F2A] transition">
          <ArrowLeft size={16} /> Quay về trang chủ
        </button>

        <div className="bg-white border-2 border-[#2B2825]/10 shadow-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            
            {/* Cột bên trái: Avatar & Điều hướng */}
            <div className="md:w-1/3 bg-[#2B2825] p-12 text-center text-white flex flex-col justify-between">
              <div>
                <div className="w-32 h-32 bg-[#E88F2A] rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-white/20">
                  <User size={64} className="text-white" />
                </div>
                <h2 className="font-serif text-2xl uppercase tracking-wider mb-2">{userData?.fullName || 'Khách hàng'}</h2>
                <p className="text-[#E88F2A] text-[10px] font-black uppercase tracking-[0.2em] mb-8">Thành viên CoffeeMaterial</p>
                
                {/* NÚT XEM LỊCH SỬ ĐƠN HÀNG - MỚI THÊM */}
                <button 
                  onClick={() => navigate('/order-history')}
                  className="w-full mb-4 flex items-center justify-center gap-2 bg-[#E88F2A] text-white py-3 px-6 hover:bg-white hover:text-[#E88F2A] transition-all text-[10px] font-bold uppercase tracking-widest border border-[#E88F2A]"
                >
                  <Package size={16} /> Lịch sử đơn hàng
                </button>
              </div>

              <button 
                onClick={handleLogout}
                className="mt-12 flex items-center justify-center gap-2 border border-white/20 py-3 px-6 hover:bg-red-600 hover:border-red-600 transition-all text-[10px] font-bold uppercase tracking-widest"
              >
                <LogOut size={16} /> Đăng xuất
              </button>
            </div>

            {/* Cột bên phải: Thông tin chi tiết */}
            <div className="md:w-2/3 p-12">
              <div className="flex justify-between items-center mb-12">
                <h3 className="font-serif text-3xl text-[#2B2825] uppercase">Hồ sơ cá nhân</h3>
                <button 
                  onClick={() => setIsEditing(!isEditing)} 
                  className="flex items-center gap-2 bg-[#2B2825] text-white px-6 py-2 hover:bg-[#E88F2A] transition text-[10px] font-bold uppercase tracking-widest"
                >
                  {isEditing ? <><Save size={16} /> Lưu thay đổi</> : <><Edit2 size={16} /> Chỉnh sửa</>}
                </button>
              </div>

              <div className="space-y-8">
                <ProfileItem icon={<User size={18}/>} label="Họ và tên" value={userData?.fullName} isEditing={isEditing} />
                <ProfileItem icon={<Mail size={18}/>} label="Địa chỉ Email" value={userData?.email} isEditing={false} />
                <ProfileItem icon={<Phone size={18}/>} label="Số điện thoại" value={userData?.phone || "Chưa cập nhật"} isEditing={isEditing} />
                
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                    Ngày tham gia: {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('vi-VN') : 'Mới đây'}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileItem = ({ icon, label, value, isEditing }) => (
  <div className="border-b border-gray-100 pb-4">
    <label className="flex items-center gap-2 text-[10px] font-black text-[#E88F2A] mb-2 uppercase tracking-widest">
      {icon} {label}
    </label>
    {isEditing ? (
      <input 
        defaultValue={value} 
        className="w-full bg-[#FAF3EB] border-none px-4 py-2 text-lg text-[#2B2825] focus:ring-1 focus:ring-[#E88F2A] outline-none"
      />
    ) : (
      <p className="text-xl text-[#2B2825] font-medium px-1">
        {value || <span className="text-gray-300 italic">Chưa cập nhật</span>}
      </p>
    )}
  </div>
);

export default Profile;