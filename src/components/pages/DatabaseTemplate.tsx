import { useState } from 'react';
import { GenericProcessingPage } from './processing/GenericProcessingPage';
import { Calendar, Download, FileUser, UserCheck, Users, Baby, Heart, UserX, UsersRound, FileEdit, FileCheck, FileX, ChevronLeft, Search, ArrowUpRight } from 'lucide-react';
import { DataDetailModal } from '../DataDetailModal';

interface StatCard {
  id: string;
  title: string;
  value: string;
  change: string;
  icon: any;
  color: string;
  lastMonth: number;
  thisMonth: number;
  collected?: number;
  processed?: number;
  shared?: number;
}

interface DatabaseRecord {
  name: string;
  category: string;
  todayCount: number;
  errorCount: number;
}

interface DatabaseTemplateProps {
  title?: string;
  categoryName: string;
  mode?: 'thu thập' | 'xử lý';
  context?: 'thu thập' | 'chia sẻ';
  stats?: StatCard[];
  onBack?: () => void;
}

export function DatabaseTemplate({ 
  title = 'Danh sách dữ liệu đã thu thập', 
  categoryName,
  mode = 'thu thập',
  context = 'thu thập',
  stats: providedStats,
  onBack
}: DatabaseTemplateProps) {
  const [selectedStat, setSelectedStat] = useState<StatCard | null>(null);
  const [activeTab, setActiveTab] = useState<'records' | 'history'>('records');

  // Default stats if none provided
  const generateData = () => {
    const data = [
      { id: '1', title: 'Hồ sơ khai sinh', icon: Baby, color: 'blue', lastMonth: 1245, thisMonth: 2179, collected: 3090, processed: 2987, shared: 2490 },
      { id: '2', title: 'Hồ sơ đăng ký kết hôn', icon: Heart, color: 'green', lastMonth: 1678543, thisMonth: 1746447, collected: 4567, processed: 4321, shared: 3890 },
      { id: '3', title: 'Hồ sơ cấp GĐKN kết hôn', icon: FileCheck, color: 'purple', lastMonth: 1598234, thisMonth: 1826644, collected: 5234, processed: 5011, shared: 4756 },
      { id: '4', title: 'Hồ sơ đăng ký khai tử', icon: FileX, color: 'orange', lastMonth: 1612345, thisMonth: 1812533, collected: 2876, processed: 2654, shared: 2398 },
      { id: '5', title: 'Hồ sơ DK nhận cha, mẹ, con', icon: Users, color: 'blue', lastMonth: 1545678, thisMonth: 1879200, collected: 6123, processed: 5876, shared: 5432 },
      { id: '6', title: 'Hồ sơ đăng ký nuôi con nuôi', icon: UserCheck, color: 'green', lastMonth: 1687234, thisMonth: 1737644, collected: 1987, processed: 1865, shared: 1654 },
    ];

    return data.map(item => {
      const total = item.lastMonth + item.thisMonth;
      const change = ((item.thisMonth - item.lastMonth) / item.lastMonth * 100).toFixed(1);
      const changeStr = change.startsWith('-') ? change : `+${change}`;
      
      return {
        id: item.id,
        title: item.title,
        value: total.toLocaleString(),
        change: `${changeStr}%`,
        icon: item.icon,
        color: item.color,
        lastMonth: item.lastMonth,
        thisMonth: item.thisMonth,
        collected: item.collected,
        processed: item.processed,
        shared: item.shared,
      };
    });
  };

  const stats = providedStats || generateData();

  if (mode === 'xử lý') {
    return <GenericProcessingPage systemName={categoryName} datasets={stats.map((s, idx) => ({ id: s.id || `item_${idx}`, name: s.title }))} />;
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        {onBack && (
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
            title="Quay lại"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <p className="text-slate-500 text-sm mt-1">Quản lý và xem chi tiết dữ liệu từ {categoryName}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('records')}
          className={`px-4 py-3 text-sm font-medium transition-all relative ${
            activeTab === 'records' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Danh sách bản ghi dữ liệu đã thu thập
          {activeTab === 'records' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-3 text-sm font-medium transition-all relative ${
            activeTab === 'history' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Lịch sử thu thập
          {activeTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
        </button>
      </div>

      {activeTab === 'records' ? (
        <div className="space-y-6">
          {/* Stats Grid - Cards for each data type */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={stat.id} 
                  className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group cursor-pointer"
                  onClick={() => setSelectedStat(stat)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-blue-50 transition-colors text-slate-600 group-hover:text-blue-600">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className={`text-xs font-medium ${stat.change.startsWith('-') ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {stat.change}
                    </div>
                  </div>
                  <h4 className="text-slate-900 font-semibold mb-2 group-hover:text-blue-700 transition-colors line-clamp-2 min-h-[40px]">
                    {stat.title}
                  </h4>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-blue-600 text-xs font-bold flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      Chi tiết
                      <ArrowUpRight className="w-3 h-3 ml-1" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Optional: Table view below if needed, but grid was the original layout */}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-slate-900 font-semibold mb-1">Lịch sử thu thập</h3>
          <p className="text-slate-500 text-sm max-w-sm">Dữ liệu lịch sử thu thập đang được cập nhật. Vui lòng quay lại sau.</p>
        </div>
      )}

      {selectedStat && (
        <DataDetailModal
          isOpen={true}
          onClose={() => setSelectedStat(null)}
          title={selectedStat.title}
          totalRecords={selectedStat.lastMonth + selectedStat.thisMonth}
          newRecords={selectedStat.thisMonth}
          updatedRecords={Math.floor(selectedStat.thisMonth * 0.2)}
          errorRecords={Math.floor(selectedStat.thisMonth * 0.05)}
        />
      )}
    </div>
  );
}