import { useState } from 'react';
import { toast } from 'sonner';
import { 
  Clock, 
  Search, 
  Download, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Save, 
  Database, 
  Shield, 
  CheckCircle2, 
  FileText
} from 'lucide-react';
import { ConfirmModal } from '../../common/ConfirmModal';
import {
  Badge, TruncatedText, RowIconAction, Pagination,
  BTN_PRIMARY, BTN_OUTLINE, BTN_GHOST_ICON, INPUT_CLS, LABEL_CLS, REQUIRED_MARK,
  SEARCH_INPUT_CLS, SEARCH_BTN_CLS, tabClass, TABLE_WRAP_CLS, TABLE_HEAD_BG, TABLE_HEAD_ROW_CLS,
  normalizeSearch, formatDateVN,
} from '../collection/collectionUi';

interface LogRetentionConfig {
  id: number;
  logType: 'access' | 'error' | 'account' | 'config' | 'system' | 'security';
  logTypeName: string;
  retentionDays: number;
  description: string;
  isActive: boolean;
  lastUpdated: string;
  updatedBy: string;
}

const initialConfigs: LogRetentionConfig[] = [
  {
    id: 1,
    logType: 'access',
    logTypeName: 'Nhật ký truy cập',
    retentionDays: 90,
    description: 'Lưu trữ nhật ký đăng nhập và truy cập hệ thống',
    isActive: true,
    lastUpdated: '15/12/2024 10:30:00',
    updatedBy: 'Admin Hệ thống'
  },
  {
    id: 2,
    logType: 'error',
    logTypeName: 'Nhật ký lỗi phát sinh',
    retentionDays: 180,
    description: 'Lưu trữ các lỗi phát sinh trong quá trình hoạt động',
    isActive: true,
    lastUpdated: '15/12/2024 10:30:00',
    updatedBy: 'Admin Hệ thống'
  },
  {
    id: 3,
    logType: 'account',
    logTypeName: 'Nhật ký quản lý tài khoản',
    retentionDays: 365,
    description: 'Lưu trữ các thao tác quản lý tài khoản người dùng',
    isActive: true,
    lastUpdated: '15/12/2024 10:30:00',
    updatedBy: 'Admin Hệ thống'
  },
  {
    id: 4,
    logType: 'config',
    logTypeName: 'Nhật ký thay đổi cấu hình',
    retentionDays: 365,
    description: 'Lưu trữ các thay đổi cấu hình hệ thống',
    isActive: true,
    lastUpdated: '15/12/2024 10:30:00',
    updatedBy: 'Admin Hệ thống'
  },
  {
    id: 5,
    logType: 'system',
    logTypeName: 'Nhật ký hệ thống',
    retentionDays: 90,
    description: 'Lưu trữ các sự kiện hệ thống',
    isActive: true,
    lastUpdated: '15/12/2024 10:30:00',
    updatedBy: 'Admin Hệ thống'
  },
  {
    id: 6,
    logType: 'security',
    logTypeName: 'Nhật ký bảo mật',
    retentionDays: 730,
    description: 'Lưu trữ các sự kiện liên quan đến bảo mật',
    isActive: true,
    lastUpdated: '15/12/2024 10:30:00',
    updatedBy: 'Admin Hệ thống'
  }
];

// Bảng dữ liệu (compomennt.md 5.3): tiêu đề 42px chữ 13px/700 đen, ô 13px/400 đen, hàng 48px kẻ #E0E0E0
const TH = 'h-[42px] px-3 py-[13px] text-[13px] font-bold text-black whitespace-nowrap';
const TD = 'px-3 py-1 text-[13px] text-black';
const SUB_TEXT = 'text-[12px] text-[#64748B]';

// Thẻ thống kê nhỏ (mục 5.6.1)
const STAT_TONES = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  orange: 'bg-orange-50 text-orange-600',
} as const;

const StatCard = ({ icon: Icon, tone, title, value }: { icon: typeof Database; tone: keyof typeof STAT_TONES; title: string; value: string }) => (
  <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${STAT_TONES[tone]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-[16px] text-[#64748B]">{title}</div>
        <div className="text-[16px] font-semibold text-[#0F172A] tabular-nums">{value}</div>
      </div>
    </div>
  </div>
);

/**
 * embedded = true khi trang được nhúng làm tab trong "Nhật ký thay đổi cấu hình"
 * (trang cha đã có thanh tab) → không vẽ thanh tab riêng để tránh 2 thanh tab chồng nhau.
 */
export function LogRetentionConfigPage({ embedded = false }: { embedded?: boolean }) {
  const [configs, setConfigs] = useState<LogRetentionConfig[]>(initialConfigs);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedTerm, setAppliedTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<LogRetentionConfig | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form state
  const [formData, setFormData] = useState({
    logTypeName: '',
    retentionDays: 90,
    description: '',
    isActive: true
  });

  // Tìm kiếm chỉ áp dụng khi bấm nút Tìm kiếm hoặc Enter (mục 5.19)
  const runSearch = () => {
    setAppliedTerm(normalizeSearch(searchTerm));
    setCurrentPage(1);
  };

  const filteredConfigs = configs.filter(config =>
    normalizeSearch(config.logTypeName).includes(appliedTerm) ||
    normalizeSearch(config.description).includes(appliedTerm)
  );

  const handleAdd = () => {
    setFormData({
      logTypeName: '',
      retentionDays: 90,
      description: '',
      isActive: true
    });
    setShowAddModal(true);
  };

  const handleEdit = (config: LogRetentionConfig) => {
    setSelectedConfig(config);
    setFormData({
      logTypeName: config.logTypeName,
      retentionDays: config.retentionDays,
      description: config.description,
      isActive: config.isActive
    });
    setShowEditModal(true);
  };

  const handleDelete = (config: LogRetentionConfig) => {
    setSelectedConfig(config);
    setShowDeleteConfirm(true);
  };

  const confirmAdd = () => {
    if (!formData.logTypeName || formData.retentionDays <= 0) {
      toast.error('Vui lòng nhập đầy đủ thông tin hợp lệ!');
      return;
    }

    const newConfig: LogRetentionConfig = {
      id: Math.max(...configs.map(c => c.id)) + 1,
      logType: 'system',
      logTypeName: formData.logTypeName,
      retentionDays: formData.retentionDays,
      description: formData.description,
      isActive: formData.isActive,
      lastUpdated: formatDateVN(new Date(), true),
      updatedBy: 'Admin Hệ thống'
    };

    setConfigs([...configs, newConfig]);
    setShowAddModal(false);
    toast.success('Thêm mới cấu hình thành công!');
  };

  const confirmEdit = () => {
    if (!selectedConfig || !formData.logTypeName || formData.retentionDays <= 0) {
      toast.error('Vui lòng nhập đầy đủ thông tin hợp lệ!');
      return;
    }

    const updatedConfigs = configs.map(config =>
      config.id === selectedConfig.id
        ? {
            ...config,
            logTypeName: formData.logTypeName,
            retentionDays: formData.retentionDays,
            description: formData.description,
            isActive: formData.isActive,
            lastUpdated: formatDateVN(new Date(), true),
            updatedBy: 'Admin Hệ thống'
          }
        : config
    );

    setConfigs(updatedConfigs);
    setShowEditModal(false);
    setSelectedConfig(null);
    toast.success('Cập nhật cấu hình thành công!');
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setSelectedConfig(null);
  };

  const confirmDelete = () => {
    if (!selectedConfig) return;

    setConfigs(configs.filter(config => config.id !== selectedConfig.id));
    closeDeleteConfirm();
    toast.success('Xóa cấu hình thành công!');
  };

  const handleExportExcel = () => {
    toast.info('Đang kết xuất danh sách cấu hình lưu trữ nhật ký ra file Excel...');
  };

  const averageRetention = Math.round(
    configs.reduce((sum, c) => sum + c.retentionDays, 0) / configs.length
  );

  // Form Thêm mới / Sửa dùng chung (mục 5.2)
  const renderForm = (idPrefix: string) => (
    <div className="space-y-4">
      <div>
        <label htmlFor={`${idPrefix}-name`} className={LABEL_CLS}>
          Tên loại nhật ký <span className={REQUIRED_MARK}>*</span>
        </label>
        <input
          id={`${idPrefix}-name`}
          type="text"
          value={formData.logTypeName}
          onChange={(e) => setFormData({...formData, logTypeName: e.target.value})}
          className={INPUT_CLS}
          placeholder="Nhập tên loại nhật ký..."
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-days`} className={LABEL_CLS}>
          Thời gian lưu trữ (ngày) <span className={REQUIRED_MARK}>*</span>
        </label>
        <input
          id={`${idPrefix}-days`}
          type="number"
          min="1"
          value={formData.retentionDays}
          onChange={(e) => setFormData({...formData, retentionDays: parseInt(e.target.value) || 0})}
          className={INPUT_CLS}
          placeholder="Nhập số ngày..."
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-desc`} className={LABEL_CLS}>Mô tả</label>
        <textarea
          id={`${idPrefix}-desc`}
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={3}
          className={INPUT_CLS.replace('h-10', 'py-2')}
          placeholder="Nhập mô tả..."
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={`${idPrefix}-active`}
          checked={formData.isActive}
          onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
          className="w-4 h-4 rounded accent-blue-600 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600"
        />
        <label htmlFor={`${idPrefix}-active`} className="text-[13px] font-semibold text-[#020817] cursor-pointer">Kích hoạt</label>
      </div>
    </div>
  );

  // Khung modal form (mục 5.4): header/footer cố định, tiêu đề 16px/500, footer nền #F8FAFC
  const renderFormModal = (title: string, idPrefix: string, onClose: () => void, onSubmit: () => void, submitText: string) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${idPrefix}-title`}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h3 id={`${idPrefix}-title`} className="text-[16px] font-semibold text-[#020817]">{title}</h3>
          <button type="button" onClick={onClose} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-6 py-4">
          {renderForm(idPrefix)}
        </div>
        <div className="shrink-0 px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
          <button type="button" onClick={onClose} className={BTN_OUTLINE}>Hủy</button>
          <button type="button" onClick={onSubmit} className={BTN_PRIMARY}>
            <Save className="w-4 h-4" />
            {submitText}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Thanh tab riêng chỉ khi mở trang độc lập (mục 5.9) */}
      {!embedded && (
        <div className="flex border-b border-[#E2E8F0]" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={false}
            onClick={() => {
              if (typeof (window as any).navigateToPage === 'function') {
                (window as any).navigateToPage('admin-config-log');
              }
            }}
            className={tabClass(false)}
          >
            <FileText className="w-4 h-4" />
            Nhật ký thay đổi cấu hình
          </button>
          <button type="button" role="tab" aria-selected className={tabClass(true)}>
            <Clock className="w-4 h-4" />
            Quản lý thời gian lưu trữ nhật ký
          </button>
        </div>
      )}

      {/* Thẻ thống kê nhỏ (mục 5.6.1) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={Database} tone="blue" title="Tổng loại nhật ký" value={configs.length.toString()} />
        <StatCard icon={Clock} tone="green" title="Thời gian TB (ngày)" value={averageRetention.toString()} />
        <StatCard icon={CheckCircle2} tone="green" title="Đang hoạt động" value={configs.filter(c => c.isActive).length.toString()} />
        <StatCard icon={Shield} tone="orange" title="Lưu trữ lâu nhất (ngày)" value={Math.max(...configs.map(c => c.retentionDays)).toString()} />
      </div>

      {/* Tìm kiếm & thao tác (mục 5.19) */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-1.5">
          <input
            aria-label="Tìm kiếm loại nhật ký"
            type="text"
            placeholder="Tìm kiếm theo loại nhật ký, mô tả"
            className={SEARCH_INPUT_CLS}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runSearch()}
          />
          <button type="button" onClick={runSearch} className={SEARCH_BTN_CLS} aria-label="Tìm kiếm" title="Tìm kiếm">
            <Search className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button type="button" onClick={handleAdd} className={BTN_PRIMARY}>
            <Plus className="w-4 h-4" />
            Thêm mới
          </button>
          <button type="button" onClick={handleExportExcel} className={BTN_OUTLINE}>
            <Download className="w-4 h-4" />
            Kết xuất
          </button>
        </div>
      </div>

      {/* Config Table (mục 5.3) */}
      <div className={TABLE_WRAP_CLS}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className={`${TABLE_HEAD_BG} sticky top-0 z-10`}>
              <tr className={TABLE_HEAD_ROW_CLS}>
                <th className={`${TH} text-center w-14`}>STT</th>
                <th className={`${TH} text-left`}>Loại nhật ký</th>
                <th className={`${TH} text-right`}>Thời gian lưu trữ</th>
                <th className={`${TH} text-left`}>Mô tả</th>
                <th className={`${TH} text-left`}>Trạng thái</th>
                <th className={`${TH} text-left`}>Cập nhật lần cuối</th>
                <th className={`${TH} text-center w-24 sticky right-0 ${TABLE_HEAD_BG}`}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredConfigs
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((config, index) => (
                  <tr key={config.id} className="group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                    <td className={`${TD} text-center tabular-nums`}>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className={`${TD} text-left whitespace-nowrap`}>
                      {config.logTypeName}
                    </td>
                    <td className={`${TD} text-right whitespace-nowrap tabular-nums`}>
                      {config.retentionDays} ngày
                    </td>
                    <td className={`${TD} text-left max-w-[400px]`}>
                      <TruncatedText text={config.description} />
                    </td>
                    <td className={`${TD} text-left whitespace-nowrap`}>
                      <Badge label={config.isActive ? 'Hoạt động' : 'Tạm dừng'} variant={config.isActive ? 'green' : 'slate'} />
                    </td>
                    <td className={`${TD} text-left whitespace-nowrap leading-[18px] tabular-nums`}>
                      <div>{config.lastUpdated}</div>
                      <div className={SUB_TEXT}>{config.updatedBy}</div>
                    </td>
                    <td className={`${TD} text-center sticky right-0 bg-white group-hover:bg-[#F8FAFC] transition-colors`}>
                      <div className="inline-flex items-center justify-center gap-1">
                        <RowIconAction label="Sửa" onClick={() => handleEdit(config)}>
                          <Edit className="w-4 h-4" />
                        </RowIconAction>
                        {/* Thao tác không hoàn tác: luôn màu đỏ #DC2626 (mục 5.3.2) */}
                        <RowIconAction label="Xóa" onClick={() => handleDelete(config)}>
                          <Trash2 className="w-4 h-4 text-[#DC2626]" />
                        </RowIconAction>
                      </div>
                    </td>
                  </tr>
                ))}
              {filteredConfigs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-10 text-center">
                    <Clock className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
                    <p className="text-[13px] font-medium text-[#64748B]">Không tìm thấy bản ghi nào phù hợp</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (mục 5.14) */}
        <Pagination
          className="border-t border-[#E2E8F0]"
          currentPage={currentPage}
          totalItems={filteredConfigs.length}
          pageSize={itemsPerPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
        />
      </div>

      {/* Add Modal */}
      {showAddModal && renderFormModal('Thêm mới cấu hình', 'retention-add', () => setShowAddModal(false), confirmAdd, 'Lưu')}

      {/* Edit Modal */}
      {showEditModal && selectedConfig && renderFormModal('Sửa cấu hình', 'retention-edit', () => setShowEditModal(false), confirmEdit, 'Cập nhật')}

      {/* Delete Confirmation — hộp thoại xác nhận dùng chung (5.4) */}
      <ConfirmModal
        isOpen={showDeleteConfirm && !!selectedConfig}
        onClose={closeDeleteConfirm}
        onConfirm={confirmDelete}
        type="delete"
        title="Xác nhận xóa"
        subtitle="Hành động này không thể hoàn tác."
        message={<>Bạn có chắc chắn muốn xóa cấu hình <span className="font-medium">"{selectedConfig?.logTypeName}"</span>?</>}
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  );
}
