import { useState, ChangeEvent } from 'react';
import { X, Check, ChevronRight, ChevronLeft, AlertCircle, Plus, Trash2, Database, FileText, ChevronDown, Network, ArrowRight, Key, Search, SquarePen } from 'lucide-react';
import { Portal } from '../../common/Portal';

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
type ConflictStrategy = 'priority' | 'most_recent' | 'most_complete' | 'flag';
type MergeTrigger = 'auto' | 'approval';
type ConditionOperator = 'AND' | 'OR';

interface MatchingRule {
  id: string;
  fieldName: string;
  method: MatchMethod;
  fuzzyThreshold: number;
  normalize: boolean;
  operator: ConditionOperator;
}

interface ExtractionRule {
  id: string;
  fieldName: string;
  primarySource: string;
  fallbackSource: string;
  conflictStrategy: ConflictStrategy;
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

interface MergeConfig {
  keepSourceRef: boolean;
  mergeTrigger: MergeTrigger;
  minMatchScore: number;
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
  unique: boolean;
  indexed: boolean;
}

interface WizardData {
  // Step 1
  code?: string;
  name: string;
  dataType: DataType;
  managingAgency: string;
  scope: ScopeType;
  description: string;
  systemName?: string;
  lifecycleStatus: LifecycleStatus;
  dataSource?: DataSourceType;
  dldcDatabase?: string;
  dldcTable?: string;
  dldcColumns?: string[];
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

const REL_TYPE_LABELS: Record<WizardRelType, string> = {
  '1-1': '1 - 1 (Một - Một)',
  '1-n': '1 - n (Một - Nhiều)',
  'n-1': 'n - 1 (Nhiều - Một)',
  'n-n': 'n - n (Nhiều - Nhiều)',
};

const REL_TYPE_COLORS: Record<WizardRelType, string> = {
  '1-1': 'bg-teal-50 text-teal-700 border-teal-200',
  '1-n': 'bg-blue-50 text-blue-700 border-blue-200',
  'n-1': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'n-n': 'bg-purple-50 text-purple-700 border-purple-200',
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
  { number: 2, title: 'Định danh duy nhất', description: 'Thiết lập quy tắc mã định danh' },
  { number: 3, title: 'Tạo thuộc tính', description: 'Định nghĩa các trường dữ liệu' },
  { number: 4, title: 'Quy tắc hợp nhất', description: 'Thiết lập quy tắc merge dữ liệu' },
  { number: 5, title: 'Thiết lập quan hệ', description: 'Liên kết giữa các thực thể' },
  { number: 6, title: 'Phê duyệt', description: 'Xem lại và gửi phê duyệt' },
];

export function MasterDataWizard({ isOpen, onClose, onSubmit }: MasterDataWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({
    code: '',
    name: '',
    dataType: 'individual',
    managingAgency: '',
    scope: 'national',
    description: '',
    systemName: '',
    lifecycleStatus: 'draft',
    dataSource: 'dldc',
    dldcDatabase: '',
    attributes: [],
    mergeRules: [],
    relationships: [],
    approvalReviewer: '',
    approvalNotes: ''
  });

  const [currentAttribute, setCurrentAttribute] = useState<AttributeForm>({
    fieldName: '',
    displayName: '',
    dataType: 'string',
    required: false,
    unique: false,
    indexed: false
  });

  // Step 5 state — Thiết lập quan hệ
  const [relFormOpen, setRelFormOpen] = useState(false);
  const [editingRelId, setEditingRelId] = useState<string | null>(null);
  const [relFormData, setRelFormData] = useState<RelFormData>(EMPTY_REL_FORM);
  const [relFormError, setRelFormError] = useState('');
  const [relSearch, setRelSearch] = useState('');

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

  // Step 3 (old step 2) state — Matching/Extraction/Merge
  const [matchingRules, setMatchingRules] = useState<MatchingRule[]>([]);
  const [extractionRules, setExtractionRules] = useState<ExtractionRule[]>([]);
  const [mergeConfig, setMergeConfig] = useState<MergeConfig>({
    keepSourceRef: true,
    mergeTrigger: 'approval',
    minMatchScore: 80,
  });

  // DLDC step 2 state
  const [dldcDatabase, setDldcDatabase] = useState('');
  const [useJoin, setUseJoin] = useState(false);
  const [dldcJoins, setDldcJoins] = useState<DldcJoin[]>([]);
  const [dldcFieldRows, setDldcFieldRows] = useState<DldcFieldRow[]>([]);

  const handleDldcDatabaseChange = (dbId: string) => {
    setDldcDatabase(dbId);
    setDldcJoins([]);
    setDldcFieldRows([]);
    setWizardData({ ...wizardData, dldcDatabase: dbId, dldcTable: '', dldcColumns: [] });
  };

  const handleDldcTableChange = (tableId: string) => {
    setDldcJoins([]);
    const fields = DLDC_FIELDS[tableId] || [];
    const rows: DldcFieldRow[] = fields.map((f, i) => ({
      id: `fr-${i}`, shared: true, isPK: i === 0,
      tableId, sourceJoinId: null,
      columnName: f.fieldName, displayName: f.displayName, dataType: f.dataType,
    }));
    setDldcFieldRows(rows);
    setWizardData({ ...wizardData, dldcDatabase, dldcTable: tableId, dldcColumns: fields.map(f => f.fieldName) });
  };

  const handleDldcAddJoin = () => {
    const alias = `t${dldcJoins.length + 2}`;
    setDldcJoins(prev => [...prev, { id: `j-${prev.length}`, joinType: 'LEFT JOIN', tableId: '', alias, leftField: '', rightField: '' }]);
  };

  const handleDldcJoinTableChange = (joinId: string, newTableId: string) => {
    setDldcJoins(prev => prev.map(j => j.id === joinId ? { ...j, tableId: newTableId, leftField: '', rightField: '' } : j));
    setDldcFieldRows(prev => {
      const withoutOld = prev.filter(r => r.sourceJoinId !== joinId);
      if (!newTableId) return withoutOld;
      const newRows: DldcFieldRow[] = (DLDC_FIELDS[newTableId] || []).map((f, i) => ({
        id: `fr-join-${joinId}-${i}`, shared: true, isPK: false,
        tableId: newTableId, sourceJoinId: joinId,
        columnName: f.fieldName, displayName: f.displayName, dataType: f.dataType,
      }));
      return [...withoutOld, ...newRows];
    });
  };

  const handleDldcRemoveJoin = (joinId: string) => {
    setDldcJoins(prev => prev.filter(j => j.id !== joinId));
    setDldcFieldRows(prev => prev.filter(r => r.sourceJoinId !== joinId));
  };

  const handleDldcFieldToggle = (rowId: string, field: 'shared' | 'isPK') => {
    setDldcFieldRows(prev => prev.map(r => r.id === rowId ? { ...r, [field]: !r[field] } : r));
  };

  const handleDldcRemoveRow = (rowId: string) => {
    setDldcFieldRows(prev => prev.filter(r => r.id !== rowId));
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

  const availableFields = wizardData.dataSource === 'dldc'
    ? dldcFieldRows.filter(r => r.shared).map(r => ({ fieldName: r.columnName, displayName: r.displayName }))
    : wizardData.attributes.map(a => ({ fieldName: a.fieldName, displayName: a.displayName }));

  const sourceEntityFields = [
    ...(wizardData.dataSource === 'dldc'
      ? dldcFieldRows.filter(r => r.shared).map(r => ({ name: r.columnName, label: r.displayName }))
      : wizardData.attributes.map(a => ({ name: a.fieldName, label: a.displayName }))),
    ...(identifierConfig.prefix ? [{ name: 'identifier_code', label: 'Mã định danh' }] : []),
  ];

  const availableSources: { id: string; label: string }[] = wizardData.dataSource === 'dldc'
    ? [
        { id: wizardData.dldcTable || 'primary', label: DLDC_TABLES[dldcDatabase]?.find(t => t.id === wizardData.dldcTable)?.displayName || 'Bảng chính' },
        ...dldcJoins.filter(j => j.tableId).map(j => ({
          id: j.tableId,
          label: DLDC_TABLES[dldcDatabase]?.find(t => t.id === j.tableId)?.displayName || j.alias,
        })),
      ]
    : [{ id: 'manual', label: 'Nhập thủ công' }];

  const handleNext = () => {
    // Validation for each step
    if (currentStep === 1) {
      if (!wizardData.code?.trim() || !wizardData.name || !wizardData.managingAgency) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc ở bước 1');
        return;
      }
    }
    if (currentStep === 3) {
      if (wizardData.dataSource === 'dldc') {
        if (!wizardData.dldcTable) {
          alert('Vui lòng chọn cơ sở dữ liệu và bảng dữ liệu chính');
          return;
        }
      } else {
        if (wizardData.attributes.length === 0) {
          alert('Vui lòng thêm ít nhất 1 thuộc tính');
          return;
        }
      }
      // Auto-populate extraction rules from available fields
      if (extractionRules.length === 0 && availableFields.length > 0) {
        setExtractionRules(availableFields.map((f, i) => ({
          id: `er-${i}`,
          fieldName: f.fieldName,
          primarySource: availableSources[0]?.id || '',
          fallbackSource: availableSources[1]?.id || '',
          conflictStrategy: 'priority' as ConflictStrategy,
        })));
      }
    }

    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitWizard = () => {
    if (!wizardData.approvalNotes) {
      alert('Vui lòng nhập ghi chú phê duyệt');
      return;
    }
    onSubmit(wizardData);
    onClose();
  };

  const handleAddAttribute = () => {
    if (!currentAttribute.fieldName || !currentAttribute.displayName) {
      alert('Vui lòng điền tên trường và tên hiển thị');
      return;
    }

    // Check duplicate
    if (wizardData.attributes.some(a => a.fieldName === currentAttribute.fieldName)) {
      alert('Tên trường đã tồn tại');
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
      unique: false,
      indexed: false
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
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl text-slate-900">Tạo mới dữ liệu chủ</h2>
            <p className="text-[13px] text-slate-600 mt-1">Quy trình 6 bước</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded" title="Đóng" aria-label="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-[13px] transition-colors ${currentStep > step.number
                      ? 'bg-green-600 text-white'
                      : currentStep === step.number
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                      }`}
                  >
                    {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
                  </div>
                  <p
                    className={`text-[13px] mt-2 text-center ${currentStep === step.number ? 'text-blue-600' : 'text-slate-600'
                      }`}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-slate-200 mx-2 mt-[-30px]" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Khởi tạo dữ liệu chủ */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="text-[13px] font-semibold text-blue-900 mb-1">Bước 1: Khởi tạo dữ liệu chủ</h3>
                <p className="text-[13px] text-blue-700">
                  Nhập thông tin cơ bản và cấu hình nguồn dữ liệu cho thực thể dữ liệu chủ
                </p>
              </div>

              {/* Mã thực thể */}
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Mã thực thể <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={wizardData.code || ''}
                  onChange={(e) => setWizardData({ ...wizardData, code: e.target.value })}
                  placeholder="VD: MD-CITIZEN-001"
                  className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700"
                />
              </div>

              {/* Tên dữ liệu chủ */}
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Tên dữ liệu chủ <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={wizardData.name}
                  onChange={(e) => setWizardData({ ...wizardData, name: e.target.value })}
                  placeholder="VD: Bộ dữ liệu chủ Công dân"
                  className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700"
                />
              </div>

              {/* Loại thực thể + Phạm vi */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Loại thực thể <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={wizardData.dataType}
                    onChange={(e) => setWizardData({ ...wizardData, dataType: e.target.value as DataType })}
                    className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 cursor-pointer"
                  >
                    <option value="individual">Thực thể Cá nhân</option>
                    <option value="organization">Thực thể Tổ chức</option>
                    <option value="legal">Thực thể Văn bản/Sự kiện pháp lý</option>
                    <option value="asset">Thực thể Tài sản</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Phạm vi sử dụng <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={wizardData.scope}
                    onChange={(e) => setWizardData({ ...wizardData, scope: e.target.value as ScopeType })}
                    className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 cursor-pointer"
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
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Đơn vị chủ quản <span className="text-red-600">*</span>
                </label>
                <select
                  value={wizardData.managingAgency}
                  onChange={(e) => setWizardData({ ...wizardData, managingAgency: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 cursor-pointer"
                >
                  <option value="">-- Chọn đơn vị chủ quản --</option>
                  {MANAGING_UNITS.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              {/* Mô tả đối tượng */}
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Mô tả đối tượng</label>
                <textarea
                  value={wizardData.description}
                  onChange={(e) => setWizardData({ ...wizardData, description: e.target.value })}
                  placeholder="Mô tả tóm tắt về đối tượng dữ liệu chủ này..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 resize-none"
                />
              </div>

              {/* Tên cơ sở dữ liệu / Hệ thống */}
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Tên cơ sở dữ liệu / Hệ thống
                </label>
                <input
                  type="text"
                  value={wizardData.systemName || ''}
                  onChange={(e) => setWizardData({ ...wizardData, systemName: e.target.value })}
                  placeholder="VD: CSDL hộ tịch điện tử, Hệ thống TGPL..."
                  className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700"
                />
              </div>

              {/* Trạng thái vòng đời */}
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Trạng thái vòng đời
                </label>
                <select
                  value={wizardData.lifecycleStatus}
                  onChange={(e) => setWizardData({ ...wizardData, lifecycleStatus: e.target.value as LifecycleStatus })}
                  className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 cursor-pointer"
                >
                  <option value="draft">Đang soạn thảo</option>
                  <option value="active">Đã hiệu lực</option>
                  <option value="inactive">Ngừng sử dụng</option>
                  <option value="archived">Đã lưu trữ</option>
                </select>
              </div>

              {/* Cấu hình nguồn dữ liệu */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-[13px] font-bold text-slate-900 mb-3">Cấu hình nguồn dữ liệu</h4>

                <div className="mb-4">
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Nguồn dữ liệu <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={wizardData.dataSource}
                    onChange={(e) => setWizardData({ ...wizardData, dataSource: e.target.value as DataSourceType })}
                    className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 cursor-pointer"
                  >
                    <option value="dldc">Từ Kho DLDC</option>
                    <option value="manual">Nhập thủ công</option>
                  </select>
                </div>

                {wizardData.dataSource === 'dldc' && (
                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                    <p className="text-[13px] text-blue-700">
                      ℹ️ Cấu hình cơ sở dữ liệu, bảng chính và các trường dữ liệu sẽ được thực hiện ở <strong>Bước 2</strong>.
                    </p>
                  </div>
                )}

                {wizardData.dataSource === 'manual' && (
                  <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-4">
                    <p className="text-[13px] text-amber-800">
                      ℹ️ Dữ liệu sẽ được nhập thủ công bởi người dùng có quyền. Không cần cấu hình nguồn tự động.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Định danh duy nhất */}
          {currentStep === 2 && (() => {
            const sep = identifierConfig.separator === 'none' ? '' : identifierConfig.separator;
            const paddedNum = String(identifierConfig.startFrom).padStart(identifierConfig.digits, '0');
            const previewCode = [
              identifierConfig.prefix,
              paddedNum,
              identifierConfig.suffix,
            ].filter(Boolean).join(sep);
            return (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-[13px] font-semibold text-blue-900 mb-1">Bước 2: Định danh duy nhất</h3>
                  <p className="text-[13px] text-blue-700">
                    Thiết lập cấu trúc mã định danh toàn cục cho từng bản ghi của thực thể này
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  {/* Left — form */}
                  <div className="space-y-5">
                    <div className="border border-slate-200 rounded-xl p-5 space-y-5 bg-white">
                      <h4 className="text-[13px] font-bold text-slate-800">Cấu trúc mã định danh</h4>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-medium text-slate-700 mb-2">Tiền tố (Prefix)</label>
                          <input
                            type="text"
                            value={identifierConfig.prefix}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setIdentifierConfig(prev => ({ ...prev, prefix: e.target.value.toUpperCase() }))}
                            placeholder="VD: NDAN, ORG"
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 uppercase"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-slate-700 mb-2">Hậu tố (Suffix)</label>
                          <input
                            type="text"
                            value={identifierConfig.suffix}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setIdentifierConfig(prev => ({ ...prev, suffix: e.target.value.toUpperCase() }))}
                            placeholder="Để trống nếu không dùng"
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 uppercase"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-medium text-slate-700 mb-2">Ký tự phân cách</label>
                          <select
                            value={identifierConfig.separator}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setIdentifierConfig(prev => ({ ...prev, separator: e.target.value as SeparatorType }))}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
                          >
                            <option value="none">Không dùng</option>
                            <option value="-">Gạch ngang ( - )</option>
                            <option value=".">Dấu chấm ( . )</option>
                            <option value="/">Dấu gạch chéo ( / )</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-slate-700 mb-2">Độ dài số thứ tự</label>
                          <input
                            type="number" min={1} max={12}
                            value={identifierConfig.digits}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setIdentifierConfig(prev => ({ ...prev, digits: Number(e.target.value) }))}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-5 space-y-5 bg-white">
                      <h4 className="text-[13px] font-bold text-slate-800">Số tự tăng</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-medium text-slate-700 mb-2">Bắt đầu từ</label>
                          <input
                            type="number" min={0}
                            value={identifierConfig.startFrom}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setIdentifierConfig(prev => ({ ...prev, startFrom: Number(e.target.value) }))}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-slate-700 mb-2">Bước tăng</label>
                          <input
                            type="number" min={1}
                            value={identifierConfig.increment}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setIdentifierConfig(prev => ({ ...prev, increment: Number(e.target.value) }))}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                          />
                        </div>
                      </div>
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer select-none border border-slate-200 rounded-xl p-5 bg-white">
                      <input
                        type="checkbox"
                        checked={identifierConfig.checkDuplicate}
                        onChange={() => setIdentifierConfig(prev => ({ ...prev, checkDuplicate: !prev.checkDuplicate }))}
                        className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer w-4 h-4 flex-shrink-0"
                      />
                      <div>
                        <p className="text-[13px] font-medium text-slate-700">Kiểm tra trùng lặp khi tạo mới</p>
                        <p className="text-[13px] text-slate-500 mt-1">Hệ thống từ chối tạo bản ghi nếu mã định danh đã tồn tại</p>
                      </div>
                    </label>
                  </div>

                  {/* Right — preview */}
                  <div className="space-y-5">
                    <div className="border border-blue-200 rounded-xl p-5 bg-blue-50 space-y-5">
                      <h4 className="text-[13px] font-bold text-blue-900">Mẫu mã định danh</h4>

                      <div className="bg-white border border-blue-200 rounded-lg px-6 py-7 text-center">
                        {previewCode ? (
                          <code className="text-2xl font-mono font-bold text-blue-700 tracking-widest">
                            {previewCode}
                          </code>
                        ) : (
                          <span className="text-[13px] text-slate-400">Nhập tiền tố để xem mẫu mã</span>
                        )}
                      </div>

                      <div className="space-y-3 text-[13px]">
                        <div className="flex justify-between items-center py-1.5 border-b border-blue-100">
                          <span className="text-slate-600">Mã thứ 1:</span>
                          <code className="font-mono font-semibold text-slate-800">
                            {[identifierConfig.prefix, String(identifierConfig.startFrom).padStart(identifierConfig.digits, '0'), identifierConfig.suffix].filter(Boolean).join(sep) || '—'}
                          </code>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b border-blue-100">
                          <span className="text-slate-600">Mã thứ 2:</span>
                          <code className="font-mono font-semibold text-slate-800">
                            {[identifierConfig.prefix, String(identifierConfig.startFrom + identifierConfig.increment).padStart(identifierConfig.digits, '0'), identifierConfig.suffix].filter(Boolean).join(sep) || '—'}
                          </code>
                        </div>
                        <div className="flex justify-between items-center py-1.5">
                          <span className="text-slate-600">Mã thứ 3:</span>
                          <code className="font-mono font-semibold text-slate-800">
                            {[identifierConfig.prefix, String(identifierConfig.startFrom + identifierConfig.increment * 2).padStart(identifierConfig.digits, '0'), identifierConfig.suffix].filter(Boolean).join(sep) || '—'}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
                      <h4 className="text-[13px] font-bold text-slate-800">Tóm tắt cấu hình</h4>
                      <div className="space-y-2.5 text-[13px]">
                        <div className="flex justify-between items-center"><span className="text-slate-500">Tiền tố:</span><span className="font-medium text-slate-800">{identifierConfig.prefix || '(không có)'}</span></div>
                        <div className="flex justify-between items-center"><span className="text-slate-500">Ký tự phân cách:</span><span className="font-medium text-slate-800">{identifierConfig.separator === 'none' ? 'Không dùng' : `"${identifierConfig.separator}"`}</span></div>
                        <div className="flex justify-between items-center"><span className="text-slate-500">Độ dài số:</span><span className="font-medium text-slate-800">{identifierConfig.digits} chữ số</span></div>
                        <div className="flex justify-between items-center"><span className="text-slate-500">Bắt đầu từ:</span><span className="font-medium text-slate-800">{identifierConfig.startFrom}</span></div>
                        <div className="flex justify-between items-center"><span className="text-slate-500">Bước tăng:</span><span className="font-medium text-slate-800">{identifierConfig.increment}</span></div>
                        <div className="flex justify-between items-center"><span className="text-slate-500">Kiểm tra trùng:</span><span className={`font-medium ${identifierConfig.checkDuplicate ? 'text-green-700' : 'text-slate-500'}`}>{identifierConfig.checkDuplicate ? 'Bật' : 'Tắt'}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Step 3: Tạo thuộc tính */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="text-[13px] font-semibold text-blue-900 mb-1">Bước 3: Tạo thuộc tính</h3>
                <p className="text-[13px] text-blue-700">
                  Định nghĩa các trường dữ liệu cho thực thể <strong>{wizardData.name || 'dữ liệu chủ'}</strong>
                </p>
              </div>

              {/* ── DLDC mode ── */}
              {wizardData.dataSource === 'dldc' && (
                <div className="space-y-4">
                  {/* Cấu hình nguồn dữ liệu card */}
                  <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
                    <div className="px-5 py-3.5 bg-blue-600 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-white" />
                        <p className="text-[13px] font-semibold text-white">Cấu hình nguồn dữ liệu</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUseJoin(v => !v)}
                        className="flex items-center gap-2 text-white text-[13px] cursor-pointer"
                      >
                        <span>Sử dụng liên kết bảng (Join)</span>
                        <div className={`relative inline-flex h-5 w-9 items-center rounded-full border border-white/40 transition-colors ${useJoin ? 'bg-white/30' : 'bg-blue-500'}`}>
                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${useJoin ? 'translate-x-4' : 'translate-x-0.5'}`} />
                        </div>
                      </button>
                    </div>

                    {/* Info row — shown after table selected */}
                    {dldcDatabase && wizardData.dldcTable && (
                      <div className="px-5 py-2.5 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
                        <Database className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                        <p className="text-[13px] text-blue-700">
                          Kho dữ liệu: <span className="font-medium">{DLDC_DATABASES.find(d => d.id === dldcDatabase)?.label}</span>
                          {' — '}
                          <span className="font-medium">{DLDC_TABLES[dldcDatabase]?.find(t => t.id === wizardData.dldcTable)?.displayName}</span>
                        </p>
                      </div>
                    )}

                    <div className="p-5 space-y-4">
                      {/* CSDL selector */}
                      <div className="space-y-1.5">
                        <label className="block text-[13px] font-medium text-slate-600">Cơ sở dữ liệu <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <select
                            title="Chọn cơ sở dữ liệu"
                            value={dldcDatabase}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleDldcDatabaseChange(e.target.value)}
                            className="w-full pl-3 pr-8 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                          >
                            <option value="">-- Chọn cơ sở dữ liệu --</option>
                            {DLDC_DATABASES.map(db => (
                              <option key={db.id} value={db.id}>{db.label}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Primary table */}
                      {dldcDatabase && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="block text-[13px] font-medium text-slate-600">Bảng dữ liệu chính <span className="text-red-500">*</span></label>
                            <span className="text-[13px] text-blue-500 font-medium italic">Primary Table</span>
                          </div>
                          <div className="relative">
                            <select
                              title="Chọn bảng dữ liệu chính"
                              value={wizardData.dldcTable || ''}
                              onChange={(e: ChangeEvent<HTMLSelectElement>) => handleDldcTableChange(e.target.value)}
                              className="w-full pl-3 pr-8 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                            >
                              <option value="">-- Chọn bảng dữ liệu --</option>
                              {(DLDC_TABLES[dldcDatabase] || []).map(t => (
                                <option key={t.id} value={t.id}>{t.displayName} ({t.id})</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                      )}

                      {/* Join tables */}
                      {useJoin && wizardData.dldcTable && (
                        <div className="space-y-3 pt-2 border-t border-slate-100">
                          <div className="flex items-center justify-between">
                            <p className="text-[13px] font-semibold text-slate-700">Bảng liên kết bổ sung ({dldcJoins.length})</p>
                            <button
                              type="button"
                              onClick={handleDldcAddJoin}
                              className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 text-blue-600 text-[13px] font-medium rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Thêm bảng liên kết
                            </button>
                          </div>
                          {dldcJoins.map((join, idx) => {
                            const joinTableFields = join.tableId ? (DLDC_FIELDS[join.tableId] || []) : [];
                            const primaryFields = wizardData.dldcTable ? (DLDC_FIELDS[wizardData.dldcTable] || []) : [];
                            return (
                              <div key={join.id} className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/50">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[13px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">BẢNG LIÊN KẾT #{idx + 1}</span>
                                    <span className="text-[13px] text-slate-500">Alias: {join.alias}</span>
                                  </div>
                                  <button type="button" onClick={() => handleDldcRemoveJoin(join.id)} className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-1.5">
                                    <label className="block text-[13px] font-medium text-slate-600">Kiểu liên kết</label>
                                    <div className="relative">
                                      <select
                                        title="Kiểu liên kết"
                                        value={join.joinType}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                          setDldcJoins(prev => prev.map(j => j.id === join.id ? { ...j, joinType: e.target.value as DldcJoin['joinType'] } : j))
                                        }
                                        className="w-full pl-3 pr-8 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                                      >
                                        <option value="LEFT JOIN">LEFT JOIN</option>
                                        <option value="INNER JOIN">INNER JOIN</option>
                                        <option value="RIGHT JOIN">RIGHT JOIN</option>
                                      </select>
                                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="block text-[13px] font-medium text-slate-600">Bảng dữ liệu bổ sung</label>
                                    <div className="relative">
                                      <select
                                        title="Bảng dữ liệu bổ sung"
                                        value={join.tableId}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) => handleDldcJoinTableChange(join.id, e.target.value)}
                                        className="w-full pl-3 pr-8 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                                      >
                                        <option value="">-- Chọn bảng --</option>
                                        {dldcDatabase && (DLDC_TABLES[dldcDatabase] || [])
                                          .filter(t => t.id !== wizardData.dldcTable)
                                          .map(t => <option key={t.id} value={t.id}>{t.displayName} ({t.id})</option>)}
                                      </select>
                                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-[13px] font-medium text-slate-600">Điều kiện liên kết (Join Condition)</label>
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 relative">
                                      <select
                                        title="Trường bảng liên kết"
                                        value={join.leftField}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                          setDldcJoins(prev => prev.map(j => j.id === join.id ? { ...j, leftField: e.target.value } : j))
                                        }
                                        className="w-full pl-3 pr-8 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                                      >
                                        <option value="">-- {join.alias}.field --</option>
                                        {joinTableFields.map(f => <option key={f.fieldName} value={`${join.alias}.${f.fieldName}`}>{join.alias}.{f.fieldName}</option>)}
                                      </select>
                                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                    <div className="w-8 h-9 flex items-center justify-center bg-slate-100 rounded-lg border border-slate-200 text-slate-600 font-bold text-[13px] flex-shrink-0">=</div>
                                    <div className="flex-1 relative">
                                      <select
                                        title="Trường bảng chính"
                                        value={join.rightField}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                          setDldcJoins(prev => prev.map(j => j.id === join.id ? { ...j, rightField: e.target.value } : j))
                                        }
                                        className="w-full pl-3 pr-8 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                                      >
                                        <option value="">-- {wizardData.dldcTable || 'table'}.field --</option>
                                        {primaryFields.map(f => <option key={f.fieldName} value={`${wizardData.dldcTable}.${f.fieldName}`}>{wizardData.dldcTable}.{f.fieldName}</option>)}
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

                  {/* Field selection table */}
                  {wizardData.dldcTable && (
                    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
                      <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-500" />
                          <p className="text-[13px] font-semibold text-slate-700">Chọn trường dữ liệu chia sẻ</p>
                          <span className="text-[13px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                            {dldcFieldRows.filter(r => r.shared).length}/{dldcFieldRows.length} trường được chọn
                          </span>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[13px]">
                          <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                              <th className="px-3 py-3 text-[13px] font-semibold text-slate-500 text-center w-16">Chia sẻ</th>
                              <th className="px-3 py-3 text-[13px] font-semibold text-slate-500 text-center w-12">PK</th>
                              <th className="px-3 py-3 text-[13px] font-semibold text-slate-500">Nguồn (Table)</th>
                              <th className="px-3 py-3 text-[13px] font-semibold text-slate-500">Trường gốc (Column)</th>
                              <th className="px-3 py-3 text-[13px] font-semibold text-slate-500">Tên hiển thị</th>
                              <th className="px-3 py-3 text-[13px] font-semibold text-slate-500">Kiểu dữ liệu</th>
                              <th className="px-3 py-3 text-[13px] font-semibold text-slate-500 text-center w-12">Xóa</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {dldcFieldRows.length === 0 ? (
                              <tr>
                                <td colSpan={7} className="px-5 py-8 text-center text-[13px] text-slate-400">
                                  Chọn bảng dữ liệu để tải danh sách trường
                                </td>
                              </tr>
                            ) : (
                              dldcFieldRows.map(row => (
                                <tr key={row.id} className={`transition-colors ${row.shared ? '' : 'opacity-40'}`}>
                                  <td className="px-3 py-2.5 text-center">
                                    <input
                                      type="checkbox"
                                      checked={row.shared}
                                      onChange={() => handleDldcFieldToggle(row.id, 'shared')}
                                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                                    />
                                  </td>
                                  <td className="px-3 py-2.5 text-center">
                                    <input
                                      type="checkbox"
                                      checked={row.isPK}
                                      onChange={() => handleDldcFieldToggle(row.id, 'isPK')}
                                      className="rounded border-slate-300 text-amber-600 focus:ring-amber-500/20 cursor-pointer"
                                    />
                                  </td>
                                  <td className="px-2 py-1.5">
                                    <select
                                      value={row.tableId}
                                      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                        const newTableId = e.target.value;
                                        setDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, tableId: newTableId, columnName: '' } : r));
                                      }}
                                      className="w-full text-[13px] border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                                    >
                                      {(DLDC_TABLES[dldcDatabase] || []).map(t => (
                                        <option key={t.id} value={t.id}>{t.displayName}</option>
                                      ))}
                                    </select>
                                  </td>
                                  <td className="px-2 py-1.5">
                                    <select
                                      value={row.columnName}
                                      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                        const colName = e.target.value;
                                        const fieldDef = (DLDC_FIELDS[row.tableId] || []).find(f => f.fieldName === colName);
                                        setDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, columnName: colName, dataType: fieldDef?.dataType || r.dataType } : r));
                                      }}
                                      className="w-full text-[13px] border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                                    >
                                      <option value="">-- Chọn --</option>
                                      {(DLDC_FIELDS[row.tableId] || []).map(f => (
                                        <option key={f.fieldName} value={f.fieldName}>{f.fieldName}</option>
                                      ))}
                                    </select>
                                  </td>
                                  <td className="px-2 py-1.5">
                                    <input
                                      type="text"
                                      value={row.displayName}
                                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, displayName: e.target.value } : r))}
                                      className="w-full text-[13px] border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                                      placeholder="Tên hiển thị"
                                    />
                                  </td>
                                  <td className="px-2 py-1.5">
                                    <select
                                      value={row.dataType}
                                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, dataType: e.target.value as FieldDataType } : r))}
                                      className="w-full text-[13px] border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                                    >
                                      {FIELD_DATA_TYPES.map(dt => (
                                        <option key={dt.value} value={dt.value}>{dt.label}</option>
                                      ))}
                                    </select>
                                  </td>
                                  <td className="px-3 py-2.5 text-center">
                                    <button type="button" onClick={() => handleDldcRemoveRow(row.id)} className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
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
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                    <h4 className="text-[13px] font-bold text-slate-900 mb-3">Thêm thuộc tính mới</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Tên trường <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={currentAttribute.fieldName}
                          onChange={(e) => setCurrentAttribute({ ...currentAttribute, fieldName: e.target.value.toLowerCase() })}
                          placeholder="citizen_id"
                          className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Tên hiển thị <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={currentAttribute.displayName}
                          onChange={(e) => setCurrentAttribute({ ...currentAttribute, displayName: e.target.value })}
                          placeholder="Số CCCD"
                          className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Kiểu dữ liệu</label>
                        <div className="relative">
                          <select
                            value={currentAttribute.dataType}
                            onChange={(e) => setCurrentAttribute({ ...currentAttribute, dataType: e.target.value as FieldDataType })}
                            className="w-full pl-3 pr-8 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
                          >
                            <option value="string">String</option>
                            <option value="number">Number</option>
                            <option value="date">Date</option>
                            <option value="datetime">Datetime</option>
                            <option value="boolean">Boolean</option>
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Độ dài</label>
                        <input
                          type="number"
                          value={currentAttribute.length || ''}
                          onChange={(e) => setCurrentAttribute({ ...currentAttribute, length: parseInt(e.target.value) || undefined })}
                          placeholder="255"
                          className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 mt-3">
                      <label className="flex items-center gap-2 text-[13px] cursor-pointer">
                        <input type="checkbox" checked={currentAttribute.required}
                          onChange={(e) => setCurrentAttribute({ ...currentAttribute, required: e.target.checked })}
                          className="rounded border-slate-300 text-blue-600" />
                        Bắt buộc
                      </label>
                      <label className="flex items-center gap-2 text-[13px] cursor-pointer">
                        <input type="checkbox" checked={currentAttribute.unique}
                          onChange={(e) => setCurrentAttribute({ ...currentAttribute, unique: e.target.checked })}
                          className="rounded border-slate-300 text-blue-600" />
                        Duy nhất
                      </label>
                      <label className="flex items-center gap-2 text-[13px] cursor-pointer">
                        <input type="checkbox" checked={currentAttribute.indexed}
                          onChange={(e) => setCurrentAttribute({ ...currentAttribute, indexed: e.target.checked })}
                          className="rounded border-slate-300 text-blue-600" />
                        Index
                      </label>
                    </div>
                    <button
                      onClick={handleAddAttribute}
                      className="mt-3 flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-[13px] font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm thuộc tính
                    </button>
                  </div>

                  {/* Attributes List */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <p className="text-[13px] font-semibold text-slate-700">Danh sách thuộc tính</p>
                      <span className="text-[13px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">{wizardData.attributes.length} trường</span>
                    </div>
                    {wizardData.attributes.length === 0 ? (
                      <div className="p-8 text-center text-[13px] text-slate-400">
                        Chưa có thuộc tính nào. Vui lòng thêm ít nhất 1 thuộc tính.
                      </div>
                    ) : (
                      <table className="w-full text-[13px]">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr>
                            <th className="text-left px-4 py-3 text-[13px] font-semibold text-slate-600">Tên trường</th>
                            <th className="text-left px-4 py-3 text-[13px] font-semibold text-slate-600">Tên hiển thị</th>
                            <th className="text-left px-4 py-3 text-[13px] font-semibold text-slate-600">Kiểu</th>
                            <th className="text-left px-4 py-3 text-[13px] font-semibold text-slate-600">Ràng buộc</th>
                            <th className="text-right px-4 py-3 text-[13px] font-semibold text-slate-600">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {wizardData.attributes.map((attr, index) => (
                            <tr key={index} className="hover:bg-slate-50/50">
                              <td className="px-4 py-2.5">
                                <code className="text-[13px] bg-slate-100 px-2 py-0.5 rounded font-mono">{attr.fieldName}</code>
                              </td>
                              <td className="px-4 py-2.5 text-slate-700">{attr.displayName}</td>
                              <td className="px-4 py-2.5">
                                <span className="text-[13px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-mono">{attr.dataType}</span>
                              </td>
                              <td className="px-4 py-2.5">
                                <div className="flex gap-1">
                                  {attr.required && <span className="text-[13px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded">Required</span>}
                                  {attr.unique && <span className="text-[13px] px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded">Unique</span>}
                                </div>
                              </td>
                              <td className="px-4 py-2.5 text-right">
                                <button onClick={() => handleDeleteAttribute(index)} className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Quy tắc hợp nhất */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-[13px] font-semibold text-blue-900 mb-1">Bước 3: Quy tắc hợp nhất dữ liệu</h3>
                <p className="text-[13px] text-blue-700">
                  Định nghĩa 3 lớp quy tắc để phát hiện, trích rút và hợp nhất dữ liệu từ nhiều nguồn
                </p>
              </div>

              {/* ── Lớp 1: Matching Rules ── */}
              <div className="border border-blue-200 rounded-xl overflow-hidden">
                <div className="bg-blue-50 px-4 py-3 flex items-center gap-3 border-b border-blue-200">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[13px] font-bold flex items-center justify-center flex-shrink-0">1</span>
                  <div>
                    <p className="text-[13px] font-semibold text-blue-800">Lớp 1 — Quy tắc so khớp (Matching Rules)</p>
                    <p className="text-[13px] text-blue-500">Xác định khi nào hai bản ghi từ hai nguồn khác nhau được coi là cùng một thực thể</p>
                  </div>
                </div>
                <div className="p-4 space-y-4 bg-white">
                  <div className="flex items-center gap-3">
                    <label className="text-[13px] font-medium text-slate-700 whitespace-nowrap">Tỷ lệ khớp tối thiểu để hệ thống tự động gộp bản ghi:</label>
                    <input
                      type="number" min={0} max={100}
                      value={mergeConfig.minMatchScore}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setMergeConfig(prev => ({ ...prev, minMatchScore: Number(e.target.value) }))}
                      className="w-20 border border-slate-200 rounded-lg px-3 py-1.5 text-[13px] text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                    />
                    <span className="text-[13px] text-slate-500">%</span>
                  </div>

                  <div className="border border-slate-100 rounded-lg overflow-hidden">
                    <table className="w-full text-[13px]">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                          <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Trường đối chiếu</th>
                          <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Phương pháp</th>
                          <th className="px-3 py-2.5 text-center text-[13px] font-semibold text-slate-500 w-32">Tỷ lệ khớp tối thiểu (%)</th>
                          <th className="px-3 py-2.5 text-center text-[13px] font-semibold text-slate-500 w-24">Chuẩn hóa</th>
                          <th className="px-3 py-2.5 text-center text-[13px] font-semibold text-slate-500 w-36">Điều kiện kết hợp</th>
                          <th className="px-3 py-2.5 text-center text-[13px] font-semibold text-slate-500 w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 bg-white">
                        {matchingRules.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-4 py-6 text-center text-[13px] text-slate-400">
                              Chưa có quy tắc — nhấn "+ Thêm quy tắc" để bắt đầu
                            </td>
                          </tr>
                        ) : (
                          matchingRules.map((rule, idx) => (
                            <tr key={rule.id}>
                              <td className="px-2 py-1.5">
                                <select
                                  value={rule.fieldName}
                                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setMatchingRules(prev => prev.map(r => r.id === rule.id ? { ...r, fieldName: e.target.value } : r))}
                                  className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                                >
                                  <option value="">-- Chọn trường --</option>
                                  {availableFields.map(f => (
                                    <option key={f.fieldName} value={f.fieldName}>{f.displayName} ({f.fieldName})</option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-2 py-1.5">
                                <select
                                  value={rule.method}
                                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setMatchingRules(prev => prev.map(r => r.id === rule.id ? { ...r, method: e.target.value as MatchMethod } : r))}
                                  className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                                >
                                  <option value="exact">Khớp chính xác (Exact)</option>
                                  <option value="fuzzy">Khớp gần đúng (Fuzzy)</option>
                                </select>
                              </td>
                              <td className="px-2 py-1.5 text-center">
                                {rule.method === 'fuzzy' ? (
                                  <input
                                    type="number" min={0} max={100}
                                    value={rule.fuzzyThreshold}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setMatchingRules(prev => prev.map(r => r.id === rule.id ? { ...r, fuzzyThreshold: Number(e.target.value) } : r))}
                                    className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                  />
                                ) : (
                                  <span className="text-slate-400">—</span>
                                )}
                              </td>
                              <td className="px-2 py-1.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={rule.normalize}
                                  onChange={() => setMatchingRules(prev => prev.map(r => r.id === rule.id ? { ...r, normalize: !r.normalize } : r))}
                                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                                />
                              </td>
                              <td className="px-2 py-1.5 text-center">
                                {idx < matchingRules.length - 1 ? (
                                  <select
                                    value={rule.operator}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setMatchingRules(prev => prev.map(r => r.id === rule.id ? { ...r, operator: e.target.value as ConditionOperator } : r))}
                                    className="w-full border border-slate-200 rounded-lg px-1 py-1 text-[13px] font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                  >
                                    <option value="AND">AND</option>
                                    <option value="OR">OR</option>
                                  </select>
                                ) : (
                                  <span className="text-slate-400">—</span>
                                )}
                              </td>
                              <td className="px-2 py-1.5 text-center">
                                <button type="button" onClick={() => setMatchingRules(prev => prev.filter(r => r.id !== rule.id))} className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMatchingRules(prev => [...prev, { id: `mr-${Date.now()}`, fieldName: '', method: 'exact', fuzzyThreshold: 80, normalize: false, operator: 'AND' }])}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 text-blue-600 text-[13px] font-medium rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Thêm quy tắc so khớp
                  </button>
                </div>
              </div>

              {/* ── Lớp 2: Extraction Rules ── */}
              <div className="border border-blue-200 rounded-xl overflow-hidden">
                <div className="bg-blue-50 px-4 py-3 flex items-center gap-3 border-b border-blue-200">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[13px] font-bold flex items-center justify-center flex-shrink-0">2</span>
                  <div>
                    <p className="text-[13px] font-semibold text-blue-800">Lớp 2 — Quy tắc trích rút (Extraction Rules)</p>
                    <p className="text-[13px] text-blue-500">Sau khi xác định hai bản ghi là cùng thực thể, lấy giá trị từng trường từ nguồn nào</p>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  {extractionRules.length === 0 ? (
                    <p className="text-[13px] text-slate-400 text-center py-6">Hoàn tất Bước 2 để tự động nạp danh sách trường</p>
                  ) : (
                    <div className="border border-slate-100 rounded-lg overflow-hidden">
                      <table className="w-full text-[13px]">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr>
                            <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Trường</th>
                            <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Nguồn ưu tiên</th>
                            <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Nguồn thay thế (nếu rỗng)</th>
                            <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Xử lý xung đột dữ liệu</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 bg-white">
                          {extractionRules.map(rule => (
                            <tr key={rule.id}>
                              <td className="px-3 py-2">
                                <span className="text-[13px] font-medium text-slate-700">{availableFields.find(f => f.fieldName === rule.fieldName)?.displayName || rule.fieldName}</span>
                                <code className="ml-1.5 text-[13px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{rule.fieldName}</code>
                              </td>
                              <td className="px-2 py-1.5">
                                <select
                                  value={rule.primarySource}
                                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setExtractionRules(prev => prev.map(r => r.id === rule.id ? { ...r, primarySource: e.target.value } : r))}
                                  className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                                >
                                  <option value="">-- Chọn nguồn --</option>
                                  {availableSources.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                                </select>
                              </td>
                              <td className="px-2 py-1.5">
                                <select
                                  value={rule.fallbackSource}
                                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setExtractionRules(prev => prev.map(r => r.id === rule.id ? { ...r, fallbackSource: e.target.value } : r))}
                                  className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                                >
                                  <option value="">Không tìm nguồn thay thế</option>
                                  {availableSources.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                                </select>
                              </td>
                              <td className="px-2 py-1.5">
                                <select
                                  value={rule.conflictStrategy}
                                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setExtractionRules(prev => prev.map(r => r.id === rule.id ? { ...r, conflictStrategy: e.target.value as ConflictStrategy } : r))}
                                  className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                                >
                                  <option value="priority">Ưu tiên nguồn cao nhất</option>
                                  <option value="most_recent">Giá trị mới nhất</option>
                                  <option value="most_complete">Giá trị đầy đủ nhất</option>
                                  <option value="flag">Gắn cờ chờ người duyệt</option>
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

              {/* ── Lớp 3: Merge Config ── */}
              <div className="border border-blue-200 rounded-xl overflow-hidden">
                <div className="bg-blue-50 px-4 py-3 flex items-center gap-3 border-b border-blue-200">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[13px] font-bold flex items-center justify-center flex-shrink-0">3</span>
                  <div>
                    <p className="text-[13px] font-semibold text-blue-800">Lớp 3 — Quy tắc hợp nhất (Merge Rules)</p>
                    <p className="text-[13px] text-blue-500">Cách tạo ra bản ghi dữ liệu chủ cuối cùng từ kết quả trích rút</p>
                  </div>
                </div>
                <div className="p-4 space-y-4 bg-white">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={mergeConfig.keepSourceRef}
                      onChange={() => setMergeConfig(prev => ({ ...prev, keepSourceRef: !prev.keepSourceRef }))}
                      className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer w-4 h-4 flex-shrink-0"
                    />
                    <div>
                      <p className="text-[13px] font-medium text-slate-700">Giữ liên kết ngược về nguồn gốc (Source Reference)</p>
                      <p className="text-[13px] text-slate-500">Bản ghi chủ lưu thông tin nó được hợp nhất từ nguồn nào, ID bản ghi gốc nào</p>
                    </div>
                  </label>
                  <div>
                    <p className="text-[13px] font-medium text-slate-700 mb-2">Điều kiện kích hoạt hợp nhất lại khi nguồn cập nhật</p>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio" name="mergeTrigger" value="auto"
                          checked={mergeConfig.mergeTrigger === 'auto'}
                          onChange={() => setMergeConfig(prev => ({ ...prev, mergeTrigger: 'auto' }))}
                          className="text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                        />
                        <span className="text-[13px] text-slate-700">Tự động hợp nhất lại ngay</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio" name="mergeTrigger" value="approval"
                          checked={mergeConfig.mergeTrigger === 'approval'}
                          onChange={() => setMergeConfig(prev => ({ ...prev, mergeTrigger: 'approval' }))}
                          className="text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                        />
                        <span className="text-[13px] text-slate-700">Chờ phê duyệt trước khi hợp nhất</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Thiết lập quan hệ */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-[13px] font-semibold text-blue-900 mb-1">Bước 5: Thiết lập quan hệ</h3>
                <p className="text-[13px] text-blue-700">Định nghĩa mối quan hệ giữa thực thể này với các thực thể dữ liệu chủ khác trong hệ thống</p>
              </div>

              {/* Entity info + add button */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[13px] flex-shrink-0">
                    {(wizardData.code || wizardData.name || 'E').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[13px] text-slate-500">Thực thể đang cấu hình:</p>
                    <p className="text-[13px] font-semibold text-slate-800">
                      {wizardData.code && <code className="text-blue-600 bg-blue-50 px-1 rounded mr-1.5">{wizardData.code}</code>}
                      {wizardData.name || '(Chưa đặt tên)'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {!relFormOpen && wizardData.relationships.length > 0 && (
                    <div className="relative">
                      <input
                        type="text" value={relSearch}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setRelSearch(e.target.value)}
                        placeholder="Tìm kiếm quan hệ..."
                        className="h-9 pl-8 pr-3 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-52"
                      />
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                  )}
                  {!relFormOpen && (
                    <button
                      type="button" onClick={handleOpenAddRel}
                      className="h-9 flex items-center gap-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[13px] font-medium shadow-sm whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" /> Thêm quan hệ
                    </button>
                  )}
                </div>
              </div>

              {/* Inline add / edit form */}
              {relFormOpen && (
                <div className="border border-blue-200 rounded-xl bg-blue-50/30 overflow-hidden">
                  <div className="bg-blue-600 px-5 py-3 flex items-center justify-between">
                    <p className="text-[13px] font-semibold text-white">
                      {editingRelId ? 'Chỉnh sửa quan hệ' : 'Thêm quan hệ mới'}
                    </p>
                    <button type="button" onClick={handleCancelRel} className="text-white/70 hover:text-white transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 space-y-5">
                    {/* 1. Chọn thực thể */}
                    <div className="space-y-3">
                      <h4 className="text-[13px] font-semibold text-slate-700 border-b border-slate-200 pb-2">1. Chọn thực thể liên kết</h4>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                            Thực thể nguồn <span className="text-slate-400 font-normal">(thực thể đang tạo)</span>
                          </label>
                          <div className="h-10 px-3 flex items-center border border-slate-200 rounded-lg bg-slate-50 text-[13px] text-slate-600">
                            {wizardData.code && <code className="text-blue-600 bg-blue-100 px-1 rounded mr-1.5 text-[13px]">{wizardData.code}</code>}
                            {wizardData.name || '(Thực thể đang tạo)'}
                          </div>
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                            Thực thể đích <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={relFormData.targetEntityId}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                              const ent = WIZARD_MOCK_ENTITIES.find(x => x.id === e.target.value);
                              setRelFormData(prev => ({ ...prev, targetEntityId: e.target.value, targetEntityName: ent?.name || '', sourceKey: '', targetKey: '' }));
                              setRelFormError('');
                            }}
                            className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
                          >
                            <option value="">-- Chọn thực thể đích --</option>
                            {WIZARD_MOCK_ENTITIES.map(e => <option key={e.id} value={e.id}>{e.code} - {e.name}</option>)}
                          </select>
                        </div>
                      </div>

                      {relFormData.targetEntityId && (
                        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-center gap-8">
                          <div className="flex flex-col items-center gap-1.5">
                            <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-[13px]">A</div>
                            <span className="text-[13px] font-semibold text-slate-800">{wizardData.name || '(Thực thể đang tạo)'}</span>
                          </div>
                          <ArrowRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                          <div className="flex flex-col items-center gap-1.5">
                            <div className="w-9 h-9 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-[13px]">B</div>
                            <span className="text-[13px] font-semibold text-slate-800">{WIZARD_MOCK_ENTITIES.find(e => e.id === relFormData.targetEntityId)?.name}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 2. Loại quan hệ */}
                    <div className="space-y-3">
                      <h4 className="text-[13px] font-semibold text-slate-700 border-b border-slate-200 pb-2">2. Loại quan hệ</h4>
                      <select
                        value={relFormData.type}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setRelFormData(prev => ({ ...prev, type: e.target.value as WizardRelType, sourceKey: '', targetKey: '', mappingTable: '' }))}
                        className="w-64 px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
                      >
                        {(Object.entries(REL_TYPE_LABELS) as [WizardRelType, string][])
                          .filter(([val]) => val !== '1-n')
                          .map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                          ))}
                      </select>
                    </div>

                    {/* 3. Điều kiện liên kết */}
                    <div className="space-y-3">
                      <h4 className="text-[13px] font-semibold text-slate-700 border-b border-slate-200 pb-2 flex items-center justify-between">
                        <span>3. Điều kiện liên kết</span>
                        {!relFormData.targetEntityId && (
                          <span className="text-[13px] text-orange-600 bg-orange-50 font-normal px-2 py-0.5 rounded border border-orange-100">Chọn thực thể đích để tải danh sách trường</span>
                        )}
                      </h4>

                      {relFormData.targetEntityId ? (
                        relFormData.type === 'n-n' ? (
                          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 space-y-4">
                            <p className="text-[13px] font-semibold text-purple-900">Bảng liên kết (Mapping Table)</p>
                            <div>
                              <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Tên bảng liên kết <span className="text-red-500">*</span></label>
                              <input type="text" value={relFormData.mappingTable}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setRelFormData(prev => ({ ...prev, mappingTable: e.target.value }))}
                                placeholder="VD: tbl_map_entity_a_entity_b"
                                className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Khoá ngoại Nguồn <span className="text-red-500">*</span></label>
                                <select value={relFormData.sourceKey} onChange={(e: ChangeEvent<HTMLSelectElement>) => setRelFormData(prev => ({ ...prev, sourceKey: e.target.value }))}
                                  className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-mono">
                                  <option value="">-- Chọn trường Nguồn --</option>
                                  {(sourceEntityFields.length > 0 ? sourceEntityFields : [{ name: 'id', label: 'ID định danh' }, { name: 'code', label: 'Mã định danh' }]).map(f => <option key={f.name} value={f.name}>{f.name} ({f.label})</option>)}
                                </select>
                              </div>
                              <div>
                                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Khoá ngoại Đích <span className="text-red-500">*</span></label>
                                <select value={relFormData.targetKey} onChange={(e: ChangeEvent<HTMLSelectElement>) => setRelFormData(prev => ({ ...prev, targetKey: e.target.value }))}
                                  className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-mono">
                                  <option value="">-- Chọn trường Đích --</option>
                                  {BASE_TARGET_FIELDS.map(f => <option key={f.name} value={f.name}>{f.name} ({f.label})</option>)}
                                </select>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 space-y-4">
                            <div className="flex items-center gap-2">
                              <Key className="w-4 h-4 text-blue-600" />
                              <span className="text-[13px] font-semibold text-blue-900">Khóa ngoại (Foreign Key)</span>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Khóa nguồn <span className="text-red-500">*</span></label>
                                <select value={relFormData.sourceKey} onChange={(e: ChangeEvent<HTMLSelectElement>) => setRelFormData(prev => ({ ...prev, sourceKey: e.target.value }))}
                                  className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono">
                                  <option value="">-- Chọn trường Nguồn --</option>
                                  {(sourceEntityFields.length > 0 ? sourceEntityFields : [{ name: 'id', label: 'ID định danh' }, { name: 'code', label: 'Mã định danh' }]).map(f => <option key={f.name} value={f.name}>{f.name} ({f.label})</option>)}
                                </select>
                                <p className="text-[13px] text-slate-400 mt-1">Trường trong thực thể đang tạo</p>
                              </div>
                              <div>
                                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Khóa đích <span className="text-red-500">*</span></label>
                                <select value={relFormData.targetKey} onChange={(e: ChangeEvent<HTMLSelectElement>) => setRelFormData(prev => ({ ...prev, targetKey: e.target.value }))}
                                  className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono">
                                  <option value="">-- Chọn trường Đích --</option>
                                  {BASE_TARGET_FIELDS.map(f => <option key={f.name} value={f.name}>{f.name} ({f.label})</option>)}
                                </select>
                                <p className="text-[13px] text-slate-400 mt-1">Trường dùng để join (thường là ID/Code)</p>
                              </div>
                            </div>
                            <div className="pt-3 border-t border-blue-100">
                              <label className="block text-[13px] font-medium text-emerald-700 mb-1.5">
                                Trường hiển thị (Lookup Display) <span className="text-slate-400 font-normal">(Không bắt buộc)</span>
                              </label>
                              <select value={relFormData.displayField} onChange={(e: ChangeEvent<HTMLSelectElement>) => setRelFormData(prev => ({ ...prev, displayField: e.target.value }))}
                                className="w-full max-w-xs px-3 py-2 border border-emerald-300 bg-white rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono">
                                <option value="">-- Không chọn --</option>
                                {BASE_TARGET_FIELDS.map(f => <option key={f.name} value={f.name}>{f.name} ({f.label})</option>)}
                              </select>
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-lg p-6 text-center text-[13px] text-slate-400">
                          Hãy chọn thực thể đích ở mục 1 để cấu hình khóa liên kết
                        </div>
                      )}
                    </div>

                    {relFormError && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-[13px] text-red-600">{relFormError}</p>
                      </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                      <button type="button" onClick={handleCancelRel}
                        className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-[13px] font-medium hover:bg-slate-50 transition-colors">
                        Hủy
                      </button>
                      <button type="button" onClick={handleSaveRel}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-[13px] font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        {editingRelId ? 'Cập nhật quan hệ' : 'Lưu quan hệ'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Relationships table */}
              <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                {wizardData.relationships.filter(r =>
                  !relSearch || r.targetEntityName.toLowerCase().includes(relSearch.toLowerCase()) ||
                  r.sourceKey.toLowerCase().includes(relSearch.toLowerCase()) ||
                  r.targetKey.toLowerCase().includes(relSearch.toLowerCase())
                ).length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <Network className="w-12 h-12 text-slate-300 mb-3 stroke-[1.5]" />
                    <p className="text-[13px] font-semibold text-slate-700">Chưa có quan hệ nào</p>
                    <p className="text-[13px] text-slate-500 mt-1 max-w-sm">Thực thể này chưa được cấu hình liên kết với thực thể dữ liệu chủ nào khác.</p>
                    {!relFormOpen && (
                      <button type="button" onClick={handleOpenAddRel}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[13px] font-medium flex items-center gap-1.5">
                        <Plus className="w-4 h-4" /> Thêm quan hệ
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-[13px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-4 py-3 font-semibold text-slate-500 text-center w-12">STT</th>
                          <th className="px-4 py-3 font-semibold text-slate-500">Thực thể đích</th>
                          <th className="px-4 py-3 font-semibold text-slate-500 text-center w-24">Loại</th>
                          <th className="px-4 py-3 font-semibold text-slate-500">Khóa nguồn</th>
                          <th className="px-4 py-3 font-semibold text-slate-500">Khóa đích</th>
                          <th className="px-4 py-3 font-semibold text-slate-500">Trường hiển thị / Bảng liên kết</th>
                          <th className="px-4 py-3 font-semibold text-slate-500 text-center w-20">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {wizardData.relationships.filter(r =>
                          !relSearch || r.targetEntityName.toLowerCase().includes(relSearch.toLowerCase()) ||
                          r.sourceKey.toLowerCase().includes(relSearch.toLowerCase()) ||
                          r.targetKey.toLowerCase().includes(relSearch.toLowerCase())
                        ).map((rel, idx) => (
                          <tr key={rel.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-3 text-center text-slate-500 font-medium">{idx + 1}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-[13px] flex-shrink-0">
                                  {rel.targetEntityName.charAt(0)}
                                </div>
                                <span className="font-medium text-slate-800">{rel.targetEntityName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-0.5 rounded border text-[13px] font-semibold ${REL_TYPE_COLORS[rel.type]}`}>
                                {rel.type}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-mono text-slate-600">{rel.sourceKey || '—'}</td>
                            <td className="px-4 py-3 font-mono text-slate-600">{rel.targetKey || '—'}</td>
                            <td className="px-4 py-3 text-slate-600">
                              {rel.type === 'n-n' ? (
                                rel.mappingTable ? <code className="text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-mono">{rel.mappingTable}</code> : <span className="text-slate-400">—</span>
                              ) : (
                                rel.displayField ? <code className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">{rel.displayField}</code> : <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-1.5">
                                <button type="button" onClick={() => handleOpenEditRel(rel)}
                                  className="p-1.5 border border-slate-200 bg-white text-slate-500 hover:text-blue-600 hover:border-blue-300 rounded-lg transition-colors" title="Chỉnh sửa">
                                  <SquarePen className="w-3.5 h-3.5" />
                                </button>
                                <button type="button" onClick={() => handleDeleteRel(rel.id)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
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

          {/* Step 6: Phê duyệt */}
          {currentStep === 6 && (
            <div className="space-y-4">

              {/* Reviewer + Notes */}
              <div className="border border-blue-200 rounded-lg overflow-hidden">
                <div className="bg-blue-50 px-4 py-2.5 border-b border-blue-200">
                  <h4 className="text-[13px] font-semibold text-blue-900">Thông tin phê duyệt</h4>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-[13px] text-slate-700 mb-1.5">
                      Chọn người trình duyệt <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={wizardData.approvalReviewer}
                      onChange={(e) => setWizardData({ ...wizardData, approvalReviewer: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">-- Chọn người trình duyệt --</option>
                      {MOCK_REVIEWERS.map(r => (
                        <option key={r.id} value={r.id}>{r.name} — {r.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] text-slate-700 mb-1.5">
                      Ghi chú phê duyệt
                    </label>
                    <textarea
                      value={wizardData.approvalNotes}
                      onChange={(e) => setWizardData({ ...wizardData, approvalNotes: e.target.value })}
                      placeholder="Nhập lý do và ghi chú cho việc tạo dữ liệu chủ này..."
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Review 1: Thông tin cơ bản */}
              <div className="border border-blue-200 rounded-lg overflow-hidden">
                <div className="bg-blue-50 px-4 py-2.5 border-b border-blue-200">
                  <h4 className="text-[13px] font-semibold text-blue-900">Thông tin cơ bản</h4>
                </div>
                <div className="p-4 grid grid-cols-2 gap-x-8 gap-y-2 text-[13px]">
                  <div className="flex gap-2"><span className="text-slate-500 w-36 flex-shrink-0">Tên dữ liệu chủ:</span><span className="text-slate-900">{wizardData.name || '—'}</span></div>
                  <div className="flex gap-2"><span className="text-slate-500 w-36 flex-shrink-0">Mã:</span><span className="text-slate-900">{wizardData.code || '—'}</span></div>
                  <div className="flex gap-2"><span className="text-slate-500 w-36 flex-shrink-0">Loại dữ liệu:</span><span className="text-slate-900">{wizardData.dataType || '—'}</span></div>
                  <div className="flex gap-2"><span className="text-slate-500 w-36 flex-shrink-0">Phạm vi:</span><span className="text-slate-900">{wizardData.scope || '—'}</span></div>
                  <div className="flex gap-2"><span className="text-slate-500 w-36 flex-shrink-0">Cơ quan quản lý:</span><span className="text-slate-900">{wizardData.managingAgency || '—'}</span></div>
                  <div className="flex gap-2"><span className="text-slate-500 w-36 flex-shrink-0">Nguồn dữ liệu:</span><span className="text-slate-900">{wizardData.dataSource === 'dldc' ? 'DLDC' : wizardData.dataSource === 'api' ? 'API' : 'Thủ công'}</span></div>
                </div>
              </div>

              {/* Review 2: Quy tắc định danh */}
              <div className="border border-blue-200 rounded-lg overflow-hidden">
                <div className="bg-blue-50 px-4 py-2.5 border-b border-blue-200">
                  <h4 className="text-[13px] font-semibold text-blue-900">Quy tắc định danh</h4>
                </div>
                <div className="p-4 grid grid-cols-2 gap-x-8 gap-y-2 text-[13px]">
                  <div className="flex gap-2"><span className="text-slate-500 w-36 flex-shrink-0">Tiền tố:</span><span className="text-slate-900">{identifierConfig.prefix || '(Không có)'}</span></div>
                  <div className="flex gap-2"><span className="text-slate-500 w-36 flex-shrink-0">Hậu tố:</span><span className="text-slate-900">{identifierConfig.suffix || '(Không có)'}</span></div>
                  <div className="flex gap-2"><span className="text-slate-500 w-36 flex-shrink-0">Ký tự phân cách:</span><span className="text-slate-900">{{ none: 'Không có', '-': 'Gạch ngang (-)', '.': 'Dấu chấm (.)', '/': 'Gạch chéo (/)' }[identifierConfig.separator]}</span></div>
                  <div className="flex gap-2"><span className="text-slate-500 w-36 flex-shrink-0">Độ dài số:</span><span className="text-slate-900">{identifierConfig.digits} chữ số</span></div>
                  <div className="flex gap-2"><span className="text-slate-500 w-36 flex-shrink-0">Bắt đầu từ:</span><span className="text-slate-900">{identifierConfig.startFrom}</span></div>
                  <div className="flex gap-2"><span className="text-slate-500 w-36 flex-shrink-0">Kiểm tra trùng:</span><span className="text-slate-900">{identifierConfig.checkDuplicate ? 'Có' : 'Không'}</span></div>
                </div>
              </div>

              {/* Review 3: Các trường dữ liệu */}
              <div className="border border-blue-200 rounded-lg overflow-hidden">
                <div className="bg-blue-50 px-4 py-2.5 border-b border-blue-200 flex items-center justify-between">
                  <h4 className="text-[13px] font-semibold text-blue-900">Các trường dữ liệu</h4>
                  <span className="text-[13px] text-blue-600">{availableFields.length} trường</span>
                </div>
                {availableFields.length === 0 ? (
                  <div className="p-4 text-[13px] text-slate-500 text-center">Chưa có trường dữ liệu nào</div>
                ) : (
                  <table className="w-full text-[13px]">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2 text-left text-slate-600 font-medium">Tên trường</th>
                        <th className="px-4 py-2 text-left text-slate-600 font-medium">Tên hiển thị</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {availableFields.map((f, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="px-4 py-2 font-mono text-slate-700">{f.fieldName}</td>
                          <td className="px-4 py-2 text-slate-700">{f.displayName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Review 4: Quy tắc hợp nhất */}
              <div className="border border-blue-200 rounded-lg overflow-hidden">
                <div className="bg-blue-50 px-4 py-2.5 border-b border-blue-200">
                  <h4 className="text-[13px] font-semibold text-blue-900">Quy tắc hợp nhất</h4>
                </div>
                <div className="p-4 space-y-3 text-[13px]">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-slate-500 mb-1">Quy tắc so khớp</div>
                      <div className="text-xl font-semibold text-slate-900">{matchingRules.length}</div>
                      <div className="text-[12px] text-slate-400">quy tắc</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-slate-500 mb-1">Quy tắc trích rút</div>
                      <div className="text-xl font-semibold text-slate-900">{extractionRules.length}</div>
                      <div className="text-[12px] text-slate-400">quy tắc</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-slate-500 mb-1">Ngưỡng so khớp</div>
                      <div className="text-xl font-semibold text-slate-900">{mergeConfig.minMatchScore}%</div>
                      <div className="text-[12px] text-slate-400">tối thiểu</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    <div className="flex gap-2"><span className="text-slate-500 w-40 flex-shrink-0">Phương thức hợp nhất:</span><span className="text-slate-900">{mergeConfig.mergeTrigger === 'auto' ? 'Tự động' : 'Cần phê duyệt'}</span></div>
                    <div className="flex gap-2"><span className="text-slate-500 w-40 flex-shrink-0">Lưu tham chiếu nguồn:</span><span className="text-slate-900">{mergeConfig.keepSourceRef ? 'Có' : 'Không'}</span></div>
                  </div>
                </div>
              </div>

              {/* Review 5: Quan hệ đã thiết lập */}
              <div className="border border-blue-200 rounded-lg overflow-hidden">
                <div className="bg-blue-50 px-4 py-2.5 border-b border-blue-200 flex items-center justify-between">
                  <h4 className="text-[13px] font-semibold text-blue-900">Quan hệ đã thiết lập</h4>
                  <span className="text-[13px] text-blue-600">{wizardData.relationships.length} quan hệ</span>
                </div>
                {wizardData.relationships.length === 0 ? (
                  <div className="p-4 text-[13px] text-slate-500 text-center">Chưa thiết lập quan hệ nào</div>
                ) : (
                  <table className="w-full text-[13px]">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2 text-left text-slate-600 font-medium">Thực thể liên kết</th>
                        <th className="px-4 py-2 text-left text-slate-600 font-medium">Loại quan hệ</th>
                        <th className="px-4 py-2 text-left text-slate-600 font-medium">Trường liên kết</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {wizardData.relationships.map((rel) => (
                        <tr key={rel.id} className="hover:bg-slate-50">
                          <td className="px-4 py-2 text-slate-700">{rel.targetEntityName}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-0.5 rounded border text-[12px] ${REL_TYPE_COLORS[rel.type]}`}>
                              {REL_TYPE_LABELS[rel.type]}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-slate-500">{rel.sourceKey} → {rel.targetKey}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-[13px] text-green-800">
                    <p className="mb-1">Sau khi gửi, dữ liệu chủ sẽ ở trạng thái <strong>"Chờ phê duyệt"</strong>.</p>
                    <p>Người phê duyệt sẽ xem xét và quyết định phê duyệt hoặc từ chối.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Quay lại
          </button>

          <div className="text-[13px] text-slate-600">
            Bước {currentStep} / {steps.length}
          </div>

          {currentStep < 6 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tiếp theo
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmitWizard}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Check className="w-4 h-4" />
              Gửi phê duyệt
            </button>
          )}
        </div>
      </div>
    </div>
  </Portal>
  );
}
