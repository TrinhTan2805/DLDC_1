import React, { ChangeEvent, useState, useEffect } from 'react';
import { X, FileText, Sliders, ChevronRight, ChevronLeft, Save, Send, Link2, ChevronDown, Check, Clock, XCircle, CheckCircle } from 'lucide-react';
import { AttributesTab } from '../tabs/AttributesTab';
import { RelationshipsTab } from '../tabs/RelationshipsTab';
import { MasterDataEntity, MasterDataAttribute, ScopeType, CategoryType, FieldDataType, ApprovalRequest, EntityRelationship } from '../../categoryTypes';
import { Portal } from '../../../../common/Portal';
import { ReviewResultCard } from './ReviewResultCard';
import { SOURCE_TREND_LIST } from '../../../../dashboard/kpiReportData';
import { categoryTypeLabels } from '../../categoryConstants';
import { BTN_PRIMARY, BTN_OUTLINE, BTN_DESTRUCTIVE, BTN_GHOST_ICON, INPUT_CLS, VIEW_FIELD_CLS, LABEL_CLS, REQUIRED_MARK, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE, isoToDisplayDate, DateInput } from '../../../collection/collectionUi';

// Select dùng chung INPUT_CLS (40px) + icon mũi tên tùy biến
const SELECT_CLS = `${INPUT_CLS} pr-8 appearance-none cursor-pointer`;
const SELECT_ICON_CLS = 'absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none';

const EXPIRE_REASON_LABELS: Record<string, string> = {
  'Tích hợp vào danh mục khác': 'Tích hợp vào danh mục khác',
  'Quy định pháp luật thay đổi': 'Pháp luật, Quyết định bổ sung thay đổi',
  'Dữ liệu lỗi, cấu trúc cũ': 'Cấu trúc dữ liệu cũ, không còn phù hợp',
  'Khác': 'Lý do khác',
};

interface CategoryWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  step: number;
  setStep: (step: number) => void;
  entityId: string | null;
  formData: Partial<MasterDataEntity>;
  setFormData: (data: Partial<MasterDataEntity>) => void;
  onSaveStep1: (action: 'draft' | 'submit' | 'next' | 'next3') => void;
  requests?: ApprovalRequest[];
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
  /** Mở từ tab Phê duyệt (yêu cầu đang chờ): hiện nút Từ chối / Phê duyệt ở footer */
  approvalActions?: { onApprove: () => void; onReject: () => void } | null;
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
  approvalActions = null,
  isEditMode = false,
  requests
}: CategoryWizardModalProps) {
  const [modalIndex, setModalIndex] = useState(1);
  // State thật cho quan hệ khai báo trong wizard (Bước 3)
  const [wizardRelationships, setWizardRelationships] = useState<EntityRelationship[]>([]);

  const categoryRequest = requests
    ?.filter(r => r.entityId === entityId && r.type === 'category')
    .sort((a, b) => Number(b.id) - Number(a.id))[0];
  const expireRequest = requests
    ?.filter(r => r.entityId === entityId && r.type === 'expire')
    .sort((a, b) => Number(b.id) - Number(a.id))[0];
  const versionRequest = requests
    ?.filter(r => r.entityId === entityId && r.type === 'version')
    .sort((a, b) => Number(b.id) - Number(a.id))[0];

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
  // Màn Xem chi tiết: ô bị khóa theo mục 5.2 (chữ đen, nền #F0F0F0)
  const inputCls = isViewOnly ? `${INPUT_CLS} ${VIEW_FIELD_CLS}` : INPUT_CLS;
  const selectCls = isViewOnly ? `${SELECT_CLS} ${VIEW_FIELD_CLS}` : SELECT_CLS;

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
          <div className="flex flex-col border-b border-[#E2E8F0] bg-white shrink-0">
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-white">
              <h3 className="text-[16px] font-semibold text-[#020817]">
                {isViewOnly ? 'Chi tiết danh mục dùng chung' : isEditMode ? 'Chỉnh sửa danh mục dùng chung' : 'Thiết lập danh mục dùng chung'}
              </h3>
              <button type="button" onClick={onClose} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4 bg-white">
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
                        className="flex items-center gap-3 group cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${isActive ? 'border-[#155DFC] bg-[#155DFC] text-white' : isCompleted ? 'border-[#155DFC] bg-white text-[#155DFC]' : 'border-[#E2E8F0] bg-white text-[#94A3B8] group-hover:text-[#155DFC]'}`}>
                          {isCompleted ? <Check className="w-4 h-4" /> : <item.icon className="w-4 h-4" />}
                        </div>
                        <div className="flex-col text-left hidden sm:flex">
                          <span className={`text-[13px] ${isActive || isCompleted ? 'text-[#155DFC]' : 'text-[#64748B]'}`}>Bước {item.s}</span>
                          <span className={`text-[13px] font-medium ${isActive || isCompleted ? 'text-[#020817]' : 'text-[#64748B]'}`}>{item.label}</span>
                        </div>
                      </button>
                      {index < array.length - 1 && (
                        <div className="flex-1 mx-4 sm:mx-6 flex items-center">
                          <div className={`h-0.5 w-full rounded-full transition-colors ${isCompleted ? 'bg-[#155DFC]' : 'bg-[#E2E8F0]'}`} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Wizard Content Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 bg-white custom-scrollbar">
            {step === 1 && (
              <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-400">
                <div className="grid grid-cols-2 gap-4">
                  {entityId && (
                    <div className="col-span-2 rounded-2xl border border-[#E2E8F0] p-4 grid grid-cols-2 gap-x-6 gap-y-4">
                      <div className="col-span-2">
                        <div className={FIELD_LABEL}>Phiên bản danh mục</div>
                        <div className={`${FIELD_VALUE} mt-1`}>
                          v{formData.version || 1}.0
                          {!isViewOnly && <span className="text-[#64748B]">{` (Sẽ tự động tăng lên v${(formData.version || 1) + 1}.0 sau khi lưu/trình duyệt)`}</span>}
                        </div>
                      </div>
                      {isViewOnly && Number(formData.version || 1) > 1 && (
                        <>
                          <div>
                            <div className={FIELD_LABEL}>Hiệu lực</div>
                            <div className={`${FIELD_VALUE} mt-1`}>
                              {versionRequest?.changes?.effectiveDate
                                ? (isoToDisplayDate(versionRequest.changes.effectiveDate) || versionRequest.changes.effectiveDate)
                                : 'Chưa cập nhật'}
                            </div>
                          </div>
                          <div>
                            <div className={FIELD_LABEL}>Mô tả thay đổi</div>
                            <div className={`${FIELD_VALUE} mt-1 whitespace-pre-wrap`}>
                              {versionRequest?.changes?.changeDescription || 'Chưa cập nhật'}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  <div className="col-span-2 sm:col-span-1">
                    <label className={LABEL_CLS}>Mã danh mục <span className={REQUIRED_MARK}>*</span></label>
                    <input
                      type="text"
                      disabled={isViewOnly || !!entityId}
                      value={formData.code || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="VD: DM_GIOITINH"
                      className={inputCls}
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className={LABEL_CLS}>Tên danh sách danh mục <span className={REQUIRED_MARK}>*</span></label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={formData.name || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="VD: Danh mục quốc gia, Bộ dữ liệu cán bộ..."
                      className={inputCls}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className={LABEL_CLS}>Loại danh mục <span className={REQUIRED_MARK}>*</span></label>
                    <div className="relative">
                      <select
                        title="Loại danh mục"
                        disabled={isViewOnly}
                        value={formData.categoryType || ''}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, categoryType: e.target.value as CategoryType })}
                        className={selectCls}
                      >
                        <option value="">-- Chọn loại danh mục --</option>
                        {(Object.keys(categoryTypeLabels) as CategoryType[]).map(type => (
                          <option key={type} value={type}>{categoryTypeLabels[type]}</option>
                        ))}
                      </select>
                      <ChevronDown className={SELECT_ICON_CLS} />
                    </div>
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Cơ sở dữ liệu/Hệ thống</label>
                    <div className="relative">
                      <select
                        title="Cơ sở dữ liệu/Hệ thống"
                        disabled={isViewOnly}
                        value={formData.databaseSystem || ''}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, databaseSystem: e.target.value })}
                        className={selectCls}
                      >
                        <option value="">-- Chọn hệ thống nguồn --</option>
                        {SOURCE_TREND_LIST.map(system => (
                          <option key={system} value={system}>{system}</option>
                        ))}
                      </select>
                      <ChevronDown className={SELECT_ICON_CLS} />
                    </div>
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Đơn vị chủ quản <span className={REQUIRED_MARK}>*</span></label>
                    <div className="relative">
                      <select
                        title="Đơn vị chủ quản"
                        disabled={isViewOnly}
                        value={formData.managingAgency || ''}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, managingAgency: e.target.value })}
                        className={selectCls}
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
                      <ChevronDown className={SELECT_ICON_CLS} />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className={LABEL_CLS}>Căn cứ</label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={formData.canCu || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, canCu: e.target.value })}
                      placeholder="VD: Nghị định số 13/2023/NĐ-CP ngày 17/4/2023 của Chính phủ"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Phạm vi vĩ mô <span className={REQUIRED_MARK}>*</span></label>
                    <div className="relative">
                      <select
                        title="Phạm vi"
                        disabled={isViewOnly}
                        value={formData.scope || 'ministry'}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, scope: e.target.value as ScopeType })}
                        className={selectCls}
                      >
                        <option value="national">Cấp quốc gia</option>
                        <option value="ministry">Cấp bộ</option>
                        <option value="provincial">Cấp tỉnh</option>
                        <option value="internal">Sử dụng nội bộ</option>
                      </select>
                      <ChevronDown className={SELECT_ICON_CLS} />
                    </div>
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Nguồn dữ liệu</label>
                    <div className="relative">
                      <select 
                        title="Nguồn dữ liệu" 
                        disabled={isViewOnly} 
                        value={formData.dataSource || 'manual'}
                        onChange={(e) => setFormData({ ...formData, dataSource: e.target.value as any })}
                        className={selectCls}
                      >
                        <option value="manual">Tự cập nhật trực tiếp</option>
                        <option value="dldc">Đồng bộ Kho DLDC</option>
                      </select>
                      <ChevronDown className={SELECT_ICON_CLS} />
                    </div>
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Ngày hiệu lực</label>
                    {isViewOnly ? (
                      <input
                        type="text"
                        disabled
                        value={isoToDisplayDate(formData.effectiveDate || '') || formData.effectiveDate || ''}
                        placeholder="dd/mm/yyyy"
                        className={inputCls}
                      />
                    ) : (
                      <DateInput
                        ariaLabel="Ngày hiệu lực"
                        value={formData.effectiveDate || ''}
                        onChange={(v) => setFormData({ ...formData, effectiveDate: v })}
                      />
                    )}
                  </div>

                  {false && (
                    <div className="col-span-2 grid grid-cols-3 gap-4 p-4 rounded-2xl border border-[#E2E8F0] animate-in fade-in zoom-in-95 duration-200">
                      <div>
                        <label className={LABEL_CLS}>Lấy từ mục (Chủ đề)</label>
                        <div className="relative">
                          <select
                            disabled={isViewOnly}
                            className={selectCls}
                          >
                            <option value="">-- Chọn mục --</option>
                            <option value="hotich">Hộ tịch</option>
                            <option value="lltp">Lý lịch tư pháp</option>
                            <option value="btdp">Bổ trợ tư pháp</option>
                          </select>
                          <ChevronDown className={SELECT_ICON_CLS} />
                        </div>
                      </div>
                      <div>
                        <label className={LABEL_CLS}>Bảng dữ liệu</label>
                        <div className="relative">
                          <select 
                            disabled={isViewOnly}
                            className={selectCls}
                          >
                            <option value="">-- Chọn bảng --</option>
                            <option value="tbl_khaisinh">tbl_khaisinh</option>
                            <option value="tbl_kethon">tbl_kethon</option>
                            <option value="tbl_khaiduong">tbl_khaiduong</option>
                          </select>
                          <ChevronDown className={SELECT_ICON_CLS} />
                        </div>
                      </div>
                      <div>
                        <label className={LABEL_CLS}>Trường dữ liệu</label>
                        <div className="relative">
                          <select 
                            disabled={isViewOnly}
                            className={selectCls}
                          >
                            <option value="">-- Chọn trường --</option>
                            <option value="ma_dinh_danh">Mã định danh</option>
                            <option value="ho_ten">Họ tên</option>
                            <option value="ngay_sinh">Ngày sinh</option>
                            <option value="*">Tất cả (*)</option>
                          </select>
                          <ChevronDown className={SELECT_ICON_CLS} />
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {isViewOnly && entityId && (
                  <div className="space-y-4">
                    {(formData.lifecycleStatus === 'pending_approval' || formData.lifecycleStatus === 'approved' || formData.lifecycleStatus === 'active' || formData.lifecycleStatus === 'rejected' || formData.lifecycleStatus === 'inactive') && (
                      <div>
                        <div className={LABEL_CLS}>Nội dung trình duyệt</div>
                        <div className="px-3 py-2 bg-[#F0F0F0] border border-[rgba(0,0,0,0.26)] rounded-lg text-[13px] text-[#000000] min-h-10 whitespace-pre-wrap">
                          {categoryRequest?.submissionContent || <span className="text-[#94A3B8]">Chưa cập nhật</span>}
                        </div>
                      </div>
                    )}

                    {(formData.lifecycleStatus === 'approved' || formData.lifecycleStatus === 'active' || formData.lifecycleStatus === 'inactive') && (
                      <ReviewResultCard status="approved" label="Ý kiến phê duyệt danh mục" comment={categoryRequest?.comments} />
                    )}

                    {formData.lifecycleStatus === 'rejected' && (
                      <ReviewResultCard status="rejected" label="Lý do từ chối danh mục" comment={categoryRequest?.comments} />
                    )}

                    {versionRequest && (versionRequest.status === 'approved' || versionRequest.status === 'rejected') && (
                      <ReviewResultCard
                        status={versionRequest.status}
                        label={versionRequest.status === 'approved' ? 'Ý kiến phê duyệt phiên bản' : 'Lý do từ chối phiên bản'}
                        comment={versionRequest.comments}
                      />
                    )}

                    {formData.lifecycleStatus === 'inactive' && (
                      <div className="space-y-4">
                        <div className="rounded-2xl border border-[#E2E8F0] p-4">
                          <div className={SECTION_TITLE}>
                            <Clock className="w-4 h-4 text-[#475569]" /> Thông tin hết hiệu lực
                          </div>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            <div>
                              <div className={FIELD_LABEL}>Thời điểm hết hiệu lực</div>
                              <div className={`${FIELD_VALUE} mt-1`}>
                                {expireRequest?.changes?.expireDate
                                  ? (isoToDisplayDate(expireRequest.changes.expireDate) || expireRequest.changes.expireDate)
                                  : '-'}
                              </div>
                            </div>
                            <div>
                              <div className={FIELD_LABEL}>Lý do ngừng sử dụng</div>
                              <div className={`${FIELD_VALUE} mt-1`}>
                                {EXPIRE_REASON_LABELS[expireRequest?.changes?.reason] || expireRequest?.changes?.reason || '-'}
                              </div>
                            </div>
                          </div>
                        </div>
                        <ReviewResultCard status="approved" tone="amber" label="Ý kiến phê duyệt hết hiệu lực" comment={expireRequest?.comments} />
                      </div>
                    )}
                  </div>
                )}
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
                  relationships={wizardRelationships}
                  setRelationships={setWizardRelationships}
                  isViewOnly={isViewOnly}
                  readOnlyRelations={isViewOnly}
                  currentEntityId={entityId || undefined}
                  currentEntityName={formData.name || ''}
                  currentEntityCode={formData.code || ''}
                />
              </div>
            )}
          </div>

          {/* Wizard Footer */}
          <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center shrink-0">
            <div className="flex gap-3">
              <button onClick={onClose} className={BTN_OUTLINE}>
                {isViewOnly ? 'Đóng' : 'Hủy bỏ'}
              </button>
              {step > 1 && (
                <button onClick={() => setStep(step - 1)} className={BTN_OUTLINE}>
                  <ChevronLeft className="w-4 h-4" /> Quay lại
                </button>
              )}
            </div>

            <div className="flex gap-3">
              {!isViewOnly && (
                <button onClick={() => onSaveStep1('draft')} className={BTN_OUTLINE}>
                  <Save className="w-4 h-4" /> Lưu tạm
                </button>
              )}
              {!isViewOnly && step === 3 && (
                <button onClick={() => onSaveStep1('submit')} className={BTN_PRIMARY}>
                  <Send className="w-4 h-4" /> Gửi trình duyệt
                </button>
              )}
              {step < 3 && (
                <button onClick={() => {
                  if (isViewOnly) { setStep(step + 1); return; }
                  if (step === 1) { onSaveStep1('next'); return; }
                  if (step === 2) { onSaveStep1('next3'); return; }
                  setStep(step + 1);
                }} className={approvalActions ? BTN_OUTLINE : BTN_PRIMARY}>
                  Tiếp tục <ChevronRight className="w-4 h-4" />
                </button>
              )}
              {approvalActions && (
                <>
                  <button onClick={approvalActions.onReject} className={BTN_DESTRUCTIVE}>
                    <XCircle className="w-4 h-4" /> Từ chối
                  </button>
                  <button onClick={approvalActions.onApprove} className={BTN_PRIMARY}>
                    <CheckCircle className="w-4 h-4" /> Phê duyệt
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

    </Portal>
  );
}
