import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { GenericProcessingPage } from './processing/GenericProcessingPage';
import { Calendar, Download, FileUser, UserCheck, Users, Baby, Heart, UserX, UsersRound, FileEdit, FileCheck, FileX, ChevronLeft, Search, ArrowUpRight } from 'lucide-react';
import { DataDetailModal } from '../DataDetailModal';
import { DatabasePageTemplate } from './collection/DatabasePageTemplate';

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

  const stats = providedStats || useMemo(() => generateData(), []);

  const [timeFilter, setTimeFilter] = useState<'thisMonth' | 'lastMonth' | '3months' | '6months'>('thisMonth');

  const chartData = useMemo(() => {
    return stats.map(stat => {
      let currentPeriod = 0;
      let previousPeriod = 0;

      if (timeFilter === 'thisMonth') {
        currentPeriod = stat.thisMonth;
        previousPeriod = stat.lastMonth;
      } else if (timeFilter === 'lastMonth') {
        currentPeriod = stat.lastMonth;
        previousPeriod = Math.floor(stat.lastMonth * 0.9);
      } else if (timeFilter === '3months') {
        currentPeriod = stat.thisMonth + stat.lastMonth * 2;
        previousPeriod = Math.floor(stat.lastMonth * 2.8);
      } else if (timeFilter === '6months') {
        currentPeriod = stat.thisMonth + stat.lastMonth * 5;
        previousPeriod = Math.floor(stat.lastMonth * 5.5);
      }

      return {
        name: stat.title,
        current: currentPeriod,
        previous: previousPeriod,
      };
    });
  }, [stats, timeFilter]);

  const totalChartSum = chartData.reduce((sum, item) => sum + item.current, 0);

  const getLegendLabels = () => {
    switch(timeFilter) {
      case 'thisMonth': return ['Số lượng bản ghi đã thu thập tháng trước', 'Số lượng bản ghi đã thu thập tháng này'];
      case 'lastMonth': return ['Số lượng bản ghi đã thu thập tháng trước nữa', 'Số lượng bản ghi đã thu thập tháng trước'];
      case '3months': return ['Số lượng bản ghi đã thu thập 3 tháng trước', 'Số lượng bản ghi đã thu thập 3 tháng gần nhất'];
      case '6months': return ['Số lượng bản ghi đã thu thập 6 tháng trước', 'Số lượng bản ghi đã thu thập 6 tháng gần nhất'];
      default: return ['Kỳ trước', 'Kỳ này'];
    }
  };

  const legendLabels = getLegendLabels();

  if (mode === 'xử lý') {
    return <GenericProcessingPage systemName={categoryName} datasets={stats.map((s, idx) => ({ id: s.id || `item_${idx}`, name: s.title }))} />;
  }

  const sidebarItems = stats.map(s => ({ id: s.id, label: `Bộ dữ liệu ${s.title.toLowerCase()}` }));

  return (
    <DatabasePageTemplate
      title={title}
      description={`Quản lý và xem chi tiết dữ liệu từ ${categoryName}`}
      onBack={onBack}
      innerSidebarItems={sidebarItems}
      onSelectDataType={(id) => {
        const stat = stats.find(s => s.id === id);
        if (stat) setSelectedStat(stat);
      }}
    >

      {/* Biểu đồ thu thập dữ liệu */}
      <div className="mt-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Biểu đồ thu thập dữ liệu</h3>
            <select 
              className="border border-blue-400 rounded-md px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as any)}
            >
              <option value="thisMonth">Tháng này</option>
              <option value="lastMonth">Tháng trước</option>
              <option value="3months">3 tháng gần nhất</option>
              <option value="6months">6 tháng gần nhất</option>
            </select>
          </div>
          <div className="text-slate-600 font-medium text-lg">Tổng số: {totalChartSum.toLocaleString('vi-VN').replace(/,/g, '.')}</div>
        </div>
        
        <div className="overflow-x-auto overflow-y-hidden pb-4">
          <div className="mt-8" style={{ minWidth: Math.max(stats.length * 90, 800), height: 450 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 120 }} barGap={0}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  interval={0} 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  dy={10}
                />
                <YAxis 
                  tickFormatter={(value) => {
                    if (value === 0) return '0';
                    return `${(value / 1000).toFixed(0)}K`;
                  }} 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                />
                <Tooltip 
                  formatter={(value: number) => value.toLocaleString('vi-VN').replace(/,/g, '.')} 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  content={() => (
                    <div className="flex justify-center gap-8 mt-16 text-sm text-slate-600 w-full sticky left-0">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-400 rounded-sm"></div>
                        <span>{legendLabels[0]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-orange-500 rounded-sm"></div>
                        <span>{legendLabels[1]}</span>
                      </div>
                    </div>
                  )}
                />
                <Bar dataKey="previous" fill="#60a5fa" radius={[4, 4, 0, 0]} maxBarSize={30} />
                <Bar dataKey="current" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={30}>
                  <LabelList 
                    dataKey="current" 
                    position="top" 
                    formatter={(val: number) => val.toLocaleString('vi-VN').replace(/,/g, '.')} 
                    style={{ fontSize: '11px', fontWeight: 'bold', fill: '#0f172a' }} 
                    offset={10}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Danh sách CSDL thu thập */}
      <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">Danh sách CSDL thu thập</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Tên cơ liệu</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Thuộc</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Số lượng đăng ký tháng này</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Số lượng bản ghi lỗi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.map((stat) => (
                <tr key={stat.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{stat.title}</td>
                  <td className="px-6 py-4 text-slate-600">{categoryName}</td>
                  <td className="px-6 py-4 text-slate-600">{stat.thisMonth.toLocaleString('vi-VN').replace(/,/g, '.')}</td>
                  <td className="px-6 py-4 text-slate-600">{Math.floor(stat.thisMonth * 0.05).toLocaleString('vi-VN').replace(/,/g, '.')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lịch sử thu thập - Moved from tab to bottom */}
      <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <Calendar className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-slate-900 font-semibold mb-1">Lịch sử thu thập</h3>
        <p className="text-slate-500 text-sm max-w-sm">Dữ liệu lịch sử thu thập đang được cập nhật. Vui lòng quay lại sau.</p>
      </div>

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
    </DatabasePageTemplate>
  );
}