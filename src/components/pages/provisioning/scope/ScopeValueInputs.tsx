// Ô nhập giá trị phạm vi (log 261):
// - MultiValueSelect: chọn nhiều có tìm kiếm + Chọn tất cả / Bỏ chọn (chiều "Lấy từ danh mục")
// - TagValueInput: gõ giá trị rồi Enter, tự trim + bỏ trùng (chiều "Tự nhập")
import { useState, type KeyboardEvent } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '../../../ui/popover';
import { INPUT_CLS, normalizeSearch } from '../../collection/collectionUi';

const BOX_CLS = 'min-h-10 w-full px-2 py-1.5 border border-[#E2E8F0] rounded-lg bg-white flex flex-wrap items-center gap-1 text-[13px] text-left';
const CHIP_CLS = 'inline-flex items-center gap-1 h-[26px] pl-2 pr-1 rounded-2xl border text-[13px] text-[#2563EB] bg-[#EFF6FF] border-[#BFDBFE] max-w-full';

const Chip = ({ label, onRemove, disabled }: { label: string; onRemove: () => void; disabled?: boolean }) => (
  <span className={CHIP_CLS}>
    <span className="truncate">{label}</span>
    {!disabled && (
      <span
        role="button"
        tabIndex={0}
        aria-label={`Bỏ ${label}`}
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); onRemove(); } }}
        className="p-0.5 rounded hover:bg-[#DBEAFE] cursor-pointer"
      >
        <X className="w-3 h-3" />
      </span>
    )}
  </span>
);

export interface MultiOption { value: string; label: string; extra?: string[] }

/**
 * Chọn nhiều có tìm kiếm. Có `columns` thì danh sách hiển thị dạng bảng nhiều cột
 * (cột 1 = giá trị, các cột sau = trường hiển thị) – log 262.
 */
export function MultiValueSelect({ values, options, onChange, ariaLabel, placeholder = 'Gõ để tìm và chọn...', disabled = false, columns, chipText, max, hideBulk = false, searchPlaceholder = 'Gõ mã hoặc tên để tìm...' }: {
  values: string[];
  options: MultiOption[];
  onChange: (values: string[]) => void;
  ariaLabel: string;
  placeholder?: string;
  disabled?: boolean;
  /** Tiêu đề cột khi hiển thị dạng bảng: [cột giá trị, ...cột hiển thị] */
  columns?: string[];
  /** Chữ trên chip đã chọn (mặc định: label) */
  chipText?: (o: MultiOption) => string;
  /** Số lựa chọn tối đa */
  max?: number;
  hideBulk?: boolean;
  searchPlaceholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const q = normalizeSearch(query);
  const filtered = q ? options.filter((o) => normalizeSearch(`${o.value} ${o.label} ${(o.extra || []).join(' ')}`).includes(q)) : options;
  const full = max !== undefined && values.length >= max;
  const toggle = (v: string) => {
    if (values.includes(v)) onChange(values.filter((x) => x !== v));
    else if (!full) onChange([...values, v]);
  };
  const textOf = (v: string) => {
    const o = options.find((x) => x.value === v);
    return o ? (chipText ? chipText(o) : o.label) : v;
  };
  const table = !!columns && columns.length > 1;
  const gridStyle = table ? { gridTemplateColumns: `16px minmax(64px,auto) repeat(${columns!.length - 1}, minmax(0,1fr))` } : undefined;

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (o) setQuery(''); }}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          aria-expanded={open}
          disabled={disabled}
          className={`${BOX_CLS} ${open ? 'ring-2 ring-blue-600' : 'hover:border-[#94A3B8]'} disabled:bg-[#F0F0F0] disabled:cursor-not-allowed`}
        >
          {values.length === 0 && <span className="px-1 text-[var(--color-placeholder)]">{placeholder}</span>}
          {values.map((v) => <Chip key={v} label={textOf(v)} disabled={disabled} onRemove={() => toggle(v)} />)}
          <ChevronDown className={`ml-auto w-4 h-4 shrink-0 text-[#475569] transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={4}
        className={`z-[1000000] p-1.5 w-[var(--radix-popover-trigger-width)] ${table ? 'min-w-[420px]' : 'min-w-[260px]'} bg-white border border-[#E2E8F0] rounded-lg shadow-lg`}
        onOpenAutoFocus={(e: Event) => { e.preventDefault(); (e.currentTarget as HTMLElement).querySelector('input')?.focus(); }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Tìm giá trị"
          placeholder={searchPlaceholder}
          className={`${INPUT_CLS} mb-1`}
        />
        <div className="flex items-center gap-3 px-2 py-1.5 text-[12px] border-b border-[#E2E8F0] mb-1">
          {!hideBulk && (
            <>
              <button type="button" className="text-blue-600 font-medium hover:underline" onClick={() => onChange(max ? options.slice(0, max).map((o) => o.value) : options.map((o) => o.value))}>Chọn tất cả</button>
              <button type="button" className="text-[#64748B] font-medium hover:underline" onClick={() => onChange([])}>Bỏ chọn</button>
            </>
          )}
          <span className="ml-auto text-[#64748B]">Đã chọn {values.length}/{max ?? options.length}</span>
        </div>
        {table && (
          <div className="grid gap-x-3 px-2 py-1.5 text-[12px] font-semibold text-[#475569] bg-[#F8FAFC] rounded-md" style={gridStyle}>
            <span />
            {columns!.map((c) => <span key={c} className="truncate">{c}</span>)}
          </div>
        )}
        <ul role="listbox" aria-label={ariaLabel} aria-multiselectable="true" className="max-h-[240px] overflow-y-auto custom-scrollbar">
          {filtered.map((o) => {
            const checked = values.includes(o.value);
            const locked = !checked && full;
            return (
              <li
                key={o.value}
                role="option"
                aria-selected={checked}
                aria-disabled={locked}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => toggle(o.value)}
                style={gridStyle}
                className={`min-h-9 px-2 py-1.5 rounded-md text-[13px] ${table ? 'grid gap-x-3 items-center' : 'flex items-center gap-2'} ${locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#F1F5F9]'}`}
              >
                <input type="checkbox" readOnly checked={checked} tabIndex={-1} className="w-4 h-4 shrink-0 accent-blue-600 pointer-events-none" />
                {table ? (
                  <>
                    <span className="truncate text-[#020817] font-medium">{o.value}</span>
                    {columns!.slice(1).map((c, i) => <span key={c} className="truncate text-[#334155]" title={o.extra?.[i]}>{o.extra?.[i] || '–'}</span>)}
                  </>
                ) : (
                  <span className="min-w-0">
                    <span className="block truncate text-[#020817]">{o.label}</span>
                    {o.label !== o.value && <span className="block text-[12px] text-[#64748B]">{o.value}</span>}
                  </span>
                )}
              </li>
            );
          })}
          {filtered.length === 0 && <li className="px-3 py-3 text-center text-[13px] text-[#64748B]">Không tìm thấy kết quả phù hợp</li>}
        </ul>
        {max !== undefined && full && <p className="px-2 pt-1 text-[12px] text-[#64748B]">Đã chọn tối đa {max}.</p>}
      </PopoverContent>
    </Popover>
  );
}

export function TagValueInput({ values, onChange, ariaLabel, disabled = false }: {
  values: string[];
  onChange: (values: string[]) => void;
  ariaLabel: string;
  disabled?: boolean;
}) {
  const [text, setText] = useState('');
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const v = text.trim();
      if (v && !values.includes(v)) onChange([...values, v]);
      setText('');
    } else if (e.key === 'Backspace' && !text && values.length) {
      onChange(values.slice(0, -1));
    }
  };
  return (
    <div className={`${BOX_CLS} cursor-text focus-within:ring-2 focus-within:ring-blue-600 ${disabled ? 'bg-[#F0F0F0]' : ''}`}>
      {values.map((v) => <Chip key={v} label={v} disabled={disabled} onRemove={() => onChange(values.filter((x) => x !== v))} />)}
      {!disabled && (
        <input
          type="text"
          value={text}
          maxLength={255}
          aria-label={ariaLabel}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Gõ giá trị rồi nhấn Enter"
          className="flex-1 min-w-[160px] h-7 px-1 outline-none bg-transparent text-[13px] text-[#020817] placeholder:text-[var(--color-placeholder)]"
        />
      )}
    </div>
  );
}
