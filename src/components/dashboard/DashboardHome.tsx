import { useState } from 'react';
import { Database, CheckCircle, Share2, LayoutDashboard, TrendingUp, Users, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { BarChart, Bar, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import systemModelImage from 'figma:asset/a1c7c66a8943342e8de3958c64b5c85a2ed3b446.png';
import { KPI_LABEL_TO_SLUG } from './kpiReportData';

export function DashboardHome() {
  const [publishedModelPage, setPublishedModelPage] = useState(0);

  const goToKpiReport = (kpiId: string) => {
    const slug = KPI_LABEL_TO_SLUG[kpiId];
    if (typeof (window as any).navigateToPage === 'function') {
      (window as any).navigateToPage(`dashboard-report-${slug}`);
    }
  };

  const kpis = [
    {
      id: 'Thu thập',
      label: 'Thu thập',
      value: '4,432,981',
      subtitle: 'Tổng bản ghi',
      change: '+12.5%',
      icon: Database,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      detail: 'Tháng này: +487,234 bản ghi'
    },
    {
      id: 'Xử lý',
      label: 'Xử lý',
      value: '4,298,745',
      subtitle: 'Bản ghi đã xử lý',
      change: '+8.3%',
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200',
      detail: 'Tỷ lệ hoàn thành: 96.97%'
    },
    {
      id: 'Chia sẻ',
      label: 'Chia sẻ',
      value: '156,892',
      subtitle: 'Lượt chia sẻ',
      change: '+24.1%',
      icon: Share2,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      detail: 'Tuần này: +12,458 lượt'
    },
  ];

  // Data for Danh mục dùng chung (Horizontal Bar Chart)
  const commonCategoryData = [
    { category: 'Giới tính', count: 3, color: '#3b82f6' },
    { category: 'Dân tộc', count: 54, color: '#22c55e' },
    { category: 'Quốc gia', count: 195, color: '#8b5cf6' },
    { category: 'Tôn giáo', count: 15, color: '#f59e0b' },
    { category: 'Đơn vị hành chính', count: 63, color: '#06b6d4' },
    { category: 'Quan hệ gia đình', count: 18, color: '#ec4899' },
  ];

  // Data for Dữ liệu chủ (Area Chart - Growth over time)
  const masterDataTrendData = [
    { month: 'T1', total: 2850000, quality: 96.2 },
    { month: 'T2', total: 3120000, quality: 96.5 },
    { month: 'T3', total: 3450000, quality: 96.8 },
    { month: 'T4', total: 3780000, quality: 97.1 },
    { month: 'T5', total: 4050000, quality: 97.3 },
    { month: 'T6', total: 4298745, quality: 97.8 },
  ];

  // Top 5 mô hình dữ liệu chủ có dung lượng lớn nhất
  const topMasterDataModelsBySize = [
    { name: 'Danh mục Đơn vị hành chính', sizeGB: 4.8 },
    { name: 'Danh mục Ngành nghề kinh doanh', sizeGB: 3.2 },
    { name: 'Danh mục Quốc gia và Quốc tịch', sizeGB: 2.1 },
    { name: 'Danh mục Dân tộc', sizeGB: 1.6 },
    { name: 'Danh mục Chức danh, học hàm học vị', sizeGB: 0.9 },
  ];
  const maxMasterDataModelSize = Math.max(...topMasterDataModelsBySize.map(m => m.sizeGB));

  // Danh sách mô hình dữ liệu chủ có bản ghi được công khai trên Cổng dữ liệu mở
  const masterDataPublishedOnOpenData = [
    { name: 'Danh mục Đơn vị hành chính', records: 63, publishedAt: '15/07/2026' },
    { name: 'Danh mục Ngành nghề kinh doanh', records: 342, publishedAt: '12/07/2026' },
    { name: 'Danh mục Quốc gia và Quốc tịch', records: 195, publishedAt: '02/07/2026' },
    { name: 'Danh mục Chức danh, học hàm học vị', records: 87, publishedAt: '28/06/2026' },
    { name: 'Danh mục Dân tộc', records: 54, publishedAt: '20/06/2026' },
    { name: 'Danh mục Quan hệ gia đình', records: 18, publishedAt: '15/06/2026' },
    { name: 'Danh mục Tôn giáo', records: 15, publishedAt: '05/06/2026' },
    { name: 'Danh mục Giới tính', records: 3, publishedAt: '01/06/2026' },
  ];
  const PUBLISHED_MODEL_PAGE_SIZE = 5;
  const publishedModelTotalPages = Math.ceil(masterDataPublishedOnOpenData.length / PUBLISHED_MODEL_PAGE_SIZE);
  const publishedModelPageItems = masterDataPublishedOnOpenData.slice(
    publishedModelPage * PUBLISHED_MODEL_PAGE_SIZE,
    publishedModelPage * PUBLISHED_MODEL_PAGE_SIZE + PUBLISHED_MODEL_PAGE_SIZE
  );

  // Data for Dữ liệu mở (Stacked Bar Chart - By category)
  const openDataData = [
    { category: 'Hành chính', published: 125, pending: 23, color: '#3b82f6' },
    { category: 'Pháp luật', published: 98, pending: 15, color: '#22c55e' },
    { category: 'Tư pháp', published: 76, pending: 12, color: '#8b5cf6' },
    { category: 'Thống kê', published: 54, pending: 8, color: '#f59e0b' },
    { category: 'Dịch vụ công', published: 43, pending: 6, color: '#06b6d4' },
  ];

  // Data for Tài khoản người dùng theo tháng (Line Chart)
  const userAccountData = [
    { month: 'T1', users: 1250 },
    { month: 'T2', users: 1380 },
    { month: 'T3', users: 1520 },
    { month: 'T4', users: 1680 },
    { month: 'T5', users: 1890 },
    { month: 'T6', users: 2150 },
  ];

  // Data for Tần suất tra cứu dịch vụ (Bar Chart)
  const serviceQueryData = [
    { service: 'Hộ tịch', count: 45620 },
    { service: 'Công chứng', count: 38940 },
    { service: 'ĐKKD', count: 32150 },
    { service: 'TGPL', count: 28670 },
    { service: 'Quốc tịch', count: 22340 },
    { service: 'Hành chính', count: 19850 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Tổng quan" icon={LayoutDashboard} />

      {/* Mô hình kiến trúc hệ thống */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Phát triển Nền tảng số */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              Phát triển Nền tảng số
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              Xây dựng và phát triển các nền tảng số dùng chung của Bộ Tư pháp, đáp ứng toàn diện nhu cầu phát triển Chính phủ điện tử trong giai đoạn mới.
            </p>
          </div>

          {/* Hình thành Kho dữ liệu Hợp nhất */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              Hình thành Kho dữ liệu Hợp nhất
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              Thiết lập Kho DLDC của Bộ Tư pháp, đảm bảo khả năng kết nối, chia sẻ dữ liệu hiệu quả và an toàn trong nội bộ và với các cơ quan bên ngoài.
            </p>
          </div>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;

          return (
            <div
              key={kpi.id}
              onClick={() => goToKpiReport(kpi.id)}
              className={`bg-white rounded-xl border-2 ${kpi.borderColor} p-8 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group`}
            >
              {/* Icon & Change */}
              <div className="flex items-start justify-between mb-6">
                <div className={`${kpi.bgColor} p-4 rounded-xl group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-8 h-8 ${kpi.iconColor}`} />
                </div>
                <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-600">{kpi.change}</span>
                </div>
              </div>

              {/* Label */}
              <div className="text-slate-600 mb-2">{kpi.label}</div>

              {/* Value */}
              <div className="text-4xl text-slate-900 mb-1">{kpi.value}</div>

              {/* Subtitle */}
              <div className="text-sm text-slate-500 mb-4">{kpi.subtitle}</div>

              {/* Detail */}
              <div className="pt-4 border-t border-slate-100">
                <div className="text-xs text-slate-600">{kpi.detail}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Charts Section - Row 2 */}
      <div className="grid grid-cols-1 gap-6">
        {/* Thống kê dữ liệu chủ */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="mb-4">
            <h3 className="text-slate-900 font-semibold mb-1">Thống kê dữ liệu chủ</h3>
            <p className="text-sm text-slate-600">Tổng hợp mô hình, dung lượng và mức độ công khai dữ liệu chủ</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="text-slate-800 font-medium mb-1">Xu hướng hình thành mô hình dữ liệu chủ trong 6 tháng qua</h4>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={masterDataTrendData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => value.toLocaleString()}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#22c55e"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                    name="Tổng bản ghi"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="text-slate-800 font-medium mb-3">Top 5 mô hình dữ liệu chủ có dung lượng lớn nhất</h4>
              <div className="space-y-4">
                {topMasterDataModelsBySize.map((model, i) => {
                  const percent = (model.sizeGB / maxMasterDataModelSize) * 100;
                  const colors = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#22c55e'];
                  const color = colors[i % colors.length];
                  return (
                    <div key={model.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0"
                            style={{ backgroundColor: color }}
                          >
                            {i + 1}
                          </span>
                          <span className="text-[13px] font-semibold text-slate-900">{model.name}</span>
                        </div>
                        <span className="text-[13px] text-slate-500 whitespace-nowrap">{model.sizeGB.toLocaleString('vi-VN')} GB</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-slate-800 font-medium">Mô hình dữ liệu chủ công khai trên Cổng dữ liệu mở</h4>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPublishedModelPage(p => Math.max(0, p - 1))}
                    disabled={publishedModelPage === 0}
                    className="p-1 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPublishedModelPage(p => Math.min(publishedModelTotalPages - 1, p + 1))}
                    disabled={publishedModelPage >= publishedModelTotalPages - 1}
                    className="p-1 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2.5">
                {publishedModelPageItems.map(model => (
                  <div key={model.name} className="border border-slate-100 rounded-lg p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px] font-semibold text-slate-900">{model.name}</span>
                      <span className="text-[13px] text-slate-500 whitespace-nowrap">{model.records.toLocaleString('vi-VN')} bản ghi</span>
                    </div>
                    <p className="text-[12px] text-slate-400 mt-1">Công khai: {model.publishedAt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Charts Section - Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Danh mục dùng chung Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="mb-4">
            <h3 className="text-slate-900 font-semibold mb-1">Danh mục dùng chung</h3>
            <p className="text-sm text-slate-600">Số lượng theo loại</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={commonCategoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis dataKey="category" type="category" stroke="#64748b" style={{ fontSize: '12px' }} width={120} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                {commonCategoryData.map((entry, index) => (
                  <Cell key={`common-category-${entry.category}-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Dữ liệu mở Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="mb-4">
            <h3 className="text-slate-900 font-semibold mb-1">Dữ liệu mở</h3>
            <p className="text-sm text-slate-600">Đã công bố và đang chờ</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={openDataData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="category" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Legend />
              <Bar dataKey="published" stackId="a" fill="#22c55e" radius={[0, 0, 0, 0]} name="Đã công bố" />
              <Bar dataKey="pending" stackId="a" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Đang chờ" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Charts Section - Row 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tài khoản người dùng theo tháng */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="mb-4">
            <h3 className="text-slate-900 font-semibold mb-1">Tài khoản người dùng</h3>
            <p className="text-sm text-slate-600">6 tháng gần đây</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={userAccountData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: number) => value.toLocaleString()}
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#06b6d4"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorUsers)"
                name="Số tài khoản"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Tần suất tra cứu dịch vụ */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="mb-4">
            <h3 className="text-slate-900 font-semibold mb-1">Tần suất tra cứu dịch vụ</h3>
            <p className="text-sm text-slate-600">Tháng hiện tại</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={serviceQueryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="service" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: number) => value.toLocaleString()}
              />
              <Bar dataKey="count" fill="#ec4899" radius={[8, 8, 0, 0]} name="Số lượt tra cứu" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}