import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface ProvisionServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: any;
}

export function ProvisionServiceModal({ isOpen, onClose, service }: ProvisionServiceModalProps) {
  const [accessScope, setAccessScope] = useState('all');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">
            {service ? 'Chi tiết dịch vụ cung cấp' : 'Tạo mới dịch vụ cung cấp dữ liệu'}
          </h2>
          <button aria-label="Đóng"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">1. Thông tin chung</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tên dịch vụ <span className="text-red-500">*</span></label>
                <input aria-label="Trường nhập liệu"
                  type="text"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  placeholder="Nhập tên dịch vụ..."
                  defaultValue={service ? service.name : ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mã dịch vụ <span className="text-red-500">*</span></label>
                <input aria-label="Trường nhập liệu"
                  type="text"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  placeholder="Ví dụ: DV_001..."
                  defaultValue={service ? service.code : ''}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả</label>
                <textarea
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  rows={3}
                  placeholder="Mô tả chi tiết về dịch vụ..."
                ></textarea>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">2. Cấu hình dữ liệu</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Loại dữ liệu <span className="text-red-500">*</span></label>
                <select aria-label="Tùy chọn" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500">
                  <option value="">Chọn loại dữ liệu</option>
                  <option value="ho_tich">Dữ liệu Hộ tịch</option>
                  <option value="thi_hanh_an">Dữ liệu Thi hành án</option>
                  <option value="ly_lich">Dữ liệu Lý lịch tư pháp</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tần suất cung cấp</label>
                <select aria-label="Tùy chọn" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500">
                  <option value="realtime">Thời gian thực (Real-time)</option>
                  <option value="daily">Hàng ngày (Daily)</option>
                  <option value="weekly">Hàng tuần (Weekly)</option>
                  <option value="on_demand">Theo yêu cầu (On-demand)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Giao thức kết nối <span className="text-red-500">*</span></label>
                <select aria-label="Tùy chọn" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500">
                  <option value="rest">REST API (JSON)</option>
                  <option value="soap">SOAP API (XML)</option>
                  <option value="file">File Transfer (FTP/SFTP)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phạm vi truy cập <span className="text-red-500">*</span></label>
                <select aria-label="Tùy chọn" 
                  value={accessScope}
                  onChange={(e) => setAccessScope(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  <option value="all">Toàn bộ tổ chức, doanh nghiệp, công dân</option>
                  <option value="gov">Các cơ quan nhà nước</option>
                  <option value="internal">Nội bộ hệ thống</option>
                  <option value="specific">Người/Tổ chức cụ thể</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Chính sách chia sẻ <span className="text-red-500">*</span></label>
                <select aria-label="Tùy chọn" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500">
                  <option value="public">Công khai (Public)</option>
                  <option value="restricted">Hạn chế (Restricted)</option>
                  <option value="internal">Nội bộ (Internal)</option>
                </select>
              </div>
              {accessScope === 'specific' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Thông tin người cụ thể <span className="text-red-500">*</span></label>
                  <input aria-label="Trường nhập liệu"
                    type="text"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    placeholder="Nhập tên, số điện thoại, email hoặc định danh người dùng..."
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3 bg-slate-50 rounded-b-xl">
          <button aria-label="Đóng"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            Hủy bỏ
          </button>
          <button aria-label="Đóng"
            onClick={onClose}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center transition-colors font-medium"
          >
            <Check className="w-5 h-5 mr-2" />
            Lưu & Gửi phê duyệt
          </button>
        </div>
      </div>
    </div>
  );
}
