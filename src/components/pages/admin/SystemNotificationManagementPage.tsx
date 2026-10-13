import { useState, type ReactNode } from 'react';
import { Search, Filter, Plus, Eye, Edit, Trash2, X, Send, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';
import { broadcastSystemNotification } from '../../../data/notificationCatalog';
import {
  RECIPIENT_ROLES, RECIPIENT_GROUPS, RECIPIENT_USERS, type NotificationAudience,
} from '../../../data/notificationRecipients';
import { CURRENT_USER } from '../../user/currentUser';
import { ConfirmModal } from '../../common/ConfirmModal';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../ui/tooltip';
import {
  TruncatedText, RowIconAction, Pagination,
  BTN_PRIMARY, BTN_OUTLINE, BTN_GHOST_ICON, BTN_FOCUS, TOOLTIP_CLS,
  INPUT_CLS, LABEL_CLS, REQUIRED_MARK, SEARCH_INPUT_CLS, SEARCH_BTN_CLS,
  filterBtnClass, FILTER_GRID_CLS, FILTER_LABEL, DateInput, VIEW_FIELD_CLS,
  TABLE_WRAP_CLS, TABLE_HEAD_BG, TABLE_HEAD_ROW_CLS, normalizeSearch, formatDateVN,
} from '../collection/collectionUi';

// Giao diện theo tailieu/docs/compomennt.md (H1, tìm kiếm 5.19, bảng 5.3, phân trang 5.14, modal 5.4)
const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';
const MODAL_TITLE = 'text-[16px] font-semibold text-[#020817]';
const TEXTAREA_CLS = `${INPUT_CLS.replace('h-10 ', '')} py-2 resize-none`;

interface SystemNotificationLog {
  id: string;
  title: string;
  content: string;
  updatedDate: string;
  audience: NotificationAudience;
}

// Mock đủ 3 kiểu đối tượng nhận để demo cột "Đối tượng nhận"
const MOCK_AUDIENCES: NotificationAudience[] = [
  { mode: 'all' },
  { mode: 'groups', roles: ['Người dùng cơ bản'], groups: ['Cán bộ nghiệp vụ Hộ tịch điện tử', 'Cán bộ nghiệp vụ thi hành án dân sự'] },
  { mode: 'users', users: ['nguyenvanan', 'tranthibinh', 'levancuong'] },
];

const initialLogs: SystemNotificationLog[] = Array.from({ length: 8 }, (_, i) => ({
  id: `SN-${i + 1}`,
  title: 'Thông báo bảo trì hệ thống',
  content: 'Hệ thống sẽ được bảo trì từ 22h00 đến 23h00. Trong thời gian này, một số chức năng có thể bị gián đoạn.',
  updatedDate: `${String(12 - i).padStart(2, '0')}/12/2025 09:30:45`, // ngày khác nhau để demo bộ lọc thời gian
  audience: MOCK_AUDIENCES[i % MOCK_AUDIENCES.length],
}));

type AudienceMode = NotificationAudience['mode'];
const AUDIENCE_OPTIONS: { value: AudienceMode; label: string }[] = [
  { value: 'all', label: 'Tất cả người dùng' },
  { value: 'groups', label: 'Theo nhóm người dùng' },
  { value: 'users', label: 'Theo người dùng cụ thể' },
];

const EMPTY_FORM = { title: '', content: '', mode: 'all' as AudienceMode, roles: [] as string[], groups: [] as string[], users: [] as string[] };
type NotificationForm = typeof EMPTY_FORM;

const formToAudience = (f: NotificationForm): NotificationAudience =>
  f.mode === 'groups' ? { mode: 'groups', roles: f.roles, groups: f.groups }
    : f.mode === 'users' ? { mode: 'users', users: f.users }
      : { mode: 'all' };

const userName = (username: string) => RECIPIENT_USERS.find(u => u.username === username)?.name ?? username;

// Tóm tắt đối tượng nhận (cột bảng / toast)
const audienceSummary = (a: NotificationAudience) =>
  a.mode === 'groups' ? `${a.groups.length} nhóm người dùng`
    : a.mode === 'users' ? `${a.users.length} người dùng`
      : 'Tất cả người dùng';

const ERROR_BORDER = ' !border-[#DC2626] focus:!ring-0 font-normal';
const ErrorText = ({ msg }: { msg?: string }) => (msg ? <p className="mt-1 text-[12px] text-[#DC2626]">{msg}</p> : null);
const CHECK_CLS = 'w-4 h-4 shrink-0 accent-blue-600 cursor-pointer disabled:cursor-not-allowed';
const LIST_BOX_CLS = 'mt-2 max-h-[220px] overflow-y-auto custom-scrollbar border border-[#E2E8F0] rounded-lg bg-white';
const LIST_ROW_CLS = 'flex items-center gap-2 px-3 py-2 text-[13px] text-[#020817] hover:bg-[#F8FAFC] cursor-pointer';
const LIST_EMPTY_CLS = 'px-3 py-2 text-[13px] italic text-[#64748B]';

// Chip mục đã chọn, có nút bỏ chọn (không truyền onRemove: chỉ xem)
const SelectedChips = ({ items, onRemove }: { items: { value: string; label: string }[]; onRemove?: (v: string) => void }) =>
  items.length === 0 ? null : (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      <span className="text-[12px] text-[#64748B]">Đã chọn ({items.length}):</span>
      {items.map(it => (
        <span key={it.value} className={`inline-flex items-center gap-1 h-6 pl-2 ${onRemove ? 'pr-1' : 'pr-2'} rounded-full bg-[#EAF3FF] text-[12px] text-blue-700`}>
          {it.label}
          {onRemove && (
            <button type="button" onClick={() => onRemove(it.value)} aria-label={`Bỏ chọn ${it.label}`} className={`rounded-full p-0.5 hover:bg-blue-100 ${BTN_FOCUS}`}>
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      ))}
    </div>
  );

const parseDateTime = (s: string) => {
  const [datePart, timePart] = s.split(' ');
  const [d, m, y] = datePart.split('/').map(Number);
  const [hh, mm, ss] = (timePart || '00:00:00').split(':').map(Number);
  return new Date(y, m - 1, d, hh, mm, ss).getTime();
};

// Nút icon trên thanh công cụ kèm tooltip chuẩn (5.3.1)
const ToolbarIconButton = ({ label, onClick, className, children, expanded }: { label: string; onClick: () => void; className: string; children: ReactNode; expanded?: boolean }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button type="button" aria-label={label} aria-expanded={expanded} onClick={onClick} className={className}>
        {children}
      </button>
    </TooltipTrigger>
    <TooltipContent side="top" sideOffset={4} className={TOOLTIP_CLS}>{label}</TooltipContent>
  </Tooltip>
);

export function SystemNotificationManagementPage() {
  const [logs, setLogs] = useState<SystemNotificationLog[]>(initialLogs);
  // Từ khóa chỉ áp dụng khi bấm Tìm kiếm hoặc Enter (5.19)
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState(''); // ISO yyyy-mm-dd
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedLog, setSelectedLog] = useState<SystemNotificationLog | null>(null);
  const [formData, setFormData] = useState<NotificationForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [groupSearch, setGroupSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  const openForm = (data: NotificationForm) => {
    setFormData(data);
    setErrors({});
    setGroupSearch('');
    setUserSearch('');
  };

  const updateForm = (patch: Partial<NotificationForm>) => {
    setFormData(prev => ({ ...prev, ...patch }));
    setErrors(prev => {
      const next = { ...prev };
      Object.keys(patch).forEach(k => delete next[k]);
      return next;
    });
  };

  // Kiểm tra trường bắt buộc — báo lỗi inline dưới từng ô, nút vẫn sáng
  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) errs.title = 'Vui lòng nhập tiêu đề';
    if (!formData.content.trim()) errs.content = 'Vui lòng nhập nội dung';
    if (formData.mode === 'groups') {
      if (formData.roles.length === 0) errs.roles = 'Vui lòng chọn ít nhất 1 vai trò';
      else if (formData.groups.length === 0) {
        const hasGroups = RECIPIENT_GROUPS.some(g => formData.roles.includes(g.role));
        errs.groups = hasGroups
          ? 'Vui lòng chọn ít nhất 1 nhóm người dùng'
          : 'Các vai trò đã chọn chưa có nhóm người dùng nào. Vui lòng chọn vai trò khác';
      }
    }
    if (formData.mode === 'users' && formData.users.length === 0) errs.users = 'Vui lòng chọn ít nhất 1 người dùng';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const runSearch = () => {
    setAppliedSearch(searchTerm);
    setCurrentPage(1);
  };

  const q = normalizeSearch(appliedSearch);
  const filteredLogs = logs
    .filter(l =>
      !q ||
      normalizeSearch(l.title).includes(q) ||
      normalizeSearch(l.content).includes(q)
    )
    .filter(l => {
      // Ngày cập nhật dd/mm/yyyy HH:mm:ss → yyyy-mm-dd để so với bộ lọc
      const [d, m, y] = l.updatedDate.split(' ')[0].split('/');
      const iso = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      return (!startDate || iso >= startDate) && (!endDate || iso <= endDate);
    })
    .sort((a, b) => sortAsc
      ? parseDateTime(a.updatedDate) - parseDateTime(b.updatedDate)
      : parseDateTime(b.updatedDate) - parseDateTime(a.updatedDate));

  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAdd = () => {
    openForm(EMPTY_FORM);
    setShowAddModal(true);
  };

  const handleSend = () => {
    if (!validateForm()) return;
    const audience = formToAudience(formData);
    // Phát thông báo (loại "Thông báo") — chuông chỉ hiện với người đăng nhập thuộc đối tượng nhận
    broadcastSystemNotification(formData.title.trim(), formData.content.trim(), audience);

    const newLog: SystemNotificationLog = {
      id: `SN-${Date.now()}`,
      title: formData.title.trim(),
      content: formData.content.trim(),
      updatedDate: formatDateVN(new Date(), true),
      audience,
    };
    setLogs(prev => [newLog, ...prev]);
    setShowAddModal(false);
    setCurrentPage(1);
    toast.success(audience.mode === 'all'
      ? 'Đã gửi thông báo tới tất cả người dùng trên hệ thống thành công!'
      : `Đã gửi thông báo tới ${audienceSummary(audience)} thành công!`);
  };

  const handleView = (log: SystemNotificationLog) => {
    handleEdit(log, false);
    setShowViewModal(true);
  };

  const handleEdit = (log: SystemNotificationLog, openEdit = true) => {
    setSelectedLog(log);
    const a = log.audience;
    openForm({
      title: log.title,
      content: log.content,
      mode: a.mode,
      roles: a.mode === 'groups' ? a.roles : [],
      groups: a.mode === 'groups' ? a.groups : [],
      users: a.mode === 'users' ? a.users : [],
    });
    if (openEdit) setShowEditModal(true);
  };

  const confirmEdit = () => {
    if (!selectedLog || !validateForm()) return;
    setLogs(prev => prev.map(l => l.id === selectedLog.id
      ? { ...l, title: formData.title.trim(), content: formData.content.trim(), audience: formToAudience(formData) }
      : l));
    setShowEditModal(false);
    setSelectedLog(null);
  };

  const handleDelete = (log: SystemNotificationLog) => {
    setSelectedLog(log);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (!selectedLog) return;
    setLogs(prev => prev.filter(l => l.id !== selectedLog.id));
    setShowDeleteConfirm(false);
    setSelectedLog(null);
  };

  const toggleIn = (list: string[], v: string) => (list.includes(v) ? list.filter(x => x !== v) : [...list, v]);

  // Bỏ chọn vai trò thì bỏ luôn các nhóm thuộc vai trò đó
  const toggleRole = (role: string) => {
    const roles = toggleIn(formData.roles, role);
    const groups = formData.groups.filter(g => roles.includes(RECIPIENT_GROUPS.find(x => x.name === g)?.role ?? ''));
    updateForm({ roles, groups });
  };

  // Đối tượng nhận: chỉ chọn 1 trong 3 kiểu; nhóm người dùng chọn theo vai trò (chọn vai trò trước)
  // readOnly (Xem chi tiết): ẩn ô tìm kiếm, chip không có nút bỏ chọn, danh sách người dùng chỉ hiện người đã chọn
  const renderAudienceFields = (idPrefix: string, readOnly = false) => {
    const gq = normalizeSearch(groupSearch);
    const uq = normalizeSearch(userSearch);
    const selectedRoles = RECIPIENT_ROLES.filter(r => formData.roles.includes(r));
    const users = readOnly
      ? RECIPIENT_USERS.filter(u => formData.users.includes(u.username))
      : RECIPIENT_USERS.filter(u => !uq || normalizeSearch(u.name).includes(uq) || normalizeSearch(u.username).includes(uq));
    const rowCls = readOnly ? LIST_ROW_CLS.replace(' hover:bg-[#F8FAFC] cursor-pointer', ' cursor-default') : LIST_ROW_CLS;
    return (
      <>
        <div>
          <span className={LABEL_CLS}>Đối tượng nhận <span className={REQUIRED_MARK}>*</span></span>
          <div role="radiogroup" aria-label="Đối tượng nhận" className="flex flex-wrap gap-x-6 gap-y-2 mt-1">
            {AUDIENCE_OPTIONS.map(o => (
              <label key={o.value} className={`inline-flex items-center gap-2 text-[13px] text-[#020817] ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}>
                <input
                  type="radio"
                  name={`${idPrefix}-audience`}
                  checked={formData.mode === o.value}
                  onChange={() => { updateForm({ mode: o.value, roles: [], groups: [], users: [] }); setGroupSearch(''); setUserSearch(''); }}
                  className={CHECK_CLS}
                />
                {o.label}
              </label>
            ))}
          </div>
        </div>

        {formData.mode === 'groups' && (
          <>
            <div>
              <span className={LABEL_CLS}>Vai trò <span className={REQUIRED_MARK}>*</span></span>
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-4 border border-[#E2E8F0] rounded-lg py-1${errors.roles ? ERROR_BORDER : ''}`}>
                {RECIPIENT_ROLES.map(role => {
                  const count = RECIPIENT_GROUPS.filter(g => g.role === role).length;
                  return (
                    <label key={role} className={rowCls}>
                      <input type="checkbox" checked={formData.roles.includes(role)} onChange={() => toggleRole(role)} className={CHECK_CLS} />
                      <span className="flex-1">{role}</span>
                      <span className="text-[12px] text-[#64748B]">{count > 0 ? `${count} nhóm` : 'Chưa có nhóm'}</span>
                    </label>
                  );
                })}
              </div>
              <ErrorText msg={errors.roles} />
            </div>

            <div>
              <span className={LABEL_CLS}>Nhóm người dùng <span className={REQUIRED_MARK}>*</span></span>
              {selectedRoles.length === 0 ? (
                <div className="h-10 px-3 flex items-center rounded-lg border border-[rgba(0,0,0,0.26)] bg-[#F0F0F0] text-[13px] text-[#94A3B8] cursor-not-allowed">
                  Vui lòng chọn vai trò trước
                </div>
              ) : (
                <>
                  {!readOnly && (
                    <input
                      type="text"
                      aria-label="Tìm kiếm nhóm người dùng"
                      value={groupSearch}
                      onChange={(e) => setGroupSearch(e.target.value)}
                      placeholder="Tìm kiếm theo tên, mã nhóm"
                      className={INPUT_CLS}
                    />
                  )}
                  <div className={`${LIST_BOX_CLS}${readOnly ? ' !mt-0' : ''}${errors.groups ? ERROR_BORDER : ''}`}>
                    {selectedRoles.map(role => {
                      const roleGroups = RECIPIENT_GROUPS.filter(g => g.role === role);
                      const shown = roleGroups.filter(g => !gq || normalizeSearch(g.name).includes(gq) || normalizeSearch(g.code).includes(gq));
                      return (
                        <div key={role}>
                          <div className="px-3 py-1.5 bg-[#F8FAFC] text-[12px] font-semibold text-[#475569] border-b border-[#E2E8F0]">{role}</div>
                          {roleGroups.length === 0 ? (
                            <div className={LIST_EMPTY_CLS}>Vai trò này chưa có nhóm người dùng nào</div>
                          ) : shown.length === 0 ? (
                            <div className={LIST_EMPTY_CLS}>Không tìm thấy kết quả phù hợp</div>
                          ) : shown.map(g => (
                            <label key={g.id} className={rowCls}>
                              <input type="checkbox" checked={formData.groups.includes(g.name)} onChange={() => updateForm({ groups: toggleIn(formData.groups, g.name) })} className={CHECK_CLS} />
                              <span className="flex-1">{g.name}</span>
                              <span className="text-[12px] text-[#64748B]">{g.code}</span>
                            </label>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                  <SelectedChips
                    items={formData.groups.map(g => ({ value: g, label: g }))}
                    onRemove={readOnly ? undefined : (v) => updateForm({ groups: formData.groups.filter(x => x !== v) })}
                  />
                </>
              )}
              <ErrorText msg={errors.groups} />
            </div>
          </>
        )}

        {formData.mode === 'users' && (
          <div>
            <span className={LABEL_CLS}>Người dùng <span className={REQUIRED_MARK}>*</span></span>
            {!readOnly && (
              <input
                type="text"
                aria-label="Tìm kiếm người dùng"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Tìm kiếm theo tên người dùng, tài khoản"
                className={INPUT_CLS}
              />
            )}
            <div className={`${LIST_BOX_CLS}${readOnly ? ' !mt-0' : ''}${errors.users ? ERROR_BORDER : ''}`}>
              {users.length === 0 ? (
                <div className={LIST_EMPTY_CLS}>Không tìm thấy kết quả phù hợp</div>
              ) : users.map(u => (
                <label key={u.username} className={rowCls}>
                  <input type="checkbox" checked={formData.users.includes(u.username)} onChange={() => updateForm({ users: toggleIn(formData.users, u.username) })} className={CHECK_CLS} />
                  <span className="flex-1">{u.name}{u.username === CURRENT_USER.username && <span className="text-[#64748B]"> (bạn)</span>}</span>
                  <span className="text-[12px] text-[#64748B]">{u.username}</span>
                </label>
              ))}
            </div>
            <SelectedChips
              items={formData.users.map(u => ({ value: u, label: userName(u) }))}
              onRemove={readOnly ? undefined : (v) => updateForm({ users: formData.users.filter(x => x !== v) })}
            />
            <ErrorText msg={errors.users} />
          </div>
        )}
      </>
    );
  };

  // Form Thêm mới / Sửa / Xem chi tiết dùng chung bố cục modal (5.4).
  // Xem chi tiết: mọi ô khóa theo chuẩn (fieldset disabled), cao cố định h-[90vh] max-h-[800px], chân chỉ có [Đóng]
  const renderFormModal = (mode: 'add' | 'edit' | 'view') => {
    const isView = mode === 'view';
    const close = () => (mode === 'add' ? setShowAddModal(false) : mode === 'edit' ? setShowEditModal(false) : setShowViewModal(false));
    const titleId = `system-notification-${mode}-title`;
    const fieldCls = (base: string, key: string) => `${base}${isView ? ` ${VIEW_FIELD_CLS}` : ''}${errors[key] ? ERROR_BORDER : ''}`;
    return (
      <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4" onClick={close}>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={`bg-white rounded-2xl shadow-2xl max-w-2xl w-full ${isView ? 'h-[90vh] max-h-[800px]' : 'max-h-[90vh]'} flex flex-col overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="shrink-0 px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
            <h3 id={titleId} className={MODAL_TITLE}>
              {mode === 'add' ? 'Thêm mới thông báo hệ thống' : mode === 'edit' ? 'Sửa thông báo hệ thống' : 'Xem chi tiết thông báo hệ thống'}
            </h3>
            <button type="button" onClick={close} className={BTN_GHOST_ICON} title="Đóng" aria-label="Đóng">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-6 py-4">
          <fieldset disabled={isView} className="min-w-0 m-0 p-0 border-0 space-y-4">
            <div>
              <label htmlFor={`${titleId}-field-title`} className={LABEL_CLS}>
                Tiêu đề <span className={REQUIRED_MARK}>*</span>
              </label>
              <input
                id={`${titleId}-field-title`}
                type="text"
                value={formData.title}
                onChange={(e) => updateForm({ title: e.target.value })}
                placeholder={mode === 'add' ? 'Nhập' : undefined}
                className={fieldCls(INPUT_CLS, 'title')}
              />
              <ErrorText msg={errors.title} />
            </div>
            <div>
              <label htmlFor={`${titleId}-field-content`} className={LABEL_CLS}>
                Nội dung <span className={REQUIRED_MARK}>*</span>
              </label>
              <textarea
                id={`${titleId}-field-content`}
                value={formData.content}
                onChange={(e) => updateForm({ content: e.target.value })}
                rows={5}
                placeholder={mode === 'add' ? 'Nhập' : undefined}
                className={fieldCls(TEXTAREA_CLS, 'content')}
              />
              <ErrorText msg={errors.content} />
            </div>
            {isView && selectedLog && (
              <div>
                <label htmlFor={`${titleId}-field-updated`} className={LABEL_CLS}>Ngày cập nhật</label>
                <input id={`${titleId}-field-updated`} type="text" value={selectedLog.updatedDate} readOnly className={`${INPUT_CLS} ${VIEW_FIELD_CLS}`} />
              </div>
            )}
            {renderAudienceFields(titleId, isView)}
          </fieldset>
          </div>
          <div className="shrink-0 px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
            <button type="button" onClick={close} className={BTN_OUTLINE}>
              {isView ? 'Đóng' : 'Hủy'}
            </button>
            {isView ? null : mode === 'add' ? (
              <button type="button" onClick={handleSend} className={BTN_PRIMARY}>
                <Send className="w-4 h-4" />
                Gửi
              </button>
            ) : (
              <button type="button" onClick={confirmEdit} className={BTN_PRIMARY}>
                Lưu
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h1 className="text-[20px] font-bold text-[#2A0F0F] leading-8">Quản lý thông báo hệ thống</h1>

      {/* Tìm kiếm & thao tác (5.19) */}
      <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[280px] flex items-center gap-1.5">
          <input
            type="text"
            aria-label="Tìm kiếm thông báo hệ thống"
            placeholder="Tìm kiếm theo tiêu đề, nội dung"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
            className={SEARCH_INPUT_CLS}
          />
          <ToolbarIconButton label="Tìm kiếm" onClick={runSearch} className={SEARCH_BTN_CLS}>
            <Search className="w-5 h-5" />
          </ToolbarIconButton>
          <ToolbarIconButton
            label="Bộ lọc"
            onClick={() => setShowFilters(s => !s)}
            expanded={showFilters}
            className={filterBtnClass(showFilters)}
          >
            {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
          </ToolbarIconButton>
        </div>

        <div className="flex items-center gap-1.5">
          <button type="button" onClick={handleAdd} className={BTN_PRIMARY}>
            <Plus className="w-4 h-4" />
            Thêm mới
          </button>
        </div>
      </div>

      {/* Bộ lọc nâng cao (5.19) — lọc theo Ngày cập nhật */}
      {showFilters && (
        <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
          <div>
            <label className={FILTER_LABEL}>Thời gian từ</label>
            <DateInput ariaLabel="Thời gian từ" value={startDate} onChange={(v) => { setStartDate(v); setCurrentPage(1); }} max={endDate || undefined} />
          </div>
          <div>
            <label className={FILTER_LABEL}>Thời gian đến</label>
            <DateInput ariaLabel="Thời gian đến" value={endDate} onChange={(v) => { setEndDate(v); setCurrentPage(1); }} min={startDate || undefined} />
          </div>
        </div>
      )}
      </div>

      {/* Bảng (5.3) */}
      <div className={TABLE_WRAP_CLS}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead className={`${TABLE_HEAD_BG} sticky top-0 z-[1]`}>
              <tr className={TABLE_HEAD_ROW_CLS}>
                <th className={`${TH} text-center w-14`}>STT</th>
                <th className={`${TH} text-left`}>Tiêu đề</th>
                <th className={`${TH} text-left`}>Nội dung</th>
                <th className={`${TH} text-left`}>Đối tượng nhận</th>
                <th className={`${TH} text-left`}>
                  <button
                    type="button"
                    onClick={() => setSortAsc(s => !s)}
                    aria-label={`Ngày cập nhật — ${sortAsc ? 'Đang sắp xếp: Cũ → Mới' : 'Đang sắp xếp: Mới → Cũ'}`}
                    className={`inline-flex items-center gap-1 rounded hover:text-blue-600 ${BTN_FOCUS}`}
                  >
                    Ngày cập nhật <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </th>
                <th className={`${TH} text-center w-32 sticky right-0 ${TABLE_HEAD_BG} shadow-[-1px_0_0_#E2E8F0]`}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log, index) => {
                  const [datePart, timePart] = log.updatedDate.split(' ');
                  return (
                    <tr key={log.id} className="group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                      <td className={`${TD} text-center whitespace-nowrap`}>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className={`${TD} text-left max-w-[280px]`}>
                        <TruncatedText text={log.title} />
                      </td>
                      <td className={`${TD} text-left max-w-[480px]`}>
                        <TruncatedText text={log.content} />
                      </td>
                      <td className={`${TD} text-left whitespace-nowrap`}>
                        {audienceSummary(log.audience)}
                      </td>
                      <td className={`${TD} text-left whitespace-nowrap leading-[18px] tabular-nums`}>
                        <div>{datePart}</div>
                        {timePart && <div className="text-[#64748B]">{timePart}</div>}
                      </td>
                      <td className={`${TD} text-center sticky right-0 bg-white group-hover:bg-[#F8FAFC] transition-colors shadow-[-1px_0_0_#E2E8F0]`}>
                        <div className="inline-flex items-center justify-center gap-1">
                          <RowIconAction label="Xem chi tiết" onClick={() => handleView(log)}>
                            <Eye className="w-4 h-4" />
                          </RowIconAction>
                          <RowIconAction label="Sửa" onClick={() => handleEdit(log)}>
                            <Edit className="w-4 h-4" />
                          </RowIconAction>
                          <RowIconAction label="Xóa" onClick={() => handleDelete(log)}>
                            <Trash2 className="w-4 h-4 text-[#DC2626]" />
                          </RowIconAction>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6}className="py-16 text-center text-[13px] text-[#64748B]">
                    Không tìm thấy dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang (5.14) */}
        {filteredLogs.length > 0 && (
          <Pagination
            className="border-t border-[#E2E8F0]"
            currentPage={currentPage}
            totalItems={filteredLogs.length}
            pageSize={itemsPerPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={setItemsPerPage}
            pageSizeOptions={[10, 20, 50]}
          />
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && renderFormModal('add')}

      {/* Edit Modal */}
      {showEditModal && selectedLog && renderFormModal('edit')}

      {/* View Modal */}
      {showViewModal && selectedLog && renderFormModal('view')}

      {/* Delete Confirmation (5.4 — ConfirmModal dùng chung) */}
      <ConfirmModal
        isOpen={showDeleteConfirm && !!selectedLog}
        onClose={() => { setShowDeleteConfirm(false); setSelectedLog(null); }}
        onConfirm={confirmDelete}
        title="Xác nhận xóa"
        subtitle="Hành động này không thể hoàn tác."
        message={<>Bạn có chắc chắn muốn xóa thông báo "{selectedLog?.title}"?</>}
        confirmText="Xóa"
        type="delete"
      />
    </div>
  );
}
