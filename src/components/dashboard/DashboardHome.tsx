import { useState } from 'react';
import { Database, CheckCircle, Share2, LayoutDashboard, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { KPI_LABEL_TO_SLUG } from './kpiReportData';

type UserStatsGranularity = 'week' | 'quarter' | 'year';

const USER_STATS_GRANULARITY_OPTIONS: { key: UserStatsGranularity; label: string }[] = [
  { key: 'week', label: 'Tuần' },
  { key: 'quarter', label: 'Quý' },
  { key: 'year', label: 'Năm' },
];

export function DashboardHome() {
  const [publishedModelPage, setPublishedModelPage] = useState(0);
  const [loginSecurityGranularity, setLoginSecurityGranularity] = useState<UserStatsGranularity>('week');
  const [userActivityGranularity, setUserActivityGranularity] = useState<UserStatsGranularity>('week');

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
      sizeLabel: '~9,8 GB',
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
      sizeLabel: '~9,5 GB',
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
      sizeLabel: '~172,07 MB',
      subtitle: 'Lượt chia sẻ',
      change: '+24.1%',
      icon: Share2,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      detail: 'Tuần này: +12,458 lượt'
    },
  ];

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

  // Danh mục dùng chung - Lượng dữ liệu đã hình thành theo danh mục [Unverified]
  const categoryFormedCounts = [
    12, 9, 22, 34, 41, 6, 58, 27, 45, 19,
    63, 15, 11, 8, 13, 24, 21, 96, 88, 17,
    120, 7, 52, 30,
  ];

  // Danh mục dùng chung - Số lượng dữ liệu đã chia sẻ theo danh mục [Unverified]
  const categorySharedCounts = [
    4, 2, 6, 28, 33, 1, 15, 40, 12, 26,
    18, 3, 2, 1, 4, 9, 7, 61, 55, 5,
    97, 2, 44, 22,
  ];

  // Gộp 2 chỉ số hình thành/chia sẻ theo danh mục thành 1 danh sách xếp hạng
  const categoryCombinedData = commonCategoryList
    .map((category, i) => ({ category, formed: categoryFormedCounts[i], shared: categorySharedCounts[i] }))
    .sort((a, b) => b.formed - a.formed);
  const maxCombinedFormed = Math.max(...categoryCombinedData.map(d => d.formed));

  // Danh mục dùng chung - Đã công khai trên Cổng dữ liệu mở [Unverified]
  const categoriesPublishedOpenData = [
    { name: 'Loại giao dịch công chứng', records: 120, publishedAt: '12/06/2026' },
    { name: 'Loại đăng ký khai sinh', records: 96, publishedAt: '08/06/2026' },
    { name: 'Loại khai sinh', records: 88, publishedAt: '02/06/2026' },
    { name: 'Loại quyết định thi hành án', records: 52, publishedAt: '28/05/2026' },
  ];

  // Xu hướng thay đổi dữ liệu chủ trong 6 tháng qua [Unverified]
  const masterDataTrendData = [
    { month: 'T1', fromSource: 1850, manual: 620 },
    { month: 'T2', fromSource: 2040, manual: 580 },
    { month: 'T3', fromSource: 2260, manual: 710 },
    { month: 'T4', fromSource: 2480, manual: 640 },
    { month: 'T5', fromSource: 2650, manual: 690 },
    { month: 'T6', fromSource: 2820, manual: 750 },
  ].map(row => ({ ...row, total: row.fromSource + row.manual }));

  // Danh sách tập dữ liệu mở theo Phụ lục II - Quyết định 1634/QĐ-BTP ngày 30/6/2026
  // Tên tập dữ liệu và ngày cung cấp lần đầu lấy từ văn bản đã cung cấp; số bản ghi là dữ liệu mock [Unverified]
  const masterDataPublishedOnOpenData = [
    { name: 'Danh sách tổ chức thực hiện trợ giúp pháp lý', records: 63, publishedAt: '01/01/2019' },
    { name: 'Danh sách người thực hiện trợ giúp pháp lý', records: 210, publishedAt: '01/01/2019' },
    { name: 'Danh sách Luật sư Việt Nam', records: 18450, publishedAt: '01/01/2027' },
    { name: 'Danh sách Tổ chức hành nghề Luật sư Việt Nam', records: 4820, publishedAt: '01/01/2027' },
    { name: 'Danh sách chi nhánh Tổ chức hành nghề Luật sư', records: 960, publishedAt: '01/01/2027' },
    { name: 'Danh sách Luật sư nước ngoài', records: 145, publishedAt: '01/01/2027' },
    { name: 'Danh sách Tổ chức hành nghề Luật sư nước ngoài', records: 62, publishedAt: '01/01/2027' },
    { name: 'Danh sách chi nhánh Tổ chức hành nghề Luật sư nước ngoài', records: 24, publishedAt: '01/01/2027' },
    { name: 'Danh sách Tư vấn viên pháp luật', records: 890, publishedAt: '01/01/2027' },
    { name: 'Danh sách Trung tâm tư vấn pháp luật', records: 320, publishedAt: '01/01/2027' },
    { name: 'Danh sách chi nhánh Trung tâm tư vấn pháp luật', records: 105, publishedAt: '01/01/2027' },
    { name: 'Danh sách công chứng viên Việt Nam', records: 3260, publishedAt: '01/01/2027' },
    { name: 'Danh sách tổ chức hành nghề công chứng', records: 1480, publishedAt: '01/01/2027' },
    { name: 'Danh sách quản tài viên Việt Nam', records: 410, publishedAt: '01/01/2027' },
    { name: 'Danh sách doanh nghiệp quản lý, thanh lý tài sản', records: 180, publishedAt: '01/01/2027' },
    { name: 'Danh sách đấu giá viên', records: 720, publishedAt: '01/01/2027' },
    { name: 'Danh sách tổ chức hành nghề đấu giá', records: 340, publishedAt: '01/01/2027' },
    { name: 'Danh sách giám định viên tư pháp', records: 1050, publishedAt: '01/01/2027' },
    { name: 'Danh sách tổ chức giám định tư pháp', records: 230, publishedAt: '01/01/2027' },
    { name: 'Danh sách trọng tài viên thương mại', records: 380, publishedAt: '01/01/2027' },
    { name: 'Danh sách trung tâm trọng tài thương mại', records: 42, publishedAt: '01/01/2027' },
    { name: 'Danh sách hòa giải viên thương mại', records: 260, publishedAt: '01/01/2027' },
    { name: 'Danh sách trung tâm hòa giải thương mại', records: 28, publishedAt: '01/01/2027' },
    { name: 'Danh sách Báo cáo viên pháp luật trung ương', records: 150, publishedAt: '01/01/2017' },
    { name: 'Dữ liệu thống kê ngành Tư pháp', records: 25, publishedAt: '01/01/2015' },
    { name: 'Tài sản thi hành án được đưa ra bán đấu giá', records: 5600, publishedAt: '01/07/2009' },
    { name: 'Dữ liệu người phải thi hành án chưa có điều kiện thi hành', records: 8300, publishedAt: '01/07/2015' },
  ];
  const PUBLISHED_MODEL_PAGE_SIZE = 5;
  const publishedModelTotalPages = Math.ceil(masterDataPublishedOnOpenData.length / PUBLISHED_MODEL_PAGE_SIZE);
  const publishedModelPageItems = masterDataPublishedOnOpenData.slice(
    publishedModelPage * PUBLISHED_MODEL_PAGE_SIZE,
    publishedModelPage * PUBLISHED_MODEL_PAGE_SIZE + PUBLISHED_MODEL_PAGE_SIZE
  );

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

  // Dữ liệu mở - Lượt chia sẻ theo API của các danh mục đã công bố [Unverified]
  const apiSharesByOpenDataCounts = [
    45, 12, 980, 340, 62, 8, 4, 2, 56, 21,
    7, 210, 96, 26, 11, 48, 22, 68, 15, 24,
    3, 17, 2, 9, 1, 320, 540,
  ];
  const apiSharesByOpenData = masterDataPublishedOnOpenData
    .map((item, i) => ({ name: item.name, shares: apiSharesByOpenDataCounts[i] ?? 0 }))
    .sort((a, b) => b.shares - a.shares);
  const maxApiShares = Math.max(...apiSharesByOpenData.map(d => d.shares));

  // Thống kê người dùng hệ thống - thẻ tổng hợp [Unverified]
  const userStatsSummary = {
    totalAccounts: 2150,
    totalAccountsChangePct: 5.2,
    accountsAssignedToUnit: 1980,
    avgSessionMinutes: 18,
    avgSessionMinutesChangePct: 3.1,
    neverLoggedIn: 137,
    newThisMonth: 93,
    newThisMonthChangePct: 18.2,
    updatedThisMonth: 214,
    updatedThisMonthChangePct: 6.4,
    suspendedThisMonth: 18,
    suspendedThisMonthChangePct: -14.3,
    activeThisMonth: 1862,
  };
  const activeThisMonthRatePct = Math.round((userStatsSummary.activeThisMonth / userStatsSummary.totalAccounts) * 1000) / 10;
  const accountsAssignedToUnitRatePct = Math.round((userStatsSummary.accountsAssignedToUnit / userStatsSummary.totalAccounts) * 1000) / 10;
  const neverLoggedInRatePct = Math.round((userStatsSummary.neverLoggedIn / userStatsSummary.totalAccounts) * 1000) / 10;

  // Thống kê người dùng hệ thống - Tỷ lệ đăng nhập thành công / thất bại theo thời gian [Unverified]
  const loginSecurityByGranularity: { [key in UserStatsGranularity]: { label: string; totalLogins: number; failedLogins: number }[] } = {
    week: [
      { label: 'T2', totalLogins: 216, failedLogins: 14 },
      { label: 'T3', totalLogins: 187, failedLogins: 9 },
      { label: 'T4', totalLogins: 254, failedLogins: 18 },
      { label: 'T5', totalLogins: 198, failedLogins: 11 },
      { label: 'T6', totalLogins: 289, failedLogins: 21 },
      { label: 'T7', totalLogins: 142, failedLogins: 7 },
      { label: 'CN', totalLogins: 96, failedLogins: 4 },
    ],
    quarter: [
      { label: 'Tháng 1', totalLogins: 5860, failedLogins: 286 },
      { label: 'Tháng 2', totalLogins: 5210, failedLogins: 254 },
      { label: 'Tháng 3', totalLogins: 6140, failedLogins: 302 },
    ],
    year: [
      { label: 'T1', totalLogins: 1780, failedLogins: 86 },
      { label: 'T2', totalLogins: 2040, failedLogins: 102 },
      { label: 'T3', totalLogins: 1650, failedLogins: 74 },
      { label: 'T4', totalLogins: 2360, failedLogins: 118 },
      { label: 'T5', totalLogins: 1920, failedLogins: 95 },
      { label: 'T6', totalLogins: 1480, failedLogins: 68 },
      { label: 'T7', totalLogins: 1860, failedLogins: 88 },
      { label: 'T8', totalLogins: 2410, failedLogins: 121 },
      { label: 'T9', totalLogins: 1720, failedLogins: 76 },
      { label: 'T10', totalLogins: 2050, failedLogins: 99 },
      { label: 'T11', totalLogins: 1840, failedLogins: 84 },
      { label: 'T12', totalLogins: 2260, failedLogins: 110 },
    ],
  };
  const loginSecurityData = loginSecurityByGranularity[loginSecurityGranularity].map(item => ({
    ...item,
    successLogins: item.totalLogins - item.failedLogins,
  }));

  // Thống kê người dùng hệ thống - Người dùng mới vs không hoạt động (>30 ngày) theo thời gian [Unverified]
  const userActivityByGranularity: { [key in UserStatsGranularity]: { label: string; newUsers: number; inactiveUsers: number }[] } = {
    week: [
      { label: 'T2', newUsers: 8, inactiveUsers: 12 },
      { label: 'T3', newUsers: 11, inactiveUsers: 9 },
      { label: 'T4', newUsers: 14, inactiveUsers: 15 },
      { label: 'T5', newUsers: 9, inactiveUsers: 10 },
      { label: 'T6', newUsers: 16, inactiveUsers: 13 },
      { label: 'T7', newUsers: 5, inactiveUsers: 6 },
      { label: 'CN', newUsers: 3, inactiveUsers: 4 },
    ],
    quarter: [
      { label: 'Tháng 1', newUsers: 165, inactiveUsers: 187 },
      { label: 'Tháng 2', newUsers: 183, inactiveUsers: 172 },
      { label: 'Tháng 3', newUsers: 206, inactiveUsers: 158 },
    ],
    year: [
      { label: 'T1', newUsers: 45, inactiveUsers: 62 },
      { label: 'T2', newUsers: 58, inactiveUsers: 70 },
      { label: 'T3', newUsers: 62, inactiveUsers: 55 },
      { label: 'T4', newUsers: 71, inactiveUsers: 84 },
      { label: 'T5', newUsers: 80, inactiveUsers: 68 },
      { label: 'T6', newUsers: 93, inactiveUsers: 51 },
      { label: 'T7', newUsers: 76, inactiveUsers: 59 },
      { label: 'T8', newUsers: 88, inactiveUsers: 73 },
      { label: 'T9', newUsers: 95, inactiveUsers: 64 },
      { label: 'T10', newUsers: 101, inactiveUsers: 57 },
      { label: 'T11', newUsers: 89, inactiveUsers: 66 },
      { label: 'T12', newUsers: 112, inactiveUsers: 49 },
    ],
  };
  const userActivityData = userActivityByGranularity[userActivityGranularity];

  // Thống kê người dùng hệ thống - Top tính năng được truy cập nhiều nhất [Unverified]
  const topFeatureUsageData = [
    { feature: 'Quản lý thu thập dữ liệu', accesses: 18420 },
    { feature: 'Xử lý dữ liệu', accesses: 15680 },
    { feature: 'Danh mục dùng chung', accesses: 12930 },
    { feature: 'Dữ liệu mở', accesses: 9840 },
    { feature: 'Dữ liệu chủ', accesses: 8250 },
    { feature: 'Cung cấp dữ liệu', accesses: 6120 },
    { feature: 'Báo cáo thống kê', accesses: 4380 },
    { feature: 'Quản trị & vận hành', accesses: 2150 },
  ];
  const maxFeatureAccesses = Math.max(...topFeatureUsageData.map(d => d.accesses));

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
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-600">{kpi.change}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">So với tháng trước</span>
                </div>
              </div>

              {/* Label */}
              <div className="text-slate-600 mb-2">{kpi.label}</div>

              {/* Value */}
              <div className="flex items-baseline gap-2 mb-1">
                <div className="text-4xl text-slate-900">{kpi.value}</div>
                <div className="text-sm font-normal text-slate-400">{kpi.sizeLabel}</div>
              </div>

              {/* Subtitle */}
              <div className="text-sm text-slate-500 mb-4">{kpi.subtitle}</div>

              {/* Detail */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="text-xs text-slate-600">{kpi.detail}</div>
                <div className="flex items-center gap-1 text-sm font-semibold text-blue-600 whitespace-nowrap group-hover:gap-1.5 transition-all">
                  Xem chi tiết
                  <ArrowRight className="w-4 h-4" />
                </div>
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
            <div className="lg:col-span-2 border border-slate-200 rounded-lg p-4">
              <h4 className="text-slate-800 font-medium mb-1">Xu hướng thay đổi dữ liệu chủ trong 6 tháng qua</h4>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={masterDataTrendData}>
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
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#22c55e" strokeWidth={3} name="Tổng thay đổi" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="fromSource" stroke="#3b82f6" strokeWidth={2} name="Thay đổi từ nguồn" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="manual" stroke="#f59e0b" strokeWidth={2} name="Thay đổi thủ công" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
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
      <div className="grid grid-cols-1 gap-6">
        {/* Danh mục dùng chung */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="mb-4">
            <h3 className="text-slate-900 font-semibold mb-1">Danh mục dùng chung</h3>
            <p className="text-sm text-slate-600">Tổng hợp lượng dữ liệu hình thành, chia sẻ và mức độ công khai theo danh mục</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-slate-800 font-medium">Lượng dữ liệu hình thành và chia sẻ theo danh mục</h4>
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-400 inline-block" />Đã hình thành</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-purple-400 inline-block" />Đã chia sẻ</span>
                </div>
              </div>
              <div className="overflow-y-auto space-y-3" style={{ maxHeight: 480 }}>
                {categoryCombinedData.map((item, i) => (
                  <div key={item.category}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-[13px] font-medium text-slate-900 flex-1 truncate" title={item.category}>{item.category}</span>
                      <span className="text-[11px] text-slate-500 whitespace-nowrap">{item.formed.toLocaleString('vi-VN')} / {item.shared.toLocaleString('vi-VN')} bản ghi</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mb-1">
                      <div className="h-full rounded-full bg-blue-400" style={{ width: `${(item.formed / maxCombinedFormed) * 100}%` }} />
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-purple-400" style={{ width: `${(item.shared / maxCombinedFormed) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="text-slate-800 font-medium mb-3">Danh mục công khai trên Cổng dữ liệu mở</h4>
              <div className="space-y-2.5">
                {categoriesPublishedOpenData.map(item => (
                  <div key={item.name} className="border border-slate-100 rounded-lg p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px] font-semibold text-slate-900">{item.name}</span>
                      <span className="text-[13px] text-slate-500 whitespace-nowrap">{item.records.toLocaleString('vi-VN')} bản ghi</span>
                    </div>
                    <p className="text-[12px] text-slate-400 mt-1">Công khai: {item.publishedAt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dữ liệu mở Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="mb-4">
            <h3 className="text-slate-900 font-semibold mb-1">Dữ liệu mở</h3>
            <p className="text-sm text-slate-600">Tổng hợp quy trình phê duyệt, công bố và lượt chia sẻ theo API của danh mục dữ liệu mở</p>
          </div>

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

      {/* Additional Charts Section - Row 4 */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="mb-4">
            <h3 className="text-slate-900 font-semibold mb-1">Thống kê người dùng hệ thống</h3>
            <p className="text-sm text-slate-600">Tổng hợp tài khoản, mức độ sử dụng và an toàn đăng nhập</p>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="border border-slate-200 rounded-lg p-4">
              <p className="text-[12px] text-slate-500 mb-1">Số tài khoản người dùng</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-slate-900">{userStatsSummary.totalAccounts.toLocaleString('vi-VN')}</p>
                <span className="flex items-center gap-0.5 text-xs font-semibold text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  +{userStatsSummary.totalAccountsChangePct}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">So với tháng trước</p>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <p className="text-[12px] text-slate-500 mb-1">Tài khoản phân bổ theo đơn vị</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-slate-900">
                  {userStatsSummary.accountsAssignedToUnit.toLocaleString('vi-VN')}/{userStatsSummary.totalAccounts.toLocaleString('vi-VN')}
                </p>
                <span className="text-xs font-semibold text-blue-600">{accountsAssignedToUnitRatePct}%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Trên tổng số tài khoản</p>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <p className="text-[12px] text-slate-500 mb-1">Thời gian làm việc trung bình/phiên</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-slate-900">{userStatsSummary.avgSessionMinutes} phút</p>
                <span className="flex items-center gap-0.5 text-xs font-semibold text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  +{userStatsSummary.avgSessionMinutesChangePct}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">So với tháng trước</p>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <p className="text-[12px] text-slate-500 mb-1">Tài khoản chưa đăng nhập lần đầu</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-slate-900">
                  {userStatsSummary.neverLoggedIn.toLocaleString('vi-VN')}/{userStatsSummary.totalAccounts.toLocaleString('vi-VN')}
                </p>
                <span className="text-xs font-semibold text-amber-600">{neverLoggedInRatePct}%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Trên tổng số tài khoản</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="border border-slate-200 rounded-lg p-4">
              <p className="text-[12px] text-slate-500 mb-1">Tài khoản mới trong tháng</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-slate-900">{userStatsSummary.newThisMonth.toLocaleString('vi-VN')}</p>
                <span className="flex items-center gap-0.5 text-xs font-semibold text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  +{userStatsSummary.newThisMonthChangePct}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">So với tháng trước</p>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <p className="text-[12px] text-slate-500 mb-1">Tài khoản cập nhật trong tháng</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-slate-900">{userStatsSummary.updatedThisMonth.toLocaleString('vi-VN')}</p>
                <span className="flex items-center gap-0.5 text-xs font-semibold text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  +{userStatsSummary.updatedThisMonthChangePct}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">So với tháng trước</p>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <p className="text-[12px] text-slate-500 mb-1">Tài khoản ngưng hoạt động trong tháng</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-slate-900">{userStatsSummary.suspendedThisMonth.toLocaleString('vi-VN')}</p>
                <span className="flex items-center gap-0.5 text-xs font-semibold text-green-600">
                  <TrendingDown className="w-3 h-3" />
                  {userStatsSummary.suspendedThisMonthChangePct}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">So với tháng trước</p>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <p className="text-[12px] text-slate-500 mb-1">Tài khoản đang hoạt động trong tháng</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-slate-900">{userStatsSummary.activeThisMonth.toLocaleString('vi-VN')}</p>
                <span className="text-xs font-semibold text-blue-600">{activeThisMonthRatePct}%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Trên tổng số tài khoản</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-start justify-between flex-wrap gap-2 mb-1">
                <h4 className="text-slate-800 font-medium">Tỷ lệ đăng nhập thành công / thất bại</h4>
                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                  {USER_STATS_GRANULARITY_OPTIONS.map(option => (
                    <button
                      key={option.key}
                      onClick={() => setLoginSecurityGranularity(option.key)}
                      className={`px-2 py-1 text-[11px] rounded-md transition-colors whitespace-nowrap ${
                        loginSecurityGranularity === option.key
                          ? 'bg-white text-blue-600 shadow-sm font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={loginSecurityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" stroke="#64748b" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => value.toLocaleString('vi-VN')}
                  />
                  <Legend />
                  <Bar dataKey="failedLogins" stackId="logins" fill="#fdba74" radius={[0, 0, 0, 0]} name="Đăng nhập thất bại" />
                  <Bar dataKey="successLogins" stackId="logins" fill="#86efac" radius={[6, 6, 0, 0]} name="Đăng nhập thành công" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-start justify-between flex-wrap gap-2 mb-1">
                <h4 className="text-slate-800 font-medium">Người dùng mới và không hoạt động (&gt;30 ngày)</h4>
                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                  {USER_STATS_GRANULARITY_OPTIONS.map(option => (
                    <button
                      key={option.key}
                      onClick={() => setUserActivityGranularity(option.key)}
                      className={`px-2 py-1 text-[11px] rounded-md transition-colors whitespace-nowrap ${
                        userActivityGranularity === option.key
                          ? 'bg-white text-blue-600 shadow-sm font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" stroke="#64748b" style={{ fontSize: '12px' }} />
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
                  <Bar dataKey="newUsers" fill="#22c55e" radius={[6, 6, 0, 0]} name="Người dùng mới" />
                  <Bar dataKey="inactiveUsers" fill="#94a3b8" radius={[6, 6, 0, 0]} name="Không hoạt động >30 ngày" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="text-slate-800 font-medium mb-3">Top tính năng được truy cập nhiều nhất</h4>
              <div className="space-y-3">
                {topFeatureUsageData.map((item, i) => (
                  <div key={item.feature}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-[13px] font-medium text-slate-900 flex-1 truncate" title={item.feature}>{item.feature}</span>
                      <span className="text-[11px] text-slate-500 whitespace-nowrap">{item.accesses.toLocaleString('vi-VN')} lượt</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-indigo-400" style={{ width: `${(item.accesses / maxFeatureAccesses) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}