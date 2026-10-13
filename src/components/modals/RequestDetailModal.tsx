import { X, FileText, User, Building2, Calendar, AlertCircle, Database, Server, Download, PlayCircle, CheckCircle, Clock, Filter, Code, FileDown, Eye, History as HistoryIcon } from 'lucide-react';

interface RequestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: any;
  onProcess?: (requestId: string) => void;
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
}

export function RequestDetailModal({ 
  isOpen, 
  onClose, 
  request,
  onProcess,
  onApprove,
  onReject
}: RequestDetailModalProps) {
  if (!isOpen || !request) return null;

  const statusConfig = {
    pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Chờ xử lý', icon: Clock },
    processing: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Đang xử lý', icon: Clock },
    completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Hoàn thành', icon: CheckCircle },
    failed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Thất bại', icon: AlertCircle }
  };

  const priorityConfig = {
    low: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Thấp' },
    medium: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Trung bình' },
    high: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Cao' },
    urgent: { bg: 'bg-red-100', text: 'text-red-700', label: 'Kh���n cấp' }
  };

  const currentStatus = statusConfig[request.status as keyof typeof statusConfig];
  const currentPriority = priorityConfig[request.priority as keyof typeof priorityConfig];
  const StatusIcon = currentStatus.icon;

  // Mock data for detailed view
  const requestDetails = {
    database: request.database || 'DB_HOTICH',
    table: request.table || 'tbl_khai_sinh',
    selectedFields: request.selectedFields || [
      'ho_ten',
      'ngay_sinh',
      'noi_sinh',
      'gioi_tinh',
      'ho_ten_cha',
      'ho_ten_me',
      'so_giay_khai_sinh',
      'ngay_cap'
    ],
    filters: request.filters || "ngay_sinh >= '2020-01-01' AND noi_sinh LIKE '%Hà Nội%'",
    format: request.format || 'JSON',
    estimatedRows: request.estimatedRows || 1500,
    deliveryDate: request.deliveryDate || '2024-12-15',
    approver: request.approver || 'Nguyễn Thị B',
    approverDepartment: request.approverDepartment || 'Cục Hành chính tư pháp',
    approverEmail: request.approverEmail || 'nguyen.b@moj.gov.vn',
    approverPhone: request.approverPhone || '024-3936-1234',
    purpose: request.purpose,
    notes: request.notes || 'Dữ liệu phục vụ đối chiếu, xác minh thông tin công dân khi cấp căn cước công dân.',
    processLogs: request.processLogs || [
      {
        id: 1,
        timestamp: '2024-12-09 10:30:15',
        action: 'Tạo yêu cầu',
        user: request.requester,
        details: 'Yêu cầu mới được tạo từ hệ thống'
      },
      {
        id: 2,
        timestamp: '2024-12-09 10:35:20',
        action: 'Phê duyệt',
        user: 'Nguyễn Thị B',
        details: 'Yêu cầu được phê duyệt, chuyển sang trạng thái chờ xử lý'
      }
    ]
  };

  if (request.status === 'processing') {
    requestDetails.processLogs.push({
      id: 3,
      timestamp: '2024-12-09 10:40:00',
      action: 'Bắt đầu xử lý',
      user: 'Hệ thống tự động',
      details: 'Kết nối database và truy xuất dữ liệu'
    });
  }

  if (request.status === 'completed') {
    requestDetails.processLogs.push(
      {
        id: 3,
        timestamp: '2024-12-09 10:40:00',
        action: 'Bắt đầu xử lý',
        user: 'Hệ thống tự động',
        details: 'Kết nối database và truy xuất dữ liệu'
      },
      {
        id: 4,
        timestamp: '2024-12-09 11:42:30',
        action: 'Hoàn thành',
        user: 'Hệ thống tự động',
        details: `Đã xuất ${request.estimatedRows || 250} bản ghi thành công`
      }
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-slate-900">Chi tiết yêu cầu cung cấp dữ liệu</h2>
              <p className="text-sm text-slate-600">Mã yêu cầu: {request.requestCode}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Đóng" aria-label="Đóng"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status & Priority */}
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 ${currentStatus.bg} ${currentStatus.text} rounded-lg flex items-center gap-2`}>
              <StatusIcon className="w-4 h-4" />
              <span className="text-sm">{currentStatus.label}</span>
            </div>
            <div className={`px-3 py-1.5 ${currentPriority.bg} ${currentPriority.text} rounded-lg flex items-center gap-2`}>
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Độ ưu tiên: {currentPriority.label}</span>
            </div>
          </div>

          {/* Request Information */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
            <h3 className="text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-slate-600" />
              Thông tin yêu cầu
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-600">Người yêu cầu</label>
                <div className="text-slate-900 mt-1">{request.requester}</div>
              </div>
              <div>
                <label className="text-sm text-slate-600">Đơn vị</label>
                <div className="text-slate-900 mt-1">{request.requesterDepartment}</div>
              </div>
              <div>
                <label className="text-sm text-slate-600">Email liên hệ</label>
                <div className="text-slate-900 mt-1">{request.requesterEmail || 'nguyen.x@bocongan.gov.vn'}</div>
              </div>
              <div>
                <label className="text-sm text-slate-600">Số điện thoại</label>
                <div className="text-slate-900 mt-1">{request.requesterPhone || '024-3826-5555'}</div>
              </div>
              <div>
                <label className="text-sm text-slate-600">Ngày yêu cầu</label>
                <div className="text-slate-900 mt-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {request.requestDate}
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-600">Ngày mong muốn nhận</label>
                <div className="text-slate-900 mt-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {requestDetails.deliveryDate}
                </div>
              </div>
            </div>
          </div>

          {/* Approver Information */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h3 className="text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Thông tin phê duyệt
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-green-700">Người cấp/Phê duyệt</label>
                <div className="text-green-900 mt-1">{requestDetails.approver}</div>
              </div>
              <div>
                <label className="text-sm text-green-700">Đơn vị cấp</label>
                <div className="text-green-900 mt-1">{requestDetails.approverDepartment}</div>
              </div>
              <div>
                <label className="text-sm text-green-700">Email</label>
                <div className="text-green-900 mt-1">{requestDetails.approverEmail}</div>
              </div>
              <div>
                <label className="text-sm text-green-700">Số điện thoại</label>
                <div className="text-green-900 mt-1">{requestDetails.approverPhone}</div>
              </div>
            </div>
          </div>

          {/* Database & Table Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <h3 className="text-slate-900 mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              Thông tin cơ sở dữ liệu
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-blue-700">Database</label>
                <div className="text-blue-900 mt-1 font-mono bg-white px-3 py-2 rounded border border-blue-300">
                  {requestDetails.database}
                </div>
              </div>
              <div>
                <label className="text-sm text-blue-700">Bảng dữ liệu</label>
                <div className="text-blue-900 mt-1 font-mono bg-white px-3 py-2 rounded border border-blue-300">
                  {requestDetails.table}
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="text-sm text-blue-700 mb-2 block">Các trường dữ liệu được yêu cầu</label>
              <div className="bg-white border border-blue-300 rounded-lg p-3">
                <div className="flex flex-wrap gap-2">
                  {requestDetails.selectedFields.map((field: any, idx: number) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {requestDetails.filters && (
              <div>
                <label className="text-sm text-blue-700 mb-2 block flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Điều kiện lọc dữ liệu (WHERE clause)
                </label>
                <div className="bg-slate-900 text-green-400 rounded-lg p-3 font-mono text-sm">
                  {requestDetails.filters}
                </div>
              </div>
            )}
          </div>

          {/* API Endpoint */}
          {request.apiEndpoint && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
              <h3 className="text-slate-900 mb-3 flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-600" />
                API Endpoint
              </h3>
              <div className="bg-white border border-purple-300 rounded-lg p-3">
                <code className="text-purple-900 font-mono">
                  {request.apiEndpoint}
                </code>
              </div>
              <p className="text-xs text-purple-700 mt-2">
                Endpoint để đơn vị yêu cầu có thể gọi API lấy dữ liệu sau khi xử lý hoàn tất
              </p>
            </div>
          )}

          {/* Export Configuration */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
            <h3 className="text-slate-900 mb-4 flex items-center gap-2">
              <FileDown className="w-5 h-5 text-amber-600" />
              Cấu hình xuất dữ liệu
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-amber-700">Định dạng</label>
                <div className="text-amber-900 mt-1 bg-white px-3 py-2 rounded border border-amber-300">
                  {requestDetails.format}
                </div>
              </div>
              <div>
                <label className="text-sm text-amber-700">Số bản ghi ước tính</label>
                <div className="text-amber-900 mt-1 bg-white px-3 py-2 rounded border border-amber-300">
                  {requestDetails.estimatedRows.toLocaleString()}
                </div>
              </div>
              <div>
                <label className="text-sm text-amber-700">Kích thước ước tính</label>
                <div className="text-amber-900 mt-1 bg-white px-3 py-2 rounded border border-amber-300">
                  ~{Math.round(requestDetails.estimatedRows * 0.5)} KB
                </div>
              </div>
            </div>
          </div>

          {/* Purpose & Notes */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
            <h3 className="text-slate-900 mb-3">Mục đích sử dụng</h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              {requestDetails.purpose}
            </p>
            {requestDetails.notes && (
              <>
                <h3 className="text-slate-900 mb-3 mt-4">Ghi chú bổ sung</h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {requestDetails.notes}
                </p>
              </>
            )}
          </div>

          {/* Completed File Info */}
          {request.status === 'completed' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-5">
              <h3 className="text-slate-900 mb-4 flex items-center gap-2">
                <Download className="w-5 h-5 text-green-600" />
                File dữ liệu đã xuất
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-green-700">Tên file</label>
                  <div className="text-green-900 mt-1 font-mono bg-white px-3 py-2 rounded border border-green-300">
                    {request.requestCode}_civil_registry.json
                  </div>
                </div>
                <div>
                  <label className="text-sm text-green-700">Kích thước</label>
                  <div className="text-green-900 mt-1 bg-white px-3 py-2 rounded border border-green-300">
                    {Math.round((request.estimatedRows || 250) * 0.5)} KB
                  </div>
                </div>
                <div>
                  <label className="text-sm text-green-700">Ngày hoàn thành</label>
                  <div className="text-green-900 mt-1 bg-white px-3 py-2 rounded border border-green-300">
                    {request.completedDate}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-green-700">Xử lý bởi</label>
                  <div className="text-green-900 mt-1 bg-white px-3 py-2 rounded border border-green-300">
                    {request.processedBy}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Process Logs */}
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h3 className="text-slate-900 mb-4 flex items-center gap-2">
              <HistoryIcon className="w-5 h-5 text-slate-600" />
              Lịch sử xử lý
            </h3>
            <div className="space-y-3">
              {requestDetails.processLogs.map((log: any, idx: number) => (
                <div key={log.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      idx === requestDetails.processLogs.length - 1
                        ? 'bg-blue-100'
                        : 'bg-slate-100'
                    }`}>
                      <div className={`w-3 h-3 rounded-full ${
                        idx === requestDetails.processLogs.length - 1
                          ? 'bg-blue-600'
                          : 'bg-slate-400'
                      }`}></div>
                    </div>
                    {idx < requestDetails.processLogs.length - 1 && (
                      <div className="w-0.5 h-full bg-slate-200 my-1"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-900">{log.action}</span>
                      <span className="text-xs text-slate-500">{log.timestamp}</span>
                    </div>
                    <div className="text-xs text-slate-600 mb-1">{log.user}</div>
                    <div className="text-xs text-slate-500">{log.details}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            {request.status === 'pending' && 'Yêu cầu đang chờ xử lý'}
            {request.status === 'processing' && 'Yêu cầu đang được xử lý'}
            {request.status === 'completed' && 'Yêu cầu đã hoàn thành'}
            {request.status === 'failed' && 'Yêu cầu xử lý thất bại'}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Đóng
            </button>
            
            {request.status === 'pending' && onApprove && (
              <button
                onClick={() => {
                  onApprove(request.id);
                  onClose();
                }}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Phê duyệt
              </button>
            )}

            {request.status === 'pending' && onProcess && (
              <button
                onClick={() => {
                  onProcess(request.id);
                  onClose();
                }}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <PlayCircle className="w-5 h-5" />
                Bắt đầu xử lý
              </button>
            )}

            {request.status === 'completed' && (
              <button
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Tải xuống
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}