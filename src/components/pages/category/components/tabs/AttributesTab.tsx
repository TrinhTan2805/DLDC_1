import React, { ChangeEvent, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Plus, Search, Filter, X, ChevronDown, SquarePen, Trash2, Send,
  FileText, CheckSquare, Tag, Database, Globe, Lock,
  AlertCircle, Check, ArrowRight
} from 'lucide-react';
import { MasterDataEntity, MasterDataAttribute, FieldDataType } from '../../categoryTypes';
import { BaseModal } from '../../../../common/BaseModal';
import { mockAttributesByEntity, approvers } from '../../categoryConstants';
import { ApprovalRequestModal } from '../modals/ApprovalRequestModal';
import {
  Badge, TruncatedText, RowIconAction, Pagination, BTN_PRIMARY, BTN_OUTLINE, INPUT_CLS, LABEL_CLS, REQUIRED_MARK,
  FIELD_LABEL, FIELD_VALUE, SEARCH_INPUT_CLS, SEARCH_BTN_CLS, normalizeSearch,
} from '../../../collection/collectionUi';

// Lớp dùng chung theo quy chuẩn (compomennt.md 5.2, 5.3)
const SELECT_CLS = `${INPUT_CLS} pr-8 appearance-none cursor-pointer`;
const TABLE_CLS = 'w-full border-collapse collection-table text-[13px]';
const TH_CLS = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px] text-left';
const TR_CLS = 'h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors';
const TD_CLS = 'px-3 py-1 text-[13px] text-black';
const EMPTY_TD_CLS = 'px-3 py-16 text-center text-[13px] text-[#64748B]';
const CARD_HEADER_CLS = 'px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center';
const CARD_TITLE_CLS = 'text-[14px] font-medium text-[#020817]';
const SECTION_CARD_CLS = 'border border-[#E2E8F0] rounded-2xl bg-white overflow-hidden';
const DASH = <span className="text-[#64748B]">--</span>;

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

const EMPTY_INLINE_FORM: Partial<MasterDataAttribute> = {
  fieldName: '', displayName: '', dataType: 'string',
  length: undefined, required: false, unique: false, indexed: false,
  defaultValue: '', validationRules: '', description: '',
};

// ── DLDC mock data ──────────────────────────────────────────────
const DLDC_DATABASES = [
  { id: 'hotich',  label: 'Hộ tịch' },
  { id: 'cccd',    label: 'Căn cước công dân' },
  { id: 'dkkd',    label: 'Đăng ký kinh doanh' },
  { id: 'lltp',    label: 'Lý lịch tư pháp' },
  { id: 'btdp',    label: 'Bổ trợ tư pháp' },
];

const DLDC_TABLES: Record<string, { id: string; displayName: string }[]> = {
  hotich: [
    { id: 'tbl_khaisinh', displayName: 'Khai sinh' },
    { id: 'tbl_kethon',   displayName: 'Kết hôn' },
    { id: 'tbl_ly_hon',   displayName: 'Ly hôn' },
    { id: 'tbl_khai_tu',  displayName: 'Khai tử' },
    { id: 'tbl_gioi_tinh', displayName: 'Danh mục giới tính' },
  ],
  cccd: [
    { id: 'tbl_can_cuoc', displayName: 'Căn cước công dân' },
    { id: 'tbl_cu_tru',   displayName: 'Cư trú' },
  ],
  dkkd: [
    { id: 'tbl_doanhnghiep',    displayName: 'Doanh nghiệp' },
    { id: 'tbl_ho_kinh_doanh',  displayName: 'Hộ kinh doanh' },
    { id: 'tbl_giay_phep',      displayName: 'Giấy phép kinh doanh' },
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
  tbl_gioi_tinh: [
    { fieldName: 'ma_gioi_tinh', displayName: 'Mã giới tính', dataType: 'string' },
    { fieldName: 'ten_gioi_tinh', displayName: 'Tên giới tính', dataType: 'string' },
    { fieldName: 'ghi_chu', displayName: 'Ghi chú', dataType: 'string' },
  ],
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
    { fieldName: 'ma_dang_ky',      displayName: 'Mã đăng ký',     dataType: 'string' },
    { fieldName: 'ten_chong',        displayName: 'Tên chồng',       dataType: 'string' },
    { fieldName: 'cccd_chong',       displayName: 'CCCD chồng',      dataType: 'string' },
    { fieldName: 'ten_vo',           displayName: 'Tên vợ',          dataType: 'string' },
    { fieldName: 'cccd_vo',          displayName: 'CCCD vợ',         dataType: 'string' },
    { fieldName: 'ngay_dang_ky',     displayName: 'Ngày đăng ký',    dataType: 'date'   },
    { fieldName: 'co_quan_dang_ky',  displayName: 'Cơ quan đăng ký', dataType: 'string' },
  ],
  tbl_ly_hon: [
    { fieldName: 'ma_ban_an',  displayName: 'Mã bản án',  dataType: 'string' },
    { fieldName: 'ten_chong',  displayName: 'Tên chồng',  dataType: 'string' },
    { fieldName: 'ten_vo',     displayName: 'Tên vợ',     dataType: 'string' },
    { fieldName: 'ngay_ly_hon',displayName: 'Ngày ly hôn',dataType: 'date'   },
    { fieldName: 'toa_an',     displayName: 'Tòa án',     dataType: 'string' },
  ],
  tbl_khai_tu: [
    { fieldName: 'ma_khai_tu', displayName: 'Mã khai tử',   dataType: 'string' },
    { fieldName: 'ho_ten',     displayName: 'Họ và tên',     dataType: 'string' },
    { fieldName: 'ngay_mat',   displayName: 'Ngày mất',      dataType: 'date'   },
    { fieldName: 'noi_mat',    displayName: 'Nơi mất',       dataType: 'string' },
    { fieldName: 'nguyen_nhan',displayName: 'Nguyên nhân',   dataType: 'string' },
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
    { fieldName: 'so_cccd',      displayName: 'Số CCCD',          dataType: 'string' },
    { fieldName: 'ho_ten',       displayName: 'Họ và tên',        dataType: 'string' },
    { fieldName: 'dia_chi_thuong_tru', displayName: 'Địa chỉ thường trú', dataType: 'string' },
    { fieldName: 'dia_chi_tam_tru',    displayName: 'Địa chỉ tạm trú',   dataType: 'string' },
    { fieldName: 'ngay_dang_ky', displayName: 'Ngày đăng ký',    dataType: 'date'   },
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
    { fieldName: 'ma_dang_ky',   displayName: 'Mã đăng ký',     dataType: 'string' },
    { fieldName: 'ten_ho_kd',    displayName: 'Tên hộ KD',      dataType: 'string' },
    { fieldName: 'chu_ho',       displayName: 'Chủ hộ',         dataType: 'string' },
    { fieldName: 'dia_chi',      displayName: 'Địa chỉ',        dataType: 'string' },
    { fieldName: 'nganh_nghe',   displayName: 'Ngành nghề',     dataType: 'string' },
    { fieldName: 'ngay_cap',     displayName: 'Ngày cấp',       dataType: 'date'   },
  ],
  tbl_cong_chung: [
    { fieldName: 'ma_giao_dich',        displayName: 'Mã giao dịch',         dataType: 'string' },
    { fieldName: 'loai_hop_dong',        displayName: 'Loại hợp đồng',        dataType: 'string' },
    { fieldName: 'to_chuc_cong_chung',   displayName: 'Tổ chức công chứng',   dataType: 'string' },
    { fieldName: 'ngay_cong_chung',      displayName: 'Ngày công chứng',      dataType: 'date'   },
    { fieldName: 'ben_a',                displayName: 'Bên A',                 dataType: 'string' },
    { fieldName: 'ben_b',                displayName: 'Bên B',                 dataType: 'string' },
  ],
  tbl_luat_su: [
    { fieldName: 'so_the',       displayName: 'Số thẻ LS',      dataType: 'string' },
    { fieldName: 'ho_ten',       displayName: 'Họ và tên',      dataType: 'string' },
    { fieldName: 'doan_luat_su', displayName: 'Đoàn luật sư',   dataType: 'string' },
    { fieldName: 'ngay_cap',     displayName: 'Ngày cấp thẻ',   dataType: 'date'   },
    { fieldName: 'trang_thai',   displayName: 'Trạng thái',     dataType: 'string' },
  ],
  tbl_ly_lich_tu_phap: [
    { fieldName: 'so_phieu',   displayName: 'Số phiếu LLTP',  dataType: 'string' },
    { fieldName: 'ho_ten',     displayName: 'Họ và tên',      dataType: 'string' },
    { fieldName: 'ngay_sinh',  displayName: 'Ngày sinh',      dataType: 'date'   },
    { fieldName: 'so_cccd',    displayName: 'Số CCCD',        dataType: 'string' },
    { fieldName: 'ket_qua',    displayName: 'Kết quả',        dataType: 'string' },
    { fieldName: 'ngay_cap',   displayName: 'Ngày cấp',       dataType: 'date'   },
  ],
  tbl_an_tich: [
    { fieldName: 'ma_an_tich', displayName: 'Mã án tích',    dataType: 'string' },
    { fieldName: 'ho_ten',     displayName: 'Họ và tên',     dataType: 'string' },
    { fieldName: 'toi_danh',   displayName: 'Tội danh',      dataType: 'string' },
    { fieldName: 'hinh_phat',  displayName: 'Hình phạt',     dataType: 'string' },
    { fieldName: 'ngay_phat',  displayName: 'Ngày phán xét', dataType: 'date'   },
  ],
  tbl_tro_giup: [
    { fieldName: 'ma_ho_so',       displayName: 'Mã hồ sơ',          dataType: 'string' },
    { fieldName: 'ho_ten',         displayName: 'Họ và tên',          dataType: 'string' },
    { fieldName: 'loai_ho_tro',    displayName: 'Loại hỗ trợ',        dataType: 'string' },
    { fieldName: 'ngay_tiep_nhan', displayName: 'Ngày tiếp nhận',     dataType: 'date'   },
    { fieldName: 'trang_thai',     displayName: 'Trạng thái',         dataType: 'string' },
  ],
  tbl_giay_phep: [
    { fieldName: 'so_giay_phep',   displayName: 'Số giấy phép',  dataType: 'string' },
    { fieldName: 'ten_co_so',      displayName: 'Tên cơ sở',     dataType: 'string' },
    { fieldName: 'loai_giay_phep', displayName: 'Loại giấy phép',dataType: 'string' },
    { fieldName: 'ngay_cap',       displayName: 'Ngày cấp',      dataType: 'date'   },
    { fieldName: 'ngay_het_han',   displayName: 'Ngày hết hạn',  dataType: 'date'   },
    { fieldName: 'co_quan_cap',    displayName: 'Cơ quan cấp',   dataType: 'string' },
  ],
};

// Helper to get database id from table id
function getDatabaseForTable(tableId: string): string {
  for (const [dbId, tables] of Object.entries(DLDC_TABLES)) {
    if (tables.some(t => t.id === tableId)) return dbId;
  }
  return '';
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
  /** Tên cột đích của trường trong danh mục (mặc định = columnName) */
  targetColumn: string;
  apiFieldName: string;
  dataType: FieldDataType;
  masked: boolean;
}

interface AttributesTabProps {
  entities: MasterDataEntity[];
  attributes: MasterDataAttribute[];
  selectedEntityId: string;
  setSelectedEntityId: (id: string) => void;
  wizardMode?: boolean;
  wizardEntityId?: string | null;
  selectedAttributes: string[];
  onSelectAttribute: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onAddAttribute: () => void;
  onAddAttributeInline?: (data: Partial<MasterDataAttribute>) => void;
  onEditAttribute: (attr: MasterDataAttribute) => void;
  onDeleteAttribute: (id: string) => void;
  getDataTypeLabel: (type: FieldDataType) => string;
  onSave?: () => void;
  onSaveAndSubmit?: () => void;
  onCancel?: () => void;
  onSubmitAttribute?: (id: string) => void;
  onApproveAttribute?: (id: string) => void;
  onRejectAttribute?: (id: string) => void;
  isViewOnly?: boolean;
  /** Chỉ xem cấu trúc trong trang Thiết lập danh mục: ẩn nút "Thêm trường dữ liệu" và cột "Thao tác" ở FULL PAGE MODE */
  readOnlyStructure?: boolean;
  requests?: any[];
  // wizard data source config
  wizardConfig?: {
    dataSource?: string;
    dldcTable?: string;
    dldcColumns?: string[];
    apiEndpoint?: string;
    apiMethod?: string;
    apiSystem?: string;
    apiManagingUnit?: string;
    apiAuthType?: 'none' | 'bearer' | 'apikey';
    apiBearerToken?: string;
    apiKeyName?: string;
    apiKeyValue?: string;
    apiParams?: { key: string; value: string }[];
    apiHeaders?: { key: string; value: string }[];
    apiBody?: string;
  };
  onWizardConfigChange?: (update: {
    dldcTable?: string;
    dldcColumns?: string[];
    apiEndpoint?: string;
    apiMethod?: string;
    apiSystem?: string;
    apiManagingUnit?: string;
    apiAuthType?: 'none' | 'bearer' | 'apikey';
    apiBearerToken?: string;
    apiKeyName?: string;
    apiKeyValue?: string;
    apiParams?: { key: string; value: string }[];
    apiHeaders?: { key: string; value: string }[];
    apiBody?: string;
  }) => void;
}

export function AttributesTab({
  entities,
  attributes,
  requests,
  selectedEntityId,
  setSelectedEntityId,
  wizardMode = false,
  wizardEntityId,
  selectedAttributes,
  onSelectAttribute,
  onSelectAll,
  onAddAttribute,
  onAddAttributeInline,
  onEditAttribute,
  onDeleteAttribute,
  getDataTypeLabel,
  onSave: _onSave,
  onSaveAndSubmit,
  onCancel: _onCancel,
  onSubmitAttribute = () => {},
  onApproveAttribute: _onApproveAttribute = () => {},
  onRejectAttribute: _onRejectAttribute = () => {},
  isViewOnly = false,
  readOnlyStructure = false,
  wizardConfig,
  onWizardConfigChange,
}: AttributesTabProps) {
  // Ẩn các hành động thêm/sửa/xóa ở FULL PAGE MODE khi chỉ xem cấu trúc (dùng trong trang Thiết lập danh mục)
  const hideStructureActions = isViewOnly || readOnlyStructure;
  const currentEntityId = wizardMode ? wizardEntityId : selectedEntityId;
  const currentEntity = entities.find(e => e.id === currentEntityId);
  const entityDataSource = currentEntity?.dataSource || wizardConfig?.dataSource || 'manual';

  const getColSpan = () => {
    let baseCols = 1; // STT
    if (entityDataSource === 'dldc') {
      baseCols += 6; // Tên CSDL, Nguồn dữ liệu, Trường gốc, Tên hiển thị, Kiểu dữ liệu, PK
    } else {
      baseCols += 7; // fieldName, displayName, dataType, length, keyType, required, defaultValue
    }
    if (!hideStructureActions) baseCols += 1; // actions
    return baseCols;
  };

  const getDataSourceLabel = (src?: string) => {
    switch (src) {
      case 'dldc':
        return 'Đồng bộ Kho DLDC';
      case 'manual':
      default:
        return 'Tự cập nhật trực tiếp';
    }
  };

  // Inline form state (manual wizardMode)
  const [inlineForm, setInlineForm] = useState<Partial<MasterDataAttribute>>(EMPTY_INLINE_FORM);
  const [inlineErrors, setInlineErrors] = useState<{ fieldName?: string; displayName?: string }>({});

  // DLDC wizard state
  const [dldcDatabase, setDldcDatabase] = useState<string>(
    () => getDatabaseForTable(wizardConfig?.dldcTable || '')
  );

  // Fallback: khi xem chi tiết, wizardConfig.dldcTable có thể chưa có sẵn — suy ra từ trường đã lưu
  const primaryDldcTableId = wizardConfig?.dldcTable || attributes.find(a => a.sourceTable)?.sourceTable || '';
  const primaryDldcDbId = dldcDatabase || getDatabaseForTable(primaryDldcTableId);
  const joinedDldcTableIds = Array.from(new Set(
    attributes.map(a => a.sourceTable).filter((t): t is string => !!t && t !== primaryDldcTableId)
  ));
  const [useJoin, setUseJoin] = useState(false);
  const [dldcJoins, setDldcJoins] = useState<DldcJoin[]>([]);
  const [dldcFieldRows, setDldcFieldRows] = useState<DldcFieldRow[]>(() => {
    const tableId = wizardConfig?.dldcTable || '';
    if (!tableId) return [];
    return (DLDC_FIELDS[tableId] || []).map((f, i) => ({
      id: `fr-init-${i}`, shared: true, isPK: i === 0,
      tableId, sourceJoinId: null,
      columnName: f.fieldName, targetColumn: f.fieldName, apiFieldName: f.fieldName,
      dataType: f.dataType, masked: false,
    }));
  });

  // API wizard state — khởi tạo từ wizardConfig để persist khi đổi tab
  const [apiAuthType, setApiAuthType] = useState<'none' | 'bearer' | 'apikey'>(
    () => wizardConfig?.apiAuthType || 'none'
  );
  const [apiBearerToken, setApiBearerToken] = useState(() => wizardConfig?.apiBearerToken || '');
  const [apiKeyName, setApiKeyName] = useState(() => wizardConfig?.apiKeyName || '');
  const [apiKeyValue, setApiKeyValue] = useState(() => wizardConfig?.apiKeyValue || '');
  const [apiParams, setApiParams] = useState<{ key: string; value: string }[]>(
    () => wizardConfig?.apiParams?.length ? wizardConfig.apiParams : [{ key: '', value: '' }]
  );
  const [apiHeaders, setApiHeaders] = useState<{ key: string; value: string }[]>(
    () => wizardConfig?.apiHeaders?.length ? wizardConfig.apiHeaders : [{ key: '', value: '' }]
  );
  const [apiBody, setApiBody] = useState(() => wizardConfig?.apiBody || '');
  const [apiSaved, setApiSaved] = useState(false);
  const [apiEndpointError, setApiEndpointError] = useState(false);

  const handleApiSave = () => {
    const endpoint = (wizardConfig?.apiEndpoint || '').trim();
    if (!endpoint) {
      setApiEndpointError(true);
      return;
    }
    setApiEndpointError(false);
    onWizardConfigChange?.({
      ...wizardConfig,
      apiAuthType,
      apiBearerToken,
      apiKeyName,
      apiKeyValue,
      apiParams: apiParams.filter(r => r.key.trim()),
      apiHeaders: apiHeaders.filter(r => r.key.trim()),
      apiBody,
    });
    setApiSaved(true);
    setTimeout(() => setApiSaved(false), 2000);
  };

  const dataSource = wizardConfig?.dataSource || 'manual';

  const handleDldcDatabaseChange = (dbId: string) => {
    setDldcDatabase(dbId);
    setDldcJoins([]);
    setDldcFieldRows([]);
    onWizardConfigChange?.({ dldcTable: '', dldcColumns: [] });
  };

  const handleDldcTableChange = (tableId: string) => {
    onWizardConfigChange?.({ dldcTable: tableId, dldcColumns: [] });
    setDldcJoins([]);
    const fields = DLDC_FIELDS[tableId] || [];
    setDldcFieldRows(fields.map((f, i) => ({
      id: `fr-init-${i}`, shared: true, isPK: i === 0,
      tableId, sourceJoinId: null,
      columnName: f.fieldName, targetColumn: f.fieldName, apiFieldName: f.fieldName,
      dataType: f.dataType, masked: false,
    })));
  };

  const handleDldcApply = () => {
    dldcFieldRows.filter(r => r.shared && r.columnName).forEach(row => {
      onAddAttributeInline?.({
        fieldName: row.apiFieldName || row.columnName,
        displayName: row.apiFieldName || row.columnName,
        dataType: row.dataType,
        required: row.isPK,
        unique: row.isPK,
        indexed: row.isPK,
        sourceType: 'reference',
        sourceTable: row.tableId,
        sourceField: row.columnName,
      });
    });
  };

  const handleInlineAdd = () => {
    const errors: typeof inlineErrors = {};
    if (!inlineForm.fieldName?.trim()) errors.fieldName = 'Tên trường không được để trống';
    if (!inlineForm.displayName?.trim()) errors.displayName = 'Tên hiển thị không được để trống';
    if (Object.keys(errors).length) { setInlineErrors(errors); return; }
    onAddAttributeInline?.({ ...inlineForm });
    setInlineForm(EMPTY_INLINE_FORM);
    setInlineErrors({});
  };

  // Statistics Calculations
  const totalAttributes = attributes.length;
  const requiredAttributes = attributes.filter(a => a.required).length;
  const uniqueAttributes = attributes.filter(a => a.unique).length;

  const getStructureStatusInfo = () => {
    // Find the latest structure approval request for the current entity
    const structRequest = requests?.find(r => r.entityId === currentEntityId && r.type === 'structure');
    const status = structRequest ? structRequest.status : 'draft';
    
    switch (status) {
      case 'approved':
      case 'partial':
        return { label: 'Đã duyệt', variant: 'green' };
      case 'pending':
        return { label: 'Chờ duyệt', variant: 'orange' };
      case 'rejected':
        return { label: 'Từ chối', variant: 'red' };
      case 'draft':
      default:
        // Fallback: if all attributes are approved, consider it approved
        const allApproved = attributes.length > 0 && attributes.every(a => a.status === 'approved');
        if (allApproved) {
          return { label: 'Đã duyệt', variant: 'green' };
        }
        return { label: 'Bản nháp', variant: 'slate' };
    }
  };
  
  const statusInfo = getStructureStatusInfo();

  // UI Local States for Filters & Pagination
  const [showFilters, setShowFilters] = useState(false);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showSourceWarning, setShowSourceWarning] = useState(false);
  const [showDldcModal, setShowDldcModal] = useState(false);
  const [modalDldcDatabase, setModalDldcDatabase] = useState<string>('');
  const [modalDldcTable, setModalDldcTable] = useState<string>('');
  const [modalDldcFieldRows, setModalDldcFieldRows] = useState<DldcFieldRow[]>([]);
  const [modalUseJoin, setModalUseJoin] = useState(false);
  const [modalDldcJoins, setModalDldcJoins] = useState<DldcJoin[]>([]);
  const [showDldcApproval, setShowDldcApproval] = useState(false);
  const [dldcApprovalForm, setDldcApprovalForm] = useState({ reviewer: '', note: '' });

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  // Từ khóa chỉ áp dụng khi bấm Tìm kiếm hoặc Enter (mục 5.19)
  const [appliedSearch, setAppliedSearch] = useState('');
  const runSearch = () => {
    setAppliedSearch(searchTerm);
    setCurrentPageNum(1);
  };
  const [filterConstraints, setFilterConstraints] = useState<string[]>([]);
  const [filterKeyType, setFilterKeyType] = useState('all');
  const [filterDataType, setFilterDataType] = useState('all');

  const toggleConstraint = (val: string) => {
    setFilterConstraints(prev =>
      prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
    );
  };

  const [showConstraintDropdown, setShowConstraintDropdown] = useState(false);

  // Reset page number on search or filter change
  React.useEffect(() => {
    setCurrentPageNum(1);
  }, [appliedSearch, filterConstraints, filterKeyType, filterDataType]);

  React.useEffect(() => {
    if (showDldcModal) {
      const defaultTable = currentEntity?.dldcTable || attributes.find(a => a.sourceTable)?.sourceTable || 'tbl_doanhnghiep';
      const defaultDb = getDatabaseForTable(defaultTable) || 'dkkd';
      setModalDldcDatabase(defaultDb);
      setModalDldcTable(defaultTable);
      setModalUseJoin(false);
      setModalDldcJoins([]);
      
      const fields = DLDC_FIELDS[defaultTable] || [];
      setModalDldcFieldRows(fields.map((f, i) => ({
        id: `fr-modal-${i}`,
        shared: true,
        isPK: i === 0 || f.fieldName.includes('id') || f.fieldName.includes('ma_'),
        tableId: defaultTable,
        sourceJoinId: null,
        columnName: f.fieldName,
        targetColumn: f.fieldName,
        apiFieldName: f.fieldName,
        dataType: f.dataType,
        masked: false,
      })));
    }
  }, [showDldcModal, currentEntity, attributes]);

  // Filter Logic
  const filteredAttributes = attributes.filter(attr => {
    const q = normalizeSearch(appliedSearch);
    const matchesSearch = normalizeSearch(attr.fieldName).includes(q) ||
                          normalizeSearch(attr.displayName).includes(q);
    const matchesConstraint = filterConstraints.length === 0
      || filterConstraints.some(c =>
          (c === 'required' && attr.required) ||
          (c === 'unique' && attr.unique) ||
          (c === 'index' && (attr as any).indexed) ||
          (c === 'none' && !attr.required && !attr.unique)
        );
    const matchesKeyType = filterKeyType === 'all'
      || (filterKeyType === 'primary' && attr.keyType === 'primary')
      || (filterKeyType === 'foreign' && attr.keyType === 'foreign')
      || (filterKeyType === 'none' && (!attr.keyType || attr.keyType === 'none'));
    const matchesDataType = filterDataType === 'all' || attr.dataType === filterDataType;
    return matchesSearch && matchesConstraint && matchesKeyType && matchesDataType;
  });

  const paginatedAttributes = filteredAttributes.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);

  const renderPagination = (totalItemsCount: number) => {
    if (totalItemsCount <= 0) return null;
    return (
      <Pagination
        className="border-t border-[#E2E8F0]"
        currentPage={currentPageNum}
        totalItems={totalItemsCount}
        pageSize={pageSize}
        onPageChange={setCurrentPageNum}
        onPageSizeChange={setPageSize}
      />
    );
  };

  const handleModalJoinTableChange = (joinId: string, newTableId: string) => {
    const oldJoin = modalDldcJoins.find(j => j.id === joinId);
    const oldTableId = oldJoin?.tableId || '';
    
    setModalDldcJoins(prev => prev.map(j => 
      j.id === joinId ? { ...j, tableId: newTableId, leftField: '', rightField: '' } : j
    ));

    setModalDldcFieldRows(prev => {
      const filtered = prev.filter(r => r.tableId !== oldTableId);
      if (newTableId) {
        const fields = DLDC_FIELDS[newTableId] || [];
        const newRows = fields.map((f, i) => ({
          id: `fr-modal-join-${joinId}-${i}`,
          shared: true,
          isPK: false,
          tableId: newTableId,
          sourceJoinId: joinId,
          columnName: f.fieldName,
          targetColumn: f.fieldName,
          apiFieldName: f.fieldName,
          dataType: f.dataType,
          masked: false,
        }));
        return [...filtered, ...newRows];
      }
      return filtered;
    });
  };

  const handleModalAddJoin = () => {
    const nextAliasNum = modalDldcJoins.length + 2;
    const newJoin: DldcJoin = {
      id: `join-${Date.now()}`,
      joinType: 'LEFT JOIN',
      tableId: '',
      alias: `t${nextAliasNum}`,
      leftField: '',
      rightField: '',
    };
    setModalDldcJoins(prev => [...prev, newJoin]);
  };

  const handleModalRemoveJoin = (joinId: string) => {
    const joinToRemove = modalDldcJoins.find(j => j.id === joinId);
    const tableIdToRemove = joinToRemove?.tableId || '';
    
    setModalDldcJoins(prev => prev.filter(j => j.id !== joinId));
    setModalDldcFieldRows(prev => prev.filter(r => r.tableId !== tableIdToRemove));
  };

  const handleModalDldcApply = () => {
    modalDldcFieldRows.filter(r => r.shared && r.columnName).forEach(row => {
      onAddAttributeInline?.({
        fieldName: row.apiFieldName || row.columnName,
        displayName: row.apiFieldName || row.columnName,
        dataType: row.dataType,
        required: row.isPK,
        unique: row.isPK,
        indexed: row.isPK,
        sourceType: 'reference',
        sourceTable: row.tableId,
        sourceField: row.columnName,
      });
    });
    setShowDldcModal(false);
    setModalDldcDatabase('');
    setModalDldcTable('');
    setModalDldcFieldRows([]);
    setModalUseJoin(false);
    setModalDldcJoins([]);
  };

  const dldcEntity = entities.find(e => e.id === selectedEntityId);

  return (
    <>
    <div className="space-y-4">

      {/* Entity Selector & Structure Status Card (Only if not in wizard) */}
      {!wizardMode && (
        <div className="grid grid-cols-2 gap-4">
          {/* Card 1: Chọn danh mục dùng chung */}
          <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0]">
            <label className={LABEL_CLS}>
              Chọn danh mục dữ liệu dùng chung <span className={REQUIRED_MARK}>*</span>
            </label>
            <div className="relative">
              <select
                title="Chọn thực thể"
                value={selectedEntityId}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedEntityId(e.target.value)}
                className={SELECT_CLS}
              >
                {entities.map(entity => (
                  <option key={entity.id} value={entity.id}>
                    {entity.code} - {entity.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
            </div>
          </div>

          {/* Card 2: Trạng thái cấu trúc */}
          <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] flex flex-col justify-between">
            <label className={LABEL_CLS}>
              Trạng thái cấu trúc
            </label>
            <div className="flex items-center h-10">
              <Badge label={statusInfo.label} variant={statusInfo.variant} />
            </div>
          </div>
        </div>
      )}

      {/* Search and Action Bar — ẩn trong wizard modal */}
      {!wizardMode && (
        <div>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="flex-1 w-full flex items-center gap-1.5">
              <div className="flex-1 min-w-0 relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm trường hoặc tên hiển thị..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
                  className={SEARCH_INPUT_CLS}
                />
              </div>
              <button
                type="button"
                aria-label="Tìm kiếm"
                title="Tìm kiếm"
                onClick={runSearch}
                className={SEARCH_BTN_CLS}
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              {!hideStructureActions && entityDataSource !== 'manual' && (
                <button
                  type="button"
                  onClick={() => {
                    if (entityDataSource === 'dldc') {
                      setShowDldcModal(true);
                    } else {
                      onAddAttribute();
                    }
                  }}
                  className={`${BTN_PRIMARY} flex-1 md:flex-none whitespace-nowrap`}
                  title="Thêm trường dữ liệu mới"
                >
                  <Plus className="w-4 h-4" />
                  Thêm trường dữ liệu
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {wizardMode ? (
        /* ── WIZARD MODE: 3 modes based on dataSource ── */
        <div className="space-y-5">

          {/* ── Mode: DLDC Sync ── */}
          {dataSource === 'dldc' && (
            <div className="space-y-4">
              {isViewOnly ? (
                /* ── Chế độ xem chi tiết: chỉ hiển thị tên CSDL, tên bảng, các trường — không cho chỉnh sửa ── */
                <>
                  <div className={SECTION_CARD_CLS}>
                    <div className={`${CARD_HEADER_CLS} gap-2`}>
                      <Database className="w-4 h-4 text-[#475569]" />
                      <p className={CARD_TITLE_CLS}>Cấu hình nguồn dữ liệu</p>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-x-6 gap-y-4">
                      <div>
                        <div className={FIELD_LABEL}>Cơ sở dữ liệu</div>
                        <div className={`${FIELD_VALUE} mt-1`}>
                          {DLDC_DATABASES.find(d => d.id === primaryDldcDbId)?.label || primaryDldcDbId || '--'}
                        </div>
                      </div>
                      <div>
                        <div className={FIELD_LABEL}>Bảng dữ liệu chính</div>
                        <div className={`${FIELD_VALUE} mt-1`}>
                          {DLDC_TABLES[primaryDldcDbId]?.find(t => t.id === primaryDldcTableId)?.displayName || primaryDldcTableId || '--'}
                        </div>
                      </div>
                      {joinedDldcTableIds.length > 0 && (
                        <div className="col-span-2">
                          <div className={FIELD_LABEL}>Bảng liên kết bổ sung</div>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {joinedDldcTableIds.map(tableId => {
                              const tableDbId = getDatabaseForTable(tableId);
                              const tableLabel = DLDC_TABLES[tableDbId]?.find(t => t.id === tableId)?.displayName || tableId;
                              return (
                                <Badge key={tableId} label={`${tableLabel} (${tableId})`} variant="blue" />
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={SECTION_CARD_CLS}>
                    <div className={`${CARD_HEADER_CLS} gap-2`}>
                      <FileText className="w-4 h-4 text-[#475569]" />
                      <p className={CARD_TITLE_CLS}>Các trường dữ liệu</p>
                      <Badge label={`${attributes.length} trường`} variant="blue" />
                    </div>
                    <div className="overflow-x-auto">
                      <table className={`${TABLE_CLS} dldc-summary-table`}>
                        <thead className="bg-[#F8FAFC]">
                          <tr className="h-[42px]">
                            <th className={`${TH_CLS}`}>Tên bảng</th>
                            <th className={`${TH_CLS}`}>Trường gốc</th>
                            <th className={`${TH_CLS}`}>Tên hiển thị</th>
                            <th className={`${TH_CLS}`}>Kiểu dữ liệu</th>
                            <th className={`${TH_CLS} !text-center`}>PK</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attributes.length === 0 ? (
                            <tr>
                              <td colSpan={5} className={EMPTY_TD_CLS}>
                                Chưa có trường dữ liệu nào
                              </td>
                            </tr>
                          ) : (
                            attributes.map(attr => (
                              <tr key={attr.id} className={TR_CLS}>
                                <td className={TD_CLS}>{attr.sourceTable || primaryDldcTableId || '--'}</td>
                                <td className={TD_CLS}>{attr.sourceField || attr.fieldName}</td>
                                <td className={TD_CLS}>{attr.displayName}</td>
                                <td className={TD_CLS}>{getDataTypeLabel(attr.dataType)}</td>
                                <td className={`${TD_CLS} text-center`}>
                                  {attr.keyType === 'primary' ? (
                                    <Badge label="PK" variant="amber" />
                                  ) : DASH}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
              <>

              {/* Cấu hình nguồn dữ liệu card */}
              <div className={SECTION_CARD_CLS}>
                {/* Blue header */}
                <div className={`${CARD_HEADER_CLS} justify-between`}>
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#475569]" />
                    <p className={CARD_TITLE_CLS}>Cấu hình nguồn dữ liệu</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={useJoin}
                    onClick={() => setUseJoin(v => !v)}
                    className="flex items-center gap-2 text-[13px] text-[#334155] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg"
                  >
                    <span>Sử dụng liên kết bảng (Join)</span>
                    <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${useJoin ? 'bg-blue-600' : 'bg-[#CBD5E1]'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useJoin ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                    </div>
                  </button>
                </div>

                {/* Info row — shown after table selected */}
                {dldcDatabase && wizardConfig?.dldcTable && (
                  <div className="px-4 py-2.5 bg-[#EAF3FF] border-b border-[#BFDBFE] flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#155DFC] flex-shrink-0" />
                    <p className="text-[13px] text-[#020817]">
                      Kho dữ liệu: <span className="font-medium">{DLDC_DATABASES.find(d => d.id === dldcDatabase)?.label}</span>
                      {' — '}
                      <span className="font-medium">{DLDC_TABLES[dldcDatabase]?.find(t => t.id === wizardConfig?.dldcTable)?.displayName}</span>
                    </p>
                  </div>
                )}

                <div className="p-4 space-y-4">
                  {/* CSDL selector — standalone row */}
                  <div>
                    <label className={LABEL_CLS}>Cơ sở dữ liệu</label>
                    <div className="relative">
                      <select
                        title="Chọn cơ sở dữ liệu"
                        value={dldcDatabase}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => handleDldcDatabaseChange(e.target.value)}
                        className={SELECT_CLS}
                      >
                        <option value="">-- Chọn cơ sở dữ liệu --</option>
                        {DLDC_DATABASES.map(db => (
                          <option key={db.id} value={db.id}>{db.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
                    </div>
                  </div>

                  {/* Primary table — single dropdown */}
                  {dldcDatabase && (
                    <div>
                      <div className="flex items-center justify-between">
                        <label className={LABEL_CLS}>Bảng dữ liệu chính</label>
                        <span className="text-[12px] text-[#64748B]">Primary Table</span>
                      </div>
                      <div className="relative">
                        <select
                          title="Chọn bảng dữ liệu chính"
                          value={wizardConfig?.dldcTable || ''}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => handleDldcTableChange(e.target.value)}
                          className={SELECT_CLS}
                        >
                          <option value="">-- Chọn bảng dữ liệu --</option>
                          {(DLDC_TABLES[dldcDatabase] || []).map(t => (
                            <option key={t.id} value={t.id}>{t.displayName} ({t.id})</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
                      </div>
                    </div>
                  )}

                  {/* Join tables — shown when useJoin toggled */}
                  {useJoin && (
                    <div className="space-y-3 pt-2 border-t border-[#E2E8F0]">
                      <div className="flex items-center justify-between">
                        <p className={CARD_TITLE_CLS}>
                          Bảng liên kết bổ sung ({dldcJoins.length})
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            const alias = `t${dldcJoins.length + 2}`;
                            setDldcJoins(prev => [...prev, {
                              id: `j-${prev.length}`, joinType: 'LEFT JOIN',
                              tableId: '', alias, leftField: '', rightField: '',
                            }]);
                          }}
                          className={BTN_OUTLINE}
                        >
                          <Plus className="w-4 h-4" />
                          Thêm bảng liên kết
                        </button>
                      </div>

                      {dldcJoins.map((join, idx) => {
                        const joinTableFields = join.tableId ? (DLDC_FIELDS[join.tableId] || []) : [];
                        const primaryFields = wizardConfig?.dldcTable ? (DLDC_FIELDS[wizardConfig.dldcTable] || []) : [];
                        return (
                          <div key={join.id} className="border border-[#E2E8F0] rounded-lg p-4 space-y-3 bg-[#F8FAFC]">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge label={`Bảng liên kết #${idx + 1}`} variant="blue" />
                                <span className="text-[13px] text-[#64748B]">Alias: {join.alias}</span>
                              </div>
                              <RowIconAction label="Xóa" onClick={() => {
                                  setDldcJoins(prev => prev.filter(j => j.id !== join.id));
                                  setDldcFieldRows(prev => prev.filter(r => r.sourceJoinId !== join.id));
                                }}>
                                <Trash2 className="w-4 h-4" />
                              </RowIconAction>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className={LABEL_CLS}>Kiểu liên kết</label>
                                <div className="relative">
                                  <select
                                    title="Kiểu liên kết"
                                    value={join.joinType}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                      setDldcJoins(prev => prev.map(j => j.id === join.id ? { ...j, joinType: e.target.value as DldcJoin['joinType'] } : j))
                                    }
                                    className={SELECT_CLS}
                                  >
                                    <option value="LEFT JOIN">LEFT JOIN</option>
                                    <option value="INNER JOIN">INNER JOIN</option>
                                    <option value="RIGHT JOIN">RIGHT JOIN</option>
                                  </select>
                                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
                                </div>
                              </div>
                              <div>
                                <label className={LABEL_CLS}>Bảng dữ liệu bổ sung</label>
                                <div className="relative">
                                  <select
                                    title="Bảng dữ liệu bổ sung"
                                    value={join.tableId}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                      const newTableId = e.target.value;
                                      setDldcFieldRows(prev => {
                                        const withoutOld = prev.filter(r => r.sourceJoinId !== join.id);
                                        if (!newTableId) return withoutOld;
                                        const newRows: DldcFieldRow[] = (DLDC_FIELDS[newTableId] || []).map((f, i) => ({
                                          id: `fr-${join.id}-${i}`, shared: true, isPK: false,
                                          tableId: newTableId, sourceJoinId: join.id,
                                          columnName: f.fieldName, targetColumn: f.fieldName, apiFieldName: f.fieldName,
                                          dataType: f.dataType, masked: false,
                                        }));
                                        return [...withoutOld, ...newRows];
                                      });
                                      setDldcJoins(prev => prev.map(j => j.id === join.id ? { ...j, tableId: newTableId, leftField: '', rightField: '' } : j));
                                    }}
                                    className={SELECT_CLS}
                                  >
                                    <option value="">-- Chọn bảng --</option>
                                    {dldcDatabase && (DLDC_TABLES[dldcDatabase] || [])
                                      .filter(t => t.id !== wizardConfig?.dldcTable)
                                      .map(t => <option key={t.id} value={t.id}>{t.displayName} ({t.id})</option>)}
                                  </select>
                                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className={LABEL_CLS}>Điều kiện liên kết (Join Condition)</label>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 min-w-0 relative">
                                  <select
                                    title="Trường bảng liên kết"
                                    value={join.leftField}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                      setDldcJoins(prev => prev.map(j => j.id === join.id ? { ...j, leftField: e.target.value } : j))
                                    }
                                    className={SELECT_CLS}
                                  >
                                    <option value="">-- {join.alias}.field --</option>
                                    {joinTableFields.map(f => (
                                      <option key={f.fieldName} value={`${join.alias}.${f.fieldName}`}>{join.alias}.{f.fieldName}</option>
                                    ))}
                                  </select>
                                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
                                </div>
                                <div className="w-8 h-10 flex items-center justify-center bg-[#F1F5F9] rounded-lg border border-[#E2E8F0] text-[#475569] font-medium text-[13px] flex-shrink-0">=</div>
                                <div className="flex-1 min-w-0 relative">
                                  <select
                                    title="Trường bảng chính"
                                    value={join.rightField}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                      setDldcJoins(prev => prev.map(j => j.id === join.id ? { ...j, rightField: e.target.value } : j))
                                    }
                                    className={SELECT_CLS}
                                  >
                                    <option value="">-- {wizardConfig?.dldcTable || 'table'}.field --</option>
                                    {primaryFields.map(f => (
                                      <option key={f.fieldName} value={`${wizardConfig?.dldcTable}.${f.fieldName}`}>{wizardConfig?.dldcTable}.{f.fieldName}</option>
                                    ))}
                                  </select>
                                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
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

              {/* Field Selection table */}
              {wizardConfig?.dldcTable && (
                <div className={SECTION_CARD_CLS}>
                  <div className={`${CARD_HEADER_CLS} justify-between`}>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#475569]" />
                      <p className={CARD_TITLE_CLS}>Chọn trường dữ liệu chia sẻ (Field Selection)</p>
                      <Badge label={`${dldcFieldRows.filter(r => r.shared).length}/${dldcFieldRows.length} trường được chọn`} variant="blue" />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setDldcFieldRows(prev => [...prev, {
                          id: `fr-manual-${prev.length}`, shared: true, isPK: false,
                          tableId: wizardConfig?.dldcTable || '', sourceJoinId: null,
                          columnName: '', targetColumn: '', apiFieldName: '', dataType: 'string', masked: false,
                        }]);
                      }}
                      className={BTN_OUTLINE}
                    >
                      <Plus className="w-4 h-4" />
                      Thêm trường dữ liệu
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className={`${TABLE_CLS} table-fixed`}>
                      <colgroup>
                        <col style={{ width: '5%' }} />
                        <col style={{ width: '5%' }} />
                        <col style={{ width: '18%' }} />
                        <col style={{ width: '18%' }} />
                        <col style={{ width: '3%' }} />
                        <col style={{ width: '16%' }} />
                        <col style={{ width: '16%' }} />
                        <col style={{ width: '14%' }} />
                        <col style={{ width: '5%' }} />
                      </colgroup>
                      <thead className="bg-[#F8FAFC]">
                        <tr className="h-[42px]">
                          <th className={`${TH_CLS} !text-center`}>Chọn</th>
                          <th className={`${TH_CLS} !text-center`}>PK</th>
                          <th className={`${TH_CLS}`}>Nguồn dữ liệu (Table)</th>
                          <th className={`${TH_CLS}`}>Trường gốc (Column)</th>
                          <th className={`${TH_CLS} !px-1 !text-center`}></th>
                          <th className={`${TH_CLS}`}>Tên cột</th>
                          <th className={`${TH_CLS}`}>Tên hiển thị</th>
                          <th className={`${TH_CLS}`}>Kiểu dữ liệu</th>
                          <th className={`${TH_CLS} !text-center`}>Xóa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dldcFieldRows.length === 0 ? (
                          <tr>
                            <td colSpan={9} className={EMPTY_TD_CLS}>
                              Chọn bảng dữ liệu để tải danh sách trường
                            </td>
                          </tr>
                        ) : (
                          dldcFieldRows.map(row => {
                            const allTablesForDb = dldcDatabase ? (DLDC_TABLES[dldcDatabase] || []) : [];
                            const tableFieldsForRow = DLDC_FIELDS[row.tableId] || [];
                            return (
                              <tr key={row.id} className={TR_CLS}>
                                <td className="px-3 py-1 text-center overflow-hidden">
                                  <input type="checkbox" checked={row.shared}
                                    onChange={() => setDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, shared: !r.shared } : r))}
                                    className="w-4 h-4 rounded accent-blue-600 cursor-pointer" />
                                </td>
                                <td className="px-3 py-1 text-center overflow-hidden">
                                  <input type="checkbox" checked={row.isPK}
                                    onChange={() => setDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, isPK: !r.isPK } : r))}
                                    className="w-4 h-4 rounded accent-[#D97706] cursor-pointer" />
                                </td>
                                <td className="px-3 py-1 overflow-hidden">
                                  <select title="Nguồn dữ liệu" value={row.tableId}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                      setDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, tableId: e.target.value, columnName: '', apiFieldName: '' } : r))
                                    }
                                    className={`${INPUT_CLS} min-w-0`}
                                  >
                                    <option value="">--</option>
                                    {allTablesForDb.map(t => <option key={t.id} value={t.id}>{t.id}</option>)}
                                  </select>
                                </td>
                                <td className="px-3 py-1 overflow-hidden">
                                  <select title="Trường gốc" value={row.columnName}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                      const fd = tableFieldsForRow.find(f => f.fieldName === e.target.value);
                                      setDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, columnName: e.target.value, targetColumn: e.target.value, apiFieldName: e.target.value, dataType: fd?.dataType || r.dataType } : r));
                                    }}
                                    className={`${INPUT_CLS} min-w-0`}
                                  >
                                    <option value="">--</option>
                                    {tableFieldsForRow.map(f => <option key={f.fieldName} value={f.fieldName}>{f.fieldName}</option>)}
                                  </select>
                                </td>
                                <td className="px-1 py-1 text-center overflow-hidden">
                                  <ArrowRight className="w-4 h-4 text-[#64748B] mx-auto" />
                                </td>
                                <td className="px-3 py-1 overflow-hidden">
                                  <input type="text" value={row.targetColumn}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                      setDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, targetColumn: e.target.value } : r))
                                    }
                                    placeholder="Tên cột đích"
                                    className={`${INPUT_CLS} min-w-0`}
                                  />
                                </td>
                                <td className="px-3 py-1 overflow-hidden">
                                  <input type="text" value={row.apiFieldName}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                      setDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, apiFieldName: e.target.value } : r))
                                    }
                                    className={`${INPUT_CLS} min-w-0`}
                                  />
                                </td>
                                <td className="px-3 py-1 overflow-hidden">
                                  <select title="Kiểu dữ liệu" value={row.dataType}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                      setDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, dataType: e.target.value as FieldDataType } : r))
                                    }
                                    className={`${INPUT_CLS} min-w-0`}
                                  >
                                    {FIELD_DATA_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                  </select>
                                </td>
                                <td className="px-3 py-1 text-center overflow-hidden">
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
                  <div className="px-4 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end">
                    <button
                      type="button"
                      disabled={dldcFieldRows.filter(r => r.shared && r.columnName).length === 0}
                      onClick={handleDldcApply}
                      className={BTN_PRIMARY}
                    >
                      <Check className="w-4 h-4" />
                      Áp dụng cấu trúc ({dldcFieldRows.filter(r => r.shared && r.columnName).length} trường)
                    </button>
                  </div>
                </div>
              )}
              </>
              )}
            </div>
          )}


          {/* ── Mode: Manual (direct update) ── */}
          {dataSource === 'manual' && (
            <>
              {/* Inline Attribute Form — ẩn khi xem chi tiết */}
              {!isViewOnly && <div className={SECTION_CARD_CLS}>
                <div className={CARD_HEADER_CLS}>
                  <p className={CARD_TITLE_CLS}>Thêm trường dữ liệu mới</p>
                </div>
            <div className="p-4 space-y-4">
              {/* Row 1: Tên trường */}
              <div>
                <label className={LABEL_CLS}>
                  Tên trường <span className={REQUIRED_MARK}>*</span>
                </label>
                <input
                  type="text"
                  value={inlineForm.fieldName || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setInlineForm({ ...inlineForm, fieldName: e.target.value });
                    if (inlineErrors.fieldName) setInlineErrors({ ...inlineErrors, fieldName: undefined });
                  }}
                  placeholder="VD: citizen_id"
                  className={`${INPUT_CLS} ${inlineErrors.fieldName ? '!border-[#DC2626]' : ''}`}
                />
                {inlineErrors.fieldName && <p className="mt-1 text-[12px] text-[#DC2626]">{inlineErrors.fieldName}</p>}
                <p className="mt-1 text-[12px] text-[#64748B]">Tên định danh trong cơ sở dữ liệu (không dấu, chữ thường)</p>
              </div>

              {/* Row 2: Tên hiển thị */}
              <div>
                <label className={LABEL_CLS}>
                  Tên hiển thị <span className={REQUIRED_MARK}>*</span>
                </label>
                <input
                  type="text"
                  value={inlineForm.displayName || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setInlineForm({ ...inlineForm, displayName: e.target.value });
                    if (inlineErrors.displayName) setInlineErrors({ ...inlineErrors, displayName: undefined });
                  }}
                  placeholder="VD: Số CCCD"
                  className={`${INPUT_CLS} ${inlineErrors.displayName ? '!border-[#DC2626]' : ''}`}
                />
                {inlineErrors.displayName && <p className="mt-1 text-[12px] text-[#DC2626]">{inlineErrors.displayName}</p>}
              </div>

              {/* Row 3: Kiểu dữ liệu + Độ dài */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLS}>
                    Kiểu dữ liệu <span className={REQUIRED_MARK}>*</span>
                  </label>
                  <select
                    title="Kiểu dữ liệu"
                    value={inlineForm.dataType || 'string'}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setInlineForm({ ...inlineForm, dataType: e.target.value as FieldDataType })}
                    className={INPUT_CLS}
                  >
                    {FIELD_DATA_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLS}>Độ dài tối đa</label>
                  <input
                    type="number"
                    value={inlineForm.length ?? ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setInlineForm({ ...inlineForm, length: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="VD: 255"
                    className={INPUT_CLS}
                  />
                </div>
              </div>

              {/* Row 4: Là trường bắt buộc checkbox */}
              <div className="flex items-center p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#020817]">
                  <input
                    type="checkbox"
                    checked={inlineForm.required || false}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setInlineForm({ ...inlineForm, required: e.target.checked })}
                    className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                  />
                  <span className={FIELD_LABEL}>Là trường bắt buộc</span>
                </label>
              </div>

              {/* Row 4.5: Cấu hình khóa (Khóa chính / Khóa ngoại) */}
              <div className="flex items-center gap-6 p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                <label className={`${FIELD_LABEL} shrink-0`}>Cấu hình khóa:</label>
                <div className="flex items-center gap-6">
                  {[
                    { value: 'primary', label: 'Khóa chính (PK)' },
                    { value: 'foreign', label: 'Khóa ngoại (FK)' }
                  ].map((option) => {
                    const isSelected = inlineForm.keyType === option.value;
                    return (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer text-[13px] text-[#020817]">
                        <input
                          type="radio"
                          name="inlineKeyType"
                          value={option.value}
                          checked={isSelected}
                          onChange={() => {
                            setInlineForm({ 
                              ...inlineForm, 
                              keyType: option.value as any,
                              ...(option.value === 'primary' ? { required: true, unique: true } : {}),
                              ...(option.value !== 'foreign' ? { foreignTable: undefined, foreignField: undefined } : {})
                            });
                          }}
                          onClick={() => {
                            if (isSelected) {
                              setInlineForm({ 
                                ...inlineForm, 
                                keyType: 'none',
                                foreignTable: undefined,
                                foreignField: undefined
                              });
                            }
                          }}
                          className="w-4 h-4 accent-blue-600 cursor-pointer"
                        />
                        <span>{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Row 5: Giá trị mặc định */}
              <div>
                <label className={LABEL_CLS}>Giá trị mặc định</label>
                <input
                  type="text"
                  value={inlineForm.defaultValue || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setInlineForm({ ...inlineForm, defaultValue: e.target.value })}
                  placeholder="Để trống nếu không có"
                  className={INPUT_CLS}
                />
              </div>

              {/* Add button */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleInlineAdd}
                  className={BTN_PRIMARY}
                >
                  <Plus className="w-4 h-4" />
                  Thêm trường
                </button>
              </div>
            </div>
          </div>}

          {/* Compact list of added attributes */}
          <div className={SECTION_CARD_CLS}>
            <div className={`${CARD_HEADER_CLS} justify-between`}>
              <p className={CARD_TITLE_CLS}>Danh sách trường đã thêm</p>
              <span className="text-[13px] text-[#64748B]">{attributes.length} trường</span>
            </div>
            {attributes.length === 0 ? (
              <div className="py-16 text-center text-[13px] text-[#64748B]">Chưa có trường nào được thêm</div>
            ) : (
              <table className={`${TABLE_CLS}`}>
                <thead className="bg-[#F8FAFC]">
                  <tr className="h-[42px]">
                    <th className={`${TH_CLS}`}>Tên trường</th>
                    <th className={`${TH_CLS}`}>Tên hiển thị</th>
                    <th className={`${TH_CLS}`}>Kiểu DL</th>
                    <th className={`${TH_CLS}`}>Cấu hình khóa</th>
                    <th className={`${TH_CLS}`}>Bắt buộc</th>
                    <th className={`${TH_CLS} !text-center w-20`}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {attributes.map(attr => (
                    <tr key={attr.id} className={TR_CLS}>
                      <td className={TD_CLS}>{attr.fieldName}</td>
                      <td className={TD_CLS}>{attr.displayName}</td>
                      <td className={TD_CLS}>{getDataTypeLabel(attr.dataType)}</td>
                      <td className={TD_CLS}>
                        {attr.keyType === 'primary' || attr.keyType === 'foreign' ? (
                          <div className="flex gap-1 flex-wrap">
                            {attr.keyType === 'primary' && <span title="Khóa chính (Primary Key)"><Badge label="PK" variant="amber" /></span>}
                            {attr.keyType === 'foreign' && (
                              <span title={`Khóa ngoại (Foreign Key) liên kết với danh mục ID: ${attr.foreignTable}, trường: ${attr.foreignField}`}><Badge label="FK" variant="emerald" /></span>
                            )}
                          </div>
                        ) : DASH}
                      </td>
                      <td className={TD_CLS}>
                        {attr.required ? (
                          <Badge label="Bắt buộc" variant="red" />
                        ) : DASH}
                      </td>
                      <td className={`${TD_CLS} text-center`}>
                        <RowIconAction label="Xóa trường" onClick={() => onDeleteAttribute(attr.id)}>
                          <Trash2 className="w-4 h-4" />
                        </RowIconAction>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
            </>
          )}
        </div>
      ) : (
        /* ── FULL PAGE MODE: entity info + full table ── */
        <>
          {/* Current Managed Entity Info */}
          <div className={`border rounded-lg px-4 py-3 flex items-start gap-3 text-[13px] text-[#020817] ${
            (entityDataSource === 'dldc')
              ? 'bg-[#FFF7ED] border-[#FED7AA]'
              : 'bg-[#EAF3FF] border-[#BFDBFE]'
          }`}>
            <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
              (entityDataSource === 'dldc')
                ? 'text-[#D97706]'
                : 'text-[#155DFC]'
            }`} />
            <div className="leading-relaxed">
              <span className="font-medium">Thông tin cấu hình:</span>{' '}
              <span>Đang thực hiện cấu hình cấu trúc trường dữ liệu cho danh mục </span>
              <strong className="font-medium underline underline-offset-2">
                {currentEntity?.name || 'Chưa chọn thực thể'}
              </strong>
              <span>. Nguồn dữ liệu: </span>
              <span className="font-medium">{getDataSourceLabel(entityDataSource)}</span>
            </div>
          </div>

          {/* Attributes Table */}
          <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
            <div className="overflow-x-auto">
              <table className={TABLE_CLS}>
                <thead className="bg-[#F8FAFC]">
                  {entityDataSource === 'dldc' ? (
                    <tr className="h-[42px]">
                      <th className={`${TH_CLS} !text-center`}>STT</th>
                      <th className={`${TH_CLS}`}>Tên CSDL</th>
                      <th className={`${TH_CLS}`}>Nguồn dữ liệu</th>
                      <th className={`${TH_CLS}`}>Trường gốc</th>
                      <th className={`${TH_CLS}`}>Tên hiển thị</th>
                      <th className={`${TH_CLS}`}>Kiểu dữ liệu</th>
                      <th className={`${TH_CLS} !text-center`}>PK</th>
                      {!hideStructureActions && <th className={`${TH_CLS} !text-center w-[120px]`}>Thao tác</th>}
                    </tr>
                  ) : (
                    <tr className="h-[42px]">
                      <th className={`${TH_CLS} !text-center`}>STT</th>
                      <th className={`${TH_CLS}`}>Tên trường</th>
                      <th className={`${TH_CLS}`}>Tên hiển thị</th>
                      <th className={`${TH_CLS}`}>Kiểu dữ liệu</th>
                      <th className={`${TH_CLS}`}>Độ dài</th>
                      <th className={`${TH_CLS}`}>Cấu hình khóa</th>
                      <th className={`${TH_CLS}`}>Bắt buộc</th>
                      <th className={`${TH_CLS} !text-center`}>Giá trị mặc định</th>
                      {!hideStructureActions && <th className={`${TH_CLS} !text-center w-[120px]`}>Thao tác</th>}
                    </tr>
                  )}
                </thead>
                <tbody>
                  {paginatedAttributes.length > 0 ? (
                    paginatedAttributes.map((attr, idx) => {
                      const isLocked = entityDataSource === 'dldc';
                      const dbId = getDatabaseForTable(attr.sourceTable || '');
                      const dbLabel = DLDC_DATABASES.find(d => d.id === dbId)?.label || dbId || '--';

                      return (
                        <tr key={attr.id} className={TR_CLS}>
                          <td className={`${TD_CLS} text-center`}>
                            {(currentPageNum - 1) * pageSize + idx + 1}
                          </td>
                          {entityDataSource === 'dldc' ? (
                            <>
                              <td className={`${TD_CLS} max-w-[200px]`}><TruncatedText text={dbLabel} /></td>
                              <td className={`${TD_CLS} max-w-[240px]`}><TruncatedText text={attr.sourceTable || '--'} /></td>
                              <td className={`${TD_CLS} max-w-[240px]`}><TruncatedText text={attr.sourceField || '--'} /></td>
                              <td className={`${TD_CLS} max-w-[280px]`}><TruncatedText text={attr.displayName || attr.fieldName || '--'} /></td>
                              <td className={TD_CLS}>{attr.dataType ? getDataTypeLabel(attr.dataType) : '--'}</td>
                              <td className={`${TD_CLS} text-center`}>
                                {attr.keyType === 'primary' ? (
                                  <span title="Khóa chính (Primary Key)"><Badge label="PK" variant="amber" /></span>
                                ) : DASH}
                              </td>
                            </>
                          ) : (
                            <>
                              <td className={`${TD_CLS} max-w-[240px]`}><TruncatedText text={attr.fieldName || '--'} /></td>
                              <td className={`${TD_CLS} max-w-[280px]`}><TruncatedText text={attr.displayName || '--'} /></td>
                              <td className={TD_CLS}>{attr.dataType ? getDataTypeLabel(attr.dataType) : '--'}</td>
                              <td className={`${TD_CLS} text-right tabular-nums`}>{attr.length ?? '--'}</td>
                              <td className={TD_CLS}>
                                {attr.keyType === 'primary' || attr.keyType === 'foreign' ? (
                                  <div className="flex gap-1 flex-wrap">
                                    {attr.keyType === 'primary' && <span title="Khóa chính (Primary Key)"><Badge label="PK" variant="amber" /></span>}
                                    {attr.keyType === 'foreign' && (
                                      <span title={`Khóa ngoại (Foreign Key) liên kết với danh mục ID: ${attr.foreignTable}, trường: ${attr.foreignField}`}><Badge label="FK" variant="emerald" /></span>
                                    )}
                                  </div>
                                ) : DASH}
                              </td>
                              <td className={TD_CLS}>
                                {attr.required ? (
                                  <Badge label="Bắt buộc" variant="red" />
                                ) : DASH}
                              </td>
                              <td className={`${TD_CLS} max-w-[200px]`}><TruncatedText text={attr.defaultValue || '--'} /></td>
                            </>
                          )}

                          {!hideStructureActions && (
                            <td className={`${TD_CLS} text-center`}>
                              <div className="flex items-center justify-center gap-1">
                                <RowIconAction
                                  label="Sửa"
                                  onClick={() => onEditAttribute(attr)}
                                  disabledReason={isLocked ? 'Trường đồng bộ từ Kho DLDC, không thể chỉnh sửa' : undefined}
                                >
                                  <SquarePen className="w-4 h-4" />
                                </RowIconAction>
                                <RowIconAction
                                  label="Xóa"
                                  onClick={() => onDeleteAttribute(attr.id)}
                                  disabledReason={isLocked ? 'Trường đồng bộ từ Kho DLDC, không thể xóa' : undefined}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </RowIconAction>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={getColSpan()} className={EMPTY_TD_CLS}>
                        Không tìm thấy dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {renderPagination(filteredAttributes.length)}
          </div>
        </>
      )}
      {showSourceWarning && (
        <BaseModal
          isOpen={showSourceWarning}
          onClose={() => setShowSourceWarning(false)}
          title="Không thể thêm trường dữ liệu"
          subtitle="Hạn chế thao tác cấu trúc nguồn dữ liệu đồng bộ"
          footer={
            <div className="flex justify-end w-full">
              <button
                onClick={() => setShowSourceWarning(false)}
                className={BTN_PRIMARY}
              >
                Đã hiểu và đóng
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-2.5 text-[#020817] bg-[#FFF7ED] border border-[#FED7AA] px-4 py-3 rounded-lg text-[13px]">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#D97706]" />
              <span>Nguồn dữ liệu hiện tại: {getDataSourceLabel(entityDataSource)}</span>
            </div>
            <div className="space-y-2 leading-relaxed">
              <p className="text-[13px] text-[#334155]">
                Danh mục này đang được đồng bộ hoặc liên kết trực tiếp qua <b>{getDataSourceLabel(entityDataSource)}</b>. 
              </p>
              <p className="text-[13px] text-[#334155]">
                Để bảo đảm tính toàn vẹn dữ liệu và tránh xung đột cấu trúc với nguồn gốc, hệ thống <b>ngăn chặn thao tác thêm mới trường dữ liệu thủ công</b>.
              </p>
              <p className="text-[12px] text-[#64748B] mt-2">
                * Vui lòng đồng bộ lại cấu trúc mới từ hệ thống gốc hoặc liên hệ quản trị viên để được hỗ trợ.
              </p>
            </div>
          </div>
        </BaseModal>
      )}

      {/* DLDC Field Configuration Modal */}
      {showDldcModal && (
        <BaseModal
          isOpen={showDldcModal}
          onClose={() => {
            setShowDldcModal(false);
            setModalDldcDatabase('');
            setModalDldcTable('');
            setModalDldcFieldRows([]);
            setModalUseJoin(false);
            setModalDldcJoins([]);
          }}
          title="Cấu hình nguồn dữ liệu"
          subtitle="Kho dữ liệu từ nguồn đồng bộ và cấu hình các trường"
          maxWidth="max-w-5xl"
          footer={
            <div className="flex justify-end gap-3 w-full">
              <button
                type="button"
                onClick={() => {
                  setShowDldcModal(false);
                  setModalDldcDatabase('');
                  setModalDldcTable('');
                  setModalDldcFieldRows([]);
                }}
                className={BTN_OUTLINE}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={!modalDldcTable || modalDldcFieldRows.filter(r => r.shared && r.columnName).length === 0}
                onClick={() => setShowDldcApproval(true)}
                className={BTN_PRIMARY}
              >
                <Send className="w-4 h-4" />
                Gửi duyệt cấu trúc
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-left">
            {/* Blue Header Style Card */}
            <div className={SECTION_CARD_CLS}>
              {/* Blue Header Bar */}
              <div className={`${CARD_HEADER_CLS} justify-between`}>
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#475569]" />
                    <p className={CARD_TITLE_CLS}>Cấu hình nguồn dữ liệu</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={modalUseJoin}
                    onClick={() => setModalUseJoin(v => !v)}
                    className="flex items-center gap-2 text-[13px] text-[#334155] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg"
                  >
                    <span>Sử dụng liên kết bảng (Join)</span>
                    <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${modalUseJoin ? 'bg-blue-600' : 'bg-[#CBD5E1]'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${modalUseJoin ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                    </div>
                  </button>
                </div>

              {/* Sub Info Bar */}
              <div className="px-4 py-2.5 bg-[#EAF3FF] border-b border-[#BFDBFE] flex items-center gap-2">
                <Database className="w-4 h-4 text-[#155DFC] flex-shrink-0" />
                <p className="text-[13px] text-[#020817]">
                  Kho dữ liệu:{' '}
                  <span className="font-medium">
                    {DLDC_DATABASES.find(d => d.id === modalDldcDatabase)?.label || '--'}
                  </span>
                  {' — '}
                  <span className="font-medium">
                    {DLDC_TABLES[modalDldcDatabase]?.find(t => t.id === modalDldcTable)?.displayName || '--'}
                  </span>
                </p>
              </div>

              {/* Form Content */}
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* CSDL Selector (disabled) */}
                  <div>
                    <label className={LABEL_CLS}>Cơ sở dữ liệu</label>
                    <div className="relative">
                      <select
                        title="Chọn cơ sở dữ liệu"
                        disabled
                        value={modalDldcDatabase}
                        className={SELECT_CLS}
                      >
                        <option value="">-- Chọn cơ sở dữ liệu --</option>
                        {DLDC_DATABASES.map(db => (
                          <option key={db.id} value={db.id}>{db.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
                    </div>
                  </div>

                  {/* Primary table (disabled) */}
                  <div>
                    <label className={LABEL_CLS}>Bảng dữ liệu chính</label>
                    <div className="relative">
                      <select
                        title="Chọn bảng dữ liệu chính"
                        disabled
                        value={modalDldcTable}
                        className={SELECT_CLS}
                      >
                        <option value="">-- Chọn bảng dữ liệu --</option>
                        {modalDldcDatabase && (DLDC_TABLES[modalDldcDatabase] || []).map(t => (
                          <option key={t.id} value={t.id}>{t.displayName} ({t.id})</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Join tables — shown when modalUseJoin toggled */}
                {modalUseJoin && (
                  <div className="space-y-3 pt-2 border-t border-[#E2E8F0]">
                    <div className="flex items-center justify-between">
                      <p className={CARD_TITLE_CLS}>
                        Bảng liên kết bổ sung ({modalDldcJoins.length})
                      </p>
                      <button
                        type="button"
                        onClick={handleModalAddJoin}
                        className={BTN_OUTLINE}
                      >
                        <Plus className="w-4 h-4" />
                        Thêm bảng liên kết
                      </button>
                    </div>

                    {modalDldcJoins.map((join) => {
                      const joinTableFields = DLDC_FIELDS[join.tableId] || [];
                      const primaryFields = DLDC_FIELDS[modalDldcTable] || [];

                      return (
                        <div key={join.id} className="p-4 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] space-y-4 relative animate-in fade-in zoom-in-95 duration-200">
                          <div className="absolute top-3 right-3">
                            <RowIconAction label="Xóa liên kết" onClick={() => handleModalRemoveJoin(join.id)}>
                              <X className="w-4 h-4" />
                            </RowIconAction>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className={LABEL_CLS}>Loại liên kết (Join Type)</label>
                              <div className="relative">
                                <select
                                  title="Loại liên kết"
                                  value={join.joinType}
                                  onChange={(e) =>
                                    setModalDldcJoins(prev => prev.map(j => j.id === join.id ? { ...j, joinType: e.target.value as any } : j))
                                  }
                                  className={SELECT_CLS}
                                >
                                  <option value="LEFT JOIN">LEFT JOIN</option>
                                  <option value="INNER JOIN">INNER JOIN</option>
                                  <option value="RIGHT JOIN">RIGHT JOIN</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
                              </div>
                            </div>
                            <div>
                              <label className={LABEL_CLS}>Bảng liên kết (Table)</label>
                              <div className="relative">
                                <select
                                  title="Bảng liên kết"
                                  value={join.tableId}
                                  onChange={(e) => handleModalJoinTableChange(join.id, e.target.value)}
                                  className={SELECT_CLS}
                                >
                                  <option value="">-- Chọn bảng --</option>
                                  {modalDldcDatabase && (DLDC_TABLES[modalDldcDatabase] || [])
                                    .filter(t => t.id !== modalDldcTable)
                                    .map(t => <option key={t.id} value={t.id}>{t.displayName} ({t.id})</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
                              </div>
                            </div>
                            <div>
                              <label className={LABEL_CLS}>Bảng phụ danh định (Alias)</label>
                              <input
                                type="text"
                                disabled
                                value={join.alias}
                                className={INPUT_CLS}
                              />
                            </div>
                          </div>

                          <div>
                            <label className={LABEL_CLS}>Điều kiện liên kết (Join Condition)</label>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 min-w-0 relative">
                                <select
                                  title="Trường bảng liên kết"
                                  value={join.leftField}
                                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                    setModalDldcJoins(prev => prev.map(j => j.id === join.id ? { ...j, leftField: e.target.value } : j))
                                  }
                                  className={SELECT_CLS}
                                >
                                  <option value="">-- {join.alias}.field --</option>
                                  {joinTableFields.map(f => (
                                    <option key={f.fieldName} value={`${join.alias}.${f.fieldName}`}>{join.alias}.{f.fieldName}</option>
                                  ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
                              </div>
                              <div className="w-8 h-10 flex items-center justify-center bg-[#F1F5F9] rounded-lg border border-[#E2E8F0] text-[#475569] font-medium text-[13px] flex-shrink-0">=</div>
                              <div className="flex-1 min-w-0 relative">
                                <select
                                  title="Trường bảng chính"
                                  value={join.rightField}
                                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                    setModalDldcJoins(prev => prev.map(j => j.id === join.id ? { ...j, rightField: e.target.value } : j))
                                  }
                                  className={SELECT_CLS}
                                >
                                  <option value="">-- {modalDldcTable}.field --</option>
                                  {primaryFields.map(f => (
                                    <option key={f.fieldName} value={`${modalDldcTable}.${f.fieldName}`}>{modalDldcTable}.{f.fieldName}</option>
                                  ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
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

            {/* Field Selection table */}
            {modalDldcTable && (
              <div className={SECTION_CARD_CLS}>
                <div className={`${CARD_HEADER_CLS} justify-between`}>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#475569]" />
                    <p className={CARD_TITLE_CLS}>Chọn trường dữ liệu chia sẻ (Field Selection)</p>
                    <Badge label={`${modalDldcFieldRows.filter(r => r.shared).length}/${modalDldcFieldRows.length} trường được chọn`} variant="blue" />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setModalDldcFieldRows(prev => [...prev, {
                        id: `fr-modal-manual-${prev.length}-${Date.now()}`, shared: true, isPK: false,
                        tableId: modalDldcTable, sourceJoinId: null,
                        columnName: '', targetColumn: '', apiFieldName: '', dataType: 'string', masked: false,
                      }]);
                    }}
                    className={BTN_OUTLINE}
                  >
                    <Plus className="w-4 h-4" />
                    Thêm trường dữ liệu
                  </button>
                </div>
                <div className="overflow-x-auto max-h-[350px]">
                  <table className={`${TABLE_CLS} table-fixed`}>
                    <colgroup>
                      <col style={{ width: '6%' }} />
                      <col style={{ width: '6%' }} />
                      <col style={{ width: '22%' }} />
                      <col style={{ width: '22%' }} />
                      <col style={{ width: '24%' }} />
                      <col style={{ width: '15%' }} />
                      <col style={{ width: '5%' }} />
                    </colgroup>
                    <thead className="bg-[#F8FAFC] sticky top-0 z-[2]">
                      <tr className="h-[42px]">
                        <th className={`${TH_CLS} !text-center`}>Chia sẻ</th>
                        <th className={`${TH_CLS} !text-center`}>PK</th>
                        <th className={`${TH_CLS}`}>Nguồn dữ liệu (Table)</th>
                        <th className={`${TH_CLS}`}>Trường gốc (Column)</th>
                        <th className={`${TH_CLS}`}>Tên hiển thị</th>
                        <th className={`${TH_CLS}`}>Kiểu dữ liệu</th>
                        <th className={`${TH_CLS} !text-center`}>Xóa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modalDldcFieldRows.map(row => {
                        const tableFieldsForRow = DLDC_FIELDS[row.tableId] || [];
                        return (
                          <tr key={row.id} className={TR_CLS}>
                            {/* Chia sẻ */}
                            <td className="px-3 py-1 text-center overflow-hidden">
                              <input
                                type="checkbox"
                                checked={row.shared}
                                onChange={() => setModalDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, shared: !r.shared } : r))}
                                className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                              />
                            </td>
                            {/* PK */}
                            <td className="px-3 py-1 text-center overflow-hidden">
                              <input
                                type="checkbox"
                                checked={row.isPK}
                                onChange={() => setModalDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, isPK: !r.isPK } : r))}
                                className="w-4 h-4 rounded accent-[#D97706] cursor-pointer"
                              />
                            </td>
                            {/* Nguồn dữ liệu (Table) */}
                            <td className="px-3 py-1 overflow-hidden">
                              <select
                                title="Nguồn dữ liệu"
                                value={row.tableId}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                  setModalDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, tableId: e.target.value, columnName: '', apiFieldName: '' } : r))
                                }
                                className={`${INPUT_CLS} min-w-0`}
                              >
                                <option value="">--</option>
                                <option value={modalDldcTable}>{modalDldcTable}</option>
                                {modalDldcJoins.filter(j => j.tableId).map(j => (
                                  <option key={j.id} value={j.tableId}>{j.tableId} ({j.alias})</option>
                                ))}
                              </select>
                            </td>
                            {/* Trường gốc (Column) */}
                            <td className="px-3 py-1 overflow-hidden">
                              <select
                                title="Trường gốc"
                                value={row.columnName}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                  const colName = e.target.value;
                                  const matchingField = tableFieldsForRow.find(f => f.fieldName === colName);
                                  setModalDldcFieldRows(prev => prev.map(r => r.id === row.id ? {
                                    ...r,
                                    columnName: colName,
                                    apiFieldName: colName,
                                    dataType: matchingField?.dataType || r.dataType
                                  } : r));
                                }}
                                className={`${INPUT_CLS} min-w-0`}
                              >
                                <option value="">--</option>
                                {tableFieldsForRow.map(f => (
                                  <option key={f.fieldName} value={f.fieldName}>{f.fieldName}</option>
                                ))}
                              </select>
                            </td>
                            {/* Tên hiển thị */}
                            <td className="px-3 py-1 overflow-hidden">
                              <input
                                type="text"
                                value={row.apiFieldName}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                  setModalDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, apiFieldName: e.target.value } : r))
                                }
                                className={`${INPUT_CLS} min-w-0`}
                              />
                            </td>
                            {/* Kiểu dữ liệu */}
                            <td className="px-3 py-1 overflow-hidden">
                              <select
                                title="Kiểu dữ liệu"
                                value={row.dataType}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                  setModalDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, dataType: e.target.value as FieldDataType } : r))
                                }
                                className={`${INPUT_CLS} min-w-0`}
                              >
                                {FIELD_DATA_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                              </select>
                            </td>
                            {/* Xóa */}
                            <td className="px-3 py-1 text-center overflow-hidden">
                              <RowIconAction label="Xóa" onClick={() => setModalDldcFieldRows(prev => prev.filter(r => r.id !== row.id))}>
                                <Trash2 className="w-4 h-4" />
                              </RowIconAction>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </BaseModal>
      )}
    </div>

    {createPortal(
      <ApprovalRequestModal
        isOpen={showDldcApproval}
        onClose={() => setShowDldcApproval(false)}
        data={{ id: '', code: dldcEntity?.code || '', name: dldcEntity?.name || '', type: 'version' }}
        approvers={approvers}
        form={dldcApprovalForm}
        setForm={setDldcApprovalForm}
        onSubmit={() => { handleModalDldcApply(); setShowDldcApproval(false); setShowDldcModal(false); setDldcApprovalForm({ reviewer: '', note: '' }); }}
      />,
      document.body
    )}
    </>
  );
}
