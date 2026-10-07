import { useState, type ReactNode } from 'react';
import { Search, RefreshCw, Plus, Edit, Trash2, X, Send, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';
import { broadcastSystemNotification } from '../../../data/notificationCatalog';
import { ConfirmModal } from '../../common/ConfirmModal';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../ui/tooltip';
import {
  TruncatedText, RowIconAction, Pagination,
  BTN_PRIMARY, BTN_OUTLINE, BTN_GHOST_ICON, BTN_FOCUS, BTN_DISABLED, TOOLTIP_CLS,
  INPUT_CLS, LABEL_CLS, REQUIRED_MARK, SEARCH_INPUT_CLS, SEARCH_BTN_CLS,
  TABLE_WRAP_CLS, TABLE_HEAD_BG, TABLE_HEAD_ROW_CLS, normalizeSearch, formatDateVN,
} from '../collection/collectionUi';

// Giao diện theo tailieu/docs/compomennt.md (H1, tìm kiếm 5.19, bảng 5.3, phân trang 5.14, modal 5.4)
const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';
const MODAL_TITLE = 'text-[16px] font-medium text-[#020817]';
const TEXTAREA_CLS = `${INPUT_CLS.replace('h-10 ', '')} py-2 resize-none`;
// Nút icon nền trắng viền (Icon outline — mục 5.1)
const ICON_OUTLINE_BTN = `w-10 h-10 shrink-0 rounded-lg border bg-white border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#020817] transition-colors flex items-center justify-center ${BTN_FOCUS} ${BTN_DISABLED}`;

interface SystemNotificationLog {
  id: string;
  title: string;
  content: string;
  updatedDate: string;
}

const initialLogs: SystemNotificationLog[] = Array.from({ length: 8 }, (_, i) => ({
  id: `SN-${i + 1}`,
  title: 'Thông báo bảo trì hệ thống',
  content: 'Hệ thống sẽ được bảo trì từ 22h00 đến 23h00. Trong thời gian này, một số chức năng có thể bị gián đoạn.',
  updatedDate: '12/12/2025 09:30:45',
}));

const parseDateTime = (s: string) => {
  const [datePart, timePart] = s.split(' ');
  const [d, m, y] = datePart.split('/').map(Number);
  const [hh, mm, ss] = (timePart || '00:00:00').split(':').map(Number);
  return new Date(y, m - 1, d, hh, mm, ss).getTime();
};

// Nút icon trên thanh công cụ kèm tooltip chuẩn (5.3.1)
const ToolbarIconButton = ({ label, onClick, className, children }: { label: string; onClick: () => void; className: string; children: ReactNode }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button type="button" aria-label={label} onClick={onClick} className={className}>
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedLog, setSelectedLog] = useState<SystemNotificationLog | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '' });

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
    .sort((a, b) => sortAsc
      ? parseDateTime(a.updatedDate) - parseDateTime(b.updatedDate)
      : parseDateTime(b.updatedDate) - parseDateTime(a.updatedDate));

  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAdd = () => {
    setFormData({ title: '', content: '' });
    setShowAddModal(true);
  };

  const handleSend = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Vui lòng nhập đầy đủ Tiêu đề và Nội dung!');
      return;
    }
    // Phát thông báo (loại "Thông báo") tới tất cả người dùng đang dùng hệ thống
    broadcastSystemNotification(formData.title.trim(), formData.content.trim());

    const newLog: SystemNotificationLog = {
      id: `SN-${Date.now()}`,
      title: formData.title.trim(),
      content: formData.content.trim(),
      updatedDate: formatDateVN(new Date(), true),
    };
    setLogs(prev => [newLog, ...prev]);
    setShowAddModal(false);
    setCurrentPage(1);
    toast.success('Đã gửi thông báo tới tất cả người dùng trên hệ thống thành công!');
  };

  const handleEdit = (log: SystemNotificationLog) => {
    setSelectedLog(log);
    setFormData({ title: log.title, content: log.content });
    setShowEditModal(true);
  };

  const confirmEdit = () => {
    if (!selectedLog || !formData.title.trim() || !formData.content.trim()) {
      toast.error('Vui lòng nhập đầy đủ Tiêu đề và Nội dung!');
      return;
    }
    setLogs(prev => prev.map(l => l.id === selectedLog.id
      ? { ...l, title: formData.title.trim(), content: formData.content.trim() }
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

  // Form Thêm mới / Sửa dùng chung bố cục modal (5.4)
  const renderFormModal = (mode: 'add' | 'edit') => {
    const close = () => (mode === 'add' ? setShowAddModal(false) : setShowEditModal(false));
    const titleId = `system-notification-${mode}-title`;
    return (
      <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4" onClick={close}>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="shrink-0 px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
            <h3 id={titleId} className={MODAL_TITLE}>
              {mode === 'add' ? 'Thêm mới thông báo hệ thống' : 'Sửa thông báo hệ thống'}
            </h3>
            <button type="button" onClick={close} className={BTN_GHOST_ICON} title="Đóng" aria-label="Đóng">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-6 py-4 space-y-4">
            <div>
              <label htmlFor={`${titleId}-field-title`} className={LABEL_CLS}>
                Tiêu đề <span className={REQUIRED_MARK}>*</span>
              </label>
              <input
                id={`${titleId}-field-title`}
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={mode === 'add' ? 'Nhập' : undefined}
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label htmlFor={`${titleId}-field-content`} className={LABEL_CLS}>
                Nội dung <span className={REQUIRED_MARK}>*</span>
              </label>
              <textarea
                id={`${titleId}-field-content`}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={5}
                placeholder={mode === 'add' ? 'Nhập' : undefined}
                className={TEXTAREA_CLS}
              />
            </div>
          </div>
          <div className="shrink-0 px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
            <button type="button" onClick={close} className={BTN_OUTLINE}>
              Hủy
            </button>
            {mode === 'add' ? (
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
            label="Làm mới"
            onClick={() => { setSearchTerm(''); setAppliedSearch(''); setCurrentPage(1); }}
            className={ICON_OUTLINE_BTN}
          >
            <RefreshCw className="w-5 h-5" />
          </ToolbarIconButton>
          <ToolbarIconButton
            label={sortAsc ? 'Đang sắp xếp: Cũ → Mới' : 'Đang sắp xếp: Mới → Cũ'}
            onClick={() => setSortAsc(s => !s)}
            className={ICON_OUTLINE_BTN}
          >
            <ArrowUpDown className="w-5 h-5" />
          </ToolbarIconButton>
        </div>

        <div className="flex items-center gap-1.5">
          <button type="button" onClick={handleAdd} className={BTN_PRIMARY}>
            <Plus className="w-4 h-4" />
            Thêm mới
          </button>
        </div>
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
                <th className={`${TH} text-center w-24 sticky right-0 ${TABLE_HEAD_BG} shadow-[-1px_0_0_#E2E8F0]`}>Thao tác</th>
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
                      <td className={`${TD} text-left whitespace-nowrap leading-[18px] tabular-nums`}>
                        <div>{datePart}</div>
                        {timePart && <div className="text-[#64748B]">{timePart}</div>}
                      </td>
                      <td className={`${TD} text-center sticky right-0 bg-white group-hover:bg-[#F8FAFC] transition-colors shadow-[-1px_0_0_#E2E8F0]`}>
                        <div className="inline-flex items-center justify-center gap-1">
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
                  <td colSpan={5} className="py-16 text-center text-[13px] text-[#64748B]">
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
