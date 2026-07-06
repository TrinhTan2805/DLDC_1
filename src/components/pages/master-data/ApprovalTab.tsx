import { useState, useEffect, ChangeEvent } from 'react';
import { CheckCircle2, XCircle, Clock, Database, Eye, AlertCircle, Search } from 'lucide-react';
import { BaseModal } from '../../common/BaseModal';

type ApprovalStatus = 'pending' | 'approved' | 'rejected';
type DataType = 'standard' | 'reference' | 'transactional';

interface ApprovalRecord {
  id: string;
  code: string;
  name: string;
  dataType: DataType;
  managingAgency: string;
  submittedBy: string;
  submittedDate: string;
  status: ApprovalStatus;
  description: string;
  attributesCount: number;
  mergeRulesCount: number;
  relationshipsCount: number;
  hasIdentifierRule: boolean;
  reviewedBy?: string;
  reviewedDate?: string;
  reviewComment?: string;
  history: ApprovalHistory[];
}

interface ApprovalHistory {
  id: string;
  action: 'submitted' | 'approved' | 'rejected' | 'updated';
  performedBy: string;
  performedDate: string;
  comment?: string;
}

const mockApprovalRecords: ApprovalRecord[] = [
  {
    id: '1',
    code: 'MD-CITIZEN-001',
    name: 'Bộ dữ liệu chủ Công dân',
    dataType: 'standard',
    managingAgency: 'Cục Hộ tịch - Quốc tịch - Chứng thực',
    submittedBy: 'Nguyễn Văn A',
    submittedDate: '20/12/2024 14:30',
    status: 'pending',
    description: 'Dữ liệu chuẩn về công dân Việt Nam bao gồm thông tin cá nhân như họ tên, ngày sinh, số CCCD, nơi cư trú theo quy định của Luật CCCD 2023',
    attributesCount: 15,
    mergeRulesCount: 3,
    relationshipsCount: 2,
    hasIdentifierRule: true,
    history: [
      {
        id: 'h1',
        action: 'submitted',
        performedBy: 'Nguyễn Văn A',
        performedDate: '20/12/2024 14:30',
        comment: 'Gửi phê duyệt bộ dữ liệu chủ Công dân'
      }
    ]
  },
  {
    id: '2',
    code: 'MD-ORG-001',
    name: 'Bộ dữ liệu chủ Tổ chức',
    dataType: 'standard',
    managingAgency: 'Cục Đăng ký kinh doanh',
    submittedBy: 'Trần Thị B',
    submittedDate: '18/12/2024 10:15',
    status: 'pending',
    description: 'Thông tin doanh nghiệp, tổ chức, cơ quan nhà nước bao gồm tên, mã số thuế, địa chỉ, người đại diện',
    attributesCount: 12,
    mergeRulesCount: 2,
    relationshipsCount: 1,
    hasIdentifierRule: true,
    history: [
      {
        id: 'h2',
        action: 'submitted',
        performedBy: 'Trần Thị B',
        performedDate: '18/12/2024 10:15',
        comment: 'Gửi phê duyệt bộ dữ liệu chủ Tổ chức'
      }
    ]
  },
  {
    id: '3',
    code: 'MD-DOC-001',
    name: 'Bộ dữ liệu chủ Văn bản pháp luật',
    dataType: 'reference',
    managingAgency: 'Bộ Tư pháp',
    submittedBy: 'Lê Văn C',
    submittedDate: '15/12/2024 16:45',
    status: 'approved',
    description: 'Danh mục văn bản pháp luật, nghị định, thông tư, quyết định',
    attributesCount: 20,
    mergeRulesCount: 4,
    relationshipsCount: 3,
    hasIdentifierRule: true,
    reviewedBy: 'Phó Cục trưởng Nguyễn Xuân D',
    reviewedDate: '16/12/2024 09:20',
    reviewComment: 'Đã xem xét kỹ lưỡng. Cấu trúc dữ liệu hợp lý, quy tắc hợp nhất và định danh đầy đủ. Phê duyệt.',
    history: [
      {
        id: 'h3-1',
        action: 'submitted',
        performedBy: 'Lê Văn C',
        performedDate: '15/12/2024 16:45',
        comment: 'Gửi phê duyệt bộ dữ liệu chủ Văn bản pháp luật'
      },
      {
        id: 'h3-2',
        action: 'approved',
        performedBy: 'Phó Cục trưởng Nguyễn Xuân D',
        performedDate: '16/12/2024 09:20',
        comment: 'Đã xem xét kỹ lưỡng. Cấu trúc dữ liệu hợp lý, quy tắc hợp nhất và định danh đầy đủ. Phê duyệt.'
      }
    ]
  },
  {
    id: '4',
    code: 'MD-ADMIN-001',
    name: 'Bộ dữ liệu chủ Đơn vị hành chính',
    dataType: 'reference',
    managingAgency: 'Bộ Nội vụ',
    submittedBy: 'Phạm Thị D',
    submittedDate: '10/12/2024 11:00',
    status: 'rejected',
    description: 'Danh mục 63 tỉnh/thành phố, quận/huyện, phường/xã của Việt Nam',
    attributesCount: 8,
    mergeRulesCount: 1,
    relationshipsCount: 0,
    hasIdentifierRule: false,
    reviewedBy: 'Phó Cục trưởng Nguyễn Xuân D',
    reviewedDate: '11/12/2024 14:30',
    reviewComment: 'Thiếu quy tắc định danh duy nhất. Cần bổ sung quy tắc hợp nhất từ các nguồn khác nhau. Vui lòng hoàn thiện và gửi lại.',
    history: [
      {
        id: 'h4-1',
        action: 'submitted',
        performedBy: 'Phạm Thị D',
        performedDate: '10/12/2024 11:00',
        comment: 'Gửi phê duyệt bộ dữ liệu chủ Đơn vị hành chính'
      },
      {
        id: 'h4-2',
        action: 'rejected',
        performedBy: 'Phó Cục trưởng Nguyễn Xuân D',
        performedDate: '11/12/2024 14:30',
        comment: 'Thiếu quy tắc định danh duy nhất. Cần bổ sung quy tắc hợp nhất từ các nguồn khác nhau. Vui lòng hoàn thiện và gửi lại.'
      }
    ]
  }
];

const dataTypeLabels: Record<DataType, string> = {
  standard: 'Dữ liệu chuẩn',
  reference: 'Dữ liệu tham chiếu',
  transactional: 'Dữ liệu giao dịch'
};

const statusBadgeClass: Record<ApprovalStatus, string> = {
  pending: 'bg-orange-50 text-orange-600 border-orange-200',
  approved: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-600 border-red-200'
};

const statusLabels: Record<ApprovalStatus, string> = {
  pending: 'Chờ phê duyệt',
  approved: 'Đã phê duyệt',
  rejected: 'Từ chối'
};

export function ApprovalTab() {
  const [records, setRecords] = useState<ApprovalRecord[]>(mockApprovalRecords);
  const [selectedRecord, setSelectedRecord] = useState<ApprovalRecord | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [comment, setComment] = useState('');
  const [filterStatus, setFilterStatus] = useState<ApprovalStatus | 'all'>('all');

  // Bulk actions
  const [bulkTargetIds, setBulkTargetIds] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Search
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const pendingCount = records.filter(r => r.status === 'pending').length;
  const approvedCount = records.filter(r => r.status === 'approved').length;
  const rejectedCount = records.filter(r => r.status === 'rejected').length;
  const totalCount = records.length;

  const filteredRecords = records.filter(r => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch = !q || r.code.toLowerCase().includes(q) || r.name.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  useEffect(() => { setCurrentPage(1); setSelectedIds([]); }, [filterStatus, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const pendingIds = filteredRecords.filter(r => r.status === 'pending').map(r => r.id);

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedIds(prev => prev.length === pendingIds.length ? [] : pendingIds);
  };

  const handleViewDetail = (record: ApprovalRecord) => {
    setSelectedRecord(record);
    setShowDetailModal(true);
  };

  const handleApprove = (record: ApprovalRecord) => {
    setSelectedRecord(record);
    setBulkTargetIds([]);
    setApprovalAction('approve');
    setComment('');
    setShowApprovalForm(true);
  };

  const handleReject = (record: ApprovalRecord) => {
    setSelectedRecord(record);
    setBulkTargetIds([]);
    setApprovalAction('reject');
    setComment('');
    setShowApprovalForm(true);
  };

  const handleQuickApprove = (ids: string[]) => {
    setSelectedRecord(null);
    setBulkTargetIds(ids);
    setApprovalAction('approve');
    setComment('');
    setShowApprovalForm(true);
  };

  const handleQuickReject = (ids: string[]) => {
    setSelectedRecord(null);
    setBulkTargetIds(ids);
    setApprovalAction('reject');
    setComment('');
    setShowApprovalForm(true);
  };

  const targetRecords = bulkTargetIds.length > 0
    ? records.filter(r => bulkTargetIds.includes(r.id))
    : selectedRecord ? [selectedRecord] : [];

  const handleSubmitApproval = () => {
    const targetIds = targetRecords.map(r => r.id);
    if (targetIds.length === 0) return;

    if (approvalAction === 'reject' && !comment.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const updatedRecords = records.map(r => {
      if (!targetIds.includes(r.id)) return r;
      const newHistory: ApprovalHistory = {
        id: `h-${Date.now()}-${r.id}`,
        action: approvalAction === 'approve' ? 'approved' : 'rejected',
        performedBy: 'Phó Cục trưởng Nguyễn Xuân D', // Current user
        performedDate: dateStr,
        comment: comment || undefined
      };
      return {
        ...r,
        status: (approvalAction === 'approve' ? 'approved' : 'rejected') as ApprovalStatus,
        reviewedBy: 'Phó Cục trưởng Nguyễn Xuân D',
        reviewedDate: dateStr,
        reviewComment: comment,
        history: [...r.history, newHistory]
      };
    });

    setRecords(updatedRecords);
    setShowApprovalForm(false);
    setSelectedRecord(null);
    setBulkTargetIds([]);
    setSelectedIds([]);
    setComment('');

    const actionText = approvalAction === 'approve' ? 'phê duyệt' : 'từ chối';
    alert(`✅ Đã ${actionText} thành công ${targetIds.length} bản ghi!`);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div>
        <h2 className="text-[18px] font-bold text-slate-800">Phê duyệt dữ liệu chủ</h2>
        <p className="text-[13px] text-slate-500 mt-0.5">Lãnh đạo nghiệp vụ xem xét và phê duyệt các bộ dữ liệu chủ chờ phê duyệt</p>
      </div>

      {/* Bulk action bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-slate-600">
            Đã chọn: <span className="font-semibold text-blue-600">{selectedIds.length}</span> bản ghi
          </span>
          <button
            onClick={() => handleQuickApprove(selectedIds)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-[13px]"
          >
            <CheckCircle2 className="w-4 h-4" />
            Phê duyệt nhanh
          </button>
          <button
            onClick={() => handleQuickReject(selectedIds)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-[13px]"
          >
            <XCircle className="w-4 h-4" />
            Từ chối nhanh
          </button>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[13px] text-orange-700">Chờ phê duyệt</p>
              <p className="text-2xl text-orange-900">{pendingCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[13px] text-green-700">Đã phê duyệt</p>
              <p className="text-2xl text-green-900">{approvedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[13px] text-red-700">Từ chối</p>
              <p className="text-2xl text-red-900">{rejectedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[13px] text-blue-700">Tổng dữ liệu chủ</p>
              <p className="text-2xl text-blue-900">{totalCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Status Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              title="Tìm kiếm bộ dữ liệu chủ"
              placeholder="Tìm kiếm theo mã, tên bộ dữ liệu chủ..."
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { key: 'all' as const, label: `Tất cả (${totalCount})`, activeClass: 'bg-slate-700 text-white border-slate-700' },
              { key: 'pending' as const, label: `Chờ phê duyệt (${pendingCount})`, activeClass: 'bg-orange-500 text-white border-orange-500' },
              { key: 'approved' as const, label: `Đã phê duyệt (${approvedCount})`, activeClass: 'bg-green-600 text-white border-green-600' },
              { key: 'rejected' as const, label: `Từ chối (${rejectedCount})`, activeClass: 'bg-red-500 text-white border-red-500' },
            ].map(opt => (
              <button
                key={opt.key}
                onClick={() => setFilterStatus(opt.key)}
                className={`px-3 py-2 text-[13px] rounded-lg border transition-all font-medium cursor-pointer ${filterStatus === opt.key
                  ? opt.activeClass
                  : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    title="Chọn tất cả"
                    checked={pendingIds.length > 0 && selectedIds.length === pendingIds.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 text-left text-[13px] font-semibold text-slate-500 whitespace-nowrap">STT</th>
                <th className="px-4 py-3 text-left text-[13px] font-semibold text-slate-500 whitespace-nowrap">Mã</th>
                <th className="px-4 py-3 text-left text-[13px] font-semibold text-slate-500 whitespace-nowrap">Tên dữ liệu chủ</th>
                <th className="px-4 py-3 text-left text-[13px] font-semibold text-slate-500 whitespace-nowrap">Loại dữ liệu</th>
                <th className="px-4 py-3 text-left text-[13px] font-semibold text-slate-500 whitespace-nowrap">Cơ quan quản lý</th>
                <th className="px-4 py-3 text-left text-[13px] font-semibold text-slate-500 whitespace-nowrap">Ngày gửi</th>
                <th className="px-4 py-3 text-left text-[13px] font-semibold text-slate-500 whitespace-nowrap">Người gửi</th>
                <th className="px-4 py-3 text-left text-[13px] font-semibold text-slate-500 whitespace-nowrap">Trạng thái</th>
                <th className="px-4 py-3 text-left text-[13px] font-semibold text-slate-500 whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-12 text-center">
                    <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-[13px]">Không có dữ liệu chủ nào trong trạng thái này</p>
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((record, index) => (
                  <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      {record.status === 'pending' && (
                        <input
                          type="checkbox"
                          title="Chọn bản ghi"
                          checked={selectedIds.includes(record.id)}
                          onChange={() => toggleSelectOne(record.id)}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        />
                      )}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-slate-600">{(currentPage - 1) * pageSize + index + 1}</td>
                    <td className="px-4 py-3 text-[13px] text-slate-700">{record.code}</td>
                    <td className="px-4 py-3 text-[13px] font-semibold text-slate-800">{record.name}</td>
                    <td className="px-4 py-3 text-[13px] text-slate-600">{dataTypeLabels[record.dataType]}</td>
                    <td className="px-4 py-3 text-[13px] text-slate-600">{record.managingAgency}</td>
                    <td className="px-4 py-3 text-[13px] text-slate-600">{record.submittedDate}</td>
                    <td className="px-4 py-3 text-[13px] text-slate-600">{record.submittedBy}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[13px] border whitespace-nowrap ${statusBadgeClass[record.status]}`}>
                        {statusLabels[record.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetail(record)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => record.status === 'pending' && handleApprove(record)}
                          disabled={record.status !== 'pending'}
                          className={`p-1 rounded transition-colors ${record.status === 'pending' ? 'text-green-600 hover:bg-green-50 cursor-pointer' : 'text-slate-300 cursor-not-allowed'
                            }`}
                          title={record.status === 'pending' ? 'Phê duyệt' : 'Đã xử lý'}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => record.status === 'pending' && handleReject(record)}
                          disabled={record.status !== 'pending'}
                          className={`p-1 rounded transition-colors ${record.status === 'pending' ? 'text-red-600 hover:bg-red-50 cursor-pointer' : 'text-slate-300 cursor-not-allowed'
                            }`}
                          title={record.status === 'pending' ? 'Từ chối' : 'Đã xử lý'}
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredRecords.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white text-[13px] font-medium">
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-normal">Hiển thị</span>
              <select
                aria-label="Số bản ghi trên trang"
                value={pageSize}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white text-[13px] cursor-pointer font-medium"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-slate-600 font-normal">bản ghi/trang</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-600 font-normal">
                {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredRecords.length)} / {filteredRecords.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 border rounded-xl font-medium text-[13px] transition-colors cursor-pointer ${currentPage === page ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <BaseModal
        isOpen={showDetailModal && !!selectedRecord}
        onClose={() => setShowDetailModal(false)}
        title="Chi tiết dữ liệu chủ"
        subtitle={selectedRecord ? `${selectedRecord.code} · ${selectedRecord.name}` : undefined}
        maxWidth="max-w-4xl"
        customHeaderIcon={<Eye className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />}
        footer={
          <button
            onClick={() => setShowDetailModal(false)}
            className="px-4 py-2 text-[13px] text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Đóng
          </button>
        }
      >
        {selectedRecord && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h4 className="text-sm text-slate-900 mb-3">Thông tin cơ bản</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Mã:</span>
                    <p className="text-slate-900 mt-1">{selectedRecord.code}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Tên dữ liệu chủ:</span>
                    <p className="text-slate-900 mt-1">{selectedRecord.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Loại dữ liệu:</span>
                    <p className="text-slate-900 mt-1">{dataTypeLabels[selectedRecord.dataType]}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Cơ quan quản lý:</span>
                    <p className="text-slate-900 mt-1">{selectedRecord.managingAgency}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500">Mô tả:</span>
                    <p className="text-slate-900 mt-1">{selectedRecord.description}</p>
                  </div>
                </div>
              </div>

              {/* Configuration Summary */}
              <div className="border-t border-slate-200 pt-6">
                <h4 className="text-sm text-slate-900 mb-3">Cấu trúc và quy tắc</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-700 mb-1">Thuộc tính</p>
                    <p className="text-2xl text-blue-900">{selectedRecord.attributesCount}</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-xs text-green-700 mb-1">Quy tắc hợp nhất</p>
                    <p className="text-2xl text-green-900">{selectedRecord.mergeRulesCount}</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="text-xs text-purple-700 mb-1">Quan hệ</p>
                    <p className="text-2xl text-purple-900">{selectedRecord.relationshipsCount}</p>
                  </div>
                  <div className={`${selectedRecord.hasIdentifierRule ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'} border rounded-lg p-3`}>
                    <p className={`text-xs ${selectedRecord.hasIdentifierRule ? 'text-emerald-700' : 'text-red-700'} mb-1`}>Định danh</p>
                    <p className={`text-sm ${selectedRecord.hasIdentifierRule ? 'text-emerald-900' : 'text-red-900'}`}>
                      {selectedRecord.hasIdentifierRule ? 'Đã thiết lập' : 'Chưa có'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submission Info */}
              <div className="border-t border-slate-200 pt-6">
                <h4 className="text-sm text-slate-900 mb-3">Thông tin gửi phê duyệt</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Người gửi:</span>
                    <p className="text-slate-900 mt-1">{selectedRecord.submittedBy}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Ngày gửi:</span>
                    <p className="text-slate-900 mt-1">{selectedRecord.submittedDate}</p>
                  </div>
                </div>
              </div>

              {/* Review Info */}
              {selectedRecord.reviewedBy && (
                <div className="border-t border-slate-200 pt-6">
                  <h4 className="text-sm text-slate-900 mb-3">Thông tin phê duyệt</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-slate-500">Người phê duyệt:</span>
                      <p className="text-slate-900 mt-1">{selectedRecord.reviewedBy}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Ngày phê duyệt:</span>
                      <p className="text-slate-900 mt-1">{selectedRecord.reviewedDate}</p>
                    </div>
                  </div>
                  {selectedRecord.reviewComment && (
                    <div>
                      <span className="text-slate-500">Nhận xét:</span>
                      <p className="text-slate-900 mt-1 bg-slate-50 border border-slate-200 rounded p-3">
                        {selectedRecord.reviewComment}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* History Timeline */}
              <div className="border-t border-slate-200 pt-6">
                <h4 className="text-sm text-slate-900 mb-3">Lịch sử cập nhật ({selectedRecord.history.length})</h4>
                <div className="space-y-3">
                  {selectedRecord.history.map((h, index) => (
                    <div key={h.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${h.action === 'approved' ? 'bg-green-100' :
                          h.action === 'rejected' ? 'bg-red-100' :
                            'bg-blue-100'
                          }`}>
                          {h.action === 'approved' ? <CheckCircle2 className="w-4 h-4 text-green-600" /> :
                            h.action === 'rejected' ? <XCircle className="w-4 h-4 text-red-600" /> :
                              <Clock className="w-4 h-4 text-blue-600" />}
                        </div>
                        {index < selectedRecord.history.length - 1 && (
                          <div className="w-0.5 h-8 bg-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 pb-3">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-sm text-slate-900">
                            {h.action === 'submitted' ? 'Gửi phê duyệt' :
                              h.action === 'approved' ? 'Đã phê duyệt' :
                                h.action === 'rejected' ? 'Từ chối' : 'Cập nhật'}
                          </span>
                          <span className="text-xs text-slate-500">• {h.performedDate}</span>
                        </div>
                        <p className="text-sm text-slate-700 mb-1">Bởi: <strong>{h.performedBy}</strong></p>
                        {h.comment && (
                          <p className="text-sm text-slate-600 bg-white border border-slate-200 rounded p-2 mt-2">
                            {h.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
        )}
      </BaseModal>

      {/* Approval Form Modal (đơn lẻ hoặc nhanh nhiều bản ghi) */}
      <BaseModal
        isOpen={showApprovalForm && targetRecords.length > 0}
        onClose={() => setShowApprovalForm(false)}
        title={approvalAction === 'approve' ? 'Phê duyệt dữ liệu chủ' : 'Từ chối dữ liệu chủ'}
        subtitle={targetRecords.length > 1 ? `${targetRecords.length} bản ghi` : undefined}
        maxWidth="max-w-2xl"
        customHeaderIcon={approvalAction === 'approve'
          ? <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
          : <XCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
        }
        footer={
          <>
            <button
              onClick={() => setShowApprovalForm(false)}
              className="px-4 py-2 text-[13px] text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmitApproval}
              className={`flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white rounded-lg transition-colors ${approvalAction === 'approve'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
                }`}
            >
              {approvalAction === 'approve' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Xác nhận phê duyệt
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  Xác nhận từ chối
                </>
              )}
            </button>
          </>
        }
      >
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 max-h-40 overflow-y-auto space-y-2">
                {targetRecords.map(r => (
                  <p key={r.id} className="text-sm text-slate-700">
                    <strong>{r.name}</strong> <span className="text-slate-500">({r.code})</span>
                  </p>
                ))}
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1">
                  {approvalAction === 'approve' ? 'Nhận xét (tùy chọn)' : 'Lý do từ chối'}
                  {approvalAction === 'reject' && <span className="text-red-600"> *</span>}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={
                    approvalAction === 'approve'
                      ? 'Nhập nhận xét của bạn...'
                      : 'Vui lòng nhập lý do từ chối để người quản trị có thể chỉnh sửa...'
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {approvalAction === 'approve' ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-green-900">
                        Sau khi phê duyệt, dữ liệu chủ sẽ được kích hoạt và có thể sử dụng trong hệ thống.
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        Thông báo sẽ được gửi đến người quản trị tương ứng.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-900">
                        Sau khi từ chối, dữ liệu chủ sẽ được trả về cho người quản trị để chỉnh sửa.
                      </p>
                      <p className="text-sm text-red-700 mt-1">
                        Thông báo kèm lý do từ chối sẽ được gửi đến người quản trị tương ứng.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
      </BaseModal>
    </div>
  );
}
