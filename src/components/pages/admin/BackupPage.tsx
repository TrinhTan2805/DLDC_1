import { useState } from 'react';
import { StatusTag } from '../../common/StatusTag';
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
  AlertCircle,
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
          return 0;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleDownload = (backup: BackupRecord) => {
    console.log('Downloading backup:', backup.name);
    // Download logic here
  };

  const handleRestore = (backup: BackupRecord) => {
    console.log('Restoring backup:', backup.name);
    // Restore logic here
  };

  const openDeleteModal = (backup: BackupRecord) => {
    setSelectedBackup(backup);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (selectedBackup) {
      setBackups(backups.filter(b => b.id !== selectedBackup.id));
      setShowDeleteModal(false);
      setSelectedBackup(null);
    }
  };

  const getStatusIcon = (status: BackupRecord['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'in-progress':
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
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

  const getStatusColor = (status: BackupRecord['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
    }
  };

  const successCount = backups.filter(b => b.status === 'success').length;
  const failedCount = backups.filter(b => b.status === 'failed').length;
  const totalSize = backups
    .filter(b => b.status === 'success')
    .reduce((acc, b) => acc + parseFloat(b.size), 0)
    .toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-slate-900">Sao lưu dự phòng</h2>
            </div>
          </div>
          <button
            onClick={handleBackupNow}
            disabled={isBackingUp}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" />
            {isBackingUp ? 'Đang sao lưu...' : 'Sao lưu ngay'}
          </button>
        </div>
      </div>

      {/* Backup Progress */}
      {isBackingUp && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
            <div>
              <h3 className="text-slate-900">Đang thực hiện sao lưu...</h3>
              <p className="text-sm text-slate-600">Vui lòng không đóng trang này</p>
            </div>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${backupProgress}%` }}
            />
          </div>
          <div className="text-sm text-slate-600 mt-2 text-right">{backupProgress}%</div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-slate-600">Tổng bản sao lưu</div>
              <div className="text-2xl text-slate-900">{backups.length}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-slate-600">Thành công</div>
              <div className="text-2xl text-green-600">{successCount}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-sm text-slate-600">Thất bại</div>
              <div className="text-2xl text-red-600">{failedCount}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-slate-600">Dung lượng</div>
              <div className="text-2xl text-purple-600">{totalSize} GB</div>
            </div>
          </div>
        </div>
      </div>

      {/* Backup Schedule Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <strong>Lịch sao lưu tự động:</strong> Hàng ngày lúc 02:00 AM | 
            <strong className="ml-2">Lưu trữ:</strong> 30 ngày | 
            <strong className="ml-2">Vị trí:</strong> /backups/
          </div>
        </div>
      </div>

      {/* Backup List */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-slate-900">Danh sách bản sao lưu</h3>
          <p className="text-sm text-slate-600 mt-1">
            Các bản sao lưu được sắp xếp theo thời gian mới nhất
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">
                  Tên file
                </th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">
                  Ngày giờ
                </th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">
                  Dung lượng
                </th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs text-slate-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {backups.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    Chưa có bản sao lưu nào
                  </td>
                </tr>
              ) : (
                backups.map((backup) => (
                  <tr key={backup.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <div className="text-sm text-slate-900 font-mono break-all">
                          {backup.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusTag 
                        label={backup.type === 'auto' ? 'Tự động' : 'Thủ công'} 
                        variant={backup.type === 'auto' ? 'blue' : 'purple'} 
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{backup.date}</div>
                      <div className="text-xs text-slate-600">{backup.time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{backup.size}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <Clock className="w-3.5 h-3.5" />
                        {backup.duration}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusTag 
                        label={getStatusText(backup.status)} 
                        variant={backup.status === 'success' ? 'green' : backup.status === 'failed' ? 'red' : 'blue'} 
                        icon={getStatusIcon(backup.status)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {backup.status === 'success' && (
                          <>
                            <button
                              onClick={() => handleDownload(backup)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Tải xuống"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRestore(backup)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Khôi phục"
                            >
                              <Upload className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => openDeleteModal(backup)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
      </div>

      {/* Warning Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="mb-2">
              <strong>Lưu ý quan trọng:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Khuyến nghị thực hiện sao lưu thủ công trước khi thực hiện các thao tác quan trọng</li>
              <li>Bản sao lưu tự động được thực hiện vào lúc 02:00 AM hàng ngày để tránh ảnh hưởng đến hoạt động</li>
              <li>Các bản sao lưu cũ hơn 30 ngày sẽ tự động bị xóa để tiết kiệm dung lượng</li>
              <li>Quá trình khôi phục dữ liệu sẽ ghi đè lên toàn bộ dữ liệu hiện tại</li>
              <li>Đảm bảo có đủ dung lượng lưu trữ trước khi thực hiện sao lưu</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedBackup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-slate-900">Xác nhận xóa bản sao lưu</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Hành động này không thể hoàn tác
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <div className="text-sm text-slate-600 mb-1">Tên file:</div>
                <div className="text-sm text-slate-900 font-mono break-all mb-2">
                  {selectedBackup.name}
                </div>
                <div className="text-sm text-slate-600 mb-1">Dung lượng:</div>
                <div className="text-sm text-slate-900">{selectedBackup.size}</div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Xóa bản sao lưu
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedBackup(null);
                  }}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}