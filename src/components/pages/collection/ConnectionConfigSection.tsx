import { useRef, useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp, Upload, Info, Eye, Plus, Trash2, Database, Ban, FileText } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';
import {
  INPUT_CLS, LABEL_CLS, REQUIRED_MARK, GROUP_TITLE, BTN_OUTLINE, BTN_FOCUS, TOOLTIP_CLS, RowIconAction,
} from './collectionUi';

interface ConnectionConfigSectionProps {
  dataClassification?: string;
  resetTestState: () => void;
  isEdit?: boolean;
  testState?: 'idle' | 'testing_connection' | 'connection_error' | 'testing_data' | 'data_error' | 'success';
  handleTestConnection?: () => void;
  mockMode?: 'success' | 'err_conn' | 'err_data';
  setMockMode?: (mode: 'success' | 'err_conn' | 'err_data') => void;
  connectionType?: string;
  setConnectionType?: (type: string) => void;
}

interface KeyValueItem {
  id: string;
  key: string;
  value: string;
}

// --- Kiểu dùng chung trong tab (compomennt.md 5.1, 5.2, 5.3, 5.9, 5.12) ---
const HINT = 'mt-1 text-[12px] text-[#64748B]';
const TEXTAREA_CLS = INPUT_CLS.replace('h-10', 'py-2 min-h-[120px] resize-y font-mono');
// Thẻ phụ trong form: cùng màu với Tabs 5.9, thu gọn chiều cao/chữ cho vùng cấu hình yêu cầu
const subTabClass = (active: boolean) =>
  `h-10 px-3 inline-flex items-center gap-1.5 text-[13px] font-semibold border-b-2 -mb-px transition-colors ${BTN_FOCUS} ${active ? 'border-blue-600 text-blue-600' : 'border-transparent text-[#64748B] hover:text-[#020817]'}`;
// Bảng trong form (5.3): tiêu đề 42px 13px/700 nền #F8FAFC, hàng 48px kẻ #E0E0E0
const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';

const newRow = (key = '', value = ''): KeyValueItem => ({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, key, value });

/** Nhãn trường (5.2): 13px/500 đen, dấu * đỏ khi bắt buộc */
const FieldLabel = ({ htmlFor, children, required }: { htmlFor?: string; children: ReactNode; required?: boolean }) => (
  <label htmlFor={htmlFor} className={LABEL_CLS}>
    {children} {required && <span className={REQUIRED_MARK}>*</span>}
  </label>
);

/** Icon (i) có tooltip giải thích */
const InfoTip = ({ text }: { text: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button type="button" aria-label={text} className={`inline-flex text-[#64748B] hover:text-[#020817] rounded ${BTN_FOCUS}`}>
        <Info className="w-4 h-4" />
      </button>
    </TooltipTrigger>
    <TooltipContent side="top" sideOffset={4} className={TOOLTIP_CLS}>{text}</TooltipContent>
  </Tooltip>
);

/** Toggle / Switch (5.12): 36×20, bật nền #155DFC, tắt nền #CBD5E1 */
const ToggleRow = ({ label, tip, checked, onChange }: { label: string; tip: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center gap-2">
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 shrink-0 rounded-full transition-colors ${BTN_FOCUS} ${checked ? 'bg-blue-600' : 'bg-[#CBD5E1]'}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${checked ? 'left-[18px]' : 'left-0.5'}`} />
    </button>
    <span className="text-[13px] font-semibold text-[#020817] select-none cursor-pointer" onClick={() => onChange(!checked)}>{label}</span>
    <InfoTip text={tip} />
  </div>
);

/** Thẻ lựa chọn (radio dạng thẻ): đang chọn nền #EAF3FF viền #155DFC */
function OptionCards<T extends string>({ label, required, value, onChange, options }: {
  label: string; required?: boolean; value: T; onChange: (v: T) => void;
  options: { value: T; title: string; desc: string; icon?: ReactNode }[];
}) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <div role="radiogroup" aria-label={label} className="grid grid-cols-2 gap-3">
        {options.map((o) => {
          const on = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(o.value)}
              className={`text-left px-4 py-3 rounded-lg border transition-colors ${BTN_FOCUS} ${on ? 'bg-[#EAF3FF] border-blue-600' : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#94A3B8]'}`}
            >
              <span className={`flex items-center gap-1.5 text-[13px] font-semibold ${on ? 'text-blue-600' : 'text-[#020817]'}`}>{o.icon}{o.title}</span>
              <span className="block mt-0.5 text-[12px] text-[#64748B]">{o.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Bảng Key – Value (Params / Headers / form-data) */
const KeyValueTable = ({ rows, onChange, keyPlaceholder = 'Key', valuePlaceholder = 'Value' }: {
  rows: KeyValueItem[]; onChange: (rows: KeyValueItem[]) => void; keyPlaceholder?: string; valuePlaceholder?: string;
}) => {
  const update = (id: string, field: 'key' | 'value', v: string) => onChange(rows.map((r) => (r.id === id ? { ...r, [field]: v } : r)));
  return (
    <div>
      <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
        <table className="w-full border-collapse text-[13px]">
          <thead className="bg-[#F8FAFC]">
            <tr className="h-[42px]">
              <th className={`${TH} text-center w-14`}>STT</th>
              <th className={`${TH} text-left`}>Key</th>
              <th className={`${TH} text-left`}>Value</th>
              <th className={`${TH} text-center w-20`}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} className="h-12 bg-white border-t border-[#E0E0E0]">
                <td className={`${TD} text-center`}>{i + 1}</td>
                <td className={TD}><input aria-label={`Key dòng ${i + 1}`} value={r.key} onChange={(e) => update(r.id, 'key', e.target.value)} className={INPUT_CLS} placeholder={keyPlaceholder} /></td>
                <td className={TD}><input aria-label={`Value dòng ${i + 1}`} value={r.value} onChange={(e) => update(r.id, 'value', e.target.value)} className={INPUT_CLS} placeholder={valuePlaceholder} /></td>
                <td className={`${TD} text-center`}>
                  <RowIconAction label="Xóa" onClick={() => onChange(rows.filter((x) => x.id !== r.id))}>
                    <Trash2 className="w-4 h-4" />
                  </RowIconAction>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr className="border-t border-[#E0E0E0]">
                <td colSpan={4} className="px-3 py-4 text-center text-[13px] text-[#64748B]">Chưa có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-2">
        <button type="button" onClick={() => onChange([...rows, newRow()])} className={BTN_OUTLINE}>
          <Plus className="w-4 h-4" /> Thêm mới
        </button>
      </div>
    </div>
  );
};

type RequestTab = 'params' | 'auth' | 'headers' | 'body';
type BodyMode = 'raw' | 'form-data' | 'urlencoded';

/** Cấu hình 1 yêu cầu API: Method + URL + thẻ Params / Authorization / Headers / Body */
const RequestEditor = ({ idPrefix, label, urlPlaceholder }: { idPrefix: string; label: string; urlPlaceholder: string }) => {
  const [method, setMethod] = useState('POST');
  const [tab, setTab] = useState<RequestTab>('params');
  const [params, setParams] = useState<KeyValueItem[]>([newRow()]);
  const [headers, setHeaders] = useState<KeyValueItem[]>([newRow('Content-Type', 'application/json')]);
  const [authorization, setAuthorization] = useState('No Authen');
  const [authExpanded, setAuthExpanded] = useState(true);
  const [bodyMode, setBodyMode] = useState<BodyMode>('raw');
  const [bodyRaw, setBodyRaw] = useState('');
  const [bodyFields, setBodyFields] = useState<KeyValueItem[]>([newRow()]);
  const [jsonError, setJsonError] = useState('');

  const headerCount = headers.filter((h) => h.key.trim()).length;
  const tabs: { id: RequestTab; label: string; count?: number }[] = [
    { id: 'params', label: 'Params' },
    { id: 'auth', label: 'Authorization' },
    { id: 'headers', label: 'Headers', count: headerCount },
    { id: 'body', label: 'Body' },
  ];

  const formatJson = () => {
    try {
      setBodyRaw(JSON.stringify(JSON.parse(bodyRaw), null, 2));
      setJsonError('');
    } catch {
      setJsonError('Nội dung không đúng định dạng JSON');
    }
  };

  return (
    <div>
      <FieldLabel htmlFor={`${idPrefix}-url`} required>{label}</FieldLabel>
      <div className="flex gap-2">
        <select aria-label="Method" value={method} onChange={(e) => setMethod(e.target.value)} className={`${INPUT_CLS} !w-28 shrink-0 font-semibold`}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
        <input id={`${idPrefix}-url`} type="text" className={INPUT_CLS} placeholder={urlPlaceholder} />
      </div>

      <div role="tablist" aria-label="Cấu hình yêu cầu" className="mt-3 flex border-b border-[#E2E8F0]">
        {tabs.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={subTabClass(tab === t.id)}>
            {t.label}
            {!!t.count && <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#F1F5F9] text-[#475569] text-[11px] font-semibold inline-flex items-center justify-center">{t.count}</span>}
          </button>
        ))}
      </div>

      <div className="pt-3">
        {tab === 'params' && <KeyValueTable rows={params} onChange={setParams} />}

        {tab === 'headers' && <KeyValueTable rows={headers} onChange={setHeaders} />}

        {tab === 'auth' && (
          <div className="space-y-3">
            <select
              aria-label="Authorization"
              value={authorization}
              onChange={(e) => { setAuthorization(e.target.value); setAuthExpanded(true); }}
              className={INPUT_CLS}
            >
              <option value="No Authen">No Authen</option>
              <option value="Basic Authen">Basic Authen</option>
              <option value="Bearer Token">Bearer Token</option>
            </select>
            {authorization !== 'No Authen' && (
              <div>
                <button
                  type="button"
                  aria-expanded={authExpanded}
                  onClick={() => setAuthExpanded(!authExpanded)}
                  className={`inline-flex items-center gap-1 text-[13px] font-medium text-[#020817] rounded ${BTN_FOCUS}`}
                >
                  Thông tin mở rộng {authExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {authExpanded && (
                  <div className="mt-2 p-4 border border-[#E2E8F0] rounded-lg">
                    {authorization === 'Basic Authen' ? (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <FieldLabel htmlFor={`${idPrefix}-user`}>Tài khoản</FieldLabel>
                          <input id={`${idPrefix}-user`} type="text" className={INPUT_CLS} placeholder="Tài khoản" />
                        </div>
                        <div>
                          <FieldLabel htmlFor={`${idPrefix}-pass`}>Mật khẩu</FieldLabel>
                          <input id={`${idPrefix}-pass`} type="password" className={INPUT_CLS} placeholder="Mật khẩu" />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <FieldLabel htmlFor={`${idPrefix}-token`}>Nhập token</FieldLabel>
                        <input id={`${idPrefix}-token`} type="text" className={INPUT_CLS} placeholder="Nhập token" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {tab === 'body' && (
          <div className="space-y-2">
            <div role="radiogroup" aria-label="Kiểu Body" className="flex items-center gap-5">
              {([['raw', 'raw (JSON)'], ['form-data', 'form-data'], ['urlencoded', 'x-www-form-urlencoded']] as [BodyMode, string][]).map(([v, l]) => (
                <label key={v} className="inline-flex items-center gap-2 text-[13px] text-[#020817] cursor-pointer">
                  <input type="radio" name={`${idPrefix}-body-mode`} checked={bodyMode === v} onChange={() => setBodyMode(v)} className="w-4 h-4 accent-blue-600 cursor-pointer" />
                  {l}
                </label>
              ))}
            </div>
            {bodyMode === 'raw' ? (
              <div>
                <div className="flex justify-end mb-1">
                  <button type="button" onClick={formatJson} disabled={!bodyRaw.trim()} className={`h-8 px-3 inline-flex items-center rounded-lg text-[13px] font-medium text-blue-600 hover:bg-[#EAF3FF] disabled:text-[#94A3B8] disabled:hover:bg-transparent disabled:cursor-not-allowed ${BTN_FOCUS}`}>
                    Định dạng JSON
                  </button>
                </div>
                <textarea
                  aria-label="Body (JSON)"
                  value={bodyRaw}
                  onChange={(e) => { setBodyRaw(e.target.value); setJsonError(''); }}
                  rows={5}
                  className={`${TEXTAREA_CLS} ${jsonError ? '!border-[#DC2626]' : ''}`}
                  placeholder="Body (JSON)"
                />
                {jsonError && <p className="mt-1 text-[12px] text-[#DC2626]">{jsonError}</p>}
              </div>
            ) : (
              <KeyValueTable rows={bodyFields} onChange={setBodyFields} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

type CollectMode = 'once' | 'sync';
type ApiTarget = 'data' | 'deleted';

/** Phương thức API: theo mockup PM (07/10/2026) — Kéo 1 lần / Theo mẫu (đồng bộ) */
const ApiConnectionForm = () => {
  const [collectMode, setCollectMode] = useState<CollectMode>('once');
  const [apiTarget, setApiTarget] = useState<ApiTarget>('data');
  const [paramGroup, setParamGroup] = useState('');
  const [splitNested, setSplitNested] = useState(false);
  const [syncDelete, setSyncDelete] = useState(false);
  const [pullMode, setPullMode] = useState('SEQUENTIAL');
  const isSync = collectMode === 'sync';
  const showDeleted = isSync && apiTarget === 'deleted';

  return (
    <div className="space-y-4">
      <OptionCards<CollectMode>
        label="Loại thu thập"
        required
        value={collectMode}
        onChange={setCollectMode}
        options={[
          { value: 'once', title: 'Kéo 1 lần', desc: 'Gọi 1 lần, không phân trang' },
          { value: 'sync', title: 'Theo mẫu (đồng bộ)', desc: 'Full-load phân trang + delta' },
        ]}
      />

      <div>
        <FieldLabel htmlFor="conn-param-group">Nhóm tham số</FieldLabel>
        <div className="flex gap-2">
          <select id="conn-param-group" value={paramGroup} onChange={(e) => setParamGroup(e.target.value)} className={`${INPUT_CLS} ${paramGroup ? '' : '!text-[#94A3B8]'}`}>
            <option value="">— Chọn nhóm tham số —</option>
            <option value="sync-date" className="text-[#020817]">Nhóm tham số ngày đồng bộ</option>
            <option value="auth" className="text-[#020817]">Nhóm tham số xác thực</option>
          </select>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex">
                <button
                  type="button"
                  aria-label="Xem nhóm tham số"
                  disabled={!paramGroup}
                  className={`w-10 h-10 shrink-0 inline-flex items-center justify-center rounded-lg border border-[#CBD5E1] bg-white text-[#475569] hover:bg-[#F8FAFC] hover:text-[#020817] transition-colors ${BTN_FOCUS} disabled:bg-[#F1F5F9] disabled:border-[#E2E8F0] disabled:text-[#94A3B8] disabled:cursor-not-allowed`}
                >
                  <Eye className="w-5 h-5" />
                </button>
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={4} className={TOOLTIP_CLS}>{paramGroup ? 'Xem nhóm tham số' : 'Chọn nhóm tham số để xem'}</TooltipContent>
          </Tooltip>
        </div>
        <p className={HINT}>Chọn nhóm rồi dùng nút "+ tham số" để chèn biến vào URL/Body/Token/Headers.</p>
      </div>

      {isSync && (
        <OptionCards<ApiTarget>
          label="Cấu hình cho API nào?"
          value={apiTarget}
          onChange={setApiTarget}
          options={[
            { value: 'data', title: 'API dữ liệu', desc: 'Full + Cập nhật (thêm/sửa) — có phân trang', icon: <Database className="w-4 h-4" /> },
            { value: 'deleted', title: 'API danh sách xóa', desc: 'Chỉ trả khóa bị xóa', icon: <Ban className="w-4 h-4" /> },
          ]}
        />
      )}

      {/* Giữ cả 2 yêu cầu trong DOM để không mất dữ liệu đã nhập khi chuyển qua lại */}
      <div className={showDeleted ? 'hidden' : ''}>
        <RequestEditor idPrefix="conn-api-data" label="Yêu cầu" urlPlaceholder="URL" />
      </div>
      {isSync && (
        <div className={showDeleted ? '' : 'hidden'}>
          <RequestEditor idPrefix="conn-api-deleted" label="Yêu cầu (API danh sách xóa)" urlPlaceholder="VD: https://.../deleted" />
        </div>
      )}

      {showDeleted ? (
        <div>
          <FieldLabel htmlFor="conn-deleted-path" required>Đường dẫn khóa bị xóa (deleted path)</FieldLabel>
          <input id="conn-deleted-path" type="text" className={INPUT_CLS} placeholder="VD: data.deletedIds" />
        </div>
      ) : (
        <>
          <div>
            <FieldLabel htmlFor="conn-data-path" required={isSync}>Đường dẫn dữ liệu (data path)</FieldLabel>
            <input
              id="conn-data-path"
              type="text"
              className={INPUT_CLS}
              placeholder={isSync ? 'VD: data.items — trỏ mảng bản ghi cần phân trang' : 'VD: data.items (để trống nếu response là mảng gốc)'}
            />
          </div>

          <div className="space-y-3 pt-1">
            <ToggleRow label="Tách bảng con từ mảng lồng" tip="Tách bảng con từ các mảng lồng nhau trong dữ liệu nhận được" checked={splitNested} onChange={setSplitNested} />
            {!isSync && (
              <ToggleRow label="Đồng bộ xóa theo khóa" tip="Xóa bản ghi tại kho khi khóa không còn trong dữ liệu nguồn" checked={syncDelete} onChange={setSyncDelete} />
            )}
          </div>

          {isSync && (
            <>
              <div>
                <FieldLabel htmlFor="conn-date-format">Định dạng ngày (fromDate / toDate)</FieldLabel>
                <input id="conn-date-format" type="text" className={INPUT_CLS} defaultValue="yyyy-MM-dd'T'HH:mm:ss" />
                <p className={HINT}>Mặc định theo định dạng chốt; chỉ đổi khi nguồn yêu cầu định dạng khác.</p>
              </div>

              <div>
                <p className={`${GROUP_TITLE} mb-2`}>Phân trang gửi nguồn</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel htmlFor="conn-page-start">Trang bắt đầu (page khởi tạo)</FieldLabel>
                    <input id="conn-page-start" type="number" min={0} className={INPUT_CLS} defaultValue={0} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="conn-page-size">Kích thước trang (pageSize)</FieldLabel>
                    <input id="conn-page-size" type="number" min={1} className={INPUT_CLS} defaultValue={1000} />
                  </div>
                </div>
              </div>

              <div>
                <p className={`${GROUP_TITLE} mb-2`}>Vị trí phân trang trong response <span className={REQUIRED_MARK}>*</span></p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel htmlFor="conn-total-pages">Đường dẫn totalPages</FieldLabel>
                    <input id="conn-total-pages" type="text" className={INPUT_CLS} placeholder="VD: pagination.totalPages" />
                  </div>
                  <div>
                    <FieldLabel htmlFor="conn-total-elements">Đường dẫn totalElements</FieldLabel>
                    <input id="conn-total-elements" type="text" className={INPUT_CLS} placeholder="VD: pagination.totalElements" />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0]">
                <p className={`${GROUP_TITLE} mb-2`}>Hiệu năng & điều tiết</p>
                <div className="grid grid-cols-[160px_1fr_1fr] items-center gap-3">
                  <label htmlFor="conn-pull-mode" className="text-[13px] font-semibold text-[#020817]">Chế độ kéo / Số luồng</label>
                  <select id="conn-pull-mode" value={pullMode} onChange={(e) => setPullMode(e.target.value)} className={INPUT_CLS}>
                    <option value="SEQUENTIAL">SEQUENTIAL</option>
                    <option value="PARALLEL">PARALLEL</option>
                  </select>
                  <input
                    aria-label="Số luồng"
                    type="number"
                    min={1}
                    key={pullMode}
                    defaultValue={pullMode === 'SEQUENTIAL' ? 1 : 4}
                    disabled={pullMode === 'SEQUENTIAL'}
                    className={INPUT_CLS}
                  />
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

/** Ô chọn tệp (5.13): bấm để chọn; có tệp → hiển thị tên + nút Xóa */
const FileDropzone = ({ id, accept, title, hint }: { id: string; accept: string; title: string; hint?: string }) => {
  const [fileName, setFileName] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
      />
      {fileName ? (
        <div className="flex items-center gap-3 px-4 h-14 border border-[#E2E8F0] rounded-lg bg-white">
          <FileText className="w-5 h-5 text-blue-600 shrink-0" />
          <span className="flex-1 min-w-0 truncate text-[13px] text-[#020817]">{fileName}</span>
          <RowIconAction label="Xóa tệp" onClick={() => { setFileName(''); if (inputRef.current) inputRef.current.value = ''; }}>
            <Trash2 className="w-4 h-4" />
          </RowIconAction>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`w-full py-8 flex flex-col items-center justify-center gap-2 border border-[#CBD5E1] border-dashed bg-[#F8FAFC] rounded-lg hover:border-blue-600 hover:bg-[#EAF3FF]/40 transition-colors ${BTN_FOCUS}`}
        >
          <Upload className="w-7 h-7 text-[#64748B]" />
          <span className="text-[13px] font-medium text-[#020817]">{title}</span>
          {hint && <span className="text-[12px] text-[#64748B]">{hint}</span>}
        </button>
      )}
    </div>
  );
};

/** Checkbox (5.12) + nhãn, tùy chọn icon (i) */
const CheckRow = ({ label, tip, checked, onChange }: { label: string; tip?: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center gap-2">
    <label className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#020817] cursor-pointer select-none">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 rounded accent-blue-600 cursor-pointer" />
      {label}
    </label>
    {tip && <InfoTip text={tip} />}
  </div>
);

/** API nhận (JSON / XML): dữ liệu mẫu (tải file hoặc nhập raw) — theo mockup PM 07/10/2026 */
const ReceiveApiForm = ({ format }: { format: 'JSON' | 'XML' }) => {
  const [source, setSource] = useState<'file' | 'raw'>('file');
  const [raw, setRaw] = useState('');
  const [rawError, setRawError] = useState('');
  const [splitNested, setSplitNested] = useState(false);
  const [sharedCategory, setSharedCategory] = useState(false);
  const isJson = format === 'JSON';
  const prefix = `conn-recv-${format.toLowerCase()}`;

  const formatRaw = () => {
    if (!isJson) return;
    try {
      setRaw(JSON.stringify(JSON.parse(raw), null, 2));
      setRawError('');
    } catch {
      setRawError('Nội dung không đúng định dạng JSON');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel required>Dữ liệu {format} mẫu</FieldLabel>
        <div role="radiogroup" aria-label={`Dữ liệu ${format} mẫu`} className="flex items-center gap-5 mb-3">
          {([['file', `Tải lên file ${format}`], ['raw', `Nhập raw ${format}`]] as ['file' | 'raw', string][]).map(([v, l]) => (
            <label key={v} className="inline-flex items-center gap-2 text-[13px] text-[#020817] cursor-pointer">
              <input type="radio" name={`${prefix}-source`} checked={source === v} onChange={() => setSource(v)} className="w-4 h-4 accent-blue-600 cursor-pointer" />
              {l}
            </label>
          ))}
        </div>
        {source === 'file' ? (
          <FileDropzone
            id={`${prefix}-file`}
            accept={isJson ? '.json,application/json' : '.xml,text/xml,application/xml'}
            title={`Click để chọn file ${format} mẫu`}
            hint={isJson ? 'File phải chứa mảng data[] và object duLieuTiepNhan' : undefined}
          />
        ) : (
          <div>
            {isJson && (
              <div className="flex justify-end mb-1">
                <button type="button" onClick={formatRaw} disabled={!raw.trim()} className={`h-8 px-3 inline-flex items-center rounded-lg text-[13px] font-medium text-blue-600 hover:bg-[#EAF3FF] disabled:text-[#94A3B8] disabled:hover:bg-transparent disabled:cursor-not-allowed ${BTN_FOCUS}`}>
                  Định dạng JSON
                </button>
              </div>
            )}
            <textarea
              aria-label={`Nhập raw ${format}`}
              value={raw}
              onChange={(e) => { setRaw(e.target.value); setRawError(''); }}
              rows={8}
              className={`${TEXTAREA_CLS} ${rawError ? '!border-[#DC2626]' : ''}`}
              placeholder={isJson ? 'File phải chứa mảng data[] và object duLieuTiepNhan' : `Nhập nội dung ${format} mẫu`}
            />
            {rawError && <p className="mt-1 text-[12px] text-[#DC2626]">{rawError}</p>}
          </div>
        )}
      </div>

      <div className="space-y-3 pt-1">
        <CheckRow label="Tách bảng con từ mảng lồng" tip="Tách bảng con từ các mảng lồng nhau trong dữ liệu nhận được" checked={splitNested} onChange={setSplitNested} />
        {!isJson && <CheckRow label="Danh mục dùng chung" checked={sharedCategory} onChange={setSharedCategory} />}
      </div>
    </div>
  );
};

export function ConnectionConfigSection({ resetTestState, isEdit = false, connectionType: connectionTypeProp, setConnectionType: setConnectionTypeProp }: ConnectionConfigSectionProps) {
  // Cho phép dùng không kiểm soát (VD modal Cung cấp dịch vụ không truyền connectionType)
  const [localType, setLocalType] = useState('API');
  const connectionType = connectionTypeProp ?? localType;
  const setConnectionType = setConnectionTypeProp ?? setLocalType;

  return (
    <div className="space-y-4" onChange={resetTestState}>
      {/* Phương thức kết nối */}
      <div>
        <FieldLabel htmlFor="conn-type" required>Phương thức kết nối</FieldLabel>
        <select
          id="conn-type"
          title="Phương thức kết nối"
          className={INPUT_CLS}
          value={connectionType}
          onChange={(e) => setConnectionType(e.target.value)}
          disabled={isEdit}
        >
          <option value="API">API</option>
          <option value="API_RECEIVE_JSON">API nhận (JSON)</option>
          <option value="DB">Cơ sở dữ liệu</option>
          <option value="FILE">Tải file</option>
          <option value="API_RECEIVE_XML">API nhận (XML)</option>
        </select>
      </div>

      {connectionType === 'API' && <ApiConnectionForm />}

      {connectionType === 'API_RECEIVE_JSON' && <ReceiveApiForm key="json" format="JSON" />}
      {connectionType === 'API_RECEIVE_XML' && <ReceiveApiForm key="xml" format="XML" />}

      {connectionType === 'FILE' && (
        <div>
          <FieldLabel htmlFor="conn-file-upload" required>Tập tin tải lên</FieldLabel>
          <FileDropzone id="conn-file-upload" accept=".csv,.xls,.xlsx" title="Click để chọn file CSV, XLS, XLSX" />
        </div>
      )}

      {connectionType === 'DB' && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          <div>
            <FieldLabel htmlFor="conn-db-name" required>Tên CSDL</FieldLabel>
            <input id="conn-db-name" type="text" className={INPUT_CLS} placeholder="Tên CSDL" />
          </div>
          <div>
            <FieldLabel htmlFor="conn-db-origin" required>Tên CSDL gốc</FieldLabel>
            <input id="conn-db-origin" type="text" className={INPUT_CLS} placeholder="Tên CSDL gốc" />
          </div>
          <div>
            <FieldLabel htmlFor="conn-db-type" required>Kiểu CSDL</FieldLabel>
            <select id="conn-db-type" className={INPUT_CLS} defaultValue="DBT_ORACLE_10g">
              <option value="DBT_ORACLE_10g">DBT_ORACLE_10g</option>
              <option value="POSTGRESQL">PostgreSql</option>
              <option value="MYSQL">MySql</option>
              <option value="SQLSERVER">SQL Server</option>
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="conn-db-agent" required>Trạm kết nối</FieldLabel>
            <select id="conn-db-agent" className={INPUT_CLS}>
              <option value="">Chọn Trạm kết nối</option>
              <option value="agent1">Trạm kết nối 1</option>
              <option value="agent2">Trạm kết nối 2</option>
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="conn-db-worker" required>Máy chủ thực thi</FieldLabel>
            <select id="conn-db-worker" className={INPUT_CLS}>
              <option value="">Chọn Máy chủ thực thi</option>
              <option value="worker1">Máy chủ thực thi 1</option>
              <option value="worker2">Máy chủ thực thi 2</option>
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="conn-db-host" required>Địa chỉ CSDL</FieldLabel>
            <input id="conn-db-host" type="text" className={INPUT_CLS} placeholder="Địa chỉ CSDL" />
          </div>
          <div>
            <FieldLabel htmlFor="conn-db-port" required>Cổng kết nối</FieldLabel>
            <input id="conn-db-port" type="text" className={INPUT_CLS} placeholder="Cổng kết nối" />
          </div>
          <div>
            <FieldLabel htmlFor="conn-db-user" required>Tài khoản</FieldLabel>
            <input id="conn-db-user" type="text" className={INPUT_CLS} placeholder="Tài khoản" />
          </div>
          <div>
            <FieldLabel htmlFor="conn-db-pass" required>Mật khẩu</FieldLabel>
            <input id="conn-db-pass" type="password" className={INPUT_CLS} placeholder="Mật khẩu" />
          </div>
        </div>
      )}
    </div>
  );
}
