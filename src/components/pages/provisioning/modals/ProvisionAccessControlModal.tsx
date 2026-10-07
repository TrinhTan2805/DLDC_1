import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Shield, Key, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Badge, BTN_GHOST_ICON, BTN_OUTLINE, BTN_PRIMARY, INPUT_CLS as BASE_INPUT_CLS, VIEW_FIELD_CLS, LABEL_CLS, REQUIRED_MARK } from '../../collection/collectionUi';
// Ô nhập chuẩn + quy tắc ô bị khóa ở màn Xem chi tiết (giá trị đen, placeholder xám)
const INPUT_CLS = `${BASE_INPUT_CLS} ${VIEW_FIELD_CLS}`;

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
      toast.error('Vui lòng chọn thêm ít nhất một Đơn vị/Tổ chức thụ hưởng mới.');
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
    <div style={{ zIndex: 999999 }} className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h2 className="text-[16px] font-medium text-[#020817]">
              Cấp quyền truy cập API
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={BTN_GHOST_ICON}
            title="Đóng"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar text-[13px] text-[#020817]">
            
            {/* Target API info alert */}
            <div className="p-3 bg-[#EAF3FF] rounded-lg border border-[#BFDBFE] flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#155DFC] shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-[13px] text-[#64748B] block">API được chọn cấp quyền</span>
                <span className="text-[13px] font-medium text-[#020817] mt-0.5 block break-words">{apiName}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Partner Organization - Multi-select with Search & Toggle All */}
              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[13px] font-medium text-[#020817]">
                    Đơn vị / Tổ chức thụ hưởng <span className={REQUIRED_MARK}>*</span>
                  </label>
                  {(availableOrganizations.length > 0 || preConfiguredOrganizations.length > 0) && (
                    <div className="flex items-center gap-3 text-[13px]">
                      <button
                        type="button"
                        onClick={() => setSelectedOrgs(Array.from(new Set([...preConfiguredOrganizations, ...availableOrganizations])))}
                        className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                      >
                        Chọn tất cả
                      </button>
                      <span className="text-[#CBD5E1]">|</span>
                      <button
                        type="button"
                        onClick={() => setSelectedOrgs([...preConfiguredOrganizations])}
                        className="text-[#64748B] hover:text-[#020817] font-medium cursor-pointer"
                      >
                        Bỏ chọn tất cả
                      </button>
                    </div>
                  )}
                </div>

                {availableOrganizations.length === 0 && preConfiguredOrganizations.length === 0 ? (
                  <p className="text-[#64748B] text-[13px]">Không có đơn vị nào khả dụng. Vui lòng kiểm tra tab Danh sách tài khoản.</p>
                ) : (
                  <div className="border border-[#E2E8F0] rounded-lg overflow-hidden flex flex-col">
                    {/* Search bar inside the list */}
                    <div className="p-2 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                      <input
                        type="text"
                        placeholder="Tìm kiếm nhanh đơn vị..."
                        value={orgSearchQuery}
                        onChange={(e) => setOrgSearchQuery(e.target.value)}
                        className={INPUT_CLS}
                      />
                    </div>
                    {/* Items list */}
                    <div className="p-2 space-y-1 bg-white max-h-[160px] overflow-y-scroll custom-scrollbar">
                      {Array.from(new Set([...preConfiguredOrganizations, ...availableOrganizations])).filter(org => org.toLowerCase().includes(orgSearchQuery.toLowerCase())).length === 0 ? (
                        <p className="text-[#64748B] text-center py-4 text-[13px]">Không tìm thấy đơn vị phù hợp</p>
                      ) : (
                        Array.from(new Set([...preConfiguredOrganizations, ...availableOrganizations]))
                          .filter(org => org.toLowerCase().includes(orgSearchQuery.toLowerCase()))
                          .map(org => {
                            const isPreConfigured = preConfiguredOrganizations.includes(org);
                            const isChecked = selectedOrgs.includes(org) || isPreConfigured;
                            return (
                              <label
                                key={org}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors ${
                                  isPreConfigured
                                    ? 'bg-[#F1F5F9] border-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
                                    : isChecked
                                    ? 'bg-[#EAF3FF] border-[#BFDBFE] text-[#155DFC] cursor-pointer'
                                    : 'bg-white border-[#E2E8F0] text-[#020817] hover:bg-[#F8FAFC] cursor-pointer'
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
                                  className={`w-4 h-4 shrink-0 accent-blue-600 rounded ${isPreConfigured ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                />
                                <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                                  <span className="text-[13px]">{org}</span>
                                  {isPreConfigured && (
                                    <Badge label="Mặc định dịch vụ" variant="slate" />
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
                <label className={LABEL_CLS}>
                  Tài khoản (Username)
                </label>
                <div className="border border-[#E2E8F0] rounded-lg p-3 bg-white space-y-1.5 min-h-10 max-h-[120px] overflow-y-auto custom-scrollbar">
                  {selectedOrgs.length === 0 ? (
                    <span className="text-[#94A3B8] text-[13px]">Chưa chọn đơn vị thụ hưởng</span>
                  ) : (
                    selectedOrgs.map(org => {
                      const username = getUsernameForOrg(org);
                      return (
                        <div key={org} className="flex justify-between items-center gap-3 text-[13px]">
                          <span className="text-[#475569] min-w-0">{org}</span>
                          <span className="text-[13px] text-[#020817] bg-[#F8FAFC] px-2.5 py-0.5 rounded-lg border border-[#E2E8F0] break-all">{username}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* IP Whitelist */}
              <div className="md:col-span-2">
                <label className={LABEL_CLS}>
                  Danh sách IP Whitelist (cách nhau bởi dấu phẩy)
                </label>
                <input
                  name="ipWhitelist"
                  type="text"
                  placeholder="Ví dụ: 192.168.1.100, 10.20.30.45 (Để trống để cho phép tất cả IP)"
                  className={INPUT_CLS}
                />
              </div>



              {/* Start Date */}
              <div>
                <label className={LABEL_CLS}>
                  Hiệu lực từ ngày <span className={REQUIRED_MARK}>*</span>
                </label>
                <input
                  name="validFrom"
                  type="date"
                  required
                  defaultValue="2026-05-19"
                  className={INPUT_CLS}
                />
              </div>

              {/* End Date */}
              <div>
                <label className={LABEL_CLS}>
                  Hiệu lực đến ngày
                </label>
                <input
                  name="validTo"
                  type="date"
                  defaultValue="2027-05-19"
                  className={INPUT_CLS}
                />
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
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
              Cấp quyền truy cập
            </button>
          </div>
        </form>

      </div>
    </div>
  , document.body);
}
