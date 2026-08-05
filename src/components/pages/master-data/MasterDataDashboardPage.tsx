import { Database, CheckCircle2, Layers, Share2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Label } from 'recharts';

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

// Danh sách tập dữ liệu mở theo Phụ lục II - Quyết định 1634/QĐ-BTP ngày 30/6/2026
// Tên tập dữ liệu lấy từ văn bản đã cung cấp; số bản ghi là dữ liệu mock [Unverified]
const masterDataPublishedOnOpenData = [
  { name: 'Danh sách tổ chức thực hiện trợ giúp pháp lý', records: 63 },
  { name: 'Danh sách người thực hiện trợ giúp pháp lý', records: 210 },
  { name: 'Danh sách Luật sư Việt Nam', records: 18450 },
  { name: 'Danh sách Tổ chức hành nghề Luật sư Việt Nam', records: 4820 },
  { name: 'Danh sách chi nhánh Tổ chức hành nghề Luật sư', records: 960 },
  { name: 'Danh sách Luật sư nước ngoài', records: 145 },
  { name: 'Danh sách Tổ chức hành nghề Luật sư nước ngoài', records: 62 },
  { name: 'Danh sách chi nhánh Tổ chức hành nghề Luật sư nước ngoài', records: 24 },
  { name: 'Danh sách Tư vấn viên pháp luật', records: 890 },
  { name: 'Danh sách Trung tâm tư vấn pháp luật', records: 320 },
  { name: 'Danh sách chi nhánh Trung tâm tư vấn pháp luật', records: 105 },
  { name: 'Danh sách công chứng viên Việt Nam', records: 3260 },
  { name: 'Danh sách tổ chức hành nghề công chứng', records: 1480 },
  { name: 'Danh sách quản tài viên Việt Nam', records: 410 },
  { name: 'Danh sách doanh nghiệp quản lý, thanh lý tài sản', records: 180 },
  { name: 'Danh sách đấu giá viên', records: 720 },
  { name: 'Danh sách tổ chức hành nghề đấu giá', records: 340 },
  { name: 'Danh sách giám định viên tư pháp', records: 1050 },
  { name: 'Danh sách tổ chức giám định tư pháp', records: 230 },
  { name: 'Danh sách trọng tài viên thương mại', records: 380 },
  { name: 'Danh sách trung tâm trọng tài thương mại', records: 42 },
  { name: 'Danh sách hòa giải viên thương mại', records: 260 },
  { name: 'Danh sách trung tâm hòa giải thương mại', records: 28 },
  { name: 'Danh sách Báo cáo viên pháp luật trung ương', records: 150 },
  { name: 'Dữ liệu thống kê ngành Tư pháp', records: 25 },
  { name: 'Tài sản thi hành án được đưa ra bán đấu giá', records: 5600 },
  { name: 'Dữ liệu người phải thi hành án chưa có điều kiện thi hành', records: 8300 },
];

// Thẻ header tổng quan dữ liệu chủ [Unverified] (tổng số mô hình và số hệ thống khai thác là dữ liệu mock;
// số mô hình đã công khai và tổng bản ghi tính từ danh sách công khai trên Cổng dữ liệu mở)
const masterDataStats = {
  totalModels: 32,
  publishedModels: masterDataPublishedOnOpenData.length,
  totalRecords: masterDataPublishedOnOpenData.reduce((sum, item) => sum + item.records, 0),
  apisInUse: 18,
};

// Số lượng đơn vị khai thác theo mô hình dữ liệu chủ [Unverified]
const masterDataUnitsInUseCounts = [
  4, 7, 28, 22, 12, 6, 4, 2, 15, 9,
  5, 20, 16, 8, 5, 11, 7, 14, 6, 9,
  3, 8, 2, 6, 2, 24, 26,
];
const masterDataUnitsRanked = masterDataPublishedOnOpenData
  .map((item, i) => ({ name: item.name, unitsInUse: masterDataUnitsInUseCounts[i] }))
  .sort((a, b) => b.unitsInUse - a.unitsInUse);
const maxMasterDataUnitsInUse = Math.max(...masterDataUnitsRanked.map(d => d.unitsInUse));

// Tỷ lệ dữ liệu chủ theo nguồn dữ liệu [Unverified]
const masterDataSourceShare = [
  { name: 'Kho DLDC', value: 12, color: '#10b981' },
  { name: 'Tự cập nhật trực tiếp', value: 5, color: '#f59e0b' },
];
const masterDataSourceTotal = masterDataSourceShare.reduce((sum, item) => sum + item.value, 0);

// Xu hướng biến động số lượng mô hình dữ liệu chủ 6 tháng gần nhất [Unverified] - chốt tại masterDataStats.totalModels (32)
const masterDataCountTrendData = [
  { month: 'Tháng 1', total: 23 },
  { month: 'Tháng 2', total: 25 },
  { month: 'Tháng 3', total: 27 },
  { month: 'Tháng 4', total: 29 },
  { month: 'Tháng 5', total: 30 },
  { month: 'Tháng 6', total: 32 }
];

export function MasterDataDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[18px] font-bold text-slate-800">Tổng quan dữ liệu chủ</h1>
        <p className="text-sm text-slate-500 mt-1">
          Tổng hợp mô hình, dung lượng và mức độ công khai dữ liệu chủ
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{masterDataStats.totalModels}</h3>
          <p className="text-sm font-medium text-slate-500 mt-1">Tổng số mô hình dữ liệu chủ</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{masterDataStats.publishedModels}</h3>
          <p className="text-sm font-medium text-slate-500 mt-1">Đã công khai trên Cổng dữ liệu mở</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{masterDataStats.totalRecords.toLocaleString('vi-VN')}</h3>
          <p className="text-sm font-medium text-slate-500 mt-1">Tổng số bản ghi dữ liệu chủ</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-4">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{masterDataStats.apisInUse}</h3>
          <p className="text-sm font-medium text-slate-500 mt-1">Số API đang khai thác</p>
        </div>
      </div>

      {/* Charts Row 1: Ranked list + Thị phần theo nguồn dữ liệu */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Ranked list: Số lượng đơn vị khai thác theo mô hình dữ liệu chủ */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[800px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-semibold text-slate-800">Số lượng đơn vị khai thác theo mô hình dữ liệu chủ</h3>
            <div className="flex items-center gap-3 text-[11px] text-slate-500 shrink-0">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-400 inline-block" />Đơn vị khai thác</span>
            </div>
          </div>
          <div className="overflow-y-auto space-y-3 flex-1 min-h-0">
            {masterDataUnitsRanked.map((item, i) => (
              <div key={item.name}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-[13px] font-medium text-slate-900 flex-1 truncate" title={item.name}>{item.name}</span>
                  <span className="text-[11px] text-slate-500 whitespace-nowrap">{item.unitsInUse.toLocaleString('vi-VN')} đơn vị</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-blue-400" style={{ width: `${(item.unitsInUse / maxMasterDataUnitsInUse) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cột phải: Thị phần theo nguồn dữ liệu + Xu hướng biến động số lượng mô hình dữ liệu chủ */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-[16px] font-semibold text-slate-800 mb-4">Tỷ lệ dữ liệu chủ theo nguồn dữ liệu</h3>
            <ResponsiveContainerAny width="100%" height={240}>
              <PieChartAny margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
                <PieAny
                  data={masterDataSourceShare}
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
                    const color = masterDataSourceShare[index].color;
                    return (
                      <text
                        x={x}
                        y={y}
                        fill={color}
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                        fontSize={14}
                        fontWeight={700}
                      >
                        {`${Math.round(percent * 100)}%`}
                      </text>
                    );
                  }}
                >
                  {masterDataSourceShare.map(entry => (
                    <CellAny key={entry.name} fill={entry.color} />
                  ))}
                  <LabelAny
                    position="center"
                    content={({ viewBox }: any) => {
                      const { cx, cy } = viewBox;
                      return (
                        <g>
                          <text x={cx} y={cy - 12} textAnchor="middle" dominantBaseline="central" fill="#64748b" fontSize={12}>
                            Tổng số
                          </text>
                          <text x={cx} y={cy + 12} textAnchor="middle" dominantBaseline="central" fill="#0f172a" fontSize={22} fontWeight={700}>
                            {masterDataSourceTotal.toLocaleString('vi-VN')}
                          </text>
                        </g>
                      );
                    }}
                  />
                </PieAny>
                <TooltipAny formatter={(value: number) => value.toLocaleString('vi-VN')} />
              </PieChartAny>
            </ResponsiveContainerAny>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 mt-2 text-[13px]">
              {masterDataSourceShare.map(item => (
                <span key={item.name} className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
              ))}
            </div>
          </div>

          {/* Xu hướng biến động số lượng mô hình dữ liệu chủ 6 tháng gần nhất */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-[16px] font-semibold text-slate-800 mb-6">Xu hướng biến động số lượng mô hình dữ liệu chủ 6 tháng gần nhất</h3>
            <div className="h-[320px]">
              <ResponsiveContainerAny width="100%" height={320}>
                <BarChartAny
                  data={masterDataCountTrendData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGridAny strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxisAny dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                  <YAxisAny axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <TooltipAny
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <LegendAny wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                  <BarAny dataKey="total" name="Tổng số mô hình" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChartAny>
              </ResponsiveContainerAny>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
