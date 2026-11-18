// Khối "Trường phân vùng dữ liệu" ở tab Thiết kế cấu trúc gói tin (Bước 3) của popup dịch vụ (log 261)
// BR06: có khai báo ⇒ luôn áp dụng phạm vi · BR07: chiều + cột của bảng đã cấu hình, mỗi chiều 1 lần, nhiều dòng = VÀ
import { Filter, Plus, Trash2, Info, AlertTriangle, Lock } from 'lucide-react';
import { Badge, RowIconAction, SearchableSelect, BTN_OUTLINE } from '../../collection/collectionUi';
import { type ScopeField, DEFAULT_ACCOUNT_SCOPES, useScopeDimensions } from './scopeData';

const TH = 'px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px]';

/** Tài khoản đang được cấp quyền API này (đọc từ danh sách tài khoản của màn Quản lý API) */
const accountsOfService = (serviceName: string): any[] => {
  try {
    const list = JSON.parse(localStorage.getItem('provision_accounts') || '[]');
    return Array.isArray(list) ? list.filter((a: any) => a.apiName === serviceName) : [];
  } catch { return []; }
};

export function ScopeFieldSection({ value, onChange, tables, schema, apiFields, serviceName, readOnly, showErrors, sqlMode, sqlQuery, initial }: {
  value: ScopeField[];
  onChange: (v: ScopeField[]) => void;
  /** Bảng chính + bảng liên kết đã cấu hình ở trên */
  tables: string[];
  schema: Record<string, string[]>;
  /** Trường chia sẻ: dùng để suy ra tham số đầu vào (Tên trường API) */
  apiFields: { sourceTable?: string; sourceColumn?: string; name: string }[];
  serviceName: string;
  readOnly?: boolean;
  showErrors?: boolean;
  sqlMode?: boolean;
  sqlQuery?: string;
  /** Cấu hình đã lưu — để chỉ cảnh báo khi có thay đổi */
  initial: ScopeField[];
}) {
  const dims = useScopeDimensions();
  const used = value.map((f) => f.dimension);
  const activeDims = dims.filter((d) => d.status === 'Hoạt động');
  const colOptions = tables.flatMap((t) => (schema[t] || []).map((c) => ({ value: `${t}::${c}`, label: t === tables[0] ? c : `${c} (${t})` })));
  const update = (i: number, patch: Partial<ScopeField>) => onChange(value.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));

  // Cảnh báo: chiều MỚI thêm mà tài khoản đang có quyền chưa khai giá trị → sẽ bị 403 sau khi lưu
  const initialDims = initial.map((f) => f.dimension);
  const impacted = value.filter((f) => f.dimension && !initialDims.includes(f.dimension)).flatMap((f) => accountsOfService(serviceName)
    .filter((a) => !((a.scopeValues ?? DEFAULT_ACCOUNT_SCOPES[a.id] ?? {})[f.dimension] || []).length)
    .map((a) => `${a.username} (thiếu ${dims.find((d) => d.code === f.dimension)?.name ?? f.dimension})`));
  const sqlMissing = sqlMode && sqlQuery && !/select\s+\*/i.test(sqlQuery)
    ? value.filter((f) => f.column && !new RegExp(`\\b${f.column}\\b`, 'i').test(sqlQuery)).map((f) => f.column) : [];

  return (
    <section className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
      <div className="flex justify-between items-center gap-4 px-4 py-3 border-b border-[#E2E8F0]">
        <h4 className="text-[14px] font-medium text-[#020817] flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          Trường phân vùng dữ liệu
        </h4>
        {!readOnly && (
          <button
            type="button"
            className={BTN_OUTLINE}
            disabled={used.length >= activeDims.length}
            onClick={() => onChange([...value, { dimension: '', table: '', column: '' }])}
          >
            <Plus className="w-4 h-4" /> Thêm trường phân vùng
          </button>
        )}
      </div>
      <div className="p-4 space-y-3">
        <div className="flex gap-2 items-start rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-2 text-[13px] text-[#1E40AF]">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            Chọn <b>chiều phạm vi</b> (từ tab Danh mục chiều phạm vi ở màn Quản lý API) và <b>cột dữ liệu</b> tương ứng của bảng đã cấu hình ở trên.{' '}
            <b>Có khai báo thì API luôn áp dụng phạm vi</b> theo tài khoản gọi; nhiều dòng kết hợp theo điều kiện <b>VÀ</b>. Không khai báo thì API không lọc.
          </div>
        </div>
        {!readOnly && impacted.length > 0 && (
          <div className="flex gap-2 items-start rounded-lg border border-[#FED7AA] bg-[#FFF7ED] px-3 py-2 text-[13px] text-[#9A3412]">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <div>Sau khi lưu, <b>{impacted.length}</b> tài khoản đang được cấp quyền API này sẽ bị từ chối (403) vì chưa khai giá trị: {impacted.join('; ')}. Cập nhật phạm vi ở tab Danh sách tài khoản.</div>
          </div>
        )}
        {sqlMissing.length > 0 && (
          <div className="flex gap-2 items-start rounded-lg border border-[#FEE2E2] bg-[#FEF2F2] px-3 py-2 text-[13px] text-[#B91C1C]">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <div>Câu lệnh SQL tùy chỉnh chưa có cột phân vùng trong danh sách SELECT: <b>{sqlMissing.join(', ')}</b>. Bổ sung cột trước khi lưu.</div>
          </div>
        )}
        <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
          <table className="w-full border-collapse text-[13px] table-fixed">
            <thead className="bg-[#F8FAFC]">
              <tr className="h-[42px]">
                <th className={`${TH} text-center w-14`}>STT</th>
                <th className={`${TH} w-[32%]`}>Chiều phạm vi <span className="text-[#DC2626]">*</span></th>
                <th className={`${TH} w-[30%]`}>Cột dữ liệu <span className="text-[#DC2626]">*</span></th>
                <th className={TH}>Tham số đầu vào</th>
                {!readOnly && <th className={`${TH} text-center w-16`}>Xóa</th>}
              </tr>
            </thead>
            <tbody>
              {value.length === 0 ? (
                <tr>
                  <td colSpan={readOnly ? 4 : 5} className="py-8 text-center text-[13px] text-[#64748B]">
                    Chưa khai báo trường phân vùng → API này không lọc theo phạm vi.
                  </td>
                </tr>
              ) : value.map((f, i) => {
                const d = dims.find((x) => x.code === f.dimension);
                const param = f.column ? apiFields.find((a) => (a.sourceColumn ?? a.name) === f.column && (!a.sourceTable || a.sourceTable === f.table))?.name : undefined;
                const opts = dims
                  .filter((x) => x.status === 'Hoạt động' || x.code === f.dimension)
                  .filter((x) => x.code === f.dimension || !used.includes(x.code))
                  .map((x) => ({ value: x.code, label: `${x.code} – ${x.name}` }));
                const curCol = f.column ? `${f.table}::${f.column}` : '';
                const cols = curCol && !colOptions.some((o) => o.value === curCol) ? [...colOptions, { value: curCol, label: `${f.column} (${f.table})` }] : colOptions;
                return (
                  <tr key={i} className="bg-white border-b border-[#E0E0E0] last:border-b-0 align-top">
                    <td className="px-3 py-3 text-center">{i + 1}</td>
                    <td className="px-3 py-2">
                      <SearchableSelect
                        ariaLabel="Chiều phạm vi"
                        placeholder="-- Chọn chiều --"
                        searchPlaceholder="Tìm mã hoặc tên chiều..."
                        contentClassName="z-[1000000]"
                        disabled={readOnly}
                        value={f.dimension}
                        options={opts}
                        onChange={(v) => update(i, { dimension: v })}
                      />
                      {d && d.status !== 'Hoạt động' && <div className="mt-1"><Badge label="Chiều đã ngừng hoạt động" variant="slate" icon={<Lock className="w-3.5 h-3.5 shrink-0" />} /></div>}
                      {showErrors && !f.dimension && <p className="text-[12px] text-[#DC2626] mt-1">Vui lòng chọn chiều phạm vi.</p>}
                    </td>
                    <td className="px-3 py-2">
                      <SearchableSelect
                        ariaLabel="Cột dữ liệu"
                        placeholder="-- Chọn cột --"
                        searchPlaceholder="Tìm cột dữ liệu..."
                        contentClassName="z-[1000000]"
                        disabled={readOnly}
                        value={curCol}
                        options={cols}
                        onChange={(v) => { const j = v.indexOf('::'); update(i, { table: v.slice(0, j), column: v.slice(j + 2) }); }}
                      />
                      {showErrors && !f.column && <p className="text-[12px] text-[#DC2626] mt-1">Vui lòng chọn cột dữ liệu.</p>}
                    </td>
                    <td className="px-3 py-2">
                      {!f.column ? <span className="leading-10 text-[#94A3B8]">–</span>
                        : param ? (
                          <div className="min-h-10 flex flex-wrap items-center gap-2">
                            <code className="px-2 py-0.5 rounded bg-[#F1F5F9] text-[12px] text-[#020817]">{param}</code>
                            <span className="text-[12px] text-[#64748B]">theo Tên trường (API Field)</span>
                          </div>
                        ) : (
                          <p className="text-[12px] text-[#64748B] py-2">Cột không chia sẻ → client không truyền được; hệ thống tự lọc theo toàn bộ giá trị được cấp.</p>
                        )}
                    </td>
                    {!readOnly && (
                      <td className="px-3 py-2 text-center">
                        <RowIconAction label="Xóa trường phân vùng" onClick={() => onChange(value.filter((_, idx) => idx !== i))}>
                          <Trash2 className="w-4 h-4" />
                        </RowIconAction>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/** Trường phân vùng hợp lệ để lưu: đủ chiều + cột */
export const isScopeFieldsComplete = (v: ScopeField[]) => v.every((f) => f.dimension && f.column);
