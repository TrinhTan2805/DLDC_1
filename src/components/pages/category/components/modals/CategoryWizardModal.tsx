import React, { ChangeEvent } from 'react';
import { X, FileText, Sliders, ChevronRight, ChevronLeft, Save, Send, Link2, Clock } from 'lucide-react';
import { AttributesTab } from '../tabs/AttributesTab';
import { RelationshipsTab } from '../tabs/RelationshipsTab';
import { VersionHistoryTab } from '../tabs/VersionHistoryTab';
import { MasterDataEntity, MasterDataAttribute, DataType, ScopeType, FieldDataType } from '../../categoryTypes';
import { Portal } from '../../../../common/Portal';

interface CategoryWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  step: number;
  setStep: (step: number) => void;
  entityId: string | null;
  formData: Partial<MasterDataEntity>;
  setFormData: (data: Partial<MasterDataEntity>) => void;
  onSaveStep1: (action: 'draft' | 'submit' | 'next') => void;
  // AttributesTab props
  entities: MasterDataEntity[];
  attributes: MasterDataAttribute[];
  selectedAttributes: string[];
  onSelectAttribute: (id: string) => void;
  onSelectAllAttributes: (checked: boolean) => void;
  onAddAttribute: () => void;
  onEditAttribute: (attr: MasterDataAttribute) => void;
  onDeleteAttribute: (id: string) => void;
  getDataTypeLabel: (type: FieldDataType) => string;
}

/**
 * Giao diện Wizard Thêm mới danh mục chuẩn chuyên nghiệp.
 * Kích thước vừa phải, font chữ tiêu chuẩn, dễ nhìn.
 */
export function CategoryWizardModal({
  isOpen,
  onClose,
  step,
  setStep,
  entityId,
  formData,
  setFormData,
  onSaveStep1,
  entities,
  attributes,
  selectedAttributes,
  onSelectAttribute,
  onSelectAllAttributes,
  onAddAttribute,
  onEditAttribute,
  onDeleteAttribute,
  getDataTypeLabel
}: CategoryWizardModalProps) {
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[99999] p-4" style={{ zIndex: 99999 }}>
        <div className={`bg-white rounded-2xl shadow-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] ${step === 1 ? 'max-w-3xl' : 'max-w-5xl'}`}>
          {/* Wizard Header */}
          <div className="flex flex-col border-b border-slate-200 bg-white shrink-0">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
                {entityId ? 'HIỆU CHỈNH DANH MỤC' : 'THIẾT LẬP DANH MỤC MỚI'}
              </h2>
              <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-xl transition-colors" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex px-6 bg-white overflow-x-auto border-b border-slate-100">
              {[
                { s: 1, label: 'Thông tin chung', icon: FileText },
                { s: 2, label: 'Thiết lập thuộc tính', icon: Sliders },
                { s: 3, label: 'Thiết lập quan hệ', icon: Link2 },
                { s: 4, label: 'Lịch sử phiên bản', icon: Clock }
              ].map((item) => {
                const isActive = step === item.s;
                const isLocked = !entityId && item.s > 1;
                return (
                  <button
 key={item.s}
 disabled={isLocked}
 onClick={() => setStep(item.s)}
 className={`flex items-center gap-2 py-4 px-6 border-b-2 text-[14px] whitespace-nowrap transition-colors ${
 isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-blue-600'
 } ${isLocked ? 'opacity-40 cursor-not-allowed' : ''}`}
 >
 <item.icon className="w-4 h-4" />
 {item.label}
 </button>
                );
              })}
            </div>
          </div>

          {/* Wizard Content Area */}
          <div className="flex-1 overflow-y-auto bg-slate-50/20 p-8 custom-scrollbar">
            {step === 1 && (
              <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                <div className="grid grid-cols-2 gap-x-8 gap-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Tên danh sách danh mục <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="VD: Danh mục quốc gia, Bộ dữ liệu cán bộ..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Loại dữ liệu <span className="text-red-500">*</span></label>
                    <select
                      title="Loại dữ liệu"
                      value={formData.dataType || 'standard'}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, dataType: e.target.value as DataType })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all h-[44px]"
                    >
                      <option value="standard">Dữ liệu chuẩn</option>
                      <option value="reference">Dữ liệu tham chiếu</option>
                      <option value="transactional">Dữ liệu giao dịch</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Cơ quan quản lý <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formData.managingAgency || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, managingAgency: e.target.value })}
                      placeholder="VD: Bộ Tư Pháp"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phạm vi vĩ mô <span className="text-red-500">*</span></label>
                    <select
                      title="Phạm vi"
                      value={formData.scope || 'national'}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, scope: e.target.value as ScopeType })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all h-[44px]"
                    >
                      <option value="national">Cấp quốc gia</option>
                      <option value="ministry">Cấp bộ</option>
                      <option value="provincial">Cấp tỉnh</option>
                      <option value="internal">Sử dụng nội bộ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nguồn dữ liệu</label>
                    <select title="Nguồn dữ liệu" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium h-[44px]">
                      <option>Tự cập nhật trực tiếp</option>
                      <option>Đồng bộ Kho DLDC</option>
                      <option>Kết nối API (NGSP/LGSP)</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Mô tả mục đích & vai trò</label>
                    <textarea
                      rows={4}
                      value={formData.description || ''}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Mô tả chi tiết về cấu trúc dữ liệu và cách thức vận hành..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="h-full flex flex-col animate-in slide-in-from-right-2 duration-400">
                <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
                  <AttributesTab
                    wizardMode={true}
                    wizardEntityId={entityId}
                    entities={entities}
                    attributes={attributes}
                    selectedEntityId={entityId || ''}
                    setSelectedEntityId={() => { }}
                    selectedAttributes={selectedAttributes}
                    onSelectAttribute={onSelectAttribute}
                    onSelectAll={onSelectAllAttributes}
                    onAddAttribute={onAddAttribute}
                    onEditAttribute={onEditAttribute}
                    onDeleteAttribute={onDeleteAttribute}
                    getDataTypeLabel={getDataTypeLabel}
                  />
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="h-full flex flex-col animate-in slide-in-from-right-2 duration-400">
                <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
                  <RelationshipsTab
                     entities={entities}
                     relationships={[]}
                     setRelationships={() => {}}
                  />
                </div>
              </div>
            )}
            {step === 4 && (
              <div className="h-full flex flex-col animate-in slide-in-from-right-2 duration-400">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <VersionHistoryTab
                     searchTerm=""
                     setSearchTerm={() => {}}
                     onViewDetail={() => {}}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Wizard Footer */}
          <div className="px-8 py-5 border-t border-slate-200 bg-white flex justify-between items-center shrink-0">
            <div className="flex gap-3">
              <button onClick={onClose} className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 text-sm transition-colors">Hủy bỏ</button>
              {step > 1 && (
                <button onClick={() => setStep(step - 1)} className="px-6 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm flex items-center gap-2 transition-colors">
 <ChevronLeft className="w-4 h-4" /> Quay lại
 </button>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => onSaveStep1('draft')} className="px-6 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-sm flex items-center gap-2 transition-colors">
 <Save className="w-4 h-4" /> Lưu tạm
 </button>
              {step < 4 ? (
                <button onClick={() => step === 1 ? onSaveStep1('next') : setStep(step + 1)} className="px-8 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-blue-100 transition-colors">
 Tiếp tục <ChevronRight className="w-4 h-4" />
 </button>
              ) : (
                <button onClick={() => onSaveStep1('submit')} className="px-10 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-blue-100 transition-colors">
 <Send className="w-4 h-4" /> Hoàn tất & Trình duyệt
 </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
