import { useState } from 'react';
import { Upload, FileText, Database, Send, AlertCircle, X, Clock } from 'lucide-react';

// Mock error data
interface ErrorDetail {
  id: string;
  code: string;
  title: string;
  description: string;
  timestamp: string;
  source: string;
  affectedRecords: number;
  suggestion: string;
  technicalDetails: string;
}

const errorDetails: { [key: string]: ErrorDetail } = {
  'TXN-2025120701235': {
    id: 'TXN-2025120701235',
    code: 'ERR-API-401',
    title: 'Lỗi xác thực API',
    description: 'API Key không hợp lệ hoặc đã hết hạn. Hệ thống không thể xác thực nguồn dữ liệu.',
    timestamp: '10:25:18 - 07/12/2025',
    source: 'Thi hành án dân sự',
    affectedRecords: 1892,
    suggestion: 'Vui lòng kiểm tra lại API Key hoặc liên hệ quản trị viên để cấp lại API Key mới.',
    technicalDetails: 'HTTP 401 Unauthorized - Invalid API key format or expired token. Request ID: req_abc123xyz'
  }
};

export function SendDataForm() {
  const [selectedMethod, setSelectedMethod] = useState('api');
  const [selectedSource, setSelectedSource] = useState('');
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [selectedError, setSelectedError] = useState<ErrorDetail | null>(null);

  const handleViewError = (transactionId: string) => {
    const error = errorDetails[transactionId];
    if (error) {
      setSelectedError(error);
      setErrorModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-blue-900 mb-2">Hướng dẫn gửi dữ liệu</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Dữ liệu phải tuân thủ chuẩn định dạng đã thống nhất (JSON, XML, CSV)</li>
              <li>• Kết nối phải sử dụng giao thức bảo mật (HTTPS, SSL/TLS)</li>
              <li>• Mỗi gói dữ liệu cần có mã nguồn và timestamp hợp lệ</li>
              <li>• Dung lượng tối đa mỗi lần gửi: 100MB</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Send Method Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Phương thức gửi dữ liệu</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setSelectedMethod('api')}
            className={`p-6 rounded-lg border-2 transition-all text-left ${
              selectedMethod === 'api'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Database className="w-8 h-8 text-blue-600 mb-3" />
            <h4 className="text-gray-900 mb-1">API REST</h4>
            <p className="text-gray-500 text-sm">Gửi qua API endpoint</p>
          </button>

          <button
            onClick={() => setSelectedMethod('file')}
            className={`p-6 rounded-lg border-2 transition-all text-left ${
              selectedMethod === 'file'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <FileText className="w-8 h-8 text-green-600 mb-3" />
            <h4 className="text-gray-900 mb-1">Upload File</h4>
            <p className="text-gray-500 text-sm">Tải lên file dữ liệu</p>
          </button>

          <button
            onClick={() => setSelectedMethod('sftp')}
            className={`p-6 rounded-lg border-2 transition-all text-left ${
              selectedMethod === 'sftp'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Upload className="w-8 h-8 text-purple-600 mb-3" />
            <h4 className="text-gray-900 mb-1">SFTP</h4>
            <p className="text-gray-500 text-sm">Truyền qua SFTP server</p>
          </button>
        </div>
      </div>

      {/* API Method Form */}
      {selectedMethod === 'api' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Gửi dữ liệu qua API</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Nguồn dữ liệu</label>
              <select aria-label="Select box" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                <option value="">Chọn nguồn dữ liệu</option>
                <option value="hotich">Hộ tịch điện tử</option>
                <option value="quoctich">Hộ sơ quốc tịch</option>
                <option value="thads">Thi hành án dân sự</option>
                <option value="other">Chuyên ngành khác</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">API Endpoint</label>
              <input aria-label="Input field"
                type="text"
                value="https://api.moj.gov.vn/kdldc/v1/collect"
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">API Key</label>
              <input aria-label="Input field"
                type="password"
                placeholder="Nhập API Key của nguồn dữ liệu"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Định dạng dữ liệu</label>
              <select aria-label="Select box" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                <option value="json">JSON</option>
                <option value="xml">XML</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Dữ liệu gửi (JSON/XML)</label>
              <textarea aria-label="Text input"
                rows={10}
                placeholder='{"records": [{"cccd": "001234567890", "ho_ten": "Nguyen Van A", ...}]}'
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-sm"
              ></textarea>
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Send className="w-5 h-5" />
                Gửi dữ liệu
              </button>
              <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Test kết nối
              </button>
              <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Xem log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Upload Method */}
      {selectedMethod === 'file' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Tải lên file dữ liệu</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Nguồn dữ liệu</label>
              <select aria-label="Select box" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                <option value="">Chọn nguồn dữ liệu</option>
                <option value="hotich">Hộ tịch điện tử</option>
                <option value="quoctich">Hộ sơ quốc tịch</option>
                <option value="thads">Thi hành án dân sự</option>
                <option value="other">Chuyên ngành khác</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Loại file</label>
              <select aria-label="Select box" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                <option value="json">JSON (.json)</option>
                <option value="xml">XML (.xml)</option>
                <option value="csv">CSV (.csv)</option>
                <option value="excel">Excel (.xlsx)</option>
              </select>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-700 mb-1">Kéo thả file vào đây hoặc click để chọn</p>
              <p className="text-gray-500 text-sm">Hỗ trợ: JSON, XML, CSV, Excel (Tối đa 100MB)</p>
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Upload className="w-5 h-5" />
                Tải lên và gửi
              </button>
              <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Tải template mẫu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SFTP Method */}
      {selectedMethod === 'sftp' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Gửi dữ liệu qua SFTP</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Nguồn dữ liệu</label>
              <select aria-label="Select box" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                <option value="">Chọn nguồn dữ liệu</option>
                <option value="hotich">Hộ tịch điện tử</option>
                <option value="quoctich">Hộ sơ quốc tịch</option>
                <option value="thads">Thi hành án dân sự</option>
                <option value="other">Chuyên ngành khác</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">SFTP Server</label>
              <input aria-label="Input field"
                type="text"
                placeholder="sftp.example.moj.gov.vn"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Port</label>
                <input aria-label="Input field"
                  type="number"
                  placeholder="22"
                  defaultValue="22"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Username</label>
                <input aria-label="Input field"
                  type="text"
                  placeholder="Nhập username SFTP"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <input aria-label="Input field"
                type="password"
                placeholder="Nhập password SFTP"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Thư mục đích</label>
              <input aria-label="Input field"
                type="text"
                placeholder="/upload/data"
                defaultValue="/upload/data"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Tên file</label>
              <input aria-label="Input field"
                type="text"
                placeholder="data_YYYYMMDD.json"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                <Upload className="w-5 h-5" />
                Gửi qua SFTP
              </button>
              <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Test kết nối
              </button>
              <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Xem log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Sent Data */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-gray-900">Dữ liệu đã gửi gần đây</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700 text-sm">Thời gian</th>
                <th className="px-6 py-3 text-left text-gray-700 text-sm">Nguồn</th>
                <th className="px-6 py-3 text-left text-gray-700 text-sm">Phương thức</th>
                <th className="px-6 py-3 text-left text-gray-700 text-sm">Số bản ghi</th>
                <th className="px-6 py-3 text-left text-gray-700 text-sm">Trạng thái</th>
                <th className="px-6 py-3 text-left text-gray-700 text-sm">Mã giao dịch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-600">10:30 - 07/12/2025</td>
                <td className="px-6 py-4 text-gray-900">Hộ tịch điện tử</td>
                <td className="px-6 py-4 text-gray-600">API</td>
                <td className="px-6 py-4 text-gray-600">2,345</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Thành công</span>
                </td>
                <td className="px-6 py-4 text-gray-600">TXN-2025120701234</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-600">10:25 - 07/12/2025</td>
                <td className="px-6 py-4 text-gray-900">Thi hành án</td>
                <td className="px-6 py-4 text-gray-600">File Upload</td>
                <td className="px-6 py-4 text-gray-600">1,892</td>
                <td className="px-6 py-4">
                  <span 
                    onClick={() => handleViewError('TXN-2025120701235')}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm inline-flex items-center gap-1.5 cursor-pointer hover:bg-red-200 transition-colors"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    Có lỗi
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">TXN-2025120701235</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Error Detail Modal */}
      {errorModalOpen && selectedError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-red-50">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-gray-900">Chi tiết lỗi</h3>
                  <p className="text-sm text-gray-500">Mã giao dịch: {selectedError.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setErrorModalOpen(false)}
                className="p-2 hover:bg-red-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Error Code and Title */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-red-600 text-white rounded text-xs">{selectedError.code}</span>
                      <h4 className="text-red-900">{selectedError.title}</h4>
                    </div>
                    <p className="text-red-700 text-sm">{selectedError.description}</p>
                  </div>
                </div>
              </div>

              {/* Error Information Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-500 text-sm mb-1">Thời gian xảy ra</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <p className="text-gray-900">{selectedError.timestamp}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-500 text-sm mb-1">Nguồn dữ liệu</p>
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-gray-600" />
                    <p className="text-gray-900">{selectedError.source}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-500 text-sm mb-1">Số bản ghi bị ảnh hưởng</p>
                  <p className="text-gray-900">{selectedError.affectedRecords.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-500 text-sm mb-1">Mã giao dịch</p>
                  <p className="text-gray-900 font-mono text-sm">{selectedError.id}</p>
                </div>
              </div>

              {/* Suggestion */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-blue-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Hướng dẫn khắc phục
                </h4>
                <p className="text-blue-700 text-sm">{selectedError.suggestion}</p>
              </div>

              {/* Technical Details */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-gray-900 mb-2">Chi tiết kỹ thuật</h4>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                  {selectedError.technicalDetails}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                Gửi lại dữ liệu
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm">
                Xem log đầy đủ
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm">
                Báo cáo lỗi
              </button>
              <button 
                onClick={() => setErrorModalOpen(false)}
                className="ml-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm"
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