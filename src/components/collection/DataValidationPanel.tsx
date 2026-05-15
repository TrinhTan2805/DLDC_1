import { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Play, Settings as SettingsIcon } from 'lucide-react';
import { ValidationDetailsModal } from './ValidationDetailsModal';

const validationRules = [
  { id: 1, name: 'Kiểm tra định dạng file', enabled: true, priority: 'high' },
  { id: 2, name: 'Kiểm tra cấu trúc dữ liệu', enabled: true, priority: 'high' },
  { id: 3, name: 'Kiểm tra trường bắt buộc', enabled: true, priority: 'high' },
  { id: 4, name: 'Kiểm tra độ dài trường', enabled: true, priority: 'medium' },
  { id: 5, name: 'Kiểm tra kiểu dữ liệu', enabled: true, priority: 'high' },
  { id: 6, name: 'Kiểm tra giá trị null/empty', enabled: true, priority: 'medium' },
  { id: 7, name: 'Kiểm tra trùng lặp', enabled: true, priority: 'high' },
  { id: 8, name: 'Kiểm tra dung lượng file', enabled: true, priority: 'medium' },
  { id: 9, name: 'Kiểm tra mã hóa ký tự', enabled: true, priority: 'low' },
  { id: 10, name: 'Kiểm tra định dạng ngày tháng', enabled: true, priority: 'high' },
];

const validationResults = [
  {
    transaction: 'TXN-2025120701234',
    source: 'Hộ tịch điện tử',
    records: 2345,
    passed: 2345,
    failed: 0,
    warnings: 0,
    status: 'passed',
    time: '7 giây',
    notifications: 0,
    responsesReceived: 0,
    responsesTotal: 0,
    errorList: [],
    warningList: [],
    notificationList: [],
    responseList: [],
    details: [
      { rule: 'Kiểm tra định dạng file', result: 'pass', message: 'File JSON hợp lệ' },
      { rule: 'Kiểm tra cấu trúc dữ liệu', result: 'pass', message: 'Cấu trúc đúng schema' },
      { rule: 'Kiểm tra trường bắt buộc', result: 'pass', message: 'Tất cả trường bắt buộc đều có' },
      { rule: 'Kiểm tra trùng lặp', result: 'pass', message: 'Không phát hiện bản ghi trùng' },
    ]
  },
  {
    transaction: 'TXN-2025120701235',
    source: 'Thi hành án dân sự',
    records: 1892,
    passed: 1858,
    failed: 34,
    warnings: 12,
    status: 'failed',
    time: '5 giây',
    notifications: 5,
    responsesReceived: 3,
    responsesTotal: 5,
    errorList: [
      { mã_bản_ghi: 'THA-001', trường_lỗi: 'so_cccd', loại_lỗi: 'Thiếu dữ liệu', mô_tả: 'Trường so_cccd bắt buộc nhưng để trống' },
      { mã_bản_ghi: 'THA-005', trường_lỗi: 'so_cccd', loại_lỗi: 'Thiếu dữ liệu', mô_tả: 'Trường so_cccd bắt buộc nhưng để trống' },
      { mã_bản_ghi: 'THA-012', trường_lỗi: 'so_cccd', loại_lỗi: 'Thiếu dữ liệu', mô_tả: 'Trường so_cccd bắt buộc nhưng để trống' },
      { mã_bản_ghi: 'THA-023', trường_lỗi: 'ngay_sinh', loại_lỗi: 'Định dạng sai', mô_tả: 'Ngày sinh không đúng định dạng DD/MM/YYYY' },
      { mã_bản_ghi: 'THA-034', trường_lỗi: 'ngay_sinh', loại_lỗi: 'Định dạng sai', mô_tả: 'Ngày sinh không hợp lệ (32/13/2023)' },
      { mã_bản_ghi: 'THA-045', trường_lỗi: 'ngay_sinh', loại_lỗi: 'Định dạng sai', mô_tả: 'Ngày sinh trong tương lai' },
      { mã_bản_ghi: 'THA-056', trường_lỗi: 'ho_ten', loại_lỗi: 'Trùng lặp', mô_tả: 'Bản ghi trùng với THA-134' },
      { mã_bản_ghi: 'THA-067', trường_lỗi: 'ho_ten', loại_lỗi: 'Trùng lặp', mô_tả: 'Bản ghi trùng với THA-245' },
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
    ],
    details: [
      { rule: 'Kiểm tra định dạng file', result: 'pass', message: 'File XML hợp lệ' },
      { rule: 'Kiểm tra trường bắt buộc', result: 'fail', message: '3 bản ghi thiếu trường "so_cccd"' },
      { rule: 'Kiểm tra định dạng ngày tháng', result: 'fail', message: '3 bản ghi có ngày tháng không hợp lệ' },
      { rule: 'Kiểm tra trùng lặp', result: 'fail', message: '28 bản ghi bị trùng' },
      { rule: 'Kiểm tra độ dài trường', result: 'warning', message: '12 bản ghi có trường vượt độ dài' },
    ]
  },
];

export function DataValidationPanel() {
  const [selectedTab, setSelectedTab] = useState('results');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'errors' | 'warnings' | 'notifications' | 'responses'>('errors');
  const [selectedResult, setSelectedResult] = useState<any>(null);

  const handleShowDetails = (result: any, type: 'errors' | 'warnings' | 'notifications' | 'responses') => {
    setSelectedResult(result);
    setModalType(type);
    setModalOpen(true);
  };

  const getModalData = () => {
    if (!selectedResult) return [];
    switch (modalType) {
      case 'errors': return selectedResult.errorList || [];
      case 'warnings': return selectedResult.warningList || [];
      case 'notifications': return selectedResult.notificationList || [];
      case 'responses': return selectedResult.responseList || [];
    }
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-50 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-gray-500 text-base mb-1">Đạt yêu cầu</p>
          <p className="text-gray-900">18 giao dịch</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-red-50 p-3 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-gray-500 text-base mb-1">Không đạt</p>
          <p className="text-gray-900">2 giao dịch</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-orange-50 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-gray-500 text-base mb-1">Cảnh báo</p>
          <p className="text-gray-900">34 lỗi</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Play className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-500 text-base mb-1">Đang kiểm tra</p>
          <p className="text-gray-900">3 giao dịch</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedTab('results')}
              className={`px-4 py-3 border-b-2 transition-colors ${
                selectedTab === 'results'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Kết quả kiểm tra
            </button>
            <button
              onClick={() => setSelectedTab('rules')}
              className={`px-4 py-3 border-b-2 transition-colors ${
                selectedTab === 'rules'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Quy tắc kiểm tra
            </button>
            <button
              onClick={() => setSelectedTab('config')}
              className={`px-4 py-3 border-b-2 transition-colors ${
                selectedTab === 'config'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Cấu hình
            </button>
          </div>
        </div>

        {/* Results Tab */}
        {selectedTab === 'results' && (
          <div className="p-6 space-y-6">
            {validationResults.map((result, index) => (
              <div key={index} className="border-2 border-gray-200 rounded-lg overflow-hidden">
                {/* Header */}
                <div className={`px-6 py-4 ${
                  result.status === 'passed' ? 'bg-green-50 border-b border-green-200' : 'bg-red-50 border-b border-red-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-gray-900 mb-1">{result.source}</h4>
                      <p className="text-gray-500 text-base">Mã giao dịch: {result.transaction}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-4 py-2 rounded-full text-base ${
                        result.status === 'passed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {result.status === 'passed' ? 'Đạt yêu cầu' : 'Không đạt'}
                      </span>
                      <p className="text-gray-500 text-base mt-2">Thời gian kiểm tra: {result.time}</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="grid grid-cols-6 gap-4">
                    <div>
                      <p className="text-gray-500 text-base mb-1">Tổng bản ghi</p>
                      <p className="text-gray-900">{result.records.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-base mb-1">Hợp lệ</p>
                      <p className="text-green-600">{result.passed.toLocaleString()}</p>
                    </div>
                    <div 
                      onClick={() => result.failed > 0 && handleShowDetails(result, 'errors')}
                      className={result.failed > 0 ? 'cursor-pointer hover:bg-red-50 rounded-lg p-2 -m-2 transition-colors' : ''}
                    >
                      <p className="text-gray-500 text-base mb-1">Lỗi</p>
                      <p className="text-red-600">{result.failed.toLocaleString()}</p>
                    </div>
                    <div 
                      onClick={() => result.warnings > 0 && handleShowDetails(result, 'warnings')}
                      className={result.warnings > 0 ? 'cursor-pointer hover:bg-orange-50 rounded-lg p-2 -m-2 transition-colors' : ''}
                    >
                      <p className="text-gray-500 text-base mb-1">Cảnh báo</p>
                      <p className="text-orange-600">{result.warnings.toLocaleString()}</p>
                    </div>
                    <div 
                      onClick={() => result.notifications > 0 && handleShowDetails(result, 'notifications')}
                      className={result.notifications > 0 ? 'cursor-pointer hover:bg-blue-50 rounded-lg p-2 -m-2 transition-colors' : ''}
                    >
                      <p className="text-gray-500 text-base mb-1">Thông báo</p>
                      {result.notifications > 0 ? (
                        <p className="text-blue-600">{result.notifications} đã gửi</p>
                      ) : (
                        <p className="text-gray-400">-</p>
                      )}
                    </div>
                    <div 
                      onClick={() => result.responsesTotal > 0 && handleShowDetails(result, 'responses')}
                      className={result.responsesTotal > 0 ? 'cursor-pointer hover:bg-green-50 rounded-lg p-2 -m-2 transition-colors' : ''}
                    >
                      <p className="text-gray-500 text-base mb-1">Phản hồi</p>
                      {result.responsesTotal > 0 ? (
                        <p className={result.responsesReceived === result.responsesTotal ? 'text-green-600' : 'text-orange-600'}>
                          {result.responsesReceived}/{result.responsesTotal}
                        </p>
                      ) : (
                        <p className="text-gray-400">-</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6">
                  <h5 className="text-gray-900 mb-4">Chi tiết kiểm tra</h5>
                  <div className="space-y-3">
                    {result.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        {detail.result === 'pass' && <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />}
                        {detail.result === 'fail' && <XCircle className="w-5 h-5 text-red-600 mt-0.5" />}
                        {detail.result === 'warning' && <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />}
                        <div className="flex-1">
                          <p className="text-gray-900 mb-1">{detail.rule}</p>
                          <p className={`text-base ${
                            detail.result === 'pass' ? 'text-green-600' :
                            detail.result === 'fail' ? 'text-red-600' : 'text-orange-600'
                          }`}>
                            {detail.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rules Tab */}
        {selectedTab === 'rules' && (
          <div className="p-6">
            <div className="mb-6">
              <h4 className="text-gray-900 mb-2">Quy tắc kiểm tra tự động</h4>
              <p className="text-gray-500 text-base">Cấu hình các quy tắc kiểm tra dữ liệu</p>
            </div>
            <div className="space-y-3">
              {validationRules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      className="w-5 h-5 text-red-600 rounded"
                      readOnly
                    />
                    <div>
                      <p className="text-gray-900">{rule.name}</p>
                      <span className={`inline-block px-2 py-1 rounded text-base mt-1 ${
                        rule.priority === 'high' ? 'bg-red-100 text-red-700' :
                        rule.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {rule.priority === 'high' ? 'Ưu tiên cao' :
                         rule.priority === 'medium' ? 'Ưu tiên trung bình' : 'Ưu tiên thấp'}
                      </span>
                    </div>
                  </div>
                  <button title="Hành động" aria-label="Hành động" className="p-2 hover:bg-gray-100 rounded-lg">
                    <SettingsIcon className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Lưu cấu hình
              </button>
              <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Thêm quy tắc mới
              </button>
            </div>
          </div>
        )}

        {/* Config Tab */}
        {selectedTab === 'config' && (
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h4 className="text-gray-900 mb-4">Cấu hình kiểm tra</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Dung lượng file tối đa (MB)</label>
                    <input aria-label="Input field"
                      type="number"
                      defaultValue="100"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Số lượng bản ghi tối đa mỗi lần</label>
                    <input aria-label="Input field"
                      type="number"
                      defaultValue="10000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Mã hóa ký tự mặc định</label>
                    <select aria-label="Select box" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                      <option>UTF-8</option>
                      <option>UTF-16</option>
                      <option>ISO-8859-1</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-5 h-5 text-red-600 rounded" defaultChecked />
                      <span className="text-gray-700">Tự động kiểm tra khi tiếp nhận dữ liệu</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-5 h-5 text-red-600 rounded" defaultChecked />
                      <span className="text-gray-700">Gửi thông báo khi phát hiện lỗi</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-5 h-5 text-red-600 rounded" />
                      <span className="text-gray-700">Dừng xử lý khi có lỗi nghiêm trọng</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Lu cấu hình
                </button>
                <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Khôi phục mặc định
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && selectedResult && (
        <ValidationDetailsModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          type={modalType}
          source={selectedResult.source}
          transaction={selectedResult.transaction}
          data={getModalData()}
        />
      )}
    </div>
    </div>
  );
}