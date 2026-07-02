import { ChangeEvent, useState } from 'react';
import { Send, Info, CalendarClock, UserCheck, Clock } from 'lucide-react';
import { approvers } from '../../categoryConstants';
import { BaseModal } from '../../../../common/BaseModal';

interface ExpireRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: {
    id: string;
    code: string;
    name: string;
  } | null;
  onSubmit: (data: { expireDate: string; reason: string; note: string; approver: string }) => void;
}

export function ExpireRequestModal({
  isOpen,
  onClose,
  entity,
  onSubmit
}: ExpireRequestModalProps) {
  const [formData, setFormData] = useState({
    expireDate: '',
    reason: '',
    note: '',
    approver: ''
  });

  if (!isOpen || !entity) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Gửi yêu cầu hết hiệu lực danh mục"
      maxWidth="max-w-lg"
      customHeaderIcon={
        <Clock className="w-5 h-5 text-blue-600 mr-3" />
      }
      footer={
        <>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all text-[13px]"
          >
            Hủy
          </button>
          <button
            onClick={() => onSubmit(formData)}
            disabled={!formData.expireDate || !formData.reason || !formData.approver}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all text-[13px] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
          >
            <Send className="w-4 h-4" />
            Trình duyệt hết hiệu lực
          </button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-[13px] text-blue-800">
          <Info className="w-5 h-5 shrink-0 text-blue-500" />
          <p>
            Danh mục bị ngừng sử dụng sẽ <strong>không được dùng</strong> trong các quan hệ và truy vấn dữ liệu tham chiếu mới, nhưng vẫn được lưu trữ cho mục đích thống kê, tra cứu.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[13px] text-slate-700 mb-1">Danh mục áp dụng</label>
            <div className="w-full px-4 py-2 border border-slate-200 bg-slate-50 rounded-xl text-[13px] text-slate-900 flex justify-between">
              <span>{entity.name}</span>
              <span className="text-slate-500 font-mono">{entity.code}</span>
            </div>
          </div>

          <div>
            <label className="block text-[13px] text-slate-700 mb-1">
              Thời điểm hết hiệu lực <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <CalendarClock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                title="Thời điểm hết hiệu lực"
                type="date"
                value={formData.expireDate}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, expireDate: e.target.value })}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl bg-white text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] text-slate-700 mb-1">
              Lý do ngừng sử dụng <span className="text-red-500">*</span>
            </label>
            <select
              title="Lý do ngừng sử dụng"
              value={formData.reason}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-white text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            >
              <option value="">-- Chọn lý do --</option>
              <option value="Tích hợp vào danh mục khác">Tích hợp vào danh mục khác</option>
              <option value="Quy định pháp luật thay đổi">Pháp luật, Quyết định bổ sung thay đổi</option>
              <option value="Dữ liệu lỗi, cấu trúc cũ">Cấu trúc dữ liệu cũ, không còn phù hợp</option>
              <option value="Khác">Lý do khác...</option>
            </select>
          </div>

          <div>
            <label className="block text-[13px] text-slate-700 mb-1">
              Lãnh đạo phê duyệt <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                title="Lãnh đạo phê duyệt"
                value={formData.approver}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, approver: e.target.value })}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl bg-white text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              >
                <option value="">-- Chọn lãnh đạo trình duyệt --</option>
                {approvers.map(a => (
                  <option key={a.id} value={a.id}>{a.name} - {a.position} ({a.department})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[13px] text-slate-700 mb-1">Ghi chú thêm</label>
            <textarea
              title="Ghi chú thêm"
              rows={3}
              value={formData.note}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, note: e.target.value })}
              placeholder="Nhập ghi chú chi tiết trình lãnh đạo..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
            />
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
