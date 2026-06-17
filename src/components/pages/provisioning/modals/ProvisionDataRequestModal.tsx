import React from 'react';
import { createPortal } from 'react-dom';
import { X, Check } from 'lucide-react';

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

  return createPortal(
    <div style={{ zIndex: 999999 }} className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-850">{viewOnly ? 'Chi tiết yêu cầu kết xuất dữ liệu' : requestData ? 'Cập nhật yêu cầu kết xuất dữ liệu' : 'Tạo yêu cầu kết xuất dữ liệu'}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {viewOnly && requestData?.status === 'TU_CHOI' && requestData?.rejectReason && (
            <div className="border border-red-200 bg-red-50 rounded-lg p-4">
              <label className="block text-[13px] font-semibold text-red-700 mb-1">Lý do từ chối từ người phê duyệt</label>
              <p className="text-[13px] text-red-800">{requestData.rejectReason}</p>
            </div>
          )}

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1">Đơn vị yêu cầu <span className="text-red-500">*</span></label>
            <input value={org} onChange={(e) => setOrg(e.target.value)} placeholder="Ví dụ: Sở Nội vụ Lạng Sơn" disabled={viewOnly} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[13px] disabled:opacity-70 disabled:cursor-not-allowed" />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1">Nội dung yêu cầu <span className="text-red-500">*</span></label>
            <input value={requestContent} onChange={(e) => setRequestContent(e.target.value)} placeholder="Nhập nội dung yêu cầu..." disabled={viewOnly} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[13px] disabled:opacity-70 disabled:cursor-not-allowed" />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1">Đính kèm công văn</label>
            {viewOnly ? (
              <div className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-[13px] text-slate-600">
                {attachment?.name || requestData?.attachment?.name || 'Không có tệp đính kèm'}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <label className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-[13px] font-medium cursor-pointer transition-colors border border-blue-200 shadow-sm">
                  <span>Chọn tệp</span>
                  <input type="file" className="hidden" onChange={(e) => setAttachment(e.target.files?.[0] || null)} />
                </label>
                <span className="text-[13px] text-slate-500 truncate max-w-[200px]">
                  {attachment ? attachment.name : 'Chưa có tệp nào được chọn'}
                </span>
              </div>
            )}
            {!viewOnly && requestData?.attachment && !attachment && <p className="text-xs text-slate-500 mt-1">File hiện tại: {requestData.attachment.name}</p>}
          </div>
          
          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1">Phân loại dữ liệu <span className="text-red-500">*</span></label>
            <select value={dataType} onChange={(e) => setDataType(e.target.value)} disabled={viewOnly} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[13px] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
              <option value="">Chọn loại dữ liệu</option>
              <option value="Dữ liệu Hộ tịch điện tử">Dữ liệu Hộ tịch điện tử</option>
              <option value="Dữ liệu Thi hành án">Dữ liệu Thi hành án</option>
              <option value="Dữ liệu Lý lịch tư pháp">Dữ liệu Lý lịch tư pháp</option>
              <option value="Dữ liệu Doanh nghiệp">Dữ liệu Doanh nghiệp</option>
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1">Người chủ quản dữ liệu <span className="text-red-500">*</span></label>
            <select value={dataOwner} onChange={(e) => setDataOwner(e.target.value)} disabled={viewOnly} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[13px] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
              <option value="">Chọn người chủ quản dữ liệu</option>
              <option value="Đ/c Trần Văn Lãnh Đạo (Trưởng phòng Dữ liệu)">Đ/c Trần Văn Lãnh Đạo (Trưởng phòng Dữ liệu)</option>
              <option value="Đ/c Nguyễn Thị B (Phó Cục trưởng)">Đ/c Nguyễn Thị B (Phó Cục trưởng)</option>
              <option value="Đ/c Lê Văn C (Chuyên viên chính)">Đ/c Lê Văn C (Chuyên viên chính)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1">Từ ngày</label>
              <input value={fromDate} onChange={(e) => setFromDate(e.target.value)} type="date" disabled={viewOnly} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[13px] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1">Đến ngày</label>
              <input value={toDate} onChange={(e) => setToDate(e.target.value)} type="date" disabled={viewOnly} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[13px] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed" />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-2">Định dạng file kết xuất</label>
            <div className="flex gap-4 text-[13px] mt-1">
              {(['excel', 'csv', 'json', 'xml'] as const).map((f) => (
                <label key={f} className={`flex items-center gap-2 ${viewOnly ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}>
                  <input type="radio" className="accent-blue-650 w-4 h-4" checked={format === f} onChange={() => !viewOnly && setFormat(f)} disabled={viewOnly} />
                  {f.toUpperCase()}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1">Mô tả</label>
            <textarea value={purpose} onChange={(e) => setPurpose(e.target.value)} rows={3} placeholder="Mục đích sử dụng dữ liệu" disabled={viewOnly} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[13px] disabled:opacity-70 disabled:cursor-not-allowed" />
          </div>

        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3 bg-slate-50 rounded-b-xl">
          {viewOnly ? (
            <button onClick={onClose} className="bg-white text-[#020817] border border-[#e2e8f0] hover:bg-slate-50 rounded-lg px-4 py-2 font-medium text-[13px] transition-colors shadow-sm">Đóng</button>
          ) : (
            <>
              <button onClick={onClose} className="bg-white text-[#020817] border border-[#e2e8f0] hover:bg-slate-50 rounded-lg px-4 py-2 font-medium text-[13px] transition-colors shadow-sm">Hủy bỏ</button>
              <button onClick={handleCreate} disabled={!org.trim() || !requestContent.trim() || !dataType.trim() || !dataOwner.trim()} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition-colors font-medium text-[13px] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                <Check className="w-4 h-4 mr-1.5" />{requestData ? 'Cập nhật yêu cầu' : 'Tạo và gửi yêu cầu'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  , document.body);
}
