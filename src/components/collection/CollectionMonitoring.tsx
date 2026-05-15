import { CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';

const activeCollections = [
  {
    id: 1,
    source: 'CSDL A',
    transaction: 'TXN-2025120701234',
    currentStep: 5,
    totalSteps: 5,
    status: 'processing',
    progress: 100,
    recordsProcessed: 1234,
    totalRecords: 1234,
    startTime: '10:30:15',
    estimatedEnd: '10:30:30',
    steps: [
      { name: 'Kết nối nguồn', status: 'completed', time: '10:30:15', duration: '2s' },
      { name: 'Gửi dữ liệu', status: 'completed', time: '10:30:17', duration: '3s' },
      { name: 'Tiếp nhận dữ liệu', status: 'completed', time: '10:30:20', duration: '2s' },
      { name: 'Kiểm tra dữ liệu', status: 'completed', time: '10:30:22', duration: '3s' },
      { name: 'Lưu dữ liệu vào kho', status: 'processing', time: '10:30:25', duration: '5s' },
    ],
  },
  {
    id: 2,
    source: 'Hệ thống B',
    transaction: 'TXN-2025120701235',
    currentStep: 4,
    totalSteps: 5,
    status: 'error',
    progress: 75,
    recordsProcessed: 567,
    totalRecords: 890,
    startTime: '10:25:10',
    estimatedEnd: 'N/A',
    steps: [
      { name: 'Kết nối nguồn', status: 'completed', time: '10:25:10', duration: '2s' },
      { name: 'Gửi dữ liệu', status: 'completed', time: '10:25:12', duration: '3s' },
      { name: 'Tiếp nhận dữ liệu', status: 'completed', time: '10:25:15', duration: '2s' },
      { name: 'Kiểm tra dữ liệu', status: 'error', time: '10:25:18', duration: 'N/A', error: 'Phát hiện 45 bản ghi không hợp lệ' },
      { name: 'Lưu dữ liệu vào kho', status: 'pending', time: '', duration: '' },
    ],
  },
  {
    id: 3,
    source: 'CSDL C',
    transaction: 'TXN-2025120701236',
    currentStep: 2,
    totalSteps: 5,
    status: 'processing',
    progress: 40,
    recordsProcessed: 450,
    totalRecords: 1200,
    startTime: '10:20:05',
    estimatedEnd: '10:20:45',
    steps: [
      { name: 'Kết nối nguồn', status: 'completed', time: '10:20:05', duration: '2s' },
      { name: 'Gửi dữ liệu', status: 'processing', time: '10:20:07', duration: '...' },
      { name: 'Tiếp nhận dữ liệu', status: 'pending', time: '', duration: '' },
      { name: 'Kiểm tra dữ liệu', status: 'pending', time: '', duration: '' },
      { name: 'Lưu dữ liệu vào kho', status: 'pending', time: '', duration: '' },
    ],
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case 'processing':
      return <Clock className="w-5 h-5 text-blue-600" />;
    case 'error':
      return <XCircle className="w-5 h-5 text-red-600" />;
    case 'pending':
      return <Clock className="w-5 h-5 text-gray-400" />;
    case 'skipped':
      return <div className="w-5 h-5 rounded-full bg-gray-300" />;
    default:
      return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'processing':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'error':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'pending':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'skipped':
      return 'bg-gray-50 text-gray-500 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export function CollectionMonitoring() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-gray-900">Theo dõi chi tiết quá trình thu thập</h3>
          <p className="text-gray-500 text-base mt-1">Giám sát từng bước trong quy trình thu thập dữ liệu</p>
        </div>
        <div className="p-6 space-y-6">
          {activeCollections.map((item) => (
            <div key={item.id} className="border-2 border-gray-200 rounded-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-gray-900 mb-1">{item.source}</h4>
                    <p className="text-gray-500 text-base">Mã giao dịch: {item.transaction}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-base border ${
                    item.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' :
                    item.status === 'processing' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                    'bg-red-100 text-red-700 border-red-200'
                  }`}>
                    {item.status === 'completed' ? 'Hoàn thành' :
                     item.status === 'processing' ? 'Đang xử lý' : 'Có lỗi'}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="px-6 py-3 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-base">Tiến độ</span>
                  <span className="text-gray-900 text-base">Bước {item.currentStep}/{item.totalSteps}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      item.status === 'completed' ? 'bg-green-500' :
                      item.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${(item.currentStep / item.totalSteps) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Steps Detail */}
              <div className="p-6">
                <div className="space-y-4">
                  {item.steps.map((step, index) => (
                    <div key={step.name} className="flex items-start gap-4">
                      {/* Step Number & Status Icon */}
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.status === 'completed' ? 'bg-green-100' :
                          step.status === 'processing' ? 'bg-blue-100' :
                          step.status === 'error' ? 'bg-red-100' :
                          step.status === 'skipped' ? 'bg-gray-100' :
                          'bg-gray-50'
                        }`}>
                          {getStatusIcon(step.status)}
                        </div>
                        {index < item.steps.length - 1 && (
                          <div className={`w-0.5 h-12 ${
                            step.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
                          }`}></div>
                        )}
                      </div>

                      {/* Step Info */}
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-gray-900">Bước {index + 1}: {step.name}</h5>
                          <span className="text-gray-500 text-base">{step.time}</span>
                        </div>
                        <p className={`text-base ${
                          step.status === 'error' ? 'text-red-600' :
                          step.status === 'skipped' ? 'text-gray-500' :
                          'text-gray-600'
                        }`}>
                          {(step as any).message || (step as any).error || (step as any).duration}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error Details */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-gray-900">Chi tiết lỗi</h3>
        </div>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-red-900 mb-2">Hệ thống B - 45 lỗi được phát hiện</h4>
                <div className="space-y-2">
                  <div className="bg-white rounded p-3 text-base">
                    <p className="text-gray-900 mb-1"><span className="font-medium">Lỗi 1:</span> Thiếu trường bắt buộc "so_cccd"</p>
                    <p className="text-gray-600">Vị trí: Dòng 15, 23, 45 (3 bản ghi)</p>
                  </div>
                  <div className="bg-white rounded p-3 text-base">
                    <p className="text-gray-900 mb-1"><span className="font-medium">Lỗi 2:</span> Định dạng ngày tháng không hợp lệ</p>
                    <p className="text-gray-600">Vị trí: Dòng 78, 92, 103 (3 bản ghi)</p>
                  </div>
                  <div className="bg-white rounded p-3 text-base">
                    <p className="text-gray-900 mb-1"><span className="font-medium">Lỗi 3:</span> Dữ liệu trùng lặp</p>
                    <p className="text-gray-600">28 bản ghi bị trùng với dữ liệu đã có trong hệ thống</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}