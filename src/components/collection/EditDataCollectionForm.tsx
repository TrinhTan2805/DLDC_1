import { ArrowLeft, Save, X } from 'lucide-react';
import { useState } from 'react';

interface EditDataCollectionFormProps {
  data: any;
  onBack: () => void;
  onSave: (data: any) => void;
}

export function EditDataCollectionForm({ data, onBack, onSave }: EditDataCollectionFormProps) {
  const [formData, setFormData] = useState({
    department: data.department,
    dataName: data.dataName,
    dataType: data.dataType,
    description: data.description,
    frequency: data.frequency,
    format: data.format,
    priority: data.priority,
    status: data.status,
    // Connection info
    connectionMethod: data.connectionMethod || 'API',
    endpoint: data.endpoint || '',
    authMethod: data.authMethod || 'API Key',
    apiKey: data.apiKey || '',
    username: data.username || '',
    password: data.password || '',
    port: data.port || '',
    technicalNote: data.technicalNote || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mockup: chỉ hiển thị thông báo
    alert('Mockup: Cập nhật dữ liệu thành công!\n(Chưa kết nối backend thực tế)');
    onBack();
  };

  const categoryColor = data.category === 'external' ? 'blue' : 'green';

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button title="Hành động" aria-label="Hành động"
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h2 className="text-slate-900">Chỉnh sửa Dữ liệu Cần Thu thập</h2>
            <p className="text-base text-slate-500 mt-0.5">Cập nhật thông tin dữ liệu</p>
          </div>
        </div>
      </div>

      {/* Category Badge */}
      <div className={`bg-${categoryColor}-50 border-2 border-${categoryColor}-200 rounded-lg p-4`}
        style={{
          backgroundColor: categoryColor === 'blue' ? '#eff6ff' : '#f0fdf4',
          borderColor: categoryColor === 'blue' ? '#bfdbfe' : '#bbf7d0'
        }}
      >
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full bg-${categoryColor}-600`}
            style={{
              backgroundColor: categoryColor === 'blue' ? '#2563eb' : '#16a34a'
            }}
          ></div>
          <p className={`text-base text-${categoryColor}-900`}
            style={{
              color: categoryColor === 'blue' ? '#1e3a8a' : '#14532d'
            }}
          >
            {data.category === 'external' ? 'Thu thp từ Bộ ngoài' : 'Thu thập từ các Hệ thống trong nội bộ Bộ Tư pháp'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Cơ quan/Cục */}
            <div>
              <label className="block text-base text-slate-700 mb-2">
                {data.category === 'external' ? 'Cơ quan nguồn' : 'Cục/Vụ'} <span className="text-red-500">*</span>
              </label>
              {data.category === 'external' ? (
                <select aria-label="Select box"
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Tòa án nhân dân tối cao">Tòa án nhân dân tối cao</option>
                  <option value="Cục Thống kê Trung ương">Cục Thống kê Trung ương</option>
                  <option value="Ủy ban Dân tộc">Ủy ban Dân tộc</option>
                  <option value="Bộ Ngoại giao">Bộ Ngoại giao</option>
                  <option value="Ban Tôn giáo Chính phủ">Ban Tôn giáo Chính phủ</option>
                  <option value="Văn phòng Chính phủ">Văn phòng Chính phủ</option>
                  <option value="Bộ Nội vụ">Bộ Nội vụ</option>
                  <option value="Bộ Công an">Bộ Công an</option>
                  <option value="Bộ Lao động - Thương binh và Xã hội">Bộ Lao động - Thương binh và Xã hội</option>
                  <option value="Bộ Y tế">Bộ Y tế</option>
                </select>
              ) : (
                <select aria-label="Select box"
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Cục Hành chính tư pháp">Cục Hành chính tư pháp</option>
                  <option value="Cục Quản lý thi hành án dân sự">Cục Quản lý thi hành án dân sự</option>
                  <option value="Cục Đăng ký giao dịch bảo đảm và tài sản">Cục Đăng ký giao dịch bảo đảm và tài sản</option>
                  <option value="Cục Kiểm tra văn bản và Quản lý về văn bản QPPL">Cục Kiểm tra văn bản và Quản lý về văn bản QPPL</option>
                  <option value="Cục Bổ trợ tư pháp">Cục Bổ trợ tư pháp</option>
                  <option value="Vụ Hợp tác quốc tế">Vụ Hợp tác quốc tế</option>
                  <option value="Cục Kế hoạch - Tài chính">Cục Kế hoạch - Tài chính</option>
                </select>
              )}
            </div>

            {/* Loại dữ liệu */}
            <div>
              <label className="block text-base text-slate-700 mb-2">
                Loại dữ liệu <span className="text-red-500">*</span>
              </label>
              <input aria-label="Input field"
                type="text"
                required
                value={formData.dataType}
                onChange={(e) => setFormData({ ...formData, dataType: e.target.value })}
                placeholder="VD: Hộ tịch, Danh mục, Bảo trợ XH..."
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Tên dữ liệu */}
          <div>
            <label className="block text-base text-slate-700 mb-2">
              Tên dữ liệu <span className="text-red-500">*</span>
            </label>
            <input aria-label="Input field"
              type="text"
              required
              value={formData.dataName}
              onChange={(e) => setFormData({ ...formData, dataName: e.target.value })}
              placeholder="Nhập tên dữ liệu cần thu thập"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-base text-slate-700 mb-2">
              Mô tả
            </label>
            <textarea aria-label="Text input"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả chi tiết về dữ liệu này"
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Tần suất */}
            <div>
              <label className="block text-base text-slate-700 mb-2">
                Tần suất thu thập <span className="text-red-500">*</span>
              </label>
              <select aria-label="Select box"
                required
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Hằng ngày">Hằng ngày</option>
                <option value="Hằng tuần">Hằng tuần</option>
                <option value="Hằng tháng">Hằng tháng</option>
                <option value="Hằng quý">Hằng quý</option>
                <option value="Hằng năm">Hằng năm</option>
              </select>
            </div>

            {/* Định dạng */}
            <div>
              <label className="block text-base text-slate-700 mb-2">
                Định dạng <span className="text-red-500">*</span>
              </label>
              <select aria-label="Select box"
                required
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="JSON">JSON</option>
                <option value="XML">XML</option>
                <option value="CSV">CSV</option>
                <option value="Excel">Excel</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Mức độ ưu tiên */}
            <div>
              <label className="block text-base text-slate-700 mb-2">
                Mức độ ưu tiên <span className="text-red-500">*</span>
              </label>
              <select aria-label="Select box"
                required
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="high">Cao</option>
                <option value="medium">Trung bình</option>
                <option value="low">Thấp</option>
              </select>
            </div>

            {/* Trạng thái */}
            <div>
              <label className="block text-base text-slate-700 mb-2">
                Trạng thái <span className="text-red-500">*</span>
              </label>
              <select aria-label="Select box"
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="not-started">Chưa bắt đầu</option>
                <option value="pending">Đang xử lý</option>
                <option value="collected">Đã thu thập</option>
              </select>
            </div>
          </div>

          {/* Connection Info */}
          <div className="pt-4 border-t border-slate-200">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-base text-slate-700 mb-2">
                  Phương thức kết nối <span className="text-red-500">*</span>
                </label>
                <select aria-label="Select box"
                  required
                  value={formData.connectionMethod}
                  onChange={(e) => setFormData({ ...formData, connectionMethod: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="API">API</option>
                  <option value="FTP">FTP</option>
                  <option value="SFTP">SFTP</option>
                  <option value="Database">Database</option>
                </select>
              </div>
              <div>
                <label className="block text-base text-slate-700 mb-2">
                  Endpoint <span className="text-red-500">*</span>
                </label>
                <input aria-label="Input field"
                  type="text"
                  required
                  value={formData.endpoint}
                  onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                  placeholder="Nhập endpoint"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-base text-slate-700 mb-2">
                  Phương thức xác thực <span className="text-red-500">*</span>
                </label>
                <select aria-label="Select box"
                  required
                  value={formData.authMethod}
                  onChange={(e) => setFormData({ ...formData, authMethod: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="API Key">API Key</option>
                  <option value="Username/Password">Username/Password</option>
                  <option value="OAuth">OAuth</option>
                </select>
              </div>
              <div>
                <label className="block text-base text-slate-700 mb-2">
                  API Key
                </label>
                <input aria-label="Input field"
                  type="text"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  placeholder="Nhập API Key"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-base text-slate-700 mb-2">
                  Username
                </label>
                <input aria-label="Input field"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Nhập Username"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-base text-slate-700 mb-2">
                  Password
                </label>
                <input aria-label="Input field"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Nhập Password"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-base text-slate-700 mb-2">
                  Port
                </label>
                <input aria-label="Input field"
                  type="text"
                  value={formData.port}
                  onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                  placeholder="Nhập Port"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-base text-slate-700 mb-2">
                  Ghi chú kỹ thuật
                </label>
                <textarea aria-label="Text input"
                  value={formData.technicalNote}
                  onChange={(e) => setFormData({ ...formData, technicalNote: e.target.value })}
                  placeholder="Nhập ghi chú kỹ thuật"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* ID Info */}
          <div className="pt-4 border-t border-slate-200">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-base text-slate-500 uppercase tracking-wider mb-2">STT</label>
                <p className="text-slate-900">#{data.stt}</p>
              </div>
              <div>
                <label className="block text-base text-slate-500 uppercase tracking-wider mb-2">Mã ID</label>
                <p className="text-slate-900">DC-{String(data.id).padStart(4, '0')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-white rounded-lg transition-colors flex items-center gap-2"
            style={{
              backgroundColor: categoryColor === 'blue' ? '#2563eb' : '#16a34a'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = categoryColor === 'blue' ? '#1d4ed8' : '#15803d';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = categoryColor === 'blue' ? '#2563eb' : '#16a34a';
            }}
          >
            <Save className="w-4 h-4" />
            Cập nhật
          </button>
        </div>
      </form>

      {/* Mockup Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-base text-amber-800">
          <strong>Lưu ý:</strong> Đây là giao diện mockup chỉnh sửa. Chức năng cập nhật chưa kết nối với backend thực tế.
        </p>
      </div>
    </div>
    </div>
  );
}