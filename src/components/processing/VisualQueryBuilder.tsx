import { useState } from 'react';
import { X, Plus, Trash2, Play, Check, Search } from 'lucide-react';

interface QueryCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
  logicalOperator?: 'AND' | 'OR';
}

interface DataSource {
  name: string;
  fields: string[];
  tableName: string;
}

const mockDataSources: DataSource[] = [
  {
    name: 'Biên bản xử phạt',
    tableName: 'dbbinhduong_bienbao',
    fields: [
      'loaiBienBao',
      'noiDungBienBao',
      'phat_Trai',
      'thoiGianLap',
      'phanTheoDoi',
      'tenDoiTuong',
      'cmnd',
      'diaChi',
      'ngayViPham',
      'diaChiViPham',
      'loiViPham',
      'mucPhat',
      'trangThai',
    ],
  },
  {
    name: 'Đăng ký doanh nghiệp',
    tableName: 'dangky_doanhnghiep',
    fields: [
      'maSoThue',
      'tenDoanhnghiep',
      'nguoiDaiDien',
      'diaChiTruSo',
      'vonDieuLe',
      'ngayCapPhep',
      'nganhNghe',
      'trangThai',
    ],
  },
  {
    name: 'Hộ tịch',
    tableName: 'ho_tich',
    fields: [
      'hoVaTen',
      'ngaySinh',
      'gioiTinh',
      'danToc',
      'quocTich',
      'cmnd',
      'noiSinh',
      'queQuan',
      'diaChiThuongTru',
      'hoKhau',
    ],
  },
];

const operators = [
  { symbol: '=', label: 'Bằng', type: 'comparison' },
  { symbol: '<>', label: 'Khác', type: 'comparison' },
  { symbol: '>', label: 'Lớn hơn', type: 'comparison' },
  { symbol: '<', label: 'Nhỏ hơn', type: 'comparison' },
  { symbol: '>=', label: 'Lớn hơn hoặc bằng', type: 'comparison' },
  { symbol: '<=', label: 'Nhỏ hơn hoặc bằng', type: 'comparison' },
  { symbol: 'Like', label: 'Chứa', type: 'string' },
  { symbol: 'In', label: 'Trong danh sách', type: 'list' },
  { symbol: 'Is', label: 'Là', type: 'null' },
];

const logicalOperators = [
  { symbol: 'And', label: 'Và' },
  { symbol: 'Or', label: 'Hoặc' },
  { symbol: 'Not', label: 'Không' },
];

const specialSymbols = [
  { symbol: '(', label: 'Mở ngoặc' },
  { symbol: ')', label: 'Đóng ngoặc' },
  { symbol: '%', label: 'Ký tự đại diện' },
  { symbol: '-', label: 'Trừ' },
];

export function VisualQueryBuilder() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<DataSource>(mockDataSources[0]);
  const [conditions, setConditions] = useState<QueryCondition[]>([]);
  const [currentCondition, setCurrentCondition] = useState<Partial<QueryCondition>>({
    field: '',
    operator: '=',
    value: '',
  });
  const [fieldFilter, setFieldFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'value' | 'filter' | 'condition'>('value');
  const [sqlQuery, setSqlQuery] = useState('');
  const [validationResult, setValidationResult] = useState<{ valid: boolean; message: string } | null>(null);

  const filteredFields = selectedSource.fields.filter(field =>
    field.toLowerCase().includes(fieldFilter.toLowerCase())
  );

  const addCondition = () => {
    if (currentCondition.field && currentCondition.operator && currentCondition.value) {
      const newCondition: QueryCondition = {
        id: Date.now().toString(),
        field: currentCondition.field,
        operator: currentCondition.operator,
        value: currentCondition.value,
        logicalOperator: conditions.length > 0 ? 'AND' : undefined,
      };
      setConditions([...conditions, newCondition]);
      setCurrentCondition({ field: '', operator: '=', value: '' });
      buildSQLQuery([...conditions, newCondition]);
    }
  };

  const removeCondition = (id: string) => {
    const updated = conditions.filter(c => c.id !== id);
    setConditions(updated);
    buildSQLQuery(updated);
  };

  const buildSQLQuery = (conditionsList: QueryCondition[]) => {
    let query = `SELECT * FROM ${selectedSource.tableName}`;
    
    if (conditionsList.length > 0) {
      query += ' WHERE ';
      const whereClauses = conditionsList.map((cond, index) => {
        let clause = '';
        if (index > 0 && cond.logicalOperator) {
          clause += `${cond.logicalOperator} `;
        }
        
        if (cond.operator === 'Like') {
          clause += `${cond.field} LIKE '%${cond.value}%'`;
        } else if (cond.operator === 'In') {
          clause += `${cond.field} IN (${cond.value})`;
        } else if (cond.operator === 'Is') {
          clause += `${cond.field} IS ${cond.value}`;
        } else {
          clause += `${cond.field} ${cond.operator} '${cond.value}'`;
        }
        
        return clause;
      });
      query += whereClauses.join(' ');
    }
    
    setSqlQuery(query);
  };

  const validateQuery = () => {
    if (conditions.length === 0) {
      setValidationResult({
        valid: false,
        message: 'Chưa có điều kiện nào được thêm vào truy vấn',
      });
      return;
    }

    // Simple validation
    const hasEmptyValues = conditions.some(c => !c.value);
    if (hasEmptyValues) {
      setValidationResult({
        valid: false,
        message: 'Có điều kiện chứa giá trị rỗng',
      });
      return;
    }

    setValidationResult({
      valid: true,
      message: 'Truy vấn hợp lệ và có thể thực thi',
    });
  };

  const executeQuery = () => {
    if (conditions.length === 0) {
      alert('⚠️ Vui lòng thêm ít nhất một điều kiện trước khi thực thi');
      return;
    }
    
    alert(`✅ Đang thực thi truy vấn:\n\n${sqlQuery}\n\nKết quả sẽ được hiển thị trong bảng dữ liệu`);
    setIsOpen(false);
  };

  const clearAll = () => {
    setConditions([]);
    setCurrentCondition({ field: '', operator: '=', value: '' });
    setSqlQuery('');
    setValidationResult(null);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Search className="w-5 h-5" />
        Tìm kiếm theo mệnh đề truy vấn
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center justify-between">
                <h3 className="text-slate-900">Tìm kiếm theo mệnh đề truy vấn</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Data Source Selection */}
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Nguồn dữ liệu:</label>
                  <select
                    value={selectedSource.name}
                    onChange={(e) => {
                      const source = mockDataSources.find(s => s.name === e.target.value);
                      if (source) {
                        setSelectedSource(source);
                        clearAll();
                      }
                    }}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {mockDataSources.map(source => (
                      <option key={source.name} value={source.name}>{source.name}</option>
                    ))}
                  </select>
                </div>

                {/* Field Selection with Filter */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm text-slate-700">Thuộc tính:</label>
                      <input
                        type="text"
                        placeholder="Lọc tên thuộc tính"
                        value={fieldFilter}
                        onChange={(e) => setFieldFilter(e.target.value)}
                        className="text-xs px-2 py-1 border border-slate-200 rounded"
                      />
                    </div>
                    <select
                      value={currentCondition.field || ''}
                      onChange={(e) => setCurrentCondition({ ...currentCondition, field: e.target.value })}
                      size={8}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {filteredFields.map(field => (
                        <option key={field} value={field}>{field}</option>
                      ))}
                    </select>
                  </div>

                  {/* Operators */}
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Toán tử:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {/* Comparison Operators */}
                      {operators.map(op => (
                        <button
                          key={op.symbol}
                          onClick={() => setCurrentCondition({ ...currentCondition, operator: op.symbol })}
                          className={`px-3 py-2 border rounded-lg text-sm transition-colors ${
                            currentCondition.operator === op.symbol
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {op.symbol}
                        </button>
                      ))}
                      
                      {/* Logical Operators */}
                      {logicalOperators.map(op => (
                        <button
                          key={op.symbol}
                          onClick={() => {
                            if (conditions.length > 0) {
                              const lastCondition = conditions[conditions.length - 1];
                              setConditions(conditions.map(c => 
                                c.id === lastCondition.id 
                                  ? { ...c, logicalOperator: op.symbol as 'AND' | 'OR' }
                                  : c
                              ));
                            }
                          }}
                          className="px-3 py-2 border border-slate-200 rounded-lg bg-green-50 hover:bg-green-100 text-sm transition-colors"
                        >
                          {op.symbol}
                        </button>
                      ))}
                      
                      {/* Special Symbols */}
                      {specialSymbols.map(sym => (
                        <button
                          key={sym.symbol}
                          className="px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 text-sm transition-colors"
                        >
                          {sym.symbol}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Value Input Tabs */}
                <div>
                  <div className="flex gap-2 mb-3 border-b border-slate-200">
                    <button
                      onClick={() => setActiveTab('value')}
                      className={`px-4 py-2 text-sm transition-colors ${
                        activeTab === 'value'
                          ? 'border-b-2 border-blue-600 text-blue-600'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Lấy giá trị
                    </button>
                    <button
                      onClick={() => setActiveTab('filter')}
                      className={`px-4 py-2 text-sm transition-colors ${
                        activeTab === 'filter'
                          ? 'border-b-2 border-blue-600 text-blue-600'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Lọc
                    </button>
                    <button
                      onClick={() => setActiveTab('condition')}
                      className={`px-4 py-2 text-sm transition-colors ${
                        activeTab === 'condition'
                          ? 'border-b-2 border-blue-600 text-blue-600'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Điều kiện lọc
                    </button>
                  </div>

                  {activeTab === 'value' && (
                    <div>
                      <input
                        type="text"
                        placeholder="Nhập giá trị..."
                        value={currentCondition.value || ''}
                        onChange={(e) => setCurrentCondition({ ...currentCondition, value: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={addCondition}
                        className="mt-2 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Thêm điều kiện
                      </button>
                    </div>
                  )}

                  {activeTab === 'filter' && (
                    <div>
                      <select defaultValue="" className="w-full px-4 py-2 border border-slate-200 rounded-lg">
                        <option value="" disabled hidden>-- Chọn giá trị từ danh sách --</option>
                      </select>
                    </div>
                  )}

                  {activeTab === 'condition' && (
                    <div>
                      <select
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                        value={currentCondition.value || ''}
                        onChange={(e) => setCurrentCondition({ ...currentCondition, value: e.target.value })}
                      >
                        <option value="" disabled hidden>-- Chọn trường để so sánh --</option>
                        {selectedSource.fields.map(field => (
                          <option key={field} value={field}>{field}</option>
                        ))}
                      </select>
                      <button
                        onClick={addCondition}
                        className="mt-2 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Thêm điều kiện
                      </button>
                    </div>
                  )}
                </div>

                {/* SQL Query Display */}
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Câu truy vấn SQL:</label>
                  <div className="p-4 bg-slate-900 text-green-400 rounded-lg font-mono text-sm">
                    {sqlQuery || `SELECT * FROM ${selectedSource.tableName} WHERE:`}
                  </div>
                </div>

                {/* Conditions List */}
                {conditions.length > 0 && (
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Các điều kiện đã thêm:</label>
                    <div className="space-y-2">
                      {conditions.map((condition, index) => (
                        <div key={condition.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          {index > 0 && condition.logicalOperator && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                              {condition.logicalOperator}
                            </span>
                          )}
                          <span className="text-sm text-slate-900 font-mono">
                            {condition.field} {condition.operator} {condition.value}
                          </span>
                          <button
                            onClick={() => removeCondition(condition.id)}
                            className="ml-auto p-1 hover:bg-red-100 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Validation Result */}
                {validationResult && (
                  <div
                    className={`p-4 rounded-lg ${
                      validationResult.valid
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <p
                      className={`text-sm ${
                        validationResult.valid ? 'text-green-800' : 'text-red-800'
                      }`}
                    >
                      {validationResult.message}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <button
                    onClick={validateQuery}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Kiểm tra
                  </button>
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa
                  </button>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={executeQuery}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Thực thi
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
