import React, { useState } from 'react';
import { X, Check, FileText, Plug, LayoutTemplate, ShieldCheck, Plus, Trash2, Code, Key, Copy, Eye, EyeOff } from 'lucide-react';

interface ProvisionServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: any;
}

type TabType = 'general' | 'protocol' | 'packet' | 'access';

export function ProvisionServiceModal({ isOpen, onClose, service }: ProvisionServiceModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [accessScope, setAccessScope] = useState('all');
  
  // States for packet design (Tab 3)
  const [format, setFormat] = useState('json');
  const [fields, setFields] = useState([
    { id: 1, name: 'id', type: 'string', description: 'Mã định danh', isMasked: false, maskRule: '' },
    { id: 2, name: 'thoi_gian', type: 'datetime', description: 'Thời gian cập nhật', isMasked: false, maskRule: '' },
    { id: 3, name: 'so_dien_thoai', type: 'string', description: 'Số điện thoại', isMasked: true, maskRule: 'hide_middle_4' }
  ]);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(true);
  const [rateLimitValue, setRateLimitValue] = useState(100);

  if (!isOpen) return null;

  const tabs = [
    { id: 'general' as TabType, label: 'Thông tin chung', icon: <FileText className="w-4 h-4" /> },
    { id: 'protocol' as TabType, label: 'Cấu hình API & Giao thức', icon: <Plug className="w-4 h-4" /> },
    { id: 'packet' as TabType, label: 'Thiết kế cấu trúc gói tin', icon: <LayoutTemplate className="w-4 h-4" /> },
    { id: 'access' as TabType, label: 'Phân quyền truy cập', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(service ? 'Cập nhật dịch vụ thành công!' : 'Khởi tạo dịch vụ cung cấp thành công!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">
            {service ? 'Chi tiết dịch vụ cung cấp' : 'Tạo mới dịch vụ cung cấp dữ liệu'}
          </h2>
          <button title="Đóng" aria-label="Đóng"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex gap-1 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm transition-colors relative flex items-center gap-2 ${
                  activeTab === tab.id ? 'text-amber-600 bg-white font-medium' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600" />}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {/* TAB 1: Thông tin chung */}
          {activeTab === 'general' && (
            <div className="space-y-4 max-w-3xl mx-auto bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Thông tin cơ bản</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tên dịch vụ <span className="text-red-500">*</span></label>
                  <input aria-label="Trường nhập liệu" title="Tên dịch vụ"
                    type="text"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    placeholder="Nhập tên dịch vụ..."
                    defaultValue={service ? service.name : ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mã dịch vụ <span className="text-red-500">*</span></label>
                  <input aria-label="Trường nhập liệu" title="Mã dịch vụ"
                    type="text"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono text-sm"
                    placeholder="Ví dụ: DV_001..."
                    defaultValue={service ? service.code : ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Loại dữ liệu <span className="text-red-500">*</span></label>
                  <select aria-label="Tùy chọn" title="Loại dữ liệu" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500">
                    <option value="">Chọn nhóm dữ liệu</option>
                    <option value="ho_tich">Dữ liệu Hộ tịch điện tử</option>
                    <option value="quoc_tich">Dữ liệu Hồ sơ quốc tịch</option>
                    <option value="thi_hanh_an">Dữ liệu Thi hành án dân sự</option>
                    <option value="ly_lich">Dữ liệu Lý lịch tư pháp</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả</label>
                  <textarea title="Mô tả" aria-label="Mô tả"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    rows={4}
                    placeholder="Mô tả chi tiết về dịch vụ cung cấp dữ liệu này..."
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Cấu hình API & Giao thức */}
          {activeTab === 'protocol' && (
             <div className="space-y-4 max-w-3xl mx-auto bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Cấu hình kết nối & Giao thức</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Giao thức kết nối <span className="text-red-500">*</span></label>
                  <select aria-label="Tùy chọn" title="Giao thức" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500">
                    <option value="rest">REST API (JSON)</option>
                    <option value="soap">SOAP API (XML)</option>
                    <option value="file">File Transfer (FTP/SFTP)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tần suất cung cấp</label>
                  <select aria-label="Tùy chọn" title="Tần suất" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500">
                    <option value="realtime">Thời gian thực (Real-time)</option>
                    <option value="daily">Đồng bộ hàng ngày (Daily Batch)</option>
                    <option value="weekly">Đồng bộ hàng tuần (Weekly Batch)</option>
                    <option value="on_demand">Truy vấn theo yêu cầu (On-demand)</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mức độ bảo mật dữ liệu</label>
                  <select aria-label="Tùy chọn" title="Mức độ bảo mật" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500">
                    <option value="open">Dữ liệu mở (Open Data)</option>
                    <option value="internal">Dữ liệu nội bộ (Internal)</option>
                    <option value="restricted">Dữ liệu hạn chế (Restricted)</option>
                    <option value="secret">Dữ liệu nhạy cảm/Tuyệt mật (Secret)</option>
                  </select>
                </div>
                <div className="md:col-span-2 pt-4 border-t border-slate-100 mt-2 space-y-4">
                   <div className="flex items-start justify-between">
                     <label className="flex items-start gap-3 cursor-pointer">
                      <div className="mt-0.5">
                        <input aria-label="Rate limit" type="checkbox" title="Rate limit" className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4" checked={isRateLimited} onChange={(e) => setIsRateLimited(e.target.checked)} />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-900">Giới hạn truy cập (Rate Limit)</span>
                        <p className="text-xs text-slate-500 mt-0.5">Chống quá tải hệ thống bằng cách giới hạn số lượng request API</p>
                      </div>
                    </label>
                    {isRateLimited && (
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          title="Số lượng request mỗi phút"
                          placeholder="Số lượng"
                          className="w-20 px-3 py-1.5 border border-slate-300 rounded-lg text-sm text-center" 
                          value={rateLimitValue} 
                          onChange={(e) => setRateLimitValue(Number(e.target.value))} 
                        />
                        <span className="text-sm text-slate-600 font-medium">req / phút</span>
                      </div>
                    )}
                   </div>

                   <label className="flex items-start gap-3 cursor-pointer">
                    <div className="mt-0.5">
                      <input aria-label="Auto Swagger" type="checkbox" title="Auto Swagger" className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4" defaultChecked />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-900">Tự động sinh tài liệu tích hợp API (Swagger/OpenAPI)</span>
                      <p className="text-xs text-slate-500 mt-0.5">Hệ thống sẽ tự động tạo trang tài liệu chuẩn Swagger kèm mã mẫu (cURL, Postman) cho đối tác</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Thiết kế cấu trúc gói tin */}
          {activeTab === 'packet' && (
             <div className="space-y-6 max-w-4xl mx-auto">
               <div className="bg-white p-5 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-slate-800">Định nghĩa cấu trúc dữ liệu trả về (Response Payload)</h4>
                  <button title="Thêm trường" aria-label="Thêm trường" className="flex items-center text-sm text-amber-600 font-medium hover:text-amber-700">
                    <Plus className="w-4 h-4 mr-1" /> Thêm trường
                  </button>
                </div>
                
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-4 py-2 rounded-l-lg font-medium">Tên trường (Field)</th>
                      <th className="px-4 py-2 font-medium">Kiểu dữ liệu</th>
                      <th className="px-4 py-2 font-medium">Mô tả</th>
                      <th className="px-4 py-2 font-medium text-center">Che dấu (Masking)</th>
                      <th className="px-4 py-2 font-medium">Quy tắc che dấu</th>
                      <th className="px-4 py-2 rounded-r-lg font-medium w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {fields.map(field => (
                      <tr key={field.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3"><input placeholder="..." title="Tên trường" aria-label="Tên trường" type="text" className="w-full px-2 py-1 bg-white border border-slate-200 rounded" defaultValue={field.name} /></td>
                        <td className="px-4 py-3">
                          <select title="Kiểu dữ liệu" aria-label="Kiểu dữ liệu" className="w-full px-2 py-1 bg-white border border-slate-200 rounded" defaultValue={field.type}>
                            <option value="string">String</option>
                            <option value="number">Number</option>
                            <option value="boolean">Boolean</option>
                            <option value="datetime">DateTime</option>
                          </select>
                        </td>
                        <td className="px-4 py-3"><input placeholder="..." title="Mô tả" aria-label="Mô tả" type="text" className="w-full px-2 py-1 bg-white border border-slate-200 rounded" defaultValue={field.description} /></td>
                        <td className="px-4 py-3 text-center">
                          <input type="checkbox" title="Che dấu dữ liệu" className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer" defaultChecked={field.isMasked} />
                        </td>
                        <td className="px-4 py-3">
                          <select title="Quy tắc" aria-label="Quy tắc" className={`w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs ${!field.isMasked && 'opacity-50 bg-slate-50'}`} disabled={!field.isMasked} defaultValue={field.maskRule}>
                            <option value="">-- Chọn quy tắc --</option>
                            <option value="hide_middle_4">Ẩn 4 ký tự giữa (***)</option>
                            <option value="hide_last_4">Ẩn 4 ký tự cuối (***)</option>
                            <option value="hash">Băm chuỗi (SHA-256)</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button title="Xóa" aria-label="Xóa" className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-white p-5 rounded-lg border border-slate-200">
                <h4 className="font-medium text-slate-800 mb-4 flex items-center">
                  <Code className="w-4 h-4 mr-2 text-slate-500" />
                  Cấu trúc mẫu (JSON Preview)
                </h4>
                <pre className="bg-slate-800 text-slate-300 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "thoi_gian": "2026-05-04T10:00:00Z",
  "...": "..."
}`}
                </pre>
              </div>
             </div>
          )}

          {/* TAB 4: Phân quyền truy cập */}
          {activeTab === 'access' && (
            <div className="space-y-4 max-w-3xl mx-auto bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Cấu hình bảo mật & Phân quyền</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Chính sách chia sẻ <span className="text-red-500">*</span></label>
                  <select aria-label="Tùy chọn" title="Chính sách chia sẻ" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500">
                    <option value="public">Công khai (Public API)</option>
                    <option value="restricted">Hạn chế (Restricted API)</option>
                    <option value="internal">Nội bộ (Internal Service)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phạm vi truy cập <span className="text-red-500">*</span></label>
                  <select aria-label="Tùy chọn" title="Phạm vi truy cập"
                    value={accessScope}
                    onChange={(e) => setAccessScope(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="all">Toàn bộ tổ chức, doanh nghiệp, công dân</option>
                    <option value="gov">Các cơ quan nhà nước, Bộ, Ngành</option>
                    <option value="internal">Nội bộ hệ thống nền tảng</option>
                    <option value="specific">Người / Tổ chức cụ thể</option>
                  </select>
                </div>
                
                  <div className="md:col-span-2 space-y-4">
                    <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <label className="block text-sm font-medium text-amber-900">Cấp phát API Key / Token truy cập <span className="text-red-500">*</span></label>
                        <button type="button" onClick={() => setApiKey('dldc_live_9f8e7d6c5b4a3f2e1d0c')} className="text-xs bg-amber-600 text-white px-3 py-1.5 rounded hover:bg-amber-700 flex items-center font-medium shadow-sm transition-colors">
                          <Key className="w-3 h-3 mr-1.5" /> Khởi tạo Token mới
                        </button>
                      </div>
                      
                      <div className="relative mb-3">
                        <input aria-label="API Key" title="API Key"
                          type={showKey ? "text" : "password"}
                          readOnly
                          value={apiKey || '••••••••••••••••••••••••••••••••'}
                          className="w-full px-4 py-2.5 bg-white border border-amber-200 rounded-lg focus:outline-none font-mono text-sm text-slate-700 pr-20"
                        />
                        <div className="absolute right-2 top-1.5 flex items-center gap-1">
                          <button type="button" onClick={() => setShowKey(!showKey)} className="p-1.5 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded transition-colors" title={showKey ? "Ẩn" : "Hiện"}>
                            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button type="button" onClick={() => {if(apiKey) alert('Đã copy!')}} className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 rounded transition-colors" title="Sao chép">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-medium text-amber-800 mb-1">Thời hạn truy cập (Expiration)</label>
                           <input aria-label="Expiration" title="Expiration" type="date" className="w-full px-3 py-2 bg-white border border-amber-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50" defaultValue="2026-12-31" />
                        </div>
                        <div>
                           <label className="block text-xs font-medium text-amber-800 mb-1">IP Whitelist (Tùy chọn)</label>
                           <input aria-label="IP Whitelist" title="IP Whitelist" type="text" placeholder="192.168.1.1, 10.0.0.0/24" className="w-full px-3 py-2 bg-white border border-amber-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 placeholder:text-amber-200" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Ghi chú đối tác</label>
                      <textarea aria-label="Ghi chú" title="Ghi chú"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        rows={2}
                        placeholder="Ví dụ: Cấp cho Công ty TNHH Phần mềm XYZ phục vụ tra cứu hộ tịch..."
                      ></textarea>
                    </div>
                  </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50 shrink-0 rounded-b-xl">
           <div className="text-sm text-slate-500 font-medium flex items-center">
             {activeTab === 'general' && 'Bước 1 / 4'}
             {activeTab === 'protocol' && 'Bước 2 / 4'}
             {activeTab === 'packet' && 'Bước 3 / 4'}
             {activeTab === 'access' && 'Bước 4 / 4'}
           </div>
           <div className="flex items-center gap-3">
            <button title="Hủy bỏ" aria-label="Hủy bỏ"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Hủy bỏ
            </button>
            {activeTab !== 'access' ? (
              <button 
                title="Tiếp tục" aria-label="Tiếp tục"
                onClick={() => {
                  const currentIndex = tabs.findIndex(t => t.id === activeTab);
                  if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1].id);
                }} 
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors font-medium"
              >
                Tiếp tục
              </button>
            ) : (
              <button title="Lưu & Gửi phê duyệt" aria-label="Lưu & Gửi phê duyệt"
                onClick={handleSubmit}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center transition-colors font-medium shadow-sm"
              >
                <Check className="w-5 h-5 mr-2" />
                {service ? 'Cập nhật dịch vụ' : 'Khởi tạo dịch vụ'}
              </button>
            )}
           </div>
        </div>
      </div>
    </div>
  );
}
