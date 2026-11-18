// Tab "Danh mục chiều phạm vi" của màn Quản lý API cung cấp & đối soát (log 261)
// BR01–BR03: khai báo chiều; không xóa chiều đang dùng ở API; không đổi Mã chiều sau khi tạo.
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, Plus, Edit, Trash2, Check, X, SlidersHorizontal, Lock, Unlock, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmModal } from '../../../common/ConfirmModal';
import {
  Badge, RowIconAction, SearchableSelect, BTN_PRIMARY, BTN_OUTLINE, BTN_GHOST_ICON, INPUT_CLS, LABEL_CLS, REQUIRED_MARK,
  SEARCH_INPUT_CLS, SEARCH_BTN_CLS, normalizeSearch
} from '../../collection/collectionUi';
import {
  type ScopeDimension, SCOPE_SOURCE_TYPES, SCOPE_TARGET_DBS, SCOPE_CODE_RE, MAX_DISPLAY_COLUMNS, scopeTablesOf, scopeColumnsOf, scopeValueOptions,
  useScopeDimensions, useServiceScopeMap, setScopeDimensions, servicesUsingDimension
} from './scopeData';
import { MultiValueSelect } from './ScopeValueInputs';

const TABLE_WRAP = 'bg-white rounded-lg border border-[#E2E8F0] overflow-hidden';
const TABLE_CLS = 'w-full border-collapse collection-table text-[13px]';
const TH = 'px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px]';
const TH_ACTION = `${TH.replace('text-left', 'text-center')} w-px sticky right-0 z-[1] bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]`;
const TR = 'group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors';
const TD = 'px-3 py-1 text-left text-[13px] text-black';
const TD_ACTION = 'px-3 py-1 text-center whitespace-nowrap sticky right-0 bg-white group-hover:bg-[#F8FAFC] transition-colors shadow-[-1px_0_0_#E2E8F0]';
const EMPTY_TD = 'py-16 text-center text-[13px] text-[#64748B]';
const HINT = 'text-[12px] text-[#64748B] mt-1';
const ERR = 'text-[12px] text-[#DC2626] mt-1';

const EMPTY_DIM: ScopeDimension = { code: '', name: '', mode: 'DM', sourceType: undefined, sourceDb: '', sourceTable: '', sourceColumn: '', displayColumns: [], status: 'Hoạt động' };

export function ScopeDimensionTab() {
  const dims = useScopeDimensions();
  const fieldMap = useServiceScopeMap();
  const [search, setSearch] = useState('');
  const [applied, setApplied] = useState('');
  const [editing, setEditing] = useState<ScopeDimension | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteCode, setDeleteCode] = useState<string | null>(null);

  const rows = dims.filter((d) => normalizeSearch(`${d.code} ${d.name}`).includes(normalizeSearch(applied)));
  const delDim = dims.find((d) => d.code === deleteCode);
  const delUsedBy = deleteCode ? servicesUsingDimension(fieldMap, deleteCode) : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-1.5">
          <input
            type="text"
            aria-label="Tìm kiếm"
            placeholder="Tìm kiếm chiều phạm vi theo mã hoặc tên..."
            className={SEARCH_INPUT_CLS}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') setApplied(search); }}
          />
          <button type="button" aria-label="Tìm kiếm" title="Tìm kiếm" onClick={() => setApplied(search)} className={SEARCH_BTN_CLS}>
            <Search className="w-5 h-5" />
          </button>
        </div>
        <button type="button" className={`${BTN_PRIMARY} whitespace-nowrap`} onClick={() => { setIsNew(true); setEditing({ ...EMPTY_DIM }); }}>
          <Plus className="w-4 h-4" />
          Thêm chiều phạm vi
        </button>
      </div>

      <div className={TABLE_WRAP}>
        <div className="overflow-x-auto">
          <table className={TABLE_CLS}>
            <thead className="bg-[#F8FAFC]">
              <tr className="h-[42px]">
                <th className={`${TH} w-14 text-center`}>STT</th>
                <th className={TH}>Mã chiều</th>
                <th className={TH}>Tên chiều</th>
                <th className={TH}>Phương thức nhập</th>
                <th className={TH}>Nguồn giá trị</th>
                <th className={`${TH} text-center`}>Đang dùng ở API</th>
                <th className={TH}>Trạng thái</th>
                <th className={TH_ACTION}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={8} className={EMPTY_TD}>Chưa có chiều phạm vi nào.</td></tr>
              ) : rows.map((d, i) => {
                const used = servicesUsingDimension(fieldMap, d.code);
                return (
                  <tr key={d.code} className={TR}>
                    <td className={`${TD} text-center`}>{i + 1}</td>
                    <td className={`${TD} font-medium whitespace-nowrap`}>{d.code}</td>
                    <td className={TD}>{d.name}</td>
                    <td className={TD}><Badge label={d.mode === 'DM' ? 'Lấy từ danh mục' : 'Tự nhập'} variant={d.mode === 'DM' ? 'blue' : 'slate'} /></td>
                    <td className={TD}>
                      {d.mode === 'DM' ? (
                        <div className="leading-[18px]">
                          <div>{d.sourceTable} › {d.sourceColumn}</div>
                          <div className="text-[12px] text-[#64748B]">{d.sourceType}{d.sourceType === 'CSDL đích' && d.sourceDb ? ` › ${d.sourceDb}` : ''}</div>
                          {!!d.displayColumns?.length && <div className="text-[12px] text-[#64748B]">Hiển thị: {d.displayColumns.join(', ')}</div>}
                        </div>
                      ) : <span className="text-[#94A3B8]">–</span>}
                    </td>
                    <td className={`${TD} text-center`}>
                      {used.length ? <span title={used.join('\n')} className="underline decoration-dotted cursor-help">{used.length}</span> : <span className="text-[#94A3B8]">0</span>}
                    </td>
                    <td className={TD}>
                      <Badge
                        label={d.status}
                        variant={d.status === 'Hoạt động' ? 'green' : 'slate'}
                        icon={d.status === 'Hoạt động' ? <Unlock className="w-3.5 h-3.5 shrink-0" /> : <Lock className="w-3.5 h-3.5 shrink-0" />}
                      />
                    </td>
                    <td className={TD_ACTION}>
                      <div className="inline-flex items-center justify-center gap-1">
                        <RowIconAction label="Chỉnh sửa chiều phạm vi" onClick={() => { setIsNew(false); setEditing({ ...d }); }}>
                          <Edit className="w-4 h-4" />
                        </RowIconAction>
                        <RowIconAction label="Xóa chiều phạm vi" onClick={() => setDeleteCode(d.code)}>
                          <Trash2 className="w-4 h-4" />
                        </RowIconAction>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-[#E2E8F0] text-[13px] text-[#64748B]">Tổng số: {rows.length} bản ghi</div>
      </div>

      {editing && (
        <ScopeDimensionModal
          initial={editing}
          isNew={isNew}
          usedBy={isNew ? [] : servicesUsingDimension(fieldMap, editing.code)}
          existingCodes={dims.map((d) => d.code)}
          onClose={() => setEditing(null)}
          onSave={(d) => {
            setScopeDimensions(isNew ? [...dims, d] : dims.map((x) => (x.code === d.code ? d : x)));
            toast.success(isNew ? `Đã thêm chiều phạm vi ${d.code}!` : 'Đã cập nhật chiều phạm vi!');
            setEditing(null);
          }}
        />
      )}

      {/* BR03: chiều đang dùng → chỉ báo, không cho xóa */}
      <ConfirmModal
        isOpen={!!deleteCode}
        onClose={() => setDeleteCode(null)}
        onConfirm={() => {
          if (!deleteCode || delUsedBy.length) { setDeleteCode(null); return; }
          setScopeDimensions(dims.filter((d) => d.code !== deleteCode));
          toast.success('Đã xóa chiều phạm vi!');
          setDeleteCode(null);
        }}
        title={delUsedBy.length ? 'Không thể xóa chiều phạm vi' : 'Xóa chiều phạm vi'}
        type={delUsedBy.length ? 'warning' : 'delete'}
        hideConfirm={delUsedBy.length > 0}
        cancelText={delUsedBy.length ? 'Đóng' : 'Hủy bỏ'}
        confirmText="Xóa"
        message={delUsedBy.length ? (
          <div>
            Chiều <b>{deleteCode}</b> đang được dùng làm trường phân vùng ở {delUsedBy.length} API:
            <ul className="list-disc pl-5 my-2">{delUsedBy.map((n) => <li key={n}>{n}</li>)}</ul>
            Gỡ chiều khỏi các API trên hoặc chuyển trạng thái <b>Ngừng hoạt động</b>.
          </div>
        ) : (
          <div>Bạn có chắc chắn muốn xóa chiều <b>{deleteCode} – {delDim?.name}</b>? Giá trị đã khai của chiều này ở các tài khoản API sẽ không còn hiệu lực. Thao tác không thể hoàn tác.</div>
        )}
      />
    </div>
  );
}

function ScopeDimensionModal({ initial, isNew, usedBy, existingCodes, onClose, onSave }: {
  initial: ScopeDimension;
  isNew: boolean;
  usedBy: string[];
  existingCodes: string[];
  onClose: () => void;
  onSave: (d: ScopeDimension) => void;
}) {
  const [d, setD] = useState<ScopeDimension>(initial);
  const [err, setErr] = useState<Record<string, string>>({});
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);
  const lockSource = usedBy.length > 0; // chiều đang dùng: không đổi phương thức / nguồn
  const isDb = d.sourceType === 'CSDL đích';
  const tables = scopeTablesOf(d);
  const columns = scopeColumnsOf(d);
  const preview = d.mode === 'DM' && d.sourceColumn ? scopeValueOptions(d).slice(0, 4) : [];
  const set = (patch: Partial<ScopeDimension>) => setD((prev) => ({ ...prev, ...patch }));

  const validate = () => {
    const e: Record<string, string> = {};
    const name = d.name.trim();
    if (!d.code) e.code = 'Vui lòng nhập Mã chiều.';
    else if (!SCOPE_CODE_RE.test(d.code)) e.code = 'Mã chiều chỉ gồm A–Z, 0–9, dấu gạch dưới; tối đa 30 ký tự.';
    else if (isNew && existingCodes.includes(d.code)) e.code = 'Mã chiều đã tồn tại.';
    if (!name) e.name = 'Vui lòng nhập Tên chiều.';
    if (d.mode === 'DM') {
      if (!d.sourceType) e.sourceType = 'Vui lòng chọn Loại danh mục.';
      if (isDb && !d.sourceDb) e.sourceDb = 'Vui lòng chọn CSDL đích.';
      if (!d.sourceTable) e.sourceTable = 'Vui lòng chọn Bảng.';
      if (!d.sourceColumn) e.sourceColumn = 'Vui lòng chọn Trường giá trị.';
    }
    setErr(e);
    return Object.keys(e).length === 0;
  };
  const buildResult = (): ScopeDimension => d.mode === 'TN'
    ? { code: d.code, name: d.name.trim(), mode: 'TN', status: d.status }
    : { ...d, name: d.name.trim(), sourceDb: isDb ? d.sourceDb : undefined };
  const handleSave = () => {
    if (!validate()) return;
    if (!isNew && initial.status === 'Hoạt động' && d.status !== 'Hoạt động' && usedBy.length) { setConfirmDeactivate(true); return; }
    onSave(buildResult());
  };

  return createPortal(
    <div style={{ zIndex: 999999 }} className="fixed inset-0 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-600" />
            <h2 className="text-[16px] font-semibold text-[#020817]">{isNew ? 'Thêm mới chiều phạm vi' : 'Chỉnh sửa chiều phạm vi'}</h2>
          </div>
          <button type="button" onClick={onClose} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Mã chiều <span className={REQUIRED_MARK}>*</span></label>
              <input
                type="text"
                maxLength={30}
                disabled={!isNew}
                value={d.code}
                placeholder="VD: TINH"
                onChange={(e) => set({ code: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '') })}
                className={`${INPUT_CLS} ${err.code ? '!border-[#DC2626]' : ''}`}
              />
              <p className={HINT}>{isNew ? 'Chữ in hoa A–Z, số 0–9, dấu gạch dưới; tối đa 30 ký tự.' : 'Không đổi được Mã chiều sau khi tạo.'}</p>
              {err.code && <p className={ERR}>{err.code}</p>}
            </div>
            <div>
              <label className={LABEL_CLS}>Tên chiều <span className={REQUIRED_MARK}>*</span></label>
              <input
                type="text"
                maxLength={255}
                value={d.name}
                placeholder="VD: Tỉnh/Thành phố"
                onChange={(e) => set({ name: e.target.value })}
                className={`${INPUT_CLS} ${err.name ? '!border-[#DC2626]' : ''}`}
              />
              {err.name && <p className={ERR}>{err.name}</p>}
            </div>
          </div>

          <div>
            <label className={LABEL_CLS}>Phương thức nhập giá trị <span className={REQUIRED_MARK}>*</span></label>
            <div className="flex flex-wrap items-center gap-6 h-10">
              {([['DM', 'Lấy từ danh mục'], ['TN', 'Tự nhập']] as const).map(([v, l]) => (
                <label key={v} className={`inline-flex items-center gap-2 text-[13px] ${lockSource ? 'cursor-not-allowed text-[#64748B]' : 'cursor-pointer'}`}>
                  <input type="radio" name="scope-mode" className="w-4 h-4 accent-blue-600" disabled={lockSource} checked={d.mode === v} onChange={() => set({ mode: v })} />
                  {l}
                </label>
              ))}
            </div>
            {lockSource && <p className={HINT}>Chiều đang được {usedBy.length} API sử dụng – không đổi phương thức và nguồn giá trị.</p>}
          </div>

          {d.mode === 'DM' ? (
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-4">
              <div className={`grid grid-cols-1 gap-4 ${isDb ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
                <div>
                  <label className={LABEL_CLS}>Loại danh mục <span className={REQUIRED_MARK}>*</span></label>
                  <SearchableSelect
                    ariaLabel="Loại danh mục"
                    placeholder="-- Chọn loại --"
                    searchPlaceholder="Tìm loại danh mục..."
                    contentClassName="z-[1000000]"
                    disabled={lockSource}
                    value={d.sourceType || ''}
                    options={SCOPE_SOURCE_TYPES.map((x) => ({ value: x, label: x }))}
                    onChange={(v) => set({ sourceType: v as ScopeDimension['sourceType'], sourceDb: '', sourceTable: '', sourceColumn: '', displayColumns: [] })}
                  />
                  {err.sourceType && <p className={ERR}>{err.sourceType}</p>}
                </div>
                {isDb && (
                  <div>
                    <label className={LABEL_CLS}>CSDL đích <span className={REQUIRED_MARK}>*</span></label>
                    <SearchableSelect
                      ariaLabel="CSDL đích"
                      placeholder="-- Chọn CSDL đích --"
                      searchPlaceholder="Tìm CSDL đích..."
                      contentClassName="z-[1000000]"
                      disabled={lockSource}
                      value={d.sourceDb || ''}
                      options={Object.keys(SCOPE_TARGET_DBS).map((x) => ({ value: x, label: x }))}
                      onChange={(v) => set({ sourceDb: v, sourceTable: '', sourceColumn: '', displayColumns: [] })}
                    />
                    {err.sourceDb && <p className={ERR}>{err.sourceDb}</p>}
                  </div>
                )}
                <div>
                  <label className={LABEL_CLS}>Bảng <span className={REQUIRED_MARK}>*</span></label>
                  <SearchableSelect
                    ariaLabel="Bảng"
                    placeholder={!d.sourceType ? 'Chọn loại trước' : isDb && !d.sourceDb ? 'Chọn CSDL đích trước' : '-- Chọn bảng --'}
                    searchPlaceholder="Tìm bảng..."
                    contentClassName="z-[1000000]"
                    disabled={lockSource || tables.length === 0}
                    value={d.sourceTable || ''}
                    options={tables.map((x) => ({ value: x, label: x }))}
                    onChange={(v) => set({ sourceTable: v, sourceColumn: '', displayColumns: [] })}
                  />
                  {err.sourceTable && <p className={ERR}>{err.sourceTable}</p>}
                </div>
                <div>
                  <label className={LABEL_CLS}>Trường giá trị <span className={REQUIRED_MARK}>*</span></label>
                  <SearchableSelect
                    ariaLabel="Trường giá trị"
                    placeholder={d.sourceTable ? '-- Chọn trường --' : 'Chọn bảng trước'}
                    searchPlaceholder="Tìm trường..."
                    contentClassName="z-[1000000]"
                    disabled={lockSource || columns.length === 0}
                    value={d.sourceColumn || ''}
                    options={columns.map((x) => ({ value: x, label: x }))}
                    onChange={(v) => set({ sourceColumn: v, displayColumns: (d.displayColumns || []).filter((c) => c !== v) })}
                  />
                  {err.sourceColumn && <p className={ERR}>{err.sourceColumn}</p>}
                </div>
              </div>
              {isDb && (
                <div className="flex gap-2 items-start rounded-lg border border-[#FED7AA] bg-[#FFF7ED] px-3 py-2 text-[12px] text-[#9A3412]">
                  <Lightbulb className="w-4 h-4 shrink-0" />
                  <div>
                    Bảng nghiệp vụ trong CSDL đích thường <b>chỉ có mã</b> (VD <code>ma_tinh</code>), không có tên để hiển thị.
                    Nên lấy giá trị từ <b>Danh mục dùng chung</b> / <b>Dữ liệu chủ</b> (VD <code>dm_tinh_thanh</code> có cả mã và tên);
                    việc gắn chiều với cột của bảng nghiệp vụ làm ở Bước 3 – Trường phân vùng dữ liệu.
                  </div>
                </div>
              )}
              <div>
                <label className={LABEL_CLS}>Trường hiển thị</label>
                <MultiValueSelect
                  ariaLabel="Trường hiển thị"
                  placeholder={d.sourceColumn ? `Chọn tối đa ${MAX_DISPLAY_COLUMNS} trường (VD tên) để người chọn dễ nhận biết` : 'Chọn trường giá trị trước'}
                  searchPlaceholder="Tìm trường..."
                  disabled={!d.sourceColumn /* không ảnh hưởng việc lọc → vẫn sửa được khi chiều đang dùng */}
                  hideBulk
                  max={MAX_DISPLAY_COLUMNS}
                  values={d.displayColumns || []}
                  options={columns.filter((c) => c !== d.sourceColumn).map((c) => ({ value: c, label: c }))}
                  onChange={(v) => set({ displayColumns: v })}
                />
                <p className={HINT}>
                  Không bắt buộc. Trường giá trị dùng để <b>so sánh</b> khi gọi API; trường hiển thị chỉ để <b>nhận biết</b> khi cấp tài khoản
                  (danh sách chọn hiện thành các cột, tìm được theo cả tên). Trường đầu tiên hiện kèm mã trên ô đã chọn, VD <i>01 – Hà Nội</i>.
                </p>
              </div>
              <p className="text-[12px] text-[#64748B]">
                {isDb && 'Thứ tự chọn: Loại → CSDL đích → Bảng → Trường. '}Đổi lựa chọn phía trước sẽ xóa các lựa chọn phía sau.
              </p>
              {preview.length > 0 && (
                <div>
                  <p className="text-[12px] font-semibold text-[#475569] mb-1">Xem trước danh sách chọn ở tài khoản API</p>
                  <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
                    <table className="w-full border-collapse text-[12px]">
                      <thead className="bg-[#F8FAFC]">
                        <tr>{[d.sourceColumn, ...(d.displayColumns || [])].map((c) => <th key={c} className="px-3 py-1.5 text-left font-semibold text-[#475569]">{c}</th>)}</tr>
                      </thead>
                      <tbody>
                        {preview.map((p) => (
                          <tr key={p.value} className="border-t border-[#E2E8F0]">
                            <td className="px-3 py-1.5 text-[#020817] font-medium">{p.value}</td>
                            {p.extra.map((x, i) => <td key={i} className="px-3 py-1.5 text-[#334155]">{x || '–'}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-[13px] text-[#475569]">
              Không cần cấu hình nguồn. Khi cấp tài khoản API, cán bộ gõ trực tiếp từng giá trị rồi nhấn Enter.
            </div>
          )}

          <div className="md:w-1/2">
            <label className={LABEL_CLS}>Trạng thái</label>
            <select
              aria-label="Trạng thái"
              className={`${INPUT_CLS} cursor-pointer`}
              value={d.status}
              onChange={(e) => set({ status: e.target.value as ScopeDimension['status'] })}
            >
              <option>Hoạt động</option>
              <option>Ngừng hoạt động</option>
            </select>
            {usedBy.length > 0 && <p className={HINT}>Đang dùng ở: {usedBy.join(', ')}.</p>}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#E2E8F0] flex justify-end gap-3 bg-[#F8FAFC]">
          <button type="button" onClick={onClose} className={BTN_OUTLINE}>Hủy bỏ</button>
          <button type="button" onClick={handleSave} className={BTN_PRIMARY}>
            <Check className="w-4 h-4" />
            {isNew ? 'Thêm mới' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmDeactivate}
        onClose={() => setConfirmDeactivate(false)}
        onConfirm={() => { setConfirmDeactivate(false); onSave(buildResult()); }}
        title="Ngừng hoạt động chiều đang được sử dụng?"
        type="info"
        confirmText="Xác nhận"
        cancelText="Hủy bỏ"
        message={
          <div>
            Chiều <b>{d.code}</b> đang được dùng ở: <b>{usedBy.join(', ')}</b>. Các API này <b>vẫn tiếp tục lọc</b> theo giá trị đã cấp cho tài khoản;
            chiều sẽ không được chọn cho API mới. Tiếp tục?
          </div>
        }
      />
    </div>,
    document.body
  );
}
