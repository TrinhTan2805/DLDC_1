import { useState } from 'react';
import { X, Users, Shield, Key, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface APIAccessControlModalProps {
  isOpen: boolean;
  service: any;
  onClose: () => void;
  onSave: (accessRules: any[]) => void;
}

interface AccessRule {
  id: string;
  organization: string;
  apiKey: string;
  permissions: string[];
  rateLimit: number;
  status: 'active' | 'suspended';
  createdDate: string;
  expiryDate: string;
}

export function APIAccessControlModal({ isOpen, service, onClose, onSave }: APIAccessControlModalProps) {
  const [accessRules, setAccessRules] = useState<AccessRule[]>([
    {
      id: '1',
      organization: 'Bộ Công an',
      apiKey: 'api_key_******************abc123',
      permissions: ['READ', 'WRITE'],
      rateLimit: 1000,
      status: 'active',
      createdDate: '2024-01-15',
      expiryDate: '2025-01-15'
    },
    {
      id: '2',
      organization: 'Bộ Tài chính',
      apiKey: 'api_key_******************def456',
      permissions: ['READ'],
      rateLimit: 500,
      status: 'active',
      createdDate: '2024-02-10',
      expiryDate: '2025-02-10'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newRule, setNewRule] = useState({
    organization: '',
    permissions: [] as string[],
    rateLimit: 1000,
    expiryDate: ''
  });

  if (!isOpen || !service) return null;

  const generateApiKey = () => {
    return `api_key_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  };

  const handleAddRule = () => {
    const rule: AccessRule = {
      id: Date.now().toString(),
      organization: newRule.organization,
      apiKey: generateApiKey(),
      permissions: newRule.permissions,
      rateLimit: newRule.rateLimit,
      status: 'active',
      createdDate: new Date().toISOString().split('T')[0],
      expiryDate: newRule.expiryDate
    };
    setAccessRules([...accessRules, rule]);
    setShowAddForm(false);
    setNewRule({ organization: '', permissions: [], rateLimit: 1000, expiryDate: '' });
  };

  const togglePermission = (perm: string) => {
    if (newRule.permissions.includes(perm)) {
      setNewRule({ ...newRule, permissions: newRule.permissions.filter(p => p !== perm) });
    } else {
      setNewRule({ ...newRule, permissions: [...newRule.permissions, perm] });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-amber-600" />
            <div>
              <h2 className="text-slate-900">Quản lý quyền truy cập API</h2>
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

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-blue-700 mb-1">Tổng tổ chức</div>
              <div className="text-2xl text-blue-900">{accessRules.length}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-green-700 mb-1">Đang hoạt động</div>
              <div className="text-2xl text-green-900">
                {accessRules.filter(r => r.status === 'active').length}
              </div>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <div className="text-sm text-amber-700 mb-1">Tổng rate limit</div>
              <div className="text-2xl text-amber-900">
                {accessRules.reduce((sum, r) => sum + r.rateLimit, 0)}/h
              </div>
            </div>
          </div>

          {/* Add New Rule Button */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-amber-400 hover:text-amber-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Cấp quyền truy cập mới
            </button>
          )}

          {/* Add Form */}
          {showAddForm && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-4">
              <h4 className="text-slate-900">Cấp quyền truy cập mới</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Tổ chức/Đơn vị <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newRule.organization}
                    onChange={(e) => setNewRule({ ...newRule, organization: e.target.value })}
                    placeholder="Tên tổ chức"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Ngày hết hạn <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newRule.expiryDate}
                    onChange={(e) => setNewRule({ ...newRule, expiryDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Quyền truy cập <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  {['READ', 'WRITE', 'DELETE'].map(perm => (
                    <button
                      key={perm}
                      type="button"
                      onClick={() => togglePermission(perm)}
                      className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                        newRule.permissions.includes(perm)
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {perm}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Rate Limit (requests/hour)
                </label>
                <input
                  type="number"
                  value={newRule.rateLimit}
                  onChange={(e) => setNewRule({ ...newRule, rateLimit: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewRule({ organization: '', permissions: [], rateLimit: 1000, expiryDate: '' });
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddRule}
                  disabled={!newRule.organization || newRule.permissions.length === 0 || !newRule.expiryDate}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:cursor-not-allowed disabled:!bg-[#F1F5F9] disabled:!text-[#94A3B8] disabled:!border-[#E2E8F0] disabled:!shadow-none "
                >
                  Cấp quyền
                </button>
              </div>
            </div>
          )}

          {/* Access Rules List */}
          <div className="space-y-3">
            {accessRules.map((rule) => (
              <div key={rule.id} className="bg-white border border-slate-200 rounded-lg p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="text-slate-900">{rule.organization}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {rule.status === 'active' ? (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Hoạt động
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Tạm dừng
                          </span>
                        )}
                        <span className="text-xs text-slate-500">
                          Hết hạn: {rule.expiryDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setAccessRules(accessRules.filter(r => r.id !== rule.id))}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-slate-500 mb-1">API Key</div>
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-slate-400" />
                      <code className="text-xs text-slate-900 bg-slate-100 px-2 py-1 rounded">
                        {rule.apiKey}
                      </code>
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1">Rate Limit</div>
                    <div className="text-slate-900">{rule.rateLimit} requests/hour</div>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1">Quyền truy cập</div>
                    <div className="flex gap-2">
                      {rule.permissions.map(perm => (
                        <span key={perm} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1">Ngày cấp</div>
                    <div className="text-slate-900">{rule.createdDate}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={() => {
                onSave(accessRules);
                onClose();
              }}
              className="px-6 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
