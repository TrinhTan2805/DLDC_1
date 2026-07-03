import { useState, useRef, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Search, History as HistoryIcon, Check, AlertCircle, ChevronDown } from 'lucide-react';

type FieldDataType = 'string' | 'number' | 'date' | 'datetime' | 'boolean' | 'text' | 'email' | 'phone' | 'url';
type DataSourceType = 'dldc' | 'manual';

interface MasterDataEntity {
  id: string;
  code: string;
  name: string;
  dataSource: DataSourceType;
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
  { id: '1', code: 'MD-CITIZEN-001', name: 'Bộ dữ liệu chủ Công dân',          dataSource: 'dldc'   },
  { id: '2', code: 'MD-ORG-001',     name: 'Bộ dữ liệu chủ Tổ chức',           dataSource: 'dldc'   },
  { id: '3', code: 'MD-DOC-001',     name: 'Bộ dữ liệu chủ Văn bản pháp luật', dataSource: 'manual' },
  { id: '4', code: 'MD-ADMIN-001',   name: 'Bộ dữ liệu chủ Đơn vị hành chính', dataSource: 'manual' },
  { id: '5', code: 'MD-AGENCY-001',  name: 'Bộ dữ liệu chủ Cơ quan nhà nước',  dataSource: 'dldc'   },
];

const defaultAttributes: Record<string, MasterDataAttribute[]> = {
  // DLDC source — includes databaseName + tableName
  '1': [
    { id: 'attr-1', fieldName: 'citizen_id',   displayName: 'Số CCCD',           dataType: 'string', length: 12,  required: true,  unique: true,  indexed: true,  createdDate: '10/12/2024', version: 1, databaseName: 'CSDL Hộ tịch điện tử',   tableName: 'tbl_citizen'  },
    { id: 'attr-2', fieldName: 'full_name',     displayName: 'Họ và tên',         dataType: 'string', length: 255, required: true,  unique: false, indexed: true,  createdDate: '10/12/2024', version: 1, databaseName: 'CSDL Hộ tịch điện tử',   tableName: 'tbl_citizen'  },
    { id: 'attr-3', fieldName: 'date_of_birth', displayName: 'Ngày sinh',         dataType: 'date',                required: true,  unique: false, indexed: false, createdDate: '10/12/2024', version: 1, databaseName: 'CSDL Hộ tịch điện tử',   tableName: 'tbl_citizen'  },
    { id: 'attr-4', fieldName: 'gender',        displayName: 'Giới tính',         dataType: 'string', length: 10,  required: false, unique: false, indexed: false, createdDate: '10/12/2024', version: 1, databaseName: 'CSDL Hộ tịch điện tử',   tableName: 'tbl_citizen'  },
    { id: 'attr-5', fieldName: 'address',       displayName: 'Địa chỉ thường trú', dataType: 'text',               required: false, unique: false, indexed: false, createdDate: '10/12/2024', version: 1, databaseName: 'CSDL Hộ tịch điện tử',   tableName: 'tbl_citizen'  },
    { id: 'attr-6', fieldName: 'email',         displayName: 'Email',             dataType: 'email',  length: 255, required: false, unique: false, indexed: true,  createdDate: '10/12/2024', version: 1, databaseName: 'CSDL Hộ tịch điện tử',   tableName: 'tbl_citizen'  },
    { id: 'attr-7', fieldName: 'phone_number',  displayName: 'Số điện thoại',     dataType: 'phone',  length: 15,  required: false, unique: false, indexed: true,  createdDate: '10/12/2024', version: 1, databaseName: 'CSDL Hộ tịch điện tử',   tableName: 'tbl_citizen'  },
  ],
  '2': [
    { id: 'attr-8',  fieldName: 'org_id',       displayName: 'Mã tổ chức',        dataType: 'string', length: 20,  required: true,  unique: true,  indexed: true,  createdDate: '10/12/2024', version: 1, databaseName: 'CSDL Đăng ký kinh doanh', tableName: 'tbl_organization' },
    { id: 'attr-9',  fieldName: 'org_name',     displayName: 'Tên tổ chức',       dataType: 'string', length: 500, required: true,  unique: false, indexed: true,  createdDate: '10/12/2024', version: 1, databaseName: 'CSDL Đăng ký kinh doanh', tableName: 'tbl_organization' },
    { id: 'attr-10', fieldName: 'tax_code',     displayName: 'Mã số thuế',        dataType: 'string', length: 13,  required: true,  unique: true,  indexed: true,  createdDate: '10/12/2024', version: 1, databaseName: 'CSDL Đăng ký kinh doanh', tableName: 'tbl_organization' },
    { id: 'attr-11', fieldName: 'founded_date', displayName: 'Ngày thành lập',    dataType: 'date',                required: false, unique: false, indexed: false, createdDate: '10/12/2024', version: 1, databaseName: 'CSDL Đăng ký kinh doanh', tableName: 'tbl_organization' },
    { id: 'attr-12', fieldName: 'address',      displayName: 'Địa chỉ trụ sở',   dataType: 'text',                required: false, unique: false, indexed: false, createdDate: '10/12/2024', version: 1, databaseName: 'CSDL Đăng ký kinh doanh', tableName: 'tbl_organization' },
  ],
  // Manual source — no databaseName/tableName
  '3': [
    { id: 'attr-13', fieldName: 'doc_number',   displayName: 'Số hiệu văn bản',   dataType: 'string', length: 50,  required: true,  unique: true,  indexed: true,  createdDate: '10/12/2024', version: 1 },
    { id: 'attr-14', fieldName: 'doc_title',    displayName: 'Tiêu đề văn bản',   dataType: 'string', length: 500, required: true,  unique: false, indexed: true,  createdDate: '10/12/2024', version: 1 },
    { id: 'attr-15', fieldName: 'issued_date',  displayName: 'Ngày ban hành',     dataType: 'date',                required: true,  unique: false, indexed: false, createdDate: '10/12/2024', version: 1 },
    { id: 'attr-16', fieldName: 'issuing_body', displayName: 'Cơ quan ban hành',  dataType: 'string', length: 255, required: true,  unique: false, indexed: false, createdDate: '10/12/2024', version: 1 },
    { id: 'attr-17', fieldName: 'doc_type',     displayName: 'Loại văn bản',      dataType: 'string', length: 100, required: false, unique: false, indexed: false, createdDate: '10/12/2024', version: 1 },
  ],
  '4': [
    { id: 'attr-18', fieldName: 'unit_code',    displayName: 'Mã đơn vị',         dataType: 'string', length: 20,  required: true,  unique: true,  indexed: true,  createdDate: '10/12/2024', version: 1 },
    { id: 'attr-19', fieldName: 'unit_name',    displayName: 'Tên đơn vị',        dataType: 'string', length: 255, required: true,  unique: false, indexed: true,  createdDate: '10/12/2024', version: 1 },
    { id: 'attr-20', fieldName: 'parent_code',  displayName: 'Đơn vị cấp trên',   dataType: 'string', length: 20,  required: false, unique: false, indexed: false, createdDate: '10/12/2024', version: 1 },
    { id: 'attr-21', fieldName: 'level',        displayName: 'Cấp đơn vị',        dataType: 'number',              required: true,  unique: false, indexed: false, createdDate: '10/12/2024', version: 1 },
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
  { id: 'cccd',   label: 'CSDL Căn cước công dân' },
  { id: 'dkkd',   label: 'CSDL Đăng ký kinh doanh' },
  { id: 'lltp',   label: 'CSDL Lý lịch tư pháp' },
  { id: 'btdp',   label: 'CSDL Bổ trợ tư pháp' },
];

const DLDC_TABLES: Record<string, { id: string; displayName: string }[]> = {
  hotich: [
    { id: 'tbl_citizen',  displayName: 'Hồ sơ công dân' },
    { id: 'tbl_khaisinh', displayName: 'Khai sinh' },
    { id: 'tbl_kethon',   displayName: 'Kết hôn' },
    { id: 'tbl_ly_hon',   displayName: 'Ly hôn' },
    { id: 'tbl_khai_tu',  displayName: 'Khai tử' },
  ],
  cccd: [
    { id: 'tbl_cccd_info', displayName: 'Thông tin CCCD' },
    { id: 'tbl_nhan_dang', displayName: 'Dữ liệu nhận dạng' },
  ],
  dkkd: [
    { id: 'tbl_organization',  displayName: 'Tổ chức / Doanh nghiệp' },
    { id: 'tbl_ho_kinh_doanh', displayName: 'Hộ kinh doanh' },
    { id: 'tbl_giay_phep',     displayName: 'Giấy phép kinh doanh' },
  ],
  lltp: [
    { id: 'tbl_lich_su', displayName: 'Lịch sử tư pháp' },
  ],
  btdp: [
    { id: 'tbl_luat_su',   displayName: 'Luật sư' },
    { id: 'tbl_cong_chung', displayName: 'Công chứng viên' },
  ],
};

const DLDC_FIELDS: Record<string, { fieldName: string; displayName: string; dataType: FieldDataType }[]> = {
  tbl_citizen: [
    { fieldName: 'citizen_id',    displayName: 'Số CCCD',             dataType: 'string' },
    { fieldName: 'full_name',     displayName: 'Họ và tên',           dataType: 'string' },
    { fieldName: 'date_of_birth', displayName: 'Ngày sinh',           dataType: 'date'   },
    { fieldName: 'gender',        displayName: 'Giới tính',           dataType: 'string' },
    { fieldName: 'address',       displayName: 'Địa chỉ thường trú', dataType: 'text'   },
    { fieldName: 'email',         displayName: 'Email',               dataType: 'email'  },
    { fieldName: 'phone_number',  displayName: 'Số điện thoại',       dataType: 'phone'  },
  ],
  tbl_khaisinh: [
    { fieldName: 'ma_khai_sinh', displayName: 'Mã khai sinh',          dataType: 'string' },
    { fieldName: 'ho_ten',       displayName: 'Họ và tên',             dataType: 'string' },
    { fieldName: 'ngay_sinh',    displayName: 'Ngày sinh',             dataType: 'date'   },
    { fieldName: 'gioi_tinh',    displayName: 'Giới tính',             dataType: 'string' },
    { fieldName: 'noi_sinh',     displayName: 'Nơi sinh',              dataType: 'string' },
    { fieldName: 'ten_cha',      displayName: 'Tên cha',               dataType: 'string' },
    { fieldName: 'ten_me',       displayName: 'Tên mẹ',                dataType: 'string' },
  ],
  tbl_kethon: [
    { fieldName: 'ma_ket_hon',     displayName: 'Mã đăng ký kết hôn',    dataType: 'string' },
    { fieldName: 'ten_vo_chong_1', displayName: 'Họ tên vợ/chồng 1',    dataType: 'string' },
    { fieldName: 'ten_vo_chong_2', displayName: 'Họ tên vợ/chồng 2',    dataType: 'string' },
    { fieldName: 'ngay_ket_hon',   displayName: 'Ngày đăng ký kết hôn', dataType: 'date'   },
  ],
  tbl_ly_hon: [
    { fieldName: 'ma_ly_hon',  displayName: 'Mã đăng ký ly hôn', dataType: 'string' },
    { fieldName: 'ten_vo',     displayName: 'Họ tên vợ',         dataType: 'string' },
    { fieldName: 'ten_chong',  displayName: 'Họ tên chồng',      dataType: 'string' },
    { fieldName: 'ngay_ly_hon', displayName: 'Ngày ly hôn',      dataType: 'date'   },
  ],
  tbl_khai_tu: [
    { fieldName: 'ma_khai_tu', displayName: 'Mã khai tử',   dataType: 'string' },
    { fieldName: 'ho_ten',     displayName: 'Họ và tên',    dataType: 'string' },
    { fieldName: 'ngay_mat',   displayName: 'Ngày mất',     dataType: 'date'   },
    { fieldName: 'noi_mat',    displayName: 'Nơi mất',      dataType: 'string' },
  ],
  tbl_organization: [
    { fieldName: 'org_id',       displayName: 'Mã tổ chức',       dataType: 'string' },
    { fieldName: 'org_name',     displayName: 'Tên tổ chức',      dataType: 'string' },
    { fieldName: 'tax_code',     displayName: 'Mã số thuế',       dataType: 'string' },
    { fieldName: 'founded_date', displayName: 'Ngày thành lập',   dataType: 'date'   },
    { fieldName: 'address',      displayName: 'Địa chỉ trụ sở',  dataType: 'text'   },
    { fieldName: 'phone',        displayName: 'Số điện thoại',    dataType: 'phone'  },
    { fieldName: 'email',        displayName: 'Email',            dataType: 'email'  },
    { fieldName: 'website',      displayName: 'Website',          dataType: 'url'    },
  ],
  tbl_cccd_info: [
    { fieldName: 'so_cccd',    displayName: 'Số CCCD',              dataType: 'string' },
    { fieldName: 'ho_ten',     displayName: 'Họ và tên',            dataType: 'string' },
    { fieldName: 'ngay_sinh',  displayName: 'Ngày sinh',            dataType: 'date'   },
    { fieldName: 'gioi_tinh',  displayName: 'Giới tính',            dataType: 'string' },
    { fieldName: 'que_quan',   displayName: 'Quê quán',             dataType: 'string' },
    { fieldName: 'thuong_tru', displayName: 'Địa chỉ thường trú',  dataType: 'text'   },
    { fieldName: 'ngay_cap',   displayName: 'Ngày cấp',             dataType: 'date'   },
    { fieldName: 'noi_cap',    displayName: 'Nơi cấp',              dataType: 'string' },
  ],
  tbl_nhan_dang: [
    { fieldName: 'ma_nhan_dang', displayName: 'Mã nhận dạng', dataType: 'string' },
    { fieldName: 'van_tay',      displayName: 'Vân tay',      dataType: 'string' },
    { fieldName: 'khuon_mat',    displayName: 'Khuôn mặt',   dataType: 'string' },
  ],
};

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

  // DLDC field selection modal
  const [showDldcModal, setShowDldcModal] = useState(false);
  const [dldcModalMode, setDldcModalMode] = useState<'add' | 'edit'>('add');
  const [dldcEditingAttr, setDldcEditingAttr] = useState<MasterDataAttribute | null>(null);
  const [dldcSelectedDb, setDldcSelectedDb] = useState('');
  const [dldcSelectedTable, setDldcSelectedTable] = useState('');
  const [dldcSelectedField, setDldcSelectedField] = useState('');
  const [dldcDisplayName, setDldcDisplayName] = useState('');

  // Delete confirmation modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAttr, setDeletingAttr] = useState<MasterDataAttribute | null>(null);

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

    if (editingAttribute) {
      // Update existing - increment version
      const updatedAttributes = currentAttributes.map(attr =>
        attr.id === editingAttribute.id
          ? {
              ...attr,
              ...formData as MasterDataAttribute,
              version: attr.version + 1
            }
          : attr
      );
      setAttributes({ ...attributes, [selectedEntity]: updatedAttributes });
    } else {
      // Check if field name already exists
      if (currentAttributes.some(attr => attr.fieldName === formData.fieldName)) {
        alert('Tên trường đã tồn tại. Vui lòng sử dụng tên khác.');
        return;
      }

      // Create new
      const newAttribute: MasterDataAttribute = {
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
        [selectedEntity]: [...currentAttributes, newAttribute]
      });
    }

    handleCloseForm();
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
    setDldcModalMode('add');
    setDldcEditingAttr(null);
    setDldcSelectedDb('');
    setDldcSelectedTable('');
    setDldcSelectedField('');
    setDldcDisplayName('');
    setShowDldcModal(true);
  };

  const handleEditDldc = (attribute: MasterDataAttribute) => {
    setDldcModalMode('edit');
    setDldcEditingAttr(attribute);
    const dbId = DLDC_DATABASES.find(db => db.label === attribute.databaseName)?.id || '';
    setDldcSelectedDb(dbId);
    setDldcSelectedTable(attribute.tableName || '');
    setDldcSelectedField(attribute.fieldName);
    setDldcDisplayName(attribute.displayName);
    setShowDldcModal(true);
  };

  const handleCloseDldcModal = () => {
    setShowDldcModal(false);
    setDldcEditingAttr(null);
    setDldcSelectedDb('');
    setDldcSelectedTable('');
    setDldcSelectedField('');
    setDldcDisplayName('');
  };

  const handleDldcConfirm = () => {
    if (!dldcSelectedDb || !dldcSelectedTable || !dldcSelectedField || !dldcDisplayName.trim()) return;

    const dbLabel = DLDC_DATABASES.find(db => db.id === dldcSelectedDb)?.label || dldcSelectedDb;
    const fieldInfo = (DLDC_FIELDS[dldcSelectedTable] || []).find(f => f.fieldName === dldcSelectedField);
    if (!fieldInfo) return;

    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const currentAttributes = attributes[selectedEntity] || [];

    if (dldcModalMode === 'edit' && dldcEditingAttr) {
      const updatedAttributes = currentAttributes.map(attr =>
        attr.id === dldcEditingAttr.id
          ? { ...attr, fieldName: dldcSelectedField, displayName: dldcDisplayName.trim(), dataType: fieldInfo.dataType, databaseName: dbLabel, tableName: dldcSelectedTable, version: attr.version + 1 }
          : attr
      );
      setAttributes({ ...attributes, [selectedEntity]: updatedAttributes });
    } else {
      if (currentAttributes.some(a => a.fieldName === dldcSelectedField)) {
        alert('Trường này đã được thêm. Vui lòng chọn trường khác.');
        return;
      }
      const newAttr: MasterDataAttribute = {
        id: `attr-${Date.now()}`,
        fieldName: dldcSelectedField,
        displayName: dldcDisplayName.trim(),
        dataType: fieldInfo.dataType,
        required: false,
        unique: false,
        indexed: false,
        databaseName: dbLabel,
        tableName: dldcSelectedTable,
        createdDate: dateStr,
        version: 1,
      };
      setAttributes({ ...attributes, [selectedEntity]: [...currentAttributes, newAttr] });
    }
    handleCloseDldcModal();
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
                        className={`w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors ${
                          selectedEntity === entity.id ? 'bg-blue-50' : ''
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
        <div className={`flex items-start gap-3 px-4 py-3 rounded-lg border text-[13px] ${
          selectedEntityData.dataSource === 'dldc'
            ? 'bg-amber-50 border-amber-200 text-amber-800'
            : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
            selectedEntityData.dataSource === 'dldc' ? 'text-amber-500' : 'text-blue-500'
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
                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Phiên bản</th>
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
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleViewHistory(attribute.id)}
                            className="flex items-center gap-1 text-[13px] text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <HistoryIcon className="w-3 h-3" />
                            v{attribute.version}
                          </button>
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => selectedEntityData?.dataSource === 'dldc' ? handleEditDldc(attribute) : handleEdit(attribute)}
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
                    className={`px-3 py-1.5 border rounded-xl font-medium text-[13px] transition-colors cursor-pointer ${
                      currentPage === page
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
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg text-slate-900">
                {editingAttribute ? 'Chỉnh sửa thuộc tính' : 'Thêm thuộc tính mới'}
              </h3>
              <button onClick={handleCloseForm} className="p-1 hover:bg-slate-100 rounded" title="Đóng" aria-label="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Field Name */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">
                  Tên trường <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fieldName}
                  onChange={(e) => setFormData({ ...formData, fieldName: e.target.value.toLowerCase() })}
                  placeholder="VD: citizen_id, full_name, date_of_birth"
                  disabled={!!editingAttribute}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Chỉ sử dụng chữ thường, số và dấu gạch dưới. Bắt đầu bằng chữ cái.
                </p>
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">
                  Tên hiển thị <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="VD: Số CCCD, Họ và tên, Ngày sinh"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Data Type */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">
                  Kiểu dữ liệu <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.dataType}
                  onChange={(e) => setFormData({ ...formData, dataType: e.target.value as FieldDataType })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(fieldDataTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Length */}
              {(['string', 'email', 'phone', 'url'] as FieldDataType[]).includes(formData.dataType!) && (
                <div>
                  <label className="block text-sm text-slate-700 mb-1">
                    Độ dài tối đa
                  </label>
                  <input
                    type="number"
                    value={formData.length || ''}
                    onChange={(e) => setFormData({ ...formData, length: parseInt(e.target.value) || undefined })}
                    placeholder="VD: 255"
                    min="1"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Constraints */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
                <h4 className="text-sm text-slate-900">Ràng buộc</h4>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.required}
                    onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-slate-700">Bắt buộc (Required) - Trường này không được để trống</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.unique}
                    onChange={(e) => setFormData({ ...formData, unique: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-slate-700">Duy nhất (Unique) - Giá trị không được trùng lặp</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.indexed}
                    onChange={(e) => setFormData({ ...formData, indexed: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-slate-700">Đánh chỉ mục (Indexed) - Tối ưu hóa tìm kiếm</span>
                </label>
              </div>

              {/* Default Value */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">
                  Giá trị mặc định
                </label>
                <input
                  type="text"
                  value={formData.defaultValue || ''}
                  onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
                  placeholder="VD: Nam, 0, true"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">Mô tả</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả chi tiết về thuộc tính này"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Validation Rules */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">
                  Quy tắc kiểm tra
                </label>
                <textarea
                  value={formData.validationRules || ''}
                  onChange={(e) => setFormData({ ...formData, validationRules: e.target.value })}
                  placeholder="VD: Regex: ^[0-9]{12}$, Min: 0, Max: 100"
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Version Warning */}
              {editingAttribute && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="mb-1">Khi chỉnh sửa thuộc tính, phiên bản sẽ tự động tăng từ <strong>v{editingAttribute.version}</strong> lên <strong>v{editingAttribute.version + 1}</strong>.</p>
                    <p>Thay đổi này sẽ được ghi nhận trong lịch sử phiên bản.</p>
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
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Check className="w-4 h-4" />
                {editingAttribute ? 'Cập nhật' : 'Tạo mới'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DLDC Field Selection Modal */}
      {showDldcModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-semibold text-slate-900">
                  {dldcModalMode === 'edit' ? 'Chỉnh sửa trường DLDC' : 'Chọn trường từ Kho DLDC'}
                </h3>
                <p className="text-[13px] text-slate-500 mt-0.5">Chọn cơ sở dữ liệu, bảng và trường nguồn cần ánh xạ</p>
              </div>
              <button onClick={handleCloseDldcModal} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors" title="Đóng">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* DB + Table selectors */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-slate-600">
                    Cơ sở dữ liệu <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={dldcSelectedDb}
                    onChange={(e) => { setDldcSelectedDb(e.target.value); setDldcSelectedTable(''); setDldcSelectedField(''); setDldcDisplayName(''); }}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  >
                    <option value="">-- Chọn cơ sở dữ liệu --</option>
                    {DLDC_DATABASES.map(db => (
                      <option key={db.id} value={db.id}>{db.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-slate-600">
                    Bảng dữ liệu <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={dldcSelectedTable}
                    onChange={(e) => { setDldcSelectedTable(e.target.value); setDldcSelectedField(''); setDldcDisplayName(''); }}
                    disabled={!dldcSelectedDb}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">-- Chọn bảng dữ liệu --</option>
                    {(DLDC_TABLES[dldcSelectedDb] || []).map(t => (
                      <option key={t.id} value={t.id}>{t.displayName} ({t.id})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Field list */}
              {dldcSelectedTable && (
                <div className="space-y-2">
                  <label className="block text-[13px] font-medium text-slate-600">
                    Chọn trường nguồn <span className="text-red-500">*</span>
                  </label>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-2.5 text-[13px] font-semibold text-slate-600 w-10 text-center">Chọn</th>
                          <th className="px-4 py-2.5 text-[13px] font-semibold text-slate-600">Trường gốc</th>
                          <th className="px-4 py-2.5 text-[13px] font-semibold text-slate-600">Tên hiển thị mặc định</th>
                          <th className="px-4 py-2.5 text-[13px] font-semibold text-slate-600">Kiểu dữ liệu</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {(DLDC_FIELDS[dldcSelectedTable] || []).map((field) => (
                          <tr
                            key={field.fieldName}
                            onClick={() => { setDldcSelectedField(field.fieldName); setDldcDisplayName(field.displayName); }}
                            className={`border-t border-slate-100 cursor-pointer transition-colors ${dldcSelectedField === field.fieldName ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                          >
                            <td className="px-4 py-2.5 text-center">
                              <input
                                type="radio"
                                name="dldcField"
                                checked={dldcSelectedField === field.fieldName}
                                onChange={() => { setDldcSelectedField(field.fieldName); setDldcDisplayName(field.displayName); }}
                                className="accent-blue-600"
                              />
                            </td>
                            <td className="px-4 py-2.5">
                              <code className="text-[13px] bg-slate-100 px-2 py-0.5 rounded text-slate-800">{field.fieldName}</code>
                            </td>
                            <td className="px-4 py-2.5 text-[13px] text-slate-700">{field.displayName}</td>
                            <td className="px-4 py-2.5 text-[13px] text-slate-500">{fieldDataTypeLabels[field.dataType]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Display name edit */}
              {dldcSelectedField && (
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-slate-600">
                    Tên hiển thị <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={dldcDisplayName}
                    onChange={(e) => setDldcDisplayName(e.target.value)}
                    placeholder="Nhập tên hiển thị cho trường này"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                  <p className="text-[12px] text-slate-400">Có thể chỉnh sửa tên hiển thị theo nghiệp vụ của đơn vị.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 rounded-b-xl">
              <button
                onClick={handleCloseDldcModal}
                className="px-4 py-2 text-[13px] text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleDldcConfirm}
                disabled={!dldcSelectedDb || !dldcSelectedTable || !dldcSelectedField || !dldcDisplayName.trim()}
                className="px-4 py-2 text-[13px] font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                {dldcModalMode === 'edit' ? 'Cập nhật' : 'Thêm trường'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deletingAttr && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-slate-900">Xác nhận xóa trường</h3>
              <button onClick={() => { setShowDeleteConfirm(false); setDeletingAttr(null); }} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-3">
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-[13px] text-red-700">
                  Bạn có chắc chắn muốn xóa trường <strong>{deletingAttr.displayName}</strong> (<code className="bg-red-100 px-1 rounded text-[12px]">{deletingAttr.fieldName}</code>) không? Thao tác này không thể hoàn tác.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 rounded-b-xl">
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeletingAttr(null); }}
                className="px-4 py-2 text-[13px] text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-[13px] font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {showVersionHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg text-slate-900">Lịch sử phiên bản</h3>
              <button onClick={() => setShowVersionHistory(false)} className="p-1 hover:bg-slate-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {mockVersionHistory.map((history) => (
                  <div key={history.version} className="flex gap-4 pb-4 border-b border-slate-200 last:border-0">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600">v{history.version}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-900">{history.changes}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span>Người cập nhật: {history.updatedBy}</span>
                        <span>Ngày: {history.updatedDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end p-6 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setShowVersionHistory(false)}
                className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
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