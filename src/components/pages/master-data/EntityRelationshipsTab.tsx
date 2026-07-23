import { useState } from 'react';
import { Plus, Edit, Trash2, Save, Network, ArrowRight, Key, Link as LinkIcon, ChevronDown, AlertCircle, Send } from 'lucide-react';
import { BaseModal } from '../../common/BaseModal';

// Tạm ẩn nút Chỉnh sửa/Xóa theo yêu cầu — chỉ ẩn giao diện, không xóa code/luồng xử lý
const SHOW_EDIT_DELETE_ACTIONS = false;

type RelationType = 'one-to-many' | 'many-to-many' | 'one-to-one';
type RelationStatus = 'active' | 'inactive';

interface EntityRelationship {
  id: string;
  sourceEntityId: string;
  sourceEntityName: string;
  targetEntityId: string;
  targetEntityName: string;
  relationType: RelationType;
  foreignKey?: string;
  referencedKey?: string;
  junctionTable?: string;
  junctionSourceKey?: string;
  junctionTargetKey?: string;
  displayField?: string;
  description?: string;
  status: RelationStatus;
  createdDate: string;
}

const mockRelationships: EntityRelationship[] = [
  {
    id: 'rel-1',
    sourceEntityId: '1',
    sourceEntityName: 'Bộ dữ liệu chủ Công dân',
    targetEntityId: '2',
    targetEntityName: 'Bộ dữ liệu chủ Tổ chức',
    relationType: 'many-to-many',
    junctionTable: 'citizen_organization_mapping',
    junctionSourceKey: 'citizen_id',
    junctionTargetKey: 'organization_id',
    description: 'Quan hệ giữa công dân và tổ chức (chức vụ, công việc)',
    status: 'active',
    createdDate: '15/12/2024'
  },
  {
    id: 'rel-2',
    sourceEntityId: '3',
    sourceEntityName: 'Bộ dữ liệu chủ Văn bản pháp luật',
    targetEntityId: '4',
    targetEntityName: 'Bộ dữ liệu chủ Cơ quan ban hành',
    relationType: 'one-to-many',
    foreignKey: 'issuing_authority_id',
    referencedKey: 'authority_id',
    displayField: 'authority_name',
    description: 'Một cơ quan có thể ban hành nhiều văn bản',
    status: 'active',
    createdDate: '18/12/2024'
  }
];

const mockEntities = [
  { id: '1', code: 'MD-CITIZEN-001', name: 'Bộ dữ liệu chủ Công dân', version: 2 },
  { id: '2', code: 'MD-ORG-001', name: 'Bộ dữ liệu chủ Tổ chức', version: 2 },
  { id: '3', code: 'MD-DOC-001', name: 'Bộ dữ liệu chủ Văn bản pháp luật', version: 1 },
  { id: '4', code: 'MD-AUTH-001', name: 'Bộ dữ liệu chủ Cơ quan ban hành', version: 1 },
  { id: '5', code: 'MD-ADDR-001', name: 'Bộ dữ liệu chủ Địa chỉ', version: 1 }
];

// Trường thực tế của thực thể nguồn — giống "sourceEntityFields" trong wizard Tạo mới dữ liệu chủ
const ENTITY_FIELDS: Record<string, { name: string; label: string }[]> = {
  '1': [
    { name: 'citizen_id', label: 'Số CCCD' },
    { name: 'full_name', label: 'Họ và tên' },
    { name: 'date_of_birth', label: 'Ngày sinh' },
    { name: 'gender', label: 'Giới tính' },
    { name: 'address', label: 'Địa chỉ thường trú' },
    { name: 'email', label: 'Email' },
    { name: 'phone_number', label: 'Số điện thoại' },
  ],
  '2': [
    { name: 'org_id', label: 'Mã tổ chức' },
    { name: 'org_name', label: 'Tên tổ chức' },
    { name: 'tax_code', label: 'Mã số thuế' },
    { name: 'founded_date', label: 'Ngày thành lập' },
    { name: 'address', label: 'Địa chỉ trụ sở' },
  ],
  '3': [
    { name: 'doc_number', label: 'Số hiệu văn bản' },
    { name: 'doc_title', label: 'Tiêu đề văn bản' },
    { name: 'issued_date', label: 'Ngày ban hành' },
    { name: 'issuing_body', label: 'Cơ quan ban hành' },
    { name: 'doc_type', label: 'Loại văn bản' },
  ],
  '4': [
    { name: 'authority_id', label: 'Mã cơ quan' },
    { name: 'authority_name', label: 'Tên cơ quan' },
    { name: 'address', label: 'Địa chỉ' },
  ],
  '5': [
    { name: 'address_id', label: 'Mã địa chỉ' },
    { name: 'address_line', label: 'Số nhà, đường' },
    { name: 'ward', label: 'Phường/Xã' },
    { name: 'district', label: 'Quận/Huyện' },
    { name: 'province', label: 'Tỉnh/Thành phố' },
  ],
};

// Trường chung phía thực thể đích — giống "BASE_TARGET_FIELDS" trong wizard (chưa biết trước schema thực thể đích)
const BASE_TARGET_FIELDS = [
  { name: 'id', label: 'ID định danh' },
  { name: 'code', label: 'Mã định danh' },
  { name: 'name', label: 'Tên/Tiêu đề' },
  { name: 'status', label: 'Trạng thái' },
];

const MOCK_APPROVERS = [
  { id: 'a1', name: 'Nguyễn Văn An', position: 'Trưởng phòng', department: 'Phòng Quản lý dữ liệu' },
  { id: 'a2', name: 'Trần Thị Bình', position: 'Phó Cục trưởng', department: 'Cục Hành chính tư pháp' },
  { id: 'a3', name: 'Lê Minh Cường', position: 'Chuyên viên cao cấp', department: 'Vụ Kế hoạch - Tài chính' },
  { id: 'a4', name: 'Phạm Quốc Hùng', position: 'Cục trưởng', department: 'Cục Công nghệ thông tin' },
  { id: 'a5', name: 'Hoàng Thị Lan', position: 'Trưởng phòng', department: 'Phòng Nghiệp vụ pháp lý' }
];

const relationTypeLabels: Record<RelationType, string> = {
  'one-to-many': '1 - n (Một - Nhiều)',
  'many-to-many': 'n - n (Nhiều - Nhiều)',
  'one-to-one': '1 - 1 (Một - Một)'
};

const relationTypeIcons: Record<RelationType, string> = {
  'one-to-many': '1-n',
  'many-to-many': 'n-n',
  'one-to-one': '1-1'
};

const getSourceKey = (rel: EntityRelationship) => rel.relationType === 'many-to-many' ? rel.junctionSourceKey : rel.foreignKey;
const getTargetKey = (rel: EntityRelationship) => rel.relationType === 'many-to-many' ? rel.junctionTargetKey : rel.referencedKey;

export function EntityRelationshipsTab({ readOnly = false }: { readOnly?: boolean } = {}) {
  const [relationships, setRelationships] = useState<EntityRelationship[]>(mockRelationships);
  const [showForm, setShowForm] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState<EntityRelationship | null>(null);

  // Xem theo thực thể dữ liệu chủ
  const [selectedEntityFilter, setSelectedEntityFilter] = useState(mockEntities[0].id);

  // Pagination
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState<Partial<EntityRelationship>>({
    sourceEntityId: '',
    targetEntityId: '',
    relationType: 'many-to-many',
    foreignKey: '',
    referencedKey: '',
    junctionTable: '',
    junctionSourceKey: '',
    junctionTargetKey: '',
    displayField: '',
    description: '',
    status: 'active'
  });

  // Gửi phê duyệt modal (shown after add/edit quan hệ)
  const [approvalRelationship, setApprovalRelationship] = useState<EntityRelationship | null>(null);
  const [selectedApprover, setSelectedApprover] = useState('');
  const [approvalNote, setApprovalNote] = useState('');

  const handleSubmit = () => {
    if (!formData.sourceEntityId || !formData.targetEntityId) {
      alert('Vui lòng chọn đầy đủ thực thể nguồn và thực thể đích');
      return;
    }

    if (formData.sourceEntityId === formData.targetEntityId) {
      alert('Thực thể nguồn và thực thể đích phải khác nhau');
      return;
    }

    // Validate based on relation type
    if (formData.relationType === 'many-to-many') {
      if (!formData.junctionTable || !formData.junctionSourceKey || !formData.junctionTargetKey) {
        alert('Quan hệ n-n cần có đầy đủ: Bảng liên kết, Khóa nguồn, Khóa đích');
        return;
      }
    } else {
      if (!formData.foreignKey || !formData.referencedKey) {
        alert('Quan hệ 1-n hoặc 1-1 cần có đầy đủ: Khóa ngoại, Khóa tham chiếu');
        return;
      }
    }

    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

    const sourceEntity = mockEntities.find(e => e.id === formData.sourceEntityId);
    const targetEntity = mockEntities.find(e => e.id === formData.targetEntityId);

    let savedRelationship: EntityRelationship;

    if (editingRelationship) {
      savedRelationship = {
        ...editingRelationship,
        ...formData,
        sourceEntityName: sourceEntity?.name || '',
        targetEntityName: targetEntity?.name || ''
      };
      setRelationships(relationships.map(rel => rel.id === editingRelationship.id ? savedRelationship : rel));
    } else {
      savedRelationship = {
        id: `rel-${Date.now()}`,
        sourceEntityId: formData.sourceEntityId!,
        sourceEntityName: sourceEntity?.name || '',
        targetEntityId: formData.targetEntityId!,
        targetEntityName: targetEntity?.name || '',
        relationType: formData.relationType!,
        foreignKey: formData.foreignKey,
        referencedKey: formData.referencedKey,
        junctionTable: formData.junctionTable,
        junctionSourceKey: formData.junctionSourceKey,
        junctionTargetKey: formData.junctionTargetKey,
        displayField: formData.displayField,
        description: formData.description,
        status: formData.status!,
        createdDate: dateStr
      };
      setRelationships([...relationships, savedRelationship]);
    }

    handleCloseForm();

    // Gửi phê duyệt để áp dụng phiên bản mới của 2 thực thể liên quan
    setApprovalRelationship(savedRelationship);
    setSelectedApprover('');
    setApprovalNote('');
  };

  const handleCloseApprovalModal = () => {
    setApprovalRelationship(null);
    setSelectedApprover('');
    setApprovalNote('');
  };

  const handleConfirmApprove = () => {
    if (!approvalRelationship || !selectedApprover) return;
    alert('Đã gửi phê duyệt quan hệ thực thể thành công!');
    handleCloseApprovalModal();
  };

  const handleEdit = (relationship: EntityRelationship) => {
    setEditingRelationship(relationship);
    setFormData(relationship);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa quan hệ này?')) {
      setRelationships(relationships.filter(rel => rel.id !== id));
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRelationship(null);
    setFormData({
      sourceEntityId: '',
      targetEntityId: '',
      relationType: 'many-to-many',
      foreignKey: '',
      referencedKey: '',
      junctionTable: '',
      junctionSourceKey: '',
      junctionTargetKey: '',
      displayField: '',
      description: '',
      status: 'active'
    });
  };

  const filteredRelationships = selectedEntityFilter
    ? relationships.filter(rel => rel.sourceEntityId === selectedEntityFilter || rel.targetEntityId === selectedEntityFilter)
    : relationships;
  const totalPages = Math.max(1, Math.ceil(filteredRelationships.length / pageSize));
  const paginatedRelationships = filteredRelationships.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-bold text-slate-900">Thiết lập quan hệ giữa thực thể</h2>
          <p className="text-sm text-slate-600 mt-1">
            Quản trị hệ thống chọn 2 thực thể và định nghĩa liên kết giữa chúng (1-n, n-n)
          </p>
        </div>
        {!readOnly && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Thêm quan hệ mới
          </button>
        )}
      </div>

      {/* Entity Filter */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <label className="block text-[13px] text-slate-700 mb-2">
          Xem theo thực thể dữ liệu chủ
        </label>
        <div className="relative">
          <select
            value={selectedEntityFilter}
            onChange={(e) => { setSelectedEntityFilter(e.target.value); setCurrentPage(1); }}
            className="w-full pl-3 pr-8 py-2 border border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[13px] appearance-none cursor-pointer"
          >
            <option value="">Tất cả thực thể dữ liệu chủ</option>
            {mockEntities.map(entity => (
              <option key={entity.id} value={entity.id}>{entity.code} - {entity.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Relationships Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center w-16">STT</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Thực thể Nguồn</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Khóa Nguồn</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center w-24">Loại</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Thực thể Đích</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Khóa Đích</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Trường hiển thị</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center w-20">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredRelationships.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <Network className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">
                      Thực thể dữ liệu chủ chưa có quan hệ nào, thêm mới quan hệ
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedRelationships.map((relationship, idx) => (
                    <tr key={relationship.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-center text-[13px] text-slate-500 font-medium">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td className="px-6 py-4 text-[13px] text-slate-900">{relationship.sourceEntityName}</td>
                      <td className="px-6 py-4 font-mono text-[13px] text-slate-600">{getSourceKey(relationship) || '--'}</td>
                      <td className="px-6 py-4 text-center text-[13px] text-slate-600">
                        {relationTypeIcons[relationship.relationType]}
                      </td>
                      <td className="px-6 py-4 text-[13px] text-blue-600">{relationship.targetEntityName}</td>
                      <td className="px-6 py-4 font-mono text-[13px] text-slate-600">{getTargetKey(relationship) || '--'}</td>
                      <td className="px-6 py-4 text-[13px] text-slate-600">
                        {relationship.relationType === 'many-to-many'
                          ? (relationship.junctionTable || '--')
                          : (relationship.displayField || '--')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {readOnly || !SHOW_EDIT_DELETE_ACTIONS ? (
                            <span className="text-slate-300">—</span>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(relationship)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                title="Chỉnh sửa"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(relationship.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                title="Xóa"
                              >
                                <Trash2 className="w-4 h-4" />
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
        {filteredRelationships.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white text-[13px] font-medium">
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-normal">Hiển thị</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
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
                {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredRelationships.length)} / {filteredRelationships.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 border rounded-xl font-medium text-[13px] transition-colors cursor-pointer ${currentPage === page
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
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

      {/* Form Modal */}
      <BaseModal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editingRelationship ? 'Chỉnh sửa quan hệ thực thể' : 'Thêm quan hệ thực thể mới'}
        maxWidth="max-w-4xl"
        customHeaderIcon={<LinkIcon className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />}
        footer={
          <>
            <button
              onClick={handleCloseForm}
              className="px-4 py-2 text-[13px] text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              {editingRelationship ? 'Cập nhật' : 'Lưu quan hệ'}
            </button>
          </>
        }
      >
        <div className="space-y-5">
              {/* 1. Chọn thực thể liên kết */}
              <div className="space-y-3">
                <h4 className="text-[13px] font-semibold text-slate-700 border-b border-slate-200 pb-2">1. Chọn thực thể liên kết</h4>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                      Thực thể nguồn <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.sourceEntityId}
                      onChange={(e) => setFormData({ ...formData, sourceEntityId: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
                    >
                      <option value="">-- Chọn thực thể nguồn --</option>
                      {mockEntities.map(entity => (
                        <option key={entity.id} value={entity.id}>
                          {entity.code} - {entity.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                      Thực thể đích <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.targetEntityId}
                      onChange={(e) => setFormData({ ...formData, targetEntityId: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
                    >
                      <option value="">-- Chọn thực thể đích --</option>
                      {mockEntities
                        .filter(entity => entity.id !== formData.sourceEntityId)
                        .map(entity => (
                          <option key={entity.id} value={entity.id}>
                            {entity.code} - {entity.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {formData.sourceEntityId && formData.targetEntityId && (
                  <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-center gap-8">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-[13px]">A</div>
                      <span className="text-[13px] font-semibold text-slate-800">
                        {mockEntities.find(e => e.id === formData.sourceEntityId)?.name}
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-9 h-9 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-[13px]">B</div>
                      <span className="text-[13px] font-semibold text-slate-800">
                        {mockEntities.find(e => e.id === formData.targetEntityId)?.name}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Loại quan hệ */}
              <div className="space-y-3">
                <h4 className="text-[13px] font-semibold text-slate-700 border-b border-slate-200 pb-2">2. Loại quan hệ</h4>
                <select
                  value={formData.relationType}
                  onChange={(e) => setFormData({ ...formData, relationType: e.target.value as RelationType })}
                  className="w-64 px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
                >
                  {Object.entries(relationTypeLabels)
                    .map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                </select>
              </div>

              {/* 3. Điều kiện liên kết */}
              <div className="space-y-3">
                <h4 className="text-[13px] font-semibold text-slate-700 border-b border-slate-200 pb-2 flex items-center justify-between">
                  <span>3. Điều kiện liên kết</span>
                  {!(formData.sourceEntityId && formData.targetEntityId) && (
                    <span className="text-[13px] text-orange-600 bg-orange-50 font-normal px-2 py-0.5 rounded border border-orange-100">Chọn đủ 2 thực thể để cấu hình khóa liên kết</span>
                  )}
                </h4>

                {formData.sourceEntityId && formData.targetEntityId ? (
                  formData.relationType === 'many-to-many' ? (
                    // Many-to-Many: Junction Table
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 space-y-4">
                      <p className="text-[13px] font-semibold text-purple-900">Bảng liên kết (Mapping Table)</p>
                      <div>
                        <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                          Tên bảng liên kết <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.junctionTable}
                          onChange={(e) => setFormData({ ...formData, junctionTable: e.target.value })}
                          placeholder="VD: citizen_organization_mapping"
                          className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                            Khoá ngoại Nguồn <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.junctionSourceKey}
                            onChange={(e) => setFormData({ ...formData, junctionSourceKey: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-mono"
                          >
                            <option value="">-- Chọn trường Nguồn --</option>
                            {(ENTITY_FIELDS[formData.sourceEntityId || ''] ?? BASE_TARGET_FIELDS).map(f => (
                              <option key={f.name} value={f.name}>{f.name} ({f.label})</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                            Khoá ngoại Đích <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.junctionTargetKey}
                            onChange={(e) => setFormData({ ...formData, junctionTargetKey: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-mono"
                          >
                            <option value="">-- Chọn trường Đích --</option>
                            {BASE_TARGET_FIELDS.map(f => (
                              <option key={f.name} value={f.name}>{f.name} ({f.label})</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // One-to-Many or One-to-One: Foreign Key
                    <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 space-y-4">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-blue-600" />
                        <span className="text-[13px] font-semibold text-blue-900">Khóa ngoại (Foreign Key)</span>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                            Khóa nguồn <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.foreignKey}
                            onChange={(e) => setFormData({ ...formData, foreignKey: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                          >
                            <option value="">-- Chọn trường Nguồn --</option>
                            {(ENTITY_FIELDS[formData.sourceEntityId || ''] ?? BASE_TARGET_FIELDS).map(f => (
                              <option key={f.name} value={f.name}>{f.name} ({f.label})</option>
                            ))}
                          </select>
                          <p className="text-[13px] text-slate-400 mt-1">Trường trong thực thể nguồn</p>
                        </div>

                        <div>
                          <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                            Khóa đích <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.referencedKey}
                            onChange={(e) => setFormData({ ...formData, referencedKey: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                          >
                            <option value="">-- Chọn trường Đích --</option>
                            {BASE_TARGET_FIELDS.map(f => (
                              <option key={f.name} value={f.name}>{f.name} ({f.label})</option>
                            ))}
                          </select>
                          <p className="text-[13px] text-slate-400 mt-1">Trường dùng để join (thường là ID/Code)</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-blue-100">
                        <label className="block text-[13px] font-medium text-emerald-700 mb-1.5">
                          Trường hiển thị (Lookup Display) <span className="text-slate-400 font-normal">(Không bắt buộc)</span>
                        </label>
                        <select
                          value={formData.displayField || ''}
                          onChange={(e) => setFormData({ ...formData, displayField: e.target.value })}
                          className="w-full max-w-xs px-3 py-2 border border-emerald-300 bg-white rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                        >
                          <option value="">-- Không chọn --</option>
                          {BASE_TARGET_FIELDS.map(f => (
                            <option key={f.name} value={f.name}>{f.name} ({f.label})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="bg-slate-50 border border-dashed border-slate-200 rounded-lg p-6 text-center text-[13px] text-slate-400">
                    Hãy chọn đầy đủ thực thể nguồn và đích ở mục 1 để cấu hình khóa liên kết
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                  Mô tả quan hệ
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="VD: Quan hệ giữa văn bản pháp luật và cơ quan ban hành"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {formData.sourceEntityId && formData.targetEntityId && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-[13px] text-amber-800">
                    <p className="mb-1">
                      {editingRelationship ? 'Khi chỉnh sửa quan hệ, ' : 'Khi thêm mới quan hệ, '}
                      phiên bản của <strong>cả 2 thực thể</strong> liên quan sẽ tự động tăng lên phiên bản kế tiếp:
                    </p>
                    <ul className="list-disc list-inside space-y-0.5">
                      <li>
                        {mockEntities.find(e => e.id === formData.sourceEntityId)?.name}: v{mockEntities.find(e => e.id === formData.sourceEntityId)?.version ?? 1} → v{(mockEntities.find(e => e.id === formData.sourceEntityId)?.version ?? 1) + 1}
                      </li>
                      <li>
                        {mockEntities.find(e => e.id === formData.targetEntityId)?.name}: v{mockEntities.find(e => e.id === formData.targetEntityId)?.version ?? 1} → v{(mockEntities.find(e => e.id === formData.targetEntityId)?.version ?? 1) + 1}
                      </li>
                    </ul>
                    <p className="mt-1">Thay đổi này sẽ được ghi nhận trong lịch sử phiên bản.</p>
                  </div>
                </div>
              )}
        </div>
      </BaseModal>

      {/* Gửi phê duyệt Modal — shown after add/edit quan hệ thực thể */}
      <BaseModal
        isOpen={!!approvalRelationship}
        onClose={handleCloseApprovalModal}
        title="Gửi phê duyệt"
        subtitle={approvalRelationship ? `Quan hệ: ${approvalRelationship.sourceEntityName} → ${approvalRelationship.targetEntityName}` : undefined}
        maxWidth="max-w-2xl"
        customHeaderIcon={<Send className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />}
        footer={
          <>
            <button
              onClick={handleCloseApprovalModal}
              className="px-4 py-2 text-[13px] text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirmApprove}
              disabled={!selectedApprover}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-[13px] transition-colors shadow-sm ${selectedApprover
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
            >
              <Send className="w-4 h-4" />
              Gửi trình duyệt
            </button>
          </>
        }
      >
        {approvalRelationship && (
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                Chọn người duyệt <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedApprover}
                onChange={e => setSelectedApprover(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 focus:border-indigo-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
              >
                <option value="">-- Chọn người duyệt --</option>
                {MOCK_APPROVERS.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} - {u.position} ({u.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                Nội dung yêu cầu
              </label>
              <textarea
                value={approvalNote}
                onChange={e => setApprovalNote(e.target.value)}
                rows={4}
                placeholder="Nhập nội dung gửi kèm (nếu có)..."
                className="w-full px-3 py-2 border border-slate-200 focus:border-indigo-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
              />
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h4 className="text-[13px] font-semibold text-slate-700 mb-3">Thông tin quan hệ thực thể</h4>
              <div className="space-y-2 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Thực thể nguồn:</span>
                  <span className="text-slate-800 font-medium">{approvalRelationship.sourceEntityName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Thực thể đích:</span>
                  <span className="text-slate-800 font-medium">{approvalRelationship.targetEntityName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Loại quan hệ:</span>
                  <span className="text-slate-800 font-medium">{relationTypeIcons[approvalRelationship.relationType]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phiên bản mới:</span>
                  <span className="text-slate-800">
                    v{(mockEntities.find(e => e.id === approvalRelationship.sourceEntityId)?.version ?? 1) + 1} / v{(mockEntities.find(e => e.id === approvalRelationship.targetEntityId)?.version ?? 1) + 1}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </BaseModal>
    </div>
  );
}