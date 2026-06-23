import React, { ChangeEvent, useState } from 'react';
import {
  Plus, Search, Filter, X, ChevronDown, Edit2, Trash2, Send,
  FileText, CheckSquare, Tag, Database, Globe, Lock, ChevronRight,
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
  const [dldcSelectedFields, setDldcSelectedFields] = useState<string[]>(
    () => wizardConfig?.dldcColumns || []
  );

  // API wizard state
  const [apiAuthType, setApiAuthType] = useState<'none' | 'bearer' | 'apikey'>('none');
  const [apiBearerToken, setApiBearerToken] = useState('');
  const [apiKeyName, setApiKeyName] = useState('');
  const [apiKeyValue, setApiKeyValue] = useState('');

  const dataSource = wizardConfig?.dataSource || 'manual';

  const handleDldcDatabaseChange = (dbId: string) => {
    setDldcDatabase(dbId);
    setDldcSelectedFields([]);
    onWizardConfigChange?.({ dldcTable: '', dldcColumns: [] });
  };

  const handleDldcTableChange = (tableId: string) => {
    setDldcSelectedFields([]);
    onWizardConfigChange?.({ dldcTable: tableId, dldcColumns: [] });
  };

  const handleDldcFieldToggle = (fieldName: string) => {
    const next = dldcSelectedFields.includes(fieldName)
      ? dldcSelectedFields.filter(f => f !== fieldName)
      : [...dldcSelectedFields, fieldName];
    setDldcSelectedFields(next);
    onWizardConfigChange?.({ dldcTable: wizardConfig?.dldcTable, dldcColumns: next });
  };

  const handleDldcSelectAll = () => {
    const allFields = DLDC_FIELDS[wizardConfig?.dldcTable || '']?.map(f => f.fieldName) || [];
    setDldcSelectedFields(allFields);
    onWizardConfigChange?.({ dldcTable: wizardConfig?.dldcTable, dldcColumns: allFields });
  };

  const handleDldcDeselectAll = () => {
    setDldcSelectedFields([]);
    onWizardConfigChange?.({ dldcTable: wizardConfig?.dldcTable, dldcColumns: [] });
  };

  const handleDldcImport = () => {
    const tableId = wizardConfig?.dldcTable || '';
    const fields = DLDC_FIELDS[tableId] || [];
    dldcSelectedFields.forEach(fname => {
      const field = fields.find(f => f.fieldName === fname);
      if (!field) return;
      onAddAttributeInline?.({
        fieldName: field.fieldName,
        displayName: field.displayName,
        dataType: field.dataType,
        required: false,
        unique: false,
        indexed: false,
        sourceType: 'reference',
        sourceTable: tableId,
        sourceField: field.fieldName,
      });
    });
    setDldcSelectedFields([]);
    onWizardConfigChange?.({ dldcTable: wizardConfig?.dldcTable, dldcColumns: [] });
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
              {/* Banner */}
              <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <Database className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[13px] font-semibold text-blue-800">Đồng bộ từ Kho DLDC</p>
                  <p className="text-[12px] text-blue-600 mt-0.5">Chọn cơ sở dữ liệu, bảng và các trường cần đồng bộ vào cấu trúc danh mục.</p>
                </div>
              </div>

              {/* Step 1: Database */}
              <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold">1</span>
                  <p className="text-[13px] font-semibold text-slate-700">Chọn cơ sở dữ liệu</p>
                </div>
                <div className="p-4">
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
              </div>

              {/* Step 2: Table — shown when database selected */}
              {dldcDatabase && (
                <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
                  <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold">2</span>
                    <p className="text-[13px] font-semibold text-slate-700">Chọn bảng dữ liệu</p>
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-2">
                    {(DLDC_TABLES[dldcDatabase] || []).map(table => (
                      <button
                        key={table.id}
                        type="button"
                        onClick={() => handleDldcTableChange(table.id)}
                        className={`flex items-center gap-2.5 px-3.5 py-3 rounded-lg border text-left transition-all text-[13px] ${
                          wizardConfig?.dldcTable === table.id
                            ? 'border-blue-500 bg-blue-50 text-blue-800 font-semibold'
                            : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-slate-700'
                        }`}
                      >
                        {wizardConfig?.dldcTable === table.id
                          ? <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          : <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        }
                        <div>
                          <p className="font-medium">{table.displayName}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{table.id}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Fields — shown when table selected */}
              {wizardConfig?.dldcTable && (
                <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
                  <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold">3</span>
                      <p className="text-[13px] font-semibold text-slate-700">Chọn trường dữ liệu</p>
                      <span className="text-[12px] text-slate-400">({dldcSelectedFields.length} đã chọn)</span>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={handleDldcSelectAll} className="text-[12px] text-blue-600 hover:text-blue-700 px-2 py-1 hover:bg-blue-50 rounded transition-colors">Chọn tất cả</button>
                      <button type="button" onClick={handleDldcDeselectAll} className="text-[12px] text-slate-500 hover:text-slate-700 px-2 py-1 hover:bg-slate-100 rounded transition-colors">Bỏ chọn</button>
                    </div>
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-2 max-h-56 overflow-y-auto">
                    {(DLDC_FIELDS[wizardConfig.dldcTable] || []).map(field => (
                      <label
                        key={field.fieldName}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors group"
                      >
                        <input
                          type="checkbox"
                          checked={dldcSelectedFields.includes(field.fieldName)}
                          onChange={() => handleDldcFieldToggle(field.fieldName)}
                          className="w-4 h-4 rounded text-blue-600 border-slate-300"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-slate-800 truncate">{field.displayName}</p>
                          <p className="text-[11px] text-slate-400 font-mono truncate">{field.fieldName}</p>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium flex-shrink-0">{field.dataType}</span>
                      </label>
                    ))}
                  </div>
                  <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex justify-end">
                    <button
                      type="button"
                      disabled={dldcSelectedFields.length === 0}
                      onClick={handleDldcImport}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-[13px] font-medium transition-colors active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      Nhập vào cấu trúc ({dldcSelectedFields.length} trường)
                    </button>
                  </div>
                </div>
              )}

              {/* Compact list of imported attributes */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-slate-700">Trường đã nhập vào cấu trúc</p>
                  <span className="text-[12px] text-slate-500">{attributes.length} trường</span>
                </div>
                {attributes.length === 0 ? (
                  <div className="py-8 text-center text-[13px] text-slate-400">Chưa có trường nào được nhập</div>
                ) : (
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-3 text-[12px] font-semibold text-slate-500">Tên trường</th>
                        <th className="px-4 py-3 text-[12px] font-semibold text-slate-500">Tên hiển thị</th>
                        <th className="px-4 py-3 text-[12px] font-semibold text-slate-500">Kiểu DL</th>
                        <th className="px-4 py-3 text-[12px] font-semibold text-slate-500">Bảng nguồn</th>
                        <th className="px-4 py-3 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {attributes.map(attr => (
                        <tr key={attr.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-4 py-3 text-[13px] font-mono text-slate-900">{attr.fieldName}</td>
                          <td className="px-4 py-3 text-[13px] text-slate-700">{attr.displayName}</td>
                          <td className="px-4 py-3 text-[13px] text-slate-600">{getDataTypeLabel(attr.dataType)}</td>
                          <td className="px-4 py-3 text-[11px] font-mono text-slate-400">{attr.sourceTable || '—'}</td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={() => onDeleteAttribute(attr.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100" title="Xóa">
                              <Trash2 className="w-3.5 h-3.5" />
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

          {/* ── Mode: API Connection ── */}
          {(dataSource === 'lgsp' || dataSource === 'ndxp') && (
            <div className="space-y-4">
              {/* Banner */}
              <div className="flex items-start gap-3 bg-violet-50 border border-violet-200 rounded-xl p-4">
                <Globe className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[13px] font-semibold text-violet-800">Kết nối API {dataSource === 'lgsp' ? '(NGSP/LGSP)' : '(NDXP)'}</p>
                  <p className="text-[12px] text-violet-600 mt-0.5">Cấu hình endpoint API để đồng bộ dữ liệu tự động vào danh mục.</p>
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
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500">Hệ thống cung cấp</label>
                      <input
                        type="text"
                        value={wizardConfig?.apiSystem || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => onWizardConfigChange?.({ ...wizardConfig, apiSystem: e.target.value })}
                        placeholder="VD: Cổng DVC Quốc gia"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500">Đơn vị quản lý API</label>
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
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500">API Endpoint URL <span className="text-red-500">*</span></label>
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
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500">Phương thức HTTP</label>
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
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500">Loại xác thực</label>
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
                      <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-500">
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
                        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-500">
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
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500">Giá trị</label>
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

                  {/* Info note */}
                  <div className="flex items-start gap-2 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-[12px] text-amber-700">Cấu trúc trường dữ liệu sẽ được tự động ánh xạ từ schema của API sau khi kết nối thành công.</p>
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
                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500">
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
                {inlineErrors.fieldName && <p className="text-[11px] text-red-500">{inlineErrors.fieldName}</p>}
                <p className="text-[11px] text-slate-400 italic">Tên định danh trong cơ sở dữ liệu (không dấu, chữ thường)</p>
              </div>

              {/* Row 2: Tên hiển thị */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500">
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
                {inlineErrors.displayName && <p className="text-[11px] text-red-500">{inlineErrors.displayName}</p>}
              </div>

              {/* Row 3: Kiểu dữ liệu + Độ dài */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500">
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
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500">Độ dài tối đa</label>
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
                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">Cấu hình ràng buộc</label>
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
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{item.sub}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Row 5: Giá trị mặc định + Quy tắc xác thực */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500">Giá trị mặc định</label>
                  <input
                    type="text"
                    value={inlineForm.defaultValue || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setInlineForm({ ...inlineForm, defaultValue: e.target.value })}
                    placeholder="Để trống nếu không có"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500">Quy tắc xác thực</label>
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
                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500">Mô tả ngắn gọn</label>
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
              <span className="text-[12px] text-slate-500">{attributes.length} trường</span>
            </div>
            {attributes.length === 0 ? (
              <div className="py-8 text-center text-[13px] text-slate-400">Chưa có trường nào được thêm</div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-[12px] font-semibold text-slate-500 whitespace-nowrap">Tên trường</th>
                    <th className="px-4 py-3 text-[12px] font-semibold text-slate-500 whitespace-nowrap">Tên hiển thị</th>
                    <th className="px-4 py-3 text-[12px] font-semibold text-slate-500 whitespace-nowrap">Kiểu DL</th>
                    <th className="px-4 py-3 text-[12px] font-semibold text-slate-500 whitespace-nowrap">Ràng buộc</th>
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
                          {attr.required && <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-50 text-red-600 font-bold border border-red-100">REQ</span>}
                          {attr.unique   && <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-50 text-purple-600 font-bold border border-purple-100">UNI</span>}
                          {attr.indexed  && <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-600 font-bold border border-blue-100">IDX</span>}
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
                              {attr.required && <span className="px-2 py-0.5 rounded text-[10px] bg-red-50 text-red-600 font-bold border border-red-100">REQ</span>}
                              {attr.unique   && <span className="px-2 py-0.5 rounded text-[10px] bg-purple-50 text-purple-600 font-bold border border-purple-100">UNI</span>}
                              {attr.indexed  && <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-600 font-bold border border-blue-100">IDX</span>}
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
