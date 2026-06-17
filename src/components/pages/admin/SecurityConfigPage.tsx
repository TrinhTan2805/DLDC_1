import { useState } from 'react';
import { Shield, Clock, RotateCcw, Save, Database, UploadCloud, List, Wrench, EyeOff } from 'lucide-react';

interface SecurityConfig {
  // Cấu hình tải lên
  maxUploadSizeMB: number;
  
  // Cấu hình hiển thị
  defaultRecordsPerPage: number;
  
  // Cấu hình bảo trì
  maintenanceMode: boolean;

  // Cấu hình giới hạn đăng nhập sai
  maxLoginAttempts: number;
  loginAttemptTimeWindowMinutes: number;

  // Cấu hình phiên làm việc
  sessionTimeoutMinutes: number;
  
  // Cấu hình sao lưu dự phòng
  enableAutoBackup: boolean;
  backupSchedule: 'daily' | 'weekly' | 'monthly';
  backupDayOfWeek: number;
  backupDayOfMonth: number;
  backupTime: string;
  backupRetentionDays: number;
  backupLocation: string;

  // Cấu hình thuật toán làm mờ dữ liệu
  blurringAlgorithms: {
    partial: boolean;
    redacted: boolean;
    hashed: boolean;
    nullify: boolean;
  };
}

const defaultConfig: SecurityConfig = {
  maxUploadSizeMB: 10,
  defaultRecordsPerPage: 10,
  maintenanceMode: false,
  maxLoginAttempts: 5,
  loginAttemptTimeWindowMinutes: 15,
  sessionTimeoutMinutes: 30,
  enableAutoBackup: true,
  backupSchedule: 'daily',
  backupDayOfWeek: 4,
  backupDayOfMonth: 1,
  backupTime: '02:00',
  backupRetentionDays: 30,
  backupLocation: 'S3 Bucket',
  blurringAlgorithms: {
    partial: true,
    redacted: true,
    hashed: true,
    nullify: true,
  },
};

export function SecurityConfigPage() {
  const [config, setConfig] = useState<SecurityConfig>(() => {
    const saved = localStorage.getItem('security_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaultConfig,
          ...parsed,
          blurringAlgorithms: {
            ...defaultConfig.blurringAlgorithms,
            ...(parsed.blurringAlgorithms || {})
          }
        };
      } catch (e) {
        console.error(e);
      }
    }
    return defaultConfig;
  });
  const [hasChanges, setHasChanges] = useState(false);

  const handleConfigChange = (key: keyof SecurityConfig, value: any) => {
    setConfig({ ...config, [key]: value });
    setHasChanges(true);
  };

  const handleAlgorithmToggle = (key: keyof SecurityConfig['blurringAlgorithms']) => {
    setConfig(prev => ({
      ...prev,
      blurringAlgorithms: {
        ...prev.blurringAlgorithms,
        [key]: !prev.blurringAlgorithms[key]
      }
    }));
    setHasChanges(true);
  };

  const handleResetToDefault = () => {
    if (confirm('Bạn có chắc chắn muốn đặt lại về cấu hình mặc định?')) {
      setConfig(defaultConfig);
      localStorage.setItem('security_config', JSON.stringify(defaultConfig));
      setHasChanges(true);
    }
  };

  const handleSaveConfig = () => {
    // Lưu cấu hình
    console.log('Saving config:', config);
    localStorage.setItem('security_config', JSON.stringify(config));
    alert('Đã lưu cấu hình thành công!');
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-slate-900 mb-2">Thiết lập cấu hình hệ thống</h1>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleResetToDefault}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Đặt lại mặc định
            </button>
            <button
              onClick={handleSaveConfig}
              disabled={!hasChanges}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Lưu cấu hình
            </button>
          </div>
        </div>
      </div>

      {/* Cấu hình tải lên */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <UploadCloud className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-slate-900">Cấu hình giới hạn dung lượng tải lên</h2>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <label className="text-sm text-slate-900 block mb-1">
                  Giới hạn dung lượng tối đa cho mỗi tệp tin (MB)
                </label>
                <p className="text-xs text-slate-500">
                  Quy định kích thước tệp tin lớn nhất được phép tải lên hệ thống
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <input
                  type="number"
                  value={config.maxUploadSizeMB}
                  onChange={(e) => handleConfigChange('maxUploadSizeMB', parseInt(e.target.value) || 0)}
                  className="w-20 px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                  min="1"
                  max="100"
                />
                <span className="text-sm text-slate-600">MB</span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={config.maxUploadSizeMB}
              onChange={(e) => handleConfigChange('maxUploadSizeMB', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb-blue"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>1 MB</span>
              <span>100 MB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cấu hình hiển thị */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
            <List className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-slate-900">Cấu hình hiển thị danh sách</h2>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <label className="text-sm text-slate-900 block mb-1">
                  Số lượng bản ghi hiển thị mặc định trên mỗi trang
                </label>
                <p className="text-xs text-slate-500">
                  Số lượng dòng dữ liệu được hiển thị trên một trang bảng
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <select
                  value={config.defaultRecordsPerPage}
                  onChange={(e) => handleConfigChange('defaultRecordsPerPage', parseInt(e.target.value))}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value={10}>10 bản ghi/trang</option>
                  <option value={20}>20 bản ghi/trang</option>
                  <option value={50}>50 bản ghi/trang</option>
                  <option value={100}>100 bản ghi/trang</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cấu hình chế độ bảo trì */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
            <Wrench className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-slate-900">Cấu hình chế độ bảo trị hệ thống</h2>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <label className="text-sm text-slate-900 block mb-1">
                  Bật/Tắt chế độ bảo trì
                </label>
                <p className="text-xs text-slate-500">
                  Khi bật, hệ thống sẽ tạm dừng hoạt động và hiển thị thông báo bảo trì cho người dùng
                </p>
              </div>
              <button
                onClick={() => handleConfigChange('maintenanceMode', !config.maintenanceMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  config.maintenanceMode ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cấu hình giới hạn đăng nhập sai */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-red-600" />
          </div>
          <h2 className="text-slate-900">Cấu hình giới hạn đăng nhập sai</h2>
        </div>

        <div className="space-y-6">
          {/* Số lần sai mật khẩu tối đa */}
          <div>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <label className="text-sm text-slate-900 block mb-1">
                  Số lần sai mật khẩu tối đa
                </label>
                <p className="text-xs text-slate-500">
                  Số lần đăng nhập sai tối đa trước khi khóa tài khoản tạm thời
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <input
                  type="number"
                  value={config.maxLoginAttempts}
                  onChange={(e) => handleConfigChange('maxLoginAttempts', parseInt(e.target.value) || 0)}
                  className="w-20 px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                  min="3"
                  max="10"
                />
                <span className="text-sm text-slate-600">lần</span>
              </div>
            </div>
            <input
              type="range"
              min="3"
              max="10"
              step="1"
              value={config.maxLoginAttempts}
              onChange={(e) => handleConfigChange('maxLoginAttempts', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb-blue"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>3 lần</span>
              <span>10 lần</span>
            </div>
          </div>

          {/* Giới hạn số lần đăng nhập sai trong khoảng thời gian */}
          <div>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <label className="text-sm text-slate-900 block mb-1">
                  Giới hạn số lần đăng nhập sai trong khoảng thời gian (phút)
                </label>
                <p className="text-xs text-slate-500">
                  Khoảng thời gian các lần đăng nhập sai liên tiếp được tính cộng dồn
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <input
                  type="number"
                  value={config.loginAttemptTimeWindowMinutes}
                  onChange={(e) => handleConfigChange('loginAttemptTimeWindowMinutes', parseInt(e.target.value) || 0)}
                  className="w-20 px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                  min="5"
                  max="60"
                />
                <span className="text-sm text-slate-600">phút</span>
              </div>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={config.loginAttemptTimeWindowMinutes}
              onChange={(e) => handleConfigChange('loginAttemptTimeWindowMinutes', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb-blue"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>5 phút</span>
              <span>60 phút</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cấu hình phiên làm việc */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
          <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <h2 className="text-slate-900">Cấu hình phiên làm việc</h2>
        </div>

        <div className="space-y-6">
          {/* Thời gian timeout phiên làm việc */}
          <div>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <label className="text-sm text-slate-900 block mb-1">
                  Thời gian timeout phiên làm việc (phút)
                </label>
                <p className="text-xs text-slate-500">
                  Thời gian không hoạt động trước khi đăng xuất tự động người dùng
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <input
                  type="number"
                  value={config.sessionTimeoutMinutes}
                  onChange={(e) => handleConfigChange('sessionTimeoutMinutes', parseInt(e.target.value) || 0)}
                  className="w-20 px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                  min="5"
                  max="120"
                />
                <span className="text-sm text-slate-600">phút</span>
              </div>
            </div>
            <input
              type="range"
              min="5"
              max="120"
              step="5"
              value={config.sessionTimeoutMinutes}
              onChange={(e) => handleConfigChange('sessionTimeoutMinutes', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb-blue"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>5 phút</span>
              <span>120 phút</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cấu hình sao lưu dự phòng */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
            <Save className="w-5 h-5 text-red-600" />
          </div>
          <h2 className="text-slate-900">Cấu hình sao lưu dự phòng</h2>
        </div>

        <div className="space-y-6">
          {/* Bật tự động sao lưu */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <label className="text-sm text-slate-900 block mb-1">
                  Bật tự động sao lưu
                </label>
                <p className="text-xs text-slate-500">
                  Tự động sao lưu dữ liệu hệ thống theo lịch trình
                </p>
              </div>
              <button
                onClick={() => handleConfigChange('enableAutoBackup', !config.enableAutoBackup)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  config.enableAutoBackup ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.enableAutoBackup ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Tần suất sao lưu */}
          <div>
            <label className="text-sm text-slate-900 block mb-1">
              Tần suất sao lưu tự động
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Lịch trình sao lưu dữ liệu định kỳ
            </p>
            <div className="grid grid-cols-3 gap-3">
              {(['daily', 'weekly', 'monthly'] as const).map((val) => (
                <button
                  key={val}
                  onClick={() => handleConfigChange('backupSchedule', val)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all text-sm ${
                    config.backupSchedule === val
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  {val === 'daily' ? 'Hàng ngày' : val === 'weekly' ? 'Hàng tuần' : 'Hàng tháng'}
                </button>
              ))}
            </div>

            {config.backupSchedule === 'weekly' && (
              <div className="mt-4">
                <label className="text-sm text-slate-900 block mb-2">
                  Chọn ngày trong tuần (Thứ)
                </label>
                <select
                  value={config.backupDayOfWeek}
                  onChange={(e) => handleConfigChange('backupDayOfWeek', parseInt(e.target.value))}
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                >
                  {[['2','Thứ 2'],['3','Thứ 3'],['4','Thứ 4'],['5','Thứ 5'],['6','Thứ 6'],['7','Thứ 7'],['8','Chủ nhật']].map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
            )}

            {config.backupSchedule === 'monthly' && (
              <div className="mt-4">
                <label className="text-sm text-slate-900 block mb-2">
                  Chọn ngày trong tháng
                </label>
                <select
                  value={config.backupDayOfMonth}
                  onChange={(e) => handleConfigChange('backupDayOfMonth', parseInt(e.target.value))}
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                >
                  {Array.from({ length: 28 }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d}>Ngày {d}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="mt-4">
              <label className="text-sm text-slate-900 block mb-2">
                Thời gian sao lưu
              </label>
              <p className="text-xs text-slate-500 mb-2">
                Thời điểm trong ngày để thực hiện sao lưu tự động
              </p>
              <input
                type="time"
                value={config.backupTime}
                onChange={(e) => handleConfigChange('backupTime', e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Thời gian giữ lại sao lưu */}
          <div>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <label className="text-sm text-slate-900 block mb-1">
                  Thời gian giữ lại sao lưu (ngày)
                </label>
                <p className="text-xs text-slate-500">
                  Số ngày giữ lại các bản sao lưu trước khi xóa
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <input
                  type="number"
                  value={config.backupRetentionDays}
                  onChange={(e) => handleConfigChange('backupRetentionDays', parseInt(e.target.value) || 0)}
                  className="w-20 px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                  min="1"
                  max="365"
                />
                <span className="text-sm text-slate-600">ngày</span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="365"
              step="1"
              value={config.backupRetentionDays}
              onChange={(e) => handleConfigChange('backupRetentionDays', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb-blue"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>1 ngày</span>
              <span>365 ngày</span>
            </div>
          </div>

          {/* Vị trí lưu trữ sao lưu */}
          <div>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <label className="text-sm text-slate-900 block mb-1">
                  Vị trí lưu trữ sao lưu
                </label>
                <p className="text-xs text-slate-500">
                  Địa điểm lưu trữ các bản sao lưu
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <input
                  type="text"
                  value={config.backupLocation}
                  onChange={(e) => handleConfigChange('backupLocation', e.target.value)}
                  className="w-40 px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cấu hình thuật toán tự động làm mờ dữ liệu */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <EyeOff className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-slate-900">Cấu hình thuật toán tự động làm mờ dữ liệu</h2>
        </div>

        <div className="space-y-6">
          <p className="text-xs text-slate-500">
            Chọn Kích hoạt (Active) hoặc Vô hiệu hóa (Inactive) các thuật toán tự động làm mờ dữ liệu. 
            Các thuật toán được kích hoạt sẽ khả dụng khi người dùng thiết lập phân quyền khai thác dữ liệu.
          </p>

          <div className="divide-y divide-slate-100">
            {/* Algorithm 1: Partial Blurring */}
            <div className="flex items-center justify-between py-4 first:pt-0">
              <div className="flex-1">
                <label className="text-sm font-semibold text-slate-900 block mb-1">
                  Làm mờ một phần (***-***-1234)
                </label>
                <p className="text-xs text-slate-500">
                  Ẩn một phần thông tin nhạy cảm của dữ liệu, giữ lại các ký tự cuối (Ví dụ: số CCCD, số điện thoại)
                </p>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.blurringAlgorithms.partial ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                  {config.blurringAlgorithms.partial ? 'Active' : 'Inactive'}
                </span>
                <button
                  onClick={() => handleAlgorithmToggle('partial')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    config.blurringAlgorithms.partial ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      config.blurringAlgorithms.partial ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Algorithm 2: Full Redacted */}
            <div className="flex items-center justify-between py-4">
              <div className="flex-1">
                <label className="text-sm font-semibold text-slate-900 block mb-1">
                  Che khuất hoàn toàn ([REDACTED])
                </label>
                <p className="text-xs text-slate-500">
                  Thay thế toàn bộ giá trị dữ liệu bằng nhãn [REDACTED] để bảo mật tuyệt đối thông tin
                </p>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.blurringAlgorithms.redacted ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                  {config.blurringAlgorithms.redacted ? 'Active' : 'Inactive'}
                </span>
                <button
                  onClick={() => handleAlgorithmToggle('redacted')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    config.blurringAlgorithms.redacted ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      config.blurringAlgorithms.redacted ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Algorithm 3: Hashed */}
            <div className="flex items-center justify-between py-4">
              <div className="flex-1">
                <label className="text-sm font-semibold text-slate-900 block mb-1">
                  Băm dữ liệu (Hashed)
                </label>
                <p className="text-xs text-slate-500">
                  Mã hóa một chiều giá trị dữ liệu bằng thuật toán băm bảo mật (ví dụ SHA-256)
                </p>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.blurringAlgorithms.hashed ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                  {config.blurringAlgorithms.hashed ? 'Active' : 'Inactive'}
                </span>
                <button
                  onClick={() => handleAlgorithmToggle('hashed')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    config.blurringAlgorithms.hashed ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      config.blurringAlgorithms.hashed ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Algorithm 4: Nullify */}
            <div className="flex items-center justify-between py-4 last:pb-0">
              <div className="flex-1">
                <label className="text-sm font-semibold text-slate-900 block mb-1">
                  Trả về Null/Rỗng
                </label>
                <p className="text-xs text-slate-500">
                  Xóa bỏ hoàn toàn giá trị dữ liệu nhạy cảm và trả về giá trị null hoặc chuỗi rỗng
                </p>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.blurringAlgorithms.nullify ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                  {config.blurringAlgorithms.nullify ? 'Active' : 'Inactive'}
                </span>
                <button
                  onClick={() => handleAlgorithmToggle('nullify')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    config.blurringAlgorithms.nullify ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      config.blurringAlgorithms.nullify ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save reminder */}
      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-yellow-600">⚠</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-yellow-800">
                Bạn có thay đổi chưa được lưu. Nhấn <strong>"Lưu cấu hình"</strong> để áp dụng các thay đổi.
              </p>
            </div>
            <button
              onClick={handleSaveConfig}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center gap-2 flex-shrink-0"
            >
              <Save className="w-4 h-4" />
              Lưu ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}