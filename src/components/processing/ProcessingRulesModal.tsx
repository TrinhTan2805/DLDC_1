import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface ProcessingRule {
  id: string;
  name: string;
  type: string;
  condition: string;
  applied: number;
  success: number;
  error: number;
  status: 'success' | 'warning' | 'error';
}

interface ProcessingRulesModalProps {
  type: string;
  time: string;
  onClose: () => void;
}

export function ProcessingRulesModal({ type, time, onClose }: ProcessingRulesModalProps) {
  // Mock data - các quy tắc được cấu hình
  const rules: ProcessingRule[] = [
    {
      id: '1',
      name: 'Chuẩn hóa định dạng ngày tháng',
      type: 'Định dạng',
      condition: 'Trường: Ngày sinh, Ngày đăng ký',
      applied: 450,
      success: 445,
      error: 5,
      status: 'success'
    },
    {
      id: '2',
      name: 'Kiểm tra độ dài CCCD',
      type: 'Kiểm tra',
      condition: 'CCCD = 12 chữ số',
      applied: 380,
      success: 360,
      error: 20,
      status: 'warning'
    },
    {
      id: '3',
      name: 'Viết hoa chữ cái đầu họ tên',
      type: 'Định dạng',
      condition: 'Trường: Họ và tên',
      applied: 500,
      success: 500,
      error: 0,
      status: 'success'
    },
    {
      id: '4',
      name: 'Xóa ký tự đặc biệt',
      type: 'Làm sạch',
      condition: 'Tất cả trường văn bản',
      applied: 620,
      success: 615,
      error: 5,
      status: 'success'
    },
    {
      id: '5',
      name: 'Kiểm tra email hợp lệ',
      type: 'Kiểm tra',
      condition: 'Trường: Email',
      applied: 280,
      success: 265,
      error: 15,
      status: 'warning'
    },
    {
      id: '6',
      name: 'Chuẩn hóa số điện thoại',
      type: 'Định dạng',
      condition: 'Số điện thoại = 10 chữ số, bắt đầu 0',
      applied: 310,
      success: 295,
      error: 15,
      status: 'warning'
    },
    {
      id: '7',
      name: 'Kiểm tra giá trị rỗng',
      type: 'Kiểm tra',
      condition: 'Các trường bắt buộc không được để trống',
      applied: 550,
      success: 530,
      error: 20,
      status: 'warning'
    },
    {
      id: '8',
      name: 'Loại bỏ khoảng trắng thừa',
      type: 'Làm sạch',
      condition: 'Tất cả trường văn bản',
      applied: 600,
      success: 600,
      error: 0,
      status: 'success'
    },
    {
      id: '9',
      name: 'Kiểm tra mã tỉnh/thành',
      type: 'Kiểm tra',
      condition: 'Mã phải tồn tại trong danh mục',
      applied: 400,
      success: 385,
      error: 15,
      status: 'warning'
    },
    {
      id: '10',
      name: 'Chuẩn hóa địa chỉ',
      type: 'Định dạng',
      condition: 'Trường: Địa chỉ',
      applied: 420,
      success: 410,
      error: 10,
      status: 'success'
    }
  ];

  const totalRules = rules.length;
  const totalApplied = rules.reduce((sum, rule) => sum + rule.applied, 0);
  const totalSuccess = rules.reduce((sum, rule) => sum + rule.success, 0);
  const totalError = rules.reduce((sum, rule) => sum + rule.error, 0);

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[90vw] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-slate-900">Quy tắc xử lý: {type}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Thời gian thực hiện: {time}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Đóng" aria-label="Đóng"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-6 pt-4 pb-3">
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="text-xs text-blue-600 mb-1">Tổng quy tắc</div>
              <div className="text-2xl text-blue-700">{totalRules}</div>
            </div>

            <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div className="text-xs text-purple-600 mb-1">Đã áp dụng</div>
              <div className="text-2xl text-purple-700">{totalApplied.toLocaleString()}</div>
            </div>

            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="text-xs text-green-600 mb-1">Thành công</div>
              <div className="text-2xl text-green-700">{totalSuccess.toLocaleString()}</div>
            </div>

            <div className="p-3 bg-red-50 rounded-lg border border-red-100">
              <div className="text-xs text-red-600 mb-1">Thất bại</div>
              <div className="text-2xl text-red-700">{totalError}</div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-6">
          <table className="w-full">
            <thead className="bg-slate-50 sticky top-0">
              <tr className="border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">STT</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Tên quy tắc</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Loại</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Điều kiện</th>
                <th className="px-4 py-3 text-right text-xs text-slate-600 uppercase tracking-wider">Áp dụng</th>
                <th className="px-4 py-3 text-right text-xs text-slate-600 uppercase tracking-wider">Thành công</th>
                <th className="px-4 py-3 text-right text-xs text-slate-600 uppercase tracking-wider">Lỗi</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {rules.map((rule, index) => (
                <tr 
                  key={rule.id} 
                  className={`border-b border-slate-100 hover:bg-slate-50 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                  }`}
                >
                  <td className="px-4 py-3 text-sm text-slate-700">{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-slate-900">{rule.name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs border ${
                      rule.type === 'Định dạng' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      rule.type === 'Kiểm tra' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      'bg-orange-50 text-orange-700 border-orange-200'
                    }`}>
                      {rule.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 max-w-xs">{rule.condition}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 text-right">{rule.applied.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-green-700 text-right">{rule.success.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-red-700 text-right">{rule.error}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {rule.status === 'success' ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-xs text-green-700">Hoàn tất</span>
                        </>
                      ) : rule.status === 'warning' ? (
                        <>
                          <AlertCircle className="w-4 h-4 text-orange-600" />
                          <span className="text-xs text-orange-700">Có cảnh báo</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <span className="text-xs text-red-700">Lỗi</span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="text-sm text-slate-600">
            {totalRules} quy tắc • {totalApplied.toLocaleString()} lần áp dụng • {totalSuccess.toLocaleString()} thành công • {totalError} lỗi
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}