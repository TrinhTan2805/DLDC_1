import React from 'react';
import { X, Check, FileDown } from 'lucide-react';

interface ProvisionExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProvisionExportReportModal({ isOpen, onClose }: ProvisionExportReportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Xuất báo cáo thống kê</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Loại báo cáo</label>
            <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500">
              <option value="all">Báo cáo tổng hợp toàn hệ thống</option>
              <option value="api">Báo cáo hiệu năng API</option>
              <option value="error">Báo cáo chi tiết lỗi kết nối</option>
              <option value="volume">Báo cáo lưu lượng dữ liệu</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Thời gian</label>
            <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500">
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="this_month">Tháng này</option>
              <option value="last_month">Tháng trước</option>
              <option value="custom">Tùy chỉnh...</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Định dạng file</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center space-x-2">
                <input type="radio" name="exportFormat" value="pdf" className="text-amber-600 focus:ring-amber-500" defaultChecked />
                <span className="text-sm text-slate-700">PDF</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="exportFormat" value="excel" className="text-amber-600 focus:ring-amber-500" />
                <span className="text-sm text-slate-700">Excel (.xlsx)</span>
              </label>
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
            <FileDown className="w-5 h-5 mr-2" />
            Tải xuống báo cáo
          </button>
        </div>
      </div>
    </div>
  );
}
