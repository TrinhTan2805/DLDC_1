import React, { useState } from 'react';
import { Database, CheckCircle, XCircle, Clock, FileCheck, TrendingUp, Activity, Server, Zap, Search, Download, Plus, Eye, Edit2, Trash2, Play, Pause, Settings, FileText } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AddDataSourceForm } from './AddDataSourceForm';
import { StatusTag } from '../common/StatusTag';

// Data for Dashboard Charts
const collectionByDay = [
  { day: 'T2', count: 1240 },
  { day: 'T3', count: 1380 },
  { day: 'T4', count: 1150 },
  { day: 'T5', count: 1420 },
  { day: 'T6', count: 1560 },
  { day: 'T7', count: 890 },
  { day: 'CN', count: 650 },
];

const collectionBySource = [
  { name: 'Hộ tịch', value: 3240, color: '#3B82F6' },
  { name: 'THADS', value: 2180, color: '#10B981' },
  { name: 'Công chứng', value: 1850, color: '#F59E0B' },
  { name: 'GDBĐ', value: 1420, color: '#8B5CF6' },
  { name: 'Khác', value: 980, color: '#EC4899' },
];

const methodPerformance = [
  { method: 'API REST', success: 95, failed: 5 },
  { method: 'SFTP', success: 88, failed: 12 },
  { method: 'Upload File', success: 92, failed: 8 },
  { method: 'Database', success: 85, failed: 15 },
];

const trendData = [
  { date: '01/12', records: 850 },
  { date: '02/12', records: 920 },
  { date: '03/12', records: 880 },
  { date: '04/12', records: 1050 },
  { date: '05/12', records: 1120 },
  { date: '06/12', records: 1280 },
  { date: '07/12', records: 1150 },
  { date: '08/12', records: 1380 },
];

const apiStatusData = [
  { name: 'Hoạt động', value: 18, color: '#10B981' },
  { name: 'Dừng', value: 3, color: '#EF4444' },
  { name: 'Bảo trì', value: 2, color: '#F59E0B' },
];

// API Methods Data
interface APIMethod {
  id: number;
  name: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status: 'active' | 'inactive' | 'maintenance';
  frequency: string;
  lastCall: string;
  successRate: number;
  avgResponseTime: string;
  totalCalls: number;
}

const apiMethods: APIMethod[] = [
  { id: 1, name: 'API Hộ tịch - Khai sinh', endpoint: '/api/v1/ho-tich/khai-sinh', method: 'GET', status: 'active', frequency: 'Hằng ngày', lastCall: '5 phút trước', successRate: 98.5, avgResponseTime: '120ms', totalCalls: 15420 },
  { id: 2, name: 'API Hộ tịch - Kết hôn', endpoint: '/api/v1/ho-tich/ket-hon', method: 'GET', status: 'active', frequency: 'Hằng ngày', lastCall: '10 phút trước', successRate: 97.2, avgResponseTime: '135ms', totalCalls: 12380 },
  { id: 3, name: 'API THADS - Án dân sự', endpoint: '/api/v1/thads/an-dan-su', method: 'POST', status: 'active', frequency: 'Hằng ngày', lastCall: '15 phút trước', successRate: 96.8, avgResponseTime: '180ms', totalCalls: 8920 },
  { id: 4, name: 'API Công chứng - Hợp đồng', endpoint: '/api/v1/cong-chung/hop-dong', method: 'GET', status: 'active', frequency: 'Hằng ngày', lastCall: '20 phút trước', successRate: 95.4, avgResponseTime: '150ms', totalCalls: 11250 },
  { id: 5, name: 'API GDBĐ - Đăng ký', endpoint: '/api/v1/gdbd/dang-ky', method: 'GET', status: 'maintenance', frequency: 'Hằng ngày', lastCall: '2 giờ trước', successRate: 94.1, avgResponseTime: '165ms', totalCalls: 7680 },
  { id: 6, name: 'API Quốc tịch', endpoint: '/api/v1/quoc-tich', method: 'GET', status: 'active', frequency: 'Hằng tuần', lastCall: '1 giờ trước', successRate: 99.2, avgResponseTime: '95ms', totalCalls: 3450 },
  { id: 7, name: 'API Chứng thực', endpoint: '/api/v1/chung-thuc', method: 'POST', status: 'inactive', frequency: 'Hằng ngày', lastCall: '1 ngày trước', successRate: 92.3, avgResponseTime: '210ms', totalCalls: 5890 },
  { id: 8, name: 'API Bổ trợ tư pháp', endpoint: '/api/v1/bo-tro-tu-phap', method: 'GET', status: 'active', frequency: 'Hằng tuần', lastCall: '30 phút trước', successRate: 97.8, avgResponseTime: '125ms', totalCalls: 4320 },
];

// Data Collection List
interface DataItem {
  id: number;
  stt: number;
  department: string;
  dataName: string;
  dataType: string;
  description: string;
  frequency: string;
  format: string;
  status: 'collected' | 'pending' | 'not-started';
  priority: 'high' | 'medium' | 'low';
  lastUpdate: string;
}

const dataCollectionList: DataItem[] = [
  { id: 1, stt: 1, department: 'Đơn vị A', dataName: 'CSDL A', dataType: 'Biên tập danh mục A', description: 'Mô tả dữ liệu A', frequency: 'Hằng ngày', format: 'JSON', status: 'collected', priority: 'high', lastUpdate: '06/12/2025' },
  { id: 2, stt: 2, department: 'Đơn vị B', dataName: 'Hệ thống B', dataType: 'Danh mục B', description: 'Mô tả dữ liệu B', frequency: 'Hằng ngày', format: 'JSON', status: 'collected', priority: 'high', lastUpdate: '06/12/2025' },
  { id: 3, stt: 3, department: 'Đơn vị C', dataName: 'CSDL C', dataType: 'Danh mục C', description: 'Mô tả dữ liệu C', frequency: 'Hằng ngày', format: 'JSON', status: 'collected', priority: 'high', lastUpdate: '06/12/2025' },
];

export function OverviewCombined() {
  const [searchAPI, setSearchAPI] = useState('');
  const [searchData, setSearchData] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // If showing add form, render it instead of overview
  if (showAddForm) {
    return <AddDataSourceForm onBack={() => setShowAddForm(false)} />;
  }

  const filteredAPIs = apiMethods.filter(api => {
    const matchSearch = searchAPI === '' ||
      api.name.toLowerCase().includes(searchAPI.toLowerCase()) ||
      api.endpoint.toLowerCase().includes(searchAPI.toLowerCase());
    const matchStatus = filterStatus === '' || api.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const filteredData = dataCollectionList.filter(item => {
    return searchData === '' ||
      item.dataName.toLowerCase().includes(searchData.toLowerCase()) ||
      item.department.toLowerCase().includes(searchData.toLowerCase());
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <StatusTag label="Hoạt động" variant="green" />;
      case 'inactive':
        return <StatusTag label="Dừng" variant="slate" />;
      case 'maintenance':
        return <StatusTag label="Bảo trì" variant="orange" />;
      default:
        return null;
    }
  };

  const getMethodBadge = (method: string) => {
    const variants: Record<string, 'blue' | 'green' | 'orange' | 'red'> = {
      'GET': 'blue',
      'POST': 'green',
      'PUT': 'orange',
      'DELETE': 'red',
    };
    return <StatusTag label={method} variant={variants[method]} />;
  };

  const getDataStatusBadge = (status: string) => {
    switch (status) {
      case 'collected':
        return <StatusTag label="Đã thu thập" variant="green" />;
      case 'pending':
        return <StatusTag label="Đang xử lý" variant="orange" />;
      case 'not-started':
        return <StatusTag label="Chưa bắt đầu" variant="slate" />;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="px-3 py-1 rounded-full text-base bg-red-100 text-red-700">Cao</span>;
      case 'medium':
        return <span className="px-3 py-1 rounded-full text-base bg-yellow-100 text-yellow-700">Trung bình</span>;
      case 'low':
        return <span className="px-3 py-1 rounded-full text-base bg-blue-100 text-blue-700">Thấp</span>;
      default:
        return null;
    }
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
    <div className="space-y-8">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">Tổng quan Thu thập Dữ liệu</h2>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Thêm nguồn dữ liệu
        </button>
      </div>

      {/* ========== SECTION 1: TỔNG QUAN ========== */}
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-slate-500 text-base">Tổng nguồn</p>
            </div>
            <p className="text-base font-semibold text-slate-900">24</p>
            <p className="text-base text-green-600 mt-1">+2 so với tháng trước</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-50 p-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-slate-500 text-base">Thành công</p>
            </div>
            <p className="text-base font-semibold text-green-600">18</p>
            <p className="text-base text-green-600 mt-1">75% tỷ lệ thành công</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-orange-50 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-slate-500 text-base">Đang xử lý</p>
            </div>
            <p className="text-base font-semibold text-orange-600">4</p>
            <p className="text-base text-slate-500 mt-1">Đồng bộ trong 24h</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-red-50 p-2 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-slate-500 text-base">Lỗi</p>
            </div>
            <p className="text-base font-semibold text-red-600">2</p>
            <p className="text-base text-red-600 mt-1">Cần xử lý ngay</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-50 p-2 rounded-lg">
                <FileCheck className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-slate-500 text-base">Hôm nay</p>
            </div>
            <p className="text-base font-semibold text-purple-600">45,678</p>
            <p className="text-base text-green-600 mt-1">+12.5% so với hôm qua</p>
          </div>
        </div>

        {/* Charts Grid - 2x2 Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Collection by Day */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Thu thập theo ngày trong tuần</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={collectionByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" name="Số lượng" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Collection by Source */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Phân bổ theo nguồn dữ liệu</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={collectionBySource}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {collectionBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Trend Data */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Xu hướng thu thập 7 ngày qua</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="records" stroke="#8B5CF6" strokeWidth={2} name="Bản ghi" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* API Status */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Trạng thái API</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={apiStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {apiStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-200"></div>

      {/* ========== SECTION 2: QUẢN LÝ PHƯƠNG THỨC ========== */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Server className="w-6 h-6 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">Quản lý Phương thức Thu thập</h2>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input aria-label="Input field"
              type="text"
              placeholder="Tìm kiếm API theo tên hoặc endpoint..."
              value={searchAPI}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchAPI(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select aria-label="Select box"
            title="Bộ lọc trạng thái"
            value={filterStatus}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Dừng</option>
            <option value="maintenance">Bảo trì</option>
          </select>
        </div>

        {/* API Methods Table */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-base font-semibold text-slate-500 whitespace-nowrap">TÊN API</th>
                  <th className="px-4 py-3 text-left text-base font-semibold text-slate-500 whitespace-nowrap">ENDPOINT</th>
                  <th className="px-4 py-3 text-left text-base font-semibold text-slate-500 whitespace-nowrap">PHƯƠNG THỨC</th>
                  <th className="px-4 py-3 text-left text-base font-semibold text-slate-500 whitespace-nowrap">TRẠNG THÁI</th>
                  <th className="px-4 py-3 text-left text-base font-semibold text-slate-500 whitespace-nowrap">TỶ LỆ TC</th>
                  <th className="px-4 py-3 text-left text-base font-semibold text-slate-500 whitespace-nowrap">THỜI GIAN</th>
                  <th className="px-4 py-3 text-left text-base font-semibold text-slate-500 whitespace-nowrap">TỔNG CALLS</th>
                  <th className="px-4 py-3 text-left text-base font-semibold text-slate-500 whitespace-nowrap">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredAPIs.map((api) => (
                  <tr key={api.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-base text-slate-900 font-medium">{api.name}</p>
                        <p className="text-base text-slate-500 mt-1">{api.frequency} • {api.lastCall}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-base text-slate-700 font-mono">{api.endpoint}</td>
                    <td className="px-4 py-3">{getMethodBadge(api.method)}</td>
                    <td className="px-4 py-3">{getStatusBadge(api.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2 w-16">
                          <div
                            className={`h-2 rounded-full ${api.successRate >= 95 ? 'bg-green-500' : api.successRate >= 90 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${api.successRate}%` }}
                          ></div>
                        </div>
                        <span className="text-base text-slate-700">{api.successRate}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-base text-slate-700">{api.avgResponseTime}</td>
                    <td className="px-4 py-3 text-base text-slate-700">{api.totalCalls.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button title="Bắt đầu" className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Play className="w-4 h-4" />
                        </button>
                        <button title="Xem" className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button title="Cài đặt" className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}