import { useState } from 'react';
import { Search, Edit, Check, X, AlertTriangle, FileText, Settings, Database, AlertCircle, History as HistoryIcon, Download, CheckCircle, XCircle, Clock } from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';

interface DataRecord {
  id: string;
  status: string;
  recordCode: string;
  fullName: string;
  birthDate: string;
  idNumber: string;
  statusLabel: string;
}

interface DataQuality {
  id: string;
  recordCode: string;
  field: string;
  originalValue: string;
  suggestedValue: string;
  errorType: string;
  errorDescription: string;
  suggestion: string;
  status: string;
}

interface ProvisionHistory {
  id: string;
  targetSystem: string;
  targetSystemCode: string;
  provisionDate: string;
  provisionTime: string;
  recordCount: number;
  performer: string;
  status: 'Thành công' | 'Thất bại' | 'Đang xử lý';
  note: string;
}

const mockRecords: DataRecord[] = [
  {
    id: '1',
    status: 'Không xác',
    recordCode: 'HTD-2025-001234',
    fullName: 'Nguyễn Văn A',
    birthDate: '15/03/1990',
    idNumber: '001234567890',
    statusLabel: 'Đã xử lý'
  },
  {
    id: '2',
    status: 'Không xác',
    recordCode: 'HTD-2025-001235',
    fullName: 'Trần Thị B',
    birthDate: '20/08/1985',
    idNumber: '001234567891',
    statusLabel: 'Đang xử lý'
  },
  {
    id: '3',
    status: 'Không xác',
    recordCode: 'HTD-2025-001236',
    fullName: 'Lê Văn C',
    birthDate: '10/12/1992',
    idNumber: '001234567892',
    statusLabel: 'Đã xử lý'
  }
];

const mockQualityIssues: DataQuality[] = [
  {
    id: '1',
    recordCode: 'HT-2025-001234',
    field: 'Ngày sinh',
    originalValue: '1/2/1990',
    suggestedValue: '',
    errorType: 'Sai định dạng',
    errorDescription: 'Ngày tháng không đúng định dạng DD/MM/YYYY',
    suggestion: '01/02/1990',
    status: 'Chờ xử lý'
  },
  {
    id: '2',
    recordCode: 'HT-2025-001235',
    field: 'CCCD',
    originalValue: '123456',
    suggestedValue: '',
    errorType: 'Thiếu dữ liệu',
    errorDescription: 'CCCD phải có 12 chữ số',
    suggestion: '001234560000',
    status: 'Chờ xử lý'
  },
  {
    id: '3',
    recordCode: 'HT-2025-001236',
    field: 'Họ tên',
    originalValue: 'NGUYEN VAN A',
    suggestedValue: '',
    errorType: 'Sai định dạng',
    errorDescription: 'Tên phải viết hoa chữ cái đầu',
    suggestion: 'Nguyễn Văn A',
    status: 'Chờ xử lý'
  },
  {
    id: '4',
    recordCode: 'HT-2025-001237',
    field: 'Email',
    originalValue: 'test@invalid',
    suggestedValue: '',
    errorType: 'Sai định dạng',
    errorDescription: 'Email không hợp lệ',
    suggestion: 'test@example.com',
    status: 'Chờ xử lý'
  },
  {
    id: '5',
    recordCode: 'HT-2025-001238',
    field: 'Số điện thoại',
    originalValue: '987654321',
    suggestedValue: '',
    errorType: 'Thiếu dữ liệu',
    errorDescription: 'Số điện thoại phải có 10 chữ số',
    suggestion: '0987654321',
    status: 'Chờ xử lý'
  },
  {
    id: '6',
    recordCode: 'HT-2025-001239',
    field: 'Địa chỉ',
    originalValue: '<không>',
    suggestedValue: '',
    errorType: 'Thiếu dữ liệu',
    errorDescription: 'Trường địa chỉ không được để trống',
    suggestion: 'Không có',
    status: 'Chờ xử lý'
  }
];

const mockProvisionHistory: ProvisionHistory[] = [
  {
    id: '1',
    targetSystem: 'Hệ thống Cổng dịch vụ công quốc gia',
    targetSystemCode: 'CSDL-001',
    provisionDate: '20/12/2024',
    provisionTime: '14:30:25',
    recordCount: 28742,
    performer: 'Nguyễn Văn A',
    status: 'Thành công',
    note: 'Cung cấp dữ liệu đầy đủ'
  },
  {
    id: '2',
    targetSystem: 'Hệ thống Một cửa điện tử Bộ Tư pháp',
    targetSystemCode: 'CSDL-002',
    provisionDate: '19/12/2024',
    provisionTime: '09:15:42',
    recordCount: 15230,
    performer: 'Trần Thị B',
    status: 'Thành công',
    note: 'Cập nhật định kỳ hàng tuần'
  },
  {
    id: '3',
    targetSystem: 'Hệ thống LGSP - Nền tảng tích hợp',
    targetSystemCode: 'CSDL-003',
    provisionDate: '18/12/2024',
    provisionTime: '16:45:12',
    recordCount: 8950,
    performer: 'Lê Văn C',
    status: 'Thất bại',
    note: 'Lỗi kết nối mạng'
  },
  {
    id: '4',
    targetSystem: 'Hệ thống quản lý Bộ Tư Pháp văn bản Bộ Tư pháp',
    targetSystemCode: 'CSDL-004',
    provisionDate: '17/12/2024',
    provisionTime: '11:20:08',
    recordCount: 12456,
    performer: 'Phạm Thị D',
    status: 'Thành công',
    note: 'Đồng bộ dữ liệu tháng 12'
  },
  {
    id: '5',
    targetSystem: 'Hệ thống CSDL dân cư - Bộ Công an',
    targetSystemCode: 'CSDL-005',
    provisionDate: '16/12/2024',
    provisionTime: '08:30:15',
    recordCount: 32100,
    performer: 'Hoàng Văn E',
    status: 'Đang xử lý',
    note: 'Đang xử lý batch lớn'
  },
  {
    id: '6',
    targetSystem: 'Hệ thống Giải quyết TTHC - Bộ Nội vụ',
    targetSystemCode: 'CSDL-006',
    provisionDate: '15/12/2024',
    provisionTime: '13:50:30',
    recordCount: 9800,
    performer: 'Đỗ Thị F',
    status: 'Thành công',
    note: 'Cung cấp theo yêu cầu'
  }
];

export function DataProvisionCatalogAPage() {
  const [activeTab, setActiveTab] = useState<'data' | 'history'>('data');
  const [searchTerm, setSearchTerm] = useState('');
  const [historySearchTerm, setHistorySearchTerm] = useState('');

  const filteredRecords = mockRecords.filter(record =>
    record.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.recordCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHistory = mockProvisionHistory.filter(history =>
    history.targetSystem.toLowerCase().includes(historySearchTerm.toLowerCase()) ||
    history.targetSystemCode.toLowerCase().includes(historySearchTerm.toLowerCase()) ||
    history.performer.toLowerCase().includes(historySearchTerm.toLowerCase())
  );

  const qualityStats = {
    total: 12,
    pending: 9,
    fixed: 2,
    ignored: 1
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Thành công':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Thất bại':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'Đang xử lý':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Danh mục chủ - Loại A" icon={FileText} />

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="border-b border-slate-200">
          <div className="flex items-center gap-1 px-2">
            <button
              onClick={() => setActiveTab('data')}
              className={`flex items-center gap-2 px-4 py-3 text-sm border-b-2 transition-colors ${activeTab === 'data'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
            >
              <FileText className="w-4 h-4" />
              Danh sách dữ liệu
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-3 text-sm border-b-2 transition-colors ${activeTab === 'history'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
            >
              <HistoryIcon className="w-4 h-4" />
              Lịch sử cung cấp
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Tab 1: Danh sách dữ liệu */}
          {activeTab === 'data' && (
            <div className="space-y-4">
              {/* Search and Actions */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-2xl">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Tìm kiếm nâng cao
                </button>
                <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm flex items-center gap-2">
                  Nhập
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2">
                  Xuất
                </button>
              </div>

              {/* Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">STT</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Tình trạng</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Mã bản ghi</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Họ và tên</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Ngày sinh</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Số CCCD</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRecords.map((record, index) => (
                      <tr key={record.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-700">{index + 1}</td>
                        <td className="px-4 py-3 text-sm text-blue-600">{record.status}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{record.recordCode}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{record.fullName}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{record.birthDate}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{record.idNumber}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 text-xs rounded ${record.statusLabel === 'Đã xử lý'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                            }`}>
                            {record.statusLabel}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Xem chi tiết">
                            <Edit className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Lịch sử cung cấp */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {/* Search and Actions */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-2xl">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={historySearchTerm}
                    onChange={(e) => setHistorySearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Tìm kiếm nâng cao
                </button>
                <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm flex items-center gap-2">
                  Nhập
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2">
                  Xuất
                </button>
              </div>

              {/* Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">STT</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Hệ thống đích</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Mã hệ thống đích</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Ngày cung cấp</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thời gian cung cấp</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Số bản ghi</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Người thực hiện</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredHistory.map((history, index) => (
                      <tr key={history.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-700">{index + 1}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{history.targetSystem}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{history.targetSystemCode}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{history.provisionDate}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{history.provisionTime}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{history.recordCount}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{history.performer}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 text-xs rounded ${history.status === 'Thành công'
                            ? 'bg-green-100 text-green-700'
                            : history.status === 'Thất bại'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                            }`}>
                            {history.status}
                          </span>
                          {getStatusIcon(history.status)}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">{history.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}