import { useState } from 'react';
import { toast } from 'sonner';
import { Filter, RefreshCw, Plus, Trash2, CheckCircle, X, Search, ChevronLeft, ChevronRight, Download, FileCode, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { mockTableData } from './mockTargetDatabases';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../../ui/dropdown-menu';
import {
  Pagination, normalizeSearch, filterBtnClass, INPUT_CLS, BTN_PRIMARY, BTN_OUTLINE, ROW_ICON_BTN, TOOLTIP_CLS,
} from '../collection/collectionUi';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../ui/tooltip';
import { AddGroupButton, FilterGroupRow, isFilterGroup, newFilterGroup, type FilterGroupItem } from '../../common/AdvancedFilterGroup';

// Tab "Dữ liệu sau xử lý" (Xử lý dữ liệu) — bảng dữ liệu trong CSDL đích sau khi chạy xử lý (cùng nguồn mockTableData với
// màn Xem chi tiết CSDL đích). Thanh công cụ giống màn xem dữ liệu thu thập (PM 14/10/2026): nút [Tải lại] + [Bộ lọc];
// Bộ lọc nâng cao có Thêm điều kiện / Gom Nhóm; [Áp dụng bộ lọc] lọc thật trên dữ liệu mẫu.
const OUTPUT_TABLE = 'DIP_PERSON';

// Chia 2 tab con: Dữ liệu hợp lệ (bản ghi đã ghi vào CSDL đích) / Dữ liệu không hợp lệ (bản ghi bị loại sau khi chạy quy tắc,
// kèm tên quy tắc gây loại bỏ). Tên quy tắc lấy theo các quy tắc ở tab Làm sạch / Chuẩn hóa / Biến đổi.
type DataView = 'valid' | 'rejected';
const RULE_COL = 'Quy tắc loại bỏ';
// Trường dữ liệu được cấu hình trong từng quy tắc (mẫu). Bảng Dữ liệu không hợp lệ chỉ hiển thị các trường có trong ít nhất
// một quy tắc ở bước Làm sạch / Chuẩn hóa / Biến đổi.
const RULE_CONFIG_FIELDS: Record<string, string[]> = {
  'Kiểm tra quy tắc về chuẩn định dạng': ['SoDDCN', 'HoTen', 'GioiTinh'],
  'Kiểm tra tính hợp lệ của dữ liệu': ['NgaySinh', 'GioiTinh'],
  'Xử lý, thay thế giá trị, thiếu dữ liệu': ['SoDDCN'],
  'Kiểm tra đối sánh tồn tại dựa trên trường khóa': ['SoDDCN'],
  'Xử lý vi phạm về ràng buộc thuộc tính tham chiếu': ['MaTinh'],
  'Biến đổi định dạng dữ liệu': ['NgaySinh'],
};
const CONFIGURED_FIELDS = new Set(Object.values(RULE_CONFIG_FIELDS).flat());
// Trường vi phạm của từng bản ghi không hợp lệ (theo MaCongDan, dữ liệu mẫu): bảng hiện đủ giá trị mọi cột,
// chỉ bôi đỏ các trường này.
const ERROR_FIELDS: Record<number, string[]> = {
  12: ['SoDDCN'], 17: ['SoDDCN'], 18: ['HoTen'], 19: ['SoDDCN'], 20: ['HoTen', 'GioiTinh'], 21: ['SoDDCN'], 22: ['SoDDCN'],
  13: ['NgaySinh'], 23: ['NgaySinh'], 24: ['GioiTinh'],
  14: ['SoDDCN'],
  8: ['SoDDCN'], 25: ['SoDDCN'], 26: ['SoDDCN'],
  15: ['MaTinh'],
  16: ['NgaySinh'],
};
const isErrorField = (row: Record<string, any>, f: string) => (ERROR_FIELDS[row.MaCongDan] || []).includes(f);
// Mã định danh (khóa chính) của bản ghi — luôn hiển thị giá trị, là cột đầu tiên của bảng Dữ liệu không hợp lệ
const KEY_COL = 'MaCongDan';
const mockRejectedRows: Record<string, any>[] = [
  { MaCongDan: 12, SoDDCN: '89a10@', HoTen: 'Trần Văn Nam', NgaySinh: '1990-08-02 00:00:00.0', GioiTinh: 'Nam', DanToc: 'Kinh', TonGiao: 'Không', QuocTich: 'Việt Nam', NoiThuongTru: 'Hà Nội', MaTinh: 29,
    _group: 'Làm sạch', [RULE_COL]: 'Kiểm tra quy tắc về chuẩn định dạng' },
  // Nhiều bản ghi cùng bị loại bởi một quy tắc (Kiểm tra quy tắc về chuẩn định dạng)
  { MaCongDan: 17, SoDDCN: '0123-456', HoTen: 'Vũ Thị Mai', NgaySinh: '1994-03-15 00:00:00.0', GioiTinh: 'Nữ', DanToc: 'Kinh', TonGiao: 'Không', QuocTich: 'Việt Nam', NoiThuongTru: 'Nghệ An', MaTinh: 37,
    _group: 'Làm sạch', [RULE_COL]: 'Kiểm tra quy tắc về chuẩn định dạng' },
  { MaCongDan: 18, SoDDCN: '234567', HoTen: 'Ngô Văn #Hùng', NgaySinh: '1987-09-21 00:00:00.0', GioiTinh: 'Nam', DanToc: 'Kinh', TonGiao: 'Phật giáo', QuocTich: 'Việt Nam', NoiThuongTru: 'Thanh Hóa', MaTinh: 36,
    _group: 'Làm sạch', [RULE_COL]: 'Kiểm tra quy tắc về chuẩn định dạng' },
  { MaCongDan: 19, SoDDCN: '345 678', HoTen: 'Bùi Quang Huy', NgaySinh: '2001-12-05 00:00:00.0', GioiTinh: 'Nam', DanToc: 'Tày', TonGiao: 'Không', QuocTich: 'Việt Nam', NoiThuongTru: 'Cao Bằng', MaTinh: 11,
    _group: 'Làm sạch', [RULE_COL]: 'Kiểm tra quy tắc về chuẩn định dạng' },
  { MaCongDan: 20, SoDDCN: '456789', HoTen: 'đinh thị lan', NgaySinh: '1999-07-30 00:00:00.0', GioiTinh: 'nu', DanToc: 'Kinh', TonGiao: 'Không', QuocTich: 'Việt Nam', NoiThuongTru: 'Bắc Ninh', MaTinh: 99,
    _group: 'Làm sạch', [RULE_COL]: 'Kiểm tra quy tắc về chuẩn định dạng' },
  { MaCongDan: 21, SoDDCN: '5678901234567', HoTen: 'Trịnh Văn Tú', NgaySinh: '1985-02-14 00:00:00.0', GioiTinh: 'Nam', DanToc: 'Mường', TonGiao: 'Không', QuocTich: 'Việt Nam', NoiThuongTru: 'Hòa Bình', MaTinh: 17,
    _group: 'Làm sạch', [RULE_COL]: 'Kiểm tra quy tắc về chuẩn định dạng' },
  { MaCongDan: 22, SoDDCN: 'ABC123', HoTen: 'Lý Thị Ngọc', NgaySinh: '1998-10-10 00:00:00.0', GioiTinh: 'Nữ', DanToc: 'Kinh', TonGiao: 'Công giáo', QuocTich: 'Việt Nam', NoiThuongTru: 'Ninh Bình', MaTinh: 35,
    _group: 'Làm sạch', [RULE_COL]: 'Kiểm tra quy tắc về chuẩn định dạng' },
  { MaCongDan: 13, SoDDCN: '123456', HoTen: 'Lê Thị Hoa', NgaySinh: '2030-02-30 00:00:00.0', GioiTinh: 'Nữ', DanToc: 'Kinh', TonGiao: 'Không', QuocTich: 'Việt Nam', NoiThuongTru: 'Huế', MaTinh: 46,
    _group: 'Làm sạch', [RULE_COL]: 'Kiểm tra tính hợp lệ của dữ liệu' },
  { MaCongDan: 23, SoDDCN: '678012', HoTen: 'Mai Văn Khoa', NgaySinh: '1890-01-01 00:00:00.0', GioiTinh: 'Nam', DanToc: 'Kinh', TonGiao: 'Không', QuocTich: 'Việt Nam', NoiThuongTru: 'Quảng Ninh', MaTinh: 22,
    _group: 'Làm sạch', [RULE_COL]: 'Kiểm tra tính hợp lệ của dữ liệu' },
  { MaCongDan: 24, SoDDCN: '789123', HoTen: 'Tạ Thị Hằng', NgaySinh: '1996-06-06 00:00:00.0', GioiTinh: 'Khác', DanToc: 'Kinh', TonGiao: 'Không', QuocTich: 'Việt Nam', NoiThuongTru: 'Thái Nguyên', MaTinh: 19,
    _group: 'Làm sạch', [RULE_COL]: 'Kiểm tra tính hợp lệ của dữ liệu' },
  { MaCongDan: 14, SoDDCN: '', HoTen: 'Phạm Minh Đức', NgaySinh: '1988-11-11 00:00:00.0', GioiTinh: 'Nam', DanToc: 'Kinh', TonGiao: 'Không', QuocTich: 'Việt Nam', NoiThuongTru: 'Đà Nẵng', MaTinh: 43,
    _group: 'Làm sạch', [RULE_COL]: 'Xử lý, thay thế giá trị, thiếu dữ liệu' },
  { MaCongDan: 8, SoDDCN: '567898', HoTen: 'Nguyễn Đình Bắc', NgaySinh: '2003-01-01 00:00:00.0', GioiTinh: 'Nam', DanToc: 'Kinh', TonGiao: 'Không', QuocTich: 'Việt Nam', NoiThuongTru: 'Hà Nội', MaTinh: 29,
    _group: 'Chuẩn hóa', [RULE_COL]: 'Kiểm tra đối sánh tồn tại dựa trên trường khóa' },
  { MaCongDan: 25, SoDDCN: '891734', HoTen: 'Nguyễn Văn Vĩ', NgaySinh: '1997-06-18 00:00:00.0', GioiTinh: 'Nam', DanToc: 'Kinh', TonGiao: 'Không', QuocTich: 'Việt Nam', NoiThuongTru: 'Nam Định', MaTinh: 18,
    _group: 'Chuẩn hóa', [RULE_COL]: 'Kiểm tra đối sánh tồn tại dựa trên trường khóa' },
  { MaCongDan: 26, SoDDCN: '678899', HoTen: 'Nguyễn Văn Toàn', NgaySinh: '1996-04-12 00:00:00.0', GioiTinh: 'Nam', DanToc: 'Kinh', TonGiao: 'Không', QuocTich: 'Việt Nam', NoiThuongTru: 'Hải Dương', MaTinh: 34,
    _group: 'Chuẩn hóa', [RULE_COL]: 'Kiểm tra đối sánh tồn tại dựa trên trường khóa' },
  { MaCongDan: 15, SoDDCN: '345612', HoTen: 'Hoàng Văn Lâm', NgaySinh: '1992-05-09 00:00:00.0', GioiTinh: 'Nam', DanToc: 'Kinh', TonGiao: 'Không', QuocTich: 'Việt Nam', NoiThuongTru: 'Không rõ', MaTinh: 99,
    _group: 'Chuẩn hóa', [RULE_COL]: 'Xử lý vi phạm về ràng buộc thuộc tính tham chiếu' },
  { MaCongDan: 16, SoDDCN: '456723', HoTen: 'Đỗ Thu Trang', NgaySinh: '18/13/1999', GioiTinh: 'Nữ', DanToc: 'Kinh', TonGiao: 'Không', QuocTich: 'Việt Nam', NoiThuongTru: 'Hải Phòng', MaTinh: 31,
    _group: 'Biến đổi', [RULE_COL]: 'Biến đổi định dạng dữ liệu' },
];

// Tải xuống bản ghi không hợp lệ: Mã định danh + các trường dữ liệu; giữ đúng thứ tự trường, chỉ lấy các trường
// người dùng chọn ở popup "Chọn trường tải xuống"
const toExportRows = (rows: Record<string, any>[], fields: string[]) =>
  rows.map(r => Object.fromEntries(fields.map(f => [f, r[f] ?? ''])));
const escapeXml = (v: unknown) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
const buildXml = (rows: Record<string, any>[]) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<DuLieuKhongHopLe bang="${OUTPUT_TABLE}" soBanGhi="${rows.length}">\n` +
  rows.map(r => `  <BanGhi>\n${Object.entries(r).map(([k, v]) => `    <${k}>${escapeXml(v)}</${k}>`).join('\n')}\n  </BanGhi>`).join('\n') +
  `\n</DuLieuKhongHopLe>\n`;
const downloadBlob = (content: string, type: string, fileName: string) => {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url; a.download = fileName; a.click();
  URL.revokeObjectURL(url);
};


interface FilterCondition { id: string; logic: 'AND' | 'OR'; field: string; operator: string; value: string }
type FilterItem = FilterCondition | FilterGroupItem;

// Nút icon 40×40 nền trắng (mục 5.1 – Icon outline), giống bộ lọc màn xem dữ liệu thu thập
const ICON_OUTLINE_40 = 'w-10 h-10 shrink-0 rounded-lg border bg-white border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#020817] transition-colors flex items-center justify-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-600';

const matchCond = (row: Record<string, any>, c: { field: string; operator: string; value: string }) => {
  if (!c.field || !c.value.trim()) return true;
  const a = normalizeSearch(String(row[c.field] ?? '')), b = normalizeSearch(c.value);
  if (c.operator === 'contains') return a.includes(b);
  if (c.operator === 'starts') return a.startsWith(b);
  return a === b;
};

// Nối lần lượt theo AND / OR; trong nhóm các điều kiện cũng nối theo AND / OR của từng điều kiện
const combine = <T extends { logic: 'AND' | 'OR' }>(items: T[], test: (x: T) => boolean) =>
  items.reduce<boolean | null>((acc, x, i) => {
    const ok = test(x);
    return i === 0 || acc === null ? ok : x.logic === 'OR' ? acc || ok : acc && ok;
  }, null) ?? true;

const applyFilters = (rows: Record<string, any>[], filters: FilterItem[]) =>
  rows.filter(row => combine(filters, f => (isFilterGroup(f) ? combine(f.conditions, c => matchCond(row, c)) : matchCond(row, f))));

// Cột "Danh sách trường" (Ẩn/Hiện cột): nút < thu gọn, nút > mở lại — dùng ở màn Xem chi tiết CSDL đích
export const ColumnPanelHeader = ({ onCollapse }: { onCollapse: () => void }) => (
  <div className="flex items-center justify-between gap-2 px-2 pb-2 mb-1 border-b border-slate-200">
    <span className="text-[13px] font-semibold text-[#020817]">Danh sách trường</span>
    <button
      type="button"
      onClick={onCollapse}
      title="Thu gọn danh sách trường"
      aria-label="Thu gọn danh sách trường"
      className="w-7 h-7 flex items-center justify-center rounded-md text-[#475569] hover:bg-[#F1F5F9] hover:text-[#020817] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
    >
      <ChevronLeft className="w-4 h-4" />
    </button>
  </div>
);

export const ColumnPanelExpandButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    title="Mở danh sách trường"
    aria-label="Mở danh sách trường"
    className="w-7 h-7 mr-3 shrink-0 flex items-center justify-center rounded-md border border-slate-200 bg-white text-[#475569] hover:bg-[#F1F5F9] hover:text-[#020817] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
  >
    <ChevronRight className="w-4 h-4" />
  </button>
);

export function ProcessedDataTab() {
  const validRows = mockTableData[OUTPUT_TABLE] || [];
  const [view, setView] = useState<DataView>('valid');
  const rows = view === 'valid' ? validRows : mockRejectedRows;
  const dataColumns = validRows.length > 0 ? Object.keys(validRows[0]) : [];
  // Cột Dữ liệu không hợp lệ: Mã định danh (khóa chính) + các trường có cấu hình trong quy tắc (giữ thứ tự bảng đích)
  const ruleFields = dataColumns.filter(c => c !== KEY_COL && CONFIGURED_FIELDS.has(c));
  const isRejected = view === 'rejected';
  const columns = isRejected ? [KEY_COL, ...ruleFields] : dataColumns;
  // Bộ lọc nâng cao lọc theo các cột đang hiển thị
  const fieldOptions = columns.map(c => ({ value: c, label: c }));

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterConditions, setFilterConditions] = useState<FilterItem[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<FilterItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const updateCondition = (index: number, patch: Partial<FilterCondition>) =>
    setFilterConditions(prev => prev.map((c, i) => (i === index ? { ...c, ...patch } as FilterItem : c)));

  const result = applyFilters(rows, appliedFilters);
  const paged = result.slice((page - 1) * pageSize, page * pageSize);

  const reload = () => { setFilterConditions([]); setAppliedFilters([]); setPage(1); toast.success('Cập nhật dữ liệu thành công'); };
  const switchView = (v: DataView) => { if (v === view) return; setView(v); setFilterConditions([]); setAppliedFilters([]); setPage(1); };

  // Popup chọn trường tải xuống: mở sau khi chọn định dạng; mặc định tick tất cả trường.
  // Tải toàn bộ bản ghi loại bỏ (theo bộ lọc đang áp dụng) — không chọn từng bản ghi.
  const exportFieldList = [KEY_COL, ...ruleFields];
  const [exportFormat, setExportFormat] = useState<'xml' | 'excel' | null>(null);
  const [exportFields, setExportFields] = useState<Set<string>>(new Set());
  const openExport = (format: 'xml' | 'excel') => {
    if (result.length === 0) { toast.error('Không có bản ghi để tải xuống'); return; }
    setExportFields(new Set(exportFieldList));
    setExportFormat(format);
  };
  const toggleExportField = (f: string) => setExportFields(prev => { const n = new Set(prev); n.has(f) ? n.delete(f) : n.add(f); return n; });
  const allFieldsChecked = exportFields.size === exportFieldList.length;

  const exportSelected = (format: 'xml' | 'excel') => {
    const picked = result;
    if (picked.length === 0) { toast.error('Không có bản ghi để tải xuống'); return; }
    const fields = exportFieldList.filter(f => exportFields.has(f));
    if (fields.length === 0) { toast.error('Vui lòng chọn ít nhất 1 trường để tải xuống'); return; }
    const data = toExportRows(picked, fields);
    const stamp = new Date().toISOString().slice(0, 10);
    if (format === 'xml') {
      downloadBlob(buildXml(data), 'application/xml;charset=utf-8', `du_lieu_khong_hop_le_${OUTPUT_TABLE}_${stamp}.xml`);
    } else {
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), 'Du lieu khong hop le');
      XLSX.writeFile(wb, `du_lieu_khong_hop_le_${OUTPUT_TABLE}_${stamp}.xlsx`);
    }
    toast.success(`Đã tải xuống ${picked.length} bản ghi (${format === 'xml' ? 'XML' : 'Excel'})`);
    setExportFormat(null);
  };

  const renderCell = (row: Record<string, any>, c: string) => {
    // Dữ liệu không hợp lệ: hiện đủ giá trị mọi cột, chỉ bôi đỏ trường bị lỗi của dòng đó
    if (isRejected && isErrorField(row, c)) {
      const v = String(row[c] ?? '');
      return v ? <span className="text-red-600 font-medium">{v}</span> : <span className="text-red-600 italic">(trống)</span>;
    }
    return String(row[c] ?? '');
  };

  const subTabs: { key: DataView; label: string; count: number }[] = [
    { key: 'valid', label: 'Dữ liệu hợp lệ', count: validRows.length },
    { key: 'rejected', label: 'Dữ liệu không hợp lệ', count: mockRejectedRows.length },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Thanh công cụ: tab con [Dữ liệu hợp lệ | Dữ liệu không hợp lệ] bên trái — [Tải lại] [Bộ lọc] bên phải */}
      <div className="flex items-center justify-between gap-3">
        <div role="tablist" aria-label="Loại dữ liệu sau xử lý" className="inline-flex p-1 bg-slate-100 rounded-lg">
          {subTabs.map(t => {
            const active = view === t.key;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => switchView(t.key)}
                className={`inline-flex items-center gap-2 h-8 px-3 rounded-md text-[13px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${active ? 'bg-white text-[#020817] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {t.label}
                <span className={`inline-flex min-w-[20px] justify-center px-1.5 rounded-full text-[12px] ${active ? (t.key === 'valid' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700') : 'bg-slate-200 text-slate-600'}`}>{t.count}</span>
              </button>
            );
          })}
        </div>
      <div className="flex items-center justify-end gap-1.5">
        {/* Dữ liệu không hợp lệ: tải xuống toàn bộ bản ghi (theo bộ lọc) theo XML / Excel */}
        {isRejected && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" disabled={result.length === 0} className={BTN_OUTLINE}>
                <Download className="w-4 h-4" />
                Tải xuống
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-lg border border-[#E2E8F0] bg-white shadow-lg p-1">
              <DropdownMenuItem onSelect={() => openExport('xml')} className="flex items-center gap-2 px-3 py-2 rounded-md text-[13px] text-[#020817] cursor-pointer hover:bg-slate-50">
                <FileCode className="w-4 h-4 text-slate-500" /> Định dạng XML
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => openExport('excel')} className="flex items-center gap-2 px-3 py-2 rounded-md text-[13px] text-[#020817] cursor-pointer hover:bg-slate-50">
                <FileSpreadsheet className="w-4 h-4 text-green-600" /> Định dạng Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" onClick={reload} aria-label="Cập nhật dữ liệu" className={ICON_OUTLINE_40}>
              <RefreshCw className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={4} className={TOOLTIP_CLS}>Cập nhật dữ liệu</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              aria-label="Bộ lọc nâng cao"
              aria-expanded={isFilterOpen}
              className={filterBtnClass(isFilterOpen)}
            >
              {isFilterOpen ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={4} className={TOOLTIP_CLS}>Bộ lọc nâng cao</TooltipContent>
        </Tooltip>
      </div>
      </div>

      {/* Vùng lọc nâng cao: khung xám, cách thanh công cụ 15px (mục 5.19) */}
      {isFilterOpen && (
        <div className="mt-[15px] p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[14px] font-medium text-[#020817]">Điều kiện lọc nâng cao</h4>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterConditions([...filterConditions, { id: Date.now().toString(), logic: 'AND', field: '', operator: '=', value: '' }])}
                className={BTN_OUTLINE}
              >
                <Plus className="w-4 h-4" />
                Thêm điều kiện
              </button>
              <AddGroupButton className={BTN_OUTLINE} onClick={() => setFilterConditions([...filterConditions, newFilterGroup()])} />
            </div>
          </div>

          {filterConditions.length === 0 && (
            <p className="text-[13px] text-[#64748B]">Chưa có điều kiện lọc. Bấm "Thêm điều kiện" hoặc "Gom Nhóm" để bắt đầu.</p>
          )}

          <div className="space-y-2">
            {filterConditions.map((condition, index) => isFilterGroup(condition) ? (
              <FilterGroupRow
                key={condition.id}
                group={condition}
                showLogic={index > 0}
                fieldOptions={fieldOptions}
                onChange={(g) => setFilterConditions(filterConditions.map(c => (c.id === g.id ? g : c)))}
                onRemove={() => setFilterConditions(filterConditions.filter(c => c.id !== condition.id))}
              />
            ) : (
              <div key={condition.id} className="flex items-center gap-2">
                <div className="w-24 flex-shrink-0">
                  {index > 0 && (
                    <select aria-label="Toán tử logic" className={INPUT_CLS} value={condition.logic} onChange={(e) => updateCondition(index, { logic: e.target.value as 'AND' | 'OR' })}>
                      <option value="AND">AND</option>
                      <option value="OR">OR</option>
                    </select>
                  )}
                </div>
                <select aria-label="Trường dữ liệu" className={`${INPUT_CLS} !w-auto flex-1`} value={condition.field} onChange={(e) => updateCondition(index, { field: e.target.value })}>
                  <option value="" disabled hidden>-- Chọn trường dữ liệu --</option>
                  {fieldOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <select aria-label="Phép so sánh" className={`${INPUT_CLS} !w-auto flex-1`} value={condition.operator} onChange={(e) => updateCondition(index, { operator: e.target.value })}>
                  <option value="=">Bằng (=)</option>
                  <option value="contains">Chứa</option>
                  <option value="starts">Bắt đầu</option>
                </select>
                <input
                  aria-label="Giá trị"
                  type="text"
                  className={`${INPUT_CLS} !w-auto flex-1`}
                  placeholder="Nhập giá trị..."
                  value={condition.value}
                  onChange={(e) => updateCondition(index, { value: e.target.value })}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label="Xóa điều kiện"
                      onClick={() => setFilterConditions(filterConditions.filter(c => c.id !== condition.id))}
                      className={`${ROW_ICON_BTN} hover:!text-[#DC2626]`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={4} className={TOOLTIP_CLS}>Xóa điều kiện</TooltipContent>
                </Tooltip>
              </div>
            ))}
          </div>

          {filterConditions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[#E2E8F0] flex items-center gap-3">
              <button type="button" onClick={() => { setAppliedFilters(filterConditions); setPage(1); }} className={BTN_PRIMARY}>
                <CheckCircle className="w-4 h-4" />
                Áp dụng bộ lọc
              </button>
              <button type="button" onClick={() => { setFilterConditions([]); setAppliedFilters([]); setPage(1); }} className={BTN_OUTLINE}>
                Xóa tất cả
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bảng dữ liệu */}
      {/* Bảng cao theo nội dung, co lại khi thiếu chỗ → chỉ bảng cuộn dọc (tiêu đề cột dính trên) */}
      <div className="mt-4 flex-initial min-h-0 rounded-xl border border-slate-200 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="bg-slate-50 sticky top-0 z-10 shadow-[inset_0_-1px_0_#e2e8f0]">
            <tr>
              {columns.length > 0
                ? columns.map(key => (
                  <th key={key} className="py-3 px-4 text-[13px] font-bold text-black whitespace-nowrap">
                    {key}
                  </th>
                ))
                : <th className="py-3 px-4 text-[13px] font-bold text-black whitespace-nowrap text-center">Dữ liệu</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paged.length > 0 ? paged.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-slate-50/50 transition-colors">
                {columns.map(c => <td key={c} className="py-3 px-4 text-[13px] text-slate-800">{renderCell(row, c)}</td>)}
              </tr>
            )) : (
              <tr>
                <td colSpan={100} className="py-12 text-center text-slate-500 text-[13px]">
                  <div className="flex flex-col items-center justify-center">
                    <Search className="w-8 h-8 text-slate-300 mb-2" />
                    <p>{rows.length === 0 ? (view === 'rejected' ? 'Không có bản ghi không hợp lệ' : 'Bảng chưa có dữ liệu') : 'Không tìm thấy dữ liệu phù hợp'}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {result.length > 0 && (
        <Pagination
          className="mt-3 shrink-0 border border-[#E2E8F0] rounded-lg"
          currentPage={page}
          totalItems={result.length}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(n: number) => { setPageSize(n); setPage(1); }}
        />
      )}

      {/* Popup chọn trường tải xuống (compomennt.md 5.4) */}
      {exportFormat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal="true" aria-labelledby="export-fields-title">
          {/* Chiều cao cố định; header, ô Chọn tất cả và footer cố định — chỉ danh sách trường cuộn dọc */}
          <div className="bg-white rounded-2xl shadow-2xl w-[560px] max-w-full h-[480px] max-h-[90vh] flex flex-col overflow-hidden">
            <div className="shrink-0 px-6 py-4 border-b border-[#E2E8F0] flex items-start justify-between gap-3">
              <div>
                <h3 id="export-fields-title" className="text-[16px] font-semibold text-[#020817]">Chọn trường tải xuống</h3>
                <p className="mt-0.5 text-[13px] text-[#64748B]">
                  {result.length} bản ghi không hợp lệ{appliedFilters.length > 0 ? ' (theo bộ lọc)' : ''} · Định dạng {exportFormat === 'xml' ? 'XML' : 'Excel'}
                </p>
              </div>
              <button type="button" onClick={() => setExportFormat(null)} aria-label="Đóng" className={ROW_ICON_BTN}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="shrink-0 px-6 pt-4">
              <label className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0] text-[13px] font-medium text-[#020817] cursor-pointer">
                <input
                  type="checkbox"
                  checked={allFieldsChecked}
                  ref={el => { if (el) el.indeterminate = !allFieldsChecked && exportFields.size > 0; }}
                  onChange={() => setExportFields(allFieldsChecked ? new Set() : new Set(exportFieldList))}
                  className="w-4 h-4 rounded border-slate-300 accent-blue-600 cursor-pointer"
                />
                Chọn tất cả ({exportFields.size}/{exportFieldList.length})
              </label>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-6 py-3">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                {exportFieldList.map(f => (
                  <label key={f} className="flex items-center gap-2 text-[13px] text-[#334155] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportFields.has(f)}
                      onChange={() => toggleExportField(f)}
                      className="w-4 h-4 rounded border-slate-300 accent-blue-600 cursor-pointer"
                    />
                    {f}
                  </label>
                ))}
              </div>
            </div>

            <div className="shrink-0 px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
              <button type="button" onClick={() => setExportFormat(null)} className={BTN_OUTLINE}>Hủy</button>
              <button type="button" disabled={exportFields.size === 0} onClick={() => exportSelected(exportFormat)} className={BTN_PRIMARY}>
                <Download className="w-4 h-4" />
                Tải xuống
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
