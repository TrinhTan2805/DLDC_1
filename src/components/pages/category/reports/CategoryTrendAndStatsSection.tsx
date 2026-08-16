import {
  LineChart, Line as LineR, XAxis as XAxisR, YAxis as YAxisR,
  CartesianGrid, Tooltip as TooltipR, ResponsiveContainer
} from 'recharts';

const Line = LineR as any;
const XAxis = XAxisR as any;
const YAxis = YAxisR as any;
const Tooltip = TooltipR as any;

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

// Gộp biểu đồ xu hướng + bảng thống kê danh mục vào 1 khung trắng chung, tách biệt với bảng theo hệ thống khai thác ở dưới
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

  // Dropdown chọn đơn vị/hệ thống khai thác — dùng chung cho header biểu đồ và bảng gọi API
  const UnitSelect = () => (
    <div className="flex items-center gap-2 shrink-0">
      <span className="text-[12px] text-slate-500 font-medium whitespace-nowrap">Đơn vị khai thác:</span>
      <select
        title="Đơn vị / Hệ thống khai thác"
        value={unitFilter}
        onChange={(e) => onUnitFilterChange(e.target.value)}
        className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-[12px] bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none max-w-[240px]"
      >
        {exploitUnits.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
      </select>
    </div>
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
      {/* 2 biểu đồ tách biệt: Lượt gọi API (khai thác qua API) và Lượt truy cập (người dùng xem trên màn tra cứu) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ 1: Lượt gọi API */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-[16px] font-bold text-slate-700 mb-1">Xu hướng lượt gọi API theo thời gian</p>
              <p className="text-[12px] text-slate-400">Khai thác qua API — {unitFilter === 'all' ? 'theo đơn vị khai thác (máy gọi máy)' : unitLabel}</p>
            </div>
            <UnitSelect />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={apiTrendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#374151' }} />
                <YAxis tick={{ fontSize: 12, fill: '#374151' }} />
                <Tooltip />
                <Line type="monotone" dataKey="apiCalls" name="Lượt gọi API" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ 2: Lượt truy cập */}
        <div>
          <p className="text-[16px] font-bold text-slate-700 mb-1">Xu hướng lượt truy cập theo thời gian</p>
          <p className="text-[12px] text-slate-400 mb-3">Truy cập giao diện — người dùng đăng nhập xem danh mục</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#374151' }} />
                <YAxis tick={{ fontSize: 12, fill: '#374151' }} />
                <Tooltip />
                <Line type="monotone" dataKey="accessCount" name="Lượt truy cập" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <p className="text-[12px] text-slate-400">
        * Mỗi điểm là tổng của {selectedCount === 0 ? 'tất cả danh mục' : `${selectedCount} danh mục đang lọc`} trong tháng đó. Lượt gọi API (hệ thống khai thác) và lượt truy cập (người dùng xem giao diện) là hai kênh khác nhau.
      </p>

      {/* Bảng 1: Lượt gọi API theo danh mục (kênh khai thác qua API) */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
          <p className="text-[15px] font-bold text-slate-700">Lượt gọi API theo danh mục <span className="font-normal text-slate-400 text-[12px]">(khai thác qua API — hệ thống gọi)</span></p>
          <UnitSelect />
        </div>
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto max-h-[420px] custom-scrollbar">
            <table className="exploitation-report-table w-full text-left border-collapse table-auto">
              <thead className="sticky top-0 z-10">
                <tr className="bg-slate-50 border-b border-slate-200 text-[13px] font-semibold text-slate-500 uppercase tracking-tight">
                  <th className="py-3 px-4 text-center w-12">STT</th>
                  <th className="py-3 px-4">Danh mục</th>
                  <th className="py-3 px-4 text-right">Số API đang chia sẻ</th>
                  <th className="py-3 px-4 text-right">Lượt gọi API</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[13px] text-slate-700">
                {apiCategories.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-all">
                    <td className="py-3 px-4 text-center text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-4 font-medium text-slate-900">{item.category}</td>
                    <td className="py-3 px-4 text-right text-slate-700">{item.apiCount}</td>
                    <td className="py-3 px-4 text-right text-slate-700">{item.apiCalls.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-semibold border-t border-slate-200">
                  <td colSpan={2} className="py-3 px-4 text-center text-slate-700 uppercase text-[13px]">Tổng cộng</td>
                  <td className="py-3 px-4 text-right text-blue-600">{totalApiCount}</td>
                  <td className="py-3 px-4 text-right text-blue-600">{totalApiCalls.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bảng 2: Lượt truy cập theo danh mục (kênh truy cập giao diện) */}
      <div>
        <p className="text-[15px] font-bold text-slate-700 mb-2">Lượt truy cập theo danh mục <span className="font-normal text-slate-400 text-[12px]">(truy cập giao diện — người dùng đăng nhập xem)</span></p>
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto max-h-[420px] custom-scrollbar">
            <table className="exploitation-report-table w-full text-left border-collapse table-auto">
              <thead className="sticky top-0 z-10">
                <tr className="bg-slate-50 border-b border-slate-200 text-[13px] font-semibold text-slate-500 uppercase tracking-tight">
                  <th className="py-3 px-4 text-center w-12">STT</th>
                  <th className="py-3 px-4">Danh mục</th>
                  <th className="py-3 px-4 text-right">Số người dùng truy cập</th>
                  <th className="py-3 px-4 text-right">Lượt truy cập</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[13px] text-slate-700">
                {categories.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-all">
                    <td className="py-3 px-4 text-center text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-4 font-medium text-slate-900">{item.category}</td>
                    <td className="py-3 px-4 text-right text-slate-700">{item.userCount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-slate-700">{item.accessCount.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-semibold border-t border-slate-200">
                  <td colSpan={2} className="py-3 px-4 text-center text-slate-700 uppercase text-[13px]">Tổng cộng</td>
                  <td className="py-3 px-4 text-right text-emerald-600">{totalUserCount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-emerald-600">{totalAccessCount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
