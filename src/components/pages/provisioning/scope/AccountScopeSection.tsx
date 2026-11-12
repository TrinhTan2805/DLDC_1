// Khối "Phạm vi dữ liệu" trong popup Tạo/Cập nhật tài khoản API + ô tóm tắt ở danh sách tài khoản (log 241)
// BR04: mỗi chiều đang hoạt động 1 dòng · BR05: để trống = không có quyền (fail-closed)
import { Ban, Filter, Info, Lock, AlertTriangle } from 'lucide-react';
import { Badge } from '../../collection/collectionUi';
import {
  type AccountScopeValues, type ScopeDimension, dimensionsForAccount, scopeValueOptions, scopeValueLabel,
  useScopeDimensions, useServiceScopeMap
} from './scopeData';
import { MultiValueSelect, TagValueInput } from './ScopeValueInputs';

const TH = 'px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px]';

export function AccountScopeSection({ value, onChange }: { value: AccountScopeValues; onChange: (v: AccountScopeValues) => void }) {
  const dims = dimensionsForAccount(useScopeDimensions(), useServiceScopeMap());
  const setDim = (code: string, vals: string[]) => onChange({ ...value, [code]: vals });

  return (
    <section className="rounded-lg border border-[#E2E8F0]">
      <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between gap-2">
        <h4 className="text-[14px] font-medium text-[#020817] flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          Phạm vi dữ liệu
        </h4>
        <span className="text-[12px] text-[#64748B]">Danh sách chiều lấy từ tab Danh mục chiều phạm vi</span>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex gap-2 items-start rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-2 text-[13px] text-[#1E40AF]">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            Mỗi chiều là một dòng. <b>Để trống một chiều = không có quyền</b> với mọi API lọc theo chiều đó (API trả lỗi 403).
            API không khai báo trường phân vùng thì không bị ảnh hưởng.
          </div>
        </div>
        {dims.length === 0 ? (
          <p className="text-[13px] text-[#64748B]">Chưa có chiều phạm vi nào đang hoạt động.</p>
        ) : (
          <div className="bg-white rounded-lg border border-[#E2E8F0]">
            <table className="w-full border-collapse text-[13px] table-fixed">
              <thead className="bg-[#F8FAFC]">
                <tr className="h-[42px]">
                  <th className={`${TH} w-[34%]`}>Chiều phạm vi</th>
                  <th className={TH}>Giá trị được phép</th>
                </tr>
              </thead>
              <tbody>
                {dims.map((d) => <ScopeRow key={d.code} d={d} values={value[d.code] || []} onChange={(v) => setDim(d.code, v)} />)}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

function ScopeRow({ d, values, onChange }: { d: ScopeDimension; values: string[]; onChange: (v: string[]) => void }) {
  const options = scopeValueOptions(d);
  return (
    <tr className="bg-white border-b border-[#E0E0E0] last:border-b-0 align-top">
      <td className="px-3 py-3">
        <div className="font-medium text-[#020817]">{d.name}</div>
        <div className="text-[12px] text-[#64748B]">{d.code} · {d.mode === 'DM' ? 'Chọn từ danh mục' : 'Tự nhập'}</div>
        {d.status !== 'Hoạt động' && <div className="mt-1"><Badge label="Ngừng hoạt động" variant="slate" icon={<Lock className="w-3.5 h-3.5 shrink-0" />} /></div>}
      </td>
      <td className="px-3 py-2">
        {d.mode === 'DM'
          ? (
            <MultiValueSelect
              ariaLabel={`Giá trị ${d.name}`}
              values={values}
              options={options}
              onChange={onChange}
              // Có trường hiển thị → danh sách dạng bảng (mã + các cột hiển thị), chip "01 – Hà Nội" (log 242)
              columns={d.displayColumns?.length ? [d.sourceColumn || 'Mã', ...d.displayColumns] : undefined}
              chipText={(o) => (o.extra?.[0] ? `${o.value} – ${o.extra[0]}` : o.value)}
            />
          )
          : <TagValueInput ariaLabel={`Giá trị ${d.name}`} values={values} onChange={onChange} />}
        {values.length === 0 ? (
          <p className="text-[12px] text-[#DC2626] mt-1 flex items-center gap-1">
            <Ban className="w-3.5 h-3.5 shrink-0" />
            Để trống: không có quyền với API lọc theo chiều này
          </p>
        ) : d.mode === 'DM' ? (
          <p className="text-[12px] text-[#64748B] mt-1">Đã chọn {values.length}/{options.length} giá trị</p>
        ) : null}
      </td>
    </tr>
  );
}

/** Ô "Phạm vi dữ liệu" ở bảng Danh sách tài khoản: n/m chiều có giá trị hoặc cảnh báo Chưa khai báo */
export function AccountScopeSummary({ value }: { value?: AccountScopeValues }) {
  const dims = dimensionsForAccount(useScopeDimensions(), useServiceScopeMap());
  const filled = dims.filter((d) => (value?.[d.code] || []).length > 0);
  if (dims.length === 0) return <span className="text-[#94A3B8]">–</span>;
  if (filled.length === 0) return <Badge label="Chưa khai báo" variant="amber" icon={<AlertTriangle className="w-3.5 h-3.5 shrink-0" />} />;
  const tip = dims.map((d) => {
    const v = value?.[d.code] || [];
    return `${d.name}: ${v.length ? v.map((x) => scopeValueLabel(d, x)).join(', ') : '(trống)'}`;
  }).join('\n');
  return (
    <span title={tip} className="cursor-help">
      <Badge label={`${filled.length}/${dims.length} chiều có giá trị`} variant={filled.length === dims.length ? 'blue' : 'indigo'} />
    </span>
  );
}
