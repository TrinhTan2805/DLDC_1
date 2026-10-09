import { useState } from 'react';
import { X, Globe, Calendar, User, Building2, Link2, CheckCircle, AlertCircle, Copy, ExternalLink, Settings } from 'lucide-react';

interface PublishMasterDataModalProps {
  onClose: () => void;
  onConfirm: (data: PublishData) => void;
  entityName: string;
  entityCode: string;
}

interface PublishData {
  apiEndpoint: string;
  publishDate: string;
  approver: string;
  department: string;
  description?: string;
  accessLevel: 'public' | 'internal' | 'restricted';
  enableCache: boolean;
  rateLimit: number;
}

export function PublishMasterDataModal({ onClose, onConfirm, entityName, entityCode }: PublishMasterDataModalProps) {
  const [formData, setFormData] = useState<PublishData>({
    apiEndpoint: `/api/v1/master-data/${entityCode.toLowerCase()}`,
    publishDate: new Date().toISOString().split('T')[0],
    approver: '',
    department: '',
    description: '',
    accessLevel: 'public',
    enableCache: true,
    rateLimit: 1000,
  });

  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof PublishData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.apiEndpoint.trim()) {
      newErrors.apiEndpoint = 'Vui lòng nhập API endpoint';
    } else if (!formData.apiEndpoint.startsWith('/api/')) {
      newErrors.apiEndpoint = 'API endpoint phải bắt đầu bằng /api/';
    }

    if (!formData.publishDate) {
      newErrors.publishDate = 'Vui lòng chọn ngày công khai';
    }

    if (!formData.approver.trim()) {
      newErrors.approver = 'Vui lòng nhập tên người duyệt công khai';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Vui lòng nhập đơn vị duyệt công khai';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setShowPreview(true);
    }
  };

  const handleConfirmPublish = () => {
    onConfirm(formData);
    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Đã sao chép vào clipboard');
  };

  const fullApiUrl = `https://dldc.moj.gov.vn${formData.apiEndpoint}`;

  const sampleApiResponse = {
    status: 'success',
    data: [
      {
        id: '1',
        code: 'SAMPLE001',
        attributes: {
          field1: 'value1',
          field2: 'value2',
        },
      },
    ],
    metadata: {
      total: 1,
      page: 1,
      limit: 10,
    },
  };

  const departments = [
    'Cục Công nghệ thông tin',
    'Vụ Hành chính Tư pháp',
    'Cục Quản lý xử lý vi phạm hành chính và theo dõi thi hành pháp luật',
    'Vụ Pháp luật dân sự - kinh tế',
    'Vụ Pháp luật hình sự - hành chính',
    'Tổng cục Thi hành án dân sự',
    'Cục Đăng ký quốc gia giao dịch bảo đảm',
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-slate-900">Công khai dữ liệu chủ</h2>
              <p className="text-sm text-slate-500">{entityName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Đóng" aria-label="Đóng"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {!showPreview ? (
          <>
            {/* Form */}
            <div className="p-6 space-y-6">
              {/* Info Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="text-blue-900 mb-1">Thông tin công khai</h3>
                    <p className="text-sm text-blue-800">
                      Sau khi công khai, dữ liệu chủ sẽ được cung cấp qua API endpoint để các hệ thống khác có thể truy cập và sử dụng.
                      Vui lòng kiểm tra kỹ thông tin trước khi xác nhận công khai.
                    </p>
                  </div>
                </div>
              </div>

              {/* API Endpoint */}
              <div>
                <label className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                  <Link2 className="w-4 h-4" />
                  API Endpoint <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.apiEndpoint}
                    onChange={(e) => handleChange('apiEndpoint', e.target.value)}
                    placeholder="/api/v1/master-data/..."
                    className={`flex-1 px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.apiEndpoint
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-slate-300 focus:ring-emerald-500'
                    }`}
                  />
                  <button
                    onClick={() => copyToClipboard(fullApiUrl)}
                    className="px-3 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                    title="Sao chép URL đầy đủ"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                {errors.apiEndpoint && (
                  <p className="text-sm text-red-600 mt-1">{errors.apiEndpoint}</p>
                )}
                <p className="text-xs text-slate-500 mt-1">
                  URL đầy đủ: <code className="bg-slate-100 px-2 py-0.5 rounded">{fullApiUrl}</code>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Publish Date */}
                <div>
                  <label className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                    <Calendar className="w-4 h-4" />
                    Ngày công khai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) => handleChange('publishDate', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.publishDate
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-slate-300 focus:ring-emerald-500'
                    }`}
                  />
                  {errors.publishDate && (
                    <p className="text-sm text-red-600 mt-1">{errors.publishDate}</p>
                  )}
                </div>

                {/* Access Level */}
                <div>
                  <label className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                    <Settings className="w-4 h-4" />
                    Mức độ truy cập
                  </label>
                  <select
                    value={formData.accessLevel}
                    onChange={(e) => handleChange('accessLevel', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="public">Công khai (Public)</option>
                    <option value="internal">Nội bộ (Internal)</option>
                    <option value="restricted">Hạn chế (Restricted)</option>
                  </select>
                </div>
              </div>

              {/* Approver */}
              <div>
                <label className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                  <User className="w-4 h-4" />
                  Người duyệt công khai <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.approver}
                  onChange={(e) => handleChange('approver', e.target.value)}
                  placeholder="Nhập họ tên người duyệt công khai"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.approver
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-emerald-500'
                  }`}
                />
                {errors.approver && (
                  <p className="text-sm text-red-600 mt-1">{errors.approver}</p>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                  <Building2 className="w-4 h-4" />
                  Đơn vị duyệt công khai <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.department
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-emerald-500'
                  }`}
                >
                  <option value="" disabled hidden>-- Chọn đơn vị --</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="text-sm text-red-600 mt-1">{errors.department}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="text-sm text-slate-700 mb-2 block">
                  Mô tả / Ghi chú
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Nhập mô tả hoặc ghi chú về việc công khai dữ liệu..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Advanced Settings */}
              <div className="border border-slate-200 rounded-lg p-4 space-y-4">
                <h3 className="text-slate-900 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Cài đặt nâng cao
                </h3>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-900">Bật cache dữ liệu</div>
                    <div className="text-xs text-slate-500">Tăng tốc độ truy cập API</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enableCache}
                      onChange={(e) => handleChange('enableCache', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div>
                  <label className="text-sm text-slate-700 mb-2 block">
                    Rate limit (requests/giây)
                  </label>
                  <input
                    type="number"
                    value={formData.rateLimit}
                    onChange={(e) => handleChange('rateLimit', parseInt(e.target.value))}
                    min={100}
                    max={10000}
                    step={100}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Giới hạn số lượng request mỗi giây để bảo vệ hệ thống
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 px-6 py-4 flex justify-between bg-slate-50">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                Xem trước và xác nhận
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Preview */}
            <div className="p-6 space-y-6">
              {/* Success Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <h3 className="text-emerald-900 mb-1">Sẵn sàng công khai</h3>
                    <p className="text-sm text-emerald-800">
                      Vui lòng kiểm tra lại thông tin trước khi xác nhận công khai dữ liệu chủ.
                    </p>
                  </div>
                </div>
              </div>

              {/* Preview Information */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                  <h3 className="text-slate-900">Thông tin công khai</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Tên dữ liệu chủ</div>
                      <div className="text-slate-900">{entityName}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Mã dữ liệu</div>
                      <div className="text-slate-900 font-mono">{entityCode}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">API Endpoint</div>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-slate-100 px-2 py-1 rounded text-emerald-700 flex-1">
                          {formData.apiEndpoint}
                        </code>
                        <button
                          onClick={() => copyToClipboard(fullApiUrl)}
                          className="p-1 hover:bg-slate-100 rounded transition-colors"
                          title="Sao chép"
                        >
                          <Copy className="w-4 h-4 text-slate-600" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Ngày công khai</div>
                      <div className="text-slate-900">{new Date(formData.publishDate).toLocaleDateString('vi-VN')}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Người duyệt công khai</div>
                      <div className="text-slate-900">{formData.approver}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Đơn vị duyệt công khai</div>
                      <div className="text-slate-900">{formData.department}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Mức độ truy cập</div>
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs ${
                        formData.accessLevel === 'public' 
                          ? 'bg-green-100 text-green-700'
                          : formData.accessLevel === 'internal'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {formData.accessLevel === 'public' ? 'Công khai' : formData.accessLevel === 'internal' ? 'Nội bộ' : 'Hạn chế'}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Rate limit</div>
                      <div className="text-slate-900">{formData.rateLimit.toLocaleString()} req/s</div>
                    </div>
                  </div>
                  {formData.description && (
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Mô tả</div>
                      <div className="text-slate-900 text-sm">{formData.description}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* API Example */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-slate-900">Ví dụ API Response</h3>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(sampleApiResponse, null, 2))}
                    className="text-sm px-3 py-1.5 border border-slate-300 text-slate-700 rounded hover:bg-slate-100 transition-colors flex items-center gap-2"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </button>
                </div>
                <div className="p-4 bg-slate-900">
                  <pre className="text-xs text-emerald-400 overflow-x-auto">
                    {JSON.stringify(sampleApiResponse, null, 2)}
                  </pre>
                </div>
              </div>

              {/* API Documentation Link */}
              <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ExternalLink className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-sm text-blue-900">Tài liệu API</div>
                      <div className="text-xs text-blue-700">
                        Xem hướng dẫn sử dụng API đầy đủ
                      </div>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                    Xem tài liệu
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 px-6 py-4 flex justify-between bg-slate-50">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                ← Quay lại chỉnh sửa
              </button>
              <button
                onClick={handleConfirmPublish}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Xác nhận công khai
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
