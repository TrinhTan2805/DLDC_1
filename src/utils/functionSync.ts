// Utility to sync functions from menu structure

export interface FunctionItem {
  id: string;
  code: string;
  name: string;
  parentId: string | null;
  level: number;
  module: string;
  permissions: {
    view: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
    search: boolean;
    export: boolean;
    print: boolean;
    import: boolean;
    submit: boolean;
    approve: boolean;
  };
  availablePermissions: {
    view: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
    search: boolean;
    export: boolean;
    print: boolean;
    import: boolean;
    submit: boolean;
    approve: boolean;
  };
}

// Menu structure from Sidebar
export const menuStructure = [
  {
    id: 'dashboard',
    code: 'DASHBOARD',
    name: 'Trang chủ',
    module: 'Hệ thống',
    icon: 'Home',
  },
  {
    id: 'collection',
    code: 'COLLECTION',
    name: 'Thu thập dữ liệu',
    module: 'Thu thập',
    icon: 'Database',
    children: [
      { id: 'collection-external', code: 'COLLECTION_EXTERNAL', name: 'Thu thập dữ liệu ngoài ngành' },
      { id: 'collection-internal', code: 'COLLECTION_INTERNAL', name: 'Thu thập dữ liệu trong ngành' },
    ],
  },
  {
    id: 'processing',
    code: 'PROCESSING',
    name: 'Xử lý dữ liệu',
    module: 'Xử lý',
    icon: 'Settings',
    children: [
      { id: 'processing-civil-registry', code: 'PROCESSING_CIVIL', name: 'Xử lý dữ liệu Hộ tịch' },
      { id: 'processing-nationality', code: 'PROCESSING_NATIONALITY', name: 'Xử lý dữ liệu Quốc tịch' },
      { id: 'processing-judgment', code: 'PROCESSING_JUDGMENT', name: 'Xử lý dữ liệu Bản án' },
      { id: 'processing-judgment-db', code: 'PROCESSING_JUDGMENT_DB', name: 'Xử lý dữ liệu CSDL Bản án' },
      { id: 'processing-security', code: 'PROCESSING_SECURITY', name: 'Xử lý dữ liệu An ninh trật tự' },
      { id: 'processing-security-db', code: 'PROCESSING_SECURITY_DB', name: 'Xử lý dữ liệu CSDL An ninh' },
      { id: 'processing-inspection', code: 'PROCESSING_INSPECTION', name: 'Xử lý dữ liệu Thanh tra' },
      { id: 'processing-national-law', code: 'PROCESSING_NATIONAL_LAW', name: 'Xử lý dữ liệu Pháp luật QG' },
      { id: 'processing-judicial-assistance', code: 'PROCESSING_JUDICIAL_ASSIST', name: 'Xử lý dữ liệu Tư pháp quốc tế' },
      { id: 'processing-legal-aid-info', code: 'PROCESSING_LEGAL_AID', name: 'Xử lý dữ liệu TGPL' },
      { id: 'processing-legal-education', code: 'PROCESSING_LEGAL_EDU', name: 'Xử lý dữ liệu Phổ biến pháp luật' },
      { id: 'processing-judicial-support', code: 'PROCESSING_JUDICIAL_SUPPORT', name: 'Xử lý dữ liệu Bổ trợ tư pháp' },
      { id: 'processing-auction', code: 'PROCESSING_AUCTION', name: 'Xử lý dữ liệu Đấu giá' },
      { id: 'processing-cooperation-dept', code: 'PROCESSING_COOP_DEPT', name: 'Xử lý dữ liệu Hợp tác quốc tế' },
      { id: 'processing-cooperation-db', code: 'PROCESSING_COOP_DB', name: 'Xử lý dữ liệu CSDL Hợp tác' },
      { id: 'processing-cooperation', code: 'PROCESSING_COOP', name: 'Xử lý dữ liệu Hợp tác khác' },
    ],
  },
  {
    id: 'category',
    code: 'CATEGORY',
    name: 'Quản lý danh mục',
    module: 'Danh mục',
    icon: 'FolderTree',
    children: [
      { id: 'gender-category', code: 'CAT_GENDER', name: 'Danh mục Giới tính' },
      { id: 'ethnic-category', code: 'CAT_ETHNIC', name: 'Danh mục Dân tộc' },
      { id: 'country-nationality', code: 'CAT_COUNTRY', name: 'Danh mục Quốc gia/Quốc tịch' },
      { id: 'religion-category', code: 'CAT_RELIGION', name: 'Danh mục Tôn giáo' },
      { id: 'agency-category', code: 'CAT_AGENCY', name: 'Danh mục Cơ quan' },
      { id: 'administrative-unit', code: 'CAT_ADMIN_UNIT', name: 'Danh mục Đơn vị hành chính' },
      { id: 'family-relationship', code: 'CAT_FAMILY', name: 'Danh mục Mối quan hệ gia đình' },
      { id: 'identity-document', code: 'CAT_ID_DOC', name: 'Danh mục Giấy tờ nhận dạng' },
    ],
  },
  {
    id: 'open-data',
    code: 'OPEN_DATA',
    name: 'Dữ liệu mở',
    module: 'Dữ liệu mở',
    icon: 'Globe',
  },
  {
    id: 'quality',
    code: 'QUALITY',
    name: 'Kiểm soát chất lượng',
    module: 'Chất lượng',
    icon: 'CheckCircle',
  },
  {
    id: 'master-data',
    code: 'MASTER_DATA',
    name: 'Dữ liệu tổng hợp',
    module: 'Tổng hợp',
    icon: 'Database',
  },
  {
    id: 'orchestration',
    code: 'ORCHESTRATION',
    name: 'Quản lý điều phối dữ liệu',
    module: 'Kho DLDC',
    parentId: null,
    level: 0
  },
  {
    id: 'orchestration-service-setup',
    code: 'ORCHESTRATION_SERVICE_SETUP',
    name: 'Thiết lập dịch vụ',
    module: 'Kho DLDC',
    parentId: 'orchestration',
    level: 1
  },
  {
    id: 'orchestration-api-management',
    code: 'ORCHESTRATION_API_MGMT',
    name: 'Quản lý API chủ động | API thụ động',
    module: 'Kho DLDC',
    parentId: 'orchestration',
    level: 1
  },
  {
    id: 'orchestration-monitoring',
    code: 'ORCHESTRATION_MONITORING',
    name: 'Giám sát',
    module: 'Kho DLDC',
    parentId: 'orchestration',
    level: 1
  },
  {
    id: 'orchestration-service-category',
    code: 'ORCHESTRATION_SVC_CAT',
    name: 'Danh mục dịch vụ',
    module: 'Kho DLDC',
    parentId: 'orchestration',
    level: 1
  },
  {
    id: 'reconciliation',
    code: 'RECONCILIATION',
    name: 'Đối soát dữ liệu',
    module: 'Đối soát',
    icon: 'GitCompare',
  },
  {
    id: 'notification',
    code: 'NOTIFICATION',
    name: 'Quản lý thông báo',
    module: 'Thông báo',
    icon: 'Bell',
    children: [
      { id: 'notification-browser', code: 'NOTIF_BROWSER', name: 'Trình duyệt' },
      { id: 'notification-approval', code: 'NOTIF_APPROVAL', name: 'Phê duyệt' },
      { id: 'notification-system-error', code: 'NOTIF_SYS_ERROR', name: 'Lỗi hệ thống' },
      { id: 'notification-api-collect-error', code: 'NOTIF_API_COLLECT', name: 'Lỗi API thu thập' },
      { id: 'notification-api-provide', code: 'NOTIF_API_PROVIDE', name: 'API cung cấp' },
      { id: 'notification-api-reconcile', code: 'NOTIF_API_RECONCILE', name: 'API đối soát' },
    ],
  },
  {
    id: 'admin',
    code: 'ADMIN',
    name: 'Quản trị hệ thống',
    module: 'Quản trị',
    icon: 'Settings',
    children: [
      { id: 'admin-users', code: 'ADMIN_USERS', name: 'Quản lý người dùng' },
      { id: 'admin-groups', code: 'ADMIN_GROUPS', name: 'Quản lý nhóm người dùng' },
      { id: 'admin-functions', code: 'ADMIN_FUNCTIONS', name: 'Danh sách chức năng' },
      { id: 'admin-config', code: 'ADMIN_CONFIG', name: 'Cấu hình hệ thống' },
      { id: 'admin-login-log', code: 'ADMIN_LOGIN_LOG', name: 'Nhật ký đăng nhập' },
      { id: 'admin-access-log', code: 'ADMIN_ACCESS_LOG', name: 'Nhật ký truy cập' },
      { id: 'admin-backup', code: 'ADMIN_BACKUP', name: 'Sao lưu & Phục hồi' },
      { id: 'admin-statistics', code: 'ADMIN_STATS', name: 'Thống kê hệ thống' },
    ],
  },
];

// Tab structure for pages with tabs (4-tab structure for processing pages)
export const tabStructure: Record<string, string[]> = {
  'processing-civil-registry': ['Danh sách dữ liệu', 'Cấu hình xử lý', 'Danh sách cảnh báo', 'Lịch sử xử lý'],
  'processing-nationality': ['Danh sách dữ liệu', 'Cấu hình xử lý', 'Danh sách cảnh báo', 'Lịch sử xử lý'],
  'processing-judgment': ['Danh sách dữ liệu', 'Cấu hình xử lý', 'Danh sách cảnh báo', 'Lịch sử xử lý'],
  'processing-judgment-db': ['Danh sách dữ liệu', 'Cấu hình xử lý', 'Danh sách cảnh báo', 'Lịch sử xử lý'],
  'processing-security': ['Danh sách dữ liệu', 'Cấu hình xử lý', 'Danh sách cảnh báo', 'Lịch sử xử lý'],
  'processing-security-db': ['Danh sách dữ liệu', 'Cấu hình xử lý', 'Danh sách cảnh báo', 'Lịch sử xử lý'],
  'processing-inspection': ['Danh sách dữ liệu', 'Cấu hình xử lý', 'Danh sách cảnh báo', 'Lịch sử xử lý'],
  'processing-national-law': ['Danh sách dữ liệu', 'Cấu hình xử lý', 'Danh sách cảnh báo', 'Lịch sử xử lý'],
  'processing-judicial-assistance': ['Danh sách dữ liệu', 'Cấu hình xử lý', 'Danh sách cảnh báo', 'Lịch sử xử lý'],
  'processing-legal-aid-info': ['Danh sách dữ liệu', 'Cấu hình xử lý', 'Danh sách cảnh báo', 'Lịch sử xử lý'],
  'processing-legal-education': ['Danh sách dữ liệu', 'Cấu hình xử lý', 'Danh sách cảnh báo', 'Lịch sử xử lý'],
  'processing-judicial-support': ['Danh sách dữ liệu', 'Cấu hình xử lý', 'Danh sách cảnh báo', 'Lịch sử xử lý'],
  'processing-auction': ['Danh sách dữ liệu', 'Cấu hình xử lý', 'Danh sách cảnh báo', 'Lịch sử xử lý'],
  'processing-cooperation-dept': ['Danh sách dữ liệu', 'Cấu hình xử lý', 'Danh sách cảnh báo', 'Lịch sử xử lý'],
  'processing-cooperation-db': ['Danh sách dữ liệu', 'Cấu hình xử lý', 'Danh sách cảnh báo', 'Lịch sử xử lý'],
  'processing-cooperation': ['Danh sách dữ liệu', 'Cấu hình xử lý', 'Danh sách cảnh báo', 'Lịch sử xử lý'],
};

// Available permissions based on function type
const getAvailablePermissions = (functionId: string) => {
  // Dashboard - view only
  if (functionId === 'dashboard') {
    return {
      view: true,
      add: false,
      edit: false,
      delete: false,
      search: true,
      export: true,
      print: true,
      import: false,
      submit: false,
      approve: false,
    };
  }

  // Admin users - full permissions
  if (functionId === 'admin-users') {
    return {
      view: true,
      add: true,
      edit: true,
      delete: true,
      search: true,
      export: true,
      print: true,
      import: true,
      submit: false,
      approve: false,
    };
  }

  // Admin groups - no delete
  if (functionId === 'admin-groups') {
    return {
      view: true,
      add: true,
      edit: true,
      delete: false,
      search: true,
      export: true,
      print: true,
      import: false,
      submit: false,
      approve: false,
    };
  }

  // Admin functions - view and export only
  if (functionId === 'admin-functions') {
    return {
      view: true,
      add: false,
      edit: false,
      delete: false,
      search: true,
      export: true,
      print: true,
      import: false,
      submit: false,
      approve: false,
    };
  }

  // Logs - view and export only
  if (functionId.includes('log') || functionId.includes('statistics')) {
    return {
      view: true,
      add: false,
      edit: false,
      delete: false,
      search: true,
      export: true,
      print: true,
      import: false,
      submit: false,
      approve: false,
    };
  }

  // Other admin functions
  if (functionId.startsWith('admin-')) {
    return {
      view: true,
      add: true,
      edit: true,
      delete: true,
      search: true,
      export: true,
      print: true,
      import: false,
      submit: false,
      approve: false,
    };
  }

  // Collection functions - have import and submit
  if (functionId.startsWith('collection-')) {
    return {
      view: true,
      add: true,
      edit: true,
      delete: true,
      search: true,
      export: true,
      print: true,
      import: true,
      submit: true,
      approve: false,
    };
  }

  // Processing functions - have import, submit and approve
  if (functionId.startsWith('processing-')) {
    return {
      view: true,
      add: true,
      edit: true,
      delete: true,
      search: true,
      export: true,
      print: true,
      import: true,
      submit: true,
      approve: true,
    };
  }

  // Category functions - have import, submit and approve
  if (functionId === 'category' || functionId.includes('category') || functionId.includes('administrative-unit') || functionId.includes('family-relationship') || functionId.includes('identity-document')) {
    return {
      view: true,
      add: true,
      edit: true,
      delete: true,
      search: true,
      export: true,
      print: true,
      import: true,
      submit: true,
      approve: true,
    };
  }

  // Master data - have submit and approve
  if (functionId === 'master-data') {
    return {
      view: true,
      add: true,
      edit: true,
      delete: true,
      search: true,
      export: true,
      print: true,
      import: true,
      submit: true,
      approve: true,
    };
  }

  // Open data - have approve
  if (functionId === 'open-data') {
    return {
      view: true,
      add: true,
      edit: true,
      delete: true,
      search: true,
      export: true,
      print: true,
      import: false,
      submit: true,
      approve: true,
    };
  }

  // Quality control - view and approve
  if (functionId === 'quality') {
    return {
      view: true,
      add: false,
      edit: false,
      delete: false,
      search: true,
      export: true,
      print: true,
      import: false,
      submit: false,
      approve: true,
    };
  }

  // Orchestration - full permissions
  if (functionId.startsWith('orchestration')) {
    return {
      view: true,
      add: true,
      edit: true,
      delete: true,
      search: true,
      export: true,
      print: true,
      import: false,
      submit: true,
      approve: true,
    };
  }

  // Reconciliation - view and approve
  if (functionId === 'reconciliation') {
    return {
      view: true,
      add: false,
      edit: false,
      delete: false,
      search: true,
      export: true,
      print: true,
      import: false,
      submit: false,
      approve: true,
    };
  }

  // Notification functions - mostly view
  if (functionId.startsWith('notification-')) {
    return {
      view: true,
      add: false,
      edit: false,
      delete: true,
      search: true,
      export: false,
      print: false,
      import: false,
      submit: false,
      approve: false,
    };
  }

  // Default permissions - basic view
  return {
    view: true,
    add: false,
    edit: false,
    delete: false,
    search: true,
    export: true,
    print: true,
    import: false,
    submit: false,
    approve: false,
  };
};

// Default permissions based on function type
const getDefaultPermissions = (functionId: string) => {
  // Get available permissions first
  const available = getAvailablePermissions(functionId);

  // Return enabled by default based on what's available
  return {
    view: available.view,
    add: available.add,
    edit: available.edit,
    delete: available.delete,
    search: available.search,
    export: available.export,
    print: available.print,
    import: available.import,
    submit: available.submit,
    approve: available.approve,
  };
};

// Sync functions from menu structure
export const syncFunctions = (): FunctionItem[] => {
  const functions: FunctionItem[] = [];
  let counter = 1;

  menuStructure.forEach((menu) => {
    // Add parent menu as function
    functions.push({
      id: `${counter}`,
      code: menu.code,
      name: menu.name,
      parentId: null,
      level: 0,
      module: menu.module,
      permissions: getDefaultPermissions(menu.id),
      availablePermissions: getAvailablePermissions(menu.id),
    });

    const parentCounter = counter;
    counter++;

    // Add children if exists
    if (menu.children) {
      menu.children.forEach((child) => {
        functions.push({
          id: `${counter}`,
          code: child.code,
          name: child.name,
          parentId: `${parentCounter}`,
          level: 1,
          module: menu.module,
          permissions: getDefaultPermissions(child.id),
          availablePermissions: getAvailablePermissions(child.id),
        });

        const childCounter = counter;
        counter++;

        // Add tabs as sub-functions if exists
        const tabs = tabStructure[child.id];
        if (tabs) {
          tabs.forEach((tab, index) => {
            functions.push({
              id: `${counter}`,
              code: `${child.code}_TAB${index + 1}`,
              name: tab,
              parentId: `${childCounter}`,
              level: 2,
              module: menu.module,
              permissions: getDefaultPermissions(child.id),
              availablePermissions: getAvailablePermissions(child.id),
            });
            counter++;
          });
        }
      });
    }
  });

  return functions;
};

// Get unique modules
export const getModules = (): string[] => {
  const modules = new Set<string>();
  menuStructure.forEach((menu) => {
    modules.add(menu.module);
  });
  return Array.from(modules);
};
