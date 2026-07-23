import { useState, ChangeEvent } from 'react';
import { X, Check, ChevronRight, ChevronLeft, AlertCircle, AlertTriangle, CheckCircle2, Plus, Trash2, Database, FileText, ChevronDown, ChevronUp, Network, ArrowRight, Key, Search, SquarePen, GitMerge, Split, Send, PlusCircle, XCircle } from 'lucide-react';
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

interface WizardSource {
  id: string;
  name: string;
  kind: SourceKind;
  grain: SourceGrain;
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

interface MergeConfig {
  keepSourceRef: boolean;
  mergeTrigger: MergeTrigger;
  minMatchScore: number;
  autoThreshold: number;
  reviewThreshold: number;
  hardBlockFields: string[];
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
  { id: 'hotich', label: 'Hß╗Ö tß╗ïch' },
  { id: 'cccd',   label: 'C─ân c╞░ß╗¢c c├┤ng d├ón' },
  { id: 'dkkd',   label: '─É─âng k├╜ kinh doanh' },
  { id: 'lltp',   label: 'L├╜ lß╗ïch t╞░ ph├íp' },
  { id: 'btdp',   label: 'Bß╗ò trß╗ú t╞░ ph├íp' },
];

const DLDC_TABLES: Record<string, { id: string; displayName: string }[]> = {
  hotich: [
    { id: 'tbl_khaisinh',  displayName: 'Khai sinh' },
    { id: 'tbl_kethon',    displayName: 'Kß║┐t h├┤n' },
    { id: 'tbl_ly_hon',    displayName: 'Ly h├┤n' },
    { id: 'tbl_khai_tu',   displayName: 'Khai tß╗¡' },
    { id: 'tbl_gioi_tinh', displayName: 'Danh mß╗Ñc giß╗¢i t├¡nh' },
  ],
  cccd: [
    { id: 'tbl_can_cuoc', displayName: 'C─ân c╞░ß╗¢c c├┤ng d├ón' },
    { id: 'tbl_cu_tru',   displayName: 'C╞░ tr├║' },
  ],
  dkkd: [
    { id: 'tbl_doanhnghiep',   displayName: 'Doanh nghiß╗çp' },
    { id: 'tbl_ho_kinh_doanh', displayName: 'Hß╗Ö kinh doanh' },
    { id: 'tbl_giay_phep',     displayName: 'Giß║Ñy ph├⌐p kinh doanh' },
  ],
  lltp: [
    { id: 'tbl_ly_lich_tu_phap', displayName: 'L├╜ lß╗ïch t╞░ ph├íp' },
    { id: 'tbl_an_tich',         displayName: '├ün t├¡ch' },
  ],
  btdp: [
    { id: 'tbl_cong_chung', displayName: 'C├┤ng chß╗⌐ng' },
    { id: 'tbl_luat_su',    displayName: 'Luß║¡t s╞░' },
    { id: 'tbl_tro_giup',   displayName: 'Trß╗ú gi├║p ph├íp l├╜' },
  ],
};

const DLDC_FIELDS: Record<string, { fieldName: string; displayName: string; dataType: FieldDataType }[]> = {
  tbl_khaisinh: [
    { fieldName: 'ma_khai_sinh', displayName: 'M├ú khai sinh', dataType: 'string' },
    { fieldName: 'ho_ten',       displayName: 'Hß╗ì v├á t├¬n',    dataType: 'string' },
    { fieldName: 'ngay_sinh',    displayName: 'Ng├áy sinh',    dataType: 'date'   },
    { fieldName: 'gioi_tinh',    displayName: 'Giß╗¢i t├¡nh',    dataType: 'string' },
    { fieldName: 'noi_sinh',     displayName: 'N╞íi sinh',     dataType: 'string' },
    { fieldName: 'ho_ten_cha',   displayName: 'Hß╗ì t├¬n cha',   dataType: 'string' },
    { fieldName: 'ho_ten_me',    displayName: 'Hß╗ì t├¬n mß║╣',    dataType: 'string' },
    { fieldName: 'so_dinh_danh', displayName: 'Sß╗æ ─æß╗ïnh danh', dataType: 'string' },
  ],
  tbl_kethon: [
    { fieldName: 'ma_dang_ky',     displayName: 'M├ú ─æ─âng k├╜',     dataType: 'string' },
    { fieldName: 'ten_chong',      displayName: 'T├¬n chß╗ông',       dataType: 'string' },
    { fieldName: 'cccd_chong',     displayName: 'CCCD chß╗ông',      dataType: 'string' },
    { fieldName: 'ten_vo',         displayName: 'T├¬n vß╗ú',          dataType: 'string' },
    { fieldName: 'cccd_vo',        displayName: 'CCCD vß╗ú',         dataType: 'string' },
    { fieldName: 'ngay_dang_ky',   displayName: 'Ng├áy ─æ─âng k├╜',    dataType: 'date'   },
    { fieldName: 'co_quan_dang_ky',displayName: 'C╞í quan ─æ─âng k├╜', dataType: 'string' },
  ],
  tbl_ly_hon: [
    { fieldName: 'ma_ban_an',   displayName: 'M├ú bß║ún ├ín',   dataType: 'string' },
    { fieldName: 'ten_chong',   displayName: 'T├¬n chß╗ông',   dataType: 'string' },
    { fieldName: 'ten_vo',      displayName: 'T├¬n vß╗ú',      dataType: 'string' },
    { fieldName: 'ngay_ly_hon', displayName: 'Ng├áy ly h├┤n', dataType: 'date'   },
    { fieldName: 'toa_an',      displayName: 'T├▓a ├ín',      dataType: 'string' },
  ],
  tbl_khai_tu: [
    { fieldName: 'ma_khai_tu',  displayName: 'M├ú khai tß╗¡',  dataType: 'string' },
    { fieldName: 'ho_ten',      displayName: 'Hß╗ì v├á t├¬n',   dataType: 'string' },
    { fieldName: 'ngay_mat',    displayName: 'Ng├áy mß║Ñt',    dataType: 'date'   },
    { fieldName: 'noi_mat',     displayName: 'N╞íi mß║Ñt',     dataType: 'string' },
    { fieldName: 'nguyen_nhan', displayName: 'Nguy├¬n nh├ón', dataType: 'string' },
  ],
  tbl_gioi_tinh: [
    { fieldName: 'ma_gioi_tinh',  displayName: 'M├ú giß╗¢i t├¡nh',  dataType: 'string' },
    { fieldName: 'ten_gioi_tinh', displayName: 'T├¬n giß╗¢i t├¡nh', dataType: 'string' },
    { fieldName: 'ghi_chu',       displayName: 'Ghi ch├║',       dataType: 'string' },
  ],
  tbl_can_cuoc: [
    { fieldName: 'so_cccd',      displayName: 'Sß╗æ CCCD',      dataType: 'string' },
    { fieldName: 'ho_ten',       displayName: 'Hß╗ì v├á t├¬n',    dataType: 'string' },
    { fieldName: 'ngay_sinh',    displayName: 'Ng├áy sinh',    dataType: 'date'   },
    { fieldName: 'gioi_tinh',    displayName: 'Giß╗¢i t├¡nh',    dataType: 'string' },
    { fieldName: 'que_quan',     displayName: 'Qu├¬ qu├ín',     dataType: 'string' },
    { fieldName: 'thuong_tru',   displayName: 'Th╞░ß╗¥ng tr├║',   dataType: 'string' },
    { fieldName: 'ngay_cap',     displayName: 'Ng├áy cß║Ñp',     dataType: 'date'   },
    { fieldName: 'noi_cap',      displayName: 'N╞íi cß║Ñp',      dataType: 'string' },
    { fieldName: 'ngay_het_han', displayName: 'Ng├áy hß║┐t hß║ín', dataType: 'date'   },
  ],
  tbl_cu_tru: [
    { fieldName: 'so_cccd',             displayName: 'Sß╗æ CCCD',             dataType: 'string' },
    { fieldName: 'ho_ten',              displayName: 'Hß╗ì v├á t├¬n',           dataType: 'string' },
    { fieldName: 'dia_chi_thuong_tru',  displayName: '─Éß╗ïa chß╗ë th╞░ß╗¥ng tr├║',  dataType: 'string' },
    { fieldName: 'dia_chi_tam_tru',     displayName: '─Éß╗ïa chß╗ë tß║ím tr├║',     dataType: 'string' },
    { fieldName: 'ngay_dang_ky',        displayName: 'Ng├áy ─æ─âng k├╜',        dataType: 'date'   },
  ],
  tbl_doanhnghiep: [
    { fieldName: 'ma_so_thue',       displayName: 'M├ú sß╗æ thuß║┐',       dataType: 'string' },
    { fieldName: 'ten_doanh_nghiep', displayName: 'T├¬n doanh nghiß╗çp', dataType: 'string' },
    { fieldName: 'loai_hinh',        displayName: 'Loß║íi h├¼nh',        dataType: 'string' },
    { fieldName: 'dia_chi',          displayName: '─Éß╗ïa chß╗ë',          dataType: 'string' },
    { fieldName: 'nguoi_dai_dien',   displayName: 'Ng╞░ß╗¥i ─æß║íi diß╗çn',   dataType: 'string' },
    { fieldName: 'ngay_dang_ky',     displayName: 'Ng├áy ─æ─âng k├╜',     dataType: 'date'   },
    { fieldName: 'von_dieu_le',      displayName: 'Vß╗æn ─æiß╗üu lß╗ç',      dataType: 'number' },
    { fieldName: 'trang_thai',       displayName: 'Trß║íng th├íi',       dataType: 'string' },
  ],
  tbl_ho_kinh_doanh: [
    { fieldName: 'ma_dang_ky', displayName: 'M├ú ─æ─âng k├╜', dataType: 'string' },
    { fieldName: 'ten_ho_kd',  displayName: 'T├¬n hß╗Ö KD',  dataType: 'string' },
    { fieldName: 'chu_ho',     displayName: 'Chß╗º hß╗Ö',     dataType: 'string' },
    { fieldName: 'dia_chi',    displayName: '─Éß╗ïa chß╗ë',    dataType: 'string' },
    { fieldName: 'nganh_nghe', displayName: 'Ng├ánh nghß╗ü', dataType: 'string' },
    { fieldName: 'ngay_cap',   displayName: 'Ng├áy cß║Ñp',   dataType: 'date'   },
  ],
  tbl_giay_phep: [
    { fieldName: 'so_giay_phep',   displayName: 'Sß╗æ giß║Ñy ph├⌐p',   dataType: 'string' },
    { fieldName: 'ten_co_so',      displayName: 'T├¬n c╞í sß╗ƒ',      dataType: 'string' },
    { fieldName: 'loai_giay_phep', displayName: 'Loß║íi giß║Ñy ph├⌐p', dataType: 'string' },
    { fieldName: 'ngay_cap',       displayName: 'Ng├áy cß║Ñp',       dataType: 'date'   },
    { fieldName: 'ngay_het_han',   displayName: 'Ng├áy hß║┐t hß║ín',   dataType: 'date'   },
    { fieldName: 'co_quan_cap',    displayName: 'C╞í quan cß║Ñp',    dataType: 'string' },
  ],
  tbl_ly_lich_tu_phap: [
    { fieldName: 'so_phieu',  displayName: 'Sß╗æ phiß║┐u LLTP', dataType: 'string' },
    { fieldName: 'ho_ten',    displayName: 'Hß╗ì v├á t├¬n',     dataType: 'string' },
    { fieldName: 'ngay_sinh', displayName: 'Ng├áy sinh',     dataType: 'date'   },
    { fieldName: 'so_cccd',   displayName: 'Sß╗æ CCCD',       dataType: 'string' },
    { fieldName: 'ket_qua',   displayName: 'Kß║┐t quß║ú',       dataType: 'string' },
    { fieldName: 'ngay_cap',  displayName: 'Ng├áy cß║Ñp',      dataType: 'date'   },
  ],
  tbl_an_tich: [
    { fieldName: 'ma_an_tich', displayName: 'M├ú ├ín t├¡ch',    dataType: 'string' },
    { fieldName: 'ho_ten',     displayName: 'Hß╗ì v├á t├¬n',     dataType: 'string' },
    { fieldName: 'toi_danh',   displayName: 'Tß╗Öi danh',      dataType: 'string' },
    { fieldName: 'hinh_phat',  displayName: 'H├¼nh phß║ít',     dataType: 'string' },
    { fieldName: 'ngay_phat',  displayName: 'Ng├áy ph├ín x├⌐t', dataType: 'date'   },
  ],
  tbl_cong_chung: [
    { fieldName: 'ma_giao_dich',      displayName: 'M├ú giao dß╗ïch',       dataType: 'string' },
    { fieldName: 'loai_hop_dong',     displayName: 'Loß║íi hß╗úp ─æß╗ông',      dataType: 'string' },
    { fieldName: 'to_chuc_cong_chung',displayName: 'Tß╗ò chß╗⌐c c├┤ng chß╗⌐ng', dataType: 'string' },
    { fieldName: 'ngay_cong_chung',   displayName: 'Ng├áy c├┤ng chß╗⌐ng',    dataType: 'date'   },
    { fieldName: 'ben_a',             displayName: 'B├¬n A',               dataType: 'string' },
    { fieldName: 'ben_b',             displayName: 'B├¬n B',               dataType: 'string' },
  ],
  tbl_luat_su: [
    { fieldName: 'so_the',       displayName: 'Sß╗æ thß║╗ LS',    dataType: 'string' },
    { fieldName: 'ho_ten',       displayName: 'Hß╗ì v├á t├¬n',    dataType: 'string' },
    { fieldName: 'doan_luat_su', displayName: '─Éo├án luß║¡t s╞░', dataType: 'string' },
    { fieldName: 'ngay_cap',     displayName: 'Ng├áy cß║Ñp thß║╗', dataType: 'date'   },
    { fieldName: 'trang_thai',   displayName: 'Trß║íng th├íi',   dataType: 'string' },
  ],
  tbl_tro_giup: [
    { fieldName: 'ma_ho_so',       displayName: 'M├ú hß╗ô s╞í',       dataType: 'string' },
    { fieldName: 'ho_ten',         displayName: 'Hß╗ì v├á t├¬n',       dataType: 'string' },
    { fieldName: 'loai_ho_tro',    displayName: 'Loß║íi hß╗ù trß╗ú',     dataType: 'string' },
    { fieldName: 'ngay_tiep_nhan', displayName: 'Ng├áy tiß║┐p nhß║¡n',  dataType: 'date'   },
    { fieldName: 'trang_thai',     displayName: 'Trß║íng th├íi',      dataType: 'string' },
  ],
};

const FIELD_DATA_TYPES: { value: FieldDataType; label: string }[] = [
  { value: 'string',   label: 'Chuß╗ùi (String)' },
  { value: 'number',   label: 'Sß╗æ (Number)' },
  { value: 'date',     label: 'Ng├áy (Date)' },
  { value: 'datetime', label: 'Ng├áy giß╗¥ (DateTime)' },
  { value: 'boolean',  label: 'Logic (Boolean)' },
  { value: 'text',     label: 'V─ân bß║ún d├ái (Text)' },
  { value: 'email',    label: 'Email' },
  { value: 'phone',    label: 'Sß╗æ ─æiß╗çn thoß║íi' },
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
  // Step 3 ΓÇö ├ính xß║í cß╗Öt nguß╗ôn ΓåÆ thuß╗Öc t├¡nh (key thuß╗Öc t├¡nh ΓåÆ key sourceId ΓåÆ t├¬n cß╗Öt)
  mapping: Record<string, Record<string, string>>;
  // Step 3 ΓÇö gom nguß╗ôn 1:n (key sourceId ΓåÆ key thuß╗Öc t├¡nh ΓåÆ GroupRule)
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
}

const MANAGING_UNITS = [
  'Cß╗Ñc H├ánh ch├¡nh t╞░ ph├íp',
  'Cß╗Ñc Bß╗ò trß╗ú t╞░ ph├íp',
  'Cß╗Ñc Phß╗ò biß║┐n, GDPL v├á Trß╗ú gi├║p ph├íp l├╜',
  'Cß╗Ñc ─É─âng k├╜ giao dß╗ïch bß║úo ─æß║úm v├á Bß╗ôi th╞░ß╗¥ng nh├á n╞░ß╗¢c',
  'Cß╗Ñc Quß║ún l├╜ thi h├ánh ├ín d├ón sß╗▒',
  'Cß╗Ñc ─É─âng k├╜ kinh doanh',
  'Cß╗Ñc C├┤ng nghß╗ç th├┤ng tin',
  'Vß╗Ñ Ph├íp luß║¡t d├ón sß╗▒ - Kinh tß║┐',
  'Vß╗Ñ Ph├íp luß║¡t h├¼nh sß╗▒ - H├ánh ch├¡nh',
  'Vß╗Ñ Ph├íp luß║¡t quß╗æc tß║┐',
  'Vß╗Ñ C├íc vß║Ñn ─æß╗ü chung vß╗ü x├óy dß╗▒ng ph├íp luß║¡t',
  'Vß╗Ñ Kß║┐ hoß║ích - T├ái ch├¡nh',
  'V─ân ph├▓ng Bß╗Ö',
  'Bß╗Ö T╞░ ph├íp',
  'Bß╗Ö Nß╗Öi vß╗Ñ',
  'Bß╗Ö C├┤ng an',
  'Bß╗Ö Kß║┐ hoß║ích v├á ─Éß║ºu t╞░',
];

const MOCK_REVIEWERS = [
  { id: 'rv-01', name: 'Nguyß╗àn V─ân An', title: 'Tr╞░ß╗ƒng ph├▓ng CNTT' },
  { id: 'rv-02', name: 'Trß║ºn Thß╗ï B├¼nh', title: 'Ph├│ Cß╗Ñc tr╞░ß╗ƒng' },
  { id: 'rv-03', name: 'L├¬ V─ân C╞░ß╗¥ng', title: 'Tr╞░ß╗ƒng ban Quß║ún l├╜ dß╗» liß╗çu' },
  { id: 'rv-04', name: 'Phß║ím Thß╗ï Dung', title: 'Gi├ím ─æß╗æc Kho dß╗» liß╗çu' },
  { id: 'rv-05', name: 'Ho├áng V─ân Em', title: 'Tr╞░ß╗ƒng ph├▓ng Ph├íp chß║┐' },
];

const WIZARD_MOCK_ENTITIES = [
  { id: 'me-citizen',   code: 'CITIZEN',   name: 'C├┤ng d├ón' },
  { id: 'me-org',       code: 'ORG',       name: 'Tß╗ò chß╗⌐c' },
  { id: 'me-authority', code: 'AUTHORITY', name: 'C╞í quan nh├á n╞░ß╗¢c' },
  { id: 'me-address',   code: 'ADDRESS',   name: '─Éß╗ïa chß╗ë h├ánh ch├¡nh' },
  { id: 'me-land',      code: 'LAND',      name: '─Éß║Ñt ─æai' },
  { id: 'me-vehicle',   code: 'VEHICLE',   name: 'Ph╞░╞íng tiß╗çn' },
  { id: 'me-license',   code: 'LICENSE',   name: 'Giß║Ñy ph├⌐p' },
];

const MATCH_METHOD_LABELS: Record<MatchMethod, string> = {
  exact: 'Khß╗¢p tuyß╗çt ─æß╗æi',
  fuzzy: 'Khß╗¢p gß║ºn ─æ├║ng',
  normalized: 'Chuß║⌐n h├│a',
};

const FUZZY_ALGORITHMS: { value: FuzzyAlgorithm; label: string }[] = [
  { value: 'jaro_winkler', label: 'T╞░╞íng ─æß╗ông chuß╗ùi' },
  { value: 'levenshtein',  label: 'Khoß║úng c├ích chß╗ënh sß╗¡a' },
  { value: 'phonetic',     label: 'Ngß╗» ├óm' },
];

const CONFLICT_STRATEGY_LABELS: Record<ConflictStrategy, string> = {
  source: 'Theo nguß╗ôn',
  priority: '─Éß╗Ö ╞░u ti├¬n',
};

const WIZARD_MOCK_SAMPLES = [
  { id: 'sample-100',  label: '100 bß║ún ghi - kiß╗âm tra logic c╞í bß║ún' },
  { id: 'sample-500',  label: '500 bß║ún ghi - kiß╗âm tra tß╗╖ lß╗ç khß╗¢p' },
  { id: 'sample-1000', label: '1000 - kiß╗âm tra to├án diß╗çn' },
];

const MOCK_REVIEW_ITEMS = [
  { id: 'rev-1', pair: 'HT-0451 Γåö CC-1123', score: 82, reason: 'Tr├╣ng hß╗ì t├¬n v├á ng├áy sinh nh╞░ng kh├íc sß╗æ ─æß╗ïnh danh' },
  { id: 'rev-2', pair: 'HT-0777 Γåö CC-2098', score: 78, reason: 'T├¬n t╞░╞íng ─æß╗ông chuß╗ùi nh╞░ng ─æß╗ïa chß╗ë kh├íc nhau' },
  { id: 'rev-3', pair: 'HT-0912 Γåö CC-3011', score: 85, reason: 'Tr├╣ng sß╗æ CCCD nh╞░ng hß╗ì t├¬n thiß║┐u t├¬n ─æß╗çm' },
  { id: 'rev-4', pair: 'HT-1204 Γåö CC-4150', score: 76, reason: 'Tr├╣ng hß╗ì t├¬n, ng├áy sinh nh╞░ng kh├íc tß╗ënh th├ánh th╞░ß╗¥ng tr├║' },
  { id: 'rev-5', pair: 'HT-1588 Γåö CC-5099', score: 80, reason: 'Sß╗æ ─æß╗ïnh danh gß║ºn ─æ├║ng, kh├íc ng├áy cß║Ñp CCCD' },
];

const MOCK_UNMATCHED_ITEMS = [
  { id: 'unmatch-1', record: 'HT-9901', sourceName: 'Hß╗Ö tß╗ïch', maxScore: 42, reason: 'Kh├┤ng t├¼m thß║Ñy bß║ún ghi t╞░╞íng ─æß╗ông v╞░ß╗út ng╞░ß╗íng 75%', defaultAction: '' },
  { id: 'unmatch-2', record: 'CC-8820', sourceName: 'CCCD', maxScore: 35, reason: 'Sß╗æ ─æß╗ïnh danh v├á th├┤ng tin c├í nh├ón kh├íc biß╗çt ho├án to├án', defaultAction: '' },
  { id: 'unmatch-3', record: 'HT-9945', sourceName: 'Hß╗Ö tß╗ïch', maxScore: 48, reason: 'Tr├╣ng ng├áy sinh nh╞░ng th├┤ng tin t├¬n kh├┤ng tr├╣ng khß╗¢p', defaultAction: '' },
  { id: 'unmatch-4', record: 'CC-9102', sourceName: 'CCCD', maxScore: 28, reason: 'Bß║ún ghi thiß║┐u th├┤ng tin ─æß╗ïnh danh tß╗æi thiß╗âu', defaultAction: '' },
  { id: 'unmatch-5', record: 'HT-9988', sourceName: 'Hß╗Ö tß╗ïch', maxScore: 50, reason: '─Éiß╗âm so khß╗¢p thß║Ñp h╞ín ng╞░ß╗íng r├á so├ít 75%', defaultAction: '' },
];

const WIZARD_SOURCE_OPTIONS = ['Hß╗Ö tß╗ïch', 'CCCD', '─ÉKKD', 'LLTP', 'Bß╗ò trß╗ú t╞░ ph├íp'];

// ├ünh xß║í t├¬n nguß╗ôn ─æ├ú ─æ─âng k├╜ ß╗ƒ B╞░ß╗¢c 1 (wizardData.sources) sang id c╞í sß╗ƒ dß╗» liß╗çu DLDC t╞░╞íng ß╗⌐ng
const SOURCE_NAME_TO_DB_ID: Record<string, string> = {
  'Hß╗Ö tß╗ïch': 'hotich',
  'CCCD': 'cccd',
  '─ÉKKD': 'dkkd',
  'LLTP': 'lltp',
  'Bß╗ò trß╗ú t╞░ ph├íp': 'btdp',
};

const SOURCE_KIND_LABELS: Record<SourceKind, string> = {
  table: 'Bß║úng',
  view: 'View',
  query: 'Truy vß║Ñn',
};

const SOURCE_KIND_COLORS: Record<SourceKind, string> = {
  table: 'bg-blue-50 text-blue-700 border-blue-200',
  view: 'bg-purple-50 text-purple-700 border-purple-200',
  query: 'bg-amber-50 text-amber-700 border-amber-200',
};

const SOURCE_GRAIN_COLORS: Record<SourceGrain, string> = {
  '1:1': 'bg-slate-50 text-slate-700 border-slate-200',
  '1:n': 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const DATA_TYPE_LABELS: Record<DataType, string> = {
  individual: 'Thß╗▒c thß╗â C├í nh├ón',
  organization: 'Thß╗▒c thß╗â Tß╗ò chß╗⌐c',
  legal: 'Thß╗▒c thß╗â V─ân bß║ún/Sß╗▒ kiß╗çn ph├íp l├╜',
  asset: 'Thß╗▒c thß╗â T├ái sß║ún',
};

const SCOPE_TYPE_LABELS: Record<ScopeType, string> = {
  national: 'Cß║Ñp quß╗æc gia',
  ministry: 'Cß║Ñp bß╗Ö',
  provincial: 'Cß║Ñp tß╗ënh/th├ánh',
  internal: 'Nß╗Öi bß╗Ö',
};

const LIFECYCLE_STATUS_LABELS: Record<LifecycleStatus, string> = {
  draft: '─Éang soß║ín thß║úo',
  active: '─É├ú hiß╗çu lß╗▒c',
  inactive: 'Ngß╗½ng sß╗¡ dß╗Ñng',
  archived: '─É├ú l╞░u trß╗»',
};

// T├¬n cß╗Öt mock ─æß╗â ├ính xß║í nguß╗ôn ΓåÆ thuß╗Öc t├¡nh
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

// Nh├│m kiß╗âu dß╗» liß╗çu t╞░╞íng th├¡ch ΓÇö d├╣ng ─æß╗â ph├ít hiß╗çn lß╗çch kiß╗âu khi ├ính xß║í cß╗Öt nguß╗ôn ΓåÆ thuß╗Öc t├¡nh
const DATA_TYPE_GROUP: Record<FieldDataType, string> = {
  string: 'text', text: 'text', email: 'text', phone: 'text', url: 'text',
  number: 'number',
  date: 'date', datetime: 'date',
  boolean: 'boolean',
};

const GROUP_RULE_LABELS: Record<GroupRuleType, string> = {
  latest: 'Bß║ún ghi mß╗¢i nhß║Ñt',
  most_frequent: 'Xuß║Ñt hiß╗çn nhiß╗üu nhß║Ñt',
  max: 'Lß╗¢n nhß║Ñt',
  min: 'Nhß╗Å nhß║Ñt',
};

const REL_TYPE_LABELS: Record<WizardRelType, string> = {
  '1-1': '1 - 1 (Mß╗Öt - Mß╗Öt)',
  '1-n': '1 - n (Mß╗Öt - Nhiß╗üu)',
  'n-1': 'n - 1 (Nhiß╗üu - Mß╗Öt)',
  'n-n': 'n - n (Nhiß╗üu - Nhiß╗üu)',
};

const REL_TYPE_COLORS: Record<WizardRelType, string> = {
  '1-1': 'bg-teal-50 text-teal-700 border-teal-200',
  '1-n': 'bg-blue-50 text-blue-700 border-blue-200',
  'n-1': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'n-n': 'bg-purple-50 text-purple-700 border-purple-200',
};

const BASE_TARGET_FIELDS = [
  { name: 'id',     label: 'ID ─æß╗ïnh danh' },
  { name: 'code',   label: 'M├ú ─æß╗ïnh danh' },
  { name: 'name',   label: 'T├¬n/Ti├¬u ─æß╗ü' },
  { name: 'status', label: 'Trß║íng th├íi' },
];

const EMPTY_REL_FORM: RelFormData = {
  targetEntityId: '', targetEntityName: '', type: 'n-1',
  sourceKey: '', targetKey: '', displayField: '', mappingTable: '',
};

const steps = [
  { number: 1, title: 'Khß╗ƒi tß║ío dß╗» liß╗çu chß╗º', description: 'Th├┤ng tin c╞í bß║ún v├á nguß╗ôn dß╗» liß╗çu' },
  { number: 2, title: 'Tß║ío thuß╗Öc t├¡nh', description: '─Éß╗ïnh ngh─⌐a c├íc tr╞░ß╗¥ng dß╗» liß╗çu' },
  { number: 3, title: 'Quy tß║»c hß╗úp nhß║Ñt', description: 'Thiß║┐t lß║¡p quy tß║»c merge dß╗» liß╗çu' },
  { number: 4, title: 'Thiß║┐t lß║¡p quan hß╗ç', description: 'Li├¬n kß║┐t giß╗»a c├íc thß╗▒c thß╗â' },
  { number: 5, title: '─Éß╗ïnh danh duy nhß║Ñt', description: 'Thiß║┐t lß║¡p quy tß║»c m├ú ─æß╗ïnh danh' },
  { number: 6, title: 'Ph├¬ duyß╗çt', description: 'Xem lß║íi v├á gß╗¡i ph├¬ duyß╗çt' },
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
    sources: [
      { id: 'src-hotich', name: 'Hß╗Ö tß╗ïch', kind: 'table', grain: '1:1' },
      { id: 'src-cccd', name: 'CCCD', kind: 'table', grain: '1:1' },
    ],
    dataSource: 'dldc',
    attributes: [],
    mergeRules: [],
    mapping: {},
    groupRules: {},
    relationships: [],
    approvalReviewer: '',
    approvalNotes: ''
  });

  const [currentAttribute, setCurrentAttribute] = useState<AttributeForm>({
    fieldName: '',
    displayName: '',
    dataType: 'string',
    required: false,
    isKey: false,
    defaultValue: ''
  });

  // Step 5 state ΓÇö Thiß║┐t lß║¡p quan hß╗ç
  const [relFormOpen, setRelFormOpen] = useState(false);
  const [editingRelId, setEditingRelId] = useState<string | null>(null);
  const [relFormData, setRelFormData] = useState<RelFormData>(EMPTY_REL_FORM);
  const [relFormError, setRelFormError] = useState('');
  const [relSearch, setRelSearch] = useState('');

  // Step 2 state ΓÇö ─Éß╗ïnh danh duy nhß║Ñt
  const [identifierConfig, setIdentifierConfig] = useState<IdentifierConfig>({
    prefix: '',
    separator: '-',
    digits: 6,
    startFrom: 1,
    increment: 1,
    suffix: '',
    checkDuplicate: true,
  });

  // Step 3 (old step 2) state ΓÇö Matching/Extraction/Merge
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

  // Step 4 ΓÇö sub-tabs + test simulation + hard-block input
  const [mergeSubTab, setMergeSubTab] = useState<MergeSubTab>('match');
  const [hardBlockInput, setHardBlockInput] = useState('');
  const [testSample, setTestSample] = useState('');
  const [testRun, setTestRun] = useState(false);
  const [reviewSelectedIds, setReviewSelectedIds] = useState<string[]>([]);
  const [reviewPage, setReviewPage] = useState<number>(1);
  const [unmatchedSelectedIds, setUnmatchedSelectedIds] = useState<string[]>([]);
  const [unmatchedActions, setUnmatchedActions] = useState<Record<string, 'single_source' | 'discard' | ''>>({});
  const [unmatchedPage, setUnmatchedPage] = useState<number>(1);
  const [reviewProcessedIds, setReviewProcessedIds] = useState<string[]>([]);
  const [reviewSentIds, setReviewSentIds] = useState<string[]>([]);
  const [unmatchedProcessedIds, setUnmatchedProcessedIds] = useState<string[]>([]);

  const [toastState, setToastState] = useState<{
    show: boolean;
    title: string;
    message: string;
  }>({ show: false, title: '', message: '' });

  const triggerToast = (title: string, message: string) => {
    setToastState({ show: true, title, message });
    setTimeout(() => {
      setToastState(prev => ({ ...prev, show: false }));
    }, 3500);
  };

  // Step 1 ΓÇö ─æ─âng k├╜ nguß╗ôn dß╗» liß╗çu (form th├¬m nguß╗ôn inline)
  const [sourceFormOpen, setSourceFormOpen] = useState(false);
  const [sourceForm, setSourceForm] = useState<{ name: string; kind: SourceKind; grain: SourceGrain }>({
    name: WIZARD_SOURCE_OPTIONS[0], kind: 'table', grain: '1:1',
  });

  const handleAddSource = () => {
    if (!sourceForm.name) return;
    const newSource: WizardSource = {
      id: `src-${Date.now()}`,
      name: sourceForm.name,
      kind: sourceForm.kind,
      grain: sourceForm.grain,
    };
    setWizardData(prev => ({ ...prev, sources: [...prev.sources, newSource] }));
    setSourceForm({ name: WIZARD_SOURCE_OPTIONS[0], kind: 'table', grain: '1:1' });
    setSourceFormOpen(false);
  };

  const handleRemoveSource = (sourceId: string) => {
    setWizardData(prev => {
      // dß╗ìn mapping & groupRules tham chiß║┐u tß╗¢i nguß╗ôn bß╗ï x├│a
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

  // Kiß╗âm tra lß╗çch nh├│m kiß╗âu dß╗» liß╗çu giß╗»a cß╗Öt nguß╗ôn ─æ├ú chß╗ìn v├á thuß╗Öc t├¡nh ─æ├¡ch
  const isMappingMismatch = (targetType: FieldDataType, sourceColumn: string) => {
    if (!sourceColumn) return false;
    const sourceType = MOCK_SOURCE_COLUMNS.find(c => c.name === sourceColumn)?.dataType;
    if (!sourceType) return false;
    return DATA_TYPE_GROUP[sourceType] !== DATA_TYPE_GROUP[targetType];
  };

  const handleGroupRuleChange = (sourceId: string, attrKey: string, patch: Partial<GroupRule>) => {
    setWizardData(prev => {
      const forSource = prev.groupRules[sourceId] || {};
      const current = forSource[attrKey] || { ruleType: 'latest' as GroupRuleType, timeColumn: '' };
      return {
        ...prev,
        groupRules: {
          ...prev.groupRules,
          [sourceId]: { ...forSource, [attrKey]: { ...current, ...patch } },
        },
      };
    });
  };

  // DLDC step 2 state ΓÇö chß╗ìn nhiß╗üu CSDL c├╣ng l├║c (chip ─æa lß╗▒a chß╗ìn)
  const [dldcSelectedDbIds, setDldcSelectedDbIds] = useState<string[]>([]);
  const [dldcFieldRows, setDldcFieldRows] = useState<DldcFieldRow[]>([]);

  // Gß╗Öp tr╞░ß╗¥ng cß╗ºa tß║Ñt cß║ú bß║úng thuß╗Öc c├íc CSDL ─æang chß╗ìn; tr├╣ng t├¬n tr╞░ß╗¥ng giß╗»a
  // c├íc bß║úng kh├íc nhau ─æ╞░ß╗úc giß╗» lß║íi nh╞░ 2 d├▓ng ri├¬ng (─æ├ính dß║Ñu t├¬n bß║úng ─æß╗â ph├ón biß╗çt)
  // thay v├¼ loß║íi bß╗Å, v├¼ c├╣ng t├¬n nh╞░ng kh├íc bß║úng c├│ thß╗â mang ngß╗» ngh─⌐a kh├íc nhau.
  const buildDldcFieldRows = (dbIds: string[]): DldcFieldRow[] => {
    const entries = dbIds.flatMap(dbId => (DLDC_TABLES[dbId] || []).flatMap(table =>
      (DLDC_FIELDS[table.id] || []).map(f => ({ table, field: f }))
    ));
    const nameCounts: Record<string, number> = {};
    entries.forEach(({ field }) => { nameCounts[field.fieldName] = (nameCounts[field.fieldName] || 0) + 1; });
    return entries.map(({ table, field }, i) => {
      const isDup = nameCounts[field.fieldName] > 1;
      return {
        id: `fr-${table.id}-${field.fieldName}-${i}`,
        shared: false,
        isPK: false,
        tableId: table.id,
        sourceJoinId: null,
        columnName: isDup ? `${field.fieldName}__${table.id}` : field.fieldName,
        displayName: isDup ? `${field.displayName} (${table.displayName})` : field.displayName,
        dataType: field.dataType,
      };
    });
  };

  const handleToggleAllDldcShared = () => {
    setDldcFieldRows(prev => {
      const allShared = prev.length > 0 && prev.every(r => r.shared);
      return prev.map(r => ({ ...r, shared: !allShared }));
    });
  };

  const handleDldcDbToggle = (dbId: string) => {
    const next = dldcSelectedDbIds.includes(dbId)
      ? dldcSelectedDbIds.filter(id => id !== dbId)
      : [...dldcSelectedDbIds, dbId];
    setDldcSelectedDbIds(next);
    setDldcFieldRows(buildDldcFieldRows(next));
  };

  const dldcAvailableTables = dldcSelectedDbIds.flatMap(id => DLDC_TABLES[id] || []);

  const handleDldcFieldToggle = (rowId: string, field: 'shared' | 'isPK') => {
    setDldcFieldRows(prev => prev.map(r => r.id === rowId ? { ...r, [field]: !r[field] } : r));
  };

  const handleDldcRemoveRow = (rowId: string) => {
    setDldcFieldRows(prev => prev.filter(r => r.id !== rowId));
  };

  // ΓöÇΓöÇ Step 5 handlers ΓöÇΓöÇ
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
    if (!relFormData.targetEntityId) { setRelFormError('Vui l├▓ng chß╗ìn thß╗▒c thß╗â ─æ├¡ch.'); return; }
    if (relFormData.type === 'n-n') {
      if (!relFormData.mappingTable || !relFormData.sourceKey || !relFormData.targetKey) {
        setRelFormError('Quan hß╗ç n-n cß║ºn c├│ ─æß║ºy ─æß╗º: bß║úng li├¬n kß║┐t, kh├│a ngoß║íi nguß╗ôn v├á ─æ├¡ch.'); return;
      }
    } else {
      if (!relFormData.sourceKey || !relFormData.targetKey) {
        setRelFormError('Cß║ºn khai b├ío ─æß║ºy ─æß╗º kh├│a nguß╗ôn v├á kh├│a ─æ├¡ch.'); return;
      }
    }
    const hasDuplicate = wizardData.relationships.some(r =>
      r.id !== (editingRelId || '') &&
      r.targetEntityId === relFormData.targetEntityId &&
      r.type === relFormData.type
    );
    if (hasDuplicate) { setRelFormError('─É├ú tß╗ôn tß║íi quan hß╗ç c├╣ng loß║íi vß╗¢i thß╗▒c thß╗â n├áy.'); return; }

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

  // Step 1 ΓÇö kiß╗âm tra tr├╣ng M├ú / T├¬n
  const codeTrim = (wizardData.code || '').trim();
  const nameTrim = (wizardData.name || '').trim();
  const codeDuplicate = codeTrim.length > 0 && WIZARD_MOCK_ENTITIES.some(e => e.code.toLowerCase() === codeTrim.toLowerCase());
  const nameDuplicate = nameTrim.length > 0 && WIZARD_MOCK_ENTITIES.some(e => e.name.toLowerCase() === nameTrim.toLowerCase());

  // Step 4 ΓÇö tß╗òng trß╗ìng sß╗æ so khß╗¢p
  const totalWeight = matchingRules.reduce((sum, r) => sum + (Number(r.weight) || 0), 0);

  // Nguß╗ôn ─æ├ú ─æ─âng k├╜ ß╗ƒ B╞░ß╗¢c 1
  const registeredSources = wizardData.sources;
  const oneToManySources = registeredSources.filter(s => s.grain === '1:n');
  // Chß╗ë hiß╗çn tab "Hß╗úp nhß║Ñt gi├í trß╗ï" khi c├│ ΓëÑ2 nguß╗ôn
  const showSurvivorTab = registeredSources.length >= 2;
  // Nß║┐u tab survivor bß╗ï ß║⌐n nh╞░ng ─æang chß╗ìn ΓåÆ tß╗▒ chuyß╗ân vß╗ü 'match'
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
    ? dldcFieldRows.filter(r => r.shared).map(r => ({ fieldName: r.columnName, displayName: r.displayName, dataType: r.dataType }))
    : wizardData.attributes.map(a => ({ fieldName: a.fieldName, displayName: a.displayName, dataType: a.dataType }));

  const hasMappingMismatch = availableFields.some(attr =>
    registeredSources.some(src => isMappingMismatch(attr.dataType, wizardData.mapping[attr.fieldName]?.[src.id] || ''))
  );

  const sourceEntityFields = [
    ...(wizardData.dataSource === 'dldc'
      ? dldcFieldRows.filter(r => r.shared).map(r => ({ name: r.columnName, label: r.displayName }))
      : wizardData.attributes.map(a => ({ name: a.fieldName, label: a.displayName }))),
    ...(identifierConfig.prefix ? [{ name: 'identifier_code', label: 'M├ú ─æß╗ïnh danh' }] : []),
  ];

  const handleNext = () => {
    // Validation for each step
    if (currentStep === 1) {
      if (!wizardData.code?.trim() || !wizardData.name || !wizardData.managingAgency) {
        alert('Vui l├▓ng ─æiß╗ün ─æß║ºy ─æß╗º th├┤ng tin bß║»t buß╗Öc ß╗ƒ b╞░ß╗¢c 1');
        return;
      }
      if (codeDuplicate) {
        alert('M├ú thß╗▒c thß╗â ─æ├ú tß╗ôn tß║íi, vui l├▓ng nhß║¡p gi├í trß╗ï kh├íc.');
        return;
      }
      if (nameDuplicate) {
        alert('T├¬n dß╗» liß╗çu chß╗º ─æ├ú tß╗ôn tß║íi, vui l├▓ng nhß║¡p gi├í trß╗ï kh├íc.');
        return;
      }
    }
    if (currentStep === 2) {
      if (wizardData.dataSource === 'dldc') {
        if (dldcFieldRows.filter(r => r.shared).length === 0) {
          alert('Vui l├▓ng chß╗ìn nguß╗ôn dß╗» liß╗çu v├á ├¡t nhß║Ñt 1 tr╞░ß╗¥ng chia sß║╗');
          return;
        }
      } else {
        if (wizardData.attributes.length === 0) {
          alert('Vui l├▓ng th├¬m ├¡t nhß║Ñt 1 thuß╗Öc t├¡nh');
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
        alert(`Tß╗òng trß╗ìng sß╗æ c├íc quy tß║»c so khß╗¢p phß║úi bß║▒ng 100%. Hiß╗çn tß║íi: ${totalWeight}%.`);
        return;
      }
      if (mergeConfig.autoThreshold <= mergeConfig.reviewThreshold) {
        alert('Ng╞░ß╗íng tß╗▒ ─æß╗Öng gß╗Öp phß║úi lß╗¢n h╞ín ng╞░ß╗íng cß║ºn r├á so├ít.');
        return;
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
      alert('Vui l├▓ng nhß║¡p ghi ch├║ ph├¬ duyß╗çt');
      return;
    }
    onSubmit(wizardData);
    onClose();
  };

  const handleAddAttribute = () => {
    if (!currentAttribute.fieldName || !currentAttribute.displayName) {
      alert('Vui l├▓ng ─æiß╗ün t├¬n tr╞░ß╗¥ng v├á t├¬n hiß╗ân thß╗ï');
      return;
    }

    // Check duplicate
    if (wizardData.attributes.some(a => a.fieldName === currentAttribute.fieldName)) {
      alert('T├¬n tr╞░ß╗¥ng ─æ├ú tß╗ôn tß║íi');
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
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl text-slate-900">Tß║ío mß╗¢i dß╗» liß╗çu chß╗º</h2>
            <p className="text-[13px] text-slate-600 mt-1">Quy tr├¼nh 6 b╞░ß╗¢c</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded" title="─É├│ng" aria-label="─É├│ng">
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
          {/* Step 1: Khß╗ƒi tß║ío dß╗» liß╗çu chß╗º */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="text-[13px] font-semibold text-blue-900 mb-1">B╞░ß╗¢c 1: Khß╗ƒi tß║ío dß╗» liß╗çu chß╗º</h3>
                <p className="text-[13px] text-blue-700">
                  Nhß║¡p th├┤ng tin c╞í bß║ún v├á cß║Ñu h├¼nh nguß╗ôn dß╗» liß╗çu cho thß╗▒c thß╗â dß╗» liß╗çu chß╗º
                </p>
              </div>

              {/* M├ú thß╗▒c thß╗â */}
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  M├ú thß╗▒c thß╗â <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={wizardData.code || ''}
                  onChange={(e) => setWizardData({ ...wizardData, code: e.target.value })}
                  placeholder="VD: MD-CITIZEN-001"
                  className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700"
                />
                {codeTrim.length > 0 && (
                  codeDuplicate ? (
                    <p className="flex items-center gap-1 mt-1 text-[13px] text-red-600">
                      <AlertCircle className="w-3.5 h-3.5" /> ─É├ú tß╗ôn tß║íi, vui l├▓ng nhß║¡p gi├í trß╗ï kh├íc
                    </p>
                  ) : (
                    <p className="flex items-center gap-1 mt-1 text-[13px] text-green-600">
                      <Check className="w-3.5 h-3.5" /> Hß╗úp lß╗ç, ch╞░a tr├╣ng
                    </p>
                  )
                )}
              </div>

              {/* T├¬n dß╗» liß╗çu chß╗º */}
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  T├¬n dß╗» liß╗çu chß╗º <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={wizardData.name}
                  onChange={(e) => setWizardData({ ...wizardData, name: e.target.value })}
                  placeholder="VD: Bß╗Ö dß╗» liß╗çu chß╗º C├┤ng d├ón"
                  className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700"
                />
                {nameTrim.length > 0 && (
                  nameDuplicate ? (
                    <p className="flex items-center gap-1 mt-1 text-[13px] text-red-600">
                      <AlertCircle className="w-3.5 h-3.5" /> ─É├ú tß╗ôn tß║íi, vui l├▓ng nhß║¡p gi├í trß╗ï kh├íc
                    </p>
                  ) : (
                    <p className="flex items-center gap-1 mt-1 text-[13px] text-green-600">
                      <Check className="w-3.5 h-3.5" /> Hß╗úp lß╗ç, ch╞░a tr├╣ng
                    </p>
                  )
                )}
              </div>

              {/* Loß║íi thß╗▒c thß╗â + Phß║ím vi */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Loß║íi thß╗▒c thß╗â <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={wizardData.dataType}
                    onChange={(e) => setWizardData({ ...wizardData, dataType: e.target.value as DataType })}
                    className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 cursor-pointer"
                  >
                    <option value="individual">Thß╗▒c thß╗â C├í nh├ón</option>
                    <option value="organization">Thß╗▒c thß╗â Tß╗ò chß╗⌐c</option>
                    <option value="legal">Thß╗▒c thß╗â V─ân bß║ún/Sß╗▒ kiß╗çn ph├íp l├╜</option>
                    <option value="asset">Thß╗▒c thß╗â T├ái sß║ún</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                    Phß║ím vi sß╗¡ dß╗Ñng <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={wizardData.scope}
                    onChange={(e) => setWizardData({ ...wizardData, scope: e.target.value as ScopeType })}
                    className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 cursor-pointer"
                  >
                    <option value="national">Cß║Ñp quß╗æc gia</option>
                    <option value="ministry">Cß║Ñp bß╗Ö</option>
                    <option value="provincial">Cß║Ñp tß╗ënh/th├ánh</option>
                    <option value="internal">Nß╗Öi bß╗Ö</option>
                  </select>
                </div>
              </div>

              {/* ─É╞ín vß╗ï chß╗º quß║ún */}
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  ─É╞ín vß╗ï chß╗º quß║ún <span className="text-red-600">*</span>
                </label>
                <select
                  value={wizardData.managingAgency}
                  onChange={(e) => setWizardData({ ...wizardData, managingAgency: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 cursor-pointer"
                >
                  <option value="">-- Chß╗ìn ─æ╞ín vß╗ï chß╗º quß║ún --</option>
                  {MANAGING_UNITS.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              {/* M├┤ tß║ú ─æß╗æi t╞░ß╗úng */}
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">M├┤ tß║ú ─æß╗æi t╞░ß╗úng</label>
                <textarea
                  value={wizardData.description}
                  onChange={(e) => setWizardData({ ...wizardData, description: e.target.value })}
                  placeholder="M├┤ tß║ú t├│m tß║»t vß╗ü ─æß╗æi t╞░ß╗úng dß╗» liß╗çu chß╗º n├áy..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 resize-none"
                />
              </div>

              {/* T├¬n c╞í sß╗ƒ dß╗» liß╗çu / Hß╗ç thß╗æng */}
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  T├¬n c╞í sß╗ƒ dß╗» liß╗çu / Hß╗ç thß╗æng
                </label>
                <input
                  type="text"
                  value={wizardData.systemName || ''}
                  onChange={(e) => setWizardData({ ...wizardData, systemName: e.target.value })}
                  placeholder="VD: CSDL hß╗Ö tß╗ïch ─æiß╗çn tß╗¡, Hß╗ç thß╗æng TGPL..."
                  className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700"
                />
              </div>

              {/* Trß║íng th├íi v├▓ng ─æß╗¥i */}
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Trß║íng th├íi v├▓ng ─æß╗¥i
                </label>
                <select
                  value={wizardData.lifecycleStatus}
                  onChange={(e) => setWizardData({ ...wizardData, lifecycleStatus: e.target.value as LifecycleStatus })}
                  className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 cursor-pointer"
                >
                  <option value="draft">─Éang soß║ín thß║úo</option>
                  <option value="active">─É├ú hiß╗çu lß╗▒c</option>
                  <option value="inactive">Ngß╗½ng sß╗¡ dß╗Ñng</option>
                  <option value="archived">─É├ú l╞░u trß╗»</option>
                </select>
              </div>

              {/* ─É─âng k├╜ nguß╗ôn dß╗» liß╗çu (chip + grain) */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-[13px] font-bold text-slate-900">─É─âng k├╜ nguß╗ôn dß╗» liß╗çu</h4>
                    <p className="text-[13px] text-slate-500 mt-0.5">C├íc nguß╗ôn ─æ─âng k├╜ ß╗ƒ ─æ├óy sß║╜ ─æ╞░ß╗úc d├╣ng ─æß╗â ├ính xß║í ß╗ƒ B╞░ß╗¢c 2</p>
                  </div>
                  {!sourceFormOpen && (
                    <button
                      type="button"
                      onClick={() => setSourceFormOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 text-blue-600 text-[13px] font-medium rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Th├¬m nguß╗ôn
                    </button>
                  )}
                </div>

                {/* Danh s├ích chip */}
                <div className="flex flex-wrap items-center gap-2">
                  {wizardData.sources.length === 0 && (
                    <span className="text-[13px] text-slate-400">Ch╞░a ─æ─âng k├╜ nguß╗ôn dß╗» liß╗çu n├áo</span>
                  )}
                  {wizardData.sources.map(src => (
                    <span
                      key={src.id}
                      className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 bg-white border border-slate-200 rounded-full text-[13px]"
                    >
                      <span className="font-medium text-slate-700">{src.name}</span>
                      <span className={`px-1.5 py-0.5 rounded-full border text-[13px] font-medium ${SOURCE_KIND_COLORS[src.kind]}`}>
                        {SOURCE_KIND_LABELS[src.kind]}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded-full border text-[13px] font-medium ${SOURCE_GRAIN_COLORS[src.grain]}`}>
                        {src.grain}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSource(src.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                        title="X├│a nguß╗ôn"
                        aria-label="X├│a nguß╗ôn"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Form th├¬m nguß╗ôn inline */}
                {sourceFormOpen && (
                  <div className="mt-3 border border-blue-200 rounded-xl bg-blue-50/30 p-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[13px] font-medium text-slate-600 mb-1.5">T├¬n nguß╗ôn</label>
                        <select
                          value={sourceForm.name}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => setSourceForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
                        >
                          {WIZARD_SOURCE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Loß║íi nguß╗ôn</label>
                        <select
                          value={sourceForm.kind}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => setSourceForm(prev => ({ ...prev, kind: e.target.value as SourceKind }))}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
                        >
                          <option value="table">Bß║úng</option>
                          <option value="view">View</option>
                          <option value="query">Truy vß║Ñn</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[13px] font-medium text-slate-600 mb-1.5">─Éß╗Ö mß╗ïn (Grain)</label>
                        <select
                          value={sourceForm.grain}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => setSourceForm(prev => ({ ...prev, grain: e.target.value as SourceGrain }))}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
                        >
                          <option value="1:1">1:1 (Mß╗Öt - Mß╗Öt)</option>
                          <option value="1:n">1:n (Mß╗Öt - Nhiß╗üu)</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => { setSourceFormOpen(false); setSourceForm({ name: WIZARD_SOURCE_OPTIONS[0], kind: 'table', grain: '1:1' }); }}
                        className="px-3 py-1.5 border border-slate-200 text-slate-700 rounded-lg text-[13px] font-medium hover:bg-slate-50 transition-colors"
                      >
                        Hß╗ºy
                      </button>
                      <button
                        type="button"
                        onClick={handleAddSource}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[13px] font-medium hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Th├¬m v├áo danh s├ích
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Step 5: ─Éß╗ïnh danh duy nhß║Ñt */}
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
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-[13px] font-semibold text-blue-900 mb-1">B╞░ß╗¢c 5: ─Éß╗ïnh danh duy nhß║Ñt</h3>
                  <p className="text-[13px] text-blue-700">
                    Thiß║┐t lß║¡p cß║Ñu tr├║c m├ú ─æß╗ïnh danh to├án cß╗Ñc cho tß╗½ng bß║ún ghi cß╗ºa thß╗▒c thß╗â n├áy
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  {/* Left ΓÇö form */}
                  <div className="space-y-5">
                    <div className="border border-slate-200 rounded-xl p-5 space-y-5 bg-white">
                      <h4 className="text-[13px] font-bold text-slate-800">Cß║Ñu tr├║c m├ú ─æß╗ïnh danh</h4>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-medium text-slate-700 mb-2">Tiß╗ün tß╗æ (Prefix)</label>
                          <input
                            type="text"
                            value={identifierConfig.prefix}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setIdentifierConfig(prev => ({ ...prev, prefix: e.target.value.toUpperCase() }))}
                            placeholder="VD: NDAN, ORG"
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 uppercase"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-slate-700 mb-2">Hß║¡u tß╗æ (Suffix)</label>
                          <input
                            type="text"
                            value={identifierConfig.suffix}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setIdentifierConfig(prev => ({ ...prev, suffix: e.target.value.toUpperCase() }))}
                            placeholder="─Éß╗â trß╗æng nß║┐u kh├┤ng d├╣ng"
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 uppercase"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-medium text-slate-700 mb-2">K├╜ tß╗▒ ph├ón c├ích</label>
                          <select
                            value={identifierConfig.separator}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setIdentifierConfig(prev => ({ ...prev, separator: e.target.value as SeparatorType }))}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
                          >
                            <option value="none">Kh├┤ng d├╣ng</option>
                            <option value="-">Gß║ích ngang ( - )</option>
                            <option value=".">Dß║Ñu chß║Ñm ( . )</option>
                            <option value="/">Dß║Ñu gß║ích ch├⌐o ( / )</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-slate-700 mb-2">─Éß╗Ö d├ái sß╗æ thß╗⌐ tß╗▒</label>
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
                      <h4 className="text-[13px] font-bold text-slate-800">Sß╗æ tß╗▒ t─âng</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-medium text-slate-700 mb-2">Bß║»t ─æß║ºu tß╗½</label>
                          <input
                            type="number" min={0}
                            value={identifierConfig.startFrom}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setIdentifierConfig(prev => ({ ...prev, startFrom: Number(e.target.value) }))}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-slate-700 mb-2">B╞░ß╗¢c t─âng</label>
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
                        <p className="text-[13px] font-medium text-slate-700">Kiß╗âm tra tr├╣ng lß║╖p khi tß║ío mß╗¢i</p>
                        <p className="text-[13px] text-slate-500 mt-1">Hß╗ç thß╗æng tß╗½ chß╗æi tß║ío bß║ún ghi nß║┐u m├ú ─æß╗ïnh danh ─æ├ú tß╗ôn tß║íi</p>
                      </div>
                    </label>
                  </div>

                  {/* Right ΓÇö preview */}
                  <div className="space-y-5">
                    <div className="border border-blue-200 rounded-xl p-5 bg-blue-50 space-y-5">
                      <h4 className="text-[13px] font-bold text-blue-900">Mß║½u m├ú ─æß╗ïnh danh</h4>

                      <div className="bg-white border border-blue-200 rounded-lg px-6 py-7 text-center">
                        {previewCode ? (
                          <code className="text-2xl font-mono font-bold text-blue-700 tracking-widest">
                            {previewCode}
                          </code>
                        ) : (
                          <span className="text-[13px] text-slate-400">Nhß║¡p tiß╗ün tß╗æ ─æß╗â xem mß║½u m├ú</span>
                        )}
                      </div>

                      <div className="space-y-3 text-[13px]">
                        <div className="flex justify-between items-center py-1.5 border-b border-blue-100">
                          <span className="text-slate-600">M├ú thß╗⌐ 1:</span>
                          <code className="font-mono font-semibold text-slate-800">
                            {[identifierConfig.prefix, String(identifierConfig.startFrom).padStart(identifierConfig.digits, '0'), identifierConfig.suffix].filter(Boolean).join(sep) || 'ΓÇö'}
                          </code>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b border-blue-100">
                          <span className="text-slate-600">M├ú thß╗⌐ 2:</span>
                          <code className="font-mono font-semibold text-slate-800">
                            {[identifierConfig.prefix, String(identifierConfig.startFrom + identifierConfig.increment).padStart(identifierConfig.digits, '0'), identifierConfig.suffix].filter(Boolean).join(sep) || 'ΓÇö'}
                          </code>
                        </div>
                        <div className="flex justify-between items-center py-1.5">
                          <span className="text-slate-600">M├ú thß╗⌐ 3:</span>
                          <code className="font-mono font-semibold text-slate-800">
                            {[identifierConfig.prefix, String(identifierConfig.startFrom + identifierConfig.increment * 2).padStart(identifierConfig.digits, '0'), identifierConfig.suffix].filter(Boolean).join(sep) || 'ΓÇö'}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
                      <h4 className="text-[13px] font-bold text-slate-800">T├│m tß║»t cß║Ñu h├¼nh</h4>
                      <div className="space-y-2.5 text-[13px]">
                        <div className="flex justify-between items-center"><span className="text-slate-500">Tiß╗ün tß╗æ:</span><span className="font-medium text-slate-800">{identifierConfig.prefix || '(kh├┤ng c├│)'}</span></div>
                        <div className="flex justify-between items-center"><span className="text-slate-500">K├╜ tß╗▒ ph├ón c├ích:</span><span className="font-medium text-slate-800">{identifierConfig.separator === 'none' ? 'Kh├┤ng d├╣ng' : `"${identifierConfig.separator}"`}</span></div>
                        <div className="flex justify-between items-center"><span className="text-slate-500">─Éß╗Ö d├ái sß╗æ:</span><span className="font-medium text-slate-800">{identifierConfig.digits} chß╗» sß╗æ</span></div>
                        <div className="flex justify-between items-center"><span className="text-slate-500">Bß║»t ─æß║ºu tß╗½:</span><span className="font-medium text-slate-800">{identifierConfig.startFrom}</span></div>
                        <div className="flex justify-between items-center"><span className="text-slate-500">B╞░ß╗¢c t─âng:</span><span className="font-medium text-slate-800">{identifierConfig.increment}</span></div>
                        <div className="flex justify-between items-center"><span className="text-slate-500">Kiß╗âm tra tr├╣ng:</span><span className={`font-medium ${identifierConfig.checkDuplicate ? 'text-green-700' : 'text-slate-500'}`}>{identifierConfig.checkDuplicate ? 'Bß║¡t' : 'Tß║»t'}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Step 2: Tß║ío thuß╗Öc t├¡nh */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="text-[13px] font-semibold text-blue-900 mb-1">B╞░ß╗¢c 2: Tß║ío thuß╗Öc t├¡nh</h3>
                <p className="text-[13px] text-blue-700">
                  ─Éß╗ïnh ngh─⌐a c├íc tr╞░ß╗¥ng dß╗» liß╗çu cho thß╗▒c thß╗â <strong>{wizardData.name || 'dß╗» liß╗çu chß╗º'}</strong>
                </p>
              </div>

              {/* Chß║┐ ─æß╗Ö ─æß╗ïnh ngh─⌐a thuß╗Öc t├¡nh */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[13px] font-medium text-slate-600">C├ích ─æß╗ïnh ngh─⌐a thuß╗Öc t├¡nh:</span>
                <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setWizardData({ ...wizardData, dataSource: 'dldc' })}
                    className={`px-3 py-1.5 text-[13px] font-medium transition-colors ${wizardData.dataSource === 'dldc' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                  >
                    Chß╗ìn tr╞░ß╗¥ng tß╗½ Kho DLDC
                  </button>
                  <button
                    type="button"
                    onClick={() => setWizardData({ ...wizardData, dataSource: 'manual' })}
                    className={`px-3 py-1.5 text-[13px] font-medium border-l border-slate-200 transition-colors ${wizardData.dataSource === 'manual' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                  >
                    Tß╗▒ th├¬m mß╗¢i tß╗½ng tr╞░ß╗¥ng
                  </button>
                </div>
              </div>

              {/* ΓöÇΓöÇ DLDC mode ΓöÇΓöÇ */}
              {wizardData.dataSource === 'dldc' && (
                <div className="space-y-4">
                  {/* Chß╗ìn bß║úng nguß╗ôn dß╗» liß╗çu ─æ├ú ─æ─âng k├╜ ß╗ƒ B╞░ß╗¢c 1 */}
                  <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
                    <div className="px-5 py-3.5 bg-blue-600 flex items-center gap-2">
                      <Database className="w-4 h-4 text-white" />
                      <p className="text-[13px] font-semibold text-white">Chß╗ìn bß║úng nguß╗ôn dß╗» liß╗çu</p>
                    </div>

                    <div className="p-5 space-y-4">
                      {registeredSources.length === 0 ? (
                        <p className="text-[13px] text-slate-400 text-center py-4">Ch╞░a ─æ─âng k├╜ nguß╗ôn dß╗» liß╗çu n├áo ß╗ƒ B╞░ß╗¢c 1</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {registeredSources.map(src => {
                            const dbId = SOURCE_NAME_TO_DB_ID[src.name] || '';
                            const isActive = !!dbId && dldcSelectedDbIds.includes(dbId);
                            return (
                              <button
                                key={src.id}
                                type="button"
                                onClick={() => handleDldcDbToggle(dbId)}
                                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-[13px] font-medium transition-colors ${isActive ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                              >
                                <Database className="w-3.5 h-3.5" />
                                {src.name}
                                <span className={`px-1.5 py-0.5 rounded-full border text-[13px] font-medium ${SOURCE_KIND_COLORS[src.kind]}`}>
                                  {SOURCE_KIND_LABELS[src.kind]}
                                </span>
                                <span className={`px-1.5 py-0.5 rounded-full border text-[13px] font-medium ${SOURCE_GRAIN_COLORS[src.grain]}`}>
                                  {src.grain}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Info row ΓÇö hiß╗ân thß╗ï c├íc CSDL ─æang chß╗ìn, tr╞░ß╗¥ng sß║╜ ─æ╞░ß╗úc gß╗Öp tß╗½ mß╗ìi bß║úng thuß╗Öc c├íc CSDL n├áy */}
                      {dldcSelectedDbIds.length > 0 && (
                        <div className="px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-2">
                          <Database className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                          <p className="text-[13px] text-blue-700">
                            ─É├ú gß╗Öp tr╞░ß╗¥ng tß╗½: <span className="font-medium">{dldcSelectedDbIds.map(id => DLDC_DATABASES.find(d => d.id === id)?.label).join(', ')}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Field selection table */}
                  {dldcFieldRows.length > 0 && (
                    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
                      <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-500" />
                          <p className="text-[13px] font-semibold text-slate-700">Chß╗ìn tr╞░ß╗¥ng dß╗» liß╗çu chia sß║╗</p>
                          <span className="text-[13px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                            {dldcFieldRows.filter(r => r.shared).length}/{dldcFieldRows.length} tr╞░ß╗¥ng ─æ╞░ß╗úc chß╗ìn
                          </span>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[13px]">
                          <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                              <th className="px-3 py-3 text-[13px] font-semibold text-slate-500 text-center w-16">
                                <input
                                  type="checkbox"
                                  title="Chß╗ìn / Bß╗Å chß╗ìn tß║Ñt cß║ú"
                                  checked={dldcFieldRows.length > 0 && dldcFieldRows.every(r => r.shared)}
                                  onChange={handleToggleAllDldcShared}
                                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                                />
                              </th>
                              <th className="px-3 py-3 text-[13px] font-semibold text-slate-500 text-center w-12">PK</th>
                              <th className="px-3 py-3 text-[13px] font-semibold text-slate-500">Nguß╗ôn (Table)</th>
                              <th className="px-3 py-3 text-[13px] font-semibold text-slate-500">Tr╞░ß╗¥ng gß╗æc (Column)</th>
                              <th className="px-3 py-3 text-[13px] font-semibold text-slate-500">T├¬n hiß╗ân thß╗ï</th>
                              <th className="px-3 py-3 text-[13px] font-semibold text-slate-500">Kiß╗âu dß╗» liß╗çu</th>
                              <th className="px-3 py-3 text-[13px] font-semibold text-slate-500 text-center w-12">X├│a</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {dldcFieldRows.length === 0 ? (
                              <tr>
                                <td colSpan={7} className="px-5 py-8 text-center text-[13px] text-slate-400">
                                  Chß╗ìn bß║úng dß╗» liß╗çu ─æß╗â tß║úi danh s├ích tr╞░ß╗¥ng
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
                                      {dldcAvailableTables.map(t => (
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
                                      <option value="">-- Chß╗ìn --</option>
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
                                      placeholder="T├¬n hiß╗ân thß╗ï"
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

              {/* ΓöÇΓöÇ Manual mode ΓöÇΓöÇ */}
              {wizardData.dataSource === 'manual' && (
                <div className="space-y-4">
                  {/* Add Attribute Form */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                    <h4 className="text-[13px] font-bold text-slate-900 mb-3">Th├¬m thuß╗Öc t├¡nh mß╗¢i</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">T├¬n tr╞░ß╗¥ng <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={currentAttribute.fieldName}
                          onChange={(e) => setCurrentAttribute({ ...currentAttribute, fieldName: e.target.value.toLowerCase() })}
                          placeholder="citizen_id"
                          className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">T├¬n hiß╗ân thß╗ï <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={currentAttribute.displayName}
                          onChange={(e) => setCurrentAttribute({ ...currentAttribute, displayName: e.target.value })}
                          placeholder="Sß╗æ CCCD"
                          className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Kiß╗âu dß╗» liß╗çu</label>
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
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">─Éß╗Ö d├ái</label>
                        <input
                          type="number"
                          value={currentAttribute.length || ''}
                          onChange={(e) => setCurrentAttribute({ ...currentAttribute, length: parseInt(e.target.value) || undefined })}
                          placeholder="255"
                          className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Gi├í trß╗ï mß║╖c ─æß╗ïnh</label>
                        <input
                          type="text"
                          value={currentAttribute.defaultValue || ''}
                          onChange={(e) => setCurrentAttribute({ ...currentAttribute, defaultValue: e.target.value })}
                          placeholder="VD: N/A"
                          className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 mt-3">
                      <label className="flex items-center gap-2 text-[13px] cursor-pointer">
                        <input type="checkbox" checked={currentAttribute.required}
                          onChange={(e) => setCurrentAttribute({ ...currentAttribute, required: e.target.checked })}
                          className="rounded border-slate-300 text-blue-600" />
                        Bß║»t buß╗Öc
                      </label>
                      <label className="flex items-center gap-2 text-[13px] cursor-pointer">
                        <input type="checkbox" checked={currentAttribute.isKey}
                          onChange={(e) => setCurrentAttribute({ ...currentAttribute, isKey: e.target.checked })}
                          className="rounded border-slate-300 text-blue-600" />
                        <span className="flex items-center gap-1"><Key className="w-3.5 h-3.5 text-blue-600" /> Kh├│a (kh├│a ch├¡nh)</span>
                      </label>
                    </div>
                    <button
                      onClick={handleAddAttribute}
                      className="mt-3 flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-[13px] font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Th├¬m thuß╗Öc t├¡nh
                    </button>
                  </div>

                  {/* Attributes List */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <p className="text-[13px] font-semibold text-slate-700">Danh s├ích thuß╗Öc t├¡nh</p>
                      <span className="text-[13px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">{wizardData.attributes.length} tr╞░ß╗¥ng</span>
                    </div>
                    {wizardData.attributes.length === 0 ? (
                      <div className="p-8 text-center text-[13px] text-slate-400">
                        Ch╞░a c├│ thuß╗Öc t├¡nh n├áo. Vui l├▓ng th├¬m ├¡t nhß║Ñt 1 thuß╗Öc t├¡nh.
                      </div>
                    ) : (
                      <table className="w-full text-[13px]">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr>
                            <th className="text-left px-4 py-3 text-[13px] font-semibold text-slate-600">T├¬n tr╞░ß╗¥ng</th>
                            <th className="text-left px-4 py-3 text-[13px] font-semibold text-slate-600">T├¬n hiß╗ân thß╗ï</th>
                            <th className="text-left px-4 py-3 text-[13px] font-semibold text-slate-600">Kiß╗âu</th>
                            <th className="text-left px-4 py-3 text-[13px] font-semibold text-slate-600">─Éß╗Ö d├ái</th>
                            <th className="text-left px-4 py-3 text-[13px] font-semibold text-slate-600">Gi├í trß╗ï mß║╖c ─æß╗ïnh</th>
                            <th className="text-left px-4 py-3 text-[13px] font-semibold text-slate-600">R├áng buß╗Öc</th>
                            <th className="text-right px-4 py-3 text-[13px] font-semibold text-slate-600">Thao t├íc</th>
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
                              <td className="px-4 py-2.5 text-slate-600">{attr.length ?? 'ΓÇö'}</td>
                              <td className="px-4 py-2.5 text-slate-600">{attr.defaultValue || 'ΓÇö'}</td>
                              <td className="px-4 py-2.5">
                                <div className="flex gap-1 flex-wrap">
                                  {attr.required && <span className="text-[13px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded">Bß║»t buß╗Öc</span>}
                                  {attr.isKey && <span className="text-[13px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded inline-flex items-center gap-1"><Key className="w-3 h-3" /> Kh├│a</span>}
                                  {!attr.required && !attr.isKey && <span className="text-slate-400">ΓÇö</span>}
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

              {/* ΓöÇΓöÇ Khß╗æi: ├ünh xß║í cß╗Öt nguß╗ôn ΓåÆ thuß╗Öc t├¡nh ΓöÇΓöÇ */}
              <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                    <p className="text-[13px] font-semibold text-slate-700">├ünh xß║í cß╗Öt nguß╗ôn ΓåÆ thuß╗Öc t├¡nh</p>
                  </div>
                  <span className="text-[13px] text-slate-500">{registeredSources.length} nguß╗ôn</span>
                </div>

                {registeredSources.length <= 1 && (
                  <div className="px-5 py-2.5 bg-amber-50 border-b border-amber-100">
                    <p className="text-[13px] text-amber-800">Γä╣∩╕Å Chß╗ë 1 nguß╗ôn ΓÇö ├ính xß║í trß╗▒c tiß║┐p</p>
                  </div>
                )}

                {hasMappingMismatch && (
                  <div className="px-5 py-2.5 bg-amber-50 border-b border-amber-200 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <p className="text-[13px] text-amber-800">C├│ ├¡t nhß║Ñt 1 ├┤ ├ính xß║í lß╗çch kiß╗âu dß╗» liß╗çu giß╗»a nguß╗ôn v├á thuß╗Öc t├¡nh ─æ├¡ch ΓÇö vui l├▓ng kiß╗âm tra lß║íi</p>
                  </div>
                )}

                <div className="p-4">
                  {availableFields.length === 0 ? (
                    <p className="text-[13px] text-slate-400 text-center py-6">Ch╞░a c├│ thuß╗Öc t├¡nh ─æß╗â ├ính xß║í ΓÇö h├úy chß╗ìn bß║úng/tr╞░ß╗¥ng hoß║╖c th├¬m thuß╗Öc t├¡nh ß╗ƒ tr├¬n</p>
                  ) : registeredSources.length === 0 ? (
                    <p className="text-[13px] text-slate-400 text-center py-6">Ch╞░a ─æ─âng k├╜ nguß╗ôn dß╗» liß╗çu ß╗ƒ B╞░ß╗¢c 1</p>
                  ) : (
                    <div className="border border-slate-100 rounded-lg overflow-x-auto">
                      <table className="w-full text-[13px]">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr>
                            <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Thuß╗Öc t├¡nh</th>
                            {registeredSources.map(src => (
                              <th key={src.id} className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">{src.name}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 bg-white">
                          {availableFields.map(attr => (
                            <tr key={attr.fieldName}>
                              <td className="px-3 py-2">
                                <span className="text-[13px] font-medium text-slate-700">{attr.displayName}</span>
                                <code className="ml-1.5 text-[13px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{attr.fieldName}</code>
                              </td>
                              {registeredSources.map(src => {
                                const selectedColumn = wizardData.mapping[attr.fieldName]?.[src.id] || '';
                                const mismatch = isMappingMismatch(attr.dataType, selectedColumn);
                                return (
                                  <td key={src.id} className="px-2 py-1.5">
                                    <select
                                      value={selectedColumn}
                                      onChange={(e: ChangeEvent<HTMLSelectElement>) => handleMappingChange(attr.fieldName, src.id, e.target.value)}
                                      className={`w-full border rounded-lg px-2 py-1 text-[13px] bg-white focus:outline-none focus:ring-2 ${mismatch ? 'border-amber-400 focus:ring-amber-400/20' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-400'}`}
                                    >
                                      <option value="">ΓÇö</option>
                                      {MOCK_SOURCE_COLUMNS.map(col => <option key={col.name} value={col.name}>{col.name}</option>)}
                                    </select>
                                    {mismatch && (
                                      <div className="flex items-center gap-1 mt-1 text-[13px] text-amber-700">
                                        <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                                        <span>Kiß╗âu nguß╗ôn ({MOCK_SOURCE_COLUMNS.find(c => c.name === selectedColumn)?.dataType}) Γëá ─É├¡ch ({attr.dataType})</span>
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

              {/* ΓöÇΓöÇ Khß╗æi: Gom nguß╗ôn 1:n ΓöÇΓöÇ (chß╗ë hiß╗çn khi c├│ ΓëÑ1 nguß╗ôn grain 1:n) */}
              {oneToManySources.length > 0 && (
                <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Network className="w-4 h-4 text-slate-500" />
                      <p className="text-[13px] font-semibold text-slate-700">Gom nguß╗ôn 1:n</p>
                    </div>
                    <span className="text-[13px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-medium">
                      {oneToManySources.length} nguß╗ôn 1:n
                    </span>
                  </div>
                  <div className="p-4 space-y-4">
                    <p className="text-[13px] text-slate-500">Vß╗¢i nguß╗ôn c├│ ─æß╗Ö mß╗ïn 1:n, chß╗ìn quy tß║»c gom nhiß╗üu bß║ún ghi th├ánh mß╗Öt gi├í trß╗ï cho tß╗½ng thuß╗Öc t├¡nh</p>
                    {oneToManySources.map(src => (
                      <div key={src.id} className="border border-slate-200 rounded-xl overflow-hidden">
                        <div className="px-4 py-2.5 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2">
                          <span className="text-[13px] font-semibold text-emerald-800">Nguß╗ôn (1:n): {src.name}</span>
                        </div>
                        {availableFields.length === 0 ? (
                          <p className="text-[13px] text-slate-400 text-center py-6">Ch╞░a c├│ thuß╗Öc t├¡nh ─æß╗â cß║Ñu h├¼nh</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-[13px]">
                              <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                  <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Thuß╗Öc t├¡nh</th>
                                  <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Rule gom</th>
                                  <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Cß╗Öt mß╗æc thß╗¥i gian</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50 bg-white">
                                {availableFields.map(attr => {
                                  const gr = wizardData.groupRules[src.id]?.[attr.fieldName];
                                  return (
                                    <tr key={attr.fieldName}>
                                      <td className="px-3 py-2">
                                        <span className="text-[13px] font-medium text-slate-700">{attr.displayName}</span>
                                        <code className="ml-1.5 text-[13px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{attr.fieldName}</code>
                                      </td>
                                      <td className="px-2 py-1.5">
                                        <select
                                          value={gr?.ruleType || 'latest'}
                                          onChange={(e: ChangeEvent<HTMLSelectElement>) => handleGroupRuleChange(src.id, attr.fieldName, { ruleType: e.target.value as GroupRuleType })}
                                          className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                                        >
                                          {(Object.entries(GROUP_RULE_LABELS) as [GroupRuleType, string][]).map(([val, label]) => (
                                            <option key={val} value={val}>{label}</option>
                                          ))}
                                        </select>
                                      </td>
                                      <td className="px-2 py-1.5">
                                        <select
                                          value={gr?.timeColumn || ''}
                                          onChange={(e: ChangeEvent<HTMLSelectElement>) => handleGroupRuleChange(src.id, attr.fieldName, { timeColumn: e.target.value })}
                                          className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                                        >
                                          <option value="">ΓÇö</option>
                                          {MOCK_SOURCE_COLUMNS.map(col => <option key={col.name} value={col.name}>{col.name}</option>)}
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
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Quy tß║»c hß╗úp nhß║Ñt */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-[13px] font-semibold text-blue-900 mb-1">B╞░ß╗¢c 3: Quy tß║»c hß╗úp nhß║Ñt dß╗» liß╗çu</h3>
                <p className="text-[13px] text-blue-700">
                  Thiß║┐t lß║¡p quy tß║»c so khß╗¢p, hß╗úp nhß║Ñt gi├í trß╗ï v├á kiß╗âm thß╗¡ m├┤ phß╗Ång tr├¬n dß╗» liß╗çu mß║½u
                </p>
              </div>

              {!showSurvivorTab && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
                  <p className="text-[13px] text-amber-800">Γä╣∩╕Å Chß╗ë 1 nguß╗ôn ΓÇö kh├┤ng cß║ºn hß╗úp nhß║Ñt gi├í trß╗ï nhiß╗üu nguß╗ôn</p>
                </div>
              )}

              {/* Sub-tabs */}
              <div className="flex items-center gap-1 border-b border-slate-200">
                {(([
                  { key: 'match',    label: 'So khß╗¢p' },
                  { key: 'survivor', label: 'Hß╗úp nhß║Ñt gi├í trß╗ï' },
                  { key: 'test',     label: 'Kiß╗âm thß╗¡' },
                ] as { key: MergeSubTab; label: string }[]).filter(t => t.key !== 'survivor' || showSurvivorTab)).map(t => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setMergeSubTab(t.key)}
                    className={`px-4 py-2 text-[13px] font-medium border-b-2 -mb-px transition-colors ${mergeSubTab === t.key
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                      }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* ΓöÇΓöÇ Tab 1: So khß╗¢p ΓöÇΓöÇ */}
              {mergeSubTab === 'match' && (
                <div className="space-y-4">
                  {/* Ng╞░ß╗íng */}
                  <div className="border border-slate-200 rounded-xl bg-white p-4 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Ng╞░ß╗íng tß╗▒ ─æß╗Öng gß╗Öp (ΓëÑ)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number" min={0} max={100}
                          value={mergeConfig.autoThreshold}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setMergeConfig(prev => ({ ...prev, autoThreshold: Number(e.target.value) }))}
                          className="w-24 border border-slate-200 rounded-lg px-3 py-1.5 text-[13px] text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                        />
                        <span className="text-[13px] text-slate-500">%</span>
                        <span className="text-[13px] text-slate-400">─Éiß╗âm khß╗¢p tß╗½ ng╞░ß╗íng n├áy trß╗ƒ l├¬n sß║╜ ─æ╞░ß╗úc gß╗Öp tß╗▒ ─æß╗Öng</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Ng╞░ß╗íng cß║ºn r├á so├ít (ΓëÑ)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number" min={0} max={100}
                          value={mergeConfig.reviewThreshold}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setMergeConfig(prev => ({ ...prev, reviewThreshold: Number(e.target.value) }))}
                          className="w-24 border border-slate-200 rounded-lg px-3 py-1.5 text-[13px] text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                        />
                        <span className="text-[13px] text-slate-500">%</span>
                        <span className="text-[13px] text-slate-400">─Éiß╗âm khß╗¢p trong khoß║úng n├áy sß║╜ chuyß╗ân sang chß╗¥ r├á so├ít</span>
                      </div>
                    </div>
                  </div>

                  {/* Bß║úng matching rules */}
                  <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                      <p className="text-[13px] font-semibold text-slate-700">Quy tß║»c so khß╗¢p</p>
                      <p className="text-[13px] text-slate-500">X├íc ─æß╗ïnh khi n├áo hai bß║ún ghi tß╗½ hai nguß╗ôn ─æ╞░ß╗úc coi l├á c├╣ng mß╗Öt thß╗▒c thß╗â</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[13px]">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr>
                            <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Tr╞░ß╗¥ng ─æß╗æi chiß║┐u</th>
                            <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Kiß╗âu so khß╗¢p</th>
                            <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Thuß║¡t to├ín</th>
                            <th className="px-3 py-2.5 text-center text-[13px] font-semibold text-slate-500 w-28">Ng╞░ß╗íng (%)</th>
                            <th className="px-3 py-2.5 text-center text-[13px] font-semibold text-slate-500 w-28">Trß╗ìng sß╗æ (%)</th>
                            <th className="px-3 py-2.5 text-center text-[13px] font-semibold text-slate-500 w-20">Chuß║⌐n h├│a</th>
                            <th className="px-3 py-2.5 text-center text-[13px] font-semibold text-slate-500 w-28">─Éiß╗üu kiß╗çn</th>
                            <th className="px-3 py-2.5 text-center text-[13px] font-semibold text-slate-500 w-10"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 bg-white">
                          {matchingRules.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="px-4 py-6 text-center text-[13px] text-slate-400">
                                Ch╞░a c├│ quy tß║»c ΓÇö nhß║Ñn "+ Th├¬m quy tß║»c so khß╗¢p" ─æß╗â bß║»t ─æß║ºu
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
                                    <option value="">-- Chß╗ìn tr╞░ß╗¥ng --</option>
                                    {availableFields.map(f => (
                                      <option key={f.fieldName} value={f.fieldName}>{f.displayName}</option>
                                    ))}
                                  </select>
                                </td>
                                <td className="px-2 py-1.5">
                                  <select
                                    value={rule.method}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setMatchingRules(prev => prev.map(r => r.id === rule.id ? { ...r, method: e.target.value as MatchMethod } : r))}
                                    className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                                  >
                                    <option value="exact">{MATCH_METHOD_LABELS.exact}</option>
                                    <option value="fuzzy">{MATCH_METHOD_LABELS.fuzzy}</option>
                                  </select>
                                </td>
                                <td className="px-2 py-1.5">
                                  {rule.method === 'fuzzy' ? (
                                    <select
                                      value={rule.algorithm}
                                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setMatchingRules(prev => prev.map(r => r.id === rule.id ? { ...r, algorithm: e.target.value as FuzzyAlgorithm } : r))}
                                      className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                                    >
                                      {FUZZY_ALGORITHMS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                                    </select>
                                  ) : (
                                    <span className="text-slate-400">ΓÇö</span>
                                  )}
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
                                    <span className="text-slate-400">ΓÇö</span>
                                  )}
                                </td>
                                <td className="px-2 py-1.5 text-center">
                                  <input
                                    type="number" min={0} max={100}
                                    value={rule.weight}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setMatchingRules(prev => prev.map(r => r.id === rule.id ? { ...r, weight: Number(e.target.value) } : r))}
                                    className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                  />
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
                                    <span className="text-slate-400">ΓÇö</span>
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
                        {matchingRules.length > 0 && (
                          <tfoot className="border-t border-slate-200 bg-slate-50">
                            <tr>
                              <td colSpan={4} className="px-3 py-2 text-right text-[13px] font-medium text-slate-600">Tß╗òng trß╗ìng sß╗æ:</td>
                              <td className="px-2 py-2 text-center">
                                <span className={`text-[13px] font-bold ${totalWeight === 100 ? 'text-green-700' : 'text-red-600'}`}>{totalWeight}%</span>
                              </td>
                              <td colSpan={3} className="px-3 py-2 text-[13px] text-slate-400">
                                {totalWeight === 100 ? 'Hß╗úp lß╗ç' : 'Tß╗òng trß╗ìng sß╗æ phß║úi bß║▒ng 100%'}
                              </td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    </div>
                    <div className="p-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setMatchingRules(prev => {
                          const next = [...prev, { id: `mr-${Date.now()}`, fieldName: '', method: 'exact' as MatchMethod, fuzzyThreshold: 80, normalize: false, operator: 'AND' as ConditionOperator, weight: 0, algorithm: 'jaro_winkler' as FuzzyAlgorithm }];
                          // Chia ─æß╗üu trß╗ìng sß╗æ cho tß║Ñt cß║ú quy tß║»c
                          const even = Math.floor(100 / next.length);
                          const remainder = 100 - even * next.length;
                          return next.map((r, i) => ({ ...r, weight: even + (i === 0 ? remainder : 0) }));
                        })}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 text-blue-600 text-[13px] font-medium rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Th├¬m quy tß║»c so khß╗¢p
                      </button>
                    </div>
                  </div>

                  {/* Tr╞░ß╗¥ng hard-block */}
                  <div className="border border-slate-200 rounded-xl bg-white p-4 space-y-3">
                    <div>
                      <p className="text-[13px] font-semibold text-slate-700">Tr╞░ß╗¥ng hard-block</p>
                      <p className="text-[13px] text-slate-500">Nß║┐u c├íc tr╞░ß╗¥ng n├áy kh├íc nhau, hai bß║ún ghi chß║»c chß║»n KH├öNG phß║úi c├╣ng thß╗▒c thß╗â (loß║íi khß╗Åi so khß╗¢p)</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {mergeConfig.hardBlockFields.map(f => (
                        <span key={f} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-[13px] font-medium">
                          {availableFields.find(af => af.fieldName === f)?.displayName || f}
                          <button type="button" onClick={() => handleRemoveHardBlockField(f)} className="text-blue-400 hover:text-red-500 transition-colors">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                      {mergeConfig.hardBlockFields.length === 0 && (
                        <span className="text-[13px] text-slate-400">Ch╞░a c├│ tr╞░ß╗¥ng hard-block n├áo</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={hardBlockInput}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setHardBlockInput(e.target.value)}
                        className="flex-1 max-w-xs border border-slate-200 rounded-lg px-2 py-1.5 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                      >
                        <option value="">-- Chß╗ìn tr╞░ß╗¥ng ─æß╗â th├¬m --</option>
                        {availableFields
                          .filter(f => !mergeConfig.hardBlockFields.includes(f.fieldName))
                          .map(f => <option key={f.fieldName} value={f.fieldName}>{f.displayName}</option>)}
                      </select>
                      <button
                        type="button"
                        onClick={() => { handleAddHardBlockField(hardBlockInput); setHardBlockInput(''); }}
                        disabled={!hardBlockInput}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 text-blue-600 text-[13px] font-medium rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-3.5 h-3.5" /> Th├¬m
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ΓöÇΓöÇ Tab 2: Hß╗úp nhß║Ñt gi├í trß╗ï ΓöÇΓöÇ */}
              {mergeSubTab === 'survivor' && (
                <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                    <p className="text-[13px] font-semibold text-slate-700">Hß╗úp nhß║Ñt gi├í trß╗ï (Survivorship)</p>
                    <p className="text-[13px] text-slate-500">Vß╗¢i mß╗ùi tr╞░ß╗¥ng, chß╗ìn gi├í trß╗ï n├áo sß║╜ tß╗ôn tß║íi trong bß║ún ghi chß╗º cuß╗æi c├╣ng</p>
                  </div>
                  <div className="p-4">
                    {extractionRules.length === 0 ? (
                      <p className="text-[13px] text-slate-400 text-center py-6">Ho├án tß║Ñt B╞░ß╗¢c 2 ─æß╗â tß╗▒ ─æß╗Öng nß║íp danh s├ích tr╞░ß╗¥ng</p>
                    ) : (
                      <div className="border border-slate-100 rounded-lg overflow-x-auto">
                        <table className="w-full text-[13px]">
                          <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                              <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Tr╞░ß╗¥ng</th>
                              <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Chiß║┐n l╞░ß╗úc</th>
                              <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Nguß╗ôn dß╗» liß╗çu</th>
                              <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Xß╗¡ l├╜ null</th>
                              <th className="px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500">Khi hß║┐t vß║½n trß╗æng</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50 bg-white">
                            {extractionRules.map(rule => (
                              <tr key={rule.id}>
                                <td className="px-3 py-2 align-top">
                                  <span className="text-[13px] font-medium text-slate-700">{availableFields.find(f => f.fieldName === rule.fieldName)?.displayName || rule.fieldName}</span>
                                  <code className="ml-1.5 text-[13px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{rule.fieldName}</code>
                                </td>
                                <td className="px-2 py-1.5 align-top">
                                  <select
                                    value={rule.conflictStrategy}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setExtractionRules(prev => prev.map(r => r.id === rule.id ? { ...r, conflictStrategy: e.target.value as ConflictStrategy } : r))}
                                    className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                                  >
                                    <option value="source">{CONFLICT_STRATEGY_LABELS.source}</option>
                                    <option value="priority">{CONFLICT_STRATEGY_LABELS.priority}</option>
                                  </select>
                                </td>
                                <td className="px-2 py-1.5 align-top">
                                  {rule.conflictStrategy === 'source' ? (
                                    <select
                                      value={rule.primarySource}
                                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setExtractionRules(prev => prev.map(r => r.id === rule.id ? { ...r, primarySource: e.target.value } : r))}
                                      className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                                    >
                                      <option value="">-- Chß╗ìn nguß╗ôn --</option>
                                      {registeredSources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                  ) : (
                                    (() => {
                                      const regIds = registeredSources.map(s => s.id);
                                      const ordered = [...rule.priorityOrder.filter(id => regIds.includes(id)), ...regIds.filter(id => !rule.priorityOrder.includes(id))];
                                      const apply = (arr: string[]) => setExtractionRules(prev => prev.map(r => r.id === rule.id ? { ...r, priorityOrder: arr } : r));
                                      if (ordered.length === 0) return <span className="text-[13px] text-slate-400">Ch╞░a c├│ nguß╗ôn</span>;
                                      return (
                                        <div className="space-y-1 min-w-[190px]">
                                          {ordered.map((sid, idx) => {
                                            const s = registeredSources.find(x => x.id === sid);
                                            return (
                                              <div key={sid} className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2 py-1 bg-slate-50">
                                                <span className="w-4 text-[11px] font-semibold text-slate-400">{idx + 1}</span>
                                                <span className="flex-1 text-[13px] text-slate-700 truncate">{s?.name}</span>
                                                <button type="button" disabled={idx === 0} onClick={() => { const a = [...ordered]; [a[idx - 1], a[idx]] = [a[idx], a[idx - 1]]; apply(a); }} className="p-0.5 text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed" aria-label="L├¬n"><ChevronUp className="w-3.5 h-3.5" /></button>
                                                <button type="button" disabled={idx === ordered.length - 1} onClick={() => { const a = [...ordered]; [a[idx + 1], a[idx]] = [a[idx], a[idx + 1]]; apply(a); }} className="p-0.5 text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Xuß╗æng"><ChevronDown className="w-3.5 h-3.5" /></button>
                                              </div>
                                            );
                                          })}
                                          <p className="text-[11px] text-slate-400">Thiß║┐u ß╗ƒ nguß╗ôn ─æß║ºu ΓåÆ lß║Ñy nguß╗ôn kß║┐</p>
                                        </div>
                                      );
                                    })()
                                  )}
                                </td>
                                <td className="px-2 py-1.5">
                                  <select
                                    value={rule.nullHandling}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setExtractionRules(prev => prev.map(r => r.id === rule.id ? { ...r, nullHandling: e.target.value as NullHandling } : r))}
                                    className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                                  >
                                    <option value="next">Nguß╗ôn kß║┐</option>
                                    <option value="skip">Bß╗Å qua</option>
                                  </select>
                                </td>
                                <td className="px-2 py-1.5">
                                  <select
                                    value={rule.onEmpty}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setExtractionRules(prev => prev.map(r => r.id === rule.id ? { ...r, onEmpty: e.target.value as OnEmpty } : r))}
                                    className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                                  >
                                    <option value="required">Bß║»t buß╗Öc</option>
                                    <option value="warn">Cß║únh b├ío</option>
                                    <option value="allow">Cho ph├⌐p trß╗æng</option>
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

              {/* ΓöÇΓöÇ Tab 3: Kiß╗âm thß╗¡ ΓöÇΓöÇ */}
              {mergeSubTab === 'test' && (
                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-xl bg-white p-4 flex flex-wrap items-end gap-3">
                    <div>
                      <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Chß╗ìn sß╗æ l╞░ß╗úng bß║ún ghi chß║íy kiß╗âm thß╗¡</label>
                      <select
                        value={testSample}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => { setTestSample(e.target.value); setTestRun(false); }}
                        className="w-80 border border-slate-200 rounded-lg px-2 py-1.5 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                      >
                        <option value="">-- Chß╗ìn sß╗æ l╞░ß╗úng bß║ún ghi --</option>
                        {WIZARD_MOCK_SAMPLES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTestRun(true)}
                      disabled={!testSample}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-[13px] font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Chß║íy m├┤ phß╗Ång
                    </button>
                  </div>

                  {!testRun ? (
                    <div className="border border-dashed border-slate-200 rounded-xl bg-slate-50 p-8 text-center text-[13px] text-slate-400">
                      Chß╗ìn dß╗» liß╗çu mß║½u v├á nhß║Ñn "Chß║íy m├┤ phß╗Ång" ─æß╗â xem kß║┐t quß║ú kiß╗âm thß╗¡
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-4 gap-3">
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                          <div className="text-[13px] text-emerald-700 mb-1">Golden h├¼nh th├ánh</div>
                          <div className="text-2xl font-bold text-emerald-800">312</div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="text-[13px] text-blue-700 mb-1">Auto-merge</div>
                          <div className="text-2xl font-bold text-blue-800">268</div>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <div className="text-[13px] text-amber-700 mb-1">Chß╗¥ r├á so├ít</div>
                          <div className="text-2xl font-bold text-amber-800">37</div>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                          <div className="text-[13px] text-slate-600 mb-1">Kh├┤ng khß╗¢p</div>
                          <div className="text-2xl font-bold text-slate-800">183</div>
                        </div>
                      </div>

                      {/* Bß║úng C├íc bß║ún ghi chß╗¥ r├á so├ít */}
                      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between gap-3 flex-wrap min-h-[48px]">
                          <div className="flex items-center gap-2">
                            <p className="text-[13px] font-semibold text-slate-800">C├íc bß║ún ghi chß╗¥ r├á so├ít</p>
                            <span className="text-[12px] px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-medium">
                              37 bß║ún ghi
                            </span>
                          </div>

                          {reviewSelectedIds.length > 0 ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[12px] font-medium text-slate-500 mr-1">
                                ─É├ú chß╗ìn <strong className="text-slate-800">{reviewSelectedIds.length}</strong>
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setReviewProcessedIds(prev => Array.from(new Set([...prev, ...reviewSelectedIds])));
                                  setReviewSelectedIds([]);
                                  triggerToast('Gß╗¡i y├¬u cß║ºu th├ánh c├┤ng', '─É├ú l╞░u bß║ún ghi mß╗¢i th├ánh c├┤ng!');
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[12px] font-medium transition-colors shadow-sm cursor-pointer"
                              >
                                <GitMerge className="w-3.5 h-3.5" /> Hß╗úp nhß║Ñt
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setReviewProcessedIds(prev => Array.from(new Set([...prev, ...reviewSelectedIds])));
                                  setReviewSelectedIds([]);
                                  triggerToast('Gß╗¡i y├¬u cß║ºu th├ánh c├┤ng', '─É├ú l╞░u bß║ún ghi mß╗¢i th├ánh c├┤ng!');
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-[12px] font-medium transition-colors cursor-pointer"
                              >
                                <Split className="w-3.5 h-3.5 text-amber-600" /> T├ích biß╗çt
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setReviewProcessedIds(prev => Array.from(new Set([...prev, ...reviewSelectedIds])));
                                  setReviewSentIds(prev => Array.from(new Set([...prev, ...reviewSelectedIds])));
                                  setReviewSelectedIds([]);
                                  triggerToast('Gß╗¡i y├¬u cß║ºu th├ánh c├┤ng', '─É├ú l╞░u bß║ún ghi mß╗¢i th├ánh c├┤ng!');
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[12px] font-medium transition-colors shadow-sm cursor-pointer"
                              >
                                <Send className="w-3.5 h-3.5" /> Gß╗¡i duyß╗çt
                              </button>
                            </div>
                          ) : (
                            <span className="text-[12px] text-slate-400">T├¡ch chß╗ìn c├íc bß║ún ghi ─æß╗â thß╗▒c hiß╗çn thao t├íc h├áng loß║ít</span>
                          )}
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-[13px]">
                            <thead className="bg-slate-50 border-b border-slate-100">
                              <tr>
                                <th className="px-3 py-2.5 text-center w-10">
                                  <input
                                    type="checkbox"
                                    checked={reviewSelectedIds.length > 0 && reviewSelectedIds.length === MOCK_REVIEW_ITEMS.filter(i => !reviewProcessedIds.includes(i.id)).length}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                      if (e.target.checked) {
                                        setReviewSelectedIds(MOCK_REVIEW_ITEMS.filter(i => !reviewProcessedIds.includes(i.id)).map(item => item.id));
                                      } else {
                                        setReviewSelectedIds([]);
                                      }
                                    }}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                                  />
                                </th>
                                <th className="px-3 py-2.5 text-left font-semibold text-slate-600">Cß║╖p bß║ún ghi</th>
                                <th className="px-3 py-2.5 text-center font-semibold text-slate-600 w-28">─Éiß╗âm khß╗¢p</th>
                                <th className="px-3 py-2.5 text-left font-semibold text-slate-600">L├╜ do</th>
                                <th className="px-3 py-2.5 text-center font-semibold text-slate-600 w-36">Thao t├íc</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                              {MOCK_REVIEW_ITEMS.map(item => {
                                const isProcessed = reviewProcessedIds.includes(item.id);
                                const isSelected = reviewSelectedIds.includes(item.id);
                                const parts = item.pair.split(' Γåö ');
                                return (
                                  <tr
                                    key={item.id}
                                    className={`transition-colors ${
                                      isProcessed
                                        ? 'bg-slate-100/70 text-slate-400 opacity-60 grayscale cursor-not-allowed'
                                        : isSelected ? 'bg-blue-50/40' : 'hover:bg-slate-50/50'
                                    }`}
                                  >
                                    <td className="px-3 py-2.5 text-center">
                                      <input
                                        type="checkbox"
                                        disabled={isProcessed}
                                        checked={isSelected}
                                        onChange={() => {
                                          if (isSelected) {
                                            setReviewSelectedIds(prev => prev.filter(id => id !== item.id));
                                          } else {
                                            setReviewSelectedIds(prev => [...prev, item.id]);
                                          }
                                        }}
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer disabled:cursor-not-allowed"
                                      />
                                    </td>
                                    <td className={`px-3 py-2.5 font-medium ${isProcessed ? 'text-slate-400' : 'text-slate-700'}`}>
                                      <code className={`px-1.5 py-0.5 rounded font-mono ${isProcessed ? 'bg-slate-200/60 text-slate-500' : 'bg-slate-100 text-slate-700'}`}>{parts[0]}</code>
                                      <span className="mx-1.5 text-slate-400">Γåö</span>
                                      <code className={`px-1.5 py-0.5 rounded font-mono ${isProcessed ? 'bg-slate-200/60 text-slate-500' : 'bg-slate-100 text-slate-700'}`}>{parts[1]}</code>
                                    </td>
                                    <td className="px-3 py-2.5 text-center">
                                      <span className={`px-2 py-0.5 rounded font-semibold text-[12px] ${isProcessed ? 'bg-slate-200 text-slate-500' : 'bg-amber-100 text-amber-800'}`}>
                                        {item.score}%
                                      </span>
                                    </td>
                                    <td className={`px-3 py-2.5 ${isProcessed ? 'text-slate-400' : 'text-slate-600'}`}>{item.reason}</td>
                                    <td className="px-3 py-2.5 text-center">
                                      {isProcessed ? (
                                        <span className="text-[11px] px-2 py-0.5 bg-slate-200 text-slate-600 rounded font-medium">─É├ú xß╗¡ l├╜</span>
                                      ) : (
                                        <div className="flex items-center justify-center gap-1">
                                          <button
                                            type="button"
                                            title="Hß╗úp nhß║Ñt bß║ún ghi"
                                            onClick={() => {
                                              setReviewProcessedIds(prev => Array.from(new Set([...prev, item.id])));
                                              setReviewSelectedIds(prev => prev.filter(id => id !== item.id));
                                              triggerToast('Gß╗¡i y├¬u cß║ºu th├ánh c├┤ng', '─É├ú l╞░u bß║ún ghi mß╗¢i th├ánh c├┤ng!');
                                            }}
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                          >
                                            <GitMerge className="w-4 h-4" />
                                          </button>
                                          <button
                                            type="button"
                                            title="T├ích biß╗çt bß║ún ghi"
                                            onClick={() => {
                                              setReviewProcessedIds(prev => Array.from(new Set([...prev, item.id])));
                                              setReviewSelectedIds(prev => prev.filter(id => id !== item.id));
                                              triggerToast('Gß╗¡i y├¬u cß║ºu th├ánh c├┤ng', '─É├ú l╞░u bß║ún ghi mß╗¢i th├ánh c├┤ng!');
                                            }}
                                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                          >
                                            <Split className="w-4 h-4" />
                                          </button>
                                          <button
                                            type="button"
                                            title="Gß╗¡i duyß╗çt"
                                            onClick={() => {
                                              setReviewProcessedIds(prev => Array.from(new Set([...prev, item.id])));
                                              setReviewSentIds(prev => Array.from(new Set([...prev, item.id])));
                                              setReviewSelectedIds(prev => prev.filter(id => id !== item.id));
                                              triggerToast('Gß╗¡i y├¬u cß║ºu th├ánh c├┤ng', '─É├ú l╞░u bß║ún ghi mß╗¢i th├ánh c├┤ng!');
                                            }}
                                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                          >
                                            <Send className="w-4 h-4" />
                                          </button>
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Thanh ph├ón trang */}
                        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                          <div className="text-[13px] text-slate-500">
                            Hiß╗ân thß╗ï <span className="font-medium text-slate-700">1 - 5</span> trong sß╗æ <span className="font-medium text-slate-700">37</span> bß║ún ghi
                          </div>
                          <div className="flex items-center gap-2">
                            <button type="button" disabled={reviewPage === 1} onClick={() => setReviewPage(prev => Math.max(1, prev - 1))}
                              className="px-2.5 py-1 border border-slate-200 rounded-lg text-[13px] font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">
                              Tr╞░ß╗¢c
                            </button>
                            <span className="text-[13px] text-slate-600 font-medium px-1">Trang {reviewPage} / 8</span>
                            <button type="button" disabled={reviewPage === 8} onClick={() => setReviewPage(prev => Math.min(8, prev + 1))}
                              className="px-2.5 py-1 border border-slate-200 rounded-lg text-[13px] font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">
                              Sau
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Bß║úng C├íc bß║ún ghi kh├┤ng khß╗¢p */}
                      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between gap-3 flex-wrap min-h-[48px]">
                          <div className="flex items-center gap-2">
                            <p className="text-[13px] font-semibold text-slate-800">C├íc bß║ún ghi kh├┤ng khß╗¢p</p>
                            <span className="text-[12px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full font-medium">
                              183 bß║ún ghi
                            </span>
                          </div>

                          {unmatchedSelectedIds.length > 0 ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[12px] font-medium text-slate-500 mr-1">
                                ─É├ú chß╗ìn <strong className="text-slate-800">{unmatchedSelectedIds.length}</strong>
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setUnmatchedActions(prev => {
                                    const next = { ...prev };
                                    unmatchedSelectedIds.forEach(id => { next[id] = 'single_source'; });
                                    return next;
                                  });
                                  setUnmatchedProcessedIds(prev => Array.from(new Set([...prev, ...unmatchedSelectedIds])));
                                  setUnmatchedSelectedIds([]);
                                  triggerToast('Gß╗¡i y├¬u cß║ºu th├ánh c├┤ng', '─É├ú l╞░u bß║ún ghi mß╗¢i th├ánh c├┤ng!');
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[12px] font-medium transition-colors shadow-sm cursor-pointer"
                              >
                                <PlusCircle className="w-3.5 h-3.5" /> Tß║ío bß║ún ghi ─æ╞ín nguß╗ôn
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setUnmatchedActions(prev => {
                                    const next = { ...prev };
                                    unmatchedSelectedIds.forEach(id => { next[id] = 'discard'; });
                                    return next;
                                  });
                                  setUnmatchedProcessedIds(prev => Array.from(new Set([...prev, ...unmatchedSelectedIds])));
                                  setUnmatchedSelectedIds([]);
                                  triggerToast('Gß╗¡i y├¬u cß║ºu th├ánh c├┤ng', '─É├ú l╞░u bß║ún ghi mß╗¢i th├ánh c├┤ng!');
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-[12px] font-medium transition-colors cursor-pointer"
                              >
                                <XCircle className="w-3.5 h-3.5 text-slate-500" /> Loß║íi bß╗Å
                              </button>
                            </div>
                          ) : (
                            <span className="text-[12px] text-slate-400">T├¡ch chß╗ìn c├íc bß║ún ghi ─æß╗â thß╗▒c hiß╗çn thao t├íc xß╗¡ l├╜ h├áng loß║ít</span>
                          )}
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-[13px]">
                            <thead className="bg-slate-50 border-b border-slate-100">
                              <tr>
                                <th className="px-3 py-2.5 text-center w-10">
                                  <input
                                    type="checkbox"
                                    checked={unmatchedSelectedIds.length > 0 && unmatchedSelectedIds.length === MOCK_UNMATCHED_ITEMS.filter(i => !unmatchedProcessedIds.includes(i.id)).length}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                      if (e.target.checked) {
                                        setUnmatchedSelectedIds(MOCK_UNMATCHED_ITEMS.filter(i => !unmatchedProcessedIds.includes(i.id)).map(item => item.id));
                                      } else {
                                        setUnmatchedSelectedIds([]);
                                      }
                                    }}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                                  />
                                </th>
                                <th className="px-3 py-2.5 text-left font-semibold text-slate-600">Bß║ún ghi nguß╗ôn</th>
                                <th className="px-3 py-2.5 text-center font-semibold text-slate-600 w-36">─Éiß╗âm khß╗¢p cao nhß║Ñt</th>
                                <th className="px-3 py-2.5 text-left font-semibold text-slate-600">L├╜ do kh├┤ng khß╗¢p</th>
                                <th className="px-3 py-2.5 text-left font-semibold text-slate-600 w-56">Ph╞░╞íng ├ín xß╗¡ l├╜</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                              {MOCK_UNMATCHED_ITEMS.map(item => {
                                const isProcessed = unmatchedProcessedIds.includes(item.id);
                                const isSelected = unmatchedSelectedIds.includes(item.id);
                                const currentAction = unmatchedActions[item.id] || item.defaultAction;
                                return (
                                  <tr
                                    key={item.id}
                                    className={`transition-colors ${
                                      isProcessed
                                        ? 'bg-slate-100/70 text-slate-400 opacity-60 grayscale cursor-not-allowed'
                                        : isSelected ? 'bg-blue-50/40' : 'hover:bg-slate-50/50'
                                    }`}
                                  >
                                    <td className="px-3 py-2.5 text-center">
                                      <input
                                        type="checkbox"
                                        disabled={isProcessed}
                                        checked={isSelected}
                                        onChange={() => {
                                          if (isSelected) {
                                            setUnmatchedSelectedIds(prev => prev.filter(id => id !== item.id));
                                          } else {
                                            setUnmatchedSelectedIds(prev => [...prev, item.id]);
                                          }
                                        }}
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer disabled:cursor-not-allowed"
                                      />
                                    </td>
                                    <td className={`px-3 py-2.5 font-medium ${isProcessed ? 'text-slate-400' : 'text-slate-700'}`}>
                                      <code className={`px-1.5 py-0.5 rounded font-mono mr-1.5 ${isProcessed ? 'bg-slate-200/60 text-slate-500' : 'bg-slate-100 text-slate-800'}`}>{item.record}</code>
                                      <span className={`text-[12px] px-2 py-0.5 rounded-md font-normal ${isProcessed ? 'bg-slate-200/60 text-slate-500' : 'bg-slate-100 text-slate-600'}`}>
                                        {item.sourceName}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2.5 text-center">
                                      <span className={`px-2 py-0.5 rounded font-semibold text-[12px] ${isProcessed ? 'bg-slate-200 text-slate-500' : 'bg-slate-100 text-slate-700'}`}>
                                        {item.maxScore}%
                                      </span>
                                    </td>
                                    <td className={`px-3 py-2.5 ${isProcessed ? 'text-slate-400' : 'text-slate-600'}`}>{item.reason}</td>
                                    <td className="px-3 py-2.5">
                                      {isProcessed ? (
                                        <span className="text-[11px] px-2 py-0.5 bg-slate-200 text-slate-600 rounded font-medium">
                                          ─É├ú xß╗¡ l├╜
                                        </span>
                                      ) : (
                                        <select
                                          value={currentAction}
                                          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                            const val = e.target.value as 'single_source' | 'discard' | '';
                                            if (!val) return;
                                            setUnmatchedActions(prev => ({ ...prev, [item.id]: val }));
                                            setUnmatchedProcessedIds(prev => Array.from(new Set([...prev, item.id])));
                                            setUnmatchedSelectedIds(prev => prev.filter(id => id !== item.id));
                                            triggerToast('Gß╗¡i y├¬u cß║ºu th├ánh c├┤ng', '─É├ú l╞░u bß║ún ghi mß╗¢i th├ánh c├┤ng!');
                                          }}
                                          className={`w-full text-[12px] border rounded-lg px-2.5 py-1 font-medium bg-white focus:outline-none cursor-pointer transition-colors ${
                                            currentAction === 'single_source'
                                              ? 'border-blue-300 text-blue-800 bg-blue-50/50 cursor-pointer'
                                              : 'border-slate-300 text-slate-600 bg-slate-50 cursor-pointer'
                                          }`}
                                        >
                                          <option value="">-- Chß╗ìn ph╞░╞íng ├ín xß╗¡ l├╜ --</option>
                                          <option value="single_source">Tß║ío bß║ún ghi ─æ╞ín nguß╗ôn</option>
                                          <option value="discard">Loß║íi bß╗Å</option>
                                        </select>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Thanh ph├ón trang */}
                        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                          <div className="text-[13px] text-slate-500">
                            Hiß╗ân thß╗ï <span className="font-medium text-slate-700">1 - 5</span> trong sß╗æ <span className="font-medium text-slate-700">183</span> bß║ún ghi
                          </div>
                          <div className="flex items-center gap-2">
                            <button type="button" disabled={unmatchedPage === 1} onClick={() => setUnmatchedPage(prev => Math.max(1, prev - 1))}
                              className="px-2.5 py-1 border border-slate-200 rounded-lg text-[13px] font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">
                              Tr╞░ß╗¢c
                            </button>
                            <span className="text-[13px] text-slate-600 font-medium px-1">Trang {unmatchedPage} / 37</span>
                            <button type="button" disabled={unmatchedPage === 37} onClick={() => setUnmatchedPage(prev => Math.min(37, prev + 1))}
                              className="px-2.5 py-1 border border-slate-200 rounded-lg text-[13px] font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">
                              Sau
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Thiß║┐t lß║¡p quan hß╗ç */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-[13px] font-semibold text-blue-900 mb-1">B╞░ß╗¢c 4: Thiß║┐t lß║¡p quan hß╗ç</h3>
                <p className="text-[13px] text-blue-700">─Éß╗ïnh ngh─⌐a mß╗æi quan hß╗ç giß╗»a thß╗▒c thß╗â n├áy vß╗¢i c├íc thß╗▒c thß╗â dß╗» liß╗çu chß╗º kh├íc trong hß╗ç thß╗æng</p>
              </div>

              {/* Entity info + add button */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[13px] flex-shrink-0">
                    {(wizardData.code || wizardData.name || 'E').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[13px] text-slate-500">Thß╗▒c thß╗â ─æang cß║Ñu h├¼nh:</p>
                    <p className="text-[13px] font-semibold text-slate-800">
                      {wizardData.code && <code className="text-blue-600 bg-blue-50 px-1 rounded mr-1.5">{wizardData.code}</code>}
                      {wizardData.name || '(Ch╞░a ─æß║╖t t├¬n)'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {!relFormOpen && wizardData.relationships.length > 0 && (
                    <div className="relative">
                      <input
                        type="text" value={relSearch}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setRelSearch(e.target.value)}
                        placeholder="T├¼m kiß║┐m quan hß╗ç..."
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
                      <Plus className="w-4 h-4" /> Th├¬m quan hß╗ç
                    </button>
                  )}
                </div>
              </div>

              {/* Inline add / edit form */}
              {relFormOpen && (
                <div className="border border-blue-200 rounded-xl bg-blue-50/30 overflow-hidden">
                  <div className="bg-blue-600 px-5 py-3 flex items-center justify-between">
                    <p className="text-[13px] font-semibold text-white">
                      {editingRelId ? 'Chß╗ënh sß╗¡a quan hß╗ç' : 'Th├¬m quan hß╗ç mß╗¢i'}
                    </p>
                    <button type="button" onClick={handleCancelRel} className="text-white/70 hover:text-white transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 space-y-5">
                    {/* 1. Chß╗ìn thß╗▒c thß╗â */}
                    <div className="space-y-3">
                      <h4 className="text-[13px] font-semibold text-slate-700 border-b border-slate-200 pb-2">1. Chß╗ìn thß╗▒c thß╗â li├¬n kß║┐t</h4>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                            Thß╗▒c thß╗â nguß╗ôn <span className="text-slate-400 font-normal">(thß╗▒c thß╗â ─æang tß║ío)</span>
                          </label>
                          <div className="h-10 px-3 flex items-center border border-slate-200 rounded-lg bg-slate-50 text-[13px] text-slate-600">
                            {wizardData.code && <code className="text-blue-600 bg-blue-100 px-1 rounded mr-1.5 text-[13px]">{wizardData.code}</code>}
                            {wizardData.name || '(Thß╗▒c thß╗â ─æang tß║ío)'}
                          </div>
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                            Thß╗▒c thß╗â ─æ├¡ch <span className="text-red-500">*</span>
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
                            <option value="">-- Chß╗ìn thß╗▒c thß╗â ─æ├¡ch --</option>
                            {WIZARD_MOCK_ENTITIES.map(e => <option key={e.id} value={e.id}>{e.code} - {e.name}</option>)}
                          </select>
                        </div>
                      </div>

                      {relFormData.targetEntityId && (
                        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-center gap-8">
                          <div className="flex flex-col items-center gap-1.5">
                            <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-[13px]">A</div>
                            <span className="text-[13px] font-semibold text-slate-800">{wizardData.name || '(Thß╗▒c thß╗â ─æang tß║ío)'}</span>
                          </div>
                          <ArrowRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                          <div className="flex flex-col items-center gap-1.5">
                            <div className="w-9 h-9 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-[13px]">B</div>
                            <span className="text-[13px] font-semibold text-slate-800">{WIZARD_MOCK_ENTITIES.find(e => e.id === relFormData.targetEntityId)?.name}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 2. Loß║íi quan hß╗ç */}
                    <div className="space-y-3">
                      <h4 className="text-[13px] font-semibold text-slate-700 border-b border-slate-200 pb-2">2. Loß║íi quan hß╗ç</h4>
                      <select
                        value={relFormData.type}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setRelFormData(prev => ({ ...prev, type: e.target.value as WizardRelType, sourceKey: '', targetKey: '', mappingTable: '' }))}
                        className="w-64 px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
                      >
                        {(Object.entries(REL_TYPE_LABELS) as [WizardRelType, string][])
                          .map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                          ))}
                      </select>
                    </div>

                    {/* 3. ─Éiß╗üu kiß╗çn li├¬n kß║┐t */}
                    <div className="space-y-3">
                      <h4 className="text-[13px] font-semibold text-slate-700 border-b border-slate-200 pb-2 flex items-center justify-between">
                        <span>3. ─Éiß╗üu kiß╗çn li├¬n kß║┐t</span>
                        {!relFormData.targetEntityId && (
                          <span className="text-[13px] text-orange-600 bg-orange-50 font-normal px-2 py-0.5 rounded border border-orange-100">Chß╗ìn thß╗▒c thß╗â ─æ├¡ch ─æß╗â tß║úi danh s├ích tr╞░ß╗¥ng</span>
                        )}
                      </h4>

                      {relFormData.targetEntityId ? (
                        relFormData.type === 'n-n' ? (
                          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 space-y-4">
                            <p className="text-[13px] font-semibold text-purple-900">Bß║úng li├¬n kß║┐t (Mapping Table)</p>
                            <div>
                              <label className="block text-[13px] font-medium text-slate-600 mb-1.5">T├¬n bß║úng li├¬n kß║┐t <span className="text-red-500">*</span></label>
                              <input type="text" value={relFormData.mappingTable}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setRelFormData(prev => ({ ...prev, mappingTable: e.target.value }))}
                                placeholder="VD: tbl_map_entity_a_entity_b"
                                className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Kho├í ngoß║íi Nguß╗ôn <span className="text-red-500">*</span></label>
                                <select value={relFormData.sourceKey} onChange={(e: ChangeEvent<HTMLSelectElement>) => setRelFormData(prev => ({ ...prev, sourceKey: e.target.value }))}
                                  className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-mono">
                                  <option value="">-- Chß╗ìn tr╞░ß╗¥ng Nguß╗ôn --</option>
                                  {(sourceEntityFields.length > 0 ? sourceEntityFields : [{ name: 'id', label: 'ID ─æß╗ïnh danh' }, { name: 'code', label: 'M├ú ─æß╗ïnh danh' }]).map(f => <option key={f.name} value={f.name}>{f.name} ({f.label})</option>)}
                                </select>
                              </div>
                              <div>
                                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Kho├í ngoß║íi ─É├¡ch <span className="text-red-500">*</span></label>
                                <select value={relFormData.targetKey} onChange={(e: ChangeEvent<HTMLSelectElement>) => setRelFormData(prev => ({ ...prev, targetKey: e.target.value }))}
                                  className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-mono">
                                  <option value="">-- Chß╗ìn tr╞░ß╗¥ng ─É├¡ch --</option>
                                  {BASE_TARGET_FIELDS.map(f => <option key={f.name} value={f.name}>{f.name} ({f.label})</option>)}
                                </select>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 space-y-4">
                            <div className="flex items-center gap-2">
                              <Key className="w-4 h-4 text-blue-600" />
                              <span className="text-[13px] font-semibold text-blue-900">Kh├│a ngoß║íi (Foreign Key)</span>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Kh├│a nguß╗ôn <span className="text-red-500">*</span></label>
                                <select value={relFormData.sourceKey} onChange={(e: ChangeEvent<HTMLSelectElement>) => setRelFormData(prev => ({ ...prev, sourceKey: e.target.value }))}
                                  className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono">
                                  <option value="">-- Chß╗ìn tr╞░ß╗¥ng Nguß╗ôn --</option>
                                  {(sourceEntityFields.length > 0 ? sourceEntityFields : [{ name: 'id', label: 'ID ─æß╗ïnh danh' }, { name: 'code', label: 'M├ú ─æß╗ïnh danh' }]).map(f => <option key={f.name} value={f.name}>{f.name} ({f.label})</option>)}
                                </select>
                                <p className="text-[13px] text-slate-400 mt-1">Tr╞░ß╗¥ng trong thß╗▒c thß╗â ─æang tß║ío</p>
                              </div>
                              <div>
                                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Kh├│a ─æ├¡ch <span className="text-red-500">*</span></label>
                                <select value={relFormData.targetKey} onChange={(e: ChangeEvent<HTMLSelectElement>) => setRelFormData(prev => ({ ...prev, targetKey: e.target.value }))}
                                  className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono">
                                  <option value="">-- Chß╗ìn tr╞░ß╗¥ng ─É├¡ch --</option>
                                  {BASE_TARGET_FIELDS.map(f => <option key={f.name} value={f.name}>{f.name} ({f.label})</option>)}
                                </select>
                                <p className="text-[13px] text-slate-400 mt-1">Tr╞░ß╗¥ng d├╣ng ─æß╗â join (th╞░ß╗¥ng l├á ID/Code)</p>
                              </div>
                            </div>
                            <div className="pt-3 border-t border-blue-100">
                              <label className="block text-[13px] font-medium text-emerald-700 mb-1.5">
                                Tr╞░ß╗¥ng hiß╗ân thß╗ï (Lookup Display) <span className="text-slate-400 font-normal">(Kh├┤ng bß║»t buß╗Öc)</span>
                              </label>
                              <select value={relFormData.displayField} onChange={(e: ChangeEvent<HTMLSelectElement>) => setRelFormData(prev => ({ ...prev, displayField: e.target.value }))}
                                className="w-full max-w-xs px-3 py-2 border border-emerald-300 bg-white rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono">
                                <option value="">-- Kh├┤ng chß╗ìn --</option>
                                {BASE_TARGET_FIELDS.map(f => <option key={f.name} value={f.name}>{f.name} ({f.label})</option>)}
                              </select>
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-lg p-6 text-center text-[13px] text-slate-400">
                          H├úy chß╗ìn thß╗▒c thß╗â ─æ├¡ch ß╗ƒ mß╗Ñc 1 ─æß╗â cß║Ñu h├¼nh kh├│a li├¬n kß║┐t
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
                        Hß╗ºy
                      </button>
                      <button type="button" onClick={handleSaveRel}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-[13px] font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        {editingRelId ? 'Cß║¡p nhß║¡t quan hß╗ç' : 'L╞░u quan hß╗ç'}
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
                    <p className="text-[13px] font-semibold text-slate-700">Ch╞░a c├│ quan hß╗ç n├áo</p>
                    <p className="text-[13px] text-slate-500 mt-1 max-w-sm">Thß╗▒c thß╗â n├áy ch╞░a ─æ╞░ß╗úc cß║Ñu h├¼nh li├¬n kß║┐t vß╗¢i thß╗▒c thß╗â dß╗» liß╗çu chß╗º n├áo kh├íc.</p>
                    {!relFormOpen && (
                      <button type="button" onClick={handleOpenAddRel}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[13px] font-medium flex items-center gap-1.5">
                        <Plus className="w-4 h-4" /> Th├¬m quan hß╗ç
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-[13px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-4 py-3 font-semibold text-slate-500 text-center w-12">STT</th>
                          <th className="px-4 py-3 font-semibold text-slate-500">Thß╗▒c thß╗â ─æ├¡ch</th>
                          <th className="px-4 py-3 font-semibold text-slate-500 text-center w-24">Loß║íi</th>
                          <th className="px-4 py-3 font-semibold text-slate-500">Kh├│a nguß╗ôn</th>
                          <th className="px-4 py-3 font-semibold text-slate-500">Kh├│a ─æ├¡ch</th>
                          <th className="px-4 py-3 font-semibold text-slate-500">Tr╞░ß╗¥ng hiß╗ân thß╗ï / Bß║úng li├¬n kß║┐t</th>
                          <th className="px-4 py-3 font-semibold text-slate-500 text-center w-20">Thao t├íc</th>
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
                            <td className="px-4 py-3 font-mono text-slate-600">{rel.sourceKey || 'ΓÇö'}</td>
                            <td className="px-4 py-3 font-mono text-slate-600">{rel.targetKey || 'ΓÇö'}</td>
                            <td className="px-4 py-3 text-slate-600">
                              {rel.type === 'n-n' ? (
                                rel.mappingTable ? <code className="text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-mono">{rel.mappingTable}</code> : <span className="text-slate-400">ΓÇö</span>
                              ) : (
                                rel.displayField ? <code className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">{rel.displayField}</code> : <span className="text-slate-400">ΓÇö</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-1.5">
                                <button type="button" onClick={() => handleOpenEditRel(rel)}
                                  className="p-1.5 border border-slate-200 bg-white text-slate-500 hover:text-blue-600 hover:border-blue-300 rounded-lg transition-colors" title="Chß╗ënh sß╗¡a">
                                  <SquarePen className="w-3.5 h-3.5" />
                                </button>
                                <button type="button" onClick={() => handleDeleteRel(rel.id)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="X├│a">
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

          {/* Step 6: Ph├¬ duyß╗çt */}
          {currentStep === 6 && (
            <div className="space-y-4">

              {/* Reviewer + Notes */}
              <div className="border border-blue-200 rounded-lg overflow-hidden">
                <div className="bg-blue-50 px-4 py-2.5 border-b border-blue-200">
                  <h4 className="text-[13px] font-semibold text-blue-900">Th├┤ng tin ph├¬ duyß╗çt</h4>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-[13px] text-slate-700 mb-1.5">
                      Chß╗ìn ng╞░ß╗¥i tr├¼nh duyß╗çt <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={wizardData.approvalReviewer}
                      onChange={(e) => setWizardData({ ...wizardData, approvalReviewer: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">-- Chß╗ìn ng╞░ß╗¥i tr├¼nh duyß╗çt --</option>
                      {MOCK_REVIEWERS.map(r => (
                        <option key={r.id} value={r.id}>{r.name} ΓÇö {r.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] text-slate-700 mb-1.5">
                      Ghi ch├║ ph├¬ duyß╗çt
                    </label>
                    <textarea
                      value={wizardData.approvalNotes}
                      onChange={(e) => setWizardData({ ...wizardData, approvalNotes: e.target.value })}
                      placeholder="Nhß║¡p l├╜ do v├á ghi ch├║ cho viß╗çc tß║ío dß╗» liß╗çu chß╗º n├áy..."
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Review 1: Th├┤ng tin c╞í bß║ún */}
              <div className="border border-blue-200 rounded-lg overflow-hidden">
                <div className="bg-blue-50 px-4 py-2.5 border-b border-blue-200">
                  <h4 className="text-[13px] font-semibold text-blue-900">Th├┤ng tin c╞í bß║ún</h4>
                </div>
                <div className="p-4 grid grid-cols-2 gap-x-8 gap-y-2 text-[13px]">
                  <div className="flex gap-2"><span className="text-slate-500 w-36 flex-shrink-0">M├ú thß╗▒c thß╗â:</span><span className="text-slate-900">{wizardData.code || 'ΓÇö'}</span></div>
                  <div className="flex gap-2"><span className="text-slate-500 w-36 flex-shrink-0">T├¬n dß╗» liß╗çu chß╗º:</span><span className="text-slate-900">{wizardData.name || 'ΓÇö'}</span></div>
                  <div className="flex gap-2"><span className="text-slate-500 w-36 flex-shrink-0">Loß║íi thß╗▒c thß╗â:</span><span className="text-slate-900">{DATA_TYPE_LABELS[wizardData.dataType] || 'ΓÇö'}</span></div>
                  <div className="flex gap-2"><span className="text-slate-500 w-36 flex-shrink-0">Phß║ím vi sß╗¡ dß╗Ñng:</span><span className="text-slate-900">{SCOPE_TYPE_LABELS[wizardData.scope] || 'ΓÇö'}</span></div>
                  <div className="flex gap-2"><span className="text-slate-500 w-36 flex-shrink-0">─É╞ín vß╗ï chß╗º quß║ún:</span><span className="text-slate-900">{wizardData.managingAgency || 'ΓÇö'}</span></div>
                  <div className="flex gap-2"><span className="text-slate-500 w-36 flex-shrink-0">Trß║íng th├íi v├▓ng ─æß╗¥i:</span><span className="text-slate-900">{LIFECYCLE_STATUS_LABELS[wizardData.lifecycleStatus] || 'ΓÇö'}</span></div>
                  <div className="flex gap-2"><span className="text-slate-500 w-36 flex-shrink-0">T├¬n CSDL/Hß╗ç thß╗æng:</span><span className="text-slate-900">{wizardData.systemName || 'ΓÇö'}</span></div>
                  <div className="flex gap-2"><span className="text-slate-500 w-36 flex-shrink-0">Nguß╗ôn dß╗» liß╗çu ─æ─âng k├╜:</span><span className="text-slate-900">{wizardData.sources.length > 0 ? wizardData.sources.map(s => s.name).join(', ') : 'ΓÇö'}</span></div>
                  <div className="col-span-2 flex gap-2"><span className="text-slate-500 w-36 flex-shrink-0">M├┤ tß║ú ─æß╗æi t╞░ß╗úng:</span><span className="text-slate-900">{wizardData.description || 'ΓÇö'}</span></div>
                </div>
              </div>

              {/* Review 2: C├íc tr╞░ß╗¥ng dß╗» liß╗çu ΓÇö dß╗▒a tr├¬n bß║úng ├ünh xß║í cß╗Öt nguß╗ôn ΓåÆ thuß╗Öc t├¡nh ß╗ƒ B╞░ß╗¢c 2 */}
              <div className="border border-blue-200 rounded-lg overflow-hidden">
                <div className="bg-blue-50 px-4 py-2.5 border-b border-blue-200 flex items-center justify-between">
                  <h4 className="text-[13px] font-semibold text-blue-900">C├íc tr╞░ß╗¥ng dß╗» liß╗çu</h4>
                  <span className="text-[13px] text-blue-600">{availableFields.length} tr╞░ß╗¥ng</span>
                </div>
                {availableFields.length === 0 ? (
                  <div className="p-4 text-[13px] text-slate-500 text-center">Ch╞░a c├│ tr╞░ß╗¥ng dß╗» liß╗çu n├áo</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-[13px]">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-2 text-left text-slate-600 font-medium">Thuß╗Öc t├¡nh</th>
                          {registeredSources.map(src => (
                            <th key={src.id} className="px-4 py-2 text-left text-slate-600 font-medium">{src.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {availableFields.map((f, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="px-4 py-2">
                              <span className="text-slate-900 font-medium">{f.displayName}</span>
                              <code className="ml-1.5 text-[13px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{f.fieldName}</code>
                            </td>
                            {registeredSources.map(src => {
                              const selectedColumn = wizardData.mapping[f.fieldName]?.[src.id] || '';
                              const mismatch = isMappingMismatch(f.dataType, selectedColumn);
                              return (
                                <td key={src.id} className="px-4 py-2">
                                  <span className={mismatch ? 'text-amber-700 font-medium' : 'text-slate-700'}>{selectedColumn || 'ΓÇö'}</span>
                                  {mismatch && <AlertTriangle className="inline w-3 h-3 ml-1 text-amber-600 align-text-top" />}
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

              {/* Review 3: Quy tß║»c ─æß╗ïnh danh */}
              <div className="border border-blue-200 rounded-lg overflow-hidden">
                <div className="bg-blue-50 px-4 py-2.5 border-b border-blue-200">
                  <h4 className="text-[13px] font-semibold text-blue-900">Quy tß║»c ─æß╗ïnh danh</h4>
                </div>
                <div className="p-4 grid grid-cols-2 gap-x-8 gap-y-2 text-[13px]">
                  <div className="flex gap-2"><span className="text-slate-500 w-36 flex-shrink-0">Tiß╗ün tß╗æ:</span><span className="text-slate-900">{identifierConfig.prefix || '(Kh├┤ng c├│)'}</span></div>
                  <div className="flex gap-2"><span className="text-slate-500 w-36 flex-shrink-0">Hß║¡u tß╗æ:</span><span className="text-slate-900">{identifierConfig.suffix || '(Kh├┤ng c├│)'}</span></div>
                  <div className="flex gap-2"><span className="text-slate-500 w-36 flex-shrink-0">K├╜ tß╗▒ ph├ón c├ích:</span><span className="text-slate-900">{{ none: 'Kh├┤ng c├│', '-': 'Gß║ích ngang (-)', '.': 'Dß║Ñu chß║Ñm (.)', '/': 'Gß║ích ch├⌐o (/)' }[identifierConfig.separator]}</span></div>
                  <div className="flex gap-2"><span className="text-slate-500 w-36 flex-shrink-0">─Éß╗Ö d├ái sß╗æ:</span><span className="text-slate-900">{identifierConfig.digits} chß╗» sß╗æ</span></div>
                  <div className="flex gap-2"><span className="text-slate-500 w-36 flex-shrink-0">Bß║»t ─æß║ºu tß╗½:</span><span className="text-slate-900">{identifierConfig.startFrom}</span></div>
                  <div className="flex gap-2"><span className="text-slate-500 w-36 flex-shrink-0">Kiß╗âm tra tr├╣ng:</span><span className="text-slate-900">{identifierConfig.checkDuplicate ? 'C├│' : 'Kh├┤ng'}</span></div>
                </div>
              </div>

              {/* Review 4: Quy tß║»c hß╗úp nhß║Ñt */}
              <div className="border border-blue-200 rounded-lg overflow-hidden">
                <div className="bg-blue-50 px-4 py-2.5 border-b border-blue-200">
                  <h4 className="text-[13px] font-semibold text-blue-900">Quy tß║»c hß╗úp nhß║Ñt</h4>
                </div>
                <div className="p-4 space-y-3 text-[13px]">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-slate-500 mb-1">Quy tß║»c so khß╗¢p</div>
                      <div className="text-xl font-semibold text-slate-900">{matchingRules.length}</div>
                      <div className="text-[12px] text-slate-400">quy tß║»c</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-slate-500 mb-1">Quy tß║»c tr├¡ch r├║t</div>
                      <div className="text-xl font-semibold text-slate-900">{extractionRules.length}</div>
                      <div className="text-[12px] text-slate-400">quy tß║»c</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-slate-500 mb-1">Ng╞░ß╗íng so khß╗¢p</div>
                      <div className="text-xl font-semibold text-slate-900">{mergeConfig.minMatchScore}%</div>
                      <div className="text-[12px] text-slate-400">tß╗æi thiß╗âu</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    <div className="flex gap-2"><span className="text-slate-500 w-40 flex-shrink-0">Ph╞░╞íng thß╗⌐c hß╗úp nhß║Ñt:</span><span className="text-slate-900">{mergeConfig.mergeTrigger === 'auto' ? 'Tß╗▒ ─æß╗Öng' : 'Cß║ºn ph├¬ duyß╗çt'}</span></div>
                    <div className="flex gap-2"><span className="text-slate-500 w-40 flex-shrink-0">L╞░u tham chiß║┐u nguß╗ôn:</span><span className="text-slate-900">{mergeConfig.keepSourceRef ? 'C├│' : 'Kh├┤ng'}</span></div>
                  </div>
                </div>
              </div>

              {/* Review 5: Quan hß╗ç ─æ├ú thiß║┐t lß║¡p */}
              <div className="border border-blue-200 rounded-lg overflow-hidden">
                <div className="bg-blue-50 px-4 py-2.5 border-b border-blue-200 flex items-center justify-between">
                  <h4 className="text-[13px] font-semibold text-blue-900">Quan hß╗ç ─æ├ú thiß║┐t lß║¡p</h4>
                  <span className="text-[13px] text-blue-600">{wizardData.relationships.length} quan hß╗ç</span>
                </div>
                {wizardData.relationships.length === 0 ? (
                  <div className="p-4 text-[13px] text-slate-500 text-center">Ch╞░a thiß║┐t lß║¡p quan hß╗ç n├áo</div>
                ) : (
                  <table className="w-full text-[13px]">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2 text-left text-slate-600 font-medium">Thß╗▒c thß╗â li├¬n kß║┐t</th>
                        <th className="px-4 py-2 text-left text-slate-600 font-medium">Loß║íi quan hß╗ç</th>
                        <th className="px-4 py-2 text-left text-slate-600 font-medium">Tr╞░ß╗¥ng li├¬n kß║┐t</th>
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
                          <td className="px-4 py-2 text-slate-500">{rel.sourceKey} ΓåÆ {rel.targetKey}</td>
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
                    <p className="mb-1">Sau khi gß╗¡i, dß╗» liß╗çu chß╗º sß║╜ ß╗ƒ trß║íng th├íi <strong>"Chß╗¥ ph├¬ duyß╗çt"</strong>.</p>
                    <p>Ng╞░ß╗¥i ph├¬ duyß╗çt sß║╜ xem x├⌐t v├á quyß║┐t ─æß╗ïnh ph├¬ duyß╗çt hoß║╖c tß╗½ chß╗æi.</p>
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
            Quay lß║íi
          </button>

          <div className="text-[13px] text-slate-600">
            B╞░ß╗¢c {currentStep} / {steps.length}
          </div>

          {currentStep < 6 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tiß║┐p theo
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmitWizard}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Check className="w-4 h-4" />
              Gß╗¡i ph├¬ duyß╗çt
            </button>
          )}
        </div>
      </div>
    </div>
  </Portal>
  );
}