import { X, RefreshCw, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    username: string;
    fullName: string;
    email: string;
  };
}

export function ResetPasswordModal({ isOpen, onClose, user }: ResetPasswordModalProps) {
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [defaultPassword, setDefaultPassword] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleReset = () => {
    setIsResetting(true);
    // Simulate API call
    setTimeout(() => {
      const newPassword = `${user.username}@2024`;
      setDefaultPassword(newPassword);
      setIsResetting(false);
      setResetSuccess(true);
    }, 1500);
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(defaultPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setResetSuccess(false);
    setDefaultPassword('');
    setCopied(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleClose}>
      <div className="bg-white rounded-lg w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-slate-900">Reset mật khẩu</h2>
          </div>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600" title="Đóng" aria-label="Đóng">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {!resetSuccess ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-orange-900">
                  <p className="font-medium">Xác nhận reset mật khẩu</p>
                  <p className="mt-1">Mật khẩu sẽ được đặt lại về giá trị mặc định. Người dùng cần đổi mật khẩu ở lần đăng nhập tiếp theo.</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Tên đăng nhập</div>
                  <div className="text-sm text-slate-900 font-medium">{user.username}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Họ và tên</div>
                  <div className="text-sm text-slate-900">{user.fullName}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Email</div>
                  <div className="text-sm text-slate-900">{user.email}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-900">
                  <p className="font-medium">Reset mật khẩu thành công!</p>
                  <p className="mt-1">Mật khẩu mặc định đã được tạo. Vui lòng gửi cho người dùng.</p>
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">Mật khẩu mặc định</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={defaultPassword}
                    readOnly
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 font-mono text-sm"
                  />
                  <button
                    onClick={handleCopyPassword}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Đã copy</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600">
                <p className="font-medium mb-1">Lưu ý:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Người dùng phải đổi mật khẩu ở lần đăng nhập tiếp theo</li>
                  <li>Mật khẩu này chỉ hiển thị một lần</li>
                  <li>Hành động đã được ghi vào nhật ký hệ thống</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
          {!resetSuccess ? (
            <>
              <button
                onClick={handleClose}
                disabled={isResetting}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleReset}
                disabled={isResetting}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isResetting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Xác nhận reset</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Đóng
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
