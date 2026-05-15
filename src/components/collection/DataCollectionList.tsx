import React, { useState } from 'react';
import { Search, Download, Eye, Edit2, Trash2, Plus, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { AddDataCollectionModal } from './AddDataCollectionModal';
import { EditDataCollectionModal } from './EditDataCollectionModal';
import { ConfirmModal } from '../common/ConfirmModal';
import { DataDetailModal } from '../common/DataDetailModal';
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
  responsible: string;
}

interface ActivityLog {
  id: number;
  time: string;
  source: string;
  method: string;
  records: string;
  status: 'success' | 'error' | 'processing';
}

const dataCollectionList: DataItem[] = [
  // Đơn vị A
  { id: 1, stt: 1, department: 'Đơn vị A', dataName: 'CSDL A', dataType: 'Biên tập danh mục A', description: 'Mô tả dữ liệu A', frequency: 'Hằng ngày', format: 'JSON', status: 'collected', priority: 'high', lastUpdate: '06/12/2025', responsible: 'Người dùng A' },

  // Đơn vị B
  { id: 2, stt: 2, department: 'Đơn vị B', dataName: 'Hệ thống B', dataType: 'Danh mục B', description: 'Mô tả dữ liệu B', frequency: 'Hằng ngày', format: 'JSON', status: 'collected', priority: 'high', lastUpdate: '06/12/2025', responsible: 'Người dùng B' },

  // Đơn vị C
  { id: 3, stt: 3, department: 'Đơn vị C', dataName: 'CSDL C', dataType: 'Danh mục C', description: 'Mô tả dữ liệu C', frequency: 'Hằng ngày', format: 'JSON', status: 'collected', priority: 'high', lastUpdate: '06/12/2025', responsible: 'Người dùng C' },
];

const activityLogs: ActivityLog[] = [
  { id: 1, time: '14:28:27', source: 'Đơn vị A', method: 'API REST', records: '1,250 bản ghi', status: 'success' },
  { id: 2, time: '13:23:15', source: 'Đơn vị B', method: 'Upload File', records: '890 bản ghi', status: 'success' },
  { id: 3, time: '12:45:30', source: 'Bộ Y tế', method: 'SFTP', records: '-', status: 'error' },
  { id: 4, time: '11:15:00', source: 'Bộ Tài chính', method: 'API REST', records: '650 bản ghi', status: 'success' },
  { id: 5, time: '10:30:45', source: 'Bộ Công an', method: 'Upload File', records: '420 bản ghi', status: 'processing' },
];

// Chart data
const pieData1 = [
  { name: 'Hộ tịch', value: 35, color: '#3B82F6' },
  { name: 'THADS', value: 25, color: '#10B981' },
  { name: 'Công chứng', value: 20, color: '#F59E0B' },
  { name: 'Khác', value: 20, color: '#8B5CF6' },
];

const pieData2 = [
  { name: 'JSON', value: 60, color: '#10B981' },
  { name: 'XML', value: 25, color: '#F59E0B' },
  { name: 'CSV', value: 15, color: '#EF4444' },
];

const barData = [
  { name: 'T1', success: 450, failed: 45 },
  { name: 'T2', success: 520, failed: 38 },
  { name: 'T3', success: 480, failed: 52 },
  { name: 'T4', success: 550, failed: 42 },
  { name: 'T5', success: 510, failed: 35 },
];

const lineData = [
  { date: '01/12', hoTich: 120, thads: 85, congChung: 95 },
  { date: '02/12', hoTich: 132, thads: 92, congChung: 88 },
  { date: '03/12', hoTich: 125, thads: 88, congChung: 102 },
  { date: '04/12', hoTich: 145, thads: 95, congChung: 98 },
  { date: '05/12', hoTich: 138, thads: 102, congChung: 105 },
  { date: '06/12', hoTich: 150, thads: 98, congChung: 110 },
];

const groupedBarData = [
  { name: 'API REST', T1: 180, T2: 195, T3: 185, T4: 200, T5: 190, T6: 205 },
  { name: 'Upload', T1: 120, T2: 135, T3: 125, T4: 145, T5: 140, T6: 150 },
  { name: 'SFTP', T1: 85, T2: 92, T3: 88, T4: 95, T5: 90, T6: 98 },
  { name: 'Database', T1: 65, T2: 72, T3: 68, T4: 75, T5: 70, T6: 78 },
];

export function DataCollectionList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);

  const departments = Array.from(new Set(dataCollectionList.map(item => item.department)));

  const filteredData = dataCollectionList.filter(item => {
    const matchSearch = searchTerm === '' ||
      item.dataName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchDepartment = filterDepartment === '' || item.department === filterDepartment;
    const matchStatus = filterStatus === '' || item.status === filterStatus;
    const matchPriority = filterPriority === '' || item.priority === filterPriority;

    return matchSearch && matchDepartment && matchStatus && matchPriority;
  });

  const stats = {
    total: 24,
    success: 18,
    processing: 4,
    error: 2,
    today: 45678
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'collected':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-base bg-green-100 text-green-700">Đã thu thập</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-base bg-orange-100 text-orange-700">Đang xử lý</span>;
      case 'not-started':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-base bg-slate-100 text-slate-700">Chưa bắt đầu</span>;
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
      <div className="space-y-6 min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-50 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-slate-500 text-base">Tổng nguồn</p>
          </div>
          <p className="text-2xl text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-50 p-2 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-slate-500 text-base">Thành công</p>
          </div>
          <p className="text-2xl text-green-600">{stats.success}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-orange-50 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-slate-500 text-base">Đang xử lý</p>
          </div>
          <p className="text-2xl text-orange-600">{stats.processing}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-50 p-2 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-slate-500 text-base">Lỗi</p>
          </div>
          <p className="text-2xl text-red-600">{stats.error}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-50 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-slate-500 text-base">Hiển thị</p>
          </div>
          <p className="text-2xl text-purple-600">{stats.today.toLocaleString()}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart 1 - Phân loại theo loại dữ liệu */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-slate-900 mb-4 text-base">Phân loại theo loại dữ liệu</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData1}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData1.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Số lượng thu thập theo tháng */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-slate-900 mb-4 text-base">Số lượng thu thập theo tháng</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="success" fill="#10B981" name="Thành công" />
              <Bar dataKey="failed" fill="#EF4444" name="Thất bại" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart 2 - Định dạng dữ liệu */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-slate-900 mb-4 text-base">Phân bổ định dạng dữ liệu</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData2}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData2.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart - Xu hướng thu thập */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-slate-900 mb-4 text-base">Xu hướng thu thập theo ngày</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="hoTich" stroke="#3B82F6" name="Hộ tịch" />
              <Line type="monotone" dataKey="thads" stroke="#10B981" name="THADS" />
              <Line type="monotone" dataKey="congChung" stroke="#F59E0B" name="Công chứng" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grouped Bar Chart - Phương thức thu thập */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4 text-base">Số lượng thu thập theo phương thức và thời gian</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={groupedBarData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" />
            <Tooltip />
            <Legend />
            <Bar dataKey="T1" fill="#3B82F6" />
            <Bar dataKey="T2" fill="#10B981" />
            <Bar dataKey="T3" fill="#F59E0B" />
            <Bar dataKey="T4" fill="#8B5CF6" />
            <Bar dataKey="T5" fill="#EC4899" />
            <Bar dataKey="T6" fill="#14B8A6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input aria-label="Input field"
          type="text"
          placeholder="Tìm kiếm theo tên dữ liệu, cục, mô tả..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select aria-label="Select box"
          title="Bộ lọc Cục"
          value={filterDepartment}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterDepartment(e.target.value)}
          className="px-4 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả cục</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        <select aria-label="Select box"
          title="Bộ lọc Trạng thái"
          value={filterStatus}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="collected">Đã thu thập</option>
          <option value="pending">Đang xử lý</option>
          <option value="not-started">Chưa bắt đầu</option>
        </select>
        <select aria-label="Select box"
          title="Bộ lọc Mức độ"
          value={filterPriority}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterPriority(e.target.value)}
          className="px-4 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả mức độ</option>
          <option value="high">Cao</option>
          <option value="medium">Trung bình</option>
          <option value="low">Thấp</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <p className="text-base text-slate-600">
          Hiển thị <span>{filteredData.length}</span> / {dataCollectionList.length} dữ liệu
        </p>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-base hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            Import Excel
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-base hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            Kết xuất
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-base hover:bg-red-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Thêm dữ liệu mới
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">STT</th>
                <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">CƠ QUAN</th>
                <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">TÊN DỮ LIỆU</th>
                <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">LOẠI DỮ LIỆU</th>
                <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">TẦN SUẤT</th>
                <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">ĐỊNH DẠNG</th>
                <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">MỨC ĐỘ</th>
                <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">TRẠNG THÁI</th>
                <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">CẬP NHẬT</th>
                <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-base text-slate-900">{item.stt}</td>
                  <td className="px-4 py-3 text-base text-slate-700">{item.department}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-base text-slate-900">{item.dataName}</p>
                      <p className="text-base text-slate-500 mt-0.5">{item.description}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-base text-slate-700">{item.dataType}</td>
                  <td className="px-4 py-3 text-base text-slate-700">{item.frequency}</td>
                  <td className="px-4 py-3 text-base text-slate-700">{item.format}</td>
                  <td className="px-4 py-3">{getPriorityBadge(item.priority)}</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3 text-base text-slate-700">{item.lastUpdate}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button 
                        title="Xem chi tiết" 
                        onClick={() => { setSelectedItem(item); setShowViewModal(true); }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        title="Chỉnh sửa" 
                        onClick={() => { setSelectedItem(item); setShowEditModal(true); }}
                        className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        title="Xóa" 
                        onClick={() => { setSelectedItem(item); setShowDeleteModal(true); }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Logs */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-slate-900">Hoạt động Thu thập gần đây</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-base text-slate-600 uppercase tracking-wider">Thời gian</th>
                <th className="px-6 py-3 text-left text-base text-slate-600 uppercase tracking-wider">Nguồn</th>
                <th className="px-6 py-3 text-left text-base text-slate-600 uppercase tracking-wider">Phương thức</th>
                <th className="px-6 py-3 text-left text-base text-slate-600 uppercase tracking-wider">Số bản ghi</th>
                <th className="px-6 py-3 text-left text-base text-slate-600 uppercase tracking-wider">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {activityLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-base text-slate-700">{log.time}</td>
                  <td className="px-6 py-4 text-base text-slate-700">{log.source}</td>
                  <td className="px-6 py-4 text-base text-slate-700">{log.method}</td>
                  <td className="px-6 py-4 text-base text-slate-700">{log.records}</td>
                  <td className="px-6 py-4">
                    {log.status === 'success' && (
                      <span className="px-3 py-1 rounded-full text-base bg-green-100 text-green-700">Thành công</span>
                    )}
                    {log.status === 'error' && (
                      <span className="px-3 py-1 rounded-full text-base bg-red-100 text-red-700">Thất bại</span>
                    )}
                    {log.status === 'processing' && (
                      <span className="px-3 py-1 rounded-full text-base bg-yellow-100 text-yellow-700">Đang xử lý</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals Popup - Chuẩn Mockup Form */}
      <AddDataCollectionModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        onSave={(data) => {
          console.log('Saved new DataCollection', data);
          alert('Đã lưu dữ liệu thành công!');
        }}
      />

      <EditDataCollectionModal 
        isOpen={showEditModal} 
        onClose={() => {
          setShowEditModal(false);
          setSelectedItem(null);
        }}
        initialData={selectedItem}
        onSave={(data) => {
          console.log('Updated DataCollection', data);
          alert('Đã cập nhật dữ liệu thành công!');
        }}
      />

      <ConfirmModal 
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedItem(null);
        }}
        onConfirm={() => {
          console.log('Deleted DataCollection', selectedItem?.id);
          alert('Đã xóa dữ liệu thành công!');
        }}
        title="Xác nhận xóa luồng thu thập"
        subtitle="Hành động này không thể hoàn tác"
        message={
          <>
            Bạn có chắc chắn muốn xóa cấu hình thu thập <strong>{selectedItem?.dataName}</strong> của <strong>{selectedItem?.department}</strong> không?
          </>
        }
        confirmText="Xóa dữ liệu"
        type="delete"
      />

      {showViewModal && selectedItem && (
        <DataDetailModal 
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedItem(null);
          }}
          title="Chi tiết Dữ liệu Thu thập"
          mode="simple"
          data={selectedItem}
          fields={[
            { label: 'Cơ quan cung cấp', key: 'department' },
            { label: 'Tên dữ liệu', key: 'dataName' },
            { label: 'Mô tả', key: 'description' },
            { label: 'Tần suất', key: 'frequency' },
            { label: 'Định dạng trả về', key: 'format' },
            { label: 'Cập nhật lần cuối', key: 'lastUpdate' },
          ]}
        />
      )}

    </div>
    </div>
  );
}
