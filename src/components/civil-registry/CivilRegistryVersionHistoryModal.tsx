import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { BTN_OUTLINE, BTN_GHOST_ICON, TOOLTIP_CLS, Badge, Pagination, type ColumnDef } from '../pages/collection/collectionUi';
import type { CivilRegistryRecord } from './CivilRegistryInfoTable';

// Modal Lịch sử phiên bản của 1 bản ghi (PM gửi mẫu 07/10/2026) — dữ liệu phiên bản là mock sinh từ bản ghi hiện tại.
// Giao diện theo compomennt.md: modal 5.4, bảng 5.3, badge 5.8, tooltip 5.3.1, phân trang 5.14.

type Cell = string | null; // null = cột không có trong cấu trúc ở phiên bản đó

interface VersionRow {
  version: number;
  savedAt: string;
  values: Record<string, Cell>;
  changedCount: number;
  deletedAt?: string;
  structureNote?: string;
}

const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px] text-left bg-[#F8FAFC]';
const TD = 'px-3 py-2 text-[13px] text-black whitespace-nowrap align-middle';
const STICKY_1 = 'sticky left-0 z-[1] min-w-[220px] w-[220px]';
const STICKY_2 = 'sticky left-[220px] z-[1] min-w-[170px] shadow-[1px_0_0_#E2E8F0]';

// Giá trị thô của 1 cột (không dùng render vì một số cột hiển thị Badge)
const rawValue = (r: CivilRegistryRecord, key: string): string => {
  const v = key.startsWith('detail:') ? r.details?.[key.slice(7)] : (key === 'type' ? r.gender || r.type : (r as any)[key]);
  return v === undefined || v === null ? '' : String(v);
};

const pad = (n: number) => String(n).padStart(2, '0');
const fmt = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
const hash = (s: string) => Array.from(s).reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

// Đổi giá trị để tạo phiên bản cũ hơn (mock)
const olderValue = (v: string, step: number) => {
  if (/^\d{4}([/-])\d{2}\1\d{2}/.test(v)) return v.replace(/^\d{4}/, (y) => String(Number(y) - 10 * step));
  if (/^\d{2}\/\d{2}\/\d{4}/.test(v)) return v.replace(/\d{4}/, (y) => String(Number(y) - step));
  if (/^\d+(\.\d+)?$/.test(v)) return String(Math.max(0, Number(v) - step));
  return v ? `${v} (cũ ${step})` : `Giá trị cũ ${step}`;
};

/** Sinh lịch sử phiên bản mock: mới nhất ở trên; mỗi phiên bản đổi 1 trường; 1 lần đổi cấu trúc (thêm cột cuối) */
function buildVersions(record: CivilRegistryRecord, columns: ColumnDef<CivilRegistryRecord>[]): VersionRow[] {
  const h = hash(record.id);
  const total = 3 + (h % 3); // 3–5 phiên bản
  const keys = columns.map((c) => c.key);
  const mutable = keys.filter((k) => !columns.find((c) => c.key === k)?.locked);
  const addedKey = keys.length > 2 ? keys[keys.length - 1] : undefined; // cột được thêm ở phiên bản 3
  const addedAt = 3;
  const deletedVersion = h % 2 === 0 && total >= 4 ? total - 1 : undefined; // dòng bị xóa ở nguồn sau phiên bản này
  const base = new Date(2026, 9, 6, 17, 21, 34);

  const rows: VersionRow[] = [];
  let current: Record<string, Cell> = Object.fromEntries(keys.map((k) => [k, rawValue(record, k)]));
  for (let v = total; v >= 1; v--) {
    const values = { ...current };
    if (addedKey && v < addedAt) values[addedKey] = null;
    const savedAt = new Date(base.getTime() - (total - v) * (86400000 * 1.3 + 3600000)); // cách nhau ~1,3 ngày
    rows.push({
      version: v,
      savedAt: fmt(savedAt),
      values,
      changedCount: 0,
      deletedAt: v === deletedVersion ? fmt(new Date(base.getTime() - 60000)) : undefined,
      structureNote: addedKey && v === addedAt ? `thêm ${columns.find((c) => c.key === addedKey)?.label}` : undefined,
    });
    // phiên bản cũ hơn: đổi 1 trường
    const k = mutable[(h + v) % Math.max(1, mutable.length)];
    if (k && current[k] !== null) current = { ...current, [k]: olderValue(current[k] || '', total - v + 1) };
  }
  // Đếm trường thay đổi so với phiên bản liền trước (bỏ qua cột không có trong cấu trúc)
  rows.forEach((r, i) => {
    const prev = rows[i + 1];
    if (!prev) return;
    r.changedCount = keys.filter((k) => r.values[k] !== null && prev.values[k] !== null && r.values[k] !== prev.values[k]).length;
  });
  return rows;
}

/** Giá trị ở phiên bản gần nhất trước đó có cột này (để tô ô thay đổi) */
const previousValue = (rows: VersionRow[], index: number, key: string): Cell | undefined => {
  for (let j = index + 1; j < rows.length; j++) {
    if (rows[j].values[key] !== null) return rows[j].values[key];
  }
  return undefined;
};

export function CivilRegistryVersionHistoryModal({ record, columns, onClose }: {
  record: CivilRegistryRecord;
  columns: ColumnDef<CivilRegistryRecord>[];
  onClose: () => void;
}) {
  const rows = useMemo(() => buildVersions(record, columns), [record, columns]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageRows = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="version-history-title"
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[1400px] max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-start justify-between gap-4 flex-shrink-0">
          <div className="min-w-0">
            <h3 id="version-history-title" className="text-[16px] font-medium text-[#020817]">Lịch sử phiên bản</h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#64748B]">
              <span>Mỗi dòng là một lần dữ liệu thay đổi, mới nhất ở trên cùng</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#FFFBEB] border-l-2 border-[#F59E0B]" aria-hidden="true" />
                Ô được tô: giá trị khác phiên bản gần nhất trước đó có cột này — di chuột để xem giá trị cũ
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm border-2 border-[#DC2626]" aria-hidden="true" />
                Viền đỏ: dòng đã bị xóa ở nguồn sau phiên bản này
              </span>
              <span>—: cột không có trong cấu trúc ở phiên bản đó</span>
            </div>
          </div>
          <button onClick={onClose} aria-label="Đóng" title="Đóng" className={BTN_GHOST_ICON}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bảng phiên bản */}
        <div className="flex-1 min-h-0 px-6 py-4 flex flex-col">
          <div className="flex-1 min-h-0 flex flex-col border border-[#E2E8F0] rounded-lg overflow-hidden">
            <div className="flex-1 min-h-0 overflow-auto custom-scrollbar">
              <table className="w-full border-separate border-spacing-0 text-[13px]">
                <thead className="sticky top-0 z-[2]">
                  <tr className="h-[42px]">
                    <th className={`${TH} ${STICKY_1}`}>Phiên bản</th>
                    <th className={`${TH} ${STICKY_2}`}>Thời điểm lưu vào kho</th>
                    {columns.map((c) => <th key={c.key} className={TH}>{c.label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((r) => {
                    const index = rows.indexOf(r);
                    const deleted = !!r.deletedAt;
                    const rowBg = deleted ? 'bg-[#FEF2F2]' : 'bg-white';
                    // Viền đỏ quanh dòng đã xóa: kẻ trên/dưới mọi ô + trái ô đầu + phải ô cuối
                    const edge = deleted ? 'border-y border-[#DC2626]' : 'border-b border-[#E0E0E0]';
                    return (
                      <tr key={r.version} className="min-h-12">
                        <td className={`${TD} ${STICKY_1} ${rowBg} ${edge} ${deleted ? 'border-l border-l-[#DC2626]' : ''} whitespace-normal`}>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#020817]">v{r.version}</span>
                            {index === 0 && <Badge label="Mới nhất" variant="blue" />}
                          </div>
                          <div className="mt-0.5 text-[12px] text-[#64748B]">
                            {r.version === 1 ? 'Bản đầu tiên' : `${r.changedCount} trường thay đổi`}
                          </div>
                          {deleted && (
                            <div className="mt-1 flex items-center gap-1.5 text-[12px] text-[#B91C1C]">
                              <Badge label="Đã xóa" variant="red" />
                              {r.deletedAt}
                            </div>
                          )}
                          {r.structureNote && (
                            <div className="mt-0.5 text-[12px] text-[#B45309] truncate max-w-[196px]" title={`Cấu trúc đổi: ${r.structureNote}`}>
                              Cấu trúc đổi: {r.structureNote}
                            </div>
                          )}
                        </td>
                        <td className={`${TD} ${STICKY_2} ${rowBg} ${edge} text-[#64748B]`}>{r.savedAt}</td>
                        {columns.map((c, ci) => {
                          const val = r.values[c.key];
                          const last = ci === columns.length - 1 ? (deleted ? 'border-r border-r-[#DC2626]' : '') : '';
                          if (val === null) {
                            return <td key={c.key} className={`${TD} ${rowBg} ${edge} ${last} text-[#94A3B8]`} aria-label="Cột không có trong cấu trúc">—</td>;
                          }
                          const prev = previousValue(rows, index, c.key);
                          const changed = prev !== undefined && prev !== val;
                          const text = val === '' ? '-' : val;
                          const wide = c.wide ? 'max-w-[280px] truncate' : '';
                          if (!changed) {
                            return <td key={c.key} className={`${TD} ${rowBg} ${edge} ${last}`}><div className={wide}>{text}</div></td>;
                          }
                          return (
                            <td key={c.key} className={`${TD} ${edge} ${last} bg-[#FFFBEB] shadow-[inset_2px_0_0_#F59E0B]`}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div tabIndex={0} className={`font-medium text-[#020817] cursor-help outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded ${wide}`}>{text}</div>
                                </TooltipTrigger>
                                <TooltipContent side="top" sideOffset={4} className={TOOLTIP_CLS}>Giá trị cũ: {prev === '' ? '-' : prev}</TooltipContent>
                              </Tooltip>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination
              className="border-t border-[#E2E8F0]"
              currentPage={page}
              totalItems={rows.length}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(n: number) => { setPageSize(n); setPage(1); }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end flex-shrink-0">
          <button onClick={onClose} className={BTN_OUTLINE}>Đóng</button>
        </div>
      </div>
    </div>
  );
}
