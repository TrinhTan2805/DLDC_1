import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Shield, Key, Copy, RefreshCw } from 'lucide-react';

interface ProvisionAccessControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiName: string;
  onSave?: (data: any) => void;
  availableOrganizations?: string[];
  preConfiguredOrganizations?: string[];
}

export function ProvisionAccessControlModal({ 
  isOpen, 
  onClose, 
  apiName, 
  onSave, 
  availableOrganizations = [],
  preConfiguredOrganizations = [] 
}: ProvisionAccessControlModalProps) {
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);
  const [orgSearchQuery, setOrgSearchQuery] = useState('');

  const generateToken = (org: string) => {
    const prefix = org.includes('Công an') ? 'BCA' : org.includes('Y tế') ? 'SYT' : 'ORG';
    const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `Bearer ${prefix}_${randomStr}_${Date.now().toString().slice(-6)}`;
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedOrgs([...preConfiguredOrganizations]);
      setOrgSearchQuery('');
    }
  }, [isOpen, preConfiguredOrganizations]);

  if (!isOpen) return null;

  const getUsernameForOrg = (org: string) => {
    const saved = localStorage.getItem('provision_accounts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const found = parsed.find((a: any) => a.organization === org && a.apiName === apiName);
          if (found) return found.username;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Fallback if not found: generate a default prefix based on organization name
    let prefix = 'org';
    if (org.includes('Công an')) prefix = 'ca';
    else if (org.includes('Y tế')) prefix = 'yte';
    else if (org.includes('Tài chính')) prefix = 'tc';
    else if (org.includes('Kế hoạch')) prefix = 'khdt';
    else if (org.includes('Lao động')) prefix = 'sld';
    else if (org.includes('Giáo dục')) prefix = 'sgd';
    else if (org.includes('Thông tin')) prefix = 'stttt';
    
    return `${prefix}_bacninh_default`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    
    const newlySelected = selectedOrgs.filter(org => !preConfiguredOrganizations.includes(org));
    if (newlySelected.length === 0) {
      alert('Vui lòng chọn thêm ít nhất một Đơn vị/Tổ chức thụ hưởng mới.');
      return;
    }

    const scopes: string[] = ['Đọc (GET)']; // Default scope since UI is removed

    if (onSave) {
      newlySelected.forEach(org => {
        onSave({
          id: Math.random().toString(36).substr(2, 9),
          organization: org,
          authorization: getUsernameForOrg(org),
          scopes: scopes.join(', '),
          ipWhitelist: form.ipWhitelist.value.trim() || 'Tất cả IP',
          validFrom: form.validFrom.value,
          validTo: form.validTo.value,
          status: 'Hợp lệ'
        });
      });
    }
    onClose();
  };

  return createPortal(
    <div style={{ zIndex: 999999 }} className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200 provision-access-control-modal-root">
      <style dangerouslySetInnerHTML={{__html: `
        .provision-access-control-modal-root *:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(svg):not(path):not(circle):not(rect):not(polyline):not(line) {
          font-size: 13px !important;
        }
      `}} />
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-800">
              Cấp quyền truy cập API
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
            
            {/* Target API info alert */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200/50 flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block">API được chọn cấp quyền</span>
                <span className="text-sm font-extrabold text-slate-800 mt-1 block">{apiName}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Partner Organization - Multi-select with Search & Toggle All */}
              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700">
                    Đơn vị / Tổ chức thụ hưởng <span className="text-red-500">*</span>
                  </label>
                  {(availableOrganizations.length > 0 || preConfiguredOrganizations.length > 0) && (
                    <div className="flex gap-3 text-xs">
                      <button
                        type="button"
                        onClick={() => setSelectedOrgs(Array.from(new Set([...preConfiguredOrganizations, ...availableOrganizations])))}
                        className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                      >
                        Chọn tất cả
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => setSelectedOrgs([...preConfiguredOrganizations])}
                        className="text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
                      >
                        Bỏ chọn tất cả
                      </button>
                    </div>
                  )}
                </div>

                {availableOrganizations.length === 0 && preConfiguredOrganizations.length === 0 ? (
                  <p className="text-slate-500 text-xs italic">Không có đơn vị nào khả dụng. Vui lòng kiểm tra tab Danh sách tài khoản.</p>
                ) : (
                  <div className="border border-slate-200 rounded-lg bg-slate-50/30 overflow-hidden flex flex-col">
                    {/* Search bar inside the list */}
                    <div className="p-2 border-b border-slate-200 bg-slate-50/50">
                      <input
                        type="text"
                        placeholder="Tìm kiếm nhanh đơn vị..."
                        value={orgSearchQuery}
                        onChange={(e) => setOrgSearchQuery(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                      />
                    </div>
                    {/* Items list */}
                    <div className="p-2 space-y-1 bg-white" style={{ maxHeight: '160px', overflowY: 'scroll' }}>
                      {Array.from(new Set([...preConfiguredOrganizations, ...availableOrganizations])).filter(org => org.toLowerCase().includes(orgSearchQuery.toLowerCase())).length === 0 ? (
                        <p className="text-slate-400 text-center py-4 text-xs italic">Không tìm thấy đơn vị phù hợp</p>
                      ) : (
                        Array.from(new Set([...preConfiguredOrganizations, ...availableOrganizations]))
                          .filter(org => org.toLowerCase().includes(orgSearchQuery.toLowerCase()))
                          .map(org => {
                            const isPreConfigured = preConfiguredOrganizations.includes(org);
                            const isChecked = selectedOrgs.includes(org) || isPreConfigured;
                            return (
                              <label
                                key={org}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-all ${
                                  isPreConfigured
                                    ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed font-normal'
                                    : isChecked
                                    ? 'bg-blue-50/50 border-blue-200 text-blue-700 font-medium cursor-pointer'
                                    : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50 cursor-pointer'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  disabled={isPreConfigured}
                                  onChange={() => {
                                    if (isPreConfigured) return;
                                    if (isChecked) {
                                      setSelectedOrgs(selectedOrgs.filter(item => item !== org));
                                    } else {
                                      setSelectedOrgs([...selectedOrgs, org]);
                                    }
                                  }}
                                  className={`w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 ${isPreConfigured ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                                />
                                <div className="flex-1 flex items-center justify-between">
                                  <span className="text-[13px]">{org}</span>
                                  {isPreConfigured && (
                                    <span className="text-[11px] font-medium text-slate-400 bg-slate-200/50 px-2 py-0.5 rounded-full border border-slate-200/50 whitespace-nowrap">
                                      Mặc định dịch vụ
                                    </span>
                                  )}
                                </div>
                              </label>
                            );
                          })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Tài khoản (Username) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tài khoản (Username)
                </label>
                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-1.5 min-h-[42px] max-h-[120px] overflow-y-auto">
                  {selectedOrgs.length === 0 ? (
                    <span className="text-slate-400 text-xs italic">Chưa chọn đơn vị thụ hưởng</span>
                  ) : (
                    selectedOrgs.map(org => {
                      const username = getUsernameForOrg(org);
                      return (
                        <div key={org} className="flex justify-between items-center text-xs">
                          <span className="text-slate-600 font-medium">{org}</span>
                          <span className="font-mono font-bold text-slate-800 bg-slate-200/50 px-2.5 py-0.5 rounded border border-slate-200/50">{username}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* IP Whitelist */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Danh sách IP Whitelist (cách nhau bởi dấu phẩy)
                </label>
                <input
                  name="ipWhitelist"
                  type="text"
                  placeholder="Ví dụ: 192.168.1.100, 10.20.30.45 (Để trống để cho phép tất cả IP)"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium bg-white"
                />
              </div>



              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Hiệu lực từ ngày <span className="text-red-500">*</span>
                </label>
                <input
                  name="validFrom"
                  type="date"
                  required
                  defaultValue="2026-05-19"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Hiệu lực đến ngày
                </label>
                <input
                  name="validTo"
                  type="date"
                  defaultValue="2027-05-19"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                />
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
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition-colors font-medium text-sm"
            >
              <Check className="w-4 h-4 mr-2" />
              Cấp quyền truy cập
            </button>
          </div>
        </form>

      </div>
    </div>
  , document.body);
}
