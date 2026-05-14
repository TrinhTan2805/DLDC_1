import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, RefreshCw, Search, Plus, Eye, Edit, Settings as SettingsIcon, Trash2, FileText, Activity, Settings, AlertCircle, AlertTriangle, X, Download, Send, ChevronLeft, ChevronRight, Calendar, Wrench, Power, Layers, Database, Eraser } from 'lucide-react';
import { AddServiceModal, EditServiceModal, DeleteServiceModal, SettingsServiceModal } from './ServiceModals';
import { ViewServiceModal } from './ViewServiceModal';
import { LogManagement } from './LogManagement';
import { mockCollectionServices } from './mockCollectionServices';
import { ServiceDataDetailPage } from './ServiceDataDetailPage';
import { Portal } from '../../common/Portal';
import { StatusTag } from '../../common/StatusTag';

export function CollectionSetupPage({ onNavigate }: { onNavigate?: (pageId: string) => void }) {
  const [activeTab, setActiveTab] = useState<'service-setup' | 'version'>('service-setup');
  const location = useLocation();
  const navigate = useNavigate();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const action = pathParts[1];
  const urlId = pathParts[2];

  const showAddServiceModal = action === 'add';
  const showEditServiceModal = action === 'edit' && !!urlId;
  const showDetailModal = action === 'view' && !!urlId;
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'general';

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showErrorDetailModal, setShowErrorDetailModal] = useState(false);
  const [showDataDetailPage, setShowDataDetailPage] = useState(false);
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [inactiveReason, setInactiveReason] = useState('');
  const [selectedService, setSelectedService] = useState<any>(null);

  useEffect(() => {
    if (urlId) {
      const service = mockCollectionServices.find(s => s.id === Number(urlId));
      if (service) setSelectedService(service);
    }
  }, [urlId]);

  const closeModal = () => navigate('/collection-setup');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all'); // New: nguß╗ôn dß╗» liß╗çu filter
  const [departmentFilter, setDepartmentFilter] = useState('all'); // New: cß╗Ñc/vß╗Ñ filter
  const [navigateToPage, setNavigateToPage] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const handleNavLog = (e: any) => {
      navigate('/collection-setup');
      setActiveTab('version');
      if (e.detail?.logId) {
        setNavigateToPage(e.detail.logId.toString());
      }
    };
    window.addEventListener('NAVIGATE_TO_LOG', handleNavLog);
    return () => window.removeEventListener('NAVIGATE_TO_LOG', handleNavLog);
  }, []);

  // Get current month's first and last day
  const getCurrentMonthRange = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      start: firstDay.toISOString().split('T')[0],
      end: lastDay.toISOString().split('T')[0]
    };
  };

  const defaultRange = getCurrentMonthRange();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const mockServices = mockCollectionServices;

  // Helper function to reset all filters
  const resetFilters = () => {
    setSearchText('');
    setSourceFilter('all');
    setDepartmentFilter('all');
    setStatusFilter('all');
    setTypeFilter('all');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  // Helper function to parse date string DD/MM/YYYY HH:mm:ss
  const parseDate = (dateStr: string) => {
    if (!dateStr) return null;
    const [datePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  // Helper function to filter services (date range is just for display, not filtering)
  const filterServices = (services: any[]) => {
    return services.filter(service => {
      // Date filtering based on updatedAt
      let matchesDate = true;
      if (startDate || endDate) {
        const updateDate = parseDate(service.updatedAt);
        if (updateDate) {
          if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            if (updateDate < start) matchesDate = false;
          }
          if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (updateDate > end) matchesDate = false;
          }
        }
      }

      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'active' ? (!service.status?.startsWith('draft') && !service.status?.startsWith('inactive')) : service.status === statusFilter);

      return matchesDate &&
        matchesStatus &&
        (typeFilter === 'all' || service.type === typeFilter) &&
        (sourceFilter === 'all' || service.source === sourceFilter) &&
        (departmentFilter === 'all' || service.department === departmentFilter) &&
        (searchText === '' ||
          service.name.toLowerCase().includes(searchText.toLowerCase()) ||
          service.code.toLowerCase().includes(searchText.toLowerCase()) ||
          service.managingUnit.toLowerCase().includes(searchText.toLowerCase())
        );
    });
  };

  const filteredServices = filterServices(mockServices);

  const stats = {
    total: mockServices.length,
    active: mockServices.filter(s => s.status === 'success').length,
    maintenance: mockServices.filter(s => s.status === 'format_error').length,
    inactive: mockServices.filter(s => s.status === 'structure_error').length
  };

  // Function to send notification to source system
  const sendNotificationToSource = (service: any) => {
    console.log(`Gß╗¡i th├┤ng b├ío cho hß╗ç thß╗æng ${service.name}:`, {
      code: service.code,
      status: service.statusText,
      time: new Date().toLocaleString('vi-VN'),
      message: service.status === 'success'
        ? `Kiß╗âm tra cß║Ñu tr├║c th├ánh c├┤ng. ─É├ú nhß║¡n ${service.recordsReceived} bß║ún ghi.`
        : `Kiß╗âm tra cß║Ñu tr├║c thß║Ñt bß║íi: ${service.errorDetails?.errorMessage || 'Lß╗ùi kh├┤ng x├íc ─æß╗ïnh'}`
    });

    alert(`Γ£à ─É├ú gß╗¡i th├┤ng b├ío tß╗▒ ─æß╗Öng cho ${service.managingUnit}\n\nTrß║íng th├íi: ${service.statusText}\nThß╗¥i gian: ${new Date().toLocaleString('vi-VN')}`);
  };

  // Export function for service list
  const handleExportServiceList = () => {
    alert('─Éang kß║┐t xuß║Ñt danh s├ích dß╗ïch vß╗Ñ ra file Excel...');
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('service-setup')}
            className={`pb-3 pt-4 text-sm transition-colors border-b-2 ${activeTab === 'service-setup'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
          >
            Thiß║┐t lß║¡p dß╗ïch vß╗Ñ
          </button>
          <button
            onClick={() => setActiveTab('version')}
            className={`pb-3 pt-4 text-sm transition-colors border-b-2 ${activeTab === 'version'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
          >
            Quß║ún l├╜ nhß║¡t k├╜
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Tab: Thiß║┐t lß║¡p dß╗ïch vß╗Ñ */}
        {activeTab === 'service-setup' && (
          <div className="space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Tß╗òng sß╗æ dß╗ïch vß╗Ñ ─æ├ú thiß║┐t lß║¡p</div>
                    <div className="text-2xl text-slate-900">{stats.total}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Activity className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">─Éang hoß║ít ─æß╗Öng</div>
                    <div className="text-2xl text-slate-900">{stats.active}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <Settings className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Bß║ún nh├íp</div>
                    <div className="text-2xl text-slate-900">{stats.maintenance}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Ng╞░ng hoß║ít ─æß╗Öng</div>
                    <div className="text-2xl text-slate-900">{stats.inactive}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Actions */}
            <div className="mb-6">
              {/* Row 1: Search and Buttons */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 flex items-center gap-3">
                  <div className="relative flex-1">
                    <input aria-label="Input field"
                      type="text"
                      placeholder="T├¼m kiß║┐m theo t├¬n dß╗ïch vß╗Ñ, hß╗ç thß╗æng nguß╗ôn"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </div>
                  <button className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-sm flex items-center justify-center">
                    <Search className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-2 rounded-lg transition-colors shadow-sm flex items-center justify-center border ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-500' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    title="Bß╗Ö lß╗ìc"
                  >
                    {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleExportServiceList}
                    className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm shadow-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Kß║┐t xuß║Ñt
                  </button>
                  <button
                    onClick={() => navigate('/collection-setup/add')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm shadow-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Th├¬m mß╗¢i
                  </button>
                </div>
              </div>

              {/* Row 2: Filters (Collapsible) */}
              {showFilters && (
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 grid grid-cols-6 gap-4 mt-4 animate-in slide-in-from-top-2 duration-200 shadow-sm relative">
                  <div className="absolute -top-2 right-[200px] w-4 h-4 bg-slate-50 border-t border-l border-slate-200 transform rotate-45"></div>

                  <div className="space-y-1.5 relative z-10">
                    <label className="text-xs font-bold text-slate-700">Loß║íi kß║┐t nß╗æi</label>
                    <select aria-label="Select box"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                    >
                      <option value="all">Tß║Ñt cß║ú ph╞░╞íng thß╗⌐c</option>
                      <option value="C╞í sß╗ƒ dß╗» liß╗çu">C╞í sß╗ƒ dß╗» liß╗çu</option>
                      <option value="API">API</option>
                      <option value="Tß║úi file Excel">Tß║úi file Excel</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 relative z-10">
                    <label className="text-xs font-bold text-slate-700">Nguß╗ôn dß╗» liß╗çu</label>
                    <select aria-label="Select box"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                      value={sourceFilter}
                      onChange={(e) => setSourceFilter(e.target.value)}
                    >
                      <option value="all">Tß║Ñt cß║ú nguß╗ôn dß╗» liß╗çu</option>
                      <option value="Trong ng├ánh">Trong ng├ánh</option>
                      <option value="Ngo├ái ng├ánh">Ngo├ái ng├ánh</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 relative z-10">
                    <label className="text-xs font-bold text-slate-700">Hß╗ç thß╗æng nguß╗ôn</label>
                    <select aria-label="Select box"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                    >
                      <option value="all">Tß║Ñt cß║ú hß╗ç thß╗æng nguß╗ôn</option>
                      <option value="Bß╗Ö ng├ánh ngo├ái">Bß╗Ö ng├ánh ngo├ái</option>
                      <option value="Cß╗Ñc H├ánh ch├¡nh t╞░ ph├íp">Cß╗Ñc H├ánh ch├¡nh t╞░ ph├íp</option>
                      <option value="Cß╗Ñc Quß║ún l├╜ thi h├ánh ├ín d├ón sß╗▒">Cß╗Ñc Quß║ún l├╜ thi h├ánh ├ín d├ón sß╗▒</option>
                      <option value="Cß╗Ñc ─É─âng k├╜ giao dß╗ïch bß║úo ─æß║úm">Cß╗Ñc ─É─âng k├╜ giao dß╗ïch bß║úo ─æß║úm</option>
                      <option value="Cß╗Ñc Kiß╗âm tra v─ân bß║ún">Cß╗Ñc Kiß╗âm tra v─ân bß║ún</option>
                      <option value="Cß╗Ñc Bß╗ò trß╗ú t╞░ ph├íp">Cß╗Ñc Bß╗ò trß╗ú t╞░ ph├íp</option>
                      <option value="Vß╗Ñ Hß╗úp t├íc quß╗æc tß║┐">Vß╗Ñ Hß╗úp t├íc quß╗æc tß║┐</option>
                      <option value="Cß╗Ñc Kß║┐ hoß║ích - T├ái ch├¡nh">Cß╗Ñc Kß║┐ hoß║ích - T├ái ch├¡nh</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 relative z-10">
                    <label className="text-xs font-bold text-slate-700">Trß║íng th├íi</label>
                    <select aria-label="Select box"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">Tß║Ñt cß║ú trß║íng th├íi</option>
                      <option value="draft">Bß║ún nh├íp</option>
                      <option value="active">Hoß║ít ─æß╗Öng</option>
                      <option value="inactive">Ng╞░ng hoß║ít ─æß╗Öng</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 relative z-10">
                    <label className="text-xs font-bold text-slate-700">Thß╗¥i gian tß╗½</label>
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                      <input aria-label="Input field"
                        type="date"
                        className="w-full border-0 bg-transparent text-sm focus:outline-none text-slate-700 p-0"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  </div>

                  <div className="space-y-1.5 relative z-10">
                    <label className="text-xs font-bold text-slate-700">Thß╗¥i gian ─æß║┐n</label>
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                      <input aria-label="Input field"
                        type="date"
                        className="w-full border-0 bg-transparent text-sm focus:outline-none text-slate-700 p-0"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Services Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-[1]">
                    <tr>
                      <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap w-12">STT</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">T├¬n dß╗ïch vß╗Ñ</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">Loß║íi nguß╗ôn</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">Ph╞░╞íng thß╗⌐c kß║┐t nß╗æi</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap w-20">Phi├¬n bß║ún</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">Hß╗ç thß╗æng nguß╗ôn</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">Ng├áy tß║ío</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">Trß║íng th├íi dß╗ïch vß╗Ñ</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">Trß║íng th├íi dß╗» liß╗çu</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap w-64">Thao t├íc</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredServices
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((service, index) => (
                        <tr key={service.id} className="hover:bg-blue-50/30 transition-all group">
                          <td className="px-4 py-4 text-center text-sm text-slate-500 font-medium">{index + 1}</td>
                          <td className="px-4 py-4 text-left">
                            <div className="max-w-xs">
                              <div className="text-sm font-semibold text-slate-900 leading-snug">{service.name}</div>
                              {service.description && <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">{service.description}</div>}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <StatusTag 
                              label={service.source} 
                              variant={service.source === 'Trong ng├ánh' ? 'blue' : 'purple'} 
                            />
                          </td>
                          <td className="px-4 py-4 text-center">
                            <StatusTag 
                              label={service.type === 'SOAP' ? 'C╞í sß╗ƒ dß╗» liß╗çu' : service.type === 'REST' ? 'API' : 'Tß║úi file Excel'} 
                              variant={service.type === 'SOAP' ? 'indigo' : service.type === 'REST' ? 'emerald' : 'amber'} 
                            />
                          </td>
                          <td className="px-4 py-4 text-center text-sm text-slate-600 font-medium font-mono">{service.version}</td>
                          <td className="px-4 py-4 text-center text-sm text-slate-600 font-medium max-w-[120px]">
                            <div className="leading-tight">{service.managingUnit}</div>
                          </td>
                          <td className="px-4 py-4 text-center text-sm text-slate-500 font-medium font-mono whitespace-nowrap">
                            {service.updatedAt.split(' ').map((part: string, i: number) => (
                              <div key={i}>{part}</div>
                            ))}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <StatusTag 
                              label={service.status === 'draft' ? 'Bß║ún nh├íp' : service.status === 'inactive' ? 'Ng╞░ng hoß║ít ─æß╗Öng' : 'Hoß║ít ─æß╗Öng'} 
                              variant={service.status === 'draft' ? 'slate' : service.status === 'inactive' ? 'gray' : 'green'} 
                            />
                          </td>
                          <td className="px-4 py-4 text-center">
                            {(() => {
                              const dataStatus = service.dataStatus || (service.status === 'success' ? 'DATA_UPDATED' : service.status === 'inactive' ? 'EMPTY' : service.status?.startsWith('failed') ? 'DATA_UPDATE_FAILED' : 'EMPTY');
                              const label = dataStatus === 'EMPTY' ? 'Rß╗ùng' :
                                dataStatus === 'PROCESSING' ? '─Éang lß║Ñy dß╗» liß╗çu' :
                                dataStatus === 'DATA_UPDATED' ? 'Cß║¡p nhß║¡t th├ánh c├┤ng' :
                                dataStatus === 'DATA_INCOMPLETED' ? 'Lß╗ùi cß║Ñu tr├║c' :
                                'Lß╗ùi cß║¡p nhß║¡t';
                              const variant = dataStatus === 'EMPTY' ? 'slate' :
                                dataStatus === 'PROCESSING' ? 'blue' :
                                dataStatus === 'DATA_UPDATED' ? 'emerald' :
                                dataStatus === 'DATA_INCOMPLETED' ? 'orange' :
                                'red';
                              return <StatusTag label={label} variant={variant as any} />;
                            })()}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                                onClick={() => {
                                  if (onNavigate) {
                                    onNavigate('data-info-civil-registry');
                                  } else {
                                    setSelectedService(service);
                                    setShowDataDetailPage(true);
                                  }
                                }}
                              >
                                <Layers className="w-4 h-4" />
                              </button>
                              <button
                                className="p-1.5 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-all"
                                title="Cß║¡p nhß║¡t dß╗» liß╗çu"
                                onClick={() => alert(`Cß║¡p nhß║¡t dß╗» liß╗çu cho ${service.name}`)}
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                              <button
                                className="p-1.5 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-all"
                                title="T├¡ch hß╗úp mß╗¢i"
                                onClick={() => alert(`T├¡ch hß╗úp mß╗¢i cho ${service.name}`)}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                              <button
                                className="p-1.5 text-amber-500 hover:text-amber-600 hover:bg-amber-50 rounded transition-all"
                                title="Ngß╗½ng hoß║ít ─æß╗Öng"
                                onClick={() => {
                                  setSelectedService(service);
                                  setShowInactiveModal(true);
                                }}
                              >
                                <Power className="w-4 h-4" />
                              </button>
                              <button
                                className="p-1.5 text-orange-500 hover:text-orange-600 hover:bg-orange-50 rounded transition-all"
                                title="X├│a dß╗» liß╗çu thu thß║¡p"
                                onClick={() => alert(`X├│a dß╗» liß╗çu thu thß║¡p cß╗ºa ${service.name}`)}
                              >
                                <Eraser className="w-4 h-4" />
                              </button>
                              <button
                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                                title="Quß║ún l├╜"
                                onClick={() => {
                                  setSelectedService(service);
                                  navigate(`/collection-setup/view/${service.id}`);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                                title="X├│a dß╗ïch vß╗Ñ"
                                onClick={() => {
                                  setSelectedService(service);
                                  setShowDeleteModal(true);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="bg-white px-4 py-4 flex items-center justify-between border-t border-slate-200 sm:px-6">
                <div className="text-sm text-slate-500">
                  Hiß╗ân thß╗ï {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredServices.length)} / {filteredServices.length}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 border rounded text-sm transition-colors ${
                      currentPage === 1 
                        ? 'border-slate-100 text-slate-300 cursor-not-allowed' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Trang tr╞░ß╗¢c
                  </button>
                  
                  {Array.from({ length: Math.ceil(filteredServices.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 border rounded text-sm transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
                      if (currentPage < totalPages) {
                        setCurrentPage(currentPage + 1);
                      }
                    }}
                    disabled={currentPage === Math.ceil(filteredServices.length / itemsPerPage)}
                    className={`px-3 py-1 border rounded text-sm transition-colors ${
                      currentPage === Math.ceil(filteredServices.length / itemsPerPage)
                        ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Sau
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Quß║ún l├╜ nhß║¡t k├╜ */}
        {activeTab === 'version' && (
          <LogManagement initialOpenLogId={navigateToPage ? parseInt(navigateToPage) : null} />
        )}
      </div>

      {/* Modals */}
      <AddServiceModal
        isOpen={showAddServiceModal}
        onClose={closeModal}
      />
      <EditServiceModal
        isOpen={showEditServiceModal}
        onClose={closeModal}
        service={selectedService}
        initialTab={initialTab}
      />
      <ViewServiceModal
        isOpen={showDetailModal}
        onClose={closeModal}
        service={selectedService}
        onViewData={(pageId?: string) => {
          closeModal();
          if (pageId && onNavigate) {
            onNavigate(pageId);
          } else {
            setShowDataDetailPage(true);
          }
        }}
      />
      <DeleteServiceModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        service={selectedService}
      />
      <SettingsServiceModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        service={selectedService}
      />

      {/* Service Data Detail Page */}
      <ServiceDataDetailPage
        isOpen={showDataDetailPage}
        onClose={() => setShowDataDetailPage(false)}
        service={selectedService}
      />


      {/* Error Detail Modal */}
      {showErrorDetailModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
              <div>
                <h3 className="text-base font-medium text-slate-900">
                  Chi tiß║┐t kiß╗âm tra cß║Ñu tr├║c - {selectedService.statusText}
                </h3>
                <p className="text-sm mt-0.5 text-slate-600">
                  Dß╗ïch vß╗Ñ: {selectedService.name} ({selectedService.code})
                </p>
              </div>
              <button
                onClick={() => setShowErrorDetailModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="space-y-5">
                {/* Summary */}
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-3">Tß╗òng quan</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-xs text-slate-600 mb-1">Tß╗òng sß╗æ bß║ún ghi</div>
                      <div className="text-xl font-semibold text-slate-900">
                        {selectedService.validationDetails.totalRecords.toLocaleString('vi-VN')}
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-xs text-slate-600 mb-1">Bß║ún ghi hß╗úp lß╗ç</div>
                      <div className="text-xl font-semibold text-green-600">
                        {selectedService.validationDetails.validRecords.toLocaleString('vi-VN')}
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-xs text-slate-600 mb-1">Bß║ún ghi lß╗ùi</div>
                      <div className="text-xl font-semibold text-red-600">
                        {selectedService.validationDetails.invalidRecords.toLocaleString('vi-VN')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error Details */}
                {selectedService.validationDetails.errors && selectedService.validationDetails.errors.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 mb-3">Chi tiß║┐t lß╗ùi</h4>
                    <div className="space-y-3">
                      {selectedService.validationDetails.errors.map((error: any, index: number) => (
                        <div key={index} className="bg-white border border-slate-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h5 className="font-semibold text-slate-900 text-sm">{error.field}</h5>
                              <p className="text-sm text-slate-600 mt-0.5">{error.message}</p>
                            </div>
                            <StatusTag label={`${error.count} lß╗ùi`} variant="red" />
                          </div>
                          {error.examples && (
                            <div className="mb-3">
                              <div className="text-xs text-slate-500 mb-1.5">V├¡ dß╗Ñ:</div>
                              <div className="flex flex-wrap gap-2">
                                {error.examples.map((example: string, idx: number) => (
                                  <code key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-mono">
                                    {example}
                                  </code>
                                ))}
                              </div>
                            </div>
                          )}
                          {error.expectedFormat && (
                            <div className="text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded">
                              <span className="font-medium text-slate-700">─Éß╗ïnh dß║íng mong ─æß╗úi:</span> {error.expectedFormat}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Error Info */}
                {selectedService.errorDetails && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-red-100 rounded-lg flex-shrink-0">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-red-900 text-sm mb-1">
                          {selectedService.errorDetails.errorCode}: {selectedService.errorDetails.errorMessage}
                        </h5>
                        <p className="text-sm text-red-700 mb-2">
                          {selectedService.errorDetails.errorDescription}
                        </p>
                        <div className="text-xs text-red-600">
                          Sß╗æ lß║ºn thß╗¡: {selectedService.errorDetails.attemptCount} | Lß║ºn thß╗¡ cuß╗æi: {selectedService.errorDetails.lastAttempt}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 bg-slate-50">
              <button
                onClick={() => setShowErrorDetailModal(false)}
                className="px-4 py-2 text-sm text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                ─É├│ng
              </button>
              <button
                onClick={() => {
                  sendNotificationToSource(selectedService);
                  setShowErrorDetailModal(false);
                }}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Gß╗¡i th├┤ng b├ío hß╗ç thß╗æng nguß╗ôn
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Inactive Confirmation Modal */}
      {showInactiveModal && (
        <Portal>
          <div 
            className="fixed inset-0 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
            style={{ zIndex: 999999 }}
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 backdrop-blur-md">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Power className="w-5 h-5 text-amber-600" />
                  </div>
                  Ngß╗½ng hoß║ít ─æß╗Öng
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
                    <div className="text-md font-medium text-red-900 mb-1">Cß║únh b├ío gi├ín ─æoß║ín dß╗» liß╗çu</div>
                    <p className="text-sm text-red-800/80 leading-relaxed font-medium">
                      Bß║ín c├│ chß║»c muß╗æn ngß╗½ng hoß║ít ─æß╗Öng cß╗ºa dß╗ïch vß╗Ñ <span className="font-bold text-red-900">{selectedService?.name}</span>? H├ánh ─æß╗Öng n├áy sß║╜ khiß║┐n luß╗ông dß╗» liß╗çu bß╗ï gi├ín ─æoß║ín cho ─æß║┐n khi ─æ╞░ß╗úc k├¡ch hoß║ít lß║íi thß╗º c├┤ng.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700 ml-1">
                    L├╜ do ngß╗½ng hoß║ít ─æß╗Öng <span className="text-red-500 font-black">*</span>
                  </label>
                  <textarea
                    className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 min-h-[140px] text-sm bg-slate-50/30 outline-none transition-all placeholder:text-slate-400 resize-none"
                    placeholder="Vui l├▓ng nhß║¡p l├╜ do cß╗Ñ thß╗â (v├¡ dß╗Ñ: Thay ─æß╗òi cß║Ñu h├¼nh M├íy chß╗º thß╗▒c thi, bß║úo tr├¼ ─æß╗ïnh kß╗│ hß╗ç thß╗æng nguß╗ôn...)"
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
                  Hß╗ºy bß╗Å
                </button>
                <button
                  disabled={!inactiveReason.trim()}
                  onClick={() => {
                    alert(`─É├ú y├¬u cß║ºu ngß╗½ng hoß║ít ─æß╗Öng dß╗ïch vß╗Ñ: ${selectedService?.name}.\nL├╜ do: ${inactiveReason}`);
                    setShowInactiveModal(false);
                    setInactiveReason('');
                  }}
                  className="px-8 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl text-sm hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg shadow-amber-200 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transform active:scale-95"
                >
                  X├íc nhß║¡n ngß╗½ng
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
