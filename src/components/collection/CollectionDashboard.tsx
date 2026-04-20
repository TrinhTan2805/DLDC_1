import * as React from 'react';
import { Download, Database, Building2, Building } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const methodData = [
  { name: 'API RESTful', value: 45 },
  { name: 'API SOAP', value: 28 },
  { name: 'Database', value: 15 },
  { name: 'FTP/SFTP', value: 7 },
  { name: 'File Upload', value: 5 },
];

const sourceData = [
  { name: 'Cục hành chính tư pháp', value: 345 },
  { name: 'Cục thi hành án', value: 287 },
  { name: 'Cục bổ trợ tư pháp', value: 256 },
  { name: 'Vụ Hợp tác quốc tế', value: 178 },
];

const resultData = [
  { name: 'Thành công', value: 1245 },
  { name: 'Thất bại', value: 156 },
  { name: 'Đang xử lý', value: 89 },
];

const timeData = [
  { name: '00:00', value: 123 },
  { name: '04:00', value: 87 },
  { name: '08:00', value: 245 },
  { name: '12:00', value: 389 },
  { name: '16:00', value: 421 },
  { name: '20:00', value: 165 },
];

const trendData = [
  { id: 'trend-1', name: 'T1', value: 645000 },
  { id: 'trend-2', name: 'T2', value: 658000 },
  { id: 'trend-3', name: 'T3', value: 670000 },
  { id: 'trend-4', name: 'T4', value: 685000 },
  { id: 'trend-5', name: 'T5', value: 692000 },
  { id: 'trend-6', name: 'T6', value: 705000 },
  { id: 'trend-7', name: 'T7', value: 718000 },
  { id: 'trend-8', name: 'T8', value: 710000 },
  { id: 'trend-9', name: 'T9', value: 725000 },
  { id: 'trend-10', name: 'T10', value: 732000 },
  { id: 'trend-11', name: 'T11', value: 745000 },
  { id: 'trend-12', name: 'T12', value: 758000 },
];

interface ChartCardProps {
  title: string;
  total: number;
  data: Array<{ name: string; value: number }>;
}

function ChartCard({ title, total, data }: ChartCardProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-slate-900">{title}</h3>
        <span className="text-sm text-slate-500">Tổng số: {total.toLocaleString()}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-4">
        <select aria-label="Select box" 
          className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          title="Chọn khoảng thời gian"
        >
          <option>Tháng này</option>
          <option>Tuần này</option>
          <option>Hôm nay</option>
          <option>Tháng trước</option>
        </select>
      </div>

      {/* Chart */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height={256}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis 
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
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
          <p className="text-sm text-slate-600 mb-1">{title}</p>
          <p className="text-2xl font-semibold text-slate-900">{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

function TrendChart() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-slate-900">Xu hướng Thu thập</h3>
          <p className="text-sm text-slate-500 mt-1">12 tháng</p>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height={256}>
          <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis 
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CollectionDashboard() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          bgColor="bg-green-50"
          iconColor="text-green-600"
        />
        <SummaryCard
          title="Tổng số bản ghi thu thập trong ngành"
          value={1203470}
          icon={<Building className="w-7 h-7" />}
          bgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* Trend Chart - Full Width */}
      <TrendChart />

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Biểu đồ thu thập dữ liệu theo phương thức thu thập"
          total={100}
          data={methodData}
        />
        <ChartCard
          title="Biểu đồ thu thập dữ liệu theo nguồn cung cấp dữ liệu"
          total={1480}
          data={sourceData}
        />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Biểu đồ thu thập dữ liệu theo kết quả thu thập"
          total={1490}
          data={resultData}
        />
        <ChartCard
          title="Biểu đồ thu thập dữ liệu theo thời gian"
          total={1430}
          data={timeData}
        />
      </div>
    </div>
  );
}