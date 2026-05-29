import { useState } from 'react';
import { StatusTag } from '../../common/StatusTag';
import { StatsCard } from '../../common/StatsCard';
import { 
  Database, 
  Download, 
  Upload, 
  Play, 
  CheckCircle2, 
  Clock, 
  XCircle,
  HardDrive,
  Calendar,
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
    alert(`Đang khởi chạy tải xuống bản sao lưu: ${backup.name}`);
  };

  const handleRestore = (backup: BackupRecord) => {
    console.log('Restoring backup:', backup.name);
    alert(`Đang thực hiện khôi phục hệ thống từ bản sao lưu: ${backup.name}`);
  };

  const openDeleteModal = (backup: BackupRecord) => {
    setSelectedBackup(backup);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (selectedBackup) {
      const updated = backups.filter(b => b.id !== selectedBackup.id);
      setBackups(updated);
      setShowDeleteModal(false);
      setSelectedBackup(null);
      
      const totalPages = Math.ceil(updated.length / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
    }
  };

  const getStatusIcon = (status: BackupRecord['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-3 h-3" />;
      case 'failed':
        return <XCircle className="w-3 h-3" />;
      case 'in-progress':
        return <RefreshCw className="w-3 h-3 animate-spin" />;
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
    <div className="space-y-6" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}>
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100 shadow-sm">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-slate-900 font-bold text-[15px] leading-snug">Sao lưu dự phòng</h2>
              <p className="text-slate-500 text-[12px] mt-0.5">Quản lý và thực hiện sao lưu dữ liệu hệ thống kho DLDC</p>
            </div>
          </div>
          <button
            onClick={handleBackupNow}
            disabled={isBackingUp}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm font-medium text-[13px]"
          >
            <Play className="w-4 h-4" />
            {isBackingUp ? 'Đang sao lưu...' : 'Sao lưu ngay'}
          </button>
        </div>
      </div>

      {/* Backup Progress */}
      {isBackingUp && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
            <div>
              <h3 className="text-slate-900 font-semibold text-[14px]">Đang thực hiện sao lưu...</h3>
              <p className="text-xs text-slate-500">Vui lòng không đóng hoặc tải lại trang này</p>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${backupProgress}%` }}
            />
          </div>
          <div className="text-xs text-slate-500 mt-2 text-right font-medium">{backupProgress}%</div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard icon={Database} iconColor="blue" title="Tổng bản sao lưu" value={backups.length.toString()} />
        <StatsCard icon={CheckCircle2} iconColor="green" title="Thành công" value={successCount.toString()} />
        <StatsCard icon={XCircle} iconColor="red" title="Thất bại" value={failedCount.toString()} />
        <StatsCard icon={HardDrive} iconColor="purple" title="Dung lượng" value={`${totalSize} GB`} />
      </div>

      {/* Backup Schedule Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-[13px] text-blue-800 font-medium">
            <strong>Lịch sao lưu tự động:</strong> Hàng ngày lúc 02:00 AM | 
            <strong className="ml-3">Lưu trữ:</strong> 30 ngày
          </div>
        </div>
      </div>

      {/* Backup List Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse collection-table text-[13px]">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-[1]">
              <tr>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap w-12 text-[13px]">STT</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Tên file</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Loại</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Ngày giờ</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Dung lượng</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Thời gian</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Trạng thái</th>
                <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap w-24 text-[13px]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedBackups.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500 text-[13px]">
                    Chưa có bản sao lưu nào
                  </td>
                </tr>
              ) : (
                paginatedBackups.map((backup, index) => (
                  <tr key={backup.id} className="hover:bg-slate-50 transition-all group border-b border-slate-100">
                    <td className="px-4 py-3 text-center text-slate-500 font-medium text-[13px]">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3 text-center text-[13px]">
                      <div className="flex items-center justify-center gap-2">
                        <Database className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <div className="font-mono text-slate-900 break-all text-[13px] font-medium">
                          {backup.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        <StatusTag 
                          label={backup.type === 'auto' ? 'Tự động' : 'Thủ công'} 
                          variant={backup.type === 'auto' ? 'blue' : 'purple'} 
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-[13px]">
                      <div className="text-slate-900 font-medium">{backup.date}</div>
                      <div className="text-slate-500 mt-0.5 text-[11px]">{backup.time}</div>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-900 font-semibold text-[13px]">
                      {backup.size}
                    </td>
                    <td className="px-4 py-3 text-center text-[13px]">
                      <div className="flex items-center justify-center gap-1.5 text-slate-600">
                        <Clock className="w-3.5 h-3.5" />
                        {backup.duration}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        <StatusTag 
                          label={getStatusText(backup.status)} 
                          variant={backup.status === 'success' ? 'green' : backup.status === 'failed' ? 'red' : 'blue'} 
                          icon={getStatusIcon(backup.status)}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {backup.status === 'success' ? (
                          <>
                            <button
                              onClick={() => handleDownload(backup)}
                              className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                              title="Tải xuống"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRestore(backup)}
                              className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-all"
                              title="Khôi phục"
                            >
                              <Upload className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="w-7 h-7" />
                            <div className="w-7 h-7" />
                          </>
                        )}
                        <button
                          onClick={() => openDeleteModal(backup)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white sm:px-6 collection-pagination text-[13px]">
          <div className="flex items-center gap-2">
            <span className="text-slate-600">Hiển thị</span>
            <select aria-label="Select record count" 
              className="px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-[13px]"
              title="Số bản ghi trên trang"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-slate-600">bản ghi/trang</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-slate-600">
              {backups.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, backups.length)} / {backups.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
              >
                Trước
              </button>
              
              {Array.from({ length: Math.ceil(backups.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 border rounded-lg font-medium text-[13px] transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-[#e2e8f0] text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => {
                  const totalPages = Math.ceil(backups.length / itemsPerPage);
                  if (currentPage < totalPages) {
                    setCurrentPage(currentPage + 1);
                  }
                }}
                disabled={currentPage === Math.ceil(backups.length / itemsPerPage) || backups.length === 0}
                className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedBackup && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowDeleteModal(false);
            setSelectedBackup(null);
          }}
        >
          <div 
            className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-full flex items-center justify-center shrink-0">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-slate-900 font-bold text-[16px] leading-snug">Xác nhận xóa bản sao lưu</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Hành động này sẽ xóa vĩnh viễn tệp sao lưu và không thể hoàn tác.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 mb-5 space-y-3">
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Tên file sao lưu</div>
                  <div className="text-[13px] text-slate-950 font-mono break-all font-medium mt-1">
                    {selectedBackup.name}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Dung lượng</div>
                    <div className="text-[13px] text-slate-950 font-medium mt-1">{selectedBackup.size}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Ngày tạo</div>
                    <div className="text-[13px] text-slate-950 font-medium mt-1">{selectedBackup.date}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-[13px] shadow-sm"
                >
                  Xóa bản sao lưu
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedBackup(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-[13px]"
                >
                  Hủy bộ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}