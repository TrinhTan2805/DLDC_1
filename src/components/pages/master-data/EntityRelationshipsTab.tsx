import { useState } from 'react';
import { Plus, Edit, Trash2, Save, Network, ArrowRight, Key, Table, AlertCircle, Send } from 'lucide-react';
import { toast } from 'sonner';
import { BaseModal } from '../../common/BaseModal';
import { Badge, TruncatedText, RowIconAction, Pagination, BTN_PRIMARY, BTN_OUTLINE, INPUT_CLS, LABEL_CLS, REQUIRED_MARK } from '../collection/collectionUi';

// Bảng chuẩn (mục 5.3)
const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';
// Tiêu đề nhóm trong form modal + chữ hướng dẫn
const GROUP_TITLE = 'text-[14px] font-medium text-[#020817] border-b border-[#E2E8F0] pb-2';
const HELP_TEXT = 'text-[13px] text-[#64748B] mt-1';
const TEXTAREA_CLS = 'w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none';

// Màu badge theo loại quan hệ (variant của Badge chuẩn) — đồng bộ với màn Danh mục dùng chung
const relationTypeVariants: Record<RelationType, string> = {
  'one-to-many': 'blue',
  'many-to-many': 'purple',
  'one-to-one': 'emerald',
};

// Tạm ẩn nút Chỉnh sửa/Xóa theo yêu cầu — chỉ ẩn giao diện, không xóa code/luồng xử lý
const SHOW_EDIT_DELETE_ACTIONS = false;

type RelationType = 'one-to-many' | 'many-to-many' | 'one-to-one';
type RelationStatus = 'active' | 'inactive';

export interface EntityRelationship {
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

export const mockRelationships: EntityRelationship[] = [
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

export const relationTypeLabels: Record<RelationType, string> = {
  'one-to-many': '1 - n (Một - Nhiều)',
  'many-to-many': 'n - n (Nhiều - Nhiều)',
  'one-to-one': '1 - 1 (Một - Một)'
};

const relationTypeIcons: Record<RelationType, string> = {
  'one-to-many': '1-n',
  'many-to-many': 'n-n',
  'one-to-one': '1-1'
};

export const getSourceKey = (rel: EntityRelationship) => rel.relationType === 'many-to-many' ? rel.junctionSourceKey : rel.foreignKey;
export const getTargetKey = (rel: EntityRelationship) => rel.relationType === 'many-to-many' ? rel.junctionTargetKey : rel.referencedKey;

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
      toast.error('Vui lòng chọn đầy đủ thực thể nguồn và thực thể đích');
      return;
    }

    if (formData.sourceEntityId === formData.targetEntityId) {
      toast.error('Thực thể nguồn và thực thể đích phải khác nhau');
      return;
    }

    // Validate based on relation type
    if (formData.relationType === 'many-to-many') {
      if (!formData.junctionTable || !formData.junctionSourceKey || !formData.junctionTargetKey) {
        toast.error('Quan hệ n-n cần có đầy đủ: Bảng liên kết, Khóa nguồn, Khóa đích');
        return;
      }
    } else {
      if (!formData.foreignKey || !formData.referencedKey) {
        toast.error('Quan hệ 1-n hoặc 1-1 cần có đầy đủ: Khóa ngoại, Khóa tham chiếu');
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
    toast.success('Đã gửi phê duyệt quan hệ thực thể thành công!');
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
  const paginatedRelationships = filteredRelationships.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[16px] font-semibold text-[#020817]">Thiết lập quan hệ giữa thực thể</h2>
          <p className="text-[13px] text-[#64748B] mt-0.5">
            Quản trị hệ thống chọn 2 thực thể và định nghĩa liên kết giữa chúng (1-n, n-n)
          </p>
        </div>
        {!readOnly && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className={`${BTN_PRIMARY} whitespace-nowrap`}
          >
            <Plus className="w-4 h-4" />
            Thêm quan hệ mới
          </button>
        )}
      </div>

      {/* Entity Filter */}
      <div className="bg-white p-4 border border-[#E2E8F0] rounded-2xl">
        <label htmlFor="er-entity-filter" className={LABEL_CLS}>
          Xem theo thực thể dữ liệu chủ
        </label>
        <select
          id="er-entity-filter"
          value={selectedEntityFilter}
          onChange={(e) => { setSelectedEntityFilter(e.target.value); setCurrentPage(1); }}
          className={`${INPUT_CLS} cursor-pointer`}
        >
          <option value="">Tất cả thực thể dữ liệu chủ</option>
          {mockEntities.map(entity => (
            <option key={entity.id} value={entity.id}>{entity.code} - {entity.name}</option>
          ))}
        </select>
      </div>

      {/* Relationships Table */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse collection-table text-[13px]">
            <thead className="bg-[#F8FAFC]">
              <tr className="h-[42px] border-b border-[#E0E0E0]">
                <th className={`${TH} text-center w-14`}>STT</th>
                <th className={`${TH} text-left`}>Thực thể Nguồn</th>
                <th className={`${TH} text-left`}>Khóa Nguồn</th>
                <th className={`${TH} text-left w-24`}>Loại</th>
                <th className={`${TH} text-left`}>Thực thể Đích</th>
                <th className={`${TH} text-left`}>Khóa Đích</th>
                <th className={`${TH} text-left`}>Trường hiển thị</th>
                <th className={`${TH} text-center w-[100px] sticky right-0 bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]`}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredRelationships.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <Network className="w-12 h-12 text-[#CBD5E1] stroke-[1.5] mx-auto mb-3" />
                    <p className="text-[13px] text-[#64748B]">
                      Thực thể dữ liệu chủ chưa có quan hệ nào, thêm mới quan hệ
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedRelationships.map((relationship, idx) => {
                  const displayValue = relationship.relationType === 'many-to-many'
                    ? (relationship.junctionTable || '')
                    : (relationship.displayField || '');
                  return (
                    <tr key={relationship.id} className="group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                      <td className={`${TD} text-center`}>
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td className={`${TD} max-w-[260px]`}><TruncatedText text={relationship.sourceEntityName} /></td>
                      <td className={`${TD} max-w-[200px]`}><TruncatedText text={getSourceKey(relationship) || '--'} /></td>
                      <td className={TD}>
                        <Badge label={relationTypeIcons[relationship.relationType]} variant={relationTypeVariants[relationship.relationType]} />
                      </td>
                      <td className={`${TD} max-w-[260px]`}><TruncatedText text={relationship.targetEntityName} className="text-blue-600" /></td>
                      <td className={`${TD} max-w-[200px]`}><TruncatedText text={getTargetKey(relationship) || '--'} /></td>
                      <td className={`${TD} max-w-[220px]`}>
                        {displayValue
                          ? <TruncatedText text={displayValue} />
                          : <span className="text-[#64748B]">--</span>}
                      </td>
                      <td className={`${TD} text-center sticky right-0 bg-white group-hover:bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]`}>
                        <div className="flex items-center justify-center gap-1">
                          {readOnly || !SHOW_EDIT_DELETE_ACTIONS ? (
                            <span className="text-[#94A3B8]">—</span>
                          ) : (
                            <>
                              <RowIconAction label="Chỉnh sửa" onClick={() => handleEdit(relationship)}>
                                <Edit className="w-4 h-4" />
                              </RowIconAction>
                              <RowIconAction label="Xóa" onClick={() => handleDelete(relationship.id)}>
                                <Trash2 className="w-4 h-4" />
                              </RowIconAction>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {filteredRelationships.length > 0 && (
          <Pagination
            className="border-t border-[#E2E8F0]"
            currentPage={currentPage}
            totalItems={filteredRelationships.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
            pageSizeOptions={[10, 20, 50]}
          />
        )}
      </div>

      {/* Form Modal */}
      <BaseModal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editingRelationship ? 'Chỉnh sửa quan hệ thực thể' : 'Thêm quan hệ thực thể mới'}
        maxWidth="max-w-4xl"
        footer={
          <>
            <button
              type="button"
              onClick={handleCloseForm}
              className={BTN_OUTLINE}
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className={BTN_PRIMARY}
            >
              <Save className="w-4 h-4" />
              {editingRelationship ? 'Cập nhật' : 'Lưu quan hệ'}
            </button>
          </>
        }
      >
        <div className="space-y-6 text-left">
          {/* 1. Chọn thực thể liên kết */}
          <div className="space-y-4">
            <h4 className={GROUP_TITLE}>1. Chọn thực thể liên kết</h4>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="er-source-entity" className={LABEL_CLS}>
                  Thực thể nguồn <span className={REQUIRED_MARK}>*</span>
                </label>
                <select
                  id="er-source-entity"
                  value={formData.sourceEntityId}
                  onChange={(e) => setFormData({ ...formData, sourceEntityId: e.target.value })}
                  className={`${INPUT_CLS} cursor-pointer`}
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
                <label htmlFor="er-target-entity" className={LABEL_CLS}>
                  Thực thể đích <span className={REQUIRED_MARK}>*</span>
                </label>
                <select
                  id="er-target-entity"
                  value={formData.targetEntityId}
                  onChange={(e) => setFormData({ ...formData, targetEntityId: e.target.value })}
                  className={`${INPUT_CLS} cursor-pointer`}
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
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 flex items-center justify-center gap-6">
                <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-medium text-[13px] shrink-0">A</div>
                  <TruncatedText
                    text={mockEntities.find(e => e.id === formData.sourceEntityId)?.name || ''}
                    className="text-[13px] font-medium text-[#020817] text-center w-full"
                  />
                </div>
                <ArrowRight className="w-5 h-5 text-[#94A3B8] shrink-0" />
                <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-green-50 text-green-600 rounded-full flex items-center justify-center font-medium text-[13px] shrink-0">B</div>
                  <TruncatedText
                    text={mockEntities.find(e => e.id === formData.targetEntityId)?.name || ''}
                    className="text-[13px] font-medium text-[#020817] text-center w-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2. Loại quan hệ */}
          <div className="space-y-3">
            <h4 className={GROUP_TITLE}>2. Loại quan hệ</h4>
            <select
              title="Chọn loại quan hệ"
              aria-label="Loại quan hệ"
              value={formData.relationType}
              onChange={(e) => setFormData({ ...formData, relationType: e.target.value as RelationType })}
              className={`${INPUT_CLS} max-w-xs cursor-pointer`}
            >
              {Object.entries(relationTypeLabels)
                .map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
            </select>
          </div>

          {/* 3. Điều kiện liên kết */}
          <div className="space-y-3">
            <h4 className={`${GROUP_TITLE} flex items-center justify-between gap-3`}>
              <span>3. Điều kiện liên kết</span>
              {!(formData.sourceEntityId && formData.targetEntityId) && (
                <span className="text-[13px] text-[#D97706] bg-[#FFF7ED] font-normal px-2 py-0.5 rounded-lg border border-[#FED7AA]">Chọn đủ 2 thực thể để cấu hình khóa liên kết</span>
              )}
            </h4>

            {formData.sourceEntityId && formData.targetEntityId ? (
              formData.relationType === 'many-to-many' ? (
                // Many-to-Many: Junction Table
                <div className="rounded-2xl border border-[#E2E8F0] p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4 text-blue-600" />
                    <span className="text-[14px] font-medium text-[#020817]">Bảng liên kết (Mapping Table)</span>
                  </div>
                  <div>
                    <label htmlFor="er-junction-table" className={LABEL_CLS}>
                      Tên bảng liên kết <span className={REQUIRED_MARK}>*</span>
                    </label>
                    <input
                      id="er-junction-table"
                      type="text"
                      value={formData.junctionTable}
                      onChange={(e) => setFormData({ ...formData, junctionTable: e.target.value })}
                      placeholder="VD: citizen_organization_mapping"
                      className={INPUT_CLS}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="er-junction-source" className={LABEL_CLS}>
                        Khoá ngoại Nguồn <span className={REQUIRED_MARK}>*</span>
                      </label>
                      <select
                        id="er-junction-source"
                        value={formData.junctionSourceKey}
                        onChange={(e) => setFormData({ ...formData, junctionSourceKey: e.target.value })}
                        className={`${INPUT_CLS} cursor-pointer`}
                      >
                        <option value="">-- Chọn trường Nguồn --</option>
                        {(ENTITY_FIELDS[formData.sourceEntityId || ''] ?? BASE_TARGET_FIELDS).map(f => (
                          <option key={f.name} value={f.name}>{f.name} ({f.label})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="er-junction-target" className={LABEL_CLS}>
                        Khoá ngoại Đích <span className={REQUIRED_MARK}>*</span>
                      </label>
                      <select
                        id="er-junction-target"
                        value={formData.junctionTargetKey}
                        onChange={(e) => setFormData({ ...formData, junctionTargetKey: e.target.value })}
                        className={`${INPUT_CLS} cursor-pointer`}
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
                <div className="rounded-2xl border border-[#E2E8F0] p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-blue-600" />
                    <span className="text-[14px] font-medium text-[#020817]">Khóa ngoại (Foreign Key)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="er-foreign-key" className={LABEL_CLS}>
                        Khóa nguồn <span className={REQUIRED_MARK}>*</span>
                      </label>
                      <select
                        id="er-foreign-key"
                        value={formData.foreignKey}
                        onChange={(e) => setFormData({ ...formData, foreignKey: e.target.value })}
                        className={`${INPUT_CLS} cursor-pointer`}
                      >
                        <option value="">-- Chọn trường Nguồn --</option>
                        {(ENTITY_FIELDS[formData.sourceEntityId || ''] ?? BASE_TARGET_FIELDS).map(f => (
                          <option key={f.name} value={f.name}>{f.name} ({f.label})</option>
                        ))}
                      </select>
                      <p className={HELP_TEXT}>Trường trong thực thể nguồn</p>
                    </div>

                    <div>
                      <label htmlFor="er-referenced-key" className={LABEL_CLS}>
                        Khóa đích <span className={REQUIRED_MARK}>*</span>
                      </label>
                      <select
                        id="er-referenced-key"
                        value={formData.referencedKey}
                        onChange={(e) => setFormData({ ...formData, referencedKey: e.target.value })}
                        className={`${INPUT_CLS} cursor-pointer`}
                      >
                        <option value="">-- Chọn trường Đích --</option>
                        {BASE_TARGET_FIELDS.map(f => (
                          <option key={f.name} value={f.name}>{f.name} ({f.label})</option>
                        ))}
                      </select>
                      <p className={HELP_TEXT}>Trường dùng để join (thường là ID/Code)</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E2E8F0]">
                    <label htmlFor="er-display-field" className={LABEL_CLS}>
                      Trường hiển thị (Lookup Display) <span className="text-[#64748B] font-normal">(Không bắt buộc)</span>
                    </label>
                    <select
                      id="er-display-field"
                      value={formData.displayField || ''}
                      onChange={(e) => setFormData({ ...formData, displayField: e.target.value })}
                      className={`${INPUT_CLS} max-w-xs cursor-pointer`}
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
              <div className="bg-[#F8FAFC] border border-dashed border-[#E2E8F0] rounded-lg p-6 text-center text-[13px] text-[#64748B]">
                Hãy chọn đầy đủ thực thể nguồn và đích ở mục 1 để cấu hình khóa liên kết
              </div>
            )}
          </div>

          <div>
            <label htmlFor="er-description" className={LABEL_CLS}>
              Mô tả quan hệ
            </label>
            <textarea
              id="er-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="VD: Quan hệ giữa văn bản pháp luật và cơ quan ban hành"
              rows={3}
              className={TEXTAREA_CLS}
            />
          </div>

          {formData.sourceEntityId && formData.targetEntityId && (
            <div className="flex items-start gap-2 p-3 bg-[#FFF7ED] border border-[#FED7AA] rounded-lg">
              <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
              <div className="text-[13px] text-[#020817]">
                <p className="mb-1">
                  {editingRelationship ? 'Khi chỉnh sửa quan hệ, ' : 'Khi thêm mới quan hệ, '}
                  phiên bản của <strong className="font-medium">cả 2 thực thể</strong> liên quan sẽ tự động tăng lên phiên bản kế tiếp:
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
        footer={
          <>
            <button
              type="button"
              onClick={handleCloseApprovalModal}
              className={BTN_OUTLINE}
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleConfirmApprove}
              disabled={!selectedApprover}
              className={BTN_PRIMARY}
            >
              <Send className="w-4 h-4" />
              Gửi trình duyệt
            </button>
          </>
        }
      >
        {approvalRelationship && (
          <div className="space-y-4 text-left">
            <div>
              <label htmlFor="er-approver" className={LABEL_CLS}>
                Chọn người duyệt <span className={REQUIRED_MARK}>*</span>
              </label>
              <select
                id="er-approver"
                value={selectedApprover}
                onChange={e => setSelectedApprover(e.target.value)}
                className={`${INPUT_CLS} cursor-pointer`}
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
              <label htmlFor="er-approval-note" className={LABEL_CLS}>
                Nội dung yêu cầu
              </label>
              <textarea
                id="er-approval-note"
                value={approvalNote}
                onChange={e => setApprovalNote(e.target.value)}
                rows={4}
                placeholder="Nhập nội dung gửi kèm (nếu có)..."
                className={TEXTAREA_CLS}
              />
            </div>

            <div className="rounded-2xl border border-[#E2E8F0] p-4">
              <h4 className="text-[14px] font-medium text-[#020817] mb-3">Thông tin quan hệ thực thể</h4>
              <div className="space-y-2 text-[13px]">
                <div className="flex justify-between gap-4">
                  <span className="text-[#64748B]">Thực thể nguồn:</span>
                  <span className="text-[#020817] text-right">{approvalRelationship.sourceEntityName}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#64748B]">Thực thể đích:</span>
                  <span className="text-[#020817] text-right">{approvalRelationship.targetEntityName}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#64748B]">Loại quan hệ:</span>
                  <Badge label={relationTypeIcons[approvalRelationship.relationType]} variant={relationTypeVariants[approvalRelationship.relationType]} />
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#64748B]">Phiên bản mới:</span>
                  <span className="text-[#020817] tabular-nums">
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
