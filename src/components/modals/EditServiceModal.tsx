import { useState, useEffect } from 'react';
import { X, Server, Database, Code, Shield, FileText, Save } from 'lucide-react';

interface EditServiceModalProps {
  isOpen: boolean;
  service: any;
  onClose: () => void;
  onSave: (service: any) => void;
}

export function EditServiceModal({ isOpen, service, onClose, onSave }: EditServiceModalProps) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    department: '',
    database: '',
    description: '',
    apiEndpoint: '',
    method: 'GET',
    accessLevel: 'internal',
    documentation: ''
  });

  useEffect(() => {
    if (service) {
      setFormData({
        code: service.code || '',
        name: service.name || '',
        department: service.department || '',
        database: service.database || '',
        description: service.description || '',
        apiEndpoint: service.apiEndpoint || '',
        method: service.method || 'GET',
        accessLevel: service.accessLevel || 'internal',
        documentation: service.documentation || ''
      });
    }
  }, [service]);

  if (!isOpen || !service) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...service,
      ...formData
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Server className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-slate-900">Chỉnh sửa dịch vụ cung cấp dữ liệu</h2>
              <p className="text-sm text-slate-600">{service.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Đóng" aria-label="Đóng"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Status Badge */}
          {service.status && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="text-sm text-slate-600">Trạng thái hiện tại:</div>
                {service.status === 'active' && (
                  <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm">
                    Hoạt động
                  </span>
                )}
                {service.status === 'pending' && (
                  <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm">
                    Chờ duyệt
                  </span>
                )}
                {service.status === 'inactive' && (
                  <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm">
                    Đình chỉ
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Mã dịch vụ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Code className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="VD: SVC_HOTICH_001"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Tên dịch vụ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Server className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="VD: CSDL Hộ tịch điện tử"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Đơn vị cung cấp <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="" disabled hidden>-- Chọn đơn vị --</option>
                <option value="Cục Hành chính tư pháp">Cục Hành chính tư pháp</option>
                <option value="Cục Quản lý thi hành án dân sự">Cục Quản lý thi hành án dân sự</option>
                <option value="Cục Đăng ký giao dịch bảo đảm và BTNN">Cục Đăng ký giao dịch bảo đảm và BTNN</option>
                <option value="Cục Kiểm tra văn bản và Quản lý xử lý vi phạm hành chính">Cục Kiểm tra văn bản</option>
                <option value="Cục Bổ trợ tư pháp">Cục Bổ trợ tư pháp</option>
                <option value="Vụ Hợp tác quốc tế">Vụ Hợp tác quốc tế</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Cơ sở dữ liệu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Database className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="VD: DB_HOTICH"
                  value={formData.database}
                  onChange={(e) => setFormData({...formData, database: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-2">
              Mô tả dịch vụ <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Mô tả chức năng và phạm vi dữ liệu cung cấp..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                API Endpoint <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="/api/v1/..."
                value={formData.apiEndpoint}
                onChange={(e) => setFormData({...formData, apiEndpoint: e.target.value})}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Phương thức HTTP <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.method}
                onChange={(e) => setFormData({...formData, method: e.target.value})}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-2">
              Mức độ truy cập <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormData({...formData, accessLevel: 'public'})}
                className={`px-4 py-3 border rounded-lg text-sm transition-colors ${
                  formData.accessLevel === 'public'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <Shield className="w-5 h-5 mx-auto mb-1" />
                Công khai
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, accessLevel: 'internal'})}
                className={`px-4 py-3 border rounded-lg text-sm transition-colors ${
                  formData.accessLevel === 'internal'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <Shield className="w-5 h-5 mx-auto mb-1" />
                Nội bộ
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, accessLevel: 'restricted'})}
                className={`px-4 py-3 border rounded-lg text-sm transition-colors ${
                  formData.accessLevel === 'restricted'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <Shield className="w-5 h-5 mx-auto mb-1" />
                Hạn chế
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-2">
              Tài liệu kỹ thuật
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <textarea
                rows={4}
                placeholder="Hướng dẫn sử dụng API, tham số, định dạng dữ liệu trả về..."
                value={formData.documentation}
                onChange={(e) => setFormData({...formData, documentation: e.target.value})}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>
          </div>

          {/* Metadata Info */}
          {service.createdBy && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h4 className="text-sm text-slate-900 mb-3">Thông tin quản lý</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Người tạo:</span>
                  <span className="ml-2 text-slate-900">{service.createdBy}</span>
                </div>
                <div>
                  <span className="text-slate-500">Ngày tạo:</span>
                  <span className="ml-2 text-slate-900">{service.createdDate}</span>
                </div>
                {service.approvedBy && (
                  <>
                    <div>
                      <span className="text-slate-500">Người phê duyệt:</span>
                      <span className="ml-2 text-slate-900">{service.approvedBy}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Ngày phê duyệt:</span>
                      <span className="ml-2 text-slate-900">{service.approvedDate}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
