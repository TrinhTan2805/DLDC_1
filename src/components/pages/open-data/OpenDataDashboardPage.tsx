import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const RadialBarAny = RadialBar as any;
const PolarAngleAxisAny = PolarAngleAxis as any;
const BarAny = Bar as any;
const XAxisAny = XAxis as any;
const YAxisAny = YAxis as any;
const TooltipAny = Tooltip as any;
const LegendAny = Legend as any;

// Tooltip biểu đồ: chữ 12px, viền #E2E8F0, bo 8px, không shadow
const CHART_TOOLTIP_STYLE = { borderRadius: 8, border: '1px solid #E2E8F0', boxShadow: 'none', fontSize: 12, color: '#64748B' };

// Dữ liệu mở - Quy trình phê duyệt và công bố danh mục dữ liệu mở [Unverified]
const openDataFunnelStats = {
  totalCreated: 27,
  approved: 24,
  submitted: 21,
  published: 20,
  shared: 14,
};
const openDataFunnelSteps = [
  { label: 'Đã phê duyệt / Tổng đã tạo', value: openDataFunnelStats.approved, base: openDataFunnelStats.totalCreated, color: '#3b82f6' },
  { label: 'Đã gửi công bố / Đã phê duyệt', value: openDataFunnelStats.submitted, base: openDataFunnelStats.approved, color: '#22c55e' },
  { label: 'Đã công bố / Đã gửi công bố', value: openDataFunnelStats.published, base: openDataFunnelStats.submitted, color: '#f59e0b' },
  { label: 'Đã thực hiện chia sẻ / Đã công bố', value: openDataFunnelStats.shared, base: openDataFunnelStats.published, color: '#a855f7' },
].map(step => ({ ...step, percent: Math.round((step.value / step.base) * 100) }));

// Xu hướng biến động số lượng danh mục dữ liệu mở 6 tháng gần nhất [Unverified] - chốt tại openDataFunnelStats.totalCreated (27)
const openDataCountTrendData = [
  { month: 'Tháng 1', total: 19 },
  { month: 'Tháng 2', total: 21 },
  { month: 'Tháng 3', total: 23 },
  { month: 'Tháng 4', total: 24 },
  { month: 'Tháng 5', total: 26 },
  { month: 'Tháng 6', total: 27 }
];

// Danh sách tập dữ liệu mở theo Phụ lục II - Quyết định 1634/QĐ-BTP ngày 30/6/2026
// Tên tập dữ liệu lấy từ văn bản đã cung cấp; số lượt chia sẻ là dữ liệu mock [Unverified]
const openDataPublishedDatasets = [
  'Danh sách tổ chức thực hiện trợ giúp pháp lý',
  'Danh sách người thực hiện trợ giúp pháp lý',
  'Danh sách Luật sư Việt Nam',
  'Danh sách Tổ chức hành nghề Luật sư Việt Nam',
  'Danh sách chi nhánh Tổ chức hành nghề Luật sư',
  'Danh sách Luật sư nước ngoài',
  'Danh sách Tổ chức hành nghề Luật sư nước ngoài',
  'Danh sách chi nhánh Tổ chức hành nghề Luật sư nước ngoài',
  'Danh sách Tư vấn viên pháp luật',
  'Danh sách Trung tâm tư vấn pháp luật',
  'Danh sách chi nhánh Trung tâm tư vấn pháp luật',
  'Danh sách công chứng viên Việt Nam',
  'Danh sách tổ chức hành nghề công chứng',
  'Danh sách quản tài viên Việt Nam',
  'Danh sách doanh nghiệp quản lý, thanh lý tài sản',
  'Danh sách đấu giá viên',
  'Danh sách tổ chức hành nghề đấu giá',
  'Danh sách giám định viên tư pháp',
  'Danh sách tổ chức giám định tư pháp',
  'Danh sách trọng tài viên thương mại',
  'Danh sách trung tâm trọng tài thương mại',
  'Danh sách hòa giải viên thương mại',
  'Danh sách trung tâm hòa giải thương mại',
  'Danh sách Báo cáo viên pháp luật trung ương',
  'Dữ liệu thống kê ngành Tư pháp',
  'Tài sản thi hành án được đưa ra bán đấu giá',
  'Dữ liệu người phải thi hành án chưa có điều kiện thi hành',
];

// Dữ liệu mở - Lượt chia sẻ theo API của các danh mục đã công bố [Unverified]
const apiSharesByOpenDataCounts = [
  45, 12, 980, 340, 62, 8, 4, 2, 56, 21,
  7, 210, 96, 26, 11, 48, 22, 68, 15, 24,
  3, 17, 2, 9, 1, 320, 540,
];
const apiSharesByOpenData = openDataPublishedDatasets
  .map((name, i) => ({ name, shares: apiSharesByOpenDataCounts[i] ?? 0 }))
  .sort((a, b) => b.shares - a.shares);
const maxApiShares = Math.max(...apiSharesByOpenData.map(d => d.shares));

export function OpenDataDashboardPage() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-[20px] font-bold text-[#2A0F0F] leading-8">Tổng quan dữ liệu mở</h1>
        <p className="text-[13px] text-[#64748B] mt-1">
          Tổng hợp quy trình phê duyệt, công bố và lượt chia sẻ theo API của danh mục dữ liệu mở
        </p>
      </div>

      {/* Quy trình phê duyệt và công bố (donut) - mỗi bước 1 ô, căn đều 2 bên */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
        <h3 className="text-[14px] font-medium text-[#020817] mb-3">
          Tỷ lệ xử lý qua từng bước, tính trên tổng {openDataFunnelStats.totalCreated.toLocaleString('vi-VN')} danh mục đã tạo
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {openDataFunnelSteps.map(step => (
            <div key={step.label} className="border border-[#E2E8F0] rounded-lg p-6 flex flex-col items-center">
              <div className="relative" style={{ width: 160, height: 160 }}>
                <span
                  className="absolute -right-6 top-1/2 -translate-y-1/2 text-[13px] font-semibold tabular-nums"
                  style={{ color: step.color }}
                >
                  {step.percent}%
                </span>
                <ResponsiveContainer width={160} height={160}>
                  <RadialBarChart
                    data={[{ value: step.percent }]}
                    innerRadius="72%"
                    outerRadius="100%"
                    startAngle={90}
                    endAngle={-270}
                    barSize={12}
                  >
                    <PolarAngleAxisAny type="number" domain={[0, 100]} tick={false} />
                    <RadialBarAny dataKey="value" cornerRadius={20} fill={step.color} background={{ fill: '#F1F5F9' }} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[24px] font-bold leading-tight tabular-nums" style={{ color: step.color }}>{step.value.toLocaleString('vi-VN')}</span>
                  <div className="w-6 border-t-2 border-[#CBD5E1] my-0.5" />
                  <span className="text-[14px] text-[#94A3B8] leading-tight tabular-nums">{step.base.toLocaleString('vi-VN')}</span>
                </div>
              </div>
              <p className="text-[12px] text-[#475569] text-center mt-3 leading-tight">{step.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Lượt chia sẻ theo API */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-medium text-[#020817]">Lượt chia sẻ theo API của danh mục đã công bố</h3>
            <div className="flex items-center gap-3 text-[12px] text-[#64748B] shrink-0">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full inline-block bg-cyan-400" />Lượt chia sẻ</span>
            </div>
          </div>
          <div className="overflow-y-auto custom-scrollbar space-y-3" style={{ maxHeight: 420 }}>
            {apiSharesByOpenData.map((item, i) => (
              <div key={item.name}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#F1F5F9] text-[#475569] text-[12px] flex items-center justify-center flex-shrink-0 tabular-nums">
                    {i + 1}
                  </span>
                  <span className="text-[13px] text-[#020817] flex-1 truncate" title={item.name}>{item.name}</span>
                  <span className="text-[12px] text-[#64748B] whitespace-nowrap tabular-nums">{item.shares.toLocaleString('vi-VN')} lượt</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                  <div className="h-full rounded-full bg-cyan-400" style={{ width: `${(item.shares / maxApiShares) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Xu hướng biến động số lượng danh mục 6 tháng gần nhất */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
          <h3 className="text-[14px] font-medium text-[#020817] mb-3">Xu hướng biến động số lượng danh mục 6 tháng gần nhất</h3>
          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={openDataCountTrendData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
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
              <BarAny dataKey="total" name="Tổng số danh mục" fill="#059669" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
