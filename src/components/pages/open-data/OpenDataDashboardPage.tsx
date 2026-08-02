import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

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
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Tổng quan dữ liệu mở</h1>
        <p className="text-sm text-slate-500 mt-1">
          Tổng hợp quy trình phê duyệt, công bố và lượt chia sẻ theo API của danh mục dữ liệu mở
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-slate-200 rounded-lg p-4">
            <h4 className="text-slate-800 font-medium mb-1">Xử lý quy trình phê duyệt và công bố danh mục dữ liệu mở</h4>
            <p className="text-[12px] text-slate-500 mb-4">Tỷ lệ xử lý qua từng bước, tính trên tổng {openDataFunnelStats.totalCreated.toLocaleString('vi-VN')} danh mục đã tạo</p>
            <div className="grid grid-cols-2 gap-3">
              {openDataFunnelSteps.map(step => (
                <div key={step.label} className="border border-slate-100 rounded-lg p-3 flex flex-col items-center">
                  <div className="relative" style={{ width: 110, height: 110 }}>
                    <ResponsiveContainer width={110} height={110}>
                      <RadialBarChart
                        data={[{ value: step.percent }]}
                        innerRadius="72%"
                        outerRadius="100%"
                        startAngle={90}
                        endAngle={-270}
                        barSize={10}
                      >
                        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                        <RadialBar dataKey="value" cornerRadius={20} fill={step.color} background={{ fill: '#f1f5f9' }} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-base font-bold" style={{ color: step.color }}>{step.value.toLocaleString('vi-VN')}</span>
                      <span className="text-[11px] text-slate-400">/ {step.base.toLocaleString('vi-VN')}</span>
                      <span className="text-[11px] text-slate-500">{step.percent}%</span>
                    </div>
                  </div>
                  <p className="text-[12px] text-slate-600 text-center mt-2">{step.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-4">
            <h4 className="text-slate-800 font-medium mb-3">Lượt chia sẻ theo API của danh mục đã công bố</h4>
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
        </div>
      </div>
    </div>
  );
}
