import { useState } from 'react';
import { DateInput } from '../pages/collection/collectionUi';
import { X, FileText, Server, Calendar, AlertCircle, Download, Database, Table, Columns, Check, Search, ChevronRight, User, Building } from 'lucide-react';

interface DataRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: any) => void;
  services: any[];
}

interface DatabaseTable {
  name: string;
  description: string;
  rowCount: number;
  columns: TableColumn[];
}

interface TableColumn {
  name: string;
  type: string;
  nullable: boolean;
  isPrimaryKey: boolean;
  description: string;
}

// Mock database schema (same as AddServiceModal)
const databases = [
  {
    name: 'DB_HOTICH',
    description: 'Cơ sở dữ liệu Hộ tịch điện tử',
    tables: [
      {
        name: 'tbl_khai_sinh',
        description: 'Bảng khai sinh',
        rowCount: 15420000,
        columns: [
          { name: 'id', type: 'bigint', nullable: false, isPrimaryKey: true, description: 'Mã định danh' },
          { name: 'so_giay_khai_sinh', type: 'varchar(50)', nullable: false, isPrimaryKey: false, description: 'Số giấy khai sinh' },
          { name: 'ho_ten', type: 'nvarchar(255)', nullable: false, isPrimaryKey: false, description: 'Họ và tên' },
          { name: 'ngay_sinh', type: 'date', nullable: false, isPrimaryKey: false, description: 'Ngày sinh' },
          { name: 'gioi_tinh', type: 'varchar(10)', nullable: false, isPrimaryKey: false, description: 'Giới tính' },
          { name: 'noi_sinh', type: 'nvarchar(255)', nullable: false, isPrimaryKey: false, description: 'Nơi sinh' },
          { name: 'que_quan', type: 'nvarchar(255)', nullable: true, isPrimaryKey: false, description: 'Quê quán' },
          { name: 'dan_toc', type: 'nvarchar(50)', nullable: true, isPrimaryKey: false, description: 'Dân tộc' },
          { name: 'quoc_tich', type: 'nvarchar(50)', nullable: false, isPrimaryKey: false, description: 'Quốc tịch' },
          { name: 'ho_ten_cha', type: 'nvarchar(255)', nullable: true, isPrimaryKey: false, description: 'Họ tên cha' },
          { name: 'cccd_cha', type: 'varchar(12)', nullable: true, isPrimaryKey: false, description: 'CCCD của cha' },
          { name: 'ho_ten_me', type: 'nvarchar(255)', nullable: true, isPrimaryKey: false, description: 'Họ tên mẹ' },
          { name: 'cccd_me', type: 'varchar(12)', nullable: true, isPrimaryKey: false, description: 'CCCD của mẹ' },
          { name: 'nguoi_khai', type: 'nvarchar(255)', nullable: false, isPrimaryKey: false, description: 'Người khai' },
          { name: 'ngay_dang_ky', type: 'date', nullable: false, isPrimaryKey: false, description: 'Ngày đăng ký' },
          { name: 'co_quan_dang_ky', type: 'nvarchar(255)', nullable: false, isPrimaryKey: false, description: 'Cơ quan đăng ký' },
          { name: 'nguoi_ky', type: 'nvarchar(255)', nullable: false, isPrimaryKey: false, description: 'Người ký' },
          { name: 'ghi_chu', type: 'nvarchar(500)', nullable: true, isPrimaryKey: false, description: 'Ghi chú' },
          { name: 'created_at', type: 'datetime', nullable: false, isPrimaryKey: false, description: 'Ngày tạo bản ghi' },
          { name: 'updated_at', type: 'datetime', nullable: true, isPrimaryKey: false, description: 'Ngày cập nhật' }
        ]
      },
      {
        name: 'tbl_ket_hon',
        description: 'Bảng kết hôn',
        rowCount: 8540000,
        columns: [
          { name: 'id', type: 'bigint', nullable: false, isPrimaryKey: true, description: 'Mã định danh' },
          { name: 'so_giay_ket_hon', type: 'varchar(50)', nullable: false, isPrimaryKey: false, description: 'Số giấy kết hôn' },
          { name: 'ho_ten_chong', type: 'nvarchar(255)', nullable: false, isPrimaryKey: false, description: 'Họ tên chồng' },
          { name: 'cccd_chong', type: 'varchar(12)', nullable: false, isPrimaryKey: false, description: 'CCCD chồng' },
          { name: 'ngay_sinh_chong', type: 'date', nullable: false, isPrimaryKey: false, description: 'Ngày sinh chồng' },
          { name: 'ho_ten_vo', type: 'nvarchar(255)', nullable: false, isPrimaryKey: false, description: 'Họ tên vợ' },
          { name: 'cccd_vo', type: 'varchar(12)', nullable: false, isPrimaryKey: false, description: 'CCCD vợ' },
          { name: 'ngay_sinh_vo', type: 'date', nullable: false, isPrimaryKey: false, description: 'Ngày sinh vợ' },
          { name: 'ngay_dang_ky', type: 'date', nullable: false, isPrimaryKey: false, description: 'Ngày đăng ký kết hôn' },
          { name: 'co_quan_dang_ky', type: 'nvarchar(255)', nullable: false, isPrimaryKey: false, description: 'Cơ quan đăng ký' },
          { name: 'nguoi_ky', type: 'nvarchar(255)', nullable: false, isPrimaryKey: false, description: 'Người ký' },
          { name: 'created_at', type: 'datetime', nullable: false, isPrimaryKey: false, description: 'Ngày tạo bản ghi' },
          { name: 'updated_at', type: 'datetime', nullable: true, isPrimaryKey: false, description: 'Ngày cập nhật' }
        ]
      },
      {
        name: 'tbl_ly_hon',
        description: 'Bảng ly hôn',
        rowCount: 1250000,
        columns: [
          { name: 'id', type: 'bigint', nullable: false, isPrimaryKey: true, description: 'Mã định danh' },
          { name: 'so_giay_ly_hon', type: 'varchar(50)', nullable: false, isPrimaryKey: false, description: 'Số giấy ly hôn' },
          { name: 'ho_ten_chong', type: 'nvarchar(255)', nullable: false, isPrimaryKey: false, description: 'Họ tên chồng' },
          { name: 'cccd_chong', type: 'varchar(12)', nullable: false, isPrimaryKey: false, description: 'CCCD chồng' },
          { name: 'ho_ten_vo', type: 'nvarchar(255)', nullable: false, isPrimaryKey: false, description: 'Họ tên vợ' },
          { name: 'cccd_vo', type: 'varchar(12)', nullable: false, isPrimaryKey: false, description: 'CCCD vợ' },
          { name: 'ngay_ly_hon', type: 'date', nullable: false, isPrimaryKey: false, description: 'Ngày ly hôn' },
          { name: 'ly_do', type: 'nvarchar(500)', nullable: true, isPrimaryKey: false, description: 'Lý do ly hôn' },
          { name: 'quyen_nuoi_con', type: 'nvarchar(500)', nullable: true, isPrimaryKey: false, description: 'Quyền nuôi con' },
          { name: 'co_quan_dang_ky', type: 'nvarchar(255)', nullable: false, isPrimaryKey: false, description: 'Cơ quan đăng ký' },
          { name: 'created_at', type: 'datetime', nullable: false, isPrimaryKey: false, description: 'Ngày tạo bản ghi' }
        ]
      },
      {
        name: 'tbl_khai_tu',
        description: 'Bảng khai tử',
        rowCount: 3420000,
        columns: [
          { name: 'id', type: 'bigint', nullable: false, isPrimaryKey: true, description: 'Mã định danh' },
          { name: 'so_giay_khai_tu', type: 'varchar(50)', nullable: false, isPrimaryKey: false, description: 'Số giấy khai tử' },
          { name: 'ho_ten_nguoi_chet', type: 'nvarchar(255)', nullable: false, isPrimaryKey: false, description: 'Họ tên người chết' },
          { name: 'cccd', type: 'varchar(12)', nullable: true, isPrimaryKey: false, description: 'CCCD' },
          { name: 'ngay_sinh', type: 'date', nullable: false, isPrimaryKey: false, description: 'Ngày sinh' },
          { name: 'ngay_chet', type: 'date', nullable: false, isPrimaryKey: false, description: 'Ngày chết' },
          { name: 'noi_chet', type: 'nvarchar(255)', nullable: false, isPrimaryKey: false, description: 'Nơi chết' },
          { name: 'nguyen_nhan_chet', type: 'nvarchar(500)', nullable: true, isPrimaryKey: false, description: 'Nguyên nhân chết' },
          { name: 'nguoi_khai', type: 'nvarchar(255)', nullable: false, isPrimaryKey: false, description: 'Người khai' },
          { name: 'co_quan_dang_ky', type: 'nvarchar(255)', nullable: false, isPrimaryKey: false, description: 'Cơ quan đăng ký' },
          { name: 'created_at', type: 'datetime', nullable: false, isPrimaryKey: false, description: 'Ngày tạo bản ghi' }
        ]
      }
    ]
  },
  {
    name: 'DB_BPBD',
    description: 'Cơ sở dữ liệu Biện pháp bảo đảm',
    tables: [
      {
        name: 'tbl_tai_san_the_chap',
        description: 'Bảng tài sản thế chấp',
        rowCount: 8965000,
        columns: [
          { name: 'id', type: 'bigint', nullable: false, isPrimaryKey: true, description: 'Mã định danh' },
          { name: 'ma_giao_dich', type: 'varchar(50)', nullable: false, isPrimaryKey: false, description: 'Mã giao dịch' },
          { name: 'loai_tai_san', type: 'nvarchar(100)', nullable: false, isPrimaryKey: false, description: 'Loại tài sản' },
          { name: 'mo_ta_tai_san', type: 'nvarchar(500)', nullable: false, isPrimaryKey: false, description: 'Mô tả tài sản' },
          { name: 'gia_tri_uoc_tinh', type: 'decimal(18,2)', nullable: false, isPrimaryKey: false, description: 'Giá trị ước tính' },
          { name: 'ben_bao_dam', type: 'nvarchar(255)', nullable: false, isPrimaryKey: false, description: 'Bên bảo đảm' },
          { name: 'cccd_ben_bao_dam', type: 'varchar(12)', nullable: true, isPrimaryKey: false, description: 'CCCD bên bảo đảm' },
          { name: 'ben_nhan_bao_dam', type: 'nvarchar(255)', nullable: false, isPrimaryKey: false, description: 'Bên nhận bảo đảm' },
          { name: 'ngay_dang_ky', type: 'date', nullable: false, isPrimaryKey: false, description: 'Ngày đăng ký' },
          { name: 'ngay_het_han', type: 'date', nullable: true, isPrimaryKey: false, description: 'Ngày hết hạn' },
          { name: 'trang_thai', type: 'varchar(50)', nullable: false, isPrimaryKey: false, description: 'Trạng thái' },
          { name: 'co_quan_dang_ky', type: 'nvarchar(255)', nullable: false, isPrimaryKey: false, description: 'Cơ quan đăng ký' },
          { name: 'created_at', type: 'datetime', nullable: false, isPrimaryKey: false, description: 'Ngày tạo bản ghi' },
          { name: 'updated_at', type: 'datetime', nullable: true, isPrimaryKey: false, description: 'Ngày cập nhật' }
        ]
      }
    ]
  },
  {
    name: 'DB_THADS',
    description: 'Cơ sở dữ liệu Thi hành án dân sự',
    tables: [
      {
        name: 'tbl_ban_an',
        description: 'Bảng bản án',
        rowCount: 5420000,
        columns: [
          { name: 'id', type: 'bigint', nullable: false, isPrimaryKey: true, description: 'Mã định danh' },
          { name: 'so_ban_an', type: 'varchar(50)', nullable: false, isPrimaryKey: false, description: 'Số bản án' },
          { name: 'loai_an', type: 'nvarchar(100)', nullable: false, isPrimaryKey: false, description: 'Loại án' },
          { name: 'nguyen_don', type: 'nvarchar(255)', nullable: false, isPrimaryKey: false, description: 'Nguyên đơn' },
          { name: 'bi_don', type: 'nvarchar(255)', nullable: false, isPrimaryKey: false, description: 'Bị đơn' },
          { name: 'noi_dung_an', type: 'nvarchar(max)', nullable: false, isPrimaryKey: false, description: 'Nội dung án' },
          { name: 'ket_qua', type: 'nvarchar(500)', nullable: false, isPrimaryKey: false, description: 'Kết quả xét xử' },
          { name: 'toa_an', type: 'nvarchar(255)', nullable: false, isPrimaryKey: false, description: 'Tòa án' },
          { name: 'ngay_tuyen', type: 'date', nullable: false, isPrimaryKey: false, description: 'Ngày tuyên án' },
          { name: 'trang_thai_thi_hanh', type: 'varchar(50)', nullable: false, isPrimaryKey: false, description: 'Trạng thái thi hành' },
          { name: 'created_at', type: 'datetime', nullable: false, isPrimaryKey: false, description: 'Ngày tạo bản ghi' }
        ]
      }
    ]
  }
];

export function DataRequestModal({ isOpen, onClose, onSubmit, services }: DataRequestModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    requester: '',
    requesterDepartment: '',
    requesterEmail: '',
    requesterPhone: '',
    approver: '',
    approverDepartment: '',
    database: '',
    table: '',
    priority: 'medium',
    purpose: '',
    estimatedRows: '',
    format: 'JSON',
    apiEndpoint: '',
    filters: '',
    deliveryDate: ''
  });

  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [selectedTable, setSelectedTable] = useState<DatabaseTable | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [columnSearch, setColumnSearch] = useState('');

  if (!isOpen) return null;

  const currentDatabase = databases.find(db => db.name === selectedDatabase);
  const tables = currentDatabase?.tables || [];

  const handleDatabaseChange = (dbName: string) => {
    setSelectedDatabase(dbName);
    setFormData({ ...formData, database: dbName, table: '' });
    setSelectedTable(null);
    setSelectedColumns([]);
  };

  const handleTableChange = (tableName: string) => {
    const table = tables.find(t => t.name === tableName);
    setSelectedTable(table || null);
    setFormData({ ...formData, table: tableName });
    setSelectedColumns([]);
  };

  const toggleColumn = (columnName: string) => {
    if (selectedColumns.includes(columnName)) {
      setSelectedColumns(selectedColumns.filter(c => c !== columnName));
    } else {
      setSelectedColumns([...selectedColumns, columnName]);
    }
  };

  const selectAllColumns = () => {
    if (selectedTable) {
      setSelectedColumns(selectedTable.columns.map(c => c.name));
    }
  };

  const deselectAllColumns = () => {
    setSelectedColumns([]);
  };

  const filteredColumns = selectedTable?.columns.filter(col => 
    col.name.toLowerCase().includes(columnSearch.toLowerCase()) ||
    col.description.toLowerCase().includes(columnSearch.toLowerCase())
  ) || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      selectedColumns,
      id: Date.now().toString(),
      requestCode: `REQ-2024-${String(Date.now()).slice(-6)}`,
      serviceName: `${formData.database} - ${formData.table}`,
      requestDate: new Date().toLocaleString('vi-VN'),
      status: 'pending',
      estimatedRows: formData.estimatedRows ? parseInt(formData.estimatedRows) : undefined
    });
    
    // Reset form
    setCurrentStep(1);
    setSelectedDatabase('');
    setSelectedTable(null);
    setSelectedColumns([]);
    setFormData({
      requester: '',
      requesterDepartment: '',
      requesterEmail: '',
      requesterPhone: '',
      approver: '',
      approverDepartment: '',
      database: '',
      table: '',
      priority: 'medium',
      purpose: '',
      estimatedRows: '',
      format: 'JSON',
      apiEndpoint: '',
      filters: '',
      deliveryDate: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-slate-900">Tạo yêu cầu cung cấp dữ liệu mới</h2>
            <p className="text-sm text-slate-600">Bước {currentStep}/3</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Đóng" aria-label="Đóng"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                1
              </div>
              <span className={`text-sm ${currentStep >= 1 ? 'text-slate-900' : 'text-slate-500'}`}>
                Thông tin yêu cầu
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                2
              </div>
              <span className={`text-sm ${currentStep >= 2 ? 'text-slate-900' : 'text-slate-500'}`}>
                Chọn dữ liệu
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 3 ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                3
              </div>
              <span className={`text-sm ${currentStep >= 3 ? 'text-slate-900' : 'text-slate-500'}`}>
                Cấu hình xuất dữ liệu
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* Step 1: Request Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">
                      Người yêu cầu <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={formData.requester}
                        onChange={(e) => setFormData({ ...formData, requester: e.target.value })}
                        placeholder="Họ và tên"
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">
                      Đơn vị/Tổ chức <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={formData.requesterDepartment}
                        onChange={(e) => setFormData({ ...formData, requesterDepartment: e.target.value })}
                        placeholder="VD: Bộ Công an"
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">
                      Email liên hệ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.requesterEmail}
                      onChange={(e) => setFormData({ ...formData, requesterEmail: e.target.value })}
                      placeholder="email@example.com"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.requesterPhone}
                      onChange={(e) => setFormData({ ...formData, requesterPhone: e.target.value })}
                      placeholder="0912345678"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Mục đích sử dụng dữ liệu <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    rows={4}
                    placeholder="Mô tả chi tiết mục đích và phạm vi sử dụng dữ liệu..."
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Approver Information */}
                <div className="border-t border-slate-200 pt-4">
                  <h3 className="text-sm text-slate-900 mb-3">Thông tin phê duyệt</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-700 mb-2">
                        Người cấp
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          value={formData.approver}
                          onChange={(e) => setFormData({ ...formData, approver: e.target.value })}
                          placeholder="Họ và tên người phê duyệt"
                          className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-700 mb-2">
                        Đơn vị cấp
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          value={formData.approverDepartment}
                          onChange={(e) => setFormData({ ...formData, approverDepartment: e.target.value })}
                          placeholder="Đơn vị phê duyệt"
                          className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-3">
                    Độ ưu tiên <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { value: 'urgent', label: 'Khẩn cấp', color: 'red', desc: 'Xử lý ngay' },
                      { value: 'high', label: 'Cao', color: 'orange', desc: '< 24h' },
                      { value: 'medium', label: 'Trung bình', color: 'blue', desc: '1-2 ngày' },
                      { value: 'low', label: 'Thấp', color: 'slate', desc: '3-5 ngày' }
                    ].map(priority => (
                      <button
                        key={priority.value}
                        type="button"
                        onClick={() => setFormData({...formData, priority: priority.value})}
                        className={`p-3 border-2 rounded-lg text-left transition-all ${
                          formData.priority === priority.value
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`text-sm mb-1 ${
                          formData.priority === priority.value ? 'text-amber-900' : 'text-slate-900'
                        }`}>
                          {priority.label}
                        </div>
                        <div className="text-xs text-slate-600">{priority.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <div className="mb-1">Lưu ý quan trọng:</div>
                      <ul className="list-disc list-inside space-y-1 text-blue-800 text-xs">
                        <li>Yêu cầu sẽ được xem xét và phê duyệt trước khi xử lý</li>
                        <li>Dữ liệu cung cấp chỉ được sử dụng đúng mục đích đã đăng ký</li>
                        <li>Nghiêm cấm chia sẻ hoặc chuyển giao dữ liệu cho bên thứ ba</li>
                        <li>Vi phạm sẽ bị xử lý theo quy định pháp luật</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Select Database, Table & Columns */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Database Selection */}
                <div>
                  <label className="block text-sm text-slate-700 mb-3">
                    Chọn cơ sở dữ liệu <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {databases.map((db) => (
                      <button
                        key={db.name}
                        type="button"
                        onClick={() => handleDatabaseChange(db.name)}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          selectedDatabase === db.name
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-slate-200 hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Database className={`w-5 h-5 ${
                            selectedDatabase === db.name ? 'text-amber-600' : 'text-slate-500'
                          }`} />
                          <span className="text-sm font-mono text-slate-900">{db.name}</span>
                        </div>
                        <p className="text-xs text-slate-600">{db.description}</p>
                        <div className="text-xs text-slate-500 mt-2">
                          {db.tables.length} bảng
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table Selection */}
                {selectedDatabase && (
                  <div>
                    <label className="block text-sm text-slate-700 mb-3">
                      Chọn bảng dữ liệu <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {tables.map((table) => (
                        <button
                          key={table.name}
                          type="button"
                          onClick={() => handleTableChange(table.name)}
                          className={`p-4 border-2 rounded-lg text-left transition-all ${
                            selectedTable?.name === table.name
                              ? 'border-amber-500 bg-amber-50'
                              : 'border-slate-200 hover:border-amber-300'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <Table className={`w-5 h-5 ${
                              selectedTable?.name === table.name ? 'text-amber-600' : 'text-slate-500'
                            }`} />
                            <span className="text-sm font-mono text-slate-900">{table.name}</span>
                          </div>
                          <p className="text-xs text-slate-600 mb-2">{table.description}</p>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span>{table.columns.length} cột</span>
                            <span>•</span>
                            <span>{table.rowCount.toLocaleString()} bản ghi</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Column Selection */}
                {selectedTable && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm text-slate-700">
                        Chọn các trường dữ liệu cần lấy <span className="text-red-500">*</span>
                        <span className="ml-2 text-amber-600">
                          ({selectedColumns.length}/{selectedTable.columns.length})
                        </span>
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={selectAllColumns}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Chọn tất cả
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={deselectAllColumns}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Bỏ chọn tất cả
                        </button>
                      </div>
                    </div>

                    {/* Search */}
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={columnSearch}
                        onChange={(e) => setColumnSearch(e.target.value)}
                        placeholder="Tìm kiếm trường dữ liệu..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      />
                    </div>

                    {/* Columns List */}
                    <div className="border border-slate-200 rounded-lg max-h-96 overflow-y-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs text-slate-600 w-12">
                              <input
                                type="checkbox"
                                checked={selectedColumns.length === selectedTable.columns.length}
                                onChange={(e) => e.target.checked ? selectAllColumns() : deselectAllColumns()}
                                className="w-4 h-4 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                              />
                            </th>
                            <th className="px-4 py-3 text-left text-xs text-slate-600">Tên trường</th>
                            <th className="px-4 py-3 text-left text-xs text-slate-600">Kiểu dữ liệu</th>
                            <th className="px-4 py-3 text-left text-xs text-slate-600">Mô tả</th>
                            <th className="px-4 py-3 text-center text-xs text-slate-600">Bắt buộc</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {filteredColumns.map((column) => (
                            <tr
                              key={column.name}
                              className={`hover:bg-slate-50 cursor-pointer ${
                                selectedColumns.includes(column.name) ? 'bg-amber-50' : ''
                              }`}
                              onClick={() => toggleColumn(column.name)}
                            >
                              <td className="px-4 py-3">
                                <input
                                  type="checkbox"
                                  checked={selectedColumns.includes(column.name)}
                                  onChange={() => toggleColumn(column.name)}
                                  className="w-4 h-4 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <code className="text-sm text-blue-700">{column.name}</code>
                                  {column.isPrimaryKey && (
                                    <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                                      PK
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <code className="text-xs text-slate-600">{column.type}</code>
                              </td>
                              <td className="px-4 py-3 text-sm text-slate-600">
                                {column.description}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {!column.nullable ? (
                                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                                    Có
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                                    Không
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {selectedColumns.length > 0 && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-600 mt-0.5" />
                          <div className="flex-1">
                            <div className="text-sm text-green-900 mb-2">
                              Đã chọn {selectedColumns.length} trường dữ liệu
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {selectedColumns.map((col) => (
                                <code key={col} className="px-2 py-1 bg-white text-green-700 text-xs rounded border border-green-300">
                                  {col}
                                </code>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Export Configuration */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">
                      Định dạng xuất dữ liệu <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Download className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <select
                        required
                        value={formData.format}
                        onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="JSON">JSON - JavaScript Object Notation</option>
                        <option value="CSV">CSV - Comma Separated Values</option>
                        <option value="XML">XML - Extensible Markup Language</option>
                        <option value="Excel">Excel - Microsoft Excel (.xlsx)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 mb-2">
                      Số lượng bản ghi dự kiến
                    </label>
                    <input
                      type="number"
                      value={formData.estimatedRows}
                      onChange={(e) => setFormData({ ...formData, estimatedRows: e.target.value })}
                      placeholder="VD: 1000"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    API Endpoint (tùy chọn)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 bg-slate-100 px-3 py-2.5 border border-slate-300 rounded-lg">
                      /api/v1
                    </span>
                    <input
                      type="text"
                      value={formData.apiEndpoint}
                      onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                      placeholder="/data-export/civil-registry"
                      className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Endpoint để đơn vị yêu cầu có thể gọi API lấy dữ liệu (nếu cần)
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Điều kiện lọc dữ liệu (SQL WHERE clause)
                  </label>
                  <textarea
                    value={formData.filters}
                    onChange={(e) => setFormData({ ...formData, filters: e.target.value })}
                    rows={3}
                    placeholder="VD: ngay_sinh >= '1990-01-01' AND gioi_tinh = 'Nam'"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Để trống nếu muốn lấy toàn bộ dữ liệu
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Thời hạn cần có dữ liệu
                  </label>
                  <DateInput
                    ariaLabel="Thời hạn cần có dữ liệu"
                    value={formData.deliveryDate}
                    onChange={(v) => setFormData({ ...formData, deliveryDate: v })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Summary */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <h4 className="text-sm text-slate-900 mb-3">Tóm tắt yêu cầu</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Người yêu cầu:</span>
                      <span className="text-slate-900">{formData.requester || '(Chưa nhập)'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Đơn vị:</span>
                      <span className="text-slate-900">{formData.requesterDepartment || '(Chưa nhập)'}</span>
                    </div>
                    {formData.approver && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Người cấp:</span>
                        <span className="text-slate-900">{formData.approver}</span>
                      </div>
                    )}
                    {formData.approverDepartment && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Đơn vị cấp:</span>
                        <span className="text-slate-900">{formData.approverDepartment}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-600">Database:</span>
                      <code className="text-blue-700">{formData.database || '(Chưa chọn)'}</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Bảng:</span>
                      <code className="text-blue-700">{formData.table || '(Chưa chọn)'}</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Số trường:</span>
                      <span className="text-amber-700">{selectedColumns.length} trường</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Định dạng:</span>
                      <span className="text-slate-900">{formData.format}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Độ ưu tiên:</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        formData.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                        formData.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        formData.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {formData.priority === 'urgent' ? 'Khẩn cấp' :
                         formData.priority === 'high' ? 'Cao' :
                         formData.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Quay lại
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Hủy
              </button>
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (currentStep === 1 && (!formData.requester || !formData.requesterDepartment || !formData.requesterEmail || !formData.requesterPhone || !formData.purpose)) {
                      alert('Vui lòng điền đầy đủ thông tin bước 1');
                      return;
                    }
                    if (currentStep === 2 && (!selectedDatabase || !selectedTable || selectedColumns.length === 0)) {
                      alert('Vui lòng chọn database, bảng và ít nhất 1 trường dữ liệu');
                      return;
                    }
                    setCurrentStep(currentStep + 1);
                  }}
                  className="px-6 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Tiếp theo
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Gửi yêu cầu
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}