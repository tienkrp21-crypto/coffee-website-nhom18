import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const LoadingPage = () => {
  return (
    <div className="fixed inset-0 z-[200] bg-[#FAF3EB] flex flex-col items-center justify-center">
      {/* Hiệu ứng logo bay nhẹ */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="text-5xl font-serif text-dark mb-8"
      >
        <span className="text-primary">Cafe</span>Material
      </motion.div>
      
      {/* Thanh loading chạy */}
      <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-primary"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <p className="mt-4 text-xs uppercase tracking-[0.3em] text-gray-400 font-bold">Đang pha chế...</p>
    </div>
  );
};

export default LoadingPage;