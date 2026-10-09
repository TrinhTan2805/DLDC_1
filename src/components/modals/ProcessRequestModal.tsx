import { useState } from 'react';
import { X, PlayCircle, Clock, CheckCircle2, AlertTriangle, Database, FileDown, Loader2 } from 'lucide-react';

interface ProcessRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: any;
  onProcess: (requestId: string, notes: string) => void;
}

export function ProcessRequestModal({ isOpen, onClose, request, onProcess }: ProcessRequestModalProps) {
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [notes, setNotes] = useState('');

  if (!isOpen || !request) return null;

  const steps = [
    { 
      id: 1, 
      name: 'Xác thực yêu cầu', 
      desc: 'Kiểm tra tính hợp lệ của yêu cầu',
      duration: 2000
    },
    { 
      id: 2, 
      name: 'Kết nối database', 
      desc: 'Thiết lập kết nối đến CSDL',
      duration: 1500
    },
    { 
      id: 3, 
      name: 'Truy xuất dữ liệu', 
      desc: 'Lấy dữ liệu theo điều kiện',
      duration: 3000
    },
    { 
      id: 4, 
      name: 'Xử lý & định dạng', 
      desc: 'Chuyển đổi sang định dạng yêu cầu',
      duration: 2000
    },
    { 
      id: 5, 
      name: 'Tạo file xuất', 
      desc: 'Tạo file và lưu vào hệ thống',
      duration: 1500
    }
  ];

  const handleStartProcess = async () => {
    setProcessing(true);
    setCurrentStep(0);

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i + 1);
      await new Promise(resolve => setTimeout(resolve, steps[i].duration));
    }

    // Complete
    setTimeout(() => {
      onProcess(request.id, notes);
      setProcessing(false);
      setCurrentStep(0);
      setNotes('');
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <PlayCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-slate-900">Bắt đầu xử lý yêu cầu</h2>
              <p className="text-sm text-slate-600">Mã yêu cầu: {request.requestCode}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={processing}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title="Đóng" aria-label="Đóng"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Request Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h3 className="text-sm text-slate-900 mb-3">Thông tin yêu cầu</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-600">Người yêu cầu:</span>
                <div className="text-slate-900">{request.requester}</div>
              </div>
              <div>
                <span className="text-slate-600">Đơn vị:</span>
                <div className="text-slate-900">{request.requesterDepartment}</div>
              </div>
              <div>
                <span className="text-slate-600">Dịch vụ:</span>
                <div className="text-slate-900">{request.serviceName}</div>
              </div>
              <div>
                <span className="text-slate-600">Định dạng:</span>
                <div className="text-slate-900">{request.format}</div>
              </div>
              <div>
                <span className="text-slate-600">Độ ưu tiên:</span>
                <div>
                  <span className={`px-2 py-0.5 rounded text-xs inline-block ${
                    request.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                    request.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                    request.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {request.priority === 'urgent' ? 'Khẩn cấp' :
                     request.priority === 'high' ? 'Cao' :
                     request.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-slate-600">Ngày yêu cầu:</span>
                <div className="text-slate-900">{request.requestDate}</div>
              </div>
            </div>
          </div>

          {/* Process Steps */}
          {!processing && currentStep === 0 && (
            <div className="space-y-3">
              <h3 className="text-sm text-slate-900">Quy trình xử lý</h3>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0 text-xs text-slate-600">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-slate-900">{step.name}</div>
                      <div className="text-xs text-slate-600">{step.desc}</div>
                    </div>
                    <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Processing Steps */}
          {processing && (
            <div className="space-y-3">
              <h3 className="text-sm text-slate-900">Đang xử lý...</h3>
              <div className="space-y-2">
                {steps.map((step, index) => {
                  const stepNumber = index + 1;
                  const isCompleted = stepNumber < currentStep;
                  const isCurrent = stepNumber === currentStep;
                  const isPending = stepNumber > currentStep;

                  return (
                    <div 
                      key={step.id} 
                      className={`flex items-start gap-3 p-3 border rounded-lg transition-all ${
                        isCompleted ? 'bg-green-50 border-green-200' :
                        isCurrent ? 'bg-blue-50 border-blue-300 shadow-sm' :
                        'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                        isCompleted ? 'bg-green-500 text-white' :
                        isCurrent ? 'bg-blue-500 text-white' :
                        'bg-slate-200 text-slate-600'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : isCurrent ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          stepNumber
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm ${
                          isCompleted ? 'text-green-900' :
                          isCurrent ? 'text-blue-900' :
                          'text-slate-900'
                        }`}>
                          {step.name}
                        </div>
                        <div className={`text-xs ${
                          isCompleted ? 'text-green-700' :
                          isCurrent ? 'text-blue-700' :
                          'text-slate-600'
                        }`}>
                          {step.desc}
                        </div>
                      </div>
                      {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                      {isCurrent && <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />}
                    </div>
                  );
                })}
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-600">Tiến độ</span>
                  <span className="text-blue-700">{Math.round((currentStep / steps.length) * 100)}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {!processing && (
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Ghi chú xử lý (tùy chọn)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Ghi chú về quá trình xử lý, điều chỉnh, hoặc lưu ý đặc biệt..."
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-[#F0F0F0] disabled:cursor-not-allowed"
                disabled={processing}
              />
            </div>
          )}

          {/* Warning */}
          {!processing && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-900">
                  <div className="mb-1">Lưu ý trước khi xử lý:</div>
                  <ul className="list-disc list-inside space-y-1 text-amber-800 text-xs">
                    <li>Đảm bảo hệ thống database đang hoạt động ổn định</li>
                    <li>Kiểm tra quyền truy cập vào bảng dữ liệu được yêu cầu</li>
                    <li>Yêu cầu có thể mất từ 10-30 giây tùy thuộc vào số lượng bản ghi</li>
                    <li>Không được đóng cửa sổ trong khi đang xử lý</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Estimated Info */}
          {!processing && request.estimatedRows && (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-blue-700">Bản ghi</span>
                </div>
                <div className="text-lg text-blue-900">{request.estimatedRows?.toLocaleString() || 'N/A'}</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <FileDown className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-700">Định dạng</span>
                </div>
                <div className="text-lg text-green-900">{request.format}</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="text-xs text-purple-700">Thời gian ước tính</span>
                </div>
                <div className="text-lg text-purple-900">~10s</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={processing}
            className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Đang xử lý...' : 'Hủy'}
          </button>
          {!processing && (
            <button
              onClick={handleStartProcess}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <PlayCircle className="w-5 h-5" />
              Bắt đầu xử lý
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
