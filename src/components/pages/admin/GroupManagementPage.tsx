import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Users, Eye, UserPlus, Lock, Settings, ChevronRight, ChevronDown, X, Filter, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { UsersRound } from 'lucide-react';
import { Badge, RowIconAction, TruncatedText, BTN_PRIMARY, BTN_OUTLINE, BTN_DESTRUCTIVE, BTN_GHOST_ICON, INPUT_CLS, LABEL_CLS, REQUIRED_MARK, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE, GROUP_TITLE, SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, FILTER_GRID_CLS, FILTER_LABEL, normalizeSearch, formatDateVN } from '../collection/collectionUi';
import { menuStructure, type MenuItem, type MenuFunction } from './menuStructure';
import { getRoles } from './RoleManagementPage';

const isDatabaseOrSystemLeaf = (item: MenuItem): boolean => {
  const id = item.id;
  return (
    id.startsWith('data-info-') ||
    id.startsWith('external-') ||
    (id.startsWith('reconciliation-internal-') && id !== 'reconciliation-internal-ministry') ||
    (id.startsWith('reconciliation-external-') && id !== 'reconciliation-external-ministry') ||
    id.startsWith('processing-data-info-') ||
    id.startsWith('processing-external-') ||
    (id.startsWith('provisioning-shared-') && id !== 'provisioning-shared') ||
    (id.startsWith('provisioning-internal-') && id !== 'provisioning-internal') ||
    id === 'provisioning-open' ||
    id === 'provisioning-master'
  );
};

// Filter menu structure to remove CSDL/Hệ thống leaf nodes as per user request
const filterMenuStructure = (items: MenuItem[]): MenuItem[] => {
  return items
    .map(item => {
      if (isDatabaseOrSystemLeaf(item)) {
        return null;
      }
      if (item.children) {
        return {
          ...item,
          children: filterMenuStructure(item.children)
        };
      }
      return item;
    })
    .filter((item): item is MenuItem => item !== null);
};

const filteredMenuStructure = filterMenuStructure(menuStructure);

interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Group {
  id: number;
  name: string;
  code: string;
  description: string;
  department: string;
  memberCount: number;
  functionCount: number;
  createdDate: string;
  status: 'active' | 'inactive';
  members: Member[];
  functions: string[];
  role?: string;
  functionPermissions?: { [functionId: string]: string[] };
  dataPermissions?: { [sourceId: string]: { [tableId: string]: string[] } };
  groupAdmin?: string;
  modules?: string[];
}

export interface DatabaseTable {
  id: string;
  name: string;
}

export interface DataSource {
  id: string;
  name: string;
  tables: DatabaseTable[];
}

const commonTables: DatabaseTable[] = [
  { id: 'tb_khaisinh', name: 'Bộ dữ liệu hồ sơ đăng ký khai sinh' },
  { id: 'tb_kethon', name: 'Bộ dữ liệu hồ sơ đăng ký kết hôn' },
  { id: 'tb_khaitu', name: 'Bộ dữ liệu hồ sơ đăng ký khai tử' },
  { id: 'tb_nhanchamecon', name: 'Bộ dữ liệu hồ sơ đăng ký nhận cha, mẹ, con' },
  { id: 'tb_nuoiconnuoi', name: 'Bộ dữ liệu hồ sơ đăng ký nuôi con nuôi' },
  { id: 'tb_giamho', name: 'Bộ dữ liệu hồ sơ đăng ký giám hộ' },
  { id: 'tb_chamdutgiamho', name: 'Bộ dữ liệu hồ sơ đăng ký chấm dứt giám hộ' },
  { id: 'tb_thaydoi', name: 'Bộ hồ sơ đăng ký thay đổi, cải chính, bổ sung thông tin hộ tịch, xác định lại dân tộc' },
  { id: 'tb_giamsatgiamho', name: 'Bộ dữ liệu hồ sơ đăng ký giám sát việc giám hộ' },
  { id: 'tb_chamdutgiamsat', name: 'Bộ dữ liệu hồ sơ đăng ký chấm dứt giám sát việc giám hộ' },
  { id: 'tb_ghichulyhon', name: 'Bộ dữ liệu hồ sơ ghi vào sổ việc ly hôn/hủy việc kết hôn đã thực hiện tại cơ quan có thẩm quyền của nước ngoài (ghi chú ly hôn)' },
];

const otherTables: DatabaseTable[] = [
  { id: 'tb_generic_1', name: 'Bảng dữ liệu chung 1' },
  { id: 'tb_generic_2', name: 'Bảng dữ liệu chung 2' },
  { id: 'tb_generic_3', name: 'Bảng danh mục' },
];

const dataSources: DataSource[] = [
  { id: 'data-info-civil-registry', name: 'CSDL Hộ tịch điện tử', tables: commonTables },
  { id: 'data-info-case-management', name: 'HT quản lý hồ sơ QT (3)', tables: otherTables },
  { id: 'data-info-civil-judgment', name: 'CSDL thi hành án dân sự (16)', tables: otherTables },
  { id: 'data-info-security-measures', name: 'CSDL về biện pháp BD (4)', tables: otherTables },
  { id: 'data-info-legal-national', name: 'CSDL quốc gia về PL (5)', tables: otherTables },
  { id: 'data-info-civil-legal-center', name: 'CSDL TT Tư Pháp dân sự (2)', tables: otherTables },
  { id: 'data-info-civil-legal-info', name: 'HTTT trợ giúp pháp lý (6)', tables: otherTables },
  { id: 'data-info-legal-center', name: 'Phần mềm tk ngành tư pháp phục vụ chia sẻ dữ liệu mở', tables: otherTables },
  { id: 'data-info-family-base', name: 'CSDL PB, GĐ và HG cơ sở (16)', tables: otherTables },
  { id: 'data-info-auction', name: 'CSDL quản lý đấu giá TS (24)', tables: otherTables },
  { id: 'data-info-international', name: 'CSDL Hợp tác quốc tế (6)', tables: otherTables },
  { id: 'external-court-judgment', name: 'CSDL Thông tin Bản án (1)', tables: otherTables },
  { id: 'external-category-group', name: 'Danh mục (8)', tables: otherTables },
  { id: 'external-social-security', name: 'BHXH và Giảm nghèo (7)', tables: otherTables },
  { id: 'external-meritorious-group', name: 'Người có công (3)', tables: otherTables },
  { id: 'external-children-group', name: 'Trẻ em (1)', tables: otherTables },
];

const dataPermissionActions = ['Xem', 'Thêm', 'Sửa', 'Xóa', 'Xuất Excel'];

// --- Giao diện theo tailieu/docs/compomennt.md ---
// Thẻ thống kê nhỏ (mục 5.6.1) — thay StatsCard dùng chung (giữ icon, màu ô icon theo iconColor, tiêu đề, giá trị)
const STAT_ICON_TONES: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-orange-50 text-orange-600',
};
const StatCard = ({ icon: Icon, iconColor, title, value }: { icon: typeof Users; iconColor: string; title: string; value: string }) => (
  <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg shrink-0 ${STAT_ICON_TONES[iconColor]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <div className="text-[16px] text-[#64748B] truncate">{title}</div>
        <div className="text-[16px] font-semibold text-[#0F172A] tabular-nums">{value}</div>
      </div>
    </div>
  </div>
);

// Bảng (mục 5.3)
const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';
const TR = 'h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors';
// Textarea: cùng viền/bo với ô nhập, thay chiều cao 40px bằng py-2 (mục 5.2)
const TEXTAREA_CLS = INPUT_CLS.replace('h-10', 'py-2');
// Checkbox (mục 5.12)
const CHECKBOX_CLS = 'w-4 h-4 rounded accent-blue-600 cursor-pointer';
// Hộp chọn nhanh "Chọn tất cả"
const SELECT_ALL_BOX = 'flex items-center gap-3 px-3 h-10 bg-white border border-[#E2E8F0] rounded-lg cursor-pointer hover:bg-[#F8FAFC] transition-colors';
// Thẻ nhóm thông tin (mục 5.6)
const BLOCK_CARD = 'bg-white rounded-2xl border border-[#E2E8F0] p-4';
const BAR = <span className="w-1 h-4 bg-blue-600 rounded-full shrink-0" />;

export const units = [
  { id: '1', name: 'Bộ Tư Pháp' },
  { id: '2', name: 'Cục Công nghệ thông tin' },
  { id: '3', name: 'Cục Hành chính tư pháp' },
  { id: '4', name: 'Cục Quản lý thi hành án dân sự' },
  { id: '5', name: 'Cục Đăng ký GD bảo đảm & Bồi thường nhà nước' },
  { id: '6', name: 'Cục Kiểm tra văn bản & Quản lý xử lý VP hành chính' },
  { id: '7', name: 'Cục Pháp luật quốc tế và Giải quyết tranh chấp đầu tư quốc tế' },
  { id: '8', name: 'Cục Phổ biến, giáo dục pháp luật và Trợ giúp pháp lý' },
  { id: '9', name: 'Cục Bổ trợ tư pháp' },
  { id: '10', name: 'Vụ Hợp tác quốc tế' },
  { id: '11', name: 'Cục Kế hoạch - Tài chính' },
];

const generateGroupsAndUsers = () => {
  const groups: Group[] = [];
  const users: any[] = [];
  let groupId = 1;
  let userId = 1;

  units.forEach((unit, index) => {
    if (unit.name === 'Cục Hành chính tư pháp') {
      const specialGroups = [
        'Nhóm người dùng hồ sơ đăng ký khai sinh',
        'Nhóm người dùng hồ sơ đăng ký kết hôn',
        'Nhóm người dùng hồ sơ đăng ký khai tử',
        'Nhóm người dùng hồ sơ cấp giấy XNTNHN',
        'Nhóm người dùng hồ sơ đăng ký giám hộ',
        'Nhóm người dùng hồ sơ nhận cha, mẹ, con',
        'Nhóm người dùng hồ sơ thay đổi, cải chính hộ tịch',
        'Nhóm người dùng hồ sơ xác định lại dân tộc',
        'Nhóm người dùng hồ sơ khai sinh lưu động'
      ];
      specialGroups.forEach((groupName, i) => {
        groups.push({
          id: groupId++,
          name: groupName,
          code: `HCTP-${i+1}`,
          description: `Thực hiện ${groupName.toLowerCase()}`,
          department: unit.name,
          memberCount: Math.floor(Math.random() * 10) + 1,
          functionCount: 5,
          createdDate: '01/01/2024',
          status: 'active',
          members: [],
          functions: ['Xem dữ liệu', 'Sửa dữ liệu'],
          role: 'Người dùng cơ bản'
        });
      });
      // Thêm nhóm Quản trị dữ liệu
      groups.push({
        id: groupId++,
        name: `Nhóm quản trị dữ liệu`,
        code: `QT-${unit.id}`,
        description: `Quản lý, cấu hình và bảo mật dữ liệu tại ${unit.name}`,
        department: unit.name,
        memberCount: 3,
        functionCount: 20,
        createdDate: '01/01/2024',
        status: 'active',
        members: [],
        functions: ['Cấu hình hệ thống', 'Quản trị danh mục', 'Phân quyền'],
        role: 'Quản trị hệ thống'
      });
    } else {
      // 3 user groups per unit as per requirement
      groups.push({
        id: groupId++,
        name: `Nhóm người dùng theo nghiệp vụ`,
        code: `NV-${unit.id}`,
        description: `Thực hiện các nghiệp vụ chuyên môn tại ${unit.name}`,
        department: unit.name,
        memberCount: 5,
        functionCount: 10,
        createdDate: '01/01/2024',
        status: 'active',
        members: [],
        functions: ['Thêm dữ liệu', 'Sửa dữ liệu', 'Xem dữ liệu'],
        role: 'Người dùng cơ bản'
      });

      groups.push({
        id: groupId++,
        name: `Nhóm lãnh đạo nghiệp vụ`,
        code: `LD-${unit.id}`,
        description: `Phê duyệt, chỉ đạo hoạt động nghiệp vụ tại ${unit.name}`,
        department: unit.name,
        memberCount: 2,
        functionCount: 15,
        createdDate: '01/01/2024',
        status: 'active',
        members: [],
        functions: ['Phê duyệt', 'Xem báo cáo', 'Xem dữ liệu'],
        role: 'Quản trị nghiệp vụ'
      });

      groups.push({
        id: groupId++,
        name: `Nhóm quản trị dữ liệu`,
        code: `QT-${unit.id}`,
        description: `Quản lý, cấu hình và bảo mật dữ liệu tại ${unit.name}`,
        department: unit.name,
        memberCount: 3,
        functionCount: 20,
        createdDate: '01/01/2024',
        status: 'active',
        members: [],
        functions: ['Cấu hình hệ thống', 'Quản trị danh mục', 'Phân quyền'],
        role: 'Quản trị hệ thống'
      });
    }

    // 3 mock users per unit
    const unitUsers: any[] = [];
    unitUsers.push({ id: userId++, name: `Chuyên viên ${unit.id}`, email: `chuyenvien${unit.id}@moj.gov.vn`, department: unit.name });
    unitUsers.push({ id: userId++, name: `Lãnh đạo ${unit.id}`, email: `lanhdao${unit.id}@moj.gov.vn`, department: unit.name });
    unitUsers.push({ id: userId++, name: `Quản trị ${unit.id}`, email: `quantri${unit.id}@moj.gov.vn`, department: unit.name });
    users.push(...unitUsers);

    // Assign users to the groups of this unit
    groups.filter(g => g.department === unit.name).forEach(g => {
      // randomly assign 1 to 3 users
      const numUsers = Math.floor(Math.random() * 3) + 1;
      g.members = unitUsers.slice(0, numUsers);
      g.memberCount = g.members.length;
    });
  });

  return { groups, users };
};

const { groups: groupsData, users: availableUsers } = generateGroupsAndUsers();

const availableFunctions = [
  { id: 1, name: 'Xem dữ liệu', module: 'Dữ liệu' },
  { id: 2, name: 'Chỉnh sửa dữ liệu', module: 'Dữ liệu' },
  { id: 3, name: 'Xóa dữ liệu', module: 'Dữ liệu' },
  { id: 4, name: 'Xuất báo cáo', module: 'Báo cáo' },
  { id: 5, name: 'Nhập dữ liệu', module: 'Dữ liệu' },
  { id: 6, name: 'Phê duyệt', module: 'Quy trình' },
  { id: 7, name: 'Cấu hình hệ thống', module: 'Quản trị' },
  { id: 8, name: 'Quản lý người dùng', module: 'Quản trị' },
];

type ModalType = 'add' | 'edit' | 'detail' | 'delete' | 'add-members' | 'assign-functions' | null;
type DetailTabType = 'info' | 'function' | 'data' | 'data-scope';

interface GroupManagementPageProps {
  currentPage?: string;
}

export function GroupManagementPage({ currentPage }: GroupManagementPageProps) {
  const [groups, setGroups] = useState<Group[]>(groupsData);

  useEffect(() => {
    setGroups(groupsData);
  }, [groupsData]);

  const [unitsList, setUnitsList] = useState<{id: string, name: string}[]>([]);
  const [selectedUnitIdState, setSelectedUnitIdState] = useState<string>('');
  const [unitSearchTerm, setUnitSearchTerm] = useState('');

  // Fetch units from roles on mount
  useEffect(() => {
    const roles = getRoles();
    const unitNames = roles.map(r => r.selectedUnit).filter(Boolean) as string[];
    const uniqueUnits = [...new Set(unitNames)];
    const dynamicUnits = uniqueUnits.map((name, index) => ({ id: String(index + 1), name }));
    
    setUnitsList(dynamicUnits);
    if (dynamicUnits.length > 0 && !selectedUnitIdState) {
      setSelectedUnitIdState(dynamicUnits[0].id);
    }
  }, []);

  // Sync selectedUnitIdState with global currentPage from Sidebar
  useEffect(() => {
    const unitId = currentPage?.replace('admin-groups-', '') || '';
    if (unitId && unitsList.some(u => u.id === unitId)) {
      setSelectedUnitIdState(unitId);
    } else if (!selectedUnitIdState && unitsList.length > 0) {
      setSelectedUnitIdState(unitsList[0].id);
    }
  }, [currentPage]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [modalType, setModalType] = useState<ModalType>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<DetailTabType>('info');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectedFunctions, setSelectedFunctions] = useState<number[]>([]);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['collection', 'view-collected-data', 'processing', 'data-provisioning']);
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>('dashboard');
  const [selectedMenuItems, setSelectedMenuItems] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<{ [key: string]: string[] }>({});
  const [selectedDataPermissions, setSelectedDataPermissions] = useState<{ [sourceId: string]: { [tableId: string]: string[] } }>({});
  const [expandedDataSources, setExpandedDataSources] = useState<string[]>([]);
  const [selectedDataScopeCategory, setSelectedDataScopeCategory] = useState<string>('');
  

  
  // State for data scope field security methods
  const [fieldSecurityChecked, setFieldSecurityChecked] = useState<{ [key: string]: boolean }>(() => {
    const saved = localStorage.getItem('field_security_checked');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [fieldSecurityMethods, setFieldSecurityMethods] = useState<{ [key: string]: string }>(() => {
    const saved = localStorage.getItem('field_security_methods');
    return saved ? JSON.parse(saved) : {};
  });

  const [addedBlankRows, setAddedBlankRows] = useState<{ [tableId: string]: number }>({});
  const [securityTableEnabled, setSecurityTableEnabled] = useState<{ [tableId: string]: boolean }>({});

  const getActiveAlgorithms = () => {
    const defaultAlgs = [
      { id: 'partial', name: 'Làm mờ một phần (***-***-1234)' },
      { id: 'redacted', name: 'Che khuất hoàn toàn ([REDACTED])' },
      { id: 'hashed', name: 'Băm dữ liệu (Hashed)' },
      { id: 'nullify', name: 'Trả về Null/Rỗng' }
    ];
    const saved = localStorage.getItem('security_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.blurringAlgorithms) {
          const filtered = defaultAlgs.filter(alg => parsed.blurringAlgorithms[alg.id] !== false);
          return filtered.length > 0 ? filtered : defaultAlgs;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return defaultAlgs;
  };

  const isFieldChecked = (tableId: string, fieldName: string) => {
    if (!selectedGroup) return false;
    const key = `${selectedGroup.id}-${tableId}-${fieldName}`;
    if (fieldSecurityChecked[key] !== undefined) {
      return fieldSecurityChecked[key];
    }
    return false;
  };

  const handleFieldCheckChange = (tableId: string, fieldName: string, checked: boolean) => {
    if (!selectedGroup) return;
    const key = `${selectedGroup.id}-${tableId}-${fieldName}`;
    setFieldSecurityChecked(prev => ({
      ...prev,
      [key]: checked
    }));
    
    if (checked) {
      const activeAlgs = getActiveAlgorithms();
      if (activeAlgs.length > 0 && !fieldSecurityMethods[key]) {
        setFieldSecurityMethods(prev => ({
          ...prev,
          [key]: activeAlgs[0].id
        }));
      }
    }
  };

  const getFieldMethod = (tableId: string, fieldName: string) => {
    if (!selectedGroup) return '';
    const key = `${selectedGroup.id}-${tableId}-${fieldName}`;
    if (fieldSecurityMethods[key]) {
      return fieldSecurityMethods[key];
    }
    const activeAlgs = getActiveAlgorithms();
    return activeAlgs.length > 0 ? activeAlgs[0].id : '';
  };

  const handleFieldMethodChange = (tableId: string, fieldName: string, method: string) => {
    if (!selectedGroup) return;
    const key = `${selectedGroup.id}-${tableId}-${fieldName}`;
    setFieldSecurityMethods(prev => ({
      ...prev,
      [key]: method
    }));
  };

  const renderFieldSecurityTable = (tableId: string, allFields: string[]) => {
    const checkedFields = allFields.filter(f => isFieldChecked(tableId, f));
    const blankCount = addedBlankRows[tableId] || 0;
    const activeAlgorithms = getActiveAlgorithms();

    const handleAddRow = () => {
      const uncheckedFieldsCount = allFields.filter(f => !isFieldChecked(tableId, f)).length;
      if (blankCount >= uncheckedFieldsCount) {
        toast.warning('Tất cả các trường dữ liệu đều đã được cấu hình bảo mật.');
        return;
      }
      setAddedBlankRows(prev => ({
        ...prev,
        [tableId]: (prev[tableId] || 0) + 1
      }));
    };

    const handleRemoveBlankRow = () => {
      setAddedBlankRows(prev => ({
        ...prev,
        [tableId]: Math.max(0, (prev[tableId] || 0) - 1)
      }));
    };

    const handleSelectField = (field: string) => {
      handleFieldCheckChange(tableId, field, true);
      setAddedBlankRows(prev => ({
        ...prev,
        [tableId]: Math.max(0, (prev[tableId] || 0) - 1)
      }));
    };

    const handleRemoveField = (field: string) => {
      handleFieldCheckChange(tableId, field, false);
    };

    const handleFieldChange = (oldField: string, newField: string) => {
      const currentMethod = getFieldMethod(tableId, oldField);
      handleFieldCheckChange(tableId, oldField, false);
      handleFieldCheckChange(tableId, newField, true);
      handleFieldMethodChange(tableId, newField, currentMethod);
    };

    const isEnabled = securityTableEnabled[tableId] !== undefined ? securityTableEnabled[tableId] : checkedFields.length > 0;

    const handleToggleEnabled = (checked: boolean) => {
      setSecurityTableEnabled(prev => ({
        ...prev,
        [tableId]: checked
      }));
      if (!checked) {
        allFields.forEach(f => {
          handleFieldCheckChange(tableId, f, false);
        });
        setAddedBlankRows(prev => ({
          ...prev,
          [tableId]: 0
        }));
      }
    };

    return (
      <div className="mt-4 space-y-3">
        <label className="flex items-center gap-2 cursor-pointer text-[13px] font-medium text-[#020817] select-none">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => handleToggleEnabled(e.target.checked)}
            className={CHECKBOX_CLS}
          />
          <span>Cấu hình dữ liệu bảo mật</span>
        </label>

        {isEnabled && (
          <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden animate-in fade-in duration-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse collection-table text-[13px]">
                <thead className="bg-[#F8FAFC]">
                  <tr className="h-[42px]">
                    <th className={`${TH} text-center w-12`}>STT</th>
                    <th className={`${TH} text-left min-w-[200px]`}>Chọn trường bảo mật</th>
                    <th className={`${TH} text-left min-w-[250px]`}>Chọn cấu hình bảo mật</th>
                    <th className={`${TH} text-center w-20`}>
                      <RowIconAction label="Thêm trường bảo mật" onClick={handleAddRow}>
                        <Plus className="w-4 h-4" />
                      </RowIconAction>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {checkedFields.length === 0 && blankCount === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-[13px] text-[#64748B]">
                        Chưa cấu hình bảo mật trường nào. Bấm nút <span className="font-medium text-blue-600">+</span> ở cột thao tác để thêm.
                      </td>
                    </tr>
                  ) : (
                    <>
                      {checkedFields.map((field, index) => {
                        const availableFields = allFields.filter(f => !isFieldChecked(tableId, f) || f === field);
                        return (
                          <tr key={`checked-${field}`} className={TR}>
                            <td className={`${TD} text-center whitespace-nowrap`}>{index + 1}</td>
                            <td className={TD}>
                              <select
                                aria-label="Chọn trường bảo mật"
                                value={field}
                                onChange={(e) => handleFieldChange(field, e.target.value)}
                                className={INPUT_CLS}
                              >
                                {availableFields.map(f => (
                                  <option key={f} value={f}>{f}</option>
                                ))}
                              </select>
                            </td>
                            <td className={TD}>
                              <select
                                aria-label="Chọn cấu hình bảo mật"
                                value={getFieldMethod(tableId, field)}
                                onChange={(e) => handleFieldMethodChange(tableId, field, e.target.value)}
                                className={INPUT_CLS}
                              >
                                {activeAlgorithms.map(alg => (
                                  <option key={alg.id} value={alg.id}>{alg.name}</option>
                                ))}
                              </select>
                            </td>
                            <td className={`${TD} text-center`}>
                              <RowIconAction label="Xóa" onClick={() => handleRemoveField(field)}>
                                <Trash2 className="w-4 h-4" />
                              </RowIconAction>
                            </td>
                          </tr>
                        );
                      })}
                      {Array.from({ length: blankCount }).map((_, bIdx) => {
                        const availableFields = allFields.filter(f => !isFieldChecked(tableId, f));
                        return (
                          <tr key={`blank-${bIdx}`} className={TR}>
                            <td className={`${TD} text-center whitespace-nowrap`}>
                              {checkedFields.length + bIdx + 1}
                            </td>
                            <td className={TD}>
                              <select
                                aria-label="Chọn trường bảo mật"
                                value=""
                                onChange={(e) => handleSelectField(e.target.value)}
                                className={INPUT_CLS}
                              >
                                <option value="">-- Chọn trường bảo mật --</option>
                                {availableFields.map(f => (
                                  <option key={f} value={f}>{f}</option>
                                ))}
                              </select>
                            </td>
                            <td className={TD}>
                              <select
                                aria-label="Chọn cấu hình bảo mật"
                                disabled
                                value=""
                                className={INPUT_CLS}
                              >
                                <option value="">Chọn cấu hình bảo mật</option>
                              </select>
                            </td>
                            <td className={`${TD} text-center`}>
                              <RowIconAction label="Hủy" onClick={handleRemoveBlankRow}>
                                <Trash2 className="w-4 h-4" />
                              </RowIconAction>
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  // State to hold actual saved permissions per group
  const [savedMenuItems, setSavedMenuItems] = useState<{ [groupId: number]: string[] }>({});
  const [savedPermissions, setSavedPermissions] = useState<{ [groupId: number]: { [key: string]: string[] } }>({});
  const [savedDataPermissions, setSavedDataPermissions] = useState<{ [groupId: number]: { [sourceId: string]: { [tableId: string]: string[] } } }>({});
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    department: '',
    status: 'active' as 'active' | 'inactive',
    role: '',
    groupAdmin: '',
    modules: [] as string[],
  });

  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [memberDepartmentFilter, setMemberDepartmentFilter] = useState('');
  const [memberUnassignedOnly, setMemberUnassignedOnly] = useState(false);

  const currentUnit = unitsList.find(u => u.id === selectedUnitIdState);



  // Tìm kiếm & bộ lọc chỉ áp dụng khi bấm Tìm kiếm / Enter (compomennt.md 5.19)
  const [showFilters, setShowFilters] = useState(false);
  const [applied, setApplied] = useState<{ searchTerm: string; statusFilter: 'all' | 'active' | 'inactive' }>({ searchTerm: '', statusFilter: 'all' });
  const runSearch = () => setApplied({ searchTerm, statusFilter });

  const filteredGroups = groups.filter(group => {
    const matchesUnit = currentUnit ? group.department === currentUnit.name : true;

    const q = normalizeSearch(applied.searchTerm);
    const matchesSearch = normalizeSearch(group.name).includes(q) ||
      normalizeSearch(group.code).includes(q) ||
      normalizeSearch(group.department).includes(q);

    const matchesStatus = applied.statusFilter === 'all' || group.status === applied.statusFilter;
    
    return matchesUnit && matchesSearch && matchesStatus;
  });



  const handleOpenModal = (type: ModalType, group?: Group, tab: DetailTabType = 'info') => {
    setModalType(type);
    if (group) {
      setSelectedGroup(group);
      if (type === 'edit') {
        setFormData({
          name: group.name,
          code: group.code,
          description: group.description,
          department: group.department,
          status: group.status,
          role: group.role || '',
          groupAdmin: group.groupAdmin || '',
          modules: group.modules || [],
        });
      }
      if (type === 'detail') {
        setActiveDetailTab(tab);
        setSelectedDataScopeCategory('');
        if (tab === 'function') {
          setSelectedMenuItems(savedMenuItems[group.id] || []);
          setSelectedPermissions(savedPermissions[group.id] || {});
          setSelectedDataPermissions(savedDataPermissions[group.id] || {});
          setExpandedDataSources([]);
        }
      }
      if (type === 'add-members') {
        setSelectedUsers(group.members.map(m => m.id));
      } else {
        setSelectedUsers([]);
      }
    } else {
      setSelectedGroup(null);
      setFormData({
        name: '',
        code: '',
        description: '',
        department: currentUnit ? currentUnit.name : '',
        status: 'active',
        role: '',
        groupAdmin: '',
        modules: [],
      });
      setSelectedUsers([]);
    }
    setSelectedFunctions([]);
  };

  const handleSaveMembers = () => {
    if (!selectedGroup) return;

    const usersToAdd = availableUsers
      .filter(u => selectedUsers.includes(u.id))
      .map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.department
      }));

    const updatedGroup = {
      ...selectedGroup,
      members: usersToAdd,
      memberCount: usersToAdd.length
    };

    setGroups(prevGroups => prevGroups.map(group => 
      group.id === selectedGroup.id ? updatedGroup : group
    ));
    
    setSelectedGroup(updatedGroup);
    toast.success('Đã lưu danh sách thành viên thành công!');
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedGroup(null);
    setSelectedUsers([]);
    setSelectedFunctions([]);
    setActiveDetailTab('info');
  };

  const handleSaveGroup = () => {
    if (!formData.name || !formData.code || !formData.department || !formData.role) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc (*)!');
      return;
    }

    if (modalType === 'add') {
      if (groups.some(g => g.code.toUpperCase() === formData.code.toUpperCase())) {
        toast.error('Mã nhóm đã tồn tại trong hệ thống!');
        return;
      }

      const newGroup: Group = {
        id: groups.length > 0 ? Math.max(...groups.map(g => g.id)) + 1 : 1,
        name: formData.name,
        code: formData.code.toUpperCase(),
        description: formData.description,
        department: formData.department,
        status: formData.status,
        role: formData.role,
        memberCount: 0,
        functionCount: 0,
        createdDate: formatDateVN(new Date()),
        members: [],
        functions: [],
        groupAdmin: formData.groupAdmin,
        modules: formData.modules
      };
      setGroups([...groups, newGroup]);
      toast.success('Thêm nhóm người dùng mới thành công!');
    } else if (modalType === 'edit' && selectedGroup) {
      setGroups(groups.map(g => g.id === selectedGroup.id ? {
        ...g,
        name: formData.name,
        description: formData.description,
        department: formData.department,
        status: formData.status,
        role: formData.role,
        groupAdmin: formData.groupAdmin,
        modules: formData.modules
      } : g));
      toast.success('Cập nhật nhóm người dùng thành công!');
    }
    handleCloseModal();
  };

  const handleDeleteGroup = () => {
    if (selectedGroup) {
      setGroups(groups.filter(g => g.id !== selectedGroup.id));
      toast.success('Xóa nhóm người dùng thành công!');
      handleCloseModal();
    }
  };

  const toggleUser = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const isUserAssignedToAnyGroup = (userId: number) => {
    return groups.some(g => g.members && g.members.some(m => m.id === userId));
  };

  const currentGroupRole = modalType === 'add-members' && selectedGroup ? getRoles().find(r => r.name === selectedGroup.role) : null;
  const validUserIds = currentGroupRole?.assignedUserIds || [];

  const filteredAvailableUsers = availableUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(memberSearchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
                          user.department.toLowerCase().includes(memberSearchTerm.toLowerCase());
    const matchesDept = memberDepartmentFilter ? user.department === memberDepartmentFilter : true;
    
    return matchesSearch && matchesDept;
  });

  const selectAllUsers = () => {
    setSelectedUsers(filteredAvailableUsers.map(user => user.id));
  };

  const deselectAllUsers = () => {
    setSelectedUsers([]);
  };

  const isAllSelected = selectedUsers.length === filteredAvailableUsers.length && filteredAvailableUsers.length > 0;
  const isSomeSelected = selectedUsers.length > 0 && selectedUsers.length < filteredAvailableUsers.length;

  const toggleFunction = (functionId: number) => {
    if (selectedFunctions.includes(functionId)) {
      setSelectedFunctions(selectedFunctions.filter(id => id !== functionId));
    } else {
      setSelectedFunctions([...selectedFunctions, functionId]);
    }
  };

  const toggleMenu = (menuId: string) => {
    if (expandedMenus.includes(menuId)) {
      setExpandedMenus(expandedMenus.filter(id => id !== menuId));
    } else {
      setExpandedMenus([...expandedMenus, menuId]);
    }
  };

  const togglePermission = (functionId: string, action: string) => {
    const key = functionId;
    const current = selectedPermissions[key] || [];
    
    if (current.includes(action)) {
      setSelectedPermissions({
        ...selectedPermissions,
        [key]: current.filter(a => a !== action)
      });
    } else {
      setSelectedPermissions({
        ...selectedPermissions,
        [key]: [...current, action]
      });
    }
  };

  const toggleMenuItemSelection = (menuId: string) => {
    if (selectedMenuItems.includes(menuId)) {
      setSelectedMenuItems(selectedMenuItems.filter(id => id !== menuId));
    } else {
      setSelectedMenuItems([...selectedMenuItems, menuId]);
    }
  };

  const getRolePermissionsForGroup = () => {
    if (!selectedGroup) return [];
    const roleName = selectedGroup.role;
    const allRoles = getRoles();
    const role = allRoles.find(r => r.name === roleName || r.roleType === roleName);
    if (role) return role.permissions;
    
    // Fallback if role is not found but we know the name
    if (roleName === 'Quản trị hệ thống' || roleName === 'Quản trị hệ thống nguồn') {
      return ['Quản lý thu thập', 'Xử lý dữ liệu', 'Dữ liệu chủ', 'Quản lý dữ liệu mở', 'Xem tổng quan', 'Cung cấp số liệu', 'Quản lý vận hành'];
    }
    if (roleName === 'Quản trị nghiệp vụ') {
       return ['Xem tổng quan', 'Quản lý thu thập', 'Xử lý dữ liệu'];
    }
    if (roleName === 'Người dùng cơ bản') {
       return ['Xem tổng quan'];
    }
    return [];
  };

  const menuToPermissionMap: Record<string, string> = {
    'Tổng quan': 'Xem tổng quan',
    'Quản lý thu thập': 'Quản lý thu thập',
    'Xử lý dữ liệu': 'Xử lý dữ liệu',
    'Dữ liệu mở': 'Quản lý dữ liệu mở',
    'Quản lý dữ liệu chủ': 'Dữ liệu chủ',
    'Cung cấp dữ liệu': 'Cung cấp số liệu',
    'Quản trị & vận hành': 'Quản lý vận hành'
  };

  const getAuthorizedMenuStructure = () => {
    if (!selectedGroup) return filteredMenuStructure;
    
    const rolePermissions = getRolePermissionsForGroup();
    if (rolePermissions && rolePermissions.length > 0) {
      return filteredMenuStructure.filter(menuItem => {
        const requiredPermission = menuToPermissionMap[menuItem.name];
        if (requiredPermission) {
          return rolePermissions.includes(requiredPermission);
        }
        return true; 
      });
    }
    
    return filteredMenuStructure;
  };

  const authorizedMenuStructure = getAuthorizedMenuStructure();

  const getAllSelectableMenuIds = (): string[] => {
    const selectableIds: string[] = [];
    
    const traverse = (items: MenuItem[]) => {
      items.forEach(item => {
        const hasFunctions = item.functions && item.functions.length > 0;
        const hasChildren = item.children && item.children.length > 0;
        
        // Menu có thể chọn nếu có functions hoặc không có children
        if (hasFunctions || !hasChildren) {
          selectableIds.push(item.id);
        }
        
        if (hasChildren) {
          traverse(item.children!);
        }
      });
    };
    
    traverse(authorizedMenuStructure);
    return selectableIds;
  };

  const selectAllMenuItems = () => {
    setSelectedMenuItems(getAllSelectableMenuIds());
  };

  const deselectAllMenuItems = () => {
    setSelectedMenuItems([]);
  };

  const isAllMenuItemsSelected = () => {
    const allSelectable = getAllSelectableMenuIds();
    return allSelectable.length > 0 && selectedMenuItems.length === allSelectable.length;
  };

  const isSomeMenuItemsSelected = () => {
    return selectedMenuItems.length > 0 && !isAllMenuItemsSelected();
  };

  const getMenuLabel = (id: string) => {
    let label = '';
    const traverse = (items: MenuItem[]) => {
      for (const item of items) {
        if (item.id === id) {
          label = item.name;
          return true;
        }
        if (item.children && traverse(item.children)) {
          return true;
        }
      }
      return false;
    };
    traverse(filteredMenuStructure);
    return label;
  };

  const selectAllPermissionsForFunction = (functionId: string, actions: string[]) => {
    setSelectedPermissions({
      ...selectedPermissions,
      [functionId]: actions
    });
  };

  const deselectAllPermissionsForFunction = (functionId: string) => {
    setSelectedPermissions({
      ...selectedPermissions,
      [functionId]: []
    });
  };

  const isAllPermissionsSelectedForFunction = (functionId: string, actions: string[]): boolean => {
    const current = selectedPermissions[functionId] || [];
    return actions.length > 0 && current.length === actions.length;
  };

  const isSomePermissionsSelectedForFunction = (functionId: string, actions: string[]): boolean => {
    const current = selectedPermissions[functionId] || [];
    return current.length > 0 && current.length < actions.length;
  };

  const getSelectedMenuFunctions = (): MenuFunction[] => {
    const allFunctions: MenuFunction[] = [];
    
    const findFunctions = (items: MenuItem[], targetId: string, currentPath: string[] = []) => {
      for (const item of items) {
        if (item.id === targetId) {
          if (item.functions && item.functions.length > 0) {
            const augmentedFunctions = item.functions.map(f => ({
              ...f,
              name: currentPath.length > 0 ? `${currentPath.join(' > ')} > ${f.name}` : f.name
            }));
            allFunctions.push(...augmentedFunctions);
          } else if (!item.children || item.children.length === 0) {
            allFunctions.push({
              id: `${item.id}-func`,
              name: currentPath.length > 0 ? `${currentPath.join(' > ')} > ${item.name}` : item.name,
              actions: ['Xem', 'Thêm', 'Sửa', 'Xóa', 'Xuất Excel']
            });
          }
          return;
        }
        if (item.children) {
          findFunctions(item.children, targetId, [...currentPath, item.name]);
        }
      }
    };

    selectedMenuItems.forEach(menuId => {
      findFunctions(filteredMenuStructure, menuId);
    });
    
    return allFunctions;
  };

  const getCurrentMenuFunctions = (menuId: string): MenuFunction[] => {
    let result: MenuFunction[] = [];
    
    const findFunctions = (items: MenuItem[], targetId: string, currentPath: string[] = []) => {
      for (const item of items) {
        if (item.id === targetId) {
          if (item.functions && item.functions.length > 0) {
            result = item.functions.map(f => ({
              ...f,
              name: currentPath.length > 0 ? `${currentPath.join(' > ')} > ${f.name}` : f.name
            }));
          } else if (!item.children || item.children.length === 0) {
            result = [{
              id: `${item.id}-func`,
              name: currentPath.length > 0 ? `${currentPath.join(' > ')} > ${item.name}` : item.name,
              actions: ['Xem', 'Thêm', 'Sửa', 'Xóa', 'Xuất Excel']
            }];
          }
          return;
        }
        if (item.children) {
          findFunctions(item.children, targetId, [...currentPath, item.name]);
        }
      }
    };
    
    findFunctions(filteredMenuStructure, menuId);
    return result;
  };

  const hasChildrenWithFunctions = (item: MenuItem): boolean => {
    return !!item.functions || !!(item.children && item.children.length > 0);
  };

  const renderMenuTree = (items: MenuItem[], level: number = 0) => {
    return items.map((item) => {
      const isExpanded = expandedMenus.includes(item.id);
      const isSelected = selectedMenuItems.includes(item.id);
      const hasChildren = item.children && item.children.length > 0;
      const hasFunctions = item.functions && item.functions.length > 0;
      const canBeSelected = hasFunctions;

      return (
        <div key={item.id}>
          <div
            className={`flex items-center gap-2 px-3 min-h-9 py-1.5 rounded-lg transition-colors ${
              isSelected ? 'bg-[#EAF3FF]' : 'hover:bg-[#F8FAFC]'
            }`}
          >
            {Array.from({ length: level }).map((_, i) => (
              <div key={i} className="w-3 flex-shrink-0" />
            ))}
            {/* Checkbox for selectable items */}
            {canBeSelected && (
              <input
                type="checkbox"
                title={`Chọn ${item.name}`}
                aria-label={`Chọn ${item.name}`}
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  toggleMenuItemSelection(item.id);
                }}
                className={CHECKBOX_CLS}
              />
            )}
            {!canBeSelected && <div className="w-4" />}

            {/* Expand/Collapse icon */}
            <div
              onClick={() => {
                if (hasChildren) {
                  toggleMenu(item.id);
                }
              }}
              className="cursor-pointer flex items-center gap-2 flex-1"
            >
              {hasChildren && (
                isExpanded ?
                  <ChevronDown className="w-4 h-4 flex-shrink-0 text-[#475569]" /> :
                  <ChevronRight className="w-4 h-4 flex-shrink-0 text-[#475569]" />
              )}
              {!hasChildren && <div className="w-4" />}
              <span className={`flex-1 ${level === 0 ? 'text-[14px] font-medium' : 'text-[13px]'} ${isSelected ? 'text-blue-600' : 'text-[#020817]'}`}>
                {item.name}
              </span>
            </div>
          </div>
          {/* Inline Actions for selected menus that have functions */}
          {isSelected && hasFunctions && (
            <div className="my-2 pl-4 border-l-2 border-[#E2E8F0] space-y-2" style={{ marginLeft: `${level * 12 + 40}px` }}>
              {item.functions!.map(func => (
                <div key={func.id} className="flex flex-wrap gap-x-6 gap-y-2 items-center bg-white p-3 rounded-lg border border-[#E2E8F0]">
                  <label className="flex items-center gap-2 text-[13px] text-blue-600 font-medium cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={isAllPermissionsSelectedForFunction(func.id, func.actions)}
                      ref={(input) => {
                        if (input) {
                          input.indeterminate = isSomePermissionsSelectedForFunction(func.id, func.actions);
                        }
                      }}
                      onChange={() => {
                        if (isAllPermissionsSelectedForFunction(func.id, func.actions)) {
                          deselectAllPermissionsForFunction(func.id);
                        } else {
                          selectAllPermissionsForFunction(func.id, func.actions);
                        }
                      }}
                      className={CHECKBOX_CLS}
                    />
                    Chọn tất cả
                  </label>
                  <div className="h-4 w-px bg-[#CBD5E1] hidden sm:block"></div>
                  {func.actions.map(action => (
                    <label key={action} className="flex items-center gap-2 text-[13px] text-[#020817] cursor-pointer hover:text-blue-600 transition-colors">
                      <input
                        type="checkbox"
                        checked={(selectedPermissions[func.id] || []).includes(action)}
                        onChange={() => togglePermission(func.id, action)}
                        className={CHECKBOX_CLS}
                      />
                      {action}
                    </label>
                  ))}
                </div>
              ))}
            </div>
          )}
          {hasChildren && isExpanded && (
            <div>
              {renderMenuTree(item.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-row gap-6 items-start">
      {/* LEFT COLUMN: Danh mục đơn vị */}
      <div className="w-80 bg-white rounded-2xl border border-[#E2E8F0] flex flex-col shrink-0 overflow-hidden self-stretch h-[calc(100vh-140px)] sticky top-4 p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className={`${SECTION_TITLE} !mb-0`}>{BAR}Danh mục đơn vị</h3>
        </div>

        {/* Search */}
        <div className="px-0.5">
          <input
            type="text"
            aria-label="Tìm kiếm đơn vị"
            placeholder="Tìm kiếm đơn vị..."
            value={unitSearchTerm}
            onChange={(e) => setUnitSearchTerm(e.target.value)}
            className={INPUT_CLS}
          />
        </div>

        {/* List of Units */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          {unitsList
            .filter((unit) =>
              normalizeSearch(unit.name).includes(normalizeSearch(unitSearchTerm))
            )
            .map((unit, index) => {
              const isActive = selectedUnitIdState === unit.id;
              return (
                <div
                  key={unit.id}
                  className={`group flex items-center justify-between rounded-[10px] px-2.5 min-h-9 py-2 transition-colors text-[13px] cursor-pointer relative ${
                    isActive
                      ? "bg-[#EAF3FF] text-blue-600 font-medium"
                      : "text-[#020817] hover:bg-[#F8FAFC]"
                  }`}
                  onClick={() => setSelectedUnitIdState(unit.id)}
                >
                  <div className="flex items-center flex-1 min-w-0 gap-2">
                    <Building2 className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-[#475569]'}`} />
                    <TruncatedText text={unit.name} className="flex-1 min-w-0" />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* RIGHT COLUMN: Nhóm người dùng - Main content */}
      <div className="flex-1 space-y-4 min-w-0">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-[20px] font-bold text-[#2A0F0F] leading-8">Quản lý nhóm người dùng</h1>
            <p className="text-[13px] text-[#64748B]">
              Đơn vị quản lý: <span className="font-medium text-blue-600">{currentUnit ? currentUnit.name : 'Tất cả đơn vị'}</span>
            </p>
          </div>
        </div>

        {/* Stats (mục 5.6.1) */}
        {/* 3 thẻ chia đều, căn thẳng mép trái/phải với thanh tìm kiếm (PM bỏ thẻ "TB thành viên/nhóm") */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard icon={UsersRound} iconColor="blue" title="Tổng nhóm" value="45" />
          <StatCard icon={UsersRound} iconColor="green" title="Đang hoạt động" value="42" />
          <StatCard icon={Users} iconColor="purple" title="Tổng thành viên" value="348" />
        </div>

        {/* Search and Actions (mục 5.19) */}
        <div className="px-0.5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 flex items-center gap-1.5">
              <input
                type="text"
                aria-label="Tìm kiếm nhóm người dùng"
                placeholder="Tìm kiếm theo tên nhóm, mã nhóm, đơn vị..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
                className={SEARCH_INPUT_CLS}
              />
              <button type="button" aria-label="Tìm kiếm" title="Tìm kiếm" onClick={runSearch} className={SEARCH_BTN_CLS}>
                <Search className="w-5 h-5" />
              </button>
              <button
                type="button"
                aria-label="Bộ lọc"
                title="Bộ lọc"
                aria-expanded={showFilters}
                onClick={() => setShowFilters(!showFilters)}
                className={filterBtnClass(showFilters)}
              >
                {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={() => handleOpenModal('add')} className={BTN_PRIMARY}>
                <Plus className="w-4 h-4" />
                Thêm nhóm mới
              </button>
            </div>
          </div>

          {showFilters && (
            <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
              <div>
                <label className={FILTER_LABEL}>Trạng thái</label>
                <select
                  title="Lọc theo trạng thái"
                  aria-label="Lọc theo trạng thái"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
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

      {/* Groups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredGroups.map((group) => (
          <div key={group.id} className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden hover:border-[#CBD5E1] transition-colors flex flex-col">
            {/* Header */}
            <div className="p-4 flex-1">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <h3 className={`${GROUP_TITLE} min-w-0`}><TruncatedText text={group.name} /></h3>
                    <Badge label={group.code} variant="blue" />
                  </div>
                  <TruncatedText text={group.description} className="text-[13px] text-[#020817]" />
                  <p className="text-[12px] text-[#64748B]">Đơn vị: {group.department} • Vai trò: <span className="font-medium text-blue-600">{group.role || 'Chưa gán'}</span></p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <RowIconAction label="Chỉnh sửa" onClick={() => handleOpenModal('edit', group)}>
                    <Edit className="w-4 h-4" />
                  </RowIconAction>
                  <RowIconAction label="Xóa" onClick={() => handleOpenModal('delete', group)}>
                    <Trash2 className="w-4 h-4" />
                  </RowIconAction>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-[#E2E8F0]">
                <div className="space-y-1">
                  <div className="text-[12px] text-[#64748B]">Thành viên</div>
                  <div className="text-[13px] font-semibold text-[#0F172A] tabular-nums">{group.memberCount}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[12px] text-[#64748B]">Chức năng</div>
                  <div className="text-[13px] font-semibold text-[#0F172A] tabular-nums">{group.functionCount}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[12px] text-[#64748B]">Trạng thái</div>
                  <Badge
                    label={group.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    variant={group.status === 'active' ? 'green' : 'slate'}
                  />
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#E2E8F0] text-[12px] text-[#64748B]">
                Tạo ngày: {group.createdDate}
              </div>
            </div>

            {/* Actions */}
            <div className="px-4 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex gap-2">
              <button
                type="button"
                onClick={() => handleOpenModal('detail', group, 'info')}
                className={`${BTN_OUTLINE} flex-1`}
              >
                <Eye className="w-4 h-4" />
                Chi tiết
              </button>
              <button
                type="button"
                onClick={() => handleOpenModal('add-members', group)}
                className={`${BTN_OUTLINE} flex-1`}
              >
                <UserPlus className="w-4 h-4" />
                Thành viên
              </button>
              <button
                type="button"
                onClick={() => handleOpenModal('detail', group, 'function')}
                className={`${BTN_OUTLINE} flex-1`}
              >
                <Lock className="w-4 h-4" />
                Phân quyền
              </button>
            </div>
          </div>
        ))}
      </div>
      </div>

      {/* Add/Edit Modal */}
      {(modalType === 'add' || modalType === 'edit') && (
        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4" onClick={handleCloseModal}>
          <div role="dialog" aria-modal="true" aria-labelledby="group-form-title" className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="shrink-0 px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
              <h3 id="group-form-title" className="text-[16px] font-medium text-[#020817]">
                {modalType === 'add' ? 'Thêm nhóm người dùng mới' : 'Chỉnh sửa nhóm người dùng'}
              </h3>
              <button type="button" title="Đóng" aria-label="Đóng" onClick={handleCloseModal} className={BTN_GHOST_ICON}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-6 py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL_CLS}>
                      Tên nhóm <span className={REQUIRED_MARK}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={INPUT_CLS}
                      placeholder="Nhập tên nhóm"
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLS}>
                      Mã nhóm <span className={REQUIRED_MARK}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className={INPUT_CLS}
                      placeholder="VD: PLDC"
                      disabled={modalType === 'edit'}
                    />
                  </div>
                </div>
                <div>
                  <label className={LABEL_CLS}>Mô tả</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className={TEXTAREA_CLS}
                    placeholder="Mô tả về nhóm người dùng"
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>
                    Đơn vị <span className={REQUIRED_MARK}>*</span>
                  </label>
                  <select
                    title="Đơn vị"
                    aria-label="Đơn vị"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    disabled={true}
                    className={INPUT_CLS}
                  >
                    <option value="">{currentUnit ? '-- Chọn đơn vị --' : '-- Vui lòng chọn một đơn vị ở menu trái --'}</option>
                    {unitsList.map(unit => (
                      <option key={unit.id} value={unit.name}>{unit.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLS}>
                    Vai trò <span className={REQUIRED_MARK}>*</span>
                  </label>
                  <select
                    title="Vai trò"
                    aria-label="Vai trò"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className={INPUT_CLS}
                  >
                    <option value="">-- Chọn vai trò --</option>
                    {getRoles().map(role => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLS}>Trạng thái</label>
                  <select
                    title="Trạng thái"
                    aria-label="Trạng thái"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className={INPUT_CLS}
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="shrink-0 px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className={BTN_OUTLINE}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveGroup}
                className={BTN_PRIMARY}
              >
                {modalType === 'add' ? 'Thêm nhóm' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal with Tabs */}
      {modalType === 'detail' && selectedGroup && (
        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4" onClick={handleCloseModal}>
          <div role="dialog" aria-modal="true" aria-labelledby="group-detail-title" className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="shrink-0 px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 id="group-detail-title" className="text-[16px] font-medium text-[#020817]">
                  {activeDetailTab === 'function' || activeDetailTab === 'data' || activeDetailTab === 'data-scope' ? 'Phân quyền nhóm người dùng' : 'Chi tiết nhóm'}: {selectedGroup.name}
                </h3>
                <p className="text-[13px] text-[#64748B]">Mã nhóm: {selectedGroup.code}</p>
              </div>
              <button type="button" onClick={handleCloseModal} className={BTN_GHOST_ICON} title="Đóng" aria-label="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps Navigation for Permissions */}
            {(activeDetailTab === 'function' || activeDetailTab === 'data' || activeDetailTab === 'data-scope') && (
              <div className="shrink-0 flex border-b border-[#E2E8F0] px-6 py-3 items-center gap-4 text-[13px]">
                <div className="flex items-center gap-2 text-blue-600 font-medium">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-medium bg-blue-600 text-white">1</div>
                  Phân quyền chức năng & thao tác
                </div>
                <div className={`h-0.5 w-8 rounded-full ${activeDetailTab === 'data-scope' ? 'bg-blue-600' : 'bg-[#E2E8F0]'}`}></div>
                <div className={`flex items-center gap-2 ${activeDetailTab === 'data-scope' ? 'text-blue-600 font-medium' : 'text-[#64748B]'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-medium ${activeDetailTab === 'data-scope' ? 'bg-blue-600 text-white' : 'bg-[#E2E8F0] text-[#475569]'}`}>2</div>
                  Phạm vi dữ liệu
                </div>
              </div>
            )}

            {/* Tab Contents */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-6 py-4">
              {activeDetailTab === 'info' && (
                <div className="space-y-4">
                  {/* Basic Info */}
                  <div className={BLOCK_CARD}>
                    <h4 className={SECTION_TITLE}>{BAR}Thông tin chung</h4>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      <div className="space-y-1">
                        <div className={FIELD_LABEL}>Tên nhóm</div>
                        <div className={`${FIELD_VALUE} break-words`}>{selectedGroup.name || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className={FIELD_LABEL}>Mã nhóm</div>
                        <Badge label={selectedGroup.code} variant="blue" />
                      </div>
                      <div className="space-y-1 col-span-2">
                        <div className={FIELD_LABEL}>Mô tả</div>
                        <div className={`${FIELD_VALUE} whitespace-pre-line`}>{selectedGroup.description || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className={FIELD_LABEL}>Đơn vị</div>
                        <div className={FIELD_VALUE}>{selectedGroup.department || '-'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className={FIELD_LABEL}>Vai trò</div>
                        <div className={FIELD_VALUE}>{selectedGroup.role || 'Chưa gán vai trò'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className={FIELD_LABEL}>Trạng thái</div>
                        <Badge
                          label={selectedGroup.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                          variant={selectedGroup.status === 'active' ? 'green' : 'slate'}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Members */}
                  <div className={BLOCK_CARD}>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <h4 className={`${SECTION_TITLE} !mb-0`}>{BAR}Danh sách thành viên ({selectedGroup.memberCount})</h4>
                      <button
                        type="button"
                        onClick={() => {
                          handleCloseModal();
                          setTimeout(() => handleOpenModal('add-members', selectedGroup), 100);
                        }}
                        className="text-[13px] font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      >
                        <UserPlus className="w-4 h-4" />
                        Thêm thành viên
                      </button>
                    </div>
                    {selectedGroup.members.length > 0 ? (
                      <div className="space-y-2">
                        {selectedGroup.members.map((member) => (
                          <div key={member.id} className="flex items-center justify-between gap-3 px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                            <div className="flex-1 min-w-0">
                              <div className="text-[13px] text-[#020817]">{member.name}</div>
                              <div className="text-[12px] text-[#64748B]">{member.email} • {member.role}</div>
                            </div>
                            <RowIconAction
                              label="Xóa khỏi nhóm"
                              onClick={() => {
                                const newMembers = selectedGroup.members.filter(m => m.id !== member.id);
                                const updatedGroup = {
                                  ...selectedGroup,
                                  members: newMembers,
                                  memberCount: newMembers.length
                                };
                                setSelectedGroup(updatedGroup);
                                setGroups(prev => prev.map(g => g.id === updatedGroup.id ? updatedGroup : g));
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </RowIconAction>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-[13px] text-[#64748B]">
                        Chưa có thành viên nào trong nhóm
                      </div>
                    )}
                  </div>

                  {/* Functions */}
                  <div className={BLOCK_CARD}>
                    <h4 className={SECTION_TITLE}>
                      {BAR}Danh sách chức năng được phân quyền ({savedMenuItems[selectedGroup.id]?.length || 0})
                    </h4>
                    {(savedMenuItems[selectedGroup.id] && savedMenuItems[selectedGroup.id].length > 0) ? (
                      <div className="flex flex-wrap gap-2">
                        {savedMenuItems[selectedGroup.id].map((menuId, index) => {
                          const label = getMenuLabel(menuId);
                          if (!label) return null;
                          return (
                            <Badge key={index} label={label} variant="blue" />
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-[13px] text-[#64748B]">
                        Nhóm này chưa được phân quyền chức năng nào
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeDetailTab === 'function' && (
                <div className={BLOCK_CARD}>
                  <h4 className={SECTION_TITLE}>{BAR}Bước 1: Phân quyền chức năng & thao tác</h4>
                  <p className="text-[13px] text-[#64748B] -mt-2 mb-4">Vui lòng chọn các menu mà nhóm người dùng này được phép truy cập, sau đó chọn quyền thao tác tương ứng.</p>

                  <div className="mb-3">
                    <label className={SELECT_ALL_BOX}>
                      <input
                        type="checkbox"
                        checked={isAllMenuItemsSelected()}
                        ref={(input) => {
                          if (input) {
                            input.indeterminate = isSomeMenuItemsSelected();
                          }
                        }}
                        onChange={() => {
                          if (isAllMenuItemsSelected()) {
                            deselectAllMenuItems();
                          } else {
                            selectAllMenuItems();
                          }
                        }}
                        className={CHECKBOX_CLS}
                      />
                      <div className="flex-1">
                        <div className="text-[13px] text-[#020817]">
                          {isAllMenuItemsSelected()
                            ? 'Bỏ chọn tất cả'
                            : isSomeMenuItemsSelected()
                              ? `Chọn tất cả (đã chọn ${selectedMenuItems.length}/${getAllSelectableMenuIds().length})`
                              : 'Chọn tất cả'}
                        </div>
                      </div>
                    </label>
                  </div>

                  <div className="space-y-1 bg-white border border-[#E2E8F0] rounded-lg p-2">
                    {renderMenuTree(authorizedMenuStructure)}
                  </div>
                </div>
              )}
              {activeDetailTab === 'data-scope' && (
                <div className="space-y-4">
                  <div className={BLOCK_CARD}>
                    <h4 className={SECTION_TITLE}>
                      {BAR}Chọn phạm vi dữ liệu
                    </h4>
                    <select
                      title="Chọn phạm vi dữ liệu"
                      aria-label="Chọn phạm vi dữ liệu"
                      value={selectedDataScopeCategory}
                      onChange={(e) => setSelectedDataScopeCategory(e.target.value)}
                      className={INPUT_CLS}
                    >
                      <option value="">-- Chọn phạm vi dữ liệu --</option>
                      <option value="Dữ liệu thu thập">Dữ liệu thu thập</option>
                      <option value="Dữ liệu tại CSDL đích (Dữ liệu đã xử lý)">Dữ liệu tại CSDL đích (Dữ liệu đã xử lý)</option>
                      <option value="Dữ liệu chia sẻ">Dữ liệu chia sẻ</option>
                      <option value="Dữ liệu mở">Dữ liệu mở</option>
                      <option value="Dữ liệu danh mục">Dữ liệu danh mục</option>
                      <option value="Dữ liệu chủ">Dữ liệu chủ</option>
                    </select>
                  </div>

                  {!selectedDataScopeCategory ? (
                    <div className="p-8 text-center text-[13px] text-[#64748B] bg-[#F8FAFC] rounded-lg border border-dashed border-[#CBD5E1]">
                      Vui lòng chọn phạm vi dữ liệu để phân quyền
                    </div>
                  ) : (
                    <div className={`${BLOCK_CARD} animate-in fade-in`}>
                      <h4 className={SECTION_TITLE}>
                        {BAR}Bước 2: Phân quyền phạm vi dữ liệu
                      </h4>
                    <p className="text-[13px] text-[#64748B] -mt-2 mb-4">Thiết lập phạm vi dữ liệu (Bảng, Trường dữ liệu, Bản ghi) được phép truy cập.</p>

                    <div className="space-y-4">
                      {/* CSDL Hộ Tịch */}
                      <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
                        <div className="bg-[#F8FAFC] px-4 py-3 border-b border-[#E2E8F0] flex justify-between items-center">
                          <div className={GROUP_TITLE}>CSDL Hộ tịch điện tử</div>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="space-y-3 border border-[#E2E8F0] rounded-lg p-3">
                            <div className="flex flex-wrap items-center gap-3">
                              <label className="flex items-center gap-2 cursor-pointer flex-shrink-0 min-w-[220px]">
                                <input type="checkbox" defaultChecked className={CHECKBOX_CLS} />
                                <span className="text-[13px] font-medium text-[#020817]">Bảng: Thông tin khai sinh</span>
                              </label>

                              <select aria-label="Điều kiện hiển thị" title="Điều kiện hiển thị" className={`${INPUT_CLS} !w-auto min-w-[180px]`}>
                                <option value="">Điều kiện hiển thị</option>
                                <option value="stt">STT</option>
                                <option value="province">Tỉnh/Thành phố</option>
                                <option value="dob">Ngày sinh</option>
                              </select>

                              <input type="text" aria-label="Giá trị điều kiện hiển thị" title="Giá trị điều kiện hiển thị" className={`${INPUT_CLS} !w-40`} placeholder="Nhập giá trị" />


                            </div>

                            {renderFieldSecurityTable('khaisinh', ['Mã định danh', 'Họ tên', 'Ngày sinh', 'Giới tính', 'Dân tộc'])}
                          </div>

                          <div className="space-y-3 border border-[#E2E8F0] rounded-lg p-3">
                            <div className="flex flex-wrap items-center gap-3">
                              <label className="flex items-center gap-2 cursor-pointer flex-shrink-0 min-w-[220px]">
                                <input type="checkbox" defaultChecked className={CHECKBOX_CLS} />
                                <span className="text-[13px] font-medium text-[#020817]">Bảng: Thông tin kết hôn</span>
                              </label>

                              <select aria-label="Điều kiện hiển thị" title="Điều kiện hiển thị" className={`${INPUT_CLS} !w-auto min-w-[180px]`}>
                                <option value="">Điều kiện hiển thị</option>
                                <option value="stt">STT</option>
                                <option value="province">Tỉnh/Thành phố</option>
                                <option value="date">Ngày đăng ký</option>
                              </select>

                              <input type="text" aria-label="Giá trị điều kiện hiển thị" title="Giá trị điều kiện hiển thị" className={`${INPUT_CLS} !w-40`} placeholder="Nhập giá trị" />


                            </div>

                            {renderFieldSecurityTable('kethon', ['Mã định danh vợ/chồng', 'Ngày đăng ký', 'Nơi đăng ký'])}
                          </div>
                        </div>
                      </div>

                      {/* CSDL Quốc Tịch */}
                      <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
                        <div className="bg-[#F8FAFC] px-4 py-3 border-b border-[#E2E8F0] flex justify-between items-center">
                          <div className={GROUP_TITLE}>CSDL Quốc tịch</div>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="space-y-3 border border-[#E2E8F0] rounded-lg p-3 bg-[#F8FAFC]">
                            <div className="flex justify-between items-center">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className={CHECKBOX_CLS} />
                                <span className="text-[13px] font-medium text-[#64748B]">Bảng: Hồ sơ xin thôi quốc tịch</span>
                              </label>

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
              {activeDetailTab === 'info' ? (
                <>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className={BTN_OUTLINE}
                  >
                    Đóng
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleCloseModal();
                      setTimeout(() => handleOpenModal('edit', selectedGroup), 100);
                    }}
                    className={BTN_PRIMARY}
                  >
                    Chỉnh sửa nhóm
                  </button>
                </>
              ) : activeDetailTab === 'function' ? (
                <>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className={BTN_OUTLINE}
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedMenuItems.length === 0) {
                        toast.error('Vui lòng chọn ít nhất một menu chức năng!');
                        return;
                      }
                      setActiveDetailTab('data-scope');
                    }}
                    className={BTN_PRIMARY}
                  >
                    Tiếp tục
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveDetailTab('function')}
                    className={BTN_OUTLINE}
                  >
                    Quay lại
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedGroup) {
                        setSavedMenuItems({ ...savedMenuItems, [selectedGroup.id]: selectedMenuItems });
                        setSavedPermissions({ ...savedPermissions, [selectedGroup.id]: selectedPermissions });
                        localStorage.setItem('field_security_checked', JSON.stringify(fieldSecurityChecked));
                        localStorage.setItem('field_security_methods', JSON.stringify(fieldSecurityMethods));
                      }
                      toast.success('Đã lưu cấu hình phân quyền thành công!');
                      handleCloseModal();
                    }}
                    className={BTN_PRIMARY}
                  >
                    Lưu phân quyền
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Members Modal */}
      {modalType === 'add-members' && selectedGroup && (
        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4" onClick={handleCloseModal}>
          <div role="dialog" aria-modal="true" aria-labelledby="group-members-title" className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="shrink-0 px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 id="group-members-title" className="text-[16px] font-medium text-[#020817]">Thêm thành viên vào nhóm</h3>
                <p className="text-[13px] text-[#64748B]">Nhóm: {selectedGroup.name}</p>
              </div>
              <button type="button" title="Đóng" aria-label="Đóng" onClick={handleCloseModal} className={BTN_GHOST_ICON}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-6 py-4">
              <div className="mb-3 flex flex-col lg:flex-row gap-2 lg:items-center px-0.5 pt-0.5">
                <div className="flex-1">
                  <input
                    type="text"
                    title="Tìm kiếm người dùng"
                    aria-label="Tìm kiếm người dùng"
                    value={memberSearchTerm}
                    onChange={(e) => setMemberSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm người dùng..."
                    className={SEARCH_INPUT_CLS}
                  />
                </div>
                <div className="w-full lg:w-1/3">
                  <select
                    title="Chọn đơn vị"
                    aria-label="Chọn đơn vị"
                    value={memberDepartmentFilter}
                    onChange={(e) => setMemberDepartmentFilter(e.target.value)}
                    className={INPUT_CLS}
                  >
                    <option value="">Tất cả đơn vị</option>
                    {unitsList.map(unit => (
                      <option key={unit.id} value={unit.name}>{unit.name}</option>
                    ))}
                  </select>
                </div>
              </div>

                  {/* Select All Checkbox */}
                  <div className="mb-2">
                    <label className="flex items-center gap-3 px-3 h-10 bg-[#EAF3FF] border border-[#BFDBFE] rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        ref={(input) => {
                          if (input) {
                            input.indeterminate = isSomeSelected;
                          }
                        }}
                        onChange={() => {
                          if (isAllSelected) {
                            deselectAllUsers();
                          } else {
                            selectAllUsers();
                          }
                        }}
                        className={CHECKBOX_CLS}
                      />
                      <div className="flex-1">
                        <div className="text-[13px] text-[#020817]">
                          {isAllSelected ? 'Bỏ chọn tất cả' : isSomeSelected ? `Chọn tất cả (đã chọn ${selectedUsers.length}/${filteredAvailableUsers.length})` : 'Chọn tất cả'}
                        </div>
                      </div>
                    </label>
                  </div>

                  <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
                    {filteredAvailableUsers.length === 0 ? (
                      <div className="py-16 text-center text-[13px] text-[#64748B]">
                        Không tìm thấy người dùng phù hợp.
                      </div>
                    ) : (
                      filteredAvailableUsers.map((user) => (
                        <label
                          key={user.id}
                          className="flex items-center gap-3 px-3 min-h-12 py-1.5 bg-white hover:bg-[#F8FAFC] cursor-pointer border-b border-[#E0E0E0] last:border-b-0 transition-colors"
                        >
                          <input
                            type="checkbox"
                            title={`Chọn ${user.name}`}
                            aria-label={`Chọn ${user.name}`}
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUser(user.id)}
                            className={CHECKBOX_CLS}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] text-[#020817]">{user.name}</div>
                            <div className="text-[12px] text-[#64748B]">{user.email} • {user.department}</div>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
            </div>
            <div className="shrink-0 px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className={BTN_OUTLINE}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveMembers}
                className={BTN_PRIMARY}
              >
                Lưu {selectedUsers.length > 0 && `(${selectedUsers.length})`} thành viên
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Delete Confirmation */}
      {modalType === 'delete' && selectedGroup && (
        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4" onClick={handleCloseModal}>
          <div role="alertdialog" aria-modal="true" aria-labelledby="group-delete-title" className="bg-white rounded-2xl shadow-2xl max-w-md w-full flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
              <h3 id="group-delete-title" className="text-[16px] font-medium text-[#020817]">Xác nhận xóa nhóm</h3>
              <button type="button" title="Đóng" aria-label="Đóng" onClick={handleCloseModal} className={BTN_GHOST_ICON}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4 text-[13px] text-[#020817]">
              <p className="mb-3">
                Bạn có chắc chắn muốn xóa nhóm <span className="font-medium">{selectedGroup.name}</span>?
              </p>
              <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-lg p-3">
                <p className="text-[#DC2626] font-medium mb-1">
                  Lưu ý: Hành động này sẽ:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Xóa {selectedGroup.memberCount} thành viên khỏi nhóm</li>
                  <li>Xóa {selectedGroup.functionCount} quyền đã gán</li>
                  <li>Không thể hoàn tác!</li>
                </ul>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className={BTN_OUTLINE}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleDeleteGroup}
                className={BTN_DESTRUCTIVE}
              >
                Xóa nhóm
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}