import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, FileText, Plug, LayoutTemplate, ShieldCheck, Plus, Trash2, Code, Key, Copy, Eye, EyeOff, Database, Send, Save, ArrowLeft, Pencil, Clock, ChevronDown } from 'lucide-react';
import {
  Badge, RowIconAction, SearchableSelect, tabClass, BTN_PRIMARY, BTN_OUTLINE, BTN_GHOST_ICON, INPUT_CLS as BASE_INPUT_CLS, VIEW_FIELD_CLS, LABEL_CLS, FIELD_LABEL, REQUIRED_MARK, SECTION_TITLE,
} from '../../collection/collectionUi';
// Ô nhập chuẩn + quy tắc ô bị khóa ở màn Xem chi tiết (giá trị đen, placeholder xám)
const INPUT_CLS = `${BASE_INPUT_CLS} ${VIEW_FIELD_CLS}`;

// Lớp dùng chung trong modal (compomennt.md 5.2, 5.3)
const TEXTAREA_CLS = 'w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8] disabled:cursor-not-allowed';
const CHECKBOX_CLS = 'w-4 h-4 accent-blue-600 cursor-pointer shrink-0 disabled:cursor-not-allowed';
const TH_CLS = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const DANGER_ICON_BTN = 'absolute top-3 right-3 p-1.5 rounded-lg text-[#475569] hover:bg-[#FEF2F2] hover:text-[#DC2626] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-600';

interface ProvisionServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any, isPublic: boolean) => void;
  onSaveDraft?: (data: any) => void;
  onSubmitApproval?: (data: any) => void;
  service?: any;
  mode?: 'view' | 'edit';
}

type TabType = 'general' | 'protocol' | 'packet' | 'access' | 'history';

// Mock Database Schema for Civil Registry
const mockSchema: Record<string, string[]> = {
  'ho_tich_ca_nhan': ['id', 'ma_vinh_vien', 'ho_ten', 'ngay_sinh', 'gioi_tinh', 'so_dinh_danh'],
  'giay_khai_sinh': ['id', 'so_giay_khai_sinh', 'ngay_dang_ky', 'noi_sinh', 'ho_ten_cha', 'ho_ten_me'],
  'dia_chi_thuong_tru': ['id', 'user_id', 'id_ho_tich', 'tinh_thanh', 'quan_huyen', 'phuong_xa', 'chi_tiet'],
  'thong_tin_cha_me': ['id', 'id_ho_tich', 'ho_ten_cha', 'cccd_cha', 'ho_ten_me', 'cccd_me']
};
const tableNames = Object.keys(mockSchema);

const defaultOpenDataList = [
  {
    id: '1',
    fileName: 'Danh sách tổ chức thực hiện trợ giúp pháp lý Q1-2026.xlsx',
    category: 'Danh sách tổ chức thực hiện trợ giúp pháp lý',
    publisher: 'Bộ Tư pháp',
    status: 'approved',
    description: 'Dữ liệu tổ chức thực hiện trợ giúp pháp lý bao gồm các trung tâm nhà nước và văn phòng hợp đồng.',
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
    status: 'approved',
    description: 'Dữ liệu danh sách trợ giúp viên pháp luật và luật sư cộng tác viên.',
    previewHeaders: ['Họ tên', 'Số năm hành nghề', 'Vai trò', 'Tổ chức hành nghề', 'Địa chỉ tổ chức', 'Số điện thoại tổ chức'],
    previewRows: [
      ['Nguyễn Văn An', '10', 'Trợ giúp viên pháp luật', 'Trung tâm TGPL Nhà nước Tỉnh X', 'Đường Hùng Vương, Tỉnh X', '0243.123.456'],
      ['Trần Thị Bình', '5', 'Luật sư thực hiện TGPL', 'Văn phòng Luật sư Bình Minh', 'Đường Trần Hưng Đạo, Tỉnh Y', '0283.987.654']
    ]
  },
  {
    id: '3_approved',
    fileName: 'Danh sách Luật sư Việt Nam mới.xlsx',
    category: 'Danh sách Luật sư Việt Nam',
    publisher: 'Bộ Tư pháp',
    status: 'approved',
    description: 'Dữ liệu danh sách Luật sư Việt Nam cập nhật.',
    previewHeaders: ['Họ và tên', 'Ngày sinh', 'Giới tính', 'Quốc tịch', 'Số Chứng chỉ hành nghề luật sư', 'Số Thẻ luật sư', 'Nơi làm việc/nơi hành nghề', 'Thành viên Đoàn Luật sư', 'Tình trạng hành nghề'],
    previewRows: [
      ['Lê Văn Long', '15/08/1985', 'Nam', 'Việt Nam', 'CC-9988-BTP', 'THE-1234-LS', 'Văn phòng Luật sư Long & Partners', 'Đoàn Luật sư TP. Hà Nội', 'Đang hoạt động'],
      ['Phạm Thị Hoa', '22/04/1990', 'Nữ', 'Việt Nam', 'CC-5544-BTP', 'THE-5678-LS', 'Công ty Luật TNHH Sen Vàng', 'Đoàn Luật sư TP. HCM', 'Đang hoạt động']
    ]
  }
];

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

export function ProvisionServiceModal({ isOpen, onClose, onSave, onSaveDraft, onSubmitApproval, service, mode = 'edit' }: ProvisionServiceModalProps) {
  const isViewMode = mode === 'view';
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [accessScope, setAccessScope] = useState('all');
  
  // States for Open Data Sharing
  const [isOpenDataShared, setIsOpenDataShared] = useState(false);
  const [selectedOpenDataId, setSelectedOpenDataId] = useState('');
  const [openDataList, setOpenDataList] = useState<any[]>([]);

  const handleSelectOpenData = (id: string, currentList?: any[]) => {
    setSelectedOpenDataId(id);
    if (!id) return;
    const targetList = currentList || openDataList;
    const matched = targetList.find(item => item.id === id);
    if (matched) {
      const { mainTable: newMainTable, fields: newFields } = getOpenDataDetails(matched);
      setPrimaryTable(newMainTable);
      setFields(newFields);
      setHasJoin(false);
      setJoinedTables([]);
      setPacketMode('visual');

      // Auto-fill fields
      const cleanFileName = matched.fileName ? matched.fileName.replace(/\.[^/.]+$/, "") : (matched.category || "Dịch vụ chia sẻ dữ liệu mở");
      setServiceName(cleanFileName);
      setDataType(matched.category || "Dữ liệu mở");

      // Auto-fill API Code and Context Path
      const codeName = convertToEnglishSnake(matched.category || cleanFileName);
      setServiceCode(`api_v1_${codeName}`);
      setContextPath(`/api/v1/${codeName.replace(/_/g, '-')}`);
    }
  };

  // General Tab States
  const [serviceName, setServiceName] = useState('');
  const [serviceCode, setServiceCode] = useState('');
  const [dataType, setDataType] = useState('');
  const [protocol, setProtocol] = useState('rest');
  const [description, setDescription] = useState('');

  // States for packet design (Tab 3)
  const [format, setFormat] = useState('json');
  const [fields, setFields] = useState<any[]>([
    { id: 1, name: 'id', type: 'string', description: 'Mã định danh', isMasked: false, maskRule: '', sourceTable: 'ho_tich_ca_nhan', sourceColumn: 'id' },
    { id: 2, name: 'ho_ten', type: 'string', description: 'Họ và tên', isMasked: false, maskRule: '', sourceTable: 'ho_tich_ca_nhan', sourceColumn: 'ho_ten' },
    { id: 3, name: 'so_dinh_danh', type: 'string', description: 'Số định danh cá nhân', isMasked: true, maskRule: 'hide_middle_4', sourceTable: 'ho_tich_ca_nhan', sourceColumn: 'so_dinh_danh' }
  ]);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(true);
  const [rateLimitValue, setRateLimitValue] = useState(100);
  const [hasJoin, setHasJoin] = useState(false);
  const [packetMode, setPacketMode] = useState<'visual' | 'sql'>('visual');
  const [sqlQuery, setSqlQuery] = useState('SELECT *\nFROM ho_tich_ca_nhan\nWHERE id = :id');
  const [isPublic, setIsPublic] = useState(false);
  const [contextPath, setContextPath] = useState(service?.contextPath || '');
  const [contextPathError, setContextPathError] = useState('');
  
  const [isAgencyDropdownOpen, setIsAgencyDropdownOpen] = useState(false);
  const [selectedAgencies, setSelectedAgencies] = useState<string[]>([]);
  const [agencies, setAgencies] = useState<string[]>([
    "Bộ Kế hoạch và Đầu tư",
    "Sở Tài chính tỉnh Bắc Ninh",
    "Sở Tư pháp tỉnh Bắc Ninh",
    "Sở Thông tin và Truyền thông tỉnh Bắc Ninh",
    "Công an tỉnh Bắc Ninh",
    "Sở Y tế tỉnh Bắc Ninh"
  ]);

  const handleToggleAgency = (agency: string) => {
    setSelectedAgencies(prev => prev.includes(agency) ? prev.filter(a => a !== agency) : [...prev, agency]);
  };

  const [apiMethod, setApiMethod] = useState(service?.method || 'GET');
  const [frequency, setFrequency] = useState(() => {
    if (service?.frequency !== undefined && service?.frequency !== null) return String(service.frequency);
    if (service?.freq && !isNaN(Number(service.freq))) return String(service.freq);
    return '';
  });

  useEffect(() => {
    if (isOpen) {
      setServiceName(service?.name || '');
      setServiceCode(service?.code || '');
      setDataType(service?.type || 'Dữ liệu Hộ tịch');
      setProtocol(service?.protocol?.toLowerCase().includes('soap') ? 'soap' : 'rest');
      setDescription(service?.desc || service?.description || '');
      setApiMethod(service?.method || 'GET');
      setFrequency(() => {
        if (service?.frequency !== undefined && service?.frequency !== null) return String(service.frequency);
        if (service?.freq && !isNaN(Number(service.freq))) return String(service.freq);
        return '';
      });
      setContextPath(service?.contextPath || '');
      
      if (service?.consumerUnit) {
        setSelectedAgencies(service.consumerUnit.split(',').map((u: string) => u.trim()).filter(Boolean));
      } else {
        setSelectedAgencies([]);
      }

      // Load agencies from accounts list in localStorage
      const savedAccounts = localStorage.getItem('provision_accounts');
      if (savedAccounts) {
        try {
          const parsed = JSON.parse(savedAccounts);
          if (Array.isArray(parsed)) {
            const uniqueOrgs = Array.from(new Set(parsed.map((a: any) => a.organization).filter(Boolean)));
            if (uniqueOrgs.length > 0) {
              setAgencies(uniqueOrgs);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }

      // Load open data list and fallback
      const savedOpenData = localStorage.getItem('open_data_published');
      let list = [];
      if (savedOpenData) {
        try {
          const parsed = JSON.parse(savedOpenData);
          if (Array.isArray(parsed)) {
            list = parsed.filter((item: any) => item.status === 'approved');
          }
        } catch (e) {
          console.error(e);
        }
      }
      if (list.length === 0) {
        list = defaultOpenDataList;
      }
      setOpenDataList(list);

      // Load service configuration fields
      const isShared = !!service?.isOpenDataShared;
      setIsOpenDataShared(isShared);
      setSelectedOpenDataId(service?.selectedOpenDataId || '');

      if (service?.primaryTable) {
        setPrimaryTable(service.primaryTable);
      } else {
        setPrimaryTable('ho_tich_ca_nhan');
      }

      if (service?.fields && Array.isArray(service.fields)) {
        setFields(service.fields);
      } else {
        setFields([
          { id: 1, name: 'id', type: 'string', description: 'Mã định danh', isMasked: false, maskRule: '', sourceTable: 'ho_tich_ca_nhan', sourceColumn: 'id' },
          { id: 2, name: 'ho_ten', type: 'string', description: 'Họ và tên', isMasked: false, maskRule: '', sourceTable: 'ho_tich_ca_nhan', sourceColumn: 'ho_ten' },
          { id: 3, name: 'so_dinh_danh', type: 'string', description: 'Số định danh cá nhân', isMasked: true, maskRule: 'hide_middle_4', sourceTable: 'ho_tich_ca_nhan', sourceColumn: 'so_dinh_danh' }
        ]);
      }

      if (service?.joinedTables && Array.isArray(service.joinedTables)) {
        setJoinedTables(service.joinedTables);
      } else {
        setJoinedTables([
          { id: 1, name: 'dia_chi_thuong_tru', alias: 't2', type: 'LEFT JOIN', joinColA: 't2.id_ho_tich', joinOp: '=', joinColB: 'ho_tich_ca_nhan.id' }
        ]);
      }

      setHasJoin(service?.hasJoin ?? false);
      setPacketMode(service?.packetMode || 'visual');
      setSqlQuery(service?.sqlQuery || 'SELECT *\nFROM ho_tich_ca_nhan\nWHERE id = :id');
    }
  }, [isOpen, service]);

  // Mock existing context paths for duplicate check
  const existingContextPaths = ['/api/v1/ho-tich', '/api/v1/ket-hon', '/api/v1/khai-sinh', '/api/v1/khai-tu'];

  const handleContextPathChange = (value: string) => {
    setContextPath(value);
    if (value.trim() === '') {
      setContextPathError('');
    } else if (existingContextPaths.includes(value.trim().toLowerCase())) {
      setContextPathError('Context path đã tồn tại. Vui lòng chọn đường dẫn khác.');
    } else if (!/^\/[a-z0-9\-\/]*$/.test(value.trim())) {
      setContextPathError('Định dạng không hợp lệ. VD: /api/v1/ten-api');
    } else {
      setContextPathError('');
    }
  };

  // Dynamic table joins state
  const [primaryTable, setPrimaryTable] = useState('ho_tich_ca_nhan');
  const [joinedTables, setJoinedTables] = useState<any[]>([
    { id: 1, name: 'dia_chi_thuong_tru', alias: 't2', type: 'LEFT JOIN', joinColA: 't2.id_ho_tich', joinOp: '=', joinColB: 'ho_tich_ca_nhan.id' }
  ]);

  const handleAddJoinTable = () => {
    const nextId = joinedTables.length > 0 ? Math.max(...joinedTables.map(t => t.id)) + 1 : 1;
    const nextAlias = `t${nextId + 1}`;
    setJoinedTables([
      ...joinedTables,
      { id: nextId, name: '', alias: nextAlias, type: 'LEFT JOIN', joinColA: '', joinOp: '=', joinColB: '' }
    ]);
  };

  const handleRemoveJoinTable = (id: number) => {
    setJoinedTables(joinedTables.filter(t => t.id !== id));
  };

  const handleUpdateJoinTable = (id: number, key: string, value: string) => {
    setJoinedTables(joinedTables.map(t => t.id === id ? { ...t, [key]: value } : t));
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'general' as TabType, label: 'Thông tin chung', icon: <FileText className="w-4 h-4" /> },
    { id: 'protocol' as TabType, label: 'Cấu hình API & Giao thức', icon: <Plug className="w-4 h-4" /> },
    { id: 'packet' as TabType, label: 'Thiết kế cấu trúc gói tin', icon: <LayoutTemplate className="w-4 h-4" /> },
    { id: 'access' as TabType, label: 'Phân quyền truy cập', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = {
      ...service,
      name: serviceName,
      code: serviceCode,
      type: dataType,
      freq: frequency || 'Thời gian thực',
      protocol: protocol === 'soap' ? 'SOAP (XML)' : 'REST API (JSON)',
      method: apiMethod,
      contextPath,
      consumerUnit: selectedAgencies.join(', '),
      desc: description,
      isOpenDataShared,
      selectedOpenDataId,
      primaryTable,
      fields,
      joinedTables,
      hasJoin,
      packetMode,
      sqlQuery
    };
    if (onSubmitApproval) {
      onSubmitApproval(updatedData);
    } else {
      if (onSave) onSave(updatedData, isPublic);
    }
    onClose();
  };

  const handleSaveDraft = () => {
    const updatedData = {
      ...service,
      name: serviceName || 'Bản nháp dịch vụ mới',
      code: serviceCode || `DV_DRAFT_${Math.floor(Math.random() * 1000)}`,
      type: dataType || 'Chưa xác định',
      freq: frequency || 'Chưa cấu hình',
      protocol: protocol === 'soap' ? 'SOAP (XML)' : 'REST API (JSON)',
      method: apiMethod,
      contextPath,
      consumerUnit: selectedAgencies.join(', '),
      desc: description,
      status: 'draft',
      isOpenDataShared,
      selectedOpenDataId,
      primaryTable,
      fields,
      joinedTables,
      hasJoin,
      packetMode,
      sqlQuery
    };
    if (onSaveDraft) onSaveDraft(updatedData);
    onClose();
  };


  const handleAddDataField = () => {
    const nextId = fields.length > 0 ? Math.max(...fields.map(f => f.id)) + 1 : 1;
    setFields([
      ...fields,
      {
        id: nextId,
        name: '',
        type: 'string',
        description: '',
        isMasked: false,
        maskRule: '',
        sourceTable: primaryTable,
        sourceColumn: '',
        isCalculated: false
      }
    ]);
  };

  const handleUpdateFieldProperty = (id: any, property: string, value: any, extra: Record<string, any> = {}) => {
    setFields(fields.map(f => {
      if (f.id === id) {
        const updated = { ...f, ...extra, [property]: value };
        
        // Auto-populate when sourceColumn changes
        if (property === 'sourceColumn') {
          updated.name = value; // Default API field name is the column name
          
          // Deduce type and description automatically
          const tbl = updated.sourceTable || primaryTable;
          const col = value;
          updated.description = `Trường ${col} (từ bảng ${tbl})`;
          
          if (col.toLowerCase().includes('ngay') || col.toLowerCase().includes('thoi_gian') || col.toLowerCase().includes('date')) {
            updated.type = 'datetime';
          } else if (col === 'id' || col.toLowerCase().includes('so') || col.toLowerCase().includes('ma') || col.toLowerCase().includes('cccd')) {
            updated.type = 'string';
          } else {
            updated.type = 'string';
          }
        }
        
        return updated;
      }
      return f;
    }));
  };

  const handleDeleteField = (id: any) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const generateDynamicPreview = () => {
    const dataObj: any = {};
    
    // Add fields dynamically based on state
    fields.forEach(f => {
      if (f.isCalculated) {
        if (f.type === 'number') {
          dataObj[f.name] = 42;
        } else if (f.type === 'boolean') {
          dataObj[f.name] = true;
        } else if (f.type === 'datetime') {
          dataObj[f.name] = "2026-05-28T13:45:00Z";
        } else {
          if (f.formula.includes('CONCAT')) {
            dataObj[f.name] = "Nguyễn Văn A - USR-99812";
          } else if (f.formula.includes('UPPER')) {
            dataObj[f.name] = "NGUYỄN VĂN A";
          } else {
            dataObj[f.name] = `Computed: ${f.formula.substring(0, 20)}`;
          }
        }
      } else {
        const colName = f.sourceColumn || f.name || 'id';
        if (colName === 'id') {
          dataObj[f.name || 'id'] = "USR-99812";
        } else if (colName === 'ho_ten') {
          dataObj[f.name || 'ho_ten'] = "Nguyễn Văn A";
        } else if (colName === 'ngay_sinh') {
          dataObj[f.name || 'ngay_sinh'] = "1995-10-15";
        } else if (colName === 'gioi_tinh') {
          dataObj[f.name || 'gioi_tinh'] = 1;
        } else if (colName === 'so_dinh_danh') {
          dataObj[f.name || 'so_dinh_danh'] = f.isMasked ? "001••••123" : "001095000123";
        } else if (colName === 'so_dien_thoai') {
          dataObj[f.name || 'so_dien_thoai'] = f.isMasked ? "091••••285" : "0912345285";
        } else if (colName === 'tinh_thanh') {
          dataObj[f.name || 'tinh_thanh'] = "Thành phố Hà Nội";
        } else if (colName === 'quan_huyen') {
          dataObj[f.name || 'quan_huyen'] = "Quận Ba Đình";
        } else if (colName === 'phuong_xa') {
          dataObj[f.name || 'phuong_xa'] = "Phường Điện Biên";
        } else if (colName === 'chi_tiet') {
          dataObj[f.name || 'chi_tiet'] = "Số 10 Hùng Vương";
        } else if (colName === 'so_giay_khai_sinh') {
          dataObj[f.name || 'so_giay_khai_sinh'] = "KS-2026-9912";
        } else if (colName === 'ho_ten_cha') {
          dataObj[f.name || 'ho_ten_cha'] = "Nguyễn Văn B";
        } else if (colName === 'ho_ten_me') {
          dataObj[f.name || 'ho_ten_me'] = "Trần Thị C";
        } else {
          dataObj[f.name || colName] = f.type === 'number' ? 100 : `Dữ liệu trường [${colName}]`;
        }
      }
    });

    const fullResponse = {
      status: "success",
      data: {
        ...dataObj,
        metadata: {
          source: "BTP_DLDC_CORE",
          timestamp: new Date().toISOString()
        }
      }
    };

    return JSON.stringify(fullResponse, null, 2);
  };

  const stepIndex = tabs.findIndex(t => t.id === activeTab);

  return createPortal(
    <div style={{ zIndex: 999999 }} className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 transition-all duration-300">
      <div role="dialog" aria-modal="true" aria-labelledby="provision-service-title" className="bg-white rounded-2xl shadow-2xl w-full max-w-[1440px] h-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex-1 min-h-0 flex">
          {/* Thanh bước dọc (thiết kế PM 07/10/2026): tên dịch vụ + 4 bước + tiến độ */}
          <aside className="w-64 shrink-0 bg-[#F8FAFC] border-r border-[#E2E8F0] flex flex-col py-4">
            <div className="px-4 pb-4">
              <div className="w-10 h-10 rounded-lg bg-[#EAF3FF] text-[#155DFC] flex items-center justify-center mb-3">
                <Plug className="w-5 h-5" />
              </div>
              <h2 id="provision-service-title" className="text-[16px] font-semibold text-[#020817] break-words">
                {isViewMode ? 'Xem chi tiết Dịch vụ' : (service ? 'Cấu hình Dịch vụ' : 'Dịch vụ Mới')}
              </h2>
              <p className="text-[13px] text-[#64748B] mt-0.5">Điều phối dữ liệu</p>
            </div>

            <nav role="tablist" aria-orientation="vertical" aria-label="Các bước cấu hình dịch vụ" className="flex flex-col gap-1 px-2">
              {tabs.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative h-9 pl-4 pr-3 flex items-center gap-2 rounded-lg text-left text-[13px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${active ? 'bg-[#EAF3FF] text-[#020817] font-medium' : 'text-[#020817] hover:bg-[#F1F5F9]'}`}
                  >
                    {active && <span className="absolute -left-2 top-1.5 bottom-1.5 w-[3px] rounded-full bg-[#155DFC]" aria-hidden="true" />}
                    <span className={`shrink-0 ${active ? 'text-[#155DFC]' : 'text-[#94A3B8]'}`}>
                      {tab.icon}
                    </span>
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto px-4 pt-4 flex items-center gap-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(step => (
                  <div key={step} className={`h-1 rounded-full transition-all duration-300 ${
                    step - 1 === stepIndex ? 'w-6 bg-[#155DFC]' : step - 1 < stepIndex ? 'w-2 bg-[#155DFC]' : 'w-2 bg-[#E2E8F0]'
                  }`}></div>
                ))}
              </div>
              <div className="text-[12px] text-[#64748B]">
                {activeTab === 'general' ? 'Step 1 of 4' : activeTab === 'protocol' ? 'Step 2 of 4' : activeTab === 'packet' ? 'Step 3 of 4' : 'Step 4 of 4'}
              </div>
            </div>
          </aside>

          {/* Nội dung bước */}
          <div className="relative flex-1 min-w-0 flex flex-col">
            <button type="button" title="Đóng" aria-label="Đóng" onClick={onClose} className={`absolute top-3 right-4 z-10 ${BTN_GHOST_ICON}`}>
              <X className="w-5 h-5" />
            </button>

        {/* Main Content Area */}
        <fieldset disabled={isViewMode} className={`flex-1 min-w-0 m-0 p-0 border-0 overflow-y-auto bg-white pl-6 pr-14 py-4 custom-scrollbar ${isViewMode ? 'pointer-events-none' : ''}`}>
          {/* TAB 1: Thông tin chung */}
          {activeTab === 'general' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <section>
                <h3 className={SECTION_TITLE}><span className="w-1 h-4 bg-blue-600 rounded-full shrink-0" aria-hidden="true" />Thông tin chung</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    {/* Open Data Sharing Configuration */}
                    <div className="p-4 bg-[#EAF3FF] border border-[#BFDBFE] rounded-lg flex flex-col items-start gap-3 w-full text-left">
                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="checkbox"
                          id="isOpenDataShared"
                          checked={isOpenDataShared}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setIsOpenDataShared(checked);
                            if (!checked) {
                              setSelectedOpenDataId('');
                            } else {
                              if (openDataList.length > 0) {
                                handleSelectOpenData(openDataList[0].id);
                              }
                            }
                          }}
                          className={CHECKBOX_CLS}
                        />
                        <label htmlFor="isOpenDataShared" className="text-[13px] font-semibold text-[#020817] cursor-pointer select-none whitespace-nowrap">
                          Thiết lập gói tin chia sẻ dữ liệu mở
                        </label>
                      </div>

                      {isOpenDataShared && (
                        <div className="flex items-center gap-2 w-full max-w-2xl animate-in fade-in duration-300">
                          <span className="text-[13px] text-[#64748B] shrink-0">Chọn tệp dữ liệu mở:</span>
                          <select
                            aria-label="Chọn tệp dữ liệu mở"
                            value={selectedOpenDataId}
                            onChange={(e) => handleSelectOpenData(e.target.value)}
                            className={`${INPUT_CLS} cursor-pointer truncate`}
                          >
                            <option value="" disabled hidden>-- Chọn tệp dữ liệu mở (đã công bố) --</option>
                            {openDataList.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.fileName} ({item.category})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className={LABEL_CLS}>Tên dịch vụ chia sẻ <span className={REQUIRED_MARK}>*</span></label>
                    <input aria-label="Tên dịch vụ" title="Tên dịch vụ"
                      type="text"
                      className={INPUT_CLS}
                      placeholder="Nhập tên dịch vụ..."
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={LABEL_CLS}>Mã định danh API <span className={REQUIRED_MARK}>*</span></label>
                    <input aria-label="Mã dịch vụ" title="Mã dịch vụ"
                      type="text"
                      className={INPUT_CLS}
                      placeholder="VD: api_v1_hotich"
                      value={serviceCode}
                      onChange={(e) => setServiceCode(e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={LABEL_CLS}>API Context Path <span className={REQUIRED_MARK}>*</span></label>
                    <div className="relative">
                      <input aria-label="API Context Path" title="API Context Path"
                        type="text"
                        className={`w-full h-10 pl-3 pr-9 border rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 ${
                          contextPathError
                            ? 'border-[#DC2626] focus:ring-[#DC2626] text-[#B91C1C]'
                            : contextPath && !contextPathError
                              ? 'border-[#16A34A] focus:ring-[#16A34A] text-[#15803D]'
                              : 'border-[#E2E8F0] focus:ring-blue-600 text-[#020817]'
                        } ${VIEW_FIELD_CLS}`}
                        placeholder="VD: /api/v1/ho-tich"
                        value={contextPath}
                        onChange={(e) => handleContextPathChange(e.target.value)}
                      />
                      {contextPath && !contextPathError && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#16A34A]">
                          <Check className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                    {contextPathError && (
                      <p className="mt-1 text-[12px] text-[#DC2626] flex items-center gap-1">
                        <X className="w-3.5 h-3.5" />
                        {contextPathError}
                      </p>
                    )}
                    {contextPath && !contextPathError && (
                      <p className="mt-1 text-[12px] text-[#16A34A] flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Context path hợp lệ
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className={LABEL_CLS}>Phân loại dữ liệu <span className={REQUIRED_MARK}>*</span></label>
                    <select aria-label="Loại dữ liệu" title="Loại dữ liệu"
                      value={dataType}
                      onChange={(e) => setDataType(e.target.value)}
                      className={`${INPUT_CLS} cursor-pointer`}
                    >
                      <option value="" disabled hidden>-- Chọn phân loại --</option>
                      <option value="Dữ liệu Hộ tịch">Dữ liệu Hộ tịch</option>
                      <option value="Dữ liệu khai sinh">Dữ liệu khai sinh</option>
                      <option value="Dữ liệu kết hôn">Dữ liệu kết hôn</option>
                      <option value="Dữ liệu khai tử">Dữ liệu khai tử</option>
                      {isOpenDataShared && dataType && !["Dữ liệu Hộ tịch", "Dữ liệu khai sinh", "Dữ liệu kết hôn", "Dữ liệu khai tử"].includes(dataType) && (
                        <option value={dataType}>{dataType}</option>
                      )}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className={LABEL_CLS}>Mô tả nghiệp vụ</label>
                    <textarea title="Mô tả" aria-label="Mô tả"
                      className={TEXTAREA_CLS}
                      rows={4}
                      placeholder="Mô tả chi tiết mục đích API..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: Cấu hình API & Giao thức */}
          {activeTab === 'protocol' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <section>
                <h3 className={SECTION_TITLE}><span className="w-1 h-4 bg-blue-600 rounded-full shrink-0" aria-hidden="true" />Cấu hình API & Giao thức</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={LABEL_CLS}>Giao thức <span className={REQUIRED_MARK}>*</span></label>
                    <select aria-label="Giao thức" title="Giao thức" className={`${INPUT_CLS} cursor-pointer`}>
                      <option value="rest">REST API (Standard JSON)</option>
                      <option value="soap">SOAP API (Enterprise XML)</option>
                    </select>
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Phương thức <span className={REQUIRED_MARK}>*</span></label>
                    <select aria-label="Phương thức" title="Phương thức"
                      value={apiMethod}
                      onChange={(e) => setApiMethod(e.target.value)}
                      className={`${INPUT_CLS} cursor-pointer`}
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                    </select>
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Tuần suất cung cấp</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        title="Tuần suất cung cấp (giây)"
                        placeholder="Không check"
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                        className="w-full h-10 pl-3 pr-14 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[13px] text-[#64748B]">
                        giây
                      </div>
                    </div>
                  </div>

                </div>
              </section>
            </div>
          )}

          {/* TAB 3: Thiết kế cấu trúc gói tin */}
          {activeTab === 'packet' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className={`${SECTION_TITLE} !mb-0`}><span className="w-1 h-4 bg-blue-600 rounded-full shrink-0" aria-hidden="true" />Thiết kế cấu trúc gói tin</h3>
              <div className="flex border-b border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setPacketMode('visual')}
                  className={tabClass(packetMode === 'visual')}
                >
                  Cấu hình trực quan (Visual)
                </button>
                <button
                  type="button"
                  disabled={isOpenDataShared}
                  onClick={() => setPacketMode('sql')}
                  className={`${tabClass(packetMode === 'sql')} disabled:text-[#94A3B8] disabled:cursor-not-allowed disabled:!text-[#CBD5E1] disabled:!bg-transparent `}
                  title={isOpenDataShared ? "Không thể dùng câu lệnh SQL tự định nghĩa cho gói tin chia sẻ dữ liệu mở" : "Viết câu lệnh (Raw SQL)"}
                >
                  Viết câu lệnh (Raw SQL)
                </button>
              </div>

              {packetMode === 'visual' ? (
                <>
                  {/* Data Source Configuration */}
                  <section className="bg-white p-4 rounded-2xl border border-[#E2E8F0]">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                          <Database className="w-4 h-4" />
                        </div>
                        <h4 className="text-[14px] font-medium text-[#020817]">Cấu hình Nguồn dữ liệu</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] text-[#334155]">Sử dụng liên kết bảng (Join)</span>
                        <div
                          onClick={() => !isOpenDataShared && setHasJoin(!hasJoin)}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 ${isOpenDataShared ? 'cursor-not-allowed bg-[#F1F5F9]' : 'cursor-pointer'} ${hasJoin && !isOpenDataShared ? 'bg-blue-600' : 'bg-[#E2E8F0]'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${hasJoin && !isOpenDataShared ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {/* Primary Table */}
                      <div className="p-4 bg-white rounded-lg border border-[#E2E8F0]">
                        <label className={`${FIELD_LABEL} mb-1 flex items-center justify-between`}>
                          <span>Bảng dữ liệu chính</span>
                          <Badge label="Primary Table" variant="blue" />
                        </label>
                        <select
                          title="Chọn bảng chính"
                          disabled={isOpenDataShared}
                          className={`${INPUT_CLS} cursor-pointer`}
                          value={primaryTable}
                          onChange={(e) => setPrimaryTable(e.target.value)}
                        >
                          <option value="ho_tich_ca_nhan">ho_tich_ca_nhan (Hộ tịch cá nhân)</option>
                          <option value="giay_khai_sinh">giay_khai_sinh (Giấy khai sinh)</option>
                        </select>
                      </div>

                      {/* Joined Tables Builder */}
                      {hasJoin && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                          <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-4">
                            <h5 className="text-[13px] font-medium text-[#020817] flex items-center gap-2">
                              <Database className="w-4 h-4 text-blue-600" />
                              Bảng liên kết bổ sung ({joinedTables.length})
                            </h5>
                            <button type="button" onClick={handleAddJoinTable} className={BTN_OUTLINE}>
                              <Plus className="w-4 h-4" /> Thêm bảng liên kết
                            </button>
                          </div>

                          {joinedTables.map((table, idx) => (
                            <div key={table.id} className="p-4 bg-white border border-[#E2E8F0] rounded-lg relative space-y-4">
                              <button
                                type="button"
                                onClick={() => handleRemoveJoinTable(table.id)}
                                className={DANGER_ICON_BTN}
                                title="Xóa bảng liên kết"
                                aria-label="Xóa bảng liên kết"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                              <div className="flex items-center gap-3">
                                <Badge label={`BẢNG LIÊN KẾT #${idx + 1}`} variant="blue" />
                                <span className="text-[12px] text-[#64748B]">
                                  Alias: {table.alias}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className={LABEL_CLS}>Kiểu liên kết</label>
                                  <select
                                    aria-label="Kiểu liên kết"
                                    className={`${INPUT_CLS} cursor-pointer`}
                                    value={table.type}
                                    onChange={(e) => handleUpdateJoinTable(table.id, 'type', e.target.value)}
                                  >
                                    <option>INNER JOIN</option>
                                    <option>LEFT JOIN</option>
                                    <option>RIGHT JOIN</option>
                                  </select>
                                </div>
                                <div>
                                  <label className={LABEL_CLS}>Bảng dữ liệu bổ sung</label>
                                  <select
                                    title="Chọn bảng phụ"
                                    className={`${INPUT_CLS} cursor-pointer`}
                                    value={table.name}
                                    onChange={(e) => handleUpdateJoinTable(table.id, 'name', e.target.value)}
                                  >
                                    <option value="" disabled hidden>-- Chọn bảng bổ sung --</option>
                                    {tableNames.filter(name => name !== primaryTable).map(name => (
                                      <option key={name} value={name}>{name}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              {table.name && (
                                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-dashed border-[#BFDBFE] space-y-2 animate-in fade-in duration-200">
                                  <div className="text-[12px] font-medium text-[#155DFC]">Điều kiện liên kết (Join Condition):</div>
                                  <div className="flex flex-col md:flex-row items-center gap-2">
                                    <div className="flex-1 w-full">
                                      <select
                                        title="Trường PK"
                                        className={`${INPUT_CLS} cursor-pointer`}
                                        value={table.joinColA}
                                        onChange={(e) => handleUpdateJoinTable(table.id, 'joinColA', e.target.value)}
                                      >
                                        <option value="">-- Cột của {table.name} --</option>
                                        {mockSchema[table.name]?.map(col => (
                                          <option key={col} value={`${table.alias}.${col}`}>{table.alias}.{col}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className="h-10 px-3 inline-flex items-center rounded-lg bg-[#EAF3FF] border border-[#BFDBFE] text-[#155DFC] text-[13px] font-medium">=</div>
                                    <div className="flex-1 w-full">
                                      <select
                                        title="Trường FK"
                                        className={`${INPUT_CLS} cursor-pointer`}
                                        value={table.joinColB}
                                        onChange={(e) => handleUpdateJoinTable(table.id, 'joinColB', e.target.value)}
                                      >
                                        <option value="" disabled hidden>-- Chọn cột nối --</option>
                                        <optgroup label={`Bảng chính: ${primaryTable}`}>
                                          {mockSchema[primaryTable]?.map(col => (
                                            <option key={`${primaryTable}.${col}`} value={`${primaryTable}.${col}`}>{primaryTable}.{col}</option>
                                          ))}
                                        </optgroup>
                                        {joinedTables.slice(0, idx).map(prevTable => prevTable.name && (
                                          <optgroup key={prevTable.id} label={`Bảng liên kết: ${prevTable.name} (${prevTable.alias})`}>
                                            {mockSchema[prevTable.name]?.map(col => (
                                              <option key={`${prevTable.alias}.${col}`} value={`${prevTable.alias}.${col}`}>{prevTable.alias}.{col}</option>
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

                  {/* Field Definition Table */}
                  <section className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden animate-in fade-in duration-300">
                    <div className="flex justify-between items-center gap-4 px-4 py-3 border-b border-[#E2E8F0]">
                      <h4 className="text-[14px] font-medium text-[#020817] flex items-center gap-2">
                        <LayoutTemplate className="w-4 h-4 text-blue-600" />
                        Chọn trường dữ liệu chia sẻ (Field Selection)
                      </h4>
                      {!isOpenDataShared && (
                        <button
                          type="button"
                          onClick={handleAddDataField}
                          className={BTN_OUTLINE}
                          title="Thêm trường dữ liệu gốc"
                        >
                          <Plus className="w-4 h-4" /> Thêm trường dữ liệu
                        </button>
                      )}
                    </div>

                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full border-collapse collection-table text-[13px] table-fixed min-w-[900px]">
                        <thead className="bg-[#F8FAFC]">
                          <tr className="h-[42px] border-b border-[#E0E0E0]">
                            <th className={`${TH_CLS} text-center w-20`}>Chia sẻ</th>
                            <th className={`${TH_CLS} text-center w-14`}>PK</th>
                            <th className={`${TH_CLS} text-left w-[21%]`}>Nguồn dữ liệu (Table)</th>
                            <th className={`${TH_CLS} text-left w-[21%]`}>Trường gốc (Column)</th>
                            <th className={`${TH_CLS} text-left w-[21%]`}>Tên trường (API Field)</th>
                            <th className={`${TH_CLS} text-left w-[21%]`}>Kiểu dữ liệu</th>
                            <th className={`${TH_CLS} text-center w-[10%]`}>Che dấu</th>
                            <th className={`${TH_CLS} text-center w-16`}>Xóa</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fields.map(field => (
                            <tr key={field.id} className="h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                              <td className="px-3 py-1 text-center">
                                <input
                                  type="checkbox"
                                  title="Chọn trường"
                                  disabled={isOpenDataShared}
                                  className={CHECKBOX_CLS}
                                  defaultChecked
                                />
                              </td>
                              <td className="px-3 py-1 text-center">
                                <Key className={`w-4 h-4 mx-auto ${isOpenDataShared ? 'text-[#CBD5E1] cursor-not-allowed' : (field.id === 1 ? 'text-blue-600' : 'text-[#94A3B8] hover:text-blue-600 transition-colors cursor-pointer')}`} />
                              </td>
                              <td className="px-3 py-1">
                                {/* Chỉ hiển thị — tự gán theo trường gốc đã chọn (PM 07/10/2026) */}
                                {(() => {
                                  const tbl = field.sourceTable || primaryTable;
                                  const kind = tbl === primaryTable ? 'Gốc' : (joinedTables || []).some(t => t.name === tbl) ? 'Liên kết' : 'Mở';
                                  return (
                                    <div className="min-w-0 leading-[18px]" title={`${tbl} (${kind})`}>
                                      <div className="truncate text-[13px] text-[#020817]">{tbl || '-'}</div>
                                      <div className="text-[12px] text-[#64748B]">{kind}</div>
                                    </div>
                                  );
                                })()}
                              </td>
                              <td className="px-3 py-1">
                                {(() => {
                                  const tables = [primaryTable, ...(hasJoin ? (joinedTables || []).map(t => t.name).filter(Boolean) : [])] as string[];
                                  const opts = tables.flatMap(tbl => (mockSchema[tbl] || []).map((col: string) => ({
                                    value: `${tbl}::${col}`,
                                    label: tbl === primaryTable ? col : `${col} (${tbl})`,
                                  })));
                                  const curTbl = field.sourceTable || primaryTable;
                                  const curVal = field.sourceColumn ? `${curTbl}::${field.sourceColumn}` : '';
                                  // Giữ giá trị không có trong lược đồ mẫu (VD nạp từ dữ liệu mở)
                                  if (curVal && !opts.some(o => o.value === curVal)) opts.push({ value: curVal, label: field.sourceColumn });
                                  return (
                                    <SearchableSelect
                                      ariaLabel="Chọn trường gốc"
                                      placeholder="-- Chọn trường gốc --"
                                      searchPlaceholder="Tìm trường dữ liệu..."
                                      disabled={isOpenDataShared || isViewMode}
                                      contentClassName="z-[1000000]"
                                      value={curVal}
                                      options={opts}
                                      onChange={(v) => {
                                        const i = v.indexOf('::');
                                        handleUpdateFieldProperty(field.id, 'sourceColumn', v.slice(i + 2), { sourceTable: v.slice(0, i) });
                                      }}
                                    />
                                  );
                                })()}
                              </td>
                              <td className="px-3 py-1">
                                <input
                                  title="Tên trường API"
                                  aria-label="Tên trường API"
                                  type="text"
                                  disabled={isOpenDataShared}
                                  className={INPUT_CLS}
                                  value={field.name}
                                  onChange={(e) => handleUpdateFieldProperty(field.id, 'name', e.target.value)}
                                  placeholder="Ví dụ: ho_ten"
                                />
                              </td>
                              <td className="px-3 py-1">
                                <select
                                  title="Kiểu"
                                  disabled={isOpenDataShared}
                                  className={`${INPUT_CLS} cursor-pointer`}
                                  value={field.type}
                                  onChange={(e) => handleUpdateFieldProperty(field.id, 'type', e.target.value)}
                                >
                                  <option value="string">string</option>
                                  <option value="number">number</option>
                                  <option value="datetime">datetime</option>
                                </select>
                              </td>
                              <td className="px-3 py-1 text-center">
                                <input
                                  type="checkbox"
                                  title="Masking"
                                  disabled={isOpenDataShared}
                                  className={CHECKBOX_CLS}
                                  checked={field.isMasked || false}
                                  onChange={(e) => handleUpdateFieldProperty(field.id, 'isMasked', e.target.checked)}
                                />
                              </td>
                              <td className="px-3 py-1 text-center">
                                {!isOpenDataShared && (
                                  <RowIconAction label="Xóa trường" onClick={() => handleDeleteField(field.id)}>
                                    <Trash2 className="w-4 h-4" />
                                  </RowIconAction>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </>
              ) : (
                <section className="bg-white p-4 rounded-2xl border border-[#E2E8F0]">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      <Code className="w-4 h-4" />
                    </div>
                    <h4 className="text-[14px] font-medium text-[#020817]">Câu lệnh SQL tùy chỉnh</h4>
                  </div>
                  <textarea
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    className={`${TEXTAREA_CLS} h-64 resize-y`}
                    placeholder="Nhập câu lệnh SQL (SELECT ... FROM ... WHERE ...)"
                    spellCheck={false}
                  />
                </section>
              )}

              {/* Live API Response Preview */}
              <section className="bg-white p-4 rounded-2xl border border-[#E2E8F0]">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h4 className="text-[14px] font-medium text-[#020817] flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#10B981] rounded-full"></span>
                    Live API Response Preview
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(generateDynamicPreview());
                    }}
                    title="Copy JSON"
                    aria-label="Copy JSON"
                    className={BTN_GHOST_ICON}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <pre className="font-sans text-[13px] leading-5 text-[#020817] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 whitespace-pre-wrap break-words max-h-80 overflow-auto custom-scrollbar">
                  <code className="font-sans">{generateDynamicPreview()}</code>
                </pre>
              </section>
            </div>
          )}

          {/* TAB 4: Phân quyền truy cập */}
          {activeTab === 'access' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <section>
                <h3 className={SECTION_TITLE}><span className="w-1 h-4 bg-blue-600 rounded-full shrink-0" aria-hidden="true" />Phân quyền truy cập</h3>

                <div className="max-w-2xl space-y-4">
                  <div>
                    <label className={LABEL_CLS}>Chính sách</label>
                    <select aria-label="Chính sách" title="Chính sách" className={`${INPUT_CLS} cursor-pointer`}>
                      <option value="restricted">Hạn chế (Restricted Gov Access)</option>
                      <option value="public">Công khai (Public Open Data)</option>
                    </select>
                  </div>
                  <div className="relative">
                    <label className={LABEL_CLS}>Cơ quan/Đơn vị nhận <span className={REQUIRED_MARK}>*</span></label>
                    <div
                      className="w-full min-h-10 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg flex items-center justify-between cursor-pointer hover:border-[#CBD5E1] transition-colors"
                      onClick={() => setIsAgencyDropdownOpen(!isAgencyDropdownOpen)}
                    >
                      <div className="flex flex-wrap gap-1.5 flex-1 mr-2">
                        {selectedAgencies.length > 0 ? (
                          selectedAgencies.map(agency => (
                            <span
                              key={agency}
                              className="inline-flex items-center gap-1 h-[26px] px-2 rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF] text-[#2563EB] text-[13px]"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleAgency(agency);
                              }}
                            >
                              {agency}
                              <X className="w-3.5 h-3.5 hover:text-[#020817] cursor-pointer transition-colors" />
                            </span>
                          ))
                        ) : (
                          <span className="text-[13px] text-[#94A3B8]">-- Chọn cơ quan/đơn vị nhận --</span>
                        )}
                      </div>
                      <ChevronDown className="w-4 h-4 text-[#64748B] shrink-0" />
                    </div>

                    {isAgencyDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
                        {agencies.map(agency => (
                          <label key={agency} className="flex items-center gap-3 px-3 py-2 hover:bg-[#F8FAFC] cursor-pointer border-b border-[#F1F5F9] last:border-0">
                            <input
                              type="checkbox"
                              checked={selectedAgencies.includes(agency)}
                              onChange={() => handleToggleAgency(agency)}
                              className={CHECKBOX_CLS}
                            />
                            <span className="text-[13px] text-[#020817]">{agency}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>
          )}
        </fieldset>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] shrink-0">
          <div className="flex items-center gap-3">
            {isViewMode ? (
              <button type="button" title="Đóng" aria-label="Đóng" onClick={onClose} className={BTN_OUTLINE}>
                Đóng
              </button>
            ) : (
              <>
                <button type="button" title="Lưu tạm" aria-label="Lưu tạm" onClick={handleSaveDraft} className={BTN_OUTLINE}>
                  <Save className="w-4 h-4" />
                  Lưu tạm
                </button>
                <button type="button" title="Hủy bỏ" aria-label="Hủy bỏ" onClick={onClose} className={BTN_OUTLINE}>
                  Hủy bỏ
                </button>
                {activeTab !== 'general' && (
                  <button
                    type="button"
                    title="Quay lại" aria-label="Quay lại"
                    onClick={() => {
                      const currentIndex = tabs.findIndex(t => t.id === activeTab);
                      if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1].id);
                    }}
                    className={BTN_OUTLINE}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại
                  </button>
                )}
                {activeTab !== 'access' ? (
                  <button
                    type="button"
                    title="Tiếp tục" aria-label="Tiếp tục"
                    onClick={() => {
                      const currentIndex = tabs.findIndex(t => t.id === activeTab);
                      if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1].id);
                    }}
                    className={BTN_PRIMARY}
                  >
                    Tiếp tục
                  </button>
                ) : (
                  <button type="button" title="Trình duyệt" aria-label="Trình duyệt & Gửi phê duyệt" onClick={handleSubmit} className={BTN_PRIMARY}>
                    <Send className="w-4 h-4" />
                    Trình duyệt
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  , document.body);
}
