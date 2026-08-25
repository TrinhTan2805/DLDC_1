import { MasterDataEntity, DataType, ScopeType, CategoryType, LifecycleStatus, ApprovalType, ApprovalStatus, MasterDataAttribute } from './categoryTypes';

export const defaultEntities: MasterDataEntity[] = [
  {
    id: '1',
    code: 'DM-GIOITINH',
    name: 'Dữ liệu Danh mục giới tính',
    dataType: 'reference',
    managingAgency: 'Bộ Tư pháp',
    scope: 'national',
    description: 'Danh mục giới tính chuẩn quốc gia',
    lifecycleStatus: 'active',
    createdDate: '20/12/2024',
    updatedDate: '20/12/2024',
    createdBy: 'Hệ thống',
    version: 1,
    dataSource: 'dldc',
    databaseSystem: 'Cơ sở dữ liệu Hộ tịch'
  },
  {
    id: '2',
    code: 'DM-DANTOC',
    name: 'Dữ liệu Danh mục và mã các dân tộc',
    dataType: 'reference',
    managingAgency: 'Ủy ban Dân tộc',
    scope: 'national',
    description: 'Danh mục các dân tộc tại Việt Nam',
    lifecycleStatus: 'active',
    createdDate: '20/12/2024',
    updatedDate: '20/12/2024',
    createdBy: 'Hệ thống',
    version: 1,
    dataSource: 'manual',
    databaseSystem: 'Hệ thống Quản lý thông tin Dân tộc'
  },
  {
    id: '3',
    code: 'DM-QUOCGIA',
    name: 'Dữ liệu Danh mục và mã Quốc gia, Quốc tịch',
    dataType: 'reference',
    managingAgency: 'Bộ Ngoại giao',
    scope: 'national',
    description: 'Danh mục các quốc gia và vùng lãnh thổ',
    lifecycleStatus: 'pending_approval',
    createdDate: '20/12/2024',
    updatedDate: '20/12/2024',
    createdBy: 'Hệ thống',
    version: 1,
    dataSource: 'dldc',
    databaseSystem: 'Cơ sở dữ liệu Quốc tịch / Hộ tịch'
  },
  {
    id: '4',
    code: 'DM-TONGIAO',
    name: 'Dữ liệu Danh mục và mã các Tôn giáo',
    dataType: 'reference',
    managingAgency: 'Ban Tôn giáo Chính phủ',
    scope: 'national',
    description: 'Danh mục các tôn giáo được công nhận tại Việt Nam',
    lifecycleStatus: 'pending_approval',
    createdDate: '20/12/2024',
    updatedDate: '20/12/2024',
    createdBy: 'Hệ thống',
    version: 1,
    dataSource: 'manual',
    databaseSystem: 'Hệ thống Quản lý Tôn giáo'
  },
  {
    id: '5',
    code: 'DM-COQUAN',
    name: 'Dữ liệu Danh mục cơ quan',
    dataType: 'reference',
    managingAgency: 'Bộ Nội vụ',
    scope: 'national',
    description: 'Danh sách các cơ quan nhà nước, bộ, ngành, sở, ban',
    lifecycleStatus: 'pending_approval',
    createdDate: '20/12/2024',
    updatedDate: '20/12/2024',
    createdBy: 'Hệ thống',
    version: 1,
    dataSource: 'manual',
    databaseSystem: 'Hệ thống Quản lý Cơ quan hành chính'
  },
  {
    id: '6',
    code: 'DM-HC',
    name: 'Dữ liệu Danh mục đơn vị hành chính',
    dataType: 'reference',
    managingAgency: 'Bộ Nội vụ',
    scope: 'national',
    description: 'Danh mục 63 tỉnh/thành phố, quận/huyện, phường/xã của Việt Nam',
    lifecycleStatus: 'draft',
    createdDate: '20/12/2024',
    updatedDate: '20/12/2024',
    createdBy: 'Hệ thống',
    version: 1,
    dataSource: 'manual',
    databaseSystem: 'Cơ sở dữ liệu Đơn vị hành chính'
  },
  {
    id: '7',
    code: 'DM-QUANHEGD',
    name: 'Dữ liệu Danh mục và mã mối quan hệ trong gia đình',
    dataType: 'reference',
    managingAgency: 'Bộ Tư pháp',
    scope: 'national',
    description: 'Danh mục mối quan hệ gia đình (Cha, mẹ, vợ, chồng, con...)',
    lifecycleStatus: 'draft',
    createdDate: '20/12/2024',
    updatedDate: '20/12/2024',
    createdBy: 'Hệ thống',
    version: 1,
    dataSource: 'manual',
    databaseSystem: 'Cơ sở dữ liệu Hộ tịch điện tử'
  },
  {
    id: '11',
    code: 'DM-HONNHAN',
    name: 'Dữ liệu Danh mục tình trạng hôn nhân',
    dataType: 'reference',
    managingAgency: 'Bộ Tư pháp',
    scope: 'national',
    description: 'Danh mục các tình trạng hôn nhân (Độc thân, Đã kết hôn, Ly hôn...)',
    lifecycleStatus: 'inactive',
    createdDate: '10/08/2023',
    updatedDate: '15/03/2025',
    effectiveDate: '01/09/2023',
    createdBy: 'Hệ thống',
    version: 2,
    dataSource: 'manual',
    databaseSystem: 'Cơ sở dữ liệu Hộ tịch điện tử'
  },
  {
    id: '9',
    code: 'DM-NGHENGHIEP',
    name: 'Dữ liệu Danh mục nghề nghiệp',
    dataType: 'reference',
    managingAgency: 'Bộ Lao động - Thương binh và Xã hội',
    scope: 'national',
    description: 'Danh mục nghề nghiệp theo phân loại quốc gia',
    lifecycleStatus: 'approved',
    createdDate: '15/11/2024',
    updatedDate: '10/01/2025',
    createdBy: 'Hệ thống',
    version: 2,
    dataSource: 'manual',
    databaseSystem: 'Hệ thống Quản lý lao động việc làm'
  },
  {
    id: '10',
    code: 'DM-TRINHDO',
    name: 'Dữ liệu Danh mục trình độ học vấn',
    dataType: 'reference',
    managingAgency: 'Bộ Giáo dục và Đào tạo',
    scope: 'national',
    description: 'Danh mục các cấp trình độ học vấn và bằng cấp chuyên môn',
    lifecycleStatus: 'rejected',
    createdDate: '01/11/2024',
    updatedDate: '05/01/2025',
    createdBy: 'Hệ thống',
    version: 1,
    dataSource: 'manual',
    databaseSystem: 'Hệ thống Quản lý giáo dục quốc dân'
  }
];

export const dataTypeLabels: Record<DataType, string> = {
  standard: 'Dữ liệu chuẩn',
  reference: 'Dữ liệu tham chiếu',
  transactional: 'Dữ liệu giao dịch'
};

export const scopeLabels: Record<ScopeType, string> = {
  national: 'Cấp quốc gia',
  ministry: 'Cấp bộ',
  provincial: 'Cấp tỉnh/thành',
  internal: 'Nội bộ'
};

export const categoryTypeLabels: Record<CategoryType, string> = {
  shared_ttdlqg: 'Danh mục dùng chung từ TTDLQG',
  business: 'Danh mục nghiệp vụ',
  aggregated_decision: 'Danh mục tổng hợp theo quyết định'
};

export const lifecycleLabels: Record<LifecycleStatus, { label: string; color: string }> = {
  active: { label: 'Hiệu lực', color: 'bg-green-100 text-green-700' },
  draft: { label: 'Đang soạn thảo', color: 'bg-yellow-100 text-yellow-700' },
  inactive: { label: 'Hết hiệu lực', color: 'bg-red-100 text-red-700' },
  archived: { label: 'Đã lưu trữ', color: 'bg-slate-100 text-slate-700' },
  pending_approval: { label: 'Chờ phê duyệt', color: 'bg-orange-100 text-orange-700' },
  pending_expiration: { label: 'Chờ hết hiệu lực', color: 'bg-purple-100 text-purple-700' },
  approved: { label: 'Đã phê duyệt', color: 'bg-blue-100 text-blue-700' },
  rejected: { label: 'Từ chối', color: 'bg-red-100 text-red-700' }
};

export const approvalTypeLabels: Record<ApprovalType, string> = {
  category: 'Phê duyệt danh mục',
  structure: 'Phê duyệt cấu trúc',
  version: 'Phê duyệt phiên bản',
  relationship: 'Phê duyệt quan hệ',
  expire: 'Phê duyệt hết hiệu lực'
};

export const approvalStatusLabels: Record<ApprovalStatus, { label: string; color: string }> = {
  pending: { label: 'Chờ phê duyệt', color: 'bg-orange-100 text-orange-700' },
  approved: { label: 'Đã phê duyệt', color: 'bg-green-100 text-green-700' },
  rejected: { label: 'Từ chối', color: 'bg-red-100 text-red-700' },
  partial: { label: 'Duyệt một phần', color: 'bg-blue-100 text-blue-700' }
};

export const approvers = [
  { id: '1', name: 'Trần Thị B', position: 'Trưởng phòng Quản lý dữ liệu', department: 'Cục CNTT' },
  { id: '2', name: 'Nguyễn Văn D', position: 'Phó Cục trưởng', department: 'Cục CNTT' },
  { id: '3', name: 'Lê Thị E', position: 'Trưởng phòng Pháp chế', department: 'Vụ Pháp luật' },
  { id: '4', name: 'Phạm Văn F', position: 'Cục trưởng', department: 'Cục CNTT' },
];

export const mockAttributesByEntity: Record<string, MasterDataAttribute[]> = {
  '1': [ // DM-GIOITINH - DLDC
    {
      id: 'a-gt-1',
      fieldName: 'ma_gioi_tinh',
      displayName: 'Mã giới tính',
      dataType: 'string',
      required: true,
      unique: true,
      indexed: true,
      length: 10,
      description: 'Mã giới tính (M, F, U...)',
      defaultValue: '',
      version: 1,
      status: 'approved',
      createdDate: '01/01/2024',
      sourceTable: 'tbl_gioi_tinh',
      sourceField: 'ma_gt',
      sourceKey: 'PRI',
      masked: false
    },
    {
      id: 'a-gt-2',
      fieldName: 'ten_gioi_tinh',
      displayName: 'Tên giới tính',
      dataType: 'string',
      required: true,
      unique: false,
      indexed: false,
      length: 50,
      description: 'Tên giới tính (Nam, Nữ, Chưa xác định)',
      defaultValue: '',
      version: 1,
      status: 'approved',
      createdDate: '01/01/2024',
      sourceTable: 'tbl_gioi_tinh',
      sourceField: 'ten_gt',
      sourceKey: '',
      masked: false
    },
    {
      id: 'a-gt-3',
      fieldName: 'ghi_chu',
      displayName: 'Ghi chú',
      dataType: 'string',
      required: false,
      unique: false,
      indexed: false,
      length: 255,
      description: 'Ghi chú bổ sung',
      defaultValue: '',
      version: 1,
      status: 'draft',
      createdDate: '01/01/2024',
      sourceTable: 'tbl_gioi_tinh',
      sourceField: 'mo_ta',
      sourceKey: '',
      masked: false
    },
    {
      id: 'a-gt-4',
      fieldName: 'so_dinh_danh_ca_nhan',
      displayName: 'Số định danh cá nhân',
      dataType: 'string',
      required: false,
      unique: false,
      indexed: false,
      length: 12,
      description: 'Số định danh cá nhân, tham chiếu (join) từ dữ liệu khai sinh',
      defaultValue: '',
      version: 1,
      status: 'approved',
      createdDate: '01/01/2024',
      sourceTable: 'tbl_khaisinh',
      sourceField: 'so_dinh_danh',
      sourceKey: '',
      masked: false
    }
  ],
  '2': [ // DM-DANTOC - Manual
    {
      id: 'a-dt-1',
      fieldName: 'ma_dan_toc',
      displayName: 'Mã dân tộc',
      dataType: 'string',
      required: true,
      unique: true,
      indexed: true,
      length: 10,
      description: 'Mã dân tộc (Kinh, Tày, Nùng...)',
      defaultValue: '',
      version: 1,
      status: 'approved',
      createdDate: '01/01/2024'
    },
    {
      id: 'a-dt-2',
      fieldName: 'ten_dan_toc',
      displayName: 'Tên dân tộc',
      dataType: 'string',
      required: true,
      unique: false,
      indexed: false,
      length: 100,
      description: 'Tên gọi chính thức của dân tộc',
      defaultValue: '',
      version: 1,
      status: 'approved',
      createdDate: '01/01/2024'
    },
    {
      id: 'a-dt-3',
      fieldName: 'ten_goi_khac',
      displayName: 'Tên gọi khác',
      dataType: 'string',
      required: false,
      unique: false,
      indexed: false,
      length: 255,
      description: 'Các tên gọi khác của dân tộc nếu có',
      defaultValue: '',
      version: 1,
      status: 'draft',
      createdDate: '01/01/2024'
    }
  ],
  '3': [ // DM-QUOCGIA - API (lgsp/ndxp)
    {
      id: 'a-qg-1',
      fieldName: 'country_code',
      displayName: 'Mã quốc gia',
      dataType: 'string',
      required: true,
      unique: true,
      indexed: true,
      length: 3,
      description: 'Mã quốc gia theo chuẩn ISO (VN, US, JP...)',
      defaultValue: '',
      version: 1,
      status: 'approved',
      createdDate: '01/01/2024',
      jsonPath: 'data.countries[*].code',
      masked: false
    },
    {
      id: 'a-qg-2',
      fieldName: 'country_name',
      displayName: 'Tên quốc gia',
      dataType: 'string',
      required: true,
      unique: false,
      indexed: true,
      length: 100,
      description: 'Tên tiếng Việt của quốc gia',
      defaultValue: '',
      version: 1,
      status: 'approved',
      createdDate: '01/01/2024',
      jsonPath: 'data.countries[*].name',
      masked: false
    },
    {
      id: 'a-qg-3',
      fieldName: 'phone_code',
      displayName: 'Mã vùng điện thoại',
      dataType: 'string',
      required: false,
      unique: false,
      indexed: false,
      length: 10,
      description: 'Mã vùng điện thoại quốc tế (+84, +1...)',
      defaultValue: '',
      version: 1,
      status: 'pending',
      createdDate: '01/01/2024',
      jsonPath: 'data.countries[*].phoneCode',
      masked: false
    },
    {
      id: 'a-qg-4',
      fieldName: 'access_key',
      displayName: 'Mã truy cập bí mật',
      dataType: 'string',
      required: false,
      unique: false,
      indexed: false,
      length: 50,
      description: 'Mã bảo mật đi kèm bản ghi',
      defaultValue: '',
      version: 1,
      status: 'draft',
      createdDate: '01/01/2024',
      jsonPath: 'data.countries[*].secretKey',
      masked: true
    }
  ]
};
