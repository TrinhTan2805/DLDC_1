import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmModal } from '../../common/ConfirmModal';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../ui/tooltip';
import {
  Badge, TruncatedText, RowIconAction, Pagination,
  BTN_PRIMARY, ROW_ICON_BTN, TOOLTIP_CLS, TABLE_WRAP_CLS, TABLE_HEAD_BG, TABLE_HEAD_ROW_CLS,
  isoToDisplayDate,
} from '../collection/collectionUi';
import {
  Database,
  Download,
  Upload,
  Play,
  CheckCircle2,
  XCircle,
  HardDrive,
  RefreshCw,
  Trash2
} from 'lucide-react';

interface BackupRecord {
  id: string;
  name: string;
  type: 'auto' | 'manual';
  size: string;
  date: string;
  time: string;
  status: 'success' | 'failed' | 'in-progress';
  duration: string;
  location: string;
}

const mockBackups: BackupRecord[] = [
  {
    id: '1',
    name: 'backup_dldc_20241209_020000.sql',
    type: 'auto',
    size: '2.4 GB',
    date: '2024-12-09',
    time: '02:00:00',
    status: 'success',
    duration: '12 phút 34 giây',
    location: '/backups/2024/12/'
  },
  {
    id: '2',
    name: 'backup_dldc_20241208_020000.sql',
    type: 'auto',
    size: '2.3 GB',
    date: '2024-12-08',
    time: '02:00:00',
    status: 'success',
    duration: '11 phút 58 giây',
    location: '/backups/2024/12/'
  },
  {
    id: '3',
    name: 'backup_dldc_20241207_153000_manual.sql',
    type: 'manual',
    size: '2.3 GB',
    date: '2024-12-07',
    time: '15:30:00',
    status: 'success',
    duration: '13 phút 02 giây',
    location: '/backups/2024/12/'
  },
  {
    id: '4',
    name: 'backup_dldc_20241207_020000.sql',
    type: 'auto',
    size: '2.3 GB',
    date: '2024-12-07',
    time: '02:00:00',
    status: 'success',
    duration: '12 phút 15 giây',
    location: '/backups/2024/12/'
  },
  {
    id: '5',
    name: 'backup_dldc_20241206_020000.sql',
    type: 'auto',
    size: '0 B',
    date: '2024-12-06',
    time: '02:00:00',
    status: 'failed',
    duration: '0 giây',
    location: '/backups/2024/12/'
  }
];

// Bảng dữ liệu (compomennt.md 5.3): tiêu đề 42px chữ 13px/700 đen, ô 13px/400 đen, hàng 48px kẻ #E0E0E0
const TH = 'h-[42px] px-3 py-[13px] text-[13px] font-bold text-black whitespace-nowrap';
const TD = 'px-3 py-1 text-[13px] text-black';

// Thẻ thống kê nhỏ (mục 5.6.1)
const STAT_TONES = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  red: 'bg-red-50 text-red-600',
  purple: 'bg-purple-50 text-purple-600',
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

export function BackupPage() {
  const [backups, setBackups] = useState<BackupRecord[]>(mockBackups);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupRecord | null>(null);
  const [backupProgress, setBackupProgress] = useState(0);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleBackupNow = () => {
    setIsBackingUp(true);
    setBackupProgress(0);

    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);

          // Add new backup to list
          const newBackup: BackupRecord = {
            id: String(backups.length + 1),
            name: `backup_dldc_${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}_manual.sql`,
            type: 'manual',
            size: '2.4 GB',
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().split(' ')[0],
            status: 'success',
            duration: '12 phút 45 giây',
            location: '/backups/2024/12/'
          };

          setBackups([newBackup, ...backups]);
          setCurrentPage(1);
          return 0;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleDownload = (backup: BackupRecord) => {
    console.log('Downloading backup:', backup.name);
    toast.info(`Đang khởi chạy tải xuống bản sao lưu: ${backup.name}`);
  };

  const handleRestore = (backup: BackupRecord) => {
    console.log('Restoring backup:', backup.name);
    toast.info(`Đang thực hiện khôi phục hệ thống từ bản sao lưu: ${backup.name}`);
  };

  const openDeleteModal = (backup: BackupRecord) => {
    setSelectedBackup(backup);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedBackup(null);
  };

  const handleDelete = () => {
    if (selectedBackup) {
      const updated = backups.filter(b => b.id !== selectedBackup.id);
      setBackups(updated);
      closeDeleteModal();

      const totalPages = Math.ceil(updated.length / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
    }
  };

  const getStatusText = (status: BackupRecord['status']) => {
    switch (status) {
      case 'success':
        return 'Thành công';
      case 'failed':
        return 'Thất bại';
      case 'in-progress':
        return 'Đang xử lý';
    }
  };

  const successCount = backups.filter(b => b.status === 'success').length;
  const failedCount = backups.filter(b => b.status === 'failed').length;
  const totalSize = backups
    .filter(b => b.status === 'success')
    .reduce((acc, b) => acc + parseFloat(b.size), 0)
    .toFixed(1);

  // Paginated data
  const paginatedBackups = backups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      {/* Tiêu đề trang (H1 20px/700 #2A0F0F) + nút chính */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-[#2A0F0F] leading-8">Sao lưu dự phòng</h1>
          <p className="text-[13px] text-[#64748B]">Quản lý và thực hiện sao lưu dữ liệu hệ thống kho DLDC</p>
        </div>
        <button type="button" onClick={handleBackupNow} disabled={isBackingUp} className={BTN_PRIMARY}>
          <Play className="w-4 h-4" />
          {isBackingUp ? 'Đang sao lưu...' : 'Sao lưu ngay'}
        </button>
      </div>

      {/* Backup Progress */}
      {isBackingUp && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
          <div className="flex items-center gap-3 mb-4">
            <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
            <div>
              <h2 className="text-[14px] font-medium text-[#020817]">Đang thực hiện sao lưu...</h2>
              <p className="text-[12px] text-[#64748B]">Vui lòng không đóng hoặc tải lại trang này</p>
            </div>
          </div>
          <div
            className="w-full bg-[#F1F5F9] rounded-full h-2"
            role="progressbar"
            aria-label="Tiến độ sao lưu"
            aria-valuenow={backupProgress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${backupProgress}%` }}
            />
          </div>
          <div className="text-[12px] text-[#64748B] mt-2 text-right font-medium tabular-nums">{backupProgress}%</div>
        </div>
      )}

      {/* Statistics (mục 5.6.1) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={Database} tone="blue" title="Tổng bản sao lưu" value={backups.length.toString()} />
        <StatCard icon={CheckCircle2} tone="green" title="Thành công" value={successCount.toString()} />
        <StatCard icon={XCircle} tone="red" title="Thất bại" value={failedCount.toString()} />
        <StatCard icon={HardDrive} tone="purple" title="Dung lượng" value={`${totalSize} GB`} />
      </div>

      {/* Backup List Table (mục 5.3) */}
      <div className={TABLE_WRAP_CLS}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className={`${TABLE_HEAD_BG} sticky top-0 z-10`}>
              <tr className={TABLE_HEAD_ROW_CLS}>
                <th className={`${TH} text-center w-14`}>STT</th>
                <th className={`${TH} text-left`}>Tên file</th>
                <th className={`${TH} text-left`}>Loại</th>
                <th className={`${TH} text-left`}>Ngày giờ</th>
                <th className={`${TH} text-right`}>Dung lượng</th>
                <th className={`${TH} text-left`}>Thời gian</th>
                <th className={`${TH} text-left`}>Trạng thái</th>
                <th className={`${TH} text-center sticky right-0 ${TABLE_HEAD_BG}`}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBackups.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 py-10 text-center">
                    <Database className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
                    <p className="text-[13px] font-medium text-[#64748B]">Chưa có bản sao lưu nào</p>
                  </td>
                </tr>
              ) : (
                paginatedBackups.map((backup, index) => {
                  const unavailable = backup.status !== 'success' ? 'Bản sao lưu không thành công' : undefined;
                  return (
                    <tr key={backup.id} className="group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                      <td className={`${TD} text-center tabular-nums`}>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className={`${TD} text-left max-w-[360px]`}>
                        <TruncatedText text={backup.name} className="font-mono" />
                      </td>
                      <td className={`${TD} text-left whitespace-nowrap`}>
                        <Badge
                          label={backup.type === 'auto' ? 'Tự động' : 'Thủ công'}
                          variant={backup.type === 'auto' ? 'blue' : 'purple'}
                        />
                      </td>
                      <td className={`${TD} text-left whitespace-nowrap leading-tight`}>
                        <div>{isoToDisplayDate(backup.date)}</div>
                        <div>{backup.time}</div>
                      </td>
                      <td className={`${TD} text-right whitespace-nowrap tabular-nums`}>
                        {backup.size}
                      </td>
                      <td className={`${TD} text-left whitespace-nowrap`}>
                        {backup.duration}
                      </td>
                      <td className={`${TD} text-left whitespace-nowrap`}>
                        <Badge
                          label={getStatusText(backup.status)}
                          variant={backup.status === 'success' ? 'green' : backup.status === 'failed' ? 'red' : 'amber'}
                        />
                      </td>
                      <td className={`${TD} text-center sticky right-0 bg-white group-hover:bg-[#F8FAFC] transition-colors`}>
                        <div className="inline-flex items-center justify-center gap-1">
                          <RowIconAction label="Tải xuống" onClick={() => handleDownload(backup)} disabledReason={unavailable}>
                            <Download className="w-4 h-4" />
                          </RowIconAction>
                          <RowIconAction label="Khôi phục" onClick={() => handleRestore(backup)} disabledReason={unavailable}>
                            <Upload className="w-4 h-4" />
                          </RowIconAction>
                          {/* Thao tác không hoàn tác: luôn màu đỏ #DC2626 (mục 5.3.2) */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                aria-label="Xóa"
                                onClick={() => openDeleteModal(backup)}
                                className={`${ROW_ICON_BTN} !text-[#DC2626] hover:!bg-[#FEF2F2]`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" sideOffset={4} className={TOOLTIP_CLS}>Xóa</TooltipContent>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (mục 5.14) */}
        <Pagination
          className="border-t border-[#E2E8F0]"
          currentPage={currentPage}
          totalItems={backups.length}
          pageSize={itemsPerPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
        />
      </div>

      {/* Delete Confirmation — hộp thoại xác nhận dùng chung (5.4) */}
      <ConfirmModal
        isOpen={showDeleteModal && !!selectedBackup}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        type="delete"
        title="Xác nhận xóa bản sao lưu"
        subtitle="Hành động này sẽ xóa vĩnh viễn tệp sao lưu và không thể hoàn tác."
        message={selectedBackup && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-left">
            <div className="space-y-1 col-span-2">
              <div className="text-[13px] font-semibold text-[#020817]">Tên file sao lưu</div>
              <div className="text-[13px] text-[#020817] font-mono break-all">{selectedBackup.name}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[13px] font-semibold text-[#020817]">Dung lượng</div>
              <div className="text-[13px] text-[#020817]">{selectedBackup.size}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[13px] font-semibold text-[#020817]">Ngày tạo</div>
              <div className="text-[13px] text-[#020817]">{isoToDisplayDate(selectedBackup.date)}</div>
            </div>
          </div>
        )}
        confirmText="Xóa bản sao lưu"
        cancelText="Hủy"
      />
    </div>
  );
}
