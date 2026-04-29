import React from 'react';
import { X, Check } from 'lucide-react';

interface ProvisionDataRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProvisionDataRequestModal({ isOpen, onClose }: ProvisionDataRequestModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Tạo yêu cầu kết xuất dữ liệu</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Thông tin yêu cầu</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cơ quan / Hệ thống yêu cầu <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  placeholder="Nhập tên cơ quan hoặc hệ thống đích..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Loại dữ liệu cần kết xuất <span className="text-red-500">*</span></label>
                <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500">
                  <option value="">Chọn loại dữ liệu</option>
                  <option value="1">Dữ liệu Hộ tịch điện tử</option>
                  <option value="2">Dữ liệu Thi hành án</option>
                  <option value="3">Dữ liệu Danh mục dùng chung</option>
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Từ ngày</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Đến ngày</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Định dạng kết xuất <span className="text-red-500">*</span></label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="format" value="excel" className="text-amber-600 focus:ring-amber-500" defaultChecked />
                    <span className="text-sm text-slate-700">Excel (.xlsx)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="format" value="csv" className="text-amber-600 focus:ring-amber-500" />
                    <span className="text-sm text-slate-700">CSV</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="format" value="json" className="text-amber-600 focus:ring-amber-500" />
                    <span className="text-sm text-slate-700">JSON</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mục đích sử dụng</label>
                <textarea
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  rows={3}
                  placeholder="Ghi rõ mục đích sử dụng dữ liệu..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3 bg-slate-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center transition-colors font-medium"
          >
            <Check className="w-5 h-5 mr-2" />
            Tạo yêu cầu
          </button>
        </div>
      </div>
    </div>
  );
}
