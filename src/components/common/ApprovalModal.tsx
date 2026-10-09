import { X, AlertCircle, Clock, CheckCircle, XCircle, User, FileText, Link2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface ApprovalHistory {
  id: string;
  action: 'submitted' | 'approved' | 'rejected' | 'updated';
  user: string;
  role: string;
  timestamp: string;
  note?: string;
}

interface RelatedInfo {
  id: string;
  type: 'record' | 'source' | 'warning';
  title: string;
  description: string;
  status?: 'success' | 'warning' | 'error';
}

interface Approver {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
}

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: any;
  onApprove: (approverId: string, note: string) => void;
  onReject: (approverId: string, reason: string) => void;
}

const mockApprovers: Approver[] = [
  { id: '1', name: 'Nguyễn Văn A', role: 'Trưởng phòng', department: 'Phòng Quản lý Dữ liệu' },
  { id: '2', name: 'Trần Thị B', role: 'Phó phòng', department: 'Phòng Quản lý Dữ liệu' },
  { id: '3', name: 'Lê Văn C', role: 'Chuyên viên chính', department: 'Phòng Công nghệ Thông tin' },
  { id: '4', name: 'Phạm Thị D', role: 'Trưởng phòng', department: 'Phòng Pháp chế' },
];

const mockHistory: ApprovalHistory[] = [
  {
    id: '1',
    action: 'submitted',
    user: 'Hoàng Văn E',
    role: 'Chuyên viên',
    timestamp: '20/01/2025 09:30',
    note: 'Gửi phê duyệt bản ghi sau khi gộp dữ liệu từ 3 nguồn'
  },
  {
    id: '2',
    action: 'updated',
    user: 'Hoàng Văn E',
    role: 'Chuyên viên',
    timestamp: '19/01/2025 15:20',
    note: 'Cập nhật thông tin ngày sinh từ nguồn bổ sung'
  },
  {
    id: '3',
    action: 'updated',
    user: 'System',
    role: 'Hệ thống',
    timestamp: '19/01/2025 14:45',
    note: 'Tự động gộp dữ liệu từ 3 nguồn'
  },
];

const mockRelatedInfo: RelatedInfo[] = [
  {
    id: '1',
    type: 'record',
    title: 'Bản ghi tương tự',
    description: 'Tìm thấy 2 bản ghi có thông tin tương tự (cùng số CCCD)',
    status: 'warning'
  },
  {
    id: '2',
    type: 'source',
    title: 'Nguồn dữ liệu',
    description: 'Dữ liệu được gộp từ 3 nguồn: Hà Nội, TP.HCM, Đà Nẵng',
    status: 'success'
  },
  {
    id: '3',
    type: 'warning',
    title: 'Cần xác minh',
    description: '2 trường dữ liệu cần được kiểm tra trước khi phê duyệt',
    status: 'warning'
  },
];

export function ApprovalModal({ isOpen, onClose, record, onApprove, onReject }: ApprovalModalProps) {
  const [selectedApprover, setSelectedApprover] = useState<string>('');
  const [note, setNote] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'history' | 'related' | 'warnings'>('info');

  if (!isOpen || !record) return null;

  const handleApprove = () => {
    if (!selectedApprover) {
      alert('Vui lòng chọn người phê duyệt');
      return;
    }
    if (!note.trim()) {
      const confirmed = window.confirm('Bạn chưa nhập ghi chú. Bạn có chắc muốn tiếp tục?');
      if (!confirmed) return;
    }
    onApprove(selectedApprover, note);
  };

  const handleReject = () => {
    if (!selectedApprover) {
      alert('Vui lòng chọn người phê duyệt');
      return;
    }
    if (!note.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }
    onReject(selectedApprover, note);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'submitted':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'updated':
        return <FileText className="w-4 h-4 text-purple-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-600" />;
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'submitted':
        return 'Gửi phê duyệt';
      case 'approved':
        return 'Đã phê duyệt';
      case 'rejected':
        return 'Đã từ chối';
      case 'updated':
        return 'Cập nhật';
      default:
        return action;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'submitted':
        return 'bg-blue-50 border-blue-200';
      case 'approved':
        return 'bg-green-50 border-green-200';
      case 'rejected':
        return 'bg-red-50 border-red-200';
      case 'updated':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-white">
          <div>
            <h3 className="text-slate-900 mb-1">Phê duyệt Dữ liệu</h3>
            <p className="text-sm text-slate-600">Mã bản ghi: {record.recordCode}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg transition-colors" title="Đóng" aria-label="Đóng"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Main Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Record Summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h4 className="text-sm text-slate-900 mb-3">Thông tin bản ghi</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-600">Họ và tên:</span>
                  <p className="text-sm text-slate-900">{record.fullName}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-600">Số CCCD:</span>
                  <p className="text-sm text-slate-900">{record.cccdNumber}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-600">Ngày sinh:</span>
                  <p className="text-sm text-slate-900">{record.birthDate}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-600">Nơi sinh:</span>
                  <p className="text-sm text-slate-900">{record.birthPlace}</p>
                </div>
              </div>
            </div>

            {/* Approver Selection */}
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm text-slate-900">Chọn người phê duyệt</h4>
                <span className="text-red-500">*</span>
              </div>
              <select
                value={selectedApprover}
                onChange={(e) => setSelectedApprover(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled hidden>-- Chọn người phê duyệt --</option>
                {mockApprovers.map((approver) => (
                  <option key={approver.id} value={approver.id}>
                    {approver.name} - {approver.role} ({approver.department})
                  </option>
                ))}
              </select>
            </div>

            {/* Note/Comment */}
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm text-slate-900">Ghi chú/Ý kiến</h4>
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nhập ghi chú hoặc ý kiến về bản ghi này..."
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-xs text-slate-500 mt-2">
                {note.length} ký tự
              </p>
            </div>

            {/* Tabs */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <div className="flex border-b border-slate-200 bg-slate-50">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`flex-1 px-4 py-3 text-sm transition-colors ${
                    activeTab === 'info'
                      ? 'bg-white border-b-2 border-blue-600 text-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Thông tin chi tiết
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 px-4 py-3 text-sm transition-colors ${
                    activeTab === 'history'
                      ? 'bg-white border-b-2 border-blue-600 text-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Lịch sử ({mockHistory.length})
                </button>
                <button
                  onClick={() => setActiveTab('related')}
                  className={`flex-1 px-4 py-3 text-sm transition-colors ${
                    activeTab === 'related'
                      ? 'bg-white border-b-2 border-blue-600 text-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Thông tin liên quan
                </button>
                <button
                  onClick={() => setActiveTab('warnings')}
                  className={`flex-1 px-4 py-3 text-sm transition-colors ${
                    activeTab === 'warnings'
                      ? 'bg-white border-b-2 border-blue-600 text-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    Cảnh báo
                    <span className="w-5 h-5 bg-orange-500 text-white rounded-full text-xs flex items-center justify-center">
                      2
                    </span>
                  </div>
                </button>
              </div>

              <div className="p-4">
                {activeTab === 'info' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <span className="text-xs text-slate-600">Mã dữ liệu:</span>
                        <p className="text-sm text-slate-900 mt-1">{record.recordCode}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <span className="text-xs text-slate-600">Giới tính:</span>
                        <p className="text-sm text-slate-900 mt-1">{record.gender}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <span className="text-xs text-slate-600">Nguồn chính:</span>
                        <p className="text-sm text-slate-900 mt-1">{record.primarySource}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <span className="text-xs text-slate-600">Ngày cập nhật:</span>
                        <p className="text-sm text-slate-900 mt-1">{record.updateDate}</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <span className="text-xs text-slate-600">Nguồn bổ sung:</span>
                      <p className="text-sm text-slate-900 mt-1">
                        {Array.isArray(record.secondarySource) 
                          ? record.secondarySource.join(', ') 
                          : record.secondarySource}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="space-y-4">
                    {/* Timeline */}
                    <div className="relative">
                      {mockHistory.map((item, index) => (
                        <div key={item.id} className="relative pl-8 pb-6 last:pb-0">
                          {/* Timeline line */}
                          {index < mockHistory.length - 1 && (
                            <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-slate-200"></div>
                          )}
                          
                          {/* Timeline dot */}
                          <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center">
                            {getActionIcon(item.action)}
                          </div>

                          {/* Content */}
                          <div className={`border rounded-lg p-3 ${getActionColor(item.action)}`}>
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <span className="text-sm text-slate-900">{getActionText(item.action)}</span>
                                <p className="text-xs text-slate-600 mt-1">
                                  {item.user} • {item.role}
                                </p>
                              </div>
                              <span className="text-xs text-slate-500">{item.timestamp}</span>
                            </div>
                            {item.note && (
                              <p className="text-sm text-slate-700 mt-2 pl-3 border-l-2 border-slate-300">
                                {item.note}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'related' && (
                  <div className="space-y-3">
                    {mockRelatedInfo.filter(info => info.type !== 'warning').map((info) => (
                      <div
                        key={info.id}
                        className={`border rounded-lg p-4 ${
                          info.status === 'success' ? 'bg-green-50 border-green-200' :
                          info.status === 'warning' ? 'bg-orange-50 border-orange-200' :
                          'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            info.status === 'success' ? 'bg-green-600' :
                            info.status === 'warning' ? 'bg-orange-600' :
                            'bg-slate-600'
                          }`}>
                            {info.type === 'record' && <FileText className="w-4 h-4 text-white" />}
                            {info.type === 'source' && <Link2 className="w-4 h-4 text-white" />}
                          </div>
                          <div className="flex-1">
                            <h5 className="text-sm text-slate-900 mb-1">{info.title}</h5>
                            <p className="text-sm text-slate-600">{info.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'warnings' && (
                  <div className="space-y-3">
                    {mockRelatedInfo.filter(info => info.type === 'warning').map((info) => (
                      <div
                        key={info.id}
                        className="bg-orange-50 border border-orange-200 rounded-lg p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h5 className="text-sm text-orange-900 mb-1">{info.title}</h5>
                            <p className="text-sm text-orange-700">{info.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Additional warning */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h5 className="text-sm text-orange-900 mb-1">Trường dữ liệu không khớp</h5>
                          <p className="text-sm text-orange-700">
                            Trường "Ngày sinh" và "Nguồn chính" có sự khác biệt giữa các nguồn dữ liệu
                          </p>
                          <div className="mt-2 space-y-1">
                            <div className="text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded">
                              • Ngày sinh: 15/03/1990 (Hà Nội) vs 15/04/1990 (TP.HCM)
                            </div>
                            <div className="text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded">
                              • Nguồn chính: Thiếu xác nhận từ nguồn Đà Nẵng
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Quick Info */}
          <div className="w-80 border-l border-slate-200 bg-slate-50 p-6 overflow-y-auto">
            <h4 className="text-sm text-slate-900 mb-4">Thông tin nhanh</h4>
            
            {/* Status */}
            <div className="bg-white rounded-lg p-4 mb-4 border border-slate-200">
              <span className="text-xs text-slate-600">Trạng thái hiện tại:</span>
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-700">Đang chờ duyệt</span>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-lg p-4 mb-4 border border-slate-200">
              <h5 className="text-xs text-slate-600 mb-3">Thống kê</h5>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Số nguồn dữ liệu:</span>
                  <span className="text-sm text-slate-900">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Trường hợp lệ:</span>
                  <span className="text-sm text-green-600">8/10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Cần kiểm tra:</span>
                  <span className="text-sm text-orange-600">2/10</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm text-blue-900 mb-1">Lưu ý</h5>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Kiểm tra kỹ các trường có cảnh báo</li>
                    <li>• Xác minh nguồn dữ liệu</li>
                    <li>• Nhập ghi chú khi từ chối</li>
                    <li>• Chọn người phê duyệt phù hợp</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Hủy
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReject}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Từ chối
            </button>
            <button
              onClick={handleApprove}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Phê duyệt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
