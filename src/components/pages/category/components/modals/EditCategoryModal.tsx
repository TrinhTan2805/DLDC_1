import React, { ChangeEvent, useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { MasterDataEntity, DataType, ScopeType } from '../../categoryTypes';
import { Portal } from '../../../../common/Portal';

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Partial<MasterDataEntity>;
  onSave?: (updatedData: Partial<MasterDataEntity>) => void;
  isViewOnly?: boolean;
}

/**
 * Popup Xem/Sửa danh mục đơn giản, tinh tế.
 * Căn lề trái, nút bấm góc dưới phải theo mẫu người dùng đã duyệt.
 */
export function EditCategoryModal({
  isOpen,
  onClose,
  data,
  onSave,
  isViewOnly = false
}: EditCategoryModalProps) {
  const [formData, setFormData] = useState<Partial<MasterDataEntity>>(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof MasterDataEntity, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Portal>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-[99999] p-4" style={{ zIndex: 99999 }} onClick={onClose}>
        <div 
          className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          onClick={(e: any) => e.stopPropagation()}
        >
          <div className="p-8">
            {/* Header căn trái */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
                  {isViewOnly ? 'Chi tiết danh mục' : 'Cập nhật thông tin danh mục'}
                </h3>
                <p className="text-slate-500 text-sm mt-1 font-medium">
                  {isViewOnly ? 'Xem thông tin chi tiết của bộ dữ liệu chủ' : 'Chỉnh sửa các thông số cơ bản của bộ dữ liệu chủ'}
                </p>
              </div>
              <button title="Nút bấm" onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form 2 cột căn trái */}
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700">Tên danh mục <span className="text-red-500">*</span></label>
                <input title="Dữ liệu"
                  type="text"
                  disabled={isViewOnly}
                  value={formData.name || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium outline-none ${isViewOnly ? 'cursor-not-allowed opacity-80' : ''}`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Loại dữ liệu</label>
                <select title="Dữ liệu"
                  disabled={isViewOnly}
                  value={formData.dataType || 'standard'}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => handleInputChange('dataType', e.target.value as DataType)}
                  className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium outline-none h-[44px] ${isViewOnly ? 'cursor-not-allowed opacity-80' : ''}`}
                >
                  <option value="standard">Dữ liệu chuẩn</option>
                  <option value="reference">Dữ liệu tham chiếu</option>
                  <option value="transactional">Dữ liệu giao dịch</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Cơ quan quản lý</label>
                <input title="Dữ liệu"
                  type="text"
                  disabled={isViewOnly}
                  value={formData.managingAgency || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('managingAgency', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium outline-none ${isViewOnly ? 'cursor-not-allowed opacity-80' : ''}`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Phạm vi</label>
                <select title="Dữ liệu"
                  disabled={isViewOnly}
                  value={formData.scope || 'national'}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => handleInputChange('scope', e.target.value as ScopeType)}
                  className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium outline-none h-[44px] ${isViewOnly ? 'cursor-not-allowed opacity-80' : ''}`}
                >
                  <option value="national">Toàn quốc</option>
                  <option value="ministry">Cấp bộ</option>
                  <option value="provincial">Cấp tỉnh</option>
                  <option value="internal">Nội bộ</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Mã danh mục</label>
                <input title="Dữ liệu"
                  type="text"
                  disabled
                  value={formData.code || ''}
                  className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700">Mô tả</label>
                <textarea title="Dữ liệu"
                  disabled={isViewOnly}
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium outline-none resize-none ${isViewOnly ? 'cursor-not-allowed opacity-80' : ''}`}
                />
              </div>
            </div>

            {/* Footer nút bấm góc dưới phải */}
            <div className="mt-10 flex justify-end gap-3">
              <button title="Nút bấm"
                onClick={onClose}
                className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors text-sm"
              >
                {isViewOnly ? 'Đóng' : 'Hủy'}
              </button>
              {!isViewOnly && onSave && (
                <button title="Nút bấm"
                  onClick={() => onSave(formData)}
                  className="px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm flex items-center gap-2 shadow-lg shadow-blue-100"
                >
                  <Save className="w-4 h-4" />
                  Lưu thay đổi
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
