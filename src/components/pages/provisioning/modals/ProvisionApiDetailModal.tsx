import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Clock, Shield, CheckCircle, Calendar, User, Plug, Activity, Database, Lock, AlertTriangle, Layers, Info, FileText } from 'lucide-react';
import { Badge, tabClass, BTN_PRIMARY, BTN_OUTLINE, BTN_DESTRUCTIVE, BTN_GHOST_ICON, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE } from '../../collection/collectionUi';

const TH_CLS = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px] text-left';
const TD_CLS = 'px-3 py-1 text-[13px] text-black text-left';
const TR_CLS = 'h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors';
const DETAIL_ROW_CLS = 'grid grid-cols-1 md:grid-cols-4 px-4 py-3 gap-2 items-start bg-white';
const DETAIL_LABEL_CLS = `${FIELD_LABEL} flex items-center gap-2`;

const API_FIELDS = [
  { field: 'id', source: 'ho_tich_ca_nhan.id', type: 'string', masked: false, desc: 'Mã định danh hệ thống' },
  { field: 'ho_ten', source: 'ho_tich_ca_nhan.ho_ten', type: 'string', masked: false, desc: 'Họ và tên công dân' },
  { field: 'ngay_sinh', source: 'ho_tich_ca_nhan.ngay_sinh', type: 'datetime', masked: false, desc: 'Ngày tháng năm sinh' },
  { field: 'gioi_tinh', source: 'ho_tich_ca_nhan.gioi_tinh', type: 'string', masked: false, desc: 'Giới tính' },
  { field: 'so_dinh_danh', source: 'ho_tich_ca_nhan.so_dinh_danh', type: 'string', masked: true, desc: 'Số định danh cá nhân (CCCD)' },
];

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh]">
        {/* Header (mục 5.4) */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-[#E2E8F0] shrink-0">
          <div className="min-w-0">
            <h2 className="text-[16px] font-medium text-[#020817]">
              {service.name.startsWith('API') ? service.name : `API cung cấp dữ liệu ${service.name.replace('DV_', '')}`}
            </h2>
            <div className="flex items-center gap-2 text-[13px] text-[#64748B]">
              <span>{service.code}</span>
              <span>•</span>
              <span>{service.type}</span>
            </div>
          </div>
          <button type="button" onClick={onClose} className={BTN_GHOST_ICON} title="Đóng" aria-label="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab row (mục 5.9) */}
        <div className="border-b border-[#E2E8F0] px-6 shrink-0">
          <nav className="flex overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`${tabClass(activeTab === tab.id)} whitespace-nowrap`}>
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content area */}
        <div className="px-6 py-4 overflow-y-auto custom-scrollbar flex-1 bg-white">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Status & Banner Info */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-3 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge label="Chờ phê duyệt" variant="amber" icon={<Clock className="w-4 h-4" />} />
                  <Badge label="Bảo mật" variant="orange" icon={<Shield className="w-4 h-4" />} />
                  <Badge label="Đã thẩm định KT" variant="emerald" icon={<CheckCircle className="w-4 h-4" />} />
                </div>
                <div className="text-[13px] text-[#64748B]">
                  Cập nhật: {formatDateTime(service.date)}
                </div>
              </div>

              {/* Detail list items */}
              <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden divide-y divide-[#E2E8F0]">
                <div className={DETAIL_ROW_CLS}>
                  <div className={DETAIL_LABEL_CLS}>
                    <FileText className="w-4 h-4 text-[#64748B]" />
                    Mô tả:
                  </div>
                  <div className={`md:col-span-3 ${FIELD_VALUE} leading-relaxed`}>
                    Cung cấp thông tin hộ tịch điện tử cho các đơn vị xử lý nghiệp vụ trong ngành tư pháp và liên ngành.
                  </div>
                </div>

                <div className={DETAIL_ROW_CLS}>
                  <div className={DETAIL_LABEL_CLS}>
                    <User className="w-4 h-4 text-[#64748B]" />
                    Người thiết lập:
                  </div>
                  <div className={`md:col-span-3 ${FIELD_VALUE}`}>Nguyễn Văn An</div>
                </div>

                <div className={DETAIL_ROW_CLS}>
                  <div className={DETAIL_LABEL_CLS}>
                    <Calendar className="w-4 h-4 text-[#64748B]" />
                    Ngày tạo:
                  </div>
                  <div className={`md:col-span-3 ${FIELD_VALUE}`}>28/05/2026 08:30:00</div>
                </div>

                <div className={DETAIL_ROW_CLS}>
                  <div className={DETAIL_LABEL_CLS}>
                    <Plug className="w-4 h-4 text-[#64748B]" />
                    Giao thức:
                  </div>
                  <div className="md:col-span-3">
                    <Badge label={service.protocol || 'REST API'} variant="blue" />
                  </div>
                </div>

                <div className={DETAIL_ROW_CLS}>
                  <div className={DETAIL_LABEL_CLS}>
                    <Activity className="w-4 h-4 text-[#64748B]" />
                    Tần suất:
                  </div>
                  <div className={`md:col-span-3 ${FIELD_VALUE}`}>Thời gian thực (Realtime)</div>
                </div>
              </div>

              {/* Warning/Regulation box */}
              <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-lg p-3 flex gap-2">
                <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                <div className="text-[13px] text-[#020817] leading-relaxed">
                  <p className="font-medium mb-1">Quy tắc chia sẻ thông tin cá nhân</p>
                  Dịch vụ đang cấu hình mở các trường thông tin nhạy cảm. Yêu cầu bắt buộc áp dụng cấu hình mặt nạ (masking) đối với các trường thông tin nhận dạng như Số định danh cá nhân (CCCD/CMND) theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-3">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <span className="text-[14px] font-medium text-[#020817] flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  Gói tin phản hồi mẫu (API Fields)
                </span>
                <Badge label="Bảng chính: ho_tich_ca_nhan" variant="blue" />
              </div>
              <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse collection-table text-[13px]">
                    <thead className="bg-[#F8FAFC]">
                      <tr className="h-[42px]">
                        <th className={TH_CLS}>Tên Trường (API field)</th>
                        <th className={TH_CLS}>Bảng & Cột Nguồn</th>
                        <th className={TH_CLS}>Kiểu Dữ Liệu</th>
                        <th className={TH_CLS}>Bảo mật / Che dấu</th>
                        <th className={TH_CLS}>Mô tả</th>
                      </tr>
                    </thead>
                    <tbody>
                      {API_FIELDS.map(f => (
                        <tr key={f.field} className={TR_CLS}>
                          <td className={TD_CLS}>{f.field}</td>
                          <td className={TD_CLS}>{f.source}</td>
                          <td className={TD_CLS}>{f.type}</td>
                          <td className={TD_CLS}>
                            {f.masked ? <Badge label="Masked (hide_middle)" variant="amber" /> : '—'}
                          </td>
                          <td className={TD_CLS}>{f.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'legal' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#E2E8F0] p-4">
                <h4 className={SECTION_TITLE}>Căn cứ pháp lý chia sẻ</h4>
                <ul className="list-disc list-inside space-y-1.5 text-[13px] text-[#020817] leading-relaxed">
                  <li>Nghị định 47/2020/NĐ-CP về quản lý, kết nối và chia sẻ dữ liệu số của cơ quan nhà nước.</li>
                  <li>Quyết định số 2026/QĐ-BTP của Bộ trưởng Bộ Tư pháp về việc Ban hành Danh mục chia sẻ dữ liệu dùng chung.</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-[#E2E8F0] p-4">
                <h4 className={SECTION_TITLE}>Đối tượng được cấp quyền truy cập khai thác</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge label="Cục Hộ tịch, quốc tịch, chứng thực" variant="blue" />
                  <Badge label="Sở Tư pháp các tỉnh thành" variant="blue" />
                  <Badge label="Văn phòng Bộ Tư pháp" variant="blue" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-[#E2E8F0] rounded-2xl">
                <h4 className={SECTION_TITLE}>Giới hạn Tần suất (Rate Limiting)</h4>
                <div className="text-[16px] font-semibold text-[#0F172A] tabular-nums">
                  1,200 <span className="text-[13px] font-normal text-[#64748B]">Yêu cầu / Phút</span>
                </div>
                <p className="text-[13px] text-[#64748B] mt-1">Giới hạn tối đa trên mỗi Token / API key khi truy cập hệ thống.</p>
              </div>

              <div className="p-4 border border-[#E2E8F0] rounded-2xl">
                <h4 className={SECTION_TITLE}>Chính sách bảo mật (Security Policy)</h4>
                <ul className="text-[13px] space-y-1 text-[#020817]">
                  <li>• Yêu cầu xác thực OAuth2 / Bearer Token.</li>
                  <li>• Chỉ chấp nhận kết nối từ dải IP đã cấu hình.</li>
                  <li>• Mã hóa dữ liệu truyền tải SSL/TLS 1.3.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="relative border-l-2 border-[#E2E8F0] pl-4 ml-2 space-y-6 py-2 text-[13px]">
              <div className="relative">
                <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-blue-600 ring-4 ring-[#EAF3FF]"></span>
                <p className="font-medium text-[#020817]">29/05/2026 10:15 - Nguyễn Văn An</p>
                <p className="text-[#64748B] mt-1">Cập nhật: Bổ sung cấu hình che giấu thông tin trường số_dinh_danh.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-[#CBD5E1] ring-4 ring-[#F1F5F9]"></span>
                <p className="font-medium text-[#020817]">28/05/2026 08:30 - Nguyễn Văn An</p>
                <p className="text-[#64748B] mt-1">Tạo mới: Thiết lập các thông số cơ bản cho API và chọn bảng dữ liệu gốc.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end items-center gap-3 shrink-0">
          <button type="button" onClick={onClose} className={BTN_OUTLINE}>
            Đóng
          </button>
          {/* Show approve / reject buttons only if the status is pending */}
          {service.status === 'pending' && (
            <>
              <button
                type="button"
                onClick={() => {
                  if (onReject) onReject(service);
                  onClose();
                }}
                className={BTN_DESTRUCTIVE}
              >
                <X className="w-4 h-4" />
                Từ chối
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onApprove) onApprove(service);
                  onClose();
                }}
                className={BTN_PRIMARY}
              >
                <CheckCircle className="w-4 h-4" />
                Phê duyệt
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  , document.body);
}
