import { useState } from 'react';
import {
  X, CheckCircle2, XCircle, AlertTriangle, FileText, Database,
  Clock, User, Settings, Shield, Eye, MessageSquare, ChevronDown, ChevronUp
} from 'lucide-react';

interface ApprovalReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceData?: {
    id: string;
    name: string;
    submitter: string;
    submitDate: string;
    priority: 'normal' | 'urgent';
    accessScope: 'public' | 'approval' | 'restricted';
    dataType: string;
    protocol: string;
    frequency: string;
    receiver: string;
    targetSystem: string;
  };
}

const defaultService = {
  id: 'SVC-2025-047',
  name: 'API Tra cứu Đăng ký Kinh doanh',
  submitter: 'Phạm Minh Đức (Quản trị hệ thống)',
  submitDate: '14/04/2025 09:15',
  priority: 'urgent' as const,
  accessScope: 'public' as const,
  dataType: 'CSDL Đăng ký Kinh doanh + Ngành nghề + Lịch sử nộp thuế',
  protocol: 'API RESTful (GET)',
  frequency: 'Tức thời (Real-time)',
  receiver: 'Bộ Kế hoạch và Đầu tư',
  targetSystem: 'Hệ thống Thông tin Đầu tư Quốc gia (MPI-TTDLQG)',
};

export function ApprovalReviewModal({ isOpen, onClose, serviceData }: ApprovalReviewModalProps) {
  if (!isOpen) return null;

  const svc = serviceData ?? defaultService;

  const [note, setNote] = useState('');
  const [showResult, setShowResult] = useState<'approved' | 'rejected' | 'requested' | null>(null);
  const [showInfoSection, setShowInfoSection] = useState(true);

  const isPublicWithSensitive = svc.accessScope === 'public';

  const quickReasons = [
    'Dữ liệu chứa thông tin nhạy cảm (CCCD, địa chỉ), không phù hợp để công khai.',
    'Chưa có văn bản pháp lý xác nhận phạm vi chia sẻ.',
    'Cần bổ sung thêm thông tin đầu mối tại đơn vị nhận.',
    'Quota request/ngày chưa được thiết lập, tiềm ẩn rủi ro quá tải.',
  ];

  const handleDecision = (type: 'approve' | 'reject' | 'request') => {
    if (type === 'approve') {
      setShowResult('approved');
    } else if (type === 'reject') {
      setShowResult('rejected');
    } else if (type === 'request') {
      setShowResult('requested');
    }
  };

  if (showResult) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm text-center">
          {showResult === 'approved' ? (
            <>
              <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800 mb-2">Đã phê duyệt thành công!</h3>
              <p className="text-sm text-slate-500 mb-6">Dịch vụ <strong>"{svc.name}"</strong> đã được phê duyệt và chuyển sang trạng thái <span className="text-green-600 font-semibold">Đã duyệt</span>.</p>
            </>
          ) : showResult === 'rejected' ? (
            <>
              <XCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800 mb-2">Đã từ chối yêu cầu</h3>
              <p className="text-sm text-slate-500 mb-6">Hệ thống đã gửi thông báo từ chối đến <strong>{svc.submitter}</strong>. Dịch vụ chuyển sang trạng thái <span className="text-red-600 font-semibold">Từ chối</span>.</p>
            </>
          ) : (
            <>
              <MessageSquare className="w-14 h-14 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800 mb-2">Đã gửi yêu cầu bổ sung</h3>
              <p className="text-sm text-slate-500 mb-6">Thông tin yêu cầu đã được gửi đến <strong>{svc.submitter}</strong>. Dịch vụ chuyển sang trạng thái <span className="text-amber-600 font-semibold">Chờ bổ sung</span>.</p>
            </>
          )}
          <button onClick={onClose} className="w-full px-4 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-medium text-sm">Đóng</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-slate-900">Thông tin phê duyệt dịch vụ</h2>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1"><User className="w-3 h-3" /> {svc.submitter}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {svc.submitDate}</span>
              <span className="font-mono text-slate-300">{svc.id}</span>
            </div>
          </div>
          <button onClick={onClose} aria-label="Đóng" title="Đóng" className="p-1.5 hover:bg-slate-100 rounded"><X className="w-5 h-5 text-slate-500" /></button>
        </div>

        {/* Cảnh báo vi phạm */}
        {isPublicWithSensitive && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700">⚠ Cảnh báo vi phạm chính sách bảo mật</p>
              <p className="text-xs text-red-600 mt-0.5">Dịch vụ được cấu hình <strong>Công khai (Public)</strong> nhưng có thể chứa dữ liệu nhạy cảm (thông tin thuế, ngành nghề kinh doanh). Vui lòng kiểm tra kỹ trước khi phê duyệt.</p>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Thông tin dịch vụ */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center text-blue-600">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{svc.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-mono">{svc.id}</p>
              </div>
            </div>
          </div>
          {/* Thông tin tổng quan */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <button
              type="button"
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
              onClick={() => setShowInfoSection(!showInfoSection)}
            >
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Settings className="w-4 h-4 text-slate-400" /> Thông tin cấu hình chi tiết</span>
              {showInfoSection ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {showInfoSection && (
              <div className="divide-y divide-slate-100">
                {[
                  { label: 'Nguồn dữ liệu', value: svc.dataType, icon: <Database className="w-4 h-4 text-blue-500" /> },
                  { label: 'Giao thức kết nối', value: svc.protocol, icon: <Settings className="w-4 h-4 text-indigo-500" /> },
                  { label: 'Tần suất chia sẻ', value: svc.frequency, icon: <Clock className="w-4 h-4 text-amber-500" /> },
                  { label: 'Phạm vi truy cập', value: svc.accessScope === 'public' ? '🌐 Công khai (Public)' : svc.accessScope === 'approval' ? '🔒 Yêu cầu phê duyệt' : '🔐 Nội bộ', icon: <Shield className="w-4 h-4 text-red-500" /> },
                  { label: 'Đơn vị nhận', value: svc.receiver, icon: <User className="w-4 h-4 text-slate-400" /> },
                  { label: 'Hệ thống đích', value: svc.targetSystem, icon: <FileText className="w-4 h-4 text-slate-400" /> },
                ].map((row) => (
                  <div key={row.label} className="flex items-start gap-3 px-4 py-3">
                    <span className="shrink-0 mt-0.5">{row.icon}</span>
                    <span className="text-xs text-slate-500 w-36 shrink-0">{row.label}</span>
                    <span className="text-sm font-medium text-slate-800">{row.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lịch sử chỉnh sửa & phê duyệt */}
          <div className="border border-slate-200 rounded-lg p-5 bg-white">
            <h4 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              Lịch sử trình duyệt & xử lý
            </h4>
            <div className="space-y-4">
              {[
                { time: '14/04/2025 09:15', actor: 'Phạm Minh Đức', action: 'Gửi yêu cầu phê duyệt lần đầu', type: 'submit' },
                { time: '13/04/2025 16:40', actor: 'Nguyễn Văn A', action: 'Từ chối - Yêu cầu bổ sung thông tin đầu mối liên hệ và tài liệu pháp lý', type: 'reject' },
                { time: '12/04/2025 14:00', actor: 'Phạm Minh Đức', action: 'Tạo dịch vụ và lưu nháp ban đầu', type: 'draft' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center shrink-0 ${
                      item.type === 'submit' ? 'bg-blue-500 text-white' : item.type === 'reject' ? 'bg-red-500 text-white' : 'bg-slate-300 text-white'
                    }`}>
                      {item.type === 'submit' ? <CheckCircle2 className="w-4 h-4" />
                        : item.type === 'reject' ? <XCircle className="w-4 h-4" />
                        : <FileText className="w-4 h-4" />}
                    </div>
                    {i < 2 && <div className="w-0.5 bg-slate-200 flex-1 my-1" />}
                  </div>
                  <div className="pb-2">
                    <p className="text-sm font-bold text-slate-900">{item.actor}</p>
                    <p className="text-xs text-slate-600 mt-1">{item.action}</p>
                    <p className="text-[10px] text-slate-400 mt-1 italic font-medium">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Khu vực ra quyết định */}
          <div className="border-2 border-blue-100 bg-blue-50/20 rounded-xl p-5 space-y-5">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Xử lý phê duyệt
            </h4>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="approval-note" className="block text-sm font-semibold text-slate-700 mb-2">
                  Nội dung phê duyệt <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="approval-note"
                  rows={4}
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder:text-slate-400"
                  placeholder="Nhập nội dung nhận xét, lý do phê duyệt hoặc từ chối..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <button
                  type="button"
                  disabled={!note.trim()}
                  onClick={() => handleDecision('approve')}
                  className="group px-5 py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-green-100 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-bold text-sm">Phê duyệt</span>
                </button>
                
                <button
                  type="button"
                  disabled={!note.trim()}
                  onClick={() => handleDecision('reject')}
                  className="group px-5 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-red-100 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                >
                  <XCircle className="w-5 h-5" />
                  <span className="font-bold text-sm">Từ chối</span>
                </button>

                <button
                  type="button"
                  disabled={!note.trim()}
                  onClick={() => handleDecision('request')}
                  className="group px-5 py-3.5 bg-white border-2 border-amber-400 text-amber-600 hover:bg-amber-50 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="font-bold text-sm">Yêu cầu bổ sung</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
