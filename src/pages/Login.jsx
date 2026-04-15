import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Edit2, Save, LogOut, Clock } from 'lucide-react';
import LoadingPage from '../components/LoadingPage'; 

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy thông tin user từ Local Storage
    const savedUser = localStorage.getItem('user');
    
    if (!savedUser) {
      navigate('/login'); 
      return;
    }

    try {
      setUserData(JSON.parse(savedUser));
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      localStorage.removeItem('user');
      navigate('/login');
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    alert('Hẹn gặp lại bạn tại CafeMaterial!');
    window.location.href = '/'; 
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="py-20 bg-[#FAF3EB] min-h-screen font-sans text-gray-700">
      <div className="container mx-auto px-4 max-w-5xl">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-4">
          <h1 className="font-serif text-5xl text-dark tracking-tight italic">Hồ Sơ Của Tôi</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-widest hover:opacity-70 transition">
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* CỘT AVATAR */}
          <div className="lg:col-span-4">
            <div className="bg-white p-10 text-center shadow-xl border-t-4 border-primary">
              <div className="w-40 h-40 bg-secondary rounded-full mx-auto mb-8 flex items-center justify-center border-2 border-primary/20 p-2">
                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                  <User size={64} className="text-gray-300" />
                </div>
              </div>
              
              <h2 className="font-serif text-2xl uppercase tracking-wider mb-2">{userData?.fullName || 'Khách hàng'}</h2>
              <p className="text-[#E88F2A] text-[10px] font-black uppercase tracking-[0.2em] mb-8">Thành viên CoffeeMaterial</p>

              <div className="flex flex-col gap-4">
                <button className="text-xs font-bold border-b-2 border-dark pb-1 hover:text-[#E88F2A] transition uppercase">
                  CẬP NHẬT ẢNH
                </button>
                <button 
                  onClick={() => navigate('/order-history')}
                  className="mt-4 bg-[#2B2825] text-white py-3 px-6 text-[10px] font-black uppercase tracking-widest hover:bg-[#E88F2A] transition-all flex items-center justify-center gap-2"
                >
                  <Clock size={14} /> Xem lịch sử đơn hàng
                </button>
              </div>
            </div>
          </div>

          {/* CỘT THÔNG TIN */}
          <div className="lg:col-span-8">
            <div className="bg-white p-12 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-12">
                <h3 className="font-serif text-2xl italic text-dark">Chi tiết tài khoản</h3>
                
                {/* Nút Chỉnh sửa */}
                <button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2 bg-[#2B2825] text-white px-6 py-2 hover:bg-[#E88F2A] transition text-xs font-bold uppercase tracking-widest">
                  {isEditing ? <><Save size={16} /> Lưu</> : <><Edit2 size={16} /> Chỉnh sửa</>}
                </button>
              </div>

              <div className="space-y-10">
                <ProfileItem icon={<User size={18}/>} label="Họ và tên" value={userData?.fullName} isEditing={isEditing} />
                <ProfileItem icon={<Mail size={18}/>} label="Địa chỉ Email" value={userData?.email} isEditing={false} />
                <ProfileItem icon={<Phone size={18}/>} label="Số điện thoại" value={userData?.phone || "Chưa cập nhật"} isEditing={isEditing} />
                
                {/* Ngày tham gia */}
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

// Component hiển thị thông tin kèm chức năng Edit
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