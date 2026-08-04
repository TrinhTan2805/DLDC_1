import React, { useState } from 'react';
import {
  Activity, Server, Database, Network, Clock, CheckCircle2,
  FileText, Share2, ChevronLeft, ChevronRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Label } from 'recharts';

// Mock Data Generators
const generateData = (count: number, prefix: string, baseValue: number, variance: number) => {
  return Array.from({ length: count }).map((_, i) => {
    // Generate realistic looking fluctuations using sin wave + random noise
    const noise = (Math.random() * variance) - (variance / 2);
    const trend = Math.sin(i / (count / Math.PI)) * (variance / 2);
    const value = Math.max(0, Math.floor(baseValue + noise + trend));
    return {
      name: `${prefix} ${i + 1}`,
      requests: value,
      errors: Math.floor(value * (Math.random() * 0.05)), // 0-5% error rate
    };
  });
};

const trafficData24Hours = Array.from({ length: 24 }).map((_, i) => {
  const hour = i.toString().padStart(2, '0') + ':00';
  // Higher traffic during business hours (8-17)
  let base = (i >= 8 && i <= 17) ? 2500 : 800;
  // Peak hours at 9 and 14
  if (i === 9 || i === 14) base = 4000;
  const requests = Math.max(0, Math.floor(base + (Math.random() * 1000 - 500)));
  return {
    name: hour,
    requests,
    errors: Math.floor(requests * (Math.random() * 0.02)),
  };
});

const trafficData7Days = [
  { name: 'T2', requests: 24200, errors: 112 },
  { name: 'T3', requests: 25100, errors: 85 },
  { name: 'T4', requests: 24800, errors: 122 },
  { name: 'T5', requests: 26200, errors: 98 },
  { name: 'T6', requests: 25800, errors: 104 },
  { name: 'T7', requests: 12100, errors: 31 },
  { name: 'CN', requests: 9800, errors: 10 },
];

const trafficData30Days = generateData(30, 'Ngày', 22000, 8000);

// Top 10 API có tỷ lệ lỗi cao nhất trong 7 ngày qua - dữ liệu mock [Unverified]
const TOP_ERROR_RATE_APIS = [
  { endpoint: '/v1/xaydung/giay-phep/tra-cuu', system: 'XAYDUNG', calls: 48210, errors: 5120, commonError: '504 Timeout', avgTimeMs: 1820, errorRate: 10.6 },
  { endpoint: '/v1/datdai/thua-dat/chi-tiet', system: 'DATDAI', calls: 132400, errors: 11240, commonError: '500 Internal', avgTimeMs: 1465, errorRate: 8.5 },
  { endpoint: '/v1/moitruong/quan-trac/realtime', system: 'MOITRUONG', calls: 86300, errors: 6210, commonError: '429 Rate limit', avgTimeMs: 980, errorRate: 7.2 },
  { endpoint: '/v1/tuphap/ho-tich/khai-sinh', system: 'TUPHAP', calls: 57800, errors: 3410, commonError: '400 Bad request', avgTimeMs: 742, errorRate: 5.9 },
  { endpoint: '/v1/thue/hoa-don/dong-bo', system: 'THUE', calls: 421500, errors: 21900, commonError: '503 Unavailable', avgTimeMs: 1210, errorRate: 5.2 },
  { endpoint: '/v1/nnptnt/vung-trong/danh-sach', system: 'NNPTNT', calls: 22400, errors: 1050, commonError: '502 Bad gateway', avgTimeMs: 890, errorRate: 4.7 },
  { endpoint: '/v1/bhxh/qua-trinh-dong/tra-cuu', system: 'BHXH', calls: 268900, errors: 9860, commonError: '401 Unauthorized', avgTimeMs: 655, errorRate: 3.7 },
  { endpoint: '/v1/yte/ho-so-suc-khoe/lich-su', system: 'YTE', calls: 158700, errors: 4920, commonError: '504 Timeout', avgTimeMs: 1320, errorRate: 3.1 },
  { endpoint: '/v1/congthuong/giay-phep/tra-cuu', system: 'CONGTHUONG', calls: 34600, errors: 830, commonError: '400 Bad request', avgTimeMs: 610, errorRate: 2.4 },
  { endpoint: '/v1/gtvt/dang-kiem/tra-cuu', system: 'GTVT', calls: 76200, errors: 1370, commonError: '429 Rate limit', avgTimeMs: 540, errorRate: 1.8 },
];

// Biểu đồ cung cấp dữ liệu theo phương thức chia sẻ [Unverified] - tổng khớp với "Dịch vụ công bố" (124)
const provisionMethodShare = [
  { name: 'REST API', value: 57, color: '#3b82f6' },
  { name: 'Excel', value: 30, color: '#10b981' },
  { name: 'CSV', value: 22, color: '#f59e0b' },
  { name: 'JSON', value: 15, color: '#8b5cf6' },
];
const provisionMethodTotal = provisionMethodShare.reduce((sum, item) => sum + item.value, 0);

const ERROR_API_PAGE_SIZE = 5;

export function DataProvisionDashboard() {
  const [timeRange, setTimeRange] = useState<'24hours' | '7days' | '30days'>('24hours');
  const [isAnimating, setIsAnimating] = useState(false);
  const [errorApiPage, setErrorApiPage] = useState(0);

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsAnimating(true);
    setTimeRange(e.target.value as '24hours' | '7days' | '30days');
    setTimeout(() => setIsAnimating(false), 300);
  };

  const chartData = timeRange === '24hours' ? trafficData24Hours
                  : timeRange === '7days' ? trafficData7Days
                  : trafficData30Days;

  const errorApiTotalPages = Math.ceil(TOP_ERROR_RATE_APIS.length / ERROR_API_PAGE_SIZE);
  const errorApiPageItems = TOP_ERROR_RATE_APIS.slice(
    errorApiPage * ERROR_API_PAGE_SIZE,
    errorApiPage * ERROR_API_PAGE_SIZE + ERROR_API_PAGE_SIZE
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-[18px] font-bold text-slate-800">Tổng quan Cung cấp Dữ liệu</h2>
        <p className="text-slate-500 mt-1">Trung tâm điều khiển và giám sát toàn bộ hoạt động điều phối, chia sẻ dữ liệu</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-amber-300 transition-colors">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Lưu lượng Gateway</p>
            <h3 className="text-2xl font-extrabold text-slate-800">30,000<span className="text-sm font-medium text-slate-500 ml-1">req/tuần</span></h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center">
              <CheckCircle2 className="w-3 h-3 mr-1" /> 99.8% Thành công
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-amber-300 transition-colors">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">API Đang hoạt động</p>
            <h3 className="text-2xl font-extrabold text-slate-800">42<span className="text-sm font-medium text-slate-500 ml-1">endpoints</span></h3>
            <p className="text-xs text-slate-500 font-medium mt-1 flex items-center">
              <Network className="w-3 h-3 mr-1" /> 18 Tiến trình đối soát
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-amber-300 transition-colors">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Yêu cầu cấp DL</p>
            <h3 className="text-2xl font-extrabold text-slate-800">15<span className="text-sm font-medium text-slate-500 ml-1">tickets</span></h3>
            <p className="text-xs text-amber-600 font-semibold mt-1 flex items-center">
              <Clock className="w-3 h-3 mr-1" /> 5 Chờ phê duyệt
            </p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-amber-300 transition-colors">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Dịch vụ công bố</p>
            <h3 className="text-2xl font-extrabold text-slate-800">124<span className="text-sm font-medium text-slate-500 ml-1">dịch vụ</span></h3>
            <p className="text-xs text-slate-500 font-medium mt-1 flex items-center">
              <Share2 className="w-3 h-3 mr-1" /> Trên Catalog Portal
            </p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6">
        {/* Main Traffic Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[16px] font-bold text-slate-800">Lưu lượng truy cập API Gateway</h3>
              <p className="text-xs text-slate-500">Thống kê số lượng request trong 7 ngày gần nhất</p>
            </div>
            <select 
              value={timeRange}
              onChange={handleTimeRangeChange}
              className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <option value="24hours">Hôm nay (24h)</option>
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
            </select>
          </div>
          <div className={`h-72 w-full transition-opacity duration-300 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <RechartsTooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '13px', fontWeight: 'bold' }}
                  labelStyle={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="requests" name="Requests" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorRequests)" activeDot={{ r: 6, strokeWidth: 0, fill: '#f59e0b' }} animationDuration={1000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Danh sách API đang bị lỗi */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden h-[340px]">
          <div className="p-5 pb-0 flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-bold text-slate-800">Danh sách API đang bị lỗi</h3>
              <p className="text-xs text-slate-500 mb-4">Xếp hạng theo tỷ lệ lỗi trong 7 ngày qua</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setErrorApiPage(p => Math.max(0, p - 1))}
                disabled={errorApiPage === 0}
                className="p-1 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setErrorApiPage(p => Math.min(errorApiTotalPages - 1, p + 1))}
                disabled={errorApiPage >= errorApiTotalPages - 1}
                className="p-1 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto flex-1 min-h-0">
            <table className="w-full border-collapse text-[13px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-2.5 px-3 text-[13px] text-slate-500 font-bold whitespace-nowrap">ENDPOINT</th>
                  <th className="text-right py-2.5 px-3 text-[13px] text-slate-500 font-bold whitespace-nowrap">LƯỢT GỌI</th>
                  <th className="text-right py-2.5 px-3 text-[13px] text-slate-500 font-bold whitespace-nowrap">SỐ LỖI</th>
                  <th className="text-left py-2.5 px-3 text-[13px] text-slate-500 font-bold whitespace-nowrap">MÃ LỖI PHỔ BIẾN</th>
                  <th className="text-right py-2.5 px-3 text-[13px] text-slate-500 font-bold whitespace-nowrap">THỜI GIAN TB</th>
                  <th className="text-left py-2.5 px-3 text-[13px] text-slate-500 font-bold whitespace-nowrap">TỶ LỆ LỖI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {errorApiPageItems.map(api => (
                  <tr key={api.endpoint} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-[13px] text-slate-700 whitespace-nowrap">{api.endpoint}</td>
                    <td className="py-2.5 px-3 text-right text-[13px] text-slate-900 whitespace-nowrap">{api.calls.toLocaleString('vi-VN')}</td>
                    <td className="py-2.5 px-3 text-right text-[13px] text-slate-900 whitespace-nowrap">{api.errors.toLocaleString('vi-VN')}</td>
                    <td className="py-2.5 px-3 text-[13px] text-slate-600 whitespace-nowrap">{api.commonError}</td>
                    <td className="py-2.5 px-3 text-right text-[13px] text-slate-900 whitespace-nowrap">{api.avgTimeMs.toLocaleString('vi-VN')} ms</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5 min-w-[100px]">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full rounded-full bg-red-500" style={{ width: `${(api.errorRate / TOP_ERROR_RATE_APIS[0].errorRate) * 100}%` }} />
                        </div>
                        <span className="text-[13px] font-bold text-red-600 whitespace-nowrap">{api.errorRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Biểu đồ cung cấp dữ liệu theo phương thức chia sẻ */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 flex flex-col h-[340px]">
          <h3 className="text-[16px] font-bold text-slate-800 mb-4">Biểu đồ cung cấp dữ liệu theo phương thức chia sẻ</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
              <Pie
                data={provisionMethodShare}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                cornerRadius={4}
                labelLine={false}
                label={(props: any) => {
                  const RADIAN = Math.PI / 180;
                  const { cx, cy, midAngle, outerRadius: r, percent, index } = props;
                  const radius = r + 22;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  const color = provisionMethodShare[index].color;
                  return (
                    <text
                      x={x}
                      y={y}
                      fill={color}
                      textAnchor={x > cx ? 'start' : 'end'}
                      dominantBaseline="central"
                      fontSize={13}
                      fontWeight={700}
                    >
                      {`${Math.round(percent * 100)}%`}
                    </text>
                  );
                }}
              >
                {provisionMethodShare.map(entry => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
                <Label
                  position="center"
                  content={({ viewBox }: any) => {
                    const { cx, cy } = viewBox;
                    return (
                      <g>
                        <text x={cx} y={cy - 12} textAnchor="middle" dominantBaseline="central" fill="#64748b" fontSize={12}>
                          Tổng số
                        </text>
                        <text x={cx} y={cy + 12} textAnchor="middle" dominantBaseline="central" fill="#0f172a" fontSize={22} fontWeight={700}>
                          {provisionMethodTotal.toLocaleString('vi-VN')}
                        </text>
                      </g>
                    );
                  }}
                />
              </Pie>
              <RechartsTooltip formatter={(value: number) => value.toLocaleString('vi-VN')} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 mt-2 text-[13px]">
            {provisionMethodShare.map(item => (
              <span key={item.name} className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                {item.name}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
