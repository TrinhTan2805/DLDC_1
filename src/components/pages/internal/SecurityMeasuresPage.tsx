import React, { useState, useMemo } from 'react';
import { DatabasePageTemplate } from '../collection/DatabasePageTemplate';
import { GenericProcessingPage } from '../processing/GenericProcessingPage';
import { 
  FileText, 
  UserCheck, 
  Shield, 
  Package,
  Eye,
  CheckCircle,
  Filter,
  RefreshCw,
  Download,
  X,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

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

interface SecurityMeasuresPageProps {
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

export function SecurityMeasuresPage({ mode = 'thu thập', context = 'thu thập', onBack }: SecurityMeasuresPageProps) {
  const items = [
    { id: '1', title: 'Dữ liệu Thông tin chung (Bao gồm người đăng ký và Hợp đồng bảo đảm)', icon: FileText, color: 'blue', lastMonth: 2345678, thisMonth: 2879200, collected: 5224878, processed: 5120400, shared: 4890000 },
    { id: '2', title: 'Dữ liệu Bên bảo đảm', icon: UserCheck, color: 'green', lastMonth: 1987543, thisMonth: 2346447, collected: 4333990, processed: 4210500, shared: 3950000 },
    { id: '3', title: 'Dữ liệu Bên nhận bảo đảm', icon: Shield, color: 'purple', lastMonth: 2198234, thisMonth: 2526644, collected: 4724878, processed: 4620000, shared: 4320000 },
    { id: '4', title: 'Dữ liệu Tài sản bảo đảm', icon: Package, color: 'orange', lastMonth: 1756789, thisMonth: 2134567, collected: 3891356, processed: 3790200, shared: 3540000 },
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
    return <GenericProcessingPage systemName="CSDL về biện pháp BD" datasets={stats.map((s) => ({ id: s.id, name: s.title }))} />;
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
      recordCode: 'BPBD-2025-001234',
      bookNumber: '01',
      pageNumber: '22',
      performer: 'Hoàng Quốc Việt',
      personalId: '001234567890',
      nationality: 'Việt Nam',
      agency: 'Cục Đăng ký quốc gia giao dịch bảo đảm'
    },
    {
      id: '2',
      name: 'Trần Thị Bình',
      gender: 'Nữ',
      birthDate: '20/08/1990',
      regNo: '001235/2025',
      regDate: '20/08/1990',
      status: 'Đã phê duyệt',
      recordCode: 'BPBD-2025-001235',
      bookNumber: '01',
      pageNumber: '23',
      performer: 'Hoàng Quốc Việt',
      personalId: '001234567891',
      nationality: 'Việt Nam',
      agency: 'Cục Đăng ký quốc gia giao dịch bảo đảm'
    },
    {
      id: '3',
      name: 'Lê Văn Cường',
      gender: 'Nam',
      birthDate: '10/12/1995',
      regNo: '001236/2025',
      regDate: '12/12/2025',
      status: 'Đã phê duyệt',
      recordCode: 'BPBD-2025-001236',
      bookNumber: '01',
      pageNumber: '24',
      performer: 'Phạm Thị Lan',
      personalId: '001234567892',
      nationality: 'Việt Nam',
      agency: 'Cục Đăng ký quốc gia giao dịch bảo đảm'
    },
    {
      id: '4',
      name: 'Phạm Thị Dung',
      gender: 'Nữ',
      birthDate: '05/04/1988',
      regNo: '001237/2025',
      regDate: '06/04/1988',
      status: 'Đã phê duyệt',
      recordCode: 'BPBD-2025-001237',
      bookNumber: '01',
      pageNumber: '25',
      performer: 'Phạm Thị Lan',
      personalId: '001234567893',
      nationality: 'Việt Nam',
      agency: 'Chi nhánh đăng ký giao dịch bảo đảm Hà Nội'
    },
    {
      id: '5',
      name: 'Hoàng Văn Em',
      gender: 'Nam',
      birthDate: '25/11/1992',
      regNo: '001238/2025',
      regDate: '25/11/1992',
      status: 'Đã phê duyệt',
      recordCode: 'BPBD-2025-001238',
      bookNumber: '01',
      pageNumber: '26',
      performer: 'Nguyễn Văn Tuấn',
      personalId: '001234567894',
      nationality: 'Việt Nam',
      agency: 'Chi nhánh đăng ký giao dịch bảo đảm Hà Nội'
    },
    {
      id: '6',
      name: 'Vũ Thị Hoa',
      gender: 'Nữ',
      birthDate: '18/07/1995',
      regNo: '001239/2025',
      regDate: '18/07/1995',
      status: 'Đã phê duyệt',
      recordCode: 'BPBD-2025-001239',
      bookNumber: '01',
      pageNumber: '27',
      performer: 'Nguyễn Văn Tuấn',
      personalId: '001234567895',
      nationality: 'Việt Nam',
      agency: 'Chi nhánh đăng ký giao dịch bảo đảm TP.HCM'
    },
    {
      id: '7',
      name: 'Đỗ Văn Kiên',
      gender: 'Nam',
      birthDate: '05/02/1987',
      regNo: '001240/2025',
      regDate: '05/02/1987',
      status: 'Đã phê duyệt',
      recordCode: 'BPBD-2025-001240',
      bookNumber: '02',
      pageNumber: '11',
      performer: 'Lương Minh Châu',
      personalId: '001234567896',
      nationality: 'Việt Nam',
      agency: 'Chi nhánh đăng ký giao dịch bảo đảm TP.HCM'
    },
    {
      id: '8',
      name: 'Nguyễn Thị Mai',
      gender: 'Nữ',
      birthDate: '12/09/1993',
      regNo: '001241/2025',
      regDate: '12/09/1993',
      status: 'Đã phê duyệt',
      recordCode: 'BPBD-2025-001241',
      bookNumber: '02',
      pageNumber: '12',
      performer: 'Lương Minh Châu',
      personalId: '001234567897',
      nationality: 'Việt Nam',
      agency: 'Chi nhánh đăng ký giao dịch bảo đảm Đà Nẵng'
    },
    {
      id: '9',
      name: 'Trần Văn Nam',
      gender: 'Nam',
      birthDate: '30/06/1984',
      regNo: '001242/2025',
      regDate: '30/06/1984',
      status: 'Đã phê duyệt',
      recordCode: 'BPBD-2025-001242',
      bookNumber: '02',
      pageNumber: '13',
      performer: 'Đặng Thanh Thảo',
      personalId: '001234567898',
      nationality: 'Việt Nam',
      agency: 'Chi nhánh đăng ký giao dịch bảo đảm Đà Nẵng'
    },
    {
      id: '10',
      name: 'Phạm Hồng Phúc',
      gender: 'Nam',
      birthDate: '22/03/2000',
      regNo: '001243/2025',
      regDate: '22/03/2000',
      status: 'Đã phê duyệt',
      recordCode: 'BPBD-2025-001243',
      bookNumber: '02',
      pageNumber: '14',
      performer: 'Đặng Thanh Thảo',
      personalId: '001234567899',
      nationality: 'Việt Nam',
      agency: 'Cục Đăng ký quốc gia giao dịch bảo đảm'
    }
  ];

  const totalRecordsCount = selectedStat ? (selectedStat.lastMonth + selectedStat.thisMonth) : 5224;
  const totalPages = Math.ceil(totalRecordsCount / itemsPerPage);

  return (
    <DatabasePageTemplate
      title="Danh sách dữ liệu"
      description="Quản lý và xem chi tiết dữ liệu CSDL về biện pháp BD"
      onBack={onBack}
      innerSidebarItems={sidebarItems}
      activeId={selectedStat?.id}
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
        {/* Title on its own row */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">{activeTitle}</h2>
        </div>
        
        {/* Buttons on a separate row aligned to the right */}
        <div className="flex items-center justify-end gap-3 mb-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center justify-center border gap-2 text-[13px] font-medium ${
              isFilterOpen ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-[#e2e8f0] text-slate-700 hover:bg-slate-50'
            }`}
            title="Bộ lọc"
          >
            {isFilterOpen ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
            Lọc
          </button>
          
          <button 
            onClick={() => {
              setIsFilterOpen(false);
              setFilterConditions([]);
              setCurrentPage(1);
            }}
            className="p-2 border border-[#e2e8f0] bg-white rounded-lg text-slate-700 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center" 
            title="Tải lại"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          <button 
            onClick={() => alert('Đang kết xuất dữ liệu ra file Excel...')}
            className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2 text-[13px] shadow-sm font-medium"
          >
            <Download className="w-5 h-5" />
            Kết xuất
          </button>
        </div>

        {/* Filter conditions panel */}
        {isFilterOpen && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-4 shadow-sm animate-in slide-in-from-top-2 duration-200 relative">
            <div className="absolute -top-2 right-[125px] w-4 h-4 bg-slate-50 border-t border-l border-slate-200 transform rotate-45"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h4 className="text-[13px] font-semibold text-slate-700">Điều kiện lọc nâng cao</h4>
              <button 
                onClick={() => {
                  const newId = Date.now().toString();
                  setFilterConditions([...filterConditions, { id: newId, logic: 'AND', field: '', operator: '=', type: 'Text', value: '' }]);
                }}
                className="px-3 py-1.5 bg-white border border-blue-200 text-blue-600 rounded-lg flex items-center gap-2 text-[13px] font-medium hover:bg-blue-50 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Thêm điều kiện
              </button>
            </div>

            <div className="space-y-3 relative z-10">
              {filterConditions.map((condition, index) => (
                <div key={condition.id} className="flex items-center gap-3 animate-in fade-in duration-100">
                  <div className="w-20 flex-shrink-0">
                    {index > 0 && (
                      <select
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                    value={condition.field}
                    onChange={(e) => {
                      const newConditions = [...filterConditions];
                      newConditions[index].field = e.target.value;
                      setFilterConditions(newConditions);
                    }}
                  >
                    <option value="">Chọn trường dữ liệu</option>
                    <option value="name">Họ tên</option>
                    <option value="birthDate">Ngày sinh</option>
                    <option value="personalId">Số định danh</option>
                    <option value="gender">Giới tính</option>
                  </select>

                  <select
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
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

                  <div className="flex-1 flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg bg-white shadow-sm">
                    <input
                      type="text"
                      className="flex-1 bg-transparent border-0 p-0 text-[13px] focus:outline-none text-slate-800"
                      placeholder="Nhập giá trị..."
                      value={condition.value}
                      onChange={(e) => {
                        const newConditions = [...filterConditions];
                        newConditions[index].value = e.target.value;
                        setFilterConditions(newConditions);
                      }}
                    />
                  </div>

                  <button 
                    type="button"
                    onClick={() => setFilterConditions(filterConditions.filter(c => c.id !== condition.id))}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {filterConditions.length === 0 && (
                <div className="text-center py-4 text-[13px] text-slate-500">
                  Chưa có điều kiện lọc nào được thêm.
                </div>
              )}
            </div>

            {filterConditions.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-3 relative z-10">
                <button 
                  type="button"
                  onClick={() => alert('Đã áp dụng bộ lọc thành công!')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-[13px] hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  Áp dụng bộ lọc
                </button>
                <button 
                  type="button"
                  onClick={() => setFilterConditions([])} 
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium text-[13px] hover:bg-slate-50 transition-all shadow-sm"
                >
                  Xóa tất cả
                </button>
              </div>
            )}
          </div>
        )}

        {/* Main Table card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
          <div className="flex-1 overflow-auto bg-white">
            <table className="w-full border-collapse collection-table" style={{ fontSize: '16px' }}>
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-center font-semibold text-slate-500 whitespace-nowrap w-12">STT</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-500 whitespace-nowrap">Họ tên</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-500 whitespace-nowrap">Giới tính</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-500 whitespace-nowrap">Ngày sinh</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-500 whitespace-nowrap">Số đăng ký</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-500 whitespace-nowrap">Ngày đăng ký</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-500 whitespace-nowrap">Trạng thái</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-500 whitespace-nowrap">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockRecords.map((record, index) => (
                  <tr key={record.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-4 py-3 text-center text-slate-500 font-medium">
                      {((currentPage - 1) * itemsPerPage + index + 1).toString().padStart(2, '0')}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-900">{record.name}</td>
                    <td className="px-4 py-3 text-center text-slate-600 font-medium">{record.gender}</td>
                    <td className="px-4 py-3 text-center text-slate-600 font-medium font-mono">{record.birthDate}</td>
                    <td className="px-4 py-3 text-center text-slate-600 font-medium font-mono">{record.regNo}</td>
                    <td className="px-4 py-3 text-center text-slate-600 font-medium font-mono">{record.regDate}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold uppercase tracking-wider border border-emerald-100 shadow-sm whitespace-nowrap" style={{ fontSize: '12px' }}>
                        <CheckCircle className="w-3.5 h-3.5" />
                        Đã phê duyệt
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedRecord(record)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination UI */}
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-white flex-wrap gap-4 collection-pagination animate-in fade-in" style={{ fontSize: '16px' }}>
            <div className="flex items-center gap-2">
              <span className="text-slate-600">Hiển thị</span>
              <select
                className="px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                title="Số bản ghi trên trang"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-slate-600">bản ghi/trang</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-slate-600 font-medium">
                {totalRecordsCount > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, totalRecordsCount)} / {totalRecordsCount}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
                >
                  Trước
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5 && currentPage > 3) {
                    pageNum = currentPage - 3 + i + 1;
                    if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1.5 border rounded-lg font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-100'
                          : 'border-[#e2e8f0] text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Record Details Modal Overlay */}
      {selectedRecord && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm" onClick={() => setSelectedRecord(null)}></div>
          
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">Chi tiết bản ghi</h3>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
                  title="Đóng chi tiết"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-0 flex-1 overflow-auto bg-slate-50/30 text-slate-900">
                <div className="p-6 space-y-6">
                  {/* Section: Thông tin hồ sơ */}
                  <section>
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                      Thông tin hồ sơ
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Mã hồ sơ</div>
                        <div className="text-sm text-slate-900 font-semibold">{selectedRecord.recordCode || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Số đăng ký</div>
                        <div className="text-sm text-slate-900 font-semibold font-mono">{selectedRecord.regNo || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Số quyển</div>
                        <div className="text-sm text-slate-900 font-semibold font-mono">{selectedRecord.bookNumber || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Trang số</div>
                        <div className="text-sm text-slate-900 font-semibold font-mono">{selectedRecord.pageNumber || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Ngày đăng ký</div>
                        <div className="text-sm text-slate-900 font-semibold font-mono">{selectedRecord.regDate || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Người thực hiện</div>
                        <div className="text-sm text-slate-900 font-semibold">{selectedRecord.performer || '-'}</div>
                      </div>
                    </div>
                  </section>

                  {/* Section: Thông tin chi tiết */}
                  <section>
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                      Thông tin chi tiết dữ liệu
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Họ và tên</div>
                        <div className="text-sm text-slate-900 font-bold">{selectedRecord.name || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Giới tính</div>
                        <div className="text-sm text-slate-900 font-semibold">{selectedRecord.gender || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Ngày sinh</div>
                        <div className="text-sm text-slate-900 font-semibold font-mono">{selectedRecord.birthDate || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Số định danh cá nhân</div>
                        <div className="text-sm text-slate-900 font-semibold font-mono">{selectedRecord.personalId || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Quốc tịch</div>
                        <div className="text-sm text-slate-900 font-semibold">{selectedRecord.nationality || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Đơn vị chia sẻ</div>
                        <div className="text-sm text-slate-900 font-semibold">{selectedRecord.agency || '-'}</div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end bg-slate-50/50">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-sm shadow-sm transition-all"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </DatabasePageTemplate>
  );
}