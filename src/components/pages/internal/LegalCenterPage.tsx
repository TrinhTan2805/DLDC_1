import React, { useState, useMemo } from 'react';
import { DatabasePageTemplate } from '../collection/DatabasePageTemplate';
import { GenericProcessingPage } from '../processing/GenericProcessingPage';
import { 
  FileText, 
  Search, 
  FileCheck, 
  Users, 
  BookOpen, 
  Heart, 
  Scale, 
  Building, 
  CheckSquare, 
  FileSpreadsheet, 
  UserCheck, 
  Shield, 
  Briefcase, 
  FileSignature, 
  Gavel, 
  Trash2, 
  Globe,
  Eye,
  CheckCircle,
  Filter,
  RefreshCw,
  Download,
  X,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import {
  TruncatedText, RowIconAction, Pagination, filterBtnClass, INPUT_CLS, BTN_PRIMARY, BTN_OUTLINE, BTN_GHOST_ICON,
  ROW_ICON_BTN, TOOLTIP_CLS, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE,
} from '../collection/collectionUi';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../ui/tooltip';

// Bảng theo compomennt.md 5.3 / căn lề 5.3.3
const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';
const ICON_OUTLINE_40 = 'w-10 h-10 shrink-0 rounded-lg border bg-white border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#020817] transition-colors flex items-center justify-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-600';

interface StatCard {
  id: string;
  title: string;
  value: string;
  change: string;
  icon: any;
  color: string;
  lastMonth: number;
  thisMonth: number;
  totalCollected: number;
  totalProcessed: number;
  processingRate: number;
  collected?: number;
  processed?: number;
  shared?: number;
}

interface LegalCenterPageProps {
  mode?: 'thu thập' | 'xử lý';
  context?: 'thu thập' | 'chia sẻ';
  onBack?: () => void;
}

interface RecordItem {
  id: string;
  name: string;
  gender: string;
  birthDate: string;
  regNo: string;
  regDate: string;
  status: string;
  recordCode?: string;
  bookNumber?: string;
  pageNumber?: string;
  performer?: string;
  personalId?: string;
  nationality?: string;
  agency?: string;
}

export function LegalCenterPage({ mode = 'thu thập', context = 'thu thập', onBack }: LegalCenterPageProps) {
  const items = [
    { id: '1', title: 'Dữ liệu Xây dựng văn bản quy phạm pháp luật', icon: FileText, color: 'blue', lastMonth: 4567, thisMonth: 5890, collected: 10457, processed: 9987, shared: 8490 },
    { id: '2', title: 'Dữ liệu Kiểm tra văn bản quy phạm pháp luật', icon: Search, color: 'green', lastMonth: 2345, thisMonth: 3412, collected: 5757, processed: 5621, shared: 4890 },
    { id: '3', title: 'Dữ liệu Rà soát văn bản quy phạm pháp luật', icon: FileCheck, color: 'purple', lastMonth: 6789, thisMonth: 7890, collected: 14679, processed: 13911, shared: 12756 },
    { id: '4', title: 'Dữ liệu Tổ chức và người làm công tác pháp chế', icon: Users, color: 'orange', lastMonth: 1234, thisMonth: 1567, collected: 2801, processed: 2654, shared: 2398 },
    { id: '5', title: 'Dữ liệu Phổ biến, giáo dục pháp luật', icon: BookOpen, color: 'blue', lastMonth: 8901, thisMonth: 9543, collected: 18444, processed: 17876, shared: 15432 },
    { id: '6', title: 'Dữ liệu Hòa giải ở cơ sở', icon: Heart, color: 'green', lastMonth: 3456, thisMonth: 4123, collected: 7579, processed: 7265, shared: 6654 },
    { id: '7', title: 'Dữ liệu Chuẩn tiếp cận pháp luật', icon: Scale, color: 'purple', lastMonth: 5678, thisMonth: 6234, collected: 11912, processed: 11450, shared: 10234 },
    { id: '8', title: 'Dữ liệu Hộ tịch', icon: Building, color: 'orange', lastMonth: 156700, thisMonth: 189200, collected: 345900, processed: 338900, shared: 312000 },
    { id: '9', title: 'Dữ liệu Chứng thực', icon: CheckSquare, color: 'blue', lastMonth: 234500, thisMonth: 278900, collected: 513400, processed: 508200, shared: 467800 },
    { id: '10', title: 'Dữ liệu Lý lịch tư pháp', icon: FileSpreadsheet, color: 'green', lastMonth: 67890, thisMonth: 78900, collected: 146790, processed: 142100, shared: 131200 },
    { id: '11', title: 'Dữ liệu Nuôi con nuôi', icon: UserCheck, color: 'purple', lastMonth: 890, thisMonth: 1120, collected: 2010, processed: 1980, shared: 1850 },
    { id: '12', title: 'Dữ liệu Trợ giúp pháp lý', icon: Heart, color: 'orange', lastMonth: 12345, thisMonth: 14560, collected: 26905, processed: 25870, shared: 23900 },
    { id: '13', title: 'Dữ liệu Đăng ký giao dịch bảo đảm', icon: Shield, color: 'blue', lastMonth: 89012, thisMonth: 95430, collected: 184442, processed: 179500, shared: 165400 },
    { id: '14', title: 'Dữ liệu Luật sư', icon: Briefcase, color: 'green', lastMonth: 4567, thisMonth: 5120, collected: 9687, processed: 9450, shared: 8900 },
    { id: '15', title: 'Dữ liệu Công chứng', icon: FileSignature, color: 'purple', lastMonth: 67890, thisMonth: 74500, collected: 142390, processed: 139500, shared: 128900 },
    { id: '16', title: 'Dữ liệu Giám định tư pháp', icon: Search, color: 'orange', lastMonth: 2345, thisMonth: 2890, collected: 5235, processed: 5110, shared: 4780 },
    { id: '17', title: 'Dữ liệu Đấu giá tài sản', icon: Gavel, color: 'blue', lastMonth: 5678, thisMonth: 6340, collected: 12018, processed: 11890, shared: 10950 },
    { id: '18', title: 'Dữ liệu Trọng tài thương mại', icon: Users, color: 'green', lastMonth: 1234, thisMonth: 1450, collected: 2684, processed: 2590, shared: 2340 },
    { id: '19', title: 'Dữ liệu Hòa giải thương mại', icon: Heart, color: 'purple', lastMonth: 890, thisMonth: 1050, collected: 1940, processed: 1890, shared: 1720 },
    { id: '20', title: 'Dữ liệu Quản lý thanh lý tài sản', icon: Trash2, color: 'orange', lastMonth: 567, thisMonth: 680, collected: 1247, processed: 1210, shared: 1100 },
    { id: '21', title: 'Dữ liệu Trương trợ tư pháp', icon: Globe, color: 'blue', lastMonth: 1234, thisMonth: 1456, collected: 2690, processed: 2580, shared: 2390 },
  ];

  const stats: StatCard[] = useMemo(() => {
    return items.map(item => {
      const total = item.lastMonth + item.thisMonth;
      const change = ((item.thisMonth - item.lastMonth) / item.lastMonth * 100).toFixed(1);
      const changeStr = change.startsWith('-') ? change : `+${change}`;
      
      const totalCollected = total;
      const totalProcessed = Math.floor(total * (0.95 + Math.random() * 0.04));
      const processingRate = Math.floor((totalProcessed / totalCollected) * 100);

      return {
        id: item.id,
        title: item.title,
        value: total.toLocaleString(),
        change: `${changeStr}%`,
        icon: item.icon,
        color: item.color,
        lastMonth: item.lastMonth,
        thisMonth: item.thisMonth,
        totalCollected,
        totalProcessed,
        processingRate,
        collected: item.collected,
        processed: item.processed,
        shared: item.shared,
      };
    });
  }, []);

  const [selectedStat, setSelectedStat] = useState<StatCard | null>(stats[0]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterConditions, setFilterConditions] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRecord, setSelectedRecord] = useState<RecordItem | null>(null);

  if (mode === 'xử lý') {
    return <GenericProcessingPage systemName="Phần mềm tk ngành tư pháp phục vụ chia sẻ dữ liệu mở" datasets={stats.map((s) => ({ id: s.id, name: s.title }))} />;
  }

  // Sidebar items: "Bộ dữ liệu " prefix with proper capitalization
  const sidebarItems = stats.map(s => {
    let titleWithoutPrefix = s.title;
    if (titleWithoutPrefix.startsWith('Dữ liệu ')) {
      titleWithoutPrefix = titleWithoutPrefix.substring(8);
    }
    const rest = titleWithoutPrefix.charAt(0).toLowerCase() + titleWithoutPrefix.slice(1);
    return {
      id: s.id,
      label: `Bộ dữ liệu ${rest}`
    };
  });

  // Strip prefix for the active title on right pane
  const activeTitle = selectedStat ? (() => {
    let t = selectedStat.title;
    if (t.startsWith('Dữ liệu ')) {
      t = t.substring(8);
    }
    return t.charAt(0).toUpperCase() + t.slice(1);
  })() : '';

  // Realistic mock data matching CSDL Hộ tịch điện tử format
  const mockRecords: RecordItem[] = [
    {
      id: '1',
      name: 'Nguyễn Văn An',
      gender: 'Nam',
      birthDate: '15/05/1985',
      regNo: '001234/2025',
      regDate: '15/05/1985',
      status: 'Đã phê duyệt',
      recordCode: 'HS-2025-001234',
      bookNumber: '01',
      pageNumber: '12',
      performer: 'Trần Minh Quân',
      personalId: '001234567890',
      nationality: 'Việt Nam',
      agency: 'Cục Công nghệ thông tin - Bộ Tư pháp'
    },
    {
      id: '2',
      name: 'Trần Thị Bình',
      gender: 'Nữ',
      birthDate: '20/08/1990',
      regNo: '001235/2025',
      regDate: '20/08/1990',
      status: 'Đã phê duyệt',
      recordCode: 'HS-2025-001235',
      bookNumber: '01',
      pageNumber: '13',
      performer: 'Trần Minh Quân',
      personalId: '001234567891',
      nationality: 'Việt Nam',
      agency: 'Cục Công nghệ thông tin - Bộ Tư pháp'
    },
    {
      id: '3',
      name: 'Lê Văn Cường',
      gender: 'Nam',
      birthDate: '10/12/1995',
      regNo: '001236/2025',
      regDate: '12/12/2025',
      status: 'Đã phê duyệt',
      recordCode: 'HS-2025-001236',
      bookNumber: '01',
      pageNumber: '14',
      performer: 'Nguyễn Thị Mai',
      personalId: '001234567892',
      nationality: 'Việt Nam',
      agency: 'Cục Bổ trợ tư pháp - Bộ Tư pháp'
    },
    {
      id: '4',
      name: 'Phạm Thị Dung',
      gender: 'Nữ',
      birthDate: '05/04/1988',
      regNo: '001237/2025',
      regDate: '06/04/1988',
      status: 'Đã phê duyệt',
      recordCode: 'HS-2025-001237',
      bookNumber: '01',
      pageNumber: '15',
      performer: 'Nguyễn Thị Mai',
      personalId: '001234567893',
      nationality: 'Việt Nam',
      agency: 'Cục Hộ tịch, quốc tịch, chứng thực'
    },
    {
      id: '5',
      name: 'Hoàng Văn Em',
      gender: 'Nam',
      birthDate: '25/11/1992',
      regNo: '001238/2025',
      regDate: '25/11/1992',
      status: 'Đã phê duyệt',
      recordCode: 'HS-2025-001238',
      bookNumber: '01',
      pageNumber: '16',
      performer: 'Phạm Thanh Sơn',
      personalId: '001234567894',
      nationality: 'Việt Nam',
      agency: 'Cục Kế hoạch - Tài chính'
    },
    {
      id: '6',
      name: 'Vũ Thị Hoa',
      gender: 'Nữ',
      birthDate: '18/07/1995',
      regNo: '001239/2025',
      regDate: '18/07/1995',
      status: 'Đã phê duyệt',
      recordCode: 'HS-2025-001239',
      bookNumber: '01',
      pageNumber: '17',
      performer: 'Phạm Thanh Sơn',
      personalId: '001234567895',
      nationality: 'Việt Nam',
      agency: 'Cục Kiểm tra văn bản QPPL'
    },
    {
      id: '7',
      name: 'Đỗ Văn Kiên',
      gender: 'Nam',
      birthDate: '05/02/1987',
      regNo: '001240/2025',
      regDate: '05/02/1987',
      status: 'Đã phê duyệt',
      recordCode: 'HS-2025-001240',
      bookNumber: '02',
      pageNumber: '01',
      performer: 'Vũ Quốc Trung',
      personalId: '001234567896',
      nationality: 'Việt Nam',
      agency: 'Vụ Hợp tác quốc tế'
    },
    {
      id: '8',
      name: 'Nguyễn Thị Mai',
      gender: 'Nữ',
      birthDate: '12/09/1993',
      regNo: '001241/2025',
      regDate: '12/09/1993',
      status: 'Đã phê duyệt',
      recordCode: 'HS-2025-001241',
      bookNumber: '02',
      pageNumber: '02',
      performer: 'Vũ Quốc Trung',
      personalId: '001234567897',
      nationality: 'Việt Nam',
      agency: 'Cục Công nghệ thông tin - Bộ Tư pháp'
    },
    {
      id: '9',
      name: 'Trần Văn Nam',
      gender: 'Nam',
      birthDate: '30/06/1984',
      regNo: '001242/2025',
      regDate: '30/06/1984',
      status: 'Đã phê duyệt',
      recordCode: 'HS-2025-001242',
      bookNumber: '02',
      pageNumber: '03',
      performer: 'Lê Hoàng Long',
      personalId: '001234567898',
      nationality: 'Việt Nam',
      agency: 'Cục Bổ trợ tư pháp - Bộ Tư pháp'
    },
    {
      id: '10',
      name: 'Phạm Hồng Phúc',
      gender: 'Nam',
      birthDate: '22/03/2000',
      regNo: '001243/2025',
      regDate: '22/03/2000',
      status: 'Đã phê duyệt',
      recordCode: 'HS-2025-001243',
      bookNumber: '02',
      pageNumber: '04',
      performer: 'Lê Hoàng Long',
      personalId: '001234567899',
      nationality: 'Việt Nam',
      agency: 'Cục Hộ tịch, quốc tịch, chứng thực'
    }
  ];

  const totalRecordsCount = selectedStat ? (selectedStat.lastMonth + selectedStat.thisMonth) : 3424;

  return (
    <DatabasePageTemplate
      title="Danh sách dữ liệu"
      description="Quản lý và xem chi tiết dữ liệu Phần mềm tk ngành tư pháp phục vụ chia sẻ dữ liệu mở"
      onBack={onBack}
      innerSidebarItems={sidebarItems}
      activeId={selectedStat?.id}
      stretchHeight
      onSelectDataType={(id) => {
        const stat = stats.find(s => s.id === id);
        if (stat) {
          setSelectedStat(stat);
          setCurrentPage(1);
          setIsFilterOpen(false);
          setFilterConditions([]);
        }
      }}
    >
      <div className="flex-1 flex flex-col overflow-hidden bg-transparent">
        {/* Tiêu đề trang (mục 4.4: 20px/700/#2A0F0F) */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[20px] font-bold text-[#2A0F0F] leading-8">{activeTitle}</h1>
        </div>

        {/* Nút thao tác căn phải (mục 5.19) */}
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            aria-label="Bộ lọc nâng cao"
            aria-expanded={isFilterOpen}
            className={filterBtnClass(isFilterOpen)}
            title="Bộ lọc nâng cao"
          >
            {isFilterOpen ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsFilterOpen(false);
              setFilterConditions([]);
              setCurrentPage(1);
            }}
            aria-label="Tải lại"
            title="Tải lại"
            className={ICON_OUTLINE_40}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Vùng lọc nâng cao: khung xám, cách thanh thao tác 15px */}
        {isFilterOpen && (
          <div className="mt-[15px] p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[14px] font-medium text-[#020817]">Điều kiện lọc nâng cao</h4>
              <button
                type="button"
                onClick={() => {
                  const newId = Date.now().toString();
                  setFilterConditions([...filterConditions, { id: newId, logic: 'AND', field: '', operator: '=', type: 'Text', value: '' }]);
                }}
                className={BTN_OUTLINE}
              >
                <Plus className="w-4 h-4" />
                Thêm điều kiện
              </button>
            </div>

            <div className="space-y-2">
              {filterConditions.map((condition, index) => (
                <div key={condition.id} className="flex items-center gap-2">
                  <div className="w-24 flex-shrink-0">
                    {index > 0 && (
                      <select
                        aria-label="Toán tử logic"
                        className={INPUT_CLS}
                        value={condition.logic}
                        onChange={(e) => {
                          const newConditions = [...filterConditions];
                          newConditions[index].logic = e.target.value;
                          setFilterConditions(newConditions);
                        }}
                      >
                        <option value="AND">AND</option>
                        <option value="OR">OR</option>
                      </select>
                    )}
                  </div>

                  <select
                    aria-label="Trường dữ liệu"
                    className={`${INPUT_CLS} !w-auto flex-1`}
                    value={condition.field}
                    onChange={(e) => {
                      const newConditions = [...filterConditions];
                      newConditions[index].field = e.target.value;
                      setFilterConditions(newConditions);
                    }}
                  >
                    <option value="" disabled hidden>-- Chọn trường dữ liệu --</option>
                    <option value="name">Họ tên</option>
                    <option value="birthDate">Ngày sinh</option>
                    <option value="personalId">Số định danh</option>
                    <option value="gender">Giới tính</option>
                  </select>

                  <select
                    aria-label="Phép so sánh"
                    className={`${INPUT_CLS} !w-auto flex-1`}
                    value={condition.operator}
                    onChange={(e) => {
                      const newConditions = [...filterConditions];
                      newConditions[index].operator = e.target.value;
                      setFilterConditions(newConditions);
                    }}
                  >
                    <option value="=">Bằng (=)</option>
                    <option value="contains">Chứa</option>
                    <option value="starts">Bắt đầu</option>
                  </select>

                  <input
                    aria-label="Giá trị"
                    type="text"
                    className={`${INPUT_CLS} !w-auto flex-1`}
                    placeholder="Nhập giá trị..."
                    value={condition.value}
                    onChange={(e) => {
                      const newConditions = [...filterConditions];
                      newConditions[index].value = e.target.value;
                      setFilterConditions(newConditions);
                    }}
                  />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        aria-label="Xóa điều kiện"
                        onClick={() => setFilterConditions(filterConditions.filter(c => c.id !== condition.id))}
                        className={`${ROW_ICON_BTN} hover:!text-[#DC2626]`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={4} className={TOOLTIP_CLS}>Xóa điều kiện</TooltipContent>
                  </Tooltip>
                </div>
              ))}
              {filterConditions.length === 0 && (
                <p className="text-[13px] text-[#64748B]">Chưa có điều kiện lọc nào được thêm.</p>
              )}
            </div>

            {filterConditions.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#E2E8F0] flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toast.success('Đã áp dụng bộ lọc thành công!')}
                  className={BTN_PRIMARY}
                >
                  <CheckCircle className="w-4 h-4" />
                  Áp dụng bộ lọc
                </button>
                <button type="button" onClick={() => setFilterConditions([])} className={BTN_OUTLINE}>
                  Xóa tất cả
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bảng dữ liệu (mục 5.3) */}
        <div className="mt-4 bg-white border border-[#E2E8F0] rounded-lg overflow-hidden flex-1 flex flex-col">
          <div className="flex-1 overflow-auto bg-white">
            <table className="w-full border-collapse collection-table text-[13px]">
              <thead className="bg-[#F8FAFC] sticky top-0 z-10">
                <tr className="h-[42px]">
                  <th className={`${TH} text-center w-12`}>STT</th>
                  <th className={`${TH} text-left`}>Họ tên</th>
                  <th className={`${TH} text-left`}>Giới tính</th>
                  <th className={`${TH} text-left`}>Ngày sinh</th>
                  <th className={`${TH} text-left`}>Số đăng ký</th>
                  <th className={`${TH} text-left`}>Ngày đăng ký</th>
                  <th className={`${TH} text-center w-20`}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {mockRecords.map((record, index) => (
                  <tr key={record.id} className="h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                    <td className={`${TD} text-center whitespace-nowrap`}>
                      {((currentPage - 1) * itemsPerPage + index + 1).toString().padStart(2, '0')}
                    </td>
                    <td className={`${TD} text-left max-w-[360px]`}>
                      <TruncatedText text={record.name} />
                    </td>
                    <td className={`${TD} text-left whitespace-nowrap`}>{record.gender}</td>
                    <td className={`${TD} text-left whitespace-nowrap`}>{record.birthDate}</td>
                    <td className={`${TD} text-left whitespace-nowrap`}>{record.regNo}</td>
                    <td className={`${TD} text-left whitespace-nowrap`}>{record.regDate}</td>
                    <td className={`${TD} text-center`}>
                      <RowIconAction label="Xem chi tiết" onClick={() => setSelectedRecord(record)}>
                        <Eye className="w-4 h-4" />
                      </RowIconAction>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phân trang (mục 5.14) */}
          <Pagination
            className="border-t border-[#E2E8F0]"
            currentPage={currentPage}
            totalItems={totalRecordsCount}
            pageSize={itemsPerPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={setItemsPerPage}
          />
        </div>
      </div>

      {/* Xem chi tiết bản ghi (mục 5.17: nhãn – giá trị) */}
      {selectedRecord && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedRecord(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between flex-shrink-0">
              <h3 className="text-[16px] font-semibold text-[#020817]">Chi tiết bản ghi</h3>
              <button type="button" onClick={() => setSelectedRecord(null)} className={BTN_GHOST_ICON} aria-label="Đóng chi tiết" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-auto custom-scrollbar space-y-6">
              <section>
                <h4 className={`${SECTION_TITLE} mb-3`}>Thông tin hồ sơ</h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {([
                    ['Mã hồ sơ', selectedRecord.recordCode],
                    ['Số đăng ký', selectedRecord.regNo],
                    ['Số quyển', selectedRecord.bookNumber],
                    ['Trang số', selectedRecord.pageNumber],
                    ['Ngày đăng ký', selectedRecord.regDate],
                    ['Người thực hiện', selectedRecord.performer],
                  ] as [string, string | undefined][]).map(([label, value]) => (
                    <div key={label} className="space-y-1">
                      <div className={FIELD_LABEL}>{label}</div>
                      <div className={`${FIELD_VALUE} break-words`}>{value || '-'}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="border-t border-[#E2E8F0] pt-4">
                <h4 className={`${SECTION_TITLE} mb-3`}>Thông tin chi tiết dữ liệu</h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {([
                    ['Họ và tên', selectedRecord.name],
                    ['Giới tính', selectedRecord.gender],
                    ['Ngày sinh', selectedRecord.birthDate],
                    ['Số định danh cá nhân', selectedRecord.personalId],
                    ['Quốc tịch', selectedRecord.nationality],
                    ['Đơn vị chia sẻ', selectedRecord.agency],
                  ] as [string, string | undefined][]).map(([label, value]) => (
                    <div key={label} className="space-y-1">
                      <div className={FIELD_LABEL}>{label}</div>
                      <div className={`${FIELD_VALUE} break-words`}>{value || '-'}</div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end flex-shrink-0">
              <button type="button" onClick={() => setSelectedRecord(null)} className={BTN_OUTLINE}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </DatabasePageTemplate>
  );
}
