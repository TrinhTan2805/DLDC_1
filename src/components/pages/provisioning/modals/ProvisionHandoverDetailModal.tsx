import React from 'react';
import { createPortal } from 'react-dom';
import { X, FileText, Download, CheckCircle, Clock, User, Building } from 'lucide-react';
import { Badge, BTN_OUTLINE, BTN_GHOST_ICON, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE } from '../../collection/collectionUi';

interface ProvisionHandoverDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestData?: any;
}

export function ProvisionHandoverDetailModal({ isOpen, onClose, requestData }: ProvisionHandoverDetailModalProps) {
  if (!isOpen || !requestData) return null;

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleString('vi-VN');
    } catch {
      return isoString;
    }
  };

  return createPortal(
    <div style={{ zIndex: 999999 }} className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header (mục 5.4) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] flex-shrink-0">
          <h2 className="text-[16px] font-medium text-[#020817]">Chi tiết Bàn giao dữ liệu</h2>
          <button type="button" onClick={onClose} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-6 overflow-y-auto custom-scrollbar">
          <div className="rounded-2xl border border-[#E2E8F0] p-4">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="space-y-1">
                <div className={FIELD_LABEL}>Mã YC</div>
                <div className={FIELD_VALUE}>{requestData.id}</div>
              </div>
              <Badge label="Đã bàn giao" variant="green" icon={<CheckCircle className="w-3.5 h-3.5" />} />
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-1">
                <div className={FIELD_LABEL}>Cơ quan yêu cầu</div>
                <div className={`${FIELD_VALUE} break-words`}>{requestData.org}</div>
              </div>
              <div className="space-y-1">
                <div className={FIELD_LABEL}>Loại dữ liệu</div>
                <div className={`${FIELD_VALUE} break-words`}>{requestData.dataType}</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
              <p className={`${FIELD_LABEL} mb-2`}>File dữ liệu kết xuất:</p>
              <div className="flex items-center justify-between gap-3 bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 rounded-lg">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-5 h-5 text-[#16A34A] shrink-0" />
                  <span className="text-[13px] text-[#020817] break-all">data_export_{requestData.id?.toLowerCase()}.{requestData.format || 'csv'}</span>
                </div>
                <button type="button" className={`${BTN_OUTLINE} !h-8 !px-3 shrink-0`}>
                  <Download className="w-4 h-4" /> Tải về
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className={SECTION_TITLE}>
              <FileText className="w-4 h-4 text-blue-600" />
              Thông tin biên bản bàn giao
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building className="w-5 h-5 text-[#94A3B8] mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className={FIELD_LABEL}>Đơn vị nhận bàn giao</p>
                  <p className={FIELD_VALUE}>{requestData.handoverDetails?.receivingUnit || requestData.org}</p>
                </div>
              </div>

              {requestData.handoverDetails?.receiverName && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-[#94A3B8] mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className={FIELD_LABEL}>Người nhận</p>
                    <p className={FIELD_VALUE}>{requestData.handoverDetails.receiverName}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#94A3B8] mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className={FIELD_LABEL}>Thời gian bàn giao</p>
                  <p className={FIELD_VALUE}>{formatDate(requestData.handoverDetails?.date) || formatDate(requestData.requestDate)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-[#94A3B8] mt-0.5 shrink-0" />
                <div className="w-full min-w-0 space-y-1">
                  <p className={FIELD_LABEL}>Biên bản đính kèm</p>
                  <div className="flex items-center justify-between gap-3 bg-[#EAF3FF] border border-[#BFDBFE] p-2.5 rounded-lg w-full">
                    <span className="text-[13px] text-blue-600 break-all">
                      {requestData.handoverDetails?.file?.name || `BienBan_BanGiao_${requestData.id}.pdf`}
                    </span>
                    <button type="button" className={`${BTN_OUTLINE} !h-8 !px-3 shrink-0`}>
                      <Download className="w-4 h-4" /> Tải biên bản
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer (mục 5.4) */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3 flex-shrink-0">
          <button type="button" onClick={onClose} className={BTN_OUTLINE}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  , document.body);
}
