import React, { ChangeEvent } from 'react';
import { Send } from 'lucide-react';
import { MasterDataAttribute, FieldDataType, MasterDataEntity } from '../../categoryTypes';
import { BaseModal } from '../../../../common/BaseModal';
import { mockAttributesByEntity } from '../../categoryConstants';

interface AttributeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingAttribute: MasterDataAttribute | null;
  formData: Partial<MasterDataAttribute>;
  setFormData: (data: Partial<MasterDataAttribute>) => void;
  onSave: () => void;
  onSaveAndSubmit: (data: { id: string; code: string; name: string; type: 'attribute' | 'category' }) => void;
  entities?: MasterDataEntity[];
}

/**
 * Standardized Attribute Form Modal using BaseModal.
 * Refactored to match the inline attribute form style.
 */
export function AttributeFormModal({
  isOpen,
  onClose,
  editingAttribute,
  formData,
  setFormData,
  onSave,
  entities = []
}: AttributeFormModalProps) {
  if (!isOpen) return null;

  const footer = (
    <>
      <button 
        type="button"
        onClick={onClose} 
        className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors text-[13px] font-medium cursor-pointer"
      >
        Hủy
      </button>
      <button 
        type="button"
        onClick={onSave} 
        className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 transition-colors text-[13px] font-medium shadow-sm cursor-pointer"
      >
        <Send className="w-4 h-4"/>
        Lưu
      </button>
    </>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={editingAttribute ? 'Cập nhật trường dữ liệu' : 'Thêm mới trường dữ liệu'}
      subtitle="Định nghĩa cấu trúc chi tiết cho trường dữ liệu"
      footer={footer}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4 text-left">
        {/* Tên trường */}
        <div className="space-y-1.5">
          <label className="block text-[13px] font-medium text-slate-600">
            Tên trường <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.fieldName || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, fieldName: e.target.value })}
            placeholder="VD: citizen_id"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white text-slate-800"
          />
          <p className="text-[13px] text-slate-400 italic">Tên định danh trong cơ sở dữ liệu (không dấu, chữ thường)</p>
        </div>

        {/* Tên hiển thị */}
        <div className="space-y-1.5">
          <label className="block text-[13px] font-medium text-slate-600">
            Tên hiển thị <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.displayName || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, displayName: e.target.value })}
            placeholder="VD: Số CCCD"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white text-slate-800"
          />
        </div>

        {/* Kiểu dữ liệu & Độ dài tối đa */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-slate-600">
              Kiểu dữ liệu <span className="text-red-500">*</span>
            </label>
            <select
              title="Kiểu dữ liệu"
              value={formData.dataType || 'string'}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, dataType: e.target.value as FieldDataType })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-800"
            >
              <option value="string">Chuỗi (String)</option>
              <option value="number">Số (Number)</option>
              <option value="date">Ngày (Date)</option>
              <option value="datetime">Ngày giờ (DateTime)</option>
              <option value="boolean">Logic (Boolean)</option>
              <option value="text">Văn bản dài (Text)</option>
              <option value="email">Email</option>
              <option value="phone">Số điện thoại</option>
              <option value="url">URL</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-slate-600">Độ dài tối đa</label>
            <input
              type="number"
              value={formData.length || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, length: e.target.value ? parseInt(e.target.value) : undefined })}
              placeholder="VD: 255"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white text-slate-800"
            />
          </div>
        </div>

        {/* Cấu hình ràng buộc */}
        <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <label className="block text-[13px] font-medium text-slate-600 mb-2">Cấu hình ràng buộc</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { key: 'required', label: 'Bắt buộc', desc: 'Required' },
              { key: 'unique', label: 'Duy nhất', desc: 'Unique' },
              { key: 'indexed', label: 'Đánh index', desc: 'Indexed' }
            ].map((item) => (
              <label key={item.key} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all group">
                <input 
                  type="checkbox" 
                  checked={(formData as any)[item.key] || false} 
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [item.key]: e.target.checked })} 
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500" 
                />
                <div className="flex flex-col">
                  <span className="text-[13px] font-medium text-slate-700 group-hover:text-blue-700 transition-colors">{item.label}</span>
                  <span className="text-[13px] text-slate-400 font-bold uppercase">{item.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Cấu hình khóa (Khóa chính / Khóa ngoại) */}
        <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <label className="block text-[13px] font-medium text-slate-600">Cấu hình khóa</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'none', label: 'Không thiết lập' },
              { value: 'primary', label: 'Khóa chính (PK)' },
              { value: 'foreign', label: 'Khóa ngoại (FK)' }
            ].map((option) => {
              const isSelected = (formData.keyType || 'none') === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ 
                    ...formData, 
                    keyType: option.value as any,
                    ...(option.value === 'primary' ? { required: true, unique: true } : {}),
                    ...(option.value !== 'foreign' ? { foreignTable: undefined, foreignField: undefined } : {})
                  })}
                  className={`px-3 py-2.5 rounded-lg border text-[13px] font-medium text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Giá trị mặc định & Quy tắc xác thực */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-slate-600">Giá trị mặc định</label>
            <input
              type="text"
              value={formData.defaultValue || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, defaultValue: e.target.value })}
              placeholder="Để trống nếu không có"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white text-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-slate-600">Quy tắc xác thực</label>
            <input
              type="text"
              value={formData.validationRules || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, validationRules: e.target.value })}
              placeholder="VD: regex hoặc enum"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white text-slate-800"
            />
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
