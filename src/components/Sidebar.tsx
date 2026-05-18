import { 
  Home, 
  Database, 
  FileSearch, 
  Share2, 
  GitCompare, 
  Sparkles, 
  Settings,
  ChevronDown,
  ChevronRight,
  Users,
  User,
  UsersRound,
  List,
  ShieldCheck,
  Search,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

interface MenuItem {
  id: string;
  title: string;
  icon?: any;
  page?: string;
  subItems?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'home',
    title: 'Trang chủ',
    icon: Home,
    page: 'home',
  },
  {
    id: 'collection',
    title: 'Quản lý thu thập',
    icon: Database,
    page: 'data-collection',
  },
  {
    id: 'processing',
    title: 'Xử lý dữ liệu',
    icon: Sparkles,
    subItems: [
      {
        id: 'data-processing-dashboard',
        title: 'Tổng quan xử lý',
        icon: Home,
        page: 'data-processing',
      },
      {
        id: 'processed-data-view',
        title: 'Dữ liệu đã xử lý',
        icon: List,
        page: 'processed-data',
      },
    ],
  },
  {
    id: 'search',
    title: 'Tra cứu kho dữ liệu',
    icon: FileSearch,
    page: 'data-search',
  },
  {
    id: 'sharing',
    title: 'Quản lý dịch vụ chia sẻ',
    icon: Share2,
    page: 'data-sharing',
  },
  {
    id: 'reconciliation',
    title: 'Quản lý đối soát dữ liệu',
    icon: GitCompare,
    page: 'data-reconciliation',
  },
  {
    id: 'cleaning',
    title: 'Quản lý làm sạch dữ liệu',
    icon: Sparkles,
    page: 'data-cleaning-management',
  },
  {
    id: 'admin',
    title: 'Quản trị và vận hành',
    icon: Settings,
    // page: 'admin', // Allow clicking parent to expand
    subItems: [
      {
        id: 'target-database-management',
        title: 'Quản lý CSDL đích',
        icon: Database,
        page: 'target-database-management',
      },
      {
        id: 'admin-users-group',
        title: 'Quản trị người dùng',
        icon: Users,
        subItems: [
          {
            id: 'admin-users',
            title: 'Quản lý người dùng',
            icon: User,
            page: 'admin-users',
          },
          {
            id: 'admin-groups',
            title: 'Quản lý nhóm người dùng',
            icon: UsersRound,
            page: 'admin-groups',
          },
          {
            id: 'admin-functions',
            title: 'Danh sách chức năng',
            icon: List,
            page: 'admin-functions',
          },
          {
            id: 'admin-function-config',
            title: 'Cấu hình quyền thao tác',
            icon: ShieldCheck,
            page: 'admin-function-config',
          },
        ],
      },
    ],
  },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['admin', 'admin-users-group', 'sharing-group', 'reconciliation-group', 'cleaning-group']));
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Auto-expand parent menus based on current page
    const newExpanded = new Set(expandedItems);
    let changed = false;

    const expandParents = (items: MenuItem[], parentIds: string[] = []) => {
      for (const item of items) {
        if (item.page === currentPage) {
          parentIds.forEach(id => newExpanded.add(id));
          changed = true;
        }
        if (item.subItems) {
          expandParents(item.subItems, [...parentIds, item.id]);
        }
      }
    };

    expandParents(menuItems);

    if (changed) {
      setExpandedItems(newExpanded);
    }
  }, [currentPage]);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const isActive = item.page === currentPage;
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const Icon = item.icon;

    // Indentation based on level
    const paddingLeft = level === 0 ? 'px-3' : level === 1 ? 'pl-8 pr-3' : 'pl-12 pr-3';

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasSubItems) {
              toggleExpand(item.id);
            } else if (item.page) {
              onNavigate(item.page);
            }
          }}
          className={`w-full flex items-center justify-between ${paddingLeft} py-2.5 rounded-lg transition-colors mb-1 text-xs ${
            isActive
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />}
            <span className={`${isActive ? 'font-medium' : ''}`}>{item.title}</span>
          </div>
          {hasSubItems && (
            isExpanded ? (
              <ChevronDown className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
            ) : (
              <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
            )
          )}
        </button>

        {hasSubItems && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.subItems!.map((subItem) => renderMenuItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const filteredMenuItems = (() => {
    if (!searchTerm.trim()) return menuItems;

    const term = searchTerm.toLowerCase();
    
    const filterRec = (items: MenuItem[]): MenuItem[] => {
      return items
        .map(item => {
          const titleMatches = item.title.toLowerCase().includes(term);
          const filteredSubItems = item.subItems ? filterRec(item.subItems) : undefined;
          const hasMatchingChildren = filteredSubItems && filteredSubItems.length > 0;

          if (titleMatches || hasMatchingChildren) {
            return {
              ...item,
              subItems: filteredSubItems
            };
          }
          return null;
        })
        .filter((item): item is MenuItem => item !== null);
    };

    return filterRec(menuItems);
  })();

  // Auto-expand parents of matching items when searching
  useEffect(() => {
    if (searchTerm.trim()) {
      const allIds = new Set<string>();
      const collectIds = (items: MenuItem[]) => {
        items.forEach(item => {
          if (item.subItems && item.subItems.length > 0) {
            allIds.add(item.id);
            collectIds(item.subItems);
          }
        });
      };
      collectIds(filteredMenuItems);
      setExpandedItems(prev => {
        const next = new Set(prev);
        allIds.forEach(id => next.add(id));
        return next;
      });
    }
  }, [searchTerm, filteredMenuItems]);

  return (
    <aside className="w-72 bg-white border-r border-gray-200 h-[calc(100vh-73px)] overflow-y-auto sticky top-[73px] custom-scrollbar">
      <div className="p-4">
        {/* Search Bar */}
        <div className="mb-6 px-1">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Tìm kiếm chức năng..."
              className="w-full pl-10 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-200 rounded-full transition-colors"
                title="Xóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-3 px-3">
          Chức năng chính
        </h3>

        <nav className="space-y-0.5">
          {filteredMenuItems.length > 0 ? (
            filteredMenuItems.map((item) => renderMenuItem(item))
          ) : (
            <div className="py-8 text-center">
              <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-xs text-gray-400">Không tìm thấy chức năng phù hợp</p>
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
}
