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
import { Portal } from '../../common/Portal';
import { StructureLoadingConfig } from './StructureLoadingConfig';
import { initialSourceSystems } from './mockSourceSystems';
import { StatusTag } from '../../common/StatusTag';
import { toast } from 'sonner';
import { BTN_PRIMARY, BTN_OUTLINE, BTN_GHOST_ICON, tabClass, INPUT_CLS, LABEL_CLS, REQUIRED_MARK, resolveConnectionType } from './collectionUi';

const ConnectionSuccessModal = ({ isOpen, onClose, onContinue }: { isOpen: boolean, onClose: () => void, onContinue: () => void }) => {
  if (!isOpen) return null;
  return (
    <Portal>
      <div 
        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200"
          style={{ maxWidth: '450px' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} aria-label="Đóng" className={`absolute right-4 top-4 z-10 ${BTN_GHOST_ICON}`}>
            <X className="w-4 h-4"/>
          </button>
          <div className="p-6 pb-4 flex flex-col items-center">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-3">
              <CheckCircle className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <h3 className="text-[16px] font-semibold text-[#020817] mb-1">Kết nối thành công</h3>
            <p className="text-[#64748B] text-[13px] mb-4 text-center px-4 leading-relaxed">Kết nối thành công, vui lòng thực hiện Nạp cấu trúc.</p>
          </div>
          <div className="px-6 py-4 flex justify-center gap-3 bg-[#F8FAFC] border-t border-[#E2E8F0] w-full">
            <button onClick={onClose} className={BTN_OUTLINE}>Đóng</button>
            <button onClick={onContinue} className={BTN_PRIMARY}>Tiếp tục</button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

const ConnectionErrorModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <Portal>
      <div 
        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200"
          style={{ maxWidth: '450px' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} aria-label="Đóng" className={`absolute right-4 top-4 z-10 ${BTN_GHOST_ICON}`}>
            <X className="w-4 h-4"/>
          </button>
          <div className="p-6 pb-4 flex flex-col items-center">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <h3 className="text-[16px] font-semibold text-[#020817] mb-1">Kết nối thất bại</h3>
            <p className="text-[#64748B] text-[13px] mb-4 text-center px-4 leading-relaxed">Không thể kết nối đến Hệ thống đích (Destination API).</p>
            
            <div className="w-full text-left px-5">
              <p className="text-[13px] font-medium text-[#64748B] mb-1.5">Lỗi trả về</p>
              <div className="bg-red-50/50 text-red-600 px-3 py-2 rounded-lg text-[13px] mb-4 font-medium border border-red-100">
                Error 401 Unauthorized: Invalid API Key.
              </div>

              <p className="text-[13px] font-medium text-[#020817] mb-1.5">Hướng dẫn khắc phục</p>
              <ul className="text-[13px] text-slate-600 space-y-1.5 mb-2 ml-4 list-disc marker:text-slate-400">
                <li>Kiểm tra lại giá trị <strong>API Key</strong> (tránh dư khoảng trắng).</li>
                <li>Xác nhận API Key còn hạn hoặc chưa bị thu hồi.</li>
                <li>Đảm bảo IP hệ thống đã được cấp phép (whitelist).</li>
              </ul>
            </div>
          </div>
          <div className="px-6 py-4 flex justify-center bg-[#F8FAFC] border-t border-[#E2E8F0] w-full">
            <button onClick={onClose} className={BTN_PRIMARY}>Đã hiểu & Đóng</button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

const DataErrorModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <Portal>
      <div 
        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200"
          style={{ maxWidth: '450px' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} aria-label="Đóng" className={`absolute right-4 top-4 z-10 ${BTN_GHOST_ICON}`}>
            <X className="w-4 h-4"/>
          </button>
          <div className="p-6 pb-4 flex flex-col items-center">
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-3">
              <FileX className="w-6 h-6" strokeWidth={2} />
            </div>
            <h3 className="text-[16px] font-semibold text-[#020817] mb-1">Không có dữ liệu</h3>
            <p className="text-[#64748B] text-[13px] mb-4 text-center px-4 leading-relaxed">Kết nối thành công, nhưng không nhận được dữ liệu trả về.</p>
            
            <div className="w-full text-left px-5">
              <p className="text-[13px] font-medium text-[#64748B] mb-1.5">Trạng thái kết nối</p>
              <div className="bg-green-50/30 text-green-700 px-3 py-1.5 rounded-lg text-[13px] mb-4 flex items-center gap-1.5 border border-green-100 w-fit">
                <Check className="w-3 h-3"/> HTTP 200 OK (Thành công)
              </div>

              <p className="text-[13px] font-medium text-[#020817] mb-1.5">Hướng dẫn khắc phục</p>
              <ul className="text-[13px] text-slate-600 space-y-1.5 mb-2 ml-4 list-disc marker:text-slate-400">
                <li>Kiểm tra lại format của <strong>Request Sample</strong>.</li>
                <li>Xác nhận thời điểm yêu cầu có dữ liệu trên nguồn.</li>
                <li>Đảm bảo các tham số (Params) được truyền đúng.</li>
              </ul>
            </div>
          </div>
          <div className="px-6 py-4 flex justify-center bg-[#F8FAFC] border-t border-[#E2E8F0] w-full">
            <button onClick={onClose} className={BTN_PRIMARY}>Đã hiểu & Đóng</button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

const DataMappingModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-50 rounded-xl shadow-2xl w-full max-w-[1000px] h-full max-h-[90vh] overflow-hidden flex flex-col relative border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center z-10 shrink-0">
          <h2 className="text-[16px] font-semibold text-[#020817]">Cấu hình ánh xạ dữ liệu đích (Data Mapping)</h2>
          <button onClick={onClose} aria-label="Đóng" className={BTN_GHOST_ICON}><X className="w-5 h-5" /></button>
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
// Bọc ngoài để không gọi hook sau lệnh return sớm (quy tắc hook của React)
export function AddServiceModal(props: ServiceModalProps) {
  if (!props.isOpen) return null;
  return <AddServiceModalContent {...props} />;
}

function AddServiceModalContent({ isOpen, onClose }: ServiceModalProps) {

  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [dataClassification, setDataClassification] = useState('');
  const [connectionType, setConnectionType] = useState('API');
  const [collectionDataType, setCollectionDataType] = useState('');

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
    toast.success('Lưu dịch vụ thu thập thành công', { description: `Trạng thái bản ghi: ${finalStatus}` });
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
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-2xl shadow-2xl w-2/3 h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h2 className="text-[16px] font-semibold text-[#020817]">Thông tin kết nối</h2>
            <button onClick={onClose} title="Đóng" aria-label="Đóng" className={BTN_GHOST_ICON}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="border-b border-[#E2E8F0] bg-white">
            <div className="flex px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={tabClass(activeTab === tab.id)}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col">
            <div className="flex-1 shrink-0 px-6 py-4">
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="add-name" className={LABEL_CLS}>Tên dịch vụ <span className={REQUIRED_MARK}>*</span></label>
                    <input aria-label="Input field" id="add-name" title="Tên dịch vụ" type="text" className={INPUT_CLS} placeholder="VD: API dịch vụ dữ liệu quốc tịch" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 relative">
                      <label htmlFor="add-source-system" className={LABEL_CLS}>Tên hệ thống nguồn <span className={REQUIRED_MARK}>*</span></label>
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
                        className={INPUT_CLS}
                        placeholder="Tìm kiếm hoặc chọn hệ thống nguồn..."
                      />

                      {showSourceDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {filteredSourceSystems.map(ss => (
                            <div
                              key={ss.id}
                              className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-[13px] flex items-center justify-between"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setSourceSystemName(ss.systemName);
                                setShowSourceDropdown(false);
                              }}
                            >
                              <div className="flex flex-col">
                                <span className="font-medium text-slate-700">{ss.systemName}</span>
                                <span className="text-[13px] text-slate-500">{ss.unitName}</span>
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
                      <label htmlFor="add-security" className={LABEL_CLS}>Mức độ bảo mật dữ liệu</label>
                      <select defaultValue="" aria-label="Select box" id="add-security" title="Mức độ bảo mật dữ liệu" className={INPUT_CLS}>
                        <option value="" disabled hidden>-- Chọn mức độ bảo mật --</option>
                        <option value="Dữ liệu mở">Dữ liệu mở</option>
                        <option value="Dữ liệu nội bộ">Dữ liệu nội bộ</option>
                        <option value="Dữ liệu hạn chế">Dữ liệu hạn chế</option>
                        <option value="Dữ liệu nhạy cảm">Dữ liệu nhạy cảm</option>
                        <option value="Dữ liệu bảo mật">Dữ liệu bảo mật</option>
                        <option value="Dữ liệu tuyệt mật">Dữ liệu tuyệt mật</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label htmlFor="add-data-type" className={LABEL_CLS}>Loại dữ liệu thu thập <span className={REQUIRED_MARK}>*</span></label>
                      <select
                        aria-label="Select box"
                        id="add-data-type"
                        title="Loại dữ liệu thu thập"
                        required
                        className={INPUT_CLS}
                        value={collectionDataType}
                        onChange={(e) => setCollectionDataType(e.target.value)}
                      >
                        <option value="" disabled hidden>-- Chọn loại dữ liệu thu thập --</option>
                        <option value="Dữ liệu danh mục">Dữ liệu danh mục</option>
                        <option value="Dữ liệu nghiệp vụ">Dữ liệu nghiệp vụ</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="desc" className={LABEL_CLS}>Mô tả</label>
                    <textarea aria-label="Text input" id="desc" title="Mô tả" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} placeholder="Mô tả chi tiết" />
                  </div>
                  <div>
                    <label className={`${LABEL_CLS} !mb-2`}>Đính kèm văn bản</label>
                    <div className="border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] rounded-lg p-6 text-center cursor-pointer hover:border-blue-600 transition-colors">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-[13px] font-medium text-[#020817]">Kéo thả file vào đây hoặc <span className="text-blue-600">Tải lên</span></p>
                      <p className="mt-1 text-[12px] text-[#64748B]">Hỗ trợ: .pdf, .docx</p>
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
            <div className="sticky bottom-0 z-10 shrink-0 flex items-center justify-between px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
              <div>
                {activeTab === 'connection' && !['FILE', 'API_RECEIVE_JSON', 'API_RECEIVE_XML'].includes(connectionType) && (
                  <button type="button" onClick={handleTestConnection} className={BTN_OUTLINE}>Kiểm tra kết nối</button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={onClose} className={BTN_OUTLINE}>Hủy</button>
                {activeTab !== 'collection' ? (
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = tabs.findIndex(t => t.id === activeTab);
                      if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1].id);
                    }}
                    className={BTN_PRIMARY}
                  >
                    Tiếp tục
                  </button>
                ) : (
                  <button type="button" onClick={handleSubmit} className={BTN_PRIMARY}>Thêm</button>
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
export function EditServiceModal(props: ServiceModalProps) {
  if (!props.isOpen || !props.service) return null;
  return <EditServiceModalContent {...props} />;
}

function EditServiceModalContent({ isOpen, onClose, service, initialTab }: ServiceModalProps) {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>(initialTab || 'general');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [dataClassification, setDataClassification] = useState('');
  const [connectionType, setConnectionType] = useState(resolveConnectionType(service));

  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [sourceSystemName, setSourceSystemName] = useState(service.system || 'Hệ thống quản lý Bộ Tư Pháp Hộ tịch điện tử');

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
    toast.success('Cập nhật dịch vụ thu thập thành công', { description: `Trạng thái bản ghi: ${finalStatus}` });
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-2/3 h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-[16px] font-semibold text-[#020817] truncate">Chỉnh sửa kết nối API - {service.name}</h2>
          <button onClick={onClose} title="Đóng" aria-label="Đóng" className={BTN_GHOST_ICON}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="border-b border-[#E2E8F0] bg-white">
          <div className="flex px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={tabClass(activeTab === tab.id)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col">
          <div className="flex-1 shrink-0 px-6 py-4">
            {activeTab === 'general' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-name" className={LABEL_CLS}>Tên dịch vụ <span className={REQUIRED_MARK}>*</span></label>
                  <input aria-label="Input field" id="edit-name" title="Tên dịch vụ" type="text" defaultValue={service.name} className={INPUT_CLS} placeholder="VD: API dịch vụ dữ liệu quốc tịch" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 relative">
                    <label htmlFor="edit-source-system" className={LABEL_CLS}>Tên hệ thống nguồn <span className={REQUIRED_MARK}>*</span></label>
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
                      className={INPUT_CLS}
                      placeholder="Tìm kiếm hoặc chọn hệ thống nguồn..."
                    />

                    {showSourceDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredSourceSystems.map(ss => (
                          <div
                            key={ss.id}
                            className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-[13px] flex items-center justify-between"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setSourceSystemName(ss.systemName);
                              setShowSourceDropdown(false);
                            }}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-700">{ss.systemName}</span>
                              <span className="text-[13px] text-slate-500">{ss.unitName}</span>
                            </div>
                            <span className="text-[13px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{ss.sourceType}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label htmlFor="edit-security" className={LABEL_CLS}>Mức độ bảo mật dữ liệu</label>
                    <select defaultValue="" aria-label="Select box" id="edit-security" title="Mức độ bảo mật dữ liệu" className={INPUT_CLS}>
                      <option value="" disabled hidden>-- Chọn mức độ bảo mật --</option>
                      <option value="Dữ liệu mở">Dữ liệu mở</option>
                      <option value="Dữ liệu nội bộ">Dữ liệu nội bộ</option>
                      <option value="Dữ liệu hạn chế">Dữ liệu hạn chế</option>
                      <option value="Dữ liệu nhạy cảm">Dữ liệu nhạy cảm</option>
                      <option value="Dữ liệu bảo mật">Dữ liệu bảo mật</option>
                      <option value="Dữ liệu tuyệt mật">Dữ liệu tuyệt mật</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label htmlFor="edit-data-type" className={LABEL_CLS}>Loại dữ liệu thu thập <span className={REQUIRED_MARK}>*</span></label>
                    <select
                      aria-label="Select box"
                      id="edit-data-type"
                      title="Loại dữ liệu thu thập"
                      required
                      className={INPUT_CLS}
                      defaultValue={service.dataType || ''}
                    >
                      <option value="" disabled hidden>-- Chọn loại dữ liệu thu thập --</option>
                      <option value="Dữ liệu danh mục">Dữ liệu danh mục</option>
                      <option value="Dữ liệu nghiệp vụ">Dữ liệu nghiệp vụ</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="edit-desc" className={LABEL_CLS}>Mô tả</label>
                  <textarea aria-label="Text input" id="edit-desc" title="Mô tả" defaultValue={service.description} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} placeholder="Mô tả chi tiết" />
                </div>
                <div>
                  <label className={`${LABEL_CLS} !mb-2`}>Đính kèm văn bản</label>
                  <div className="border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] rounded-lg p-6 text-center cursor-pointer hover:border-blue-600 transition-colors">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-[13px] font-medium text-[#020817]">Kéo thả file vào đây hoặc <span className="text-blue-600">Tải lên</span></p>
                      <p className="mt-1 text-[12px] text-[#64748B]">Hỗ trợ: .pdf, .docx</p>
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
          <div className="sticky bottom-0 z-10 shrink-0 flex items-center justify-between px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
            <div>
              {activeTab === 'connection' && !['FILE', 'API_RECEIVE_JSON', 'API_RECEIVE_XML'].includes(connectionType) && (
                <button type="button" onClick={handleTestConnection} className={BTN_OUTLINE}>Kiểm tra kết nối</button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={onClose} className={BTN_OUTLINE}>Hủy</button>
              {activeTab !== 'collection' ? (
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = tabs.findIndex(t => t.id === activeTab);
                    if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1].id);
                  }}
                  className={BTN_PRIMARY}
                >
                  Tiếp tục
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} className={BTN_PRIMARY}>Cập nhật</button>
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
        toast.success('Đã xóa dịch vụ thành công');
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
          <button onClick={onClose} className={BTN_OUTLINE}>Đóng</button>
          <button onClick={() => { toast.success('Lưu cài đặt thành công'); onClose(); }} className={BTN_PRIMARY}>
            <CheckCircle className="w-4 h-4" />
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
              <span className="text-[13px] font-medium text-slate-900">Tự động khởi động lại</span>
              <p className="text-[13px] text-slate-500 mt-0.5">Tự động thực hiện lại tiến trình thu thập nếu gặp lỗi Network</p>
            </div>
          </label>
        </div>
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="mt-0.5">
              <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" defaultChecked />
            </div>
            <div>
              <span className="text-[13px] font-medium text-slate-900">Ghi Log chi tiết (Debug Mode)</span>
              <p className="text-[13px] text-slate-500 mt-0.5">Lưu trữ toàn bộ payload request/response để phục vụ kiểm tra lỗi</p>
            </div>
          </label>
        </div>
        <div className="pt-3 border-t border-slate-100">
          <label className={LABEL_CLS}>Cảnh báo khi số bản ghi lỗi vượt quá (%)</label>
          <input aria-label="Input field" type="number" defaultValue="10" title="Tỉ lệ lỗi (%)" className={INPUT_CLS} />
        </div>
      </div>
    </BaseModal>
  );
}