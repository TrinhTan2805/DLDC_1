import { useState, type FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, AlertCircle, CheckCircle, Upload, Eye, EyeOff, 
  Database, FileText, User, Plug, Settings, Plus,
  Calendar, Clock, FileX, AlertTriangle, Check, LayoutTemplate
} from 'lucide-react';
import { DataCollectionConfigSection } from './DataCollectionConfigSection';
import { ConnectionConfigSection } from './ConnectionConfigSection';
import { DataDetailModal } from '../../DataDetailModal';
import { ConfirmModal } from '../../common/ConfirmModal';
import { BaseModal } from '../../common/BaseModal';
import { StructureLoadingConfig } from './StructureLoadingConfig';
import { initialSourceSystems } from './mockSourceSystems';
import { StatusTag } from '../../common/StatusTag';

const ConnectionSuccessModal = ({ isOpen, onClose, onContinue }: { isOpen: boolean, onClose: () => void, onContinue: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[450px] overflow-hidden flex flex-col relative">
        <button onClick={onClose} aria-label="Đóng" className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors z-10"><X className="w-4 h-4"/></button>
        <div className="p-6 pb-4 flex flex-col items-center">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-3">
            <CheckCircle className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Kết nối thành công</h3>
          <p className="text-slate-500 text-base mb-4 text-center px-4 leading-relaxed">Kết nối thành công, vui lòng thực hiện Nạp cấu trúc.</p>
        </div>
        <div className="px-5 py-3 flex justify-center gap-3 bg-slate-50 border-t border-slate-100">
          <button onClick={onClose} className="px-6 py-2 bg-white border border-[#e2e8f0] text-[#020817] text-base rounded-[6px] transition-colors shadow-sm hover:bg-slate-50 font-medium">Đóng</button>
          <button onClick={onContinue} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-base rounded-lg transition-colors shadow-sm font-medium">Tiếp tục</button>
        </div>
      </div>
    </div>
  );
};

const ConnectionErrorModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[450px] overflow-hidden flex flex-col relative">
        <button onClick={onClose} aria-label="Đóng" className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors z-10"><X className="w-4 h-4"/></button>
        <div className="p-6 pb-4 flex flex-col items-center">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-3">
            <AlertCircle className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Kết nối thất bại</h3>
          <p className="text-slate-500 text-base mb-4 text-center px-4 leading-relaxed">Không thể kết nối đến Hệ thống đích (Destination API).</p>
          
          <div className="w-full text-left px-5">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-tight mb-1.5">Lỗi trả về</p>
            <div className="bg-red-50/50 text-red-600 px-3 py-2 rounded-lg text-[11px] mb-4 font-medium border border-red-100">
              Error 401 Unauthorized: Invalid API Key.
            </div>

            <p className="text-sm font-bold text-slate-800 mb-1.5 uppercase tracking-tight">Hướng dẫn khắc phục</p>
            <ul className="text-[11px] text-slate-600 space-y-1.5 mb-2 ml-4 list-disc marker:text-slate-400">
              <li>Kiểm tra lại giá trị <strong>API Key</strong> (tránh dư khoảng trắng).</li>
              <li>Xác nhận API Key còn hạn hoặc chưa bị thu hồi.</li>
              <li>Đảm bảo IP hệ thống đã được cấp phép (whitelist).</li>
            </ul>
          </div>
        </div>
        <div className="px-5 py-3 flex justify-center bg-slate-50 border-t border-slate-100">
          <button onClick={onClose} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-base rounded-lg transition-colors shadow-sm font-medium">Đã hiểu & Đóng</button>
        </div>
      </div>
    </div>
  );
};

const DataErrorModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[450px] overflow-hidden flex flex-col relative">
        <button onClick={onClose} aria-label="Đóng" className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors z-10"><X className="w-4 h-4"/></button>
        <div className="p-6 pb-4 flex flex-col items-center">
          <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-3">
            <FileX className="w-6 h-6" strokeWidth={2} />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Không có dữ liệu</h3>
          <p className="text-slate-500 text-[12px] mb-4 text-center px-4 leading-relaxed">Kết nối thành công, nhưng không nhận được dữ liệu trả về.</p>
          
          <div className="w-full text-left px-5">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-tight mb-1.5">Trạng thái kết nối</p>
            <div className="bg-green-50/30 text-green-700 px-3 py-1.5 rounded-lg text-[11px] mb-4 flex items-center gap-1.5 border border-green-100">
              <Check className="w-3 h-3"/> HTTP 200 OK (Thành công)
            </div>

            <p className="text-sm font-bold text-slate-800 mb-1.5 uppercase tracking-tight">Hướng dẫn khắc phục</p>
            <ul className="text-[11px] text-slate-600 space-y-1.5 mb-2 ml-4 list-disc marker:text-slate-400">
              <li>Kiểm tra lại format của <strong>Request Sample</strong>.</li>
              <li>Xác nhận thời điểm yêu cầu có dữ liệu trên nguồn.</li>
              <li>Đảm bảo các tham số (Params) được truyền đúng.</li>
            </ul>
          </div>
        </div>
        <div className="px-5 py-3 flex justify-center bg-slate-50 border-t border-slate-100">
          <button onClick={onClose} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-base rounded-lg transition-colors shadow-sm font-medium">Đã hiểu & Đóng</button>
        </div>
      </div>
    </div>
  );
};

const DataMappingModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-50 rounded-xl shadow-2xl w-full max-w-[1000px] h-full max-h-[90vh] overflow-hidden flex flex-col relative border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center z-10 shrink-0">
          <h2 className="text-base font-bold text-slate-800 uppercase tracking-tight">Cấu hình ánh xạ dữ liệu đích (Data Mapping)</h2>
          <button onClick={onClose} aria-label="Đóng" className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5"/></button>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden bg-[#fafafa]">
           <AdvancedDataMapping onClose={onClose} />
        </div>
      </div>
    </div>
  );
};
interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: any;
  onViewData?: (pageId?: string) => void;
  initialTab?: any;
}

type TabType = 'general' | 'contact' | 'connection' | 'mapping' | 'collection';

// Modal Thêm mới phương thức
export function AddServiceModal({ isOpen, onClose }: ServiceModalProps) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [dataClassification, setDataClassification] = useState('');
  const [connectionType, setConnectionType] = useState('API');

  // Source System State
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [sourceSystemName, setSourceSystemName] = useState('');

  const filteredSourceSystems = initialSourceSystems.filter(ss => 
    ss.systemName.toLowerCase().includes(sourceSystemName.toLowerCase()) ||
    ss.unitName.toLowerCase().includes(sourceSystemName.toLowerCase())
  );

  const SAMPLE_FIELDS = [
    'ma_ho_so', 'so_dang_ky', 'so_quyen', 'trang_so',
    'nguoi_duoc_cap.ho_ten', 'nguoi_duoc_cap.gioi_tinh', 'nguoi_duoc_cap.ngay_sinh',
    'nguoi_duoc_cap.noi_sinh', 'nguoi_duoc_cap.dan_toc', 'nguoi_duoc_cap.quoc_tich',
    'nguoi_duoc_cap.ngay_cap_giay_to_tuy_than', 'nguoi_duoc_cap.noi_cap_giay_to',
    'nguoi_duoc_cap.so_giay_to', 'nguoi_duoc_cap.so_dinh_danh_ca_nhan',
    'nguoi_duoc_cap.trong_thoi_gian_cu_tru_tai', 'nguoi_duoc_cap.thoi_gian_cu_tru_tu_ngay',
    'nguoi_duoc_cap.thoi_gian_cu_tru_den_ngay', 'nguoi_duoc_cap.tinh_trang_hon_nhan',
    'nguoi_duoc_cap.muc_dich_su_dung', 'nguoi_duoc_cap.noi_dung_muc_dich',
    'thong_tin_khac.nguoi_de_nghi', 'thong_tin_khac.quan_he', 'thong_tin_khac.ngay_cap_giay_to'
  ];

  type TestState = 'idle' | 'testing_connection' | 'connection_error' | 'testing_data' | 'data_error' | 'success';
  const [testState, setTestState] = useState<TestState>('idle');
  const [mockMode, setMockMode] = useState<'success' | 'err_conn' | 'err_data'>('success');
  const [mappings, setMappings] = useState<any[]>(
    SAMPLE_FIELDS.map((f, idx) => ({ id: idx + 1, source: f, dataType: 'string', targetSchema: 'public', targetTable: 'hs_dang_ky_ket_hon', targetField: '' }))
  );

  const [showConnError, setShowConnError] = useState(false);
  const [showDataError, setShowDataError] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showMapping, setShowMapping] = useState(false);

  const resetTestState = () => {
    if (testState !== 'idle') setTestState('idle');
  };

  const handleTestConnection = () => {
    setTestState('testing_connection');
    setTimeout(() => {
      if (mockMode === 'err_conn') {
        setTestState('connection_error');
        setShowConnError(true);
        return;
      }
      setTestState('testing_data');
      setTimeout(() => {
        if (mockMode === 'err_data') {
          setTestState('data_error');
          setShowDataError(true);
        } else {
          setTestState('success');
          setShowSuccessModal(true);
        }
      }, 1500);
    }, 1500);
  };

  const selectedSource = initialSourceSystems.find(ss => ss.systemName === sourceSystemName);
  const currentClassification = selectedSource?.sourceType || '';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const finalStatus = (testState === 'success' || testState === 'connection_error' || testState === 'data_error') ? testState : 'Bản nháp';
    alert(`Lưu phương thức thu thập thành công!\nTrạng thái bản ghi: ${finalStatus}`);
    onClose();
  };

  const tabs = [
    { id: 'general' as TabType, label: 'Thông tin chung', icon: <FileText className="w-4 h-4" /> },
    { id: 'connection' as TabType, label: 'Cấu hình kết nối', icon: <Plug className="w-4 h-4" /> },
    { id: 'mapping' as TabType, label: 'Nạp cấu trúc', icon: <LayoutTemplate className="w-4 h-4" /> },
    { id: 'collection' as TabType, label: 'Cấu hình thu thập', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-2/3 max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-base text-slate-900 font-bold uppercase tracking-tight">Thông tin kết nối</h2>
          <button onClick={onClose} title="Đóng" className="p-1 hover:bg-slate-100 rounded transition-colors">
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
                className={`px-4 py-3 text-base transition-colors relative flex items-center gap-2 ${
                  activeTab === tab.id ? 'text-blue-600 bg-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4">
            {activeTab === 'general' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="add-name" className="block text-base text-slate-600 mb-1">Tên dịch vụ <span className="text-red-500">*</span></label>
                  <input aria-label="Input field" id="add-name" title="Tên dịch vụ" type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base transition-colors" placeholder="VD: API dịch vụ dữ liệu quốc tịch" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 relative">
                    <label htmlFor="add-source-system" className="block text-base text-slate-600 mb-1">Tên hệ thống nguồn <span className="text-red-500">*</span></label>
                    <input aria-label="Input field" 
                      id="add-source-system" 
                      title="Tên hệ thống nguồn" 
                      type="text" 
                      value={sourceSystemName} 
                      onChange={(e) => {
                        setSourceSystemName(e.target.value);
                        setShowSourceDropdown(true);
                      }} 
                      onFocus={() => setShowSourceDropdown(true)}
                      onBlur={() => setTimeout(() => setShowSourceDropdown(false), 200)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base transition-colors" 
                      placeholder="Tìm kiếm hoặc chọn hệ thống nguồn..." 
                    />
                    
                    {showSourceDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredSourceSystems.map(ss => (
                          <div
                            key={ss.id}
                            className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm flex items-center justify-between"
                            onMouseDown={(e) => {
                              e.preventDefault(); 
                              setSourceSystemName(ss.systemName);
                              setShowSourceDropdown(false);
                            }}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-700">{ss.systemName}</span>
                              <span className="text-xs text-slate-500">{ss.unitName}</span>
                            </div>
                            <StatusTag label={ss.sourceType} variant={ss.sourceType === 'Trong ngành' ? 'purple' : 'blue'} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label htmlFor="add-security" className="block text-base text-slate-600 mb-1">Mức độ bảo mật dữ liệu</label>
                    <select aria-label="Select box" id="add-security" title="Mức độ bảo mật dữ liệu" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base transition-colors bg-white">
                      <option value="">Chọn mức độ bảo mật</option>
                      <option value="Dữ liệu mở">Dữ liệu mở</option>
                      <option value="Dữ liệu nội bộ">Dữ liệu nội bộ</option>
                      <option value="Dữ liệu hạn chế">Dữ liệu hạn chế</option>
                      <option value="Dữ liệu nhạy cảm">Dữ liệu nhạy cảm</option>
                      <option value="Dữ liệu bảo mật">Dữ liệu bảo mật</option>
                      <option value="Dữ liệu tuyệt mật">Dữ liệu tuyệt mật</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="desc" className="block text-base text-slate-600 mb-1">Mô tả</label>
                  <textarea aria-label="Text input" id="desc" title="Mô tả" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base transition-colors" rows={3} placeholder="Mô tả chi tiết" />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-2">Đính kèm văn bản</label>
                  <div className="border border-slate-300 rounded-lg p-3 text-center py-6">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-base text-slate-600">Click để chọn file PDF, DOCX</p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'connection' && <ConnectionConfigSection dataClassification={dataClassification} resetTestState={resetTestState} testState={testState} handleTestConnection={handleTestConnection} mockMode={mockMode} setMockMode={setMockMode} connectionType={connectionType} setConnectionType={setConnectionType} />}
            {activeTab === 'mapping' && (
              <div className="h-[600px] -mx-6 -my-4">
                <StructureLoadingConfig />
              </div>
            )}
            {activeTab === 'collection' && <DataCollectionConfigSection resetTestState={resetTestState} />}
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
            <div>
              {activeTab === 'connection' && connectionType !== 'FILE' && (
                <button type="button" onClick={handleTestConnection} className="px-4 py-2 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">Kiểm tra kết nối</button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 text-base text-[#020817] bg-white border border-[#e2e8f0] rounded-[6px] hover:bg-slate-50 transition-colors font-medium shadow-sm">Hủy</button>
              {activeTab !== 'collection' ? (
                <button 
                  type="button" 
                  onClick={() => {
                    const currentIndex = tabs.findIndex(t => t.id === activeTab);
                    if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1].id);
                  }} 
                  className="px-4 py-2 text-base text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                  Tiếp tục
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} className="px-6 py-2 text-base text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">Thêm</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Modals cho các trạng thái Test Kết nối */}
    <ConnectionErrorModal isOpen={showConnError} onClose={() => setShowConnError(false)} />
    <DataErrorModal isOpen={showDataError} onClose={() => setShowDataError(false)} />
    <ConnectionSuccessModal 
      isOpen={showSuccessModal} 
      onClose={() => setShowSuccessModal(false)} 
      onContinue={() => {
        setShowSuccessModal(false);
        setActiveTab('mapping');
      }} 
    />
    </>
  );
}

// Cấu phần khác được giữ nguyên cấu trúc
export function EditServiceModal({ isOpen, onClose, service, initialTab }: ServiceModalProps) {
  if (!isOpen || !service) return null;

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>(initialTab || 'general');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [dataClassification, setDataClassification] = useState('');
  const [connectionType, setConnectionType] = useState(service.connectionType || 'API');

  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [sourceSystemName, setSourceSystemName] = useState(service.system || 'Hệ thống Quản lý Hộ tịch điện tử');

  const filteredSourceSystems = initialSourceSystems.filter(ss => 
    ss.systemName.toLowerCase().includes(sourceSystemName.toLowerCase()) ||
    ss.unitName.toLowerCase().includes(sourceSystemName.toLowerCase())
  );

  const SAMPLE_FIELDS = [
    'ma_ho_so', 'so_dang_ky', 'so_quyen', 'trang_so',
    'nguoi_duoc_cap.ho_ten', 'nguoi_duoc_cap.gioi_tinh', 'nguoi_duoc_cap.ngay_sinh',
    'nguoi_duoc_cap.noi_sinh', 'nguoi_duoc_cap.dan_toc', 'nguoi_duoc_cap.quoc_tich',
    'nguoi_duoc_cap.ngay_cap_giay_to_tuy_than', 'nguoi_duoc_cap.noi_cap_giay_to',
    'nguoi_duoc_cap.so_giay_to', 'nguoi_duoc_cap.so_dinh_danh_ca_nhan',
    'nguoi_duoc_cap.trong_thoi_gian_cu_tru_tai', 'nguoi_duoc_cap.thoi_gian_cu_tru_tu_ngay',
    'nguoi_duoc_cap.thoi_gian_cu_tru_den_ngay', 'nguoi_duoc_cap.tinh_trang_hon_nhan',
    'nguoi_duoc_cap.muc_dich_su_dung', 'nguoi_duoc_cap.noi_dung_muc_dich',
    'thong_tin_khac.nguoi_de_nghi', 'thong_tin_khac.quan_he', 'thong_tin_khac.ngay_cap_giay_to'
  ];

  type TestState = 'idle' | 'testing_connection' | 'connection_error' | 'testing_data' | 'data_error' | 'success';
  const [testState, setTestState] = useState<TestState>('idle');
  const [mockMode, setMockMode] = useState<'success' | 'err_conn' | 'err_data'>('success');
  const [mappings, setMappings] = useState<any[]>(
    SAMPLE_FIELDS.map((f, idx) => ({ id: idx + 1, source: f, dataType: 'string', targetSchema: 'public', targetTable: 'hs_dang_ky_ket_hon', targetField: '' }))
  );

  const [showConnError, setShowConnError] = useState(false);
  const [showDataError, setShowDataError] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showMapping, setShowMapping] = useState(false);

  const resetTestState = () => {
    if (testState !== 'idle') setTestState('idle');
  };

  const handleTestConnection = () => {
    setTestState('testing_connection');
    setTimeout(() => {
      if (mockMode === 'err_conn') {
        setTestState('connection_error');
        setShowConnError(true);
        return;
      }
      setTestState('testing_data');
      setTimeout(() => {
        if (mockMode === 'err_data') {
          setTestState('data_error');
          setShowDataError(true);
        } else {
          setTestState('success');
          setShowSuccessModal(true);
        }
      }, 1500);
    }, 1500);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const finalStatus = (testState === 'success' || testState === 'connection_error' || testState === 'data_error') ? testState : 'Bản nháp';
    alert(`Cập nhật phương thức thu thập thành công!\nTrạng thái bản ghi: ${finalStatus}`);
    // Quay về màn hình chi tiết thay vì đóng modal
    navigate(`/collection-setup/view/${service.id}`);
  };

  const tabs = [
    { id: 'general' as TabType, label: 'Thông tin chung', icon: <FileText className="w-4 h-4" /> },
    { id: 'connection' as TabType, label: 'Cấu hình kết nối', icon: <Plug className="w-4 h-4" /> },
    { id: 'mapping' as TabType, label: 'Nạp cấu trúc', icon: <LayoutTemplate className="w-4 h-4" /> },
    { id: 'collection' as TabType, label: 'Cấu hình thu thập', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-2/3 max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-base text-slate-900 font-bold uppercase tracking-tight">Chỉnh sửa kết nối API - {service.name}</h2>
          <button onClick={onClose} title="Đóng" className="p-1 hover:bg-slate-100 rounded transition-colors">
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
                className={`px-4 py-3 text-base transition-colors relative flex items-center gap-2 ${
                  activeTab === tab.id ? 'text-blue-600 bg-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4">
            {activeTab === 'general' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-base text-slate-600 mb-1">Tên dịch vụ <span className="text-red-500">*</span></label>
                  <input aria-label="Input field" id="edit-name" title="Tên dịch vụ" type="text" defaultValue={service.name} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base transition-colors" placeholder="VD: API dịch vụ dữ liệu quốc tịch" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 relative">
                    <label htmlFor="edit-source-system" className="block text-base text-slate-600 mb-1">Tên hệ thống nguồn <span className="text-red-500">*</span></label>
                    <input aria-label="Input field" 
                      id="edit-source-system" 
                      title="Tên hệ thống nguồn" 
                      type="text" 
                      value={sourceSystemName} 
                      onChange={(e) => {
                        setSourceSystemName(e.target.value);
                        setShowSourceDropdown(true);
                      }} 
                      onFocus={() => setShowSourceDropdown(true)}
                      onBlur={() => setTimeout(() => setShowSourceDropdown(false), 200)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base transition-colors" 
                      placeholder="Tìm kiếm hoặc chọn hệ thống nguồn..." 
                    />
                    
                    {showSourceDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredSourceSystems.map(ss => (
                          <div
                            key={ss.id}
                            className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm flex items-center justify-between"
                            onMouseDown={(e) => {
                              e.preventDefault(); 
                              setSourceSystemName(ss.systemName);
                              setShowSourceDropdown(false);
                            }}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-700">{ss.systemName}</span>
                              <span className="text-xs text-slate-500">{ss.unitName}</span>
                            </div>
                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{ss.sourceType}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label htmlFor="edit-security" className="block text-base text-slate-600 mb-1">Mức độ bảo mật dữ liệu</label>
                    <select aria-label="Select box" id="edit-security" title="Mức độ bảo mật dữ liệu" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base transition-colors bg-white">
                      <option value="">Chọn mức độ bảo mật</option>
                      <option value="Dữ liệu mở">Dữ liệu mở</option>
                      <option value="Dữ liệu nội bộ">Dữ liệu nội bộ</option>
                      <option value="Dữ liệu hạn chế">Dữ liệu hạn chế</option>
                      <option value="Dữ liệu nhạy cảm">Dữ liệu nhạy cảm</option>
                      <option value="Dữ liệu bảo mật">Dữ liệu bảo mật</option>
                      <option value="Dữ liệu tuyệt mật">Dữ liệu tuyệt mật</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="edit-desc" className="block text-base text-slate-600 mb-1">Mô tả</label>
                  <textarea aria-label="Text input" id="edit-desc" title="Mô tả" defaultValue={service.description} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base transition-colors" rows={3} placeholder="Mô tả chi tiết" />
                </div>
                <div>
                  <label className="block text-base text-slate-600 mb-2">Đính kèm văn bản</label>
                  <div className="border border-slate-300 rounded-lg p-3 text-center py-6">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-base text-slate-600">Click để chọn file PDF, DOCX</p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'connection' && <ConnectionConfigSection dataClassification={dataClassification} resetTestState={resetTestState} isEdit={true} testState={testState} handleTestConnection={handleTestConnection} mockMode={mockMode} setMockMode={setMockMode} connectionType={connectionType} setConnectionType={setConnectionType} />}
            {activeTab === 'mapping' && (
              <div className="h-[600px] -mx-6 -my-4">
                <StructureLoadingConfig />
              </div>
            )}
            {activeTab === 'collection' && <DataCollectionConfigSection resetTestState={resetTestState} />}
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
            <div>
              {activeTab === 'connection' && connectionType !== 'FILE' && (
                <button type="button" onClick={handleTestConnection} className="px-4 py-2 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">Kiểm tra kết nối</button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 text-base text-[#020817] bg-white border border-[#e2e8f0] rounded-[6px] hover:bg-slate-50 transition-colors font-medium shadow-sm">Hủy</button>
              {activeTab !== 'collection' ? (
                <button 
                  type="button" 
                  onClick={() => {
                    const currentIndex = tabs.findIndex(t => t.id === activeTab);
                    if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1].id);
                  }} 
                  className="px-4 py-2 text-base text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                  Tiếp tục
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} className="px-6 py-2 text-base text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">Cập nhật</button>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConnectionErrorModal isOpen={showConnError} onClose={() => setShowConnError(false)} />
      <DataErrorModal isOpen={showDataError} onClose={() => setShowDataError(false)} />
      <ConnectionSuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
        onContinue={() => {
          setShowSuccessModal(false);
          setActiveTab('mapping');
        }} 
      />
    </div>
  );
}

export function DeleteServiceModal({ isOpen, onClose, service }: ServiceModalProps) {
  if (!isOpen || !service) return null;
  return (
    <ConfirmModal 
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={() => {
        alert('Đã xóa dịch vụ thành công!');
      }}
      title="Xác nhận xóa thiết lập"
      subtitle="Hành động này không thể hoàn tác"
      message={
        <>Bạn có chắc chắn muốn xóa dịch vụ <strong>{service.name}</strong> không?</>
      }
      confirmText="Xóa dịch vụ"
      type="delete"
    />
  );
}

export function SettingsServiceModal({ isOpen, onClose, service }: ServiceModalProps) {
  if (!isOpen || !service) return null;
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Cài đặt hệ thống dịch vụ"
      subtitle={`Cấu hình nâng cao cho: ${service.name}`}
      maxWidth="max-w-md"
      footer={
        <div className="flex justify-end gap-3 w-full">
           <button onClick={onClose} className="px-4 py-2 bg-white text-[#020817] border border-[#e2e8f0] rounded-[6px] hover:bg-slate-50 transition-colors font-medium shadow-sm text-base">Đóng</button>
           <button onClick={() => { alert('Lưu cài đặt thành công'); onClose(); }} className="px-4 py-2 bg-blue-600 text-white flex items-center gap-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm text-base">
             <CheckCircle className="w-4 h-4"/> 
             Lưu cài đặt
           </button>
        </div>
      }
    >
      <div className="space-y-4 pt-2">
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="mt-0.5">
              <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" defaultChecked />
            </div>
            <div>
              <span className="text-base font-medium text-slate-900">Tự động khởi động lại</span>
              <p className="text-sm text-slate-500 mt-0.5">Tự động thực hiện lại tiến trình thu thập nếu gặp lỗi Network</p>
            </div>
          </label>
        </div>
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="mt-0.5">
              <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" defaultChecked />
            </div>
            <div>
              <span className="text-base font-medium text-slate-900">Ghi Log chi tiết (Debug Mode)</span>
              <p className="text-sm text-slate-500 mt-0.5">Lưu trữ toàn bộ payload request/response để phục vụ kiểm tra lỗi</p>
            </div>
          </label>
        </div>
        <div className="pt-3 border-t border-slate-100">
          <label className="block text-sm font-medium text-slate-700 mb-1">Cảnh báo khi số bản ghi lỗi vượt quá (%)</label>
          <input aria-label="Input field" type="number" defaultValue="10" title="Tỉ lệ lỗi (%)" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50" />
        </div>
      </div>
    </BaseModal>
  );
}