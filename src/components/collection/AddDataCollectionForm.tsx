import { ArrowLeft, Save, X, Eye, EyeOff, Server, Globe2, FileDown, Database, Plus, Upload, Download } from 'lucide-react';
import { useState } from 'react';

interface AddDataCollectionFormProps {
  onBack: () => void;
  onSave: (data: any) => void;
}

export function AddDataCollectionForm({ onBack, onSave }: AddDataCollectionFormProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'provider' | 'connection' | 'collection'>('general');
  const [showPassword, setShowPassword] = useState(false);

  // Combobox State
  const [showDonViDropdown, setShowDonViDropdown] = useState(false);
  const [donViSearch, setDonViSearch] = useState('');
  const [donViList, setDonViList] = useState([
    { id: '1', name: 'Tòa án nhân dân tối cao', classification: 'Ngoài ngành' },
    { id: '2', name: 'Cục Thống kê Trung ương', classification: 'Ngoài ngành' },
    { id: '3', name: 'Cục Hành chính tư pháp', classification: 'Trong ngành' },
  ]);
  const [showCreateDonViModal, setShowCreateDonViModal] = useState(false);
  const [newDonViClassification, setNewDonViClassification] = useState('Trong ngành');

  const filteredDonVi = donViList.filter(dv => dv.name.toLowerCase().includes(donViSearch.toLowerCase()));

  const [formData, setFormData] = useState({
    // Tab 1: Thông tin chung
    connectionName: '',
    connectionCode: '',
    connectionType: 'API RESTful',
    status: 'Hoạt động',
    description: '',

    // Tab 2: Thông tin đơn vị cung cấp
    providerType: 'external',
    providerName: '',
    contactPerson: '',
    phoneNumber: '',
    contactEmail: '',

    // Tab 3: Cấu hình kết nối (Dynamic dựa trên connectionType)
    endpointUrl: '',
    authMethod: 'No Auth',
    authKey: '',
    authUsername: '',
    authPassword: '',
    timeout: '30000',
    // FTP Specific
    hostIp: '',
    port: '',
    directoryPath: '/',
    // SOAP Specific
    soapAction: '',
    xmlPayload: '',
    // DB Specific
    dbNameOrSid: '',
    dbSchema: '',
    connectString: '',

    // Tab 4: Cấu hình thu thập
    syncFrequency: 'Hằng ngày',
    syncStrategy: 'Full Load',
    primaryKey: '',
    batchSize: '1000',
    retryLimit: '3',
    actionAfterFailure: 'Gửi Cảnh báo Email'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mockup: Thêm mới kết nối thành công với 4 Tabs!\n(Chưa kết nối backend thực tế)');
    onSave && onSave(formData);
    onBack();
  };

  const handleTestConnection = () => {
    alert('Đang kiểm tra kết nối tới Endpoint/Server...\n\n(Mockup: Kết nối thành công 200 OK)');
  };

  // Removed getProviderOptions as we use dynamic list
  const tabs = [
    { id: 'general', label: 'Thông tin chung', step: 1 },
    { id: 'provider', label: 'Đơn vị cung cấp', step: 2 },
    { id: 'connection', label: 'Cấu hình kết nối', step: 3 },
    { id: 'collection', label: 'Cấu hình thu thập', step: 4 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button title="Hành động" aria-label="Hành động"
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h2 className="text-slate-900 font-bold text-lg">Thêm mới Thông tin kết nối</h2>
            <p className="text-sm text-slate-500 mt-0.5">Thiết lập tham số kết nối hệ thống nguồn (Collection Setup)</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col">
        {/* Lõi Tab Navigation */}
        <div className="flex border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className={`flex items-center justify-center w-5 h-5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {tab.step}
                </span>
                {tab.label}
              </div>
            </button>
          ))}
        </div>

        {/* Form Body - Render logic based on Active Tab */}
        <div className="p-6">
          {/* Tab 1: Thông tin chung */}
          {activeTab === 'general' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 relative">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tên đơn vị (Nguồn thu thập) <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={donViSearch}
                    onChange={(e) => {
                      setDonViSearch(e.target.value);
                      setShowDonViDropdown(true);
                      setFormData({ ...formData, providerName: e.target.value });
                    }}
                    onFocus={() => setShowDonViDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDonViDropdown(false), 200)}
                    placeholder="Tìm kiếm hoặc nhập Tên đơn vị mới..."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  {showDonViDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredDonVi.map(dv => (
                        <div
                          key={dv.id}
                          className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm flex items-center justify-between"
                          onMouseDown={(e) => {
                            e.preventDefault(); 
                            setDonViSearch(dv.name);
                            setFormData({ ...formData, providerName: dv.name, providerType: dv.classification === 'Trong ngành' ? 'internal' : 'external' });
                            setShowDonViDropdown(false);
                          }}
                        >
                          <span className="font-medium text-slate-700">{dv.name}</span>
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{dv.classification}</span>
                        </div>
                      ))}
                      {donViSearch && filteredDonVi.length === 0 && (
                        <div 
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm text-blue-600 font-medium flex items-center gap-2 border-t border-slate-100"
                          onMouseDown={(e) => {
                            e.preventDefault(); 
                            setShowDonViDropdown(false);
                            setShowCreateDonViModal(true);
                          }}
                        >
                          <Plus className="w-4 h-4" />
                          Thêm mới đơn vị "{donViSearch}"
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tên kết nối <span className="text-red-500">*</span></label>
                  <input
                    required type="text"
                    value={formData.connectionName}
                    onChange={(e) => setFormData({ ...formData, connectionName: e.target.value })}
                    placeholder="VD: Đồng bộ Hộ tịch từ Bộ Tư pháp"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Mã kết nối <span className="text-red-500">*</span></label>
                  <input
                    required type="text"
                    value={formData.connectionCode}
                    onChange={(e) => setFormData({ ...formData, connectionCode: e.target.value })}
                    placeholder="VD: CONN_HO_TICH_BTP"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Loại kết nối <span className="text-red-500">*</span></label>
                  <select
                    required
                    value={formData.connectionType}
                    onChange={(e) => setFormData({ ...formData, connectionType: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="API RESTful">API RESTful</option>
                    <option value="API SOAP">API SOAP</option>
                    <option value="Giao thức File (FTP/SFTP)">Giao thức File (FTP/SFTP)</option>
                    <option value="Upload File">Upload File (Thủ công)</option>
                    <option value="Database Oracle">Database (Oracle)</option>
                    <option value="Database Postgres">Database (PostgreSQL)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Trạng thái <span className="text-red-500">*</span></label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Hoạt động">Hoạt động (Active)</option>
                    <option value="Ngừng hoạt động">Ngừng hoạt động (Inactive)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mô tả chi tiết</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Diễn giải chi tiết mục đích của cấu hình thu thập này"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Thông tin đơn vị cung cấp */}
          {activeTab === 'provider' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Tên đơn vị (Đã chọn từ Tab Thông tin chung)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.providerName || 'Chưa chọn đơn vị'}
                    readOnly
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 font-medium focus:outline-none"
                  />
                  {formData.providerName && (
                    <span className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap border ${formData.providerType === 'internal' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                      {formData.providerType === 'internal' ? 'Trong ngành' : 'Ngoài ngành'}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Người đầu mối (Contact Person)</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="VD: Nguyễn Văn A - IT Dept"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Số điện thoại</label>
                    <input
                      type="text"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="VD: 0912345678"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email hỗ trợ</label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      placeholder="VD: dev@moj.gov.vn"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Cấu hình kết nối */}
          {activeTab === 'connection' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-blue-700 bg-blue-50 px-3 py-1.5 rounded-md inline-flex text-sm font-medium">
                  {formData.connectionType.includes('API') ? <Globe2 className="w-4 h-4" /> 
                    : formData.connectionType.includes('Database') ? <Database className="w-4 h-4" /> 
                    : <Server className="w-4 h-4" />}
                  Đang cấu hình: {formData.connectionType}
                </div>
                <button 
                  type="button" onClick={handleTestConnection}
                  className="px-4 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md text-sm font-medium transition-colors border border-slate-300"
                >
                  Kiểm tra Kết nối (Ping)
                </button>
              </div>

              {/* Sub-form API RESTful */}
              {formData.connectionType === 'API RESTful' && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Base URL / Endpoint <span className="text-red-500">*</span></label>
                    <input
                      required type="text"
                      value={formData.endpointUrl}
                      onChange={(e) => setFormData({ ...formData, endpointUrl: e.target.value })}
                      placeholder="https://api.domain.com/v1/sync"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phương thức xác thực <span className="text-red-500">*</span></label>
                    <select
                      value={formData.authMethod}
                      onChange={(e) => setFormData({ ...formData, authMethod: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="No Auth">No Auth</option>
                      <option value="API Key">API Key</option>
                      <option value="Bearer Token">Bearer Token</option>
                      <option value="Basic Auth">Basic Auth (User/Pass)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Timeout chờ phản hồi (ms) <span className="text-red-500">*</span></label>
                    <input
                      required type="number"
                      value={formData.timeout}
                      onChange={(e) => setFormData({ ...formData, timeout: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  
                  {/* Auth Fields Context */}
                  {(formData.authMethod === 'API Key' || formData.authMethod === 'Bearer Token') && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">{formData.authMethod} Value</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.authKey}
                          onChange={(e) => setFormData({ ...formData, authKey: e.target.value })}
                          className="w-full px-4 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}
                  {formData.authMethod === 'Basic Auth' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                        <input type="text" value={formData.authUsername} onChange={(e) => setFormData({...formData, authUsername: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                        <div className="relative">
                          <input type={showPassword ? "text" : "password"} value={formData.authPassword} onChange={(e) => setFormData({...formData, authPassword: e.target.value})} className="w-full px-4 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Sub-form API SOAP */}
              {formData.connectionType === 'API SOAP' && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="grid grid-cols-2 gap-6 col-span-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Tên service <span className="text-red-500">*</span></label>
                      <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                        <option value="">Chọn service</option>
                        <option value="CitizenService">CitizenService</option>
                        <option value="EnterpriseService">EnterpriseService</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Phương thức gọi <span className="text-red-500">*</span></label>
                      <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                        <option value="">Chọn phương thức</option>
                        <option value="GetCitizenInfo">GetCitizenInfo</option>
                        <option value="UpdateCitizenInfo">UpdateCitizenInfo</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">WSDL URL / Endpoint <span className="text-red-500">*</span></label>
                    <input required type="text" value={formData.endpointUrl} onChange={(e) => setFormData({ ...formData, endpointUrl: e.target.value })} placeholder="http://server:port/service?wsdl" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Timeout (ms)</label>
                    <input type="number" defaultValue="30000" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">SSL Required</label>
                    <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                      <option value="true">Bật (true)</option>
                      <option value="false">Tắt (false)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Số lần thử</label>
                    <input type="number" defaultValue="3" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Khoảng cách retry (ms)</label>
                    <input type="number" defaultValue="5000" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="col-span-2 grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">WS-Security Auth</label>
                      <select value={formData.authMethod} onChange={(e) => setFormData({ ...formData, authMethod: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                        <option value="No Auth">No Auth</option>
                        <option value="WSS UsernameToken">WSS (UsernameToken)</option>
                      </select>
                    </div>
                  </div>
                  
                  {formData.authMethod === 'WSS UsernameToken' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                        <input type="text" value={formData.authUsername} onChange={(e) => setFormData({...formData, authUsername: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                        <div className="relative">
                          <input type={showPassword ? "text" : "password"} value={formData.authPassword} onChange={(e) => setFormData({...formData, authPassword: e.target.value})} className="w-full px-4 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">XML Payload Template (Tùy chọn)</label>
                    <textarea rows={4} value={formData.xmlPayload} onChange={(e) => setFormData({ ...formData, xmlPayload: e.target.value })} placeholder="<soapenv:Envelope>...</soapenv:Envelope>" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" />
                  </div>
                </div>
              )}

              {/* Sub-form Database */}
              {formData.connectionType.includes('Database') && (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Host / IP <span className="text-red-500">*</span></label>
                    <input required type="text" value={formData.hostIp} onChange={(e) => setFormData({ ...formData, hostIp: e.target.value })} placeholder="192.168.1.100" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Port <span className="text-red-500">*</span></label>
                    <input required type="number" value={formData.port} onChange={(e) => setFormData({ ...formData, port: e.target.value })} placeholder={formData.connectionType === 'Database Oracle' ? '1521' : '5432'} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {formData.connectionType === 'Database Oracle' ? 'Service Name / SID' : 'Database Name'} <span className="text-red-500">*</span>
                    </label>
                    <input required type="text" value={formData.dbNameOrSid} onChange={(e) => setFormData({ ...formData, dbNameOrSid: e.target.value })} placeholder={formData.connectionType === 'Database Oracle' ? 'ORCL' : 'dldc_db'} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Schema (Optional)</label>
                    <input type="text" value={formData.dbSchema} onChange={(e) => setFormData({ ...formData, dbSchema: e.target.value })} placeholder={formData.connectionType === 'Database Oracle' ? 'HR' : 'public'} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>

                  <div className="col-span-2 grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Query/Table</label>
                      <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="VD: SELECT * FROM..." />
                    </div>
                  </div>

                  <div className="col-span-2 grid grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Connection Pool Size</label>
                      <input type="number" defaultValue="10" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Timeout (giây)</label>
                      <input type="number" defaultValue="30" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Batch Size</label>
                      <input type="number" defaultValue="1000" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Username <span className="text-red-500">*</span></label>
                    <input required type="text" value={formData.authUsername} onChange={(e) => setFormData({ ...formData, authUsername: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input required type={showPassword ? "text" : "password"} value={formData.authPassword} onChange={(e) => setFormData({ ...formData, authPassword: e.target.value })} className="w-full px-4 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  {formData.connectionType === 'Database Oracle' && (
                     <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">TNS Connection String (Nếu dùng TNS thay cho tham số rời)</label>
                      <textarea rows={2} value={formData.connectString} onChange={(e) => setFormData({ ...formData, connectString: e.target.value })} placeholder="(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=192.168.1.10)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=ORCL)))" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" />
                    </div>
                  )}
                </div>
              )}

              {/* Sub-form FTP */}
              {formData.connectionType === 'Giao thức File (FTP/SFTP)' && (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Host / IP <span className="text-red-500">*</span></label>
                    <input required type="text" value={formData.hostIp} onChange={(e) => setFormData({ ...formData, hostIp: e.target.value })} placeholder="192.168.1.100" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Port <span className="text-red-500">*</span></label>
                    <input required type="number" value={formData.port} onChange={(e) => setFormData({ ...formData, port: e.target.value })} placeholder="21 / 22" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Username <span className="text-red-500">*</span></label>
                    <input required type="text" value={formData.authUsername} onChange={(e) => setFormData({...formData, authUsername: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input required type={showPassword ? "text" : "password"} value={formData.authPassword} onChange={(e) => setFormData({...formData, authPassword: e.target.value})} className="w-full px-4 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Đường dẫn thư mục (Directory Path) <span className="text-red-500">*</span></label>
                    <input required type="text" value={formData.directoryPath} onChange={(e) => setFormData({...formData, directoryPath: e.target.value})} placeholder="/files/export/" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Timeout (giây)</label>
                    <input type="number" defaultValue="30" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
              )}

              {/* Sub-form File Upload */}
              {formData.connectionType === 'Upload File' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                     <h3 className="text-sm font-medium text-slate-700">Tải file dữ liệu lên hệ thống</h3>
                     <button type="button" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 transition-colors">
                       <Download className="w-4 h-4"/> Tải file mẫu (.xlsx)
                     </button>
                  </div>
                  
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer group">
                    <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6 text-blue-500" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Kéo thả file dữ liệu vào đây</p>
                    <p className="text-xs text-slate-500 mb-4">hoặc nhấn để chọn file từ máy tính</p>
                    <span className="px-3 py-1 bg-slate-200 text-slate-600 text-[10px] rounded uppercase font-bold tracking-wider">Hỗ trợ: .xlsx, .xls (Tối đa 50MB)</span>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-2 mt-4 text-sm text-blue-700">
                    <span className="font-semibold whitespace-nowrap">Lưu ý hệ thống:</span>
                    <span>Chỉ cho phép định dạng file excel (.xlsx, .xls) và dung lượng tối đa là 50MB.</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Cấu hình thu thập */}
          {activeTab === 'collection' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tần suất đồng bộ <span className="text-red-500">*</span></label>
                  <select
                    required
                    value={formData.syncFrequency}
                    onChange={(e) => setFormData({ ...formData, syncFrequency: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Hàng giờ">Hàng khoảng (Hàng giờ)</option>
                    <option value="Hằng ngày">Hằng ngày</option>
                    <option value="Hằng tuần">Hằng tuần</option>
                    <option value="Tùy chỉnh Cronjob">Tùy chỉnh (Cronjob)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Chiến lược Thu thập <span className="text-red-500">*</span></label>
                  <select
                    required
                    value={formData.syncStrategy}
                    onChange={(e) => setFormData({ ...formData, syncStrategy: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Full Load">Toàn phần (Full Load) - Quét trắng nạp mới</option>
                    <option value="Delta Load">Bổ sung (Delta Load) - Chỉ nạp cập nhật</option>
                  </select>
                </div>
              </div>

              {formData.syncStrategy === 'Delta Load' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Trường Khóa chính / Trường Timestamp (Primary Key) <span className="text-red-500">*</span></label>
                  <input
                    required type="text"
                    value={formData.primaryKey}
                    onChange={(e) => setFormData({ ...formData, primaryKey: e.target.value })}
                    placeholder="VD: id hoặc updated_at để so khớp Delta"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Kích thước lô (Batch Size)</label>
                  <select
                    value={formData.batchSize}
                    onChange={(e) => setFormData({ ...formData, batchSize: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="500">500 bản ghi</option>
                    <option value="1000">1000 bản ghi</option>
                    <option value="5000">5000 bản ghi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Số lần thử lại khi lỗi</label>
                  <input
                    type="number" max="10" min="0" required
                    value={formData.retryLimit}
                    onChange={(e) => setFormData({ ...formData, retryLimit: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Hành động sau sự cố</label>
                  <select
                    value={formData.actionAfterFailure}
                    onChange={(e) => setFormData({ ...formData, actionAfterFailure: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Gửi Cảnh báo Email">Gửi Cảnh báo Email tới Admin</option>
                    <option value="Tạm ngưng kết nối">Tạm ngưng luồng thu thập</option>
                    <option value="Bỏ qua lượt này">Bỏ qua và chờ lượt sau</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between rounded-b-lg">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 font-medium transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            Lưu cấu hình
          </button>
        </div>
      </form>

      {/* Modal Thêm mới đơn vị */}
      {showCreateDonViModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Thêm mới Đơn vị</h3>
              <button onClick={() => setShowCreateDonViModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tên đơn vị</label>
                <input
                  type="text"
                  value={donViSearch}
                  readOnly
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 font-medium focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nguồn thu thập <span className="text-red-500">*</span></label>
                <div className="flex gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer relative">
                    <input
                      type="radio"
                      name="newClassification"
                      value="Trong ngành"
                      checked={newDonViClassification === 'Trong ngành'}
                      onChange={() => setNewDonViClassification('Trong ngành')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <span className="text-sm font-medium text-slate-700">Trong ngành</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer relative">
                    <input
                      type="radio"
                      name="newClassification"
                      value="Ngoài ngành"
                      checked={newDonViClassification === 'Ngoài ngành'}
                      onChange={() => setNewDonViClassification('Ngoài ngành')}
                      className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-slate-300"
                    />
                    <span className="text-sm font-medium text-slate-700">Ngoài ngành</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCreateDonViModal(false)}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-lg text-sm font-medium transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  const newDv = { id: Date.now().toString(), name: donViSearch, classification: newDonViClassification };
                  setDonViList([...donViList, newDv]);
                  setFormData({ ...formData, providerName: newDv.name, providerType: newDv.classification === 'Trong ngành' ? 'internal' : 'external' });
                  setShowCreateDonViModal(false);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Xác nhận lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}