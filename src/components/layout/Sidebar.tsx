import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Database,
  Settings,
  Share2,
  GitCompare,
  Shield,
  FileText,
  FolderTree,
  HardDrive,
  Network,
  Globe,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Monitor,
  Users,
  UsersRound,
  List,
  Key,
  Sliders,
  ScrollText,
  Database as DatabaseBackup,
  BarChart3,
  Building2,
  Building,
  UserCircle2,
  MapPin,
  Flag,
  Church,
  Landmark,
  Map,
  Heart,
  FileUser,
  HandHeart,
  UserMinus,
  Baby,
  Activity,
  UserCog,
  Accessibility,
  Medal,
  Shield as ShieldIcon,
  Users2,
  Stamp,
  Scale,
  FileCheck,
  Briefcase,
  Factory,
  Coins,
  ScrollText as DocumentText,
  BookOpen,
  FileBadge,
  Gavel,
  Lock,
  BookMarked,
  ClipboardList,
  GraduationCap,
  FileSearch,
  Search,
  Handshake,
  Bell,
  MessageSquare,
  CheckSquare,
  AlertTriangle,
  Plug,
  UploadIcon,
  RefreshCw,
  Server,
  Eye,
  FolderOpen,
  HelpCircle,
  Package,
  FolderCog,
  Circle,
  History as HistoryIcon,
  X,
  Link2,
  Zap,
} from "lucide-react";
import imgLogo from "figma:asset/0b9fbf72a74cf9ec02b7371d312e91e368f930d8.png";
import imgImageLogo from "figma:asset/009541fc5d689d29107b655d2b8ecd57f6d4b3ff.png";

import { VersionHistoryModal } from "../modals/VersionHistoryModal";
import { reconciliationData } from "../../data/provisionReconciliationData";
import { initialSourceSystems } from "../pages/collection/mockSourceSystems";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NestedSubMenuItem {
  id: string;
  label: string;
  icon?: any;
  subItems?: {
    id: string;
    label: string;
    icon?: any;
  }[];
  isGroup?: boolean; // New property to mark as a group
}

interface SubMenuItem {
  id: string;
  label: string;
  icon?: any;
  subItems?: NestedSubMenuItem[];
  isGroup?: boolean;
}

interface MenuItem {
  id: string;
  icon: any;
  label: string;
  color: string;
  subItems?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Tổng quan",
    color: "text-blue-600",
  },
  {
    id: "collection",
    icon: Database,
    label: "Quản lý thu thập",
    color: "text-green-600",
    subItems: [
      {
        id: "collection-dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
      {
        id: "collection-setup",
        label: "Thiết lập thu thập",
        icon: Settings,
      },

      {
        id: "view-collected-data",
        label: "Xem dữ liệu thu thập",
        icon: Database,
        subItems: [
          {
            id: "view-data-internal",
            label: "CSDL Trong ngành",
            icon: Building2,
            subItems: [
              { id: "data-info-civil-registry", label: "CSDL Hộ tịch điện tử", icon: Database },
              { id: "data-info-case-management", label: "HT quản lý hồ sơ QT (3)", icon: Database },
              { id: "data-info-civil-judgment", label: "CSDL thi hành án dân sự (16)", icon: Database },
              { id: "data-info-security-measures", label: "CSDL về biện pháp BD (4)", icon: Database },
              { id: "data-info-legal-national", label: "CSDL quốc gia về PL (5)", icon: Database },
              { id: "data-info-civil-legal-center", label: "CSDL TT Tư Pháp dân sự (2)", icon: Database },
              { id: "data-info-civil-legal-info", label: "HTTT trợ giúp pháp lý (6)", icon: Database },
              { id: "data-info-legal-center", label: "Phần mềm tk ngành tư pháp phục vụ chia sẻ dữ liệu mở", icon: Database },
              { id: "data-info-family-base", label: "CSDL PB, GĐ và HG cơ sở (16)", icon: Database },
              { id: "data-info-auction", label: "CSDL quản lý đấu giá TS (24)", icon: Database },
              { id: "data-info-international", label: "CSDL Hợp tác quốc tế (6)", icon: Database },
            ]
          },
          {
            id: "view-data-external",
            label: "CSDL Ngoài ngành",
            icon: Building,
            subItems: [
              { id: "external-court-judgment", label: "CSDL Thông tin Bản án (1)", icon: Database },
              { id: "external-category-group", label: "Danh mục (8)", icon: Database },
              { id: "external-social-security", label: "BHXH và Giảm nghèo (7)", icon: Database },
              { id: "external-meritorious-group", label: "Người có công (3)", icon: Database },
              { id: "external-children-group", label: "Trẻ em (1)", icon: Database },
            ]
          }
        ]
      },
      {
        id: "collection-reconciliation",
        label: "Đối soát dữ liệu",
        icon: GitCompare,
        subItems: [
          {
            id: "reconciliation-external-ministry",
            label: "Đối soát dữ liệu từ Bộ ngoài ngành",
            icon: Building,
            subItems: [
              {
                id: "reconciliation-external-categories",
                label: "Đối soát tổng hợp các danh mục từ Bộ ngành ngoài (qua Trung tâm dữ liệu Quốc gia)",
                icon: Database,
              },
              {
                id: "reconciliation-external-court-judgment",
                label: "Đối soát tổng hợp dữ liệu về Thông tin Bản án, quyết định",
                icon: Database,
              },
            ],
          },
          {
            id: "reconciliation-internal-ministry",
            label: "Đối soát dữ liệu từ Bộ trong ngành",
            icon: Building2,
            subItems: [
              {
                id: "reconciliation-internal-civil-registry",
                label: "CSDL Hộ tích điện tử",
                icon: Database,
              },
              {
                id: "reconciliation-internal-registry",
                label: "HT quản lý hồ sơ QT (3)",
                icon: Database,
              },
              {
                id: "reconciliation-internal-civil-judgment",
                label: "CSDL thi hành án dân sự (16)",
                icon: Database,
              },
              {
                id: "reconciliation-internal-security-measures",
                label: "CSDL về biện pháp BD (4)",
                icon: Database,
              },
              {
                id: "reconciliation-internal-legal-national",
                label: "CSDL quốc gia về PL (5)",
                icon: Database,
              },
              {
                id: "reconciliation-internal-civil-legal-center",
                label: "CSDL TT Tư Pháp dân sự (2)",
                icon: Database,
              },
              {
                id: "reconciliation-internal-civil-legal-info",
                label: "HTTT trợ giúp pháp lý (6)",
                icon: Database,
              },
              {
                id: "reconciliation-internal-legal-center",
                label: "Phần mềm tk ngành tư pháp phục vụ chia sẻ dữ liệu mở",
                icon: Database,
              },
              {
                id: "reconciliation-internal-family-base",
                label: "CSDL PB, GĐ và HG cơ sở (16)",
                icon: Database,
              },
              {
                id: "reconciliation-internal-auction",
                label: "CSDL quản lý đấu giá TS (24)",
                icon: Database,
              },
              {
                id: "reconciliation-internal-international",
                label: "CSDL Hợp tác quốc tế (6)",
                icon: Database,
              },
              {
                id: "reconciliation-internal-statistics",
                label: "Thu thập số liệu thống kê",
                icon: BarChart3,
              },
              {
                id: "reconciliation-internal-notary",
                label: "HTTT các tổ chức hành nghề công chứng",
                icon: Database,
              },
              {
                id: "reconciliation-internal-authentication",
                label: "CSDL chứng thực",
                icon: Database,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "processing",
    icon: Settings,
    label: "Xử lý dữ liệu",
    color: "text-purple-600",
    subItems: [
      {
        id: "processing-internal",
        label: "CSDL Trong ngành",
        icon: Building2,
        subItems: [
          {
            id: "processing-data-info-civil-registry",
            label: "CSDL Hộ tịch điện tử",
            icon: Database,
          },
          {
            id: "processing-data-info-case-management",
            label: "HT quản lý hồ sơ QT (3)",
            icon: Database,
          },
          {
            id: "processing-data-info-civil-judgment",
            label: "CSDL thi hành án dân sự (16)",
            icon: Database,
          },
          {
            id: "processing-data-info-security-measures",
            label: "CSDL về biện pháp BD (4)",
            icon: Database,
          },
          {
            id: "processing-data-info-legal-national",
            label: "CSDL quốc gia về PL (5)",
            icon: Database,
          },
          {
            id: "processing-data-info-civil-legal-center",
            label: "CSDL TT Tư Pháp dân sự (2)",
            icon: Database,
          },
          {
            id: "processing-data-info-civil-legal-info",
            label: "HTTT trợ giúp pháp lý (6)",
            icon: Database,
          },
          {
            id: "processing-data-info-legal-center",
            label: "Phần mềm tk ngành tư pháp phục vụ chia sẻ dữ liệu mở",
            icon: Database,
          },
          {
            id: "processing-data-info-family-base",
            label: "CSDL PB, GĐ và HG cơ sở (16)",
            icon: Database,
          },
          {
            id: "processing-data-info-auction",
            label: "CSDL quản lý đấu giá TS (24)",
            icon: Database,
          },
          {
            id: "processing-data-info-international",
            label: "CSDL Hợp tác quốc tế (6)",
            icon: Database,
          },
        ],
      },
      {
        id: "processing-external",
        label: "CSDL Ngoài ngành",
        icon: Building,
        subItems: [
          {
            id: "processing-external-court-judgment",
            label: "CSDL Thông tin Bản án (1)",
            icon: Database,
          },
          {
            id: "processing-external-category-group",
            label: "Danh mục (8)",
            icon: Database,
          },
          {
            id: "processing-external-social-security",
            label: "BHXH và Giảm nghèo (7)",
            icon: Database,
          },
          {
            id: "processing-external-meritorious-group",
            label: "Người có công (3)",
            icon: Database,
          },
          {
            id: "processing-external-children-group",
            label: "Trẻ em (1)",
            icon: Database,
          },
        ],
      },
    ],
  },
  {
    id: "category",
    icon: FolderTree,
    label: "Quản lý danh mục",
    color: "text-indigo-600",
    subItems: [
      {
        id: "category-setup",
        label: "Thiết lập danh mục",
        icon: Settings,
      },
      {
        id: "category-list",
        label: "Danh sách danh mục",
        icon: List,
        subItems: [
          {
            id: "category-a",
            label: "Biên tập danh mục A",
            icon: FolderOpen,
          },
        ],
      },
      {
        id: "category-published-list",
        label: "Công khai danh mục",
        icon: FileText,
      },
      {
        id: "category-report-group",
        label: "Thống kê danh mục",
        icon: BarChart3,
        subItems: [
          {
            id: "category-report",
            label: "Khai thác báo cáo",
            icon: Search,
          },
          {
            id: "category-report-list",
            label: "Báo cáo thống kê danh sách danh mục",
            icon: FileText,
          },
          {
            id: "category-report-exploitation",
            label: "Báo cáo tình trạng khai thác danh mục",
            icon: Activity,
          },
          {
            id: "category-report-status",
            label: "Báo cáo trạng thái danh mục",
            icon: CheckSquare,
          },
          {
            id: "category-report-version",
            label: "Báo cáo phiên bản danh mục",
            icon: HistoryIcon,
          },
        ],
      },
    ],
  },
  {
    id: "open-data",
    icon: Globe,
    label: "Dữ liệu mở",
    color: "text-emerald-600",
    subItems: [
      {
        id: "open-data-setup",
        label: "Thiết lập danh mục",
        icon: Settings,
      },
      {
        id: "open-data-category-list",
        label: "Danh sách danh mục",
        icon: List,
        subItems: [
          {
            id: "open-data-category-a",
            label: "Biên tập danh mục A",
            icon: FolderOpen,
          },
        ],
      },
      {
        id: "open-data-published-list",
        label: "Công bố dữ liệu mở",
        icon: FileText,
      },
      {
        id: "open-data-report",
        label: "Thống kê dữ liệu mở",
        icon: BarChart3,
      },
    ],
  },
  {
    id: "master-data",
    icon: HardDrive,
    label: "Quản lý dữ liệu chủ",
    color: "text-teal-600",
    subItems: [
      {
        id: "master-data-scale-management",
        label: "Quản lý quy mô dữ liệu chủ",
        icon: BarChart3,
      },
      {
        id: "master-data-update",
        label: "Cập nhật dữ liệu chủ",
        icon: RefreshCw,
        subItems: [
          {
            id: "master-data-update-a",
            label: "Dữ liệu chủ A",
          },
        ],
      },
      {
        id: "master-data-reports",
        label: "Báo cáo tìm kiếm dữ liệu chủ",
        icon: FileSearch,
      },
    ],
  },
  {
    id: "data-provisioning",
    icon: Share2,
    label: "Cung cấp dữ liệu",
    color: "text-amber-600",
    subItems: [
      {
        id: "provisioning-service-setup",
        label: "Thiết lập điều phối dữ liệu",
        icon: Settings,
      },
      {
        id: "provisioning-api-management",
        label: "Quản lý API cung cấp & đối soát",
        icon: Server,
      },
      {
        id: "provisioning-data-request",
        label: "Cung cấp dữ liệu theo yêu cầu",
        icon: FileText,
      },
      {
        id: "provisioning-monitoring",
        label: "Kiểm soát & giám sát cung cấp",
        icon: Activity,
      },
      {
        id: "provisioning-service-catalog",
        label: "Danh mục dịch vụ cung cấp",
        icon: Database,
        isGroup: true,
        subItems: [
          {
            id: "provisioning-shared",
            label: "CSDL Trong ngành",
            icon: FolderTree,
            subItems: [
              { id: "provisioning-shared-hotich", label: "CSDL Hộ tịch điện tử (12)", icon: Database },
              { id: "provisioning-shared-quoctich", label: "HT quản lý hồ sơ QT (3)", icon: Database },
              { id: "provisioning-shared-tha", label: "CSDL thi hành án dân sự (16)", icon: Database },
              { id: "provisioning-shared-bpbd", label: "CSDL về biện pháp BĐ (4)", icon: Database },
              { id: "provisioning-shared-qgpl", label: "CSDL quốc gia về PL (5)", icon: Database },
              { id: "provisioning-shared-tttp", label: "CSDL TT Tư pháp dân sự (2)", icon: Database },
              { id: "provisioning-shared-tgpl", label: "Phần mềm tk ngành tư pháp phục vụ chia sẻ dữ liệu mở (6)", icon: Database },
              { id: "provisioning-shared-pbgd", label: "CSDL PB, GD và HG cơ sở (16)", icon: Database },
              { id: "provisioning-shared-dgts", label: "CSDL quản lý đấu giá TS (25)", icon: Database },
              { id: "provisioning-shared-htqt", label: "CSDL Hợp tác quốc tế (6)", icon: Database },
            ]
          },
          {
            id: "provisioning-internal",
            label: "CSDL Ngoài ngành",
            icon: FolderTree,
            subItems: [
              { id: "provisioning-internal-banan", label: "CSDL Thông tin Bản án (1)", icon: Database },
              { id: "provisioning-internal-danhmuc", label: "Danh mục (8)", icon: Database },
              { id: "provisioning-internal-bhxh", label: "BHXH và Giảm nghèo (7)", icon: Database },
              { id: "provisioning-internal-ncc", label: "Người có công (3)", icon: Database },
              { id: "provisioning-internal-treem", label: "Trẻ em (1)", icon: Database },
            ]
          },
          {
            id: "provisioning-open",
            label: "Dữ liệu mở (32)",
            icon: Globe,
          },
          {
            id: "provisioning-master",
            label: "Dữ liệu chủ (1)",
            icon: HardDrive,
          },
        ]
      },
      {
        id: "reconciliation-catalog",
        label: "Quy trình đối soát dữ liệu",
        icon: GitCompare,
        isGroup: true,
        subItems: reconciliationData.map(item => ({
          id: `reconciliation-${item.id}`,
          label: item.group,
          icon: GitCompare
        }))
      },
    ],
  },

  {
    id: "admin",
    icon: Shield,
    label: "Quản trị & vận hành",
    color: "text-red-600",
    subItems: [
      {
        id: "data-management-category",
        label: "Danh mục đơn vị quản lý dữ liệu",
        icon: Database,
        isGroup: true,
        subItems: [
          {
            id: "connection-management",
            label: "Quản lý kết nối",
            icon: Link2,
          },
          {
            id: "target-database-management",
            label: "Quản lý CSDL đích",
            icon: Database,
          }
        ]
      },
      {
        id: "admin-user-management-group",
        label: "Quản trị người dùng",
        icon: Users,
        isGroup: true,
        subItems: [
          {
            id: "admin-users",
            label: "Quản lý người dùng",
            icon: Users,
          },
          {
            id: "admin-groups",
            label: "Quản lý nhóm người dùng",
            icon: UsersRound,
            subItems: [
              { id: "admin-groups-1", label: "Bộ Tư Pháp", icon: Circle },
              { id: "admin-groups-2", label: "Cục Công nghệ thông tin", icon: Circle },
              { id: "admin-groups-3", label: "Cục Hành chính tư pháp", icon: Circle },
              { id: "admin-groups-4", label: "Cục Quản lý thi hành án dân sự", icon: Circle },
              { id: "admin-groups-5", label: "Cục Đăng ký GD bảo đảm & Bồi thường nhà nước", icon: Circle },
              { id: "admin-groups-6", label: "Cục Kiểm tra văn bản & Quản lý xử lý VP hành chính", icon: Circle },
              { id: "admin-groups-7", label: "Cục Pháp luật quốc tế và Giải quyết tranh chấp đầu tư quốc tế", icon: Circle },
              { id: "admin-groups-8", label: "Cục Phổ biến, giáo dục pháp luật và Trợ giúp pháp lý", icon: Circle },
              { id: "admin-groups-9", label: "Cục Bổ trợ tư pháp", icon: Circle },
              { id: "admin-groups-10", label: "Vụ Hợp tác quốc tế", icon: Circle },
              { id: "admin-groups-11", label: "Cục Kế hoạch - Tài chính", icon: Circle }
            ]
          },
          {
            id: "admin-functions",
            label: "Danh sách chức năng",
            icon: List,
          },
          {
            id: "admin-roles",
            label: "Quản lý vai trò",
            icon: ShieldIcon,
          },
        ],
      },
      {
        id: "admin-config-group",
        label: "Cấu hình hệ thống",
        icon: Sliders,
        isGroup: true,
        subItems: [
          {
            id: "admin-config",
            label: "Thiết lập cấu hình hệ thống",
            icon: Sliders,
          },
          {
            id: "admin-password-rules",
            label: "Thiết lập quy tắc đặt mật khẩu",
            icon: Key,
          },
          {
            id: "admin-backup",
            label: "Sao lưu dự phòng",
            icon: DatabaseBackup,
          },
        ],
      },
      {
        id: "admin-logs-group",
        label: "Quản lý nhật ký",
        icon: ScrollText,
        isGroup: true,
        subItems: [
          {
            id: "admin-access-log",
            label: "Nhật ký truy cập",
            icon: ScrollText,
          },
          {
            id: "admin-error-log",
            label: "Nhật ký các lỗi phát sinh",
            icon: AlertTriangle,
          },
          {
            id: "admin-account-log",
            label: "Nhật ký quản lý tài khoản",
            icon: UserCog,
          },
          {
            id: "admin-config-log",
            label: "Nhật ký thay đổi cấu hình",
            icon: Settings,
          },
        ],
      },
      {
        id: "admin-statistics-group",
        label: "Thống kê & báo cáo",
        icon: BarChart3,
        isGroup: true,
        subItems: [
          {
            id: "admin-statistics",
            label: "Xem biểu đồ thống kê",
            icon: BarChart3,
          },
        ],
      },
      {
        id: "notifications",
        icon: Bell,
        label: "Quản lý thông báo",
      },
      {
        id: "user-guide",
        icon: HelpCircle,
        label: "Hướng dẫn sử dụng",
      },
    ],
  },
];

// Helper to normalize Vietnamese text for comparison
const normalizeText = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

export function Sidebar({
  currentPage,
  onNavigate,
  isCollapsed,
  onToggleCollapse
}: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<
    Set<string>
  >(new Set(['data-provisioning'])); // Default expand data-provisioning as it's the main page for now
  const [searchTerm, setSearchTerm] = useState("");
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  const toggleMenu = (menuId: string) => {
    if (isCollapsed) return; // Don't toggle submenus when collapsed
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(menuId)) {
      newExpanded.delete(menuId);
    } else {
      newExpanded.add(menuId);
    }
    setExpandedMenus(newExpanded);
  };

  useAutoExpand(searchTerm, menuItems, setExpandedMenus);

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-72'} bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-20 relative transition-all duration-300`}>
      {/* Logo & Toggle */}
      <div className={`h-16 flex items-center border-b border-slate-200 relative ${isCollapsed ? 'justify-center px-4' : 'justify-between pl-4 pr-3'}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 flex items-center justify-center relative rounded overflow-hidden flex-shrink-0">
            <img
              src={imgImageLogo}
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
          {!isCollapsed && (
            <div className="whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300 overflow-hidden">
              <div className="text-slate-900 text-base leading-5 font-bold truncate">
                Kho DLDC
              </div>
              <div className="text-[10px] text-slate-500 leading-4 uppercase font-bold tracking-tight truncate">
                Hệ thống quản lý Bộ Tư Pháp
              </div>
            </div>
          )}
        </div>

        {isCollapsed ? (
          <button
            onClick={onToggleCollapse}
            className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all z-50 shadow-sm"
            style={{ right: '-12px' }}
            title="Mở rộng menu"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={onToggleCollapse}
            className="w-7 h-7 flex-shrink-0 bg-white border border-slate-200 rounded flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm ml-2"
            title="Thu gọn menu"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className={`px-4 py-3 border-b border-slate-100 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <div className="relative group w-full">
          {isCollapsed ? (
            <button
              onClick={onToggleCollapse}
              className="w-full flex justify-center p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-white transition-all"
              title="Tìm kiếm menu"
            >
              <Search className="w-5 h-5" />
            </button>
          ) : (
            <>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Tìm kiếm menu..."
                title="Tìm kiếm menu..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full transition-colors"
                  title="Xóa tìm kiếm"
                >
                  <X className="w-3.5 h-3.5 text-slate-400" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-3 custom-scrollbar">
        <div className="space-y-0.5">
          {(() => {
            const term = normalizeText(searchTerm);
            if (!term) return menuItems;

            const filterItems = (items: any[]): any[] => {
              return items
                .map((item) => {
                  const labelMatches = normalizeText(item.label).includes(term);
                  const subItemsFiltered = item.subItems
                    ? filterItems(item.subItems)
                    : [];
                  const hasMatchingChildren = subItemsFiltered.length > 0;

                  if (labelMatches || hasMatchingChildren) {
                    return { ...item, subItems: subItemsFiltered };
                  }
                  return null;
                })
                .filter((i) => i !== null);
            };

            return filterItems(menuItems);
          })().map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            const isExpanded = expandedMenus.has(item.id);
            const hasSubItems =
              item.subItems && item.subItems.length > 0;

            return (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (hasSubItems && !isCollapsed) {
                      toggleMenu(item.id);
                    } else {
                      onNavigate(item.id);
                    }
                  }}
                  title={isCollapsed ? item.label : ""}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-3'} py-2.5 rounded-lg transition-all ${isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${isActive ? item.color : ""}`}
                  />
                  {!isCollapsed && (
                    <span className="text-xs flex-1 text-left whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                      {item.label}
                    </span>
                  )}
                  {!isCollapsed && hasSubItems &&
                    (isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                    ))}
                </button>

                {/* Level 2 Sub Items */}
                {hasSubItems && isExpanded && !isCollapsed && (
                  <div className="ml-4 mt-1 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    {item.subItems?.map((subItem: SubMenuItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive =
                        currentPage === subItem.id || currentPage.startsWith(subItem.id + '/');
                      const isSubExpanded = expandedMenus.has(
                        subItem.id,
                      );
                      const hasNestedItems =
                        subItem.subItems &&
                        subItem.subItems.length > 0;

                      // Check if this is a group header
                      const isGroupHeader =
                        subItem.isGroup === true;

                      return (
                        <div key={subItem.id}>
                          <button
                            onClick={() => {
                              if (hasNestedItems) {
                                toggleMenu(subItem.id);
                              } else {
                                onNavigate(subItem.id);
                              }
                            }}
                            title={subItem.label}
                            aria-label={subItem.label}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-xs ${isGroupHeader
                              ? "text-slate-700 font-medium hover:bg-slate-50"
                              : isSubActive
                                ? "bg-blue-50 text-blue-700"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                              }`}
                          >
                            {SubIcon && <SubIcon className="w-3.5 h-3.5 flex-shrink-0" />}
                            <span
                              className={`text-xs truncate flex-1 text-left ${isGroupHeader ? "font-medium" : ""}`}
                            >
                              {subItem.label}
                            </span>
                            {hasNestedItems &&
                              (isSubExpanded ? (
                                <ChevronDown className="w-2.5 h-2.5 flex-shrink-0" />
                              ) : (
                                <ChevronRight className="w-2.5 h-2.5 flex-shrink-0" />
                              ))}
                          </button>

                          {/* Level 3 Nested Sub Items */}
                          {hasNestedItems && isSubExpanded && (
                            <div className="ml-4 mt-0.5 space-y-0.5">
                              {subItem.subItems?.map(
                                (nestedItem: NestedSubMenuItem) => {
                                  const NestedIcon =
                                    nestedItem.icon || Circle;
                                  const isNestedActive =
                                    currentPage ===
                                    nestedItem.id;
                                  const isNestedExpanded =
                                    expandedMenus.has(
                                      nestedItem.id,
                                    );
                                  const hasLevel4Items =
                                    nestedItem.subItems &&
                                    nestedItem.subItems.length >
                                    0;

                                  return (
                                    <div key={nestedItem.id}>
                                      <button
                                        onClick={() => {
                                          if (hasLevel4Items) {
                                            toggleMenu(
                                              nestedItem.id,
                                            );
                                          } else {
                                            onNavigate(
                                              nestedItem.id,
                                            );
                                          }
                                        }}
                                        title={nestedItem.label}
                                        aria-label={nestedItem.label}
                                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all ${isNestedActive
                                          ? "bg-blue-50 text-blue-700"
                                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                          }`}
                                      >
                                        {NestedIcon && (
                                          <NestedIcon className="w-3 h-3 flex-shrink-0" />
                                        )}
                                        <span className="text-xs truncate flex-1 text-left">
                                          {nestedItem.label}
                                        </span>
                                        {hasLevel4Items &&
                                          (isNestedExpanded ? (
                                            <ChevronDown className="w-2.5 h-2.5 flex-shrink-0" />
                                          ) : (
                                            <ChevronRight className="w-2.5 h-2.5 flex-shrink-0" />
                                          ))}
                                      </button>

                                      {/* Level 4 Items */}
                                      {hasLevel4Items &&
                                        isNestedExpanded && (
                                          <div className="ml-4 mt-0.5 space-y-0.5">
                                            {nestedItem.subItems?.map(
                                              (level4Item: any) => {
                                                const Level4Icon =
                                                  level4Item.icon;
                                                const isLevel4Active =
                                                  currentPage ===
                                                  level4Item.id;

                                                return (
                                                  <button
                                                    key={
                                                      level4Item.id
                                                    }
                                                    onClick={() =>
                                                      onNavigate(
                                                        level4Item.id,
                                                      )
                                                    }
                                                    title={level4Item.label}
                                                    aria-label={level4Item.label}
                                                    className={`w-full flex items-center gap-2 px-2 py-1 rounded-lg transition-all ${isLevel4Active
                                                      ? "bg-blue-50 text-blue-700"
                                                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                      }`}
                                                  >
                                                    {Level4Icon && <Level4Icon className="w-2.5 h-2.5 flex-shrink-0" />}
                                                    <span className="text-xs truncate">
                                                      {
                                                        level4Item.label
                                                      }
                                                    </span>
                                                  </button>
                                                );
                                              },
                                            )}
                                          </div>
                                        )}
                                    </div>
                                  );
                                },
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {searchTerm.trim() && (() => {
            const term = normalizeText(searchTerm);
            const filterRec = (items: any[]): any[] => {
              return items.flatMap(item => {
                const matches = normalizeText(item.label).includes(term);
                const subMatches = item.subItems ? filterRec(item.subItems) : [];
                return (matches || subMatches.length > 0) ? [item] : [];
              });
            };
            return filterRec(menuItems);
          })().length === 0 && (
              <div className="py-10 text-center">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-xs text-slate-400">Không tìm thấy kết quả</p>
              </div>
            )}
        </div>
      </nav>

      {/* Footer */}
      <div className={`p-4 border-t border-slate-200 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={() => setShowVersionHistory(true)}
          className={`w-full bg-slate-50 rounded-lg ${isCollapsed ? 'p-2' : 'p-3'} text-left hover:bg-slate-100 transition-colors shadow-sm cursor-pointer flex flex-col items-center`}
        >
          <div className={`flex items-center gap-2 ${isCollapsed ? 'mb-0' : 'mb-2'}`}>
            <FileText className="w-4 h-4 text-slate-600" />
            {!isCollapsed && (
              <span className="text-xs text-slate-600 font-medium whitespace-nowrap">
                Phiên bản
              </span>
            )}
          </div>
          {!isCollapsed && <div className="text-xs text-slate-900 font-bold">v2.3.0</div>}
        </button>
      </div>

      <VersionHistoryModal
        isOpen={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
      />
    </aside>
  );
}

// Effect to auto-expand during search
function useAutoExpand(searchTerm: string, menuItems: any[], setExpandedMenus: (val: any) => void) {
  useEffect(() => {
    if (!searchTerm.trim()) return;

    const term = normalizeText(searchTerm);
    const allIdsToExpand = new Set<string>();

    const checkItems = (items: any[]): boolean => {
      let anyChildMatches = false;
      for (const item of items) {
        const matches = normalizeText(item.label).includes(term);
        const childrenMatch = item.subItems ? checkItems(item.subItems) : false;

        if (matches || childrenMatch) {
          if (item.subItems && item.subItems.length > 0) {
            allIdsToExpand.add(item.id);
          }
          anyChildMatches = true;
        }
      }
      return anyChildMatches;
    };

    checkItems(menuItems);
    if (allIdsToExpand.size > 0) {
      setExpandedMenus((prev: Set<string>) => {
        const next = new Set(prev);
        allIdsToExpand.forEach(id => next.add(id));
        return next;
      });
    }
  }, [searchTerm, menuItems, setExpandedMenus]);
}