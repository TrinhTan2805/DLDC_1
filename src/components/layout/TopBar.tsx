import { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Settings, 
  User, 
  ChevronDown,
  LogOut,
  UserCircle,
  KeyRound,
  Image,
  History as HistoryIcon,
  FileText,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  Globe,
  Lock,
  Monitor,
  Database,
  FileSearch,
  ToggleLeft,
  Mail,
  Volume2,
  Shield,
  Calendar,
  Download,
  Check,
  X,
  Smartphone,
  Laptop,
  HardDrive,
  TrendingUp
} from 'lucide-react';
import { notificationCatalog, NotificationItem } from '../../data/notificationCatalog';

interface TopBarProps {
  title: string;
  description: string;
  onUserMenuClick?: (action: 'profile' | 'change-password' | 'change-background' | 'access-history' | 'action-history' | 'logout') => void;
  currentPage?: string;
  breadcrumb?: string[];
  onNavigate?: (page: string) => void;
}

type Notification = NotificationItem;

// 5 thông báo gần nhất trong danh mục — chỉ 3 loại: success/error/info (không phân theo mức độ ưu tiên)
const mockNotifications: Notification[] = notificationCatalog.slice(0, 5);

type SettingsModal = 'language' | 'theme' | 'format' | 'email' | 'sound' | '2fa' | 'session' | 'backup' | 'database' | 'logs' | null;

export function TopBar({ title, description, onUserMenuClick, currentPage, breadcrumb, onNavigate }: TopBarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsModal, setSettingsModal] = useState<SettingsModal>(null);
  const [notifications, setNotifications] = useState(mockNotifications);
  const menuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (action: 'profile' | 'change-password' | 'change-background' | 'access-history' | 'action-history' | 'logout') => {
    setShowUserMenu(false);
    onUserMenuClick?.(action);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
  };

  const getNotificationBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'error':
        return 'bg-red-50';
      case 'warning':
        return 'bg-amber-50';
      case 'info':
        return 'bg-blue-50';
      case 'success':
        return 'bg-green-50';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const openSettingsModal = (modal: SettingsModal) => {
    setSettingsModal(modal);
    setShowSettings(false);
  };

  const closeSettingsModal = () => {
    setSettingsModal(null);
  };

  return (
    <>
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      {/* Page Title - Breadcrumb */}
      <div className="flex-1">
        {breadcrumb && breadcrumb.length > 0 ? (
          <div className="flex items-center gap-2 text-sm">
            {breadcrumb.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && <span className="text-slate-400">/</span>}
                <span className={index === breadcrumb.length - 1 ? "text-slate-900 font-medium" : "text-slate-500"}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <h1 className="text-slate-900 text-lg">{title}</h1>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 ml-6">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button 
            className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1">
                  {unreadCount}
                </span>
              </>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-slate-200 z-50 max-h-[600px] flex flex-col">
              {/* Header */}
              <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-slate-900">Thông báo</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Bạn có {unreadCount} thông báo chưa đọc
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Đọc tất cả
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="overflow-y-auto max-h-[480px]">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-slate-500">
                    <Bell className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>Không có thông báo mới</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${
                          !notification.isRead ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${getNotificationBgColor(notification.type)} flex items-center justify-center`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm text-slate-900">
                                {notification.title}
                              </p>
                              {!notification.isRead && (
                                <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-1.5"></span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                              <Clock className="w-3 h-3" />
                              <span>{notification.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-3 border-t border-slate-200">
                  <button
                    onClick={() => { setShowNotifications(false); onNavigate?.('notifications'); }}
                    className="w-full text-center text-sm text-blue-600 hover:text-blue-700"
                  >
                    Xem tất cả thông báo
                  </button>
                </div>
              )}
            </div>
          )}
        </div>



        {/* Divider */}
        <div className="w-px h-6 bg-slate-200"></div>

        {/* User Profile with Dropdown */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 hover:bg-slate-50 rounded-lg px-3 py-2 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white">
              <User className="w-5 h-5" />
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-sm text-slate-900">Nguyễn Văn A</div>
              <div className="text-xs text-slate-500">Quản trị viên</div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-900">Nguyễn Văn A</div>
                    <div className="text-xs text-slate-500">admin@moj.gov.vn</div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={() => handleMenuClick('profile')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <UserCircle className="w-4 h-4 text-slate-500" />
                  <span>Xem thông tin chi tiết</span>
                </button>

                <button
                  onClick={() => handleMenuClick('change-password')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <KeyRound className="w-4 h-4 text-slate-500" />
                  <span>Đổi mật khẩu</span>
                </button>

                <button
                  onClick={() => handleMenuClick('change-background')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Image className="w-4 h-4 text-slate-500" />
                  <span>Thay hình nền</span>
                </button>

                <div className="my-2 border-t border-slate-200"></div>

                <button
                  onClick={() => handleMenuClick('access-history')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <HistoryIcon className="w-4 h-4 text-slate-500" />
                  <span>Xem lịch sử truy cập</span>
                </button>

                <button
                  onClick={() => handleMenuClick('action-history')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Xem lịch sử thao tác</span>
                </button>

                <div className="my-2 border-t border-slate-200"></div>

                <button
                  onClick={() => handleMenuClick('logout')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Modals */}
      {/* Language & Timezone Modal */}
      {settingsModal === 'language' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-slate-900">Ngôn ngữ & Múi giờ</h2>
              </div>
              <button onClick={closeSettingsModal} className="text-slate-400 hover:text-slate-600" title="Đóng" aria-label="Đóng">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">Ngôn ngữ</label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-slate-700 mb-2">Múi giờ</label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="gmt+7">GMT+7 (Hà Nội, Bangkok)</option>
                  <option value="gmt+8">GMT+8 (Singapore, Hong Kong)</option>
                  <option value="gmt+9">GMT+9 (Tokyo, Seoul)</option>
                  <option value="utc">UTC</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={closeSettingsModal} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                Hủy
              </button>
              <button onClick={closeSettingsModal} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Theme Modal */}
      {settingsModal === 'theme' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-slate-900">Giao diện</h2>
              </div>
              <button onClick={closeSettingsModal} className="text-slate-400 hover:text-slate-600" title="Đóng" aria-label="Đóng">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">Chế độ hiển thị</label>
                <div className="grid grid-cols-3 gap-3">
                  <button className="px-4 py-3 border-2 border-blue-600 bg-blue-50 rounded-lg text-sm">
                    <div className="text-blue-900">☀️ Sáng</div>
                  </button>
                  <button className="px-4 py-3 border-2 border-slate-300 rounded-lg text-sm hover:border-blue-600">
                    <div className="text-slate-700">🌙 Tối</div>
                  </button>
                  <button className="px-4 py-3 border-2 border-slate-300 rounded-lg text-sm hover:border-blue-600">
                    <div className="text-slate-700">⚙️ Tự động</div>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-slate-700 mb-2">Màu chủ đạo</label>
                <div className="flex gap-3">
                  <button title="Hành động" aria-label="Hành động" className="w-12 h-12 bg-blue-600 rounded-lg border-2 border-blue-800"></button>
                  <button title="Hành động" aria-label="Hành động" className="w-12 h-12 bg-green-600 rounded-lg border-2 border-transparent hover:border-green-800"></button>
                  <button title="Hành động" aria-label="Hành động" className="w-12 h-12 bg-purple-600 rounded-lg border-2 border-transparent hover:border-purple-800"></button>
                  <button title="Hành động" aria-label="Hành động" className="w-12 h-12 bg-orange-600 rounded-lg border-2 border-transparent hover:border-orange-800"></button>
                  <button title="Hành động" aria-label="Hành động" className="w-12 h-12 bg-red-600 rounded-lg border-2 border-transparent hover:border-red-800"></button>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={closeSettingsModal} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                Hủy
              </button>
              <button onClick={closeSettingsModal} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Format Modal */}
      {settingsModal === 'format' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-slate-900">Định dạng hiển thị</h2>
              </div>
              <button onClick={closeSettingsModal} className="text-slate-400 hover:text-slate-600" title="Đóng" aria-label="Đóng">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">Định dạng ngày</label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="dd/mm/yyyy">DD/MM/YYYY (10/12/2024)</option>
                  <option value="mm/dd/yyyy">MM/DD/YYYY (12/10/2024)</option>
                  <option value="yyyy-mm-dd">YYYY-MM-DD (2024-12-10)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-slate-700 mb-2">Định dạng giờ</label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="24h">24 giờ (14:30)</option>
                  <option value="12h">12 giờ (2:30 PM)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-slate-700 mb-2">Định dạng số</label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="comma">1,234.56</option>
                  <option value="dot">1.234,56</option>
                  <option value="space">1 234.56</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={closeSettingsModal} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                Hủy
              </button>
              <button onClick={closeSettingsModal} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {settingsModal === 'email' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-slate-900">Email thông báo</h2>
              </div>
              <button onClick={closeSettingsModal} className="text-slate-400 hover:text-slate-600" title="Đóng" aria-label="Đóng">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <div className="text-sm text-slate-900">Bật thông báo email</div>
                  <div className="text-xs text-slate-500 mt-1">Nhận thông báo qua email</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">Email nhận thông báo</label>
                <input 
                  type="email"
                  defaultValue="admin@moj.gov.vn"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <div className="text-sm text-slate-700 mb-2">Loại thông báo nhận</div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm text-slate-700">Lỗi hệ thống</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm text-slate-700">Cảnh báo dữ liệu</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-slate-700">Thông tin cập nhật</span>
                </label>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={closeSettingsModal} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                Hủy
              </button>
              <button onClick={closeSettingsModal} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sound Modal */}
      {settingsModal === 'sound' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-50 rounded-lg flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-cyan-600" />
                </div>
                <h2 className="text-slate-900">Cài đặt âm thanh</h2>
              </div>
              <button onClick={closeSettingsModal} className="text-slate-400 hover:text-slate-600" title="Đóng" aria-label="Đóng">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <div className="text-sm text-slate-900">Bật âm báo</div>
                  <div className="text-xs text-slate-500 mt-1">Phát âm thanh khi có thông báo</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">Âm lượng</label>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="70"
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Nhỏ</span>
                  <span>Vừa</span>
                  <span>Lớn</span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">Loại âm thanh</label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="default">Mặc định</option>
                  <option value="soft">Nhẹ nhàng</option>
                  <option value="alert">Cảnh báo</option>
                  <option value="bell">Chuông</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={closeSettingsModal} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                Hủy
              </button>
              <button onClick={closeSettingsModal} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Modal */}
      {settingsModal === '2fa' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-slate-900">Xác thực 2 yếu tố</h2>
              </div>
              <button onClick={closeSettingsModal} className="text-slate-400 hover:text-slate-600" title="Đóng" aria-label="Đóng">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-sm text-green-900">2FA đã được kích hoạt</div>
                    <div className="text-xs text-green-700 mt-1">Tài khoản của bạn được bảo mật</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg text-center">
                <div className="w-32 h-32 bg-white border-2 border-slate-300 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <div className="text-xs text-slate-400">QR Code</div>
                </div>
                <p className="text-xs text-slate-600">Quét mã QR bằng ứng dụng Google Authenticator</p>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">Mã dự phòng (Backup codes)</label>
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg font-mono text-xs">
                  <div>XXXX-XXXX-XXXX</div>
                  <div>XXXX-XXXX-XXXX</div>
                  <div>XXXX-XXXX-XXXX</div>
                  <div>XXXX-XXXX-XXXX</div>
                </div>
                <button className="text-xs text-blue-600 hover:text-blue-700 mt-2">
                  Tạo mã dự phòng mới
                </button>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={closeSettingsModal} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Management Modal */}
      {settingsModal === 'session' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-slate-900">Quản lý phiên đăng nhập</h2>
              </div>
              <button onClick={closeSettingsModal} className="text-slate-400 hover:text-slate-600" title="Đóng" aria-label="Đóng">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">Thời gian timeout (phút)</label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="15">15 phút</option>
                  <option value="30" selected>30 phút</option>
                  <option value="60">60 phút</option>
                  <option value="120">120 phút</option>
                  <option value="0">Không giới hạn</option>
                </select>
              </div>

              <div>
                <div className="text-sm text-slate-700 mb-3">Thiết bị đang đăng nhập</div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border border-green-200 bg-green-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Laptop className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-slate-900">Windows PC - Chrome</div>
                      <div className="text-xs text-slate-600 mt-1">IP: 192.168.1.100 • Hiện tại</div>
                    </div>
                    <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">Đang dùng</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-slate-900">iPhone 14 - Safari</div>
                      <div className="text-xs text-slate-600 mt-1">IP: 192.168.1.105 • 2 giờ trước</div>
                    </div>
                    <button className="text-xs text-red-600 hover:text-red-700">Đăng xuất</button>
                  </div>

                  <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Laptop className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-slate-900">MacBook Pro - Safari</div>
                      <div className="text-xs text-slate-600 mt-1">IP: 192.168.1.102 • 1 ngày trước</div>
                    </div>
                    <button className="text-xs text-red-600 hover:text-red-700">Đăng xuất</button>
                  </div>
                </div>
              </div>

              <button className="w-full py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                Đăng xuất tất cả thiết bị khác
              </button>
            </div>

            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={closeSettingsModal} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                Đóng
              </button>
              <button onClick={closeSettingsModal} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backup Modal */}
      {settingsModal === 'backup' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <Download className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-slate-900">Sao lưu & Phục hồi</h2>
              </div>
              <button onClick={closeSettingsModal} className="text-slate-400 hover:text-slate-600" title="Đóng" aria-label="Đóng">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <div className="text-sm text-slate-900">Sao lưu tự động</div>
                  <div className="text-xs text-slate-500 mt-1">Tự động backup hàng ngày lúc 2:00 AM</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">Tần suất sao lưu</label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="daily" selected>Hàng ngày</option>
                  <option value="weekly">Hàng tuần</option>
                  <option value="monthly">Hàng tháng</option>
                </select>
              </div>

              <div>
                <div className="text-sm text-slate-700 mb-3">Điểm khôi phục gần đây</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                    <div>
                      <div className="text-sm text-slate-900">10/12/2024 02:00:00</div>
                      <div className="text-xs text-slate-500">Kích thước: 2.5 GB</div>
                    </div>
                    <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                      Khôi phục
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                    <div>
                      <div className="text-sm text-slate-900">09/12/2024 02:00:00</div>
                      <div className="text-xs text-slate-500">Kích thước: 2.4 GB</div>
                    </div>
                    <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                      Khôi phục
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                    <div>
                      <div className="text-sm text-slate-900">08/12/2024 02:00:00</div>
                      <div className="text-xs text-slate-500">Kích thước: 2.3 GB</div>
                    </div>
                    <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                      Khôi phục
                    </button>
                  </div>
                </div>
              </div>

              <button className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Tạo bản sao lưu ngay
              </button>
            </div>

            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={closeSettingsModal} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Database Management Modal */}
      {settingsModal === 'database' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-slate-600" />
                </div>
                <h2 className="text-slate-900">Quản lý cơ sở dữ liệu</h2>
              </div>
              <button onClick={closeSettingsModal} className="text-slate-400 hover:text-slate-600" title="Đóng" aria-label="Đóng">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm text-blue-700">Tổng dung lượng</div>
                  <div className="text-blue-900 mt-1">45.2 GB</div>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-sm text-green-700">Đã sử dụng</div>
                  <div className="text-green-900 mt-1">28.7 GB</div>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="text-sm text-orange-700">Còn trống</div>
                  <div className="text-orange-900 mt-1">16.5 GB</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-700 mb-2">Sử dụng theo bảng</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Văn bản pháp luật</span>
                    <span className="text-sm text-slate-900">12.5 GB</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "43%" }}></div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-slate-600">Đăng ký kinh doanh</span>
                    <span className="text-sm text-slate-900">8.2 GB</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "28%" }}></div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-slate-600">Nhật ký hệ thống</span>
                    <span className="text-sm text-slate-900">5.5 GB</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: "19%" }}></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50">
                  Tối ưu hóa CSDL
                </button>
                <button className="py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                  Dọn dẹp dữ liệu cũ
                </button>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={closeSettingsModal} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* System Logs Modal */}
      {settingsModal === 'logs' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                  <FileSearch className="w-5 h-5 text-teal-600" />
                </div>
                <h2 className="text-slate-900">Nhật ký hệ thống</h2>
              </div>
              <button onClick={closeSettingsModal} className="text-slate-400 hover:text-slate-600" title="Đóng" aria-label="Đóng">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">Mức độ log</label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="all">Tất cả (All)</option>
                  <option value="error">Chỉ lỗi (Error)</option>
                  <option value="warning" selected>Cảnh báo trở lên (Warning+)</option>
                  <option value="info">Thông tin trở lên (Info+)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">Thời gian lưu trữ log (ngày)</label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="7">7 ngày</option>
                  <option value="30" selected>30 ngày</option>
                  <option value="90">90 ngày</option>
                  <option value="365">1 năm</option>
                  <option value="0">Vĩnh viễn</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <div className="text-sm text-slate-900">Ghi log API</div>
                  <div className="text-xs text-slate-500 mt-1">Lưu tất cả request/response API</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <div className="text-sm text-slate-900">Ghi log truy cập</div>
                  <div className="text-xs text-slate-500 mt-1">Lưu lịch sử đăng nhập/đăng xuất</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <button className="w-full py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">
                Xuất file log
              </button>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={closeSettingsModal} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                Hủy
              </button>
              <button onClick={closeSettingsModal} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
    </>
  );
}