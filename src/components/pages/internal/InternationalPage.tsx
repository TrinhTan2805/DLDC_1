import { useState } from 'react';
import { GenericProcessingPage } from '../processing/GenericProcessingPage';
import { Calendar, Download, FileText, FolderOpen, Users, Video, BookOpen, Plane } from 'lucide-react';
import { DataDetailModal } from '../../DataDetailModal';

interface StatCard {
  id: string;
  title: string;
  value: string;
  change: string;
  icon: any;
  color: string;
  lastMonth: number;
  thisMonth: number;
  totalCollected: number;
  totalProcessed: number;
  processingRate: number;
}

interface DatabaseRecord {
  name: string;
  category: string;
  todayCount: number;
  errorCount: number;
}

interface InternationalPageProps {
  onBack?: () => void;
  mode?: 'thu thập' | 'xử lý';
  context?: 'thu thập' | 'chia sẻ';
}

export function InternationalPage({ mode = 'thu thập', context = 'thu thập' }: InternationalPageProps) {
  const [dateRange, setDateRange] = useState('01/01/2024 - 30/04/2024');
  const [selectedStat, setSelectedStat] = useState<StatCard | null>(null);

  // Generate realistic random data for International Cooperation Database (6 types)
  const generateData = () => {
    const data = [
      { id: '1', title: 'Dữ liệu Thông tin điều ước quốc tế, thỏa thuận quốc tế', icon: FileText, color: 'blue', lastMonth: 1245678, thisMonth: 1479200 },
      { id: '2', title: 'Dữ liệu Thông tin chương trình dự án', icon: FolderOpen, color: 'green', lastMonth: 1087543, thisMonth: 1246447 },
      { id: '3', title: 'Dữ liệu Danh sách chuyên gia', icon: Users, color: 'purple', lastMonth: 898234, thisMonth: 1026644 },
      { id: '4', title: 'Dữ liệu Thông tin hội nghị, hội thảo', icon: Video, color: 'orange', lastMonth: 956789, thisMonth: 1134567 },
      { id: '5', title: 'Dữ liệu Thông tin sản phẩm nghiên cứu, truyền thông', icon: BookOpen, color: 'blue', lastMonth: 834567, thisMonth: 996789 },
      { id: '6', title: 'Dữ liệu Thông tin Đoàn', icon: Plane, color: 'green', lastMonth: 756789, thisMonth: 887654 },
    ];

    return data.map(item => {
      const total = item.lastMonth + item.thisMonth;
      const change = ((item.thisMonth - item.lastMonth) / item.lastMonth * 100).toFixed(1);
      const changeStr = change.startsWith('-') ? change : `+${change}`;
      
      const totalCollected = total;
      const totalProcessed = Math.floor(total * (0.95 + Math.random() * 0.04));
      const processingRate = Math.floor((totalProcessed / totalCollected) * 100);
      
      return {
        id: item.id,
        title: item.title,
        value: total.toLocaleString(),
        change: `${changeStr}%`,
        icon: item.icon,
        color: item.color,
        lastMonth: item.lastMonth,
        thisMonth: item.thisMonth,
        totalCollected,
        totalProcessed,
        processingRate,
      };
    });
  };

  const stats = generateData();

  
  if (mode === 'xử lý') {
    return <GenericProcessingPage systemName="CSDL Hợp tác quốc tế" datasets={stats.map((s, idx) => ({ id: s.id || `item_${idx}`, name: s.title }))} />;
  }

  const tableData: DatabaseRecord[] = [
    { name: 'Dữ liệu Thông tin điều ước quốc tế, thỏa thuận quốc tế', category: 'CSDL Hợp tác quốc tế', todayCount: 20000, errorCount: 30 },
    { name: 'Dữ liệu Thông tin chương trình dự án', category: 'CSDL Hợp tác quốc tế', todayCount: 20000, errorCount: 30 },
    { name: 'Dữ liệu Danh sách chuyên gia', category: 'CSDL Hợp tác quốc tế', todayCount: 20000, errorCount: 30 },
    { name: 'Dữ liệu Thông tin hội nghị, hội thảo', category: 'CSDL Hợp tác quốc tế', todayCount: 20000, errorCount: 30 },
    { name: 'Dữ liệu Thông tin sản phẩm nghiên cứu, truyền thông', category: 'CSDL Hợp tác quốc tế', todayCount: 20000, errorCount: 30 },
    { name: 'Dữ liệu Thông tin Đoàn', category: 'CSDL Hợp tác quốc tế', todayCount: 20000, errorCount: 30 },
  ];

  // Chart data matching stats totals
  const chartData = stats.map((stat, index) => {
    const names = ['Điều ước QT', 'Chương trình DA', 'Chuyên gia', 'Hội nghị', 'SP nghiên cứu', 'Đoàn'];
    return {
      name: names[index],
      lastMonth: stat.lastMonth,
      thisMonth: stat.thisMonth,
    };
  });

  const getStatColor = (color: string) => {
    return 'bg-white text-slate-700';
  };

  const getStatIconBg = (color: string) => {
    return 'bg-slate-100';
  };

  return (
    <div className="space-y-4">
      {/* Date Range Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-slate-900">Danh sách hồ sơ</h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button title="Hành động" aria-label="Hành động" className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50">
            <Calendar className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Stats Grid - 6 cards */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.id} 
              className={`p-4 rounded-lg border border-slate-200 ${getStatColor(stat.color)} cursor-pointer hover:shadow-md transition-shadow`}
              onClick={() => setSelectedStat(stat)}
            >
              <div className="flex items-start gap-3">
                {/* Icon on the left */}
                <div className={`w-10 h-10 rounded-lg ${getStatIconBg(stat.color)} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                {/* Content on the right */}
                <div className="flex-1 min-w-0">
                  {/* Title - normal weight on top */}
                  <div className="text-base text-slate-700 mb-1 leading-tight">
                    {stat.title}
                  </div>
                  {/* "Số liệu đã thu thập" text */}
                  <div className="text-xs text-slate-500 mb-2">
                    Số liệu đã thu thập
                  </div>
                  {/* Number display - different format based on mode */}
                  {mode === 'xử lý' ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-semibold text-slate-700">
                          {stat.totalCollected.toLocaleString()}
                        </span>
                        <span className="text-slate-400">/</span>
                        <span className="text-base font-semibold text-slate-700">
                          {stat.totalProcessed.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-500">
                          ({stat.processingRate}%)
                        </span>
                      </div>
                      <div className={`text-xs font-medium ${stat.change.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>
                        {stat.change.startsWith('-') ? '▼' : '▲'} {stat.change}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-semibold text-slate-700">{stat.value}</span>
                      <span className={`text-xs font-medium ${stat.change.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>
                        {stat.change.startsWith('-') ? '▼' : '▲'} {stat.change}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-semibold text-slate-900">Biểu đồ thu thập dữ liệu theo phương thức thu thập</h3>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Tổng số: 100</span>
            <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Kết xuất
            </button>
          </div>
        </div>

        {/* Month Filter */}
        <div className="mb-6">
          <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Tháng này</option>
            <option>Tháng trước</option>
            <option>3 tháng gần nhất</option>
            <option>6 tháng gần nhất</option>
          </select>
        </div>

        {/* Bar Chart */}
        <div className="relative h-96 pl-16 pr-4 pt-8 pb-20">
          {/* Grid lines */}
          <div className="absolute left-16 right-4 top-8 bottom-20 border-l border-b border-slate-300">
            {[0, 1000000, 2000000, 3000000].map((value) => {
              const maxValue = 3000000;
              const position = ((maxValue - value) / maxValue) * 100;
              return (
                <div
                  key={value}
                  className="absolute left-0 right-0 border-t border-slate-200"
                  style={{ top: `${position}%` }}
                >
                  <span className="absolute -left-16 -top-2.5 text-xs text-slate-600 w-14 text-right">
                    {value === 0 ? '0' : `${(value / 1000000).toFixed(1)}M`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bars - Stacked */}
          <div className="absolute left-16 right-4 top-8 bottom-20 flex items-end justify-between gap-1">
            {chartData.map((data, index) => {
              const maxValue = 3000000;
              const totalValue = data.lastMonth + data.thisMonth;
              const totalPercent = (totalValue / maxValue) * 100;
              const lastMonthPercent = (data.lastMonth / maxValue) * 100;
              const thisMonthPercent = (data.thisMonth / maxValue) * 100;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center relative" style={{ height: '100%' }}>
                  <div className="w-full flex flex-col items-center justify-end" style={{ height: '100%' }}>
                    {/* Stacked bar container */}
                    <div className="w-full max-w-[50px] flex flex-col relative" style={{ height: `${totalPercent}%`, minHeight: '8px' }}>
                      {/* This Month (Orange) - Top portion */}
                      <div className="relative flex flex-col items-center" style={{ height: `${(thisMonthPercent / totalPercent) * 100}%` }}>
                        {data.thisMonth > 0 && (
                          <>
                            <span className="absolute -top-6 text-xs font-semibold text-slate-700 whitespace-nowrap">
                              {data.thisMonth.toLocaleString()}
                            </span>
                            <div 
                              className="w-full bg-orange-400 h-full"
                              style={{ minHeight: '4px' }}
                            />
                          </>
                        )}
                      </div>
                      
                      {/* Last Month (Blue) - Bottom portion */}
                      <div className="relative flex flex-col items-center flex-1">
                        {data.lastMonth > 0 && (
                          <>
                            <div 
                              className="w-full bg-blue-400 h-full"
                              style={{ minHeight: '4px' }}
                            />
                            <span className="absolute top-1/2 -translate-y-1/2 text-xs font-semibold text-white whitespace-nowrap">
                              {data.lastMonth.toLocaleString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Label */}
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 -rotate-45 origin-center whitespace-nowrap text-xs text-slate-600">
                    {data.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-8 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-400 rounded"></div>
            <span className="text-slate-600">Số lượng bản ghi đã thu thập tháng trước</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-400 rounded"></div>
            <span className="text-slate-600">Số lượng bản ghi đã thu thập tháng này</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-slate-900">Danh sách CSDL thư thập cập nhật</h3>
        </div>
        
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-3 text-left text-sm text-slate-600">Tên cơ liệu</th>
              <th className="px-6 py-3 text-left text-sm text-slate-600">Thuộc</th>
              <th className="px-6 py-3 text-left text-sm text-slate-600">Số lượng đăng ký ngày hôm nay</th>
              <th className="px-6 py-3 text-left text-sm text-slate-600">Số lượng bản ghi lỗi</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((record, index) => (
              <tr key={index} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="px-6 py-4 text-sm text-slate-900">{record.name}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{record.category}</td>
                <td className="px-6 py-4 text-sm text-slate-900">{record.todayCount.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-slate-900">{record.errorCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Data Detail Modal */}
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