import { useState } from 'react';
import { X, Search, SquarePen, Save, XCircle, Filter, ChevronDown, Database, Table, SearchX, Calculator, AlertCircle } from 'lucide-react';

interface DataRecord {
  id: number;
  recordId: string;
  fullName: string;
  birthDate: string;
  citizenId: string;
  address: string;
  gender: string;
  nationality: string;
  registrationDate: string;
  status: string;
  warning?: string;
  error?: string;
}

interface DataViewerProps {
  dataName: string;
  onClose: () => void;
}

// Dữ liệu mẫu
const sampleRecords: DataRecord[] = [
  {
    id: 1,
    recordId: 'KS-2024-001234',
    fullName: 'Nguyễn Văn A',
    birthDate: '1985-03-15',
    citizenId: '001085012345',
    address: 'Số 10, Ngõ 5, Phố ABC, Phường XYZ, Quận 123, Hà Nội',
    gender: 'Nam',
    nationality: 'Việt Nam',
    registrationDate: '2024-12-05 10:30:00',
    status: 'Đã xử lý'
  },
  {
    id: 2,
    recordId: 'KS-2024-001235',
    fullName: 'Trần Thị B',
    birthDate: '1990-07-22',
    citizenId: '001090045678',
    address: 'Số 25, Đường Láng, Phường Thành Công, Quận Ba Đình, Hà Nội',
    gender: 'Nữ',
    nationality: 'Việt Nam',
    registrationDate: '2024-12-05 11:15:00',
    status: 'Đã xử lý'
  },
  {
    id: 3,
    recordId: 'KS-2024-001236',
    fullName: 'Lê Văn C',
    birthDate: '1988-11-10',
    citizenId: '001088067890',
    address: 'Số 100, Phố Huế, Phường Minh Khai, Quận Hai Bà Trưng, Hà Nội',
    gender: 'Nam',
    nationality: 'Việt Nam',
    registrationDate: '2024-12-05 14:20:00',
    status: 'Đã xử lý'
  },
  {
    id: 4,
    recordId: 'KS-2024-001237',
    fullName: 'Phạm Thị D',
    birthDate: '1992-05-18',
    citizenId: '001092023456',
    address: 'Số 45, Nguyễn Trãi, Phường Thượng Đình, Quận Thanh Xuân, Hà Nội',
    gender: 'Nữ',
    nationality: 'Việt Nam',
    registrationDate: '2024-12-05 15:45:00',
    status: 'Đã xử lý',
    warning: 'Ngày đăng ký gần hạn'
  },
  {
    id: 5,
    recordId: 'KS-2024-001238',
    fullName: 'Hoàng Văn E',
    birthDate: '1987-09-30',
    citizenId: '001087034567',
    address: 'Số 78, Giải Phóng, Phường Đồng Tâm, Quận Hai Bà Trưng, Hà Nội',
    gender: 'Nam',
    nationality: 'Việt Nam',
    registrationDate: '2024-12-06 09:30:00',
    status: 'Đã xử lý'
  },
  {
    id: 6,
    recordId: 'KS-2024-001239',
    fullName: 'Đỗ Thị F',
    birthDate: '1995-12-25',
    citizenId: '001095056789',
    address: 'Số 12, Trần Duy Hưng, Phường Trung Hòa, Quận Cầu Giấy, Hà Nội',
    gender: 'Nữ',
    nationality: 'Việt Nam',
    registrationDate: '2024-12-06 10:15:00',
    status: 'Đã xử lý',
    error: 'Địa chỉ không đầy đủ'
  },
  {
    id: 7,
    recordId: 'KS-2024-001240',
    fullName: 'Vũ Văn G',
    birthDate: '1991-04-08',
    citizenId: '001091078901',
    address: 'Số 88, Lê Duẩn, Phường Khâm Thiên, Quận Đống Đa, Hà Nội',
    gender: 'Nam',
    nationality: 'Việt Nam',
    registrationDate: '2024-12-06 11:00:00',
    status: 'Đã xử lý',
    warning: 'Cần kiểm tra lại thông tin'
  },
  {
    id: 8,
    recordId: 'KS-2024-001241',
    fullName: 'Bùi Thị H',
    birthDate: '1989-08-14',
    citizenId: '001089089012',
    address: 'Số 33, Phạm Văn Đồng, Phường Xuân Đỉnh, Quận Bắc Từ Liêm, Hà Nội',
    gender: 'Nữ',
    nationality: 'Việt Nam',
    registrationDate: '2024-12-06 13:30:00',
    status: 'Đã xử lý',
    error: 'CCCD không hợp lệ'
  },
];

const columnDisplayNames: { [key: string]: string } = {
  recordId: 'Mã bản ghi',
  fullName: 'Họ và tên',
  birthDate: 'Ngày sinh',
  citizenId: 'Số CCCD',
  address: 'Địa chỉ',
  gender: 'Giới tính',
  nationality: 'Quốc tịch',
  registrationDate: 'Ngày đăng ký',
  status: 'Trạng thái'
};

export function DataViewer({ dataName, onClose }: DataViewerProps) {
  const [records, setRecords] = useState<DataRecord[]>(sampleRecords);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<DataRecord>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showFieldCalculator, setShowFieldCalculator] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'error' | 'warning'>('all');
  
  // Advanced Search State
  const [searchField, setSearchField] = useState('fullName');
  const [searchOperator, setSearchOperator] = useState('Like');
  const [searchValue, setSearchValue] = useState('');
  const [queryText, setQueryText] = useState('');

  // Field Calculator State
  const [calcField, setCalcField] = useState('');
  const [calcFunction, setCalcFunction] = useState('');
  const [calcExpression, setCalcExpression] = useState('');

  const handleEdit = (record: DataRecord) => {
    setEditingId(record.id);
    setEditData({ ...record });
  };

  const handleSave = (id: number) => {
    setRecords(records.map(r => 
      r.id === id ? { ...r, ...editData } : r
    ));
    setEditingId(null);
    setEditData({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleChange = (field: keyof DataRecord, value: string) => {
    setEditData({ ...editData, [field]: value });
  };

  const filteredRecords = records.filter(record => {
    // Tab filter
    if (selectedTab === 'error' && !record.error) return false;
    if (selectedTab === 'warning' && !record.warning) return false;

    // Search filter
    if (!searchTerm) return true;
    return Object.values(record).some(value => 
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const allColumns = Object.keys(columnDisplayNames);

  const stats = {
    all: records.length,
    error: records.filter(r => r.error).length,
    warning: records.filter(r => r.warning).length
  };

  const buildQuery = () => {
    if (!searchField || !searchValue) {
      setQueryText('');
      return;
    }

    const fieldName = columnDisplayNames[searchField];
    let query = `SELECT * FROM ${dataName.replace(/ /g, '_')} WHERE:\n\n`;
    
    if (searchOperator === 'Like') {
      query += `${searchField} LIKE '%${searchValue}%'`;
    } else if (searchOperator === '=') {
      query += `${searchField} = '${searchValue}'`;
    } else if (searchOperator === '>') {
      query += `${searchField} > '${searchValue}'`;
    } else if (searchOperator === '<') {
      query += `${searchField} < '${searchValue}'`;
    } else {
      query += `${searchField} ${searchOperator} '${searchValue}'`;
    }

    setQueryText(query);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-[95vw] w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-slate-900">Xem và Sửa Dữ liệu</h3>
              <p className="text-sm text-slate-500 mt-1">{dataName} • {filteredRecords.length} bản ghi</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600" title="Đóng" aria-label="Đóng">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setSelectedTab('all')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedTab === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Tất cả ({stats.all})
            </button>
            <button
              onClick={() => setSelectedTab('error')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedTab === 'error'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Dữ liệu lỗi ({stats.error})
            </button>
            <button
              onClick={() => setSelectedTab('warning')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedTab === 'warning'
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Dữ liệu cảnh báo ({stats.warning})
            </button>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-3 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm trong tất cả các trường..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button 
              onClick={() => setShowAdvancedSearch(true)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 transition-colors"
            >
              <SearchX className="w-4 h-4" />
              Tìm kiếm nâng cao
            </button>
            <button 
              onClick={() => setShowFieldCalculator(true)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Xử lý dữ liệu
            </button>
            <button 
              onClick={() => setShowFilterDialog(true)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 transition-colors"
            >
              <Table className="w-4 h-4" />
              Chọn cột hiển thị
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto p-6">
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider w-20">
                    STT
                  </th>
                  {allColumns.map(column => (
                    <th key={column} className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">
                      {columnDisplayNames[column]}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider w-32">
                    TRẠNG THÁI
                  </th>
                  <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider w-24">
                    THAO TÁC
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredRecords.map((record, index) => {
                  const isEditing = editingId === record.id;
                  const displayData = isEditing ? editData : record;

                  return (
                    <tr key={record.id} className={isEditing ? 'bg-blue-50' : 'hover:bg-slate-50'}>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {index + 1}
                      </td>
                      {allColumns.map(column => (
                        <td key={column} className="px-4 py-3 text-sm">
                          {isEditing ? (
                            <input
                              type="text"
                              value={(displayData as any)[column] || ''}
                              onChange={(e) => handleChange(column as keyof DataRecord, e.target.value)}
                              className="w-full px-2 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <span className="text-slate-900">{(record as any)[column]}</span>
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        {record.error && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
                            <XCircle className="w-3 h-3" />
                            {record.error}
                          </span>
                        )}
                        {record.warning && !record.error && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-700">
                            <AlertCircle className="w-3 h-3" />
                            {record.warning}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleSave(record.id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Lưu"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Hủy"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEdit(record)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Sửa"
                          >
                            <SquarePen className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <Database className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Không tìm thấy dữ liệu phù hợp</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Hiển thị {filteredRecords.length} / {records.length} bản ghi
          </p>
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 transition-colors"
            >
              Đóng
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
              Xuất dữ liệu
            </button>
          </div>
        </div>
      </div>

      {/* Column Selection Dialog */}
      {showFilterDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h4 className="text-slate-900">Chọn cột hiển thị</h4>
              <button onClick={() => setShowFilterDialog(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <p className="text-sm text-slate-500 mb-4">Tất cả các cột đang được hiển thị</p>
              <div className="space-y-2">
                {allColumns.map(column => (
                  <div key={column} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-slate-900">{columnDisplayNames[column]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
              <button 
                onClick={() => setShowFilterDialog(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Search Dialog */}
      {showAdvancedSearch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h4 className="text-slate-900">Tìm kiếm theo mệnh đề truy vấn</h4>
              <button onClick={() => setShowAdvancedSearch(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {/* Field Selection */}
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Thuộc tính:</label>
                  <select
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {allColumns.map(col => (
                      <option key={col} value={col}>{columnDisplayNames[col]}</option>
                    ))}
                  </select>
                </div>

                {/* Operators */}
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Toán tử:</label>
                  <div className="grid grid-cols-6 gap-2">
                    {['=', '<>', 'Like', '>', '>=', '<', '<=', '()', '%', 'Is', 'In', 'And', 'Or', 'Not'].map(op => (
                      <button
                        key={op}
                        onClick={() => setSearchOperator(op)}
                        className={`px-3 py-2 border rounded-lg text-sm transition-colors ${
                          searchOperator === op
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {op}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Value Input */}
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Giá trị:</label>
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Nhập giá trị tìm kiếm..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-between">
              <button
                onClick={buildQuery}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 transition-colors"
              >
                Kiểm tra
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSearchField('fullName');
                    setSearchOperator('Like');
                    setSearchValue('');
                    setQueryText('');
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 transition-colors"
                >
                  Xóa
                </button>
                <button 
                  onClick={() => setShowAdvancedSearch(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Field Calculator Dialog */}
      {showFieldCalculator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h4 className="text-slate-900">Tính toán giá trị trường dữ liệu</h4>
              <button onClick={() => setShowFieldCalculator(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {/* Top: Field Name Input with Dropdown */}
              <div className="mb-4">
                <label className="block text-sm text-slate-700 mb-2">Tên trường:</label>
                <div className="relative">
                  <input
                    type="text"
                    value={calcField ? columnDisplayNames[calcField] || calcField : 'Tên biến báo'}
                    readOnly
                    className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg text-sm bg-white"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-[1fr,auto,1fr] gap-6">
                {/* Left: Field List */}
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Các trường dữ liệu</label>
                  <div className="border border-slate-300 rounded-lg overflow-hidden h-80">
                    <div className="overflow-y-auto h-full">
                      {allColumns.map(col => (
                        <button
                          key={col}
                          onClick={() => setCalcField(col)}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-100 transition-colors border-b border-slate-100 last:border-b-0 ${
                            calcField === col ? 'bg-blue-100 text-blue-900' : 'text-slate-700'
                          }`}
                        >
                          {col}
                        </button>
                      ))}
                      <div className="px-3 py-2 text-sm text-slate-700 border-b border-slate-100">
                        {calcField || 'tenDoiTuong'} =
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle: Divider */}
                <div className="w-px bg-slate-200"></div>

                {/* Right: Functions and Operators */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Kiểu hàm tính toán</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="funcType" className="w-4 h-4 text-blue-600" defaultChecked />
                        <span className="text-sm">Number</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="funcType" className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">String</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="funcType" className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">Date</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Hàm tính toán</label>
                    <div className="space-y-1">
                      {['Abs( )', 'Sqrt( )', 'Rand( )', 'Round( )', 'Power( )'].map(func => (
                        <button
                          key={func}
                          onClick={() => setCalcExpression(prev => prev + func)}
                          className="block w-full text-left px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded transition-colors"
                        >
                          {func}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Toán tử:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['*', '/', '&', '+', '-', '='].map(op => (
                        <button
                          key={op}
                          onClick={() => setCalcExpression(prev => prev + ' ' + op + ' ')}
                          className="px-3 py-1.5 border border-slate-300 rounded text-sm hover:bg-slate-50 transition-colors"
                        >
                          {op}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expression Input */}
              <div className="mt-6">
                <textarea
                  value={calcExpression}
                  onChange={(e) => setCalcExpression(e.target.value)}
                  placeholder=""
                  rows={6}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-between">
              <button
                onClick={buildQuery}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 transition-colors"
              >
                Kiểm tra
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setCalcExpression('')}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 transition-colors"
                >
                  Xóa
                </button>
                <button
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 transition-colors"
                >
                  Cập nhật
                </button>
                <button 
                  onClick={() => setShowFieldCalculator(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}