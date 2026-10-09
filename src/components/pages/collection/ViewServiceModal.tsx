import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X, CheckCircle, Search, Calendar, Eye, Activity, Shield, FileText, Download,
  ArrowRight, ExternalLink, RefreshCw, ChevronDown, ChevronRight, User, Plug, Settings, Database, Clock,
  LayoutTemplate, Check, AlertCircle, AlertTriangle, EyeOff,
  Trash2, History, Zap, PlusCircle, Plus, Edit, Code, Layers, List, Eraser, Upload, Power, Key, Copy, Info
} from 'lucide-react';
import { initialSourceSystems } from './mockSourceSystems';
import { Portal } from '../../common/Portal';
import { toast } from 'sonner';
import { Badge, BTN_PRIMARY, BTN_OUTLINE, BTN_DESTRUCTIVE, BTN_PAGE, BTN_PAGE_IDLE, BTN_GHOST_ICON, tabClass, INPUT_CLS, SECTION_TITLE, CARD_CLS, FIELD_LABEL, FIELD_VALUE, LABEL_CLS, REQUIRED_MARK, Pagination, resolveConnectionType, GROUP_TITLE } from './collectionUi';

// Định dạng dung lượng dữ liệu suy ra từ số bản ghi (dùng khi dịch vụ chưa có sẵn dataSize)
const formatDataSize = (records: number) => {
  const bytes = (records || 0) * 1150; // ~1.15 KB/bản ghi
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
  if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(0)} KB`;
  return `${bytes} B`;
};

// Nhãn trạng thái dùng chung với danh sách (CollectionSetupPage chuẩn hóa serviceStatus / dataStatus)
const getServiceStatusLabel = (service: any) => {
  const st = service.serviceStatus || (service.status === 'draft' ? 'draft' : service.status === 'inactive' ? 'inactive' : 'active');
  return st === 'draft' ? 'Bản nháp' : st === 'inactive' ? 'Ngưng hoạt động' : 'Hoạt động';
};
const getDataStatusLabel = (service: any) => {
  const ds = service.dataStatus || (service.status === 'success' ? 'DATA_UPDATED' : service.status?.startsWith('failed') ? 'DATA_UPDATE_FAILED' : 'EMPTY');
  return ds === 'EMPTY' ? 'Rỗng' : ds === 'PROCESSING' ? 'Đang xử lý' : ds === 'DATA_UPDATED' ? 'Cập nhật thành công' : 'Lỗi cập nhật';
};

interface ViewServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: any;
  onViewData?: (pageId?: string) => void;
  initialTab?: TabType;
}

type TabType = 'general' | 'contact' | 'connection' | 'collection' | 'mapping' | 'history';

export function ViewServiceModal({ isOpen, onClose, service, initialTab }: ViewServiceModalProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>(initialTab || 'general');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [inactiveReason, setInactiveReason] = useState('');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab || 'general');
    }
  }, [isOpen, initialTab, service]);

  const handleEdit = () => {
    navigate(`/collection-setup/edit/${service.id}?tab=${activeTab}`);
  };

  if (!isOpen || !service) return null;

  // Find source system details
  const sourceSystem = initialSourceSystems.find(ss => ss.systemName === service.system) || initialSourceSystems[0];

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
        {/* Kích thước cố định 1024 × 800px (thu nhỏ theo màn hình nếu không đủ chỗ); header + tab đứng yên, chỉ nội dung tab cuộn */}
        <div className="bg-white rounded-2xl shadow-2xl w-[1024px] max-w-full h-[800px] max-h-full flex flex-col overflow-hidden relative z-0">

          {/* HEADER */}
          <div className="px-6 py-4 bg-white border-b border-[#E2E8F0] shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[12px] font-normal text-[#020817]">
                <span>Danh sách dịch vụ</span>
                <ChevronRight className="w-3 h-3" />
                <span>Chi tiết dịch vụ</span>
              </div>
              <button onClick={onClose} aria-label="Đóng" title="Đóng" className={BTN_GHOST_ICON}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-[16px] font-semibold text-[#020817] mb-3 leading-tight">
                  {service.name || 'Dịch vụ chưa đặt tên'}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#64748B]">
                  <Badge label={getServiceStatusLabel(service)} />
                  <span className="text-[#CBD5E1]">|</span>
                  <span className="text-[#020817]">{service.managingUnit || sourceSystem.unitName}</span>
                  <span className="text-[#CBD5E1]">|</span>
                  <Badge label={service.version || 'v1.0.0'} variant="blue" />
                  <span className="text-[#CBD5E1]">|</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Cập nhật: {service.updatedAt || 'N/A'}
                  </span>
                </div>
              </div>


            </div>
          </div>

          {/* TABS HEADER */}
          <div className="flex border-b border-[#E2E8F0] px-6 bg-white shrink-0">
            {[
              { id: 'general', label: 'Thông tin chung', icon: FileText },
              { id: 'connection', label: 'Cấu hình kết nối', icon: Plug },
              { id: 'mapping', label: 'Cấu trúc', icon: LayoutTemplate },
              { id: 'collection', label: 'Cấu hình thu thập', icon: Settings },
              { id: 'history', label: 'Lịch sử hoạt động', icon: History },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={tabClass(activeTab === tab.id)}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* TABS CONTENT */}
          <div className="px-6 py-6 flex-1 min-h-0 bg-[#F8FAFC] overflow-y-auto custom-scrollbar">
            {activeTab === 'general' && <TabGeneral service={service} sourceSystem={sourceSystem} onEdit={handleEdit} />}
            {activeTab === 'connection' && <TabConnection service={service} showApiKey={showApiKey} setShowApiKey={setShowApiKey} onEdit={handleEdit} />}
            {activeTab === 'collection' && <TabCollection service={service} onEdit={handleEdit} />}
            {activeTab === 'mapping' && <TabMapping onEdit={handleEdit} />}
            {activeTab === 'history' && <TabActivityHistory onEdit={handleEdit} />}
          </div>

          {/* FOOTER cố định: nút thao tác theo tab (tab Lịch sử hoạt động không có thao tác) */}
          {activeTab !== 'history' && (
            <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between gap-3 shrink-0">
              {activeTab === 'mapping' ? (
                <>
                  <button className={BTN_DESTRUCTIVE}>
                    <Trash2 className="w-4 h-4" />
                    Xóa cấu trúc
                  </button>
                  <div className="flex items-center gap-3">
                    <button className={BTN_OUTLINE}>
                      <Download className="w-4 h-4" />
                      Nạp cấu trúc
                    </button>
                    <button onClick={handleEdit} className={BTN_PRIMARY}>
                      <Edit className="w-4 h-4" />
                      Sửa cấu trúc
                    </button>
                  </div>
                </>
              ) : (
                <button onClick={handleEdit} className={`${BTN_PRIMARY} ml-auto`}>
                  <Edit className="w-4 h-4" /> Chỉnh sửa
                </button>
              )}
            </div>
          )}
        </div>

        {/* INACTIVE CONFIRMATION MODAL - RESTORED AND FIXED Z-INDEX CONTEXT */}
        {showInactiveModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
                <h3 className="text-[16px] font-semibold text-[#020817] flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Power className="w-5 h-5 text-amber-600" />
                  </div>
                  Ngừng hoạt động
                </h3>
                <button onClick={() => setShowInactiveModal(false)} aria-label="Đóng" className={BTN_GHOST_ICON}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="bg-[#FEF2F2] border border-[#FEE2E2] p-4 rounded-lg flex gap-3">
                  <div className="p-2 bg-red-100 rounded-full h-fit">
                    <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
                  </div>
                  <div>
                    <div className="text-[14px] font-medium text-[#B91C1C] mb-1">Cảnh báo gián đoạn dữ liệu</div>
                    <p className="text-[13px] text-[#B91C1C] leading-relaxed">
                      Bạn có chắc muốn ngừng hoạt động này? Hành động này sẽ khiến luồng dữ liệu bị gián đoạn cho đến khi được kích hoạt lại thủ công.
                    </p>
                  </div>
                </div>

                <div>
                  <label className={LABEL_CLS}>
                    Lý do ngừng hoạt động <span className={REQUIRED_MARK}>*</span>
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg min-h-[120px] text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-[#94A3B8] resize-none"
                    placeholder="Vui lòng nhập lý do cụ thể (ví dụ: Thay đổi cấu hình Máy chủ thực thi, bảo trì định kỳ hệ thống nguồn...)"
                    value={inactiveReason}
                    onChange={(e) => setInactiveReason(e.target.value)}
                  />
                </div>
              </div>
              <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end gap-3">
                <button
                  onClick={() => setShowInactiveModal(false)}
                  className={BTN_OUTLINE}
                >
                  Hủy bỏ
                </button>
                <button
                  disabled={!inactiveReason.trim()}
                  onClick={() => {
                    toast.success('Đã yêu cầu ngừng hoạt động', { description: `Lý do: ${inactiveReason}` });
                    setShowInactiveModal(false);
                    setInactiveReason('');
                  }}
                  className={BTN_PRIMARY}
                >
                  Xác nhận ngừng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ------ TAB COMPONENTS ------

function TabGeneral({ service, sourceSystem, onEdit }: any) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className={CARD_CLS}>
        <h3 className={SECTION_TITLE}>
          <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
          Thông tin dịch vụ
        </h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">

          <div className="space-y-1">
            <div className={FIELD_LABEL}>Tên dịch vụ</div>
            <div className={`${FIELD_VALUE} break-words`}>{service.name || '-'}</div>
          </div>

          <div className="space-y-1">
            <div className={FIELD_LABEL}>Tên hệ thống nguồn</div>
            <div className={`${FIELD_VALUE} break-words flex items-center gap-2`}>
              <Database className="w-4 h-4 text-blue-500" />
              {service.system || sourceSystem.systemName}
            </div>
          </div>

          <div className="space-y-1">
            <div className={FIELD_LABEL}>Loại nguồn</div>
            <div>
              <Badge 
                label={service.source} 
                variant={service.source === 'Trong ngành' ? 'purple' : 'blue'} 
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className={FIELD_LABEL}>Mức độ bảo mật dữ liệu</div>
            <div>
              <Badge label={service.securityLevel || 'Nội bộ'} variant="blue" />
            </div>
          </div>

          <div className="space-y-1">
            <div className={FIELD_LABEL}>Loại dữ liệu thu thập</div>
            <div className={`${FIELD_VALUE} break-words`}>{service.dataType || '-'}</div>
          </div>

          <div className="space-y-1">
            <div className={FIELD_LABEL}>Trạng thái dữ liệu</div>
            <div>
              {(() => {
                return <Badge label={getDataStatusLabel(service)} />;
              })()}
            </div>
          </div>

          <div className="space-y-1">
            <div className={FIELD_LABEL}>Kích thước dữ liệu</div>
            <div className={`${FIELD_VALUE} break-words flex items-center gap-2`}>
              <span>{service.dataSize || formatDataSize(service.recordsReceived)}</span>
              <span className="text-[#CBD5E1]">|</span>
              <span>{(service.recordCount ?? service.recordsReceived ?? 0).toLocaleString('vi-VN')} bản ghi</span>
            </div>
          </div>

          <div className="space-y-1 col-span-2">
            <div className={FIELD_LABEL}>Mô tả</div>
            <div className={`${FIELD_VALUE} whitespace-pre-line break-words`}>
              {service.description || '-'}
            </div>
          </div>

        </div>
      </div>

      <div className={CARD_CLS}>
        <h3 className={SECTION_TITLE}>
          <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
          Đính kèm văn bản
        </h3>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 border border-slate-200 rounded-xl px-4 py-3 bg-white hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group shadow-sm">
            <div className="p-2 bg-red-50 text-red-500 rounded-lg group-hover:bg-red-100">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[13px] text-slate-800 font-medium">QĐ_Ketno_QuocTich_2025.pdf</div>
              <div className="text-[13px] text-slate-400 font-medium">245 KB • 10/04/2025</div>
            </div>
            <Download className="w-4 h-4 text-slate-400 ml-4 group-hover:text-blue-600" />
          </div>

          <div className="flex items-center gap-3 border border-slate-200 rounded-xl px-4 py-3 bg-white hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group shadow-sm">
            <div className="p-2 bg-blue-50 text-blue-500 rounded-lg group-hover:bg-blue-100">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[13px] text-slate-800 font-medium">BienBan_Nghiemthu_API.docx</div>
              <div className="text-[13px] text-slate-400 font-medium">118 KB • 10/04/2025</div>
            </div>
            <Download className="w-4 h-4 text-slate-400 ml-4 group-hover:text-blue-600" />
          </div>
        </div>
      </div>

      <div className={CARD_CLS}>
        <h3 className={SECTION_TITLE}>
          <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
          Thông tin hệ thống nguồn
        </h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div className="space-y-1">
            <div className={FIELD_LABEL}>Tên hệ thống</div>
            <div className={`${FIELD_VALUE} break-words`}>{sourceSystem.systemName}</div>
          </div>
          <div className="space-y-1">
            <div className={FIELD_LABEL}>Tên đơn vị</div>
            <div className={`${FIELD_VALUE} break-words`}>{sourceSystem.unitName}</div>
          </div>
          <div className="space-y-1">
            <div className={FIELD_LABEL}>Đầu mối liên hệ</div>
            <div className={`${FIELD_VALUE} break-words flex items-center gap-2`}>
              <User className="w-4 h-4 text-slate-400" />
              {sourceSystem.contactPerson}
            </div>
          </div>
          <div className="space-y-1 col-span-2">
            <div className={FIELD_LABEL}>Địa chỉ</div>
            <div className={`${FIELD_VALUE} break-words`}>{sourceSystem.address}</div>
          </div>
          <div className="space-y-1">
            <div className={FIELD_LABEL}>Số điện thoại</div>
            <div className={`${FIELD_VALUE} break-words`}>{sourceSystem.phone}</div>
          </div>
          <div className="space-y-1">
            <div className={FIELD_LABEL}>Email</div>
            <div className="text-[13px] text-blue-600 break-words">{sourceSystem.email}</div>
          </div>
          <div className="space-y-1 col-span-2">
            <div className={FIELD_LABEL}>Ghi chú</div>
            <div className={`${FIELD_VALUE} whitespace-pre-line break-words`}>
              {sourceSystem.note || '-'}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

function TabContact({ sourceSystem }: any) {
  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      <div className={CARD_CLS}>
        <h3 className={SECTION_TITLE}>
          <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
          Thông tin hệ thống nguồn
        </h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-w-5xl">

          <div className="space-y-1">
            <div className={FIELD_LABEL}>Tên hệ thống</div>
            <div className={`${FIELD_VALUE} break-words`}>{sourceSystem.systemName}</div>
          </div>

          <div className="space-y-1">
            <div className={FIELD_LABEL}>Tên đơn vị</div>
            <div className={`${FIELD_VALUE} break-words`}>{sourceSystem.unitName}</div>
          </div>

          <div className="space-y-1">
            <div className={FIELD_LABEL}>Loại nguồn</div>
            <div>
              <Badge 
                label={sourceSystem.sourceType} 
                variant={sourceSystem.sourceType === 'Trong ngành' ? 'purple' : 'blue'} 
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className={FIELD_LABEL}>Đầu mối liên hệ</div>
            <div className={`${FIELD_VALUE} break-words flex items-center gap-2`}>
              <User className="w-4 h-4 text-slate-400" />
              {sourceSystem.contactPerson}
            </div>
          </div>

          <div className="space-y-1 col-span-2">
            <div className={FIELD_LABEL}>Địa chỉ</div>
            <div className={`${FIELD_VALUE} break-words`}>{sourceSystem.address}</div>
          </div>

          <div className="space-y-1">
            <div className={FIELD_LABEL}>Số điện thoại</div>
            <div className={`${FIELD_VALUE} break-words`}>{sourceSystem.phone}</div>
          </div>

          <div className="space-y-1">
            <div className={FIELD_LABEL}>Email</div>
            <div className="text-[13px] text-blue-600 break-words">{sourceSystem.email}</div>
          </div>

          <div className="space-y-1 col-span-2">
            <div className={FIELD_LABEL}>Ghi chú</div>
            <div className={`${FIELD_VALUE} whitespace-pre-line break-words`}>
              {sourceSystem.note || '-'}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ===== Tab Cấu hình kết nối (xem chi tiết) — nội dung theo từng phương thức (PM gửi mẫu 07/10/2026) =====
const CONNECTION_TYPE_LABEL: Record<string, string> = {
  API: 'API',
  API_RECEIVE_JSON: 'API nhận (JSON)',
  API_RECEIVE_XML: 'API nhận (XML)',
  DB: 'Cơ Sở Dữ Liệu',
  FILE: 'File',
};

// Dữ liệu mẫu (mock) cho màn xem
const SAMPLE_JSON = `{
  "totalRecords": 5,
  "data": [
    { "trangThaiDuLieu": { "suKien": "NEW", "phienBan": 1, "thoiGianCapNhat": "2026-10-07T08:00:00" },
      "duLieuTiepNhan": { "maHoSo": "HS001", "hoTen": "Nguyễn Văn An", "ngaySinh": "1985-03-12", "chucVuHienTai": "Chuyên viên", "luong": 12000000, "email": "an.nv@demo.vn",
        "lienHe": { "dienThoai": "0901000001", "diaChi": "Hà Nội" },
        "quaTrinhCongTac": [ { "donVi": "Sở Tư pháp", "chucVu": "Cán bộ", "tuNam": "2010" }, { "donVi": "Sở Tư pháp", "chucVu": "Chuyên viên", "tuNam": "2015" } ] } },
    { "trangThaiDuLieu": { "suKien": "NEW", "phienBan": 1, "thoiGianCapNhat": "2026-10-07T08:00:00" },
      "duLieuTiepNhan": { "maHoSo": "HS002", "hoTen": "Trần Thị Bình", "ngaySinh": "1990-07-01", "chucVuHienTai": "Trưởng phòng", "luong": 18000000, "email": "binh.tt@demo.vn",
        "lienHe": { "dienThoai": "0901000002", "diaChi": "Hải Phòng" },
        "quaTrinhCongTac": [ { "donVi": "UBND Quận 1", "chucVu": "Chuyên viên", "tuNam": "2012" } ] } },
    { "trangThaiDuLieu": { "suKien": "NEW", "phienBan": 1, "thoiGianCapNhat": "2026-10-07T08:00:00" },
      "duLieuTiepNhan": { "maHoSo": "HS003", "hoTen": "Lê Văn Cường", "ngaySinh": "1988-11-20", "chucVuHienTai": "Phó phòng", "luong": 15000000, "email": "cuong.lv@demo.vn",
        "lienHe": { "dienThoai": "0901000003", "diaChi": "Đà Nẵng" },
        "quaTrinhCongTac": [ { "donVi": "Sở Tư pháp", "chucVu": "Chuyên viên", "tuNam": "2013" } ] } },
    { "trangThaiDuLieu": { "suKien": "UPDATE", "phienBan": 2, "thoiGianCapNhat": "2026-10-07T08:00:00" },
      "duLieuTiepNhan": { "maHoSo": "HS004", "hoTen": "Phạm Thị Dung", "ngaySinh": "1992-05-08", "chucVuHienTai": "Chuyên viên", "luong": 11000000, "email": "dung.pt@demo.vn",
        "lienHe": { "dienThoai": "0901000004", "diaChi": "Cần Thơ" },
        "quaTrinhCongTac": [] } },
    { "trangThaiDuLieu": { "suKien": "NEW", "phienBan": 1, "thoiGianCapNhat": "2026-10-07T08:00:00" },
      "duLieuTiepNhan": { "maHoSo": "HS005", "hoTen": "Hoàng Văn Em", "ngaySinh": "1987-09-15", "chucVuHienTai": "Chuyên viên chính", "luong": 16000000, "email": "em.hv@demo.vn",
        "lienHe": { "dienThoai": "0901000005", "diaChi": "Huế" },
        "quaTrinhCongTac": [ { "donVi": "Cục Hộ tịch", "chucVu": "Chuyên viên", "tuNam": "2011" } ] } }
  ]
}`;
const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<root>
  <duLieuTiepNhan>
    <dauGiaVien><maDauGiaVien>DGV001</maDauGiaVien><hoTen>Nguyễn Văn An</hoTen></dauGiaVien>
  </duLieuTiepNhan>
</root>`;
const SAMPLE_CSV = 'maNhanVien,hoTen,donVi\nNV001,Nguyễn Văn An,Sở Tư pháp\n';

const PUSH_NOTE = 'Nguồn nhận đẩy (PUSH) — hệ thống chỉ tiếp nhận dữ liệu đẩy tới, không có URL/tham số gọi ra ngoài. Cấu trúc cột xem ở tab "Cấu trúc".';

const downloadText = (name: string, content: string, mime: string) => {
  const url = URL.createObjectURL(new Blob([content], { type: `${mime};charset=utf-8` }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
};

/** Thẻ tệp đính kèm: tên tệp (+ dung lượng) và nút Tải xuống */
function AttachmentCard({ name, size, content, mime }: { name: string; size?: string; content: string; mime: string }) {
  return (
    <div className="inline-flex items-center gap-3 min-w-[280px] max-w-full pl-3 pr-1.5 py-2 border border-[#E2E8F0] rounded-lg bg-white">
      <span className="w-8 h-8 shrink-0 rounded-lg bg-[#EAF3FF] text-blue-600 flex items-center justify-center"><FileText className="w-4 h-4" /></span>
      <span className="flex-1 min-w-0">
        <span className="block truncate text-[13px] font-medium text-[#020817]">{name}</span>
        {size && <span className="block text-[12px] text-[#64748B]">{size}</span>}
      </span>
      <button type="button" title="Tải xuống" aria-label={`Tải xuống ${name}`} onClick={() => downloadText(name, content, mime)} className={BTN_GHOST_ICON}>
        <Download className="w-4 h-4" />
      </button>
    </div>
  );
}

/** Giá trị Bật/Tắt hiển thị dạng chữ (5.17) */
const ViewField = ({ label, value, wide, mono }: { label: string; value?: React.ReactNode; wide?: boolean; mono?: boolean }) => (
  <div className={`space-y-1 ${wide ? 'col-span-2' : ''}`}>
    <div className={FIELD_LABEL}>{label}</div>
    <div className={`${FIELD_VALUE} break-all ${mono ? 'font-mono' : ''}`}>{value === undefined || value === '' ? '-' : value}</div>
  </div>
);

function ViewReceiveConnection({ format }: { format: 'JSON' | 'XML' }) {
  const isJson = format === 'JSON';
  const copy = () => {
    navigator.clipboard?.writeText(SAMPLE_JSON).then(
      () => toast.success('Đã sao chép dữ liệu JSON mẫu'),
      () => toast.error('Không sao chép được, vui lòng thử lại'),
    );
  };
  return (
    <>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-w-4xl">
        <ViewField label="Tách bảng con từ mảng lồng" value="Bật" />
        {!isJson && <ViewField label="Danh mục dùng chung" value="Bật" />}
      </div>
      <div className="space-y-1">
        <div className={FIELD_LABEL}>Dữ liệu {format} mẫu</div>
        {isJson ? (
          <div className="relative">
            <pre className="max-h-[320px] overflow-auto custom-scrollbar p-4 pr-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[12px] leading-5 text-[#020817] font-mono whitespace-pre-wrap break-words">{SAMPLE_JSON}</pre>
            <button type="button" title="Sao chép" aria-label="Sao chép dữ liệu JSON mẫu" onClick={copy} className={`absolute top-2 right-3 bg-white ${BTN_GHOST_ICON}`}>
              <Copy className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div><AttachmentCard name="dauGiaVien.xml" content={SAMPLE_XML} mime="application/xml" /></div>
        )}
      </div>
      <p className="flex items-start gap-2 text-[13px] text-[#64748B]">
        <Info className="w-4 h-4 mt-0.5 shrink-0" />
        {PUSH_NOTE}
      </p>
    </>
  );
}

type KV = { key: string; value: string };
const API_HEADERS: KV[] = [
  { key: 'Content-Type', value: 'application/json' },
  { key: 'Accept', value: 'application/json' },
  { key: 'x-client-id', value: '{{x-client-id}}' },
];
const API_DATA_PARAMS: KV[] = [
  { key: 'page', value: '{{$template_page}}' },
  { key: 'pageSize', value: '{{$template_page_size}}' },
  { key: 'type', value: '{{$template_type}}' },
  { key: 'fromDate', value: '{{$template_from_date}}' },
  { key: 'toDate', value: '{{$template_to_date}}{{x-client-id}}' },
];
const API_DELETED_PARAMS: KV[] = [
  { key: 'fromDate', value: '{{$template_from_date}}' },
  { key: 'toDate', value: '{{$template_to_date}}' },
];

const V_TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const V_TD = 'px-3 py-1 text-[13px] text-[#020817]';

const ViewKeyValueTable = ({ rows }: { rows: KV[] }) => (
  <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
    <table className="w-full border-collapse text-[13px]">
      <thead className="bg-[#F8FAFC]">
        <tr className="h-[42px]">
          <th className={`${V_TH} text-center w-14`}>STT</th>
          <th className={`${V_TH} text-left w-[40%]`}>Key</th>
          <th className={`${V_TH} text-left`}>Value</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="h-12 border-t border-[#E0E0E0]">
            <td className={`${V_TD} text-center`}>{i + 1}</td>
            <td className={`${V_TD} font-mono break-all`}>{r.key}</td>
            <td className={`${V_TD} font-mono break-all`}>{r.value}</td>
          </tr>
        ))}
        {rows.length === 0 && (
          <tr className="border-t border-[#E0E0E0]"><td colSpan={3} className="px-3 py-4 text-center text-[13px] text-[#64748B]">Không có dữ liệu</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

const viewSubTab = (active: boolean) =>
  `h-10 px-3 inline-flex items-center gap-1.5 text-[13px] font-semibold border-b-2 -mb-px transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${active ? 'border-blue-600 text-blue-600' : 'border-transparent text-[#64748B] hover:text-[#020817]'}`;

/** Thẻ Params / Authorization / Headers / Body chỉ đọc */
function ViewRequestTabs({ params }: { params: KV[] }) {
  const [tab, setTab] = useState<'params' | 'auth' | 'headers' | 'body'>('params');
  const tabs = [
    { id: 'params' as const, label: 'Params' },
    { id: 'auth' as const, label: 'Authorization' },
    { id: 'headers' as const, label: 'Headers', count: API_HEADERS.length },
    { id: 'body' as const, label: 'Body' },
  ];
  return (
    <div>
      <div role="tablist" className="flex border-b border-[#E2E8F0]">
        {tabs.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={viewSubTab(tab === t.id)}>
            {t.label}
            {!!t.count && <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#F1F5F9] text-[#475569] text-[11px] font-semibold inline-flex items-center justify-center">{t.count}</span>}
          </button>
        ))}
      </div>
      <div className="pt-3">
        {tab === 'params' && <ViewKeyValueTable rows={params} />}
        {tab === 'headers' && <ViewKeyValueTable rows={API_HEADERS} />}
        {tab === 'auth' && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <ViewField label="Kiểu xác thực" value="No Authen" />
          </div>
        )}
        {tab === 'body' && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <ViewField label="Body" value="-" wide />
          </div>
        )}
      </div>
    </div>
  );
}

const ApiSectionTitle = ({ index, children }: { index: number; children: React.ReactNode }) => (
  <div className={`flex items-center gap-2 ${GROUP_TITLE}`}>
    <span className="w-5 h-5 rounded-full bg-[#EAF3FF] text-blue-600 text-[12px] font-semibold inline-flex items-center justify-center">{index}</span>
    {children}
  </div>
);

function ViewApiConnection() {
  return (
    <>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <ViewField label="Loại thu thập" value="Theo mẫu (đồng bộ)" />
        <ViewField label="Method" value="GET" />
        <ViewField label="URL" wide mono value="{{domain}}ac-apis/partner/organization-units/v2/type/6?page={{$template_page}}&pageSize={{$template_page_size}}&type={{$template_type}}&fromDate={{$template_from_date}}&toDate={{$template_to_date}}{{x-client-id}}" />
        <ViewField label="Máy chủ thực thi" value="-" />
        <ViewField label="Trạm kết nối" value="-" />
      </div>

      <div className="space-y-3 pt-4 border-t border-[#E2E8F0]">
        <ApiSectionTitle index={1}>API dữ liệu</ApiSectionTitle>
        <ViewRequestTabs params={API_DATA_PARAMS} />
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-1">
          <ViewField label="Đường dẫn dữ liệu (data path)" value="data" mono />
          <ViewField label="Định dạng ngày (fromDate / toDate)" value="yyyy-MM-dd'T'HH:mm:ss" mono />
          <ViewField label="Đường dẫn totalPages" value="pagination.totalPages" mono />
          <ViewField label="Đường dẫn totalElements" value="pagination.totalElements" mono />
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-[#E2E8F0]">
        <ApiSectionTitle index={2}>API danh sách xóa</ApiSectionTitle>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <ViewField label="URL (API danh sách xóa)" wide mono value="{{domain}}ac-apis/partner/organization-units/method/deleted?fromDate={{$template_from_date}}&toDate={{$template_to_date}}" />
        </div>
        <ViewRequestTabs params={API_DELETED_PARAMS} />
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-1">
          <ViewField label="Đường dẫn khóa bị xóa (deleted path)" value="deleted" mono />
        </div>
      </div>
    </>
  );
}

function TabConnection({ service, showApiKey, setShowApiKey, onEdit }: any) {
  // Mock connection type if not in service
  const connectionType = resolveConnectionType(service);

  return (
    <div className="animate-in fade-in duration-300 space-y-8">
      {/* STATUS BANNER — chỉ hiển thị với Cơ sở dữ liệu (PM bỏ cho API, API nhận JSON/XML, Tải file 07/10/2026) */}
      {connectionType === 'DB' && (
        <div className={`rounded-xl p-5 border ${service.status === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
          service.status?.startsWith('failed_') ? 'bg-red-50 border-red-200 text-red-800' :
            service.status === 'inactive' ? 'bg-gray-50 border-gray-200 text-gray-700' :
              'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 font-medium text-[14px]">
              <div className={`w-2.5 h-2.5 rounded-full ${service.status === 'success' ? 'bg-green-600 animate-pulse' :
                service.status?.startsWith('failed_') ? 'bg-red-600' :
                  'bg-gray-400'
                }`}></div>
              {service.status === 'success' ? 'Kết nối đang hoạt động tốt' :
                service.status?.startsWith('failed_') ? 'Kết nối thất bại' :
                  service.status === 'inactive' ? 'Kết nối đang tạm ngưng' : 'Trạng thái bản nháp'}
            </div>
            <div className="text-[13px] font-medium opacity-70 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              Kiểm tra lần cuối: {service.lastReceived || 'Vừa xong'}
            </div>
          </div>

          {(service.status?.startsWith('failed_') || service.status === 'inactive') && (
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-black/5 mt-2 flex items-start gap-3">
              <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${service.status?.startsWith('failed_') ? 'text-red-500' : 'text-gray-500'}`} />
              <div>
                <div className="text-[13px] font-medium mb-1">
                  {service.status === 'failed_agent' ? 'Lỗi từ Trạm kết nối' :
                    service.status === 'failed_worker' ? 'Lỗi từ Máy chủ thực thi' :
                      service.status === 'failed_auth' ? 'Lỗi xác thực' :
                        service.status === 'inactive' ? 'Lý do ngưng hoạt động' : 'Thông tin chi tiết'}
                </div>
                <div className="text-[13px] leading-relaxed">
                  {service.failureReason || service.inactiveReason || 'Không có thông tin chi tiết.'}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className={CARD_CLS}>
        <h3 className={SECTION_TITLE}>
          <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
          Cấu hình kết nối
        </h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <div className={FIELD_LABEL}>Phương thức kết nối</div>
            <div><Badge label={CONNECTION_TYPE_LABEL[connectionType] || 'File'} /></div>
          </div>

          {connectionType === 'API' && <ViewApiConnection />}

          {(connectionType === 'API_RECEIVE_JSON' || connectionType === 'API_RECEIVE_XML') && (
            <ViewReceiveConnection format={connectionType === 'API_RECEIVE_JSON' ? 'JSON' : 'XML'} />
          )}

          {connectionType === 'DB' && (
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-w-4xl">
              <div className="space-y-1">
                <div className={FIELD_LABEL}>Tên CSDL</div>
                <div className={`${FIELD_VALUE} break-words`}>HOTICH_PROD</div>
              </div>
              <div className="space-y-1">
                <div className={FIELD_LABEL}>Tên CSDL gốc</div>
                <div className={`${FIELD_VALUE} break-words`}>HOTICH_MASTER</div>
              </div>
              <div className="space-y-1">
                <div className={FIELD_LABEL}>Kiểu CSDL</div>
                <div className={`${FIELD_VALUE} break-words`}>POSTGRESQL</div>
              </div>
              <div className="space-y-1">
                <div className={FIELD_LABEL}>Trạm kết nối</div>
                <div className={`${FIELD_VALUE} break-words`}>Trạm kết nối 1</div>
              </div>
              <div className="space-y-1">
                <div className={FIELD_LABEL}>Máy chủ thực thi</div>
                <div className={`${FIELD_VALUE} break-words`}>Máy chủ thực thi 1</div>
              </div>
              <div className="space-y-1">
                <div className={FIELD_LABEL}>Địa chỉ CSDL</div>
                <div className={`${FIELD_VALUE} break-words`}>192.168.1.100</div>
              </div>
              <div className="space-y-1">
                <div className={FIELD_LABEL}>Cổng kết nối</div>
                <div className={`${FIELD_VALUE} break-words`}>5432</div>
              </div>
              <div className="space-y-1">
                <div className={FIELD_LABEL}>Tài khoản</div>
                <div className={`${FIELD_VALUE} break-words`}>admin_db</div>
              </div>
            </div>
          )}

          {connectionType === 'FILE' && (
            <>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-w-4xl">
                <div className="space-y-1">
                  <div className={FIELD_LABEL}>Máy chủ thực thi</div>
                  <div className={FIELD_VALUE}>-</div>
                </div>
                <div className="space-y-1">
                  <div className={FIELD_LABEL}>Trạm kết nối</div>
                  <div className={FIELD_VALUE}>-</div>
                </div>
              </div>
              <div className="space-y-1">
                <div className={FIELD_LABEL}>Tệp đính kèm</div>
                <AttachmentCard name="nhan-vien.csv" size="1 KB" content={SAMPLE_CSV} mime="text/csv" />
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  )
}

function TabCollection({ service, onEdit }: any) {
  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      <div className={CARD_CLS}>
        <h3 className={SECTION_TITLE}>
          <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
          Cấu hình đồng bộ dữ liệu
        </h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-w-4xl">

          <div className="space-y-1">
            <div className={FIELD_LABEL}>Loại tần suất</div>
            <div className={`${FIELD_VALUE} break-words`}>Cập nhật</div>
          </div>

          <div className="space-y-1">
            <div className={FIELD_LABEL}>Lặp lại</div>
            <div className={`${FIELD_VALUE} break-words`}>Hằng ngày</div>
          </div>

          <div className="space-y-1">
            <div className={FIELD_LABEL}>Lặp lại trong</div>
            <div className={`${FIELD_VALUE} break-words`}>
              1 ngày
            </div>
          </div>

          <div className="space-y-1">
            <div className={FIELD_LABEL}>Thực hiện lúc</div>
            <div className={`${FIELD_VALUE} flex items-center gap-2`}>
              <Clock className="w-4 h-4" />
              12:00
            </div>
          </div>

          <div className="space-y-1 col-span-2">
            <div className={FIELD_LABEL}>Mô tả tóm lược</div>
            <div className={`${FIELD_VALUE} bg-blue-50/50 p-4 rounded-lg border border-blue-100 flex items-start gap-3`}>
              <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              Lặp lại mỗi 1 ngày lúc 12:00
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

function TabMapping({ onEdit }: { onEdit: () => void }) {
  const [activeTableId, setActiveTableId] = useState('citizen_info');
  const [searchTable, setSearchTable] = useState('');
  const [searchField, setSearchField] = useState('');

  const mockTables = [
    {
      id: 'citizen_info',
      name: 'citizen_info',
      label: 'Thông tin công dân',
      fields: [
        { id: 'f1', name: 'id', dataType: 'uuid', allowNull: false, isPath: false, hostPath: '-', displayName: 'ID', isPrimaryKey: true },
        { id: 'f2', name: 'full_name', dataType: 'varchar(255)', allowNull: false, isPath: false, hostPath: '-', displayName: 'Họ và tên' },
        { id: 'f3', name: 'citizen_pin', dataType: 'varchar(12)', allowNull: false, isPath: false, hostPath: '-', displayName: 'Số định danh' },
        { id: 'f4', name: 'identify_no', dataType: 'varchar(12)', allowNull: true, isPath: false, hostPath: '-', displayName: 'Số CCCD' },
        { id: 'f5', name: 'passport_no', dataType: 'varchar(20)', allowNull: true, isPath: false, hostPath: '-', displayName: 'Số hộ chiếu' },
        { id: 'f6', name: 'birth_date', dataType: 'date', allowNull: true, isPath: false, hostPath: '-', displayName: 'Ngày sinh' },
      ]
    },
    {
      id: 'birth_registrations',
      name: 'birth_registrations',
      label: 'Đăng ký khai sinh',
      fields: [
        { id: 'f7', name: 'id', dataType: 'uuid', allowNull: false, isPath: false, hostPath: '-', displayName: 'ID', isPrimaryKey: true },
        { id: 'f8', name: 'number_no', dataType: 'varchar(50)', allowNull: false, isPath: false, hostPath: '-', displayName: 'Số hiệu' },
        { id: 'f9', name: 'book_no', dataType: 'varchar(50)', allowNull: false, isPath: false, hostPath: '-', displayName: 'Số quyển' },
        { id: 'f10', name: 'mother_full_name', dataType: 'varchar(255)', allowNull: false, isPath: false, hostPath: '-', displayName: 'Họ tên mẹ' },
        { id: 'f11', name: 'father_full_name', dataType: 'varchar(255)', allowNull: false, isPath: false, hostPath: '-', displayName: 'Họ tên cha' },
        { id: 'f12', name: 'reg_date', dataType: 'date', allowNull: false, isPath: false, hostPath: '-', displayName: 'Ngày đăng ký' },
      ]
    },
    {
      id: 'marriage_registrations',
      name: 'marriage_registrations',
      label: 'Đăng ký kết hôn',
      fields: [
        { id: 'f14', name: 'id', dataType: 'uuid', allowNull: false, isPath: false, hostPath: '-', displayName: 'ID', isPrimaryKey: true },
        { id: 'f15', name: 'cert_number', dataType: 'varchar(50)', allowNull: false, isPath: false, hostPath: '-', displayName: 'Số chứng nhận' },
        { id: 'f16', name: 'husband_name', dataType: 'varchar(255)', allowNull: false, isPath: false, hostPath: '-', displayName: 'Họ tên chồng' },
        { id: 'f17', name: 'wife_name', dataType: 'varchar(255)', allowNull: false, isPath: false, hostPath: '-', displayName: 'Họ tên vợ' },
        { id: 'f18', name: 'reg_date', dataType: 'date', allowNull: false, isPath: false, hostPath: '-', displayName: 'Ngày đăng ký' },
      ]
    }
  ];

  const filteredTables = mockTables.filter(t => t.name.toLowerCase().includes(searchTable.toLowerCase()));
  const activeTable = mockTables.find(t => t.id === activeTableId);
  const filteredFields = activeTable?.fields.filter(f => f.name.toLowerCase().includes(searchField.toLowerCase())) || [];

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex h-[550px] border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        {/* Left Column: Tables */}
        <div className="w-1/3 border-r border-slate-200 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-200 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm bảng..."
                className="w-full h-10 pl-9 pr-3 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={searchTable}
                onChange={(e) => setSearchTable(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-2 space-y-1">
              {filteredTables.map(table => (
                <button
                  key={table.id}
                  onClick={() => setActiveTableId(table.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all border-2 ${activeTableId === table.id
                    ? 'bg-blue-50 text-blue-700 border-blue-600 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-transparent'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${activeTableId === table.id ? 'bg-blue-100' : 'bg-slate-200'}`}>
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[13px] ">{table.name}</div>
                      <div className="text-[12px] opacity-70">{table.label}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Fields */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-slate-800 text-[13px]">Danh sách trường:</h4>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[13px] font-mono">{activeTable?.name}</span>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm trường..."
                className="w-full h-10 pl-9 pr-3 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#F8FAFC] sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-[13px] leading-4 whitespace-nowrap">Tên trường</th>
                  <th className="px-3 py-[13px] leading-4 whitespace-nowrap">Kiểu dữ liệu</th>
                  <th className="px-3 py-[13px] leading-4 whitespace-nowrap">Allow null</th>
                  <th className="px-3 py-[13px] leading-4 whitespace-nowrap text-center">Khóa chính</th>
                  <th className="px-3 py-[13px] leading-4 whitespace-nowrap">Tên hiển thị</th>
                </tr>
              </thead>
              <tbody>
                {filteredFields.map(field => (
                  <tr key={field.id} className="h-12 border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-3 py-1 font-medium text-slate-900">{field.name}</td>
                    <td className="px-3 py-1">
                      <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[12px] font-mono text-slate-600">
                        {field.dataType}
                      </span>
                    </td>
                    <td className="px-3 py-1 text-center">
                      <div className="flex justify-center">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${field.allowNull ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'}`}>
                          {field.allowNull && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-1 text-center">
                      {field.isPrimaryKey && (
                        <div className="flex justify-center">
                          <Key className="w-4 h-4 text-amber-500" />
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-1 text-slate-900">{field.displayName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabHistory({ onGoToMapping }: { onGoToMapping?: () => void }) {
  const [historyPage, setHistoryPage] = useState(1);
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null);

  const historyLogs = [
    { id: 1, runTime: '10/04/2025\n09:00:12', status: 'success', records: '4,218', duration: '1 phút 42 giây', errorCode: '—', note: 'Incremental từ 09/04', hasDetails: false },
    { id: 2, runTime: '09/04/2025\n09:00:08', status: 'partial_success', records: '3,901', duration: '1 phút 28 giây', errorCode: 'D-PARTIAL', note: 'Thành công một phần. Cảnh báo dữ liệu: Một vài bản ghi không khớp cấu trúc hoặc chứa trường dữ liệu mới.', hasDetails: true },
    { id: 6, runTime: '08/04/2025\n09:00:15', status: 'error', records: '0 / 5,120', duration: '14 giây', errorCode: 'D-SCHEMA-FAIL', note: 'Thất bại: Toàn bộ bản ghi không khớp. Cấu trúc dữ liệu nguồn đã bị thay đổi (Schema Changed).', hasDetails: false },
    { id: 3, runTime: '07/04/2025\n09:00:15', status: 'success', records: '5,120', duration: '2 phút 01 giây', errorCode: '—', note: '', hasDetails: false },
    { id: 4, runTime: '03/04/2025\n09:00:22', status: 'error', records: '0', duration: '5 phút\n(timeout)', errorCode: 'D-04', note: 'Timeout đọc dữ liệu — Retry 3/3 thất bại ↗', hasDetails: false },
  ];

  if (selectedLogId !== null) {
    const selectedLog = historyLogs.find(l => l.id === selectedLogId);
    return <ErrorDetailView log={selectedLog} onBack={() => setSelectedLogId(null)} onGoToMapping={onGoToMapping} />;
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <select aria-label="Select box" className="px-3 py-2 border border-slate-300 rounded-lg text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200">
            <option>Tất cả trạng thái</option>
            <option>Thành công</option>
            <option>Thất bại</option>
          </select>
          <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
            <input aria-label="Input field" type="text" className="px-3 py-2 text-[13px] w-28 text-center focus:outline-none border-r border-slate-200" defaultValue="01/04/2025" />
            <div className="px-2 text-slate-400 bg-slate-50 border-r border-slate-200 h-full flex items-center"><Calendar className="w-4 h-4" /></div>
            <input aria-label="Input field" type="text" className="px-3 py-2 text-[13px] w-28 text-center focus:outline-none" defaultValue="10/04/2025" />
            <div className="px-2 text-slate-400 bg-slate-50 border-l border-slate-200 h-full flex items-center"><Calendar className="w-4 h-4" /></div>
          </div>
        </div>
        <button className={BTN_OUTLINE}>
          Xuất CSV
        </button>
      </div>

      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-[#F8FAFC]">
            <tr>
              <th className="px-3 py-[13px] leading-4 whitespace-nowrap">Thời điểm chạy</th>
              <th className="px-3 py-[13px] leading-4 whitespace-nowrap w-[15%]">Trạng thái</th>
              <th className="px-3 py-[13px] leading-4 whitespace-nowrap">Số bản ghi</th>
              <th className="px-3 py-[13px] leading-4 whitespace-nowrap">Thời gian xử lý</th>
              <th className="px-3 py-[13px] leading-4 whitespace-nowrap">Mã lỗi</th>
              <th className="px-3 py-[13px] leading-4 whitespace-nowrap">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {historyLogs.map(log => (
              <tr key={log.id} className="h-12 border-b border-[#E0E0E0]">
                <td className="px-3 py-1 font-mono text-[13px] whitespace-pre-wrap">{log.runTime}</td>
                <td className="px-3 py-1">
                  {log.status === 'success' ? (
                    <Badge label="Thành công" variant="emerald" />
                  ) : log.status === 'partial_success' ? (
                    <Badge label="Một phần" variant="amber" />
                  ) : (
                    <Badge label="Thất bại" variant="red" />
                  )}
                </td>
                <td className="px-3 py-1 font-mono">{log.records}</td>
                <td className="px-3 py-1 whitespace-pre-wrap">{log.duration}</td>
                <td className={`px-3 py-1 ${log.errorCode !== '—' ? 'text-[#d32f2f] underline cursor-pointer hover:font-medium' : 'text-slate-400'}`}>
                  {log.errorCode}
                </td>
                <td className={`px-3 py-1 ${log.status === 'error' ? 'text-[#d32f2f]' : ''}`}>
                  <div className="whitespace-pre-wrap">{log.note}</div>
                  {log.hasDetails && (
                    <button
                      onClick={() => setSelectedLogId(log.id)}
                      className="mt-2 text-blue-600 hover:text-blue-700 text-[13px] font-medium flex items-center gap-1 transition-colors">
                      <Eye className="w-3 h-3" /> Xem chi tiết
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="flex justify-center w-full px-4 mb-1">
          <button className="p-2 bg-white border border-slate-200 rounded-full text-slate-500 shadow-sm hover:shadow hover:bg-slate-50 transition-all mt-4 absolute left-1/2 -translate-x-1/2 z-10 bottom-0">
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
        <div className="ml-auto z-20 absolute right-8 -mt-2">
          <Pagination currentPage={historyPage} totalItems={historyLogs.length} pageSize={10} onPageChange={setHistoryPage} className="!p-0 !bg-transparent" />
        </div>
      </div>
    </div>
  );
}

function ErrorDetailView({ log, onBack, onGoToMapping }: any) {
  const missingRecords = [
    { id: 'REC-001', raw: '{"ho_ten": "Nguyễn Văn A"}', missing: ['ngay_sinh', 'quoc_tich'] },
    { id: 'REC-045', raw: '{"ho_ten": "Trần Thị B", "quoc_tich": "VN"}', missing: ['ngay_sinh'] }
  ];

  const unmappedFields = [
    { fieldName: 'noi_cap_cccd', type: 'string', sample: 'C06', affectedRecords: 45 },
    { fieldName: 'ton_giao', type: 'string', sample: 'Không', affectedRecords: 12 }
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
        <button onClick={onBack} aria-label="Quay lại" title="Quay lại" className={`-ml-2 ${BTN_GHOST_ICON}`}>
          <ArrowRight className="w-5 h-5 rotate-180" />
        </button>
        <div>
          <h3 className="text-[13px] font-medium text-slate-800">Chi tiết dữ liệu lỗi - Đợt chạy {log?.runTime.replace('\n', ' ')}</h3>
          <p className="text-[13px] text-slate-500">Mã lỗi: {log?.errorCode} &mdash; {log?.status === 'partial_success' ? 'Hoàn thành một phần' : 'Thất bại'}</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Missing Fields Area */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600 border border-red-100 shadow-sm">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 text-[13px]">Bản ghi thiếu trường bắt buộc</h4>
                <p className="text-[13px] text-slate-500">2 bản ghi bị từ chối do thiếu dữ liệu mapping</p>
              </div>
            </div>
            <button className={BTN_OUTLINE}>
              <Download className="w-4 h-4" /> Xuất File Lỗi
            </button>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#F8FAFC]">
                <tr>
                  <th className="px-3 py-[13px] leading-4 whitespace-nowrap w-1/4">Record ID</th>
                  <th className="px-3 py-[13px] leading-4 whitespace-nowrap w-1/2">Dữ liệu gốc (Raw)</th>
                  <th className="px-3 py-[13px] leading-4 whitespace-nowrap">Trường bị thiếu</th>
                </tr>
              </thead>
              <tbody>
                {missingRecords.map(rec => (
                  <tr key={rec.id} className="h-12 border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-3 py-1 font-mono text-[13px] text-slate-600">{rec.id}</td>
                    <td className="px-3 py-1 font-mono text-[13px] text-slate-600 bg-slate-50 p-2 rounded block mx-2 my-2 border border-slate-100">{rec.raw}</td>
                    <td className="px-3 py-1">
                      <div className="flex flex-wrap gap-1.5">
                        {rec.missing.map(m => (
                          <Badge key={m} label={m} variant="red" />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Unmapped Fields Area */}
        <div>
          <div className="flex items-center justify-between mb-4 mt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100 shadow-sm">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 text-[13px]">Phát hiện dữ liệu mới / thay đổi</h4>
                <p className="text-[13px] text-slate-500">Một vài bản ghi trả về các trường dữ liệu bị thay đổi cấu trúc, không khớp với sơ đồ hiện tại</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className={BTN_OUTLINE}>
                Bỏ qua
              </button>
              <button onClick={onGoToMapping} className={BTN_PRIMARY}>
                <Shield className="w-4 h-4" /> Cấu hình ánh xạ ngay
              </button>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden bg-[#fbfaf9] shadow-sm">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#F8FAFC]">
                <tr>
                  <th className="px-3 py-[13px] leading-4 whitespace-nowrap w-1/3">Tên trường mới phát hiện</th>
                  <th className="px-3 py-[13px] leading-4 whitespace-nowrap">Định dạng suy đoán</th>
                  <th className="px-3 py-[13px] leading-4 whitespace-nowrap">Giá trị mẫu</th>
                  <th className="px-3 py-[13px] leading-4 whitespace-nowrap">Số bản ghi ảnh hưởng</th>
                </tr>
              </thead>
              <tbody>
                {unmappedFields.map(f => (
                  <tr key={f.fieldName} className="h-12 border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-3 py-1 font-mono text-[13px] text-slate-800 font-medium">{f.fieldName}</td>
                    <td className="px-3 py-1">
                      <Badge label={f.type} variant="slate" />
                    </td>
                    <td className="px-3 py-1 text-slate-600 italic">"{f.sample}"</td>
                    <td className="px-3 py-1 text-slate-600">{f.affectedRecords} bản ghi</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function TabChangelog() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const changelogs = [
    { id: 1, time: '14/04/2025 09:30:15', user: 'Nguyễn Văn Admin', type: 'Cập nhật', desc: 'Thay đổi API Key ở tab Cấu hình kết nối.' },
    { id: 2, time: '12/04/2025 15:20:00', user: 'Trần Thị B', type: 'Bảo trì', desc: 'Chuyển trạng thái kết nối sang Bảo trì để cập nhật server.' },
    { id: 3, time: '10/04/2025 11:05:40', user: 'Hệ thống', type: 'Kích hoạt lại', desc: 'Tự động kích hoạt lại kết nối sau quá trình bảo trì.' },
    { id: 4, time: '05/04/2025 08:15:22', user: 'Lê Văn C', type: 'Cập nhật', desc: 'Thêm trường "so_dinh_danh" vào bảng ánh xạ dữ liệu (Mapping).' },
    { id: 5, time: '01/04/2025 10:00:10', user: 'Nguyễn Văn Admin', type: 'Cập nhật', desc: 'Thay đổi tần suất đồng bộ từ hàng tuần sang hàng ngày lúc 09:00.' },
    { id: 6, time: '15/03/2025 14:22:00', user: 'Nguyễn Văn Admin', type: 'Tạo mới', desc: 'Tạo mới thiết lập dịch vụ kết nối dữ liệu quốc tịch.' },
  ];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = changelogs.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(changelogs.length / itemsPerPage);

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'Tạo mới': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Cập nhật': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Bảo trì': return 'bg-slate-200 text-slate-700 border-slate-300';
      case 'Kích hoạt lại': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[14px] font-medium text-[#020817]">Nhật ký thay đổi thiết lập kết nối</h3>
      </div>

      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        <table className="w-full text-left text-[13px] whitespace-nowrap">
          <thead className="bg-[#F8FAFC]">
            <tr>
              <th className="px-3 py-[13px] leading-4 whitespace-nowrap">Thời điểm</th>
              <th className="px-3 py-[13px] leading-4 whitespace-nowrap">Người thực hiện</th>
              <th className="px-3 py-[13px] leading-4 whitespace-nowrap w-[15%]">Loại thay đổi</th>
              <th className="px-3 py-[13px] leading-4 whitespace-nowrap w-1/2">Mô tả thay đổi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((log) => (
              <tr key={log.id} className="h-12 border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                <td className="px-3 py-1 font-mono text-[13px]">{log.time}</td>
                <td className="px-3 py-1 text-slate-700">{log.user}</td>
                <td className="px-3 py-1">
                  <Badge label={log.type} variant={log.type === 'Tạo mới' ? 'blue' : log.type === 'Cập nhật' ? 'amber' : log.type === 'Bảo trì' ? 'slate' : 'green'} />
                </td>
                <td className="px-3 py-1 text-slate-600 whitespace-normal leading-relaxed">{log.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phân trang (mục 5.14) */}
      <Pagination className="mt-4 border border-[#E2E8F0] rounded-lg" currentPage={currentPage} totalItems={changelogs.length} pageSize={itemsPerPage} onPageChange={setCurrentPage} />
    </div>
  );
}
function TabActivityHistory({ onEdit }: { onEdit: () => void }) {
  const [filterStatus, setFilterStatus] = useState('all');

  const historyData = [
    { id: '66102', type: 'NEW', status: 'SUCCESSFUL', creator: 'administrator', server: '1000', time: '09/10/2025 15:06:34' },
    { id: '66101', type: 'DELETE', status: 'SUCCESSFUL', creator: 'administrator', server: '1000', time: '09/10/2025 15:05:41' },
    { id: '66100', type: 'DELETE', status: 'SKIPPED', creator: 'administrator', server: '1000', time: '09/10/2025 15:05:05' },
    { id: '66093', type: 'DELETE', status: 'CANCELLED', creator: 'administrator', server: '5000', time: '09/10/2025 15:04:34' },
    { id: '66082', type: 'UPDATE', status: 'CANCELLED', creator: 'administrator', server: '1000', time: '09/10/2025 14:56:50' },
    { id: '61149', type: 'NEW', status: 'SUCCESSFUL', creator: 'administrator', server: '1000', time: '06/10/2025 11:02:19' },
    { id: '61148', type: 'DELETE', status: 'SUCCESSFUL', creator: 'administrator', server: '1000', time: '06/10/2025 11:01:41' }
  ];

  const filteredHistory = historyData.filter(item => 
    filterStatus === 'all' || item.status.toLowerCase() === filterStatus.toLowerCase()
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-white">
          <h3 className="text-[14px] font-medium text-[#020817] flex items-center gap-3">
            Lịch sử hoạt động
          </h3>
          <div className="flex items-center gap-3">
            <select 
              aria-label="Filter status"
              className={`${INPUT_CLS} !w-auto min-w-[150px]`}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="successful">Successful</option>
              <option value="skipped">Skipped</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#F8FAFC] sticky top-0">
              <tr>
                <th className="px-3 py-[13px] leading-4 whitespace-nowrap">ID</th>
                <th className="px-3 py-[13px] leading-4 whitespace-nowrap">Loại</th>
                <th className="px-3 py-[13px] leading-4 whitespace-nowrap">Trạng thái</th>
                <th className="px-3 py-[13px] leading-4 whitespace-nowrap">Người tạo</th>
                <th className="px-3 py-[13px] leading-4 whitespace-nowrap">Thông Tin máy chủ</th>
                <th className="px-3 py-[13px] leading-4 whitespace-nowrap">Thời gian khởi tạo</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((row, idx) => (
                <tr key={idx} className="h-12 border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-3 py-1 font-medium text-slate-900">{row.id}</td>
                  <td className="px-3 py-1 text-slate-700 font-medium">{row.type}</td>
                  <td className="px-3 py-1">
                    <Badge 
                      label={row.status} 
                      variant={row.status === 'SUCCESSFUL' ? 'emerald' : row.status === 'SKIPPED' ? 'amber' : 'blue'} 
                    />
                  </td>
                  <td className="px-3 py-1 text-slate-600 font-medium">{row.creator}</td>
                  <td className="px-3 py-1 text-slate-600 font-medium">{row.server}</td>
                  <td className="px-3 py-1 text-slate-600 font-medium">{row.time}</td>
                </tr>
              ))}
              {filteredHistory.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500 italic">
                    Không tìm thấy dữ liệu lịch sử phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
