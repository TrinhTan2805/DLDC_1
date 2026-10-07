import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, FileText, Calendar, User, Download, Eye, Filter, ChevronDown, Globe, CheckCircle, AlertCircle, RefreshCw, XCircle, Send, Upload, X, FileSpreadsheet, Info, Plus, Key, Clock, Database, Trash2, Edit, PlusCircle, PauseCircle, PlayCircle, Edit2, SquarePen, Shield, Menu, Save, AlertTriangle, ArrowRight } from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import {
  Badge, TruncatedText, RowIconAction, Pagination, tabClass,
  BTN_PRIMARY, BTN_OUTLINE, BTN_DESTRUCTIVE, BTN_GHOST_ICON,
  INPUT_CLS, LABEL_CLS, REQUIRED_MARK, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE,
  SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, FILTER_GRID_CLS, FILTER_LABEL, normalizeSearch, formatDateVN
} from '../collection/collectionUi';

// --- Lớp giao diện dùng chung trong file (compomennt.md 5.3, 5.4) ---
const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';
const TR = 'group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors';
const THEAD_ROW = 'h-[42px]';
const TABLE_WRAP = 'bg-white rounded-lg border border-[#E2E8F0] overflow-hidden';
const TABLE_CLS = 'w-full border-collapse collection-table text-[13px]';
const STICKY_TH = 'sticky right-0 bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]';
const STICKY_TD = 'sticky right-0 bg-white group-hover:bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]';
const CHECKBOX_CLS = 'w-4 h-4 accent-blue-600 rounded cursor-pointer align-middle';
const EMPTY_TD = 'py-16 text-center text-[13px] text-[#64748B]';
const MODAL_OVERLAY = 'fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-200';
const MODAL_OVERLAY_PORTAL = 'fixed inset-0 bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-200';
const MODAL_BOX = 'bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] flex flex-col overflow-hidden';
const MODAL_HEADER = 'px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4 shrink-0';
const MODAL_TITLE = 'text-[16px] font-medium text-[#020817]';
const MODAL_BODY = 'px-6 py-4 overflow-y-auto custom-scrollbar flex-1';
const MODAL_FOOTER = 'px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3 shrink-0';
const TEXTAREA_CLS = 'w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600';
const GROUP_CARD = 'rounded-2xl border border-[#E2E8F0] p-4';
const CHIP_ACTIVE = `${BTN_OUTLINE} !bg-[#EAF3FF] !border-[#BFDBFE] !text-[#155DFC]`;
const BANNER_INFO = 'bg-[#EAF3FF] border border-[#BFDBFE] rounded-lg px-4 py-3 text-[13px] text-[#020817]';
const BANNER_WARN = 'bg-[#FFF7ED] border border-[#FED7AA] rounded-lg px-4 py-3 text-[13px] text-[#020817]';
const BANNER_SUCCESS = 'bg-[#F0FDF4] border border-[#DCFCE7] rounded-lg px-4 py-3 text-[13px] text-[#020817]';
const BANNER_DANGER = 'bg-[#FEF2F2] border border-[#FEE2E2] rounded-lg px-4 py-3 text-[13px] text-[#020817]';
// Bảng phụ trong modal (chỉ đọc)
const SUB_TABLE_WRAP = 'border border-[#E2E8F0] rounded-lg overflow-x-auto bg-white';
const SUB_TH = 'h-[42px] px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px] text-left';
const SUB_TD = 'px-3 py-1 text-[13px] text-black';
const SUB_TR = 'h-12 bg-white border-b border-[#E0E0E0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors';

// Ngày + giờ hiển thị 2 dòng (compomennt.md 5.3.3); giá trị khác giữ nguyên
const DateTimeCell = ({ value }: { value: string }) => {
  const m = /^(\d{2}\/\d{2}\/\d{4})\s+(.+)$/.exec(value || '');
  if (!m) return <span>{value}</span>;
  return (
    <div className="leading-[18px]">
      <div>{m[1]}</div>
      <div className="text-[#64748B]">{m[2]}</div>
    </div>
  );
};

const STATUS_BADGE: Record<string, { label: string; variant: string }> = {
  approved: { label: 'Đã công bố', variant: 'green' },
  pending: { label: 'Chờ công bố', variant: 'purple' },
  rejected: { label: 'Từ chối', variant: 'red' },
  draft: { label: 'Bản nháp', variant: 'slate' },
};

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
  approvalNote?: string;
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
  const [selectedApprovalIds, setSelectedApprovalIds] = useState<string[]>([]);
  const [showBulkRejectModal, setShowBulkRejectModal] = useState(false);
  const [bulkRejectReason, setBulkRejectReason] = useState('');

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

  // Điều kiện đã áp dụng: chỉ cập nhật khi bấm nút Tìm kiếm hoặc Enter (compomennt.md 5.19)
  const EMPTY_APPLIED = { search: '', status: 'all', category: 'all', publisher: 'all', frequency: 'all', scheduleStatus: 'all' };
  const [applied, setApplied] = useState(EMPTY_APPLIED);

  const runSearch = () => {
    setApplied({
      search: searchTerm,
      status: selectedStatus,
      category: selectedCategory,
      publisher: selectedPublisher,
      frequency: selectedScheduleFrequency,
      scheduleStatus: selectedScheduleStatus,
    });
    setCurrentPageNum(1);
  };

  // Reset pagination on filter changes
  useEffect(() => {
    setCurrentPageNum(1);
  }, [applied, activeTab]);

  useEffect(() => {
    setCurrentPageNum(1);
    setSelectedStatus('all');
    setSelectedCategory('all');
    setSelectedPublisher('all');
    setSearchTerm('');
    setSelectedScheduleFrequency('all');
    setSelectedScheduleStatus('all');
    setApplied(EMPTY_APPLIED);
    setShowFilters(false);
  }, [activeTab]);

  // Filters
  const appliedQuery = normalizeSearch(applied.search);
  const filteredRequests = dataList.filter(item => {
    if (!item) return false;
    const matchSearch = normalizeSearch(item.fileName || '').includes(appliedQuery);
    const matchStatus = applied.status === 'all' || item.status === applied.status;
    const matchCategory = applied.category === 'all' || item.category === applied.category;
    const matchPublisher = applied.publisher === 'all' || item.publisher === applied.publisher;
    return matchSearch && matchStatus && matchCategory && matchPublisher;
  });

  const totalItemsCount = filteredRequests.length;
  const paginatedRequests = filteredRequests.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);

  const filteredApprovalRequests = dataList.filter(item => {
    if (!item) return false;
    if (item.status === 'draft') return false;
    const matchSearch = normalizeSearch(item.fileName || '').includes(appliedQuery);
    const matchStatus = applied.status === 'all' || item.status === applied.status;
    const matchCategory = applied.category === 'all' || item.category === applied.category;
    const matchPublisher = applied.publisher === 'all' || item.publisher === applied.publisher;
    return matchSearch && matchStatus && matchCategory && matchPublisher;
  });

  const totalApprovalItemsCount = filteredApprovalRequests.length;
  const paginatedApprovalRequests = filteredApprovalRequests.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);

  const approvalRequestStats = {
    pending: dataList.filter(d => d.status === 'pending').length,
    approved: dataList.filter(d => d.status === 'approved').length,
    rejected: dataList.filter(d => d.status === 'rejected').length,
    total: dataList.filter(d => d.status !== 'draft').length
  };



  const filteredSchedules = schedules.filter(sch => {
    if (!sch) return false;
    const matchSearch = normalizeSearch(sch.datasetName || '').includes(appliedQuery) || normalizeSearch(sch.dataSource || '').includes(appliedQuery);
    const matchFrequency = applied.frequency === 'all' || sch.frequency === applied.frequency;
    const matchStatus = applied.scheduleStatus === 'all' || sch.status === applied.scheduleStatus;
    return matchSearch && matchFrequency && matchStatus;
  });

  const totalScheduleItemsCount = filteredSchedules.length;
  const paginatedSchedules = filteredSchedules.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);

  const getStatusBadge = (status: string) => {
    const cfg = STATUS_BADGE[status] || STATUS_BADGE.pending;
    return <Badge label={cfg.label} variant={cfg.variant} />;
  };

  const handleViewDetail = (item: PublishedData) => {
    setSelectedData(item);
    setShowDetailModal(true);
  };

  const handleDownload = (fileName: string, format: string = 'Excel') => {
    toast.info(`Tải xuống tệp dữ liệu: ${fileName}`, { description: `Định dạng: ${format}` });
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
      createdDate: formatDateVN(new Date()),
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
      toast.error("Vui lòng nhập tên tập dữ liệu!");
      setRequestModalTab('general');
      return;
    }
    if (!requestCategory) {
      toast.error("Vui lòng chọn danh mục dữ liệu mở!");
      setRequestModalTab('general');
      return;
    }
    if (!requestPublisher) {
      toast.error("Vui lòng nhập đơn vị chủ trì cung cấp!");
      setRequestModalTab('general');
      return;
    }
    if (!requestTopic) {
      toast.error("Vui lòng chọn chủ đề!");
      setRequestModalTab('general');
      return;
    }
    if (requestFormat.length === 0) {
      toast.error("Vui lòng chọn ít nhất một định dạng chia sẻ!");
      setRequestModalTab('general');
      return;
    }
    if (requestModalTab === 'general') {
      setRequestModalTab('settings');
      return;
    }
    if (!mainTable) {
      toast.error("Vui lòng chọn cấu hình nguồn dữ liệu và bảng dữ liệu chính trong tab Thiết lập dữ liệu!");
      setRequestModalTab('settings');
      return;
    }
    if (editingItem) {
      const updatedRecord = { ...createNewRecord('pending'), id: editingItem.id, creator: editingItem.creator, createdDate: editingItem.createdDate };
      setDataList(dataList.map(d => d.id === editingItem.id ? updatedRecord : d));
      setShowRequestModal(false);
      resetRequestForm();
      setSendApprovalItem(updatedRecord);
      setSendApprovalApprover('');
      setSendApprovalNote('');
      setShowSendApprovalModal(true);
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
      toast.error("Vui lòng chọn tập dữ liệu trước khi lưu nháp!");
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

  // Quick bulk approval actions (row checkbox selection)
  const toggleSelectApprovalId = (id: string) => {
    setSelectedApprovalIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAllApprovalIds = () => {
    const pendingIds = paginatedApprovalRequests.filter(item => item.status === 'pending').map(item => item.id);
    setSelectedApprovalIds(prev => prev.length === pendingIds.length ? [] : pendingIds);
  };

  const handleBulkApprove = () => {
    setDataList(dataList.map(d => selectedApprovalIds.includes(d.id) ? {
      ...d,
      status: 'approved',
      approver: 'Lãnh đạo Nghiệp vụ'
    } : d));
    setSelectedApprovalIds([]);
    setSuccessPopupMessage('Đã phê duyệt các yêu cầu đã chọn!');
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const openBulkRejectModal = () => {
    setBulkRejectReason('');
    setShowBulkRejectModal(true);
  };

  const confirmBulkReject = () => {
    if (!bulkRejectReason.trim()) return;
    setDataList(dataList.map(d => selectedApprovalIds.includes(d.id) ? {
      ...d,
      status: 'rejected',
      approver: 'Lãnh đạo Nghiệp vụ',
      approvalNote: bulkRejectReason
    } : d));
    setSelectedApprovalIds([]);
    setShowBulkRejectModal(false);
    setBulkRejectReason('');
    setSuccessPopupMessage('Đã từ chối các yêu cầu đã chọn.');
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

  // Phân trang chuẩn (compomennt.md 5.14) — giữ hành vi cũ: không hiển thị khi không có bản ghi
  const renderPagination = (total: number) => {
    if (total <= 0) return null;
    return (
      <Pagination
        className="border-t border-[#E2E8F0]"
        currentPage={currentPageNum}
        totalItems={total}
        pageSize={pageSize}
        onPageChange={setCurrentPageNum}
        onPageSizeChange={(size) => { setPageSize(size); setCurrentPageNum(1); }}
      />
    );
  };

  const openEditSchedule = (schedule: ScheduleItem) => {
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
  };

  const openApprovalDetail = (item: PublishedData) => {
    setSelectedApprovalItem(item);
    setRejectReason('');
    setShowRejectForm(false);
    setShowApproveForm(false);
    setShowApprovalModal(true);
  };

  const approvalStatCards = [
    { label: 'Chờ công bố', value: approvalRequestStats.pending, icon: Clock, bg: 'bg-orange-50', fg: 'text-orange-600' },
    { label: 'Đã công bố', value: approvalRequestStats.approved, icon: CheckCircle, bg: 'bg-green-50', fg: 'text-green-600' },
    { label: 'Từ chối', value: approvalRequestStats.rejected, icon: XCircle, bg: 'bg-red-50', fg: 'text-red-600' },
    { label: 'Tổng yêu cầu', value: approvalRequestStats.total, icon: Edit2, bg: 'bg-blue-50', fg: 'text-blue-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs Header (compomennt.md 5.9) */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="flex px-6 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('requests')}
            className={tabClass(activeTab === 'requests')}
          >
            <FileText className="w-4 h-4" />
            Yêu cầu công bố
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('approval');
              setShowRejectForm(false);
              setRejectReason('');
            }}
            className={tabClass(activeTab === 'approval')}
          >
            <CheckCircle className="w-4 h-4" />
            Phê duyệt dữ liệu mở
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={tabClass(activeTab === 'schedule')}
          >
            <Calendar className="w-4 h-4" />
            Lịch công bố
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-6 pb-6">

        {/* RENDER TAB 1: YÊU CẦU CÔNG BỐ */}
        {activeTab === 'requests' && (
          <div className="space-y-4 animate-fade-in">
            {/* Filter and Search Row (compomennt.md 5.19) */}
            <div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 flex items-center gap-1.5">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      aria-label="Tìm kiếm yêu cầu công bố"
                      placeholder="Tìm kiếm theo mã, tên tệp dữ liệu..."
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

                  <button
                    type="button"
                    aria-label="Bộ lọc"
                    aria-expanded={showFilters}
                    onClick={() => setShowFilters(!showFilters)}
                    className={filterBtnClass(showFilters)}
                    title={showFilters ? "Đóng bộ lọc" : "Bộ lọc nâng cao"}
                  >
                    {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      resetRequestForm();
                      setShowRequestModal(true);
                    }}
                    className={`${BTN_PRIMARY} whitespace-nowrap`}
                  >
                    <Plus className="w-4 h-4" />
                    Gửi yêu cầu công bố
                  </button>
                </div>
              </div>

              {/* Advanced Collapsible Filter Panel */}
              {showFilters && (
                <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
                  <div>
                    <label className={FILTER_LABEL}>Trạng thái yêu cầu</label>
                    <select
                      aria-label="Trạng thái yêu cầu"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className={INPUT_CLS}
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="draft">Bản nháp</option>
                      <option value="pending">Chờ công bố</option>
                      <option value="approved">Đã công bố</option>
                      <option value="rejected">Từ chối</option>
                    </select>
                  </div>
                  <div>
                    <label className={FILTER_LABEL}>Danh mục mở</label>
                    <select
                      aria-label="Danh mục mở"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className={INPUT_CLS}
                    >
                      <option value="all">Tất cả danh mục</option>
                      <option value="Danh sách tổ chức thực hiện trợ giúp pháp lý">Danh sách tổ chức thực hiện trợ giúp pháp lý</option>
                      <option value="Danh sách người thực hiện trợ giúp pháp lý">Danh sách người thực hiện trợ giúp pháp lý</option>
                      <option value="Danh sách Luật sư Việt Nam">Danh sách Luật sư Việt Nam</option>
                    </select>
                  </div>
                  <div>
                    <label className={FILTER_LABEL}>Cơ quan công bố</label>
                    <select
                      aria-label="Cơ quan công bố"
                      value={selectedPublisher}
                      onChange={(e) => setSelectedPublisher(e.target.value)}
                      className={INPUT_CLS}
                    >
                      <option value="all">Tất cả cơ quan</option>
                      <option value="Bộ Tư pháp">Bộ Tư pháp</option>
                      <option value="Cục Bổ trợ tư pháp">Cục Bổ trợ tư pháp</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Grid Data Table (compomennt.md 5.3) */}
            <div className={TABLE_WRAP}>
              <div className="overflow-x-auto">
                <table className={TABLE_CLS}>
                  <thead className="bg-[#F8FAFC]">
                    <tr className={THEAD_ROW}>
                      <th className={`${TH} text-center w-16`}>STT</th>
                      <th className={`${TH} text-left`}>Tên tệp dữ liệu</th>
                      <th className={`${TH} text-left`}>Danh mục</th>
                      <th className={`${TH} text-left`}>Cơ quan công bố</th>
                      <th className={`${TH} text-left`}>Người tạo</th>
                      <th className={`${TH} text-left`}>Ngày tạo</th>
                      <th className={`${TH} text-left`}>Người phê duyệt</th>
                      <th className={`${TH} text-left`}>Trạng thái</th>
                      <th className={`${TH} text-center w-px ${STICKY_TH}`}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRequests.length === 0 ? (
                      <tr>
                        <td colSpan={9} className={EMPTY_TD}>
                          Không tìm thấy yêu cầu công bố nào.
                        </td>
                      </tr>
                    ) : (
                      paginatedRequests.map((item, index) => (
                        <tr key={item.id} className={TR}>
                          <td className={`${TD} text-center`}>
                            {(currentPageNum - 1) * pageSize + index + 1}
                          </td>
                          <td className={`${TD} text-left max-w-[360px]`}>
                            <div onClick={() => handleViewDetail(item)}>
                              <TruncatedText text={item.fileName || 'Không có tên tệp'} />
                            </div>
                          </td>
                          <td className={`${TD} text-left max-w-[280px]`}><TruncatedText text={item.category} /></td>
                          <td className={`${TD} text-left whitespace-nowrap`}>{item.publisher}</td>
                          <td className={`${TD} text-left whitespace-nowrap`}>{item.creator}</td>
                          <td className={`${TD} text-left whitespace-nowrap`}>{item.createdDate}</td>
                          <td className={`${TD} text-left whitespace-nowrap`}>{item.approver}</td>
                          <td className={`${TD} text-left`}>{getStatusBadge(item.status)}</td>
                          <td className={`${TD} text-center ${STICKY_TD}`}>
                            {/* Cột thao tác (compomennt.md 5.3.2): 3 thao tác => hiện đủ icon */}
                            <div className="inline-flex items-center justify-center gap-1">
                              <RowIconAction label="Xem chi tiết" onClick={() => handleViewDetail(item)}>
                                <Eye className="w-4 h-4" />
                              </RowIconAction>
                              <RowIconAction label="Chỉnh sửa" onClick={() => handleEditRequest(item)}>
                                <SquarePen className="w-4 h-4" />
                              </RowIconAction>
                              <RowIconAction
                                label="Gửi duyệt"
                                disabledReason={item.status !== 'draft' ? 'Chỉ gửi duyệt yêu cầu ở trạng thái Bản nháp' : undefined}
                                onClick={() => handleOpenSendApproval(item)}
                              >
                                <Send className="w-4 h-4" />
                              </RowIconAction>
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
            {/* Header Stat Cards (compomennt.md 5.6.1) */}
            <div className="grid grid-cols-4 gap-4">
              {approvalStatCards.map(card => (
                <div key={card.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${card.bg}`}>
                      <card.icon className={`w-5 h-5 ${card.fg}`} />
                    </div>
                    <div>
                      <div className="text-[16px] text-[#64748B]">{card.label}</div>
                      <div className="text-[16px] font-semibold text-[#0F172A] tabular-nums">{card.value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bulk quick action bar */}
            {selectedApprovalIds.length > 0 && (
              <div className="flex items-center justify-end gap-3">
                <span className="text-[13px] text-[#475569]">
                  Đã chọn: <span className="font-medium text-blue-600">{selectedApprovalIds.length}</span> yêu cầu
                </span>
                <button
                  type="button"
                  onClick={handleBulkApprove}
                  className={BTN_PRIMARY}
                >
                  <CheckCircle className="w-4 h-4" />
                  Phê duyệt nhanh
                </button>
                <button
                  type="button"
                  onClick={openBulkRejectModal}
                  className={BTN_DESTRUCTIVE}
                >
                  <XCircle className="w-4 h-4" />
                  Từ chối nhanh
                </button>
              </div>
            )}

            {/* Search + Status Pills (compomennt.md 5.19) — nút lọc nhanh áp dụng ngay */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-[280px] flex items-center gap-1.5">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    aria-label="Tìm kiếm yêu cầu phê duyệt"
                    placeholder="Tìm kiếm theo tên tệp dữ liệu..."
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
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'pending', label: 'Chờ công bố' },
                  { value: 'approved', label: 'Đã công bố' },
                  { value: 'rejected', label: 'Từ chối' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={selectedStatus === opt.value}
                    onClick={() => {
                      setSelectedStatus(opt.value);
                      setApplied(prev => ({ ...prev, status: opt.value }));
                    }}
                    className={selectedStatus === opt.value ? CHIP_ACTIVE : BTN_OUTLINE}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid Data Table */}
            <div className={TABLE_WRAP}>
              <div className="overflow-x-auto">
                <table className={TABLE_CLS}>
                  <thead className="bg-[#F8FAFC]">
                    <tr className={THEAD_ROW}>
                      <th className={`${TH} text-center w-10`}>
                        <input
                          type="checkbox"
                          title="Chọn tất cả"
                          aria-label="Chọn tất cả"
                          checked={selectedApprovalIds.length > 0 && selectedApprovalIds.length === paginatedApprovalRequests.filter(item => item.status === 'pending').length}
                          onChange={toggleSelectAllApprovalIds}
                          className={CHECKBOX_CLS}
                        />
                      </th>
                      <th className={`${TH} text-center w-16`}>STT</th>
                      <th className={`${TH} text-left`}>Tên tập dữ liệu</th>
                      <th className={`${TH} text-left`}>Danh mục</th>
                      <th className={`${TH} text-left`}>Cơ quan công bố</th>
                      <th className={`${TH} text-left`}>Người tạo</th>
                      <th className={`${TH} text-left`}>Ngày tạo</th>
                      <th className={`${TH} text-left`}>Trạng thái</th>
                      <th className={`${TH} text-center w-px ${STICKY_TH}`}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedApprovalRequests.length === 0 ? (
                      <tr>
                        <td colSpan={9} className={EMPTY_TD}>
                          Không có yêu cầu công bố nào được tìm thấy.
                        </td>
                      </tr>
                    ) : (
                      paginatedApprovalRequests.map((item, index) => (
                        <tr key={item.id} className={TR}>
                          <td className={`${TD} text-center`}>
                            {item.status === 'pending' && (
                              <input
                                type="checkbox"
                                title="Chọn bản ghi"
                                aria-label="Chọn bản ghi"
                                checked={selectedApprovalIds.includes(item.id)}
                                onChange={() => toggleSelectApprovalId(item.id)}
                                className={CHECKBOX_CLS}
                              />
                            )}
                          </td>
                          <td className={`${TD} text-center`}>{(currentPageNum - 1) * pageSize + index + 1}</td>
                          <td className={`${TD} text-left max-w-[360px]`}>
                            <div className="cursor-pointer" onClick={() => openApprovalDetail(item)}>
                              <TruncatedText text={item.fileName} />
                            </div>
                          </td>
                          <td className={`${TD} text-left max-w-[280px]`}><TruncatedText text={item.category} /></td>
                          <td className={`${TD} text-left whitespace-nowrap`}>{item.publisher}</td>
                          <td className={`${TD} text-left whitespace-nowrap`}>{item.creator}</td>
                          <td className={`${TD} text-left whitespace-nowrap`}>{item.createdDate}</td>
                          <td className={`${TD} text-left`}>{getStatusBadge(item.status)}</td>
                          <td className={`${TD} text-center ${STICKY_TD}`}>
                            {/* Cột thao tác (compomennt.md 5.3.2): 3 thao tác => hiện đủ icon */}
                            <div className="inline-flex items-center justify-center gap-1">
                              <RowIconAction label="Xem chi tiết" onClick={() => openApprovalDetail(item)}>
                                <Eye className="w-4 h-4" />
                              </RowIconAction>
                              <RowIconAction
                                label="Phê duyệt"
                                disabledReason={item.status !== 'pending' ? 'Đã xử lý' : undefined}
                                onClick={() => {
                                  if (item.status !== 'pending') return;
                                  setSelectedApprovalItem(item);
                                  setApproveOpinion('');
                                  setShowRejectForm(false);
                                  setShowApproveForm(true);
                                  setShowApprovalModal(true);
                                }}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </RowIconAction>
                              <RowIconAction
                                label="Từ chối"
                                disabledReason={item.status !== 'pending' ? 'Đã xử lý' : undefined}
                                onClick={() => {
                                  if (item.status !== 'pending') return;
                                  setSelectedApprovalItem(item);
                                  setRejectReason('');
                                  setRejectReasonError(false);
                                  setShowApproveForm(false);
                                  setShowRejectForm(true);
                                  setShowApprovalModal(true);
                                }}
                              >
                                <XCircle className="w-4 h-4" />
                              </RowIconAction>
                            </div>
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
            {/* Filter and Search Row (compomennt.md 5.19) */}
            <div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 flex items-center gap-1.5">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      aria-label="Tìm kiếm lịch công bố"
                      placeholder="Tìm kiếm theo tên tập dữ liệu, nguồn dữ liệu..."
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

                  <button
                    type="button"
                    aria-label="Bộ lọc"
                    aria-expanded={showFilters}
                    onClick={() => setShowFilters(!showFilters)}
                    className={filterBtnClass(showFilters)}
                    title={showFilters ? "Đóng bộ lọc" : "Bộ lọc nâng cao"}
                  >
                    {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
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
                    className={`${BTN_PRIMARY} whitespace-nowrap`}
                  >
                    <Plus className="w-4 h-4" />
                    Thêm lịch mới
                  </button>
                </div>
              </div>

              {/* Advanced Collapsible Filter Panel */}
              {showFilters && (
                <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
                  <div>
                    <label className={FILTER_LABEL}>Tần suất công bố</label>
                    <select
                      aria-label="Tần suất công bố"
                      value={selectedScheduleFrequency}
                      onChange={(e) => setSelectedScheduleFrequency(e.target.value)}
                      className={INPUT_CLS}
                    >
                      <option value="all">Tất cả tần suất</option>
                      <option value="daily">Hàng ngày</option>
                      <option value="weekly">Hàng tuần</option>
                      <option value="monthly">Hàng tháng</option>
                      <option value="quarterly">Hàng quý</option>
                    </select>
                  </div>
                  <div>
                    <label className={FILTER_LABEL}>Trạng thái lịch</label>
                    <select
                      aria-label="Trạng thái lịch"
                      value={selectedScheduleStatus}
                      onChange={(e) => setSelectedScheduleStatus(e.target.value)}
                      className={INPUT_CLS}
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Tạm dừng</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Schedules Table */}
            <div className={TABLE_WRAP}>
              <div className="overflow-x-auto">
                <table className={TABLE_CLS}>
                  <thead className="bg-[#F8FAFC]">
                    <tr className={THEAD_ROW}>
                      <th className={`${TH} text-center w-16`}>STT</th>
                      <th className={`${TH} text-left`}>Tên tập dữ liệu</th>
                      <th className={`${TH} text-left w-28`}>Mã</th>
                      <th className={`${TH} text-left`}>Tần suất</th>
                      <th className={`${TH} text-left`}>Giờ chạy</th>
                      <th className={`${TH} text-left`}>Lần chạy cuối</th>
                      <th className={`${TH} text-left`}>Lần chạy tiếp</th>
                      <th className={`${TH} text-left`}>Trạng thái</th>
                      <th className={`${TH} text-center w-px ${STICKY_TH}`}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedSchedules.length === 0 ? (
                      <tr>
                        <td colSpan={9} className={EMPTY_TD}>
                          Không tìm thấy lịch công bố nào.
                        </td>
                      </tr>
                    ) : (
                      paginatedSchedules.map((schedule, index) => (
                        <tr key={schedule.id} className={TR}>
                          <td className={`${TD} text-center`}>
                            {(currentPageNum - 1) * pageSize + index + 1}
                          </td>
                          <td className={`${TD} text-left max-w-[360px]`}>
                            <div onClick={() => openEditSchedule(schedule)}>
                              <TruncatedText text={schedule.datasetName} />
                            </div>
                          </td>
                          <td className={`${TD} text-left whitespace-nowrap`}>
                            {schedule.datasetCode}
                          </td>
                          <td className={`${TD} text-left whitespace-nowrap leading-[18px]`}>
                            <div>
                              {schedule.frequency === 'daily' ? 'Hàng ngày' : schedule.frequency === 'weekly' ? 'Hàng tuần' : schedule.frequency === 'monthly' ? 'Hàng tháng' : 'Hàng quý'}
                            </div>
                            {schedule.frequency === 'weekly' && schedule.weeklyDays && schedule.weeklyDays.length > 0 && (
                              <div className="text-[#64748B]">
                                {schedule.weeklyDays.join(', ')}
                              </div>
                            )}
                            {schedule.frequency === 'monthly' && schedule.monthlyDay && (
                              <div className="text-[#64748B]">
                                Ngày {schedule.monthlyDay} hàng tháng
                              </div>
                            )}
                            {schedule.frequency === 'quarterly' && schedule.quarterlyMonth && schedule.quarterlyDay && (
                              <div className="text-[#64748B]">
                                Tháng thứ {schedule.quarterlyMonth}, ngày {schedule.quarterlyDay}
                              </div>
                            )}
                          </td>
                          <td className={`${TD} text-left whitespace-nowrap`}>{schedule.startTime}</td>
                          <td className={`${TD} text-left whitespace-nowrap`}><DateTimeCell value={schedule.lastRun || 'Chưa chạy'} /></td>
                          <td className={`${TD} text-left whitespace-nowrap`}><DateTimeCell value={schedule.nextRun} /></td>
                          <td className={`${TD} text-left`}>
                            <Badge label={schedule.status === 'active' ? 'Hoạt động' : 'Tạm dừng'} variant={schedule.status === 'active' ? 'green' : 'slate'} />
                          </td>
                          <td className={`${TD} text-center ${STICKY_TD}`}>
                            {/* Cột thao tác (compomennt.md 5.3.2): 3 thao tác => hiện đủ icon */}
                            <div className="inline-flex items-center justify-center gap-1">
                              <RowIconAction label="Sửa lịch" onClick={() => openEditSchedule(schedule)}>
                                <Edit2 className="w-4 h-4" />
                              </RowIconAction>
                              {schedule.status === 'active' ? (
                                <RowIconAction label="Tạm dừng" onClick={() => setScheduleStatusConfirm({ schedule, action: 'pause' })}>
                                  <PauseCircle className="w-4 h-4" />
                                </RowIconAction>
                              ) : (
                                <RowIconAction label="Tiếp tục" onClick={() => setScheduleStatusConfirm({ schedule, action: 'resume' })}>
                                  <PlayCircle className="w-4 h-4" />
                                </RowIconAction>
                              )}
                              <RowIconAction
                                label="Xóa lịch"
                                onClick={() => {
                                  setSelectedSchedule(schedule);
                                  setShowDeleteScheduleModal(true);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </RowIconAction>
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

      {/* DETAIL MODAL (compomennt.md 5.4) */}
      {showDetailModal && selectedData && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-5xl`}>
            <div className={MODAL_HEADER}>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className={MODAL_TITLE}>Chi tiết Yêu cầu công bố dữ liệu mở</h3>
              </div>
              <button
                type="button"
                aria-label="Đóng"
                onClick={() => setShowDetailModal(false)}
                className={BTN_GHOST_ICON}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`${MODAL_BODY} space-y-5 text-[13px]`}>

              {/* ── Tên tập dữ liệu ── */}
              <div className={`${GROUP_CARD} grid grid-cols-2 gap-x-6 gap-y-4`}>
                <div className="col-span-2">
                  <div className={`${FIELD_LABEL} mb-1`}>Tên tập dữ liệu</div>
                  <div className={`${FIELD_VALUE} flex items-center gap-1.5`}>
                    <FileSpreadsheet className="w-4 h-4 text-[#16A34A] shrink-0" />
                    {selectedData.fileName || 'Không có tên tệp'}
                  </div>
                </div>

                <div>
                  <div className={`${FIELD_LABEL} mb-1`}>Trạng thái</div>
                  <div>{getStatusBadge(selectedData.status)}</div>
                </div>
                <div>
                  <div className={`${FIELD_LABEL} mb-1`}>Người phê duyệt</div>
                  <div className={FIELD_VALUE}>{selectedData.approver || '-'}</div>
                </div>

                <div>
                  <div className={`${FIELD_LABEL} mb-1`}>Người tạo yêu cầu</div>
                  <div className={FIELD_VALUE}>{selectedData.creator || '-'}</div>
                </div>
                <div>
                  <div className={`${FIELD_LABEL} mb-1`}>Ngày tạo yêu cầu</div>
                  <div className={FIELD_VALUE}>{selectedData.createdDate || '-'}</div>
                </div>

                <div>
                  <div className={`${FIELD_LABEL} mb-1`}>Danh mục dữ liệu mở</div>
                  <div className={FIELD_VALUE}>{selectedData.category || '-'}</div>
                </div>
                <div>
                  <div className={`${FIELD_LABEL} mb-1`}>Đơn vị chủ trì cung cấp</div>
                  <div className={FIELD_VALUE}>{selectedData.publisher || '-'}</div>
                </div>

                <div>
                  <div className={`${FIELD_LABEL} mb-1`}>Giấy phép</div>
                  <div className={FIELD_VALUE}>{selectedData.license || '-'}</div>
                </div>
                <div>
                  <div className={`${FIELD_LABEL} mb-1`}>Từ khóa</div>
                  <div className={FIELD_VALUE}>{selectedData.keywords || '-'}</div>
                </div>

                <div>
                  <div className={`${FIELD_LABEL} mb-1`}>Định dạng chia sẻ</div>
                  <div className="flex flex-wrap gap-1">
                    {(selectedData.format || []).length > 0
                      ? selectedData.format.map((fmt, i) => (
                          <Badge key={i} label={fmt} variant="blue" />
                        ))
                      : <span className={FIELD_VALUE}>-</span>
                    }
                  </div>
                </div>
                <div>
                  <div className={`${FIELD_LABEL} mb-1`}>Tần suất cập nhật</div>
                  <div className={FIELD_VALUE}>{getFrequencyLabel(selectedData.frequency || '') || '-'}</div>
                </div>

                <div>
                  <div className={`${FIELD_LABEL} mb-1`}>Chủ đề</div>
                  <div className={FIELD_VALUE}>{selectedData.topic || '-'}</div>
                </div>

                <div className="col-span-2">
                  <div className={`${FIELD_LABEL} mb-1`}>Thông tin mô tả</div>
                  <div className={`${FIELD_VALUE} whitespace-pre-wrap`}>{selectedData.description || '-'}</div>
                </div>

                <div className="col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="detailPublishImmediately"
                    checked={selectedData.publishImmediately || false}
                    disabled
                    className="w-4 h-4 accent-blue-600 rounded cursor-not-allowed"
                  />
                  <label htmlFor="detailPublishImmediately" className="text-[13px] text-[#020817] select-none cursor-not-allowed">
                    Công bố dữ liệu ngay sau khi được phê duyệt
                  </label>
                </div>
              </div>

              {/* ── Nội dung trình duyệt ── */}
              <div>
                <div className={SECTION_TITLE.replace('mb-4', 'mb-2')}>
                  <FileText className="w-4 h-4 text-[#64748B]" />
                  Nội dung trình duyệt
                </div>
                <div className="px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] min-h-[46px] whitespace-pre-wrap">
                  {selectedData.submitNote || 'Chưa cập nhật'}
                </div>
              </div>

              {/* ── Ý kiến phê duyệt ── */}
              {selectedData.status === 'approved' && (
                <div className={BANNER_SUCCESS}>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span className="text-[13px] font-medium text-[#15803D]">
                      Ý kiến phê duyệt
                    </span>
                  </div>
                  <p className="text-[13px] leading-relaxed text-[#020817]">
                    {selectedData.approvalNote || '-'}
                  </p>
                </div>
              )}

              {/* ── Lý do từ chối ── */}
              {selectedData.status === 'rejected' && (
                <div className={BANNER_DANGER}>
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
                    <span className="text-[13px] font-medium text-[#B91C1C]">
                      Lý do từ chối
                    </span>
                  </div>
                  <p className="text-[13px] leading-relaxed text-[#020817]">
                    {selectedData.approvalNote || '-'}
                  </p>
                </div>
              )}

              {/* ── Cấu hình nguồn dữ liệu ── */}
              {(() => {
                const meta = getRecordMetadataConfig(selectedData);
                const dbName = WAREHOUSE_DATABASES.find(db => db.id === meta.dbId)?.name || meta.dbId;
                return (
                  <section className={GROUP_CARD}>
                    <h4 className={SECTION_TITLE}>
                      <Database className="w-4 h-4 text-blue-600" />
                      Cấu hình nguồn dữ liệu
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                          <div className={`${FIELD_LABEL} mb-1`}>Kho dữ liệu</div>
                          <div className={`${FIELD_VALUE} flex items-center gap-1.5`}>
                            <Database className="w-4 h-4 text-blue-600 shrink-0" />
                            {dbName || '-'}
                          </div>
                        </div>
                        <div>
                          <div className={`${FIELD_LABEL} mb-1`}>Bảng dữ liệu chính</div>
                          <div className={FIELD_VALUE}>{meta.mainTable || '-'}</div>
                        </div>
                      </div>

                      {meta.joinTables.length > 0 && (
                        <div>
                          <div className={`${FIELD_LABEL} mb-2`}>Bảng liên kết (Join)</div>
                          <div className="space-y-1.5">
                            {meta.joinTables.map((jt, idx) => (
                              <div key={idx} className="bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 flex items-center justify-between gap-4 text-[13px] text-[#020817]">
                                <span>{jt.tableId} <span className="text-[#64748B]">({jt.alias})</span></span>
                                <span>{jt.joinType} ON {jt.joinColA} = {jt.joinColB}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {meta.dataFields.length > 0 && (
                        <div>
                          <div className={`${FIELD_LABEL} mb-2`}>Trường dữ liệu chia sẻ ({meta.dataFields.filter((f: any) => f.shared).length}/{meta.dataFields.length})</div>
                          <div className={SUB_TABLE_WRAP}>
                            <table className={TABLE_CLS}>
                              <thead className="bg-[#F8FAFC]">
                                <tr className="h-[42px] border-b border-[#E0E0E0]">
                                  <th className={SUB_TH}>Trường gốc</th>
                                  <th className={SUB_TH}>Bảng nguồn</th>
                                  <th className={SUB_TH}>Tên trường (API)</th>
                                  <th className={SUB_TH}>Kiểu dữ liệu</th>
                                  <th className={SUB_TH}>Che dấu</th>
                                </tr>
                              </thead>
                              <tbody>
                                {meta.dataFields.filter((f: any) => f.shared).map((df: any, idx: number) => (
                                  <tr key={idx} className={SUB_TR}>
                                    <td className={`${SUB_TD} max-w-[220px]`}><TruncatedText text={df.column || '-'} /></td>
                                    <td className={`${SUB_TD} max-w-[220px]`}><TruncatedText text={df.tableId || '-'} /></td>
                                    <td className={`${SUB_TD} max-w-[220px]`}><TruncatedText text={df.apiField || '-'} /></td>
                                    <td className={SUB_TD}>
                                      <Badge label={df.dataType} variant={df.dataType === 'date' ? 'purple' : df.dataType === 'number' ? 'blue' : 'slate'} />
                                    </td>
                                    <td className={SUB_TD}>
                                      <Badge label={df.masked ? 'Có' : 'Không'} variant={df.masked ? 'red' : 'green'} />
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

            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className={BTN_OUTLINE}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST MODAL (compomennt.md 5.4) */}
      {showRequestModal && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-5xl`}>
            <div className={MODAL_HEADER}>
              <div className="flex items-center gap-2">
                {editingItem ? <Edit2 className="w-5 h-5 text-blue-600" /> : <Send className="w-5 h-5 text-blue-600" />}
                <h3 className={MODAL_TITLE}>{editingItem ? 'Chỉnh sửa yêu cầu công bố' : 'Gửi yêu cầu công bố dữ liệu'}</h3>
              </div>
              <button
                type="button"
                aria-label="Đóng"
                onClick={() => setShowRequestModal(false)}
                className={BTN_GHOST_ICON}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TAB SELECTOR (compomennt.md 5.9) */}
            <div className="px-6 border-b border-[#E2E8F0] bg-white flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setRequestModalTab('general')}
                className={tabClass(requestModalTab === 'general')}
              >
                Thông tin chung
              </button>
              <button
                type="button"
                onClick={() => setRequestModalTab('settings')}
                className={tabClass(requestModalTab === 'settings')}
              >
                Thiết lập dữ liệu
              </button>
            </div>

            <form onSubmit={handleRequestSubmit} className="flex flex-col flex-1 min-h-0">
              <div className={`${MODAL_BODY} space-y-6 text-[13px]`}>
              {requestModalTab === 'general' && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-200">
                <div className="col-span-2">
                  <label className={LABEL_CLS}>
                    Tên tập dữ liệu <span className={REQUIRED_MARK}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập tên tập dữ liệu công bố..."
                    value={requestFileName}
                    onChange={(e) => setRequestFileName(e.target.value)}
                    className={INPUT_CLS}
                  />
                </div>

                <div className="col-span-2">
                  <label className={LABEL_CLS}>
                    Danh mục dữ liệu mở <span className={REQUIRED_MARK}>*</span>
                  </label>
                  <select
                    aria-label="Danh mục dữ liệu mở"
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
                    className={INPUT_CLS}
                  >
                    <option value="">-- Chọn danh mục dữ liệu mở --</option>
                    {APPROVED_CATEGORIES.map(cat => (
                      <option key={cat.code} value={cat.code}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className={LABEL_CLS}>Chọn metadata</label>
                  <select
                    aria-label="Chọn metadata"
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
                    className={INPUT_CLS}
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
                    <div className={`col-span-2 ${BANNER_INFO}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <Info className="w-4 h-4 text-[#155DFC] shrink-0" />
                        <span className="text-[13px] font-medium text-[#020817]">Thông tin metadata đã cấu hình</span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[13px]">
                        <div className="flex gap-1">
                          <span className="text-[#64748B] shrink-0">Danh mục:</span>
                          <span className="text-[#020817]">{metaCfg.categoryName}</span>
                        </div>
                        <div className="flex gap-1">
                          <span className="text-[#64748B] shrink-0">Đơn vị chủ trì cung cấp:</span>
                          <span className="text-[#020817]">{metaCfg.publisher}</span>
                        </div>
                        <div className="flex gap-1">
                          <span className="text-[#64748B] shrink-0">Giấy phép:</span>
                          <span className="text-[#020817]">{metaCfg.license}</span>
                        </div>
                        <div className="flex gap-1">
                          <span className="text-[#64748B] shrink-0">Tần suất cập nhật:</span>
                          <span className="text-[#020817]">{metaCfg.frequency ? (freqLabel[metaCfg.frequency] || metaCfg.frequency) : '—'}</span>
                        </div>
                        <div className="flex gap-1">
                          <span className="text-[#64748B] shrink-0">Bảng chính:</span>
                          <span className="text-[#020817]">{metaCfg.mainTable || '—'}</span>
                        </div>
                        <div className="flex gap-1">
                          <span className="text-[#64748B] shrink-0">Bảng join:</span>
                          <span className="text-[#020817]">{metaCfg.joinTableNames && metaCfg.joinTableNames.length > 0 ? metaCfg.joinTableNames.join(', ') : '—'}</span>
                        </div>
                        <div className="flex gap-1">
                          <span className="text-[#64748B] shrink-0">Định dạng chia sẻ:</span>
                          <span className="text-[#155DFC]">{metaCfg.shareFormat ? (shareFormatLabel[metaCfg.shareFormat] || metaCfg.shareFormat) : '—'}</span>
                        </div>
                        <div className="flex gap-1">
                          <span className="text-[#64748B] shrink-0">Từ khóa:</span>
                          <span className="text-[#020817]">{metaCfg.keywords}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <div>
                  <label className={LABEL_CLS}>
                    Giấy phép <span className={REQUIRED_MARK}>*</span>
                  </label>
                  <select
                    aria-label="Giấy phép"
                    value={requestLicense}
                    onChange={(e) => setRequestLicense(e.target.value)}
                    className={INPUT_CLS}
                  >
                    <option value="Giấy phép dữ liệu mở công cộng">Giấy phép dữ liệu mở công cộng</option>
                    <option value="Giấy phép ODC-BY">Giấy phép ODC-BY</option>
                  </select>
                </div>

                <div>
                  <label className={LABEL_CLS}>Từ khóa</label>
                  <input
                    type="text"
                    placeholder="Ngăn cách bằng dấu phẩy, vd: luat, tgpl, tro giup"
                    value={requestKeywords}
                    onChange={(e) => setRequestKeywords(e.target.value)}
                    className={INPUT_CLS}
                  />
                </div>

                <div>
                  <label className={LABEL_CLS}>
                    Đơn vị chủ trì cung cấp <span className={REQUIRED_MARK}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập tên đơn vị chủ trì cung cấp"
                    value={requestPublisher}
                    onChange={(e) => setRequestPublisher(e.target.value)}
                    className={INPUT_CLS}
                  />
                </div>

                <div>
                  <label className={LABEL_CLS}>
                    Chủ đề <span className={REQUIRED_MARK}>*</span>
                  </label>
                  <select
                    aria-label="Chủ đề"
                    value={requestTopic}
                    onChange={(e) => setRequestTopic(e.target.value)}
                    className={INPUT_CLS}
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
                  <label className={LABEL_CLS}>Tần suất cập nhật</label>
                  <select
                    aria-label="Tần suất cập nhật"
                    value={requestFrequency}
                    onChange={(e) => setRequestFrequency(e.target.value)}
                    className={INPUT_CLS}
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
                  <label className={LABEL_CLS}>
                    Định dạng chia sẻ <span className={REQUIRED_MARK}>*</span>
                  </label>
                  <div className="flex gap-4 h-10 items-center">
                    {[{ value: 'excel', label: 'File Excel' }, { value: 'api', label: 'API' }].map(opt => (
                      <label key={opt.value} className="flex items-center gap-2 cursor-pointer select-none text-[13px] text-[#020817]">
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
                          className={CHECKBOX_CLS}
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="col-span-2">
                  <label className={LABEL_CLS}>Thông tin mô tả</label>
                  <textarea
                    rows={2}
                    placeholder="Mô tả nội dung tập dữ liệu công bố..."
                    value={requestDescription}
                    onChange={(e) => setRequestDescription(e.target.value)}
                    className={TEXTAREA_CLS}
                  />
                </div>

                <div className="col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="requestPublishImmediately"
                    checked={requestPublishImmediately}
                    onChange={(e) => setRequestPublishImmediately(e.target.checked)}
                    className={CHECKBOX_CLS}
                  />
                  <label htmlFor="requestPublishImmediately" className="text-[13px] text-[#020817] select-none cursor-pointer">
                    Công bố dữ liệu ngay sau khi được phê duyệt
                  </label>
                </div>
              </div>
            )}

            {requestModalTab === 'settings' && (
              <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-200">
                {/* SOURCE CONFIG SECTION */}
                <div className="col-span-2">
                  <section className={GROUP_CARD}>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <h4 className={SECTION_TITLE.replace('mb-4', 'mb-0')}>
                        <Database className="w-4 h-4 text-blue-600" />
                        Cấu hình nguồn dữ liệu
                      </h4>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={hasJoin}
                        className="flex items-center gap-2 cursor-pointer text-[13px] text-[#020817]"
                        onClick={() => setHasJoin(!hasJoin)}
                      >
                        <span>Sử dụng liên kết bảng (Join)</span>
                        <span className={`w-9 h-5 rounded-full p-0.5 transition-colors ${hasJoin ? 'bg-blue-600' : 'bg-[#CBD5E1]'}`}>
                          <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${hasJoin ? 'translate-x-4' : 'translate-x-0'}`}></span>
                        </span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {sourceDbId && (
                        <div className={`${BANNER_INFO} flex items-center gap-2 !py-2`}>
                          <Database className="w-4 h-4 text-[#155DFC] shrink-0" />
                          <span className="text-[#64748B]">Kho dữ liệu:</span>
                          <span>{WAREHOUSE_DATABASES.find(db => db.id === sourceDbId)?.name || sourceDbId}</span>
                        </div>
                      )}

                      {/* Primary Table */}
                      <div>
                        <label className={`${LABEL_CLS} flex items-center justify-between`}>
                          <span>Bảng dữ liệu chính</span>
                          <span className="text-[12px] font-normal text-[#64748B]">Primary Table</span>
                        </label>
                        <select
                          aria-label="Bảng dữ liệu chính"
                          className={INPUT_CLS}
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
                          <div className={`mt-2 ${BANNER_WARN} !py-2 flex items-center gap-2 animate-in fade-in duration-200`}>
                            <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0" />
                            <span>Vui lòng chọn cấu hình metadata tại Thông tin chung</span>
                          </div>
                        )}
                      </div>

                      {/* Join Tables */}
                      {hasJoin && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                          <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-4">
                            <h5 className="text-[13px] font-medium text-[#020817] flex items-center gap-1.5">
                              <Database className="w-4 h-4 text-blue-600" />
                              Bảng liên kết bổ sung ({joinTables.length})
                            </h5>
                            <button
                              type="button"
                              onClick={() => {
                                const idx = joinTables.length;
                                const newJt = { id: `join_new_${idx}_${Date.now()}`, tableId: '', alias: `t${idx + 2}`, joinType: 'LEFT JOIN', joinColA: '', joinColB: '' };
                                setJoinTables([...joinTables, newJt]);
                              }}
                              className={BTN_OUTLINE}
                            >
                              <Plus className="w-4 h-4" /> Thêm bảng liên kết
                            </button>
                          </div>

                          {joinTables.map((jt, idx) => (
                            <div key={jt.id} className={`${GROUP_CARD} relative space-y-4`}>
                              <div className="absolute top-3 right-3">
                                <RowIconAction
                                  label="Xóa bảng liên kết"
                                  onClick={() => {
                                    const newJts = joinTables.filter(j => j.id !== jt.id);
                                    setJoinTables(newJts);
                                    if (sourceDbId && mainTable) {
                                      setDataFields(buildAllDataFields(sourceDbId, mainTable, newJts.map(j => j.tableId).filter(Boolean)));
                                    }
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </RowIconAction>
                              </div>

                              <div className="flex items-center gap-3">
                                <Badge label={`BẢNG LIÊN KẾT #${idx + 1}`} variant="blue" />
                                <span className="text-[13px] text-[#020817]">Alias: {jt.alias}</span>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className={LABEL_CLS}>Kiểu liên kết</label>
                                  <select
                                    aria-label="Kiểu liên kết"
                                    className={INPUT_CLS}
                                    value={jt.joinType}
                                    onChange={(e) => setJoinTables(joinTables.map(j => j.id === jt.id ? { ...j, joinType: e.target.value } : j))}
                                  >
                                    <option>INNER JOIN</option>
                                    <option>LEFT JOIN</option>
                                    <option>RIGHT JOIN</option>
                                  </select>
                                </div>
                                <div>
                                  <label className={LABEL_CLS}>Bảng dữ liệu bổ sung</label>
                                  <select
                                    aria-label="Bảng dữ liệu bổ sung"
                                    className={INPUT_CLS}
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
                                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-dashed border-[#CBD5E1] space-y-2 animate-in fade-in zoom-in-95 duration-200">
                                  <div className={FIELD_LABEL}>Điều kiện liên kết (Join Condition):</div>
                                  <div className="flex flex-col md:flex-row items-center gap-2">
                                    <div className="flex-1 w-full">
                                      <select
                                        aria-label={`Cột của ${jt.tableId}`}
                                        className={INPUT_CLS}
                                        value={jt.joinColA}
                                        onChange={(e) => setJoinTables(joinTables.map(j => j.id === jt.id ? { ...j, joinColA: e.target.value } : j))}
                                      >
                                        <option value="">-- Cột của {jt.tableId} --</option>
                                        {(SOURCE_DB_TABLES[sourceDbId] || []).find(t => t.name === jt.tableId)?.columns.map(col => (
                                          <option key={col} value={`${jt.alias}.${col}`}>{jt.alias}.{col}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className="text-[13px] font-medium text-[#155DFC] px-2.5 py-1 bg-[#EAF3FF] rounded-lg border border-[#BFDBFE]">=</div>
                                    <div className="flex-1 w-full">
                                      <select
                                        aria-label="Nối với cột"
                                        className={INPUT_CLS}
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
                  <div className="col-span-2">
                    <section className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
                      <div className="flex justify-between items-center gap-4 px-4 py-3 border-b border-[#E2E8F0]">
                        <h4 className={SECTION_TITLE.replace('mb-4', 'mb-0')}>
                          <FileText className="w-4 h-4 text-blue-600" />
                          Chọn trường dữ liệu chia sẻ (Field Selection)
                        </h4>
                        <div className="flex items-center gap-3">
                          <span className="text-[13px] text-[#64748B]">{dataFields.filter(f => f.shared).length}/{dataFields.length} trường được chọn</span>
                          <button
                            type="button"
                            onClick={handleAddDataField}
                            className={BTN_OUTLINE}
                            title="Thêm trường dữ liệu"
                          >
                            <Plus className="w-4 h-4" /> Thêm trường dữ liệu
                          </button>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className={`${TABLE_CLS} table-fixed`}>
                          <colgroup>
                            <col className="w-[7%]" />
                            <col className="w-[5%]" />
                            <col className="w-[20%]" />
                            <col className="w-[20%]" />
                            <col className="w-[20%]" />
                            <col className="w-[15%]" />
                            <col className="w-[7%]" />
                            <col className="w-[6%]" />
                          </colgroup>
                          <thead className="bg-[#F8FAFC]">
                            <tr className={THEAD_ROW}>
                              <th className={`${TH} text-center`}>Chia sẻ</th>
                              <th className={`${TH} text-center`}>PK</th>
                              <th className={`${TH} text-left`}>Nguồn dữ liệu (Table)</th>
                              <th className={`${TH} text-left`}>Trường gốc (Column)</th>
                              <th className={`${TH} text-left`}>Tên trường (API Field)</th>
                              <th className={`${TH} text-left`}>Kiểu dữ liệu</th>
                              <th className={`${TH} text-center`}>Che dấu</th>
                              <th className={`${TH} text-center`}>Xóa</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dataFields.map((df) => (
                              <tr key={df.id} className={`${TR} ${!df.shared ? 'opacity-50' : ''}`}>
                                <td className={`${TD} text-center`}>
                                  <input
                                    type="checkbox"
                                    title="Chọn trường"
                                    aria-label="Chọn trường"
                                    checked={df.shared}
                                    onChange={() => setDataFields(dataFields.map(f => f.id === df.id ? { ...f, shared: !f.shared } : f))}
                                    className={CHECKBOX_CLS}
                                  />
                                </td>
                                <td className={`${TD} text-center`}>
                                  <Key
                                    className={`w-4 h-4 mx-auto cursor-pointer transition-colors ${df.isPk ? 'text-blue-600' : 'text-[#94A3B8] hover:text-blue-600'}`}
                                    onClick={() => setDataFields(dataFields.map(f => f.id === df.id ? { ...f, isPk: !f.isPk } : f))}
                                  />
                                </td>
                                <td className={`${TD} overflow-hidden`}>
                                  <select
                                    title="Chọn bảng"
                                    className={`${INPUT_CLS} min-w-0`}
                                    value={df.tableId || mainTable}
                                    onChange={(e) => setDataFields(dataFields.map(f => f.id === df.id ? { ...f, tableId: e.target.value } : f))}
                                  >
                                    <option value={mainTable}>{mainTable} (Gốc)</option>
                                    {joinTables && joinTables.map((t: any) => t.tableId && (
                                      <option key={t.id || t.tableId} value={t.tableId}>{t.tableId} (Liên kết)</option>
                                    ))}
                                  </select>
                                </td>
                                <td className={`${TD} overflow-hidden`}>
                                  <select
                                    title="Chọn cột nguồn"
                                    className={`${INPUT_CLS} min-w-0`}
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
                                <td className={`${TD} overflow-hidden`}>
                                  <input
                                    title="Tên trường API"
                                    aria-label="Tên trường API"
                                    type="text"
                                    className={`${INPUT_CLS} min-w-0`}
                                    value={df.apiField}
                                    onChange={(e) => setDataFields(dataFields.map(f => f.id === df.id ? { ...f, apiField: e.target.value } : f))}
                                    placeholder="Ví dụ: ho_ten"
                                  />
                                </td>
                                <td className={`${TD} overflow-hidden`}>
                                  <select
                                    title="Kiểu"
                                    className={`${INPUT_CLS} min-w-0`}
                                    value={df.dataType}
                                    onChange={(e) => setDataFields(dataFields.map(f => f.id === df.id ? { ...f, dataType: e.target.value } : f))}
                                  >
                                    <option value="string">string</option>
                                    <option value="number">number</option>
                                    <option value="date">date</option>
                                    <option value="datetime">datetime</option>
                                  </select>
                                </td>
                                <td className={`${TD} text-center`}>
                                  <input
                                    type="checkbox"
                                    title="Masking"
                                    aria-label="Masking"
                                    className={CHECKBOX_CLS}
                                    checked={df.masked || false}
                                    onChange={(e) => setDataFields(dataFields.map(f => f.id === df.id ? { ...f, masked: e.target.checked } : f))}
                                  />
                                </td>
                                <td className={`${TD} text-center`}>
                                  <RowIconAction label="Xóa trường" onClick={() => setDataFields(dataFields.filter(f => f.id !== df.id))}>
                                    <Trash2 className="w-4 h-4" />
                                  </RowIconAction>
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
                <div className={`${BANNER_WARN} flex items-start gap-2 animate-fade-in`}>
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-[#D97706]" />
                  <div>
                    <span>Thông tin chỉnh sửa không hợp lệ so với metadata cho phép:</span>
                    <p className="mt-1 text-[13px] text-[#475569]">{formValidationError}</p>
                  </div>
                </div>
              )}
              </div>

              <div className={MODAL_FOOTER}>
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className={BTN_OUTLINE}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={!!formValidationError}
                  className={BTN_OUTLINE}
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
                        toast.error("Vui lòng nhập tên tập dữ liệu!");
                        return;
                      }
                      if (!requestCategory) {
                        toast.error("Vui lòng chọn danh mục dữ liệu mở!");
                        return;
                      }
                      if (!requestPublisher) {
                        toast.error("Vui lòng nhập đơn vị chủ trì cung cấp!");
                        return;
                      }
                      if (!requestTopic) {
                        toast.error("Vui lòng chọn chủ đề!");
                        return;
                      }
                      if (requestFormat.length === 0) {
                        toast.error("Vui lòng chọn ít nhất một định dạng chia sẻ!");
                        return;
                      }
                      setRequestModalTab('settings');
                    }}
                    className={BTN_PRIMARY}
                  >
                    Tiếp tục
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!!formValidationError || (!editingItem && !mainTable && uploadType === 'file' && !validationSuccess)}
                    className={BTN_PRIMARY}
                  >
                    <Send className="w-4 h-4" />
                    Gửi yêu cầu
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BULK REJECT MODAL (compomennt.md 5.4) */}
      {showBulkRejectModal && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-md`}>
            <div className={MODAL_HEADER}>
              <h3 className={MODAL_TITLE}>Từ chối nhanh</h3>
              <button
                type="button"
                aria-label="Đóng"
                onClick={() => setShowBulkRejectModal(false)}
                className={BTN_GHOST_ICON}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={`${MODAL_BODY} space-y-3`}>
              <p className="text-[13px] text-[#020817]">
                Từ chối <span className="font-medium text-blue-600">{selectedApprovalIds.length}</span> yêu cầu công bố đã chọn.
              </p>
              <div>
                <label className={LABEL_CLS}>Lý do từ chối <span className={REQUIRED_MARK}>*</span></label>
                <textarea
                  value={bulkRejectReason}
                  onChange={(e) => setBulkRejectReason(e.target.value)}
                  rows={3}
                  className={TEXTAREA_CLS}
                  placeholder="Nhập lý do từ chối..."
                />
              </div>
            </div>
            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => setShowBulkRejectModal(false)}
                className={BTN_OUTLINE}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmBulkReject}
                disabled={!bulkRejectReason.trim()}
                className={BTN_DESTRUCTIVE}
              >
                <XCircle className="w-4 h-4" />
                Từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPROVAL MODAL (compomennt.md 5.4) */}
      {showApprovalModal && selectedApprovalItem && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-2xl`}>
            <div className={MODAL_HEADER}>
              <h3 className={MODAL_TITLE}>Phê duyệt yêu cầu công bố</h3>
              <button
                type="button"
                aria-label="Đóng"
                onClick={() => {
                  setShowApprovalModal(false);
                  setShowRejectForm(false);
                  setShowApproveForm(false);
                  setApproveOpinion('');
                  setRejectReason('');
                }}
                className={BTN_GHOST_ICON}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`${MODAL_BODY} space-y-4 text-[13px]`}>
              {!showApproveForm && !showRejectForm && (
                <div className={`${GROUP_CARD} grid grid-cols-2 gap-x-6 gap-y-4`}>
                  <div className="col-span-2">
                    <div className={`${FIELD_LABEL} mb-1`}>Tên tệp đề xuất</div>
                    <div className={`${FIELD_VALUE} flex items-center gap-1.5`}>
                      <FileSpreadsheet className="w-4 h-4 text-[#16A34A] shrink-0" />
                      {selectedApprovalItem.fileName || '-'}
                    </div>
                  </div>
                  <div>
                    <div className={`${FIELD_LABEL} mb-1`}>Danh mục mở</div>
                    <div className={FIELD_VALUE}>{selectedApprovalItem.category || '-'}</div>
                  </div>
                  <div>
                    <div className={`${FIELD_LABEL} mb-1`}>Người đề xuất</div>
                    <div className={FIELD_VALUE}>{selectedApprovalItem.creator || '-'}</div>
                  </div>
                  <div>
                    <div className={`${FIELD_LABEL} mb-1`}>Đơn vị chủ trì cung cấp</div>
                    <div className={FIELD_VALUE}>{selectedApprovalItem.publisher || '-'}</div>
                  </div>
                  <div>
                    <div className={`${FIELD_LABEL} mb-1`}>Giấy phép</div>
                    <div className={FIELD_VALUE}>{selectedApprovalItem.license || '-'}</div>
                  </div>
                  <div>
                    <div className={`${FIELD_LABEL} mb-1`}>Từ khóa</div>
                    <div className={FIELD_VALUE}>{selectedApprovalItem.keywords || '-'}</div>
                  </div>
                  <div>
                    <div className={`${FIELD_LABEL} mb-1`}>Tần suất cập nhật</div>
                    <div className={FIELD_VALUE}>{getFrequencyLabel(selectedApprovalItem.frequency || 'monthly')}</div>
                  </div>
                  <div>
                    <div className={`${FIELD_LABEL} mb-1`}>Chủ đề</div>
                    <div className={FIELD_VALUE}>{selectedApprovalItem.topic || '-'}</div>
                  </div>
                  <div className="col-span-2">
                    <div className={`${FIELD_LABEL} mb-1`}>Định dạng chia sẻ</div>
                    <div className="flex flex-wrap gap-1">
                      {(selectedApprovalItem.format || []).length > 0
                        ? (selectedApprovalItem.format || []).map((fmt, i) => (
                            <Badge key={i} label={fmt} variant="blue" />
                          ))
                        : <span className={FIELD_VALUE}>-</span>
                      }
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className={`${FIELD_LABEL} mb-1`}>Thông tin mô tả</div>
                    <div className={`${FIELD_VALUE} whitespace-pre-wrap`}>{selectedApprovalItem.description || 'Không có mô tả'}</div>
                  </div>

                  <div className="col-span-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="approvalPublishImmediately"
                      checked={selectedApprovalItem.publishImmediately || false}
                      disabled
                      className="w-4 h-4 accent-blue-600 rounded cursor-not-allowed"
                    />
                    <label htmlFor="approvalPublishImmediately" className="text-[13px] text-[#020817] select-none cursor-not-allowed">
                      Công bố dữ liệu ngay sau khi được phê duyệt
                    </label>
                  </div>
                </div>
              )}

              {/* ── Nội dung trình duyệt ── */}
              {!showApproveForm && !showRejectForm && (
                <div>
                  <div className={SECTION_TITLE.replace('mb-4', 'mb-2')}>
                    <FileText className="w-4 h-4 text-[#64748B]" />
                    Nội dung trình duyệt
                  </div>
                  <div className="px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] min-h-[46px] whitespace-pre-wrap">
                    {selectedApprovalItem.submitNote || 'Chưa cập nhật'}
                  </div>
                </div>
              )}

              {/* ── Ý kiến phê duyệt / Lý do từ chối ── */}
              {!showApproveForm && !showRejectForm && (selectedApprovalItem.status === 'approved' || selectedApprovalItem.status === 'rejected') && (
                <div className={selectedApprovalItem.status === 'approved' ? BANNER_SUCCESS : BANNER_DANGER}>
                  <div className="flex items-center gap-2 mb-2">
                    {selectedApprovalItem.status === 'approved'
                      ? <CheckCircle className="w-4 h-4 text-[#16A34A] shrink-0" />
                      : <XCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
                    }
                    <span className={`text-[13px] font-medium ${selectedApprovalItem.status === 'approved' ? 'text-[#15803D]' : 'text-[#B91C1C]'}`}>
                      {selectedApprovalItem.status === 'approved' ? 'Ý kiến phê duyệt' : 'Lý do từ chối'}
                    </span>
                  </div>
                  <p className="text-[13px] leading-relaxed text-[#020817]">
                    {selectedApprovalItem.approvalNote || '-'}
                  </p>
                </div>
              )}

              {showRejectForm ? (
                <div className="space-y-4 animate-fade-in text-[13px] text-[#020817]">
                  <div>
                    <label className={LABEL_CLS}>
                      Lý do từ chối phê duyệt <span className={REQUIRED_MARK}>*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Nhập lý do từ chối cụ thể để cán bộ chỉnh sửa..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className={`${TEXTAREA_CLS} resize-none`}
                    />
                  </div>

                  <div className={GROUP_CARD}>
                    <div className={`${FIELD_LABEL} mb-2`}>Sau khi từ chối phê duyệt:</div>
                    <ul className="space-y-1.5">
                      <li className="flex items-start gap-2 text-[13px] text-[#020817]">
                        <XCircle className="w-4 h-4 text-[#DC2626] mt-px shrink-0" />
                        Yêu cầu công bố sẽ chuyển sang trạng thái "Từ chối"
                      </li>
                      <li className="flex items-start gap-2 text-[13px] text-[#020817]">
                        <XCircle className="w-4 h-4 text-[#DC2626] mt-px shrink-0" />
                        Lý do từ chối sẽ được gửi phản hồi lại cho đơn vị đề xuất
                      </li>
                      <li className="flex items-start gap-2 text-[13px] text-[#020817]">
                        <XCircle className="w-4 h-4 text-[#DC2626] mt-px shrink-0" />
                        Đơn vị đề xuất có thể chỉnh sửa thông tin và gửi lại yêu cầu mới
                      </li>
                    </ul>
                  </div>
                </div>
              ) : showApproveForm ? (
                <div className="space-y-4 animate-fade-in text-[13px] text-[#020817]">
                  <div>
                    <label className={LABEL_CLS}>Ý kiến phê duyệt</label>
                    <textarea
                      value={approveOpinion}
                      onChange={(e) => setApproveOpinion(e.target.value)}
                      className={`${TEXTAREA_CLS} resize-none`}
                      rows={4}
                      placeholder="Nhập ý kiến phê duyệt (nếu có)... Ví dụ: Đồng ý phê duyệt và công bố dữ liệu mở theo đề xuất của đơn vị."
                    />
                  </div>

                  <div className={GROUP_CARD}>
                    <div className={`${FIELD_LABEL} mb-2`}>Sau khi phê duyệt:</div>
                    <ul className="space-y-1.5">
                      <li className="flex items-start gap-2 text-[13px] text-[#020817]">
                        <CheckCircle className="w-4 h-4 text-[#155DFC] mt-px shrink-0" />
                        Dữ liệu sẽ được công bố trên Cổng dữ liệu mở quốc gia
                      </li>
                      <li className="flex items-start gap-2 text-[13px] text-[#020817]">
                        <CheckCircle className="w-4 h-4 text-[#155DFC] mt-px shrink-0" />
                        Dữ liệu sẽ được đồng bộ và cập nhật định kỳ theo lịch đã thiết lập
                      </li>
                      <li className="flex items-start gap-2 text-[13px] text-[#020817]">
                        <CheckCircle className="w-4 h-4 text-[#155DFC] mt-px shrink-0" />
                        Các cơ quan, tổ chức và công dân có thể truy cập và tải xuống dữ liệu
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Tab con (compomennt.md 5.9) */}
                  <div className="flex gap-2 border-b border-[#E2E8F0]">
                    <button
                      type="button"
                      onClick={() => setApprovalPreviewTab('metadata')}
                      className={tabClass(approvalPreviewTab === 'metadata')}
                    >
                      Xem metadata
                    </button>
                    <button
                      type="button"
                      onClick={() => setApprovalPreviewTab('preview')}
                      className={tabClass(approvalPreviewTab === 'preview')}
                    >
                      Xem trước dữ liệu dòng đầu
                    </button>
                  </div>

                  {approvalPreviewTab === 'metadata' ? (
                    <div className={`${GROUP_CARD} space-y-4 max-h-60 overflow-y-auto custom-scrollbar text-[13px] text-[#020817]`}>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                          <div className={`${FIELD_LABEL} mb-1`}>Cơ sở dữ liệu đích</div>
                          <div className={FIELD_VALUE}>
                            {WAREHOUSE_DATABASES.find(db => db.id === getRecordMetadataConfig(selectedApprovalItem).dbId)?.name || getRecordMetadataConfig(selectedApprovalItem).dbId || '-'}
                          </div>
                        </div>
                        <div>
                          <div className={`${FIELD_LABEL} mb-1`}>Bảng chính</div>
                          <div className={FIELD_VALUE}>
                            {getRecordMetadataConfig(selectedApprovalItem).mainTable || '-'}
                          </div>
                        </div>
                      </div>

                      {getRecordMetadataConfig(selectedApprovalItem).joinTables.length > 0 && (
                        <div>
                          <div className={`${FIELD_LABEL} mb-1`}>Bảng liên kết (Join)</div>
                          <div className="space-y-1.5">
                            {getRecordMetadataConfig(selectedApprovalItem).joinTables.map((jt, idx) => (
                              <div key={idx} className="bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 flex items-center justify-between gap-4 text-[13px] text-[#020817]">
                                <span>{jt.tableId} ({jt.alias})</span>
                                <span>{jt.joinType} ON {jt.joinColA} = {jt.joinColB}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <div className={`${FIELD_LABEL} mb-2`}>Các trường thông tin đã chọn</div>
                        <div className={SUB_TABLE_WRAP}>
                          <table className={TABLE_CLS}>
                            <thead className="bg-[#F8FAFC]">
                              <tr className="h-[42px] border-b border-[#E0E0E0]">
                                <th className={SUB_TH}>Tên cột</th>
                                <th className={SUB_TH}>Bảng nguồn</th>
                                <th className={SUB_TH}>Kiểu dữ liệu</th>
                                <th className={SUB_TH}>API Field</th>
                                <th className={SUB_TH}>Bảo mật (Mask)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {getRecordMetadataConfig(selectedApprovalItem).dataFields.map((df, idx) => (
                                <tr key={idx} className={SUB_TR}>
                                  <td className={`${SUB_TD} max-w-[200px]`}><TruncatedText text={df.column || '-'} /></td>
                                  <td className={`${SUB_TD} max-w-[200px]`}><TruncatedText text={df.tableId || '-'} /></td>
                                  <td className={`${SUB_TD} whitespace-nowrap`}>{df.dataType || '-'}</td>
                                  <td className={`${SUB_TD} max-w-[200px]`}><TruncatedText text={df.apiField || '-'} /></td>
                                  <td className={SUB_TD}>
                                    <Badge label={df.masked ? 'Bảo mật' : 'Không'} variant={df.masked ? 'red' : 'green'} />
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
                      <div className={`${SUB_TABLE_WRAP} max-h-60 overflow-y-auto custom-scrollbar`}>
                        <table className={TABLE_CLS}>
                          <thead className="bg-[#F8FAFC] sticky top-0">
                            <tr className="h-[42px] border-b border-[#E0E0E0]">
                              {pHeaders.map((h, i) => (
                                <th key={i} className={SUB_TH}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {pRows.map((row, ri) => (
                              <tr key={ri} className={SUB_TR}>
                                {row.map((cell, ci) => (
                                  <td key={ci} className={`${SUB_TD} whitespace-nowrap`}>{cell}</td>
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

            <div className={MODAL_FOOTER}>
              {!showRejectForm && !showApproveForm ? (
                <>
                  <button
                    type="button"
                    onClick={() => setShowRejectForm(true)}
                    className={BTN_DESTRUCTIVE}
                  >
                    Từ chối duyệt
                  </button>
                  <button
                    type="button"
                    onClick={() => { setApproveOpinion(''); setShowApproveForm(true); }}
                    className={BTN_PRIMARY}
                  >
                    Phê duyệt & Công bố
                  </button>
                </>
              ) : showRejectForm ? (
                <>
                  <button
                    type="button"
                    onClick={() => setShowRejectForm(false)}
                    className={BTN_OUTLINE}
                  >
                    Quay lại
                  </button>
                  <button
                    type="button"
                    onClick={handleReject}
                    disabled={!rejectReason.trim()}
                    className={BTN_DESTRUCTIVE}
                  >
                    Xác nhận Từ chối
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setShowApproveForm(false)}
                    className={BTN_OUTLINE}
                  >
                    Quay lại
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApprove(selectedApprovalItem, approveOpinion)}
                    className={BTN_PRIMARY}
                  >
                    Xác nhận Phê duyệt
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}


      {/* SCHEDULE SETUP MODAL (compomennt.md 5.4) */}
      {showScheduleModal && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-2xl`}>
            <div className={MODAL_HEADER}>
              <h3 className={MODAL_TITLE}>{isEditingSchedule ? 'Sửa lịch công bố tự động' : 'Thêm lịch công bố tự động'}</h3>
              <button
                type="button"
                aria-label="Đóng"
                onClick={() => setShowScheduleModal(false)}
                className={BTN_GHOST_ICON}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const matchedDataset = APPROVED_CATEGORIES.find(c => c.code === scheduleFormData.datasetId);

                if (scheduleFormData.frequency === 'weekly' && (!scheduleFormData.weeklyDays || scheduleFormData.weeklyDays.length === 0)) {
                  toast.error('Vui lòng chọn ít nhất một thứ trong tuần!');
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
                  toast.success('Đã cập nhật lịch công bố tự động thành công!');
                } else {
                  if (!matchedDataset) {
                    toast.error('Vui lòng chọn tập dữ liệu mở!');
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
                    createdDate: formatDateVN(new Date()),
                    weeklyDays: scheduleFormData.weeklyDays,
                    monthlyDay: scheduleFormData.monthlyDay,
                    quarterlyDay: scheduleFormData.quarterlyDay,
                    quarterlyMonth: scheduleFormData.quarterlyMonth
                  };
                  setSchedules([newSchedule, ...schedules]);
                  toast.success('Đã thêm lịch công bố tự động thành công!');
                }
                setShowScheduleModal(false);
              }}
              className="flex flex-col flex-1 min-h-0"
            >
              <div className={`${MODAL_BODY} text-[13px]`}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={LABEL_CLS}>Tập dữ liệu áp dụng <span className={REQUIRED_MARK}>*</span></label>
                  <select
                    aria-label="Tập dữ liệu áp dụng"
                    disabled={isEditingSchedule}
                    value={scheduleFormData.datasetId}
                    onChange={(e) => {
                      const code = e.target.value;
                      const dbId = CATEGORY_TO_DB[code] || '';
                      const dbInfo = WAREHOUSE_DATABASES.find(db => db.id === dbId);
                      setScheduleFormData({ ...scheduleFormData, datasetId: code, dataSource: dbInfo?.name || '' });
                    }}
                    className={INPUT_CLS}
                  >
                    <option value="">-- Chọn tập dữ liệu mở --</option>
                    {APPROVED_CATEGORIES.map(c => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={LABEL_CLS}>Tần suất <span className={REQUIRED_MARK}>*</span></label>
                  <select
                    aria-label="Tần suất"
                    value={scheduleFormData.frequency}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, frequency: e.target.value as any })}
                    className={INPUT_CLS}
                  >
                    <option value="daily">Hàng ngày</option>
                    <option value="weekly">Hàng tuần</option>
                    <option value="monthly">Hàng tháng</option>
                    <option value="quarterly">Hàng quý</option>
                  </select>
                </div>

                <div>
                  <label className={LABEL_CLS}>Giờ chạy tự động <span className={REQUIRED_MARK}>*</span></label>
                  <input
                    type="time"
                    required
                    aria-label="Giờ chạy tự động"
                    value={scheduleFormData.startTime}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, startTime: e.target.value })}
                    className={INPUT_CLS}
                  />
                </div>

                {scheduleFormData.frequency === 'weekly' && (
                  <div className="col-span-2">
                    <label className={LABEL_CLS}>Các thứ trong tuần <span className={REQUIRED_MARK}>*</span></label>
                    <div className="flex flex-wrap gap-2">
                      {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'].map((day) => {
                        const isSelected = scheduleFormData.weeklyDays?.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            aria-pressed={!!isSelected}
                            onClick={() => {
                              const currentDays = scheduleFormData.weeklyDays || [];
                              const newWeeklyDays = isSelected
                                ? currentDays.filter(d => d !== day)
                                : [...currentDays, day];
                              setScheduleFormData({ ...scheduleFormData, weeklyDays: newWeeklyDays });
                            }}
                            className={isSelected ? CHIP_ACTIVE : BTN_OUTLINE}
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
                    <label className={LABEL_CLS}>Ngày trong tháng <span className={REQUIRED_MARK}>*</span></label>
                    <select
                      aria-label="Ngày trong tháng"
                      value={scheduleFormData.monthlyDay || 1}
                      onChange={(e) => setScheduleFormData({ ...scheduleFormData, monthlyDay: parseInt(e.target.value) })}
                      className={INPUT_CLS}
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
                      <label className={LABEL_CLS}>Tháng thứ mấy trong quý <span className={REQUIRED_MARK}>*</span></label>
                      <select
                        aria-label="Tháng thứ mấy trong quý"
                        value={scheduleFormData.quarterlyMonth || 1}
                        onChange={(e) => setScheduleFormData({ ...scheduleFormData, quarterlyMonth: parseInt(e.target.value) })}
                        className={INPUT_CLS}
                      >
                        <option value={1}>Tháng thứ nhất</option>
                        <option value={2}>Tháng thứ hai</option>
                        <option value={3}>Tháng thứ ba</option>
                      </select>
                    </div>
                    <div>
                      <label className={LABEL_CLS}>Ngày trong quý (1-30) <span className={REQUIRED_MARK}>*</span></label>
                      <select
                        aria-label="Ngày trong quý"
                        value={scheduleFormData.quarterlyDay || 1}
                        onChange={(e) => setScheduleFormData({ ...scheduleFormData, quarterlyDay: parseInt(e.target.value) })}
                        className={INPUT_CLS}
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
                  <label className={LABEL_CLS}>Ngày bắt đầu</label>
                  <input
                    type="date"
                    aria-label="Ngày bắt đầu"
                    value={scheduleFormData.startDate}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, startDate: e.target.value })}
                    className={INPUT_CLS}
                  />
                </div>

                <div className="col-span-2">
                  <label className={LABEL_CLS}>Nguồn cơ sở dữ liệu hệ thống <span className={REQUIRED_MARK}>*</span></label>
                  {scheduleFormData.datasetId ? (() => {
                    const dbId = CATEGORY_TO_DB[scheduleFormData.datasetId] || '';
                    const dbInfo = WAREHOUSE_DATABASES.find(db => db.id === dbId);
                    const metaFile = CONFIGURED_METADATA_FILES.find(f => f.categoryCode === scheduleFormData.datasetId);
                    const allTableNames = [metaFile?.mainTable, ...(metaFile?.joinTableNames || [])].filter(Boolean) as string[];
                    const allFields = buildAllDataFields(dbId, metaFile?.mainTable || '', metaFile?.joinTableNames || []);
                    return (
                      <div className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[13px] space-y-1.5">
                        <div className="flex gap-2">
                          <span className="text-[#64748B] shrink-0 w-28">Cơ sở dữ liệu:</span>
                          <span className="text-[#020817]">{dbInfo?.name || '—'}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-[#64748B] shrink-0 w-28">Bảng dữ liệu:</span>
                          <span className="text-[#020817]">{allTableNames.join(', ') || '—'}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-[#64748B] shrink-0 w-28">Các trường:</span>
                          <span className="text-[#020817] break-all">{allFields.map(f => f.column).join(', ') || '—'}</span>
                        </div>
                      </div>
                    );
                  })() : (
                    <div className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[13px] text-[#94A3B8]">
                      Chọn tập dữ liệu để xem thông tin nguồn
                    </div>
                  )}
                </div>

              </div>
              </div>

              <div className={MODAL_FOOTER}>
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className={BTN_OUTLINE}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className={BTN_PRIMARY}
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE SCHEDULE MODAL (compomennt.md 5.4) */}
      {showDeleteScheduleModal && selectedSchedule && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-md`}>
            <div className={MODAL_HEADER}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#FEF2F2] shrink-0">
                  <Trash2 className="w-5 h-5 text-[#DC2626]" />
                </div>
                <h3 className={MODAL_TITLE}>Xác nhận xóa lịch</h3>
              </div>
              <button
                type="button"
                aria-label="Đóng"
                onClick={() => setShowDeleteScheduleModal(false)}
                className={BTN_GHOST_ICON}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={MODAL_BODY}>
              <p className="text-[13px] text-[#020817]">
                Bạn có chắc chắn muốn xóa lịch công bố tự động của tập dữ liệu <strong className="font-medium">{selectedSchedule.datasetName}</strong>?
              </p>
            </div>
            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => setShowDeleteScheduleModal(false)}
                className={BTN_OUTLINE}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  setSchedules(schedules.filter(s => s.id !== selectedSchedule.id));
                  setShowDeleteScheduleModal(false);
                  toast.success('Đã xóa lịch công bố tự động thành công!');
                }}
                className={BTN_DESTRUCTIVE}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEND APPROVAL MODAL — giữ cơ chế Portal + z-index, khung theo compomennt.md 5.4 */}
      {showSendApprovalModal && sendApprovalItem && createPortal(
        <div className={MODAL_OVERLAY_PORTAL} style={{ zIndex: 2147483647 }}>
          <div className={`${MODAL_BOX} max-w-lg`}>
            {/* Header */}
            <div className={MODAL_HEADER}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#EAF3FF] shrink-0">
                  <Send className="w-5 h-5 text-[#155DFC]" />
                </div>
                <h3 className={MODAL_TITLE}>Gửi duyệt yêu cầu công bố</h3>
              </div>
              <button
                type="button"
                aria-label="Đóng"
                onClick={() => setShowSendApprovalModal(false)}
                className={BTN_GHOST_ICON}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className={`${MODAL_BODY} space-y-4`}>
              {/* Thông tin yêu cầu */}
              <div className={`${GROUP_CARD} space-y-1`}>
                <div className="text-[12px] text-[#64748B] font-medium">Yêu cầu công bố</div>
                <div className="text-[13px] font-medium text-[#020817]">{sendApprovalItem.fileName}</div>
                <div className="text-[13px] text-[#64748B]">{sendApprovalItem.category}</div>
                <div className="text-[12px] text-[#64748B]">Người tạo: {sendApprovalItem.creator} · {sendApprovalItem.createdDate}</div>
              </div>

              {/* Người phê duyệt */}
              <div>
                <label className={LABEL_CLS}>
                  Người phê duyệt <span className={REQUIRED_MARK}>*</span>
                </label>
                <select
                  value={sendApprovalApprover}
                  onChange={(e) => setSendApprovalApprover(e.target.value)}
                  className={INPUT_CLS}
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
                <label className={LABEL_CLS}>Nội dung trình duyệt</label>
                <textarea
                  value={sendApprovalNote}
                  onChange={(e) => setSendApprovalNote(e.target.value)}
                  className={`${TEXTAREA_CLS} resize-none`}
                  rows={4}
                  placeholder={`Nhập nội dung trình duyệt...\nVí dụ: Đề nghị Lãnh đạo xem xét phê duyệt yêu cầu công bố dữ liệu mở theo Nghị định 47/2020/NĐ-CP`}
                />
              </div>
            </div>

            {/* Footer */}
            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => setShowSendApprovalModal(false)}
                className={BTN_OUTLINE}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmSendApproval}
                disabled={!sendApprovalApprover}
                className={BTN_PRIMARY}
              >
                <Send className="w-4 h-4" />
                Gửi phê duyệt
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* SUCCESS POPUP — giữ cơ chế Portal + z-index, khung theo compomennt.md 5.4 */}
      {showSuccessPopup && createPortal(
        <div className={MODAL_OVERLAY_PORTAL} style={{ zIndex: 2147483647 }}>
          <div className={`${MODAL_BOX} max-w-sm`}>
            <div className={MODAL_HEADER}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#F0FDF4] shrink-0">
                  <CheckCircle className="w-5 h-5 text-[#16A34A]" />
                </div>
                <h3 className={MODAL_TITLE}>Thành công</h3>
              </div>
              <button
                type="button"
                aria-label="Đóng"
                onClick={() => setShowSuccessPopup(false)}
                className={BTN_GHOST_ICON}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={MODAL_BODY}>
              <p className="text-[13px] text-[#020817] leading-relaxed">{successPopupMessage}</p>
            </div>
            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => setShowSuccessPopup(false)}
                className={BTN_PRIMARY}
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {scheduleStatusConfirm && createPortal(
        <div className={MODAL_OVERLAY_PORTAL} style={{ zIndex: 2147483647 }}>
          <div className={`${MODAL_BOX} max-w-md`}>
            <div className={MODAL_HEADER}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#EAF3FF] shrink-0">
                  <AlertTriangle className="w-5 h-5 text-[#155DFC]" />
                </div>
                <h3 className={MODAL_TITLE}>
                  {scheduleStatusConfirm.action === 'pause' ? 'Tạm dừng công bố' : 'Tiếp tục công bố'}
                </h3>
              </div>
              <button type="button" aria-label="Đóng" onClick={() => setScheduleStatusConfirm(null)} className={BTN_GHOST_ICON}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={MODAL_BODY}>
              <p className="text-[13px] text-[#020817] leading-relaxed">
                {scheduleStatusConfirm.action === 'pause'
                  ? <>Bạn có chắc chắn muốn <span className="font-medium text-blue-600">tạm dừng</span> lịch công bố tự động cho tập dữ liệu <span className="font-medium">"{scheduleStatusConfirm.schedule.datasetName}"</span> không?</>
                  : <>Bạn có chắc chắn muốn <span className="font-medium text-blue-600">tiếp tục</span> lịch công bố tự động cho tập dữ liệu <span className="font-medium">"{scheduleStatusConfirm.schedule.datasetName}"</span> không?</>
                }
              </p>
            </div>
            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => setScheduleStatusConfirm(null)}
                className={BTN_OUTLINE}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  const newStatus = scheduleStatusConfirm.action === 'pause' ? 'inactive' : 'active';
                  setSchedules(schedules.map(s => s.id === scheduleStatusConfirm.schedule.id ? { ...s, status: newStatus } : s));
                  setScheduleStatusConfirm(null);
                }}
                className={BTN_PRIMARY}
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
