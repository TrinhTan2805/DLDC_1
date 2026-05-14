import * as React from 'react';
import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, AlertTriangle, AlertCircle, CheckCircle, Send, Download, Eye, Lock, EyeOff, SquarePen, X, Network, Plus, Trash2, ArrowLeftRight, Database, Clock } from 'lucide-react';

import { DataMappingModal } from './DataMappingModal';
import { SelectTargetDatabaseModal } from './SelectTargetDatabaseModal';
import { TargetDatabaseConfigModal } from './TargetDatabaseConfigModal';
import { ScheduleManagementModal } from './ScheduleManagementModal';
import { TargetDatabase } from './mockTargetDatabases';
import { StatusTag } from '../../common/StatusTag';
import { BaseModal } from '../../common/BaseModal';
import { Portal } from '../../common/Portal';

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
  const [activeTab, setActiveTab] = useState(isOnlyTransform ? 'transform' : 'mapping');
  const [isSendPopupOpen, setIsSendPopupOpen] = useState(false);
  const [isEditClassifyModalOpen, setIsEditClassifyModalOpen] = useState(false);
  const [isDeleteDataModalOpen, setIsDeleteDataModalOpen] = useState(false);
  const [isEditMappingCheckModalOpen, setIsEditMappingCheckModalOpen] = useState(false);
  const [isUpdateSuccessModalOpen, setIsUpdateSuccessModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastConfig, setToastConfig] = useState({ title: '', message: '' });

  const triggerToast = (title: string, message: string) => {
    setToastConfig({ title, message });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Mapping Flow States
  const [isSelectDBModalOpen, setIsSelectDBModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isTargetConfigModalOpen, setIsTargetConfigModalOpen] = useState(false);
  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);
  const [isHistoryDetailModalOpen, setIsHistoryDetailModalOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<any>(null);
  const [selectedTargetDB, setSelectedTargetDB] = useState<TargetDatabase | null>(null);
  const [targetConfigData, setTargetConfigData] = useState<any>(null);
  const [formatRules, setFormatRules] = useState<{ id: number, field: string, rule: string, action: string, replacementValue: string, isSaved: boolean }[]>([]);
  const [validityRules, setValidityRules] = useState<{
    id: number,
    field: string,
    rule: string,
    value: string,
    conditions: { id: string; field: string; operator: string; value: string }[],
    action: string,
    replacementValue: string,
    isSaved: boolean
  }[]>([]);

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
    setValidityRules(prev => [...prev, {
      id: Date.now(),
      field: '',
      rule: '',
      value: '',
      conditions: [{ id: `cond-${Date.now()}`, field: '', operator: '=', value: '' }],
      action: '',
      replacementValue: '',
      isSaved: false
    }]);
  };

  const handleUpdateValidityRule = (id: number, field: string, value: any) => {
    setValidityRules(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleAddValidityCondition = (ruleId: number) => {
    setValidityRules(prev => prev.map(r => r.id === ruleId ? {
      ...r,
      conditions: [...r.conditions, { id: `cond-${Date.now()}`, field: '', operator: '=', value: '' }]
    } : r));
  };

  const handleUpdateValidityCondition = (ruleId: number, condId: string, field: string, value: string) => {
    setValidityRules(prev => prev.map(r => r.id === ruleId ? {
      ...r,
      conditions: r.conditions.map(c => c.id === condId ? { ...c, [field]: value } : c)
    } : r));
  };

  const handleRemoveValidityCondition = (ruleId: number, condId: string) => {
    setValidityRules(prev => prev.map(r => r.id === ruleId ? {
      ...r,
      conditions: r.conditions.filter(c => c.id !== condId)
    } : r));
  };

  const handleSaveValidityRules = () => {
    setValidityRules(prev => prev.map(r => ({ ...r, isSaved: true })));
  };

  const handleEditValidityRule = (id: number) => {
    setValidityRules(prev => prev.map(r => r.id === id ? { ...r, isSaved: false } : r));
  };

  // Missing Value Rules Handlers
  const [missingValueRules, setMissingValueRules] = useState<{ id: number, field: string, type: string, sourceValue: string, value: string, isSaved: boolean }[]>([]);

  const handleAddMissingValueRule = () => {
    setMissingValueRules(prev => [...prev, { id: Date.now(), field: '', type: '', sourceValue: '', value: '', isSaved: false }]);
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
  const [transformRules, setTransformRules] = useState<{ id: number, field: string, type: string, info: string, value: string, isSaved: boolean }[]>([]);

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
  const [referenceRules, setReferenceRules] = useState<{ id: number, field: string, refTable: string, refField: string, action: string, isSaved: boolean }[]>([]);

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

  // Matching Rules Handlers (std-2)
  const [matchingConfig, setMatchingConfig] = useState({
    field: 'so_cccd',
    action: 'Giữ bản ghi mới nhất',
    sortField: 'ngay_cap_nhat'
  });

  const handleUpdateMatchingConfig = (field: string, value: string) => {
    setMatchingConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleOpenTargetConfig = () => {
    setIsSelectDBModalOpen(true);
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
    setIsMappingModalOpen(true);
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
    { id: '2961', dbName: 'CSDL_CongDan_TongHop_3', type: 'NEW', creator: 'administrator', time: '27-02-2026 14:18:21', status: 'SUCCESSFUL', fixedRecords: 481, fixAction: '', errorCode: '', serverId: '-1', startTime: '27-02-2026 14:18:31', endTime: '27-02-2026 14:19:25', processingTime: '55s', lastConnectTime: '' },
    { id: '2962', dbName: 'CSDL_CongDan_TongHop_3', type: 'DELETE', creator: 'administrator', time: '27-02-2026 14:17:47', status: 'SUCCESSFUL', fixedRecords: 0, fixAction: '', errorCode: '', serverId: '-1', startTime: '27-02-2026 14:17:50', endTime: '27-02-2026 14:18:00', processingTime: '10s', lastConnectTime: '' },
    { id: '2963', dbName: 'CSDL_CongDan_TongHop_3', type: 'NEW', creator: 'administrator', time: '27-02-2026 14:13:41', status: 'SUCCESSFUL', fixedRecords: 120, fixAction: '', errorCode: '', serverId: '-1', startTime: '27-02-2026 14:13:45', endTime: '27-02-2026 14:14:00', processingTime: '15s', lastConnectTime: '' },
    { id: '2964', dbName: 'CSDL_CongDan_TongHop_3', type: 'DELETE', creator: 'administrator', time: '27-02-2026 14:12:19', status: 'SUCCESSFUL', fixedRecords: 0, fixAction: '', errorCode: '', serverId: '-1', startTime: '27-02-2026 14:12:20', endTime: '27-02-2026 14:12:30', processingTime: '10s', lastConnectTime: '' },
    { id: '2965', dbName: 'CSDL_CongDan_TongHop_3', type: 'NEW', creator: 'administrator', time: '27-02-2026 13:48:16', status: 'SUCCESSFUL', fixedRecords: 350, fixAction: '', errorCode: '', serverId: '-1', startTime: '27-02-2026 13:48:20', endTime: '27-02-2026 13:49:00', processingTime: '40s', lastConnectTime: '' },
    { id: '2966', dbName: 'CSDL_CongDan_TongHop_3', type: 'DELETE', creator: 'administrator', time: '27-02-2026 13:44:06', status: 'SUCCESSFUL', fixedRecords: 0, fixAction: '', errorCode: '', serverId: '-1', startTime: '27-02-2026 13:44:10', endTime: '27-02-2026 13:44:15', processingTime: '5s', lastConnectTime: '' },
    { id: '2967', dbName: 'CSDL_CongDan_TongHop_3', type: 'NEW', creator: 'administrator', time: '27-02-2026 12:20:06', status: 'SUCCESSFUL', fixedRecords: 500, fixAction: '', errorCode: '', serverId: '-1', startTime: '27-02-2026 12:20:10', endTime: '27-02-2026 12:21:00', processingTime: '50s', lastConnectTime: '' },
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
            <div className="flex items-center gap-1.5">
              <button
                title="Chuyển đổi dữ liệu"
                className="p-2.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-all shadow-sm active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsUpdateSuccessModalOpen(true)}
                title="Cập nhật dữ liệu"
                className="p-2.5 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-all shadow-sm active:scale-95"
              >
                <Database className="w-5 h-5" />
              </button>
              <button
                title="Xóa dữ liệu"
                className="p-2.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl hover:bg-rose-100 transition-all shadow-sm active:scale-95"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsScheduleModalOpen(true)}
                title="Thêm lịch biểu"
                className="p-2.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-xl hover:bg-amber-100 transition-all shadow-sm active:scale-95"
              >
                <Clock className="w-5 h-5" />
              </button>

              <div className="w-px h-6 bg-slate-200 mx-2" />

            </div>
          </div>
          <p className="text-sm text-slate-500 mb-6">Nguồn dữ liệu: {systemName} | Dữ liệu {activeService.name.toLowerCase()}</p>

          {/* Stats Overview */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border border-blue-100 flex flex-col justify-center shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Số lượng Thu thập</span>
              <span className="text-3xl font-bold text-blue-600">50,000</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-emerald-100 flex flex-col justify-center shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Đã Làm sạch</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-emerald-600">49,850</span>
                <span className="text-[11px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">99.7%</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-indigo-100 flex flex-col justify-center shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Đã Chuẩn hóa</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-indigo-600">45,230</span>
                <span className="text-[11px] font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded">90.4%</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-purple-100 flex flex-col justify-center shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Đã Biến đổi</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-purple-600">45,230</span>
                <span className="text-[11px] font-bold text-purple-500 bg-purple-50 px-1.5 py-0.5 rounded">90.4%</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-rose-100 flex flex-col justify-center shadow-sm">
              <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider mb-2">Danh sách lỗi</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-rose-600">12</span>
                <span className="text-[11px] font-bold text-rose-400">0.02%</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          {!isOnlyTransform && (
            <div className="flex border-b border-slate-200 mb-6">
              <button
                onClick={() => setActiveTab('mapping')}
                className={`pb-3 px-4 text-sm font-medium border-b-2 mr-4 transition-colors ${activeTab === 'mapping'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
              >
                Cấu hình ánh xạ
              </button>
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

          <div className="pt-4 pb-32 overflow-y-auto max-h-[calc(100vh-320px)] pr-2 custom-scrollbar">
            {activeTab === 'mapping' && (
              <div className="flex flex-col">
                {!selectedTargetDB ? (
                  <div className="flex flex-col items-center justify-center pt-48 pb-60 bg-white border-2 border-dashed border-slate-200 rounded-2xl shadow-sm">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
                      <ArrowLeftRight className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">Chưa có cấu hình ánh xạ</h3>
                    <p className="text-slate-500 text-[15px] mb-10 max-w-lg text-center leading-relaxed">
                      Thiết lập ánh xạ giữa các trường của CSDL thu thập sang CSDL xử lý để bắt đầu áp dụng các quy tắc làm sạch, chuẩn hóa và biến đổi.
                    </p>
                    <button
                      onClick={handleOpenTargetConfig}
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all active:scale-95 shadow-sm whitespace-nowrap"
                    >
                      Cấu hình ánh xạ
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-[15px] font-bold text-slate-800">Bảng ánh xạ đã cấu hình</h3>
                        <p className="text-[13px] text-slate-500 mt-1">Tổng cộng 5 trường được ánh xạ</p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setIsDeleteDataModalOpen(true)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all active:scale-95 shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Xóa ánh xạ
                        </button>
                        <button
                          onClick={() => setIsEditMappingCheckModalOpen(true)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                        >
                          <ArrowLeftRight className="w-4 h-4" />
                          Chỉnh sửa ánh xạ
                        </button>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                            <th className="px-6 py-4">Trường nguồn</th>
                            <th className="px-6 py-4">Kiểu</th>
                            <th className="px-6 py-4 text-center w-20"></th>
                            <th className="px-6 py-4">Trường đích</th>
                            <th className="px-6 py-4">Kiểu</th>
                            <th className="px-6 py-4">Ghi chú</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {[
                            { source: 'HOCSINH.ID', sourceType: 'INT', target: 'CongDan.ID', targetType: 'INT', note: 'Khóa chính' },
                            { source: 'HOCSINH.HOTEN', sourceType: 'NVARCHAR(255)', target: 'CongDan.HoTen', targetType: 'NVARCHAR(255)', note: '' },
                            { source: 'HOCSINH.NGAYSINH', sourceType: 'DATE', target: 'CongDan.NgaySinh', targetType: 'DATE', note: '' },
                            { source: 'HOCSINH.GIOITINH', sourceType: 'VARCHAR(10)', target: 'CongDan.GioiTinh', targetType: 'VARCHAR(10)', note: '' },
                            { source: 'HOCSINH.DIP_RefId', sourceType: 'VARCHAR(4000)', target: 'CongDan.DIP_RefId', targetType: 'VARCHAR(4000)', note: 'Tham chiếu' },
                          ].map((mapping, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                              <td className="px-6 py-4 text-[13px] font-bold text-slate-700">{mapping.source}</td>
                              <td className="px-6 py-4 text-[12px] text-slate-500 font-mono">{mapping.sourceType}</td>
                              <td className="px-6 py-4 text-center">
                                <ArrowLeftRight className="w-4 h-4 text-slate-300 mx-auto" />
                              </td>
                              <td className="px-6 py-4 text-[13px] font-bold text-slate-900">{mapping.target}</td>
                              <td className="px-6 py-4 text-[12px] text-slate-500 font-mono">{mapping.targetType}</td>
                              <td className="px-6 py-4 text-[13px] text-slate-500 italic">{mapping.note}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

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
                                </select>
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
                                title="Xóa quy tắc"
                                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
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
                      <div className="space-y-6">
                        {validityRules.map((rule) => {
                          const isGroup = rule.rule === 'AND' || rule.rule === 'OR';

                          return (
                            <div key={rule.id} className={`p-6 rounded-2xl border transition-all relative ${rule.isSaved ? 'bg-slate-50 border-slate-200' : 'bg-white border-blue-200 shadow-lg'}`}>
                              {!isGroup ? (
                                <div className="flex gap-8 items-end">
                                  <div className="flex-1 space-y-2">
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Trường áp dụng</label>
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

                                  <div className="flex-[2] grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Điều kiện hợp lệ</label>
                                      <select
                                        disabled={rule.isSaved}
                                        value={rule.rule}
                                        onChange={(e) => handleUpdateValidityRule(rule.id, 'rule', e.target.value)}
                                        title="Điều kiện hợp lệ"
                                        className={`w-full px-3.5 py-2.5 rounded-lg text-[13px] transition-all focus:outline-none ${rule.isSaved ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white border-slate-300 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border'}`}
                                      >
                                        <option value="">-- Chọn điều kiện --</option>
                                        <option value="=">Bằng (=)</option>
                                        <option value="!=">Khác (!=)</option>
                                        <option value=">">Lớn hơn (&gt;)</option>
                                        <option value="<">Nhỏ hơn (&lt;)</option>
                                        <option value=">=">Lớn hơn hoặc bằng (&gt;=)</option>
                                        <option value="<=">Nhỏ hơn hoặc bằng (&lt;=)</option>
                                        <option value="IN">Thuộc danh sách (IN)</option>
                                        <option value="NOT IN">Không thuộc danh sách (NOT IN)</option>
                                        <option value="s%">Bắt đầu bằng (s%)</option>
                                        <option value="%s">Kết thúc bằng (%s)</option>
                                        <option value="%s%">Bao gồm (%s%)</option>
                                        <option value="REGEX">Khớp biểu thức nâng cao (REGEX)</option>
                                        <option value="AND">Kết hợp (AND)</option>
                                        <option value="OR">Hoặc (OR)</option>
                                      </select>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Giá trị kiểm tra</label>
                                      {(rule.rule === 'IN' || rule.rule === 'NOT IN') ? (
                                        <div className={`relative flex flex-wrap gap-1.5 p-1.5 min-h-[42px] rounded-lg border transition-all ${rule.isSaved ? 'bg-slate-100 border-slate-200' : 'bg-white border-slate-300 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500'}`}>
                                          {rule.value.split(',').filter(t => t.trim()).map((tag, idx) => (
                                            <StatusTag
                                              key={idx}
                                              label={tag.trim()}
                                              variant="blue"
                                              icon={!rule.isSaved && (
                                                <button
                                                  onClick={() => {
                                                    const tags = rule.value.split(',').filter((_, i) => i !== idx);
                                                    handleUpdateValidityRule(rule.id, 'value', tags.join(','));
                                                  }}
                                                  className="hover:text-blue-900"
                                                >
                                                  <X className="w-3 h-3" />
                                                </button>
                                              )}
                                            />
                                          ))}
                                          {!rule.isSaved && (
                                            <input
                                              type="text"
                                              placeholder="Nhập giá trị..."
                                              className="flex-1 bg-transparent border-none outline-none text-[13px] text-slate-700 min-w-[120px] px-1"
                                              onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                  const val = (e.target as HTMLInputElement).value.trim();
                                                  if (val) {
                                                    const currentTags = rule.value ? rule.value.split(',') : [];
                                                    if (!currentTags.includes(val)) {
                                                      handleUpdateValidityRule(rule.id, 'value', [...currentTags, val].join(','));
                                                    }
                                                    (e.target as HTMLInputElement).value = '';
                                                  }
                                                  e.preventDefault();
                                                }
                                              }}
                                            />
                                          )}
                                        </div>
                                      ) : (
                                        <input
                                          type="text"
                                          disabled={rule.isSaved}
                                          value={rule.value}
                                          onChange={(e) => handleUpdateValidityRule(rule.id, 'value', e.target.value)}
                                          placeholder="Nhập giá trị..."
                                          className={`w-full px-3.5 py-2.5 rounded-lg text-[13px] transition-all focus:outline-none ${rule.isSaved ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white border-slate-300 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border'}`}
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
                                      title="Xóa quy tắc"
                                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <select
                                      disabled={rule.isSaved}
                                      value={rule.rule}
                                      onChange={(e) => handleUpdateValidityRule(rule.id, 'rule', e.target.value)}
                                      className={`w-64 px-3 py-2 rounded-lg text-sm transition-all focus:outline-none ${rule.isSaved ? 'bg-slate-100 text-slate-500' : 'bg-white border-slate-300 border text-slate-700'}`}
                                      title="Logic Operator"
                                    >
                                      <option value="AND">AND</option>
                                      <option value="OR">OR</option>
                                    </select>
                                    <button
                                      onClick={() => setValidityRules(prev => prev.filter(r => r.id !== rule.id))}
                                      title="Xóa quy tắc"
                                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>

                                  <div className="space-y-3">
                                    <div className="flex gap-4 items-center px-1">
                                      <div className="flex-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Trường áp dụng</div>
                                      <div className="flex-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Điều kiện hợp lệ</div>
                                      <div className="flex-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Giá trị kiểm tra</div>
                                      {!rule.isSaved && <div className="w-8" />}
                                    </div>
                                    {rule.conditions.map((cond, idx) => (
                                      <div key={cond.id} className="flex gap-4 items-center">
                                        <select
                                          disabled={rule.isSaved}
                                          value={cond.field}
                                          onChange={(e) => handleUpdateValidityCondition(rule.id, cond.id, 'field', e.target.value)}
                                          className={`flex-1 px-3 py-2 rounded-lg text-sm transition-all focus:outline-none ${rule.isSaved ? 'bg-slate-100 text-slate-500' : 'bg-white border-slate-300 border text-slate-700'}`}
                                          title="Trường"
                                        >
                                          <option value="">-- Chọn trường --</option>
                                          <option value="DIP_RefId">DIP_RefId</option>
                                          <option value="Họ và tên">Họ và tên</option>
                                          <option value="Số CCCD/CMND">Số CCCD/CMND</option>
                                          <option value="Ngày sinh">Ngày sinh</option>
                                          <option value="Địa chỉ">Địa chỉ</option>
                                        </select>
                                        <select
                                          disabled={rule.isSaved}
                                          value={cond.operator}
                                          onChange={(e) => handleUpdateValidityCondition(rule.id, cond.id, 'operator', e.target.value)}
                                          className={`flex-1 px-3 py-2 rounded-lg text-sm transition-all focus:outline-none ${rule.isSaved ? 'bg-slate-100 text-slate-500' : 'bg-white border-slate-300 border text-slate-700'}`}
                                          title="Toán tử"
                                        >
                                          <option value="=">=</option>
                                          <option value="!=">!=</option>
                                          <option value=">">&gt;</option>
                                          <option value="<">&lt;</option>
                                          <option value=">=">&gt;=</option>
                                          <option value="<=">&lt;=</option>
                                          <option value="IN">IN</option>
                                          <option value="NOT IN">NOT IN</option>
                                        </select>
                                        <input
                                          type="text"
                                          disabled={rule.isSaved}
                                          value={cond.value}
                                          onChange={(e) => handleUpdateValidityCondition(rule.id, cond.id, 'value', e.target.value)}
                                          placeholder="0"
                                          className={`flex-1 px-3 py-2 rounded-lg text-sm transition-all focus:outline-none ${rule.isSaved ? 'bg-slate-100 text-slate-500' : 'bg-white border-slate-300 border text-slate-700'}`}
                                        />
                                        {!rule.isSaved && rule.conditions.length > 1 && (
                                          <button
                                            onClick={() => handleRemoveValidityCondition(rule.id, cond.id)}
                                            title="Xóa điều kiện"
                                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-all"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        )}
                                      </div>
                                    ))}
                                  </div>

                                  {!rule.isSaved && (
                                    <button
                                      onClick={() => handleAddValidityCondition(rule.id)}
                                      className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700 transition-all active:scale-95"
                                    >
                                      <Plus className="w-5 h-5 stroke-[3px]" />
                                    </button>
                                  )}
                                </div>
                              )}

                              <div className="flex-[1.5] space-y-2 mt-6 pt-6 border-t border-slate-100">
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Xử lý ngoại lệ</label>
                                <div className="flex gap-3">
                                  <select
                                    disabled={rule.isSaved}
                                    value={rule.action}
                                    onChange={(e) => handleUpdateValidityRule(rule.id, 'action', e.target.value)}
                                    title="Xử lý ngoại lệ"
                                    className={`flex-1 px-3.5 py-2.5 rounded-lg text-[13px] transition-all focus:outline-none ${rule.isSaved ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white border-slate-300 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border'}`}
                                  >
                                    <option value="">-- Chọn xử lý --</option>
                                    <option value="Loại bỏ bản ghi">Loại bỏ bản ghi</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          );
                        })}
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
                <RuleAccordion id="clean-3" title="Xử lý, thay thế giá trị, thiếu dữ liệu">
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
                              <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">Chọn điều kiện</label>
                              <select
                                disabled={rule.isSaved}
                                value={rule.type}
                                onChange={(e) => handleUpdateMissingValueRule(rule.id, 'type', e.target.value)}
                                title="Chọn điều kiện"
                                className={`w-full px-3.5 py-2.5 rounded-lg text-[13px] transition-all focus:outline-none ${rule.isSaved ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white border-slate-300 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border'}`}
                              >
                                <option value="">-- Chọn điều kiện --</option>
                                <option value="Bằng với">Bằng với</option>
                                <option value="Bắt đầu bằng">Bắt đầu bằng</option>
                                <option value="Kết thúc bằng">Kết thúc bằng</option>
                                <option value="Bao gồm">Bao gồm</option>
                              </select>
                            </div>

                            <div className="flex-1 space-y-2">
                              <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">Nhập giá trị nguồn</label>
                              <input
                                type="text"
                                disabled={rule.isSaved}
                                value={rule.sourceValue || ''}
                                onChange={(e) => handleUpdateMissingValueRule(rule.id, 'sourceValue', e.target.value)}
                                placeholder="VD: null, empty"
                                className={`w-full px-3.5 py-2.5 rounded-lg text-[13px] transition-all focus:outline-none ${rule.isSaved ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white border-slate-300 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border'}`}
                              />
                            </div>

                            <div className="flex-1 space-y-2">
                              <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">Giá trị thay thế</label>
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
                                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
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
                  <div className="bg-white p-5 rounded-xl border border-blue-200 shadow-sm">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Trường làm khóa đối sánh</label>
                        <select
                          value={matchingConfig.field}
                          onChange={(e) => handleUpdateMatchingConfig('field', e.target.value)}
                          title="Trường làm khóa đối sánh"
                          className="w-full px-3.5 py-2.5 rounded-lg text-[13px] bg-white border border-slate-300 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all focus:outline-none"
                        >
                          <option value="">-- Chọn trường --</option>
                          <option value="so_cccd">Số CCCD</option>
                          <option value="ma_so_thue">Mã số thuế</option>
                          <option value="so_dien_thoai">Số điện thoại</option>
                          <option value="email">Email</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Xử lý ngoại lệ</label>
                        <select
                          value={matchingConfig.action}
                          onChange={(e) => handleUpdateMatchingConfig('action', e.target.value)}
                          title="Xử lý ngoại lệ"
                          className="w-full px-3.5 py-2.5 rounded-lg text-[13px] bg-white border border-slate-300 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all focus:outline-none"
                        >
                          <option value="">-- Chọn xử lý --</option>
                          <option value="Giữ bản ghi mới nhất">Giữ bản ghi mới nhất</option>
                          <option value="Giữ bản ghi cũ nhất">Giữ bản ghi cũ nhất</option>
                          <option value="Từ chối toàn bộ các bản ghi trùng">Từ chối toàn bộ các bản ghi trùng</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Cột căn cứ sắp xếp</label>
                        <select
                          disabled={!(matchingConfig.action === 'Giữ bản ghi mới nhất' || matchingConfig.action === 'Giữ bản ghi cũ nhất')}
                          value={matchingConfig.sortField}
                          onChange={(e) => handleUpdateMatchingConfig('sortField', e.target.value)}
                          title="Cột căn cứ sắp xếp"
                          className={`w-full px-3.5 py-2.5 rounded-lg text-[13px] transition-all focus:outline-none ${!(matchingConfig.action === 'Giữ bản ghi mới nhất' || matchingConfig.action === 'Giữ bản ghi cũ nhất') ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white border-slate-300 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border'}`}
                        >
                          <option value="">-- Chọn trường --</option>
                          <option value="ngay_tao">Ngày tạo</option>
                          <option value="ngay_cap_nhat">Ngày cập nhật</option>
                          <option value="thoi_gian_gui">Thời gian gửi</option>
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
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95"
                      >
                        <Plus className="w-4 h-4 stroke-[3px]" />
                        Thêm quy tắc
                      </button>

                      {transformRules.some(r => !r.isSaved) && (
                        <button
                          onClick={handleSaveTransformRules}
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
                            <StatusTag
                              label={item.publicLevel}
                              variant={item.publicLevel === 'Công khai hạn chế' ? 'blue' : item.publicLevel === 'Nội bộ' ? 'orange' : 'red'}
                              icon={
                                <>
                                  {item.publicLevel === 'Công khai hạn chế' && <Eye className="w-3.5 h-3.5" />}
                                  {item.publicLevel === 'Nội bộ' && <Lock className="w-3.5 h-3.5" />}
                                  {item.publicLevel === 'Mật' && <EyeOff className="w-3.5 h-3.5" />}
                                </>
                              }
                            />
                          </td>
                          <td className="px-6 py-4 text-center">
                            <StatusTag
                              label={item.sensLevel}
                              variant={item.sensLevel === 'Thấp' ? 'emerald' : item.sensLevel === 'Cao' ? 'red' : 'red'}
                            />
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
                <div className="bg-white border border-slate-200 overflow-hidden">
                  <table className="w-full border-collapse">
                    <thead className="bg-[#e9ecef] border-b border-slate-300">
                      <tr>
                        <th className="px-6 py-4 text-center text-[13px] font-bold text-slate-700 whitespace-nowrap w-24">Hoạt động</th>
                        <th className="px-6 py-4 text-center text-[13px] font-bold text-slate-700 whitespace-nowrap">Loại</th>
                        <th className="px-6 py-4 text-center text-[13px] font-bold text-slate-700 whitespace-nowrap">Người tạo</th>
                        <th className="px-6 py-4 text-center text-[13px] font-bold text-slate-700 whitespace-nowrap">Thời gian</th>
                        <th className="px-6 py-4 text-center text-[13px] font-bold text-slate-700 whitespace-nowrap">Trạng thái</th>
                        <th className="px-6 py-4 text-center text-[13px] font-bold text-slate-700 whitespace-nowrap w-24">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {mockHistory.map((item, idx) => (
                        <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-blue-50/30 transition-all`}>
                          <td className="px-6 py-4 text-center text-[13px] text-slate-700">{idx + 1}</td>
                          <td className="px-6 py-4 text-center text-[13px] text-slate-700">{item.type}</td>
                          <td className="px-6 py-4 text-center text-[13px] text-slate-700">{item.creator}</td>
                          <td className="px-6 py-4 text-center text-[13px] text-slate-700">{item.time}</td>
                          <td className="px-6 py-4 text-center">
                            <StatusTag 
                              label={item.status === 'SUCCESSFUL' ? 'Thành công' : item.status} 
                              variant={item.status === 'SUCCESSFUL' ? 'emerald' : 'red'} 
                            />
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => { setSelectedHistory(item); setIsHistoryDetailModalOpen(true); }}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-all inline-flex items-center justify-center"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="py-3 text-center text-[13px] text-slate-700 border-t border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                    Xem tất cả
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>


      </div>

      {/* Popovers / Modals */}
      {/* Phân loại dữ liệu modal */}
      <BaseModal
        isOpen={isEditClassifyModalOpen}
        onClose={() => setIsEditClassifyModalOpen(false)}
        title="Cấu hình Phân loại Dữ liệu"
        subtitle="Thiết lập mức độ bảo mật và nhạy cảm cho bảng và các trường thông tin"
        maxWidth="max-w-4xl"
        customHeaderIcon={
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mr-4">
            <Lock className="w-6 h-6" />
          </div>
        }
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <button
              onClick={() => setIsEditClassifyModalOpen(false)}
              className="px-6 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
            >
              Hủy bỏ
            </button>
            <button
              onClick={() => {
                setIsEditClassifyModalOpen(false);
              }}
              className="px-8 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
            >
              Lưu cấu hình
            </button>
          </div>
        }
      >
        <div className="py-2 space-y-8">
          {/* Phân loại cấp Bảng */}
          <div>
            <h4 className="text-[15px] font-bold text-slate-800 mb-4 flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              Phân loại toàn bảng (Áp dụng mặc định)
            </h4>
            <div className="grid grid-cols-2 gap-8 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
              <div className="relative z-10 space-y-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Mức độ công khai</label>
                <select title="Mức độ công khai" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-700 focus:outline-none focus:border-blue-500 transition-all">
                  <option>Công khai</option>
                  <option>Công khai hạn chế</option>
                  <option selected>Nội bộ</option>
                  <option>Mật</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-2 font-medium">Áp dụng cho các trường chưa được cấu hình riêng lẻ.</p>
              </div>
              <div className="relative z-10 space-y-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Mức độ nhạy cảm</label>
                <select title="Mức độ nhạy cảm" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-700 focus:outline-none focus:border-blue-500 transition-all">
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
            <h4 className="text-[15px] font-bold text-slate-800 mb-4 flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-fuchsia-600"></div>
              Phân loại các trường ngoại lệ
            </h4>
            <p className="text-sm text-slate-500 mb-5 font-medium">
              Cấu hình mức độ cho các trường thông tin cụ thể (mức độ này sẽ ưu tiên ghi đè lên mức phân loại toàn bảng).
            </p>

            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    <th className="px-6 py-4 w-[30%]">Tên trường</th>
                    <th className="px-6 py-4 w-[35%]">Mức độ công khai</th>
                    <th className="px-6 py-4 w-[35%]">Mức độ nhạy cảm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockClassification.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-700 text-[13px]">{item.field}</td>
                      <td className="px-6 py-4">
                        <select title="Mức công khai" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-700 focus:outline-none focus:border-blue-500 transition-all" defaultValue={item.publicLevel}>
                          <option className="text-slate-400">-- Theo mặc định bảng --</option>
                          <option>Công khai</option>
                          <option>Công khai hạn chế</option>
                          <option>Nội bộ</option>
                          <option>Mật</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <select title="Mức nhạy cảm" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-700 focus:outline-none focus:border-blue-500 transition-all" defaultValue={item.sensLevel}>
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
                  <tr className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-400 group-hover:text-slate-700 text-[13px] transition-colors">Địa chỉ thường trú</td>
                    <td className="px-6 py-4">
                      <select title="Mức công khai" className="w-full px-4 py-2 bg-transparent border border-slate-200 border-dashed rounded-xl text-[13px] text-slate-400 focus:text-slate-700 focus:border-blue-500 focus:border-solid transition-all">
                        <option selected className="text-slate-400">-- Theo mặc định bảng --</option>
                        <option>Công khai</option>
                        <option>Công khai hạn chế</option>
                        <option>Nội bộ</option>
                        <option>Mật</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select title="Mức nhạy cảm" className="w-full px-4 py-2 bg-transparent border border-slate-200 border-dashed rounded-xl text-[13px] text-slate-400 focus:text-slate-700 focus:border-blue-500 focus:border-solid transition-all">
                        <option selected className="text-slate-400">-- Theo mặc định bảng --</option>
                        <option>Thấp</option>
                        <option>Trung bình</option>
                        <option>Cao</option>
                        <option>Rất cao</option>
                      </select>
                    </td>
                  </tr>
                  {/* Empty state entry 2 */}
                  <tr className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-400 group-hover:text-slate-700 text-[13px] transition-colors">Quê quán</td>
                    <td className="px-6 py-4">
                      <select title="Mức công khai" className="w-full px-4 py-2 bg-transparent border border-slate-200 border-dashed rounded-xl text-[13px] text-slate-400 focus:text-slate-700 focus:border-blue-500 focus:border-solid transition-all">
                        <option selected className="text-slate-400">-- Theo mặc định bảng --</option>
                        <option>Công khai</option>
                        <option>Công khai hạn chế</option>
                        <option>Nội bộ</option>
                        <option>Mật</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select title="Mức nhạy cảm" className="w-full px-4 py-2 bg-transparent border border-slate-200 border-dashed rounded-xl text-[13px] text-slate-400 focus:text-slate-700 focus:border-blue-500 focus:border-solid transition-all">
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
      </BaseModal>


      {/* Xác nhận gửi modal */}
      <BaseModal
        isOpen={isSendPopupOpen}
        onClose={() => setIsSendPopupOpen(false)}
        title="Xác nhận gửi yêu cầu xử lý"
        maxWidth="max-w-lg"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <button
              onClick={() => setIsSendPopupOpen(false)}
              className="px-6 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
            >
              Hủy bỏ
            </button>
            <button
              onClick={() => setIsSendPopupOpen(false)}
              className="px-8 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-md shadow-blue-200"
            >
              <Send className="w-4 h-4" />
              Xác nhận Gửi
            </button>
          </div>
        }
      >
        <div className="py-4">
          <div className="flex gap-5">
            <div className="w-14 h-14 shrink-0 bg-blue-50 border-2 border-blue-100 rounded-2xl flex items-center justify-center shadow-sm">
              <Send className="w-6 h-6 text-blue-600" />
            </div>
            <div className="space-y-3">
              <p className="text-slate-600 text-[15px] leading-relaxed">
                Hệ thống sẽ chuyển danh sách gồm <strong className="text-slate-900 font-bold underline decoration-blue-200 decoration-4">10 bản ghi lỗi (Chưa xử lý)</strong> về hệ thống nghiệp vụ nguồn (<span className="font-bold text-blue-700">{systemName}</span>) để rà soát và khắc phục dữ liệu gốc.
              </p>
              <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-amber-700 text-xs font-medium italic">
                  Lưu ý: Các bản ghi "Đã gửi về hệ thống nguồn" sẽ không bị ảnh hưởng bởi hành động này.
                </p>
              </div>
            </div>
          </div>
        </div>
      </BaseModal>




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

      <ScheduleManagementModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        systemName={systemName}
        datasetName={activeService.name}
      />

      {/* History Detail Modal */}
      {isHistoryDetailModalOpen && (
        <Portal>
          <div
            className="fixed inset-0 bg-black/60 z-[99999] flex items-center justify-center p-4"
            onClick={() => setIsHistoryDetailModalOpen(false)}
          >
            <div
              className="w-full max-w-4xl bg-white rounded-md shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setIsHistoryDetailModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all z-20"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8">
                <div className="grid grid-cols-2 gap-x-10 gap-y-0 text-[13px]">
                  {/* Column 1 */}
                  <div className="flex flex-col">
                    <div className="flex px-3 py-3 bg-slate-50/50 border-b border-white">
                      <div className="w-[140px] font-bold text-slate-700">Mã yêu cầu:</div>
                      <div className="flex-1 text-slate-700 text-right">{selectedHistory?.id}</div>
                    </div>
                    <div className="flex px-3 py-3 border-b border-white">
                      <div className="w-[140px] font-bold text-slate-700">Tên CSDL:</div>
                      <div className="flex-1 text-slate-700 text-right truncate">{selectedHistory?.dbName}</div>
                    </div>
                    <div className="flex px-3 py-3 bg-slate-50/50 border-b border-white">
                      <div className="w-[140px] font-bold text-slate-700">Trạng thái:</div>
                      <div className="flex-1 text-slate-700 text-right">{selectedHistory?.status}</div>
                    </div>
                    <div className="flex px-3 py-3 border-b border-white">
                      <div className="w-[200px] font-bold text-slate-700">Số liệu không đạt chuẩn đã được khắc phục:</div>
                      <div className="flex-1 text-slate-700 text-right">{selectedHistory?.fixedRecords}</div>
                    </div>
                    <div className="flex px-3 py-3 bg-slate-50/50 border-b border-white">
                      <div className="w-[140px] font-bold text-slate-700">Hoạt động khắc phục:</div>
                      <div className="flex-1 text-slate-700 text-right">{selectedHistory?.fixAction || ''}</div>
                    </div>
                    <div className="flex px-3 py-3 border-b border-white">
                      <div className="w-[140px] font-bold text-slate-700">Mã lỗi:</div>
                      <div className="flex-1 text-slate-700 text-right">{selectedHistory?.errorCode}</div>
                    </div>
                    <div className="flex px-3 py-3 bg-slate-50/50 border-b border-white">
                      <div className="w-[140px] font-bold text-slate-700">Thông Tin máy chủ:</div>
                      <div className="flex-1 text-slate-700 text-right">{selectedHistory?.serverId}</div>
                    </div>
                    <div className="flex px-3 py-3 border-b border-white">
                      <div className="w-[140px] font-bold text-slate-700">Loại:</div>
                      <div className="flex-1 text-slate-700 text-right">{selectedHistory?.type}</div>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="flex flex-col">
                    <div className="flex px-3 py-3 bg-slate-50/50 border-b border-white">
                      <div className="w-[140px] font-bold text-slate-700">Người tạo:</div>
                      <div className="flex-1 text-slate-700 text-right">{selectedHistory?.creator}</div>
                    </div>
                    <div className="flex px-3 py-3 border-b border-white">
                      <div className="w-[140px] font-bold text-slate-700">Thời gian khởi tạo:</div>
                      <div className="flex-1 text-slate-700 text-right">{selectedHistory?.time}</div>
                    </div>
                    <div className="flex px-3 py-3 bg-slate-50/50 border-b border-white">
                      <div className="w-[160px] font-bold text-slate-700">Thời gian kết nối lần cuối:</div>
                      <div className="flex-1 text-slate-700 text-right">{selectedHistory?.lastConnectTime}</div>
                    </div>
                    <div className="flex px-3 py-3 border-b border-white">
                      <div className="w-[140px] font-bold text-slate-700">Thời gian bắt đầu:</div>
                      <div className="flex-1 text-slate-700 text-right">{selectedHistory?.startTime}</div>
                    </div>
                    <div className="flex px-3 py-3 bg-slate-50/50 border-b border-white">
                      <div className="w-[140px] font-bold text-slate-700">Thời gian hoàn thành:</div>
                      <div className="flex-1 text-slate-700 text-right">{selectedHistory?.endTime}</div>
                    </div>
                    <div className="flex px-3 py-3 border-b border-white">
                      <div className="w-[140px] font-bold text-slate-700">Thời gian xử lý:</div>
                      <div className="flex-1 text-slate-700 text-right">{selectedHistory?.processingTime}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
      {/* Delete Data Confirmation Modal */}
      {(isDeleteDataModalOpen || isEditMappingCheckModalOpen) && (
        <Portal>
          <div className="fixed inset-0 bg-black/60 z-[99999] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-8">
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-8 mx-auto">
                  <AlertCircle className="w-10 h-10 text-rose-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 text-center mb-4">
                  {isDeleteDataModalOpen ? 'Xác nhận xóa ánh xạ?' : 'Yêu cầu xóa dữ liệu'}
                </h3>
                <p className="text-slate-500 text-center text-[16px] leading-relaxed mb-10 px-4">
                  Hệ thống yêu cầu bạn phải <strong>xóa toàn bộ dữ liệu đã thu thập và xử lý</strong> trước khi thực hiện {isDeleteDataModalOpen ? 'xóa' : 'chỉnh sửa'} cấu hình ánh xạ để đảm bảo tính nhất quán của dữ liệu.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      const wasDelete = isDeleteDataModalOpen;
                      setIsDeleteDataModalOpen(false);
                      setIsEditMappingCheckModalOpen(false);
                      if (wasDelete) {
                        setSelectedTargetDB(null);
                      }
                      triggerToast('Thành công!', 'Xóa dữ liệu thành công.');
                    }}
                    className="w-full py-3.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100 active:scale-95"
                  >
                    Xác nhận xóa dữ liệu
                  </button>
                  <button
                    onClick={() => {
                      setIsDeleteDataModalOpen(false);
                      setIsEditMappingCheckModalOpen(false);
                    }}
                    className="w-full py-3.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all active:scale-95"
                  >
                    Hủy bỏ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* Toast Notification */}
      {showToast && (
        <Portal>
          <div className="fixed top-24 right-6 z-[1000000] transform transition-all duration-300 ease-out">
            <div className="flex items-center gap-4 px-5 py-4 bg-white border border-slate-200 rounded-xl shadow-2xl min-w-[320px] ring-1 ring-black/5">
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-slate-900">{toastConfig.title}</p>
                <p className="text-[13px] text-slate-500">{toastConfig.message}</p>
              </div>
              <button 
                onClick={() => setShowToast(false)}
                className="ml-auto p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Portal>
      )}

      <BaseModal
        isOpen={isUpdateSuccessModalOpen}
        onClose={() => setIsUpdateSuccessModalOpen(false)}
        title="Chuyển đổi dữ liệu"
        maxWidth="max-w-md"
      >
        <div className="flex flex-col items-center py-4">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-5 ring-4 ring-emerald-50/30">
            <CheckCircle className="w-7 h-7 text-emerald-600" />
          </div>
          <p className="text-slate-800 text-[15px] font-bold text-center leading-relaxed px-4 mb-6">
            Khởi tạo yêu cầu cập nhật dữ liệu thành công!
          </p>
          <div className="flex justify-center w-full">
            <button 
              onClick={() => setIsUpdateSuccessModalOpen(false)}
              style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 500 }}
              className="bg-white text-[#020817] border border-[#e2e8f0] text-sm hover:bg-slate-50 transition-all shadow-sm active:scale-95"
            >
              Đóng
            </button>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
