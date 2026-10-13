import { confirmDialog } from '../common/confirmDialog';
import { toast } from 'sonner';
import { useState } from 'react';
import { X, Database, AlertTriangle, Eye, CheckCircle, XCircle, History as HistoryIcon, FileText, Send, RefreshCw } from 'lucide-react';

interface MasterDataRecord {
  id: string;
  recordCode: string;
  data: Record<string, any>;
  status: 'pending' | 'updated' | 'approved' | 'rejected';
  isDuplicate?: boolean;
  changes?: ChangeLog[];
  updatedBy?: string;
  updatedDate?: string;
  reason?: string;
}

interface ChangeLog {
  field: string;
  oldValue: any;
  newValue: any;
  changedDate: string;
  changedBy: string;
}

interface UpdateMasterDataModalProps {
  onClose: () => void;
  entityName: string;
  entityId: string;
}

export function UpdateMasterDataModal({ onClose, entityName, entityId }: UpdateMasterDataModalProps) {
  const [currentStep, setCurrentStep] = useState<'list' | 'detect-duplicate' | 'review-changes' | 'approval'>('list');
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [viewingRecord, setViewingRecord] = useState<MasterDataRecord | null>(null);
  const [showChangeDetail, setShowChangeDetail] = useState<MasterDataRecord | null>(null);

  // Dữ liệu mẫu
  const [records, setRecords] = useState<MasterDataRecord[]>([
    {
      id: '1',
      recordCode: 'MD_20241200001',
      data: {
        cccd: '001234567890',
        hoTen: 'Nguyễn Văn A',
        ngaySinh: '1990-01-15',
        gioiTinh: 'Nam',
        diaChi: 'Hà Nội'
      },
      status: 'updated',
      isDuplicate: true,
      changes: [
        { field: 'Địa chỉ', oldValue: 'Hà Nội, Việt Nam', newValue: 'Hà Nội', changedDate: '2024-12-09 10:30', changedBy: 'Nguyễn Thị B' }
      ],
      updatedBy: 'Nguyễn Thị B',
      updatedDate: '2024-12-09'
    },
    {
      id: '2',
      recordCode: 'MD_20241200002',
      data: {
        cccd: '001234567891',
        hoTen: 'Trần Thị C',
        ngaySinh: '1992-05-20',
        gioiTinh: 'Nữ',
        diaChi: 'TP. HCM'
      },
      status: 'updated',
      isDuplicate: false,
      changes: [
        { field: 'Họ tên', oldValue: 'Trần Thị Cẩm', newValue: 'Trần Thị C', changedDate: '2024-12-09 11:00', changedBy: 'Lê Văn D' },
        { field: 'Địa chỉ', oldValue: 'Sài Gòn', newValue: 'TP. HCM', changedDate: '2024-12-09 11:00', changedBy: 'Lê Văn D' }
      ],
      updatedBy: 'Lê Văn D',
      updatedDate: '2024-12-09'
    },
    {
      id: '3',
      recordCode: 'MD_20241200003',
      data: {
        cccd: '001234567892',
        hoTen: 'Phạm Văn E',
        ngaySinh: '1988-12-10',
        gioiTinh: 'Nam',
        diaChi: 'Đà Nẵng'
      },
      status: 'pending',
      isDuplicate: false,
      changes: [],
      updatedBy: 'Hoàng Thị F',
      updatedDate: '2024-12-09'
    }
  ]);

  const handleSelectRecord = (id: string) => {
    if (selectedRecords.includes(id)) {
      setSelectedRecords(selectedRecords.filter(r => r !== id));
    } else {
      setSelectedRecords([...selectedRecords, id]);
    }
  };

  const handleApproveRecords = async () => {
    if (selectedRecords.length === 0) {
      toast.warning('Vui lòng chọn ít nhất 1 bản ghi để phê duyệt');
      return;
    }
    
    if ((await confirmDialog(`Phê duyệt ${selectedRecords.length} bản ghi đã chọn?`, { type: 'info', title: 'Xác nhận phê duyệt', confirmText: 'Phê duyệt' }))) {
      setRecords(records.map(record => 
        selectedRecords.includes(record.id) 
          ? { ...record, status: 'approved' as const }
          : record
      ));
      toast.success(`Đã phê duyệt ${selectedRecords.length} bản ghi thành công`);
      setSelectedRecords([]);
    }
  };

  const handleRejectRecord = (id: string) => {
    const reason = prompt('Nhập lý do từ chối:');
    if (reason) {
      setRecords(records.map(record => 
        record.id === id 
          ? { ...record, status: 'rejected' as const, reason }
          : record
      ));
      toast.success('Đã từ chối bản ghi');
    }
  };

  const handleRevokeApproval = async (id: string) => {
    if ((await confirmDialog('Hủy phê duyệt bản ghi này?', { type: 'warning', title: 'Xác nhận hủy phê duyệt', confirmText: 'Hủy phê duyệt' }))) {
      setRecords(records.map(record => 
        record.id === id 
          ? { ...record, status: 'updated' as const }
          : record
      ));
      toast.success('Đã hủy phê duyệt bản ghi');
    }
  };

  const statusColors = {
    pending: 'bg-slate-100 text-slate-700',
    updated: 'bg-blue-100 text-blue-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };

  const statusLabels = {
    pending: 'Chờ cập nhật',
    updated: 'Đã cập nhật',
    approved: 'Đã phê duyệt',
    rejected: 'Từ chối',
  };

  const stats = {
    total: records.length,
    pending: records.filter(r => r.status === 'pending').length,
    updated: records.filter(r => r.status === 'updated').length,
    approved: records.filter(r => r.status === 'approved').length,
    rejected: records.filter(r => r.status === 'rejected').length,
    duplicates: records.filter(r => r.isDuplicate).length,
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-slate-900">Cập nhật dữ liệu chủ</h2>
              <p className="text-sm text-slate-500">{entityName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Đóng" aria-label="Đóng"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Stats */}
        <div className="p-6 border-b border-slate-200">
          <div className="grid grid-cols-6 gap-4">
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-xs text-slate-600 mb-1">Tổng số</div>
              <div className="text-xl text-slate-900">{stats.total}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-xs text-slate-600 mb-1">Chờ cập nhật</div>
              <div className="text-xl text-slate-700">{stats.pending}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-xs text-blue-700 mb-1">Đã cập nhật</div>
              <div className="text-xl text-blue-900">{stats.updated}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-xs text-green-700 mb-1">Đã phê duyệt</div>
              <div className="text-xl text-green-900">{stats.approved}</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <div className="text-xs text-red-700 mb-1">Từ chối</div>
              <div className="text-xl text-red-900">{stats.rejected}</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="text-xs text-orange-700 mb-1">Trùng lặp</div>
              <div className="text-xl text-orange-900">{stats.duplicates}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 pb-2 border-b border-slate-200">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentStep('list')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                currentStep === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Danh sách bản ghi
            </button>
            <button
              onClick={() => setCurrentStep('detect-duplicate')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                currentStep === 'detect-duplicate'
                  ? 'bg-orange-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              Phát hiện trùng lặp ({stats.duplicates})
            </button>
            <button
              onClick={() => setCurrentStep('review-changes')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                currentStep === 'review-changes'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <HistoryIcon className="w-4 h-4" />
              Rà soát thay đổi
            </button>
            <button
              onClick={() => setCurrentStep('approval')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                currentStep === 'approval'
                  ? 'bg-green-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Phê duyệt ({stats.updated})
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* List View */}
          {currentStep === 'list' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-slate-900">Danh sách bản ghi dữ liệu chủ</h3>
                <div className="flex gap-2">
                  <button className="px-3 py-2 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Làm mới
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRecords(records.map(r => r.id));
                            } else {
                              setSelectedRecords([]);
                            }
                          }}
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600">MÃ BẢN GHI</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600">CCCD</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600">HỌ TÊN</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600">NGÀY SINH</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600">TRẠNG THÁI</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-600">NGƯỜI CẬP NHẬT</th>
                      <th className="px-4 py-3 text-right text-xs text-slate-600">THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {records.map((record) => (
                      <tr key={record.id} className={`hover:bg-slate-50 transition-colors ${record.isDuplicate ? 'bg-orange-50' : ''}`}>
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded"
                            checked={selectedRecords.includes(record.id)}
                            onChange={() => handleSelectRecord(record.id)}
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-900 font-mono">
                          {record.recordCode}
                          {record.isDuplicate && (
                            <span className="ml-2 px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs rounded">
                              Trùng lặp
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">{record.data.cccd}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{record.data.hoTen}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{record.data.ngaySinh}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs ${statusColors[record.status]}`}>
                            {statusLabels[record.status]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {record.updatedBy}
                          <div className="text-xs text-slate-500">{record.updatedDate}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setViewingRecord(record)}
                              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {record.changes && record.changes.length > 0 && (
                              <button
                                onClick={() => setShowChangeDetail(record)}
                                className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                                title="Xem lịch sử thay đổi"
                              >
                                <HistoryIcon className="w-4 h-4" />
                              </button>
                            )}
                            {record.status === 'updated' && (
                              <button
                                onClick={() => handleSelectRecord(record.id)}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                                title="Phê duyệt"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            {record.status === 'approved' && (
                              <button
                                onClick={() => handleRevokeApproval(record.id)}
                                className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                                title="Hủy phê duyệt"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Detect Duplicate View */}
          {currentStep === 'detect-duplicate' && (
            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-orange-900 mb-1">Phát hiện trùng lặp</h3>
                    <p className="text-sm text-orange-800">
                      Hệ thống phát hiện {stats.duplicates} bản ghi có khả năng trùng lặp dựa trên các tiêu chí: CCCD, Họ tên, Ngày sinh
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {records.filter(r => r.isDuplicate).map((record) => (
                  <div key={record.id} className="border border-orange-200 rounded-lg p-4 bg-orange-50/50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-sm text-slate-900 font-medium mb-1">{record.recordCode}</div>
                        <div className="text-sm text-slate-600">
                          {record.data.hoTen} - {record.data.cccd}
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                        Trùng lặp khả nghi
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Hợp nhất bản ghi
                      </button>
                      <button className="px-3 py-2 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                        Đánh dấu "Không trùng"
                      </button>
                      <button
                        onClick={() => setShowChangeDetail(record)}
                        className="px-3 py-2 text-sm border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review Changes View */}
          {currentStep === 'review-changes' && (
            <div className="space-y-4">
              <h3 className="text-slate-900">Rà soát các thay đổi</h3>
              
              <div className="space-y-3">
                {records.filter(r => r.changes && r.changes.length > 0).map((record) => (
                  <div key={record.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-sm text-slate-900 font-medium mb-1">{record.recordCode}</div>
                        <div className="text-sm text-slate-600">
                          {record.data.hoTen} - Có {record.changes?.length || 0} thay đổi
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs ${statusColors[record.status]}`}>
                        {statusLabels[record.status]}
                      </span>
                    </div>

                    <div className="space-y-2 mb-3">
                      {record.changes?.map((change, idx) => (
                        <div key={idx} className="bg-slate-50 rounded p-3 text-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-700 font-medium">{change.field}</span>
                            <span className="text-xs text-slate-500">{change.changedDate}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="text-xs text-slate-500 mb-1">Giá trị cũ:</div>
                              <div className="text-slate-900 bg-red-50 border border-red-200 rounded px-2 py-1">
                                {change.oldValue}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-500 mb-1">Giá trị mới:</div>
                              <div className="text-slate-900 bg-green-50 border border-green-200 rounded px-2 py-1">
                                {change.newValue}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-slate-500 mt-2">
                            Người thay đổi: {change.changedBy}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      {record.status === 'updated' && (
                        <>
                          <button
                            onClick={() => {
                              handleSelectRecord(record.id);
                              setCurrentStep('approval');
                            }}
                            className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                          >
                            <Send className="w-4 h-4" />
                            Gửi phê duyệt
                          </button>
                          <button
                            onClick={() => handleRejectRecord(record.id)}
                            className="px-3 py-2 text-sm border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            Từ chối
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Approval View */}
          {currentStep === 'approval' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-slate-900">Phê duyệt bản ghi ({selectedRecords.length} đã chọn)</h3>
                {selectedRecords.length > 0 && (
                  <button
                    onClick={handleApproveRecords}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Phê duyệt {selectedRecords.length} bản ghi
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {records.filter(r => r.status === 'updated' || selectedRecords.includes(r.id)).map((record) => (
                  <div key={record.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded mt-0.5"
                        checked={selectedRecords.includes(record.id)}
                        onChange={() => handleSelectRecord(record.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="text-sm text-slate-900 font-medium mb-1">{record.recordCode}</div>
                            <div className="text-sm text-slate-600">{record.data.hoTen} - {record.data.cccd}</div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs ${statusColors[record.status]}`}>
                            {statusLabels[record.status]}
                          </span>
                        </div>

                        {record.changes && record.changes.length > 0 && (
                          <div className="text-sm text-slate-600 mb-2">
                            Có {record.changes.length} thay đổi cần phê duyệt
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowChangeDetail(record)}
                            className="px-3 py-1.5 text-xs border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors"
                          >
                            Xem chi tiết thay đổi
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4 flex justify-between bg-slate-50">
          <div className="text-sm text-slate-600">
            {selectedRecords.length > 0 && (
              <span>Đã chọn: <strong>{selectedRecords.length}</strong> bản ghi</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>

      {/* View Record Detail Modal */}
      {viewingRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="border-b border-slate-200 px-6 py-4">
              <h3 className="text-slate-900">Chi tiết bản ghi</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Mã bản ghi</label>
                  <p className="text-slate-900 font-mono">{viewingRecord.recordCode}</p>
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Trạng thái</label>
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs ${statusColors[viewingRecord.status]}`}>
                    {statusLabels[viewingRecord.status]}
                  </span>
                </div>
                {Object.entries(viewingRecord.data).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm text-slate-500 mb-1">{key}</label>
                    <p className="text-slate-900">{value as string}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-slate-200 px-6 py-4 flex justify-end">
              <button
                onClick={() => setViewingRecord(null)}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Detail Modal */}
      {showChangeDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full">
            <div className="border-b border-slate-200 px-6 py-4">
              <h3 className="text-slate-900">Lịch sử thay đổi - {showChangeDetail.recordCode}</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {showChangeDetail.changes?.map((change, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-slate-900 font-medium">{change.field}</h4>
                      <span className="text-xs text-slate-500">{change.changedDate}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-slate-500 mb-2">Giá trị cũ:</div>
                        <div className="bg-red-50 border border-red-200 rounded p-3">
                          <code className="text-sm text-red-900">{change.oldValue}</code>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-2">Giá trị mới:</div>
                        <div className="bg-green-50 border border-green-200 rounded p-3">
                          <code className="text-sm text-green-900">{change.newValue}</code>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-600">
                      Người thay đổi: <strong>{change.changedBy}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-slate-200 px-6 py-4 flex justify-end">
              <button
                onClick={() => setShowChangeDetail(null)}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}