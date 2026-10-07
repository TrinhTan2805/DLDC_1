import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Plus, Edit, Trash2, Search, History as HistoryIcon, Check, AlertCircle, ChevronDown, Database, X, FileText, Send, Eye, ArrowRight, Network, Key, Info } from 'lucide-react';
import { toast } from 'sonner';
import { BaseModal } from '../../common/BaseModal';
import { MasterDataWizard, type WizardData, type DldcFieldRow as WizardDldcFieldRow } from './MasterDataWizard';
import {
  Badge, TruncatedText, RowIconAction, Pagination, BTN_PRIMARY, BTN_OUTLINE, BTN_DESTRUCTIVE, BTN_GHOST_ICON,
  INPUT_CLS, LABEL_CLS, REQUIRED_MARK, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE,
} from '../collection/collectionUi';

// Lớp dùng chung theo quy chuẩn (compomennt.md 5.2, 5.3, 5.4) — đồng bộ với category/AttributesTab
const SELECT_CLS = `${INPUT_CLS} pr-8 appearance-none cursor-pointer`;
const TABLE_CLS = 'w-full border-collapse collection-table text-[13px]';
const TH_CLS = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px] text-left';
const TR_CLS = 'h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors';
const TD_CLS = 'px-3 py-1 text-[13px] text-black';
const EMPTY_TD_CLS = 'px-3 py-16 text-center text-[13px] text-[#64748B]';
// Cột Thao tác ghim phải khi bảng cuộn ngang (nền theo hàng)
const STICKY_TH_CLS = 'sticky right-0 z-[1] bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]';
const STICKY_TD_CLS = 'sticky right-0 z-[1] bg-white group-hover:bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0] transition-colors';
const CARD_HEADER_CLS = 'px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center';
const CARD_TITLE_CLS = 'text-[14px] font-medium text-[#020817]';
const SECTION_CARD_CLS = 'border border-[#E2E8F0] rounded-2xl bg-white overflow-hidden';
const WARN_BANNER_CLS = 'flex items-start gap-2 px-4 py-3 bg-[#FFF7ED] border border-[#FED7AA] rounded-lg text-[13px] text-[#020817]';
const CHECKBOX_CLS = 'w-4 h-4 rounded accent-blue-600 cursor-pointer disabled:cursor-not-allowed';
const PK_CHECKBOX_CLS = 'w-4 h-4 rounded accent-[#D97706] cursor-pointer disabled:cursor-not-allowed';

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
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc (Tên trường, Tên hiển thị)');
      return;
    }

    // Validate field name format
    if (!/^[a-z][a-z0-9_]*$/.test(formData.fieldName)) {
      toast.error('Tên trường phải bắt đầu bằng chữ thường và chỉ chứa chữ thường, số và dấu gạch dưới');
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
        toast.error('Tên trường đã tồn tại. Vui lòng sử dụng tên khác.');
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
    toast.success('Đã gửi trình duyệt thuộc tính thành công!');
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
    toast.success('Đã gửi trình duyệt cấu trúc thành công!');
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

  // Khối "Chọn người duyệt" + "Nội dung yêu cầu" dùng chung cho 2 modal Gửi trình duyệt
  const renderApproverFields = () => (
    <>
      <div>
        <label className={LABEL_CLS}>
          Chọn người duyệt <span className={REQUIRED_MARK}>*</span>
        </label>
        <div className="relative">
          <select
            value={selectedApprover}
            onChange={e => setSelectedApprover(e.target.value)}
            className={SELECT_CLS}
          >
            <option value="">-- Chọn người duyệt --</option>
            {MOCK_APPROVERS.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} - {u.position} ({u.department})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
        </div>
      </div>

      <div>
        <label className={LABEL_CLS}>
          Nội dung yêu cầu
        </label>
        <textarea
          value={approvalNote}
          onChange={e => setApprovalNote(e.target.value)}
          rows={4}
          placeholder="Nhập nội dung gửi kèm (nếu có)..."
          className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
        />
      </div>
    </>
  );

  // "Cách định nghĩa thuộc tính" — khóa cứng, không cho đổi lại phương thức cấu hình nguồn
  const renderLockedDefineMode = (showNote: boolean) => (
    <div className="flex flex-wrap items-center gap-2">
      <span className={FIELD_LABEL}>Cách định nghĩa thuộc tính:</span>
      <div className="inline-flex h-10 rounded-lg border border-[#E2E8F0] overflow-hidden cursor-not-allowed" aria-disabled="true">
        <span className="px-3 flex items-center text-[13px] font-medium bg-[#F1F5F9] text-[#94A3B8]">
          Chọn trường từ Kho DLDC
        </span>
        <span className="px-3 flex items-center text-[13px] font-medium border-l border-[#E2E8F0] bg-blue-600 text-white">
          Tự thêm mới từng trường
        </span>
      </div>
      {showNote && <span className="text-[12px] text-[#64748B]">(không thể thay đổi)</span>}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-medium text-[#020817] leading-6">Quản lý thuộc tính dữ liệu chủ</h2>
      </div>

      {/* Entity Selection */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
        <label className={LABEL_CLS}>
          Chọn thực thể dữ liệu chủ <span className={REQUIRED_MARK}>*</span>
        </label>
        <div ref={comboboxRef} className="relative">
          <button
            type="button"
            className={`${INPUT_CLS} text-left cursor-pointer`}
            onClick={() => setComboboxOpen(!comboboxOpen)}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 truncate">
                {selectedEntityData ? (
                  <>
                    <span className="text-[13px] text-[#020817]">{selectedEntityData.code}</span>
                    <span className="text-[13px] text-[#64748B]"> - {selectedEntityData.name}</span>
                  </>
                ) : (
                  <span className="text-[13px] text-[#94A3B8]">Chọn thực thể dữ liệu chủ...</span>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 shrink-0 text-[#64748B] transition-transform ${comboboxOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>
          {comboboxOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-[#E2E8F0] rounded-lg shadow-lg max-h-64 overflow-hidden flex flex-col">
              <div className="p-2 border-b border-[#E2E8F0]">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    type="text"
                    value={comboboxSearch}
                    onChange={(e) => setComboboxSearch(e.target.value)}
                    placeholder="Tìm kiếm theo mã hoặc tên..."
                    className={`${INPUT_CLS} pl-9`}
                    autoFocus
                  />
                </div>
              </div>
              <ul className="overflow-y-auto max-h-52 custom-scrollbar">
                {filteredEntities.length === 0 ? (
                  <li className="px-4 py-8 text-center text-[13px] text-[#64748B]">
                    Không tìm thấy thực thể phù hợp
                  </li>
                ) : (
                  filteredEntities.map(entity => (
                    <li key={entity.id}>
                      <button
                        type="button"
                        className={`w-full min-h-10 px-3 py-2 text-left hover:bg-[#F1F5F9] transition-colors cursor-pointer ${selectedEntity === entity.id ? 'bg-[#EAF3FF]' : ''}`}
                        onClick={() => {
                          setSelectedEntity(entity.id);
                          setComboboxOpen(false);
                          setComboboxSearch('');
                        }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-[13px] text-[#020817]">{entity.code}</span>
                            <span className="text-[13px] text-[#64748B]"> - {entity.name}</span>
                          </div>
                          {selectedEntity === entity.id && (
                            <Check className="w-4 h-4 shrink-0 text-[#155DFC]" />
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
        <div className={`flex items-start gap-3 px-4 py-3 rounded-lg border text-[13px] text-[#020817] ${selectedEntityData.dataSource === 'dldc'
          ? 'bg-[#FFF7ED] border-[#FED7AA]'
          : 'bg-[#EAF3FF] border-[#BFDBFE]'
          }`}>
          <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${selectedEntityData.dataSource === 'dldc' ? 'text-[#D97706]' : 'text-[#155DFC]'
            }`} />
          <p className="leading-relaxed">
            <span className="font-medium">Thông tin cấu hình:</span> Đang thực hiện cấu hình thuộc tính cho thực thể{' '}
            <strong className="font-medium">{selectedEntityData.name}</strong>.{' '}
            Nguồn dữ liệu:{' '}
            <strong className="font-medium">{selectedEntityData.dataSource === 'dldc' ? 'Đồng bộ Kho DLDC' : 'Nhập thủ công'}</strong>
          </p>
        </div>
      )}

      {/* Add Button — chỉ hiện với thực thể cấu hình thủ công; thực thể DLDC thêm trường
          trực tiếp trong modal "Chỉnh sửa thuộc tính thực thể dữ liệu chủ" (nút Chỉnh sửa) */}
      {selectedEntityData && !readOnly && (
        <div className="flex justify-end gap-2">
          {selectedEntityData.dataSource !== 'dldc' && (
            <button type="button" onClick={handleOpenAddForm} className={BTN_PRIMARY}>
              <Plus className="w-4 h-4" />
              Thêm thuộc tính
            </button>
          )}
          <button type="button" onClick={handleOpenAttributeWizard} className={BTN_OUTLINE}>
            <Plus className="w-4 h-4" />
            Thêm mới thuộc tính
          </button>
        </div>
      )}

      {/* Attributes Table */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className={TABLE_CLS}>
            <thead className="bg-[#F8FAFC]">
              <tr className="h-[42px]">
                {selectedEntityData?.dataSource === 'dldc' ? (
                  <>
                    <th className={TH_CLS}>Tên CSDL</th>
                    <th className={TH_CLS}>Tên bảng</th>
                    <th className={TH_CLS}>Tên trường</th>
                    <th className={TH_CLS}>Tên hiển thị</th>
                    <th className={TH_CLS}>Kiểu dữ liệu</th>
                    <th className={`${TH_CLS} ${STICKY_TH_CLS} !text-center w-28`}>Thao tác</th>
                  </>
                ) : (
                  <>
                    <th className={TH_CLS}>Tên trường</th>
                    <th className={TH_CLS}>Tên hiển thị</th>
                    <th className={TH_CLS}>Kiểu dữ liệu</th>
                    <th className={`${TH_CLS} !text-right`}>Độ dài</th>
                    <th className={TH_CLS}>Ràng buộc</th>
                    <th className={TH_CLS}>Giá trị mặc định</th>
                    <th className={`${TH_CLS} ${STICKY_TH_CLS} !text-center w-28`}>Thao tác</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredAttributes.length === 0 ? (
                <tr>
                  <td colSpan={selectedEntityData?.dataSource === 'dldc' ? 6 : 7} className={EMPTY_TD_CLS}>
                    {searchTerm ? 'Không tìm thấy thuộc tính phù hợp' : 'Chưa có thuộc tính nào. Nhấn "Thêm thuộc tính" để bắt đầu.'}
                  </td>
                </tr>
              ) : (
                paginatedAttributes.map((attribute) => (
                  <tr key={attribute.id} className={`${TR_CLS} group`}>
                    {selectedEntityData?.dataSource === 'dldc' ? (
                      <>
                        <td className={`${TD_CLS} max-w-[240px]`}><TruncatedText text={attribute.databaseName || '—'} /></td>
                        <td className={`${TD_CLS} max-w-[200px]`}><TruncatedText text={attribute.tableName || '—'} /></td>
                        <td className={`${TD_CLS} max-w-[200px]`}><TruncatedText text={attribute.fieldName} /></td>
                        <td className={`${TD_CLS} max-w-[280px]`}><TruncatedText text={attribute.displayName} /></td>
                        <td className={`${TD_CLS} whitespace-nowrap`}>{fieldDataTypeLabels[attribute.dataType]}</td>
                      </>
                    ) : (
                      <>
                        <td className={`${TD_CLS} max-w-[200px]`}><TruncatedText text={attribute.fieldName} /></td>
                        <td className={`${TD_CLS} max-w-[280px]`}><TruncatedText text={attribute.displayName} /></td>
                        <td className={`${TD_CLS} whitespace-nowrap`}>{fieldDataTypeLabels[attribute.dataType]}</td>
                        <td className={`${TD_CLS} text-right tabular-nums`}>{attribute.length || '-'}</td>
                        <td className={TD_CLS}>
                          <div className="flex flex-wrap gap-1">
                            {attribute.required && <Badge label="Bắt buộc" variant="red" />}
                            {attribute.unique && <Badge label="Duy nhất" variant="purple" />}
                            {attribute.indexed && <Badge label="Index" variant="blue" />}
                          </div>
                        </td>
                        <td className={`${TD_CLS} max-w-[200px]`}><TruncatedText text={attribute.defaultValue || '—'} /></td>
                      </>
                    )}
                    <td className={`${TD_CLS} ${STICKY_TD_CLS} text-center`}>
                      <div className="flex items-center justify-center gap-1">
                        {(selectedEntityData?.dataSource === 'dldc' || selectedEntityData?.dataSource === 'manual') && (
                          <RowIconAction label="Xem chi tiết" onClick={() => setShowDldcDetailModal(true)}>
                            <Eye className="w-4 h-4" />
                          </RowIconAction>
                        )}
                        {/* Nút Chỉnh sửa/Xóa tạm ẩn theo yêu cầu — chỉ ẩn, không xóa code */}
                        {readOnly || !SHOW_EDIT_DELETE_ACTIONS ? null : (
                          <>
                            <RowIconAction
                              label="Chỉnh sửa"
                              onClick={() => selectedEntityData?.dataSource === 'dldc' ? handleOpenDldcModal() : handleEdit(attribute)}
                            >
                              <Edit className="w-4 h-4" />
                            </RowIconAction>
                            <RowIconAction
                              label="Xóa"
                              onClick={() => selectedEntityData?.dataSource === 'dldc' ? handleOpenDeleteConfirm(attribute) : handleDelete(attribute.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </RowIconAction>
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
          <Pagination
            className="border-t border-[#E2E8F0]"
            currentPage={currentPage}
            totalItems={filteredAttributes.length}
            pageSize={pageSize}
            pageSizeOptions={[10, 20, 50]}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
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
            <button type="button" onClick={handleCloseForm} className={BTN_OUTLINE}>
              Hủy
            </button>
            <button type="button" onClick={handleSubmit} className={BTN_PRIMARY}>
              <Check className="w-4 h-4" />
              Gửi duyệt thực thể
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Cách định nghĩa thuộc tính — khóa cứng, không cho đổi lại phương thức cấu hình nguồn */}
          {renderLockedDefineMode(true)}

          <div className="border border-[#E2E8F0] rounded-2xl p-4">
            <h4 className={SECTION_TITLE}>{editingAttribute ? 'Chỉnh sửa thuộc tính' : 'Thêm thuộc tính mới'}</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <label className={LABEL_CLS}>
                  Tên trường <span className={REQUIRED_MARK}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.fieldName}
                  onChange={(e) => setFormData({ ...formData, fieldName: e.target.value.toLowerCase() })}
                  placeholder="citizen_id"
                  disabled={!!editingAttribute}
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>
                  Tên hiển thị <span className={REQUIRED_MARK}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="Số CCCD"
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Kiểu dữ liệu</label>
                <div className="relative">
                  <select
                    value={formData.dataType}
                    onChange={(e) => setFormData({ ...formData, dataType: e.target.value as FieldDataType })}
                    className={SELECT_CLS}
                  >
                    {Object.entries(fieldDataTypeLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
                </div>
              </div>
              <div>
                <label className={LABEL_CLS}>Độ dài</label>
                <input
                  type="number"
                  value={formData.length || ''}
                  onChange={(e) => setFormData({ ...formData, length: parseInt(e.target.value) || undefined })}
                  placeholder="255"
                  min="1"
                  disabled={!(['string', 'email', 'phone', 'url'] as FieldDataType[]).includes(formData.dataType!)}
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Giá trị mặc định</label>
                <input
                  type="text"
                  value={formData.defaultValue || ''}
                  onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
                  placeholder="VD: N/A"
                  className={INPUT_CLS}
                />
              </div>
            </div>
            <div className="flex gap-6 mt-4">
              <label className="flex items-center gap-2 text-[13px] text-[#020817] cursor-pointer">
                <input type="checkbox" checked={formData.required}
                  onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                  className={CHECKBOX_CLS} />
                Bắt buộc
              </label>
              <label className="flex items-center gap-2 text-[13px] text-[#020817] cursor-pointer">
                <input type="checkbox" checked={formData.unique}
                  onChange={(e) => setFormData({ ...formData, unique: e.target.checked, indexed: e.target.checked })}
                  className={CHECKBOX_CLS} />
                <span className="flex items-center gap-1"><Key className="w-4 h-4 text-[#155DFC]" /> Khóa (khóa chính)</span>
              </label>
            </div>
          </div>

          {/* Ánh xạ cột nguồn → thuộc tính — cho thuộc tính đang thêm/sửa (nếu thực thể có nguồn đã liên kết) */}
          {(entityConfigs[selectedEntity]?.sources.length || 0) > 0 && (
            <div className={SECTION_CARD_CLS}>
              <div className={`${CARD_HEADER_CLS} justify-between`}>
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-[#475569]" />
                  <p className={CARD_TITLE_CLS}>Ánh xạ cột nguồn → thuộc tính</p>
                </div>
                <span className="text-[13px] text-[#64748B]">{entityConfigs[selectedEntity]?.sources.length} nguồn</span>
              </div>
              <div className="overflow-x-auto custom-scrollbar">
                <table className={TABLE_CLS}>
                  <thead className="bg-[#F8FAFC]">
                    <tr className="h-[42px]">
                      <th className={TH_CLS}>Thuộc tính</th>
                      {entityConfigs[selectedEntity]?.sources.map(src => (
                        <th key={src.id} className={TH_CLS}>{src.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={TR_CLS}>
                      <td className={`${TD_CLS} max-w-[240px] leading-[18px]`}>
                        <TruncatedText text={formData.displayName || '(chưa đặt tên)'} />
                        {formData.fieldName && (
                          <TruncatedText text={formData.fieldName} className="text-[#64748B]" />
                        )}
                      </td>
                      {entityConfigs[selectedEntity]?.sources.map(src => {
                        const dbId = SOURCE_NAME_TO_DB_ID[src.name] || '';
                        const options = getDbColumnOptions(dbId);
                        return (
                          <td key={src.id} className={TD_CLS}>
                            <select
                              value={formFieldMapping[src.id] || ''}
                              onChange={(e) => setFormFieldMapping(prev => ({ ...prev, [src.id]: e.target.value }))}
                              className={`${INPUT_CLS} min-w-0 cursor-pointer`}
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
            <div className={SECTION_CARD_CLS}>
              <div className={`${CARD_HEADER_CLS} gap-2`}>
                <Network className="w-4 h-4 text-[#475569]" />
                <p className={CARD_TITLE_CLS}>Gom nguồn 1:n</p>
              </div>
              <div className="p-4 space-y-3">
                {(entityConfigs[selectedEntity]?.sources || []).filter(s => s.grain === '1:n' && formFieldMapping[s.id]).map(src => {
                  const dbId = SOURCE_NAME_TO_DB_ID[src.name] || '';
                  const colOptions = getDbColumnOptions(dbId);
                  const rule = formFieldGroupRules[src.id] || { ruleType: 'latest', timeColumn: '' };
                  return (
                    <div key={src.id} className="grid grid-cols-3 gap-3 items-end">
                      <div>
                        <label className={LABEL_CLS}>Nguồn (1:n)</label>
                        <div className="h-10 px-3 flex items-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
                          <Badge label={src.name} variant="emerald" />
                        </div>
                      </div>
                      <div>
                        <label className={LABEL_CLS}>Rule gom</label>
                        <div className="relative">
                          <select
                            value={rule.ruleType}
                            onChange={(e) => setFormFieldGroupRules(prev => ({ ...prev, [src.id]: { ...rule, ruleType: e.target.value } }))}
                            className={SELECT_CLS}
                          >
                            {Object.entries(GROUP_RULE_LABELS).map(([val, label]) => (
                              <option key={val} value={val}>{label}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className={LABEL_CLS}>Cột mốc thời gian</label>
                        <div className="relative">
                          <select
                            value={rule.timeColumn}
                            onChange={(e) => setFormFieldGroupRules(prev => ({ ...prev, [src.id]: { ...rule, timeColumn: e.target.value } }))}
                            className={SELECT_CLS}
                          >
                            <option value="">—</option>
                            {colOptions.map(c => <option key={c.fieldName} value={c.fieldName}>{c.fieldName}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {editingAttribute ? (
            <div className={WARN_BANNER_CLS}>
              <AlertCircle className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
              <div>
                <p className="mb-1">Khi chỉnh sửa, phiên bản sẽ tự động tăng từ <strong className="font-medium">v{editingAttribute.version}</strong> lên <strong className="font-medium">v{editingAttribute.version + 1}</strong>.</p>
                <p>Thay đổi này sẽ được ghi nhận trong lịch sử phiên bản.</p>
              </div>
            </div>
          ) : (
            <div className={WARN_BANNER_CLS}>
              <AlertCircle className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
              <div>
                <p className="mb-1">Khi thêm mới thuộc tính, phiên bản thực thể dữ liệu chủ sẽ tăng lên <strong className="font-medium">v2.0</strong>.</p>
                <p>Thay đổi này sẽ được ghi nhận trong lịch sử phiên bản.</p>
              </div>
            </div>
          )}
        </div>
      </BaseModal>

      {/* Gửi trình duyệt Modal — shown after add/edit, same pattern as tab "Thiết lập thực thể" */}
      {approvalAttribute && (
        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-[16px] font-medium text-[#020817] leading-6">Gửi trình duyệt</h3>
                <p className="text-[13px] text-[#64748B] mt-0.5">
                  Thuộc tính: <span className="text-[#020817] font-medium">{approvalAttribute.displayName}</span>
                </p>
              </div>
              <button type="button" onClick={handleCloseApprovalModal} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-auto custom-scrollbar space-y-4">
              {renderApproverFields()}

              <div className="rounded-2xl border border-[#E2E8F0] p-4">
                <h4 className={SECTION_TITLE}>Thông tin thuộc tính</h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <div className={FIELD_LABEL}>Tên trường:</div>
                    <div className={`${FIELD_VALUE} mt-1 break-all`}>{approvalAttribute.fieldName}</div>
                  </div>
                  <div>
                    <div className={FIELD_LABEL}>Kiểu dữ liệu:</div>
                    <div className={`${FIELD_VALUE} mt-1`}>{approvalAttribute.dataType}</div>
                  </div>
                  <div>
                    <div className={FIELD_LABEL}>Thuộc thực thể:</div>
                    <div className={`${FIELD_VALUE} mt-1`}>{selectedEntityData?.name}</div>
                  </div>
                  <div>
                    <div className={FIELD_LABEL}>Phiên bản mới:</div>
                    <div className={`${FIELD_VALUE} mt-1`}>v{approvalAttribute.version}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
              <button type="button" onClick={handleCloseApprovalModal} className={BTN_OUTLINE}>
                Hủy
              </button>
              <button type="button" onClick={handleConfirmApprove} disabled={!selectedApprover} className={BTN_PRIMARY}>
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
        customHeaderIcon={<Database className="w-5 h-5 text-[#155DFC] mr-3 flex-shrink-0" />}
        footer={
          <>
            <button type="button" onClick={handleCloseDldcModal} className={BTN_OUTLINE}>
              Hủy bỏ
            </button>
            <button type="button" onClick={handleOpenStructureApproval} className={BTN_PRIMARY}>
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
              <div className={SECTION_CARD_CLS}>
                <div className={`${CARD_HEADER_CLS} gap-2`}>
                  <Database className="w-4 h-4 text-[#475569]" />
                  <p className={CARD_TITLE_CLS}>Nguồn dữ liệu đã liên kết</p>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {sources.length === 0 ? (
                      <span className="text-[13px] text-[#64748B]">Chưa có nguồn dữ liệu nào được liên kết</span>
                    ) : (
                      sources.map(src => (
                        <span key={src.id} className="inline-flex items-center gap-2 h-10 px-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[13px] font-medium text-[#020817]">
                          <Database className="w-4 h-4 text-[#475569]" />
                          {src.name}
                          <Badge label={src.kind === 'table' ? 'Bảng' : src.kind === 'view' ? 'View' : 'Truy vấn'} variant="blue" />
                          <Badge label={src.grain} variant="emerald" />
                        </span>
                      ))
                    )}
                  </div>
                  <p className="text-[12px] text-[#64748B] mt-3">Không thể đổi lại phương thức/nguồn cấu hình đã chọn khi khởi tạo. Chỉ có thể thêm trường mới từ các nguồn này.</p>
                </div>
              </div>

              {/* Field Selection table */}
              <div className={SECTION_CARD_CLS}>
                <div className={`${CARD_HEADER_CLS} gap-2`}>
                  <FileText className="w-4 h-4 text-[#475569]" />
                  <p className={CARD_TITLE_CLS}>Chọn trường dữ liệu chia sẻ</p>
                  <Badge label={`${dldcFieldRows.filter(r => r.shared).length}/${dldcFieldRows.length} trường được chọn`} variant="blue" />
                </div>
                <div className="overflow-x-auto max-h-[300px] overflow-y-auto custom-scrollbar">
                  <table className={`${TABLE_CLS} table-fixed`}>
                    <colgroup>
                      <col style={{ width: '6%' }} />
                      <col style={{ width: '6%' }} />
                      <col style={{ width: '20%' }} />
                      <col style={{ width: '20%' }} />
                      <col style={{ width: '24%' }} />
                      <col style={{ width: '18%' }} />
                      <col style={{ width: '6%' }} />
                    </colgroup>
                    <thead className="bg-[#F8FAFC] sticky top-0 z-[2]">
                      <tr className="h-[42px]">
                        <th className={`${TH_CLS} !text-center`}>Chia sẻ</th>
                        <th className={`${TH_CLS} !text-center`}>PK</th>
                        <th className={TH_CLS}>Nguồn dữ liệu (Table)</th>
                        <th className={TH_CLS}>Trường gốc (Column)</th>
                        <th className={TH_CLS}>Tên hiển thị</th>
                        <th className={TH_CLS}>Kiểu dữ liệu</th>
                        <th className={`${TH_CLS} !text-center`}>Xóa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dldcFieldRows.length === 0 ? (
                        <tr>
                          <td colSpan={7} className={EMPTY_TD_CLS}>
                            Chưa có trường nào.
                          </td>
                        </tr>
                      ) : (
                        dldcFieldRows.map(row => {
                          const tableInfo = (DLDC_TABLES[Object.keys(DLDC_TABLES).find(dbId => (DLDC_TABLES[dbId] || []).some(t => t.id === row.tableId)) || ''] || []).find(t => t.id === row.tableId);
                          return (
                            <tr key={row.id} className={TR_CLS}>
                              <td className={`${TD_CLS} text-center overflow-hidden`}>
                                <input type="checkbox" checked={row.shared}
                                  aria-label="Chia sẻ"
                                  onChange={(e: ChangeEvent<HTMLInputElement>) => setDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, shared: e.target.checked } : r))}
                                  className={CHECKBOX_CLS} />
                              </td>
                              <td className={`${TD_CLS} text-center overflow-hidden`}>
                                <input type="checkbox" checked={row.isPK}
                                  aria-label="PK"
                                  onChange={(e: ChangeEvent<HTMLInputElement>) => setDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, isPK: e.target.checked } : r))}
                                  className={PK_CHECKBOX_CLS} />
                              </td>
                              <td className={`${TD_CLS} overflow-hidden`}>
                                <TruncatedText text={tableInfo?.displayName || row.tableId} />
                              </td>
                              <td className={`${TD_CLS} overflow-hidden`}>
                                <TruncatedText text={row.columnName} />
                              </td>
                              <td className={`${TD_CLS} overflow-hidden`}>
                                <input type="text" value={row.apiFieldName}
                                  aria-label="Tên hiển thị"
                                  onChange={(e: ChangeEvent<HTMLInputElement>) => setDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, apiFieldName: e.target.value } : r))}
                                  className={`${INPUT_CLS} min-w-0`} />
                              </td>
                              <td className={`${TD_CLS} overflow-hidden`}>
                                <select value={row.dataType}
                                  aria-label="Kiểu dữ liệu"
                                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, dataType: e.target.value as FieldDataType } : r))}
                                  className={`${INPUT_CLS} min-w-0 cursor-pointer`}>
                                  {Object.entries(fieldDataTypeLabels).map(([val, label]) => (
                                    <option key={val} value={val}>{label}</option>
                                  ))}
                                </select>
                              </td>
                              <td className={`${TD_CLS} text-center overflow-hidden`}>
                                <RowIconAction label="Xóa" onClick={() => setDldcFieldRows(prev => prev.filter(r => r.id !== row.id))}>
                                  <Trash2 className="w-4 h-4" />
                                </RowIconAction>
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
              <div className={SECTION_CARD_CLS}>
                <div className={`${CARD_HEADER_CLS} justify-between`}>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-[#475569]" />
                    <p className={CARD_TITLE_CLS}>Ánh xạ cột nguồn → thuộc tính</p>
                  </div>
                  <span className="text-[13px] text-[#64748B]">{sources.length} nguồn</span>
                </div>
                {dldcFieldRows.filter(r => r.shared).length === 0 ? (
                  <p className="text-[13px] text-[#64748B] text-center py-6">Chưa có thuộc tính để ánh xạ</p>
                ) : (
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className={TABLE_CLS}>
                      <thead className="bg-[#F8FAFC]">
                        <tr className="h-[42px]">
                          <th className={TH_CLS}>Thuộc tính</th>
                          {sources.map(src => (
                            <th key={src.id} className={TH_CLS}>{src.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {dldcFieldRows.filter(r => r.shared).map(row => (
                          <tr key={row.id} className={TR_CLS}>
                            <td className={`${TD_CLS} max-w-[240px] leading-[18px]`}>
                              <TruncatedText text={row.apiFieldName || row.columnName} />
                              <TruncatedText text={row.columnName} className="text-[#64748B]" />
                            </td>
                            {sources.map(src => {
                              const dbId = SOURCE_NAME_TO_DB_ID[src.name] || '';
                              const options = getDbColumnOptions(dbId);
                              return (
                                <td key={src.id} className={TD_CLS}>
                                  <select
                                    value={dldcMapping[row.columnName]?.[src.id] || ''}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => handleDldcMappingChange(row.columnName, src.id, e.target.value)}
                                    className={`${INPUT_CLS} min-w-0 cursor-pointer`}
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

              {/* Gom nguồn 1:n */}
              {sources.filter(s => s.grain === '1:n').length > 0 && (
                <div className={SECTION_CARD_CLS}>
                  <div className={`${CARD_HEADER_CLS} justify-between`}>
                    <div className="flex items-center gap-2">
                      <Network className="w-4 h-4 text-[#475569]" />
                      <p className={CARD_TITLE_CLS}>Gom nguồn 1:n</p>
                    </div>
                    <Badge label={`${sources.filter(s => s.grain === '1:n').length} nguồn 1:n`} variant="emerald" />
                  </div>
                  <div className="p-4 space-y-4">
                    <p className="text-[13px] text-[#64748B]">Với nguồn có độ mịn 1:n, chọn quy tắc gom nhiều bản ghi thành một giá trị cho từng thuộc tính</p>
                    {sources.filter(s => s.grain === '1:n').map(src => {
                      const dbId = SOURCE_NAME_TO_DB_ID[src.name] || '';
                      const colOptions = getDbColumnOptions(dbId);
                      const rowsForSrc = dldcFieldRows.filter(r => r.shared && dldcMapping[r.columnName]?.[src.id]);
                      return (
                        <div key={src.id} className="border border-[#E2E8F0] rounded-lg overflow-hidden">
                          <div className="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#E2E8F0]">
                            <span className="text-[13px] font-medium text-[#020817]">Nguồn (1:n): {src.name}</span>
                          </div>
                          {rowsForSrc.length === 0 ? (
                            <p className="text-[13px] text-[#64748B] text-center py-6">Chưa có thuộc tính nào ánh xạ từ nguồn này</p>
                          ) : (
                            <div className="overflow-x-auto custom-scrollbar">
                              <table className={TABLE_CLS}>
                                <thead className="bg-[#F8FAFC]">
                                  <tr className="h-[42px]">
                                    <th className={TH_CLS}>Thuộc tính</th>
                                    <th className={TH_CLS}>Rule gom</th>
                                    <th className={TH_CLS}>Cột mốc thời gian</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {rowsForSrc.map(row => {
                                    const gr = dldcGroupRules[src.id]?.[row.columnName];
                                    return (
                                      <tr key={row.id} className={TR_CLS}>
                                        <td className={`${TD_CLS} max-w-[240px] leading-[18px]`}>
                                          <TruncatedText text={row.apiFieldName || row.columnName} />
                                          <TruncatedText text={row.columnName} className="text-[#64748B]" />
                                        </td>
                                        <td className={TD_CLS}>
                                          <select
                                            value={gr?.ruleType || 'latest'}
                                            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleDldcGroupRuleChange(src.id, row.columnName, { ruleType: e.target.value })}
                                            className={`${INPUT_CLS} min-w-0 cursor-pointer`}
                                          >
                                            {Object.entries(GROUP_RULE_LABELS).map(([val, label]) => (
                                              <option key={val} value={val}>{label}</option>
                                            ))}
                                          </select>
                                        </td>
                                        <td className={TD_CLS}>
                                          <select
                                            value={gr?.timeColumn || ''}
                                            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleDldcGroupRuleChange(src.id, row.columnName, { timeColumn: e.target.value })}
                                            className={`${INPUT_CLS} min-w-0 cursor-pointer`}
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

              <div className={WARN_BANNER_CLS}>
                <AlertCircle className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
                <div>
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
        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-[16px] font-medium text-[#020817] leading-6">Gửi trình duyệt cấu trúc</h3>
                <p className="text-[13px] text-[#64748B] mt-0.5">
                  Thực thể: <span className="text-[#020817] font-medium">{selectedEntityData?.name}</span>
                </p>
              </div>
              <button type="button" onClick={handleCloseStructureApprovalModal} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-auto custom-scrollbar space-y-4">
              {renderApproverFields()}

              <div className="rounded-2xl border border-[#E2E8F0] p-4">
                <h4 className={SECTION_TITLE}>Thông tin cấu trúc</h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <div className={FIELD_LABEL}>Mã dữ liệu chủ:</div>
                    <div className={`${FIELD_VALUE} mt-1 break-all`}>{selectedEntityData?.code}</div>
                  </div>
                  <div>
                    <div className={FIELD_LABEL}>Kho dữ liệu:</div>
                    <div className={`${FIELD_VALUE} mt-1`}>
                      {DLDC_DATABASES.find(db => db.id === selectedEntityData?.primaryDatabaseId)?.label || '—'}
                    </div>
                  </div>
                  <div>
                    <div className={FIELD_LABEL}>Số trường chia sẻ:</div>
                    <div className={`${FIELD_VALUE} mt-1 tabular-nums`}>
                      {dldcFieldRows.filter(r => r.shared && r.columnName).length}/{dldcFieldRows.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
              <button type="button" onClick={handleCloseStructureApprovalModal} className={BTN_OUTLINE}>
                Hủy
              </button>
              <button type="button" onClick={handleConfirmDldcStructure} disabled={!selectedApprover} className={BTN_PRIMARY}>
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
              type="button"
              onClick={() => { setShowDeleteConfirm(false); setDeletingAttr(null); }}
              className={BTN_OUTLINE}
            >
              Hủy
            </button>
            <button type="button" onClick={handleConfirmDelete} className={BTN_DESTRUCTIVE}>
              <Trash2 className="w-4 h-4" />
              Xác nhận xóa
            </button>
          </>
        }
      >
        <div className="flex items-start gap-3 px-4 py-3 bg-[#FEF2F2] border border-[#FEE2E2] rounded-lg">
          <AlertCircle className="w-4 h-4 text-[#DC2626] flex-shrink-0 mt-0.5" />
          <p className="text-[13px] text-[#020817] leading-relaxed">
            Bạn có chắc chắn muốn xóa trường{' '}
            <strong className="font-medium">{deletingAttr?.displayName}</strong>{' '}
            (<span className="text-[#64748B]">{deletingAttr?.fieldName}</span>)?{' '}
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
          <button type="button" onClick={() => setShowVersionHistory(false)} className={BTN_OUTLINE}>
            Đóng
          </button>
        }
      >
        <div className="space-y-4">
          {mockVersionHistory.map((history) => (
            <div key={history.version} className="flex gap-4 pb-4 border-b border-[#E2E8F0] last:border-0">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#EAF3FF] flex items-center justify-center">
                  <span className="text-[13px] font-medium text-[#155DFC]">v{history.version}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[#020817]">{history.changes}</p>
                <div className="flex items-center gap-4 mt-1.5 text-[12px] text-[#64748B]">
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
        customHeaderIcon={<Database className="w-5 h-5 text-[#155DFC] mr-3 flex-shrink-0" />}
        footer={
          <button type="button" onClick={() => setShowDldcDetailModal(false)} className={BTN_OUTLINE}>
            Đóng
          </button>
        }
      >
        {(() => {
          const entityConfig = entityConfigs[selectedEntity];
          return (
            <div className="space-y-4 text-left">
              {/* Cách định nghĩa thuộc tính — chỉ hiển thị với thực thể cấu hình thủ công */}
              {selectedEntityData?.dataSource === 'manual' && renderLockedDefineMode(false)}

              {/* Chọn trường dữ liệu chia sẻ — giống mục Tạo thuộc tính ở Tạo mới dữ liệu chủ */}
              <div className={SECTION_CARD_CLS}>
                <div className={`${CARD_HEADER_CLS} gap-2`}>
                  <FileText className="w-4 h-4 text-[#475569]" />
                  <p className={CARD_TITLE_CLS}>Chọn trường dữ liệu chia sẻ</p>
                  <Badge label={`${currentEntityAttributes.length}/${currentEntityAttributes.length} trường được chọn`} variant="blue" />
                </div>
                <div className="overflow-x-auto max-h-[350px] overflow-y-auto custom-scrollbar">
                  <table className={`${TABLE_CLS} table-fixed`}>
                    <colgroup>
                      <col style={{ width: '6%' }} />
                      <col style={{ width: '6%' }} />
                      <col style={{ width: '16%' }} />
                      <col style={{ width: '16%' }} />
                      <col style={{ width: '16%' }} />
                      <col style={{ width: '20%' }} />
                      <col style={{ width: '20%' }} />
                    </colgroup>
                    <thead className="bg-[#F8FAFC] sticky top-0 z-[2]">
                      <tr className="h-[42px]">
                        <th className={`${TH_CLS} !text-center`}>
                          <input type="checkbox" checked disabled aria-label="Chọn tất cả" className={CHECKBOX_CLS} />
                        </th>
                        <th className={`${TH_CLS} !text-center`}>PK</th>
                        <th className={TH_CLS}>Nguồn (Table)</th>
                        <th className={TH_CLS}>Trường gốc (Column)</th>
                        <th className={TH_CLS}>Tên cột</th>
                        <th className={TH_CLS}>Tên hiển thị</th>
                        <th className={TH_CLS}>Kiểu dữ liệu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentEntityAttributes.length === 0 ? (
                        <tr>
                          <td colSpan={7} className={EMPTY_TD_CLS}>
                            Chưa có trường nào được cấu hình.
                          </td>
                        </tr>
                      ) : (
                        currentEntityAttributes.map(attr => (
                          <tr key={attr.id} className={TR_CLS}>
                            <td className={`${TD_CLS} text-center overflow-hidden`}>
                              <input type="checkbox" checked disabled aria-label="Chia sẻ" className={CHECKBOX_CLS} />
                            </td>
                            <td className={`${TD_CLS} text-center overflow-hidden`}>
                              <input type="checkbox" checked={attr.unique} disabled aria-label="PK" className={PK_CHECKBOX_CLS} />
                            </td>
                            <td className={`${TD_CLS} overflow-hidden`}>
                              <TruncatedText text={getTableDisplayName(attr.tableName || selectedEntityData?.primaryTableId, selectedEntityData?.dataSource)} />
                            </td>
                            <td className={`${TD_CLS} overflow-hidden`}>
                              <TruncatedText text={attr.fieldName} />
                            </td>
                            <td className={`${TD_CLS} overflow-hidden`}>
                              <TruncatedText text={attr.fieldName} />
                            </td>
                            <td className={`${TD_CLS} overflow-hidden`}>
                              <TruncatedText text={attr.displayName} />
                            </td>
                            <td className={`${TD_CLS} overflow-hidden`}>
                              <TruncatedText text={fieldDataTypeLabels[attr.dataType]} />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Ánh xạ cột nguồn → thuộc tính */}
              <div className={SECTION_CARD_CLS}>
                <div className={`${CARD_HEADER_CLS} justify-between`}>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-[#475569]" />
                    <p className={CARD_TITLE_CLS}>Ánh xạ cột nguồn → thuộc tính</p>
                  </div>
                  <span className="text-[13px] text-[#64748B]">{entityConfig?.sources.length || 0} nguồn</span>
                </div>

                {(entityConfig?.sources.length || 0) <= 1 && (
                  <div className="px-4 py-2.5 bg-[#FFF7ED] border-b border-[#FED7AA] flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#D97706] flex-shrink-0" />
                    <p className="text-[13px] text-[#020817]">Chỉ 1 nguồn — ánh xạ trực tiếp</p>
                  </div>
                )}

                {currentEntityAttributes.length === 0 ? (
                  <p className="text-[13px] text-[#64748B] text-center py-6 px-4">Chưa có thuộc tính để ánh xạ</p>
                ) : (
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className={TABLE_CLS}>
                      <thead className="bg-[#F8FAFC]">
                        <tr className="h-[42px]">
                          <th className={TH_CLS}>Thuộc tính</th>
                          {entityConfig?.sources.map(src => (
                            <th key={src.id} className={TH_CLS}>{src.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {currentEntityAttributes.map(attr => (
                          <tr key={attr.fieldName} className={TR_CLS}>
                            <td className={`${TD_CLS} max-w-[360px] leading-[18px]`}>
                              <TruncatedText text={attr.displayName} />
                              <TruncatedText text={attr.fieldName} className="text-[#64748B]" />
                            </td>
                            {entityConfig?.sources.map(src => {
                              const mappedCol = entityConfig.mapping[attr.fieldName]?.[src.id];
                              return (
                                <td key={src.id} className={`${TD_CLS} max-w-[240px]`}>
                                  {mappedCol ? (
                                    <TruncatedText text={mappedCol} />
                                  ) : (
                                    <span className="text-[#64748B]">—</span>
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
