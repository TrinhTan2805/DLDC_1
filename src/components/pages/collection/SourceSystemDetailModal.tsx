import { X, Globe, User, Phone, Mail, MapPin, FileText, ChevronRight } from 'lucide-react';

interface SourceSystem {
  id: string;
  systemName: string;
  unitName: string;
  sourceType: string;
  address: string;
  phone: string;
  email: string;
  contactPerson: string;
  note: string;
}

interface SourceSystemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SourceSystem | null;
}

export function SourceSystemDetailModal({ isOpen, onClose, data }: SourceSystemDetailModalProps) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 font-sans backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200" style={{ fontSize: '13px' }}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
             <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
               <span>Hệ thống nguồn</span>
               <ChevronRight className="w-3 h-3" />
               <span className="text-blue-600">Chi tiết</span>
             </div>
             <h2 className="text-lg font-semibold text-slate-800">
               {data.systemName || 'Thông tin hệ thống'}
             </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto bg-[#fcfcfc] space-y-6">
          {/* THÔNG TIN CHUNG */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="col-span-2 space-y-1">
                <dt className="text-[12px] font-semibold text-slate-400 uppercase tracking-tight">Tên hệ thống</dt>
                <dd className="text-[13px] text-slate-800 font-medium">{data.systemName || '-'}</dd>
              </div>
              <div className="col-span-2 space-y-1">
                <dt className="text-[12px] font-semibold text-slate-400 uppercase tracking-tight">Tên đơn vị quản lý</dt>
                <dd className="text-[13px] text-slate-800 font-medium">{data.unitName || '-'}</dd>
              </div>
              <div className="col-span-2 space-y-1">
                <dt className="text-[12px] font-semibold text-slate-400 uppercase tracking-tight flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-slate-400" /> Địa chỉ
                </dt>
                <dd className="text-[13px] text-slate-700 font-medium italic">{data.address || '-'}</dd>
              </div>
            </div>
          </div>

          {/* THÔNG TIN LIÊN HỆ */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              Đầu mối liên hệ
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-1">
                <dt className="text-[12px] font-semibold text-slate-400 uppercase tracking-tight">Người đại diện</dt>
                <dd className="text-[13px] text-slate-800 font-medium flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {data.contactPerson || '-'}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-[12px] font-semibold text-slate-400 uppercase tracking-tight">Số điện thoại</dt>
                <dd className="text-[13px] text-slate-800 font-medium flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {data.phone || '-'}
                </dd>
              </div>
              <div className="col-span-2 space-y-1">
                <dt className="text-[12px] font-semibold text-slate-400 uppercase tracking-tight">Email</dt>
                <dd className="text-[13px] text-blue-600 font-medium flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span className="underline underline-offset-4">{data.email || '-'}</span>
                </dd>
              </div>
            </div>
          </div>

          {/* GHI CHÚ */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              Ghi chú
            </h3>
            <div className="text-[13px] text-slate-600 bg-slate-50 p-3 rounded border border-slate-100 italic leading-relaxed">
              {data.note || 'Không có ghi chú nào.'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-medium text-[#020817] bg-white border border-[#e2e8f0] rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
