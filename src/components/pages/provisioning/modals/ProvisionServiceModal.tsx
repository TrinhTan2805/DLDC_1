import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, FileText, Plug, LayoutTemplate, ShieldCheck, Plus, Trash2, Code, Key, Copy, Eye, EyeOff, Database, Send, Save, ArrowLeft, Pencil, Clock, ChevronDown } from 'lucide-react';

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
      alert(service ? 'Cập nhật dịch vụ thành công!' : 'Khởi tạo dịch vụ cung cấp thành công!');
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

  const handleUpdateFieldProperty = (id: any, property: string, value: any) => {
    setFields(fields.map(f => {
      if (f.id === id) {
        const updated = { ...f, [property]: value };
        
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

  return createPortal(
    <div style={{ zIndex: 999999 }} className="fixed inset-0 z-[999999] flex items-center justify-center p-4 md:p-8 bg-black/50 backdrop-blur-sm transition-all duration-300 text-slate-800 provision-service-modal-root">
      <style dangerouslySetInnerHTML={{__html: `
        .provision-service-modal-root *:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(svg):not(path):not(circle):not(rect):not(polyline):not(line) {
          font-size: 13px !important;
        }
        .provision-service-modal-root label {
          font-weight: 500 !important;
          text-transform: none !important;
          letter-spacing: normal !important;
        }
        .provision-service-modal-root input:focus, 
        .provision-service-modal-root select:focus, 
        .provision-service-modal-root textarea:focus {
          border-color: #2563eb !important;
          outline: none !important;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15) !important;
          background-color: #fff !important;
        }
      `}} />
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex flex-1 overflow-hidden relative">
          {/* Close button */}
          <button title="Đóng" aria-label="Đóng"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-300 hover:rotate-90 hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Sidebar Navigation - Refined Spacing */}
          <div className="w-72 border-r border-slate-200 bg-slate-50/50 p-6 flex flex-col gap-4 shrink-0">
            <div className="mb-6 px-4">
               <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100 text-blue-600 w-fit mb-3">
                  <Plug className="w-6 h-6" />
               </div>
               <h2 className="text-[16px] font-bold text-slate-800 uppercase tracking-widest leading-tight">
                  {isViewMode ? 'Xem chi tiết Dịch vụ' : (service ? 'Cấu hình Dịch vụ' : 'Dịch vụ Mới')}
               </h2>
               <p className="text-[9px] text-slate-500 mt-1.5 uppercase font-bold tracking-widest">Điều phối dữ liệu</p>
            </div>

            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-4 text-[13px] font-normal rounded-xl transition-all duration-300 flex items-center gap-4 group uppercase tracking-wider text-left ${
                  activeTab === tab.id 
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 ring-1 ring-blue-100/50' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 border-l-4 border-transparent'
                }`}
              >
                <span className={`${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'} transition-colors duration-300`}>
                  {tab.icon}
                </span>
                <span className={activeTab === tab.id ? 'text-blue-600' : 'text-slate-700 group-hover:text-slate-900'}>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className={`flex-1 overflow-y-auto bg-white p-8 custom-scrollbar ${isViewMode ? 'pointer-events-none' : ''}`}>
            {/* TAB 1: Thông tin chung */}
            {activeTab === 'general' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section>
                  <h3 className="text-base font-semibold text-slate-800 mb-6 flex items-center gap-2">
                    <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                    Thông tin định danh dịch vụ
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tên dịch vụ chia sẻ <span className="text-red-500">*</span></label>
                      <input aria-label="Tên dịch vụ" title="Tên dịch vụ"
                        type="text"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 placeholder:text-slate-400 transition-all duration-300"
                        placeholder="Nhập tên dịch vụ..."
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mã định danh API <span className="text-red-500">*</span></label>
                      <input aria-label="Mã dịch vụ" title="Mã dịch vụ"
                        type="text"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-blue-600 font-mono text-sm placeholder:text-slate-400 transition-all duration-300 font-semibold"
                        placeholder="VD: api_v1_hotich"
                        value={serviceCode}
                        onChange={(e) => setServiceCode(e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">API Context Path <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input aria-label="API Context Path" title="API Context Path"
                          type="text"
                          className={`w-full px-4 py-2.5 bg-slate-50 border hover:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:border-blue-500 font-mono text-sm placeholder:text-slate-400 transition-all duration-300 ${
                            contextPathError 
                              ? 'border-red-400 focus:ring-red-500/20 text-red-600' 
                              : contextPath && !contextPathError
                                ? 'border-emerald-400 focus:ring-emerald-500/20 text-emerald-700'
                                : 'border-slate-200 focus:ring-blue-500/20 text-slate-800'
                          }`}
                          placeholder="VD: /api/v1/ho-tich"
                          value={contextPath}
                          onChange={(e) => handleContextPathChange(e.target.value)}
                        />
                        {contextPath && !contextPathError && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">
                            <Check className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                      {contextPathError && (
                        <p className="mt-1.5 text-xs font-semibold text-red-500 flex items-center gap-1">
                          <X className="w-3 h-3" />
                          {contextPathError}
                        </p>
                      )}
                      {contextPath && !contextPathError && (
                        <p className="mt-1.5 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Context path hợp lệ
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phân loại dữ liệu <span className="text-red-500">*</span></label>
                      <select aria-label="Loại dữ liệu" title="Loại dữ liệu" 
                        value={dataType}
                        onChange={(e) => setDataType(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all duration-300 cursor-pointer"
                      >
                        <option value="" className="text-slate-400">-- Chọn phân loại --</option>
                        <option value="Dữ liệu Hộ tịch" className="text-slate-800">Dữ liệu Hộ tịch</option>
                        <option value="Dữ liệu khai sinh" className="text-slate-800">Dữ liệu khai sinh</option>
                        <option value="Dữ liệu kết hôn" className="text-slate-800">Dữ liệu kết hôn</option>
                        <option value="Dữ liệu khai tử" className="text-slate-800">Dữ liệu khai tử</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mô tả nghiệp vụ</label>
                      <textarea title="Mô tả" aria-label="Mô tả"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 placeholder:text-slate-400 transition-all duration-300"
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
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section>
                  <h3 className="text-base font-semibold text-slate-800 mb-6 flex items-center gap-2">
                    <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                    Thiết lập kết nối & Bảo mật
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Giao thức <span className="text-red-500">*</span></label>
                      <select aria-label="Giao thức" title="Giao thức" 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all duration-300 cursor-pointer"
                      >
                        <option value="rest" className="text-slate-850">REST API (Standard JSON)</option>
                        <option value="soap" className="text-slate-850">SOAP API (Enterprise XML)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phương thức <span className="text-red-500">*</span></label>
                      <select aria-label="Phương thức" title="Phương thức" 
                        value={apiMethod}
                        onChange={(e) => setApiMethod(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all duration-300 cursor-pointer"
                      >
                        <option value="GET" className="text-slate-850">GET</option>
                        <option value="POST" className="text-slate-850">POST</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tuần suất cung cấp</label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          title="Tuần suất cung cấp (giây)"
                          placeholder="Không check"
                          value={frequency}
                          onChange={(e) => setFrequency(e.target.value)}
                          className="w-full pl-4 pr-16 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all duration-300"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-xs font-bold text-slate-400">
                          giây
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ gridColumn: '1 / -1' }} className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl ${isRateLimited ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-[0_0_10px_rgba(37,99,235,0.05)]' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                            <Plug className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-850">Giới hạn lưu lượng (Rate Limit)</div>
                            <div className="text-xs text-slate-500">Giới hạn số lượng request API mỗi phút</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {isRateLimited && (
                            <input 
                              type="number" 
                              title="Giá trị giới hạn"
                              aria-label="Giá trị giới hạn lưu lượng"
                              className="w-20 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-center text-blue-600 font-bold focus:outline-none focus:border-blue-500 transition-all" 
                              value={rateLimitValue} 
                              onChange={(e) => setRateLimitValue(Number(e.target.value))} 
                            />
                          )}
                          <div 
                            onClick={() => setIsRateLimited(!isRateLimited)}
                            className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-all duration-300 ${isRateLimited ? 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.3)]' : 'bg-slate-200'}`}
                          >
                            <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 ${isRateLimited ? 'translate-x-5' : 'translate-x-0'}`}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* TAB 3: Thiết kế cấu trúc gói tin */}
            {activeTab === 'packet' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex bg-slate-100 p-1 rounded-xl w-fit border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setPacketMode('visual')}
                    className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${packetMode === 'visual' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Cấu hình trực quan (Visual)
                  </button>
                  <button
                    type="button"
                    disabled={isOpenDataShared}
                    onClick={() => setPacketMode('sql')}
                    className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${packetMode === 'sql' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'} ${isOpenDataShared ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={isOpenDataShared ? "Không thể dùng câu lệnh SQL tự định nghĩa cho gói tin chia sẻ dữ liệu mở" : "Viết câu lệnh (Raw SQL)"}
                  >
                    Viết câu lệnh (Raw SQL)
                  </button>
                </div>

                {/* Open Data Sharing Configuration */}
                <div className="p-4 bg-blue-50/30 border border-blue-100 rounded-xl flex flex-col items-start gap-4 justify-start shadow-sm w-full text-left">
                  <div className="flex items-center gap-2 shrink-0 justify-start text-left">
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
                      className="w-4 h-4 text-blue-600 rounded border-slate-350 focus:ring-blue-500 cursor-pointer shrink-0"
                    />
                    <label htmlFor="isOpenDataShared" className="text-[13px] font-bold text-slate-800 cursor-pointer select-none whitespace-nowrap text-left">
                      Thiết lập gói tin chia sẻ dữ liệu mở
                    </label>
                  </div>
                  
                  {isOpenDataShared && (
                    <div className="flex items-center gap-2 w-full max-w-2xl justify-start text-left animate-in fade-in slide-in-from-left-2 duration-300">
                      <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider shrink-0 text-left">Chọn tệp dữ liệu mở:</span>
                      <select
                        aria-label="Chọn tệp dữ liệu mở"
                        value={selectedOpenDataId}
                        onChange={(e) => handleSelectOpenData(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[13px] font-semibold text-slate-850 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm truncate animate-in fade-in text-left"
                      >
                        <option value="" className="text-slate-500">-- Chọn tệp dữ liệu mở (Đã công bố) --</option>
                        {openDataList.map((item) => (
                          <option key={item.id} value={item.id} className="truncate text-slate-850 text-left">
                            {item.fileName} ({item.category})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {packetMode === 'visual' ? (
                  <>
                 {/* Data Source Configuration */}
                 <section className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                   <div className="flex items-center justify-between mb-5">
                     <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                          <Database className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-800">Cấu hình Nguồn dữ liệu</h4>
                     </div>
                     <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Sử dụng liên kết bảng (Join)</span>
                        <div 
                          onClick={() => !isOpenDataShared && setHasJoin(!hasJoin)}
                          className={`w-9 h-5 rounded-full p-0.5 transition-all duration-300 ${isOpenDataShared ? 'opacity-50 cursor-not-allowed bg-slate-200' : 'cursor-pointer'} ${hasJoin && !isOpenDataShared ? 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.3)]' : 'bg-slate-200'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${hasJoin && !isOpenDataShared ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                     </div>
                   </div>

                    <div className="grid grid-cols-1 gap-5">
                      {/* Primary Table */}
                      <div className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-all group/table">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 flex items-center justify-between">
                           <span>Bảng dữ liệu chính</span>
                           <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded italic">Primary Table</span>
                        </label>
                        <select 
                          title="Chọn bảng chính" 
                          disabled={isOpenDataShared}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-800 outline-none cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                          value={primaryTable}
                          onChange={(e) => setPrimaryTable(e.target.value)}
                        >
                          <option value="ho_tich_ca_nhan" className="text-slate-800">ho_tich_ca_nhan (Hộ tịch cá nhân)</option>
                          <option value="giay_khai_sinh" className="text-slate-800">giay_khai_sinh (Giấy khai sinh)</option>
                        </select>
                      </div>

                      {/* Joined Tables Builder */}
                      {hasJoin && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                          <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                              <Database className="w-3.5 h-3.5 text-blue-600" />
                              Bảng liên kết bổ sung ({joinedTables.length})
                            </h5>
                            <button
                              type="button"
                              onClick={handleAddJoinTable}
                              className="text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg border border-blue-200 transition-all flex items-center shadow-sm cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5 mr-1" /> Thêm bảng liên kết
                            </button>
                          </div>

                          {joinedTables.map((table, idx) => (
                            <div key={table.id} className="p-4 bg-white border border-slate-200 rounded-xl relative space-y-4 hover:border-blue-300 transition-all">
                              <button
                                type="button"
                                onClick={() => handleRemoveJoinTable(table.id)}
                                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Xóa bảng liên kết"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-extrabold bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded">
                                  BẢNG LIÊN KẾT #{idx + 1}
                                </span>
                                <span className="text-[10px] font-mono font-bold text-slate-400">
                                  Alias: {table.alias}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Kiểu liên kết</label>
                                  <select 
                                    aria-label="Kiểu liên kết" 
                                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                                    value={table.type}
                                    onChange={(e) => handleUpdateJoinTable(table.id, 'type', e.target.value)}
                                  >
                                    <option>INNER JOIN</option>
                                    <option>LEFT JOIN</option>
                                    <option>RIGHT JOIN</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Bảng dữ liệu bổ sung</label>
                                  <select 
                                    title="Chọn bảng phụ" 
                                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                                    value={table.name}
                                    onChange={(e) => handleUpdateJoinTable(table.id, 'name', e.target.value)}
                                  >
                                    <option value="">-- Chọn bảng bổ sung --</option>
                                    {tableNames.filter(name => name !== primaryTable).map(name => (
                                      <option key={name} value={name}>{name}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              {table.name && (
                                <div className="p-3 bg-blue-50/20 rounded-lg border border-blue-100 border-dashed space-y-2 animate-in fade-in zoom-in-95 duration-200">
                                  <div className="text-[9px] font-bold text-blue-600 uppercase tracking-tight">Điều kiện liên kết (Join Condition):</div>
                                  <div className="flex flex-col md:flex-row items-center gap-2">
                                    <div className="flex-1 w-full">
                                      <select 
                                        title="Trường PK" 
                                        className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
                                        value={table.joinColA}
                                        onChange={(e) => handleUpdateJoinTable(table.id, 'joinColA', e.target.value)}
                                      >
                                        <option value="">-- Cột của {table.name} --</option>
                                        {mockSchema[table.name]?.map(col => (
                                          <option key={col} value={`${table.alias}.${col}`}>{table.alias}.{col}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className="text-blue-600 font-extrabold text-xs px-2.5 py-1 bg-blue-50 rounded border border-blue-100 shadow-sm">=</div>
                                    <div className="flex-1 w-full">
                                      <select 
                                        title="Trường FK" 
                                        className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
                                        value={table.joinColB}
                                        onChange={(e) => handleUpdateJoinTable(table.id, 'joinColB', e.target.value)}
                                      >
                                        <option value="">-- Nối với cột --</option>
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
                  <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
                    <div className="flex justify-between items-center p-5 border-b border-slate-200 bg-slate-50/50">
                      <h4 className="font-bold text-slate-800 flex items-center gap-2">
                        <LayoutTemplate className="w-5 h-5 text-blue-600" />
                        Chọn trường dữ liệu chia sẻ (Field Selection)
                      </h4>
                      {!isOpenDataShared && (
                        <button
                          type="button"
                          onClick={handleAddDataField}
                          className="text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg border border-blue-200 transition-all flex items-center shadow-sm cursor-pointer animate-in fade-in"
                          title="Thêm trường dữ liệu gốc"
                        >
                          <Plus className="w-4 h-4 mr-1.5" /> Thêm trường dữ liệu
                        </button>
                      )}
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse table-fixed">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                            <th className="px-4 py-3 font-bold uppercase text-[10px] text-center w-12">Chia sẻ</th>
                            <th className="px-4 py-3 font-bold uppercase text-[10px] text-center w-12">PK</th>
                            <th className="px-4 py-3 font-bold uppercase text-[10px] w-[21%]">Nguồn dữ liệu (Table)</th>
                            <th className="px-4 py-3 font-bold uppercase text-[10px] w-[21%]">Trường gốc (Column)</th>
                            <th className="px-4 py-3 font-bold uppercase text-[10px] w-[21%]">Tên trường (API Field)</th>
                            <th className="px-4 py-3 font-bold uppercase text-[10px] w-[21%]">Kiểu dữ liệu</th>
                            <th className="px-4 py-3 font-bold uppercase text-[10px] text-center w-[10%]">Che dấu</th>
                            <th className="px-4 py-3 w-16 text-right">Xóa</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                          {fields.map(field => (
                              <tr key={field.id} className="hover:bg-slate-50/50 group transition-colors">
                                <td className="px-4 py-3 text-center">
                                  <input 
                                    type="checkbox" 
                                    title="Chọn trường" 
                                    disabled={isOpenDataShared}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white w-4 h-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                                    defaultChecked 
                                  />
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <Key className={`w-4 h-4 mx-auto ${isOpenDataShared ? 'text-slate-350 cursor-not-allowed opacity-50' : (field.id === 1 ? 'text-blue-600' : 'text-slate-400 hover:text-blue-500 transition-colors cursor-pointer')}`} />
                                </td>
                                <td className="px-4 py-3">
                                  <select 
                                    title="Chọn bảng" 
                                    disabled={isOpenDataShared}
                                    className="w-full bg-slate-50 border border-slate-200 px-2 py-1 rounded text-[11px] font-bold text-slate-700 outline-none cursor-pointer focus:border-blue-500 shadow-sm disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                                    value={field.sourceTable || primaryTable}
                                    onChange={(e) => handleUpdateFieldProperty(field.id, 'sourceTable', e.target.value)}
                                  >
                                    <option value={primaryTable}>{primaryTable} (Gốc)</option>
                                    {hasJoin && joinedTables.map(t => t.name && (
                                      <option key={t.id} value={t.name}>{t.name} (Liên kết)</option>
                                    ))}
                                    {/* Fallback option for open data source table */}
                                    {field.sourceTable && field.sourceTable !== primaryTable && !(joinedTables || []).some(t => t.name === field.sourceTable) && (
                                      <option value={field.sourceTable}>{field.sourceTable} (Mở)</option>
                                    )}
                                  </select>
                                </td>
                                <td className="px-4 py-3">
                                  <select 
                                    title="Chọn cột nguồn" 
                                    disabled={isOpenDataShared}
                                    className="w-full bg-slate-50 border border-slate-200 px-2 py-1 rounded text-[11px] font-mono text-slate-600 outline-none cursor-pointer focus:border-blue-500 shadow-sm disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                                    value={field.sourceColumn || ''}
                                    onChange={(e) => handleUpdateFieldProperty(field.id, 'sourceColumn', e.target.value)}
                                  >
                                    <option value="">-- Chọn trường gốc --</option>
                                    {mockSchema[field.sourceTable || primaryTable]?.map(col => (
                                      <option key={col} value={col}>{col}</option>
                                    ))}
                                    {/* Fallback option if the source column is not in mockSchema (e.g., loaded from Open Data) */}
                                    {field.sourceColumn && !(mockSchema[field.sourceTable || primaryTable] || []).includes(field.sourceColumn) && (
                                      <option value={field.sourceColumn}>{field.sourceColumn}</option>
                                    )}
                                  </select>
                                </td>
                                <td className="px-4 py-3">
                                  <input 
                                    title="Tên trường API" 
                                    aria-label="Tên trường API" 
                                    type="text" 
                                    disabled={isOpenDataShared}
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 px-2 py-1 rounded outline-none text-xs text-slate-800 font-mono font-bold shadow-sm disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed" 
                                    value={field.name} 
                                    onChange={(e) => handleUpdateFieldProperty(field.id, 'name', e.target.value)}
                                    placeholder="Ví dụ: ho_ten"
                                  />
                                </td>
                                <td className="px-4 py-3">
                                  <select 
                                    title="Kiểu" 
                                    disabled={isOpenDataShared}
                                    className="w-full bg-slate-50 border border-slate-200 px-2 py-1 rounded text-[10px] font-bold text-slate-500 outline-none uppercase cursor-pointer focus:border-blue-500 shadow-sm disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                                    value={field.type}
                                    onChange={(e) => handleUpdateFieldProperty(field.id, 'type', e.target.value)}
                                  >
                                    <option value="string">string</option>
                                    <option value="number">number</option>
                                    <option value="datetime">datetime</option>
                                  </select>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <input 
                                    type="checkbox" 
                                    title="Masking" 
                                    disabled={isOpenDataShared}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white w-4 h-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                                    checked={field.isMasked || false} 
                                    onChange={(e) => handleUpdateFieldProperty(field.id, 'isMasked', e.target.checked)}
                                  />
                                </td>
                                <td className="px-4 py-3 text-right">
                                  {!isOpenDataShared && (
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteField(field.id)}
                                      className="p-1 text-slate-400 hover:text-red-500 opacity-60 group-hover:opacity-100 transition-all cursor-pointer"
                                      title="Xóa trường"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
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
                  <section className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2.5 mb-5">
                      <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                        <Code className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">Câu lệnh SQL tùy chỉnh</h4>
                    </div>
                    <div className="relative">
                      <textarea
                        value={sqlQuery}
                        onChange={(e) => setSqlQuery(e.target.value)}
                        className="w-full h-64 p-4 font-mono text-sm text-slate-800 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-y"
                        placeholder="Nhập câu lệnh SQL (SELECT ... FROM ... WHERE ...)"
                        spellCheck={false}
                      />
                    </div>
                  </section>
                )}
 
                  {/* Live API Response Preview */}
                  <section className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden relative group ring-1 ring-white/5">
                     <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-all duration-700 rotate-12">
                       <Code className="w-24 h-24 text-white" />
                     </div>
                     
                     <div className="flex items-center justify-between mb-6">
                       <h4 className="font-bold text-slate-400 flex items-center text-[10px] uppercase tracking-[0.3em]">
                         <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                         Live API Response Preview
                       </h4>
                       <button
                         type="button"
                         onClick={() => {
                           navigator.clipboard.writeText(generateDynamicPreview());
                           alert('Đã sao chép phản hồi mẫu JSON!');
                         }}
                         title="Copy JSON"
                         className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg border border-white/10 backdrop-blur-md transition-all cursor-pointer"
                       >
                         <Copy className="w-4 h-4" />
                       </button>
                     </div>
                     
                     <div className="relative">
                       <pre className="font-mono text-xs leading-relaxed overflow-x-auto custom-scrollbar scrollbar-thin p-4 bg-slate-900/50 rounded-xl border border-white/5 text-slate-300">
                         <code>{generateDynamicPreview()}</code>
                       </pre>
                     </div>
                  </section>
              </div>
            )}

            {/* TAB 4: Phân quyền truy cập */}
            {activeTab === 'access' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section>
                  <h3 className="text-base font-semibold text-slate-800 mb-6 flex items-center gap-2">
                    <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                    Kiểm soát quyền hạn & Cấp phát Key
                  </h3>
                  
                  <div className="max-w-2xl space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Chính sách</label>
                      <select aria-label="Chính sách" title="Chính sách" 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all duration-300 cursor-pointer"
                      >
                        <option value="restricted" className="text-slate-800">Hạn chế (Restricted Gov Access)</option>
                        <option value="public" className="text-slate-800">Công khai (Public Open Data)</option>
                      </select>
                    </div>
                    <div className="relative">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cơ quan/Đơn vị nhận <span className="text-red-500">*</span></label>
                      <div 
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl flex items-center justify-between cursor-pointer focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[46px]"
                        onClick={() => setIsAgencyDropdownOpen(!isAgencyDropdownOpen)}
                      >
                        <div className="flex flex-wrap gap-2 flex-1 mr-2">
                          {selectedAgencies.length > 0 ? (
                            selectedAgencies.map(agency => (
                              <span 
                                key={agency} 
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 font-medium text-sm rounded-lg border border-blue-100 shadow-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleAgency(agency);
                                }}
                              >
                                {agency}
                                <X className="w-3.5 h-3.5 hover:text-blue-900 cursor-pointer transition-colors" />
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400">-- Chọn cơ quan/đơn vị nhận --</span>
                          )}
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      </div>
                      
                      {isAgencyDropdownOpen && (
                        <div className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
                          {agencies.map(agency => (
                            <label key={agency} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0">
                              <input 
                                type="checkbox" 
                                checked={selectedAgencies.includes(agency)}
                                onChange={() => handleToggleAgency(agency)}
                                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                              />
                              <span className="text-sm font-bold text-slate-700">{agency}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-8 py-5 border-t border-slate-200 bg-slate-50/80 backdrop-blur-lg">
           <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {[1,2,3,4].map(step => (
                  <div key={step} className={`h-1 rounded-full transition-all duration-300 ${
                    (activeTab === 'general' && step === 1) || 
                    (activeTab === 'protocol' && step === 2) || 
                    (activeTab === 'packet' && step === 3) || 
                    (activeTab === 'access' && step === 4)
                      ? 'w-6 bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]' : 'w-2 bg-slate-200'
                  }`}></div>
                ))}
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {activeTab === 'general' ? 'Step 1 of 4' : activeTab === 'protocol' ? 'Step 2 of 4' : activeTab === 'packet' ? 'Step 3 of 4' : 'Step 4 of 4'}
              </div>
           </div>
           
           <div className="flex items-center gap-3">
            {isViewMode ? (
              <button title="Đóng" aria-label="Đóng"
                onClick={onClose}
                className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-500/10 cursor-pointer"
              >
                Đóng
              </button>
            ) : (
              <>
              <button title="Lưu tạm" aria-label="Lưu tạm"
               onClick={handleSaveDraft}
               className="px-6 py-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-all duration-300 font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer border border-slate-250 bg-white"
             >
               <Save className="w-4 h-4" />
               Lưu tạm
             </button>
             <button title="Hủy bỏ" aria-label="Hủy bỏ"
               onClick={onClose}
               className="px-6 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-250 bg-white transition-all duration-300 font-bold text-xs uppercase tracking-widest cursor-pointer"
             >
               Hủy bỏ
             </button>
             {activeTab !== 'general' && (
               <button 
                 title="Quay lại" aria-label="Quay lại"
                 onClick={() => {
                   const currentIndex = tabs.findIndex(t => t.id === activeTab);
                   if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1].id);
                 }} 
                 className="px-6 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-250 bg-white transition-all duration-300 font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer"
               >
                 <ArrowLeft className="w-4 h-4" />
                 Quay lại
               </button>
             )}
             {activeTab !== 'access' ? (
               <button 
                 title="Tiếp tục" aria-label="Tiếp tục"
                 onClick={() => {
                   const currentIndex = tabs.findIndex(t => t.id === activeTab);
                   if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1].id);
                 }} 
                 className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-500/10 cursor-pointer"
               >
                 Tiếp tục
               </button>
             ) : (
               <button title="Trình duyệt" aria-label="Trình duyệt & Gửi phê duyệt"
                 onClick={handleSubmit}
                 className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center transition-all duration-300 font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-500/10 cursor-pointer"
               >
                 <Send className="w-5 h-5 mr-2" />
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