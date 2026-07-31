import React, { useState } from 'react';
import { 
  Activity, Server, Database, Network, Clock, CheckCircle2, 
  AlertCircle, ChevronRight, FileText, Share2, PlusCircle, BarChart3, ShieldCheck 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

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

const recentLogs = [
  { id: 'LOG-942', time: '14:23:45', api: 'Lấy danh sách Hộ tịch', client: 'Sở Y tế', status: 200, latency: '124ms' },
  { id: 'LOG-941', time: '14:21:10', api: 'Lấy danh sách Hộ tịch', client: 'UBND Huyện', status: 403, latency: '45ms' },
  { id: 'LOG-940', time: '13:15:22', api: 'Đồng bộ THADS', client: 'Tổng cục THADS', status: 200, latency: '310ms' },
  { id: 'LOG-939', time: '11:45:01', api: 'Đọc thông tin BPBĐ', client: 'Cục GDBĐ', status: 500, latency: '5020ms' },
];

export function DataProvisionDashboard() {
  const [timeRange, setTimeRange] = useState<'24hours' | '7days' | '30days'>('24hours');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsAnimating(true);
    setTimeRange(e.target.value as '24hours' | '7days' | '30days');
    setTimeout(() => setIsAnimating(false), 300);
  };

  const chartData = timeRange === '24hours' ? trafficData24Hours 
                  : timeRange === '7days' ? trafficData7Days 
                  : trafficData30Days;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Tổng quan Cung cấp Dữ liệu</h2>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Traffic Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800">Lưu lượng truy cập API Gateway</h3>
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

        {/* Top 10 API có tỷ lệ lỗi cao nhất */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 pb-0">
            <h3 className="font-bold text-slate-800">Top 10 API có tỷ lệ lỗi cao nhất</h3>
            <p className="text-xs text-slate-500 mb-4">Xếp hạng theo tỷ lệ lỗi trong 7 ngày qua</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[12px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-2.5 px-3 text-[11px] text-slate-500 font-bold whitespace-nowrap">ENDPOINT</th>
                  <th className="text-left py-2.5 px-3 text-[11px] text-slate-500 font-bold whitespace-nowrap">HỆ THỐNG</th>
                  <th className="text-right py-2.5 px-3 text-[11px] text-slate-500 font-bold whitespace-nowrap">LƯỢT GỌI</th>
                  <th className="text-right py-2.5 px-3 text-[11px] text-slate-500 font-bold whitespace-nowrap">SỐ LỖI</th>
                  <th className="text-left py-2.5 px-3 text-[11px] text-slate-500 font-bold whitespace-nowrap">MÃ LỖI PHỔ BIẾN</th>
                  <th className="text-right py-2.5 px-3 text-[11px] text-slate-500 font-bold whitespace-nowrap">THỜI GIAN TB</th>
                  <th className="text-left py-2.5 px-3 text-[11px] text-slate-500 font-bold whitespace-nowrap">TỶ LỆ LỖI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {TOP_ERROR_RATE_APIS.map(api => (
                  <tr key={api.endpoint} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700 whitespace-nowrap">{api.endpoint}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 rounded whitespace-nowrap">
                        {api.system}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-[12px] text-slate-900 whitespace-nowrap">{api.calls.toLocaleString('vi-VN')}</td>
                    <td className="py-2.5 px-3 text-right text-[12px] text-slate-900 whitespace-nowrap">{api.errors.toLocaleString('vi-VN')}</td>
                    <td className="py-2.5 px-3 text-[12px] text-slate-600 whitespace-nowrap">{api.commonError}</td>
                    <td className="py-2.5 px-3 text-right text-[12px] text-slate-900 whitespace-nowrap">{api.avgTimeMs.toLocaleString('vi-VN')} ms</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5 min-w-[100px]">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full rounded-full bg-red-500" style={{ width: `${(api.errorRate / TOP_ERROR_RATE_APIS[0].errorRate) * 100}%` }} />
                        </div>
                        <span className="text-[12px] font-bold text-red-600 whitespace-nowrap">{api.errorRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Audit Logs */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800">Nhật ký khai thác gần đây</h3>
              <p className="text-xs text-slate-500">Hoạt động gọi API từ các đơn vị</p>
            </div>
            <button className="text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center">
              Xem tất cả <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="p-0">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/50 text-xs text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3 font-bold">Thời gian</th>
                  <th className="px-5 py-3 font-bold">Client</th>
                  <th className="px-5 py-3 font-bold">API</th>
                  <th className="px-5 py-3 font-bold">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{log.time}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{log.client}</td>
                    <td className="px-5 py-3.5 text-slate-600 text-xs font-medium">{log.api}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                        log.status === 200 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        log.status === 403 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {log.status === 200 ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 flex flex-col">
          <h3 className="font-bold text-slate-800 mb-1">Thao tác nhanh</h3>
          <p className="text-xs text-slate-500 mb-4">Các chức năng thường dùng</p>
          
          <div className="space-y-3 flex-1">
            <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-amber-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg group-hover:bg-amber-200 transition-colors">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-slate-800">Tạo API mới</div>
                  <div className="text-[10px] text-slate-500">Thiết lập endpoint cung cấp</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg group-hover:bg-indigo-200 transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-slate-800">Phê duyệt yêu cầu</div>
                  <div className="text-[10px] text-slate-500">5 ticket đang chờ xử lý</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg group-hover:bg-emerald-200 transition-colors">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-slate-800">Báo cáo hiệu năng</div>
                  <div className="text-[10px] text-slate-500">Xuất báo cáo lưu lượng</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
