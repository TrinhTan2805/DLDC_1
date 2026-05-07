import * as React from 'react';
import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, AlertTriangle, Send, Download, Eye, Lock, EyeOff, SquarePen, X } from 'lucide-react';



export interface ProcessingDatasetItem {
  id: string;
  name: string;
  code?: string;
}

export interface GenericProcessingPageProps {
  systemName: string;
  datasets: ProcessingDatasetItem[];
}

export function GenericProcessingPage({ systemName, datasets }: GenericProcessingPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDatasetQuery, setSearchDatasetQuery] = useState('');
  const [activeServiceId, setActiveServiceId] = useState(datasets[0]?.id || '');
  const [activeTab, setActiveTab] = useState('clean');
  const [isSendPopupOpen, setIsSendPopupOpen] = useState(false);
  const [isEditClassifyModalOpen, setIsEditClassifyModalOpen] = useState(false);
  const [expandedSidebarGroups, setExpandedSidebarGroups] = useState<Record<string, boolean>>({ 'CSDL Hộ tịch điện tử': true });
  const toggleSidebarGroup = (groupName: string) => {
    setExpandedSidebarGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const [expandedRules, setExpandedRules] = useState<Record<string, boolean>>({
    'clean-4': true,
    'std-1': true,
    'trans-1': true
  });
  const [appliedRules, setAppliedRules] = useState<Record<string, boolean>>({
    'clean-4': true,
    'std-1': true,
    'trans-1': true
  });

  const toggleRuleExpansion = (ruleId: string) => {
    setExpandedRules(prev => ({ ...prev, [ruleId]: !prev[ruleId] }));
  };

  const toggleRuleApplication = (ruleId: string, e: any) => {
    e.stopPropagation();
    setAppliedRules(prev => ({ ...prev, [ruleId]: !prev[ruleId] }));
  };

  const RuleAccordion = ({ id, title, children }: { id: string, title: string, children?: React.ReactNode }) => {
    const isExpanded = !!expandedRules[id];
    const isApplied = !!appliedRules[id];

    return (
      <div className={`mb-4 w-full rounded-lg border ${isApplied ? 'border-green-300 bg-[#f4fbf7]' : 'border-slate-200 bg-white'}`}>
        <div
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => toggleRuleExpansion(id)}
        >
          <div className="flex items-center gap-3">
            <h4 className="text-[15px] font-medium text-slate-800">{title}</h4>
            {isApplied && (
              <span className="px-2 py-0.5 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                Đã áp dụng
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={(e: any) => toggleRuleApplication(id, e)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${isApplied
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
            >
              {isApplied ? 'Hủy áp dụng' : 'Áp dụng'}
            </button>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </div>
        </div>
        {isExpanded && children && (
          <div className="p-4 border-t border-slate-100 bg-white rounded-b-lg">
            {children}
          </div>
        )}
      </div>
    );
  };

  const FieldSelector = () => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        Áp dụng cho trường (trường hợp để trống sẽ áp dụng cho tất cả):
      </label>
      <select title="Field Selector" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:border-blue-500">
        <option>-- Chọn trường dữ liệu --</option>
        <option>Họ và tên</option>
        <option>Ngày sinh</option>
        <option>Số CCCD/CMND</option>
      </select>
    </div>
  );

  const mockErrors = [
    { id: 'ERR-01', field: 'Họ và tên', originalValue: 'Nguyễn Văn @', type: 'Sai định dạng', desc: 'Chứa ký tự đặc biệt', status: 'Chưa xử lý' },
    { id: 'ERR-02', field: 'Ngày sinh', originalValue: '1990/01/01', type: 'Sai định dạng', desc: 'Sai định dạng dd/mm/yyyy', status: 'Chưa xử lý' },
    { id: 'ERR-03', field: 'Số CMND', originalValue: '', type: 'Thiếu dữ liệu', desc: 'Không được để trống', status: 'Đã gửi về hệ thống nguồn' },
  ];

  const mockClassification = [
    { field: 'Số CCCD', publicLevel: 'Mật', sensLevel: 'Rất cao' },
    { field: 'Họ và tên', publicLevel: 'Công khai hạn chế', sensLevel: 'Cao' },
    { field: 'Ngày sinh', publicLevel: 'Nội bộ', sensLevel: 'Trung bình' },
  ];

  const mockHistory = [
    { stt: '1', time: '14:30 20/10/2023', type: 'Áp dụng quy tắc Làm sạch', progress: '5400/5400 bản ghi', status: 'Hoàn thành' },
    { stt: '2', time: '12:00 20/10/2023', type: 'Chạy Biến đổi dữ liệu', progress: '45230/45230 bản ghi', status: 'Hoàn thành' },
    { stt: '3', time: '09:15 20/10/2023', type: 'Đồng bộ hệ thống nguồn', progress: '125/400 bản ghi', status: 'Đang xử lý' },
  ];

  const allServices = datasets;
  const filteredServices = allServices.filter(s => s.name.toLowerCase().includes(searchDatasetQuery.toLowerCase()));
  const activeService = allServices.find(s => s.id === activeServiceId) || allServices[0];



  return (
    <div className="flex h-[calc(100vh-64px)] -m-6 bg-slate-50 ">
      {/* Secondary Sidebar */}
      <div className="w-[320px] shrink-0 bg-white border-r border-slate-200 flex flex-col">
        {/* Header with Title and Search */}
        <div className="p-4 border-b border-slate-100 flex flex-col gap-3 shrink-0">
          <h2 className="text-[15px] font-bold text-slate-800">Danh mục dữ liệu</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm dữ liệu..." 
              value={searchDatasetQuery}
              onChange={(e: any) => setSearchDatasetQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow bg-slate-50/50 hover:bg-white"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
          {filteredServices.map((service) => (
            <button
 key={service.id}
 title={service.name}
 onClick={() => setActiveServiceId(service.id)}
 className={`w-full text-left px-5 py-3 border-b border-slate-50 hover:bg-blue-50/30 transition-colors flex flex-col ${activeServiceId === service.id
 ? 'bg-blue-50/60 border-l-4 border-l-blue-600 pl-[16px]'
 : 'border-l-4 border-l-transparent'
 }`}
 >
 <div className={`text-[13px] leading-relaxed ${activeServiceId === service.id ? 'text-blue-700 ' : 'text-slate-600 font-medium'}`}>
 {service.name}
 </div>
 </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-slate-50 relative">
        <div className="p-6">
          <h1 className="text-xl font-bold text-slate-800 mb-2">
            {activeTab === 'history' ? 'Lịch sử xử lý dữ liệu' :
              activeTab === 'classification' ? 'Phân loại Dữ liệu' : 'Quản lý Quy tắc Xử lý'}
          </h1>
          <p className="text-sm text-slate-500 mb-6">Nguồn dữ liệu: {systemName} | Dữ liệu {activeService.name.toLowerCase()}</p>

          {/* Stats Overview */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border border-blue-100 flex flex-col justify-center">
              <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider mb-2">Số lượng Thu thập</span>
              <span className="text-3xl font-bold text-blue-600">50,000</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-emerald-100 flex flex-col justify-center">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Đã Làm sạch</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-emerald-600">49,850</span>
                <span className="text-xs font-semibold text-emerald-600/80 bg-emerald-50 px-1.5 py-0.5 rounded">99.7%</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-indigo-100 flex flex-col justify-center">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Đã Chuẩn hóa</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-indigo-600">45,230</span>
                <span className="text-xs font-semibold text-indigo-600/80 bg-indigo-50 px-1.5 py-0.5 rounded">90.4%</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-purple-100 flex flex-col justify-center">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Đã Biến đổi</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-purple-600">45,230</span>
                <span className="text-xs font-semibold text-purple-600/80 bg-purple-50 px-1.5 py-0.5 rounded">90.4%</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-red-100 flex flex-col justify-center">
              <span className="text-[11px] font-bold text-red-500 uppercase tracking-wider mb-2">Danh sách lỗi</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-red-600">12</span>
                <span className="text-xs font-semibold text-red-600/80 bg-red-50 px-1.5 py-0.5 rounded">0.02%</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200 mb-6">
            <button
              onClick={() => setActiveTab('clean')}
              className={`pb-3 px-4 text-sm font-medium border-b-2 mr-4 transition-colors ${activeTab === 'clean'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
            >
              Làm sạch (4)
            </button>
            <button
              onClick={() => setActiveTab('standardize')}
              className={`pb-3 px-4 text-sm font-medium border-b-2 mr-4 transition-colors ${activeTab === 'standardize'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
            >
              Chuẩn hóa (3)
            </button>
            <button
              onClick={() => setActiveTab('transform')}
              className={`pb-3 px-4 text-sm font-medium border-b-2 mr-4 transition-colors ${activeTab === 'transform'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
            >
              Biến đổi (3)
            </button>
            <button
              onClick={() => setActiveTab('errors')}
              className={`pb-3 px-4 text-sm font-medium border-b-2 mr-4 transition-colors ${activeTab === 'errors'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
            >
              Danh sách lỗi (12)
            </button>
            <button
              onClick={() => setActiveTab('classification')}
              className={`pb-3 px-4 text-sm font-medium border-b-2 mr-4 transition-colors ${activeTab === 'classification'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
            >
              Phân loại dữ liệu
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'history'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
            >
              Lịch sử
            </button>
          </div>

          <div className="pb-32 overflow-y-auto max-h-[calc(100vh-320px)] pr-2 custom-scrollbar">
            {activeTab === 'clean' && (
              <div className="flex flex-col">
                <RuleAccordion id="clean-1" title="Kiểm tra quy tắc về chuẩn định dạng">
                  <FieldSelector />
                  <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                    <h5 className="text-sm font-medium text-slate-700 mb-4">Cấu hình chuẩn định dạng:</h5>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-slate-600 mb-1.5">Điều kiện định dạng:</label>
                        <select title="Điều kiện định dạng" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:border-blue-500">
                          <option>Đúng định dạng Email</option>
                          <option>Đúng định dạng Số điện thoại</option>
                          <option>Đúng định dạng Ngày tháng</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-600 mb-1.5">Hành động:</label>
                        <select title="Hành động" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:border-blue-500">
                          <option>Ghi log lỗi</option>
                          <option>Loại bỏ bản ghi</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </RuleAccordion>
                <RuleAccordion id="clean-2" title="Kiểm tra tính hợp lệ của dữ liệu">
                  <FieldSelector />
                  <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                    <h5 className="text-sm font-medium text-slate-700 mb-4">Cấu hình hợp lệ:</h5>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-slate-600 mb-1.5">Điều kiện hợp lệ:</label>
                        <select title="Điều kiện hợp lệ" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:border-blue-500">
                          <option>Độ dài từ 2-100 ký tự</option>
                          <option>Không để trống</option>
                          <option>Tuổi từ 18-65</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-600 mb-1.5">Hành động:</label>
                        <select title="Hành động" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:border-blue-500">
                          <option>Ghi log lỗi</option>
                          <option>Đánh dấu cần xem xét</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </RuleAccordion>
                <RuleAccordion id="clean-3" title="Xử lý giá trị thiếu dữ liệu">
                  <FieldSelector />
                  <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                    <h5 className="text-sm font-medium text-slate-700 mb-4">Cấu hình xử lý thiếu:</h5>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-slate-600 mb-1.5">Kiểu giá trị thiếu:</label>
                        <input title="Kiểu giá trị thiếu" type="text" placeholder="VD: null, empty, N/A" defaultValue="null, empty" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-600 mb-1.5">Hành động:</label>
                        <select title="Hành động" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:border-blue-500">
                          <option>Điền giá trị mặc định</option>
                          <option>Đánh dấu cần kiểm tra</option>
                          <option>Bỏ qua bản ghi</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-600 mb-1.5">Giá trị điền vào (nếu có):</label>
                        <input title="Giá trị điền vào" type="text" placeholder="Nhập giá trị mặc định" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:border-blue-500" />
                      </div>
                    </div>
                  </div>
                </RuleAccordion>
                <RuleAccordion id="clean-4" title="Loại bỏ hoặc thay thế giá trị ngoại lệ">
                  <FieldSelector />
                  <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                    <h5 className="text-sm font-medium text-slate-700 mb-4">Cấu hình xử lý ngoại lệ:</h5>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-slate-600 mb-1.5">Điều kiện ngoại lệ:</label>
                        <select title="Điều kiện ngoại lệ" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:border-blue-500">
                          <option>Ngoài khoảng cho phép</option>
                          <option>Không đúng định dạng Regex</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-600 mb-1.5">Hành động:</label>
                        <select title="Hành động" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:border-blue-500">
                          <option>Loại bỏ bản ghi</option>
                          <option>Đặt giá trị mặc định</option>
                          <option>Thay thế bằng null</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </RuleAccordion>
              </div>
            )}

            {activeTab === 'standardize' && (
              <div className="flex flex-col">
                <RuleAccordion id="std-1" title="Kiểm tra đối sánh tồn tại dựa trên trường khóa">
                  <FieldSelector selectedFields={['so_cccd', 'email']} />
                  <div className="bg-green-50/50 p-4 rounded-lg border border-green-100">
                    <h5 className="text-sm font-medium text-slate-700 mb-4">Cấu hình kiểm tra trường khóa:</h5>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-slate-600 mb-1.5">Bảng tham chiếu:</label>
                        <input title="Bảng tham chiếu" type="text" placeholder="VD: tb_nguoi_dung" defaultValue="tb_nguoi_dung" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-600 mb-1.5">Hành động khi không tồn tại:</label>
                        <select title="Hành động khi không tồn tại" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:border-blue-500">
                          <option>Từ chối bản ghi</option>
                          <option>Ghi log cảnh báo</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </RuleAccordion>
                <RuleAccordion id="std-2" title="Xử lý trùng lặp">
                  <FieldSelector />
                  <div className="bg-green-50/50 p-4 rounded-lg border border-green-100">
                    <h5 className="text-sm font-medium text-slate-700 mb-4">Cấu hình xử lý trùng lặp:</h5>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-slate-600 mb-1.5">Trường kiểm tra trùng:</label>
                        <input title="Trường kiểm tra trùng" type="text" placeholder="VD: so_cccd" defaultValue="so_cccd" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-600 mb-1.5">Hành động:</label>
                        <select title="Hành động" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:border-blue-500">
                          <option>Giữ bản ghi mới nhất</option>
                          <option>Giữ bản ghi đầu tiên</option>
                          <option>Gộp thông tin</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </RuleAccordion>
                <RuleAccordion id="std-3" title="Xử lý vi phạm về ràng buộc thuộc tính tham chiếu">
                  <FieldSelector />
                  <div className="bg-green-50/50 p-4 rounded-lg border border-green-100">
                    <h5 className="text-sm font-medium text-slate-700 mb-4">Cấu hình ràng buộc tham chiếu:</h5>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-slate-600 mb-1.5">Bảng tham chiếu:</label>
                        <select title="Bảng tham chiếu" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:border-blue-500">
                          <option>Danh mục Tỉnh/Thành phố</option>
                          <option>Danh mục Quốc tịch</option>
                          <option>Danh mục Dân tộc</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-600 mb-1.5">Hành động:</label>
                        <select title="Hành động" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:border-blue-500">
                          <option>Từ chối bản ghi vi phạm</option>
                          <option>Tự động cập nhật tham chiếu</option>
                          <option>Đánh dấu cần kiểm tra</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </RuleAccordion>
              </div>
            )}

            {activeTab === 'transform' && (
              <div className="flex flex-col">
                <RuleAccordion id="trans-1" title="Biến đổi định dạng dữ liệu">
                  <FieldSelector />
                  <div className="bg-purple-50/50 p-4 rounded-lg border border-purple-100">
                    <h5 className="text-sm font-medium text-slate-700 mb-4">Cấu hình biến đổi định dạng:</h5>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-slate-600 mb-1.5">Định dạng nguồn:</label>
                        <input title="Định dạng nguồn" type="text" placeholder="VD: dd/mm/yyyy" defaultValue="dd/mm/yyyy" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-600 mb-1.5">Định dạng đích:</label>
                        <input title="Định dạng đích" type="text" placeholder="VD: yyyy-mm-dd" defaultValue="yyyy-mm-dd" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-600 mb-1.5">Kiểu biến đổi:</label>
                        <select title="Kiểu biến đổi" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:border-blue-500">
                          <option>Chuyển chữ viết hoa</option>
                          <option>Loại bỏ khoảng trắng thừa</option>
                          <option>Chuẩn hóa ngày tháng</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </RuleAccordion>
                <RuleAccordion id="trans-2" title="Gộp hoặc tách cột dữ liệu">
                  <FieldSelector />
                  <div className="bg-purple-50/50 p-4 rounded-lg border border-purple-100">
                    <h5 className="text-sm font-medium text-slate-700 mb-4">Cấu hình gộp/tách cột:</h5>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-slate-600 mb-1.5">Hành động:</label>
                        <select title="Hành động" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:border-blue-500">
                          <option>Gộp nhiều cột</option>
                          <option>Tách thành nhiều cột</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-600 mb-1.5">Danh sách cột / Phân cách:</label>
                        <input title="Danh sách cột / Phân cách" type="text" placeholder="VD: Họ, Tên đệm, Tên hoặc dấu phẩy (,)" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-600 mb-1.5">Tên cột đích / Cột mới:</label>
                        <input title="Cột đích" type="text" placeholder="VD: Họ và tên đầy đủ" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:border-blue-500" />
                      </div>
                    </div>
                  </div>
                </RuleAccordion>
                <RuleAccordion id="trans-3" title="Phân loại, gán nhãn dữ liệu">
                  <FieldSelector />
                  <div className="bg-purple-50/50 p-4 rounded-lg border border-purple-100">
                    <h5 className="text-sm font-medium text-slate-700 mb-4">Cấu hình phân loại:</h5>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-slate-600 mb-1.5">Điều kiện phân loại:</label>
                        <input title="Điều kiện phân loại" type="text" placeholder="VD: >100: Cao, 50-100: Trung bình" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-600 mb-1.5">Hành động:</label>
                        <select title="Hành động" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:border-blue-500">
                          <option>Gán nhãn tự động</option>
                          <option>Phân loại theo nhóm</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </RuleAccordion>
              </div>
            )}

            {activeTab === 'errors' && (
              <div className="flex flex-col">
                <div className="flex gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Tìm kiếm theo mã bản ghi, trường dữ liệu, lỗi..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                  <select title="Trạng thái" className="border border-slate-200 rounded-lg px-4 py-2 text-sm max-w-[180px] bg-white focus:outline-none focus:border-blue-500">
                    <option>Tất cả trạng thái</option>
                    <option>Chưa xử lý</option>
                    <option>Đã gửi về hệ thống nguồn</option>
                  </select>
                  <select title="Loại lỗi" className="border border-slate-200 rounded-lg px-4 py-2 text-sm max-w-[180px] bg-white focus:outline-none focus:border-blue-500">
                    <option>Tất cả loại lỗi</option>
                    <option>Sai định dạng</option>
                    <option>Thiếu dữ liệu</option>
                    <option>Giá trị không hợp lệ</option>
                  </select>
                </div>

                <div className="text-xs text-slate-500 mb-2">Hiển thị 12 / 12 bản ghi</div>

                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                  <table className="w-full border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                      <tr>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Mã Bản Ghi</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Trường Dữ Liệu</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Giá Trị Gốc</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Loại Lỗi</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Mô Tả Lỗi</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {mockErrors.map((error, idx) => (
                        <tr key={idx} className={`hover:bg-blue-50/30 transition-all group ${error.status === 'Đã gửi về hệ thống nguồn' ? 'bg-slate-50/30' : ''}`}>
                          <td className="px-6 py-4 text-center text-sm font-semibold text-slate-900 font-mono">{error.id}</td>
                          <td className="px-6 py-4 text-center text-sm text-slate-600 font-medium">{error.field}</td>
                          <td className={`px-6 py-4 text-center text-sm font-mono line-through ${error.status === 'Đã gửi về hệ thống nguồn' ? 'text-slate-400' : 'text-red-500 font-semibold'}`}>{error.originalValue}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border shadow-sm ${
                              error.type === 'Sai định dạng' ? 'bg-red-50 text-red-700 border-red-100' :
                              error.type === 'Thiếu dữ liệu' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                              'bg-amber-50 text-amber-700 border-amber-100'
                            } ${error.status === 'Đã gửi về hệ thống nguồn' ? 'opacity-50 grayscale' : ''}`}>
                              {error.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className={`inline-flex items-center gap-2 text-sm font-medium ${error.status === 'Đã gửi về hệ thống nguồn' ? 'text-slate-400' : 'text-slate-600'}`}>
                              <AlertTriangle className={`w-4 h-4 ${error.status === 'Đã gửi về hệ thống nguồn' ? 'text-slate-400' : 'text-red-500'}`} />
                              {error.desc}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${error.status === 'Đã gửi về hệ thống nguồn' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]'}`}></span>
                              <span className={`text-xs font-bold uppercase tracking-wider ${error.status === 'Đã gửi về hệ thống nguồn' ? 'text-emerald-700' : 'text-slate-600'}`}>{error.status}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'classification' && (
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-slate-700">Phân loại toàn bảng (Mặc định)</h4>
                  <button onClick={() => setIsEditClassifyModalOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors border border-orange-200">
                    <SquarePen className="w-4 h-4" />
                    Chỉnh sửa toàn bảng
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-orange-50/40 p-6 rounded-xl border border-orange-100 flex gap-4">
                    <div className="w-10 h-10 shrink-0 bg-orange-100/80 rounded-full flex items-center justify-center">
                      <Eye className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-500 mb-1">Mức độ công khai</div>
                      <div className="text-xl font-bold text-slate-800 mb-2">Nội bộ</div>
                      <div className="text-sm text-slate-600">Dữ liệu chỉ được sử dụng trong phạm vi nội bộ cơ quan, đơn vị. Không được công khai ra bên ngoài.</div>
                    </div>
                  </div>
                  <div className="bg-pink-50/40 p-6 rounded-xl border border-pink-100 flex gap-4">
                    <div className="w-10 h-10 shrink-0 bg-pink-100/80 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-500 mb-1">Mức độ nhạy cảm</div>
                      <div className="text-xl font-bold text-slate-800 mb-2">Cao</div>
                      <div className="text-sm text-pink-700">Dữ liệu có chứa thông tin cá nhân nhạy cảm theo quy định của Luật Bảo vệ dữ liệu cá nhân.</div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-slate-700 mb-4">Hướng dẫn phân loại</h4>
                  <div className="grid grid-cols-2 gap-8 text-sm">
                    <div>
                      <div className="font-medium text-slate-600 mb-3">Mức độ công khai:</div>
                      <ul className="space-y-2 text-slate-600 font-medium">
                        <li className="flex items-center gap-2"><Eye className="w-4 h-4 text-emerald-500" /> <span className="text-emerald-600">Công khai:</span> <span className="font-normal text-slate-500">Được phép công khai rộng rãi</span></li>
                        <li className="flex items-center gap-2"><Eye className="w-4 h-4 text-blue-500" /> <span className="text-blue-600">Công khai hạn chế:</span> <span className="font-normal text-slate-500">Có điều kiện</span></li>
                        <li className="flex items-center gap-2"><Lock className="w-4 h-4 text-orange-500" /> <span className="text-orange-600">Nội bộ:</span> <span className="font-normal text-slate-500">Chỉ trong cơ quan, đơn vị</span></li>
                        <li className="flex items-center gap-2"><EyeOff className="w-4 h-4 text-red-500" /> <span className="text-red-600">Mật:</span> <span className="font-normal text-slate-500">Bảo mật nghiêm ngặt</span></li>
                      </ul>
                    </div>
                    <div>
                      <div className="font-medium text-slate-600 mb-3">Mức độ nhạy cảm:</div>
                      <ul className="space-y-2 text-slate-600 font-medium">
                        <li className="flex items-center gap-2"><span className="text-emerald-600">Thấp:</span> <span className="font-normal text-slate-500">Thông tin công khai</span></li>
                        <li className="flex items-center gap-2"><span className="text-amber-500">Trung bình:</span> <span className="font-normal text-slate-500">Cần bảo vệ cơ bản</span></li>
                        <li className="flex items-center gap-2"><span className="text-red-500">Cao:</span> <span className="font-normal text-slate-500">Dữ liệu cá nhân nhạy cảm</span></li>
                        <li className="flex items-center gap-2"><span className="text-red-700">Rất cao:</span> <span className="font-normal text-slate-500">Bí mật cá nhân</span></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-slate-700">Phân loại theo từng trường dữ liệu</h4>
                  <button onClick={() => setIsEditClassifyModalOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors border border-orange-200">
                    <SquarePen className="w-4 h-4" />
                    Chỉnh sửa các trường
                  </button>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                  <table className="w-full border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                      <tr>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Tên Trường</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Mức Độ Công Khai</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Mức Độ Nhạy Cảm</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {mockClassification.map((item, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/30 transition-all group">
                          <td className="px-6 py-4 text-center text-sm font-semibold text-slate-900">{item.field}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border shadow-sm ${
                              item.publicLevel === 'Công khai hạn chế' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                              item.publicLevel === 'Nội bộ' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                              'bg-red-50 text-red-700 border-red-100'
                            }`}>
                              {item.publicLevel === 'Công khai hạn chế' && <Eye className="w-3.5 h-3.5" />}
                              {item.publicLevel === 'Nội bộ' && <Lock className="w-3.5 h-3.5" />}
                              {item.publicLevel === 'Mật' && <EyeOff className="w-3.5 h-3.5" />}
                              {item.publicLevel}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border shadow-sm ${
                              item.sensLevel === 'Thấp' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                              item.sensLevel === 'Cao' ? 'bg-red-50 text-red-700 border-red-100' :
                              'bg-red-100 text-red-800 border-red-200 shadow-red-100'
                            }`}>
                              {item.sensLevel}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="flex flex-col">
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Tìm kiếm theo tên quy tắc, thời gian..." className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                  <table className="w-full border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                      <tr>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-20">STT</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-48">Thời gian</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Loại xử lý</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-32">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {mockHistory.map((item, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/30 transition-all group">
                          <td className="px-6 py-4 text-center text-sm font-semibold text-slate-500">{(idx + 1).toString().padStart(2, '0')}</td>
                          <td className="px-6 py-4 text-center text-sm text-slate-600 font-medium font-mono">{item.time}</td>
                          <td className="px-6 py-4 text-center">
                            <div className="font-semibold text-slate-900 text-sm mb-1">{item.type}</div>
                            <div className="text-xs text-slate-500 font-mono">{item.progress}</div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full border shadow-sm ${
                              item.status === 'Đang xử lý' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                              item.status === 'Hoàn thành' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                              'bg-red-50 text-red-700 border-red-100'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="text-xs text-slate-500 mt-4">Hiển thị {mockHistory.length} bản ghi</div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {activeTab === 'clean' || activeTab === 'standardize' || activeTab === 'transform' ? (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 flex items-center justify-between z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="text-sm text-slate-600 font-medium">
              Đã áp dụng {Object.values(appliedRules).filter(Boolean).length} / 10 quy tắc
            </div>
            <div className="flex items-center gap-3">
              <button className="px-6 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
                Hủy
              </button>
              <button className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                Lưu cấu hình
              </button>
            </div>
          </div>
        ) : activeTab === 'errors' ? (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 flex items-center justify-between z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="text-sm text-slate-600 font-medium">
              10 bản ghi chưa xử lý • 2 đã gửi về hệ thống nguồn
            </div>
            <div className="flex items-center gap-3">
              <button className="px-6 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
                Đóng
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors">
                <Download className="w-4 h-4" />
                Xuất danh sách lỗi
              </button>
              <button
                onClick={() => setIsSendPopupOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4" />
                Gửi tất cả về hệ thống nguồn
              </button>
            </div>
          </div>
        ) : activeTab === 'history' ? (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 flex items-center justify-end z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <button className="px-6 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">
              Đóng
            </button>
          </div>
        ) : (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 flex items-center justify-end z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <button className="px-6 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors mr-3">
              Đóng
            </button>
            <button className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
              Xuất báo cáo
            </button>
          </div>
        )}
      </div>

      {/* Popovers / Modals */}
      {isEditClassifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-[800px] max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white z-10">
              <h3 className="font-bold text-slate-800 text-lg">Cấu hình Phân loại Dữ liệu</h3>
              <button title="Đóng" onClick={() => setIsEditClassifyModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 custom-scrollbar">
              {/* Phân loại cấp Bảng */}
              <div className="mb-8">
                <h4 className="text-[15px] font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                  Phân loại toàn bảng (Áp dụng mặc định)
                </h4>
                <div className="grid grid-cols-2 gap-6 bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                  <div className="relative z-10">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Mức độ công khai</label>
                    <select title="Mức độ công khai" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option>Công khai</option>
                      <option>Công khai hạn chế</option>
                      <option selected>Nội bộ</option>
                      <option>Mật</option>
                    </select>
                    <p className="text-xs text-slate-500 mt-2">Áp dụng cho các trường chưa được cấu hình riêng lẻ.</p>
                  </div>
                  <div className="relative z-10">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Mức độ nhạy cảm</label>
                    <select title="Mức độ nhạy cảm" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option>Thấp</option>
                      <option>Trung bình</option>
                      <option selected>Cao</option>
                      <option>Rất cao</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Phân loại cấp Trường */}
              <div>
                <h4 className="text-[15px] font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-600"></div>
                  Phân loại các trường ngoại lệ
                </h4>
                <p className="text-sm text-slate-500 mb-4">
                  Cấu hình mức độ cho các trường thông tin cụ thể (mức độ này sẽ ưu tiên ghi đè lên mức phân loại toàn bảng).
                </p>
                
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 bg-slate-50 uppercase font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-5 py-3 w-[30%]">Tên trường</th>
                        <th className="px-5 py-3 w-[35%]">Mức độ công khai</th>
                        <th className="px-5 py-3 w-[35%]">Mức độ nhạy cảm</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {mockClassification.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="px-5 py-3 font-medium text-slate-700">{item.field}</td>
                          <td className="px-5 py-3">
                            <select title="Mức công khai" className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50/50 hover:bg-white transition-colors" defaultValue={item.publicLevel}>
                              <option className="text-slate-400">-- Theo mặc định bảng --</option>
                              <option>Công khai</option>
                              <option>Công khai hạn chế</option>
                              <option>Nội bộ</option>
                              <option>Mật</option>
                            </select>
                          </td>
                          <td className="px-5 py-3">
                            <select title="Mức nhạy cảm" className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50/50 hover:bg-white transition-colors" defaultValue={item.sensLevel}>
                              <option className="text-slate-400">-- Theo mặc định bảng --</option>
                              <option>Thấp</option>
                              <option>Trung bình</option>
                              <option>Cao</option>
                              <option>Rất cao</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                      {/* Empty state entry */}
                      <tr className="hover:bg-slate-50/50 group">
                        <td className="px-5 py-3 font-medium text-slate-500 group-hover:text-slate-700 transition-colors">Địa chỉ thường trú</td>
                        <td className="px-5 py-3">
                          <select title="Mức công khai" className="w-full px-2.5 py-1.5 border border-slate-100 border-dashed rounded-md text-sm text-slate-400 focus:text-slate-700 focus:border-blue-500 focus:border-solid focus:ring-1 focus:ring-blue-500 bg-transparent hover:bg-white transition-colors">
                            <option selected className="text-slate-400">-- Theo mặc định bảng --</option>
                            <option>Công khai</option>
                            <option>Công khai hạn chế</option>
                            <option>Nội bộ</option>
                            <option>Mật</option>
                          </select>
                        </td>
                        <td className="px-5 py-3">
                          <select title="Mức nhạy cảm" className="w-full px-2.5 py-1.5 border border-slate-100 border-dashed rounded-md text-sm text-slate-400 focus:text-slate-700 focus:border-blue-500 focus:border-solid focus:ring-1 focus:ring-blue-500 bg-transparent hover:bg-white transition-colors">
                            <option selected className="text-slate-400">-- Theo mặc định bảng --</option>
                            <option>Thấp</option>
                            <option>Trung bình</option>
                            <option>Cao</option>
                            <option>Rất cao</option>
                          </select>
                        </td>
                      </tr>
                      {/* Empty state entry 2 */}
                      <tr className="hover:bg-slate-50/50 group">
                        <td className="px-5 py-3 font-medium text-slate-500 group-hover:text-slate-700 transition-colors">Quê quán</td>
                        <td className="px-5 py-3">
                          <select title="Mức công khai" className="w-full px-2.5 py-1.5 border border-slate-100 border-dashed rounded-md text-sm text-slate-400 focus:text-slate-700 focus:border-blue-500 focus:border-solid focus:ring-1 focus:ring-blue-500 bg-transparent hover:bg-white transition-colors">
                            <option selected className="text-slate-400">-- Theo mặc định bảng --</option>
                            <option>Công khai</option>
                            <option>Công khai hạn chế</option>
                            <option>Nội bộ</option>
                            <option>Mật</option>
                          </select>
                        </td>
                        <td className="px-5 py-3">
                          <select title="Mức nhạy cảm" className="w-full px-2.5 py-1.5 border border-slate-100 border-dashed rounded-md text-sm text-slate-400 focus:text-slate-700 focus:border-blue-500 focus:border-solid focus:ring-1 focus:ring-blue-500 bg-transparent hover:bg-white transition-colors">
                            <option selected className="text-slate-400">-- Theo mặc định bảng --</option>
                            <option>Thấp</option>
                            <option>Trung bình</option>
                            <option>Cao</option>
                            <option>Rất cao</option>
                          </select>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-white flex items-center justify-end gap-3 rounded-b-xl border-t border-slate-200 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <button
                onClick={() => setIsEditClassifyModalOpen(false)}
                className="px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  setIsEditClassifyModalOpen(false);
                }}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm"
              >
                Lưu cấu hình
              </button>
            </div>
          </div>
        </div>
      )}

      {isSendPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-[480px] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg">Xác nhận gửi yêu cầu xử lý</h3>
              <button title="Đóng" onClick={() => setIsSendPopupOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 shrink-0 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center">
                  <Send className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-slate-600 text-[15px] mb-3 leading-relaxed">
                    Hệ thống sẽ chuyển danh sách gồm <strong className="text-slate-800 font-semibold">10 bản ghi lỗi (Chưa xử lý)</strong> về hệ thống nghiệp vụ nguồn (<span className="font-medium text-blue-700">{systemName}</span>) để rà soát và khắc phục dữ liệu gốc.
                  </p>
                  <p className="text-slate-500 text-sm italic">
                    Lưu ý: Các bản ghi "Đã gửi về hệ thống nguồn" sẽ không bị ảnh hưởng.
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 flex items-center justify-end gap-3 rounded-b-xl border-t border-slate-100">
              <button
                onClick={() => setIsSendPopupOpen(false)}
                className="px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => setIsSendPopupOpen(false)}
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Send className="w-4 h-4 shadow-sm" />
                Xác nhận Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
