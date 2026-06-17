import { useState } from 'react';
import { 
  Clock, 
  Search, 
  Download, 
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Database,
  Shield,
  AlertTriangle,
  UserCog,
  Settings,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';
import { StatsCard } from '../../common/StatsCard';

interface LogRetentionConfig {
  id: number;
  logType: 'access' | 'error' | 'account' | 'config' | 'system' | 'security';
  logTypeName: string;
  retentionDays: number;
  description: string;
  isActive: boolean;
  lastUpdated: string;
  updatedBy: string;
}

const initialConfigs: LogRetentionConfig[] = [
  {
    id: 1,
    logType: 'access',
    logTypeName: 'Nhật ký truy cập',
    retentionDays: 90,
    description: 'Lưu trữ nhật ký đăng nhập và truy cập hệ thống',
    isActive: true,
    lastUpdated: '15/12/2024 10:30:00',
    updatedBy: 'Admin Hệ thống'
  },
  {
    id: 2,
    logType: 'error',
    logTypeName: 'Nhật ký lỗi phát sinh',
    retentionDays: 180,
    description: 'Lưu trữ các lỗi phát sinh trong quá trình hoạt động',
    isActive: true,
    lastUpdated: '15/12/2024 10:30:00',
    updatedBy: 'Admin Hệ thống'
  },
  {
    id: 3,
    logType: 'account',
    logTypeName: 'Nhật ký quản lý tài khoản',
    retentionDays: 365,
    description: 'Lưu trữ các thao tác quản lý tài khoản người dùng',
    isActive: true,
    lastUpdated: '15/12/2024 10:30:00',
    updatedBy: 'Admin Hệ thống'
  },
  {
    id: 4,
    logType: 'config',
    logTypeName: 'Nhật ký thay đổi cấu hình',
    retentionDays: 365,
    description: 'Lưu trữ các thay đổi cấu hình hệ thống',
    isActive: true,
    lastUpdated: '15/12/2024 10:30:00',
    updatedBy: 'Admin Hệ thống'
  },
  {
    id: 5,
    logType: 'system',
    logTypeName: 'Nhật ký hệ thống',
    retentionDays: 90,
    description: 'Lưu trữ các sự kiện hệ thống',
    isActive: true,
    lastUpdated: '15/12/2024 10:30:00',
    updatedBy: 'Admin Hệ thống'
  },
  {
    id: 6,
    logType: 'security',
    logTypeName: 'Nhật ký bảo mật',
    retentionDays: 730,
    description: 'Lưu trữ các sự kiện liên quan đến bảo mật',
    isActive: true,
    lastUpdated: '15/12/2024 10:30:00',
    updatedBy: 'Admin Hệ thống'
  }
];

export function LogRetentionConfigPage() {
  const [configs, setConfigs] = useState<LogRetentionConfig[]>(initialConfigs);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<LogRetentionConfig | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Form state
  const [formData, setFormData] = useState({
    logTypeName: '',
    retentionDays: 90,
    description: '',
    isActive: true
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredConfigs = configs.filter(config => 
    config.logTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    config.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setFormData({
      logTypeName: '',
      retentionDays: 90,
      description: '',
      isActive: true
    });
    setShowAddModal(true);
  };

  const handleEdit = (config: LogRetentionConfig) => {
    setSelectedConfig(config);
    setFormData({
      logTypeName: config.logTypeName,
      retentionDays: config.retentionDays,
      description: config.description,
      isActive: config.isActive
    });
    setShowEditModal(true);
  };

  const handleDelete = (config: LogRetentionConfig) => {
    setSelectedConfig(config);
    setShowDeleteConfirm(true);
  };

  const confirmAdd = () => {
    if (!formData.logTypeName || formData.retentionDays <= 0) {
      alert('Vui lòng nhập đầy đủ thông tin hợp lệ!');
      return;
    }

    const newConfig: LogRetentionConfig = {
      id: Math.max(...configs.map(c => c.id)) + 1,
      logType: 'system',
      logTypeName: formData.logTypeName,
      retentionDays: formData.retentionDays,
      description: formData.description,
      isActive: formData.isActive,
      lastUpdated: new Date().toLocaleString('vi-VN'),
      updatedBy: 'Admin Hệ thống'
    };

    setConfigs([...configs, newConfig]);
    setShowAddModal(false);
    alert('Thêm mới cấu hình thành công!');
  };

  const confirmEdit = () => {
    if (!selectedConfig || !formData.logTypeName || formData.retentionDays <= 0) {
      alert('Vui lòng nhập đầy đủ thông tin hợp lệ!');
      return;
    }

    const updatedConfigs = configs.map(config => 
      config.id === selectedConfig.id 
        ? {
            ...config,
            logTypeName: formData.logTypeName,
            retentionDays: formData.retentionDays,
            description: formData.description,
            isActive: formData.isActive,
            lastUpdated: new Date().toLocaleString('vi-VN'),
            updatedBy: 'Admin Hệ thống'
          }
        : config
    );

    setConfigs(updatedConfigs);
    setShowEditModal(false);
    setSelectedConfig(null);
    alert('Cập nhật cấu hình thành công!');
  };

  const confirmDelete = () => {
    if (!selectedConfig) return;

    setConfigs(configs.filter(config => config.id !== selectedConfig.id));
    setShowDeleteConfirm(false);
    setSelectedConfig(null);
    alert('Xóa cấu hình thành công!');
  };

  const handleExportExcel = () => {
    alert('Đang kết xuất danh sách cấu hình lưu trữ nhật ký ra file Excel...');
  };

  const getLogTypeIcon = (type: LogRetentionConfig['logType']) => {
    switch (type) {
      case 'access':
        return <UserCog className="w-4 h-4" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4" />;
      case 'account':
        return <UserCog className="w-4 h-4" />;
      case 'config':
        return <Settings className="w-4 h-4" />;
      case 'system':
        return <Database className="w-4 h-4" />;
      case 'security':
        return <Shield className="w-4 h-4" />;
    }
  };

  const getLogTypeColor = (type: LogRetentionConfig['logType']) => {
    switch (type) {
      case 'access':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'error':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'account':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'config':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'system':
        return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case 'security':
        return 'bg-orange-100 text-orange-700 border-orange-200';
    }
  };

  const averageRetention = Math.round(
    configs.reduce((sum, c) => sum + c.retentionDays, 0) / configs.length
  );

  return (
    <div className="space-y-6" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}>
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => {
              if (typeof (window as any).navigateToPage === 'function') {
                (window as any).navigateToPage('admin-config-log');
              }
            }}
            className="flex items-center gap-2 px-6 py-3 border-b-2 transition-colors border-transparent text-slate-600 hover:text-slate-900"
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">Nhật ký thay đổi cấu hình</span>
          </button>
          <button
            className="flex items-center gap-2 px-6 py-3 border-b-2 transition-colors border-blue-600 text-blue-600"
          >
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Quản lý thời gian lưu trữ nhật ký</span>
          </button>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard 
          icon={Database} 
          iconColor="blue" 
          title="Tổng loại nhật ký" 
          value={configs.length.toString()} 
        />
        <StatsCard 
          icon={Clock} 
          iconColor="green" 
          title="Thời gian TB (ngày)" 
          value={averageRetention.toString()} 
        />
        <StatsCard 
          icon={CheckCircle2} 
          iconColor="green" 
          title="Đang hoạt động" 
          value={configs.filter(c => c.isActive).length.toString()} 
        />
        <StatsCard 
          icon={Shield} 
          iconColor="orange" 
          title="Lưu trữ lâu nhất (ngày)" 
          value={Math.max(...configs.map(c => c.retentionDays)).toString()} 
        />
      </div>

      {/* Search & Actions */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-3">
            <div className="relative flex-1">
              <input aria-label="Input field"
                type="text"
                placeholder="Tìm kiếm loại nhật ký..."
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center">
              <Search className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-[13px] shadow-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Thêm mới
            </button>
            <button 
              onClick={handleExportExcel}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-[13px] shadow-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Kết xuất
            </button>
          </div>
        </div>
      </div>

      {/* Config Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse collection-table text-[13px]">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-[1]">
              <tr>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap w-12 text-[13px]">STT</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Loại nhật ký</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Thời gian lưu trữ</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Mô tả</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Trạng thái</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Cập nhật lần cuối</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap w-24 text-[13px]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredConfigs
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((config, index) => (
                  <tr key={config.id} className="hover:bg-slate-50 transition-all group border-b border-slate-100">
                    <td className="px-4 py-3 text-center text-slate-500 font-medium text-[13px]">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3 text-center text-[13px]">
                      <div className="flex justify-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${getLogTypeColor(config.logType)}`}>
                          {getLogTypeIcon(config.logType)}
                          {config.logTypeName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-[13px] text-slate-900 font-medium">{config.retentionDays} ngày</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-700 text-[13px] max-w-md mx-auto truncate" title={config.description}>
                      {config.description}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          config.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {config.isActive ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {config.isActive ? 'Hoạt động' : 'Tạm dừng'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-[13px]">
                      <div className="font-medium text-slate-900">{config.lastUpdated}</div>
                      <div className="text-slate-500 mt-0.5 text-[11px]">{config.updatedBy}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(config)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                          title="Sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(config)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              {filteredConfigs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500 text-[13px]">
                    Không tìm thấy bản ghi nào phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white sm:px-6 collection-pagination text-[13px]">
          <div className="flex items-center gap-2">
            <span className="text-slate-600">Hiển thị</span>
            <select aria-label="Select record count" 
              className="px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-[13px]"
              title="Số bản ghi trên trang"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-slate-600">bản ghi/trang</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-slate-600">
              {filteredConfigs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredConfigs.length)} / {filteredConfigs.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
              >
                Trước
              </button>
              
              {Array.from({ length: Math.ceil(filteredConfigs.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 border rounded-lg font-medium text-[13px] transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-[#e2e8f0] text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => {
                  const totalPages = Math.ceil(filteredConfigs.length / itemsPerPage);
                  if (currentPage < totalPages) {
                    setCurrentPage(currentPage + 1);
                  }
                }}
                disabled={currentPage === Math.ceil(filteredConfigs.length / itemsPerPage) || filteredConfigs.length === 0}
                className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-slate-900 font-bold text-[15px]">Thêm mới cấu hình</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-[13px]">
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-2">
                  Tên loại nhật ký <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.logTypeName}
                  onChange={(e) => setFormData({...formData, logTypeName: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Nhập tên loại nhật ký..."
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-2">
                  Thời gian lưu trữ (ngày) <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.retentionDays}
                  onChange={(e) => setFormData({...formData, retentionDays: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Nhập số ngày..."
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-2">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Nhập mô tả..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <label htmlFor="isActive" className="text-[13px] font-medium text-slate-700 cursor-pointer">Kích hoạt</label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-[13px] font-medium"
              >
                Hủy
              </button>
              <button
                onClick={confirmAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors text-[13px] font-medium"
              >
                <Save className="w-4 h-4" />
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedConfig && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowEditModal(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-slate-900 font-bold text-[15px]">Sửa cấu hình</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-[13px]">
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-2">
                  Tên loại nhật ký <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.logTypeName}
                  onChange={(e) => setFormData({...formData, logTypeName: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Nhập tên loại nhật ký..."
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-2">
                  Thời gian lưu trữ (ngày) <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.retentionDays}
                  onChange={(e) => setFormData({...formData, retentionDays: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Nhập số ngày..."
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-2">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Nhập mô tả..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActiveEdit"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <label htmlFor="isActiveEdit" className="text-[13px] font-medium text-slate-700 cursor-pointer">Kích hoạt</label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-[13px] font-medium"
              >
                Hủy
              </button>
              <button
                onClick={confirmEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors text-[13px] font-medium"
              >
                <Save className="w-4 h-4" />
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedConfig && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowDeleteConfirm(false);
            setSelectedConfig(null);
          }}
        >
          <div 
            className="bg-white rounded-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-center text-slate-900 font-bold text-[15px] mb-2">Xác nhận xóa</h3>
              <p className="text-center text-slate-600 text-[13px] mb-6">
                Bạn có chắc chắn muốn xóa cấu hình "{selectedConfig.logTypeName}"?
                <br />Hành động này không thể hoàn tác.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSelectedConfig(null);
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-[13px] font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors text-[13px] font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
