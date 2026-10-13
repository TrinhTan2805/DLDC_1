import { toast } from 'sonner';
import { useState } from 'react';
import { DateInput } from '../pages/collection/collectionUi';
import { X, FileText, Calendar, Download, Filter, TrendingUp, Activity, CheckCircle } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: any[];
}

export function ReportModal({ isOpen, onClose, services }: ReportModalProps) {
  const [reportConfig, setReportConfig] = useState({
    reportType: 'usage',
    serviceId: 'all',
    dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dateTo: new Date().toISOString().split('T')[0],
    format: 'PDF',
    includeCharts: true,
    includeDetails: true
  });

  if (!isOpen) return null;

  const reportTypes = [
    { value: 'usage', label: 'Báo cáo sử dụng dịch vụ', icon: Activity },
    { value: 'performance', label: 'Báo cáo hiệu suất API', icon: TrendingUp },
    { value: 'access', label: 'Báo cáo truy cập và bảo mật', icon: CheckCircle }
  ];

  const handleGenerate = () => {
    // Simulate report generation
    const fileName = `bao-cao-${reportConfig.reportType}-${reportConfig.dateFrom}-${reportConfig.dateTo}.${reportConfig.format.toLowerCase()}`;
    toast.info(`Đang tạo báo cáo: ${fileName}\n\nBáo cáo sẽ được tải xuống sau vài giây...`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-amber-600" />
            <h2 className="text-slate-900">Tạo báo cáo thống kê</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Đóng" aria-label="Đóng"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Report Type */}
          <div>
            <label className="block text-sm text-slate-700 mb-3">
              Loại báo cáo <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-3">
              {reportTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => setReportConfig({ ...reportConfig, reportType: type.value })}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      reportConfig.reportType === type.value
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${
                        reportConfig.reportType === type.value ? 'text-amber-600' : 'text-slate-400'
                      }`} />
                      <span className={reportConfig.reportType === type.value ? 'text-amber-900' : 'text-slate-900'}>
                        {type.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Service Selection */}
          <div>
            <label className="block text-sm text-slate-700 mb-2">
              Dịch vụ <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={reportConfig.serviceId}
                onChange={(e) => setReportConfig({ ...reportConfig, serviceId: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">Tất cả dịch vụ</option>
                {services.filter(s => s.status === 'active').map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Từ ngày <span className="text-red-500">*</span>
              </label>
              <DateInput ariaLabel="Từ ngày" value={reportConfig.dateFrom} onChange={(v) => setReportConfig({ ...reportConfig, dateFrom: v })} />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Đến ngày <span className="text-red-500">*</span>
              </label>
              <DateInput ariaLabel="Đến ngày" value={reportConfig.dateTo} onChange={(v) => setReportConfig({ ...reportConfig, dateTo: v })} />
            </div>
          </div>

          {/* Quick Date Ranges */}
          <div>
            <label className="block text-sm text-slate-700 mb-2">Khoảng thời gian nhanh</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '7 ngày', days: 7 },
                { label: '30 ngày', days: 30 },
                { label: '90 ngày', days: 90 },
                { label: '1 năm', days: 365 }
              ].map(range => (
                <button
                  key={range.days}
                  onClick={() => {
                    const dateTo = new Date().toISOString().split('T')[0];
                    const dateFrom = new Date(Date.now() - range.days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                    setReportConfig({ ...reportConfig, dateFrom, dateTo });
                  }}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 transition-colors"
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Export Format */}
          <div>
            <label className="block text-sm text-slate-700 mb-2">
              Định dạng xuất <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-3">
              {['PDF', 'Excel', 'Word', 'CSV'].map(format => (
                <button
                  key={format}
                  onClick={() => setReportConfig({ ...reportConfig, format })}
                  className={`px-4 py-2.5 border rounded-lg text-sm transition-colors ${
                    reportConfig.format === format
                      ? 'border-amber-500 bg-amber-50 text-amber-700'
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm text-slate-700 mb-3">Tùy chọn báo cáo</label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={reportConfig.includeCharts}
                  onChange={(e) => setReportConfig({ ...reportConfig, includeCharts: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-sm text-slate-900">Bao gồm biểu đồ và đồ thị</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={reportConfig.includeDetails}
                  onChange={(e) => setReportConfig({ ...reportConfig, includeDetails: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-sm text-slate-900">Bao gồm dữ liệu chi tiết</span>
              </label>
            </div>
          </div>

          {/* Preview Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm text-blue-900 mb-2">Thông tin báo cáo</h4>
            <div className="space-y-1 text-sm text-blue-800">
              <div>• Loại: {reportTypes.find(t => t.value === reportConfig.reportType)?.label}</div>
              <div>• Dịch vụ: {reportConfig.serviceId === 'all' ? 'Tất cả' : services.find(s => s.id === reportConfig.serviceId)?.name}</div>
              <div>• Khoảng thời gian: {reportConfig.dateFrom} đến {reportConfig.dateTo}</div>
              <div>• Định dạng: {reportConfig.format}</div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleGenerate}
              className="px-6 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Tạo báo cáo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
