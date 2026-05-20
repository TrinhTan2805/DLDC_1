import { useState } from 'react';
import { Database, Plus, RefreshCw, Edit2, Trash2, Search } from 'lucide-react';
import { AddServiceConfigModal, ReconciliationApiConfigFormData } from './AddServiceConfigModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface APIConfig {
  id: string;
  systemName: string;
  systemCode: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  authType: string;
  status: 'active' | 'inactive';
  statusText: string;
  statusColor: string;
  lastCall: string;
  totalCalls: number;
}

export function ReconciliationServiceSetupTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<APIConfig | null>(null);

  const [configs, setConfigs] = useState<APIConfig[]>([
    {
      id: 'API-001',
      systemName: 'Hệ thống Hộ tịch điện tử',
      systemCode: 'SPIS_HOTICH',
      endpoint: 'https://hotich.gov.vn/api/reconciliation',
      method: 'POST',
      authType: 'API Key',
      status: 'active',
      statusText: 'Hoạt động',
      statusColor: 'bg-green-100 text-green-700 border-green-200',
      lastCall: '2024-12-20 09:00:00',
      totalCalls: 24
    },
    {
      id: 'API-002',
      systemName: 'Hệ thống Đăng ký kinh doanh',
      systemCode: 'SPIS_DKKD',
      endpoint: 'https://dkkd.gov.vn/api/reconciliation',
      method: 'POST',
      authType: 'OAuth 2.0',
      status: 'active',
      statusText: 'Hoạt động',
      statusColor: 'bg-green-100 text-green-700 border-green-200',
      lastCall: '2024-12-19 16:30:00',
      totalCalls: 12
    },
    {
      id: 'API-003',
      systemName: 'Hệ thống Công chứng',
      systemCode: 'SPIS_CONGCHUNG',
      endpoint: 'https://congchung.gov.vn/api/reconciliation',
      method: 'POST',
      authType: 'API Key',
      status: 'active',
      statusText: 'Hoạt động',
      statusColor: 'bg-green-100 text-green-700 border-green-200',
      lastCall: '2024-12-16 11:20:00',
      totalCalls: 8
    }
  ]);

  const mapToFormData = (config: APIConfig): ReconciliationApiConfigFormData => ({
    systemName: config.systemName,
    systemCode: config.systemCode,
    endpoint: config.endpoint,
    method: config.method,
    authType: config.authType,
  });

  const filteredConfigs = configs.filter(config =>
    searchTerm === '' ||
    config.systemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    config.systemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    config.endpoint.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalApis = configs.length;
  const activeApis = configs.filter(c => c.status === 'active').length;
  const totalCalls = configs.reduce((sum, c) => sum + c.totalCalls, 0);

  const handleSaveConfig = (data: ReconciliationApiConfigFormData) => {
    if (isEditModalOpen && selectedConfig) {
      setConfigs((prev) =>
        prev.map((item) =>
          item.id === selectedConfig.id
            ? {
                ...item,
                systemName: data.systemName,
                systemCode: data.systemCode,
                endpoint: data.endpoint,
                method: data.method,
                authType: data.authType,
              }
            : item,
        ),
      );
      return;
    }

    const nextIndex = configs.length + 1;
    const today = new Date().toISOString().slice(0, 10);
    setConfigs((prev) => [
      ...prev,
      {
        id: `API-${String(nextIndex).padStart(3, '0')}`,
        systemName: data.systemName,
        systemCode: data.systemCode,
        endpoint: data.endpoint,
        method: data.method,
        authType: data.authType,
        status: 'active',
        statusText: 'Hoạt động',
        statusColor: 'bg-green-100 text-green-700 border-green-200',
        lastCall: `${today} 00:00:00`,
        totalCalls: 0,
      },
    ]);
  };

  const handleDeleteConfig = () => {
    if (!selectedConfig) return;
    setConfigs((prev) => prev.filter((item) => item.id !== selectedConfig.id));
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Tổng cấu hình API</p>
              <p className="text-2xl text-slate-900 mt-1">{totalApis}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Đang hoạt động</p>
              <p className="text-2xl text-green-900 mt-1">{activeApis}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Tổng số lần gọi</p>
              <p className="text-2xl text-purple-900 mt-1">{totalCalls}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm hệ thống, endpoint..."
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex items-center gap-2 whitespace-nowrap"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Thêm cấu hình API
          </button>
        </div>
      </div>

      {/* API Configs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm text-slate-600">Hệ thống đầu</th>
                <th className="px-6 py-3 text-left text-sm text-slate-600">API Endpoint</th>
                <th className="px-6 py-3 text-left text-sm text-slate-600">Phương thức</th>
                <th className="px-6 py-3 text-left text-sm text-slate-600">Xác thực</th>
                <th className="px-6 py-3 text-left text-sm text-slate-600">Trạng thái</th>
                <th className="px-6 py-3 text-left text-sm text-slate-600">Lần gọi gần nhất</th>
                <th className="px-6 py-3 text-left text-sm text-slate-600">Tổng lần gọi</th>
                <th className="px-6 py-3 text-left text-sm text-slate-600">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredConfigs.map((config) => (
                <tr key={config.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Database className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-900 font-medium">{config.systemName}</div>
                        <div className="text-xs text-slate-500">{config.systemCode}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-blue-600 font-mono">{config.endpoint}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-xs rounded-full border bg-blue-50 text-blue-700 border-blue-200">
                      {config.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{config.authType}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs rounded-full border ${config.statusColor}`}>
                      {config.statusText}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">{config.lastCall.split(' ')[0]}</div>
                    <div className="text-xs text-slate-400">{config.lastCall.split(' ')[1]}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900 text-center">{config.totalCalls}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded" 
                        title="Chỉnh sửa"
                        onClick={() => {
                          setSelectedConfig(config);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded" 
                        title="Xóa"
                        onClick={() => {
                          setSelectedConfig(config);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredConfigs.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                    Không tìm thấy cấu hình API
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Service Config Modal */}
      <AddServiceConfigModal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedConfig(null);
        }}
        isEdit={isEditModalOpen}
        initialData={selectedConfig ? mapToFormData(selectedConfig) : null}
        onSave={handleSaveConfig}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedConfig(null);
        }}
        onConfirm={() => {
          handleDeleteConfig();
        }}
        itemName={selectedConfig?.systemName}
      />
    </div>
  );
}
