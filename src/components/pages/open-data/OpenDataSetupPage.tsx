import { useState, useEffect, type ReactNode } from 'react';
import { Plus, Search, Settings, Eye, Edit, Trash2, Save, X, CheckSquare, Filter, XCircle, Globe, Send, Check, Ban, Clock, FileText, AlertCircle, Shield, Database, CheckCircle2, Edit2, Info, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import { units } from '../admin/GroupManagementPage';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../../ui/dropdown-menu';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../ui/tooltip';
import {
  Badge, TruncatedText, RowIconAction, Pagination, tabClass,
  BTN_PRIMARY, BTN_OUTLINE, BTN_DESTRUCTIVE, BTN_GHOST_ICON, ROW_ICON_BTN, MENU_ITEM, TOOLTIP_CLS,
  INPUT_CLS, VIEW_FIELD_CLS, LABEL_CLS, REQUIRED_MARK, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE,
  SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, FILTER_GRID_CLS, FILTER_LABEL, normalizeSearch, formatDateVN
} from '../collection/collectionUi';

// --- Lớp giao diện dùng chung trong file (compomennt.md 5.3, 5.4) ---
const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';
const TR = 'group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors';
const TABLE_WRAP = 'bg-white rounded-lg border border-[#E2E8F0] overflow-hidden';
const TABLE_CLS = 'w-full border-collapse collection-table text-[13px]';
const STICKY_TH = 'sticky right-0 bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]';
const STICKY_TD = 'sticky right-0 bg-white group-hover:bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]';
const CHECKBOX_CLS = 'w-4 h-4 accent-blue-600 rounded cursor-pointer align-middle';
const EMPTY_TD = 'py-16 text-center text-[13px] text-[#64748B]';
const MODAL_OVERLAY = 'fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-200';
const MODAL_BOX = 'bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] flex flex-col overflow-hidden';
const MODAL_HEADER = 'px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4 shrink-0';
const MODAL_TITLE = 'text-[16px] font-semibold text-[#020817]';
const MODAL_BODY = 'px-6 py-4 overflow-y-auto custom-scrollbar flex-1';
const MODAL_FOOTER = 'px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3 shrink-0';
const TEXTAREA_CLS = 'w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-[#F0F0F0] disabled:text-[#94A3B8] disabled:cursor-not-allowed';
const BANNER_INFO = 'p-3 rounded-lg border bg-[#EAF3FF] border-[#BFDBFE] text-[13px] text-[#020817] flex items-start gap-2';
const BANNER_WARN = 'p-3 rounded-lg border bg-[#FFF7ED] border-[#FED7AA] text-[13px] text-[#020817] flex items-start gap-2';
const BANNER_DANGER = 'p-3 rounded-lg border bg-[#FEF2F2] border-[#FEE2E2] text-[13px] text-[#020817] flex items-start gap-2';
const BANNER_SUCCESS = 'p-3 rounded-lg border bg-[#F0FDF4] border-[#DCFCE7] text-[13px] text-[#020817] flex items-start gap-2';
const BANNER_NEUTRAL = 'p-3 rounded-lg border bg-[#F8FAFC] border-[#E2E8F0] text-[13px] text-[#020817] flex items-start gap-2';
const CHIP_ACTIVE = `${BTN_OUTLINE} !bg-[#EAF3FF] !border-[#BFDBFE] !text-[#155DFC]`;
const STAT_CARD = 'bg-white rounded-2xl border border-[#E2E8F0] p-4';
const READONLY_BOX = 'w-full h-10 px-3 flex items-center border border-[#E2E8F0] bg-[#F0F0F0] rounded-lg text-[13px] text-[#94A3B8] cursor-not-allowed';
// Thẻ nhóm (mục 5.6)
const GROUP_CARD = 'rounded-2xl border border-[#E2E8F0] p-4';

// Mục menu ⋯: bị khóa thì hiển thị lý do ngay trong mục (compomennt.md 5.3.2)
const MenuAction = ({ icon, label, reason, danger, onSelect }: { icon: ReactNode; label: string; reason: string | null; danger?: boolean; onSelect: () => void }) => (
  <DropdownMenuItem
    disabled={!!reason}
    onClick={reason ? undefined : onSelect}
    className={`${MENU_ITEM} items-start ${reason ? '' : danger ? 'text-[#DC2626] focus:text-[#DC2626]' : 'text-[#020817]'}`}
  >
    <span className={`mt-0.5 ${reason ? 'text-[#CBD5E1]' : danger ? 'text-[#DC2626]' : 'text-[#475569]'}`}>{icon}</span>
    <span className="flex flex-col">
      <span>{label}</span>
      {reason && <span className="text-[12px] text-[#64748B]">{reason}</span>}
    </span>
  </DropdownMenuItem>
);

interface DataField {
  id: string;
  name: string;
  dataType: string;
}

interface OpenDataCategory {
  id: string;
  code: string;
  name: string;
  description: string;
  dataField: string;
  updateFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  dataFormat: string[];
  status: 'active' | 'inactive' | 'pending' | 'approved' | 'rejected' | 'draft';
  createdDate: string;
  updatedDate: string;
  createdBy?: string;
  updatedBy?: string;
  approvalStatus?: 'draft' | 'pending' | 'approved' | 'rejected';
  customFields?: DataField[];
  version?: string;
  submitNote?: string;
  approvalNote?: string;
  rejectReason?: string;
  parentId?: string;
}

const parseVNDate = (str?: string): number | null => {
  if (!str) return null;
  const [d, m, y] = str.split('/').map(Number);
  if (!d || !m || !y) return null;
  return new Date(y, m - 1, d).getTime();
};

const incrementVersion = (v?: string): string => {
  if (!v) return '1.0';
  const parts = v.split('.');
  if (parts.length !== 2) return '1.0';
  const major = parseInt(parts[0], 10);
  if (isNaN(major)) return '1.0';
  return `${major + 1}.0`;
};

const mockCategories: OpenDataCategory[] = [
  {
    id: '1',
    code: 'ODC001',
    name: 'Danh sách tổ chức thực hiện trợ giúp pháp lý',
    description: 'Dữ liệu tổ chức thực hiện trợ giúp pháp lý bao gồm thông tin của các Trung tâm Trợ giúp pháp lý nhà nước, các tổ chức ký hợp đồng thực hiện trợ giúp pháp lý, các tổ chức đăng ký tham gia trợ giúp pháp lý...',
    dataField: 'Cục Phổ biến, giáo dục pháp luật và Trợ giúp pháp lý',
    updateFrequency: 'daily',
    dataFormat: ['JSON', 'CSV', 'XML'],
    status: 'approved',
    approvalStatus: 'approved',
    createdDate: '01/01/2019',
    updatedDate: '10/12/2024',
    createdBy: 'Nguyễn Văn A',
    updatedBy: 'Trần Thị Bình',
    version: '1.0',
    submitNote: 'Đề nghị Lãnh đạo xem xét phê duyệt danh mục dữ liệu mở "Danh sách tổ chức thực hiện trợ giúp pháp lý" để công bố công khai.',
    approvalNote: 'Đồng ý phê duyệt danh sách tổ chức trợ giúp pháp lý.'
  },
  {
    id: '2',
    code: 'ODC002',
    name: 'Danh sách người thực hiện trợ giúp pháp lý',
    description: 'Dữ liệu cung cấp danh sách người thực hiện trợ giúp pháp lý giúp người được trợ giúp pháp lý có thể tham khảo và thực hiện quyền thay đổi...',
    dataField: 'Cục Phổ biến, giáo dục pháp luật và Trợ giúp pháp lý',
    updateFrequency: 'daily',
    dataFormat: ['JSON', 'Excel'],
    status: 'approved',
    approvalStatus: 'approved',
    createdDate: '01/01/2019',
    updatedDate: '08/12/2024',
    createdBy: 'Nguyễn Văn A',
    updatedBy: 'Trần Thị Bình',
    version: '1.0',
    submitNote: 'Đề nghị Lãnh đạo xem xét phê duyệt danh mục dữ liệu mở "Danh sách người thực hiện trợ giúp pháp lý" theo quy định hiện hành.',
    approvalNote: 'Đồng ý phê duyệt danh sách người thực hiện trợ giúp pháp lý.'
  },
  {
    id: '3',
    code: 'ODC003',
    name: 'Danh sách Luật sư Việt Nam',
    description: 'Dữ liệu bao gồm thông tin về: Họ và tên, ngày sinh, giới tính, quốc tịch, số Chứng chỉ hành nghề luật sư, số Thẻ luật sư...',
    dataField: 'Cục Bổ trợ tư pháp',
    updateFrequency: 'daily',
    dataFormat: ['JSON', 'CSV'],
    status: 'approved',
    approvalStatus: 'approved',
    createdDate: '01/01/2027',
    updatedDate: '05/12/2024',
    createdBy: 'Lê Văn Cường',
    updatedBy: 'Lê Văn Cường',
    version: '1.0',
    submitNote: 'Đề nghị Lãnh đạo xem xét phê duyệt danh mục dữ liệu mở "Danh sách Luật sư Việt Nam" để công bố công khai.',
    approvalNote: 'Đồng ý phê duyệt danh sách Luật sư Việt Nam.'
  },
  {
    id: '4',
    code: 'ODC004',
    name: 'Danh sách Tổ chức hành nghề Luật sư Việt Nam',
    description: 'Dữ liệu bao gồm thông tin về: Tên tổ chức, số Giấy đăng ký hoạt động, địa chỉ trụ sở, người đại diện theo pháp luật, trạng thái hoạt động',
    dataField: 'Cục Bổ trợ tư pháp',
    updateFrequency: 'daily',
    dataFormat: ['JSON'],
    status: 'draft',
    approvalStatus: 'draft',
    createdDate: '01/01/2027',
    updatedDate: '02/06/2026',
    createdBy: 'Phạm Thị Dung',
    updatedBy: 'Phạm Thị Dung',
    version: '1.0'
  },
  {
    id: '5',
    code: 'ODC010',
    name: 'Danh sách Thừa phát lại',
    description: 'Dữ liệu bao gồm thông tin về: Họ và tên Thừa phát lại, số Thẻ Thừa phát lại, Văn phòng Thừa phát lại đang hành nghề, địa bàn hoạt động...',
    dataField: 'Cục Bổ trợ tư pháp',
    updateFrequency: 'monthly',
    dataFormat: ['JSON', 'CSV'],
    status: 'pending',
    approvalStatus: 'pending',
    createdDate: '15/03/2025',
    updatedDate: '20/12/2024',
    createdBy: 'Hoàng Văn Em',
    updatedBy: 'Hoàng Văn Em',
    version: '1.0',
    submitNote: 'Đề nghị Lãnh đạo xem xét phê duyệt danh mục dữ liệu mở "Danh sách Thừa phát lại" theo quy định hiện hành.'
  },
  {
    id: '6',
    code: 'ODC011',
    name: 'Danh sách Trọng tài viên thương mại',
    description: 'Dữ liệu bao gồm thông tin về: Họ và tên trọng tài viên, Trung tâm trọng tài thương mại, lĩnh vực chuyên môn, số năm kinh nghiệm...',
    dataField: 'Cục Bổ trợ tư pháp',
    updateFrequency: 'quarterly',
    dataFormat: ['JSON'],
    status: 'rejected',
    approvalStatus: 'rejected',
    createdDate: '10/02/2025',
    updatedDate: '18/12/2024',
    createdBy: 'Ngô Thị Phượng',
    updatedBy: 'Ngô Thị Phượng',
    version: '1.0',
    submitNote: 'Đề nghị Lãnh đạo xem xét phê duyệt danh mục dữ liệu mở "Danh sách Trọng tài viên thương mại".',
    rejectReason: 'Từ chối do dữ liệu thiếu trường thông tin bắt buộc: Số Quyết định bổ nhiệm trọng tài viên. Đề nghị bổ sung và trình duyệt lại.'
  },
];

// Mock data for Update Rules tab
const mockUpdateRules: OpenDataCategory[] = [
  {
    id: 'ur1',
    code: 'ODCM01',
    name: 'Quy tắc cập nhật danh mục A',
    description: 'Cập nhật tự động hàng tháng',
    dataField: 'Cục Công nghệ thông tin',
    updateFrequency: 'monthly',
    dataFormat: ['JSON'],
    status: 'approved',
    approvalStatus: 'approved',
    createdDate: '01/01/2024',
    updatedDate: '25/12/2024'
  },
  {
    id: 'ur2',
    code: 'ODCM02',
    name: 'Quy tắc cập nhật danh mục B',
    description: 'Cập nhật tự động hàng quý',
    dataField: 'Cục Bổ trợ tư pháp',
    updateFrequency: 'quarterly',
    dataFormat: ['JSON', 'CSV'],
    status: 'pending',
    approvalStatus: 'pending',
    createdDate: '15/01/2024',
    updatedDate: '24/12/2024'
  },
  {
    id: 'ur3',
    code: 'ODCM03',
    name: 'Quy tắc cập nhật danh mục C',
    description: 'Cập nhật tự động hàng năm',
    dataField: 'Cục Hành chính tư pháp',
    updateFrequency: 'yearly',
    dataFormat: ['JSON', 'XML'],
    status: 'rejected',
    approvalStatus: 'rejected',
    createdDate: '20/01/2024',
    updatedDate: '23/12/2024'
  },
  {
    id: 'ur4',
    code: 'ODCM04',
    name: 'Quy tắc cập nhật danh mục D',
    description: 'Cập nhật tự động hàng tháng',
    dataField: 'Cục Phổ biến, giáo dục pháp luật và Trợ giúp pháp lý',
    updateFrequency: 'monthly',
    dataFormat: ['JSON'],
    status: 'approved',
    approvalStatus: 'approved',
    createdDate: '05/02/2024',
    updatedDate: '22/12/2024'
  },
];

// Mock data for Approval tab
const mockApprovalList: OpenDataCategory[] = [
  {
    id: 'ap1',
    code: 'ODC005',
    name: 'Danh sách công chứng viên Việt Nam',
    description: 'Chờ phê duyệt - Người trình: Cục Bổ trợ tư pháp. Dữ liệu bao gồm thông tin về: Họ và tên công chứng viên, tổ chức công chứng viên đang hành nghề...',
    dataField: 'Cục Bổ trợ tư pháp',
    updateFrequency: 'daily',
    dataFormat: ['JSON', 'XML'],
    status: 'pending',
    approvalStatus: 'pending',
    createdDate: '26/12/2024',
    updatedDate: '26/12/2024',
    submitNote: 'Đề nghị Lãnh đạo xem xét phê duyệt danh mục dữ liệu mở "Danh sách công chứng viên Việt Nam" theo Nghị định 47/2020/NĐ-CP.'
  },
  {
    id: 'ap2',
    code: 'ODC006',
    name: 'Danh sách tổ chức hành nghề công chứng',
    description: 'Chờ phê duyệt - Người trình: Cục Bổ trợ tư pháp. Dữ liệu bao gồm thông tin về: Tỉnh/thành phố, tên tổ chức hành nghề công chứng, họ và tên trưởng đơn vị...',
    dataField: 'Cục Bổ trợ tư pháp',
    updateFrequency: 'daily',
    dataFormat: ['JSON', 'CSV'],
    status: 'pending',
    approvalStatus: 'pending',
    createdDate: '25/12/2024',
    updatedDate: '25/12/2024',
    submitNote: 'Đề nghị Lãnh đạo xem xét phê duyệt danh mục dữ liệu mở "Danh sách tổ chức hành nghề công chứng" để công bố công khai theo quy định.'
  },
  {
    id: 'ap3',
    code: 'ODC007',
    name: 'Danh sách đấu giá viên',
    description: 'Chờ phê duyệt - Người trình: Cục Bổ trợ tư pháp. Dữ liệu bao gồm thông tin về: Họ và tên đấu giá viên, ngày sinh, tên tổ chức đấu giá đang hành nghề...',
    dataField: 'Cục Bổ trợ tư pháp',
    updateFrequency: 'daily',
    dataFormat: ['JSON'],
    status: 'pending',
    approvalStatus: 'pending',
    createdDate: '24/12/2024',
    updatedDate: '24/12/2024',
    submitNote: 'Đề nghị Lãnh đạo xem xét phê duyệt danh mục dữ liệu mở "Danh sách đấu giá viên" theo đề xuất của đơn vị.'
  },
  {
    id: 'ap4',
    code: 'ODC008',
    name: 'Dữ liệu thống kê ngành Tư pháp',
    description: 'Đã phê duyệt - Người phê duyệt: Cục Kế hoạch – Tài chính. Dữ liệu bao gồm số liệu thống kê trong các lĩnh vực thực hiện chế độ báo cáo thống kê...',
    dataField: 'Cục Kế hoạch – Tài chính',
    updateFrequency: 'yearly',
    dataFormat: ['JSON', 'CSV'],
    status: 'approved',
    approvalStatus: 'approved',
    createdDate: '01/01/2015',
    updatedDate: '23/12/2024',
    submitNote: 'Đề nghị Lãnh đạo xem xét phê duyệt danh mục dữ liệu mở "Dữ liệu thống kê ngành Tư pháp" để công bố công khai.',
    approvalNote: 'Đồng ý phê duyệt dữ liệu thống kê ngành Tư pháp, số liệu đầy đủ.'
  },
  {
    id: 'ap5',
    code: 'ODC009',
    name: 'Tài sản thi hành án',
    description: 'Đã phê duyệt. Thông tin về hiện trạng, tình trạng pháp lý của tài sản thi hành án dân sự...',
    dataField: 'Cục Quản lý THADS',
    updateFrequency: 'monthly',
    dataFormat: ['JSON'],
    status: 'approved',
    approvalStatus: 'approved',
    createdDate: '20/12/2024',
    updatedDate: '22/12/2024',
    submitNote: 'Đề nghị Lãnh đạo xem xét phê duyệt danh mục dữ liệu mở "Tài sản thi hành án" để công bố công khai.',
    approvalNote: 'Đồng ý phê duyệt tài sản thi hành án.'
  }
];

// Mock data for History tab
interface HistoryRecord {
  id: string;
  version: string;
  code: string;
  name: string;
  changeType: 'create_category' | 'edit_category' | 'grant_permission' | 'add_metadata' | 'edit_metadata' | 'add_license';
  changeContent: string;
  user: string;
  timestamp: string;
  status: 'applied' | 'pending';
}

const mockHistory: HistoryRecord[] = [
  {
    id: 'h1',
    version: 'v1.5',
    code: 'ODC001',
    name: 'Danh mục văn bản pháp luật',
    changeType: 'edit_metadata',
    changeContent: 'Cập nhật tần suất từ "Hàng tháng" sang "Hàng ngày" cho metadata',
    user: 'Nguyễn Văn A',
    timestamp: '06/01/2025 14:30',
    status: 'applied'
  },
  {
    id: 'h2',
    version: 'v1.0',
    code: 'ODC002',
    name: 'Danh mục đăng ký kinh doanh',
    changeType: 'create_category',
    changeContent: 'Tạo mới danh mục "Danh mục đăng ký kinh doanh" trên hệ thống',
    user: 'Trần Thị B',
    timestamp: '06/01/2025 10:15',
    status: 'applied'
  },
  {
    id: 'h3',
    version: 'v1.3',
    code: 'ODC003',
    name: 'Danh mục công chứng',
    changeType: 'grant_permission',
    changeContent: 'Cấp quyền biên tập cho tài khoản tran_thi_c để quản lý metadata',
    user: 'Lê Văn C',
    timestamp: '05/01/2025 16:45',
    status: 'pending'
  },
  {
    id: 'h4',
    version: 'v1.8',
    code: 'ODC004',
    name: 'Danh mục TGPL',
    changeType: 'add_license',
    changeContent: 'Gán giấy phép ODC-BY cho tập dữ liệu',
    user: 'Phạm Thị D',
    timestamp: '05/01/2025 09:20',
    status: 'applied'
  },
  {
    id: 'h5',
    version: 'v2.0',
    code: 'ODC001',
    name: 'Danh mục văn bản pháp luật',
    changeType: 'edit_category',
    changeContent: 'Thay đổi lĩnh vực từ "Pháp luật chung" sang "Tư pháp"',
    user: 'Nguyễn Văn A',
    timestamp: '04/01/2025 11:00',
    status: 'applied'
  },
  {
    id: 'h6',
    version: 'v1.2',
    code: 'ODC005',
    name: 'Danh mục hộ tịch',
    changeType: 'add_metadata',
    changeContent: 'Thêm mới metadata cho danh mục với từ khóa "khai sinh, đăng ký kết hôn"',
    user: 'Trần Thị B',
    timestamp: '03/01/2025 15:30',
    status: 'applied'
  },
  {
    id: 'h7',
    version: 'v1.4',
    code: 'ODC006',
    name: 'Danh mục luật sư',
    changeType: 'edit_category',
    changeContent: 'Cập nhật lại mô tả chi tiết của danh mục',
    user: 'Lê Văn C',
    timestamp: '02/01/2025 08:45',
    status: 'pending'
  },
  {
    id: 'h8',
    version: 'v1.1',
    code: 'ODC007',
    name: 'Danh mục giám định tư pháp',
    changeType: 'grant_permission',
    changeContent: 'Thu hồi quyền biên tập danh mục của người dùng pham_thi_d',
    user: 'Phạm Thị D',
    timestamp: '01/01/2025 13:20',
    status: 'applied'
  },
  {
    id: 'h9',
    version: 'v1.6',
    code: 'ODC002',
    name: 'Danh mục đăng ký kinh doanh',
    changeType: 'edit_metadata',
    changeContent: 'Xóa các từ khóa không còn hợp lệ',
    user: 'Nguyễn Văn A',
    timestamp: '31/12/2024 10:00',
    status: 'applied'
  }
];

// Mock data for Category List tab
const mockCategoryList: OpenDataCategory[] = [
  {
    id: 'cat1',
    code: 'ODC001',
    name: 'Danh sách tổ chức thực hiện trợ giúp pháp lý',
    description: 'Dữ liệu tổ chức thực hiện trợ giúp pháp lý bao gồm thông tin của các Trung tâm Trợ giúp pháp lý nhà nước...',
    dataField: 'Cục Phổ biến, giáo dục pháp luật và Trợ giúp pháp lý',
    updateFrequency: 'daily',
    dataFormat: ['JSON', 'CSV'],
    status: 'approved',
    approvalStatus: 'approved',
    createdDate: '01/01/2019',
    updatedDate: '30/12/2024'
  },
  {
    id: 'cat2',
    code: 'ODC002',
    name: 'Danh sách người thực hiện trợ giúp pháp lý',
    description: 'Dữ liệu cung cấp danh sách người thực hiện trợ giúp pháp lý giúp người được trợ giúp pháp lý có thể tham khảo...',
    dataField: 'Cục Phổ biến, giáo dục pháp luật và Trợ giúp pháp lý',
    updateFrequency: 'daily',
    dataFormat: ['JSON', 'CSV'],
    status: 'approved',
    approvalStatus: 'approved',
    createdDate: '01/01/2019',
    updatedDate: '29/12/2024'
  },
  {
    id: 'cat3',
    code: 'ODC003',
    name: 'Danh sách Luật sư Việt Nam',
    description: 'Dữ liệu bao gồm thông tin về: Họ và tên, ngày sinh, giới tính, quốc tịch, số Chứng chỉ hành nghề luật sư...',
    dataField: 'Cục Bổ trợ tư pháp',
    updateFrequency: 'daily',
    dataFormat: ['JSON'],
    status: 'approved',
    approvalStatus: 'approved',
    createdDate: '01/01/2027',
    updatedDate: '28/12/2024'
  },
  {
    id: 'cat4',
    code: 'ODC004',
    name: 'Danh sách Tổ chức hành nghề Luật sư Việt Nam',
    description: 'Dữ liệu bao gồm thông tin về: Tên tổ chức, số Giấy đăng ký hoạt động, địa chỉ trụ sở, người đại diện theo pháp luật...',
    dataField: 'Cục Bổ trợ tư pháp',
    updateFrequency: 'daily',
    dataFormat: ['JSON', 'CSV'],
    status: 'approved',
    approvalStatus: 'approved',
    createdDate: '01/01/2027',
    updatedDate: '27/12/2024'
  },
  {
    id: 'cat5',
    code: 'ODC005',
    name: 'Danh sách công chứng viên Việt Nam',
    description: 'Dữ liệu bao gồm thông tin về: Họ và tên công chứng viên, tổ chức công chứng viên đang hành nghề...',
    dataField: 'Cục Bổ trợ tư pháp',
    updateFrequency: 'daily',
    dataFormat: ['JSON'],
    status: 'approved',
    approvalStatus: 'approved',
    createdDate: '01/01/2027',
    updatedDate: '26/12/2024'
  },
];

interface MetadataItem {
  id: string;
  categoryCodes: string[];
  fileName: string;
  description: string;
  keywords: string;
  licenseId: string;
  format: string;
  source: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  status: 'active' | 'inactive';
  requiredFields?: string[];
  dataSourceConfig?: DataSourceConfig;
  createdDate?: string;
  createdBy?: string;
}

interface JoinTable {
  id: string;
  alias: string;
  joinType: 'LEFT JOIN' | 'INNER JOIN' | 'RIGHT JOIN';
  table: string;
  leftCol: string;
  rightCol: string;
}

interface DataSourceConfig {
  database: string;
  primaryTable: string;
  useJoin: boolean;
  joinTables: JoinTable[];
}

interface LicenseItem {
  id: string;
  name: string;
  shortName: string;
  description: string;
  terms: string;
  referenceUrl: string;
  status: 'active' | 'inactive';
  createdDate?: string;
}

const sampleMetadata: MetadataItem[] = [
  {
    id: 'm1',
    categoryCodes: ['ODC001'],
    fileName: 'danh_sach_to_chuc_tgpl.xlsx',
    description: 'Metadata cho dữ liệu mở A',
    keywords: 'luật, mở, thống kê',
    licenseId: 'l1',
    format: 'File Excel, API',
    source: 'API nội bộ',
    frequency: 'monthly',
    status: 'active',
    requiredFields: ['MaHS', 'HoTen', 'NgaySinh'],
    createdDate: '10/01/2024',
    createdBy: 'Nguyễn Văn A'
  },
  {
    id: 'm2',
    categoryCodes: ['ODC002'],
    fileName: 'danh_sach_nguoi_tgpl.json',
    description: 'Metadata cho dữ liệu mở B',
    keywords: 'doanh nghiệp, đăng ký',
    licenseId: 'l2',
    format: 'API',
    source: 'Cổng dịch vụ công',
    frequency: 'quarterly',
    status: 'active',
    requiredFields: ['MaDoanhNghiep', 'TenDoanhNghiep', 'NgayCapGiepPhep'],
    createdDate: '22/02/2024',
    createdBy: 'Trần Thị Bình'
  }
];

const sampleLicenses: LicenseItem[] = [
  {
    id: 'l1',
    name: 'Giấy phép dữ liệu mở công cộng',
    shortName: 'GPDLMCC',
    description: 'Cho phép sử dụng và phân phối dữ liệu mở.',
    terms: 'Ghi nguồn là bắt buộc.',
    referenceUrl: 'https://example.com/license/cc0',
    status: 'active',
    createdDate: '01/01/2024'
  },
  {
    id: 'l2',
    name: 'Giấy phép ODC-BY',
    shortName: 'ODC-BY',
    description: 'Yêu cầu ghi nhận nguồn khi sử dụng.',
    terms: 'Phải ghi rõ nguồn dữ liệu.',
    referenceUrl: 'https://example.com/license/odc-by',
    status: 'active',
    createdDate: '15/03/2024'
  }
];

const MOCK_DATABASES = [
  { id: 'db1', name: 'CSDL Hộ tịch tỉnh Bắc Ninh', value: 'ho_tich_db' },
  { id: 'db2', name: 'CSDL Địa chính', value: 'dia_chinh_db' },
  { id: 'db3', name: 'CSDL Dân số', value: 'dan_so_db' },
  { id: 'db4', name: 'CSDL Tư pháp', value: 'tu_phap_db' },
];

const MOCK_TABLES: Record<string, string[]> = {
  ho_tich_db: ['ho_tich_ca_nhan', 'ho_tich_gia_dinh', 'dia_chi_thuong_tru', 'khai_sinh', 'khai_tu'],
  dia_chinh_db: ['ban_do_dat', 'chu_so_huu', 'bien_dong_dat', 'thua_dat'],
  dan_so_db: ['dan_so_chinh', 'ho_khau', 'tam_tru', 'nhan_khau'],
  tu_phap_db: ['to_chuc_tgpl', 'luat_su', 'chung_thu', 'van_ban_phap_luat'],
};

const TABLE_COLUMNS: Record<string, string[]> = {
  ho_tich_ca_nhan: ['ma_vinh_vien', 'ho_ten', 'ngay_sinh', 'gioi_tinh', 'dan_toc', 'quoc_tich'],
  ho_tich_gia_dinh: ['ma_ho_gia_dinh', 'chu_ho', 'dia_chi', 'so_thanh_vien'],
  dia_chi_thuong_tru: ['ma_dia_chi', 'quan_huyen', 'phuong_xa', 'so_nha'],
  khai_sinh: ['ma_khai_sinh', 'ten_tre', 'ngay_khai_sinh', 'ten_cha', 'ten_me'],
  khai_tu: ['ma_khai_tu', 'ho_ten', 'ngay_mat', 'ly_do'],
  ban_do_dat: ['ma_thua', 'dien_tich', 'loai_dat', 'toa_do'],
  chu_so_huu: ['ma_chu', 'ho_ten', 'cmnd', 'dia_chi'],
  bien_dong_dat: ['ma_bien_dong', 'ngay_bien_dong', 'loai_bien_dong', 'ma_thua'],
  thua_dat: ['ma_thua', 'so_to', 'so_thua', 'dien_tich'],
  dan_so_chinh: ['ma_nhan_khau', 'ho_ten', 'ngay_sinh', 'noi_sinh'],
  ho_khau: ['ma_ho_khau', 'chu_ho', 'dia_chi', 'so_nhan_khau'],
  tam_tru: ['ma_tam_tru', 'ho_ten', 'dia_chi_tam_tru', 'tu_ngay'],
  nhan_khau: ['ma_nhan_khau', 'ho_ten', 'quan_he_chu_ho', 'ngay_sinh'],
  to_chuc_tgpl: ['ma_to_chuc', 'ten_to_chuc', 'dia_chi', 'so_gp'],
  luat_su: ['ma_luat_su', 'ho_ten', 'chung_chi', 'noi_hanh_nghe'],
  chung_thu: ['ma_chung_thu', 'loai_chung_thu', 'ngay_cap', 'nguoi_yeu_cau'],
  van_ban_phap_luat: ['ma_van_ban', 'ten_van_ban', 'so_hieu', 'ngay_ban_hanh'],
};

const DEFAULT_DATA_SOURCE: DataSourceConfig = {
  database: '',
  primaryTable: '',
  useJoin: false,
  joinTables: [],
};

interface OpenDataSetupPageProps {
  onNavigate?: (page: string) => void;
}

export function OpenDataSetupPage({ onNavigate }: OpenDataSetupPageProps) {
  const [activeTab, setActiveTab] = useState<'management' | 'approval' | 'metadata' | 'license'>('management');
  const [categories, setCategories] = useState<OpenDataCategory[]>(mockCategories);
  const [updateRules, setUpdateRules] = useState<OpenDataCategory[]>(mockUpdateRules);
  const [approvalList, setApprovalList] = useState<OpenDataCategory[]>(mockApprovalList);
  const [historyList, setHistoryList] = useState<HistoryRecord[]>(mockHistory);
  const [categoryList, setCategoryList] = useState<OpenDataCategory[]>(mockCategoryList);
  const [searchTerm, setSearchTerm] = useState('');
  const [approvalFilterTab, setApprovalFilterTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [metadataEntries, setMetadataEntries] = useState<MetadataItem[]>(() => {
    const DATA_VERSION = 'v2';
    const saved = localStorage.getItem('open_data_metadata');
    const version = localStorage.getItem('open_data_metadata_version');
    if (saved && version === DATA_VERSION) return JSON.parse(saved);
    localStorage.removeItem('open_data_metadata');
    localStorage.setItem('open_data_metadata_version', DATA_VERSION);
    return sampleMetadata;
  });

  useEffect(() => {
    localStorage.setItem('open_data_metadata', JSON.stringify(metadataEntries));
  }, [metadataEntries]);

  const [licenseEntries, setLicenseEntries] = useState<LicenseItem[]>(sampleLicenses);
  const [selectedMetadata, setSelectedMetadata] = useState<MetadataItem | null>(null);
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [showViewMetadataModal, setShowViewMetadataModal] = useState(false);
  const [metadataToDelete, setMetadataToDelete] = useState<MetadataItem | null>(null);
  const [showDeleteMetadataModal, setShowDeleteMetadataModal] = useState(false);
  const [metadataFormData, setMetadataFormData] = useState<MetadataItem>({
    id: '0',
    categoryCodes: [],
    fileName: '',
    description: '',
    keywords: '',
    licenseId: sampleLicenses[0]?.id || 'l1',
    format: '',
    source: 'Tải tệp, API',
    frequency: 'monthly',
    status: 'active'
  });
  const [dataSourceConfig, setDataSourceConfig] = useState<DataSourceConfig>(DEFAULT_DATA_SOURCE);
  const [selectedLicense, setSelectedLicense] = useState<LicenseItem | null>(null);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [isLicenseViewOnly, setIsLicenseViewOnly] = useState(false);
  const [licenseFormData, setLicenseFormData] = useState<LicenseItem>({
    id: '0',
    name: '',
    shortName: '',
    description: '',
    terms: '',
    referenceUrl: '',
    status: 'active'
  });
  const [licenseError, setLicenseError] = useState('');
  const [searchMetadata, setSearchMetadata] = useState('');
  const [metadataFrequencyFilter, setMetadataFrequencyFilter] = useState('all');
  const [metadataStatusFilter, setMetadataStatusFilter] = useState('all');
  const [metadataLicenseFilter, setMetadataLicenseFilter] = useState('all');
  const [searchLicense, setSearchLicense] = useState('');
  const [licenseStatusFilter, setLicenseStatusFilter] = useState('all');
  const [licenseFromDate, setLicenseFromDate] = useState('');
  const [licenseToDate, setLicenseToDate] = useState('');

  // History filters
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [changeTypeFilter, setChangeTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [unitFilter, setUnitFilter] = useState('');
  const [frequencyFilter, setFrequencyFilter] = useState('');
  const [formatFilter, setFormatFilter] = useState('');
  const [managementFromDate, setManagementFromDate] = useState('');
  const [managementToDate, setManagementToDate] = useState('');

  // Điều kiện đã áp dụng: chỉ cập nhật khi bấm nút Tìm kiếm hoặc Enter (mục 5.19)
  const [applied, setApplied] = useState({
    search: '',
    status: '',
    unit: '',
    frequency: '',
    metaSearch: '',
    metaFreq: 'all',
    metaStatus: 'all',
    metaLicense: 'all',
    licenseSearch: '',
    licenseStatus: 'all',
    licenseFrom: '',
    licenseTo: '',
  });

  const getLicenseName = (licenseId: string) => {
    const license = licenseEntries.find(l => l.id === licenseId);
    return license ? license.name : 'Không xác định';
  };

  const handleViewMetadata = (item: MetadataItem) => {
    setSelectedMetadata(item);
    setShowViewMetadataModal(true);
  };

  const openMetadataModal = (item?: MetadataItem) => {
    if (item) {
      setSelectedMetadata(item);
      setMetadataFormData({
        ...item,
        fileName: item.fileName || '',
        requiredFields: item.requiredFields || []
      });
      setDataSourceConfig(item.dataSourceConfig || DEFAULT_DATA_SOURCE);
    } else {
      setSelectedMetadata(null);
      setMetadataFormData({
        id: '0',
        categoryCodes: [],
        fileName: '',
        description: '',
        keywords: '',
        licenseId: sampleLicenses[0]?.id || 'l1',
        format: '',
        source: 'Tải tệp, API',
        frequency: 'monthly',
        status: 'active',
        requiredFields: []
      });
      setDataSourceConfig(DEFAULT_DATA_SOURCE);
    }
    setShowMetadataModal(true);
  };

  const saveMetadata = () => {
    if (metadataFormData.categoryCodes.length === 0) {
      return;
    }
    const itemToSave: MetadataItem = { ...metadataFormData, dataSourceConfig };
    if (metadataFormData.id === '0') {
      setMetadataEntries([...metadataEntries, {
        ...itemToSave,
        id: String(Date.now()),
        createdDate: formatDateVN(new Date()),
        createdBy: 'Nguyễn Văn A'
      }]);
    } else {
      setMetadataEntries(metadataEntries.map(item => item.id === metadataFormData.id ? itemToSave : item));
    }
    setShowMetadataModal(false);
  };

  const openLicenseModal = (item?: LicenseItem) => {
    setLicenseError('');
    setIsLicenseViewOnly(false);
    if (item) {
      setSelectedLicense(item);
      setLicenseFormData(item);
    } else {
      setSelectedLicense(null);
      setLicenseFormData({
        id: '0',
        name: '',
        shortName: '',
        description: '',
        terms: '',
        referenceUrl: '',
        status: 'active'
      });
    }
    setShowLicenseModal(true);
  };

  const viewLicenseModal = (item: LicenseItem) => {
    setSelectedLicense(item);
    setLicenseFormData(item);
    setIsLicenseViewOnly(true);
    setShowLicenseModal(true);
  };

  const saveLicense = () => {
    if (!licenseFormData.name || !licenseFormData.shortName || !licenseFormData.description || !licenseFormData.terms || !licenseFormData.referenceUrl) {
      return;
    }
    // Check duplicate shortName when adding a new license
    if (licenseFormData.id === '0') {
      const isDuplicate = licenseEntries.some(
        l => l.shortName.toLowerCase() === licenseFormData.shortName.toLowerCase()
      );
      if (isDuplicate) {
        setLicenseError('Giấy phép đã tồn tại');
        return;
      }
    }
    if (licenseFormData.id === '0') {
      setLicenseEntries([...licenseEntries, { ...licenseFormData, id: String(Date.now()), createdDate: formatDateVN(new Date()) }]);
    } else {
      setLicenseEntries(licenseEntries.map(item => item.id === licenseFormData.id ? licenseFormData : item));
    }
    setShowLicenseModal(false);
  };

  const [showDeleteLicenseModal, setShowDeleteLicenseModal] = useState(false);
  const [selectedLicenseToDelete, setSelectedLicenseToDelete] = useState<LicenseItem | null>(null);

  const handleDeleteLicenseClick = (license: LicenseItem) => {
    setSelectedLicenseToDelete(license);
    setShowDeleteLicenseModal(true);
  };

  const confirmDeleteLicense = () => {
    if (selectedLicenseToDelete) {
      setLicenseEntries(licenseEntries.filter(l => l.id !== selectedLicenseToDelete.id));
      setShowDeleteLicenseModal(false);
      setSelectedLicenseToDelete(null);
    }
  };

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<OpenDataCategory | null>(null);
  const [approvalAction, setApprovalAction] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [rejectReason, setRejectReason] = useState('');
  const [approvalNote, setApprovalNote] = useState('');
  const [selectedApprover, setSelectedApprover] = useState('');
  const [selectedApprovalIds, setSelectedApprovalIds] = useState<string[]>([]);
  const [showBulkApprovalModal, setShowBulkApprovalModal] = useState(false);
  const [bulkApprovalAction, setBulkApprovalAction] = useState<'approved' | 'rejected'>('approved');
  const [bulkApprovalNote, setBulkApprovalNote] = useState('');
  const [isNewCategorySubmission, setIsNewCategorySubmission] = useState(false);
  const [isEditCategorySubmission, setIsEditCategorySubmission] = useState(false);

  // Mock list of approvers
  const approvers = [
    { id: '1', name: 'Nguyễn Văn A', position: 'Trưởng phòng Công nghệ thông tin' },
    { id: '2', name: 'Trần Thị B', position: 'Phó Giám đốc' },
    { id: '3', name: 'Lê Văn C', position: 'Giám đốc' },
    { id: '4', name: 'Phạm Thị D', position: 'Trưởng phòng Nghiệp vụ' }
  ];

  // Mock database tables and their fields
  const mockDatabaseTables = [
    { id: 'tb1', name: 'van_ban_phap_luat', displayName: 'Văn bản pháp luật' },
    { id: 'tb2', name: 'dang_ky_kinh_doanh', displayName: 'Đăng ký kinh doanh' },
    { id: 'tb3', name: 'cong_chung', displayName: 'Công chứng' },
    { id: 'tb4', name: 'tro_giup_phap_ly', displayName: 'Trợ giúp pháp lý' },
    { id: 'tb5', name: 'ho_tich', displayName: 'Hộ tịch' },
    { id: 'tb6', name: 'luat_su', displayName: 'Luật sư' },
    { id: 'tb7', name: 'giam_dinh_tu_phap', displayName: 'Giám định tư pháp' },
  ];

  const mockTableFields: { [key: string]: Array<{ id: string; name: string; type: string; description: string }> } = {
    'tb1': [
      { id: 'f1', name: 'ma_van_ban', type: 'VARCHAR(50)', description: 'Mã văn bản' },
      { id: 'f2', name: 'ten_van_ban', type: 'VARCHAR(500)', description: 'Tên văn bản' },
      { id: 'f3', name: 'loai_van_ban', type: 'VARCHAR(100)', description: 'Loại văn bản' },
      { id: 'f4', name: 'co_quan_ban_hanh', type: 'VARCHAR(255)', description: 'Cơ quan ban hành' },
      { id: 'f5', name: 'ngay_ban_hanh', type: 'DATE', description: 'Ngày ban hành' },
      { id: 'f6', name: 'ngay_hieu_luc', type: 'DATE', description: 'Ngày hiệu lực' },
      { id: 'f7', name: 'noi_dung', type: 'TEXT', description: 'Nội dung văn bản' },
      { id: 'f8', name: 'trang_thai', type: 'ENUM', description: 'Trạng thái' },
    ],
    'tb2': [
      { id: 'f1', name: 'ma_doanh_nghiep', type: 'VARCHAR(50)', description: 'Mã doanh nghiệp' },
      { id: 'f2', name: 'ten_doanh_nghiep', type: 'VARCHAR(255)', description: 'Tên doanh nghiệp' },
      { id: 'f3', name: 'dia_chi', type: 'VARCHAR(500)', description: 'Địa chỉ' },
      { id: 'f4', name: 'nguoi_dai_dien', type: 'VARCHAR(255)', description: 'Người đại diện' },
      { id: 'f5', name: 'ngay_dang_ky', type: 'DATE', description: 'Ngày đăng ký' },
      { id: 'f6', name: 'von_dieu_le', type: 'DECIMAL', description: 'Vốn điều lệ' },
      { id: 'f7', name: 'nganh_nghe', type: 'VARCHAR(255)', description: 'Ngành nghề kinh doanh' },
      { id: 'f8', name: 'trang_thai', type: 'ENUM', description: 'Trạng thái hoạt động' },
    ],
    'tb3': [
      { id: 'f1', name: 'ma_giao_dich', type: 'VARCHAR(50)', description: 'Mã giao dịch' },
      { id: 'f2', name: 'loai_hop_dong', type: 'VARCHAR(255)', description: 'Loại hợp đồng' },
      { id: 'f3', name: 'to_chuc_cong_chung', type: 'VARCHAR(255)', description: 'Tổ chức công chứng' },
      { id: 'f4', name: 'ngay_cong_chung', type: 'DATE', description: 'Ngày công chứng' },
      { id: 'f5', name: 'ben_a', type: 'VARCHAR(255)', description: 'Bên A' },
      { id: 'f6', name: 'ben_b', type: 'VARCHAR(255)', description: 'Bên B' },
      { id: 'f7', name: 'noi_dung', type: 'TEXT', description: 'Nội dung' },
    ],
    'tb4': [
      { id: 'f1', name: 'ma_ho_so', type: 'VARCHAR(50)', description: 'Mã hồ sơ' },
      { id: 'f2', name: 'ho_ten', type: 'VARCHAR(255)', description: 'Họ tên người được hỗ trợ' },
      { id: 'f3', name: 'cccd', type: 'VARCHAR(20)', description: 'Số CCCD' },
      { id: 'f4', name: 'loai_ho_tro', type: 'VARCHAR(255)', description: 'Loại hỗ trợ' },
      { id: 'f5', name: 'ngay_tiep_nhan', type: 'DATE', description: 'Ngày tiếp nhận' },
      { id: 'f6', name: 'trang_thai', type: 'ENUM', description: 'Trạng thái xử lý' },
    ],
    'tb5': [
      { id: 'f1', name: 'ma_khai_sinh', type: 'VARCHAR(50)', description: 'Mã khai sinh' },
      { id: 'f2', name: 'ho_ten', type: 'VARCHAR(255)', description: 'Họ tên' },
      { id: 'f3', name: 'ngay_sinh', type: 'DATE', description: 'Ngày sinh' },
      { id: 'f4', name: 'gioi_tinh', type: 'ENUM', description: 'Giới tính' },
      { id: 'f5', name: 'noi_sinh', type: 'VARCHAR(255)', description: 'Nơi sinh' },
      { id: 'f6', name: 'ho_ten_cha', type: 'VARCHAR(255)', description: 'Họ tên cha' },
      { id: 'f7', name: 'ho_ten_me', type: 'VARCHAR(255)', description: 'Họ tên mẹ' },
    ],
    'tb6': [
      { id: 'f1', name: 'ma_luat_su', type: 'VARCHAR(50)', description: 'Mã luật sư' },
      { id: 'f2', name: 'ho_ten', type: 'VARCHAR(255)', description: 'Họ tên luật sư' },
      { id: 'f3', name: 'so_the', type: 'VARCHAR(50)', description: 'Số thẻ luật sư' },
      { id: 'f4', name: 'van_phong', type: 'VARCHAR(255)', description: 'Văn phòng luật sư' },
      { id: 'f5', name: 'ngay_cap', type: 'DATE', description: 'Ngày cấp thẻ' },
      { id: 'f6', name: 'trang_thai', type: 'ENUM', description: 'Trạng thái hoạt động' },
    ],
    'tb7': [
      { id: 'f1', name: 'ma_giam_dinh', type: 'VARCHAR(50)', description: 'Mã giám định' },
      { id: 'f2', name: 'loai_giam_dinh', type: 'VARCHAR(255)', description: 'Loại giám định' },
      { id: 'f3', name: 'to_chuc_giam_dinh', type: 'VARCHAR(255)', description: 'Tổ chức giám định' },
      { id: 'f4', name: 'ngay_giam_dinh', type: 'DATE', description: 'Ngày giám định' },
      { id: 'f5', name: 'ket_qua', type: 'TEXT', description: 'Kết quả giám định' },
    ],
  };

  // Form state for add/edit
  const [formData, setFormData] = useState<{
    code: string;
    name: string;
    description: string;
    dataField: string;
    updateFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    dataFormat: string[];
    status: 'active' | 'inactive';
    selectedTable: string;
    selectedFields: string[];
    version: string;
    parentId: string;
  }>({
    code: '',
    name: '',
    description: '',
    dataField: '',
    updateFrequency: 'monthly',
    dataFormat: [],
    status: 'active',
    selectedTable: '',
    selectedFields: [],
    version: '1.0',
    parentId: ''
  });

  // Custom fields state
  const [customFields, setCustomFields] = useState<DataField[]>([]);

  // Attached files state
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 'management':
        return categories;
      case 'approval':
        return approvalList;
      default:
        return categories;
    }
  };

  const currentData = getCurrentData();

  const setCurrentData = (data: OpenDataCategory[]) => {
    switch (activeTab) {
      case 'management':
        setCategories(data);
        break;
      case 'approval':
        setApprovalList(data);
        break;
    }
  };

  // Filter logic
  const filteredMetadataEntries = metadataEntries.filter(m => {
    const q = normalizeSearch(applied.metaSearch);
    const matchSearch = normalizeSearch(m.description).includes(q) || normalizeSearch(m.keywords).includes(q);
    const matchFreq = applied.metaFreq === 'all' || m.frequency === applied.metaFreq;
    const matchStatus = applied.metaStatus === 'all' || m.status === applied.metaStatus;
    const matchLicense = applied.metaLicense === 'all' || m.licenseId === applied.metaLicense;
    return matchSearch && matchFreq && matchStatus && matchLicense;
  });

  const filteredLicenseEntries = licenseEntries.filter(l => {
    const q = normalizeSearch(applied.licenseSearch);
    const matchSearch = normalizeSearch(l.name).includes(q) || normalizeSearch(l.description).includes(q);
    const matchStatus = applied.licenseStatus === 'all' || l.status === applied.licenseStatus;
    const createdTime = parseVNDate(l.createdDate);
    const matchFromDate = !applied.licenseFrom || (createdTime !== null && createdTime >= new Date(applied.licenseFrom).getTime());
    const matchToDate = !applied.licenseTo || (createdTime !== null && createdTime <= new Date(applied.licenseTo).getTime());
    return matchSearch && matchStatus && matchFromDate && matchToDate;
  });

  const filteredCategories = currentData.filter(cat => {
    const q = normalizeSearch(applied.search);
    const matchSearch = normalizeSearch(cat.name).includes(q) || normalizeSearch(cat.code).includes(q);
    const matchStatus = !applied.status || cat.approvalStatus === applied.status;
    const matchUnit = !applied.unit || cat.dataField === applied.unit;
    const matchFrequency = !applied.frequency || cat.updateFrequency === applied.frequency;
    return matchSearch && matchStatus && matchUnit && matchFrequency;
  });

  // Filter for approval tab with status filter (nút lọc nhanh trạng thái áp dụng ngay)
  const filteredApprovalList = approvalList.filter(cat => {
    const q = normalizeSearch(applied.search);
    const matchSearch = normalizeSearch(cat.name).includes(q) || normalizeSearch(cat.code).includes(q);
    const matchStatus = !statusFilter || cat.approvalStatus === statusFilter;
    const matchUnit = !applied.unit || cat.dataField === applied.unit;
    const matchFrequency = !applied.frequency || cat.updateFrequency === applied.frequency;
    return matchSearch && matchStatus && matchUnit && matchFrequency;
  });

  // Get approval stats
  const approvalStats = {
    pending: approvalList.filter(c => c.approvalStatus === 'pending').length,
    approved: approvalList.filter(c => c.approvalStatus === 'approved').length,
    rejected: approvalList.filter(c => c.approvalStatus === 'rejected').length,
    total: approvalList.length
  };

  // Get category management stats
  const categoryStats = {
    total: categories.length,
    pending: categories.filter(c => c.approvalStatus === 'pending').length,
    approved: categories.filter(c => c.approvalStatus === 'approved').length,
    rejected: categories.filter(c => c.approvalStatus === 'rejected').length
  };

  // Filter for history
  const filteredHistory = historyList.filter(record => {
    const matchSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchChangeType = !changeTypeFilter || record.changeType === changeTypeFilter;
    const matchStatus = !statusFilter || record.status === statusFilter;

    // Date filtering
    let matchDate = true;
    if (fromDate || toDate) {
      const recordDate = new Date(record.timestamp.split(' ')[0].split('/').reverse().join('-'));
      if (fromDate) {
        const from = new Date(fromDate);
        matchDate = matchDate && recordDate >= from;
      }
      if (toDate) {
        const to = new Date(toDate);
        matchDate = matchDate && recordDate <= to;
      }
    }

    return matchSearch && matchChangeType && matchStatus && matchDate;
  });

  // Pagination State
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPageNum(1);
    setStatusFilter('');
    setUnitFilter('');
    setFrequencyFilter('');
    setApplied(prev => ({ ...prev, status: '', unit: '', frequency: '' }));
    setSelectedApprovalIds([]);
  }, [activeTab]);

  const runSearch = () => {
    setApplied({
      search: searchTerm,
      status: statusFilter,
      unit: unitFilter,
      frequency: frequencyFilter,
      metaSearch: searchMetadata,
      metaFreq: metadataFrequencyFilter,
      metaStatus: metadataStatusFilter,
      metaLicense: metadataLicenseFilter,
      licenseSearch: searchLicense,
      licenseStatus: licenseStatusFilter,
      licenseFrom: licenseFromDate,
      licenseTo: licenseToDate,
    });
    setCurrentPageNum(1);
  };

  const paginatedLicenses = filteredLicenseEntries.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);
  const paginatedCategories = filteredCategories.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);
  const paginatedMetadata = filteredMetadataEntries.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);
  const paginatedHistory = filteredHistory.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);
  const paginatedApproval = filteredApprovalList.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);

  const [showFilters, setShowFilters] = useState(false);



  const renderFilterRow = () => {
    let placeholder = "Tìm kiếm...";
    let searchValue = "";
    let setSearchValue: (val: string) => void = () => { };
    let showAddButton = false;
    let addLabel = "Thêm mới";
    let onAddClick = () => { };

    switch (activeTab) {
      case 'license':
        placeholder = "Tìm kiếm theo tên giấy phép, tên viết tắt...";
        searchValue = searchLicense;
        setSearchValue = setSearchLicense;
        showAddButton = true;
        addLabel = "Thêm giấy phép";
        onAddClick = () => openLicenseModal();
        break;
      case 'management':
        placeholder = "Tìm kiếm theo mã, tên danh mục...";
        searchValue = searchTerm;
        setSearchValue = setSearchTerm;
        showAddButton = true;
        addLabel = "Thêm danh mục mới";
        onAddClick = handleAdd;
        break;
      case 'approval':
        placeholder = "Tìm kiếm theo tên, mã danh mục...";
        searchValue = searchTerm;
        setSearchValue = setSearchTerm;
        break;
      case 'metadata':
        placeholder = "Tìm kiếm metadata...";
        searchValue = searchMetadata;
        setSearchValue = setSearchMetadata;
        showAddButton = true;
        addLabel = "Thêm Metadata";
        onAddClick = () => openMetadataModal();
        break;

    }

    if (activeTab === 'approval') {
      const statusPills = [
        { value: '', label: 'Tất cả' },
        { value: 'pending', label: 'Chờ phê duyệt' },
        { value: 'approved', label: 'Đã phê duyệt' },
        { value: 'rejected', label: 'Đã từ chối' },
      ];

      return (
        <div className="mb-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 flex items-center gap-1.5">
              <input
                type="text"
                aria-label={placeholder}
                placeholder={placeholder}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
                className={SEARCH_INPUT_CLS}
              />
              <button type="button" aria-label="Tìm kiếm" title="Tìm kiếm" onClick={runSearch} className={SEARCH_BTN_CLS}>
                <Search className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {statusPills.map(opt => (
                <button
                  key={opt.value || 'all'}
                  type="button"
                  aria-pressed={statusFilter === opt.value}
                  onClick={() => { setStatusFilter(opt.value); setCurrentPageNum(1); }}
                  className={statusFilter === opt.value ? CHIP_ACTIVE : BTN_OUTLINE}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 w-full flex items-center gap-1.5">
            <input
              type="text"
              aria-label={placeholder}
              placeholder={placeholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
              className={SEARCH_INPUT_CLS}
            />
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

          {showAddButton && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onAddClick}
                className={BTN_PRIMARY}
              >
                <Plus className="w-4 h-4" />
                {addLabel}
              </button>
            </div>
          )}
        </div>

        {/* Advanced Collapsible Filter Panel (compomennt.md 5.19) */}
        {showFilters && activeTab === 'license' && (
          <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
            <div>
              <label className={FILTER_LABEL}>Trạng thái giấy phép</label>
              <select
                value={licenseStatusFilter}
                onChange={(e) => setLicenseStatusFilter(e.target.value)}
                aria-label="Trạng thái giấy phép"
                className={INPUT_CLS}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Còn hiệu lực</option>
                <option value="inactive">Hết hiệu lực</option>
              </select>
            </div>
            <div>
              <label className={FILTER_LABEL}>Ngày tạo từ</label>
              <input
                type="date"
                value={licenseFromDate}
                onChange={(e) => setLicenseFromDate(e.target.value)}
                aria-label="Ngày tạo từ"
                title="Ngày tạo từ"
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className={FILTER_LABEL}>Đến ngày</label>
              <input
                type="date"
                value={licenseToDate}
                onChange={(e) => setLicenseToDate(e.target.value)}
                aria-label="Đến ngày"
                title="Đến ngày"
                className={INPUT_CLS}
              />
            </div>
          </div>
        )}

        {showFilters && activeTab === 'management' && (
          <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
            <div>
              <label className={FILTER_LABEL}>Trạng thái danh mục</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Trạng thái danh mục"
                className={INPUT_CLS}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="draft">Bản nháp</option>
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã phê duyệt</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>
            <div>
              <label className={FILTER_LABEL}>Đơn vị chủ trì</label>
              <select
                value={unitFilter}
                onChange={(e) => setUnitFilter(e.target.value)}
                aria-label="Đơn vị chủ trì"
                className={INPUT_CLS}
              >
                <option value="">Tất cả đơn vị</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.name}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {showFilters && activeTab === 'metadata' && (
          <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
            <div>
              <label className={FILTER_LABEL}>Tần suất</label>
              <select
                value={metadataFrequencyFilter}
                onChange={(e) => setMetadataFrequencyFilter(e.target.value)}
                aria-label="Tần suất"
                className={INPUT_CLS}
              >
                <option value="all">Tất cả tần suất</option>
                <option value="daily">Hàng ngày</option>
                <option value="weekly">Hàng tuần</option>
                <option value="monthly">Hàng tháng</option>
                <option value="quarterly">Hàng quý</option>
                <option value="yearly">Hàng năm</option>
              </select>
            </div>
            <div>
              <label className={FILTER_LABEL}>Giấy phép</label>
              <select
                value={metadataLicenseFilter}
                onChange={(e) => setMetadataLicenseFilter(e.target.value)}
                aria-label="Giấy phép"
                className={INPUT_CLS}
              >
                <option value="all">Tất cả giấy phép</option>
                {licenseEntries.map((license) => (
                  <option key={license.id} value={license.id}>{license.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={FILTER_LABEL}>Trạng thái</label>
              <select
                value={metadataStatusFilter}
                onChange={(e) => setMetadataStatusFilter(e.target.value)}
                aria-label="Trạng thái"
                className={INPUT_CLS}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Ngừng hoạt động</option>
              </select>
            </div>
          </div>
        )}
      </div>
    );

  };

  // Phân trang (compomennt.md 5.14) — giữ hành vi cũ: không hiển thị khi danh sách rỗng
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

  // Handlers
  const handleSync = (category: OpenDataCategory) => {
    toast.info(`Đồng bộ dữ liệu cho danh mục: ${category.name}`);
  };

  const handleComplete = (category: OpenDataCategory) => {
    setCurrentData(currentData.map(c =>
      c.id === category.id
        ? { ...c, status: 'approved', approvalStatus: 'approved' }
        : c
    ));
  };

  const handleDisable = (category: OpenDataCategory) => {
    setCurrentData(currentData.map(c =>
      c.id === category.id
        ? { ...c, status: 'rejected', approvalStatus: 'rejected' }
        : c
    ));
  };

  const handleAdd = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      dataField: '',
      updateFrequency: 'monthly',
      dataFormat: [],
      status: 'active',
      selectedTable: '',
      selectedFields: [],
      version: '1.0',
      parentId: ''
    });
    setCustomFields([]);
    setAttachedFiles([]);
    setShowAddModal(true);
  };

  const handleView = (category: OpenDataCategory) => {
    setSelectedCategory(category);
    setShowViewModal(true);
  };

  const handleEdit = (category: OpenDataCategory) => {
    setSelectedCategory(category);
    setFormData({
      code: category.code,
      name: category.name,
      description: category.description,
      dataField: category.dataField,
      updateFrequency: category.updateFrequency,
      dataFormat: category.dataFormat,
      status: category.status as 'active' | 'inactive',
      selectedTable: '',
      selectedFields: [],
      version: category.approvalStatus === 'draft'
        ? (category.version || '1.0')
        : incrementVersion(category.version || '1.0'),
      parentId: category.parentId || ''
    });
    setShowEditModal(true);
  };

  const handleDelete = (category: OpenDataCategory) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedCategory) {
      setCurrentData(currentData.filter(c => c.id !== selectedCategory.id));
      setShowDeleteModal(false);
      setSelectedCategory(null);
    }
  };

  const handleDeleteMetadataClick = (item: MetadataItem) => {
    if (item.status === 'active') return;
    setMetadataToDelete(item);
    setShowDeleteMetadataModal(true);
  };

  const confirmDeleteMetadata = () => {
    if (metadataToDelete) {
      setMetadataEntries(metadataEntries.filter(m => m.id !== metadataToDelete.id));
      setShowDeleteMetadataModal(false);
      setMetadataToDelete(null);
    }
  };

  const handleSaveAdd = () => {
    const newCategory: OpenDataCategory = {
      id: String(currentData.length + 1),
      ...formData,
      version: '1.0',
      status: 'draft',
      approvalStatus: 'draft',
      createdDate: formatDateVN(new Date()),
      updatedDate: formatDateVN(new Date()),
      createdBy: 'Nguyễn Văn A',
      updatedBy: 'Nguyễn Văn A'
    };
    setCurrentData([...currentData, newCategory]);
    setShowAddModal(false);
  };

  const handleSaveEdit = () => {
    if (selectedCategory) {
      setCurrentData(currentData.map(c =>
        c.id === selectedCategory.id
          ? {
            ...c,
            ...formData,
            status: 'draft',
            approvalStatus: 'draft',
            version: formData.version,
            updatedDate: formatDateVN(new Date()),
            updatedBy: 'Nguyễn Văn A'
          }
          : c
      ));
      setShowEditModal(false);
      setSelectedCategory(null);
    }
  };

  const handleOpenSubmitNewCategory = () => {
    if (!formData.code.trim() || !formData.name.trim() || !formData.dataField.trim()) {
      toast.error('Vui lòng nhập đầy đủ Mã danh mục, Tên danh mục và Đơn vị chủ trì cung cấp!');
      return;
    }
    setSelectedCategory({
      id: 'new',
      ...formData,
      version: '1.0',
      status: 'draft',
      approvalStatus: 'draft',
      createdDate: formatDateVN(new Date()),
      updatedDate: formatDateVN(new Date()),
      createdBy: 'Nguyễn Văn A',
      updatedBy: 'Nguyễn Văn A'
    });
    setIsNewCategorySubmission(true);
    setApprovalAction('pending');
    setApprovalNote('');
    setSelectedApprover('');
    setShowAddModal(false);
    setShowApprovalModal(true);
  };

  const handleOpenSubmitEditCategory = () => {
    if (!formData.code.trim() || !formData.name.trim() || !formData.dataField.trim()) {
      toast.error('Vui lòng nhập đầy đủ Mã danh mục, Tên danh mục và Đơn vị chủ trì cung cấp!');
      return;
    }
    setIsEditCategorySubmission(true);
    setApprovalAction('pending');
    setApprovalNote('');
    setSelectedApprover('');
    setShowEditModal(false);
    setShowApprovalModal(true);
  };

  const handleSubmitForApproval = (category: OpenDataCategory) => {
    setSelectedCategory(category);
    setApprovalAction('pending');
    setApprovalNote(category.submitNote || '');
    setSelectedApprover('');
    setShowViewModal(false);
    setShowApprovalModal(true);
  };

  const handleApprove = (category: OpenDataCategory) => {
    setSelectedCategory(category);
    setApprovalAction('approved');
    setShowApprovalModal(true);
  };

  const handleReject = (category: OpenDataCategory) => {
    setSelectedCategory(category);
    setApprovalAction('rejected');
    setRejectReason('');
    setShowApprovalModal(true);
  };

  const handleCategoryClick = (category: OpenDataCategory) => {
    if (onNavigate) {
      // Map category id to route
      const routeMap: Record<string, string> = {
        '1': 'open-data-category-a',
        '2': 'open-data-category-b',
        '3': 'open-data-category-c',
      };
      const route = routeMap[category.id] || 'open-data-category-a';
      onNavigate(route);
    }
  };

  const confirmApprovalAction = () => {
    if (isNewCategorySubmission && selectedCategory) {
      const newCategory: OpenDataCategory = {
        ...selectedCategory,
        id: String(categories.length + 1),
        status: 'pending',
        approvalStatus: 'pending',
        submitNote: approvalNote
      };
      setCategories(prev => [...prev, newCategory]);
      setApprovalList(prev => [...prev, newCategory]);

      setShowApprovalModal(false);
      setShowAddModal(false);
      setIsNewCategorySubmission(false);
      setSelectedCategory(null);
      setSelectedApprover('');
      setApprovalNote('');
      return;
    }

    if (isEditCategorySubmission && selectedCategory) {
      const updatedCategory: OpenDataCategory = {
        ...selectedCategory,
        ...formData,
        status: 'pending',
        approvalStatus: 'pending',
        version: formData.version,
        updatedDate: formatDateVN(new Date()),
        updatedBy: 'Nguyễn Văn A',
        submitNote: approvalNote
      };
      setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
      setApprovalList(prev => {
        const exists = prev.some(c => c.code === updatedCategory.code);
        return exists
          ? prev.map(c => c.code === updatedCategory.code ? { ...c, ...updatedCategory } : c)
          : [...prev, updatedCategory];
      });

      setShowApprovalModal(false);
      setShowEditModal(false);
      setIsEditCategorySubmission(false);
      setSelectedCategory(null);
      setSelectedApprover('');
      setApprovalNote('');
      return;
    }

    if (selectedCategory) {
      setCurrentData(currentData.map(c =>
        c.id === selectedCategory.id
          ? {
            ...c,
            status: approvalAction,
            approvalStatus: approvalAction,
            submitNote: approvalAction === 'pending' ? approvalNote : c.submitNote,
            approvalNote: approvalAction === 'approved' ? approvalNote : c.approvalNote,
            rejectReason: approvalAction === 'rejected' ? rejectReason : c.rejectReason
          }
          : c
      ));

      // Submitting for approval also pushes/updates the record in the Approval tab
      // so the reviewer sees the same "Nội dung trình duyệt" when phê duyệt/từ chối.
      if (approvalAction === 'pending') {
        const submittedCategory: OpenDataCategory = {
          ...selectedCategory,
          status: 'pending',
          approvalStatus: 'pending',
          submitNote: approvalNote
        };
        setApprovalList(prev => {
          const exists = prev.some(c => c.code === submittedCategory.code);
          return exists
            ? prev.map(c => c.code === submittedCategory.code ? { ...c, ...submittedCategory } : c)
            : [...prev, submittedCategory];
        });
      }

      setShowApprovalModal(false);
      setSelectedCategory(null);
      setRejectReason('');
      setApprovalNote('');
    }
  };

  // Phê duyệt nhanh / Từ chối nhanh (chọn nhiều bản ghi)
  const toggleSelectApprovalId = (id: string) => {
    setSelectedApprovalIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAllApprovalIds = () => {
    const pendingIds = filteredApprovalList.filter(c => c.approvalStatus === 'pending').map(c => c.id);
    setSelectedApprovalIds(prev => prev.length === pendingIds.length ? [] : pendingIds);
  };

  const openBulkApprovalModal = (action: 'approved' | 'rejected') => {
    setBulkApprovalAction(action);
    setBulkApprovalNote('');
    setShowBulkApprovalModal(true);
  };

  const confirmBulkApprovalAction = () => {
    const ids = selectedApprovalIds;
    setApprovalList(prev => prev.map(c =>
      ids.includes(c.id)
        ? {
          ...c,
          status: bulkApprovalAction,
          approvalStatus: bulkApprovalAction,
          approvalNote: bulkApprovalAction === 'approved' ? bulkApprovalNote : c.approvalNote,
          rejectReason: bulkApprovalAction === 'rejected' ? bulkApprovalNote : c.rejectReason
        }
        : c
    ));
    setSelectedApprovalIds([]);
    setShowBulkApprovalModal(false);
    setBulkApprovalNote('');
  };

  // Custom field handlers
  const handleAddCustomField = () => {
    const newField: DataField = {
      id: String(Date.now()),
      name: '',
      dataType: 'text'
    };
    setCustomFields([...customFields, newField]);
  };

  const handleRemoveCustomField = (id: string) => {
    setCustomFields(customFields.filter(f => f.id !== id));
  };

  const handleUpdateCustomField = (id: string, field: Partial<DataField>) => {
    setCustomFields(customFields.map(f =>
      f.id === id ? { ...f, ...field } : f
    ));
  };

  const getStatusBadge = (status: string) => {
    // Giữ nguyên ý nghĩa màu cũ, hiển thị bằng Badge chuẩn (mục 5.8)
    const variants = {
      active: 'green',
      inactive: 'slate',
      pending: 'purple',
      approved: 'green',
      rejected: 'orange',
      daily: 'emerald',
      weekly: 'indigo',
      monthly: 'purple',
      quarterly: 'blue',
      yearly: 'amber'
    };
    const labels = {
      active: 'Hoạt động',
      inactive: 'Ngừng hoạt động',
      pending: 'Hàng tháng',
      approved: 'Hoạt động',
      rejected: 'Ngừng hoạt động',
      daily: 'Hàng ngày',
      weekly: 'Hàng tuần',
      monthly: 'Hàng tháng',
      quarterly: 'Hàng quý',
      yearly: 'Hàng năm'
    };
    return (
      <Badge
        label={labels[status as keyof typeof labels] || status}
        variant={variants[status as keyof typeof variants]}
      />
    );
  };

  const getApprovalStatusBadge = (status?: string) => {
    if (!status) return null;
    const variants = {
      draft: 'slate',
      pending: 'purple',
      approved: 'green',
      rejected: 'orange'
    };
    const labels = {
      draft: 'Bản nháp',
      pending: 'Chờ duyệt',
      approved: 'Đã phê duyệt',
      rejected: 'Từ chối'
    };
    return (
      <Badge
        label={labels[status as keyof typeof labels] || status}
        variant={variants[status as keyof typeof variants]}
      />
    );
  };

  // Lý do không thể Gửi duyệt (giữ nguyên điều kiện cũ: chỉ bản nháp mới gửi duyệt được)
  const getSubmitBlockReason = (category: OpenDataCategory): string | null =>
    category.approvalStatus === 'approved' ? 'Đã phê duyệt'
      : category.approvalStatus === 'pending' ? 'Đang chờ duyệt'
        : category.approvalStatus === 'rejected' ? 'Đã bị từ chối'
          : null;

  const categoryStatCards = [
    { label: 'Tổng số danh mục', value: categoryStats.total, icon: FileText, bg: 'bg-blue-50', fg: 'text-blue-600' },
    { label: 'Chờ phê duyệt', value: categoryStats.pending, icon: Clock, bg: 'bg-orange-50', fg: 'text-orange-600' },
    { label: 'Đã phê duyệt', value: categoryStats.approved, icon: CheckSquare, bg: 'bg-green-50', fg: 'text-green-600' },
    { label: 'Từ chối', value: categoryStats.rejected, icon: XCircle, bg: 'bg-red-50', fg: 'text-red-600' },
  ];

  const approvalStatCards = [
    { label: 'Chờ phê duyệt', value: approvalStats.pending, icon: Clock, bg: 'bg-orange-50', fg: 'text-orange-600' },
    { label: 'Đã phê duyệt', value: approvalStats.approved, icon: CheckCircle2, bg: 'bg-green-50', fg: 'text-green-600' },
    { label: 'Đã từ chối', value: approvalStats.rejected, icon: XCircle, bg: 'bg-red-50', fg: 'text-red-600' },
    { label: 'Tổng yêu cầu', value: approvalStats.total, icon: Edit2, bg: 'bg-blue-50', fg: 'text-blue-600' },
  ];

  const renderStatCards = (cards: typeof categoryStatCards) => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map(card => (
        <div key={card.label} className={STAT_CARD}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${card.bg}`}>
              <card.icon className={`w-5 h-5 ${card.fg}`} />
            </div>
            <div>
              <div className="text-[16px] text-[#64748B]">{card.label}</div>
              <div className="text-[16px] font-semibold text-[#0F172A]">{card.value}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const frequencyLabel = (f: MetadataItem['frequency']) =>
    f === 'daily' ? 'Hàng ngày' : f === 'weekly' ? 'Hàng tuần' : f === 'monthly' ? 'Hàng tháng' : 'Hàng quý';

  return (
    <div className="space-y-4">
      {/* Tab bar (compomennt.md 5.9) */}
      <div className="flex items-center border-b border-[#E2E8F0]">
        {[
          { id: 'management' as const, label: 'Quản lý danh mục', icon: Settings },
          { id: 'license' as const, label: 'Giấy phép', icon: Shield },
          { id: 'metadata' as const, label: 'Metadata', icon: FileText },
          { id: 'approval' as const, label: 'Phê duyệt danh mục', icon: CheckSquare },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={tabClass(activeTab === tab.id)}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Tab Content — bỏ padding ngang vì MainLayout đã có sẵn p-6 */}
      <div>
        {activeTab === 'management' && (
          <div className="mb-4">
            {renderStatCards(categoryStatCards)}
          </div>
        )}

        {activeTab === 'approval' && (
          <div className="space-y-4 mb-4">
            {selectedApprovalIds.length > 0 && (
              <div className="flex items-center justify-end gap-3">
                <span className="text-[13px] text-[#64748B]">
                  Đã chọn: <span className="font-medium text-blue-600">{selectedApprovalIds.length}</span> yêu cầu
                </span>
                <button
                  type="button"
                  onClick={() => openBulkApprovalModal('approved')}
                  className={BTN_PRIMARY}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Phê duyệt nhanh
                </button>
                <button
                  type="button"
                  onClick={() => openBulkApprovalModal('rejected')}
                  className={BTN_DESTRUCTIVE}
                >
                  <XCircle className="w-4 h-4" />
                  Từ chối nhanh
                </button>
              </div>
            )}

            {renderStatCards(approvalStatCards)}
          </div>
        )}

        {renderFilterRow()}


        <div className={TABLE_WRAP}>
          <div className="overflow-x-auto">
            {/* collection-table: dùng quy tắc ghi đè có sẵn trong index.css để header in đậm */}
            <table className={TABLE_CLS}>
              <thead className="bg-[#F8FAFC]">
                <tr className="h-[42px]">
                  {activeTab === 'approval' && (
                    <th className={`${TH} text-center w-12`}>
                      <input
                        type="checkbox"
                        title="Chọn tất cả"
                        aria-label="Chọn tất cả"
                        checked={selectedApprovalIds.length > 0 && selectedApprovalIds.length === filteredApprovalList.filter(c => c.approvalStatus === 'pending').length}
                        onChange={toggleSelectAllApprovalIds}
                        className={CHECKBOX_CLS}
                      />
                    </th>
                  )}
                  <th className={`${TH} text-center w-12`}>STT</th>
                  {activeTab === 'metadata' ? (
                    <>
                      <th className={`${TH} text-left min-w-[220px]`}>Danh mục</th>
                      <th className={`${TH} text-left min-w-[160px]`}>Giấy phép</th>
                      <th className={`${TH} text-left w-px`}>Định dạng chia sẻ</th>
                      <th className={`${TH} text-left w-px`}>Tần suất</th>
                      <th className={`${TH} text-left w-px`}>Trạng thái</th>
                      <th className={`${TH} text-center w-px ${STICKY_TH}`}>Thao tác</th>
                    </>
                  ) : activeTab === 'license' ? (
                    <>
                      <th className={`${TH} text-left min-w-[200px]`}>Tên giấy phép</th>
                      <th className={`${TH} text-left w-px`}>Tên viết tắt</th>
                      <th className={`${TH} text-left min-w-[200px]`}>Mô tả</th>
                      <th className={`${TH} text-left min-w-[200px]`}>Điều kiện sử dụng</th>
                      <th className={`${TH} text-left w-px`}>Ngày tạo</th>
                      <th className={`${TH} text-left w-px`}>Trạng thái</th>
                      <th className={`${TH} text-center w-px ${STICKY_TH}`}>Thao tác</th>
                    </>
                  ) : activeTab === 'approval' ? (
                    <>
                      <th className={`${TH} text-left w-px`}>Mã danh mục</th>
                      <th className={`${TH} text-left min-w-[220px]`}>Tên danh mục</th>
                      <th className={`${TH} text-left min-w-[160px]`}>Đơn vị chủ trì cung cấp</th>
                      <th className={`${TH} text-left w-px`}>Trạng thái</th>
                      <th className={`${TH} text-center w-px ${STICKY_TH}`}>Thao tác</th>
                    </>
                  ) : (
                    <>
                      {/* Cột nhãn dùng w-px để co sát nội dung, phần rộng còn lại dồn cho cột Tên danh mục */}
                      <th className={`${TH} text-left w-px`}>Mã danh mục</th>
                      <th className={`${TH} text-left min-w-[220px]`}>Tên danh mục</th>
                      <th className={`${TH} text-left min-w-[140px]`}>Đơn vị chủ trì cung cấp</th>
                      <th className={`${TH} text-left w-px`}>Người tạo / Ngày tạo</th>
                      <th className={`${TH} text-left w-px`}>Trạng thái</th>
                      <th className={`${TH} text-center w-px ${STICKY_TH}`}>Thao tác</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {activeTab === 'metadata' ? (
                  paginatedMetadata.length > 0 ? (
                    paginatedMetadata.map((item, index) => (
                      <tr key={item.id} className={TR}>
                        <td className={`${TD} text-center whitespace-nowrap`}>{(currentPageNum - 1) * pageSize + index + 1}</td>
                        <td className={`${TD} text-left max-w-[360px]`}>
                          <TruncatedText
                            text={item.categoryCodes.map(code => {
                              const cat = categories.find(c => c.code === code) || categoryList.find(c => c.code === code);
                              return cat ? cat.name : 'Chưa xác định';
                            }).join(', ')}
                          />
                        </td>
                        <td className={`${TD} text-left max-w-[240px]`}>
                          <TruncatedText text={getLicenseName(item.licenseId)} />
                        </td>
                        <td className={`${TD} text-left whitespace-nowrap`}>{item.format}</td>
                        <td className={`${TD} text-left whitespace-nowrap`}>
                          {frequencyLabel(item.frequency)}
                        </td>
                        <td className={`${TD} text-left`}>
                          <Badge label={item.status === 'active' ? 'Hoạt động' : 'Ngừng'} variant={item.status === 'active' ? 'green' : 'slate'} />
                        </td>
                        <td className={`${TD} text-center ${STICKY_TD}`}>
                          {/* Cột thao tác (compomennt.md 5.3.2): 3 thao tác => hiện đủ */}
                          <div className="inline-flex items-center justify-center gap-1">
                            <RowIconAction label="Xem chi tiết" onClick={() => handleViewMetadata(item)}>
                              <Eye className="w-4 h-4" />
                            </RowIconAction>
                            <RowIconAction label="Chỉnh sửa" onClick={() => openMetadataModal(item)}>
                              <Edit className="w-4 h-4" />
                            </RowIconAction>
                            <RowIconAction
                              label="Xóa"
                              disabledReason={item.status === 'active' ? 'Không thể xóa bản ghi đang hoạt động' : undefined}
                              onClick={() => handleDeleteMetadataClick(item)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </RowIconAction>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={7} className={EMPTY_TD}>Không tìm thấy dữ liệu</td></tr>
                  )
                ) : activeTab === 'license' ? (
                  paginatedLicenses.length > 0 ? (
                    paginatedLicenses.map((item, index) => (
                      <tr key={item.id} className={TR}>
                        <td className={`${TD} text-center whitespace-nowrap`}>{(currentPageNum - 1) * pageSize + index + 1}</td>
                        <td className={`${TD} text-left max-w-[360px] leading-[18px]`}>
                          <TruncatedText text={item.name} />
                          <a href={item.referenceUrl} target="_blank" rel="noreferrer" className="text-[13px] text-blue-600 hover:underline inline-flex items-center gap-1 w-max cursor-pointer">
                            <Globe className="w-3.5 h-3.5" /> Nguồn tham chiếu
                          </a>
                        </td>
                        <td className={`${TD} text-left whitespace-nowrap`}>
                          {item.shortName && <Badge label={item.shortName} variant="slate" />}
                        </td>
                        <td className={`${TD} text-left max-w-[280px]`}>
                          <TruncatedText text={item.description} />
                        </td>
                        <td className={`${TD} text-left max-w-[280px]`}>
                          <TruncatedText text={item.terms} />
                        </td>
                        <td className={`${TD} text-left whitespace-nowrap`}>{item.createdDate || '--'}</td>
                        <td className={`${TD} text-left`}>
                          {item.status === 'active' ? (
                            <Badge label="Còn hiệu lực" variant="emerald" />
                          ) : (
                            <Badge label="Hết hiệu lực" variant="slate" />
                          )}
                        </td>
                        <td className={`${TD} text-center ${STICKY_TD}`}>
                          {/* Cột thao tác (compomennt.md 5.3.2): 3 thao tác => hiện đủ */}
                          <div className="inline-flex items-center justify-center gap-1">
                            <RowIconAction label="Xem chi tiết" onClick={() => viewLicenseModal(item)}>
                              <Eye className="w-4 h-4" />
                            </RowIconAction>
                            <RowIconAction label="Chỉnh sửa" onClick={() => openLicenseModal(item)}>
                              <Edit className="w-4 h-4" />
                            </RowIconAction>
                            <RowIconAction label="Xóa" onClick={() => handleDeleteLicenseClick(item)}>
                              <Trash2 className="w-4 h-4" />
                            </RowIconAction>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={8} className={EMPTY_TD}>Không tìm thấy dữ liệu</td></tr>
                  )
                ) : activeTab === 'approval' ? (
                  paginatedApproval.length > 0 ? (
                    paginatedApproval.map((category, index) => (
                      <tr key={category.id} className={TR}>
                        <td className={`${TD} text-center`}>
                          {category.approvalStatus === 'pending' && (
                            <input
                              type="checkbox"
                              title="Chọn bản ghi"
                              aria-label="Chọn bản ghi"
                              checked={selectedApprovalIds.includes(category.id)}
                              onChange={() => toggleSelectApprovalId(category.id)}
                              className={CHECKBOX_CLS}
                            />
                          )}
                        </td>
                        <td className={`${TD} text-center whitespace-nowrap`}>{(currentPageNum - 1) * pageSize + index + 1}</td>
                        <td className={`${TD} text-left whitespace-nowrap`}>
                          {category.code}
                        </td>
                        <td className={`${TD} text-left max-w-[360px]`}>
                          <TruncatedText text={category.name} />
                        </td>
                        <td className={`${TD} text-left max-w-[240px]`}>
                          <TruncatedText text={category.dataField} />
                        </td>
                        <td className={`${TD} text-left`}>
                          {getApprovalStatusBadge(category.approvalStatus)}
                        </td>
                        <td className={`${TD} text-center ${STICKY_TD}`}>
                          {/* Cột thao tác (compomennt.md 5.3.2): 3 thao tác => hiện đủ, mục đã xử lý bị khóa kèm lý do */}
                          <div className="inline-flex items-center justify-center gap-1">
                            <RowIconAction label="Xem chi tiết" onClick={() => handleView(category)}>
                              <Eye className="w-4 h-4" />
                            </RowIconAction>
                            <RowIconAction
                              label="Phê duyệt"
                              disabledReason={category.approvalStatus !== 'pending' ? 'Đã xử lý' : undefined}
                              onClick={() => category.approvalStatus === 'pending' && handleApprove(category)}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </RowIconAction>
                            <RowIconAction
                              label="Từ chối"
                              disabledReason={category.approvalStatus !== 'pending' ? 'Đã xử lý' : undefined}
                              onClick={() => category.approvalStatus === 'pending' && handleReject(category)}
                            >
                              <XCircle className="w-4 h-4" />
                            </RowIconAction>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={7} className={EMPTY_TD}>Không tìm thấy dữ liệu</td></tr>
                  )
                ) : (
                  paginatedCategories.length > 0 ? (
                    paginatedCategories.map((category, index) => (
                      <tr key={category.id} className={TR}>
                        <td className={`${TD} text-center whitespace-nowrap`}>{(currentPageNum - 1) * pageSize + index + 1}</td>
                        <td className={`${TD} text-left whitespace-nowrap`}>
                          {category.code}
                        </td>
                        <td className={`${TD} text-left max-w-[360px]`}>
                          <TruncatedText text={category.name} />
                        </td>
                        <td className={`${TD} text-left max-w-[240px]`}>
                          <TruncatedText text={category.dataField} />
                        </td>
                        <td className={`${TD} text-left whitespace-nowrap leading-[18px]`}>
                          <div>{category.createdBy || '--'}</div>
                          <div className="text-[#64748B]">{category.createdDate || '--'}</div>
                        </td>
                        <td className={`${TD} text-left`}>{getApprovalStatusBadge(category.approvalStatus)}</td>
                        <td className={`${TD} text-center ${STICKY_TD}`}>
                          {/* Cột thao tác (compomennt.md 5.3.2): 4 thao tác => Xem chi tiết + Chỉnh sửa + menu ⋯ (Gửi duyệt, Xóa) */}
                          <div className="inline-flex items-center justify-center gap-1">
                            <RowIconAction label="Xem chi tiết" onClick={() => handleView(category)}>
                              <Eye className="w-4 h-4" />
                            </RowIconAction>
                            <RowIconAction label="Chỉnh sửa" onClick={() => handleEdit(category)}>
                              <Edit className="w-4 h-4" />
                            </RowIconAction>
                            <DropdownMenu>
                              <Tooltip>
                                {/* Chỉ hiện tooltip khi hover: khi menu đóng focus quay về nút, không để tooltip tự bật đè lên modal */}
                                <TooltipTrigger asChild onFocus={(e: { preventDefault: () => void }) => e.preventDefault()}>
                                  <span className="inline-flex">
                                    <DropdownMenuTrigger asChild>
                                      <button type="button" aria-label="Thao tác khác" className={ROW_ICON_BTN}>
                                        <MoreVertical className="w-4 h-4" />
                                      </button>
                                    </DropdownMenuTrigger>
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent side="top" sideOffset={4} className={TOOLTIP_CLS}>Thao tác khác</TooltipContent>
                              </Tooltip>
                              <DropdownMenuContent align="end" className="w-56 rounded-lg border border-[#E2E8F0] bg-white shadow-lg p-1">
                                {activeTab === 'management' && (
                                  <MenuAction icon={<Send className="w-4 h-4" />} label="Gửi duyệt" reason={getSubmitBlockReason(category)}
                                    onSelect={() => handleSubmitForApproval(category)} />
                                )}
                                <MenuAction icon={<Trash2 className="w-4 h-4" />} label="Xóa" reason={null} danger
                                  onSelect={() => handleDelete(category)} />
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={7} className={EMPTY_TD}>Không tìm thấy dữ liệu</td></tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          {activeTab === 'license' && renderPagination(filteredLicenseEntries.length)}
          {activeTab === 'metadata' && renderPagination(filteredMetadataEntries.length)}
          {activeTab === 'management' && renderPagination(filteredCategories.length)}
          {activeTab === 'approval' && renderPagination(filteredApprovalList.length)}
        </div>
      </div>

      {/* View Metadata Detail Modal */}
      {showViewMetadataModal && selectedMetadata && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-2xl`}>
            <div className={MODAL_HEADER}>
              <h3 className={MODAL_TITLE}>Chi tiết Metadata</h3>
              <button
                type="button"
                onClick={() => setShowViewMetadataModal(false)}
                className={BTN_GHOST_ICON}
                aria-label="Đóng"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`${MODAL_BODY} space-y-4`}>
              {/* Basic info section using grid — mirrors the "Chi tiết danh mục" modal layout */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">

                <div>
                  <span className={`block ${FIELD_LABEL} mb-1`}>Trạng thái</span>
                  <div className="flex items-center">
                    <Badge
                      label={selectedMetadata.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
                      variant={selectedMetadata.status === 'active' ? 'green' : 'slate'}
                    />
                  </div>
                </div>

                <div>
                  <span className={`block ${FIELD_LABEL} mb-1`}>Giấy phép</span>
                  <div className={FIELD_VALUE}>
                    {getLicenseName(selectedMetadata.licenseId)}
                  </div>
                </div>

                <div className="col-span-2">
                  <span className={`block ${FIELD_LABEL} mb-1`}>Thuộc danh mục</span>
                  <div className={FIELD_VALUE}>
                    {selectedMetadata.categoryCodes.map(code => {
                      const cat = categories.find(c => c.code === code) || categoryList.find(c => c.code === code);
                      return cat ? `${cat.code} - ${cat.name}` : code;
                    }).join(', ')}
                  </div>
                </div>

                <div className="col-span-2">
                  <span className={`block ${FIELD_LABEL} mb-1`}>Mô tả</span>
                  <div className={`${FIELD_VALUE} whitespace-pre-wrap break-words`}>
                    {selectedMetadata.description || <span className="text-[#64748B]">Không có mô tả</span>}
                  </div>
                </div>

                <div className="col-span-2">
                  <span className={`block ${FIELD_LABEL} mb-2`}>Nguồn dữ liệu</span>
                  {selectedMetadata.dataSourceConfig?.database ? (
                    <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
                      <div className="bg-[#F8FAFC] px-4 py-3 flex flex-wrap gap-6 border-b border-[#E2E8F0]">
                        <div>
                          <span className={FIELD_LABEL}>CSDL đích</span>
                          <div className={`${FIELD_VALUE} mt-0.5`}>
                            {MOCK_DATABASES.find(d => d.value === selectedMetadata.dataSourceConfig!.database)?.name || selectedMetadata.dataSourceConfig.database}
                          </div>
                        </div>
                        <div>
                          <span className={FIELD_LABEL}>Bảng chính</span>
                          <div className={`${FIELD_VALUE} mt-0.5`}>
                            {selectedMetadata.dataSourceConfig.primaryTable || <span className="text-[#64748B]">Chưa chọn</span>}
                          </div>
                        </div>
                      </div>
                      {selectedMetadata.dataSourceConfig.useJoin && selectedMetadata.dataSourceConfig.joinTables.length > 0 ? (
                        <table className={`${TABLE_CLS} table-fixed`}>
                          <thead className="bg-[#F8FAFC]">
                            <tr className="h-[42px] border-b border-[#E0E0E0]">
                              <th className={`${TH} text-left w-[110px]`}>Loại JOIN</th>
                              <th className={`${TH} text-left w-1/4`}>Bảng phụ</th>
                              <th className={`${TH} text-left w-1/5`}>Alias</th>
                              <th className={`${TH} text-left`}>Điều kiện</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedMetadata.dataSourceConfig.joinTables.map(jt => (
                              <tr key={jt.id} className={`${TR} last:border-b-0`}>
                                <td className={TD}><TruncatedText text={jt.joinType} /></td>
                                <td className={TD}><TruncatedText text={jt.table} /></td>
                                <td className={TD}><TruncatedText text={jt.alias || '—'} /></td>
                                <td className={TD}>
                                  <TruncatedText text={`${selectedMetadata.dataSourceConfig!.primaryTable}.${jt.leftCol} = ${jt.table}.${jt.rightCol}`} />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="px-4 py-3 text-[13px] text-[#64748B]">Không có bảng JOIN</div>
                      )}
                    </div>
                  ) : (
                    <span className="text-[#64748B] text-[13px]">Chưa cấu hình</span>
                  )}
                </div>

                <div>
                  <span className={`block ${FIELD_LABEL} mb-1`}>Định dạng chia sẻ</span>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {selectedMetadata.format ? (
                      selectedMetadata.format.split(',').map((fmt, idx) => (
                        <Badge key={idx} label={fmt.trim()} variant="blue" />
                      ))
                    ) : (
                      <span className="text-[#64748B] text-[13px]">Chưa chọn</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className={`block ${FIELD_LABEL} mb-1`}>Tần suất cập nhật</span>
                  <div className="flex items-center">
                    <Badge label={frequencyLabel(selectedMetadata.frequency)} variant="purple" />
                  </div>
                </div>

                <div className="col-span-2">
                  <span className={`block ${FIELD_LABEL} mb-1`}>Từ khóa</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMetadata.keywords ? (
                      selectedMetadata.keywords.split(',').map((k, i) => k.trim() && (
                        <Badge key={i} label={k.trim()} variant="slate" />
                      ))
                    ) : (
                      <span className="text-[#64748B] text-[13px]">Không có từ khóa</span>
                    )}
                  </div>
                </div>

              </div>

              {/* Thông tin hệ thống - separated from the grid above to avoid layout overlap with the last field */}
              <div className={GROUP_CARD}>
                <h4 className={SECTION_TITLE}>Thông tin hệ thống</h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <span className={`block ${FIELD_LABEL} mb-1`}>Ngày tạo</span>
                    <div className={FIELD_VALUE}>
                      {selectedMetadata.createdDate || '-'}
                    </div>
                  </div>
                  <div>
                    <span className={`block ${FIELD_LABEL} mb-1`}>Người tạo</span>
                    <div className={FIELD_VALUE}>
                      {selectedMetadata.createdBy || '-'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => setShowViewMetadataModal(false)}
                className={BTN_OUTLINE}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Metadata Modal */}
      {showMetadataModal && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-2xl`}>
            <div className={MODAL_HEADER}>
              <h3 className={MODAL_TITLE}>
                {selectedMetadata ? 'Chỉnh sửa Metadata' : 'Thêm mới Metadata'}
              </h3>
              <button type="button" onClick={() => setShowMetadataModal(false)} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={`${MODAL_BODY} space-y-4`}>
              <div>
                <label className={LABEL_CLS}>Danh mục <span className={REQUIRED_MARK}>*</span></label>
                <select
                  value={metadataFormData.categoryCodes[0] || ''}
                  onChange={(e) => {
                    setMetadataFormData({ ...metadataFormData, categoryCodes: e.target.value ? [e.target.value] : [] });
                  }}
                  className={INPUT_CLS}
                  aria-label="Chọn danh mục"
                  title="Chọn danh mục"
                >
                  <option value="" disabled hidden>-- Chọn danh mục --</option>
                  {Object.entries(categories.filter(cat => cat.status === 'approved' || cat.approvalStatus === 'approved').reduce<Record<string, OpenDataCategory[]>>((groups, cat) => {
                    if (!groups[cat.dataField]) {
                      groups[cat.dataField] = [];
                    }
                    groups[cat.dataField].push(cat);
                    return groups;
                  }, {})).map(([system, items]) => (
                    <optgroup key={system} label={system}>
                      {items.map((cat) => (
                        <option key={cat.id} value={cat.code}>
                          {cat.code} - {cat.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <p className="text-[13px] text-[#64748B] mt-1">Chọn một danh mục cho Metadata này.</p>
              </div>
              <div>
                <label className={LABEL_CLS}>Giấy phép</label>
                <select
                  value={metadataFormData.licenseId}
                  onChange={(e) => setMetadataFormData({ ...metadataFormData, licenseId: e.target.value })}
                  className={INPUT_CLS}
                  aria-label="Chọn giấy phép"
                  title="Chọn giấy phép"
                >
                  {licenseEntries.map((license) => (
                    <option key={license.id} value={license.id}>
                      {license.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={LABEL_CLS}>Mô tả</label>
                <textarea
                  value={metadataFormData.description}
                  onChange={(e) => setMetadataFormData({ ...metadataFormData, description: e.target.value })}
                  rows={4}
                  className={TEXTAREA_CLS}
                  placeholder="Mô tả metadata cho danh mục"
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Từ khóa</label>
                <input
                  type="text"
                  value={metadataFormData.keywords}
                  onChange={(e) => setMetadataFormData({ ...metadataFormData, keywords: e.target.value })}
                  className={INPUT_CLS}
                  placeholder="Ví dụ: luật, dữ liệu mở"
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Định dạng chia sẻ</label>
                <div className="flex flex-wrap gap-4 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                  {['File excel', 'API'].map((fmt) => {
                    const isChecked = metadataFormData.format
                      ? metadataFormData.format.split(', ').map(f => f.trim().toLowerCase()).includes(fmt.toLowerCase())
                      : false;
                    return (
                      <label key={fmt} className="flex items-center gap-1.5 text-[13px] text-[#020817] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const currentFormats = metadataFormData.format
                              ? metadataFormData.format.split(', ').map(f => f.trim()).filter(Boolean)
                              : [];
                            let nextFormats;
                            if (e.target.checked) {
                              nextFormats = [...currentFormats.filter(f => f.toLowerCase() !== fmt.toLowerCase()), fmt];
                            } else {
                              nextFormats = currentFormats.filter(f => f.toLowerCase() !== fmt.toLowerCase());
                            }
                            setMetadataFormData({
                              ...metadataFormData,
                              format: nextFormats.join(', ')
                            });
                          }}
                          className={CHECKBOX_CLS}
                        />
                        {fmt}
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className={GROUP_CARD}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-600" />
                    <span className="text-[14px] font-medium text-[#020817]">Cấu hình Nguồn dữ liệu</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <span className="text-[13px] text-[#475569]">Sử dụng liên kết bảng (Join)</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={dataSourceConfig.useJoin}
                      aria-label="Sử dụng liên kết bảng (Join)"
                      onClick={() => setDataSourceConfig(c => ({ ...c, useJoin: !c.useJoin }))}
                      className={`relative inline-flex w-10 h-5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer ${dataSourceConfig.useJoin ? 'bg-blue-600' : 'bg-[#CBD5E1]'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${dataSourceConfig.useJoin ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </label>
                </div>

                <div className="mb-3">
                  <label className={LABEL_CLS}>Cơ sở dữ liệu đích</label>
                  <select
                    value={dataSourceConfig.database}
                    onChange={(e) => setDataSourceConfig(c => ({ ...c, database: e.target.value, primaryTable: '', joinTables: [] }))}
                    className={INPUT_CLS}
                    aria-label="Cơ sở dữ liệu đích"
                  >
                    <option value="" disabled hidden>-- Chọn cơ sở dữ liệu --</option>
                    {MOCK_DATABASES.map(db => (
                      <option key={db.id} value={db.value}>{db.name}</option>
                    ))}
                  </select>
                </div>

                {dataSourceConfig.database && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <label className={FIELD_LABEL}>Bảng dữ liệu chính</label>
                      <span className="text-[12px] text-blue-600 italic">Primary Table</span>
                    </div>
                    <select
                      value={dataSourceConfig.primaryTable}
                      onChange={(e) => setDataSourceConfig(c => ({ ...c, primaryTable: e.target.value }))}
                      className={INPUT_CLS}
                      aria-label="Bảng dữ liệu chính"
                    >
                      <option value="" disabled hidden>-- Chọn bảng chính --</option>
                      {(MOCK_TABLES[dataSourceConfig.database] || []).map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                )}

                {dataSourceConfig.useJoin && dataSourceConfig.database && (
                  <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[13px] font-medium text-[#020817]">
                        Bảng liên kết bổ sung ({dataSourceConfig.joinTables.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const idx = dataSourceConfig.joinTables.length;
                          setDataSourceConfig(c => ({
                            ...c,
                            joinTables: [...c.joinTables, {
                              id: String(Date.now()),
                              alias: `t${idx + 2}`,
                              joinType: 'LEFT JOIN',
                              table: '',
                              leftCol: '',
                              rightCol: ''
                            }]
                          }));
                        }}
                        className={BTN_OUTLINE}
                      >
                        <Plus className="w-4 h-4" />
                        Thêm bảng liên kết
                      </button>
                    </div>

                    {dataSourceConfig.joinTables.map((jt, i) => (
                      <div key={jt.id} className="border border-[#E2E8F0] rounded-lg p-3 mb-3 bg-[#F8FAFC]">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge label={`Bảng liên kết #${i + 1}`} variant="blue" />
                            <span className="text-[13px] text-[#64748B]">Alias: {jt.alias}</span>
                          </div>
                          <button
                            type="button"
                            aria-label={`Xóa bảng liên kết ${i + 1}`}
                            title="Xóa"
                            onClick={() => setDataSourceConfig(c => ({ ...c, joinTables: c.joinTables.filter(t => t.id !== jt.id) }))}
                            className={`${ROW_ICON_BTN} hover:!text-[#DC2626]`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className={LABEL_CLS}>Kiểu liên kết</label>
                            <select
                              value={jt.joinType}
                              onChange={(e) => setDataSourceConfig(c => ({
                                ...c,
                                joinTables: c.joinTables.map(t => t.id === jt.id ? { ...t, joinType: e.target.value as JoinTable['joinType'] } : t)
                              }))}
                              className={INPUT_CLS}
                              aria-label={`Kiểu liên kết bảng ${i + 1}`}
                            >
                              <option>LEFT JOIN</option>
                              <option>INNER JOIN</option>
                              <option>RIGHT JOIN</option>
                            </select>
                          </div>
                          <div>
                            <label className={LABEL_CLS}>Bảng dữ liệu bổ sung</label>
                            <select
                              value={jt.table}
                              onChange={(e) => setDataSourceConfig(c => ({
                                ...c,
                                joinTables: c.joinTables.map(t => t.id === jt.id ? { ...t, table: e.target.value, leftCol: '', rightCol: '' } : t)
                              }))}
                              className={INPUT_CLS}
                              aria-label={`Bảng dữ liệu bổ sung ${i + 1}`}
                            >
                              <option value="" disabled hidden>-- Chọn bảng bổ sung --</option>
                              {(MOCK_TABLES[dataSourceConfig.database] || [])
                                .filter(t => t !== dataSourceConfig.primaryTable)
                                .map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                        </div>

                        <div>
                          <p className={LABEL_CLS}>Điều kiện liên kết (Join Condition):</p>
                          <div className="flex items-center gap-2">
                            <select
                              value={jt.leftCol}
                              onChange={(e) => setDataSourceConfig(c => ({
                                ...c,
                                joinTables: c.joinTables.map(t => t.id === jt.id ? { ...t, leftCol: e.target.value } : t)
                              }))}
                              className={`${INPUT_CLS} flex-1`}
                              aria-label={`Cột bảng bổ sung ${i + 1}`}
                            >
                              <option value="">-- Cột bảng {jt.table || 'bổ sung'} --</option>
                              {(TABLE_COLUMNS[jt.table] || []).map(col => (
                                <option key={col} value={`${jt.alias}.${col}`}>{jt.alias}.{col}</option>
                              ))}
                            </select>
                            <span className="h-10 px-3 inline-flex items-center bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-medium text-[#475569] shrink-0">=</span>
                            <select
                              value={jt.rightCol}
                              onChange={(e) => setDataSourceConfig(c => ({
                                ...c,
                                joinTables: c.joinTables.map(t => t.id === jt.id ? { ...t, rightCol: e.target.value } : t)
                              }))}
                              className={`${INPUT_CLS} flex-1`}
                              aria-label={`Cột bảng chính tương ứng ${i + 1}`}
                            >
                              <option value="">-- Cột bảng chính --</option>
                              {(TABLE_COLUMNS[dataSourceConfig.primaryTable] || []).map(col => (
                                <option key={col} value={`${dataSourceConfig.primaryTable}.${col}`}>{dataSourceConfig.primaryTable}.{col}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLS}>Tần suất cập nhật</label>
                  <select
                    value={metadataFormData.frequency}
                    onChange={(e) => setMetadataFormData({ ...metadataFormData, frequency: e.target.value as MetadataItem['frequency'] })}
                    className={INPUT_CLS}
                    aria-label="Tần suất cập nhật"
                    title="Tần suất cập nhật"
                  >
                    <option value="daily">Hàng ngày</option>
                    <option value="weekly">Hàng tuần</option>
                    <option value="monthly">Hàng tháng</option>
                    <option value="quarterly">Hàng quý</option>
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLS}>Trạng thái</label>
                  <select
                    value={metadataFormData.status}
                    onChange={(e) => setMetadataFormData({ ...metadataFormData, status: e.target.value as MetadataItem['status'] })}
                    className={INPUT_CLS}
                    aria-label="Trạng thái"
                    title="Trạng thái"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Ngừng hoạt động</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => setShowMetadataModal(false)}
                className={BTN_OUTLINE}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={saveMetadata}
                className={BTN_PRIMARY}
              >
                Lưu Metadata
              </button>
            </div>
          </div>
        </div>
      )}

      {/* License Modal */}
      {showLicenseModal && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-2xl`}>
            <div className={MODAL_HEADER}>
              <h3 className={MODAL_TITLE}>
                {isLicenseViewOnly ? 'Xem chi tiết giấy phép' : selectedLicense ? 'Chỉnh sửa giấy phép' : 'Thêm mới giấy phép'}
              </h3>
              <button type="button" onClick={() => setShowLicenseModal(false)} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={`${MODAL_BODY} space-y-4`}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLS}>Tên giấy phép <span className={REQUIRED_MARK}>*</span></label>
                  <input
                    type="text"
                    value={licenseFormData.name}
                    onChange={(e) => setLicenseFormData({ ...licenseFormData, name: e.target.value })}
                    disabled={isLicenseViewOnly}
                    className={`${INPUT_CLS} ${isLicenseViewOnly ? VIEW_FIELD_CLS : ''}`}
                    placeholder="Nhập tên giấy phép"
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>Tên viết tắt <span className={REQUIRED_MARK}>*</span></label>
                  <input
                    type="text"
                    value={licenseFormData.shortName}
                    onChange={(e) => {
                      setLicenseFormData({ ...licenseFormData, shortName: e.target.value });
                      if (licenseError) setLicenseError('');
                    }}
                    disabled={isLicenseViewOnly || licenseFormData.id !== '0'}
                    className={`${INPUT_CLS} ${licenseError ? '!border-[#DC2626] focus:!ring-[#DC2626]' : ''} ${isLicenseViewOnly ? VIEW_FIELD_CLS : ''}`}
                    placeholder="Nhập tên viết tắt"
                  />
                  {licenseError && (
                    <p className="text-[#DC2626] text-[12px] mt-1">{licenseError}</p>
                  )}
                </div>
              </div>
              <div>
                <label className={LABEL_CLS}>Mô tả <span className={REQUIRED_MARK}>*</span></label>
                <textarea
                  value={licenseFormData.description}
                  onChange={(e) => setLicenseFormData({ ...licenseFormData, description: e.target.value })}
                  disabled={isLicenseViewOnly}
                  rows={4}
                  className={`${TEXTAREA_CLS} ${isLicenseViewOnly ? VIEW_FIELD_CLS : ''}`}
                  placeholder="Mô tả ngắn về giấy phép"
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Điều kiện sử dụng <span className={REQUIRED_MARK}>*</span></label>
                <textarea
                  value={licenseFormData.terms}
                  onChange={(e) => setLicenseFormData({ ...licenseFormData, terms: e.target.value })}
                  disabled={isLicenseViewOnly}
                  rows={4}
                  className={`${TEXTAREA_CLS} ${isLicenseViewOnly ? VIEW_FIELD_CLS : ''}`}
                  placeholder="Mô tả điều kiện sử dụng"
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Liên kết tham chiếu <span className={REQUIRED_MARK}>*</span></label>
                <input
                  type="text"
                  value={licenseFormData.referenceUrl}
                  onChange={(e) => setLicenseFormData({ ...licenseFormData, referenceUrl: e.target.value })}
                  disabled={isLicenseViewOnly}
                  className={`${INPUT_CLS} ${isLicenseViewOnly ? VIEW_FIELD_CLS : ''}`}
                  placeholder="https://example.com/license/cc0"
                />
              </div>
              <div className={licenseFormData.id !== '0' ? 'grid grid-cols-2 gap-4' : ''}>
                <div>
                  <label className={LABEL_CLS}>Trạng thái</label>
                  <select
                    value={licenseFormData.status}
                    onChange={(e) => setLicenseFormData({ ...licenseFormData, status: e.target.value as LicenseItem['status'] })}
                    disabled={isLicenseViewOnly}
                    className={`${INPUT_CLS} ${isLicenseViewOnly ? VIEW_FIELD_CLS : ''}`}
                    aria-label="Trạng thái"
                    title="Trạng thái"
                  >
                    <option value="active">Còn hiệu lực</option>
                    <option value="inactive">Hết hiệu lực</option>
                  </select>
                </div>
                {licenseFormData.id !== '0' && (
                  <div>
                    <label className={LABEL_CLS}>Ngày tạo</label>
                    <input
                      type="text"
                      value={licenseFormData.createdDate || '--'}
                      readOnly
                      disabled
                      aria-label="Ngày tạo"
                      className={`${INPUT_CLS} ${isLicenseViewOnly ? VIEW_FIELD_CLS : ''}`}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className={MODAL_FOOTER}>
              {isLicenseViewOnly ? (
                <>
                  <button
                    type="button"
                    onClick={() => setShowLicenseModal(false)}
                    className={BTN_OUTLINE}
                  >
                    Đóng
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLicenseViewOnly(false)}
                    className={BTN_PRIMARY}
                  >
                    Chỉnh sửa
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setShowLicenseModal(false)}
                    className={BTN_OUTLINE}
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={saveLicense}
                    className={BTN_PRIMARY}
                  >
                    Lưu giấy phép
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-2xl`}>
            <div className={MODAL_HEADER}>
              <h3 className={MODAL_TITLE}>
                {activeTab === 'management' ? 'Thêm danh mục mới' : 'Thêm quy tắc cập nhật mới'}
              </h3>
              <button type="button" onClick={() => setShowAddModal(false)} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={`${MODAL_BODY} space-y-4`}>
              {/*
                DATABASE MAPPING - Bảng: open_data_catalog
                ================================================
                - id: UUID/INT (Primary Key)
                - code: VARCHAR(50) → Mã danh mục
                - name: VARCHAR(255) → Tên danh mục
                - description: TEXT → Mô tả
                - data_field: VARCHAR(100) → Lĩnh vực
                - update_frequency: ENUM(monthly/quarterly/yearly) → Tần suất cập nhật
                - source_table_id: INT → Chọn bảng dữ liệu nguồn (Foreign Key)
                - selected_fields: JSON → Các trường dữ liệu được chọn ['f1','f2','f3']
                - attached_files: JSON/TEXT → File đính kèm
                - status: ENUM(draft/pending/published/updated/deprecated) → Trạng thái
                - publisher: VARCHAR(255) → Đơn vị công bố (default: "Bộ Tư pháp")
                - publish_date: DATE → Ngày công bố (auto khi approved)
                - last_update: TIMESTAMP → Lần cập nhật cuối
                - download_count: INT → Số lượt tải xuống (default: 0)
                - formats: JSON → Định dạng hỗ trợ ['JSON','XML','CSV','Excel']
                - created_by: UUID/INT → User ID
                - created_at: TIMESTAMP → Auto timestamp
                - updated_by: UUID/INT → User ID
                - updated_at: TIMESTAMP → Auto timestamp
              */}

              {activeTab === 'management' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL_CLS}>Phiên bản</label>
                    <input
                      type="text"
                      value={formData.version}
                      readOnly
                      disabled
                      aria-label="Phiên bản"
                      className={INPUT_CLS}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Trạng thái</label>
                    <div className={READONLY_BOX}>
                      {getApprovalStatusBadge('draft')}
                    </div>
                  </div>
                </div>
              )}
              <div>
                <label className={LABEL_CLS}>Mã danh mục <span className={REQUIRED_MARK}>*</span></label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className={INPUT_CLS}
                  placeholder={activeTab === 'management' ? 'Nhập mã danh mục (vd: ODC001)' : 'Nhập mã quy tắc (vd: ODCM01)'}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Tên danh mục <span className={REQUIRED_MARK}>*</span></label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={INPUT_CLS}
                  placeholder="Nhập tên danh mục"
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={TEXTAREA_CLS}
                  rows={3}
                  placeholder="Nhập mô tả"
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Đơn vị chủ trì cung cấp <span className={REQUIRED_MARK}>*</span></label>
                <select
                  value={formData.dataField}
                  onChange={(e) => setFormData({ ...formData, dataField: e.target.value })}
                  className={INPUT_CLS}
                  aria-label="Đơn vị chủ trì cung cấp"
                  title="Đơn vị chủ trì cung cấp"
                >
                  <option value="" disabled hidden>-- Chọn đơn vị --</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.name}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>



            </div>
            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className={BTN_OUTLINE}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveAdd}
                className={BTN_OUTLINE}
              >
                <Save className="w-4 h-4" />
                Lưu
              </button>
              {activeTab === 'management' && (
                <button
                  type="button"
                  onClick={handleOpenSubmitNewCategory}
                  className={BTN_PRIMARY}
                >
                  <Send className="w-4 h-4" />
                  Gửi phê duyệt
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedCategory && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-2xl`}>
            <div className={MODAL_HEADER}>
              <h3 className={MODAL_TITLE}>Chi tiết danh mục</h3>
              <button type="button" onClick={() => setShowViewModal(false)} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={`${MODAL_BODY} space-y-4`}>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <span className={`block ${FIELD_LABEL} mb-1`}>Mã danh mục</span>
                  <div className={`${FIELD_VALUE} break-words`}>{selectedCategory.code || '-'}</div>
                </div>
                <div>
                  <span className={`block ${FIELD_LABEL} mb-1`}>Tên danh mục</span>
                  <div className={`${FIELD_VALUE} break-words`}>{selectedCategory.name || '-'}</div>
                </div>
                {activeTab === 'management' && (
                  <div>
                    <span className={`block ${FIELD_LABEL} mb-1`}>Phiên bản</span>
                    <div className={FIELD_VALUE}>{selectedCategory.version || '1.0'}</div>
                  </div>
                )}
                <div className="col-span-2">
                  <span className={`block ${FIELD_LABEL} mb-1`}>Mô tả</span>
                  <div className={`${FIELD_VALUE} whitespace-pre-wrap break-words`}>{selectedCategory.description || '-'}</div>
                </div>
                <div>
                  <span className={`block ${FIELD_LABEL} mb-1`}>Đơn vị chủ trì cung cấp</span>
                  <div className={`${FIELD_VALUE} break-words`}>{selectedCategory.dataField || '-'}</div>
                </div>

                <div>
                  <span className={`block ${FIELD_LABEL} mb-1`}>Trạng thái phê duyệt</span>
                  <div className={FIELD_VALUE}>{getApprovalStatusBadge(selectedCategory.approvalStatus) ?? '-'}</div>
                </div>

                {selectedCategory.submitNote && (
                  <div className="col-span-2 space-y-1">
                    <span className={`flex items-center gap-1.5 ${FIELD_LABEL}`}>
                      <FileText className="w-4 h-4 text-[#64748B]" />
                      Nội dung trình duyệt
                    </span>
                    <div className={`${FIELD_VALUE} whitespace-pre-wrap break-words`}>
                      {selectedCategory.submitNote}
                    </div>
                  </div>
                )}
                {selectedCategory.approvalStatus === 'approved' && (
                  <div className={`col-span-2 ${BANNER_SUCCESS}`}>
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-[#16A34A]" />
                    <div className="min-w-0">
                      <div className="font-medium mb-1">Ý kiến phê duyệt danh mục</div>
                      <div className="leading-relaxed whitespace-pre-wrap">
                        {selectedCategory.approvalNote || <span className="text-[#64748B]">Không có ghi chú</span>}
                      </div>
                    </div>
                  </div>
                )}
                {selectedCategory.approvalStatus === 'rejected' && (
                  <div className={`col-span-2 ${BANNER_DANGER}`}>
                    <XCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#DC2626]" />
                    <div className="min-w-0">
                      <div className="font-medium mb-1">Lý do từ chối danh mục</div>
                      <div className="leading-relaxed whitespace-pre-wrap">
                        {selectedCategory.rejectReason || <span className="text-[#64748B]">Không có ghi chú</span>}
                      </div>
                    </div>
                  </div>
                )}

                <div className={`col-span-2 ${GROUP_CARD}`}>
                  <h4 className={SECTION_TITLE}>Thông tin hệ thống</h4>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <span className={`block ${FIELD_LABEL} mb-1`}>Ngày tạo</span>
                      <div className={FIELD_VALUE}>
                        {selectedCategory.createdDate || '-'}
                      </div>
                    </div>
                    <div>
                      <span className={`block ${FIELD_LABEL} mb-1`}>Người tạo</span>
                      <div className={FIELD_VALUE}>
                        {selectedCategory.createdBy || '-'}
                      </div>
                    </div>
                    <div>
                      <span className={`block ${FIELD_LABEL} mb-1`}>Ngày cập nhật gần nhất</span>
                      <div className={FIELD_VALUE}>
                        {selectedCategory.updatedDate || '-'}
                      </div>
                    </div>
                    <div>
                      <span className={`block ${FIELD_LABEL} mb-1`}>Người cập nhật</span>
                      <div className={FIELD_VALUE}>
                        {selectedCategory.updatedBy || '-'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => setShowViewModal(false)}
                className={BTN_OUTLINE}
              >
                Đóng
              </button>
              {activeTab === 'management' &&
                selectedCategory.approvalStatus !== 'approved' &&
                selectedCategory.approvalStatus !== 'rejected' &&
                selectedCategory.approvalStatus !== 'pending' && (
                  <button
                    type="button"
                    onClick={() => handleSubmitForApproval(selectedCategory)}
                    className={BTN_PRIMARY}
                  >
                    <Send className="w-4 h-4" />
                    Gửi phê duyệt
                  </button>
                )}
              {activeTab === 'approval' &&
                selectedCategory.approvalStatus !== 'approved' &&
                selectedCategory.approvalStatus !== 'rejected' && (
                  <>
                    <button
                      type="button"
                      onClick={() => { setShowViewModal(false); handleReject(selectedCategory); }}
                      className={BTN_DESTRUCTIVE}
                    >
                      <Ban className="w-4 h-4" />
                      Từ chối
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowViewModal(false); handleApprove(selectedCategory); }}
                      className={BTN_PRIMARY}
                    >
                      <Check className="w-4 h-4" />
                      Phê duyệt
                    </button>
                  </>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedCategory && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-2xl`}>
            <div className={MODAL_HEADER}>
              <h3 className={MODAL_TITLE}>Chỉnh sửa danh mục</h3>
              <button type="button" onClick={() => setShowEditModal(false)} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={`${MODAL_BODY} space-y-4`}>
              {activeTab === 'management' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={LABEL_CLS}>Phiên bản</label>
                      <input
                        type="text"
                        value={formData.version}
                        readOnly
                        disabled
                        aria-label="Phiên bản"
                        className={INPUT_CLS}
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLS}>Trạng thái</label>
                      <div className={READONLY_BOX}>
                        {getApprovalStatusBadge(selectedCategory.approvalStatus)}
                      </div>
                    </div>
                  </div>
                  {selectedCategory.approvalStatus === 'draft' ? (
                    <div className={BANNER_NEUTRAL}>
                      <Info className="w-4 h-4 mt-0.5 shrink-0 text-[#64748B]" />
                      <span>Danh mục đang ở dạng bản nháp, chưa từng gửi phê duyệt nên phiên bản giữ nguyên <strong className="font-medium">v{formData.version}</strong> cho đến khi được trình duyệt.</span>
                    </div>
                  ) : (
                    <div className={BANNER_INFO}>
                      <Info className="w-4 h-4 mt-0.5 shrink-0 text-[#155DFC]" />
                      <span>Chỉnh sửa sẽ tạo phiên bản mới <strong className="font-medium">v{formData.version}</strong>. Phiên bản này sẽ tự động được áp dụng ngay sau khi được phê duyệt.</span>
                    </div>
                  )}
                </>
              )}
              <div>
                <label className={LABEL_CLS}>Mã danh mục <span className={REQUIRED_MARK}>*</span></label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className={INPUT_CLS}
                  aria-label="Mã danh mục"
                  title="Mã danh mục"
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Tên danh mục <span className={REQUIRED_MARK}>*</span></label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={INPUT_CLS}
                  aria-label="Tên danh mục"
                  title="Tên danh mục"
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={TEXTAREA_CLS}
                  rows={3}
                  aria-label="Mô tả"
                  title="Mô tả"
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Đơn vị chủ trì cung cấp <span className={REQUIRED_MARK}>*</span></label>
                <select
                  value={formData.dataField}
                  onChange={(e) => setFormData({ ...formData, dataField: e.target.value })}
                  className={INPUT_CLS}
                  aria-label="Đơn vị chủ trì cung cấp"
                  title="Đơn vị chủ trì cung cấp"
                >
                  <option value="" disabled hidden>-- Chọn đơn vị --</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.name}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>


            </div>
            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className={BTN_OUTLINE}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className={BTN_OUTLINE}
              >
                <Save className="w-4 h-4" />
                Lưu
              </button>
              {activeTab === 'management' && (
                <button
                  type="button"
                  onClick={handleOpenSubmitEditCategory}
                  className={BTN_PRIMARY}
                >
                  <Send className="w-4 h-4" />
                  Gửi phê duyệt
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedCategory && (() => {
        const isCategoryUsed = metadataEntries.some(m => m.categoryCodes.includes(selectedCategory.code));
        return (
          <div className={MODAL_OVERLAY}>
            <div className={`${MODAL_BOX} max-w-md`} role="alertdialog" aria-modal="true">
              {isCategoryUsed ? (
                <>
                  <div className={MODAL_HEADER}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-[#FEF2F2] text-[#DC2626]">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <h3 className={MODAL_TITLE}>Không thể xóa danh mục</h3>
                    </div>
                    <button type="button" onClick={() => setShowDeleteModal(false)} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className={MODAL_BODY}>
                    <p className="text-[13px] text-[#020817] leading-relaxed">
                      Không thể xóa danh mục đã được sử dụng. Vui lòng xóa dữ liệu/metadata của danh mục để thực hiện tiếp tác vụ.
                    </p>
                  </div>
                  <div className={MODAL_FOOTER}>
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(false)}
                      className={BTN_OUTLINE}
                    >
                      Đóng
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className={MODAL_HEADER}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-[#FEF2F2] text-[#DC2626]">
                        <Trash2 className="w-5 h-5" />
                      </div>
                      <h3 className={MODAL_TITLE}>Xác nhận xóa</h3>
                    </div>
                    <button type="button" onClick={() => setShowDeleteModal(false)} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className={MODAL_BODY}>
                    <p className="text-[13px] text-[#020817]">
                      Bạn có chắc chắn muốn xóa danh mục <strong className="font-medium">{selectedCategory.name}</strong>?
                    </p>
                  </div>
                  <div className={MODAL_FOOTER}>
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(false)}
                      className={BTN_OUTLINE}
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={confirmDelete}
                      className={BTN_DESTRUCTIVE}
                    >
                      Xóa
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })()}

      {/* Delete Metadata Confirm Modal */}
      {showDeleteMetadataModal && metadataToDelete && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-md`} role="alertdialog" aria-modal="true">
            <div className={MODAL_HEADER}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-[#FEF2F2] text-[#DC2626]">
                  <Trash2 className="w-5 h-5" />
                </div>
                <h3 className={MODAL_TITLE}>Xác nhận xóa</h3>
              </div>
              <button type="button" onClick={() => setShowDeleteMetadataModal(false)} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={MODAL_BODY}>
              <p className="text-[13px] text-[#020817]">
                Bạn có chắc chắn muốn xóa metadata <strong className="font-medium">{metadataToDelete.fileName || metadataToDelete.categoryCodes.join(', ')}</strong>?
              </p>
            </div>
            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => setShowDeleteMetadataModal(false)}
                className={BTN_OUTLINE}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmDeleteMetadata}
                className={BTN_DESTRUCTIVE}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Approval / Reject Modal (Phê duyệt nhanh / Từ chối nhanh) */}
      {showBulkApprovalModal && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-2xl`}>
            <div className={MODAL_HEADER}>
              <h3 className={MODAL_TITLE}>
                {bulkApprovalAction === 'approved' ? 'Phê duyệt nhanh' : 'Từ chối nhanh'}
              </h3>
              <button
                type="button"
                onClick={() => setShowBulkApprovalModal(false)}
                className={BTN_GHOST_ICON}
                aria-label="Đóng"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`${MODAL_BODY} space-y-4`}>
              <div className={bulkApprovalAction === 'approved' ? BANNER_INFO : BANNER_DANGER}>
                {bulkApprovalAction === 'approved'
                  ? <CheckSquare className="w-4 h-4 mt-0.5 shrink-0 text-[#155DFC]" />
                  : <XCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#DC2626]" />}
                <div className="min-w-0 flex-1">
                  <div className="font-medium mb-1">
                    Danh mục được chọn ({selectedApprovalIds.length})
                  </div>
                  <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                    {approvalList.filter(c => selectedApprovalIds.includes(c.id)).map(c => (
                      <div key={c.id}>
                        <span className="text-[#64748B]">{c.code}</span> — {c.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className={LABEL_CLS}>
                  {bulkApprovalAction === 'approved' ? (
                    <>Ý kiến phê duyệt <span className="text-[#64748B] font-normal">(Không bắt buộc)</span></>
                  ) : (
                    <>Lý do từ chối <span className={REQUIRED_MARK}>*</span></>
                  )}
                </label>
                <textarea
                  value={bulkApprovalNote}
                  onChange={(e) => setBulkApprovalNote(e.target.value)}
                  className={TEXTAREA_CLS}
                  rows={4}
                  placeholder={bulkApprovalAction === 'approved'
                    ? 'Nhập ý kiến phê duyệt áp dụng cho tất cả các danh mục đã chọn (nếu có)...'
                    : 'Nhập lý do từ chối áp dụng cho tất cả các danh mục đã chọn...'}
                />
              </div>
            </div>

            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => setShowBulkApprovalModal(false)}
                className={BTN_OUTLINE}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmBulkApprovalAction}
                disabled={bulkApprovalAction === 'rejected' && !bulkApprovalNote.trim()}
                className={bulkApprovalAction === 'approved' ? BTN_PRIMARY : BTN_DESTRUCTIVE}
              >
                {bulkApprovalAction === 'approved' ? <Check className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                {bulkApprovalAction === 'approved' ? 'Phê duyệt' : 'Từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedCategory && approvalAction === 'approved' && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-2xl`}>
            <div className={MODAL_HEADER}>
              <h3 className={MODAL_TITLE}>Phê duyệt danh mục dữ liệu mở</h3>
              <button
                type="button"
                onClick={() => {
                  setShowApprovalModal(false);
                  setApprovalNote('');
                }}
                className={BTN_GHOST_ICON}
                aria-label="Đóng"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`${MODAL_BODY} space-y-4`}>
              <div className={BANNER_INFO}>
                <CheckSquare className="w-4 h-4 mt-0.5 shrink-0 text-[#155DFC]" />
                <div className="min-w-0">
                  <div className="font-medium mb-1">Thông tin danh mục</div>
                  <div><strong className="font-medium">{selectedCategory.name}</strong></div>
                  <div className="mt-1">Mã: {selectedCategory.code}</div>
                  <div className="mt-1">Đơn vị chủ trì cung cấp: {selectedCategory.dataField}</div>
                </div>
              </div>

              {selectedCategory.submitNote && (
                <div className={BANNER_NEUTRAL}>
                  <FileText className="w-4 h-4 mt-0.5 shrink-0 text-[#64748B]" />
                  <div className="min-w-0">
                    <div className="font-medium mb-1">Nội dung trình duyệt</div>
                    <div className="whitespace-pre-wrap">{selectedCategory.submitNote}</div>
                  </div>
                </div>
              )}

              <div>
                <label className={LABEL_CLS}>
                  Ý kiến phê duyệt
                </label>
                <textarea
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  className={TEXTAREA_CLS}
                  rows={5}
                  placeholder="Nhập ý kiến phê duyệt (nếu có)...&#10;Ví dụ: Đồng ý phê duyệt danh mục dữ liệu mở theo đề xuất của đơn vị."
                />
              </div>
            </div>

            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => {
                  setShowApprovalModal(false);
                  setApprovalNote('');
                }}
                className={BTN_OUTLINE}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmApprovalAction}
                className={BTN_PRIMARY}
              >
                <Check className="w-4 h-4" />
                Phê duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showApprovalModal && selectedCategory && approvalAction === 'rejected' && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-2xl`}>
            <div className={MODAL_HEADER}>
              <h3 className={MODAL_TITLE}>Từ chối phê duyệt danh mục</h3>
              <button
                type="button"
                onClick={() => {
                  setShowApprovalModal(false);
                  setRejectReason('');
                }}
                className={BTN_GHOST_ICON}
                aria-label="Đóng"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`${MODAL_BODY} space-y-4`}>
              <div className={BANNER_DANGER}>
                <XCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#DC2626]" />
                <div className="min-w-0">
                  <div className="font-medium mb-1">Thông tin danh mục</div>
                  <div><strong className="font-medium">{selectedCategory.name}</strong></div>
                  <div className="mt-1">Mã: {selectedCategory.code}</div>
                  <div className="mt-1">Lĩnh vực: {selectedCategory.dataField}</div>
                </div>
              </div>

              {selectedCategory.submitNote && (
                <div className={BANNER_NEUTRAL}>
                  <FileText className="w-4 h-4 mt-0.5 shrink-0 text-[#64748B]" />
                  <div className="min-w-0">
                    <div className="font-medium mb-1">Nội dung trình duyệt</div>
                    <div className="whitespace-pre-wrap">{selectedCategory.submitNote}</div>
                  </div>
                </div>
              )}

              <div>
                <label className={LABEL_CLS}>
                  Lý do từ chối <span className={REQUIRED_MARK}>*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className={TEXTAREA_CLS}
                  rows={5}
                  placeholder="Nhập lý do từ chối phê duyệt...&#10;Ví dụ: Danh mục chưa đầy đủ thông tin về cấu trúc dữ liệu. Đề nghị bổ sung các trường dữ liệu bắt buộc theo quy định."
                />
                {rejectReason.trim() === '' && (
                  <p className="text-[12px] text-[#DC2626] mt-1">Vui lòng nhập lý do từ chối</p>
                )}
              </div>

              <div className={BANNER_WARN}>
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#D97706]" />
                <div>
                  Sau khi từ chối, danh mục sẽ được trả lại cho đơn vị để chỉnh sửa và trình lại.
                </div>
              </div>
            </div>

            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => {
                  setShowApprovalModal(false);
                  setRejectReason('');
                }}
                className={BTN_OUTLINE}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmApprovalAction}
                disabled={!rejectReason.trim()}
                className={BTN_DESTRUCTIVE}
              >
                <Ban className="w-4 h-4" />
                Từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit for Approval Modal (kept for management tab) */}
      {showApprovalModal && selectedCategory && approvalAction === 'pending' && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-lg`}>
            <div className={MODAL_HEADER}>
              <h3 className={MODAL_TITLE}>Trình duyệt danh mục</h3>
            </div>

            <div className={`${MODAL_BODY} space-y-4`}>
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4">
                <div className={FIELD_LABEL}>Danh mục</div>
                <div className={`${FIELD_VALUE} mt-1`}>
                  {isEditCategorySubmission ? formData.name : selectedCategory.name}
                </div>
                <div className={`${FIELD_VALUE} mt-1`}>
                  Mã: {isEditCategorySubmission ? formData.code : selectedCategory.code}
                </div>
              </div>

              <div>
                <label className={LABEL_CLS}>
                  Người phê duyệt <span className={REQUIRED_MARK}>*</span>
                </label>
                <select
                  value={selectedApprover}
                  onChange={(e) => setSelectedApprover(e.target.value)}
                  className={INPUT_CLS}
                  aria-label="Chọn người phê duyệt"
                  title="Chọn người phê duyệt"
                >
                  <option value="" disabled hidden>-- Chọn người phê duyệt --</option>
                  {approvers.map(approver => (
                    <option key={approver.id} value={approver.id}>
                      {approver.name} - {approver.position}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={LABEL_CLS}>
                  Nội dung trình duyệt
                </label>
                <textarea
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  className={TEXTAREA_CLS}
                  rows={4}
                  placeholder="Nhập nội dung trình duyệt...&#10;Ví dụ: Đề nghị Lãnh đạo xem xét phê duyệt danh mục dữ liệu mở theo Nghị định 47/2020/NĐ-CP"
                />
              </div>
            </div>

            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => {
                  setShowApprovalModal(false);
                  setSelectedApprover('');
                  setApprovalNote('');
                  if (isNewCategorySubmission || isEditCategorySubmission) {
                    setIsNewCategorySubmission(false);
                    setIsEditCategorySubmission(false);
                    setSelectedCategory(null);
                  }
                }}
                className={BTN_OUTLINE}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmApprovalAction}
                disabled={!selectedApprover}
                className={BTN_PRIMARY}
              >
                <Send className="w-4 h-4" />
                Gửi phê duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete License Warning Modal */}
      {showDeleteLicenseModal && selectedLicenseToDelete && (
        <div className={MODAL_OVERLAY}>
          <div className={`${MODAL_BOX} max-w-md animate-in fade-in zoom-in-95 duration-200`} role="alertdialog" aria-modal="true">
            <div className={MODAL_HEADER}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-[#FFF7ED] text-[#D97706]">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className={MODAL_TITLE}>Cảnh báo xóa giấy phép</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteLicenseModal(false);
                  setSelectedLicenseToDelete(null);
                }}
                className={BTN_GHOST_ICON}
                aria-label="Đóng"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={MODAL_BODY}>
              <p className="text-[13px] text-[#020817] leading-relaxed">
                Giấy phép <strong className="font-medium">{selectedLicenseToDelete.name} ({selectedLicenseToDelete.shortName})</strong> đang được sử dụng để khai báo và thống kê tệp dữ liệu mở. Bạn có chắc chắn muốn xóa không?
              </p>
            </div>
            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteLicenseModal(false);
                  setSelectedLicenseToDelete(null);
                }}
                className={BTN_OUTLINE}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmDeleteLicense}
                className={BTN_DESTRUCTIVE}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
