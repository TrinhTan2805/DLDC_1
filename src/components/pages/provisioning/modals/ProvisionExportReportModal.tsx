import React from 'react';
import { createPortal } from 'react-dom';
import { X, Check, FileDown } from 'lucide-react';

interface ProvisionExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProvisionExportReportModal({ isOpen, onClose }: ProvisionExportReportModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div style={{ zIndex: 999999 }} className="monitoring-page-root fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
      <style dangerouslySetInnerHTML={{__html: `
        .monitoring-page-root *:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(svg):not(path):not(circle):not(rect):not(polyline):not(line) {
          font-size: 13px !important;
        }
      `}} />
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-800">Xuất báo cáo thống kê</h2>
          <button aria-label="Đóng"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1">Loại báo cáo</label>
            <select aria-label="Tùy chọn" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[13px] cursor-pointer">
              <option value="all">Báo cáo tổng hợp toàn hệ thống</option>
              <option value="api">Báo cáo hiệu năng API</option>
              <option value="error">Báo cáo chi tiết lỗi kết nối</option>
              <option value="volume">Báo cáo lưu lượng dữ liệu</option>
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1">Thời gian</label>
            <select aria-label="Tùy chọn" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[13px] cursor-pointer">
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="this_month">Tháng này</option>
              <option value="last_month">Tháng trước</option>
              <option value="custom">Tùy chỉnh...</option>
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1">Định dạng file</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input aria-label="Tùy chọn" type="radio" name="exportFormat" value="pdf" className="accent-blue-650 w-4 h-4" defaultChecked />
                <span className="text-[13px] text-slate-700">PDF</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input aria-label="Tùy chọn" type="radio" name="exportFormat" value="excel" className="accent-blue-650 w-4 h-4" />
                <span className="text-[13px] text-slate-700">Excel (.xlsx)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3 bg-slate-50 rounded-b-xl">
          <button aria-label="Đóng"
            onClick={onClose}
            className="bg-white text-[#020817] border border-[#e2e8f0] hover:bg-slate-50 rounded-lg px-4 py-2 font-medium text-[13px] transition-colors shadow-sm"
          >
            Hủy bỏ
          </button>
          <button aria-label="Đóng"
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition-colors font-medium text-[13px] shadow-sm"
          >
            <FileDown className="w-4 h-4 mr-1.5" />
            Tải xuống báo cáo
          </button>
        </div>
      </div>
    </div>
  , document.body);
}
