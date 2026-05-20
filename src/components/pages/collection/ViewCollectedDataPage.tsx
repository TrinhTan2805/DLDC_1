import React, { useState } from 'react';
import { Database, Search, LayoutGrid, List, Filter, ArrowUpRight, ArrowDownRight, HardDrive, Server, Link2 } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ElementType;
  color: string;
}

const StatsCard = ({ title, value, change, isPositive, icon: Icon, color }: StatsCardProps) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2.5 rounded-lg ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      {change && (
        <div className={`flex items-center text-base font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
          {change}
        </div>
      )}
    </div>
    <div>
      <h3 className="text-slate-500 text-base font-medium mb-1">{title}</h3>
      <p className="text-base font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

interface DataCardProps {
  title: string;
  count?: number;
  status: 'active' | 'inactive';
  onViewDetail: () => void;
}

const DataCard = ({ title, count, status, onViewDetail }: DataCardProps) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group cursor-pointer" onClick={onViewDetail}>
    <div className="flex items-start justify-end mb-2">
      <span className={`px-2.5 py-1 rounded-full text-base font-bold uppercase tracking-wider ${
        status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
      }`}>
        {status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
      </span>
    </div>
    <h4 className="text-slate-900 text-base font-bold mb-2 group-hover:text-blue-700 transition-colors line-clamp-2 min-h-[48px]">
      {title}
    </h4>
    <div className="flex items-center justify-between mt-auto">
      <div className="text-base text-slate-500">
        {count ? `${count.toLocaleString()} bản ghi` : '0 bản ghi'}
      </div>
      <div className="text-blue-600 text-base font-bold flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        Xem chi tiết
        <ArrowUpRight className="w-4 h-4 ml-1" />
      </div>
    </div>
  </div>
);

export function ViewCollectedDataPage({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const [activeTab, setActiveTab] = useState<'internal' | 'external'>('internal');
  const [searchTerm, setSearchTerm] = useState('');

  const internalDatabases = [
    { id: "data-info-civil-registry", title: "CSDL Hộ tịch điện tử", count: 15420000, status: 'active' as const },
    { id: "data-info-case-management", title: "HT quản lý hồ sơ QT (3)", count: 2450000, status: 'active' as const },
    { id: "data-info-civil-judgment", title: "CSDL thi hành án dân sự (16)", count: 8600000, status: 'active' as const },
    { id: "data-info-security-measures", title: "CSDL về biện pháp BD (4)", count: 1200000, status: 'active' as const },
    { id: "data-info-legal-national", title: "CSDL quốc gia về PL (5)", count: 3500000, status: 'active' as const },
    { id: "data-info-civil-legal-center", title: "CSDL TT Tư Pháp dân sự (2)", count: 850000, status: 'active' as const },
    { id: "data-info-civil-legal-info", title: "HTTT trợ giúp pháp lý (6)", count: 1100000, status: 'active' as const },
    { id: "data-info-legal-center", title: "Phần mềm tk ngành tư pháp phục vụ chia sẻ dữ liệu mở", count: 920000, status: 'active' as const },
    { id: "data-info-family-base", title: "CSDL PB, GĐ và HG cơ sở (16)", count: 450000, status: 'active' as const },
    { id: "data-info-auction", title: "CSDL quản lý đấu giá TS (24)", count: 320000, status: 'inactive' as const },
    { id: "data-info-international", title: "CSDL Hợp tác quốc tế (6)", count: 125000, status: 'active' as const },
    { id: "collection-statistics", title: "Thu thập số liệu thống kê", count: 0, status: 'active' as const },
  ];

  const externalDatabases = [
    { id: "external-court-judgment", title: "CSDL Thông tin Bản án (1)", count: 1200000, status: 'active' as const },
    { id: "external-category-group", title: "Danh mục (8)", count: 450000, status: 'active' as const },
    { id: "external-social-security", title: "BHXH và Giảm nghèo (7)", count: 8500000, status: 'active' as const },
    { id: "external-meritorious-group", title: "Người có công (3)", count: 2100000, status: 'active' as const },
    { id: "external-children-group", title: "Trẻ em (1)", count: 1500000, status: 'active' as const },
  ];

  const currentDatabases = activeTab === 'internal' ? internalDatabases : externalDatabases;
  const filteredDatabases = currentDatabases.filter(db => 
    db.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
      <div className="space-y-6 min-h-screen">
      <div>
        <div className="flex items-center gap-2 text-base text-slate-500 mb-2">
          <span>Thu thập</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-medium">Xem dữ liệu thu thập</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-base font-bold text-slate-900 uppercase tracking-tight">Tổng quan dữ liệu thu thập</h1>
            <p className="text-base text-slate-500 mt-2 mb-4">Theo dõi trạng thái và thống kê dữ liệu từ tất cả các nguồn hệ thống</p>
            
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg w-fit shadow-sm">
              <button
                onClick={() => setActiveTab('internal')}
                className={`px-6 py-2 rounded-md text-base font-bold transition-all ${
                  activeTab === 'internal' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Trong ngành
              </button>
              <button
                onClick={() => setActiveTab('external')}
                className={`px-6 py-2 rounded-md text-base font-bold transition-all ${
                  activeTab === 'external' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ngoài ngành
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard 
          title="Tổng số CSDL / Hệ thống" 
          value="12" 
          change="+2.4%" 
          isPositive={true} 
          icon={Server} 
          color="bg-blue-50 text-blue-600" 
        />
        <StatsCard 
          title="Tổng số bản ghi" 
          value="34.2M" 
          change="+12.5k" 
          isPositive={true} 
          icon={Database} 
          color="bg-purple-50 text-purple-600" 
        />
        <StatsCard 
          title="Số lượng CSDL đã kết nối" 
          value="10" 
          change="92%" 
          isPositive={true} 
          icon={Link2} 
          color="bg-emerald-50 text-emerald-600" 
        />
        <StatsCard 
          title="Kích thước dữ liệu" 
          value="856 MB" 
          change="+42 MB" 
          isPositive={false} 
          icon={HardDrive} 
          color="bg-orange-50 text-orange-600" 
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên CSDL, hệ thống..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-slate-200 rounded-lg p-1 bg-slate-50">
            <button className="p-1.5 bg-white shadow-sm rounded text-blue-600 border border-slate-200">
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-slate-500 hover:text-slate-900">
              <List className="w-4 h-4" />
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-base text-slate-700 hover:bg-slate-50 transition-colors bg-white font-medium">
            <Filter className="w-4 h-4" />
            Lọc
          </button>
        </div>
      </div>

      {/* Grid of Cards */}
      {filteredDatabases.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-12">
          {filteredDatabases.map((db) => (
            <DataCard 
              key={db.id} 
              title={db.title} 
              count={db.count} 
              status={db.status}
              onViewDetail={() => onNavigate?.(db.id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-slate-50 rounded-full mb-4">
            <Search className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-slate-900 text-base font-bold mb-1">Không tìm thấy dữ liệu</h3>
          <p className="text-slate-500 text-base max-w-xs">Không có kết quả nào khớp với từ khóa "{searchTerm}". Vui lòng thử lại với từ khóa khác.</p>
        </div>
      )}
    </div>
    </div>
  );
}
