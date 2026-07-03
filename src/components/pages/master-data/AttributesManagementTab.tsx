import { useState, useRef, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, History as HistoryIcon, Check, AlertCircle, ChevronDown, Database } from 'lucide-react';
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

interface DldcFieldRow {
  id: string;
  tableId: string;
  fieldName: string;
  displayName: string;
  dataType: FieldDataType;
  shared: boolean;
  isPK: boolean;
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
  { id: '1', code: 'MD-CITIZEN-001', name: 'Bộ dữ liệu chủ Công dân',          dataSource: 'dldc',   primaryDatabaseId: 'hotich', primaryTableId: 'tbl_citizen'      },
  { id: '2', code: 'MD-ORG-001',     name: 'Bộ dữ liệu chủ Tổ chức',           dataSource: 'dldc',   primaryDatabaseId: 'dkkd',   primaryTableId: 'tbl_organization' },
  { id: '3', code: 'MD-DOC-001',     name: 'Bộ dữ liệu chủ Văn bản pháp luật', dataSource: 'manual' },
  { id: '4', code: 'MD-ADMIN-001',   name: 'Bộ dữ liệu chủ Đơn vị hành chính', dataSource: 'manual' },
  { id: '5', code: 'MD-AGENCY-001',  name: 'Bộ dữ liệu chủ Cơ quan nhà nước',  dataSource: 'dldc',   primaryDatabaseId: 'lltp',   primaryTableId: 'tbl_lich_su'      },
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

  // DLDC field configuration modal
  const [showDldcModal, setShowDldcModal] = useState(false);
  const [dldcFieldRows, setDldcFieldRows] = useState<DldcFieldRow[]>([]);

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
    const entity = mockEntities.find(e => e.id === selectedEntity);
    const currentAttrs = attributes[selectedEntity] || [];
    const rows: DldcFieldRow[] = currentAttrs.map(attr => ({
      id: attr.id,
      tableId: attr.tableName || entity?.primaryTableId || '',
      fieldName: attr.fieldName,
      displayName: attr.displayName,
      dataType: attr.dataType,
      shared: true,
      isPK: attr.unique,
    }));
    setDldcFieldRows(rows);
    setShowDldcModal(true);
  };

  const handleCloseDldcModal = () => {
    setShowDldcModal(false);
    setDldcFieldRows([]);
  };

  const handleAddDldcRow = () => {
    const entity = mockEntities.find(e => e.id === selectedEntity);
    setDldcFieldRows(rows => [...rows, {
      id: `row-${Date.now()}`,
      tableId: entity?.primaryTableId || '',
      fieldName: '',
      displayName: '',
      dataType: 'string',
      shared: true,
      isPK: false,
    }]);
  };

  const updateDldcRow = (rowId: string, updates: Partial<DldcFieldRow>) => {
    setDldcFieldRows(rows => rows.map(r => r.id === rowId ? { ...r, ...updates } : r));
  };

  const removeDldcRow = (rowId: string) => {
    setDldcFieldRows(rows => rows.filter(r => r.id !== rowId));
  };

  const handleDldcConfirm = () => {
    const entity = mockEntities.find(e => e.id === selectedEntity);
    const dbLabel = DLDC_DATABASES.find(db => db.id === entity?.primaryDatabaseId)?.label || '';
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const currentAttrs = attributes[selectedEntity] || [];

    const newAttrs: MasterDataAttribute[] = dldcFieldRows
      .filter(row => row.fieldName)
      .map(row => {
        const existing = currentAttrs.find(a => a.id === row.id);
        return {
          id: row.id,
          fieldName: row.fieldName,
          displayName: row.displayName || row.fieldName,
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
              {editingAttribute ? 'Cập nhật' : 'Tạo mới'}
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

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1">Mô tả</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả chi tiết về thuộc tính này"
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1">Quy tắc kiểm tra</label>
            <textarea
              value={formData.validationRules || ''}
              onChange={(e) => setFormData({ ...formData, validationRules: e.target.value })}
              placeholder="VD: Regex: ^[0-9]{12}$, Min: 0, Max: 100"
              rows={2}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>

          {editingAttribute && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-[13px] text-amber-800">
                <p className="mb-1">Khi chỉnh sửa, phiên bản sẽ tự động tăng từ <strong>v{editingAttribute.version}</strong> lên <strong>v{editingAttribute.version + 1}</strong>.</p>
                <p>Thay đổi này sẽ được ghi nhận trong lịch sử phiên bản.</p>
              </div>
            </div>
          )}
        </div>
      </BaseModal>

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
              onClick={handleDldcConfirm}
              className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Check className="w-4 h-4" />
              Gửi duyệt cấu trúc
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Sub-info bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-lg">
            <Database className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <span className="text-[13px] text-blue-700">
              Kho dữ liệu:{' '}
              <strong>{DLDC_DATABASES.find(db => db.id === selectedEntityData?.primaryDatabaseId)?.label || '—'}</strong>
              {' '}—{' '}
              <strong>{(DLDC_TABLES[selectedEntityData?.primaryDatabaseId || ''] || []).find(t => t.id === selectedEntityData?.primaryTableId)?.displayName || '—'}</strong>
            </span>
          </div>

          {/* DB + Table (disabled) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-slate-600">Cơ sở dữ liệu</label>
              <div className="relative">
                <select
                  disabled
                  value={selectedEntityData?.primaryDatabaseId || ''}
                  title="Cơ sở dữ liệu (không chỉnh sửa)"
                  className="w-full pl-3 pr-8 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-slate-100 text-slate-500 appearance-none cursor-not-allowed opacity-70"
                >
                  <option value="">—</option>
                  {DLDC_DATABASES.map(db => <option key={db.id} value={db.id}>{db.label}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-slate-600">Bảng dữ liệu chính</label>
              <div className="relative">
                <select
                  disabled
                  value={selectedEntityData?.primaryTableId || ''}
                  title="Bảng dữ liệu chính (không chỉnh sửa)"
                  className="w-full pl-3 pr-8 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-slate-100 text-slate-500 appearance-none cursor-not-allowed opacity-70"
                >
                  <option value="">—</option>
                  {(DLDC_TABLES[selectedEntityData?.primaryDatabaseId || ''] || []).map(t => (
                    <option key={t.id} value={t.id}>{t.displayName} ({t.id})</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Field selection section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium text-slate-700">Chọn trường dữ liệu chia sẻ (Field Selection)</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[12px] font-medium rounded-full">
                  {dldcFieldRows.filter(r => r.fieldName).length}/{dldcFieldRows.length} trường được chọn
                </span>
              </div>
              <button
                onClick={handleAddDldcRow}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] text-blue-600 border border-blue-300 bg-white rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm trường dữ liệu
              </button>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-[2]">
                    <tr>
                      <th className="px-3 py-3 text-[13px] font-semibold text-slate-500 text-center whitespace-nowrap">Chia sẻ</th>
                      <th className="px-3 py-3 text-[13px] font-semibold text-slate-500 text-center">PK</th>
                      <th className="px-3 py-3 text-[13px] font-semibold text-slate-500 whitespace-nowrap">Nguồn dữ liệu (Table)</th>
                      <th className="px-3 py-3 text-[13px] font-semibold text-slate-500 whitespace-nowrap">Trường gốc (Column)</th>
                      <th className="px-3 py-3 text-[13px] font-semibold text-slate-500 whitespace-nowrap">Tên hiển thị</th>
                      <th className="px-3 py-3 text-[13px] font-semibold text-slate-500 whitespace-nowrap">Kiểu dữ liệu</th>
                      <th className="px-3 py-3 text-[13px] font-semibold text-slate-500 text-center">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {dldcFieldRows.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-10 text-center text-[13px] text-slate-400">
                          Chưa có trường nào. Nhấn "+ Thêm trường dữ liệu" để bắt đầu.
                        </td>
                      </tr>
                    ) : (
                      dldcFieldRows.map((row) => (
                        <tr key={row.id} className="border-t border-slate-100">
                          <td className="px-3 py-2.5 text-center">
                            <input type="checkbox" checked={row.shared} onChange={(e) => updateDldcRow(row.id, { shared: e.target.checked })} className="accent-blue-600 w-4 h-4 cursor-pointer" />
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <input type="checkbox" checked={row.isPK} onChange={(e) => updateDldcRow(row.id, { isPK: e.target.checked })} className="accent-blue-600 w-4 h-4 cursor-pointer" />
                          </td>
                          <td className="px-3 py-2.5">
                            <select
                              value={row.tableId}
                              onChange={(e) => updateDldcRow(row.id, { tableId: e.target.value, fieldName: '' })}
                              className="w-full px-2 py-1.5 border border-slate-200 rounded text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 min-w-[140px]"
                            >
                              <option value="">-- Chọn bảng --</option>
                              {(DLDC_TABLES[selectedEntityData?.primaryDatabaseId || ''] || []).map(t => (
                                <option key={t.id} value={t.id}>{t.id}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-2.5">
                            <select
                              value={row.fieldName}
                              disabled={!row.tableId}
                              onChange={(e) => {
                                const f = (DLDC_FIELDS[row.tableId] || []).find(f => f.fieldName === e.target.value);
                                updateDldcRow(row.id, { fieldName: e.target.value, ...(f ? { displayName: f.displayName, dataType: f.dataType } : {}) });
                              }}
                              className="w-full px-2 py-1.5 border border-slate-200 rounded text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 min-w-[140px] disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                            >
                              <option value="">-- Chọn trường --</option>
                              {(DLDC_FIELDS[row.tableId] || []).map(f => (
                                <option key={f.fieldName} value={f.fieldName}>{f.fieldName}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-2.5">
                            <input
                              type="text"
                              value={row.displayName}
                              onChange={(e) => updateDldcRow(row.id, { displayName: e.target.value })}
                              placeholder="Tên hiển thị"
                              className="w-full px-2 py-1.5 border border-slate-200 rounded text-[13px] focus:outline-none focus:ring-1 focus:ring-blue-400 min-w-[120px]"
                            />
                          </td>
                          <td className="px-3 py-2.5">
                            <select
                              value={row.dataType}
                              onChange={(e) => updateDldcRow(row.id, { dataType: e.target.value as FieldDataType })}
                              className="w-full px-2 py-1.5 border border-slate-200 rounded text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 min-w-[130px]"
                            >
                              {Object.entries(fieldDataTypeLabels).map(([val, label]) => (
                                <option key={val} value={val}>{label}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <button onClick={() => removeDldcRow(row.id)} className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors" title="Xóa dòng">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </BaseModal>

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