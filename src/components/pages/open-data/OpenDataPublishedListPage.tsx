import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, FileText, Calendar, User, Download, Eye, Filter, ChevronDown, Globe, CheckCircle, AlertCircle, RefreshCw, XCircle, Send, Upload, X, FileSpreadsheet, Info, Plus, Key, Clock, Database, Trash2, Edit, PlusCircle, PauseCircle, PlayCircle, Edit2, SquarePen, Shield, Menu, Save, AlertTriangle, ArrowRight } from 'lucide-react';
import * as XLSX from 'xlsx';

interface PublishedData {
  id: string;
  fileName: string;
  category: string;
  publisher: string;
  creator: string;
  createdDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  approver: string;
  description: string;
  format: string[];
  keywords: string;
  license: string;
  fileSize?: string;
  dataSource?: string;
  previewHeaders?: string[];
  previewRows?: any[][];
  frequency?: string;
  sourceDbId?: string;
  mainTable?: string;
  joinTables?: any[];
  dataFields?: any[];
  topic?: string;
  publishImmediately?: boolean;
  submitNote?: string;
}

const getPreviewFallback = (categoryName: string) => {
  if (categoryName === 'Danh sách tổ chức thực hiện trợ giúp pháp lý') {
    return {
      headers: ['Tên tổ chức thực hiện trợ giúp pháp lý', 'Người đại diện', 'Địa chỉ liên hệ'],
      rows: [
        ['Trung tâm Trợ giúp pháp lý nhà nước Tỉnh A', 'Nguyễn Văn Nam', '123 Hùng Vương, Tỉnh A'],
        ['Văn phòng Luật sư hợp đồng TGPL B', 'Trần Thị Thu', '456 Lê Lợi, Tỉnh B'],
        ['Trung tâm Trợ giúp pháp lý nhà nước Tỉnh C', 'Lê Hoàng Long', '789 Nguyễn Huệ, Tỉnh C']
      ]
    };
  }
  if (categoryName === 'Danh sách người thực hiện trợ giúp pháp lý') {
    return {
      headers: ['Họ tên', 'Số năm hành nghề', 'Vai trò', 'Tổ chức hành nghề', 'Địa chỉ tổ chức', 'Số điện thoại tổ chức'],
      rows: [
        ['Nguyễn Văn An', '10', 'Trợ giúp viên pháp luật', 'Trung tâm TGPL Nhà nước Tỉnh X', 'Đường Hùng Vương, Tỉnh X', '0243.123.456'],
        ['Trần Thị Bình', '5', 'Luật sư thực hiện TGPL', 'Văn phòng Luật sư Bình Minh', 'Đường Trần Hưng Đạo, Tỉnh Y', '0283.987.654']
      ]
    };
  }
  // Mặc định cho Danh sách Luật sư Việt Nam
  return {
    headers: ['Họ và tên', 'Ngày sinh', 'Giới tính', 'Quốc tịch', 'Số Chứng chỉ hành nghề luật sư', 'Số Thẻ luật sư', 'Nơi làm việc/nơi hành nghề', 'Thành viên Đoàn Luật sư', 'Tình trạng hành nghề'],
    rows: [
      ['Lê Văn Long', '15/08/1985', 'Nam', 'Việt Nam', 'CC-9988-BTP', 'THE-1234-LS', 'Văn phòng Luật sư Long & Partners', 'Đoàn Luật sư TP. Hà Nội', 'Đang hoạt động'],
      ['Phạm Thị Hoa', '22/04/1990', 'Nữ', 'Việt Nam', 'CC-5544-BTP', 'THE-5678-LS', 'Công ty Luật TNHH Sen Vàng', 'Đoàn Luật sư TP. HCM', 'Đang hoạt động'],
      ['Trần Hoàng Giang', '10/11/1980', 'Nam', 'Việt Nam', 'CC-2211-BTP', 'THE-9900-LS', 'Văn phòng Luật sư Giang Sơn', 'Đoàn Luật sư Đà Nẵng', 'Tạm ngừng hoạt động']
    ]
  };
};

const mockPublishedData: PublishedData[] = [
  {
    id: '1',
    fileName: 'Danh sách tổ chức thực hiện trợ giúp pháp lý Q1-2026.xlsx',
    category: 'Danh sách tổ chức thực hiện trợ giúp pháp lý',
    publisher: 'Bộ Tư pháp',
    creator: 'Nguyễn Văn A',
    createdDate: '01/01/2026',
    status: 'approved',
    approver: 'Lãnh đạo Cục CNTT',
    description: 'Dữ liệu tổ chức thực hiện trợ giúp pháp lý bao gồm các trung tâm nhà nước và văn phòng hợp đồng.',
    format: ['Excel'],
    keywords: 'văn bản, pháp luật',
    license: 'Giấy phép dữ liệu mở công cộng',
    fileSize: '154 KB',
    dataSource: 'CSDL Trợ giúp pháp lý - Bảng tổ chức',
    approvalNote: 'Đồng ý phê duyệt và công bố dữ liệu mở theo đề xuất của đơn vị. Dữ liệu đã được kiểm tra và đáp ứng đầy đủ các tiêu chí công bố.',
    previewHeaders: ['Tên tổ chức thực hiện trợ giúp pháp lý', 'Người đại diện', 'Địa chỉ liên hệ'],
    previewRows: [
      ['Trung tâm Trợ giúp pháp lý nhà nước Tỉnh A', 'Nguyễn Văn Nam', '123 Hùng Vương, Tỉnh A'],
      ['Văn phòng Luật sư hợp đồng TGPL B', 'Trần Thị Thu', '456 Lê Lợi, Tỉnh B'],
      ['Trung tâm Trợ giúp pháp lý nhà nước Tỉnh C', 'Lê Hoàng Long', '789 Nguyễn Huệ, Tỉnh C']
    ]
  },
  {
    id: '2',
    fileName: 'Danh sách người thực hiện trợ giúp pháp lý 2026.xlsx',
    category: 'Danh sách người thực hiện trợ giúp pháp lý',
    publisher: 'Bộ Tư pháp',
    creator: 'Trần Thị B',
    createdDate: '15/01/2026',
    status: 'approved',
    approver: 'Lãnh đạo Cục CNTT',
    description: 'Dữ liệu danh sách trợ giúp viên pháp luật và luật sư cộng tác viên.',
    format: ['Excel'],
    keywords: 'trợ giúp, pháp lý',
    license: 'Giấy phép ODC-BY',
    fileSize: '168 KB',
    dataSource: 'CSDL Trợ giúp pháp lý - Bảng người thực hiện',
    approvalNote: 'Dữ liệu đủ điều kiện công bố, đã kiểm tra tính đầy đủ và chính xác. Đồng ý kích hoạt công bố.',
    previewHeaders: ['Họ tên', 'Số năm hành nghề', 'Vai trò', 'Tổ chức hành nghề', 'Địa chỉ tổ chức', 'Số điện thoại tổ chức'],
    previewRows: [
      ['Nguyễn Văn An', '10', 'Trợ giúp viên pháp luật', 'Trung tâm TGPL Nhà nước Tỉnh X', 'Đường Hùng Vương, Tỉnh X', '0243.123.456'],
      ['Trần Thị Bình', '5', 'Luật sư thực hiện TGPL', 'Văn phòng Luật sư Bình Minh', 'Đường Trần Hưng Đạo, Tỉnh Y', '0283.987.654']
    ]
  },
  {
    id: '3',
    fileName: 'Yêu cầu phê duyệt Danh sách Luật sư Việt Nam mới.xlsx',
    category: 'Danh sách Luật sư Việt Nam',
    publisher: 'Bộ Tư pháp',
    creator: 'Lê Văn C',
    createdDate: '01/02/2026',
    status: 'pending',
    approver: 'Chưa phê duyệt',
    description: 'Yêu cầu công bố dữ liệu danh sách Luật sư Việt Nam cập nhật quý 1/2026.',
    format: ['Excel'],
    keywords: 'luật sư, bổ trợ tư pháp',
    license: 'Giấy phép dữ liệu mở công cộng',
    fileSize: '512 KB',
    dataSource: 'CSDL Luật sư Việt Nam',
    submitNote: 'Đề nghị Lãnh đạo xem xét phê duyệt yêu cầu công bố dữ liệu danh sách Luật sư Việt Nam cập nhật quý 1/2026 theo Nghị định 47/2020/NĐ-CP.',
    previewHeaders: ['Họ và tên', 'Ngày sinh', 'Giới tính', 'Quốc tịch', 'Số Chứng chỉ hành nghề luật sư', 'Số Thẻ luật sư', 'Nơi làm việc/nơi hành nghề', 'Thành viên Đoàn Luật sư', 'Tình trạng hành nghề'],
    previewRows: [
      ['Lê Văn Long', '15/08/1985', 'Nam', 'Việt Nam', 'CC-9988-BTP', 'THE-1234-LS', 'Văn phòng Luật sư Long & Partners', 'Đoàn Luật sư TP. Hà Nội', 'Đang hoạt động'],
      ['Phạm Thị Hoa', '22/04/1990', 'Nữ', 'Việt Nam', 'CC-5544-BTP', 'THE-5678-LS', 'Công ty Luật TNHH Sen Vàng', 'Đoàn Luật sư TP. HCM', 'Đang hoạt động'],
      ['Trần Hoàng Giang', '10/11/1980', 'Nam', 'Việt Nam', 'CC-2211-BTP', 'THE-9900-LS', 'Văn phòng Luật sư Giang Sơn', 'Đoàn Luật sư Đà Nẵng', 'Tạm ngừng hoạt động']
    ]
  },
  {
    id: '4',
    fileName: 'Yêu cầu bổ sung Danh sách tổ chức TGPL Tỉnh B.xlsx',
    category: 'Danh sách tổ chức thực hiện trợ giúp pháp lý',
    publisher: 'Bộ Tư pháp',
    creator: 'Phạm Thị D',
    createdDate: '10/03/2026',
    status: 'pending',
    approver: 'Chưa phê duyệt',
    description: 'Yêu cầu cập nhật danh sách tổ chức trợ giúp pháp lý bổ sung tại Tỉnh B.',
    format: ['Excel'],
    keywords: 'tgpl, tổ chức, bổ sung',
    license: 'Giấy phép dữ liệu mở công cộng',
    fileSize: '48 KB',
    dataSource: 'CSDL Trợ giúp pháp lý - Bảng tổ chức',
    submitNote: 'Đề nghị Lãnh đạo xem xét phê duyệt yêu cầu cập nhật, bổ sung danh sách tổ chức trợ giúp pháp lý tại Tỉnh B.',
    previewHeaders: ['Tên tổ chức thực hiện trợ giúp pháp lý', 'Người đại diện', 'Địa chỉ liên hệ'],
    previewRows: [
      ['Văn phòng TGPL Tình Thương B', 'Phạm Quốc Bảo', '789 Trần Phú, Tỉnh B'],
      ['Chi nhánh TGPL số 2 Tỉnh B', 'Hoàng Văn Thắng', '101 Hùng Vương, Tỉnh B']
    ]
  },
  {
    id: '5',
    fileName: 'Danh sách Luật sư Việt Nam cũ (Lỗi định dạng).xlsx',
    category: 'Danh sách Luật sư Việt Nam',
    publisher: 'Cục Bổ trợ tư pháp',
    creator: 'Nguyễn Văn A',
    createdDate: '01/01/2025',
    status: 'rejected',
    approver: 'Lãnh đạo Cục Bổ trợ tư pháp',
    description: 'Danh sách luật sư cũ nộp thử bị từ chối do thiếu các cột thông tin bắt buộc.',
    format: ['Excel'],
    keywords: 'luật sư, lỗi',
    license: 'Giấy phép ODC-BY',
    fileSize: '450 KB',
    dataSource: 'CSDL Luật sư Việt Nam',
    approvalNote: 'Từ chối do tệp dữ liệu thiếu các cột thông tin bắt buộc theo quy định: Số Chứng chỉ hành nghề, Đoàn Luật sư, Tình trạng hành nghề. Đề nghị bổ sung đầy đủ và nộp lại.',
    previewHeaders: ['Họ và tên', 'Ngày sinh', 'Số Thẻ luật sư'],
    previewRows: [
      ['Nguyễn Văn B', '12/12/1970', 'THE-0001-LS']
    ]
  },
  {
    id: '6',
    fileName: 'API Danh sách Luật sư Việt Nam',
    category: 'Danh sách Luật sư Việt Nam',
    publisher: 'Bộ Tư pháp',
    creator: 'Hệ thống (User)',
    createdDate: '10/05/2026',
    status: 'approved',
    approver: 'Lãnh đạo Cục CNTT',
    description: 'API Danh sách Luật sư Việt Nam cập nhật trực tuyến.',
    format: ['API'],
    keywords: 'luật sư, api',
    license: 'Giấy phép dữ liệu mở công cộng',
    fileSize: '-',
    dataSource: 'API: GET - https://api.moj.gov.vn/luatsu',
    approvalNote: 'API đạt tiêu chuẩn kỹ thuật và bảo mật. Đồng ý kích hoạt và công bố.',
    previewHeaders: ['Họ và tên', 'Ngày sinh', 'Giới tính', 'Quốc tịch', 'Số Chứng chỉ hành nghề luật sư', 'Số Thẻ luật sư', 'Nơi làm việc/nơi hành nghề', 'Thành viên Đoàn Luật sư', 'Tình trạng hành nghề'],
    previewRows: [
      ['Lê Văn Long', '15/08/1985', 'Nam', 'Việt Nam', 'CC-9988-BTP', 'THE-1234-LS', 'Văn phòng Luật sư Long & Partners', 'Đoàn Luật sư TP. Hà Nội', 'Đang hoạt động'],
      ['Phạm Thị Hoa', '22/04/1990', 'Nữ', 'Việt Nam', 'CC-5544-BTP', 'THE-5678-LS', 'Công ty Luật TNHH Sen Vàng', 'Đoàn Luật sư TP. HCM', 'Đang hoạt động'],
      ['Trần Hoàng Giang', '10/11/1980', 'Nam', 'Việt Nam', 'CC-2211-BTP', 'THE-9900-LS', 'Văn phòng Luật sư Giang Sơn', 'Đoàn Luật sư Đà Nẵng', 'Tạm ngừng hoạt động']
    ]
  }
];

const APPROVED_CATEGORIES = [
  {
    id: 'open-data-category-a',
    code: 'ODC001',
    name: 'Danh sách tổ chức thực hiện trợ giúp pháp lý',
    expectedHeaders: ['Tên tổ chức thực hiện trợ giúp pháp lý', 'Người đại diện', 'Địa chỉ liên hệ']
  },
  {
    id: 'open-data-category-b',
    code: 'ODC002',
    name: 'Danh sách người thực hiện trợ giúp pháp lý',
    expectedHeaders: ['Họ tên', 'Số năm hành nghề', 'Vai trò', 'Tổ chức hành nghề', 'Địa chỉ tổ chức', 'Số điện thoại tổ chức']
  },
  {
    id: 'open-data-category-c',
    code: 'ODC003',
    name: 'Danh sách Luật sư Việt Nam',
    expectedHeaders: ['Họ và tên', 'Ngày sinh', 'Giới tính', 'Quốc tịch', 'Số Chứng chỉ hành nghề luật sư', 'Số Thẻ luật sư', 'Nơi làm việc/nơi hành nghề', 'Thành viên Đoàn Luật sư', 'Tình trạng hành nghề']
  }
];
interface ConfiguredMetadataFile {
  fileName: string;
  categoryCode: string;
  categoryName: string;
  license: string;
  keywords: string;
  publisher: string;
  description: string;
  format: string;
  shareFormat?: string;
  frequency?: string;
  mainTable?: string;
  joinTableNames?: string[];
}

interface DataField {
  id: string;
  shared: boolean;
  isPk: boolean;
  tableId: string;
  column: string;
  apiField: string;
  dataType: string;
  masked: boolean;
}

const CONFIGURED_METADATA_FILES: ConfiguredMetadataFile[] = [
  {
    fileName: 'danh_sach_to_chuc_tgpl.xlsx',
    categoryCode: 'ODC001',
    categoryName: 'Danh sách tổ chức thực hiện trợ giúp pháp lý',
    license: 'Giấy phép dữ liệu mở công cộng',
    keywords: 'luật, mở, thống kê',
    publisher: 'Bộ Tư pháp',
    description: 'Dữ liệu tổ chức thực hiện trợ giúp pháp lý bao gồm các trung tâm nhà nước và văn phòng hợp đồng.',
    format: 'CSV',
    shareFormat: 'excel',
    frequency: 'monthly',
    mainTable: 'to_chuc_tgpl',
    joinTableNames: ['vu_viec_tgpl'],
  },
  {
    fileName: 'danh_sach_nguoi_tgpl.json',
    categoryCode: 'ODC002',
    categoryName: 'Danh sách người thực hiện trợ giúp pháp lý',
    license: 'Giấy phép ODC-BY',
    keywords: 'doanh nghiệp, đăng ký',
    publisher: 'Cục Bổ trợ tư pháp',
    description: 'Dữ liệu danh sách trợ giúp viên pháp luật và luật sư cộng tác viên.',
    format: 'JSON',
    shareFormat: 'api',
    frequency: 'weekly',
    mainTable: 'nguoi_tgpl',
    joinTableNames: ['chung_chi'],
  },
  {
    fileName: 'danh_sach_luat_su.xlsx',
    categoryCode: 'ODC003',
    categoryName: 'Danh sách Luật sư Việt Nam',
    license: 'Giấy phép dữ liệu mở công cộng',
    keywords: 'luật sư, bổ trợ tư pháp',
    publisher: 'Bộ Tư pháp',
    description: 'Yêu cầu công bố dữ liệu danh sách Luật sư Việt Nam cập nhật.',
    format: 'CSV',
    shareFormat: 'excel',
    frequency: 'quarterly',
    mainTable: 'luat_su',
    joinTableNames: ['doan_luat_su'],
  }
];

const WAREHOUSE_DATABASES = [
  { id: 'db_tgpl_org', name: 'CSDL Trợ giúp pháp lý - Bảng tổ chức' },
  { id: 'db_tgpl_user', name: 'CSDL Trợ giúp pháp lý - Bảng người thực hiện' },
  { id: 'db_luatsu', name: 'CSDL Bổ trợ tư pháp - Bảng luật sư' },
  { id: 'db_tochuc_ls', name: 'CSDL Bổ trợ tư pháp - Bảng tổ chức hành nghề luật sư' },
  { id: 'db_hotich_sinh', name: 'CSDL Hộ tịch - Bảng khai sinh' }
];

const CATEGORY_TO_DB: Record<string, string> = {
  ODC001: 'db_tgpl_org',
  ODC002: 'db_tgpl_user',
  ODC003: 'db_luatsu',
};

const SOURCE_DB_TABLES: Record<string, { name: string; columns: string[] }[]> = {
  db_tgpl_org: [
    { name: 'to_chuc_tgpl', columns: ['id', 'ten_to_chuc', 'loai_hinh', 'dia_chi', 'nguoi_dai_dien', 'so_dien_thoai', 'ngay_thanh_lap', 'trang_thai'] },
    { name: 'vu_viec_tgpl', columns: ['id', 'ma_vu_viec', 'ten_vu_viec', 'loai_vu_viec', 'nguoi_thuc_hien', 'ngay_tiep_nhan', 'trang_thai'] },
  ],
  db_tgpl_user: [
    { name: 'nguoi_tgpl', columns: ['id', 'ho_ten', 'so_nam_hanh_nghe', 'vai_tro', 'so_chung_chi', 'trang_thai'] },
    { name: 'chung_chi', columns: ['id', 'so_chung_chi', 'ngay_cap', 'ngay_het_han', 'co_quan_cap'] },
  ],
  db_luatsu: [
    { name: 'luat_su', columns: ['id', 'ho_ten', 'ngay_sinh', 'gioi_tinh', 'quoc_tich', 'so_chung_chi_hn', 'so_the_luat_su', 'noi_lam_viec', 'doan_luat_su', 'tinh_trang_hn'] },
    { name: 'doan_luat_su', columns: ['id', 'ten_doan', 'dia_chi', 'so_dien_thoai', 'chu_nhiem'] },
  ],
};

function buildAllDataFields(dbId: string, mainTableName: string, joinTableNames: string[]): DataField[] {
  const tables = SOURCE_DB_TABLES[dbId] || [];
  const allTableNames = [mainTableName, ...joinTableNames].filter(Boolean);
  const fields: DataField[] = [];
  let counter = 0;
  for (const tableName of allTableNames) {
    const table = tables.find(t => t.name === tableName);
    if (!table) continue;
    for (const col of table.columns) {
      fields.push({
        id: `f_${tableName}_${col}_${counter++}`,
        shared: true,
        isPk: col === 'id',
        tableId: tableName,
        column: col,
        apiField: col,
        dataType: col.startsWith('ngay') || col.endsWith('_date') ? 'date' : col === 'id' ? 'number' : 'string',
        masked: false,
      });
    }
  }
  return fields;
}


interface ScheduleItem {
  id: number;
  datasetCode: string;
  datasetName: string;
  categoryName?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  startTime: string;
  startDate?: string;
  endDate?: string;
  publishFormat?: 'api' | 'file';
  targetAudience?: string;
  contactInfo?: string;
  dataSource: string;
  status: 'active' | 'inactive';
  lastRun?: string;
  nextRun: string;
  createdBy: string;
  createdDate: string;
  weeklyDays?: string[];
  monthlyDay?: number;
  quarterlyMonth?: number;
  quarterlyDay?: number;
}

interface CategoryOption {
  id: string;
  name: string;
  description: string;
}

interface CategoryItem {
  id: number;
  code: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  publishStatus: 'published' | 'unpublished';
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'draft';
  createdDate: string;
  updatedBy: string;
  keywords?: string;
  licenseId?: string;
  publisher?: string;
  fileName?: string;
}

const availableCategories: CategoryOption[] = [
  { id: 'cat_a', name: 'Biên tập danh mục A', description: 'Văn bản pháp luật' },
  { id: 'cat_b', name: 'Danh mục B', description: 'Đăng ký kinh doanh' },
  { id: 'cat_c', name: 'Danh mục C', description: 'Công chứng' },
  { id: 'cat_d', name: 'Danh mục D', description: 'TGPL' },
  { id: 'cat_e', name: 'Danh mục E', description: 'Hộ tịch' },
];

const sampleCategoryData: CategoryItem[] = [
  {
    id: 1,
    code: 'ODCAT001',
    name: 'Mục 1',
    description: 'Mô tả mục dữ liệu mở 1',
    status: 'active',
    publishStatus: 'published',
    approvalStatus: 'approved',
    createdDate: '15/12/2024',
    updatedBy: 'Nguyễn Văn A'
  },
  {
    id: 2,
    code: 'ODCAT002',
    name: 'Mục 2',
    description: 'Mô tả mục dữ liệu mở 2',
    status: 'active',
    publishStatus: 'published',
    approvalStatus: 'approved',
    createdDate: '14/12/2024',
    updatedBy: 'Trần Thị B'
  },
  {
    id: 3,
    code: 'ODCAT003',
    name: 'Mục 3',
    description: 'Mô tả mục dữ liệu mở 3',
    status: 'inactive',
    publishStatus: 'unpublished',
    approvalStatus: 'draft',
    createdDate: '13/12/2024',
    updatedBy: 'Lê Văn C'
  }
];

const approvers = [
  { id: 'app1', name: 'Nguyễn Văn Hùng', position: 'Cục trưởng Cục CNTT' },
  { id: 'app2', name: 'Trần Thị Lan', position: 'Phó Cục trưởng Cục CNTT' },
  { id: 'app3', name: 'Lê Minh Tuấn', position: 'Trưởng phòng Dữ liệu mở' },
  { id: 'app4', name: 'Phạm Quốc Bảo', position: 'Phó Vụ trưởng Vụ CNTT' },
];

const mockSchedules: ScheduleItem[] = [
  {
    id: 1,
    datasetCode: 'ODC001',
    datasetName: 'Danh sách tổ chức thực hiện trợ giúp pháp lý',
    categoryName: 'Biên tập danh mục A',
    frequency: 'daily',
    startTime: '01:00',
    dataSource: 'CSDL Trợ giúp pháp lý - Bảng tổ chức',
    status: 'active',
    lastRun: '04/06/2026 01:00',
    nextRun: '05/06/2026 01:00',
    createdBy: 'Nguyễn Văn A',
    createdDate: '15/01/2026'
  },
  {
    id: 2,
    datasetCode: 'ODC002',
    datasetName: 'Danh sách người thực hiện trợ giúp pháp lý',
    categoryName: 'Danh mục B',
    frequency: 'weekly',
    startTime: '02:00',
    dataSource: 'CSDL Trợ giúp pháp lý - Bảng người thực hiện',
    status: 'active',
    lastRun: '01/06/2026 02:00',
    nextRun: '08/06/2026 02:00',
    createdBy: 'Trần Thị B',
    createdDate: '20/01/2026',
    weeklyDays: ['Thứ 2', 'Thứ 4']
  }
];

const validateHeaders = (categoryCode: string, headers: string[]) => {
  const normalizedHeaders = headers.map(h => h.trim().toLowerCase());
  
  if (categoryCode === 'ODC001') {
    const required = [
      ['tên tổ chức thực hiện trợ giúp pháp lý', 'tên tổ chức', 'tổ chức thực hiện trợ giúp pháp lý'],
      ['người đại diện', 'người đại diện pháp luật'],
      ['địa chỉ liên hệ', 'địa chỉ', 'địa chỉ trụ sở']
    ];
    const missing: string[] = [];
    required.forEach(options => {
      const found = options.some(opt => normalizedHeaders.includes(opt));
      if (!found) {
        missing.push(options[0]);
      }
    });
    return { isValid: missing.length === 0, missing };
  }
  
  if (categoryCode === 'ODC002') {
    const required = [
      ['họ tên', 'họ và tên'],
      ['số năm hành nghề'],
      ['vai trò'],
      ['tổ chức hành nghề'],
      ['địa chỉ tổ chức', 'địa chỉ'],
      ['số điện thoại tổ chức', 'sđt tổ chức', 'số điện thoại']
    ];
    const missing: string[] = [];
    required.forEach(options => {
      const found = options.some(opt => normalizedHeaders.includes(opt));
      if (!found) {
        missing.push(options[0]);
      }
    });
    return { isValid: missing.length === 0, missing };
  }

  if (categoryCode === 'ODC003') {
    const required = [
      ['họ và tên', 'họ tên'],
      ['ngày sinh'],
      ['giới tính'],
      ['quốc tịch'],
      ['số chứng chỉ hành nghề luật sư', 'số chứng chỉ hành nghề'],
      ['số thẻ luật sư', 'số thẻ'],
      ['nơi làm việc/nơi hành nghề', 'nơi làm việc', 'nơi hành nghề'],
      ['thành viên đoàn luật sư', 'đoàn luật sư'],
      ['tình trạng hành nghề', 'trạng thái hoạt động']
    ];
    const missing: string[] = [];
    required.forEach(options => {
      const found = options.some(opt => normalizedHeaders.includes(opt));
      if (!found) {
        missing.push(options[0]);
      }
    });
    return { isValid: missing.length === 0, missing };
  }

  return { isValid: true, missing: [] };
};

const convertToEnglishSnake = (str: string) => {
  if (!str) return 'field';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
};

const getOpenDataDetails = (item: any) => {
  const mainTable = item.mainTable || convertToEnglishSnake(item.category || 'open_data_table');
  
  if (item.dataFields && Array.isArray(item.dataFields) && item.dataFields.length > 0) {
    const sharedFields = item.dataFields.filter((df: any) => df.shared !== false);
    const fields = (sharedFields.length > 0 ? sharedFields : item.dataFields).map((df: any, idx: number) => ({
      id: df.id || idx + 1,
      name: df.apiField || df.column || `field_${idx}`,
      type: df.dataType?.toLowerCase() === 'number' ? 'number' : df.dataType?.toLowerCase() === 'datetime' ? 'datetime' : 'string',
      description: `Trường ${df.column} (từ bảng ${df.tableId || mainTable})`,
      isMasked: !!df.masked,
      maskRule: df.masked ? 'hide_middle_4' : '',
      sourceTable: df.tableId || mainTable,
      sourceColumn: df.column || df.apiField
    }));
    return { mainTable, fields };
  }
  
  const headers = item.previewHeaders || [];
  const fields = headers.map((h: string, idx: number) => {
    const colName = convertToEnglishSnake(h);
    return {
      id: idx + 1,
      name: colName,
      type: colName.includes('ngay') || colName.includes('date') ? 'datetime' : colName.includes('so_nam') ? 'number' : 'string',
      description: h,
      isMasked: false,
      maskRule: '',
      sourceTable: mainTable,
      sourceColumn: colName
    };
  });
  return { mainTable, fields };
};

export function OpenDataPublishedListPage() {
  const [activeTab, setActiveTab] = useState<'requests' | 'approval' | 'schedule'>('requests');
  const [dataList, setDataList] = useState<PublishedData[]>(() => {
    const DATA_VERSION = 'v2';
    const saved = localStorage.getItem('open_data_published');
    const version = localStorage.getItem('open_data_published_version');
    if (saved && version === DATA_VERSION) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    localStorage.removeItem('open_data_published');
    localStorage.setItem('open_data_published_version', DATA_VERSION);
    return mockPublishedData;
  });

  useEffect(() => {
    localStorage.setItem('open_data_published', JSON.stringify(dataList));
    
    // Sync to provision_services
    try {
      const savedServices = localStorage.getItem('provision_services');
      if (savedServices) {
        const services = JSON.parse(savedServices);
        if (Array.isArray(services)) {
          let hasChanges = false;
          const updatedServices = services.map(srv => {
            if (srv.isOpenDataShared && srv.selectedOpenDataId) {
              const matchedOpenData = dataList.find(d => d.id === srv.selectedOpenDataId && d.status === 'approved');
              if (matchedOpenData) {
                const { mainTable: newMainTable, fields: newFields } = getOpenDataDetails(matchedOpenData);
                const isTableDiff = srv.primaryTable !== newMainTable;
                const isFieldsDiff = JSON.stringify(srv.fields) !== JSON.stringify(newFields);
                
                if (isTableDiff || isFieldsDiff || srv.hasJoin !== false) {
                  hasChanges = true;
                  return {
                    ...srv,
                    primaryTable: newMainTable,
                    fields: newFields,
                    hasJoin: false,
                    joinedTables: [],
                    packetMode: 'visual'
                  };
                }
              }
            }
            return srv;
          });
          
          if (hasChanges) {
            localStorage.setItem('provision_services', JSON.stringify(updatedServices));
          }
        }
      }
    } catch (e) {
      console.error('Error syncing open data to provision services', e);
    }
  }, [dataList]);

  const getDatasetFormat = (datasetId: string) => {
    if (!datasetId) return null;
    const category = APPROVED_CATEGORIES.find(c => c.code === datasetId);
    if (!category) return null;
    const matchedData = dataList.find(item => item.category === category.name && item.status === 'approved');
    if (!matchedData) return null;
    return matchedData.format.includes('API') ? 'API' : 'file';
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPublisher, setSelectedPublisher] = useState<string>('all');
  const [selectedData, setSelectedData] = useState<PublishedData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Pagination states
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  // Form Request States
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestModalTab, setRequestModalTab] = useState<'general' | 'settings'>('general');
  const [editingItem, setEditingItem] = useState<PublishedData | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successPopupMessage, setSuccessPopupMessage] = useState('Yêu cầu công bố đã được ghi nhận');
  const [scheduleStatusConfirm, setScheduleStatusConfirm] = useState<{ schedule: ScheduleItem; action: 'pause' | 'resume' } | null>(null);
  const [requestFileName, setRequestFileName] = useState('');
  const [requestDescription, setRequestDescription] = useState('');
  const [requestCategory, setRequestCategory] = useState('');
  const [requestKeywords, setRequestKeywords] = useState('');
  const [requestPublishImmediately, setRequestPublishImmediately] = useState(false);
  const [requestLicense, setRequestLicense] = useState('Giấy phép dữ liệu mở công cộng');
  const [requestPublisher, setRequestPublisher] = useState('Bộ Tư pháp');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [formValidationError, setFormValidationError] = useState<string | null>(null);
  const [requestMetaFile, setRequestMetaFile] = useState('');
  const [requestFormat, setRequestFormat] = useState<string[]>([]);
  const [requestTopic, setRequestTopic] = useState('');
  const [requestFrequency, setRequestFrequency] = useState('');
  const [sourceDbId, setSourceDbId] = useState('');
  const [mainTable, setMainTable] = useState('');
  const [hasJoin, setHasJoin] = useState(false);
  const [joinTables, setJoinTables] = useState<{ id: string; tableId: string; alias: string; joinType: string; joinColA: string; joinColB: string }[]>([]);
  const [dataFields, setDataFields] = useState<DataField[]>([]);

  const handleAddDataField = () => {
    const newField: DataField = {
      id: `f_new_${Date.now()}`,
      shared: true,
      isPk: false,
      tableId: mainTable || '',
      column: '',
      apiField: '',
      dataType: 'string',
      masked: false
    };
    setDataFields([...dataFields, newField]);
  };

  useEffect(() => {
    if (!requestMetaFile) {
      setFormValidationError(null);
      return;
    }
    const config = CONFIGURED_METADATA_FILES.find(f => f.fileName === requestMetaFile);
    if (!config) {
      setFormValidationError(null);
      return;
    }

    if (requestCategory && requestCategory !== config.categoryCode) {
      setFormValidationError(`Danh mục dữ liệu mở không khớp với cấu hình metadata của tệp (${config.categoryName}).`);
      return;
    }
    if (requestLicense && requestLicense !== config.license) {
      setFormValidationError(`Giấy phép không khớp với cấu hình metadata của tệp (${config.license}).`);
      return;
    }
    if (requestPublisher && requestPublisher.trim().toLowerCase() !== config.publisher.toLowerCase()) {
      setFormValidationError(`Đơn vị chủ trì cung cấp không khớp với cấu hình metadata của tệp (${config.publisher}).`);
      return;
    }
    if (requestKeywords) {
      const configKeywords = config.keywords.split(',').map(k => k.trim().toLowerCase());
      const currentKeywords = requestKeywords.split(',').map(k => k.trim().toLowerCase());
      const missingKeywords = configKeywords.filter(k => !currentKeywords.includes(k));
      if (missingKeywords.length > 0) {
        setFormValidationError(`Từ khóa thiếu các từ bắt buộc trong cấu hình metadata: ${missingKeywords.join(', ')}.`);
        return;
      }
    }

    setFormValidationError(null);
  }, [requestMetaFile, requestCategory, requestLicense, requestKeywords, requestPublisher]);

  const [uploadType, setUploadType] = useState<'file' | 'api'>('file');
  const [apiType, setApiType] = useState<'internal' | 'external'>('internal');
  const [selectedInternalApiId, setSelectedInternalApiId] = useState('');
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [apiUrl, setApiUrl] = useState('');
  const [apiParams, setApiParams] = useState('');
  const [apiHeaders, setApiHeaders] = useState('');
  const [apiBody, setApiBody] = useState('');
  const [apiTitle, setApiTitle] = useState('');
  const [apiDesc, setApiDesc] = useState('');
  const [internalApis, setInternalApis] = useState<any[]>([]);

  useEffect(() => {
    if (showRequestModal) {
      const savedApis = localStorage.getItem('provision_apis');
      if (savedApis) {
        setInternalApis(JSON.parse(savedApis));
      } else {
        setInternalApis([]);
      }
    }
  }, [showRequestModal]);

  // Validation & Parse States
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validationSuccess, setValidationSuccess] = useState(false);
  const [validationDetails, setValidationDetails] = useState<{ isValid: boolean; missing: string[] } | null>(null);
  const [uploadedPreviewHeaders, setUploadedPreviewHeaders] = useState<string[]>([]);
  const [uploadedPreviewRows, setUploadedPreviewRows] = useState<any[][]>([]);

  // Approval Tab States
  const [selectedApprovalItem, setSelectedApprovalItem] = useState<PublishedData | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showApproveForm, setShowApproveForm] = useState(false);
  const [showRejectConfirmModal, setShowRejectConfirmModal] = useState(false);
  const [approveOpinion, setApproveOpinion] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [rejectReasonError, setRejectReasonError] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [approvalPreviewTab, setApprovalPreviewTab] = useState<'metadata' | 'preview'>('metadata');

  const getRecordMetadataConfig = (item: PublishedData) => {
    const dbId = item.sourceDbId || (item.category.includes('tổ chức') ? 'db_tgpl_org' : item.category.includes('người') ? 'db_tgpl_user' : 'db_luatsu');
    const mainTable = item.mainTable || (item.category.includes('tổ chức') ? 'to_chuc_tgpl' : item.category.includes('người') ? 'nguoi_tgpl' : 'luat_su');
    const joinTables = item.joinTables || (item.category.includes('tổ chức') ? [{ id: '1', tableId: 'vu_viec_tgpl', alias: 't2', joinType: 'LEFT JOIN', joinColA: 't2.id', joinColB: 'to_chuc_tgpl.id' }] : []);
    const dataFields = item.dataFields || [
      { id: '1', shared: true, isPk: true, tableId: mainTable, column: 'id', apiField: 'id', dataType: 'VARCHAR', masked: false },
      { id: '2', shared: true, isPk: false, tableId: mainTable, column: 'name', apiField: 'name', dataType: 'VARCHAR', masked: false },
      { id: '3', shared: true, isPk: false, tableId: mainTable, column: 'created_at', apiField: 'createdAt', dataType: 'DATETIME', masked: false }
    ];
    return { dbId, mainTable, joinTables, dataFields };
  };

  const getFrequencyLabel = (freq: string) => {
    const map: Record<string, string> = {
      'daily': 'Theo ngày',
      'weekly': 'Theo tuần',
      'monthly': 'Theo tháng',
      'quarterly': 'Theo quý',
      'yearly': 'Theo năm'
    };
    return map[freq] || freq;
  };



  // Schedule Tab States
  const [schedules, setSchedules] = useState<ScheduleItem[]>(mockSchedules);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDeleteScheduleModal, setShowDeleteScheduleModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);
  const [scheduleFormData, setScheduleFormData] = useState({
    datasetId: '',
    frequency: 'daily' as 'daily' | 'weekly' | 'monthly' | 'quarterly',
    startTime: '08:00',
    startDate: '',
    endDate: '',
    publishFormat: 'api' as 'api' | 'file',
    targetAudience: '',
    contactInfo: '',
    dataSource: '',
    weeklyDays: [] as string[],
    monthlyDay: 1,
    quarterlyDay: 1,
    quarterlyMonth: 1
  });
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);

  // Send Approval Modal States
  const [showSendApprovalModal, setShowSendApprovalModal] = useState(false);
  const [sendApprovalItem, setSendApprovalItem] = useState<PublishedData | null>(null);
  const [sendApprovalApprover, setSendApprovalApprover] = useState('');
  const [sendApprovalNote, setSendApprovalNote] = useState('');

  // Schedule Tab Filter States
  const [selectedScheduleFrequency, setSelectedScheduleFrequency] = useState<string>('all');
  const [selectedScheduleStatus, setSelectedScheduleStatus] = useState<string>('all');

  // Reset pagination on filter changes
  useEffect(() => {
    setCurrentPageNum(1);
  }, [searchTerm, selectedStatus, selectedCategory, selectedPublisher, selectedScheduleFrequency, selectedScheduleStatus, activeTab]);

  useEffect(() => {
    setCurrentPageNum(1);
    setSelectedStatus('all');
    setSelectedCategory('all');
    setSelectedPublisher('all');
    setSearchTerm('');
    setSelectedScheduleFrequency('all');
    setSelectedScheduleStatus('all');
    setShowFilters(false);
  }, [activeTab]);

  // Filters
  const filteredRequests = dataList.filter(item => {
    if (!item) return false;
    const nameToSearch = (item.fileName || '').toLowerCase();
    const matchSearch = nameToSearch.includes(searchTerm.toLowerCase());
    const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchPublisher = selectedPublisher === 'all' || item.publisher === selectedPublisher;
    return matchSearch && matchStatus && matchCategory && matchPublisher;
  });

  const totalItemsCount = filteredRequests.length;
  const paginatedRequests = filteredRequests.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);

  const filteredApprovalRequests = dataList.filter(item => {
    if (!item) return false;
    if (item.status === 'draft') return false;
    const nameToSearch = (item.fileName || '').toLowerCase();
    const matchSearch = nameToSearch.includes(searchTerm.toLowerCase());
    const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchPublisher = selectedPublisher === 'all' || item.publisher === selectedPublisher;
    return matchSearch && matchStatus && matchCategory && matchPublisher;
  });

  const totalApprovalItemsCount = filteredApprovalRequests.length;
  const paginatedApprovalRequests = filteredApprovalRequests.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);



  const filteredSchedules = schedules.filter(sch => {
    if (!sch) return false;
    const nameToSearch = (sch.datasetName || '').toLowerCase();
    const dbToSearch = (sch.dataSource || '').toLowerCase();
    const matchSearch = nameToSearch.includes(searchTerm.toLowerCase()) || dbToSearch.includes(searchTerm.toLowerCase());
    const matchFrequency = selectedScheduleFrequency === 'all' || sch.frequency === selectedScheduleFrequency;
    const matchStatus = selectedScheduleStatus === 'all' || sch.status === selectedScheduleStatus;
    return matchSearch && matchFrequency && matchStatus;
  });

  const totalScheduleItemsCount = filteredSchedules.length;
  const paginatedSchedules = filteredSchedules.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-green-50 text-green-600 border-green-200',
      pending: 'bg-purple-50 text-purple-600 border-purple-200',
      rejected: 'bg-red-50 text-red-600 border-red-200',
      draft: 'bg-slate-50 text-slate-600 border-slate-200'
    };
    const labels = {
      approved: 'Đã công bố',
      pending: 'Chờ công bố',
      rejected: 'Từ chối',
      draft: 'Bản nháp'
    };
    return (
      <span className={`inline-block px-2.5 py-1 text-xs border rounded-full font-medium text-center leading-tight whitespace-nowrap ${styles[status as keyof typeof styles] || styles.pending}`}>
        {labels[status as keyof typeof labels] || 'Chờ công bố'}
      </span>
    );
  };

  const handleViewDetail = (item: PublishedData) => {
    setSelectedData(item);
    setShowDetailModal(true);
  };

  const handleDownload = (fileName: string, format: string = 'Excel') => {
    alert(`Tải xuống tệp dữ liệu: ${fileName}\nĐịnh dạng: ${format}`);
  };

  const runValidation = (file: File, categoryCode: string, isForNewVersion: boolean = false) => {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const isSpreadsheet = ['xlsx', 'xls', 'csv'].includes(extension);

    setIsValidating(true);
    setValidationError(null);
    setValidationSuccess(false);
    setValidationDetails(null);

    if (!isSpreadsheet) {
      setTimeout(() => {
        setValidationSuccess(true);
        setValidationError(null);
        setUploadedPreviewHeaders([]);
        setUploadedPreviewRows([]);
        setIsValidating(false);
      }, 500);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        if (jsonData.length === 0 || !jsonData[0] || jsonData[0].length === 0) {
          setValidationError("Tệp trống hoặc không đọc được dữ liệu dòng đầu tiên.");
          setIsValidating(false);
          return;
        }
        
        const headers = jsonData[0].map(cell => String(cell || '').trim());
        const validation = validateHeaders(categoryCode, headers);
        
        setValidationDetails(validation);
        if (validation.isValid) {
          setValidationSuccess(true);
          setValidationError(null);
          
          setUploadedPreviewHeaders(headers);
          setUploadedPreviewRows(jsonData.slice(1, 6)); 
        } else {
          setValidationSuccess(false);
          setValidationError(`Tệp thiếu các cột bắt buộc: ${validation.missing.join(', ')}`);
        }
      } catch (error) {
        console.error("Lỗi đọc file:", error);
        setValidationError("Đã xảy ra lỗi khi đọc tệp. Vui lòng kiểm tra lại tệp.");
      } finally {
        setIsValidating(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };



  const processFile = (file: File) => {
    const MAX_SIZE = 100 * 1024 * 1024; // 100MB
    if (file.size >= MAX_SIZE) {
      setValidationError("Kích thước tệp quá lớn. Chỉ chấp nhận tệp dưới 100MB.");
      setUploadedFile(null);
      setValidationSuccess(false);
      setValidationDetails(null);
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const allowedExtensions = ['csv', 'xml', 'xlsx', 'docx', 'doc', 'pdf', 'edxml', 'xls'];
    if (!allowedExtensions.includes(extension)) {
      setValidationError("Định dạng tệp không được hỗ trợ. Chỉ chấp nhận các định dạng: CSV, XML, XLSX, DOCX, DOC, PDF, EDXML.");
      setUploadedFile(null);
      setValidationSuccess(false);
      setValidationDetails(null);
      return;
    }

    setUploadedFile(file);
    if (requestCategory) {
      runValidation(file, requestCategory, false);
    } else {
      setValidationError("Vui lòng chọn Danh mục dữ liệu mở trước khi tải tệp lên để chạy kiểm tra.");
      setValidationSuccess(false);
    }
  };

  const createNewRecord = (status: 'pending' | 'draft'): PublishedData => {
    const currentCategoryObj = APPROVED_CATEGORIES.find(c => c.code === requestCategory);
    const dbName = WAREHOUSE_DATABASES.find(db => db.id === sourceDbId)?.name || sourceDbId || 'Cơ sở dữ liệu kho';
    const catName = currentCategoryObj ? currentCategoryObj.name : '';
    const fallback = getPreviewFallback(catName);

    return {
      id: Date.now().toString(),
      fileName: requestFileName || mainTable || 'Tập dữ liệu mới',
      category: currentCategoryObj ? currentCategoryObj.name : 'Danh mục dữ liệu mở',
      publisher: requestPublisher || 'Bộ Tư pháp',
      creator: 'Hệ thống (User)',
      createdDate: new Date().toLocaleDateString('vi-VN'),
      status: status,
      approver: 'Chưa phê duyệt',
      description: requestDescription || 'Yêu cầu công bố dữ liệu mở từ kho dữ liệu',
      format: requestFormat.length > 0 ? requestFormat : ['excel'],
      keywords: requestKeywords || 'dữ liệu mở, kho dữ liệu',
      license: requestLicense || 'Giấy phép dữ liệu mở công cộng',
      fileSize: '-',
      dataSource: dbName,
      previewHeaders: fallback.headers,
      previewRows: fallback.rows,
      frequency: requestFrequency,
      sourceDbId: sourceDbId,
      mainTable: mainTable,
      joinTables: joinTables,
      dataFields: dataFields,
      topic: requestTopic,
      publishImmediately: requestPublishImmediately,
    };
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestFileName) {
      alert("Vui lòng nhập tên tập dữ liệu!");
      setRequestModalTab('general');
      return;
    }
    if (!requestCategory) {
      alert("Vui lòng chọn danh mục dữ liệu mở!");
      setRequestModalTab('general');
      return;
    }
    if (!requestPublisher) {
      alert("Vui lòng nhập đơn vị chủ trì cung cấp!");
      setRequestModalTab('general');
      return;
    }
    if (!requestTopic) {
      alert("Vui lòng chọn chủ đề!");
      setRequestModalTab('general');
      return;
    }
    if (requestFormat.length === 0) {
      alert("Vui lòng chọn ít nhất một định dạng chia sẻ!");
      setRequestModalTab('general');
      return;
    }
    if (requestModalTab === 'general') {
      setRequestModalTab('settings');
      return;
    }
    if (!mainTable) {
      alert("Vui lòng chọn cấu hình nguồn dữ liệu và bảng dữ liệu chính trong tab Thiết lập dữ liệu!");
      setRequestModalTab('settings');
      return;
    }
    if (editingItem) {
      const updatedRecord = { ...createNewRecord('pending'), id: editingItem.id, creator: editingItem.creator, createdDate: editingItem.createdDate };
      setDataList(dataList.map(d => d.id === editingItem.id ? updatedRecord : d));
      setShowRequestModal(false);
      setSuccessPopupMessage('Yêu cầu công bố đã được cập nhật');
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
      resetRequestForm();
    } else {
      // Instead of saving right away, open the send-for-approval modal so the
      // user picks an approver and enters "Nội dung trình duyệt" first.
      const newRecord = createNewRecord('pending');
      setShowRequestModal(false);
      resetRequestForm();
      setSendApprovalItem(newRecord);
      setSendApprovalApprover('');
      setSendApprovalNote('');
      setShowSendApprovalModal(true);
    }
  };

  const handleSaveDraft = () => {
    if (!requestFileName) {
      alert("Vui lòng chọn tập dữ liệu trước khi lưu nháp!");
      return;
    }
    if (editingItem) {
      const updatedRecord = { ...createNewRecord('draft'), id: editingItem.id, creator: editingItem.creator, createdDate: editingItem.createdDate };
      setDataList(dataList.map(d => d.id === editingItem.id ? updatedRecord : d));
      setShowRequestModal(false);
      setSuccessPopupMessage('Yêu cầu công bố đã được lưu nháp');
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
      resetRequestForm();
    } else {
      const newRecord = createNewRecord('draft');
      setDataList([newRecord, ...dataList]);
      setShowRequestModal(false);
      setSuccessPopupMessage('Yêu cầu công bố đã được lưu nháp');
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
      resetRequestForm();
    }
  };

  const resetRequestForm = () => {
    setEditingItem(null);
    setRequestModalTab('general');
    setRequestFileName('');
    setRequestDescription('');
    setRequestCategory('');
    setRequestKeywords('');
    setRequestLicense('Giấy phép dữ liệu mở công cộng');
    setRequestPublisher('Bộ Tư pháp');
    setUploadedFile(null);
    setValidationError(null);
    setValidationSuccess(false);
    setValidationDetails(null);
    setUploadType('file');
    setApiType('internal');
    setSelectedInternalApiId('');
    setApiMethod('GET');
    setApiUrl('');
    setApiParams('');
    setApiHeaders('');
    setApiBody('');
    setApiTitle('');
    setApiDesc('');
    setRequestMetaFile('');
    setRequestFormat([]);
    setRequestFrequency('');
    setRequestTopic('');
    setRequestPublishImmediately(false);
    setSourceDbId('');
    setMainTable('');
    setHasJoin(false);
    setJoinTables([]);
    setDataFields([]);
  };

  const handleEditRequest = (item: PublishedData) => {
    resetRequestForm();
    setEditingItem(item);
    setRequestFileName(item.fileName);
    setRequestDescription(item.description);
    const catObj = APPROVED_CATEGORIES.find(c => c.name === item.category);
    setRequestCategory(catObj ? catObj.code : '');
    setRequestKeywords(item.keywords);
    setRequestLicense(item.license);
    setRequestPublisher(item.publisher);
    setRequestFormat(item.format || []);
    setRequestFrequency(item.frequency || '');
    setRequestTopic(item.topic || '');
    setRequestPublishImmediately(item.publishImmediately || false);
    setSourceDbId(item.sourceDbId || '');
    setMainTable(item.mainTable || '');
    const jts = item.joinTables || [];
    setHasJoin(jts.length > 0);
    setJoinTables(jts);
    setDataFields(item.dataFields || []);
    setShowRequestModal(true);
  };

  // Approval actions
  const handleApprove = (item: PublishedData, opinion?: string) => {
    setDataList(dataList.map(d => d.id === item.id ? {
      ...d,
      status: 'approved',
      approver: 'Lãnh đạo Nghiệp vụ',
      approvalNote: opinion || undefined
    } : d));
    setShowApprovalModal(false);
    setShowApproveForm(false);
    setApproveOpinion('');
    setSuccessPopupMessage('Đã phê duyệt yêu cầu công bố thành công!');
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const handleReject = () => {
    if (!selectedApprovalItem) return;
    if (!rejectReason.trim()) {
      setRejectReasonError(true);
      return;
    }
    setDataList(dataList.map(d => d.id === selectedApprovalItem.id ? {
      ...d,
      status: 'rejected',
      approver: 'Lãnh đạo Nghiệp vụ',
      approvalNote: rejectReason
    } : d));
    setShowApprovalModal(false);
    setShowRejectConfirmModal(false);
    setRejectReason('');
    setRejectReasonError(false);
    setSuccessPopupMessage('Yêu cầu đã bị từ chối công bố.');
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };


  const handleOpenSendApproval = (item: PublishedData) => {
    setSendApprovalItem(item);
    setSendApprovalApprover('');
    setSendApprovalNote('');
    setShowSendApprovalModal(true);
  };

  const handleConfirmSendApproval = () => {
    if (!sendApprovalItem || !sendApprovalApprover) return;
    const approverName = approvers.find(a => a.id === sendApprovalApprover)?.name || '';
    const isNewRequest = !dataList.some(d => d.id === sendApprovalItem.id);
    if (isNewRequest) {
      setDataList([
        { ...sendApprovalItem, status: 'pending', approver: approverName, submitNote: sendApprovalNote },
        ...dataList
      ]);
    } else {
      setDataList(dataList.map(d => d.id === sendApprovalItem.id
        ? { ...d, status: 'pending', approver: approverName, submitNote: sendApprovalNote }
        : d
      ));
    }
    setShowSendApprovalModal(false);
    setSendApprovalItem(null);
    setSendApprovalApprover('');
    setSendApprovalNote('');
    setSuccessPopupMessage('Yêu cầu công bố đã được gửi đi phê duyệt thành công!');
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const renderPagination = (total: number) => {
    if (total <= 0) return null;
    const totalPages = Math.ceil(total / pageSize);
    const startItem = (currentPageNum - 1) * pageSize + 1;
    const endItem = Math.min(currentPageNum * pageSize, total);

    return (
      <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white text-[13px] text-slate-600">
        <div className="flex items-center gap-2">
          <span>Hiển thị</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPageNum(1);
            }}
            className="px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-[13px] cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>bản ghi/trang</span>
        </div>

        <div className="flex items-center gap-4">
          <span>
            {startItem} - {endItem} / {total}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPageNum(Math.max(1, currentPageNum - 1))}
              disabled={currentPageNum === 1}
              className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPageNum(page)}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-[13px] transition-colors cursor-pointer ${
                  currentPageNum === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-[#e2e8f0] text-slate-600 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPageNum(Math.min(totalPages, currentPageNum + 1))}
              disabled={currentPageNum === totalPages}
              className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Tabs Header - Styled matching the mockup */}
      <div className="bg-white border-b border-slate-200">
        <div className="flex px-6 gap-6">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-2 px-6 py-4 text-[13px] transition-all border-b-2 font-medium cursor-pointer ${
              activeTab === 'requests'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50 font-medium'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <FileText className={`w-4 h-4 ${activeTab === 'requests' ? 'text-blue-600' : 'text-slate-400'}`} />
            Yêu cầu công bố
          </button>
          <button
            onClick={() => {
              setActiveTab('approval');
              setShowRejectForm(false);
              setRejectReason('');
            }}
            className={`flex items-center gap-2 px-6 py-4 text-[13px] transition-all border-b-2 font-medium cursor-pointer ${
              activeTab === 'approval'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50 font-medium'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <CheckCircle className={`w-4 h-4 ${activeTab === 'approval' ? 'text-blue-600' : 'text-slate-400'}`} />
            Phê duyệt dữ liệu mở
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-2 px-6 py-4 text-[13px] transition-all border-b-2 font-medium cursor-pointer ${
              activeTab === 'schedule'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50 font-medium'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Calendar className={`w-4 h-4 ${activeTab === 'schedule' ? 'text-blue-600' : 'text-slate-400'}`} />
            Lịch công bố
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-6 pb-6">
        
        {/* RENDER TAB 1: YÊU CẦU CÔNG BỐ */}
        {activeTab === 'requests' && (
          <div className="space-y-4 animate-fade-in">
                        {/* Filter and Search Row */}
            <div className="flex flex-col md:flex-row items-center gap-3 w-full">
              <div className="flex-1 flex items-center gap-2 w-full">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo mã, tên tệp dữ liệu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 bg-white hover:bg-slate-50/50 font-medium shadow-sm"
                  />
                </div>

                {/* Search Button */}
                <button
                  type="button"
                  className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 transition-all cursor-pointer active:scale-95 shadow-sm"
                  title="Tìm kiếm"
                >
                  <Search className="w-4 h-4" />
                </button>

                {/* Filter Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all border cursor-pointer active:scale-95 ${
                    showFilters
                      ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                  }`}
                  title={showFilters ? "Đóng bộ lọc" : "Bộ lọc nâng cao"}
                >
                  {showFilters ? <X className="w-4.5 h-4.5" /> : <Filter className="w-4 h-4" />}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    resetRequestForm();
                    setShowRequestModal(true);
                  }}
                  className="flex-1 md:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[13px] font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm whitespace-nowrap cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Gửi yêu cầu công bố
                </button>
              </div>
            </div>

            {/* Advanced Collapsible Filter Panel */}
            {showFilters && (
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[13px] text-black mb-2">Trạng thái yêu cầu</label>
                    <div className="relative">
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                      >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="draft">Bản nháp</option>
                        <option value="pending">Chờ công bố</option>
                        <option value="approved">Đã công bố</option>
                        <option value="rejected">Từ chối</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] text-black mb-2">Danh mục mở</label>
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                      >
                        <option value="all">Tất cả danh mục</option>
                        <option value="Danh sách tổ chức thực hiện trợ giúp pháp lý">Danh sách tổ chức thực hiện trợ giúp pháp lý</option>
                        <option value="Danh sách người thực hiện trợ giúp pháp lý">Danh sách người thực hiện trợ giúp pháp lý</option>
                        <option value="Danh sách Luật sư Việt Nam">Danh sách Luật sư Việt Nam</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] text-black mb-2">Cơ quan công bố</label>
                    <div className="relative">
                      <select
                        value={selectedPublisher}
                        onChange={(e) => setSelectedPublisher(e.target.value)}
                        className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                      >
                        <option value="all">Tất cả cơ quan</option>
                        <option value="Bộ Tư pháp">Bộ Tư pháp</option>
                        <option value="Cục Bổ trợ tư pháp">Cục Bổ trợ tư pháp</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}


{/* Grid Data Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-center font-semibold text-slate-700 whitespace-nowrap w-16 text-[13px]">STT</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[13px]">Tên tệp dữ liệu</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[13px]">Danh mục</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[13px]">Cơ quan công bố</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[13px]">Người tạo</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[13px]">Ngày tạo</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[13px]">Người phê duyệt</th>
                      <th className="px-6 py-4 text-center font-semibold text-slate-700 whitespace-nowrap text-[13px] w-32">Trạng thái</th>
                      <th className="px-6 py-4 text-center font-semibold text-slate-700 whitespace-nowrap text-[13px] w-28">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {paginatedRequests.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-8 text-center text-slate-500 text-[13px]">
                          Không tìm thấy yêu cầu công bố nào.
                        </td>
                      </tr>
                    ) : (
                      paginatedRequests.map((item, index) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-all border-b border-slate-100">
                          <td className="px-4 py-3 text-center text-slate-500 font-medium text-[13px]">
                            {(currentPageNum - 1) * pageSize + index + 1}
                          </td>
                          <td className="px-4 py-3 text-left text-[13px]">
                            <div
                              className="text-black"
                              onClick={() => handleViewDetail(item)}
                            >
                              {item.fileName || 'Không có tên tệp'}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-left text-slate-700 font-medium text-[13px]">{item.category}</td>
                          <td className="px-4 py-3 text-left text-slate-650 text-[13px]">{item.publisher}</td>
                          <td className="px-4 py-3 text-left text-slate-600 font-medium text-[13px]">{item.creator}</td>
                          <td className="px-4 py-3 text-left text-slate-600 text-[13px]">{item.createdDate}</td>
                          <td className="px-4 py-3 text-left text-slate-600 text-[13px]">{item.approver}</td>
                          <td className="px-4 py-3 text-center text-[13px]">{getStatusBadge(item.status)}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleViewDetail(item)}
                                className="p-1.5 text-slate-500 hover:text-black hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                title="Xem chi tiết"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditRequest(item)}
                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                title="Chỉnh sửa"
                              >
                                <SquarePen className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => item.status === 'draft' ? handleOpenSendApproval(item) : undefined}
                                disabled={item.status !== 'draft'}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  item.status === 'draft'
                                    ? 'text-slate-500 hover:text-purple-600 hover:bg-purple-50 cursor-pointer'
                                    : 'text-slate-300 cursor-not-allowed'
                                }`}
                                title="Gửi duyệt"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {renderPagination(totalItemsCount)}
            </div>
          </div>
        )}

        {/* RENDER TAB 2: PHÊ DUYỆT */}
        {activeTab === 'approval' && (
          <div className="space-y-4 animate-fade-in">
                        {/* Filter and Search Row */}
            <div className="flex flex-col md:flex-row items-center gap-3 w-full">
              <div className="flex-1 flex items-center gap-2 w-full">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên tệp dữ liệu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 bg-white hover:bg-slate-50/50 font-medium shadow-sm"
                  />
                </div>

                {/* Search Button */}
                <button
                  type="button"
                  className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 transition-all cursor-pointer active:scale-95 shadow-sm"
                  title="Tìm kiếm"
                >
                  <Search className="w-4 h-4" />
                </button>

                {/* Filter Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all border cursor-pointer active:scale-95 ${
                    showFilters
                      ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-655 hover:bg-slate-50'
                  }`}
                  title={showFilters ? "Đóng bộ lọc" : "Bộ lọc nâng cao"}
                >
                  {showFilters ? <X className="w-4.5 h-4.5" /> : <Filter className="w-4 h-4" />}
                </button>
              </div>


            </div>

            {/* Advanced Collapsible Filter Panel */}
            {showFilters && (
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[13px] text-black mb-2">Trạng thái yêu cầu</label>
                    <div className="relative">
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                      >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="pending">Chờ công bố</option>
                        <option value="approved">Đã công bố</option>
                        <option value="rejected">Từ chối</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] text-black mb-2">Danh mục mở</label>
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                      >
                        <option value="all">Tất cả danh mục</option>
                        <option value="Danh sách tổ chức thực hiện trợ giúp pháp lý">Danh sách tổ chức thực hiện trợ giúp pháp lý</option>
                        <option value="Danh sách người thực hiện trợ giúp pháp lý">Danh sách người thực hiện trợ giúp pháp lý</option>
                        <option value="Danh sách Luật sư Việt Nam">Danh sách Luật sư Việt Nam</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] text-black mb-2">Cơ quan công bố</label>
                    <div className="relative">
                      <select
                        value={selectedPublisher}
                        onChange={(e) => setSelectedPublisher(e.target.value)}
                        className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                      >
                        <option value="all">Tất cả cơ quan</option>
                        <option value="Bộ Tư pháp">Bộ Tư pháp</option>
                        <option value="Cục Bổ trợ tư pháp">Cục Bổ trợ tư pháp</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}


{/* Grid Data Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-center font-semibold text-slate-700 whitespace-nowrap w-16 text-[13px]">STT</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[13px]">Tên tập dữ liệu</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[13px]">Danh mục</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[13px]">Cơ quan công bố</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[13px]">Người tạo</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[13px]">Ngày tạo</th>
                      <th className="px-6 py-4 text-center font-semibold text-slate-700 whitespace-nowrap text-[13px] w-32">Trạng thái</th>
                      <th className="px-6 py-4 text-center font-semibold text-slate-700 whitespace-nowrap text-[13px] w-28">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {paginatedApprovalRequests.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-slate-500 text-[13px]">
                          Không có yêu cầu công bố nào được tìm thấy.
                        </td>
                      </tr>
                    ) : (
                      paginatedApprovalRequests.map((item, index) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-all border-b border-slate-100">
                          <td className="px-4 py-3 text-center text-slate-500 font-medium text-[13px]">{(currentPageNum - 1) * pageSize + index + 1}</td>
                          <td className="px-4 py-3 text-left text-[13px]">
                            <span
                              className="text-black"
                              onClick={() => {
                                setSelectedApprovalItem(item);
                                setRejectReason('');
                                setShowRejectForm(false);
                                setShowApprovalModal(true);
                              }}
                            >
                              {item.fileName}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-700 font-medium text-[13px]">{item.category}</td>
                          <td className="px-4 py-3 text-slate-500 text-[13px]">{item.publisher}</td>
                          <td className="px-4 py-3 text-slate-700 font-medium text-[13px]">{item.creator}</td>
                          <td className="px-4 py-3 text-slate-550 text-[13px]">{item.createdDate}</td>
                          <td className="px-4 py-3 text-center text-[13px]">{getStatusBadge(item.status)}</td>
                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedApprovalItem(item);
                                setRejectReason('');
                                setShowRejectForm(false);
                                setShowApprovalModal(true);
                              }}
                              className="p-1.5 text-slate-700 hover:text-black hover:bg-slate-100 rounded-lg inline-flex items-center justify-center cursor-pointer transition-colors"
                              title="Xem chi tiết & Phê duyệt"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {renderPagination(totalApprovalItemsCount)}
            </div>
          </div>
        )}



        {/* RENDER TAB 4: LỊCH CÔNG BỐ */}
        {activeTab === 'schedule' && (
          <div className="space-y-4 animate-fade-in">
            {/* Filter and Search Row */}
            <div className="flex flex-col md:flex-row items-center gap-3 w-full">
              <div className="flex-1 flex items-center gap-2 w-full">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên tập dữ liệu, nguồn dữ liệu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 bg-white hover:bg-slate-50/50 font-medium shadow-sm"
                  />
                </div>

                {/* Search Button */}
                <button
                  type="button"
                  className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 transition-all cursor-pointer active:scale-95 shadow-sm"
                  title="Tìm kiếm"
                >
                  <Search className="w-4 h-4" />
                </button>

                {/* Filter Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all border cursor-pointer active:scale-95 ${
                    showFilters
                      ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-655 hover:bg-slate-50'
                  }`}
                  title={showFilters ? "Đóng bộ lọc" : "Bộ lọc nâng cao"}
                >
                  {showFilters ? <X className="w-4.5 h-4.5" /> : <Filter className="w-4 h-4" />}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setScheduleFormData({
                      datasetId: '',
                      frequency: 'daily',
                      startTime: '08:00',
                      startDate: '',
                      endDate: '',
                      publishFormat: 'api',
                      targetAudience: '',
                      contactInfo: '',
                      dataSource: '',
                      weeklyDays: [],
                      monthlyDay: 1,
                      quarterlyDay: 1,
                      quarterlyMonth: 1
                    });
                    setIsEditingSchedule(false);
                    setSelectedSchedule(null);
                    setShowScheduleModal(true);
                  }}
                  className="flex-1 lg:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[13px] font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm whitespace-nowrap cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Thêm lịch mới
                </button>
              </div>
            </div>

            {/* Advanced Collapsible Filter Panel */}
            {showFilters && (
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] text-black mb-2">Tần suất công bố</label>
                    <div className="relative">
                      <select
                        value={selectedScheduleFrequency}
                        onChange={(e) => setSelectedScheduleFrequency(e.target.value)}
                        className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                      >
                        <option value="all">Tất cả tần suất</option>
                        <option value="daily">Hàng ngày</option>
                        <option value="weekly">Hàng tuần</option>
                        <option value="monthly">Hàng tháng</option>
                        <option value="quarterly">Hàng quý</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] text-black mb-2">Trạng thái lịch</label>
                    <div className="relative">
                      <select
                        value={selectedScheduleStatus}
                        onChange={(e) => setSelectedScheduleStatus(e.target.value)}
                        className="w-full pl-3 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                      >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Tạm dừng</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Schedules Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-center font-semibold text-slate-700 whitespace-nowrap w-16 text-[13px]">STT</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[13px]">Tên tập dữ liệu</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[13px] w-28">Mã</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[13px]">Tần suất</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[13px]">Giờ chạy</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[13px]">Lần chạy cuối</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700 whitespace-nowrap text-[13px]">Lần chạy tiếp</th>
                      <th className="px-6 py-4 text-center font-semibold text-slate-700 whitespace-nowrap text-[13px] w-32">Trạng thái</th>
                      <th className="px-6 py-4 text-center font-semibold text-slate-700 whitespace-nowrap text-[13px] w-28">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {paginatedSchedules.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-8 text-center text-slate-500 text-[13px]">
                          Không tìm thấy lịch công bố nào.
                        </td>
                      </tr>
                    ) : (
                      paginatedSchedules.map((schedule, index) => (
                        <tr key={schedule.id} className="hover:bg-slate-50 transition-all border-b border-slate-100">
                          <td className="px-4 py-3 text-center text-slate-500 font-medium text-[13px]">
                            {(currentPageNum - 1) * pageSize + index + 1}
                          </td>
                          <td className="px-4 py-3 text-left text-[13px]">
                            <div>
                              <span
                                className="text-black"
                                onClick={() => {
                                  setSelectedSchedule(schedule);
                                  setIsEditingSchedule(true);
                                  setScheduleFormData({
                                    datasetId: schedule.datasetCode,
                                    frequency: schedule.frequency,
                                    startTime: schedule.startTime,
                                    dataSource: schedule.dataSource,
                                    startDate: schedule.startDate || '',
                                    endDate: schedule.endDate || '',
                                    publishFormat: schedule.publishFormat || 'api',
                                    targetAudience: schedule.targetAudience || '',
                                    contactInfo: schedule.contactInfo || '',
                                    weeklyDays: schedule.weeklyDays || [],
                                    monthlyDay: schedule.monthlyDay || 1,
                                    quarterlyDay: schedule.quarterlyDay || 1,
                                    quarterlyMonth: schedule.quarterlyMonth || 1
                                  });
                                  setShowScheduleModal(true);
                                }}
                              >
                                {schedule.datasetName}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-left text-[13px]">
                            <code className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono font-medium text-slate-700">
                              {schedule.datasetCode}
                            </code>
                          </td>
                          <td className="px-4 py-3 text-[13px]">
                            <div className="font-semibold text-slate-800">
                              {schedule.frequency === 'daily' ? 'Hàng ngày' : schedule.frequency === 'weekly' ? 'Hàng tuần' : schedule.frequency === 'monthly' ? 'Hàng tháng' : 'Hàng quý'}
                            </div>
                            {schedule.frequency === 'weekly' && schedule.weeklyDays && schedule.weeklyDays.length > 0 && (
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                {schedule.weeklyDays.join(', ')}
                              </div>
                            )}
                            {schedule.frequency === 'monthly' && schedule.monthlyDay && (
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                Ngày {schedule.monthlyDay} hàng tháng
                              </div>
                            )}
                            {schedule.frequency === 'quarterly' && schedule.quarterlyMonth && schedule.quarterlyDay && (
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                Tháng thứ {schedule.quarterlyMonth}, ngày {schedule.quarterlyDay}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-slate-700 font-medium">{schedule.startTime}</td>
                          <td className="px-4 py-3.5 text-slate-500">{schedule.lastRun || 'Chưa chạy'}</td>
                          <td className="px-4 py-3.5 text-slate-600 font-semibold">{schedule.nextRun}</td>
                          <td className="px-4 py-3.5 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs border ${schedule.status === 'active' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                              {schedule.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => {
                                  setSelectedSchedule(schedule);
                                  setIsEditingSchedule(true);
                                  setScheduleFormData({
                                    datasetId: schedule.datasetCode,
                                    frequency: schedule.frequency,
                                    startTime: schedule.startTime,
                                    dataSource: schedule.dataSource,
                                    startDate: schedule.startDate || '',
                                    endDate: schedule.endDate || '',
                                    publishFormat: schedule.publishFormat || 'api',
                                    targetAudience: schedule.targetAudience || '',
                                    contactInfo: schedule.contactInfo || '',
                                    weeklyDays: schedule.weeklyDays || [],
                                    monthlyDay: schedule.monthlyDay || 1,
                                    quarterlyDay: schedule.quarterlyDay || 1,
                                    quarterlyMonth: schedule.quarterlyMonth || 1
                                  });
                                  setShowScheduleModal(true);
                                }}
                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                                title="Sửa lịch"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              {schedule.status === 'active' ? (
                                <button
                                  onClick={() => setScheduleStatusConfirm({ schedule, action: 'pause' })}
                                  className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg cursor-pointer transition-colors"
                                  title="Tạm dừng"
                                >
                                  <PauseCircle className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => setScheduleStatusConfirm({ schedule, action: 'resume' })}
                                  className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer transition-colors"
                                  title="Tiếp tục"
                                >
                                  <PlayCircle className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedSchedule(schedule);
                                  setShowDeleteScheduleModal(true);
                                }}
                                className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                                title="Xóa lịch"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {renderPagination(totalScheduleItemsCount)}
            </div>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {showDetailModal && selectedData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Chi tiết Yêu cầu công bố dữ liệu mở</h3>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 flex-1 text-[13px]">

              {/* ── Tên tập dữ liệu ── */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <div className="text-[11px] text-black uppercase tracking-wider mb-1">Tên tập dữ liệu</div>
                  <div className="text-[13px] text-black flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                    {selectedData.fileName || 'Không có tên tệp'}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-black uppercase tracking-wider mb-1">Trạng thái</div>
                  <div>{getStatusBadge(selectedData.status)}</div>
                </div>
                <div>
                  <div className="text-[11px] text-black uppercase tracking-wider mb-1">Người phê duyệt</div>
                  <div className="text-[13px] text-black">{selectedData.approver}</div>
                </div>

                <div>
                  <div className="text-[11px] text-black uppercase tracking-wider mb-1">Người tạo yêu cầu</div>
                  <div className="text-[13px] text-black">{selectedData.creator}</div>
                </div>
                <div>
                  <div className="text-[11px] text-black uppercase tracking-wider mb-1">Ngày tạo yêu cầu</div>
                  <div className="text-[13px] text-black">{selectedData.createdDate}</div>
                </div>

                <div>
                  <div className="text-[11px] text-black uppercase tracking-wider mb-1">Danh mục dữ liệu mở</div>
                  <div className="text-[13px] text-black">{selectedData.category}</div>
                </div>
                <div>
                  <div className="text-[11px] text-black uppercase tracking-wider mb-1">Đơn vị chủ trì cung cấp</div>
                  <div className="text-[13px] text-black">{selectedData.publisher}</div>
                </div>

                <div>
                  <div className="text-[11px] text-black uppercase tracking-wider mb-1">Giấy phép</div>
                  <div className="text-[13px] text-black">{selectedData.license}</div>
                </div>
                <div>
                  <div className="text-[11px] text-black uppercase tracking-wider mb-1">Từ khóa</div>
                  <div className="text-[13px] text-black">{selectedData.keywords || 'N/A'}</div>
                </div>

                <div>
                  <div className="text-[11px] text-black uppercase tracking-wider mb-1">Định dạng chia sẻ</div>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {(selectedData.format || []).length > 0
                      ? selectedData.format.map((fmt, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-blue-50 text-black border border-blue-100 rounded text-[13px]">{fmt}</span>
                        ))
                      : <span className="text-[13px] text-black">—</span>
                    }
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-black uppercase tracking-wider mb-1">Tần suất cập nhật</div>
                  <div className="text-[13px] text-black">{getFrequencyLabel(selectedData.frequency || '') || '—'}</div>
                </div>

                <div>
                  <div className="text-[11px] text-black uppercase tracking-wider mb-1">Chủ đề</div>
                  <div className="text-[13px] text-black">{selectedData.topic || '—'}</div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <div className="text-[11px] text-black uppercase tracking-wider mb-1">Thông tin mô tả</div>
                  <div className="text-[13px] text-black whitespace-pre-wrap">{selectedData.description || '—'}</div>
                </div>

                <div className="col-span-1 md:col-span-2 flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    id="detailPublishImmediately"
                    checked={selectedData.publishImmediately || false}
                    disabled
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-not-allowed"
                  />
                  <label htmlFor="detailPublishImmediately" className="text-slate-700 select-none cursor-not-allowed">
                    Công bố dữ liệu ngay sau khi được phê duyệt
                  </label>
                </div>
              </div>

              {/* ── Ý kiến phê duyệt / Lý do từ chối ── */}
              {(selectedData.status === 'approved' || selectedData.status === 'rejected') && (
                <div className={`rounded-xl border p-4 ${selectedData.status === 'approved' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {selectedData.status === 'approved'
                      ? <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                      : <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                    }
                    <span className={`text-[11px] font-semibold uppercase tracking-wider ${selectedData.status === 'approved' ? 'text-green-700' : 'text-red-600'}`}>
                      {selectedData.status === 'approved' ? 'Ý kiến phê duyệt' : 'Lý do từ chối'}
                    </span>
                  </div>
                  <p className={`text-[13px] leading-relaxed ${selectedData.status === 'approved' ? 'text-green-900' : 'text-red-900'}`}>
                    {selectedData.approvalNote || '—'}
                  </p>
                </div>
              )}

              {/* ── Cấu hình nguồn dữ liệu ── */}
              {(() => {
                const meta = getRecordMetadataConfig(selectedData);
                const dbName = WAREHOUSE_DATABASES.find(db => db.id === meta.dbId)?.name || meta.dbId;
                return (
                  <section className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center gap-2">
                      <Database className="w-4 h-4 text-white" />
                      <h4 className="text-[13px] text-white">Cấu hình nguồn dữ liệu</h4>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 bg-white rounded-lg border border-slate-200">
                          <div className="text-[11px] text-black uppercase tracking-wider mb-1">Kho dữ liệu</div>
                          <div className="text-[13px] text-black flex items-center gap-1.5">
                            <Database className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            {dbName || '—'}
                          </div>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-slate-200">
                          <div className="text-[11px] text-black uppercase tracking-wider mb-1">Bảng dữ liệu chính</div>
                          <div className="text-[13px] text-black font-mono">{meta.mainTable || '—'}</div>
                        </div>
                      </div>

                      {meta.joinTables.length > 0 && (
                        <div>
                          <div className="text-[11px] text-black uppercase tracking-wider mb-2">Bảng liên kết (Join)</div>
                          <div className="space-y-1.5">
                            {meta.joinTables.map((jt, idx) => (
                              <div key={idx} className="bg-white border border-slate-200 rounded-lg px-3 py-2 flex items-center justify-between text-[13px] text-black">
                                <span className="font-mono">{jt.tableId} <span className="text-slate-400">({jt.alias})</span></span>
                                <span className="text-black">{jt.joinType} ON {jt.joinColA} = {jt.joinColB}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {meta.dataFields.length > 0 && (
                        <div>
                          <div className="text-[11px] text-black uppercase tracking-wider mb-2">Trường dữ liệu chia sẻ ({meta.dataFields.filter((f: any) => f.shared).length}/{meta.dataFields.length})</div>
                          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                            <table className="w-full text-left text-[13px] border-collapse">
                              <thead>
                                <tr className="bg-slate-50 text-black border-b border-slate-200">
                                  <th className="px-3 py-2 text-[13px] uppercase">Trường gốc</th>
                                  <th className="px-3 py-2 text-[13px] uppercase">Bảng nguồn</th>
                                  <th className="px-3 py-2 text-[13px] uppercase">Tên trường (API)</th>
                                  <th className="px-3 py-2 text-[13px] uppercase">Kiểu dữ liệu</th>
                                  <th className="px-3 py-2 text-[13px] uppercase text-center">Che dấu</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-black">
                                {meta.dataFields.filter((f: any) => f.shared).map((df: any, idx: number) => (
                                  <tr key={idx} className="hover:bg-slate-50">
                                    <td className="px-3 py-2 font-mono text-[13px]">{df.column}</td>
                                    <td className="px-3 py-2 text-[13px]">
                                      <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[13px] font-mono text-slate-600">{df.tableId}</span>
                                    </td>
                                    <td className="px-3 py-2 font-mono text-[13px]">{df.apiField}</td>
                                    <td className="px-3 py-2 text-[13px]">
                                      <span className={`px-1.5 py-0.5 rounded border text-[13px] ${
                                        df.dataType === 'date' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                                        df.dataType === 'number' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                        'bg-slate-50 text-slate-600 border-slate-200'
                                      }`}>{df.dataType}</span>
                                    </td>
                                    <td className="px-3 py-2 text-center text-[13px]">
                                      <span className={`px-1.5 py-0.5 rounded border text-[13px] ${df.masked ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                        {df.masked ? 'Có' : 'Không'}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                );
              })()}
            </div>

            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-[13px]"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST MODAL */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                {editingItem ? <Edit2 className="w-5 h-5 text-blue-600" /> : <Send className="w-5 h-5 text-blue-600" />}
                <h3 className="text-lg font-bold text-slate-900">{editingItem ? 'Chỉnh sửa yêu cầu công bố' : 'Gửi yêu cầu công bố dữ liệu'}</h3>
              </div>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* TAB SELECTOR */}
            <div className="px-6 border-b border-slate-200 bg-white flex gap-6 z-10 shrink-0">
              <button
                type="button"
                onClick={() => setRequestModalTab('general')}
                className={`px-4 py-3 text-[13px] font-medium transition-all border-b-2 cursor-pointer ${
                  requestModalTab === 'general'
                    ? 'border-blue-600 text-blue-700 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Thông tin chung
              </button>
              <button
                type="button"
                onClick={() => setRequestModalTab('settings')}
                className={`px-4 py-3 text-[13px] font-medium transition-all border-b-2 cursor-pointer ${
                  requestModalTab === 'settings'
                    ? 'border-blue-600 text-blue-700 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Thiết lập dữ liệu
              </button>
            </div>
            
            <form onSubmit={handleRequestSubmit} className="p-6 space-y-6 flex-1 text-[13px]">
              {requestModalTab === 'general' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-slate-700 mb-1">
                    Tên tập dữ liệu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập tên tập dữ liệu công bố..."
                    value={requestFileName}
                    onChange={(e) => setRequestFileName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-slate-700 mb-1">
                    Danh mục dữ liệu mở <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={requestCategory}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      setRequestCategory(newCat);
                      
                      // Reset selected metadata if it doesn't match the new category
                      const fileConfig = CONFIGURED_METADATA_FILES.find(f => f.fileName === requestMetaFile);
                      if (fileConfig && fileConfig.categoryCode !== newCat) {
                        setRequestMetaFile('');
                        setRequestLicense('Giấy phép dữ liệu mở công cộng');
                        setRequestKeywords('');
                        setRequestPublisher('Bộ Tư pháp');
                        setRequestDescription('');
                        setRequestFormat([]);
                        setRequestFrequency('');
                        setSourceDbId('');
                        setMainTable('');
                        setHasJoin(false);
                        setJoinTables([]);
                        setDataFields([]);
                      }

                      if (uploadedFile) {
                        if (newCat) {
                          runValidation(uploadedFile, newCat, false);
                        } else {
                          setValidationError('Vui lòng chọn Danh mục dữ liệu mở để kiểm tra cấu trúc metadata của tệp.');
                          setValidationSuccess(false);
                          setValidationDetails(null);
                        }
                      }
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">-- Chọn danh mục dữ liệu mở --</option>
                    {APPROVED_CATEGORIES.map(cat => (
                      <option key={cat.code} value={cat.code}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-slate-700 mb-1">Chọn metadata</label>
                  <select
                    value={requestMetaFile}
                    disabled={!requestCategory}
                    onChange={(e) => {
                      const selectedFile = e.target.value;
                      setRequestMetaFile(selectedFile);
                      const fileConfig = CONFIGURED_METADATA_FILES.find(f => f.fileName === selectedFile);
                      if (fileConfig) {
                        setRequestCategory(fileConfig.categoryCode);
                        setRequestLicense(fileConfig.license);
                        setRequestKeywords(fileConfig.keywords);
                        setRequestPublisher(fileConfig.publisher);
                        setRequestDescription(fileConfig.description);
                        setRequestFormat(fileConfig.shareFormat ? [fileConfig.shareFormat] : []);
                        setRequestFrequency(fileConfig.frequency || '');
                        const dbId = CATEGORY_TO_DB[fileConfig.categoryCode] || '';
                        setSourceDbId(dbId);
                        const mt = fileConfig.mainTable || '';
                        const joinNames = fileConfig.joinTableNames || [];
                        const jts = joinNames.map((name, i) => ({
                          id: `join_${i}_${name}`,
                          tableId: name,
                          alias: `t${i + 2}`,
                          joinType: 'LEFT JOIN',
                          joinColA: `t${i + 2}.id`,
                          joinColB: `${mt}.id`,
                        }));
                        setMainTable(mt);
                        setHasJoin(joinNames.length > 0);
                        setJoinTables(jts);
                        setDataFields(dbId && mt ? buildAllDataFields(dbId, mt, joinNames) : []);
                        setValidationError(null);
                        setValidationSuccess(false);
                      } else {
                        setRequestCategory('');
                        setRequestLicense('Giấy phép dữ liệu mở công cộng');
                        setRequestKeywords('');
                        setRequestPublisher('Bộ Tư pháp');
                        setRequestDescription('');
                        setRequestFormat([]);
                        setRequestFrequency('');
                        setSourceDbId('');
                        setMainTable('');
                        setHasJoin(false);
                        setJoinTables([]);
                        setDataFields([]);
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                      !requestCategory ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : 'border-slate-300'
                    }`}
                  >
                    <option value="">
                      {!requestCategory ? '-- Vui lòng chọn danh mục dữ liệu mở trước --' : '-- Chọn cấu hình metadata --'}
                    </option>
                    {CONFIGURED_METADATA_FILES.filter(file => file.categoryCode === requestCategory).map(file => (
                      <option key={file.fileName} value={file.fileName}>
                        {file.categoryName} ({file.fileName})
                      </option>
                    ))}
                  </select>
                </div>

                {(() => {
                  const metaCfg = CONFIGURED_METADATA_FILES.find(f => f.fileName === requestMetaFile);
                  if (!metaCfg) return null;
                  const freqLabel: Record<string, string> = { daily: 'Theo ngày', weekly: 'Theo tuần', monthly: 'Theo tháng', quarterly: 'Theo quý', yearly: 'Theo năm' };
                  const shareFormatLabel: Record<string, string> = { excel: 'File Excel', api: 'API' };
                  return (
                    <div className="col-span-1 md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px]">M</span>
                        <span className="text-blue-800 text-[13px]">Thông tin metadata đã cấu hình</span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[12px]">
                        <div className="flex gap-1">
                          <span className="text-slate-500 shrink-0">Danh mục:</span>
                          <span className="text-slate-800">{metaCfg.categoryName}</span>
                        </div>
                        <div className="flex gap-1">
                          <span className="text-slate-500 shrink-0">Đơn vị chủ trì cung cấp:</span>
                          <span className="text-slate-800">{metaCfg.publisher}</span>
                        </div>
                        <div className="flex gap-1">
                          <span className="text-slate-500 shrink-0">Giấy phép:</span>
                          <span className="text-slate-800">{metaCfg.license}</span>
                        </div>
                        <div className="flex gap-1">
                          <span className="text-slate-500 shrink-0">Tần suất cập nhật:</span>
                          <span className="text-slate-800">{metaCfg.frequency ? (freqLabel[metaCfg.frequency] || metaCfg.frequency) : '—'}</span>
                        </div>
                        <div className="flex gap-1">
                          <span className="text-slate-500 shrink-0">Bảng chính:</span>
                          <span className="text-slate-800 font-mono">{metaCfg.mainTable || '—'}</span>
                        </div>
                        <div className="flex gap-1">
                          <span className="text-slate-500 shrink-0">Bảng join:</span>
                          <span className="text-slate-800 font-mono">{metaCfg.joinTableNames && metaCfg.joinTableNames.length > 0 ? metaCfg.joinTableNames.join(', ') : '—'}</span>
                        </div>
                        <div className="flex gap-1">
                          <span className="text-slate-500 shrink-0">Định dạng chia sẻ:</span>
                          <span className="text-blue-700">{metaCfg.shareFormat ? (shareFormatLabel[metaCfg.shareFormat] || metaCfg.shareFormat) : '—'}</span>
                        </div>
                        <div className="flex gap-1">
                          <span className="text-slate-500 shrink-0">Từ khóa:</span>
                          <span className="text-slate-800">{metaCfg.keywords}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <div>
                  <label className="block text-slate-700 mb-1">
                    Giấy phép <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={requestLicense}
                    onChange={(e) => setRequestLicense(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Giấy phép dữ liệu mở công cộng">Giấy phép dữ liệu mở công cộng</option>
                    <option value="Giấy phép ODC-BY">Giấy phép ODC-BY</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Từ khóa</label>
                  <input
                    type="text"
                    placeholder="Ngăn cách bằng dấu phẩy, vd: luat, tgpl, tro giup"
                    value={requestKeywords}
                    onChange={(e) => setRequestKeywords(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">
                    Đơn vị chủ trì cung cấp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập tên đơn vị chủ trì cung cấp"
                    value={requestPublisher}
                    onChange={(e) => setRequestPublisher(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">
                    Chủ đề <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={requestTopic}
                    onChange={(e) => setRequestTopic(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">-- Chọn chủ đề --</option>
                    <option value="Trợ giúp pháp lý">Trợ giúp pháp lý</option>
                    <option value="Luật sư">Luật sư</option>
                    <option value="Tư vấn pháp luật">Tư vấn pháp luật</option>
                    <option value="Công chứng">Công chứng</option>
                    <option value="Quản lý, thanh lý tài sản, Đấu giá">Quản lý, thanh lý tài sản, Đấu giá</option>
                    <option value="Giám định">Giám định</option>
                    <option value="Trọng tài">Trọng tài</option>
                    <option value="Hòa giải">Hòa giải</option>
                    <option value="Thống kê ngành Tư pháp">Thống kê ngành Tư pháp</option>
                    <option value="Tài sản thi hành án">Tài sản thi hành án</option>
                    <option value="Báo cáo viên pháp luật">Báo cáo viên pháp luật</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Tần suất cập nhật</label>
                  <select
                    value={requestFrequency}
                    onChange={(e) => setRequestFrequency(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">-- Chọn tần suất --</option>
                    <option value="daily">Theo ngày</option>
                    <option value="weekly">Theo tuần</option>
                    <option value="monthly">Theo tháng</option>
                    <option value="quarterly">Theo quý</option>
                    <option value="yearly">Theo năm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">
                    Định dạng chia sẻ <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    {[{ value: 'excel', label: 'File Excel' }, { value: 'api', label: 'API' }].map(opt => (
                      <label key={opt.value} className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={requestFormat.includes(opt.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setRequestFormat([...requestFormat, opt.value]);
                            } else {
                              setRequestFormat(requestFormat.filter(v => v !== opt.value));
                            }
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-slate-700">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-slate-700 mb-1">Thông tin mô tả</label>
                  <textarea
                    rows={2}
                    placeholder="Mô tả nội dung tập dữ liệu công bố..."
                    value={requestDescription}
                    onChange={(e) => setRequestDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-1 md:col-span-2 flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    id="requestPublishImmediately"
                    checked={requestPublishImmediately}
                    onChange={(e) => setRequestPublishImmediately(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="requestPublishImmediately" className="text-slate-700 select-none cursor-pointer">
                    Công bố dữ liệu ngay sau khi được phê duyệt
                  </label>
                </div>
              </div>
            )}

            {requestModalTab === 'settings' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
                {/* SOURCE CONFIG SECTION */}
                <div className="col-span-1 md:col-span-2">
                  <section className="bg-slate-50 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-blue-700">
                      <h4 className="text-white flex items-center gap-2 text-[13px]">
                        <Database className="w-4 h-4" />
                        Cấu hình nguồn dữ liệu
                      </h4>
                      <div
                        className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/20 cursor-pointer"
                        onClick={() => setHasJoin(!hasJoin)}
                      >
                        <span className="text-[13px] text-white uppercase tracking-tight">Sử dụng liên kết bảng (Join)</span>
                        <div className={`w-9 h-5 rounded-full p-0.5 transition-all duration-300 ${hasJoin ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'bg-white/30'}`}>
                          <div className={`w-4 h-4 rounded-full transition-all duration-300 shadow-sm ${hasJoin ? 'bg-blue-600 translate-x-4' : 'bg-white translate-x-0'}`}></div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 space-y-4">
                      {sourceDbId && (
                        <div className="flex items-center gap-2 text-[13px] bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                          <Database className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="text-black">Kho dữ liệu:</span>
                          <span className="text-black">{WAREHOUSE_DATABASES.find(db => db.id === sourceDbId)?.name || sourceDbId}</span>
                        </div>
                      )}

                      {/* Primary Table */}
                      <div className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-all">
                        <label className="block text-[13px] text-black uppercase mb-2 flex items-center justify-between">
                          <span>Bảng dữ liệu chính</span>
                          <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded italic">Primary Table</span>
                        </label>
                        <select
                          className={`w-full border rounded-lg px-3 py-1.5 text-[13px] text-black outline-none ${
                            !requestMetaFile
                              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                              : 'bg-slate-50 border-slate-200 cursor-pointer focus:border-blue-500'
                          }`}
                          disabled={!requestMetaFile}
                          value={mainTable}
                          onChange={(e) => {
                            const newMain = e.target.value;
                            setMainTable(newMain);
                            const joinNames = joinTables.map(jt => jt.tableId).filter(Boolean);
                            setDataFields(sourceDbId ? buildAllDataFields(sourceDbId, newMain, joinNames) : []);
                          }}
                        >
                          <option value="">-- Chọn bảng chính --</option>
                          {(SOURCE_DB_TABLES[sourceDbId] || []).map(t => (
                            <option key={t.name} value={t.name}>{t.name}</option>
                          ))}
                        </select>
                        {!requestMetaFile && (
                          <div className="mt-2 text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-[12px] flex items-center gap-1.5 animate-in fade-in duration-200">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>Vui lòng chọn cấu hình metadata tại Thông tin chung</span>
                          </div>
                        )}
                      </div>

                      {/* Join Tables */}
                      {hasJoin && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                          <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                            <h5 className="text-[13px] text-black uppercase tracking-wider flex items-center gap-1.5">
                              <Database className="w-3.5 h-3.5 text-blue-600" />
                              Bảng liên kết bổ sung ({joinTables.length})
                            </h5>
                            <button
                              type="button"
                              onClick={() => {
                                const idx = joinTables.length;
                                const newJt = { id: `join_new_${idx}_${Date.now()}`, tableId: '', alias: `t${idx + 2}`, joinType: 'LEFT JOIN', joinColA: '', joinColB: '' };
                                setJoinTables([...joinTables, newJt]);
                              }}
                              className="text-[13px] bg-blue-50 hover:bg-blue-100 text-black px-3 py-1.5 rounded-lg border border-blue-200 transition-all flex items-center shadow-sm cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5 mr-1" /> Thêm bảng liên kết
                            </button>
                          </div>

                          {joinTables.map((jt, idx) => (
                            <div key={jt.id} className="p-4 bg-white border border-slate-200 rounded-xl relative space-y-4 hover:border-blue-300 transition-all">
                              <button
                                type="button"
                                onClick={() => {
                                  const newJts = joinTables.filter(j => j.id !== jt.id);
                                  setJoinTables(newJts);
                                  if (sourceDbId && mainTable) {
                                    setDataFields(buildAllDataFields(sourceDbId, mainTable, newJts.map(j => j.tableId).filter(Boolean)));
                                  }
                                }}
                                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Xóa bảng liên kết"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                              <div className="flex items-center gap-3">
                                <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded">
                                  BẢNG LIÊN KẾT #{idx + 1}
                                </span>
                                <span className="text-[13px] font-mono text-black">Alias: {jt.alias}</span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[13px] text-black uppercase mb-1">Kiểu liên kết</label>
                                  <select
                                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-black focus:outline-none focus:border-blue-500 cursor-pointer"
                                    value={jt.joinType}
                                    onChange={(e) => setJoinTables(joinTables.map(j => j.id === jt.id ? { ...j, joinType: e.target.value } : j))}
                                  >
                                    <option>INNER JOIN</option>
                                    <option>LEFT JOIN</option>
                                    <option>RIGHT JOIN</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[13px] text-black uppercase mb-1">Bảng dữ liệu bổ sung</label>
                                  <select
                                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-black focus:outline-none focus:border-blue-500 cursor-pointer"
                                    value={jt.tableId}
                                    onChange={(e) => {
                                      const newJts = joinTables.map(j => j.id === jt.id ? { ...j, tableId: e.target.value, joinColA: '', joinColB: '' } : j);
                                      setJoinTables(newJts);
                                      if (sourceDbId && mainTable) {
                                        setDataFields(buildAllDataFields(sourceDbId, mainTable, newJts.map(j => j.tableId).filter(Boolean)));
                                      }
                                    }}
                                  >
                                    <option value="">-- Chọn bảng bổ sung --</option>
                                    {(SOURCE_DB_TABLES[sourceDbId] || [])
                                      .filter(t => t.name !== mainTable)
                                      .map(t => (
                                        <option key={t.name} value={t.name}>{t.name}</option>
                                      ))
                                    }
                                  </select>
                                </div>
                              </div>

                              {jt.tableId && (
                                <div className="p-3 bg-blue-50/20 rounded-lg border border-blue-100 border-dashed space-y-2 animate-in fade-in zoom-in-95 duration-200">
                                  <div className="text-[13px] text-black uppercase tracking-tight">Điều kiện liên kết (Join Condition):</div>
                                  <div className="flex flex-col md:flex-row items-center gap-2">
                                    <div className="flex-1 w-full">
                                      <select
                                        className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-[13px] font-mono text-black outline-none focus:border-blue-500 cursor-pointer"
                                        value={jt.joinColA}
                                        onChange={(e) => setJoinTables(joinTables.map(j => j.id === jt.id ? { ...j, joinColA: e.target.value } : j))}
                                      >
                                        <option value="">-- Cột của {jt.tableId} --</option>
                                        {(SOURCE_DB_TABLES[sourceDbId] || []).find(t => t.name === jt.tableId)?.columns.map(col => (
                                          <option key={col} value={`${jt.alias}.${col}`}>{jt.alias}.{col}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className="text-blue-600 text-xs px-2.5 py-1 bg-blue-50 rounded border border-blue-100 shadow-sm">=</div>
                                    <div className="flex-1 w-full">
                                      <select
                                        className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-[13px] font-mono text-black outline-none focus:border-blue-500 cursor-pointer"
                                        value={jt.joinColB}
                                        onChange={(e) => setJoinTables(joinTables.map(j => j.id === jt.id ? { ...j, joinColB: e.target.value } : j))}
                                      >
                                        <option value="">-- Nối với cột --</option>
                                        <optgroup label={`Bảng chính: ${mainTable}`}>
                                          {(SOURCE_DB_TABLES[sourceDbId] || []).find(t => t.name === mainTable)?.columns.map(col => (
                                            <option key={`${mainTable}.${col}`} value={`${mainTable}.${col}`}>{mainTable}.{col}</option>
                                          ))}
                                        </optgroup>
                                        {joinTables.slice(0, idx).filter(prev => prev.tableId).map(prev => (
                                          <optgroup key={prev.id} label={`Bảng liên kết: ${prev.tableId} (${prev.alias})`}>
                                            {(SOURCE_DB_TABLES[sourceDbId] || []).find(t => t.name === prev.tableId)?.columns.map(col => (
                                              <option key={`${prev.alias}.${col}`} value={`${prev.alias}.${col}`}>{prev.alias}.{col}</option>
                                            ))}
                                          </optgroup>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>
                </div>

                {/* DATA FIELDS TABLE */}
                {dataFields.length > 0 && (
                  <div className="col-span-1 md:col-span-2">
                    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50/50">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                            <FileText className="w-4 h-4" />
                          </div>
                          <h4 className="text-black text-[13px] font-bold">Chọn trường dữ liệu chia sẻ (Field Selection)</h4>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[13px] text-slate-500 font-medium">{dataFields.filter(f => f.shared).length}/{dataFields.length} trường được chọn</span>
                          <button
                            type="button"
                            onClick={handleAddDataField}
                            className="text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg border border-blue-200 transition-all flex items-center shadow-sm cursor-pointer"
                            title="Thêm trường dữ liệu"
                          >
                            <Plus className="w-3.5 h-3.5 mr-1" /> Thêm trường dữ liệu
                          </button>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse" style={{ tableLayout: 'fixed' }}>
                          <colgroup>
                            <col style={{ width: '5%' }} />
                            <col style={{ width: '5%' }} />
                            <col style={{ width: '20%' }} />
                            <col style={{ width: '20%' }} />
                            <col style={{ width: '20%' }} />
                            <col style={{ width: '20%' }} />
                            <col style={{ width: '6%' }} />
                            <col style={{ width: '4%' }} />
                          </colgroup>
                          <thead>
                            <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                              <th className="px-3 py-3 font-bold uppercase text-[10px] text-center">Chia sẻ</th>
                              <th className="px-3 py-3 font-bold uppercase text-[10px] text-center">PK</th>
                              <th className="px-3 py-3 font-bold uppercase text-[10px]">Nguồn dữ liệu (Table)</th>
                              <th className="px-3 py-3 font-bold uppercase text-[10px]">Trường gốc (Column)</th>
                              <th className="px-3 py-3 font-bold uppercase text-[10px]">Tên trường (API Field)</th>
                              <th className="px-3 py-3 font-bold uppercase text-[10px]">Kiểu dữ liệu</th>
                              <th className="px-3 py-3 font-bold uppercase text-[10px] text-center">Che dấu</th>
                              <th className="px-3 py-3 text-right">Xóa</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                            {dataFields.map((df) => (
                              <tr key={df.id} className={`hover:bg-slate-50/50 group transition-colors ${!df.shared ? 'opacity-50' : ''}`}>
                                <td className="px-3 py-3 text-center">
                                  <input
                                    type="checkbox"
                                    title="Chọn trường"
                                    checked={df.shared}
                                    onChange={() => setDataFields(dataFields.map(f => f.id === df.id ? { ...f, shared: !f.shared } : f))}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white w-4 h-4 cursor-pointer"
                                  />
                                </td>
                                <td className="px-3 py-3 text-center">
                                  <Key
                                    className={`w-4 h-4 mx-auto cursor-pointer transition-colors ${df.isPk ? 'text-blue-600' : 'text-slate-400 hover:text-blue-500'}`}
                                    onClick={() => setDataFields(dataFields.map(f => f.id === df.id ? { ...f, isPk: !f.isPk } : f))}
                                  />
                                </td>
                                <td className="px-3 py-3 overflow-hidden">
                                  <select
                                    title="Chọn bảng"
                                    className="w-full min-w-0 bg-slate-50 border border-slate-200 px-2 py-1 rounded text-[11px] font-bold text-slate-700 outline-none cursor-pointer focus:border-blue-500 shadow-sm"
                                    value={df.tableId || mainTable}
                                    onChange={(e) => setDataFields(dataFields.map(f => f.id === df.id ? { ...f, tableId: e.target.value } : f))}
                                  >
                                    <option value={mainTable}>{mainTable} (Gốc)</option>
                                    {joinTables && joinTables.map((t: any) => t.tableId && (
                                      <option key={t.id || t.tableId} value={t.tableId}>{t.tableId} (Liên kết)</option>
                                    ))}
                                  </select>
                                </td>
                                <td className="px-3 py-3 overflow-hidden">
                                  <select
                                    title="Chọn cột nguồn"
                                    className="w-full min-w-0 bg-slate-50 border border-slate-200 px-2 py-1 rounded text-[11px] font-mono text-slate-600 outline-none cursor-pointer focus:border-blue-500 shadow-sm"
                                    value={df.column || ''}
                                    onChange={(e) => setDataFields(dataFields.map(f => f.id === df.id ? { ...f, column: e.target.value, apiField: e.target.value } : f))}
                                  >
                                    <option value="">-- Chọn trường gốc --</option>
                                    {((SOURCE_DB_TABLES[sourceDbId] || []).find(t => t.name === (df.tableId || mainTable))?.columns || []).map(col => (
                                      <option key={col} value={col}>{col}</option>
                                    ))}
                                    {df.column && !((SOURCE_DB_TABLES[sourceDbId] || []).find(t => t.name === (df.tableId || mainTable))?.columns || []).includes(df.column) && (
                                      <option value={df.column}>{df.column}</option>
                                    )}
                                  </select>
                                </td>
                                <td className="px-3 py-3 overflow-hidden">
                                  <input
                                    title="Tên trường API"
                                    aria-label="Tên trường API"
                                    type="text"
                                    className="w-full min-w-0 bg-slate-50 border border-slate-200 focus:border-blue-500 px-2 py-1 rounded outline-none text-xs text-slate-800 font-mono font-bold shadow-sm"
                                    value={df.apiField}
                                    onChange={(e) => setDataFields(dataFields.map(f => f.id === df.id ? { ...f, apiField: e.target.value } : f))}
                                    placeholder="Ví dụ: ho_ten"
                                  />
                                </td>
                                <td className="px-3 py-3 overflow-hidden">
                                  <select
                                    title="Kiểu"
                                    className="w-full min-w-0 bg-slate-50 border border-slate-200 px-2 py-1 rounded text-[10px] font-bold text-slate-500 outline-none uppercase cursor-pointer focus:border-blue-500 shadow-sm"
                                    value={df.dataType}
                                    onChange={(e) => setDataFields(dataFields.map(f => f.id === df.id ? { ...f, dataType: e.target.value } : f))}
                                  >
                                    <option value="string">string</option>
                                    <option value="number">number</option>
                                    <option value="date">date</option>
                                    <option value="datetime">datetime</option>
                                  </select>
                                </td>
                                <td className="px-3 py-3 text-center">
                                  <input
                                    type="checkbox"
                                    title="Masking"
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white w-4 h-4 cursor-pointer"
                                    checked={df.masked || false}
                                    onChange={(e) => setDataFields(dataFields.map(f => f.id === df.id ? { ...f, masked: e.target.checked } : f))}
                                  />
                                </td>
                                <td className="px-3 py-3 text-right">
                                  <button
                                    type="button"
                                    onClick={() => setDataFields(dataFields.filter(f => f.id !== df.id))}
                                    className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                    title="Xóa trường"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  </div>
                )}
              </div>
            )}

            {formValidationError && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm flex items-start gap-2 mb-4 animate-fade-in">
                  <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0 text-amber-600" />
                  <div>
                    <span>Thông tin chỉnh sửa không hợp lệ so với metadata cho phép:</span>
                    <p className="mt-1 text-xs text-amber-700">{formValidationError}</p>
                  </div>
                </div>
              )}

              <div className="border-t border-slate-200 pt-4 flex items-center justify-between gap-3 bg-white">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm transition-colors"
                >
                  Hủy
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={!!formValidationError}
                    className={`px-4 py-2 border rounded-lg text-sm flex items-center gap-1.5 transition-colors ${
                      formValidationError
                        ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                        : 'border-slate-300 text-slate-600 hover:bg-slate-50 cursor-pointer'
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    Lưu nháp
                  </button>
                  {requestModalTab === 'general' ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!requestFileName) {
                          alert("Vui lòng nhập tên tập dữ liệu!");
                          return;
                        }
                        if (!requestCategory) {
                          alert("Vui lòng chọn danh mục dữ liệu mở!");
                          return;
                        }
                        if (!requestPublisher) {
                          alert("Vui lòng nhập đơn vị chủ trì cung cấp!");
                          return;
                        }
                        if (!requestTopic) {
                          alert("Vui lòng chọn chủ đề!");
                          return;
                        }
                        if (requestFormat.length === 0) {
                          alert("Vui lòng chọn ít nhất một định dạng chia sẻ!");
                          return;
                        }
                        setRequestModalTab('settings');
                      }}
                      className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      Tiếp tục
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!!formValidationError || (!editingItem && !mainTable && uploadType === 'file' && !validationSuccess)}
                      className={`px-4 py-2 text-white rounded-lg text-sm flex items-center gap-2 shadow-sm transition-all ${
                        !formValidationError && (editingItem || mainTable || uploadType === 'api' || validationSuccess)
                          ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                          : 'bg-slate-300 cursor-not-allowed text-slate-500'
                      }`}
                    >
                      {editingItem ? <Edit2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                      {editingItem ? 'Cập nhật' : 'Gửi yêu cầu'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* APPROVAL MODAL */}
      {showApprovalModal && selectedApprovalItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-lg font-bold text-slate-900">Phê duyệt yêu cầu công bố</h3>
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setShowRejectForm(false);
                  setShowApproveForm(false);
                  setApproveOpinion('');
                  setRejectReason('');
                }}
                className="text-slate-400 hover:text-slate-650 p-1 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 flex-1 text-[13px]">
              {!showApproveForm && !showRejectForm && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
                  <div className="col-span-1 md:col-span-2">
                    <div className="text-[13px] font-semibold text-black uppercase">Tên tệp đề xuất</div>
                    <div className="text-[13px] font-bold text-black mt-1 flex items-center gap-1.5">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      {selectedApprovalItem.fileName}
                    </div>
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-black uppercase">Danh mục mở</div>
                    <div className="text-[13px] text-black font-medium mt-0.5">{selectedApprovalItem.category}</div>
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-black uppercase">Người đề xuất</div>
                    <div className="text-[13px] text-black font-medium mt-0.5">{selectedApprovalItem.creator}</div>
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-black uppercase">Đơn vị chủ trì cung cấp</div>
                    <div className="text-[13px] text-black font-medium mt-0.5">{selectedApprovalItem.publisher}</div>
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-black uppercase">Giấy phép</div>
                    <div className="text-[13px] text-black font-medium mt-0.5">{selectedApprovalItem.license}</div>
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-black uppercase">Từ khóa</div>
                    <div className="text-[13px] text-black font-medium mt-0.5">{selectedApprovalItem.keywords || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-black uppercase">Tần suất cập nhật</div>
                    <div className="text-[13px] text-black font-medium mt-0.5">{getFrequencyLabel(selectedApprovalItem.frequency || 'monthly')}</div>
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-black uppercase">Chủ đề</div>
                    <div className="text-[13px] text-black font-medium mt-0.5">{selectedApprovalItem.topic || '—'}</div>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <div className="text-[13px] font-semibold text-black uppercase">Định dạng chia sẻ</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedApprovalItem.format?.map((fmt, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-blue-50 text-black border border-blue-100 rounded text-[13px] font-medium">
                          {fmt}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <div className="text-[13px] font-semibold text-black uppercase">Thông tin mô tả</div>
                    <div className="text-[13px] text-black font-medium mt-0.5 whitespace-pre-wrap">{selectedApprovalItem.description || 'Không có mô tả'}</div>
                  </div>

                  {selectedApprovalItem.submitNote && (
                    <div className="col-span-1 md:col-span-2 bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <div className="text-[13px] font-semibold text-purple-700 uppercase">Nội dung trình duyệt</div>
                      <div className="text-[13px] text-purple-900 font-medium mt-0.5 whitespace-pre-wrap">{selectedApprovalItem.submitNote}</div>
                    </div>
                  )}

                  <div className="col-span-1 md:col-span-2 flex items-center gap-2 mt-1">
                    <input
                      type="checkbox"
                      id="approvalPublishImmediately"
                      checked={selectedApprovalItem.publishImmediately || false}
                      disabled
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-not-allowed"
                    />
                    <label htmlFor="approvalPublishImmediately" className="text-slate-700 select-none cursor-not-allowed">
                      Công bố dữ liệu ngay sau khi được phê duyệt
                    </label>
                  </div>
                </div>
              )}

              {/* ── Ý kiến phê duyệt / Lý do từ chối ── */}
              {!showApproveForm && !showRejectForm && (selectedApprovalItem.status === 'approved' || selectedApprovalItem.status === 'rejected') && (
                <div className={`rounded-xl border p-4 ${selectedApprovalItem.status === 'approved' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {selectedApprovalItem.status === 'approved'
                      ? <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                      : <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                    }
                    <span className={`text-[11px] font-semibold uppercase tracking-wider ${selectedApprovalItem.status === 'approved' ? 'text-green-700' : 'text-red-600'}`}>
                      {selectedApprovalItem.status === 'approved' ? 'Ý kiến phê duyệt' : 'Lý do từ chối'}
                    </span>
                  </div>
                  <p className={`text-[13px] leading-relaxed ${selectedApprovalItem.status === 'approved' ? 'text-green-900' : 'text-red-900'}`}>
                    {selectedApprovalItem.approvalNote || '—'}
                  </p>
                </div>
              )}

              {showRejectForm ? (
                <div className="space-y-4 pt-2 animate-fade-in text-[13px] text-black">
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                      Lý do từ chối phê duyệt <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Nhập lý do từ chối cụ thể để cán bộ chỉnh sửa..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-normal resize-none"
                    />
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="text-[13px] font-semibold text-slate-700 mb-2">Sau khi từ chối phê duyệt:</div>
                    <ul className="space-y-1.5">
                      <li className="flex items-start gap-2 text-[13px] text-slate-655 font-normal">
                        <XCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                        Yêu cầu công bố sẽ chuyển sang trạng thái "Từ chối"
                      </li>
                      <li className="flex items-start gap-2 text-[13px] text-slate-655 font-normal">
                        <XCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                        Lý do từ chối sẽ được gửi phản hồi lại cho đơn vị đề xuất
                      </li>
                      <li className="flex items-start gap-2 text-[13px] text-slate-655 font-normal">
                        <XCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                        Đơn vị đề xuất có thể chỉnh sửa thông tin và gửi lại yêu cầu mới
                      </li>
                    </ul>
                  </div>
                </div>
              ) : showApproveForm ? (
                <div className="space-y-4 pt-2 animate-fade-in text-[13px] text-black">
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-2">Ý kiến phê duyệt</label>
                    <textarea
                      value={approveOpinion}
                      onChange={(e) => setApproveOpinion(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none font-normal"
                      rows={4}
                      placeholder="Nhập ý kiến phê duyệt (nếu có)... Ví dụ: Đồng ý phê duyệt và công bố dữ liệu mở theo đề xuất của đơn vị."
                    />
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="text-[13px] font-semibold text-slate-700 mb-2">Sau khi phê duyệt:</div>
                    <ul className="space-y-1.5">
                      <li className="flex items-start gap-2 text-[13px] text-slate-655 font-normal">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                        Dữ liệu sẽ được công bố trên Cổng dữ liệu mở quốc gia
                      </li>
                      <li className="flex items-start gap-2 text-[13px] text-slate-655 font-normal">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                        Dữ liệu sẽ được đồng bộ và cập nhật định kỳ theo lịch đã thiết lập
                      </li>
                      <li className="flex items-start gap-2 text-[13px] text-slate-655 font-normal">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                        Các cơ quan, tổ chức và công dân có thể truy cập và tải xuống dữ liệu
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="pt-2 space-y-3">
                  <div className="flex border-b border-slate-200">
                    <button
                      type="button"
                      onClick={() => setApprovalPreviewTab('metadata')}
                      className={`px-4 py-2 text-[13px] font-semibold uppercase tracking-wider border-b-2 transition-all ${approvalPreviewTab === 'metadata' ? 'border-blue-600 text-black border-blue-600' : 'border-transparent text-black hover:text-black'}`}
                    >
                      Xem metadata
                    </button>
                    <button
                      type="button"
                      onClick={() => setApprovalPreviewTab('preview')}
                      className={`px-4 py-2 text-[13px] font-semibold uppercase tracking-wider border-b-2 transition-all ${approvalPreviewTab === 'preview' ? 'border-blue-600 text-black border-blue-600' : 'border-transparent text-black hover:text-black'}`}
                    >
                      Xem trước dữ liệu dòng đầu
                    </button>
                  </div>

                  {approvalPreviewTab === 'metadata' ? (
                    <div className="space-y-4 p-4 bg-slate-50 border border-slate-200 rounded-xl max-h-60 overflow-y-auto text-[13px] text-black">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="block text-[13px] font-semibold text-black uppercase">Cơ sở dữ liệu đích</span>
                          <span className="text-[13px] font-normal text-black">
                            {WAREHOUSE_DATABASES.find(db => db.id === getRecordMetadataConfig(selectedApprovalItem).dbId)?.name || getRecordMetadataConfig(selectedApprovalItem).dbId}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[13px] font-semibold text-black uppercase">Bảng chính</span>
                          <span className="text-[13px] font-normal text-black">
                            {getRecordMetadataConfig(selectedApprovalItem).mainTable}
                          </span>
                        </div>
                      </div>

                      {getRecordMetadataConfig(selectedApprovalItem).joinTables.length > 0 && (
                        <div>
                          <span className="block text-[13px] font-semibold text-black uppercase mb-1">Bảng liên kết (Join)</span>
                          <div className="space-y-1.5">
                            {getRecordMetadataConfig(selectedApprovalItem).joinTables.map((jt, idx) => (
                              <div key={idx} className="bg-white border border-slate-200 rounded-lg px-3 py-2 flex items-center justify-between text-[13px] text-black font-normal">
                                <span className="font-normal text-black">{jt.tableId} ({jt.alias})</span>
                                <span className="text-[13px] text-black font-normal">{jt.joinType} ON {jt.joinColA} = {jt.joinColB}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <span className="block text-[13px] font-semibold text-black uppercase mb-2">Các trường thông tin đã chọn</span>
                        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                          <table className="w-full text-left text-[13px] border-collapse">
                            <thead className="bg-slate-50 text-slate-500 uppercase tracking-tight">
                              <tr>
                                <th className="px-3 py-2 font-semibold border-b border-slate-200 text-[13px]">Tên cột</th>
                                <th className="px-3 py-2 font-semibold border-b border-slate-200 text-[13px]">Bảng nguồn</th>
                                <th className="px-3 py-2 font-semibold border-b border-slate-200 text-[13px]">Kiểu dữ liệu</th>
                                <th className="px-3 py-2 font-semibold border-b border-slate-200 text-[13px]">API Field</th>
                                <th className="px-3 py-2 text-center font-semibold border-b border-slate-200 text-[13px]">Bảo mật (Mask)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-black">
                              {getRecordMetadataConfig(selectedApprovalItem).dataFields.map((df, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                  <td className="px-3 py-2 font-normal text-[13px]">{df.column}</td>
                                  <td className="px-3 py-2 text-[13px] font-normal">{df.tableId}</td>
                                  <td className="px-3 py-2 text-[13px] font-normal">{df.dataType}</td>
                                  <td className="px-3 py-2 font-mono text-[13px] font-normal">{df.apiField}</td>
                                  <td className="px-3 py-2 text-center text-[13px]">
                                    <span className={`px-2 py-0.5 rounded text-[13px] ${df.masked ? 'bg-red-50 text-black border border-red-100 font-normal' : 'bg-green-50 text-black border border-green-100 font-normal'}`}>
                                      {df.masked ? 'Bảo mật' : 'Không'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : (() => {
                    const fallback = getPreviewFallback(selectedApprovalItem.category);
                    const pHeaders = (selectedApprovalItem.previewHeaders && selectedApprovalItem.previewHeaders.length > 0)
                      ? selectedApprovalItem.previewHeaders
                      : fallback.headers;
                    const pRows = (selectedApprovalItem.previewRows && selectedApprovalItem.previewRows.length > 0)
                      ? selectedApprovalItem.previewRows
                      : fallback.rows;
                    return (
                      <div className="border border-slate-200 rounded-lg overflow-x-auto max-h-60 text-[13px] text-black">
                        <table className="w-full border-collapse">
                          <thead className="bg-slate-50 text-slate-500 uppercase tracking-tight">
                            <tr>
                              {pHeaders.map((h, i) => (
                                <th key={i} className="px-3 py-2 text-left font-semibold border-b border-slate-200 whitespace-nowrap text-[13px]">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-black font-normal">
                            {pRows.map((row, ri) => (
                              <tr key={ri} className="hover:bg-slate-50">
                                {row.map((cell, ci) => (
                                  <td key={ci} className="px-3 py-2 whitespace-nowrap text-[13px] font-normal">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-4">
              {!showRejectForm && !showApproveForm ? (
                <>
                  <button
                    onClick={() => setShowRejectForm(true)}
                    className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-normal text-[13px] transition-colors cursor-pointer"
                  >
                    Từ chối duyệt
                  </button>
                  <button
                    onClick={() => { setApproveOpinion(''); setShowApproveForm(true); }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-normal text-[13px] transition-colors cursor-pointer"
                  >
                    Phê duyệt & Công bố
                  </button>
                </>
              ) : showRejectForm ? (
                <>
                  <button
                    onClick={() => setShowRejectForm(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-normal text-[13px] transition-colors"
                  >
                    Quay lại
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={!rejectReason.trim()}
                    className={`px-4 py-2 text-white rounded-lg font-normal text-[13px] transition-all ${rejectReason.trim() ? 'bg-red-600 hover:bg-red-700 cursor-pointer' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
                  >
                    Xác nhận Từ chối
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowApproveForm(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-normal text-[13px] transition-colors"
                  >
                    Quay lại
                  </button>
                  <button
                    onClick={() => handleApprove(selectedApprovalItem, approveOpinion)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-normal text-[13px] transition-colors cursor-pointer"
                  >
                    Xác nhận Phê duyệt
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}


      {/* SCHEDULE SETUP MODAL */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-lg font-bold text-slate-900">{isEditingSchedule ? 'Sửa lịch công bố tự động' : 'Thêm lịch công bố tự động'}</h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const matchedDataset = APPROVED_CATEGORIES.find(c => c.code === scheduleFormData.datasetId);
                
                if (scheduleFormData.frequency === 'weekly' && (!scheduleFormData.weeklyDays || scheduleFormData.weeklyDays.length === 0)) {
                  alert('Vui lòng chọn ít nhất một thứ trong tuần!');
                  return;
                }

                if (isEditingSchedule && selectedSchedule) {
                  setSchedules(schedules.map(s => s.id === selectedSchedule.id ? {
                    ...s,
                    frequency: scheduleFormData.frequency,
                    startTime: scheduleFormData.startTime,
                    dataSource: scheduleFormData.dataSource,
                    startDate: scheduleFormData.startDate,
                    endDate: scheduleFormData.endDate,
                    publishFormat: scheduleFormData.publishFormat,
                    targetAudience: scheduleFormData.targetAudience,
                    contactInfo: scheduleFormData.contactInfo,
                    weeklyDays: scheduleFormData.weeklyDays,
                    monthlyDay: scheduleFormData.monthlyDay,
                    quarterlyDay: scheduleFormData.quarterlyDay,
                    quarterlyMonth: scheduleFormData.quarterlyMonth,
                    nextRun: `06/06/2026 ${scheduleFormData.startTime}`
                  } : s));
                  alert('Đã cập nhật lịch công bố tự động thành công!');
                } else {
                  if (!matchedDataset) {
                    alert('Vui lòng chọn tập dữ liệu mở!');
                    return;
                  }
                  const newSchedule: ScheduleItem = {
                    id: Date.now(),
                    datasetCode: matchedDataset.code,
                    datasetName: matchedDataset.name,
                    frequency: scheduleFormData.frequency,
                    startTime: scheduleFormData.startTime,
                    startDate: scheduleFormData.startDate,
                    endDate: scheduleFormData.endDate,
                    publishFormat: scheduleFormData.publishFormat,
                    targetAudience: scheduleFormData.targetAudience,
                    contactInfo: scheduleFormData.contactInfo,
                    dataSource: scheduleFormData.dataSource || 'CSDL Kho hệ thống',
                    status: 'active',
                    nextRun: `06/06/2026 ${scheduleFormData.startTime}`,
                    createdBy: 'User',
                    createdDate: new Date().toLocaleDateString('vi-VN'),
                    weeklyDays: scheduleFormData.weeklyDays,
                    monthlyDay: scheduleFormData.monthlyDay,
                    quarterlyDay: scheduleFormData.quarterlyDay,
                    quarterlyMonth: scheduleFormData.quarterlyMonth
                  };
                  setSchedules([newSchedule, ...schedules]);
                  alert('Đã thêm lịch công bố tự động thành công!');
                }
                setShowScheduleModal(false);
              }}
              className="p-6 space-y-4 flex-1 text-[13px]"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[13px] text-black mb-1">Tập dữ liệu áp dụng <span className="text-red-500">*</span></label>
                  <select
                    disabled={isEditingSchedule}
                    value={scheduleFormData.datasetId}
                    onChange={(e) => {
                      const code = e.target.value;
                      const dbId = CATEGORY_TO_DB[code] || '';
                      const dbInfo = WAREHOUSE_DATABASES.find(db => db.id === dbId);
                      setScheduleFormData({ ...scheduleFormData, datasetId: code, dataSource: dbInfo?.name || '' });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-slate-50 disabled:text-slate-500"
                  >
                    <option value="">-- Chọn tập dữ liệu mở --</option>
                    {APPROVED_CATEGORIES.map(c => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] text-black mb-1">Tần suất <span className="text-red-500">*</span></label>
                  <select
                    value={scheduleFormData.frequency}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, frequency: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="daily">Hàng ngày</option>
                    <option value="weekly">Hàng tuần</option>
                    <option value="monthly">Hàng tháng</option>
                    <option value="quarterly">Hàng quý</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] text-black mb-1">Giờ chạy tự động <span className="text-red-500">*</span></label>
                  <input
                    type="time"
                    required
                    value={scheduleFormData.startTime}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {scheduleFormData.frequency === 'weekly' && (
                  <div className="col-span-2 space-y-1.5">
                    <label className="block text-[13px] text-black">Các thứ trong tuần <span className="text-red-500">*</span></label>
                    <div className="flex flex-wrap gap-2">
                      {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'].map((day) => {
                        const isSelected = scheduleFormData.weeklyDays?.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              const currentDays = scheduleFormData.weeklyDays || [];
                              const newWeeklyDays = isSelected
                                ? currentDays.filter(d => d !== day)
                                : [...currentDays, day];
                              setScheduleFormData({ ...scheduleFormData, weeklyDays: newWeeklyDays });
                            }}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                              isSelected
                                ? 'bg-blue-600 border-blue-600 text-white shadow-sm font-medium'
                                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {scheduleFormData.frequency === 'monthly' && (
                  <div className="col-span-2">
                    <label className="block text-[13px] text-black mb-1">Ngày trong tháng <span className="text-red-500">*</span></label>
                    <select
                      value={scheduleFormData.monthlyDay || 1}
                      onChange={(e) => setScheduleFormData({ ...scheduleFormData, monthlyDay: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <option key={day} value={day}>
                          Ngày {day}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {scheduleFormData.frequency === 'quarterly' && (
                  <>
                    <div>
                      <label className="block text-[13px] text-black mb-1">Tháng thứ mấy trong quý <span className="text-red-500">*</span></label>
                      <select
                        value={scheduleFormData.quarterlyMonth || 1}
                        onChange={(e) => setScheduleFormData({ ...scheduleFormData, quarterlyMonth: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value={1}>Tháng thứ nhất</option>
                        <option value={2}>Tháng thứ hai</option>
                        <option value={3}>Tháng thứ ba</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[13px] text-black mb-1">Ngày trong quý (1-30) <span className="text-red-500">*</span></label>
                      <select
                        value={scheduleFormData.quarterlyDay || 1}
                        onChange={(e) => setScheduleFormData({ ...scheduleFormData, quarterlyDay: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                          <option key={day} value={day}>
                            Ngày {day}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[13px] text-black mb-1">Ngày bắt đầu</label>
                  <input
                    type="date"
                    value={scheduleFormData.startDate}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

<div className="col-span-2">
                  <label className="block text-[13px] text-black mb-1">Nguồn cơ sở dữ liệu hệ thống <span className="text-red-500">*</span></label>
                  {scheduleFormData.datasetId ? (() => {
                    const dbId = CATEGORY_TO_DB[scheduleFormData.datasetId] || '';
                    const dbInfo = WAREHOUSE_DATABASES.find(db => db.id === dbId);
                    const metaFile = CONFIGURED_METADATA_FILES.find(f => f.categoryCode === scheduleFormData.datasetId);
                    const allTableNames = [metaFile?.mainTable, ...(metaFile?.joinTableNames || [])].filter(Boolean) as string[];
                    const allFields = buildAllDataFields(dbId, metaFile?.mainTable || '', metaFile?.joinTableNames || []);
                    return (
                      <div className="w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-[13px] space-y-1.5">
                        <div className="flex gap-2">
                          <span className="text-slate-500 shrink-0 w-28">Cơ sở dữ liệu:</span>
                          <span className="text-slate-800">{dbInfo?.name || '—'}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-slate-500 shrink-0 w-28">Bảng dữ liệu:</span>
                          <span className="text-slate-800">{allTableNames.join(', ') || '—'}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-slate-500 shrink-0 w-28">Các trường:</span>
                          <span className="text-slate-800 break-all">{allFields.map(f => f.column).join(', ') || '—'}</span>
                        </div>
                      </div>
                    );
                  })() : (
                    <div className="w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-[13px] text-slate-400 italic">
                      Chọn tập dữ liệu để xem thông tin nguồn
                    </div>
                  )}
                </div>

              </div>

              <div className="border-t border-slate-200 pt-4 flex justify-end gap-2 bg-white">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-[13px]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white rounded-lg text-[13px] transition-all bg-blue-600 hover:bg-blue-700 cursor-pointer"
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE SCHEDULE MODAL */}
      {showDeleteScheduleModal && selectedSchedule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Xác nhận xóa lịch</h3>
            <p className="text-sm text-slate-600">
              Bạn có chắc chắn muốn xóa lịch công bố tự động của tập dữ liệu <strong>{selectedSchedule.datasetName}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteScheduleModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setSchedules(schedules.filter(s => s.id !== selectedSchedule.id));
                  setShowDeleteScheduleModal(false);
                  alert('Đã xóa lịch công bố tự động thành công!');
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold cursor-pointer"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEND APPROVAL MODAL */}
      {showSendApprovalModal && sendApprovalItem && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 2147483647 }}>
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <Send className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-[18px] font-semibold text-slate-900">Gửi duyệt yêu cầu công bố</h3>
              </div>
              <button
                onClick={() => setShowSendApprovalModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Thông tin yêu cầu */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1">
                <div className="text-[12px] text-slate-500 uppercase tracking-wide font-medium">Yêu cầu công bố</div>
                <div className="text-[13px] font-semibold text-slate-900">{sendApprovalItem.fileName}</div>
                <div className="text-[13px] text-slate-500">{sendApprovalItem.category}</div>
                <div className="text-[12px] text-slate-400">Người tạo: {sendApprovalItem.creator} · {sendApprovalItem.createdDate}</div>
              </div>

              {/* Người phê duyệt */}
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-2">
                  Người phê duyệt <span className="text-red-500">*</span>
                </label>
                <select
                  value={sendApprovalApprover}
                  onChange={(e) => setSendApprovalApprover(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none transition-colors bg-white"
                  title="Chọn người phê duyệt"
                >
                  <option value="">-- Chọn người phê duyệt --</option>
                  {approvers.map(approver => (
                    <option key={approver.id} value={approver.id}>
                      {approver.name} - {approver.position}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nội dung trình duyệt */}
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-2">Nội dung trình duyệt</label>
                <textarea
                  value={sendApprovalNote}
                  onChange={(e) => setSendApprovalNote(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none transition-colors resize-none"
                  rows={4}
                  placeholder={`Nhập nội dung trình duyệt...\nVí dụ: Đề nghị Lãnh đạo xem xét phê duyệt yêu cầu công bố dữ liệu mở theo Nghị định 47/2020/NĐ-CP`}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowSendApprovalModal(false)}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 text-[13px] font-medium transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmSendApproval}
                disabled={!sendApprovalApprover}
                className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-[13px] font-medium transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Gửi phê duyệt
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* SUCCESS POPUP */}
      {showSuccessPopup && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 2147483647 }}>
          <div className="bg-white rounded-xl w-full max-w-xs shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="text-[14px] font-semibold text-slate-900">Thành công</h3>
              </div>
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 py-4">
              <p className="text-[13px] text-slate-600 leading-relaxed">{successPopupMessage}</p>
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-medium transition-colors cursor-pointer"
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {scheduleStatusConfirm && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 2147483647 }}>
          <div className="bg-white rounded-xl w-[380px] max-w-[90vw] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
                <h3 className="text-[14px] font-semibold text-slate-900">
                  {scheduleStatusConfirm.action === 'pause' ? 'Tạm dừng công bố' : 'Tiếp tục công bố'}
                </h3>
              </div>
              <button onClick={() => setScheduleStatusConfirm(null)} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 py-4">
              <p className="text-[13px] text-slate-600 leading-relaxed">
                {scheduleStatusConfirm.action === 'pause'
                  ? <>Bạn có chắc chắn muốn <span className="font-medium text-blue-600">tạm dừng</span> lịch công bố tự động cho tập dữ liệu <span className="font-medium text-slate-800">"{scheduleStatusConfirm.schedule.datasetName}"</span> không?</>
                  : <>Bạn có chắc chắn muốn <span className="font-medium text-blue-600">tiếp tục</span> lịch công bố tự động cho tập dữ liệu <span className="font-medium text-slate-800">"{scheduleStatusConfirm.schedule.datasetName}"</span> không?</>
                }
              </p>
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setScheduleStatusConfirm(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 text-[13px] transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  const newStatus = scheduleStatusConfirm.action === 'pause' ? 'inactive' : 'active';
                  setSchedules(schedules.map(s => s.id === scheduleStatusConfirm.schedule.id ? { ...s, status: newStatus } : s));
                  setScheduleStatusConfirm(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] transition-colors cursor-pointer"
              >
                {scheduleStatusConfirm.action === 'pause' ? 'Tạm dừng' : 'Tiếp tục'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}