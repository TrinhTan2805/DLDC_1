import { ArrowLeft, Database, Hash, CheckCircle2, AlertTriangle, XCircle, FileEdit, FileText, Calendar } from 'lucide-react';
import { KPI_SLUG_TO_LABEL, detailedData, formatDataSize } from './kpiReportData';

interface DashboardReportPageProps {
  kpiSlug: string;
}

export function DashboardReportPage({ kpiSlug }: DashboardReportPageProps) {
  const selectedKPI = KPI_SLUG_TO_LABEL[kpiSlug] || 'Thu thập';
  const currentData = detailedData[selectedKPI] || [];
  const totalSynced = currentData.reduce((sum, record) => sum + record.syncedCount, 0);

  const total = currentData.length;
  const successCount = currentData.filter(r => r.status === 'success').length;
  const warningCount = currentData.filter(r => r.status === 'warning').length;
  const errorCount = currentData.filter(r => r.status === 'error').length;
  const draftCount = currentData.filter(r => r.status === 'draft').length;
  const toPercent = (count: number) => (total > 0 ? ((count / total) * 100).toFixed(2) : '0.00');

  const handleBack = () => {
    if (typeof (window as any).navigateToPage === 'function') {
      (window as any).navigateToPage('dashboard');
    } else {
      window.history.back();
    }
  };

  const getStatusBadge = (status: 'success' | 'warning' | 'error' | 'draft') => {
    const styles = {
      success: 'bg-green-100 text-green-700 border-green-200',
      warning: 'bg-amber-100 text-amber-700 border-amber-200',
      error: 'bg-red-100 text-red-700 border-red-200',
      draft: 'bg-blue-100 text-blue-700 border-blue-200'
    };
    const labels = {
      success: 'Thành công',
      warning: 'Cảnh báo',
      error: 'Lỗi',
      draft: 'Nháp'
    };
    return (
      <span className={`px-2 py-1 text-[13px] border rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getDataStatusBadge = (status: 'success' | 'warning' | 'error' | 'draft') => {
    const isActive = status === 'success';
    return (
      <span
        className={`px-2 py-1 text-[13px] border rounded-full ${
          isActive
            ? 'bg-green-100 text-green-700 border-green-200'
            : 'bg-slate-200 text-slate-600 border-slate-300'
        }`}
      >
        {isActive ? 'Hoạt động' : 'Ngưng hoạt động'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={handleBack}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-[18px] font-bold text-slate-900">
            {selectedKPI === 'Thu thập' ? 'Báo cáo thu thập dữ liệu' : `Chi tiết ${selectedKPI}`}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Danh sách dữ liệu đã thu thập và đồng bộ
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      {selectedKPI === 'Thu thập' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border-l border-r border-b border-l-slate-200 border-r-slate-200 border-b-slate-200 border-t-4 border-t-slate-700 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-slate-500" />
              <span className="text-[13px] font-semibold uppercase tracking-wide text-slate-500">
                Tổng số dịch vụ
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{total}</div>
          </div>

          <div className="bg-white rounded-lg border-l border-r border-b border-l-slate-200 border-r-slate-200 border-b-slate-200 border-t-4 border-t-green-500 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-[13px] font-semibold uppercase tracking-wide text-slate-500">
                Hoạt động
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {successCount}
              <span className="text-[13px] font-normal text-slate-500 ml-1">
                / {total} ({toPercent(successCount)}%)
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg border-l border-r border-b border-l-slate-200 border-r-slate-200 border-b-slate-200 border-t-4 border-t-red-500 p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-[13px] font-semibold uppercase tracking-wide text-slate-500">
                Ngừng hoạt động
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {warningCount + errorCount}
              <span className="text-[13px] font-normal text-slate-500 ml-1">
                / {total} ({toPercent(warningCount + errorCount)}%)
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg border-l border-r border-b border-l-slate-200 border-r-slate-200 border-b-slate-200 border-t-4 border-t-yellow-500 p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileEdit className="w-4 h-4 text-yellow-600" />
              <span className="text-[13px] font-semibold uppercase tracking-wide text-slate-500">
                Bản nháp
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {draftCount}
              <span className="text-[13px] font-normal text-slate-500 ml-1">
                / {total} ({toPercent(draftCount)}%)
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-blue-600" />
              <span className="text-[16px] text-slate-600">Tổng nguồn</span>
            </div>
            <div className="text-[16px] text-slate-900">{total}</div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-4 h-4 text-green-600" />
              <span className="text-[16px] text-slate-600">Tổng đồng bộ</span>
            </div>
            <div className="text-[16px] text-slate-900">{totalSynced.toLocaleString()}</div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-[16px] text-slate-600">Thành công</span>
            </div>
            <div className="text-[16px] text-slate-900">{successCount}</div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-[16px] text-slate-600">Cảnh báo/Lỗi</span>
            </div>
            <div className="text-[16px] text-slate-900">{warningCount + errorCount + draftCount}</div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 text-[13px] text-slate-500 font-bold whitespace-nowrap">STT</th>
                <th className="text-left py-3 px-4 text-[13px] text-slate-500 font-bold whitespace-nowrap">
                  {selectedKPI === 'Thu thập' ? 'Tên dịch vụ' : 'Tên dữ liệu'}
                </th>
                <th className="text-left py-3 px-4 text-[13px] text-slate-500 font-bold whitespace-nowrap">
                  {selectedKPI === 'Thu thập' ? 'Hệ thống nguồn' : 'Nguồn'}
                </th>
                <th className="text-right py-3 px-4 text-[13px] text-slate-500 font-bold whitespace-nowrap">
                  {selectedKPI === 'Thu thập' ? 'Kích thước dữ liệu' : 'Số lượng đồng bộ'}
                </th>
                <th className="text-left py-3 px-4 text-[13px] text-slate-500 font-bold whitespace-nowrap">Lần đồng bộ cuối</th>
                <th className="text-center py-3 px-4 text-[13px] text-slate-500 font-bold whitespace-nowrap">Trạng thái</th>
                {selectedKPI === 'Thu thập' && (
                  <th className="text-center py-3 px-4 text-[13px] text-slate-500 font-bold whitespace-nowrap">Trạng thái dữ liệu</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentData.map((record, index) => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-[13px] text-slate-600">{index + 1}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="text-[13px] text-slate-900">{record.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[13px] text-slate-600">{record.source}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-[13px] text-slate-900">
                      {selectedKPI === 'Thu thập'
                        ? record.dataSizeLabel || formatDataSize(record.syncedCount)
                        : record.syncedCount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[13px] text-slate-600">{record.lastSync}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {getStatusBadge(record.status)}
                  </td>
                  {selectedKPI === 'Thu thập' && (
                    <td className="py-3 px-4 text-center">
                      {getDataStatusBadge(record.status)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {currentData.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            Không có dữ liệu chi tiết
          </div>
        )}
      </div>
    </div>
  );
}
