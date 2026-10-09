import React from 'react';
import { createPortal } from 'react-dom';
import { X, GitCompare, PlusCircle, MinusCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge, BTN_OUTLINE, BTN_GHOST_ICON, FIELD_LABEL, FIELD_VALUE } from '../../collection/collectionUi';

interface ApiVersionCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiName: string;
  versionA: string;
  versionB: string;
}

export function ApiVersionCompareModal({ isOpen, onClose, apiName, versionA, versionB }: ApiVersionCompareModalProps) {
  if (!isOpen) return null;

  // Premium mock diff data showing fields of the API structure
  const diffProperties = [
    { name: 'ho_ten', typeA: 'string', typeB: 'string', status: 'unchanged', desc: 'Họ và tên công dân' },
    { name: 'ngay_thang_nam_sinh', typeA: 'string (YYYY-MM-DD)', typeB: 'string (DD/MM/YYYY)', status: 'modified', desc: 'Đổi định dạng chuỗi ngày sinh thành chuẩn ISO YYYY-MM-DD' },
    { name: 'so_dinh_danh_can_nhan', typeA: 'string (12 số)', typeB: 'string (12 số)', status: 'unchanged', desc: 'Số định danh cá nhân CC/CCCD' },
    { name: 'quoc_tich', typeA: 'string', typeB: 'Không tồn tại', status: 'added', desc: 'Thêm mới trường quốc tịch' },
    { name: 'so_dien_thoai_cu', typeA: 'Không tồn tại', typeB: 'string', status: 'deleted', desc: 'Lược bỏ trường số điện thoại cũ để tăng tính bảo mật' },
    { name: 'tinh_trang_cu_tru', typeA: 'string', typeB: 'string', status: 'unchanged', desc: 'Tình trạng cư trú hiện tại' },
  ];

  return createPortal(
    <div style={{ zIndex: 999999 }} className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header (mục 5.4) */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-blue-50 rounded-lg shrink-0">
              <GitCompare className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-[16px] font-semibold text-[#020817] leading-6">
                So sánh cấu trúc phiên bản API
              </h2>
              <p className="text-[13px] text-[#64748B] truncate">Dịch vụ: {apiName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={BTN_GHOST_ICON}
            aria-label="Đóng"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 space-y-4">

          {/* Info Summary row */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between rounded-2xl border border-[#E2E8F0] p-4">
            <div>
              <span className={`${FIELD_LABEL} block`}>API được so sánh</span>
              <span className={`${FIELD_VALUE} block mt-1`}>{apiName}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center px-4 py-1.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                <span className="text-[12px] text-[#64748B] block">Phiên bản cũ</span>
                <span className="text-[13px] font-medium text-[#020817]">{versionB}</span>
              </div>
              <div className="text-[13px] text-[#64748B]">→</div>
              <div className="text-center px-4 py-1.5 bg-[#EAF3FF] rounded-lg border border-[#BFDBFE]">
                <span className="text-[12px] text-[#155DFC] block">Phiên bản mới</span>
                <span className="text-[13px] font-medium text-[#020817]">{versionA}</span>
              </div>
            </div>
          </div>

          {/* Side by side diff container */}
          <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden text-[13px]">

            {/* Split Titles Header */}
            <div className="grid grid-cols-2 bg-[#F8FAFC] border-b border-[#E2E8F0] text-[14px] font-medium text-[#020817]">
              <div className="px-6 py-3 border-r border-[#E2E8F0] flex items-center justify-between gap-2">
                <span>PHIÊN BẢN CŨ ({versionB})</span>
                <Badge label="Trước cập nhật" variant="slate" />
              </div>
              <div className="px-6 py-3 flex items-center justify-between gap-2">
                <span>PHIÊN BẢN MỚI ({versionA})</span>
                <Badge label="Sau cập nhật" variant="blue" />
              </div>
            </div>

            {/* Sub headers */}
            <div className="grid grid-cols-2 bg-[#F8FAFC] border-b border-[#E2E8F0] text-black text-[13px] font-bold leading-4">
              {/* Old Side Header */}
              <div className="flex border-r border-[#E2E8F0] py-[13px]">
                <div className="w-1/2 px-6">Trường thuộc tính</div>
                <div className="w-1/2 px-4">Kiểu dữ liệu</div>
              </div>
              {/* New Side Header */}
              <div className="flex py-[13px]">
                <div className="w-1/2 px-6">Trường thuộc tính</div>
                <div className="w-1/2 px-4">Kiểu dữ liệu</div>
              </div>
            </div>

            {/* Split Comparison Rows */}
            <div>
              {diffProperties.map((prop, idx) => {
                const isAdded = prop.status === 'added';
                const isDeleted = prop.status === 'deleted';
                const isModified = prop.status === 'modified';

                return (
                  <div key={idx} className="grid grid-cols-2 border-b border-[#E0E0E0] last:border-b-0 text-black">

                    {/* Old version column */}
                    <div className={`flex items-center min-h-12 border-r border-[#E2E8F0] py-1 ${
                      isDeleted ? 'bg-[#FEF2F2]' : (isModified ? 'bg-[#FFF7ED]' : '')
                    }`}>
                      {isAdded ? (
                        <div className="w-full px-6 text-center text-[#64748B] italic">
                          (Không tồn tại ở phiên bản cũ {versionB})
                        </div>
                      ) : (
                        <>
                          <div className="w-1/2 px-6 break-all">
                            <span className={isDeleted ? 'line-through' : ''}>
                              {prop.name}
                            </span>
                          </div>
                          <div className="w-1/2 px-4 break-words">
                            {prop.typeB}
                          </div>
                        </>
                      )}
                    </div>

                    {/* New version column */}
                    <div className={`flex items-center min-h-12 py-1 ${
                      isAdded ? 'bg-[#F0FDF4]' : (isModified ? 'bg-[#FFF7ED]' : '')
                    }`}>
                      {isDeleted ? (
                        <div className="w-full px-6 text-center text-[#64748B] italic">
                          (Đã lược bỏ ở phiên bản mới {versionA})
                        </div>
                      ) : (
                        <>
                          <div className="w-1/2 px-6 break-all">
                            {prop.name}
                          </div>
                          <div className="w-1/2 px-4 break-words">
                            {prop.typeA}
                          </div>
                        </>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] flex justify-end gap-3 bg-[#F8FAFC]">
          <button
            type="button"
            onClick={onClose}
            className={BTN_OUTLINE}
          >
            Đóng so sánh
          </button>
        </div>

      </div>
    </div>
    , document.body
  );
}
