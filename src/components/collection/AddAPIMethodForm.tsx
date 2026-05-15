import { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface AddAPIMethodFormProps {
  onBack: () => void;
}

export function AddAPIMethodForm({ onBack }: AddAPIMethodFormProps) {
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [parameters, setParameters] = useState([{ key: '', value: '' }]);
  const [authMethod, setAuthMethod] = useState('direct');

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const addParameter = () => {
    setParameters([...parameters, { key: '', value: '' }]);
  };

  const removeParameter = (index: number) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-slate-900 mb-1">Thêm mới phương thức thu thập dữ liệu</h2>
        <p className="text-slate-500 text-base">Thêm phương thức thu thập dữ liệu mới qua API</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="space-y-6">
          {/* Thông tin cơ bản */}
          <div>
            <h3 className="text-slate-900 mb-4">Thông tin cơ bản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-base text-slate-700 mb-2">
                  Tên phương thức <span className="text-red-500">*</span>
                </label>
                <input aria-label="Input field"
                  type="text"
                  placeholder="Nhập tên phương thức"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-base text-slate-700 mb-2">
                  Bộ ban ngành <span className="text-red-500">*</span>
                </label>
                <input aria-label="Input field"
                  type="text"
                  placeholder="Nhập tên bộ ban ngành"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-base text-slate-700 mb-2">
                  Cơ sở dữ liệu <span className="text-red-500">*</span>
                </label>
                <input aria-label="Input field"
                  type="text"
                  placeholder="Nhập tên cơ sở dữ liệu"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-base text-slate-700 mb-2">
                  Tần suất thu thập <span className="text-red-500">*</span>
                </label>
                <input aria-label="Input field"
                  type="text"
                  placeholder="Ví dụ: Hằng ngày, Hằng tuần, Hằng tháng"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-base text-slate-700 mb-2">Mô tả</label>
              <textarea aria-label="Text input"
                rows={3}
                placeholder="Nhập mô tả chi tiết về phương thức thu thập dữ liệu"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>

          {/* Loại kết nối */}
          <div>
            <h3 className="text-slate-900 mb-4">Loại kết nối</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="authMethod"
                  value="direct"
                  checked={authMethod === 'direct'}
                  onChange={(e) => setAuthMethod(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-base text-slate-700">Kết nối trực tiếp</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="authMethod"
                  value="lgsp"
                  checked={authMethod === 'lgsp'}
                  onChange={(e) => setAuthMethod(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-base text-slate-700">Qua LGSP</span>
              </label>
            </div>
          </div>

          {/* Thông tin API */}
          <div>
            <h3 className="text-slate-900 mb-4">Thông tin API</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-base text-slate-700 mb-2">
                  API Endpoint <span className="text-red-500">*</span>
                </label>
                <input aria-label="Input field"
                  type="text"
                  placeholder="https://api.example.gov.vn/v1/data"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-base text-slate-700 mb-2">
                  Phương thức HTTP <span className="text-red-500">*</span>
                </label>
                <select aria-label="Select box" className="w-full px-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>

              {/* Headers */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-base text-slate-700">Headers</label>
                  <button
                    type="button"
                    onClick={addHeader}
                    className="flex items-center gap-1 text-base text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm header
                  </button>
                </div>
                <div className="space-y-2">
                  {headers.map((header, index) => (
                    <div key={index} className="flex gap-2">
                      <input aria-label="Input field"
                        type="text"
                        placeholder="Key"
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input aria-label="Input field"
                        type="text"
                        placeholder="Value"
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {headers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHeader(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Parameters */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-base text-slate-700">Parameters</label>
                  <button
                    type="button"
                    onClick={addParameter}
                    className="flex items-center gap-1 text-base text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm parameter
                  </button>
                </div>
                <div className="space-y-2">
                  {parameters.map((param, index) => (
                    <div key={index} className="flex gap-2">
                      <input aria-label="Input field"
                        type="text"
                        placeholder="Key"
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input aria-label="Input field"
                        type="text"
                        placeholder="Value"
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {parameters.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeParameter(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Xác thực (Authentication) */}
          <div>
            <h3 className="text-slate-900 mb-4">Xác thực (Authentication)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-base text-slate-700 mb-2">
                  Phương thức xác thực <span className="text-red-500">*</span>
                </label>
                <select aria-label="Select box" className="w-full px-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Không xác thực</option>
                  <option value="api-key">API Key</option>
                  <option value="bearer">Bearer Token</option>
                  <option value="basic">Basic Auth</option>
                  <option value="oauth2">OAuth 2.0</option>
                </select>
              </div>

              <div>
                <label className="block text-base text-slate-700 mb-2">API Key / Token</label>
                <input aria-label="Input field"
                  type="password"
                  placeholder="Nhập API key hoặc token"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Cấu hình nâng cao */}
          <div>
            <h3 className="text-slate-900 mb-4">Thời gian chờ và thử lại</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-base text-slate-700 mb-2">Timeout (ms)</label>
                <input aria-label="Input field"
                  type="number"
                  defaultValue="30000"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-base text-slate-500 mt-1">Thời gian chờ tối đa</p>
              </div>
              <div>
                <label className="block text-base text-slate-700 mb-2">Số lần thử lại</label>
                <input aria-label="Input field"
                  type="number"
                  defaultValue="3"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-base text-slate-500 mt-1">Số lần thử lại khi lỗi</p>
              </div>
              <div>
                <label className="block text-base text-slate-700 mb-2">Delay giữa các lần thử (ms)</label>
                <input aria-label="Input field"
                  type="number"
                  defaultValue="5000"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-base text-slate-500 mt-1">Khoảng thời gian chờ</p>
              </div>
            </div>
          </div>

          {/* Trạng thái */}
          <div>
            <h3 className="text-slate-900 mb-4">Trạng thái</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  defaultChecked
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-base text-slate-700">Hoạt động</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-base text-slate-700">Không hoạt động</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-slate-300 rounded-lg text-base hover:bg-slate-50 transition-colors"
        >
          Hủy bỏ
        </button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-base hover:bg-blue-700 transition-colors">
          Thêm mới
        </button>
      </div>
    </div>
    </div>
  );
}
