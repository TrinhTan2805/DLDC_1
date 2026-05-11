import React, { ChangeEvent } from 'react';
import { Send } from 'lucide-react';
import { MasterDataAttribute, FieldDataType } from '../../categoryTypes';
import { BaseModal } from '../../../../common/BaseModal';

interface AttributeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingAttribute: MasterDataAttribute | null;
  formData: Partial<MasterDataAttribute>;
  setFormData: (data: Partial<MasterDataAttribute>) => void;
  onSave: () => void;
  onSaveAndSubmit: (data: { id: string; code: string; name: string; type: 'attribute' | 'category' }) => void;
}

/**
 * Standardized Attribute Form Modal using BaseModal.
 * Provides a premium, consistent look for adding and editing attributes.
 */
export function AttributeFormModal({
  isOpen,
  onClose,
  editingAttribute,
  formData,
  setFormData,
  onSave,
  onSaveAndSubmit
}: AttributeFormModalProps) {
  if (!isOpen) return null;

  const footer = (
    <>
      <button 
 type="button"
 onClick={onClose} 
 className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all active:scale-95 text-sm"
 >
        Hủy
      </button>
      <button 
 type="button"
 onClick={onSave} 
 className="px-6 py-2.5 rounded-xl bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all active:scale-95 text-sm"
 >
        Lưu tạm
      </button>
      <button 
 type="button"
 onClick={() => {
 onSave();
 onSaveAndSubmit({
 id: formData.id || 'new',
 code: formData.fieldName || 'ATTR-001',
 name: formData.displayName || 'Thuộc tính mới',
 type: 'attribute'
 });
 }}
 className="px-8 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 shadow-xl shadow-blue-100 transition-all active:scale-95 text-sm"
 >
 <Send className="w-4 h-4"/>
 Lưu và Trình duyệt
 </button>
    </>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={editingAttribute ? 'Cập nhật thuộc tính' : 'Thêm mới thuộc tính'}
      subtitle="Định nghĩa cấu trúc chi tiết cho trường dữ liệu"
      footer={footer}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">
              Tên trường <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.fieldName || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, fieldName: e.target.value })}
              placeholder="VD: citizen_id"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100/50 focus:border-blue-500 transition-all text-sm font-mono font-bold text-slate-800"
            />
            <p className="text-[11px] text-slate-400 font-medium italic">Tên định danh trong cơ sở dữ liệu (không dấu, chữ thường)</p>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">
              Tên hiển thị <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.displayName || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, displayName: e.target.value })}
              placeholder="VD: Số CCCD"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100/50 focus:border-blue-500 transition-all text-sm font-bold text-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">
              Kiểu dữ liệu <span className="text-red-500">*</span>
            </label>
            <select
              title="Kiểu dữ liệu"
              value={formData.dataType || 'string'}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, dataType: e.target.value as FieldDataType })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:ring-4 focus:ring-blue-100/50 transition-all text-sm font-bold text-slate-800 h-[48px]"
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
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Độ dài tối đa</label>
            <input
              type="number"
              value={formData.length || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, length: e.target.value ? parseInt(e.target.value) : undefined })}
              placeholder="VD: 255"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100/50 transition-all text-sm font-bold text-slate-800"
            />
          </div>
        </div>

        <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Cấu hình ràng buộc</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { key: 'required', label: 'Bắt buộc', desc: 'Required' },
              { key: 'unique', label: 'Duy nhất', desc: 'Unique' },
              { key: 'indexed', label: 'Đánh index', desc: 'Indexed' }
            ].map((item) => (
              <label key={item.key} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all group">
                <input 
                  type="checkbox" 
                  checked={(formData as any)[item.key] || false} 
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [item.key]: e.target.checked })} 
                  className="w-5 h-5 rounded-lg text-blue-600 border-slate-300 focus:ring-blue-500" 
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{item.label}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{item.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Giá trị mặc định</label>
            <input
              type="text"
              value={formData.defaultValue || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, defaultValue: e.target.value })}
              placeholder="Để trống nếu không có"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100/50 transition-all text-sm font-bold text-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Quy tắc xác thực</label>
            <input
              type="text"
              value={formData.validationRules || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, validationRules: e.target.value })}
              placeholder="VD: regex hoặc enum"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100/50 transition-all text-sm font-bold text-slate-800"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Mô tả ngắn gọn</label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả mục đích sử dụng của thuộc tính này..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100/50 transition-all text-sm font-bold text-slate-800"
            />
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
