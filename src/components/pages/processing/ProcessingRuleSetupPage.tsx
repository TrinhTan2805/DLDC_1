import { useState } from 'react';
import { Plus, Search, Eye, Settings, Filter, Play, Download, Edit, Trash2, X, Save, Clock, User, Tag, ChevronDown, ChevronUp, Check, AlertCircle, History as HistoryIcon } from 'lucide-react';
import { RuleManagementModal } from '../../processing/RuleManagementModal';
import { DataClassificationModal } from '../../processing/DataClassificationModal';
import { ConfigDetailModal } from '../../processing/ConfigDetailModal';
import { ErrorListModal } from '../../processing/ErrorListModal';
import { ProcessingHistoryModal } from '../../processing/ProcessingHistoryModal';

interface ProcessingRule {
  id: string;
  name: string;
  description: string;
  dataSource: string;
  processor: string;
  startTime: string;
  dataClassification: string;
  progress: number;
  status: 'processing' | 'completed' | 'pending' | 'error';
  totalRecords: number;
  processedRecords: number;
  errorRecords: number;
  rules: {
    cleaning: number;
    normalization: number;
    transformation: number;
  };
}

interface RuleDetail {
  id: string;
  name: string;
  description: string;
  type: 'cleaning' | 'normalization' | 'transformation';
  applied: boolean;
  details?: string;
  config?: {
    appliedFields?: string[];
    dateFormat?: string;
    regexPattern?: string;
    referenceTable?: string;
    actionOnNotFound?: string;
    deduplicationMethod?: string;
    caseSensitive?: boolean;
    columnName?: string;
    dataType?: string;
    aggregationMethod?: string;
  };
}

interface DataSource {
  id: string;
  name: string;
  category: string;
  type: 'internal' | 'external';
  totalRecords: number;
}

const mockDataSources: DataSource[] = [
  { id: '1', name: 'CSDL Hộ tịch Trung ương', category: 'Hộ tịch', type: 'internal', totalRecords: 15000 },
  { id: '2', name: 'Hệ thống ĐKKD Quốc gia', category: 'Đăng ký kinh doanh', type: 'internal', totalRecords: 8500 },
  { id: '3', name: 'Cổng TTĐT Chính phủ', category: 'Văn bản pháp luật', type: 'external', totalRecords: 5200 },
  { id: '4', name: 'Hệ thống công chứng', category: 'Công chứng', type: 'internal', totalRecords: 3400 },
  { id: '5', name: 'CSDL Quốc tịch', category: 'Quốc tịch', type: 'internal', totalRecords: 12500 },
  { id: '6', name: 'Hệ thống TGPL', category: 'Trợ giúp pháp lý', type: 'internal', totalRecords: 6800 },
  { id: '7', name: 'CSDL Bồi thường nhà nước', category: 'Bồi thường', type: 'internal', totalRecords: 2100 },
  { id: '8', name: 'Hệ thống bản án hình sự', category: 'Tư pháp', type: 'internal', totalRecords: 9300 },
  { id: '9', name: 'CSDL An ninh mạng', category: 'An ninh', type: 'internal', totalRecords: 4500 },
  { id: '10', name: 'Hệ thống thanh tra', category: 'Thanh tra', type: 'external', totalRecords: 3200 },
  { id: '11', name: 'CSDL Pháp luật quốc gia', category: 'Pháp lut', type: 'external', totalRecords: 7600 },
  { id: '12', name: 'Hệ thống hợp tác tư pháp', category: 'Hợp tác quốc tế', type: 'external', totalRecords: 1800 },
];

const mockRuleDetails: RuleDetail[] = [
  // Cleaning rules
  { 
    id: 'c1', 
    name: 'Loại bỏ khoảng trắng thừa', 
    description: 'Xóa khoảng trắng đầu, cuối và giữa các từ', 
    type: 'cleaning', 
    applied: true, 
    details: 'Áp dụng cho tất cả các trường văn bản',
    config: {
      appliedFields: ['ho_ten', 'dia_chi', 'email', 'noi_cap']
    }
  },
  { 
    id: 'c2', 
    name: 'Chuẩn hóa ký tự Unicode', 
    description: 'Chuyển đổi ký tự có dấu về dạng tổ hợp chuẩn', 
    type: 'cleaning', 
    applied: true, 
    details: 'Sử dụng Unicode NFC normalization',
    config: {
      appliedFields: ['ho_ten', 'dia_chi', 'noi_cap', 'dan_toc', 'ton_giao', 'nghe_nghiep']
    }
  },
  { 
    id: 'c3', 
    name: 'Loại bỏ ký tự đặc biệt', 
    description: 'Xóa các ký tự không hợp lệ và ký tự điều khiển', 
    type: 'cleaning', 
    applied: false, 
    details: 'Giữ lại các ký tự chữ, số và dấu câu cơ bản',
    config: {
      appliedFields: ['ho_ten', 'email', 'so_dien_thoai']
    }
  },
  { 
    id: 'c4', 
    name: 'Xóa giá trị null/empty', 
    description: 'Loại bỏ các bản ghi có trường bắt buộc rỗng', 
    type: 'cleaning', 
    applied: true, 
    details: 'Kiểm tra các trường: Họ tên, CMND/CCCD, Ngày sinh',
    config: {
      appliedFields: ['ho_ten', 'so_cccd', 'ngay_sinh']
    }
  },
  { 
    id: 'c5', 
    name: 'Kiểm tra quy tắc về chuẩn định dạng', 
    description: 'Kiểm tra định dạng ngày tháng, số điện thoại, email', 
    type: 'cleaning', 
    applied: false, 
    details: 'Hỗ trợ nhiều định dạng đầu vào',
    config: {
      appliedFields: ['ho_ten', 'so_cccd', 'ngay_sinh', 'gioi_tinh', 'email', 'email_lien_he', 'so_dien_thoai', 'dien_thoai_dd', 'dia_chi', 'dia_chi_thuong_tru', 'tim_thanh', 'quan_huyen', 'phuong_xa', 'ngay_cap', 'noi_cap', 'quoc_tich', 'dan_toc', 'ton_giao', 'nghe_nghiep', 'trinh_do_hoc_van'],
      dateFormat: 'dd/mm/yyyy (VD: 15/08/2023)',
      regexPattern: '^\\d{2}/\\d{2}/\\d{4}$'
    }
  },
  { 
    id: 'c6', 
    name: 'Loại bỏ dữ liệu trùng lặp', 
    description: 'Xóa các bản ghi có thông tin giống nhau 100%', 
    type: 'cleaning', 
    applied: true, 
    details: 'So sánh tất cả các trường dữ liệu',
    config: {
      appliedFields: ['so_cccd', 'email', 'so_dien_thoai']
    }
  },
  { 
    id: 'c7', 
    name: 'Xử lý giá trị ngoại lai', 
    description: 'Phát hiện và xử lý các giá trị bất thường', 
    type: 'cleaning', 
    applied: false, 
    details: 'Sử dụng phương pháp thống kê IQR',
    config: {
      appliedFields: ['ngay_sinh', 'ngay_cap']
    }
  },
  { 
    id: 'c8', 
    name: 'Bắt đầu định dạng số liệu', 
    description: 'Chuẩn hóa các trường số theo định dạng', 
    type: 'cleaning', 
    applied: true, 
    details: 'Áp dụng cho trường Họ tên, Địa chỉ',
    config: {
      appliedFields: ['so_cccd', 'so_dien_thoai', 'dien_thoai_dd'],
      dataType: 'VD: dd-mm-yyyy',
      columnName: 'VD: yyyy-mm-dd'
    }
  },

  // Normalization rules
  { 
    id: 'n1', 
    name: 'Chuẩn hóa số điện thoại', 
    description: 'Định dạng số điện thoại theo chuẩn quốc tế', 
    type: 'normalization', 
    applied: true, 
    details: 'Chuyển về dạng +84XXXXXXXXX',
    config: {
      appliedFields: ['so_dien_thoai', 'dien_thoai_dd']
    }
  },
  { 
    id: 'n2', 
    name: 'Chuẩn hóa địa chỉ', 
    description: 'Chuẩn hóa địa chỉ theo cấu trúc: Số nhà, Đường, Phường/Xã, Quận/Huyện, Tỉnh/TP', 
    type: 'normalization', 
    applied: true, 
    details: 'Sử dụng danh mục hành chính Việt Nam',
    config: {
      appliedFields: ['dia_chi', 'dia_chi_thuong_tru', 'tim_thanh', 'quan_huyen', 'phuong_xa']
    }
  },
  { 
    id: 'n3', 
    name: 'Kiểm tra đối sánh tồn tại dữ liệu trên trường khóa', 
    description: 'Kiểm tra dữ liệu có tồn tại trong bảng tham chiếu', 
    type: 'normalization', 
    applied: true, 
    details: 'Thêm số 0 đứng đầu nếu thiếu',
    config: {
      appliedFields: ['so_cccd', 'email'],
      referenceTable: 'VD: tb_nguoi_dung',
      actionOnNotFound: 'Từ chối bản ghi'
    }
  },
  { 
    id: 'n4', 
    name: 'Xử lý trùng lặp', 
    description: 'Xử lý các bản ghi trùng lặp theo phương thức', 
    type: 'normalization', 
    applied: false, 
    details: 'Sử dụng regex RFC 5322',
    config: {
      appliedFields: ['so_cccd'],
      deduplicationMethod: 'Giữ bản ghi đầu tiên',
      caseSensitive: false
    }
  },
  { 
    id: 'n5', 
    name: 'Chuẩn hóa giới tính', 
    description: 'Chuyển về 3 giá trị: Nam, Nữ, Khác', 
    type: 'normalization', 
    applied: true, 
    details: 'Mapping từ nhiều biến thể: M/F, 0/1, Male/Female',
    config: {
      appliedFields: ['gioi_tinh']
    }
  },
  { 
    id: 'n6', 
    name: 'Xử lý vi phạm về ràng buộc thuộc tính tham chiếu', 
    description: 'Kiểm tra và xử lý vi phạm ràng buộc khóa ngoại', 
    type: 'normalization', 
    applied: false, 
    details: 'Thêm số 0 đứng đầu nếu thiếu',
    config: {
      appliedFields: ['so_cccd', 'email']
    }
  },
  { 
    id: 'n7', 
    name: 'Chuẩn hóa tên doanh nghiệp', 
    description: 'Loại bỏ các tiền tố CÔNG TY, DOANH NGHIỆP', 
    type: 'normalization', 
    applied: true, 
    details: 'Tách loại hình DN và tên DN',
    config: {
      appliedFields: ['ten_doanh_nghiep']
    }
  },
  { 
    id: 'n8', 
    name: 'Chuẩn hóa mã số thuế', 
    description: 'Định dạng mã số thuế 10-13 số', 
    type: 'normalization', 
    applied: true, 
    details: 'Kiểm tra checksum nếu có',
    config: {
      appliedFields: ['ma_so_thue']
    }
  },

  // Transformation rules
  { 
    id: 't1', 
    name: 'Tách họ và tên', 
    description: 'Tách trường Họ tên thành Họ, Tên đệm, Tên', 
    type: 'transformation', 
    applied: true, 
    details: 'Sử dụng thuật toán phân tích tiếng Việt',
    config: {
      appliedFields: ['ho_ten']
    }
  },
  { 
    id: 't2', 
    name: 'Tạo khóa liên kết số liệu', 
    description: 'Tạo khóa chính liên kết giữa các bảng', 
    type: 'transformation', 
    applied: false, 
    details: 'Tính theo năm hiện tại',
    config: {
      appliedFields: ['so_cccd'],
      columnName: 'Tên cột',
      dataType: 'Giây cột'
    }
  },
  { 
    id: 't3', 
    name: 'Phân loại giới nhận số liệu', 
    description: 'Phân loại dữ liu theo giới tính và độ tuổi', 
    type: 'transformation', 
    applied: false, 
    details: 'Theo phân loại WHO',
    config: {
      appliedFields: ['ho_ten', 'so_cccd', 'ngay_sinh', 'gioi_tinh', 'email', 'email_lien_he', 'so_dien_thoai', 'dia_chi', 'dia_chi_thuong_tru', 'ngay_cap', 'noi_cap', 'quoc_tich', 'dan_toc', 'tim_thanh', 'quan_huyen', 'trinh_do_hoc_van'],
      aggregationMethod: 'Thao tác biến'
    }
  },
  { 
    id: 't4', 
    name: 'Trích xuất thông tin từ CCCD', 
    description: 'Lấy giới tính, năm sinh, tỉnh từ số CCCD 12 số', 
    type: 'transformation', 
    applied: true, 
    details: 'Theo cấu trúc CCCD mới',
    config: {
      appliedFields: ['so_cccd']
    }
  },
  { 
    id: 't5', 
    name: 'Geocoding địa chỉ', 
    description: 'Chuyển địa chỉ thành tọa độ GPS', 
    type: 'transformation', 
    applied: false, 
    details: 'Sử dụng API Google Maps',
    config: {
      appliedFields: ['dia_chi', 'dia_chi_thuong_tru']
    }
  },
  { 
    id: 't6', 
    name: 'Mã hóa dữ liệu nhạy cảm', 
    description: 'Mã hóa các trường thông tin cá nhân', 
    type: 'transformation', 
    applied: true, 
    details: 'Sử dụng AES-256',
    config: {
      appliedFields: ['so_cccd', 'email', 'so_dien_thoai']
    }
  },
  { 
    id: 't7', 
    name: 'Tạo ID duy nhất', 
    description: 'Sinh mã định danh duy nhất cho mỗi bản ghi', 
    type: 'transformation', 
    applied: true, 
    details: 'UUID version 4',
    config: {
      appliedFields: []
    }
  },
];

const mockProcessingRules: ProcessingRule[] = [
  {
    id: '1',
    name: 'Dữ liệu CSDL hộ tịch',
    description: 'Xử lý và chuẩn hóa dữ liệu hộ tịch từ các địa phương',
    dataSource: 'CSDL Hộ tịch Trung ương',
    processor: 'Nguyễn Văn A',
    startTime: '08:30 - 10/12/2024',
    dataClassification: 'Dữ liệu trong ngành',
    progress: 75,
    status: 'processing',
    totalRecords: 15000,
    processedRecords: 11250,
    errorRecords: 45,
    rules: {
      cleaning: 12,
      normalization: 8,
      transformation: 5,
    },
  },
  {
    id: '2',
    name: 'Dữ liệu đăng ký kinh doanh',
    description: 'Làm sạch và chuẩn hóa thông tin doanh nghiệp',
    dataSource: 'Hệ thống ĐKKD Quốc gia',
    processor: 'Trần Thị B',
    startTime: '09:00 - 10/12/2024',
    dataClassification: 'Dữ liệu trong ngành',
    progress: 100,
    status: 'completed',
    totalRecords: 8500,
    processedRecords: 8500,
    errorRecords: 0,
    rules: {
      cleaning: 15,
      normalization: 10,
      transformation: 7,
    },
  },
  {
    id: '3',
    name: 'Dữ liệu văn bn pháp luật',
    description: 'Xử lý và phân loại văn bản pháp luật',
    dataSource: 'Cổng TTĐT Chính phủ',
    processor: 'Lê Văn C',
    startTime: '10:15 - 10/12/2024',
    dataClassification: 'Dữ liệu ngoài ngành',
    progress: 0,
    status: 'pending',
    totalRecords: 5200,
    processedRecords: 0,
    errorRecords: 0,
    rules: {
      cleaning: 8,
      normalization: 6,
      transformation: 4,
    },
  },
  {
    id: '4',
    name: 'Dữ liệu công chứng',
    description: 'Chuẩn hóa hồ sơ và văn bản công chứng',
    dataSource: 'Hệ thống công chứng',
    processor: 'Phạm Thị D',
    startTime: '07:45 - 10/12/2024',
    dataClassification: 'Dữ liệu trong ngành',
    progress: 45,
    status: 'error',
    totalRecords: 3400,
    processedRecords: 1530,
    errorRecords: 120,
    rules: {
      cleaning: 10,
      normalization: 7,
      transformation: 3,
    },
  },
];

export function ProcessingRuleSetupPage() {
  const [rules, setRules] = useState<ProcessingRule[]>(mockProcessingRules);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterClassification, setFilterClassification] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<ProcessingRule | null>(null);
  
  // Data source combobox state
  const [dataSourceSearch, setDataSourceSearch] = useState('');
  const [selectedDataSource, setSelectedDataSource] = useState('');
  const [showDataSourceDropdown, setShowDataSourceDropdown] = useState(false);
  const [selectedTotalRecords, setSelectedTotalRecords] = useState(0);
  
  // Rule management modal state
  const [showRuleManagementModal, setShowRuleManagementModal] = useState(false);
  const [ruleManagementTab, setRuleManagementTab] = useState<'cleaning' | 'normalization' | 'transformation'>('cleaning');
  const [ruleManagementSource, setRuleManagementSource] = useState<string>('');
  const [appliedRules, setAppliedRules] = useState<RuleDetail[]>(mockRuleDetails);
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);
  
  // Other modals state
  const [showClassificationModal, setShowClassificationModal] = useState(false);
  const [showRunModal, setShowRunModal] = useState(false);
  const [runningRule, setRunningRule] = useState<ProcessingRule | null>(null);
  const [runMode, setRunMode] = useState<'range' | 'auto' | 'all'>('all');
  const [startRecord, setStartRecord] = useState<string>('2000');
  const [endRecord, setEndRecord] = useState<string>('60000');
  const [showErrorListModal, setShowErrorListModal] = useState(false);
  const [errorListDataSource, setErrorListDataSource] = useState<string>('');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyDataSource, setHistoryDataSource] = useState<string>('');
  const [enableSchedule, setEnableSchedule] = useState(false);
  const [scheduleTime, setScheduleTime] = useState<string>('23:30');
  const [scheduleFrequency, setScheduleFrequency] = useState<'daily' | 'hourly' | 'weekly'>('daily');
  
  // Filter data sources based on search
  const filteredDataSources = mockDataSources.filter(source => 
    source.name.toLowerCase().includes(dataSourceSearch.toLowerCase()) ||
    source.category.toLowerCase().includes(dataSourceSearch.toLowerCase())
  );

  // Filter rules
  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.dataSource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || rule.status === filterStatus;
    const matchesClassification = filterClassification === 'all' || rule.dataClassification === filterClassification;
    return matchesSearch && matchesStatus && matchesClassification;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      processing: 'bg-blue-100 text-blue-700 border-blue-200',
      completed: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-slate-100 text-slate-600 border-slate-200',
      error: 'bg-red-100 text-red-700 border-red-200',
    };
    const labels = {
      processing: 'Đang xử lý',
      completed: 'Hoàn thành',
      pending: 'Chờ xử lý',
      error: 'Lỗi',
    };
    return (
      <span className={`px-2 py-1 text-xs border rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const stats = {
    total: rules.length,
    processing: rules.filter(r => r.status === 'processing').length,
    completed: rules.filter(r => r.status === 'completed').length,
    pending: rules.filter(r => r.status === 'pending').length,
    error: rules.filter(r => r.status === 'error').length,
  };

  return (
    <div className="space-y-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Tổng số</div>
              <div className="text-slate-900 mt-1">{stats.total}</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Đang xử lý</div>
              <div className="text-slate-900 mt-1">{stats.processing}</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Hoàn thành</div>
              <div className="text-slate-900 mt-1">{stats.completed}</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Chờ xử lý</div>
              <div className="text-slate-900 mt-1">{stats.pending}</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Lỗi</div>
              <div className="text-slate-900 mt-1">{stats.error}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex gap-3 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, mô tả, nguồn dữ liệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="processing">Đang xử lý</option>
            <option value="completed">Hoàn thành</option>
            <option value="pending">Chờ xử lý</option>
            <option value="error">Lỗi</option>
          </select>
          <select
            value={filterClassification}
            onChange={(e) => setFilterClassification(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Tất cả phân loại</option>
            <option value="Dữ liệu trong ngành">Dữ liệu trong ngành</option>
            <option value="Dữ liệu ngoài ngành">Dữ liệu ngoài ngành</option>
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Thêm mới
          </button>
          <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2 whitespace-nowrap">
            <Download className="w-4 h-4" />
            Xuất dữ liệu
          </button>
        </div>
      </div>

      {/* Data Cards Grid */}
      <div className="space-y-3">
        {filteredRules.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-500">
            Không tìm thấy dữ liệu phù hợp
          </div>
        ) : (
          filteredRules.map((rule) => (
            <div key={rule.id} className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-slate-900 mb-1">{rule.name}</h3>
                  <p className="text-xs text-slate-500">{rule.description}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {getStatusBadge(rule.status)}
                  <button
                    onClick={() => {
                      setSelectedRule(rule);
                      setShowDetailModal(true);
                    }}
                    className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-xs whitespace-nowrap"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Xem chi tiết
                  </button>
                  <button className="px-3 py-1.5 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 flex items-center gap-2 text-xs whitespace-nowrap" onClick={() => {
                    setRuleManagementSource(rule.dataSource);
                    setShowRuleManagementModal(true);
                  }}>
                    <Settings className="w-3.5 h-3.5" />
                    Quản lý quy tắc
                  </button>
                  <button className="px-3 py-1.5 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 flex items-center gap-2 text-xs whitespace-nowrap" onClick={() => {
                    setSelectedRule(rule);
                    setShowClassificationModal(true);
                  }}>
                    <Filter className="w-3.5 h-3.5" />
                    Phân loại dữ liệu
                  </button>
                  <button
                    disabled={rule.status === 'processing'}
                    onClick={() => {
                      setRunningRule(rule);
                      setShowRunModal(true);
                    }}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs whitespace-nowrap ${
                      rule.status === 'processing'
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'border border-green-300 text-green-700 hover:bg-green-50'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5" />
                    Chạy quy tắc
                  </button>
                  {rule.errorRecords > 0 && (
                    <button
                      onClick={() => {
                        setErrorListDataSource(rule.dataSource);
                        setShowErrorListModal(true);
                      }}
                      className="px-3 py-1.5 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 flex items-center gap-2 text-xs whitespace-nowrap"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      Danh sách lỗi
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setHistoryDataSource(rule.dataSource);
                      setShowHistoryModal(true);
                    }}
                    className="px-3 py-1.5 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 flex items-center gap-2 text-xs whitespace-nowrap"
                  >
                    <HistoryIcon className="w-3.5 h-3.5" />
                    Lịch sử xử lý
                  </button>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-4 gap-6 mb-3">
                <div className="flex items-center gap-2 text-xs">
                  <Settings className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <div>
                    <div className="text-slate-500">Cơ quan áp dụng</div>
                    <div className="text-slate-900 mt-0.5">{rule.dataSource}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <div>
                    <div className="text-slate-500">Người xử lý</div>
                    <div className="text-slate-900 mt-0.5">{rule.processor}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <div>
                    <div className="text-slate-500">Thời gian bắt đầu</div>
                    <div className="text-slate-900 mt-0.5">{rule.startTime}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Tag className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <div>
                    <div className="text-slate-500">Phân loại dữ liệu</div>
                    <div className="text-slate-900 mt-0.5">{rule.dataClassification}</div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span>Tiến độ xử lý</span>
                  <span className="text-blue-600">{rule.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      rule.status === 'completed' ? 'bg-green-500' :
                      rule.status === 'processing' ? 'bg-blue-500' :
                      rule.status === 'error' ? 'bg-red-500' :
                      'bg-slate-400'
                    }`}
                    style={{ width: `${rule.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                  <span>Đã xử lý: {rule.processedRecords.toLocaleString()} / {rule.totalRecords.toLocaleString()} bản ghi</span>
                  {rule.errorRecords > 0 && (
                    <span className="text-red-600">{rule.errorRecords} lỗi</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-slate-900">Thêm dữ liệu xử lý mới</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Tên dữ liệu</label>
                <input
                  type="text"
                  placeholder="Nhập tên dữ liệu"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">Mô tả</label>
                <textarea
                  placeholder="Nhập mô tả chi tiết"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Người xử lý</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="">Chọn người xử lý</option>
                    <option value="user1">Nguyễn Văn A</option>
                    <option value="user2">Trần Thị B</option>
                    <option value="user3">Lê Văn C</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Phân loại dữ liệu</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="">Chọn phân loại</option>
                    <option value="internal">Dữ liệu trong ngành</option>
                    <option value="external">Dữ liệu ngoài ngành</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">Nguồn dữ liệu</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Chọn nguồn dữ liệu"
                    value={dataSourceSearch}
                    onChange={(e) => setDataSourceSearch(e.target.value)}
                    onFocus={() => setShowDataSourceDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDataSourceDropdown(false), 200)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {showDataSourceDropdown && filteredDataSources.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border border-slate-300 rounded-b-lg shadow-lg max-h-40 overflow-y-auto">
                      {filteredDataSources.map(source => (
                        <div
                          key={source.id}
                          className="px-3 py-2 cursor-pointer hover:bg-slate-50"
                          onClick={() => {
                            setSelectedDataSource(source.name);
                            setDataSourceSearch(source.name);
                            setSelectedTotalRecords(source.totalRecords);
                            setShowDataSourceDropdown(false);
                          }}
                        >
                          {source.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">Tổng số bản ghi</label>
                <input
                  type="text"
                  placeholder="Sẽ tự động điền khi chọn nguồn dữ liệu"
                  value={selectedTotalRecords > 0 ? selectedTotalRecords.toLocaleString() : ''}
                  readOnly
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 cursor-not-allowed"
                />
              </div>
              
              {/* Schedule Section */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    id="enableScheduleModal"
                    checked={enableSchedule}
                    onChange={(e) => setEnableSchedule(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="enableScheduleModal" className="text-sm text-slate-900 cursor-pointer">
                    Đặt lịch chạy tự động khi có dữ liệu mới
                  </label>
                </div>
                
                {enableSchedule && (
                  <div className="ml-7 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">Tần suất:</label>
                        <select
                          value={scheduleFrequency}
                          onChange={(e) => setScheduleFrequency(e.target.value as 'daily' | 'hourly' | 'weekly')}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="daily">Hàng ngày</option>
                          <option value="hourly">Mỗi giờ</option>
                          <option value="weekly">Hàng tuần</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">Thời gian chạy:</label>
                        <input
                          type="time"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="text-xs text-slate-600 bg-white border border-slate-200 rounded p-2">
                      <Clock className="w-3.5 h-3.5 inline mr-1" />
                      Hệ thống sẽ tự động chạy quy tắc vào lúc <strong>{scheduleTime}</strong> {scheduleFrequency === 'daily' ? 'hàng ngày' : scheduleFrequency === 'hourly' ? 'mỗi giờ' : 'hàng tuần'} khi phát hiện dữ liệu mới.
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="text-sm text-blue-900 mb-3">Thông tin xử lý:</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-700">Nguồn dữ liệu:</span>
                    <span className="text-slate-900">{selectedDataSource}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-700">Số bản ghi:</span>
                    <span className="text-slate-900">{selectedTotalRecords.toLocaleString()} bản ghi</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedRule && (
        <ConfigDetailModal
          config={{
            status: selectedRule.status === 'completed' ? 'completed' : selectedRule.status === 'processing' ? 'processing' : 'pending',
            dataSource: selectedRule.dataSource,
            totalRecords: selectedRule.totalRecords,
            processedRecords: selectedRule.processedRecords,
            progress: selectedRule.progress,
            startTime: selectedRule.startTime,
            executor: selectedRule.processor,
            sourceType: selectedRule.dataClassification,
            appliedRules: selectedRule.rules.cleaning + selectedRule.rules.normalization + selectedRule.rules.transformation,
            totalRules: selectedRule.rules.cleaning + selectedRule.rules.normalization + selectedRule.rules.transformation
          }}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedRule(null);
          }}
        />
      )}

      {/* Rule Management Modal */}
      {showRuleManagementModal && (
        <RuleManagementModal
          config={{ dataSource: ruleManagementSource }}
          onClose={() => setShowRuleManagementModal(false)}
        />
      )}

      {/* Data Classification Modal */}
      {showClassificationModal && selectedRule && (
        <DataClassificationModal
          config={{
            dataSource: selectedRule.dataSource,
            classification: selectedRule.dataClassification.includes('trong ngành') ? 'internal' : 'external'
          }}
          onClose={() => {
            setShowClassificationModal(false);
            setSelectedRule(null);
          }}
        />
      )}

      {/* Run Rules Modal */}
      {showRunModal && runningRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-slate-900">Xác nhận chạy quy tắc</h3>
            </div>
            
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Play className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-slate-900 mb-2">
                    Chạy {(runningRule.rules.cleaning + runningRule.rules.normalization + runningRule.rules.transformation)} quy tắc xử lý?
                  </h4>
                  <p className="text-sm text-slate-600 mb-4">
                    Hệ thống sẽ áp dụng các quy tắc đã được cấu hình để xử lý dữ liệu. 
                    Tiến trình có thể được theo dõi trong tab "Lịch sử xử lý".
                  </p>
                  
                  {/* Run Mode Selection */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                    <h5 className="text-sm text-slate-900 mb-3">Cấu hình phạm vi chạy:</h5>
                    <div className="space-y-3">
                      {/* Option 1: Specific Range */}
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="runMode"
                          value="range"
                          checked={runMode === 'range'}
                          onChange={() => setRunMode('range')}
                          className="mt-1 w-4 h-4 text-blue-600"
                        />
                        <div className="flex-1">
                          <div className="text-sm text-slate-900 mb-2">Chạy thủ công từ bản ghi số</div>
                          {runMode === 'range' && (
                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                <label className="block text-xs text-slate-600 mb-1">Từ bản ghi số:</label>
                                <input
                                  type="number"
                                  value={startRecord}
                                  onChange={(e) => setStartRecord(e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="2000"
                                  min="1"
                                />
                              </div>
                              <div className="flex-1">
                                <label className="block text-xs text-slate-600 mb-1">Đến bản ghi số:</label>
                                <input
                                  type="number"
                                  value={endRecord}
                                  onChange={(e) => setEndRecord(e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="60000"
                                  min="1"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </label>

                      {/* Option 2: Auto from last */}
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="runMode"
                          value="auto"
                          checked={runMode === 'auto'}
                          onChange={() => setRunMode('auto')}
                          className="mt-1 w-4 h-4 text-blue-600"
                        />
                        <div className="flex-1">
                          <div className="text-sm text-slate-900">Chạy tự động (tiếp tục từ lần trước)</div>
                          <div className="text-xs text-slate-500 mt-1">
                            Hệ thống sẽ tự động tiếp tục từ bản ghi {runningRule.processedRecords.toLocaleString()} đến bản ghi {runningRule.totalRecords.toLocaleString()}
                          </div>
                        </div>
                      </label>

                      {/* Option 3: Run all */}
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="runMode"
                          value="all"
                          checked={runMode === 'all'}
                          onChange={() => setRunMode('all')}
                          className="mt-1 w-4 h-4 text-blue-600"
                        />
                        <div className="flex-1">
                          <div className="text-sm text-slate-900">Chạy lại toàn bộ</div>
                          <div className="text-xs text-slate-500 mt-1">
                            Xử lý lại toàn bộ {runningRule.totalRecords.toLocaleString()} bản ghi từ đầu
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  {/* Schedule Section */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="checkbox"
                        id="enableScheduleRunModal"
                        checked={enableSchedule}
                        onChange={(e) => setEnableSchedule(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <label htmlFor="enableScheduleRunModal" className="text-sm text-slate-900 cursor-pointer">
                        Đặt lịch chạy tự động khi có dữ liệu mới
                      </label>
                    </div>
                    
                    {enableSchedule && (
                      <div className="ml-7 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-slate-600 mb-1">Tần suất:</label>
                            <select
                              value={scheduleFrequency}
                              onChange={(e) => setScheduleFrequency(e.target.value as 'daily' | 'hourly' | 'weekly')}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="daily">Hàng ngày</option>
                              <option value="hourly">Mỗi giờ</option>
                              <option value="weekly">Hàng tuần</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-slate-600 mb-1">Thời gian chạy:</label>
                            <input
                              type="time"
                              value={scheduleTime}
                              onChange={(e) => setScheduleTime(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div className="text-xs text-slate-600 bg-white border border-slate-200 rounded p-2">
                          <Clock className="w-3.5 h-3.5 inline mr-1" />
                          Hệ thống sẽ tự động chạy quy tắc vào lúc <strong>{scheduleTime}</strong> {scheduleFrequency === 'daily' ? 'hàng ngày' : scheduleFrequency === 'hourly' ? 'mỗi giờ' : 'hàng tuần'} khi phát hiện dữ liệu mới.
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="text-sm text-blue-900 mb-3">Thông tin xử lý:</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-700">Nguồn dữ liệu:</span>
                        <span className="text-slate-900">{runningRule.dataSource}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Phạm vi xử lý:</span>
                        <span className="text-slate-900">
                          {runMode === 'range' 
                            ? `Từ ${parseInt(startRecord || '0').toLocaleString()} → ${parseInt(endRecord || '0').toLocaleString()}`
                            : runMode === 'auto'
                            ? `Từ bản ghi ${runningRule.processedRecords.toLocaleString()} → ${runningRule.totalRecords.toLocaleString()}`
                            : `Tất cả ${runningRule.totalRecords.toLocaleString()} bản ghi`
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Số bản ghi sẽ xử lý:</span>
                        <span className="text-slate-900">
                          {runMode === 'range' 
                            ? `${Math.max(0, (parseInt(endRecord || '0') - parseInt(startRecord || '0') + 1)).toLocaleString()} bản ghi`
                            : runMode === 'auto'
                            ? `${(runningRule.totalRecords - runningRule.processedRecords).toLocaleString()} bản ghi`
                            : `${runningRule.totalRecords.toLocaleString()} bản ghi`
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Số quy tắc:</span>
                        <span className="text-slate-900">{runningRule.rules.cleaning + runningRule.rules.normalization + runningRule.rules.transformation} quy tắc</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Phân loại:</span>
                        <span className="text-slate-900">
                          {runningRule.dataClassification === 'Dữ liệu trong ngành' ? 'Trong ngành (10 quy tắc)' : 'Ngoài ngành (3 quy tắc)'}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-blue-200 flex justify-between">
                        <span className="text-blue-900">Ước tính thời gian:</span>
                        <span className="text-blue-900">
                          ~{runMode === 'range' 
                            ? Math.ceil(Math.max(0, (parseInt(endRecord || '0') - parseInt(startRecord || '0') + 1)) / 1000)
                            : runMode === 'auto'
                            ? Math.ceil((runningRule.totalRecords - runningRule.processedRecords) / 1000)
                            : Math.ceil(runningRule.totalRecords / 1000)
                          } phút
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs text-amber-800">
                      <strong>Lưu ý:</strong> Quá trình xử lý sẽ chạy ở chế độ nền. 
                      Bạn có thể tiếp tục sử dụng hệ thống trong khi chờ đợi.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowRunModal(false);
                    setRunningRule(null);
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    alert(`Bắt đầu chạy ${runningRule.rules.cleaning + runningRule.rules.normalization + runningRule.rules.transformation} quy tắc cho "${runningRule.dataSource}"\n\nƯớc tính thời gian: ${Math.ceil(runningRule.totalRecords / 1000)} phút`);
                    setShowRunModal(false);
                    setRunningRule(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Bắt đầu chạy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error List Modal */}
      {showErrorListModal && (
        <ErrorListModal
          dataSource={errorListDataSource}
          onClose={() => setShowErrorListModal(false)}
        />
      )}

      {/* Processing History Modal */}
      {showHistoryModal && (
        <ProcessingHistoryModal
          isOpen={showHistoryModal}
          dataSource={historyDataSource}
          onClose={() => setShowHistoryModal(false)}
        />
      )}
    </div>
  );
}