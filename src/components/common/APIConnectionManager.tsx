import { confirmDialog } from './confirmDialog';
import { toast } from 'sonner';
import { useState } from 'react';
import { Plus, Server, CheckCircle, XCircle, Clock, Eye, Edit, Trash2, RefreshCw, Link, Key } from 'lucide-react';
import { APIConnectionFormModal } from './APIConnectionFormModal';

interface APIConnection {
  id: number;
  name: string;
  description?: string;
  baseUrl: string;
  endpoint: string;
  method: string;
  contentType: string;
  authType: 'api-key' | 'client-secret' | 'oauth2' | 'hmac';
  status: 'connected' | 'disconnected' | 'error';
  responseTime?: string;
  lastSync?: string;
  isActive: boolean;
  // Auth details (simplified for display)
  authDetails?: any;
}

export function APIConnectionManager() {
  const [connections, setConnections] = useState<APIConnection[]>([
    {
      id: 1,
      name: 'API Danh mục giới tính',
      description: 'Kết nối lấy danh sách giới tính từ hệ thống LGSP',
      baseUrl: 'https://lgsp.btp.gov.vn',
      endpoint: '/api/v1/categories/gender',
      method: 'GET',
      contentType: 'application/json',
      authType: 'api-key',
      status: 'connected',
      responseTime: '120ms',
      lastSync: '09/12/2025 14:30:25',
      isActive: true
    },
    {
      id: 2,
      name: 'API Danh mục quốc tịch',
      description: 'Kết nối lấy danh sách quốc tịch',
      baseUrl: 'https://lgsp.btp.gov.vn',
      endpoint: '/api/v1/categories/nationality',
      method: 'GET',
      contentType: 'application/json',
      authType: 'client-secret',
      status: 'connected',
      responseTime: '95ms',
      lastSync: '09/12/2025 14:25:10',
      isActive: true
    },
    {
      id: 3,
      name: 'API Backup (Dự phòng)',
      description: 'Kết nối dự phòng khi hệ thống chính gặp sự cố',
      baseUrl: 'https://backup.lgsp.btp.gov.vn',
      endpoint: '/api/v1/backup',
      method: 'GET',
      contentType: 'application/json',
      authType: 'oauth2',
      status: 'disconnected',
      responseTime: '-',
      isActive: false
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedConnection, setSelectedConnection] = useState<APIConnection | undefined>();

  const statusConfig = {
    connected: {
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      label: 'Đang kết nối'
    },
    disconnected: {
      icon: XCircle,
      color: 'text-gray-600',
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      label: 'Ngắt kết nối'
    },
    error: {
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      label: 'Lỗi kết nối'
    }
  };

  const handleAdd = () => {
    setModalMode('add');
    setSelectedConnection(undefined);
    setShowModal(true);
  };

  const handleView = (connection: APIConnection) => {
    setModalMode('view');
    setSelectedConnection(connection);
    setShowModal(true);
  };

  const handleEdit = (connection: APIConnection) => {
    setModalMode('edit');
    setSelectedConnection(connection);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if ((await confirmDialog('Bạn có chắc chắn muốn xóa kết nối này?', { type: 'delete', title: 'Xác nhận xóa', confirmText: 'Xóa', subtitle: 'Hành động này không thể hoàn tác.' }))) {
      setConnections(connections.filter(c => c.id !== id));
      toast.success('Đã xóa kết nối thành công');
    }
  };

  const handleTest = (id: number) => {
    const connection = connections.find(c => c.id === id);
    if (connection) {
      toast.success(`Đang test kết nối: ${connection.name}\n\nKết quả: Kết nối thành công!\nResponse time: 120ms`);
      // Update status
      setConnections(connections.map(c => 
        c.id === id ? { ...c, status: 'connected', responseTime: '120ms' } : c
      ));
    }
  };

  const handleSave = (data: any) => {
    if (modalMode === 'add') {
      const newConnection: APIConnection = {
        id: Math.max(...connections.map(c => c.id), 0) + 1,
        ...data,
        status: 'disconnected' as const,
        responseTime: '-'
      };
      setConnections([...connections, newConnection]);
      toast.success('Đã thêm kết nối mới thành công');
    } else if (modalMode === 'edit' && selectedConnection) {
      setConnections(connections.map(c => 
        c.id === selectedConnection.id ? { ...c, ...data } : c
      ));
      toast.success('Đã cập nhật kết nối thành công');
    }
  };

  const activeConnections = connections.filter(c => c.status === 'connected').length;
  const totalConnections = connections.length;

  return (
    <>
      <div className="space-y-4">
        {/* Header with Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-slate-600" />
              <h3 className="text-slate-900">Danh sách kết nối API</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">
                  {activeConnections} hoạt động
                </span>
              </div>
              <div className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm">
                Tổng: {totalConnections}
              </div>
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Thêm kết nối
          </button>
        </div>

        {/* Connections List */}
        {connections.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
            <Server className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600 mb-4">Chưa có kết nối API nào</p>
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Thêm kết nối đầu tiên
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {connections.map((connection) => {
              const config = statusConfig[connection.status];
              const StatusIcon = config.icon;

              return (
                <div
                  key={connection.id}
                  className={`bg-white rounded-lg border ${config.border} p-4 hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-slate-900">{connection.name}</h4>
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 ${config.bg} rounded-full`}>
                          <StatusIcon className={`w-3.5 h-3.5 ${config.color}`} />
                          <span className={`text-xs ${config.color}`}>{config.label}</span>
                        </div>
                        {!connection.isActive && (
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                            Tạm dừng
                          </span>
                        )}
                        <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs">
                          {connection.authType.toUpperCase()}
                        </span>
                      </div>
                      {connection.description && (
                        <p className="text-sm text-slate-600">{connection.description}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleTest(connection.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Test kết nối"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleView(connection)}
                        className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(connection)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(connection.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Connection Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Endpoint */}
                    <div className="flex items-start gap-2">
                      <div className="p-1.5 bg-blue-50 rounded">
                        <Link className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-600">Endpoint</p>
                        <p className="text-sm text-slate-900 truncate" title={`${connection.baseUrl}${connection.endpoint}`}>
                          {connection.endpoint}
                        </p>
                      </div>
                    </div>

                    {/* Method & Content Type */}
                    <div className="flex items-start gap-2">
                      <div className="p-1.5 bg-purple-50 rounded">
                        <Key className="w-3.5 h-3.5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">Method</p>
                        <p className="text-sm text-slate-900">
                          {connection.method}
                        </p>
                      </div>
                    </div>

                    {/* Response Time */}
                    <div className="flex items-start gap-2">
                      <div className="p-1.5 bg-amber-50 rounded">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">Response Time</p>
                        <p className="text-sm text-slate-900">{connection.responseTime}</p>
                      </div>
                    </div>

                    {/* Last Sync */}
                    {connection.lastSync && (
                      <div className="flex items-start gap-2">
                        <div className="p-1.5 bg-green-50 rounded">
                          <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">Đồng bộ cuối</p>
                          <p className="text-sm text-slate-900">{connection.lastSync}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      <APIConnectionFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        data={selectedConnection}
        mode={modalMode}
      />
    </>
  );
}
