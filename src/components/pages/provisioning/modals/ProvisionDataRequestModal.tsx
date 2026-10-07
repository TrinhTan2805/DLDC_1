import React from 'react';
import { createPortal } from 'react-dom';
import { X, Check } from 'lucide-react';
import { BTN_PRIMARY, BTN_OUTLINE, BTN_GHOST_ICON, INPUT_CLS as BASE_INPUT_CLS, VIEW_FIELD_CLS, LABEL_CLS, REQUIRED_MARK } from '../../collection/collectionUi';
// Ô nhập chuẩn + quy tắc ô bị khóa ở màn Xem chi tiết (giá trị đen, placeholder xám)
const INPUT_CLS = `${BASE_INPUT_CLS} ${VIEW_FIELD_CLS}`;

export interface CreateDataRequestPayload {
  org: string;
  requestContent?: string;
  attachment?: File | null;
  dataType: string;
  fromDate: string;
  toDate: string;
  format: 'excel' | 'csv' | 'json' | 'xml';
  purpose: string;
  dataOwner: string;
}

interface ProvisionDataRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (payload: CreateDataRequestPayload) => void;
  requestData?: any;
  viewOnly?: boolean;
}

export function ProvisionDataRequestModal({ isOpen, onClose, onCreate, requestData, viewOnly }: ProvisionDataRequestModalProps) {
  const [org, setOrg] = React.useState('');
  const [requestContent, setRequestContent] = React.useState('');
  const [attachment, setAttachment] = React.useState<File | null>(null);
  const [dataType, setDataType] = React.useState('');
  const [fromDate, setFromDate] = React.useState('');
  const [toDate, setToDate] = React.useState('');
  const [format, setFormat] = React.useState<'excel' | 'csv' | 'json' | 'xml'>('excel');
  const [purpose, setPurpose] = React.useState('');
  const [dataOwner, setDataOwner] = React.useState('');

  React.useEffect(() => {
    if (isOpen) {
      if (requestData) {
        setOrg(requestData.org || '');
        setRequestContent(requestData.requestContent || '');
        setAttachment(requestData.attachment || null);
        setDataType(requestData.dataType || '');
        setFromDate(requestData.fromDate || '');
        setToDate(requestData.toDate || '');
        setFormat(requestData.format || 'excel');
        setPurpose(requestData.purpose || '');
        setDataOwner(requestData.dataOwner || '');
      } else {
        setOrg('');
        setRequestContent('');
        setAttachment(null);
        setDataType('');
        setFromDate('');
        setToDate('');
        setFormat('excel');
        setPurpose('');
        setDataOwner('');
      }
    }
  }, [isOpen, requestData]);

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!org.trim() || !requestContent.trim() || !dataType.trim() || !dataOwner.trim()) return;
    onCreate?.({ org: org.trim(), requestContent: requestContent.trim(), attachment, dataType, fromDate, toDate, format, purpose: purpose.trim(), dataOwner });
    onClose();
  };

  const TEXTAREA_CLS = 'w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-[#F0F0F0] disabled:text-[#000000] disabled:border-[rgba(0,0,0,0.26)] disabled:placeholder:text-[#94A3B8] disabled:cursor-not-allowed';

  return createPortal(
    <div style={{ zIndex: 999999 }} className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header (mục 5.4) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] flex-shrink-0">
          <h2 className="text-[16px] font-medium text-[#020817]">{viewOnly ? 'Chi tiết yêu cầu kết xuất dữ liệu' : requestData ? 'Cập nhật yêu cầu kết xuất dữ liệu' : 'Tạo yêu cầu kết xuất dữ liệu'}</h2>
          <button type="button" onClick={onClose} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 space-y-4">
          {viewOnly && requestData?.status === 'TU_CHOI' && requestData?.rejectReason && (
            <div className="border border-[#FEE2E2] bg-[#FEF2F2] rounded-lg p-4">
              <label className="block text-[13px] font-medium text-[#B91C1C] mb-1">Lý do từ chối từ người phê duyệt</label>
              <p className="text-[13px] text-[#020817]">{requestData.rejectReason}</p>
            </div>
          )}

          <div>
            <label className={LABEL_CLS}>Đơn vị yêu cầu <span className={REQUIRED_MARK}>*</span></label>
            <input value={org} onChange={(e) => setOrg(e.target.value)} placeholder="Ví dụ: Sở Nội vụ Lạng Sơn" disabled={viewOnly} className={INPUT_CLS} />
          </div>

          <div>
            <label className={LABEL_CLS}>Nội dung yêu cầu <span className={REQUIRED_MARK}>*</span></label>
            <input value={requestContent} onChange={(e) => setRequestContent(e.target.value)} placeholder="Nhập nội dung yêu cầu..." disabled={viewOnly} className={INPUT_CLS} />
          </div>

          <div>
            <label className={LABEL_CLS}>Đính kèm công văn</label>
            {viewOnly ? (
              <div className="h-10 px-3 flex items-center bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg text-[13px] text-[#94A3B8]">
                {attachment?.name || requestData?.attachment?.name || 'Không có tệp đính kèm'}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <label className={BTN_OUTLINE}>
                  <span>Chọn tệp</span>
                  <input type="file" className="hidden" onChange={(e) => setAttachment(e.target.files?.[0] || null)} />
                </label>
                <span className="text-[13px] text-[#64748B] truncate max-w-[200px]">
                  {attachment ? attachment.name : 'Chưa có tệp nào được chọn'}
                </span>
              </div>
            )}
            {!viewOnly && requestData?.attachment && !attachment && <p className="text-[12px] text-[#64748B] mt-1">File hiện tại: {requestData.attachment.name}</p>}
          </div>

          <div>
            <label className={LABEL_CLS}>Phân loại dữ liệu <span className={REQUIRED_MARK}>*</span></label>
            <select value={dataType} onChange={(e) => setDataType(e.target.value)} disabled={viewOnly} className={`${INPUT_CLS} cursor-pointer`}>
              <option value="">Chọn loại dữ liệu</option>
              <option value="Dữ liệu Hộ tịch điện tử">Dữ liệu Hộ tịch điện tử</option>
              <option value="Dữ liệu Thi hành án">Dữ liệu Thi hành án</option>
              <option value="Dữ liệu Lý lịch tư pháp">Dữ liệu Lý lịch tư pháp</option>
              <option value="Dữ liệu Doanh nghiệp">Dữ liệu Doanh nghiệp</option>
            </select>
          </div>

          <div>
            <label className={LABEL_CLS}>Người chủ quản dữ liệu <span className={REQUIRED_MARK}>*</span></label>
            <select value={dataOwner} onChange={(e) => setDataOwner(e.target.value)} disabled={viewOnly} className={`${INPUT_CLS} cursor-pointer`}>
              <option value="">Chọn người chủ quản dữ liệu</option>
              <option value="Đ/c Trần Văn Lãnh Đạo (Trưởng phòng Dữ liệu)">Đ/c Trần Văn Lãnh Đạo (Trưởng phòng Dữ liệu)</option>
              <option value="Đ/c Nguyễn Thị B (Phó Cục trưởng)">Đ/c Nguyễn Thị B (Phó Cục trưởng)</option>
              <option value="Đ/c Lê Văn C (Chuyên viên chính)">Đ/c Lê Văn C (Chuyên viên chính)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Từ ngày</label>
              <input value={fromDate} onChange={(e) => setFromDate(e.target.value)} type="date" disabled={viewOnly} className={`${INPUT_CLS} cursor-pointer`} />
            </div>
            <div>
              <label className={LABEL_CLS}>Đến ngày</label>
              <input value={toDate} onChange={(e) => setToDate(e.target.value)} type="date" disabled={viewOnly} className={`${INPUT_CLS} cursor-pointer`} />
            </div>
          </div>

          <div>
            <label className={LABEL_CLS}>Định dạng file kết xuất</label>
            <div className="flex gap-4 text-[13px] text-[#020817] mt-2">
              {(['excel', 'csv', 'json', 'xml'] as const).map((f) => (
                <label key={f} className={`flex items-center gap-2 ${viewOnly ? 'cursor-not-allowed text-[#94A3B8]' : 'cursor-pointer'}`}>
                  <input type="radio" className="accent-blue-600 w-4 h-4" checked={format === f} onChange={() => !viewOnly && setFormat(f)} disabled={viewOnly} />
                  {f.toUpperCase()}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={LABEL_CLS}>Mô tả</label>
            <textarea value={purpose} onChange={(e) => setPurpose(e.target.value)} rows={3} placeholder="Mục đích sử dụng dữ liệu" disabled={viewOnly} className={TEXTAREA_CLS} />
          </div>

        </div>

        {/* Footer (mục 5.4) */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3 flex-shrink-0">
          {viewOnly ? (
            <button type="button" onClick={onClose} className={BTN_OUTLINE}>Đóng</button>
          ) : (
            <>
              <button type="button" onClick={onClose} className={BTN_OUTLINE}>Hủy bỏ</button>
              <button type="button" onClick={handleCreate} disabled={!org.trim() || !requestContent.trim() || !dataType.trim() || !dataOwner.trim()} className={BTN_PRIMARY}>
                <Check className="w-4 h-4" />{requestData ? 'Cập nhật yêu cầu' : 'Tạo và gửi yêu cầu'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  , document.body);
}
