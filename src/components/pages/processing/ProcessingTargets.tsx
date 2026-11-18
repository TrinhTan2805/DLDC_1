// Xử lý dữ liệu — 1 nguồn xử lý về NHIỀU CSDL đích (log 244)
// Chốt với BA: quy tắc làm sạch/chuẩn hóa/biến đổi DÙNG CHUNG; mỗi đích có ánh xạ + điều kiện lọc RIÊNG;
// 1 lịch biểu chung; chạy theo từng đích, đích này lỗi không ảnh hưởng đích khác.
import { Fragment, useEffect, useState } from 'react';
import { ArrowLeftRight, ArrowUpRight, ChevronUp, Database, Eye, Filter, Info, Layers, Plus, SquarePen, Trash2, Play, RefreshCw } from 'lucide-react';
import { BaseModal } from '../../common/BaseModal';
import { Badge, RowIconAction, BTN_OUTLINE, BTN_PRIMARY, BTN_DESTRUCTIVE, INPUT_CLS } from '../collection/collectionUi';

// Điều kiện lọc (log 245): danh sách điều kiện + nhóm, nối nhau bằng AND / OR — cùng mô hình "Gom Nhóm"
// của Bộ lọc nâng cao (common/AdvancedFilterGroup). Xét theo thứ tự từ trên xuống; nhóm = cặp ngoặc.
export type FilterLogic = 'AND' | 'OR';
export interface TargetFilterCondition { id: string; logic: FilterLogic; field: string; op: string; value: string }
export interface TargetFilterGroup { id: string; kind: 'group'; logic: FilterLogic; conditions: TargetFilterCondition[] }
export type TargetFilterItem = TargetFilterCondition | TargetFilterGroup;
export const isFilterGroupItem = (x: TargetFilterItem): x is TargetFilterGroup => (x as TargetFilterGroup).kind === 'group';

export interface ProcessingTarget {
  id: string;
  dbId: string;
  dbName: string;
  dbType: string;
  table: string;
  mappedCount: number;
  /** Điều kiện lọc bản ghi đưa vào đích (AND / OR / nhóm); rỗng = toàn bộ bản ghi */
  filter: TargetFilterItem[];
  hasData: boolean;
  lastRun?: string;
}

export type RunAction = 'convert' | 'update' | 'delete';

// Trường nguồn dùng cho điều kiện lọc (khớp bảng nguồn mẫu của DataMappingModal)
export const SOURCE_FILTER_FIELDS = ['MA_TINH', 'MA_DON_VI', 'GIOITINH', 'NGAYSINH', 'HOTEN'];
const OPERATORS = ['=', '≠', 'Thuộc (IN)', 'Chứa', '>', '<'];

const uid = () => `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
const newCond = (): TargetFilterCondition => ({ id: uid(), logic: 'AND', field: '', op: '=', value: '' });
const newGroup = (): TargetFilterGroup => ({ id: uid(), kind: 'group', logic: 'AND', conditions: [newCond()] });
const condText = (c: TargetFilterCondition) => `${c.field} ${c.op} ${c.value}`;

/** Chuỗi tóm tắt: MA_TINH = 27 AND (MA_DON_VI = 27.STP OR MA_DON_VI = 27.CA) */
export const filterText = (f: TargetFilterItem[]) =>
  f.map((it, i) => {
    const body = isFilterGroupItem(it)
      ? `(${it.conditions.map((c, j) => `${j ? `${c.logic} ` : ''}${condText(c)}`).join(' ')})`
      : condText(it);
    return `${i ? `${it.logic} ` : ''}${body}`;
  }).join(' ');

/** Mẫu: dataset đầu tiên đã cấu hình 2 đích để minh họa */
export const seedTargets = (datasetId: string): ProcessingTarget[] => [
  { id: `${datasetId}-t1`, dbId: '1', dbName: 'CSDL Kho DLDC', dbType: 'PostgreSQL', table: 'HS_KHAI_SINH', mappedCount: 5, filter: [], hasData: true, lastRun: '27-02-2026 14:19' },
  { id: `${datasetId}-t2`, dbId: '2', dbName: 'CSDL Phân tích số liệu', dbType: 'Oracle', table: 'DIP_PERSON', mappedCount: 4, filter: [
    { id: 'c1', logic: 'AND', field: 'MA_TINH', op: '=', value: '27' },
    { id: 'g1', kind: 'group', logic: 'AND', conditions: [
      { id: 'c2', logic: 'AND', field: 'MA_DON_VI', op: '=', value: '27.STP' },
      { id: 'c3', logic: 'OR', field: 'MA_DON_VI', op: '=', value: '27.CA' },
    ] },
  ], hasData: false },
];

/** Lý do không chạy được 1 thao tác trên 1 đích (rỗng = chạy được) — cùng quy tắc nút của màn Xử lý / Hợp nhất */
export const runBlockReason = (t: ProcessingTarget, action: RunAction): string => {
  if (action === 'convert') {
    if (t.mappedCount === 0) return 'Chưa ánh xạ trường dữ liệu';
    if (t.hasData) return 'Đã có dữ liệu – dùng Cập nhật dữ liệu';
  }
  if ((action === 'update' || action === 'delete') && !t.hasData) return 'Chưa có dữ liệu – chạy Chuyển đổi trước';
  return '';
};
export const RUN_LABEL: Record<RunAction, string> = { convert: 'Chuyển đổi dữ liệu', update: 'Cập nhật dữ liệu', delete: 'Xóa dữ liệu' };

const TH = 'px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-2 text-left text-[13px] text-black align-top';
const HAS_DATA_REASON = 'Đích đã có dữ liệu – xóa dữ liệu của đích trước';

const MOCK_MAPPING_ROWS = [
  { source: 'ID', sourceType: 'INT', target: 'ID', targetType: 'INT', note: 'Khóa chính' },
  { source: 'HOTEN', sourceType: 'NVARCHAR(255)', target: 'HoTen', targetType: 'NVARCHAR(255)', note: '' },
  { source: 'NGAYSINH', sourceType: 'DATE', target: 'NgaySinh', targetType: 'DATE', note: '' },
  { source: 'GIOITINH', sourceType: 'VARCHAR(10)', target: 'GioiTinh', targetType: 'VARCHAR(10)', note: '' },
  { source: 'DIP_RefId', sourceType: 'VARCHAR(4000)', target: 'DIP_RefId', targetType: 'VARCHAR(4000)', note: 'Tham chiếu' },
];

// ---------------------------------------------------------------------------
// Danh sách CSDL đích của 1 nguồn (tab "CSDL đích & Ánh xạ")
// ---------------------------------------------------------------------------
export function TargetsPanel({ targets, onAdd, onEditMapping, onEditFilter, onRemove, onOpenDb }: {
  targets: ProcessingTarget[];
  onAdd: () => void;
  onEditMapping: (t: ProcessingTarget) => void;
  onEditFilter: (t: ProcessingTarget) => void;
  onRemove: (t: ProcessingTarget) => void;
  onOpenDb: (t: ProcessingTarget) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (targets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white border-2 border-dashed border-slate-200 rounded-2xl">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <ArrowLeftRight className="w-10 h-10 text-blue-600" />
        </div>
        <h3 className="text-[16px] font-semibold text-[#020817] mb-2">Chưa có CSDL đích</h3>
        <p className="text-[13px] text-[#64748B] mb-6 max-w-lg text-center leading-relaxed">
          Thêm một hoặc nhiều CSDL đích và thiết lập ánh xạ trường từ CSDL thu thập sang từng đích. Quy tắc làm sạch, chuẩn hóa, biến đổi dùng chung cho mọi đích.
        </p>
        <button type="button" onClick={onAdd} className={BTN_PRIMARY}>
          <Plus className="w-4 h-4" /> Thêm CSDL đích
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[14px] font-semibold text-[#020817]">CSDL đích đã cấu hình ({targets.length})</h3>
          <p className="text-[13px] text-[#64748B] mt-1">Mỗi đích có ánh xạ và điều kiện lọc riêng; quy tắc xử lý và lịch biểu dùng chung.</p>
        </div>
        <button type="button" onClick={onAdd} className={`${BTN_PRIMARY} whitespace-nowrap`}>
          <Plus className="w-4 h-4" /> Thêm CSDL đích
        </button>
      </div>

      <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead className="bg-[#F8FAFC]">
              <tr className="h-[42px] border-b border-[#E2E8F0]">
                <th className={`${TH} w-12 text-center`}>STT</th>
                <th className={TH}>CSDL đích</th>
                <th className={TH}>Bảng đích</th>
                <th className={TH}>Ánh xạ</th>
                <th className={TH}>Điều kiện lọc</th>
                <th className={TH}>Dữ liệu</th>
                <th className={`${TH} text-center w-px`}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {targets.map((t, i) => {
                const open = expanded === t.id;
                return (
                  <Fragment key={t.id}>
                    <tr className="bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                      <td className={`${TD} text-center`}>{i + 1}</td>
                      <td className={TD}>
                        <button type="button" onClick={() => onOpenDb(t)} className="inline-flex items-center gap-1 font-medium text-[#155DFC] hover:underline whitespace-nowrap" title="Xem cơ sở dữ liệu">
                          {t.dbName}
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                        <div className="text-[12px] text-[#64748B]">{t.dbType}</div>
                      </td>
                      <td className={`${TD} font-medium`}>{t.table}</td>
                      <td className={`${TD} whitespace-nowrap`}>{t.mappedCount ? `${t.mappedCount} trường` : <span className="text-[#DC2626]">Chưa ánh xạ</span>}</td>
                      <td className={TD}>{t.filter.length ? <code className="text-[12px] bg-[#F1F5F9] px-1.5 py-0.5 rounded">{filterText(t.filter)}</code> : <span className="text-[#64748B]">Toàn bộ bản ghi</span>}</td>
                      <td className={TD}>
                        <Badge label={t.hasData ? 'Đã có dữ liệu' : 'Chưa có dữ liệu'} variant={t.hasData ? 'green' : 'slate'} />
                        {t.lastRun && <div className="text-[12px] text-[#64748B] mt-1">Lần chạy: {t.lastRun}</div>}
                      </td>
                      <td className="px-3 py-2 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <RowIconAction label={open ? 'Ẩn ánh xạ' : 'Xem ánh xạ'} onClick={() => setExpanded(open ? null : t.id)}>
                            {open ? <ChevronUp className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </RowIconAction>
                          <RowIconAction label="Chỉnh sửa ánh xạ" onClick={() => onEditMapping(t)} disabledReason={t.hasData ? HAS_DATA_REASON : undefined}>
                            <SquarePen className="w-4 h-4" />
                          </RowIconAction>
                          <RowIconAction label="Điều kiện lọc" onClick={() => onEditFilter(t)} disabledReason={t.hasData ? HAS_DATA_REASON : undefined}>
                            <Filter className="w-4 h-4" />
                          </RowIconAction>
                          <RowIconAction label="Gỡ CSDL đích" onClick={() => onRemove(t)} disabledReason={t.hasData ? HAS_DATA_REASON : undefined}>
                            <Trash2 className="w-4 h-4" />
                          </RowIconAction>
                        </div>
                      </td>
                    </tr>
                    {open && (
                      <tr className="bg-[#F8FAFC] border-b border-[#E0E0E0]">
                        <td colSpan={7} className="px-4 py-3">
                          <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
                            <table className="w-full border-collapse text-[13px]">
                              <thead className="bg-[#F8FAFC]">
                                <tr className="border-b border-[#E2E8F0]">
                                  <th className={TH}>Trường nguồn</th><th className={TH}>Kiểu</th><th className={`${TH} w-10`} />
                                  <th className={TH}>Trường đích ({t.table})</th><th className={TH}>Kiểu</th><th className={TH}>Ghi chú</th>
                                </tr>
                              </thead>
                              <tbody>
                                {MOCK_MAPPING_ROWS.slice(0, Math.max(t.mappedCount, 0)).map((m) => (
                                  <tr key={m.source} className="border-b border-[#F1F5F9] last:border-b-0">
                                    <td className="px-3 py-2 font-medium">{m.source}</td>
                                    <td className="px-3 py-2 text-[12px] text-[#64748B] font-mono">{m.sourceType}</td>
                                    <td className="px-3 py-2"><ArrowLeftRight className="w-4 h-4 text-[#CBD5E1]" /></td>
                                    <td className="px-3 py-2 font-medium">{t.table}.{m.target}</td>
                                    <td className="px-3 py-2 text-[12px] text-[#64748B] font-mono">{m.targetType}</td>
                                    <td className="px-3 py-2 text-[#64748B]">{m.note}</td>
                                  </tr>
                                ))}
                                {t.mappedCount === 0 && <tr><td colSpan={6} className="py-6 text-center text-[#64748B]">Chưa ánh xạ trường nào.</td></tr>}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Popup điều kiện lọc của 1 đích
// ---------------------------------------------------------------------------
const LOGIC_CLS = `${INPUT_CLS} cursor-pointer`;

/** 1 dòng điều kiện: [AND/OR] Trường · Phép so sánh · Giá trị · Xóa */
function ConditionRow({ c, showLogic, showErr, onChange, onRemove }: {
  c: TargetFilterCondition; showLogic: boolean; showErr: boolean;
  onChange: (patch: Partial<TargetFilterCondition>) => void; onRemove: () => void;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-24 shrink-0">
        {showLogic && (
          <select aria-label="Toán tử logic" className={LOGIC_CLS} value={c.logic} onChange={(e) => onChange({ logic: e.target.value as FilterLogic })}>
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </select>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <select aria-label="Trường nguồn" className={`${INPUT_CLS} cursor-pointer ${showErr && !c.field ? '!border-[#DC2626]' : ''}`} value={c.field} onChange={(e) => onChange({ field: e.target.value })}>
          <option value="" disabled hidden>-- Chọn trường --</option>
          {SOURCE_FILTER_FIELDS.map((f) => <option key={f}>{f}</option>)}
        </select>
      </div>
      <div className="w-36 shrink-0">
        <select aria-label="Phép so sánh" className={LOGIC_CLS} value={c.op} onChange={(e) => onChange({ op: e.target.value })}>
          {OPERATORS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div className="flex-1 min-w-0">
        <input aria-label="Giá trị" maxLength={255} className={`${INPUT_CLS} ${showErr && !c.value.trim() ? '!border-[#DC2626]' : ''}`} value={c.value}
          placeholder={c.op === 'Thuộc (IN)' ? 'VD: 27, 01, 79' : 'Nhập giá trị...'} onChange={(e) => onChange({ value: e.target.value })} />
      </div>
      <button type="button" aria-label="Xóa điều kiện" title="Xóa điều kiện" onClick={onRemove}
        className="w-10 h-10 shrink-0 inline-flex items-center justify-center rounded-lg text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export function TargetFilterModal({ target, onClose, onSave }: {
  target: ProcessingTarget | null;
  onClose: () => void;
  onSave: (filter: TargetFilterItem[]) => void;
}) {
  const [items, setItems] = useState<TargetFilterItem[]>([]);
  const [showErr, setShowErr] = useState(false);
  useEffect(() => { if (target) { setItems(JSON.parse(JSON.stringify(target.filter))); setShowErr(false); } }, [target]);

  const setItem = (i: number, next: TargetFilterItem) => setItems((p) => p.map((x, k) => (k === i ? next : x)));
  const removeItem = (i: number) => setItems((p) => p.filter((_, k) => k !== i));
  const allConds = items.flatMap((it) => (isFilterGroupItem(it) ? it.conditions : [it]));
  const save = () => {
    if (allConds.some((c) => !c.field || !c.value.trim())) { setShowErr(true); return; }
    onSave(items.map((it) => (isFilterGroupItem(it)
      ? { ...it, conditions: it.conditions.map((c) => ({ ...c, value: c.value.trim() })) }
      : { ...it, value: it.value.trim() })));
  };
  const preview = filterText(items.filter((it) => (isFilterGroupItem(it) ? it.conditions.every((c) => c.field && c.value.trim()) : it.field && it.value.trim())));

  return (
    <BaseModal
      isOpen={!!target}
      onClose={onClose}
      title="Điều kiện lọc bản ghi"
      subtitle={target ? `${target.dbName} › ${target.table}` : ''}
      maxWidth="max-w-4xl"
      customHeaderIcon={<div className="w-10 h-10 shrink-0 rounded-lg bg-[#EAF3FF] flex items-center justify-center text-blue-600 mr-3"><Filter className="w-5 h-5" /></div>}
      footer={
        <>
          <button type="button" onClick={onClose} className={BTN_OUTLINE}>Hủy bỏ</button>
          <button type="button" onClick={save} className={BTN_PRIMARY}>Lưu điều kiện</button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex gap-2 items-start rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-2 text-[13px] text-[#1E40AF]">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            Chỉ bản ghi (sau làm sạch, chuẩn hóa, biến đổi) thỏa điều kiện mới được đưa vào đích này; không có điều kiện = <b>toàn bộ</b> bản ghi.
            Các điều kiện nối nhau bằng <b>AND</b> / <b>OR</b>, xét từ trên xuống; dùng <b>Gom Nhóm</b> để đặt các điều kiện trong ngoặc, VD <i>MA_TINH = 27 AND (MA_DON_VI = 27.STP OR MA_DON_VI = 27.CA)</i>.
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <h4 className="text-[13px] font-semibold text-[#020817]">Điều kiện</h4>
          <div className="flex items-center gap-2">
            <button type="button" className={BTN_OUTLINE} onClick={() => setItems((p) => [...p, newCond()])}>
              <Plus className="w-4 h-4" /> Thêm điều kiện
            </button>
            <button type="button" className={BTN_OUTLINE} onClick={() => setItems((p) => [...p, newGroup()])}>
              <Layers className="w-4 h-4" /> Gom Nhóm
            </button>
          </div>
        </div>

        {items.length === 0 && <p className="py-4 text-center text-[13px] text-[#64748B]">Chưa có điều kiện – đích nhận toàn bộ bản ghi.</p>}

        <div className="space-y-3">
          {items.map((it, i) => isFilterGroupItem(it) ? (
            <div key={it.id} className="flex items-start gap-2">
              <div className="w-24 shrink-0">
                {i > 0 && (
                  <select aria-label="Toán tử logic của nhóm" className={LOGIC_CLS} value={it.logic} onChange={(e) => setItem(i, { ...it, logic: e.target.value as FilterLogic })}>
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </select>
                )}
              </div>
              <div className="flex-1 min-w-0 bg-white border border-[#E2E8F0] border-l-[3px] border-l-blue-600 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12px] font-semibold text-[#155DFC]">Nhóm điều kiện ( … )</span>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => setItem(i, { ...it, conditions: [...it.conditions, newCond()] })}
                      className="inline-flex items-center gap-1 h-7 px-2 rounded-md border border-blue-200 bg-white text-[12px] font-medium text-blue-600 hover:bg-blue-50 transition-colors">
                      <Plus className="w-3.5 h-3.5" /> Thêm điều kiện
                    </button>
                    <button type="button" aria-label="Xóa nhóm" title="Xóa nhóm" onClick={() => removeItem(i)}
                      className="p-1.5 rounded-md text-[#DC2626] hover:bg-[#FEF2F2] transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {it.conditions.map((c, j) => (
                  <ConditionRow
                    key={c.id}
                    c={c}
                    showLogic={j > 0}
                    showErr={showErr}
                    onChange={(patch) => setItem(i, { ...it, conditions: it.conditions.map((x, k) => (k === j ? { ...x, ...patch } : x)) })}
                    onRemove={() => {
                      const conditions = it.conditions.filter((_, k) => k !== j);
                      if (conditions.length === 0) removeItem(i); else setItem(i, { ...it, conditions });
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <ConditionRow
              key={it.id}
              c={it}
              showLogic={i > 0}
              showErr={showErr}
              onChange={(patch) => setItem(i, { ...it, ...patch })}
              onRemove={() => removeItem(i)}
            />
          ))}
        </div>

        {showErr && allConds.some((c) => !c.field || !c.value.trim()) && (
          <p className="text-[12px] text-[#DC2626]">Vui lòng chọn trường và nhập giá trị cho mọi điều kiện (ô viền đỏ).</p>
        )}
        {preview && (
          <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2">
            <div className="text-[12px] font-semibold text-[#475569] mb-1">Biểu thức lọc</div>
            <code className="text-[12px] text-[#020817] break-words">{preview}</code>
          </div>
        )}
      </div>
    </BaseModal>
  );
}

// ---------------------------------------------------------------------------
// Popup chọn đích khi Chuyển đổi / Cập nhật / Xóa dữ liệu
// ---------------------------------------------------------------------------
export function RunTargetsModal({ action, targets, onClose, onConfirm }: {
  action: RunAction | null;
  targets: ProcessingTarget[];
  onClose: () => void;
  onConfirm: (ids: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  useEffect(() => {
    if (action) setSelected(targets.filter((t) => !runBlockReason(t, action)).map((t) => t.id));
  }, [action]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!action) return null;
  const runnable = targets.filter((t) => !runBlockReason(t, action));
  const allOn = runnable.length > 0 && runnable.every((t) => selected.includes(t.id));
  const Icon = action === 'convert' ? Play : action === 'update' ? RefreshCw : Trash2;

  return (
    <BaseModal
      isOpen
      onClose={onClose}
      title={RUN_LABEL[action]}
      subtitle="Chọn CSDL đích thực hiện. Mỗi đích chạy độc lập – đích lỗi không ảnh hưởng đích khác."
      maxWidth="max-w-2xl"
      customHeaderIcon={<div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center mr-3 ${action === 'delete' ? 'bg-[#FEF2F2] text-[#DC2626]' : 'bg-[#EAF3FF] text-blue-600'}`}><Icon className="w-5 h-5" /></div>}
      footer={
        <>
          <button type="button" onClick={onClose} className={BTN_OUTLINE}>Hủy bỏ</button>
          <button type="button" disabled={selected.length === 0} onClick={() => onConfirm(selected)} className={action === 'delete' ? BTN_DESTRUCTIVE : BTN_PRIMARY}>
            {RUN_LABEL[action]} ({selected.length})
          </button>
        </>
      }
    >
      <div className="space-y-3">
        {action === 'delete' && (
          <p className="text-[13px] text-[#B91C1C] bg-[#FEF2F2] border border-[#FEE2E2] rounded-lg px-3 py-2">
            Dữ liệu đã xử lý trong các đích được chọn sẽ bị xóa và không thể hoàn tác. Cấu hình ánh xạ, quy tắc giữ nguyên.
          </p>
        )}
        <label className={`flex items-center gap-2 text-[13px] font-semibold ${runnable.length ? 'cursor-pointer' : 'text-[#94A3B8]'}`}>
          <input type="checkbox" className="w-4 h-4 accent-blue-600" disabled={!runnable.length} checked={allOn}
            onChange={() => setSelected(allOn ? [] : runnable.map((t) => t.id))} />
          Chọn tất cả đích hợp lệ ({runnable.length}/{targets.length})
        </label>
        <div className="rounded-lg border border-[#E2E8F0] divide-y divide-[#E2E8F0]">
          {targets.map((t) => {
            const reason = runBlockReason(t, action);
            const on = selected.includes(t.id);
            return (
              <label key={t.id} className={`flex items-start gap-3 px-3 py-3 ${reason ? 'bg-[#F8FAFC] cursor-not-allowed' : 'cursor-pointer hover:bg-[#F8FAFC]'}`}>
                <input type="checkbox" className="w-4 h-4 mt-0.5 accent-blue-600" disabled={!!reason} checked={on}
                  onChange={() => setSelected((p) => (on ? p.filter((x) => x !== t.id) : [...p, t.id]))} />
                <Database className={`w-4 h-4 mt-0.5 shrink-0 ${reason ? 'text-[#94A3B8]' : 'text-blue-600'}`} />
                <div className="min-w-0 flex-1">
                  <div className={`text-[13px] font-medium ${reason ? 'text-[#94A3B8]' : 'text-[#020817]'}`}>{t.dbName} › {t.table}</div>
                  <div className="text-[12px] text-[#64748B]">
                    {t.filter.length ? `Lọc: ${filterText(t.filter)}` : 'Toàn bộ bản ghi'} · {t.hasData ? 'Đã có dữ liệu' : 'Chưa có dữ liệu'}
                  </div>
                  {reason && <div className="text-[12px] text-[#D97706] mt-0.5">{reason}</div>}
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </BaseModal>
  );
}
