import { Search, Filter, Upload, Download, Eye, Send, Trash2, RotateCcw, Globe, CheckCircle2, XCircle, Clock, History as HistoryIcon, Database, FileText, GitCompare, Calendar } from 'lucide-react';
import { StatusTag } from '../../common/StatusTag';
import { DataDetailModal } from '../../common/DataDetailModal';
import { EditDataModal } from '../../common/EditDataModal';
import { ApprovalModal } from '../../common/ApprovalModal';
import { HistoryTab } from './HistoryTab';

type TabType = 'list' | 'approval' | 'history';

interface DataRecord {
  id: number;
  recordCode: string;
  fullName: string;
  birthDate: string;
  gender: string;
  cccdNumber: string;
  birthPlace: string;
  source: string;
  primarySource: string;
  secondarySource: string[];
  updateDate: string;
  status: 'processed' | 'processing';
  approvalStatus: 'approved' | 'pending' | 'rejected';
  publicStatus: 'published' | 'unpublished';
  isDeleted: boolean;
}

const mockData: DataRecord[] = [
  {
    id: 1,
    recordCode: 'HTD-2025-001234',
    fullName: 'Nguyễn Văn A',
    birthDate: '15/03/1990',
    gender: 'Nam',
    cccdNumber: '001234567890',
    birthPlace: 'Hà Nội',
    source: 'Sở Tư pháp Hà Nội',
    primarySource: 'Sở Tư pháp Hà Nội',
    secondarySource: ['Sở Tư pháp TP.HCM', 'Sở Tư pháp Đà Nẵng'],
    updateDate: '15/01/2025',
    status: 'processed',
    approvalStatus: 'approved',
    publicStatus: 'published',
    isDeleted: false,
  },
  {
    id: 2,
    recordCode: 'HTD-2025-001235',
    fullName: 'Trần Thị B',
    birthDate: '20/08/1985',
    gender: 'Nữ',
    cccdNumber: '001234567891',
    birthPlace: 'Hồ Chí Minh',
    source: 'Sở Tư pháp TP.HCM',
    primarySource: 'Sở Tư pháp TP.HCM',
    secondarySource: ['Sở Tư pháp Hà Nội'],
    updateDate: '16/01/2025',
    status: 'processing',
    approvalStatus: 'pending',
    publicStatus: 'unpublished',
    isDeleted: false,
  },
  {
    id: 3,
    recordCode: 'HTD-2025-001236',
    fullName: 'Lê Văn C',
    birthDate: '10/12/1992',
    gender: 'Nam',
    cccdNumber: '001234567892',
    birthPlace: 'Đà Nẵng',
    source: 'Sở Tư pháp Đà Nẵng',
    primarySource: 'Sở Tư pháp Đà Nẵng',
    secondarySource: ['Sở Tư pháp Hải Phòng', 'Sở Tư pháp Cần Thơ', 'Sở Tư pháp Hà Nội'],
    updateDate: '17/01/2025',
    status: 'processed',
    approvalStatus: 'pending',
    publicStatus: 'unpublished',
    isDeleted: false,
  },
  {
    id: 4,
    recordCode: 'HTD-2025-001237',
    fullName: 'Phạm Thị D',
    birthDate: '05/06/1988',
    gender: 'Nữ',
    cccdNumber: '001234567893',
    birthPlace: 'Hải Phòng',
    source: 'Sở Tư pháp Hải Phòng',
    primarySource: 'Sở Tư pháp Hải Phòng',
    secondarySource: [],
    updateDate: '18/01/2025',
    status: 'processed',
    approvalStatus: 'approved',
    publicStatus: 'published',
    isDeleted: false,
  },
  {
    id: 5,
    recordCode: 'HTD-2025-001238',
    fullName: 'Hoàng Văn E',
    birthDate: '25/11/1995',
    gender: 'Nam',
    cccdNumber: '001234567894',
    birthPlace: 'Cần Thơ',
    source: 'Sở Tư pháp Cần Thơ',
    primarySource: 'Sở Tư pháp Cần Thơ',
    secondarySource: ['Sở Tư pháp Đà Nẵng'],
    updateDate: '19/01/2025',
    status: 'processing',
    approvalStatus: 'pending',
    publicStatus: 'unpublished',
    isDeleted: false,
  },
];

const mockApprovers = [
  { id: 1, name: 'Nguyễn Văn A' },
  { id: 2, name: 'Trần Thị B' },
  { id: 3, name: 'Lê Văn C' },
  { id: 4, name: 'Phạm Thị D' },
  { id: 5, name: 'Hoàng Văn E' },
];

export function MasterDataAPage() {
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<DataRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<DataRecord | null>(null);
  const [approvalRecord, setApprovalRecord] = useState<DataRecord | null>(null);
  const [data, setData] = useState<DataRecord[]>(mockData);
  const [selectedRecords, setSelectedRecords] = useState<Set<number>>(new Set());
  const [selectedApprover, setSelectedApprover] = useState<string>('');
  const [approvalNote, setApprovalNote] = useState('');
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  
  // History tab states
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState<string>('');
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareVersions, setCompareVersions] = useState<{v1: number; v2: number} | null>(null);

  // Restore version states
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [restoreRecords, setRestoreRecords] = useState<DataRecord[]>([]);
  const [selectedRestoreVersions, setSelectedRestoreVersions] = useState<Map<number, number>>(new Map());

  // Action modals
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showUnpublishModal, setShowUnpublishModal] = useState(false);

  // Statistics
  const totalRecords = data.filter(r => !r.isDeleted).length;
  const approvedRecords = data.filter(r => !r.isDeleted && r.approvalStatus === 'approved').length;
  const pendingRecords = data.filter(r => !r.isDeleted && r.approvalStatus === 'pending').length;
  const publishedRecords = data.filter(r => !r.isDeleted && r.publicStatus === 'published').length;
  const unpublishedRecords = data.filter(r => !r.isDeleted && r.publicStatus === 'unpublished').length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(data.filter(r => !r.isDeleted).map(r => r.id));
      setSelectedRecords(allIds);
    } else {
      setSelectedRecords(new Set());
    }
  };

  const handleSelectRecord = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedRecords);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRecords(newSelected);
  };

  const handleSubmitForApproval = () => {
    if (selectedRecords.size === 0) {
      alert('⚠️ Vui lòng chọn ít nhất một bản ghi!');
      return;
    }
    if (!selectedApprover) {
      alert('⚠️ Vui lòng chọn người phê duyệt!');
      return;
    }
    
    const updatedData = data.map(record => {
      if (selectedRecords.has(record.id)) {
        return { ...record, approvalStatus: 'pending' as const };
      }
      return record;
    });
    
    setData(updatedData);
    setSelectedRecords(new Set());
    setShowApprovalForm(false);
    setSelectedApprover('');
    setApprovalNote('');
    alert(`✅ Đã trình duyệt ${selectedRecords.size} bản ghi cho ${selectedApprover}`);
  };

  const handlePublish = () => {
    // Check if all selected records are approved
    const selectedData = data.filter(r => selectedRecords.has(r.id) && !r.isDeleted);
    const notApproved = selectedData.filter(r => r.approvalStatus !== 'approved');
    
    if (notApproved.length > 0) {
      alert(`Không thể công khai! Có ${notApproved.length} bản ghi chưa được phê duyệt.`);
      return;
    }
    
    const updatedData = data.map(record => {
      if (selectedRecords.has(record.id) && !record.isDeleted && record.approvalStatus === 'approved') {
        return { ...record, publicStatus: 'published' as const };
      }
      return record;
    });
    setData(updatedData);
    setSelectedRecords(new Set());
    alert('✅ Đã công khai thành công ' + selectedRecords.size + ' bản ghi!');
  };

  const handleUnpublish = () => {
    // Check if all selected records are approved
    const selectedData = data.filter(r => selectedRecords.has(r.id) && !r.isDeleted);
    const notApproved = selectedData.filter(r => r.approvalStatus !== 'approved');
    
    if (notApproved.length > 0) {
      alert(`Không thể hủy công khai! Có ${notApproved.length} bản ghi chưa được phê duyệt.`);
      return;
    }
    
    const updatedData = data.map(record => {
      if (selectedRecords.has(record.id) && !record.isDeleted && record.approvalStatus === 'approved') {
        return { ...record, publicStatus: 'unpublished' as const };
      }
      return record;
    });
    setData(updatedData);
    setSelectedRecords(new Set());
    alert('✅ Đã hủy công khai thành công ' + selectedRecords.size + ' bản ghi!');
  };

  const handleDelete = () => {
    if (selectedRecords.size === 0) {
      alert('⚠️ Vui lòng chọn ít nhất một bản ghi để xóa!');
      return;
    }

    const confirmed = window.confirm(
      `🗑️ XÁC NHẬT XÓA BẢN GHI\n\n` +
      `Bạn có chắc chắn muốn xóa ${selectedRecords.size} bản ghi đã chọn?\n\n` +
      `Lưu ý: Bản ghi sẽ được đánh dấu xóa và có thể khôi phục lại sau.`
    );

    if (confirmed) {
      const updatedData = data.map(record => {
        if (selectedRecords.has(record.id)) {
          return { ...record, isDeleted: true };
        }
        return record;
      });
      
      setData(updatedData);
      setSelectedRecords(new Set());
      alert(`✅ Đã xóa ${selectedRecords.size} bản ghi thành công!`);
    }
  };

  const handleRestore = () => {
    if (selectedRecords.size === 0) {
      alert('⚠️ Vui lòng chọn ít nhất một bản ghi để khôi phục!');
      return;
    }

    // Get selected records
    const records = data.filter(r => selectedRecords.has(r.id));
    setRestoreRecords(records);
    
    // Initialize default version selection (latest version for each record)
    const defaultVersions = new Map();
    records.forEach(record => {
      defaultVersions.set(record.id, 4); // Default to version 4 (latest)
    });
    setSelectedRestoreVersions(defaultVersions);
    
    setShowRestoreModal(true);
  };

  const handleEditRecord = (recordData: any) => {
    // Close modal first
    setSelectedRecord(null);
    // Set editing record
    const record = data.find(r => r.recordCode === recordData.recordCode);
    if (record) {
      setEditingRecord(record);
    }
  };

  const handleSubmitForApprovalSingle = (recordData: any) => {
    // Find the record by recordCode and update it
    const confirmed = window.confirm(`Bạn có chắc muốn gửi bản ghi ${recordData.recordCode} đi phê duyệt?`);
    if (confirmed) {
      const updatedData = data.map(record => {
        if (record.recordCode === recordData.recordCode && !record.isDeleted) {
          return { ...record, approvalStatus: 'pending' as const };
        }
        return record;
      });
      setData(updatedData);
      setSelectedRecord(null);
      alert('Đã gửi phê duyệt thành công');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'processing':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'processed':
        return 'Đã xử lý';
      case 'processing':
        return 'Đang xử lý';
      default:
        return status;
    }
  };

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'pending':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'rejected':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getApprovalStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Đã duyệt';
      case 'pending':
        return 'Đang chờ duyệt';
      case 'rejected':
        return 'Đã từ chối';
      default:
        return status;
    }
  };

  const getPublicStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'unpublished':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getPublicStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Đã xuất bản';
      case 'unpublished':
        return 'Chưa xuất bản';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs - Moved to top */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="border-b border-slate-200">
          <div className="flex gap-6 px-6">
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-2 pb-3 pt-4 px-2 border-b-2 transition-colors ${
                activeTab === 'list'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Danh sách dữ liệu
            </button>
            <button
              onClick={() => setActiveTab('approval')}
              className={`flex items-center gap-2 pb-3 pt-4 px-2 border-b-2 transition-colors ${
                activeTab === 'approval'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Phê duyệt dữ liệu
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 pb-3 pt-4 px-2 border-b-2 transition-colors ${
                activeTab === 'history'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Lịch sử xử lý
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <div className="text-xs text-slate-600">Tổng số bản ghi</div>
          <div className="text-xl text-slate-900 mt-1">{totalRecords}</div>
        </div>
        <div className="bg-white border border-green-200 rounded-lg p-3">
          <div className="text-xs text-green-600">Đã phê duyệt</div>
          <div className="text-xl text-green-700 mt-1">{approvedRecords}</div>
        </div>
        <div className="bg-white border border-blue-200 rounded-lg p-3">
          <div className="text-xs text-blue-600">Chưa phê duyệt</div>
          <div className="text-xl text-blue-700 mt-1">{pendingRecords}</div>
        </div>
        <div className="bg-white border border-green-200 rounded-lg p-3">
          <div className="text-xs text-green-600">Đã công khai</div>
          <div className="text-xl text-green-700 mt-1">{publishedRecords}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <div className="text-xs text-slate-600">Chưa công khai</div>
          <div className="text-xl text-slate-700 mt-1">{unpublishedRecords}</div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'list' && (
        <div>
          {/* Toolbar */}
          <div className="p-4 border-b border-slate-200 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                <Filter className="w-4 h-4" />
                Tìm kiếm nâng cao
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                <Upload className="w-4 h-4" />
                Nhập
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Download className="w-4 h-4" />
                Xuất
              </button>
            </div>

            {/* Action buttons - Always visible, disabled when no records selected */}
            <div className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <span className="text-sm text-purple-900">
                {selectedRecords.size > 0 ? `Đã chọn ${selectedRecords.size} bản ghi` : 'Chưa chọn bản ghi nào'}
              </span>
              <button
                onClick={() => {
                  if (selectedRecords.size === 0) {
                    alert('Vui lòng chọn ít nhất một bản ghi');
                    return;
                  }
                  setShowSubmitModal(true);
                }}
                disabled={selectedRecords.size === 0}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:bg-slate-300 disabled:cursor-not-allowed disabled:hover:bg-slate-300"
              >
                <Send className="w-4 h-4" />
                Trình duyệt
              </button>
              <button
                onClick={() => {
                  if (selectedRecords.size === 0) {
                    alert('Vui lòng chọn ít nhất một bản ghi');
                    return;
                  }
                  setShowPublishModal(true);
                }}
                disabled={selectedRecords.size === 0}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm disabled:bg-slate-300 disabled:cursor-not-allowed disabled:hover:bg-slate-300"
              >
                <Globe className="w-4 h-4" />
                Công khai
              </button>
              <button
                onClick={() => {
                  if (selectedRecords.size === 0) {
                    alert('Vui lòng chọn ít nhất một bản ghi');
                    return;
                  }
                  setShowUnpublishModal(true);
                }}
                disabled={selectedRecords.size === 0}
                className="flex items-center gap-2 px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm disabled:bg-slate-300 disabled:cursor-not-allowed disabled:hover:bg-slate-300"
              >
                <XCircle className="w-4 h-4" />
                Hủy công khai
              </button>
              <button
                onClick={handleRestore}
                disabled={selectedRecords.size === 0}
                className="flex items-center gap-2 px-3 py-1.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 text-sm disabled:bg-slate-300 disabled:cursor-not-allowed disabled:hover:bg-slate-300"
              >
                <RotateCcw className="w-4 h-4" />
                Khôi phục
              </button>
              <button
                onClick={() => setSelectedRecords(new Set())}
                disabled={selectedRecords.size === 0}
                className="ml-auto text-sm text-purple-700 hover:text-purple-900 underline disabled:text-slate-400 disabled:no-underline disabled:cursor-not-allowed"
              >
                Bỏ chọn tất cả
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRecords.size === data.filter(r => !r.isDeleted).length && data.filter(r => !r.isDeleted).length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-2 focus:ring-purple-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Mã dữ liệu</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Họ và tên</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Ngày sinh</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Giới tính</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Số CMND/CCCD</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Nơi sinh</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Nguồn chính</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Nguồn bổ sung</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Ngày cập nhật</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái XL</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Phê duyệt</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Công khai</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {data.filter(r => !r.isDeleted).map((record, index) => (
                  <tr key={record.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRecords.has(record.id)}
                        onChange={(e) => handleSelectRecord(record.id, e.target.checked)}
                        className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-2 focus:ring-purple-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">{record.recordCode}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{record.fullName}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{record.birthDate}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{record.gender}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{record.cccdNumber}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{record.birthPlace}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{record.primarySource}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {record.secondarySource.length > 0 ? (
                        <div className="space-y-1">
                          {record.secondarySource.map((source, idx) => (
                            <div key={idx} className="flex items-start gap-1">
                              <span className="text-slate-400">-</span>
                              <span>{source}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Không có</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">{record.updateDate}</td>
                    <td className="px-4 py-3">
                      <StatusTag 
                        label={getStatusText(record.status)} 
                        variant={record.status === 'processed' ? 'green' : 'blue'} 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <StatusTag 
                        label={getApprovalStatusText(record.approvalStatus)} 
                        variant={record.approvalStatus === 'approved' ? 'green' : record.approvalStatus === 'pending' ? 'blue' : 'red'} 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <StatusTag 
                        label={getPublicStatusText(record.publicStatus)} 
                        variant={record.publicStatus === 'published' ? 'green' : 'red'} 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          onClick={() => setSelectedRecord(record)}
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {record.isDeleted ? (
                          <button
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            onClick={() => handleRestore(record.id)}
                            title="Khôi phục"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            onClick={() => handleDelete(record.id)}
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Hiển thị 1-{data.filter(r => !r.isDeleted).length} của {data.filter(r => !r.isDeleted).length} bản ghi
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50 text-sm">
                Trước
              </button>
              <button title="Hành động" aria-label="Hành động" className="px-3 py-1 bg-purple-600 text-white rounded text-sm">
                1
              </button>
              <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50 text-sm">
                Sau
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'approval' && (
        <div className="bg-white border border-slate-200 rounded-lg">
          {/* Approval Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Mã dữ liệu</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Họ và tên</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Ngày sinh</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Số CMND/CCCD</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Nguồn chính</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Nguồn bổ sung</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {data.filter(r => !r.isDeleted && r.approvalStatus === 'pending').map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900">{record.recordCode}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{record.fullName}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{record.birthDate}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{record.cccdNumber}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{record.primarySource}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {record.secondarySource.length > 0 ? (
                        <div className="space-y-1">
                          {record.secondarySource.map((source, idx) => (
                            <div key={idx} className="flex items-start gap-1">
                              <span className="text-slate-400">-</span>
                              <span>{source}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Không có</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusTag 
                        label={getApprovalStatusText(record.approvalStatus)} 
                        variant="blue" 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded flex items-center gap-1 text-sm"
                          onClick={() => setSelectedRecord(record)}
                          title="Chi tiết nguồn"
                        >
                          <Database className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded flex items-center gap-1 text-sm"
                          title="Lịch sử chỉnh sửa"
                        >
                          <HistoryIcon className="w-4 h-4" />
                        </button>
                        <button
                          className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm flex items-center gap-1"
                          onClick={() => setApprovalRecord(record)}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Phê duyệt
                        </button>
                        <button
                          className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 text-sm flex items-center gap-1"
                          onClick={() => setApprovalRecord(record)}
                        >
                          <XCircle className="w-4 h-4" />
                          Từ chối
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {data.filter(r => !r.isDeleted && r.approvalStatus === 'pending').length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                      <Clock className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                      <p>Không có bản ghi nào chờ phê duyệt</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Hiển thị 1-{data.filter(r => !r.isDeleted && r.approvalStatus === 'pending').length} của {data.filter(r => !r.isDeleted && r.approvalStatus === 'pending').length} bản ghi
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50 text-sm">
                Trước
              </button>
              <button title="Hành động" aria-label="Hành động" className="px-3 py-1 bg-purple-600 text-white rounded text-sm">
                1
              </button>
              <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50 text-sm">
                Sau
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <HistoryTab records={data.filter(r => !r.isDeleted)} />
      )}

      {/* Data Detail Modal */}
      {selectedRecord && (
        <DataDetailModal
          isOpen={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
          data={{
            recordCode: selectedRecord.recordCode,
            fullName: selectedRecord.fullName,
            birthDate: selectedRecord.birthDate,
            gender: selectedRecord.gender,
            cccdNumber: selectedRecord.cccdNumber,
            birthPlace: selectedRecord.birthPlace,
            primarySource: selectedRecord.primarySource,
            secondarySource: selectedRecord.secondarySource.join(', '),
            updateDate: selectedRecord.updateDate,
            status: getStatusText(selectedRecord.status),
          }}
          fields={[
            { label: 'Mã dữ liệu', key: 'recordCode' },
            { label: 'Họ và tên', key: 'fullName' },
            { label: 'Ngày sinh', key: 'birthDate' },
            { label: 'Giới tính', key: 'gender' },
            { label: 'Số CMND/CCCD', key: 'cccdNumber' },
            { label: 'Nơi sinh', key: 'birthPlace' },
            { label: 'Nguồn chính', key: 'primarySource' },
            { label: 'Nguồn bổ sung', key: 'secondarySource' },
            { label: 'Ngày cập nhật', key: 'updateDate' },
            { label: 'Trạng thái', key: 'status' },
          ]}
          title="Chi tiết Dữ liệu Hồ tích điện tử"
          mode="merge"
          onEdit={handleEditRecord}
          onSubmitForApproval={handleSubmitForApprovalSingle}
        />
      )}

      {/* Edit Data Modal */}
      {editingRecord && (
        <EditDataModal
          isOpen={!!editingRecord}
          onClose={() => setEditingRecord(null)}
          data={{
            ...editingRecord,
            secondarySource: editingRecord.secondarySource.join(', ')
          }}
          fields={[
            { label: 'Mã dữ liệu', key: 'recordCode' },
            { label: 'Họ và tên', key: 'fullName' },
            { label: 'Ngy sinh', key: 'birthDate' },
            { label: 'Giới tính', key: 'gender' },
            { label: 'Số CMND/CCCD', key: 'cccdNumber' },
            { label: 'Nơi sinh', key: 'birthPlace' },
            { label: 'Nguồn chính', key: 'primarySource' },
            { label: 'Nguồn bổ sung', key: 'secondarySource' },
            { label: 'Ngày cập nhật', key: 'updateDate' },
          ]}
          title="Chỉnh sửa Dữ liệu Hồ tích điện tử"
          fieldStatus={{
            recordCode: 'valid',
            fullName: 'valid',
            birthDate: 'warning',
            gender: 'valid',
            cccdNumber: 'valid',
            birthPlace: 'valid',
            primarySource: 'warning',
            secondarySource: 'valid',
            updateDate: 'valid',
          }}
          onSave={(updatedRecord) => {
            // Convert secondarySource back to array if needed
            const updatedData = data.map(record => {
              if (record.id === editingRecord.id) {
                return {
                  ...record,
                  ...updatedRecord,
                  secondarySource: typeof updatedRecord.secondarySource === 'string' 
                    ? updatedRecord.secondarySource.split(',').map(s => s.trim()).filter(s => s)
                    : updatedRecord.secondarySource
                };
              }
              return record;
            });
            setData(updatedData);
            setEditingRecord(null);
            alert('Đã cập nhật bản ghi thành công');
          }}
        />
      )}

      {/* Approval Modal */}
      {approvalRecord && (
        <ApprovalModal
          isOpen={!!approvalRecord}
          onClose={() => setApprovalRecord(null)}
          record={approvalRecord}
          onApprove={(approverId, note) => {
            const updatedData = data.map(record => {
              if (record.id === approvalRecord.id) {
                return { ...record, approvalStatus: 'approved' as const };
              }
              return record;
            });
            setData(updatedData);
            setApprovalRecord(null);
            alert(`Đã phê duyệt bản ghi thành công!\n\nNgười phê duyệt: ${mockApprovers.find(a => a.id === approverId)?.name}\nGhi chú: ${note || '(Không có)'}`);
          }}
          onReject={(approverId, reason) => {
            const updatedData = data.map(record => {
              if (record.id === approvalRecord.id) {
                return { ...record, approvalStatus: 'rejected' as const };
              }
              return record;
            });
            setData(updatedData);
            setApprovalRecord(null);
            alert(`Đã từ chối phê duyệt bản ghi!\n\nNgười từ chối: ${mockApprovers.find(a => a.id === approverId)?.name}\nLý do: ${reason}`);
          }}
        />
      )}

      {/* Submit for Approval Modal */}
      {showSubmitModal && selectedRecords.size > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg text-white">Gửi phê duyệt</h3>
                  <p className="text-sm text-blue-100 mt-0.5">
                    {selectedRecords.size} bản ghi đã chọn
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  setSelectedApprover('');
                  setApprovalNote('');
                }}
                className="text-white hover:bg-white/10 rounded-lg px-3 py-1.5 text-sm transition-colors"
              >
                ✕ Đóng
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-5">
                {/* Bước 1: Chọn người duyệt */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                      1
                    </div>
                    <label className="text-slate-900">
                      Chọn người phê duyệt
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                  </div>
                  <select
                    value={selectedApprover}
                    onChange={(e) => setSelectedApprover(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white text-slate-900 transition-all"
                  >
                    <option value="">👤 Vui lòng chọn người phê duyệt...</option>
                    <optgroup label="🏢 Lãnh đạo Bộ">
                      <option value="1">Nguyễn Văn A - Thứ trưởng Bộ Tư pháp</option>
                      <option value="2">Trần Thị B - Vụ trưởng Vụ CNTT</option>
                    </optgroup>
                    <optgroup label="🏛️ Lãnh đạo Vụ">
                      <option value="3">Lê Văn C - Phó Vụ trưởng Vụ CNTT</option>
                      <option value="4">Phạm Thị D - Trưởng phòng Quản lý DL</option>
                    </optgroup>
                    <optgroup label="📋 Lãnh đạo Phòng">
                      <option value="5">Hoàng Văn E - Phó phòng Quản lý DL</option>
                      <option value="6">Đỗ Thị F - Chuyên viên chính</option>
                    </optgroup>
                  </select>
                </div>

                {/* Bước 2: Ghi chú */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                      2
                    </div>
                    <label className="text-slate-900">
                      Ghi chú hoặc lý do gửi duyệt
                      <span className="text-slate-400 ml-1 text-sm">(Không bắt buộc)</span>
                    </label>
                  </div>
                  <textarea
                    value={approvalNote}
                    onChange={(e) => setApprovalNote(e.target.value)}
                    placeholder="Ví dụ: Dữ liệu đã được rà soát và gộp từ 3 nguồn, đề nghị phê duyệt..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 resize-none transition-all"
                  />
                </div>

                {/* Thông tin tóm tắt */}
                {selectedApprover && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm text-blue-900 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Tóm tắt thông tin gửi duyệt
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-blue-700 min-w-[120px]">📊 Số bản ghi:</span>
                        <span className="text-blue-900">{selectedRecords.size} bản ghi</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-700 min-w-[120px]">👤 Người duyệt:</span>
                        <span className="text-blue-900">
                          {mockApprovers.find(a => a.id.toString() === selectedApprover)?.name || 'Chưa chọn'}
                        </span>
                      </div>
                      {approvalNote && (
                        <div className="flex items-start gap-2">
                          <span className="text-blue-700 min-w-[120px]">📝 Ghi chú:</span>
                          <span className="text-blue-900 flex-1">{approvalNote}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  setSelectedApprover('');
                  setApprovalNote('');
                }}
                className="px-6 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  if (!selectedApprover) {
                    alert('⚠️ Vui lòng chọn người phê duyệt!');
                    return;
                  }
                  handleSubmitForApproval();
                  setShowSubmitModal(false);
                }}
                disabled={!selectedApprover}
                className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none"
              >
                <Send className="w-4 h-4" />
                Gửi phê duyệt ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Modal */}
      {showPublishModal && selectedRecords.size > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg text-white">Công khai dữ liệu</h3>
                  <p className="text-sm text-green-100 mt-0.5">
                    {selectedRecords.size} bản ghi đã chọn
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPublishModal(false)}
                className="text-white hover:bg-white/10 rounded-lg px-3 py-1.5 text-sm transition-colors"
              >
                ✕ Đóng
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Check if all selected records are approved */}
              {(() => {
                const selectedData = data.filter(r => selectedRecords.has(r.id) && !r.isDeleted);
                const notApproved = selectedData.filter(r => r.approvalStatus !== 'approved');
                
                if (notApproved.length > 0) {
                  return (
                    <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                      <div className="flex gap-3">
                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                        <div>
                          <h4 className="text-red-900 mb-2">❌ Không thể công khai</h4>
                          <p className="text-sm text-red-800">
                            Có <strong>{notApproved.length} bản ghi</strong> chưa được phê duyệt. 
                            Vui lòng chỉ chọn các bản ghi đã được phê duyệt để công khai.
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex gap-3">
                        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <div>
                          <h4 className="text-green-900 mb-2">✅ Sẵn sàng công khai</h4>
                          <p className="text-sm text-green-800">
                            Tất cả {selectedRecords.size} bản ghi đã được phê duyệt và sẵn sàng để công khai.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-sm text-blue-900 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Thông tin công khai
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="text-blue-700 min-w-[120px]">📊 Số bản ghi:</span>
                          <span className="text-blue-900">{selectedRecords.size} bản ghi</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-700 min-w-[120px]">🌐 Trạng thái:</span>
                          <span className="text-blue-900">Sẽ chuyển sang "Đã xuất bản"</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-700 min-w-[120px]">👥 Đối tượng:</span>
                          <span className="text-blue-900">Công khai cho tất cả các hệ thống</span>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Footer Actions */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setShowPublishModal(false)}
                className="px-6 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  handlePublish();
                  setShowPublishModal(false);
                }}
                disabled={(() => {
                  const selectedData = data.filter(r => selectedRecords.has(r.id) && !r.isDeleted);
                  const notApproved = selectedData.filter(r => r.approvalStatus !== 'approved');
                  return notApproved.length > 0;
                })()}
                className="px-8 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none"
              >
                <Globe className="w-5 h-5" />
                Công khai ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unpublish Modal */}
      {showUnpublishModal && selectedRecords.size > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg text-white">Hủy công khai dữ liệu</h3>
                  <p className="text-sm text-orange-100 mt-0.5">
                    {selectedRecords.size} bản ghi đã chọn
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUnpublishModal(false)}
                className="text-white hover:bg-white/10 rounded-lg px-3 py-1.5 text-sm transition-colors"
              >
                ✕ Đóng
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Warning */}
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4">
                <div className="flex gap-3">
                  <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-yellow-900 mb-2">⚠️ Cảnh báo</h4>
                    <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                      <li>Dữ liệu sẽ không còn được công khai cho các hệ thống khác</li>
                      <li>Các hệ thống đang sử dụng dữ liệu này có thể bị ảnh hưởng</li>
                      <li>Bạn có thể công khai lại sau nếu cần</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="text-sm text-orange-900 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Thông tin hủy công khai
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-orange-700 min-w-[120px]">📊 Số bản ghi:</span>
                    <span className="text-orange-900">{selectedRecords.size} bản ghi</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-700 min-w-[120px]">🌐 Trạng thái:</span>
                    <span className="text-orange-900">Sẽ chuyển sang "Chưa xuất bản"</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-700 min-w-[120px]">👥 Ảnh hưởng:</span>
                    <span className="text-orange-900">Các hệ thống bên ngoài sẽ không truy cập được</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setShowUnpublishModal(false)}
                className="px-6 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  handleUnpublish();
                  setShowUnpublishModal(false);
                }}
                className="px-8 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Hủy công khai ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Version Modal */}
      {showRestoreModal && restoreRecords.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RotateCcw className="w-6 h-6 text-white" />
                <div>
                  <h3 className="text-lg text-white">Khôi phục bản ghi theo phiên bản</h3>
                  <p className="text-sm text-cyan-100 mt-0.5">
                    {restoreRecords.length} bản ghi đã chọn
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowRestoreModal(false);
                  setRestoreRecords([]);
                  setSelectedRestoreVersions(new Map());
                }}
                className="text-white hover:bg-white/20 rounded-lg px-3 py-1.5 transition-colors"
              >
                ✕ Đóng
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Warning Banner */}
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-yellow-900 mb-2">⚠️ Cảnh báo quan trọng</h4>
                    <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                      <li>Khôi phục sẽ thay thế <strong>TẤT CẢ dữ liệu hiện tại</strong> bằng dữ liệu từ phiên bản đã chọn</li>
                      <li>Mỗi bản ghi có thể chọn phiên bản khác nhau</li>
                      <li>Một phiên bản mới sẽ được tạo với ghi chú "Khôi phục từ version X"</li>
                      <li>Vui lòng kiểm tra kỹ thông tin trước khi xác nhận</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Records List */}
              <div className="space-y-4">
                {restoreRecords.map((record) => (
                  <div key={record.id} className="border-2 border-slate-200 rounded-lg overflow-hidden">
                    {/* Record Header */}
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-slate-900">
                            <strong>{record.recordCode}</strong> - {record.fullName}
                          </div>
                          <div className="text-xs text-slate-600 mt-1">
                            📅 {record.birthDate} • 🆔 {record.cccdNumber}
                          </div>
                        </div>
                        <StatusTag label="Phiên bản hiện tại: v4" variant="purple" />
                      </div>
                    </div>

                    {/* Version Selection */}
                    <div className="p-4">
                      <label className="block text-sm text-slate-700 mb-3">
                        Chọn phiên bản cần khôi phục:
                      </label>
                      
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        {[1, 2, 3, 4].map((version) => (
                          <button
                            key={version}
                            onClick={() => {
                              const newVersions = new Map(selectedRestoreVersions);
                              newVersions.set(record.id, version);
                              setSelectedRestoreVersions(newVersions);
                            }}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              selectedRestoreVersions.get(record.id) === version
                                ? 'border-cyan-500 bg-cyan-50'
                                : 'border-slate-200 hover:border-cyan-300 hover:bg-slate-50'
                            }`}
                          >
                            <div className="text-center">
                              <div className={`text-lg ${
                                selectedRestoreVersions.get(record.id) === version
                                  ? 'text-cyan-700'
                                  : 'text-slate-700'
                              }`}>
                                v{version}
                              </div>
                              <div className="text-xs text-slate-500 mt-1">
                                {version === 4 && '25/12/2024'}
                                {version === 3 && '24/12/2024'}
                                {version === 2 && '23/12/2024'}
                                {version === 1 && '22/12/2024'}
                              </div>
                              {version === 4 && (
                                <div className="text-xs text-purple-600 mt-1">(Hiện tại)</div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Version Details */}
                      {selectedRestoreVersions.get(record.id) && (
                        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                          <h5 className="text-sm text-cyan-900 mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Thông tin phiên bản v{selectedRestoreVersions.get(record.id)}
                          </h5>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-start gap-2">
                              <span className="text-cyan-700 min-w-[100px]">📅 Thời gian:</span>
                              <span className="text-cyan-900">
                                {selectedRestoreVersions.get(record.id) === 4 && '25/12/2024 14:30'}
                                {selectedRestoreVersions.get(record.id) === 3 && '24/12/2024 10:15'}
                                {selectedRestoreVersions.get(record.id) === 2 && '23/12/2024 16:45'}
                                {selectedRestoreVersions.get(record.id) === 1 && '22/12/2024 09:00'}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-cyan-700 min-w-[100px]">👤 Người thực hiện:</span>
                              <span className="text-cyan-900">
                                {selectedRestoreVersions.get(record.id) === 4 && 'Nguyễn Văn A'}
                                {selectedRestoreVersions.get(record.id) === 3 && 'Trần Thị B'}
                                {selectedRestoreVersions.get(record.id) === 2 && 'Lê Văn C'}
                                {selectedRestoreVersions.get(record.id) === 1 && 'Hệ thống'}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-cyan-700 min-w-[100px]">🔄 Thao tác:</span>
                              <span className="text-cyan-900">
                                {selectedRestoreVersions.get(record.id) === 4 && 'Phê duyệt'}
                                {selectedRestoreVersions.get(record.id) === 3 && 'Chỉnh sửa'}
                                {selectedRestoreVersions.get(record.id) === 2 && 'Chỉnh sửa'}
                                {selectedRestoreVersions.get(record.id) === 1 && 'Tạo mới'}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-cyan-700 min-w-[100px]">📝 Ghi chú:</span>
                              <span className="text-cyan-900">
                                {selectedRestoreVersions.get(record.id) === 4 && 'Phê duyệt bản ghi sau khi rà soát đầy đủ'}
                                {selectedRestoreVersions.get(record.id) === 3 && 'Bổ sung thêm nguồn xác thực từ Đà Nẵng'}
                                {selectedRestoreVersions.get(record.id) === 2 && 'Chuẩn hóa dữ liệu, sửa lỗi dấu tiếng Việt'}
                                {selectedRestoreVersions.get(record.id) === 1 && 'Nhập dữ liệu từ nguồn Sở Tư pháp'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                💡 <strong>Lưu ý:</strong> Phiên bản hiện tại sẽ được lưu trong lịch sử
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRestoreModal(false);
                    setRestoreRecords([]);
                    setSelectedRestoreVersions(new Map());
                  }}
                  className="px-6 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={() => {
                    let summary = '♻️ XÁC NHẬN KHÔI PHỤC PHIÊN BẢN\n\n';
                    restoreRecords.forEach(record => {
                      const version = selectedRestoreVersions.get(record.id) || 4;
                      summary += `• ${record.recordCode}: v${version}\n`;
                    });
                    summary += `\nTổng số bản ghi: ${restoreRecords.length}\n\n⚠️ Thao tác này sẽ tạo phiên bản mới!\n\nBạn có chắc chắn muốn tiếp tục?`;
                    
                    const confirmed = window.confirm(summary);
                    if (confirmed) {
                      alert(
                        `✅ KHÔI PHỤC THÀNH CÔNG\n\n` +
                        `Đã khôi phục ${restoreRecords.length} bản ghi về phiên bản đã chọn.\n` +
                        `Phiên bản mới: v5\n\n` +
                        `Dữ liệu đã được khôi phục theo lịch sử.`
                      );
                      setShowRestoreModal(false);
                      setRestoreRecords([]);
                      setSelectedRestoreVersions(new Map());
                      setSelectedRecords(new Set());
                    }
                  }}
                  className="px-8 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Khôi phục ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}