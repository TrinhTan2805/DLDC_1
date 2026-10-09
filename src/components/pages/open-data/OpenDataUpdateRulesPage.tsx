import { useState } from 'react';
import { Plus, Search, Eye, Edit, Trash2, X, Save, Play, Clock, RefreshCw, CheckCircle, XCircle, AlertCircle, Mail, Database, Settings, Calendar, FileText, Download, Copy } from 'lucide-react';

interface UpdateRule {
  id: string;
  code: string;
  name: string;
  catalogName: string;
  sourceTable: string;
  updateType: 'auto' | 'manual' | 'event';
  frequency: string;
  lastRun: string;
  nextRun: string;
  status: 'active' | 'inactive' | 'error';
  successRate: string;
}

const mockRules: UpdateRule[] = [
  {
    id: '1',
    code: 'RULE_001',
    name: 'Cập nhật văn bản pháp luật',
    catalogName: 'Văn bản pháp luật',
    sourceTable: 'van_ban_phap_luat',
    updateType: 'auto',
    frequency: 'Hàng ngày lúc 00:00',
    lastRun: '31/12/2024 00:00',
    nextRun: '01/01/2025 00:00',
    status: 'active',
    successRate: '98.5%'
  },
  {
    id: '2',
    code: 'RULE_002',
    name: 'Cập nhật dữ liệu công chứng',
    catalogName: 'Công chứng',
    sourceTable: 'cong_chung',
    updateType: 'auto',
    frequency: 'Hàng tuần (Thứ 2 - 08:00)',
    lastRun: '30/12/2024 08:00',
    nextRun: '06/01/2025 08:00',
    status: 'active',
    successRate: '100%'
  },
  {
    id: '3',
    code: 'RULE_003',
    name: 'Cập nhật đăng ký kinh doanh',
    catalogName: 'Đăng ký kinh doanh',
    sourceTable: 'dang_ky_kinh_doanh',
    updateType: 'manual',
    frequency: 'Thủ công',
    lastRun: '28/12/2024 14:30',
    nextRun: '-',
    status: 'inactive',
    successRate: '95.2%'
  },
];

interface OpenDataUpdateRulesPageProps {
  onNavigate?: (page: string) => void;
}

export function OpenDataUpdateRulesPage({ onNavigate }: OpenDataUpdateRulesPageProps) {
  const [rules, setRules] = useState<UpdateRule[]>(mockRules);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<UpdateRule | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    catalogId: '',
    sourceTable: '',
    selectedFields: [] as string[],
    filterCondition: '',
    updateType: 'auto' as 'auto' | 'manual' | 'event',
    frequencyType: 'daily' as 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly',
    frequencyValue: {
      hour: '00',
      minute: '00',
      dayOfWeek: '1',
      dayOfMonth: '1',
      month: '1'
    },
    startDate: '',
    endDate: '',
    formats: [] as string[],
    encoding: 'UTF-8',
    compression: false,
    recordLimit: '',
    versionPolicy: 'keep-latest' as 'keep-all' | 'keep-latest' | 'keep-days',
    versionCount: '10',
    versionDays: '30',
    updatePolicy: 'overwrite' as 'overwrite' | 'versioning' | 'compare',
    notifyOnSuccess: false,
    notifyOnFailure: true,
    notifyOnChange: false,
    emailList: [] as string[],
    newEmail: '',
    errorHandling: 'retry' as 'retry' | 'skip' | 'stop',
    retryCount: '3',
    retryInterval: '10',
    accessLevel: 'public' as 'public' | 'internal' | 'restricted',
    approverId: ''
  });

  // Mock data - Chỉ danh mục đã phê duyệt
  const mockCatalogs = [
    { id: 'cat1', name: 'Danh mục văn bản pháp luật', status: 'approved', approver: 'Nguyễn Văn A' },
    { id: 'cat2', name: 'Danh mục đăng ký kinh doanh', status: 'approved', approver: 'Trần Thị B' },
    { id: 'cat3', name: 'Quy tắc cập nhật công chứng', status: 'approved', approver: 'Lê Văn C' },
    { id: 'cat4', name: 'Trợ giúp pháp lý', status: 'pending', approver: '' }, // Chưa phê duyệt - sẽ bị lọc
    { id: 'cat5', name: 'Hộ tịch', status: 'approved', approver: 'Nguyễn Văn A' },
  ];

  // Chỉ hiển thị danh mục đã phê duyệt
  const approvedCatalogs = mockCatalogs.filter(cat => cat.status === 'approved');

  const mockTables = [
    { id: 'tb1', name: 'van_ban_phap_luat', displayName: 'Văn bản pháp luật' },
    { id: 'tb2', name: 'dang_ky_kinh_doanh', displayName: 'Đăng ký kinh doanh' },
    { id: 'tb3', name: 'cong_chung', displayName: 'Công chứng' },
    { id: 'tb4', name: 'tro_giup_phap_ly', displayName: 'Trợ giúp pháp lý' },
    { id: 'tb5', name: 'ho_tich', displayName: 'Hộ tịch' },
  ];

  const mockTableFields: { [key: string]: string[] } = {
    'tb1': ['ma_van_ban', 'ten_van_ban', 'loai_van_ban', 'co_quan_ban_hanh', 'ngay_ban_hanh', 'ngay_hieu_luc', 'trang_thai'],
    'tb2': ['ma_doanh_nghiep', 'ten_doanh_nghiep', 'dia_chi', 'nguoi_dai_dien', 'ngay_dang_ky', 'von_dieu_le', 'trang_thai'],
    'tb3': ['ma_giao_dich', 'loai_hop_dong', 'to_chuc_cong_chung', 'ngay_cong_chung', 'ben_a', 'ben_b'],
    'tb4': ['ma_ho_so', 'ho_ten', 'cccd', 'loai_ho_tro', 'ngay_tiep_nhan', 'trang_thai'],
    'tb5': ['ma_khai_sinh', 'ho_ten', 'ngay_sinh', 'gioi_tinh', 'noi_sinh', 'ho_ten_cha', 'ho_ten_me'],
  };

  const mockApprovers = [
    { id: '1', name: 'Nguyễn Văn A', position: 'Trưởng phòng' },
    { id: '2', name: 'Trần Thị B', position: 'Phó Giám đốc' },
    { id: '3', name: 'Lê Văn C', position: 'Giám đốc' },
  ];

  const mockHistory = [
    { id: '1', time: '31/12/2024 00:00', status: 'success', records: '1,245', duration: '2.3s', message: 'Cập nhật thành công' },
    { id: '2', time: '30/12/2024 00:00', status: 'success', records: '1,198', duration: '2.1s', message: 'Cập nhật thành công' },
    { id: '3', time: '29/12/2024 00:00', status: 'error', records: '0', duration: '0.5s', message: 'Lỗi kết nối database' },
    { id: '4', time: '28/12/2024 00:00', status: 'success', records: '1,256', duration: '2.4s', message: 'Cập nhật thành công' },
  ];

  const filteredRules = rules.filter(rule =>
    rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setFormData({
      code: `RULE_${String(rules.length + 1).padStart(3, '0')}`,
      name: '',
      description: '',
      catalogId: '',
      sourceTable: '',
      selectedFields: [],
      filterCondition: '',
      updateType: 'auto',
      frequencyType: 'daily',
      frequencyValue: {
        hour: '00',
        minute: '00',
        dayOfWeek: '1',
        dayOfMonth: '1',
        month: '1'
      },
      startDate: '',
      endDate: '',
      formats: ['JSON'],
      encoding: 'UTF-8',
      compression: false,
      recordLimit: '',
      versionPolicy: 'keep-latest',
      versionCount: '10',
      versionDays: '30',
      updatePolicy: 'overwrite',
      notifyOnSuccess: false,
      notifyOnFailure: true,
      notifyOnChange: false,
      emailList: [],
      newEmail: '',
      errorHandling: 'retry',
      retryCount: '3',
      retryInterval: '10',
      accessLevel: 'public',
      approverId: ''
    });
    setShowAddModal(true);
  };

  const handleSaveDraft = () => {
    alert('Đã Lưu quy tắc');
    setShowAddModal(false);
  };

  const handleSaveAndActivate = () => {
    alert('Đã lưu và kích hoạt quy tắc');
    setShowAddModal(false);
  };

  const handleRunNow = (rule: UpdateRule) => {
    alert(`Đang chạy quy tắc: ${rule.name}`);
  };

  const handlePreview = () => {
    alert('Xem trước dữ liệu sẽ được cập nhật');
  };

  const handleAddEmail = () => {
    if (formData.newEmail && !formData.emailList.includes(formData.newEmail)) {
      setFormData({
        ...formData,
        emailList: [...formData.emailList, formData.newEmail],
        newEmail: ''
      });
    }
  };

  const handleRemoveEmail = (email: string) => {
    setFormData({
      ...formData,
      emailList: formData.emailList.filter(e => e !== email)
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs">Hoạt động</span>;
      case 'inactive':
        return <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">Tạm dừng</span>;
      case 'error':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Lỗi</span>;
      default:
        return null;
    }
  };

  const getUpdateTypeBadge = (type: string) => {
    switch (type) {
      case 'auto':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Tự động</span>;
      case 'manual':
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs flex items-center gap-1"><Settings className="w-3 h-3" /> Thủ công</span>;
      case 'event':
        return <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> Sự kiện</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-slate-900">Thiết lập quy tắc cập nhật dữ liệu mở</h1>
            <p className="text-sm text-slate-600 mt-1">Quản lý quy tắc tự động đồng bộ dữ liệu từ nguồn vào danh mục dữ liệu mở</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Thêm quy tắc mới
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Tổng quy tắc</p>
                <p className="text-2xl text-slate-900 mt-1">12</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Đang hoạt động</p>
                <p className="text-2xl text-emerald-600 mt-1">8</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Tạm dừng</p>
                <p className="text-2xl text-slate-600 mt-1">3</p>
              </div>
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-slate-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Lỗi</p>
                <p className="text-2xl text-red-600 mt-1">1</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc mã quy tắc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Rules Table */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-slate-700">Mã quy tắc</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-700">Tên quy tắc</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-700">Danh mục</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-700">Bảng nguồn</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-700">Loại cập nhật</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-700">Tần suất</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-700">Lần chạy cuối</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-700">Lần chạy tiếp</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-700">Tỷ lệ thành công</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-700">Trạng thái</th>
                  <th className="px-4 py-3 text-center text-xs text-slate-700">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900">{rule.code}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{rule.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{rule.catalogName}</td>
                    <td className="px-4 py-3 text-sm">
                      <code className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">{rule.sourceTable}</code>
                    </td>
                    <td className="px-4 py-3">{getUpdateTypeBadge(rule.updateType)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{rule.frequency}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{rule.lastRun}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{rule.nextRun}</td>
                    <td className="px-4 py-3 text-sm text-emerald-600">{rule.successRate}</td>
                    <td className="px-4 py-3">{getStatusBadge(rule.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {rule.updateType === 'auto' && rule.status === 'active' && (
                          <button
                            onClick={() => handleRunNow(rule)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Chạy ngay"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedRule(rule);
                            setShowHistoryModal(true);
                          }}
                          className="p-1 text-slate-600 hover:bg-slate-100 rounded"
                          title="Lịch sử chạy"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRule(rule);
                            setShowViewModal(true);
                          }}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Sửa">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-red-600 hover:bg-red-50 rounded" title="Xóa">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg text-slate-900">Thêm quy tắc cập nhật mới</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* 1. Thông tin cơ bản */}
                <div>
                  <h4 className="text-sm text-slate-900 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    📌 Thông tin cơ bản
                  </h4>
                  <div className="space-y-4 pl-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-slate-700 mb-2">Mã quy tắc *</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                            placeholder="RULE_001"
                          />
                          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg" title="Tự động tạo">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-700 mb-2">Tên quy tắc *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                          placeholder="Nhập tên quy tắc"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-700 mb-2">Mô tả</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                        rows={2}
                        placeholder="Nhập mô tả quy tắc"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-700 mb-2">Chọn danh mục dữ liệu mở *</label>
                      <select
                        value={formData.catalogId}
                        onChange={(e) => setFormData({ ...formData, catalogId: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="" disabled hidden>-- Chọn danh mục --</option>
                        {approvedCatalogs.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Nguồn dữ liệu */}
                <div className="border-t border-slate-200 pt-6">
                  <h4 className="text-sm text-slate-900 mb-3 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    🗂️ Nguồn dữ liệu
                  </h4>
                  <div className="space-y-4 pl-6">
                    <div>
                      <label className="block text-sm text-slate-700 mb-2">Chọn bảng nguồn *</label>
                      <select
                        value={formData.sourceTable}
                        onChange={(e) => setFormData({ ...formData, sourceTable: e.target.value, selectedFields: [] })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="" disabled hidden>-- Chọn bảng dữ liệu --</option>
                        {mockTables.map((table) => (
                          <option key={table.id} value={table.id}>
                            {table.displayName} ({table.name})
                          </option>
                        ))}
                      </select>
                    </div>

                    {formData.sourceTable && (
                      <div>
                        <label className="block text-sm text-slate-700 mb-2">
                          Chọn các trường cần đồng bộ *
                          <span className="ml-2 text-xs text-slate-500">
                            ({formData.selectedFields.length} trường đã chọn)
                          </span>
                        </label>
                        <div className="border border-slate-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                          <div className="grid grid-cols-2 gap-2">
                            {mockTableFields[formData.sourceTable]?.map((field) => (
                              <label key={field} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={formData.selectedFields.includes(field)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setFormData({ ...formData, selectedFields: [...formData.selectedFields, field] });
                                    } else {
                                      setFormData({ ...formData, selectedFields: formData.selectedFields.filter(f => f !== field) });
                                    }
                                  }}
                                />
                                <code className="text-xs text-slate-700">{field}</code>
                              </label>
                            ))}
                          </div>
                          <div className="border-t border-slate-200 mt-2 pt-2 flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const allFields = mockTableFields[formData.sourceTable] || [];
                                setFormData({ ...formData, selectedFields: allFields });
                              }}
                              className="text-xs text-emerald-600 hover:text-emerald-700 px-2 py-1 hover:bg-emerald-50 rounded"
                            >
                              Chọn tất cả
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, selectedFields: [] })}
                              className="text-xs text-slate-600 hover:text-slate-700 px-2 py-1 hover:bg-slate-50 rounded"
                            >
                              Bỏ chọn tất cả
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm text-slate-700 mb-2">Điều kiện lọc (WHERE clause)</label>
                      <input
                        type="text"
                        value={formData.filterCondition}
                        onChange={(e) => setFormData({ ...formData, filterCondition: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-emerald-500"
                        placeholder="trang_thai = 'active' AND ngay_ban_hanh >= '2024-01-01'"
                      />
                      <p className="text-xs text-slate-500 mt-1">Để trống nếu muốn lấy tất cả dữ liệu</p>
                    </div>
                  </div>
                </div>

                {/* 3. Tần suất cập nhật */}
                <div className="border-t border-slate-200 pt-6">
                  <h4 className="text-sm text-slate-900 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    ⏰ Tần suất cập nhật
                  </h4>
                  <div className="space-y-4 pl-6">
                    <div>
                      <label className="block text-sm text-slate-700 mb-2">Loại cập nhật *</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={formData.updateType === 'auto'}
                            onChange={() => setFormData({ ...formData, updateType: 'auto' })}
                          />
                          <span className="text-sm text-slate-700">Tự động</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={formData.updateType === 'manual'}
                            onChange={() => setFormData({ ...formData, updateType: 'manual' })}
                          />
                          <span className="text-sm text-slate-700">Thủ công</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={formData.updateType === 'event'}
                            onChange={() => setFormData({ ...formData, updateType: 'event' })}
                          />
                          <span className="text-sm text-slate-700">Theo sự kiện</span>
                        </label>
                      </div>
                    </div>

                    {formData.updateType === 'auto' && (
                      <>
                        <div>
                          <label className="block text-sm text-slate-700 mb-2">Tần suất *</label>
                          <select
                            value={formData.frequencyType}
                            onChange={(e) => setFormData({ ...formData, frequencyType: e.target.value as any })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="hourly">Theo giờ</option>
                            <option value="daily">Hàng ngày</option>
                            <option value="weekly">Hàng tuần</option>
                            <option value="monthly">Hàng tháng</option>
                            <option value="quarterly">Hàng quý</option>
                            <option value="yearly">Hàng năm</option>
                          </select>
                        </div>

                        {formData.frequencyType === 'hourly' && (
                          <div>
                            <label className="block text-sm text-slate-700 mb-2">Mỗi bao nhiêu giờ *</label>
                            <select
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                            >
                              <option value="1">Mỗi 1 giờ</option>
                              <option value="2">Mỗi 2 giờ</option>
                              <option value="3">Mỗi 3 giờ</option>
                              <option value="6">Mỗi 6 giờ</option>
                              <option value="12">Mỗi 12 giờ</option>
                            </select>
                          </div>
                        )}

                        {formData.frequencyType === 'daily' && (
                          <div>
                            <label className="block text-sm text-slate-700 mb-2">Thời gian chạy *</label>
                            <div className="flex gap-2">
                              <select
                                value={formData.frequencyValue.hour}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  frequencyValue: { ...formData.frequencyValue, hour: e.target.value }
                                })}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                              >
                                {Array.from({ length: 24 }, (_, i) => (
                                  <option key={i} value={String(i).padStart(2, '0')}>
                                    {String(i).padStart(2, '0')}:00
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}

                        {formData.frequencyType === 'weekly' && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm text-slate-700 mb-2">Thứ *</label>
                              <select
                                value={formData.frequencyValue.dayOfWeek}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  frequencyValue: { ...formData.frequencyValue, dayOfWeek: e.target.value }
                                })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                              >
                                <option value="1">Thứ 2</option>
                                <option value="2">Thứ 3</option>
                                <option value="3">Thứ 4</option>
                                <option value="4">Thứ 5</option>
                                <option value="5">Thứ 6</option>
                                <option value="6">Thứ 7</option>
                                <option value="0">Chủ nhật</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm text-slate-700 mb-2">Giờ *</label>
                              <select
                                value={formData.frequencyValue.hour}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  frequencyValue: { ...formData.frequencyValue, hour: e.target.value }
                                })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                              >
                                {Array.from({ length: 24 }, (_, i) => (
                                  <option key={i} value={String(i).padStart(2, '0')}>
                                    {String(i).padStart(2, '0')}:00
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}

                        {formData.frequencyType === 'monthly' && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm text-slate-700 mb-2">Ngày *</label>
                              <select
                                value={formData.frequencyValue.dayOfMonth}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  frequencyValue: { ...formData.frequencyValue, dayOfMonth: e.target.value }
                                })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                              >
                                {Array.from({ length: 31 }, (_, i) => (
                                  <option key={i + 1} value={String(i + 1)}>
                                    Ngày {i + 1}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm text-slate-700 mb-2">Giờ *</label>
                              <select
                                value={formData.frequencyValue.hour}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  frequencyValue: { ...formData.frequencyValue, hour: e.target.value }
                                })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                              >
                                {Array.from({ length: 24 }, (_, i) => (
                                  <option key={i} value={String(i).padStart(2, '0')}>
                                    {String(i).padStart(2, '0')}:00
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-slate-700 mb-2">Thời gian bắt đầu *</label>
                            <input
                              type="date"
                              value={formData.startDate}
                              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-slate-700 mb-2">Thời gian kết thúc (tùy chọn)</label>
                            <input
                              type="date"
                              value={formData.endDate}
                              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* 4. Format & Phiên bản */}
                <div className="border-t border-slate-200 pt-6">
                  <h4 className="text-sm text-slate-900 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    📤 Format & Phiên bản
                  </h4>
                  <div className="space-y-4 pl-6">
                    <div>
                      <label className="block text-sm text-slate-700 mb-2">Định dạng đầu ra *</label>
                      <div className="flex flex-wrap gap-3">
                        {['JSON', 'XML', 'CSV', 'Excel'].map((format) => (
                          <label key={format} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.formats.includes(format)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({ ...formData, formats: [...formData.formats, format] });
                                } else {
                                  setFormData({ ...formData, formats: formData.formats.filter(f => f !== format) });
                                }
                              }}
                            />
                            <span className="text-sm text-slate-700">{format}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-slate-700 mb-2">Mã hóa *</label>
                        <select
                          value={formData.encoding}
                          onChange={(e) => setFormData({ ...formData, encoding: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="UTF-8">UTF-8</option>
                          <option value="UTF-16">UTF-16</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-700 mb-2">Giới hạn số bản ghi (tùy chọn)</label>
                        <input
                          type="number"
                          value={formData.recordLimit}
                          onChange={(e) => setFormData({ ...formData, recordLimit: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                          placeholder="Để trống = không giới hạn"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.compression}
                          onChange={(e) => setFormData({ ...formData, compression: e.target.checked })}
                        />
                        <span className="text-sm text-slate-700">Nén dữ liệu (ZIP)</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm text-slate-700 mb-2">Chính sách phiên bản *</label>
                      <select
                        value={formData.versionPolicy}
                        onChange={(e) => setFormData({ ...formData, versionPolicy: e.target.value as any })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="keep-all">Giữ tất cả phiên bản</option>
                        <option value="keep-latest">Giữ X phiên bản gần nhất</option>
                        <option value="keep-days">Giữ theo thời gian</option>
                      </select>
                    </div>

                    {formData.versionPolicy === 'keep-latest' && (
                      <div>
                        <label className="block text-sm text-slate-700 mb-2">Số phiên bản giữ lại *</label>
                        <select
                          value={formData.versionCount}
                          onChange={(e) => setFormData({ ...formData, versionCount: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="1">1 phiên bản</option>
                          <option value="5">5 phiên bản</option>
                          <option value="10">10 phiên bản</option>
                          <option value="30">30 phiên bản</option>
                        </select>
                      </div>
                    )}

                    {formData.versionPolicy === 'keep-days' && (
                      <div>
                        <label className="block text-sm text-slate-700 mb-2">Giữ trong bao nhiêu ngày *</label>
                        <select
                          value={formData.versionDays}
                          onChange={(e) => setFormData({ ...formData, versionDays: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="7">7 ngày</option>
                          <option value="30">30 ngày</option>
                          <option value="90">90 ngày</option>
                          <option value="180">180 ngày</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm text-slate-700 mb-2">Xử lý khi cập nhật *</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={formData.updatePolicy === 'overwrite'}
                            onChange={() => setFormData({ ...formData, updatePolicy: 'overwrite' })}
                          />
                          <span className="text-sm text-slate-700">Ghi đè (Overwrite)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={formData.updatePolicy === 'versioning'}
                            onChange={() => setFormData({ ...formData, updatePolicy: 'versioning' })}
                          />
                          <span className="text-sm text-slate-700">Tạo phiên bản mới (Versioning)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={formData.updatePolicy === 'compare'}
                            onChange={() => setFormData({ ...formData, updatePolicy: 'compare' })}
                          />
                          <span className="text-sm text-slate-700">Chỉ cập nhật nếu có thay đổi (Compare)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Thông báo */}
                <div className="border-t border-slate-200 pt-6">
                  <h4 className="text-sm text-slate-900 mb-3 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    📧 Thông báo
                  </h4>
                  <div className="space-y-4 pl-6">
                    <div>
                      <label className="block text-sm text-slate-700 mb-2">Gửi thông báo khi:</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.notifyOnSuccess}
                            onChange={(e) => setFormData({ ...formData, notifyOnSuccess: e.target.checked })}
                          />
                          <span className="text-sm text-slate-700">Cập nhật thành công</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.notifyOnFailure}
                            onChange={(e) => setFormData({ ...formData, notifyOnFailure: e.target.checked })}
                          />
                          <span className="text-sm text-slate-700">Cập nhật thất bại</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.notifyOnChange}
                            onChange={(e) => setFormData({ ...formData, notifyOnChange: e.target.checked })}
                          />
                          <span className="text-sm text-slate-700">Có thay đổi dữ liệu</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-slate-700 mb-2">Người nhận thông báo</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="email"
                          value={formData.newEmail}
                          onChange={(e) => setFormData({ ...formData, newEmail: e.target.value })}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddEmail()}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                          placeholder="example@moj.gov.vn"
                        />
                        <button
                          type="button"
                          onClick={handleAddEmail}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm"
                        >
                          + Thêm
                        </button>
                      </div>
                      {formData.emailList.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.emailList.map((email, index) => (
                            <div key={index} className="flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm">
                              <Mail className="w-3 h-3" />
                              <span>{email}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveEmail(email)}
                                className="text-slate-500 hover:text-red-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 6. Xử lý lỗi */}
                <div className="border-t border-slate-200 pt-6">
                  <h4 className="text-sm text-slate-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    ⚠️ Xử lý lỗi
                  </h4>
                  <div className="space-y-4 pl-6">
                    <div>
                      <label className="block text-sm text-slate-700 mb-2">Hành động khi lỗi *</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={formData.errorHandling === 'retry'}
                            onChange={() => setFormData({ ...formData, errorHandling: 'retry' })}
                          />
                          <span className="text-sm text-slate-700">Thử lại (Retry)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={formData.errorHandling === 'skip'}
                            onChange={() => setFormData({ ...formData, errorHandling: 'skip' })}
                          />
                          <span className="text-sm text-slate-700">Bỏ qua (Skip)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={formData.errorHandling === 'stop'}
                            onChange={() => setFormData({ ...formData, errorHandling: 'stop' })}
                          />
                          <span className="text-sm text-slate-700">Dừng và thông báo (Stop & Alert)</span>
                        </label>
                      </div>
                    </div>

                    {formData.errorHandling === 'retry' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-slate-700 mb-2">Số lần thử lại *</label>
                          <select
                            value={formData.retryCount}
                            onChange={(e) => setFormData({ ...formData, retryCount: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="3">3 lần</option>
                            <option value="5">5 lần</option>
                            <option value="10">10 lần</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-slate-700 mb-2">Thời gian chờ (phút) *</label>
                          <select
                            value={formData.retryInterval}
                            onChange={(e) => setFormData({ ...formData, retryInterval: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="5">5 phút</option>
                            <option value="10">10 phút</option>
                            <option value="30">30 phút</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 7. Quyền truy cập */}
                <div className="border-t border-slate-200 pt-6">
                  <h4 className="text-sm text-slate-900 mb-3 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    🔒 Quyền truy cập
                  </h4>
                  <div className="space-y-4 pl-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-slate-700 mb-2">Mức độ công khai *</label>
                        <select
                          value={formData.accessLevel}
                          onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value as any })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="public">Công khai (Public)</option>
                          <option value="internal">Nội bộ (Internal)</option>
                          <option value="restricted">Hạn chế (Restricted)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-700 mb-2">Người phê duyệt *</label>
                        <select
                          value={formData.approverId}
                          onChange={(e) => setFormData({ ...formData, approverId: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="" disabled hidden>-- Chọn người phê duyệt --</option>
                          {mockApprovers.map((approver) => (
                            <option key={approver.id} value={approver.id}>
                              {approver.name} - {approver.position}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
                <button
                  onClick={handlePreview}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <Eye className="w-4 h-4" />
                  Xem trước
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSaveDraft}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100"
                  >
                    <Save className="w-4 h-4" />
                    Lưu
                  </button>
                  <button
                    onClick={handleSaveAndActivate}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Lưu & Kích hoạt
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Modal */}
        {showHistoryModal && selectedRule && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg text-slate-900">Lịch sử chạy - {selectedRule.name}</h3>
                <button onClick={() => setShowHistoryModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {mockHistory.map((item) => (
                    <div key={item.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-slate-500" />
                          <span className="text-sm text-slate-900">{item.time}</span>
                          {item.status === 'success' ? (
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Thành công
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              Lỗi
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-slate-600 hover:bg-slate-100 rounded" title="Tải xuống log">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-slate-600 hover:bg-slate-100 rounded" title="Sao chép">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="pl-7 space-y-1">
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span>Số bản ghi: <span className="text-slate-900">{item.records}</span></span>
                          <span>Thời gian: <span className="text-slate-900">{item.duration}</span></span>
                        </div>
                        <p className="text-sm text-slate-600">{item.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
