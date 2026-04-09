import React, { createContext, useState, useContext } from "react";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  const login = (username, password) => {
    // Simple authentication - in production, this should call a backend API
    if (username === "admin" && password === "admin123") {
      const admin = {
        id: 1,
        username: username,
        email: "admin@coffee.com",
        name: "Administrator",
      };
      setAdminUser(admin);
      setIsLoggedIn(true);
      localStorage.setItem("adminToken", "token_" + Date.now());
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setAdminUser(null);
    localStorage.removeItem("adminToken");
  };

  const checkAuth = () => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsLoggedIn(true);
      setAdminUser({
        id: 1,
        username: "admin",
        email: "admin@coffee.com",
        name: "Administrator",
      });
    }
  };

  return (
    <AdminContext.Provider
      value={{ isLoggedIn, adminUser, login, logout, checkAuth }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
};
