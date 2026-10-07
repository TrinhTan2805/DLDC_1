import React, { useState } from 'react';
import {
  FolderTree,
  Database,
  CheckCircle2,
  Clock,
  TrendingUp
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label
} from 'recharts';

const BarChartAny = BarChart as any;
const BarAny = Bar as any;
const XAxisAny = XAxis as any;
const YAxisAny = YAxis as any;
const CartesianGridAny = CartesianGrid as any;
const TooltipAny = Tooltip as any;
const LegendAny = Legend as any;
const ResponsiveContainerAny = ResponsiveContainer as any;
const PieChartAny = PieChart as any;
const PieAny = Pie as any;
const CellAny = Cell as any;
const LabelAny = Label as any;

// Tooltip biểu đồ: chữ 12px, viền #E2E8F0, bo 8px, không shadow
const CHART_TOOLTIP_STYLE = { borderRadius: 8, border: '1px solid #E2E8F0', boxShadow: 'none', fontSize: 12, color: '#64748B' };


export function CategoryDashboardPage() {
  // Mock Data cho Dashboard [Unverified]
  const stats = {
    totalCategories: 124,
    activeCategories: 110,
    pendingApprovals: 5,
    apisInUse: 32
  };

  // 24 Danh mục dùng chung theo Phụ lục I, mục I.2 - Quyết định 1634/QĐ-BTP ngày 30/6/2026
  // Tên danh mục lấy từ văn bản đã cung cấp; số lượng bản ghi/lượt chia sẻ là dữ liệu mock [Unverified]
  const commonCategoryList = [
    'Hình thức trợ giúp pháp lý',
    'Lĩnh vực trợ giúp pháp lý',
    'Diện người được trợ giúp pháp lý',
    'Loại biện pháp bảo đảm',
    'Loại hợp đồng giao dịch bảo đảm',
    'Loại thay đổi quốc tịch',
    'Mã giấy tờ hộ tịch',
    'Tình trạng hôn nhân',
    'Mã sổ hộ tịch',
    'Loại đăng ký kết hôn',
    'Loại việc hộ tịch',
    'Loại việc đăng ký thay đổi, cải chính, bổ sung hộ tịch, xác định lại dân tộc',
    'Loại mục đích sử dụng xác nhận tình trạng hôn nhân',
    'Loại đăng ký giám hộ',
    'Loại giám hộ',
    'Loại đăng ký nhận cha mẹ con',
    'Loại xác nhận cha mẹ con',
    'Loại đăng ký khai sinh',
    'Loại khai sinh',
    'Loại giấy báo tử',
    'Loại giao dịch công chứng',
    'Hình thức tổ chức hành nghề công chứng',
    'Loại quyết định thi hành án',
    'Trạng thái thi hành án',
  ];

  // Danh mục dùng chung - Lượt truy cập API theo danh mục [Unverified]
  const categoryApiAccessCounts = [
    5, 3, 8, 12, 15, 2, 21, 10, 17, 7,
    23, 6, 4, 3, 5, 9, 8, 28, 26, 6,
    32, 3, 19, 11,
  ];

  const categoryCombinedData = commonCategoryList
    .map((category, i) => ({ category, accessCount: categoryApiAccessCounts[i] }))
    .sort((a, b) => b.accessCount - a.accessCount);
  const maxAccessCount = Math.max(...categoryCombinedData.map(d => d.accessCount));

  // Xu hướng biến động số lượng danh mục 6 tháng gần nhất [Unverified] - chốt tại stats.totalCategories (124)
  const categoryCountTrendData = [
    { month: 'Tháng 1', total: 98 },
    { month: 'Tháng 2', total: 104 },
    { month: 'Tháng 3', total: 110 },
    { month: 'Tháng 4', total: 115 },
    { month: 'Tháng 5', total: 120 },
    { month: 'Tháng 6', total: 124 }
  ];

  // Thị phần danh mục dùng chung theo nguồn dữ liệu [Unverified] - tổng khớp với stats.totalCategories
  const categorySourceShare = [
    { name: 'Đồng bộ từ TTDLQG', value: 57, color: '#155DFC' },
    { name: 'Kho DLDC', value: 47, color: '#10B981' },
    { name: 'Tự cập nhật trực tiếp', value: 20, color: '#D97706' },
  ];
  const categorySourceTotal = categorySourceShare.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-[#2A0F0F] leading-8">Tổng quan danh mục</h1>
          <p className="text-[13px] text-[#64748B] mt-1">
            Giám sát số liệu và hoạt động quản trị danh mục
          </p>
        </div>
      </div>

      {/* Stats Cards (compomennt.md 5.6.1) */}
      {/* Thẻ header màn tổng quan: giữ kích thước lớn để cân với biểu đồ bên dưới (compomennt.md 5.6.1 – ngoại lệ màn Tổng quan) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <FolderTree className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-[13px] font-medium text-[#16A34A] bg-[#F0FDF4] px-2 py-1 rounded-full">
              <TrendingUp className="w-4 h-4" /> +12%
            </span>
          </div>
          <h3 className="text-[30px] leading-9 font-bold text-[#0F172A]">{stats.totalCategories}</h3>
          <p className="text-[14px] font-medium text-[#64748B] mt-1">Tổng số danh mục</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-[30px] leading-9 font-bold text-[#0F172A]">{stats.activeCategories}</h3>
          <p className="text-[14px] font-medium text-[#64748B] mt-1">Danh mục đang hoạt động</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-[30px] leading-9 font-bold text-[#0F172A]">{stats.pendingApprovals}</h3>
          <p className="text-[14px] font-medium text-[#64748B] mt-1">Yêu cầu chờ phê duyệt</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-[30px] leading-9 font-bold text-[#0F172A]">{stats.apisInUse}</h3>
          <p className="text-[14px] font-medium text-[#64748B] mt-1">Số API đang khai thác</p>
        </div>

      </div>

      {/* Charts Row 1: Ranked list + Thị phần theo nguồn dữ liệu */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* Ranked list: Lượt truy cập API theo danh mục */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex flex-col h-[800px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-medium text-[#020817]">Lượt truy cập API theo danh mục</h3>
            <div className="flex items-center gap-3 text-[12px] text-[#64748B] shrink-0">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full inline-block bg-[#06B6D4]" />Lượt truy cập</span>
            </div>
          </div>
          <div className="overflow-y-auto custom-scrollbar space-y-3 flex-1 min-h-0">
            {categoryCombinedData.map((item, i) => (
              <div key={item.category}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#F1F5F9] text-[#475569] text-[12px] flex items-center justify-center flex-shrink-0 tabular-nums">
                    {i + 1}
                  </span>
                  <span className="text-[13px] text-[#020817] flex-1 truncate" title={item.category}>{item.category}</span>
                  <span className="text-[12px] text-[#64748B] whitespace-nowrap tabular-nums">{item.accessCount.toLocaleString('vi-VN')} lượt</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                  <div className="h-full rounded-full bg-[#06B6D4]" style={{ width: `${(item.accessCount / maxAccessCount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cột phải: Thị phần theo nguồn dữ liệu + Tần suất cập nhật & Tạo mới */}
        <div className="flex flex-col gap-4">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex flex-col">
          <h3 className="text-[14px] font-medium text-[#020817] mb-3">Tỷ lệ danh mục theo nguồn dữ liệu</h3>
          <ResponsiveContainerAny width="100%" height={240}>
            <PieChartAny margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
              <PieAny
                data={categorySourceShare}
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
                  const color = categorySourceShare[index].color;
                  return (
                    <text
                      x={x}
                      y={y}
                      fill={color}
                      textAnchor={x > cx ? 'start' : 'end'}
                      dominantBaseline="central"
                      fontSize={12}
                      fontWeight={600}
                    >
                      {`${Math.round(percent * 100)}%`}
                    </text>
                  );
                }}
              >
                {categorySourceShare.map(entry => (
                  <CellAny key={entry.name} fill={entry.color} />
                ))}
                <LabelAny
                  position="center"
                  content={({ viewBox }: any) => {
                    const { cx, cy } = viewBox;
                    return (
                      <g>
                        <text x={cx} y={cy - 12} textAnchor="middle" dominantBaseline="central" fill="#64748B" fontSize={12}>
                          Tổng số
                        </text>
                        <text x={cx} y={cy + 12} textAnchor="middle" dominantBaseline="central" fill="#0F172A" fontSize={20} fontWeight={600}>
                          {categorySourceTotal.toLocaleString('vi-VN')}
                        </text>
                      </g>
                    );
                  }}
                />
              </PieAny>
              <TooltipAny
                formatter={(value: number) => value.toLocaleString('vi-VN')}
                contentStyle={CHART_TOOLTIP_STYLE}
              />
            </PieChartAny>
          </ResponsiveContainerAny>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 mt-2 text-[12px]">
            {categorySourceShare.map(item => (
              <span key={item.name} className="flex items-center gap-1.5 text-[#64748B]">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                {item.name}
              </span>
            ))}
          </div>
        </div>

        {/* Xu hướng biến động số lượng danh mục 6 tháng gần nhất */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
          <h3 className="text-[14px] font-medium text-[#020817] mb-3">Xu hướng biến động số lượng danh mục 6 tháng gần nhất</h3>
          <div className="h-[320px]">
            <ResponsiveContainerAny width="100%" height={320}>
              <BarChartAny
                data={categoryCountTrendData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGridAny strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxisAny dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                <YAxisAny axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <TooltipAny
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={CHART_TOOLTIP_STYLE}
                />
                <LegendAny
                  wrapperStyle={{ paddingTop: '20px', fontSize: 12 }}
                  iconType="circle"
                  formatter={(value: string) => <span style={{ color: '#64748B' }}>{value}</span>}
                />
                <BarAny dataKey="total" name="Tổng số danh mục" fill="#155DFC" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChartAny>
            </ResponsiveContainerAny>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
