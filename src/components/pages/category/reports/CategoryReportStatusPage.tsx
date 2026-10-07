import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Search, FileText, ChevronDown, Check, X, BarChart2 } from 'lucide-react';
import { toast } from 'sonner';
import { BTN_OUTLINE, BTN_FOCUS, INPUT_CLS, FILTER_LABEL, Badge, TruncatedText } from '../../collection/collectionUi';
import {
  PieChart, Pie as PieR, Cell as CellR,
  Tooltip as TooltipR, Legend as LegendR,
  ResponsiveContainer
} from 'recharts';

const Pie = PieR as any;
const Cell = CellR as any;
const Tooltip = TooltipR as any;
const Legend = LegendR as any;

// Ô chọn nhiều (multi-select) — đồng bộ ô nhập 40px (compomennt.md 5.2, 5.19)
const MS_TRIGGER = 'w-full h-10 px-3 border rounded-lg text-[13px] bg-white text-left flex items-center justify-between gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600';
const MS_TRIGGER_OPEN = 'border-[#155DFC] ring-2 ring-blue-600/20';
const MS_TRIGGER_IDLE = 'border-[#E2E8F0] hover:border-[#CBD5E1]';
const MS_CLEAR = 'w-4 h-4 rounded-full bg-[#E2E8F0] hover:bg-[#CBD5E1] flex items-center justify-center cursor-pointer transition-colors';
const MS_PANEL = 'absolute left-0 top-full mt-1 w-full bg-white border border-[#E2E8F0] rounded-lg shadow-lg z-40 overflow-hidden';
const MS_SEARCH = 'w-full h-9 pl-8 pr-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-[#94A3B8]';
const MS_OPTION = 'w-full flex items-center gap-3 px-3 py-2 hover:bg-[#F1F5F9] transition-colors text-[13px] text-[#020817] text-left cursor-pointer';
// Nút "Truy xuất" giữ tông xanh lá của nút Tìm kiếm (SEARCH_BTN_CLS) nhưng có chữ
const RUN_BTN_CLS = `h-10 px-4 inline-flex items-center justify-center gap-2 rounded-lg bg-[#10B981] text-white text-[13px] font-medium hover:bg-[#059669] transition-colors ${BTN_FOCUS}`;
// Bảng (compomennt.md 5.3)
const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';
const TR = 'h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors';

// Trạng thái danh mục — color: màu biểu đồ (bảng màu dự án), variant: tông Badge (giữ ý nghĩa màu cũ)
const STATUS_OPTIONS = [
  { value: 'Đang soạn thảo', label: 'Đang soạn thảo', color: '#64748B', variant: 'slate'  },
  { value: 'Chờ phê duyệt',  label: 'Chờ phê duyệt',  color: '#155DFC', variant: 'blue'   },
  { value: 'Đã phê duyệt',   label: 'Đã phê duyệt',   color: '#8200DB', variant: 'purple' },
  { value: 'Từ chối',        label: 'Từ chối',        color: '#DC2626', variant: 'red'    },
  { value: 'Hiệu lực',       label: 'Hiệu lực',       color: '#10B981', variant: 'green'  },
  { value: 'Hết hiệu lực',   label: 'Hết hiệu lực',   color: '#D97706', variant: 'amber'  },
];

// Dữ liệu tổng hợp (cho biểu đồ tròn)
const summaryData = [
  { name: 'Đang soạn thảo', value: 30  },
  { name: 'Chờ phê duyệt',  value: 25  },
  { name: 'Đã phê duyệt',   value: 40  },
  { name: 'Từ chối',        value: 15  },
  { name: 'Hiệu lực',       value: 345 },
  { name: 'Hết hiệu lực',   value: 120 },
];

// Dữ liệu chi tiết từng danh mục (cho bảng — UC yêu cầu thời gian chuyển trạng thái, người duyệt, lý do)
const detailData = [
  { id: 'DM-001', name: 'Danh mục giới tính',        agency: 'Bộ Tư pháp',            status: 'Hiệu lực',       transitionDate: '12/03/2026 08:30', approver: 'Nguyễn Văn A', reason: 'Phê duyệt định kỳ' },
  { id: 'DM-002', name: 'Danh mục dân tộc',           agency: 'Ủy ban Dân tộc',         status: 'Hiệu lực',       transitionDate: '10/03/2026 09:00', approver: 'Trần Thị B',   reason: 'Cập nhật phiên bản mới' },
  { id: 'DM-003', name: 'Danh mục quốc tịch',         agency: 'Bộ Ngoại giao',          status: 'Chờ phê duyệt',  transitionDate: '15/06/2026 14:15', approver: '—',             reason: 'Chờ lãnh đạo phê duyệt' },
  { id: 'DM-004', name: 'Danh mục đơn vị hành chính', agency: 'Bộ Nội vụ',              status: 'Chờ phê duyệt',  transitionDate: '20/06/2026 10:00', approver: '—',             reason: 'Gửi duyệt lần 2' },
  { id: 'DM-005', name: 'Danh mục tôn giáo',          agency: 'Ban Tôn giáo Chính phủ', status: 'Hết hiệu lực',  transitionDate: '01/01/2026 00:00', approver: 'Lê Văn C',      reason: 'Hết thời hạn sử dụng' },
  { id: 'DM-006', name: 'Danh mục nghề nghiệp',       agency: 'Bộ Nội vụ',              status: 'Hết hiệu lực',  transitionDate: '15/12/2025 17:00', approver: 'Phạm Văn D',    reason: 'Thay thế bởi phiên bản v2' },
  { id: 'DM-007', name: 'Danh mục loại hộ gia đình',  agency: 'Bộ Tư pháp',             status: 'Đang soạn thảo', transitionDate: '05/05/2026 11:30', approver: '—',             reason: 'Đang rà soát chuẩn hóa' },
  { id: 'DM-008', name: 'Danh mục cơ quan hành chính',agency: 'Bộ Nội vụ',              status: 'Từ chối',       transitionDate: '18/04/2026 08:00', approver: 'Hoàng Văn F',   reason: 'Phát hiện sai sót cần xử lý' },
  { id: 'DM-009', name: 'Danh mục biện pháp bảo đảm', agency: 'Bộ Tư pháp',             status: 'Hiệu lực',       transitionDate: '22/02/2026 13:45', approver: 'Trần Văn G',    reason: 'Phê duyệt theo đề nghị đơn vị' },
  { id: 'DM-010', name: 'Danh mục phán quyết TAND',   agency: 'Tòa án nhân dân tối cao', status: 'Hết hiệu lực',  transitionDate: '30/11/2025 16:00', approver: 'Lê Thị H',      reason: 'Hết vòng đời quy định' },
  { id: 'DM-011', name: 'Danh mục loại hình doanh nghiệp', agency: 'Bộ Kế hoạch và Đầu tư', status: 'Đã phê duyệt', transitionDate: '25/05/2026 09:20', approver: 'Nguyễn Văn I', reason: 'Đã phê duyệt, chờ công bố hiệu lực' },
  { id: 'DM-012', name: 'Danh mục hình thức xử phạt', agency: 'Bộ Tư pháp',             status: 'Đã phê duyệt', transitionDate: '28/05/2026 15:40', approver: 'Đặng Thị K',    reason: 'Đã phê duyệt, chờ công bố hiệu lực' },
];

const AGENCY_OPTIONS = Array.from(new Set(detailData.map(d => d.agency)));

export function CategoryReportStatusPage() {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [statusSearchTerm, setStatusSearchTerm] = useState('');
  const [agencyFilter, setAgencyFilter] = useState('all');
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
        setStatusSearchTerm('');
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

  const filteredStatusOptions = STATUS_OPTIONS.filter(opt =>
    opt.label.toLowerCase().includes(statusSearchTerm.trim().toLowerCase())
  );

  const handleSearch = () => {
    const filteredSummary = selectedStatuses.length === 0
      ? summaryData
      : summaryData.filter(s => selectedStatuses.includes(s.name));
    const filteredDetail = detailData.filter(d =>
      (selectedStatuses.length === 0 || selectedStatuses.includes(d.status)) &&
      (agencyFilter === 'all' || d.agency === agencyFilter)
    );
    setAppliedSummary(filteredSummary);
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
    toast.info(`Đang xuất dữ liệu sang định dạng ${format}...`);
  };

  return (
    <div className="space-y-6">
      {/* Backdrop khi dropdown mở */}
      {showStatusDropdown && (
        <div className="fixed inset-0 z-20" onClick={() => setShowStatusDropdown(false)} />
      )}

      {/* Control Panel - form chung */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] relative z-30">
        <div className="flex flex-wrap items-end gap-3">

          {/* Multi-select Trạng thái */}
          <div className="flex-1 min-w-[220px]">
            <label className={FILTER_LABEL}>Trạng thái danh mục</label>
            <div className="relative" ref={statusRef}>
              <button
                type="button"
                onClick={() => setShowStatusDropdown(prev => !prev)}
                className={`${MS_TRIGGER} ${
                  showStatusDropdown ? MS_TRIGGER_OPEN : MS_TRIGGER_IDLE
                }`}
              >
                <span className={`truncate ${selectedStatuses.length === 0 ? 'text-[#64748B]' : 'text-[#020817]'}`}>
                  {statusDisplayText()}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  {selectedStatuses.length > 0 && (
                    <span
                      onClick={(e) => { e.stopPropagation(); setSelectedStatuses([]); }}
                      className={MS_CLEAR}
                    >
                      <X className="w-3 h-3 text-[#475569]" />
                    </span>
                  )}
                  <ChevronDown className={`w-4 h-4 text-[#94A3B8] transition-transform duration-200 ${showStatusDropdown ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {showStatusDropdown && (
                <div className={MS_PANEL}>
                  {/* Ô tìm kiếm (search combobox) */}
                  <div className="p-2 border-b border-[#E2E8F0]">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                      <input
                        type="text"
                        autoFocus
                        value={statusSearchTerm}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setStatusSearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Tìm trạng thái..."
                        className={MS_SEARCH}
                      />
                    </div>
                  </div>

                  {statusSearchTerm.trim() === '' && (
                    <button
                      type="button"
                      onClick={toggleAll}
                      className={`${MS_OPTION} border-b border-[#E2E8F0] font-medium`}
                    >
                      <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        selectedStatuses.length === STATUS_OPTIONS.length ? 'bg-blue-600 border-blue-600'
                          : selectedStatuses.length > 0 ? 'bg-[#EAF3FF] border-[#155DFC]' : 'border-[#CBD5E1]'
                      }`}>
                        {selectedStatuses.length === STATUS_OPTIONS.length && <Check className="w-3 h-3 text-white" />}
                        {selectedStatuses.length > 0 && selectedStatuses.length < STATUS_OPTIONS.length && (
                          <span className="w-2 h-0.5 bg-blue-600 rounded" />
                        )}
                      </span>
                      Tất cả trạng thái
                    </button>
                  )}

                  <div className="max-h-[180px] overflow-y-auto custom-scrollbar">
                    {filteredStatusOptions.length === 0 ? (
                      <p className="px-3 py-3 text-[13px] text-[#64748B] text-center">Không tìm thấy trạng thái phù hợp</p>
                    ) : (
                      filteredStatusOptions.map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => toggleStatus(opt.value)}
                          className={MS_OPTION}
                        >
                          <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                            selectedStatuses.includes(opt.value) ? 'bg-blue-600 border-blue-600' : 'border-[#CBD5E1]'
                          }`}>
                            {selectedStatuses.includes(opt.value) && <Check className="w-3 h-3 text-white" />}
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: opt.color }} />
                            {opt.label}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Đơn vị chủ quản */}
          <div className="min-w-[190px]">
            <label className={FILTER_LABEL}>Đơn vị chủ quản</label>
            <select
              title="Đơn vị chủ quản"
              value={agencyFilter}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setAgencyFilter(e.target.value)}
              className={INPUT_CLS}
            >
              <option value="all">Tất cả</option>
              {AGENCY_OPTIONS.map(agency => (
                <option key={agency} value={agency}>{agency}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleSearch}
            className={`${RUN_BTN_CLS} shrink-0`}
          >
            <Search className="w-4 h-4" />
            Truy xuất dữ liệu
          </button>

          <div className="relative shrink-0" ref={exportRef}>
            <button
              type="button"
              onClick={() => setShowExportMenu(prev => !prev)}
              className={BTN_OUTLINE}
            >
              <FileText className="w-4 h-4" />
              Xuất File
              <ChevronDown className="w-4 h-4" />
            </button>
            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-[#E2E8F0] bg-white shadow-lg p-1 z-50">
                {['Excel', 'PDF', 'CSV'].map(fmt => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => handleExportFile(fmt)}
                    className="w-full text-left min-h-8 px-3 py-1.5 rounded-md hover:bg-[#F1F5F9] text-[13px] text-[#020817] transition-colors cursor-pointer"
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
        <div className="bg-white border border-[#E2E8F0] rounded-2xl flex flex-col items-center justify-center py-20 gap-4">
          <BarChart2 className="w-12 h-12 text-[#CBD5E1]" />
          <p className="text-[13px] text-[#64748B]">Chọn điều kiện lọc và bấm <span className="text-[#334155] font-medium">Truy xuất dữ liệu</span> để xem kết quả</p>
        </div>
      )}

      {/* Biểu đồ tròn + thẻ tổng hợp */}
      {hasSearched && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
          <p className="text-[14px] font-medium text-[#020817] mb-3">Báo cáo trạng thái danh mục</p>
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
                      <Cell key={`cell-${index}`} fill={getStatusMeta(entry.name)?.color ?? '#94A3B8'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value} danh mục`, '']} />
                  <Legend wrapperStyle={{ fontSize: '12px', color: '#64748B' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Thẻ tóm tắt (compomennt.md 5.6.1) */}
            <div className="flex-1 grid grid-cols-6 gap-4 w-full">
              {appliedSummary.map(item => {
                const meta = getStatusMeta(item.name);
                return (
                  <div key={item.name} className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex flex-col gap-1">
                    <span className="flex items-center gap-1.5 text-[16px] text-[#64748B]">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: meta?.color ?? '#94A3B8' }} />
                      {item.name}
                    </span>
                    <span className="text-[16px] font-semibold text-[#0F172A] tabular-nums">{item.value.toLocaleString()}</span>
                    <span className="text-[12px] text-[#64748B] tabular-nums">{((item.value / total) * 100).toFixed(1)}% tổng số</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bảng chi tiết chuyển trạng thái (compomennt.md 5.3) */}
      {hasSearched && (
        <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between">
            <h3 className="text-[14px] font-medium text-[#020817]">Chi tiết chuyển trạng thái danh mục</h3>
            <span className="text-[13px] text-[#64748B]">{appliedDetail.length} bản ghi</span>
          </div>
          <div className="overflow-x-auto overflow-y-auto max-h-[420px] custom-scrollbar">
            <table className="status-report-table w-full border-collapse collection-table text-[13px]">
              <thead className="sticky top-0 z-10 bg-[#F8FAFC]">
                <tr className="h-[42px]">
                  <th className={`${TH} text-center w-12`}>STT</th>
                  <th className={`${TH} text-left`}>Mã danh mục</th>
                  <th className={`${TH} text-left`}>Tên danh mục</th>
                  <th className={`${TH} text-left`}>Trạng thái mới nhất</th>
                  <th className={`${TH} text-left`}>Thời gian chuyển TT</th>
                  <th className={`${TH} text-left`}>Người duyệt</th>
                  <th className={`${TH} text-left`}>Lý do</th>
                </tr>
              </thead>
              <tbody>
                {appliedDetail.map((item, idx) => {
                  const meta = getStatusMeta(item.status);
                  const [datePart, timePart] = item.transitionDate.split(' ');
                  return (
                    <tr key={item.id} className={TR}>
                      <td className={`${TD} text-center`}>{idx + 1}</td>
                      <td className={`${TD} text-left whitespace-nowrap`}>{item.id}</td>
                      <td className={`${TD} text-left max-w-[360px]`}><TruncatedText text={item.name} /></td>
                      <td className={`${TD} text-left`}>
                        <Badge label={item.status} variant={meta?.variant ?? 'slate'} />
                      </td>
                      <td className={`${TD} text-left whitespace-nowrap leading-[18px]`}>
                        <div>{datePart}</div>
                        {timePart && <div className="text-[#64748B]">{timePart}</div>}
                      </td>
                      <td className={`${TD} text-left whitespace-nowrap`}>{item.approver}</td>
                      <td className={`${TD} text-left max-w-[280px]`}><TruncatedText text={item.reason} /></td>
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
