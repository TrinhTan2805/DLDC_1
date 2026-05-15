import { ArrowRight, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import collectionFlowImage from 'figma:asset/503489547a615e1e465788e37f16fa98704a9eae.png';

const processSteps = [
  {
    step: 1,
    name: 'Gửi dữ liệu',
    actor: 'Hệ thống nguồn',
    description: 'Hệ thống nguồn gửi dữ liệu theo chuẩn kết nối, định dạng và giao thức đã thống nhất.',
    criteria: [
      'Đúng định dạng JSON/XML',
      'Có mã nguồn hợp lệ',
      'Có timestamp gửi',
      'Mã hóa kết nối SSL/TLS'
    ]
  },
  {
    step: 2,
    name: 'Tiếp nhận dữ liệu',
    actor: 'Hệ thống kho dữ liệu',
    description: 'Hệ thống tiếp nhận dữ liệu từ hệ thống nguồn thông qua kênh tích hợp. Ghi nhận thời gian, định danh nguồn và loại dữ liệu.',
    criteria: [
      'Ghi log thời gian tiếp nhận',
      'Xác định nguồn dữ liệu',
      'Phân loại dữ liệu',
      'Tạo mã giao dịch'
    ]
  },
  {
    step: 3,
    name: 'Kiểm tra dữ liệu',
    actor: 'Hệ thống kho dữ liệu',
    description: 'Hệ thống tự động kiểm tra dữ liệu theo tiêu chí kỹ thuật: định dạng, cấu trúc, trường dữ liệu, giá trị bắt buộc, mã hóa, dung lượng, trạng thái.',
    criteria: [
      'Kiểm tra định dạng file',
      'Kiểm tra cấu trúc dữ liệu',
      'Kiểm tra trường bắt buộc',
      'Kiểm tra độ dài và kiểu dữ liệu',
      'Kiểm tra trùng lặp',
      'Kiểm tra dung lượng'
    ]
  },
  {
    step: 4,
    name: 'Gửi thông báo lỗi',
    actor: 'Hệ thống kho dữ liệu',
    description: 'Trường hợp dữ liệu không đạt yêu cầu, hệ thống gửi thông báo lỗi kèm nguyên nhân (thiếu trường, sai định dạng, lỗi trùng, dung lượng vượt mức, v.v.).',
    criteria: [
      'Mã lỗi chi tiết',
      'Mô tả lỗi cụ thể',
      'Vị trí lỗi (dòng, cột)',
      'Hướng dẫn khắc phục'
    ]
  },
  {
    step: 5,
    name: 'Gửi thông báo nhận thành công',
    actor: 'Hệ thống kho dữ liệu',
    description: 'Khi dữ liệu đạt yêu cầu, hệ thống xác nhận tiếp nhận thành công và ghi nhận vào nhật ký tiếp nhận.',
    criteria: [
      'Mã xác nhận giao dịch',
      'Số lượng bản ghi nhận',
      'Thời gian hoàn tất',
      'Trạng thái xử lý tiếp theo'
    ]
  },
  {
    step: 6,
    name: 'Tiếp nhận phản hồi',
    actor: 'Hệ thống nguồn',
    description: 'Hệ thống nguồn nhận thông báo từ kho dữ liệu (thành công hoặc lỗi), thực hiện lưu log hoặc điều chỉnh dữ liệu theo phản hồi.',
    criteria: [
      'Lưu log phản hồi',
      'Cập nhật trạng thái gửi',
      'Xử lý lỗi nếu có',
      'Thử gửi lại nếu cần'
    ]
  }
];

export function CollectionProcessFlow() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
    <div className="space-y-6">
      {/* Process Flow Diagram */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Sơ đồ quy trình thu thập dữ liệu</h3>
        <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center">
          <img 
            src={collectionFlowImage} 
            alt="Quy trình thu thập dữ liệu" 
            className="max-w-full h-auto"
          />
        </div>
      </div>

      {/* Process Steps Detail */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-gray-900">Chi tiết các bước quy trình</h3>
          <p className="text-gray-500 text-base mt-1">Mô tả chi tiết từng bước trong quy trình thu thập dữ liệu</p>
        </div>
        <div className="p-6 space-y-6">
          {processSteps.map((step, index) => (
            <div key={step.step} className="relative">
              {/* Step Card */}
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 transition-colors">
                {/* Step Header */}
                <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-4 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                        {step.step}
                      </div>
                      <div>
                        <h4 className="text-gray-900 mb-1">{step.name}</h4>
                        <p className="text-blue-600 text-base">Đối tượng: {step.actor}</p>
                      </div>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>

                {/* Step Content */}
                <div className="px-6 py-4">
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">{step.description}</p>
                  </div>

                  {/* Criteria */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 mb-3">Tiêu chí kiểm tra:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {step.criteria.map((criterion, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                          <span className="text-gray-600 text-base">{criterion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow between steps */}
              {index < processSteps.length - 1 && (
                <div className="flex justify-center my-4">
                  <ArrowRight className="w-6 h-6 text-blue-600 transform rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Decision Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border-2 border-red-200 p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h4 className="text-gray-900 mb-1">Khi dữ liệu không đạt yêu cầu</h4>
              <p className="text-gray-500 text-base">Quy trình xử lý lỗi</p>
            </div>
          </div>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-gray-700 text-base">
              <span className="text-red-600 mt-1">•</span>
              <span>Hệ thống dừng xử lý dữ liệu</span>
            </li>
            <li className="flex items-start gap-2 text-gray-700 text-base">
              <span className="text-red-600 mt-1">•</span>
              <span>Ghi log chi tiết lỗi vào hệ thống</span>
            </li>
            <li className="flex items-start gap-2 text-gray-700 text-base">
              <span className="text-red-600 mt-1">•</span>
              <span>Gửi thông báo lỗi đến hệ thống nguồn (Bước 4)</span>
            </li>
            <li className="flex items-start gap-2 text-gray-700 text-base">
              <span className="text-red-600 mt-1">•</span>
              <span>Chờ hệ thống nguồn điều chỉnh và gửi lại</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg border-2 border-green-200 p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4 className="text-gray-900 mb-1">Khi dữ liệu đạt yêu cầu</h4>
              <p className="text-gray-500 text-base">Quy trình xử lý thành công</p>
            </div>
          </div>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-gray-700 text-base">
              <span className="text-green-600 mt-1">•</span>
              <span>Lưu dữ liệu vào kho dữ liệu chung</span>
            </li>
            <li className="flex items-start gap-2 text-gray-700 text-base">
              <span className="text-green-600 mt-1">•</span>
              <span>Tạo mã giao dịch thành công</span>
            </li>
            <li className="flex items-start gap-2 text-gray-700 text-base">
              <span className="text-green-600 mt-1">•</span>
              <span>Gửi xác nhận thành công (Bước 5)</span>
            </li>
            <li className="flex items-start gap-2 text-gray-700 text-base">
              <span className="text-green-600 mt-1">•</span>
              <span>Chuyển sang bước xử lý dữ liệu tiếp theo</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    </div>
  );
}