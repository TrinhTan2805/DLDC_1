import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Save, X, FolderCog, Database, Package, CheckCircle, XCircle, AlertTriangle, FileText, Settings, List } from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';

interface DataPackage {
  id: string;
  code: string;
  name: string;
  description: string;
  targetSystem: string;
  dataType: string;
  fields: PackageField[];
  status: 'active' | 'inactive' | 'draft';
  createdDate: string;
  lastModified: string;
  recordCount: number;
}

interface PackageField {
  id: string;
  fieldName: string;
  fieldType: string;
  required: boolean;
  description: string;
}

const mockPackages: DataPackage[] = [
  {
    id: 'PKG001',
    code: 'POOR_INFO',
    name: 'Gói tin thông tin người nghèo, cận nghèo',
    description: 'Cung cấp thông tin người nghèo, cận nghèo cần cung cấp cho hệ thống báo trợ',
    targetSystem: 'Hệ thống Báo trợ và hội và giám nghèo',
    dataType: 'Thông tin cá nhân',
    fields: [
      { id: 'F1', fieldName: 'Họ và tên', fieldType: 'String', required: true, description: 'Họ tên đầy đủ' },
      { id: 'F2', fieldName: 'Số CCCD', fieldType: 'String', required: true, description: 'Số căn cước công dân' },
      { id: 'F3', fieldName: 'Ngày sinh', fieldType: 'Date', required: true, description: 'Ngày tháng năm sinh' },
      { id: 'F4', fieldName: 'Địa chỉ', fieldType: 'String', required: false, description: 'Địa chỉ thường trú' },
      { id: 'F5', fieldName: 'Mức nghèo', fieldType: 'String', required: true, description: 'Nghèo/Cận nghèo' },
    ],
    status: 'active',
    createdDate: '15/01/2024',
    lastModified: '10/12/2024',
    recordCount: 15234
  },
  {
    id: 'PKG002',
    code: 'LEGAL_AID',
    name: 'Gói tin hỗ trợ pháp lý',
    description: 'Cung cấp dữ liệu về các trường hợp được hỗ trợ pháp lý',
    targetSystem: 'Hệ thống Tư pháp địa phương',
    dataType: 'Hồ sơ pháp lý',
    fields: [
      { id: 'F1', fieldName: 'Mã hồ sơ', fieldType: 'String', required: true, description: 'Mã định danh hồ sơ' },
      { id: 'F2', fieldName: 'Người được hỗ trợ', fieldType: 'String', required: true, description: 'Họ tên người được hỗ trợ' },
      { id: 'F3', fieldName: 'Loại vụ việc', fieldType: 'String', required: true, description: 'Dân sự/Hình sự/Hành chính' },
      { id: 'F4', fieldName: 'Ngày tiếp nhận', fieldType: 'Date', required: true, description: 'Ngày tiếp nhận hồ sơ' },
    ],
    status: 'active',
    createdDate: '20/02/2024',
    lastModified: '12/12/2024',
    recordCount: 8421
  },
  {
    id: 'PKG003',
    code: 'BUSINESS_REG',
    name: 'Gói tin đăng ký kinh doanh',
    description: 'Cung cấp thông tin doanh nghiệp đăng ký mới',
    targetSystem: 'Hệ thống quản lý Bộ Tư Pháp doanh nghiệp',
    dataType: 'Thông tin doanh nghiệp',
    fields: [
      { id: 'F1', fieldName: 'Mã số DN', fieldType: 'String', required: true, description: 'Mã số doanh nghiệp' },
      { id: 'F2', fieldName: 'Tên DN', fieldType: 'String', required: true, description: 'Tên doanh nghiệp' },
      { id: 'F3', fieldName: 'Địa chỉ', fieldType: 'String', required: true, description: 'Địa chỉ trụ sở chính' },
      { id: 'F4', fieldName: 'Ngày cấp', fieldType: 'Date', required: true, description: 'Ngày cấp giấy phép' },
    ],
    status: 'draft',
    createdDate: '05/03/2024',
    lastModified: '14/12/2024',
    recordCount: 0
  }
];

export function DataProvisionInternalPage() {
  const [packages, setPackages] = useState<DataPackage[]>(mockPackages);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<DataPackage | null>(null);
  const [showFieldModal, setShowFieldModal] = useState(false);

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.targetSystem.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || pkg.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700 border-green-200',
      inactive: 'bg-slate-100 text-slate-600 border-slate-200',
      draft: 'bg-amber-100 text-amber-700 border-amber-200'
    };
    const labels = {
      active: 'Đang hoạt động',
      inactive: 'Ngừng hoạt động',
      draft: 'Bản nháp'
    };
    return (
      <span className={`px-2 py-1 text-xs border rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const stats = {
    total: packages.length,
    active: packages.filter(p => p.status === 'active').length,
    draft: packages.filter(p => p.status === 'draft').length,
    inactive: packages.filter(p => p.status === 'inactive').length,
    totalRecords: packages.reduce((sum, p) => sum + p.recordCount, 0)
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Cung cấp danh mục cho hệ thống nội ngành" icon={Package} />

      {/* Action Button */}
      <div className="flex items-center justify-end">
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Thêm gói tin mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Tổng gói tin</div>
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
              <div className="text-xs text-slate-600">Đang hoạt động</div>
              <div className="text-slate-900 mt-1">{stats.active}</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Bản nháp</div>
              <div className="text-slate-900 mt-1">{stats.draft}</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Ngừng hoạt động</div>
              <div className="text-slate-900 mt-1">{stats.inactive}</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Tổng bản ghi</div>
              <div className="text-slate-900 mt-1">{stats.totalRecords.toLocaleString('vi-VN')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên gói tin, mã, hệ thống..."
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
            <option value="active">Đang hoạt động</option>
            <option value="draft">Bản nháp</option>
            <option value="inactive">Ngừng hoạt động</option>
          </select>
        </div>
      </div>

      {/* Package List */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">STT</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Mã gói tin</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Tên gói tin</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Hệ thống đích</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Loại dữ liệu</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Số trường</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Số bản ghi</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPackages.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-slate-500 text-sm">
                    Không tìm thấy gói tin phù hợp
                  </td>
                </tr>
              ) : (
                filteredPackages.map((pkg, index) => (
                  <tr key={pkg.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-700">{index + 1}</td>
                    <td className="px-4 py-3 text-sm">
                      <code className="px-2 py-0.5 bg-slate-100 text-cyan-700 rounded text-xs">
                        {pkg.code}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-slate-900">{pkg.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{pkg.description}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{pkg.targetSystem}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{pkg.dataType}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
                        {pkg.fields.length} trường
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {pkg.recordCount.toLocaleString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-sm">{getStatusBadge(pkg.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Xem chi tiết"
                          onClick={() => {
                            setSelectedPackage(pkg);
                            setShowViewModal(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"
                          title="Chỉnh sửa"
                          onClick={() => {
                            setSelectedPackage(pkg);
                            setShowEditModal(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 text-cyan-600 hover:bg-cyan-50 rounded"
                          title="Cấu hình trường"
                          onClick={() => {
                            setSelectedPackage(pkg);
                            setShowFieldModal(true);
                          }}
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
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
      {showViewModal && selectedPackage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-slate-900">Chi tiết gói tin dữ liệu</h2>
              <button onClick={() => setShowViewModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Mã gói tin</label>
                  <div className="text-sm text-slate-900">{selectedPackage.code}</div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Trạng thái</label>
                  <div>{getStatusBadge(selectedPackage.status)}</div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-slate-600 mb-1">Tên gói tin</label>
                  <div className="text-sm text-slate-900">{selectedPackage.name}</div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-slate-600 mb-1">Mô tả</label>
                  <div className="text-sm text-slate-900">{selectedPackage.description}</div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Hệ thống đích</label>
                  <div className="text-sm text-slate-900">{selectedPackage.targetSystem}</div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Loại dữ liệu</label>
                  <div className="text-sm text-slate-900">{selectedPackage.dataType}</div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Ngày tạo</label>
                  <div className="text-sm text-slate-900">{selectedPackage.createdDate}</div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Cập nhật lần cuối</label>
                  <div className="text-sm text-slate-900">{selectedPackage.lastModified}</div>
                </div>
              </div>

              {/* Fields */}
              <div>
                <h3 className="text-sm text-slate-900 mb-3">Cấu trúc trường dữ liệu ({selectedPackage.fields.length} trường)</h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs text-slate-600">Tên trường</th>
                        <th className="px-3 py-2 text-left text-xs text-slate-600">Kiểu dữ liệu</th>
                        <th className="px-3 py-2 text-left text-xs text-slate-600">Bắt buộc</th>
                        <th className="px-3 py-2 text-left text-xs text-slate-600">Mô tả</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedPackage.fields.map((field) => (
                        <tr key={field.id}>
                          <td className="px-3 py-2 text-sm text-slate-900">{field.fieldName}</td>
                          <td className="px-3 py-2 text-sm">
                            <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">{field.fieldType}</code>
                          </td>
                          <td className="px-3 py-2 text-sm">
                            {field.required ? (
                              <span className="text-red-600">●</span>
                            ) : (
                              <span className="text-slate-400">○</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-sm text-slate-600">{field.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
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
    </div>
  );
}