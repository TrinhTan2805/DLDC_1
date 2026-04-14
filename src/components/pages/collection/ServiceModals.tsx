import { useState, type FormEvent } from 'react';
import { 
  X, AlertCircle, CheckCircle, Upload, Eye, EyeOff, 
  Database, FileText, User, Plug, Settings, Plus,
  Calendar, Clock
} from 'lucide-react';
import { DataCollectionConfigSection } from './DataCollectionConfigSection';
import { ConnectionConfigSection } from './ConnectionConfigSection';
import { ContactInfoSection } from './ContactInfoSection';
import { DataDetailModal } from '../../DataDetailModal';
import { ConfirmModal } from '../../common/ConfirmModal';
import { BaseModal } from '../../common/BaseModal';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: any;
  onViewData?: (pageId?: string) => void;
}

type TabType = 'general' | 'contact' | 'connection' | 'collection';

// Modal Thêm mới phương thức
export function AddServiceModal({ isOpen, onClose }: ServiceModalProps) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [dataClassification, setDataClassification] = useState('');
  const [unitName, setUnitName] = useState('');
  
  // Combobox State
  const [showDonViDropdown, setShowDonViDropdown] = useState(false);
  const [donViList, setDonViList] = useState([
    { id: '1', name: 'Tòa án nhân dân tối cao', classification: 'Ngoài ngành' },
    { id: '2', name: 'Cục Thống kê Trung ương', classification: 'Ngoài ngành' },
    { id: '3', name: 'Cục Hành chính tư pháp', classification: 'Trong ngành' },
  ]);
  const [showCreateDonViModal, setShowCreateDonViModal] = useState(false);
  const [newDonViClassification, setNewDonViClassification] = useState('Trong ngành');

  const filteredDonVi = donViList.filter(dv => dv.name.toLowerCase().includes(unitName.toLowerCase()));

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

  const resetTestState = () => {
    if (testState !== 'idle') setTestState('idle');
  };

  const handleTestConnection = () => {
    setTestState('testing_connection');
    setTimeout(() => {
      if (mockMode === 'err_conn') {
        setTestState('connection_error');
        return;
      }
      setTestState('testing_data');
      setTimeout(() => {
        if (mockMode === 'err_data') {
          setTestState('data_error');
        } else {
          setTestState('success');
        }
      }, 1500);
    }, 1500);
  };

  // Lấy giá trị nguồn thu thập dựa vào đơn vị đang được chọn
  const selectedUnit = donViList.find(dv => dv.name === unitName);
  const currentClassification = selectedUnit?.classification || '';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const finalStatus = (testState === 'success' || testState === 'connection_error' || testState === 'data_error') ? testState : 'Bản nháp';
    alert(`Lưu phương thức thu thập thành công!\nTrạng thái bản ghi: ${finalStatus}`);
    onClose();
  };

  const tabs = [
    { id: 'general' as TabType, label: 'Thông tin chung', icon: <FileText className="w-4 h-4" /> },
    { id: 'contact' as TabType, label: 'Thông tin đơn vị cung cấp', icon: <User className="w-4 h-4" /> },
    { id: 'connection' as TabType, label: 'Cấu hình kết nối', icon: <Plug className="w-4 h-4" /> },
    { id: 'collection' as TabType, label: 'Cấu hình thu thập', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg text-slate-900 font-medium">Thông tin kết nối</h2>
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
                className={`px-4 py-3 text-sm transition-colors relative flex items-center gap-2 ${
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

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 py-4">
            {activeTab === 'general' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="add-name" className="block text-sm text-slate-600 mb-1">Tên service <span className="text-red-500">*</span></label>
                  <input id="add-name" title="Tên service" type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="VD: API dịch vụ dữ liệu quốc tịch" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <label htmlFor="add-unit" className="block text-sm text-slate-600 mb-1">Tên đơn vị <span className="text-red-500">*</span></label>
                    <input 
                      id="add-unit" 
                      title="Tên đơn vị" 
                      type="text" 
                      value={unitName} 
                      onChange={(e) => {
                        setUnitName(e.target.value);
                        setShowDonViDropdown(true);
                        // Default to something if needed, or clear it
                      }} 
                      onFocus={() => setShowDonViDropdown(true)}
                      onBlur={() => setTimeout(() => setShowDonViDropdown(false), 200)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="Tìm kiếm hoặc nhập tên đơn vị..." 
                    />
                    
                    {showDonViDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredDonVi.map(dv => (
                          <div
                            key={dv.id}
                            className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm flex items-center justify-between"
                            onMouseDown={(e) => {
                              e.preventDefault(); 
                              setUnitName(dv.name);
                              setShowDonViDropdown(false);
                            }}
                          >
                            <span className="font-medium text-slate-700">{dv.name}</span>
                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{dv.classification}</span>
                          </div>
                        ))}
                        {unitName && filteredDonVi.length === 0 && (
                          <div 
                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm text-blue-600 font-medium flex items-center gap-2 border-t border-slate-100"
                            onMouseDown={(e) => {
                              e.preventDefault(); 
                              setShowDonViDropdown(false);
                              setShowCreateDonViModal(true);
                            }}
                          >
                            <Plus className="w-4 h-4" />
                            Thêm mới đơn vị "{unitName}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <label htmlFor="add-system" className="block text-sm text-slate-600 mb-1">Hệ thống <span className="text-red-500">*</span></label>
                    <input id="add-system" title="Hệ thống" type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nhập tên hệ thống" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="add-source" className="block text-sm text-slate-600 mb-1">Nguồn thu thập</label>
                    <input 
                      id="add-source" 
                      title="Nguồn thu thập" 
                      type="text"
                      readOnly
                      value={currentClassification === 'Trong ngành' ? 'Hệ thống trong ngành' : currentClassification === 'Ngoài ngành' ? 'Hệ thống ngoài ngành' : ''}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 focus:outline-none" 
                      placeholder="Tự động hiển thị theo Đơn vị" 
                    />
                  </div>
                  <div>
                    <label htmlFor="add-security" className="block text-sm text-slate-600 mb-1">Mức độ bảo mật dữ liệu</label>
                    <select id="add-security" title="Mức độ bảo mật dữ liệu" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
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
                  <label htmlFor="desc" className="block text-sm text-slate-600 mb-1">Mô tả</label>
                  <textarea id="desc" title="Mô tả" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} placeholder="Mô tả chi tiết" />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-2">Đính kèm văn bản</label>
                  <div className="border border-slate-300 rounded-lg p-3 text-center py-6">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">Click để chọn file PDF, DOCX</p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'contact' && <ContactInfoSection unitName={unitName} onUnitNameChange={setUnitName} />}
            {activeTab === 'connection' && <ConnectionConfigSection dataClassification={dataClassification} resetTestState={resetTestState} />}
            {activeTab === 'collection' && <DataCollectionConfigSection testState={testState} setTestState={setTestState} mockMode={mockMode} setMockMode={setMockMode} mappings={mappings} setMappings={setMappings} handleTestConnection={handleTestConnection} resetTestState={resetTestState} />}
          </div>
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Hủy</button>
            <button type="submit" className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">Lưu lại</button>
          </div>
        </form>
      </div>
    </div>
    
    {/* Modal Thêm mới đơn vị inline in ServiceModals */}
    {showCreateDonViModal && (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[60] animate-in fade-in duration-200">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Thêm mới Đơn vị</h3>
            <button type="button" onClick={() => setShowCreateDonViModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tên đơn vị <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nguồn thu thập <span className="text-red-500">*</span></label>
              <div className="flex gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer relative">
                  <input
                    type="radio"
                    name="newModalClassification"
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
                    name="newModalClassification"
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
                if (!unitName.trim()) {
                  alert('Vui lòng nhập Tên đơn vị');
                  return;
                }
                const newDv = { id: Date.now().toString(), name: unitName, classification: newDonViClassification };
                setDonViList([...donViList, newDv]);
                setUnitName(newDv.name);
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
    </>
  );
}

// Cấu phần khác được giữ nguyên cấu trúc
export function EditServiceModal({ isOpen, onClose, service }: ServiceModalProps) {
  if (!isOpen || !service) return null;

  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [dataClassification, setDataClassification] = useState('');
  const [unitName, setUnitName] = useState(service.managingUnit || '');

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

  const resetTestState = () => {
    if (testState !== 'idle') setTestState('idle');
  };

  const handleTestConnection = () => {
    setTestState('testing_connection');
    setTimeout(() => {
      if (mockMode === 'err_conn') {
        setTestState('connection_error');
        return;
      }
      setTestState('testing_data');
      setTimeout(() => {
        if (mockMode === 'err_data') {
          setTestState('data_error');
        } else {
          setTestState('success');
        }
      }, 1500);
    }, 1500);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const finalStatus = (testState === 'success' || testState === 'connection_error' || testState === 'data_error') ? testState : 'Bản nháp';
    alert(`Cập nhật phương thức thu thập thành công!\nTrạng thái bản ghi: ${finalStatus}`);
    onClose();
  };

  const tabs = [
    { id: 'general' as TabType, label: 'Thông tin chung', icon: <FileText className="w-4 h-4" /> },
    { id: 'contact' as TabType, label: 'Thông tin đơn vị cung cấp', icon: <User className="w-4 h-4" /> },
    { id: 'connection' as TabType, label: 'Cấu hình kết nối', icon: <Plug className="w-4 h-4" /> },
    { id: 'collection' as TabType, label: 'Cấu hình thu thập', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg text-slate-900 font-medium">Chỉnh sửa kết nối API - {service.name}</h2>
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
                className={`px-4 py-3 text-sm transition-colors relative flex items-center gap-2 ${
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

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 py-4">
            {activeTab === 'general' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm text-slate-600 mb-1">Tên service <span className="text-red-500">*</span></label>
                  <input id="edit-name" title="Tên service" type="text" defaultValue={service.name} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="VD: API dịch vụ dữ liệu quốc tịch" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="edit-unit" className="block text-sm text-slate-600 mb-1">Tên đơn vị <span className="text-red-500">*</span></label>
                    <input id="edit-unit" title="Tên đơn vị" type="text" defaultValue={service.managingUnit} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tìm kiếm hoặc nhập tên đơn vị..." />
                  </div>
                  <div>
                    <label htmlFor="edit-system" className="block text-sm text-slate-600 mb-1">Hệ thống <span className="text-red-500">*</span></label>
                    <input id="edit-system" title="Hệ thống" type="text" defaultValue={service.system || 'Hệ thống DLDC'} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nhập tên hệ thống" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="edit-source" className="block text-sm text-slate-600 mb-1">Nguồn thu thập</label>
                    <input id="edit-source" title="Nguồn thu thập" type="text" readOnly defaultValue="Hệ thống trong ngành" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 focus:outline-none" placeholder="Tự động hiển thị theo Đơn vị" />
                  </div>
                  <div>
                    <label htmlFor="edit-security" className="block text-sm text-slate-600 mb-1">Mức độ bảo mật dữ liệu</label>
                    <select id="edit-security" title="Mức độ bảo mật dữ liệu" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
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
                  <label htmlFor="edit-desc" className="block text-sm text-slate-600 mb-1">Mô tả</label>
                  <textarea id="edit-desc" title="Mô tả" defaultValue={service.description} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} placeholder="Mô tả chi tiết" />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-2">Đính kèm văn bản</label>
                  <div className="border border-slate-300 rounded-lg p-3 text-center py-6">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">Click để chọn file PDF, DOCX</p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'contact' && <ContactInfoSection />}
            {activeTab === 'connection' && <ConnectionConfigSection dataClassification={dataClassification} resetTestState={resetTestState} isEdit={true} />}
            {activeTab === 'collection' && <DataCollectionConfigSection testState={testState} setTestState={setTestState} mockMode={mockMode} setMockMode={setMockMode} mappings={mappings} setMappings={setMappings} handleTestConnection={handleTestConnection} resetTestState={resetTestState} />}
          </div>
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Hủy</button>
            <button type="submit" className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">Cập nhật nội dung</button>
          </div>
        </form>
      </div>
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
           <button onClick={onClose} className="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg text-sm">Đóng</button>
           <button onClick={() => { alert('Lưu cài đặt thành công'); onClose(); }} className="px-4 py-2 bg-slate-900 text-white flex items-center gap-2 rounded-lg text-sm">
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
              <span className="text-sm font-medium text-slate-900">Tự động khởi động lại</span>
              <p className="text-xs text-slate-500 mt-0.5">Tự động thực hiện lại tiến trình thu thập nếu gặp lỗi Network</p>
            </div>
          </label>
        </div>
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="mt-0.5">
              <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" defaultChecked />
            </div>
            <div>
              <span className="text-sm font-medium text-slate-900">Ghi Log chi tiết (Debug Mode)</span>
              <p className="text-xs text-slate-500 mt-0.5">Lưu trữ toàn bộ payload request/response để phục vụ kiểm tra lỗi</p>
            </div>
          </label>
        </div>
        <div className="pt-3 border-t border-slate-100">
          <label className="block text-sm font-medium text-slate-700 mb-1">Cảnh báo khi số bản ghi lỗi vượt quá (%)</label>
          <input type="number" defaultValue="10" title="Tỉ lệ lỗi (%)" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50" />
        </div>
      </div>
    </BaseModal>
  );
}