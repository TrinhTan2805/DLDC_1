import React from 'react';
import { X, Check, Shield } from 'lucide-react';

interface ProvisionAccessControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiName: string;
  onSave?: (data: any) => void;
}

export function ProvisionAccessControlModal({ isOpen, onClose, apiName, onSave }: ProvisionAccessControlModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    
    // Collect selected scopes
    const scopes: string[] = [];
    if (form.scopeRead.checked) scopes.push('Đọc (GET)');
    if (form.scopeWrite.checked) scopes.push('Ghi (POST/PUT)');
    if (form.scopeReconcile.checked) scopes.push('Đối soát (RECON)');

    if (onSave) {
      onSave({
        id: Math.random().toString(36).substr(2, 9),
        organization: form.organization.value,
        scopes: scopes.join(', '),
        ipWhitelist: form.ipWhitelist.value || 'Tất cả IP',
        validFrom: form.validFrom.value,
        validTo: form.validTo.value,
        status: 'Hợp lệ'
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-bold text-slate-800">
              Cấp quyền truy cập API
            </h2>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            
            {/* Target API info alert */}
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200/50 flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">API được chọn cấp quyền</span>
                <span className="text-sm font-extrabold text-slate-800 mt-1 block">{apiName}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Partner Organization */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Đơn vị / Tổ chức thụ hưởng <span className="text-red-500">*</span>
                </label>
                <select
                  name="organization"
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm font-medium"
                >
                  <option value="Công an tỉnh Bắc Ninh">Công an tỉnh Bắc Ninh</option>
                  <option value="Sở Y tế tỉnh Bắc Ninh">Sở Y tế tỉnh Bắc Ninh</option>
                  <option value="Sở Lao động - Thương binh và Xã hội">Sở Lao động - Thương binh và Xã hội</option>
                  <option value="Sở Tài chính tỉnh Bắc Ninh">Sở Tài chính tỉnh Bắc Ninh</option>
                  <option value="Sở Giáo dục và Đào tạo">Sở Giáo dục và Đào tạo</option>
                  <option value="UBND Huyện Tiên Du">UBND Huyện Tiên Du</option>
                  <option value="UBND Thành phố Bắc Ninh">UBND Thành phố Bắc Ninh</option>
                </select>
              </div>

              {/* Access Scope Checkboxes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phạm vi quyền truy cập (Scopes) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                    <input type="checkbox" name="scopeRead" defaultChecked className="rounded border-slate-300 text-amber-600 focus:ring-amber-500" />
                    <div className="text-xs font-semibold text-slate-700">Đọc dữ liệu (GET)</div>
                  </label>
                  <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                    <input type="checkbox" name="scopeWrite" className="rounded border-slate-300 text-amber-600 focus:ring-amber-500" />
                    <div className="text-xs font-semibold text-slate-700">Ghi dữ liệu (POST)</div>
                  </label>
                  <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                    <input type="checkbox" name="scopeReconcile" className="rounded border-slate-300 text-amber-600 focus:ring-amber-500" />
                    <div className="text-xs font-semibold text-slate-700">Chạy đối soát (RECON)</div>
                  </label>
                </div>
              </div>

              {/* IP Whitelist */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Danh sách IP được phép kết nối (IP Whitelist)
                </label>
                <input
                  name="ipWhitelist"
                  type="text"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm font-mono"
                  placeholder="Ví dụ: 192.168.10.25, 203.162.4.52 (để trống nếu cho phép tất cả)"
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Hiệu lực từ ngày <span className="text-red-500">*</span>
                </label>
                <input
                  name="validFrom"
                  type="date"
                  required
                  defaultValue="2026-05-19"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Hiệu lực đến ngày <span className="text-red-500">*</span>
                </label>
                <input
                  name="validTo"
                  type="date"
                  required
                  defaultValue="2027-05-19"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                />
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center transition-colors font-medium text-sm"
            >
              <Check className="w-4 h-4 mr-2" />
              Cấp quyền truy cập
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
