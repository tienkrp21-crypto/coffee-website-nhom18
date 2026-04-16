import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

export default function AdminIndex() {
  const { isLoggedIn, checkAuth } = useAdmin();

  useEffect(() => {
    checkAuth();
  }, []);

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Navigate to="/admin/dashboard" replace />;
}
