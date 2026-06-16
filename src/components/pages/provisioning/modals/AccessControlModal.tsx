import React from 'react';
import { createPortal } from 'react-dom';
import { X, Save, ShieldCheck } from 'lucide-react';
import { ProvisionService } from '../../../../data/provisionServicesData';

interface AccessControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ProvisionService | null;
}

export function AccessControlModal({ isOpen, onClose, service }: AccessControlModalProps) {
  if (!isOpen || !service) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 flex items-center">
              <ShieldCheck className="w-5 h-5 text-green-600 mr-2" />
              Cấu hình quyền truy cập
            </h3>
            <p className="text-sm text-slate-500 mt-1">{service.name}</p>
          </div>
          <button title="Đóng" aria-label="Đóng" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 bg-slate-50">
          <div className="bg-white p-5 rounded-lg border border-slate-200">
            <h4 className="font-medium text-slate-800 mb-4">Đối tượng được phép truy cập</h4>
            <div className="space-y-3">
              <label className="flex items-start">
                <input title="Nhập liệu" aria-label="Tùy chọn" type="radio" name="accessScope" className="mt-1 mr-3 text-amber-600 focus:ring-amber-500" defaultChecked />
                <div>
                  <span className="block font-medium text-slate-700">Tất cả cơ quan, tổ chức</span>
                  <span className="text-sm text-slate-500">Mọi đơn vị có tài khoản hợp lệ đều có thể gọi dịch vụ này</span>
                </div>
              </label>
              <label className="flex items-start">
                <input title="Nhập liệu" aria-label="Tùy chọn" type="radio" name="accessScope" className="mt-1 mr-3 text-amber-600 focus:ring-amber-500" />
                <div>
                  <span className="block font-medium text-slate-700">Giới hạn theo cơ quan/nhóm cụ thể</span>
                  <span className="text-sm text-slate-500">Chỉ những đơn vị được chỉ định mới có quyền truy cập</span>
                </div>
              </label>
              <label className="flex items-start">
                <input title="Nhập liệu" aria-label="Tùy chọn" type="radio" name="accessScope" className="mt-1 mr-3 text-amber-600 focus:ring-amber-500" />
                <div>
                  <span className="block font-medium text-slate-700">Công khai (Public)</span>
                  <span className="text-sm text-slate-500">Truy cập không cần xác thực (dành cho Dữ liệu mở)</span>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200">
            <h4 className="font-medium text-slate-800 mb-4">Giới hạn truy cập (Rate Limit & Quota)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Số request tối đa / Giây</label>
            <input placeholder="..." title="Nhập liệu" aria-label="Nhập số" type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" defaultValue={100} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Số request tối đa / Ngày</label>
            <input placeholder="..." title="Nhập liệu" aria-label="Nhập số" type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" defaultValue={10000} />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Thời hạn cấp quyền (mặc định)</label>
            <select title="Tùy chọn" aria-label="Tùy chọn" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
              <option value="unlimited">Không giới hạn</option>
              <option value="1y">1 năm</option>
              <option value="6m">6 tháng</option>
              <option value="custom">Tùy chỉnh...</option>
            </select>
          </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3 bg-white">
          <button title="Hủy bỏ" aria-label="Hủy bỏ" 
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
          >
            Hủy bỏ
          </button>
          <button title="Lưu cấu hình" aria-label="Lưu cấu hình" 
            onClick={onClose}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center font-medium"
          >
            <Save className="w-4 h-4 mr-2" />
            Lưu cấu hình
          </button>
        </div>
      </div>
    </div>
  , document.body);
}
