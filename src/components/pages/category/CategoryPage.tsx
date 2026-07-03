import * as React from 'react';
import { useState, ChangeEvent } from 'react';
import {
  Settings,
  CheckCircle2,
  Globe,
  FileText,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  SquarePen,
  Trash2,
  X,
  Save,
  Database,
  List,
  Tag,
  Columns,
  Clock,
  XCircle,
  Check,
  AlertCircle,
  Share2,
  Lock,
  Unlock,
  Download,
  FileDown,
  BarChart3,
  Activity,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Send,
  Upload,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown
} from 'lucide-react';
import { PowerOff } from 'lucide-react';
import { CreateVersionModal } from './components/modals/CreateVersionModal';
import { ArchiveRecordModal } from './components/modals/ArchiveRecordModal';
import { RecordFormModal } from './components/modals/RecordFormModal';
import { ApprovalRequestModal } from './components/modals/ApprovalRequestModal';
import { UpdateApprovalModal } from './components/modals/UpdateApprovalModal';
import { Portal } from '../../common/Portal';

interface CategoryPageProps {
  categoryName: string;
  categoryId: string;
}

interface Category {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'standard' | 'reference' | 'system';
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'published' | 'unpublished' | 'active' | 'inactive';
  createdDate: string;
  createdBy?: string;
  updatedDate?: string;
  updatedBy?: string;
  version?: number;
  fields: CategoryField[];
}

interface CategoryField {
  id: string;
  name: string;
  dataType: string;
  required: boolean;
  defaultValue?: string;
  maxLength?: number;
  description?: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  referenceTable?: string;
  referenceField?: string;
}

const MOCK_RECORDS_BY_CATEGORY: Record<string, Category[]> = {
  'category-a-1': [
    { id: '1', code: 'MALE', name: 'Nam', description: 'Giới tính Nam', type: 'standard', status: 'approved', createdDate: '01/01/2024', createdBy: 'Hệ thống', updatedDate: '15/01/2026', updatedBy: 'Hoàng Văn E', version: 1, fields: [] },
    { id: '2', code: 'FEMALE', name: 'Nữ', description: 'Giới tính Nữ', type: 'standard', status: 'approved', createdDate: '01/01/2024', createdBy: 'Hệ thống', updatedDate: '15/01/2026', updatedBy: 'Nguyễn Văn A', version: 1, fields: [] },
    { id: '3', code: 'OTHER', name: 'Khác', description: 'Giới tính khác/chưa xác định', type: 'standard', status: 'approved', createdDate: '01/01/2024', createdBy: 'Hệ thống', updatedDate: '15/01/2026', updatedBy: 'Nguyễn Văn A', version: 1, fields: [] },
    { id: '4', code: 'UNKNOWN', name: 'Không xác định', description: 'Giới tính không xác định', type: 'standard', status: 'pending', createdDate: '20/06/2026', createdBy: 'Nguyễn Văn A', updatedDate: '20/06/2026', updatedBy: 'Nguyễn Văn A', version: 1, fields: [] },
    { id: '5', code: 'INTERSEX', name: 'Liên giới tính', description: 'Sinh học không hoàn toàn nam hoặc nữ', type: 'standard', status: 'rejected', createdDate: '10/06/2026', createdBy: 'Trần Thị B', updatedDate: '15/06/2026', updatedBy: 'Trần Thị B', version: 1, fields: [] },
    { id: '6', code: 'NON_BINARY', name: 'Phi nhị giới', description: 'Không thuộc nhị giới tính truyền thống', type: 'standard', status: 'draft', createdDate: '01/07/2026', createdBy: 'Lê Văn C', updatedDate: '01/07/2026', updatedBy: 'Lê Văn C', version: 1, fields: [] },
    { id: '7', code: 'AGENDER', name: 'Vô giới tính', description: 'Không nhận dạng với bất kỳ giới tính nào', type: 'standard', status: 'inactive', createdDate: '05/03/2025', createdBy: 'Phạm Thị D', updatedDate: '10/06/2026', updatedBy: 'Phạm Thị D', version: 1, fields: [] }
  ],
  'category-a-2': [
    { id: '1', code: 'KINH', name: 'Kinh', description: 'Dân tộc Kinh', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '2', code: 'TAY', name: 'Tày', description: 'Dân tộc Tày', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '3', code: 'THAI', name: 'Thái', description: 'Dân tộc Thái', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '4', code: 'MUONG', name: 'Mường', description: 'Dân tộc Mường', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '5', code: 'KHOME', name: 'Khơ Me', description: 'Dân tộc Khơ Me', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] }
  ],
  'category-a-3': [
    { id: '1', code: 'VN', name: 'Việt Nam', description: 'Cộng hòa Xã hội Chủ nghĩa Việt Nam', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '2', code: 'US', name: 'Mỹ', description: 'Hợp chủng quốc Hoa Kỳ', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '3', code: 'JP', name: 'Nhật Bản', description: 'Nhật Bản', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '4', code: 'KR', name: 'Hàn Quốc', description: 'Đại Hàn Dân Quốc', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] }
  ],
  'category-a-4': [
    { id: '1', code: 'PG', name: 'Phật giáo', description: 'Đạo Phật', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '2', code: 'CG', name: 'Công giáo', description: 'Đạo Thiên Chúa', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '3', code: 'TL', name: 'Tin lành', description: 'Đạo Tin lành', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '4', code: 'HH', name: 'Hòa Hảo', description: 'Phật giáo Hòa Hảo', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '5', code: 'K', name: 'Không', description: 'Không theo tôn giáo nào', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] }
  ],
  'category-a-5': [
    { id: '1', code: 'BTP', name: 'Bộ Tư Pháp', description: 'Cơ quan ngang bộ trực thuộc Chính phủ', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '2', code: 'CHT', name: 'Cục Hộ tịch, quốc tịch, chứng thực', description: 'Đơn vị trực thuộc Bộ Tư pháp', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '3', code: 'STP_HN', name: 'Sở Tư pháp Hà Nội', description: 'Cơ quan chuyên môn thuộc UBND TP Hà Nội', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] }
  ],
  'category-a-6': [
    { id: '1', code: 'HN', name: 'Thành phố Hà Nội', description: 'Đơn vị hành chính cấp tỉnh', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '2', code: 'HCM', name: 'Thành phố Hồ Chí Minh', description: 'Đơn vị hành chính cấp tỉnh', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '3', code: 'DN', name: 'Thành phố Đà Nẵng', description: 'Đơn vị hành chính cấp tỉnh', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] }
  ],
  'category-a-7': [
    { id: '1', code: 'CH', name: 'Chủ hộ', description: 'Chủ hộ gia đình', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '2', code: 'VC', name: 'Vợ/Chồng', description: 'Quan hệ vợ chồng với chủ hộ', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '3', code: 'CC', name: 'Con đẻ', description: 'Con ruột của chủ hộ', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] },
    { id: '4', code: 'BC', name: 'Bố/Mẹ', description: 'Bố mẹ đẻ của chủ hộ', type: 'standard', status: 'approved', createdDate: '01/01/2024', version: 1, fields: [] }
  ]
};

export function CategoryPage({ categoryName, categoryId }: CategoryPageProps) {
  const [activeTab, setActiveTab] = useState<'setup' | 'approval' | 'publish' | 'stats' | 'version-history'>('setup');

  // Mock data - Danh sách tỉnh thành Việt Nam
  const [categories, setCategories] = useState<Category[]>(() => [
    { id: '1', code: 'VN01', name: 'Hà Nội', description: 'Thành phố trực thuộc Trung ương', type: 'standard', status: 'pending', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '2', code: 'VN02', name: 'Hồ Chí Minh', description: 'Thành phố trực thuộc Trung ương', type: 'standard', status: 'approved', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '3', code: 'VN03', name: 'Đà Nẵng', description: 'Thành phố trực thuộc Trung ương', type: 'standard', status: 'published', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '4', code: 'VN04', name: 'Hải Phòng', description: 'Thành phố trực thuộc Trung ương', type: 'standard', status: 'unpublished', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '5', code: 'VN05', name: 'Cần Thơ', description: 'Thành phố trực thuộc Trung ương', type: 'standard', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '6', code: 'VN06', name: 'An Giang', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '7', code: 'VN07', name: 'Bà Rịa - Vũng Tàu', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '8', code: 'VN08', name: 'Bắc Giang', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '9', code: 'VN09', name: 'Bắc Kạn', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '10', code: 'VN10', name: 'Bạc Liêu', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '11', code: 'VN11', name: 'Bắc Ninh', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '12', code: 'VN12', name: 'Bến Tre', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '13', code: 'VN13', name: 'Bình Định', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '14', code: 'VN14', name: 'Bình Dương', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '15', code: 'VN15', name: 'Bình Phước', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '16', code: 'VN16', name: 'Bình Thuận', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '17', code: 'VN17', name: 'Cà Mau', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '18', code: 'VN18', name: 'Cao Bằng', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '19', code: 'VN19', name: 'Đắk Lắk', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '20', code: 'VN20', name: 'Đắk Nông', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '21', code: 'VN21', name: 'Điện Biên', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '22', code: 'VN22', name: 'Đồng Nai', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '23', code: 'VN23', name: 'Đồng Tháp', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '24', code: 'VN24', name: 'Gia Lai', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '25', code: 'VN25', name: 'Hà Giang', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '26', code: 'VN26', name: 'Hà Nam', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '27', code: 'VN27', name: 'Hà Tĩnh', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '28', code: 'VN28', name: 'Hải Dương', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '29', code: 'VN29', name: 'Hậu Giang', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '30', code: 'VN30', name: 'Hòa Bình', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '31', code: 'VN31', name: 'Hưng Yên', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '32', code: 'VN32', name: 'Khánh Hòa', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '33', code: 'VN33', name: 'Kiên Giang', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '34', code: 'VN34', name: 'Kon Tum', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '35', code: 'VN35', name: 'Lai Châu', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '36', code: 'VN36', name: 'Lâm Đồng', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '37', code: 'VN37', name: 'Lạng Sơn', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '38', code: 'VN38', name: 'Lào Cai', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '39', code: 'VN39', name: 'Long An', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '40', code: 'VN40', name: 'Nam Định', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '41', code: 'VN41', name: 'Nghệ An', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '42', code: 'VN42', name: 'Ninh Bình', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '43', code: 'VN43', name: 'Ninh Thuận', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '44', code: 'VN44', name: 'Phú Thọ', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '45', code: 'VN45', name: 'Phú Yên', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '46', code: 'VN46', name: 'Quảng Bình', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '47', code: 'VN47', name: 'Quảng Nam', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '48', code: 'VN48', name: 'Quảng Ngãi', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '49', code: 'VN49', name: 'Quảng Ninh', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '50', code: 'VN50', name: 'Quảng Trị', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '51', code: 'VN51', name: 'Sóc Trăng', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '52', code: 'VN52', name: 'Sơn La', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '53', code: 'VN53', name: 'Tây Ninh', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '54', code: 'VN54', name: 'Thái Bình', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '55', code: 'VN55', name: 'Thái Nguyên', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '56', code: 'VN56', name: 'Thanh Hóa', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '57', code: 'VN57', name: 'Thừa Thiên Huế', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '58', code: 'VN58', name: 'Tiền Giang', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '59', code: 'VN59', name: 'Trà Vinh', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '60', code: 'VN60', name: 'Tuyên Quang', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '61', code: 'VN61', name: 'Vĩnh Long', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '62', code: 'VN62', name: 'Vĩnh Phúc', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] },
    { id: '63', code: 'VN63', name: 'Yên Bái', description: 'Tỉnh', type: 'reference', status: 'active', createdDate: '01/01/2024', fields: [{ id: 'f1', name: 'Mã tỉnh', dataType: 'TEXT', required: true }, { id: 'f2', name: 'Tên tỉnh', dataType: 'TEXT', required: true }] }
  ].map(c => ({
    ...c,
    status: 'approved',
    createdBy: 'Hệ thống',
    updatedDate: '15/01/2026',
    updatedBy: 'Nguyễn Văn A'
  })));

  // Update categories when categoryId changes
  React.useEffect(() => {
    const mockRecords = MOCK_RECORDS_BY_CATEGORY[categoryId] || MOCK_RECORDS_BY_CATEGORY['category-a-1'] || [];
    setCategories(mockRecords.map(r => ({
      createdBy: 'Hệ thống',
      updatedDate: '15/01/2026',
      updatedBy: 'Nguyễn Văn A',
      ...r,
    })));
  }, [categoryId]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExportFile = (format: string) => {
    setShowExportMenu(false);
    alert(`Xuất dữ liệu ra ${format}`);
  };

  // Filter conditions (like TargetDatabaseDetailPage)
  interface FilterCondition { id: string; field: string; operator: string; value: string; logic: 'AND' | 'OR'; }
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([]);

  // Sort panel state (like TargetDatabaseDetailPage)
  interface SortCondition { id: string; field: 'name' | 'code' | 'createdDate' | 'updatedDate'; order: 'ASC' | 'DESC'; }
  const [showSortPanel, setShowSortPanel] = useState(false);
  const [sortConditions, setSortConditions] = useState<SortCondition[]>([]);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Category | null>(null);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showCreateVersionModal, setShowCreateVersionModal] = useState(false);
  const [showFieldFormModal, setShowFieldFormModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showApprovalDetailModal, setShowApprovalDetailModal] = useState(false);
  const [showApprovalRequestModal, setShowApprovalRequestModal] = useState(false);
  const [approvalForm, setApprovalForm] = useState({ reviewer: '', note: '' });
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([]);
  const [showBulkApproval, setShowBulkApproval] = useState(false);
  const [bulkApprovalForm, setBulkApprovalForm] = useState({ reviewer: '', note: '' });
  const [selectedApprovalRequest, setSelectedApprovalRequest] = useState<any>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreviewData, setImportPreviewData] = useState<any[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategoryFields, setNewCategoryFields] = useState<CategoryField[]>([]);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successNotificationMessage, setSuccessNotificationMessage] = useState('');

  const [newVersionName, setNewVersionName] = useState('v3.3');
  const [newEffectiveDate, setNewEffectiveDate] = useState('');
  const [newChangeDesc, setNewChangeDesc] = useState('');
  const [versionHistoryList, setVersionHistoryList] = useState([
    {
      version: 'v3.2',
      date: '05/01/2026',
      effectiveDate: '10/01/2026',
      user: 'Nguyễn Văn A',
      changes: 'Thêm trường "Số điện thoại liên hệ"',
      status: 'active'
    },
    {
      version: 'v3.1',
      date: '28/12/2025',
      effectiveDate: '01/01/2026',
      user: 'Trần Thị B',
      changes: 'Cập nhật 15 bản ghi tỉnh thành',
      status: 'pending'
    },
    {
      version: 'v3.0',
      date: '15/12/2025',
      effectiveDate: '20/12/2025',
      user: 'Lê Văn C',
      changes: 'Thay đổi kiểu dữ liệu trường "Mã tỉnh"',
      status: 'archived'
    },
    {
      version: 'v2.5',
      date: '01/12/2025',
      effectiveDate: '05/12/2025',
      user: 'Phạm Thị D',
      changes: 'Thêm ràng buộc unique cho mã tỉnh',
      status: 'locked'
    },
    {
      version: 'v2.0',
      date: '20/11/2025',
      effectiveDate: '25/11/2025',
      user: 'Hoàng Văn E',
      changes: 'Khởi tạo danh mục 63 tỉnh thành',
      status: 'archived'
    }
  ]);

  // Inline edit & add states
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [inlineEditData, setInlineEditData] = useState({ code: '', name: '', description: '' });
  const [addingRow, setAddingRow] = useState<boolean>(false);
  const [inlineAddData, setInlineAddData] = useState({ code: '', name: '', description: '' });

  // Publish states
  const [publishStatus, setPublishStatus] = useState<'unpublished' | 'published' | 'stopped'>('unpublished');
  const [shareScope, setShareScope] = useState<'internal' | 'extended' | 'public'>('internal');
  const [unpublishReason, setUnpublishReason] = useState<string>('');
  const [publishActionInfo, setPublishActionInfo] = useState<{ user: string; date: string; reason?: string }>({ user: '', date: '' });
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false);
  const [showUnpublishModal, setShowUnpublishModal] = useState<boolean>(false);

  const handleSaveInlineEdit = (id: string) => {
    if (!inlineEditData.code.trim() || !inlineEditData.name.trim()) {
      alert('Mã và Tên giá trị không được để trống');
      return;
    }
    const currentDate = new Date().toLocaleDateString('vi-VN');
    setCategories(prev =>
      prev.map(c =>
        c.id === id ? {
          ...c,
          code: inlineEditData.code,
          name: inlineEditData.name,
          description: inlineEditData.description,
          status: 'draft' as const,
          updatedDate: currentDate,
          updatedBy: 'Nguyễn Văn A'
        } : c
      )
    );
    setVersionHistoryList(prev => [{
      version: getNextVersionLabel(),
      date: currentDate,
      effectiveDate: '',
      user: 'Nguyễn Văn A',
      changes: `Chỉnh sửa bản ghi: ${inlineEditData.name} (${inlineEditData.code})`,
      status: 'pending'
    }, ...prev]);
    setEditingRowId(null);
    setSuccessNotificationMessage('Đã lưu thay đổi thành công!');
    setShowSuccessNotification(true);
    setTimeout(() => setShowSuccessNotification(false), 3000);
  };

  const getNextVersionLabel = () => {
    if (versionHistoryList.length === 0) return 'v1.0';
    const latest = versionHistoryList[0].version;
    const match = latest.match(/v(\d+)\.(\d+)/);
    if (!match) return 'v1.0';
    return `v${match[1]}.${parseInt(match[2]) + 1}`;
  };

  const handleSaveInlineAdd = () => {
    if (!inlineAddData.code.trim() || !inlineAddData.name.trim()) {
      alert('Mã và Tên giá trị không được để trống');
      return;
    }
    const newId = (categories.length + 1).toString();
    const currentDate = new Date().toLocaleDateString('vi-VN');
    const newCat: Category = {
      id: newId,
      code: inlineAddData.code,
      name: inlineAddData.name,
      description: inlineAddData.description,
      type: 'standard',
      status: 'draft' as const,
      createdDate: currentDate,
      createdBy: 'Nguyễn Văn A',
      updatedDate: currentDate,
      updatedBy: 'Nguyễn Văn A',
      version: 1,
      fields: []
    };
    setCategories(prev => [...prev, newCat]);
    setVersionHistoryList(prev => [{
      version: getNextVersionLabel(),
      date: currentDate,
      effectiveDate: '',
      user: 'Nguyễn Văn A',
      changes: `Thêm bản ghi: ${inlineAddData.name} (${inlineAddData.code})`,
      status: 'pending'
    }, ...prev]);
    setAddingRow(false);
    setSuccessNotificationMessage('Đã thêm bản ghi mới thành công!');
    setShowSuccessNotification(true);
    setTimeout(() => setShowSuccessNotification(false), 3000);
  };
  const [editedCategoryData, setEditedCategoryData] = useState({
    code: '',
    name: '',
    type: 'standard' as 'standard' | 'reference' | 'system',
    status: 'published' as 'pending' | 'approved' | 'published' | 'unpublished' | 'active' | 'inactive',
    description: '',
    approver: ''
  });
  const [archiveRequestData, setArchiveRequestData] = useState({ reason: '', approver: '' });
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);
  const [newFieldData, setNewFieldData] = useState({
    name: '',
    dataType: 'TEXT',
    required: false,
    defaultValue: '',
    maxLength: 255,
    description: '',
    isPrimaryKey: false,
    isForeignKey: false,
    referenceTable: '',
    referenceField: ''
  });

  // Validation errors
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  // Approval filters
  const [activeApprovalTab, setActiveApprovalTab] = useState<'data-change' | 'unpublish'>('data-change');
  const [approvalStatusFilter, setApprovalStatusFilter] = useState('all');
  const [approvalRequestFilter, setApprovalRequestFilter] = useState('all');

  // Bulk approval states
  const [selectedApprovalIds, setSelectedApprovalIds] = useState<number[]>([]);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [approvalComment, setApprovalComment] = useState('');
  const [pendingApprovalIds, setPendingApprovalIds] = useState<number[]>([]);

  // Version Popups States
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showVersionDetailModal, setShowVersionDetailModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedVersionData, setSelectedVersionData] = useState<any>(null);

  // Mock approvers list
  const approvers = [
    { id: 'approver1', name: 'Hoàng Văn E', role: 'Trưởng phòng Công nghệ thông tin' },
    { id: 'approver2', name: 'Nguyễn Thị F', role: 'Phó phòng CNTT' },
    { id: 'approver3', name: 'Trần Văn G', role: 'Trưởng phòng Pháp chế' },
    { id: 'approver4', name: 'Lê Thị H', role: 'Giám đốc Sở Tư pháp' },
    { id: 'approver5', name: 'Phạm Văn I', role: 'Chuyên viên cao cấp' }
  ];

  // Mock approval data - Value change requests
  const approvalRequests = categories.map(c => {
    let requestStatus = 'approved';
    if (c.status === 'pending') requestStatus = 'pending';
    else if (c.status === 'rejected') requestStatus = 'rejected';

    const changedFields = (c.status === 'pending' || c.status === 'rejected') ? ['Thông tin chung'] : ['—'];

    return {
      id: Number(c.id),
      recordCode: c.code,
      recordName: c.name,
      description: c.description,
      changedFields: changedFields,
      changes: {
        'Thông tin chung': { old: '—', new: c.name }
      },
      createdBy: c.createdBy || 'Hệ thống',
      createdDate: c.createdDate || '15/01/2026',
      changedBy: c.updatedBy || c.createdBy || 'Nguyễn Văn A',
      changedDate: c.updatedDate || c.createdDate || '15/01/2026',
      approvedDate: c.status === 'approved' ? (c.updatedDate || '15/01/2026') : null,
      approvedBy: c.status === 'approved' ? 'Hoàng Văn E' : null,
      status: requestStatus
    };
  });

  // Mock approval data - Unpublish requests
  const unpublishRequests = [
    {
      id: 1,
      categoryCode: 'VN01',
      categoryName: 'Hà Nội',
      reason: 'Danh mục đã hết hạn áp dụng theo TT mới',
      requestedBy: 'Nguyễn Văn A',
      requestedDate: '28/05/2026 14:30',
      approvedDate: null,
      approvedBy: null,
      status: 'pending'
    },
    {
      id: 2,
      categoryCode: 'VN02',
      categoryName: 'Hồ Chí Minh',
      reason: 'Cần cập nhật cấu trúc lớn',
      requestedBy: 'Trần Thị B',
      requestedDate: '25/05/2026 10:15',
      approvedDate: '26/05/2026 09:00',
      approvedBy: 'Lãnh đạo Quản trị',
      status: 'approved'
    }
  ];

  const currentRequests = activeApprovalTab === 'data-change' ? approvalRequests : unpublishRequests;

  const approvalStats = {
    pending: currentRequests.filter(r => r.status === 'pending').length,
    approved: currentRequests.filter(r => r.status === 'approved').length,
    rejected: currentRequests.filter(r => r.status === 'rejected').length,
    total: currentRequests.length
  };

  const filteredApprovalRequests = approvalRequests.filter(req => {
    const matchesStatus = approvalStatusFilter === 'all' || req.status === approvalStatusFilter;
    const matchesSearch = searchTerm === '' ||
      req.recordCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.recordName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredUnpublishRequests = unpublishRequests.filter(req => {
    const matchesStatus = approvalStatusFilter === 'all' || req.status === approvalStatusFilter;
    const matchesSearch = searchTerm === '' ||
      req.categoryCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleViewApprovalDetail = (request: any) => {
    setSelectedApprovalRequest(request);
    setShowApprovalDetailModal(true);
  };

  const handleApprove = (requestId: number) => {
    // Open approval modal for single request
    setPendingApprovalIds([requestId]);
    setApprovalComment('');
    setShowApprovalModal(true);
  };

  const handleReject = (requestId: number) => {
    // Open reject modal for single request
    setPendingApprovalIds([requestId]);
    setApprovalComment('');
    setShowRejectModal(true);
  };

  const handleBulkApprove = () => {
    if (selectedApprovalIds.length === 0) {
      alert('Vui lòng chọn ít nhất một yêu cầu để phê duyệt');
      return;
    }
    setPendingApprovalIds(selectedApprovalIds);
    setApprovalComment('');
    setShowApprovalModal(true);
  };

  const handleBulkReject = () => {
    if (selectedApprovalIds.length === 0) {
      alert('Vui lòng chọn ít nhất một yêu cầu để từ chối');
      return;
    }
    setPendingApprovalIds(selectedApprovalIds);
    setApprovalComment('');
    setShowRejectModal(true);
  };

  const confirmApproval = () => {
    // In production, this would call an API
    console.log('Phê duyệt:', pendingApprovalIds, 'Nội dung:', approvalComment);
    
    // Sync with categories status
    setCategories(prev =>
      prev.map(c =>
        pendingApprovalIds.includes(Number(c.id)) ? { ...c, status: 'approved', updatedDate: new Date().toLocaleDateString('vi-VN'), updatedBy: 'Hoàng Văn E' } : c
      )
    );

    setShowApprovalModal(false);
    setSelectedApprovalIds([]);
    setApprovalComment('');
    setPendingApprovalIds([]);
    setSuccessNotificationMessage(
      `Đã phê duyệt thành công ${pendingApprovalIds.length} yêu cầu`
    );
    setShowSuccessNotification(true);
    setTimeout(() => setShowSuccessNotification(false), 3000);
  };

  const confirmReject = () => {
    if (!approvalComment.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }
    // In production, this would call an API
    console.log('Từ chối:', pendingApprovalIds, 'Lý do:', approvalComment);
    
    // Sync with categories status
    setCategories(prev =>
      prev.map(c =>
        pendingApprovalIds.includes(Number(c.id)) ? { ...c, status: 'rejected', updatedDate: new Date().toLocaleDateString('vi-VN'), updatedBy: 'Nguyễn Văn A' } : c
      )
    );

    setShowRejectModal(false);
    setSelectedApprovalIds([]);
    setApprovalComment('');
    setPendingApprovalIds([]);
    setSuccessNotificationMessage(
      `Đã từ chối ${pendingApprovalIds.length} yêu cầu`
    );
    setShowSuccessNotification(true);
    setTimeout(() => setShowSuccessNotification(false), 3000);
  };

  const toggleSelectApproval = (id: number) => {
    setSelectedApprovalIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAllApprovals = () => {
    const pendingRequests = filteredApprovalRequests.filter(r => r.status === 'pending');
    if (selectedApprovalIds.length === pendingRequests.length) {
      setSelectedApprovalIds([]);
    } else {
      setSelectedApprovalIds(pendingRequests.map(r => r.id));
    }
  };

  const getRequestTypeBadge = (type: string) => {
    switch (type) {
      case 'create':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Tạo mới</span>;
      case 'edit-version':
        return <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Phê duyệt phiên bản</span>;
      case 'edit-structure':
        return <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Phê duyệt cấu trúc</span>;
      case 'edit-effective':
        return <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Phê duyệt hiệu hiệu lực</span>;
      default:
        return null;
    }
  };

  const stats = {
    total: categories.length,
    published: categories.filter(c => c.status === 'active' || c.status === 'published').length,
    standard: categories.filter(c => c.type === 'standard').length,
    reference: categories.filter(c => c.type === 'reference').length
  };

  const filteredCategories = categories.filter(cat => {
    // Search term filter (always applied)
    const matchesSearch = !searchTerm ||
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    // Dynamic filter conditions
    if (filterConditions.length === 0) return true;

    const getFieldValue = (c: typeof cat, field: string): string => {
      switch (field) {
        case 'code': return c.code;
        case 'name': return c.name;
        case 'description': return c.description;
        case 'status': return c.status === 'active' ? 'published' : (c.status === 'inactive' ? 'unpublished' : c.status);
        case 'createdDate': return c.createdDate;
        case 'createdBy': return c.createdBy || '';
        case 'updatedDate': return c.updatedDate || '';
        case 'updatedBy': return c.updatedBy || '';
        default: return '';
      }
    };

    const evaluateCondition = (fc: FilterCondition): boolean => {
      const val = getFieldValue(cat, fc.field).toLowerCase();
      const fval = fc.value.toLowerCase();
      switch (fc.operator) {
        case '=':    return val === fval;
        case '!=':   return val !== fval;
        case 'LIKE': return val.includes(fval);
        case '>':    return val > fval;
        case '<':    return val < fval;
        default:     return true;
      }
    };

    // Evaluate all conditions with AND/OR logic
    let result = evaluateCondition(filterConditions[0]);
    for (let i = 1; i < filterConditions.length; i++) {
      const fc = filterConditions[i];
      if (fc.logic === 'AND') result = result && evaluateCondition(fc);
      else result = result || evaluateCondition(fc);
    }
    return result;
  }).sort((a, b) => {
    // If custom sortConditions are set, apply them in order
    if (sortConditions.length > 0) {
      for (const sc of sortConditions) {
        let cmp = 0;
        if (sc.field === 'name') cmp = a.name.localeCompare(b.name);
        else if (sc.field === 'code') cmp = a.code.localeCompare(b.code);
        else if (sc.field === 'createdDate') {
          const dA = new Date(a.createdDate.split('/').reverse().join('-')).getTime();
          const dB = new Date(b.createdDate.split('/').reverse().join('-')).getTime();
          cmp = dA - dB;
        } else if (sc.field === 'updatedDate') {
          const dA = new Date((a.updatedDate || a.createdDate).split('/').reverse().join('-')).getTime();
          const dB = new Date((b.updatedDate || b.createdDate).split('/').reverse().join('-')).getTime();
          cmp = dA - dB;
        }
        if (cmp !== 0) return sc.order === 'ASC' ? cmp : -cmp;
      }
      return 0;
    }
    // Fallback to old sortBy logic
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
    const dateA = new Date(a.createdDate.split('/').reverse().join('-')).getTime();
    const dateB = new Date(b.createdDate.split('/').reverse().join('-')).getTime();
    if (sortBy === 'oldest') return dateA - dateB;
    return dateB - dateA;
  });

  const paginatedCategories = filteredCategories.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);

  const renderPagination = (totalCount: number) => {
    if (totalCount <= 0) return null;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startItem = (currentPageNum - 1) * pageSize + 1;
    const endItem = Math.min(currentPageNum * pageSize, totalCount);
    return (
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white text-[13px] font-medium">
        <div className="flex items-center gap-2">
          <span className="text-slate-600 font-normal">Hiển thị</span>
          <select
            aria-label="Số bản ghi trên trang"
            value={pageSize}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => { setPageSize(Number(e.target.value)); setCurrentPageNum(1); }}
            className="px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white text-[13px] cursor-pointer font-medium"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-slate-600 font-normal">bản ghi/trang</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-600 font-normal">{startItem} - {endItem} / {totalCount}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPageNum(Math.max(1, currentPageNum - 1))} disabled={currentPageNum === 1}
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer">
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => setCurrentPageNum(page)}
                className={`px-3 py-1.5 border rounded-xl font-medium text-[13px] transition-colors cursor-pointer ${currentPageNum === page ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                {page}
              </button>
            ))}
            <button onClick={() => setCurrentPageNum(Math.min(Math.ceil(totalCount / pageSize), currentPageNum + 1))} disabled={currentPageNum === Math.ceil(totalCount / pageSize)}
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer">
              Sau
            </button>
          </div>
        </div>
      </div>
    );
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'standard':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Tiêu chuẩn</span>;
      case 'reference':
        return <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Tham chiếu</span>;
      case 'system':
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Hệ thống</span>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <span className="px-3 py-1 bg-slate-100 text-slate-600 border border-slate-200 text-[13px] rounded-full whitespace-nowrap">Bản nháp</span>;
      case 'pending':
        return <span className="px-3 py-1 bg-orange-50 text-orange-700 border border-orange-200 text-[13px] rounded-full whitespace-nowrap">Chờ duyệt</span>;
      case 'approved':
      case 'active':
      case 'published':
        return <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 text-[13px] rounded-full whitespace-nowrap">Đã phê duyệt</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 text-[13px] rounded-full whitespace-nowrap">Từ chối</span>;
      case 'inactive':
        return <span className="px-3 py-1 bg-slate-200 text-slate-600 border border-slate-300 text-[13px] rounded-full whitespace-nowrap">Ngừng áp dụng</span>;
      case 'unpublished':
        return <span className="px-3 py-1 bg-slate-200 text-slate-700 text-[13px] rounded-full whitespace-nowrap">Hủy công khai</span>;
      default:
        return null;
    }
  };

  const getApprovalStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs rounded-full whitespace-nowrap">Chờ phê duyệt</span>;
      case 'approved':
        return <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 text-xs rounded-full whitespace-nowrap">Đã phê duyệt</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 text-xs rounded-full whitespace-nowrap">Từ chối</span>;
      default:
        return null;
    }
  };

  // Handle Excel file import
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    setImportErrors([]);

    // Read and parse Excel file
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = event.target?.result;
        if (!data) return;

        // Simple CSV parsing (for demo - in production use a library like xlsx)
        const text = new TextDecoder().decode(data as ArrayBuffer);
        const rows = text.split('\n').map(row => row.split(','));

        // Skip header row and parse data
        const parsedData = rows.slice(1).filter(row => row.length >= 4).map((row, index) => ({
          id: `import-${index}`,
          code: row[0]?.trim() || '',
          name: row[1]?.trim() || '',
          description: row[2]?.trim() || '',
          type: (row[3]?.trim().toLowerCase() === 'tiêu chuẩn' ? 'standard' :
            row[3]?.trim().toLowerCase() === 'tham chiếu' ? 'reference' : 'system') as 'standard' | 'reference' | 'system',
          status: 'active' as 'active' | 'inactive',
          createdDate: new Date().toLocaleDateString('vi-VN'),
          fields: []
        }));

        // Validate data
        const errors: string[] = [];
        parsedData.forEach((item, index) => {
          if (!item.code) errors.push(`Dòng ${index + 2}: Thiếu mã danh mục`);
          if (!item.name) errors.push(`Dòng ${index + 2}: Thiếu tên danh mục`);
        });

        setImportErrors(errors);
        setImportPreviewData(parsedData);
      } catch (error) {
        setImportErrors(['Lỗi khi đọc file. Vui lòng kiểm tra định dạng file.']);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleImportConfirm = () => {
    if (importErrors.length > 0) {
      alert('Vui lòng sửa các lỗi trước khi nhập dữ liệu');
      return;
    }

    // Add imported data to categories
    setCategories([...categories, ...importPreviewData]);

    // Reset and close modal
    setShowImportModal(false);
    setImportFile(null);
    setImportPreviewData([]);
    setImportErrors([]);

    // Show success notification
    setShowSuccessNotification(true);
    setTimeout(() => setShowSuccessNotification(false), 3000);
  };

  const handleCancelImport = () => {
    setShowImportModal(false);
    setImportFile(null);
    setImportPreviewData([]);
    setImportErrors([]);
  };

  const isAnyModalOpen = !!(
    showArchiveModal || showAddModal || showEditModal || showDetailModal ||
    showAddFieldModal || showCreateVersionModal || showFieldFormModal ||
    showImportModal || showApprovalDetailModal || showApprovalRequestModal ||
    showApprovalModal || showRejectModal || showCompareModal ||
    showVersionDetailModal || showRestoreModal ||
    showPublishModal || showUnpublishModal
  );

  return (
    <div className="space-y-4">
      {/* Tab bar — matches CategorySetupPage style */}
      <div className="bg-white border-b border-slate-200">
        <div className="flex px-6 gap-2">
          {[
            { id: 'setup' as const,           label: 'Dữ liệu',   icon: List },
            { id: 'approval' as const,         label: 'Phê duyệt', icon: CheckCircle2 },
            { id: 'publish' as const,          label: 'Công khai',  icon: Globe },
            { id: 'version-history' as const,  label: 'Phiên bản',  icon: Clock },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-[13px] font-medium transition-all border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
          {activeTab === 'setup' && (
            <div className="space-y-3">

              {/* Search & Action Bar */}
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <div className="flex-1 w-full flex items-center gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Tìm kiếm theo mã, tên danh mục..."
                        value={searchTerm}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => { setSearchTerm(e.target.value); setCurrentPageNum(1); }}
                        className="w-full px-4 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 bg-white hover:bg-slate-50/50 font-medium shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    {/* Lọc button */}
                    <button
                      type="button"
                      onClick={() => { setShowFilters(!showFilters); setShowSortPanel(false); }}
                      className={`flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium border rounded-xl transition-all cursor-pointer active:scale-95 ${
                        showFilters ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Filter className="w-4 h-4" />
                      Lọc{filterConditions.length > 0 && !showFilters ? <span className="ml-1 w-2 h-2 rounded-full bg-blue-500 inline-block" /> : null}
                    </button>
                    {/* Sắp xếp button */}
                    <button
                      type="button"
                      onClick={() => { setShowSortPanel(!showSortPanel); setShowFilters(false); }}
                      className={`flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium border rounded-xl transition-all cursor-pointer active:scale-95 ${
                        showSortPanel ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <ArrowUpDown className="w-4 h-4" />
                      Sắp xếp{sortConditions.length > 0 && !showSortPanel ? <span className="ml-1 w-2 h-2 rounded-full bg-blue-500 inline-block" /> : null}
                    </button>
                    {/* Gửi duyệt phiên bản */}
                    <button
                      type="button"
                      onClick={() => selectedRecordIds.length > 0 && setShowApprovalRequestModal(true)}
                      disabled={selectedRecordIds.length === 0}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all active:scale-95 whitespace-nowrap ${
                        selectedRecordIds.length > 0
                          ? 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 cursor-pointer'
                          : 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                      Gửi duyệt
                    </button>
                    {/* Thêm bản ghi mới */}
                    <button
                      type="button"
                      onClick={() => { setEditingRecord(null); setShowAddModal(true); }}
                      className="flex-1 md:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[13px] font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm whitespace-nowrap cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm bản ghi mới
                    </button>
                  </div>
                </div>

                {/* Collapsible Filter Panel — condition-based like CSDL đích */}
                {showFilters && (
                  <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <div className="flex flex-col gap-3">
                      {filterConditions.map((fc, i) => (
                        <div key={fc.id} className="flex items-center gap-3">
                          {i > 0 && (
                            <select
                              value={fc.logic}
                              onChange={e => {
                                const updated = [...filterConditions];
                                updated[i] = { ...updated[i], logic: e.target.value as 'AND' | 'OR' };
                                setFilterConditions(updated);
                              }}
                              className="px-3 py-1.5 border border-slate-300 rounded text-[13px] w-24 focus:outline-none focus:border-blue-500 bg-white"
                            >
                              <option value="AND">AND</option>
                              <option value="OR">OR</option>
                            </select>
                          )}
                          <select
                            value={fc.field}
                            onChange={e => {
                              const updated = [...filterConditions];
                              updated[i] = { ...updated[i], field: e.target.value };
                              setFilterConditions(updated);
                            }}
                            className={`px-3 py-1.5 border border-slate-300 rounded text-[13px] focus:outline-none focus:border-blue-500 bg-white ${i === 0 ? 'flex-1 max-w-xs' : 'flex-1 max-w-[210px]'}`}
                          >
                            <option value="code">Mã</option>
                            <option value="name">Tên giá trị</option>
                            <option value="description">Mô tả</option>
                            <option value="status">Trạng thái</option>
                            <option value="createdDate">Ngày tạo</option>
                            <option value="createdBy">Người tạo</option>
                            <option value="updatedDate">Ngày cập nhật</option>
                            <option value="updatedBy">Người cập nhật</option>
                          </select>
                          <select
                            value={fc.operator}
                            onChange={e => {
                              const updated = [...filterConditions];
                              updated[i] = { ...updated[i], operator: e.target.value };
                              setFilterConditions(updated);
                            }}
                            className="px-3 py-1.5 border border-slate-300 rounded text-[13px] w-40 focus:outline-none focus:border-blue-500 bg-white"
                          >
                            <option value="=">Bằng (=)</option>
                            <option value="!=">Khác (!=)</option>
                            <option value="LIKE">Chứa</option>
                            <option value=">">Lớn hơn (&gt;)</option>
                            <option value="<">Nhỏ hơn (&lt;)</option>
                          </select>
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              value={fc.value}
                              onChange={e => {
                                const updated = [...filterConditions];
                                updated[i] = { ...updated[i], value: e.target.value };
                                setFilterConditions(updated);
                                setCurrentPageNum(1);
                              }}
                              placeholder="&lt;?&gt;"
                              className="w-full px-3 py-1.5 border border-slate-300 rounded text-[13px] focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <button
                            onClick={() => {
                              const newF = filterConditions.filter(item => item.id !== fc.id);
                              setFilterConditions(newF);
                              setCurrentPageNum(1);
                            }}
                            className="p-1.5 border border-red-200 bg-red-50 text-red-500 rounded hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => { setFilterConditions(prev => [...prev, { id: Date.now().toString(), field: 'code', operator: '=', value: '', logic: 'AND' }]); setCurrentPageNum(1); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 text-blue-600 rounded text-[13px] font-medium hover:bg-blue-50 bg-white transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" /> Thêm điều kiện
                        </button>
                        <button
                          onClick={() => { setFilterConditions([]); setCurrentPageNum(1); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 rounded text-[13px] font-medium hover:bg-slate-50 bg-white transition-colors"
                        >
                          <X className="w-3.5 h-3.5" /> Xóa bộ lọc
                        </button>
                      </div>
                      {filterConditions.length === 0 && (
                        <p className="text-[13px] text-slate-400 italic">Chưa có điều kiện lọc. Nhấn "Thêm điều kiện" để bắt đầu.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Sort Panel */}
                {showSortPanel && (
                  <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <div className="flex flex-col gap-3">
                      {sortConditions.map((sc, i) => (
                        <div key={sc.id} className="flex items-center gap-3">
                          {i > 0 && (
                            <span className="text-[12px] text-slate-400 font-medium w-8 text-right shrink-0">rồi</span>
                          )}
                          {i === 0 && (
                            <span className="text-[12px] text-slate-500 font-semibold w-8 text-right shrink-0">Theo</span>
                          )}
                          <select
                            value={sc.field}
                            onChange={e => {
                              const updated = [...sortConditions];
                              updated[i] = { ...updated[i], field: e.target.value as SortCondition['field'] };
                              setSortConditions(updated);
                            }}
                            className="flex-1 max-w-xs px-3 py-1.5 border border-slate-300 rounded text-[13px] focus:outline-none focus:border-blue-500 bg-white"
                          >
                            <option value="name">Tên giá trị</option>
                            <option value="code">Mã</option>
                            <option value="createdDate">Ngày tạo</option>
                            <option value="updatedDate">Ngày cập nhật</option>
                          </select>
                          <select
                            value={sc.order}
                            onChange={e => {
                              const updated = [...sortConditions];
                              updated[i] = { ...updated[i], order: e.target.value as 'ASC' | 'DESC' };
                              setSortConditions(updated);
                            }}
                            className="px-3 py-1.5 border border-slate-300 rounded text-[13px] w-44 focus:outline-none focus:border-blue-500 bg-white"
                          >
                            <option value="ASC">Tăng dần (A → Z)</option>
                            <option value="DESC">Giảm dần (Z → A)</option>
                          </select>
                          <button
                            onClick={() => setSortConditions(prev => prev.filter(s => s.id !== sc.id))}
                            className="p-1.5 border border-red-200 bg-red-50 text-red-500 rounded hover:bg-red-100 transition-colors"
                            title="Xóa điều kiện"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => setSortConditions(prev => [...prev, { id: Date.now().toString(), field: 'name', order: 'ASC' }])}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 text-blue-600 rounded text-[13px] font-medium hover:bg-blue-50 bg-white transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" /> Thêm điều kiện
                        </button>
                        <button
                          onClick={() => setSortConditions([])}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 rounded text-[13px] font-medium hover:bg-slate-50 bg-white transition-colors"
                        >
                          <X className="w-3.5 h-3.5" /> Xóa bộ lọc
                        </button>
                      </div>
                      {sortConditions.length === 0 && (
                        <p className="text-[13px] text-slate-400 italic">Chưa có điều kiện sắp xếp. Nhấn "Thêm điều kiện" để bắt đầu.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Grid Table + Pagination */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-4 w-10 text-center">
                          <input
                            type="checkbox"
                            title="Chọn tất cả bản ghi bản nháp"
                            checked={
                              paginatedCategories.filter(c => c.status === 'draft').length > 0 &&
                              paginatedCategories.filter(c => c.status === 'draft').every(c => selectedRecordIds.includes(c.id))
                            }
                            onChange={(e) => {
                              const draftIds = paginatedCategories.filter(c => c.status === 'draft').map(c => c.id);
                              if (e.target.checked) {
                                setSelectedRecordIds(prev => [...new Set([...prev, ...draftIds])]);
                              } else {
                                setSelectedRecordIds(prev => prev.filter(id => !draftIds.includes(id)));
                              }
                            }}
                            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                          />
                        </th>
                        <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap w-14 text-center">STT</th>
                        <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Mã</th>
                        <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Tên giá trị</th>
                        <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Mô tả</th>
                        <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center">Trạng thái</th>
                        <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Ngày tạo</th>
                        <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Người tạo</th>
                        <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Ngày cập nhật</th>
                        <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Người cập nhật</th>
                        <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-center w-32">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {paginatedCategories.length > 0 || addingRow ? (
                        <>
                          {paginatedCategories.map((category, index) => {
                            const isEditing = editingRowId === category.id;
                            return (
                              <tr key={category.id} className={`hover:bg-slate-50/50 transition-all group border-b border-slate-100 ${isEditing ? 'bg-blue-50/10' : ''} ${selectedRecordIds.includes(category.id) ? 'bg-blue-50/30' : ''}`}>
                                <td className="px-4 py-4 text-center">
                                  {category.status === 'draft' ? (
                                    <input
                                      type="checkbox"
                                      title="Chọn bản ghi"
                                      checked={selectedRecordIds.includes(category.id)}
                                      onChange={(e) => {
                                        if (e.target.checked) setSelectedRecordIds(prev => [...prev, category.id]);
                                        else setSelectedRecordIds(prev => prev.filter(id => id !== category.id));
                                      }}
                                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                    />
                                  ) : <span className="w-4 h-4 inline-block" />}
                                </td>
                                <td className="px-6 py-4 text-[13px] text-slate-500 text-center">{(currentPageNum - 1) * pageSize + index + 1}</td>
                                <td className="px-6 py-4">
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      title="Mã"
                                      value={inlineEditData.code}
                                      onChange={(e) => setInlineEditData({ ...inlineEditData, code: e.target.value })}
                                      className="w-full px-2 py-1 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-mono"
                                      placeholder="Nhập mã"
                                    />
                                  ) : (
                                    <span className="text-[13px] font-mono text-slate-700">
                                      {category.code}
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      title="Tên giá trị"
                                      value={inlineEditData.name}
                                      onChange={(e) => setInlineEditData({ ...inlineEditData, name: e.target.value })}
                                      className="w-full px-2 py-1 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                      placeholder="Nhập tên giá trị"
                                    />
                                  ) : (
                                    <div className="text-[13px] text-slate-900 font-normal">{category.name}</div>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-[13px] text-slate-600 font-normal">
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      title="Mô tả"
                                      value={inlineEditData.description}
                                      onChange={(e) => setInlineEditData({ ...inlineEditData, description: e.target.value })}
                                      className="w-full px-2 py-1 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                      placeholder="Nhập mô tả"
                                    />
                                  ) : (
                                    category.description
                                  )}
                                </td>
                                <td className="px-6 py-4 text-center">
                                  {getStatusBadge(category.status)}
                                </td>
                                <td className="px-6 py-4 text-[13px] text-slate-600 font-normal">
                                  {category.createdDate}
                                </td>
                                <td className="px-6 py-4 text-[13px] text-slate-600 font-normal">
                                  {category.createdBy || '—'}
                                </td>
                                <td className="px-6 py-4 text-[13px] text-slate-600 font-normal">
                                  {category.updatedDate || '—'}
                                </td>
                                <td className="px-6 py-4 text-[13px] text-slate-600 font-normal">
                                  {category.updatedBy || '—'}
                                </td>
                                <td className="px-6 py-4 text-center">
                                  {isEditing ? (
                                    <div className="flex items-center justify-center gap-1.5">
                                      <button
                                        onClick={() => handleSaveInlineEdit(category.id)}
                                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                        title="Lưu"
                                      >
                                        <Check className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => setEditingRowId(null)}
                                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                        title="Hủy"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 transition-all">
                                      <button
                                        onClick={() => { setEditingRecord(category); setShowEditModal(true); }}
                                        className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                        title="Chỉnh sửa"
                                      >
                                        <SquarePen className="w-4 h-4" />
                                      </button>
                                      <button
                                        disabled={category.status !== 'approved'}
                                        onClick={() => { setSelectedCategory(category); setShowArchiveModal(true); }}
                                        className={`p-1.5 rounded-lg transition-colors ${category.status === 'approved' ? 'text-slate-500 hover:text-orange-600 hover:bg-orange-50 cursor-pointer' : 'text-slate-300 cursor-not-allowed'}`}
                                        title={category.status === 'approved' ? 'Ngừng áp dụng bản ghi' : 'Chỉ có thể ngừng áp dụng bản ghi đã phê duyệt'}
                                      >
                                        <PowerOff className="w-4 h-4" />
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                          {addingRow && (
                            <tr className="bg-blue-50/20 border-b border-slate-100">
                              <td className="px-4 py-4" />
                              <td className="px-6 py-4 text-[13px] text-slate-500 text-center">{(currentPageNum - 1) * pageSize + paginatedCategories.length + 1}</td>
                              <td className="px-6 py-4">
                                <input
                                  type="text"
                                  title="Mã"
                                  value={inlineAddData.code}
                                  onChange={(e) => setInlineAddData({ ...inlineAddData, code: e.target.value })}
                                  className="w-full px-2 py-1 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-mono"
                                  placeholder="Mã *"
                                />
                              </td>
                              <td className="px-6 py-4">
                                <input
                                  type="text"
                                  title="Tên giá trị"
                                  value={inlineAddData.name}
                                  onChange={(e) => setInlineAddData({ ...inlineAddData, name: e.target.value })}
                                  className="w-full px-2 py-1 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                  placeholder="Tên giá trị *"
                                />
                              </td>
                              <td className="px-6 py-4">
                                <input
                                  type="text"
                                  title="Mô tả"
                                  value={inlineAddData.description}
                                  onChange={(e) => setInlineAddData({ ...inlineAddData, description: e.target.value })}
                                  className="w-full px-2 py-1 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                  placeholder="Mô tả"
                                />
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className="px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs rounded-full whitespace-nowrap">Chờ phê duyệt</span>
                              </td>
                              <td className="px-6 py-4 text-[13px] text-slate-400 italic">
                                Tự động
                              </td>
                              <td className="px-6 py-4 text-[13px] text-slate-400 italic">
                                Nguyễn Văn A
                              </td>
                              <td className="px-6 py-4 text-[13px] text-slate-400 italic">
                                Tự động
                              </td>
                              <td className="px-6 py-4 text-[13px] text-slate-400 italic">
                                Nguyễn Văn A
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={handleSaveInlineAdd}
                                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                    title="Lưu"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setAddingRow(false)}
                                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                    title="Hủy"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ) : (
                        <tr>
                          <td colSpan={10} className="px-6 py-8 text-center text-[13px] text-slate-400 italic">Không tìm thấy dữ liệu</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {renderPagination(filteredCategories.length)}
              </div>
            </div>
          )}

          {activeTab === 'approval' && (
            <div className="space-y-6">

              {activeApprovalTab === 'data-change' && (
                <div className="flex items-center justify-between">
                  <div>
                     <h3 className="text-[18px] font-semibold text-slate-900">Phê duyệt danh mục cập nhật</h3>
                    <p className="text-[13px] text-slate-500 mt-1">Quản lý các yêu cầu phê duyệt cập nhật danh mục</p>
                  </div>
                  {selectedApprovalIds.length > 0 && (
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] text-slate-600">
                        Đã chọn: <span className="font-medium text-blue-600">{selectedApprovalIds.length}</span> yêu cầu
                      </span>
                      <button
                        onClick={handleBulkApprove}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-[13px]"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Phê duyệt hàng loạt
                      </button>
                      <button
                        onClick={handleBulkReject}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-[13px]"
                      >
                        <XCircle className="w-4 h-4" />
                        Từ chối hàng loạt
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-orange-700">Chờ phê duyệt</p>
                      <p className="text-2xl text-orange-900">{approvalStats.pending}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-green-700">Đã phê duyệt</p>
                      <p className="text-2xl text-green-900">{approvalStats.approved}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-red-700">Đã từ chối</p>
                      <p className="text-2xl text-red-900">{approvalStats.rejected}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Edit2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-700">Tổng yêu cầu</p>
                      <p className="text-2xl text-blue-900">{approvalStats.total}</p>
                    </div>
                  </div>
                </div>
              </div>

              {activeApprovalTab === 'data-change' && (
                <>
                  {/* Filters */}
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      title="Tìm kiếm bản ghi phê duyệt"
                      placeholder="Tìm kiếm theo mã, tên bản ghi..."
                      value={searchTerm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {[
                      { value: 'all', label: 'Tất cả', activeClass: 'bg-slate-700 text-white border-slate-700' },
                      { value: 'pending', label: 'Chờ phê duyệt', activeClass: 'bg-orange-500 text-white border-orange-500' },
                      { value: 'approved', label: 'Đã phê duyệt', activeClass: 'bg-green-600 text-white border-green-600' },
                      { value: 'rejected', label: 'Đã từ chối', activeClass: 'bg-red-500 text-white border-red-500' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setApprovalStatusFilter(opt.value)}
                        className={`px-3 py-2 text-[13px] rounded-lg border transition-all font-medium cursor-pointer ${
                          approvalStatusFilter === opt.value
                            ? opt.activeClass
                            : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            title="Chọn tất cả"
                            checked={selectedApprovalIds.length === filteredApprovalRequests.filter(r => r.status === 'pending').length && filteredApprovalRequests.filter(r => r.status === 'pending').length > 0}
                            onChange={toggleSelectAllApprovals}
                            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-[13px] font-medium text-slate-600">STT</th>
                        <th className="px-6 py-3 text-left text-[13px] font-medium text-slate-600">Mã bản ghi</th>
                        <th className="px-6 py-3 text-left text-[13px] font-medium text-slate-600">Tên bản ghi</th>
                        <th className="px-6 py-3 text-left text-[13px] font-medium text-slate-600">Mô tả</th>
                        <th className="px-6 py-3 text-left text-[13px] font-medium text-slate-600">Ngày tạo</th>
                        <th className="px-6 py-3 text-left text-[13px] font-medium text-slate-600">Người tạo</th>
                        <th className="px-6 py-3 text-left text-[13px] font-medium text-slate-600">Người cập nhật</th>
                        <th className="px-6 py-3 text-left text-[13px] font-medium text-slate-600">Ngày cập nhật</th>
                        <th className="px-6 py-3 text-left text-[13px] font-medium text-slate-600">Trạng thái</th>
                        <th className="px-6 py-3 text-left text-[13px] font-medium text-slate-600">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApprovalRequests.map((request, index) => (
                        <tr key={request.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-4 py-4">
                            {request.status === 'pending' && (
                              <input
                                type="checkbox"
                                title="Chọn bản ghi"
                                checked={selectedApprovalIds.includes(request.id)}
                                onChange={() => toggleSelectApproval(request.id)}
                                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                              />
                            )}
                          </td>
                          <td className="px-6 py-3 text-[13px] text-slate-900">{index + 1}</td>
                          <td className="px-6 py-3 text-[13px] text-slate-700">
                            {request.recordCode}
                          </td>
                          <td className="px-6 py-3">
                            <div className="text-[13px] text-slate-900">{request.recordName}</div>
                          </td>
                          <td className="px-6 py-3 text-[13px] text-slate-600">
                            {request.description || '—'}
                          </td>
                          <td className="px-6 py-3 text-[13px] text-slate-600">{request.createdDate}</td>
                          <td className="px-6 py-3 text-[13px] text-slate-600">{request.createdBy}</td>
                          <td className="px-6 py-3 text-[13px] text-slate-600">{request.changedBy}</td>
                          <td className="px-6 py-3 text-[13px] text-slate-600">{request.changedDate}</td>
                          <td className="px-6 py-3 whitespace-nowrap">{getApprovalStatusBadge(request.status)}</td>
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleViewApprovalDetail(request)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                                title="Xem chi tiết"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => request.status === 'pending' && handleApprove(request.id)}
                                disabled={request.status !== 'pending'}
                                className={`p-1 rounded transition-colors ${
                                  request.status === 'pending'
                                    ? 'text-green-600 hover:bg-green-50 cursor-pointer'
                                    : 'text-slate-300 cursor-not-allowed'
                                }`}
                                title={request.status === 'pending' ? "Phê duyệt" : "Đã xử lý"}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => request.status === 'pending' && handleReject(request.id)}
                                disabled={request.status !== 'pending'}
                                className={`p-1 rounded transition-colors ${
                                  request.status === 'pending'
                                    ? 'text-red-600 hover:bg-red-50 cursor-pointer'
                                    : 'text-slate-300 cursor-not-allowed'
                                }`}
                                title={request.status === 'pending' ? "Từ chối" : "Đã xử lý"}
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              </>
              )}

              {activeApprovalTab === 'unpublish' && (
                <>
                  {/* Phê duyệt hủy công khai danh mục */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg text-slate-900">Phê duyệt hủy công khai danh mục</h3>
                      <p className="text-sm text-slate-500 mt-1">Quản lý các yêu cầu ngừng áp dụng (hủy công khai) danh mục</p>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-12">STT</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Mã danh mục</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tên danh mục</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Lý do hủy</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Người yêu cầu</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Thời gian yêu cầu</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider w-32">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {filteredUnpublishRequests.map((request, index) => (
                            <tr key={request.id} className="hover:bg-slate-50">
                              <td className="px-4 py-3 text-sm text-slate-900">{index + 1}</td>
                              <td className="px-4 py-3 text-sm text-blue-600 font-medium">
                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md">
                                  {request.categoryCode}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-slate-900 font-medium">{request.categoryName}</td>
                              <td className="px-4 py-3 text-sm text-slate-600">{request.reason}</td>
                              <td className="px-4 py-3 text-sm text-slate-900">{request.requestedBy}</td>
                              <td className="px-4 py-3 text-sm text-slate-600">{request.requestedDate}</td>
                              <td className="px-4 py-3">
                                {request.status === 'pending' && (
                                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Chờ duyệt</span>
                                )}
                                {request.status === 'approved' && (
                                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Đã duyệt</span>
                                )}
                                {request.status === 'rejected' && (
                                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Từ chối</span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center justify-center gap-2">
                                  {request.status === 'pending' && (
                                    <>
                                      <button
                                        onClick={() => {
                                          setSuccessNotificationMessage('Đã duyệt yêu cầu hủy công khai thành công!');
                                          setShowSuccessNotification(true);
                                          setTimeout(() => setShowSuccessNotification(false), 3000);
                                        }}
                                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                                        title="Phê duyệt"
                                      >
                                        <CheckCircle2 className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => alert('Đã từ chối yêu cầu hủy công khai')}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                        title="Từ chối"
                                      >
                                        <XCircle className="w-4 h-4" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

      {activeTab === 'publish' && (
        <div className="space-y-6">
          {/* Banner trạng thái công khai */}
          <div className={`p-6 rounded-xl border flex items-center justify-between shadow-sm transition-all ${
            publishStatus === 'published'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : publishStatus === 'stopped'
              ? 'bg-red-50 border-red-200 text-red-950'
              : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                publishStatus === 'published' ? 'bg-emerald-500 text-white' : publishStatus === 'stopped' ? 'bg-red-500 text-white' : 'bg-slate-300 text-slate-600'
              }`}>
                {publishStatus === 'published' ? <Globe className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="font-bold text-[14px]">
                  Trạng thái: {publishStatus === 'published' ? 'ĐÃ CÔNG KHAI' : publishStatus === 'stopped' ? 'NGỪNG CÔNG KHAI' : 'CHƯA CÔNG KHAI'}
                </h4>
                <p className="text-[13px] text-slate-500 mt-1">
                  {publishStatus === 'published' && (
                    <>
                      Phạm vi chia sẻ: <strong>{shareScope === 'internal' ? 'Nội bộ' : shareScope === 'extended' ? 'Mở rộng' : 'Toàn dân'}</strong> | Người thực hiện: <strong>{publishActionInfo.user}</strong> | Ngày thực hiện: <strong>{publishActionInfo.date}</strong>
                    </>
                  )}
                  {publishStatus === 'stopped' && (
                    <>
                      Người thực hiện: <strong>{publishActionInfo.user}</strong> | Ngày thực hiện: <strong>{publishActionInfo.date}</strong> | Lý do: <span className="italic text-red-700 font-medium">"{publishActionInfo.reason || '—'}"</span>
                    </>
                  )}
                  {publishStatus === 'unpublished' && (
                    'Danh mục này hiện chưa được công khai ra ngoài hệ thống.'
                  )}
                </p>
              </div>
            </div>
            <div>
              {publishStatus === 'published' ? (
                <button
                  onClick={() => setShowUnpublishModal(true)}
                  className="px-4 py-2 border border-red-200 bg-white text-red-600 rounded-lg hover:bg-red-50 font-medium text-[13px] transition-colors cursor-pointer active:scale-95 flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Hủy công khai
                </button>
              ) : (
                <button
                  onClick={() => setShowPublishModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-[13px] transition-colors cursor-pointer active:scale-95 flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  Công khai
                </button>
              )}
            </div>
          </div>

          {/* Tiêu đề phần danh sách */}
          <div>
            <h3 className="text-lg text-slate-900 font-semibold">Các trường dữ liệu của danh mục</h3>
            <p className="text-sm text-slate-500 mt-1">Danh sách giá trị dữ liệu hiện có trong danh mục hệ thống</p>
          </div>

          {/* Table hiển thị dữ liệu không cần cột thao tác */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-slate-700 whitespace-nowrap">STT</th>
                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-slate-700 whitespace-nowrap">Mã</th>
                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-slate-700 whitespace-nowrap">Tên giá trị</th>
                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-slate-700 whitespace-nowrap">Mô tả</th>
                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-slate-700 whitespace-nowrap">Trạng thái</th>
                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-slate-700 whitespace-nowrap">Ngày tạo</th>
                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-slate-700 whitespace-nowrap">Người tạo</th>
                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-slate-700 whitespace-nowrap">Ngày cập nhật</th>
                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-slate-700 whitespace-nowrap">Người cập nhật</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categories.map((cat, idx) => (
                    <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-900">{idx + 1}</td>
                      <td className="px-6 py-4 text-sm">
                        <code className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                          {cat.code}
                        </code>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 font-medium">{cat.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{cat.description || '—'}</td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">{getStatusBadge(cat.status)}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{cat.createdDate}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{cat.createdBy || '—'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{cat.updatedDate || '—'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{cat.updatedBy || '—'}</td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-6 py-8 text-center text-[13px] text-slate-400 italic">Không tìm thấy dữ liệu</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

        </div>

      {/* Add/Edit Modal */}

      {/* Create Version Modal */}
      <CreateVersionModal
        isOpen={showCreateVersionModal}
        onClose={() => setShowCreateVersionModal(false)}
        currentVersion="v3.2"
        onSave={(data: any) => {
          setShowCreateVersionModal(false);
          setSuccessNotificationMessage('Đã tạo phiên bản mới ' + data.name + ' thành công!');
          setShowSuccessNotification(true);
          setTimeout(() => setShowSuccessNotification(false), 3000);
        }}
      />

      {showPublishModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden transform scale-100 transition-all">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                Công khai danh mục
              </h3>
              <button
                onClick={() => setShowPublishModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title="Đóng"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-[13px]">
              <p className="text-slate-600 font-medium leading-relaxed">
                Vui lòng lựa chọn phạm vi chia sẻ (phân quyền công khai) cho danh mục <strong>{categoryName}</strong>:
              </p>
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                  <input
                    type="radio"
                    name="shareScope"
                    checked={shareScope === 'internal'}
                    onChange={() => setShareScope('internal')}
                    className="mt-0.5 w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <div>
                    <strong className="block text-slate-800">Nội bộ</strong>
                    <span className="text-slate-500 text-[12px] mt-0.5 block">Dữ liệu chỉ được chia sẻ và sử dụng trong nội bộ đơn vị, cơ quan.</span>
                  </div>
                </label>
                
                <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                  <input
                    type="radio"
                    name="shareScope"
                    checked={shareScope === 'extended'}
                    onChange={() => setShareScope('extended')}
                    className="mt-0.5 w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <div>
                    <strong className="block text-slate-800">Mở rộng</strong>
                    <span className="text-slate-500 text-[12px] mt-0.5 block">Chia sẻ cho các đơn vị liên kết, cơ quan thuộc Bộ Tư pháp.</span>
                  </div>
                </label>
                
                <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                  <input
                    type="radio"
                    name="shareScope"
                    checked={shareScope === 'public'}
                    onChange={() => setShareScope('public')}
                    className="mt-0.5 w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <div>
                    <strong className="block text-slate-800">Toàn dân</strong>
                    <span className="text-slate-500 text-[12px] mt-0.5 block">Dữ liệu mở, cho phép mọi người dân và doanh nghiệp khai thác tự do.</span>
                  </div>
                </label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setShowPublishModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium text-[13px] transition-colors cursor-pointer active:scale-95"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  setPublishStatus('published');
                  setPublishActionInfo({
                    user: 'Nguyễn Văn A',
                    date: new Date().toLocaleDateString('vi-VN')
                  });
                  setShowPublishModal(false);
                  setSuccessNotificationMessage(`Công khai danh mục thành công với phạm vi: ${shareScope === 'internal' ? 'Nội bộ' : shareScope === 'extended' ? 'Mở rộng' : 'Toàn dân'}`);
                  setShowSuccessNotification(true);
                  setTimeout(() => setShowSuccessNotification(false), 3000);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-[13px] transition-colors cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {showUnpublishModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden transform scale-100 transition-all">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-red-700 uppercase tracking-wider flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                Hủy công khai danh mục
              </h3>
              <button
                onClick={() => {
                  setShowUnpublishModal(false);
                  setUnpublishReason('');
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title="Đóng"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-[13px]">
              <p className="text-slate-600 font-medium leading-relaxed">
                Bạn có chắc chắn muốn hủy công khai danh mục <strong>{categoryName}</strong>? Vui lòng nhập lý do hủy công khai:
              </p>
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Lý do hủy công khai <span className="text-red-500">*</span></label>
                <textarea
                  title="Lý do hủy công khai"
                  value={unpublishReason}
                  onChange={(e) => setUnpublishReason(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Nhập lý do chi tiết..."
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowUnpublishModal(false);
                  setUnpublishReason('');
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-medium text-[13px] transition-colors cursor-pointer active:scale-95"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  if (!unpublishReason.trim()) {
                    alert('Vui lòng nhập lý do hủy công khai!');
                    return;
                  }
                  setPublishStatus('stopped');
                  setPublishActionInfo({
                    user: 'Nguyễn Văn A',
                    date: new Date().toLocaleDateString('vi-VN'),
                    reason: unpublishReason
                  });
                  setShowUnpublishModal(false);
                  setSuccessNotificationMessage(`Đã hủy công khai danh mục thành công!`);
                  setShowSuccessNotification(true);
                  setTimeout(() => setShowSuccessNotification(false), 3000);
                  setUnpublishReason('');
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-[13px] transition-colors cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Modal */}
      {showArchiveModal && selectedCategory && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <PowerOff className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg text-slate-900">Ngừng áp dụng bản ghi</h3>
                  <p className="text-sm text-slate-500">Yêu cầu ngừng áp dụng bản ghi {selectedCategory.name}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowArchiveModal(false);
                  setSelectedCategory(null);
                  setArchiveRequestData({ reason: '', approver: '' });
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-800">
                    Bản ghi ngừng áp dụng sẽ không được sử dụng ở các màn hình nhập liệu khác, nhưng vẫn giữ lại trong lịch sử dữ liệu.
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-slate-700 mb-1">
                  Người phê duyệt <span className="text-red-500">*</span>
                </label>
                <select
                  title="Người phê duyệt"
                  value={archiveRequestData.approver}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setArchiveRequestData({ ...archiveRequestData, approver: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn người phê duyệt</option>
                  {approvers.map((approver) => (
                    <option key={approver.id} value={approver.id}>
                      {approver.name} - {approver.role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1">
                  Nội dung sao ngừng (Lý do) <span className="text-red-500">*</span>
                </label>
                <textarea
                  title="Lý do ngừng áp dụng"
                  value={archiveRequestData.reason}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setArchiveRequestData({ ...archiveRequestData, reason: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập lý do ngừng áp dụng bản ghi..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowArchiveModal(false);
                  setSelectedCategory(null);
                  setArchiveRequestData({ reason: '', approver: '' });
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  if (!archiveRequestData.approver || !archiveRequestData.reason.trim()) {
                    alert('Vui lòng chọn người phê duyệt và nhập lý do ngừng áp dụng!');
                    return;
                  }
                  
                  const selectedApprover = approvers.find(a => a.id === archiveRequestData.approver);
                  setCategories(prev => prev.map(c =>
                    c.id === selectedCategory.id ? { ...c, status: 'pending' as const } : c
                  ));
                  setSuccessNotificationMessage(`Đã gửi yêu cầu ngừng áp dụng đến ${selectedApprover?.name} — bản ghi chuyển sang Chờ phê duyệt`);
                  setShowSuccessNotification(true);
                  setTimeout(() => setShowSuccessNotification(false), 3000);

                  setShowArchiveModal(false);
                  setSelectedCategory(null);
                  setArchiveRequestData({ reason: '', approver: '' });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Send className="w-4 h-4" />
                Gửi phê duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      <RecordFormModal
        isOpen={showAddModal && !editingRecord}
        onClose={() => setShowAddModal(false)}
        title="Thêm mới bản ghi"
        entityName={categoryName}
        entityCode={categoryId}
        onSave={(data) => {
          const currentDate = new Date().toLocaleDateString('vi-VN');
          const newCat: Category = {
            id: `cat-${Date.now()}`,
            code: data.code,
            name: data.name,
            description: data.description,
            type: 'standard',
            status: 'draft',
            createdDate: currentDate,
            createdBy: 'Nguyễn Văn A',
          };
          setCategories(prev => [...prev, newCat]);
          setVersionHistoryList(prev => [{
            version: getNextVersionLabel(),
            date: currentDate,
            effectiveDate: '',
            user: 'Nguyễn Văn A',
            changes: `Thêm bản ghi: ${data.name} (${data.code})`,
            status: 'pending'
          }, ...prev]);
          setShowAddModal(false);
          setSuccessNotificationMessage('Đã lưu bản ghi mới thành công!');
          setShowSuccessNotification(true);
          setTimeout(() => setShowSuccessNotification(false), 3000);
        }}
      />

      <RecordFormModal
        isOpen={showEditModal && !!editingRecord}
        onClose={() => { setShowEditModal(false); setEditingRecord(null); }}
        title="Chỉnh sửa bản ghi"
        initialData={editingRecord}
        entityName={categoryName}
        entityCode={categoryId}
        onSave={(data) => {
          const currentDate = new Date().toLocaleDateString('vi-VN');
          setCategories(prev => prev.map(c =>
            c.id === editingRecord?.id
              ? { ...c, code: data.code, name: data.name, description: data.description, status: 'draft' as const, updatedDate: currentDate, updatedBy: 'Nguyễn Văn A' }
              : c
          ));
          setVersionHistoryList(prev => [{
            version: getNextVersionLabel(),
            date: currentDate,
            effectiveDate: '',
            user: 'Nguyễn Văn A',
            changes: `Chỉnh sửa bản ghi: ${data.name} (${data.code})`,
            status: 'pending'
          }, ...prev]);
          setShowEditModal(false);
          setEditingRecord(null);
          setSuccessNotificationMessage('Đã lưu chỉnh sửa bản ghi thành công!');
          setShowSuccessNotification(true);
          setTimeout(() => setShowSuccessNotification(false), 3000);
        }}
      />

      {showApprovalRequestModal && (
        <UpdateApprovalModal
          isOpen={showApprovalRequestModal}
          onClose={() => setShowApprovalRequestModal(false)}
          approvers={[
            { id: '1', name: 'Nguyễn Văn A', position: 'Trưởng phòng', department: 'Phòng Quản lý dữ liệu' },
            { id: '2', name: 'Trần Thị B', position: 'Phó Giám đốc', department: 'Trung tâm CNTT' }
          ]}
          onSubmit={(_data) => {
            const ids = selectedRecordIds;
            setCategories(prev => prev.map(c => ids.includes(c.id) && c.status === 'draft' ? { ...c, status: 'pending' as const } : c));
            setSelectedRecordIds([]);
            setShowApprovalRequestModal(false);
            setSuccessNotificationMessage(`Đã gửi ${ids.length} bản ghi chờ phê duyệt thành công!`);
            setShowSuccessNotification(true);
            setTimeout(() => setShowSuccessNotification(false), 3000);
          }}
        />
      )}

      <ApprovalRequestModal
        isOpen={showBulkApproval}
        onClose={() => setShowBulkApproval(false)}
        data={{ id: '', code: categoryId, name: `${selectedRecordIds.length} bản ghi đã chọn`, type: 'category' }}
        approvers={[
          { id: '1', name: 'Nguyễn Văn A', position: 'Trưởng phòng', department: 'Phòng Quản lý dữ liệu' },
          { id: '2', name: 'Trần Thị B', position: 'Phó Giám đốc', department: 'Trung tâm CNTT' },
          { id: '3', name: 'Lê Minh C', position: 'Trưởng phòng Pháp chế', department: 'Vụ Pháp luật' },
          { id: '4', name: 'Phạm Văn D', position: 'Cục trưởng', department: 'Cục CNTT' }
        ]}
        form={bulkApprovalForm}
        setForm={setBulkApprovalForm}
        onSubmit={() => {
          setCategories(prev => prev.map(c =>
            selectedRecordIds.includes(c.id) ? { ...c, status: 'approved' as const } : c
          ));
          setSuccessNotificationMessage(`Đã gửi ${selectedRecordIds.length} bản ghi đến người phê duyệt thành công!`);
          setShowSuccessNotification(true);
          setTimeout(() => setShowSuccessNotification(false), 3000);
          setShowBulkApproval(false);
          setSelectedRecordIds([]);
          setBulkApprovalForm({ reviewer: '', note: '' });
        }}
      />

      {activeTab === 'version-history' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-800 text-[15px]">Danh sách phiên bản</h3>
             <p className="text-sm text-slate-500 mt-1">Quản lý, tra cứu và đóng băng các phiên bản của danh mục hệ thống</p>
          </div>
          {/* Version History Table */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Phiên bản</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Ngày thay đổi</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Ngày hiệu lực</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Người thay đổi</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Nội dung thay đổi</th>
                    <th className="px-4 py-3 text-left text-xs text-slate-600">Trạng thái</th>
                    <th className="px-4 py-3 text-center text-xs text-slate-600">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {versionHistoryList.map((history, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-slate-900">{history.version}</td>
                      <td className="px-4 py-3 text-sm text-slate-900">{history.date}</td>
                      <td className="px-4 py-3 text-sm text-slate-900">{history.effectiveDate}</td>
                      <td className="px-4 py-3 text-sm text-slate-900">{history.user}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{history.changes}</td>
                      <td className="px-4 py-3">
                        {history.status === 'active' && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-[13px] rounded-full">Hiệu lực</span>
                        )}
                        {history.status === 'archived' && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[13px] rounded-full">Hết hiệu lực</span>
                        )}
                        {history.status === 'pending' && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-[13px] rounded-full">Chờ phê duyệt</span>
                        )}
                        {history.status === 'locked' && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-[13px] rounded-full">Ngừng tham chiếu</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          {/* 1. Xem chi tiết */}
                          <button
                            onClick={() => {
                               setSelectedVersionData(history);
                               setShowVersionDetailModal(true);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* 3. Khóa / Mở khóa */}
                          {history.status === 'locked' ? (
                            <button
                              onClick={() => setVersionHistoryList(prev => prev.map((v, i) => i === index ? { ...v, status: 'archived' } : v))}
                              className="p-1 text-slate-500 hover:bg-slate-100 rounded cursor-pointer"
                              title="Mở tham chiếu"
                            >
                              <Unlock className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              disabled={history.status === 'active'}
                              onClick={() => setVersionHistoryList(prev => prev.map((v, i) => i === index ? { ...v, status: 'locked' } : v))}
                              className={`p-1 rounded ${history.status === 'active' ? 'text-slate-300 cursor-not-allowed' : 'text-orange-600 hover:bg-orange-50 cursor-pointer'}`}
                              title={history.status === 'active' ? 'Không thể khóa phiên bản đang hiệu lực' : 'Ngừng tham chiếu'}
                            >
                              <Lock className="w-4 h-4" />
                            </button>
                          )}

                          {/* 4. Tải xuống */}
                          <button
                            disabled={history.status === 'locked'}
                            onClick={() => alert('Đang tải xuống dữ liệu phiên bản ' + history.version)}
                            className={`p-1 rounded ${history.status === 'locked' ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-50 cursor-pointer'}`}
                            title={history.status === 'locked' ? 'Không thể tải xuống phiên bản đã ngừng tham chiếu' : 'Tải xuống'}
                          >
                            <Download className="w-4 h-4" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>


        </div>
      )}




      {/* Add Field Modal */}
      {showAddFieldModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4 animate-in fade-in duration-200"
          style={{ zIndex: 99999 }}
          onClick={() => setShowAddFieldModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg text-slate-900">Thêm trường dữ liệu mới</h3>
              <button title="Đóng" aria-label="Đóng"
                onClick={() => setShowAddFieldModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Tên trường *</label>
                  <input
                    type="text"
                    title="Tên trường"
                    value={newFieldData.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewFieldData({ ...newFieldData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên trường"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Kiểu dữ liệu *</label>
                  <select
                    title="Kiểu dữ liệu"
                    value={newFieldData.dataType}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewFieldData({ ...newFieldData, dataType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="TEXT">Text</option>
                    <option value="NUMBER">Number</option>
                    <option value="DATE">Date</option>
                    <option value="BOOLEAN">Boolean</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Bắt buộc *</label>
                  <select
                    title="Trường bắt buộc"
                    value={newFieldData.required ? 'true' : 'false'}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewFieldData({ ...newFieldData, required: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">Có</option>
                    <option value="false">Không</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Giá trị mặc định</label>
                  <input
                    type="text"
                    title="Giá trị mặc định"
                    value={newFieldData.defaultValue || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewFieldData({ ...newFieldData, defaultValue: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập giá trị mặc định"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button title="Đóng" aria-label="Đóng"
                onClick={() => setShowAddFieldModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  const currentDate = new Date().toLocaleDateString('vi-VN');
                  setNewCategoryFields([...newCategoryFields, { ...newFieldData, id: Date.now().toString() }]);
                  setVersionHistoryList(prev => [{
                    version: getNextVersionLabel(),
                    date: currentDate,
                    effectiveDate: '',
                    user: 'Nguyễn Văn A',
                    changes: `Thêm trường dữ liệu: ${newFieldData.name}`,
                    status: 'pending'
                  }, ...prev]);
                  setNewFieldData({ name: '', dataType: 'TEXT', required: false, defaultValue: '', maxLength: 255, description: '', isPrimaryKey: false, isForeignKey: false, referenceTable: '', referenceField: '' });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Thêm trường
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Field Form Modal */}
      {showFieldFormModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4 animate-in fade-in duration-200"
          style={{ zIndex: 99999 }}
          onClick={() => setShowFieldFormModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg text-slate-900">Thêm trường dữ liệu mới</h3>
              <button title="Đóng" aria-label="Đóng"
                onClick={() => setShowFieldFormModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Tên trường *</label>
                  <input
                    type="text"
                    title="Tên trường"
                    value={newFieldData.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setNewFieldData({ ...newFieldData, name: e.target.value });
                      if (fieldErrors.name) {
                        setFieldErrors({ ...fieldErrors, name: '' });
                      }
                    }}
                    className={`w-full px-3 py-2 border ${fieldErrors.name ? 'border-red-500' : 'border-slate-300'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Nhập tên trường"
                  />
                  {fieldErrors.name && (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Kiểu dữ liệu *</label>
                  <select
                    title="Kiểu dữ liệu"
                    value={newFieldData.dataType}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewFieldData({ ...newFieldData, dataType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="TEXT">Text</option>
                    <option value="NUMBER">Number</option>
                    <option value="DATE">Date</option>
                    <option value="BOOLEAN">Boolean</option>
                    <option value="EMAIL">Email</option>
                    <option value="URL">URL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Khóa chính</label>
                  <select
                    title="Khóa chính"
                    value={newFieldData.isPrimaryKey ? 'true' : 'false'}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      const isPrimary = e.target.value === 'true';
                      setNewFieldData({ ...newFieldData, isPrimaryKey: isPrimary });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="false">Không</option>
                    <option value="true">Có</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Bắt buộc *</label>
                  <select
                    title="Trường bắt buộc"
                    value={newFieldData.required ? 'true' : 'false'}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewFieldData({ ...newFieldData, required: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">Có</option>
                    <option value="false">Không</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Độ dài tối đa</label>
                  <input
                    type="number"
                    title="Độ dài tối đa"
                    value={newFieldData.maxLength || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewFieldData({ ...newFieldData, maxLength: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập độ dài tối đa"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1">Giá trị mặc định</label>
                <input
                  type="text"
                  title="Giá trị mặc định"
                  value={newFieldData.defaultValue || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewFieldData({ ...newFieldData, defaultValue: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập giá trị mặc định"
                />
              </div>

              {/* Foreign Key Section */}
              <div className="border-t border-slate-200 pt-4">
                <div className="mb-3">
                  <label className="block text-sm text-slate-700 mb-1">Khóa ngoại</label>
                  <select
                    title="Khóa ngoại"
                    value={newFieldData.isForeignKey ? 'true' : 'false'}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      const isForeign = e.target.value === 'true';
                      setNewFieldData({ ...newFieldData, isForeignKey: isForeign });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="false">Không</option>
                    <option value="true">Có</option>
                  </select>
                </div>

                {newFieldData.isForeignKey && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-700 mb-1">Bảng tham chiếu *</label>
                      <select
                        title="Bảng tham chiếu"
                        value={newFieldData.referenceTable || ''}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                          setNewFieldData({ ...newFieldData, referenceTable: e.target.value });
                          if (fieldErrors.referenceTable) {
                            setFieldErrors({ ...fieldErrors, referenceTable: '' });
                          }
                        }}
                        className={`w-full px-3 py-2 border ${fieldErrors.referenceTable ? 'border-red-500' : 'border-slate-300'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="">Chọn bảng</option>
                        <option value="danh_muc_a">Biên tập danh mục A</option>
                        <option value="danh_muc_b">Danh mục B</option>
                        <option value="danh_muc_c">Danh mục C</option>
                      </select>
                      {fieldErrors.referenceTable && (
                        <p className="text-xs text-red-600 mt-1">{fieldErrors.referenceTable}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-slate-700 mb-1">Trường tham chiếu *</label>
                      <select
                        title="Trường tham chiếu"
                        value={newFieldData.referenceField || ''}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                          setNewFieldData({ ...newFieldData, referenceField: e.target.value });
                          if (fieldErrors.referenceField) {
                            setFieldErrors({ ...fieldErrors, referenceField: '' });
                          }
                        }}
                        className={`w-full px-3 py-2 border ${fieldErrors.referenceField ? 'border-red-500' : 'border-slate-300'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="">Chọn trường</option>
                        <option value="id">ID</option>
                        <option value="ma_code">Mã Code</option>
                        <option value="ten">Tên</option>
                      </select>
                      {fieldErrors.referenceField && (
                        <p className="text-xs text-red-600 mt-1">{fieldErrors.referenceField}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1">Mô tả</label>
                <textarea
                  rows={3}
                  title="Mô tả"
                  value={newFieldData.description || ''}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewFieldData({ ...newFieldData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập mô tả về trường..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowFieldFormModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  // Validation
                  const errors: { [key: string]: string } = {};

                  // Kiểm tra tên trường bắt buộc
                  if (!newFieldData.name.trim()) {
                    errors.name = 'Tên trường không được để trống';
                  }

                  // Kiểm tra trùng tên trường (ngoại trừ trường đang sửa)
                  const isDuplicate = newCategoryFields.some((field, index) =>
                    field.name.toLowerCase() === newFieldData.name.toLowerCase() &&
                    index !== editingFieldIndex
                  );
                  if (isDuplicate) {
                    errors.name = 'Tên trường đã tồn tại';
                  }

                  // Kiểm tra khóa ngoại
                  if (newFieldData.isForeignKey) {
                    if (!newFieldData.referenceTable) {
                      errors.referenceTable = 'Vui lòng chọn bảng tham chiếu';
                    }
                    if (!newFieldData.referenceField) {
                      errors.referenceField = 'Vui lòng chọn trường tham chiếu';
                    }
                  }

                  if (Object.keys(errors).length > 0) {
                    setFieldErrors(errors);
                    return;
                  }

                  // Nếu đang đặt khóa chính, bỏ khóa chính của các trường khác
                  let fieldsToUpdate = [...newCategoryFields];
                  if (newFieldData.isPrimaryKey) {
                    fieldsToUpdate = fieldsToUpdate.map(f => ({ ...f, isPrimaryKey: false }));
                  }

                  const currentDate = new Date().toLocaleDateString('vi-VN');
                  const isEditing = editingFieldIndex !== null;
                  if (isEditing) {
                    fieldsToUpdate[editingFieldIndex] = { ...newFieldData, id: newCategoryFields[editingFieldIndex].id };
                    setNewCategoryFields(fieldsToUpdate);
                  } else {
                    setNewCategoryFields([...fieldsToUpdate, { ...newFieldData, id: Date.now().toString() }]);
                  }
                  setVersionHistoryList(prev => [{
                    version: getNextVersionLabel(),
                    date: currentDate,
                    effectiveDate: '',
                    user: 'Nguyễn Văn A',
                    changes: isEditing
                      ? `Chỉnh sửa trường dữ liệu: ${newFieldData.name}`
                      : `Thêm trường dữ liệu: ${newFieldData.name}`,
                    status: 'pending'
                  }, ...prev]);
                  setNewFieldData({ name: '', dataType: 'TEXT', required: false, defaultValue: '', maxLength: 255, description: '', isPrimaryKey: false, isForeignKey: false, referenceTable: '', referenceField: '' });
                  setEditingFieldIndex(null);
                  setFieldErrors({});
                  setShowFieldFormModal(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Thêm trường
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Excel Modal */}
      {showImportModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4 animate-in fade-in duration-200"
          style={{ zIndex: 99999 }}
          onClick={handleCancelImport}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Upload className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg text-slate-900">Nhập dữ liệu từ Excel</h3>
                  <p className="text-sm text-slate-500">Tải lên file Excel để nhập hàng loạt danh mục</p>
                </div>
              </div>
              <button onClick={handleCancelImport} className="text-slate-400 hover:text-slate-600" title="Đóng" aria-label="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {/* File Upload Section */}
              <div className="mb-6">
                <label className="block text-sm text-slate-700 mb-2">
                  Chọn file Excel <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                  <input title="Trường dữ liệu"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="excel-upload"
                  />
                  <label htmlFor="excel-upload" className="cursor-pointer">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-sm text-slate-600 mb-1">
                      {importFile ? importFile.name : 'Nhấn để chọn file hoặc kéo thả file vào đây'}
                    </p>
                    <p className="text-xs text-slate-500">
                      Hỗ trợ: .xlsx, .xls, .csv (Tối đa 10MB)
                    </p>
                  </label>
                </div>

                {/* Template Download */}
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <FileDown className="w-4 h-4 text-blue-600" />
                  <a href="#" className="text-blue-600 hover:underline">
                    Tải file mẫu Excel
                  </a>
                  <span className="text-slate-500">để xem cấu trúc dữ liệu yêu cầu</span>
                </div>
              </div>

              {/* Format Guide */}
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm text-blue-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Định dạng file Excel yêu cầu
                </h4>
                <div className="text-xs text-blue-800 space-y-1">
                  <p>• Cột 1: Mã danh mục (bắt buộc)</p>
                  <p>• Cột 2: Tên danh mục (bắt buộc)</p>
                  <p>• Cột 3: Mô tả</p>
                  <p>• Cột 4: Loại danh mục (Tiêu chuẩn / Tham chiếu / Hệ thống)</p>
                  <p>• Dòng đầu tiên là tiêu đề cột, dữ liệu bắt đầu từ dòng thứ 2</p>
                </div>
              </div>

              {/* Errors */}
              {importErrors.length > 0 && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="text-sm text-red-900 mb-2 flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Phát hiện {importErrors.length} lỗi
                  </h4>
                  <ul className="text-xs text-red-800 space-y-1 max-h-32 overflow-y-auto">
                    {importErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Preview Data */}
              {importPreviewData.length > 0 && (
                <div>
                  <h4 className="text-sm text-slate-900 mb-3">
                    Xem trước dữ liệu ({importPreviewData.length} bản ghi)
                  </h4>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto max-h-96">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs text-slate-600">STT</th>
                            <th className="px-4 py-3 text-left text-xs text-slate-600">Mã danh mục</th>
                            <th className="px-4 py-3 text-left text-xs text-slate-600">Tên danh mục</th>
                            <th className="px-4 py-3 text-left text-xs text-slate-600">Mô tả</th>
                            <th className="px-4 py-3 text-left text-xs text-slate-600">Loại</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                          {importPreviewData.map((item, index) => (
                            <tr key={index} className="hover:bg-slate-50">
                              <td className="px-4 py-3 text-sm text-slate-600">{index + 1}</td>
                              <td className="px-4 py-3 text-sm text-slate-900">{item.code}</td>
                              <td className="px-4 py-3 text-sm text-slate-900">{item.name}</td>
                              <td className="px-4 py-3 text-sm text-slate-600">{item.description}</td>
                              <td className="px-4 py-3">{getTypeBadge(item.type)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center bg-slate-50">
              <div className="text-sm text-slate-600">
                {importPreviewData.length > 0 && (
                  <span>Sẵn sàng nhập {importPreviewData.length} bản ghi</span>
                )}
              </div>
              <div className="flex gap-3">
                <button title="Đóng" aria-label="Đóng"
                  onClick={handleCancelImport}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleImportConfirm}
                  disabled={importPreviewData.length === 0 || importErrors.length > 0}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Xác nhận nhập
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Detail Modal */}
      {showApprovalDetailModal && selectedApprovalRequest && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4 animate-in fade-in duration-200"
          style={{ zIndex: 99999 }}
          onClick={() => setShowApprovalDetailModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg text-slate-900">Chi tiết thay đổi</h3>
                  <p className="text-sm text-slate-500">Xem các thay đổi của bản ghi</p>
                </div>
              </div>
              <button title="Đóng" aria-label="Đóng"
                onClick={() => setShowApprovalDetailModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {/* Record Info */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Mã bản ghi</label>
                    <code className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                      {selectedApprovalRequest.recordCode}
                    </code>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Tên bản ghi</label>
                    <div className="text-sm text-slate-900">{selectedApprovalRequest.recordName}</div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Người thay đổi</label>
                    <div className="text-sm text-slate-900">{selectedApprovalRequest.changedBy}</div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Thời gian thay đổi</label>
                    <div className="text-sm text-slate-900">{selectedApprovalRequest.changedDate}</div>
                  </div>
                  {selectedApprovalRequest.approvedDate && (
                    <>
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">Người phê duyệt</label>
                        <div className="text-sm text-slate-900">{selectedApprovalRequest.approvedBy}</div>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">Thời gian phê duyệt</label>
                        <div className="text-sm text-slate-900">{selectedApprovalRequest.approvedDate}</div>
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Trạng thái</label>
                    {getApprovalStatusBadge(selectedApprovalRequest.status)}
                  </div>
                </div>
              </div>

              {/* Changes */}
              <div>
                <h4 className="text-sm text-slate-900 mb-3">Các thay đổi ({selectedApprovalRequest.changedFields.length})</h4>
                <div className="space-y-4">
                  {Object.entries(selectedApprovalRequest.changes).map(([fieldName, values]: [string, any]) => (
                    <div key={fieldName} className="border border-slate-200 rounded-lg p-4">
                      <div className="text-sm text-slate-700 mb-3 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-slate-500" />
                        <strong>{fieldName}</strong>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-slate-500 mb-2">Giá trị cũ</label>
                          <div className="bg-red-50 border border-red-200 rounded px-3 py-2 text-sm text-red-900">
                            {values.old}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-2">Giá trị mới</label>
                          <div className="bg-green-50 border border-green-200 rounded px-3 py-2 text-sm text-green-900">
                            {values.new}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rejection Reason */}
              {selectedApprovalRequest.status === 'rejected' && selectedApprovalRequest.rejectionReason && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="text-sm text-red-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Lý do từ chối
                  </h4>
                  <p className="text-sm text-red-800">{selectedApprovalRequest.rejectionReason}</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center bg-slate-50">
              <button
                onClick={() => setShowApprovalDetailModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Đóng
              </button>
              {selectedApprovalRequest.status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      handleReject(selectedApprovalRequest.id);
                      setShowApprovalDetailModal(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Từ chối
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(selectedApprovalRequest.id);
                      setShowApprovalDetailModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Phê duyệt
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-[99999] p-4 animate-in fade-in duration-200" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999 }}
          onClick={() => {
            setShowApprovalModal(false);
            setApprovalComment('');
            setPendingApprovalIds([]);
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg text-slate-900">Xác nhận phê duyệt</h3>
                  <p className="text-sm text-slate-500">Phê duyệt {pendingApprovalIds.length} yêu cầu thay đổi</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Nội dung phê duyệt <span className="text-slate-400">(Không bắt buộc)</span>
                </label>
                <textarea
                  title="Ghi chú phê duyệt"
                  value={approvalComment}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setApprovalComment(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập nội dung phê duyệt, ghi chú hoặc ý kiến (nếu có)..."
                />
              </div>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-700">
                    <p className="font-medium">Lưu ý:</p>
                    <p className="mt-1">Sau khi phê duyệt, các thay đổi sẽ được áp dụng vào hệ thống và không thể hoàn tác.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setApprovalComment('');
                  setPendingApprovalIds([]);
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmApproval}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Xác nhận phê duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-[99999] p-4 animate-in fade-in duration-200" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999 }}
          onClick={() => {
            setShowRejectModal(false);
            setApprovalComment('');
            setPendingApprovalIds([]);
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg text-slate-900">Xác nhận từ chối</h3>
                  <p className="text-sm text-slate-500">Từ chối {pendingApprovalIds.length} yêu cầu thay đổi</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Lý do từ chối <span className="text-red-600">*</span>
                </label>
                <textarea
                  title="Lý do từ chối"
                  value={approvalComment}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setApprovalComment(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập lý do từ chối yêu cầu thay đổi..."
                />
              </div>

              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-red-700">
                    <p className="font-medium">Lưu ý:</p>
                    <p className="mt-1">Vui lòng nhập rõ lý do từ chối để người yêu cầu có thể hiểu và chỉnh sửa lại.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setApprovalComment('');
                  setPendingApprovalIds([]);
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmReject}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg flex items-center gap-3 min-w-[420px]">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-green-900">Gửi yêu cầu thành công</h4>
              <p className="text-xs text-green-700 mt-1">
                {successNotificationMessage || 'Yêu cầu chỉnh sửa danh mục đã được gửi đến bộ phận phê duyệt'}
              </p>
            </div>
            <button
              onClick={() => setShowSuccessNotification(false)}
              title="Đóng thông báo"
              className="text-green-600 hover:text-green-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {showCompareModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-[99999] p-4 animate-in fade-in duration-200" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999 }}
          onClick={() => setShowCompareModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800">
                 <BarChart3 className="w-5 h-5 text-blue-600"/>
                 <h3 className="text-[17px] font-bold">So sánh phiên bản dữ liệu</h3>
              </div>
              <button title="Đóng" aria-label="Đóng" onClick={() => setShowCompareModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-4">
                 <p className="text-[14px] text-blue-800">Đang so sánh <strong>v2.0</strong> với <strong>v3.2 (Hiện tại)</strong></p>
                 <p className="text-[13px] text-slate-600 mt-1">Phát hiện <span className="font-bold text-red-600">3 thay đổi</span> về cấu trúc và <span className="font-bold text-orange-600">1 thay đổi</span> về quy tắc.</p>
              </div>
              
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                 <table className="w-full text-left text-[13px]">
                   <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-700">
                     <tr>
                       <th className="px-4 py-3 font-semibold w-1/4">Tên trường / Thuộc tính</th>
                       <th className="px-4 py-3 font-semibold w-[15%]">Hành động</th>
                       <th className="px-4 py-3 font-semibold w-[30%]">Phiên bản cũ (v2.0)</th>
                       <th className="px-4 py-3 font-semibold w-[30%]">Phiên bản mới (v3.2)</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {/* Added Field */}
                     <tr className="bg-green-50/30">
                       <td className="px-4 py-3 font-medium text-slate-800">Số điện thoại liên hệ</td>
                       <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">Thêm mới</span></td>
                       <td className="px-4 py-3 text-slate-500 italic">Chưa có</td>
                       <td className="px-4 py-3 text-slate-800">
                         <div className="flex flex-col gap-1">
                           <span>Kiểu dữ liệu: <code className="bg-white border border-slate-200 px-1 rounded text-blue-600">string</code></span>
                           <span>Chiều dài: <code className="bg-white border border-slate-200 px-1 rounded">20</code></span>
                         </div>
                       </td>
                     </tr>
                     {/* Modified Field - DataType */}
                     <tr className="bg-blue-50/30">
                       <td className="px-4 py-3 font-medium text-slate-800">Mã tỉnh</td>
                       <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">Sửa kiểu dữ liệu</span></td>
                       <td className="px-4 py-3 text-slate-800">
                         Kiểu dữ liệu: <code className="bg-white border border-slate-200 px-1 rounded text-red-600">number</code>
                       </td>
                       <td className="px-4 py-3 text-green-700 font-medium">
                         Kiểu dữ liệu: <code className="bg-white border border-slate-200 px-1 rounded text-green-600">string</code>
                       </td>
                     </tr>
                     {/* Modified Field - Constraint */}
                     <tr className="bg-purple-50/30">
                       <td className="px-4 py-3 font-medium text-slate-800">Mã tỉnh</td>
                       <td className="px-4 py-3"><span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded">Sửa ràng buộc</span></td>
                       <td className="px-4 py-3 text-slate-800">
                         Unique Index: <span className="text-red-500 font-medium">Không có</span>
                       </td>
                       <td className="px-4 py-3 text-green-700 font-medium">
                         Unique Index: <span className="text-green-600 font-medium">Đã thiết lập</span>
                       </td>
                     </tr>
                     {/* Removed Field */}
                     <tr className="bg-red-50/30">
                       <td className="px-4 py-3 font-medium text-slate-800">Ghi chú phụ</td>
                       <td className="px-4 py-3"><span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">Xóa bỏ</span></td>
                       <td className="px-4 py-3 text-slate-800">
                         Trường dữ liệu kiểu <code className="bg-white border border-slate-200 px-1 rounded">string</code>
                       </td>
                       <td className="px-4 py-3 text-slate-500 italic">
                         Đã gỡ bỏ khỏi cấu trúc
                       </td>
                     </tr>
                   </tbody>
                 </table>
              </div>
            </div>
            <div className="p-5 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
              <button title="Đóng" aria-label="Đóng" onClick={() => setShowCompareModal(false)} className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-[14px]">
 Đóng
 </button>
            </div>
          </div>
        </div>
      )}

      {/* Version Detail Modal */}
      {showVersionDetailModal && selectedVersionData && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-[99999] p-4 animate-in fade-in duration-200" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999 }}
          onClick={() => setShowVersionDetailModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <Eye className="w-5 h-5 text-blue-600"/>
                 <h3 className="text-[17px] font-bold text-slate-800">Chi tiết phiên bản {selectedVersionData.version}</h3>
              </div>
              <button title="Đóng" aria-label="Đóng" onClick={() => setShowVersionDetailModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
               <div className="grid grid-cols-2 gap-4 text-[13px]">
                  <div><span className="text-slate-500">Người thực hiện:</span> <strong className="text-slate-800 block text-[14px]">{selectedVersionData.user}</strong></div>
                  <div><span className="text-slate-500">Ngày thay đổi:</span> <strong className="text-slate-800 block text-[14px]">{selectedVersionData.date}</strong></div>
                  <div><span className="text-slate-500">Ngày hiệu lực:</span> <strong className="text-slate-800 block text-[14px]">{selectedVersionData.effectiveDate || '--'}</strong></div>
                  <div><span className="text-slate-500">Trạng thái:</span> <span className={`inline-block px-2.5 py-1 mt-1 rounded-full text-xs font-medium ${
                      selectedVersionData.status === 'active' ? 'bg-green-100 text-green-700' :
                      selectedVersionData.status === 'draft' ? 'bg-amber-100 text-amber-700' :
                      selectedVersionData.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>{
                      selectedVersionData.status === 'active' ? 'Hiệu lực' :
                      selectedVersionData.status === 'draft' ? 'Bản nháp' :
                      selectedVersionData.status === 'pending' ? 'Chờ duyệt' : 'Hết hiệu lực'
                    }</span></div>
               </div>
               <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                 <h4 className="font-semibold text-slate-700 mb-2 text-[13px]">Nội dung thay đổi chi tiết</h4>
                 <p className="text-[14px] text-slate-800">{selectedVersionData.changes}</p>
               </div>
            </div>
            <div className="p-5 border-t border-slate-200 flex justify-end bg-slate-50">
              <button title="Đóng" aria-label="Đóng" onClick={() => setShowVersionDetailModal(false)} className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-[14px]">
 Đóng
 </button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Modal */}
      {showRestoreModal && selectedVersionData && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-[99999] p-4 animate-in fade-in duration-200" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999 }}
          onClick={() => setShowRestoreModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-200">
              <div className="flex flex-col items-center gap-3 text-center">
                 <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                   <Clock className="w-6 h-6"/>
                 </div>
                 <div>
                    <h3 className="text-[18px] font-bold text-slate-800">Đặt làm phiên bản chính</h3>
                    <p className="text-[14px] text-slate-500 mt-1">Xác nhận đặt phiên bản <strong>{selectedVersionData.version}</strong> làm phiên bản chính?</p>
                 </div>
              </div>
            </div>
            <div className="p-5 text-[14px] text-slate-600 text-center">
              Hệ thống sẽ chuyển đổi trạng thái của phiên bản {selectedVersionData.version} sang "Chờ duyệt". Phiên bản hiện tại đang sử dụng vẫn giữ nguyên trạng thái "Hiệu lực".
            </div>
            <div className="p-5 border-t border-slate-200 flex justify-center gap-3 bg-slate-50">
              <button onClick={() => setShowRestoreModal(false)} className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-[14px] flex-1">
                Hủy bỏ
              </button>
              <button onClick={() => {
                setVersionHistoryList(versionHistoryList.map(v => v.version === selectedVersionData.version ? { ...v, status: 'pending' } : v));
                setShowRestoreModal(false);
                setSuccessNotificationMessage(`Yêu cầu đặt phiên bản ${selectedVersionData.version} làm phiên bản chính đã được gửi duyệt thành công!`);
                setShowSuccessNotification(true);
              }} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-[14px] flex-1 flex items-center justify-center gap-2">
                <Check className="w-5 h-5"/> Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Version Modal */}
      {showCreateVersionModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-[99999] p-4 animate-in fade-in duration-200" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999 }}
          onClick={() => setShowCreateVersionModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-[16px]">Tạo phiên bản mới</h3>
              <button title="Đóng" aria-label="Đóng" onClick={() => setShowCreateVersionModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5"/>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-[13px] text-blue-800 flex gap-2">
                 <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5"/>
                 <p>Hệ thống sẽ sao chép cấu trúc và nội dung từ bản ghi hiện tại để tạo thành nền tảng cho phiên bản nâng cấp tiếp theo.</p>
              </div>

              <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1">Tên phiên bản <span className="text-red-500">*</span></label>
                 <input title="Tên phiên bản" type="text" className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-none" value={newVersionName} onChange={(e) => setNewVersionName(e.target.value)} />
              </div>
              
              <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1">Ngày hiệu lực <span className="text-red-500">*</span></label>
                 <input title="Ngày hiệu lực" type="date" className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-none" value={newEffectiveDate} onChange={(e) => setNewEffectiveDate(e.target.value)} />
              </div>

              <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1">Mô tả thay đổi</label>
                 <textarea title="Mô tả thay đổi" rows={3} className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Nhập lý do tạo mới hoặc các nội dung dự kiến thay đổi..." value={newChangeDesc} onChange={(e) => setNewChangeDesc(e.target.value)}></textarea>
              </div>
            </div>
            <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b-lg">
               <button onClick={() => setShowCreateVersionModal(false)} className="px-5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-700 hover:bg-slate-50">Hủy bỏ</button>
               <button onClick={() => {
                 const todayStr = new Date().toLocaleDateString('vi-VN');
                 const formattedDate = newEffectiveDate ? new Date(newEffectiveDate).toLocaleDateString('vi-VN') : todayStr;
                 const newItem = {
                   version: newVersionName || 'v3.3',
                   date: todayStr,
                   effectiveDate: formattedDate,
                   user: 'Nguyễn Văn A',
                   changes: newChangeDesc || 'Khởi tạo bản nháp phiên bản mới từ phiên bản hiện tại',
                   status: 'draft'
                 };
                 setVersionHistoryList([newItem, ...versionHistoryList]);
                 setShowCreateVersionModal(false);
                 setSuccessNotificationMessage(`Đã tạo thành công bản nháp phiên bản mới ${newItem.version} từ phiên bản trước.`);
                 setShowSuccessNotification(true);
               }} className="px-5 py-2.5 bg-blue-600 rounded-xl text-sm text-white hover:bg-blue-700 flex items-center gap-2">
                 <Save className="w-4 h-4"/> Lưu phiên bản
               </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}