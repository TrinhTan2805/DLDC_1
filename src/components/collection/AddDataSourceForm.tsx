import { useState } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

interface AddDataSourceFormProps {
  onBack: () => void;
}

export function AddDataSourceForm({ onBack }: AddDataSourceFormProps) {
  const [formData, setFormData] = useState({
    methodName: '',
    department: '',
    database: '',
    frequency: '',
    description: '',
    connectionType: 'direct',
    apiEndpoint: '',
    httpMethod: 'GET',
    authMethod: 'none',
    apiKey: '',
    timeout: '30000',
    retries: '3',
    retryDelay: '5000',
    status: 'active'
  });

  const [headers, setHeaders] = useState<Array<{ key: string; value: string }>>([]);
  const [parameters, setParameters] = useState<Array<{ key: string; value: string }>>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData, headers, parameters);
    alert('Đã thêm mới phương thức thu thập dữ liệu thành công!');
    onBack();
  };

  const handleCancel = () => {
    onBack();
  };

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const addParameter = () => {
    setParameters([...parameters, { key: '', value: '' }]);
  };

  const removeParameter = (index: number) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  const updateParameter = (index: number, field: 'key' | 'value', value: string) => {
    const newParameters = [...parameters];
    newParameters[index][field] = value;
    setParameters(newParameters);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button title="Hành động" aria-label="Hành động"
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h2 className="text-slate-900">Thêm mới phương thức thu thập dữ liệu</h2>
          <p className="text-sm text-slate-500 mt-1">Thêm phương thức để thu thập dữ liệu mới qua API</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 p-6 space-y-6">
        {/* Thông tin cơ bản */}
        <div>
          <h3 className="text-slate-900 mb-4">Thông tin cơ bản</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Tên phương thức <span className="text-red-500">*</span>
              </label>
              <input aria-label="Input field"
                type="text"
                required
                placeholder="Nhập tên phương thức"
                value={formData.methodName}
                onChange={(e) => setFormData({ ...formData, methodName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Bộ ban ngành <span className="text-red-500">*</span>
              </label>
              <input aria-label="Input field"
                type="text"
                required
                placeholder="Nhập tên bộ ban ngành"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Cơ sở dữ liệu <span className="text-red-500">*</span>
              </label>
              <input aria-label="Input field"
                type="text"
                required
                placeholder="Nhập tên cơ sở dữ liệu"
                value={formData.database}
                onChange={(e) => setFormData({ ...formData, database: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Tần suất thu thập <span className="text-red-500">*</span>
              </label>
              <input aria-label="Input field"
                type="text"
                required
                placeholder="Ví dụ: Hằng ngày, Hằng tuần, Hằng tháng"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm text-slate-700 mb-2">Mô tả</label>
            <textarea aria-label="Text input"
              rows={3}
              placeholder="Nhập mô tả chi tiết về phương thức thu thập dữ liệu này"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Loại kết nối */}
        <div>
          <label className="block text-sm text-slate-700 mb-3">Loại kết nối</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="connectionType"
                value="direct"
                checked={formData.connectionType === 'direct'}
                onChange={(e) => setFormData({ ...formData, connectionType: e.target.value })}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-slate-700">Kết nối trực tiếp</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="connectionType"
                value="icgp"
                checked={formData.connectionType === 'icgp'}
                onChange={(e) => setFormData({ ...formData, connectionType: e.target.value })}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-slate-700">Qua ICGP</span>
            </label>
          </div>
        </div>

        {/* Thông tin API */}
        <div>
          <h3 className="text-slate-900 mb-4">Thông tin API</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                API Endpoint <span className="text-red-500">*</span>
              </label>
              <input aria-label="Input field"
                type="text"
                required
                placeholder="https://api.example.gov.vn/v1/data"
                value={formData.apiEndpoint}
                onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Phương thức HTTP <span className="text-red-500">*</span>
              </label>
              <select aria-label="Select box"
                value={formData.httpMethod}
                onChange={(e) => setFormData({ ...formData, httpMethod: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            {/* Headers */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm text-slate-700">Headers</label>
                <button
                  type="button"
                  onClick={addHeader}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Thêm header
                </button>
              </div>
              {headers.map((header, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input aria-label="Input field"
                    type="text"
                    placeholder="Key"
                    value={header.key}
                    onChange={(e) => updateHeader(index, 'key', e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input aria-label="Input field"
                    type="text"
                    placeholder="Value"
                    value={header.value}
                    onChange={(e) => updateHeader(index, 'value', e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeHeader(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Parameters */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm text-slate-700">Parameters</label>
                <button
                  type="button"
                  onClick={addParameter}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Thêm parameter
                </button>
              </div>
              {parameters.map((param, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input aria-label="Input field"
                    type="text"
                    placeholder="Key"
                    value={param.key}
                    onChange={(e) => updateParameter(index, 'key', e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input aria-label="Input field"
                    type="text"
                    placeholder="Value"
                    value={param.value}
                    onChange={(e) => updateParameter(index, 'value', e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeParameter(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Xác thực (Authentication) */}
        <div>
          <h3 className="text-slate-900 mb-4">Xác thực (Authentication)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Phương thức xác thực <span className="text-red-500">*</span>
              </label>
              <select aria-label="Select box"
                value={formData.authMethod}
                onChange={(e) => setFormData({ ...formData, authMethod: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="none">Không xác thực</option>
                <option value="apikey">API Key</option>
                <option value="bearer">Bearer Token</option>
                <option value="basic">Basic Auth</option>
                <option value="oauth">OAuth 2.0</option>
              </select>
            </div>

            {formData.authMethod !== 'none' && (
              <div>
                <label className="block text-sm text-slate-700 mb-2">API Key / Token</label>
                <input aria-label="Input field"
                  type="text"
                  placeholder="Nhập API key hoặc token"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Thiết gian chờ và tần suất */}
        <div>
          <h3 className="text-slate-900 mb-4">Thiết gian chờ và tần suất</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">Timeout (ms)</label>
              <input aria-label="Input field"
                type="number"
                placeholder="30000"
                value={formData.timeout}
                onChange={(e) => setFormData({ ...formData, timeout: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">Thời gian chờ tối đa</p>
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-2">Số lần thử lại</label>
              <input aria-label="Input field"
                type="number"
                placeholder="3"
                value={formData.retries}
                onChange={(e) => setFormData({ ...formData, retries: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">Số lần thử lại khi lỗi</p>
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-2">Delay giữa các lần thử (ms)</label>
              <input aria-label="Input field"
                type="number"
                placeholder="5000"
                value={formData.retryDelay}
                onChange={(e) => setFormData({ ...formData, retryDelay: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">Khoảng thời gian chờ</p>
            </div>
          </div>
        </div>

        {/* Trạng thái */}
        <div>
          <label className="block text-sm text-slate-700 mb-3">Trạng thái</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="active"
                checked={formData.status === 'active'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-slate-700">Hoạt động</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="inactive"
                checked={formData.status === 'inactive'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-slate-700">Không hoạt động</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-slate-300 rounded-lg text-base hover:bg-slate-50 transition-colors font-medium shadow-sm"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-base hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            Thêm mới
          </button>
        </div>
      </form>
    </div>
  );
}
