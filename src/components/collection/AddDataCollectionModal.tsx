import React, { useState } from 'react';
import { BaseModal } from '../common/BaseModal';
import { Save, X } from 'lucide-react';

interface AddDataCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function AddDataCollectionModal({ isOpen, onClose, onSave }: AddDataCollectionModalProps) {
  const [category, setCategory] = useState<'external' | 'internal'>('external');
  const [formData, setFormData] = useState({
    department: '',
    dataName: '',
    dataType: '',
    description: '',
    frequency: 'Hằng ngày',
    format: 'JSON',
    priority: 'medium',
    status: 'not-started',
    connectionMethod: 'API',
    endpoint: '',
    authMethod: 'API Key',
    apiKey: '',
    username: '',
    password: '',
    port: '',
    technicalNote: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const footer = (
    <div className="flex items-center justify-end gap-3 w-full">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm flex items-center gap-2"
      >
        <X className="w-4 h-4" />
        Hủy bỏ
      </button>
      <button
        type="button"
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2"
      >
        <Save className="w-4 h-4" />
        Ghi nhận
      </button>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Thêm mới Dữ liệu Cần Thu thập"
      subtitle="Khai báo cấu hình và định dạng đối tượng dữ liệu cần lấy về"
      maxWidth="max-w-4xl"
      footer={footer}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Loại nguồn */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Loại nguồn dữ liệu <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setCategory('external')}
              className={`p-4 border-2 rounded-xl transition-all ${
                category === 'external'
                  ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  category === 'external'
                    ? 'border-blue-600 bg-blue-600'
                    : 'border-slate-300'
                }`}>
                  {category === 'external' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900">Thu thập từ Bộ ngoài</p>
                  <p className="text-xs text-slate-500 mt-0.5">Dữ liệu từ các cơ quan bên ngoài</p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setCategory('internal')}
              className={`p-4 border-2 rounded-xl transition-all ${
                category === 'internal'
                  ? 'border-green-600 bg-green-50 ring-2 ring-green-600/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  category === 'internal'
                    ? 'border-green-600 bg-green-600'
                    : 'border-slate-300'
                }`}>
                  {category === 'internal' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900">Thu thập trong nội bộ</p>
                  <p className="text-xs text-slate-500 mt-0.5">Dữ liệu từ các Cục/Vụ thuộc cấu trúc</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-100">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {category === 'external' ? 'Cơ quan nguồn' : 'Cục/Vụ'} <span className="text-red-500">*</span>
            </label>
            {category === 'external' ? (
              <select
                required
                title="Cơ quan nguồn"
                aria-label="Cơ quan nguồn"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Chọn cơ quan</option>
                <option value="Tòa án nhân dân tối cao">Tòa án nhân dân tối cao</option>
                <option value="Cục Thống kê Trung ương">Cục Thống kê Trung ương</option>
                <option value="Bộ Kế hoạch & Đầu tư">Bộ Kế hoạch & Đầu tư</option>
              </select>
            ) : (
              <select
                required
                title="Cục/Vụ"
                aria-label="Cục/Vụ"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="">Chọn Cục/Vụ</option>
                <option value="Cục Công nghệ Thông tin">Cục Công nghệ Thông tin</option>
                <option value="Cục Hành chính Tư pháp">Cục Hành chính Tư pháp</option>
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tên Dữ liệu <span className="text-red-500">*</span>
            </label>
            <input aria-label="Input field"
              type="text"
              required
              value={formData.dataName}
              onChange={(e) => setFormData({ ...formData, dataName: e.target.value })}
              placeholder="VD: Danh sách hộ tịch"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-100 mt-4">
            {/* Tần suất */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tần suất thu thập <span className="text-red-500">*</span>
              </label>
              <select
                required
                title="Tần suất thu thập"
                aria-label="Tần suất thu thập"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Hằng ngày">Hằng ngày</option>
                <option value="Hằng tuần">Hằng tuần</option>
                <option value="Hằng tháng">Hằng tháng</option>
              </select>
            </div>
            {/* Định dạng */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Định dạng trả về <span className="text-red-500">*</span>
              </label>
              <select
                required
                title="Định dạng trả về"
                aria-label="Định dạng trả về"
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="JSON">JSON (API)</option>
                <option value="XML">XML (SOAP)</option>
                <option value="Excel">Tệp Excel/CSV</option>
              </select>
            </div>
        </div>
      </form>
    </BaseModal>
  );
}
