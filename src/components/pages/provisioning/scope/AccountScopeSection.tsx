// Khối "Phạm vi dữ liệu" trong popup Tạo/Cập nhật tài khoản API + ô tóm tắt ở danh sách tài khoản (log 261, 246)
// Log 246 (BA): không liệt kê sẵn mọi chiều nữa — chỉ hiện các chiều đã khai, nút "Thêm phạm vi" để thêm từng chiều,
// mỗi dòng có Chỉnh sửa / Xóa. BR05 giữ nguyên: chiều KHÔNG khai = không có quyền với API lọc theo chiều đó (fail-closed).
import { useState } from 'react';
import { Check, Filter, Info, Lock, AlertTriangle, Plus, SquarePen, Trash2 } from 'lucide-react';
import { Badge, RowIconAction, SearchableSelect, BTN_OUTLINE, BTN_PRIMARY, LABEL_CLS, REQUIRED_MARK } from '../../collection/collectionUi';
import { ConfirmModal } from '../../../common/ConfirmModal';
import {
  type AccountScopeValues, type ScopeDimension, dimensionsForAccount, scopeValueOptions, scopeValueLabel, scopeValueText,
  useScopeDimensions, useServiceScopeMap
} from './scopeData';
import { MultiValueSelect, TagValueInput } from './ScopeValueInputs';

const TH = 'px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px]';
const MAX_CHIPS = 3;

/** Ô nhập giá trị theo phương thức của chiều */
function ScopeValueEditor({ d, values, onChange }: { d: ScopeDimension; values: string[]; onChange: (v: string[]) => void }) {
  return d.mode === 'DM' ? (
    <MultiValueSelect
      ariaLabel={`Giá trị ${d.name}`}
      values={values}
      options={scopeValueOptions(d)}
      onChange={onChange}
      // Có trường hiển thị → danh sách dạng bảng (mã + các cột hiển thị), chip "01 – Hà Nội" (log 262)
      columns={d.displayColumns?.length ? [d.sourceColumn || 'Mã', ...d.displayColumns] : undefined}
      chipText={(o) => (o.extra?.[0] ? `${o.value} – ${o.extra[0]}` : o.value)}
    />
  ) : (
    <TagValueInput ariaLabel={`Giá trị ${d.name}`} values={values} onChange={onChange} />
  );
}

export function AccountScopeSection({ value, onChange }: { value: AccountScopeValues; onChange: (v: AccountScopeValues) => void }) {
  const dims = dimensionsForAccount(useScopeDimensions(), useServiceScopeMap());
  // Các chiều đã khai (có ít nhất 1 giá trị), theo thứ tự danh mục
  const rows = dims.filter((d) => (value[d.code] || []).length > 0);
  const available = dims.filter((d) => d.status === 'Hoạt động' && !(value[d.code] || []).length);

  // Form thêm / sửa (hiện ngay trong khối, không mở popup chồng popup)
  const [editor, setEditor] = useState<{ mode: 'add' | 'edit'; code: string; values: string[] } | null>(null);
  const [showErr, setShowErr] = useState(false);
  const [deleteCode, setDeleteCode] = useState<string | null>(null);
  const editorDim = dims.find((d) => d.code === editor?.code);

  const openAdd = () => { setShowErr(false); setEditor({ mode: 'add', code: available.length === 1 ? available[0].code : '', values: [] }); };
  const openEdit = (d: ScopeDimension) => { setShowErr(false); setEditor({ mode: 'edit', code: d.code, values: [...(value[d.code] || [])] }); };
  const saveEditor = () => {
    if (!editor || !editor.code || editor.values.length === 0) { setShowErr(true); return; }
    onChange({ ...value, [editor.code]: editor.values });
    setEditor(null);
  };
  const removeDim = (code: string) => {
    const next = { ...value };
    delete next[code];
    onChange(next);
  };

  return (
    <section className="rounded-lg border border-[#E2E8F0]">
      <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between gap-2">
        <h4 className="text-[14px] font-medium text-[#020817] flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          Phạm vi dữ liệu
          {rows.length > 0 && <span className="text-[12px] font-normal text-[#64748B]">({rows.length} chiều)</span>}
        </h4>
        <button
          type="button"
          onClick={openAdd}
          disabled={available.length === 0 || editor?.mode === 'add'}
          title={available.length === 0 ? 'Đã khai đủ các chiều đang hoạt động' : 'Thêm phạm vi'}
          className={`${BTN_OUTLINE} !h-9`}
        >
          <Plus className="w-4 h-4" /> Thêm phạm vi
        </button>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex gap-2 items-start rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-2 text-[13px] text-[#1E40AF]">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            Chỉ thêm các chiều cần cấp quyền. <b>Chiều không khai = không có quyền</b> với mọi API lọc theo chiều đó (API trả lỗi 403).
            API không khai báo trường phân vùng thì không bị ảnh hưởng. Danh sách chiều lấy từ tab <i>Danh mục chiều phạm vi</i>.
          </div>
        </div>

        {/* Form Thêm / Chỉnh sửa phạm vi */}
        {editor && (
          <div className="rounded-lg border border-[#BFDBFE] bg-[#F8FAFC] p-4 space-y-3">
            <div className="text-[13px] font-semibold text-[#020817]">{editor.mode === 'add' ? 'Thêm phạm vi' : 'Chỉnh sửa phạm vi'}</div>
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-3">
              <div>
                <label className={LABEL_CLS}>Chiều phạm vi <span className={REQUIRED_MARK}>*</span></label>
                <SearchableSelect
                  ariaLabel="Chiều phạm vi"
                  placeholder="-- Chọn chiều --"
                  searchPlaceholder="Tìm mã hoặc tên chiều..."
                  contentClassName="z-[1000000]"
                  disabled={editor.mode === 'edit'}
                  value={editor.code}
                  options={(editor.mode === 'edit' ? dims.filter((d) => d.code === editor.code) : available)
                    .map((d) => ({ value: d.code, label: `${d.name} (${d.code})` }))}
                  onChange={(v) => setEditor({ ...editor, code: v, values: [] })}
                />
                {editorDim && <p className="text-[12px] text-[#64748B] mt-1">{editorDim.mode === 'DM' ? 'Chọn từ danh mục' : 'Tự nhập – gõ rồi nhấn Enter'}</p>}
                {showErr && !editor.code && <p className="text-[12px] text-[#DC2626] mt-1">Vui lòng chọn chiều phạm vi.</p>}
              </div>
              <div>
                <label className={LABEL_CLS}>Giá trị được phép <span className={REQUIRED_MARK}>*</span></label>
                {editorDim
                  ? <ScopeValueEditor d={editorDim} values={editor.values} onChange={(v) => setEditor({ ...editor, values: v })} />
                  : <div className="h-10 px-3 flex items-center rounded-lg border border-[#E2E8F0] bg-[#F0F0F0] text-[13px] text-[#94A3B8]">Chọn chiều trước</div>}
                {showErr && editor.code && editor.values.length === 0 && <p className="text-[12px] text-[#DC2626] mt-1">Vui lòng chọn hoặc nhập ít nhất 1 giá trị.</p>}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className={`${BTN_OUTLINE} !h-9`} onClick={() => setEditor(null)}>Hủy</button>
              <button type="button" className={`${BTN_PRIMARY} !h-9`} onClick={saveEditor}>
                <Check className="w-4 h-4" /> {editor.mode === 'add' ? 'Thêm' : 'Cập nhật'}
              </button>
            </div>
          </div>
        )}

        {/* Danh sách phạm vi đã khai */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
          <table className="w-full border-collapse text-[13px] table-fixed">
            <thead className="bg-[#F8FAFC]">
              <tr className="h-[42px]">
                <th className={`${TH} w-12 text-center`}>STT</th>
                <th className={`${TH} w-[30%]`}>Chiều phạm vi</th>
                <th className={TH}>Giá trị được phép</th>
                <th className={`${TH} w-24 text-center`}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[13px] text-[#64748B]">
                    Chưa khai phạm vi nào – tài khoản không có quyền với các API có lọc theo phạm vi. Bấm <b>Thêm phạm vi</b> để cấp.
                  </td>
                </tr>
              ) : rows.map((d, i) => {
                const vals = value[d.code] || [];
                const editing = editor?.mode === 'edit' && editor.code === d.code;
                return (
                  <tr key={d.code} className={`border-b border-[#E0E0E0] last:border-b-0 align-top ${editing ? 'bg-[#EFF6FF]' : 'bg-white hover:bg-[#F8FAFC]'}`}>
                    <td className="px-3 py-3 text-center">{i + 1}</td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-[#020817]">{d.name}</div>
                      <div className="text-[12px] text-[#64748B]">{d.code} · {d.mode === 'DM' ? 'Chọn từ danh mục' : 'Tự nhập'}</div>
                      {d.status !== 'Hoạt động' && <div className="mt-1"><Badge label="Ngừng hoạt động" variant="slate" icon={<Lock className="w-3.5 h-3.5 shrink-0" />} /></div>}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap gap-1" title={vals.map((v) => scopeValueText(d, v)).join('\n')}>
                        {vals.slice(0, MAX_CHIPS).map((v) => (
                          <span key={v} className="inline-flex items-center h-[26px] px-2 rounded-2xl border text-[13px] text-[#2563EB] bg-[#EFF6FF] border-[#BFDBFE] max-w-full truncate">
                            {scopeValueText(d, v)}
                          </span>
                        ))}
                        {vals.length > MAX_CHIPS && (
                          <span className="inline-flex items-center h-[26px] px-2 rounded-2xl border text-[13px] text-[#64748B] bg-[#F8FAFC] border-[#E2E8F0] cursor-help">
                            +{vals.length - MAX_CHIPS}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <RowIconAction label="Chỉnh sửa phạm vi" onClick={() => openEdit(d)}>
                          <SquarePen className="w-4 h-4" />
                        </RowIconAction>
                        <RowIconAction label="Xóa phạm vi" onClick={() => setDeleteCode(d.code)}>
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
      </div>

      <ConfirmModal
        isOpen={!!deleteCode}
        onClose={() => setDeleteCode(null)}
        onConfirm={() => {
          if (deleteCode) removeDim(deleteCode);
          if (editor?.code === deleteCode) setEditor(null);
          setDeleteCode(null);
        }}
        title="Xóa phạm vi"
        type="delete"
        confirmText="Xóa"
        cancelText="Hủy bỏ"
        message={
          <div>
            Xóa phạm vi <b>{dims.find((d) => d.code === deleteCode)?.name}</b> khỏi tài khoản? Sau khi lưu, tài khoản sẽ
            <b> không có quyền</b> với các API lọc theo chiều này (API trả lỗi 403).
          </div>
        }
      />
    </section>
  );
}

/** Ô "Phạm vi dữ liệu" ở bảng Danh sách tài khoản: số chiều đã khai hoặc cảnh báo Chưa khai báo */
export function AccountScopeSummary({ value }: { value?: AccountScopeValues }) {
  const dims = dimensionsForAccount(useScopeDimensions(), useServiceScopeMap());
  const filled = dims.filter((d) => (value?.[d.code] || []).length > 0);
  if (dims.length === 0) return <span className="text-[#94A3B8]">–</span>;
  if (filled.length === 0) return <Badge label="Chưa khai báo" variant="amber" icon={<AlertTriangle className="w-3.5 h-3.5 shrink-0" />} />;
  const tip = filled.map((d) => `${d.name}: ${(value?.[d.code] || []).map((x) => scopeValueLabel(d, x)).join(', ')}`).join('\n');
  return (
    <span title={tip} className="cursor-help">
      <Badge label={`Đã khai ${filled.length} chiều`} variant="blue" />
    </span>
  );
}
