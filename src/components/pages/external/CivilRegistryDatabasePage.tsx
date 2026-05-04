import * as React from 'react';
import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { Calendar, Download, FileUser, UserCheck, Users, Baby, Heart, UserX, UsersRound, FileEdit, FileCheck, FileX, ChevronLeft, Search, ArrowUpRight } from 'lucide-react';
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
  collected?: number;
  processed?: number;
  shared?: number;
}

interface CivilRegistryDatabasePageProps {
  mode?: 'thu thập' | 'xử lý';
  context?: 'thu thập' | 'chia sẻ';
  onBack?: () => void;
}

export function CivilRegistryDatabasePage({ mode = 'thu thập', context = 'thu thập', onBack }: CivilRegistryDatabasePageProps) {
  const [selectedStat, setSelectedStat] = useState<StatCard | null>(null);
  const [activeTab, setActiveTab] = useState<'records' | 'history'>('records');
  const [timeFilter, setTimeFilter] = useState<'thisMonth' | 'lastMonth' | '3months' | '6months'>('thisMonth');

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
        collected: item.collected,
        processed: item.processed,
        shared: item.shared,
      };
    });
  };

  const stats = useMemo(() => generateData(), []);

  const chartData = useMemo(() => {
    const shortNames: Record<string, string> = {
      'Hồ sơ khai sinh': 'Khai sinh',
      'Hồ sơ đăng ký kết hôn': 'Kết hôn',
      'Hồ sơ cấp GĐKN kết hôn': 'Cấp GĐKN',
      'Hồ sơ đăng ký khai tử': 'Khai tử',
      'Hồ sơ DK nhận cha, mẹ, con': 'Nhận cha, mẹ, con',
      'Hồ sơ đăng ký nuôi con nuôi': 'Nuôi con nuôi',
      'Hồ sơ đăng ký giám hộ': 'Giám hộ',
      'Hồ sơ DK chấm dứt giám hộ': 'Chấm dứt GH',
      'Hồ sơ DK thay đổi TT hộ tịch, văn danh dự dân tộc': 'Thay đổi TT',
      'Hồ sơ đăng ký chấm dứt giám sát việc giám hộ': 'Kiểm sát GH',
      'Hồ sơ đăng ký giám sát việc giám hộ': 'Giám sát GH',
      'Hồ sơ ly hôn/hủy kết hôn ở nước ngoài': 'Ly hôn/hủy KH NN',
    };

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
        name: shortNames[stat.title] || stat.title,
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
          <h2 className="text-2xl font-bold text-slate-900">Danh sách dữ liệu</h2>
          <p className="text-slate-500 text-sm mt-1">Quản lý và xem chi tiết dữ liệu hộ tịch điện tử</p>
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
        <>
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

        {/* Biểu đồ thu thập dữ liệu */}
        <div className="mt-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
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
          
          <div className="mt-8" style={{ width: '100%', height: 450 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }} barGap={0}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  interval={0} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                  dy={10}
                />
                <YAxis 
                  tickFormatter={(value) => {
                    if (value === 0) return '0';
                    return `${(value / 1000000).toFixed(1)}M`;
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
                    <div className="flex justify-center gap-8 mt-12 text-sm text-slate-600">
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
                    <td className="px-6 py-4 text-slate-600">Hộ tịch điện tử</td>
                    <td className="px-6 py-4 text-slate-600">{stat.thisMonth.toLocaleString('vi-VN').replace(/,/g, '.')}</td>
                    <td className="px-6 py-4 text-slate-600">{Math.floor(stat.thisMonth * 0.05).toLocaleString('vi-VN').replace(/,/g, '.')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-10">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
              Lịch sử hoạt động
              <span className="text-slate-400 font-medium text-lg">/ CSDL_MariaDB</span>
            </h3>
            <div className="flex items-center gap-3">
              <select className="border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[150px]">
                <option value="all">All</option>
                <option value="successful">Successful</option>
                <option value="skipped">Skipped</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="px-6 py-4 font-bold whitespace-nowrap">ID</th>
                  <th className="px-6 py-4 font-bold whitespace-nowrap">Loại</th>
                  <th className="px-6 py-4 font-bold whitespace-nowrap">Trạng thái</th>
                  <th className="px-6 py-4 font-bold whitespace-nowrap">Người tạo</th>
                  <th className="px-6 py-4 font-bold whitespace-nowrap">Thông Tin máy chủ</th>
                  <th className="px-6 py-4 font-bold whitespace-nowrap">Thời gian khởi tạo</th>
                  <th className="px-6 py-4 font-bold whitespace-nowrap text-center">#Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { id: '66102', type: 'NEW', status: 'SUCCESSFUL', creator: 'administrator', server: '1000', time: '09-10-2025 15:06:34' },
                  { id: '66101', type: 'DELETE', status: 'SUCCESSFUL', creator: 'administrator', server: '1000', time: '09-10-2025 15:05:41' },
                  { id: '66100', type: 'DELETE', status: 'SKIPPED', creator: 'administrator', server: '1000', time: '09-10-2025 15:05:05' },
                  { id: '66093', type: 'DELETE', status: 'CANCELLED', creator: 'administrator', server: '5000', time: '09-10-2025 15:04:34' },
                  { id: '66082', type: 'UPDATE', status: 'CANCELLED', creator: 'administrator', server: '1000', time: '09-10-2025 14:56:50' },
                  { id: '61149', type: 'NEW', status: 'SUCCESSFUL', creator: 'administrator', server: '1000', time: '06-10-2025 11:02:19' },
                  { id: '61148', type: 'DELETE', status: 'SUCCESSFUL', creator: 'administrator', server: '1000', time: '06-10-2025 11:01:41' }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{row.id}</td>
                    <td className="px-6 py-4 text-slate-700 font-medium">{row.type}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-black tracking-tight ${
                        row.status === 'SUCCESSFUL' ? 'bg-emerald-100 text-emerald-700' :
                        row.status === 'SKIPPED' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{row.creator}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{row.server}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{row.time}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="px-3 py-1 bg-teal-500 text-white rounded text-xs font-bold hover:bg-teal-600 transition-colors">Chi tiết</button>
                        <button className="px-3 py-1 bg-rose-500 text-white rounded text-xs font-bold hover:bg-rose-600 transition-colors">Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
            <button className="px-6 py-2 bg-slate-600 text-white rounded-lg font-bold text-sm hover:bg-slate-700 transition-colors shadow-sm">
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Specific Modals */}
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