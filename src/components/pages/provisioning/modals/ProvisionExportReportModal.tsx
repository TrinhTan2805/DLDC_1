import React from 'react';
import { createPortal } from 'react-dom';
import { X, Check, FileDown } from 'lucide-react';
import { BTN_PRIMARY, BTN_OUTLINE, BTN_GHOST_ICON, INPUT_CLS as BASE_INPUT_CLS, VIEW_FIELD_CLS, LABEL_CLS } from '../../collection/collectionUi';
// Ô nhập chuẩn + quy tắc ô bị khóa ở màn Xem chi tiết (giá trị đen, placeholder xám)
const INPUT_CLS = `${BASE_INPUT_CLS} ${VIEW_FIELD_CLS}`;

interface ProvisionExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProvisionExportReportModal({ isOpen, onClose }: ProvisionExportReportModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div style={{ zIndex: 999999 }} className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[#E2E8F0]">
          <h2 className="text-[16px] font-semibold text-[#020817]">Xuất báo cáo thống kê</h2>
          <button type="button" aria-label="Đóng" title="Đóng" onClick={onClose} className={BTN_GHOST_ICON}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 overflow-y-auto custom-scrollbar space-y-4">
          <div>
            <label className={LABEL_CLS}>Loại báo cáo</label>
            <select aria-label="Tùy chọn" className={`${INPUT_CLS} cursor-pointer`}>
              <option value="all">Báo cáo tổng hợp toàn hệ thống</option>
              <option value="api">Báo cáo hiệu năng API</option>
              <option value="error">Báo cáo chi tiết lỗi kết nối</option>
              <option value="volume">Báo cáo lưu lượng dữ liệu</option>
            </select>
          </div>

          <div>
            <label className={LABEL_CLS}>Thời gian</label>
            <select aria-label="Tùy chọn" className={`${INPUT_CLS} cursor-pointer`}>
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="this_month">Tháng này</option>
              <option value="last_month">Tháng trước</option>
              <option value="custom">Tùy chỉnh...</option>
            </select>
          </div>

          <div>
            <label className={LABEL_CLS}>Định dạng file</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input aria-label="Tùy chọn" type="radio" name="exportFormat" value="pdf" className="accent-blue-600 w-4 h-4" defaultChecked />
                <span className="text-[13px] text-[#020817]">PDF</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input aria-label="Tùy chọn" type="radio" name="exportFormat" value="excel" className="accent-blue-600 w-4 h-4" />
                <span className="text-[13px] text-[#020817]">Excel (.xlsx)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
          <button type="button" aria-label="Đóng" onClick={onClose} className={BTN_OUTLINE}>
            Hủy bỏ
          </button>
          <button type="button" aria-label="Đóng" onClick={onClose} className={BTN_PRIMARY}>
            <FileDown className="w-4 h-4" />
            Tải xuống báo cáo
          </button>
        </div>
      </div>
    </div>
  , document.body);
}
