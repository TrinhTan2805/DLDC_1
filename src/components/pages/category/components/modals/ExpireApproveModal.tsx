import { useState, useEffect, ChangeEvent } from 'react';
import { CheckCircle2, XCircle, Loader2, Database, Clock, Check, CalendarClock, UserCheck, FileText } from 'lucide-react';
import { MasterDataEntity } from '../../categoryTypes';
import { BaseModal } from '../../../../common/BaseModal';

const REASON_LABELS: Record<string, string> = {
  'Tích hợp vào danh mục khác': 'Tích hợp vào danh mục khác',
  'Quy định pháp luật thay đổi': 'Pháp luật, Quyết định bổ sung thay đổi',
  'Dữ liệu lỗi, cấu trúc cũ': 'Cấu trúc dữ liệu cũ, không còn phù hợp',
  'Khác': 'Lý do khác',
};

interface ExpireApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: MasterDataEntity | null;
  request?: any;
  onApprove: (reason: string) => void;
  onReject: (reason: string) => void;
}

export function ExpireApproveModal({
  isOpen,
  onClose,
  entity,
  request,
  onApprove,
  onReject
}: ExpireApproveModalProps) {
  const [checking, setChecking] = useState(true);
  const [checkResult, setCheckResult] = useState<'safe' | 'has_constraints' | null>(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (isOpen) {
      setChecking(true);
      setCheckResult(null);
      setNote('');
      const timer = setTimeout(() => {
        setChecking(false);
        setCheckResult(Math.random() > 0.2 ? 'safe' : 'has_constraints');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, entity]);

  if (!isOpen || !entity) return null;

  const changes = request?.changes;
  const expireDate = changes?.expireDate
    ? new Date(changes.expireDate).toLocaleDateString('vi-VN')
    : '--';
  const reason = changes?.reason ? (REASON_LABELS[changes.reason] || changes.reason) : '--';
  const approver = changes?.approver || '--';
  const reqNote = changes?.note || '';

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Phê duyệt hết hiệu lực"
      maxWidth="max-w-lg"
      customHeaderIcon={<Clock className="w-5 h-5 text-blue-600 mr-3" />}
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all text-[13px]"
          >
            Đóng
          </button>
          <div className="flex gap-2">
            <button
              disabled={checking}
              onClick={() => onReject(note)}
              className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all text-[13px] disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" /> Từ chối
            </button>
            <button
              disabled={checking || checkResult === 'has_constraints'}
              onClick={() => onApprove(note)}
              className={`px-6 py-2.5 ${checkResult === 'has_constraints' ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'} rounded-xl flex items-center justify-center gap-2 transition-all text-[13px]`}
              title={checkResult === 'has_constraints' ? 'Không thể phê duyệt do vướng ràng buộc khóa ngoại' : 'Phê duyệt hết hiệu lực'}
            >
              <Check className="w-4 h-4" /> Phê duyệt
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Request Info */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center gap-2 text-slate-700 text-[13px] font-medium">
            <FileText className="w-4 h-4 text-blue-500" /> Thông tin yêu cầu
          </div>
          <div className="p-4 space-y-3">
            {/* Entity */}
            <div className="flex justify-between items-start gap-4">
              <span className="text-[13px] text-slate-500 whitespace-nowrap">Danh mục áp dụng</span>
              <span className="text-[13px] text-slate-900 text-right font-medium">{entity.name}</span>
            </div>
            {/* Expire Date */}
            <div className="flex justify-between items-center gap-4">
              <span className="text-[13px] text-slate-500 whitespace-nowrap flex items-center gap-1.5">
                <CalendarClock className="w-3.5 h-3.5" /> Thời điểm hết hiệu lực
              </span>
              <span className="text-[13px] text-slate-900 font-medium">{expireDate}</span>
            </div>
            {/* Reason */}
            <div className="flex justify-between items-start gap-4">
              <span className="text-[13px] text-slate-500 whitespace-nowrap">Lý do ngừng sử dụng</span>
              <span className="text-[13px] text-slate-900 text-right">{reason}</span>
            </div>
            {/* Approver */}
            <div className="flex justify-between items-center gap-4">
              <span className="text-[13px] text-slate-500 whitespace-nowrap flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" /> Lãnh đạo phê duyệt
              </span>
              <span className="text-[13px] text-slate-900">{approver}</span>
            </div>
            {/* Note */}
            {reqNote && (
              <div className="flex justify-between items-start gap-4">
                <span className="text-[13px] text-slate-500 whitespace-nowrap">Ghi chú</span>
                <span className="text-[13px] text-slate-700 text-right italic">{reqNote}</span>
              </div>
            )}
            {/* Requester */}
            {request?.requestedBy && (
              <div className="flex justify-between items-center gap-4 pt-2 border-t border-slate-100">
                <span className="text-[13px] text-slate-500">Người gửi yêu cầu</span>
                <span className="text-[13px] text-slate-600">{request.requestedBy} — {request.requestedDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* FK Check */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2 text-slate-700 text-[13px] font-medium">
            <Database className="w-4 h-4" /> Kiểm tra ràng buộc dữ liệu
          </div>
          <div className="p-5 flex flex-col items-center justify-center min-h-[100px] text-center">
            {checking ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <div className="text-[13px] text-slate-600 animate-pulse">
                  Đang truy vấn kiểm tra khóa ngoại (Foreign Key) trên các hệ thống tham chiếu...
                </div>
              </div>
            ) : checkResult === 'safe' ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-[13px] font-medium text-green-700">Đủ điều kiện ngừng sử dụng</p>
                <p className="text-[13px] text-green-600/80">Không phát hiện dữ liệu nào đang tham chiếu trực tiếp đến danh mục này.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <p className="text-[13px] font-medium text-red-700">Cảnh báo ràng buộc toàn vẹn</p>
                <p className="text-[13px] text-red-600/80">Phát hiện 124 bản ghi từ hệ thống CSDL Cán bộ đang tham chiếu. Yêu cầu xem xét kỹ trước khi duyệt.</p>
              </div>
            )}
          </div>
        </div>

        {/* Review Note */}
        {!checking && (
          <div className="space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <label className="block text-[13px] text-slate-700">Ý kiến phản hồi / Lý do (nếu từ chối)</label>
            <textarea
              title="Ghi chú thêm"
              rows={3}
              value={note}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
              placeholder="Nhập ghi chú hoặc lý do thay đổi..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
            />
          </div>
        )}
      </div>
    </BaseModal>
  );
}
