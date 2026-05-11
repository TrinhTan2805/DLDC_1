<<<<<<< HEAD
import { useState } from 'react';
import { GenericProcessingPage } from '../processing/GenericProcessingPage';
import { Calendar, Download, FileText, Scale, Eye, FileCheck, BookOpen, MapPin, Shield, UserCheck, Plane, MessageSquare, FileSearch, Briefcase, Gavel, Stamp, DollarSign, Users, FileBarChart, ClipboardList, Package } from 'lucide-react';
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

interface StatisticsCollectionPageProps {
  onBack?: () => void;
  mode?: 'thu thập' | 'xử lý';
  context?: 'thu thập' | 'chia sẻ';
}

export function StatisticsCollectionPage({ mode = 'thu thập', context = 'thu thập' }: StatisticsCollectionPageProps) {
  const [dateRange, setDateRange] = useState('01/01/2024 - 30/04/2024');
  const [selectedStat, setSelectedStat] = useState<StatCard | null>(null);

  // Generate realistic random data for Statistics Collection (21 types)
  const generateData = () => {
    const data = [
      { id: '1', title: 'Xây dựng văn bản quy phạm pháp luật', icon: FileText, color: 'blue', lastMonth: 856234, thisMonth: 989123 },
      { id: '2', title: 'Kiểm tra văn bản quy phạm pháp luật', icon: FileCheck, color: 'green', lastMonth: 945678, thisMonth: 1078456 },
      { id: '3', title: 'Rà soát văn bản quy phạm pháp luật', icon: FileSearch, color: 'purple', lastMonth: 823456, thisMonth: 956789 },
      { id: '4', title: 'Tổ chức và người làm công tác pháp chế', icon: Users, color: 'orange', lastMonth: 678234, thisMonth: 789456 },
      { id: '5', title: 'Phổ biến, giáo dục pháp luật', icon: BookOpen, color: 'blue', lastMonth: 1234567, thisMonth: 1456789 },
      { id: '6', title: 'Hòa giải ở cơ sở', icon: MessageSquare, color: 'green', lastMonth: 567890, thisMonth: 678901 },
      { id: '7', title: 'Chuẩn tiếp cận pháp luật', icon: Scale, color: 'purple', lastMonth: 445678, thisMonth: 534567 },
      { id: '8', title: 'Hộ tịch', icon: UserCheck, color: 'orange', lastMonth: 2345678, thisMonth: 2789012 },
      { id: '9', title: 'Chứng thực', icon: Stamp, color: 'blue', lastMonth: 1789234, thisMonth: 2123456 },
      { id: '10', title: 'Lý lịch tư pháp', icon: FileBarChart, color: 'green', lastMonth: 987654, thisMonth: 1156789 },
      { id: '11', title: 'Nuôi con nuôi', icon: Users, color: 'purple', lastMonth: 234567, thisMonth: 278901 },
      { id: '12', title: 'Trợ giúp pháp lý', icon: MessageSquare, color: 'orange', lastMonth: 678901, thisMonth: 789123 },
      { id: '13', title: 'Đăng ký giao dịch bảo đảm', icon: ClipboardList, color: 'blue', lastMonth: 1456789, thisMonth: 1678901 },
      { id: '14', title: 'Luật sư', icon: Briefcase, color: 'green', lastMonth: 567890, thisMonth: 645678 },
      { id: '15', title: 'Công chứng', icon: Stamp, color: 'purple', lastMonth: 1234567, thisMonth: 1456789 },
      { id: '16', title: 'Giám định tư pháp', icon: Eye, color: 'orange', lastMonth: 345678, thisMonth: 412345 },
      { id: '17', title: 'Đấu giá tài sản', icon: Gavel, color: 'blue', lastMonth: 789012, thisMonth: 923456 },
      { id: '18', title: 'Trọng tài thương mại', icon: Scale, color: 'green', lastMonth: 456789, thisMonth: 534567 },
      { id: '19', title: 'Hòa giải thương mại', icon: MessageSquare, color: 'purple', lastMonth: 345678, thisMonth: 412345 },
      { id: '20', title: 'Quản lý thanh lý tài sản', icon: Package, color: 'orange', lastMonth: 567890, thisMonth: 656789 },
      { id: '21', title: 'Tương trợ tư pháp', icon: Shield, color: 'blue', lastMonth: 456789, thisMonth: 545678 },
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
    return <GenericProcessingPage systemName="Thu thập số liệu thống kê" datasets={stats.map((s, idx) => ({ id: s.id || `item_${idx}`, name: s.title }))} />;
  }

  const tableData: DatabaseRecord[] = [
    { name: 'Xây dựng văn bản quy phạm pháp luật', category: 'Thu thập số liệu thống kê', todayCount: 18500, errorCount: 25 },
    { name: 'Kiểm tra văn bản quy phạm pháp luật', category: 'Thu thập số liệu thống kê', todayCount: 21200, errorCount: 18 },
    { name: 'Rà soát văn bản quy phạm pháp luật', category: 'Thu thập số liệu thống kê', todayCount: 19300, errorCount: 22 },
    { name: 'Tổ chức và người làm công tác pháp chế', category: 'Thu thập số liệu thống kê', todayCount: 15700, errorCount: 14 },
    { name: 'Phổ biến, giáo dục pháp luật', category: 'Thu thập số liệu thống kê', todayCount: 29100, errorCount: 31 },
    { name: 'Hòa giải ở cơ sở', category: 'Thu thập số liệu thống kê', todayCount: 13500, errorCount: 19 },
    { name: 'Chuẩn tiếp cận pháp luật', category: 'Thu thập số liệu thống kê', todayCount: 10800, errorCount: 12 },
    { name: 'Hộ tịch', category: 'Thu thập số liệu thống kê', todayCount: 55600, errorCount: 42 },
    { name: 'Chứng thực', category: 'Thu thập số liệu thống kê', todayCount: 42300, errorCount: 37 },
    { name: 'Lý lịch tư pháp', category: 'Thu thập số liệu thống kê', todayCount: 23100, errorCount: 26 },
    { name: 'Nuôi con nuôi', category: 'Thu thập số liệu thống kê', todayCount: 5600, errorCount: 8 },
    { name: 'Trợ giúp pháp lý', category: 'Thu thập số liệu thống kê', todayCount: 15800, errorCount: 17 },
    { name: 'Đăng ký giao dịch bảo đảm', category: 'Thu thập số liệu thống kê', todayCount: 33500, errorCount: 29 },
    { name: 'Luật sư', category: 'Thu thập số liệu thống kê', todayCount: 12900, errorCount: 15 },
    { name: 'Công chứng', category: 'Thu thập số liệu thống kê', todayCount: 29100, errorCount: 28 },
    { name: 'Giám định tư pháp', category: 'Thu thập số liệu thống kê', todayCount: 8200, errorCount: 11 },
    { name: 'Đấu giá tài sản', category: 'Thu thập số liệu thống kê', todayCount: 18400, errorCount: 21 },
    { name: 'Trọng tài thương mại', category: 'Thu thập số liệu thống kê', todayCount: 10700, errorCount: 13 },
    { name: 'Hòa giải thương mại', category: 'Thu thập số liệu thống kê', todayCount: 8200, errorCount: 10 },
    { name: 'Quản lý thanh lý tài sản', category: 'Thu thập số liệu thống kê', todayCount: 13100, errorCount: 16 },
    { name: 'Tương trợ tư pháp', category: 'Thu thập số liệu thống kê', todayCount: 10900, errorCount: 14 },
  ];

  // Chart data matching stats totals
  const chartData = stats.slice(0, 10).map((stat, index) => {
    const shortNames = ['Xây dựng VBQPPL', 'Kiểm tra VBQPPL', 'Rà soát VBQPPL', 'TC và người PCT', 'PB, GD pháp luật', 'Hòa giải cơ sở', 'Chuẩn TC PL', 'Hộ tịch', 'Chứng thực', 'Lý lịch TP'];
    return {
      name: shortNames[index],
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

      {/* Stats Grid - 21 cards in 4 columns */}
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
                      <span className="text-xl font-semibold text-slate-700">{stat.value}</span>
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
          <h3 className="text-slate-900">Biểu đồ thu thập dữ liệu theo phương thức thu thập</h3>
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
=======
import { useState } from 'react';
import { GenericProcessingPage } from '../processing/GenericProcessingPage';
import { FileText, FileCheck, FileSearch, Users, BookOpen, MessageSquare, Scale, UserCheck, Stamp, FileBarChart, ClipboardList, Briefcase, Eye, Gavel, Package, Shield } from 'lucide-react';
import { DatabaseTemplate } from '../DatabaseTemplate';

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

interface StatisticsCollectionPageProps {
  mode?: 'thu thập' | 'xử lý';
  context?: 'thu thập' | 'chia sẻ';
  onBack?: () => void;
}

export function StatisticsCollectionPage({ mode = 'thu thập', context = 'thu thập', onBack }: StatisticsCollectionPageProps) {
  
  // Generate realistic random data for Statistics Collection (21 types)
  const generateData = () => {
    const data = [
      { id: '1', title: 'Xây dựng văn bản quy phạm pháp luật', icon: FileText, color: 'blue', lastMonth: 856234, thisMonth: 989123 },
      { id: '2', title: 'Kiểm tra văn bản quy phạm pháp luật', icon: FileCheck, color: 'green', lastMonth: 945678, thisMonth: 1078456 },
      { id: '3', title: 'Rà soát văn bản quy phạm pháp luật', icon: FileSearch, color: 'purple', lastMonth: 823456, thisMonth: 956789 },
      { id: '4', title: 'Tổ chức và người làm công tác pháp chế', icon: Users, color: 'orange', lastMonth: 678234, thisMonth: 789456 },
      { id: '5', title: 'Phổ biến, giáo dục pháp luật', icon: BookOpen, color: 'blue', lastMonth: 1234567, thisMonth: 1456789 },
      { id: '6', title: 'Hòa giải ở cơ sở', icon: MessageSquare, color: 'green', lastMonth: 567890, thisMonth: 678901 },
      { id: '7', title: 'Chuẩn tiếp cận pháp luật', icon: Scale, color: 'purple', lastMonth: 445678, thisMonth: 534567 },
      { id: '8', title: 'Hộ tịch', icon: UserCheck, color: 'orange', lastMonth: 2345678, thisMonth: 2789012 },
      { id: '9', title: 'Chứng thực', icon: Stamp, color: 'blue', lastMonth: 1789234, thisMonth: 2123456 },
      { id: '10', title: 'Lý lịch tư pháp', icon: FileBarChart, color: 'green', lastMonth: 987654, thisMonth: 1156789 },
      { id: '11', title: 'Nuôi con nuôi', icon: Users, color: 'purple', lastMonth: 234567, thisMonth: 278901 },
      { id: '12', title: 'Trợ giúp pháp lý', icon: MessageSquare, color: 'orange', lastMonth: 678901, thisMonth: 789123 },
      { id: '13', title: 'Đăng ký giao dịch bảo đảm', icon: ClipboardList, color: 'blue', lastMonth: 1456789, thisMonth: 1678901 },
      { id: '14', title: 'Luật sư', icon: Briefcase, color: 'green', lastMonth: 567890, thisMonth: 645678 },
      { id: '15', title: 'Công chứng', icon: Stamp, color: 'purple', lastMonth: 1234567, thisMonth: 1456789 },
      { id: '16', title: 'Giám định tư pháp', icon: Eye, color: 'orange', lastMonth: 345678, thisMonth: 412345 },
      { id: '17', title: 'Đấu giá tài sản', icon: Gavel, color: 'blue', lastMonth: 789012, thisMonth: 923456 },
      { id: '18', title: 'Trọng tài thương mại', icon: Scale, color: 'green', lastMonth: 456789, thisMonth: 534567 },
      { id: '19', title: 'Hòa giải thương mại', icon: MessageSquare, color: 'purple', lastMonth: 345678, thisMonth: 412345 },
      { id: '20', title: 'Quản lý thanh lý tài sản', icon: Package, color: 'orange', lastMonth: 567890, thisMonth: 656789 },
      { id: '21', title: 'Tương trợ tư pháp', icon: Shield, color: 'blue', lastMonth: 456789, thisMonth: 545678 },
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
    return <GenericProcessingPage systemName="Thu thập số liệu thống kê" datasets={stats.map((s, idx) => ({ id: s.id || `item_${idx}`, name: s.title }))} />;
  }

  return (
    <DatabaseTemplate
      title="Dữ liệu Thu thập số liệu thống kê"
      categoryName="Thống kê"
      stats={stats}
      context={context}
      mode={mode}
      onBack={onBack}
    />
  );
}
>>>>>>> 1ef59be8901e26f1d3cdfabc99b7b73ccdd290c9
