/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  LayoutDashboard, 
  FolderTree, 
  Coffee, 
  Package, 
  ClipboardList, 
  ShoppingCart, 
  Users, 
  Settings,
  Search,
  Bell,
  ChevronRight,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Plus,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard },
  { id: 'categories', label: 'Quản lý Danh mục', icon: FolderTree },
  { id: 'products', label: 'Quản lý Sản phẩm', icon: Coffee },
  { id: 'inventory', label: 'Quản lý Tồn kho', icon: Package },
  { id: 'history', label: 'Lịch sử Nhập kho', icon: ClipboardList },
  { id: 'orders', label: 'Quản lý Đơn hàng', icon: ShoppingCart },
  { id: 'users', label: 'Quản lý Người dùng', icon: Users },
  { id: 'settings', label: 'Cấu hình hệ thống', icon: Settings },
];

const STATS = [
  { label: 'Tổng doanh thu', value: '128.450.000đ', trend: '+12.5%', isUp: true },
  { label: 'Đơn hàng mới', value: '42', trend: '+8.2%', isUp: true },
  { label: 'Sản phẩm sắp hết', value: '12', trend: '-2.4%', isUp: false },
  { label: 'Khách hàng mới', value: '156', trend: '+15.3%', isUp: true },
];

const RECENT_ORDERS = [
  { id: 'ORD-001', customer: 'Nguyễn Văn A', product: 'Hạt Cafe Arabica', total: '1.200.000đ', status: 'Hoàn thành' },
  { id: 'ORD-002', customer: 'Trần Thị B', product: 'Bột Cafe Robusta', total: '850.000đ', status: 'Đang xử lý' },
  { id: 'ORD-003', customer: 'Lê Văn C', product: 'Máy xay Cafe Mini', total: '3.500.000đ', status: 'Đã hủy' },
  { id: 'ORD-004', customer: 'Phạm Thị D', product: 'Syrup Caramel', total: '450.000đ', status: 'Hoàn thành' },
];

const CHART_DATA = [
  { name: 'T2', value: 4000 },
  { name: 'T3', value: 3000 },
  { name: 'T4', value: 5000 },
  { name: 'T5', value: 2780 },
  { name: 'T6', value: 1890 },
  { name: 'T7', value: 2390 },
  { name: 'CN', value: 3490 },
];

const PRODUCTS = [
  { id: 1, name: 'Cafe Arabica Cầu Đất', category: 'Hạt Cafe', price: '250.000đ', stock: 45, image: 'https://picsum.photos/seed/coffee1/200/200' },
  { id: 2, name: 'Cafe Robusta Buôn Mê', category: 'Hạt Cafe', price: '180.000đ', stock: 120, image: 'https://picsum.photos/seed/coffee2/200/200' },
  { id: 3, name: 'Syrup Vanilla 750ml', category: 'Nguyên liệu pha chế', price: '210.000đ', stock: 15, image: 'https://picsum.photos/seed/syrup/200/200' },
  { id: 4, name: 'Bột Cacao Malaysia', category: 'Bột pha chế', price: '320.000đ', stock: 8, image: 'https://picsum.photos/seed/cacao/200/200' },
];

const CATEGORIES = [
  { id: 1, name: 'Hạt Cafe', count: 24, icon: Coffee, color: 'bg-orange-100 text-orange-600' },
  { id: 2, name: 'Nguyên liệu pha chế', count: 156, icon: FolderTree, color: 'bg-blue-100 text-blue-600' },
  { id: 3, name: 'Dụng cụ Barista', count: 42, icon: Settings, color: 'bg-purple-100 text-purple-600' },
  { id: 4, name: 'Máy móc thiết bị', count: 12, icon: Package, color: 'bg-emerald-100 text-emerald-600' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-white border-r border-slate-200 flex flex-col z-20"
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-200">
            <Coffee className="text-white w-6 h-6" />
          </div>
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-xl tracking-tight text-slate-800"
            >
              Coffee<span className="text-brand-500">Admin</span>
            </motion.span>
          )}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === item.id 
                  ? 'bg-brand-50 text-brand-600 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${
                activeTab === item.id ? 'text-brand-500' : 'text-slate-400 group-hover:text-slate-600'
              }`} />
              {isSidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium text-sm"
                >
                  {item.label}
                </motion.span>
              )}
              {activeTab === item.id && isSidebarOpen && (
                <motion.div 
                  layoutId="active-pill"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-50 text-slate-400 transition-colors"
          >
            <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Tìm kiếm sản phẩm, đơn hàng..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">Admin Coffee</p>
                <p className="text-xs text-slate-500">Quản trị viên</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-100 border-2 border-brand-200 overflow-hidden">
                <img 
                  src="https://picsum.photos/seed/admin/100/100" 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' ? (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-7xl mx-auto space-y-8"
              >
                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Chào buổi sáng, Admin! 👋</h1>
                    <p className="text-slate-500 mt-1">Dưới đây là tóm tắt hoạt động kinh doanh của bạn hôm nay.</p>
                  </div>
                  <button className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-brand-200 transition-all active:scale-95">
                    <Plus className="w-4 h-4" />
                    Thêm sản phẩm mới
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {STATS.map((stat, idx) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      key={stat.label}
                      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                          stat.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {stat.trend}
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-slate-900 mt-3">{stat.value}</p>
                      <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '70%' }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className={`h-full rounded-full ${stat.isUp ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="font-bold text-slate-900">Doanh thu tuần này</h2>
                        <p className="text-xs text-slate-500 mt-1">So với tuần trước: <span className="text-emerald-500 font-bold">+12%</span></p>
                      </div>
                      <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20">
                        <option>7 ngày qua</option>
                        <option>30 ngày qua</option>
                      </select>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={CHART_DATA}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 12, fill: '#94a3b8' }} 
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 12, fill: '#94a3b8' }} 
                          />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#f97316" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorValue)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="font-bold text-slate-900">Cảnh báo tồn kho</h2>
                      <TrendingUp className="w-5 h-5 text-brand-500" />
                    </div>
                    <div className="space-y-4">
                      {[
                        { name: 'Cafe Arabica Cầu Đất', stock: 5, unit: 'kg', color: 'bg-rose-500' },
                        { name: 'Sữa đặc Ngôi Sao', stock: 12, unit: 'lon', color: 'bg-amber-500' },
                        { name: 'Bột Cacao Nguyên Chất', stock: 3, unit: 'kg', color: 'bg-rose-500' },
                      ].map((item) => (
                        <div key={item.name} className="p-4 rounded-xl bg-slate-50 border border-slate-100 group hover:border-brand-200 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                            <MoreVertical className="w-4 h-4 text-slate-400 cursor-pointer" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${item.color}`} />
                              <p className="text-xs text-slate-500">Còn lại: <span className="font-bold text-slate-700">{item.stock} {item.unit}</span></p>
                            </div>
                            <button className="text-xs font-bold text-brand-600 hover:text-brand-700">Nhập thêm</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 text-sm font-medium hover:border-brand-300 hover:text-brand-500 transition-all">
                      Xem tất cả cảnh báo
                    </button>
                  </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                    <h2 className="font-bold text-slate-900">Đơn hàng gần đây</h2>
                    <button className="text-brand-500 text-sm font-semibold hover:underline">Xem tất cả</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/50">
                          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Mã đơn</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Khách hàng</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Sản phẩm</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng tiền</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {RECENT_ORDERS.map((order) => (
                          <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4 text-sm font-mono text-slate-600">{order.id}</td>
                            <td className="px-6 py-4 text-sm font-medium text-slate-900">{order.customer}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{order.product}</td>
                            <td className="px-6 py-4 text-sm font-bold text-slate-900">{order.total}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                order.status === 'Hoàn thành' ? 'bg-emerald-100 text-emerald-700' :
                                order.status === 'Đang xử lý' ? 'bg-amber-100 text-amber-700' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            ) : activeTab === 'categories' ? (
              <motion.div 
                key="categories"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-7xl mx-auto space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Quản lý Danh mục</h1>
                    <p className="text-slate-500 mt-1">Phân loại nguyên liệu để dễ dàng quản lý kho.</p>
                  </div>
                  <button className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-brand-200 transition-all">
                    <Plus className="w-4 h-4" />
                    Thêm danh mục
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {CATEGORIES.map((cat) => (
                    <motion.div 
                      key={cat.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className={`w-12 h-12 ${cat.color} rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-12`}>
                        <cat.icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg">{cat.name}</h3>
                      <p className="text-slate-500 text-sm mt-1">{cat.count} sản phẩm</p>
                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                              <img src={`https://picsum.photos/seed/cat${cat.id}${i}/32/32`} alt="" referrerPolicy="no-referrer" />
                            </div>
                          ))}
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500 transition-colors" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : activeTab === 'products' ? (
              <motion.div 
                key="products"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-7xl mx-auto space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Quản lý Sản phẩm</h1>
                    <p className="text-slate-500 mt-1">Quản lý danh sách nguyên liệu và dụng cụ cafe của bạn.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all">
                      <Download className="w-4 h-4" />
                      Xuất Excel
                    </button>
                    <button className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2 rounded-xl text-sm font-medium shadow-lg shadow-brand-200 transition-all">
                      <Plus className="w-4 h-4" />
                      Thêm sản phẩm
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-center gap-4">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Tìm tên sản phẩm..." 
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-600 hover:bg-slate-100">
                    <Filter className="w-4 h-4" />
                    Bộ lọc
                  </button>
                  <select className="bg-slate-50 border border-slate-100 rounded-lg px-4 py-2 text-sm text-slate-600 focus:outline-none">
                    <option>Tất cả danh mục</option>
                    <option>Hạt Cafe</option>
                    <option>Bột pha chế</option>
                    <option>Sữa & Syrup</option>
                  </select>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {PRODUCTS.map((product) => (
                    <motion.div 
                      key={product.id}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group"
                    >
                      <div className="aspect-square relative overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button className="p-2 bg-white rounded-full text-slate-800 hover:bg-brand-500 hover:text-white transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-white rounded-full text-slate-800 hover:bg-brand-500 hover:text-white transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-white rounded-full text-slate-800 hover:bg-rose-500 hover:text-white transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="p-5">
                        <p className="text-xs font-bold text-brand-500 uppercase tracking-wider mb-1">{product.category}</p>
                        <h3 className="font-bold text-slate-900 mb-2 line-clamp-1">{product.name}</h3>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-bold text-slate-900">{product.price}</p>
                          <p className={`text-xs font-medium px-2 py-1 rounded-lg ${
                            product.stock < 10 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'
                          }`}>
                            Kho: {product.stock}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-[60vh] text-slate-400"
              >
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Settings className="w-10 h-10 animate-spin-slow" />
                </div>
                <h2 className="text-xl font-bold text-slate-600">Tính năng đang phát triển</h2>
                <p className="mt-2">Vui lòng quay lại sau để trải nghiệm đầy đủ.</p>
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className="mt-6 text-brand-500 font-bold hover:underline"
                >
                  Quay lại Bảng điều khiển
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
