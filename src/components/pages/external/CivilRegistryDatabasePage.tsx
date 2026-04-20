import * as React from 'react';
import { useState } from 'react';
import { Calendar, Download, FileUser, UserCheck, Users, Baby, Heart, UserX, UsersRound, FileEdit, BarChart3, FileCheck, FileX, X, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { DataDetailModal } from '../../DataDetailModal';
import { MarriageDetailModal } from '../../MarriageDetailModal';
import { MaritalStatusCertModal } from '../../MaritalStatusCertModal';
import { DeathCertModal } from '../../DeathCertModal';
import { ParentChildRecognitionModal } from '../../ParentChildRecognitionModal';
import { AdoptionCertModal } from '../../AdoptionCertModal';
import { GuardianshipCertModal } from '../../GuardianshipCertModal';
import { TerminationGuardianshipCertModal } from '../../TerminationGuardianshipCertModal';
import { CivilRegistryChangeModal } from '../../CivilRegistryChangeModal';
import { GuardianshipMonitoringModal } from '../../GuardianshipMonitoringModal';
import { TerminationGuardianshipMonitoringModal } from '../../TerminationGuardianshipMonitoringModal';

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
  collected?: number; // Đã thu thập
  processed?: number; // Đã xử lý
  shared?: number; // Đã chia sẻ
}

interface DatabaseRecord {
  name: string;
  category: string;
  todayCount: number;
  errorCount: number;
}

interface CivilRegistryDatabasePageProps {
  mode?: 'thu thập' | 'xử lý';
  context?: 'thu thập' | 'chia sẻ';
}

export function CivilRegistryDatabasePage({ mode = 'thu thập', context = 'thu thập' }: CivilRegistryDatabasePageProps) {
  const [dateRange, setDateRange] = useState('01/01/2024 - 30/04/2024');
  const [selectedStat, setSelectedStat] = useState<StatCard | null>(null);

  // Generate realistic random data
  const generateData = () => {
    const data = [
      { id: '1', title: 'Hồ sơ khai sinh', icon: Baby, color: 'blue', lastMonth: 1245, thisMonth: 2179, collected: 3090, processed: 2987, shared: 2490 },
      { id: '2', title: 'Hồ sơ đăng ký kết hôn', icon: Heart, color: 'green', lastMonth: 1678543, thisMonth: 1746447, collected: 4567, processed: 4321, shared: 3890 },
      { id: '3', title: 'Hồ sơ cấp GĐKN kết hôn', icon: FileCheck, color: 'purple', lastMonth: 1598234, thisMonth: 1826644, collected: 5234, processed: 5011, shared: 4756 },
      { id: '4', title: 'Hồ sơ đăng ký khai tử', icon: FileX, color: 'orange', lastMonth: 1612345, thisMonth: 1812533, collected: 2876, processed: 2654, shared: 2398 },
      { id: '5', title: 'Hồ sơ DK nhận cha, mẹ, con', icon: Users, color: 'blue', lastMonth: 1545678, thisMonth: 1879200, collected: 6123, processed: 5876, shared: 5432 },
      { id: '6', title: 'Hồ sơ đăng ký nuôi con nuôi', icon: UserCheck, color: 'green', lastMonth: 1687234, thisMonth: 1737644, collected: 1987, processed: 1865, shared: 1654 },
      { id: '7', title: 'Hồ sơ đăng ký giám hộ', icon: FileUser, color: 'purple', lastMonth: 2234567, thisMonth: 1190311, collected: 3456, processed: 3298, shared: 2987 },
      { id: '8', title: 'Hồ sơ DK chấm dứt giám hộ', icon: UserX, color: 'orange', lastMonth: 1723456, thisMonth: 1701422, collected: 2345, processed: 2198, shared: 1976 },
      { id: '9', title: 'Hồ sơ DK thay đổi TT hộ tịch, văn danh dự dân tộc', icon: FileEdit, color: 'blue', lastMonth: 2156789, thisMonth: 1268089, collected: 4876, processed: 4632, shared: 4123 },
      { id: '10', title: 'Hồ sơ đăng ký chấm dứt giám sát việc giám hộ', icon: FileCheck, color: 'green', lastMonth: 1934567, thisMonth: 1490311, collected: 3765, processed: 3543, shared: 3198 },
      { id: '11', title: 'Hồ sơ đăng ký giám sát việc giám hộ', icon: FileCheck, color: 'purple', lastMonth: 1456789, thisMonth: 1968089, collected: 5432, processed: 5187, shared: 4876 },
      { id: '12', title: 'Hồ sơ ly hôn/hủy kết hôn ở nước ngoài', icon: UsersRound, color: 'orange', lastMonth: 1889234, thisMonth: 1535644, collected: 2654, processed: 2487, shared: 2198 },
    ];

    return data.map(item => {
      const total = item.lastMonth + item.thisMonth;
      const change = ((item.thisMonth - item.lastMonth) / item.lastMonth * 100).toFixed(1);
      const changeStr = change.startsWith('-') ? change : `+${change}`;

      // For processing mode: calculate collected vs processed
      const totalCollected = total;
      const totalProcessed = Math.floor(total * (0.95 + Math.random() * 0.04)); // 95-99% processed
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
        collected: item.collected,
        processed: item.processed,
        shared: item.shared,
      };
    });
  };

  const stats = generateData();

  const tableData: DatabaseRecord[] = [
    { name: 'Hồ sơ khai sinh', category: 'Hộ tịch điện tử', todayCount: 20000, errorCount: 30 },
    { name: 'Hồ sơ đăng ký kết hôn', category: 'Hộ tịch điện tử', todayCount: 20000, errorCount: 30 },
    { name: 'Hồ sơ cấp Giấy ĐKKN kết hôn trong hồn nhân', category: 'Hộ tịch điện tử', todayCount: 20000, errorCount: 30 },
    { name: 'Hồ sơ đăng ký ly khai tử', category: 'Hộ tịch điện tử', todayCount: 20000, errorCount: 30 },
    { name: 'Hồ sơ đăng ký nhận cha, mẹ, con', category: 'Hộ tịch điện tử', todayCount: 20000, errorCount: 30 },
  ];

  // Chart data matching stats totals (scaled down for visualization)
  const chartData = stats.map((stat, index) => {
    const names = ['Khai sinh', 'Kết hôn', 'Cấp GĐKN', 'Khai tử', 'Nhận cha, mẹ, con', 'Nuôi con nuôi', 'Giám hộ', 'Chấm dứt GH', 'Thay đổi TT', 'Kiểm sát GH', 'Giám sát GH', 'Ly hôn/hủy KH NN'];
    // Use real numbers from stats - no scaling
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
        <h2 className="text-slate-900">Danh sách dữ liệu đã {context}</h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={dateRange}
            title="Khoảng thời gian dữ liệu"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50"
            title="Chọn ngày"
          >
            <Calendar className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Stats Grid - 3 rows x 4 cols */}
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

                  {/* Conditional rendering based on context */}
                  {context === 'chia sẻ' ? (
                    // Hiển thị số liệu thu thập/xử lý/chia sẻ cho context "chia sẻ"
                    <div className="space-y-1">
                      <div className="text-xs text-slate-500">
                        Số liệu đã thu thập/xử lý/chia sẻ
                      </div>
                      <div className="text-sm font-medium text-slate-700">
                        {stat.collected?.toLocaleString()}/{stat.processed?.toLocaleString()}/{stat.shared?.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>
                          Tỉ lệ xử lý: {stat.processed && stat.collected ?
                            ((stat.processed / stat.collected) * 100).toFixed(1) : '0'}%
                        </span>
                        <span className="text-slate-300">|</span>
                        <span>
                          Tỉ lệ chia sẻ: {stat.shared && stat.processed ?
                            ((stat.shared / stat.processed) * 100).toFixed(1) : '0'}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* \"Số liệu đã thu thập/xử lý\" text */}
                      <div className="text-xs text-slate-500 mb-2">
                        Số liệu đã thu thập
                      </div>
                      {/* Number display - different format based on mode */}
                      {mode === 'xử lý' ? (
                        <div className="flex flex-col gap-1">
                          {/* Numbers on first line */}
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
                          {/* Change on second line */}
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
                    </>
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
          <h3 className="text-slate-900">Biểu đồ {context} dữ liệu</h3>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Tổng số: 100</span>
          </div>
        </div>

        {/* Month Filter */}
        <div className="mb-6">
          <select
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Lọc theo thời gian"
          >
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
            {[0, 500000, 1000000, 1500000, 2000000, 2500000, 3000000, 3500000].map((value) => {
              const maxValue = 3500000;
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
              const maxValue = 3500000;
              const totalValue = data.lastMonth + data.thisMonth;
              const totalPercent = (totalValue / maxValue) * 100;
              const lastMonthPercent = (data.lastMonth / maxValue) * 100;
              const thisMonthPercent = (data.thisMonth / maxValue) * 100;

              return (
                <div key={index} className="flex-1 flex flex-col items-center relative h-full">
                  <div className="w-full flex flex-col items-center justify-end h-full">
                    {/* Stacked bar container */}
                    <div className={`w-full max-w-[50px] flex flex-col relative min-h-[8px] h-[${totalPercent}%]`}>
                      {/* This Month (Orange) - Top portion */}
                      <div className={`relative flex flex-col items-center h-[${(thisMonthPercent / totalPercent) * 100}%]`}>
                        {data.thisMonth > 0 && (
                          <>
                            <span className="absolute -top-6 text-xs font-semibold text-slate-700 whitespace-nowrap">
                              {data.thisMonth.toLocaleString()}
                            </span>
                            <div
                              className="w-full bg-orange-400 h-full min-h-[4px]"
                            />
                          </>
                        )}
                      </div>

                      {/* Last Month (Blue) - Bottom portion */}
                      <div className="relative flex flex-col items-center flex-1">
                        {data.lastMonth > 0 && (
                          <>
                            <div
                              className="w-full bg-blue-400 h-full min-h-[4px]"
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
            <span className="text-slate-600">Số lượng bản ghi đã {mode} tháng trước</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-400 rounded"></div>
            <span className="text-slate-600">Số lượng bản ghi đã {mode} tháng này</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-slate-900">Danh sách CSDL {mode}</h3>
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
      {selectedStat && selectedStat.id === '2' && (
        <MarriageDetailModal
          isOpen={true}
          onClose={() => setSelectedStat(null)}
          title={selectedStat.title}
          totalRecords={selectedStat.lastMonth + selectedStat.thisMonth}
          newRecords={selectedStat.thisMonth}
          updatedRecords={Math.floor(selectedStat.thisMonth * 0.2)}
          errorRecords={Math.floor(selectedStat.thisMonth * 0.05)}
        />
      )}

      {selectedStat && selectedStat.id === '3' && (
        <MaritalStatusCertModal
          isOpen={true}
          onClose={() => setSelectedStat(null)}
          title={selectedStat.title}
          totalRecords={selectedStat.lastMonth + selectedStat.thisMonth}
          newRecords={selectedStat.thisMonth}
          updatedRecords={Math.floor(selectedStat.thisMonth * 0.2)}
          errorRecords={Math.floor(selectedStat.thisMonth * 0.05)}
        />
      )}

      {selectedStat && selectedStat.id === '4' && (
        <DeathCertModal
          isOpen={true}
          onClose={() => setSelectedStat(null)}
          title={selectedStat.title}
          totalRecords={selectedStat.lastMonth + selectedStat.thisMonth}
          newRecords={selectedStat.thisMonth}
          updatedRecords={Math.floor(selectedStat.thisMonth * 0.2)}
          errorRecords={Math.floor(selectedStat.thisMonth * 0.05)}
        />
      )}

      {selectedStat && selectedStat.id === '5' && (
        <ParentChildRecognitionModal
          isOpen={true}
          onClose={() => setSelectedStat(null)}
          title={selectedStat.title}
          totalRecords={selectedStat.lastMonth + selectedStat.thisMonth}
          newRecords={selectedStat.thisMonth}
          updatedRecords={Math.floor(selectedStat.thisMonth * 0.2)}
          errorRecords={Math.floor(selectedStat.thisMonth * 0.05)}
        />
      )}

      {selectedStat && selectedStat.id === '6' && (
        <AdoptionCertModal
          isOpen={true}
          onClose={() => setSelectedStat(null)}
          title={selectedStat.title}
          totalRecords={selectedStat.lastMonth + selectedStat.thisMonth}
          newRecords={selectedStat.thisMonth}
          updatedRecords={Math.floor(selectedStat.thisMonth * 0.2)}
          errorRecords={Math.floor(selectedStat.thisMonth * 0.05)}
        />
      )}

      {selectedStat && selectedStat.id === '7' && (
        <GuardianshipCertModal
          isOpen={true}
          onClose={() => setSelectedStat(null)}
          title={selectedStat.title}
          totalRecords={selectedStat.lastMonth + selectedStat.thisMonth}
          newRecords={selectedStat.thisMonth}
          updatedRecords={Math.floor(selectedStat.thisMonth * 0.2)}
          errorRecords={Math.floor(selectedStat.thisMonth * 0.05)}
        />
      )}

      {selectedStat && selectedStat.id === '8' && (
        <TerminationGuardianshipCertModal
          isOpen={true}
          onClose={() => setSelectedStat(null)}
          title={selectedStat.title}
          totalRecords={selectedStat.lastMonth + selectedStat.thisMonth}
          newRecords={selectedStat.thisMonth}
          updatedRecords={Math.floor(selectedStat.thisMonth * 0.2)}
          errorRecords={Math.floor(selectedStat.thisMonth * 0.05)}
        />
      )}

      {selectedStat && selectedStat.id === '9' && (
        <CivilRegistryChangeModal
          isOpen={true}
          onClose={() => setSelectedStat(null)}
          title={selectedStat.title}
          totalRecords={selectedStat.lastMonth + selectedStat.thisMonth}
          newRecords={selectedStat.thisMonth}
          updatedRecords={Math.floor(selectedStat.thisMonth * 0.2)}
          errorRecords={Math.floor(selectedStat.thisMonth * 0.05)}
        />
      )}

      {selectedStat && selectedStat.id === '10' && (
        <TerminationGuardianshipMonitoringModal
          isOpen={true}
          onClose={() => setSelectedStat(null)}
          title={selectedStat.title}
          totalRecords={selectedStat.lastMonth + selectedStat.thisMonth}
          newRecords={selectedStat.thisMonth}
          updatedRecords={Math.floor(selectedStat.thisMonth * 0.2)}
          errorRecords={Math.floor(selectedStat.thisMonth * 0.05)}
        />
      )}
      
      {selectedStat && selectedStat.id === '11' && (
        <GuardianshipMonitoringModal
          isOpen={true}
          onClose={() => setSelectedStat(null)}
          title={selectedStat.title}
          totalRecords={selectedStat.lastMonth + selectedStat.thisMonth}
          newRecords={selectedStat.thisMonth}
          updatedRecords={Math.floor(selectedStat.thisMonth * 0.2)}
          errorRecords={Math.floor(selectedStat.thisMonth * 0.05)}
        />
      )}

      {selectedStat && selectedStat.id !== '2' && selectedStat.id !== '3' && selectedStat.id !== '4' && selectedStat.id !== '5' && selectedStat.id !== '6' && selectedStat.id !== '7' && selectedStat.id !== '8' && selectedStat.id !== '9' && selectedStat.id !== '10' && selectedStat.id !== '11' && (
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