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
}

export interface CategoryTrendPoint {
  name: string;
  apiCalls: number;
}

interface CategoryTrendAndStatsSectionProps {
  trendData: CategoryTrendPoint[];
  categories: CategoryStatRow[];
  selectedCount: number;
}

// Gộp biểu đồ xu hướng + bảng thống kê danh mục vào 1 khung trắng chung, tách biệt với bảng theo hệ thống khai thác ở dưới
export function CategoryTrendAndStatsSection({ trendData, categories, selectedCount }: CategoryTrendAndStatsSectionProps) {
  const totalApiCount = categories.reduce((acc, curr) => acc + curr.apiCount, 0);
  const totalStableApiCount = categories.reduce((acc, curr) => acc + curr.stableApiCount, 0);
  const totalApiCalls = categories.reduce((acc, curr) => acc + curr.apiCalls, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
      {/* Chart: xu hướng tổng lượt gọi API theo thời gian — cộng dồn theo các danh mục đang được lọc (hoặc tất cả nếu không lọc) */}
      <div>
        <p className="text-[18px] font-bold text-slate-700 mb-3">Xu hướng tổng chia sẻ danh mục dùng chung theo thời gian</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#374151' }} />
              <YAxis tick={{ fontSize: 12, fill: '#374151' }} />
              <Tooltip />
              <Line type="monotone" dataKey="apiCalls" name="Tổng lượt gọi API" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[12px] text-slate-400 mt-2">
          * Giá trị mỗi điểm là tổng lượt gọi API của {selectedCount === 0 ? 'tất cả danh mục' : `${selectedCount} danh mục đang lọc`} trong tháng đó.
        </p>
      </div>

      {/* Bảng thống kê danh mục */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[420px] custom-scrollbar">
          <table className="exploitation-report-table w-full text-left border-collapse table-auto">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50 border-b border-slate-200 text-[13px] font-semibold text-slate-500 uppercase tracking-tight">
                <th className="py-3 px-4 text-center w-12">STT</th>
                <th className="py-3 px-4">Danh mục</th>
                <th className="py-3 px-4 text-right">Số API đang chia sẻ</th>
                <th className="py-3 px-4 text-right">Lượt gọi API</th>
                <th className="py-3 px-4 text-center">Tỷ lệ API ổn định</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px] text-slate-700">
              {categories.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-all">
                  <td className="py-3 px-4 text-center text-slate-500">{idx + 1}</td>
                  <td className="py-3 px-4 font-medium text-slate-900">{item.category}</td>
                  <td className="py-3 px-4 text-right text-slate-700">{item.apiCount}</td>
                  <td className="py-3 px-4 text-right text-slate-700">{item.apiCalls.toLocaleString()}</td>
                  <td className={`py-3 px-4 text-center font-medium ${
                    item.stableApiCount === item.apiCount ? 'text-green-600' : 'text-amber-600'
                  }`}>
                    {item.stableApiCount}/{item.apiCount} API ổn định
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-semibold border-t border-slate-200">
                <td colSpan={2} className="py-3 px-4 text-center text-slate-700 uppercase text-[13px]">Tổng cộng</td>
                <td className="py-3 px-4 text-right text-blue-600">{totalApiCount}</td>
                <td className="py-3 px-4 text-right text-blue-600">{totalApiCalls.toLocaleString()}</td>
                <td className={`py-3 px-4 text-center ${
                  totalStableApiCount === totalApiCount ? 'text-green-600' : 'text-amber-600'
                }`}>
                  {totalStableApiCount}/{totalApiCount} API ổn định
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
