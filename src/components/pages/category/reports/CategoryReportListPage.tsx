import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Search, FileText, ChevronDown, Check, X, BarChart2 } from 'lucide-react';
import {
  BarChart, Bar as BarR, XAxis as XAxisR, YAxis as YAxisR,
  CartesianGrid, Tooltip as TooltipR, Legend as LegendR,
  ResponsiveContainer, Cell
} from 'recharts';

const Bar = BarR as any;
const XAxis = XAxisR as any;
const YAxis = YAxisR as any;
const Tooltip = TooltipR as any;
const Legend = LegendR as any;

const mockDataList = [
  { category: 'Văn bản pháp luật', total: 45, recent: 12, agency: 'Bộ Tư pháp' },
  { category: 'Đăng ký kinh doanh', total: 120, recent: 34, agency: 'Cục Đăng ký KD' },
  { category: 'Công chứng', total: 30, recent: 5, agency: 'Cục Công chứng' },
  { category: 'Trợ giúp pháp lý', total: 85, recent: 20, agency: 'Cục TGPL' },
  { category: 'Hộ tịch điện tử', total: 210, recent: 56, agency: 'Cục Hộ tịch' },
];

const AGENCY_OPTIONS = [
  { value: 'Bộ Tư pháp', label: 'Bộ Tư pháp' },
  { value: 'Cục Đăng ký KD', label: 'Cục Đăng ký kinh doanh' },
  { value: 'Cục Công chứng', label: 'Cục Công chứng' },
  { value: 'Cục TGPL', label: 'Cục Trợ giúp pháp lý' },
  { value: 'Cục Hộ tịch', label: 'Cục Hộ tịch' },
];

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

export function CategoryReportListPage() {
  // Filter state (chưa áp dụng)
  const [selectedAgencies, setSelectedAgencies] = useState<string[]>([]);
  const [showAgencyDropdown, setShowAgencyDropdown] = useState(false);
  const [dateRange, setDateRange] = useState('2024');
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Dữ liệu đã truy xuất (chỉ cập nhật khi bấm nút)
  const [hasSearched, setHasSearched] = useState(false);
  const [appliedData, setAppliedData] = useState(mockDataList);

  const agencyRef = useRef<HTMLDivElement | null>(null);
  const exportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (agencyRef.current && !agencyRef.current.contains(e.target as Node)) {
        setShowAgencyDropdown(false);
      }
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleAgency = (value: string) => {
    setSelectedAgencies(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const toggleAll = () => {
    setSelectedAgencies(prev =>
      prev.length === AGENCY_OPTIONS.length ? [] : AGENCY_OPTIONS.map(o => o.value)
    );
  };

  const handleSearch = () => {
    const result = selectedAgencies.length === 0
      ? mockDataList
      : mockDataList.filter(d => selectedAgencies.includes(d.agency));
    setAppliedData(result);
    setHasSearched(true);
  };

  const totalCategories = appliedData.reduce((acc, curr) => acc + curr.total, 0);
  const totalRecent = appliedData.reduce((acc, curr) => acc + curr.recent, 0);

  const agencyDisplayText = () => {
    if (selectedAgencies.length === 0) return 'Tất cả đơn vị';
    if (selectedAgencies.length === 1) {
      return AGENCY_OPTIONS.find(o => o.value === selectedAgencies[0])?.label ?? selectedAgencies[0];
    }
    return `${selectedAgencies.length} đơn vị đã chọn`;
  };

  const handleExportFile = (format: string) => {
    setShowExportMenu(false);
    alert(`Đang xuất dữ liệu sang định dạng ${format}...`);
  };

  return (
    <div className="space-y-6">
      {/* Backdrop mờ khi dropdown mở */}
      {showAgencyDropdown && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setShowAgencyDropdown(false)}
        />
      )}

      {/* Control Panel - form chung */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative z-30">
        <div className="flex flex-wrap items-end gap-3">

          {/* Multi-select Đơn vị quản lý */}
          <div className="flex-1 min-w-[220px]">
            <label className="block text-[12px] text-slate-500 mb-1 font-medium">Đơn vị quản lý</label>
            <div className="relative" ref={agencyRef}>
              <button
                type="button"
                onClick={() => setShowAgencyDropdown(prev => !prev)}
                className={`w-full px-3 py-2 border rounded-lg text-[13px] bg-white text-left flex items-center justify-between gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  showAgencyDropdown ? 'border-blue-400 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className={`truncate ${selectedAgencies.length === 0 ? 'text-slate-500' : 'text-slate-800 font-medium'}`}>
                  {agencyDisplayText()}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  {selectedAgencies.length > 0 && (
                    <span
                      onClick={(e) => { e.stopPropagation(); setSelectedAgencies([]); }}
                      className="w-4 h-4 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <X className="w-2.5 h-2.5 text-slate-600" />
                    </span>
                  )}
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showAgencyDropdown ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {showAgencyDropdown && (
                <div className="absolute left-0 top-full mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-2xl z-40 overflow-hidden">
                  {/* Chọn tất cả */}
                  <button
                    type="button"
                    onClick={toggleAll}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors border-b border-slate-100 text-sm font-medium text-slate-700"
                  >
                    <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      selectedAgencies.length === AGENCY_OPTIONS.length
                        ? 'bg-blue-600 border-blue-600'
                        : selectedAgencies.length > 0
                        ? 'bg-blue-100 border-blue-400'
                        : 'border-slate-300'
                    }`}>
                      {selectedAgencies.length === AGENCY_OPTIONS.length && <Check className="w-3 h-3 text-white" />}
                      {selectedAgencies.length > 0 && selectedAgencies.length < AGENCY_OPTIONS.length && (
                        <span className="w-2 h-0.5 bg-blue-600 rounded" />
                      )}
                    </span>
                    Tất cả đơn vị
                  </button>

                  {AGENCY_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleAgency(opt.value)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-sm text-slate-700"
                    >
                      <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        selectedAgencies.includes(opt.value)
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-slate-300'
                      }`}>
                        {selectedAgencies.includes(opt.value) && <Check className="w-3 h-3 text-white" />}
                      </span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Thời gian */}
          <div className="min-w-[170px]">
            <label className="block text-[12px] text-slate-500 mb-1 font-medium">Thời gian tạo (Năm)</label>
            <select
              title="Thời gian tạo"
              value={dateRange}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">Toàn thời gian</option>
              <option value="2024">Năm 2024</option>
              <option value="2023">Năm 2023</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleSearch}
            className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium text-[13px] shadow-sm shrink-0 active:scale-95"
          >
            <Search className="w-4 h-4" />
            Truy xuất dữ liệu
          </button>

          <div className="relative shrink-0" ref={exportRef}>
            <button
              type="button"
              onClick={() => setShowExportMenu(prev => !prev)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium text-[13px] shadow-sm"
            >
              <FileText className="w-4 h-4" />
              Xuất File
              <ChevronDown className="w-4 h-4" />
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden">
                {['Excel', 'PDF', 'CSV'].map(fmt => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => handleExportFile(fmt)}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm text-slate-700 transition-colors"
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chưa truy xuất — empty state */}
      {!hasSearched && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
          <BarChart2 className="w-12 h-12 opacity-30" />
          <p className="text-[13px] font-medium">Chọn điều kiện lọc và bấm <span className="text-slate-600 font-semibold">Truy xuất dữ liệu</span> để xem kết quả</p>
        </div>
      )}

      {/* Chart */}
      {hasSearched && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appliedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#374151' }} />
                <YAxis tick={{ fontSize: 12, fill: '#374151' }} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="total" name="Tổng số bộ danh mục" radius={[4, 4, 0, 0]} maxBarSize={50}>
                  {appliedData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Data Table */}
      {hasSearched && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-auto">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[13px] font-semibold text-slate-500 uppercase tracking-tight">
                  <th className="py-3 px-4 text-center w-12">STT</th>
                  <th className="py-3 px-4">Tên chủ đề / Phân hệ</th>
                  <th className="py-3 px-4">Đơn vị quản lý</th>
                  <th className="py-3 px-4 text-right">Số lượng DM Cập mới</th>
                  <th className="py-3 px-4 text-right">Tổng số DM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[13px] text-slate-700">
                {appliedData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-all">
                    <td className="py-3 px-4 text-center text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-4 font-medium text-slate-900">{item.category}</td>
                    <td className="py-3 px-4 text-slate-600">{item.agency}</td>
                    <td className="py-3 px-4 text-right text-slate-700">{item.recent}</td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-900">{item.total}</td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-semibold border-t border-slate-200">
                  <td colSpan={3} className="py-3 px-4 text-center text-slate-700 uppercase text-[13px]">Tổng cộng</td>
                  <td className="py-3 px-4 text-right text-slate-700">{totalRecent}</td>
                  <td className="py-3 px-4 text-right text-blue-600">{totalCategories}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
