import { useState, useEffect } from 'react';
import { Bell, Search, Trash2, Check, Mail, Clock, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { notificationCatalog, NotificationItem, NotificationType, subscribeToNotifications } from '../../data/notificationCatalog';

// Màn hình Quản lý thông báo — xem được TẤT CẢ thông báo trên hệ thống.
// 4 loại: Thành công (success) / Lỗi (error) / Cảnh báo (warning - bị từ chối) / Thông báo (info).
// Hệ thống KHÔNG phân chia thông báo theo mức độ ưu tiên.

type ReadFilter = 'all' | 'unread' | 'read';
type TypeFilter = 'all' | NotificationType;

const typeLabel: Record<NotificationType, string> = {
  success: 'Thành công',
  error: 'Lỗi',
  warning: 'Cảnh báo',
  info: 'Thông báo',
};

export function NotificationPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(notificationCatalog);

  // Cập nhật ngay khi có thông báo hệ thống mới được phát (Quản lý thông báo hệ thống)
  useEffect(() => {
    return subscribeToNotifications((newItem) => setNotifications(prev => [newItem, ...prev]));
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [readFilter, setReadFilter] = useState<ReadFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         n.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesReadFilter = readFilter === 'all' ||
                         (readFilter === 'unread' && !n.isRead) ||
                         (readFilter === 'read' && n.isRead);
    const matchesTypeFilter = typeFilter === 'all' || n.type === typeFilter;
    return matchesSearch && matchesReadFilter && matchesTypeFilter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const successCount = notifications.filter(n => n.type === 'success').length;
  const errorCount = notifications.filter(n => n.type === 'error').length;
  const warningCount = notifications.filter(n => n.type === 'warning').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Quản lý thông báo" icon={Bell} />

      {/* Stats — theo 4 loại thông báo, không theo mức độ ưu tiên */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Tổng thông báo</p>
              <p className="text-2xl text-slate-900 mt-1">{notifications.length}</p>
            </div>
            <Bell className="w-8 h-8 text-slate-400" />
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Chưa đọc</p>
              <p className="text-2xl text-blue-600 mt-1">{unreadCount}</p>
            </div>
            <Mail className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Thành công</p>
              <p className="text-2xl text-green-600 mt-1">{successCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Cảnh báo</p>
              <p className="text-2xl text-amber-600 mt-1">{warningCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-amber-400" />
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Lỗi</p>
              <p className="text-2xl text-red-600 mt-1">{errorCount}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm thông báo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setReadFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                readFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setReadFilter('unread')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                readFilter === 'unread'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Chưa đọc ({unreadCount})
            </button>
            <button
              onClick={() => setReadFilter('read')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                readFilter === 'read'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Đã đọc
            </button>
          </div>
        </div>

        {/* Bộ lọc theo loại thông báo (thay cho mức độ ưu tiên) */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
          <span className="text-sm text-slate-500 mr-1">Loại:</span>
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              typeFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tất cả loại
          </button>
          <button
            onClick={() => setTypeFilter('success')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              typeFilter === 'success' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            <CheckCircle className="w-4 h-4" /> Thành công
          </button>
          <button
            onClick={() => setTypeFilter('warning')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              typeFilter === 'warning' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4" /> Cảnh báo
          </button>
          <button
            onClick={() => setTypeFilter('error')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              typeFilter === 'error' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            <XCircle className="w-4 h-4" /> Lỗi
          </button>
          <button
            onClick={() => setTypeFilter('info')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              typeFilter === 'info' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            <Info className="w-4 h-4" /> Thông báo
          </button>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Check className="w-4 h-4" /> Đánh dấu tất cả đã đọc
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="divide-y divide-slate-200">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Không có thông báo nào</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-slate-50 transition-colors ${
                  !notification.isRead ? 'bg-blue-50/30' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-slate-900 ${!notification.isRead ? 'font-semibold' : ''}`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {notification.time}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Đánh dấu đã đọc"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
