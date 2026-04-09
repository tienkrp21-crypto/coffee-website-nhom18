import React from "react";
import { useAdmin } from "../context/AdminContext";

export default function TopBar() {
  const { adminUser } = useAdmin();

  return (
    <div className="bg-white shadow-md px-8 py-4 flex items-center justify-between">
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gray-800">Quản trị viên</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">
            {adminUser?.name}
          </p>
          <p className="text-xs text-gray-600">{adminUser?.email}</p>
        </div>
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          {adminUser?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
}
