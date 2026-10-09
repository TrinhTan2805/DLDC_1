import { useState, ChangeEvent } from 'react';
import { X, Check, ChevronRight, ChevronLeft, AlertCircle, AlertTriangle, CheckCircle2, Plus, Trash2, Database, FileText, ChevronDown, ChevronUp, Network, ArrowRight, Key, Search, SquarePen, GitMerge, Info } from 'lucide-react';
import { Portal } from '../../common/Portal';
import { toast } from 'sonner';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../ui/tooltip';
import {
  Badge, TruncatedText, RowIconAction, Pagination, tabClass, normalizeSearch,
  BTN_PRIMARY, BTN_OUTLINE, BTN_GHOST_ICON, INPUT_CLS, LABEL_CLS, REQUIRED_MARK,
  TOOLTIP_CLS, SEARCH_INPUT_CLS, SEARCH_BTN_CLS,
} from '../collection/collectionUi';

// Lớp dùng chung theo quy chuẩn (tailieu/docs/compomennt.md) — chỉ dùng nội bộ file này
const SELECT_CLS = `${INPUT_CLS} cursor-pointer`;
const INPUT_BOX = INPUT_CLS.replace('w-full ', '');
const TEXTAREA_CLS = 'w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-[#F1F5F9] disabled:text-[#94A3B8] disabled:cursor-not-allowed';
const INFO_BANNER = 'bg-[#EAF3FF] border border-[#BFDBFE] rounded-lg p-4';
const TH_CLS = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TR_CLS = 'h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors';

type LifecycleStatus = 'active' | 'draft' | 'inactive' | 'archived';
type DataType = 'individual' | 'organization' | 'legal' | 'asset';
type ScopeType = 'national' | 'ministry' | 'provincial' | 'internal';
type DataSourceType = 'dldc' | 'manual';
type UpdateStrategyType = 'reference' | 'scheduled' | 'realtime';
type SyncFrequencyType = 'daily' | 'weekly' | 'monthly' | 'event';
type FieldDataType = 'string' | 'number' | 'date' | 'datetime' | 'boolean' | 'text' | 'email' | 'phone' | 'url';
type WizardRelType = '1-1' | '1-n' | 'n-1' | 'n-n';
type SeparatorType = 'none' | '-' | '.' | '/';
type MatchMethod = 'exact' | 'fuzzy' | 'normalized';
type ConflictStrategy = 'source' | 'priority';
type MergeTrigger = 'auto' | 'approval';
type ConditionOperator = 'AND' | 'OR';

type FuzzyAlgorithm = 'jaro_winkler' | 'levenshtein' | 'phonetic';
type NullHandling = 'next' | 'skip';
type OnEmpty = 'required' | 'warn' | 'allow';
type MergeSubTab = 'match' | 'survivor' | 'test';
type SourceKind = 'table' | 'view' | 'query';
type SourceGrain = '1:1' | '1:n';
type GroupRuleType = 'latest' | 'most_frequent' | 'max' | 'min';

interface SourceGroupRule {
  fieldName: string;
  ruleType: GroupRuleType;
}

export interface WizardSource {
  id: string;
  name: string;
  kind: SourceKind;
  grain: SourceGrain;
  // Bảng nguồn (id bảng DLDC thuộc nguồn) — hiển thị cột "Bảng nguồn" và dạng "Tên nguồn - Bảng nguồn" ở Xem chi tiết
  table?: string;
  grainKey?: string;
  groupRules?: SourceGroupRule[];
}

interface GroupRule {
  ruleType: GroupRuleType;
  timeColumn: string;
}

interface MatchingRule {
  id: string;
  fieldName: string;
  method: MatchMethod;
  fuzzyThreshold: number;
  normalize: boolean;
  operator: ConditionOperator;
  weight: number;
  algorithm: FuzzyAlgorithm;
}

interface ExtractionRule {
  id: string;
  fieldName: string;
  primarySource: string;
  priorityOrder: string[];
  conflictStrategy: ConflictStrategy;
  nullHandling: NullHandling;
  onEmpty: OnEmpty;
}

interface WizardRelationship {
  id: string;
  targetEntityId: string;
  targetEntityName: string;
  type: WizardRelType;
  sourceKey: string;
  targetKey: string;
  displayField?: string;
  mappingTable?: string;
}

interface RelFormData {
  targetEntityId: string;
  targetEntityName: string;
  type: WizardRelType;
  sourceKey: string;
  targetKey: string;
  displayField: string;
  mappingTable: string;
}

interface IdentifierConfig {
  prefix: string;
  separator: SeparatorType;
  digits: number;
  startFrom: number;
  increment: number;
  suffix: string;
  checkDuplicate: boolean;
}

type VersionFormatType = 'increment' | 'yearIncrement' | 'custom' | 'semver';
type SemverIncrementPart = 'major' | 'minor' | 'patch';

interface VersioningConfig {
  versionFormat: VersionFormatType;
  customPrefix: string;
  startFrom: string;
  // Định dạng 3 chữ số (Semver): Major.Minor.Patch
  semverPrefix: string;
  semverMajor: string;
  semverMinor: string;
  semverPatch: string;
  semverIncrementPart: SemverIncrementPart;
}

interface MergeConfig {
  keepSourceRef: boolean;
  mergeTrigger: MergeTrigger;
  minMatchScore: number;
  autoThreshold: number;
  reviewThreshold: number;
  hardBlockFields: string[];
}

export interface DldcFieldRow {
  id: string;
  shared: boolean;
  isPK: boolean;
  tableId: string;
  sourceJoinId: string | null;
  columnName: string;
  apiFieldName: string;
  displayName: string;
  dataType: FieldDataType;
}

const DLDC_DATABASES = [
  { id: 'hotich', label: 'Hộ tịch' },
  { id: 'cccd',   label: 'Căn cước công dân' },
  { id: 'dkkd',   label: 'Đăng ký kinh doanh' },
  { id: 'lltp',   label: 'Lý lịch tư pháp' },
  { id: 'btdp',   label: 'Bổ trợ tư pháp' },
];

const DLDC_TABLES: Record<string, { id: string; displayName: string }[]> = {
  hotich: [
    { id: 'tbl_khaisinh',  displayName: 'Khai sinh' },
    { id: 'tbl_kethon',    displayName: 'Kết hôn' },
    { id: 'tbl_ly_hon',    displayName: 'Ly hôn' },
    { id: 'tbl_khai_tu',   displayName: 'Khai tử' },
    { id: 'tbl_gioi_tinh', displayName: 'Danh mục giới tính' },
  ],
  cccd: [
    { id: 'tbl_can_cuoc', displayName: 'Căn cước công dân' },
    { id: 'tbl_cu_tru',   displayName: 'Cư trú' },
  ],
  dkkd: [
    { id: 'tbl_doanhnghiep',   displayName: 'Doanh nghiệp' },
    { id: 'tbl_ho_kinh_doanh', displayName: 'Hộ kinh doanh' },
    { id: 'tbl_giay_phep',     displayName: 'Giấy phép kinh doanh' },
  ],
  lltp: [
    { id: 'tbl_ly_lich_tu_phap', displayName: 'Lý lịch tư pháp' },
    { id: 'tbl_an_tich',         displayName: 'Án tích' },
  ],
  btdp: [
    { id: 'tbl_cong_chung', displayName: 'Công chứng' },
    { id: 'tbl_luat_su',    displayName: 'Luật sư' },
    { id: 'tbl_tro_giup',   displayName: 'Trợ giúp pháp lý' },
  ],
};

const DLDC_FIELDS: Record<string, { fieldName: string; displayName: string; dataType: FieldDataType }[]> = {
  tbl_khaisinh: [
    { fieldName: 'ma_khai_sinh', displayName: 'Mã khai sinh', dataType: 'string' },
    { fieldName: 'ho_ten',       displayName: 'Họ và tên',    dataType: 'string' },
    { fieldName: 'ngay_sinh',    displayName: 'Ngày sinh',    dataType: 'date'   },
    { fieldName: 'gioi_tinh',    displayName: 'Giới tính',    dataType: 'string' },
    { fieldName: 'noi_sinh',     displayName: 'Nơi sinh',     dataType: 'string' },
    { fieldName: 'ho_ten_cha',   displayName: 'Họ tên cha',   dataType: 'string' },
    { fieldName: 'ho_ten_me',    displayName: 'Họ tên mẹ',    dataType: 'string' },
    { fieldName: 'so_dinh_danh', displayName: 'Số định danh', dataType: 'string' },
  ],
  tbl_kethon: [
    { fieldName: 'ma_dang_ky',     displayName: 'Mã đăng ký',     dataType: 'string' },
    { fieldName: 'ten_chong',      displayName: 'Tên chồng',       dataType: 'string' },
    { fieldName: 'cccd_chong',     displayName: 'CCCD chồng',      dataType: 'string' },
    { fieldName: 'ten_vo',         displayName: 'Tên vợ',          dataType: 'string' },
    { fieldName: 'cccd_vo',        displayName: 'CCCD vợ',         dataType: 'string' },
    { fieldName: 'ngay_dang_ky',   displayName: 'Ngày đăng ký',    dataType: 'date'   },
    { fieldName: 'co_quan_dang_ky',displayName: 'Cơ quan đăng ký', dataType: 'string' },
  ],
  tbl_ly_hon: [
    { fieldName: 'ma_ban_an',   displayName: 'Mã bản án',   dataType: 'string' },
    { fieldName: 'ten_chong',   displayName: 'Tên chồng',   dataType: 'string' },
    { fieldName: 'ten_vo',      displayName: 'Tên vợ',      dataType: 'string' },
    { fieldName: 'ngay_ly_hon', displayName: 'Ngày ly hôn', dataType: 'date'   },
    { fieldName: 'toa_an',      displayName: 'Tòa án',      dataType: 'string' },
  ],
  tbl_khai_tu: [
    { fieldName: 'ma_khai_tu',  displayName: 'Mã khai tử',  dataType: 'string' },
    { fieldName: 'ho_ten',      displayName: 'Họ và tên',   dataType: 'string' },
    { fieldName: 'ngay_mat',    displayName: 'Ngày mất',    dataType: 'date'   },
    { fieldName: 'noi_mat',     displayName: 'Nơi mất',     dataType: 'string' },
    { fieldName: 'nguyen_nhan', displayName: 'Nguyên nhân', dataType: 'string' },
  ],
  tbl_gioi_tinh: [
    { fieldName: 'ma_gioi_tinh',  displayName: 'Mã giới tính',  dataType: 'string' },
    { fieldName: 'ten_gioi_tinh', displayName: 'Tên giới tính', dataType: 'string' },
    { fieldName: 'ghi_chu',       displayName: 'Ghi chú',       dataType: 'string' },
  ],
  tbl_can_cuoc: [
    { fieldName: 'so_cccd',      displayName: 'Số CCCD',      dataType: 'string' },
    { fieldName: 'ho_ten',       displayName: 'Họ và tên',    dataType: 'string' },
    { fieldName: 'ngay_sinh',    displayName: 'Ngày sinh',    dataType: 'date'   },
    { fieldName: 'gioi_tinh',    displayName: 'Giới tính',    dataType: 'string' },
    { fieldName: 'que_quan',     displayName: 'Quê quán',     dataType: 'string' },
    { fieldName: 'thuong_tru',   displayName: 'Thường trú',   dataType: 'string' },
    { fieldName: 'ngay_cap',     displayName: 'Ngày cấp',     dataType: 'date'   },
    { fieldName: 'noi_cap',      displayName: 'Nơi cấp',      dataType: 'string' },
    { fieldName: 'ngay_het_han', displayName: 'Ngày hết hạn', dataType: 'date'   },
  ],
  tbl_cu_tru: [
    { fieldName: 'so_cccd',             displayName: 'Số CCCD',             dataType: 'string' },
    { fieldName: 'ho_ten',              displayName: 'Họ và tên',           dataType: 'string' },
    { fieldName: 'dia_chi_thuong_tru',  displayName: 'Địa chỉ thường trú',  dataType: 'string' },
    { fieldName: 'dia_chi_tam_tru',     displayName: 'Địa chỉ tạm trú',     dataType: 'string' },
    { fieldName: 'ngay_dang_ky',        displayName: 'Ngày đăng ký',        dataType: 'date'   },
  ],
  tbl_doanhnghiep: [
    { fieldName: 'ma_so_thue',       displayName: 'Mã số thuế',       dataType: 'string' },
    { fieldName: 'ten_doanh_nghiep', displayName: 'Tên doanh nghiệp', dataType: 'string' },
    { fieldName: 'loai_hinh',        displayName: 'Loại hình',        dataType: 'string' },
    { fieldName: 'dia_chi',          displayName: 'Địa chỉ',          dataType: 'string' },
    { fieldName: 'nguoi_dai_dien',   displayName: 'Người đại diện',   dataType: 'string' },
    { fieldName: 'ngay_dang_ky',     displayName: 'Ngày đăng ký',     dataType: 'date'   },
    { fieldName: 'von_dieu_le',      displayName: 'Vốn điều lệ',      dataType: 'number' },
    { fieldName: 'trang_thai',       displayName: 'Trạng thái',       dataType: 'string' },
  ],
  tbl_ho_kinh_doanh: [
    { fieldName: 'ma_dang_ky', displayName: 'Mã đăng ký', dataType: 'string' },
    { fieldName: 'ten_ho_kd',  displayName: 'Tên hộ KD',  dataType: 'string' },
    { fieldName: 'chu_ho',     displayName: 'Chủ hộ',     dataType: 'string' },
    { fieldName: 'dia_chi',    displayName: 'Địa chỉ',    dataType: 'string' },
    { fieldName: 'nganh_nghe', displayName: 'Ngành nghề', dataType: 'string' },
    { fieldName: 'ngay_cap',   displayName: 'Ngày cấp',   dataType: 'date'   },
  ],
  tbl_giay_phep: [
    { fieldName: 'so_giay_phep',   displayName: 'Số giấy phép',   dataType: 'string' },
    { fieldName: 'ten_co_so',      displayName: 'Tên cơ sở',      dataType: 'string' },
    { fieldName: 'loai_giay_phep', displayName: 'Loại giấy phép', dataType: 'string' },
    { fieldName: 'ngay_cap',       displayName: 'Ngày cấp',       dataType: 'date'   },
    { fieldName: 'ngay_het_han',   displayName: 'Ngày hết hạn',   dataType: 'date'   },
    { fieldName: 'co_quan_cap',    displayName: 'Cơ quan cấp',    dataType: 'string' },
  ],
  tbl_ly_lich_tu_phap: [
    { fieldName: 'so_phieu',  displayName: 'Số phiếu LLTP', dataType: 'string' },
    { fieldName: 'ho_ten',    displayName: 'Họ và tên',     dataType: 'string' },
    { fieldName: 'ngay_sinh', displayName: 'Ngày sinh',     dataType: 'date'   },
    { fieldName: 'so_cccd',   displayName: 'Số CCCD',       dataType: 'string' },
    { fieldName: 'ket_qua',   displayName: 'Kết quả',       dataType: 'string' },
    { fieldName: 'ngay_cap',  displayName: 'Ngày cấp',      dataType: 'date'   },
  ],
  tbl_an_tich: [
    { fieldName: 'ma_an_tich', displayName: 'Mã án tích',    dataType: 'string' },
    { fieldName: 'ho_ten',     displayName: 'Họ và tên',     dataType: 'string' },
    { fieldName: 'toi_danh',   displayName: 'Tội danh',      dataType: 'string' },
    { fieldName: 'hinh_phat',  displayName: 'Hình phạt',     dataType: 'string' },
    { fieldName: 'ngay_phat',  displayName: 'Ngày phán xét', dataType: 'date'   },
  ],
  tbl_cong_chung: [
    { fieldName: 'ma_giao_dich',      displayName: 'Mã giao dịch',       dataType: 'string' },
    { fieldName: 'loai_hop_dong',     displayName: 'Loại hợp đồng',      dataType: 'string' },
    { fieldName: 'to_chuc_cong_chung',displayName: 'Tổ chức công chứng', dataType: 'string' },
    { fieldName: 'ngay_cong_chung',   displayName: 'Ngày công chứng',    dataType: 'date'   },
    { fieldName: 'ben_a',             displayName: 'Bên A',               dataType: 'string' },
    { fieldName: 'ben_b',             displayName: 'Bên B',               dataType: 'string' },
  ],
  tbl_luat_su: [
    { fieldName: 'so_the',       displayName: 'Số thẻ LS',    dataType: 'string' },
    { fieldName: 'ho_ten',       displayName: 'Họ và tên',    dataType: 'string' },
    { fieldName: 'doan_luat_su', displayName: 'Đoàn luật sư', dataType: 'string' },
    { fieldName: 'ngay_cap',     displayName: 'Ngày cấp thẻ', dataType: 'date'   },
    { fieldName: 'trang_thai',   displayName: 'Trạng thái',   dataType: 'string' },
  ],
  tbl_tro_giup: [
    { fieldName: 'ma_ho_so',       displayName: 'Mã hồ sơ',       dataType: 'string' },
    { fieldName: 'ho_ten',         displayName: 'Họ và tên',       dataType: 'string' },
    { fieldName: 'loai_ho_tro',    displayName: 'Loại hỗ trợ',     dataType: 'string' },
    { fieldName: 'ngay_tiep_nhan', displayName: 'Ngày tiếp nhận',  dataType: 'date'   },
    { fieldName: 'trang_thai',     displayName: 'Trạng thái',      dataType: 'string' },
  ],
};

const FIELD_DATA_TYPES: { value: FieldDataType; label: string }[] = [
  { value: 'string',   label: 'Chuỗi (String)' },
  { value: 'number',   label: 'Số (Number)' },
  { value: 'date',     label: 'Ngày (Date)' },
  { value: 'datetime', label: 'Ngày giờ (DateTime)' },
  { value: 'boolean',  label: 'Logic (Boolean)' },
  { value: 'text',     label: 'Văn bản dài (Text)' },
  { value: 'email',    label: 'Email' },
  { value: 'phone',    label: 'Số điện thoại' },
  { value: 'url',      label: 'URL' },
];

interface AttributeForm {
  fieldName: string;
  displayName: string;
  dataType: FieldDataType;
  length?: number;
  required: boolean;
  isKey: boolean;
  defaultValue?: string;
}

export interface WizardData {
  // Step 1
  code?: string;
  name: string;
  dataType: DataType;
  managingAgency: string;
  scope: ScopeType;
  description: string;
  systemName?: string;
  // Ngày hiệu lực mặc định gán cho các bản ghi của thực thể, có thể chỉnh sửa khi rà soát bản ghi
  effectiveDate?: string;
  lifecycleStatus: LifecycleStatus;
  sources: WizardSource[];
  dataSource?: DataSourceType;
  apiSystem?: string;
  apiManagingUnit?: string;
  apiEndpoint?: string;
  apiMethod?: 'GET' | 'POST' | 'PUT';
  updateStrategy?: UpdateStrategyType;
  syncFrequency?: SyncFrequencyType;

  // Step 2
  attributes: AttributeForm[];

  // Step 3
  mergeRules: string[];
  // Step 3 — ánh xạ cột nguồn → thuộc tính (key thuộc tính → key sourceId → tên cột)
  mapping: Record<string, Record<string, string>>;
  // Step 3 — gom nguồn 1:n (key sourceId → key thuộc tính → GroupRule)
  groupRules: Record<string, Record<string, GroupRule>>;

  // Step 5
  relationships: WizardRelationship[];

  // Step 6
  approvalReviewer: string;
  approvalNotes: string;
}

interface MasterDataWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WizardData) => void;
  // Lưu tạm dữ liệu đang nhập ở trạng thái nháp, không yêu cầu điền đủ 7 bước
  onSaveDraft?: (data: WizardData) => void;
  // Cho phép nạp sẵn dữ liệu thực thể đang có (VD: mở nhanh từ tab Thiết lập thuộc tính)
  initialData?: Partial<WizardData>;
  initialDldcFieldRows?: DldcFieldRow[];
  initialStep?: number;
  // Đang chỉnh sửa thực thể đã có (khác với tạo mới) — dùng để khoá Ngày hiệu lực
  isEditMode?: boolean;
}

const MANAGING_UNITS = [
  'Cục Hành chính tư pháp',
  'Cục Bổ trợ tư pháp',
  'Cục Phổ biến, GDPL và Trợ giúp pháp lý',
  'Cục Đăng ký giao dịch bảo đảm và Bồi thường nhà nước',
  'Cục Quản lý thi hành án dân sự',
  'Cục Đăng ký kinh doanh',
  'Cục Công nghệ thông tin',
  'Vụ Pháp luật dân sự - Kinh tế',
  'Vụ Pháp luật hình sự - Hành chính',
  'Vụ Pháp luật quốc tế',
  'Vụ Các vấn đề chung về xây dựng pháp luật',
  'Vụ Kế hoạch - Tài chính',
  'Văn phòng Bộ',
  'Bộ Tư pháp',
  'Bộ Nội vụ',
  'Bộ Công an',
  'Bộ Kế hoạch và Đầu tư',
];

// Danh sách các hệ thống đang kết nối/khai thác trong Kho DLDC, dùng cho dropdown "Tên cơ sở dữ liệu / Hệ thống"
const SYSTEM_OPTIONS = [
  'CSDL hộ tịch điện tử',
  'CSDL quốc gia về dân cư',
  'Hệ thống đăng ký kinh doanh quốc gia',
  'Cơ sở dữ liệu quốc gia về văn bản pháp luật',
  'Cổng Dịch vụ công Quốc gia',
  'Cổng dữ liệu mở Hà Nội',
  'Hệ thống trợ giúp pháp lý',
];

const MOCK_REVIEWERS = [
  { id: 'rv-01', name: 'Nguyễn Văn An', title: 'Trưởng phòng CNTT' },
  { id: 'rv-02', name: 'Trần Thị Bình', title: 'Phó Cục trưởng' },
  { id: 'rv-03', name: 'Lê Văn Cường', title: 'Trưởng ban Quản lý dữ liệu' },
  { id: 'rv-04', name: 'Phạm Thị Dung', title: 'Giám đốc Kho dữ liệu' },
  { id: 'rv-05', name: 'Hoàng Văn Em', title: 'Trưởng phòng Pháp chế' },
];

const WIZARD_MOCK_ENTITIES = [
  { id: 'me-citizen',   code: 'CITIZEN',   name: 'Công dân' },
  { id: 'me-org',       code: 'ORG',       name: 'Tổ chức' },
  { id: 'me-authority', code: 'AUTHORITY', name: 'Cơ quan nhà nước' },
  { id: 'me-address',   code: 'ADDRESS',   name: 'Địa chỉ hành chính' },
  { id: 'me-land',      code: 'LAND',      name: 'Đất đai' },
  { id: 'me-vehicle',   code: 'VEHICLE',   name: 'Phương tiện' },
  { id: 'me-license',   code: 'LICENSE',   name: 'Giấy phép' },
];

const MATCH_METHOD_LABELS: Record<MatchMethod, string> = {
  exact: 'Khớp tuyệt đối',
  fuzzy: 'Khớp gần đúng',
  normalized: 'Chuẩn hóa',
};

const FUZZY_ALGORITHMS: { value: FuzzyAlgorithm; label: string }[] = [
  { value: 'jaro_winkler', label: 'Tương đồng chuỗi' },
  { value: 'levenshtein',  label: 'Khoảng cách chỉnh sửa' },
  { value: 'phonetic',     label: 'Ngữ âm' },
];

const CONFLICT_STRATEGY_LABELS: Record<ConflictStrategy, string> = {
  source: 'Theo nguồn',
  priority: 'Độ ưu tiên',
};

const WIZARD_MOCK_SAMPLES = [
  { id: 'sample-100',  label: '100 bản ghi' },
  { id: 'sample-500',  label: '500 bản ghi' },
  { id: 'sample-1000', label: '1000 bản ghi' },
];

const MOCK_UNMATCHED_ITEMS = [
  { id: 'unmatch-1', record: 'HT-9901', sourceName: 'Hộ tịch', maxScore: 42, reason: 'Không tìm thấy bản ghi tương đồng vượt ngưỡng 75%', defaultAction: '' },
  { id: 'unmatch-2', record: 'CC-8820', sourceName: 'CCCD', maxScore: 35, reason: 'Số định danh và thông tin cá nhân khác biệt hoàn toàn', defaultAction: '' },
  { id: 'unmatch-3', record: 'HT-9945', sourceName: 'Hộ tịch', maxScore: 48, reason: 'Trùng ngày sinh nhưng thông tin tên không trùng khớp', defaultAction: '' },
  { id: 'unmatch-4', record: 'CC-9102', sourceName: 'CCCD', maxScore: 28, reason: 'Bản ghi thiếu thông tin định danh tối thiểu', defaultAction: '' },
  { id: 'unmatch-5', record: 'HT-9988', sourceName: 'Hộ tịch', maxScore: 50, reason: 'Điểm so khớp thấp hơn ngưỡng rà soát 75%', defaultAction: '' },
];

const WIZARD_SOURCE_OPTIONS = ['Hộ tịch', 'CCCD', 'ĐKKD', 'LLTP', 'Bổ trợ tư pháp'];

// Ánh xạ tên nguồn đã đăng ký ở Bước 1 (wizardData.sources) sang id cơ sở dữ liệu DLDC tương ứng
const SOURCE_NAME_TO_DB_ID: Record<string, string> = {
  'Hộ tịch': 'hotich',
  'CCCD': 'cccd',
  'ĐKKD': 'dkkd',
  'LLTP': 'lltp',
  'Bổ trợ tư pháp': 'btdp',
};

const SOURCE_KIND_LABELS: Record<SourceKind, string> = {
  table: 'Bảng',
  view: 'View',
  query: 'Truy vấn',
};

const SOURCE_KIND_COLORS: Record<SourceKind, string> = {
  table: 'blue',
  view: 'purple',
  query: 'amber',
};

const SOURCE_GRAIN_COLORS: Record<SourceGrain, string> = {
  '1:1': 'slate',
  '1:n': 'emerald',
};

// Tên cột mock để ánh xạ nguồn → thuộc tính
const MOCK_SOURCE_COLUMNS: { name: string; dataType: FieldDataType }[] = [
  { name: 'HoVaTen',     dataType: 'string' },
  { name: 'FullName',    dataType: 'string' },
  { name: 'SoDinhDanh',  dataType: 'string' },
  { name: 'SoCCCD',      dataType: 'string' },
  { name: 'DOB',         dataType: 'date' },
  { name: 'NgaySinh',    dataType: 'date' },
  { name: 'GioiTinh',    dataType: 'string' },
  { name: 'DiaChi',      dataType: 'string' },
  { name: 'QueQuan',     dataType: 'string' },
  { name: 'NgayCap',     dataType: 'date' },
  { name: 'NgayCapNhat', dataType: 'date' },
  { name: 'UpdatedAt',   dataType: 'date' },
];

// Nhóm kiểu dữ liệu tương thích — dùng để phát hiện lệch kiểu khi ánh xạ cột nguồn → thuộc tính
const DATA_TYPE_GROUP: Record<FieldDataType, string> = {
  string: 'text', text: 'text', email: 'text', phone: 'text', url: 'text',
  number: 'number',
  date: 'date', datetime: 'date',
  boolean: 'boolean',
};

const GROUP_RULE_LABELS: Record<GroupRuleType, string> = {
  latest: 'Bản ghi mới nhất',
  most_frequent: 'Xuất hiện nhiều nhất',
  max: 'Lớn nhất',
  min: 'Nhỏ nhất',
};

const REL_TYPE_LABELS: Record<WizardRelType, string> = {
  '1-1': '1 - 1 (Một - Một)',
  '1-n': '1 - n (Một - Nhiều)',
  'n-1': 'n - 1 (Nhiều - Một)',
  'n-n': 'n - n (Nhiều - Nhiều)',
};

const REL_TYPE_COLORS: Record<WizardRelType, string> = {
  '1-1': 'emerald',
  '1-n': 'blue',
  'n-1': 'indigo',
  'n-n': 'purple',
};

const BASE_TARGET_FIELDS = [
  { name: 'id',     label: 'ID định danh' },
  { name: 'code',   label: 'Mã định danh' },
  { name: 'name',   label: 'Tên/Tiêu đề' },
  { name: 'status', label: 'Trạng thái' },
];

const EMPTY_REL_FORM: RelFormData = {
  targetEntityId: '', targetEntityName: '', type: 'n-1',
  sourceKey: '', targetKey: '', displayField: '', mappingTable: '',
};

const steps = [
  { number: 1, title: 'Khởi tạo dữ liệu chủ', description: 'Thông tin cơ bản và nguồn dữ liệu' },
  { number: 2, title: 'Tạo thuộc tính', description: 'Định nghĩa các trường dữ liệu' },
  { number: 3, title: 'Quy tắc hợp nhất', description: 'Thiết lập quy tắc merge dữ liệu' },
  { number: 4, title: 'Thiết lập quan hệ', description: 'Liên kết giữa các thực thể' },
  { number: 5, title: 'Định danh duy nhất', description: 'Thiết lập quy tắc mã định danh' },
  { number: 6, title: 'Quy tắc đánh phiên bản', description: 'Điều kiện và định dạng tạo phiên bản mới' },
  { number: 7, title: 'Phê duyệt', description: 'Xem lại và gửi phê duyệt' },
];

export function MasterDataWizard({ isOpen, onClose, onSubmit, onSaveDraft, initialData, initialDldcFieldRows, initialStep, isEditMode }: MasterDataWizardProps) {
  // Chỉnh sửa thực thể đã có không cho đổi Ngày hiệu lực
  const isEditingEntity = isEditMode ?? Boolean(initialData);
  const [currentStep, setCurrentStep] = useState(initialStep || 1);
  const [wizardData, setWizardData] = useState<WizardData>({
    code: '',
    name: '',
    dataType: 'individual',
    managingAgency: '',
    scope: 'national',
    description: '',
    systemName: '',
    effectiveDate: '',
    lifecycleStatus: 'draft',
    // Thêm mới bắt đầu chưa có nguồn — bảng grid chỉ hiện sau khi thêm nguồn (PM yêu cầu)
    sources: [],
    dataSource: 'dldc',
    attributes: [],
    mergeRules: [],
    mapping: {},
    groupRules: {},
    relationships: [],
    approvalReviewer: '',
    approvalNotes: '',
    ...initialData,
  });

  const [currentAttribute, setCurrentAttribute] = useState<AttributeForm>({
    fieldName: '',
    displayName: '',
    dataType: 'string',
    required: false,
    isKey: false,
    defaultValue: ''
  });

  // Step 5 state — Thiết lập quan hệ
  const [relFormOpen, setRelFormOpen] = useState(false);
  const [editingRelId, setEditingRelId] = useState<string | null>(null);
  const [relFormData, setRelFormData] = useState<RelFormData>(EMPTY_REL_FORM);
  const [relFormError, setRelFormError] = useState('');
  const [relSearch, setRelSearch] = useState('');
  // Từ khóa tìm kiếm quan hệ chỉ áp dụng khi bấm Tìm kiếm hoặc Enter
  const [relSearchApplied, setRelSearchApplied] = useState('');

  // Step 2 state — Định danh duy nhất
  const [identifierConfig, setIdentifierConfig] = useState<IdentifierConfig>({
    prefix: '',
    separator: '-',
    digits: 6,
    startFrom: 1,
    increment: 1,
    suffix: '',
    checkDuplicate: true,
  });

  // Step 6 state — Quy tắc đánh phiên bản
  const [versioningConfig, setVersioningConfig] = useState<VersioningConfig>({
    versionFormat: 'increment',
    customPrefix: 'VER',
    startFrom: 'V1',
    semverPrefix: 'Ver',
    semverMajor: '1',
    semverMinor: '0',
    semverPatch: '0',
    semverIncrementPart: 'patch',
  });

  // Step 3 (old step 2) state — Matching/Extraction/Merge
  const [matchingRules, setMatchingRules] = useState<MatchingRule[]>([]);
  const [extractionRules, setExtractionRules] = useState<ExtractionRule[]>([]);
  const [mergeConfig, setMergeConfig] = useState<MergeConfig>({
    keepSourceRef: true,
    mergeTrigger: 'approval',
    minMatchScore: 80,
    autoThreshold: 90,
    reviewThreshold: 75,
    hardBlockFields: [],
  });

  // Step 4 — sub-tabs + test simulation + hard-block input
  const [mergeSubTab, setMergeSubTab] = useState<MergeSubTab>('match');
  // Màn hình gợi ý ban đầu ở tab "So khớp" — ẩn khi đã có quy tắc hoặc người dùng bấm "Thêm mới quy tắc"
  const [matchRulesStarted, setMatchRulesStarted] = useState(false);
  const [hardBlockInput, setHardBlockInput] = useState('');
  const [testSample, setTestSample] = useState('');
  const [testRun, setTestRun] = useState(false);
  const [unmatchedPage, setUnmatchedPage] = useState<number>(1);

  // Step 1 — đăng ký nguồn dữ liệu (form thêm nguồn inline)
  const [sourceFormOpen, setSourceFormOpen] = useState(false);
  const [sourceForm, setSourceForm] = useState<{ name: string; table: string; grain: SourceGrain; grainKey: string }>({
    name: WIZARD_SOURCE_OPTIONS[0], table: '', grain: '1:n', grainKey: '',
  });
  // Nguồn đang sửa (null = đang thêm mới)
  const [editingSourceId, setEditingSourceId] = useState<string | null>(null);
  const [sourceGroupRules, setSourceGroupRules] = useState<SourceGroupRule[]>([]);
  const [sourceGroupRuleDraft, setSourceGroupRuleDraft] = useState<{ fieldName: string; ruleType: GroupRuleType }>({
    fieldName: '', ruleType: 'latest',
  });

  // Union các trường từ mọi bảng thuộc kho DLDC ánh xạ với nguồn đang đăng ký
  const getSourceFieldOptions = (sourceName: string, tableId = '') => {
    const dbId = SOURCE_NAME_TO_DB_ID[sourceName] || '';
    // Đã chọn bảng nguồn → chỉ lấy trường của bảng đó
    const tables = tableId ? (DLDC_TABLES[dbId] || []).filter(t => t.id === tableId) : (DLDC_TABLES[dbId] || []);
    const seen = new Set<string>();
    const options: { fieldName: string; displayName: string; dataType: FieldDataType }[] = [];
    tables.forEach(t => {
      (DLDC_FIELDS[t.id] || []).forEach(f => {
        if (!seen.has(f.fieldName)) {
          seen.add(f.fieldName);
          options.push(f);
        }
      });
    });
    return options;
  };

  const handleAddSourceGroupRule = () => {
    if (!sourceGroupRuleDraft.fieldName) return;
    setSourceGroupRules(prev => {
      const withoutDup = prev.filter(r => r.fieldName !== sourceGroupRuleDraft.fieldName);
      return [...withoutDup, { ...sourceGroupRuleDraft }];
    });
    setSourceGroupRuleDraft({ fieldName: '', ruleType: 'latest' });
  };

  const handleRemoveSourceGroupRule = (fieldName: string) => {
    setSourceGroupRules(prev => prev.filter(r => r.fieldName !== fieldName));
  };

  const resetSourceForm = () => {
    setSourceForm({ name: WIZARD_SOURCE_OPTIONS[0], table: '', grain: '1:n', grainKey: '' });
    setSourceGroupRules([]);
    setSourceGroupRuleDraft({ fieldName: '', ruleType: 'latest' });
    setEditingSourceId(null);
    setSourceFormOpen(false);
  };

  const handleAddSource = () => {
    if (!sourceForm.name) return;
    if (!sourceForm.table) {
      toast.error('Vui lòng chọn bảng nguồn');
      return;
    }
    const fields = {
      name: sourceForm.name,
      table: sourceForm.table,
      grain: sourceForm.grain,
      grainKey: sourceForm.grainKey || undefined,
      groupRules: sourceGroupRules.length > 0 ? sourceGroupRules : undefined,
    };
    if (editingSourceId) {
      // Sửa: giữ nguyên id để không mất ánh xạ ở các bước sau
      setWizardData(prev => ({ ...prev, sources: prev.sources.map(s => s.id === editingSourceId ? { ...s, ...fields } : s) }));
      toast.success('Cập nhật nguồn dữ liệu thành công');
    } else {
      const newSource: WizardSource = { id: `src-${Date.now()}`, kind: 'table', ...fields };
      setWizardData(prev => ({ ...prev, sources: [...prev.sources, newSource] }));
      toast.success('Thêm nguồn dữ liệu thành công');
    }
    resetSourceForm();
  };

  const handleEditSource = (src: WizardSource) => {
    setEditingSourceId(src.id);
    setSourceForm({ name: src.name, table: src.table || '', grain: src.grain, grainKey: src.grainKey || '' });
    setSourceGroupRules(src.groupRules || []);
    setSourceGroupRuleDraft({ fieldName: '', ruleType: 'latest' });
    setSourceFormOpen(true);
  };

  const handleRemoveSource = (sourceId: string) => {
    setWizardData(prev => {
      // dọn mapping & groupRules tham chiếu tới nguồn bị xóa
      const nextMapping: Record<string, Record<string, string>> = {};
      Object.entries(prev.mapping).forEach(([attrKey, srcMap]) => {
        const { [sourceId]: _removed, ...rest } = srcMap;
        nextMapping[attrKey] = rest;
      });
      const { [sourceId]: _rmGroup, ...nextGroupRules } = prev.groupRules;
      return { ...prev, sources: prev.sources.filter(s => s.id !== sourceId), mapping: nextMapping, groupRules: nextGroupRules };
    });
  };

  const handleMappingChange = (attrKey: string, sourceId: string, column: string) => {
    setWizardData(prev => ({
      ...prev,
      mapping: {
        ...prev.mapping,
        [attrKey]: { ...(prev.mapping[attrKey] || {}), [sourceId]: column },
      },
    }));
  };

  // Kiểm tra lệch nhóm kiểu dữ liệu giữa cột nguồn đã chọn và thuộc tính đích
  const isMappingMismatch = (targetType: FieldDataType, sourceColumn: string) => {
    if (!sourceColumn) return false;
    const sourceType = MOCK_SOURCE_COLUMNS.find(c => c.name === sourceColumn)?.dataType;
    if (!sourceType) return false;
    return DATA_TYPE_GROUP[sourceType] !== DATA_TYPE_GROUP[targetType];
  };

  // DLDC step 2 state — mọi nguồn đã đăng ký ở Bước 1 đều tự động được gộp trường,
  // các chip nguồn chỉ hiển thị thông tin, không cho chọn/bỏ chọn nữa.
  const [dldcFieldRows, setDldcFieldRows] = useState<DldcFieldRow[]>(initialDldcFieldRows || []);

  const handleToggleAllDldcShared = () => {
    setDldcFieldRows(prev => {
      const allShared = prev.length > 0 && prev.every(r => r.shared);
      return prev.map(r => ({ ...r, shared: !allShared }));
    });
  };

  const dldcSelectedDbIds = Array.from(new Set(
    wizardData.sources.map(s => SOURCE_NAME_TO_DB_ID[s.name]).filter((id): id is string => !!id)
  ));

  const handleDldcFieldToggle = (rowId: string, field: 'shared' | 'isPK') => {
    setDldcFieldRows(prev => prev.map(r => r.id === rowId ? { ...r, [field]: !r[field] } : r));
  };

  const handleDldcRemoveRow = (rowId: string) => {
    setDldcFieldRows(prev => prev.filter(r => r.id !== rowId));
  };

  // Thêm một dòng trống — người dùng chọn Nguồn (Table) và Trường gốc ngay trong bảng
  const handleAddDldcFieldRow = () => {
    setDldcFieldRows(prev => [...prev, {
      id: `fr-${Date.now()}`,
      shared: true,
      isPK: false,
      tableId: '',
      sourceJoinId: null,
      columnName: '',
      apiFieldName: '',
      displayName: '',
      dataType: 'string',
    }]);
  };

  // ── Step 5 handlers ──
  const handleOpenAddRel = () => {
    setEditingRelId(null);
    setRelFormData(EMPTY_REL_FORM);
    setRelFormError('');
    setRelFormOpen(true);
  };

  const handleOpenEditRel = (rel: WizardRelationship) => {
    setEditingRelId(rel.id);
    setRelFormData({
      targetEntityId: rel.targetEntityId,
      targetEntityName: rel.targetEntityName,
      type: rel.type,
      sourceKey: rel.sourceKey,
      targetKey: rel.targetKey,
      displayField: rel.displayField || '',
      mappingTable: rel.mappingTable || '',
    });
    setRelFormError('');
    setRelFormOpen(true);
  };

  const handleCancelRel = () => {
    setRelFormOpen(false);
    setRelFormError('');
  };

  const handleSaveRel = () => {
    setRelFormError('');
    if (!relFormData.targetEntityId) { setRelFormError('Vui lòng chọn thực thể đích.'); return; }
    if (relFormData.type === 'n-n') {
      if (!relFormData.mappingTable || !relFormData.sourceKey || !relFormData.targetKey) {
        setRelFormError('Quan hệ n-n cần có đầy đủ: bảng liên kết, khóa ngoại nguồn và đích.'); return;
      }
    } else {
      if (!relFormData.sourceKey || !relFormData.targetKey) {
        setRelFormError('Cần khai báo đầy đủ khóa nguồn và khóa đích.'); return;
      }
    }
    const hasDuplicate = wizardData.relationships.some(r =>
      r.id !== (editingRelId || '') &&
      r.targetEntityId === relFormData.targetEntityId &&
      r.type === relFormData.type
    );
    if (hasDuplicate) { setRelFormError('Đã tồn tại quan hệ cùng loại với thực thể này.'); return; }

    const targetEntity = WIZARD_MOCK_ENTITIES.find(e => e.id === relFormData.targetEntityId);
    if (editingRelId) {
      setWizardData({ ...wizardData, relationships: wizardData.relationships.map(r => r.id === editingRelId ? {
        ...r, ...relFormData, targetEntityName: targetEntity?.name || relFormData.targetEntityName,
      } : r) });
    } else {
      const newRel: WizardRelationship = {
        id: `wr-${Date.now()}`,
        targetEntityId: relFormData.targetEntityId,
        targetEntityName: targetEntity?.name || '',
        type: relFormData.type,
        sourceKey: relFormData.sourceKey,
        targetKey: relFormData.targetKey,
        displayField: relFormData.displayField || undefined,
        mappingTable: relFormData.mappingTable || undefined,
      };
      setWizardData({ ...wizardData, relationships: [...wizardData.relationships, newRel] });
    }
    setRelFormOpen(false);
  };

  const handleDeleteRel = (relId: string) => {
    setWizardData({ ...wizardData, relationships: wizardData.relationships.filter(r => r.id !== relId) });
  };

  if (!isOpen) return null;

  // Step 1 — kiểm tra trùng Mã / Tên
  const codeTrim = (wizardData.code || '').trim();
  const nameTrim = (wizardData.name || '').trim();
  const codeDuplicate = codeTrim.length > 0 && WIZARD_MOCK_ENTITIES.some(e => e.code.toLowerCase() === codeTrim.toLowerCase());
  const nameDuplicate = nameTrim.length > 0 && WIZARD_MOCK_ENTITIES.some(e => e.name.toLowerCase() === nameTrim.toLowerCase());

  // Step 4 — tổng trọng số so khớp
  const totalWeight = matchingRules.reduce((sum, r) => sum + (Number(r.weight) || 0), 0);

  // Nguồn đã đăng ký ở Bước 1
  const registeredSources = wizardData.sources;
  // Chỉ hiện tab "Hợp nhất giá trị" khi có ≥2 nguồn
  const showSurvivorTab = registeredSources.length >= 2;
  // Nếu tab survivor bị ẩn nhưng đang chọn → tự chuyển về 'match'
  if (!showSurvivorTab && mergeSubTab === 'survivor') {
    setMergeSubTab('match');
  }

  const handleAddHardBlockField = (field: string) => {
    const val = field.trim();
    if (!val) return;
    if (mergeConfig.hardBlockFields.includes(val)) return;
    setMergeConfig(prev => ({ ...prev, hardBlockFields: [...prev.hardBlockFields, val] }));
  };

  const handleRemoveHardBlockField = (field: string) => {
    setMergeConfig(prev => ({ ...prev, hardBlockFields: prev.hardBlockFields.filter(f => f !== field) }));
  };

  const availableFields = wizardData.dataSource === 'dldc'
    ? dldcFieldRows.filter(r => r.shared && r.columnName).map(r => ({ fieldName: r.apiFieldName || r.columnName, displayName: r.displayName, dataType: r.dataType }))
    : wizardData.attributes.map(a => ({ fieldName: a.fieldName, displayName: a.displayName, dataType: a.dataType }));

  const hasMappingMismatch = availableFields.some(attr =>
    registeredSources.some(src => isMappingMismatch(attr.dataType, wizardData.mapping[attr.fieldName]?.[src.id] || ''))
  );

  // Bước 4 — lọc quan hệ theo từ khóa đã áp dụng (bấm Tìm kiếm / Enter)
  const relKeyword = normalizeSearch(relSearchApplied);
  const relMatchesSearch = (r: WizardRelationship) =>
    !relKeyword || [r.targetEntityName, r.sourceKey, r.targetKey].some(v => normalizeSearch(v).includes(relKeyword));

  const sourceEntityFields = [
    ...(wizardData.dataSource === 'dldc'
      ? dldcFieldRows.filter(r => r.shared).map(r => ({ name: r.apiFieldName || r.columnName, label: r.displayName }))
      : wizardData.attributes.map(a => ({ name: a.fieldName, label: a.displayName }))),
    ...(identifierConfig.prefix ? [{ name: 'identifier_code', label: 'Mã định danh' }] : []),
  ];

  const handleNext = () => {
    // Validation for each step
    if (currentStep === 1) {
      if (!wizardData.code?.trim() || !wizardData.name || !wizardData.managingAgency) {
        toast.error('Vui lòng điền đầy đủ thông tin bắt buộc ở bước 1');
        return;
      }
      if (codeDuplicate) {
        toast.error('Mã thực thể đã tồn tại, vui lòng nhập giá trị khác.');
        return;
      }
      if (nameDuplicate) {
        toast.error('Tên dữ liệu chủ đã tồn tại, vui lòng nhập giá trị khác.');
        return;
      }
    }
    if (currentStep === 2) {
      if (wizardData.dataSource === 'dldc') {
        if (dldcFieldRows.filter(r => r.shared).length === 0) {
          toast.error('Vui lòng chọn nguồn dữ liệu và ít nhất 1 trường chia sẻ');
          return;
        }
      } else {
        if (wizardData.attributes.length === 0) {
          toast.error('Vui lòng thêm ít nhất 1 thuộc tính');
          return;
        }
      }
      // Auto-populate extraction rules from available fields
      if (extractionRules.length === 0 && availableFields.length > 0) {
        setExtractionRules(availableFields.map((f, i) => ({
          id: `er-${i}`,
          fieldName: f.fieldName,
          primarySource: wizardData.sources[0]?.id || '',
          priorityOrder: wizardData.sources.map(s => s.id),
          conflictStrategy: 'source' as ConflictStrategy,
          nullHandling: 'next' as NullHandling,
          onEmpty: 'allow' as OnEmpty,
        })));
      }
    }

    if (currentStep === 3) {
      if (matchingRules.length > 0 && totalWeight !== 100) {
        toast.error(`Tổng trọng số các quy tắc so khớp phải bằng 100%. Hiện tại: ${totalWeight}%.`);
        return;
      }
      if (mergeConfig.autoThreshold <= mergeConfig.reviewThreshold) {
        toast.error('Ngưỡng tự động gộp phải lớn hơn ngưỡng cần rà soát.');
        return;
      }
    }

    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Chế độ DLDC không đồng bộ dldcFieldRows vào wizardData.attributes theo thời gian thực
  // (khác chế độ thủ công) — gộp lại ở đây để onSubmit/onSaveDraft luôn trả về đủ danh sách thuộc tính.
  const buildFinalWizardData = (): WizardData => wizardData.dataSource === 'dldc'
    ? {
        ...wizardData,
        attributes: dldcFieldRows.filter(r => r.shared).map(r => ({
          fieldName: r.apiFieldName || r.columnName,
          displayName: r.displayName,
          dataType: r.dataType,
          required: false,
          isKey: r.isPK,
          defaultValue: undefined,
        })),
      }
    : wizardData;

  const handleSubmitWizard = () => {
    if (!wizardData.approvalNotes) {
      toast.error('Vui lòng nhập ghi chú phê duyệt');
      return;
    }
    onSubmit(buildFinalWizardData());
    onClose();
  };

  const handleSaveDraft = () => {
    if (!wizardData.code || !wizardData.name) {
      toast.error('Vui lòng nhập ít nhất Mã thực thể và Tên dữ liệu chủ trước khi lưu nháp');
      return;
    }
    const draftData: WizardData = { ...buildFinalWizardData(), lifecycleStatus: 'draft' };
    if (onSaveDraft) {
      onSaveDraft(draftData);
    } else {
      onSubmit(draftData);
    }
    onClose();
  };

  const handleAddAttribute = () => {
    if (!currentAttribute.fieldName || !currentAttribute.displayName) {
      toast.error('Vui lòng điền tên trường và tên hiển thị');
      return;
    }

    // Check duplicate
    if (wizardData.attributes.some(a => a.fieldName === currentAttribute.fieldName)) {
      toast.error('Tên trường đã tồn tại');
      return;
    }

    setWizardData({
      ...wizardData,
      attributes: [...wizardData.attributes, currentAttribute]
    });

    // Reset form
    setCurrentAttribute({
      fieldName: '',
      displayName: '',
      dataType: 'string',
      required: false,
      isKey: false,
      defaultValue: ''
    });
  };

  const handleDeleteAttribute = (index: number) => {
    setWizardData({
      ...wizardData,
      attributes: wizardData.attributes.filter((_, i) => i !== index)
    });
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] shrink-0">
          <div>
            <h2 className="text-[16px] font-semibold text-[#020817]">Tạo mới dữ liệu chủ</h2>
            <p className="text-[13px] text-[#64748B] mt-0.5">Quy trình 7 bước</p>
          </div>
          <button type="button" onClick={onClose} className={BTN_GHOST_ICON} title="Đóng" aria-label="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper — #155DFC: bước hiện tại/đã qua, #E2E8F0: bước chưa tới */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] bg-white shrink-0">
          <ol className="flex items-start">
            {steps.map((step, index) => {
              const isActive = currentStep === step.number;
              const isDone = currentStep > step.number;
              return (
                <li key={step.number} className="relative flex-1 flex flex-col items-center" aria-current={isActive ? 'step' : undefined}>
                  {index < steps.length - 1 && (
                    <div className={`absolute top-4 left-1/2 w-full h-0.5 transition-colors ${isDone ? 'bg-[#155DFC]' : 'bg-[#E2E8F0]'}`} />
                  )}
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 text-[13px] font-medium transition-colors shrink-0 ${isActive
                      ? 'border-[#155DFC] bg-[#155DFC] text-white'
                      : isDone
                        ? 'border-[#155DFC] bg-white text-[#155DFC]'
                        : 'border-[#E2E8F0] bg-white text-[#64748B]'
                      }`}
                  >
                    {isDone ? <Check className="w-4 h-4" /> : step.number}
                  </div>
                  <p className={`text-[13px] mt-2 px-1 text-center leading-[18px] ${isActive ? 'font-medium text-[#155DFC]' : isDone ? 'text-[#020817]' : 'text-[#64748B]'}`}>
                    {step.title}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
          {/* Step 1: Khởi tạo dữ liệu chủ */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className={INFO_BANNER}>
                <h3 className="text-[13px] font-medium text-[#020817] mb-1">Bước 1: Khởi tạo dữ liệu chủ</h3>
                <p className="text-[13px] text-[#020817]">
                  Nhập thông tin cơ bản và cấu hình nguồn dữ liệu cho thực thể dữ liệu chủ
                </p>
              </div>

              {/* Mã thực thể */}
              <div>
                <label className={LABEL_CLS}>
                  Mã thực thể <span className={REQUIRED_MARK}>*</span>
                </label>
                <input
                  type="text"
                  value={wizardData.code || ''}
                  onChange={(e) => setWizardData({ ...wizardData, code: e.target.value })}
                  placeholder="VD: MD-CITIZEN-001"
                  className={INPUT_CLS}
                />
                {codeTrim.length > 0 && (
                  codeDuplicate ? (
                    <p className="flex items-center gap-1 mt-1 text-[13px] text-[#DC2626]">
                      <AlertCircle className="w-3.5 h-3.5" /> Đã tồn tại, vui lòng nhập giá trị khác
                    </p>
                  ) : (
                    <p className="flex items-center gap-1 mt-1 text-[13px] text-[#16A34A]">
                      <Check className="w-3.5 h-3.5" /> Hợp lệ, chưa trùng
                    </p>
                  )
                )}
              </div>

              {/* Tên dữ liệu chủ */}
              <div>
                <label className={LABEL_CLS}>
                  Tên dữ liệu chủ <span className={REQUIRED_MARK}>*</span>
                </label>
                <input
                  type="text"
                  value={wizardData.name}
                  onChange={(e) => setWizardData({ ...wizardData, name: e.target.value })}
                  placeholder="VD: Bộ dữ liệu chủ Công dân"
                  className={INPUT_CLS}
                />
                {nameTrim.length > 0 && (
                  nameDuplicate ? (
                    <p className="flex items-center gap-1 mt-1 text-[13px] text-[#DC2626]">
                      <AlertCircle className="w-3.5 h-3.5" /> Đã tồn tại, vui lòng nhập giá trị khác
                    </p>
                  ) : (
                    <p className="flex items-center gap-1 mt-1 text-[13px] text-[#16A34A]">
                      <Check className="w-3.5 h-3.5" /> Hợp lệ, chưa trùng
                    </p>
                  )
                )}
              </div>

              {/* Loại thực thể + Phạm vi */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLS}>
                    Loại thực thể <span className={REQUIRED_MARK}>*</span>
                  </label>
                  <select
                    value={wizardData.dataType}
                    onChange={(e) => setWizardData({ ...wizardData, dataType: e.target.value as DataType })}
                    className={SELECT_CLS}
                  >
                    <option value="individual">Thực thể Cá nhân</option>
                    <option value="organization">Thực thể Tổ chức</option>
                    <option value="legal">Thực thể Văn bản/Sự kiện pháp lý</option>
                    <option value="asset">Thực thể Tài sản</option>
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLS}>
                    Phạm vi sử dụng <span className={REQUIRED_MARK}>*</span>
                  </label>
                  <select
                    value={wizardData.scope}
                    onChange={(e) => setWizardData({ ...wizardData, scope: e.target.value as ScopeType })}
                    className={SELECT_CLS}
                  >
                    <option value="national">Cấp quốc gia</option>
                    <option value="ministry">Cấp bộ</option>
                    <option value="provincial">Cấp tỉnh/thành</option>
                    <option value="internal">Nội bộ</option>
                  </select>
                </div>
              </div>

              {/* Đơn vị chủ quản */}
              <div>
                <label className={LABEL_CLS}>
                  Đơn vị chủ quản <span className={REQUIRED_MARK}>*</span>
                </label>
                <select
                  value={wizardData.managingAgency}
                  onChange={(e) => setWizardData({ ...wizardData, managingAgency: e.target.value })}
                  className={SELECT_CLS}
                >
                  <option value="">-- Chọn đơn vị chủ quản --</option>
                  {MANAGING_UNITS.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              {/* Mô tả đối tượng */}
              <div>
                <label className={LABEL_CLS}>Mô tả đối tượng</label>
                <textarea
                  value={wizardData.description}
                  onChange={(e) => setWizardData({ ...wizardData, description: e.target.value })}
                  placeholder="Mô tả tóm tắt về đối tượng dữ liệu chủ này..."
                  rows={3}
                  className={`${TEXTAREA_CLS} resize-none`}
                />
              </div>

              {/* Tên cơ sở dữ liệu / Hệ thống */}
              <div>
                <label className={LABEL_CLS}>
                  Tên cơ sở dữ liệu / Hệ thống
                </label>
                <select
                  value={wizardData.systemName || ''}
                  onChange={(e) => setWizardData({ ...wizardData, systemName: e.target.value })}
                  className={SELECT_CLS}
                >
                  <option value="">-- Chọn hệ thống --</option>
                  {SYSTEM_OPTIONS.map(sys => (
                    <option key={sys} value={sys}>{sys}</option>
                  ))}
                </select>
              </div>

              {/* Ngày hiệu lực — không cho đổi khi đang chỉnh sửa thực thể đã có */}
              <div>
                <label className={LABEL_CLS}>
                  Ngày hiệu lực
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={wizardData.effectiveDate || ''}
                    onChange={(e) => setWizardData({ ...wizardData, effectiveDate: e.target.value })}
                    disabled={isEditingEntity}
                    className={INPUT_CLS}
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span tabIndex={0} aria-label="Thông tin ngày hiệu lực" className="inline-flex items-center shrink-0 rounded outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-help">
                        <Info className="w-4 h-4 text-[#94A3B8]" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="end" sideOffset={4} className={`${TOOLTIP_CLS} w-72`}>
                      Thời gian hiệu lực sẽ được gán với từng bản ghi trong thực thể dữ liệu chủ, hiệu lực của bản ghi có thể chỉnh sửa khi thực hiện rà soát bản ghi.
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Đăng ký nguồn dữ liệu (bảng grid + form thêm/sửa nguồn) */}
              <div className="pt-4 border-t border-[#E2E8F0]">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-[14px] font-medium text-[#020817]">Đăng ký nguồn dữ liệu</h4>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Các nguồn đăng ký ở đây sẽ được dùng để ánh xạ ở Bước 2</p>
                  </div>
                  {!sourceFormOpen && (
                    <button
                      type="button"
                      onClick={() => setSourceFormOpen(true)}
                      className={BTN_OUTLINE}
                    >
                      <Plus className="w-3.5 h-3.5" /> Thêm nguồn
                    </button>
                  )}
                </div>

                {/* Form thêm nguồn inline */}
                {sourceFormOpen && (
                  <div className="mt-3 border border-[#E2E8F0] rounded-2xl bg-[#F8FAFC] p-4">
                    <div>
                      <label className={LABEL_CLS}>Tên nguồn</label>
                      <select
                        value={sourceForm.name}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => { setSourceForm(prev => ({ ...prev, name: e.target.value, table: '', grainKey: '' })); setSourceGroupRules([]); }}
                        className={SELECT_CLS}
                      >
                        {WIZARD_SOURCE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>

                    <div className="mt-3">
                      <label className={LABEL_CLS}>Bảng nguồn <span className={REQUIRED_MARK}>*</span></label>
                      <select
                        aria-label="Bảng nguồn"
                        value={sourceForm.table}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => { setSourceForm(prev => ({ ...prev, table: e.target.value, grainKey: '' })); setSourceGroupRules([]); }}
                        className={SELECT_CLS}
                      >
                        <option value="">-- Chọn bảng --</option>
                        {(DLDC_TABLES[SOURCE_NAME_TO_DB_ID[sourceForm.name] || ''] || []).map(t => (
                          <option key={t.id} value={t.id}>{t.displayName} ({t.id})</option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-3">
                      <label className={LABEL_CLS}>Khóa làm mịn</label>
                      <select
                        value={sourceForm.grainKey}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setSourceForm(prev => ({ ...prev, grainKey: e.target.value }))}
                        className={SELECT_CLS}
                      >
                        <option value="">-- Chọn trường --</option>
                        {getSourceFieldOptions(sourceForm.name, sourceForm.table).map(f => (
                          <option key={f.fieldName} value={f.fieldName}>{f.displayName} ({f.fieldName})</option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
                      <label className={LABEL_CLS}>Quy tắc gom nguồn</label>
                      {sourceGroupRules.length > 0 && (
                        <div className="space-y-1.5 mb-2">
                          {sourceGroupRules.map(r => (
                            <div key={r.fieldName} className="flex items-center justify-between px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-[13px]">
                              <span className="text-[#020817]">
                                <span className="font-medium">{r.fieldName}</span>
                                <span className="text-[#94A3B8] mx-1.5">—</span>
                                {GROUP_RULE_LABELS[r.ruleType]}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveSourceGroupRule(r.fieldName)}
                                className="text-[#94A3B8] hover:text-[#DC2626] rounded cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors"
                                title="Xóa quy tắc"
                                aria-label="Xóa quy tắc"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <label className="block text-[12px] text-[#64748B] mb-1">Thuộc tính</label>
                          <select
                            value={sourceGroupRuleDraft.fieldName}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setSourceGroupRuleDraft(prev => ({ ...prev, fieldName: e.target.value }))}
                            className={SELECT_CLS}
                          >
                            <option value="">-- Chọn trường --</option>
                            {getSourceFieldOptions(sourceForm.name, sourceForm.table).map(f => (
                              <option key={f.fieldName} value={f.fieldName}>{f.displayName} ({f.fieldName})</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-[12px] text-[#64748B] mb-1">Rule gom</label>
                          <select
                            value={sourceGroupRuleDraft.ruleType}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setSourceGroupRuleDraft(prev => ({ ...prev, ruleType: e.target.value as GroupRuleType }))}
                            className={SELECT_CLS}
                          >
                            {(Object.entries(GROUP_RULE_LABELS) as [GroupRuleType, string][]).map(([val, label]) => (
                              <option key={val} value={val}>{label}</option>
                            ))}
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddSourceGroupRule}
                          disabled={!sourceGroupRuleDraft.fieldName}
                          className={BTN_OUTLINE}
                        >
                          <Plus className="w-3.5 h-3.5" /> Thêm
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        type="button"
                        onClick={resetSourceForm}
                        className={BTN_OUTLINE}
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        onClick={handleAddSource}
                        className={BTN_PRIMARY}
                      >
                        {editingSourceId ? <><Check className="w-3.5 h-3.5" /> Cập nhật</> : <><Plus className="w-3.5 h-3.5" /> Thêm vào danh sách</>}
                      </button>
                    </div>
                  </div>
                )}

                {/* Danh sách nguồn đã đăng ký — bảng grid nằm dưới form thêm nguồn; chỉ hiện khi đã có nguồn (PM yêu cầu) */}
                {wizardData.sources.length > 0 && (
                <div className="mt-3 bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead className="bg-[#F8FAFC]">
                        <tr className="h-[42px] border-b border-[#E2E8F0]">
                          <th className={`${TH_CLS} text-left`}>Tên nguồn</th>
                          <th className={`${TH_CLS} text-left`}>Bảng nguồn</th>
                          <th className={`${TH_CLS} text-left`}>Khóa làm mịn</th>
                          <th className={`${TH_CLS} text-right`}>Quy tắc gom</th>
                          <th className={`${TH_CLS} text-center w-24`}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wizardData.sources.map(src => (
                            <tr key={src.id} className={`${TR_CLS} last:border-b-0`}>
                              <td className="px-3 py-1 text-[13px] text-black max-w-[240px]"><TruncatedText text={src.name} /></td>
                              <td className="px-3 py-1 text-[13px] text-black max-w-[240px]"><TruncatedText text={src.table || '-'} /></td>
                              <td className="px-3 py-1 text-[13px] text-black max-w-[200px]"><TruncatedText text={src.grainKey || '-'} /></td>
                              <td className="px-3 py-1 text-[13px] text-black text-right tabular-nums">{(src.groupRules || []).length}</td>
                              <td className="px-3 py-1 text-center">
                                <div className="inline-flex items-center justify-center gap-1">
                                  <RowIconAction label="Sửa" onClick={() => handleEditSource(src)}>
                                    <SquarePen className="w-4 h-4" />
                                  </RowIconAction>
                                  <RowIconAction label="Xóa" onClick={() => { if (editingSourceId === src.id) resetSourceForm(); handleRemoveSource(src.id); }}>
                                    <Trash2 className="w-4 h-4 text-[#DC2626]" />
                                  </RowIconAction>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                )}
              </div>

            </div>
          )}

          {/* Step 5: Định danh duy nhất */}
          {currentStep === 5 && (() => {
            const sep = identifierConfig.separator === 'none' ? '' : identifierConfig.separator;
            const paddedNum = String(identifierConfig.startFrom).padStart(identifierConfig.digits, '0');
            const previewCode = [
              identifierConfig.prefix,
              paddedNum,
              identifierConfig.suffix,
            ].filter(Boolean).join(sep);
            return (
              <div className="space-y-6">
                <div className={INFO_BANNER}>
                  <h3 className="text-[13px] font-medium text-[#020817] mb-1">Bước 5: Định danh duy nhất</h3>
                  <p className="text-[13px] text-[#020817]">
                    Thiết lập cấu trúc mã định danh toàn cục cho từng bản ghi của thực thể này
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  {/* Left — form */}
                  <div className="space-y-5">
                    <div className="border border-[#E2E8F0] rounded-2xl p-5 space-y-5 bg-white">
                      <h4 className="text-[14px] font-medium text-[#020817]">Cấu trúc mã định danh</h4>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={LABEL_CLS}>Tiền tố (Prefix)</label>
                          <input
                            type="text"
                            value={identifierConfig.prefix}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setIdentifierConfig(prev => ({ ...prev, prefix: e.target.value.toUpperCase() }))}
                            placeholder="VD: NDAN, ORG"
                            className={INPUT_CLS}
                          />
                        </div>
                        <div>
                          <label className={LABEL_CLS}>Hậu tố (Suffix)</label>
                          <input
                            type="text"
                            value={identifierConfig.suffix}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setIdentifierConfig(prev => ({ ...prev, suffix: e.target.value.toUpperCase() }))}
                            placeholder="Để trống nếu không dùng"
                            className={INPUT_CLS}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={LABEL_CLS}>Ký tự phân cách</label>
                          <select
                            value={identifierConfig.separator}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setIdentifierConfig(prev => ({ ...prev, separator: e.target.value as SeparatorType }))}
                            className={SELECT_CLS}
                          >
                            <option value="none">Không dùng</option>
                            <option value="-">Gạch ngang ( - )</option>
                            <option value=".">Dấu chấm ( . )</option>
                            <option value="/">Dấu gạch chéo ( / )</option>
                          </select>
                        </div>
                        <div>
                          <label className={LABEL_CLS}>Độ dài số thứ tự</label>
                          <input
                            type="number" min={1} max={12}
                            value={identifierConfig.digits}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setIdentifierConfig(prev => ({ ...prev, digits: Number(e.target.value) }))}
                            className={INPUT_CLS}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border border-[#E2E8F0] rounded-2xl p-5 space-y-5 bg-white">
                      <h4 className="text-[14px] font-medium text-[#020817]">Số tự tăng</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={LABEL_CLS}>Bắt đầu từ</label>
                          <input
                            type="number" min={0}
                            value={identifierConfig.startFrom}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setIdentifierConfig(prev => ({ ...prev, startFrom: Number(e.target.value) }))}
                            className={INPUT_CLS}
                          />
                        </div>
                        <div>
                          <label className={LABEL_CLS}>Bước tăng</label>
                          <input
                            type="number" min={1}
                            value={identifierConfig.increment}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setIdentifierConfig(prev => ({ ...prev, increment: Number(e.target.value) }))}
                            className={INPUT_CLS}
                          />
                        </div>
                      </div>
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer select-none border border-[#E2E8F0] rounded-2xl p-5 bg-white">
                      <input
                        type="checkbox"
                        checked={identifierConfig.checkDuplicate}
                        onChange={() => setIdentifierConfig(prev => ({ ...prev, checkDuplicate: !prev.checkDuplicate }))}
                        className="mt-0.5 rounded border-[#CBD5E1] text-blue-600 focus:ring-blue-600 cursor-pointer w-4 h-4 flex-shrink-0"
                      />
                      <div>
                        <p className="text-[13px] font-medium text-[#020817]">Kiểm tra trùng lặp khi tạo mới</p>
                        <p className="text-[13px] text-[#64748B] mt-1">Hệ thống từ chối tạo bản ghi nếu mã định danh đã tồn tại</p>
                      </div>
                    </label>
                  </div>

                  {/* Right — preview */}
                  <div className="space-y-5">
                    <div className="border border-[#BFDBFE] rounded-2xl p-5 bg-[#EAF3FF] space-y-5">
                      <h4 className="text-[14px] font-medium text-[#020817]">Mẫu mã định danh</h4>

                      <div className="bg-white border border-[#BFDBFE] rounded-lg px-6 py-7 text-center">
                        {previewCode ? (
                          <span className="text-[20px] font-semibold text-[#155DFC] leading-8">
                            {previewCode}
                          </span>
                        ) : (
                          <span className="text-[13px] text-[#64748B]">Nhập tiền tố để xem mẫu mã</span>
                        )}
                      </div>

                      <div className="space-y-3 text-[13px]">
                        <div className="flex justify-between items-center py-1.5 border-b border-[#E2E8F0]">
                          <span className="text-[#475569]">Mã thứ 1:</span>
                          <span className="font-medium text-[#020817]">
                            {[identifierConfig.prefix, String(identifierConfig.startFrom).padStart(identifierConfig.digits, '0'), identifierConfig.suffix].filter(Boolean).join(sep) || '—'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b border-[#E2E8F0]">
                          <span className="text-[#475569]">Mã thứ 2:</span>
                          <span className="font-medium text-[#020817]">
                            {[identifierConfig.prefix, String(identifierConfig.startFrom + identifierConfig.increment).padStart(identifierConfig.digits, '0'), identifierConfig.suffix].filter(Boolean).join(sep) || '—'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1.5">
                          <span className="text-[#475569]">Mã thứ 3:</span>
                          <span className="font-medium text-[#020817]">
                            {[identifierConfig.prefix, String(identifierConfig.startFrom + identifierConfig.increment * 2).padStart(identifierConfig.digits, '0'), identifierConfig.suffix].filter(Boolean).join(sep) || '—'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border border-[#E2E8F0] rounded-2xl p-5 bg-white space-y-3">
                      <h4 className="text-[14px] font-medium text-[#020817]">Tóm tắt cấu hình</h4>
                      <div className="space-y-2.5 text-[13px]">
                        <div className="flex justify-between items-center"><span className="text-[#64748B]">Tiền tố:</span><span className="font-medium text-[#020817]">{identifierConfig.prefix || '(không có)'}</span></div>
                        <div className="flex justify-between items-center"><span className="text-[#64748B]">Ký tự phân cách:</span><span className="font-medium text-[#020817]">{identifierConfig.separator === 'none' ? 'Không dùng' : `"${identifierConfig.separator}"`}</span></div>
                        <div className="flex justify-between items-center"><span className="text-[#64748B]">Độ dài số:</span><span className="font-medium text-[#020817]">{identifierConfig.digits} chữ số</span></div>
                        <div className="flex justify-between items-center"><span className="text-[#64748B]">Bắt đầu từ:</span><span className="font-medium text-[#020817]">{identifierConfig.startFrom}</span></div>
                        <div className="flex justify-between items-center"><span className="text-[#64748B]">Bước tăng:</span><span className="font-medium text-[#020817]">{identifierConfig.increment}</span></div>
                        <div className="flex justify-between items-center"><span className="text-[#64748B]">Kiểm tra trùng:</span><span className={`font-medium ${identifierConfig.checkDuplicate ? 'text-[#15803D]' : 'text-[#64748B]'}`}>{identifierConfig.checkDuplicate ? 'Bật' : 'Tắt'}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Step 2: Tạo thuộc tính */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className={INFO_BANNER}>
                <h3 className="text-[13px] font-medium text-[#020817] mb-1">Bước 2: Tạo thuộc tính</h3>
                <p className="text-[13px] text-[#020817]">
                  Định nghĩa các trường dữ liệu cho thực thể <strong>{wizardData.name || 'dữ liệu chủ'}</strong>
                </p>
              </div>

              {/* Chế độ định nghĩa thuộc tính */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[13px] font-medium text-[#475569]">Cách định nghĩa thuộc tính:</span>
                <div className="inline-flex rounded-lg border border-[#CBD5E1] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setWizardData({ ...wizardData, dataSource: 'dldc' })}
                    className={`h-10 px-4 text-[13px] font-medium transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 ${wizardData.dataSource === 'dldc' ? 'bg-[#EAF3FF] text-[#155DFC]' : 'bg-white text-[#334155] hover:bg-[#F8FAFC]'}`}
                  >
                    Chọn trường từ Kho DLDC
                  </button>
                  <button
                    type="button"
                    onClick={() => setWizardData({ ...wizardData, dataSource: 'manual' })}
                    className={`h-10 px-4 text-[13px] font-medium border-l border-[#CBD5E1] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 ${wizardData.dataSource === 'manual' ? 'bg-[#EAF3FF] text-[#155DFC]' : 'bg-white text-[#334155] hover:bg-[#F8FAFC]'}`}
                  >
                    Tự thêm mới từng trường
                  </button>
                </div>
              </div>

              {/* ── DLDC mode ── */}
              {wizardData.dataSource === 'dldc' && (
                <div className="space-y-4">
                  {/* Chọn bảng nguồn dữ liệu đã đăng ký ở Bước 1 */}
                  <div className="border border-[#E2E8F0] rounded-2xl bg-white overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#E2E8F0] bg-white flex items-center gap-2">
                      <Database className="w-4 h-4 text-[#155DFC]" />
                      <p className="text-[14px] font-medium text-[#020817]">Chọn bảng nguồn dữ liệu</p>
                    </div>

                    <div className="p-5 space-y-4">
                      {registeredSources.length === 0 ? (
                        <p className="text-[13px] text-[#64748B] text-center py-4">Chưa đăng ký nguồn dữ liệu nào ở Bước 1</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {registeredSources.map(src => (
                            <span
                              key={src.id}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#BFDBFE] bg-[#EAF3FF] text-[#155DFC] text-[13px] font-medium"
                            >
                              <Database className="w-3.5 h-3.5" />
                              {src.name}
                              <Badge label={SOURCE_KIND_LABELS[src.kind]} variant={SOURCE_KIND_COLORS[src.kind]} />
                              <Badge label={src.grain} variant={SOURCE_GRAIN_COLORS[src.grain]} />
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Info row — trường sẽ được gộp từ mọi bảng thuộc tất cả các nguồn đã đăng ký */}
                      {dldcSelectedDbIds.length > 0 && (
                        <div className="px-4 py-2.5 bg-[#EAF3FF] border border-[#BFDBFE] rounded-lg flex items-center gap-2">
                          <Database className="w-3.5 h-3.5 text-[#155DFC] flex-shrink-0" />
                          <p className="text-[13px] text-[#020817]">
                            Đã gộp trường từ: <span className="font-medium">{dldcSelectedDbIds.map(id => DLDC_DATABASES.find(d => d.id === id)?.label).join(', ')}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Field selection table — bấm "Thêm trường" để thêm 1 dòng, chọn Nguồn/Trường gốc ngay trong bảng */}
                  {registeredSources.length > 0 && (
                    <div className="border border-[#E2E8F0] rounded-2xl bg-white overflow-hidden">
                      <div className="px-4 py-3 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#64748B]" />
                          <p className="text-[14px] font-medium text-[#020817]">Chọn trường dữ liệu chia sẻ</p>
                          <span className="inline-flex items-center h-[26px] px-2 rounded-2xl border text-[13px] text-[#2563EB] bg-[#EFF6FF] border-[#BFDBFE] whitespace-nowrap">
                            {dldcFieldRows.filter(r => r.shared).length}/{dldcFieldRows.length} trường được chọn
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddDldcFieldRow}
                          className={BTN_OUTLINE}
                        >
                          <Plus className="w-3.5 h-3.5" /> Thêm trường
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse collection-table text-[13px] text-left" style={{ tableLayout: 'fixed' }}>
                          <colgroup>
                            <col style={{ width: '36px' }} />
                            <col style={{ width: '36px' }} />
                            <col style={{ width: '16%' }} />
                            <col style={{ width: '16%' }} />
                            <col style={{ width: '14%' }} />
                            <col style={{ width: '18%' }} />
                            <col style={{ width: '110px' }} />
                            <col style={{ width: '36px' }} />
                          </colgroup>
                          <thead className="bg-[#F8FAFC]">
                            <tr className="h-[42px]">
                              <th className={`${TH_CLS} text-center`}>
                                <input
                                  type="checkbox"
                                  title="Chọn / Bỏ chọn tất cả"
                                  checked={dldcFieldRows.length > 0 && dldcFieldRows.every(r => r.shared)}
                                  onChange={handleToggleAllDldcShared}
                                  className="rounded border-[#CBD5E1] text-blue-600 focus:ring-blue-600 cursor-pointer"
                                />
                              </th>
                              <th className={`${TH_CLS} text-center`}>PK</th>
                              <th className={`${TH_CLS} truncate`}>Nguồn (Table)</th>
                              <th className={`${TH_CLS} truncate`}>Trường gốc (Column)</th>
                              <th className={`${TH_CLS} truncate`}>Tên cột</th>
                              <th className={`${TH_CLS} truncate`}>Tên hiển thị</th>
                              <th className={`${TH_CLS}`}>Kiểu dữ liệu</th>
                              <th className={`${TH_CLS} text-center`}>Xóa</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dldcFieldRows.length === 0 ? (
                              <tr>
                                <td colSpan={8} className="px-3 py-16 text-center text-[13px] text-[#64748B]">
                                  Chưa có trường nào được thêm. Chọn bảng và trường ở trên rồi bấm "Thêm trường".
                                </td>
                              </tr>
                            ) : (
                              dldcFieldRows.map(row => (
                                <tr key={row.id} className={`${TR_CLS} ${row.shared ? '' : 'opacity-40'}`}>
                                  <td className="px-3 py-1 text-center text-black">
                                    <input
                                      type="checkbox"
                                      checked={row.shared}
                                      onChange={() => handleDldcFieldToggle(row.id, 'shared')}
                                      className="rounded border-[#CBD5E1] text-blue-600 focus:ring-blue-600 cursor-pointer"
                                    />
                                  </td>
                                  <td className="px-3 py-1 text-center text-black">
                                    <input
                                      type="checkbox"
                                      checked={row.isPK}
                                      onChange={() => handleDldcFieldToggle(row.id, 'isPK')}
                                      className="rounded border-[#CBD5E1] text-[#D97706] focus:ring-blue-600 cursor-pointer"
                                    />
                                  </td>
                                  <td className="px-3 py-1 text-black">
                                    <select
                                      value={row.tableId}
                                      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                        const newSourceId = e.target.value;
                                        setDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, tableId: newSourceId, columnName: '', displayName: '' } : r));
                                      }}
                                      className={INPUT_CLS}
                                    >
                                      <option value="">-- Chọn nguồn --</option>
                                      {registeredSources.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                      ))}
                                    </select>
                                  </td>
                                  <td className="px-3 py-1 text-black">
                                    {(() => {
                                      const rowSource = registeredSources.find(s => s.id === row.tableId);
                                      const fieldOptions = rowSource ? getSourceFieldOptions(rowSource.name) : [];
                                      return (
                                        <select
                                          value={row.columnName}
                                          disabled={!rowSource}
                                          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                            const colName = e.target.value;
                                            const fieldDef = fieldOptions.find(f => f.fieldName === colName);
                                            const isDup = dldcFieldRows.some(r => r.id !== row.id && r.columnName === colName);
                                            setDldcFieldRows(prev => prev.map(r => r.id === row.id ? {
                                              ...r,
                                              columnName: colName,
                                              apiFieldName: colName,
                                              dataType: fieldDef?.dataType || r.dataType,
                                              displayName: fieldDef ? (isDup && rowSource ? `${fieldDef.displayName} (${rowSource.name})` : fieldDef.displayName) : r.displayName,
                                            } : r));
                                          }}
                                          className={SELECT_CLS}
                                        >
                                          <option value="">-- Chọn --</option>
                                          {fieldOptions.map(f => (
                                            <option key={f.fieldName} value={f.fieldName}>{f.displayName} ({f.fieldName})</option>
                                          ))}
                                        </select>
                                      );
                                    })()}
                                  </td>
                                  <td className="px-3 py-1 text-black">
                                    <input
                                      type="text"
                                      value={row.apiFieldName}
                                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, apiFieldName: e.target.value } : r))}
                                      className={INPUT_CLS}
                                      placeholder="Tên cột"
                                    />
                                  </td>
                                  <td className="px-3 py-1 text-black">
                                    <input
                                      type="text"
                                      value={row.displayName}
                                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, displayName: e.target.value } : r))}
                                      className={INPUT_CLS}
                                      placeholder="Tên hiển thị"
                                    />
                                  </td>
                                  <td className="px-3 py-1 text-black">
                                    <TruncatedText text={FIELD_DATA_TYPES.find(dt => dt.value === row.dataType)?.label || row.dataType} />
                                  </td>
                                  <td className="px-3 py-1 text-center text-black">
                                    <RowIconAction label="Xóa" onClick={() => handleDldcRemoveRow(row.id)}>
                                      <Trash2 className="w-4 h-4" />
                                    </RowIconAction>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Manual mode ── */}
              {wizardData.dataSource === 'manual' && (
                <div className="space-y-4">
                  {/* Add Attribute Form */}
                  <div className="border border-[#E2E8F0] rounded-2xl p-4 bg-[#F8FAFC]">
                    <h4 className="text-[14px] font-medium text-[#020817] mb-3">Thêm thuộc tính mới</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={LABEL_CLS}>Tên trường <span className={REQUIRED_MARK}>*</span></label>
                        <input
                          type="text"
                          value={currentAttribute.fieldName}
                          onChange={(e) => setCurrentAttribute({ ...currentAttribute, fieldName: e.target.value.toLowerCase() })}
                          placeholder="citizen_id"
                          className={INPUT_CLS}
                        />
                      </div>
                      <div>
                        <label className={LABEL_CLS}>Tên hiển thị <span className={REQUIRED_MARK}>*</span></label>
                        <input
                          type="text"
                          value={currentAttribute.displayName}
                          onChange={(e) => setCurrentAttribute({ ...currentAttribute, displayName: e.target.value })}
                          placeholder="Số CCCD"
                          className={INPUT_CLS}
                        />
                      </div>
                      <div>
                        <label className={LABEL_CLS}>Kiểu dữ liệu</label>
                        <div className="relative">
                          <select
                            value={currentAttribute.dataType}
                            onChange={(e) => setCurrentAttribute({ ...currentAttribute, dataType: e.target.value as FieldDataType })}
                            className={`${INPUT_CLS} pr-8 appearance-none cursor-pointer`}
                          >
                            <option value="string">String</option>
                            <option value="number">Number</option>
                            <option value="date">Date</option>
                            <option value="datetime">Datetime</option>
                            <option value="boolean">Boolean</option>
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className={LABEL_CLS}>Độ dài</label>
                        <input
                          type="number"
                          value={currentAttribute.length || ''}
                          onChange={(e) => setCurrentAttribute({ ...currentAttribute, length: parseInt(e.target.value) || undefined })}
                          placeholder="255"
                          className={INPUT_CLS}
                        />
                      </div>
                      <div>
                        <label className={LABEL_CLS}>Giá trị mặc định</label>
                        <input
                          type="text"
                          value={currentAttribute.defaultValue || ''}
                          onChange={(e) => setCurrentAttribute({ ...currentAttribute, defaultValue: e.target.value })}
                          placeholder="VD: N/A"
                          className={INPUT_CLS}
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 mt-3">
                      <label className="flex items-center gap-2 text-[13px] cursor-pointer">
                        <input type="checkbox" checked={currentAttribute.required}
                          onChange={(e) => setCurrentAttribute({ ...currentAttribute, required: e.target.checked })}
                          className="rounded border-[#CBD5E1] text-blue-600" />
                        Bắt buộc
                      </label>
                      <label className="flex items-center gap-2 text-[13px] cursor-pointer">
                        <input type="checkbox" checked={currentAttribute.isKey}
                          onChange={(e) => setCurrentAttribute({ ...currentAttribute, isKey: e.target.checked })}
                          className="rounded border-[#CBD5E1] text-blue-600" />
                        <span className="flex items-center gap-1"><Key className="w-3.5 h-3.5 text-blue-600" /> Khóa (khóa chính)</span>
                      </label>
                    </div>
                    <button
                      onClick={handleAddAttribute}
                      className={`${BTN_PRIMARY} mt-3`}
                    >
                      <Plus className="w-4 h-4" />
                      Thêm thuộc tính
                    </button>
                  </div>

                  {/* Attributes List */}
                  <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#E2E8F0] bg-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#64748B]" />
                      <p className="text-[14px] font-medium text-[#020817]">Danh sách thuộc tính</p>
                      <span className="inline-flex items-center h-[26px] px-2 rounded-2xl border text-[13px] text-[#2563EB] bg-[#EFF6FF] border-[#BFDBFE] whitespace-nowrap">{wizardData.attributes.length} trường</span>
                    </div>
                    {wizardData.attributes.length === 0 ? (
                      <div className="p-8 text-center text-[13px] text-[#64748B]">
                        Chưa có thuộc tính nào. Vui lòng thêm ít nhất 1 thuộc tính.
                      </div>
                    ) : (
                      <table className="w-full border-collapse collection-table text-[13px] text-left">
                        <thead className="bg-[#F8FAFC]">
                          <tr className="h-[42px]">
                            <th className={`${TH_CLS}`}>Tên trường</th>
                            <th className={`${TH_CLS}`}>Tên hiển thị</th>
                            <th className={`${TH_CLS}`}>Kiểu</th>
                            <th className={`${TH_CLS}`}>Độ dài</th>
                            <th className={`${TH_CLS}`}>Giá trị mặc định</th>
                            <th className={`${TH_CLS}`}>Ràng buộc</th>
                            <th className={`${TH_CLS} text-center`}>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {wizardData.attributes.map((attr, index) => (
                            <tr key={index} className={TR_CLS}>
                              <td className="px-3 py-1 text-black">
                                <TruncatedText text={attr.fieldName} className="max-w-[200px]" />
                              </td>
                              <td className="px-3 py-1 text-black">{attr.displayName}</td>
                              <td className="px-3 py-1 text-black">
                                <Badge label={attr.dataType} variant="slate" />
                              </td>
                              <td className="px-3 py-1 text-black">{attr.length ?? '—'}</td>
                              <td className="px-3 py-1 text-black">{attr.defaultValue || '—'}</td>
                              <td className="px-3 py-1 text-black">
                                <div className="flex gap-1 flex-wrap">
                                  {attr.required && <Badge label="Bắt buộc" variant="red" />}
                                  {attr.isKey && <Badge label="Khóa" variant="blue" icon={<Key className="w-3 h-3" />} />}
                                  {!attr.required && !attr.isKey && <span className="text-[#94A3B8]">—</span>}
                                </div>
                              </td>
                              <td className="px-3 py-1 text-right text-black">
                                <RowIconAction label="Xóa" onClick={() => handleDeleteAttribute(index)}>
                                  <Trash2 className="w-4 h-4" />
                                </RowIconAction>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* ── Khối: Ánh xạ cột nguồn → thuộc tính ── */}
              <div className="border border-[#E2E8F0] rounded-2xl bg-white overflow-hidden">
                <div className="px-4 py-3 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-[#64748B]" />
                    <p className="text-[14px] font-medium text-[#020817]">Ánh xạ cột nguồn → thuộc tính</p>
                  </div>
                  <span className="text-[13px] text-[#64748B]">{registeredSources.length} nguồn</span>
                </div>

                {registeredSources.length <= 1 && (
                  <div className="px-4 py-2.5 bg-[#FFF7ED] border-b border-[#FED7AA]">
                    <p className="text-[13px] text-[#020817]">ℹ️ Chỉ 1 nguồn — ánh xạ trực tiếp</p>
                  </div>
                )}

                {hasMappingMismatch && (
                  <div className="px-4 py-2.5 bg-[#FFF7ED] border-b border-[#FED7AA] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#D97706] flex-shrink-0" />
                    <p className="text-[13px] text-[#020817]">Có ít nhất 1 ô ánh xạ lệch kiểu dữ liệu giữa nguồn và thuộc tính đích — vui lòng kiểm tra lại</p>
                  </div>
                )}

                {availableFields.length === 0 ? (
                  <p className="text-[13px] text-[#64748B] text-center py-6 px-4">Chưa có thuộc tính để ánh xạ — hãy chọn bảng/trường hoặc thêm thuộc tính ở trên</p>
                ) : registeredSources.length === 0 ? (
                  <p className="text-[13px] text-[#64748B] text-center py-6 px-4">Chưa đăng ký nguồn dữ liệu ở Bước 1</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse collection-table text-[13px] text-left">
                      <thead className="bg-[#F8FAFC]">
                        <tr className="h-[42px]">
                          <th className={`${TH_CLS}`}>Thuộc tính</th>
                          {registeredSources.map(src => (
                            <th key={src.id} className={`${TH_CLS}`}>{src.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {availableFields.map(attr => (
                          <tr key={attr.fieldName} className={TR_CLS}>
                            <td className="px-3 py-1 text-black">
                              <span className="text-[13px] font-medium text-[#020817]">{attr.displayName}</span>
                              <span className="ml-1.5 text-[13px] bg-[#F1F5F9] px-1.5 py-0.5 rounded text-[#64748B]">{attr.fieldName}</span>
                            </td>
                            {registeredSources.map(src => {
                              const selectedColumn = wizardData.mapping[attr.fieldName]?.[src.id] || '';
                              const mismatch = isMappingMismatch(attr.dataType, selectedColumn);
                              return (
                                <td key={src.id} className="px-3 py-1 text-black">
                                  <select
                                    value={selectedColumn}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => handleMappingChange(attr.fieldName, src.id, e.target.value)}
                                    className={`w-full h-10 px-3 border rounded-lg text-[13px] text-[#020817] bg-white cursor-pointer focus:outline-none focus:ring-2 ${mismatch ? 'border-[#D97706] focus:ring-[#D97706]' : 'border-[#E2E8F0] focus:ring-blue-600'}`}
                                  >
                                    <option value="">—</option>
                                    {MOCK_SOURCE_COLUMNS.map(col => <option key={col.name} value={col.name}>{col.name}</option>)}
                                  </select>
                                  {mismatch && (
                                    <div className="flex items-center gap-1 mt-1 text-[13px] text-[#D97706]">
                                      <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                                      <span>Kiểu nguồn ({MOCK_SOURCE_COLUMNS.find(c => c.name === selectedColumn)?.dataType}) ≠ Đích ({attr.dataType})</span>
                                    </div>
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
          )}

          {/* Step 3: Quy tắc hợp nhất */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className={INFO_BANNER}>
                <h3 className="text-[13px] font-medium text-[#020817] mb-1">Bước 3: Quy tắc hợp nhất dữ liệu</h3>
                <p className="text-[13px] text-[#020817]">
                  Thiết lập quy tắc so khớp, hợp nhất giá trị và kiểm thử mô phỏng trên dữ liệu mẫu
                </p>
              </div>

              {!showSurvivorTab && (
                <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-lg px-4 py-2.5">
                  <p className="text-[13px] text-[#020817]">ℹ️ Chỉ 1 nguồn — không cần hợp nhất giá trị nhiều nguồn</p>
                </div>
              )}

              {/* Sub-tabs */}
              <div className="flex items-center border-b border-[#E2E8F0]" role="tablist">
                {(([
                  { key: 'match',    label: 'So khớp' },
                  { key: 'survivor', label: 'Hợp nhất giá trị' },
                  { key: 'test',     label: 'Kiểm thử' },
                ] as { key: MergeSubTab; label: string }[]).filter(t => t.key !== 'survivor' || showSurvivorTab)).map(t => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setMergeSubTab(t.key)}
                    role="tab"
                    aria-selected={mergeSubTab === t.key}
                    className={`${tabClass(mergeSubTab === t.key)} -mb-px outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* ── Tab 1: So khớp ── */}
              {mergeSubTab === 'match' && (
                <div className="space-y-4">
                {matchingRules.length === 0 && !matchRulesStarted ? (
                  <div className="border border-[#E2E8F0] rounded-2xl bg-white p-10 flex flex-col items-center text-center gap-3">
                    <GitMerge className="w-10 h-10 text-[#CBD5E1]" />
                    <p className="text-[13px] text-[#64748B] max-w-md">
                      Chưa có quy tắc so khớp thuộc tính được tổng hợp từ nhiều nguồn, thêm mới ngay
                    </p>
                    <button
                      type="button"
                      onClick={() => setMatchRulesStarted(true)}
                      className={BTN_PRIMARY}
                    >
                      <Plus className="w-4 h-4" />
                      Thêm mới quy tắc
                    </button>
                  </div>
                ) : (
                <>
                  {/* Ngưỡng */}
                  <div className="border border-[#E2E8F0] rounded-2xl bg-white p-4">
                    <div>
                      <label className={LABEL_CLS}>Ngưỡng tự động gộp (≥)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number" min={0} max={100}
                          value={mergeConfig.autoThreshold}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setMergeConfig(prev => ({ ...prev, autoThreshold: Number(e.target.value) }))}
                          className={`${INPUT_BOX} w-24 text-center tabular-nums`}
                        />
                        <span className="text-[13px] text-[#64748B]">%</span>
                        <span className="text-[13px] text-[#64748B]">Điểm khớp từ ngưỡng này trở lên sẽ được gộp tự động</span>
                      </div>
                    </div>
                  </div>

                  {/* Bảng matching rules */}
                  <div className="border border-[#E2E8F0] rounded-2xl bg-white overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#E2E8F0] bg-white">
                      <p className="text-[14px] font-medium text-[#020817]">Quy tắc so khớp</p>
                      <p className="text-[13px] text-[#64748B]">Xác định khi nào hai bản ghi từ hai nguồn được coi là cùng một thực thể</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse collection-table text-[13px] text-left">
                        <thead className="bg-[#F8FAFC]">
                          <tr className="h-[42px]">
                            <th className={`${TH_CLS}`}>Trường đối chiếu</th>
                            <th className={`${TH_CLS}`}>Kiểu so khớp</th>
                            <th className={`${TH_CLS}`}>Thuật toán</th>
                            <th className={`${TH_CLS} text-center w-28`}>Ngưỡng (%)</th>
                            <th className={`${TH_CLS} text-center w-28`}>Trọng số (%)</th>
                            <th className={`${TH_CLS} text-center w-28`}>Điều kiện</th>
                            <th className={`${TH_CLS} text-center w-10`}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {matchingRules.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="px-3 py-16 text-center text-[13px] text-[#64748B]">
                                Chưa có quy tắc — nhấn "+ Thêm quy tắc so khớp" để bắt đầu
                              </td>
                            </tr>
                          ) : (
                            matchingRules.map((rule, idx) => (
                              <tr key={rule.id} className={TR_CLS}>
                                <td className="px-3 py-1 text-black">
                                  <select
                                    value={rule.fieldName}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setMatchingRules(prev => prev.map(r => r.id === rule.id ? { ...r, fieldName: e.target.value } : r))}
                                    className={SELECT_CLS}
                                  >
                                    <option value="">-- Chọn trường --</option>
                                    {availableFields.map(f => (
                                      <option key={f.fieldName} value={f.fieldName}>{f.displayName}</option>
                                    ))}
                                  </select>
                                </td>
                                <td className="px-3 py-1 text-black">
                                  <select
                                    value={rule.method}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setMatchingRules(prev => prev.map(r => r.id === rule.id ? { ...r, method: e.target.value as MatchMethod } : r))}
                                    className={SELECT_CLS}
                                  >
                                    <option value="exact">{MATCH_METHOD_LABELS.exact}</option>
                                    <option value="fuzzy">{MATCH_METHOD_LABELS.fuzzy}</option>
                                  </select>
                                </td>
                                <td className="px-3 py-1 text-black">
                                  {rule.method === 'fuzzy' ? (
                                    <select
                                      value={rule.algorithm}
                                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setMatchingRules(prev => prev.map(r => r.id === rule.id ? { ...r, algorithm: e.target.value as FuzzyAlgorithm } : r))}
                                      className={SELECT_CLS}
                                    >
                                      {FUZZY_ALGORITHMS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                                    </select>
                                  ) : (
                                    <span className="text-[#94A3B8]">—</span>
                                  )}
                                </td>
                                <td className="px-3 py-1 text-center text-black">
                                  {rule.method === 'fuzzy' ? (
                                    <input
                                      type="number" min={0} max={100}
                                      value={rule.fuzzyThreshold}
                                      onChange={(e: ChangeEvent<HTMLInputElement>) => setMatchingRules(prev => prev.map(r => r.id === rule.id ? { ...r, fuzzyThreshold: Number(e.target.value) } : r))}
                                      className={`${INPUT_CLS} text-center tabular-nums`}
                                    />
                                  ) : (
                                    <span className="text-[#94A3B8]">—</span>
                                  )}
                                </td>
                                <td className="px-3 py-1 text-center text-black">
                                  <input
                                    type="number" min={0} max={100}
                                    value={rule.weight}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setMatchingRules(prev => prev.map(r => r.id === rule.id ? { ...r, weight: Number(e.target.value) } : r))}
                                    className={`${INPUT_CLS} text-center tabular-nums`}
                                  />
                                </td>
                                <td className="px-3 py-1 text-center text-black">
                                  {idx < matchingRules.length - 1 ? (
                                    <select
                                      value={rule.operator}
                                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setMatchingRules(prev => prev.map(r => r.id === rule.id ? { ...r, operator: e.target.value as ConditionOperator } : r))}
                                      className={`${SELECT_CLS} text-center`}
                                    >
                                      <option value="AND">AND</option>
                                      <option value="OR">OR</option>
                                    </select>
                                  ) : (
                                    <span className="text-[#94A3B8]">—</span>
                                  )}
                                </td>
                                <td className="px-3 py-1 text-center text-black">
                                  <RowIconAction label="Xóa" onClick={() => setMatchingRules(prev => prev.filter(r => r.id !== rule.id))}>
                                    <Trash2 className="w-4 h-4" />
                                  </RowIconAction>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                        {matchingRules.length > 0 && (
                          <tfoot className="bg-[#F8FAFC]">
                            <tr>
                              <td colSpan={4} className="px-3 py-2 text-right text-[13px] font-medium text-[#475569]">Tổng trọng số:</td>
                              <td className="px-3 py-1 text-center text-black">
                                <span className={`text-[13px] font-medium tabular-nums ${totalWeight === 100 ? 'text-[#15803D]' : 'text-[#DC2626]'}`}>{totalWeight}%</span>
                              </td>
                              <td colSpan={3} className="px-3 py-2 text-[13px] text-[#64748B]">
                                {totalWeight === 100 ? 'Hợp lệ' : 'Tổng trọng số phải bằng 100%'}
                              </td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    </div>
                    <div className="p-3 border-t border-[#E2E8F0]">
                      <button
                        type="button"
                        onClick={() => setMatchingRules(prev => {
                          const next = [...prev, { id: `mr-${Date.now()}`, fieldName: '', method: 'exact' as MatchMethod, fuzzyThreshold: 80, normalize: false, operator: 'AND' as ConditionOperator, weight: 0, algorithm: 'jaro_winkler' as FuzzyAlgorithm }];
                          // Chia đều trọng số cho tất cả quy tắc
                          const even = Math.floor(100 / next.length);
                          const remainder = 100 - even * next.length;
                          return next.map((r, i) => ({ ...r, weight: even + (i === 0 ? remainder : 0) }));
                        })}
                        className={BTN_OUTLINE}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Thêm quy tắc so khớp
                      </button>
                    </div>
                  </div>

                  {/* Trường hard-block */}
                  <div className="border border-[#E2E8F0] rounded-2xl bg-white p-4 space-y-3">
                    <div>
                      <p className="text-[14px] font-medium text-[#020817]">Trường hard-block</p>
                      <p className="text-[13px] text-[#64748B]">Nếu các trường này khác nhau, hai bản ghi chắc chắn KHÔNG phải cùng thực thể (loại khỏi so khớp)</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {mergeConfig.hardBlockFields.map(f => (
                        <span key={f} className="inline-flex items-center gap-1.5 h-[26px] px-2 bg-[#EAF3FF] text-[#155DFC] border border-[#BFDBFE] rounded-2xl text-[13px]">
                          {availableFields.find(af => af.fieldName === f)?.displayName || f}
                          <button type="button" onClick={() => handleRemoveHardBlockField(f)} aria-label="Xóa" className="text-[#155DFC] hover:text-[#DC2626] rounded cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                      {mergeConfig.hardBlockFields.length === 0 && (
                        <span className="text-[13px] text-[#64748B]">Chưa có trường hard-block nào</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={hardBlockInput}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setHardBlockInput(e.target.value)}
                        className={`${INPUT_BOX} flex-1 max-w-xs cursor-pointer`}
                      >
                        <option value="">-- Chọn trường để thêm --</option>
                        {availableFields
                          .filter(f => !mergeConfig.hardBlockFields.includes(f.fieldName))
                          .map(f => <option key={f.fieldName} value={f.fieldName}>{f.displayName}</option>)}
                      </select>
                      <button
                        type="button"
                        onClick={() => { handleAddHardBlockField(hardBlockInput); setHardBlockInput(''); }}
                        disabled={!hardBlockInput}
                        className={BTN_OUTLINE}
                      >
                        <Plus className="w-3.5 h-3.5" /> Thêm
                      </button>
                    </div>
                  </div>
                </>
                )}
                </div>
              )}

              {/* ── Tab 2: Hợp nhất giá trị ── */}
              {mergeSubTab === 'survivor' && (
                <div className="border border-[#E2E8F0] rounded-2xl bg-white overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#E2E8F0] bg-white">
                    <p className="text-[14px] font-medium text-[#020817]">Hợp nhất giá trị (Survivorship)</p>
                    <p className="text-[13px] text-[#64748B]">Với mỗi trường, chọn giá trị nào sẽ tồn tại trong bản ghi chủ cuối cùng</p>
                  </div>
                  <div className="p-4">
                    {extractionRules.length === 0 ? (
                      <p className="text-[13px] text-[#64748B] text-center py-6">Hoàn tất Bước 2 để tự động nạp danh sách trường</p>
                    ) : (
                      <div className="border border-[#E2E8F0] rounded-lg overflow-x-auto">
                        <table className="w-full border-collapse collection-table text-[13px] text-left">
                          <thead className="bg-[#F8FAFC]">
                            <tr className="h-[42px]">
                              <th className={`${TH_CLS}`}>Trường</th>
                              <th className={`${TH_CLS}`}>Chiến lược</th>
                              <th className={`${TH_CLS}`}>Nguồn dữ liệu</th>
                              <th className={`${TH_CLS}`}>Khi hết vẫn trống</th>
                            </tr>
                          </thead>
                          <tbody>
                            {extractionRules.map(rule => (
                              <tr key={rule.id} className={TR_CLS}>
                                <td className="px-3 py-1 align-top text-black">
                                  <span className="text-[13px] font-medium text-[#020817]">{availableFields.find(f => f.fieldName === rule.fieldName)?.displayName || rule.fieldName}</span>
                                  <span className="ml-1.5 text-[13px] bg-[#F1F5F9] px-1.5 py-0.5 rounded text-[#64748B]">{rule.fieldName}</span>
                                </td>
                                <td className="px-3 py-1 align-top text-black">
                                  <select
                                    value={rule.conflictStrategy}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setExtractionRules(prev => prev.map(r => r.id === rule.id ? { ...r, conflictStrategy: e.target.value as ConflictStrategy } : r))}
                                    className={SELECT_CLS}
                                  >
                                    <option value="source">{CONFLICT_STRATEGY_LABELS.source}</option>
                                    <option value="priority">{CONFLICT_STRATEGY_LABELS.priority}</option>
                                  </select>
                                </td>
                                <td className="px-3 py-1 align-top text-black">
                                  {rule.conflictStrategy === 'source' ? (
                                    <select
                                      value={rule.primarySource}
                                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setExtractionRules(prev => prev.map(r => r.id === rule.id ? { ...r, primarySource: e.target.value } : r))}
                                      className={SELECT_CLS}
                                    >
                                      <option value="">-- Chọn nguồn --</option>
                                      {registeredSources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                  ) : (
                                    (() => {
                                      const regIds = registeredSources.map(s => s.id);
                                      const ordered = [...rule.priorityOrder.filter(id => regIds.includes(id)), ...regIds.filter(id => !rule.priorityOrder.includes(id))];
                                      const apply = (arr: string[]) => setExtractionRules(prev => prev.map(r => r.id === rule.id ? { ...r, priorityOrder: arr } : r));
                                      if (ordered.length === 0) return <span className="text-[13px] text-[#64748B]">Chưa có nguồn</span>;
                                      return (
                                        <div className="space-y-1 min-w-[190px]">
                                          {ordered.map((sid, idx) => {
                                            const s = registeredSources.find(x => x.id === sid);
                                            return (
                                              <div key={sid} className="flex items-center gap-1.5 border border-[#E2E8F0] rounded-lg px-2 py-1 bg-[#F8FAFC]">
                                                <span className="w-4 text-[12px] text-[#64748B] tabular-nums">{idx + 1}</span>
                                                <span className="flex-1 text-[13px] text-[#020817] truncate">{s?.name}</span>
                                                <button type="button" disabled={idx === 0} onClick={() => { const a = [...ordered]; [a[idx - 1], a[idx]] = [a[idx], a[idx - 1]]; apply(a); }} className="p-0.5 rounded text-[#64748B] hover:text-blue-600 disabled:text-[#CBD5E1] disabled:cursor-not-allowed cursor-pointer" aria-label="Lên"><ChevronUp className="w-3.5 h-3.5" /></button>
                                                <button type="button" disabled={idx === ordered.length - 1} onClick={() => { const a = [...ordered]; [a[idx + 1], a[idx]] = [a[idx], a[idx + 1]]; apply(a); }} className="p-0.5 rounded text-[#64748B] hover:text-blue-600 disabled:text-[#CBD5E1] disabled:cursor-not-allowed cursor-pointer" aria-label="Xuống"><ChevronDown className="w-3.5 h-3.5" /></button>
                                              </div>
                                            );
                                          })}
                                          <p className="text-[12px] text-[#64748B]">Thiếu ở nguồn đầu → lấy nguồn kế</p>
                                        </div>
                                      );
                                    })()
                                  )}
                                </td>
                                <td className="px-3 py-1 text-black">
                                  <select
                                    value={rule.onEmpty}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setExtractionRules(prev => prev.map(r => r.id === rule.id ? { ...r, onEmpty: e.target.value as OnEmpty } : r))}
                                    className={SELECT_CLS}
                                  >
                                    <option value="required">Bắt buộc</option>
                                    <option value="warn">Cảnh báo</option>
                                    <option value="allow">Cho phép trống</option>
                                  </select>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Tab 3: Kiểm thử ── */}
              {mergeSubTab === 'test' && (
                <div className="space-y-4">
                  <div className="border border-[#E2E8F0] rounded-2xl bg-white p-4 flex flex-wrap items-end gap-3">
                    <div>
                      <label className={LABEL_CLS}>Chọn số lượng bản ghi chạy kiểm thử</label>
                      <select
                        value={testSample}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => { setTestSample(e.target.value); setTestRun(false); }}
                        className={`${INPUT_BOX} w-80 cursor-pointer`}
                      >
                        <option value="">-- Chọn số lượng bản ghi --</option>
                        {WIZARD_MOCK_SAMPLES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTestRun(true)}
                      disabled={!testSample}
                      className={BTN_PRIMARY}
                    >
                      Chạy mô phỏng
                    </button>
                  </div>

                  {!testRun ? (
                    <div className="border border-dashed border-[#E2E8F0] rounded-2xl bg-[#F8FAFC] p-8 text-center text-[13px] text-[#64748B]">
                      Chọn dữ liệu mẫu và nhấn "Chạy mô phỏng" để xem kết quả kiểm thử
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-3 gap-4">
                        {([
                          { label: 'Golden hình thành', value: 312, Icon: CheckCircle2, box: 'bg-green-50', icon: 'text-green-600' },
                          { label: 'Tự động hợp nhất', value: 268, Icon: GitMerge, box: 'bg-blue-50', icon: 'text-blue-600' },
                          { label: 'Không khớp', value: 183, Icon: AlertCircle, box: 'bg-[#F1F5F9]', icon: 'text-[#475569]' },
                        ]).map(card => (
                          <div key={card.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${card.box}`}>
                              <card.Icon className={`w-5 h-5 ${card.icon}`} />
                            </div>
                            <div className="min-w-0">
                              <div className="text-[16px] text-[#64748B] truncate">{card.label}</div>
                              <div className="text-[16px] font-semibold text-[#0F172A] tabular-nums">{card.value}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Bảng Các bản ghi không khớp */}
                      <div className="border border-[#E2E8F0] rounded-2xl bg-white overflow-hidden">
                        <div className="px-4 py-3 border-b border-[#E2E8F0] bg-white flex items-center gap-3 flex-wrap min-h-[48px]">
                          <div className="flex items-center gap-2">
                            <p className="text-[14px] font-medium text-[#020817]">Các bản ghi không khớp</p>
                            <span className="inline-flex items-center h-[26px] px-2 rounded-2xl border text-[13px] text-[#64748B] bg-[#F8FAFC] border-[#E2E8F0] whitespace-nowrap">
                              183 bản ghi
                            </span>
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse collection-table text-[13px] text-left">
                            <thead className="bg-[#F8FAFC]">
                              <tr className="h-[42px]">
                                <th className={`${TH_CLS}`}>Bản ghi nguồn</th>
                                <th className={`${TH_CLS} text-right w-36`}>Điểm khớp cao nhất</th>
                                <th className={`${TH_CLS}`}>Lý do không khớp</th>
                              </tr>
                            </thead>
                            <tbody>
                              {MOCK_UNMATCHED_ITEMS.map(item => (
                                <tr key={item.id} className={TR_CLS}>
                                  <td className="px-3 py-1 text-black">
                                    <span className="mr-1.5">{item.record}</span>
                                    <Badge label={item.sourceName} variant="slate" />
                                  </td>
                                  <td className="px-3 py-1 text-right tabular-nums text-black">
                                    {item.maxScore}%
                                  </td>
                                  <td className="px-3 py-1 text-black max-w-[360px]"><TruncatedText text={item.reason} /></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <Pagination
                          className="border-t border-[#E2E8F0]"
                          currentPage={unmatchedPage}
                          totalItems={183}
                          pageSize={5}
                          onPageChange={setUnmatchedPage}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Thiết lập quan hệ */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className={INFO_BANNER}>
                <h3 className="text-[13px] font-medium text-[#020817] mb-1">Bước 4: Thiết lập quan hệ</h3>
                <p className="text-[13px] text-[#020817]">Định nghĩa mối quan hệ giữa thực thể này với các thực thể dữ liệu chủ khác trong hệ thống</p>
              </div>

              {/* Entity info + add button */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-[13px] flex-shrink-0">
                    {(wizardData.code || wizardData.name || 'E').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[13px] text-[#64748B]">Thực thể đang cấu hình:</p>
                    <p className="text-[13px] font-medium text-[#020817]">
                      {wizardData.code && <span className="text-[#155DFC] mr-1.5">{wizardData.code}</span>}
                      {wizardData.name || '(Chưa đặt tên)'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {!relFormOpen && wizardData.relationships.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text" value={relSearch}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setRelSearch(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') setRelSearchApplied(relSearch); }}
                        placeholder="Tìm kiếm quan hệ..."
                        className={`${SEARCH_INPUT_CLS.replace('w-full ', '')} w-60`}
                      />
                      <button type="button" onClick={() => setRelSearchApplied(relSearch)} className={SEARCH_BTN_CLS} title="Tìm kiếm" aria-label="Tìm kiếm">
                        <Search className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {!relFormOpen && (
                    <button
                      type="button" onClick={handleOpenAddRel}
                      className={`${BTN_PRIMARY} whitespace-nowrap`}
                    >
                      <Plus className="w-4 h-4" /> Thêm quan hệ
                    </button>
                  )}
                </div>
              </div>

              {/* Inline add / edit form */}
              {relFormOpen && (
                <div className="border border-[#E2E8F0] rounded-2xl bg-white overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
                    <p className="text-[14px] font-medium text-[#020817]">
                      {editingRelId ? 'Chỉnh sửa quan hệ' : 'Thêm quan hệ mới'}
                    </p>
                    <button type="button" onClick={handleCancelRel} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 space-y-5">
                    {/* 1. Chọn thực thể */}
                    <div className="space-y-3">
                      <h4 className="text-[14px] font-medium text-[#020817] border-b border-[#E2E8F0] pb-2">1. Chọn thực thể liên kết</h4>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className={LABEL_CLS}>
                            Thực thể nguồn <span className="text-[#94A3B8] font-normal">(thực thể đang tạo)</span>
                          </label>
                          <div className="h-10 px-3 flex items-center border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[13px] text-[#475569]">
                            {wizardData.code && <span className="text-[#155DFC] mr-1.5">{wizardData.code}</span>}
                            {wizardData.name || '(Thực thể đang tạo)'}
                          </div>
                        </div>
                        <div>
                          <label className={LABEL_CLS}>
                            Thực thể đích <span className={REQUIRED_MARK}>*</span>
                          </label>
                          <select
                            value={relFormData.targetEntityId}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                              const ent = WIZARD_MOCK_ENTITIES.find(x => x.id === e.target.value);
                              setRelFormData(prev => ({ ...prev, targetEntityId: e.target.value, targetEntityName: ent?.name || '', sourceKey: '', targetKey: '' }));
                              setRelFormError('');
                            }}
                            className={SELECT_CLS}
                          >
                            <option value="">-- Chọn thực thể đích --</option>
                            {WIZARD_MOCK_ENTITIES.map(e => <option key={e.id} value={e.id}>{e.code} - {e.name}</option>)}
                          </select>
                        </div>
                      </div>

                      {relFormData.targetEntityId && (
                        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 flex items-center justify-center gap-8">
                          <div className="flex flex-col items-center gap-1.5">
                            <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-[13px]">A</div>
                            <span className="text-[14px] font-medium text-[#020817]">{wizardData.name || '(Thực thể đang tạo)'}</span>
                          </div>
                          <ArrowRight className="w-5 h-5 text-[#94A3B8] flex-shrink-0" />
                          <div className="flex flex-col items-center gap-1.5">
                            <div className="w-9 h-9 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-semibold text-[13px]">B</div>
                            <span className="text-[14px] font-medium text-[#020817]">{WIZARD_MOCK_ENTITIES.find(e => e.id === relFormData.targetEntityId)?.name}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 2. Loại quan hệ */}
                    <div className="space-y-3">
                      <h4 className="text-[14px] font-medium text-[#020817] border-b border-[#E2E8F0] pb-2">2. Loại quan hệ</h4>
                      <select
                        value={relFormData.type}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setRelFormData(prev => ({ ...prev, type: e.target.value as WizardRelType, sourceKey: '', targetKey: '', mappingTable: '' }))}
                        className={`${INPUT_BOX} w-64 cursor-pointer`}
                      >
                        {(Object.entries(REL_TYPE_LABELS) as [WizardRelType, string][])
                          .map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                          ))}
                      </select>
                    </div>

                    {/* 3. Điều kiện liên kết */}
                    <div className="space-y-3">
                      <h4 className="text-[14px] font-medium text-[#020817] border-b border-[#E2E8F0] pb-2 flex items-center justify-between">
                        <span>3. Điều kiện liên kết</span>
                        {!relFormData.targetEntityId && (
                          <span className="text-[13px] text-[#D97706] bg-[#FFF7ED] font-normal px-2 py-0.5 rounded-lg border border-[#FED7AA]">Chọn thực thể đích để tải danh sách trường</span>
                        )}
                      </h4>

                      {relFormData.targetEntityId ? (
                        relFormData.type === 'n-n' ? (
                          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 space-y-4">
                            <p className="text-[13px] font-medium text-[#020817]">Bảng liên kết (Mapping Table)</p>
                            <div>
                              <label className={LABEL_CLS}>Tên bảng liên kết <span className={REQUIRED_MARK}>*</span></label>
                              <input type="text" value={relFormData.mappingTable}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setRelFormData(prev => ({ ...prev, mappingTable: e.target.value }))}
                                placeholder="VD: tbl_map_entity_a_entity_b"
                                className={INPUT_CLS}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <label className={LABEL_CLS}>Khoá ngoại Nguồn <span className={REQUIRED_MARK}>*</span></label>
                                <select value={relFormData.sourceKey} onChange={(e: ChangeEvent<HTMLSelectElement>) => setRelFormData(prev => ({ ...prev, sourceKey: e.target.value }))}
                                  className={SELECT_CLS}>
                                  <option value="">-- Chọn trường Nguồn --</option>
                                  {(sourceEntityFields.length > 0 ? sourceEntityFields : [{ name: 'id', label: 'ID định danh' }, { name: 'code', label: 'Mã định danh' }]).map(f => <option key={f.name} value={f.name}>{f.name} ({f.label})</option>)}
                                </select>
                              </div>
                              <div>
                                <label className={LABEL_CLS}>Khoá ngoại Đích <span className={REQUIRED_MARK}>*</span></label>
                                <select value={relFormData.targetKey} onChange={(e: ChangeEvent<HTMLSelectElement>) => setRelFormData(prev => ({ ...prev, targetKey: e.target.value }))}
                                  className={SELECT_CLS}>
                                  <option value="">-- Chọn trường Đích --</option>
                                  {BASE_TARGET_FIELDS.map(f => <option key={f.name} value={f.name}>{f.name} ({f.label})</option>)}
                                </select>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 space-y-4">
                            <div className="flex items-center gap-2">
                              <Key className="w-4 h-4 text-blue-600" />
                              <span className="text-[13px] font-medium text-[#020817]">Khóa ngoại (Foreign Key)</span>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <label className={LABEL_CLS}>Khóa nguồn <span className={REQUIRED_MARK}>*</span></label>
                                <select value={relFormData.sourceKey} onChange={(e: ChangeEvent<HTMLSelectElement>) => setRelFormData(prev => ({ ...prev, sourceKey: e.target.value }))}
                                  className={SELECT_CLS}>
                                  <option value="">-- Chọn trường Nguồn --</option>
                                  {(sourceEntityFields.length > 0 ? sourceEntityFields : [{ name: 'id', label: 'ID định danh' }, { name: 'code', label: 'Mã định danh' }]).map(f => <option key={f.name} value={f.name}>{f.name} ({f.label})</option>)}
                                </select>
                                <p className="text-[13px] text-[#64748B] mt-1">Trường trong thực thể đang tạo</p>
                              </div>
                              <div>
                                <label className={LABEL_CLS}>Khóa đích <span className={REQUIRED_MARK}>*</span></label>
                                <select value={relFormData.targetKey} onChange={(e: ChangeEvent<HTMLSelectElement>) => setRelFormData(prev => ({ ...prev, targetKey: e.target.value }))}
                                  className={SELECT_CLS}>
                                  <option value="">-- Chọn trường Đích --</option>
                                  {BASE_TARGET_FIELDS.map(f => <option key={f.name} value={f.name}>{f.name} ({f.label})</option>)}
                                </select>
                                <p className="text-[13px] text-[#64748B] mt-1">Trường dùng để join (thường là ID/Code)</p>
                              </div>
                            </div>
                            <div className="pt-3 border-t border-[#E2E8F0]">
                              <label className={LABEL_CLS}>
                                Trường hiển thị (Lookup Display) <span className="text-[#94A3B8] font-normal">(Không bắt buộc)</span>
                              </label>
                              <select value={relFormData.displayField} onChange={(e: ChangeEvent<HTMLSelectElement>) => setRelFormData(prev => ({ ...prev, displayField: e.target.value }))}
                                className={`${SELECT_CLS} max-w-xs`}>
                                <option value="">-- Không chọn --</option>
                                {BASE_TARGET_FIELDS.map(f => <option key={f.name} value={f.name}>{f.name} ({f.label})</option>)}
                              </select>
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="bg-[#F8FAFC] border border-dashed border-[#E2E8F0] rounded-lg p-6 text-center text-[13px] text-[#64748B]">
                          Hãy chọn thực thể đích ở mục 1 để cấu hình khóa liên kết
                        </div>
                      )}
                    </div>

                    {relFormError && (
                      <div className="flex items-start gap-2 p-3 bg-[#FEF2F2] border border-[#FEE2E2] rounded-lg">
                        <AlertCircle className="w-4 h-4 text-[#DC2626] flex-shrink-0 mt-0.5" />
                        <p className="text-[13px] text-[#DC2626]">{relFormError}</p>
                      </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2 border-t border-[#E2E8F0]">
                      <button type="button" onClick={handleCancelRel}
                        className={BTN_OUTLINE}>
                        Hủy
                      </button>
                      <button type="button" onClick={handleSaveRel}
                        className={BTN_PRIMARY}>
                        <Check className="w-4 h-4" />
                        {editingRelId ? 'Cập nhật quan hệ' : 'Lưu quan hệ'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Relationships table */}
              <div className="border border-[#E2E8F0] rounded-2xl bg-white overflow-hidden">
                {wizardData.relationships.filter(relMatchesSearch).length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <Network className="w-12 h-12 text-[#CBD5E1] mb-3 stroke-[1.5]" />
                    <p className="text-[14px] font-medium text-[#020817]">Chưa có quan hệ nào</p>
                    <p className="text-[13px] text-[#64748B] mt-1 max-w-sm">Thực thể này chưa được cấu hình liên kết với thực thể dữ liệu chủ nào khác.</p>
                    {!relFormOpen && (
                      <button type="button" onClick={handleOpenAddRel}
                        className={`${BTN_PRIMARY} mt-4`}>
                        <Plus className="w-4 h-4" /> Thêm quan hệ
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse collection-table text-[13px] text-left">
                      <thead className="bg-[#F8FAFC]">
                        <tr className="h-[42px]">
                          <th className={`${TH_CLS} text-center w-12`}>STT</th>
                          <th className={`${TH_CLS}`}>Thực thể đích</th>
                          <th className={`${TH_CLS} text-center w-24`}>Loại</th>
                          <th className={`${TH_CLS}`}>Khóa nguồn</th>
                          <th className={`${TH_CLS}`}>Khóa đích</th>
                          <th className={`${TH_CLS}`}>Trường hiển thị / Bảng liên kết</th>
                          <th className={`${TH_CLS} text-center w-20`}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wizardData.relationships.filter(relMatchesSearch).map((rel, idx) => (
                          <tr key={rel.id} className={TR_CLS}>
                            <td className="px-3 py-1 text-center text-black">{idx + 1}</td>
                            <td className="px-3 py-1 text-black">
                              <span className="font-medium text-[#020817]">{rel.targetEntityName}</span>
                            </td>
                            <td className="px-3 py-1 text-center text-black">
                              <Badge label={rel.type} variant={REL_TYPE_COLORS[rel.type]} />
                            </td>
                            <td className="px-3 py-1 text-black">{rel.sourceKey || '—'}</td>
                            <td className="px-3 py-1 text-black">{rel.targetKey || '—'}</td>
                            <td className="px-3 py-1 text-black">
                              {rel.type === 'n-n' ? (
                                rel.mappingTable ? <span>{rel.mappingTable}</span> : <span className="text-[#94A3B8]">—</span>
                              ) : (
                                rel.displayField ? <span>{rel.displayField}</span> : <span className="text-[#94A3B8]">—</span>
                              )}
                            </td>
                            <td className="px-3 py-1 text-black">
                              <div className="flex items-center justify-center gap-1">
                                <RowIconAction label="Chỉnh sửa" onClick={() => handleOpenEditRel(rel)}>
                                  <SquarePen className="w-4 h-4" />
                                </RowIconAction>
                                <RowIconAction label="Xóa" onClick={() => handleDeleteRel(rel.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </RowIconAction>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 6: Quy tắc đánh phiên bản */}
          {currentStep === 6 && (() => {
            const VERSION_FORMAT_OPTIONS: { value: VersionFormatType; label: string; example: string }[] = [
              { value: 'increment',     label: 'Số tăng dần',        example: 'V1 → V2 → V3' },
              { value: 'yearIncrement', label: 'Năm + số tăng dần',  example: '2024.1 → 2024.2 → 2025.1' },
              { value: 'semver',        label: '3 chữ số (Major.Minor.Patch)', example: 'Ver 1.0.0 → Ver 1.0.1' },
              { value: 'custom',        label: 'Tùy chỉnh',          example: '[Prefix] + [Số tự tăng]' },
            ];
            const semverNext = { ...versioningConfig };
            if (semverNext.semverIncrementPart === 'major') {
              semverNext.semverMajor = String((parseInt(versioningConfig.semverMajor, 10) || 0) + 1);
              semverNext.semverMinor = '0';
              semverNext.semverPatch = '0';
            } else if (semverNext.semverIncrementPart === 'minor') {
              semverNext.semverMinor = String((parseInt(versioningConfig.semverMinor, 10) || 0) + 1);
              semverNext.semverPatch = '0';
            } else {
              semverNext.semverPatch = String((parseInt(versioningConfig.semverPatch, 10) || 0) + 1);
            }
            return (
              <div className="space-y-6">
                <div className={INFO_BANNER}>
                  <h3 className="text-[13px] font-medium text-[#020817] mb-1">Bước 6: Quy tắc đánh phiên bản</h3>
                  <p className="text-[13px] text-[#020817]">
                    Thiết lập định dạng số phiên bản cho bản ghi của thực thể này
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="border border-[#E2E8F0] rounded-2xl p-5 space-y-4 bg-white">
                    <h5 className="text-[14px] font-medium text-[#020817]">Định dạng phiên bản</h5>
                    <div className="space-y-2">
                      {VERSION_FORMAT_OPTIONS.map(opt => (
                        <label
                          key={opt.value}
                          className={`flex items-center justify-between gap-4 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                            versioningConfig.versionFormat === opt.value ? 'border-[#BFDBFE] bg-[#EAF3FF]' : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="versionFormat"
                              checked={versioningConfig.versionFormat === opt.value}
                              onChange={() => setVersioningConfig(prev => ({ ...prev, versionFormat: opt.value }))}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-600 cursor-pointer flex-shrink-0"
                            />
                            <span className="text-[13px] font-medium text-[#020817]">{opt.label}</span>
                          </div>
                          <span className="text-[12px] text-[#64748B] whitespace-nowrap">{opt.example}</span>
                        </label>
                      ))}
                    </div>

                    {versioningConfig.versionFormat === 'custom' && (
                      <div>
                        <label className={LABEL_CLS}>Tiền tố (Prefix)</label>
                        <input
                          type="text"
                          value={versioningConfig.customPrefix}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setVersioningConfig(prev => ({ ...prev, customPrefix: e.target.value.toUpperCase() }))}
                          placeholder="VD: VER"
                          className={INPUT_CLS}
                        />
                        <p className="text-[12px] text-[#94A3B8] mt-1">Ví dụ: {versioningConfig.customPrefix || 'VER'}-001</p>
                      </div>
                    )}

                    {versioningConfig.versionFormat === 'semver' && (
                      <div className="space-y-4">
                        <div>
                          <label className={LABEL_CLS}>Tiền tố (Prefix)</label>
                          <input
                            type="text"
                            value={versioningConfig.semverPrefix}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setVersioningConfig(prev => ({ ...prev, semverPrefix: e.target.value }))}
                            placeholder="VD: Ver"
                            className={INPUT_CLS}
                          />
                        </div>

                        <div>
                          <label className={LABEL_CLS}>Bắt đầu từ (Major.Minor.Patch)</label>
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[12px] text-[#64748B] mb-1">Major</label>
                              <input
                                type="number"
                                min={0}
                                value={versioningConfig.semverMajor}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setVersioningConfig(prev => ({ ...prev, semverMajor: e.target.value }))}
                                className={INPUT_CLS}
                              />
                            </div>
                            <div>
                              <label className="block text-[12px] text-[#64748B] mb-1">Minor</label>
                              <input
                                type="number"
                                min={0}
                                value={versioningConfig.semverMinor}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setVersioningConfig(prev => ({ ...prev, semverMinor: e.target.value }))}
                                className={INPUT_CLS}
                              />
                            </div>
                            <div>
                              <label className="block text-[12px] text-[#64748B] mb-1">Patch</label>
                              <input
                                type="number"
                                min={0}
                                value={versioningConfig.semverPatch}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setVersioningConfig(prev => ({ ...prev, semverPatch: e.target.value }))}
                                className={INPUT_CLS}
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className={LABEL_CLS}>Khi có thay đổi, tự động tăng</label>
                          <div className="flex gap-2">
                            {([
                              { value: 'major', label: 'Major' },
                              { value: 'minor', label: 'Minor' },
                              { value: 'patch', label: 'Patch' },
                            ] as { value: SemverIncrementPart; label: string }[]).map(opt => (
                              <label
                                key={opt.value}
                                className={`flex-1 text-center px-3 py-2 border rounded-lg text-[13px] font-semibold cursor-pointer transition-colors ${
                                  versioningConfig.semverIncrementPart === opt.value ? 'border-[#BFDBFE] bg-[#EAF3FF] text-[#155DFC]' : 'border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="semverIncrementPart"
                                  checked={versioningConfig.semverIncrementPart === opt.value}
                                  onChange={() => setVersioningConfig(prev => ({ ...prev, semverIncrementPart: opt.value }))}
                                  className="sr-only"
                                />
                                {opt.label}
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-3 flex items-center justify-between text-[13px]">
                          <span className="text-[#64748B]">Phiên bản hiện tại → phiên bản kế tiếp</span>
                          <span className="text-[#020817]">
                            {versioningConfig.semverPrefix} {versioningConfig.semverMajor}.{versioningConfig.semverMinor}.{versioningConfig.semverPatch}
                            {' → '}
                            {semverNext.semverPrefix} {semverNext.semverMajor}.{semverNext.semverMinor}.{semverNext.semverPatch}
                          </span>
                        </div>
                      </div>
                    )}

                    {versioningConfig.versionFormat !== 'semver' && (
                      <div>
                        <label className={LABEL_CLS}>Bắt đầu từ</label>
                        <input
                          type="text"
                          value={versioningConfig.startFrom}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setVersioningConfig(prev => ({ ...prev, startFrom: e.target.value }))}
                          className={INPUT_CLS}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Step 7: Phê duyệt */}
          {currentStep === 7 && (
            <div className="space-y-4">

              {/* Reviewer + Notes */}
              <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-[#E2E8F0] bg-white">
                  <h4 className="text-[13px] font-medium text-[#020817]">Thông tin phê duyệt</h4>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className={LABEL_CLS}>
                      Chọn người trình duyệt <span className={REQUIRED_MARK}>*</span>
                    </label>
                    <select
                      value={wizardData.approvalReviewer}
                      onChange={(e) => setWizardData({ ...wizardData, approvalReviewer: e.target.value })}
                      className={SELECT_CLS}
                    >
                      <option value="">-- Chọn người trình duyệt --</option>
                      {MOCK_REVIEWERS.map(r => (
                        <option key={r.id} value={r.id}>{r.name} — {r.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={LABEL_CLS}>
                      Ghi chú phê duyệt
                    </label>
                    <textarea
                      value={wizardData.approvalNotes}
                      onChange={(e) => setWizardData({ ...wizardData, approvalNotes: e.target.value })}
                      placeholder="Nhập lý do và ghi chú cho việc tạo dữ liệu chủ này..."
                      rows={3}
                      className={TEXTAREA_CLS}
                    />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
                  <div className="text-[13px] text-[#020817]">
                    <p className="mb-1">Sau khi gửi, dữ liệu chủ sẽ ở trạng thái <strong>"Chờ phê duyệt"</strong>.</p>
                    <p>Người phê duyệt sẽ xem xét và quyết định phê duyệt hoặc từ chối.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] shrink-0">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className={BTN_OUTLINE}
          >
            <ChevronLeft className="w-4 h-4" />
            Quay lại
          </button>

          <div className="text-[13px] text-[#64748B] tabular-nums">
            Bước {currentStep} / {steps.length}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              className={BTN_OUTLINE}
            >
              Lưu nháp
            </button>
            {currentStep < 7 ? (
              <button
                type="button"
                onClick={handleNext}
                className={BTN_PRIMARY}
              >
                Tiếp theo
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitWizard}
                className={BTN_PRIMARY}
              >
                <Check className="w-4 h-4" />
                Gửi phê duyệt
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  </Portal>
  );
}
