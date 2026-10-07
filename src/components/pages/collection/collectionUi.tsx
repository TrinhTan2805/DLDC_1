import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Columns3, Check, RotateCcw, GripVertical, ArrowUp, ArrowDown, Calendar } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../ui/tooltip';
import { Popover, PopoverTrigger, PopoverContent } from '../../ui/popover';

// --- Thành phần theo tailieu/docs/compomennt.md ---

// Tooltip chuẩn (mục 5.3.1): nền xám đậm, chữ trắng 12px/500, tối đa 480px
export const TOOLTIP_CLS = 'z-[300] max-w-[480px] bg-[#475569]/95 text-white text-[12px] font-medium px-3 py-2 rounded-lg text-left [&_svg]:!fill-[#475569] [&_svg]:!bg-[#475569]';

// Badge (mục 5.8): 13px/400, padding 2×8, viền 1px, bo 16px, cao 26px
const BADGE_TONES: Record<string, string> = {
  // Loại nguồn
  'Trong ngành': 'text-[#8200DB] bg-[#FAF5FF] border-[#E7E1EC]',
  'Ngoài ngành': 'text-[#2563EB] bg-[#EFF6FF] border-[#BFDBFE]',
  // Phương thức kết nối
  'Cơ Sở Dữ Liệu': 'text-[#4338CA] bg-[#EEF2FF] border-[#E0E7FF]',
  'File': 'text-[#475569] bg-[#F8FAFC] border-[#E2E8F0]',
  'API': 'text-[#047857] bg-[#ECFDF5] border-[#D1FAE5]',
  'API nhận (JSON)': 'text-[#C2410C] bg-[#FFF7ED] border-[#FED7AA]',
  'API nhận (XML)': 'text-[#C2410C] bg-[#FFF7ED] border-[#FED7AA]',
  // Trạng thái dịch vụ
  'Hoạt động': 'text-[#15803D] bg-[#F0FDF4] border-[#DCFCE7]',
  'Bản nháp': 'text-[#64748B] bg-[#F8FAFC] border-[#E2E8F0]',
  'Ngưng hoạt động': 'text-[#64748B] bg-[#F8FAFC] border-[#E2E8F0]',
  // Trạng thái dữ liệu
  'Rỗng': 'text-[#64748B] bg-[#F8FAFC] border-[#E2E8F0]',
  'Lỗi cập nhật': 'text-[#B91C1C] bg-[#FEF2F2] border-[#FEE2E2]',
  'Cập nhật thành công': 'text-[#047857] bg-[#ECFDF5] border-[#D1FAE5]',
  'Đang xử lý': 'text-[#D97706] bg-white border-[#F6B657]',
};

// Tông màu theo variant (thay thế StatusTag) cho nhãn chưa có trong BADGE_TONES
const VARIANT_TONES: Record<string, string> = {
  blue: 'text-[#2563EB] bg-[#EFF6FF] border-[#BFDBFE]',
  purple: 'text-[#8200DB] bg-[#FAF5FF] border-[#E7E1EC]',
  indigo: 'text-[#4338CA] bg-[#EEF2FF] border-[#E0E7FF]',
  emerald: 'text-[#047857] bg-[#ECFDF5] border-[#D1FAE5]',
  green: 'text-[#15803D] bg-[#F0FDF4] border-[#DCFCE7]',
  amber: 'text-[#D97706] bg-white border-[#F6B657]',
  orange: 'text-[#C2410C] bg-[#FFF7ED] border-[#FED7AA]',
  red: 'text-[#B91C1C] bg-[#FEF2F2] border-[#FEE2E2]',
  slate: 'text-[#64748B] bg-[#F8FAFC] border-[#E2E8F0]',
  gray: 'text-[#64748B] bg-[#F8FAFC] border-[#E2E8F0]',
};

export const Badge = ({ label, variant, icon }: { label: string; variant?: string; icon?: ReactNode }) => (
  <span className={`inline-flex items-center gap-1 h-[26px] px-2 py-0.5 rounded-2xl border text-[13px] font-normal whitespace-nowrap ${BADGE_TONES[label] || (variant && VARIANT_TONES[variant]) || VARIANT_TONES.slate}`}>
    {icon}
    {label}
  </span>
);

// Chữ dài: cắt 1 dòng, hover hiện tooltip đầy đủ — chỉ hiện khi chữ thực sự bị cắt (mục 5.3.1)
export const TruncatedText = ({ text, className = '', extra }: { text: string; className?: string; extra?: ReactNode }) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [open, setOpen] = useState(false);
  return (
    <Tooltip
      open={open}
      onOpenChange={(next: boolean) => {
        const el = ref.current;
        setOpen(next && !!el && (el.scrollWidth > el.clientWidth || !!extra));
      }}
    >
      <TooltipTrigger asChild>
        <span ref={ref} className={`block truncate ${className}`}>{text}</span>
      </TooltipTrigger>
      <TooltipContent side="top" align="start" sideOffset={4} className={TOOLTIP_CLS}>
        <div>{text}</div>
        {extra && <div className="mt-1 font-normal opacity-90">{extra}</div>}
      </TooltipContent>
    </Tooltip>
  );
};

// Trạng thái nút (mục 5.1): vô hiệu = nền #F1F5F9 + chữ #94A3B8, không dùng opacity
export const BTN_FOCUS = 'cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1';
export const BTN_DISABLED = 'disabled:bg-[#F1F5F9] disabled:bg-none disabled:border-[#E2E8F0] disabled:text-[#94A3B8] disabled:shadow-none disabled:cursor-not-allowed';
export const BTN_PRIMARY = `h-10 px-4 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white text-[13px] font-medium hover:bg-blue-700 transition-colors ${BTN_FOCUS} ${BTN_DISABLED}`;
export const BTN_OUTLINE = `h-10 px-4 inline-flex items-center justify-center gap-2 rounded-lg border border-[#CBD5E1] bg-white text-[#334155] text-[13px] font-medium hover:bg-[#F8FAFC] hover:border-[#94A3B8] hover:text-[#020817] transition-colors ${BTN_FOCUS} ${BTN_DISABLED}`;
export const BTN_PAGE = `h-8 min-w-8 px-3 inline-flex items-center justify-center rounded-lg border text-[13px] font-medium transition-colors ${BTN_FOCUS} ${BTN_DISABLED}`;
export const BTN_PAGE_IDLE = 'border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F8FAFC] hover:border-[#94A3B8] hover:text-[#020817]';
export const BTN_GHOST_ICON = `p-1.5 rounded-lg text-[#475569] hover:bg-[#F1F5F9] hover:text-[#020817] transition-colors ${BTN_FOCUS}`;

// Nút icon trong cột thao tác (mục 5.3.2): 32×32, icon 16px #475569, tooltip bắt buộc
export const ROW_ICON_BTN = `w-8 h-8 inline-flex items-center justify-center rounded-lg text-[#475569] hover:bg-[#F1F5F9] hover:text-blue-600 data-[state=open]:bg-[#EAF3FF] data-[state=open]:text-blue-600 transition-colors ${BTN_FOCUS} disabled:text-[#CBD5E1] disabled:bg-transparent disabled:cursor-not-allowed`;
export const MENU_ITEM = 'min-h-8 px-3 py-1.5 gap-2 text-[13px] cursor-pointer focus:bg-[#F1F5F9] data-[disabled]:opacity-100 data-[disabled]:text-[#94A3B8] data-[disabled]:cursor-not-allowed';

// Nút bị vô hiệu giữ nguyên vị trí, tooltip ghi lý do (bọc span vì nút disabled không nhận sự kiện hover)
export const RowIconAction = ({ label, onClick, children, disabledReason }: { label: string; onClick: () => void; children: ReactNode; disabledReason?: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      {disabledReason ? (
        <span tabIndex={0} className="inline-flex rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
          <button type="button" aria-label={label} className={`${ROW_ICON_BTN} pointer-events-none`} disabled>
            {children}
          </button>
        </span>
      ) : (
        <button type="button" aria-label={label} className={ROW_ICON_BTN} onClick={onClick}>
          {children}
        </button>
      )}
    </TooltipTrigger>
    <TooltipContent side="top" sideOffset={4} className={TOOLTIP_CLS}>
      <div>{label}</div>
      {disabledReason && <div className="mt-0.5 font-normal opacity-90">{disabledReason}</div>}
    </TooltipContent>
  </Tooltip>
);

export const BTN_DESTRUCTIVE = `h-10 px-4 inline-flex items-center justify-center gap-2 rounded-lg bg-[#DC2626] text-white text-[13px] font-medium hover:bg-[#B91C1C] transition-colors ${BTN_FOCUS} ${BTN_DISABLED}`;

// Tab nội dung (mục 5.9): cao 48px, padding 12×16, 14px/600; đang chọn #155DFC gạch dưới 2px, thường #64748B
export const tabClass = (active: boolean) =>
  `h-12 px-4 py-3 inline-flex items-center gap-2 text-[14px] font-semibold border-b-2 transition-colors cursor-pointer ${active ? 'border-blue-600 text-blue-600' : 'border-transparent text-[#64748B] hover:text-[#020817]'}`;

// Ô nhập (mục 5.2): cao 40px, padding ngang 12px, viền #E2E8F0, bo 8px
export const INPUT_CLS = 'w-full h-10 px-3 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-[#F1F5F9] disabled:text-[#94A3B8] disabled:cursor-not-allowed';
// Ô BỊ KHÓA (disabled) ở màn Xem chi tiết (PM chốt 07/10/2026 – module Cung cấp dữ liệu): giá trị đã nhập chữ ĐEN #000000,
// placeholder XÁM #94A3B8 13px/400, nền #F0F0F0 (như trang BTP), viền rgba(0,0,0,0.26). Không áp cho ô nhập bình thường. Ghép sau INPUT_CLS / textarea.
export const VIEW_FIELD_CLS = 'disabled:!text-[#000000] disabled:!bg-[#F0F0F0] disabled:!border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8] disabled:placeholder:font-normal';

// Nhãn trường — MỘT kiểu chung cho form Thêm mới/Chỉnh sửa và tên trường ở Xem chi tiết (mục 5.2, 5.17)
export const FIELD_LABEL = 'text-[13px] font-medium text-[#020817]';
export const LABEL_CLS = `block ${FIELD_LABEL} mb-1`;
// Giá trị trường ở Xem chi tiết: 13px/400 #020817
export const FIELD_VALUE = 'text-[13px] text-[#020817]';
export const REQUIRED_MARK = 'text-[#DC2626]';

// --- Tìm kiếm & Bộ lọc (mục 5.19) ---
// Ô tìm kiếm trong trang: cao 40px, đệm ngang 16px, không icon bên trong, không nút X
export const SEARCH_INPUT_CLS = 'w-full h-10 px-4 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600';
// Nút Tìm kiếm 40×40 nền #10B981; nút Bộ lọc 40×40 nền trắng viền #CBD5E1 icon #475569, đang mở nền #EAF3FF (PM chốt)
export const SEARCH_BTN_CLS = `w-10 h-10 shrink-0 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors flex items-center justify-center ${BTN_FOCUS} ${BTN_DISABLED}`;
export const filterBtnClass = (open: boolean) =>
  `w-10 h-10 shrink-0 rounded-lg border transition-colors flex items-center justify-center ${BTN_FOCUS} ${BTN_DISABLED} ${open ? 'bg-[#EAF3FF] border-[#BFDBFE] text-blue-600' : 'bg-white border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#020817]'}`;
// Vùng bộ lọc: khung xám (nền #F8FAFC, viền #E2E8F0, bo 8px, đệm 16px) cách thanh tìm kiếm 15px;
// ô lọc tối thiểu 193px, tự giãn đều lấp đủ chiều ngang (auto-fit), cao 40px nền trắng, khoảng cách 8px; nhãn 13px/600 #0E0D0D cao 20px, cách ô 2px
export const FILTER_GRID_CLS = 'mt-[15px] p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg grid grid-cols-[repeat(auto-fit,minmax(193px,1fr))] gap-2';
export const FILTER_LABEL = 'block text-[13px] font-semibold text-[#0E0D0D] leading-5 mb-0.5';
export const DATE_BOX_CLS = 'flex items-center gap-2 bg-white h-10 px-3 rounded-lg border border-[#E2E8F0] focus-within:ring-2 focus-within:ring-blue-600';

// --- Định dạng ngày dd/mm/yyyy (compomennt.md 5.3, 5.3.3, 5.10 — PM chốt 07/10/2026) ---
const pad2 = (n: number) => String(n).padStart(2, '0');

/** Chuỗi ISO 'yyyy-mm-dd' (giá trị của ô ngày) → 'dd/mm/yyyy' để hiển thị */
export const isoToDisplayDate = (iso: string): string => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '');
  return m ? `${m[3]}/${m[2]}/${m[1]}` : '';
};

/** 'dd/mm/yyyy' → ISO 'yyyy-mm-dd'; trả '' nếu ngày không hợp lệ */
export const displayToIsoDate = (text: string): string => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text.trim());
  if (!m) return '';
  const d = Number(m[1]), mo = Number(m[2]), y = Number(m[3]);
  const dt = new Date(y, mo - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d ? `${m[3]}-${m[2]}-${m[1]}` : '';
};

/** Date → ISO 'yyyy-mm-dd' theo giờ địa phương (toISOString dùng UTC nên lệch 1 ngày ở UTC+7) */
export const toLocalIsoDate = (date: Date): string =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

/** Định dạng Date → 'dd/mm/yyyy' (kèm ' HH:mm:ss' khi withTime) */
export const formatDateVN = (date: Date, withTime = false): string =>
  `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}` +
  (withTime ? ` ${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}` : '');

/**
 * Ô chọn ngày luôn hiển thị dd/mm/yyyy (không phụ thuộc ngôn ngữ trình duyệt như input type="date").
 * Giá trị vào/ra vẫn là ISO 'yyyy-mm-dd' nên thay thế trực tiếp cho input type="date" mà không đổi logic lọc.
 * Gõ tay (tự chèn "/") hoặc bấm icon lịch để mở bộ chọn ngày.
 */
export function DateInput({ value, onChange, ariaLabel = 'Chọn ngày', placeholder = 'dd/mm/yyyy', disabled, min, max, className = '' }: {
  value: string;
  onChange: (iso: string) => void;
  ariaLabel?: string;
  placeholder?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  className?: string;
}) {
  const [text, setText] = useState(isoToDisplayDate(value));
  const [invalid, setInvalid] = useState(false);
  const pickerRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => { setText(isoToDisplayDate(value)); setInvalid(false); }, [value]);

  const handleType = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 8);
    const masked = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join('/');
    setText(masked);
    setInvalid(false);
    if (!masked) onChange('');
    else if (digits.length === 8) {
      const iso = displayToIsoDate(masked);
      if (iso) onChange(iso); else setInvalid(true);
    }
  };
  const handleBlur = () => {
    if (text && !displayToIsoDate(text)) setInvalid(true);
  };
  const openPicker = () => {
    const el = pickerRef.current as (HTMLInputElement & { showPicker?: () => void }) | null;
    if (!el || disabled) return;
    try { el.showPicker?.(); } catch { el.focus(); }
  };

  return (
    <div className={`relative ${DATE_BOX_CLS} ${invalid ? '!border-[#DC2626]' : ''} ${disabled ? '!bg-[#F1F5F9] cursor-not-allowed' : ''} ${className}`}>
      <input
        type="text"
        inputMode="numeric"
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        title={invalid ? 'Ngày không hợp lệ (dd/mm/yyyy)' : undefined}
        placeholder={placeholder}
        value={text}
        disabled={disabled}
        onChange={(e) => handleType(e.target.value)}
        onBlur={handleBlur}
        className="w-full min-w-0 border-0 bg-transparent text-[13px] text-[#020817] placeholder:text-[#94A3B8] focus:outline-none p-0 disabled:text-[#94A3B8] disabled:cursor-not-allowed tabular-nums"
      />
      <button
        type="button"
        aria-label={`Mở lịch — ${ariaLabel}`}
        onClick={openPicker}
        disabled={disabled}
        className={`shrink-0 text-[#475569] hover:text-blue-600 rounded disabled:text-[#94A3B8] disabled:cursor-not-allowed ${BTN_FOCUS}`}
      >
        <Calendar className="w-4 h-4" />
      </button>
      {/* Bộ chọn ngày gốc của trình duyệt, ẩn — chỉ dùng để mở lịch */}
      <input
        ref={pickerRef}
        type="date"
        tabIndex={-1}
        aria-hidden="true"
        value={value || ''}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className="absolute right-0 bottom-0 w-px h-px opacity-0 pointer-events-none"
      />
    </div>
  );
}


// So khớp tìm kiếm: không phân biệt hoa/thường và dấu tiếng Việt
export const normalizeSearch = (v: string) =>
  (v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();

// Tiêu đề khối trong màn chi tiết (H2 mục 1): 14px/500
export const SECTION_TITLE = 'text-[14px] font-medium text-[#020817] mb-4 flex items-center gap-2';
// Tiêu đề nhóm trong khối: dùng chung cỡ H2 (14px/500), không có vạch xanh — PM chốt 07/10/2026 bỏ H3
export const GROUP_TITLE = 'text-[14px] font-medium text-[#020817]';
// Thẻ nhóm thông tin (mục 5.6): nền trắng, viền #E2E8F0, bo 16px
export const CARD_CLS = 'bg-white p-6 rounded-2xl border border-[#E2E8F0]';

// --- Phân trang (compomennt.md 5.14 — mẫu PM cung cấp 06/10/2026) ---
// Danh sách số trang rút gọn: luôn có trang đầu & cuối, tối đa 5 số quanh trang hiện tại, chèn "…" khi bị ngắt
export const getPageItems = (current: number, total: number): (number | '…')[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total];
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '…', current - 1, current, current + 1, '…', total];
};

// Theo số đo MUI Pagination (outlined, medium, rounded): nút 32×32, padding 0 6px, margin 0 3px, bo 8px, chữ 13px/700
const PAGE_NUM_BTN = 'min-w-8 h-8 px-1.5 mx-[3px] inline-flex items-center justify-center rounded-lg border text-[13px] font-bold transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-600';
const PAGE_ARROW_BTN = 'w-8 h-8 mx-[3px] inline-flex items-center justify-center rounded-lg bg-transparent text-[#020817] hover:bg-[#F0F0F0] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed';

export function Pagination({
  currentPage, totalItems, pageSize, onPageChange, onPageSizeChange, pageSizeOptions = [10, 20, 50, 100], className = '',
}: {
  currentPage: number; totalItems: number; pageSize: number;
  onPageChange: (page: number) => void; onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[]; className?: string;
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);
  return (
    <div className={`p-[13px] flex items-center justify-between gap-4 flex-wrap bg-white text-[14px] font-normal text-[#555555] ${className}`}>
      <div className="flex items-center gap-2.5">
        {onPageSizeChange && (
          <div className="relative">
            <select
              aria-label="Số bản ghi trên trang"
              title="Số bản ghi trên trang"
              className="w-[70px] h-9 pl-3 pr-7 appearance-none rounded-lg bg-[#F0F0F0] border-0 text-[14px] text-[#020817] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={pageSize}
              onChange={(e) => { onPageSizeChange(Number(e.target.value)); onPageChange(1); }}
            >
              {pageSizeOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}
        <span>Hiển thị <strong className="font-bold">{from}-{to}/{totalItems}</strong></span>
      </div>

      <nav aria-label="Phân trang" className="flex items-center">
        <button type="button" aria-label="Trang trước" title="Trang trước" className={PAGE_ARROW_BTN} disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
          <ChevronLeft className="w-4 h-4" />
        </button>
        {getPageItems(currentPage, totalPages).map((it, i) => it === '…' ? (
          <div key={`e${i}`} className="w-8 h-[19px] mx-[3px] rounded-2xl inline-flex items-center justify-center text-[#020817] select-none">…</div>
        ) : (
          <button
            key={it}
            type="button"
            aria-current={it === currentPage ? 'page' : undefined}
            onClick={() => onPageChange(it)}
            className={`${PAGE_NUM_BTN} ${it === currentPage ? 'bg-[#E6F4FF] border-[rgba(37,99,235,0.5)] text-[#0091FF]' : 'bg-[#F0F0F0] border-transparent text-black hover:bg-[#E2E8F0]'}`}
          >
            {it}
          </button>
        ))}
        <button type="button" aria-label="Trang sau" title="Trang sau" className={PAGE_ARROW_BTN} disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </nav>
    </div>
  );
}

// --- Tùy chọn cột: ẩn/hiện + sắp xếp thứ tự trường ở danh sách Xem dữ liệu thu thập
// (PM duyệt phương án A ngày 07/10/2026). Khai báo cột theo THỨ TỰ NẠP CẤU TRÚC = thứ tự mặc định.
// locked = luôn hiện (không bỏ tích, vẫn kéo đổi vị trí được); defaultVisible = hiện mặc định.
// STT và Thao tác không thuộc danh sách này (bảng luôn hiển thị ở đầu/cuối).
export interface ColumnDef<T> {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
  locked?: boolean;
  defaultVisible?: boolean;
  /** Cột văn bản dài → cắt "…" + tooltip, giới hạn độ rộng */
  wide?: boolean;
}

interface StoredColumns { order: string[] | null; visible: string[] | null }

// Đọc lựa chọn đã lưu; tương thích định dạng cũ (mảng các cột đang hiện)
const readStoredCols = (storageKey: string): StoredColumns => {
  try {
    const raw = window.localStorage.getItem(storageKey);
    const v = raw ? JSON.parse(raw) : null;
    const strs = (x: unknown) => (Array.isArray(x) ? x.filter((k) => typeof k === 'string') : null);
    if (Array.isArray(v)) return { order: null, visible: strs(v) };
    if (v && typeof v === 'object') return { order: strs(v.order), visible: strs(v.visible) };
  } catch { /* bỏ qua dữ liệu hỏng */ }
  return { order: null, visible: null };
};

/** Lưu ẩn/hiện + thứ tự cột theo từng bộ dữ liệu trên trình duyệt (localStorage). */
export function useVisibleColumns<T>(storageKey: string, columns: ColumnDef<T>[]) {
  const allKeys = columns.map((c) => c.key);
  const locked = columns.filter((c) => c.locked).map((c) => c.key);
  const defaults = columns.filter((c) => c.locked || c.defaultVisible).map((c) => c.key);
  const cleanOrder = (o: string[] | null) => {
    const kept = (o ?? []).filter((k, i, a) => allKeys.includes(k) && a.indexOf(k) === i);
    return [...kept, ...allKeys.filter((k) => !kept.includes(k))]; // cột mới (chưa lưu) nối cuối theo thứ tự khai báo
  };
  const cleanVisible = (v: string[] | null) => Array.from(new Set([...(v ?? defaults).filter((k) => allKeys.includes(k)), ...locked]));
  const load = () => { const s = readStoredCols(storageKey); return { order: cleanOrder(s.order), visible: cleanVisible(s.visible) }; };

  const [state, setState] = useState(load);
  // Đổi bộ dữ liệu (storageKey / danh sách cột) → nạp lại lựa chọn đã lưu của bộ đó
  const sig = storageKey + '|' + allKeys.join(',');
  useEffect(() => { setState(load()); }, [sig]);

  const save = (next: { order: string[]; visible: string[] }) => {
    const clean = { order: cleanOrder(next.order), visible: cleanVisible(next.visible) };
    setState(clean);
    try { window.localStorage.setItem(storageKey, JSON.stringify(clean)); } catch { /* trình duyệt chặn lưu */ }
  };
  const { order, visible } = state;
  const isDefault = visible.length === defaults.length && defaults.every((k) => visible.includes(k)) && order.every((k, i) => k === allKeys[i]);
  const byKey = new Map(columns.map((c) => [c.key, c] as const));
  return {
    order,
    visible,
    /** Cột đang hiện, theo thứ tự đã sắp xếp */
    visibleColumns: order.filter((k) => visible.includes(k)).map((k) => byKey.get(k)!).filter(Boolean),
    toggle: (key: string) => { if (locked.includes(key)) return; save({ order, visible: visible.includes(key) ? visible.filter((k) => k !== key) : [...visible, key] }); },
    setAll: (on: boolean) => save({ order, visible: on ? allKeys : locked }),
    move: (from: number, to: number) => {
      if (from === to || from < 0 || to < 0 || from >= order.length || to >= order.length) return;
      const next = [...order]; const [k] = next.splice(from, 1); next.splice(to, 0, k);
      save({ order: next, visible });
    },
    reset: () => { setState({ order: [...allKeys], visible: cleanVisible(null) }); try { window.localStorage.removeItem(storageKey); } catch { /* ignore */ } },
    isDefault,
  };
}

const ColCheck = ({ on, disabled }: { on: boolean; disabled?: boolean }) => (
  <span className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center ${on ? (disabled ? 'bg-[#94A3B8] border-[#94A3B8]' : 'bg-blue-600 border-blue-600') : 'bg-white border-[#CBD5E1]'}`}>
    {on && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
  </span>
);

const MOVE_BTN = 'w-6 h-6 rounded-md flex items-center justify-center text-[#475569] hover:bg-[#E2E8F0] hover:text-[#155DFC] disabled:text-[#CBD5E1] disabled:hover:bg-transparent disabled:cursor-default outline-none focus-visible:ring-2 focus-visible:ring-blue-600';

/** Nút "Tùy chọn cột" 40×40 (cạnh nút Bộ lọc): ẩn/hiện + kéo-thả / ↑↓ sắp xếp. Mọi thay đổi áp dụng ngay. */
export function ColumnPicker<T>({ columns, order, visible, onToggle, onToggleAll, onMove, onReset, isDefault }: {
  columns: ColumnDef<T>[]; order: string[]; visible: string[];
  onToggle: (key: string) => void; onToggleAll: (on: boolean) => void;
  onMove: (from: number, to: number) => void; onReset: () => void; isDefault: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dropAt, setDropAt] = useState<number | null>(null); // vị trí chèn (0..n) để vẽ vạch xanh
  const byKey = new Map(columns.map((c) => [c.key, c] as const));
  const rows = order.map((k) => byKey.get(k)).filter(Boolean) as ColumnDef<T>[];
  const allOn = visible.length === columns.length;
  const endDrag = () => { setDragFrom(null); setDropAt(null); };
  const drop = () => {
    if (dragFrom !== null && dropAt !== null) {
      const to = dropAt > dragFrom ? dropAt - 1 : dropAt; // chèn trước dòng dropAt
      onMove(dragFrom, to);
    }
    endDrag();
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        {/* Chặn mở tooltip khi focus quay lại nút sau lúc đóng danh sách (tránh tooltip bị treo) */}
        <TooltipTrigger asChild onFocus={(e: React.FocusEvent) => e.preventDefault()}>
          <span className="inline-flex">
            <PopoverTrigger asChild>
              <button type="button" aria-label="Tùy chọn cột" className={`${filterBtnClass(open)} relative`}>
                <Columns3 className="w-5 h-5" />
                {!isDefault && !open && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />}
              </button>
            </PopoverTrigger>
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={4} className={TOOLTIP_CLS}>Tùy chọn cột</TooltipContent>
      </Tooltip>
      <PopoverContent align="end" sideOffset={6} className="w-72 p-1 bg-white border border-[#E2E8F0] rounded-lg shadow-lg">
        <div className="px-3 py-2 flex items-center justify-between">
          <span className="text-[13px] font-medium text-[#020817]">Hiển thị & sắp xếp cột</span>
          <span className="text-[12px] text-[#64748B] tabular-nums">{visible.length}/{columns.length}</span>
        </div>
        <button type="button" onClick={() => onToggleAll(!allOn)} className="w-full px-3 py-1.5 flex items-center gap-2 rounded-md text-[13px] text-[#020817] hover:bg-[#F1F5F9] outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
          <ColCheck on={allOn} /> Chọn tất cả
        </button>
        <div className="my-1 h-px bg-[#E2E8F0]" />
        <p className="px-3 pb-1 text-[12px] text-[#64748B]">Kéo ⋮⋮ hoặc dùng ↑ ↓ để đổi thứ tự</p>
        <ul className="max-h-[320px] overflow-y-auto custom-scrollbar" onDragOver={(e) => e.preventDefault()} onDrop={drop}>
          {rows.map((c, i) => {
            const on = visible.includes(c.key);
            return (
              <li
                key={c.key}
                draggable
                onDragStart={(e) => { setDragFrom(i); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', c.key); }}
                onDragOver={(e) => { e.preventDefault(); const r = e.currentTarget.getBoundingClientRect(); setDropAt(e.clientY < r.top + r.height / 2 ? i : i + 1); }}
                onDragEnd={endDrag}
                className={`group relative flex items-center gap-1.5 pl-1 pr-1.5 h-9 rounded-md hover:bg-[#F8FAFC] ${dragFrom === i ? 'opacity-50' : ''}`}
              >
                {dropAt === i && dragFrom !== null && <span className="absolute left-1 right-1 top-0 h-0.5 bg-[#155DFC] rounded-full" />}
                {dropAt === i + 1 && i === rows.length - 1 && dragFrom !== null && <span className="absolute left-1 right-1 bottom-0 h-0.5 bg-[#155DFC] rounded-full" />}
                <span className="w-5 h-6 flex items-center justify-center text-[#94A3B8] cursor-grab active:cursor-grabbing" aria-hidden="true">
                  <GripVertical className="w-4 h-4" />
                </span>
                <button
                  type="button"
                  disabled={c.locked}
                  onClick={() => onToggle(c.key)}
                  aria-pressed={on}
                  className="flex-1 min-w-0 flex items-center gap-2 py-1 text-left text-[13px] text-[#020817] outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded disabled:cursor-default"
                >
                  <ColCheck on={on} disabled={c.locked} />
                  <span className="truncate">{c.label}</span>
                  {c.locked && <span className="shrink-0 text-[12px] text-[#64748B]">(luôn hiện)</span>}
                </button>
                <span className="flex items-center opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">
                  <button type="button" aria-label={`Đưa "${c.label}" lên`} title="Lên" disabled={i === 0} onClick={() => onMove(i, i - 1)} className={MOVE_BTN}>
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" aria-label={`Đưa "${c.label}" xuống`} title="Xuống" disabled={i === rows.length - 1} onClick={() => onMove(i, i + 1)} className={MOVE_BTN}>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </span>
              </li>
            );
          })}
        </ul>
        <div className="my-1 h-px bg-[#E2E8F0]" />
        <button type="button" disabled={isDefault} onClick={onReset} className="w-full px-3 py-1.5 flex items-center gap-2 rounded-md text-[13px] text-[#155DFC] hover:bg-[#F1F5F9] disabled:text-[#94A3B8] disabled:hover:bg-transparent disabled:cursor-default outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
          <RotateCcw className="w-4 h-4" /> Khôi phục mặc định
        </button>
      </PopoverContent>
    </Popover>
  );
}

// Quy đổi nhãn phương thức ở danh sách (connectionMethod) sang mã phương thức kết nối
const METHOD_TO_TYPE: Record<string, string> = { 'API': 'API', 'API nhận (JSON)': 'API_RECEIVE_JSON', 'API nhận (XML)': 'API_RECEIVE_XML', 'Cơ Sở Dữ Liệu': 'DB', 'File': 'FILE' };
export const resolveConnectionType = (service: any): string =>
  service?.connectionType || METHOD_TO_TYPE[service?.connectionMethod] || 'API';

/**
 * Ô chọn có ô tìm kiếm bên trong (Combobox — compomennt.md 5.11). Dùng thay <select> khi danh sách dài.
 * Tìm không phân biệt dấu/hoa thường; ↑ ↓ để di chuyển, Enter để chọn, Esc để đóng.
 */
export function SearchableSelect({ value, onChange, options, ariaLabel, searchPlaceholder = 'Tìm kiếm...', emptyText = 'Không tìm thấy kết quả phù hợp', placeholder = '', disabled = false, contentClassName = '' }: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  ariaLabel: string;
  searchPlaceholder?: string;
  emptyText?: string;
  /** Chữ hiển thị khi chưa chọn */
  placeholder?: string;
  disabled?: boolean;
  /** Lớp thêm cho danh sách thả xuống (VD z-index khi nằm trong modal) */
  contentClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement | null>(null);
  const q = normalizeSearch(query);
  const filtered = q ? options.filter((o) => normalizeSearch(o.label).includes(q)) : options;
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (open) { setQuery(''); setActive(Math.max(0, options.findIndex((o) => o.value === value))); }
  }, [open]);
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  const choose = (v: string) => { onChange(v); setOpen(false); };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(filtered.length - 1, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(0, i - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (filtered[active]) choose(filtered[active].value); }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabel}
          disabled={disabled}
          className={`${INPUT_CLS} flex items-center justify-between gap-2 text-left ${open ? 'ring-2 ring-blue-600' : ''}`}
        >
          <span className={`truncate ${selected ? '' : 'text-[#94A3B8]'}`}>{selected?.label ?? placeholder}</span>
          <ChevronDown className={`w-4 h-4 shrink-0 text-[#475569] transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={4}
        className={`p-1.5 w-[var(--radix-popover-trigger-width)] min-w-[220px] bg-white border border-[#E2E8F0] rounded-lg shadow-lg ${contentClassName}`}
        onOpenAutoFocus={(e: Event) => { e.preventDefault(); (e.currentTarget as HTMLElement).querySelector('input')?.focus(); }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActive(0); }}
          onKeyDown={onKeyDown}
          aria-label={searchPlaceholder}
          placeholder={searchPlaceholder}
          className={`${INPUT_CLS} mb-1`}
        />
        <ul ref={listRef} role="listbox" aria-label={ariaLabel} className="max-h-[260px] overflow-y-auto custom-scrollbar">
          {filtered.map((o, i) => {
            const isSel = o.value === value;
            return (
              <li
                key={o.value}
                data-index={i}
                role="option"
                aria-selected={isSel}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(o.value)}
                className={`min-h-9 px-3 py-2 flex items-center justify-between gap-2 rounded-md text-[13px] cursor-pointer ${i === active ? 'bg-[#F1F5F9]' : ''} ${isSel ? 'text-blue-600 font-medium' : 'text-[#020817]'}`}
              >
                <span className="truncate">{o.label}</span>
                {isSel && <Check className="w-4 h-4 shrink-0" />}
              </li>
            );
          })}
          {filtered.length === 0 && <li className="px-3 py-3 text-center text-[13px] text-[#64748B]">{emptyText}</li>}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
