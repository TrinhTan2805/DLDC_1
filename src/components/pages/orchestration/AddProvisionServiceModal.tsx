import { useState, useEffect, type FormEvent } from 'react';
import {
  X, FileText, Database, Plug, Shield, Upload,
  AlertCircle, Server, Globe, Lock, Share2,
  Play, Plus, Trash2, GitMerge, ArrowRight, Code2, Settings, Info, Search, Save, CheckCircle2, XCircle, MessageSquare
} from 'lucide-react';
import { ConnectionConfigSection } from '../collection/ConnectionConfigSection';

interface AddProvisionServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'add' | 'edit' | 'view' | 'approve';
  data?: any;
}

type TabType = 'general' | 'data' | 'connection' | 'settings' | 'policy';

export function AddProvisionServiceModal({ isOpen, onClose, mode = 'add', data }: AddProvisionServiceModalProps) {
  if (!isOpen) return null;

  const isView = mode === 'view' || mode === 'approve';
  const isEdit = mode === 'edit';
  const isAdd = mode === 'add';
  const isApprovalReview = mode === 'approve';

  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [selectedTable, setSelectedTable] = useState('dkkd');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [sharingPlatform, setSharingPlatform] = useState('lgsp');

  // Draft / Status state
  const [draftStatus, setDraftStatus] = useState<'draft' | 'pending' | null>(null);
  const [showSendConfirm, setShowSendConfirm] = useState(false);
  const [showSentBanner, setShowSentBanner] = useState(false);
  const [accessScope, setAccessScope] = useState('approval');

  // Approval actions state
  const [approvalDecision, setApprovalDecision] = useState<'approve' | 'reject' | 'request-info' | null>(null);
  const [approvalNote, setApprovalNote] = useState('');
  const [showApprovalConfirm, setShowApprovalConfirm] = useState(false);

  const [serviceForm, setServiceForm] = useState({
    serviceName: '',
    serviceCode: '',
    dataType: '',
    frequency: '',
    protocol: '',
    accessScope: '',
    sharingPolicy: '',
    description: '',
    category: '',
    selectedTable: 'dkkd',
    selectedFields: [] as string[]
  });

  // Danh sách bảng join (Mock)
  const [joinedTables, setJoinedTables] = useState([
    { id: '1', name: 'b_nganh_nghe (Ngành nghề kinh doanh)', joinType: 'INNER JOIN', primaryKey: 'dkkd.ma_nganh', foreignKey: 'b_nganh_nghe.id_nganh' },
    { id: '2', name: 'b_nop_thue (Lịch sử nộp thuế)', joinType: 'LEFT JOIN', primaryKey: 'dkkd.ma_dn', foreignKey: 'b_nop_thue.ma_dn' }
  ]);

  // Test API Mock (Tab 2)
  const [testResult, setTestResult] = useState<string>('');
  const [isTesting, setIsTesting] = useState(false);

  // Join Modal (Tab 2)
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Test Connection (Tab 3)
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [showConnectionResult, setShowConnectionResult] = useState<'success' | 'error' | null>(null);

  const handleTestAPI = () => {
    setIsTesting(true);
    setTimeout(() => {
      setTestResult(`{
  "status": 200,
  "message": "Success",
  "data": [
    {
      "company_code": "0101234567",
      "company_name": "Tập đoàn Mẫu",
      "business_sector": "Công nghệ thông tin"
    }
  ]
}`);
      setIsTesting(false);
    }, 800);
  };

  const handleTestConnection = () => {
    setIsTestingConnection(true);
    setTimeout(() => {
      // Giả lập thất bại để hiển thị popup lỗi và hướng xử lý theo yêu cầu
      setShowConnectionResult('error');
      setIsTestingConnection(false);
    }, 1200);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert('Thêm mới dịch vụ cung cấp API thành công!');
    onClose();
  };

  const tabs = [
    { id: 'general' as TabType, label: 'Thông tin chung', icon: <FileText className="w-4 h-4" /> },
    { id: 'data' as TabType, label: 'Cấu hình dữ liệu chia sẻ', icon: <Database className="w-4 h-4" /> },
    { id: 'connection' as TabType, label: 'Cấu hình kết nối API', icon: <Plug className="w-4 h-4" /> },
    { id: 'settings' as TabType, label: 'Cấu hình đồng bộ', icon: <Settings className="w-4 h-4" /> },
    { id: 'policy' as TabType, label: 'Chính sách & Phê duyệt', icon: <Shield className="w-4 h-4" /> },
  ];

  const tableFields: Record<string, Array<{ id: string, label: string }>> = {
    congchung: [
      { id: 'soCongChung', label: 'Số công chứng' },
      { id: 'ngayCongChung', label: 'Ngày công chứng' },
      { id: 'loaiHopDong', label: 'Loại hợp đồng' },
      { id: 'noiDungHopDong', label: 'Nội dung hợp đồng' },
      { id: 'giaTriHopDong', label: 'Giá trị hợp đồng' }
    ],
    dkkd: [
      { id: 'maSoDKKD', label: 'Mã số ĐKKD' },
      { id: 'tenDoanhNghiep', label: 'Tên doanh nghiệp' },
      { id: 'loaiHinhDN', label: 'Loại hình doanh nghiệp' },
      { id: 'nguoiDaiDien', label: 'Người đại diện' },
      { id: 'diaChiTruSo', label: 'Địa chỉ trụ sở' }
    ],
  };

  const currentFields = tableFields[selectedTable] || [];

  // Initialize data from props
  useEffect(() => {
    if (data && (isEdit || isView)) {
      setServiceForm({
        serviceName: data.name || '',
        serviceCode: data.code || '',
        dataType: data.dataType || 'Văn bản pháp luật',
        frequency: data.frequency || 'Thời gian thực',
        protocol: data.type || 'REST',
        accessScope: data.visibility === 'public' ? 'public' : 'approval',
        sharingPolicy: data.sharingPolicy || '',
        description: data.description || '',
        category: data.category || 'Văn bản quy phạm',
        selectedTable: data.sourceTable || 'dkkd',
        selectedFields: data.selectedFields || []
      });
      setAccessScope(data.visibility === 'public' ? 'public' : 'approval');
      if (data.status === 'pending') setDraftStatus('pending');
      else if (data.status === 'inactive') setDraftStatus('draft');
    } else {
      // Reset form for 'add' mode
      setServiceForm({
        serviceName: '',
        serviceCode: '',
        dataType: '',
        frequency: '',
        protocol: '',
        accessScope: '',
        sharingPolicy: '',
        description: '',
        category: '',
        selectedTable: '',
        selectedFields: []
      });
      setDraftStatus(null);
    }
  }, [data, mode, isOpen]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg text-slate-900 font-medium">
                {isAdd ? 'Thiết lập kết nối chia sẻ dữ liệu' : isEdit ? 'Chỉnh sửa dịch vụ chia sẻ' : 'Chi tiết dịch vụ chia sẻ'}
              </h2>
              {draftStatus === 'draft' && (
                <span className="text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full inline-block" />
                  Đang soạn thảo (Draft)
                </span>
              )}
              {draftStatus === 'pending' && (
                <span className="text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full inline-block animate-pulse" />
                  Chờ phê duyệt
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500">Thông tin cấu hình API gửi lên LGSP/NDXP</p>
          </div>
          <button 
            onClick={onClose} 
            title="Đóng" 
            aria-label="Đóng bảng thiết lập"
            className="p-1 hover:bg-slate-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="border-b border-slate-200 bg-slate-50">
          <div className="flex gap-1 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm transition-colors relative flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'text-blue-600 bg-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 py-6">
            {activeTab === 'general' && (
              <div className="space-y-5">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label htmlFor="service-name-input" className="block text-sm text-slate-700 mb-1">Tên API/Dịch vụ <span className="text-red-500">*</span></label>
                    <input 
                      id="service-name-input"
                      type="text" 
                      value={serviceForm.serviceName}
                      onChange={e => setServiceForm({ ...serviceForm, serviceName: e.target.value })}
                      disabled={isView}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-600" 
                      placeholder="VD: API Tra cứu đăng ký kinh doanh" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="service-version" className="block text-sm text-slate-700 mb-1">Phiên bản <span className="text-red-500">*</span></label>
                    <select 
                      id="service-version"
                      title="Chọn phiên bản dịch vụ"
                      aria-label="Chọn phiên bản dịch vụ"
                      disabled={isView}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                    >
                      <option value="v1">v1.0 (Hiện tại)</option>
                      <option value="v2">v2.0 (Bản nháp Mới)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="service-code-input" className="block text-sm text-slate-700 mb-1">Mã dịch vụ / Context Path <span className="text-red-500">*</span></label>
                  <div className="flex bg-slate-50 border border-slate-300 rounded-lg overflow-hidden">
                    <span className="px-3 py-2 bg-slate-100 border-r border-slate-300 text-slate-500 text-sm whitespace-nowrap font-mono flex items-center">
                      /api/v1/
                    </span>
                    <input 
                      id="service-code-input"
                      type="text" 
                      value={serviceForm.serviceCode}
                      onChange={e => setServiceForm({ ...serviceForm, serviceCode: e.target.value })}
                      disabled={isView}
                      className="w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-blue-700 disabled:bg-slate-50" 
                      placeholder="tra-cuu-doanh-nghiep"
                      title="Mã dịch vụ / Context Path"
                      required 
                    />
                  </div>
                </div>



                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h4 id="recipient-info-header" className="text-sm font-medium text-slate-800 mb-3 block">Thông tin Đơn vị nhận chia sẻ</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="receiver-input" className="block text-sm text-slate-700 mb-1">Cơ quan / Đơn vị nhận <span className="text-red-500">*</span></label>
                      <input 
                        id="receiver-input" 
                        type="text" 
                        disabled={isView} 
                        defaultValue={data?.receiver || ''} 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50" 
                        placeholder="VD: Bộ Kế hoạch và Đầu tư" 
                        title="Cơ quan / Đơn vị nhận"
                        required 
                      />
                    </div>
                    <div>
                      <label htmlFor="target-system-input" className="block text-sm text-slate-700 mb-1">Hệ thống đích <span className="text-red-500">*</span></label>
                      <input 
                        id="target-system-input" 
                        type="text" 
                        disabled={isView} 
                        defaultValue={data?.targetSystem || ''} 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50" 
                        placeholder="VD: Hệ thống Thông tin Đầu tư quốc gia" 
                        title="Hệ thống đích"
                        required 
                      />
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="contact-person-input" className="block text-sm text-slate-700 mb-1">Thông tin đầu mối nhận (Contact Person)</label>
                      <input 
                        id="contact-person-input" 
                        type="text" 
                        disabled={isView} 
                        defaultValue={data?.contactPerson || ''} 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50" 
                        placeholder="Họ tên, SĐT, Email..." 
                        title="Thông tin đầu mối nhận"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label id="platform-scope-label" className="block text-sm text-slate-700 mb-2">Phạm vi nền tảng chia sẻ <span className="text-red-500">*</span></label>
                <div className="flex gap-4" role="radiogroup" aria-labelledby="platform-scope-label">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sharingPlatform"
                        id="platform-lgsp"
                        title="Trong ngành (LGSP)"
                        aria-label="Trong ngành (qua nền tảng chia sẻ LGSP)"
                        value="lgsp"
                        checked={sharingPlatform === 'lgsp'}
                        onChange={(e) => setSharingPlatform(e.target.value)}
                        disabled={isView}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-slate-700">Trong ngành (qua nền tảng chia sẻ LGSP)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sharingPlatform"
                        id="platform-ndxp"
                        title="Ngoài ngành (NDXP)"
                        aria-label="Ngoài ngành (qua nền tảng chia sẻ NDXP)"
                        value="ndxp"
                        checked={sharingPlatform === 'ndxp'}
                        onChange={(e) => setSharingPlatform(e.target.value)}
                        disabled={isView}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-slate-700">Ngoài ngành (qua nền tảng chia sẻ NDXP)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        id="platform-both"
                        title="Nền tảng TTDLQG"
                        aria-label="Nền tảng chia sẻ dữ liệu quốc gia (TTDLQG)"
                        type="radio"
                        name="sharingPlatform"
                        value="both"
                        checked={sharingPlatform === 'both'}
                        onChange={(e) => setSharingPlatform(e.target.value)}
                        disabled={isView}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-slate-700">Nền tảng TTDLQG</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">Phạm vi truy cập API <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-3 gap-3">
                    <label htmlFor="access-public" className={`border rounded-lg p-3 relative flex flex-col gap-1.5 transition-all ${
                      accessScope === 'public' ? 'border-green-500 bg-green-50/50 ring-1 ring-green-400' : 'border-slate-200 hover:border-slate-300 bg-white'
                    } ${isView ? 'cursor-default' : 'cursor-pointer'}`}>
                      <input id="access-public" type="radio" name="accessScope" value="public" checked={accessScope==='public'} onChange={e=>setAccessScope(e.target.value)} disabled={isView} className="absolute top-3 right-3 w-3.5 h-3.5" aria-label="Công khai (Public)" />
                      <Globe className="w-4 h-4 text-green-500" />
                      <span className="font-medium text-slate-900 text-xs">Công khai (Public)</span>
                      <span className="text-[11px] text-slate-500">Bất kỳ đơn vị nào cũng gọi được, không cần key.</span>
                    </label>
                    <label htmlFor="access-approval" className={`border rounded-lg p-3 relative flex flex-col gap-1.5 transition-all ${
                      accessScope === 'approval' ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-400' : 'border-slate-200 hover:border-slate-300 bg-white'
                    } ${isView ? 'cursor-default' : 'cursor-pointer'}`}>
                      <input id="access-approval" type="radio" name="accessScope" value="approval" checked={accessScope==='approval'} onChange={e=>setAccessScope(e.target.value)} disabled={isView} className="absolute top-3 right-3 w-3.5 h-3.5" aria-label="Yêu cầu phê duyệt" />
                      <Lock className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-slate-900 text-xs">Yêu cầu phê duyệt</span>
                      <span className="text-[11px] text-slate-500">Đơn vị phải gửi yêu cầu, trạng thái mặc định: Pending.</span>
                    </label>
                    <label htmlFor="access-restricted" className={`border rounded-lg p-3 relative flex flex-col gap-1.5 transition-all ${
                      accessScope === 'restricted' ? 'border-purple-500 bg-purple-50/50 ring-1 ring-purple-400' : 'border-slate-200 hover:border-slate-300 bg-white'
                    } ${isView ? 'cursor-default' : 'cursor-pointer'}`}>
                      <input id="access-restricted" type="radio" name="accessScope" value="restricted" checked={accessScope==='restricted'} onChange={e=>setAccessScope(e.target.value)} disabled={isView} className="absolute top-3 right-3 w-3.5 h-3.5" aria-label="Nội bộ / Giới hạn" />
                      <Share2 className="w-4 h-4 text-purple-500" />
                      <span className="font-medium text-slate-900 text-xs">Nội bộ / Giới hạn</span>
                      <span className="text-[11px] text-slate-500">Chỉ chia sẻ cho danh sách đơn vị đã cấu hình.</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-1">Chính sách chia sẻ (Quỹ đạo, Hạn chế) <span className="text-slate-400 font-normal">(Tùy chọn)</span></label>
                  <textarea
                    id="sharing-policy-textarea"
                    title="Chính sách chia sẻ"
                    aria-label="Chính sách chia sẻ (Quỹ đạo, Hạn chế)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-slate-50"
                    rows={2}
                    value={serviceForm.sharingPolicy}
                    onChange={e => setServiceForm({ ...serviceForm, sharingPolicy: e.target.value })}
                    disabled={isView}
                    placeholder="VD: Chỉ chia sẻ dữ liệu kết quả, không chia sẻ ảnh CCCD gốc. Giới hạn 10.000 request/ngày..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">Tài liệu đính kèm (Căn cứ pháp lý, tài liệu đặc tả)</label>
                  <div 
                    id="file-upload-zone"
                    tabIndex={0}
                    aria-label="Tải lên tài liệu đính kèm"
                    className="border border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <p className="text-sm font-medium text-slate-700 mb-1">Click để tải lên tài liệu</p>
                    <p className="text-xs text-slate-500">Định dạng hỗ trợ: PDF, DOCX (Tối đa 10MB)</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-6">

                {/* Khu vực 1: Nguồn dữ liệu & Nối bảng */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <Database className="w-4 h-4 text-blue-600" />
                      1. Cấu hình Nguồn Dữ liệu (Source Configuration)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="primary-table" className="block text-sm font-medium text-slate-700 mb-1">Bảng dữ liệu chính (Primary Table)</label>
                      <select
                        id="primary-table"
                        title="Chọn bảng dữ liệu chính"
                        aria-label="Chọn bảng dữ liệu chính"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                        value={selectedTable}
                        onChange={(e) => setSelectedTable(e.target.value)}
                        disabled={isView}
                      >
                        <option value="">-- Chọn danh mục chia sẻ --</option>
                        <option value="dkkd">Cơ sở dữ liệu Đăng ký kinh doanh</option>
                        <option value="congchung">Cơ sở dữ liệu Công chung</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-700 mb-1 opacity-0">Action</label>
                      <button 
                        type="button" 
                        onClick={() => setShowJoinModal(true)} 
                        disabled={isView}
                        className="px-4 py-2 text-sm text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg flex items-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <GitMerge className="w-4 h-4" />
                        Thêm bảng liên kết (Join...)
                      </button>
                    </div>
                  </div>

                  {/* Danh sách các bảng đã chọn */}
                  {(selectedTable || joinedTables.length > 0) && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <h4 className="text-sm font-medium text-slate-700 mb-3">Các bảng dữ liệu đang cấu hình:</h4>
                      <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                        <table className="w-full text-sm text-left bg-white">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                            <tr>
                              <th className="px-4 py-3 font-medium w-[30%]">Bảng dữ liệu</th>
                              <th className="px-4 py-3 font-medium w-[15%]">Loại Join</th>
                              <th className="px-4 py-3 font-medium w-[22%]">Khóa gốc (Bảng chính)</th>
                              <th className="px-4 py-3 font-medium w-[23%]">Khóa ngoại (Bảng liên kết)</th>
                              <th className="px-4 py-3 font-medium w-[10%] text-center">Xóa</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {selectedTable && (
                              <tr className="hover:bg-slate-50 transition-colors group">
                                <td className="px-4 py-3 font-medium text-slate-800 border-r border-slate-100 bg-blue-50/30">
                                  <div className="flex items-center gap-2 text-blue-700 font-semibold">
                                    <Database className="w-4 h-4" />
                                    {selectedTable === 'dkkd' ? 'CSDL Đăng ký kinh doanh' : selectedTable === 'congchung' ? 'CSDL Công chứng' : selectedTable}
                                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded leading-none">BẢNG CHÍNH</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-slate-400 text-center border-r border-slate-100">-</td>
                                <td className="px-4 py-3 text-slate-400 text-center border-r border-slate-100">-</td>
                                <td className="px-4 py-3 text-slate-400 text-center border-r border-slate-100">-</td>
                                <td className="px-4 py-3 text-center text-slate-300">-</td>
                              </tr>
                            )}
                            {joinedTables.map((jt) => (
                              <tr key={jt.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-4 py-2 font-medium text-slate-800 border-r border-slate-100">
                                  <div className="flex items-center gap-2 text-slate-700 pl-4 relative">
                                    <div className="absolute left-0 top-1/2 w-3 border-t border-l border-slate-300 h-8 -translate-y-full rounded-tl" />
                                    <GitMerge className="w-4 h-4 text-indigo-500" />
                                    {jt.name}
                                  </div>
                                </td>
                                <td className="px-4 py-2 border-r border-slate-100">
                                  <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">{jt.joinType}</span>
                                </td>
                                <td className="px-4 py-2 border-r border-slate-100 font-mono text-xs text-blue-600">{jt.primaryKey}</td>
                                <td className="px-4 py-2 border-r border-slate-100 font-mono text-xs text-emerald-600">{jt.foreignKey}</td>
                                <td className="px-4 py-2 text-center">
                                  <button type="button" disabled={isView} aria-label="Xóa bảng liên kết" title="Xóa bảng liên kết" onClick={() => setJoinedTables(joinedTables.filter(t => t.id !== jt.id))} className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                                    <X className="w-4 h-4 mx-auto" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Khu vực 2: Data Mapping Table (Redesigned cho dễ dùng: Chọn & Đổi tên) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-emerald-600" />
                      2. Lựa chọn & Ánh xạ trường dữ liệu (Field Mapping)
                    </h3>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                    {/* Toolbar bảng ánh xạ */}
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer hover:text-blue-600 transition-colors">
                        <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" defaultChecked />
                        Chọn / Bỏ chọn tất cả (Đã chọn 3/15)
                      </label>
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input id="field-search-input" type="text" placeholder="Tìm kiếm trường..." title="Tìm kiếm trường dữ liệu" className="pl-9 pr-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64" />
                      </div>
                    </div>

                    {/* Tiêu đề cột */}
                    <div className="flex items-center px-4 py-2 bg-white border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <div className="w-[35%]">Trường CSDL (Source Field)</div>
                      <div className="w-[35%] px-2">Key hiển thị trên JSON (Alias)</div>
                      <div className="w-[30%] px-2">Điều kiện Lọc (Tùy chọn)</div>
                    </div>

                    <div className="max-h-[350px] overflow-y-auto">
                      {/* Nhóm Bảng chính */}
                      {selectedTable && (
                        <div>
                          <div className="bg-blue-50/80 px-4 py-2 border-b border-slate-100 flex items-center gap-2 text-sm font-semibold text-slate-800 sticky top-0 z-10 backdrop-blur-sm">
                            <Database className="w-4 h-4 text-blue-600" /> CSDL Đăng ký kinh doanh <span className="text-[10px] font-bold text-blue-600 bg-white px-1.5 py-0.5 rounded ml-2 shadow-sm uppercase">Bảng chính</span>
                          </div>
                          <div className="divide-y divide-slate-50">
                            {/* Row 1 */}
                            <label className="flex items-center px-4 py-2 hover:bg-slate-50 transition-colors cursor-pointer group">
                              <div className="w-[35%] flex items-center gap-3">
                                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" defaultChecked />
                                <div>
                                  <span className="text-sm font-medium text-slate-800 block">ma_dn</span>
                                  <span className="text-xs text-slate-400 font-normal">Mã doanh nghiệp</span>
                                </div>
                              </div>
                              <div className="w-[35%] px-2" onClick={e => e.preventDefault()}>
                                <input type="text" disabled={isView} title="Key hiển thị trên JSON (Alias)" aria-label="Key hiển thị trên JSON (Alias) cho ma_dn" className="w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-blue-700 font-mono shadow-sm disabled:bg-slate-50" placeholder="Mặc định: ma_dn" defaultValue="company_code" />
                              </div>
                              <div className="w-[30%] px-2" onClick={e => e.preventDefault()}>
                                <input type="text" disabled={isView} title="Điều kiện Lọc (Tùy chọn)" aria-label="Điều kiện Lọc (Tùy chọn) cho ma_dn" className="w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none placeholder:text-slate-300 disabled:bg-slate-50" placeholder="VD: IS NOT NULL" defaultValue="IS NOT NULL" />
                              </div>
                            </label>
                            {/* Row 2 */}
                            <label className={`flex items-center px-4 py-2 hover:bg-slate-50 transition-colors group ${isView ? 'cursor-default' : 'cursor-pointer'}`}>
                              <div className="w-[35%] flex items-center gap-3">
                                <input type="checkbox" disabled={isView} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" defaultChecked />
                                <div>
                                  <span className="text-sm font-medium text-slate-800 block">ten_dn</span>
                                  <span className="text-xs text-slate-400 font-normal">Tên doanh nghiệp</span>
                                </div>
                              </div>
                              <div className="w-[35%] px-2" onClick={e => e.preventDefault()}>
                                <input type="text" disabled={isView} title="Key hiển thị trên JSON (Alias)" aria-label="Key hiển thị trên JSON (Alias) cho ten_dn" className="w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-blue-700 font-mono shadow-sm disabled:bg-slate-50" placeholder="Mặc định: ten_dn" defaultValue="company_name" />
                              </div>
                              <div className="w-[30%] px-2" onClick={e => e.preventDefault()}>
                                <input type="text" disabled={isView} title="Điều kiện Lọc (Tùy chọn)" aria-label="Điều kiện Lọc (Tùy chọn) cho ten_dn" className="w-full px-3 py-1.5 text-sm bg-transparent border border-transparent hover:bg-white hover:border-slate-200 rounded-md focus:border-blue-500 outline-none placeholder:text-slate-300 transition-colors disabled:bg-slate-50" placeholder="+ Thêm bộ lọc" />
                              </div>
                            </label>
                            {/* Row 3 - Unchecked */}
                            <label className="flex items-center px-4 py-2 hover:bg-slate-50 transition-colors cursor-pointer group opacity-60 hover:opacity-100">
                              <div className="w-[35%] flex items-center gap-3">
                                <input type="checkbox" className="w-4 h-4 text-slate-400 rounded border-slate-300 focus:ring-blue-500" />
                                <div>
                                  <span className="text-sm font-medium text-slate-700 block">ngay_thanh_lap</span>
                                  <span className="text-xs text-slate-400 font-normal">Ngày thành lập</span>
                                </div>
                              </div>
                              <div className="w-[35%] px-2" onClick={e => e.preventDefault()}>
                                <input type="text" disabled title="Key hiển thị trên JSON (Alias)" aria-label="Key hiển thị trên JSON (Alias) cho ngay_thanh_lap" className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-transparent rounded-md text-slate-400 cursor-not-allowed" placeholder="Mặc định: ngay_thanh_lap" />
                              </div>
                              <div className="w-[30%] px-2" onClick={e => e.preventDefault()}>
                                <input type="text" disabled title="Điều kiện Lọc (Tùy chọn)" aria-label="Điều kiện Lọc (Tùy chọn) cho ngay_thanh_lap" className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-transparent rounded-md text-slate-400 cursor-not-allowed" placeholder="Không áp dụng" />
                              </div>
                            </label>
                          </div>
                        </div>
                      )}

                      {/* Nhóm Bảng liên kết */}
                      {joinedTables.map(jt => (
                        <div key={jt.id}>
                          <div className="bg-indigo-50/80 px-4 py-2 border-y border-slate-200 flex items-center gap-2 text-sm font-semibold text-slate-800 sticky top-0 z-10 backdrop-blur-sm mt-2">
                            <GitMerge className="w-4 h-4 text-indigo-600" /> {jt.name} <span className="text-[10px] font-bold text-indigo-600 bg-white px-1.5 py-0.5 rounded ml-2 shadow-sm uppercase">Bảng nối</span>
                          </div>
                          <div className="divide-y divide-slate-50">
                            {jt.id === '1' ? (
                              <>
                                {/* Fields for Bảng 1: b_nganh_nghe */}
                                <label className="flex items-center px-4 py-2 hover:bg-slate-50 transition-colors cursor-pointer group">
                                  <div className="w-[35%] flex items-center gap-3">
                                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" defaultChecked />
                                    <div>
                                      <span className="text-sm font-medium text-slate-800 block">ten_nganh</span>
                                      <span className="text-xs text-slate-400 font-normal">Tên diễn giải ngành nghề</span>
                                    </div>
                                  </div>
                                  <div className="w-[35%] px-2" onClick={e => e.preventDefault()}>
                                    <input type="text" title="Key hiển thị trên JSON (Alias)" aria-label="Key hiển thị trên JSON (Alias) cho ten_nganh" className="w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-blue-700 font-mono shadow-sm" placeholder="Mặc định: ten_nganh" defaultValue="business_sector" />
                                  </div>
                                  <div className="w-[30%] px-2" onClick={e => e.preventDefault()}>
                                    <input type="text" title="Điều kiện Lọc (Tùy chọn)" aria-label="Điều kiện Lọc (Tùy chọn) cho ten_nganh" className="w-full px-3 py-1.5 text-sm bg-transparent border border-transparent hover:bg-white hover:border-slate-200 rounded-md focus:border-blue-500 outline-none placeholder:text-slate-300 transition-colors" placeholder="+ Thêm bộ lọc" />
                                  </div>
                                </label>
                                <label className="flex items-center px-4 py-2 hover:bg-slate-50 transition-colors cursor-pointer group opacity-60 hover:opacity-100">
                                  <div className="w-[35%] flex items-center gap-3">
                                    <input type="checkbox" className="w-4 h-4 text-slate-400 rounded border-slate-300 focus:ring-blue-500" />
                                    <div>
                                      <span className="text-sm font-medium text-slate-700 block">ma_nganh_cap_1</span>
                                      <span className="text-xs text-slate-400 font-normal">Mã ngành cấp 1</span>
                                    </div>
                                  </div>
                                  <div className="w-[35%] px-2" onClick={e => e.preventDefault()}>
                                    <input type="text" disabled title="Key hiển thị trên JSON (Alias)" aria-label="Key hiển thị trên JSON (Alias) cho ma_nganh_cap_1" className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-transparent rounded-md text-slate-400 cursor-not-allowed" placeholder="Mặc định: ma_nganh_cap_1" />
                                  </div>
                                  <div className="w-[30%] px-2" onClick={e => e.preventDefault()}>
                                    <input type="text" disabled title="Điều kiện Lọc (Tùy chọn)" aria-label="Điều kiện Lọc (Tùy chọn) cho ma_nganh_cap_1" className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-transparent rounded-md text-slate-400 cursor-not-allowed" placeholder="Không áp dụng" />
                                  </div>
                                </label>
                              </>
                            ) : (
                              <>
                                {/* Fields for Bảng 2: b_nop_thue */}
                                <label className="flex items-center px-4 py-2 hover:bg-slate-50 transition-colors cursor-pointer group">
                                  <div className="w-[35%] flex items-center gap-3">
                                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" defaultChecked />
                                    <div>
                                      <span className="text-sm font-medium text-slate-800 block">so_tien_nop</span>
                                      <span className="text-xs text-slate-400 font-normal">Số tiền thuế đã nộp</span>
                                    </div>
                                  </div>
                                  <div className="w-[35%] px-2" onClick={e => e.preventDefault()}>
                                    <input type="text" title="Key hiển thị trên JSON (Alias)" aria-label="Key hiển thị trên JSON (Alias) cho so_tien_nop" className="w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-blue-700 font-mono shadow-sm" placeholder="Mặc định: so_tien_nop" defaultValue="tax_paid_amount" />
                                  </div>
                                  <div className="w-[30%] px-2" onClick={e => e.preventDefault()}>
                                    <input type="text" title="Điều kiện Lọc (Tùy chọn)" aria-label="Điều kiện Lọc (Tùy chọn) cho so_tien_nop" className="w-full px-3 py-1.5 text-sm bg-transparent border border-transparent hover:bg-white hover:border-slate-200 rounded-md focus:border-blue-500 outline-none placeholder:text-slate-300 transition-colors" placeholder="+ Thêm bộ lọc" />
                                  </div>
                                </label>
                                <label className="flex items-center px-4 py-2 hover:bg-slate-50 transition-colors cursor-pointer group opacity-60 hover:opacity-100">
                                  <div className="w-[35%] flex items-center gap-3">
                                    <input type="checkbox" className="w-4 h-4 text-slate-400 rounded border-slate-300 focus:ring-blue-500" />
                                    <div>
                                      <span className="text-sm font-medium text-slate-700 block">ngay_nop_thue</span>
                                      <span className="text-xs text-slate-400 font-normal">Ngày biên lai</span>
                                    </div>
                                  </div>
                                  <div className="w-[35%] px-2" onClick={e => e.preventDefault()}>
                                    <input type="text" disabled title="Key hiển thị trên JSON (Alias)" aria-label="Key hiển thị trên JSON (Alias) cho ngay_nop_thue" className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-transparent rounded-md text-slate-400 cursor-not-allowed" placeholder="Mặc định: ngay_nop_thue" />
                                  </div>
                                  <div className="w-[30%] px-2" onClick={e => e.preventDefault()}>
                                    <input type="text" disabled title="Điều kiện Lọc (Tùy chọn)" aria-label="Điều kiện Lọc (Tùy chọn) cho ngay_nop_thue" className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-transparent rounded-md text-slate-400 cursor-not-allowed" placeholder="Không áp dụng" />
                                  </div>
                                </label>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Khu vực 3: Run Test API (Light theme) */}
                <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-4 shadow-sm relative overflow-hidden mt-6">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 blur-3xl rounded-full" />
                  <div className="flex items-center justify-between relative z-10">
                    <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-emerald-600" />
                      3. Xem trước cấu trúc Dữ liệu (Mock / Run Test)
                    </h3>
                    <button
                      type="button"
                      onClick={handleTestAPI}
                      disabled={isTesting}
                      className="px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                      {isTesting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 fill-current" />
                      )}
                      {isTesting ? 'Đang gọi Test...' : 'Chạy thử API (Test Run)'}
                    </button>
                  </div>

                  <div className="relative z-10 border border-slate-200 rounded-lg bg-slate-50 shadow-inner overflow-hidden">
                    {testResult ? (
                      <pre className="p-5 text-[13px] leading-relaxed font-mono text-slate-800 overflow-auto max-h-[300px]">
                        {testResult}
                      </pre>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <Code2 className="w-10 h-10 mb-3 opacity-30" />
                        <p className="text-sm text-slate-500">Bấm "Chạy thử API" để xem kết quả ánh xạ dữ liệu trực tiếp dưới dạng JSON.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'connection' && (
              <div className="space-y-6">
                <ConnectionConfigSection resetTestState={() => {}} />

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mt-6">
                   <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                     <Shield className="w-4 h-4 text-blue-600" />
                     Cấu hình Hạn mức (Quota / Rate Limiting)
                   </h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label htmlFor="quota-input" className="block text-sm font-medium text-slate-700 mb-1">Số Request tối đa / Ngày (Quota)</label>
                       <div className="relative">
                         <input id="quota-input" type="number" disabled={isView} className="w-full pl-3 pr-16 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50" placeholder="VD: 10000" defaultValue="10000" />
                         <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                           <span className="text-slate-400 text-sm">req/day</span>
                         </div>
                       </div>
                       <p className="text-xs text-slate-500 mt-1">Để trống nếu không giới hạn.</p>
                     </div>
                     <div>
                       <label htmlFor="quota-action-select" className="block text-sm font-medium text-slate-700 mb-1">Hành động khi vượt hạn mức</label>
                       <select id="quota-action-select" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                         <option value="block">Từ chối kết nối (Block - Lỗi 429)</option>
                         <option value="warn">Cho phép gọi & Cảnh báo hệ thống (Warn)</option>
                       </select>
                     </div>
                   </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-800">Kiểm tra kết nối API Destination</h4>
                      <p className="text-xs text-slate-500">Mô phỏng gọi tới Base URL để verify kết nối</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={isTestingConnection}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                      {isTestingConnection ? (
                        <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-700 rounded-full animate-spin" />
                      ) : (
                        <Globe className="w-4 h-4" />
                      )}
                      Kiểm tra ngay
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-medium text-slate-800 mb-4 pb-2 border-b border-slate-200">Cấu hình chia sẻ dữ liệu</h3>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="sharing-method" className="block text-sm text-slate-700 mb-1">Phương thức chia sẻ <span className="text-red-500">*</span></label>
                      <select id="sharing-method" title="Chọn phương thức chia sẻ" aria-label="Chọn phương thức chia sẻ" disabled={isView} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50">
                        <option value="">Chọn phương thức</option>
                        <option value="api-push">Đẩy dữ liệu chủ động (Push API)</option>
                        <option value="db-sync">Đồng bộ Database định kỳ</option>
                        <option value="file-batch">Gửi File Batch (CSV/XML)</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="sharing-frequency" className="block text-sm text-slate-700 mb-1">Tần suất chia sẻ</label>
                      <select id="sharing-frequency" title="Chọn tần suất chia sẻ" aria-label="Chọn tần suất chia sẻ" disabled={isView} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50">
                        <option value="">Chọn tần suất</option>
                        <option value="realtime">Tức thời (Real-time)</option>
                        <option value="hourly">Mỗi giờ (Hourly)</option>
                        <option value="daily">Hàng ngày (Daily - 00:00)</option>
                        <option value="weekly">Hàng tuần (Weekly)</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      <strong className="font-semibold">Lưu ý:</strong> Lịch chia sẻ sẽ tự động chạy theo cấu hình. Hệ thống sẽ gửi thông báo khi có lỗi xảy ra trong quá trình chia sẻ dữ liệu đến Hệ thống đích.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'policy' && (
              <div className="space-y-6">

                {/* Yêu cầu phê duyệt */}
                <div className="border border-blue-200 bg-blue-50/40 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">Yêu cầu phê duyệt kích hoạt API</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Sau khi lưu cấu hình, hệ thống sẽ gửi yêu cầu phê duyệt tới người được chỉ định bên dưới.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label htmlFor="approver-select" className="block text-sm font-medium text-slate-700 mb-1">Người phê duyệt <span className="text-red-500">*</span></label>
                        <select id="approver-select" title="Chọn người phê duyệt" aria-label="Chọn người phê duyệt" disabled={isView} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50">
                          <option value="">-- Chọn người phê duyệt --</option>
                          <option value="gd">Nguyễn Văn A (Giám đốc)</option>
                          <option value="pgd">Trần Thị B (Phó giám đốc)</option>
                          <option value="tp">Lê Văn C (Trưởng phòng CNTT)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="approval-note" className="block text-sm font-medium text-slate-700 mb-1">Ghi chú trình duyệt</label>
                      <textarea
                        id="approval-note"
                        disabled={isView}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder:text-slate-400 disabled:bg-slate-50"
                        placeholder="Mô tả mục đích, lý do cần kích hoạt API này để người phê duyệt nắm rõ..."
                      />
                    </div>
                  </div>

                  <div className={`flex justify-end pt-3 border-t border-blue-100 mt-4 ${isView ? 'hidden' : ''}`}>
                    <button
 type="button"
 onClick={() => setShowSendConfirm(true)}
 className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm rounded-lg shadow-sm transition-colors"
 >
 <Upload className="w-4 h-4" />
 Gửi trình duyệt
 </button>
                  </div>
                </div>

                {/* Lịch sử phê duyệt (Mock) */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-slate-400" /> Lịch sử phê duyệt
                  </h4>
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-2">Thời gian</th>
                          <th className="px-4 py-2">Người gửi</th>
                          <th className="px-4 py-2">Người phê duyệt</th>
                          <th className="px-4 py-2">Kết quả</th>
                          <th className="px-4 py-2">Ghi chú</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        <tr className="hover:bg-slate-50">
                          <td className="px-4 py-2 text-slate-500 whitespace-nowrap">10/04/2025 09:15</td>
                          <td className="px-4 py-2">Phạm Minh D</td>
                          <td className="px-4 py-2">Nguyễn Văn A</td>
                          <td className="px-4 py-2"><span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Chờ duyệt</span></td>
                          <td className="px-4 py-2 text-slate-400 text-xs">Yêu cầu cấp quyền chia sẻ DKKD cho Bộ KH&ĐT</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="px-4 py-3 text-xs text-slate-400 bg-slate-50 border-t border-slate-100 text-center">Hiển thị 1 bản ghi</div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 sticky bottom-0 z-20">
            {!isView && (
              <button
                type="button"
                onClick={() => { setDraftStatus('draft'); }}
                className="px-4 py-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 flex items-center gap-1.5 font-medium transition-colors"
                title="Lưu bản nháp"
              >
                <Save className="w-4 h-4" /> {isEdit ? 'Lưu thay đổi' : 'Lưu nháp'}
              </button>
            )}
            
            <div className={`flex items-center gap-3 ${isView ? 'w-full justify-end' : ''}`}>
              <button type="button" onClick={onClose} className="px-5 py-2 text-sm text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
                {isView && !isApprovalReview ? 'Đóng' : 'Huỷ'}
              </button>

              {isApprovalReview && (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => { setApprovalDecision('request-info'); setShowApprovalConfirm(true); }}
                    className="px-5 py-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 font-medium flex items-center gap-2 shadow-sm transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" /> Yêu cầu bổ sung
                  </button>
                  <button
                    type="button"
                    onClick={() => { setApprovalDecision('reject'); setShowApprovalConfirm(true); }}
                    className="px-5 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 font-medium flex items-center gap-2 shadow-sm transition-all active:scale-95"
                  >
                    <XCircle className="w-4 h-4" /> Từ chối
                  </button>
                  <button
                    type="button"
                    onClick={() => { setApprovalDecision('approve'); setShowApprovalConfirm(true); }}
                    className="px-5 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 font-medium flex items-center gap-2 shadow-md shadow-green-100 transition-all active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Phê duyệt
                  </button>
                </div>
              )}

              {!isView && (
                <button type="submit" className="px-5 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium">
                  {isEdit ? 'Cập nhật cấu hình' : 'Lưu cấu hình'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Modal: Xác nhận Phê duyệt / Từ chối */}
      {showApprovalConfirm && (
        <div className="fixed inset-0 bg-black/40 z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                approvalDecision === 'approve' ? 'bg-green-100 text-green-600' : 
                approvalDecision === 'reject' ? 'bg-red-100 text-red-600' : 
                'bg-amber-100 text-amber-600'
              }`}>
                {approvalDecision === 'approve' ? <CheckCircle2 className="w-6 h-6" /> : 
                 approvalDecision === 'reject' ? <XCircle className="w-6 h-6" /> : 
                 <Plus className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {approvalDecision === 'approve' ? 'Xác nhận Phê duyệt' : 
                   approvalDecision === 'reject' ? 'Xác nhận Từ chối' : 
                   'Xác nhận Yêu cầu bổ sung'}
                </h3>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl mb-6 border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                   <MessageSquare className="w-4 h-4 text-blue-600" />
                   Nội dung xử lý & Phản hồi <span className="text-red-500">*</span>
                </h4>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Thông tin bắt buộc</span>
              </div>
              <textarea
                id="modal-approval-note"
                rows={4}
                value={approvalNote}
                onChange={e => setApprovalNote(e.target.value)}
                placeholder={`Nhập nhận xét hoặc lý do ${
                  approvalDecision === 'approve' ? 'phê duyệt' : 
                  approvalDecision === 'reject' ? 'từ chối' : 
                  'yêu cầu bổ sung'
                }...`}
                title={`Nhập nội dung ${
                  approvalDecision === 'approve' ? 'phê duyệt' : 
                  approvalDecision === 'reject' ? 'từ chối' : 
                  'yêu cầu bổ sung'
                }`}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm placeholder:text-slate-400 transition-all"
                autoFocus
              />
              <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1 border-t border-slate-200/60">
                 <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Phê duyệt: Chấp nhận</span>
                 </div>
                 <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span>Từ chối: Không chấp nhận</span>
                 </div>
                 <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span>Bổ sung: Cần cập nhật</span>
                 </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button 
 type="button" 
 onClick={() => { setShowApprovalConfirm(false); setApprovalDecision(null); }} 
 className="px-5 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
 >
 Quay lại
 </button>
                <button 
 type="button" 
 disabled={!approvalNote.trim()}
 onClick={() => {
 alert(`Thực hiện thành công: ${
 approvalDecision === 'approve' ? 'Phê duyệt' : 
 approvalDecision === 'reject' ? 'Từ chối' : 
 'Yêu cầu bổ sung thông tin'
 }`);
 setShowApprovalConfirm(false);
 onClose();
 }}
 className={`px-6 py-2.5 text-sm text-white rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-50 ${
 approvalDecision === 'approve' ? 'bg-green-600 hover:bg-green-700 shadow-green-100' : 
 approvalDecision === 'reject' ? 'bg-red-600 hover:bg-red-700 shadow-red-100' : 
 'bg-amber-600 hover:bg-amber-700 shadow-amber-100'
 }`}
 >
 Xác nhận {
 approvalDecision === 'approve' ? 'Phê duyệt' : 
 approvalDecision === 'reject' ? 'Từ chối' : 
 'Gửi yêu cầu'
 }
 </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog: Gửi trình duyệt */}
      {showSendConfirm && (
        <div className="fixed inset-0 bg-black/40 z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <Upload className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Xác nhận gửi yêu cầu</h3>
                <p className="text-xs text-slate-500 mt-0.5">Gửi đến: Nguyễn Văn A (Giám đốc)</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-5">Dịch vụ sẽ chuyển sang trạng thái <strong className="text-blue-600">"Đang chờ phê duyệt"</strong> sau khi gửi. Bạn không thể chỉnh sửa cho đến khi có phản hồi.</p>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowSendConfirm(false)} className="px-4 py-2 text-sm text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Huỷ</button>
              <button type="button" onClick={() => { setShowSendConfirm(false); setShowSentBanner(true); setDraftStatus('pending'); }} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium">✓ Xác nhận gửi</button>
            </div>
          </div>
        </div>
      )}

      {/* Success Banner: Đã gửi thành công */}
      {showSentBanner && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[70] w-full max-w-md">
          <div className="bg-white border border-green-200 shadow-lg rounded-xl px-5 py-4 flex items-start gap-3 animate-in slide-in-from-top duration-300">
            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-slate-800 text-sm">Đã gửi yêu cầu phê duyệt thành công!</p>
              <p className="text-xs text-slate-500 mt-0.5">Trạng thái: <span className="text-blue-600 font-medium">Chờ phê duyệt</span> → Người phê duyệt: Nguyễn Văn A</p>
            </div>
            <button type="button" onClick={() => setShowSentBanner(false)} aria-label="Đóng thông báo" title="Đóng thông báo" className="text-slate-400 hover:text-slate-600 ml-2"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* Modal Join Bảng */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <GitMerge className="w-4 h-4 text-blue-600" />
                Cấu hình Bảng liên kết (Join Table)
              </h3>
              <button type="button" onClick={() => setShowJoinModal(false)} aria-label="Đóng cửa sổ" title="Đóng cửa sổ" className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bảng gốc</label>
                <input type="text" readOnly value="dkkd (Cơ sở dữ liệu Đăng ký kinh doanh)" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500" />
              </div>
              <div className="flex items-center justify-center">
                <div className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full flex items-center gap-1 border border-blue-100">
                  <GitMerge className="w-3.5 h-3.5" /> INNER JOIN
                </div>
              </div>
              <div>
                <label htmlFor="target-table-select" className="block text-sm font-medium text-slate-700 mb-1">Bảng liên kết đến <span className="text-red-500">*</span></label>
                <select id="target-table-select" title="Chọn bảng liên kết đến" aria-label="Chọn bảng liên kết đến" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Chọn bảng liên kết...</option>
                  <option value="nganh_nghe">b_nganh_nghe (Ngành nghề kinh doanh)</option>
                  <option value="thue">b_nop_thue (Lịch sử nộp thuế)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label htmlFor="origin-key-select" className="block text-sm font-medium text-slate-700 mb-1">Khoá ngoại (Bảng gốc)</label>
                  <select id="origin-key-select" title="Chọn khoá ngoại bảng gốc" aria-label="Chọn khoá ngoại bảng gốc" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white">
                    <option value="ma_nganh">ma_nganh</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="target-key-select" className="block text-sm font-medium text-slate-700 mb-1">Khóa chính (Bảng liên kết)</label>
                  <select id="target-key-select" title="Chọn khóa chính bảng liên kết" aria-label="Chọn khóa chính bảng liên kết" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white">
                    <option value="id_nganh">id_nganh</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
              <button type="button" onClick={() => setShowJoinModal(false)} className="px-4 py-2 text-sm text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Hủy</button>
              <button type="button" onClick={() => setShowJoinModal(false)} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium">Thêm liên kết</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Result Test Connection */}
      {showConnectionResult === 'error' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-red-100">
            <div className="bg-red-50 p-6 flex flex-col items-center text-center border-b border-red-100">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-red-900 mb-1">Kết nối thất bại</h3>
              <p className="text-sm text-red-700">Không thể kết nối đến Hệ thống đích (Destination API).</p>
            </div>
            <div className="p-6 bg-white space-y-4">
              <div>
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Lỗi trả về từ hệ thống</span>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-sm font-mono text-red-600 overflow-x-auto">
                  Error 401 Unauthorized: Invalid API Key.
                </div>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Hướng khắc phục</span>
                <ul className="text-sm text-slate-700 list-disc pl-5 space-y-1">
                  <li>Kiểm tra lại giá trị <b>API Key</b> trong phần cấu hình bảo mật xem có bị sai lệch hoặc nhập dư khoảng trắng không.</li>
                  <li>Xác nhận với Đơn vị nhận (nhà phát triển hệ thống đích) xem API Key đã hết hạn hoặc bị thu hồi hay chưa.</li>
                  <li>Nếu API yêu cầu whitelist IP, hãy đảm bảo IP của hệ thống LGSP này đã được allow.</li>
                </ul>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button type="button" onClick={() => setShowConnectionResult(null)} className="px-5 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors">
                Đã hiểu & Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
