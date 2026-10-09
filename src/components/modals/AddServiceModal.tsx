import { useState } from 'react';
import { X, Server, Database, Code, Shield, FileText, Table, Columns, Check, Search, ChevronRight } from 'lucide-react';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: any) => void;
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

// Mock database schema
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

export function AddServiceModal({ isOpen, onClose, onSave }: AddServiceModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    department: '',
    database: '',
    table: '',
    description: '',
    apiEndpoint: '',
    method: 'GET',
    accessLevel: 'internal',
    documentation: ''
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
    onSave({
      ...formData,
      selectedColumns,
      id: Date.now().toString(),
      status: 'pending',
      createdBy: 'Người dùng hiện tại',
      createdDate: new Date().toISOString().split('T')[0],
      requestCount: 0,
      successRate: 0,
      avgResponseTime: 0
    });
    // Reset form
    setCurrentStep(1);
    setSelectedDatabase('');
    setSelectedTable(null);
    setSelectedColumns([]);
    setFormData({
      code: '',
      name: '',
      department: '',
      database: '',
      table: '',
      description: '',
      apiEndpoint: '',
      method: 'GET',
      accessLevel: 'internal',
      documentation: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-slate-900">Thiết lập dịch vụ cung cấp dữ liệu mới</h2>
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
                Thông tin cơ bản
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
                Chọn bảng & trường
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
                Cấu hình API
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">
                      Mã dịch vụ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="VD: SVC_HOTICH_001"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">
                      Tên dịch vụ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="VD: CSDL Hộ tịch điện tử"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Đơn vị quản lý <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="" disabled hidden>-- Chọn đơn vị --</option>
                    <option value="Cục Hành chính tư pháp">Cục Hành chính tư pháp</option>
                    <option value="Cục Quản lý thi hành án dân sự">Cục Quản lý thi hành án dân sự</option>
                    <option value="Cục Đăng ký giao dịch bảo đảm và BTNN">Cục Đăng ký giao dịch bảo đảm và BTNN</option>
                    <option value="Cục Kiểm tra văn bản và Quản lý xử lý vi phạm hành chính">Cục Kiểm tra văn bản và Quản lý xử lý vi phạm hành chính</option>
                    <option value="Cục Bổ trợ tư pháp">Cục Bổ trợ tư pháp</option>
                    <option value="Vụ Hợp tác quốc tế">Vụ Hợp tác quốc tế</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Mô tả dịch vụ <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Mô tả chi tiết về dịch vụ cung cấp dữ liệu..."
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
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
                        Chọn các trường dữ liệu <span className="text-red-500">*</span>
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

            {/* Step 3: API Configuration */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    API Endpoint <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 bg-slate-100 px-3 py-2.5 border border-slate-300 rounded-lg">
                      /api/v1
                    </span>
                    <input
                      type="text"
                      required
                      value={formData.apiEndpoint}
                      onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                      placeholder="/civil-registry/records"
                      className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">
                      Phương thức HTTP <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.method}
                      onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="GET">GET - Truy vấn dữ liệu</option>
                      <option value="POST">POST - Tạo mới dữ liệu</option>
                      <option value="PUT">PUT - Cập nhật dữ liệu</option>
                      <option value="DELETE">DELETE - Xóa dữ liệu</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 mb-2">
                      Cấp độ truy cập <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.accessLevel}
                      onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="public">Public - Công khai</option>
                      <option value="internal">Internal - Nội bộ ngành</option>
                      <option value="restricted">Restricted - Hạn chế</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Tài liệu hướng dẫn sử dụng
                  </label>
                  <textarea
                    value={formData.documentation}
                    onChange={(e) => setFormData({ ...formData, documentation: e.target.value })}
                    rows={4}
                    placeholder="Hướng dẫn chi tiết về cách sử dụng API, tham số, ví dụ request/response..."
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Summary */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <h4 className="text-sm text-slate-900 mb-3">Tóm tắt cấu hình</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Dịch vụ:</span>
                      <span className="text-slate-900">{formData.name || '(Chưa nhập)'}</span>
                    </div>
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
                      <span className="text-slate-600">Endpoint:</span>
                      <code className="text-blue-700">/api/v1{formData.apiEndpoint || '(Chưa nhập)'}</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Phương thức:</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        formData.method === 'GET' ? 'bg-green-100 text-green-700' :
                        formData.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {formData.method}
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
                    if (currentStep === 1 && (!formData.code || !formData.name || !formData.department || !formData.description)) {
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
                  Hoàn tất đăng ký
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
