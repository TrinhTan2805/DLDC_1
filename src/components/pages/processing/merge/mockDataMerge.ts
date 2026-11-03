// Dữ liệu mẫu riêng cho chức năng Hợp nhất dữ liệu (tailieu/docs/thiet_ke_hop_nhat_du_lieu.md).
// Không sửa mock dùng chung của các màn khác; CSDL đích chỉ đọc từ mockTargetDatabases.

export type SourceGroup = 'Trong ngành' | 'Ngoài ngành';
// Không có Tạm dừng (giống màn Xử lý dữ liệu): ngừng chạy tự động thì tắt ở Lịch biểu
export type MergeStatus = 'active' | 'draft' | 'needs_config';
// Mỗi cấu hình chỉ 1 loại kết hợp: Join (nối thông tin) hoặc Union (gộp dòng)
export type CombineType = 'join' | 'union';
export type JoinType = 'left' | 'inner' | 'full';
export type OneToManyRule = 'latest' | 'concat' | 'error';
export type JoinOperator = '=' | '<>' | '>' | '>=' | '<' | '<=';
export type KeyNormalize = 'none' | 'trim' | 'trim_upper' | 'digits';
export type FilterOperator = '=' | '<>' | '>' | '>=' | '<' | '<=' | 'contains' | 'in' | 'is_null' | 'not_null';
// Cách lấy giá trị cho 1 cột đích
export type ValueMode = 'column' | 'priority' | 'fixed';
export type TargetKeyMode = 'auto' | 'column';
export type DuplicateRule = 'keep_old' | 'latest' | 'source_priority' | 'error';

export interface MergeSourceField {
  name: string;
  type: string;
}

// Bộ dữ liệu thu thập gốc của từng nguồn
export interface MergeSourceDataset {
  id: string;
  name: string;
  sourceDb: string;
  group: SourceGroup;
  records: number;
  processedAt: string | null; // lần thu thập gần nhất; null = chưa có dữ liệu thu thập
  directTarget?: string; // đang ghi trực tiếp vào một bảng đích khác
  keyFields?: string[]; // khóa chính của bộ dữ liệu nguồn — căn cứ cập nhật; không có thì người dùng phải chỉ định
  fields: MergeSourceField[];
}

export interface MergeTargetColumn {
  name: string;
  type: string;
  isKey?: boolean; // khóa chính: luôn không trống, không trùng
  nullable?: boolean; // cho phép trống; không cho phép mà kết quả trống → không ghi dòng
}

export interface MergeTargetTable {
  dbId: string;
  name: string;
  description: string;
  columns: MergeTargetColumn[];
}

// Tham chiếu 1 cột: `${toán hạng}::${tên cột}`; toán hạng = mã bộ dữ liệu, hoặc `union` (cột kết quả gộp của Union)
export type ColumnRef = string;
export const colRef = (operand: string, field: string): ColumnRef => `${operand}::${field}`;
export const splitRef = (ref: ColumnRef) => {
  const i = ref.lastIndexOf('::');
  return i < 0 ? { operand: '', field: ref } : { operand: ref.slice(0, i), field: ref.slice(i + 2) };
};
export const UNION_OPERAND = 'union';

// Điều kiện ghép (ON) của 1 bảng nối: cột bảng phía trên = cột bảng nối, hoặc cột = giá trị (VD BHXH.TRANG_THAI = 1)
export interface OnCondition {
  left: ColumnRef;
  operator: JoinOperator;
  rightKind: 'column' | 'value';
  right: ColumnRef;
  value: string;
  normalize: KeyNormalize; // chuẩn hóa 2 vế trước khi so sánh (cột = cột)
}
// Điều kiện lọc (WHERE): 1 bộ chung, lọc trên kết quả kết hợp
export interface WhereCondition {
  field: ColumnRef;
  operator: FilterOperator;
  value: string;
}
// Join: mỗi bảng nối thêm vào bảng chính là 1 dòng
export interface JoinStep {
  id: string;
  type: JoinType;
  table: string; // bộ dữ liệu nối thêm
  conditions: OnCondition[];
  oneToMany: OneToManyRule;
}
// Union: 1 cột kết quả lấy từ cột tương ứng của từng nguồn (để trống = NULL)
export interface UnionColumn {
  name: string;
  refs: Record<string, string>; // mã bộ dữ liệu → tên trường
}
// Ánh xạ 1 cột đích: theo cột / theo độ ưu tiên (lấy cột đầu tiên có dữ liệu) / giá trị cố định
export interface ColumnMapping {
  mode: ValueMode;
  columns: ColumnRef[];
  value: string;
}

// Quy tắc xử lý riêng của từng nguồn trong cấu hình hợp nhất: áp lên dữ liệu thu thập gốc,
// độc lập với chức năng Xử lý dữ liệu cũ (vốn xử lý xong là ghi thẳng vào bảng đích)
export type RuleGroup = 'clean' | 'standardize' | 'transform';
export type SourceRuleKind = 'format' | 'validity' | 'replace' | 'dedup' | 'reference' | 'convert';
export interface SourceRule {
  id: string;
  kind: SourceRuleKind;
  field: string;
  operator?: string; // format: kiểu định dạng · validity / replace: điều kiện · reference: danh mục · convert: kiểu dữ liệu
  value?: string; // validity: giá trị · replace: giá trị nguồn · dedup: cột sắp xếp · reference: giá trị mặc định · convert: định dạng
  replaceWith?: string; // replace: giá trị thay thế
  action?: string; // format / validity / dedup / reference: xử lý ngoại lệ
}

export interface MergeSourceRef {
  datasetId: string;
  keyFields?: string[]; // trường khóa người dùng chỉ định khi bộ dữ liệu nguồn không có khóa chính
  rules?: SourceRule[];
}

export interface MergeConfig {
  id: string;
  code: string;
  name: string;
  description: string;
  status: MergeStatus;
  targetDbId: string;
  targetTable: string;
  newTableColumns?: MergeTargetColumn[]; // cấu trúc bảng tạo mới
  sources: MergeSourceRef[];
  combineType: CombineType;
  baseTable: string; // Join: bảng chính – mỗi dòng bảng chính tạo 1 dòng kết quả
  joins: JoinStep[]; // Join: các bảng nối thêm theo thứ tự
  unionAll: boolean; // Union: true = giữ tất cả dòng, false = bỏ dòng trùng hoàn toàn
  unionColumns: UnionColumn[]; // Union: ghép cột
  filters: WhereCondition[]; // điều kiện lọc chung
  mappings: Record<string, ColumnMapping>; // theo tên cột đích
  // Khóa chính bảng đích: tự động hoặc lấy theo 1 cột kết quả. Căn cứ cập nhật vẫn là khóa từng nguồn (DIP_RefId).
  targetKey: { mode: TargetKeyMode; column: ColumnRef };
  duplicateRule: DuplicateRule; // khi trùng khóa chính (chỉ khi khóa lấy theo cột)
  duplicateTimeColumn: ColumnRef; // luật "mới nhất": cột thời gian của dữ liệu
  sourcePriority: string[]; // luật "ưu tiên theo nguồn"
  dataCount: number; // số bản ghi cấu hình đã ghi vào bảng đích; > 0 thì phải xóa dữ liệu trước khi chỉnh sửa / xóa cấu hình
  schedule: string;
  createdBy: string;
  createdAt: string;
  lastRun?: { at: string; result: 'success' | 'partial' | 'failed' };
}

// Hoạt động trên dữ liệu bảng đích – cùng bộ nút với màn Xử lý dữ liệu
export type RunActivity = 'convert' | 'update' | 'clear';

export interface MergeRunLog {
  id: string; // mã yêu cầu
  configId: string;
  activity: RunActivity;
  createdAt: string; // thời gian khởi tạo yêu cầu
  startedAt: string;
  endedAt: string;
  duration: string;
  result: 'success' | 'partial' | 'failed';
  errorCode?: string;
  clearedRecords?: number; // Xóa dữ liệu: số bản ghi đã xóa
  perSource: { datasetId: string; inserted: number; updated: number; deleted: number; unmatched?: number }[];
  duplicates?: number; // dòng không được chọn do trùng khóa chính
  rejected?: number; // dòng bị loại do thiếu giá trị bắt buộc
  createdBy: string;
}

export const MERGE_STATUS_LABEL: Record<MergeStatus, string> = {
  active: 'Hoạt động',
  draft: 'Bản nháp',
  needs_config: 'Cần cấu hình lại',
};
export const MERGE_STATUS_VARIANT: Record<MergeStatus, string> = { active: 'green', draft: 'slate', needs_config: 'orange' };
export const RUN_RESULT_LABEL: Record<'success' | 'partial' | 'failed', string> = {
  success: 'Thành công',
  partial: 'Thành công một phần',
  failed: 'Lỗi',
};
export const RUN_ACTIVITY_LABEL: Record<RunActivity, string> = { convert: 'Chuyển đổi dữ liệu', update: 'Cập nhật dữ liệu', clear: 'Xóa dữ liệu' };
export const RUN_ACTIVITY_VARIANT: Record<RunActivity, string> = { convert: 'emerald', update: 'indigo', clear: 'red' };
export const RUN_RESULT_VARIANT: Record<'success' | 'partial' | 'failed', string> = { success: 'emerald', partial: 'amber', failed: 'red' };

export const COMBINE_LABEL: Record<CombineType, 'JOIN' | 'UNION'> = { join: 'JOIN', union: 'UNION' };
export const COMBINE_TITLE: Record<CombineType, string> = { join: 'Join – nối thông tin', union: 'Union – gộp dòng' };
export const COMBINE_DESC: Record<CombineType, string> = {
  join: 'Ghép các bảng theo điều kiện, mỗi dòng có thêm cột từ bảng khác',
  union: 'Xếp dòng các bảng cùng loại vào chung một bảng',
};
export const JOIN_TYPE_LABEL: Record<JoinType, string> = { left: 'Left Join', inner: 'Inner Join', full: 'Full Join' };
export const JOIN_TYPE_DESC: Record<JoinType, string> = {
  left: 'giữ toàn bộ dòng phía trên',
  inner: 'chỉ giữ dòng khớp',
  full: 'giữ toàn bộ 2 phía',
};
export const unionLabel = (all: boolean) => (all ? 'Union All' : 'Union');
export const ONE_TO_MANY_LABEL: Record<OneToManyRule, string> = {
  latest: 'Lấy bản ghi cập nhật mới nhất',
  concat: 'Nối các giá trị (phân cách bằng dấu ;)',
  error: 'Báo lỗi, không ghép',
};
export const JOIN_OPERATORS: JoinOperator[] = ['=', '<>', '>', '>=', '<', '<='];
export const NORMALIZE_LABEL: Record<KeyNormalize, string> = {
  none: 'Giữ nguyên',
  trim: 'Bỏ khoảng trắng đầu/cuối',
  trim_upper: 'Bỏ khoảng trắng + chữ hoa',
  digits: 'Chỉ giữ chữ số',
};
export const FILTER_OPERATOR_LABEL: Record<FilterOperator, string> = {
  '=': 'Bằng (=)', '<>': 'Khác (<>)', '>': 'Lớn hơn (>)', '>=': 'Lớn hơn hoặc bằng (>=)', '<': 'Nhỏ hơn (<)', '<=': 'Nhỏ hơn hoặc bằng (<=)',
  contains: 'Chứa', in: 'Thuộc danh sách (IN)', is_null: 'Rỗng', not_null: 'Không rỗng',
};
export const filterNeedsValue = (op: FilterOperator) => op !== 'is_null' && op !== 'not_null';
export const VALUE_MODE_LABEL: Record<ValueMode, string> = { column: 'Theo cột', priority: 'Theo độ ưu tiên', fixed: 'Giá trị cố định' };
export const DUPLICATE_RULE_LABEL: Record<DuplicateRule, string> = {
  keep_old: 'Giữ dòng cũ',
  latest: 'Cập nhật theo dòng mới nhất',
  source_priority: 'Ưu tiên theo nguồn',
  error: 'Báo lỗi, không ghi',
};

export const mergeSourceDatasets: MergeSourceDataset[] = [
  {
    id: 'ds-khaisinh-htdt', name: 'Khai sinh', sourceDb: 'CSDL Hộ tịch điện tử', group: 'Trong ngành', records: 8120, processedAt: '27/10/2026 14:18',
    keyFields: ['SO_DANG_KY'],
    fields: [
      { name: 'SO_DANG_KY', type: 'VARCHAR(20)' }, { name: 'SO_DINH_DANH', type: 'VARCHAR(12)' }, { name: 'HO_TEN', type: 'NVARCHAR(200)' }, { name: 'NGAY_SINH', type: 'DATE' },
      { name: 'GIOI_TINH', type: 'NUMBER(1)' }, { name: 'NOI_SINH', type: 'NVARCHAR(500)' }, { name: 'DAN_TOC', type: 'VARCHAR(20)' },
      { name: 'HO_TEN_CHA', type: 'NVARCHAR(200)' }, { name: 'HO_TEN_ME', type: 'NVARCHAR(200)' }, { name: 'NGAY_DANG_KY', type: 'DATE' },
    ],
  },
  {
    id: 'ds-khaisinh-tinh', name: 'Khai sinh (hệ thống tỉnh)', sourceDb: 'CSDL Hộ tịch cấp tỉnh', group: 'Trong ngành', records: 3460, processedAt: '27/10/2026 13:05',
    keyFields: ['ID'],
    fields: [
      { name: 'ID', type: 'NUMBER(10)' }, { name: 'MA_DINH_DANH', type: 'VARCHAR(12)' }, { name: 'HOTEN', type: 'NVARCHAR(255)' }, { name: 'NGAYSINH', type: 'DATE' },
      { name: 'GIOITINH', type: 'VARCHAR(10)' }, { name: 'NOISINH', type: 'NVARCHAR(500)' }, { name: 'DANTOC', type: 'VARCHAR(20)' },
      { name: 'NGAYDANGKY', type: 'DATE' },
    ],
  },
  {
    id: 'ds-kethon-htdt', name: 'Kết hôn', sourceDb: 'CSDL Hộ tịch điện tử', group: 'Trong ngành', records: 3400, processedAt: '25/10/2026 09:40',
    keyFields: ['SO_DANG_KY'],
    fields: [
      { name: 'SO_DANG_KY', type: 'VARCHAR(20)' }, { name: 'SO_DINH_DANH_CHONG', type: 'VARCHAR(12)' }, { name: 'SO_DINH_DANH_VO', type: 'VARCHAR(12)' }, { name: 'NGAY_DANG_KY', type: 'DATE' },
      { name: 'NOI_DANG_KY', type: 'NVARCHAR(500)' },
    ],
  },
  {
    id: 'ds-khaitu-htdt', name: 'Khai tử', sourceDb: 'CSDL Hộ tịch điện tử', group: 'Trong ngành', records: 0, processedAt: null,
    fields: [{ name: 'SO_DINH_DANH', type: 'VARCHAR(12)' }, { name: 'NGAY_CHET', type: 'DATE' }, { name: 'NOI_CHET', type: 'NVARCHAR(500)' }],
  },
  {
    id: 'ds-congdan-dancu', name: 'Công dân', sourceDb: 'CSDL Quốc gia về Dân cư', group: 'Ngoài ngành', records: 12450, processedAt: '27/10/2026 15:02',
    keyFields: ['ID_CD'],
    fields: [
      { name: 'ID_CD', type: 'NUMBER(10)' }, { name: 'SO_CCCD', type: 'VARCHAR(12)' }, { name: 'HO_TEN', type: 'NVARCHAR(200)' }, { name: 'NGAY_SINH', type: 'DATE' },
      { name: 'GIOI_TINH', type: 'NUMBER(1)' }, { name: 'DIA_CHI_THUONG_TRU', type: 'NVARCHAR(500)' }, { name: 'QUE_QUAN', type: 'NVARCHAR(500)' },
    ],
  },
  {
    id: 'ds-bhxh', name: 'Người tham gia BHXH', sourceDb: 'CSDL Bảo hiểm xã hội', group: 'Ngoài ngành', records: 11980, processedAt: '26/10/2026 22:10',
    keyFields: ['MA_HO_SO'],
    fields: [
      { name: 'MA_HO_SO', type: 'VARCHAR(10)' }, { name: 'CCCD', type: 'VARCHAR(12)' }, { name: 'MA_SO_BHXH', type: 'VARCHAR(10)' }, { name: 'HO_TEN', type: 'NVARCHAR(200)' },
      { name: 'NOI_DANG_KY_KCB', type: 'NVARCHAR(300)' }, { name: 'TRANG_THAI', type: 'NUMBER(1)' }, { name: 'NGAY_CAP_NHAT', type: 'DATE' },
    ],
  },
  {
    id: 'ds-nguoicocong', name: 'Người có công', sourceDb: 'CSDL Người có công', group: 'Ngoài ngành', records: 2310, processedAt: '24/10/2026 08:30',
    directTarget: 'CSDL Kho DLDC · DIP_NGUOI_CO_CONG',
    keyFields: ['MA_HO_SO'],
    fields: [{ name: 'MA_HO_SO', type: 'VARCHAR(12)' }, { name: 'SO_CCCD', type: 'VARCHAR(12)' }, { name: 'DIEN_CHINH_SACH', type: 'NVARCHAR(200)' }, { name: 'MUC_TRO_CAP', type: 'NUMBER(12)' }],
  },
];

export const mergeTargetTables: MergeTargetTable[] = [
  {
    dbId: '1', name: 'HS_KHAI_SINH', description: 'Hồ sơ khai sinh',
    columns: [
      { name: 'MA_SO_DINH_DANH', type: 'VARCHAR2(12)', isKey: true }, { name: 'HO_TEN', type: 'NVARCHAR2(255)' }, { name: 'NGAY_SINH', type: 'DATE' },
      { name: 'GIOI_TINH', type: 'VARCHAR2(10)', nullable: true }, { name: 'NOI_SINH', type: 'NVARCHAR2(500)', nullable: true }, { name: 'DAN_TOC', type: 'VARCHAR2(20)', nullable: true },
      { name: 'HO_TEN_CHA', type: 'NVARCHAR2(200)', nullable: true }, { name: 'HO_TEN_ME', type: 'NVARCHAR2(200)', nullable: true }, { name: 'NGAY_DANG_KY', type: 'DATE' },
    ],
  },
  {
    dbId: '1', name: 'DIP_PERSON', description: 'Thông tin cá nhân',
    columns: [
      { name: 'ID', type: 'NUMBER(18)', isKey: true }, { name: 'CCCD', type: 'VARCHAR2(12)' }, { name: 'HO_TEN', type: 'NVARCHAR2(200)' }, { name: 'NGAY_SINH', type: 'DATE', nullable: true },
      { name: 'GIOI_TINH', type: 'NUMBER(1)', nullable: true }, { name: 'DIA_CHI', type: 'NVARCHAR2(500)', nullable: true }, { name: 'NOI_SINH', type: 'NVARCHAR2(500)', nullable: true },
      { name: 'MA_SO_BHXH', type: 'VARCHAR2(10)', nullable: true }, { name: 'NOI_KCB', type: 'NVARCHAR2(300)', nullable: true },
    ],
  },
  {
    dbId: '2', name: 'FACT_DAN_CU', description: 'Bảng phân tích dân cư',
    columns: [
      { name: 'ID', type: 'NUMBER(18)', isKey: true }, { name: 'CCCD', type: 'VARCHAR2(12)' }, { name: 'HO_TEN', type: 'NVARCHAR2(200)' }, { name: 'NGAY_SINH', type: 'DATE', nullable: true },
      { name: 'DIEN_CHINH_SACH', type: 'NVARCHAR2(200)' },
    ],
  },
];

// Cột kỹ thuật hệ thống tự thêm vào bảng đích của cấu hình hợp nhất (mục 7.2 tài liệu thiết kế)
export const TECH_COLUMNS = [
  { name: 'DIP_SourceId', note: 'Nguồn của bản ghi' },
  { name: 'DIP_RefId', note: 'Khóa bản ghi nguồn tạo ra dòng – căn cứ cập nhật' },
  { name: 'DIP_SourceRefs', note: 'Khóa các bản ghi nguồn khác đã ghép vào dòng' },
  { name: 'DIP_Hash', note: 'Phát hiện thay đổi' },
  { name: 'DIP_UpdatedAt', note: 'Thời điểm ghi / sửa' },
];

const cd = 'ds-congdan-dancu';
const ks = 'ds-khaisinh-htdt';
const kst = 'ds-khaisinh-tinh';
const bh = 'ds-bhxh';
const ncc = 'ds-nguoicocong';
const col = (field: string, operand: string): ColumnMapping => ({ mode: 'column', columns: [colRef(operand, field)], value: '' });

export const initialMergeConfigs: MergeConfig[] = [
  {
    id: 'mc-1', code: 'HN_KHAI_SINH', name: 'Hợp nhất hồ sơ khai sinh toàn quốc',
    description: 'Gộp khai sinh từ CSDL Hộ tịch điện tử và hệ thống hộ tịch cấp tỉnh vào một bảng.',
    status: 'active', targetDbId: '1', targetTable: 'HS_KHAI_SINH',
    sources: [
      {
        datasetId: ks,
        rules: [{ id: 'r-ksh-1', kind: 'replace', field: 'DAN_TOC', operator: 'Rỗng (thiếu dữ liệu)', value: '', replaceWith: 'Kinh' }],
      },
      {
        datasetId: kst,
        rules: [
          { id: 'r-kst-1', kind: 'format', field: 'MA_DINH_DANH', operator: 'Đúng định dạng CCCD', action: 'Loại bỏ bản ghi lỗi' },
          { id: 'r-kst-2', kind: 'reference', field: 'GIOITINH', operator: 'Danh mục Giới tính', action: 'Gán giá trị mặc định', value: 'Khác' },
          { id: 'r-kst-3', kind: 'convert', field: 'HOTEN', operator: 'Chuỗi ký tự', value: 'VIẾT HOA' },
        ],
      },
    ],
    combineType: 'union', baseTable: '', joins: [], unionAll: true,
    unionColumns: [
      { name: 'MA_SO_DINH_DANH', refs: { [ks]: 'SO_DINH_DANH', [kst]: 'MA_DINH_DANH' } },
      { name: 'HO_TEN', refs: { [ks]: 'HO_TEN', [kst]: 'HOTEN' } },
      { name: 'NGAY_SINH', refs: { [ks]: 'NGAY_SINH', [kst]: 'NGAYSINH' } },
      { name: 'GIOI_TINH', refs: { [ks]: 'GIOI_TINH', [kst]: 'GIOITINH' } },
      { name: 'NOI_SINH', refs: { [ks]: 'NOI_SINH', [kst]: 'NOISINH' } },
      { name: 'DAN_TOC', refs: { [ks]: 'DAN_TOC', [kst]: 'DANTOC' } },
      { name: 'HO_TEN_CHA', refs: { [ks]: 'HO_TEN_CHA', [kst]: '' } },
      { name: 'HO_TEN_ME', refs: { [ks]: 'HO_TEN_ME', [kst]: '' } },
      { name: 'NGAY_DANG_KY', refs: { [ks]: 'NGAY_DANG_KY', [kst]: 'NGAYDANGKY' } },
    ],
    filters: [{ field: colRef(UNION_OPERAND, 'NGAY_DANG_KY'), operator: '>=', value: '01/01/2016' }],
    mappings: {
      HO_TEN: col('HO_TEN', UNION_OPERAND), NGAY_SINH: col('NGAY_SINH', UNION_OPERAND), GIOI_TINH: col('GIOI_TINH', UNION_OPERAND), NOI_SINH: col('NOI_SINH', UNION_OPERAND),
      DAN_TOC: col('DAN_TOC', UNION_OPERAND), HO_TEN_CHA: col('HO_TEN_CHA', UNION_OPERAND), HO_TEN_ME: col('HO_TEN_ME', UNION_OPERAND), NGAY_DANG_KY: col('NGAY_DANG_KY', UNION_OPERAND),
    },
    targetKey: { mode: 'column', column: colRef(UNION_OPERAND, 'MA_SO_DINH_DANH') },
    duplicateRule: 'source_priority', duplicateTimeColumn: '', sourcePriority: [ks, kst],
    dataCount: 11406,
    schedule: 'Hàng ngày 01:00', createdBy: 'Nguyễn Văn A', createdAt: '20/10/2026 09:15',
    lastRun: { at: '28/10/2026 01:00', result: 'success' },
  },
  {
    id: 'mc-2', code: 'HN_CONG_DAN', name: 'Hợp nhất thông tin công dân',
    description: 'Ghép thông tin công dân với khai sinh và bảo hiểm xã hội theo số CCCD.',
    status: 'active', targetDbId: '1', targetTable: 'DIP_PERSON',
    sources: [
      {
        datasetId: cd,
        rules: [
          { id: 'r-cd-1', kind: 'format', field: 'SO_CCCD', operator: 'Đúng định dạng CCCD', action: 'Loại bỏ bản ghi lỗi' },
          { id: 'r-cd-2', kind: 'dedup', field: 'SO_CCCD', action: 'Giữ bản ghi mới nhất', value: 'Ngày cập nhật' },
        ],
      },
      { datasetId: ks },
      { datasetId: bh, rules: [{ id: 'r-bh-1', kind: 'convert', field: 'NOI_DANG_KY_KCB', operator: 'Chuỗi ký tự', value: 'Bỏ khoảng trắng thừa' }] },
    ],
    combineType: 'join', baseTable: cd, unionAll: true, unionColumns: [],
    joins: [
      {
        id: 'j1', type: 'left', table: ks, oneToMany: 'latest',
        conditions: [{ left: colRef(cd, 'SO_CCCD'), operator: '=', rightKind: 'column', right: colRef(ks, 'SO_DINH_DANH'), value: '', normalize: 'trim' }],
      },
      {
        id: 'j2', type: 'left', table: bh, oneToMany: 'latest',
        conditions: [
          { left: colRef(cd, 'SO_CCCD'), operator: '=', rightKind: 'column', right: colRef(bh, 'CCCD'), value: '', normalize: 'trim' },
          { left: colRef(bh, 'TRANG_THAI'), operator: '=', rightKind: 'value', right: '', value: '1', normalize: 'none' },
        ],
      },
    ],
    filters: [{ field: colRef(cd, 'SO_CCCD'), operator: 'not_null', value: '' }],
    mappings: {
      CCCD: col('SO_CCCD', cd),
      HO_TEN: { mode: 'priority', columns: [colRef(cd, 'HO_TEN'), colRef(bh, 'HO_TEN'), colRef(ks, 'HO_TEN')], value: '' },
      NGAY_SINH: { mode: 'priority', columns: [colRef(cd, 'NGAY_SINH'), colRef(ks, 'NGAY_SINH')], value: '' },
      GIOI_TINH: col('GIOI_TINH', cd), DIA_CHI: col('DIA_CHI_THUONG_TRU', cd), NOI_SINH: col('NOI_SINH', ks),
      MA_SO_BHXH: col('MA_SO_BHXH', bh), NOI_KCB: col('NOI_DANG_KY_KCB', bh),
    },
    targetKey: { mode: 'column', column: colRef(cd, 'ID_CD') },
    duplicateRule: 'keep_old', duplicateTimeColumn: '', sourcePriority: [],
    dataCount: 12450,
    schedule: 'Sau khi nguồn cập nhật', createdBy: 'Trần Thị Bình', createdAt: '22/10/2026 14:40',
    lastRun: { at: '27/10/2026 15:20', result: 'partial' },
  },
  {
    id: 'mc-3', code: 'HN_CHINH_SACH', name: 'Phân tích dân cư hưởng chính sách',
    description: 'Ghép công dân với dữ liệu người có công phục vụ báo cáo.',
    status: 'needs_config', targetDbId: '2', targetTable: 'FACT_DAN_CU',
    sources: [{ datasetId: cd }, { datasetId: ncc }],
    combineType: 'join', baseTable: cd, unionAll: true, unionColumns: [], filters: [],
    joins: [
      {
        id: 'j1', type: 'inner', table: ncc, oneToMany: 'concat',
        conditions: [{ left: colRef(cd, 'SO_CCCD'), operator: '=', rightKind: 'column', right: colRef(ncc, 'SO_CCCD'), value: '', normalize: 'trim' }],
      },
    ],
    mappings: {
      CCCD: col('SO_CCCD', cd), HO_TEN: col('HO_TEN', cd), NGAY_SINH: col('NGAY_SINH', cd), DIEN_CHINH_SACH: col('DIEN_CHINH_SACH', ncc),
    },
    targetKey: { mode: 'auto', column: '' },
    duplicateRule: 'keep_old', duplicateTimeColumn: '', sourcePriority: [],
    dataCount: 0,
    schedule: 'Hàng tuần (Chủ nhật 02:00)', createdBy: 'Lê Minh Châu', createdAt: '24/10/2026 10:05',
    lastRun: { at: '26/10/2026 02:00', result: 'failed' },
  },
  {
    id: 'mc-4', code: 'HN_KET_HON', name: 'Hợp nhất kết hôn (nháp)',
    description: 'Đang cấu hình.',
    status: 'draft', targetDbId: '1', targetTable: 'HS_KHAI_SINH',
    sources: [{ datasetId: 'ds-kethon-htdt' }, { datasetId: 'ds-khaitu-htdt' }],
    combineType: 'join', baseTable: '', joins: [], unionAll: true, unionColumns: [], filters: [],
    mappings: {},
    targetKey: { mode: 'auto', column: '' },
    duplicateRule: 'keep_old', duplicateTimeColumn: '', sourcePriority: [],
    dataCount: 0,
    schedule: 'Thủ công', createdBy: 'Phạm Quốc Dũng', createdAt: '27/10/2026 16:30',
  },
];

export const mergeRunLogs: MergeRunLog[] = [
  {
    id: '3105', configId: 'mc-1', activity: 'update', createdAt: '28/10/2026 01:00:00', startedAt: '28/10/2026 01:00:05', endedAt: '28/10/2026 01:01:17', duration: '1 phút 12 giây', result: 'success',
    perSource: [{ datasetId: ks, inserted: 120, updated: 35, deleted: 4 }, { datasetId: kst, inserted: 48, updated: 6, deleted: 0 }],
    duplicates: 17, rejected: 2, createdBy: 'Hệ thống (lịch)',
  },
  {
    id: '3088', configId: 'mc-1', activity: 'convert', createdAt: '27/10/2026 01:00:00', startedAt: '27/10/2026 01:00:03', endedAt: '27/10/2026 01:04:43', duration: '4 phút 40 giây', result: 'success',
    perSource: [{ datasetId: ks, inserted: 8000, updated: 0, deleted: 0 }, { datasetId: kst, inserted: 3406, updated: 0, deleted: 0 }],
    duplicates: 212, rejected: 9, createdBy: 'Nguyễn Văn A',
  },
  {
    id: '3087', configId: 'mc-1', activity: 'clear', createdAt: '27/10/2026 00:52:10', startedAt: '27/10/2026 00:52:12', endedAt: '27/10/2026 00:52:20', duration: '8 giây', result: 'success',
    perSource: [], clearedRecords: 11380, createdBy: 'Nguyễn Văn A',
  },
  {
    id: '3096', configId: 'mc-2', activity: 'convert', createdAt: '27/10/2026 15:20:05', startedAt: '27/10/2026 15:20:11', endedAt: '27/10/2026 15:26:13', duration: '6 phút 02 giây', result: 'partial',
    perSource: [
      { datasetId: cd, inserted: 12450, updated: 0, deleted: 0 },
      { datasetId: ks, inserted: 0, updated: 7690, deleted: 0, unmatched: 430 },
      { datasetId: bh, inserted: 0, updated: 11210, deleted: 0, unmatched: 770 },
    ],
    rejected: 14, createdBy: 'Trần Thị Bình',
  },
  {
    id: '3071', configId: 'mc-3', activity: 'convert', createdAt: '26/10/2026 02:00:00', startedAt: '26/10/2026 02:00:00', endedAt: '26/10/2026 02:00:12', duration: '12 giây', result: 'failed',
    errorCode: 'MERGE-SRC-404: Nguồn Người có công thay đổi cấu trúc (thiếu cột SO_CCCD)',
    perSource: [{ datasetId: cd, inserted: 0, updated: 0, deleted: 0 }, { datasetId: ncc, inserted: 0, updated: 0, deleted: 0 }],
    createdBy: 'Hệ thống (lịch)',
  },
];

export const findDataset = (id: string) => mergeSourceDatasets.find(d => d.id === id);

// Quy tắc bật / khóa thao tác – thống nhất với màn Xử lý dữ liệu (tài liệu thiết kế 7.12).
// Trả về lý do khóa (undefined = dùng được); danh sách và màn chi tiết dùng chung.
export const hasMergeData = (c: MergeConfig) => c.dataCount > 0;
export const mergeActionReasons = (c: MergeConfig) => {
  const data = hasMergeData(c);
  const notReady = c.status === 'draft' ? 'Chưa hoàn thành cấu hình (bản nháp)'
    : c.status === 'needs_config' ? 'Nguồn thay đổi cấu trúc, cần cấu hình lại' : undefined;
  return {
    convert: notReady || (data ? 'Đã có dữ liệu – dùng Cập nhật dữ liệu' : undefined),
    update: notReady || (data ? undefined : 'Chưa có dữ liệu – dùng Chuyển đổi dữ liệu'),
    clear: data ? undefined : 'Chưa có dữ liệu',
    schedule: c.status === 'draft' ? 'Chưa hoàn thành cấu hình (bản nháp)' : undefined,
    remove: data ? 'Đã có dữ liệu – xóa dữ liệu trước khi xóa cấu hình' : undefined,
  };
};

// Loại nguồn của cấu hình: tự tính từ các nguồn đã chọn
export const getSourceGroup = (sources: MergeSourceRef[]): SourceGroup | 'Kết hợp' => {
  const groups = new Set(sources.map(s => findDataset(s.datasetId)?.group).filter(Boolean));
  if (groups.size > 1) return 'Kết hợp';
  return (groups.values().next().value as SourceGroup) || 'Trong ngành';
};

// --- Kết quả kết hợp ---
type CombineHolder = Pick<MergeConfig, 'combineType' | 'baseTable' | 'joins' | 'unionAll' | 'unionColumns' | 'filters' | 'sources'>;
export interface ResultColumn { ref: ColumnRef; label: string; type: string }
export const operandLabel = (operand: string) => (operand === UNION_OPERAND ? 'Gộp' : findDataset(operand)?.name || '?');
export const tableColumns = (datasetId: string): ResultColumn[] => {
  const ds = findDataset(datasetId);
  return (ds?.fields || []).map(f => ({ ref: colRef(datasetId, f.name), label: `${ds?.name}.${f.name}`, type: f.type }));
};
// Join: bảng chính + các bảng nối theo thứ tự
export const joinTables = (c: CombineHolder) => [c.baseTable, ...c.joins.map(j => j.table)].filter(Boolean);
// Cột dùng được ở vế trái điều kiện ghép của bảng nối thứ i: bảng chính và các bảng nối phía trên
export const columnsBeforeJoin = (c: CombineHolder, i: number) => [c.baseTable, ...c.joins.slice(0, i).map(j => j.table)].filter(Boolean).flatMap(tableColumns);
// Cột kết quả kết hợp: Join = cột của mọi bảng; Union = các cột ghép
export const resultColumns = (c: CombineHolder): ResultColumn[] => {
  if (c.combineType === 'union') {
    return c.unionColumns.filter(u => u.name.trim()).map(u => {
      const first = Object.entries(u.refs).find(([, f]) => f);
      const type = first ? findDataset(first[0])?.fields.find(f => f.name === first[1])?.type || '' : '';
      return { ref: colRef(UNION_OPERAND, u.name), label: `Gộp.${u.name}`, type };
    });
  }
  return joinTables(c).flatMap(tableColumns);
};
export const columnLabel = (_c: unknown, ref: ColumnRef) => {
  const { operand, field } = splitRef(ref);
  return ref ? `${operandLabel(operand)}.${field}` : '';
};
// Bảng có thể "không có dòng khớp" (cột của nó có thể trống): bảng nối Left / Full Join,
// và với Full Join thì cả bảng chính cùng các bảng nối phía trên
export const isOptionalTable = (c: CombineHolder, datasetId: string) =>
  c.combineType === 'join' && c.joins.some((j, i) =>
    (j.type !== 'inner' && j.table === datasetId)
    || (j.type === 'full' && (c.baseTable === datasetId || c.joins.slice(0, i).some(x => x.table === datasetId))));
// Cột có thể trống do kiểu nối → cảnh báo khi đổ vào cột đích không cho phép trống
export const isOptionalColumn = (c: CombineHolder, ref: ColumnRef) => isOptionalTable(c, splitRef(ref).operand);
export const usedSources = (c: CombineHolder) => new Set(c.combineType === 'union'
  ? c.sources.map(s => s.datasetId).filter(id => c.unionColumns.some(u => u.refs[id]))
  : joinTables(c));
export const combineFamily = (c: CombineHolder): 'JOIN' | 'UNION' | '' =>
  (c.combineType === 'union' ? c.unionColumns.length > 0 : !!c.baseTable && c.joins.length > 0) ? COMBINE_LABEL[c.combineType] : '';
export const hasUnionOrFull = (c: CombineHolder) => c.combineType === 'union' || c.joins.some(j => j.type === 'full');

// Diễn giải dạng câu lệnh (xem lại, chi tiết)
export const describeOn = (j: JoinStep) => j.conditions
  .map(x => `${columnLabel(null, x.left)} ${x.operator} ${x.rightKind === 'value' ? `'${x.value}'` : columnLabel(null, x.right)}`)
  .join(' AND ');
export const describeJoinStep = (j: JoinStep) => `${JOIN_TYPE_LABEL[j.type].toUpperCase()} ${operandLabel(j.table)}${j.conditions.length ? ` ON ${describeOn(j)}` : ''}`;
export const describeWhere = (c: CombineHolder) => c.filters
  .map(f => `${columnLabel(null, f.field)} ${FILTER_OPERATOR_LABEL[f.operator].toLowerCase()}${filterNeedsValue(f.operator) ? ` ${f.value}` : ''}`)
  .join(' AND ');
export const describeCombine = (c: CombineHolder) => {
  const where = describeWhere(c);
  const head = c.combineType === 'union'
    ? `${c.sources.map(s => operandLabel(s.datasetId)).join(` ${unionLabel(c.unionAll).toUpperCase()} `)} · ${c.unionColumns.length} cột ghép`
    : [operandLabel(c.baseTable), ...c.joins.map(describeJoinStep)].join(' ');
  return [head, where && `WHERE ${where}`].filter(Boolean).join(' · ');
};
export const describeMapping = (cfg: unknown, m?: ColumnMapping) => {
  if (!m) return '';
  if (m.mode === 'fixed') return m.value ? `“${m.value}”` : '';
  return m.columns.filter(Boolean).map(r => columnLabel(cfg, r)).join(' → ');
};
export const mappingFilled = (m?: ColumnMapping) => !!m && (m.mode === 'fixed' ? !!m.value.trim() : m.columns.some(Boolean));

// Nhóm kiểu dữ liệu để cảnh báo khi 2 vế điều kiện khác kiểu
export const typeFamily = (t: string) => {
  const u = t.toUpperCase();
  if (u.startsWith('NUMBER') || u.startsWith('INT') || u.startsWith('DECIMAL')) return 'số';
  if (u.startsWith('DATE') || u.startsWith('TIMESTAMP')) return 'ngày';
  return 'chuỗi';
};

// --- Quy tắc xử lý nguồn (nhóm và tên quy tắc giống màn Xử lý dữ liệu) ---
export const RULE_GROUP_LABEL: Record<RuleGroup, string> = { clean: 'Làm sạch', standardize: 'Chuẩn hóa', transform: 'Biến đổi' };
export const RULE_KINDS: { kind: SourceRuleKind; group: RuleGroup; title: string }[] = [
  { kind: 'format', group: 'clean', title: 'Kiểm tra quy tắc về chuẩn định dạng' },
  { kind: 'validity', group: 'clean', title: 'Kiểm tra tính hợp lệ của dữ liệu' },
  { kind: 'replace', group: 'clean', title: 'Xử lý, thay thế giá trị, thiếu dữ liệu' },
  { kind: 'dedup', group: 'standardize', title: 'Kiểm tra đối sánh tồn tại dựa trên trường khóa' },
  { kind: 'reference', group: 'standardize', title: 'Xử lý vi phạm về ràng buộc thuộc tính tham chiếu' },
  { kind: 'convert', group: 'transform', title: 'Biến đổi định dạng dữ liệu' },
];
export const ruleGroupOf = (kind: SourceRuleKind) => RULE_KINDS.find(k => k.kind === kind)?.group || 'clean';

// Ô nhập của từng loại quy tắc: 'field' = chọn trường của nguồn, 'select' = chọn từ danh sách, 'text' = nhập tay
export interface RuleInput {
  key: 'field' | 'operator' | 'value' | 'replaceWith' | 'action';
  label: string;
  type: 'field' | 'select' | 'text';
  options?: string[];
  enabled?: (r: SourceRule) => boolean;
}
const EXCEPTION_ACTIONS = ['Loại bỏ bản ghi lỗi', 'Đánh dấu cảnh báo', 'Gán giá trị rỗng (NULL)'];
export const RULE_INPUTS: Record<SourceRuleKind, RuleInput[]> = {
  format: [
    { key: 'field', label: 'Trường áp dụng', type: 'field' },
    { key: 'operator', label: 'Quy tắc định dạng', type: 'select', options: ['Đúng định dạng CCCD', 'Đúng định dạng Email', 'Đúng định dạng Số điện thoại', 'Đúng định dạng ngày dd/mm/yyyy'] },
    { key: 'action', label: 'Xử lý ngoại lệ', type: 'select', options: EXCEPTION_ACTIONS },
  ],
  validity: [
    { key: 'field', label: 'Trường áp dụng', type: 'field' },
    { key: 'operator', label: 'Điều kiện hợp lệ', type: 'select', options: ['Bằng (=)', 'Khác (!=)', 'Lớn hơn (>)', 'Nhỏ hơn (<)', 'Lớn hơn hoặc bằng (>=)', 'Nhỏ hơn hoặc bằng (<=)', 'Thuộc danh sách (IN)', 'Không thuộc danh sách (NOT IN)', 'Bao gồm (%s%)', 'Khớp biểu thức nâng cao (REGEX)'] },
    { key: 'value', label: 'Giá trị kiểm tra', type: 'text' },
    { key: 'action', label: 'Xử lý ngoại lệ', type: 'select', options: EXCEPTION_ACTIONS },
  ],
  replace: [
    { key: 'field', label: 'Trường áp dụng', type: 'field' },
    { key: 'operator', label: 'Chọn điều kiện', type: 'select', options: ['Rỗng (thiếu dữ liệu)', 'Bằng với', 'Bắt đầu bằng', 'Kết thúc bằng', 'Bao gồm'] },
    { key: 'value', label: 'Giá trị nguồn', type: 'text', enabled: r => r.operator !== 'Rỗng (thiếu dữ liệu)' },
    { key: 'replaceWith', label: 'Giá trị thay thế', type: 'text' },
  ],
  dedup: [
    { key: 'field', label: 'Trường làm khóa đối sánh', type: 'field' },
    { key: 'action', label: 'Xử lý ngoại lệ', type: 'select', options: ['Giữ bản ghi mới nhất', 'Giữ bản ghi cũ nhất', 'Từ chối toàn bộ các bản ghi trùng'] },
    { key: 'value', label: 'Cột căn cứ sắp xếp', type: 'select', options: ['Ngày tạo', 'Ngày cập nhật', 'Thời gian gửi'], enabled: r => r.action !== 'Từ chối toàn bộ các bản ghi trùng' },
  ],
  reference: [
    { key: 'field', label: 'Trường áp dụng', type: 'field' },
    { key: 'operator', label: 'Danh mục tham chiếu', type: 'select', options: ['Danh mục Giới tính', 'Danh mục Dân tộc', 'Danh mục Quốc tịch', 'Danh mục Tỉnh/Thành', 'Danh mục Phường/Xã'] },
    { key: 'action', label: 'Hành động', type: 'select', options: ['Từ chối bản ghi vi phạm', 'Gán giá trị rỗng (NULL)', 'Gán giá trị mặc định', 'Đánh dấu cảnh báo'] },
    { key: 'value', label: 'Giá trị mặc định', type: 'text', enabled: r => r.action === 'Gán giá trị mặc định' },
  ],
  convert: [
    { key: 'field', label: 'Trường áp dụng', type: 'field' },
    { key: 'operator', label: 'Kiểu dữ liệu', type: 'select', options: ['Chuỗi ký tự', 'Ngày tháng', 'Thời gian', 'Số nguyên', 'Số thập phân', 'Tiền tệ'] },
    { key: 'value', label: 'Thông tin chuyển đổi', type: 'select', options: ['dd/mm/yyyy', 'yyyy-mm-dd', 'VIẾT HOA', 'viết thường', 'Bỏ dấu tiếng Việt', 'Bỏ khoảng trắng thừa', '0,000'] },
  ],
};
export const inputEnabled = (i: RuleInput, r: SourceRule) => !i.enabled || i.enabled(r);
export const ruleIncomplete = (r: SourceRule) => RULE_INPUTS[r.kind].some(i => inputEnabled(i, r) && !String(r[i.key] || '').trim());
export const describeRule = (r: SourceRule) =>
  RULE_INPUTS[r.kind].filter(i => i.key !== 'field' && inputEnabled(i, r) && r[i.key]).map(i => `${i.label}: ${r[i.key]}`).join(' · ');
export const countRules = (rules?: SourceRule[]) => {
  const c: Record<RuleGroup, number> = { clean: 0, standardize: 0, transform: 0 };
  (rules || []).forEach(r => { c[ruleGroupOf(r.kind)]++; });
  return c;
};

// Khóa của bản ghi nguồn (căn cứ cập nhật): khóa chính của bộ dữ liệu, hoặc trường người dùng chỉ định
export const sourceKeyOf = (ref: MergeSourceRef) => (ref.keyFields?.length ? ref.keyFields : findDataset(ref.datasetId)?.keyFields || []);
// Cột kết quả có phải khóa nguồn không (dùng để cảnh báo khi chọn làm khóa chính bảng đích);
// cột gộp của Union là khóa nguồn khi mọi nguồn đều lấy từ trường khóa của nguồn đó
export const isSourceKeyColumn = (cfg: CombineHolder, ref: ColumnRef) => {
  const { operand, field } = splitRef(ref);
  if (operand === UNION_OPERAND) {
    const u = cfg.unionColumns.find(x => x.name === field);
    return !!u && cfg.sources.every(s => !!u.refs[s.datasetId] && sourceKeyOf(s).includes(u.refs[s.datasetId]));
  }
  const src = cfg.sources.find(s => s.datasetId === operand);
  return !!src && sourceKeyOf(src).includes(field);
};

// Dữ liệu bảng đích mẫu (lần chạy gần nhất) – minh họa cách lưu vết để cập nhật khi nguồn thay đổi
export interface MergeSampleData {
  note: string;
  columns: string[];
  rows: Record<string, string>[];
  unmatched?: { source: string; key: string; reason: string }[];
}
export const MERGE_SAMPLE_DATA: Record<string, MergeSampleData> = {
  'mc-2': {
    note: 'Bảng chính Công dân, LEFT JOIN Khai sinh và LEFT JOIN BHXH (đang hoạt động) theo CCCD. ID bảng đích lấy theo cột Công dân.ID_CD; HO_TEN lấy theo độ ưu tiên Công dân → BHXH → Khai sinh.',
    columns: ['ID', 'CCCD', 'HO_TEN', 'DIA_CHI', 'MA_SO_BHXH', 'NOI_KCB', 'NOI_SINH', 'DIP_RefId', 'DIP_SourceRefs'],
    rows: [
      { ID: '15', CCCD: '001090000123', HO_TEN: 'Nguyễn Văn An', DIA_CHI: 'Hà Nội', MA_SO_BHXH: '0123456789', NOI_KCB: 'BV Bạch Mai', NOI_SINH: 'BV Phụ sản Hà Nội', DIP_RefId: 'Công dân:15', DIP_SourceRefs: 'BHXH:HS-802 · Khai sinh:KS-3310' },
      { ID: '16', CCCD: '046185000456', HO_TEN: 'Trần Thị Bình', DIA_CHI: 'Huế', MA_SO_BHXH: '', NOI_KCB: '', NOI_SINH: 'BV Trung ương Huế', DIP_RefId: 'Công dân:16', DIP_SourceRefs: 'BHXH:– · Khai sinh:KS-3311' },
      { ID: '17', CCCD: '079200000789', HO_TEN: 'Lê Minh Châu', DIA_CHI: 'TP.HCM', MA_SO_BHXH: '7912345678', NOI_KCB: 'BV Nhân dân 115', NOI_SINH: '', DIP_RefId: 'Công dân:17', DIP_SourceRefs: 'BHXH:HS-804 · Khai sinh:–' },
      { ID: '18', CCCD: '038195000321', HO_TEN: 'Phạm Quốc Dũng', DIA_CHI: 'Thanh Hóa', MA_SO_BHXH: '', NOI_KCB: '', NOI_SINH: 'TTYT Thanh Hóa', DIP_RefId: 'Công dân:18', DIP_SourceRefs: 'BHXH:– · Khai sinh:KS-3312' },
    ],
    unmatched: [
      { source: 'Người tham gia BHXH', key: 'HS-805', reason: 'CCCD 099999000111 không có trong Công dân' },
      { source: 'Người tham gia BHXH', key: 'HS-803', reason: 'Trùng CCCD với HS-804 – lấy bản cập nhật mới nhất (HS-804)' },
      { source: 'Công dân', key: '21', reason: 'Thiếu giá trị bắt buộc: HO_TEN trống ở mọi cột ưu tiên – không ghi vào đích' },
    ],
  },
};
