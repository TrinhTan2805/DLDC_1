import { useState, ChangeEvent } from 'react';
import { X, Check, ChevronRight, ChevronLeft, AlertCircle, Plus, Trash2, Database, FileText, ChevronDown } from 'lucide-react';
import { Portal } from '../../common/Portal';

type LifecycleStatus = 'active' | 'draft' | 'inactive' | 'archived';
type DataType = 'individual' | 'organization' | 'legal' | 'asset';
type ScopeType = 'national' | 'ministry' | 'provincial' | 'internal';
type DataSourceType = 'dldc' | 'manual';
type UpdateStrategyType = 'reference' | 'scheduled' | 'realtime';
type SyncFrequencyType = 'daily' | 'weekly' | 'monthly' | 'event';
type FieldDataType = 'string' | 'number' | 'date' | 'datetime' | 'boolean' | 'text' | 'email' | 'phone' | 'url';
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

function getDatabaseForTable(tableId: string): string {
  for (const [dbId, tables] of Object.entries(DLDC_TABLES)) {
    if (tables.some(t => t.id === tableId)) return dbId;
  }
  return '';
}

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

  // Step 4
  relationships: string[];

  // Step 5
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

const steps = [
  { number: 1, title: 'Khởi tạo dữ liệu chủ', description: 'Thông tin cơ bản và nguồn dữ liệu' },
  { number: 2, title: 'Tạo thuộc tính', description: 'Định nghĩa các trường dữ liệu' },
  { number: 3, title: 'Quy tắc hợp nhất', description: 'Thiết lập quy tắc merge dữ liệu' },
  { number: 4, title: 'Thiết lập quan hệ', description: 'Liên kết giữa các thực thể' },
  { number: 5, title: 'Phê duyệt', description: 'Xem lại và gửi phê duyệt' }
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

  // Step 3 state
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

  if (!isOpen) return null;

  const availableFields = wizardData.dataSource === 'dldc'
    ? dldcFieldRows.filter(r => r.shared).map(r => ({ fieldName: r.columnName, displayName: r.displayName }))
    : wizardData.attributes.map(a => ({ fieldName: a.fieldName, displayName: a.displayName }));

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
    if (currentStep === 2) {
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

    if (currentStep < 5) {
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
            <p className="text-[13px] text-slate-600 mt-1">Quy trình 5 bước</p>
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

          {/* Step 2: Tạo thuộc tính */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="text-[13px] font-semibold text-blue-900 mb-1">Bước 2: Tạo thuộc tính</h3>
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

          {/* Step 3: Quy tắc hợp nhất */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-[13px] font-semibold text-blue-900 mb-1">Bước 3: Quy tắc hợp nhất dữ liệu</h3>
                <p className="text-[13px] text-blue-700">
                  Định nghĩa 3 lớp quy tắc để phát hiện, trích rút và hợp nhất dữ liệu từ nhiều nguồn
                </p>
              </div>

              {/* ── Lớp 1: Matching Rules ── */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-blue-600 px-4 py-3 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/20 text-white text-[13px] font-bold flex items-center justify-center flex-shrink-0">1</span>
                  <div>
                    <p className="text-[13px] font-semibold text-white">Lớp 1 — Quy tắc so khớp (Matching Rules)</p>
                    <p className="text-[13px] text-blue-200">Xác định khi nào hai bản ghi từ hai nguồn khác nhau được coi là cùng một thực thể</p>
                  </div>
                </div>
                <div className="p-4 space-y-4 bg-white">
                  <div className="flex items-center gap-3">
                    <label className="text-[13px] font-medium text-slate-700 whitespace-nowrap">Điểm tổng hợp tối thiểu để xác nhận khớp:</label>
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
                          <th className="px-3 py-2.5 text-left font-semibold text-slate-500">Trường so khớp</th>
                          <th className="px-3 py-2.5 text-left font-semibold text-slate-500">Phương pháp</th>
                          <th className="px-3 py-2.5 text-center font-semibold text-slate-500 w-24">Ngưỡng (%)</th>
                          <th className="px-3 py-2.5 text-center font-semibold text-slate-500 w-24">Chuẩn hóa</th>
                          <th className="px-3 py-2.5 text-center font-semibold text-slate-500 w-20">Toán tử</th>
                          <th className="px-3 py-2.5 text-center font-semibold text-slate-500 w-10"></th>
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
                                  <option value="normalized">Chuẩn hóa rồi khớp</option>
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
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-blue-600 px-4 py-3 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/20 text-white text-[13px] font-bold flex items-center justify-center flex-shrink-0">2</span>
                  <div>
                    <p className="text-[13px] font-semibold text-white">Lớp 2 — Quy tắc trích rút (Extraction Rules)</p>
                    <p className="text-[13px] text-blue-100">Sau khi xác định hai bản ghi là cùng thực thể, lấy giá trị từng trường từ nguồn nào</p>
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
                            <th className="px-3 py-2.5 text-left font-semibold text-slate-500">Trường</th>
                            <th className="px-3 py-2.5 text-left font-semibold text-slate-500">Nguồn ưu tiên</th>
                            <th className="px-3 py-2.5 text-left font-semibold text-slate-500">Fallback (khi null)</th>
                            <th className="px-3 py-2.5 text-left font-semibold text-slate-500">Chiến lược xung đột</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 bg-white">
                          {extractionRules.map(rule => (
                            <tr key={rule.id}>
                              <td className="px-3 py-2">
                                <span className="font-medium text-slate-700">{availableFields.find(f => f.fieldName === rule.fieldName)?.displayName || rule.fieldName}</span>
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
                                  <option value="">Không fallback</option>
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
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-blue-600 px-4 py-3 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/20 text-white text-[13px] font-bold flex items-center justify-center flex-shrink-0">3</span>
                  <div>
                    <p className="text-[13px] font-semibold text-white">Lớp 3 — Quy tắc hợp nhất (Merge Rules)</p>
                    <p className="text-[13px] text-blue-200">Cách tạo ra bản ghi dữ liệu chủ cuối cùng từ kết quả trích rút</p>
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
                        <span className="text-[13px] text-slate-700">Tự động merge lại ngay</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio" name="mergeTrigger" value="approval"
                          checked={mergeConfig.mergeTrigger === 'approval'}
                          onChange={() => setMergeConfig(prev => ({ ...prev, mergeTrigger: 'approval' }))}
                          className="text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                        />
                        <span className="text-[13px] text-slate-700">Chờ phê duyệt trước khi merge</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Thiết lập quan hệ */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="text-[13px] text-blue-900 mb-1">Bước 4: Thiết lập quan hệ</h3>
                <p className="text-[13px] text-blue-700">
                  Định nghĩa mối quan hệ với các thực thể khác
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-8 bg-slate-50 text-center">
                <p className="text-[13px] text-slate-600">
                  Bỏ qua bước này hoặc thêm quan hệ sau khi tạo xong.
                </p>
                <p className="text-[13px] text-slate-500 mt-2">
                  Bạn có thể thiết lập quan hệ 1-n, n-n với các thực thể khác sau.
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Phê duyệt */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="text-[13px] text-blue-900 mb-1">Bước 5: Xem lại và gửi phê duyệt</h3>
                <p className="text-[13px] text-blue-700">
                  Kiểm tra lại thông tin trước khi gửi phê duyệt
                </p>
              </div>

              {/* Summary */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                  <h4 className="text-[13px] text-slate-900">Tóm tắt thông tin</h4>
                </div>
                <div className="p-4 space-y-3 text-[13px]">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-slate-600">Tên dữ liệu chủ:</span>
                    <span className="text-slate-900">{wizardData.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-slate-600">Loại dữ liệu:</span>
                    <span className="text-slate-900">{wizardData.dataType}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-slate-600">Cơ quan quản lý:</span>
                    <span className="text-slate-900">{wizardData.managingAgency}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-slate-600">Số thuộc tính:</span>
                    <span className="text-slate-900">{wizardData.attributes.length} trường</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-slate-600">Nguồn dữ liệu:</span>
                    <span className="text-slate-900">{wizardData.dataSource}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[13px] text-slate-700 mb-1">
                  Ghi chú phê duyệt <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={wizardData.approvalNotes}
                  onChange={(e) => setWizardData({ ...wizardData, approvalNotes: e.target.value })}
                  placeholder="Nhập lý do và ghi chú cho việc tạo dữ liệu chủ này..."
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

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

          {currentStep < 5 ? (
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
