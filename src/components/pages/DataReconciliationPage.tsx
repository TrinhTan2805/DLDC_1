import { useState, ChangeEvent } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Database,
  FileText,
  Calendar,
  TrendingUp,
  Info,
  X,
  AlertTriangle,
  Bell,
  Send,
  RefreshCw,
  PlayCircle
} from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { SendNotificationModal } from '../modals/SendNotificationModal';

interface ReconciliationProcess {
  id: string;
  database: string;
  description: string;
  processDescription: string;
  status: 'completed' | 'in-progress' | 'pending' | 'error';
  lastReconciliation: string;
  recordsChecked: number;
  sourceRecords: number; // Bản ghi tại hệ thống nguồn
  collectedRecords: number; // Bản ghi đã thu thập (Kho DLDC)
  processedRecords: number; // Bản ghi đã biên tập/làm sạch
  providedRecords: number; // Bản ghi đã cung cấp (Đích)
  discrepanciesFound: number;
  successRate: number;
}

interface DiscrepancyRecord {
  id: string;
  recordId: string;
  fieldName: string;
  sourceValue: string;
  collectedValue: string;
  processedValue: string;
  providedValue: string;
  discrepancyType: 'missing' | 'mismatch' | 'duplicate' | 'format-error';
  detectedAt: string;
  severity: 'high' | 'medium' | 'low';
  discrepancyLocation: 'source-collected' | 'processed-provided' | 'all';
  reconciliationType: '1' | '2'; // 1: Nguồn vs Thu thập, 2: Biên tập vs Cung cấp
}

// Mock data for discrepancy records
const discrepancyRecords: Record<string, DiscrepancyRecord[]> = {
  'REC-001': [
    {
      id: 'DISC-001-1',
      recordId: 'HT-2024-001234',
      fieldName: 'Ngày sinh',
      sourceValue: '15/03/1990',
      collectedValue: '15/03/1990',
      processedValue: '15-03-1990',
      providedValue: '15-03-1990',
      discrepancyType: 'format-error',
      detectedAt: '2024-12-09 08:25:30',
      severity: 'low',
      discrepancyLocation: 'source-collected',
      reconciliationType: '1'
    },
    {
      id: 'DISC-001-2',
      recordId: 'HT-2024-001235',
      fieldName: 'Số CMND/CCCD',
      sourceValue: '001234567890',
      collectedValue: '001234567890',
      processedValue: '',
      providedValue: '',
      discrepancyType: 'missing',
      detectedAt: '2024-12-09 08:26:15',
      severity: 'high',
      discrepancyLocation: 'processed-provided',
      reconciliationType: '2'
    },
    {
      id: 'DISC-001-3',
      recordId: 'HT-2024-001240',
      fieldName: 'Địa chỉ thường trú',
      sourceValue: 'Số 10, Nguyễn Trãi, Hà Nội',
      collectedValue: 'Số 10, Nguyễn Trãi, Hà Nội',
      processedValue: 'Số 10, Nguyễn Trãi, TP Hà Nội',
      providedValue: 'Số 10, Nguyễn Trãi, TP Hà Nội',
      discrepancyType: 'mismatch',
      detectedAt: '2024-12-09 08:27:00',
      severity: 'medium',
      discrepancyLocation: 'all',
      reconciliationType: '2'
    }
  ],
  'REC-009': [
    {
      id: 'DISC-009-1',
      recordId: 'PBGDPL-2024-005670',
      fieldName: 'Mã đơn vị',
      sourceValue: 'DV-HN-001',
      collectedValue: 'DV-HN-001',
      processedValue: 'DV-HN-002',
      providedValue: 'DV-HN-002',
      discrepancyType: 'mismatch',
      detectedAt: '2024-12-09 04:55:20',
      severity: 'high',
      discrepancyLocation: 'all',
      reconciliationType: '2'
    },
    {
      id: 'DISC-009-2',
      recordId: 'PBGDPL-2024-005671',
      fieldName: 'Ngày tổ chức',
      sourceValue: '2024-11-15',
      collectedValue: '2024-11-15',
      processedValue: '',
      providedValue: '',
      discrepancyType: 'missing',
      detectedAt: '2024-12-09 04:56:45',
      severity: 'medium',
      discrepancyLocation: 'processed-provided',
      reconciliationType: '2'
    }
  ]
};

const reconciliationData: ReconciliationProcess[] = [
  {
    id: 'REC-001',
    database: 'CSDL A',
    description: 'Đối soát tổng hợp về dữ liệu Danh mục',
    processDescription: 'Kho dữ liệu đưng chung định kỳ họ|c theo yêu cầu gửi gọi tin yêu cầu Đối soát tổng hợp về dữ liệu Danh mục cung cấp tới Hệ thống đích. Hệ thống đích phản hồi kết quả nhận được.',
    status: 'completed',
    lastReconciliation: '2024-12-09 08:30:00',
    recordsChecked: 1250000,
    sourceRecords: 1250000,
    collectedRecords: 1250000,
    processedRecords: 1250000,
    providedRecords: 1250000,
    discrepanciesFound: 12,
    successRate: 99.999
  },
  {
    id: 'REC-002',
    database: 'CSDL B',
    description: 'Đối soát tổng hợp về cung cấp dữ liệu Hộ tịch điện tử',
    processDescription: 'Kho dữ liệu đưng chung định kỳ họ|c theo yêu cầu gửi gọi tin yêu cầu Đối soát tổng hợp về cung cấp dữ liệu Hộ tịch điện tử gửi tới Hệ thống đích. Hệ thống đích phản hồi kết quả nhận được.',
    status: 'completed',
    lastReconciliation: '2024-12-09 09:15:00',
    recordsChecked: 850000,
    sourceRecords: 850000,
    collectedRecords: 850000,
    processedRecords: 850000,
    providedRecords: 850000,
    discrepanciesFound: 8,
    successRate: 99.999
  },
  {
    id: 'REC-003',
    database: 'CSDL C',
    description: 'Đối soát tổng hợp về cung cấp dữ liệu hồ sơ quốc tịch',
    processDescription: 'Kho dữ liệu đưng chung định kỳ họ|c theo yêu cầu gửi gọi tin yêu cầu Đối soát tổng hợp về cung cấp dữ liệu hồ sơ quốc tịch gửi tới Hệ thống đích. Hệ thống đích phản hồi kết quả nhận được.',
    status: 'in-progress',
    lastReconciliation: '2024-12-09 10:00:00',
    recordsChecked: 125000,
    sourceRecords: 125000,
    collectedRecords: 125000,
    processedRecords: 125000,
    providedRecords: 125000,
    discrepanciesFound: 3,
    successRate: 99.998
  }
];

export function DataReconciliationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReconciliation, setSelectedReconciliation] = useState<ReconciliationProcess | null>(null);
  const [discrepancyFilter, setDiscrepancyFilter] = useState<string>('all');
  const [reconcilingId, setReconcilingId] = useState<string | null>(null);
  const [confirmReconcileId, setConfirmReconcileId] = useState<string | null>(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  // Handle start reconciliation
  const handleStartReconciliation = async (item: ReconciliationProcess) => {
    setConfirmReconcileId(null);
    setReconcilingId(item.id);

    // Mock API call
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock success
      alert(`✅ Đã gửi yêu cầu đối soát cho "${item.database}"\n\nHệ thống đang thực hiện đối soát dữ liệu. Vui lòng chờ kết quả.`);
    } catch (error) {
      alert('❌ Có lỗi xảy ra khi gửi yêu cầu đối soát. Vui lòng thử lại.');
    } finally {
      setReconcilingId(null);
    }
  };

  const filteredData = reconciliationData.filter(item => {
    const matchesSearch = item.database.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiscrepancy =
      discrepancyFilter === 'all' ||
      (discrepancyFilter === 'with-discrepancy' && item.discrepanciesFound > 0) ||
      (discrepancyFilter === 'no-discrepancy' && item.discrepanciesFound === 0);
    return matchesSearch && matchesDiscrepancy;
  });

  const stats = {
    totalProcesses: reconciliationData.length,
    completed: reconciliationData.filter(r => r.status === 'completed').length,
    inProgress: reconciliationData.filter(r => r.status === 'in-progress').length,
    withErrors: reconciliationData.filter(r => r.status === 'error').length,
    totalRecordsChecked: reconciliationData.reduce((sum, r) => sum + r.recordsChecked, 0),
    totalDiscrepancies: reconciliationData.reduce((sum, r) => sum + r.discrepanciesFound, 0)
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Hoàn thành
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
            <Clock className="w-3.5 h-3.5" />
            Đang xử lý
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
            <Clock className="w-3.5 h-3.5" />
            Chờ xử lý
          </span>
        );
      case 'error':
        return (
          <div className="relative inline-flex items-center group">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full">
              <AlertCircle className="w-3.5 h-3.5" />
              Có lỗi
            </span>
            <Info className="w-3.5 h-3.5 ml-1.5 text-red-600 cursor-help" />
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 bg-slate-900 text-white text-xs rounded-lg p-3 z-10 shadow-lg">
              <div className="mb-2">
                <strong>Lỗi đối soát dữ liệu</strong>
              </div>
              <p className="leading-relaxed">
                Quá trình đối soát phát hiện nhiều bất thường vượt ngưỡng cho phép. Cần kiểm tra và xử lý ngay.
              </p>
              <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getDiscrepancyTypeBadge = (type: string) => {
    switch (type) {
      case 'missing':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
            Thiếu dữ liệu
          </span>
        );
      case 'mismatch':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded">
            Không khớp
          </span>
        );
      case 'duplicate':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
            Trùng lặp
          </span>
        );
      case 'format-error':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
            Lỗi định dạng
          </span>
        );
      default:
        return null;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
            <AlertTriangle className="w-3 h-3" />
            Cao
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded">
            <AlertTriangle className="w-3 h-3" />
            Trung bình
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
            <Info className="w-3 h-3" />
            Thấp
          </span>
        );
      default:
        return null;
    }
  };

  const getDiscrepancyLocationBadge = (location: string) => {
    switch (location) {
      case 'source-collected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
            Nguồn ↔ Thu thập
          </span>
        );
      case 'processed-provided':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
            Biên tập ↔ Cung cấp
          </span>
        );
      case 'all':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
            Tất cả
          </span>
        );
      default:
        return null;
    }
  };

  const handleSendNotification = () => {
    if (!selectedReconciliation) return;

    // Mock notification send
    alert(`Đã gửi thông báo cho Quản trị viên về ${selectedReconciliation.discrepanciesFound} bản ghi bất thường trong "${selectedReconciliation.database}"`);
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Đối soát dữ liệu" icon={FileText} />

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={discrepancyFilter}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setDiscrepancyFilter(e.target.value)}
              className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Lọc theo trạng thái bất thường"
            >
              <option value="all">Tất cả</option>
              <option value="with-discrepancy">Có bất thường</option>
              <option value="no-discrepancy">Không có bất thường</option>
            </select>
          </div>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên nguồn, mô tả, mã cấu hình..."
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Tìm kiếm quy trình đối soát"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-slate-600 w-[320px]">
                  Quy trình đối soát dữ liệu
                </th>
                <th className="px-6 py-4 text-left text-sm text-slate-600 w-[150px]">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-sm text-slate-600 w-[160px]">
                  Lần đối soát cuối
                </th>
                <th className="px-6 py-4 text-left text-sm text-slate-600 w-[140px]">
                  <div>Bản ghi dữ liệu nguồn</div>
                  <div className="text-xs text-slate-500 font-normal">(Hệ thống cung cấp)</div>
                </th>
                <th className="px-6 py-4 text-left text-sm text-slate-600 w-[140px]">
                  <div>Bản ghi Kho DLDC</div>
                  <div className="text-xs text-slate-500 font-normal">(Đã thu thập)</div>
                </th>
                <th className="px-6 py-4 text-left text-sm text-slate-600 w-[140px]">
                  <div>Bản ghi đích</div>
                  <div className="text-xs text-slate-500 font-normal">(Đã cung cấp)</div>
                </th>
                <th className="px-6 py-4 text-left text-sm text-slate-600 w-[160px]">
                  Tỷ lệ chính xác
                </th>
                <th className="px-6 py-4 text-center text-sm text-slate-600 w-[100px]">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Database className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-900 mb-1">{item.database}</div>
                        <div className="text-xs text-slate-500">{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{item.lastReconciliation}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">
                      {item.sourceRecords.toLocaleString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">
                      {item.collectedRecords.toLocaleString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">
                      {item.providedRecords.toLocaleString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${item.successRate >= 99.99 ? 'bg-green-500' :
                            item.successRate >= 99.9 ? 'bg-blue-500' :
                              item.successRate >= 99.5 ? 'bg-amber-500' :
                                'bg-red-500'
                            }`}
                          style={{ width: `${item.successRate}%` } as any}
                        />
                      </div>
                      <span className="text-xs text-slate-900 whitespace-nowrap">
                        {item.successRate.toFixed(3)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setConfirmReconcileId(item.id)}
                        disabled={reconcilingId === item.id || item.status === 'in-progress'}
                        className={`p-2 rounded-lg transition-colors ${reconcilingId === item.id || item.status === 'in-progress'
                          ? 'text-slate-300 cursor-not-allowed'
                          : 'text-blue-600 hover:bg-blue-50'
                          }`}
                        title="Đối soát ngay"
                      >
                        {reconcilingId === item.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <PlayCircle className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => setSelectedReconciliation(item)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="py-12 text-center">
            <Database className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Không tìm thấy quy trình đối soát nào</p>
          </div>
        )}
      </div>

      {/* Confirm Reconciliation Modal */}
      {confirmReconcileId && (() => {
        const item = reconciliationData.find(r => r.id === confirmReconcileId);
        if (!item) return null;
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
              <div className="px-6 py-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-slate-900">Xác nhận đối soát dữ liệu</h2>
                    <p className="text-sm text-slate-600">Khởi tạo quy trình đối soát</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-blue-900 mb-2">
                        <strong>Cơ sở dữ liệu:</strong> {item.database}
                      </div>
                      <div className="text-xs text-blue-700">
                        {item.processDescription}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Bản ghi nguồn:</span>
                    <span className="text-slate-900">{item.sourceRecords.toLocaleString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Bản ghi Kho DLDC:</span>
                    <span className="text-slate-900">{item.collectedRecords.toLocaleString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Bản ghi đích:</span>
                    <span className="text-slate-900">{item.providedRecords.toLocaleString('vi-VN')}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 mt-2 flex items-center justify-between text-sm">
                    <span className="text-slate-600">Lần đối soát cuối:</span>
                    <span className="text-slate-900">{item.lastReconciliation}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-2 text-xs text-slate-600">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p>
                    Quá trình đối soát sẽ gửi yêu cầu tới hệ thống nguồn và hệ thống đích để so sánh dữ liệu.
                    Thời gian thực hiện có thể mất vài phút tùy thuộc vào kích thước dữ liệu.
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setConfirmReconcileId(null)}
                  className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleStartReconciliation(item)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PlayCircle className="w-4 h-4" />
                  Xác nhận đối soát
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Detail Modal - Danh sách bản ghi bất thường */}
      {selectedReconciliation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-slate-900">Chi tiết đối soát - Danh sách bản ghi bất thường</h2>
                  <p className="text-sm text-slate-600">{selectedReconciliation.database}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReconciliation(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Đóng chi tiết"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6">
              {/* Summary */}
              <div className={`${selectedReconciliation.discrepanciesFound > 0 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'} border rounded-lg p-4 mb-6`}>
                <div className="flex items-start gap-3">
                  {selectedReconciliation.discrepanciesFound > 0 ? (
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`text-sm ${selectedReconciliation.discrepanciesFound > 0 ? 'text-amber-900' : 'text-green-900'}`}>
                        {selectedReconciliation.discrepanciesFound > 0 ? (
                          <>
                            Phát hiện <strong>{selectedReconciliation.discrepanciesFound.toLocaleString('vi-VN')}</strong> bản ghi bất thường
                          </>
                        ) : (
                          <strong>Không phát hiện bất thường - Dữ liệu đối soát hoàn hảo</strong>
                        )}
                      </div>
                      {getStatusBadge(selectedReconciliation.status)}
                    </div>
                    <div className={`text-xs ${selectedReconciliation.discrepanciesFound > 0 ? 'text-amber-700' : 'text-green-700'} mb-2`}>
                      Lần đối soát cuối: {selectedReconciliation.lastReconciliation}
                    </div>
                    <div className="grid grid-cols-4 gap-4 mt-3">
                      <div className="bg-white bg-opacity-50 rounded p-2">
                        <div className="text-xs text-slate-600 mb-1">Bản ghi nguồn</div>
                        <div className="text-sm">{selectedReconciliation.sourceRecords.toLocaleString('vi-VN')}</div>
                      </div>
                      <div className="bg-white bg-opacity-50 rounded p-2">
                        <div className="text-xs text-slate-600 mb-1">Bản ghi Kho DLDC</div>
                        <div className="text-sm">{selectedReconciliation.collectedRecords.toLocaleString('vi-VN')}</div>
                      </div>
                      <div className="bg-white bg-opacity-50 rounded p-2">
                        <div className="text-xs text-slate-600 mb-1">Bản ghi đích</div>
                        <div className="text-sm">{selectedReconciliation.providedRecords.toLocaleString('vi-VN')}</div>
                      </div>
                      <div className="bg-white bg-opacity-50 rounded p-2">
                        <div className="text-xs text-slate-600 mb-1">Tỷ lệ chính xác</div>
                        <div className="text-sm">{selectedReconciliation.successRate.toFixed(3)}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Discrepancies Table */}
              {discrepancyRecords[selectedReconciliation.id] && discrepancyRecords[selectedReconciliation.id].length > 0 ? (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs text-slate-600 w-[120px]">
                            Mã bản ghi
                          </th>
                          <th className="px-4 py-3 text-left text-xs text-slate-600 w-[130px]">
                            Trường dữ liệu
                          </th>
                          <th className="px-4 py-3 text-left text-xs text-slate-600">
                            Giá trị nguồn
                          </th>
                          <th className="px-4 py-3 text-left text-xs text-slate-600">
                            Giá trị Kho DLDC
                          </th>
                          <th className="px-4 py-3 text-left text-xs text-slate-600">
                            Giá trị đích
                          </th>
                          <th className="px-4 py-3 text-left text-xs text-slate-600 w-[120px]">
                            Loại bất thường
                          </th>
                          <th className="px-4 py-3 text-left text-xs text-slate-600 w-[110px]">
                            Mức độ
                          </th>
                          <th className="px-4 py-3 text-left text-xs text-slate-600 w-[140px]">
                            Thời gian phát hiện
                          </th>
                          <th className="px-4 py-3 text-left text-xs text-slate-600 w-[140px]">
                            Vị trí
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {discrepancyRecords[selectedReconciliation.id].map((record) => (
                          <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="text-xs text-blue-700 font-mono">
                                {record.recordId}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-xs text-slate-900">
                                {record.fieldName}
                              </div>
                            </td>
                            <td className={`px-4 py-3 ${(record.discrepancyLocation === 'source-collected' || record.discrepancyLocation === 'all') ? 'bg-red-50' : ''}`}>
                              <div className="text-xs text-slate-700 max-w-[200px] truncate" title={record.sourceValue}>
                                {record.sourceValue || <span className="text-slate-400 italic">N/A</span>}
                              </div>
                            </td>
                            <td className={`px-4 py-3 ${(record.discrepancyLocation === 'source-collected' || record.discrepancyLocation === 'all') ? 'bg-red-50' : ''}`}>
                              <div className="text-xs text-slate-700 max-w-[200px] truncate" title={record.collectedValue}>
                                {record.collectedValue || <span className="text-slate-400 italic">N/A</span>}
                              </div>
                            </td>
                            <td className={`px-4 py-3 ${(record.discrepancyLocation === 'processed-provided' || record.discrepancyLocation === 'all') ? 'bg-red-50' : ''}`}>
                              <div className="text-xs text-slate-700 max-w-[200px] truncate" title={record.providedValue}>
                                {record.providedValue || <span className="text-slate-400 italic">N/A</span>}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {getDiscrepancyTypeBadge(record.discrepancyType)}
                            </td>
                            <td className="px-4 py-3">
                              {getSeverityBadge(record.severity)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-xs text-slate-600">
                                {record.detectedAt}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {getDiscrepancyLocationBadge(record.discrepancyLocation)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center border border-slate-200 rounded-lg bg-green-50">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-green-700 text-sm mb-1">
                    <strong>Không có bản ghi bất thường</strong>
                  </p>
                  <p className="text-green-600 text-xs">
                    Tất cả {selectedReconciliation.recordsChecked.toLocaleString('vi-VN')} bản ghi đã đối soát chính xác
                  </p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                {discrepancyRecords[selectedReconciliation.id] ? (
                  <>Hiển thị: {discrepancyRecords[selectedReconciliation.id].length} / {selectedReconciliation.discrepanciesFound.toLocaleString('vi-VN')} bản ghi</>
                ) : (
                  <>Không có bản ghi bất thường</>
                )}
              </div>
              <div className="flex gap-3">
                {selectedReconciliation.discrepanciesFound > 0 && (
                  <button
                    onClick={() => setIsNotificationModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Bell className="w-4 h-4" />
                    Gửi thông báo
                  </button>
                )}
                <button
                  onClick={() => setSelectedReconciliation(null)}
                  className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Notification Modal */}
      {isNotificationModalOpen && (
        <SendNotificationModal
          isOpen={isNotificationModalOpen}
          onClose={() => setIsNotificationModalOpen(false)}
          title={`Gửi thông báo - ${selectedReconciliation?.database}`}
          defaultRecipient="Quản trị viên hệ thống"
        />
      )}

    </div>
  );
}