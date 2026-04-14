import React, { useState } from 'react';
import { 
  X, CheckCircle, Search, Calendar, Eye, Activity, Shield, FileText, Download,
  ArrowRight, ExternalLink, RefreshCw, ChevronDown, User, Plug, Settings, Database, Clock
} from 'lucide-react';

interface ViewServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: any;
}

type TabType = 'general' | 'contact' | 'connection' | 'collection' | 'mapping' | 'history';

export function ViewServiceModal({ isOpen, onClose, service }: ViewServiceModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [showApiKey, setShowApiKey] = useState(false);

  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 flex overflow-y-auto bg-black/50 py-10 px-4 items-start">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl mx-auto flex flex-col flex-shrink-0 mb-auto overflow-hidden">
        
        {/* HEADER */}
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-slate-500">Danh sách dịch vụ / Chi tiết dịch vụ</div>
            <div className="flex items-center gap-2">
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full ml-2">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-3 leading-tight max-w-lg">API dịch vụ dữ liệu quốc tịch</h1>
          
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 mb-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> Đang hoạt động
            </span>
            <span className="text-slate-300">•</span>
            <span>Cục Hộ tịch, Quốc tịch, Chứng thực</span>
            <span className="text-slate-300">•</span>
            <span>RESTful API</span>
            <span className="text-slate-300">•</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200 text-xs">Bảo mật: Nội bộ</span>
          </div>
          
          <div className="text-sm text-slate-500">Cập nhật: 10/04/2025 09:14</div>
        </div>

        {/* KPI CARDS */}
        <div className="px-8 pb-6 grid grid-cols-4 gap-4">
          <div className="bg-white border text-left border-slate-200 p-4 rounded-xl shadow-sm">
            <p className="text-sm text-slate-500 mb-2">Lần chạy gần nhất</p>
            <p className="text-2xl font-bold text-slate-900">10/04/2025</p>
            <p className="text-sm text-slate-500 mt-1">09:00 — <span className="text-slate-700">Thành công</span></p>
          </div>
          <div className="bg-white border text-left border-slate-200 p-4 rounded-xl shadow-sm">
            <p className="text-sm text-slate-500 mb-2">Tổng bản ghi đã đồng bộ</p>
            <p className="text-2xl font-bold text-emerald-600">1,248,302</p>
            <p className="text-sm text-slate-500 mt-1">+4,218 trong 24h qua</p>
          </div>
          <div className="bg-white border text-left border-slate-200 p-4 rounded-xl shadow-sm">
            <p className="text-sm text-slate-500 mb-2">Tỷ lệ thành công (30 ngày)</p>
            <p className="text-2xl font-bold text-emerald-600 mb-2">98.6%</p>
            <div className="w-full bg-slate-100 rounded-full h-1.5 relative overflow-hidden">
               <div className="bg-emerald-600 h-1.5 absolute left-0 top-0" style={{ width: '98.6%' }}></div>
               <div className="bg-red-500 h-1.5 absolute right-0 top-0" style={{ width: '1.4%' }}></div>
            </div>
          </div>
          <div className="bg-white border text-left border-slate-200 p-4 rounded-xl shadow-sm">
             <p className="text-sm text-slate-500 mb-2">Lần lỗi gần nhất</p>
             <p className="text-2xl font-bold text-slate-900">03/04/2025</p>
             <p className="text-sm text-red-600 mt-1">D-04 — Timeout đọc dữ liệu</p>
          </div>
        </div>

        {/* TABS HEADER */}
        <div className="flex border-b border-gray-200 px-8">
          {[
            { id: 'general', label: 'Thông tin chung', icon: FileText },
            { id: 'contact', label: 'Đơn vị cung cấp', icon: User },
            { id: 'connection', label: 'Cấu hình kết nối', icon: Plug },
            { id: 'collection', label: 'Cấu hình thu thập', icon: Settings },
            { id: 'mapping', label: 'Ánh xạ dữ liệu', icon: Database },
            { id: 'history', label: 'Lịch sử kết nối', icon: Clock }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* TABS CONTENT */}
        <div className="px-8 py-8 flex-1 bg-white">
           {activeTab === 'general' && <TabGeneral />}
           {activeTab === 'contact' && <TabContact />}
           {activeTab === 'connection' && <TabConnection showApiKey={showApiKey} setShowApiKey={setShowApiKey} />}
           {activeTab === 'collection' && <TabCollection />}
           {activeTab === 'mapping' && <TabMapping />}
           {activeTab === 'history' && <TabHistory />}
        </div>

      </div>
    </div>
  );
}

// ------ TAB COMPONENTS ------

function TabGeneral() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 pb-2 border-b border-slate-100">Thông tin dịch vụ</h3>
        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
          
          <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
            <div className="text-sm text-slate-600">Tên service</div>
            <div className="col-span-2 text-sm text-slate-900 font-medium">API dịch vụ dữ liệu quốc tịch</div>
          </div>
          <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
            <div className="text-sm text-slate-600">Mức độ bảo mật</div>
            <div className="col-span-2">
              <span className="px-2.5 py-1 text-xs bg-blue-100 text-blue-700 rounded font-medium">Nội bộ</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
            <div className="text-sm text-slate-600">Tên đơn vị</div>
            <div className="col-span-2 text-sm text-slate-900 font-medium">Cục Hộ tịch, Quốc tịch, Chứng thực</div>
          </div>
          <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
             <div className="text-sm text-slate-600">Trạng thái</div>
             <div className="col-span-2">
               <span className="px-2.5 py-1 text-xs bg-green-100 text-green-700 rounded font-medium">Đang hoạt động</span>
             </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
            <div className="text-sm text-slate-600">Hệ thống</div>
            <div className="col-span-2 text-sm text-slate-900 font-medium">HTTT Quản lý Quốc tịch v2.1</div>
          </div>
          <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
             <div className="text-sm text-slate-600">Ngày tạo</div>
             <div className="col-span-2 text-sm text-slate-900 font-medium">01/03/2025 &mdash; Nguyễn Văn Admin</div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
            <div className="text-sm text-slate-600">Nguồn thu thập</div>
            <div className="col-span-2 text-sm text-slate-900 font-medium">Cục Hộ tịch, Quốc tịch, Chứng thực</div>
          </div>
          <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
             <div className="text-sm text-slate-600">Cập nhật lần cuối</div>
             <div className="col-span-2 text-sm text-slate-900 font-medium">10/04/2025 09:14</div>
          </div>

          <div className="grid grid-cols-3 gap-4 col-span-2">
            <div className="text-sm text-slate-600">Mô tả</div>
            <div className="col-span-2 text-sm text-slate-900 leading-relaxed font-medium">
               Dịch vụ thu thập dữ liệu quốc tịch từ hệ thống quản lý hộ tịch của Cục Hộ tịch, phục vụ tra cứu và tổng hợp báo cáo tại CSDL Bộ Tư pháp. Đồng bộ định kỳ hàng ngày lúc 09:00.
            </div>
          </div>

        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 pb-2 border-b border-slate-100">Văn bản đính kèm</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-2 bg-white shadow-sm hover:shadow transition-shadow cursor-pointer">
            <FileText className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-700 font-medium">QĐ_Ketno_QuocTich_2025.pdf</span>
            <span className="text-xs text-slate-400">245 KB</span>
          </div>
          <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-2 bg-white shadow-sm hover:shadow transition-shadow cursor-pointer">
            <FileText className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-700 font-medium">BienBan_Nghiemthu_API.docx</span>
            <span className="text-xs text-slate-400">118 KB</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabContact() {
  return (
    <div className="animate-in fade-in duration-300">
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 pb-2 border-b border-slate-100">Thông tin đơn vị cung cấp dữ liệu</h3>
      <div className="grid grid-cols-2 gap-x-12 gap-y-6 max-w-4xl">
        
        <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
          <div className="text-sm text-slate-600">Tên đơn vị</div>
          <div className="col-span-2 text-sm text-slate-900 font-medium">Cục Hộ tịch, Quốc tịch, Chứng thực</div>
        </div>
        <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
          <div className="text-sm text-slate-600">Địa chỉ email</div>
          <div className="col-span-2 text-sm text-slate-900 font-medium">hotich@moj.gov.vn</div>
        </div>

        <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
          <div className="text-sm text-slate-600">Địa chỉ</div>
          <div className="col-span-2 text-sm text-slate-900 font-medium leading-relaxed">60 Trần Phú, Ba Đình,<br/>Hà Nội</div>
        </div>
        <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
          <div className="text-sm text-slate-600">Người đầu mối kỹ thuật</div>
          <div className="col-span-2 text-sm text-slate-900 font-medium leading-relaxed">Nguyễn Văn A &mdash;<br/>0987 654 321</div>
        </div>

        <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
          <div className="text-sm text-slate-600">Số điện thoại</div>
          <div className="col-span-2 text-sm text-slate-900 font-medium">024 3733 9999</div>
        </div>
        <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
           <div className="text-sm text-slate-600">Ghi chú</div>
           <div className="col-span-2 text-sm text-slate-900 font-medium leading-relaxed">Liên hệ qua email trước khi gọi điện trong giờ hành chính.</div>
        </div>

      </div>
    </div>
  );
}

function TabConnection({ showApiKey, setShowApiKey }: any) {
  return (
    <div className="animate-in fade-in duration-300 space-y-8">
      {/* SUCCESS BANNER */}
      <div className="bg-[#e8f5e9] border border-[#a5d6a7] rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#2e7d32] font-semibold text-sm">
          <div className="w-2 h-2 rounded-full bg-[#2e7d32]"></div> 
          Kết nối đang hoạt động tốt
        </div>
        <div className="text-[#388e3c] text-sm font-medium">Kiểm tra lần cuối: 10/04/2025 09:00 &mdash; 142ms</div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 pb-2 border-b border-slate-100">Cấu hình RESTful API</h3>
        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
          
          <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
            <div className="text-sm text-slate-600">Phương thức kết nối</div>
            <div className="col-span-2 text-sm text-slate-900 font-medium">RESTful API</div>
          </div>
          <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
            <div className="text-sm text-slate-600">Loại API</div>
            <div className="col-span-2 text-sm text-slate-900 font-medium">API KEY</div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
            <div className="text-sm text-slate-600 items-center flex">Base URL</div>
            <div className="col-span-2 text-sm text-slate-900 font-mono font-medium truncate">https://api.hotich.moj.gov.vn</div>
          </div>
          <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
            <div className="text-sm text-slate-600 items-center flex">Header Name</div>
            <div className="col-span-2 text-sm text-slate-900 font-mono font-medium">X-API-Key</div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
             <div className="text-sm text-slate-600 items-center flex">Content Type</div>
             <div className="col-span-2 text-sm text-slate-900 font-mono font-medium">application/json</div>
          </div>
          <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4 items-center">
             <div className="text-sm text-slate-600">API Key</div>
             <div className="col-span-2 flex items-center gap-3">
               <span className="font-mono text-xl tracking-widest leading-none mt-1 text-slate-700">
                  {showApiKey ? "A5D9-2X8K-Q7P1-B9M4" : "••••••••••••••••"}
               </span>
               <button 
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="px-3 py-1 border border-slate-300 rounded text-xs font-medium bg-white text-slate-700 hover:bg-slate-50">
                 {showApiKey ? 'Ẩn' : 'Hiện'}
               </button>
             </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
             <div className="text-sm text-slate-600 items-center flex">Method</div>
             <div className="col-span-2 text-sm text-slate-900 font-mono font-medium">GET</div>
          </div>
          <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
             <div className="text-sm text-slate-600">Timeout (ms)</div>
             <div className="col-span-2 text-sm text-slate-900 font-medium">5000</div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
             <div className="text-sm text-slate-600 items-center flex">Endpoint Path</div>
             <div className="col-span-2 text-sm text-slate-900 font-mono font-medium">/api/v1/quoctich</div>
          </div>
          <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
             <div className="text-sm text-slate-600">Page Size</div>
             <div className="col-span-2 text-sm text-slate-900 font-medium">200</div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
             <div className="text-sm text-slate-600 items-center flex">Query Parameters</div>
             <div className="col-span-2 text-sm text-slate-900 font-mono font-medium">fromDate, toDate, pageSize</div>
          </div>
          <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
             <div className="text-sm text-slate-600">HTTP Success Codes</div>
             <div className="col-span-2 text-sm text-slate-900 font-mono font-medium">200, 201</div>
          </div>

          <div></div>
          <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
             <div className="text-sm text-slate-600">Số lần thử lại</div>
             <div className="col-span-2 text-sm text-slate-900 font-medium">3 lần &mdash; cách 5 phút</div>
          </div>

          <div></div>
          <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
             <div className="text-sm text-slate-600 items-center flex">SSL Required</div>
             <div className="col-span-2 text-sm font-medium">
                <span className="px-2.5 py-1 text-xs bg-green-100 text-green-700 rounded">Bật</span>
             </div>
          </div>

        </div>
        <div className="flex justify-center mt-6">
           <button className="p-2 bg-white border border-slate-200 rounded-full text-slate-500 shadow-sm hover:shadow hover:bg-slate-50 transition-all">
              <ChevronDown className="w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  )
}

function TabCollection() {
  return (
    <div className="animate-in fade-in duration-300 space-y-8 max-w-4xl">
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 pb-2 border-b border-slate-100">Cấu hình đồng bộ dữ liệu</h3>
        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
          
          <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4 items-start">
            <div className="text-sm text-slate-600 pt-0.5">Phương thức đồng bộ</div>
            <div className="col-span-2 text-sm text-slate-900 font-medium leading-tight">Incremental &mdash; theo watermark</div>
          </div>
          <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
            <div className="text-sm text-slate-600">Lần chạy kế tiếp</div>
            <div className="col-span-2 text-sm text-slate-900 font-medium text-blue-700">11/04/2025 09:00</div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
            <div className="text-sm text-slate-600">Tần suất thu thập</div>
            <div className="col-span-2 text-sm text-slate-900 font-medium">Hàng ngày &mdash; 09:00</div>
          </div>
          <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
            <div className="text-sm text-slate-600">Batch size</div>
            <div className="col-span-2 text-sm text-slate-900 font-medium">1,000 bản ghi/lần</div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
            <div className="text-sm text-slate-600">Watermark column</div>
            <div className="col-span-2 text-sm text-slate-900 font-mono font-medium">updated_at</div>
          </div>
          <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4">
            <div className="text-sm text-slate-600">Thông báo lỗi</div>
            <div className="col-span-2 text-sm text-slate-900 font-medium">admin@moj.gov.vn</div>
          </div>

        </div>

        <div className="mt-6 bg-[#e3f2fd] border border-[#bbdefb] text-[#1976d2] p-4 rounded-lg text-sm">
           Lưu ý: Lịch thu thập sẽ tự động chạy theo cấu hình. Hệ thống sẽ gửi thông báo khi có lỗi xảy ra trong quá trình thu thập.
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 pb-2 border-b border-slate-100">Kiểm tra kết nối thủ công</h3>
        <div className="flex items-center gap-6">
           <button className="px-5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 hover:shadow-sm transition-all focus:ring-2 focus:ring-slate-200">
             Kiểm tra kết nối ngay
           </button>
           <div className="flex items-center gap-4 text-sm text-slate-700">
             <span>Chế độ Mockup:</span>
             <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="mockupMode" className="w-4 h-4 text-slate-900 focus:ring-slate-900" defaultChecked />
                Thành công
             </label>
             <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="mockupMode" className="w-4 h-4 text-slate-900 focus:ring-slate-900" />
                Lỗi kết nối
             </label>
             <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="mockupMode" className="w-4 h-4 text-slate-900 focus:ring-slate-900" />
                Lỗi dữ liệu
             </label>
           </div>
        </div>
      </div>
    </div>
  )
}

function TabMapping() {
  const mappings = [
    { src: 'quoctich_id', stype: 'str', arrow: '→', dest: 'ma_quoctich', dtype: 'str', note: 'Khóa chính' },
    { src: 'ho_ten', stype: 'str', arrow: '→', dest: 'ho_ten_day_du', dtype: 'str', note: '' },
    { src: 'ngay_sinh', stype: 'date', arrow: '→', dest: 'ngay_sinh', dtype: 'date', note: 'Format: YYYY-MM-DD' },
    { src: 'quoc_tich', stype: 'str', arrow: '→', dest: 'quoc_tich_hien_tai', dtype: 'str', note: '' },
    { src: 'so_dinh_danh', stype: 'str', arrow: '→', dest: 'cccd_cmnd', dtype: 'str', note: 'Mã hóa tại đích' },
    { src: 'ngay_cap_nhat', stype: 'ts', arrow: '→', dest: 'updated_at', dtype: 'ts', note: 'Watermark field' },
    { src: 'trang_thai', stype: 'str', arrow: '→', dest: 'trang_thai_ho_so', dtype: 'str', note: '' },
    { src: 'ghi_chu_them', stype: 'str', arrow: '—', dest: 'Chưa ánh xạ', dtype: '-', note: 'Cần cấu hình trường đích', unmapped: true },
  ];

  return (
    <div className="animate-in fade-in duration-300">
       <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Cấu hình ánh xạ (8 trường — 7 đã ánh xạ)</h3>
          <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 font-medium hover:bg-slate-50 transition-colors">
            Cập nhật ánh xạ
          </button>
       </div>

       <div className="border border-slate-200 rounded-lg overflow-hidden bg-[#fbfaf9]">
         <table className="w-full text-left text-sm whitespace-nowrap">
           <thead className="bg-[#f8f7f5] text-slate-600 font-medium border-b border-slate-200">
             <tr>
               <th className="px-6 py-4 w-1/5">Trường nguồn</th>
               <th className="px-6 py-4 w-[10%]">Kiểu</th>
               <th className="px-4 py-4 w-[5%] text-center"></th>
               <th className="px-6 py-4 w-1/5">Trường đích</th>
               <th className="px-6 py-4 w-[10%]">Kiểu</th>
               <th className="px-6 py-4">Ghi chú</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {mappings.map((m, idx) => (
               <tr key={idx} className={m.unmapped ? 'bg-[#fef7ec] text-[#bd6a1f]' : 'bg-white'}>
                 <td className="px-6 py-4 font-mono">{m.src}</td>
                 <td className="px-6 py-4">
                   <span className="px-2 border rounded text-slate-500 font-mono text-[11px] bg-slate-50">{m.stype}</span>
                 </td>
                 <td className="px-4 py-4 text-center text-slate-300">{m.arrow}</td>
                 <td className={`px-6 py-4 font-mono ${m.unmapped ? 'italic' : ''}`}>{m.dest}</td>
                 <td className="px-6 py-4">
                   {m.dtype !== '-' && <span className="px-2 border rounded text-slate-500 font-mono text-[11px] bg-slate-50">{m.dtype}</span>}
                 </td>
                 <td className="px-6 py-4 leading-tight whitespace-normal">{m.note}</td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>

       <div className="flex justify-center mt-6">
          <button className="p-2 bg-white border border-slate-200 rounded-full text-slate-500 shadow-sm hover:shadow hover:bg-slate-50 transition-all">
            <ChevronDown className="w-4 h-4" />
          </button>
       </div>
       <div className="text-sm text-slate-500 mt-6">Cập nhật lần cuối: 01/03/2025 &mdash; Nguyễn Văn Admin</div>
    </div>
  )
}

function TabHistory() {
  const historyLogs = [
    { id: 1, runTime: '10/04/2025\n09:00:12', status: 'success', records: '4,218', duration: '1 phút 42 giây', errorCode: '—', note: 'Incremental từ 09/04' },
    { id: 2, runTime: '09/04/2025\n09:00:08', status: 'success', records: '3,901', duration: '1 phút 28 giây', errorCode: '—', note: '' },
    { id: 3, runTime: '08/04/2025\n09:00:15', status: 'success', records: '5,120', duration: '2 phút 01 giây', errorCode: '—', note: '' },
    { id: 4, runTime: '03/04/2025\n09:00:22', status: 'error', records: '0', duration: '5 phút\n(timeout)', errorCode: 'D-04', note: 'Timeout đọc dữ liệu — Retry 3/3 thất bại ↗' },
    { id: 5, runTime: '02/04/2025\n09:00:09', status: 'success', records: '2,847', duration: '58 giây', errorCode: '—', note: '' },
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200">
            <option>Tất cả trạng thái</option>
            <option>Thành công</option>
            <option>Thất bại</option>
          </select>
          <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
            <input type="text" className="px-3 py-2 text-sm w-28 text-center focus:outline-none border-r border-slate-200" defaultValue="01/04/2025" />
            <div className="px-2 text-slate-400 bg-slate-50 border-r border-slate-200 h-full flex items-center"><Calendar className="w-4 h-4" /></div>
            <input type="text" className="px-3 py-2 text-sm w-28 text-center focus:outline-none" defaultValue="10/04/2025" />
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
                  {log.status === 'success' 
                    ? <span className="px-2.5 py-1 text-[13px] bg-[#e8f5e9] text-[#2e7d32] rounded font-medium border border-[#c8e6c9]">Thành công</span>
                    : <span className="px-2.5 py-1 text-[13px] bg-[#feeceb] text-[#d32f2f] rounded font-medium border border-[#ffcdd2]">Thất bại</span>
                  }
                </td>
                <td className="px-6 py-4 font-mono">{log.records}</td>
                <td className="px-6 py-4 whitespace-pre-wrap">{log.duration}</td>
                <td className={`px-6 py-4 ${log.errorCode !== '—' ? 'text-[#d32f2f] underline cursor-pointer hover:font-medium' : 'text-slate-400'}`}>
                  {log.errorCode}
                </td>
                <td className={`px-6 py-4 ${log.status === 'error' ? 'text-[#d32f2f]' : ''}`}>{log.note}</td>
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
