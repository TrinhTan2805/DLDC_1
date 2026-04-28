import { X } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-lg">
          <h2 className="text-xl font-semibold text-slate-800">
            Chi tiết hệ thống nguồn
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4 border-b pb-2">Thông tin chung</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                <div>
                  <dt className="text-sm font-medium text-slate-500">Tên hệ thống</dt>
                  <dd className="mt-1 text-sm text-slate-900 font-semibold">{data.systemName || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Loại nguồn</dt>
                  <dd className="mt-1 text-sm text-slate-900">
                    {data.sourceType ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {data.sourceType}
                      </span>
                    ) : '-'}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4 border-b pb-2">Thông tin đơn vị</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-slate-500">Tên đơn vị</dt>
                  <dd className="mt-1 text-sm text-slate-900">{data.unitName || '-'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-slate-500">Địa chỉ</dt>
                  <dd className="mt-1 text-sm text-slate-900">{data.address || '-'}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4 border-b pb-2">Thông tin liên hệ</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                <div>
                  <dt className="text-sm font-medium text-slate-500">Đầu mối liên hệ</dt>
                  <dd className="mt-1 text-sm text-slate-900">{data.contactPerson || '-'}</dd>
                </div>
                <div className="hidden sm:block"></div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Số điện thoại</dt>
                  <dd className="mt-1 text-sm text-slate-900">{data.phone || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Email</dt>
                  <dd className="mt-1 text-sm text-slate-900">{data.email || '-'}</dd>
                </div>
              </dl>
            </div>

            {data.note && (
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-4 border-b pb-2">Thông tin khác</h3>
                <dl>
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Ghi chú</dt>
                    <dd className="mt-1 text-sm text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-wrap">
                      {data.note}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end sticky bottom-0 bg-white rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
