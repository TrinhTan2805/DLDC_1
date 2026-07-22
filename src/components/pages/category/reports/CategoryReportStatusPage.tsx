import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Search, FileText, ChevronDown, Check, X, BarChart2 } from 'lucide-react';
import {
  PieChart, Pie as PieR, Cell as CellR,
  Tooltip as TooltipR, Legend as LegendR,
  ResponsiveContainer
} from 'recharts';

const Pie = PieR as any;
const Cell = CellR as any;
const Tooltip = TooltipR as any;
const Legend = LegendR as any;

// Trạng thái danh mục
const STATUS_OPTIONS = [
  { value: 'Đang hoạt động', label: 'Đang hoạt động', color: '#10b981', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
  { value: 'Đang chờ duyệt',  label: 'Đang chờ duyệt',  color: '#3b82f6', bg: 'bg-blue-50',  text: 'text-blue-700',  border: 'border-blue-200',  dot: 'bg-blue-500'  },
  { value: 'Hết hiệu lực',   label: 'Hết hiệu lực',   color: '#ef4444', bg: 'bg-red-50',   text: 'text-red-700',   border: 'border-red-200',   dot: 'bg-red-500'   },
  { value: 'Tạm dừng',       label: 'Tạm dừng',       color: '#f59e0b', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
];

// Dữ liệu tổng hợp (cho biểu đồ tròn)
const summaryData = [
  { name: 'Đang hoạt động', value: 345 },
  { name: 'Đang chờ duyệt',  value: 25  },
  { name: 'Hết hiệu lực',   value: 120  },
  { name: 'Tạm dừng',       value: 45   },
];

// Dữ liệu chi tiết từng danh mục (cho bảng — UC yêu cầu thời gian chuyển trạng thái, người duyệt, lý do)
const detailData = [
  { id: 'DM-001', name: 'Danh mục giới tính',        status: 'Đang hoạt động', transitionDate: '12/03/2026 08:30', approver: 'Nguyễn Văn A', reason: 'Phê duyệt định kỳ' },
  { id: 'DM-002', name: 'Danh mục dân tộc',           status: 'Đang hoạt động', transitionDate: '10/03/2026 09:00', approver: 'Trần Thị B',   reason: 'Cập nhật phiên bản mới' },
  { id: 'DM-003', name: 'Danh mục quốc tịch',         status: 'Đang chờ duyệt', transitionDate: '15/06/2026 14:15', approver: '—',             reason: 'Chờ lãnh đạo phê duyệt' },
  { id: 'DM-004', name: 'Danh mục đơn vị hành chính', status: 'Đang chờ duyệt', transitionDate: '20/06/2026 10:00', approver: '—',             reason: 'Gửi duyệt lần 2' },
  { id: 'DM-005', name: 'Danh mục tôn giáo',          status: 'Hết hiệu lực',   transitionDate: '01/01/2026 00:00', approver: 'Lê Văn C',      reason: 'Hết thời hạn sử dụng' },
  { id: 'DM-006', name: 'Danh mục nghề nghiệp',       status: 'Hết hiệu lực',   transitionDate: '15/12/2025 17:00', approver: 'Phạm Văn D',    reason: 'Thay thế bởi phiên bản v2' },
  { id: 'DM-007', name: 'Danh mục loại hộ gia đình',  status: 'Tạm dừng',       transitionDate: '05/05/2026 11:30', approver: 'Nguyễn Thị E',  reason: 'Đang rà soát chuẩn hóa' },
  { id: 'DM-008', name: 'Danh mục cơ quan hành chính',status: 'Tạm dừng',       transitionDate: '18/04/2026 08:00', approver: 'Hoàng Văn F',   reason: 'Phát hiện sai sót cần xử lý' },
  { id: 'DM-009', name: 'Danh mục biện pháp bảo đảm', status: 'Đang hoạt động', transitionDate: '22/02/2026 13:45', approver: 'Trần Văn G',    reason: 'Phê duyệt theo đề nghị đơn vị' },
  { id: 'DM-010', name: 'Danh mục phán quyết TAND',   status: 'Hết hiệu lực',   transitionDate: '30/11/2025 16:00', approver: 'Lê Thị H',      reason: 'Hết vòng đời quy định' },
];

export function CategoryReportStatusPage() {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [dateRange, setDateRange] = useState('2026');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const [hasSearched, setHasSearched] = useState(false);
  const [appliedSummary, setAppliedSummary] = useState(summaryData);
  const [appliedDetail, setAppliedDetail] = useState(detailData);

  const statusRef = useRef<HTMLDivElement | null>(null);
  const exportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setShowStatusDropdown(false);
      }
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleStatus = (value: string) => {
    setSelectedStatuses(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const toggleAll = () => {
    setSelectedStatuses(prev =>
      prev.length === STATUS_OPTIONS.length ? [] : STATUS_OPTIONS.map(o => o.value)
    );
  };

  const handleSearch = () => {
    const filtered = selectedStatuses.length === 0
      ? summaryData
      : summaryData.filter(s => selectedStatuses.includes(s.name));
    const filteredDetail = selectedStatuses.length === 0
      ? detailData
      : detailData.filter(d => selectedStatuses.includes(d.status));
    setAppliedSummary(filtered);
    setAppliedDetail(filteredDetail);
    setHasSearched(true);
  };

  const total = appliedSummary.reduce((acc, curr) => acc + curr.value, 0);

  const statusDisplayText = () => {
    if (selectedStatuses.length === 0) return 'Tất cả trạng thái';
    if (selectedStatuses.length === 1) return selectedStatuses[0];
    return `${selectedStatuses.length} trạng thái đã chọn`;
  };

  const getStatusMeta = (name: string) => STATUS_OPTIONS.find(s => s.value === name);

  const handleExportFile = (format: string) => {
    setShowExportMenu(false);
    alert(`Đang xuất dữ liệu sang định dạng ${format}...`);
  };

  return (
    <div className="space-y-6">
      {/* Backdrop khi dropdown mở */}
      {showStatusDropdown && (
        <div className="fixed inset-0 z-20" onClick={() => setShowStatusDropdown(false)} />
      )}

      {/* Control Panel - form chung */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative z-30">
        <div className="flex flex-wrap items-end gap-3">

          {/* Multi-select Trạng thái */}
          <div className="flex-1 min-w-[220px]">
            <label className="block text-[12px] text-slate-500 mb-1 font-medium">Trạng thái danh mục</label>
            <div className="relative" ref={statusRef}>
              <button
                type="button"
                onClick={() => setShowStatusDropdown(prev => !prev)}
                className={`w-full px-3 py-2 border rounded-lg text-[13px] bg-white text-left flex items-center justify-between gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  showStatusDropdown ? 'border-blue-400 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className={`truncate ${selectedStatuses.length === 0 ? 'text-slate-500' : 'text-slate-800 font-medium'}`}>
                  {statusDisplayText()}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  {selectedStatuses.length > 0 && (
                    <span
                      onClick={(e) => { e.stopPropagation(); setSelectedStatuses([]); }}
                      className="w-4 h-4 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <X className="w-2.5 h-2.5 text-slate-600" />
                    </span>
                  )}
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showStatusDropdown ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {showStatusDropdown && (
                <div className="absolute left-0 top-full mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-2xl z-40 overflow-hidden">
                  <button
                    type="button"
                    onClick={toggleAll}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors border-b border-slate-100 text-sm font-medium text-slate-700"
                  >
                    <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      selectedStatuses.length === STATUS_OPTIONS.length ? 'bg-blue-600 border-blue-600'
                        : selectedStatuses.length > 0 ? 'bg-blue-100 border-blue-400' : 'border-slate-300'
                    }`}>
                      {selectedStatuses.length === STATUS_OPTIONS.length && <Check className="w-3 h-3 text-white" />}
                      {selectedStatuses.length > 0 && selectedStatuses.length < STATUS_OPTIONS.length && (
                        <span className="w-2 h-0.5 bg-blue-600 rounded" />
                      )}
                    </span>
                    Tất cả trạng thái
                  </button>
                  {STATUS_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleStatus(opt.value)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-sm text-slate-700"
                    >
                      <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        selectedStatuses.includes(opt.value) ? 'bg-blue-600 border-blue-600' : 'border-slate-300'
                      }`}>
                        {selectedStatuses.includes(opt.value) && <Check className="w-3 h-3 text-white" />}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Thời gian */}
          <div className="min-w-[170px]">
            <label className="block text-[12px] text-slate-500 mb-1 font-medium">Thời gian chuyển trạng thái</label>
            <select
              title="Thời gian"
              value={dateRange}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">Toàn thời gian</option>
              <option value="2026">Năm 2026</option>
              <option value="2025">Năm 2025</option>
              <option value="q2_2026">Quý 2/2026</option>
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

      {/* Empty state */}
      {!hasSearched && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
          <BarChart2 className="w-12 h-12 opacity-30" />
          <p className="text-[13px] font-medium">Chọn điều kiện lọc và bấm <span className="text-slate-600 font-semibold">Truy xuất dữ liệu</span> để xem kết quả</p>
        </div>
      )}

      {/* Biểu đồ tròn + thẻ tổng hợp */}
      {hasSearched && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* Pie chart */}
            <div className="w-full lg:w-72 h-64 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={appliedSummary}
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    innerRadius={55}
                    dataKey="value"
                    label={({ percent }: any) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {appliedSummary.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getStatusMeta(entry.name)?.color ?? '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value} danh mục`, '']} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Thẻ tóm tắt */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
              {appliedSummary.map(item => {
                const meta = getStatusMeta(item.name);
                return (
                  <div key={item.name} className={`rounded-xl border p-4 flex flex-col gap-1 ${meta?.bg} ${meta?.border}`}>
                    <span className="flex items-center gap-1.5 text-[12px] font-medium text-slate-600">
                      <span className={`w-2 h-2 rounded-full ${meta?.dot}`} />
                      {item.name}
                    </span>
                    <span className={`text-2xl font-bold ${meta?.text}`}>{item.value.toLocaleString()}</span>
                    <span className="text-[11px] text-slate-400">{((item.value / total) * 100).toFixed(1)}% tổng số</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bảng chi tiết chuyển trạng thái */}
      {hasSearched && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-[13px] font-semibold text-slate-700">Chi tiết chuyển trạng thái danh mục</h3>
            <span className="text-[12px] text-slate-400">{appliedDetail.length} bản ghi</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-auto">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[13px] font-semibold text-slate-500 uppercase tracking-tight">
                  <th className="py-3 px-4 text-center w-12">STT</th>
                  <th className="py-3 px-4">Mã danh mục</th>
                  <th className="py-3 px-4">Tên danh mục</th>
                  <th className="py-3 px-4 text-center">Trạng thái</th>
                  <th className="py-3 px-4">Thời gian chuyển TT</th>
                  <th className="py-3 px-4">Người duyệt</th>
                  <th className="py-3 px-4">Lý do</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[13px] text-slate-700">
                {appliedDetail.map((item, idx) => {
                  const meta = getStatusMeta(item.status);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="py-3 px-4 text-center text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-mono text-slate-500 text-xs">{item.id}</td>
                      <td className="py-3 px-4 font-medium text-slate-900">{item.name}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${meta?.bg} ${meta?.text} ${meta?.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${meta?.dot}`} />
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-xs">{item.transitionDate}</td>
                      <td className="py-3 px-4 text-slate-600">{item.approver}</td>
                      <td className="py-3 px-4 text-slate-500">{item.reason}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
