import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Users, GraduationCap, Code, Coffee, Globe, Link as LinkIcon } from 'lucide-react';

const About = () => {
  const teamMembers = [
    { id: 1, name: "Trương Hùng Dũng", mssv: "DH52200541", role: "Frontend 1 (người dùng)" },
    { id: 3, name: "Võ Minh Thông", mssv: "DH52201517", role: "Frontend 2 (admin)" },
    { id: 2, name: "Lê Nguyễn Khánh Duy", mssv: "DH52200560", role: "Backend 1" },
    { id: 4, name: "Trần Tiến", mssv: "DH52201561", role: "Backend 2" },
    { id: 5, name: "Trần Chánh Biện", mssv: "DH52200384", role: "Backend 3" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="bg-[#FAF3EB] min-h-screen py-20 font-sans text-gray-700">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Phần đầu trang */}
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="font-cursive text-primary text-3xl mb-2"
          >
            Đội ngũ thực hiện
          </motion.h2>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="font-serif text-5xl md:text-6xl text-dark uppercase tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Về Chúng Tôi
          </motion.h1>
          <div className="w-24 h-1 bg-primary mx-auto mt-6"></div>
        </div>

        {/* Danh sách thành viên */}
        <motion.div 
          variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          {teamMembers.map((member) => (
            <motion.div 
              key={member.id} variants={itemVariants}
              className="bg-white p-8 shadow-xl border-t-4 border-primary group hover:-translate-y-2 transition-all duration-500"
            >
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-500">
                <Users className="text-primary group-hover:text-white" size={32} />
              </div>
              <h3 className="font-serif text-2xl text-dark mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{member.name}</h3>
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-4">
                <GraduationCap size={14} /> {member.mssv}
              </div>
              <p className="text-gray-500 text-sm mb-6 pb-6 border-b border-gray-100 italic">{member.role}</p>
              <div className="flex gap-4 text-gray-300">
                <Globe size={18} className="hover:text-dark cursor-pointer transition" />
                <Code size={18} className="hover:text-dark cursor-pointer transition" />
                <LinkIcon size={18} className="hover:text-dark cursor-pointer transition" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer của trang About */}
        <div className="bg-dark p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
          <h4 className="font-serif text-2xl text-white mb-4 italic" style={{ fontFamily: "'Playfair Display', serif" }}>
            Lập trình ứng dụng Web
          </h4>
          <p className="text-gray-400 uppercase tracking-[0.3em] text-[10px] font-black">
            Nhóm 18 - CafeMaterial Project
          </p>
        </div>

      </div>
    </div>
  );
};

export default About;