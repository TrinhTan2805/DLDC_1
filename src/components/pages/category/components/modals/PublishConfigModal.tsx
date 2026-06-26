import { useState } from 'react';
import { X, Save, Share2, Globe, Users, Building2 } from 'lucide-react';

interface PublishConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (config: { scopes: string[]; effectiveDate: string }) => void;
  recordName: string;
}

export function PublishConfigModal({ isOpen, onClose, onConfirm, recordName }: PublishConfigModalProps) {
  const [scopes, setScopes] = useState<string[]>(['internal']);
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Cấu hình công khai danh mục</h3>
          </div>
          <button
            onClick={onClose}
            title="Đóng" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-sm text-slate-700">
              Cấu hình phạm vi chia sẻ cho danh mục <span className="font-semibold text-slate-900">{recordName}</span>. 
              Sau khi được duyệt, dữ liệu sẽ khả dụng trên các kho dữ liệu tương ứng.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-800 mb-3">Phạm vi công khai *</label>
            <div className="space-y-3">
              <label 
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${scopes.includes('internal') ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-blue-300'}`}
                onClick={(e) => {
                   e.preventDefault();
                   setScopes(prev => prev.includes('internal') ? prev.filter(s => s !== 'internal') : [...prev, 'internal']);
                }}
              >
                <div className="mt-0.5">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${scopes.includes('internal') ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                    {scopes.includes('internal') && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className={`w-4 h-4 ${scopes.includes('internal') ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="font-semibold text-slate-900">Nội bộ ngành</span>
                  </div>
                  <p className="text-sm text-slate-500">Chỉ chia sẻ cho các đơn vị, cơ quan và cán bộ trong cùng hệ thống Tư pháp.</p>
                </div>
              </label>

              <label 
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${scopes.includes('extended') ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-blue-300'}`}
                onClick={(e) => {
                   e.preventDefault();
                   setScopes(prev => prev.includes('extended') ? prev.filter(s => s !== 'extended') : [...prev, 'extended']);
                }}
              >
                <div className="mt-0.5">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${scopes.includes('extended') ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                    {scopes.includes('extended') && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className={`w-4 h-4 ${scopes.includes('extended') ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="font-semibold text-slate-900">Mở rộng liên ngành</span>
                  </div>
                  <p className="text-sm text-slate-500">Chia sẻ qua nền tảng NDXP cho các Bộ, Ngành, và Địa phương khác.</p>
                </div>
              </label>

              <label 
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${scopes.includes('public') ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-blue-300'}`}
                onClick={(e) => {
                   e.preventDefault();
                   setScopes(prev => prev.includes('public') ? prev.filter(s => s !== 'public') : [...prev, 'public']);
                }}
              >
                <div className="mt-0.5">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${scopes.includes('public') ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                    {scopes.includes('public') && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className={`w-4 h-4 ${scopes.includes('public') ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="font-semibold text-slate-900">Toàn dân</span>
                  </div>
                  <p className="text-sm text-slate-500">Công khai hoàn toàn trên Cổng Dữ liệu mở, ai cũng có quyền xem và tải xuống.</p>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ngày bắt đầu hiệu lực *</label>
            <input
              type="date"
              title="Ngày hiệu lực"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            title="Hủy" className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-medium transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={() => onConfirm({ scopes, effectiveDate })}
            disabled={scopes.length === 0}
            title="Công bố danh mục" className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Globe className="w-5 h-5" />
            Công bố danh mục
          </button>
        </div>
      </div>
    </div>
  );
}
