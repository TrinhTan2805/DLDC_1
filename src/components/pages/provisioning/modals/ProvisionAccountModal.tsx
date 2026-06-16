import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Users, Key, Copy, RefreshCw, KeyRound, Shield } from 'lucide-react';

interface ProvisionAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizations: string[];
  onSave?: (data: any) => void;
}

export function ProvisionAccountModal({ isOpen, onClose, organizations, onSave }: ProvisionAccountModalProps) {
  const [selectedOrg, setSelectedOrg] = useState(organizations[0] || 'Sở Y tế tỉnh Bắc Ninh');
  const [username, setUsername] = useState('');
  const [clientId, setClientId] = useState('');
  const [apiName, setApiName] = useState('Lấy danh sách Hộ tịch');
  const [isCopied, setIsCopied] = useState(false);

  const generateClientId = () => {
    return 'client_' + Math.random().toString(36).substring(2, 10);
  };

  useEffect(() => {
    if (isOpen) {
      setClientId(generateClientId());
      setUsername('');
      if (organizations.length > 0) {
        setSelectedOrg(organizations[0]);
      }
      setIsCopied(false);
    }
  }, [isOpen, organizations]);

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
        organization: selectedOrg,
        username: username,
        clientId: clientId,
        apiName: apiName
      });
    }
    onClose();
  };

  return createPortal(
    <div style={{ zIndex: 999999 }} className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200 provision-account-modal-root">
      <style dangerouslySetInnerHTML={{__html: `
        .provision-account-modal-root *:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(svg):not(path):not(circle):not(rect):not(polyline):not(line) {
          font-size: 13px !important;
        }
      `}} />
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-800">
              Tạo tài khoản API mới
            </h2>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            
            {/* Target Organization */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Đơn vị được cấp quyền <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium"
              >
                {organizations.map((org, index) => (
                  <option key={index} value={org}>{org}</option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                Tài khoản này sẽ được gắn vào cấu hình phân quyền của đơn vị trên.
              </p>
            </div>

            {/* Target API */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                API được phép truy cập <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={apiName}
                onChange={(e) => setApiName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium"
              >
                <option value="Lấy danh sách Hộ tịch">Lấy danh sách Hộ tịch</option>
                <option value="Đồng bộ dữ liệu THADS">Đồng bộ dữ liệu THADS</option>
                <option value="Tra cứu Cơ sở dữ liệu Pháp luật">Tra cứu Cơ sở dữ liệu Pháp luật</option>
                <option value="Đọc thông tin Biện pháp bảo đảm">Đọc thông tin Biện pháp bảo đảm</option>
              </select>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Tên tài khoản (Username) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên tài khoản (vd: yte_bacninh_02)"
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Client ID */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Client ID / App Key <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={clientId}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-600 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors flex items-center justify-center bg-white"
                  title="Sao chép Client ID"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setClientId(generateClientId())}
                  className="px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors flex items-center justify-center bg-white"
                  title="Tạo mới Client ID"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition-colors font-medium text-sm shadow-sm"
            >
              <Check className="w-4 h-4 mr-2" />
              Tạo tài khoản
            </button>
          </div>
        </form>

      </div>
    </div>
  , document.body);
}
