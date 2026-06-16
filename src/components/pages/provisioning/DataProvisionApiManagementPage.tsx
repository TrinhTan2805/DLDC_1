import React, { useState, useEffect } from 'react';
import {
  Server, GitCompare, Shield, History, Search, Filter, Plus,
  Trash2, Edit3, Key, Clock, Calendar, CheckCircle2, XCircle, AlertTriangle, FileJson, Power, FileText, Users, KeyRound, RefreshCw, Lock, Unlock, Copy,
  ChevronDown, X, Eye
} from 'lucide-react';

import { ProvisionApiModal } from './modals/ProvisionApiModal';
import { ProvisionReconciliationApiModal } from './modals/ProvisionReconciliationApiModal';
import { ProvisionAccessControlModal } from './modals/ProvisionAccessControlModal';
import { ProvisionVersionHistoryModal } from './modals/ProvisionVersionHistoryModal';
import { ProvisionAccountModal } from './modals/ProvisionAccountModal';

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
  } catch (e) { }
  return dateStr;
};

export function DataProvisionApiManagementPage() {
  const [activeTab, setActiveTab] = useState<'api_cung_cap' | 'api_doi_soat' | 'phan_quyen' | 'danh_sach_tai_khoan'>('api_cung_cap');
  const [searchTerm, setSearchTerm] = useState('');

  // Advanced Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [filterMethod, setFilterMethod] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterVersion, setFilterVersion] = useState<string>('All');
  const [filterReconSchedule, setFilterReconSchedule] = useState<string>('All');
  const [filterReconApi, setFilterReconApi] = useState<string>('All');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleResetFilters = () => {
    setFilterMethod('All');
    setFilterStatus('All');
    setFilterVersion('All');
    setFilterReconSchedule('All');
    setFilterReconApi('All');
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Modals state
  const [showApiModal, setShowApiModal] = useState(false);
  const [selectedApi, setSelectedApi] = useState<any>(null);

  const [showReconModal, setShowReconModal] = useState(false);
  const [selectedRecon, setSelectedRecon] = useState<any>(null);

  const [showAccessModal, setShowAccessModal] = useState(false);
  const [selectedApiForAccess, setSelectedApiForAccess] = useState<string>('Lấy danh sách Hộ tịch');

  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedApiForHistory, setSelectedApiForHistory] = useState<any>(null);

  const [showAccountModal, setShowAccountModal] = useState(false);

  // Success message toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [apis, setApis] = useState<any[]>(() => {
    const saved = localStorage.getItem('provision_apis');
    return saved ? JSON.parse(saved) : [
      { id: '1', code: 'SVC-HOTICH-001', name: 'API cung cấp dữ liệu Hộ tịch điện tử', endpoint: '/api/v1/hotich/search', method: 'GET', version: 'v1.2', status: 'Hoạt động', desc: 'Dịch vụ khai thác thông tin hộ tịch của công dân', dataType: 'Hộ tịch điện tử', consumerUnit: 'Bộ Kế hoạch và Đầu tư', receiverPoint: 'Nguyễn Văn A - 0987654321', time: '2026-05-24 08:00:00' },
      { id: '2', code: 'SVC-THADS-002', name: 'API đồng bộ dữ liệu thi hành án dân sự', endpoint: '/api/v1/thads/sync', method: 'POST', version: 'v2.0', status: 'Hoạt động', desc: 'Đồng bộ kết quả thi hành án dân sự tỉnh Bắc Ninh', dataType: 'Thi hành án dân sự', consumerUnit: 'Sở Tài chính tỉnh Bắc Ninh', receiverPoint: 'Trần Thị B - 0912345678', time: '2026-05-25 09:30:00' },
      { id: '3', code: 'SVC-BPBD-003', name: 'API đọc thông tin Biện pháp bảo đảm', endpoint: '/api/v1/bpbd/get', method: 'GET', version: 'v1.0', status: 'Hoạt động', desc: 'Đọc thông tin giao dịch bảo đảm', dataType: 'Biện pháp bảo đảm', consumerUnit: 'Sở Tư pháp tỉnh Bắc Ninh', receiverPoint: 'Phạm Văn C - 0901234567', time: '2026-05-25 14:15:00' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('provision_apis', JSON.stringify(apis));
  }, [apis]);

  const [recons, setRecons] = useState<any[]>([
    { id: '662', name: 'Đối soát tổng hợp danh mục dữ liệu dùng chung', targetSystem: 'Hệ thống đích (Các Bộ/Ngành)', schedule: 'Định kỳ (Hàng ngày) / Theo yêu cầu', linkedApi: 'Lấy danh sách Hộ tịch', status: 'active' },
    { id: '663', name: 'Đối soát cung cấp dữ liệu Hộ tịch điện tử', targetSystem: 'Hệ thống Bộ Tư pháp', schedule: 'Định kỳ (Hàng tuần) / Theo yêu cầu', linkedApi: 'Lấy danh sách Hộ tịch', status: 'active' },
    { id: '664', name: 'Đối soát cung cấp dữ liệu thi hành án dân sự', targetSystem: 'Hệ thống THADS', schedule: 'Định kỳ (Hàng ngày) / Theo yêu cầu', linkedApi: 'Đồng bộ dữ liệu THADS', status: 'active' },
    { id: '665', name: 'Đối soát cung cấp dữ liệu biện pháp bảo đảm', targetSystem: 'Cục Giao dịch bảo đảm', schedule: 'Theo yêu cầu', linkedApi: 'Đọc thông tin Biện pháp bảo đảm', status: 'inactive' }
  ]);

  const [permissions, setPermissions] = useState<any[]>([
    { id: 'p1', apiName: 'Lấy danh sách Hộ tịch', organization: 'Công an tỉnh Bắc Ninh', scopes: 'Đọc (GET)', ipWhitelist: '192.168.12.100', validFrom: '2026-05-01', validTo: '2027-05-01', status: 'Hợp lệ' },
    { id: 'p2', apiName: 'Lấy danh sách Hộ tịch', organization: 'Sở Y tế tỉnh Bắc Ninh', scopes: 'Đọc (GET)', ipWhitelist: '10.20.30.45', validFrom: '2026-04-15', validTo: '2027-04-15', status: 'Hợp lệ' },
    { id: 'p3', apiName: 'Đồng bộ dữ liệu THADS', organization: 'Sở Tài chính tỉnh Bắc Ninh', scopes: 'Đọc (GET), Ghi (POST)', ipWhitelist: '172.16.8.99', validFrom: '2026-05-10', validTo: '2027-05-10', status: 'Hợp lệ' }
  ]);

  const [accounts, setAccounts] = useState<any[]>([
    { id: 'acc1', username: 'yte_bacninh_01', apiName: 'Lấy danh sách Hộ tịch', organization: 'Sở Y tế tỉnh Bắc Ninh', clientId: 'client_7a9b8c2d', status: 'Hoạt động', createdAt: '2026-05-15' },
    { id: 'acc2', username: 'ca_bacninh_01', apiName: 'Lấy danh sách Hộ tịch', organization: 'Công an tỉnh Bắc Ninh', clientId: 'client_3x9v2m1l', status: 'Hoạt động', createdAt: '2026-05-10' },
    { id: 'acc3', username: 'tc_bacninh_01', apiName: 'Đồng bộ dữ liệu THADS', organization: 'Sở Tài chính tỉnh Bắc Ninh', clientId: 'client_9k2m4n5b', status: 'Hoạt động', createdAt: '2026-05-12' }
  ]);

  const [selectedUnitForAccount, setSelectedUnitForAccount] = useState<string>('Sở Y tế tỉnh Bắc Ninh');

  const [confirmRefreshAccountId, setConfirmRefreshAccountId] = useState<string | null>(null);
  const [newTokenResult, setNewTokenResult] = useState<{accountId: string, token: string} | null>(null);

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

  const executeRefreshToken = (accountId: string) => {
    const newKey = 'client_' + Math.random().toString(36).substring(2, 10);
    setAccounts(accounts.map(a => a.id === accountId ? { ...a, clientId: newKey } : a));
    setConfirmRefreshAccountId(null);
    setNewTokenResult({ accountId, token: newKey });
    triggerToast('Đã làm mới App Key thành công!');
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

  const filteredApis = apis.filter(api => {
    const matchesSearch = api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      api.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (api.code && api.code.toLowerCase().includes(searchTerm.toLowerCase()));
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

  const filteredPermissions = permissions.filter(p => {
    if (p.apiName !== selectedApiForAccess) return false;
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      return p.organization.toLowerCase().includes(term) || p.scopes.toLowerCase().includes(term);
    }
    return true;
  });

  const filteredAccounts = accounts.filter(acc => {
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      return acc.username.toLowerCase().includes(term) || acc.organization.toLowerCase().includes(term) || acc.apiName.toLowerCase().includes(term);
    }
    return true;
  });

  const paginatedApis = filteredApis.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const paginatedRecons = filteredRecons.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const paginatedPermissions = filteredPermissions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const paginatedAccounts = filteredAccounts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const renderPagination = (totalItems: number) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    return (
      <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white sm:px-6 collection-pagination text-[13px]">
        <div className="flex items-center gap-2">
          <span className="text-slate-600">Hiển thị</span>
          <select aria-label="Select record count" 
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            className="px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-[13px]"
            title="Số bản ghi trên trang"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-slate-600">bản ghi/trang</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-slate-600">
            {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} / {totalItems}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
            >
              Trước
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 border rounded-lg font-medium text-[13px] transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-[#e2e8f0] text-slate-600 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => {
                if (currentPage < totalPages) {
                  setCurrentPage(currentPage + 1);
                }
              }}
              disabled={currentPage === totalPages || totalItems === 0}
              className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="api-management-page-root" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .api-management-page-root *:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(svg):not(path):not(circle):not(rect):not(polyline):not(line) {
          font-size: 13px !important;
        }
      `}} />
      <div className="h-full flex flex-col bg-slate-50 min-h-screen animate-in fade-in duration-300">

        {/* Toast Notification Alert */}
        {toastMessage && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-xl border border-emerald-500 animate-in fade-in slide-in-from-top-4 duration-300 font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-100" />
            {toastMessage}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-slate-200 px-6">
          <div className="flex gap-6">
            <button
              onClick={() => { setActiveTab('api_cung_cap'); setSearchTerm(''); setCurrentPage(1); }}
              className={`flex items-center gap-2 pb-3 pt-4 text-[13px] font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'api_cung_cap'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Server className="w-5 h-5" />
              API Cung cấp dữ liệu ({apis.length})
            </button>
            <button
              onClick={() => { setActiveTab('api_doi_soat'); setSearchTerm(''); setCurrentPage(1); }}
              className={`flex items-center gap-2 pb-3 pt-4 text-[13px] font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'api_doi_soat'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitCompare className="w-5 h-5" />
              API Đối soát dữ liệu ({recons.length})
            </button>
            <button
              onClick={() => { setActiveTab('phan_quyen'); setSearchTerm(''); setCurrentPage(1); }}
              className={`flex items-center gap-2 pb-3 pt-4 text-[13px] font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'phan_quyen'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-5 h-5" />
              Phân quyền truy cập ({permissions.length})
            </button>
            <button
              onClick={() => { setActiveTab('danh_sach_tai_khoan'); setSearchTerm(''); setCurrentPage(1); }}
              className={`flex items-center gap-2 pb-3 pt-4 text-[13px] font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'danh_sach_tai_khoan'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-5 h-5" />
              Danh sách tài khoản ({accounts.length})
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            
            {/* Filters and Actions */}
            <div className="mb-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder={
                        activeTab === 'api_cung_cap'
                          ? "Tìm kiếm API cung cấp theo tên, mã hoặc endpoint..."
                          : activeTab === 'api_doi_soat'
                          ? "Tìm kiếm API đối soát theo tên hoặc hệ thống..."
                          : activeTab === 'phan_quyen'
                          ? "Tìm kiếm quyền truy cập theo đơn vị..."
                          : "Tìm kiếm tài khoản theo username hoặc đơn vị..."
                      }
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                  </div>
                  <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center">
                    <Search className="w-5 h-5" />
                  </button>
                  {(activeTab === 'api_cung_cap' || activeTab === 'api_doi_soat') && (
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`p-2 rounded-lg transition-colors shadow-sm flex items-center justify-center border ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-[#e2e8f0] text-slate-600 hover:bg-slate-50'}`}
                      title="Bộ lọc"
                    >
                      {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {activeTab === 'api_cung_cap' && (
                    <button
                      onClick={() => {
                        setSelectedApi(null);
                        setShowApiModal(true);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-[13px] shadow-sm font-medium whitespace-nowrap"
                      title="Tạo API Cung cấp mới"
                    >
                      <Plus className="w-4 h-4" />
                      Tạo API Cung cấp mới
                    </button>
                  )}
                  {activeTab === 'api_doi_soat' && (
                    <button
                      onClick={() => {
                        setSelectedRecon(null);
                        setShowReconModal(true);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-[13px] shadow-sm font-medium whitespace-nowrap"
                      title="Tạo API Đối soát mới"
                    >
                      <Plus className="w-4 h-4" />
                      Tạo API Đối soát mới
                    </button>
                  )}
                  {activeTab === 'phan_quyen' && (
                    <button
                      onClick={() => setShowAccessModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-[13px] shadow-sm font-medium whitespace-nowrap"
                      title="Cấp quyền truy cập API"
                    >
                      <Key className="w-4 h-4" />
                      Cấp quyền truy cập API
                    </button>
                  )}
                  {activeTab === 'danh_sach_tai_khoan' && (
                    <button
                      onClick={() => setShowAccountModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-[13px] shadow-sm font-medium whitespace-nowrap"
                      title="Tạo tài khoản mới"
                    >
                      <Plus className="w-4 h-4" />
                      Tạo tài khoản mới
                    </button>
                  )}
                </div>
              </div>

              {/* Row 2: Filters Panel */}
              {showFilters && (activeTab === 'api_cung_cap' || activeTab === 'api_doi_soat') && (
                <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 grid grid-cols-4 gap-4 mt-4 animate-in slide-in-from-top-2 duration-200 shadow-sm relative z-20">
                  <div className="absolute -top-2 right-[200px] w-4 h-4 bg-slate-50 border-t border-l border-slate-200 transform rotate-45"></div>
                  {activeTab === 'api_cung_cap' && (
                    <>
                      <div>
                        <label className="block text-[13px] text-slate-600 mb-1.5 font-medium">Phương thức kết nối</label>
                        <select
                          value={filterMethod}
                          onChange={(e) => { setFilterMethod(e.target.value); setCurrentPage(1); }}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm cursor-pointer"
                        >
                          <option value="All">Tất cả phương thức</option>
                          <option value="GET">GET</option>
                          <option value="POST">POST</option>
                          <option value="PUT">PUT</option>
                          <option value="DELETE">DELETE</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[13px] text-slate-600 mb-1.5 font-medium">Trạng thái API</label>
                        <select
                          value={filterStatus}
                          onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm cursor-pointer"
                        >
                          <option value="All">Tất cả trạng thái</option>
                          <option value="Hoạt động">Hoạt động (Active)</option>
                          <option value="Tạm ngưng">Tạm ngưng (Inactive)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[13px] text-slate-600 mb-1.5 font-medium">Phiên bản API</label>
                        <select
                          value={filterVersion}
                          onChange={(e) => { setFilterVersion(e.target.value); setCurrentPage(1); }}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm cursor-pointer"
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
                  {activeTab === 'api_doi_soat' && (
                    <>
                      <div>
                        <label className="block text-[13px] text-slate-600 mb-1.5 font-medium">Tần suất đối soát</label>
                        <select
                          value={filterReconSchedule}
                          onChange={(e) => { setFilterReconSchedule(e.target.value); setCurrentPage(1); }}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm cursor-pointer"
                        >
                          <option value="All">Tất cả tần suất</option>
                          <option value="Hàng ngày">Hàng ngày (Daily)</option>
                          <option value="Hàng tuần">Hàng tuần (Weekly)</option>
                          <option value="Theo yêu cầu">Theo yêu cầu (On-demand)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[13px] text-slate-600 mb-1.5 font-medium">Trạng thái đối soát</label>
                        <select
                          value={filterStatus}
                          onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm cursor-pointer"
                        >
                          <option value="All">Tất cả trạng thái</option>
                          <option value="Hoạt động">Hoạt động (Active)</option>
                          <option value="Tạm ngưng">Tạm ngưng (Inactive)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[13px] text-slate-600 mb-1.5 font-medium">API liên kết đối soát</label>
                        <select
                          value={filterReconApi}
                          onChange={(e) => { setFilterReconApi(e.target.value); setCurrentPage(1); }}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm cursor-pointer"
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

            {/* TAB 1: API CUNG CẤP DỮ LIỆU */}
            {activeTab === 'api_cung_cap' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse table-auto">
                    <thead>
                      <tr className="bg-slate-50 text-[13px] font-semibold text-slate-500 border-b border-slate-200 uppercase tracking-tight">
                        <th className="py-3 px-4 text-left font-semibold">Mã / Tên API</th>
                        <th className="py-3 px-4 text-center font-semibold">Phiên bản</th>
                        <th className="py-3 px-4 text-left font-semibold">Loại dữ liệu chia sẻ</th>
                        <th className="py-3 px-4 text-left font-semibold">Đầu mối tiếp nhận</th>
                        <th className="py-3 px-4 text-left font-semibold">Thời gian</th>
                        <th className="py-3 px-4 text-left font-semibold">Tài liệu</th>
                        <th className="py-3 px-4 text-left font-semibold">Trạng thái</th>
                        <th className="py-3 px-4 text-center font-semibold">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 text-[13px]">
                      {paginatedApis.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-slate-500 font-medium">
                            Không tìm thấy API cung cấp dữ liệu nào.
                          </td>
                        </tr>
                      ) : (
                        paginatedApis.map(api => (
                          <tr key={api.id} className="hover:bg-slate-50/50 transition-all border-b border-slate-100 group">
                            <td className="py-3 px-4 text-left">
                              <div className="font-semibold text-slate-900 leading-snug">{api.name}</div>
                              <div className="text-xs font-mono text-slate-500 mt-1">{api.code || 'SVC-HOTICH-001'}</div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">{api.version}</span>
                            </td>
                            <td className="py-3 px-4 text-left text-slate-600">{api.dataType || 'Hộ tịch điện tử'}</td>
                            <td className="py-3 px-4 text-left text-slate-500 text-xs">{api.receiverPoint || 'Nguyễn Văn A - 0987654321'}</td>
                            <td className="py-3 px-4 text-left font-mono text-slate-400 text-xs">{formatDateTime(api.time || '2026-05-24 08:00:00')}</td>
                            <td className="py-3 px-4 text-left">
                              <button
                                onClick={() => window.open(`/preview-api-docs?apiId=${api.code || 'SVC-HOTICH-001'}&apiUrl=https://api.dldc.gov.vn${api.endpoint}&consumerUnit=${encodeURIComponent(api.consumerUnit || 'Bộ Kế hoạch và Đầu tư')}`, '_blank')}
                                className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-[6px] transition-colors cursor-pointer inline-flex items-center justify-center border border-red-200 bg-red-50/50"
                                title="Xem Tài liệu Đặc tả kỹ thuật API (PDF)"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                            </td>
                            <td className="py-3 px-4 text-left">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${api.status === 'Hoạt động' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-50 text-slate-500 border border-slate-200'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${api.status === 'Hoạt động' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
                                {api.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => { setSelectedApi(api); setShowApiModal(true); }}
                                  className="p-1.5 text-black hover:text-slate-700 hover:bg-slate-100 rounded-[6px] transition-all inline-flex items-center justify-center group cursor-pointer"
                                  title="Sửa thông tin API"
                                >
                                  <Edit3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                </button>
                                <button
                                  onClick={() => { setSelectedApiForHistory(api); setShowHistoryModal(true); }}
                                  className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-[6px] transition-all inline-flex items-center justify-center group cursor-pointer"
                                  title="Xem lịch sử phiên bản"
                                >
                                  <History className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                </button>
                                <button
                                  onClick={() => handleToggleApiStatus(api.id, api.status)}
                                  className={`p-1.5 rounded-[6px] transition-all inline-flex items-center justify-center group cursor-pointer ${api.status === 'Hoạt động'
                                    ? 'text-orange-500 hover:text-orange-600 hover:bg-orange-50'
                                    : 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50'
                                    }`}
                                  title={api.status === 'Hoạt động' ? "Tạm ngưng API" : "Kích hoạt API"}
                                >
                                  <Power className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {renderPagination(filteredApis.length)}
              </div>
            )}

            {/* TAB 2: API ĐỐI SOÁT DỮ LIỆU */}
            {activeTab === 'api_doi_soat' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse table-auto">
                    <thead>
                      <tr className="bg-slate-50 text-[13px] font-semibold text-slate-500 border-b border-slate-200 uppercase tracking-tight">
                        <th className="py-3 px-4 text-left font-semibold">Mã đối soát</th>
                        <th className="py-3 px-4 text-left font-semibold">Tên tiến trình đối soát</th>
                        <th className="py-3 px-4 text-center font-semibold">Phiên bản</th>
                        <th className="py-3 px-4 text-left font-semibold">Hệ thống đối tác</th>
                        <th className="py-3 px-4 text-left font-semibold">Tần suất đối soát</th>
                        <th className="py-3 px-4 text-left font-semibold">API liên kết</th>
                        <th className="py-3 px-4 text-left font-semibold">Tài liệu</th>
                        <th className="py-3 px-4 text-left font-semibold">Trạng thái</th>
                        <th className="py-3 px-4 text-center font-semibold">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 text-[13px]">
                      {paginatedRecons.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-8 text-center text-slate-500 font-medium">
                            Không tìm thấy API đối soát dữ liệu nào.
                          </td>
                        </tr>
                      ) : (
                        paginatedRecons.map(recon => (
                          <tr key={recon.id} className="hover:bg-slate-50/50 transition-all border-b border-slate-100 group">
                            <td className="py-3 px-4 text-left font-mono text-slate-500">UC-{recon.id}</td>
                            <td className="py-3 px-4 text-left font-semibold text-slate-800">{recon.name}</td>
                            <td className="py-3 px-4 text-center">
                              <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">{recon.version || 'v1.0'}</span>
                            </td>
                            <td className="py-3 px-4 text-left text-slate-600 text-xs">{recon.targetSystem}</td>
                            <td className="py-3 px-4 text-left text-slate-500 text-xs">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{recon.schedule}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-left text-indigo-600 font-medium text-xs">{recon.linkedApi}</td>
                            <td className="py-3 px-4 text-left">
                              <button
                                onClick={() => window.open(`/preview-api-docs?apiId=UC-${recon.id}&apiUrl=https://api.dldc.gov.vn/recon/${recon.id}`, '_blank')}
                                className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-[6px] transition-colors cursor-pointer inline-flex items-center justify-center border border-red-200 bg-red-50/50"
                                title="Xem Tài liệu Đặc tả kỹ thuật API (PDF)"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                            </td>
                            <td className="py-3 px-4 text-left">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${recon.status === 'active' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-slate-50 text-slate-500 border border-slate-200'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${recon.status === 'active' ? 'bg-purple-500 animate-pulse' : 'bg-slate-400'}`}></span>
                                {recon.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => { setSelectedRecon(recon); setShowReconModal(true); }}
                                  className="p-1.5 text-black hover:text-slate-700 hover:bg-slate-100 rounded-[6px] transition-all inline-flex items-center justify-center group cursor-pointer"
                                  title="Sửa thông tin đối soát"
                                >
                                  <Edit3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                </button>
                                <button
                                  onClick={() => { setSelectedApiForHistory({ ...recon, code: `UC-${recon.id}` }); setShowHistoryModal(true); }}
                                  className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-[6px] transition-all inline-flex items-center justify-center group cursor-pointer"
                                  title="Xem lịch sử phiên bản"
                                >
                                  <History className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                </button>
                                <button
                                  onClick={() => handleToggleReconStatus(recon.id, recon.status)}
                                  className={`p-1.5 rounded-[6px] transition-all inline-flex items-center justify-center group cursor-pointer ${recon.status === 'active'
                                    ? 'text-orange-500 hover:text-orange-600 hover:bg-orange-50'
                                    : 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50'
                                    }`}
                                  title={recon.status === 'active' ? "Tạm ngưng tiến trình đối soát" : "Kích hoạt tiến trình đối soát"}
                                >
                                  <Power className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {renderPagination(filteredRecons.length)}
              </div>
            )}

            {/* TAB 3: PHÂN QUYỀN TRUY CẬP */}
            {activeTab === 'phan_quyen' && (
              <div className="grid grid-cols-12 gap-6">
                
                {/* Left pane: API List */}
                <div className="col-span-12 lg:col-span-3 border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white shadow-sm">
                  <div className="bg-slate-50 p-4 border-b border-slate-200">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Danh sách dịch vụ API</h4>
                  </div>
                  <div className="p-2 space-y-1">
                    {apis.map(api => (
                      <button
                        key={api.id}
                        onClick={() => setSelectedApiForAccess(api.name)}
                        className={`w-full text-left p-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-between ${selectedApiForAccess === api.name
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50'
                          }`}
                      >
                        <span className="truncate mr-2">{api.name}</span>
                        <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">{api.version}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right pane: Beneficiaries with active permissions */}
                <div className="col-span-12 lg:col-span-9 space-y-4">
                  <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center justify-between shadow-sm">
                    <div>
                      <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block">API đang quản lý phân quyền</span>
                      <span className="text-base font-bold text-slate-800 mt-1 block">{selectedApiForAccess}</span>
                    </div>
                    <button
                      onClick={() => setShowAccessModal(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-xs flex items-center transition-colors shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Cấp quyền mới
                    </button>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse table-auto">
                        <thead>
                          <tr className="bg-slate-50 text-[13px] font-semibold text-slate-500 border-b border-slate-200 uppercase tracking-tight">
                            <th className="py-3 px-4 text-left font-semibold">Đơn vị được cấp quyền</th>
                            <th className="py-3 px-4 text-left font-semibold">Phạm vi quyền (Scopes)</th>
                            <th className="py-3 px-4 text-left font-semibold">IP Whitelist</th>
                            <th className="py-3 px-4 text-left font-semibold">Thời hạn hiệu lực</th>
                            <th className="py-3 px-4 text-left font-semibold">Trạng thái</th>
                            <th className="py-3 px-4 text-center font-semibold">Thu hồi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 text-[13px]">
                          {paginatedPermissions.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                                Chưa có đơn vị nào được cấp quyền khai thác API này.
                              </td>
                            </tr>
                          ) : (
                            paginatedPermissions.map(perm => (
                              <tr key={perm.id} className="hover:bg-slate-50/50 transition-all border-b border-slate-100">
                                <td className="py-3.5 px-4 font-semibold text-slate-800">{perm.organization}</td>
                                <td className="py-3.5 px-4 text-xs">
                                  <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200">
                                    {perm.scopes}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 font-mono text-xs text-slate-500">{perm.ipWhitelist}</td>
                                <td className="py-3.5 px-4 text-slate-600 text-xs">
                                  <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span>{perm.validFrom} ~ {perm.validTo}</span>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${perm.status === 'Hợp lệ' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                                    }`}>
                                    <CheckCircle2 className={`w-3.5 h-3.5 ${perm.status === 'Hợp lệ' ? 'text-emerald-500' : 'text-red-500'} shrink-0`} />
                                    {perm.status}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                  <button
                                    onClick={() => handleDeletePermission(perm.id)}
                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-[6px] transition-colors"
                                    title="Thu hồi quyền truy cập"
                                  >
                                    <Trash2 className="w-4 h-4 mx-auto" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    {renderPagination(filteredPermissions.length)}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 4: DANH SÁCH TÀI KHOẢN */}
            {activeTab === 'danh_sach_tai_khoan' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse table-auto">
                    <thead>
                      <tr className="bg-slate-50 text-[13px] font-semibold text-slate-500 border-b border-slate-200 uppercase tracking-tight">
                        <th className="py-3 px-4 text-left font-semibold">Tài khoản (Username)</th>
                        <th className="py-3 px-4 text-left font-semibold">Đơn vị được cấp quyền</th>
                        <th className="py-3 px-4 text-left font-semibold">Client ID / App Key</th>
                        <th className="py-3 px-4 text-left font-semibold">API được phép gọi</th>
                        <th className="py-3 px-4 text-left font-semibold">Ngày tạo</th>
                        <th className="py-3 px-4 text-left font-semibold">Trạng thái</th>
                        <th className="py-3 px-4 text-center font-semibold">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 text-[13px]">
                      {paginatedAccounts.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                            Chưa có tài khoản nào được tạo.
                          </td>
                        </tr>
                      ) : (
                        paginatedAccounts.map(acc => (
                          <tr key={acc.id} className="hover:bg-slate-50/50 transition-all border-b border-slate-100 group">
                            <td className="py-3.5 px-4 text-left">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                  <KeyRound className="w-4 h-4 text-slate-500" />
                                </div>
                                <span className="font-semibold text-slate-900">{acc.username}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-left font-medium text-slate-600">{acc.organization}</td>
                            <td className="py-3.5 px-4 text-left font-mono text-xs text-slate-500">{acc.clientId}</td>
                            <td className="py-3.5 px-4 text-left text-xs">
                              <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200">
                                {acc.apiName}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-left text-slate-400 font-mono text-xs">{formatDateTime(acc.createdAt)}</td>
                            <td className="py-3.5 px-4 text-left">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${acc.status === 'Hoạt động' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                                {acc.status === 'Hoạt động' ? <Unlock className="w-3.5 h-3.5 text-green-500 shrink-0" /> : <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                                {acc.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => setConfirmRefreshAccountId(acc.id)}
                                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-[6px] transition-colors"
                                  title="Làm mới App Key (Refresh Token)"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setAccounts(accounts.map(a => a.id === acc.id ? { ...a, status: a.status === 'Hoạt động' ? 'Đã khóa' : 'Hoạt động' } : a));
                                    triggerToast(acc.status === 'Hoạt động' ? 'Đã khóa tài khoản!' : 'Đã mở khóa tài khoản!');
                                  }}
                                  className={`p-1.5 rounded-[6px] transition-colors ${acc.status === 'Hoạt động' ? 'text-slate-400 hover:text-orange-600 hover:bg-orange-50' : 'text-slate-400 hover:text-green-600 hover:bg-green-50'}`}
                                  title={acc.status === 'Hoạt động' ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                                >
                                  <Power className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này? Thao tác này không thể hoàn tác.')) {
                                      setAccounts(accounts.filter(a => a.id !== acc.id));
                                      triggerToast('Đã xóa tài khoản thành công!');
                                    }
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-[6px] transition-colors"
                                  title="Xóa tài khoản"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {renderPagination(filteredAccounts.length)}
              </div>
            )}

          </div>
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

      {/* Version History Modal */}
      <ProvisionVersionHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        apiData={selectedApiForHistory}
      />

      {/* Create Account Modal */}
      <ProvisionAccountModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        organizations={Array.from(new Set(permissions.map(p => p.organization)))}
        onSave={(data) => {
          setAccounts([...accounts, { ...data, id: `acc_${Date.now()}`, status: 'Hoạt động', createdAt: new Date().toISOString().split('T')[0] }]);
          setSelectedUnitForAccount(data.organization);
          triggerToast('Đã tạo tài khoản mới thành công!');
        }}
      />

      {/* Confirm Refresh Token Modal */}
      {confirmRefreshAccountId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-3 bg-amber-50 text-amber-700">
              <RefreshCw className="w-5 h-5" />
              <h3 className="font-bold text-[15px]">Xác nhận làm mới App Key</h3>
            </div>
            <div className="p-6">
              <p className="text-slate-600 text-[13px] leading-relaxed">
                Bạn có chắc chắn muốn làm mới App Key cho tài khoản này? <br/><br/>
                <strong className="text-red-600">Lưu ý quan trọng:</strong> App Key cũ sẽ bị vô hiệu hóa ngay lập tức. Các hệ thống đối tác đang sử dụng Key cũ sẽ không thể gọi API được nữa cho đến khi được cập nhật Key mới.
              </p>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setConfirmRefreshAccountId(null)}
                className="px-4 py-2 text-[13px] font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => executeRefreshToken(confirmRefreshAccountId)}
                className="px-4 py-2 text-[13px] font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition-colors"
              >
                Xác nhận Làm mới
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Token Result Modal */}
      {newTokenResult && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-3 bg-green-50 text-green-700">
              <KeyRound className="w-5 h-5" />
              <h3 className="font-bold text-[15px]">Làm mới thành công</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-slate-600 text-[13px]">
                App Key mới đã được khởi tạo. Vui lòng sao chép và lưu trữ an toàn vì nó sẽ không được hiển thị đầy đủ ở các màn hình khác.
              </p>
              <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <code className="flex-1 text-sm font-bold text-slate-800 break-all">{newTokenResult.token}</code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(newTokenResult.token);
                    triggerToast('Đã sao chép App Key!');
                  }}
                  className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors shrink-0"
                  title="Sao chép"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setNewTokenResult(null)}
                className="px-6 py-2 text-[13px] font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
              >
                Đã lưu & Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
