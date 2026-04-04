import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Save } from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <h1 className="font-serif text-4xl text-dark mb-12">
          Trang cá nhân
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 p-8 text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <User size={48} className="text-gray-400" />
              </div>
              <h2 className="font-serif text-2xl text-dark mb-2">
                Trương Hùng Dũng
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                Thành viên từ 2026
              </p>
              <button className="text-dark text-sm hover:text-dark/70 transition">
                Đổi ảnh đại diện
              </button>
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-serif text-2xl text-dark">
                  Thông tin cá nhân
                </h3>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 text-dark hover:text-dark/70 transition"
                >
                  {isEditing ? (
                    <>
                      <Save size={18} />
                      <span className="text-sm font-medium">Lưu</span>
                    </>
                  ) : (
                    <>
                      <Edit2 size={18} />
                      <span className="text-sm font-medium">Chỉnh sửa</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User size={16} />
                    Họ và tên
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue="Trương Hùng Dũng"
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark"
                    />
                  ) : (
                    <p className="text-dark">Trương Hùng Dũng</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Mail size={16} />
                    Địa chỉ Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      defaultValue="dung@example.com"
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark"
                    />
                  ) : (
                    <p className="text-dark">dung@example.com</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Phone size={16} />
                    Số điện thoại
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      defaultValue="090xxxxxxx"
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark"
                    />
                  ) : (
                    <p className="text-dark">090xxxxxxx</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={16} />
                    Địa chỉ
                  </label>
                  {isEditing ? (
                    <textarea
                      defaultValue="123 Main Street, District 1, Ho Chi Minh City"
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark"
                    ></textarea>
                  ) : (
                    <p className="text-dark">123 Main Street, District 1, Ho Chi Minh City</p>
                  )}
                </div>
              </div>
            </div>

            {/* Change Password Section */}
            <div className="bg-white border border-gray-200 p-8 mt-6">
              <h3 className="font-serif text-2xl text-dark mb-6">
                Đổi mật khẩu
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu hiện tại"
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    placeholder="Xác nhận mật khẩu mới"
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark"
                  />
                </div>

                <button className="bg-dark text-white px-8 py-3 rounded-full font-medium tracking-wide hover:bg-dark/90 transition-all">
                  Cập nhật mật khẩu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
