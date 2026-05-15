import { CheckCircle, Clock, Database, FileText, Eye, AlertTriangle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { DataTableViewer } from '../data-collection/DataTableViewer';
import { ValidationDetailsModal } from './ValidationDetailsModal';

const receivedData = [
  {
    id: 1,
    transaction: 'TXN-2025120701234',
    source: 'Hộ tịch điện tử',
    sourceId: 'SRC-HT-001',
    receiveTime: '10:30:18 - 07/12/2025',
    dataType: 'Hồ sơ đăng ký khai sinh',
    format: 'JSON',
    records: 2345,
    size: '12.5 MB',
    status: 'received',
    nextStep: 'Đang chờ kiểm tra',
    validationStatus: 'pending',
    validationResults: null
  },
  {
    id: 2,
    transaction: 'TXN-2025120701235',
    source: 'Thi hành án dân sự',
    sourceId: 'SRC-THADS-002',
    receiveTime: '10:25:12 - 07/12/2025',
    dataType: 'Hồ sơ thi hành án',
    format: 'XML',
    records: 1892,
    size: '8.3 MB',
    status: 'received',
    nextStep: 'Đang kiểm tra',
    validationStatus: 'completed',
    validationResults: {
      passed: 1858,
      failed: 34,
      warnings: 12,
      notifications: 5,
      responsesReceived: 3,
      responsesTotal: 5
    },
    errorList: [
      { mã_bản_ghi: 'THA-001', trường_lỗi: 'so_cccd', loại_lỗi: 'Thiếu dữ liệu', mô_tả: 'Trường so_cccd bắt buộc nhưng để trống' },
      { mã_bản_ghi: 'THA-005', trường_lỗi: 'so_cccd', loại_lỗi: 'Thiếu dữ liệu', mô_tả: 'Trường so_cccd bắt buộc nhưng để trống' },
      { mã_bản_ghi: 'THA-012', trường_lỗi: 'so_cccd', loại_lỗi: 'Thiếu dữ liệu', mô_tả: 'Trường so_cccd bắt buộc nhưng để trống' },
      { mã_bản_ghi: 'THA-023', trường_lỗi: 'ngay_sinh', loại_lỗi: 'Định dạng sai', mô_tả: 'Ngày sinh không đúng định dạng DD/MM/YYYY' },
      { mã_bản_ghi: 'THA-034', trường_lỗi: 'ngay_sinh', loại_lỗi: 'Định dạng sai', mô_tả: 'Ngày sinh không hợp lệ (32/13/2023)' },
    ],
    warningList: [
      { mã_bản_ghi: 'THA-078', trường: 'dia_chi', loại_cảnh_báo: 'Độ dài vượt quá', mô_tả: 'Độ dài 256 ký tự vượt giới hạn 200' },
      { mã_bản_ghi: 'THA-089', trường: 'dia_chi', loại_cảnh_báo: 'Độ dài vượt quá', mô_tả: 'Độ dài 234 ký tự vượt giới hạn 200' },
      { mã_bản_ghi: 'THA-090', trường: 'ghi_chu', loại_cảnh_báo: 'Ký tự đặc biệt', mô_tả: 'Chứa ký tự đặc biệt không hợp lệ' },
    ],
    notificationList: [
      { ngày_gửi: '08/12/2024 09:30', người_nhận: 'Cục Thi hành án TP.HCM', tiêu_đề: 'Phát hiện 34 lỗi dữ liệu THA', trạng_thái: 'Đã gửi' },
      { ngày_gửi: '08/12/2024 10:15', người_nhận: 'Ban Quản lý CSDL', tiêu_đề: 'Báo cáo lỗi kiểm tra dữ liệu', trạng_thái: 'Đã gửi' },
      { ngày_gửi: '08/12/2024 11:00', người_nhận: 'Phòng Công nghệ thông tin', tiêu_đề: 'Yêu cầu kiểm tra lại dữ liệu', trạng_thái: 'Đã gửi' },
      { ngày_gửi: '08/12/2024 14:20', người_nhận: 'Cục Thi hành án TP.HCM', tiêu_đề: 'Nhắc nhở sửa lỗi dữ liệu', trạng_thái: 'Đã gửi' },
      { ngày_gửi: '08/12/2024 16:45', người_nhận: 'Trưởng phòng nghiệp vụ', tiêu_đề: 'Thông báo lỗi cần xử lý khẩn', trạng_thái: 'Đã gửi' },
    ],
    responseList: [
      { ngày_nhận: '08/12/2024 10:00', người_gửi: 'Cục Thi hành án TP.HCM', nội_dung: 'Đã tiếp nhận, đang kiểm tra và sửa lỗi', trạng_thái: 'Đã phản hồi' },
      { ngày_nhận: '08/12/2024 11:30', người_gửi: 'Ban Quản lý CSDL', nội_dung: 'Đã ghi nhận, sẽ phối hợp xử lý', trạng_thái: 'Đã phản hồi' },
      { ngày_nhận: '08/12/2024 15:20', người_gửi: 'Cục Thi hành án TP.HCM', nội_dung: 'Đã sửa 20/34 lỗi, đang tiếp tục xử lý', trạng_thái: 'Đã phản hồi' },
    ]
  },
  {
    id: 3,
    transaction: 'TXN-2025120701236',
    source: 'Hộ sơ quốc tịch',
    sourceId: 'SRC-QT-003',
    receiveTime: '10:20:06 - 07/12/2025',
    dataType: 'Hồ sơ cấp quốc tịch',
    format: 'JSON',
    records: 456,
    size: '2.1 MB',
    status: 'received',
    nextStep: 'Đã hoàn tất',
    validationStatus: 'completed',
    validationResults: {
      passed: 456,
      failed: 0,
      warnings: 0,
      notifications: 0,
      responsesReceived: 0,
      responsesTotal: 0
    },
    errorList: [],
    warningList: [],
    notificationList: [],
    responseList: []
  },
  {
    id: 4,
    transaction: 'TXN-2025120701237',
    source: 'Công chứng',
    sourceId: 'SRC-CC-004',
    receiveTime: '10:15:45 - 07/12/2025',
    dataType: 'Hợp đồng công chứng',
    format: 'JSON',
    records: 892,
    size: '5.7 MB',
    status: 'receiving',
    nextStep: 'Đang tiếp nhận',
    validationStatus: 'pending',
    validationResults: null
  }
];

export function ReceiveDataPanel() {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [validationModalOpen, setValidationModalOpen] = useState(false);
  const [validationModalType, setValidationModalType] = useState<'errors' | 'warnings' | 'notifications' | 'responses'>('errors');
  const [selectedValidation, setSelectedValidation] = useState<any>(null);

  const handleViewData = (item: any) => {
    setSelectedItem(item);
    setViewerOpen(true);
  };

  const handleShowValidation = (item: any, type: 'errors' | 'warnings' | 'notifications' | 'responses') => {
    setSelectedValidation(item);
    setValidationModalType(type);
    setValidationModalOpen(true);
  };

  const getValidationModalData = () => {
    if (!selectedValidation) return [];
    switch (validationModalType) {
      case 'errors': return selectedValidation.errorList || [];
      case 'warnings': return selectedValidation.warningList || [];
      case 'notifications': return selectedValidation.notificationList || [];
      case 'responses': return selectedValidation.responseList || [];
    }
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-500 text-base mb-1">Đang tiếp nhận</p>
          <p className="text-gray-900">3</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-50 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-gray-500 text-base mb-1">Đã tiếp nhận (Hôm nay)</p>
          <p className="text-gray-900">45</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-purple-50 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-500 text-base mb-1">Tổng bản ghi (Hôm nay)</p>
          <p className="text-gray-900">45,678</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-orange-50 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-gray-500 text-base mb-1">Dung lượng (Hôm nay)</p>
          <p className="text-gray-900">234.5 MB</p>
        </div>
      </div>

      {/* Receiving Queue */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-gray-900">Hàng đợi tiếp nhận dữ liệu</h3>
          <p className="text-gray-500 text-base mt-1">Danh sách dữ liệu đã tiếp nhận từ các hệ thống nguồn</p>
        </div>
        <div className="p-6 space-y-4">
          {receivedData.map((item) => (
            <div key={item.id} className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    item.status === 'received' ? 'bg-green-50' : 'bg-blue-50'
                  }`}>
                    <Database className={`w-6 h-6 ${
                      item.status === 'received' ? 'text-green-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className="text-gray-900 mb-1">{item.source}</h4>
                    <p className="text-gray-500 text-base">Mã nguồn: {item.sourceId}</p>
                    <p className="text-gray-500 text-base">Mã giao dịch: {item.transaction}</p>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-base ${
                  item.status === 'received' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {item.status === 'received' ? 'Đã tiếp nhận' : 'Đang tiếp nhận'}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-gray-500 text-base mb-1">Thời gian tiếp nhận</p>
                  <p className="text-gray-900 text-base">{item.receiveTime}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-base mb-1">Loại dữ liệu</p>
                  <p className="text-gray-900 text-base">{item.dataType}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-base mb-1">Định dạng</p>
                  <p className="text-gray-900 text-base">{item.format}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-base mb-1">Số bản ghi</p>
                  <p className="text-gray-900 text-base">{item.records.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-base mb-1">Dung lượng</p>
                  <p className="text-gray-900 text-base">{item.size}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-base mb-1">Bước tiếp theo</p>
                  <p className="text-blue-600 text-base">{item.nextStep}</p>
                </div>
              </div>

              {/* Quality Control Section */}
              {item.validationStatus === 'completed' && item.validationResults && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <h5 className="text-gray-900">Kiểm soát chất lượng</h5>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-gray-500 text-base mb-1">Hợp lệ</p>
                      <p className="text-green-600">{item.validationResults.passed.toLocaleString()}</p>
                    </div>
                    <div 
                      onClick={() => item.validationResults.failed > 0 && handleShowValidation(item, 'errors')}
                      className={`bg-white p-3 rounded-lg ${item.validationResults.failed > 0 ? 'cursor-pointer hover:bg-red-50 hover:border-red-300 border-2 border-transparent transition-all' : ''}`}
                    >
                      <p className="text-gray-500 text-base mb-1">Lỗi</p>
                      <p className="text-red-600">{item.validationResults.failed.toLocaleString()}</p>
                    </div>
                    <div 
                      onClick={() => item.validationResults.warnings > 0 && handleShowValidation(item, 'warnings')}
                      className={`bg-white p-3 rounded-lg ${item.validationResults.warnings > 0 ? 'cursor-pointer hover:bg-orange-50 hover:border-orange-300 border-2 border-transparent transition-all' : ''}`}
                    >
                      <p className="text-gray-500 text-base mb-1">Cảnh báo</p>
                      <p className="text-orange-600">{item.validationResults.warnings.toLocaleString()}</p>
                    </div>
                    <div 
                      onClick={() => item.validationResults.notifications > 0 && handleShowValidation(item, 'notifications')}
                      className={`bg-white p-3 rounded-lg ${item.validationResults.notifications > 0 ? 'cursor-pointer hover:bg-blue-50 hover:border-blue-300 border-2 border-transparent transition-all' : ''}`}
                    >
                      <p className="text-gray-500 text-base mb-1">Thông báo</p>
                      {item.validationResults.notifications > 0 ? (
                        <p className="text-blue-600 text-base">{item.validationResults.notifications} gửi</p>
                      ) : (
                        <p className="text-gray-400">-</p>
                      )}
                    </div>
                    <div 
                      onClick={() => item.validationResults.responsesTotal > 0 && handleShowValidation(item, 'responses')}
                      className={`bg-white p-3 rounded-lg ${item.validationResults.responsesTotal > 0 ? 'cursor-pointer hover:bg-green-50 hover:border-green-300 border-2 border-transparent transition-all' : ''}`}
                    >
                      <p className="text-gray-500 text-base mb-1">Phản hồi</p>
                      {item.validationResults.responsesTotal > 0 ? (
                        <p className={`text-base ${item.validationResults.responsesReceived === item.validationResults.responsesTotal ? 'text-green-600' : 'text-orange-600'}`}>
                          {item.validationResults.responsesReceived}/{item.validationResults.responsesTotal}
                        </p>
                      ) : (
                        <p className="text-gray-400">-</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {item.validationStatus === 'pending' && item.status === 'received' && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <p className="text-gray-900 text-base">Chưa kiểm tra chất lượng - Nhấn "Kiểm tra ngay" để bắt đầu</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {item.status === 'received' && (
                  <button 
                    onClick={() => handleViewData(item)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-base inline-flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Xem dữ liệu đã nhận
                  </button>
                )}
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-base">
                  {item.status === 'received' ? 'Xem chi tiết' : 'Xem tiến độ'}
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-base">
                  Kiểm tra ngay
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-base">
                  Xem log
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Receive Log */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-gray-900">Nhật ký tiếp nhận</h3>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-900">Tiếp nhận thành công từ Hộ tịch điện tử</p>
                <p className="text-gray-500 text-base mt-1">
                  Mã GD: TXN-2025120701234 • 2,345 bản ghi • 12.5 MB • 10:30:18 - 07/12/2025
                </p>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-900">Tiếp nhận thành công từ Thi hành án dân sự</p>
                <p className="text-gray-500 text-base mt-1">
                  Mã GD: TXN-2025120701235 • 1,892 bản ghi • 8.3 MB • 10:25:12 - 07/12/2025
                </p>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-900">Đang tiếp nhận từ Công chứng</p>
                <p className="text-gray-500 text-base mt-1">
                  Mã GD: TXN-2025120701237 • Tiến độ: 45% • 10:15:45 - 07/12/2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table Viewer Modal */}
      {selectedItem && (
        <DataTableViewer
          isOpen={viewerOpen}
          onClose={() => {
            setViewerOpen(false);
            setSelectedItem(null);
          }}
          fileTitle={selectedItem.source}
          dataType={selectedItem.dataType}
        />
      )}

      {/* Validation Details Modal */}
      {validationModalOpen && selectedValidation && (
        <ValidationDetailsModal
          isOpen={validationModalOpen}
          onClose={() => {
            setValidationModalOpen(false);
            setSelectedValidation(null);
          }}
          type={validationModalType}
          source={selectedValidation.source}
          transaction={selectedValidation.transaction}
          data={getValidationModalData()}
        />
      )}
    </div>
    </div>
  );
}