import { useState } from 'react';
import { Search, RefreshCw, Filter, Plus, Edit, Trash2, X, Send, ArrowUpDown, AlertTriangle } from 'lucide-react';
import { broadcastSystemNotification } from '../../../data/notificationCatalog';

interface SystemNotificationLog {
  id: string;
  title: string;
  content: string;
  updatedDate: string;
}

const initialLogs: SystemNotificationLog[] = Array.from({ length: 8 }, (_, i) => ({
  id: `SN-${i + 1}`,
  title: 'Thông báo bảo trì hệ thống',
  content: 'Hệ thống sẽ được bảo trì từ 22h00 đến 23h00.Trong thời gian này, một số chức năng có thể bị gián đoạn.',
  updatedDate: '12/12/2025 09:30:45',
}));

const parseDateTime = (s: string) => {
  const [datePart, timePart] = s.split(' ');
  const [d, m, y] = datePart.split('/').map(Number);
  const [hh, mm, ss] = (timePart || '00:00:00').split(':').map(Number);
  return new Date(y, m - 1, d, hh, mm, ss).getTime();
};

export function SystemNotificationManagementPage() {
  const [logs, setLogs] = useState<SystemNotificationLog[]>(initialLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedLog, setSelectedLog] = useState<SystemNotificationLog | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '' });

  const filteredLogs = logs
    .filter(l =>
      l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => sortAsc
      ? parseDateTime(a.updatedDate) - parseDateTime(b.updatedDate)
      : parseDateTime(b.updatedDate) - parseDateTime(a.updatedDate));

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / itemsPerPage));
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAdd = () => {
    setFormData({ title: '', content: '' });
    setShowAddModal(true);
  };

  const handleSend = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Vui lòng nhập đầy đủ Tiêu đề và Nội dung!');
      return;
    }
    // Phát thông báo (loại "Thông báo") tới tất cả người dùng đang dùng hệ thống
    broadcastSystemNotification(formData.title.trim(), formData.content.trim());

    const newLog: SystemNotificationLog = {
      id: `SN-${Date.now()}`,
      title: formData.title.trim(),
      content: formData.content.trim(),
      updatedDate: new Date().toLocaleString('vi-VN'),
    };
    setLogs(prev => [newLog, ...prev]);
    setShowAddModal(false);
    setCurrentPage(1);
    alert('Đã gửi thông báo tới tất cả người dùng trên hệ thống thành công!');
  };

  const handleEdit = (log: SystemNotificationLog) => {
    setSelectedLog(log);
    setFormData({ title: log.title, content: log.content });
    setShowEditModal(true);
  };

  const confirmEdit = () => {
    if (!selectedLog || !formData.title.trim() || !formData.content.trim()) {
      alert('Vui lòng nhập đầy đủ Tiêu đề và Nội dung!');
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

  return (
    <div className="space-y-4">
      <h1 className="text-[20px] font-bold text-slate-900">Quản lý thông báo hệ thống</h1>

      {/* Search & Actions */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[280px] max-w-xl">
          <input
            type="text"
            placeholder="Tìm kiếm tiêu đề..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <button
            type="button"
            onClick={() => setCurrentPage(1)}
            className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors shrink-0"
            title="Tìm kiếm"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
            className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-xl transition-colors shrink-0"
            title="Làm mới"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setSortAsc(s => !s)}
            className="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-500 rounded-xl transition-colors shrink-0"
            title={sortAsc ? 'Đang sắp xếp: Cũ → Mới' : 'Đang sắp xếp: Mới → Cũ'}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 text-[13px] font-medium shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          Thêm mới
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-[13px] font-semibold text-slate-700 text-center w-14">STT</th>
                <th className="px-4 py-3 text-[13px] font-semibold text-slate-700 whitespace-nowrap">Tiêu đề</th>
                <th className="px-4 py-3 text-[13px] font-semibold text-slate-700">Nội dung</th>
                <th className="px-4 py-3 text-[13px] font-semibold text-slate-700 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => setSortAsc(s => !s)}
                    className="inline-flex items-center gap-1 cursor-pointer"
                  >
                    Ngày cập nhật <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </th>
                <th className="px-4 py-3 text-[13px] font-semibold text-slate-700 text-center w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log, index) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-all">
                    <td className="px-4 py-3 text-[13px] text-slate-500 text-center">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-slate-900 font-medium whitespace-nowrap">{log.title}</td>
                    <td className="px-4 py-3 text-[13px] text-slate-700 max-w-lg">{log.content}</td>
                    <td className="px-4 py-3 text-[13px] text-slate-600 whitespace-nowrap">{log.updatedDate}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleEdit(log)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(log)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[13px] text-slate-500">
                    Không tìm thấy dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredLogs.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white text-[13px] font-medium">
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-normal">Hiển thị</span>
              <select
                aria-label="Số bản ghi trên trang"
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="px-2 py-1.5 border border-slate-200 rounded-lg bg-white text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                title="Số bản ghi trên trang"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-slate-600 font-normal">bản ghi/trang</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-600 font-normal">
                {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredLogs.length)} / {filteredLogs.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 border rounded-xl font-medium text-[13px] transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div className="bg-white rounded-xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-slate-900 font-bold text-[16px]">Thêm mới thông báo hệ thống</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-[13px]">
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-2">
                  Tiêu đề <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Nhập"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-2">
                  Nội dung <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={5}
                  placeholder="Nhập"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-[13px] font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors text-[13px] font-medium"
              >
                <Send className="w-4 h-4" />
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedLog && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowEditModal(false)}
        >
          <div className="bg-white rounded-xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-slate-900 font-bold text-[16px]">Sửa thông báo hệ thống</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-[13px]">
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-2">
                  Tiêu đề <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-2">
                  Nội dung <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-[13px] font-medium"
              >
                Hủy
              </button>
              <button
                onClick={confirmEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[13px] font-medium"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && selectedLog && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => { setShowDeleteConfirm(false); setSelectedLog(null); }}
        >
          <div className="bg-white rounded-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-center text-slate-900 font-bold text-[15px] mb-2">Xác nhận xóa</h3>
              <p className="text-center text-slate-600 text-[13px] mb-6">
                Bạn có chắc chắn muốn xóa thông báo "{selectedLog.title}"?
                <br />Hành động này không thể hoàn tác.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => { setShowDeleteConfirm(false); setSelectedLog(null); }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-[13px] font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors text-[13px] font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
