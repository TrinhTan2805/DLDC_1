import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Plus, Edit, Trash2, Search, History as HistoryIcon, Check, AlertCircle, ChevronDown, Database, X, FileText, Send, Eye, ArrowRight, Network, Key } from 'lucide-react';
import { BaseModal } from '../../common/BaseModal';
import { MasterDataWizard, type WizardData, type DldcFieldRow as WizardDldcFieldRow } from './MasterDataWizard';

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
  shared: boolean;
  isPK: boolean;
  tableId: string;
  columnName: string;
  apiFieldName: string;
  dataType: FieldDataType;
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

export const defaultAttributes: Record<string, MasterDataAttribute[]> = {
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

// Ánh xạ tên nguồn (đăng ký ở Bước 1 wizard) → id kho DLDC — giống SOURCE_NAME_TO_DB_ID trong wizard
const SOURCE_NAME_TO_DB_ID: Record<string, string> = {
  'Hộ tịch': 'hotich',
  'CCCD': 'cccd',
  'ĐKKD': 'dkkd',
  'LLTP': 'lltp',
  'Bổ trợ tư pháp': 'btdp',
};

// Toàn bộ cột (union các bảng) thuộc 1 kho DLDC — dùng cho dropdown ánh xạ/thêm trường
const getDbColumnOptions = (dbId: string) => {
  const tables = DLDC_TABLES[dbId] || [];
  const seen = new Set<string>();
  const options: { fieldName: string; displayName: string; dataType: FieldDataType; tableId: string }[] = [];
  tables.forEach(t => {
    (DLDC_FIELDS[t.id] || []).forEach(f => {
      const key = `${t.id}:${f.fieldName}`;
      if (!seen.has(key)) {
        seen.add(key);
        options.push({ ...f, tableId: t.id });
      }
    });
  });
  return options;
};

const GROUP_RULE_LABELS: Record<string, string> = {
  latest: 'Bản ghi mới nhất',
  most_frequent: 'Xuất hiện nhiều nhất',
  max: 'Lớn nhất',
  min: 'Nhỏ nhất',
};

// Tạm ẩn nút Chỉnh sửa/Xóa theo yêu cầu — chỉ ẩn giao diện, không xóa code/luồng xử lý
const SHOW_EDIT_DELETE_ACTIONS = false;

export const DLDC_ENTITY_DETAIL_CONFIGS: Record<string, {
  sources: { id: string; name: string; kind: 'table' | 'view' | 'query'; grain: '1:1' | '1:n' }[];
  mapping: Record<string, Record<string, string>>;
  groupRules: Record<string, Record<string, { ruleType: string; timeColumn: string }>>;
}> = {
  '1': {
    sources: [
      { id: 'src-cccd', name: 'CCCD', kind: 'table', grain: '1:1' },
      { id: 'src-hotich', name: 'Hộ tịch', kind: 'table', grain: '1:n' },
    ],
    mapping: {
      'citizen_id': { 'src-cccd': 'so_cccd', 'src-hotich': 'ma_khai_sinh' },
      'full_name': { 'src-cccd': 'ho_ten', 'src-hotich': 'ho_ten' },
      'date_of_birth': { 'src-cccd': 'ngay_sinh', 'src-hotich': 'ngay_sinh' },
      'gender': { 'src-cccd': 'gioi_tinh', 'src-hotich': 'gioi_tinh' },
      'address': { 'src-cccd': 'thuong_tru', 'src-hotich': 'noi_sinh' },
      'email': { 'src-cccd': 'email', 'src-hotich': '' },
      'phone_number': { 'src-cccd': 'phone_number', 'src-hotich': '' },
    },
    groupRules: {
      'src-hotich': {
        'citizen_id': { ruleType: 'latest', timeColumn: 'ngay_sinh' },
        'full_name': { ruleType: 'latest', timeColumn: 'ngay_sinh' },
        'date_of_birth': { ruleType: 'latest', timeColumn: 'ngay_sinh' },
        'gender': { ruleType: 'latest', timeColumn: 'ngay_sinh' },
        'address': { ruleType: 'latest', timeColumn: 'ngay_sinh' },
      }
    }
  },
  '2': {
    sources: [
      { id: 'src-dkkd', name: 'ĐKKD', kind: 'table', grain: '1:1' },
    ],
    mapping: {
      'org_id': { 'src-dkkd': 'org_id' },
      'org_name': { 'src-dkkd': 'org_name' },
      'tax_code': { 'src-dkkd': 'tax_code' },
      'founded_date': { 'src-dkkd': 'founded_date' },
      'address': { 'src-dkkd': 'address' },
    },
    groupRules: {}
  },
  '3': {
    sources: [
      { id: 'src-manual-3', name: 'Nhập thủ công', kind: 'table', grain: '1:1' },
    ],
    mapping: {
      'doc_number': { 'src-manual-3': 'doc_number' },
      'doc_title': { 'src-manual-3': 'doc_title' },
      'issued_date': { 'src-manual-3': 'issued_date' },
      'issuing_body': { 'src-manual-3': 'issuing_body' },
      'doc_type': { 'src-manual-3': 'doc_type' },
    },
    groupRules: {}
  },
  '4': {
    sources: [
      { id: 'src-manual-4', name: 'Nhập thủ công', kind: 'table', grain: '1:1' },
    ],
    mapping: {
      'unit_code': { 'src-manual-4': 'unit_code' },
      'unit_name': { 'src-manual-4': 'unit_name' },
      'parent_code': { 'src-manual-4': 'parent_code' },
      'level': { 'src-manual-4': 'level' },
    },
    groupRules: {}
  },
  '5': {
    sources: [
      { id: 'src-lltp', name: 'LLTP', kind: 'table', grain: '1:1' },
    ],
    mapping: {
      'agency_id': { 'src-lltp': 'ma_co_quan' },
      'agency_name': { 'src-lltp': 'ten_co_quan' },
    },
    groupRules: {}
  }
};

const MOCK_APPROVERS = [
  { id: 'a1', name: 'Nguyễn Văn An', position: 'Trưởng phòng', department: 'Phòng Quản lý dữ liệu' },
  { id: 'a2', name: 'Trần Thị Bình', position: 'Phó Cục trưởng', department: 'Cục Hành chính tư pháp' },
  { id: 'a3', name: 'Lê Minh Cường', position: 'Chuyên viên cao cấp', department: 'Vụ Kế hoạch - Tài chính' },
  { id: 'a4', name: 'Phạm Quốc Hùng', position: 'Cục trưởng', department: 'Cục Công nghệ thông tin' },
  { id: 'a5', name: 'Hoàng Thị Lan', position: 'Trưởng phòng', department: 'Phòng Nghiệp vụ pháp lý' },
];

const getTableDisplayName = (tableId?: string, dataSource?: string) => {
  if (dataSource === 'manual') return 'Nhập thủ công';
  if (!tableId) return '—';
  for (const dbId in DLDC_TABLES) {
    const table = DLDC_TABLES[dbId].find(t => t.id === tableId);
    if (table) return table.displayName;
  }
  return tableId;
};

export function AttributesManagementTab({ readOnly = false }: { readOnly?: boolean } = {}) {
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

  // Cấu hình chi tiết nguồn DLDC theo từng thực thể (sources/mapping/groupRules) — có thể chỉnh sửa trong phiên làm việc
  const [entityConfigs, setEntityConfigs] = useState(DLDC_ENTITY_DETAIL_CONFIGS);

  // "Thêm mới thuộc tính" — mở lại wizard Tạo mới dữ liệu chủ, nhảy thẳng vào Bước 2 "Tạo thuộc tính",
  // nạp sẵn dữ liệu (nguồn/thuộc tính/ánh xạ) của thực thể đang chọn.
  const [showAttributeWizard, setShowAttributeWizard] = useState(false);

  // DLDC field configuration modal — tham chiếu Bước 2 "Tạo thuộc tính" của wizard.
  // Không cho đổi lại nguồn/phương thức cấu hình đã chọn trước đó: chỉ cho thêm trường,
  // chỉnh sửa ánh xạ và sửa gom nhóm 1:n.
  const [showDldcModal, setShowDldcModal] = useState(false);
  const [dldcFieldRows, setDldcFieldRows] = useState<DldcFieldRow[]>([]);
  const [dldcMapping, setDldcMapping] = useState<Record<string, Record<string, string>>>({});
  const [dldcGroupRules, setDldcGroupRules] = useState<Record<string, Record<string, { ruleType: string; timeColumn: string }>>>({});
  const [showStructureApprovalModal, setShowStructureApprovalModal] = useState(false);

  // Delete confirmation modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAttr, setDeletingAttr] = useState<MasterDataAttribute | null>(null);
  const [showDldcDetailModal, setShowDldcDetailModal] = useState(false);

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

  // Ánh xạ cột nguồn → thuộc tính / Gom nguồn 1:n cho MỘT thuộc tính đang thêm/sửa
  // trong modal thủ công (tương tự nội dung ở modal xem chi tiết)
  const [formFieldMapping, setFormFieldMapping] = useState<Record<string, string>>({});
  const [formFieldGroupRules, setFormFieldGroupRules] = useState<Record<string, { ruleType: string; timeColumn: string }>>({});

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

    // Lưu ánh xạ cột nguồn / gom nhóm 1:n của thuộc tính này vào cấu hình thực thể
    setEntityConfigs(prev => {
      const existing = prev[selectedEntity] || { sources: [], mapping: {}, groupRules: {} };
      const newMapping = { ...existing.mapping, [savedAttribute.fieldName]: { ...formFieldMapping } };
      const newGroupRules = { ...existing.groupRules };
      Object.entries(formFieldGroupRules).forEach(([sourceId, rule]) => {
        newGroupRules[sourceId] = { ...(newGroupRules[sourceId] || {}), [savedAttribute.fieldName]: rule };
      });
      return { ...prev, [selectedEntity]: { ...existing, mapping: newMapping, groupRules: newGroupRules } };
    });

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
    const config = entityConfigs[selectedEntity];
    setFormFieldMapping(config?.mapping[attribute.fieldName] ? { ...config.mapping[attribute.fieldName] } : {});
    const gr: Record<string, { ruleType: string; timeColumn: string }> = {};
    (config?.sources || []).filter(s => s.grain === '1:n').forEach(s => {
      const rule = config?.groupRules[s.id]?.[attribute.fieldName];
      if (rule) gr[s.id] = { ...rule };
    });
    setFormFieldGroupRules(gr);
    setShowForm(true);
  };

  const handleOpenAddForm = () => {
    setEditingAttribute(null);
    setFormData({
      fieldName: '',
      displayName: '',
      dataType: 'string',
      required: false,
      unique: false,
      indexed: false
    });
    setFormFieldMapping({});
    setFormFieldGroupRules({});
    setShowForm(true);
  };

  // Mở wizard "Tạo mới dữ liệu chủ" nhảy thẳng vào Bước 2, nạp sẵn dữ liệu thực thể đang chọn
  const handleOpenAttributeWizard = () => {
    setShowAttributeWizard(true);
  };

  const buildAttributeWizardInitialData = (): Partial<WizardData> => {
    const entity = selectedEntityData;
    const currentAttrs = attributes[selectedEntity] || [];
    const config = entityConfigs[selectedEntity];
    if (entity?.dataSource === 'dldc') {
      return {
        name: entity.name,
        code: entity.code,
        dataSource: 'dldc',
        sources: config?.sources || [],
        mapping: config ? JSON.parse(JSON.stringify(config.mapping)) : {},
        groupRules: config ? JSON.parse(JSON.stringify(config.groupRules)) : {},
      };
    }
    return {
      name: entity?.name || '',
      code: entity?.code || '',
      dataSource: 'manual',
      sources: [],
      attributes: currentAttrs.map(a => ({
        fieldName: a.fieldName,
        displayName: a.displayName,
        dataType: a.dataType,
        length: a.length,
        required: a.required,
        isKey: a.unique,
        defaultValue: a.defaultValue,
      })),
    };
  };

  const buildAttributeWizardInitialDldcRows = (): WizardDldcFieldRow[] => {
    const currentAttrs = attributes[selectedEntity] || [];
    const config = entityConfigs[selectedEntity];
    return currentAttrs.map(attr => {
      const mappingForAttr = config?.mapping[attr.fieldName] || {};
      const sourceId = Object.keys(mappingForAttr)[0] || config?.sources[0]?.id || '';
      return {
        id: attr.id,
        shared: true,
        isPK: attr.unique,
        tableId: sourceId,
        sourceJoinId: null,
        columnName: attr.fieldName,
        apiFieldName: attr.fieldName,
        displayName: attr.displayName,
        dataType: attr.dataType,
      };
    });
  };

  const handleAttributeWizardSubmit = (wizardData: WizardData) => {
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const newAttrs: MasterDataAttribute[] = wizardData.attributes.map((a, i) => ({
      id: `attr-wizard-${Date.now()}-${i}`,
      fieldName: a.fieldName,
      displayName: a.displayName,
      dataType: a.dataType,
      length: a.length,
      required: a.required,
      unique: a.isKey,
      indexed: a.isKey,
      defaultValue: a.defaultValue,
      createdDate: dateStr,
      version: 1,
    }));
    setAttributes(prev => ({ ...prev, [selectedEntity]: newAttrs }));
    if (wizardData.dataSource === 'dldc') {
      setEntityConfigs(prev => ({
        ...prev,
        [selectedEntity]: {
          sources: wizardData.sources,
          mapping: wizardData.mapping,
          groupRules: wizardData.groupRules,
        },
      }));
    }
    setShowAttributeWizard(false);
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
    setFormFieldMapping({});
    setFormFieldGroupRules({});
  };

  const handleViewHistory = (attributeId: string) => {
    setSelectedAttributeHistory(attributeId);
    setShowVersionHistory(true);
  };

  const getDbLabelForTable = (tableId: string) => {
    for (const dbId in DLDC_TABLES) {
      if ((DLDC_TABLES[dbId] || []).some(t => t.id === tableId)) {
        return DLDC_DATABASES.find(d => d.id === dbId)?.label || '';
      }
    }
    return '';
  };

  // Mở modal "Chỉnh sửa thuộc tính thực thể dữ liệu chủ" — liệt kê toàn bộ trường từ các nguồn
  // đã liên kết sẵn (đã chọn thì tick "Chia sẻ", chưa chọn thì để trống cho người dùng tick trực tiếp).
  // KHÔNG cho đổi lại nguồn/phương thức cấu hình đã chọn trước đó.
  const handleOpenDldcModal = () => {
    const currentAttrs = attributes[selectedEntity] || [];
    const config = entityConfigs[selectedEntity];
    const sources = config?.sources || [];
    const rows: DldcFieldRow[] = [];
    const seen = new Set<string>();
    sources.forEach(src => {
      const dbId = SOURCE_NAME_TO_DB_ID[src.name] || '';
      getDbColumnOptions(dbId).forEach(col => {
        const key = `${col.tableId}:${col.fieldName}`;
        if (seen.has(key)) return;
        seen.add(key);
        const existing = currentAttrs.find(a => a.tableName === col.tableId && a.fieldName === col.fieldName);
        rows.push({
          id: existing?.id || key,
          shared: !!existing,
          isPK: existing?.unique || false,
          tableId: col.tableId,
          columnName: col.fieldName,
          apiFieldName: existing?.displayName || col.displayName,
          dataType: existing?.dataType || col.dataType,
        });
      });
    });
    setDldcFieldRows(rows);
    setDldcMapping(config ? JSON.parse(JSON.stringify(config.mapping)) : {});
    setDldcGroupRules(config ? JSON.parse(JSON.stringify(config.groupRules)) : {});
    setShowDldcModal(true);
  };

  const handleCloseDldcModal = () => {
    setShowDldcModal(false);
    setDldcFieldRows([]);
    setDldcMapping({});
    setDldcGroupRules({});
  };

  const handleDldcMappingChange = (fieldName: string, sourceId: string, value: string) => {
    setDldcMapping(prev => ({ ...prev, [fieldName]: { ...(prev[fieldName] || {}), [sourceId]: value } }));
  };

  const handleDldcGroupRuleChange = (sourceId: string, fieldName: string, patch: Partial<{ ruleType: string; timeColumn: string }>) => {
    setDldcGroupRules(prev => {
      const existing = prev[sourceId]?.[fieldName] || { ruleType: 'latest', timeColumn: '' };
      return {
        ...prev,
        [sourceId]: {
          ...(prev[sourceId] || {}),
          [fieldName]: { ...existing, ...patch }
        }
      };
    });
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
          databaseName: getDbLabelForTable(row.tableId),
          tableName: row.tableId,
          createdDate: existing?.createdDate || dateStr,
          version: existing ? existing.version + 1 : 1,
        };
      });
    setAttributes({ ...attributes, [selectedEntity]: newAttrs });
    setEntityConfigs(prev => ({
      ...prev,
      [selectedEntity]: {
        sources: prev[selectedEntity]?.sources || [],
        mapping: dldcMapping,
        groupRules: dldcGroupRules,
      }
    }));
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

      {/* Add Button — chỉ hiện với thực thể cấu hình thủ công; thực thể DLDC thêm trường
          trực tiếp trong modal "Chỉnh sửa thuộc tính thực thể dữ liệu chủ" (nút Chỉnh sửa) */}
      {selectedEntityData && !readOnly && (
        <div className="flex justify-end gap-2">
          {selectedEntityData.dataSource !== 'dldc' && (
            <button
              onClick={handleOpenAddForm}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[13px] font-medium"
            >
              <Plus className="w-4 h-4" />
              Thêm thuộc tính
            </button>
          )}
          <button
            onClick={handleOpenAttributeWizard}
            className="flex items-center gap-2 px-4 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-[13px] font-medium"
          >
            <Plus className="w-4 h-4" />
            Thêm mới thuộc tính
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
                        {(selectedEntityData?.dataSource === 'dldc' || selectedEntityData?.dataSource === 'manual') && (
                          <button
                            onClick={() => setShowDldcDetailModal(true)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {/* Nút Chỉnh sửa/Xóa tạm ẩn theo yêu cầu — chỉ ẩn, không xóa code */}
                        {readOnly || !SHOW_EDIT_DELETE_ACTIONS ? null : (
                          <>
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
          {/* Cách định nghĩa thuộc tính — khóa cứng, không cho đổi lại phương thức cấu hình nguồn */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-medium text-slate-600">Cách định nghĩa thuộc tính:</span>
            <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden opacity-70 cursor-not-allowed">
              <span className="px-3 py-1.5 text-[13px] font-medium bg-white text-slate-500">
                Chọn trường từ Kho DLDC
              </span>
              <span className="px-3 py-1.5 text-[13px] font-medium border-l border-slate-200 bg-blue-600 text-white">
                Tự thêm mới từng trường
              </span>
            </div>
            <span className="text-[13px] text-slate-400">(không thể thay đổi)</span>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <h4 className="text-[13px] font-bold text-slate-900 mb-3">{editingAttribute ? 'Chỉnh sửa thuộc tính' : 'Thêm thuộc tính mới'}</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Tên trường <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fieldName}
                  onChange={(e) => setFormData({ ...formData, fieldName: e.target.value.toLowerCase() })}
                  placeholder="citizen_id"
                  disabled={!!editingAttribute}
                  className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Tên hiển thị <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="Số CCCD"
                  className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Kiểu dữ liệu</label>
                <div className="relative">
                  <select
                    value={formData.dataType}
                    onChange={(e) => setFormData({ ...formData, dataType: e.target.value as FieldDataType })}
                    className="w-full pl-3 pr-8 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
                  >
                    {Object.entries(fieldDataTypeLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Độ dài</label>
                <input
                  type="number"
                  value={formData.length || ''}
                  onChange={(e) => setFormData({ ...formData, length: parseInt(e.target.value) || undefined })}
                  placeholder="255"
                  min="1"
                  disabled={!(['string', 'email', 'phone', 'url'] as FieldDataType[]).includes(formData.dataType!)}
                  className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Giá trị mặc định</label>
                <input
                  type="text"
                  value={formData.defaultValue || ''}
                  onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
                  placeholder="VD: N/A"
                  className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-3">
              <label className="flex items-center gap-2 text-[13px] cursor-pointer">
                <input type="checkbox" checked={formData.required}
                  onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600" />
                Bắt buộc
              </label>
              <label className="flex items-center gap-2 text-[13px] cursor-pointer">
                <input type="checkbox" checked={formData.unique}
                  onChange={(e) => setFormData({ ...formData, unique: e.target.checked, indexed: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600" />
                <span className="flex items-center gap-1"><Key className="w-3.5 h-3.5 text-blue-600" /> Khóa (khóa chính)</span>
              </label>
            </div>
          </div>

          {/* Ánh xạ cột nguồn → thuộc tính — cho thuộc tính đang thêm/sửa (nếu thực thể có nguồn đã liên kết) */}
          {(entityConfigs[selectedEntity]?.sources.length || 0) > 0 && (
            <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                  <p className="text-[13px] font-semibold text-slate-700">Ánh xạ cột nguồn → thuộc tính</p>
                </div>
                <span className="text-[13px] text-slate-500">{entityConfigs[selectedEntity]?.sources.length} nguồn</span>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Thuộc tính</th>
                      {entityConfigs[selectedEntity]?.sources.map(src => (
                        <th key={src.id} className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">{src.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-3 py-2">
                        <span className="text-[13px] font-medium text-slate-700">{formData.displayName || '(chưa đặt tên)'}</span>
                        {formData.fieldName && (
                          <code className="ml-1.5 text-[13px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono">{formData.fieldName}</code>
                        )}
                      </td>
                      {entityConfigs[selectedEntity]?.sources.map(src => {
                        const dbId = SOURCE_NAME_TO_DB_ID[src.name] || '';
                        const options = getDbColumnOptions(dbId);
                        return (
                          <td key={src.id} className="px-2 py-2">
                            <select
                              value={formFieldMapping[src.id] || ''}
                              onChange={(e) => setFormFieldMapping(prev => ({ ...prev, [src.id]: e.target.value }))}
                              className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                            >
                              <option value="">—</option>
                              {options.map(c => <option key={c.fieldName} value={c.fieldName}>{c.fieldName}</option>)}
                            </select>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Gom nguồn 1:n — chỉ hiện khi có nguồn 1:n và thuộc tính này đã ánh xạ tới nguồn đó */}
          {(entityConfigs[selectedEntity]?.sources || []).filter(s => s.grain === '1:n' && formFieldMapping[s.id]).length > 0 && (
            <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <Network className="w-4 h-4 text-slate-500" />
                <p className="text-[13px] font-semibold text-slate-700">Gom nguồn 1:n</p>
              </div>
              <div className="p-4 space-y-3">
                {(entityConfigs[selectedEntity]?.sources || []).filter(s => s.grain === '1:n' && formFieldMapping[s.id]).map(src => {
                  const dbId = SOURCE_NAME_TO_DB_ID[src.name] || '';
                  const colOptions = getDbColumnOptions(dbId);
                  const rule = formFieldGroupRules[src.id] || { ruleType: 'latest', timeColumn: '' };
                  return (
                    <div key={src.id} className="grid grid-cols-3 gap-3 items-end">
                      <div>
                        <label className="block text-[13px] text-slate-500 mb-1">Nguồn (1:n)</label>
                        <div className="px-3 py-2 text-[13px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">{src.name}</div>
                      </div>
                      <div>
                        <label className="block text-[13px] text-slate-500 mb-1">Rule gom</label>
                        <select
                          value={rule.ruleType}
                          onChange={(e) => setFormFieldGroupRules(prev => ({ ...prev, [src.id]: { ...rule, ruleType: e.target.value } }))}
                          className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                        >
                          {Object.entries(GROUP_RULE_LABELS).map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[13px] text-slate-500 mb-1">Cột mốc thời gian</label>
                        <select
                          value={rule.timeColumn}
                          onChange={(e) => setFormFieldGroupRules(prev => ({ ...prev, [src.id]: { ...rule, timeColumn: e.target.value } }))}
                          className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                        >
                          <option value="">—</option>
                          {colOptions.map(c => <option key={c.fieldName} value={c.fieldName}>{c.fieldName}</option>)}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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

      {/* Modal Chỉnh sửa thuộc tính thực thể dữ liệu chủ — tham chiếu Bước 2 "Tạo thuộc tính" của wizard.
          Không cho đổi lại nguồn/phương thức cấu hình đã chọn trước đó: chỉ cho thêm trường,
          chỉnh sửa ánh xạ và sửa gom nhóm 1:n. */}
      <BaseModal
        isOpen={showDldcModal}
        onClose={handleCloseDldcModal}
        title="Chỉnh sửa thuộc tính thực thể dữ liệu chủ"
        subtitle="Chỉ có thể thêm trường, chỉnh sửa ánh xạ và gom nhóm 1:n — không đổi lại nguồn dữ liệu đã chọn"
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
        {(() => {
          const config = entityConfigs[selectedEntity];
          const sources = config?.sources || [];
          return (
            <div className="space-y-4 text-left">
              {/* Nguồn dữ liệu đã liên kết — cố định, không cho đổi lại */}
              <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                <div className="px-5 py-3.5 bg-blue-600 flex items-center gap-2">
                  <Database className="w-4 h-4 text-white" />
                  <p className="text-[13px] font-semibold text-white">Nguồn dữ liệu đã liên kết</p>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-2">
                    {sources.length === 0 ? (
                      <span className="text-[13px] text-slate-400">Chưa có nguồn dữ liệu nào được liên kết</span>
                    ) : (
                      sources.map(src => (
                        <span key={src.id} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] font-medium text-slate-700">
                          <Database className="w-3.5 h-3.5" />
                          {src.name}
                          <span className="px-1.5 py-0.5 rounded-full border text-[13px] font-medium bg-blue-50 text-blue-700 border-blue-200">
                            {src.kind === 'table' ? 'Bảng' : src.kind === 'view' ? 'View' : 'Truy vấn'}
                          </span>
                          <span className="px-1.5 py-0.5 rounded-full border text-[13px] font-medium bg-emerald-50 text-emerald-700 border-emerald-200">{src.grain}</span>
                        </span>
                      ))
                    )}
                  </div>
                  <p className="text-[13px] text-slate-400 mt-3">Không thể đổi lại phương thức/nguồn cấu hình đã chọn khi khởi tạo. Chỉ có thể thêm trường mới từ các nguồn này.</p>
                </div>
              </div>

              {/* Field Selection table */}
              <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <p className="text-[13px] font-semibold text-slate-700">Chọn trường dữ liệu chia sẻ</p>
                  <span className="text-[13px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                    {dldcFieldRows.filter(r => r.shared).length}/{dldcFieldRows.length} trường được chọn
                  </span>
                </div>
                <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                  <table className="w-full text-left text-[13px]" style={{ tableLayout: 'fixed' }}>
                    <colgroup>
                      <col style={{ width: '6%' }} />
                      <col style={{ width: '6%' }} />
                      <col style={{ width: '20%' }} />
                      <col style={{ width: '20%' }} />
                      <col style={{ width: '24%' }} />
                      <col style={{ width: '18%' }} />
                      <col style={{ width: '6%' }} />
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
                            Chưa có trường nào.
                          </td>
                        </tr>
                      ) : (
                        dldcFieldRows.map(row => {
                          const tableInfo = (DLDC_TABLES[Object.keys(DLDC_TABLES).find(dbId => (DLDC_TABLES[dbId] || []).some(t => t.id === row.tableId)) || ''] || []).find(t => t.id === row.tableId);
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
                              <td className="px-3 py-2.5 overflow-hidden text-slate-600 font-medium">
                                {tableInfo?.displayName || row.tableId}
                              </td>
                              <td className="px-3 py-2.5 overflow-hidden">
                                <code className="text-[13px] bg-slate-100 px-2 py-1 rounded text-slate-800 font-mono">{row.columnName}</code>
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

              {/* Ánh xạ cột nguồn → thuộc tính */}
              <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                    <p className="text-[13px] font-semibold text-slate-700">Ánh xạ cột nguồn → thuộc tính</p>
                  </div>
                  <span className="text-[13px] text-slate-500">{sources.length} nguồn</span>
                </div>
                <div className="p-4">
                  {dldcFieldRows.filter(r => r.shared).length === 0 ? (
                    <p className="text-[13px] text-slate-400 text-center py-6">Chưa có thuộc tính để ánh xạ</p>
                  ) : (
                    <div className="border border-slate-100 rounded-lg overflow-x-auto">
                      <table className="w-full text-[13px]">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr>
                            <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Thuộc tính</th>
                            {sources.map(src => (
                              <th key={src.id} className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">{src.name}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 bg-white">
                          {dldcFieldRows.filter(r => r.shared).map(row => (
                            <tr key={row.id}>
                              <td className="px-3 py-2">
                                <span className="text-[13px] font-medium text-slate-700">{row.apiFieldName || row.columnName}</span>
                                <code className="ml-1.5 text-[13px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono">{row.columnName}</code>
                              </td>
                              {sources.map(src => {
                                const dbId = SOURCE_NAME_TO_DB_ID[src.name] || '';
                                const options = getDbColumnOptions(dbId);
                                return (
                                  <td key={src.id} className="px-2 py-1.5">
                                    <select
                                      value={dldcMapping[row.columnName]?.[src.id] || ''}
                                      onChange={(e: ChangeEvent<HTMLSelectElement>) => handleDldcMappingChange(row.columnName, src.id, e.target.value)}
                                      className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                                    >
                                      <option value="">—</option>
                                      {options.map(c => <option key={c.fieldName} value={c.fieldName}>{c.fieldName}</option>)}
                                    </select>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Gom nguồn 1:n */}
              {sources.filter(s => s.grain === '1:n').length > 0 && (
                <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                  <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Network className="w-4 h-4 text-slate-500" />
                      <p className="text-[13px] font-semibold text-slate-700">Gom nguồn 1:n</p>
                    </div>
                    <span className="text-[13px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-medium">
                      {sources.filter(s => s.grain === '1:n').length} nguồn 1:n
                    </span>
                  </div>
                  <div className="p-4 space-y-4">
                    <p className="text-[13px] text-slate-500">Với nguồn có độ mịn 1:n, chọn quy tắc gom nhiều bản ghi thành một giá trị cho từng thuộc tính</p>
                    {sources.filter(s => s.grain === '1:n').map(src => {
                      const dbId = SOURCE_NAME_TO_DB_ID[src.name] || '';
                      const colOptions = getDbColumnOptions(dbId);
                      const rowsForSrc = dldcFieldRows.filter(r => r.shared && dldcMapping[r.columnName]?.[src.id]);
                      return (
                        <div key={src.id} className="border border-slate-200 rounded-xl overflow-hidden">
                          <div className="px-4 py-2.5 bg-emerald-50 border-b border-emerald-100">
                            <span className="text-[13px] font-semibold text-emerald-800">Nguồn (1:n): {src.name}</span>
                          </div>
                          {rowsForSrc.length === 0 ? (
                            <p className="text-[13px] text-slate-400 text-center py-6">Chưa có thuộc tính nào ánh xạ từ nguồn này</p>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full text-[13px]">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                  <tr>
                                    <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Thuộc tính</th>
                                    <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Rule gom</th>
                                    <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Cột mốc thời gian</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 bg-white">
                                  {rowsForSrc.map(row => {
                                    const gr = dldcGroupRules[src.id]?.[row.columnName];
                                    return (
                                      <tr key={row.id}>
                                        <td className="px-3 py-2">
                                          <span className="text-[13px] font-medium text-slate-700">{row.apiFieldName || row.columnName}</span>
                                          <code className="ml-1.5 text-[13px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono">{row.columnName}</code>
                                        </td>
                                        <td className="px-2 py-1.5">
                                          <select
                                            value={gr?.ruleType || 'latest'}
                                            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleDldcGroupRuleChange(src.id, row.columnName, { ruleType: e.target.value })}
                                            className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                                          >
                                            {Object.entries(GROUP_RULE_LABELS).map(([val, label]) => (
                                              <option key={val} value={val}>{label}</option>
                                            ))}
                                          </select>
                                        </td>
                                        <td className="px-2 py-1.5">
                                          <select
                                            value={gr?.timeColumn || ''}
                                            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleDldcGroupRuleChange(src.id, row.columnName, { timeColumn: e.target.value })}
                                            className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                                          >
                                            <option value="">—</option>
                                            {colOptions.map(c => <option key={c.fieldName} value={c.fieldName}>{c.fieldName}</option>)}
                                          </select>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-[13px] text-amber-800">
                  <p className="mb-1">Khi gửi duyệt cấu trúc, phiên bản của các thuộc tính thuộc cấu trúc này sẽ tự động tăng lên.</p>
                  <p>Thay đổi này sẽ được ghi nhận trong lịch sử phiên bản.</p>
                </div>
              </div>
            </div>
          );
        })()}
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
      {/* DLDC Sync Detail Modal */}
      <BaseModal
        isOpen={showDldcDetailModal}
        onClose={() => setShowDldcDetailModal(false)}
        title="Chi tiết thuộc tính bộ dữ liệu chủ"
        subtitle="Danh sách trường dữ liệu chia sẻ và ánh xạ nguồn của thực thể"
        maxWidth="max-w-5xl"
        customHeaderIcon={<Database className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />}
        footer={
          <button
            onClick={() => setShowDldcDetailModal(false)}
            className="px-4 py-2 text-[13px] text-[#020817] bg-white border border-[#e2e8f0] rounded-[6px] hover:bg-slate-50 transition-colors cursor-pointer font-medium"
          >
            Đóng
          </button>
        }
      >
        {(() => {
          const entityConfig = entityConfigs[selectedEntity];
          return (
            <div className="space-y-4 text-left font-sans">
              {/* Cách định nghĩa thuộc tính — chỉ hiển thị với thực thể cấu hình thủ công */}
              {selectedEntityData?.dataSource === 'manual' && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[13px] font-medium text-slate-600">Cách định nghĩa thuộc tính:</span>
                  <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden opacity-70 cursor-not-allowed">
                    <span className="px-3 py-1.5 text-[13px] font-medium bg-white text-slate-500">
                      Chọn trường từ Kho DLDC
                    </span>
                    <span className="px-3 py-1.5 text-[13px] font-medium border-l border-slate-200 bg-blue-600 text-white">
                      Tự thêm mới từng trường
                    </span>
                  </div>
                </div>
              )}

              {/* Chọn trường dữ liệu chia sẻ — giống mục Tạo thuộc tính ở Tạo mới dữ liệu chủ */}
              <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <p className="text-[13px] font-semibold text-slate-700">Chọn trường dữ liệu chia sẻ</p>
                    <span className="text-[13px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                      {currentEntityAttributes.length}/{currentEntityAttributes.length} trường được chọn
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
                  <table className="w-full text-left text-[13px]" style={{ tableLayout: 'fixed' }}>
                    <colgroup>
                      <col style={{ width: '6%' }} />
                      <col style={{ width: '6%' }} />
                      <col style={{ width: '16%' }} />
                      <col style={{ width: '16%' }} />
                      <col style={{ width: '16%' }} />
                      <col style={{ width: '20%' }} />
                      <col style={{ width: '20%' }} />
                    </colgroup>
                    <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-[2]">
                      <tr>
                        <th className="px-3 py-3 text-[13px] font-semibold text-slate-500 text-center">
                          <input type="checkbox" checked disabled className="rounded border-slate-300 text-blue-600 cursor-not-allowed" />
                        </th>
                        <th className="px-3 py-3 text-[13px] font-semibold text-slate-500 text-center">PK</th>
                        <th className="px-3 py-3 text-[13px] font-semibold text-slate-500">Nguồn (Table)</th>
                        <th className="px-3 py-3 text-[13px] font-semibold text-slate-500">Trường gốc (Column)</th>
                        <th className="px-3 py-3 text-[13px] font-semibold text-slate-500">Tên cột</th>
                        <th className="px-3 py-3 text-[13px] font-semibold text-slate-500">Tên hiển thị</th>
                        <th className="px-3 py-3 text-[13px] font-semibold text-slate-500">Kiểu dữ liệu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {currentEntityAttributes.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-10 text-center text-[13px] text-slate-400">
                            Chưa có trường nào được cấu hình.
                          </td>
                        </tr>
                      ) : (
                        currentEntityAttributes.map(attr => (
                          <tr key={attr.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-3 py-2.5 text-center overflow-hidden">
                              <input type="checkbox" checked disabled className="rounded border-slate-300 text-blue-600 cursor-not-allowed" />
                            </td>
                            <td className="px-3 py-2.5 text-center overflow-hidden">
                              <input type="checkbox" checked={attr.unique} disabled
                                className="w-4 h-4 rounded text-amber-500 border-slate-300 cursor-not-allowed accent-amber-500" />
                            </td>
                            <td className="px-3 py-2.5 overflow-hidden text-[13px] text-slate-900 font-medium">
                              {getTableDisplayName(attr.tableName || selectedEntityData?.primaryTableId, selectedEntityData?.dataSource)}
                            </td>
                            <td className="px-3 py-2.5 overflow-hidden">
                              <code className="text-[13px] bg-slate-100 px-2 py-1 rounded text-slate-800 font-mono">{attr.fieldName}</code>
                            </td>
                            <td className="px-3 py-2.5 overflow-hidden text-[13px] text-slate-700">
                              {attr.fieldName}
                            </td>
                            <td className="px-3 py-2.5 overflow-hidden text-[13px] text-slate-900 font-medium">
                              {attr.displayName}
                            </td>
                            <td className="px-3 py-2.5 overflow-hidden text-[13px] text-slate-700">
                              {fieldDataTypeLabels[attr.dataType]}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Ánh xạ cột nguồn → thuộc tính */}
              <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                    <p className="text-[13px] font-semibold text-slate-700">Ánh xạ cột nguồn → thuộc tính</p>
                  </div>
                  <span className="text-[13px] text-slate-500">{entityConfig?.sources.length || 0} nguồn</span>
                </div>

                {(entityConfig?.sources.length || 0) <= 1 && (
                  <div className="px-5 py-2.5 bg-amber-50 border-b border-amber-100">
                    <p className="text-[13px] text-amber-800">ℹ️ Chỉ 1 nguồn — ánh xạ trực tiếp</p>
                  </div>
                )}

                {currentEntityAttributes.length === 0 ? (
                  <p className="text-[13px] text-slate-400 text-center py-6 px-4">Chưa có thuộc tính để ánh xạ</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-[13px]">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                          <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Thuộc tính</th>
                          {entityConfig?.sources.map(src => (
                            <th key={src.id} className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">{src.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 bg-white">
                        {currentEntityAttributes.map(attr => (
                          <tr key={attr.fieldName} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-3 py-2">
                              <span className="text-[13px] font-medium text-slate-700">{attr.displayName}</span>
                              <code className="ml-1.5 text-[13px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono">{attr.fieldName}</code>
                            </td>
                            {entityConfig?.sources.map(src => {
                              const mappedCol = entityConfig.mapping[attr.fieldName]?.[src.id];
                              return (
                                <td key={src.id} className="px-3 py-2 text-[13px] text-slate-600">
                                  {mappedCol ? (
                                    <code className="text-[13px] font-mono bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 text-slate-800">
                                      {mappedCol}
                                    </code>
                                  ) : (
                                    <span className="text-[13px] text-slate-400">—</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          );
        })()}
      </BaseModal>

      {/* Thêm mới thuộc tính — mở lại wizard Tạo mới dữ liệu chủ, nhảy thẳng Bước 2 */}
      {showAttributeWizard && (
        <MasterDataWizard
          isOpen={showAttributeWizard}
          onClose={() => setShowAttributeWizard(false)}
          onSubmit={handleAttributeWizardSubmit}
          initialStep={2}
          initialData={buildAttributeWizardInitialData()}
          initialDldcFieldRows={buildAttributeWizardInitialDldcRows()}
        />
      )}
    </div>
  );
}
