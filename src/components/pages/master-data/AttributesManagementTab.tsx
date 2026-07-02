import { useState, useRef, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Search, History as HistoryIcon, Check, AlertCircle, ChevronDown } from 'lucide-react';

type FieldDataType = 'string' | 'number' | 'date' | 'datetime' | 'boolean' | 'text' | 'email' | 'phone' | 'url';

interface MasterDataEntity {
  id: string;
  code: string;
  name: string;
}

interface MasterDataAttribute {
  id: string;
  fieldName: string;
  displayName: string;
  dataType: FieldDataType;
  length?: number;
  required: boolean;
  unique: boolean;
  indexed: boolean;
  defaultValue?: string;
  description?: string;
  validationRules?: string;
  createdDate: string;
  version: number;
}

interface VersionHistory {
  version: number;
  changes: string;
  updatedBy: string;
  updatedDate: string;
}

const mockEntities: MasterDataEntity[] = [
  { id: '1', code: 'MD-CITIZEN-001', name: 'Bộ dữ liệu chủ Công dân' },
  { id: '2', code: 'MD-ORG-001', name: 'Bộ dữ liệu chủ Tổ chức' },
  { id: '3', code: 'MD-DOC-001', name: 'Bộ dữ liệu chủ Văn bản pháp luật' },
  { id: '4', code: 'MD-ADMIN-001', name: 'Bộ dữ liệu chủ Đơn vị hành chính' },
  { id: '5', code: 'MD-AGENCY-001', name: 'Bộ dữ liệu chủ Cơ quan nhà nước' },
];

const defaultAttributes: Record<string, MasterDataAttribute[]> = {
  '1': [
    {
      id: 'attr-1',
      fieldName: 'citizen_id',
      displayName: 'Số CCCD',
      dataType: 'string',
      length: 12,
      required: true,
      unique: true,
      indexed: true,
      description: 'Số căn cước công dân 12 chữ số',
      validationRules: 'Regex: ^[0-9]{12}$',
      createdDate: '10/12/2024',
      version: 1
    },
    {
      id: 'attr-2',
      fieldName: 'full_name',
      displayName: 'Họ và tên',
      dataType: 'string',
      length: 255,
      required: true,
      unique: false,
      indexed: true,
      description: 'Họ và tên đầy đủ của công dân',
      createdDate: '10/12/2024',
      version: 1
    },
    {
      id: 'attr-3',
      fieldName: 'date_of_birth',
      displayName: 'Ngày sinh',
      dataType: 'date',
      required: true,
      unique: false,
      indexed: false,
      description: 'Ngày tháng năm sinh',
      createdDate: '10/12/2024',
      version: 1
    },
    {
      id: 'attr-4',
      fieldName: 'gender',
      displayName: 'Giới tính',
      dataType: 'string',
      length: 10,
      required: false,
      unique: false,
      indexed: false,
      defaultValue: 'Nam',
      description: 'Giới tính: Nam/Nữ',
      createdDate: '10/12/2024',
      version: 1
    },
    {
      id: 'attr-5',
      fieldName: 'address',
      displayName: 'Địa chỉ thường trú',
      dataType: 'text',
      required: false,
      unique: false,
      indexed: false,
      description: 'Địa chỉ nơi thường trú',
      createdDate: '10/12/2024',
      version: 1
    },
    {
      id: 'attr-6',
      fieldName: 'email',
      displayName: 'Email',
      dataType: 'email',
      length: 255,
      required: false,
      unique: false,
      indexed: true,
      description: 'Địa chỉ email liên lạc',
      validationRules: 'Email format validation',
      createdDate: '10/12/2024',
      version: 1
    },
    {
      id: 'attr-7',
      fieldName: 'phone_number',
      displayName: 'Số điện thoại',
      dataType: 'phone',
      length: 15,
      required: false,
      unique: false,
      indexed: true,
      description: 'Số điện thoại liên lạc',
      validationRules: 'Regex: ^[0-9]{10,11}$',
      createdDate: '10/12/2024',
      version: 1
    },
  ]
};

const fieldDataTypeLabels: Record<FieldDataType, string> = {
  string: 'Chuỗi (String)',
  number: 'Số (Number)',
  date: 'Ngày (Date)',
  datetime: 'Ngày giờ (DateTime)',
  boolean: 'Luận lý (Boolean)',
  text: 'Văn bản dài (Text)',
  email: 'Email',
  phone: 'Số điện thoại',
  url: 'URL'
};

export function AttributesManagementTab() {
  const [selectedEntity, setSelectedEntity] = useState<string>('1');
  const [attributes, setAttributes] = useState<Record<string, MasterDataAttribute[]>>(defaultAttributes);
  const [showForm, setShowForm] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<MasterDataAttribute | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [selectedAttributeHistory, setSelectedAttributeHistory] = useState<string | null>(null);
  
  // Combobox states
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [comboboxSearch, setComboboxSearch] = useState('');
  const comboboxRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<Partial<MasterDataAttribute>>({
    fieldName: '',
    displayName: '',
    dataType: 'string',
    required: false,
    unique: false,
    indexed: false
  });

  const currentEntityAttributes = attributes[selectedEntity] || [];
  const filteredAttributes = currentEntityAttributes.filter(attr =>
    attr.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attr.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedEntityData = mockEntities.find(e => e.id === selectedEntity);

  const mockVersionHistory: VersionHistory[] = [
    { version: 3, changes: 'Thêm validation rules cho email', updatedBy: 'Nguyễn Văn A', updatedDate: '20/12/2024 14:30' },
    { version: 2, changes: 'Thay đổi độ dài từ 100 sang 255', updatedBy: 'Trần Thị B', updatedDate: '15/12/2024 10:15' },
    { version: 1, changes: 'Tạo mới thuộc tính', updatedBy: 'Lê Văn C', updatedDate: '10/12/2024 08:00' },
  ];

  const handleSubmit = () => {
    if (!formData.fieldName || !formData.displayName) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc (Tên trường, Tên hiển thị)');
      return;
    }

    // Validate field name format
    if (!/^[a-z][a-z0-9_]*$/.test(formData.fieldName)) {
      alert('Tên trường phải bắt đầu bằng chữ thường và chỉ chứa chữ thường, số và dấu gạch dưới');
      return;
    }

    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

    const currentAttributes = attributes[selectedEntity] || [];

    if (editingAttribute) {
      // Update existing - increment version
      const updatedAttributes = currentAttributes.map(attr =>
        attr.id === editingAttribute.id
          ? {
              ...attr,
              ...formData as MasterDataAttribute,
              version: attr.version + 1
            }
          : attr
      );
      setAttributes({ ...attributes, [selectedEntity]: updatedAttributes });
    } else {
      // Check if field name already exists
      if (currentAttributes.some(attr => attr.fieldName === formData.fieldName)) {
        alert('Tên trường đã tồn tại. Vui lòng sử dụng tên khác.');
        return;
      }

      // Create new
      const newAttribute: MasterDataAttribute = {
        id: `attr-${Date.now()}`,
        fieldName: formData.fieldName!,
        displayName: formData.displayName!,
        dataType: formData.dataType!,
        length: formData.length,
        required: formData.required!,
        unique: formData.unique!,
        indexed: formData.indexed!,
        defaultValue: formData.defaultValue,
        description: formData.description,
        validationRules: formData.validationRules,
        createdDate: dateStr,
        version: 1
      };

      setAttributes({
        ...attributes,
        [selectedEntity]: [...currentAttributes, newAttribute]
      });
    }

    handleCloseForm();
  };

  const handleEdit = (attribute: MasterDataAttribute) => {
    setEditingAttribute(attribute);
    setFormData(attribute);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa thuộc tính này? Thao tác này sẽ tạo phiên bản mới của cấu trúc dữ liệu.')) {
      const currentAttributes = attributes[selectedEntity] || [];
      setAttributes({
        ...attributes,
        [selectedEntity]: currentAttributes.filter(attr => attr.id !== id)
      });
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAttribute(null);
    setFormData({
      fieldName: '',
      displayName: '',
      dataType: 'string',
      required: false,
      unique: false,
      indexed: false
    });
  };

  const handleViewHistory = (attributeId: string) => {
    setSelectedAttributeHistory(attributeId);
    setShowVersionHistory(true);
  };

  // Close combobox when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setComboboxOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter entities based on search
  const filteredEntities = mockEntities.filter(entity =>
    entity.name.toLowerCase().includes(comboboxSearch.toLowerCase()) ||
    entity.code.toLowerCase().includes(comboboxSearch.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-slate-900">Quản lý thuộc tính dữ liệu chủ</h2>
      </div>

      {/* Entity Selection */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <label className="block text-sm text-slate-700 mb-2">
          Chọn thực thể dữ liệu chủ <span className="text-red-600">*</span>
        </label>
        <div ref={comboboxRef} className="relative">
          <button
            type="button"
            className="w-full px-4 py-2 border border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
            onClick={() => setComboboxOpen(!comboboxOpen)}
          >
            <div className="flex items-center justify-between">
              <div>
                {selectedEntityData ? (
                  <div>
                    <span className="text-sm text-slate-900">{selectedEntityData.code}</span>
                    <span className="text-sm text-slate-600"> - {selectedEntityData.name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-slate-500">Chọn thực thể dữ liệu chủ...</span>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${comboboxOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>
          {comboboxOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-slate-300 rounded-lg shadow-lg max-h-64 overflow-hidden flex flex-col">
              <div className="p-2 border-b border-slate-200">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={comboboxSearch}
                    onChange={(e) => setComboboxSearch(e.target.value)}
                    placeholder="Tìm kiếm theo mã hoặc tên..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    autoFocus
                  />
                </div>
              </div>
              <ul className="overflow-y-auto max-h-52">
                {filteredEntities.length === 0 ? (
                  <li className="px-4 py-8 text-center text-sm text-slate-500">
                    Không tìm thấy thực thể phù hợp
                  </li>
                ) : (
                  filteredEntities.map(entity => (
                    <li key={entity.id}>
                      <button
                        type="button"
                        className={`w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors ${
                          selectedEntity === entity.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => {
                          setSelectedEntity(entity.id);
                          setComboboxOpen(false);
                          setComboboxSearch('');
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm text-slate-900">{entity.code}</span>
                            <span className="text-sm text-slate-600"> - {entity.name}</span>
                          </div>
                          {selectedEntity === entity.id && (
                            <Check className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Selected Entity Info */}
      {selectedEntityData && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Đang quản lý thuộc tính của:</p>
              <p className="text-slate-900 mt-1">{selectedEntityData.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Tổng số thuộc tính:</p>
              <p className="text-2xl text-blue-600 mt-1">{currentEntityAttributes.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Attribute Button */}
      {selectedEntityData && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Thêm thuộc tính
          </button>
        </div>
      )}

      {/* Attributes Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Tên trường</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Tên hiển thị</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Kiểu dữ liệu</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Độ dài</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Ràng buộc</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Phiên bản</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttributes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-[13px] text-slate-500">
                    {searchTerm ? 'Không tìm thấy thuộc tính phù hợp' : 'Chưa có thuộc tính nào. Nhấn "Thêm thuộc tính" để bắt đầu.'}
                  </td>
                </tr>
              ) : (
                filteredAttributes.map((attribute) => (
                  <tr key={attribute.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <code className="text-[13px] bg-slate-100 px-2 py-1 rounded text-slate-800">{attribute.fieldName}</code>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-slate-900">{attribute.displayName}</td>
                    <td className="px-6 py-4 text-[13px] text-slate-600">{fieldDataTypeLabels[attribute.dataType]}</td>
                    <td className="px-6 py-4 text-[13px] text-slate-600">{attribute.length || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {attribute.required && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] bg-red-100 text-red-700">Bắt buộc</span>
                        )}
                        {attribute.unique && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] bg-purple-100 text-purple-700">Duy nhất</span>
                        )}
                        {attribute.indexed && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] bg-blue-100 text-blue-700">Index</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewHistory(attribute.id)}
                        className="flex items-center gap-1 text-[13px] text-blue-600 hover:text-blue-800"
                      >
                        <HistoryIcon className="w-3 h-3" />
                        v{attribute.version}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(attribute)} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Chỉnh sửa">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(attribute.id)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Xóa">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg text-slate-900">
                {editingAttribute ? 'Chỉnh sửa thuộc tính' : 'Thêm thuộc tính mới'}
              </h3>
              <button onClick={handleCloseForm} className="p-1 hover:bg-slate-100 rounded" title="Đóng" aria-label="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Field Name */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">
                  Tên trường <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fieldName}
                  onChange={(e) => setFormData({ ...formData, fieldName: e.target.value.toLowerCase() })}
                  placeholder="VD: citizen_id, full_name, date_of_birth"
                  disabled={!!editingAttribute}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Chỉ sử dụng chữ thường, số và dấu gạch dưới. Bắt đầu bằng chữ cái.
                </p>
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">
                  Tên hiển thị <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="VD: Số CCCD, Họ và tên, Ngày sinh"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Data Type */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">
                  Kiểu dữ liệu <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.dataType}
                  onChange={(e) => setFormData({ ...formData, dataType: e.target.value as FieldDataType })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(fieldDataTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Length */}
              {(['string', 'email', 'phone', 'url'] as FieldDataType[]).includes(formData.dataType!) && (
                <div>
                  <label className="block text-sm text-slate-700 mb-1">
                    Độ dài tối đa
                  </label>
                  <input
                    type="number"
                    value={formData.length || ''}
                    onChange={(e) => setFormData({ ...formData, length: parseInt(e.target.value) || undefined })}
                    placeholder="VD: 255"
                    min="1"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Constraints */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
                <h4 className="text-sm text-slate-900">Ràng buộc</h4>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.required}
                    onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-slate-700">Bắt buộc (Required) - Trường này không được để trống</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.unique}
                    onChange={(e) => setFormData({ ...formData, unique: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-slate-700">Duy nhất (Unique) - Giá trị không được trùng lặp</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.indexed}
                    onChange={(e) => setFormData({ ...formData, indexed: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-slate-700">Đánh chỉ mục (Indexed) - Tối ưu hóa tìm kiếm</span>
                </label>
              </div>

              {/* Default Value */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">
                  Giá trị mặc định
                </label>
                <input
                  type="text"
                  value={formData.defaultValue || ''}
                  onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
                  placeholder="VD: Nam, 0, true"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">Mô tả</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả chi tiết về thuộc tính này"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Validation Rules */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">
                  Quy tắc kiểm tra
                </label>
                <textarea
                  value={formData.validationRules || ''}
                  onChange={(e) => setFormData({ ...formData, validationRules: e.target.value })}
                  placeholder="VD: Regex: ^[0-9]{12}$, Min: 0, Max: 100"
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Version Warning */}
              {editingAttribute && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="mb-1">Khi chỉnh sửa thuộc tính, phiên bản sẽ tự động tăng từ <strong>v{editingAttribute.version}</strong> lên <strong>v{editingAttribute.version + 1}</strong>.</p>
                    <p>Thay đổi này sẽ được ghi nhận trong lịch sử phiên bản.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
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
                <Check className="w-4 h-4" />
                {editingAttribute ? 'Cập nhật' : 'Tạo mới'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {showVersionHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg text-slate-900">Lịch sử phiên bản</h3>
              <button onClick={() => setShowVersionHistory(false)} className="p-1 hover:bg-slate-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {mockVersionHistory.map((history) => (
                  <div key={history.version} className="flex gap-4 pb-4 border-b border-slate-200 last:border-0">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600">v{history.version}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-900">{history.changes}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span>Người cập nhật: {history.updatedBy}</span>
                        <span>Ngày: {history.updatedDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end p-6 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setShowVersionHistory(false)}
                className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}