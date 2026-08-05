import * as React from 'react';
import { Download, Database, Building2, Building, ChevronLeft, ChevronRight, XCircle, Calendar, FileText, ArrowRight } from 'lucide-react';
import { BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, Legend, Label, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockCollectionServices } from '../pages/collection/mockCollectionServices';

const goToServiceHistory = (serviceName: string) => {
  const matched = mockCollectionServices.find(s => s.name === serviceName);
  if (matched && typeof (window as any).navigateToPage === 'function') {
    (window as any).navigateToPage(`collection-setup/view/${matched.id}?tab=history`);
  }
};

// Màu chủ đạo theo design system
const PRIMARY = '#2563eb';
// Palette danh mục trung tính (không dùng đỏ để tránh hiểu nhầm "lỗi")
const PIE_COLORS = ['#2563eb', '#0891b2', '#7c3aed', '#16a34a', '#f59e0b', '#db2777'];
// Màu theo ngữ nghĩa trạng thái (Bản nháp / Hoạt động / Ngưng hoạt động)
const RESULT_COLORS = ['#f59e0b', '#16a34a', '#dc2626'];
// Màu cho biểu đồ phương thức (API / CSDL / Excel)
const METHOD_COLORS = ['#2563eb', '#0891b2', '#7c3aed'];


const TOOLTIP_STYLE = {
  backgroundColor: 'white',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '13px',
} as const;

// Cắt bớt nhãn quá dài (giữ tooltip hiển thị đầy đủ)
const truncateLabel = (s: string, max = 24) => (s.length > max ? `${s.slice(0, max - 1)}…` : s);

// Tick trục X cho cột dọc: xoay nghiêng, cắt chữ dài, hover xem đầy đủ
function CategoryTick({ x, y, payload }: any) {
  const label: string = payload?.value ?? '';
  return (
    <g transform={`translate(${x},${y})`}>
      <text transform="rotate(-35)" x={0} y={0} dy={6} textAnchor="end" fill="#64748b" fontSize={11}>
        <title>{label}</title>
        {truncateLabel(label, 16)}
      </text>
    </g>
  );
}

const methodData = [
  { name: 'API', value: 45 },
  { name: 'Cơ sở dữ liệu', value: 28 },
  { name: 'File excel', value: 15 },
];

// Mở rộng dữ liệu nguồn cung cấp với 3 chỉ tiêu (Dịch vụ/Bản ghi/Dung lượng) để phục vụ bộ lọc chỉ tiêu
// records/dataSizeGB là dữ liệu mock [Unverified], quy đổi theo tỷ lệ ước lượng từ số dịch vụ (services)
interface SourceMetricItem {
  name: string;
  services: number;
  records: number;
  dataSizeGB: number;
}

const withSourceMetrics = (items: { name: string; value: number }[]): SourceMetricItem[] =>
  items.map(item => ({
    name: item.name,
    services: item.value,
    records: Math.round(item.value * 3200),
    dataSizeGB: Math.round(item.value * 3200 * 0.000003 * 10) / 10,
  }));

const SOURCE_METRIC_OPTIONS: { key: 'services' | 'records' | 'dataSizeGB'; label: string }[] = [
  { key: 'services', label: 'Dịch vụ' },
  { key: 'records', label: 'Bản ghi' },
  { key: 'dataSizeGB', label: 'Dung lượng' },
];

const sourceDataAll = withSourceMetrics([
  { name: 'Cục hành chính tư pháp', value: 345 },
  { name: 'Cục thi hành án', value: 287 },
  { name: 'Cục bổ trợ tư pháp', value: 256 },
  { name: 'Vụ Hợp tác quốc tế', value: 178 },
  { name: 'Bộ Nội vụ', value: 210 },
  { name: 'Bộ Công an', value: 190 },
]);

const sourceDataInternal = withSourceMetrics([
  { name: 'Cục Hành chính tư pháp', value: 345 },
  { name: 'Cục Đăng ký GD bảo đảm & Bồi thường nhà nước', value: 312 },
  { name: 'Cục Quản lý thi hành án dân sự', value: 298 },
  { name: 'Cục Bổ trợ tư pháp', value: 256 },
  { name: 'Cục Hộ tịch, quốc tịch, chứng thực', value: 241 },
  { name: 'Cục Kiểm tra văn bản quy phạm pháp luật', value: 215 },
  { name: 'Cục Phổ biến, giáo dục pháp luật', value: 198 },
  { name: 'Cục Trợ giúp pháp lý', value: 187 },
  { name: 'Vụ Hợp tác quốc tế', value: 178 },
  { name: 'Vụ Pháp luật hình sự - hành chính', value: 165 },
  { name: 'Vụ Pháp luật dân sự - kinh tế', value: 152 },
  { name: 'Vụ Các vấn đề chung về xây dựng pháp luật', value: 134 },
  { name: 'Thanh tra Bộ Tư pháp', value: 121 },
  { name: 'Trung tâm Lý lịch tư pháp quốc gia', value: 109 },
  { name: 'Học viện Tư pháp', value: 96 },
]);

const sourceDataExternal = withSourceMetrics([
  { name: 'Bộ Nội vụ', value: 210 },
  { name: 'Bộ Công an', value: 190 },
  { name: 'Bộ Tài chính', value: 150 },
  { name: 'Bộ Y tế', value: 120 },
]);

// Khoảng thời gian mốc để tính tỷ lệ dữ liệu phát sinh trong khoảng ngày đã chọn (mock, đơn giản hoá)
const SOURCE_BASELINE_START = new Date('2025-01-01').getTime();
const SOURCE_BASELINE_END = new Date('2025-12-31').getTime();

const getSourceDateScale = (from: string, to: string) => {
  if (!from && !to) return 1;
  const start = from ? new Date(from).getTime() : SOURCE_BASELINE_START;
  const end = to ? new Date(to).getTime() : SOURCE_BASELINE_END;
  const totalDays = (SOURCE_BASELINE_END - SOURCE_BASELINE_START) / 86400000;
  const clampedStart = Math.max(start, SOURCE_BASELINE_START);
  const clampedEnd = Math.min(end, SOURCE_BASELINE_END);
  const rangeDays = Math.max(0, (clampedEnd - clampedStart) / 86400000);
  return totalDays > 0 ? Math.min(1, Math.max(0, rangeDays / totalDays)) : 1;
};

const resultData = [
  { name: 'Bản nháp', value: 156 },
  { name: 'Hoạt động', value: 1245 },
  { name: 'Ngưng hoạt động', value: 89 },
];

// Trạng thái dữ liệu của các dịch vụ thu thập gần nhất - dữ liệu mock [Unverified]
interface CollectionServiceStatus {
  id: number;
  name: string;
  source: string;
  lastSync: string;
  dataSizeLabel: string;
  status: 'success' | 'draft' | 'error' | 'warning';
}

const collectionServiceStatusData: CollectionServiceStatus[] = [
  { id: 1, name: 'Thu thập dữ liệu hộ tịch điện tử', source: 'Cục Hành chính tư pháp', lastSync: '20/12/2025 10:00:00', dataSizeLabel: '4.8 GB', status: 'success' },
  { id: 2, name: 'Thu thập Danh mục quốc tịch', source: 'Bộ Ngoại giao', lastSync: '19/12/2025 14:20:00', dataSizeLabel: '320 MB', status: 'success' },
  { id: 3, name: 'Thu thập dữ liệu thi hành án dân sự', source: 'Cục Quản lý thi hành án dân sự', lastSync: '19/12/2025 09:00:00', dataSizeLabel: '6.1 GB', status: 'success' },
  { id: 4, name: 'Thu thập dữ liệu công chứng, chứng thực', source: 'Cục Bổ trợ tư pháp', lastSync: '18/12/2025 16:45:00', dataSizeLabel: '1.9 GB', status: 'success' },
  { id: 5, name: 'Thu thập dữ liệu đăng ký kết hôn có yếu tố nước ngoài', source: 'Cục Hành chính tư pháp', lastSync: '18/12/2025 08:30:00', dataSizeLabel: '780 MB', status: 'success' },
  { id: 6, name: 'Thu thập dữ liệu tổ chức trọng tài thương mại', source: 'Cục Bổ trợ tư pháp', lastSync: '17/12/2025 11:00:00', dataSizeLabel: '0 MB', status: 'draft' },
  { id: 7, name: 'Thu thập dữ liệu Diện người được trợ giúp pháp lý theo quy định pháp luật', source: 'Bộ Nội vụ', lastSync: '15/12/2025 08:00:00', dataSizeLabel: '2.13 GB', status: 'error' },
  { id: 8, name: 'Thu thập Danh mục và mã các dân tộc Việt Nam từ Ủy ban Dân tộc', source: 'Ủy ban Dân tộc', lastSync: '14/12/2025 09:15:00', dataSizeLabel: '512 MB', status: 'error' },
  { id: 9, name: 'Thu thập dữ liệu đối tượng đang hưởng trợ giúp xã hội hàng tháng tại cộng đồng', source: 'Bộ LĐTBXH', lastSync: '13/12/2025 07:40:00', dataSizeLabel: '1.4 GB', status: 'error' },
  { id: 10, name: 'Thu thập dữ liệu văn bản quy phạm pháp luật mới ban hành', source: 'Cục Kiểm tra văn bản quy phạm pháp luật', lastSync: '20/12/2025 06:00:00', dataSizeLabel: 'Đang đồng bộ', status: 'warning' },
];

const timeDataToday = [
  { name: '0h-4h', value: 123 },
  { name: '4h-8h', value: 87 },
  { name: '8h-12h', value: 245 },
  { name: '12h-16h', value: 389 },
  { name: '16h-20h', value: 421 },
  { name: '20h-24h', value: 165 },
];

const timeDataThisWeek = [
  { name: 'T2', value: 120 },
  { name: 'T3', value: 250 },
  { name: 'T4', value: 180 },
  { name: 'T5', value: 390 },
  { name: 'T6', value: 420 },
  { name: 'T7', value: 160 },
  { name: 'CN', value: 90 },
];

const timeDataThisMonth = [
  { name: 'Tuần 1', value: 1200 },
  { name: 'Tuần 2', value: 1800 },
  { name: 'Tuần 3', value: 1500 },
  { name: 'Tuần 4', value: 2100 },
];

const timeDataThisYear = [
  { name: 'T1', value: 4500 },
  { name: 'T2', value: 5200 },
  { name: 'T3', value: 4800 },
  { name: 'T4', value: 5500 },
  { name: 'T5', value: 6100 },
  { name: 'T6', value: 5900 },
  { name: 'T7', value: 6800 },
  { name: 'T8', value: 7200 },
  { name: 'T9', value: 6500 },
  { name: 'T10', value: 7800 },
  { name: 'T11', value: 8200 },
  { name: 'T12', value: 9100 },
];


interface ChartCardProps {
  title: string;
  total: number;
  data: Array<{ name: string; value: number }>;
  chartType?: 'bar' | 'pie' | 'line';
  colors?: string[];
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: string[];
  renderFilter?: React.ReactNode;
  headerRight?: React.ReactNode;
}

function ChartCard({ title, total, data, chartType = 'bar', colors, filterValue, onFilterChange, filterOptions, renderFilter, headerRight }: ChartCardProps) {
  // Cột dọc (bar) tự giãn lấp đầy chiều cao card; pie/line dùng chiều cao cố định
  const isBar = chartType === 'bar';
  const fixedHeight = chartType === 'pie' ? 220 : 256;
  const pieColors = colors ?? PIE_COLORS;
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {headerRight ? headerRight : (chartType !== 'pie' && (
          <span className="text-[13px] text-slate-500">Tổng số: {total.toLocaleString()}</span>
        ))}
      </div>

      {/* Controls */}
      {renderFilter}
      {filterOptions && filterOptions.length > 0 && (
        <div className="flex items-center gap-3 mb-4">
          <select aria-label="Select box" 
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            title="Chọn khoảng thời gian"
            value={filterValue}
            onChange={(e) => onFilterChange && onFilterChange(e.target.value)}
          >
            {filterOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}

      {/* Chart */}
      <div className={isBar ? 'w-full flex-1 min-h-[320px]' : 'w-full'} style={isBar ? undefined : { height: fixedHeight }}>
        <ResponsiveContainer width="100%" height={isBar ? '100%' : fixedHeight}>
          {chartType === 'pie' ? (
            <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={78}
                paddingAngle={4}
                cornerRadius={4}
                labelLine={false}
                label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                ))}
                <Label
                  position="center"
                  content={({ viewBox }: any) => {
                    const { cx, cy } = viewBox;
                    return (
                      <g>
                        <text
                          x={cx}
                          y={cy - 18}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill="#64748b"
                          fontSize="12"
                        >
                          Tổng số
                        </text>
                        <text
                          x={cx}
                          y={cy}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill="#0f172a"
                          fontSize="22"
                          fontWeight={700}
                        >
                          {total.toLocaleString()}
                        </text>
                      </g>
                    );
                  }}
                />
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: '13px' }} />
            </PieChart>
          ) : chartType === 'line' ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="timeAreaColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PRIMARY} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={PRIMARY} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={{ stroke: '#e2e8f0' }}
                minTickGap={8}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 13 }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Area
                type="natural"
                dataKey="value"
                stroke={PRIMARY}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="url(#timeAreaColor)"
                dot={{ r: 2, fill: PRIMARY, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: PRIMARY, stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="name"
                interval={0}
                height={90}
                tick={<CategoryTick />}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 13 }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="value" fill={PRIMARY} radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

function SummaryCard({ title, value, icon, bgColor, iconColor }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 ${bgColor} rounded-lg flex items-center justify-center`}>
          <div className={iconColor}>
            {icon}
          </div>
        </div>
        <div className="flex-1">
          <p className="text-[16px] text-slate-600 mb-1">{title}</p>
          <p className="text-[16px] font-semibold text-slate-900">{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}


export function CollectionDashboard() {
  const todayObj = new Date();
  const today = todayObj.toISOString().split('T')[0];
  // Mặc định hiển thị các ngày trong tháng hiện tại; giới hạn tối đa ~1 tháng
  const firstOfMonthObj = new Date(todayObj.getFullYear(), todayObj.getMonth(), 1);
  const firstOfMonth = firstOfMonthObj.toISOString().split('T')[0];
  const MAX_RANGE_DAYS = 31;

  const [fromDate, setFromDate] = React.useState(firstOfMonth);
  const [toDate, setToDate] = React.useState(today);

  const handleFromDateChange = (val: string) => {
    setFromDate(val);
    if (toDate && val) {
      const d1 = new Date(val);
      const d2 = new Date(toDate);
      const diff = (d2.getTime() - d1.getTime()) / (1000 * 3600 * 24);
      if (diff > MAX_RANGE_DAYS || diff < 0) {
        const newTo = new Date(d1);
        newTo.setDate(d1.getDate() + MAX_RANGE_DAYS);
        const newToStr = newTo.toISOString().split('T')[0];
        setToDate(newToStr > today ? today : newToStr);
      }
    }
  };

  const handleToDateChange = (val: string) => {
    setToDate(val);
    if (fromDate && val) {
      const d1 = new Date(fromDate);
      const d2 = new Date(val);
      const diff = (d2.getTime() - d1.getTime()) / (1000 * 3600 * 24);
      if (diff > MAX_RANGE_DAYS || diff < 0) {
        const newFrom = new Date(d2);
        newFrom.setDate(d2.getDate() - MAX_RANGE_DAYS);
        setFromDate(newFrom.toISOString().split('T')[0]);
      }
    }
  };

  const currentTimeData = React.useMemo(() => {
    const data = [];
    const end = new Date(toDate || today);
    const start = new Date(fromDate || firstOfMonth);
    
    let diffDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
    if (diffDays < 0) diffDays = 0;
    
    const mockValues = [120, 250, 180, 390, 420, 160, 90];
    
    for (let i = diffDays; i >= 0; i--) {
      const d = new Date(end);
      d.setDate(d.getDate() - i);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const val = mockValues[(diffDays - i) % 7];
      data.push({
        name: `${day}/${month}`,
        value: val
      });
    }
    return data;
  }, [fromDate, toDate]);

  const timeTotal = currentTimeData.reduce((acc, curr) => acc + curr.value, 0);

  const [sourceSystemFilter, setSourceSystemFilter] = React.useState('Trong ngành');
  const [sourceMetric, setSourceMetric] = React.useState<'services' | 'records' | 'dataSizeGB'>('services');
  const [sourceDateFrom, setSourceDateFrom] = React.useState('');
  const [sourceDateTo, setSourceDateTo] = React.useState('');

  const getSourceScopeData = (): SourceMetricItem[] => {
    switch(sourceSystemFilter) {
      case 'Trong ngành': return sourceDataInternal;
      case 'Ngoài ngành': return sourceDataExternal;
      case 'Tất cả hệ thống':
      default: return sourceDataAll;
    }
  };

  const sourceScopeData = getSourceScopeData();
  const sourceDateScale = getSourceDateScale(sourceDateFrom, sourceDateTo);
  const currentSourceData = sourceScopeData
    .map(item => ({ name: item.name, value: Math.round(item[sourceMetric] * sourceDateScale) }));
  const sourceTotal = currentSourceData.reduce((acc, curr) => acc + curr.value, 0);

  // Dịch vụ lỗi cập nhật
  const [errorPage, setErrorPage] = React.useState(0);
  const errorServices = collectionServiceStatusData.filter(s => s.status === 'error');
  const ERROR_PAGE_SIZE = 3;
  const errorTotalPages = Math.max(1, Math.ceil(errorServices.length / ERROR_PAGE_SIZE));
  const errorPageItems = errorServices.slice(errorPage * ERROR_PAGE_SIZE, errorPage * ERROR_PAGE_SIZE + ERROR_PAGE_SIZE);

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
      <div className="space-y-3">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <SummaryCard
          title="Tổng số bản ghi đã thu thập"
          value={2548750}
          icon={<Database className="w-7 h-7" />}
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <SummaryCard
          title="Tổng số bản ghi thu thập ngoài ngành"
          value={1345280}
          icon={<Building2 className="w-7 h-7" />}
          bgColor="bg-cyan-50"
          iconColor="text-cyan-600"
        />
        <SummaryCard
          title="Tổng số bản ghi thu thập trong ngành"
          value={1203470}
          icon={<Building className="w-7 h-7" />}
          bgColor="bg-violet-50"
          iconColor="text-violet-600"
        />
      </div>


      {/* Khối trên: cột trái 2 biểu đồ tròn (hẹp, xếp dọc) · cột phải biểu đồ nguồn cung cấp (rộng) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="grid grid-cols-1 gap-3 lg:col-span-1">
          <ChartCard
            title="Biểu đồ thu thập dữ liệu theo phương thức thu thập"
            total={100}
            data={methodData}
            chartType="pie"
            colors={METHOD_COLORS}
          />
          <ChartCard
            title="Biểu đồ thu thập dữ liệu theo kết quả thu thập"
            total={1490}
            data={resultData}
            chartType="pie"
            colors={RESULT_COLORS}
          />
        </div>
        <div className="lg:col-span-2 h-full">
          <ChartCard
            title="Biểu đồ thu thập dữ liệu theo nguồn cung cấp dữ liệu"
            total={sourceTotal}
            data={currentSourceData}
            chartType="bar"
            filterValue={sourceSystemFilter}
            onFilterChange={setSourceSystemFilter}
            filterOptions={['Trong ngành', 'Ngoài ngành']}
            renderFilter={
              <div className="mb-4">
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                    {SOURCE_METRIC_OPTIONS.map(option => (
                      <button
                        key={option.key}
                        onClick={() => setSourceMetric(option.key)}
                        className={`px-3 py-1.5 text-[13px] rounded-md transition-colors ${
                          sourceMetric === option.key
                            ? 'bg-white text-blue-600 shadow-sm font-semibold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-1.5">
                    <input
                      type="date"
                      value={sourceDateFrom}
                      onChange={(e) => setSourceDateFrom(e.target.value)}
                      className="text-[12px] bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700"
                    />
                    <span className="text-slate-400 text-[12px]">đến</span>
                    <input
                      type="date"
                      value={sourceDateTo}
                      onChange={(e) => setSourceDateTo(e.target.value)}
                      className="text-[12px] bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700"
                    />
                    {(sourceDateFrom || sourceDateTo) && (
                      <button
                        onClick={() => { setSourceDateFrom(''); setSourceDateTo(''); }}
                        className="text-[12px] text-slate-500 hover:text-slate-800 px-1.5"
                        title="Bỏ lọc thời gian"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </div>

      {/* Khối dưới: cột trái Danh sách dịch vụ thu thập lỗi (hẹp) · cột phải biểu đồ theo thời gian (rộng) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="grid grid-cols-1 gap-3 lg:col-span-1">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <h3 className="text-slate-900 font-semibold uppercase text-[13px] tracking-wide">
                  Danh sách dịch vụ thu thập lỗi ({errorServices.length})
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setErrorPage(p => Math.max(0, p - 1))}
                  disabled={errorPage === 0}
                  className="p-1 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setErrorPage(p => Math.min(errorTotalPages - 1, p + 1))}
                  disabled={errorPage >= errorTotalPages - 1}
                  className="p-1 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              {errorPageItems.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-[13px]">Không có dịch vụ lỗi cập nhật</div>
              )}
              {errorPageItems.map(service => (
                <div key={service.id} className="border border-slate-200 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[13px] font-semibold text-slate-900 leading-snug">{service.name}</span>
                    <span className="flex-shrink-0 px-2 py-0.5 text-[11px] font-bold bg-red-100 text-red-700 rounded-full whitespace-nowrap">
                      LỖI CẬP NHẬT
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-slate-600 mb-1">
                    <Database className="w-3.5 h-3.5 text-slate-400" />
                    {service.source}
                  </div>
                  <div className="flex items-center justify-between text-[12px] text-slate-600 mb-2">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {service.lastSync}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      {service.dataSizeLabel}
                    </div>
                  </div>
                  <button
                    onClick={() => goToServiceHistory(service.name)}
                    className="flex items-center gap-1 text-[12px] font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Xem chi tiết <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 h-full">
          <ChartCard
            title="Biểu đồ thu thập dữ liệu theo thời gian"
            total={timeTotal}
            data={currentTimeData}
            chartType="line"
            headerRight={
              <div className="flex items-center gap-2">
                <label className="text-[13px] text-slate-500 font-medium whitespace-nowrap">Từ ngày</label>
                <input
                  type="date"
                  max={toDate || today}
                  value={fromDate}
                  onChange={(e) => handleFromDateChange(e.target.value)}
                  className="w-40 px-2.5 py-1.5 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />
                <label className="text-[13px] text-slate-500 font-medium whitespace-nowrap ml-2">Đến ngày</label>
                <input
                  type="date"
                  max={today}
                  min={fromDate}
                  value={toDate}
                  onChange={(e) => handleToDateChange(e.target.value)}
                  className="w-40 px-2.5 py-1.5 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />
              </div>
            }
          />
        </div>
      </div>
    </div>
    </div>
  );
}