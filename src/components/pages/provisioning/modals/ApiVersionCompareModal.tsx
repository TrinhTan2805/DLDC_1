import React from 'react';
import { X, GitCompare, PlusCircle, MinusCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ApiVersionCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiName: string;
  verA: string;
  verB: string;
}

export function ApiVersionCompareModal({ isOpen, onClose, apiName, verA, verB }: ApiVersionCompareModalProps) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-bold text-slate-800">
              So sánh phiên bản API
            </h2>
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Info Summary row */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Tên dịch vụ</span>
              <span className="text-sm font-extrabold text-slate-800 block mt-0.5">{apiName}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center px-4 py-1.5 bg-slate-200/60 rounded-lg border border-slate-300">
                <span className="text-xs text-slate-500 font-medium block">Phiên bản cũ</span>
                <span className="text-sm font-bold text-slate-700 font-mono">{verB}</span>
              </div>
              <div className="text-slate-400 font-mono">→</div>
              <div className="text-center px-4 py-1.5 bg-amber-100 rounded-lg border border-amber-300">
                <span className="text-xs text-amber-600 font-bold block">Phiên bản mới</span>
                <span className="text-sm font-extrabold text-amber-700 font-mono">{verA}</span>
              </div>
            </div>
          </div>

          {/* Diff Grid Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs border-b border-slate-200 uppercase tracking-wider">
                  {/* Vùng Phiên bản cũ */}
                  <th className="py-3 px-4 font-bold">Thuộc tính</th>
                  <th className="py-3 px-4 font-bold">Cấu trúc cũ ({verB})</th>
                  <th className="py-3 px-4 font-bold">Cấu trúc mới ({verA})</th>
                  
                  {/* Vùng Phiên bản mới (Có vạch chia) */}
                  <th className="py-3 px-4 font-bold border-l-2 border-slate-200 bg-slate-100/50">Thay đổi</th>
                  <th className="py-3 px-4 font-bold bg-slate-100/50">Mô tả chi tiết</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {diffProperties.map((prop, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {prop.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-xs">
                      {prop.status === 'added' ? (
                        <span className="text-slate-400 italic">Không có</span>
                      ) : (
                        prop.typeB
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-mono text-xs">
                      {prop.status === 'deleted' ? (
                        <span className="text-red-500/70 line-through">Không có</span>
                      ) : (
                        prop.typeA
                      )}
                    </td>
                    <td className="py-3.5 px-4 border-l-2 border-slate-200 bg-slate-50/50">
                      {prop.status === 'unchanged' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                          Giữ nguyên
                        </span>
                      )}
                      {prop.status === 'added' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-50 text-green-700 text-xs font-bold border border-green-200">
                          <PlusCircle className="w-3.5 h-3.5 text-green-500" />
                          Thêm mới
                        </span>
                      )}
                      {prop.status === 'deleted' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                          <MinusCircle className="w-3.5 h-3.5 text-rose-500" />
                          Lược bỏ
                        </span>
                      )}
                      {prop.status === 'modified' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                          Sửa đổi kiểu
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs leading-relaxed max-w-xs bg-slate-50/50">
                      {prop.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-lg transition-colors shadow-sm"
          >
            Đã hiểu
          </button>
        </div>

      </div>
    </div>
  );
}
