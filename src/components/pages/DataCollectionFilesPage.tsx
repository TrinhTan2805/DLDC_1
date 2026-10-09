import { useState } from 'react';
import { Download, Upload, Filter, Search, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { DataFileList } from '../data-collection/DataFileList';
import { StatsCard } from '../common/StatsCard';

export function DataCollectionFilesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-end gap-3">
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
          <Download className="w-5 h-5" />
          Xuất danh sách
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Upload className="w-5 h-5" />
          Tải file lên
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          icon={FileText}
          iconColor="blue"
          title="Tổng file"
          value="48"
          subtitle="+2 so với tháng trước"
          subtitleColor="blue"
        />
        <StatsCard
          icon={CheckCircle}
          iconColor="green"
          title="Đã tiếp nhận"
          value="35"
          subtitle="72% tỷ lệ thành công"
          subtitleColor="green"
        />
        <StatsCard
          icon={Clock}
          iconColor="orange"
          title="Đang xử lý"
          value="10"
          subtitle="Đang bỏ trong 24h"
          subtitleColor="orange"
        />
        <StatsCard
          icon={AlertCircle}
          iconColor="red"
          title="Lỗi"
          value="3"
          subtitle="Cần xử lý ngay"
          subtitleColor="red"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên file, mã nguồn, mã giấy dịch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filterStatus === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterStatus('received')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filterStatus === 'received'
                  ? 'bg-green-600 text-white'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Đã tiếp nhận
            </button>
            <button
              onClick={() => setFilterStatus('processing')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filterStatus === 'processing'
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Đang xử lý
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filterStatus === 'completed'
                  ? 'bg-purple-600 text-white'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Hoàn tất
            </button>
          </div>

          {/* Advanced Filter */}
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            Lọc nâng cao
          </button>
        </div>
      </div>

      {/* File List */}
      <DataFileList />

      {/* Pagination */}
      <div className="flex items-center justify-between bg-white rounded-lg border border-slate-200 p-4">
        <div className="text-sm text-slate-600">
          Hiển thị <span className="text-slate-900">1-4</span> trong tổng số <span className="text-slate-900">48</span> file
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:cursor-not-allowed disabled:!bg-[#F1F5F9] disabled:!text-[#94A3B8] disabled:!border-[#E2E8F0] disabled:!shadow-none " disabled>
            Trang trước
          </button>
          <button title="Hành động" aria-label="Hành động" className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
          <button title="Hành động" aria-label="Hành động" className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
            2
          </button>
          <button title="Hành động" aria-label="Hành động" className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
            3
          </button>
          <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
            Trang sau
          </button>
        </div>
      </div>
    </div>
  );
}