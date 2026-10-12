import { X, Bell, Mail, FileText, Calendar, User } from 'lucide-react';
import { useState } from 'react';
import { DateInput } from '../pages/collection/collectionUi';

interface SendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  defaultRecipient?: string;
}

export function SendNotificationModal({ 
  isOpen, 
  onClose, 
  title = 'Gửi thông báo',
  defaultRecipient = ''
}: SendNotificationModalProps) {
  const [scheduleDate, setScheduleDate] = useState('');
  if (!isOpen) return null;

  const [notificationType, setNotificationType] = useState<'electronic' | 'paper'>('electronic');
  const [sendTime, setSendTime] = useState<'now' | 'schedule'>('now');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement send notification logic
    alert('Thông báo đã được gửi thành công!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg text-slate-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded transition-colors" title="Đóng" aria-label="Đóng"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 py-4 space-y-5">
            {/* Loại thông báo */}
            <div>
              <label className="block text-sm text-slate-700 mb-3">
                Loại thông báo <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setNotificationType('electronic')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    notificationType === 'electronic'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      notificationType === 'electronic' ? 'bg-blue-100' : 'bg-slate-100'
                    }`}>
                      <Mail className={`w-5 h-5 ${
                        notificationType === 'electronic' ? 'text-blue-600' : 'text-slate-500'
                      }`} />
                    </div>
                    <div className="text-left">
                      <p className={`text-sm ${
                        notificationType === 'electronic' ? 'text-blue-900 font-medium' : 'text-slate-700'
                      }`}>
                        Thông báo điện tử
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">Gửi qua email</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setNotificationType('paper')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    notificationType === 'paper'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      notificationType === 'paper' ? 'bg-blue-100' : 'bg-slate-100'
                    }`}>
                      <FileText className={`w-5 h-5 ${
                        notificationType === 'paper' ? 'text-blue-600' : 'text-slate-500'
                      }`} />
                    </div>
                    <div className="text-left">
                      <p className={`text-sm ${
                        notificationType === 'paper' ? 'text-blue-900 font-medium' : 'text-slate-700'
                      }`}>
                        Thông báo giấy
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">In và gửi văn bản</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Đầu mối nhận */}
            <div>
              <label className="block text-sm text-slate-700 mb-3">
                Đầu mối nhận <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Tên đầu mối
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập tên người nhận"
                      defaultValue={defaultRecipient}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Chức vụ
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="VD: Trưởng phòng"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      {notificationType === 'electronic' ? 'Email' : 'Đơn vị'}
                    </label>
                    <input
                      type={notificationType === 'electronic' ? 'email' : 'text'}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={notificationType === 'electronic' ? 'example@moj.gov.vn' : 'Tên đơn vị'}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0912345678"
                    />
                  </div>
                </div>

                {notificationType === 'paper' && (
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Địa chỉ nhận
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      placeholder="Nhập địa chỉ đầy đủ"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Nội dung thông báo */}
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Nội dung thông báo <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tiêu đề thông báo"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    Nội dung chi tiết
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={6}
                    placeholder="Nhập nội dung thông báo chi tiết..."
                  />
                </div>
              </div>
            </div>

            {/* Thời gian gửi */}
            <div>
              <label className="block text-sm text-slate-700 mb-3">
                Thời gian gửi <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sendTime"
                      value="now"
                      checked={sendTime === 'now'}
                      onChange={(e) => setSendTime(e.target.value as 'now' | 'schedule')}
                      className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">Gửi ngay</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sendTime"
                      value="schedule"
                      checked={sendTime === 'schedule'}
                      onChange={(e) => setSendTime(e.target.value as 'now' | 'schedule')}
                      className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">Đặt lịch gửi</span>
                  </label>
                </div>

                {sendTime === 'schedule' && (
                  <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        Ngày gửi
                      </label>
                      <DateInput ariaLabel="Ngày gửi" value={scheduleDate} onChange={setScheduleDate} />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">
                        Giờ gửi
                      </label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* File đính kèm (nếu là thông báo giấy) */}
            {notificationType === 'paper' && (
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Văn bản đính kèm
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                  <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 mb-1">Kéo thả file hoặc click để chọn</p>
                  <p className="text-xs text-slate-500">Hỗ trợ: PDF, DOC, DOCX (tối đa 10MB)</p>
                  <button
                    type="button"
                    className="mt-3 px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Chọn file
                  </button>
                </div>
              </div>
            )}

            {/* Ghi chú */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex gap-2">
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-bold">i</span>
                  </div>
                </div>
                <div className="text-xs text-blue-700">
                  <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Thông báo điện tử sẽ được gửi qua email trong vòng 5 phút</li>
                    <li>Thông báo giấy sẽ được in và chuyển đến bộ phận văn thư để xử lý</li>
                    <li>Hệ thống sẽ lưu lại lịch sử gửi thông báo để tra cứu</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              {sendTime === 'now' ? 'Gửi ngay' : 'Đặt lịch gửi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
