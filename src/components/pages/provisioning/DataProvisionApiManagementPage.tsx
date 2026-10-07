import React, { useState, useEffect, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  Server, GitCompare, Shield, History, Search, Filter, Plus,
  Trash2, Edit, Key, Clock, Calendar, CheckCircle2, XCircle, AlertTriangle, FileJson, Power, FileText, Users, KeyRound, RefreshCw, Lock, Unlock, Copy,
  ChevronDown, X, Eye, MoreVertical
} from 'lucide-react';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../../ui/dropdown-menu';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../ui/tooltip';
import { ConfirmModal } from '../../common/ConfirmModal';
import {
  Badge, TruncatedText, RowIconAction, Pagination, tabClass, BTN_PRIMARY, BTN_OUTLINE, BTN_DESTRUCTIVE, BTN_GHOST_ICON,
  ROW_ICON_BTN, MENU_ITEM, TOOLTIP_CLS, INPUT_CLS as BASE_INPUT_CLS, VIEW_FIELD_CLS, SEARCH_INPUT_CLS, SEARCH_BTN_CLS, filterBtnClass, FILTER_GRID_CLS, FILTER_LABEL, normalizeSearch
} from '../collection/collectionUi';
// Ô nhập chuẩn + quy tắc ô bị khóa ở màn Xem chi tiết (giá trị đen, placeholder xám)
const INPUT_CLS = `${BASE_INPUT_CLS} ${VIEW_FIELD_CLS}`;

import { ProvisionApiModal } from './modals/ProvisionApiModal';
import { ProvisionReconciliationApiModal } from './modals/ProvisionReconciliationApiModal';
import { ProvisionAccessControlModal } from './modals/ProvisionAccessControlModal';
import { ProvisionVersionHistoryModal } from './modals/ProvisionVersionHistoryModal';
import { ProvisionAccountModal } from './modals/ProvisionAccountModal';

// Mục menu ⋯: bị khóa thì hiển thị lý do ngay trong mục (compomennt.md 5.3.2) — giống CollectionSetupPage
const MenuAction = ({ icon, label, reason, danger, onSelect }: { icon: ReactNode; label: string; reason?: string | null; danger?: boolean; onSelect: () => void }) => (
  <DropdownMenuItem
    disabled={!!reason}
    onClick={reason ? undefined : onSelect}
    className={`${MENU_ITEM} items-start ${reason ? '' : danger ? 'text-[#DC2626] focus:text-[#DC2626]' : 'text-[#020817]'}`}
  >
    <span className={`mt-0.5 ${reason ? 'text-[#CBD5E1]' : danger ? 'text-[#DC2626]' : 'text-[#475569]'}`}>{icon}</span>
    <span className="flex flex-col">
      <span>{label}</span>
      {reason && <span className="text-[12px] text-[#64748B]">{reason}</span>}
    </span>
  </DropdownMenuItem>
);

// Nút ⋯ mở menu thao tác khác (tooltip chỉ hiện khi hover)
const MoreActionsTrigger = () => (
  <Tooltip>
    <TooltipTrigger asChild onFocus={(e: { preventDefault: () => void }) => e.preventDefault()}>
      <span className="inline-flex">
        <DropdownMenuTrigger asChild>
          <button type="button" aria-label="Thao tác khác" className={ROW_ICON_BTN}>
            <MoreVertical className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>
      </span>
    </TooltipTrigger>
    <TooltipContent side="top" sideOffset={4} className={TOOLTIP_CLS}>Thao tác khác</TooltipContent>
  </Tooltip>
);

// Ngày + giờ hiển thị 2 dòng (mục 5.3.3)
const DateTimeCell = ({ value }: { value: string }) => {
  const [d, t] = formatDateTime(value).split(' ');
  return (
    <>
      <div>{d}</div>
      {t && <div className="text-[#64748B]">{t}</div>}
    </>
  );
};

const TH = 'px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px]';
const TH_ACTION = `${TH.replace('text-left', 'text-center')} w-px sticky right-0 z-[1] bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]`;
const TR = 'group h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors';
const TD = 'px-3 py-1 text-left text-[13px] text-black';
const TD_ACTION = 'px-3 py-1 text-center whitespace-nowrap sticky right-0 bg-white group-hover:bg-[#F8FAFC] transition-colors shadow-[-1px_0_0_#E2E8F0]';
const EMPTY_TD = 'py-16 text-center text-[13px] text-[#64748B]';
const TABLE_WRAP = 'bg-white rounded-lg border border-[#E2E8F0] overflow-hidden';
const TABLE_CLS = 'w-full border-collapse collection-table text-[13px]';

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
  const location = useLocation();
  const navigate = useNavigate();

  const getInitialTab = () => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'api_cung_cap' || tab === 'api_doi_soat' || tab === 'phan_quyen' || tab === 'danh_sach_tai_khoan') {
      return tab as 'api_cung_cap' | 'api_doi_soat' | 'phan_quyen' | 'danh_sach_tai_khoan';
    }
    return 'api_cung_cap';
  };

  const [activeTab, setActiveTab] = useState<'api_cung_cap' | 'api_doi_soat' | 'phan_quyen' | 'danh_sach_tai_khoan'>(getInitialTab);

  const handleTabChange = (tab: 'api_cung_cap' | 'api_doi_soat' | 'phan_quyen' | 'danh_sach_tai_khoan') => {
    setActiveTab(tab);
    setSearchTerm('');
    setApplied(prev => ({ ...prev, searchTerm: '' }));
    setCurrentPage(1);
    const params = new URLSearchParams(location.search);
    params.set('tab', tab);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'api_cung_cap' || tab === 'api_doi_soat' || tab === 'phan_quyen' || tab === 'danh_sach_tai_khoan') {
      if (tab !== activeTab) {
        setActiveTab(tab);
      }
    }
  }, [location.search, activeTab]);

  const [searchTerm, setSearchTerm] = useState('');
  const [apiSearchTerm, setApiSearchTerm] = useState('');

  // Advanced Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [filterMethod, setFilterMethod] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterVersion, setFilterVersion] = useState<string>('All');
  const [filterReconSchedule, setFilterReconSchedule] = useState<string>('All');
  const [filterReconApi, setFilterReconApi] = useState<string>('All');

  // Bộ điều kiện đã áp dụng — chỉ cập nhật khi bấm Tìm kiếm hoặc Enter (mục 5.19)
  const [applied, setApplied] = useState({
    searchTerm: '', filterMethod: 'All', filterStatus: 'All', filterVersion: 'All', filterReconSchedule: 'All', filterReconApi: 'All'
  });

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
    setApplied({ searchTerm: '', filterMethod: 'All', filterStatus: 'All', filterVersion: 'All', filterReconSchedule: 'All', filterReconApi: 'All' });
    setCurrentPage(1);
  };

  const runSearch = () => {
    setApplied({ searchTerm, filterMethod, filterStatus, filterVersion, filterReconSchedule, filterReconApi });
    setCurrentPage(1);
  };

  // Modals state
  const [showApiModal, setShowApiModal] = useState(false);
  const [selectedApi, setSelectedApi] = useState<any>(null);
  const [apiModalMode, setApiModalMode] = useState<'view' | 'edit'>('edit');

  const [showReconModal, setShowReconModal] = useState(false);
  const [selectedRecon, setSelectedRecon] = useState<any>(null);

  const [showAccessModal, setShowAccessModal] = useState(false);
  const [selectedApiForAccess, setSelectedApiForAccess] = useState<string>('API cung cấp dữ liệu Hộ tịch điện tử');

  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedApiForHistory, setSelectedApiForHistory] = useState<any>(null);

  const [showAccountModal, setShowAccountModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  const [statusConfirmData, setStatusConfirmData] = useState<{
    id: string;
    type: 'api' | 'recon';
    action: 'kích hoạt' | 'tạm ngưng';
    currentStatus: string;
    name: string;
  } | null>(null);

  const [deleteConfirmApi, setDeleteConfirmApi] = useState<{ id: string; name: string } | null>(null);
  // Xác nhận thu hồi quyền / xóa tài khoản (thay window.confirm bằng ConfirmModal dùng chung)
  const [revokePermissionId, setRevokePermissionId] = useState<string | null>(null);
  const [deleteAccountId, setDeleteAccountId] = useState<string | null>(null);

  // Thông báo thành công (sonner)
  const triggerToast = (msg: string) => {
    toast.success(msg);
  };

  const [apis, setApis] = useState<any[]>(() => {
    const saved = localStorage.getItem('provision_apis');
    let data = saved ? JSON.parse(saved) : null;
    const defaultData = [
      { id: '1', code: 'SVC-HOTICH-001', name: 'API cung cấp dữ liệu Hộ tịch điện tử', endpoint: '/api/v1/hotich/search', method: 'GET', version: 'v1.2', status: 'Hoạt động', desc: 'Dịch vụ khai thác thông tin hộ tịch của công dân', dataType: 'Hộ tịch điện tử', consumerUnit: 'Bộ Kế hoạch và Đầu tư, Sở Tài chính tỉnh Bắc Ninh', receiverPoint: 'Nguyễn Văn A - 0987654321', time: '2026-05-24 08:00:00' },
      { id: '2', code: 'SVC-THADS-002', name: 'API đồng bộ dữ liệu thi hành án dân sự', endpoint: '/api/v1/thads/sync', method: 'POST', version: 'v2.0', status: 'Hoạt động', desc: 'Đồng bộ kết quả thi hành án dân sự tỉnh Bắc Ninh', dataType: 'Thi hành án dân sự', consumerUnit: 'Sở Tài chính tỉnh Bắc Ninh', receiverPoint: 'Trần Thị B - 0912345678', time: '2026-05-25 09:30:00' },
      { id: '3', code: 'SVC-BPBD-003', name: 'API đọc thông tin Biện pháp bảo đảm', endpoint: '/api/v1/bpbd/get', method: 'GET', version: 'v1.0', status: 'Hoạt động', desc: 'Đọc thông tin giao dịch bảo đảm', dataType: 'Biện pháp bảo đảm', consumerUnit: 'Sở Tư pháp tỉnh Bắc Ninh', receiverPoint: 'Phạm Văn C - 0901234567', time: '2026-05-25 14:15:00' }
    ];

    if (data && Array.isArray(data)) {
      const hasMulti = data.some(item => item.consumerUnit && item.consumerUnit.includes(','));
      if (!hasMulti) {
        data = data.map(item => item.id === '1' ? { ...item, consumerUnit: 'Bộ Kế hoạch và Đầu tư, Sở Tài chính tỉnh Bắc Ninh' } : item);
        localStorage.setItem('provision_apis', JSON.stringify(data));
      }
      return data;
    }
    return defaultData;
  });

  useEffect(() => {
    localStorage.setItem('provision_apis', JSON.stringify(apis));
  }, [apis]);

  useEffect(() => {
    if (!selectedApiForAccess) return;
    const apiObj = apis.find(api => api.name === selectedApiForAccess);
    if (!apiObj || !apiObj.consumerUnit) return;

    const defaultUnits = apiObj.consumerUnit.split(',').map((u: string) => u.trim()).filter(Boolean);

    // Auto fill missing permissions
    setPermissions(prev => {
      const missingPermissions: any[] = [];
      defaultUnits.forEach((unit: string) => {
        const exists = prev.some(p => p.apiName === selectedApiForAccess && p.organization === unit);
        if (!exists) {
          missingPermissions.push({
            id: 'p_auto_' + Math.random().toString(36).substr(2, 9),
            apiName: selectedApiForAccess,
            organization: unit,
            scopes: 'Đọc (GET)',
            ipWhitelist: 'Tất cả IP',
            validFrom: '2026-06-16',
            validTo: '2027-06-16',
            status: 'Hợp lệ'
          });
        }
      });
      if (missingPermissions.length > 0) {
        return [...prev, ...missingPermissions];
      }
      return prev;
    });

    // Auto fill missing accounts
    setAccounts(prev => {
      const missingAccounts: any[] = [];
      defaultUnits.forEach((unit: string) => {
        const exists = prev.some(a => a.apiName === selectedApiForAccess && a.organization === unit);
        if (!exists) {
          let prefix = 'org';
          if (unit.includes('Công an')) prefix = 'ca';
          else if (unit.includes('Y tế')) prefix = 'yte';
          else if (unit.includes('Tài chính')) prefix = 'tc';
          else if (unit.includes('Kế hoạch')) prefix = 'khdt';
          else if (unit.includes('Lao động')) prefix = 'sld';
          else if (unit.includes('Giáo dục')) prefix = 'sgd';
          else if (unit.includes('Thông tin')) prefix = 'stttt';
          
          const rand = Math.floor(10 + Math.random() * 90);
          const username = `${prefix}_bacninh_${rand}`;
          
          missingAccounts.push({
            id: 'acc_auto_' + Math.random().toString(36).substr(2, 9),
            username: username,
            apiName: selectedApiForAccess,
            organization: unit,
            clientId: 'client_' + Math.random().toString(36).substring(2, 10),
            status: 'Hoạt động',
            createdAt: '2026-06-16'
          });
        }
      });
      if (missingAccounts.length > 0) {
        return [...prev, ...missingAccounts];
      }
      return prev;
    });
  }, [selectedApiForAccess, apis]);

  const [recons, setRecons] = useState<any[]>([
    { id: '662', name: 'Đối soát tổng hợp danh mục dữ liệu dùng chung', targetSystem: 'Hệ thống đích (Các Bộ/Ngành)', schedule: 'Định kỳ (Hàng ngày) / Theo yêu cầu', linkedApi: 'Lấy danh sách Hộ tịch', status: 'active' },
    { id: '663', name: 'Đối soát cung cấp dữ liệu Hộ tịch điện tử', targetSystem: 'Hệ thống Bộ Tư pháp', schedule: 'Định kỳ (Hàng tuần) / Theo yêu cầu', linkedApi: 'Lấy danh sách Hộ tịch', status: 'active' },
    { id: '664', name: 'Đối soát cung cấp dữ liệu thi hành án dân sự', targetSystem: 'Hệ thống THADS', schedule: 'Định kỳ (Hàng ngày) / Theo yêu cầu', linkedApi: 'Đồng bộ dữ liệu THADS', status: 'active' },
    { id: '665', name: 'Đối soát cung cấp dữ liệu biện pháp bảo đảm', targetSystem: 'Cục Giao dịch bảo đảm', schedule: 'Theo yêu cầu', linkedApi: 'Đọc thông tin Biện pháp bảo đảm', status: 'inactive' }
  ]);

  const [permissions, setPermissions] = useState<any[]>(() => {
    const saved = localStorage.getItem('provision_permissions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      { id: 'p1', apiName: 'API cung cấp dữ liệu Hộ tịch điện tử', organization: 'Công an tỉnh Bắc Ninh', scopes: 'Đọc (GET)', ipWhitelist: '192.168.12.100', validFrom: '2026-05-01', validTo: '2027-05-01', status: 'Hợp lệ' },
      { id: 'p2', apiName: 'API cung cấp dữ liệu Hộ tịch điện tử', organization: 'Sở Y tế tỉnh Bắc Ninh', scopes: 'Đọc (GET)', ipWhitelist: '10.20.30.45', validFrom: '2026-04-15', validTo: '2027-04-15', status: 'Hợp lệ' },
      { id: 'p3', apiName: 'API đồng bộ dữ liệu thi hành án dân sự', organization: 'Sở Tài chính tỉnh Bắc Ninh', scopes: 'Đọc (GET), Ghi (POST)', ipWhitelist: '172.16.8.99', validFrom: '2026-05-10', validTo: '2027-05-10', status: 'Hợp lệ' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('provision_permissions', JSON.stringify(permissions));
  }, [permissions]);

  const [accounts, setAccounts] = useState<any[]>(() => {
    const saved = localStorage.getItem('provision_accounts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      { id: 'acc1', username: 'yte_bacninh_01', apiName: 'API cung cấp dữ liệu Hộ tịch điện tử', organization: 'Sở Y tế tỉnh Bắc Ninh', clientId: 'client_7a9b8c2d', status: 'Hoạt động', createdAt: '2026-05-15' },
      { id: 'acc2', username: 'ca_bacninh_01', apiName: 'API cung cấp dữ liệu Hộ tịch điện tử', organization: 'Công an tỉnh Bắc Ninh', clientId: 'client_3x9v2m1l', status: 'Hoạt động', createdAt: '2026-05-10' },
      { id: 'acc3', username: 'tc_bacninh_01', apiName: 'API đồng bộ dữ liệu thi hành án dân sự', organization: 'Sở Tài chính tỉnh Bắc Ninh', clientId: 'client_9k2m4n5b', status: 'Hoạt động', createdAt: '2026-05-12' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('provision_accounts', JSON.stringify(accounts));
  }, [accounts]);

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

  const handleToggleApiStatus = (id: string, currentStatus: string, name: string) => {
    const isTạmNgưng = currentStatus === 'Tạm ngưng';
    setStatusConfirmData({
      id,
      type: 'api',
      action: isTạmNgưng ? 'kích hoạt' : 'tạm ngưng',
      currentStatus,
      name
    });
  };

  const handleDeleteApi = (id: string, name: string) => {
    setDeleteConfirmApi({ id, name });
  };

  const confirmDeleteApi = (id: string) => {
    const updated = apis.filter(item => item.id !== id);
    setApis(updated);
    localStorage.setItem('provision_apis', JSON.stringify(updated));
    setDeleteConfirmApi(null);
    triggerToast('Đã xóa API thành công!');
  };

  const handleToggleReconStatus = (id: string, currentStatus: string, name: string) => {
    const isInactive = currentStatus === 'inactive';
    setStatusConfirmData({
      id,
      type: 'recon',
      action: isInactive ? 'kích hoạt' : 'tạm ngưng',
      currentStatus,
      name
    });
  };

  const handleDeletePermission = (id: string) => {
    setRevokePermissionId(id);
  };

  const confirmRevokePermission = (id: string) => {
    setPermissions(permissions.filter(item => item.id !== id));
    triggerToast('Thu hồi quyền truy cập thành công!');
  };

  const confirmDeleteAccount = (id: string) => {
    setAccounts(accounts.filter(a => a.id !== id));
    triggerToast('Đã xóa tài khoản thành công!');
  };

  const appliedTerm = normalizeSearch(applied.searchTerm);
  const matchTerm = (...values: (string | undefined)[]) => appliedTerm === '' || values.some(v => normalizeSearch(v || '').includes(appliedTerm));

  const filteredApis = apis.filter(api => {
    const matchesSearch = matchTerm(api.name, api.endpoint, api.code);
    const matchesMethod = applied.filterMethod === 'All' || api.method === applied.filterMethod;
    const matchesStatus = applied.filterStatus === 'All' || api.status === applied.filterStatus;
    const matchesVersion = applied.filterVersion === 'All' || api.version === applied.filterVersion;
    return matchesSearch && matchesMethod && matchesStatus && matchesVersion;
  });

  const filteredRecons = recons.filter(recon => {
    const matchesSearch = matchTerm(recon.name, recon.targetSystem);
    const matchesStatus = applied.filterStatus === 'All' ||
      (applied.filterStatus === 'Hoạt động' && recon.status === 'active') ||
      (applied.filterStatus === 'Tạm ngưng' && recon.status === 'inactive');
    const matchesSchedule = applied.filterReconSchedule === 'All' ||
      (applied.filterReconSchedule === 'Hàng ngày' && recon.schedule.includes('Hàng ngày')) ||
      (applied.filterReconSchedule === 'Hàng tuần' && recon.schedule.includes('Hàng tuần')) ||
      (applied.filterReconSchedule === 'Theo yêu cầu' && recon.schedule.includes('Theo yêu cầu'));
    const matchesApi = applied.filterReconApi === 'All' || recon.linkedApi === applied.filterReconApi;
    return matchesSearch && matchesStatus && matchesSchedule && matchesApi;
  });

  const filteredPermissions = permissions.filter(p => {
    if (p.apiName !== selectedApiForAccess) return false;
    return matchTerm(p.organization, p.scopes);
  });

  const filteredAccounts = accounts.filter(acc => matchTerm(acc.username, acc.organization, acc.apiName));

  const paginatedApis = filteredApis.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const paginatedRecons = filteredRecons.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const paginatedPermissions = filteredPermissions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const paginatedAccounts = filteredAccounts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const renderPagination = (totalItems: number) => (
    <Pagination
      className="border-t border-[#E2E8F0]"
      currentPage={currentPage}
      totalItems={totalItems}
      pageSize={itemsPerPage}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
    />
  );

  // Khung modal tự dựng (createPortal, z-index 999999, không đóng khi bấm nền) — giao diện theo mục 5.4
  const MODAL_OVERLAY = 'fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200';
  const MODAL_BOX = 'bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200';
  const MODAL_HEADER = 'px-6 py-4 border-b border-[#E2E8F0] flex items-start gap-3';
  const MODAL_TITLE = 'flex-1 min-w-0 pt-2 text-[16px] font-medium text-[#020817] leading-6';
  const MODAL_BODY = 'px-6 py-4 overflow-y-auto custom-scrollbar text-[13px] text-[#020817] leading-5';
  const MODAL_FOOTER = 'px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3';

  const tabs: { key: 'api_cung_cap' | 'api_doi_soat' | 'phan_quyen' | 'danh_sach_tai_khoan'; label: string; icon: ReactNode }[] = [
    { key: 'api_cung_cap', label: 'API Cung cấp dữ liệu', icon: <Server className="w-4 h-4" /> },
    { key: 'api_doi_soat', label: 'API Đối soát dữ liệu', icon: <GitCompare className="w-4 h-4" /> },
    { key: 'phan_quyen', label: 'Phân quyền truy cập', icon: <Shield className="w-4 h-4" /> },
    { key: 'danh_sach_tai_khoan', label: 'Danh sách tài khoản', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div className="api-management-page-root">
      <div className="h-full flex flex-col bg-[#F8FAFC] min-h-screen animate-in fade-in duration-300">

        {/* Navigation Tabs (mục 5.9) */}
        <div className="bg-white border-b border-[#E2E8F0] px-6">
          <div className="flex">
            {tabs.map(t => (
              <button
                key={t.key}
                type="button"
                onClick={() => handleTabChange(t.key)}
                className={`${tabClass(activeTab === t.key)} whitespace-nowrap`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-4">

            {/* Filters and Actions (mục 5.19) */}
            {activeTab !== 'phan_quyen' && (
              <div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 flex items-center gap-1.5">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        aria-label="Tìm kiếm"
                        placeholder={
                          activeTab === 'api_cung_cap'
                            ? "Tìm kiếm API cung cấp theo tên, mã hoặc endpoint..."
                            : activeTab === 'api_doi_soat'
                            ? "Tìm kiếm API đối soát theo tên hoặc hệ thống..."
                            : (activeTab as string) === 'phan_quyen'
                            ? "Tìm kiếm quyền truy cập theo đơn vị..."
                            : "Tìm kiếm tài khoản theo username hoặc đơn vị..."
                        }
                        className={SEARCH_INPUT_CLS}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
                      />
                    </div>
                    <button
                      type="button"
                      aria-label="Tìm kiếm"
                      title="Tìm kiếm"
                      onClick={runSearch}
                      className={SEARCH_BTN_CLS}
                    >
                      <Search className="w-5 h-5" />
                    </button>
                    {(activeTab === 'api_cung_cap' || activeTab === 'api_doi_soat') && (
                      <button
                        type="button"
                        aria-label="Bộ lọc"
                        aria-expanded={showFilters}
                        onClick={() => setShowFilters(!showFilters)}
                        className={filterBtnClass(showFilters)}
                        title="Bộ lọc"
                      >
                        {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {activeTab === 'api_cung_cap' && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedApi(null);
                          setApiModalMode('edit');
                          setShowApiModal(true);
                        }}
                        className={`${BTN_PRIMARY} whitespace-nowrap`}
                        title="Tạo API Cung cấp mới"
                      >
                        <Plus className="w-4 h-4" />
                        Tạo API Cung cấp mới
                      </button>
                    )}
                    {activeTab === 'api_doi_soat' && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRecon(null);
                          setShowReconModal(true);
                        }}
                        className={`${BTN_PRIMARY} whitespace-nowrap`}
                        title="Tạo API Đối soát mới"
                      >
                        <Plus className="w-4 h-4" />
                        Tạo API Đối soát mới
                      </button>
                    )}

                    {activeTab === 'danh_sach_tai_khoan' && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAccount(null);
                          setShowAccountModal(true);
                        }}
                        className={`${BTN_PRIMARY} whitespace-nowrap`}
                        title="Tạo tài khoản mới"
                      >
                        <Plus className="w-4 h-4" />
                        Tạo tài khoản mới
                      </button>
                    )}
                  </div>
                </div>

                {/* Row 2: Filters Panel — áp dụng khi bấm Tìm kiếm / Enter */}
                {showFilters && (activeTab === 'api_cung_cap' || activeTab === 'api_doi_soat') && (
                  <div className={`${FILTER_GRID_CLS} animate-in slide-in-from-top-2 duration-200`}>
                    {activeTab === 'api_cung_cap' && (
                      <>
                        <div>
                          <label className={FILTER_LABEL}>Phương thức kết nối</label>
                          <select
                            aria-label="Phương thức kết nối"
                            value={filterMethod}
                            onChange={(e) => setFilterMethod(e.target.value)}
                            className={`${INPUT_CLS} cursor-pointer`}
                          >
                            <option value="All">Tất cả phương thức</option>
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="DELETE">DELETE</option>
                          </select>
                        </div>
                        <div>
                          <label className={FILTER_LABEL}>Trạng thái API</label>
                          <select
                            aria-label="Trạng thái API"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className={`${INPUT_CLS} cursor-pointer`}
                          >
                            <option value="All">Tất cả trạng thái</option>
                            <option value="Hoạt động">Hoạt động (Active)</option>
                            <option value="Tạm ngưng">Tạm ngưng (Inactive)</option>
                          </select>
                        </div>
                        <div>
                          <label className={FILTER_LABEL}>Phiên bản API</label>
                          <select
                            aria-label="Phiên bản API"
                            value={filterVersion}
                            onChange={(e) => setFilterVersion(e.target.value)}
                            className={`${INPUT_CLS} cursor-pointer`}
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
                          <label className={FILTER_LABEL}>Tần suất đối soát</label>
                          <select
                            aria-label="Tần suất đối soát"
                            value={filterReconSchedule}
                            onChange={(e) => setFilterReconSchedule(e.target.value)}
                            className={`${INPUT_CLS} cursor-pointer`}
                          >
                            <option value="All">Tất cả tần suất</option>
                            <option value="Hàng ngày">Hàng ngày (Daily)</option>
                            <option value="Hàng tuần">Hàng tuần (Weekly)</option>
                            <option value="Theo yêu cầu">Theo yêu cầu (On-demand)</option>
                          </select>
                        </div>
                        <div>
                          <label className={FILTER_LABEL}>Trạng thái đối soát</label>
                          <select
                            aria-label="Trạng thái đối soát"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className={`${INPUT_CLS} cursor-pointer`}
                          >
                            <option value="All">Tất cả trạng thái</option>
                            <option value="Hoạt động">Hoạt động (Active)</option>
                            <option value="Tạm ngưng">Tạm ngưng (Inactive)</option>
                          </select>
                        </div>
                        <div>
                          <label className={FILTER_LABEL}>API liên kết đối soát</label>
                          <select
                            aria-label="API liên kết đối soát"
                            value={filterReconApi}
                            onChange={(e) => setFilterReconApi(e.target.value)}
                            className={`${INPUT_CLS} cursor-pointer`}
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
              <div className={TABLE_WRAP}>
                <div className="overflow-x-auto">
                  <table className={TABLE_CLS}>
                    <thead className="bg-[#F8FAFC]">
                      <tr className="h-[42px]">
                        <th className={`${TH} min-w-[220px]`}>Mã / Tên API</th>
                        <th className={TH}>Phiên bản</th>
                        <th className={TH}>Loại dữ liệu chia sẻ</th>
                        <th className={TH}>Đầu mối tiếp nhận</th>
                        <th className={TH}>Thời gian</th>
                        <th className={`${TH} text-center`}>Tài liệu</th>
                        <th className={TH}>Trạng thái</th>
                        <th className={TH_ACTION}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedApis.length === 0 ? (
                        <tr>
                          <td colSpan={8} className={EMPTY_TD}>
                            Không tìm thấy API cung cấp dữ liệu nào.
                          </td>
                        </tr>
                      ) : (
                        paginatedApis.map(api => (
                          <tr key={api.id} className={TR}>
                            <td className={`${TD} max-w-[360px] leading-[18px]`}>
                              <TruncatedText text={api.name} />
                              <TruncatedText text={api.code || 'SVC-HOTICH-001'} className="text-[#64748B]" />
                            </td>
                            <td className={`${TD} whitespace-nowrap`}>{api.version}</td>
                            <td className={`${TD} max-w-[220px]`}>
                              <TruncatedText text={api.dataType || 'Hộ tịch điện tử'} />
                            </td>
                            <td className={`${TD} max-w-[220px]`}>
                              <TruncatedText text={api.receiverPoint || 'Nguyễn Văn A - 0987654321'} />
                            </td>
                            <td className={`${TD} whitespace-nowrap leading-[18px]`}>
                              <DateTimeCell value={api.time || '2026-05-24 08:00:00'} />
                            </td>
                            <td className={`${TD} text-center`}>
                              <RowIconAction
                                label="Xem Tài liệu Đặc tả kỹ thuật API (PDF)"
                                onClick={() => window.open(`/preview-api-docs?apiId=${api.code || 'SVC-HOTICH-001'}&apiUrl=https://api.dldc.gov.vn${api.endpoint}&consumerUnit=${encodeURIComponent(api.consumerUnit || 'Bộ Kế hoạch và Đầu tư')}`, '_blank')}
                              >
                                <FileText className="w-4 h-4" />
                              </RowIconAction>
                            </td>
                            <td className={TD}>
                              <Badge label={api.status} variant={api.status === 'Hoạt động' ? 'green' : 'slate'} />
                            </td>
                            <td className={TD_ACTION}>
                              {/* 5 thao tác → 2 icon (Xem chi tiết + Sửa) + menu ⋯ (mục 5.3.2) */}
                              <div className="inline-flex items-center justify-center gap-1">
                                <RowIconAction
                                  label="Xem chi tiết API"
                                  onClick={() => { setSelectedApi(api); setApiModalMode('view'); setShowApiModal(true); }}
                                >
                                  <Eye className="w-4 h-4" />
                                </RowIconAction>
                                <RowIconAction
                                  label="Sửa thông tin API"
                                  onClick={() => { setSelectedApi(api); setApiModalMode('edit'); setShowApiModal(true); }}
                                >
                                  <Edit className="w-4 h-4" />
                                </RowIconAction>
                                <DropdownMenu>
                                  <MoreActionsTrigger />
                                  <DropdownMenuContent align="end" className="w-56 rounded-lg border border-[#E2E8F0] bg-white shadow-lg p-1">
                                    <MenuAction
                                      icon={<History className="w-4 h-4" />}
                                      label="Xem lịch sử phiên bản"
                                      onSelect={() => { setSelectedApiForHistory(api); setShowHistoryModal(true); }}
                                    />
                                    <MenuAction
                                      icon={<Power className="w-4 h-4" />}
                                      label={api.status === 'Hoạt động' ? "Tạm ngưng API" : "Kích hoạt API"}
                                      onSelect={() => handleToggleApiStatus(api.id, api.status, api.name)}
                                    />
                                    <MenuAction
                                      icon={<Trash2 className="w-4 h-4" />}
                                      label="Xóa API"
                                      danger
                                      onSelect={() => handleDeleteApi(api.id, api.name)}
                                    />
                                  </DropdownMenuContent>
                                </DropdownMenu>
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
              <div className={TABLE_WRAP}>
                <div className="overflow-x-auto">
                  <table className={TABLE_CLS}>
                    <thead className="bg-[#F8FAFC]">
                      <tr className="h-[42px]">
                        <th className={TH}>Mã đối soát</th>
                        <th className={`${TH} min-w-[220px]`}>Tên tiến trình đối soát</th>
                        <th className={TH}>Hệ thống đối tác</th>
                        <th className={TH}>Tần suất đối soát</th>
                        <th className={TH}>API liên kết</th>
                        <th className={`${TH} text-center`}>Tài liệu</th>
                        <th className={TH}>Trạng thái</th>
                        <th className={TH_ACTION}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedRecons.length === 0 ? (
                        <tr>
                          <td colSpan={8} className={EMPTY_TD}>
                            Không tìm thấy API đối soát dữ liệu nào.
                          </td>
                        </tr>
                      ) : (
                        paginatedRecons.map(recon => (
                          <tr key={recon.id} className={TR}>
                            <td className={`${TD} whitespace-nowrap`}>UC-{recon.id}</td>
                            <td className={`${TD} max-w-[360px]`}>
                              <TruncatedText text={recon.name} />
                            </td>
                            <td className={`${TD} max-w-[220px]`}>
                              <TruncatedText text={recon.targetSystem} />
                            </td>
                            <td className={`${TD} max-w-[220px]`}>
                              <TruncatedText text={recon.schedule} />
                            </td>
                            <td className={`${TD} max-w-[220px]`}>
                              <TruncatedText text={recon.linkedApi} />
                            </td>
                            <td className={`${TD} text-center`}>
                              <RowIconAction
                                label="Xem Tài liệu Đặc tả kỹ thuật API (PDF)"
                                onClick={() => window.open(`/preview-api-docs?apiId=UC-${recon.id}&apiUrl=https://api.dldc.gov.vn/recon/${recon.id}`, '_blank')}
                              >
                                <FileText className="w-4 h-4" />
                              </RowIconAction>
                            </td>
                            <td className={TD}>
                              <Badge label={recon.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'} variant={recon.status === 'active' ? 'green' : 'slate'} />
                            </td>
                            <td className={TD_ACTION}>
                              <div className="inline-flex items-center justify-center gap-1">
                                <RowIconAction
                                  label="Sửa thông tin đối soát"
                                  onClick={() => { setSelectedRecon(recon); setShowReconModal(true); }}
                                >
                                  <Edit className="w-4 h-4" />
                                </RowIconAction>
                                <RowIconAction
                                  label={recon.status === 'active' ? "Tạm ngưng tiến trình đối soát" : "Kích hoạt tiến trình đối soát"}
                                  onClick={() => handleToggleReconStatus(recon.id, recon.status, recon.name)}
                                >
                                  <Power className="w-4 h-4" />
                                </RowIconAction>
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
              <div className="space-y-4">

                {/* Khối 1: Danh sách dịch vụ API — bố cục dọc, rộng hết chiều ngang (PM 07/10/2026) */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#E2E8F0]">
                    <h4 className="text-[14px] font-medium text-[#020817]">Danh sách dịch vụ API</h4>
                  </div>

                  {/* Search API Input — lọc ngay khi gõ (không có nút áp dụng) */}
                  <div className="p-2 border-b border-[#E2E8F0]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
                      <input
                        type="text"
                        aria-label="Tìm kiếm dịch vụ API"
                        placeholder="Tìm kiếm dịch vụ API..."
                        className={`${INPUT_CLS} pl-9`}
                        value={apiSearchTerm}
                        onChange={(e) => setApiSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="p-2 space-y-1 custom-scrollbar max-h-[180px] overflow-y-scroll">
                    {apis
                      .filter(api => normalizeSearch(api.name).includes(normalizeSearch(apiSearchTerm)))
                      .map(api => (
                      <button
                        key={api.id}
                        type="button"
                        onClick={() => setSelectedApiForAccess(api.name)}
                        title={api.name}
                        className={`w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors flex items-center justify-between gap-2 cursor-pointer ${selectedApiForAccess === api.name
                          ? 'bg-[#EAF3FF] text-[#155DFC] font-medium border-l-4 border-blue-600'
                          : 'text-[#334155] hover:bg-[#F8FAFC]'
                          }`}
                      >
                        <span className="truncate">{api.name}</span>
                        <span className="text-[12px] text-[#64748B] shrink-0">{api.version}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Khối 2: Đơn vị được cấp quyền của API đang chọn */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
                  <div className="px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <span className="text-[13px] text-[#155DFC] font-medium block">API đang quản lý phân quyền</span>
                      <span className="text-[16px] font-medium text-[#020817] mt-1 block truncate">{selectedApiForAccess}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAccessModal(true)}
                      className={`${BTN_PRIMARY} whitespace-nowrap shrink-0`}
                    >
                      <Plus className="w-4 h-4" />
                      Cấp quyền mới
                    </button>
                  </div>

                  <div className="p-4">
                  <div className={TABLE_WRAP}>
                    <div className="overflow-x-auto">
                      <table className={TABLE_CLS}>
                        <thead className="bg-[#F8FAFC]">
                          <tr className="h-[42px]">
                            <th className={TH}>Đơn vị được cấp quyền</th>
                            <th className={TH}>Tài khoản (Username)</th>
                            <th className={TH}>IP Whitelist</th>
                            <th className={TH}>Thời hạn hiệu lực</th>
                            <th className={TH_ACTION}>Thu hồi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedPermissions.length === 0 ? (
                            <tr>
                              <td colSpan={5} className={EMPTY_TD}>
                                Chưa có đơn vị nào được cấp quyền khai thác API này.
                              </td>
                            </tr>
                          ) : (
                            paginatedPermissions.map(perm => (
                              <tr key={perm.id} className={TR}>
                                <td className={`${TD} max-w-[280px]`}>
                                  <TruncatedText text={perm.organization} />
                                </td>
                                <td className={`${TD} whitespace-nowrap`}>
                                  {(() => {
                                    const acc = accounts.find(a => a.organization === perm.organization && a.apiName === perm.apiName);
                                    return acc ? acc.username : '-';
                                  })()}
                                </td>
                                <td className={`${TD} whitespace-nowrap`}>{perm.ipWhitelist}</td>
                                <td className={`${TD} whitespace-nowrap`}>
                                  <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-[#94A3B8] shrink-0" />
                                    <span>{perm.validFrom} ~ {perm.validTo}</span>
                                  </div>
                                </td>
                                <td className={TD_ACTION}>
                                  <RowIconAction
                                    label="Thu hồi quyền truy cập"
                                    onClick={() => handleDeletePermission(perm.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </RowIconAction>
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

              </div>
            )}

            {/* TAB 4: DANH SÁCH TÀI KHOẢN */}
            {activeTab === 'danh_sach_tai_khoan' && (
              <div className={TABLE_WRAP}>
                <div className="overflow-x-auto">
                  <table className={TABLE_CLS}>
                    <thead className="bg-[#F8FAFC]">
                      <tr className="h-[42px]">
                        <th className={TH}>Tài khoản (Username)</th>
                        <th className={TH}>Đơn vị được cấp quyền</th>
                        <th className={TH}>Client ID / App Key</th>
                        <th className={TH}>Ngày tạo</th>
                        <th className={TH}>Trạng thái</th>
                        <th className={TH_ACTION}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedAccounts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className={EMPTY_TD}>
                            Chưa có tài khoản nào được tạo.
                          </td>
                        </tr>
                      ) : (
                        paginatedAccounts.map(acc => (
                          <tr key={acc.id} className={TR}>
                            <td className={`${TD} whitespace-nowrap`}>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center shrink-0">
                                  <KeyRound className="w-4 h-4 text-[#64748B]" />
                                </div>
                                <span>{acc.username}</span>
                              </div>
                            </td>
                            <td className={`${TD} max-w-[280px]`}>
                              <TruncatedText text={acc.organization} />
                            </td>
                            <td className={`${TD} whitespace-nowrap`}>{acc.clientId}</td>
                            <td className={`${TD} whitespace-nowrap leading-[18px]`}>
                              <DateTimeCell value={acc.createdAt} />
                            </td>
                            <td className={TD}>
                              <Badge
                                label={acc.status}
                                variant={acc.status === 'Hoạt động' ? 'green' : 'slate'}
                                icon={acc.status === 'Hoạt động' ? <Unlock className="w-3.5 h-3.5 shrink-0" /> : <Lock className="w-3.5 h-3.5 shrink-0" />}
                              />
                            </td>
                            <td className={TD_ACTION}>
                              {/* 4 thao tác → 2 icon (Chỉnh sửa + Làm mới App Key) + menu ⋯ (mục 5.3.2) */}
                              <div className="inline-flex items-center justify-center gap-1">
                                <RowIconAction
                                  label="Chỉnh sửa tài khoản"
                                  onClick={() => {
                                    setSelectedAccount(acc);
                                    setShowAccountModal(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </RowIconAction>
                                <RowIconAction
                                  label="Làm mới App Key (Refresh Token)"
                                  onClick={() => setConfirmRefreshAccountId(acc.id)}
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </RowIconAction>
                                <DropdownMenu>
                                  <MoreActionsTrigger />
                                  <DropdownMenuContent align="end" className="w-56 rounded-lg border border-[#E2E8F0] bg-white shadow-lg p-1">
                                    <MenuAction
                                      icon={acc.status === 'Hoạt động' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                                      label={acc.status === 'Hoạt động' ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                                      onSelect={() => {
                                        setAccounts(accounts.map(a => a.id === acc.id ? { ...a, status: a.status === 'Hoạt động' ? 'Đã khóa' : 'Hoạt động' } : a));
                                        triggerToast(acc.status === 'Hoạt động' ? 'Đã khóa tài khoản!' : 'Đã mở khóa tài khoản!');
                                      }}
                                    />
                                    <MenuAction
                                      icon={<Trash2 className="w-4 h-4" />}
                                      label="Xóa tài khoản"
                                      danger
                                      onSelect={() => setDeleteAccountId(acc.id)}
                                    />
                                  </DropdownMenuContent>
                                </DropdownMenu>
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
        mode={apiModalMode}
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
        availableOrganizations={Array.from(new Set(accounts.map(a => a.organization)))}
        preConfiguredOrganizations={(() => {
          const apiObj = apis.find(api => api.name === selectedApiForAccess);
          if (apiObj && apiObj.consumerUnit) {
            return apiObj.consumerUnit.split(',').map((u: string) => u.trim()).filter(Boolean);
          }
          return [];
        })()}
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
        organizations={Array.from(new Set([...accounts.map(a => a.organization), 'Bộ Kế hoạch và Đầu tư', 'Sở Tài chính tỉnh Bắc Ninh', 'Sở Tư pháp tỉnh Bắc Ninh', 'Sở Thông tin và Truyền thông tỉnh Bắc Ninh', 'Công an tỉnh Bắc Ninh', 'Sở Y tế tỉnh Bắc Ninh']))}
        accountData={selectedAccount}
        onSave={(data) => {
          if (selectedAccount) {
            setAccounts(accounts.map(a => a.id === selectedAccount.id ? { ...a, ...data } : a));
            triggerToast('Đã cập nhật tài khoản thành công!');
          } else {
            setAccounts([...accounts, { ...data, id: `acc_${Date.now()}`, status: 'Hoạt động', createdAt: new Date().toISOString().split('T')[0] }]);
            setSelectedUnitForAccount(data.organization);
            triggerToast('Đã tạo tài khoản mới thành công!');
          }
        }}
      />

      {/* Thu hồi quyền truy cập (trước đây dùng window.confirm) */}
      <ConfirmModal
        isOpen={!!revokePermissionId}
        onClose={() => setRevokePermissionId(null)}
        onConfirm={() => { if (revokePermissionId) confirmRevokePermission(revokePermissionId); }}
        title="Thu hồi quyền truy cập"
        subtitle=""
        message="Bạn có chắc chắn muốn thu hồi quyền truy cập này?"
        confirmText="Thu hồi"
        cancelText="Hủy bỏ"
        type="delete"
      />

      {/* Xóa tài khoản (trước đây dùng window.confirm) */}
      <ConfirmModal
        isOpen={!!deleteAccountId}
        onClose={() => setDeleteAccountId(null)}
        onConfirm={() => { if (deleteAccountId) confirmDeleteAccount(deleteAccountId); }}
        title="Xóa tài khoản"
        subtitle=""
        message="Bạn có chắc chắn muốn xóa tài khoản này? Thao tác này không thể hoàn tác."
        confirmText="Xóa tài khoản"
        cancelText="Hủy bỏ"
        type="delete"
      />

      {/* Confirm Refresh Token Modal */}
      {confirmRefreshAccountId && createPortal(
        <div style={{ zIndex: 999999 }} className={MODAL_OVERLAY}>
          <div className={MODAL_BOX}>
            <div className={MODAL_HEADER}>
              <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-[#FFF7ED] text-[#D97706]">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className={MODAL_TITLE}>Xác nhận làm mới App Key</h3>
              <button type="button" onClick={() => setConfirmRefreshAccountId(null)} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={MODAL_BODY}>
              <p>
                Bạn có chắc chắn muốn làm mới App Key cho tài khoản này? <br/><br/>
                <strong className="font-medium text-[#DC2626]">Lưu ý quan trọng:</strong> App Key cũ sẽ bị vô hiệu hóa ngay lập tức. Các hệ thống đối tác đang sử dụng Key cũ sẽ không thể gọi API được nữa cho đến khi được cập nhật Key mới.
              </p>
            </div>
            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => setConfirmRefreshAccountId(null)}
                className={BTN_OUTLINE}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => executeRefreshToken(confirmRefreshAccountId)}
                className={BTN_DESTRUCTIVE}
              >
                Xác nhận Làm mới
              </button>
            </div>
          </div>
        </div>
      , document.body)}

      {/* New Token Result Modal */}
      {newTokenResult && createPortal(
        <div style={{ zIndex: 999999 }} className={MODAL_OVERLAY}>
          <div className={MODAL_BOX}>
            <div className={MODAL_HEADER}>
              <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-[#F0FDF4] text-[#16A34A]">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className={MODAL_TITLE}>Làm mới thành công</h3>
              <button type="button" onClick={() => setNewTokenResult(null)} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={`${MODAL_BODY} space-y-4`}>
              <p>
                App Key mới đã được khởi tạo. Vui lòng sao chép và lưu trữ an toàn vì nó sẽ không được hiển thị đầy đủ ở các màn hình khác.
              </p>
              <div className="flex items-center gap-2 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                <span className="flex-1 text-[13px] text-[#020817] break-all">{newTokenResult.token}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(newTokenResult.token);
                    triggerToast('Đã sao chép App Key!');
                  }}
                  className={`${BTN_GHOST_ICON} shrink-0`}
                  aria-label="Sao chép"
                  title="Sao chép"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => setNewTokenResult(null)}
                className={BTN_PRIMARY}
              >
                Đã lưu & Đóng
              </button>
            </div>
          </div>
        </div>
      , document.body)}

      {statusConfirmData && createPortal(
        <div style={{ zIndex: 999999 }} className={MODAL_OVERLAY}>
          <div className={MODAL_BOX}>
            <div className={MODAL_HEADER}>
              <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-[#EAF3FF] text-[#155DFC]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className={MODAL_TITLE}>
                Xác nhận {statusConfirmData.action} {statusConfirmData.type === 'api' ? 'API' : 'tiến trình đối soát'}
              </h3>
              <button type="button" onClick={() => setStatusConfirmData(null)} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={MODAL_BODY}>
              Bạn có chắc chắn muốn <span className="font-medium">{statusConfirmData.action}</span> {statusConfirmData.type === 'api' ? 'API cung cấp' : 'tiến trình đối soát'}:
              <span className="font-medium text-blue-600 block mt-2">{statusConfirmData.name}</span>
              <div className="mt-4">
                {statusConfirmData.action === 'tạm ngưng' ? (
                  <span className="text-[#DC2626]">Lưu ý: Hệ thống đối tác sẽ không thể kết nối hoặc đối soát thông tin qua dịch vụ này cho đến khi được kích hoạt lại.</span>
                ) : (
                  <span className="text-[#64748B]">Dịch vụ này sẽ quay trở lại trạng thái Hoạt động bình thường.</span>
                )}
              </div>
            </div>
            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => setStatusConfirmData(null)}
                className={BTN_OUTLINE}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  const { id, type, action, currentStatus } = statusConfirmData;
                  if (type === 'api') {
                    const isTạmNgưng = currentStatus === 'Tạm ngưng';
                    const newStatus = isTạmNgưng ? 'Hoạt động' : 'Tạm ngưng';
                    setApis(apis.map(item => item.id === id ? { ...item, status: newStatus } : item));
                    triggerToast(`Đã ${action} API thành công!`);
                  } else {
                    const isInactive = currentStatus === 'inactive';
                    const newStatus = isInactive ? 'active' : 'inactive';
                    setRecons(recons.map(item => item.id === id ? { ...item, status: newStatus } : item));
                    triggerToast(`Đã ${action} tiến trình đối soát thành công!`);
                  }
                  setStatusConfirmData(null);
                }}
                className={BTN_PRIMARY}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      , document.body)}

      {deleteConfirmApi && createPortal(
        <div style={{ zIndex: 999999 }} className={MODAL_OVERLAY}>
          <div className={MODAL_BOX}>
            <div className={MODAL_HEADER}>
              <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-[#FEF2F2] text-[#DC2626]">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className={MODAL_TITLE}>Xác nhận xóa API</h3>
              <button
                type="button"
                onClick={() => setDeleteConfirmApi(null)}
                className={BTN_GHOST_ICON}
                aria-label="Đóng"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={MODAL_BODY}>
              Bạn có chắc chắn muốn xóa API:
              <span className="font-medium text-blue-600 block mt-2">{deleteConfirmApi.name}</span>
              <div className="mt-4 flex items-start gap-2 p-3 bg-[#FFF7ED] border border-[#FED7AA] rounded-lg">
                <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                <span className="text-[13px] text-[#020817]">Cảnh báo: Xóa API sẽ đồng thời xóa tất cả quyền truy cập đã cấp cho API này. Thao tác này không thể hoàn tác.</span>
              </div>
            </div>
            <div className={MODAL_FOOTER}>
              <button
                type="button"
                onClick={() => setDeleteConfirmApi(null)}
                className={BTN_OUTLINE}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => confirmDeleteApi(deleteConfirmApi.id)}
                className={BTN_DESTRUCTIVE}
              >
                Xóa API
              </button>
            </div>
          </div>
        </div>
      , document.body)}
    </div>
  );
}
