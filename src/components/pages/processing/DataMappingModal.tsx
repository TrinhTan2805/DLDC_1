import React, { useState, type ReactNode } from 'react';
import { X, Database, Search, TableProperties, Merge, ArrowLeftRight, SquarePen, Trash2, Split, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { BaseModal } from '../../common/BaseModal';
import { TargetDatabase, mockTables, mockColumns } from './mockTargetDatabases';
import { MergeSplitModal } from './MergeSplitModal';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../ui/tooltip';
import { Badge, BTN_OUTLINE, BTN_PRIMARY, BTN_FOCUS, INPUT_CLS, TOOLTIP_CLS, normalizeSearch } from '../collection/collectionUi';

interface DataMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetDatabase?: TargetDatabase | null;
  sourceDatasetName?: string;
}

// Tooltip nằm trong BaseModal (z-index 9000+) nên cần nâng z-index cao hơn modal
const MODAL_TOOLTIP_CLS = `${TOOLTIP_CLS} !z-[10000]`;
const CARD_ICON_BTN = `w-8 h-8 inline-flex items-center justify-center rounded-lg text-[#475569] hover:bg-[#F1F5F9] transition-colors ${BTN_FOCUS}`;
const ACCENT_BTN = `h-10 px-4 inline-flex items-center justify-center gap-2 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] text-[#16A34A] text-[13px] font-medium hover:bg-[#DCFCE7] transition-colors ${BTN_FOCUS}`;

const WithTooltip = ({ label, children }: { label: string; children: ReactNode }) => (
  <Tooltip>
    <TooltipTrigger asChild>{children}</TooltipTrigger>
    <TooltipContent side="top" sideOffset={4} className={MODAL_TOOLTIP_CLS}>{label}</TooltipContent>
  </Tooltip>
);

// Dòng thông tin kiểu / độ dài / cho phép null (12px, nhãn #64748B, giá trị #020817)
const FieldMeta = ({ type, length, nullable }: { type?: string; length?: string; nullable?: boolean }) => (
  <div className="mt-1 flex items-center gap-x-3 gap-y-0.5 flex-wrap text-[12px] text-[#64748B]">
    {type && <span>Kiểu: <span className="text-[#020817]">{type}</span></span>}
    {length && <span>Độ dài: <span className="text-[#020817]">{length}</span></span>}
    {nullable !== undefined && <span>Cho phép Null: <span className="text-[#020817]">{String(nullable)}</span></span>}
  </div>
);

const SearchBox = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) => (
  <div className="relative">
    <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    <input
      type="text"
      placeholder={placeholder}
      aria-label={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${INPUT_CLS} pl-9`}
    />
  </div>
);

const onCardKey = (e: React.KeyboardEvent, action: () => void) => {
  if (e.target !== e.currentTarget) return;
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    action();
  }
};

export function DataMappingModal({ isOpen, onClose, targetDatabase, sourceDatasetName }: DataMappingModalProps) {
  const [selectedTargetTable, setSelectedTargetTable] = useState('HS_KHAI_SINH');
  const [sourceSearch, setSourceSearch] = useState('');
  const [tableSearch, setTableSearch] = useState('');
  const [fieldSearch, setFieldSearch] = useState('');
  const [selectedSourceFields, setSelectedSourceFields] = useState<string[]>([]);
  const [isMergeSplitModalOpen, setIsMergeSplitModalOpen] = useState(false);
  const [customFields, setCustomFields] = useState<any[]>([]);
  const [editingField, setEditingField] = useState<any>(null);

  // Mapping logic state
  const [activeSourceField, setActiveSourceField] = useState<string | null>(null);
  const [mappings, setMappings] = useState<Record<string, string>>({}); // { sourceFieldName: targetFieldName }
  const [isAutoMapped, setIsAutoMapped] = useState(false);

  const sourceFields = [
    { name: 'DIP_RefId', type: 'VARCHAR', length: '4000', nullable: true },
    { name: 'ID', type: 'INT', isPk: true },
    { name: 'HOTEN', type: 'NVARCHAR', length: '255' },
    { name: 'NGAYSINH', type: 'DATE' },
    { name: 'GIOITINH', type: 'VARCHAR', length: '10' },
    ...customFields
  ];

  const handleMergeSubmit = (data: any) => {
    if (editingField) {
      setCustomFields(prev => prev.map(f => f.id === editingField.id ? {
        ...f,
        name: data.name,
        type: data.type,
        sourceInfo: `Nối bằng "${data.separator}" từ ${data.fields.join(', ')}`,
        raw: data
      } : f));
      setEditingField(null);
    } else {
      const newField = {
        id: Date.now().toString(),
        name: data.name,
        type: data.type,
        isCustom: true,
        mode: 'merge',
        sourceInfo: `Nối bằng "${data.separator}" từ ${data.fields.join(', ')}`,
        raw: data
      };
      setCustomFields(prev => [...prev, newField]);
    }
  };

  const handleSplitSubmit = (data: any) => {
    if (editingField) {
      // For split, it's more complex because one split creates multiple fields.
      // Usually "Edit" on a split field should probably edit the whole split group,
      // but for simplicity here we'll just update the one field's name/type
      // or re-generate if we want to be thorough.
      // Given the UI, let's just update the specific field.
      setCustomFields(prev => prev.map(f => f.id === editingField.id ? {
        ...f,
        name: data.targetRes?.name || f.name, // Split data structure is slightly different
        type: data.targetRes?.type || f.type,
        sourceInfo: `Tách bằng "${data.separator}" từ ${data.source}`,
        raw: { ...data, targetRes: data.targetRes || editingField.raw.targetRes }
      } : f));
      setEditingField(null);
    } else {
      const newFields = data.results.map((res: any, idx: number) => ({
        id: `${Date.now()}-${idx}`,
        name: res.name,
        type: res.type,
        isCustom: true,
        mode: 'split',
        sourceInfo: `Tách bằng "${data.separator}" từ ${data.source}`,
        raw: { ...data, targetRes: res }
      }));
      setCustomFields(prev => [...prev, ...newFields]);
    }
  };

  const handleAutoMap = () => {
    // Replicate source fields exactly to target
    const newMappings: Record<string, string> = {};
    sourceFields.forEach(src => {
      newMappings[src.name] = src.name;
    });

    setMappings(newMappings);
    setIsAutoMapped(true);
    setSelectedTargetTable('AUTO_GENERATED_TABLE');
    setActiveSourceField(null);
  };

  const resetMapping = () => {
    setMappings({});
    setIsAutoMapped(false);
    setSelectedTargetTable('HS_KHAI_SINH');
  };

  const deleteCustomField = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomFields(prev => prev.filter(f => f.id !== id));
    setSelectedSourceFields(prev => prev.filter(f => f !== id)); // If ID was used as name
  };

  const targetFields: any[] = isAutoMapped
    ? sourceFields.map(f => ({ ...f, length: f.length || '-' }))
    : (mockColumns[selectedTargetTable] || []);

  const toggleSourceField = (fieldName: string) => {
    setActiveSourceField(prev => prev === fieldName ? null : fieldName);
  };

  const handleTargetFieldSelect = (targetFieldName: string) => {
    if (isAutoMapped) {
      toast.warning('Đang trong chế độ tự động ánh xạ. Vui lòng đặt lại nếu muốn chỉnh sửa thủ công.');
      return;
    }

    if (!activeSourceField) {
      toast.warning('Vui lòng chọn một trường nguồn trước khi ánh xạ!');
      return;
    }

    // Check if target is already mapped to ANOTHER source
    const existingMapping = Object.entries(mappings).find(([src, tgt]) => tgt === targetFieldName && src !== activeSourceField);
    if (existingMapping) {
      toast.warning(`Trường '${targetFieldName}' đã được ánh xạ cho trường nguồn '${existingMapping[0]}'. Ánh xạ là 1-1.`);
      return;
    }

    if (isAutoMapped) return;
    setMappings(prev => ({
      ...prev,
      [activeSourceField]: targetFieldName
    }));
  };

  const unmapField = (sourceFieldName: string, e: React.MouseEvent) => {
    if (isAutoMapped) return;
    e.stopPropagation();
    const newMappings = { ...mappings };
    delete newMappings[sourceFieldName];
    setMappings(newMappings);
  };

  const handleSaveConfig = () => {
    toast.success('Đã lưu cấu hình ánh xạ!');
    onClose();
  };

  // Lọc không phân biệt hoa/thường và dấu tiếng Việt
  const filteredSourceFields = sourceFields.filter(f => normalizeSearch(f.name).includes(normalizeSearch(sourceSearch)));
  const filteredTables = mockTables.filter(t => normalizeSearch(`${t.name} ${t.description}`).includes(normalizeSearch(tableSearch)));
  const filteredTargetFields = targetFields.filter(f => normalizeSearch(f.name).includes(normalizeSearch(fieldSearch)));

  const emptyText = <p className="py-6 text-center text-[13px] text-[#64748B]">Không tìm thấy kết quả phù hợp</p>;

  const footer = (
    <>
      <button type="button" onClick={onClose} className={BTN_OUTLINE}>
        Hủy
      </button>
      <button type="button" onClick={handleSaveConfig} className={BTN_PRIMARY}>
        Lưu cấu hình
      </button>
    </>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Ánh xạ dữ liệu"
      subtitle="Liên kết bảng nguồn với CSDL Kho dữ liệu dùng chung"
      maxWidth="max-w-[1280px]"
      className="h-[90vh]"
      showCloseButton={true}
      headerActions={
        <div className="flex items-center gap-2">
          <WithTooltip label={isAutoMapped ? 'Hủy chế độ tự động' : 'Tự động tạo bảng và ánh xạ 1-1'}>
            <button
              type="button"
              onClick={isAutoMapped ? resetMapping : handleAutoMap}
              className={isAutoMapped ? BTN_OUTLINE : ACCENT_BTN}
            >
              {isAutoMapped ? <X className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              {isAutoMapped ? 'Hủy tự động' : 'Tự động ánh xạ'}
            </button>
          </WithTooltip>
          <button
            type="button"
            onClick={() => setIsMergeSplitModalOpen(true)}
            className={BTN_OUTLINE}
          >
            <Merge className="w-4 h-4" />
            Gộp / Tách cột
          </button>
        </div>
      }
      customHeaderIcon={
        <div className="w-10 h-10 shrink-0 rounded-lg bg-[#EAF3FF] flex items-center justify-center text-blue-600 mr-3">
          <ArrowLeftRight className="w-5 h-5" />
        </div>
      }
      footer={footer}
    >
      <div className="h-full min-h-0 grid grid-cols-3 grid-rows-[auto_auto_minmax(0,1fr)] gap-x-4 gap-y-3">
        {/* Hàng 1 — tiêu đề cột */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 shrink-0 rounded-lg bg-[#EAF3FF] flex items-center justify-center text-blue-600">
            <Database className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-[14px] font-semibold text-[#020817] truncate">Dữ liệu cần xử lý</h4>
            <p className="text-[12px] text-[#64748B] truncate">{sourceDatasetName || 'Bộ dữ liệu hồ sơ đăng ký khai sinh'}</p>
          </div>
        </div>
        <div className="col-span-2 flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 shrink-0 rounded-lg bg-[#EEF2FF] flex items-center justify-center text-[#4338CA]">
            <Database className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-[14px] font-semibold text-[#020817] truncate">Cơ sở dữ liệu xử lý</h4>
            <p className="text-[12px] text-[#64748B] truncate">Bảng đích & các trường</p>
          </div>
        </div>

        {/* Hàng 2 — ô lọc */}
        <SearchBox value={sourceSearch} onChange={setSourceSearch} placeholder="Lọc cột..." />
        <SearchBox value={tableSearch} onChange={setTableSearch} placeholder="Lọc bảng..." />
        <SearchBox value={fieldSearch} onChange={setFieldSearch} placeholder="Lọc cột..." />

        {/* Hàng 3 — CỘT 1: trường nguồn */}
        <div className="min-h-0 overflow-y-auto custom-scrollbar pr-1 space-y-2">
          {filteredSourceFields.length === 0 && emptyText}
          {filteredSourceFields.map((field, idx) => {
            const isMapped = !!mappings[field.name];
            const isActive = activeSourceField === field.name;
            const isCustom = field.isCustom;
            return (
              <div
                key={field.id || `${field.name}-${idx}`}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                onClick={() => toggleSourceField(field.name)}
                onKeyDown={(e) => onCardKey(e, () => toggleSourceField(field.name))}
                className={`p-3 rounded-xl border bg-white cursor-pointer transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${isActive ? 'border-blue-600 ring-1 ring-blue-600' : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'}`}
              >
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${isActive ? 'bg-blue-600 border-blue-600' : isMapped ? 'bg-[#16A34A] border-[#16A34A]' : 'border-[#CBD5E1] bg-white'}`}
                  >
                    {(isActive || isMapped) && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] font-semibold text-[#020817] break-all">{field.name}</span>
                      {field.isPk && <Badge label="PK" variant="slate" />}
                      {isCustom && (
                        <Badge
                          label={field.mode === 'merge' ? 'Gộp' : 'Tách'}
                          variant="orange"
                          icon={field.mode === 'merge' ? <Merge className="w-3.5 h-3.5" /> : <Split className="w-3.5 h-3.5" />}
                        />
                      )}
                    </div>
                    <FieldMeta type={field.type} length={field.length} nullable={field.nullable} />
                    {field.sourceInfo && (
                      <p className="mt-1 text-[12px] text-[#64748B]">{field.sourceInfo}</p>
                    )}
                    {isMapped && (
                      <div className="mt-2 flex items-center gap-1.5 flex-wrap text-[12px] text-[#64748B]">
                        <span>Đã ánh xạ tới:</span>
                        <Badge label={mappings[field.name]} variant="green" />
                      </div>
                    )}
                  </div>
                  {(isMapped || isCustom) && (
                    <div className="shrink-0 flex items-center gap-0.5 -mt-1 -mr-1">
                      {isMapped && !isAutoMapped && (
                        <WithTooltip label="Bỏ ánh xạ">
                          <button type="button" aria-label="Bỏ ánh xạ" onClick={(e) => unmapField(field.name, e)} className={`${CARD_ICON_BTN} hover:text-[#DC2626]`}>
                            <X className="w-4 h-4" />
                          </button>
                        </WithTooltip>
                      )}
                      {isCustom && (
                        <>
                          <WithTooltip label="Chỉnh sửa">
                            <button
                              type="button"
                              aria-label="Chỉnh sửa"
                              onClick={(e) => { e.stopPropagation(); setEditingField(field); setIsMergeSplitModalOpen(true); }}
                              className={`${CARD_ICON_BTN} hover:text-blue-600`}
                            >
                              <SquarePen className="w-4 h-4" />
                            </button>
                          </WithTooltip>
                          <WithTooltip label="Xóa">
                            <button type="button" aria-label="Xóa" onClick={(e) => deleteCustomField(field.id, e)} className={`${CARD_ICON_BTN} hover:text-[#DC2626]`}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </WithTooltip>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CỘT 2: bảng đích */}
        <div className="min-h-0 overflow-y-auto custom-scrollbar pr-1 space-y-2">
          {isAutoMapped ? (
            <div className="p-4 rounded-xl border-2 border-dashed border-[#BBF7D0] bg-[#F0FDF4] flex flex-col items-center justify-center text-center">
              <Database className="w-8 h-8 text-[#16A34A] mb-2" />
              <div className="text-[13px] font-semibold text-[#020817]">Bảng tự động tạo</div>
              <div className="text-[12px] text-[#16A34A] mt-1">Cấu trúc khớp 100% với nguồn</div>
            </div>
          ) : (
            <>
              {filteredTables.length === 0 && emptyText}
              {filteredTables.map((table) => {
                const isSelected = selectedTargetTable === table.name;
                return (
                  <button
                    type="button"
                    key={table.name}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedTargetTable(table.name)}
                    className={`w-full text-left p-3 rounded-xl border transition-colors ${BTN_FOCUS} ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-[#E2E8F0] text-[#020817] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${isSelected ? 'bg-white/20 text-white' : 'bg-[#EEF2FF] text-[#4338CA]'}`}>
                        <TableProperties className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold truncate">{table.name}</div>
                        <div className={`text-[12px] truncate mt-0.5 ${isSelected ? 'text-white/85' : 'text-[#64748B]'}`}>
                          {table.name} - {mockColumns[table.name]?.length || 0} trường
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </>
          )}
        </div>

        {/* CỘT 3: trường của bảng đích */}
        <div className="min-h-0 overflow-y-auto custom-scrollbar pr-1 space-y-2">
          {filteredTargetFields.length === 0 && emptyText}
          {filteredTargetFields.map((field, idx) => {
            const mappedToSource = Object.entries(mappings).find(([_, tgt]) => tgt === field.name)?.[0];
            const isSelected = !!mappedToSource;
            const isCurrentSelection = activeSourceField ? mappings[activeSourceField] === field.name : false;
            const nullable: boolean | undefined = field.nullable ?? (field.notNull === undefined ? undefined : !field.notNull);

            return (
              <div
                key={`${field.name}-${idx}`}
                role="button"
                tabIndex={0}
                aria-pressed={isCurrentSelection}
                onClick={() => handleTargetFieldSelect(field.name)}
                onKeyDown={(e) => onCardKey(e, () => handleTargetFieldSelect(field.name))}
                className={`p-3 rounded-xl border bg-white cursor-pointer transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${isCurrentSelection ? 'border-blue-600 ring-1 ring-blue-600' : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'}`}
              >
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${isCurrentSelection ? 'border-blue-600 bg-white' : isSelected ? 'bg-[#16A34A] border-[#16A34A]' : 'border-[#CBD5E1] bg-white'}`}
                  >
                    {isCurrentSelection
                      ? <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                      : isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] font-semibold text-[#020817] break-all">{field.name}</span>
                      {(field.isPk || field.isKey) && <Badge label="PK" variant="slate" />}
                    </div>
                    <FieldMeta type={field.type} length={field.length} nullable={nullable} />
                    {isSelected && (
                      <div className="mt-1 text-[12px] text-[#64748B]">
                        Ánh xạ từ: <span className="font-medium text-[#020817]">{mappedToSource}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <MergeSplitModal
        isOpen={isMergeSplitModalOpen}
        onClose={() => { setIsMergeSplitModalOpen(false); setEditingField(null); }}
        sourceFields={sourceFields.filter(f => !f.isCustom)}
        onMergeSubmit={handleMergeSubmit}
        onSplitSubmit={handleSplitSubmit}
        initialData={editingField?.raw}
        mode={editingField?.mode}
      />
    </BaseModal>
  );
}
