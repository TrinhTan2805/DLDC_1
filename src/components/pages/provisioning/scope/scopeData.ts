// Phạm vi dữ liệu (Data scope) cho API cung cấp — dữ liệu mẫu + store dùng chung (log 261)
// Nguồn nghiệp vụ: HANDOFF_Code_PhamViDuLieu_API.md (BR01–BR09).
// Dùng chung giữa: tab "Danh mục chiều phạm vi" + "Danh sách tài khoản" + "Phân quyền truy cập"
// (DataProvisionApiManagementPage) và tab "Thiết kế cấu trúc gói tin" (ProvisionServiceModal).
import { useSyncExternalStore } from 'react';

export type ScopeValueMode = 'DM' | 'TN'; // DM: lấy từ danh mục · TN: tự nhập
export type ScopeSourceType = 'CSDL đích' | 'Danh mục dùng chung' | 'Dữ liệu chủ';

export interface ScopeDimension {
  code: string;            // BR01: A–Z, 0–9, _, ≤ 30 ký tự, duy nhất, không đổi sau khi tạo
  name: string;
  mode: ScopeValueMode;
  sourceType?: ScopeSourceType;
  sourceDb?: string;       // chỉ khi sourceType = 'CSDL đích'
  sourceTable?: string;
  sourceColumn?: string;
  /** Trường hiển thị (≤ 3 cột cùng bảng) giúp người chọn nhận biết giá trị, VD ma_tinh → ten_tinh (log 262) */
  displayColumns?: string[];
  status: 'Hoạt động' | 'Ngừng hoạt động';
}

/** Trường phân vùng của 1 dịch vụ API (BR07): chiều → cột dữ liệu */
export interface ScopeField {
  dimension: string;
  table: string;
  column: string;
}

/** Giá trị phạm vi của 1 tài khoản API: mã chiều → danh sách giá trị */
export type AccountScopeValues = Record<string, string[]>;

export const SCOPE_SOURCE_TYPES: ScopeSourceType[] = ['CSDL đích', 'Danh mục dùng chung', 'Dữ liệu chủ'];

// Dữ liệu mẫu theo bảng nguồn (giả lập — thực tế lấy từ metadata đã đăng ký + SELECT DISTINCT)
// Cột của bảng = khóa của dòng đầu tiên.
type Row = Record<string, string>;
const T = (cols: string[], rows: string[][]): Row[] => rows.map((r) => Object.fromEntries(cols.map((c, i) => [c, r[i] ?? ''])));
const ROWS: Record<string, Row[]> = {
  // Danh mục dùng chung
  dm_tinh_thanh: T(['ma_tinh', 'ten_tinh', 'cap_hanh_chinh'], [
    ['27', 'Bắc Ninh', 'Tỉnh'], ['01', 'Hà Nội', 'Thành phố trực thuộc TW'], ['79', 'TP. Hồ Chí Minh', 'Thành phố trực thuộc TW'],
    ['31', 'Hải Phòng', 'Thành phố trực thuộc TW'], ['48', 'Đà Nẵng', 'Thành phố trực thuộc TW'], ['92', 'Cần Thơ', 'Thành phố trực thuộc TW']]),
  dm_xa_phuong: T(['ma_xa', 'ten_xa', 'ma_tinh', 'ten_tinh'], [
    ['09202', 'Phường Kinh Bắc', '27', 'Bắc Ninh'], ['09217', 'Phường Võ Cường', '27', 'Bắc Ninh'],
    ['00004', 'Phường Ba Đình', '01', 'Hà Nội'], ['26734', 'Phường Sài Gòn', '79', 'TP. Hồ Chí Minh']]),
  dm_linh_vuc: T(['ma_linh_vuc', 'ten_linh_vuc'], [['HT', 'Hộ tịch'], ['CT', 'Chứng thực'], ['TGPL', 'Trợ giúp pháp lý'], ['LLTP', 'Lý lịch tư pháp']]),
  // Dữ liệu chủ
  dlc_co_quan_don_vi: T(['ma_dinh_danh', 'ten_co_quan', 'ma_tinh', 'ten_tinh'], [
    ['27.STP', 'Sở Tư pháp tỉnh Bắc Ninh', '27', 'Bắc Ninh'], ['27.CA', 'Công an tỉnh Bắc Ninh', '27', 'Bắc Ninh'],
    ['27.SYT', 'Sở Y tế tỉnh Bắc Ninh', '27', 'Bắc Ninh'], ['27.STC', 'Sở Tài chính tỉnh Bắc Ninh', '27', 'Bắc Ninh'],
    ['01.STP', 'Sở Tư pháp Hà Nội', '01', 'Hà Nội'], ['79.STP', 'Sở Tư pháp TP. Hồ Chí Minh', '79', 'TP. Hồ Chí Minh']]),
  dlc_to_chuc_hanh_nghe: T(['ma_to_chuc', 'ten_to_chuc', 'loai_hinh'], [
    ['TC001', 'Văn phòng công chứng Kinh Bắc', 'Công chứng'], ['TC002', 'Công ty Luật Sen Vàng', 'Luật sư'], ['TC003', 'Trung tâm TGPL tỉnh Bắc Ninh', 'Trợ giúp pháp lý']]),
  // CSDL đích (bảng nghiệp vụ: thường chỉ có mã, không có tên)
  ho_tich_ca_nhan: T(['ma_tinh', 'ma_don_vi_dk', 'so_dinh_danh'], [['27', '27.STP', '027090001234'], ['01', '01.STP', '001090004321'], ['79', '79.STP', '079090005678']]),
  ho_tich_ket_hon: T(['ma_tinh', 'ma_xa', 'so_dang_ky'], [['27', '09202', 'KH-27-0001'], ['01', '00004', 'KH-01-0002']]),
  co_quan_chung_thuc: T(['ma_co_quan', 'ten_co_quan', 'ma_tinh'], [['CT27.01', 'Phòng Tư pháp TP. Bắc Ninh', '27'], ['CT01.01', 'Phòng Tư pháp quận Ba Đình', '01']]),
  co_quan_tha: T(['ma_co_quan_tha', 'ten_co_quan_tha', 'ma_tinh'], [['THA27', 'Cục THADS tỉnh Bắc Ninh', '27'], ['THA01', 'Cục THADS TP. Hà Nội', '01']]),
};
const colsOfTable = (t: string) => Object.keys(ROWS[t]?.[0] || {});
const tablesMeta = (names: string[]) => Object.fromEntries(names.map((t) => [t, colsOfTable(t)]));

// Metadata nguồn — CSDL đích có thêm 1 cấp: CSDL → Bảng → Trường
export const SCOPE_TARGET_DBS: Record<string, Record<string, string[]>> = {
  'Kho Hộ tịch (kho_hotich)': tablesMeta(['ho_tich_ca_nhan', 'ho_tich_ket_hon']),
  'Kho Chứng thực (kho_chungthuc)': tablesMeta(['co_quan_chung_thuc']),
  'Kho Thi hành án (kho_tha)': tablesMeta(['co_quan_tha']),
};
export const SCOPE_CATALOGS: Record<'Danh mục dùng chung' | 'Dữ liệu chủ', Record<string, string[]>> = {
  'Danh mục dùng chung': tablesMeta(['dm_tinh_thanh', 'dm_xa_phuong', 'dm_linh_vuc']),
  'Dữ liệu chủ': tablesMeta(['dlc_co_quan_don_vi', 'dlc_to_chuc_hanh_nghe']),
};

export const scopeTablesOf = (d: Partial<ScopeDimension>): string[] => {
  if (!d.sourceType) return [];
  if (d.sourceType === 'CSDL đích') return d.sourceDb ? Object.keys(SCOPE_TARGET_DBS[d.sourceDb] || {}) : [];
  return Object.keys(SCOPE_CATALOGS[d.sourceType] || {});
};
export const scopeColumnsOf = (d: Partial<ScopeDimension>): string[] => {
  if (!d.sourceType || !d.sourceTable) return [];
  const tables = d.sourceType === 'CSDL đích' ? SCOPE_TARGET_DBS[d.sourceDb || ''] || {} : SCOPE_CATALOGS[d.sourceType] || {};
  return tables[d.sourceTable] || [];
};
export const MAX_DISPLAY_COLUMNS = 3;

export interface ScopeValueOption {
  value: string;
  /** Giá trị trường hiển thị đầu tiên (hoặc chính mã nếu không khai trường hiển thị) */
  label: string;
  /** Giá trị các trường hiển thị, theo thứ tự displayColumns */
  extra: string[];
}
/**
 * Giá trị để chọn ở form tài khoản (chỉ chiều "Lấy từ danh mục").
 * Thực tế: SELECT DISTINCT <giá trị>, <hiển thị…> FROM <bảng> WHERE … LIKE ? FETCH FIRST n
 * (tên bảng/cột đối chiếu whitelist metadata, giá trị tìm kiếm bind parameter).
 */
export const scopeValueOptions = (d?: ScopeDimension): ScopeValueOption[] => {
  if (!d || d.mode !== 'DM' || !d.sourceTable || !d.sourceColumn) return [];
  const disp = (d.displayColumns || []).filter((c) => c !== d.sourceColumn);
  const seen = new Set<string>();
  const out: ScopeValueOption[] = [];
  (ROWS[d.sourceTable] || []).forEach((r) => {
    const value = r[d.sourceColumn!];
    if (!value || seen.has(value)) return;
    seen.add(value);
    const extra = disp.map((c) => r[c] ?? '');
    out.push({ value, label: extra[0] || value, extra });
  });
  return out;
};
/** Nhãn ngắn của 1 giá trị: "01 – Hà Nội" (có trường hiển thị) hoặc "01" */
export const scopeValueText = (d: ScopeDimension | undefined, v: string) => {
  const o = scopeValueOptions(d).find((x) => x.value === v);
  return o && o.extra[0] ? `${v} – ${o.extra[0]}` : v;
};
/** Chỉ phần tên (dùng ở badge tóm tắt): "Hà Nội", không có thì trả mã */
export const scopeValueLabel = (d: ScopeDimension | undefined, v: string) =>
  scopeValueOptions(d).find((o) => o.value === v)?.label ?? v;

// ---------------- Store (localStorage, giống các bảng khác của module) ----------------
const DIM_KEY = 'provision_scope_dimensions';
const FIELD_KEY = 'provision_scope_fields';

const DEFAULT_DIMS: ScopeDimension[] = [
  { code: 'TINH', name: 'Tỉnh/Thành phố', mode: 'DM', sourceType: 'Danh mục dùng chung', sourceTable: 'dm_tinh_thanh', sourceColumn: 'ma_tinh', displayColumns: ['ten_tinh', 'cap_hanh_chinh'], status: 'Hoạt động' },
  { code: 'XA', name: 'Xã/Phường', mode: 'DM', sourceType: 'Danh mục dùng chung', sourceTable: 'dm_xa_phuong', sourceColumn: 'ma_xa', displayColumns: ['ten_xa', 'ten_tinh'], status: 'Hoạt động' },
  { code: 'DON_VI', name: 'Đơn vị/Cơ quan', mode: 'DM', sourceType: 'Dữ liệu chủ', sourceTable: 'dlc_co_quan_don_vi', sourceColumn: 'ma_dinh_danh', displayColumns: ['ten_co_quan', 'ten_tinh'], status: 'Hoạt động' },
  { code: 'SO_HD', name: 'Số hợp đồng chia sẻ', mode: 'TN', status: 'Hoạt động' },
  { code: 'LINH_VUC', name: 'Lĩnh vực', mode: 'DM', sourceType: 'Danh mục dùng chung', sourceTable: 'dm_linh_vuc', sourceColumn: 'ma_linh_vuc', displayColumns: ['ten_linh_vuc'], status: 'Ngừng hoạt động' },
];
/** Trường phân vùng theo mã dịch vụ (khớp `code` ở Thiết lập điều phối và Quản lý API) */
export interface ServiceScopeConfig { serviceName: string; fields: ScopeField[] }
const DEFAULT_FIELDS: Record<string, ServiceScopeConfig> = {
  'SVC-HOTICH-001': { serviceName: 'API cung cấp dữ liệu Hộ tịch điện tử', fields: [{ dimension: 'TINH', table: 'ho_tich_ca_nhan', column: 'ma_tinh' }] },
};
/** Giá trị phạm vi mẫu cho các tài khoản mặc định (chỉ dùng khi tài khoản chưa có scopeValues) */
export const DEFAULT_ACCOUNT_SCOPES: Record<string, AccountScopeValues> = {
  acc1: { TINH: ['27'], DON_VI: ['27.SYT'] },
  acc2: { TINH: ['27'], DON_VI: ['27.CA'] },
};

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch { /* bỏ qua dữ liệu hỏng */ }
  return fallback;
};

// Dữ liệu đã lưu trước log 262 chưa có displayColumns → bổ sung theo mẫu mặc định cùng nguồn
let dims: ScopeDimension[] = read(DIM_KEY, DEFAULT_DIMS).map((d) => {
  if (d.displayColumns) return d;
  const def = DEFAULT_DIMS.find((x) => x.sourceTable === d.sourceTable && x.sourceColumn === d.sourceColumn);
  return def?.displayColumns ? { ...d, displayColumns: def.displayColumns } : d;
});
let fieldMap: Record<string, ServiceScopeConfig> = read(FIELD_KEY, DEFAULT_FIELDS);
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };

export const setScopeDimensions = (next: ScopeDimension[]) => {
  dims = next;
  localStorage.setItem(DIM_KEY, JSON.stringify(dims));
  emit();
};
export const setServiceScopeFields = (serviceCode: string, serviceName: string, fields: ScopeField[]) => {
  fieldMap = { ...fieldMap, [serviceCode]: { serviceName, fields } };
  localStorage.setItem(FIELD_KEY, JSON.stringify(fieldMap));
  emit();
};

export const getServiceScopeMap = () => fieldMap;
export const useScopeDimensions = () => useSyncExternalStore(subscribe, () => dims);
export const useServiceScopeMap = () => useSyncExternalStore(subscribe, () => fieldMap);

/** Tên các API đang dùng chiều làm trường phân vùng (BR03) */
export const servicesUsingDimension = (map: Record<string, ServiceScopeConfig>, code: string) =>
  Object.values(map).filter((s) => s.fields.some((f) => f.dimension === code)).map((s) => s.serviceName);

/** Trường phân vùng của 1 API, tra theo mã hoặc tên dịch vụ */
export const scopeFieldsOf = (map: Record<string, ServiceScopeConfig>, code?: string, name?: string): ScopeField[] =>
  (code && map[code]?.fields) || Object.values(map).find((s) => s.serviceName === name)?.fields || [];

/**
 * Chiều hiển thị ở form tài khoản (BR04): chiều đang hoạt động + chiều đã ngừng nhưng còn API dùng
 * (để cán bộ vẫn sửa được giá trị, tránh tài khoản bị 403 mà không có chỗ khai).
 */
export const dimensionsForAccount = (all: ScopeDimension[], map: Record<string, ServiceScopeConfig>) =>
  all.filter((d) => d.status === 'Hoạt động' || servicesUsingDimension(map, d.code).length > 0);

export const SCOPE_CODE_RE = /^[A-Z0-9_]{1,30}$/;
