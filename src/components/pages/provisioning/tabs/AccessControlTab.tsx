import React from 'react';
import { Save, ShieldCheck } from 'lucide-react';
import { ProvisionService } from '../../../../data/provisionServicesData';

interface AccessControlTabProps {
  service: ProvisionService;
}

export function AccessControlTab({ service }: AccessControlTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-lg border border-slate-200">
        <h4 className="font-medium text-slate-800 mb-4">Đối tượng được phép truy cập</h4>
        <div className="space-y-3">
          <label className="flex items-start">
            <input aria-label="Tùy chọn" type="radio" name="accessScope" className="mt-1 mr-3 text-amber-600 focus:ring-amber-500" defaultChecked />
            <div>
              <span className="block font-medium text-slate-700">Tất cả cơ quan, tổ chức</span>
              <span className="text-sm text-slate-500">Mọi đơn vị có tài khoản hợp lệ đều có thể gọi dịch vụ này</span>
            </div>
          </label>
          <label className="flex items-start">
            <input aria-label="Tùy chọn" type="radio" name="accessScope" className="mt-1 mr-3 text-amber-600 focus:ring-amber-500" />
            <div>
              <span className="block font-medium text-slate-700">Giới hạn theo cơ quan/nhóm cụ thể</span>
              <span className="text-sm text-slate-500">Chỉ những đơn vị được chỉ định mới có quyền truy cập</span>
            </div>
          </label>
          <label className="flex items-start">
            <input aria-label="Tùy chọn" type="radio" name="accessScope" className="mt-1 mr-3 text-amber-600 focus:ring-amber-500" />
            <div>
              <span className="block font-medium text-slate-700">Công khai (Public)</span>
              <span className="text-sm text-slate-500">Truy cập không cần xác thực (dành cho Dữ liệu mở)</span>
            </div>
          </label>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg border border-slate-200">
        <h4 className="font-medium text-slate-800 mb-4">Giới hạn truy cập (Rate Limit & Quota)</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Số request tối đa / Giây</label>
            <input aria-label="Số request tối đa mỗi giây" type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" defaultValue={100} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Số request tối đa / Ngày</label>
            <input aria-label="Số request tối đa mỗi ngày" type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" defaultValue={10000} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Thời hạn cấp quyền (mặc định)</label>
            <select aria-label="Thời hạn cấp quyền" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
              <option value="unlimited">Không giới hạn</option>
              <option value="1y">1 năm</option>
              <option value="6m">6 tháng</option>
              <option value="custom">Tùy chỉnh...</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center font-medium">
          <Save className="w-4 h-4 mr-2" />
          Lưu cấu hình
        </button>
      </div>
    </div>
  );
}
