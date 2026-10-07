import { useState, useEffect } from 'react';
import { Bell, Search, Filter, X, Trash2, Check, Mail, Clock, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { notificationCatalog, NotificationItem, NotificationType, subscribeToNotifications } from '../../data/notificationCatalog';
import {
  Badge, TruncatedText, RowIconAction, BTN_OUTLINE, INPUT_CLS,
  SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, FILTER_GRID_CLS, FILTER_LABEL,
  tabClass, normalizeSearch,
} from './collection/collectionUi';

// Màn hình Quản lý thông báo — xem được TẤT CẢ thông báo trên hệ thống.
// 4 loại: Thành công (success) / Lỗi (error) / Cảnh báo (warning - bị từ chối) / Thông báo (info).
// Hệ thống KHÔNG phân chia thông báo theo mức độ ưu tiên.
// Giao diện theo tailieu/docs/compomennt.md (H1, thẻ thống kê 5.6.1, tìm kiếm & bộ lọc 5.19, tab 5.9, badge 5.8).

type ReadFilter = 'all' | 'unread' | 'read';
type TypeFilter = 'all' | NotificationType;

const typeLabel: Record<NotificationType, string> = {
  success: 'Thành công',
  error: 'Lỗi',
  warning: 'Cảnh báo',
  info: 'Thông báo',
};

// Tông màu theo loại thông báo (badge 5.8 + ô icon 5.6.1)
const typeBadgeVariant: Record<NotificationType, string> = {
  success: 'green',
  error: 'red',
  warning: 'amber',
  info: 'blue',
};

// Thời gian hiển thị dd/mm/yyyy HH:mm:ss — thông báo phát mới dùng định dạng 'vi-VN' (HH:mm:ss d/m/yyyy) nên quy đổi khi hiển thị
const formatTime = (s: string) => {
  const m = /^(\d{1,2}):(\d{2}):(\d{2})\s+(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec((s || '').trim());
  if (!m) return s;
  const p = (v: string) => v.padStart(2, '0');
  return `${p(m[4])}/${p(m[5])}/${m[6]} ${p(m[1])}:${m[2]}:${m[3]}`;
};

export function NotificationPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(notificationCatalog);

  // Cập nhật ngay khi có thông báo hệ thống mới được phát (Quản lý thông báo hệ thống)
  useEffect(() => {
    return subscribeToNotifications((newItem) => setNotifications(prev => [newItem, ...prev]));
  }, []);

  // Từ khóa & bộ lọc loại: nhập/chọn trước, chỉ áp dụng khi bấm Tìm kiếm hoặc Enter (5.19)
  const [searchTerm, setSearchTerm] = useState('');
  const [typeDraft, setTypeDraft] = useState<TypeFilter>('all');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [showFilters, setShowFilters] = useState(false);
  // Trạng thái đọc chuyển bằng tab (5.9)
  const [readFilter, setReadFilter] = useState<ReadFilter>('all');

  const runSearch = () => {
    setAppliedSearch(searchTerm);
    setTypeFilter(typeDraft);
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <div className="w-8 h-8 shrink-0 rounded-lg bg-green-50 flex items-center justify-center"><CheckCircle className="w-4 h-4 text-green-600" /></div>;
      case 'error':
        return <div className="w-8 h-8 shrink-0 rounded-lg bg-red-50 flex items-center justify-center"><XCircle className="w-4 h-4 text-red-600" /></div>;
      case 'warning':
        return <div className="w-8 h-8 shrink-0 rounded-lg bg-yellow-50 flex items-center justify-center"><AlertTriangle className="w-4 h-4 text-yellow-600" /></div>;
      default:
        return <div className="w-8 h-8 shrink-0 rounded-lg bg-blue-50 flex items-center justify-center"><Info className="w-4 h-4 text-blue-600" /></div>;
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

  const q = normalizeSearch(appliedSearch);
  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = !q ||
                         normalizeSearch(n.title).includes(q) ||
                         normalizeSearch(n.message).includes(q) ||
                         normalizeSearch(n.source).includes(q);
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

  // Thẻ thống kê (5.6.1) — theo 4 loại thông báo, không theo mức độ ưu tiên
  const stats = [
    { label: 'Tổng thông báo', value: notifications.length, icon: Bell, tone: 'bg-blue-50 text-blue-600' },
    { label: 'Chưa đọc', value: unreadCount, icon: Mail, tone: 'bg-blue-50 text-blue-600' },
    { label: 'Thành công', value: successCount, icon: CheckCircle, tone: 'bg-green-50 text-green-600' },
    { label: 'Cảnh báo', value: warningCount, icon: AlertTriangle, tone: 'bg-yellow-50 text-yellow-600' },
    { label: 'Lỗi', value: errorCount, icon: XCircle, tone: 'bg-red-50 text-red-600' },
  ];

  const readTabs: { key: ReadFilter; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    { key: 'unread', label: `Chưa đọc (${unreadCount})` },
    { key: 'read', label: 'Đã đọc' },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-[20px] font-bold text-[#2A0F0F] leading-8">Quản lý thông báo</h1>

      {/* Thẻ thống kê (5.6.1) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${tone}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[16px] text-[#64748B] truncate">{label}</div>
                <div className="text-[16px] font-semibold text-[#0F172A] tabular-nums">{value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tìm kiếm & bộ lọc (5.19) — chỉ áp dụng khi bấm Tìm kiếm / Enter */}
      <div>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-[280px] flex items-center gap-1.5">
            <input
              type="text"
              aria-label="Tìm kiếm thông báo"
              placeholder="Tìm kiếm theo tiêu đề, nội dung, nguồn thông báo"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
              className={SEARCH_INPUT_CLS}
            />
            <button type="button" title="Tìm kiếm" aria-label="Tìm kiếm" onClick={runSearch} className={SEARCH_BTN_CLS}>
              <Search className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              aria-label="Bộ lọc"
              title="Bộ lọc"
              className={filterBtnClass(showFilters)}
            >
              {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
            </button>
          </div>

          {unreadCount > 0 && (
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={markAllAsRead} className={BTN_OUTLINE}>
                <Check className="w-4 h-4" /> Đánh dấu tất cả đã đọc
              </button>
            </div>
          )}
        </div>

        {/* Bộ lọc theo loại thông báo (thay cho mức độ ưu tiên) */}
        {showFilters && (
          <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
            <div>
              <label htmlFor="notification-type-filter" className={FILTER_LABEL}>Loại</label>
              <select
                id="notification-type-filter"
                className={INPUT_CLS}
                value={typeDraft}
                onChange={(e) => setTypeDraft(e.target.value as TypeFilter)}
              >
                <option value="all">Tất cả loại</option>
                <option value="success">Thành công</option>
                <option value="warning">Cảnh báo</option>
                <option value="error">Lỗi</option>
                <option value="info">Thông báo</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Danh sách thông báo */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        {/* Tab trạng thái đọc (5.9) */}
        <div role="tablist" aria-label="Trạng thái đọc" className="flex border-b border-[#E2E8F0] px-2">
          {readTabs.map(t => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={readFilter === t.key}
              onClick={() => setReadFilter(t.key)}
              className={tabClass(readFilter === t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="divide-y divide-[#E2E8F0]">
          {filteredNotifications.length === 0 ? (
            <div className="py-16 text-center">
              <Bell className="w-12 h-12 text-[#CBD5E1] mx-auto mb-3" />
              <p className="text-[13px] text-[#64748B]">Không có thông báo nào</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-4 py-3 transition-colors hover:bg-[#F8FAFC] ${
                  !notification.isRead ? 'bg-[#EAF3FF]/50' : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  {getTypeIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <TruncatedText
                        text={notification.title}
                        className={`min-w-0 text-[13px] text-[#020817] ${!notification.isRead ? 'font-semibold' : 'font-medium'}`}
                      />
                      {!notification.isRead && (
                        <span className="w-2 h-2 shrink-0 bg-blue-600 rounded-full" aria-label="Chưa đọc" />
                      )}
                      <span className="shrink-0">
                        <Badge label={typeLabel[notification.type]} variant={typeBadgeVariant[notification.type]} />
                      </span>
                    </div>
                    <p className="mt-1 text-[13px] text-[#475569] line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1 text-[12px] text-[#64748B] tabular-nums">
                      <Clock className="w-3.5 h-3.5" />
                      {formatTime(notification.time)}
                    </div>
                  </div>
                  <div className="shrink-0 inline-flex items-center gap-1">
                    {!notification.isRead && (
                      <RowIconAction label="Đánh dấu đã đọc" onClick={() => markAsRead(notification.id)}>
                        <Check className="w-4 h-4" />
                      </RowIconAction>
                    )}
                    <RowIconAction label="Xóa" onClick={() => deleteNotification(notification.id)}>
                      <Trash2 className="w-4 h-4 text-[#DC2626]" />
                    </RowIconAction>
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
