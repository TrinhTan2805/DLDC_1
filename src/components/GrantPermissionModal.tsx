import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Check, AlertCircle, User, Shield, Settings, Key, Globe, Plus, Building2, Mail, Phone, Search, Filter } from 'lucide-react';

interface Service {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'REST' | 'SOAP' | 'GraphQL';
  status: 'active' | 'inactive' | 'maintenance' | 'pending' | 'approved' | 'published' | 'publishing' | 'rejected';
  endpoint: string;
  version: string;
  department: string;
  createdDate: string;
  lastModified: string;
  visibility?: 'public' | 'private';
  maxRequestsPerDay?: number;
  baseUrl?: string;
  httpMethod?: string;
  contentType?: string;
  authType?: string;
  username?: string;
  password?: string;
  apiKey?: string;
  headerName?: string;
  unitCode?: string;
  systemCode?: string;
  isActive?: boolean;
  assignedUnits?: string[];
  accessStartDate?: string;
}

interface GrantPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
  selectedApi: Service | null;
  setSelectedApi: (service: Service | null) => void;
  selectedOrganization: string;
  setSelectedOrganization: (org: string) => void;
  permissions: {
    read: boolean;
    write: boolean;
    update: boolean;
    delete: boolean;
  };
  setPermissions: (perms: any) => void;
  maxCallsPerDay: string;
  setMaxCallsPerDay: (value: string) => void;
  allowedIPs: string[];
  setAllowedIPs: (ips: string[]) => void;
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  setContactPerson: (contact: any) => void;
  validUntil: string;
  setValidUntil: (date: string) => void;
}

// Mock organizations
const organizations = [
  { id: 'org1', name: 'Đơn vị A', parent: 'Bộ Tư pháp', status: 'active', currentApis: 5 },
  { id: 'org2', name: 'Đơn v B', parent: 'Bộ Tư pháp', status: 'active', currentApis: 3 },
  { id: 'org3', name: 'Đơn vị C', parent: 'Bộ Tư pháp', status: 'active', currentApis: 8 },
  { id: 'org4', name: 'Sở Tư pháp Hà Nội', parent: 'Ủy ban nhân dân TP Hà Nội', status: 'active', currentApis: 12 },
  { id: 'org5', name: 'Sở Tư pháp TP.HCM', parent: 'Ủy ban nhân dân TP.HCM', status: 'active', currentApis: 15 },
];

export function GrantPermissionModal({
  isOpen,
  onClose,
  services,
  currentStep,
  setCurrentStep,
  selectedApi,
  setSelectedApi,
  selectedOrganization,
  setSelectedOrganization,
  permissions,
  setPermissions,
  maxCallsPerDay,
  setMaxCallsPerDay,
  allowedIPs,
  setAllowedIPs,
  contactPerson,
  setContactPerson,
  validUntil,
  setValidUntil
}: GrantPermissionModalProps) {
  const [showCreateOrgModal, setShowCreateOrgModal] = useState(false);
  const [newOrgForm, setNewOrgForm] = useState({
    name: '',
    code: '',
    parent: '',
    address: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    description: ''
  });
  const [orgList, setOrgList] = useState(organizations);
  
  // Search and filter states for Step 1 (API selection)
  const [apiSearchTerm, setApiSearchTerm] = useState('');
  const [apiTypeFilter, setApiTypeFilter] = useState<string>('all');
  
  // Search and filter states for Step 2 (Organization selection)
  const [orgSearchTerm, setOrgSearchTerm] = useState('');
  const [orgParentFilter, setOrgParentFilter] = useState<string>('all');

  if (!isOpen) return null;

  // Filtered services for Step 1
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(apiSearchTerm.toLowerCase()) ||
                         service.code.toLowerCase().includes(apiSearchTerm.toLowerCase()) ||
                         (service.description && service.description.toLowerCase().includes(apiSearchTerm.toLowerCase()));
    const matchesType = apiTypeFilter === 'all' || service.type === apiTypeFilter;
    return matchesSearch && matchesType;
  });

  // Filtered organizations for Step 2
  const filteredOrganizations = orgList.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(orgSearchTerm.toLowerCase()) ||
                         org.parent.toLowerCase().includes(orgSearchTerm.toLowerCase());
    const matchesParent = orgParentFilter === 'all' || org.parent === orgParentFilter;
    return matchesSearch && matchesParent;
  });

  // Get unique parent organizations for filter
  const uniqueParents = Array.from(new Set(orgList.map(org => org.parent)));

  const handleNext = () => {
    if (currentStep === 1 && selectedApi) {
      setCurrentStep(2);
    } else if (currentStep === 2 && selectedOrganization) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Create permission grant
    const permissionData = {
      apiCode: selectedApi?.code,
      apiName: selectedApi?.name,
      organization: selectedOrganization,
      permissions,
      maxCallsPerDay: parseInt(maxCallsPerDay),
      allowedIPs: allowedIPs.filter(ip => ip.trim() !== ''),
      contactPerson,
      validUntil,
      grantedAt: new Date().toLocaleString('vi-VN'),
      grantedBy: 'Admin User'
    };

    console.log('Permission granted:', permissionData);
    
    // Show success message
    alert(`Đã cấp quyền thành công!\n\nAPI: ${selectedApi?.name}\nĐơn vị: ${selectedOrganization}\nLog đã được ghi nhận và thông báo đã được gửi.`);
    
    // Reset and close
    handleClose();
  };

  const handleClose = () => {
    setCurrentStep(1);
    setSelectedApi(null);
    setSelectedOrganization('');
    setPermissions({ read: true, write: false, update: false, delete: false });
    setMaxCallsPerDay('1000');
    setAllowedIPs(['']);
    setContactPerson({ name: '', email: '', phone: '' });
    setValidUntil('');
    onClose();
  };

  const selectedOrgData = orgList.find(o => o.id === selectedOrganization);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl text-white">Cấp quyền truy cập API</h3>
              <p className="text-sm text-blue-100 mt-0.5">
                Bước {currentStep}/3: {
                  currentStep === 1 ? 'Chọn API' :
                  currentStep === 2 ? 'Chọn đơn vị nhận quyền' :
                  'Cấu hình quyền và phạm vi sử dụng'
                }
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors" title="Đóng" aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-4 flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className={`flex-1 h-2 rounded-full transition-colors ${
                  step <= currentStep ? 'bg-white' : 'bg-white/30'
                }`} />
                {step < 3 && <ChevronRight className="w-4 h-4 text-white/60" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-220px)]">
          {/* Step 1: Select API */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-900">Chọn API bạn muốn cấp quyền truy cập</p>
                    <p className="text-xs text-blue-700 mt-1">Hệ thống sẽ hiển thị danh sách người dùng/tổ chức có thể được cấp quyền ở bước tiếp theo.</p>
                  </div>
                </div>
              </div>

              {/* Search and filter */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-500" />
                  <label htmlFor="api-search-input" className="sr-only">Tìm kiếm API</label>
                  <input
                    id="api-search-input"
                    type="text"
                    value={apiSearchTerm}
                    onChange={(e) => setApiSearchTerm(e.target.value)}
                    className="px-2 py-1 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tìm kiếm API..."
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <label htmlFor="api-type-filter" className="sr-only">Lọc theo loại API</label>
                  <select
                    id="api-type-filter"
                    value={apiTypeFilter}
                    onChange={(e) => setApiTypeFilter(e.target.value)}
                    className="px-2 py-1 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tất cả</option>
                    <option value="REST">REST</option>
                    <option value="SOAP">SOAP</option>
                    <option value="GraphQL">GraphQL</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedApi(service)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedApi?.id === service.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            selectedApi?.id === service.id ? 'bg-blue-600' : 'bg-slate-100'
                          }`}>
                            <Key className={`w-5 h-5 ${
                              selectedApi?.id === service.id ? 'text-white' : 'text-slate-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm text-slate-900">{service.name}</h4>
                              <code className="px-2 py-0.5 bg-slate-100 text-blue-700 rounded text-xs">
                                {service.code}
                              </code>
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                                {service.type}
                              </span>
                              <code className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                                {service.version}
                              </code>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{service.description}</p>
                            <p className="text-xs text-slate-400 mt-1 font-mono">{service.endpoint}</p>
                          </div>
                        </div>
                      </div>
                      {selectedApi?.id === service.id && (
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Organization */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-900">Chọn người dùng hoặc tổ chức được cấp quyền</p>
                    <p className="text-xs text-blue-700 mt-1">Hệ thống sẽ kiểm tra quyền hiện có và hiển thị trạng thái hợp lệ.</p>
                  </div>
                </div>
              </div>

              {/* Selected API Info */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 mb-2">API được chọn:</p>
                    <div className="flex items-center gap-2">
                      <code className="px-2 py-0.5 bg-slate-100 text-blue-700 rounded text-xs">
                        {selectedApi?.code}
                      </code>
                      <span className="text-sm text-slate-900">{selectedApi?.name}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCreateOrgModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Tạo đơn vị mới
                  </button>
                </div>
              </div>

              {/* Search and filter */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-500" />
                  <label htmlFor="org-search-input" className="sr-only">Tìm kiếm đơn vị</label>
                  <input
                    id="org-search-input"
                    type="text"
                    value={orgSearchTerm}
                    onChange={(e) => setOrgSearchTerm(e.target.value)}
                    className="px-2 py-1 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tìm kiếm đơn vị..."
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <label htmlFor="org-parent-filter" className="sr-only">Lọc theo cơ quan chủ quản</label>
                  <select
                    id="org-parent-filter"
                    value={orgParentFilter}
                    onChange={(e) => setOrgParentFilter(e.target.value)}
                    className="px-2 py-1 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tất cả</option>
                    {uniqueParents.map(parent => (
                      <option key={parent} value={parent}>{parent}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Organizations List */}
              <div className="space-y-2">
                {filteredOrganizations.map((org) => (
                  <div
                    key={org.id}
                    onClick={() => setSelectedOrganization(org.id)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedOrganization === org.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-slate-200 hover:border-green-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            selectedOrganization === org.id ? 'bg-green-600' : 'bg-slate-100'
                          }`}>
                            <User className={`w-5 h-5 ${
                              selectedOrganization === org.id ? 'text-white' : 'text-slate-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm text-slate-900">{org.name}</h4>
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                                {org.status === 'active' ? 'Hợp lệ' : 'Không hợp lệ'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Thuộc: {org.parent}</p>
                            <p className="text-xs text-slate-400 mt-1">Đang sử dụng: {org.currentApis} API</p>
                          </div>
                        </div>
                      </div>
                      {selectedOrganization === org.id && (
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Current permissions check */}
              {selectedOrgData && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-amber-900">Kiểm tra quyền hiện có</p>
                      <p className="text-xs text-amber-700 mt-1">
                        {selectedOrgData.name} hiện đang sử dụng {selectedOrgData.currentApis} API. 
                        Trạng thái: <span className="font-semibold">{selectedOrgData.status === 'active' ? 'Hợp lệ' : 'Không hợp lệ'}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Configure Permissions */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-900">Xác nhận cấp quyền và cấu hình phạm vi sử dụng</p>
                    <p className="text-xs text-blue-700 mt-1">Hệ thống sẽ lưu quyền, ghi log thao tác và gửi thông báo xác nhận.</p>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-xs text-slate-500 mb-2">API</p>
                  <p className="text-sm text-slate-900">{selectedApi?.name}</p>
                  <code className="text-xs text-blue-700">{selectedApi?.code}</code>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-xs text-slate-500 mb-2">Đơn vị nhận quyền</p>
                  <p className="text-sm text-slate-900">{selectedOrgData?.name}</p>
                  <p className="text-xs text-slate-500">{selectedOrgData?.parent}</p>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <label className="block text-sm text-slate-700 mb-3">
                  <Shield className="w-4 h-4 inline mr-1" />
                  Quyền truy cập
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['read', 'write', 'update', 'delete'].map((perm) => (
                    <label key={perm} htmlFor={`perm-${perm}`} className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                      <input
                        id={`perm-${perm}`}
                        type="checkbox"
                        checked={permissions[perm as keyof typeof permissions]}
                        onChange={(e) => setPermissions({ ...permissions, [perm]: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700 capitalize">
                        {perm === 'read' ? 'Đọc' : perm === 'write' ? 'Ghi' : perm === 'update' ? 'Cập nhật' : 'Xóa'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Max Calls */}
              <div>
                <label htmlFor="max-calls-input" className="block text-sm text-slate-700 mb-2">
                  <Settings className="w-4 h-4 inline mr-1" />
                  Giới hạn request/ngày
                </label>
                <input
                  id="max-calls-input"
                  type="number"
                  value={maxCallsPerDay}
                  onChange={(e) => setMaxCallsPerDay(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1000"
                />
              </div>

              {/* Contact Person */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Thông tin đầu mối
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    id="contact-name"
                    aria-label="Họ tên người liên hệ"
                    type="text"
                    value={contactPerson.name}
                    onChange={(e) => setContactPerson({ ...contactPerson, name: e.target.value })}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Họ tên"
                  />
                  <input
                    id="contact-email"
                    aria-label="Email người liên hệ"
                    type="email"
                    value={contactPerson.email}
                    onChange={(e) => setContactPerson({ ...contactPerson, email: e.target.value })}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email"
                  />
                  <input
                    id="contact-phone"
                    aria-label="Số điện thoại người liên hệ"
                    type="tel"
                    value={contactPerson.phone}
                    onChange={(e) => setContactPerson({ ...contactPerson, phone: e.target.value })}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Số điện thoại"
                  />
                </div>
              </div>

              {/* Allowed IPs */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  <Globe className="w-4 h-4 inline mr-1" />
                  IP được phép truy cập
                </label>
                <div className="space-y-2">
                  {allowedIPs.map((ip, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={ip}
                        onChange={(e) => {
                          const newIPs = [...allowedIPs];
                          newIPs[idx] = e.target.value;
                          setAllowedIPs(newIPs);
                        }}
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="192.168.1.100"
                      />
                      {allowedIPs.length > 1 && (
                        <button
                          onClick={() => setAllowedIPs(allowedIPs.filter((_, i) => i !== idx))}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Xóa IP"
                          aria-label="Xóa địa chỉ IP này"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setAllowedIPs([...allowedIPs, ''])}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    + Thêm IP
                  </button>
                </div>
              </div>

              {/* Valid Until */}
              <div>
                <label htmlFor="valid-until-date" className="block text-sm text-slate-700 mb-2">
                  Hiệu lực đến
                </label>
                <input
                  id="valid-until-date"
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="px-5 py-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Quay lại
              </button>
            )}
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !selectedApi) ||
                  (currentStep === 2 && !selectedOrganization)
                }
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Tiếp tục
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Xác nhận cấp quyền
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Create Organization Modal */}
      {showCreateOrgModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl text-white">Tạo đơn vị mới</h3>
                  <p className="text-sm text-green-100 mt-0.5">Nhập thông tin đơn vị cần cấp quyền</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowCreateOrgModal(false);
                  setNewOrgForm({
                    name: '',
                    code: '',
                    parent: '',
                    address: '',
                    contactName: '',
                    contactEmail: '',
                    contactPhone: '',
                    description: ''
                  });
                }}
                className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                title="Đóng"
                aria-label="Đóng bảng tạo đơn vị mới"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-4">
                {/* Organization Name */}
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    <Building2 className="w-4 h-4 inline mr-1" />
                    Tên đơn vị <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newOrgForm.name}
                    onChange={(e) => setNewOrgForm({ ...newOrgForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ví dụ: Sở Tư pháp Đà Nẵng"
                    required
                  />
                </div>

                {/* Organization Code */}
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Mã đơn vị <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newOrgForm.code}
                    onChange={(e) => setNewOrgForm({ ...newOrgForm, code: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ví dụ: STPDN"
                    required
                  />
                </div>

                {/* Parent Organization */}
                <div>
                  <label htmlFor="new-org-parent" className="block text-sm text-slate-700 mb-2">
                    Đơn vị cấp trên <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="new-org-parent"
                    value={newOrgForm.parent}
                    onChange={(e) => setNewOrgForm({ ...newOrgForm, parent: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Chọn đơn vị cấp trên</option>
                    <option value="Không có">Không có (Đơn vị cấp cao nhất)</option>
                    <option value="Bộ Tư pháp">Bộ Tư pháp</option>
                    <option value="Ủy ban nhân dân TP Hà Nội">Ủy ban nhân dân TP Hà Nội</option>
                    <option value="Ủy ban nhân dân TP.HCM">Ủy ban nhân dân TP.HCM</option>
                    <option value="Ủy ban nhân dân TP Đà Nẵng">Ủy ban nhân dân TP Đà Nẵng</option>
                    <option value="Ủy ban nhân dân TP Cần Thơ">Ủy ban nhân dân TP Cần Thơ</option>
                  </select>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    value={newOrgForm.address}
                    onChange={(e) => setNewOrgForm({ ...newOrgForm, address: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Địa chỉ trụ sở"
                  />
                </div>

                {/* Contact Information */}
                <div className="border-t border-slate-200 pt-4">
                  <h4 className="text-sm text-slate-700 mb-3">Thông tin người đầu mối</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">
                        <User className="w-3 h-3 inline mr-1" />
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newOrgForm.contactName}
                        onChange={(e) => setNewOrgForm({ ...newOrgForm, contactName: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Họ tên người đầu mối"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">
                          <Mail className="w-3 h-3 inline mr-1" />
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={newOrgForm.contactEmail}
                          onChange={(e) => setNewOrgForm({ ...newOrgForm, contactEmail: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="email@example.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">
                          <Phone className="w-3 h-3 inline mr-1" />
                          Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={newOrgForm.contactPhone}
                          onChange={(e) => setNewOrgForm({ ...newOrgForm, contactPhone: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="0123456789"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    value={newOrgForm.description}
                    onChange={(e) => setNewOrgForm({ ...newOrgForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ghi chú thêm về đơn vị..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateOrgModal(false);
                  setNewOrgForm({
                    name: '',
                    code: '',
                    parent: '',
                    address: '',
                    contactName: '',
                    contactEmail: '',
                    contactPhone: '',
                    description: ''
                  });
                }}
                className="px-5 py-2.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  // Validate required fields
                  if (!newOrgForm.name || !newOrgForm.code || !newOrgForm.parent || 
                      !newOrgForm.contactName || !newOrgForm.contactEmail || !newOrgForm.contactPhone) {
                    alert('Vui lòng điền đầy đủ các trường bắt buộc!');
                    return;
                  }

                  // Create new organization
                  const newOrg = {
                    id: `org${orgList.length + 1}`,
                    name: newOrgForm.name,
                    parent: newOrgForm.parent,
                    status: 'active' as const,
                    currentApis: 0
                  };

                  // Add to list
                  setOrgList([...orgList, newOrg]);
                  
                  // Select the new organization
                  setSelectedOrganization(newOrg.id);
                  
                  // Close modal and reset form
                  setShowCreateOrgModal(false);
                  setNewOrgForm({
                    name: '',
                    code: '',
                    parent: '',
                    address: '',
                    contactName: '',
                    contactEmail: '',
                    contactPhone: '',
                    description: ''
                  });

                  // Show success message
                  alert(`Đã tạo đơn vị "${newOrg.name}" thành công!`);
                }}
                className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Tạo đơn vị
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}