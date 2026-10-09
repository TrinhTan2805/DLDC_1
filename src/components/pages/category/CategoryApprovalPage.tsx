import React, { useState } from 'react';
import { CheckSquare, XSquare, Eye, Clock, CheckCircle, XCircle, Send, Plus, X } from 'lucide-react';

interface Category {
  id: string;
  code: string;
  name: string;
  type: 'standard' | 'reference' | 'system';
  description: string;
  recordCount: number;
  status: 'active' | 'inactive';
}

interface ApprovalRequest {
  id: string;
  code: string;
  categoryName: string;
  type: 'create' | 'update' | 'delete';
  submittedBy: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

const mockCategories: Category[] = [
  { id: '1', code: 'CAT001', name: 'Biên tập danh mục A', type: 'standard', description: 'Danh mục tiêu chuẩn A', recordCount: 1245, status: 'active' },
  { id: '2', code: 'CAT002', name: 'Danh mục B', type: 'standard', description: 'Danh mục tiêu chuẩn B', recordCount: 892, status: 'active' },
  { id: '3', code: 'CAT003', name: 'Danh mục C', type: 'reference', description: 'Danh mục tham chiếu C', recordCount: 567, status: 'active' },
  { id: '4', code: 'CAT004', name: 'Danh mục D', type: 'reference', description: 'Danh mục tham chiếu D', recordCount: 423, status: 'active' },
  { id: '5', code: 'CAT005', name: 'Danh mục E', type: 'system', description: 'Danh mục hệ thống E', recordCount: 789, status: 'active' },
  { id: '6', code: 'CAT006', name: 'Danh mục F', type: 'system', description: 'Danh mục hệ thống F', recordCount: 321, status: 'active' },
];

const mockRequests: ApprovalRequest[] = [
  { id: '1', code: 'REQ001', categoryName: 'Biên tập danh mục A mới', type: 'create', submittedBy: 'Nguyễn Văn A', date: '10/12/2024', status: 'pending' },
  { id: '2', code: 'REQ002', categoryName: 'Danh mục B', type: 'update', submittedBy: 'Trần Thị B', date: '09/12/2024', status: 'approved' },
  { id: '3', code: 'REQ003', categoryName: 'Danh mục C', type: 'delete', submittedBy: 'Lê Văn C', date: '08/12/2024', status: 'rejected' },
];

// Mock users for recipient selection
const mockUsers = [
  { id: '1', name: 'Lê Văn C', position: 'Phó Cục trưởng', department: 'Cục Công nghệ thông tin' },
  { id: '2', name: 'Trần Thị D', position: 'Trưởng phòng', department: 'Phòng Danh mục dữ liệu' },
  { id: '3', name: 'Nguyễn Văn E', position: 'Chuyên viên', department: 'Phòng Quản lý dữ liệu' },
];

export function CategoryApprovalPage() {
  const [selectedTab, setSelectedTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSendToReviewerModal, setShowSendToReviewerModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'standard' | 'reference' | 'system'>('all');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [sendNote, setSendNote] = useState('');
  const [newCategory, setNewCategory] = useState({
    name: '',
    type: 'standard' as 'standard' | 'reference' | 'system',
    description: ''
  });

  const filteredRequests = selectedTab === 'all' ? mockRequests : mockRequests.filter(r => r.status === selectedTab);
  const filteredCategories = filterType === 'all'
    ? mockCategories
    : mockCategories.filter(c => c.type === filterType);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === filteredCategories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(filteredCategories.map(c => c.id));
    }
  };

  const handleSubmitSelected = () => {
    alert(`Đã gửi ${selectedCategories.length} danh mục để trình duyệt`);
    setSelectedCategories([]);
    setShowSubmitModal(false);
  };

  const handleCreateAndSubmit = () => {
    alert(`Đã tạo và gửi trình duyệt danh mục: ${newCategory.name}`);
    setNewCategory({ name: '', type: 'standard', description: '' });
    setShowCreateModal(false);
  };

  const handleSendToReviewer = () => {
    if (!selectedRequest || !selectedRecipient) return;
    const recipient = mockUsers.find(u => u.id === selectedRecipient);
    alert(`Đã gửi yêu cầu "${selectedRequest.categoryName}" đến ${recipient?.name} để trình duyệt`);
    setShowSendToReviewerModal(false);
    setSelectedRecipient('');
    setSendNote('');
    setSelectedRequest(null);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      approved: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200'
    };
    const labels = { pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Từ chối' };
    return <span className={`px-2 py-1 text-xs border rounded-full ${styles[status as keyof typeof styles]}`}>{labels[status as keyof typeof labels]}</span>;
  };

  const getTypeBadge = (type: string) => {
    const styles = {
      standard: 'bg-blue-100 text-blue-700 border-blue-200',
      reference: 'bg-purple-100 text-purple-700 border-purple-200',
      system: 'bg-orange-100 text-orange-700 border-orange-200',
      create: 'bg-blue-100 text-blue-700 border-blue-200',
      update: 'bg-purple-100 text-purple-700 border-purple-200',
      delete: 'bg-red-100 text-red-700 border-red-200'
    };
    const labels = {
      standard: 'Tiêu chuẩn',
      reference: 'Tham chiếu',
      system: 'Hệ thống',
      create: 'Thêm mới',
      update: 'Cập nhật',
      delete: 'Xóa'
    };
    return <span className={`px-2 py-1 text-xs border rounded-full ${styles[type as keyof typeof styles]}`}>{labels[type as keyof typeof labels]}</span>;
  };

  const stats = {
    total: mockRequests.length,
    pending: mockRequests.filter(r => r.status === 'pending').length,
    approved: mockRequests.filter(r => r.status === 'approved').length,
    rejected: mockRequests.filter(r => r.status === 'rejected').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900">Phê duyệt danh mục</h1>
        </div>
        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Trình duyệt danh mục
        </button>
      </div>

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

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="flex border-b border-slate-200">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`flex items-center gap-2 px-6 py-3 text-sm transition-colors ${selectedTab === tab
                  ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              {tab === 'pending' && <Clock className="w-4 h-4" />}
              {tab === 'approved' && <CheckCircle className="w-4 h-4" />}
              {tab === 'rejected' && <XCircle className="w-4 h-4" />}
              {tab === 'all' && <CheckSquare className="w-4 h-4" />}
              {tab === 'pending' ? `Chờ duyệt (${stats.pending})` :
                tab === 'approved' ? `Đã duyệt (${stats.approved})` :
                  tab === 'rejected' ? `Từ chối (${stats.rejected})` :
                    `Tất cả (${stats.total})`}
            </button>
          ))}
        </div>

        <div className="p-6">
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">STT</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Mã yêu cầu</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Loại</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Tên danh mục</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Người trình</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Ngày trình</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((request, index) => (
                  <tr key={request.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-700">{index + 1}</td>
                    <td className="px-4 py-3 text-sm">
                      <code className="px-2 py-0.5 bg-slate-100 text-indigo-700 rounded text-xs">{request.code}</code>
                    </td>
                    <td className="px-4 py-3 text-sm">{getTypeBadge(request.type)}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{request.categoryName}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{request.submittedBy}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{request.date}</td>
                    <td className="px-4 py-3 text-sm">{getStatusBadge(request.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Xem">
                          <Eye className="w-4 h-4" />
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button
                              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"
                              title="Gửi trình duyệt"
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowSendToReviewerModal(true);
                              }}
                            >
                              <Send className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Duyệt">
                              <CheckSquare className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Từ chối">
                              <XSquare className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h2 className="text-slate-900">Chọn danh mục để trình duyệt</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Chọn các danh mục cần trình duyệt hoặc tạo mới
                </p>
              </div>
              <button
                title="Đóng"
                onClick={() => {
                  setShowSubmitModal(false);
                  setSelectedCategories([]);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <select
                    title="Loại danh mục filter"
                    value={filterType}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterType(e.target.value as any)}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">Tất cả loại</option>
                    <option value="standard">Tiêu chuẩn</option>
                    <option value="reference">Tham chiếu</option>
                    <option value="system">Hệ thống</option>
                  </select>

                  <button
                    onClick={handleSelectAll}
                    className="px-3 py-2 text-sm text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100"
                  >
                    {selectedCategories.length === filteredCategories.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                  </button>

                  {selectedCategories.length > 0 && (
                    <span className="text-sm text-slate-600">
                      Đã chọn: <span className="text-indigo-700">{selectedCategories.length}</span> danh mục
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Tạo danh mục mới
                </button>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-3 gap-4">
                {filteredCategories.map((category) => {
                  const isSelected = selectedCategories.includes(category.id);
                  return (
                    <div
                      key={category.id}
                      onClick={() => handleCategoryToggle(category.id)}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${isSelected
                          ? 'border-indigo-500 bg-indigo-50 shadow-md'
                          : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'
                        }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <input
                            title="Chọn danh mục"
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => { }}
                            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                          />
                          <code className="px-2 py-0.5 bg-slate-100 text-indigo-700 rounded text-xs">
                            {category.code}
                          </code>
                        </div>
                        {getTypeBadge(category.type)}
                      </div>

                      <h4 className="text-sm text-slate-900 mb-2">{category.name}</h4>
                      <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                        {category.description}
                      </p>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">
                          {category.recordCount.toLocaleString()} bản ghi
                        </span>
                        <span className={`px-2 py-0.5 rounded-full ${category.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-600'
                          }`}>
                          {category.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredCategories.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  Không tìm thấy danh mục nào
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  setSelectedCategories([]);
                }}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitSelected}
                disabled={selectedCategories.length === 0}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${selectedCategories.length === 0
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
              >
                <Send className="w-4 h-4" />
                Trình duyệt ({selectedCategories.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-slate-900">Tạo danh mục mới và trình duyệt</h2>
              <button
                title="Đóng"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nhập tên danh mục"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Loại danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  title="Loại danh mục mới"
                  value={newCategory.type}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewCategory({ ...newCategory, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="standard">Tiêu chuẩn</option>
                  <option value="reference">Tham chiếu</option>
                  <option value="system">Hệ thống</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={4}
                  placeholder="Nhập mô tả danh mục"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateAndSubmit}
                disabled={!newCategory.name}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${!newCategory.name
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
              >
                <Send className="w-4 h-4" />
                Tạo và trình duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send to Reviewer Modal */}
      {showSendToReviewerModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h2 className="text-slate-900">Gửi trình duyệt</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Yêu cầu: <span className="text-indigo-700">{selectedRequest.categoryName}</span>
                </p>
              </div>
              <button
                title="Đóng"
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
                  title="Chọn người duyệt"
                  value={selectedRecipient}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedRecipient(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSendNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={4}
                  placeholder="Nhập nội dung gửi kèm (nếu có)"
                />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h4 className="text-sm text-slate-700 mb-2">Thông tin yêu cầu:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Mã yêu cầu:</span>
                    <code className="px-2 py-0.5 bg-white text-indigo-700 rounded text-xs">
                      {selectedRequest.code}
                    </code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Loại:</span>
                    {getTypeBadge(selectedRequest.type)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Người trình:</span>
                    <span className="text-slate-900">{selectedRequest.submittedBy}</span>
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
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
              >
                <Send className="w-4 h-4" />
                Gửi trình duyệt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}