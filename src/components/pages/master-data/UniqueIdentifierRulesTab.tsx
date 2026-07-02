import { useState } from 'react';
import { Plus, Edit, Trash2, X, Save, Hash, Check, RefreshCw, AlertCircle, Copy } from 'lucide-react';

type FormatType = 'numeric' | 'alphanumeric' | 'custom';
type RuleStatus = 'active' | 'inactive';

interface IdentifierRule {
  id: string;
  entityId: string;
  entityName: string;
  prefix: string;
  formatType: FormatType;
  format: string;
  startNumber: number;
  currentNumber: number;
  incrementStep: number;
  separator: string;
  includeDate: boolean;
  dateFormat?: string;
  example: string;
  status: RuleStatus;
  createdDate: string;
  totalGenerated: number;
}

const mockIdentifierRules: IdentifierRule[] = [
  {
    id: 'rule-1',
    entityId: '1',
    entityName: 'Bộ dữ liệu chủ Công dân',
    prefix: 'CTZ',
    formatType: 'numeric',
    format: '{PREFIX}-{DATE}-{NUMBER}',
    startNumber: 1,
    currentNumber: 1542,
    incrementStep: 1,
    separator: '-',
    includeDate: true,
    dateFormat: 'YYYYMMDD',
    example: 'CTZ-20241224-001542',
    status: 'active',
    createdDate: '10/12/2024',
    totalGenerated: 1542
  },
  {
    id: 'rule-2',
    entityId: '2',
    entityName: 'Bộ dữ liệu chủ Tổ chức',
    prefix: 'ORG',
    formatType: 'alphanumeric',
    format: '{PREFIX}{NUMBER}',
    startNumber: 1000,
    currentNumber: 2847,
    incrementStep: 1,
    separator: '',
    includeDate: false,
    example: 'ORG002847',
    status: 'active',
    createdDate: '12/12/2024',
    totalGenerated: 1847
  },
  {
    id: 'rule-3',
    entityId: '3',
    entityName: 'Bộ dữ liệu chủ Văn bản pháp luật',
    prefix: 'DOC',
    formatType: 'custom',
    format: '{PREFIX}/{DATE}/{NUMBER}',
    startNumber: 1,
    currentNumber: 8456,
    incrementStep: 1,
    separator: '/',
    includeDate: true,
    dateFormat: 'YYYY',
    example: 'DOC/2024/008456',
    status: 'active',
    createdDate: '15/12/2024',
    totalGenerated: 8456
  }
];

const mockEntities = [
  { id: '1', code: 'MD-CITIZEN-001', name: 'Bộ dữ liệu chủ Công dân' },
  { id: '2', code: 'MD-ORG-001', name: 'Bộ dữ liệu chủ Tổ chức' },
  { id: '3', code: 'MD-DOC-001', name: 'Bộ dữ liệu chủ Văn bản pháp luật' },
  { id: '4', code: 'MD-AUTH-001', name: 'Bộ dữ liệu chủ Cơ quan ban hành' },
  { id: '5', code: 'MD-ADDR-001', name: 'Bộ dữ liệu chủ Địa chỉ' }
];

const formatTypeLabels: Record<FormatType, string> = {
  numeric: 'Số (0-9)',
  alphanumeric: 'Chữ và số (A-Z, 0-9)',
  custom: 'Tùy chỉnh'
};

export function UniqueIdentifierRulesTab() {
  const [rules, setRules] = useState<IdentifierRule[]>(mockIdentifierRules);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<IdentifierRule | null>(null);
  const [generatedExample, setGeneratedExample] = useState('');
  const [duplicateCheck, setDuplicateCheck] = useState<{ checking: boolean; isDuplicate: boolean; message: string }>({
    checking: false,
    isDuplicate: false,
    message: ''
  });

  const [formData, setFormData] = useState<Partial<IdentifierRule>>({
    entityId: '',
    prefix: '',
    formatType: 'numeric',
    format: '{PREFIX}-{NUMBER}',
    startNumber: 1,
    incrementStep: 1,
    separator: '-',
    includeDate: false,
    dateFormat: 'YYYYMMDD',
    status: 'active'
  });

  const generateExample = (data: Partial<IdentifierRule>) => {
    if (!data.prefix) return '';

    let example = data.format || '{PREFIX}-{NUMBER}';
    const currentDate = new Date();
    
    // Replace PREFIX
    example = example.replace('{PREFIX}', data.prefix);
    
    // Replace DATE if included
    if (data.includeDate && data.dateFormat) {
      const year = currentDate.getFullYear().toString();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      
      let dateStr = data.dateFormat;
      dateStr = dateStr.replace('YYYY', year);
      dateStr = dateStr.replace('MM', month);
      dateStr = dateStr.replace('DD', day);
      
      example = example.replace('{DATE}', dateStr);
    }
    
    // Replace NUMBER
    const numberPart = String(data.startNumber || 1).padStart(6, '0');
    example = example.replace('{NUMBER}', numberPart);
    
    return example;
  };

  const handleFormChange = (updates: Partial<IdentifierRule>) => {
    const newFormData = { ...formData, ...updates };
    setFormData(newFormData);
    
    // Auto-generate example when form changes
    const example = generateExample(newFormData);
    setGeneratedExample(example);
  };

  const handleCheckDuplicate = () => {
    setDuplicateCheck({ checking: true, isDuplicate: false, message: 'Đang kiểm tra...' });
    
    // Simulate API call to check duplicate
    setTimeout(() => {
      const isDuplicate = Math.random() > 0.7; // 30% chance of duplicate for demo
      
      setDuplicateCheck({
        checking: false,
        isDuplicate: isDuplicate,
        message: isDuplicate 
          ? '⚠️ Phát hiện trùng lặp! Mã này đã tồn tại trong hệ thống.'
          : '✅ Không có trùng lặp. Mã này có thể sử dụng.'
      });
    }, 1000);
  };

  const handleSubmit = () => {
    if (!formData.entityId || !formData.prefix) {
      alert('Vui lòng chọn thực thể và nhập prefix');
      return;
    }

    // Check if entity already has a rule
    const existingRule = rules.find(r => r.entityId === formData.entityId && r.id !== editingRule?.id);
    if (existingRule) {
      alert('Thực thể này đã có quy tắc định danh. Vui lòng chỉnh sửa quy tắc hiện có hoặc chọn thực thể khác.');
      return;
    }

    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const selectedEntity = mockEntities.find(e => e.id === formData.entityId);

    if (editingRule) {
      const updatedRules = rules.map(rule =>
        rule.id === editingRule.id
          ? {
              ...rule,
              ...formData,
              entityName: selectedEntity?.name || '',
              example: generatedExample,
              currentNumber: formData.startNumber || 1
            }
          : rule
      );
      setRules(updatedRules);
    } else {
      const newRule: IdentifierRule = {
        id: `rule-${Date.now()}`,
        entityId: formData.entityId!,
        entityName: selectedEntity?.name || '',
        prefix: formData.prefix!,
        formatType: formData.formatType!,
        format: formData.format!,
        startNumber: formData.startNumber!,
        currentNumber: formData.startNumber!,
        incrementStep: formData.incrementStep!,
        separator: formData.separator!,
        includeDate: formData.includeDate!,
        dateFormat: formData.dateFormat,
        example: generatedExample,
        status: formData.status!,
        createdDate: dateStr,
        totalGenerated: 0
      };
      setRules([...rules, newRule]);
    }

    handleCloseForm();
  };

  const handleEdit = (rule: IdentifierRule) => {
    setEditingRule(rule);
    setFormData(rule);
    setGeneratedExample(rule.example);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa quy tắc định danh này? Điều này có thể ảnh hưởng đến dữ liệu đã tạo.')) {
      setRules(rules.filter(rule => rule.id !== id));
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRule(null);
    setFormData({
      entityId: '',
      prefix: '',
      formatType: 'numeric',
      format: '{PREFIX}-{NUMBER}',
      startNumber: 1,
      incrementStep: 1,
      separator: '-',
      includeDate: false,
      dateFormat: 'YYYYMMDD',
      status: 'active'
    });
    setGeneratedExample('');
    setDuplicateCheck({ checking: false, isDuplicate: false, message: '' });
  };

  const getStatusBadge = (status: RuleStatus) => {
    return status === 'active'
      ? { label: 'Hoạt động', className: 'bg-green-100 text-green-700' }
      : { label: 'Không hoạt động', className: 'bg-slate-100 text-slate-700' };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Đã sao chép mã mẫu!');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-slate-900">Thiết lập quy tắc định danh duy nhất</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Thêm quy tắc mới
        </button>
      </div>

      {/* Rules Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Thực thể</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Cấu trúc mã</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Ví dụ</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Số hiện tại</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Đã tạo</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Trạng thái</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rules.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <Hash className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">
                      Nội dung chức năng Quy tắc định danh duy nhất
                    </p>
                  </td>
                </tr>
              ) : (
                rules.map((rule) => {
                  const statusBadge = getStatusBadge(rule.status);
                  return (
                    <tr key={rule.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-[13px] text-slate-900">{rule.entityName}</td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
                            {rule.format}
                          </code>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>Prefix: <strong className="text-blue-600">{rule.prefix}</strong></span>
                            {rule.includeDate && (
                              <span>• Ngày: <strong>{rule.dateFormat}</strong></span>
                            )}
                            <span>• Bước: <strong>{rule.incrementStep}</strong></span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="text-[13px] bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200">
                            {rule.example}
                          </code>
                          <button
                            onClick={() => copyToClipboard(rule.example)}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="Sao chép"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[13px] text-slate-900">
                          {String(rule.currentNumber).padStart(6, '0')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[13px] text-blue-600">
                          {rule.totalGenerated.toLocaleString()} mã
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[12px] ${statusBadge.className}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(rule)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(rule.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
              <h3 className="text-lg text-slate-900">
                {editingRule ? 'Chỉnh sửa quy tắc định danh' : 'Thêm quy tắc định danh mới'}
              </h3>
              <button onClick={handleCloseForm} className="p-1 hover:bg-slate-100 rounded" title="Đóng" aria-label="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Entity Selection */}
              <div className="space-y-4">
                <h4 className="text-sm text-slate-900">Chọn thực thể</h4>
                
                <div>
                  <label className="block text-sm text-slate-700 mb-1">
                    Thực thể dữ liệu chủ <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.entityId}
                    onChange={(e) => handleFormChange({ entityId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!!editingRule}
                  >
                    <option value="">-- Chọn thực thể --</option>
                    {mockEntities.map(entity => {
                      const hasRule = rules.find(r => r.entityId === entity.id && r.id !== editingRule?.id);
                      return (
                        <option key={entity.id} value={entity.id} disabled={!!hasRule}>
                          {entity.code} - {entity.name} {hasRule ? '(Đã có quy tắc)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Identifier Structure */}
              <div className="space-y-4 border-t border-slate-200 pt-6">
                <h4 className="text-sm text-slate-900">Cấu trúc mã định danh</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-1">
                      Prefix (Tiền tố) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.prefix}
                      onChange={(e) => handleFormChange({ prefix: e.target.value.toUpperCase() })}
                      placeholder="VD: CTZ, ORG, DOC"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength={10}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 mb-1">
                      Loại định dạng
                    </label>
                    <select
                      value={formData.formatType}
                      onChange={(e) => handleFormChange({ formatType: e.target.value as FormatType })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.entries(formatTypeLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-1">
                    Mẫu định dạng <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.format}
                    onChange={(e) => handleFormChange({ format: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="{PREFIX}-{NUMBER}">PREFIX-NUMBER (VD: CTZ-000001)</option>
                    <option value="{PREFIX}{NUMBER}">PREFIXNUMBER (VD: CTZ000001)</option>
                    <option value="{PREFIX}-{DATE}-{NUMBER}">PREFIX-DATE-NUMBER (VD: CTZ-20241224-000001)</option>
                    <option value="{PREFIX}/{DATE}/{NUMBER}">PREFIX/DATE/NUMBER (VD: CTZ/20241224/000001)</option>
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    Sử dụng: {'{PREFIX}'} = Tiền tố, {'{DATE}'} = Ngày, {'{NUMBER}'} = Số tự tăng
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="includeDate"
                    checked={formData.includeDate}
                    onChange={(e) => handleFormChange({ includeDate: e.target.checked })}
                    className="w-4 h-4 text-blue-600"
                  />
                  <label htmlFor="includeDate" className="text-sm text-slate-700">
                    Bao gồm ngày tháng trong mã
                  </label>
                </div>

                {formData.includeDate && (
                  <div>
                    <label className="block text-sm text-slate-700 mb-1">
                      Định dạng ngày
                    </label>
                    <select
                      value={formData.dateFormat}
                      onChange={(e) => handleFormChange({ dateFormat: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="YYYYMMDD">YYYYMMDD (20241224)</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-24)</option>
                      <option value="YYYYMM">YYYYMM (202412)</option>
                      <option value="YYYY">YYYY (2024)</option>
                      <option value="MMDD">MMDD (1224)</option>
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-1">
                      Số bắt đầu <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.startNumber}
                      onChange={(e) => handleFormChange({ startNumber: parseInt(e.target.value) || 1 })}
                      min="1"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 mb-1">
                      Bước tăng
                    </label>
                    <input
                      type="number"
                      value={formData.incrementStep}
                      onChange={(e) => handleFormChange({ incrementStep: parseInt(e.target.value) || 1 })}
                      min="1"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Example Preview */}
              <div className="space-y-3 border-t border-slate-200 pt-6">
                <h4 className="text-sm text-slate-900">Mẫu mã tạo ra</h4>
                
                <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-700">Ví dụ mã định danh:</span>
                    <button
                      onClick={() => handleFormChange({ ...formData })}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Làm mới
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <code className="flex-1 text-xl bg-white px-4 py-3 rounded border border-blue-300 text-blue-700">
                      {generatedExample || 'Vui lòng điền đầy đủ thông tin'}
                    </code>
                    {generatedExample && (
                      <button
                        onClick={() => copyToClipboard(generatedExample)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                        title="Sao chép"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Duplicate Check */}
                {generatedExample && (
                  <div>
                    <button
                      onClick={handleCheckDuplicate}
                      disabled={duplicateCheck.checking}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {duplicateCheck.checking ? 'Đang kiểm tra...' : 'Kiểm tra trùng lặp'}
                    </button>

                    {duplicateCheck.message && (
                      <div className={`mt-2 p-3 rounded-lg ${
                        duplicateCheck.isDuplicate 
                          ? 'bg-red-50 border border-red-200 text-red-700' 
                          : 'bg-green-50 border border-green-200 text-green-700'
                      }`}>
                        <p className="text-sm">{duplicateCheck.message}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50 sticky bottom-0">
              <button
                onClick={handleCloseForm}
                className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                {editingRule ? 'Cập nhật' : 'Lưu quy tắc'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
