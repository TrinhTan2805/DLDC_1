import React from 'react';
import { X, Check } from 'lucide-react';

interface ProvisionApiModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiData?: any;
}

export function ProvisionApiModal({ isOpen, onClose, apiData }: ProvisionApiModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">
            {apiData ? 'Cập nhật API' : 'Thêm mới API'}
          </h2>
          <button title="Đóng" aria-label="Đóng"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Tên API <span className="text-red-500">*</span></label>
                <input title="Nhập liệu" aria-label="Trường nhập liệu"
                  type="text"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  placeholder="Nhập tên API..."
                  defaultValue={apiData ? apiData.name : ''}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Endpoint (URL) <span className="text-red-500">*</span></label>
                <input title="Nhập liệu" aria-label="Trường nhập liệu"
                  type="text"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono text-sm"
                  placeholder="/api/v1/..."
                  defaultValue={apiData ? apiData.endpoint : ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phương thức <span className="text-red-500">*</span></label>
                <select title="Tùy chọn" aria-label="Tùy chọn" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono text-sm"
                  defaultValue={apiData ? apiData.method : 'GET'}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phiên bản <span className="text-red-500">*</span></label>
                <input title="Nhập liệu" aria-label="Trường nhập liệu"
                  type="text"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  placeholder="v1.0"
                  defaultValue={apiData ? apiData.version : 'v1.0'}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả</label>
                <textarea
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  rows={3}
                  placeholder="Mô tả chức năng của API..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3 bg-slate-50 rounded-b-xl">
          <button title="Hủy bỏ" aria-label="Hủy bỏ"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            Hủy bỏ
          </button>
          <button title="Lưu" aria-label="Lưu"
            onClick={onClose}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center transition-colors font-medium"
          >
            <Check className="w-5 h-5 mr-2" />
            {apiData ? 'Lưu thay đổi' : 'Tạo mới'}
          </button>
        </div>
      </div>
    </div>
  );
}
