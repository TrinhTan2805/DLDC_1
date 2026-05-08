export interface TargetDatabase {
  id: string;
  name: string;
  type: string;
  host: string;
  port: string;
  username: string;
  schema: string;
  note: string;
  status: 'active' | 'inactive';
  lastUpdated: string;
}

export const initialTargetDatabases: TargetDatabase[] = [
  {
    id: '1',
    name: 'CSDL Kho dữ liệu dùng chung',
    type: 'PostgreSQL',
    host: '10.15.20.45',
    port: '5432',
    username: 'dldc_admin',
    schema: 'public',
    note: 'Dùng cho lưu trữ dữ liệu sau xử lý',
    status: 'active',
    lastUpdated: '08/05/2026 14:20'
  },
  {
    id: '2',
    name: 'CSDL Phân tích số liệu',
    type: 'Oracle',
    host: '10.15.20.46',
    port: '1521',
    username: 'analytics_user',
    schema: 'ANALYTICS',
    note: 'Phục vụ BI và báo cáo',
    status: 'active',
    lastUpdated: '08/05/2026 09:15'
  },
  {
    id: '3',
    name: 'CSDL Lưu trữ lịch sử',
    type: 'SQL Server',
    host: '10.15.20.47',
    port: '1433',
    username: 'archive_sa',
    schema: 'dbo',
    note: 'Lưu trữ dữ liệu cũ',
    status: 'inactive',
    lastUpdated: '01/05/2026 10:00'
  }
];

export const mockTables = [
  { name: 'DM_DAN_TOC', description: 'Danh mục dân tộc' },
  { name: 'DM_QUOC_GIA', description: 'Danh mục quốc gia' },
  { name: 'DM_TON_GIAO', description: 'Danh mục tôn giáo' },
  { name: 'HS_HO_TICH', description: 'Hồ sơ hộ tịch' },
  { name: 'HS_KHAI_SINH', description: 'Hồ sơ khai sinh' },
];

export const mockColumns: Record<string, { name: string, type: string, length: string, description: string }[]> = {
  'DM_DAN_TOC': [
    { name: 'ID', type: 'VARCHAR2', length: '50', description: 'Khóa chính' },
    { name: 'MA_DAN_TOC', type: 'VARCHAR2', length: '20', description: 'Mã dân tộc' },
    { name: 'TEN_DAN_TOC', type: 'NVARCHAR2', length: '200', description: 'Tên dân tộc' },
    { name: 'NGAY_TAO', type: 'DATE', length: '-', description: 'Ngày tạo' },
  ],
  'HS_HO_TICH': [
    { name: 'ID', type: 'VARCHAR2', length: '50', description: 'Khóa chính' },
    { name: 'MA_HO_SO', type: 'VARCHAR2', length: '50', description: 'Mã hồ sơ' },
    { name: 'HO_TEN', type: 'NVARCHAR2', length: '200', description: 'Họ và tên' },
    { name: 'NGAY_SINH', type: 'DATE', length: '-', description: 'Ngày sinh' },
    { name: 'GIOI_TINH', type: 'NUMBER', length: '1', description: 'Giới tính (1: Nam, 2: Nữ)' },
  ]
};
