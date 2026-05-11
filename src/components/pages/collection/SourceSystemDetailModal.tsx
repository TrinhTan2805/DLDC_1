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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-sans backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
             <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
               <span>Hệ thống nguồn</span>
               <ChevronRight className="w-3 h-3" />
               <span className="text-blue-600">Chi tiết</span>
             </div>
             <h2 className="text-xl font-bold text-slate-900">
               {data.systemName || 'Thông tin hệ thống'}
             </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto bg-[#fcfcfc]">
          <div className="space-y-8">
            {/* THÔNG TIN CHUNG */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-[15px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" />
                Thông tin cơ bản
              </h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1">
                  <dt className="text-sm font-semibold text-slate-500 uppercase tracking-tight">Tên hệ thống</dt>
                  <dd className="text-xs text-slate-900 font-medium leading-relaxed">{data.systemName || '-'}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-sm font-semibold text-slate-500 uppercase tracking-tight">Loại nguồn</dt>
                  <dd className="mt-1">
                    {data.sourceType ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold border ${
                        data.sourceType === 'Trong ngành' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {data.sourceType}
                      </span>
                    ) : '-'}
                  </dd>
                </div>
                <div className="col-span-2 space-y-1">
                  <dt className="text-sm font-semibold text-slate-500 uppercase tracking-tight">Tên đơn vị quản lý</dt>
                  <dd className="text-xs text-slate-900 font-medium leading-relaxed">{data.unitName || '-'}</dd>
                </div>
                <div className="col-span-2 space-y-1">
                  <dt className="text-sm font-semibold text-slate-500 uppercase tracking-tight flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" /> Địa chỉ
                  </dt>
                  <dd className="text-xs text-slate-700 font-medium italic leading-relaxed">{data.address || '-'}</dd>
                </div>
              </div>
            </div>

            {/* THÔNG TIN LIÊN HỆ */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-[15px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                Đầu mối liên hệ
              </h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1">
                  <dt className="text-sm font-semibold text-slate-500 uppercase tracking-tight">Người đại diện</dt>
                  <dd className="text-xs text-slate-900 font-medium flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {data.contactPerson || '-'}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-sm font-semibold text-slate-500 uppercase tracking-tight">Số điện thoại</dt>
                  <dd className="text-xs text-slate-900 font-medium flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {data.phone || '-'}
                  </dd>
                </div>
                <div className="col-span-2 space-y-1">
                  <dt className="text-sm font-semibold text-slate-500 uppercase tracking-tight">Email</dt>
                  <dd className="text-xs text-blue-600 font-medium flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span className="underline underline-offset-4">{data.email || '-'}</span>
                  </dd>
                </div>
              </div>
            </div>

            {/* GHI CHÚ */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-[15px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                Ghi chú
              </h3>
              <div className="text-xs text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100 italic leading-relaxed">
                {data.note || 'Không có ghi chú nào.'}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-slate-100 flex justify-end bg-white">
          <button
 onClick={onClose}
 className="px-6 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
 >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
