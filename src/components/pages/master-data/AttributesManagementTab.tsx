import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Plus, Edit, Trash2, Search, History as HistoryIcon, Check, AlertCircle, ChevronDown, Database, X, FileText, Send } from 'lucide-react';
import { BaseModal } from '../../common/BaseModal';

type FieldDataType = 'string' | 'number' | 'date' | 'datetime' | 'boolean' | 'text' | 'email' | 'phone' | 'url';
type DataSourceType = 'dldc' | 'manual';

interface MasterDataEntity {
  id: string;
  code: string;
  name: string;
  dataSource: DataSourceType;
  primaryDatabaseId?: string;
  primaryTableId?: string;
}

interface DldcJoin {
  id: string;
  joinType: 'LEFT JOIN' | 'INNER JOIN' | 'RIGHT JOIN';
  tableId: string;
  alias: string;
  leftField: string;
  rightField: string;
}

interface DldcFieldRow {
  id: string;
  shared: boolean;
  isPK: boolean;
  tableId: string;
  sourceJoinId: string | null;
  columnName: string;
  apiFieldName: string;
  dataType: FieldDataType;
  masked: boolean;
}

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
  // DLDC source fields
  databaseName?: string;
  tableName?: string;
}

interface VersionHistory {
  version: number;
  changes: string;
  updatedBy: string;
  updatedDate: string;
}

const mockEntities: MasterDataEntity[] = [
  { id: '1', code: 'MD-CITIZEN-001', name: 'Bộ dữ liệu chủ Công dân', dataSource: 'dldc', primaryDatabaseId: 'hotich', primaryTableId: 'tbl_citizen' },
  { id: '2', code: 'MD-ORG-001', name: 'Bộ dữ liệu chủ Tổ chức', dataSource: 'dldc', primaryDatabaseId: 'dkkd', primaryTableId: 'tbl_organization' },
  { id: '3', code: 'MD-DOC-001', name: 'Bộ dữ liệu chủ Văn bản pháp luật', dataSource: 'manual' },
  { id: '4', code: 'MD-ADMIN-001', name: 'Bộ dữ liệu chủ Đơn vị hành chính', dataSource: 'manual' },
  { id: '5', code: 'MD-AGENCY-001', name: 'Bộ dữ liệu chủ Cơ quan nhà nước', dataSource: 'dldc', primaryDatabaseId: 'lltp', primaryTableId: 'tbl_lich_su' },
];

const defaultAttributes: Record<string, MasterDataAttribute[]> = {
  // DLDC source — includes databaseName + tableName
  '1': [
    { id: 'attr-1', fieldName: 'citizen_id', displayName: 'Số CCCD', dataType: 'string', length: 12, required: true, unique: true, indexed: true, createdDate: '10/12/2024', version: 1, databaseName: 'CSDL Hộ tịch điện tử', tableName: 'tbl_citizen' },
    { id: 'attr-2', fieldName: 'full_name', displayName: 'Họ và tên', dataType: 'string', length: 255, required: true, unique: false, indexed: true, createdDate: '10/12/2024', version: 1, databaseName: 'CSDL Hộ tịch điện tử', tableName: 'tbl_citizen' },
    { id: 'attr-3', fieldName: 'date_of_birth', displayName: 'Ngày sinh', dataType: 'date', required: true, unique: false, indexed: false, createdDate: '10/12/2024', version: 1, databaseName: 'CSDL Hộ tịch điện tử', tableName: 'tbl_citizen' },
    { id: 'attr-4', fieldName: 'gender', displayName: 'Giới tính', dataType: 'string', length: 10, required: false, unique: false, indexed: false, createdDate: '10/12/2024', version: 1, databaseName: 'CSDL Hộ tịch điện tử', tableName: 'tbl_citizen' },
    { id: 'attr-5', fieldName: 'address', displayName: 'Địa chỉ thường trú', dataType: 'text', required: false, unique: false, indexed: false, createdDate: '10/12/2024', version: 1, databaseName: 'CSDL Hộ tịch điện tử', tableName: 'tbl_citizen' },
    { id: 'attr-6', fieldName: 'email', displayName: 'Email', dataType: 'email', length: 255, required: false, unique: false, indexed: true, createdDate: '10/12/2024', version: 1, databaseName: 'CSDL Hộ tịch điện tử', tableName: 'tbl_citizen' },
    { id: 'attr-7', fieldName: 'phone_number', displayName: 'Số điện thoại', dataType: 'phone', length: 15, required: false, unique: false, indexed: true, createdDate: '10/12/2024', version: 1, databaseName: 'CSDL Hộ tịch điện tử', tableName: 'tbl_citizen' },
  ],
  '2': [
    { id: 'attr-8', fieldName: 'org_id', displayName: 'Mã tổ chức', dataType: 'string', length: 20, required: true, unique: true, indexed: true, createdDate: '10/12/2024', version: 1, databaseName: 'CSDL Đăng ký kinh doanh', tableName: 'tbl_organization' },
    { id: 'attr-9', fieldName: 'org_name', displayName: 'Tên tổ chức', dataType: 'string', length: 500, required: true, unique: false, indexed: true, createdDate: '10/12/2024', version: 1, databaseName: 'CSDL Đăng ký kinh doanh', tableName: 'tbl_organization' },
    { id: 'attr-10', fieldName: 'tax_code', displayName: 'Mã số thuế', dataType: 'string', length: 13, required: true, unique: true, indexed: true, createdDate: '10/12/2024', version: 1, databaseName: 'CSDL Đăng ký kinh doanh', tableName: 'tbl_organization' },
    { id: 'attr-11', fieldName: 'founded_date', displayName: 'Ngày thành lập', dataType: 'date', required: false, unique: false, indexed: false, createdDate: '10/12/2024', version: 1, databaseName: 'CSDL Đăng ký kinh doanh', tableName: 'tbl_organization' },
    { id: 'attr-12', fieldName: 'address', displayName: 'Địa chỉ trụ sở', dataType: 'text', required: false, unique: false, indexed: false, createdDate: '10/12/2024', version: 1, databaseName: 'CSDL Đăng ký kinh doanh', tableName: 'tbl_organization' },
  ],
  // Manual source — no databaseName/tableName
  '3': [
    { id: 'attr-13', fieldName: 'doc_number', displayName: 'Số hiệu văn bản', dataType: 'string', length: 50, required: true, unique: true, indexed: true, createdDate: '10/12/2024', version: 1 },
    { id: 'attr-14', fieldName: 'doc_title', displayName: 'Tiêu đề văn bản', dataType: 'string', length: 500, required: true, unique: false, indexed: true, createdDate: '10/12/2024', version: 1 },
    { id: 'attr-15', fieldName: 'issued_date', displayName: 'Ngày ban hành', dataType: 'date', required: true, unique: false, indexed: false, createdDate: '10/12/2024', version: 1 },
    { id: 'attr-16', fieldName: 'issuing_body', displayName: 'Cơ quan ban hành', dataType: 'string', length: 255, required: true, unique: false, indexed: false, createdDate: '10/12/2024', version: 1 },
    { id: 'attr-17', fieldName: 'doc_type', displayName: 'Loại văn bản', dataType: 'string', length: 100, required: false, unique: false, indexed: false, createdDate: '10/12/2024', version: 1 },
  ],
  '4': [
    { id: 'attr-18', fieldName: 'unit_code', displayName: 'Mã đơn vị', dataType: 'string', length: 20, required: true, unique: true, indexed: true, createdDate: '10/12/2024', version: 1 },
    { id: 'attr-19', fieldName: 'unit_name', displayName: 'Tên đơn vị', dataType: 'string', length: 255, required: true, unique: false, indexed: true, createdDate: '10/12/2024', version: 1 },
    { id: 'attr-20', fieldName: 'parent_code', displayName: 'Đơn vị cấp trên', dataType: 'string', length: 20, required: false, unique: false, indexed: false, createdDate: '10/12/2024', version: 1 },
    { id: 'attr-21', fieldName: 'level', displayName: 'Cấp đơn vị', dataType: 'number', required: true, unique: false, indexed: false, createdDate: '10/12/2024', version: 1 },
  ],
};

const fieldDataTypeLabels: Record<FieldDataType, string> = {
  string: 'Chuỗi (String)',
  number: 'Số (Number)',
  date: 'Ngày (Date)',
  datetime: 'Ngày giờ (DateTime)',
  boolean: 'Luận lý (Boolean)',
  text: 'Văn bản dài (Text)',
  email: 'Email',
  phone: 'Số điện thoại',
  url: 'URL'
};

const DLDC_DATABASES = [
  { id: 'hotich', label: 'CSDL Hộ tịch điện tử' },
  { id: 'cccd', label: 'CSDL Căn cước công dân' },
  { id: 'dkkd', label: 'CSDL Đăng ký kinh doanh' },
  { id: 'lltp', label: 'CSDL Lý lịch tư pháp' },
  { id: 'btdp', label: 'CSDL Bổ trợ tư pháp' },
];

const DLDC_TABLES: Record<string, { id: string; displayName: string }[]> = {
  hotich: [
    { id: 'tbl_citizen', displayName: 'Hồ sơ công dân' },
    { id: 'tbl_khaisinh', displayName: 'Khai sinh' },
    { id: 'tbl_kethon', displayName: 'Kết hôn' },
    { id: 'tbl_ly_hon', displayName: 'Ly hôn' },
    { id: 'tbl_khai_tu', displayName: 'Khai tử' },
  ],
  cccd: [
    { id: 'tbl_cccd_info', displayName: 'Thông tin CCCD' },
    { id: 'tbl_nhan_dang', displayName: 'Dữ liệu nhận dạng' },
  ],
  dkkd: [
    { id: 'tbl_organization', displayName: 'Tổ chức / Doanh nghiệp' },
    { id: 'tbl_ho_kinh_doanh', displayName: 'Hộ kinh doanh' },
    { id: 'tbl_giay_phep', displayName: 'Giấy phép kinh doanh' },
  ],
  lltp: [
    { id: 'tbl_lich_su', displayName: 'Lịch sử tư pháp' },
  ],
  btdp: [
    { id: 'tbl_luat_su', displayName: 'Luật sư' },
    { id: 'tbl_cong_chung', displayName: 'Công chứng viên' },
  ],
};

const DLDC_FIELDS: Record<string, { fieldName: string; displayName: string; dataType: FieldDataType }[]> = {
  tbl_citizen: [
    { fieldName: 'citizen_id', displayName: 'Số CCCD', dataType: 'string' },
    { fieldName: 'full_name', displayName: 'Họ và tên', dataType: 'string' },
    { fieldName: 'date_of_birth', displayName: 'Ngày sinh', dataType: 'date' },
    { fieldName: 'gender', displayName: 'Giới tính', dataType: 'string' },
    { fieldName: 'address', displayName: 'Địa chỉ thường trú', dataType: 'text' },
    { fieldName: 'email', displayName: 'Email', dataType: 'email' },
    { fieldName: 'phone_number', displayName: 'Số điện thoại', dataType: 'phone' },
  ],
  tbl_khaisinh: [
    { fieldName: 'ma_khai_sinh', displayName: 'Mã khai sinh', dataType: 'string' },
    { fieldName: 'ho_ten', displayName: 'Họ và tên', dataType: 'string' },
    { fieldName: 'ngay_sinh', displayName: 'Ngày sinh', dataType: 'date' },
    { fieldName: 'gioi_tinh', displayName: 'Giới tính', dataType: 'string' },
    { fieldName: 'noi_sinh', displayName: 'Nơi sinh', dataType: 'string' },
    { fieldName: 'ten_cha', displayName: 'Tên cha', dataType: 'string' },
    { fieldName: 'ten_me', displayName: 'Tên mẹ', dataType: 'string' },
  ],
  tbl_kethon: [
    { fieldName: 'ma_ket_hon', displayName: 'Mã đăng ký kết hôn', dataType: 'string' },
    { fieldName: 'ten_vo_chong_1', displayName: 'Họ tên vợ/chồng 1', dataType: 'string' },
    { fieldName: 'ten_vo_chong_2', displayName: 'Họ tên vợ/chồng 2', dataType: 'string' },
    { fieldName: 'ngay_ket_hon', displayName: 'Ngày đăng ký kết hôn', dataType: 'date' },
  ],
  tbl_ly_hon: [
    { fieldName: 'ma_ly_hon', displayName: 'Mã đăng ký ly hôn', dataType: 'string' },
    { fieldName: 'ten_vo', displayName: 'Họ tên vợ', dataType: 'string' },
    { fieldName: 'ten_chong', displayName: 'Họ tên chồng', dataType: 'string' },
    { fieldName: 'ngay_ly_hon', displayName: 'Ngày ly hôn', dataType: 'date' },
  ],
  tbl_khai_tu: [
    { fieldName: 'ma_khai_tu', displayName: 'Mã khai tử', dataType: 'string' },
    { fieldName: 'ho_ten', displayName: 'Họ và tên', dataType: 'string' },
    { fieldName: 'ngay_mat', displayName: 'Ngày mất', dataType: 'date' },
    { fieldName: 'noi_mat', displayName: 'Nơi mất', dataType: 'string' },
  ],
  tbl_organization: [
    { fieldName: 'org_id', displayName: 'Mã tổ chức', dataType: 'string' },
    { fieldName: 'org_name', displayName: 'Tên tổ chức', dataType: 'string' },
    { fieldName: 'tax_code', displayName: 'Mã số thuế', dataType: 'string' },
    { fieldName: 'founded_date', displayName: 'Ngày thành lập', dataType: 'date' },
    { fieldName: 'address', displayName: 'Địa chỉ trụ sở', dataType: 'text' },
    { fieldName: 'phone', displayName: 'Số điện thoại', dataType: 'phone' },
    { fieldName: 'email', displayName: 'Email', dataType: 'email' },
    { fieldName: 'website', displayName: 'Website', dataType: 'url' },
  ],
  tbl_cccd_info: [
    { fieldName: 'so_cccd', displayName: 'Số CCCD', dataType: 'string' },
    { fieldName: 'ho_ten', displayName: 'Họ và tên', dataType: 'string' },
    { fieldName: 'ngay_sinh', displayName: 'Ngày sinh', dataType: 'date' },
    { fieldName: 'gioi_tinh', displayName: 'Giới tính', dataType: 'string' },
    { fieldName: 'que_quan', displayName: 'Quê quán', dataType: 'string' },
    { fieldName: 'thuong_tru', displayName: 'Địa chỉ thường trú', dataType: 'text' },
    { fieldName: 'ngay_cap', displayName: 'Ngày cấp', dataType: 'date' },
    { fieldName: 'noi_cap', displayName: 'Nơi cấp', dataType: 'string' },
  ],
  tbl_nhan_dang: [
    { fieldName: 'ma_nhan_dang', displayName: 'Mã nhận dạng', dataType: 'string' },
    { fieldName: 'van_tay', displayName: 'Vân tay', dataType: 'string' },
    { fieldName: 'khuon_mat', displayName: 'Khuôn mặt', dataType: 'string' },
  ],
};

const MOCK_APPROVERS = [
  { id: 'a1', name: 'Nguyễn Văn An', position: 'Trưởng phòng', department: 'Phòng Quản lý dữ liệu' },
  { id: 'a2', name: 'Trần Thị Bình', position: 'Phó Cục trưởng', department: 'Cục Hành chính tư pháp' },
  { id: 'a3', name: 'Lê Minh Cường', position: 'Chuyên viên cao cấp', department: 'Vụ Kế hoạch - Tài chính' },
  { id: 'a4', name: 'Phạm Quốc Hùng', position: 'Cục trưởng', department: 'Cục Công nghệ thông tin' },
  { id: 'a5', name: 'Hoàng Thị Lan', position: 'Trưởng phòng', department: 'Phòng Nghiệp vụ pháp lý' },
];

export function AttributesManagementTab() {
  const [selectedEntity, setSelectedEntity] = useState<string>('1');
  const [attributes, setAttributes] = useState<Record<string, MasterDataAttribute[]>>(defaultAttributes);
  const [showForm, setShowForm] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<MasterDataAttribute | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [selectedAttributeHistory, setSelectedAttributeHistory] = useState<string | null>(null);

  // Combobox states
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [comboboxSearch, setComboboxSearch] = useState('');
  const comboboxRef = useRef<HTMLDivElement | null>(null);

  // Pagination
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // DLDC field configuration modal
  const [showDldcModal, setShowDldcModal] = useState(false);
  const [dldcFieldRows, setDldcFieldRows] = useState<DldcFieldRow[]>([]);
  const [modalUseJoin, setModalUseJoin] = useState(false);
  const [modalDldcJoins, setModalDldcJoins] = useState<DldcJoin[]>([]);
  const [showStructureApprovalModal, setShowStructureApprovalModal] = useState(false);

  // Delete confirmation modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAttr, setDeletingAttr] = useState<MasterDataAttribute | null>(null);

  // Gửi trình duyệt modal (shown after add/edit)
  const [approvalAttribute, setApprovalAttribute] = useState<MasterDataAttribute | null>(null);
  const [selectedApprover, setSelectedApprover] = useState('');
  const [approvalNote, setApprovalNote] = useState('');

  const [formData, setFormData] = useState<Partial<MasterDataAttribute>>({
    fieldName: '',
    displayName: '',
    dataType: 'string',
    required: false,
    unique: false,
    indexed: false
  });

  const currentEntityAttributes = attributes[selectedEntity] || [];
  const filteredAttributes = currentEntityAttributes.filter(attr =>
    attr.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attr.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredAttributes.length / pageSize);
  const paginatedAttributes = filteredAttributes.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const selectedEntityData = mockEntities.find(e => e.id === selectedEntity);

  const mockVersionHistory: VersionHistory[] = [
    { version: 3, changes: 'Thêm validation rules cho email', updatedBy: 'Nguyễn Văn A', updatedDate: '20/12/2024 14:30' },
    { version: 2, changes: 'Thay đổi độ dài từ 100 sang 255', updatedBy: 'Trần Thị B', updatedDate: '15/12/2024 10:15' },
    { version: 1, changes: 'Tạo mới thuộc tính', updatedBy: 'Lê Văn C', updatedDate: '10/12/2024 08:00' },
  ];

  const handleSubmit = () => {
    if (!formData.fieldName || !formData.displayName) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc (Tên trường, Tên hiển thị)');
      return;
    }

    // Validate field name format
    if (!/^[a-z][a-z0-9_]*$/.test(formData.fieldName)) {
      alert('Tên trường phải bắt đầu bằng chữ thường và chỉ chứa chữ thường, số và dấu gạch dưới');
      return;
    }

    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

    const currentAttributes = attributes[selectedEntity] || [];
    let savedAttribute: MasterDataAttribute;

    if (editingAttribute) {
      // Update existing - increment version
      savedAttribute = {
        ...editingAttribute,
        ...formData as MasterDataAttribute,
        version: editingAttribute.version + 1
      };
      const updatedAttributes = currentAttributes.map(attr =>
        attr.id === editingAttribute.id ? savedAttribute : attr
      );
      setAttributes({ ...attributes, [selectedEntity]: updatedAttributes });
    } else {
      // Check if field name already exists
      if (currentAttributes.some(attr => attr.fieldName === formData.fieldName)) {
        alert('Tên trường đã tồn tại. Vui lòng sử dụng tên khác.');
        return;
      }

      // Create new
      savedAttribute = {
        id: `attr-${Date.now()}`,
        fieldName: formData.fieldName!,
        displayName: formData.displayName!,
        dataType: formData.dataType!,
        length: formData.length,
        required: formData.required!,
        unique: formData.unique!,
        indexed: formData.indexed!,
        defaultValue: formData.defaultValue,
        description: formData.description,
        validationRules: formData.validationRules,
        createdDate: dateStr,
        version: 1
      };

      setAttributes({
        ...attributes,
        [selectedEntity]: [...currentAttributes, savedAttribute]
      });
    }

    handleCloseForm();

    // Show "Gửi trình duyệt" modal after add/edit, same flow as tab "Thiết lập thực thể"
    setApprovalAttribute(savedAttribute);
    setSelectedApprover('');
    setApprovalNote('');
  };

  const handleCloseApprovalModal = () => {
    setApprovalAttribute(null);
    setSelectedApprover('');
    setApprovalNote('');
  };

  const handleConfirmApprove = () => {
    if (!approvalAttribute || !selectedApprover) return;
    alert('Đã gửi trình duyệt thuộc tính thành công!');
    handleCloseApprovalModal();
  };

  const handleEdit = (attribute: MasterDataAttribute) => {
    setEditingAttribute(attribute);
    setFormData(attribute);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa thuộc tính này? Thao tác này sẽ tạo phiên bản mới của cấu trúc dữ liệu.')) {
      const currentAttributes = attributes[selectedEntity] || [];
      setAttributes({
        ...attributes,
        [selectedEntity]: currentAttributes.filter(attr => attr.id !== id)
      });
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAttribute(null);
    setFormData({
      fieldName: '',
      displayName: '',
      dataType: 'string',
      required: false,
      unique: false,
      indexed: false
    });
  };

  const handleViewHistory = (attributeId: string) => {
    setSelectedAttributeHistory(attributeId);
    setShowVersionHistory(true);
  };

  const handleOpenDldcModal = () => {
    const entity = mockEntities.find(e => e.id === selectedEntity);
    const currentAttrs = attributes[selectedEntity] || [];
    const rows: DldcFieldRow[] = currentAttrs.map(attr => ({
      id: attr.id,
      shared: true,
      isPK: attr.unique,
      tableId: attr.tableName || entity?.primaryTableId || '',
      sourceJoinId: null,
      columnName: attr.fieldName,
      apiFieldName: attr.displayName,
      dataType: attr.dataType,
      masked: false,
    }));
    setDldcFieldRows(rows);
    setModalUseJoin(false);
    setModalDldcJoins([]);
    setShowDldcModal(true);
  };

  const handleCloseDldcModal = () => {
    setShowDldcModal(false);
    setDldcFieldRows([]);
    setModalUseJoin(false);
    setModalDldcJoins([]);
  };

  const handleJoinTableChange = (joinId: string, newTableId: string) => {
    const oldJoin = modalDldcJoins.find(j => j.id === joinId);
    const oldTableId = oldJoin?.tableId || '';
    setModalDldcJoins(prev => prev.map(j =>
      j.id === joinId ? { ...j, tableId: newTableId, leftField: '', rightField: '' } : j
    ));
    setDldcFieldRows(prev => {
      const filtered = prev.filter(r => r.tableId !== oldTableId);
      if (newTableId) {
        const newRows: DldcFieldRow[] = (DLDC_FIELDS[newTableId] || []).map((f, i) => ({
          id: `fr-join-${joinId}-${i}`,
          shared: true,
          isPK: false,
          tableId: newTableId,
          sourceJoinId: joinId,
          columnName: f.fieldName,
          apiFieldName: f.fieldName,
          dataType: f.dataType,
          masked: false,
        }));
        return [...filtered, ...newRows];
      }
      return filtered;
    });
  };

  const handleAddJoin = () => {
    const newJoin: DldcJoin = {
      id: `join-${Date.now()}`,
      joinType: 'LEFT JOIN',
      tableId: '',
      alias: `t${modalDldcJoins.length + 2}`,
      leftField: '',
      rightField: '',
    };
    setModalDldcJoins(prev => [...prev, newJoin]);
  };

  const handleRemoveJoin = (joinId: string) => {
    const tableIdToRemove = modalDldcJoins.find(j => j.id === joinId)?.tableId || '';
    setModalDldcJoins(prev => prev.filter(j => j.id !== joinId));
    setDldcFieldRows(prev => prev.filter(r => r.tableId !== tableIdToRemove));
  };

  const handleAddDldcRow = () => {
    setDldcFieldRows(rows => [...rows, {
      id: `row-${Date.now()}`,
      shared: true,
      isPK: false,
      tableId: selectedEntityData?.primaryTableId || '',
      sourceJoinId: null,
      columnName: '',
      apiFieldName: '',
      dataType: 'string',
      masked: false,
    }]);
  };

  // Opens the "Gửi trình duyệt" modal for the structure instead of saving immediately
  const handleOpenStructureApproval = () => {
    setShowDldcModal(false);
    setSelectedApprover('');
    setApprovalNote('');
    setShowStructureApprovalModal(true);
  };

  const handleCloseStructureApprovalModal = () => {
    setShowStructureApprovalModal(false);
    setSelectedApprover('');
    setApprovalNote('');
  };

  const handleConfirmDldcStructure = () => {
    if (!selectedApprover) return;
    const entity = mockEntities.find(e => e.id === selectedEntity);
    const dbLabel = DLDC_DATABASES.find(db => db.id === entity?.primaryDatabaseId)?.label || '';
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const currentAttrs = attributes[selectedEntity] || [];
    const newAttrs: MasterDataAttribute[] = dldcFieldRows
      .filter(row => row.shared && row.columnName)
      .map(row => {
        const existing = currentAttrs.find(a => a.id === row.id);
        return {
          id: row.id,
          fieldName: row.columnName,
          displayName: row.apiFieldName || row.columnName,
          dataType: row.dataType,
          required: false,
          unique: row.isPK,
          indexed: row.isPK,
          databaseName: dbLabel,
          tableName: row.tableId,
          createdDate: existing?.createdDate || dateStr,
          version: existing ? existing.version + 1 : 1,
        };
      });
    setAttributes({ ...attributes, [selectedEntity]: newAttrs });
    handleCloseDldcModal();
    handleCloseStructureApprovalModal();
    alert('Đã gửi trình duyệt cấu trúc thành công!');
  };

  const handleOpenDeleteConfirm = (attribute: MasterDataAttribute) => {
    setDeletingAttr(attribute);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (!deletingAttr) return;
    const currentAttributes = attributes[selectedEntity] || [];
    setAttributes({ ...attributes, [selectedEntity]: currentAttributes.filter(attr => attr.id !== deletingAttr.id) });
    setShowDeleteConfirm(false);
    setDeletingAttr(null);
  };

  // Close combobox when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setComboboxOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter entities based on search
  const filteredEntities = mockEntities.filter(entity =>
    entity.name.toLowerCase().includes(comboboxSearch.toLowerCase()) ||
    entity.code.toLowerCase().includes(comboboxSearch.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-slate-900">Quản lý thuộc tính dữ liệu chủ</h2>
      </div>

      {/* Entity Selection */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <label className="block text-[13px] text-slate-700 mb-2">
          Chọn thực thể dữ liệu chủ <span className="text-red-600">*</span>
        </label>
        <div ref={comboboxRef} className="relative">
          <button
            type="button"
            className="w-full px-4 py-2 border border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-[13px]"
            onClick={() => setComboboxOpen(!comboboxOpen)}
          >
            <div className="flex items-center justify-between">
              <div>
                {selectedEntityData ? (
                  <div>
                    <span className="text-[13px] text-slate-900">{selectedEntityData.code}</span>
                    <span className="text-[13px] text-slate-600"> - {selectedEntityData.name}</span>
                  </div>
                ) : (
                  <span className="text-[13px] text-slate-500">Chọn thực thể dữ liệu chủ...</span>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${comboboxOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>
          {comboboxOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-slate-300 rounded-lg shadow-lg max-h-64 overflow-hidden flex flex-col">
              <div className="p-2 border-b border-slate-200">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={comboboxSearch}
                    onChange={(e) => setComboboxSearch(e.target.value)}
                    placeholder="Tìm kiếm theo mã hoặc tên..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    autoFocus
                  />
                </div>
              </div>
              <ul className="overflow-y-auto max-h-52">
                {filteredEntities.length === 0 ? (
                  <li className="px-4 py-8 text-center text-[13px] text-slate-500">
                    Không tìm thấy thực thể phù hợp
                  </li>
                ) : (
                  filteredEntities.map(entity => (
                    <li key={entity.id}>
                      <button
                        type="button"
                        className={`w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors ${selectedEntity === entity.id ? 'bg-blue-50' : ''
                          }`}
                        onClick={() => {
                          setSelectedEntity(entity.id);
                          setComboboxOpen(false);
                          setComboboxSearch('');
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[13px] text-slate-900">{entity.code}</span>
                            <span className="text-[13px] text-slate-600"> - {entity.name}</span>
                          </div>
                          {selectedEntity === entity.id && (
                            <Check className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Data Source Banner */}
      {selectedEntityData && (
        <div className={`flex items-start gap-3 px-4 py-3 rounded-lg border text-[13px] ${selectedEntityData.dataSource === 'dldc'
          ? 'bg-amber-50 border-amber-200 text-amber-800'
          : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
          <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${selectedEntityData.dataSource === 'dldc' ? 'text-amber-500' : 'text-blue-500'
            }`} />
          <p>
            <span className="font-medium">Thông tin cấu hình:</span> Đang thực hiện cấu hình thuộc tính cho thực thể{' '}
            <strong>{selectedEntityData.name}</strong>.{' '}
            Nguồn dữ liệu:{' '}
            <strong>{selectedEntityData.dataSource === 'dldc' ? 'Đồng bộ Kho DLDC' : 'Nhập thủ công'}</strong>
          </p>
        </div>
      )}

      {/* Add Button */}
      {selectedEntityData && (
        <div className="flex justify-end">
          <button
            onClick={() => selectedEntityData.dataSource === 'dldc' ? handleOpenDldcModal() : setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[13px] font-medium"
          >
            <Plus className="w-4 h-4" />
            Thêm thuộc tính
          </button>
        </div>
      )}

      {/* Attributes Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                {selectedEntityData?.dataSource === 'dldc' ? (
                  <>
                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Tên CSDL</th>
                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Tên bảng</th>
                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Tên trường</th>
                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Tên hiển thị</th>
                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Kiểu dữ liệu</th>
                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center w-28">Thao tác</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Tên trường</th>
                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Tên hiển thị</th>
                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Kiểu dữ liệu</th>
                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Độ dài</th>
                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Ràng buộc</th>
                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Giá trị mặc định</th>
                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center w-28">Thao tác</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredAttributes.length === 0 ? (
                <tr>
                  <td colSpan={selectedEntityData?.dataSource === 'dldc' ? 6 : 7} className="px-6 py-10 text-center text-[13px] text-slate-500">
                    {searchTerm ? 'Không tìm thấy thuộc tính phù hợp' : 'Chưa có thuộc tính nào. Nhấn "Thêm thuộc tính" để bắt đầu.'}
                  </td>
                </tr>
              ) : (
                paginatedAttributes.map((attribute) => (
                  <tr key={attribute.id} className="border-t border-slate-100 hover:bg-slate-50/50 transition-all">
                    {selectedEntityData?.dataSource === 'dldc' ? (
                      <>
                        <td className="px-6 py-4 text-[13px] text-slate-700 font-normal">{attribute.databaseName || '—'}</td>
                        <td className="px-6 py-4">
                          <code className="text-[13px] bg-slate-100 px-2 py-1 rounded text-slate-800">{attribute.tableName || '—'}</code>
                        </td>
                        <td className="px-6 py-4">
                          <code className="text-[13px] bg-slate-100 px-2 py-1 rounded text-slate-800">{attribute.fieldName}</code>
                        </td>
                        <td className="px-6 py-4 text-[13px] text-slate-900 font-normal">{attribute.displayName}</td>
                        <td className="px-6 py-4 text-[13px] text-slate-700 font-normal">{fieldDataTypeLabels[attribute.dataType]}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4">
                          <code className="text-[13px] bg-slate-100 px-2 py-1 rounded text-slate-800">{attribute.fieldName}</code>
                        </td>
                        <td className="px-6 py-4 text-[13px] text-slate-900 font-normal">{attribute.displayName}</td>
                        <td className="px-6 py-4 text-[13px] text-slate-700 font-normal">{fieldDataTypeLabels[attribute.dataType]}</td>
                        <td className="px-6 py-4 text-[13px] text-slate-700 font-normal">{attribute.length || '-'}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {attribute.required && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] bg-red-50 text-red-700 border border-red-100">Bắt buộc</span>
                            )}
                            {attribute.unique && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] bg-purple-50 text-purple-700 border border-purple-100">Duy nhất</span>
                            )}
                            {attribute.indexed && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] bg-blue-50 text-blue-700 border border-blue-100">Index</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[13px] text-slate-700 font-normal">{attribute.defaultValue || '—'}</td>
                      </>
                    )}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => selectedEntityData?.dataSource === 'dldc' ? handleOpenDldcModal() : handleEdit(attribute)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 cursor-pointer transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => selectedEntityData?.dataSource === 'dldc' ? handleOpenDeleteConfirm(attribute) : handleDelete(attribute.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
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
        {filteredAttributes.length > 0 && (
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
                {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredAttributes.length)} / {filteredAttributes.length}
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

      {/* Form Modal — manual entity add/edit */}
      <BaseModal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editingAttribute ? 'Chỉnh sửa thuộc tính' : 'Thêm thuộc tính mới'}
        subtitle="Điền đầy đủ thông tin để cấu hình thuộc tính dữ liệu chủ"
        maxWidth="max-w-2xl"
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
              <Check className="w-4 h-4" />
              Gửi duyệt thực thể

            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1">
              Tên trường <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.fieldName}
              onChange={(e) => setFormData({ ...formData, fieldName: e.target.value.toLowerCase() })}
              placeholder="VD: citizen_id, full_name, date_of_birth"
              disabled={!!editingAttribute}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
            />
            <p className="text-[12px] text-slate-500 mt-1">Chỉ sử dụng chữ thường, số và dấu gạch dưới. Bắt đầu bằng chữ cái.</p>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1">
              Tên hiển thị <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              placeholder="VD: Số CCCD, Họ và tên, Ngày sinh"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1">
              Kiểu dữ liệu <span className="text-red-600">*</span>
            </label>
            <select
              value={formData.dataType}
              onChange={(e) => setFormData({ ...formData, dataType: e.target.value as FieldDataType })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            >
              {Object.entries(fieldDataTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {(['string', 'email', 'phone', 'url'] as FieldDataType[]).includes(formData.dataType!) && (
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1">Độ dài tối đa</label>
              <input
                type="number"
                value={formData.length || ''}
                onChange={(e) => setFormData({ ...formData, length: parseInt(e.target.value) || undefined })}
                placeholder="VD: 255"
                min="1"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
          )}

          <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
            <h4 className="text-[13px] font-medium text-slate-800">Ràng buộc</h4>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.required} onChange={(e) => setFormData({ ...formData, required: e.target.checked })} className="accent-blue-600 w-4 h-4" />
              <span className="text-[13px] text-slate-700">Bắt buộc (Required) — Trường này không được để trống</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.unique} onChange={(e) => setFormData({ ...formData, unique: e.target.checked })} className="accent-blue-600 w-4 h-4" />
              <span className="text-[13px] text-slate-700">Duy nhất (Unique) — Giá trị không được trùng lặp</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.indexed} onChange={(e) => setFormData({ ...formData, indexed: e.target.checked })} className="accent-blue-600 w-4 h-4" />
              <span className="text-[13px] text-slate-700">Đánh chỉ mục (Indexed) — Tối ưu hóa tìm kiếm</span>
            </label>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1">Giá trị mặc định</label>
            <input
              type="text"
              value={formData.defaultValue || ''}
              onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
              placeholder="VD: Nam, 0, true"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>

          {editingAttribute ? (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-[13px] text-amber-800">
                <p className="mb-1">Khi chỉnh sửa, phiên bản sẽ tự động tăng từ <strong>v{editingAttribute.version}</strong> lên <strong>v{editingAttribute.version + 1}</strong>.</p>
                <p>Thay đổi này sẽ được ghi nhận trong lịch sử phiên bản.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-[13px] text-amber-800">
                <p className="mb-1">Khi thêm mới thuộc tính, phiên bản thực thể dữ liệu chủ sẽ tăng lên <strong>v2.0</strong>.</p>
                <p>Thay đổi này sẽ được ghi nhận trong lịch sử phiên bản.</p>
              </div>
            </div>
          )}
        </div>
      </BaseModal>

      {/* Gửi trình duyệt Modal — shown after add/edit, same pattern as tab "Thiết lập thực thể" */}
      {approvalAttribute && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-bold text-slate-900">Gửi trình duyệt</h3>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  Thuộc tính: <span className="text-indigo-700 font-medium">{approvalAttribute.displayName}</span>
                </p>
              </div>
              <button
                onClick={handleCloseApprovalModal}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
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
                <h4 className="text-[13px] font-semibold text-slate-700 mb-3">Thông tin thuộc tính</h4>
                <div className="space-y-2 text-[13px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tên trường:</span>
                    <code className="px-2 py-0.5 bg-white border border-slate-200 text-indigo-700 rounded text-[12px]">
                      {approvalAttribute.fieldName}
                    </code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Kiểu dữ liệu:</span>
                    <span className="text-slate-800 font-medium">{approvalAttribute.dataType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Thuộc thực thể:</span>
                    <span className="text-slate-800 font-medium">{selectedEntityData?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phiên bản mới:</span>
                    <span className="text-slate-800">v{approvalAttribute.version}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
              <button
                onClick={handleCloseApprovalModal}
                className="bg-white text-[#020817] border border-[#e2e8f0] hover:bg-slate-50 px-4 py-2 rounded-lg font-medium text-[13px] transition-colors cursor-pointer shadow-sm"
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
            </div>
          </div>
        </div>
      )}

      {/* DLDC Field Configuration Modal */}
      <BaseModal
        isOpen={showDldcModal}
        onClose={handleCloseDldcModal}
        title="Cấu hình nguồn dữ liệu"
        subtitle="Kho dữ liệu từ nguồn đồng bộ và cấu hình các trường"
        maxWidth="max-w-5xl"
        customHeaderIcon={<Database className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />}
        footer={
          <>
            <button
              onClick={handleCloseDldcModal}
              className="px-4 py-2 text-[13px] text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleOpenStructureApproval}
              className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send className="w-4 h-4" />
              Gửi duyệt cấu trúc
            </button>
          </>
        }
      >
        <div className="space-y-4 text-left">
          {/* Blue header card with Join toggle */}
          <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 bg-blue-600 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-white" />
                <p className="text-[13px] font-semibold text-white">Cấu hình nguồn dữ liệu</p>
              </div>
              <button
                type="button"
                onClick={() => setModalUseJoin(v => !v)}
                className="flex items-center gap-2 text-white text-[12px] cursor-pointer"
              >
                <span>Sử dụng liên kết bảng (Join)</span>
                <div className={`relative inline-flex h-5 w-9 items-center rounded-full border border-white/40 transition-colors ${modalUseJoin ? 'bg-white/30' : 'bg-blue-500'}`}>
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${modalUseJoin ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </div>
              </button>
            </div>

            {/* Sub-info bar */}
            <div className="px-5 py-2.5 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
              <p className="text-[13px] text-blue-700">
                Kho dữ liệu:{' '}
                <span className="font-semibold">{DLDC_DATABASES.find(db => db.id === selectedEntityData?.primaryDatabaseId)?.label || '—'}</span>
                {' — '}
                <span className="font-semibold">{(DLDC_TABLES[selectedEntityData?.primaryDatabaseId || ''] || []).find(t => t.id === selectedEntityData?.primaryTableId)?.displayName || '—'}</span>
              </p>
            </div>

            <div className="p-5 space-y-4">
              {/* DB + Table (disabled) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-slate-600">Cơ sở dữ liệu</label>
                  <div className="relative">
                    <select disabled value={selectedEntityData?.primaryDatabaseId || ''}
                      className="w-full pl-3 pr-8 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-slate-50 text-slate-500 appearance-none focus:outline-none cursor-not-allowed font-medium">
                      <option value="">—</option>
                      {DLDC_DATABASES.map(db => <option key={db.id} value={db.id}>{db.label}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-slate-600">Bảng dữ liệu chính</label>
                  <div className="relative">
                    <select disabled value={selectedEntityData?.primaryTableId || ''}
                      className="w-full pl-3 pr-8 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-slate-50 text-slate-500 appearance-none focus:outline-none cursor-not-allowed font-medium">
                      <option value="">—</option>
                      {(DLDC_TABLES[selectedEntityData?.primaryDatabaseId || ''] || []).map(t => (
                        <option key={t.id} value={t.id}>{t.displayName} ({t.id})</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Join cards — shown when toggle is ON */}
              {modalUseJoin && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-semibold text-slate-700">Bảng liên kết bổ sung ({modalDldcJoins.length})</p>
                    <button type="button" onClick={handleAddJoin}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 text-blue-600 text-[13px] font-medium rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                      <Plus className="w-3.5 h-3.5" />
                      Thêm bảng liên kết
                    </button>
                  </div>

                  {modalDldcJoins.map((join) => {
                    const joinFields = DLDC_FIELDS[join.tableId] || [];
                    const primaryFields = DLDC_FIELDS[selectedEntityData?.primaryTableId || ''] || [];
                    return (
                      <div key={join.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-4 relative animate-in fade-in zoom-in-95 duration-200">
                        <button type="button" onClick={() => handleRemoveJoin(join.id)}
                          className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer" title="Xóa liên kết">
                          <X className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-[13px] font-medium text-slate-600">Loại liên kết (Join Type)</label>
                            <div className="relative">
                              <select value={join.joinType}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) => setModalDldcJoins(prev => prev.map(j => j.id === join.id ? { ...j, joinType: e.target.value as DldcJoin['joinType'] } : j))}
                                className="w-full pl-3 pr-8 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium cursor-pointer">
                                <option value="LEFT JOIN">LEFT JOIN</option>
                                <option value="INNER JOIN">INNER JOIN</option>
                                <option value="RIGHT JOIN">RIGHT JOIN</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="block text-[13px] font-medium text-slate-600">Bảng liên kết (Table)</label>
                            <div className="relative">
                              <select value={join.tableId}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) => handleJoinTableChange(join.id, e.target.value)}
                                className="w-full pl-3 pr-8 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium cursor-pointer">
                                <option value="">-- Chọn bảng --</option>
                                {(DLDC_TABLES[selectedEntityData?.primaryDatabaseId || ''] || [])
                                  .filter(t => t.id !== selectedEntityData?.primaryTableId)
                                  .map(t => <option key={t.id} value={t.id}>{t.displayName} ({t.id})</option>)}
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="block text-[13px] font-medium text-slate-600">Bảng phụ danh định (Alias)</label>
                            <input type="text" disabled value={join.alias}
                              className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg text-[13px] font-mono outline-none cursor-not-allowed font-medium" />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[13px] font-medium text-slate-600">Điều kiện liên kết (Join Condition)</label>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 relative">
                              <select value={join.leftField}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) => setModalDldcJoins(prev => prev.map(j => j.id === join.id ? { ...j, leftField: e.target.value } : j))}
                                className="w-full pl-3 pr-8 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium cursor-pointer">
                                <option value="">-- {join.alias}.field --</option>
                                {joinFields.map(f => <option key={f.fieldName} value={`${join.alias}.${f.fieldName}`}>{join.alias}.{f.fieldName}</option>)}
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                            <div className="w-8 h-9 flex items-center justify-center bg-slate-100 rounded-lg border border-slate-200 text-slate-600 font-bold text-[13px] flex-shrink-0">=</div>
                            <div className="flex-1 relative">
                              <select value={join.rightField}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) => setModalDldcJoins(prev => prev.map(j => j.id === join.id ? { ...j, rightField: e.target.value } : j))}
                                className="w-full pl-3 pr-8 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium cursor-pointer">
                                <option value="">-- {selectedEntityData?.primaryTableId}.field --</option>
                                {primaryFields.map(f => <option key={f.fieldName} value={`${selectedEntityData?.primaryTableId}.${f.fieldName}`}>{selectedEntityData?.primaryTableId}.{f.fieldName}</option>)}
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Field Selection table */}
          <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-500" />
                <p className="text-[13px] font-semibold text-slate-700">Chọn trường dữ liệu chia sẻ (Field Selection)</p>
                <span className="text-[13px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                  {dldcFieldRows.filter(r => r.shared).length}/{dldcFieldRows.length} trường được chọn
                </span>
              </div>
              <button type="button" onClick={handleAddDldcRow}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 text-blue-600 text-[13px] font-medium rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                <Plus className="w-3.5 h-3.5" />
                Thêm trường dữ liệu
              </button>
            </div>
            <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
              <table className="w-full text-left text-[13px]" style={{ tableLayout: 'fixed' }}>
                <colgroup>
                  <col style={{ width: '6%' }} />
                  <col style={{ width: '6%' }} />
                  <col style={{ width: '22%' }} />
                  <col style={{ width: '22%' }} />
                  <col style={{ width: '24%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '5%' }} />
                </colgroup>
                <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-[2]">
                  <tr>
                    <th className="px-3 py-3 text-[13px] font-semibold text-slate-500 text-center">Chia sẻ</th>
                    <th className="px-3 py-3 text-[13px] font-semibold text-slate-500 text-center">PK</th>
                    <th className="px-3 py-3 text-[13px] font-semibold text-slate-500">Nguồn dữ liệu (Table)</th>
                    <th className="px-3 py-3 text-[13px] font-semibold text-slate-500">Trường gốc (Column)</th>
                    <th className="px-3 py-3 text-[13px] font-semibold text-slate-500">Tên hiển thị</th>
                    <th className="px-3 py-3 text-[13px] font-semibold text-slate-500">Kiểu dữ liệu</th>
                    <th className="px-3 py-3 text-[13px] font-semibold text-slate-500 text-center">Xóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {dldcFieldRows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-[13px] text-slate-400">
                        Chưa có trường nào. Nhấn "+ Thêm trường dữ liệu" để bắt đầu.
                      </td>
                    </tr>
                  ) : (
                    dldcFieldRows.map(row => {
                      const tableFields = DLDC_FIELDS[row.tableId] || [];
                      const primaryTableId = selectedEntityData?.primaryTableId || '';
                      return (
                        <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-3 py-2.5 text-center overflow-hidden">
                            <input type="checkbox" checked={row.shared}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => setDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, shared: e.target.checked } : r))}
                              className="w-4 h-4 rounded text-blue-600 border-slate-300 cursor-pointer accent-blue-600" />
                          </td>
                          <td className="px-3 py-2.5 text-center overflow-hidden">
                            <input type="checkbox" checked={row.isPK}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => setDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, isPK: e.target.checked } : r))}
                              className="w-4 h-4 rounded text-amber-500 border-slate-300 cursor-pointer accent-amber-500" />
                          </td>
                          <td className="px-3 py-2.5 overflow-hidden">
                            <select value={row.tableId}
                              onChange={(e: ChangeEvent<HTMLSelectElement>) => setDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, tableId: e.target.value, columnName: '', apiFieldName: '' } : r))}
                              className="w-full min-w-0 px-2 py-1.5 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-400/40 focus:border-blue-400 font-medium cursor-pointer">
                              <option value="">--</option>
                              <option value={primaryTableId}>{primaryTableId}</option>
                              {modalDldcJoins.filter(j => j.tableId).map(j => (
                                <option key={j.id} value={j.tableId}>{j.tableId} ({j.alias})</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-2.5 overflow-hidden">
                            <select value={row.columnName}
                              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                const f = tableFields.find(f => f.fieldName === e.target.value);
                                setDldcFieldRows(prev => prev.map(r => r.id === row.id ? {
                                  ...r, columnName: e.target.value, apiFieldName: e.target.value,
                                  dataType: f?.dataType || r.dataType
                                } : r));
                              }}
                              className="w-full min-w-0 px-2 py-1.5 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-400/40 focus:border-blue-400 font-medium cursor-pointer">
                              <option value="">--</option>
                              {tableFields.map(f => <option key={f.fieldName} value={f.fieldName}>{f.fieldName}</option>)}
                            </select>
                          </td>
                          <td className="px-3 py-2.5 overflow-hidden">
                            <input type="text" value={row.apiFieldName}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => setDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, apiFieldName: e.target.value } : r))}
                              className="w-full min-w-0 px-2 py-1.5 border border-slate-200 rounded-lg text-[13px] font-mono bg-white focus:outline-none focus:ring-1 focus:ring-blue-400/40 focus:border-blue-400" />
                          </td>
                          <td className="px-3 py-2.5 overflow-hidden">
                            <select value={row.dataType}
                              onChange={(e: ChangeEvent<HTMLSelectElement>) => setDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, dataType: e.target.value as FieldDataType } : r))}
                              className="w-full min-w-0 px-2 py-1.5 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none font-sans">
                              {Object.entries(fieldDataTypeLabels).map(([val, label]) => (
                                <option key={val} value={val}>{label}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-2.5 text-center overflow-hidden">
                            <button type="button"
                              onClick={() => setDldcFieldRows(prev => prev.filter(r => r.id !== row.id))}
                              className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-[13px] text-amber-800">
              <p className="mb-1">Khi gửi duyệt cấu trúc, phiên bản của các thuộc tính thuộc cấu trúc này sẽ tự động tăng lên.</p>
              <p>Thay đổi này sẽ được ghi nhận trong lịch sử phiên bản.</p>
            </div>
          </div>
        </div>
      </BaseModal>

      {/* Gửi trình duyệt cấu trúc Modal — shown when confirming "Gửi duyệt cấu trúc" for DLDC source */}
      {showStructureApprovalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-bold text-slate-900">Gửi trình duyệt cấu trúc</h3>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  Thực thể: <span className="text-indigo-700 font-medium">{selectedEntityData?.name}</span>
                </p>
              </div>
              <button
                onClick={handleCloseStructureApprovalModal}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
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
                <h4 className="text-[13px] font-semibold text-slate-700 mb-3">Thông tin cấu trúc</h4>
                <div className="space-y-2 text-[13px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mã dữ liệu chủ:</span>
                    <code className="px-2 py-0.5 bg-white border border-slate-200 text-indigo-700 rounded text-[12px]">
                      {selectedEntityData?.code}
                    </code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Kho dữ liệu:</span>
                    <span className="text-slate-800 font-medium">
                      {DLDC_DATABASES.find(db => db.id === selectedEntityData?.primaryDatabaseId)?.label || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Số trường chia sẻ:</span>
                    <span className="text-slate-800 font-medium">
                      {dldcFieldRows.filter(r => r.shared && r.columnName).length}/{dldcFieldRows.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
              <button
                onClick={handleCloseStructureApprovalModal}
                className="bg-white text-[#020817] border border-[#e2e8f0] hover:bg-slate-50 px-4 py-2 rounded-lg font-medium text-[13px] transition-colors cursor-pointer shadow-sm"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDldcStructure}
                disabled={!selectedApprover}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-[13px] transition-colors shadow-sm ${selectedApprover
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
              >
                <Send className="w-4 h-4" />
                Gửi trình duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <BaseModal
        isOpen={showDeleteConfirm && !!deletingAttr}
        onClose={() => { setShowDeleteConfirm(false); setDeletingAttr(null); }}
        title="Xác nhận xóa trường"
        maxWidth="max-w-md"
        footer={
          <>
            <button
              onClick={() => { setShowDeleteConfirm(false); setDeletingAttr(null); }}
              className="px-4 py-2 text-[13px] text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirmDelete}
              className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Xác nhận xóa
            </button>
          </>
        }
      >
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-[13px] text-red-700">
            Bạn có chắc chắn muốn xóa trường{' '}
            <strong>{deletingAttr?.displayName}</strong>{' '}
            (<code className="bg-red-100 px-1 py-0.5 rounded text-[12px]">{deletingAttr?.fieldName}</code>)?{' '}
            Thao tác này không thể hoàn tác.
          </p>
        </div>
      </BaseModal>

      {/* Version History Modal */}
      <BaseModal
        isOpen={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
        title="Lịch sử phiên bản"
        subtitle="Toàn bộ thay đổi đã được ghi nhận theo phiên bản"
        maxWidth="max-w-2xl"
        footer={
          <button
            onClick={() => setShowVersionHistory(false)}
            className="px-4 py-2 text-[13px] text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Đóng
          </button>
        }
      >
        <div className="space-y-4">
          {mockVersionHistory.map((history) => (
            <div key={history.version} className="flex gap-4 pb-4 border-b border-slate-100 last:border-0">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-[13px] font-semibold text-blue-600">v{history.version}</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-[13px] text-slate-900">{history.changes}</p>
                <div className="flex items-center gap-4 mt-1.5 text-[12px] text-slate-500">
                  <span>Người cập nhật: {history.updatedBy}</span>
                  <span>Ngày: {history.updatedDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </BaseModal>
    </div>
  );
}