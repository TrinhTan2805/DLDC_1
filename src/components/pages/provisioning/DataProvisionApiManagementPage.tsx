import React, { useState } from 'react';
import { 
  Server, GitCompare, Shield, History, Search, Filter, Plus, 
  Trash2, Edit3, Key, Clock, Calendar, CheckCircle2, XCircle, AlertTriangle, FileJson, Power
} from 'lucide-react';
import { ApiDocumentationTab } from './tabs/ApiDocumentationTab';
import { ProvisionApiModal } from './modals/ProvisionApiModal';
import { ProvisionReconciliationApiModal } from './modals/ProvisionReconciliationApiModal';
import { ProvisionAccessControlModal } from './modals/ProvisionAccessControlModal';
import { ApiVersionCompareModal } from './modals/ApiVersionCompareModal';

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '';
  if (/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/.test(dateStr)) return dateStr;
  const spaceSplit = dateStr.split(' ');
  if (spaceSplit.length === 2) {
    const [dStr, tStr] = spaceSplit;
    const dParts = dStr.split('-');
    if (dParts.length === 3) {
      return `${dParts[2]}/${dParts[1]}/${dParts[0]} ${tStr}`;
    }
  }
  const parts = dateStr.split('-');
  if (parts.length === 3 && !dateStr.includes('T') && !dateStr.includes(' ')) {
    return `${parts[2]}/${parts[1]}/${parts[0]} 08:00:00`;
  }
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      const s = String(d.getSeconds()).padStart(2, '0');
      return `${day}/${month}/${year} ${h}:${m}:${s}`;
    }
  } catch (e) {}
  return dateStr;
};

export function DataProvisionApiManagementPage() {
  const [activeTab, setActiveTab] = useState<'api_cung_cap' | 'api_doi_soat' | 'phan_quyen' | 'phien_ban' | 'tai_lieu_api'>('api_cung_cap');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Advanced Filter state
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [filterMethod, setFilterMethod] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterVersion, setFilterVersion] = useState<string>('All');
  const [filterReconSchedule, setFilterReconSchedule] = useState<string>('All');
  const [filterReconApi, setFilterReconApi] = useState<string>('All');

  const handleResetFilters = () => {
    setFilterMethod('All');
    setFilterStatus('All');
    setFilterVersion('All');
    setFilterReconSchedule('All');
    setFilterReconApi('All');
    setSearchTerm('');
  };

  // Modals state
  const [showApiModal, setShowApiModal] = useState(false);
  const [selectedApi, setSelectedApi] = useState<any>(null);
  
  const [showReconModal, setShowReconModal] = useState(false);
  const [selectedRecon, setSelectedRecon] = useState<any>(null);
  
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [selectedApiForAccess, setSelectedApiForAccess] = useState<string>('Lấy danh sách Hộ tịch');
  
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareVersions, setCompareVersions] = useState({ verA: 'v1.2', verB: 'v1.1' });

  // Success message toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Mock datasets with full CRUD state
  const [apis, setApis] = useState<any[]>([
    { id: '1', name: 'Lấy danh sách Hộ tịch', endpoint: '/api/v1/hotich/list', method: 'GET', version: 'v1.2', status: 'Hoạt động', desc: 'Dịch vụ khai thác thông tin hộ tịch của công dân' },
    { id: '2', name: 'Đồng bộ dữ liệu THADS', endpoint: '/api/v1/thads/sync', method: 'POST', version: 'v2.0', status: 'Hoạt động', desc: 'Đồng bộ kết quả thi hành án dân sự tỉnh Bắc Ninh' },
    { id: '3', name: 'Đọc thông tin Biện pháp bảo đảm', endpoint: '/api/v1/bpbd/get', method: 'GET', version: 'v1.0', status: 'Hoạt động', desc: 'Đọc thông tin giao dịch bảo đảm' },
    { id: '4', name: 'Tra cứu Cơ sở dữ liệu Pháp luật', endpoint: '/api/v1/phapluat/search', method: 'GET', version: 'v1.1', status: 'Tạm ngưng', desc: 'Tra cứu văn bản pháp luật hiện hành' }
  ]);

  const [recons, setRecons] = useState<any[]>([
    { id: '662', name: 'Đối soát tổng hợp danh mục dữ liệu dùng chung', targetSystem: 'Hệ thống đích (Các Bộ/Ngành)', schedule: 'Định kỳ (Hàng ngày) / Theo yêu cầu', linkedApi: 'Lấy danh sách Hộ tịch', status: 'active' },
    { id: '663', name: 'Đối soát cung cấp dữ liệu Hộ tịch điện tử', targetSystem: 'Hệ thống Bộ Tư pháp', schedule: 'Định kỳ (Hàng tuần) / Theo yêu cầu', linkedApi: 'Lấy danh sách Hộ tịch', status: 'active' },
    { id: '664', name: 'Đối soát cung cấp dữ liệu thi hành án dân sự', targetSystem: 'Hệ thống THADS', schedule: 'Định kỳ (Hàng ngày) / Theo yêu cầu', linkedApi: 'Đồng bộ dữ liệu THADS', status: 'active' },
    { id: '665', name: 'Đối soát cung cấp dữ liệu biện pháp bảo đảm', targetSystem: 'Cục Giao dịch bảo đảm', schedule: 'Theo yêu cầu', linkedApi: 'Đọc thông tin Biện pháp bảo đảm', status: 'inactive' }
  ]);

  const [permissions, setPermissions] = useState<any[]>([
    { id: 'p1', apiName: 'Lấy danh sách Hộ tịch', organization: 'Công an tỉnh Bắc Ninh', scopes: 'Đọc (GET)', ipWhitelist: '192.168.12.100', validFrom: '2026-05-01', validTo: '2027-05-01', status: 'Hợp lệ' },
    { id: 'p2', apiName: 'Lấy danh sách Hộ tịch', organization: 'Sở Y tế tỉnh Bắc Ninh', scopes: 'Đọc (GET)', ipWhitelist: '10.20.30.45', validFrom: '2026-04-15', validTo: '2027-04-15', status: 'Hợp lệ' },
    { id: 'p3', apiName: 'Đồng bộ dữ liệu THADS', organization: 'Sở Tài chính tỉnh Bắc Ninh', scopes: 'Đọc (GET), Ghi (POST)', ipWhitelist: '172.16.8.99', validFrom: '2026-05-10', validTo: '2027-05-10', status: 'Hợp lệ' },
    { id: 'p4', apiName: 'Tra cứu Cơ sở dữ liệu Pháp luật', organization: 'UBND Huyện Tiên Du', scopes: 'Đọc (GET)', ipWhitelist: 'Tất cả IP', validFrom: '2025-05-01', validTo: '2026-05-01', status: 'Hết hạn' }
  ]);

  const [versions, setVersions] = useState<any[]>([
    { id: 'v1.2', apiName: 'Lấy danh sách Hộ tịch', createdBy: 'Admin Hệ thống', releaseDate: '2026-05-04 08:00:00', note: 'Cập nhật định dạng ngày sinh ISO 8601 và thêm trường quốc tịch', status: 'Kích hoạt' },
    { id: 'v1.1', apiName: 'Lấy danh sách Hộ tịch', createdBy: 'Admin Hệ thống', releaseDate: '2026-03-10 10:30:00', note: 'Tối ưu hiệu năng truy vấn liên kết 3 bảng chính', status: 'Lưu trữ' },
    { id: 'v1.0', apiName: 'Lấy danh sách Hộ tịch', createdBy: 'Hệ thống tự động', releaseDate: '2026-01-15 15:45:00', note: 'Bản phát hành đầu tiên công khai', status: 'Lưu trữ' }
  ]);

  // Handlers
  const handleSaveApi = (data: any) => {
    if (selectedApi) {
      setApis(apis.map(item => item.id === selectedApi.id ? { ...item, ...data } : item));
      triggerToast('Cập nhật API cung cấp thành công!');
    } else {
      setApis([...apis, { ...data, id: (apis.length + 1).toString(), status: 'Hoạt động' }]);
      triggerToast('Thêm mới API cung cấp thành công!');
    }
  };

  const handleSaveRecon = (data: any) => {
    if (selectedRecon) {
      setRecons(recons.map(item => item.id === selectedRecon.id ? { ...item, ...data } : item));
      triggerToast('Cập nhật API đối soát thành công!');
    } else {
      setRecons([...recons, { ...data, id: (recons.length + 662).toString() }]);
      triggerToast('Tạo mới API đối soát thành công!');
    }
  };

  const handleSavePermission = (data: any) => {
    setPermissions([...permissions, { ...data, apiName: selectedApiForAccess }]);
    triggerToast(`Cấp quyền truy cập API cho ${data.organization} thành công!`);
  };

  const handleToggleApiStatus = (id: string, currentStatus: string) => {
    const isTạmNgưng = currentStatus === 'Tạm ngưng';
    const actionName = isTạmNgưng ? 'kích hoạt lại' : 'tạm ngưng';
    const newStatus = isTạmNgưng ? 'Hoạt động' : 'Tạm ngưng';
    
    if (window.confirm(`Bạn có chắc chắn muốn ${actionName} API cung cấp dữ liệu này?`)) {
      setApis(apis.map(item => item.id === id ? { ...item, status: newStatus } : item));
      triggerToast(`Đã ${actionName} API thành công!`);
    }
  };

  const handleToggleReconStatus = (id: string, currentStatus: string) => {
    const isInactive = currentStatus === 'inactive';
    const actionName = isInactive ? 'kích hoạt lại' : 'tạm ngưng';
    const newStatus = isInactive ? 'active' : 'inactive';

    if (window.confirm(`Bạn có chắc chắn muốn ${actionName} tiến trình đối soát dữ liệu này?`)) {
      setRecons(recons.map(item => item.id === id ? { ...item, status: newStatus } : item));
      triggerToast(`Đã ${actionName} tiến trình đối soát thành công!`);
    }
  };

  const handleDeletePermission = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn thu hồi quyền truy cập này?')) {
      setPermissions(permissions.filter(item => item.id !== id));
      triggerToast('Thu hồi quyền truy cập thành công!');
    }
  };

  const handleViewDiff = (index: number) => {
    let verA, verB;
    if (index === 0) {
      if (versions.length > 1) {
        verA = versions[0].id;
        verB = versions[1].id;
      } else {
        verA = versions[0].id;
        verB = versions[0].id;
      }
    } else {
      verA = versions[index - 1].id;
      verB = versions[index].id;
    }
    setCompareVersions({ verA, verB });
    setShowCompareModal(true);
  };

  const filteredApis = apis.filter(api => {
    const matchesSearch = api.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          api.endpoint.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = filterMethod === 'All' || api.method === filterMethod;
    const matchesStatus = filterStatus === 'All' || api.status === filterStatus;
    const matchesVersion = filterVersion === 'All' || api.version === filterVersion;
    return matchesSearch && matchesMethod && matchesStatus && matchesVersion;
  });

  const filteredRecons = recons.filter(recon => {
    const matchesSearch = recon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          recon.targetSystem.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || 
                          (filterStatus === 'Hoạt động' && recon.status === 'active') ||
                          (filterStatus === 'Tạm ngưng' && recon.status === 'inactive');
    const matchesSchedule = filterReconSchedule === 'All' || 
                            (filterReconSchedule === 'Hàng ngày' && recon.schedule.includes('Hàng ngày')) ||
                            (filterReconSchedule === 'Hàng tuần' && recon.schedule.includes('Hàng tuần')) ||
                            (filterReconSchedule === 'Theo yêu cầu' && recon.schedule.includes('Theo yêu cầu'));
    const matchesApi = filterReconApi === 'All' || recon.linkedApi === filterReconApi;
    return matchesSearch && matchesStatus && matchesSchedule && matchesApi;
  });

  return (
    <div className="space-y-6">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-xl border border-emerald-500 animate-in fade-in slide-in-from-top-4 duration-300 font-semibold text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-100" />
          {toastMessage}
        </div>
      )}

      {/* Top Banner and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quản lý API Cung cấp & Đối soát</h2>
          <p className="text-slate-500 mt-1">Danh mục API cung cấp, API đối soát, phân quyền bảo mật và lịch sử phiên bản</p>
        </div>
        
        {activeTab === 'api_cung_cap' && (
          <button 
            onClick={() => {
              if (typeof (window as any).navigateToPage === 'function') {
                (window as any).navigateToPage('provisioning-service-setup?action=create');
              }
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-lg flex items-center shadow-md font-bold transition-all hover:scale-[1.02] active:scale-[0.98] text-sm"
            title="Đến màn hình Thiết lập điều phối để tạo mới"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo API Cung cấp mới
          </button>
        )}

        {activeTab === 'api_doi_soat' && (
          <button 
            onClick={() => { setSelectedRecon(null); setShowReconModal(true); }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg flex items-center shadow-md font-bold transition-all hover:scale-[1.02] active:scale-[0.98] text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo API Đối soát mới
          </button>
        )}

        {activeTab === 'phan_quyen' && (
          <button 
            onClick={() => { setShowAccessModal(true); }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg flex items-center shadow-md font-bold transition-all hover:scale-[1.02] active:scale-[0.98] text-sm"
          >
            <Key className="w-4 h-4 mr-2" />
            Cấp quyền truy cập API
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/50">
          <nav className="flex space-x-6 px-6" aria-label="Tabs">
            
            {/* Tab: API Cung cấp */}
            <button
              onClick={() => { setActiveTab('api_cung_cap'); setSearchTerm(''); }}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm flex items-center transition-colors ${
                activeTab === 'api_cung_cap'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Server className="w-4 h-4 mr-2" />
              API Cung cấp dữ liệu ({apis.length})
            </button>

            {/* Tab: API Đối soát */}
            <button
              onClick={() => { setActiveTab('api_doi_soat'); setSearchTerm(''); }}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm flex items-center transition-colors ${
                activeTab === 'api_doi_soat'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <GitCompare className="w-4 h-4 mr-2" />
              API Đối soát dữ liệu ({recons.length})
            </button>

            {/* Tab: Phân quyền truy cập */}
            <button
              onClick={() => { setActiveTab('phan_quyen'); setSearchTerm(''); }}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm flex items-center transition-colors ${
                activeTab === 'phan_quyen'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Shield className="w-4 h-4 mr-2" />
              Phân quyền truy cập ({permissions.length})
            </button>

            {/* Tab: Quản lý phiên bản */}
            <button
              onClick={() => { setActiveTab('phien_ban'); setSearchTerm(''); }}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm flex items-center transition-colors ${
                activeTab === 'phien_ban'
                  ? 'border-sky-500 text-sky-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <History className="w-4 h-4 mr-2" />
              Quản lý phiên bản ({versions.length})
            </button>

            {/* Tab: Tài liệu API */}
            <button
              onClick={() => { setActiveTab('tai_lieu_api'); setSearchTerm(''); }}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm flex items-center transition-colors ${
                activeTab === 'tai_lieu_api'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <FileJson className="w-4 h-4 mr-2" />
              Tài liệu API (Swagger)
            </button>
          </nav>
        </div>

        {/* Tab contents */}
        <div className="p-6">
          
          {/* General Search Panel for lists with Advanced Filter */}
          {activeTab !== 'phan_quyen' && activeTab !== 'phien_ban' && activeTab !== 'tai_lieu_api' && (
            <div className="space-y-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={activeTab === 'api_cung_cap' ? "Tìm kiếm API cung cấp..." : "Tìm kiếm API đối soát..."}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
                  className={`flex items-center px-4 py-2 border rounded-lg transition-colors text-sm font-semibold ${
                    showAdvancedFilter 
                      ? 'bg-amber-50 border-amber-300 text-amber-700' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Bộ lọc nâng cao
                </button>
              </div>

              {/* Advanced Filter Criteria Dropdowns */}
              {showAdvancedFilter && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-top-2 duration-200 shadow-inner">
                  
                  {/* FOR TAB 1: API CUNG CẤP DỮ LIỆU */}
                  {activeTab === 'api_cung_cap' && (
                    <>
                      {/* Criteria 1: Method */}
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Phương thức kết nối</label>
                        <select
                          value={filterMethod}
                          onChange={(e) => setFilterMethod(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                        >
                          <option value="All">Tất cả phương thức</option>
                          <option value="GET">GET</option>
                          <option value="POST">POST</option>
                          <option value="PUT">PUT</option>
                          <option value="DELETE">DELETE</option>
                        </select>
                      </div>

                      {/* Criteria 2: Status */}
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Trạng thái API</label>
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                        >
                          <option value="All">Tất cả trạng thái</option>
                          <option value="Hoạt động">Hoạt động (Active)</option>
                          <option value="Tạm ngưng">Tạm ngưng (Inactive)</option>
                        </select>
                      </div>

                      {/* Criteria 3: Version */}
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Phiên bản API</label>
                        <select
                          value={filterVersion}
                          onChange={(e) => setFilterVersion(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                        >
                          <option value="All">Tất cả phiên bản</option>
                          <option value="v1.0">v1.0</option>
                          <option value="v1.1">v1.1</option>
                          <option value="v1.2">v1.2</option>
                          <option value="v2.0">v2.0</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* FOR TAB 2: API ĐỐI SOÁT DỮ LIỆU */}
                  {activeTab === 'api_doi_soat' && (
                    <>
                      {/* Criteria 1: Recon Schedule */}
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tần suất đối soát</label>
                        <select
                          value={filterReconSchedule}
                          onChange={(e) => setFilterReconSchedule(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                        >
                          <option value="All">Tất cả tần suất</option>
                          <option value="Hàng ngày">Hàng ngày (Daily)</option>
                          <option value="Hàng tuần">Hàng tuần (Weekly)</option>
                          <option value="Theo yêu cầu">Theo yêu cầu (On-demand)</option>
                        </select>
                      </div>

                      {/* Criteria 2: Status */}
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Trạng thái đối soát</label>
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                        >
                          <option value="All">Tất cả trạng thái</option>
                          <option value="Hoạt động">Hoạt động (Active)</option>
                          <option value="Tạm ngưng">Tạm ngưng (Inactive)</option>
                        </select>
                      </div>

                      {/* Criteria 3: Linked API */}
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">API liên kết đối soát</label>
                        <select
                          value={filterReconApi}
                          onChange={(e) => setFilterReconApi(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                        >
                          <option value="All">Tất cả API liên kết</option>
                          <option value="Lấy danh sách Hộ tịch">Lấy danh sách Hộ tịch</option>
                          <option value="Đồng bộ dữ liệu THADS">Đồng bộ dữ liệu THADS</option>
                          <option value="Đọc thông tin Biện pháp bảo đảm">Đọc thông tin Biện pháp bảo đảm</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 1: API CUNG CẤP DỮ LIỆU */}
          {activeTab === 'api_cung_cap' && (
            <div className="overflow-x-auto border border-slate-100 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs border-b border-slate-200 uppercase tracking-wider">
                    <th className="py-3 px-4 font-bold">Tên API</th>
                    <th className="py-3 px-4 font-bold">Endpoint (URL)</th>
                    <th className="py-3 px-4 font-bold">Phương thức</th>
                    <th className="py-3 px-4 font-bold">Phiên bản</th>
                    <th className="py-3 px-4 font-bold">Mô tả</th>
                    <th className="py-3 px-4 font-bold">Trạng thái</th>
                    <th className="py-3 px-4 font-bold text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {filteredApis.map(api => (
                    <tr key={api.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{api.name}</td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-600">{api.endpoint}</td>
                      <td className="py-3.5 px-4">
                        <span className={`font-mono text-xs px-2.5 py-1 rounded font-bold ${
                          api.method === 'GET' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {api.method}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-mono text-xs font-semibold">{api.version}</td>
                      <td className="py-3.5 px-4 text-slate-500 text-xs max-w-[200px] truncate" title={api.desc}>{api.desc}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          api.status === 'Hoạt động' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${api.status === 'Hoạt động' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
                          {api.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => { setSelectedApi(api); setShowApiModal(true); }}
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                            title="Sửa thông tin API"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleToggleApiStatus(api.id, api.status)}
                            className={`p-1.5 rounded transition-colors ${
                              api.status === 'Hoạt động' 
                                ? 'text-orange-500 hover:text-orange-600 hover:bg-orange-50' 
                                : 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={api.status === 'Hoạt động' ? "Tạm ngưng API" : "Kích hoạt API"}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: API ĐỐI SOÁT DỮ LIỆU */}
          {activeTab === 'api_doi_soat' && (
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs border-b border-slate-200 uppercase tracking-wider whitespace-nowrap">
                    <th className="py-3 px-4 font-bold">Mã đối soát</th>
                    <th className="py-3 px-4 font-bold">Tên tiến trình đối soát</th>
                    <th className="py-3 px-4 font-bold">Hệ thống đối tác</th>
                    <th className="py-3 px-4 font-bold">Tần suất đối soát</th>
                    <th className="py-3 px-4 font-bold">API liên kết</th>
                    <th className="py-3 px-4 font-bold">Trạng thái</th>
                    <th className="py-3 px-4 font-bold text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {filteredRecons.map(recon => (
                    <tr key={recon.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-500 whitespace-nowrap">UC-{recon.id}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">{recon.name}</td>
                      <td className="py-3.5 px-4 text-slate-600 text-xs whitespace-nowrap">{recon.targetSystem}</td>
                      <td className="py-3.5 px-4 text-slate-500 text-xs">
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{recon.schedule}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-xs text-indigo-600 whitespace-nowrap">{recon.linkedApi}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap ${
                          recon.status === 'active' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${recon.status === 'active' ? 'bg-purple-500 animate-pulse' : 'bg-slate-400'}`}></span>
                          {recon.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => { setSelectedRecon(recon); setShowReconModal(true); }}
                            className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                            title="Sửa thông tin đối soát"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleToggleReconStatus(recon.id, recon.status)}
                            className={`p-1.5 rounded transition-colors ${
                              recon.status === 'active' 
                                ? 'text-orange-500 hover:text-orange-600 hover:bg-orange-50' 
                                : 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={recon.status === 'active' ? "Tạm ngưng tiến trình đối soát" : "Kích hoạt tiến trình đối soát"}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: PHÂN QUYỀN TRUY CẬP (Dual-pane View - Wide Layout) */}
          {activeTab === 'phan_quyen' && (
            <div className="grid grid-cols-12 gap-6">
              
              {/* Left pane: API List (Col span 3) */}
              <div className="col-span-12 lg:col-span-3 border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white shadow-sm">
                <div className="bg-slate-50 p-4 border-b border-slate-200">
                  <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Danh sách dịch vụ API</h4>
                </div>
                <div className="p-2 space-y-1">
                  {apis.map(api => (
                    <button
                      key={api.id}
                      onClick={() => setSelectedApiForAccess(api.name)}
                      className={`w-full text-left p-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                        selectedApiForAccess === api.name 
                          ? 'bg-emerald-50 text-emerald-800 border-l-4 border-emerald-600 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate mr-2">{api.name}</span>
                      <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">{api.version}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right pane: Beneficiaries with active permissions (Col span 9) */}
              <div className="col-span-12 lg:col-span-9 space-y-4">
                <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider block">API đang quản lý phân quyền</span>
                    <span className="text-base font-extrabold text-slate-800 mt-1 block">{selectedApiForAccess}</span>
                  </div>
                  <button
                    onClick={() => setShowAccessModal(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center transition-colors shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Cấp quyền mới
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white shadow-sm">
                  <table className="w-full text-left border-collapse table-auto">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-xs border-b border-slate-200 uppercase tracking-wider whitespace-nowrap">
                        <th className="py-3.5 px-6 font-bold whitespace-nowrap">Đơn vị được cấp quyền</th>
                        <th className="py-3.5 px-6 font-bold whitespace-nowrap">Phạm vi quyền (Scopes)</th>
                        <th className="py-3.5 px-6 font-bold whitespace-nowrap">IP Whitelist</th>
                        <th className="py-3.5 px-6 font-bold whitespace-nowrap">Thời hạn hiệu lực</th>
                        <th className="py-3.5 px-6 font-bold whitespace-nowrap">Trạng thái</th>
                        <th className="py-3.5 px-6 font-bold text-center whitespace-nowrap">Thu hồi</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-100">
                      {permissions.filter(p => p.apiName === selectedApiForAccess).length > 0 ? (
                        permissions.filter(p => p.apiName === selectedApiForAccess).map(perm => (
                          <tr key={perm.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 px-6 font-bold text-slate-800 whitespace-nowrap">{perm.organization}</td>
                            <td className="py-4 px-6 text-xs font-semibold text-slate-600 whitespace-nowrap">
                              <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200 whitespace-nowrap">
                                {perm.scopes}
                              </span>
                            </td>
                            <td className="py-4 px-6 font-mono text-xs text-slate-500 whitespace-nowrap">{perm.ipWhitelist}</td>
                            <td className="py-4 px-6 text-slate-600 text-xs whitespace-nowrap">
                              <div className="flex items-center gap-1.5 whitespace-nowrap">
                                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="font-medium whitespace-nowrap">{perm.validFrom} ~ {perm.validTo}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap ${
                                perm.status === 'Hợp lệ' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                              }`}>
                                <CheckCircle2 className={`w-3.5 h-3.5 ${perm.status === 'Hợp lệ' ? 'text-emerald-500' : 'text-red-500'} shrink-0`} />
                                {perm.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center whitespace-nowrap">
                              <button 
                                onClick={() => handleDeletePermission(perm.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Thu hồi quyền truy cập"
                              >
                                <Trash2 className="w-4 h-4 mx-auto" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                            Chưa có đơn vị nào được cấp quyền khai thác API này.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: QUẢN LÝ PHIÊN BẢN API */}
          {activeTab === 'phien_ban' && (
            <div className="space-y-6">
              
              {/* Alert header with comparison helper action */}
              <div className="p-4 bg-sky-50 border border-sky-200/50 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-100 text-sky-600 rounded-lg">
                    <History className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Quản lý lịch sử phiên bản của API</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Theo dõi lịch sử nâng cấp cấu trúc, đổi kiểu trường và so sánh sự khác biệt (diff) giữa các bản</p>
                  </div>
                </div>
                <button
                  onClick={() => handleViewDiff(0)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                >
                  <GitCompare className="w-4 h-4" />
                  So sánh {compareVersions.verA} & {compareVersions.verB}
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white shadow-sm">
                <table className="w-full text-left border-collapse min-w-max">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs border-b border-slate-200 uppercase tracking-wider whitespace-nowrap">
                      <th className="py-3 px-4 font-bold">Dịch vụ API</th>
                      <th className="py-3 px-4 font-bold">Phiên bản</th>
                      <th className="py-3 px-4 font-bold">Người cập nhật</th>
                      <th className="py-3 px-4 font-bold">Ngày phát hành</th>
                      <th className="py-3 px-4 font-bold">Ghi chú thay đổi</th>
                      <th className="py-3 px-4 font-bold">Trạng thái</th>
                      <th className="py-3 px-4 font-bold text-center">So sánh diff</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-100">
                    {versions.map((ver, index) => (
                      <tr key={ver.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4 font-semibold text-slate-800 whitespace-nowrap">{ver.apiName}</td>
                        <td className="py-4 px-4">
                          <span className="font-mono text-xs font-extrabold text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded border border-indigo-100 whitespace-nowrap">
                            {ver.id}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-700 font-medium whitespace-nowrap">{ver.createdBy}</td>
                        <td className="py-4 px-4 text-slate-600 text-xs">
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{formatDateTime(ver.releaseDate)}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-500 text-xs max-w-sm leading-relaxed whitespace-pre-wrap">{ver.note}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap ${
                            ver.status === 'Kích hoạt' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {ver.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => handleViewDiff(index)}
                            className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded font-bold text-xs transition-colors whitespace-nowrap"
                          >
                            Xem Diff
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 5: TÀI LIỆU API (SWAGGER) */}
          {activeTab === 'tai_lieu_api' && (
            <ApiDocumentationTab />
          )}

        </div>
      </div>

      {/* API Provision Modal */}
      <ProvisionApiModal 
        isOpen={showApiModal} 
        onClose={() => setShowApiModal(false)} 
        apiData={selectedApi}
        onSave={handleSaveApi}
      />

      {/* API Reconciliation Modal */}
      <ProvisionReconciliationApiModal
        isOpen={showReconModal}
        onClose={() => setShowReconModal(false)}
        apiData={selectedRecon}
        onSave={handleSaveRecon}
      />

      {/* Access Permission Modal */}
      <ProvisionAccessControlModal
        isOpen={showAccessModal}
        onClose={() => setShowAccessModal(false)}
        apiName={selectedApiForAccess}
        onSave={handleSavePermission}
      />

      {/* Version Comparison Modal */}
      <ApiVersionCompareModal
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        apiName="Lấy danh sách Hộ tịch"
        verA={compareVersions.verA}
        verB={compareVersions.verB}
      />

    </div>
  );
}
