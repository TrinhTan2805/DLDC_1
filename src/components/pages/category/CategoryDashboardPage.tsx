import React, { useState } from 'react';
import {
  FolderTree,
  Database,
  Activity,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileText,
  Users,
  ChevronRight
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const PieChartAny = PieChart as any;
const PieAny = Pie as any;
const CellAny = Cell as any;
const BarChartAny = BarChart as any;
const BarAny = Bar as any;
const XAxisAny = XAxis as any;
const YAxisAny = YAxis as any;
const CartesianGridAny = CartesianGrid as any;
const TooltipAny = Tooltip as any;
const LegendAny = Legend as any;
const ResponsiveContainerAny = ResponsiveContainer as any;


export function CategoryDashboardPage() {
  // Mock Data cho Dashboard
  const stats = {
    totalCategories: 124,
    activeCategories: 110,
    pendingApprovals: 5,
    systemsConnected: 32
  };

  const categoryTypeData = [
    { name: 'Danh mục tiêu chuẩn', value: 45, color: '#3b82f6' }, // blue-500
    { name: 'Danh mục tham chiếu', value: 50, color: '#8b5cf6' }, // violet-500
    { name: 'Danh mục hệ thống', value: 29, color: '#f59e0b' }    // amber-500
  ];

  const activityData = [
    { month: 'Tháng 1', new: 12, updated: 25 },
    { month: 'Tháng 2', new: 19, updated: 30 },
    { month: 'Tháng 3', new: 15, updated: 22 },
    { month: 'Tháng 4', new: 22, updated: 45 },
    { month: 'Tháng 5', new: 30, updated: 50 },
    { month: 'Tháng 6', new: 10, updated: 18 }
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'Cập nhật danh mục',
      target: 'Danh mục Phòng Công chứng nhà nước',
      user: 'admin_tudien',
      time: '10 phút trước',
      status: 'success'
    },
    {
      id: 2,
      action: 'Trình duyệt cấu trúc',
      target: 'Danh mục Hộ tịch điện tử',
      user: 'hoangnh_btp',
      time: '1 giờ trước',
      status: 'pending'
    },
    {
      id: 3,
      action: 'Tạo mới danh mục',
      target: 'Danh mục Cán bộ tư pháp',
      user: 'nguyenvana',
      time: '3 giờ trước',
      status: 'success'
    },
    {
      id: 4,
      action: 'Hủy công khai',
      target: 'Danh mục Quốc gia cũ',
      user: 'system_auto',
      time: '1 ngày trước',
      status: 'warning'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tổng quan danh mục dùng chung</h1>
          <p className="text-sm text-slate-500 mt-1">
            Giám sát số liệu và hoạt động quản trị danh mục dùng chung
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <FolderTree className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <TrendingUp className="w-4 h-4" /> +12%
            </span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{stats.totalCategories}</h3>
          <p className="text-sm font-medium text-slate-500 mt-1">Tổng số danh mục</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{stats.activeCategories}</h3>
          <p className="text-sm font-medium text-slate-500 mt-1">Danh mục đang hoạt động</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{stats.pendingApprovals}</h3>
          <p className="text-sm font-medium text-slate-500 mt-1">Yêu cầu chờ phê duyệt</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{stats.systemsConnected}</h3>
          <p className="text-sm font-medium text-slate-500 mt-1">Hệ thống đang khai thác</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-1">
          <h3 className="text-base font-semibold text-slate-800 mb-6">Cơ cấu loại danh mục</h3>
          <div className="h-[300px]">
            <ResponsiveContainerAny width="100%" height={300}>
              <PieChartAny>
                <PieAny
                  data={categoryTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryTypeData.map((entry, index) => (
                    <CellAny key={`cell-${index}`} fill={entry.color} />
                  ))}
                </PieAny>
                <TooltipAny 
                  formatter={(value: any) => [`${value} danh mục`, 'Số lượng']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <LegendAny verticalAlign="bottom" height={36} iconType="circle" />
              </PieChartAny>
            </ResponsiveContainerAny>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
          <h3 className="text-base font-semibold text-slate-800 mb-6">Tần suất cập nhật & Tạo mới (6 tháng)</h3>
          <div className="h-[300px]">
            <ResponsiveContainerAny width="100%" height={300}>
              <BarChartAny
                data={activityData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGridAny strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxisAny dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                <YAxisAny axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <TooltipAny
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <LegendAny wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                <BarAny dataKey="new" name="Tạo mới" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                <BarAny dataKey="updated" name="Cập nhật" stackId="a" fill="#93c5fd" radius={[4, 4, 0, 0]} />
              </BarChartAny>
            </ResponsiveContainerAny>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-800">Hoạt động gần đây</h3>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
            Xem tất cả <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                activity.status === 'success' ? 'bg-emerald-100 text-emerald-600' :
                activity.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                'bg-slate-100 text-slate-600'
              }`}>
                <Activity className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {activity.action}: <span className="font-semibold">{activity.target}</span>
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Users className="w-3.5 h-3.5" />
                    {activity.user}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {activity.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
