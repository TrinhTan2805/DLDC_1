import React, { ChangeEvent, useState } from 'react';
import {
  Plus, Search, Filter, X, ChevronDown, Edit2, Trash2, Send,
  FileText, CheckSquare, Tag, Database, Globe, Lock,
  AlertCircle, Check
} from 'lucide-react';
import { MasterDataEntity, MasterDataAttribute, FieldDataType } from '../../categoryTypes';

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
  // wizard data source config
  wizardConfig?: {
    dataSource?: string;
    dldcTable?: string;
    dldcColumns?: string[];
    apiEndpoint?: string;
    apiMethod?: string;
    apiSystem?: string;
    apiManagingUnit?: string;
  };
  onWizardConfigChange?: (update: {
    dldcTable?: string;
    dldcColumns?: string[];
    apiEndpoint?: string;
    apiMethod?: string;
    apiSystem?: string;
    apiManagingUnit?: string;
  }) => void;
}

export function AttributesTab({
  entities,
  attributes,
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
  wizardConfig,
  onWizardConfigChange,
}: AttributesTabProps) {
  const currentEntityId = wizardMode ? wizardEntityId : selectedEntityId;
  const currentEntity = entities.find(e => e.id === currentEntityId);

  // Inline form state (manual wizardMode)
  const [inlineForm, setInlineForm] = useState<Partial<MasterDataAttribute>>(EMPTY_INLINE_FORM);
  const [inlineErrors, setInlineErrors] = useState<{ fieldName?: string; displayName?: string }>({});

  // DLDC wizard state
  const [dldcDatabase, setDldcDatabase] = useState<string>(
    () => getDatabaseForTable(wizardConfig?.dldcTable || '')
  );
  const [useJoin, setUseJoin] = useState(false);
  const [dldcJoins, setDldcJoins] = useState<DldcJoin[]>([]);
  const [dldcFieldRows, setDldcFieldRows] = useState<DldcFieldRow[]>(() => {
    const tableId = wizardConfig?.dldcTable || '';
    if (!tableId) return [];
    return (DLDC_FIELDS[tableId] || []).map((f, i) => ({
      id: `fr-init-${i}`, shared: true, isPK: i === 0,
      tableId, sourceJoinId: null,
      columnName: f.fieldName, apiFieldName: f.fieldName,
      dataType: f.dataType, masked: false,
    }));
  });

  // API wizard state
  const [apiAuthType, setApiAuthType] = useState<'none' | 'bearer' | 'apikey'>('none');
  const [apiBearerToken, setApiBearerToken] = useState('');
  const [apiKeyName, setApiKeyName] = useState('');
  const [apiKeyValue, setApiKeyValue] = useState('');
  const [apiParams, setApiParams] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }]);
  const [apiHeaders, setApiHeaders] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }]);
  const [apiBody, setApiBody] = useState('');

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
      columnName: f.fieldName, apiFieldName: f.fieldName,
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

  // UI Local States for Filters & Pagination
  const [showFilters, setShowFilters] = useState(false);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDataType, setFilterDataType] = useState('all');

  // Reset page number on search or filter change
  React.useEffect(() => {
    setCurrentPageNum(1);
  }, [searchTerm, filterStatus, filterDataType]);

  // Filter Logic
  const filteredAttributes = attributes.filter(attr => {
    const matchesSearch = attr.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          attr.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || attr.status === filterStatus;
    const matchesDataType = filterDataType === 'all' || attr.dataType === filterDataType;
    return matchesSearch && matchesStatus && matchesDataType;
  });

  const paginatedAttributes = filteredAttributes.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);

  const renderPagination = (totalItemsCount: number) => {
    if (totalItemsCount <= 0) return null;
    const totalPages = Math.ceil(totalItemsCount / pageSize);
    const startItem = (currentPageNum - 1) * pageSize + 1;
    const endItem = Math.min(currentPageNum * pageSize, totalItemsCount);

    return (
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white text-[13px] font-medium">
        {/* Left Side: Page Size Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-600 font-normal">Hiển thị</span>
          <select
            aria-label="Select record count"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPageNum(1);
            }}
            className="px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white text-[13px] cursor-pointer font-medium"
            title="Số bản ghi trên trang"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-slate-600 font-normal">bản ghi/trang</span>
        </div>

        {/* Right Side: Page Range and Navigation */}
        <div className="flex items-center gap-4">
          <span className="text-slate-600 font-normal">
            {startItem} - {endItem} / {totalItemsCount}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPageNum(Math.max(1, currentPageNum - 1))}
              disabled={currentPageNum === 1}
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPageNum(page)}
                className={`px-3 py-1.5 border rounded-xl font-medium text-[13px] transition-colors cursor-pointer ${currentPageNum === page
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPageNum(Math.min(totalPages, currentPageNum + 1))}
              disabled={currentPageNum === totalPages}
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Statistics Cards — ẩn trong wizard modal */}
      {!wizardMode && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] text-slate-500">Tổng thuộc tính</span>
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{totalAttributes}</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] text-slate-500">Thuộc tính bắt buộc</span>
              <CheckSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{requiredAttributes}</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] text-slate-500">Thuộc tính duy nhất</span>
              <Tag className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{uniqueAttributes}</div>
          </div>
        </div>
      )}

      {/* Entity Selector (Only if not in wizard) */}
      {!wizardMode && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <label className="block text-[13px] text-slate-700 mb-1.5 font-medium">
            Chọn thực thể dữ liệu chủ <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              title="Chọn thực thể"
              value={selectedEntityId}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedEntityId(e.target.value)}
              className="w-full pl-3 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-[13px] bg-white font-medium appearance-none cursor-pointer"
            >
              {entities.map(entity => (
                <option key={entity.id} value={entity.id}>
                  {entity.code} - {entity.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Search and Action Bar — ẩn trong wizard modal */}
      {!wizardMode && (
        <div className="space-y-3 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="flex-1 w-full flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm trường hoặc tên hiển thị..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 bg-white hover:bg-slate-50/50 font-medium shadow-sm"
                />
              </div>
              <button
                type="button"
                className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 transition-all cursor-pointer active:scale-95 shadow-sm"
                title="Tìm kiếm"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all border cursor-pointer active:scale-95 ${
                  showFilters
                    ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title={showFilters ? "Đóng bộ lọc" : "Bộ lọc nâng cao"}
              >
                {showFilters ? <X className="w-4.5 h-4.5" /> : <Filter className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              {onSaveAndSubmit && !isViewOnly && (
                <button
                  type="button"
                  onClick={onSaveAndSubmit}
                  className="flex-1 md:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[13px] font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm whitespace-nowrap cursor-pointer"
                >
                  Lưu & trình duyệt
                </button>
              )}
              {!isViewOnly && (
                <button
                  type="button"
                  onClick={onAddAttribute}
                  className="flex-1 md:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[13px] font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm whitespace-nowrap cursor-pointer"
                  title="Thêm thuộc tính mới"
                >
                  <Plus className="w-4 h-4" />
                  Thêm thuộc tính
                </button>
              )}
            </div>
          </div>

          {/* Collapsible Filter Panel */}
          {showFilters && (
            <div className="relative p-4 bg-white border border-slate-200 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] before:content-[''] before:absolute before:-top-[7px] before:right-[208px] md:before:right-[auto] md:before:left-[calc(100%-100px)] lg:before:left-[calc(100%-242px)] before:w-3 before:h-3 before:bg-white before:rotate-45 before:border-l before:border-t before:border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-normal text-black uppercase tracking-wider mb-2">Trạng thái</label>
                  <div className="relative">
                    <select
                      value={filterStatus}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value)}
                      className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="approved">Đã duyệt</option>
                      <option value="pending">Chờ duyệt</option>
                      <option value="draft">Bản nháp</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-normal text-black uppercase tracking-wider mb-2">Kiểu dữ liệu</label>
                  <div className="relative">
                    <select
                      value={filterDataType}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterDataType(e.target.value)}
                      className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                    >
                      <option value="all">Tất cả kiểu dữ liệu</option>
                      <option value="string">Chuỗi</option>
                      <option value="number">Số</option>
                      <option value="date">Ngày tháng</option>
                      <option value="boolean">Logic</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {wizardMode ? (
        /* ── WIZARD MODE: 3 modes based on dataSource ── */
        <div className="space-y-5">

          {/* ── Mode: DLDC Sync ── */}
          {dataSource === 'dldc' && (
            <div className="space-y-4">

              {/* Cấu hình nguồn dữ liệu card */}
              <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
                {/* Blue header */}
                <div className="px-5 py-3.5 bg-blue-600 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-white" />
                    <p className="text-[13px] font-semibold text-white">Cấu hình nguồn dữ liệu</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUseJoin(v => !v)}
                    className="flex items-center gap-2 text-white text-[12px] cursor-pointer"
                  >
                    <span>Sử dụng liên kết bảng (Join)</span>
                    <div className={`relative inline-flex h-5 w-9 items-center rounded-full border border-white/40 transition-colors ${useJoin ? 'bg-white/30' : 'bg-blue-500'}`}>
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${useJoin ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </div>
                  </button>
                </div>

                {/* Info row — shown after table selected */}
                {dldcDatabase && wizardConfig?.dldcTable && (
                  <div className="px-5 py-2.5 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <p className="text-[13px] text-blue-700">
                      Kho dữ liệu: <span className="font-medium">{DLDC_DATABASES.find(d => d.id === dldcDatabase)?.label}</span>
                      {' — '}
                      <span className="font-medium">{DLDC_TABLES[dldcDatabase]?.find(t => t.id === wizardConfig?.dldcTable)?.displayName}</span>
                    </p>
                  </div>
                )}

                <div className="p-5 space-y-4">
                  {/* CSDL selector — standalone row */}
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-medium text-slate-600">Cơ sở dữ liệu</label>
                    <div className="relative">
                      <select
                        title="Chọn cơ sở dữ liệu"
                        value={dldcDatabase}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => handleDldcDatabaseChange(e.target.value)}
                        className="w-full pl-3 pr-8 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        <option value="">-- Chọn cơ sở dữ liệu --</option>
                        {DLDC_DATABASES.map(db => (
                          <option key={db.id} value={db.id}>{db.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Primary table — single dropdown */}
                  {dldcDatabase && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-[13px] font-medium text-slate-600">Bảng dữ liệu chính</label>
                        <span className="text-[13px] text-blue-500 font-medium italic">Primary Table</span>
                      </div>
                      <div className="relative">
                        <select
                          title="Chọn bảng dữ liệu chính"
                          value={wizardConfig?.dldcTable || ''}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => handleDldcTableChange(e.target.value)}
                          className="w-full pl-3 pr-8 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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

                  {/* Join tables — shown when useJoin toggled */}
                  {useJoin && (
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <p className="text-[13px] font-semibold text-slate-700">
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
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 text-blue-600 text-[13px] font-medium rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Thêm bảng liên kết
                        </button>
                      </div>

                      {dldcJoins.map((join, idx) => {
                        const joinTableFields = join.tableId ? (DLDC_FIELDS[join.tableId] || []) : [];
                        const primaryFields = wizardConfig?.dldcTable ? (DLDC_FIELDS[wizardConfig.dldcTable] || []) : [];
                        return (
                          <div key={join.id} className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">BẢNG LIÊN KẾT #{idx + 1}</span>
                                <span className="text-[13px] text-slate-500">Alias: {join.alias}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setDldcJoins(prev => prev.filter(j => j.id !== join.id));
                                  setDldcFieldRows(prev => prev.filter(r => r.sourceJoinId !== join.id));
                                }}
                                className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                              >
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
                                    className="w-full pl-3 pr-8 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                      const newTableId = e.target.value;
                                      setDldcFieldRows(prev => {
                                        const withoutOld = prev.filter(r => r.sourceJoinId !== join.id);
                                        if (!newTableId) return withoutOld;
                                        const newRows: DldcFieldRow[] = (DLDC_FIELDS[newTableId] || []).map((f, i) => ({
                                          id: `fr-${join.id}-${i}`, shared: true, isPK: false,
                                          tableId: newTableId, sourceJoinId: join.id,
                                          columnName: f.fieldName, apiFieldName: f.fieldName,
                                          dataType: f.dataType, masked: false,
                                        }));
                                        return [...withoutOld, ...newRows];
                                      });
                                      setDldcJoins(prev => prev.map(j => j.id === join.id ? { ...j, tableId: newTableId, leftField: '', rightField: '' } : j));
                                    }}
                                    className="w-full pl-3 pr-8 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                  >
                                    <option value="">-- Chọn bảng --</option>
                                    {dldcDatabase && (DLDC_TABLES[dldcDatabase] || [])
                                      .filter(t => t.id !== wizardConfig?.dldcTable)
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
                                    className="w-full pl-3 pr-8 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                  >
                                    <option value="">-- {join.alias}.field --</option>
                                    {joinTableFields.map(f => (
                                      <option key={f.fieldName} value={`${join.alias}.${f.fieldName}`}>{join.alias}.{f.fieldName}</option>
                                    ))}
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
                                    className="w-full pl-3 pr-8 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                  >
                                    <option value="">-- {wizardConfig?.dldcTable || 'table'}.field --</option>
                                    {primaryFields.map(f => (
                                      <option key={f.fieldName} value={`${wizardConfig?.dldcTable}.${f.fieldName}`}>{wizardConfig?.dldcTable}.{f.fieldName}</option>
                                    ))}
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

              {/* Field Selection table */}
              {wizardConfig?.dldcTable && (
                <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <p className="text-[13px] font-semibold text-slate-700">Chọn trường dữ liệu chia sẻ (Field Selection)</p>
                      <span className="text-[13px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                        {dldcFieldRows.filter(r => r.shared).length}/{dldcFieldRows.length} trường được chọn
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setDldcFieldRows(prev => [...prev, {
                          id: `fr-manual-${prev.length}`, shared: true, isPK: false,
                          tableId: wizardConfig?.dldcTable || '', sourceJoinId: null,
                          columnName: '', apiFieldName: '', dataType: 'string', masked: false,
                        }]);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 text-blue-600 text-[13px] font-medium rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Thêm trường dữ liệu
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[13px]" style={{ tableLayout: 'fixed' }}>
                      <colgroup>
                        <col style={{ width: '6%' }} />
                        <col style={{ width: '5%' }} />
                        <col style={{ width: '19%' }} />
                        <col style={{ width: '19%' }} />
                        <col style={{ width: '22%' }} />
                        <col style={{ width: '16%' }} />
                        <col style={{ width: '7%' }} />
                        <col style={{ width: '6%' }} />
                      </colgroup>
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                          <th className="px-3 py-3 text-[13px] font-semibold text-slate-500 text-center">Chia sẻ</th>
                          <th className="px-3 py-3 text-[13px] font-semibold text-slate-500 text-center">PK</th>
                          <th className="px-3 py-3 text-[13px] font-semibold text-slate-500">Nguồn dữ liệu (Table)</th>
                          <th className="px-3 py-3 text-[13px] font-semibold text-slate-500">Trường gốc (Column)</th>
                          <th className="px-3 py-3 text-[13px] font-semibold text-slate-500">Tên trường (API Field)</th>
                          <th className="px-3 py-3 text-[13px] font-semibold text-slate-500">Kiểu dữ liệu</th>
                          <th className="px-3 py-3 text-[13px] font-semibold text-slate-500 text-center">Che dấu</th>
                          <th className="px-3 py-3 text-[13px] font-semibold text-slate-500 text-center">Xóa</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {dldcFieldRows.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="px-5 py-8 text-center text-[13px] text-slate-400">
                              Chọn bảng dữ liệu để tải danh sách trường
                            </td>
                          </tr>
                        ) : (
                          dldcFieldRows.map(row => {
                            const allTablesForDb = dldcDatabase ? (DLDC_TABLES[dldcDatabase] || []) : [];
                            const tableFieldsForRow = DLDC_FIELDS[row.tableId] || [];
                            return (
                              <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-3 py-2.5 text-center overflow-hidden">
                                  <input type="checkbox" checked={row.shared}
                                    onChange={() => setDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, shared: !r.shared } : r))}
                                    className="w-4 h-4 rounded text-blue-600 border-slate-300 cursor-pointer" />
                                </td>
                                <td className="px-3 py-2.5 text-center overflow-hidden">
                                  <input type="checkbox" checked={row.isPK}
                                    onChange={() => setDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, isPK: !r.isPK } : r))}
                                    className="w-4 h-4 rounded text-amber-500 border-slate-300 cursor-pointer" />
                                </td>
                                <td className="px-3 py-2.5 overflow-hidden">
                                  <select title="Nguồn dữ liệu" value={row.tableId}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                      setDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, tableId: e.target.value, columnName: '', apiFieldName: '' } : r))
                                    }
                                    className="w-full min-w-0 px-2 py-1.5 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-400/40 focus:border-blue-400"
                                  >
                                    <option value="">--</option>
                                    {allTablesForDb.map(t => <option key={t.id} value={t.id}>{t.id}</option>)}
                                  </select>
                                </td>
                                <td className="px-3 py-2.5 overflow-hidden">
                                  <select title="Trường gốc" value={row.columnName}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                      const fd = tableFieldsForRow.find(f => f.fieldName === e.target.value);
                                      setDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, columnName: e.target.value, apiFieldName: e.target.value, dataType: fd?.dataType || r.dataType } : r));
                                    }}
                                    className="w-full min-w-0 px-2 py-1.5 border border-slate-200 rounded-lg text-[13px] bg-white font-mono focus:outline-none focus:ring-1 focus:ring-blue-400/40 focus:border-blue-400"
                                  >
                                    <option value="">--</option>
                                    {tableFieldsForRow.map(f => <option key={f.fieldName} value={f.fieldName}>{f.fieldName}</option>)}
                                  </select>
                                </td>
                                <td className="px-3 py-2.5 overflow-hidden">
                                  <input type="text" value={row.apiFieldName}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                      setDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, apiFieldName: e.target.value } : r))
                                    }
                                    className="w-full min-w-0 px-2 py-1.5 border border-slate-200 rounded-lg text-[13px] font-mono bg-white focus:outline-none focus:ring-1 focus:ring-blue-400/40 focus:border-blue-400"
                                  />
                                </td>
                                <td className="px-3 py-2.5 overflow-hidden">
                                  <select title="Kiểu dữ liệu" value={row.dataType}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                      setDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, dataType: e.target.value as FieldDataType } : r))
                                    }
                                    className="w-full min-w-0 px-2 py-1.5 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-400/40 focus:border-blue-400"
                                  >
                                    {FIELD_DATA_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                  </select>
                                </td>
                                <td className="px-3 py-2.5 text-center overflow-hidden">
                                  <input type="checkbox" checked={row.masked}
                                    onChange={() => setDldcFieldRows(prev => prev.map(r => r.id === row.id ? { ...r, masked: !r.masked } : r))}
                                    className="w-4 h-4 rounded text-orange-500 border-slate-300 cursor-pointer" />
                                </td>
                                <td className="px-3 py-2.5 text-center overflow-hidden">
                                  <button type="button"
                                    onClick={() => setDldcFieldRows(prev => prev.filter(r => r.id !== row.id))}
                                    className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                  >
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
                  <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex justify-end">
                    <button
                      type="button"
                      disabled={dldcFieldRows.filter(r => r.shared && r.columnName).length === 0}
                      onClick={handleDldcApply}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-[13px] font-medium transition-colors active:scale-95"
                    >
                      <Check className="w-4 h-4" />
                      Áp dụng cấu trúc ({dldcFieldRows.filter(r => r.shared && r.columnName).length} trường)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Mode: API Connection ── */}
          {(dataSource === 'lgsp' || dataSource === 'ndxp') && (
            <div className="space-y-4">
              {/* Banner */}
              <div className="flex items-start gap-3 bg-violet-50 border border-violet-200 rounded-xl p-4">
                <Globe className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[13px] font-semibold text-violet-800">Kết nối API {dataSource === 'lgsp' ? '(NGSP/LGSP)' : '(NDXP)'}</p>
                  <p className="text-[13px] text-violet-600 mt-0.5">Cấu hình endpoint API để đồng bộ dữ liệu tự động vào danh mục.</p>
                </div>
              </div>

              {/* API Config form */}
              <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50">
                  <p className="text-[13px] font-semibold text-slate-700">Thông tin kết nối</p>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[13px] font-medium text-slate-600">Hệ thống cung cấp</label>
                      <input
                        type="text"
                        value={wizardConfig?.apiSystem || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => onWizardConfigChange?.({ ...wizardConfig, apiSystem: e.target.value })}
                        placeholder="VD: Cổng DVC Quốc gia"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[13px] font-medium text-slate-600">Đơn vị quản lý API</label>
                      <input
                        type="text"
                        value={wizardConfig?.apiManagingUnit || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => onWizardConfigChange?.({ ...wizardConfig, apiManagingUnit: e.target.value })}
                        placeholder="VD: Bộ Tư pháp"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-medium text-slate-600">API Endpoint URL <span className="text-red-500">*</span></label>
                    <input
                      type="url"
                      value={wizardConfig?.apiEndpoint || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => onWizardConfigChange?.({ ...wizardConfig, apiEndpoint: e.target.value })}
                      placeholder="https://api.example.gov.vn/v1/data"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[13px] font-medium text-slate-600">Phương thức HTTP</label>
                      <div className="relative">
                        <select
                          title="Phương thức HTTP"
                          value={wizardConfig?.apiMethod || 'GET'}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => onWizardConfigChange?.({ ...wizardConfig, apiMethod: e.target.value })}
                          className="w-full pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-[13px] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                        >
                          <option value="GET">GET</option>
                          <option value="POST">POST</option>
                          <option value="PUT">PUT</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[13px] font-medium text-slate-600">Loại xác thực</label>
                      <div className="relative">
                        <select
                          title="Loại xác thực"
                          value={apiAuthType}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => setApiAuthType(e.target.value as any)}
                          className="w-full pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-[13px] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                        >
                          <option value="none">Không xác thực</option>
                          <option value="bearer">Bearer Token</option>
                          <option value="apikey">API Key</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Auth credentials */}
                  {apiAuthType === 'bearer' && (
                    <div className="space-y-1.5 p-4 bg-violet-50/50 rounded-xl border border-violet-100">
                      <label className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600">
                        <Lock className="w-3.5 h-3.5" /> Bearer Token
                      </label>
                      <input
                        type="password"
                        value={apiBearerToken}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setApiBearerToken(e.target.value)}
                        placeholder="eyJhbGci..."
                        className="w-full px-3 py-2 border border-violet-200 rounded-lg text-[13px] font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-white"
                      />
                    </div>
                  )}
                  {apiAuthType === 'apikey' && (
                    <div className="grid grid-cols-2 gap-3 p-4 bg-violet-50/50 rounded-xl border border-violet-100">
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600">
                          <Lock className="w-3.5 h-3.5" /> Tên tham số
                        </label>
                        <input
                          type="text"
                          value={apiKeyName}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setApiKeyName(e.target.value)}
                          placeholder="X-API-Key"
                          className="w-full px-3 py-2 border border-violet-200 rounded-lg text-[13px] font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[13px] font-medium text-slate-600">Giá trị</label>
                        <input
                          type="password"
                          value={apiKeyValue}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setApiKeyValue(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3 py-2 border border-violet-200 rounded-lg text-[13px] font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Params API */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-[13px] font-medium text-slate-600">Params API</label>
                      <button
                        type="button"
                        onClick={() => setApiParams(prev => [...prev, { key: '', value: '' }])}
                        className="flex items-center gap-1 px-2.5 py-1 border border-slate-200 text-slate-600 text-[13px] rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Thêm tham số
                      </button>
                    </div>
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-[13px]" style={{ tableLayout: 'fixed' }}>
                        <colgroup>
                          <col style={{ width: '44%' }} />
                          <col style={{ width: '50%' }} />
                          <col style={{ width: '6%' }} />
                        </colgroup>
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="px-3 py-2 text-left text-[13px] font-medium text-slate-500">Key</th>
                            <th className="px-3 py-2 text-left text-[13px] font-medium text-slate-500">Value</th>
                            <th className="px-3 py-2" />
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {apiParams.map((p, i) => (
                            <tr key={i} className="hover:bg-slate-50/50">
                              <td className="px-3 py-2">
                                <input
                                  type="text"
                                  value={p.key}
                                  onChange={(e: ChangeEvent<HTMLInputElement>) => setApiParams(prev => prev.map((r, idx) => idx === i ? { ...r, key: e.target.value } : r))}
                                  placeholder="param_name"
                                  className="w-full min-w-0 px-2 py-1.5 border border-slate-200 rounded-lg text-[13px] font-mono focus:outline-none focus:ring-1 focus:ring-violet-400/40 focus:border-violet-400"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="text"
                                  value={p.value}
                                  onChange={(e: ChangeEvent<HTMLInputElement>) => setApiParams(prev => prev.map((r, idx) => idx === i ? { ...r, value: e.target.value } : r))}
                                  placeholder="value"
                                  className="w-full min-w-0 px-2 py-1.5 border border-slate-200 rounded-lg text-[13px] font-mono focus:outline-none focus:ring-1 focus:ring-violet-400/40 focus:border-violet-400"
                                />
                              </td>
                              <td className="px-3 py-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => setApiParams(prev => prev.length === 1 ? [{ key: '', value: '' }] : prev.filter((_, idx) => idx !== i))}
                                  className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Headers API */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-[13px] font-medium text-slate-600">Headers API</label>
                      <button
                        type="button"
                        onClick={() => setApiHeaders(prev => [...prev, { key: '', value: '' }])}
                        className="flex items-center gap-1 px-2.5 py-1 border border-slate-200 text-slate-600 text-[13px] rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Thêm header
                      </button>
                    </div>
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-[13px]" style={{ tableLayout: 'fixed' }}>
                        <colgroup>
                          <col style={{ width: '44%' }} />
                          <col style={{ width: '50%' }} />
                          <col style={{ width: '6%' }} />
                        </colgroup>
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="px-3 py-2 text-left text-[13px] font-medium text-slate-500">Key</th>
                            <th className="px-3 py-2 text-left text-[13px] font-medium text-slate-500">Value</th>
                            <th className="px-3 py-2" />
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {apiHeaders.map((h, i) => (
                            <tr key={i} className="hover:bg-slate-50/50">
                              <td className="px-3 py-2">
                                <input
                                  type="text"
                                  value={h.key}
                                  onChange={(e: ChangeEvent<HTMLInputElement>) => setApiHeaders(prev => prev.map((r, idx) => idx === i ? { ...r, key: e.target.value } : r))}
                                  placeholder="Header-Name"
                                  className="w-full min-w-0 px-2 py-1.5 border border-slate-200 rounded-lg text-[13px] font-mono focus:outline-none focus:ring-1 focus:ring-violet-400/40 focus:border-violet-400"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="text"
                                  value={h.value}
                                  onChange={(e: ChangeEvent<HTMLInputElement>) => setApiHeaders(prev => prev.map((r, idx) => idx === i ? { ...r, value: e.target.value } : r))}
                                  placeholder="value"
                                  className="w-full min-w-0 px-2 py-1.5 border border-slate-200 rounded-lg text-[13px] font-mono focus:outline-none focus:ring-1 focus:ring-violet-400/40 focus:border-violet-400"
                                />
                              </td>
                              <td className="px-3 py-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => setApiHeaders(prev => prev.length === 1 ? [{ key: '', value: '' }] : prev.filter((_, idx) => idx !== i))}
                                  className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Body JSON — chỉ hiện với POST/PUT */}
                  {(wizardConfig?.apiMethod === 'POST' || wizardConfig?.apiMethod === 'PUT') && (
                    <div className="space-y-1.5">
                      <label className="block text-[13px] font-medium text-slate-600">
                        Body (JSON)
                        <span className="ml-2 text-[13px] text-slate-400 font-normal">— áp dụng cho {wizardConfig.apiMethod}</span>
                      </label>
                      <textarea
                        rows={5}
                        value={apiBody}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setApiBody(e.target.value)}
                        placeholder={'{\n  "key": "value"\n}'}
                        spellCheck={false}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 resize-y bg-slate-50"
                      />
                    </div>
                  )}

                  {/* Info note */}
                  <div className="flex items-start gap-2 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-[13px] text-amber-700">Cấu trúc trường dữ liệu sẽ được tự động ánh xạ từ schema của API sau khi kết nối thành công.</p>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => onWizardConfigChange?.({ ...wizardConfig })}
                      className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 text-[13px] font-medium transition-colors active:scale-95"
                    >
                      <Check className="w-4 h-4" />
                      Lưu cấu hình
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Mode: Manual (direct update) ── */}
          {dataSource === 'manual' && (
            <>
              {/* Inline Attribute Form */}
              <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50">
                  <p className="text-[13px] font-semibold text-slate-700">Thêm trường dữ liệu mới</p>
                </div>
            <div className="p-5 space-y-4">
              {/* Row 1: Tên trường */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-medium text-slate-600">
                  Tên trường <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={inlineForm.fieldName || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setInlineForm({ ...inlineForm, fieldName: e.target.value });
                    if (inlineErrors.fieldName) setInlineErrors({ ...inlineErrors, fieldName: undefined });
                  }}
                  placeholder="VD: citizen_id"
                  className={`w-full px-3 py-2 border rounded-lg text-[13px] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${inlineErrors.fieldName ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                />
                {inlineErrors.fieldName && <p className="text-[13px] text-red-500">{inlineErrors.fieldName}</p>}
                <p className="text-[13px] text-slate-400 italic">Tên định danh trong cơ sở dữ liệu (không dấu, chữ thường)</p>
              </div>

              {/* Row 2: Tên hiển thị */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-medium text-slate-600">
                  Tên hiển thị <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={inlineForm.displayName || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setInlineForm({ ...inlineForm, displayName: e.target.value });
                    if (inlineErrors.displayName) setInlineErrors({ ...inlineErrors, displayName: undefined });
                  }}
                  placeholder="VD: Số CCCD"
                  className={`w-full px-3 py-2 border rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${inlineErrors.displayName ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                />
                {inlineErrors.displayName && <p className="text-[13px] text-red-500">{inlineErrors.displayName}</p>}
              </div>

              {/* Row 3: Kiểu dữ liệu + Độ dài */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-slate-600">
                    Kiểu dữ liệu <span className="text-red-500">*</span>
                  </label>
                  <select
                    title="Kiểu dữ liệu"
                    value={inlineForm.dataType || 'string'}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setInlineForm({ ...inlineForm, dataType: e.target.value as FieldDataType })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {FIELD_DATA_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-slate-600">Độ dài tối đa</label>
                  <input
                    type="number"
                    value={inlineForm.length ?? ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setInlineForm({ ...inlineForm, length: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="VD: 255"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Row 4: Ràng buộc checkboxes */}
              <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <label className="block text-[13px] font-medium text-slate-600 mb-1">Cấu hình ràng buộc</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'required', label: 'Bắt buộc', sub: 'Required' },
                    { key: 'unique',   label: 'Duy nhất',  sub: 'Unique' },
                    { key: 'indexed',  label: 'Đánh index', sub: 'Indexed' },
                  ].map(item => (
                    <label key={item.key} className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors group">
                      <input
                        type="checkbox"
                        checked={(inlineForm as any)[item.key] || false}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setInlineForm({ ...inlineForm, [item.key]: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                      />
                      <div>
                        <p className="text-[13px] font-medium text-slate-800 group-hover:text-blue-700 transition-colors">{item.label}</p>
                        <p className="text-[13px] text-slate-400 font-medium">{item.sub}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Row 5: Giá trị mặc định + Quy tắc xác thực */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-slate-600">Giá trị mặc định</label>
                  <input
                    type="text"
                    value={inlineForm.defaultValue || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setInlineForm({ ...inlineForm, defaultValue: e.target.value })}
                    placeholder="Để trống nếu không có"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-slate-600">Quy tắc xác thực</label>
                  <input
                    type="text"
                    value={inlineForm.validationRules || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setInlineForm({ ...inlineForm, validationRules: e.target.value })}
                    placeholder="VD: regex hoặc enum"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Row 6: Mô tả */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-medium text-slate-600">Mô tả ngắn gọn</label>
                <textarea
                  rows={2}
                  value={inlineForm.description || ''}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInlineForm({ ...inlineForm, description: e.target.value })}
                  placeholder="Mô tả mục đích sử dụng của trường này..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>

              {/* Add button */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleInlineAdd}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-[13px] font-medium transition-colors active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Thêm trường
                </button>
              </div>
            </div>
          </div>

          {/* Compact list of added attributes */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <p className="text-[13px] font-semibold text-slate-700">Danh sách trường đã thêm</p>
              <span className="text-[13px] text-slate-500">{attributes.length} trường</span>
            </div>
            {attributes.length === 0 ? (
              <div className="py-8 text-center text-[13px] text-slate-400">Chưa có trường nào được thêm</div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-[13px] font-semibold text-slate-500 whitespace-nowrap">Tên trường</th>
                    <th className="px-4 py-3 text-[13px] font-semibold text-slate-500 whitespace-nowrap">Tên hiển thị</th>
                    <th className="px-4 py-3 text-[13px] font-semibold text-slate-500 whitespace-nowrap">Kiểu DL</th>
                    <th className="px-4 py-3 text-[13px] font-semibold text-slate-500 whitespace-nowrap">Ràng buộc</th>
                    <th className="px-4 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attributes.map(attr => (
                    <tr key={attr.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-4 py-3 text-[13px] font-mono text-slate-900">{attr.fieldName}</td>
                      <td className="px-4 py-3 text-[13px] text-slate-700">{attr.displayName}</td>
                      <td className="px-4 py-3 text-[13px] text-slate-600">{getDataTypeLabel(attr.dataType)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {attr.required && <span className="px-1.5 py-0.5 rounded text-[13px] bg-red-50 text-red-600 font-bold border border-red-100">REQ</span>}
                          {attr.unique   && <span className="px-1.5 py-0.5 rounded text-[13px] bg-purple-50 text-purple-600 font-bold border border-purple-100">UNI</span>}
                          {attr.indexed  && <span className="px-1.5 py-0.5 rounded text-[13px] bg-blue-50 text-blue-600 font-bold border border-blue-100">IDX</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onDeleteAttribute(attr.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                          title="Xóa trường"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between text-[13px] text-slate-700">
            <div>
              <span>Đang quản lý thuộc tính của thực thể: </span>
              <span className="font-semibold text-slate-900">{currentEntity?.name || 'Chưa chọn thực thể'}</span>
            </div>
          </div>

          {/* Attributes Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-100">
                  <tr>
                    <th className="w-12 px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        disabled={isViewOnly}
                        onChange={(e: any) => onSelectAll(e.target.checked)}
                        checked={attributes.length > 0 && selectedAttributes.length === attributes.length}
                        className={`rounded border-slate-300 ${isViewOnly ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        title="Chọn tất cả"
                      />
                    </th>
                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Tên trường</th>
                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Tên hiển thị</th>
                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Kiểu dữ liệu</th>
                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Ràng buộc</th>
                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center">Trạng thái</th>
                    {!isViewOnly && <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-right w-48">Thao tác</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {paginatedAttributes.length > 0 ? (
                    paginatedAttributes.map((attr) => {
                      const isLocked = attr.status === 'approved' || attr.status === 'pending';
                      return (
                        <tr key={attr.id} className="hover:bg-slate-50/50 transition-all group border-b border-slate-100">
                          <td className="px-6 py-4 text-center">
                            <input
                              type="checkbox"
                              disabled={isViewOnly}
                              checked={selectedAttributes.includes(attr.id)}
                              onChange={() => onSelectAttribute(attr.id)}
                              className={`rounded border-slate-300 ${isViewOnly ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                              title={`Chọn ${attr.fieldName}`}
                            />
                          </td>
                          <td className="px-6 py-4 text-[13px] text-slate-900 font-mono">{attr.fieldName}</td>
                          <td className="px-6 py-4 text-[13px] text-slate-900 font-medium">{attr.displayName}</td>
                          <td className="px-6 py-4 text-[13px] text-slate-700 font-medium">{getDataTypeLabel(attr.dataType)}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-1.5 flex-wrap">
                              {attr.required && <span className="px-2 py-0.5 rounded text-[13px] bg-red-50 text-red-600 font-bold border border-red-100">REQ</span>}
                              {attr.unique   && <span className="px-2 py-0.5 rounded text-[13px] bg-purple-50 text-purple-600 font-bold border border-purple-100">UNI</span>}
                              {attr.indexed  && <span className="px-2 py-0.5 rounded text-[13px] bg-blue-50 text-blue-600 font-bold border border-blue-100">IDX</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${
                              attr.status === 'approved' ? 'bg-green-50 text-green-700 border-green-100' :
                              attr.status === 'pending'  ? 'bg-orange-50 text-orange-700 border-orange-100' :
                              'bg-slate-50 text-slate-700 border-slate-200'
                            }`}>
                              {attr.status === 'approved' ? 'Đã duyệt' : attr.status === 'pending' ? 'Chờ duyệt' : 'Bản nháp'}
                            </span>
                          </td>
                          {!isViewOnly && (
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-all">
                                <button
                                  onClick={() => onSubmitAttribute(attr.id)}
                                  disabled={isLocked}
                                  className={`p-1.5 rounded-lg transition-colors ${isLocked ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer'}`}
                                  title={attr.status === 'approved' ? 'Đã duyệt' : attr.status === 'pending' ? 'Đang chờ duyệt' : 'Trình duyệt'}
                                >
                                  <Send className="w-4 h-4" />
                                </button>
                                <div className="w-px h-4 bg-slate-200 mx-1" />
                                <button
                                  onClick={() => onEditAttribute(attr)}
                                  disabled={isLocked}
                                  className={`p-1.5 rounded-lg transition-colors ${isLocked ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-amber-600 hover:bg-amber-50 cursor-pointer'}`}
                                  title="Sửa"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => onDeleteAttribute(attr.id)}
                                  disabled={isLocked}
                                  className={`p-1.5 rounded-lg transition-colors ${isLocked ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-red-600 hover:bg-red-50 cursor-pointer'}`}
                                  title="Xóa"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={isViewOnly ? 6 : 7} className="px-6 py-8 text-center text-[13px] text-slate-500">
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
    </div>
  );
}
