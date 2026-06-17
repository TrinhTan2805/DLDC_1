import React from 'react';
import { createPortal } from 'react-dom';
import { X, GitCompare, PlusCircle, MinusCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

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
    <div style={{ zIndex: 999999 }} className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200 api-version-compare-modal-root">
      <style dangerouslySetInnerHTML={{__html: `
        .api-version-compare-modal-root *:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(svg):not(path):not(circle):not(rect):not(polyline):not(line) {
          font-size: 13px !important;
        }
      `}} />
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-black">
                So sánh cấu trúc phiên bản API
              </h2>
              <p className="text-xs text-black font-medium mt-0.5">Dịch vụ: {apiName}</p>
            </div>
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

        {/* Modal content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          
          {/* Info Summary row */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div>
              <span className="text-xs font-bold text-black uppercase tracking-wider block">API được so sánh</span>
              <span className="text-sm font-bold text-black block mt-1">{apiName}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center px-4 py-1.5 bg-slate-100 rounded-lg border border-slate-200">
                <span className="text-xs text-black font-medium block">Phiên bản cũ</span>
                <span className="text-sm font-bold text-black font-mono">{versionB}</span>
              </div>
              <div className="text-slate-400 font-mono text-xs text-black">→</div>
              <div className="text-center px-4 py-1.5 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-xs text-black font-bold block">Phiên bản mới</span>
                <span className="text-sm font-extrabold text-black font-mono">{versionA}</span>
              </div>
            </div>
          </div>

          {/* Side by side diff container */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            
            {/* Split Titles Header */}
            <div className="grid grid-cols-2 bg-slate-100/80 border-b border-slate-200 font-bold text-black">
              <div className="px-6 py-3 border-r border-slate-200 flex items-center justify-between">
                <span>PHIÊN BẢN CŨ ({versionB})</span>
                <span className="text-xs font-medium text-black bg-slate-200/60 px-2 py-0.5 rounded">Trước cập nhật</span>
              </div>
              <div className="px-6 py-3 flex items-center justify-between">
                <span>PHIÊN BẢN MỚI ({versionA})</span>
                <span className="text-xs font-bold text-black bg-blue-50 px-2 py-0.5 rounded border border-blue-100">Sau cập nhật</span>
              </div>
            </div>

            {/* Sub headers */}
            <div className="grid grid-cols-2 bg-slate-50/50 border-b border-slate-200 text-black text-xs font-bold uppercase tracking-wider">
              {/* Old Side Header */}
              <div className="flex border-r border-slate-200 py-2.5">
                <div className="w-1/2 px-6">Trường thuộc tính</div>
                <div className="w-1/2 px-4">Kiểu dữ liệu</div>
              </div>
              {/* New Side Header */}
              <div className="flex py-2.5">
                <div className="w-1/2 px-6">Trường thuộc tính</div>
                <div className="w-1/2 px-4">Kiểu dữ liệu</div>
              </div>
            </div>

            {/* Split Comparison Rows */}
            <div className="divide-y divide-slate-100">
              {diffProperties.map((prop, idx) => {
                const isAdded = prop.status === 'added';
                const isDeleted = prop.status === 'deleted';
                const isModified = prop.status === 'modified';

                return (
                  <div key={idx} className="grid grid-cols-2 hover:bg-slate-50/30 transition-colors">
                    
                    {/* Old version column */}
                    <div className={`flex items-center border-r border-slate-200 py-3 ${
                      isDeleted ? 'bg-red-50/20' : (isModified ? 'bg-amber-50/10' : '')
                    }`}>
                      {isAdded ? (
                        <div className="w-full px-6 py-3.5 text-center text-black italic font-medium">
                          (Không tồn tại ở phiên bản cũ {versionB})
                        </div>
                      ) : (
                        <>
                          <div className="w-1/2 px-6">
                            <span className={`font-mono font-bold ${isDeleted ? 'text-black line-through' : 'text-black'}`}>
                              {prop.name}
                            </span>
                          </div>
                          <div className="w-1/2 px-4 font-mono text-xs text-black">
                            {prop.typeB}
                          </div>
                        </>
                      )}
                    </div>

                    {/* New version column */}
                    <div className={`flex items-center py-3 ${
                      isAdded ? 'bg-emerald-50/20' : (isModified ? 'bg-amber-50/15' : '')
                    }`}>
                      {isDeleted ? (
                        <div className="w-full px-6 py-3.5 text-center text-black italic font-medium">
                          (Đã lược bỏ ở phiên bản mới {versionA})
                        </div>
                      ) : (
                        <>
                          <div className="w-1/2 px-6 font-mono font-bold">
                            <span className="font-mono font-bold text-black">
                              {prop.name}
                            </span>
                          </div>
                          <div className="w-1/2 px-4 font-mono text-xs text-black">
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
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-[13px] rounded-lg transition-colors shadow-sm"
          >
            Đóng so sánh
          </button>
        </div>

      </div>
    </div>
    , document.body
  );
}
