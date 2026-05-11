import * as React from 'react';
import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, AlertTriangle, Send, Download, Eye, Lock, EyeOff, SquarePen, X, Network, Plus, Trash2, ArrowLeftRight } from 'lucide-react';

import { DataMappingModal } from './DataMappingModal';
import { SelectTargetDatabaseModal } from './SelectTargetDatabaseModal';
import { TargetDatabaseConfigModal } from './TargetDatabaseConfigModal';
import { TargetDatabase } from './mockTargetDatabases';

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
  const isOnlyTransform = ['Danh mục', 'BHXH và Giảm nghèo', 'Người có công', 'Trẻ em'].includes(systemName);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDatasetQuery, setSearchDatasetQuery] = useState('');
  const [activeServiceId, setActiveServiceId] = useState(datasets[0]?.id || '');
  const [activeTab, setActiveTab] = useState(isOnlyTransform ? 'transform' : 'clean');
  const [isSendPopupOpen, setIsSendPopupOpen] = useState(false);
  const [isEditClassifyModalOpen, setIsEditClassifyModalOpen] = useState(false);
  
  // Mapping Flow States
  const [isSelectDBModalOpen, setIsSelectDBModalOpen] = useState(false);
  const [isTargetConfigModalOpen, setIsTargetConfigModalOpen] = useState(false);
  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);
  const [selectedTargetDB, setSelectedTargetDB] = useState<TargetDatabase | null>(null);
  const [targetConfigData, setTargetConfigData] = useState<any>(null);
  const [formatRules, setFormatRules] = useState<{id: number, field: string, rule: string, action: string, replacementValue: string, isSaved: boolean}[]>([]);
  const [validityRules, setValidityRules] = useState<{id: number, field: string, rule: string, action: string, replacementValue: string, isSaved: boolean}[]>([]);

  const handleAddRule = () => {
    setFormatRules(prev => [...prev, { id: Date.now(), field: '', rule: '', action: '', replacementValue: '', isSaved: false }]);
  };

  const handleUpdateRule = (id: number, field: string, value: string) => {
    setFormatRules(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleSaveRules = () => {
    setFormatRules(prev => prev.map(r => ({ ...r, isSaved: true })));
  };

  const handleEditRule = (id: number) => {
    setFormatRules(prev => prev.map(r => r.id === id ? { ...r, isSaved: false } : r));
  };

  // Validity Rules Handlers
  const handleAddValidityRule = () => {
    setValidityRules(prev => [...prev, { id: Date.now(), field: '', rule: '', action: '', replacementValue: '', isSaved: false }]);
  };

  const handleUpdateValidityRule = (id: number, field: string, value: string) => {
    setValidityRules(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleSaveValidityRules = () => {
    setValidityRules(prev => prev.map(r => ({ ...r, isSaved: true })));
  };

  const handleEditValidityRule = (id: number) => {
    setValidityRules(prev => prev.map(r => r.id === id ? { ...r, isSaved: false } : r));
  };

  // Missing Value Rules Handlers
  const [missingValueRules, setMissingValueRules] = useState<{id: number, field: string, type: string, action: string, value: string, isSaved: boolean}[]>([]);

  const handleAddMissingValueRule = () => {
    setMissingValueRules(prev => [...prev, { id: Date.now(), field: '', type: 'null, empty', action: 'Điền giá trị mặc định', value: '', isSaved: false }]);
  };

  const handleUpdateMissingValueRule = (id: number, field: string, value: string) => {
    setMissingValueRules(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleSaveMissingValueRules = () => {
    setMissingValueRules(prev => prev.map(r => ({ ...r, isSaved: true })));
  };

  const handleEditMissingValueRule = (id: number) => {
    setMissingValueRules(prev => prev.map(r => r.id === id ? { ...r, isSaved: false } : r));
  };

  // Transform Rules Handlers
  const [transformRules, setTransformRules] = useState<{id: number, field: string, type: string, info: string, value: string, isSaved: boolean}[]>([]);

  const handleAddTransformRule = () => {
    setTransformRules(prev => [...prev, { id: Date.now(), field: '', type: '', info: '', value: '', isSaved: false }]);
  };

  const handleUpdateTransformRule = (id: number, field: string, value: string) => {
    setTransformRules(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleSaveTransformRules = () => {
    setTransformRules(prev => prev.map(r => ({ ...r, isSaved: true })));
  };

  const handleEditTransformRule = (id: number) => {
    setTransformRules(prev => prev.map(r => r.id === id ? { ...r, isSaved: false } : r));
  };

  // Reference Rules Handlers
  const [referenceRules, setReferenceRules] = useState<{id: number, field: string, refTable: string, refField: string, action: string, isSaved: boolean}[]>([]);

  const handleAddReferenceRule = () => {
    setReferenceRules(prev => [...prev, { id: Date.now(), field: '', refTable: '', refField: '', action: '', isSaved: false }]);
  };

  const handleUpdateReferenceRule = (id: number, field: string, value: string) => {
    setReferenceRules(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleSaveReferenceRules = () => {
    setReferenceRules(prev => prev.map(r => ({ ...r, isSaved: true })));
  };

  const handleEditReferenceRule = (id: number) => {
    setReferenceRules(prev => prev.map(r => r.id === id ? { ...r, isSaved: false } : r));
  };

  const handleOpenTargetConfig = () => {
    setIsTargetConfigModalOpen(true);
  };

  const handleDownloadTargetFromConfig = () => {
    setIsSelectDBModalOpen(true);
  };

  const handleSelectTargetDB = (db: TargetDatabase) => {
    setSelectedTargetDB(db);
    setTargetConfigData({
      name: db.name,
      host: db.host,
      port: db.port,
      username: db.username,
      type: `DBT_${db.type.toUpperCase()}`
    });
    setIsSelectDBModalOpen(false);
    setIsTargetConfigModalOpen(true);
  };

  const handleNextToMapping = (data: any) => {
    setTargetConfigData(data);
    setIsTargetConfigModalOpen(false);
    setIsMappingModalOpen(true);
  };

  const handleContinueMapping = (db: TargetDatabase) => {
    setSelectedTargetDB(db);
    setIsSelectDBModalOpen(false);
    setIsMappingModalOpen(true);
  };

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

  const RuleAccordion = ({ id, title, children }: { id: string, title: string, children?: React.ReactNode }) => {
    const isExpanded = !!expandedRules[id];

    return (
      <div className="mb-4 w-full rounded-lg border border-slate-200 bg-white">
        <div
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
          onClick={() => toggleRuleExpansion(id)}
        >
          <div className="flex items-center gap-3">
            <h4 className="text-[15px] font-semibold text-slate-800">{title}</h4>
          </div>
          <div className="flex items-center gap-4">
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

  const FieldSelector = ({ multiple, selectedFields }: { multiple?: boolean, selectedFields?: string[] }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        Áp dụng cho trường (trường hợp để trống sẽ áp dụng cho tất cả):
      </label>
      <select title="Field Selector" multiple={multiple} className={`w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:border-blue-500 ${multiple ? 'min-h-[100px]' : ''}`}>
        {!multiple && <option>-- Chọn trường dữ liệu --</option>}
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
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-bold text-slate-800">
              {activeTab === 'history' ? 'Lịch sử xử lý dữ liệu' :
                activeTab === 'classification' ? 'Phân loại Dữ liệu' : 'Quản lý Quy tắc Xử lý'}
            </h1>
            <button
              onClick={handleOpenTargetConfig}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              <ArrowLeftRight className="w-4 h-4" />
              Cấu hình ánh xạ
            </button>
          </div>
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

          </div>

          {/* Tabs */}
          {!isOnlyTransform && (
            <div className="flex border-b border-slate-200 mb-6">
              <button
                onClick={() => setActiveTab('clean')}
                className={`pb-3 px-4 text-sm font-medium border-b-2 mr-4 transition-colors ${activeTab === 'clean'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
              >
                Làm sạch
              </button>
              <button
                onClick={() => setActiveTab('standardize')}
                className={`pb-3 px-4 text-sm font-medium border-b-2 mr-4 transition-colors ${activeTab === 'standardize'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
              >
                Chuẩn hóa
              </button>
              <button
                onClick={() => setActiveTab('transform')}
                className={`pb-3 px-4 text-sm font-medium border-b-2 mr-4 transition-colors ${activeTab === 'transform'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
              >
                Biến đổi
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
          )}

          <div className="pb-32 overflow-y-auto max-h-[calc(100vh-320px)] pr-2 custom-scrollbar">
            {activeTab === 'clean' && (
              <div className="flex flex-col">
                <RuleAccordion id="clean-1" title="Kiểm tra quy tắc về chuẩn định dạng">
                  <div className="space-y-6">
                    {formatRules.length > 0 && (
                      <div className="space-y-4">
                        {formatRules.map((rule) => (
                          <div key={rule.id} className={`flex gap-8 items-end p-5 rounded-xl border transition-all relative group ${rule.isSaved ? 'bg-slate-50 border-slate-200' : 'bg-white border-blue-200 shadow-sm'}`}>
                            <div className="flex-1 space-y-2">
                              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Trường áp dụng</label>
                              <select 
                                disabled={rule.isSaved}
                                value={rule.field}
                                onChange={(e) => handleUpdateRule(rule.id, 'field', e.target.value)}
                                title="Trường áp dụng" 
                                className={`w-full px-3.5 py-2.5 rounded-lg text-[13px] transition-all focus:outline-none ${rule.isSaved ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white border-slate-300 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border'}`}
                              >
                                <option value="">-- Chọn trường --</option>
                                <option value="Họ và tên">Họ và tên</option>
                                <option value="Số CCCD/CMND">Số CCCD/CMND</option>
                                <option value="Ngày sinh">Ngày sinh</option>
                                <option value="Địa chỉ">Địa chỉ</option>
                              </select>
                            </div>
                            
                            <div className="flex-1 space-y-2">
                              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Quy tắc định dạng</label>
                              <select 
                                disabled={rule.isSaved}
                                value={rule.rule}
                                onChange={(e) => handleUpdateRule(rule.id, 'rule', e.target.value)}
                                title="Quy tắc định dạng" 
                                className={`w-full px-3.5 py-2.5 rounded-lg text-[13px] transition-all focus:outline-none ${rule.isSaved ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white border-slate-300 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border'}`}
                              >
                                <option value="">-- Chọn quy tắc --</option>

                                <option value="Đúng định dạng CCCD">Đúng định dạng CCCD</option>
                                <option value="Đúng định dạng Email">Đúng định dạng Email</option>
                                <option value="Đúng định dạng Số điện thoại">Đúng định dạng Số điện thoại</option>
                              </select>
                            </div>

                            <div className="flex-[1.5] space-y-2">
                              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Xử lý ngoại lệ</label>
                              <div className="flex gap-3">
                                <select 
                                  disabled={rule.isSaved}
                                  value={rule.action}
                                  onChange={(e) => handleUpdateRule(rule.id, 'action', e.target.value)}
                                  title="Xử lý ngoại lệ" 
                                  className={`flex-1 px-3.5 py-2.5 rounded-lg text-[13px] transition-all focus:outline-none ${rule.isSaved ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white border-slate-300 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border'}`}
                                >
                                  <option value="">-- Chọn xử lý --</option>
                                  <option value="Loại bỏ bản ghi lỗi">Loại bỏ bản ghi lỗi</option>
                                  <option value="Thay thế bằng giá trị mặc định">Thay thế bằng giá trị mặc định</option>
                                </select>
                                {rule.action === 'Thay thế bằng giá trị mặc định' && (
                                  <input 
                                    type="text"
                                    disabled={rule.isSaved}
                                    value={rule.replacementValue}
                                    onChange={(e) => handleUpdateRule(rule.id, 'replacementValue', e.target.value)}
                                    placeholder="Giá trị thay thế..."
                                    className={`flex-1 px-3.5 py-2.5 rounded-lg text-[13px] transition-all focus:outline-none ${rule.isSaved ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white border-slate-300 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border'}`}
                                  />
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 mb-1">
                              {rule.isSaved && (
                                <button 
                                  onClick={() => handleEditRule(rule.id)}
                                  title="Chỉnh sửa" 
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                >
                                  <SquarePen className="w-4 h-4" />
                                </button>
                              )}
                              <button 
                                onClick={() => setFormatRules(prev => prev.filter(r => r.id !== rule.id))}
                                title="Xóa" 
                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2 px-1">
                      <button 
                        onClick={handleAddRule}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95"
                      >
                        <Plus className="w-4 h-4 stroke-[3px]" />
                        Thêm quy tắc
                      </button>

                      {formatRules.some(r => !r.isSaved) && (
                        <button 
                          onClick={handleSaveRules}
                          className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-all shadow-sm active:scale-95"
                        >
                          Lưu quy tắc
                        </button>
                      )}
                    </div>
                  </div>
                </RuleAccordion>
                <RuleAccordion id="clean-2" title="Kiểm tra tính hợp lệ của dữ liệu">
                  <div className="space-y-6">
                    {validityRules.length > 0 && (
                      <div className="space-y-4">
                        {validityRules.map((rule) => (
                          <div key={rule.id} className={`flex gap-8 items-end p-5 rounded-xl border transition-all relative group ${rule.isSaved ? 'bg-slate-50 border-slate-200' : 'bg-white border-blue-200 shadow-sm'}`}>
                            <div className="flex-1 space-y-2">
                              <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">Trường áp dụng</label>
                              <select 
                                disabled={rule.isSaved}
                                value={rule.field}
                                onChange={(e) => handleUpdateValidityRule(rule.id, 'field', e.target.value)}
                                title="Trường áp dụng" 
                                className={`w-full px-3.5 py-2.5 rounded-lg text-[13px] transition-all focus:outline-none ${rule.isSaved ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white border-slate-300 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border'}`}
                              >
                                <option value="">-- Chọn trường --</option>
                                <option value="Họ và tên">Họ và tên</option>
                                <option value="Số CCCD/CMND">Số CCCD/CMND</option>
                                <option value="Ngày sinh">Ngày sinh</option>
                                <option value="Địa chỉ">Địa chỉ</option>
                              </select>
                            </div>
                            
                            <div className="flex-1 space-y-2">
                              <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">Điều kiện hợp lệ</label>
                              <select 
                                disabled={rule.isSaved}
                                value={rule.rule}
                                onChange={(e) => handleUpdateValidityRule(rule.id, 'rule', e.target.value)}
                                title="Điều kiện hợp lệ" 
                                className={`w-full px-3.5 py-2.5 rounded-lg text-[13px] transition-all focus:outline-none ${rule.isSaved ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white border-slate-300 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border'}`}
                              >
                                <option value="">-- Chọn điều kiện --</option>
                                <option value="Không để trống">Không để trống</option>
                                <option value="Độ dài từ 2-100 ký tự">Độ dài từ 2-100 ký tự</option>
                                <option value="Tuổi từ 18-65">Tuổi từ 18-65</option>
                              </select>
                            </div>

                            <div className="flex-[1.5] space-y-2">
                              <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">Hành động</label>
                              <div className="flex gap-3">
                                <select 
                                  disabled={rule.isSaved}
                                  value={rule.action}
                                  onChange={(e) => handleUpdateValidityRule(rule.id, 'action', e.target.value)}
                                  title="Hành động" 
                                  className={`flex-1 px-3.5 py-2.5 rounded-lg text-[13px] transition-all focus:outline-none ${rule.isSaved ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white border-slate-300 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border'}`}
                                >
                                  <option value="">-- Chọn hành động --</option>
                                  <option value="Đánh dấu cần xem xét">Đánh dấu cần xem xét</option>
                                  <option value="Loại bỏ bản ghi">Loại bỏ bản ghi</option>
                                  <option value="Thay thế bằng giá trị mặc định">Thay thế bằng giá trị mặc định</option>
                                </select>
                                {rule.action === 'Thay thế bằng giá trị mặc định' && (
                                  <input 
                                    type="text"
                                    disabled={rule.isSaved}
                                    value={rule.replacementValue}
                                    onChange={(e) => handleUpdateValidityRule(rule.id, 'replacementValue', e.target.value)}
                                    placeholder="Giá trị thay thế..."
                                    className={`flex-1 px-3.5 py-2.5 rounded-lg text-[13px] transition-all focus:outline-none ${rule.isSaved ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white border-slate-300 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border'}`}
                                  />
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 mb-1">
                              {rule.isSaved && (
                                <button 
                                  onClick={() => handleEditValidityRule(rule.id)}
                                  title="Chỉnh sửa" 
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                >
                                  <SquarePen className="w-4 h-4" />
                                </button>
                              )}
                              <button 
                                onClick={() => setValidityRules(prev => prev.filter(r => r.id !== rule.id))}
                                title="Xóa" 
                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2 px-1">
                      <button 
                        onClick={handleAddValidityRule}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95"
                      >
                        <Plus className="w-4 h-4 stroke-[3px]" />
                        Thêm quy tắc
                      </button>

                      {validityRules.some(r => !r.isSaved) && (
                        <button 
                          onClick={handleSaveValidityRules}
                          className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-all shadow-sm active:scale-95"
                        >
                          Lưu quy tắc
                        </button>
                      )}
                    </div>
                  </div>
                </RuleAccordion>
                <RuleAccordion id="clean-3" title="Xử lý giá trị thiếu dữ liệu">
                  <div className="space-y-6">
                    {missingValueRules.length > 0 && (
                      <div className="space-y-4">
                        {missingValueRules.map((rule) => (
                          <div key={rule.id} className={`flex gap-6 items-end p-5 rounded-xl border transition-all relative group ${rule.isSaved ? 'bg-slate-50 border-slate-200' : 'bg-white border-blue-200 shadow-sm'}`}>
                            <div className="flex-1 space-y-2">
                              <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">Trường áp dụng</label>
                              <select 
                                disabled={rule.isSaved}
                                value={rule.field}
                                onChange={(e) => handleUpdateMissingValueRule(rule.id, 'field', e.target.value)}
                                title="Trường áp dụng" 
                                className={`w-full px-3.5 py-2.5 rounded-lg text-[13px] transition-all focus:outline-none ${rule.isSaved ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white border-slate-300 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border'}`}
                              >
                                <option value="">-- Chọn trường --</option>
                                <option value="Họ và tên">Họ và tên</option>
                                <option value="Số CCCD/CMND">Số CCCD/CMND</option>
                                <option value="Ngày sinh">Ngày sinh</option>
                                <option value="Địa chỉ">Địa chỉ</option>
                              </select>
                            </div>
                            
                            <div className="flex-1 space-y-2">
                              <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">Kiểu giá trị thiếu</label>
                              <input 
                                type="text"
                                disabled={rule.isSaved}
                                value={rule.type}
                                onChange={(e) => handleUpdateMissingValueRule(rule.id, 'type', e.target.value)}
                                placeholder="VD: null, empty"
                                className={`w-full px-3.5 py-2.5 rounded-lg text-[13px] transition-all focus:outline-none ${rule.isSaved ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white border-slate-300 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border'}`}
                              />
                            </div>

                            <div className="flex-1 space-y-2">
                              <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">Hành động</label>
                              <select 
                                disabled
                                value="Điền giá trị mặc định"
                                title="Hành động" 
                                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-[13px] text-slate-500 transition-all focus:outline-none"
                              >
                                <option>Điền giá trị mặc định</option>
                              </select>
                            </div>

                            <div className="flex-1 space-y-2">
                              <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">Giá trị điền vào</label>
                              <input 
                                type="text"
                                disabled={rule.isSaved}
                                value={rule.value}
                                onChange={(e) => handleUpdateMissingValueRule(rule.id, 'value', e.target.value)}
                                placeholder="Nhập giá trị..."
                                className={`w-full px-3.5 py-2.5 rounded-lg text-[13px] transition-all focus:outline-none ${rule.isSaved ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white border-slate-300 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border'}`}
                              />
                            </div>
                            
                            <div className="flex items-center gap-1 mb-1">
                              {rule.isSaved && (
                                <button 
                                  onClick={() => handleEditMissingValueRule(rule.id)}
                                  title="Chỉnh sửa" 
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                >
                                  <SquarePen className="w-4 h-4" />
                                </button>
                              )}
                              <button 
                                onClick={() => setMissingValueRules(prev => prev.filter(r => r.id !== rule.id))}
                                title="Xóa" 
                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2 px-1">
                      <button 
                        onClick={handleAddMissingValueRule}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95"
                      >
                        <Plus className="w-4 h-4 stroke-[3px]" />
                        Thêm quy tắc
                      </button>

                      {missingValueRules.some(r => !r.isSaved) && (
                        <button 
                          onClick={handleSaveMissingValueRules}
                          className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-all shadow-sm active:scale-95"
                        >
                          Lưu quy tắc
                        </button>
                      )}
                    </div>
                  </div>
                </RuleAccordion>
              </div>
            )}

            {activeTab === 'standardize' && (
              <div className="flex flex-col">
                <RuleAccordion id="std-2" title="Kiểm tra đối sánh tồn tại dựa trên trường khóa">
                  <FieldSelector />
                  <div className="bg-green-50/50 p-4 rounded-lg border border-green-100">
                    <h5 className="text-sm font-medium text-slate-700 mb-4">Quy tắc đối sánh:</h5>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-slate-600 mb-1.5">Trường kiểm tra trùng:</label>
                        <input title="Trường kiểm tra trùng" type="text" placeholder="VD: so_cccd" defaultValue="so_cccd" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-600 mb-1.5">Xử lý trùng lặp:</label>
                        <select title="Xử lý trùng lặp" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:border-blue-500">
                          <option>Giữ bản ghi mới nhất</option>
                          <option>Giữ bản ghi đầu tiên</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </RuleAccordion>
                <RuleAccordion id="std-3" title="Xử lý vi phạm về ràng buộc thuộc tính tham chiếu">
                  <div className="space-y-6">
                    {referenceRules.length > 0 && (
                      <div className="space-y-4">
                        {referenceRules.map((rule) => (
                          <div key={rule.id} className={`flex gap-6 items-end p-5 rounded-xl border transition-all relative group ${rule.isSaved ? 'bg-slate-50 border-slate-200' : 'bg-white border-blue-200 shadow-sm'}`}>
                            <div className="flex-1 space-y-2">
                              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Trường áp dụng</label>
                              <select 
                                disabled={rule.isSaved}
                                value={rule.field}
                                onChange={(e) => handleUpdateReferenceRule(rule.id, 'field', e.target.value)}
                                title="Trường áp dụng" 
                                className={`w-full px-3.5 py-2.5 rounded-lg text-[13px] transition-all focus:outline-none ${rule.isSaved ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white border-slate-300 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border'}`}
                              >
                                <option value="">-- Chọn trường --</option>
                                <option value="ma_tinh_thanh">Mã Tỉnh/Thành</option>
                                <option value="ma_quan_huyen">Mã Quận/Huyện</option>
                                <option value="ma_phuong_xa">Mã Phường/Xã</option>
                                <option value="dan_toc">Dân tộc</option>
                                <option value="quoc_tich">Quốc tịch</option>
                              </select>
                            </div>
                            
                            <div className="flex-1 space-y-2">
                              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Bảng tham chiếu</label>
                              <select 
                                disabled={rule.isSaved}
                                value={rule.refTable}
                                onChange={(e) => handleUpdateReferenceRule(rule.id, 'refTable', e.target.value)}
                                title="Bảng tham chiếu" 
                                className={`w-full px-3.5 py-2.5 rounded-lg text-[13px] transition-all focus:outline-none ${rule.isSaved ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white border-slate-300 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border'}`}
                              >
                                <option value="">-- Chọn bảng --</option>
                                <option value="dm_tinh_thanh">Danh mục Tỉnh/Thành</option>
                                <option value="dm_quan_huyen">Danh mục Quận/Huyện</option>
                                <option value="dm_phuong_xa">Danh mục Phường/Xã</option>
                                <option value="dm_dan_toc">Danh mục Dân tộc</option>
                                <option value="dm_quoc_tich">Danh mục Quốc tịch</option>
                              </select>
                            </div>

                            <div className="flex-1 space-y-2">
                              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Trường tham chiếu</label>
                              <select 
                                disabled={rule.isSaved}
                                value={rule.refField}
                                onChange={(e) => handleUpdateReferenceRule(rule.id, 'refField', e.target.value)}
                                title="Trường tham chiếu" 
                                className={`w-full px-3.5 py-2.5 rounded-lg text-[13px] transition-all focus:outline-none ${rule.isSaved ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white border-slate-300 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border'}`}
                              >
                                <option value="">-- Chọn trường --</option>
                                <option value="ma_danh_muc">Mã danh mục</option>
                                <option value="ten_danh_muc">Tên danh mục</option>
                                <option value="ma_code">Mã Code</option>
                              </select>
                            </div>

                            <div className="flex-1 space-y-2">
                              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Hành động</label>
                              <select 
                                disabled={rule.isSaved}
                                value={rule.action}
                                onChange={(e) => handleUpdateReferenceRule(rule.id, 'action', e.target.value)}
                                title="Hành động" 
                                className={`w-full px-3.5 py-2.5 rounded-lg text-[13px] transition-all focus:outline-none ${rule.isSaved ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white border-slate-300 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border'}`}
                              >
                                <option value="">-- Chọn hành động --</option>
                                <option value="Từ chối bản ghi vi phạm">Từ chối bản ghi vi phạm</option>
                                <option value="Gán giá trị rỗng (NULL)">Gán giá trị rỗng (NULL)</option>
                                <option value="Gán giá trị mặc định">Gán giá trị mặc định</option>
                                <option value="Đánh dấu cảnh báo">Đánh dấu cảnh báo</option>
                              </select>
                            </div>
                            
                            <div className="flex items-center gap-1 mb-1">
                              {rule.isSaved && (
                                <button 
                                  onClick={() => handleEditReferenceRule(rule.id)}
                                  title="Chỉnh sửa" 
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                >
                                  <SquarePen className="w-4 h-4" />
                                </button>
                              )}
                              <button 
                                onClick={() => setReferenceRules(prev => prev.filter(r => r.id !== rule.id))}
                                title="Xóa" 
                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2 px-1">
                      <button 
                        onClick={handleAddReferenceRule}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95"
                      >
                        <Plus className="w-4 h-4 stroke-[3px]" />
                        Thêm quy tắc
                      </button>

                      {referenceRules.some(r => !r.isSaved) && (
                        <button 
                          onClick={handleSaveReferenceRules}
                          className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-all shadow-sm active:scale-95"
                        >
                          Lưu quy tắc
                        </button>
                      )}
                    </div>
                  </div>
                </RuleAccordion>
              </div>
            )}

            {activeTab === 'transform' && (
              <div className="flex flex-col">
                <RuleAccordion id="trans-1" title="Biến đổi định dạng dữ liệu">
                  <div className="space-y-6">
                    {transformRules.length > 0 && (
                      <div className="space-y-4">
                        {transformRules.map((rule) => (
                          <div key={rule.id} className={`flex gap-6 items-end p-5 rounded-xl border transition-all relative group ${rule.isSaved ? 'bg-slate-50 border-slate-200' : 'bg-white border-blue-200 shadow-sm'}`}>
                            <div className="flex-1 space-y-2">
                              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Trường áp dụng</label>
                              <select 
                                disabled={rule.isSaved}
                                value={rule.field}
                                onChange={(e) => handleUpdateTransformRule(rule.id, 'field', e.target.value)}
                                title="Trường áp dụng" 
                                className={`w-full px-3.5 py-2.5 rounded-lg text-[13px] transition-all focus:outline-none ${rule.isSaved ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white border-slate-300 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border'}`}
                              >
                                <option value="">-- Chọn trường --</option>
                                <option value="Họ và tên">Họ và tên</option>
                                <option value="Số CCCD/CMND">Số CCCD/CMND</option>
                                <option value="Ngày sinh">Ngày sinh</option>
                                <option value="Địa chỉ">Địa chỉ</option>
                              </select>
                            </div>
                            
                            <div className="flex-1 space-y-2">
                              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kiểu dữ liệu</label>
                              <select 
                                disabled={rule.isSaved}
                                value={rule.type}
                                onChange={(e) => handleUpdateTransformRule(rule.id, 'type', e.target.value)}
                                title="Kiểu dữ liệu" 
                                className={`w-full px-3.5 py-2.5 rounded-lg text-[13px] transition-all focus:outline-none ${rule.isSaved ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white border-slate-300 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border'}`}
                              >
                                <option value="">-- Chọn kiểu --</option>
                                <option value="Số thập phân">Số thập phân</option>
                                <option value="Số nguyên">Số nguyên</option>
                                <option value="Chuyển đôi từ unix timestamp">Chuyển đôi từ unix timestamp</option>
                                <option value="Thời gian">Thời gian</option>
                                <option value="Ngày tháng">Ngày tháng</option>
                                <option value="Chuỗi">Chuỗi</option>
                                <option value="Tiền tệ">Tiền tệ</option>
                              </select>
                            </div>

                            <div className="flex-1 space-y-2">
                              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Thông tin chuyển đổi</label>
                              <select 
                                disabled={rule.isSaved}
                                value={rule.info}
                                onChange={(e) => handleUpdateTransformRule(rule.id, 'info', e.target.value)}
                                title="Thông tin chuyển đổi" 
                                className={`w-full px-3.5 py-2.5 rounded-lg text-[13px] transition-all focus:outline-none ${rule.isSaved ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white border-slate-300 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border'}`}
                              >
                                <option value="">-- Chọn thông tin --</option>
                                <option value="dd/mm/yyyy">dd/mm/yyyy</option>
                                <option value="yyyy-mm-dd">yyyy-mm-dd</option>
                                <option value="0,000">0,000</option>
                                <option value="UPPERCASE">VIẾT HOA</option>
                                <option value="lowercase">viết thường</option>
                              </select>
                            </div>

                            <div className="flex-1 space-y-2">
                              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Giá trị</label>
                              <input 
                                type="text"
                                disabled={rule.isSaved}
                                value={rule.value}
                                onChange={(e) => handleUpdateTransformRule(rule.id, 'value', e.target.value)}
                                placeholder="Nhập giá trị..."
                                className={`w-full px-3.5 py-2.5 rounded-lg text-[13px] transition-all focus:outline-none ${rule.isSaved ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white border-slate-300 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border'}`}
                              />
                            </div>
                            
                            <div className="flex items-center gap-1 mb-1">
                              {rule.isSaved && (
                                <button 
                                  onClick={() => handleEditTransformRule(rule.id)}
                                  title="Chỉnh sửa" 
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                >
                                  <SquarePen className="w-4 h-4" />
                                </button>
                              )}
                              <button 
                                onClick={() => setTransformRules(prev => prev.filter(r => r.id !== rule.id))}
                                title="Xóa" 
                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2 px-1">
                      <button 
                        onClick={handleAddTransformRule}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95"
                      >
                        <Plus className="w-4 h-4 stroke-[3px]" />
                        Thêm quy tắc
                      </button>

                      {transformRules.some(r => !r.isSaved) && (
                        <button 
                          onClick={handleSaveTransformRules}
                          className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-all shadow-sm active:scale-95"
                        >
                          Lưu quy tắc
                        </button>
                      )}
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

      <TargetDatabaseConfigModal
        isOpen={isTargetConfigModalOpen}
        onClose={() => setIsTargetConfigModalOpen(false)}
        onBack={() => setIsTargetConfigModalOpen(false)}
        onDownloadTarget={handleDownloadTargetFromConfig}
        onNext={handleNextToMapping}
        initialData={targetConfigData}
      />

      <SelectTargetDatabaseModal
        isOpen={isSelectDBModalOpen}
        onClose={() => setIsSelectDBModalOpen(false)}
        onContinue={handleSelectTargetDB}
      />

      <DataMappingModal
        isOpen={isMappingModalOpen}
        onClose={() => setIsMappingModalOpen(false)}
        targetDatabase={selectedTargetDB}
        sourceDatasetName={activeService.name}
      />
    </div>
  );
}
