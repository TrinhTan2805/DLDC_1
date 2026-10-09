import React from 'react';
import { createPortal } from 'react-dom';
import { X, Copy, Check } from 'lucide-react';
import { Badge, BTN_OUTLINE, BTN_GHOST_ICON } from '../../collection/collectionUi';

interface ProvisionServicePublicDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: any;
}

// Hàng nhãn–giá trị (mục 5.17): nhãn 25% nền #F8FAFC, giá trị 13px #020817
const ROW_CLS = 'flex flex-col md:flex-row items-stretch bg-white w-full';
const ROW_LABEL_CLS = 'px-4 py-3 bg-[#F8FAFC] md:border-r border-[#E2E8F0] text-[13px] font-semibold text-[#020817] md:w-1/4 flex items-center shrink-0';
const ROW_VALUE_CLS = 'px-4 py-3 flex-1 text-[13px] text-[#020817] w-full flex items-center';
// Nội dung code/endpoint: chữ thường 13px trong ô nền #F8FAFC viền #E2E8F0 bo 8px
const CODE_BOX_CLS = 'text-[13px] text-[#020817] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 break-all select-all flex-1 w-full';
const COPY_BTN_CLS = 'w-8 h-8 inline-flex items-center justify-center rounded-lg border border-[#CBD5E1] bg-white text-[#475569] hover:bg-[#F8FAFC] hover:text-blue-600 transition-colors shrink-0 cursor-pointer';

export function ProvisionServicePublicDetailsModal({ isOpen, onClose, service }: ProvisionServicePublicDetailsModalProps) {
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [copiedBody, setCopiedBody] = React.useState(false);

  if (!isOpen || !service) return null;

  // Generate high-fidelity details based on selected service
  const apiName = service.code ? `CSDL_${service.code.toUpperCase()}` : 'CSDL_DV_002';
  const dataType = 'INFO';
  const database = service.type === 'Dữ liệu Hộ tịch điện tử'
    ? 'kho_du_lieu_dung_chung_dan_cu'
    : 'kho_du_lieu_dung_chung_thi_hanh_an';
  const tableName = service.type === 'Dữ liệu Hộ tịch điện tử'
    ? 'ho_tich_ca_nhan'
    : 'thi_hang_an_dan_su';

  // Custom high-fidelity mock URL
  const sampleLink = `https://kdls.moj.gov.vn/public/public/api/${service.code || 'DV_002'}`;

  const requestBody = JSON.stringify({
    apiName: apiName,
    appKey: "<appKey>"
  }, null, 2);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sampleLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyBody = () => {
    navigator.clipboard.writeText(requestBody);
    setCopiedBody(true);
    setTimeout(() => setCopiedBody(false), 2000);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header (mục 5.4) */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-[#E2E8F0] shrink-0">
          <h3 className="text-[16px] font-semibold text-[#020817]">Thông tin chi tiết API</h3>
          <button type="button" onClick={onClose} className={BTN_GHOST_ICON} title="Đóng" aria-label="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 overflow-y-auto custom-scrollbar">
          <div className="border border-[#E2E8F0] rounded-lg overflow-hidden divide-y divide-[#E2E8F0] w-full">
            <div className={ROW_CLS}>
              <div className={ROW_LABEL_CLS}>Tên Api:</div>
              <div className={ROW_VALUE_CLS}>{apiName}</div>
            </div>

            <div className={ROW_CLS}>
              <div className={ROW_LABEL_CLS}>Loại dữ liệu trả về:</div>
              <div className={ROW_VALUE_CLS}>{dataType}</div>
            </div>

            <div className={ROW_CLS}>
              <div className={ROW_LABEL_CLS}>Cơ sở dữ liệu:</div>
              <div className={ROW_VALUE_CLS}>{database}</div>
            </div>

            <div className={ROW_CLS}>
              <div className={ROW_LABEL_CLS}>Tên bảng:</div>
              <div className={ROW_VALUE_CLS}>{tableName}</div>
            </div>

            <div className={ROW_CLS}>
              <div className={ROW_LABEL_CLS}>Link mẫu:</div>
              <div className={`${ROW_VALUE_CLS} gap-3`}>
                <span className={CODE_BOX_CLS}>{sampleLink}</span>
                <button type="button" onClick={handleCopyLink} className={COPY_BTN_CLS} title="Sao chép Link" aria-label="Sao chép Link">
                  {copiedLink ? <Check className="w-4 h-4 text-[#16A34A]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className={ROW_CLS}>
              <div className={ROW_LABEL_CLS}>Body:</div>
              <div className={`${ROW_VALUE_CLS} items-start gap-3`}>
                <pre className={`${CODE_BOX_CLS} font-sans whitespace-pre-wrap overflow-auto custom-scrollbar h-[162px]`}>
                  {requestBody}
                </pre>
                <button type="button" onClick={handleCopyBody} className={COPY_BTN_CLS} title="Sao chép Body payload" aria-label="Sao chép Body payload">
                  {copiedBody ? <Check className="w-4 h-4 text-[#16A34A]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className={ROW_CLS}>
              <div className={ROW_LABEL_CLS}>Loại API:</div>
              <div className={ROW_VALUE_CLS}>{service.isPublic ? 'Public' : 'Private'}</div>
            </div>

            {service.publishReason && (
              <div className={ROW_CLS}>
                <div className={ROW_LABEL_CLS}>Lý do công khai:</div>
                <div className={ROW_VALUE_CLS}>{service.publishReason}</div>
              </div>
            )}

            <div className={ROW_CLS}>
              <div className={ROW_LABEL_CLS}>Trạng thái:</div>
              <div className={ROW_VALUE_CLS}>
                <Badge label="Kích hoạt" variant="green" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3 shrink-0">
          <button type="button" onClick={onClose} className={BTN_OUTLINE}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  , document.body);
}
