import { useState } from 'react';
import { X, Check, ChevronRight, ChevronLeft, AlertCircle, Plus, Trash2 } from 'lucide-react';

type LifecycleStatus = 'active' | 'draft' | 'inactive' | 'archived';
type DataType = 'standard' | 'reference' | 'transactional';
type ScopeType = 'national' | 'ministry' | 'provincial' | 'internal';
type DataSourceType = 'dldc' | 'lgsp' | 'ndxp' | 'manual';
type UpdateStrategyType = 'reference' | 'scheduled' | 'realtime';
type SyncFrequencyType = 'daily' | 'weekly' | 'monthly' | 'event';
type FieldDataType = 'string' | 'number' | 'date' | 'datetime' | 'boolean' | 'text' | 'email' | 'phone' | 'url';

interface AttributeForm {
  fieldName: string;
  displayName: string;
  dataType: FieldDataType;
  length?: number;
  required: boolean;
  unique: boolean;
  indexed: boolean;
}

interface WizardData {
  // Step 1
  name: string;
  dataType: DataType;
  managingAgency: string;
  scope: ScopeType;
  description: string;
  lifecycleStatus: LifecycleStatus;
  dataSource?: DataSourceType;
  dldcTable?: string;
  dldcColumns?: string[];
  apiSystem?: string;
  apiManagingUnit?: string;
  apiEndpoint?: string;
  apiMethod?: 'GET' | 'POST' | 'PUT';
  updateStrategy?: UpdateStrategyType;
  syncFrequency?: SyncFrequencyType;

  // Step 2
  attributes: AttributeForm[];

  // Step 3
  mergeRules: string[];

  // Step 4
  relationships: string[];

  // Step 5
  approvalNotes: string;
}

interface MasterDataWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WizardData) => void;
}

const steps = [
  { number: 1, title: 'Khởi tạo dữ liệu chủ', description: 'Thông tin cơ bản và nguồn dữ liệu' },
  { number: 2, title: 'Tạo thuộc tính', description: 'Định nghĩa các trường dữ liệu' },
  { number: 3, title: 'Quy tắc hợp nhất', description: 'Thiết lập quy tắc merge dữ liệu' },
  { number: 4, title: 'Thiết lập quan hệ', description: 'Liên kết giữa các thực thể' },
  { number: 5, title: 'Phê duyệt', description: 'Xem lại và gửi phê duyệt' }
];

export function MasterDataWizard({ isOpen, onClose, onSubmit }: MasterDataWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({
    name: '',
    dataType: 'standard',
    managingAgency: '',
    scope: 'national',
    description: '',
    lifecycleStatus: 'draft',
    dataSource: 'dldc',
    attributes: [],
    mergeRules: [],
    relationships: [],
    approvalNotes: ''
  });

  const [currentAttribute, setCurrentAttribute] = useState<AttributeForm>({
    fieldName: '',
    displayName: '',
    dataType: 'string',
    required: false,
    unique: false,
    indexed: false
  });

  if (!isOpen) return null;

  const handleNext = () => {
    // Validation for each step
    if (currentStep === 1) {
      if (!wizardData.name || !wizardData.managingAgency) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc ở bước 1');
        return;
      }
    }
    if (currentStep === 2) {
      if (wizardData.attributes.length === 0) {
        alert('Vui lòng thêm ít nhất 1 thuộc tính');
        return;
      }
    }

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitWizard = () => {
    if (!wizardData.approvalNotes) {
      alert('Vui lòng nhập ghi chú phê duyệt');
      return;
    }
    onSubmit(wizardData);
    onClose();
  };

  const handleAddAttribute = () => {
    if (!currentAttribute.fieldName || !currentAttribute.displayName) {
      alert('Vui lòng điền tên trường và tên hiển thị');
      return;
    }

    // Check duplicate
    if (wizardData.attributes.some(a => a.fieldName === currentAttribute.fieldName)) {
      alert('Tên trường đã tồn tại');
      return;
    }

    setWizardData({
      ...wizardData,
      attributes: [...wizardData.attributes, currentAttribute]
    });

    // Reset form
    setCurrentAttribute({
      fieldName: '',
      displayName: '',
      dataType: 'string',
      required: false,
      unique: false,
      indexed: false
    });
  };

  const handleDeleteAttribute = (index: number) => {
    setWizardData({
      ...wizardData,
      attributes: wizardData.attributes.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl text-slate-900">Tạo mới dữ liệu chủ</h2>
            <p className="text-sm text-slate-600 mt-1">Quy trình 5 bước</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded" title="Đóng" aria-label="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-colors ${currentStep > step.number
                      ? 'bg-green-600 text-white'
                      : currentStep === step.number
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                      }`}
                  >
                    {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
                  </div>
                  <p
                    className={`text-xs mt-2 text-center ${currentStep === step.number ? 'text-blue-600' : 'text-slate-600'
                      }`}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-slate-200 mx-2 mt-[-30px]" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Khởi tạo dữ liệu chủ */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="text-sm text-blue-900 mb-1">Bước 1: Khởi tạo dữ liệu chủ</h3>
                <p className="text-xs text-blue-700">
                  Nhập thông tin cơ bản và cấu hình nguồn dữ liệu cho thực thể dữ liệu chủ
                </p>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1">
                  Tên dữ liệu chủ <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={wizardData.name}
                  onChange={(e) => setWizardData({ ...wizardData, name: e.target.value })}
                  placeholder="VD: Bộ dữ liệu chủ Công dân"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-1">
                    Loại dữ liệu <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={wizardData.dataType}
                    onChange={(e) => setWizardData({ ...wizardData, dataType: e.target.value as DataType })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="standard">Dữ liệu chuẩn</option>
                    <option value="reference">Dữ liệu tham chiếu</option>
                    <option value="transactional">Dữ liệu giao dịch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-1">
                    Phạm vi sử dụng <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={wizardData.scope}
                    onChange={(e) => setWizardData({ ...wizardData, scope: e.target.value as ScopeType })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="national">Cấp quốc gia</option>
                    <option value="ministry">Cấp bộ</option>
                    <option value="provincial">Cấp tỉnh/thành</option>
                    <option value="internal">Nội bộ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1">
                  Cơ quan quản lý <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={wizardData.managingAgency}
                  onChange={(e) => setWizardData({ ...wizardData, managingAgency: e.target.value })}
                  placeholder="VD: Cục Hộ tịch - Quốc tịch - Chứng thực"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1">Mô tả</label>
                <textarea
                  value={wizardData.description}
                  onChange={(e) => setWizardData({ ...wizardData, description: e.target.value })}
                  placeholder="Mô tả chi tiết về dữ liệu chủ này"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-sm text-slate-900 mb-3">Cấu hình nguồn dữ liệu</h4>

                <div className="mb-3">
                  <label className="block text-sm text-slate-700 mb-1">
                    Nguồn dữ liệu <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={wizardData.dataSource}
                    onChange={(e) => setWizardData({ ...wizardData, dataSource: e.target.value as DataSourceType })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="dldc">Từ Kho DLDC</option>
                    <option value="lgsp">API qua trục LGSP</option>
                    <option value="ndxp">API qua trục NDXP</option>
                    <option value="manual">Nhập thủ công</option>
                  </select>
                </div>

                {wizardData.dataSource === 'dldc' && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <label className="block text-sm text-slate-700 mb-1">Bảng dữ liệu</label>
                    <select
                      value={wizardData.dldcTable || ''}
                      onChange={(e) => setWizardData({ ...wizardData, dldcTable: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Chọn bảng --</option>
                      <option value="tbl_citizen">tbl_citizen - Thông tin công dân</option>
                      <option value="tbl_organization">tbl_organization - Thông tin tổ chức</option>
                    </select>
                  </div>
                )}

                {(wizardData.dataSource === 'lgsp' || wizardData.dataSource === 'ndxp') && (
                  <div className="bg-green-50 p-4 rounded-lg space-y-3">
                    <div>
                      <label className="block text-sm text-slate-700 mb-1">Hệ thống nguồn</label>
                      <input
                        type="text"
                        value={wizardData.apiSystem || ''}
                        onChange={(e) => setWizardData({ ...wizardData, apiSystem: e.target.value })}
                        placeholder="VD: Hệ thống CCCD - Bộ Công an"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-700 mb-1">API Endpoint</label>
                      <input
                        type="text"
                        value={wizardData.apiEndpoint || ''}
                        onChange={(e) => setWizardData({ ...wizardData, apiEndpoint: e.target.value })}
                        placeholder="https://api.example.com/v1/data"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Tạo thuộc tính */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="text-sm text-blue-900 mb-1">Bước 2: Tạo thuộc tính</h3>
                <p className="text-xs text-blue-700">
                  Định nghĩa các trường dữ liệu cho thực thể <strong>{wizardData.name || 'dữ liệu chủ'}</strong>
                </p>
              </div>

              {/* Add Attribute Form */}
              <div className="border border-slate-300 rounded-lg p-4 bg-slate-50">
                <h4 className="text-sm text-slate-900 mb-3">Thêm thuộc tính mới</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-700 mb-1">Tên trường *</label>
                    <input
                      type="text"
                      value={currentAttribute.fieldName}
                      onChange={(e) => setCurrentAttribute({ ...currentAttribute, fieldName: e.target.value.toLowerCase() })}
                      placeholder="citizen_id"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-700 mb-1">Tên hiển thị *</label>
                    <input
                      type="text"
                      value={currentAttribute.displayName}
                      onChange={(e) => setCurrentAttribute({ ...currentAttribute, displayName: e.target.value })}
                      placeholder="Số CCCD"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-700 mb-1">Kiểu dữ liệu</label>
                    <select
                      value={currentAttribute.dataType}
                      onChange={(e) => setCurrentAttribute({ ...currentAttribute, dataType: e.target.value as FieldDataType })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="string">String</option>
                      <option value="number">Number</option>
                      <option value="date">Date</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-700 mb-1">Độ dài</label>
                    <input
                      type="number"
                      value={currentAttribute.length || ''}
                      onChange={(e) => setCurrentAttribute({ ...currentAttribute, length: parseInt(e.target.value) || undefined })}
                      placeholder="255"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-3">
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={currentAttribute.required}
                      onChange={(e) => setCurrentAttribute({ ...currentAttribute, required: e.target.checked })}
                    />
                    Bắt buộc
                  </label>
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={currentAttribute.unique}
                      onChange={(e) => setCurrentAttribute({ ...currentAttribute, unique: e.target.checked })}
                    />
                    Duy nhất
                  </label>
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={currentAttribute.indexed}
                      onChange={(e) => setCurrentAttribute({ ...currentAttribute, indexed: e.target.checked })}
                    />
                    Index
                  </label>
                </div>
                <button
                  onClick={handleAddAttribute}
                  className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Thêm thuộc tính
                </button>
              </div>

              {/* Attributes List */}
              <div>
                <h4 className="text-sm text-slate-900 mb-2">
                  Danh sách thuộc tính ({wizardData.attributes.length})
                </h4>
                {wizardData.attributes.length === 0 ? (
                  <div className="border border-slate-200 rounded-lg p-8 text-center text-slate-500 text-sm">
                    Chưa có thuộc tính nào. Vui lòng thêm ít nhất 1 thuộc tính.
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left px-3 py-2 text-xs text-slate-700">Tên trường</th>
                          <th className="text-left px-3 py-2 text-xs text-slate-700">Tên hiển thị</th>
                          <th className="text-left px-3 py-2 text-xs text-slate-700">Kiểu</th>
                          <th className="text-left px-3 py-2 text-xs text-slate-700">Ràng buộc</th>
                          <th className="text-right px-3 py-2 text-xs text-slate-700">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wizardData.attributes.map((attr, index) => (
                          <tr key={index} className="border-t border-slate-200">
                            <td className="px-3 py-2">
                              <code className="text-xs bg-slate-100 px-2 py-1 rounded">{attr.fieldName}</code>
                            </td>
                            <td className="px-3 py-2 text-xs">{attr.displayName}</td>
                            <td className="px-3 py-2 text-xs">{attr.dataType}</td>
                            <td className="px-3 py-2">
                              <div className="flex gap-1">
                                {attr.required && <span className="text-xs px-1 py-0.5 bg-red-100 text-red-700 rounded">Required</span>}
                                {attr.unique && <span className="text-xs px-1 py-0.5 bg-purple-100 text-purple-700 rounded">Unique</span>}
                              </div>
                            </td>
                            <td className="px-3 py-2 text-right">
                              <button
                                onClick={() => handleDeleteAttribute(index)}
                                className="text-red-600 hover:bg-red-50 p-1 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Quy tắc hợp nhất */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="text-sm text-blue-900 mb-1">Bước 3: Quy tắc hợp nhất dữ liệu</h3>
                <p className="text-xs text-blue-700">
                  Định nghĩa quy tắc để hợp nhất các bản ghi trùng lặp
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
                <p className="text-sm text-slate-600 mb-4">
                  Chọn các trường để xác định bản ghi trùng lặp:
                </p>
                {wizardData.attributes.map((attr, index) => (
                  <label key={index} className="flex items-center gap-2 mb-2 text-sm">
                    <input
                      type="checkbox"
                      checked={wizardData.mergeRules.includes(attr.fieldName)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setWizardData({
                            ...wizardData,
                            mergeRules: [...wizardData.mergeRules, attr.fieldName]
                          });
                        } else {
                          setWizardData({
                            ...wizardData,
                            mergeRules: wizardData.mergeRules.filter(r => r !== attr.fieldName)
                          });
                        }
                      }}
                    />
                    <code className="text-xs bg-white px-2 py-1 rounded border border-slate-300">
                      {attr.fieldName}
                    </code>
                    <span className="text-slate-600">({attr.displayName})</span>
                  </label>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-xs text-amber-800">
                  💡 <strong>Gợi ý:</strong> Chọn các trường có giá trị duy nhất như ID, email, số điện thoại để tránh hợp nhất nhầm.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Thiết lập quan hệ */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="text-sm text-blue-900 mb-1">Bước 4: Thiết lập quan hệ</h3>
                <p className="text-xs text-blue-700">
                  Định nghĩa mối quan hệ với các thực thể khác
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-8 bg-slate-50 text-center">
                <p className="text-sm text-slate-600">
                  Bỏ qua bước này hoặc thêm quan hệ sau khi tạo xong.
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Bạn có thể thiết lập quan hệ 1-n, n-n với các thực thể khác sau.
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Phê duyệt */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="text-sm text-blue-900 mb-1">Bước 5: Xem lại và gửi phê duyệt</h3>
                <p className="text-xs text-blue-700">
                  Kiểm tra lại thông tin trước khi gửi phê duyệt
                </p>
              </div>

              {/* Summary */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                  <h4 className="text-sm text-slate-900">Tóm tắt thông tin</h4>
                </div>
                <div className="p-4 space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-slate-600">Tên dữ liệu chủ:</span>
                    <span className="text-slate-900">{wizardData.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-slate-600">Loại dữ liệu:</span>
                    <span className="text-slate-900">{wizardData.dataType}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-slate-600">Cơ quan quản lý:</span>
                    <span className="text-slate-900">{wizardData.managingAgency}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-slate-600">Số thuộc tính:</span>
                    <span className="text-slate-900">{wizardData.attributes.length} trường</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-slate-600">Nguồn dữ liệu:</span>
                    <span className="text-slate-900">{wizardData.dataSource}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1">
                  Ghi chú phê duyệt <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={wizardData.approvalNotes}
                  onChange={(e) => setWizardData({ ...wizardData, approvalNotes: e.target.value })}
                  placeholder="Nhập lý do và ghi chú cho việc tạo dữ liệu chủ này..."
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-800">
                    <p className="mb-1">Sau khi gửi, dữ liệu chủ sẽ ở trạng thái <strong>"Chờ phê duyệt"</strong>.</p>
                    <p>Người phê duyệt sẽ xem xét và quyết định phê duyệt hoặc từ chối.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Quay lại
          </button>

          <div className="text-sm text-slate-600">
            Bước {currentStep} / {steps.length}
          </div>

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tiếp theo
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmitWizard}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Check className="w-4 h-4" />
              Gửi phê duyệt
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
