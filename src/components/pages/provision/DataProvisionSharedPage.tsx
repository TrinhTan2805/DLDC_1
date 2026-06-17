import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Save, X, Share2, Shield, CheckCircle, XCircle, Clock, Building2, User, Calendar, AlertCircle, Download, FileText } from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';

interface AccessPermission {
  id: string;
  code: string;
  organization: string;
  organizationType: 'ministry' | 'local' | 'external';
  dataPackage: string;
  accessLevel: 'read' | 'write' | 'full';
  status: 'active' | 'pending' | 'expired' | 'revoked';
  requestDate: string;
  approvedDate?: string;
  expiryDate: string;
  approver?: string;
  requestedBy: string;
  purpose: string;
  recordLimit?: number;
  currentUsage: number;
}

const mockPermissions: AccessPermission[] = [
  {
    id: 'ACC001',
    code: 'PERM_2024_001',
    organization: 'Sở Tư pháp Hà Nội',
    organizationType: 'local',
    dataPackage: 'Gói tin thông tin người nghèo, cận nghèo',
    accessLevel: 'read',
    status: 'active',
    requestDate: '10/01/2024',
    approvedDate: '12/01/2024',
    expiryDate: '31/12/2024',
    approver: 'Nguyễn Văn A',
    requestedBy: 'Trần Thị B',
    purpose: 'Tra cứu thông tin hỗ trợ pháp lý cho người nghèo',
    recordLimit: 10000,
    currentUsage: 5234
  },
  {
    id: 'ACC002',
    code: 'PERM_2024_002',
    organization: 'Bộ Lao động - Thương binh và Xã hội',
    organizationType: 'ministry',
    dataPackage: 'Gói tin hỗ trợ pháp lý',
    accessLevel: 'full',
    status: 'active',
    requestDate: '15/02/2024',
    approvedDate: '18/02/2024',
    expiryDate: '31/12/2025',
    approver: 'Lê Văn C',
    requestedBy: 'Phạm Văn D',
    purpose: 'Tích hợp dữ liệu vào Hệ thống quản lý Bộ Tư Pháp xã hội',
    currentUsage: 12456
  },
  {
    id: 'ACC003',
    code: 'PERM_2024_003',
    organization: 'Đối tác ABC',
    organizationType: 'external',
    dataPackage: 'Gói tin đăng ký kinh doanh',
    accessLevel: 'read',
    status: 'pending',
    requestDate: '14/12/2024',
    expiryDate: '31/12/2024',
    requestedBy: 'Hoàng Thị E',
    purpose: 'Nghiên cứu phát triển dịch vụ',
    recordLimit: 5000,
    currentUsage: 0
  },
  {
    id: 'ACC004',
    code: 'PERM_2023_045',
    organization: 'Sở Tư pháp TP.HCM',
    organizationType: 'local',
    dataPackage: 'Gói tin công chứng',
    accessLevel: 'write',
    status: 'expired',
    requestDate: '05/01/2023',
    approvedDate: '08/01/2023',
    expiryDate: '31/12/2023',
    approver: 'Đỗ Văn F',
    requestedBy: 'Vũ Thị G',
    purpose: 'Đồng bộ dữ liệu công chứng',
    recordLimit: 50000,
    currentUsage: 48932
  },
  {
    id: 'ACC005',
    code: 'PERM_2024_004',
    organization: 'Công ty XYZ',
    organizationType: 'external',
    dataPackage: 'Gói tin doanh nghiệp',
    accessLevel: 'read',
    status: 'revoked',
    requestDate: '20/03/2024',
    approvedDate: '25/03/2024',
    expiryDate: '31/12/2024',
    approver: 'Nguyễn Văn A',
    requestedBy: 'Lý Thị H',
    purpose: 'Vi phạm chính sách sử dụng dữ liệu',
    recordLimit: 1000,
    currentUsage: 856
  }
];

export function DataProvisionSharedPage() {
  const [permissions, setPermissions] = useState<AccessPermission[]>(mockPermissions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterOrgType, setFilterOrgType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<AccessPermission | null>(null);

  const filteredPermissions = permissions.filter(perm => {
    const matchesSearch = perm.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perm.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perm.dataPackage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || perm.status === filterStatus;
    const matchesOrgType = filterOrgType === 'all' || perm.organizationType === filterOrgType;
    return matchesSearch && matchesStatus && matchesOrgType;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      expired: 'bg-slate-100 text-slate-600 border-slate-200',
      revoked: 'bg-red-100 text-red-700 border-red-200'
    };
    const labels = {
      active: 'Hoạt động',
      pending: 'Chờ duyệt',
      expired: 'Hết hạn',
      revoked: 'Thu hồi'
    };
    return (
      <span className={`px-2 py-1 text-xs border rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getOrgTypeBadge = (type: string) => {
    const styles = {
      ministry: 'bg-blue-100 text-blue-700 border-blue-200',
      local: 'bg-purple-100 text-purple-700 border-purple-200',
      external: 'bg-orange-100 text-orange-700 border-orange-200'
    };
    const labels = {
      ministry: 'Bộ/Ngành',
      local: 'Địa phương',
      external: 'Bên ngoài'
    };
    return (
      <span className={`px-2 py-1 text-xs border rounded-full ${styles[type as keyof typeof styles]}`}>
        {labels[type as keyof typeof labels]}
      </span>
    );
  };

  const getAccessLevelBadge = (level: string) => {
    const styles = {
      read: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      write: 'bg-amber-100 text-amber-700 border-amber-200',
      full: 'bg-purple-100 text-purple-700 border-purple-200'
    };
    const labels = {
      read: 'Đọc',
      write: 'Ghi',
      full: 'Toàn quyền'
    };
    return (
      <span className={`px-2 py-1 text-xs border rounded-full ${styles[level as keyof typeof styles]}`}>
        {labels[level as keyof typeof labels]}
      </span>
    );
  };

  const handleApprove = (id: string) => {
    setPermissions(permissions.map(p =>
      p.id === id ? {
        ...p,
        status: 'active',
        approvedDate: new Date().toLocaleDateString('vi-VN'),
        approver: 'Admin User'
      } : p
    ));
    setShowApprovalModal(false);
    setSelectedPermission(null);
  };

  const handleReject = (id: string) => {
    setPermissions(permissions.filter(p => p.id !== id));
    setShowApprovalModal(false);
    setSelectedPermission(null);
  };

  const handleRevoke = (id: string) => {
    setPermissions(permissions.map(p =>
      p.id === id ? { ...p, status: 'revoked' } : p
    ));
  };

  const stats = {
    total: permissions.length,
    active: permissions.filter(p => p.status === 'active').length,
    pending: permissions.filter(p => p.status === 'pending').length,
    expired: permissions.filter(p => p.status === 'expired').length,
    revoked: permissions.filter(p => p.status === 'revoked').length,
    totalUsage: permissions.reduce((sum, p) => sum + p.currentUsage, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="Cung cấp dữ liệu dùng chung" />

      {/* Action Button */}
      <div className="flex items-center justify-end">
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Thêm cấu hình quyền truy cập
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-6 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Tổng quyền</div>
              <div className="text-slate-900 mt-1">{stats.total}</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Hoạt động</div>
              <div className="text-slate-900 mt-1">{stats.active}</div>
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
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Hết hạn</div>
              <div className="text-slate-900 mt-1">{stats.expired}</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Thu hồi</div>
              <div className="text-slate-900 mt-1">{stats.revoked}</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Tổng truy cập</div>
              <div className="text-slate-900 mt-1">{stats.totalUsage.toLocaleString('vi-VN')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tổ chức, mã quyền, gói dữ liệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="pending">Chờ duyệt</option>
            <option value="expired">Hết hạn</option>
            <option value="revoked">Thu hồi</option>
          </select>
          <select
            value={filterOrgType}
            onChange={(e) => setFilterOrgType(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">Tất cả loại tổ chức</option>
            <option value="ministry">Bộ/Ngành</option>
            <option value="local">Địa phương</option>
            <option value="external">Bên ngoài</option>
          </select>
        </div>
      </div>

      {/* Permission List */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">STT</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Mã quyền</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Tổ chức</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Loại</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Gói dữ liệu</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Quyền</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Sử dụng</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Hết hạn</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPermissions.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-8 text-center text-slate-500 text-sm">
                    Không tìm thấy quyền truy cập phù hợp
                  </td>
                </tr>
              ) : (
                filteredPermissions.map((perm, index) => (
                  <tr key={perm.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-700">{index + 1}</td>
                    <td className="px-4 py-3 text-sm">
                      <code className="px-2 py-0.5 bg-slate-100 text-cyan-700 rounded text-xs">
                        {perm.code}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-slate-900">{perm.organization}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Yêu cầu: {perm.requestedBy}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">{getOrgTypeBadge(perm.organizationType)}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{perm.dataPackage}</td>
                    <td className="px-4 py-3 text-sm">{getAccessLevelBadge(perm.accessLevel)}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="text-slate-900">{perm.currentUsage.toLocaleString('vi-VN')}</div>
                      {perm.recordLimit && (
                        <div className="text-xs text-slate-500">/ {perm.recordLimit.toLocaleString('vi-VN')}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{perm.expiryDate}</td>
                    <td className="px-4 py-3 text-sm">{getStatusBadge(perm.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Xem chi tiết"
                          onClick={() => {
                            setSelectedPermission(perm);
                            setShowViewModal(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {perm.status === 'pending' && (
                          <button
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                            title="Duyệt"
                            onClick={() => {
                              setSelectedPermission(perm);
                              setShowApprovalModal(true);
                            }}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {perm.status === 'active' && (
                          <button
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            title="Thu hồi quyền"
                            onClick={() => handleRevoke(perm.id)}
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Detail Modal */}
      {showViewModal && selectedPermission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-slate-900">Chi tiết cấu hình quyền truy cập</h2>
              <button onClick={() => setShowViewModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Mã quyền</label>
                  <div className="text-sm text-slate-900">{selectedPermission.code}</div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Trạng thái</label>
                  <div>{getStatusBadge(selectedPermission.status)}</div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-slate-600 mb-1">Tổ chức</label>
                  <div className="text-sm text-slate-900 flex items-center gap-2">
                    {selectedPermission.organization}
                    {getOrgTypeBadge(selectedPermission.organizationType)}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-slate-600 mb-1">Gói dữ liệu</label>
                  <div className="text-sm text-slate-900">{selectedPermission.dataPackage}</div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Quyền truy cập</label>
                  <div>{getAccessLevelBadge(selectedPermission.accessLevel)}</div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Giới hạn bản ghi</label>
                  <div className="text-sm text-slate-900">
                    {selectedPermission.recordLimit ? selectedPermission.recordLimit.toLocaleString('vi-VN') : 'Không giới hạn'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Người yêu cầu</label>
                  <div className="text-sm text-slate-900">{selectedPermission.requestedBy}</div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Ngày yêu cầu</label>
                  <div className="text-sm text-slate-900">{selectedPermission.requestDate}</div>
                </div>
                {selectedPermission.approver && (
                  <>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">Người duyệt</label>
                      <div className="text-sm text-slate-900">{selectedPermission.approver}</div>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">Ngày duyệt</label>
                      <div className="text-sm text-slate-900">{selectedPermission.approvedDate}</div>
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Ngày hết hạn</label>
                  <div className="text-sm text-slate-900">{selectedPermission.expiryDate}</div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Lượt sử dụng hiện tại</label>
                  <div className="text-sm text-slate-900">{selectedPermission.currentUsage.toLocaleString('vi-VN')}</div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-slate-600 mb-1">Mục đích sử dụng</label>
                  <div className="text-sm text-slate-900">{selectedPermission.purpose}</div>
                </div>
              </div>

              {/* Usage Progress */}
              {selectedPermission.recordLimit && (
                <div>
                  <label className="block text-sm text-slate-600 mb-2">Tiến độ sử dụng</label>
                  <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-cyan-600 h-full transition-all"
                      style={{ width: `${(selectedPermission.currentUsage / selectedPermission.recordLimit) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    {selectedPermission.currentUsage.toLocaleString('vi-VN')} / {selectedPermission.recordLimit.toLocaleString('vi-VN')} ({Math.round((selectedPermission.currentUsage / selectedPermission.recordLimit) * 100)}%)
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedPermission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-slate-900">Duyệt yêu cầu cấp quyền</h2>
              <button onClick={() => setShowApprovalModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <div className="font-medium mb-1">Thông tin yêu cầu</div>
                    <div className="space-y-1">
                      <div>Tổ chức: <strong>{selectedPermission.organization}</strong></div>
                      <div>Gói dữ liệu: <strong>{selectedPermission.dataPackage}</strong></div>
                      <div>Quyền yêu cầu: {getAccessLevelBadge(selectedPermission.accessLevel)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">Ghi chú phê duyệt</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Nhập ghi chú (nếu có)..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => handleReject(selectedPermission.id)}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
              >
                Từ chối
              </button>
              <button
                onClick={() => handleApprove(selectedPermission.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Phê duyệt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}