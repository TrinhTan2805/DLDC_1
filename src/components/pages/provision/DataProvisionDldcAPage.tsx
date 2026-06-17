import { useState } from 'react';
import { Search, Eye, FileText, Database, History as HistoryIcon, CheckCircle, XCircle, Clock, Share2, X, Calendar, User } from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';

interface DataRecord {
  id: string;
  status: string;
  recordCode: string;
  fullName: string;
  birthDate: string;
  idNumber: string;
  statusLabel: string;
  providedSystems: string[]; // Danh sách mã hệ thống đã cung cấp
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

// Mapping thông tin hệ thống
const systemInfoMap: Record<string, { name: string; provisionDate: string; provisionTime: string; status: 'Thành công' | 'Thất bại' | 'Đang xử lý'; note: string }> = {
  'DLDC-001': {
    name: 'Hệ thống Cổng dịch vụ công quốc gia',
    provisionDate: '20/12/2024',
    provisionTime: '14:30:25',
    status: 'Thành công',
    note: 'Cung cấp đầy đủ'
  },
  'DLDC-002': {
    name: 'Hệ thống Một cửa điện tử Bộ Tư pháp',
    provisionDate: '19/12/2024',
    provisionTime: '09:15:42',
    status: 'Thành công',
    note: 'Cập nhật định kỳ'
  },
  'DLDC-003': {
    name: 'Hệ thống LGSP - Nền tảng tích hợp',
    provisionDate: '18/12/2024',
    provisionTime: '16:45:12',
    status: 'Thất bại',
    note: 'Lỗi kết nối mạng'
  },
  'DLDC-004': {
    name: 'Hệ thống quản lý Bộ Tư Pháp văn bản Bộ Tư pháp',
    provisionDate: '17/12/2024',
    provisionTime: '11:20:08',
    status: 'Thành công',
    note: 'Đồng bộ dữ liệu'
  },
  'DLDC-005': {
    name: 'Hệ thống CSDL dân cư - Bộ Công an',
    provisionDate: '16/12/2024',
    provisionTime: '08:30:15',
    status: 'Đang xử lý',
    note: 'Đang xử lý batch lớn'
  },
  'DLDC-006': {
    name: 'Hệ thống Giải quyết TTHC - Bộ Nội vụ',
    provisionDate: '15/12/2024',
    provisionTime: '13:50:30',
    status: 'Thành công',
    note: 'Cung cấp theo yêu cầu'
  },
};

const mockRecords: DataRecord[] = [
  {
    id: '1',
    status: 'Đã xác minh',
    recordCode: 'DLDC-A-2025-001234',
    fullName: 'Công dân A1',
    birthDate: '15/03/1990',
    idNumber: '001234567890',
    statusLabel: 'Đã xử lý',
    providedSystems: ['DLDC-001', 'DLDC-002', 'DLDC-004']
  },
  {
    id: '2',
    status: 'Đã xác minh',
    recordCode: 'DLDC-A-2025-001235',
    fullName: 'Công dân A2',
    birthDate: '20/08/1985',
    idNumber: '001234567891',
    statusLabel: 'Đang xử lý',
    providedSystems: ['DLDC-001', 'DLDC-003']
  },
  {
    id: '3',
    status: 'Đã xác minh',
    recordCode: 'DLDC-A-2025-001236',
    fullName: 'Công dân A3',
    birthDate: '10/12/1992',
    idNumber: '001234567892',
    statusLabel: 'Đã xử lý',
    providedSystems: ['DLDC-001', 'DLDC-002', 'DLDC-005', 'DLDC-006']
  }
];

const mockProvisionHistory: ProvisionHistory[] = [
  {
    id: '1',
    targetSystem: 'Hệ thống Cổng dịch vụ công quốc gia',
    targetSystemCode: 'DLDC-001',
    provisionDate: '20/12/2024',
    provisionTime: '14:30:25',
    recordCount: 28742,
    performer: 'Nguyễn Văn A',
    status: 'Thành công',
    note: 'Cung cấp DLDC đầy đủ'
  },
  {
    id: '2',
    targetSystem: 'Hệ thống Một cửa điện tử Bộ Tư pháp',
    targetSystemCode: 'DLDC-002',
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
    targetSystemCode: 'DLDC-003',
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
    targetSystemCode: 'DLDC-004',
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
    targetSystemCode: 'DLDC-005',
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
    targetSystemCode: 'DLDC-006',
    provisionDate: '15/12/2024',
    provisionTime: '13:50:30',
    recordCount: 9800,
    performer: 'Đỗ Thị F',
    status: 'Thành công',
    note: 'Cung cấp theo yêu cầu'
  }
];

export function DataProvisionDldcAPage() {
  const [activeTab, setActiveTab] = useState<'data' | 'history'>('data');
  const [searchTerm, setSearchTerm] = useState('');
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<DataRecord | null>(null);

  const filteredRecords = mockRecords.filter(record =>
    record.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.recordCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHistory = mockProvisionHistory.filter(history =>
    history.targetSystem.toLowerCase().includes(historySearchTerm.toLowerCase()) ||
    history.targetSystemCode.toLowerCase().includes(historySearchTerm.toLowerCase()) ||
    history.performer.toLowerCase().includes(historySearchTerm.toLowerCase())
  );

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

  const handleViewDetail = (record: DataRecord) => {
    setSelectedRecord(record);
  };

  const closeModal = () => {
    setSelectedRecord(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="CSDL DLDC - Loại A" icon={Database} />

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
                <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm">
                  Nhập
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
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
                      <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Đã cung cấp cho hệ thống</th>
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
                          <div className="flex flex-wrap gap-1">
                            {record.providedSystems.map((system, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded"
                                title={`Đã cung cấp cho ${system}`}
                              >
                                <Share2 className="w-3 h-3" />
                                {system}
                              </span>
                            ))}
                            {record.providedSystems.length === 0 && (
                              <span className="text-slate-400 text-xs italic">Chưa cung cấp</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 text-xs rounded ${record.statusLabel === 'Đã xử lý'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                            }`}>
                            {record.statusLabel}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Xem chi tiết" onClick={() => handleViewDetail(record)}>
                            <Eye className="w-4 h-4" />
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
              {/* Search */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-2xl">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo hệ thống, mã, người thực hiện..."
                    value={historySearchTerm}
                    onChange={(e) => setHistorySearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* History Table */}
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
                        <td className="px-4 py-3 text-sm text-slate-700">{history.targetSystemCode}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{history.provisionDate}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{history.provisionTime}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{history.recordCount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{history.performer}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(history.status)}
                            <span className={`px-2 py-1 text-xs rounded ${history.status === 'Thành công'
                              ? 'bg-green-100 text-green-700'
                              : history.status === 'Thất bại'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-blue-100 text-blue-700'
                              }`}>
                              {history.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{history.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div>
                <h3 className="text-lg text-slate-900">Chi tiết bản ghi</h3>
                <p className="text-sm text-slate-600 mt-1">{selectedRecord.recordCode}</p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-white/60 rounded-lg transition-colors"
                title="Đóng"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Thông tin bản ghi */}
              <div className="mb-6">
                <h4 className="text-sm text-slate-900 mb-3 flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  Thông tin bản ghi
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-xs text-slate-600">Mã bản ghi</span>
                    <p className="text-sm text-slate-900 mt-1">{selectedRecord.recordCode}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-xs text-slate-600">Họ và tên</span>
                    <p className="text-sm text-slate-900 mt-1">{selectedRecord.fullName}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-xs text-slate-600">Ngày sinh</span>
                    <p className="text-sm text-slate-900 mt-1">{selectedRecord.birthDate}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-xs text-slate-600">Số CCCD</span>
                    <p className="text-sm text-slate-900 mt-1">{selectedRecord.idNumber}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-xs text-slate-600">Tình trạng</span>
                    <p className="text-sm text-slate-900 mt-1">{selectedRecord.status}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-xs text-slate-600">Trạng thái xử lý</span>
                    <p className="text-sm mt-1">
                      <span className={`px-2 py-1 text-xs rounded ${selectedRecord.statusLabel === 'Đã xử lý'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                        }`}>
                        {selectedRecord.statusLabel}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Danh sách các hệ thống đã chia sẻ */}
              <div className="border-t border-slate-200 pt-6">
                <h4 className="text-sm text-slate-900 mb-4 flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-purple-600" />
                  Các phần mềm/hệ thống đã chia sẻ thông tin này ({selectedRecord.providedSystems.length})
                </h4>

                {selectedRecord.providedSystems.length > 0 ? (
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">STT</th>
                          <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Mã hệ thống</th>
                          <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Tên hệ thống</th>
                          <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Ngày cung cấp</th>
                          <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thời gian</th>
                          <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái</th>
                          <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Ghi chú</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedRecord.providedSystems.map((systemCode, idx) => {
                          const systemInfo = systemInfoMap[systemCode];
                          return (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="px-4 py-3 text-sm text-slate-700">{idx + 1}</td>
                              <td className="px-4 py-3 text-sm">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                                  <Database className="w-3 h-3" />
                                  {systemCode}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-slate-900">{systemInfo?.name || 'N/A'}</td>
                              <td className="px-4 py-3 text-sm text-slate-700">{systemInfo?.provisionDate || 'N/A'}</td>
                              <td className="px-4 py-3 text-sm text-slate-700">{systemInfo?.provisionTime || 'N/A'}</td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex items-center gap-2">
                                  {systemInfo?.status && getStatusIcon(systemInfo.status)}
                                  <span className={`px-2 py-1 text-xs rounded ${systemInfo?.status === 'Thành công'
                                    ? 'bg-green-100 text-green-700'
                                    : systemInfo?.status === 'Thất bại'
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {systemInfo?.status || 'N/A'}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-slate-600">{systemInfo?.note || 'N/A'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
                    <Share2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Chưa có hệ thống nào được chia sẻ</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}