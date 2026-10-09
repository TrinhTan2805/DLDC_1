import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, FileText, Download } from 'lucide-react';
import { BTN_PRIMARY, BTN_OUTLINE, BTN_GHOST_ICON, INPUT_CLS as BASE_INPUT_CLS, VIEW_FIELD_CLS, LABEL_CLS, REQUIRED_MARK, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE } from '../../collection/collectionUi';
// Ô nhập chuẩn + quy tắc ô bị khóa ở màn Xem chi tiết (giá trị đen, placeholder xám)
const INPUT_CLS = `${BASE_INPUT_CLS} ${VIEW_FIELD_CLS}`;

interface ProvisionRequestHandoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestData?: any;
  onConfirmHandover: (id: string, receivingUnit: string, file: File | null, receiverName?: string) => void;
}

export function ProvisionRequestHandoverModal({ isOpen, onClose, requestData, onConfirmHandover }: ProvisionRequestHandoverModalProps) {
  const [receivingUnit, setReceivingUnit] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen && requestData) {
      setReceivingUnit(requestData.org || '');
      setReceiverName('');
      setSelectedFile(null);
    }
  }, [isOpen, requestData]);

  if (!isOpen) return null;

  return createPortal(
    <div style={{ zIndex: 999999 }} className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header (mục 5.4) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] flex-shrink-0">
          <h2 className="text-[16px] font-semibold text-[#020817]">Bàn giao dữ liệu</h2>
          <button type="button" aria-label="Đóng" title="Đóng" onClick={onClose} className={BTN_GHOST_ICON}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-6 overflow-y-auto custom-scrollbar">
          <div className="rounded-2xl border border-[#E2E8F0] p-4">
            <h3 className={SECTION_TITLE}>Thông tin yêu cầu</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-1">
                <div className={FIELD_LABEL}>Mã YC</div>
                <div className={FIELD_VALUE}>{requestData?.id}</div>
              </div>
              <div className="space-y-1">
                <div className={FIELD_LABEL}>Cơ quan yêu cầu</div>
                <div className={`${FIELD_VALUE} break-words`}>{requestData?.org}</div>
              </div>
              <div className="space-y-1 col-span-2">
                <div className={FIELD_LABEL}>Loại dữ liệu</div>
                <div className={`${FIELD_VALUE} break-words`}>{requestData?.dataType}</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
              <p className={`${FIELD_LABEL} mb-2`}>File dữ liệu đã kết xuất:</p>
              <div className="flex items-center justify-between gap-3 bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 rounded-lg">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-5 h-5 text-[#16A34A] shrink-0" />
                  <span className="text-[13px] text-[#020817] break-all">data_export_{requestData?.id?.toLowerCase() || 'file'}.{requestData?.format || 'csv'}</span>
                </div>
                <button type="button" className={`${BTN_OUTLINE} !h-8 !px-3 shrink-0`}>
                  <Download className="w-4 h-4" /> Tải về
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className={LABEL_CLS}>Đơn vị nhận bàn giao <span className={REQUIRED_MARK}>*</span></label>
            <input
              type="text"
              value={receivingUnit}
              onChange={(e) => setReceivingUnit(e.target.value)}
              className={INPUT_CLS}
              placeholder="Nhập tên đơn vị nhận bàn giao"
            />
          </div>

          <div>
            <label className={LABEL_CLS}>Tên người nhận bàn giao</label>
            <input
              type="text"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              className={INPUT_CLS}
              placeholder="Nhập tên người nhận bàn giao (không bắt buộc)"
            />
          </div>

          <div>
            <label className={LABEL_CLS}>Biên bản bàn giao <span className={REQUIRED_MARK}>*</span></label>
            <div className="border-2 border-dashed border-[#CBD5E1] rounded-lg p-6 flex flex-col items-center justify-center text-center bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors">
              <input
                type="file"
                id="handover-file"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
              />
              <label htmlFor="handover-file" className="cursor-pointer flex flex-col items-center w-full">
                {selectedFile ? (
                  <>
                    <FileText className="w-10 h-10 text-[#16A34A] mb-2" />
                    <span className="text-[13px] font-medium text-[#020817] text-center max-w-full overflow-hidden text-ellipsis whitespace-nowrap px-4">{selectedFile.name}</span>
                    <span className="text-[12px] text-[#64748B] mt-1">Nhấn để thay đổi file</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-[#94A3B8] mb-2" />
                    <span className="text-[13px] font-medium text-blue-600">Tải lên tệp biên bản</span>
                    <span className="text-[12px] text-[#64748B] mt-1">Hỗ trợ PDF, DOCX, JPG (Tối đa 10MB)</span>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Footer (mục 5.4) */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3 flex-shrink-0">
          <button type="button" aria-label="Hủy bỏ" onClick={onClose} className={BTN_OUTLINE}>Hủy bỏ</button>
          <button
            type="button"
            aria-label="Xác nhận"
            disabled={!receivingUnit || !selectedFile}
            onClick={() => {
              if (requestData?.id) {
                onConfirmHandover(requestData.id, receivingUnit, selectedFile, receiverName);
              }
              onClose();
            }}
            className={BTN_PRIMARY}
          >
            Xác nhận bàn giao
          </button>
        </div>
      </div>
    </div>
  , document.body);
}
