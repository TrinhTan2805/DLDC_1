import { useState, useRef } from 'react';
import { Calendar, Filter, Download, Image as ImageIcon, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import { DateInput } from '../pages/collection/collectionUi';

interface FilterableChartWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onFilterChange?: (filters: ChartFilters) => void;
  showDataTypeFilter?: boolean;
  dataTypeOptions?: { value: string; label: string }[];
}

export interface ChartFilters {
  startDate: string;
  endDate: string;
  dataType: string;
}

export function FilterableChartWrapper({
  title,
  description,
  children,
  onFilterChange,
  showDataTypeFilter = true,
  dataTypeOptions = [
    { value: 'all', label: 'Tất cả loại dữ liệu' },
    { value: 'civil-registry', label: 'Hộ tịch' },
    { value: 'business', label: 'Đăng ký kinh doanh' },
    { value: 'notary', label: 'Công chứng' },
    { value: 'legal-aid', label: 'Trợ giúp pháp lý' },
    { value: 'legal-docs', label: 'Văn bản pháp luật' },
  ]
}: FilterableChartWrapperProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dataType, setDataType] = useState('all');
  const chartRef = useRef<HTMLDivElement>(null);

  const handleApplyFilters = () => {
    if (onFilterChange) {
      onFilterChange({ startDate, endDate, dataType });
    }
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    setDataType('all');
    if (onFilterChange) {
      onFilterChange({ startDate: '', endDate: '', dataType: 'all' });
    }
  };

  const handleExportImage = async () => {
    if (!chartRef.current) return;

    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `${title.replace(/\s+/g, '_')}_${new Date().getTime()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error exporting chart:', error);
    }
  };

  const hasActiveFilters = startDate || endDate || dataType !== 'all';

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-200">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-slate-900 mb-1">{title}</h3>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                hasActiveFilters
                  ? 'bg-blue-100 text-blue-600'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
              title="Bộ lọc"
            >
              <Filter className="w-4 h-4" />
            </button>
            <button
              onClick={handleExportImage}
              className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
              title="Xuất ảnh biểu đồ"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Start Date */}
              <div>
                <label className="block text-xs text-slate-600 mb-1.5">
                  Từ ngày
                </label>
                <DateInput ariaLabel="Từ ngày" value={startDate} onChange={setStartDate} />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-xs text-slate-600 mb-1.5">
                  Đến ngày
                </label>
                <DateInput ariaLabel="Đến ngày" value={endDate} onChange={setEndDate} />
              </div>

              {/* Data Type */}
              {showDataTypeFilter && (
                <div>
                  <label className="block text-xs text-slate-600 mb-1.5">
                    Loại dữ liệu
                  </label>
                  <select
                    value={dataType}
                    onChange={(e) => setDataType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {dataTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 text-sm text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Đặt lại
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Áp dụng
              </button>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && !showFilters && (
          <div className="mt-3 flex flex-wrap gap-2">
            {startDate && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                <Calendar className="w-3 h-3" />
                Từ: {new Date(startDate).toLocaleDateString('vi-VN')}
              </span>
            )}
            {endDate && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                <Calendar className="w-3 h-3" />
                Đến: {new Date(endDate).toLocaleDateString('vi-VN')}
              </span>
            )}
            {dataType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                {dataTypeOptions.find(opt => opt.value === dataType)?.label}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Chart Content */}
      <div ref={chartRef} className="p-5">
        {children}
      </div>
    </div>
  );
}
