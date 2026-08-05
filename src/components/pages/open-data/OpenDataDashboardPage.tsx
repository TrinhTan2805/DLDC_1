import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[18px] font-bold text-slate-800">Tổng quan dữ liệu mở</h1>
        <p className="text-sm text-slate-500 mt-1">
          Tổng hợp quy trình phê duyệt, công bố và lượt chia sẻ theo API của danh mục dữ liệu mở
        </p>
      </div>

      {/* Quy trình phê duyệt và công bố (donut) - mỗi bước 1 ô, căn đều 2 bên */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <p className="text-[16px] font-bold text-slate-800 mb-4">
          Tỷ lệ xử lý qua từng bước, tính trên tổng {openDataFunnelStats.totalCreated.toLocaleString('vi-VN')} danh mục đã tạo
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {openDataFunnelSteps.map(step => (
            <div key={step.label} className="border border-slate-200 rounded-lg p-6 flex flex-col items-center">
              <div className="relative" style={{ width: 160, height: 160 }}>
                <span
                  className="absolute -right-6 top-1/2 -translate-y-1/2 text-[13px] font-bold"
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
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar dataKey="value" cornerRadius={20} fill={step.color} background={{ fill: '#f1f5f9' }} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold leading-tight" style={{ color: step.color }}>{step.value.toLocaleString('vi-VN')}</span>
                  <div className="w-6 border-t-2 border-slate-300 my-0.5" />
                  <span className="text-sm text-slate-400 leading-tight">{step.base.toLocaleString('vi-VN')}</span>
                </div>
              </div>
              <p className="text-[12px] text-slate-600 text-center mt-3 leading-tight">{step.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lượt chia sẻ theo API */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h4 className="text-[16px] font-bold text-slate-800 mb-4">Lượt chia sẻ theo API của danh mục đã công bố</h4>
          <div className="overflow-y-auto space-y-3" style={{ maxHeight: 420 }}>
            {apiSharesByOpenData.map((item, i) => (
              <div key={item.name}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-[13px] font-medium text-slate-900 flex-1 truncate" title={item.name}>{item.name}</span>
                  <span className="text-[11px] text-slate-500 whitespace-nowrap">{item.shares.toLocaleString('vi-VN')} lượt</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-cyan-400" style={{ width: `${(item.shares / maxApiShares) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Xu hướng biến động số lượng danh mục 6 tháng gần nhất */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h4 className="text-[16px] font-bold text-slate-800 mb-6">Xu hướng biến động số lượng danh mục 6 tháng gần nhất</h4>
          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={openDataCountTrendData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
              <Bar dataKey="total" name="Tổng số danh mục" fill="#059669" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
