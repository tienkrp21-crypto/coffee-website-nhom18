import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Edit2, Save, LogOut } from 'lucide-react';
import LoadingPage from '../components/LoadingPage'; 

const BASE_URL = 'https://coffee-website-nhom18.onrender.com';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setTimeout(() => setLoading(false), 1200);
      }
    };
    fetchProfile();
  }, [navigate]);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('Đăng xuất thành công! Hẹn gặp lại bạn tại CafeMaterial.');
    navigate('/');
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="py-20 bg-[#FAF3EB] min-h-screen font-sans text-gray-700">
      <div className="container mx-auto px-4 max-w-5xl">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-4">
          <h1 className="font-serif text-5xl text-dark tracking-tight">Hồ Sơ Của Tôi</h1>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-widest hover:opacity-70 transition"
          >
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="bg-white p-10 text-center shadow-xl border-t-4 border-primary">
              <div className="w-40 h-40 bg-secondary rounded-full mx-auto mb-8 flex items-center justify-center border-2 border-primary/20 p-2">
                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                  <User size={64} className="text-gray-300" />
                </div>
              </div>
              <h2 className="font-serif text-3xl text-dark mb-2">{userData?.fullName}</h2>
              <p className="text-primary text-[10px] uppercase font-black tracking-[0.2em] mb-8">Khách hàng thân thiết</p>
              <button className="text-xs font-bold border-b-2 border-dark pb-1 hover:text-primary hover:border-primary transition">CẬP NHẬT ẢNH</button>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white p-12 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-12">
                <h3 className="font-serif text-2xl italic text-dark">Chi tiết tài khoản</h3>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 bg-dark text-white px-6 py-2 hover:bg-primary transition text-xs font-bold uppercase tracking-widest"
                >
                  {isEditing ? <><Save size={16} /> Lưu</> : <><Edit2 size={16} /> Chỉnh sửa</>}
                </button>
              </div>

              <div className="space-y-10">
                <ProfileItem icon={<User size={18}/>} label="Họ và tên" value={userData?.fullName} isEditing={isEditing} />
                <ProfileItem icon={<Mail size={18}/>} label="Địa chỉ Email" value={userData?.email} isEditing={false} />
                <ProfileItem icon={<Phone size={18}/>} label="Số điện thoại" value={userData?.phone} isEditing={isEditing} />
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
    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">
      {icon} {label}
    </label>
    {isEditing ? (
      <input defaultValue={value} className="w-full px-4 py-2 text-xl font-serif text-dark border-none outline-none focus:ring-0 bg-gray-50 shadow-inner" />
    ) : (
      <p className="text-2xl font-serif text-dark">{value || "Chưa cập nhật"}</p>
    )}
  </div>
);

export default Profile;