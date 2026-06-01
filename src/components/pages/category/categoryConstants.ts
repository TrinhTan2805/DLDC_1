import { MasterDataEntity, DataType, ScopeType, LifecycleStatus, ApprovalType, ApprovalStatus } from './categoryTypes';

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
    version: 1
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
    version: 1
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
    version: 1
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
    version: 1
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
    version: 1
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
    version: 1
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
    version: 1
  },
  {
    id: '8',
    code: 'DM-GTTT',
    name: 'Dữ liệu Danh mục mã giấy tờ tùy thân',
    dataType: 'reference',
    managingAgency: 'Bộ Công an',
    scope: 'national',
    description: 'Danh mục các loại giấy tờ tùy thân (CCCD, CMND, Hộ chiếu...)',
    lifecycleStatus: 'draft',
    createdDate: '20/12/2024',
    updatedDate: '20/12/2024',
    createdBy: 'Hệ thống',
    version: 1
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

export const lifecycleLabels: Record<LifecycleStatus, { label: string; color: string }> = {
  active: { label: 'Hiệu lực', color: 'bg-green-100 text-green-700' },
  draft: { label: 'Đang soạn thảo', color: 'bg-yellow-100 text-yellow-700' },
  inactive: { label: 'Ngừng sử dụng', color: 'bg-red-100 text-red-700' },
  archived: { label: 'Đã lưu trữ', color: 'bg-slate-100 text-slate-700' },
  pending_approval: { label: 'Chờ phê duyệt', color: 'bg-orange-100 text-orange-700' },
  pending_expiration: { label: 'Chờ hết hiệu lực', color: 'bg-purple-100 text-purple-700' }
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
  rejected: { label: 'Đã từ chối', color: 'bg-red-100 text-red-700' },
  partial: { label: 'Duyệt một phần', color: 'bg-blue-100 text-blue-700' }
};

export const approvers = [
  { id: '1', name: 'Trần Thị B', position: 'Trưởng phòng Quản lý dữ liệu', department: 'Cục CNTT' },
  { id: '2', name: 'Nguyễn Văn D', position: 'Phó Cục trưởng', department: 'Cục CNTT' },
  { id: '3', name: 'Lê Thị E', position: 'Trưởng phòng Pháp chế', department: 'Vụ Pháp luật' },
  { id: '4', name: 'Phạm Văn F', position: 'Cục trưởng', department: 'Cục CNTT' },
];
