import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Users, Key, Copy, RefreshCw, KeyRound, Shield } from 'lucide-react';
import { BTN_PRIMARY, BTN_OUTLINE, BTN_GHOST_ICON, INPUT_CLS as BASE_INPUT_CLS, VIEW_FIELD_CLS, LABEL_CLS, REQUIRED_MARK } from '../../collection/collectionUi';
// Ô nhập chuẩn + quy tắc ô bị khóa ở màn Xem chi tiết (giá trị đen, placeholder xám)
const INPUT_CLS = `${BASE_INPUT_CLS} ${VIEW_FIELD_CLS}`;

interface ProvisionAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizations: string[];
  onSave?: (data: any) => void;
  accountData?: any;
}

export function ProvisionAccountModal({ isOpen, onClose, organizations, onSave, accountData }: ProvisionAccountModalProps) {
  const [selectedOrg, setSelectedOrg] = useState('');
  const [username, setUsername] = useState('');
  const [clientId, setClientId] = useState('');
  const [apiName, setApiName] = useState('Lấy danh sách Hộ tịch');
  const [isCopied, setIsCopied] = useState(false);

  const generateClientId = () => {
    return 'client_' + Math.random().toString(36).substring(2, 10);
  };

  useEffect(() => {
    if (isOpen) {
      if (accountData) {
        setSelectedOrg(accountData.organization || '');
        setUsername(accountData.username || '');
        setClientId(accountData.clientId || '');
      } else {
        setClientId(generateClientId());
        setUsername('');
        setSelectedOrg('');
      }
      setIsCopied(false);
    }
  }, [isOpen, accountData]);

  const handleCopy = () => {
    navigator.clipboard.writeText(clientId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        ...accountData,
        organization: selectedOrg,
        username: username,
        clientId: clientId,
        apiName: apiName
      });
    }
    onClose();
  };

  return createPortal(
    <div style={{ zIndex: 999999 }} className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header (mục 5.4) */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-[16px] font-medium text-[#020817]">
              {accountData ? 'Cập nhật tài khoản API' : 'Tạo tài khoản API mới'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={BTN_GHOST_ICON}
            aria-label="Đóng"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 space-y-4">

            {/* Target Organization */}
            <div>
              <label className={LABEL_CLS}>
                Đơn vị được cấp quyền <span className={REQUIRED_MARK}>*</span>
              </label>
              <input
                type="text"
                required
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                placeholder="Nhập tên đơn vị được cấp quyền (vd: Sở Y tế tỉnh Bắc Ninh)"
                className={INPUT_CLS}
              />
              <p className="text-[12px] text-[#64748B] mt-1">
                Tài khoản này sẽ được gắn vào cấu hình phân quyền của đơn vị trên.
              </p>
            </div>

            {/* Username */}
            <div>
              <label className={LABEL_CLS}>
                Tên tài khoản (Username) <span className={REQUIRED_MARK}>*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-4 w-4 text-[#94A3B8]" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên tài khoản (vd: yte_bacninh_02)"
                  className={`${INPUT_CLS} pl-10`}
                />
              </div>
            </div>

            {/* Client ID */}
            <div>
              <label className={LABEL_CLS}>
                Client ID / App Key <span className={REQUIRED_MARK}>*</span>
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield className="h-4 w-4 text-[#94A3B8]" />
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={clientId}
                    className={`${INPUT_CLS} pl-10 bg-[#F8FAFC]`}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`${BTN_OUTLINE} w-10 px-0 shrink-0`}
                  aria-label="Sao chép Client ID"
                  title="Sao chép Client ID"
                >
                  {isCopied ? <Check className="w-4 h-4 text-[#16A34A]" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setClientId(generateClientId())}
                  className={`${BTN_OUTLINE} w-10 px-0 shrink-0`}
                  aria-label="Tạo mới Client ID"
                  title="Tạo mới Client ID"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#E2E8F0] flex justify-end gap-3 bg-[#F8FAFC]">
            <button
              type="button"
              onClick={onClose}
              className={BTN_OUTLINE}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className={BTN_PRIMARY}
            >
              <Check className="w-4 h-4" />
              {accountData ? 'Lưu thay đổi' : 'Tạo tài khoản'}
            </button>
          </div>
        </form>

      </div>
    </div>
  , document.body);
}
