import {
  LineChart, Line as LineR, XAxis as XAxisR, YAxis as YAxisR,
  CartesianGrid, Tooltip as TooltipR, ResponsiveContainer
} from 'recharts';
import { INPUT_CLS, TruncatedText } from '../../collection/collectionUi';

const Line = LineR as any;
const XAxis = XAxisR as any;
const YAxis = YAxisR as any;
const Tooltip = TooltipR as any;

// Bảng (compomennt.md 5.3)
const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';
const TR = 'h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors';
const TOTAL_TR = 'h-12 bg-[#F8FAFC] font-semibold border-b border-[#E0E0E0]';

export interface CategoryStatRow {
  category: string;
  apiCount: number;
  stableApiCount: number;
  apiCalls: number;
  accessCount: number;
  userCount: number;
}

export interface CategoryTrendPoint {
  name: string;
  apiCalls: number;
  accessCount: number;
}

interface ExploitUnitOption {
  value: string;
  label: string;
  ratio: number;
}

interface CategoryTrendAndStatsSectionProps {
  trendData: CategoryTrendPoint[];
  categories: CategoryStatRow[];
  selectedCount: number;
  exploitUnits: ExploitUnitOption[];
  unitFilter: string;
  onUnitFilterChange: (value: string) => void;
  unitRatio: number;
}

// Biểu đồ xu hướng (mỗi biểu đồ 1 thẻ) + bảng thống kê danh mục, tách biệt với bảng theo hệ thống khai thác ở dưới
export function CategoryTrendAndStatsSection({
  trendData, categories, selectedCount,
  exploitUnits, unitFilter, onUnitFilterChange, unitRatio,
}: CategoryTrendAndStatsSectionProps) {
  // Kênh gọi API co giãn theo đơn vị khai thác đang lọc; kênh lượt truy cập (người dùng) giữ nguyên
  const apiTrendData = trendData.map(p => ({ ...p, apiCalls: Math.round(p.apiCalls * unitRatio) }));
  const apiCategories = categories.map(c => ({ ...c, apiCalls: Math.round(c.apiCalls * unitRatio) }));

  const totalApiCount = categories.reduce((acc, curr) => acc + curr.apiCount, 0);
  const totalApiCalls = apiCategories.reduce((acc, curr) => acc + curr.apiCalls, 0);
  const totalAccessCount = categories.reduce((acc, curr) => acc + curr.accessCount, 0);
  const totalUserCount = categories.reduce((acc, curr) => acc + curr.userCount, 0);

  const unitLabel = exploitUnits.find(u => u.value === unitFilter)?.label ?? 'Tất cả đơn vị';

  // Dropdown chọn đơn vị/hệ thống khai thác — dùng chung cho header biểu đồ và bảng gọi API (lọc trực tiếp, không có nút)
  const UnitSelect = () => (
    <div className="flex items-center gap-2 shrink-0">
      <span className="text-[13px] text-[#64748B] whitespace-nowrap">Đơn vị khai thác:</span>
      <div className="w-[240px]">
        <select
          title="Đơn vị / Hệ thống khai thác"
          value={unitFilter}
          onChange={(e) => onUnitFilterChange(e.target.value)}
          className={INPUT_CLS}
        >
          {exploitUnits.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
        </select>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* 2 biểu đồ tách biệt, mỗi biểu đồ 1 thẻ: Lượt gọi API (khai thác qua API) và Lượt truy cập (người dùng xem trên màn tra cứu) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Biểu đồ 1: Lượt gọi API */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-[14px] font-medium text-[#020817] mb-1">Xu hướng lượt gọi API theo thời gian</p>
              <p className="text-[13px] text-[#64748B]">Khai thác qua API — {unitFilter === 'all' ? 'theo đơn vị khai thác (máy gọi máy)' : unitLabel}</p>
            </div>
            <UnitSelect />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={apiTrendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip />
                <Line type="monotone" dataKey="apiCalls" name="Lượt gọi API" stroke="#155DFC" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ 2: Lượt truy cập */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
          <p className="text-[14px] font-medium text-[#020817] mb-1">Xu hướng lượt truy cập theo thời gian</p>
          <p className="text-[13px] text-[#64748B] mb-3">Truy cập giao diện — người dùng đăng nhập xem danh mục</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip />
                <Line type="monotone" dataKey="accessCount" name="Lượt truy cập" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <p className="text-[12px] text-[#64748B]">
        * Mỗi điểm là tổng của {selectedCount === 0 ? 'tất cả danh mục' : `${selectedCount} danh mục đang lọc`} trong tháng đó. Lượt gọi API (hệ thống khai thác) và lượt truy cập (người dùng xem giao diện) là hai kênh khác nhau.
      </p>

      {/* Bảng 1: Lượt gọi API theo danh mục (kênh khai thác qua API) — compomennt.md 5.3 */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between gap-3 flex-wrap">
          <p className="text-[14px] font-medium text-[#020817]">Lượt gọi API theo danh mục <span className="font-normal text-[#64748B] text-[13px]">(khai thác qua API — hệ thống gọi)</span></p>
          <UnitSelect />
        </div>
        <div className="overflow-x-auto overflow-y-auto max-h-[420px] custom-scrollbar">
          <table className="exploitation-report-table w-full border-collapse collection-table text-[13px]">
            <thead className="sticky top-0 z-10 bg-[#F8FAFC]">
              <tr className="h-[42px]">
                <th className={`${TH} text-center w-12`}>STT</th>
                <th className={`${TH} text-left`}>Danh mục</th>
                <th className={`${TH} text-right`}>Số API đang chia sẻ</th>
                <th className={`${TH} text-right`}>Lượt gọi API</th>
              </tr>
            </thead>
            <tbody>
              {apiCategories.map((item, idx) => (
                <tr key={idx} className={TR}>
                  <td className={`${TD} text-center`}>{idx + 1}</td>
                  <td className={`${TD} text-left max-w-[360px]`}><TruncatedText text={item.category} /></td>
                  <td className={`${TD} text-right tabular-nums`}>{item.apiCount}</td>
                  <td className={`${TD} text-right tabular-nums`}>{item.apiCalls.toLocaleString()}</td>
                </tr>
              ))}
              <tr className={TOTAL_TR}>
                <td colSpan={2} className={`${TD} text-center`}>Tổng cộng</td>
                <td className={`${TD} text-right tabular-nums`}>{totalApiCount}</td>
                <td className={`${TD} text-right tabular-nums`}>{totalApiCalls.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bảng 2: Lượt truy cập theo danh mục (kênh truy cập giao diện) — compomennt.md 5.3 */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#E2E8F0]">
          <p className="text-[14px] font-medium text-[#020817]">Lượt truy cập theo danh mục <span className="font-normal text-[#64748B] text-[13px]">(truy cập giao diện — người dùng đăng nhập xem)</span></p>
        </div>
        <div className="overflow-x-auto overflow-y-auto max-h-[420px] custom-scrollbar">
          <table className="exploitation-report-table w-full border-collapse collection-table text-[13px]">
            <thead className="sticky top-0 z-10 bg-[#F8FAFC]">
              <tr className="h-[42px]">
                <th className={`${TH} text-center w-12`}>STT</th>
                <th className={`${TH} text-left`}>Danh mục</th>
                <th className={`${TH} text-right`}>Số người dùng truy cập</th>
                <th className={`${TH} text-right`}>Lượt truy cập</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((item, idx) => (
                <tr key={idx} className={TR}>
                  <td className={`${TD} text-center`}>{idx + 1}</td>
                  <td className={`${TD} text-left max-w-[360px]`}><TruncatedText text={item.category} /></td>
                  <td className={`${TD} text-right tabular-nums`}>{item.userCount.toLocaleString()}</td>
                  <td className={`${TD} text-right tabular-nums`}>{item.accessCount.toLocaleString()}</td>
                </tr>
              ))}
              <tr className={TOTAL_TR}>
                <td colSpan={2} className={`${TD} text-center`}>Tổng cộng</td>
                <td className={`${TD} text-right tabular-nums`}>{totalUserCount.toLocaleString()}</td>
                <td className={`${TD} text-right tabular-nums`}>{totalAccessCount.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
