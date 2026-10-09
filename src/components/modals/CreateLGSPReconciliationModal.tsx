import { useState } from 'react';
import { X, Save, RefreshCw, Send, FileText } from 'lucide-react';

interface CreateLGSPReconciliationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function CreateLGSPReconciliationModal({ isOpen, onClose, onSave }: CreateLGSPReconciliationModalProps) {
  const [configName, setConfigName] = useState('');
  const [sourceSystem, setSourceSystem] = useState('');
  const [receiverSystem, setReceiverSystem] = useState('');
  const [lgspServiceCode, setLgspServiceCode] = useState('');
  const [reconciliationType, setReconciliationType] = useState('Ngày');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [dataType, setDataType] = useState('Chi tiết');
  const [expectedRecords, setExpectedRecords] = useState('');
  const [lgspEndpoint, setLgspEndpoint] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [apiVersion, setApiVersion] = useState('v2');
  const [method, setMethod] = useState('REST');
  const [authMethod, setAuthMethod] = useState('Chữ ký số');
  const [certificate, setCertificate] = useState('');
  const [frequency, setFrequency] = useState('Hàng ngày');
  const [scheduleTime, setScheduleTime] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
          <div>
            <h3 className="text-lg text-slate-900">Tạo gói tin đối soát qua LGSP</h3>
            <p className="text-sm text-slate-500 mt-1">Cấu hình gửi gói tin đối soát qua Cổng LGSP</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-lg transition-colors" title="Đóng" aria-label="Đóng">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Thông tin chung */}
            <div>
              <h4 className="text-sm text-slate-900 mb-4 pb-2 border-b border-slate-200">Thông tin chung</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Tên cấu hình đối soát</label>
                  <input
                    value={configName}
                    onChange={(e) => setConfigName(e.target.value)}
                    placeholder="VD: Đối soát ngày hệ thống B"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Hệ thống gửi (A)</label>
                    <select
                      value={sourceSystem}
                      onChange={(e) => setSourceSystem(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="" disabled hidden>-- Chọn hệ thống --</option>
                      <option value="DLDC">Kho DLDC</option>
                      <option value="HOTICH">Hệ thống Hộ tịch</option>
                      <option value="DKKD">Hệ thống ĐKKD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Hệ thống nhận (B)</label>
                    <select
                      value={receiverSystem}
                      onChange={(e) => setReceiverSystem(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="" disabled hidden>-- Chọn hệ thống --</option>
                      <option value="HOTICH">Hệ thống Hộ tịch</option>
                      <option value="DKKD">Hệ thống ĐKKD</option>
                      <option value="CONGCHUNG">Hệ thống Công chứng</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Mã dịch vụ LGSP</label>
                    <input
                      value={lgspServiceCode}
                      onChange={(e) => setLgspServiceCode(e.target.value)}
                      placeholder="VD: LGSP_RECONCILE_001"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Loại đối soát</label>
                    <select
                      value={reconciliationType}
                      onChange={(e) => setReconciliationType(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="Ngày">Ngày</option>
                      <option value="Kỳ">Kỳ</option>
                      <option value="Theo giao dịch">Theo giao dịch</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Phạm vi & nội dung */}
            <div>
              <h4 className="text-sm text-slate-900 mb-4 pb-2 border-b border-slate-200">Phạm vi & nội dung đối soát</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Từ ngày</label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Đến ngày</label>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Loại dữ liệu</label>
                    <select
                      value={dataType}
                      onChange={(e) => setDataType(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="Chi tiết">Chi tiết</option>
                      <option value="Tổng hợp">Tổng hợp</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">Số bản ghi dự kiến</label>
                  <input
                    type="number"
                    value={expectedRecords}
                    onChange={(e) => setExpectedRecords(e.target.value)}
                    placeholder="VD: 850000"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
            </div>

            {/* Thông tin kỹ thuật LGSP */}
            <div>
              <h4 className="text-sm text-slate-900 mb-4 pb-2 border-b border-slate-200">Thông tin kỹ thuật LGSP</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Endpoint LGSP</label>
                  <input
                    type="url"
                    value={lgspEndpoint}
                    onChange={(e) => setLgspEndpoint(e.target.value)}
                    placeholder="https://lgsp.gov.vn/api/reconciliation"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Service Name</label>
                    <input
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      placeholder="ReconciliationService"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Phiên bản API</label>
                    <select
                      value={apiVersion}
                      onChange={(e) => setApiVersion(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="v1">v1</option>
                      <option value="v2">v2</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Phương thức</label>
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="REST">REST</option>
                      <option value="SOAP">SOAP</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Bảo mật & xác thực */}
            <div>
              <h4 className="text-sm text-slate-900 mb-4 pb-2 border-b border-slate-200">Bảo mật & xác thực</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Cơ chế xác thực</label>
                    <select
                      value={authMethod}
                      onChange={(e) => setAuthMethod(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="Chữ ký số">Chữ ký số</option>
                      <option value="OAuth2">OAuth2</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Chứng thư số</label>
                    <select
                      value={certificate}
                      onChange={(e) => setCertificate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="" disabled hidden>-- Chọn CTS --</option>
                      <option value="CTS_DLDC_2024">CTS DLDC 2024</option>
                      <option value="CTS_BTP_2024">CTS Bộ Tư pháp 2024</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Lập lịch & tự động hóa */}
            <div>
              <h4 className="text-sm text-slate-900 mb-4 pb-2 border-b border-slate-200">Lập lịch & tự động hóa</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Tần suất gửi</label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="Hàng ngày">Hàng ngày</option>
                      <option value="Hàng tuần">Hàng tuần</option>
                      <option value="Hàng tháng">Hàng tháng</option>
                      <option value="Thủ công">Thủ công</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Giờ gửi</label>
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Ghi chú */}
            <div>
              <h4 className="text-sm text-slate-900 mb-4 pb-2 border-b border-slate-200">Ghi chú</h4>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Thông tin bổ sung</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Nhập ghi chú hoặc thông tin bổ sung..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Action Buttons */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm">
                <RefreshCw className="w-4 h-4" />
                Kiểm tra kết nối
              </button>
              <button className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm">
                <Send className="w-4 h-4" />
                Gửi thử
              </button>
              <button className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4" />
                Xem log
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={onSave}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Lưu cấu hình
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
