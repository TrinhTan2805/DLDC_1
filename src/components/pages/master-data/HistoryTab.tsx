import { useState } from 'react';
import { Download, FileText, GitCompare, Calendar, User, Edit, CheckCircle, XCircle, Search, Filter as FilterIcon, Eye } from 'lucide-react';
import { StatusTag } from '../../common/StatusTag';

// Mock data for change history
const mockHistoryData = {
  'HTD-2025-001234': [
    {
      version: 4,
      date: '25/12/2024 14:30',
      user: 'Nguyễn Văn A',
      action: 'Phê duyệt',
      changes: [
        { field: 'Trạng thái phê duyệt', old: 'Chờ duyệt', new: 'Đã duyệt' }
      ],
      note: 'Phê duyệt bản ghi sau khi rà soát đầy đủ'
    },
    {
      version: 3,
      date: '24/12/2024 10:15',
      user: 'Trần Thị B',
      action: 'Chỉnh sửa',
      changes: [
        { field: 'Nguồn bổ sung', old: 'Sở Tư pháp TP.HCM', new: 'Sở Tư pháp TP.HCM, Sở Tư pháp Đà Nẵng' }
      ],
      note: 'Bổ sung thêm nguồn xác thực từ Đà Nẵng'
    },
    {
      version: 2,
      date: '23/12/2024 16:45',
      user: 'Lê Văn C',
      action: 'Chỉnh sửa',
      changes: [
        { field: 'Họ và tên', old: 'Nguyễn Van A', new: 'Nguyễn Văn A' },
        { field: 'Nơi sinh', old: 'Ha Noi', new: 'Hà Nội' }
      ],
      note: 'Chuẩn hóa dữ liệu, sửa lỗi dấu tiếng Việt'
    },
    {
      version: 1,
      date: '22/12/2024 09:00',
      user: 'Hệ thống',
      action: 'Tạo mới',
      changes: [],
      note: 'Nhập dữ liệu từ nguồn Sở Tư pháp Hà Nội'
    }
  ],
  'HTD-2025-001235': [
    {
      version: 2,
      date: '24/12/2024 11:20',
      user: 'Phạm Thị D',
      action: 'Chỉnh sửa',
      changes: [
        { field: 'Ngày sinh', old: '20/08/1986', new: '20/08/1985' }
      ],
      note: 'Sửa lỗi nhập liệu năm sinh'
    },
    {
      version: 1,
      date: '23/12/2024 14:30',
      user: 'Hệ thống',
      action: 'Tạo mới',
      changes: [],
      note: 'Nhập dữ liệu từ nguồn Sở Tư pháp TP.HCM'
    }
  ],
  'HTD-2025-001236': [
    {
      version: 3,
      date: '25/12/2024 09:45',
      user: 'Hoàng Văn E',
      action: 'Chỉnh sửa',
      changes: [
        { field: 'Nguồn bổ sung', old: 'Sở Tư pháp Hải Phòng, Sở Tư pháp Cần Thơ', new: 'Sở Tư pháp Hải Phòng, Sở Tư pháp Cần Thơ, Sở Tư pháp Hà Nội' }
      ],
      note: 'Bổ sung nguồn xác thực từ Hà Nội'
    },
    {
      version: 2,
      date: '24/12/2024 15:20',
      user: 'Nguyễn Văn A',
      action: 'Từ chối phê duyệt',
      changes: [
        { field: 'Trạng thái phê duyệt', old: 'Chờ duyệt', new: 'Từ chối' }
      ],
      note: 'Thiếu nguồn xác thực, cần bổ sung thêm'
    },
    {
      version: 1,
      date: '23/12/2024 10:00',
      user: 'Hệ thống',
      action: 'Tạo mới',
      changes: [],
      note: 'Nhập dữ liệu từ nguồn Sở Tư pháp Đà Nẵng'
    }
  ],
  'HTD-2025-001237': [
    {
      version: 2,
      date: '25/12/2024 11:00',
      user: 'Nguyễn Văn A',
      action: 'Phê duyệt',
      changes: [
        { field: 'Trạng thái phê duyệt', old: 'Chờ duyệt', new: 'Đã duyệt' }
      ],
      note: 'Dữ liệu chính xác, phê duyệt ngay'
    },
    {
      version: 1,
      date: '24/12/2024 13:15',
      user: 'Hệ thống',
      action: 'Tạo mới',
      changes: [],
      note: 'Nhập dữ liệu từ nguồn Sở Tư pháp Hải Phòng'
    }
  ],
  'HTD-2025-001238': [
    {
      version: 1,
      date: '25/12/2024 08:30',
      user: 'Hệ thống',
      action: 'Tạo mới',
      changes: [],
      note: 'Nhập dữ liệu từ nguồn Sở Tư pháp Cần Thơ'
    }
  ]
};

interface HistoryTabProps {
  records: Array<{
    id: number;
    recordCode: string;
    fullName: string;
  }>;
}

type ViewMode = 'list' | 'timeline';
type FilterType = 'all' | 'Tạo mới' | 'Chỉnh sửa' | 'Phê duyệt' | 'Từ chối phê duyệt';

// Flatten all history data for list view
const getAllHistoryRecords = () => {
  const allRecords: any[] = [];
  Object.entries(mockHistoryData).forEach(([recordCode, history]) => {
    history.forEach((item) => {
      allRecords.push({
        recordCode,
        ...item
      });
    });
  });
  // Sort by date descending (newest first)
  return allRecords.sort((a, b) => {
    const dateA = new Date(a.date.split(' ')[0].split('/').reverse().join('-') + ' ' + a.date.split(' ')[1]);
    const dateB = new Date(b.date.split(' ')[0].split('/').reverse().join('-') + ' ' + b.date.split(' ')[1]);
    return dateB.getTime() - dateA.getTime();
  });
};

export function HistoryTab({ records }: HistoryTabProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedRecordCode, setSelectedRecordCode] = useState<string>('');
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareVersions, setCompareVersions] = useState<{ v1: number; v2: number } | null>(null);
  const [filterAction, setFilterAction] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDetailRecord, setSelectedDetailRecord] = useState<any>(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [restoreRecordCode, setRestoreRecordCode] = useState<string>('');
  const [selectedRestoreVersion, setSelectedRestoreVersion] = useState<number | null>(null);

  const selectedHistory = selectedRecordCode ? mockHistoryData[selectedRecordCode as keyof typeof mockHistoryData] || [] : [];
  const allHistory = getAllHistoryRecords();

  // Filter history records
  const filteredHistory = allHistory.filter(record => {
    const matchesFilter = filterAction === 'all' || record.action === filterAction;
    const matchesSearch = searchQuery === '' || 
      record.recordCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.note.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleExportReport = () => {
    if (viewMode === 'timeline' && !selectedRecordCode) {
      alert('⚠️ Vui lòng chọn bản ghi để xuất báo cáo!');
      return;
    }
    const confirmed = window.confirm(
      `📄 XUẤT BÁO CÁO LỊCH SỬ\n\n` +
      (viewMode === 'timeline' 
        ? `Bản ghi: ${selectedRecordCode}\nSố phiên bản: ${selectedHistory.length}\n\n`
        : `Tổng số bản ghi: ${filteredHistory.length}\n\n`) +
      `Chọn định dạng xuất:\n` +
      `[OK] - PDF\n` +
      `[Cancel] - Hủy`
    );
    if (confirmed) {
      alert(`✅ Đã xuất báo cáo PDF thành công`);
    }
  };

  const handleViewTimeline = (recordCode: string) => {
    setSelectedRecordCode(recordCode);
    setViewMode('timeline');
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Tạo mới':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'Chỉnh sửa':
        return <Edit className="w-5 h-5 text-orange-600" />;
      case 'Phê duyệt':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Từ chối phê duyệt':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Tạo mới':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'Chỉnh sửa':
        return 'bg-orange-50 border-orange-200 text-orange-700';
      case 'Phê duyệt':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'Từ chối phê duyệt':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getRecordName = (recordCode: string) => {
    const record = records.find(r => r.recordCode === recordCode);
    return record ? record.fullName : 'N/A';
  };

  // Statistics for list view
  const totalChanges = allHistory.length;
  const createCount = allHistory.filter(r => r.action === 'Tạo mới').length;
  const editCount = allHistory.filter(r => r.action === 'Chỉnh sửa').length;
  const approveCount = allHistory.filter(r => r.action === 'Phê duyệt').length;
  const rejectCount = allHistory.filter(r => r.action === 'Từ chối phê duyệt').length;

  return (
    <div className="bg-white border border-slate-200 rounded-lg">
      {/* Header & Controls */}
      <div className="p-6 border-b border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg text-slate-900">Lịch sử thay đổi dữ liệu</h3>
            
            {/* View Mode Tabs */}
            <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md text-sm transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📋 Danh sách
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-4 py-2 rounded-md text-sm transition-all ${
                  viewMode === 'timeline'
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📅 Timeline
              </button>
            </div>
          </div>

          <button
            onClick={handleExportReport}
            disabled={viewMode === 'timeline' && !selectedRecordCode}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </button>
        </div>

        {/* LIST VIEW - Statistics & Filters */}
        {viewMode === 'list' && (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-5 gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-purple-600 mb-1">Tổng thay đổi</div>
                    <div className="text-2xl text-purple-900">{totalChanges}</div>
                  </div>
                  <FileText className="w-8 h-8 text-purple-400" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-blue-600 mb-1">Tạo mới</div>
                    <div className="text-2xl text-blue-900">{createCount}</div>
                  </div>
                  <FileText className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-orange-600 mb-1">Chỉnh sửa</div>
                    <div className="text-2xl text-orange-900">{editCount}</div>
                  </div>
                  <Edit className="w-8 h-8 text-orange-400" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-green-600 mb-1">Phê duyệt</div>
                    <div className="text-2xl text-green-900">{approveCount}</div>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-red-600 mb-1">Từ chối</div>
                    <div className="text-2xl text-red-900">{rejectCount}</div>
                  </div>
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã bản ghi, người thực hiện, ghi chú..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                />
              </div>
              
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value as FilterType)}
                className="px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 bg-white"
              >
                <option value="all">🔍 Tất cả thao tác</option>
                <option value="Tạo mới">🆕 Tạo mới</option>
                <option value="Chỉnh sửa">✏️ Chỉnh sửa</option>
                <option value="Phê duyệt">✅ Phê duyệt</option>
                <option value="Từ chối phê duyệt">❌ Từ chối phê duyệt</option>
              </select>
            </div>
          </>
        )}

        {/* TIMELINE VIEW - Record Selector */}
        {viewMode === 'timeline' && (
          <div className="grid grid-cols-2 gap-4">
            {/* Chọn bản ghi */}
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Chọn bản ghi cần xem lịch sử <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedRecordCode}
                onChange={(e) => setSelectedRecordCode(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 bg-white"
              >
                <option value="">-- Chọn bản ghi --</option>
                {records.map((record) => (
                  <option key={record.id} value={record.recordCode}>
                    {record.recordCode} - {record.fullName}
                  </option>
                ))}
              </select>
            </div>

            {/* Thông tin tóm tắt */}
            {selectedRecordCode && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span className="text-purple-900">
                      <strong>Tổng số phiên bản:</strong> {selectedHistory.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span className="text-purple-900">
                      <strong>Cập nhật gần nhất:</strong> {selectedHistory[0]?.date || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-600" />
                    <span className="text-purple-900">
                      <strong>Người thực hiện:</strong> {selectedHistory[0]?.user || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content - LIST VIEW */}
      {viewMode === 'list' && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">STT</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Mã bản ghi</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Họ và tên</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Phiên bản</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Loại thao tác</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Người thực hiện</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thời gian</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Nội dung thay đổi</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Ghi chú</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((record, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-600">{index + 1}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {record.recordCode}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {getRecordName(record.recordCode)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      <StatusTag label={`v${record.version}`} variant="purple" />
                    </td>
                    <td className="px-4 py-3">
                      <StatusTag 
                        label={record.action} 
                        variant={record.action === 'Tạo mới' ? 'blue' : record.action === 'Chỉnh sửa' ? 'orange' : record.action === 'Phê duyệt' ? 'green' : 'red'} 
                        icon={getActionIcon(record.action)}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        {record.user}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {record.date}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {record.changes.length > 0 ? (
                        <div className="space-y-1">
                          {record.changes.map((change, idx) => (
                            <div key={idx} className="text-slate-700">
                              <span className="text-slate-600">{change.field}:</span>{' '}
                              <span className="text-red-600 line-through">{change.old}</span>{' '}
                              → <span className="text-green-600">{change.new}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Không có thay đổi</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 max-w-xs">
                      <div className="truncate" title={record.note}>
                        {record.note}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setSelectedDetailRecord({
                            recordCode: record.recordCode,
                            fullName: getRecordName(record.recordCode),
                            version: record.version,
                            action: record.action,
                            date: record.date,
                            user: record.user,
                            changes: record.changes,
                            note: record.note
                          });
                        }}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Xem chi tiết bản ghi"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-slate-500">
                    <FileText className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                    <p>Không tìm thấy lịch sử thay đổi nào</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {filteredHistory.length > 0 && (
            <div className="p-4 border-t border-slate-200 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Hiển thị 1-{filteredHistory.length} của {filteredHistory.length} bản ghi
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50 text-sm">
                  Trước
                </button>
                <button title="Hành động" aria-label="Hành động" className="px-3 py-1 bg-purple-600 text-white rounded text-sm">
                  1
                </button>
                <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50 text-sm">
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content - TIMELINE VIEW */}
      {viewMode === 'timeline' && (
        <>
          {!selectedRecordCode ? (
            <div className="p-12 text-center text-slate-500">
              <FileText className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <p className="text-lg">Vui lòng chọn bản ghi để xem timeline chi tiết</p>
            </div>
          ) : selectedHistory.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <FileText className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <p className="text-lg">Không có lịch sử thay đổi cho bản ghi này</p>
            </div>
          ) : (
            <div className="p-6">
              {/* Timeline */}
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200"></div>

                {/* Timeline items */}
                <div className="space-y-6">
                  {selectedHistory.map((item, index) => (
                    <div key={index} className="relative flex gap-6">
                      {/* Timeline dot */}
                      <div className="relative z-10 flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full border-4 border-white flex items-center justify-center ${getActionColor(item.action)}`}>
                          {getActionIcon(item.action)}
                        </div>
                      </div>

                      {/* Content card */}
                      <div className="flex-1 pb-6">
                        <div className="bg-slate-50 border-2 border-slate-200 rounded-lg overflow-hidden hover:border-purple-300 hover:shadow-md transition-all">
                          {/* Header */}
                          <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <StatusTag 
                                label={item.action} 
                                variant={item.action === 'Tạo mới' ? 'blue' : item.action === 'Chỉnh sửa' ? 'orange' : item.action === 'Phê duyệt' ? 'green' : 'red'} 
                              />
                              <span className="text-sm text-slate-600">
                                Phiên bản <strong className="text-slate-900">{item.version}</strong>
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {item.date}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <User className="w-4 h-4" />
                                {item.user}
                              </div>
                            </div>
                          </div>

                          {/* Body - Changes */}
                          {item.changes.length > 0 && (
                            <div className="px-4 py-3 space-y-2">
                              <p className="text-sm text-slate-700 mb-2">
                                <strong>Thay đổi:</strong>
                              </p>
                              {item.changes.map((change, changeIndex) => (
                                <div key={changeIndex} className="bg-white border border-slate-200 rounded-lg p-3">
                                  <div className="text-sm text-slate-900 mb-2">
                                    <strong>{change.field}</strong>
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-red-50 border border-red-200 rounded p-2">
                                      <div className="text-xs text-red-600 mb-1">Trước</div>
                                      <div className="text-sm text-red-900 line-through">{change.old}</div>
                                    </div>
                                    <div className="bg-green-50 border border-green-200 rounded p-2">
                                      <div className="text-xs text-green-600 mb-1">Sau</div>
                                      <div className="text-sm text-green-900">{change.new}</div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Note */}
                          {item.note && (
                            <div className="px-4 py-3 bg-slate-100 border-t border-slate-200">
                              <p className="text-sm text-slate-700">
                                <strong>Ghi chú:</strong> {item.note}
                              </p>
                            </div>
                          )}

                          {/* Actions */}
                          {index > 0 && (
                            <div className="px-4 py-3 bg-white border-t border-slate-200 flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  setCompareVersions({ v1: item.version, v2: selectedHistory[index - 1].version });
                                  setShowCompareModal(true);
                                }}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                              >
                                <GitCompare className="w-4 h-4" />
                                So sánh với phiên bản {selectedHistory[index - 1].version}
                              </button>
                              <button
                                onClick={() => {
                                  setRestoreRecordCode(selectedRecordCode);
                                  setSelectedRestoreVersion(item.version);
                                  setShowRestoreModal(true);
                                }}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Khôi phục version này
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Compare Modal */}
      {showCompareModal && compareVersions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GitCompare className="w-6 h-6 text-white" />
                <h3 className="text-lg text-white">
                  So sánh phiên bản {compareVersions.v1} và {compareVersions.v2}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowCompareModal(false);
                  setCompareVersions(null);
                }}
                className="text-white hover:bg-white/20 rounded-lg px-3 py-1.5 transition-colors"
              >
                ✕ Đóng
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="grid grid-cols-2 gap-6">
                {/* Version 1 */}
                <div className="border-2 border-purple-200 rounded-lg overflow-hidden">
                  <div className="bg-purple-50 px-4 py-3 border-b border-purple-200">
                    <h4 className="text-purple-900">
                      Phiên bản {compareVersions.v1}
                    </h4>
                    <p className="text-sm text-purple-700 mt-1">
                      {selectedHistory.find(h => h.version === compareVersions.v1)?.date}
                    </p>
                  </div>
                  <div className="p-4 space-y-3">
                    {selectedHistory.find(h => h.version === compareVersions.v1)?.changes.map((change, idx) => (
                      <div key={idx} className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="text-sm text-slate-700 mb-1">
                          <strong>{change.field}:</strong>
                        </div>
                        <div className="text-sm text-red-900 line-through">{change.old}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Version 2 */}
                <div className="border-2 border-green-200 rounded-lg overflow-hidden">
                  <div className="bg-green-50 px-4 py-3 border-b border-green-200">
                    <h4 className="text-green-900">
                      Phiên bản {compareVersions.v2}
                    </h4>
                    <p className="text-sm text-green-700 mt-1">
                      {selectedHistory.find(h => h.version === compareVersions.v2)?.date}
                    </p>
                  </div>
                  <div className="p-4 space-y-3">
                    {selectedHistory.find(h => h.version === compareVersions.v1)?.changes.map((change, idx) => (
                      <div key={idx} className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="text-sm text-slate-700 mb-1">
                          <strong>{change.field}:</strong>
                        </div>
                        <div className="text-sm text-green-900">{change.new}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedDetailRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-white" />
                <div>
                  <h3 className="text-lg text-white">Chi tiết thay đổi</h3>
                  <p className="text-sm text-purple-100 mt-0.5">
                    {selectedDetailRecord.recordCode} - {selectedDetailRecord.fullName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDetailRecord(null)}
                className="text-white hover:bg-white/20 rounded-lg px-3 py-1.5 transition-colors"
              >
                ✕ Đóng
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Version Info Badge */}
              <div className="flex items-center gap-3 mb-6">
                <StatusTag 
                  label={selectedDetailRecord.action} 
                  variant={selectedDetailRecord.action === 'Tạo mới' ? 'blue' : selectedDetailRecord.action === 'Chỉnh sửa' ? 'orange' : selectedDetailRecord.action === 'Phê duyệt' ? 'green' : 'red'} 
                  icon={getActionIcon(selectedDetailRecord.action)}
                />
                <StatusTag label={`Phiên bản ${selectedDetailRecord.version}`} variant="purple" />
              </div>

              {/* Basic Info */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
                <h4 className="text-slate-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  Thông tin cơ bản
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Mã bản ghi</div>
                    <div className="text-slate-900">{selectedDetailRecord.recordCode}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Họ và tên</div>
                    <div className="text-slate-900">{selectedDetailRecord.fullName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Người thực hiện</div>
                    <div className="text-slate-900">{selectedDetailRecord.user}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Thời gian</div>
                    <div className="text-slate-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {selectedDetailRecord.date}
                    </div>
                  </div>
                </div>
              </div>

              {/* Changes Detail */}
              {selectedDetailRecord.changes.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
                  <h4 className="text-slate-900 mb-4 flex items-center gap-2">
                    <Edit className="w-5 h-5 text-orange-600" />
                    Nội dung thay đổi ({selectedDetailRecord.changes.length})
                  </h4>
                  <div className="space-y-4">
                    {selectedDetailRecord.changes.map((change: any, idx: number) => (
                      <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                          <div className="text-sm text-slate-900">
                            <strong>{change.field}</strong>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 divide-x divide-slate-200">
                          <div className="p-4 bg-red-50">
                            <div className="text-xs text-red-600 mb-2 flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              Giá trị cũ
                            </div>
                            <div className="text-sm text-red-900 line-through">{change.old}</div>
                          </div>
                          <div className="p-4 bg-green-50">
                            <div className="text-xs text-green-600 mb-2 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Giá trị mới
                            </div>
                            <div className="text-sm text-green-900">{change.new}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Note */}
              {selectedDetailRecord.note && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="text-blue-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Ghi chú / Lý do thay đổi
                  </h4>
                  <p className="text-blue-900 leading-relaxed">{selectedDetailRecord.note}</p>
                </div>
              )}

              {/* Empty state for no changes */}
              {selectedDetailRecord.changes.length === 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
                  <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-600">
                    {selectedDetailRecord.action === 'Tạo mới' 
                      ? 'Đây là phiên bản đầu tiên của bản ghi'
                      : 'Không có thay đổi dữ liệu trong phiên bản này'}
                  </p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  handleViewTimeline(selectedDetailRecord.recordCode);
                  setSelectedDetailRecord(null);
                }}
                className="px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
              >
                📅 Xem Timeline
              </button>
              <button
                onClick={() => setSelectedDetailRecord(null)}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Version Modal */}
      {showRestoreModal && selectedRestoreVersion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <div>
                  <h3 className="text-lg text-white">Khôi phục phiên bản</h3>
                  <p className="text-sm text-green-100 mt-0.5">
                    {restoreRecordCode} - {getRecordName(restoreRecordCode)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowRestoreModal(false);
                  setRestoreRecordCode('');
                  setSelectedRestoreVersion(null);
                }}
                className="text-white hover:bg-white/20 rounded-lg px-3 py-1.5 transition-colors"
              >
                ✕ Đóng
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Warning Banner */}
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-yellow-900 mb-2">⚠️ Cảnh báo quan trọng</h4>
                    <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                      <li>Khôi phục sẽ thay thế <strong>TẤT CẢ dữ liệu hiện tại</strong> bằng dữ liệu từ phiên bản đã chọn</li>
                      <li>Thao tác này <strong>KHÔNG THỂ HOÀN TÁC</strong></li>
                      <li>Một phiên bản mới sẽ được tạo với ghi chú "Khôi phục từ version {selectedRestoreVersion}"</li>
                      <li>Vui lòng kiểm tra kỹ thông tin trước khi xác nhận</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Version Selection */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
                <h4 className="text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Chọn phiên bản cần khôi phục
                </h4>
                
                {/* Current version info */}
                <div className="bg-white border-2 border-purple-300 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 text-purple-700 rounded-full">
                      v{selectedHistory[0]?.version || 'N/A'}
                    </span>
                    <div>
                      <div className="text-sm text-slate-600">Phiên bản hiện tại</div>
                      <div className="text-xs text-slate-500">{selectedHistory[0]?.date || 'N/A'} - {selectedHistory[0]?.user || 'N/A'}</div>
                    </div>
                    <StatusTag label="Đang sử dụng" variant="purple" />
                  </div>
                  {selectedHistory[0]?.note && (
                    <p className="text-sm text-slate-600 bg-slate-50 rounded p-2">
                      💬 {selectedHistory[0].note}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 my-4">
                  <div className="flex-1 border-t border-slate-300"></div>
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <div className="flex-1 border-t border-slate-300"></div>
                </div>

                {/* Selected version to restore */}
                <div className="bg-white border-2 border-green-300 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 bg-green-100 text-green-700 rounded-full">
                      v{selectedRestoreVersion}
                    </span>
                    <div>
                      <div className="text-sm text-slate-900">Phiên bản sẽ khôi phục</div>
                      <div className="text-xs text-slate-500">
                        {selectedHistory.find(h => h.version === selectedRestoreVersion)?.date || 'N/A'} - {selectedHistory.find(h => h.version === selectedRestoreVersion)?.user || 'N/A'}
                      </div>
                    </div>
                    <StatusTag label="Khôi phục" variant="green" />
                  </div>
                  {selectedHistory.find(h => h.version === selectedRestoreVersion)?.note && (
                    <p className="text-sm text-slate-600 bg-slate-50 rounded p-2">
                      💬 {selectedHistory.find(h => h.version === selectedRestoreVersion)?.note}
                    </p>
                  )}
                </div>

                {/* All versions dropdown */}
                <div className="mt-4">
                  <label className="block text-sm text-slate-700 mb-2">
                    Hoặc chọn phiên bản khác:
                  </label>
                  <select
                    value={selectedRestoreVersion}
                    onChange={(e) => setSelectedRestoreVersion(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 bg-white"
                  >
                    {selectedHistory
                      .filter(h => h.version !== selectedHistory[0]?.version) // Exclude current version
                      .map((h) => (
                        <option key={h.version} value={h.version}>
                          Phiên bản {h.version} - {h.date} - {h.action} - {h.user}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Changes preview */}
              {selectedHistory.find(h => h.version === selectedRestoreVersion)?.changes.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h4 className="text-slate-900 mb-4 flex items-center gap-2">
                    <Edit className="w-5 h-5 text-orange-600" />
                    Dữ liệu sẽ được khôi phục
                  </h4>
                  <div className="space-y-3">
                    {selectedHistory.find(h => h.version === selectedRestoreVersion)?.changes.map((change, idx) => (
                      <div key={idx} className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="text-sm text-slate-900 mb-2">
                          <strong>{change.field}</strong>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="text-xs text-slate-600 mb-1">Giá trị sẽ khôi phục:</div>
                            <div className="text-sm text-green-900 bg-white rounded px-2 py-1 border border-green-200">
                              {change.old || change.new}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                💡 <strong>Lưu ý:</strong> Phiên bản hiện tại sẽ được lưu trong lịch sử
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRestoreModal(false);
                    setRestoreRecordCode('');
                    setSelectedRestoreVersion(null);
                  }}
                  className="px-6 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={() => {
                    const confirmed = window.confirm(
                      `♻️ XÁC NHẬN KHÔI PHỤC PHIÊN BẢN\n\n` +
                      `Mã bản ghi: ${restoreRecordCode}\n` +
                      `Phiên bản khôi phục: v${selectedRestoreVersion}\n` +
                      `Phiên bản hiện tại: v${selectedHistory[0]?.version}\n\n` +
                      `⚠️ Thao tác này KHÔNG THỂ HOÀN TÁC!\n\n` +
                      `Bạn có chắc chắn muốn tiếp tục?`
                    );
                    if (confirmed) {
                      alert(
                        `✅ KHÔI PHỤC THÀNH CÔNG\n\n` +
                        `Bản ghi: ${restoreRecordCode}\n` +
                        `Đã khôi phục từ phiên bản ${selectedRestoreVersion}\n` +
                        `Phiên bản mới: v${selectedHistory[0]?.version + 1}\n\n` +
                        `Dữ liệu đã được khôi phục về trạng thái lúc ${selectedHistory.find(h => h.version === selectedRestoreVersion)?.date}`
                      );
                      setShowRestoreModal(false);
                      setRestoreRecordCode('');
                      setSelectedRestoreVersion(null);
                    }
                  }}
                  className="px-8 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Khôi phục ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}