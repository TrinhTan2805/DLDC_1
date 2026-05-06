import React, { useState } from 'react';
import {
  X, CheckCircle, Search, Calendar, Eye, Activity, Shield, FileText, Download,
  ArrowRight, ExternalLink, RefreshCw, ChevronDown, ChevronRight, User, Plug, Settings, Database, Clock,
  LayoutTemplate, Check, AlertCircle, AlertTriangle, EyeOff,
  Trash2, History, Zap, PlusCircle, Plus, Edit, Code, Layers, List, Eraser, Upload, Power, Key
} from 'lucide-react';
import { initialSourceSystems } from './mockSourceSystems';
import { Portal } from '../../common/Portal';

interface ViewServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: any;
}

type TabType = 'general' | 'contact' | 'connection' | 'collection' | 'mapping';

export function ViewServiceModal({ isOpen, onClose, service }: ViewServiceModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [inactiveReason, setInactiveReason] = useState('');

  if (!isOpen || !service) return null;

  // Find source system details
  const sourceSystem = initialSourceSystems.find(ss => ss.systemName === service.system) || initialSourceSystems[0];

  return (
    <>
      <div className="fixed inset-0 z-50 flex overflow-y-auto bg-black/50 py-10 px-4 items-start font-sans">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl mx-auto flex flex-col flex-shrink-0 mb-auto overflow-hidden relative z-0">

          {/* HEADER */}
          <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span>Danh sách dịch vụ</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-blue-600">Chi tiết dịch vụ</span>
              </div>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-3 leading-tight">
                  {service.name || 'Dịch vụ chưa đặt tên'}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${service.status === 'draft' ? 'bg-slate-50 text-slate-700 border-slate-200' :
                    service.status === 'inactive' ? 'bg-gray-100 text-gray-500 border-gray-200' :
                      'bg-green-50 text-green-700 border-green-200'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${service.status === 'draft' ? 'bg-slate-400' :
                      service.status === 'inactive' ? 'bg-gray-400' :
                        'bg-green-600'
                      }`}></span>
                    {service.status === 'draft' ? 'Bản nháp' : service.status === 'inactive' ? 'Ngưng hoạt động' : 'Hoạt động'}
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="font-medium text-slate-700">{service.managingUnit || sourceSystem.unitName}</span>
                  <span className="text-slate-300">|</span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[11px] font-bold">
                    {service.version || 'v1.0.0'}
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Cập nhật: {service.updatedAt || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[13px] font-normal shadow-sm hover:bg-slate-200 transition-colors flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" /> Xem dữ liệu tích hợp
                </button>
                <button className="px-3 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[13px] font-normal shadow-sm hover:bg-slate-200 transition-colors flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5" /> Cập nhật dữ liệu
                </button>
                <button className="px-3 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[13px] font-normal shadow-sm hover:bg-slate-200 transition-colors flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Tích hợp mới
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInactiveModal(true);
                  }}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[13px] font-normal shadow-sm hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Power className="w-3.5 h-3.5" /> Ngừng hoạt động
                </button>
                <button className="px-3 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[13px] font-normal shadow-sm hover:bg-slate-200 transition-colors flex items-center gap-1.5">
                  <Eraser className="w-3.5 h-3.5" /> Xóa dữ liệu thu thập
                </button>
                <button className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-[13px] font-normal shadow-sm hover:bg-red-100 transition-colors flex items-center gap-1.5">
                  <Trash2 className="w-3.5 h-3.5" /> Xóa dịch vụ
                </button>
              </div>
            </div>
          </div>

          {/* TABS HEADER */}
          <div className="flex border-b border-slate-200 px-8 bg-white sticky top-0 z-10">
            {[
              { id: 'general', label: 'Thông tin chung', icon: FileText },
              { id: 'connection', label: 'Cấu hình kết nối', icon: Plug },
              { id: 'mapping', label: 'Cấu trúc', icon: LayoutTemplate },
              { id: 'collection', label: 'Cấu hình thu thập', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 text-sm transition-all relative ${activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-gray-300'
                  }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`} />
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
              </button>
            ))}
          </div>

          {/* TABS CONTENT */}
          <div className="px-8 py-8 flex-1 bg-[#fcfcfc] overflow-y-auto min-h-[500px]">
            {activeTab === 'general' && <TabGeneral service={service} sourceSystem={sourceSystem} />}
            {activeTab === 'connection' && <TabConnection service={service} showApiKey={showApiKey} setShowApiKey={setShowApiKey} />}
            {activeTab === 'collection' && <TabCollection service={service} />}
            {activeTab === 'mapping' && <TabMapping />}
          </div>
        </div>

        {/* INACTIVE CONFIRMATION MODAL - RESTORED AND FIXED Z-INDEX CONTEXT */}
        {showInactiveModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 backdrop-blur-md">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Power className="w-5 h-5 text-amber-600" />
                  </div>
                  Ngừng hoạt động
                </h3>
                <button onClick={() => setShowInactiveModal(false)} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-200 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="bg-red-50 border border-red-100 p-5 rounded-2xl flex gap-4 shadow-inner">
                  <div className="p-2 bg-red-100 rounded-full h-fit">
                    <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
                  </div>
                  <div>
                    <div className="text-md font-medium text-red-900 mb-1">Cảnh báo gián đoạn dữ liệu</div>
                    <p className="text-sm text-red-800/80 leading-relaxed font-medium">
                      Bạn có chắc muốn ngừng hoạt động này? Hành động này sẽ khiến luồng dữ liệu bị gián đoạn cho đến khi được kích hoạt lại thủ công.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700 ml-1">
                    Lý do ngừng hoạt động <span className="text-red-500 font-black">*</span>
                  </label>
                  <textarea
                    className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 min-h-[140px] text-sm bg-slate-50/30 outline-none transition-all placeholder:text-slate-400 resize-none"
                    placeholder="Vui lòng nhập lý do cụ thể (ví dụ: Thay đổi cấu hình Máy chủ thực thi, bảo trì định kỳ hệ thống nguồn...)"
                    value={inactiveReason}
                    onChange={(e) => setInactiveReason(e.target.value)}
                  />
                </div>
              </div>
              <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-4">
                <button
                  onClick={() => setShowInactiveModal(false)}
                  className="px-6 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  disabled={!inactiveReason.trim()}
                  onClick={() => {
                    alert(`Đã yêu cầu ngừng hoạt động.\nLý do: ${inactiveReason}`);
                    setShowInactiveModal(false);
                    setInactiveReason('');
                  }}
                  className="px-8 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl text-sm hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg shadow-amber-200 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transform active:scale-95"
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

function TabGeneral({ service, sourceSystem }: any) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
          Thông tin dịch vụ
        </h3>
        <div className="grid grid-cols-2 gap-x-12 gap-y-6">

          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Tên dịch vụ</div>
            <div className="text-sm text-slate-900 font-medium leading-relaxed">{service.name || '-'}</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Tên hệ thống nguồn</div>
            <div className="text-sm text-slate-900 font-medium leading-relaxed flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-500" />
              {service.system || sourceSystem.systemName}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Mức độ bảo mật dữ liệu</div>
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                {service.securityLevel || 'Nội bộ'}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Trạng thái dữ liệu</div>
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs ${(service.dataStatus || (service.status === 'success' ? 'DATA_UPDATED' : service.status === 'inactive' ? 'EMPTY' : service.status?.startsWith('failed') ? 'DATA_UPDATE_FAILED' : 'EMPTY')) === 'EMPTY' ? 'bg-slate-100 text-slate-600 border border-slate-200' :
                  (service.dataStatus || (service.status === 'success' ? 'DATA_UPDATED' : service.status === 'inactive' ? 'EMPTY' : service.status?.startsWith('failed') ? 'DATA_UPDATE_FAILED' : 'EMPTY')) === 'PROCESSING' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    (service.dataStatus || (service.status === 'success' ? 'DATA_UPDATED' : service.status === 'inactive' ? 'EMPTY' : service.status?.startsWith('failed') ? 'DATA_UPDATE_FAILED' : 'EMPTY')) === 'DATA_UPDATED' ? 'bg-green-50 text-green-700 border border-green-200' :
                      (service.dataStatus || (service.status === 'success' ? 'DATA_UPDATED' : service.status === 'inactive' ? 'EMPTY' : service.status?.startsWith('failed') ? 'DATA_UPDATE_FAILED' : 'EMPTY')) === 'DATA_INCOMPLETED' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                        (service.dataStatus || (service.status === 'success' ? 'DATA_UPDATED' : service.status === 'inactive' ? 'EMPTY' : service.status?.startsWith('failed') ? 'DATA_UPDATE_FAILED' : 'EMPTY')) === 'DATA_UPDATE_FAILED' ? 'bg-red-50 text-red-700 border border-red-200' :
                          'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                {(service.dataStatus || (service.status === 'success' ? 'DATA_UPDATED' : service.status === 'inactive' ? 'EMPTY' : service.status?.startsWith('failed') ? 'DATA_UPDATE_FAILED' : 'EMPTY')) === 'EMPTY' ? 'Rỗng' :
                  (service.dataStatus || (service.status === 'success' ? 'DATA_UPDATED' : service.status === 'inactive' ? 'EMPTY' : service.status?.startsWith('failed') ? 'DATA_UPDATE_FAILED' : 'EMPTY')) === 'PROCESSING' ? 'Đang lấy dữ liệu' :
                    (service.dataStatus || (service.status === 'success' ? 'DATA_UPDATED' : service.status === 'inactive' ? 'EMPTY' : service.status?.startsWith('failed') ? 'DATA_UPDATE_FAILED' : 'EMPTY')) === 'DATA_UPDATED' ? 'Cập nhật thành công' :
                      (service.dataStatus || (service.status === 'success' ? 'DATA_UPDATED' : service.status === 'inactive' ? 'EMPTY' : service.status?.startsWith('failed') ? 'DATA_UPDATE_FAILED' : 'EMPTY')) === 'DATA_INCOMPLETED' ? 'Lỗi cấu trúc' :
                        (service.dataStatus || (service.status === 'success' ? 'DATA_UPDATED' : service.status === 'inactive' ? 'EMPTY' : service.status?.startsWith('failed') ? 'DATA_UPDATE_FAILED' : 'EMPTY')) === 'DATA_UPDATE_FAILED' ? 'Lỗi cập nhật' :
                          'Rỗng'}
              </span>
            </div>
          </div>

          <div className="space-y-1 col-span-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Mô tả</div>
            <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100 italic">
              {service.description || 'Chưa có mô tả cho dịch vụ này.'}
            </div>
          </div>

        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
          Đính kèm văn bản
        </h3>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 border border-slate-200 rounded-xl px-4 py-3 bg-white hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group shadow-sm">
            <div className="p-2 bg-red-50 text-red-500 rounded-lg group-hover:bg-red-100">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm text-slate-800 font-medium">QĐ_Ketno_QuocTich_2025.pdf</div>
              <div className="text-[11px] text-slate-400 font-medium">245 KB • 10/04/2025</div>
            </div>
            <Download className="w-4 h-4 text-slate-400 ml-4 group-hover:text-blue-600" />
          </div>

          <div className="flex items-center gap-3 border border-slate-200 rounded-xl px-4 py-3 bg-white hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group shadow-sm">
            <div className="p-2 bg-blue-50 text-blue-500 rounded-lg group-hover:bg-blue-100">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm text-slate-800 font-medium">BienBan_Nghiemthu_API.docx</div>
              <div className="text-[11px] text-slate-400 font-medium">118 KB • 10/04/2025</div>
            </div>
            <Download className="w-4 h-4 text-slate-400 ml-4 group-hover:text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
          Thông tin hệ thống nguồn
        </h3>
        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Tên hệ thống</div>
            <div className="text-sm text-slate-900 font-medium leading-relaxed">{sourceSystem.systemName}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Tên đơn vị</div>
            <div className="text-sm text-slate-900 font-medium leading-relaxed">{sourceSystem.unitName}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Loại nguồn</div>
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold ${sourceSystem.sourceType === 'Trong ngành' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>
                {sourceSystem.sourceType}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Đầu mối liên hệ</div>
            <div className="text-sm text-slate-900 font-medium leading-relaxed flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              {sourceSystem.contactPerson}
            </div>
          </div>
          <div className="space-y-1 col-span-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Địa chỉ</div>
            <div className="text-sm text-slate-900 font-medium leading-relaxed italic">{sourceSystem.address}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Số điện thoại</div>
            <div className="text-sm text-slate-900 font-medium leading-relaxed">{sourceSystem.phone}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Email</div>
            <div className="text-sm text-slate-900 font-medium leading-relaxed text-blue-600 underline underline-offset-4">{sourceSystem.email}</div>
          </div>
          <div className="space-y-1 col-span-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Ghi chú</div>
            <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
              {sourceSystem.note || 'Không có ghi chú.'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-200 mt-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Edit className="w-4 h-4" /> Chỉnh sửa
        </button>
      </div>
    </div>
  );
}

function TabContact({ sourceSystem }: any) {
  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
          Thông tin hệ thống nguồn
        </h3>
        <div className="grid grid-cols-2 gap-x-12 gap-y-8 max-w-5xl">

          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Tên hệ thống</div>
            <div className="text-sm text-slate-900 font-medium leading-relaxed">{sourceSystem.systemName}</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Tên đơn vị</div>
            <div className="text-sm text-slate-900 font-medium leading-relaxed">{sourceSystem.unitName}</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Loại nguồn</div>
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold ${sourceSystem.sourceType === 'Trong ngành' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-orange-50 text-orange-700 border border-orange-100'
                }`}>
                {sourceSystem.sourceType}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Đầu mối liên hệ</div>
            <div className="text-sm text-slate-900 font-medium leading-relaxed flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              {sourceSystem.contactPerson}
            </div>
          </div>

          <div className="space-y-1 col-span-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Địa chỉ</div>
            <div className="text-sm text-slate-900 font-medium leading-relaxed italic">{sourceSystem.address}</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Số điện thoại</div>
            <div className="text-sm text-slate-900 font-medium leading-relaxed">{sourceSystem.phone}</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Email</div>
            <div className="text-sm text-slate-900 font-medium leading-relaxed text-blue-600 underline underline-offset-4">{sourceSystem.email}</div>
          </div>

          <div className="space-y-1 col-span-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Ghi chú</div>
            <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
              {sourceSystem.note || 'Không có ghi chú.'}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function TabConnection({ service, showApiKey, setShowApiKey }: any) {
  // Mock connection type if not in service
  const connectionType = service.connectionType || 'API';

  return (
    <div className="animate-in fade-in duration-300 space-y-8">
      {/* STATUS BANNER */}
      <div className={`rounded-xl p-5 border ${service.status === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
        service.status?.startsWith('failed_') ? 'bg-red-50 border-red-200 text-red-800' :
          service.status === 'inactive' ? 'bg-gray-50 border-gray-200 text-gray-700' :
            'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 font-bold text-sm uppercase tracking-tight">
            <div className={`w-2.5 h-2.5 rounded-full ${service.status === 'success' ? 'bg-green-600 animate-pulse' :
              service.status?.startsWith('failed_') ? 'bg-red-600' :
                'bg-gray-400'
              }`}></div>
            {service.status === 'success' ? 'Kết nối đang hoạt động tốt' :
              service.status?.startsWith('failed_') ? 'Kết nối thất bại' :
                service.status === 'inactive' ? 'Kết nối đang tạm ngưng' : 'Trạng thái bản nháp'}
          </div>
          <div className="text-xs font-medium opacity-70 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            Kiểm tra lần cuối: {service.lastReceived || 'Vừa xong'}
          </div>
        </div>

        {(service.status?.startsWith('failed_') || service.status === 'inactive') && (
          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-black/5 mt-2 flex items-start gap-3">
            <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${service.status?.startsWith('failed_') ? 'text-red-500' : 'text-gray-500'}`} />
            <div>
              <div className="text-sm font-medium mb-1">
                {service.status === 'failed_agent' ? 'Lỗi từ Trạm kết nối' :
                  service.status === 'failed_worker' ? 'Lỗi từ Máy chủ thực thi' :
                    service.status === 'failed_auth' ? 'Lỗi xác thực' :
                      service.status === 'inactive' ? 'Lý do ngưng hoạt động' : 'Thông tin chi tiết'}
              </div>
              <div className="text-sm leading-relaxed">
                {service.failureReason || service.inactiveReason || 'Không có thông tin chi tiết.'}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
          Cấu hình kết nối
        </h3>
        <div className="grid grid-cols-2 gap-x-12 gap-y-6 max-w-4xl">
          <div className="space-y-1 col-span-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Phương thức kết nối</div>
            <div className="text-sm text-slate-900 font-medium">{connectionType === 'API' ? 'API' : connectionType === 'DB' ? 'Cơ sở dữ liệu' : 'Tải file'}</div>
          </div>

          {connectionType === 'API' && (
            <>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Tên api</div>
                <div className="text-sm text-slate-900 font-medium">API Lấy thông tin công dân</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">URL</div>
                <div className="text-sm text-slate-900 font-medium font-mono">https://api.hotich.moj.gov.vn/api/v1/quoctich</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Máy chủ thực thi</div>
                <div className="text-sm text-slate-900 font-medium">Máy chủ thực thi 1</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Trạm kết nối</div>
                <div className="text-sm text-slate-900 font-medium">Trạm kết nối 1</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Method</div>
                <div className="text-sm text-slate-900 font-medium">GET</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Authorization</div>
                <div className="text-sm text-slate-900 font-medium">Bearer Token</div>
              </div>
              <div className="space-y-1 col-span-2">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Body</div>
                <div className="text-sm text-slate-900 font-medium">-</div>
              </div>
            </>
          )}

          {connectionType === 'DB' && (
            <>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Tên CSDL</div>
                <div className="text-sm text-slate-900 font-medium">HOTICH_PROD</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Tên CSDL gốc</div>
                <div className="text-sm text-slate-900 font-medium">HOTICH_MASTER</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Kiểu CSDL</div>
                <div className="text-sm text-slate-900 font-medium">POSTGRESQL</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Trạm kết nối</div>
                <div className="text-sm text-slate-900 font-medium">Trạm kết nối 1</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Máy chủ thực thi</div>
                <div className="text-sm text-slate-900 font-medium">Máy chủ thực thi 1</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Địa chỉ CSDL</div>
                <div className="text-sm text-slate-900 font-medium">192.168.1.100</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Cổng kết nối</div>
                <div className="text-sm text-slate-900 font-medium">5432</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Tài khoản</div>
                <div className="text-sm text-slate-900 font-medium">admin_db</div>
              </div>
            </>
          )}

          {connectionType === 'FILE' && (
            <>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Tên File CSDL</div>
                <div className="text-sm text-slate-900 font-medium">Data_Export_2024.csv</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Máy chủ thực thi</div>
                <div className="text-sm text-slate-900 font-medium">Máy chủ thực thi 1</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Trạm kết nối</div>
                <div className="text-sm text-slate-900 font-medium">Trạm kết nối 1</div>
              </div>
            </>
          )}

        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-200 mt-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Edit className="w-4 h-4" /> Chỉnh sửa
        </button>
      </div>
    </div>
  )
}

function TabCollection({ service }: any) {
  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
          Cấu hình đồng bộ dữ liệu
        </h3>
        <div className="grid grid-cols-2 gap-x-12 gap-y-8 max-w-4xl">

          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Loại tần suất</div>
            <div className="text-sm text-slate-900 font-medium">Cập nhật</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Lặp lại</div>
            <div className="text-sm text-slate-900 font-medium">Hằng ngày</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Lặp lại trong</div>
            <div className="text-sm text-slate-900 font-medium leading-tight">
              1 ngày
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Thực hiện lúc</div>
            <div className="text-sm text-blue-700 font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              12:00
            </div>
          </div>

          <div className="space-y-1 col-span-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Mô tả tóm lược</div>
            <div className="text-sm text-slate-700 font-medium italic bg-blue-50/50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              Lặp lại mỗi 1 ngày lúc 12:00
            </div>
          </div>

        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-200 mt-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Edit className="w-4 h-4" /> Chỉnh sửa
        </button>
      </div>
    </div>
  )
}

function TabMapping() {
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
      {/* ACTION BUTTONS */}
      <div className="flex justify-start gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition-all shadow-sm active:scale-95">
          <Download className="w-4 h-4" />
          Nạp cấu trúc
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition-all shadow-sm active:scale-95">
          <Edit className="w-4 h-4" />
          Sửa cấu trúc
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition-all shadow-sm active:scale-95">
          <Trash2 className="w-4 h-4" />
          Xóa cấu trúc
        </button>
      </div>

      <div className="flex h-[550px] border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        {/* Left Column: Tables */}
        <div className="w-1/3 border-r border-slate-200 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-200 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm bảng..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
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
                      <div className="text-sm ">{table.name}</div>
                      <div className="text-[11px] opacity-70">{table.label}</div>
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
              <h4 className="font-medium text-slate-800 text-sm">Danh sách trường:</h4>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-mono">{activeTable?.name}</span>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm trường..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-700">Tên trường</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Kiểu dữ liệu</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Allow null</th>
                  <th className="px-4 py-3 font-semibold text-slate-700 text-center">Khóa chính</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Tên hiển thị</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFields.map(field => (
                  <tr key={field.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">{field.name}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[11px] font-mono text-slate-600">
                        {field.dataType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${field.allowNull ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'}`}>
                          {field.allowNull && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {field.isPrimaryKey && (
                        <div className="flex justify-center">
                          <Key className="w-4 h-4 text-amber-500" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-900">{field.displayName}</td>
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
          <select aria-label="Select box" className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200">
            <option>Tất cả trạng thái</option>
            <option>Thành công</option>
            <option>Thất bại</option>
          </select>
          <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
            <input aria-label="Input field" type="text" className="px-3 py-2 text-sm w-28 text-center focus:outline-none border-r border-slate-200" defaultValue="01/04/2025" />
            <div className="px-2 text-slate-400 bg-slate-50 border-r border-slate-200 h-full flex items-center"><Calendar className="w-4 h-4" /></div>
            <input aria-label="Input field" type="text" className="px-3 py-2 text-sm w-28 text-center focus:outline-none" defaultValue="10/04/2025" />
            <div className="px-2 text-slate-400 bg-slate-50 border-l border-slate-200 h-full flex items-center"><Calendar className="w-4 h-4" /></div>
          </div>
        </div>
        <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 font-medium hover:bg-slate-50 transition-colors bg-white">
          Xuất CSV
        </button>
      </div>

      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f8f7f5] text-slate-700 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Thời điểm chạy</th>
              <th className="px-6 py-4 w-[15%]">Trạng thái</th>
              <th className="px-6 py-4">Số bản ghi</th>
              <th className="px-6 py-4">Thời gian xử lý</th>
              <th className="px-6 py-4">Mã lỗi</th>
              <th className="px-6 py-4">Ghi chú</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {historyLogs.map(log => (
              <tr key={log.id}>
                <td className="px-6 py-4 font-mono text-[13px] whitespace-pre-wrap">{log.runTime}</td>
                <td className="px-6 py-4">
                  {log.status === 'success' ? (
                    <span className="px-2.5 py-1 text-[13px] bg-[#e8f5e9] text-[#2e7d32] rounded font-medium border border-[#c8e6c9]">Thành công</span>
                  ) : log.status === 'partial_success' ? (
                    <span className="px-2.5 py-1 text-[13px] bg-amber-50 text-amber-700 rounded font-medium border border-amber-200">Một phần</span>
                  ) : (
                    <span className="px-2.5 py-1 text-[13px] bg-[#feeceb] text-[#d32f2f] rounded font-medium border border-[#ffcdd2]">Thất bại</span>
                  )}
                </td>
                <td className="px-6 py-4 font-mono">{log.records}</td>
                <td className="px-6 py-4 whitespace-pre-wrap">{log.duration}</td>
                <td className={`px-6 py-4 ${log.errorCode !== '—' ? 'text-[#d32f2f] underline cursor-pointer hover:font-medium' : 'text-slate-400'}`}>
                  {log.errorCode}
                </td>
                <td className={`px-6 py-4 ${log.status === 'error' ? 'text-[#d32f2f]' : ''}`}>
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
        <div className="flex items-center gap-2 ml-auto z-20 absolute right-8 -mt-2">
          <button className="px-4 py-2 border border-slate-300 rounded text-sm text-slate-600 bg-white hover:bg-slate-50 font-medium">Trang trước</button>
          <button className="px-4 py-2 border border-slate-900 rounded text-sm text-white bg-slate-900 font-medium">1</button>
          <button className="px-4 py-2 border border-slate-300 rounded text-sm text-slate-600 bg-white hover:bg-slate-50 font-medium">2</button>
          <button className="px-4 py-2 border border-slate-300 rounded text-sm text-slate-600 bg-white hover:bg-slate-50 font-medium">3</button>
          <button className="px-4 py-2 border border-slate-300 rounded text-sm text-slate-600 bg-white hover:bg-slate-50 font-medium">Trang sau</button>
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
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowRight className="w-5 h-5 rotate-180" />
        </button>
        <div>
          <h3 className="text-base font-medium text-slate-800">Chi tiết dữ liệu lỗi - Đợt chạy {log?.runTime.replace('\n', ' ')}</h3>
          <p className="text-sm text-slate-500">Mã lỗi: {log?.errorCode} &mdash; {log?.status === 'partial_success' ? 'Hoàn thành một phần' : 'Thất bại'}</p>
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
                <h4 className="font-semibold text-slate-800 text-sm">Bản ghi thiếu trường bắt buộc</h4>
                <p className="text-xs text-slate-500">2 bản ghi bị từ chối do thiếu dữ liệu mapping</p>
              </div>
            </div>
            <button className="px-4 py-2 border border-slate-300 bg-white rounded text-sm text-slate-700 font-medium hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-all focus:ring-2 focus:ring-slate-200">
              <Download className="w-4 h-4" /> Xuất File Lỗi
            </button>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f8f7f5] text-slate-700 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 w-1/4">Record ID</th>
                  <th className="px-4 py-3 w-1/2">Dữ liệu gốc (Raw)</th>
                  <th className="px-4 py-3">Trường bị thiếu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {missingRecords.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{rec.id}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600 bg-slate-50 p-2 rounded block mx-2 my-2 border border-slate-100">{rec.raw}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {rec.missing.map(m => (
                          <span key={m} className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-xs font-mono font-medium shadow-sm">{m}</span>
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
                <h4 className="font-semibold text-slate-800 text-sm">Phát hiện dữ liệu mới / thay đổi</h4>
                <p className="text-xs text-slate-500">Một vài bản ghi trả về các trường dữ liệu bị thay đổi cấu trúc, không khớp với sơ đồ hiện tại</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-slate-300 bg-white rounded text-sm text-slate-700 font-medium hover:bg-slate-50 shadow-sm transition-all focus:ring-2 focus:ring-slate-200">
                Bỏ qua
              </button>
              <button onClick={onGoToMapping} className="px-4 py-2 bg-blue-600 rounded text-sm text-white font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-all focus:ring-2 focus:ring-blue-500">
                <Shield className="w-4 h-4" /> Cấu hình ánh xạ ngay
              </button>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden bg-[#fbfaf9] shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#fef7ec] text-[#bd6a1f] font-medium border-b border-[#fce8ce]">
                <tr>
                  <th className="px-4 py-3 w-1/3">Tên trường mới phát hiện</th>
                  <th className="px-4 py-3">Định dạng suy đoán</th>
                  <th className="px-4 py-3">Giá trị mẫu</th>
                  <th className="px-4 py-3">Số bản ghi ảnh hưởng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {unmappedFields.map(f => (
                  <tr key={f.fieldName} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-[13px] text-slate-800 font-medium">{f.fieldName}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 border rounded text-slate-500 font-mono text-[11px] bg-slate-50 font-medium">{f.type}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 italic">"{f.sample}"</td>
                    <td className="px-4 py-3 text-slate-600">{f.affectedRecords} bản ghi</td>
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
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Nhật ký thay đổi thiết lập kết nối</h3>
      </div>

      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#f8f7f5] text-slate-600 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Thời điểm</th>
              <th className="px-6 py-4">Người thực hiện</th>
              <th className="px-6 py-4 w-[15%]">Loại thay đổi</th>
              <th className="px-6 py-4 w-1/2">Mô tả thay đổi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentItems.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-[13px]">{log.time}</td>
                <td className="px-6 py-4 text-slate-700">{log.user}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-[12px] rounded font-medium border ${getTypeStyle(log.type)}`}>
                    {log.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 whitespace-normal leading-relaxed">{log.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination control */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-slate-500">
          Hiển thị bản ghi <span className="font-medium">{startIndex + 1}</span> - <span className="font-medium">{Math.min(startIndex + itemsPerPage, changelogs.length)}</span> trong tổng số <span className="font-medium">{changelogs.length}</span>
        </div>
        <div className="flex items-center gap-2 ml-auto z-20">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-slate-300 rounded text-sm text-slate-600 bg-white hover:bg-slate-50 font-medium disabled:opacity-50"
          >
            Trang trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 border rounded text-sm font-medium ${currentPage === page ? 'border-slate-900 text-white bg-slate-900' : 'border-slate-300 text-slate-600 bg-white hover:bg-slate-50'}`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-slate-300 rounded text-sm text-slate-600 bg-white hover:bg-slate-50 font-medium disabled:opacity-50"
          >
            Trang sau
          </button>
        </div>
      </div>
    </div>
  );
}
