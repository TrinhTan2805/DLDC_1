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
    name: 'CSDL Kho DLDC',
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
  { name: 'DIP_PERSON', description: 'Thông tin cá nhân' },
  { name: 'DM_DAN_TOC', description: 'Danh mục dân tộc' },
  { name: 'DM_QUOC_GIA', description: 'Danh mục quốc gia' },
  { name: 'DM_TON_GIAO', description: 'Danh mục tôn giáo' },
  { name: 'HS_HO_TICH', description: 'Hồ sơ hộ tịch' },
  { name: 'HS_KHAI_SINH', description: 'Hồ sơ khai sinh' },
];

export const mockColumns: Record<string, { name: string, type: string, length: string, decimals?: string, notNull?: boolean, isKey?: boolean, description: string }[]> = {
  'DIP_PERSON': [
    { name: 'Dantoc', type: 'nvarchar(max)', length: '', decimals: '', notNull: true, isKey: false, description: '' },
    { name: 'DiaChi', type: 'nvarchar(max)', length: '', decimals: '', notNull: false, isKey: false, description: '' },
    { name: 'DIP_RefId', type: 'varchar', length: '4000', decimals: '', notNull: false, isKey: false, description: '' },
    { name: 'Ho', type: 'nvarchar(max)', length: '', decimals: '', notNull: true, isKey: false, description: '' },
    { name: 'Id', type: 'int', length: '', decimals: '', notNull: true, isKey: true, description: '' },
    { name: 'Ten', type: 'nvarchar(max)', length: '', decimals: '', notNull: true, isKey: false, description: '' },
    { name: 'Tuoi', type: 'int', length: '', decimals: '', notNull: true, isKey: false, description: '' },
  ],
  'DM_DAN_TOC': [
    { name: 'ID', type: 'VARCHAR2', length: '50', description: 'Khóa chính' },
    { name: 'MA_DAN_TOC', type: 'VARCHAR2', length: '20', description: 'Mã dân tộc' },
    { name: 'TEN_DAN_TOC', type: 'NVARCHAR2', length: '200', description: 'Tên dân tộc' },
    { name: 'NGAY_TAO', type: 'DATE', length: '-', description: 'Ngày tạo' },
  ],
  'DM_QUOC_GIA': [
    { name: 'ID', type: 'VARCHAR2', length: '50', description: 'Khóa chính' },
    { name: 'MA_QUOC_GIA', type: 'VARCHAR2', length: '20', description: 'Mã quốc gia' },
    { name: 'TEN_QUOC_GIA', type: 'NVARCHAR2', length: '200', description: 'Tên quốc gia' },
    { name: 'MA_CHAU_LUC', type: 'VARCHAR2', length: '20', description: 'Mã châu lục' },
  ],
  'DM_TON_GIAO': [
    { name: 'ID', type: 'VARCHAR2', length: '50', description: 'Khóa chính' },
    { name: 'MA_TON_GIAO', type: 'VARCHAR2', length: '20', description: 'Mã tôn giáo' },
    { name: 'TEN_TON_GIAO', type: 'NVARCHAR2', length: '200', description: 'Tên tôn giáo' },
  ],
  'HS_HO_TICH': [
    { name: 'ID', type: 'VARCHAR2', length: '50', description: 'Khóa chính' },
    { name: 'MA_HO_SO', type: 'VARCHAR2', length: '50', description: 'Mã hồ sơ' },
    { name: 'HO_TEN', type: 'NVARCHAR2', length: '200', description: 'Họ và tên' },
    { name: 'NGAY_SINH', type: 'DATE', length: '-', description: 'Ngày sinh' },
    { name: 'GIOI_TINH', type: 'NUMBER', length: '1', description: 'Giới tính (1: Nam, 2: Nữ)' },
    { name: 'MA_QUOC_GIA', type: 'VARCHAR2', length: '20', description: 'Mã quốc gia' },
    { name: 'MA_TINH', type: 'VARCHAR2', length: '20', description: 'Mã tỉnh' },
  ],
  'HS_KHAI_SINH': [
    { name: 'ID', type: 'VARCHAR2', length: '50', description: 'Khóa chính' },
    { name: 'MA_SO_DINH_DANH', type: 'VARCHAR2', length: '12', description: 'Mã số định danh cá nhân' },
    { name: 'HO_TEN', type: 'NVARCHAR2', length: '200', description: 'Họ và tên' },
    { name: 'NGAY_SINH', type: 'DATE', length: '-', description: 'Ngày sinh' },
    { name: 'GIOI_TINH', type: 'NUMBER', length: '1', description: 'Giới tính' },
    { name: 'NOI_SINH', type: 'NVARCHAR2', length: '500', description: 'Nơi sinh' },
    { name: 'DAN_TOC', type: 'VARCHAR2', length: '20', description: 'Dân tộc' },
    { name: 'QUOC_TICH', type: 'VARCHAR2', length: '20', description: 'Quốc tịch' },
    { name: 'HO_TEN_CHA', type: 'NVARCHAR2', length: '200', description: 'Họ tên cha' },
    { name: 'HO_TEN_ME', type: 'NVARCHAR2', length: '200', description: 'Họ tên mẹ' },
  ]
};

export const mockTableData: Record<string, any[]> = {
  'DIP_PERSON': [
    { MaCongDan: 4, SoDDCN: '891734', HoTen: 'Nguyễn Văn Vĩ', NgaySinh: '1997-06-18 00:00:00.0', GioiTinh: 'Nam', DanToc: 'Kinh', TonGiao: 'Không', QuocTich: 'Việt Nam', NoiThuongTru: 'Nam Định', MaTinh: 18 },
    { MaCongDan: 8, SoDDCN: '567898', HoTen: 'Nguyễn Đình Bắc', NgaySinh: '2003-01-01 00:00:00.0', GioiTinh: 'Nam', DanToc: 'Kinh', TonGiao: 'Không', QuocTich: 'Việt Nam', NoiThuongTru: 'Hà Nội', MaTinh: 29 },
    { MaCongDan: 9, SoDDCN: '678899', HoTen: 'Nguyễn Văn Toàn', NgaySinh: '1996-04-12 00:00:00.0', GioiTinh: 'Nam', DanToc: 'Kinh', TonGiao: 'Không', QuocTich: 'Việt Nam', NoiThuongTru: 'Hải Dương', MaTinh: 34 },
    { MaCongDan: 10, SoDDCN: '789910', HoTen: 'Nguyễn Công Phượng', NgaySinh: '1995-01-21 00:00:00.0', GioiTinh: 'Nam', DanToc: 'Kinh', TonGiao: 'Không', QuocTich: 'Việt Nam', NoiThuongTru: 'Mỹ Sơn', MaTinh: 43 },
    { MaCongDan: 11, SoDDCN: '891011', HoTen: 'Nguyễn Tuấn Anh', NgaySinh: '1995-05-15 00:00:00.0', GioiTinh: 'Nam', DanToc: 'Kinh', TonGiao: 'Không', QuocTich: 'Việt Nam', NoiThuongTru: 'Thái Bình', MaTinh: 17 },
  ]
};
