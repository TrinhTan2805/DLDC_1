import { Database, CheckCircle, Share2, LayoutDashboard, TrendingUp, ArrowRight, FolderTree, Globe, HardDrive } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';

export function DashboardHome() {

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
      detail: 'Tháng này: +487,234 bản ghi',
      targetPage: 'collection-dashboard'
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
      detail: 'Tháng này: +412,860 bản ghi',
      targetPage: 'processing-dashboard'
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
      detail: 'Tháng này: +30,940 lượt',
      targetPage: 'provisioning-monitoring'
    },
    {
      id: 'Danh mục dùng chung',
      label: 'Danh mục dùng chung',
      value: '124',
      sizeLabel: '',
      subtitle: 'Danh mục đã hình thành',
      change: '+6.4%',
      icon: FolderTree,
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      borderColor: 'border-indigo-200',
      detail: '88 danh mục đã chia sẻ đi',
      targetPage: 'category-dashboard'
    },
    {
      id: 'Dữ liệu mở',
      label: 'Dữ liệu mở',
      value: '27',
      sizeLabel: '',
      subtitle: 'Danh mục đã hình thành',
      change: '+2 danh mục mới',
      icon: Globe,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
      detail: '14 danh mục đã chia sẻ đi',
      targetPage: 'open-data-dashboard'
    },
    {
      id: 'Dữ liệu chủ',
      label: 'Dữ liệu chủ',
      value: '32',
      sizeLabel: '',
      subtitle: 'Danh mục đã hình thành',
      change: '+7.1%',
      icon: HardDrive,
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
      borderColor: 'border-teal-200',
      detail: '27 danh mục đã chia sẻ đi',
      targetPage: 'master-data-dashboard'
    },
  ];

  const goToOverviewPage = (targetPage: string) => {
    if (typeof (window as any).navigateToPage === 'function') {
      (window as any).navigateToPage(targetPage);
    }
  };

  // Thống kê người dùng hệ thống - thẻ tổng hợp [Unverified]
  const userStatsSummary = {
    totalAccounts: 2150,
    totalAccountsChangePct: 5.2,
    activeThisMonth: 1862,
    monthlyUsageHours: 5280,
    monthlyUsageHoursChangePct: 9.6,
    unitsWithAccounts: 46,
    totalUnits: 50,
  };
  const activeThisMonthRatePct = Math.round((userStatsSummary.activeThisMonth / userStatsSummary.totalAccounts) * 1000) / 10;
  const unitsWithAccountsRatePct = Math.round((userStatsSummary.unitsWithAccounts / userStatsSummary.totalUnits) * 1000) / 10;

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
              onClick={() => goToOverviewPage(kpi.targetPage)}
              className={`bg-white rounded-xl border-2 ${kpi.borderColor} p-8 cursor-pointer hover:shadow-md transition-shadow`}
            >
              {/* Icon & Change */}
              <div className="flex items-start justify-between mb-6">
                <div className={`${kpi.bgColor} p-4 rounded-xl`}>
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
                <div className="text-[14px] text-slate-600">{kpi.detail}</div>
                <button
                  onClick={() => goToOverviewPage(kpi.targetPage)}
                  className="flex items-center gap-1 text-sm font-semibold text-blue-600 whitespace-nowrap hover:gap-1.5 transition-all"
                >
                  Xem chi tiết
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
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
              <p className="text-[12px] text-slate-500 mb-1">Số tài khoản hoạt động</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-slate-900">{userStatsSummary.activeThisMonth.toLocaleString('vi-VN')}</p>
                <span className="text-xs font-semibold text-blue-600">{activeThisMonthRatePct}%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Trên tổng số tài khoản</p>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <p className="text-[12px] text-slate-500 mb-1">Tổng thời gian sử dụng hệ thống theo tháng</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-slate-900">{userStatsSummary.monthlyUsageHours.toLocaleString('vi-VN')} giờ</p>
                <span className="flex items-center gap-0.5 text-xs font-semibold text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  +{userStatsSummary.monthlyUsageHoursChangePct}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">So với tháng trước</p>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <p className="text-[12px] text-slate-500 mb-1">Số đơn vị đã có tài khoản trên đơn vị</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-slate-900">
                  {userStatsSummary.unitsWithAccounts.toLocaleString('vi-VN')}/{userStatsSummary.totalUnits.toLocaleString('vi-VN')}
                </p>
                <span className="text-xs font-semibold text-blue-600">{unitsWithAccountsRatePct}%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Trên tổng số đơn vị</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}