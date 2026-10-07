import React from 'react';
import { createPortal } from 'react-dom';
import { X, FileText, Download, Globe, Clock, CheckCircle, AlertTriangle, Database } from 'lucide-react';
import { Badge, BTN_OUTLINE, BTN_GHOST_ICON, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE } from '../../collection/collectionUi';

interface ProvisionPublishDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestData?: any;
}

export function ProvisionPublishDetailModal({ isOpen, onClose, requestData }: ProvisionPublishDetailModalProps) {
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

  const isUnpublished = requestData.status === 'HUY_CONG_KHAI';

  return createPortal(
    <div style={{ zIndex: 999999 }} className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header (mục 5.4) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] flex-shrink-0">
          <h2 className="text-[16px] font-medium text-[#020817]">Chi tiết Công khai dịch vụ</h2>
          <button type="button" onClick={onClose} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-6 overflow-y-auto custom-scrollbar">
          {isUnpublished && (
            <div className="bg-[#FEF2F2] p-4 rounded-lg border border-[#FEE2E2] flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#DC2626] flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <h3 className="text-[13px] font-medium text-[#B91C1C] mb-1">Dịch vụ đã bị hủy công khai</h3>
                <p className="text-[13px] text-[#020817]">Dịch vụ này đã ngừng đồng bộ trên các nền tảng chia sẻ dữ liệu.</p>
                <div className="mt-3 pt-3 border-t border-[#FEE2E2] space-y-1">
                  <p className={FIELD_LABEL}>Lý do hủy</p>
                  <p className={`${FIELD_VALUE} break-words`}>{requestData.publishDetails?.unpublishReason || 'Không có lý do'}</p>
                  <p className="text-[12px] text-[#64748B] pt-1">Thời gian: {formatDate(requestData.publishDetails?.unpublishDate)}</p>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-[#E2E8F0] p-4">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="space-y-1">
                <div className={FIELD_LABEL}>Mã YC</div>
                <div className={FIELD_VALUE}>{requestData.id}</div>
              </div>
              {!isUnpublished && (
                <Badge label="Đã công khai" variant="blue" icon={<CheckCircle className="w-3.5 h-3.5" />} />
              )}
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
                  <span className="text-[13px] text-[#020817] break-all">data_export_{requestData.id?.toLowerCase()}.{requestData.format || 'json'}</span>
                </div>
                <button type="button" className={`${BTN_OUTLINE} !h-8 !px-3 shrink-0`}>
                  <Download className="w-4 h-4" /> Tải về
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className={SECTION_TITLE}>
              <Globe className="w-4 h-4 text-blue-600" />
              Thông tin Công khai
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-[#94A3B8] mt-0.5 shrink-0" />
                <div className="w-full space-y-1">
                  <p className={`${FIELD_LABEL} mb-1`}>Nền tảng công khai</p>
                  <div className="space-y-2">
                    {requestData.publishDetails?.platforms?.includes('national') && (
                      <div className="flex items-center gap-2 bg-[#EAF3FF] text-blue-600 px-3 py-2 rounded-lg text-[13px] border border-[#BFDBFE]">
                        <Globe className="w-4 h-4" /> Cổng dữ liệu dùng chung Quốc gia
                      </div>
                    )}
                    {requestData.publishDetails?.platforms?.includes('lgsp') && (
                      <div className="flex items-center gap-2 bg-[#EAF3FF] text-blue-600 px-3 py-2 rounded-lg text-[13px] border border-[#BFDBFE]">
                        <Database className="w-4 h-4" /> Nền tảng chia sẻ dữ liệu nội bộ (LGSP)
                      </div>
                    )}
                    {(!requestData.publishDetails?.platforms || requestData.publishDetails.platforms.length === 0) && (
                      <p className="text-[13px] text-[#64748B]">Không có thông tin nền tảng.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-[#94A3B8] mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className={FIELD_LABEL}>Mô tả lý do công khai</p>
                  <p className={`${FIELD_VALUE} break-words`}>{requestData.publishDetails?.reason || 'Không có mô tả'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#94A3B8] mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className={FIELD_LABEL}>Thời gian công khai</p>
                  <p className={FIELD_VALUE}>{formatDate(requestData.publishDetails?.publishDate)}</p>
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
