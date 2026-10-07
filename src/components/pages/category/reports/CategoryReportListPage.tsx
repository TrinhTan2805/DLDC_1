import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Search, FileText, ChevronDown, Check, X, BarChart2 } from 'lucide-react';
import { toast } from 'sonner';
import { BTN_OUTLINE, BTN_FOCUS, INPUT_CLS, FILTER_LABEL, TruncatedText } from '../../collection/collectionUi';
import {
  BarChart, Bar as BarR, XAxis as XAxisR, YAxis as YAxisR,
  CartesianGrid, Tooltip as TooltipR,
  ResponsiveContainer, Cell
} from 'recharts';
import { categoryTypeLabels } from '../categoryConstants';
import { CategoryType } from '../categoryTypes';

const Bar = BarR as any;
const XAxis = XAxisR as any;
const YAxis = YAxisR as any;
const Tooltip = TooltipR as any;

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
const TOTAL_TR = 'h-12 bg-[#F8FAFC] font-semibold border-b border-[#E0E0E0]';

const AGENCY_OPTIONS = [
  { value: 'Cục Hành chính tư pháp', label: 'Cục Hành chính tư pháp' },
  { value: 'Cục Quản lý thi hành án dân sự', label: 'Cục Quản lý thi hành án dân sự' },
  { value: 'Cục Đăng ký GD bảo đảm & Bồi thường nhà nước', label: 'Cục Đăng ký GD bảo đảm & Bồi thường nhà nước' },
  { value: 'Cục Kiểm tra văn bản & Quản lý xử lý VP hành chính', label: 'Cục Kiểm tra văn bản & Quản lý xử lý VP hành chính' },
  { value: 'Cục Pháp luật quốc tế và Giải quyết tranh chấp đầu tư quốc tế', label: 'Cục Pháp luật quốc tế và Giải quyết tranh chấp đầu tư quốc tế' },
  { value: 'Cục Phổ biến, giáo dục pháp luật và Trợ giúp pháp lý', label: 'Cục Phổ biến, giáo dục pháp luật và Trợ giúp pháp lý' },
  { value: 'Cục Bổ trợ tư pháp', label: 'Cục Bổ trợ tư pháp' },
  { value: 'Vụ Hợp tác quốc tế', label: 'Vụ Hợp tác quốc tế' },
  { value: 'Cục Kế hoạch - Tài chính', label: 'Cục Kế hoạch - Tài chính' },
  { value: 'Tòa án nhân dân tối cao', label: 'Tòa án nhân dân tối cao' },
  { value: 'Trung tâm dữ liệu Quốc gia (TTDLQG)', label: 'Trung tâm dữ liệu Quốc gia (TTDLQG)' },
];

const CATEGORY_TYPE_OPTIONS = (Object.keys(categoryTypeLabels) as CategoryType[]).map(value => ({
  value,
  label: categoryTypeLabels[value],
}));

// Mỗi đơn vị quản lý (tối đa 11 đơn vị) tương ứng 1 dòng dữ liệu, dùng chung cho bảng và biểu đồ.
// categoryType: loại danh mục chủ yếu của đơn vị đó (mock, dùng cho bộ lọc "Loại danh mục")
const mockDataList: { agency: string; total: number; recent: number; updated: number; categoryType: CategoryType }[] = [
  { agency: 'Cục Hành chính tư pháp', total: 210, recent: 56, updated: 40, categoryType: 'shared_ttdlqg' },
  { agency: 'Cục Quản lý thi hành án dân sự', total: 95, recent: 18, updated: 12, categoryType: 'business' },
  { agency: 'Cục Đăng ký GD bảo đảm & Bồi thường nhà nước', total: 120, recent: 34, updated: 21, categoryType: 'aggregated_decision' },
  { agency: 'Cục Kiểm tra văn bản & Quản lý xử lý VP hành chính', total: 60, recent: 9, updated: 6, categoryType: 'business' },
  { agency: 'Cục Pháp luật quốc tế và Giải quyết tranh chấp đầu tư quốc tế', total: 40, recent: 7, updated: 4, categoryType: 'aggregated_decision' },
  { agency: 'Cục Phổ biến, giáo dục pháp luật và Trợ giúp pháp lý', total: 130, recent: 32, updated: 23, categoryType: 'business' },
  { agency: 'Cục Bổ trợ tư pháp', total: 30, recent: 5, updated: 3, categoryType: 'shared_ttdlqg' },
  { agency: 'Vụ Hợp tác quốc tế', total: 25, recent: 4, updated: 2, categoryType: 'aggregated_decision' },
  { agency: 'Cục Kế hoạch - Tài chính', total: 50, recent: 8, updated: 5, categoryType: 'business' },
  { agency: 'Tòa án nhân dân tối cao', total: 70, recent: 15, updated: 10, categoryType: 'aggregated_decision' },
  { agency: 'Trung tâm dữ liệu Quốc gia (TTDLQG)', total: 45, recent: 10, updated: 7, categoryType: 'shared_ttdlqg' },
];

// Bảng màu biểu đồ của dự án (lặp lại theo vòng khi nhiều đơn vị)
const COLORS = ['#155DFC', '#10B981', '#D97706', '#DC2626', '#8200DB', '#64748B'];

export function CategoryReportListPage() {
  // Filter state (chưa áp dụng)
  const [selectedAgencies, setSelectedAgencies] = useState<string[]>([]);
  const [showAgencyDropdown, setShowAgencyDropdown] = useState(false);
  const [agencySearchTerm, setAgencySearchTerm] = useState('');
  const [selectedCategoryTypes, setSelectedCategoryTypes] = useState<CategoryType[]>([]);
  const [showCategoryTypeDropdown, setShowCategoryTypeDropdown] = useState(false);
  const [dateRange, setDateRange] = useState('all');
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Dữ liệu đã truy xuất (chỉ cập nhật khi bấm nút)
  const [hasSearched, setHasSearched] = useState(false);
  const [appliedData, setAppliedData] = useState(mockDataList);

  const agencyRef = useRef<HTMLDivElement | null>(null);
  const categoryTypeRef = useRef<HTMLDivElement | null>(null);
  const exportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (agencyRef.current && !agencyRef.current.contains(e.target as Node)) {
        setShowAgencyDropdown(false);
        setAgencySearchTerm('');
      }
      if (categoryTypeRef.current && !categoryTypeRef.current.contains(e.target as Node)) {
        setShowCategoryTypeDropdown(false);
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

  const toggleCategoryType = (value: CategoryType) => {
    setSelectedCategoryTypes(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const toggleAllCategoryTypes = () => {
    setSelectedCategoryTypes(prev =>
      prev.length === CATEGORY_TYPE_OPTIONS.length ? [] : CATEGORY_TYPE_OPTIONS.map(o => o.value)
    );
  };

  const filteredAgencyOptions = AGENCY_OPTIONS.filter(opt =>
    opt.label.toLowerCase().includes(agencySearchTerm.trim().toLowerCase())
  );

  const handleSearch = () => {
    const result = mockDataList.filter(d =>
      (selectedAgencies.length === 0 || selectedAgencies.includes(d.agency)) &&
      (selectedCategoryTypes.length === 0 || selectedCategoryTypes.includes(d.categoryType))
    );
    setAppliedData(result);
    setHasSearched(true);
  };

  const totalCategories = appliedData.reduce((acc, curr) => acc + curr.total, 0);
  const totalRecent = appliedData.reduce((acc, curr) => acc + curr.recent, 0);
  const totalUpdated = appliedData.reduce((acc, curr) => acc + curr.updated, 0);

  const agencyDisplayText = () => {
    if (selectedAgencies.length === 0) return 'Tất cả đơn vị';
    if (selectedAgencies.length === 1) {
      return AGENCY_OPTIONS.find(o => o.value === selectedAgencies[0])?.label ?? selectedAgencies[0];
    }
    return `${selectedAgencies.length} đơn vị đã chọn`;
  };

  const categoryTypeDisplayText = () => {
    if (selectedCategoryTypes.length === 0) return 'Tất cả loại danh mục';
    if (selectedCategoryTypes.length === 1) {
      return categoryTypeLabels[selectedCategoryTypes[0]];
    }
    return `${selectedCategoryTypes.length} loại đã chọn`;
  };

  const handleExportFile = (format: string) => {
    setShowExportMenu(false);
    toast.info(`Đang xuất dữ liệu sang định dạng ${format}...`);
  };

  return (
    <div className="space-y-6">
      {/* Backdrop mờ khi dropdown mở */}
      {(showAgencyDropdown || showCategoryTypeDropdown) && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => { setShowAgencyDropdown(false); setShowCategoryTypeDropdown(false); }}
        />
      )}

      {/* Control Panel - form chung */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] relative z-30">
        <div className="flex flex-wrap items-end gap-3">

          {/* Multi-select Đơn vị quản lý */}
          <div className="flex-1 min-w-[220px]">
            <label className={FILTER_LABEL}>Đơn vị quản lý</label>
            <div className="relative" ref={agencyRef}>
              <button
                type="button"
                onClick={() => setShowAgencyDropdown(prev => !prev)}
                className={`${MS_TRIGGER} ${
                  showAgencyDropdown ? MS_TRIGGER_OPEN : MS_TRIGGER_IDLE
                }`}
              >
                <span className={`truncate ${selectedAgencies.length === 0 ? 'text-[#64748B]' : 'text-[#020817]'}`}>
                  {agencyDisplayText()}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  {selectedAgencies.length > 0 && (
                    <span
                      onClick={(e) => { e.stopPropagation(); setSelectedAgencies([]); }}
                      className={MS_CLEAR}
                    >
                      <X className="w-3 h-3 text-[#475569]" />
                    </span>
                  )}
                  <ChevronDown className={`w-4 h-4 text-[#94A3B8] transition-transform duration-200 ${showAgencyDropdown ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {showAgencyDropdown && (
                <div className={MS_PANEL}>
                  {/* Ô tìm kiếm (search combobox) */}
                  <div className="p-2 border-b border-[#E2E8F0]">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                      <input
                        type="text"
                        autoFocus
                        value={agencySearchTerm}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setAgencySearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Tìm đơn vị..."
                        className={MS_SEARCH}
                      />
                    </div>
                  </div>

                  {agencySearchTerm.trim() === '' && (
                    <button
                      type="button"
                      onClick={toggleAll}
                      className={`${MS_OPTION} border-b border-[#E2E8F0] font-medium`}
                    >
                      <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        selectedAgencies.length === AGENCY_OPTIONS.length
                          ? 'bg-blue-600 border-blue-600'
                          : selectedAgencies.length > 0
                          ? 'bg-[#EAF3FF] border-[#155DFC]'
                          : 'border-[#CBD5E1]'
                      }`}>
                        {selectedAgencies.length === AGENCY_OPTIONS.length && <Check className="w-3 h-3 text-white" />}
                        {selectedAgencies.length > 0 && selectedAgencies.length < AGENCY_OPTIONS.length && (
                          <span className="w-2 h-0.5 bg-blue-600 rounded" />
                        )}
                      </span>
                      Tất cả đơn vị
                    </button>
                  )}

                  <div className="max-h-[180px] overflow-y-auto custom-scrollbar">
                    {filteredAgencyOptions.length === 0 ? (
                      <p className="px-3 py-3 text-[13px] text-[#64748B] text-center">Không tìm thấy đơn vị phù hợp</p>
                    ) : (
                      filteredAgencyOptions.map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => toggleAgency(opt.value)}
                          className={MS_OPTION}
                        >
                          <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                            selectedAgencies.includes(opt.value)
                              ? 'bg-blue-600 border-blue-600'
                              : 'border-[#CBD5E1]'
                          }`}>
                            {selectedAgencies.includes(opt.value) && <Check className="w-3 h-3 text-white" />}
                          </span>
                          <span className="truncate">{opt.label}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Multi-select Loại danh mục */}
          <div className="flex-1 min-w-[220px]">
            <label className={FILTER_LABEL}>Loại danh mục</label>
            <div className="relative" ref={categoryTypeRef}>
              <button
                type="button"
                onClick={() => setShowCategoryTypeDropdown(prev => !prev)}
                className={`${MS_TRIGGER} ${
                  showCategoryTypeDropdown ? MS_TRIGGER_OPEN : MS_TRIGGER_IDLE
                }`}
              >
                <span className={`truncate ${selectedCategoryTypes.length === 0 ? 'text-[#64748B]' : 'text-[#020817]'}`}>
                  {categoryTypeDisplayText()}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  {selectedCategoryTypes.length > 0 && (
                    <span
                      onClick={(e) => { e.stopPropagation(); setSelectedCategoryTypes([]); }}
                      className={MS_CLEAR}
                    >
                      <X className="w-3 h-3 text-[#475569]" />
                    </span>
                  )}
                  <ChevronDown className={`w-4 h-4 text-[#94A3B8] transition-transform duration-200 ${showCategoryTypeDropdown ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {showCategoryTypeDropdown && (
                <div className={MS_PANEL}>
                  <button
                    type="button"
                    onClick={toggleAllCategoryTypes}
                    className={`${MS_OPTION} border-b border-[#E2E8F0] font-medium`}
                  >
                    <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      selectedCategoryTypes.length === CATEGORY_TYPE_OPTIONS.length
                        ? 'bg-blue-600 border-blue-600'
                        : selectedCategoryTypes.length > 0
                        ? 'bg-[#EAF3FF] border-[#155DFC]'
                        : 'border-[#CBD5E1]'
                    }`}>
                      {selectedCategoryTypes.length === CATEGORY_TYPE_OPTIONS.length && <Check className="w-3 h-3 text-white" />}
                      {selectedCategoryTypes.length > 0 && selectedCategoryTypes.length < CATEGORY_TYPE_OPTIONS.length && (
                        <span className="w-2 h-0.5 bg-blue-600 rounded" />
                      )}
                    </span>
                    Tất cả loại danh mục
                  </button>

                  {CATEGORY_TYPE_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleCategoryType(opt.value)}
                      className={MS_OPTION}
                    >
                      <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        selectedCategoryTypes.includes(opt.value)
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-[#CBD5E1]'
                      }`}>
                        {selectedCategoryTypes.includes(opt.value) && <Check className="w-3 h-3 text-white" />}
                      </span>
                      <span className="truncate">{opt.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Thời gian */}
          <div className="min-w-[170px]">
            <label className={FILTER_LABEL}>Thời gian tạo (Năm)</label>
            <select
              title="Thời gian tạo"
              value={dateRange}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setDateRange(e.target.value)}
              className={INPUT_CLS}
            >
              <option value="all">Toàn thời gian</option>
              <option value="2026">Năm 2026</option>
              <option value="2025">Năm 2025</option>
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

      {/* Chưa truy xuất — empty state */}
      {!hasSearched && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl flex flex-col items-center justify-center py-20 gap-4">
          <BarChart2 className="w-12 h-12 text-[#CBD5E1]" />
          <p className="text-[13px] text-[#64748B]">Chọn điều kiện lọc và bấm <span className="text-[#334155] font-medium">Truy xuất dữ liệu</span> để xem kết quả</p>
        </div>
      )}

      {/* Chart */}
      {hasSearched && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
          <p className="text-[14px] font-medium text-[#020817] mb-3">Báo cáo thống kê danh sách danh mục</p>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appliedData} margin={{ top: 10, right: 30, left: 0, bottom: 90 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="agency"
                  tick={{ fontSize: 12, fill: '#64748B' }}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={110}
                />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip cursor={{ fill: 'transparent' }} />
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

      {/* Data Table (compomennt.md 5.3) */}
      {hasSearched && (
        <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto max-h-[420px] custom-scrollbar">
            <table className="w-full border-collapse collection-table text-[13px]">
              <thead className="sticky top-0 z-10 bg-[#F8FAFC]">
                <tr className="h-[42px]">
                  <th className={`${TH} text-center w-12`}>STT</th>
                  <th className={`${TH} text-left`}>Đơn vị quản lý</th>
                  <th className={`${TH} text-right`}>Số lượng danh mục tạo mới</th>
                  <th className={`${TH} text-right`}>Số lượng danh mục cập nhật</th>
                  <th className={`${TH} text-right`}>Tổng số DM</th>
                </tr>
              </thead>
              <tbody>
                {appliedData.map((item, idx) => (
                  <tr key={idx} className={TR}>
                    <td className={`${TD} text-center`}>{idx + 1}</td>
                    <td className={`${TD} text-left max-w-[360px]`}><TruncatedText text={item.agency} /></td>
                    <td className={`${TD} text-right tabular-nums`}>{item.recent}</td>
                    <td className={`${TD} text-right tabular-nums`}>{item.updated}</td>
                    <td className={`${TD} text-right tabular-nums`}>{item.total}</td>
                  </tr>
                ))}
                <tr className={TOTAL_TR}>
                  <td colSpan={2} className={`${TD} text-center`}>Tổng cộng</td>
                  <td className={`${TD} text-right tabular-nums`}>{totalRecent}</td>
                  <td className={`${TD} text-right tabular-nums`}>{totalUpdated}</td>
                  <td className={`${TD} text-right tabular-nums`}>{totalCategories}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
