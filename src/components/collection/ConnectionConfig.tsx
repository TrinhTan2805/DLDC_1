import { Database, Plus, Edit2, Trash2, TestTube } from 'lucide-react';
import { useState } from 'react';

const connections = [
  {
    id: 1,
    name: 'CSDL A',
    type: 'API REST',
    endpoint: 'https://api.hethong-a.moj.gov.vn/v1/data',
    status: 'active',
    lastSync: '2 phút trước',
    lastCheck: '10/12/2025 14:30',
    responseTime: '125ms',
    successRate: 99.8
  },
  {
    id: 2,
    name: 'Hệ thống B',
    type: 'Web Service',
    endpoint: 'https://ws.hethong-b.moj.gov.vn/api/sync',
    status: 'active',
    lastSync: '5 phút trước',
    lastCheck: '10/12/2025 14:28',
    responseTime: '245ms',
    successRate: 98.5
  },
  {
    id: 3,
    name: 'CSDL C',
    type: 'API REST',
    endpoint: 'https://api.hethong-c.moj.gov.vn/v1/collect',
    status: 'inactive',
    lastSync: 'Chưa kết nối',
    lastCheck: '09/12/2025 09:15',
    responseTime: '0ms',
    successRate: 0
  },
];

export function ConnectionConfig() {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-900">Cấu hình kết nối nguồn dữ liệu</h3>
          <p className="text-gray-500 text-base mt-1">Quản lý các kênh kết nối với hệ thống nguồn</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700" onClick={() => setShowAddForm(true)}>
          <Plus className="w-5 h-5" />
          Thêm kết nối mới
        </button>
      </div>

      {/* Connection List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700 text-base">Tên nguồn</th>
                <th className="px-6 py-3 text-left text-gray-700 text-base">Loại kết nối</th>
                <th className="px-6 py-3 text-left text-gray-700 text-base">Endpoint</th>
                <th className="px-6 py-3 text-left text-gray-700 text-base">Trạng thái</th>
                <th className="px-6 py-3 text-left text-gray-700 text-base">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {connections.map((conn) => (
                <tr key={conn.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-900">{conn.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{conn.type}</td>
                  <td className="px-6 py-4 text-gray-600 text-base max-w-xs truncate">{conn.endpoint}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-base ${
                      conn.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {conn.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button title="Hành động" aria-label="Hành động" className="p-1 hover:bg-gray-100 rounded">
                        <TestTube className="w-4 h-4 text-blue-600" />
                      </button>
                      <button title="Hành động" aria-label="Hành động" className="p-1 hover:bg-gray-100 rounded">
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded" title="Xóa" aria-label="Xóa">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Connection Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-gray-900">Thêm kết nối mới</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Tên nguồn dữ liệu</label>
                  <input aria-label="Input field"
                    type="text"
                    placeholder="Ví dụ: CSDL Đăng ký kinh doanh"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Loại kết nối</label>
                  <select aria-label="Select box" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="">Chọn loại kết nối</option>
                    <option value="api">API REST</option>
                    <option value="sftp">SFTP/FTP</option>
                    <option value="database">Database Link</option>
                    <option value="soap">SOAP Web Service</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Endpoint / URL</label>
                <input aria-label="Input field"
                  type="text"
                  placeholder="https://api.example.moj.gov.vn/v1/data"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Định dạng dữ liệu</label>
                  <select aria-label="Select box" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="json">JSON</option>
                    <option value="xml">XML</option>
                    <option value="csv">CSV</option>
                    <option value="sql">SQL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Giao thức</label>
                  <select aria-label="Select box" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="https">HTTPS</option>
                    <option value="sftp">SFTP</option>
                    <option value="ftp">FTP</option>
                    <option value="oracle">Oracle</option>
                    <option value="sqlserver">SQL Server</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Port</label>
                  <input aria-label="Input field"
                    type="number"
                    placeholder="443"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">API Key / Username</label>
                  <input aria-label="Input field"
                    type="text"
                    placeholder="Nhập API Key hoặc Username"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Secret / Password</label>
                  <input aria-label="Input field"
                    type="password"
                    placeholder="Nhập Secret hoặc Password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Mô tả</label>
                <textarea aria-label="Text input"
                  rows={3}
                  placeholder="Mô tả về nguồn dữ liệu và mục đích kết nối..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                ></textarea>
              </div>

              <div>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-5 h-5 text-red-600 rounded" />
                  <span className="text-gray-700">Sử dụng SSL/TLS</span>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-5 h-5 text-red-600 rounded" defaultChecked />
                  <span className="text-gray-700">Kích hoạt ngay sau khi tạo</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Test kết nối
                </button>
                <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Lưu cấu hình
                </button>
                <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50" onClick={() => setShowAddForm(false)}>
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-gray-900">Cài đặt bảo mật</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5 text-red-600 rounded" defaultChecked />
                <span className="text-gray-700">Yêu cầu xác thực 2 lớp (2FA) cho kết nối quan trọng</span>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5 text-red-600 rounded" defaultChecked />
                <span className="text-gray-700">Mã hóa dữ liệu khi truyền tải</span>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5 text-red-600 rounded" defaultChecked />
                <span className="text-gray-700">Ghi log tất cả hoạt động kết nối</span>
              </label>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Thời gian timeout kết nối (giây)</label>
              <input aria-label="Input field"
                type="number"
                defaultValue="30"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Số lần thử kết nối lại</label>
              <input aria-label="Input field"
                type="number"
                defaultValue="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Lưu cài đặt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}