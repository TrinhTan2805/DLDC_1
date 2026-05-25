import { useState } from 'react';
import { Settings, Sliders, GitCompare, Network, Key, Plus, Edit, Trash2, X, Search, Filter, Check, Circle, CheckSquare } from 'lucide-react';
import { AttributesManagementTab } from './AttributesManagementTab';
import { MasterDataWizard } from './MasterDataWizard';
import { MergeRulesManagementTab } from './MergeRulesManagementTab';
import { EntityRelationshipsTab } from './EntityRelationshipsTab';
import { UniqueIdentifierRulesTab } from './UniqueIdentifierRulesTab';
import { ApprovalTab } from './ApprovalTab';

type TabType = 'setup' | 'attributes' | 'merge-rules' | 'relationships' | 'identifier-rules' | 'approval';

type LifecycleStatus = 'active' | 'draft' | 'inactive' | 'archived';
type DataType = 'standard' | 'reference' | 'transactional';
type ScopeType = 'national' | 'ministry' | 'provincial' | 'internal';
type DataSourceType = 'dldc' | 'lgsp' | 'ndxp' | 'manual';
type UpdateStrategyType = 'reference' | 'scheduled' | 'realtime';
type SyncFrequencyType = 'daily' | 'weekly' | 'monthly' | 'event';
type FieldDataType = 'string' | 'number' | 'date' | 'datetime' | 'boolean' | 'text' | 'email' | 'phone' | 'url';

interface MasterDataAttribute {
  id: string;
  fieldName: string;
  displayName: string;
  dataType: FieldDataType;
  length?: number;
  required: boolean;
  unique: boolean;
  indexed: boolean;
  defaultValue?: string;
  description?: string;
  validationRules?: string;
  createdDate: string;
  version: number;
}

interface MasterDataEntity {
  id: string;
  code: string;
  name: string;
  dataType: DataType;
  managingAgency: string;
  scope: ScopeType;
  description: string;
  lifecycleStatus: LifecycleStatus;
  createdDate: string;
  updatedDate: string;
  createdBy: string;
  // Data source fields
  dataSource?: DataSourceType;
  dldcTable?: string;
  dldcColumns?: string[];
  apiSystem?: string;
  apiManagingUnit?: string;
  apiEndpoint?: string;
  apiMethod?: 'GET' | 'POST' | 'PUT';
  updateStrategy?: UpdateStrategyType;
  syncFrequency?: SyncFrequencyType;
}

const defaultEntities: MasterDataEntity[] = [
  {
    id: '1',
    code: 'MD-CITIZEN-001',
    name: 'Bộ dữ liệu chủ Công dân',
    dataType: 'standard',
    managingAgency: 'Cục Hộ tịch - Quốc tịch - Chứng thực',
    scope: 'national',
    description: 'Dữ liệu chuẩn về công dân Việt Nam bao gồm thông tin cá nhân như họ tên, ngày sinh, số CCCD, nơi cư trú theo quy định của Luật CCCD 2023',
    lifecycleStatus: 'active',
    createdDate: '01/01/2024',
    updatedDate: '10/12/2024',
    createdBy: 'Nguyễn Văn A'
  },
  {
    id: '2',
    code: 'MD-ORG-001',
    name: 'Bộ dữ liệu chủ Tổ chức',
    dataType: 'standard',
    managingAgency: 'Cục Đăng ký kinh doanh',
    scope: 'national',
    description: 'Thông tin doanh nghiệp, tổ chức, cơ quan nhà nước bao gồm tên, mã số thuế, địa chỉ, người đại diện',
    lifecycleStatus: 'active',
    createdDate: '15/01/2024',
    updatedDate: '20/11/2024',
    createdBy: 'Trần Thị B'
  },
  {
    id: '3',
    code: 'MD-DOC-001',
    name: 'Bộ dữ liệu chủ Văn bản pháp luật',
    dataType: 'reference',
    managingAgency: 'Bộ Tư pháp',
    scope: 'national',
    description: 'Danh mục văn bản pháp luật, nghị định, thông tư, quyết định',
    lifecycleStatus: 'active',
    createdDate: '10/02/2024',
    updatedDate: '05/12/2024',
    createdBy: 'Lê Văn C'
  },
  {
    id: '4',
    code: 'MD-ADMIN-001',
    name: 'Bộ dữ liệu chủ Đơn vị hành chính',
    dataType: 'reference',
    managingAgency: 'Bộ Nội vụ',
    scope: 'national',
    description: 'Danh mục 63 tỉnh/thành phố, quận/huyện, phường/xã của Việt Nam',
    lifecycleStatus: 'active',
    createdDate: '20/01/2024',
    updatedDate: '15/10/2024',
    createdBy: 'Phạm Thị D'
  },
  {
    id: '5',
    code: 'MD-AGENCY-001',
    name: 'Bộ dữ liệu chủ Cơ quan nhà nước',
    dataType: 'reference',
    managingAgency: 'Bộ Nội vụ',
    scope: 'national',
    description: 'Danh sách các cơ quan nhà nước, bộ, ngành, sở, ban',
    lifecycleStatus: 'draft',
    createdDate: '01/03/2024',
    updatedDate: '18/12/2024',
    createdBy: 'Hoàng Văn E'
  }
];

const dataTypeLabels: Record<DataType, string> = {
  standard: 'Dữ liệu chuẩn',
  reference: 'Dữ liệu tham chiếu',
  transactional: 'Dữ liệu giao dịch'
};

const scopeLabels: Record<ScopeType, string> = {
  national: 'Cấp quốc gia',
  ministry: 'Cấp bộ',
  provincial: 'Cấp tỉnh/thành',
  internal: 'Nội bộ'
};

const lifecycleLabels: Record<LifecycleStatus, { label: string; color: string }> = {
  active: { label: 'Đã hiệu lực', color: 'bg-green-100 text-green-700' },
  draft: { label: 'Đang soạn thảo', color: 'bg-yellow-100 text-yellow-700' },
  inactive: { label: 'Ngừng sử dụng', color: 'bg-red-100 text-red-700' },
  archived: { label: 'Đã lưu trữ', color: 'bg-slate-100 text-slate-700' }
};

export function MasterDataScaleManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>('setup');
  const [entities, setEntities] = useState<MasterDataEntity[]>(defaultEntities);
  const [showForm, setShowForm] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [editingEntity, setEditingEntity] = useState<MasterDataEntity | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<LifecycleStatus | 'all'>('all');

  const [formData, setFormData] = useState<Partial<MasterDataEntity>>({
    name: '',
    dataType: 'standard',
    managingAgency: '',
    scope: 'national',
    description: '',
    lifecycleStatus: 'draft'
  });

  const generateCode = (type: string) => {
    const prefix = type === 'standard' ? 'MD-STD-' : type === 'reference' ? 'MD-REF-' : 'MD-TRX-';
    const maxNum = entities
      .filter(e => e.code.startsWith(prefix))
      .map(e => parseInt(e.code.split('-')[2]))
      .reduce((max, num) => Math.max(max, num), 0);
    return `${prefix}${String(maxNum + 1).padStart(3, '0')}`;
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.managingAgency) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

    if (editingEntity) {
      // Update existing
      setEntities(entities.map(e =>
        e.id === editingEntity.id
          ? {
            ...e,
            ...formData as MasterDataEntity,
            updatedDate: dateStr
          }
          : e
      ));
    } else {
      // Create new
      const newEntity: MasterDataEntity = {
        id: String(entities.length + 1),
        code: generateCode(formData.dataType || 'standard'),
        name: formData.name!,
        dataType: formData.dataType!,
        managingAgency: formData.managingAgency!,
        scope: formData.scope!,
        description: formData.description || '',
        lifecycleStatus: formData.lifecycleStatus!,
        createdDate: dateStr,
        updatedDate: dateStr,
        createdBy: 'Người dùng hiện tại'
      };
      setEntities([...entities, newEntity]);
    }

    handleCloseForm();
  };

  const handleEdit = (entity: MasterDataEntity) => {
    setEditingEntity(entity);
    setFormData(entity);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa thực thể này?')) {
      setEntities(entities.filter(e => e.id !== id));
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEntity(null);
    setFormData({
      name: '',
      dataType: 'standard',
      managingAgency: '',
      scope: 'national',
      description: '',
      lifecycleStatus: 'draft'
    });
  };

  const filteredEntities = entities.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || e.lifecycleStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto">
          <button title="Nút bấm"
            onClick={() => setActiveTab('setup')}
            className={`flex items-center gap-2 px-6 py-3 text-sm transition-colors whitespace-nowrap ${activeTab === 'setup'
              ? 'bg-white text-slate-900 border-b-2 border-slate-900'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <Settings className="w-4 h-4" />
            Thiết lập DL chủ
          </button>
          <button title="Nút bấm"
            onClick={() => setActiveTab('attributes')}
            className={`flex items-center gap-2 px-6 py-3 text-sm transition-colors whitespace-nowrap ${activeTab === 'attributes'
              ? 'bg-white text-slate-900 border-b-2 border-slate-900'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <Sliders className="w-4 h-4" />
            Thiết lập thuộc tính
          </button>
          <button title="Nút bấm"
            onClick={() => setActiveTab('merge-rules')}
            className={`flex items-center gap-2 px-6 py-3 text-sm transition-colors whitespace-nowrap ${activeTab === 'merge-rules'
              ? 'bg-white text-slate-900 border-b-2 border-slate-900'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <GitCompare className="w-4 h-4" />
            Thiết lập quy tắc hợp nhất
          </button>
          <button title="Nút bấm"
            onClick={() => setActiveTab('relationships')}
            className={`flex items-center gap-2 px-6 py-3 text-sm transition-colors whitespace-nowrap ${activeTab === 'relationships'
              ? 'bg-white text-slate-900 border-b-2 border-slate-900'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <Network className="w-4 h-4" />
            Thiết lập quan hệ thực thể
          </button>
          <button title="Nút bấm"
            onClick={() => setActiveTab('identifier-rules')}
            className={`flex items-center gap-2 px-6 py-3 text-sm transition-colors whitespace-nowrap ${activeTab === 'identifier-rules'
              ? 'bg-white text-slate-900 border-b-2 border-slate-900'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <Key className="w-4 h-4" />
            Quy tắc định danh duy nhất
          </button>
          <button title="Nút bấm"
            onClick={() => setActiveTab('approval')}
            className={`flex items-center gap-2 px-6 py-3 text-sm transition-colors whitespace-nowrap ${activeTab === 'approval'
              ? 'bg-white text-slate-900 border-b-2 border-slate-900'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <CheckSquare className="w-4 h-4" />
            Phê duyệt
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'setup' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-slate-900">Thiết lập dữ liệu chủ</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Quản lý các thực thể dữ liệu chủ trong hệ thống
                  </p>
                </div>
                <div className="flex gap-2">
                  <button title="Nút bấm"
                    onClick={() => setShowWizard(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Tạo mới (Wizard 5 bước)
                  </button>
                  <button title="Nút bấm"
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm mới nhanh
                  </button>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input title="Dữ liệu"
                    type="text"
                    placeholder="Tìm kiếm theo tên hoặc mã..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-600" />
                  <select title="Lựa chọn"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as LifecycleStatus | 'all')}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="active">Đã hiệu lực</option>
                    <option value="draft">Đang soạn thảo</option>
                    <option value="inactive">Ngừng sử dụng</option>
                    <option value="archived">Đã lưu trữ</option>
                  </select>
                </div>
              </div>

              {/* Entity List */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm text-slate-700">Mã</th>
                      <th className="text-left px-4 py-3 text-sm text-slate-700">Tên dữ liệu chủ</th>
                      <th className="text-left px-4 py-3 text-sm text-slate-700">Loại dữ liệu</th>
                      <th className="text-left px-4 py-3 text-sm text-slate-700">Cơ quan quản lý</th>
                      <th className="text-left px-4 py-3 text-sm text-slate-700">Trạng thái</th>
                      <th className="text-left px-4 py-3 text-sm text-slate-700">Cập nhật</th>
                      <th className="text-right px-4 py-3 text-sm text-slate-700">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEntities.map((entity) => (
                      <tr key={entity.id} className="border-t border-slate-200 hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-900">{entity.code}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{entity.name}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{dataTypeLabels[entity.dataType]}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{entity.managingAgency}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${lifecycleLabels[entity.lifecycleStatus].color}`}>
                            {lifecycleLabels[entity.lifecycleStatus].label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{entity.updatedDate}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button title="Nút bấm"
                              onClick={() => handleEdit(entity)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button title="Nút bấm"
                              onClick={() => handleDelete(entity.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Form Modal */}
              {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between p-6 border-b border-slate-200">
                      <h3 className="text-lg text-slate-900">
                        {editingEntity ? 'Chỉnh sửa thực thể dữ liệu chủ' : 'Thêm mới thực thể dữ liệu chủ'}
                      </h3>
                      <button title="Nút bấm" onClick={handleCloseForm} className="p-1 hover:bg-slate-100 rounded">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-6 space-y-4">
                      {/* Code (auto-generated) */}
                      {editingEntity && (
                        <div>
                          <label className="block text-sm text-slate-700 mb-1">
                            Mã dữ liệu chủ <span className="text-slate-500">(chi tiết)</span>
                          </label>
                          <input title="Dữ liệu"
                            type="text"
                            value={editingEntity.code}
                            disabled
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500"
                          />
                        </div>
                      )}

                      {/* Name */}
                      <div>
                        <label className="block text-sm text-slate-700 mb-1">
                          Tên dữ liệu chủ <span className="text-red-600">*</span>
                        </label>
                        <input title="Dữ liệu"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="VD: Bộ dữ liệu chủ Công dân"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Data Type */}
                      <div>
                        <label className="block text-sm text-slate-700 mb-1">
                          Loại dữ liệu <span className="text-red-600">*</span>
                        </label>
                        <select title="Lựa chọn"
                          value={formData.dataType}
                          onChange={(e) => setFormData({ ...formData, dataType: e.target.value as DataType })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="standard">Dữ liệu chuẩn</option>
                          <option value="reference">Dữ liệu tham chiếu</option>
                          <option value="transactional">Dữ liệu giao dịch</option>
                        </select>
                      </div>

                      {/* Managing Agency */}
                      <div>
                        <label className="block text-sm text-slate-700 mb-1">
                          Cơ quan quản lý <span className="text-red-600">*</span>
                        </label>
                        <input title="Dữ liệu"
                          type="text"
                          value={formData.managingAgency}
                          onChange={(e) => setFormData({ ...formData, managingAgency: e.target.value })}
                          placeholder="VD: Cục Hộ tịch - Quốc tịch - Chứng thực"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Scope */}
                      <div>
                        <label className="block text-sm text-slate-700 mb-1">
                          Phạm vi sử dụng <span className="text-red-600">*</span>
                        </label>
                        <select title="Lựa chọn"
                          value={formData.scope}
                          onChange={(e) => setFormData({ ...formData, scope: e.target.value as ScopeType })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="national">Cấp quốc gia</option>
                          <option value="ministry">Cấp bộ</option>
                          <option value="provincial">Cấp tỉnh/thành</option>
                          <option value="internal">Nội bộ</option>
                        </select>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm text-slate-700 mb-1">Mô tả</label>
                        <textarea title="Dữ liệu"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Dữ liệu chuẩn về công dân Việt Nam bao gồm thông tin cá nhân như họ tên, ngày sinh, số CCCD, nơi cư trú theo quy định của Luật CCCD 2023"
                          rows={4}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Lifecycle Status */}
                      <div>
                        <label className="block text-sm text-slate-700 mb-1">
                          Trạng thái vòng đời <span className="text-slate-500">(chi tiết)</span>
                        </label>
                        <select title="Lựa chọn"
                          value={formData.lifecycleStatus}
                          onChange={(e) => setFormData({ ...formData, lifecycleStatus: e.target.value as LifecycleStatus })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="draft">Đang soạn thảo</option>
                          <option value="active">Đã hiệu lực</option>
                          <option value="inactive">Ngừng sử dụng</option>
                          <option value="archived">Đã lưu trữ</option>
                        </select>
                      </div>

                      {/* SECTION: Data Source Configuration */}
                      <div className="pt-4 border-t border-slate-200">
                        <h4 className="text-sm text-slate-900 mb-3">Cấu hình nguồn dữ liệu</h4>

                        {/* Data Source Type */}
                        <div className="mb-4">
                          <label className="block text-sm text-slate-700 mb-1">
                            Nguồn dữ liệu <span className="text-red-600">*</span>
                          </label>
                          <select title="Lựa chọn"
                            value={formData.dataSource || 'dldc'}
                            onChange={(e) => setFormData({ ...formData, dataSource: e.target.value as DataSourceType })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="dldc">Từ Kho DLDC</option>
                            <option value="lgsp">API qua trục LGSP</option>
                            <option value="ndxp">API qua trục NDXP</option>
                            <option value="manual">Nhập thủ công</option>
                          </select>
                        </div>

                        {/* DLDC Configuration */}
                        {formData.dataSource === 'dldc' && (
                          <div className="space-y-3 bg-blue-50 p-4 rounded-lg">
                            <div>
                              <label className="block text-sm text-slate-700 mb-1">
                                Bảng dữ liệu <span className="text-red-600">*</span>
                              </label>
                              <select title="Lựa chọn"
                                value={formData.dldcTable || ''}
                                onChange={(e) => setFormData({ ...formData, dldcTable: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">-- Chọn bảng --</option>
                                <option value="tbl_citizen">tbl_citizen - Thông tin công dân</option>
                                <option value="tbl_organization">tbl_organization - Thông tin tổ chức</option>
                                <option value="tbl_legal_document">tbl_legal_document - Văn bản pháp luật</option>
                                <option value="tbl_administrative_unit">tbl_administrative_unit - Đơn vị hành chính</option>
                                <option value="tbl_government_agency">tbl_government_agency - Cơ quan nhà nước</option>
                                <option value="tbl_business_registry">tbl_business_registry - Đăng ký kinh doanh</option>
                                <option value="tbl_notary_contract">tbl_notary_contract - Hợp đồng công chứng</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm text-slate-700 mb-1">
                                Cột/Trường dữ liệu <span className="text-slate-500">(chọn nhiều)</span>
                              </label>
                              <div className="border border-slate-300 rounded-lg p-3 bg-white space-y-2 max-h-40 overflow-y-auto">
                                {['id', 'full_name', 'citizen_id', 'date_of_birth', 'address', 'phone_number', 'email', 'created_date', 'updated_date'].map(col => (
                                  <label key={col} className="flex items-center gap-2 text-sm">
                                    <input title="Dữ liệu"
                                      type="checkbox"
                                      checked={formData.dldcColumns?.includes(col) || false}
                                      onChange={(e) => {
                                        const current = formData.dldcColumns || [];
                                        if (e.target.checked) {
                                          setFormData({ ...formData, dldcColumns: [...current, col] });
                                        } else {
                                          setFormData({ ...formData, dldcColumns: current.filter(c => c !== col) });
                                        }
                                      }}
                                      className="rounded"
                                    />
                                    <span className="text-slate-700">{col}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* LGSP Configuration */}
                        {formData.dataSource === 'lgsp' && (
                          <div className="space-y-3 bg-green-50 p-4 rounded-lg">
                            <div>
                              <label className="block text-sm text-slate-700 mb-1">
                                Hệ thống nguồn <span className="text-red-600">*</span>
                              </label>
                              <input title="Dữ liệu"
                                type="text"
                                value={formData.apiSystem || ''}
                                onChange={(e) => setFormData({ ...formData, apiSystem: e.target.value })}
                                placeholder="VD: Hệ thống CCCD - Bộ Công an"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-slate-700 mb-1">
                                Đơn vị quản lý <span className="text-red-600">*</span>
                              </label>
                              <input title="Dữ liệu"
                                type="text"
                                value={formData.apiManagingUnit || ''}
                                onChange={(e) => setFormData({ ...formData, apiManagingUnit: e.target.value })}
                                placeholder="VD: Cục Cảnh sát quản lý hành chính về trật tự xã hội"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-slate-700 mb-1">
                                API Endpoint <span className="text-red-600">*</span>
                              </label>
                              <input title="Dữ liệu"
                                type="text"
                                value={formData.apiEndpoint || ''}
                                onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                                placeholder="VD: https://lgsp.gov.vn/api/v1/citizen/info"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-slate-700 mb-1">
                                Phương thức <span className="text-red-600">*</span>
                              </label>
                              <select title="Lựa chọn"
                                value={formData.apiMethod || 'GET'}
                                onChange={(e) => setFormData({ ...formData, apiMethod: e.target.value as 'GET' | 'POST' | 'PUT' })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {/* NDXP Configuration */}
                        {formData.dataSource === 'ndxp' && (
                          <div className="space-y-3 bg-purple-50 p-4 rounded-lg">
                            <div>
                              <label className="block text-sm text-slate-700 mb-1">
                                Hệ thống nguồn <span className="text-red-600">*</span>
                              </label>
                              <input title="Dữ liệu"
                                type="text"
                                value={formData.apiSystem || ''}
                                onChange={(e) => setFormData({ ...formData, apiSystem: e.target.value })}
                                placeholder="VD: Hệ thống Đăng ký kinh doanh - Bộ Kế hoạch và Đầu tư"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-slate-700 mb-1">
                                Đơn vị quản lý <span className="text-red-600">*</span>
                              </label>
                              <input title="Dữ liệu"
                                type="text"
                                value={formData.apiManagingUnit || ''}
                                onChange={(e) => setFormData({ ...formData, apiManagingUnit: e.target.value })}
                                placeholder="VD: Cục Đăng ký kinh doanh"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-slate-700 mb-1">
                                API Endpoint <span className="text-red-600">*</span>
                              </label>
                              <input title="Dữ liệu"
                                type="text"
                                value={formData.apiEndpoint || ''}
                                onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                                placeholder="VD: https://ndxp.gov.vn/api/v1/business/registry"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-slate-700 mb-1">
                                Phương thức <span className="text-red-600">*</span>
                              </label>
                              <select title="Lựa chọn"
                                value={formData.apiMethod || 'GET'}
                                onChange={(e) => setFormData({ ...formData, apiMethod: e.target.value as 'GET' | 'POST' | 'PUT' })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {/* Manual Entry Note */}
                        {formData.dataSource === 'manual' && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <p className="text-sm text-amber-800">
                              ℹ️ Dữ liệu sẽ được nhập thủ công bởi người dùng có quyền. Không cần cấu hình nguồn tự động.
                            </p>
                          </div>
                        )}

                        {/* Update Strategy */}
                        {formData.dataSource && formData.dataSource !== 'manual' && (
                          <div className="mt-4 pt-4 border-t border-slate-200">
                            <h5 className="text-sm text-slate-900 mb-3">Chiến lược cập nhật</h5>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm text-slate-700 mb-1">
                                  Loại cập nhật <span className="text-red-600">*</span>
                                </label>
                                <select title="Lựa chọn"
                                  value={formData.updateStrategy || 'reference'}
                                  onChange={(e) => setFormData({ ...formData, updateStrategy: e.target.value as UpdateStrategyType })}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="reference">Tham chiếu (Reference)</option>
                                  <option value="scheduled">Cập nhật định kỳ (Scheduled)</option>
                                  <option value="realtime">Thời gian thực (Realtime)</option>
                                </select>
                              </div>

                              {formData.updateStrategy === 'scheduled' && (
                                <div>
                                  <label className="block text-sm text-slate-700 mb-1">
                                    Tần suất đồng bộ <span className="text-red-600">*</span>
                                  </label>
                                  <select title="Lựa chọn"
                                    value={formData.syncFrequency || 'daily'}
                                    onChange={(e) => setFormData({ ...formData, syncFrequency: e.target.value as SyncFrequencyType })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="daily">Hàng ngày</option>
                                    <option value="weekly">Hàng tuần</option>
                                    <option value="monthly">Hàng tháng</option>
                                    <option value="event">Theo sự kiện</option>
                                  </select>
                                </div>
                              )}
                            </div>

                            {/* Strategy Description */}
                            <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-3 rounded">
                              {formData.updateStrategy === 'reference' && (
                                <p>🔗 <strong>Tham chiếu:</strong> Dữ liệu được truy vấn trực tiếp từ nguồn khi cần, không lưu bản sao cục bộ.</p>
                              )}
                              {formData.updateStrategy === 'scheduled' && (
                                <p>🕒 <strong>Cập nhật định kỳ:</strong> Dữ liệu được đồng bộ theo lịch trình cố định từ nguồn và lưu vào Kho DLDC.</p>
                              )}
                              {formData.updateStrategy === 'realtime' && (
                                <p>⚡ <strong>Thời gian thực:</strong> Dữ liệu được đồng bộ ngay lập tức khi có thay đổi từ hệ thống nguồn thông qua webhook hoặc event streaming.</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Metadata (if editing) */}
                      {editingEntity && (
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                          <div>
                            <label className="block text-sm text-slate-700 mb-1">
                              Ngày tạo <span className="text-slate-500">(chi tiết)</span>
                            </label>
                            <input title="Dữ liệu"
                              type="text"
                              value={editingEntity.createdDate}
                              disabled
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-slate-700 mb-1">
                              Cập nhật lần cuối <span className="text-slate-500">(chi tiết)</span>
                            </label>
                            <input title="Dữ liệu"
                              type="text"
                              value={editingEntity.updatedDate}
                              disabled
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-sm text-slate-700 mb-1">
                              Người tạo <span className="text-slate-500">(chi tiết)</span>
                            </label>
                            <input title="Dữ liệu"
                              type="text"
                              value={editingEntity.createdBy}
                              disabled
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                      <button
                        onClick={handleCloseForm}
                        className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {editingEntity ? 'Cập nhật' : 'Tạo mới'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'attributes' && (
            <AttributesManagementTab />
          )}

          {activeTab === 'merge-rules' && (
            <MergeRulesManagementTab />
          )}

          {activeTab === 'relationships' && (
            <EntityRelationshipsTab />
          )}

          {activeTab === 'identifier-rules' && (
            <UniqueIdentifierRulesTab />
          )}

          {activeTab === 'approval' && (
            <ApprovalTab />
          )}
        </div>
      </div>

      {/* Wizard Modal */}
      <MasterDataWizard
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        onSubmit={(wizardData) => {
          const now = new Date();
          const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

          const newEntity: MasterDataEntity = {
            id: String(entities.length + 1),
            code: generateCode(wizardData.dataType),
            name: wizardData.name,
            dataType: wizardData.dataType,
            managingAgency: wizardData.managingAgency,
            scope: wizardData.scope,
            description: wizardData.description,
            lifecycleStatus: 'draft', // Always draft when created via wizard
            createdDate: dateStr,
            updatedDate: dateStr,
            createdBy: 'Người dùng hiện tại',
            dataSource: wizardData.dataSource,
            dldcTable: wizardData.dldcTable,
            dldcColumns: wizardData.dldcColumns,
            apiSystem: wizardData.apiSystem,
            apiManagingUnit: wizardData.apiManagingUnit,
            apiEndpoint: wizardData.apiEndpoint,
            apiMethod: wizardData.apiMethod,
            updateStrategy: wizardData.updateStrategy,
            syncFrequency: wizardData.syncFrequency
          };

          setEntities([...entities, newEntity]);
          setShowWizard(false);
          alert(`✅ Tạo thành công "${wizardData.name}" với ${wizardData.attributes.length} thuộc tính!\\n\\nĐã gửi yêu cầu phê duyệt.`);
        }}
      />
    </div>
  );
}