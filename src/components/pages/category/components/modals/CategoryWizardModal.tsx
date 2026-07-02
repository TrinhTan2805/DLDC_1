import React, { ChangeEvent, useState, useEffect } from 'react';
import { X, FileText, Sliders, ChevronRight, ChevronLeft, Save, Send, Link2, ChevronDown, Check } from 'lucide-react';
import { AttributesTab } from '../tabs/AttributesTab';
import { RelationshipsTab } from '../tabs/RelationshipsTab';
import { MasterDataEntity, MasterDataAttribute, ScopeType, FieldDataType } from '../../categoryTypes';
import { Portal } from '../../../../common/Portal';

interface CategoryWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  step: number;
  setStep: (step: number) => void;
  entityId: string | null;
  formData: Partial<MasterDataEntity>;
  setFormData: (data: Partial<MasterDataEntity>) => void;
  onSaveStep1: (action: 'draft' | 'submit' | 'next' | 'next3') => void;
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
  onAddAttributeInline?: (data: Partial<MasterDataAttribute>) => void;
  isViewOnly?: boolean;
  isEditMode?: boolean;
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
  getDataTypeLabel,
  onAddAttributeInline,
  isViewOnly = false,
  isEditMode = false
}: CategoryWizardModalProps) {
  const [modalIndex, setModalIndex] = useState(1);

  useEffect(() => {
    if (!isOpen) return;
    if (typeof window !== 'undefined') {
      window.__activeModalsCount = (window.__activeModalsCount || 0) + 1;
      setModalIndex(window.__activeModalsCount);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.__activeModalsCount = Math.max(0, (window.__activeModalsCount || 0) - 1);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentZIndex = 100 + modalIndex * 10;

  return (
    <Portal>
      <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-200" 
        style={{ 
          zIndex: currentZIndex
        }}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
        }}
      >
        <div 
          className={`bg-white rounded-2xl shadow-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] ${step === 1 ? 'max-w-3xl' : 'max-w-5xl'}`}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
          }}
        >
          {/* Wizard Header */}
          <div className="flex flex-col border-b border-slate-200 bg-white shrink-0">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white">
              <h3 className="text-[18px] font-semibold text-slate-900">
                {isViewOnly ? 'Chi tiết danh mục dùng chung' : isEditMode ? 'Chỉnh sửa danh mục dùng chung' : 'Thiết lập danh mục dùng chung'}
              </h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors" aria-label="Đóng" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-8 py-5 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center justify-between w-full max-w-3xl mx-auto">
                {[
                  { s: 1, label: 'Thông tin chung', icon: FileText },
                  { s: 2, label: 'Thiết lập cấu trúc', icon: Sliders },
                  { s: 3, label: 'Thiết lập quan hệ', icon: Link2 }
                ].map((item, index, array) => {
                  const isActive = step === item.s;
                  const isCompleted = step > item.s;
                  return (
                    <div key={item.s} className="flex items-center flex-1 last:flex-none">
                      <button
                        onClick={() => setStep(item.s)}
                        className="flex items-center gap-3 group cursor-pointer"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isActive ? 'border-blue-600 bg-blue-600 text-white shadow-md' : isCompleted ? 'border-blue-600 bg-white text-blue-600' : 'border-slate-300 bg-white text-slate-400 group-hover:border-blue-400 group-hover:text-blue-500'}`}>
                          {isCompleted ? <Check className="w-5 h-5" /> : <item.icon className="w-5 h-5" />}
                        </div>
                        <div className="flex flex-col text-left hidden sm:flex">
                          <span className={`text-[13px] font-bold uppercase tracking-wider ${isActive || isCompleted ? 'text-blue-600' : 'text-slate-400'}`}>Bước {item.s}</span>
                          <span className={`text-[13px] font-bold ${isActive ? 'text-slate-900' : isCompleted ? 'text-slate-700' : 'text-slate-500'}`}>{item.label}</span>
                        </div>
                      </button>
                      {index < array.length - 1 && (
                        <div className="flex-1 mx-4 sm:mx-6 flex items-center">
                          <div className={`h-1 w-full rounded-full transition-colors ${isCompleted ? 'bg-blue-600' : 'bg-slate-200'}`} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Wizard Content Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-white custom-scrollbar">
            {step === 1 && (
              <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-400">
                <div className="grid grid-cols-2 gap-4">
                  {entityId && (
                    <div className="col-span-2">
                      <label className="block text-[13px] text-slate-700 mb-2 font-medium">Phiên bản danh mục</label>
                      <input
                        type="text"
                        disabled
                        value={`v${formData.version || 1}.0 ${!isViewOnly ? '(Sẽ tự động tăng lên v' + ((formData.version || 1) + 1) + '.0 sau khi lưu/trình duyệt)' : ''}`}
                        className="w-full px-3 py-2 bg-blue-50/50 border border-blue-200 rounded-lg text-[13px] font-bold text-blue-700 cursor-not-allowed"
                      />
                    </div>
                  )}
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[13px] text-slate-700 mb-2 font-medium">Mã danh mục <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      disabled={isViewOnly || !!entityId}
                      value={formData.code || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="VD: DM_GIOITINH"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-500 font-medium bg-white hover:bg-slate-50/30 transition-all shadow-sm"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[13px] text-slate-700 mb-2 font-medium font-sans">Tên danh sách danh mục <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={formData.name || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="VD: Danh mục quốc gia, Bộ dữ liệu cán bộ..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-500 font-medium bg-white hover:bg-slate-50/30 transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] text-slate-700 mb-2 font-medium">Cơ sở dữ liệu/Hệ thống</label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={formData.databaseSystem || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, databaseSystem: e.target.value })}
                      placeholder="VD: Cơ sở dữ liệu quốc gia về dân cư"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-500 font-medium bg-white hover:bg-slate-50/30 transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] text-slate-700 mb-2 font-medium">Đơn vị chủ quản <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        title="Đơn vị chủ quản"
                        disabled={isViewOnly}
                        value={formData.managingAgency || ''}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, managingAgency: e.target.value })}
                        className="w-full pl-3 pr-8 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white font-medium appearance-none cursor-pointer disabled:bg-slate-50 disabled:text-slate-500"
                      >
                        <option value="">-- Chọn đơn vị chủ quản --</option>
                        {[
                          'Bộ Tư pháp',
                          'Cục Công nghệ thông tin',
                          'Cục Hành chính tư pháp',
                          'Cục Quản lý thi hành án dân sự',
                          'Cục Phổ biến, giáo dục pháp luật',
                          'Cục Bổ trợ tư pháp'
                        ].map(unit => (
                          <option key={unit} value={unit}>{unit}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[13px] text-slate-700 mb-2 font-medium">Căn cứ</label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={formData.canCu || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, canCu: e.target.value })}
                      placeholder="VD: Nghị định số 13/2023/NĐ-CP ngày 17/4/2023 của Chính phủ"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-500 font-medium bg-white hover:bg-slate-50/30 transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] text-slate-700 mb-2 font-medium">Phạm vi vĩ mô <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        title="Phạm vi"
                        disabled={isViewOnly}
                        value={formData.scope || 'ministry'}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, scope: e.target.value as ScopeType })}
                        className="w-full pl-3 pr-8 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white font-medium appearance-none cursor-pointer disabled:bg-slate-50 disabled:text-slate-500"
                      >
                        <option value="national">Cấp quốc gia</option>
                        <option value="ministry">Cấp bộ</option>
                        <option value="provincial">Cấp tỉnh</option>
                        <option value="internal">Sử dụng nội bộ</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] text-slate-700 mb-2 font-medium">Nguồn dữ liệu</label>
                    <div className="relative">
                      <select 
                        title="Nguồn dữ liệu" 
                        disabled={isViewOnly} 
                        value={formData.dataSource || 'manual'}
                        onChange={(e) => setFormData({ ...formData, dataSource: e.target.value as any })}
                        className="w-full pl-3 pr-8 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white font-medium appearance-none cursor-pointer disabled:bg-slate-50 disabled:text-slate-500"
                      >
                        <option value="manual">Tự cập nhật trực tiếp</option>
                        <option value="dldc">Đồng bộ Kho DLDC</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {false && (
                    <div className="col-span-2 grid grid-cols-3 gap-4 bg-blue-50/30 p-4 rounded-xl border border-blue-100/50 animate-in fade-in zoom-in-95 duration-200">
                      <div>
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Lấy từ mục (Chủ đề)</label>
                        <div className="relative">
                          <select
                            disabled={isViewOnly}
                            className="w-full pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none cursor-pointer disabled:bg-slate-50 disabled:text-slate-500"
                          >
                            <option value="">-- Chọn mục --</option>
                            <option value="hotich">Hộ tịch</option>
                            <option value="lltp">Lý lịch tư pháp</option>
                            <option value="btdp">Bổ trợ tư pháp</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Bảng dữ liệu</label>
                        <div className="relative">
                          <select 
                            disabled={isViewOnly}
                            className="w-full pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none cursor-pointer disabled:bg-slate-50 disabled:text-slate-500"
                          >
                            <option value="">-- Chọn bảng --</option>
                            <option value="tbl_khaisinh">tbl_khaisinh</option>
                            <option value="tbl_kethon">tbl_kethon</option>
                            <option value="tbl_khaiduong">tbl_khaiduong</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Trường dữ liệu</label>
                        <div className="relative">
                          <select 
                            disabled={isViewOnly}
                            className="w-full pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none cursor-pointer disabled:bg-slate-50 disabled:text-slate-500"
                          >
                            <option value="">-- Chọn trường --</option>
                            <option value="ma_dinh_danh">Mã định danh</option>
                            <option value="ho_ten">Họ tên</option>
                            <option value="ngay_sinh">Ngày sinh</option>
                            <option value="*">Tất cả (*)</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}
            {step === 2 && (
              <div className="animate-in slide-in-from-right-2 duration-400">
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
                  onAddAttributeInline={onAddAttributeInline}
                  onEditAttribute={onEditAttribute}
                  onDeleteAttribute={onDeleteAttribute}
                  getDataTypeLabel={getDataTypeLabel}
                  isViewOnly={isViewOnly}
                  wizardConfig={{
                    dataSource: formData.dataSource,
                    dldcTable: formData.dldcTable,
                    dldcColumns: formData.dldcColumns,
                    apiEndpoint: formData.apiEndpoint,
                    apiMethod: formData.apiMethod,
                    apiSystem: formData.apiSystem,
                    apiManagingUnit: formData.apiManagingUnit,
                    apiAuthType: formData.apiAuthType,
                    apiBearerToken: formData.apiBearerToken,
                    apiKeyName: formData.apiKeyName,
                    apiKeyValue: formData.apiKeyValue,
                    apiParams: formData.apiParams,
                    apiHeaders: formData.apiHeaders,
                    apiBody: formData.apiBody,
                  }}
                  onWizardConfigChange={(update) => setFormData({
                    ...formData,
                    ...update,
                    apiMethod: update.apiMethod as 'GET' | 'POST' | 'PUT' | undefined,
                    apiAuthType: update.apiAuthType as 'none' | 'bearer' | 'apikey' | undefined,
                  })}
                />
              </div>
            )}
            {step === 3 && (
              <div className="animate-in slide-in-from-right-2 duration-400">
                <RelationshipsTab
                  entities={entities}
                  relationships={[]}
                  setRelationships={() => { }}
                  isViewOnly={isViewOnly}
                  currentEntityId={entityId || undefined}
                  currentEntityName={formData.name || ''}
                  currentEntityCode={formData.code || ''}
                />
              </div>
            )}
          </div>

          {/* Wizard Footer */}
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
            <div className="flex gap-3">
              <button onClick={onClose} className="px-4 py-2 border border-slate-355 text-slate-700 bg-white border-slate-300 rounded-lg hover:bg-slate-50 text-[13px] font-medium transition-colors cursor-pointer">
                {isViewOnly ? 'Đóng' : 'Hủy bỏ'}
              </button>
              {step > 1 && (
                <button onClick={() => setStep(step - 1)} className="px-4 py-2 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 rounded-lg text-[13px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer">
                  <ChevronLeft className="w-4 h-4" /> Quay lại
                </button>
              )}
            </div>

            <div className="flex gap-3">
              {!isViewOnly && (
                <button onClick={() => onSaveStep1('draft')} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[13px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer">
                  <Save className="w-4 h-4" /> Lưu tạm
                </button>
              )}
              {!isViewOnly && step === 3 && (
                <button onClick={() => onSaveStep1('submit')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[13px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm">
                  <Send className="w-4 h-4" /> Gửi trình duyệt
                </button>
              )}
              {step < 3 && (
                <button onClick={() => {
                  if (isViewOnly) { setStep(step + 1); return; }
                  if (step === 1) { onSaveStep1('next'); return; }
                  if (step === 2) { onSaveStep1('next3'); return; }
                  setStep(step + 1);
                }} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm">
                  Tiếp tục <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

    </Portal>
  );
}
