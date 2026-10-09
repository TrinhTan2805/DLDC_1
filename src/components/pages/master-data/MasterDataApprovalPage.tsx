import { useState } from 'react';
import { CheckSquare, XSquare, Eye, Clock, CheckCircle, XCircle, Send, X } from 'lucide-react';

interface ApprovalRecord {
  id: string;
  code: string;
  dataName: string;
  category: string;
  requestType: 'create' | 'update' | 'delete';
  requestBy: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  description: string;
}

const mockApprovals: ApprovalRecord[] = [
  {
    id: '1',
    code: 'APR001',
    dataName: 'Dữ liệu A mới',
    category: 'Biên tập danh mục A',
    requestType: 'create',
    requestBy: 'Nguyễn Văn A',
    requestDate: '10/12/2024 09:30',
    status: 'pending',
    description: 'Yêu cầu thêm mới dữ liệu A vào hệ thống'
  },
  {
    id: '2',
    code: 'APR002',
    dataName: 'Dữ liệu B',
    category: 'Danh mục B',
    requestType: 'update',
    requestBy: 'Trần Thị B',
    requestDate: '09/12/2024 14:20',
    status: 'approved',
    description: 'Yêu cầu cập nhật thông tin dữ liệu B'
  },
  {
    id: '3',
    code: 'APR003',
    dataName: 'Dữ liệu C cũ',
    category: 'Danh mục C',
    requestType: 'delete',
    requestBy: 'Lê Văn C',
    requestDate: '08/12/2024 16:45',
    status: 'rejected',
    description: 'Yêu cầu xóa dữ liệu C khỏi hệ thống'
  },
];

// Mock users for recipient selection
const mockUsers = [
  { id: '1', name: 'Lê Văn C', position: 'Phó Cục trưởng', department: 'Cục Công nghệ thông tin' },
  { id: '2', name: 'Trần Thị D', position: 'Trưởng phòng', department: 'Phòng Dữ liệu chủ' },
  { id: '3', name: 'Nguyễn Văn E', position: 'Chuyên viên', department: 'Phòng Quản lý dữ liệu' },
];

export function MasterDataApprovalPage() {
  const [selectedTab, setSelectedTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [selectedRecord, setSelectedRecord] = useState<ApprovalRecord | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showSendToReviewerModal, setShowSendToReviewerModal] = useState(false);
  const [approvalType, setApprovalType] = useState<'approve' | 'reject'>('approve');
  const [approvalNote, setApprovalNote] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [sendNote, setSendNote] = useState('');

  const filteredApprovals = selectedTab === 'all'
    ? mockApprovals
    : mockApprovals.filter(a => a.status === selectedTab);

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', icon: Clock },
      approved: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', icon: CheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: XCircle }
    };
    const labels = {
      pending: 'Chờ duyệt',
      approved: 'Đã duyệt',
      rejected: 'Từ chối'
    };
    const style = styles[status as keyof typeof styles];
    const Icon = style.icon;
    return (
      <span className={`px-2 py-1 text-xs border rounded-full ${style.bg} ${style.text} ${style.border} flex items-center gap-1 inline-flex`}>
        <Icon className="w-3 h-3" />
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getRequestTypeBadge = (type: string) => {
    const styles = {
      create: 'bg-blue-100 text-blue-700 border-blue-200',
      update: 'bg-purple-100 text-purple-700 border-purple-200',
      delete: 'bg-red-100 text-red-700 border-red-200'
    };
    const labels = {
      create: 'Thêm mới',
      update: 'Cập nhật',
      delete: 'Xóa'
    };
    return (
      <span className={`px-2 py-1 text-xs border rounded-full ${styles[type as keyof typeof styles]}`}>
        {labels[type as keyof typeof labels]}
      </span>
    );
  };

  const handleSendToReviewer = () => {
    if (!selectedRecord || !selectedRecipient) return;
    const recipient = mockUsers.find(u => u.id === selectedRecipient);
    alert(`Đã gửi yêu cầu "${selectedRecord.dataName}" đến ${recipient?.name} để trình duyệt`);
    setShowSendToReviewerModal(false);
    setSelectedRecipient('');
    setSendNote('');
    setSelectedRecord(null);
  };

  const stats = {
    total: mockApprovals.length,
    pending: mockApprovals.filter(a => a.status === 'pending').length,
    approved: mockApprovals.filter(a => a.status === 'approved').length,
    rejected: mockApprovals.filter(a => a.status === 'rejected').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900">Phê duyệt dữ liệu chủ</h1>
          <p className="text-sm text-slate-600 mt-1">Xét duyệt các yêu cầu thay đổi dữ liệu chủ</p>
        </div>
        <button
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2"
          onClick={() => setShowSubmitModal(true)}
        >
          <Send className="w-4 h-4" />
          Trình duyệt mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Tổng yêu cầu</div>
              <div className="text-slate-900 mt-1">{stats.total}</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Chờ duyệt</div>
              <div className="text-slate-900 mt-1">{stats.pending}</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Đã duyệt</div>
              <div className="text-slate-900 mt-1">{stats.approved}</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Từ chối</div>
              <div className="text-slate-900 mt-1">{stats.rejected}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Content */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setSelectedTab('pending')}
            className={`flex items-center gap-2 px-6 py-3 text-sm transition-colors ${selectedTab === 'pending'
                ? 'bg-teal-50 text-teal-700 border-b-2 border-teal-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <Clock className="w-4 h-4" />
            Chờ duyệt ({stats.pending})
          </button>
          <button
            onClick={() => setSelectedTab('approved')}
            className={`flex items-center gap-2 px-6 py-3 text-sm transition-colors ${selectedTab === 'approved'
                ? 'bg-teal-50 text-teal-700 border-b-2 border-teal-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <CheckCircle className="w-4 h-4" />
            Đã duyệt ({stats.approved})
          </button>
          <button
            onClick={() => setSelectedTab('rejected')}
            className={`flex items-center gap-2 px-6 py-3 text-sm transition-colors ${selectedTab === 'rejected'
                ? 'bg-teal-50 text-teal-700 border-b-2 border-teal-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <XCircle className="w-4 h-4" />
            Từ chối ({stats.rejected})
          </button>
          <button
            onClick={() => setSelectedTab('all')}
            className={`flex items-center gap-2 px-6 py-3 text-sm transition-colors ${selectedTab === 'all'
                ? 'bg-teal-50 text-teal-700 border-b-2 border-teal-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <CheckSquare className="w-4 h-4" />
            Tất cả ({stats.total})
          </button>
        </div>

        {/* Approval List */}
        <div className="p-6">
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">STT</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Mã yêu cầu</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Loại</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Tên dữ liệu</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Người yêu cầu</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Ngày yêu cầu</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApprovals.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-slate-500 text-sm">
                      Không có yêu cầu nào
                    </td>
                  </tr>
                ) : (
                  filteredApprovals.map((approval, index) => (
                    <tr key={approval.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-slate-700">{index + 1}</td>
                      <td className="px-4 py-3 text-sm">
                        <code className="px-2 py-0.5 bg-slate-100 text-teal-700 rounded text-xs">
                          {approval.code}
                        </code>
                      </td>
                      <td className="px-4 py-3 text-sm">{getRequestTypeBadge(approval.requestType)}</td>
                      <td className="px-4 py-3 text-sm text-slate-900">{approval.dataName}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{approval.requestBy}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{approval.requestDate}</td>
                      <td className="px-4 py-3 text-sm">{getStatusBadge(approval.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            title="Xem chi tiết"
                            onClick={() => {
                              setSelectedRecord(approval);
                              setShowDetailModal(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {approval.status === 'pending' && (
                            <>
                              <button
                                className="p-1.5 text-teal-600 hover:bg-teal-50 rounded"
                                title="Gửi trình duyệt"
                                onClick={() => {
                                  setSelectedRecord(approval);
                                  setShowSendToReviewerModal(true);
                                }}
                              >
                                <Send className="w-4 h-4" />
                              </button>
                              <button
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                title="Phê duyệt"
                                onClick={() => {
                                  setSelectedRecord(approval);
                                  setApprovalType('approve');
                                  setShowApprovalModal(true);
                                }}
                              >
                                <CheckSquare className="w-4 h-4" />
                              </button>
                              <button
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                title="Từ chối"
                                onClick={() => {
                                  setSelectedRecord(approval);
                                  setApprovalType('reject');
                                  setShowApprovalModal(true);
                                }}
                              >
                                <XSquare className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Submit New Request Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-slate-900">Trình duyệt dữ liệu chủ mới</h2>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">Tên dữ liệu <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Nhập tên dữ liệu chủ"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Danh mục <span className="text-red-500">*</span></label>
                  <select defaultValue="" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="" disabled hidden>-- Chọn danh mục --</option>
                    <option>Biên tập danh mục A</option>
                    <option>Danh mục B</option>
                    <option>Danh mục C</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Loại yêu cầu</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="create">Thêm mới</option>
                    <option value="update">Cập nhật</option>
                    <option value="delete">Xóa</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Mô tả <span className="text-red-500">*</span></label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows={4}
                  placeholder="Nhập mô tả chi tiết"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Tệp đính kèm</label>
                <input
                  type="file"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Trình duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send to Reviewer Modal */}
      {showSendToReviewerModal && selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h2 className="text-slate-900">Gửi trình duyệt</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Yêu cầu: <span className="text-teal-700">{selectedRecord.dataName}</span>
                </p>
              </div>
              <button
                onClick={() => {
                  setShowSendToReviewerModal(false);
                  setSelectedRecipient('');
                  setSendNote('');
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Chọn người duyệt <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedRecipient}
                  onChange={(e) => setSelectedRecipient(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="" disabled hidden>-- Chọn người duyệt --</option>
                  {mockUsers.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} - {user.position} ({user.department})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Nội dung yêu cầu</label>
                <textarea
                  value={sendNote}
                  onChange={(e) => setSendNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows={4}
                  placeholder="Nhập nội dung gửi kèm (nếu có)"
                />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h4 className="text-sm text-slate-700 mb-2">Thông tin yêu cầu:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Mã yêu cầu:</span>
                    <code className="px-2 py-0.5 bg-white text-teal-700 rounded text-xs">
                      {selectedRecord.code}
                    </code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Loại:</span>
                    {getRequestTypeBadge(selectedRecord.requestType)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Danh mục:</span>
                    <span className="text-slate-900">{selectedRecord.category}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => {
                  setShowSendToReviewerModal(false);
                  setSelectedRecipient('');
                  setSendNote('');
                }}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSendToReviewer}
                disabled={!selectedRecipient}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${!selectedRecipient
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-teal-600 text-white hover:bg-teal-700'
                  }`}
              >
                <Send className="w-4 h-4" />
                Gửi trình duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-slate-900">Chi tiết yêu cầu</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600">Mã yêu cầu</label>
                  <p className="text-slate-900 mt-1">
                    <code className="px-2 py-0.5 bg-slate-100 text-teal-700 rounded text-xs">
                      {selectedRecord.code}
                    </code>
                  </p>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Loại yêu cầu</label>
                  <p className="mt-1">{getRequestTypeBadge(selectedRecord.requestType)}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Tên dữ liệu</label>
                  <p className="text-slate-900 mt-1">{selectedRecord.dataName}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Danh mục</label>
                  <p className="text-slate-900 mt-1">{selectedRecord.category}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Người yêu cầu</label>
                  <p className="text-slate-900 mt-1">{selectedRecord.requestBy}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Ngày yêu cầu</label>
                  <p className="text-slate-900 mt-1">{selectedRecord.requestDate}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-slate-600">Trạng thái</label>
                  <p className="mt-1">{getStatusBadge(selectedRecord.status)}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-600">Mô tả</label>
                <p className="text-slate-900 mt-1 bg-slate-50 p-3 rounded-lg">
                  {selectedRecord.description}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval/Reject Modal */}
      {showApprovalModal && selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-slate-900">
                {approvalType === 'approve' ? 'Phê duyệt yêu cầu' : 'Từ chối yêu cầu'}
              </h2>
              <button
                onClick={() => setShowApprovalModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-2">Dữ liệu chủ:</p>
                <p className="text-slate-900">{selectedRecord.dataName}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Mã: {selectedRecord.code} | Người yêu cầu: {selectedRecord.requestBy}
                </p>
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Ghi chú {approvalType === 'reject' && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows={4}
                  placeholder={approvalType === 'approve' ? 'Nhập ghi chú (nếu có)' : 'Nhập lý do từ chối'}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  alert(`Đã ${approvalType === 'approve' ? 'phê duyệt' : 'từ chối'} yêu cầu: ${selectedRecord.dataName}`);
                  setShowApprovalModal(false);
                  setApprovalNote('');
                }}
                className={`px-4 py-2 text-white rounded-lg flex items-center gap-2 ${approvalType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                  }`}
              >
                {approvalType === 'approve' ? <CheckSquare className="w-4 h-4" /> : <XSquare className="w-4 h-4" />}
                {approvalType === 'approve' ? 'Phê duyệt' : 'Từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
