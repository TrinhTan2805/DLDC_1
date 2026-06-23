import * as React from 'react';
import { Download, Database, Building2, Building } from 'lucide-react';
import { BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, Legend, Label, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

const sourceDataAll = [
  { name: 'Cục hành chính tư pháp', value: 345 },
  { name: 'Cục thi hành án', value: 287 },
  { name: 'Cục bổ trợ tư pháp', value: 256 },
  { name: 'Vụ Hợp tác quốc tế', value: 178 },
  { name: 'Bộ Nội vụ', value: 210 },
  { name: 'Bộ Công an', value: 190 },
];

const sourceDataInternal = [
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
];

const sourceDataExternal = [
  { name: 'Bộ Nội vụ', value: 210 },
  { name: 'Bộ Công an', value: 190 },
  { name: 'Bộ Tài chính', value: 150 },
  { name: 'Bộ Y tế', value: 120 },
];

const resultData = [
  { name: 'Bản nháp', value: 156 },
  { name: 'Hoạt động', value: 1245 },
  { name: 'Ngưng hoạt động', value: 89 },
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

  const getSourceData = () => {
    switch(sourceSystemFilter) {
      case 'Trong ngành': return sourceDataInternal;
      case 'Ngoài ngành': return sourceDataExternal;
      case 'Tất cả hệ thống':
      default: return sourceDataAll;
    }
  };

  const currentSourceData = getSourceData();
  const sourceTotal = currentSourceData.reduce((acc, curr) => acc + curr.value, 0);

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
          />
        </div>
      </div>

      {/* Biểu đồ theo thời gian (full width) */}
      <div className="grid grid-cols-1 gap-3">
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
  );
}