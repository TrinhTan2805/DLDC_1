import React from 'react';
import { X, Check } from 'lucide-react';

interface ProvisionReconciliationApiModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiData?: any;
  onSave?: (data: any) => void;
}

export function ProvisionReconciliationApiModal({ isOpen, onClose, apiData, onSave }: ProvisionReconciliationApiModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        id: apiData?.id || Math.random().toString(36).substr(2, 9),
        name: (e.target as any).name.value,
        targetSystem: (e.target as any).targetSystem.value,
        schedule: (e.target as any).schedule.value,
        linkedApi: (e.target as any).linkedApi.value,
        status: (e.target as any).status.value,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">
            {apiData ? 'Cập nhật API Đối soát' : 'Thêm mới API Đối soát'}
          </h2>
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
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Tên tiến trình đối soát <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm font-medium"
                  placeholder="Nhập tên tiến trình đối soát..."
                  defaultValue={apiData ? apiData.name : ''}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Hệ thống đối tác đối soát <span className="text-red-500">*</span>
                </label>
                <input
                  name="targetSystem"
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  placeholder="Ví dụ: Hệ thống Bộ Tư pháp, Bộ Tài chính..."
                  defaultValue={apiData ? apiData.targetSystem : ''}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Lịch trình chạy đối soát <span className="text-red-500">*</span>
                </label>
                <select
                  name="schedule"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  defaultValue={apiData ? apiData.schedule : 'Định kỳ (Hàng ngày) / Theo yêu cầu'}
                >
                  <option value="Định kỳ (Hàng ngày) / Theo yêu cầu">Định kỳ (Hàng ngày) / Theo yêu cầu</option>
                  <option value="Định kỳ (Hàng tuần) / Theo yêu cầu">Định kỳ (Hàng tuần) / Theo yêu cầu</option>
                  <option value="Định kỳ (Hàng tháng) / Theo yêu cầu">Định kỳ (Hàng tháng) / Theo yêu cầu</option>
                  <option value="Theo yêu cầu">Chỉ chạy theo yêu cầu</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Trạng thái hoạt động <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm font-medium"
                  defaultValue={apiData ? apiData.status : 'active'}
                >
                  <option value="active">Kích hoạt (Hoạt động)</option>
                  <option value="inactive">Tạm ngưng</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  API Cung cấp dữ liệu liên kết đối soát
                </label>
                <select
                  name="linkedApi"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  defaultValue={apiData ? apiData.linkedApi : 'Lấy danh sách Hộ tịch'}
                >
                  <option value="Lấy danh sách Hộ tịch">Lấy danh sách Hộ tịch (/api/v1/hotich/list)</option>
                  <option value="Đồng bộ dữ liệu THADS">Đồng bộ dữ liệu THADS (/api/v1/thads/sync)</option>
                  <option value="Đọc thông tin Biện pháp bảo đảm">Đọc thông tin Biện pháp bảo đảm (/api/v1/bpbd/get)</option>
                  <option value="Tra cứu Cơ sở dữ liệu Pháp luật">Tra cứu Cơ sở dữ liệu Pháp luật (/api/v1/phapluat/search)</option>
                </select>
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
              {apiData ? 'Lưu thay đổi' : 'Tạo mới'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
