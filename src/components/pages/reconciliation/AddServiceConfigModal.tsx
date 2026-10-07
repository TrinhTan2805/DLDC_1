import { X, CheckCircle, Send, Calendar, HelpCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BTN_PRIMARY, BTN_OUTLINE, BTN_GHOST_ICON, INPUT_CLS, LABEL_CLS, SECTION_TITLE } from '../collection/collectionUi';

export interface ReconciliationApiConfigFormData {
  systemName: string;
  systemCode: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  authType: string;
}

interface AddServiceConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit?: boolean;
  initialData?: ReconciliationApiConfigFormData | null;
  onSave?: (data: ReconciliationApiConfigFormData) => void;
}

// Form Thêm mới/Chỉnh sửa (compomennt.md mục 5.2, 5.4)
export function AddServiceConfigModal({ isOpen, onClose, isEdit, initialData, onSave }: AddServiceConfigModalProps) {
  const [formData, setFormData] = useState<ReconciliationApiConfigFormData>({
    systemName: '',
    systemCode: '',
    endpoint: '',
    method: 'POST',
    authType: 'API Key',
  });

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setFormData(initialData);
      return;
    }
    setFormData({
      systemName: '',
      systemCode: '',
      endpoint: '',
      method: 'POST',
      authType: 'API Key',
    });
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formData.systemName.trim() || !formData.systemCode.trim() || !formData.endpoint.trim()) {
      return;
    }
    onSave?.(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-start justify-between gap-3 flex-shrink-0">
          <div>
            <h2 className="text-[16px] font-medium text-[#020817]">{isEdit ? 'Chỉnh sửa cấu hình đối soát' : 'Tạo gói tin đối soát qua LGSP'}</h2>
            <p className="text-[13px] text-[#64748B] mt-1 leading-5">Cấu hình gói tin gửi tin đối soát qua Cổng LGSP</p>
          </div>
          <button type="button" onClick={onClose} title="Đóng" aria-label="Đóng" className={BTN_GHOST_ICON}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 px-6 py-4 overflow-y-auto custom-scrollbar space-y-6">
          <div>
            <h3 className={SECTION_TITLE}>Thông tin chung</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="recon-cfg-system" className={LABEL_CLS}>Hệ thống gửi (A)</label>
                <select
                  id="recon-cfg-system"
                  title="Hệ thống gửi"
                  value={formData.systemName}
                  onChange={(e) => setFormData({ ...formData, systemName: e.target.value })}
                  className={INPUT_CLS}
                >
                  <option value="">-- Chọn hệ thống --</option>
                  <option value="Hệ thống Hộ tịch điện tử">Hệ thống Hộ tịch điện tử</option>
                  <option value="Hệ thống Đăng ký kinh doanh">Hệ thống Đăng ký kinh doanh</option>
                  <option value="Hệ thống Công chứng">Hệ thống Công chứng</option>
                </select>
              </div>
              <div>
                <label htmlFor="recon-cfg-code" className={LABEL_CLS}>Mã dịch vụ LGSP</label>
                <input
                  id="recon-cfg-code"
                  type="text"
                  value={formData.systemCode}
                  onChange={(e) => setFormData({ ...formData, systemCode: e.target.value })}
                  placeholder="VD: LGSP_RECONCILE_001"
                  className={`${INPUT_CLS} placeholder:text-[#94A3B8]`}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className={SECTION_TITLE}>Thông tin kỹ thuật LGSP</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="recon-cfg-endpoint" className={LABEL_CLS}>Endpoint LGSP</label>
                <input
                  id="recon-cfg-endpoint"
                  type="text"
                  value={formData.endpoint}
                  onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                  placeholder="https://lgsp.gov.vn/api/reconciliation"
                  className={`${INPUT_CLS} placeholder:text-[#94A3B8]`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="recon-cfg-method" className={LABEL_CLS}>Phương thức</label>
                  <select
                    id="recon-cfg-method"
                    title="Phương thức"
                    value={formData.method}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value as ReconciliationApiConfigFormData['method'] })}
                    className={INPUT_CLS}
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="recon-cfg-auth" className={LABEL_CLS}>Cơ chế xác thực</label>
                  <select
                    id="recon-cfg-auth"
                    title="Cơ chế xác thực"
                    value={formData.authType}
                    onChange={(e) => setFormData({ ...formData, authType: e.target.value })}
                    className={INPUT_CLS}
                  >
                    <option value="API Key">API Key</option>
                    <option value="OAuth 2.0">OAuth 2.0</option>
                    <option value="JWT Token">JWT Token</option>
                    <option value="Chữ ký số">Chữ ký số</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between gap-3 flex-wrap flex-shrink-0">
          <div className="flex items-center gap-3 flex-wrap">
            <button type="button" className={BTN_OUTLINE}>
              <CheckCircle className="w-4 h-4" />
              Kiểm tra kết nối
            </button>
            <button type="button" className={BTN_OUTLINE}>
              <Send className="w-4 h-4" />
              Gửi thử
            </button>
            <button type="button" className={BTN_OUTLINE}>
              <Calendar className="w-4 h-4" />
              Xem lịch
            </button>
            <HelpCircle className="w-4 h-4 text-[#94A3B8]" />
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose} className={BTN_OUTLINE}>
              Hủy
            </button>
            <button type="button" onClick={handleSave} className={BTN_PRIMARY}>
              {isEdit ? 'Cập nhật cấu hình' : 'Lưu cấu hình'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
