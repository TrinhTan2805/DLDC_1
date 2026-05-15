import { X, Calendar, User, Clock, Database, CheckCircle, AlertCircle, Search, Edit2, Check, Download } from 'lucide-react';
import { useState } from 'react';
import { ErrorListModal } from './ErrorListModal';

interface ErrorRecord {
  id: string;
  field: string;
  originalValue: string;
  errorType: string;
  errorTypeColor: 'red' | 'orange';
  description: string;
  suggestion: string;
  status: 'pending' | 'fixed' | 'ignored';
  autoFixable: boolean;
}

interface ConfigDetailModalProps {
  config: any;
  onClose: () => void;
}

export function ConfigDetailModal({ config, onClose }: ConfigDetailModalProps) {
  const statusConfig = {
    processing: { 
      label: 'Đang chạy', 
      color: 'text-blue-700', 
      bg: 'bg-blue-50', 
      border: 'border-blue-200',
      icon: Clock
    },
    completed: { 
      label: 'Hoàn thành', 
      color: 'text-green-700', 
      bg: 'bg-green-50', 
      border: 'border-green-200',
      icon: CheckCircle
    },
    pending: { 
      label: 'Chờ xử lý', 
      color: 'text-amber-700', 
      bg: 'bg-amber-50', 
      border: 'border-amber-200',
      icon: AlertCircle
    }
  };

  const status = statusConfig[config.status];
  const StatusIcon = status.icon;

  // Mock processing steps data
  const processingSteps = [
    { step: 'Làm sạch dữ liệu', progress: 100, status: 'completed' },
    { step: 'Chuẩn hóa dữ liệu', progress: 85, status: 'processing' },
    { step: 'Biến đổi dữ liệu', progress: 0, status: 'pending' },
  ];

  // Mock error logs
  const errorLogs: ErrorRecord[] = [
    { id: '1', field: 'Ngày sinh', originalValue: '10/15/2000', errorType: 'Định dạng không hợp lệ', errorTypeColor: 'red', description: 'Ngày sinh không đúng định dạng', suggestion: 'Sửa thành 15/10/2000', status: 'pending', autoFixable: true },
    { id: '2', field: 'Số CCCD', originalValue: '', errorType: 'Thiếu dữ liệu', errorTypeColor: 'orange', description: 'Số CCCD không được cung cấp', suggestion: 'Nhập số CCCD', status: 'pending', autoFixable: false },
    { id: '3', field: 'Địa chỉ', originalValue: '123@#$', errorType: 'Ký tự đặc biệt', errorTypeColor: 'red', description: 'Địa chỉ chứa ký tự đặc biệt', suggestion: 'Xóa ký tự đặc biệt', status: 'pending', autoFixable: true },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredErrorLogs, setFilteredErrorLogs] = useState(errorLogs);
  const [showErrorListModal, setShowErrorListModal] = useState(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    setFilteredErrorLogs(
      errorLogs.filter(log => 
        log.field.toLowerCase().includes(term.toLowerCase()) ||
        log.errorType.toLowerCase().includes(term.toLowerCase()) ||
        log.description.toLowerCase().includes(term.toLowerCase()) ||
        log.suggestion.toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  const handleFixError = (id: string) => {
    const updatedLogs = filteredErrorLogs.map(log => 
      log.id === id ? { ...log, status: 'fixed' } : log
    );
    setFilteredErrorLogs(updatedLogs);
  };

  const handleIgnoreError = (id: string) => {
    const updatedLogs = filteredErrorLogs.map(log => 
      log.id === id ? { ...log, status: 'ignored' } : log
    );
    setFilteredErrorLogs(updatedLogs);
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h3 className="text-slate-900">Chi tiết Cấu hình Xử lý</h3>
            <p className="text-sm text-slate-600 mt-1">{config.dataSource}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Đóng" aria-label="Đóng"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 ${status.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <StatusIcon className={`w-5 h-5 ${status.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-slate-600 mb-1">Trạng thái</div>
                    <div className={`text-sm ${status.color}`}>{status.label}</div>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Database className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-slate-600 mb-1">Tổng số bản ghi</div>
                    <div className="text-sm text-slate-900">{config.totalRecords.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-slate-600 mb-1">Đã xử lý</div>
                    <div className="text-sm text-slate-900">{config.processedRecords.toLocaleString()} ({config.progress}%)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="text-sm text-slate-900 mb-4">Thông tin cơ bản</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="text-xs text-slate-600">Thời gian bắt đầu</div>
                    <div className="text-sm text-slate-900">{config.startTime}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="text-xs text-slate-600">Người thực hiện</div>
                    <div className="text-sm text-slate-900">{config.executor}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="text-xs text-slate-600">Nguồn dữ liệu</div>
                    <div className="text-sm text-slate-900">{config.sourceType}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="text-xs text-slate-600">Quy tắc áp dụng</div>
                    <div className="text-sm text-slate-900">{config.appliedRules}/{config.totalRules} quy tắc</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Processing Steps */}
            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="text-sm text-slate-900 mb-4">Quy trình xử lý (3 bước)</h4>
              <div className="space-y-3">
                {processingSteps.map((step, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-900">{index + 1}. {step.step}</span>
                      <span className="text-sm text-blue-600">{step.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          step.status === 'completed' ? 'bg-green-600' : 
                          step.status === 'processing' ? 'bg-blue-600' : 
                          'bg-slate-300'
                        }`}
                        style={{ width: `${step.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Summary with Button */}
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm text-red-900 mb-1">Danh sách bản ghi lỗi</h4>
                  <p className="text-xs text-red-700">Có 12 bản ghi cần xem xét và xử lý</p>
                </div>
                <button
                  onClick={() => setShowErrorListModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <AlertCircle className="w-4 h-4" />
                  Xem danh sách lỗi
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Đóng
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Error List Modal */}
      {showErrorListModal && (
        <ErrorListModal
          dataSource={config.dataSource}
          onClose={() => setShowErrorListModal(false)}
        />
      )}
      </div>
    </div>
  );
}