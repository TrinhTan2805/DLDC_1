import { Database, CheckCircle, Share2, LayoutDashboard, TrendingUp, TrendingDown, ArrowRight, FolderTree, Globe, HardDrive } from 'lucide-react';
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
      detail: 'Tỷ lệ hoàn thành: 96.97%',
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
      detail: 'Tuần này: +12,458 lượt',
      targetPage: 'provision-dashboard'
    },
    {
      id: 'Danh mục dùng chung',
      label: 'Danh mục dùng chung',
      value: '838',
      sizeLabel: '~24 danh mục',
      subtitle: 'Bản ghi hình thành',
      change: '+6.4%',
      icon: FolderTree,
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      borderColor: 'border-indigo-200',
      detail: 'Đã chia sẻ: 497 bản ghi',
      targetPage: 'category-dashboard'
    },
    {
      id: 'Dữ liệu mở',
      label: 'Dữ liệu mở',
      value: '27',
      sizeLabel: 'bộ dữ liệu',
      subtitle: 'Bộ dữ liệu đã công bố',
      change: '+2 bộ mới',
      icon: Globe,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
      detail: 'Theo Phụ lục II - QĐ 1634/QĐ-BTP',
      targetPage: 'open-data-dashboard'
    },
    {
      id: 'Dữ liệu chủ',
      label: 'Dữ liệu chủ',
      value: '3,570',
      sizeLabel: 'bản ghi',
      subtitle: 'Thay đổi trong tháng',
      change: '+7.1%',
      icon: HardDrive,
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
      borderColor: 'border-teal-200',
      detail: 'Từ nguồn: 2,820 · Thủ công: 750',
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
                <div className="text-xs text-slate-600">{kpi.detail}</div>
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
          <div className="flex items-start justify-between gap-2 mb-4">
            <div>
              <h3 className="text-slate-900 font-semibold mb-1">Thống kê người dùng hệ thống</h3>
              <p className="text-sm text-slate-600">Tổng hợp tài khoản, mức độ sử dụng và an toàn đăng nhập</p>
            </div>
            <button
              onClick={() => goToOverviewPage('admin-users')}
              className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 whitespace-nowrap"
            >
              Xem chi tiết <ArrowRight className="w-4 h-4" />
            </button>
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

        </div>
      </div>

    </div>
  );
}