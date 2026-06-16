import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Clock, Shield, CheckCircle, Calendar, User, Plug, Activity, Database, Lock, AlertTriangle, Layers, Info, List, Server, FileText } from 'lucide-react';

interface ProvisionApiDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: any;
  onApprove?: (service: any) => void;
  onReject?: (service: any) => void;
}

export function ProvisionApiDetailModal({ isOpen, onClose, service, onApprove, onReject }: ProvisionApiDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'data' | 'legal' | 'security' | 'history'>('overview');

  if (!isOpen || !service) return null;

  // Tabs structure
  const tabs = [
    { id: 'overview' as const, label: 'Tổng quan', icon: <Info className="w-4 h-4" /> },
    { id: 'data' as const, label: 'Dữ liệu cung cấp', icon: <Database className="w-4 h-4" /> },
    { id: 'legal' as const, label: 'Đối tượng & Pháp lý', icon: <Layers className="w-4 h-4" /> },
    { id: 'security' as const, label: 'Bảo mật & Giới hạn', icon: <Lock className="w-4 h-4" /> },
    { id: 'history' as const, label: 'Lịch sử', icon: <Clock className="w-4 h-4" /> },
  ];

  // Helper formatting function
  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return '28/05/2026';
    if (/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/.test(dateStr)) return dateStr;
    const parts = dateStr.split(' ');
    if (parts.length === 2) {
      const [d, t] = parts;
      const dParts = d.split('-');
      if (dParts.length === 3) return `${dParts[2]}/${dParts[1]}/${dParts[0]} ${t}`;
    }
    return dateStr;
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0 bg-white">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shadow-sm shrink-0">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight leading-tight">
                {service.name.startsWith('API') ? service.name : `API cung cấp dữ liệu ${service.name.replace('DV_', '')}`}
              </h2>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                <span className="font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">{service.code}</span>
                <span className="text-slate-300">•</span>
                <span className="font-semibold text-slate-500">{service.type}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all duration-200 cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab row */}
        <div className="border-b border-slate-200 bg-slate-50/50 px-6 flex-shrink-0">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-3.5 px-1 border-b-2 font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content area */}
        <div className="p-6 overflow-y-auto flex-1 bg-white space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Status & Banner Info */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Badge Chờ phê duyệt */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-100 shadow-sm">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    Chờ phê duyệt
                  </span>
                  {/* Badge Bảo mật */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-800 rounded-full text-xs font-bold border border-yellow-200 shadow-sm">
                    <Shield className="w-3.5 h-3.5 text-yellow-600" />
                    Bảo mật
                  </span>
                  {/* Badge Đã thẩm định KT */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-100 shadow-sm">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Đã thẩm định KT
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-400">
                  Cập nhật: {formatDateTime(service.date)}
                </div>
              </div>

              {/* Detail list items */}
              <div className="border border-slate-100 rounded-xl divide-y divide-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-4 p-4 gap-2 items-start bg-white">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    Mô tả:
                  </div>
                  <div className="md:col-span-3 text-sm text-slate-700 leading-relaxed font-semibold">
                    Cung cấp thông tin hộ tịch điện tử cho các đơn vị xử lý nghiệp vụ trong ngành tư pháp và liên ngành.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 p-4 gap-2 items-center bg-white">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    Người thiết lập:
                  </div>
                  <div className="md:col-span-3 text-sm text-slate-800 font-bold">
                    Nguyễn Văn An
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 p-4 gap-2 items-center bg-white">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    Ngày tạo:
                  </div>
                  <div className="md:col-span-3 text-sm text-slate-700 font-mono font-bold">
                    28/05/2026 08:30:00
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 p-4 gap-2 items-center bg-white">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Plug className="w-4 h-4 text-slate-400" />
                    Giao thức:
                  </div>
                  <div className="md:col-span-3 text-sm font-mono text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded w-max">
                    {service.protocol || 'REST API'}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 p-4 gap-2 items-center bg-white">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-slate-400" />
                    Tần suất:
                  </div>
                  <div className="md:col-span-3 text-sm text-slate-700 font-bold">
                    Thời gian thực (Realtime)
                  </div>
                </div>
              </div>

              {/* Warning/Regulation box */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex gap-3.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800 leading-relaxed font-semibold">
                  <p className="font-bold text-amber-900 mb-1 uppercase tracking-wide">Quy tắc chia sẻ thông tin cá nhân</p>
                  Dịch vụ đang cấu hình mở các trường thông tin nhạy cảm. Yêu cầu bắt buộc áp dụng cấu hình mặt nạ (masking) đối với các trường thông tin nhận dạng như Số định danh cá nhân (CCCD/CMND) theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-600" />
                    Gói tin phản hồi mẫu (API Fields)
                  </span>
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded uppercase">
                    Bảng chính: ho_tich_ca_nhan
                  </span>
                </div>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                      <th className="py-2.5 px-4">Tên Trường (API field)</th>
                      <th className="py-2.5 px-4 font-mono">Bảng & Cột Nguồn</th>
                      <th className="py-2.5 px-4">Kiểu Dữ Liệu</th>
                      <th className="py-2.5 px-4 text-center">Bảo mật / Che dấu</th>
                      <th className="py-2.5 px-4">Mô tả</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-bold text-slate-800">id</td>
                      <td className="py-2.5 px-4 font-mono text-slate-500">ho_tich_ca_nhan.id</td>
                      <td className="py-2.5 px-4 uppercase text-slate-500">string</td>
                      <td className="py-2.5 px-4 text-center">—</td>
                      <td className="py-2.5 px-4 text-slate-500">Mã định danh hệ thống</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-bold text-slate-800">ho_ten</td>
                      <td className="py-2.5 px-4 font-mono text-slate-500">ho_tich_ca_nhan.ho_ten</td>
                      <td className="py-2.5 px-4 uppercase text-slate-500">string</td>
                      <td className="py-2.5 px-4 text-center">—</td>
                      <td className="py-2.5 px-4 text-slate-500">Họ và tên công dân</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-bold text-slate-800">ngay_sinh</td>
                      <td className="py-2.5 px-4 font-mono text-slate-500">ho_tich_ca_nhan.ngay_sinh</td>
                      <td className="py-2.5 px-4 uppercase text-slate-500">datetime</td>
                      <td className="py-2.5 px-4 text-center">—</td>
                      <td className="py-2.5 px-4 text-slate-500">Ngày tháng năm sinh</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-bold text-slate-800">gioi_tinh</td>
                      <td className="py-2.5 px-4 font-mono text-slate-500">ho_tich_ca_nhan.gioi_tinh</td>
                      <td className="py-2.5 px-4 uppercase text-slate-500">string</td>
                      <td className="py-2.5 px-4 text-center">—</td>
                      <td className="py-2.5 px-4 text-slate-500">Giới tính</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-bold text-slate-800">so_dinh_danh</td>
                      <td className="py-2.5 px-4 font-mono text-slate-500">ho_tich_ca_nhan.so_dinh_danh</td>
                      <td className="py-2.5 px-4 uppercase text-slate-500">string</td>
                      <td className="py-2.5 px-4 text-center">
                        <span className="px-2 py-0.5 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded font-bold text-[10px]">
                          Masked (hide_middle)
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-500">Số định danh cá nhân (CCCD)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'legal' && (
            <div className="space-y-4 animate-in fade-in duration-200 text-sm">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Căn cứ pháp lý chia sẻ</h4>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 font-medium leading-relaxed">
                  <li>Nghị định 47/2020/NĐ-CP về quản lý, kết nối và chia sẻ dữ liệu số của cơ quan nhà nước.</li>
                  <li>Quyết định số 2026/QĐ-BTP của Bộ trưởng Bộ Tư pháp về việc Ban hành Danh mục chia sẻ dữ liệu dùng chung.</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Đối tượng được cấp quyền truy cập khai thác</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100">
                    Cục Hộ tịch, quốc tịch, chứng thực
                  </span>
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100">
                    Sở Tư pháp các tỉnh thành
                  </span>
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100">
                    Văn phòng Bộ Tư pháp
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-slate-200 rounded-xl space-y-2">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Giới hạn Tần suất (Rate Limiting)</h4>
                  <div className="text-xl font-black text-slate-800">
                    1,200 <span className="text-xs font-bold text-slate-400">Yêu cầu / Phút</span>
                  </div>
                  <p className="text-xs text-slate-500">Giới hạn tối đa trên mỗi Token / API key khi truy cập hệ thống.</p>
                </div>

                <div className="p-4 border border-slate-200 rounded-xl space-y-2">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Chính sách bảo mật (Security Policy)</h4>
                  <ul className="text-xs space-y-1 text-slate-600 font-medium">
                    <li>• Yêu cầu xác thực OAuth2 / Bearer Token.</li>
                    <li>• Chỉ chấp nhận kết nối từ dải IP đã cấu hình.</li>
                    <li>• Mã hóa dữ liệu truyền tải SSL/TLS 1.3.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="relative border-l-2 border-slate-200 pl-4 ml-2 space-y-6 py-2 text-xs">
                <div className="relative">
                  <span className="absolute -left-[21px] top-0 w-2 h-2 rounded-full bg-blue-600 ring-4 ring-blue-100"></span>
                  <p className="font-bold text-slate-800">29/05/2026 10:15 - Nguyễn Văn An</p>
                  <p className="text-slate-500 mt-1">Cập nhật: Bổ sung cấu hình che giấu thông tin trường số_dinh_danh.</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[21px] top-0 w-2 h-2 rounded-full bg-slate-300 ring-4 ring-slate-100"></span>
                  <p className="font-bold text-slate-800">28/05/2026 08:30 - Nguyễn Văn An</p>
                  <p className="text-slate-500 mt-1">Tạo mới: Thiết lập các thông số cơ bản cho API và chọn bảng dữ liệu gốc.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
          <div className="flex gap-2">
            {/* Show approve / reject buttons only if the status is pending */}
            {service.status === 'pending' && (
              <>
                <button
                  onClick={() => {
                    if (onReject) onReject(service);
                    onClose();
                  }}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  Từ chối
                </button>
                <button
                  onClick={() => {
                    if (onApprove) onApprove(service);
                    onClose();
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md shadow-emerald-100 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  Phê duyệt
                </button>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs uppercase tracking-widest rounded-lg shadow-md transition-all cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  , document.body);
}
