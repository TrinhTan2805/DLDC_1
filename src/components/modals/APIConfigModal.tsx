import { X, Settings, Key, Shield, Bell, Zap, Server, Globe, Lock, Unlock, AlertTriangle, Check, Copy, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface APIConfigModalProps {
  isOpen: boolean;
  service: any;
  onClose: () => void;
  onSave: () => void;
}

export function APIConfigModal({ isOpen, service, onClose, onSave }: APIConfigModalProps) {
  const [activeTab, setActiveTab] = useState<'security' | 'rate-limit' | 'notification' | 'endpoint'>('security');
  const [apiKey, setApiKey] = useState('moj_live_k8s2f9h4j3k5l6m7n8p9q0r1s2t3u4v5w6x7y8z9');
  const [isEnabled, setIsEnabled] = useState(true);
  const [copied, setCopied] = useState(false);

  const [rateLimits, setRateLimits] = useState({
    perMinute: 100,
    perHour: 1000,
    perDay: 10000,
    perMonth: 300000
  });

  const [notifications, setNotifications] = useState({
    errorAlert: true,
    rateLimitWarning: true,
    dailyReport: false,
    securityAlert: true
  });

  const [ipWhitelist, setIpWhitelist] = useState([
    '103.56.158.0/24',
    '14.232.214.0/24',
    '171.244.0.0/16'
  ]);

  const [newIp, setNewIp] = useState('');

  if (!isOpen || !service) return null;

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateKey = () => {
    const confirmed = confirm('Bạn có chắc chắn muốn tạo lại API Key? Key cũ sẽ không còn hiệu lực.');
    if (confirmed) {
      const newKey = 'moj_live_' + Math.random().toString(36).substring(2, 40);
      setApiKey(newKey);
      alert('API Key mới đã được tạo thành công!');
    }
  };

  const handleAddIp = () => {
    if (newIp && !ipWhitelist.includes(newIp)) {
      setIpWhitelist([...ipWhitelist, newIp]);
      setNewIp('');
    }
  };

  const handleRemoveIp = (ip: string) => {
    setIpWhitelist(ipWhitelist.filter(i => i !== ip));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h2 className="text-slate-900">Cấu hình API</h2>
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

        {/* Tabs */}
        <div className="border-b border-slate-200 px-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'security'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-4 h-4" />
              Bảo mật
            </button>
            <button
              onClick={() => setActiveTab('rate-limit')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'rate-limit'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-4 h-4" />
              Rate Limiting
            </button>
            <button
              onClick={() => setActiveTab('notification')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'notification'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bell className="w-4 h-4" />
              Thông báo
            </button>
            <button
              onClick={() => setActiveTab('endpoint')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'endpoint'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Server className="w-4 h-4" />
              Endpoint
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* API Status */}
              <div>
                <h3 className="text-slate-900 mb-4">Trạng thái API</h3>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isEnabled ? (
                        <>
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Unlock className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <div className="text-sm text-slate-900">API đang hoạt động</div>
                            <div className="text-xs text-slate-600">Endpoint có thể truy cập</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <Lock className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <div className="text-sm text-slate-900">API đã tạm dừng</div>
                            <div className="text-xs text-slate-600">Endpoint không thể truy cập</div>
                          </div>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => setIsEnabled(!isEnabled)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        isEnabled
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {isEnabled ? 'Tạm dừng' : 'Kích hoạt'}
                    </button>
                  </div>
                </div>
              </div>

              {/* API Key Management */}
              <div>
                <h3 className="text-slate-900 mb-4">Quản lý API Key</h3>
                <div className="space-y-3">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm text-amber-900 mb-1">Lưu ý bảo mật</div>
                        <div className="text-xs text-amber-800">
                          API Key cung cấp quyền truy cập đầy đủ vào dữ liệu. Không chia sẻ hoặc public key này.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-400">Production Key</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleCopyApiKey}
                          className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 transition-colors"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3 h-3" />
                              Đã copy
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleRegenerateKey}
                          className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 transition-colors"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Tạo lại
                        </button>
                      </div>
                    </div>
                    <code className="text-sm text-green-400 break-all">{apiKey}</code>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                      <div className="text-xs text-slate-600 mb-1">Ngày tạo</div>
                      <div className="text-sm text-slate-900">15/01/2024</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                      <div className="text-xs text-slate-600 mb-1">Lần dùng cuối</div>
                      <div className="text-sm text-slate-900">09/12/2024</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                      <div className="text-xs text-slate-600 mb-1">Tổng lượt dùng</div>
                      <div className="text-sm text-slate-900">{service.requestCount.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* IP Whitelist */}
              <div>
                <h3 className="text-slate-900 mb-4">IP Whitelist</h3>
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm text-blue-900 mb-1">Kiểm soát truy cập theo IP</div>
                        <div className="text-xs text-blue-800">
                          Chỉ cho phép các IP trong danh sách truy cập API
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newIp}
                      onChange={(e) => setNewIp(e.target.value)}
                      placeholder="VD: 192.168.1.0/24"
                      className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    />
                    <button
                      onClick={handleAddIp}
                      className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Thêm IP
                    </button>
                  </div>

                  <div className="space-y-2">
                    {ipWhitelist.map((ip, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg"
                      >
                        <code className="text-sm text-slate-900">{ip}</code>
                        <button
                          onClick={() => handleRemoveIp(ip)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rate Limit Tab */}
          {activeTab === 'rate-limit' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-slate-900 mb-4">Cấu hình giới hạn tần suất</h3>
                <p className="text-sm text-slate-600 mb-6">
                  Thiết lập số lượng request tối đa để bảo vệ hệ thống khỏi quá tải
                </p>

                <div className="space-y-4">
                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <label className="block text-sm text-slate-700 mb-3">
                      Giới hạn mỗi phút
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="10"
                        max="500"
                        step="10"
                        value={rateLimits.perMinute}
                        onChange={(e) => setRateLimits({...rateLimits, perMinute: parseInt(e.target.value)})}
                        className="flex-1"
                      />
                      <div className="w-24">
                        <input
                          type="number"
                          value={rateLimits.perMinute}
                          onChange={(e) => setRateLimits({...rateLimits, perMinute: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-center"
                        />
                      </div>
                      <span className="text-sm text-slate-600">req/min</span>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <label className="block text-sm text-slate-700 mb-3">
                      Giới hạn mỗi giờ
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="100"
                        max="5000"
                        step="100"
                        value={rateLimits.perHour}
                        onChange={(e) => setRateLimits({...rateLimits, perHour: parseInt(e.target.value)})}
                        className="flex-1"
                      />
                      <div className="w-24">
                        <input
                          type="number"
                          value={rateLimits.perHour}
                          onChange={(e) => setRateLimits({...rateLimits, perHour: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-center"
                        />
                      </div>
                      <span className="text-sm text-slate-600">req/hour</span>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <label className="block text-sm text-slate-700 mb-3">
                      Giới hạn mỗi ngày
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="1000"
                        max="50000"
                        step="1000"
                        value={rateLimits.perDay}
                        onChange={(e) => setRateLimits({...rateLimits, perDay: parseInt(e.target.value)})}
                        className="flex-1"
                      />
                      <div className="w-24">
                        <input
                          type="number"
                          value={rateLimits.perDay}
                          onChange={(e) => setRateLimits({...rateLimits, perDay: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-center"
                        />
                      </div>
                      <span className="text-sm text-slate-600">req/day</span>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <label className="block text-sm text-slate-700 mb-3">
                      Giới hạn mỗi tháng
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="10000"
                        max="1000000"
                        step="10000"
                        value={rateLimits.perMonth}
                        onChange={(e) => setRateLimits({...rateLimits, perMonth: parseInt(e.target.value)})}
                        className="flex-1"
                      />
                      <div className="w-24">
                        <input
                          type="number"
                          value={rateLimits.perMonth}
                          onChange={(e) => setRateLimits({...rateLimits, perMonth: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-center"
                        />
                      </div>
                      <span className="text-sm text-slate-600">req/month</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-sm text-green-900 mb-2">Cấu hình hiện tại</div>
                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div>
                      <div className="text-2xl text-green-900">{rateLimits.perMinute}</div>
                      <div className="text-xs text-green-700">req/phút</div>
                    </div>
                    <div>
                      <div className="text-2xl text-green-900">{rateLimits.perHour.toLocaleString()}</div>
                      <div className="text-xs text-green-700">req/giờ</div>
                    </div>
                    <div>
                      <div className="text-2xl text-green-900">{rateLimits.perDay.toLocaleString()}</div>
                      <div className="text-xs text-green-700">req/ngày</div>
                    </div>
                    <div>
                      <div className="text-2xl text-green-900">{rateLimits.perMonth.toLocaleString()}</div>
                      <div className="text-xs text-green-700">req/tháng</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notification Tab */}
          {activeTab === 'notification' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-slate-900 mb-4">Cấu hình thông báo</h3>
                <p className="text-sm text-slate-600 mb-6">
                  Nhận thông báo qua email về các sự kiện quan trọng
                </p>

                <div className="space-y-3">
                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <Bell className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                          <div className="text-sm text-slate-900 mb-1">Cảnh báo lỗi</div>
                          <div className="text-xs text-slate-600">
                            Nhận thông báo khi có lỗi 500 hoặc downtime
                          </div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.errorAlert}
                          onChange={(e) => setNotifications({...notifications, errorAlert: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <div className="text-sm text-slate-900 mb-1">Cảnh báo vượt rate limit</div>
                          <div className="text-xs text-slate-600">
                            Nhận thông báo khi đạt 80% giới hạn
                          </div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.rateLimitWarning}
                          onChange={(e) => setNotifications({...notifications, rateLimitWarning: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <Server className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <div className="text-sm text-slate-900 mb-1">Báo cáo hàng ngày</div>
                          <div className="text-xs text-slate-600">
                            Nhận báo cáo tổng hợp mỗi ngày lúc 8:00 AM
                          </div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.dailyReport}
                          onChange={(e) => setNotifications({...notifications, dailyReport: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div>
                          <div className="text-sm text-slate-900 mb-1">Cảnh báo bảo mật</div>
                          <div className="text-xs text-slate-600">
                            Nhận thông báo về truy cập bất thường
                          </div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.securityAlert}
                          onChange={(e) => setNotifications({...notifications, securityAlert: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <label className="block text-sm text-slate-700 mb-3">
                    Email nhận thông báo
                  </label>
                  <input
                    type="email"
                    defaultValue="admin@moj.gov.vn"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Endpoint Tab */}
          {activeTab === 'endpoint' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-slate-900 mb-4">Cấu hình Endpoint</h3>
                <p className="text-sm text-slate-600 mb-6">
                  Thiết lập thông tin endpoint và tham số
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">
                      Base URL
                    </label>
                    <input
                      type="text"
                      defaultValue="https://api.dldc.moj.gov.vn"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm bg-[#F0F0F0]"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 mb-2">
                      Endpoint Path
                    </label>
                    <input
                      type="text"
                      defaultValue={service.apiEndpoint}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-700 mb-2">
                        HTTP Method
                      </label>
                      <select
                        defaultValue={service.method}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-slate-700 mb-2">
                        Content-Type
                      </label>
                      <select
                        defaultValue="application/json"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="application/json">application/json</option>
                        <option value="application/xml">application/xml</option>
                        <option value="text/plain">text/plain</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 mb-2">
                      Timeout (ms)
                    </label>
                    <input
                      type="number"
                      defaultValue="30000"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="bg-slate-900 rounded-lg p-4">
                    <div className="text-xs text-slate-400 mb-2">Full Endpoint URL</div>
                    <code className="text-sm text-green-400">
                      https://api.dldc.moj.gov.vn{service.apiEndpoint}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              onSave();
              onClose();
            }}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Lưu cấu hình
          </button>
        </div>
      </div>
    </div>
  );
}
