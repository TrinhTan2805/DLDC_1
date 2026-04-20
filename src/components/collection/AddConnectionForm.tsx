import { useState } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

interface AddConnectionFormProps {
  onClose: () => void;
  onSave: () => void;
}

export function AddConnectionForm({ onClose, onSave }: AddConnectionFormProps) {
  const [useSSL, setUseSSL] = useState(false);
  const [autoActivate, setAutoActivate] = useState(true);
  const [testResult, setTestResult] = useState<'success' | 'failed' | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult(null);
    
    // Simulate API call
    setTimeout(() => {
      setIsTesting(false);
      // Random success/fail for demo
      setTestResult(Math.random() > 0.3 ? 'success' : 'failed');
    }, 2000);
  };

  const handleSave = () => {
    alert('Đã lưu cấu hình kết nối thành công!');
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-slate-900">Thêm kết nối mới</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded transition-colors" title="Đóng" aria-label="Đóng"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-4">
          {/* Row 1: Tên nguồn dữ liệu & Loại kết nối */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Tên nguồn dữ liệu
              </label>
              <input aria-label="Input field"
                type="text"
                placeholder="Ví dụ: CSDL Đăng ký kinh doanh"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Loại kết nối
              </label>
              <select aria-label="Select box" className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Chọn loại kết nối</option>
                <option value="api">API REST</option>
                <option value="database">Database</option>
                <option value="sftp">SFTP</option>
                <option value="soap">SOAP/Web Service</option>
                <option value="file">File Upload</option>
              </select>
            </div>
          </div>

          {/* Row 2: Endpoint / URL */}
          <div>
            <label className="block text-sm text-slate-700 mb-2">
              Endpoint / URL
            </label>
            <input aria-label="Input field"
              type="text"
              placeholder="https://api.example.moj.gov.vn/v1/data"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Row 3: Định dạng dữ liệu, Giao thức, Port */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Định dạng dữ liệu
              </label>
              <select aria-label="Select box" className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="json">JSON</option>
                <option value="xml">XML</option>
                <option value="csv">CSV</option>
                <option value="excel">Excel</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Giao thức
              </label>
              <select aria-label="Select box" className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="https">HTTPS</option>
                <option value="http">HTTP</option>
                <option value="sftp">SFTP</option>
                <option value="ftp">FTP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Port
              </label>
              <input aria-label="Input field"
                type="number"
                placeholder="443"
                defaultValue="443"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 4: API Key / Username & Secret / Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                API Key / Username
              </label>
              <input aria-label="Input field"
                type="text"
                placeholder="Nhập API Key hoặc Username"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Secret / Password
              </label>
              <input aria-label="Input field"
                type="password"
                placeholder="Nhập Secret hoặc Password"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 5: Mô tả */}
          <div>
            <label className="block text-sm text-slate-700 mb-2">
              Mô tả
            </label>
            <textarea aria-label="Text input"
              rows={4}
              placeholder="Mô tả về nguồn dữ liệu và mục đích kết nối..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={useSSL}
                onChange={(e) => setUseSSL(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-slate-700">Sử dụng SSL/TLS</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoActivate}
                onChange={(e) => setAutoActivate(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-slate-700">Kích hoạt ngay sau khi tạo</span>
            </label>
          </div>

          {/* Test Result */}
          {testResult && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              testResult === 'success' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              {testResult === 'success' ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700">
                    Kết nối thành công! Nguồn dữ liệu hoạt động bình thường.
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-red-700">
                    Kết nối thất bại! Vui lòng kiểm tra lại thông tin endpoint và xác thực.
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex justify-start gap-3">
          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isTesting ? 'Đang kiểm tra...' : 'Test kết nối'}
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
          >
            Lưu cấu hình
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 transition-colors"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
