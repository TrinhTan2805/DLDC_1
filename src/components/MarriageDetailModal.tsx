import { X, Search, Filter, Download, FileDown, XCircle, CheckCircle, AlertCircle, Eye, RefreshCw, Calendar, ArrowUp, Plus, Trash2, Edit2 } from 'lucide-react';
import { useState } from 'react';

interface MarriageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  totalRecords: number;
  newRecords: number;
  updatedRecords: number;
  errorRecords: number;
}

interface MarriageRecord {
  id: string;
  husbandName: string;
  husbandBirthDate: string;
  wifeName: string;
  wifeBirthDate: string;
  marriageDate: string;
  status: 'approved' | 'pending' | 'error';
  hasError?: boolean;
  errorMessage?: string;
  
  // Thông tin hồ sơ
  fileId?: string;
  recordCode?: string;
  registrationNumber?: string;
  bookNumber?: string;
  pageNumber?: string;
  
  // Thông tin bên chồng
  husbandEthnicity?: string;
  husbandNationality?: string;
  husbandResidence?: string;
  husbandIdIssueDate?: string;
  husbandIdIssuePlace?: string;
  husbandIdNumber?: string;
  husbandPersonalId?: string;
  husbandMarriageCount?: number;
  
  // Thông tin bên vợ
  wifeEthnicity?: string;
  wifeNationality?: string;
  wifeResidence?: string;
  wifeIdIssueDate?: string;
  wifeIdIssuePlace?: string;
  wifeIdNumber?: string;
  wifePersonalId?: string;
  wifeMarriageCount?: number;
  
  // Thông tin khác
  registrationPlace?: string;
  registrationDate?: string;
  registrationType?: string;
  foreignCertificateNumber?: string;
  foreignCertificateDate?: string;
  foreignAgencyName?: string;
  foreignCountry?: string;
  marriageStatus?: string;
  signerName?: string;
  signerPosition?: string;
  implementer?: string;
  notes?: string;
}

export function MarriageDetailModal({ 
  isOpen, 
  onClose, 
  title, 
  totalRecords,
  newRecords,
  updatedRecords,
  errorRecords
}: MarriageDetailModalProps) {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedRecord, setSelectedRecord] = useState<MarriageRecord | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  // Filter System States
  const [filterConditions, setFilterConditions] = useState<any[]>([
    { id: '1', logic: 'AND', field: 'husbandName', operator: '=', type: 'Text', value: '' }
  ]);
  
  const [valueModal, setValueModal] = useState({
    isOpen: false,
    conditionId: '',
    type: 'Text',
    value: ''
  });

  const openValueModal = (condition: any) => {
    setValueModal({
      isOpen: true,
      conditionId: condition.id,
      type: condition.type || 'Text',
      value: condition.value || ''
    });
  };

  const saveValue = () => {
    setFilterConditions(prev => prev.map(c => 
      c.id === valueModal.conditionId 
        ? { ...c, value: valueModal.value, type: valueModal.type } 
        : c
    ));
    setValueModal({ ...valueModal, isOpen: false });
  };
  
  if (!isOpen) return null;

  // Mock data
  const records: MarriageRecord[] = [
    {
      id: '1',
      husbandName: 'Nguyễn Văn Anh',
      husbandBirthDate: '15/03/1990',
      wifeName: 'Trần Thị Bích',
      wifeBirthDate: '20/05/1992',
      marriageDate: '10/10/2020',
      status: 'approved',
      recordCode: 'KH-2020-001234',
      registrationNumber: '001234/2020',
      bookNumber: '12',
      pageNumber: '45',
      husbandEthnicity: 'Kinh',
      husbandNationality: 'Việt Nam',
      husbandResidence: '123 Láng Hạ, Đống Đa, Hà Nội',
      husbandIdIssueDate: '01/01/2015',
      husbandIdIssuePlace: 'Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư',
      husbandIdNumber: '001090001234',
      husbandPersonalId: '001090001234',
      husbandMarriageCount: 1,
      wifeEthnicity: 'Kinh',
      wifeNationality: 'Việt Nam',
      wifeResidence: '456 Giải Phóng, Hai Bà Trưng, Hà Nội',
      wifeIdIssueDate: '15/02/2015',
      wifeIdIssuePlace: 'Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư',
      wifeIdNumber: '001092005678',
      wifePersonalId: '001092005678',
      wifeMarriageCount: 1,
      registrationPlace: 'UBND Phường Láng Hạ, Quận Đống Đa, Hà Nội',
      registrationDate: '10/10/2020',
      registrationType: 'Đăng ký kết hôn lần đầu',
      marriageStatus: 'Đang hôn nhân',
      signerName: 'Nguyễn Văn A',
      signerPosition: 'Chủ tịch UBND Phường',
      implementer: 'Trần Thị B',
      notes: ''
    },
    {
      id: '2',
      husbandName: 'Lê Hoàng Nam',
      husbandBirthDate: '08/07/1988',
      wifeName: 'Phạm Thị Lan',
      wifeBirthDate: '12/11/1990',
      marriageDate: '20/12/2019',
      status: 'approved',
      recordCode: 'KH-2019-005678',
      registrationNumber: '005678/2019',
      bookNumber: '10',
      pageNumber: '89',
      husbandEthnicity: 'Kinh',
      husbandNationality: 'Việt Nam',
      husbandResidence: '789 Nguyễn Trãi, Thanh Xuân, Hà Nội',
      husbandIdIssueDate: '20/05/2014',
      husbandIdIssuePlace: 'Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư',
      husbandIdNumber: '001088009876',
      husbandPersonalId: '001088009876',
      husbandMarriageCount: 1,
      wifeEthnicity: 'Kinh',
      wifeNationality: 'Việt Nam',
      wifeResidence: '321 Khương Thượng, Đống Đa, Hà Nội',
      wifeIdIssueDate: '10/08/2014',
      wifeIdIssuePlace: 'Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư',
      wifeIdNumber: '001090003456',
      wifePersonalId: '001090003456',
      wifeMarriageCount: 1,
      registrationPlace: 'UBND Phường Khương Thượng, Quận Đống Đa, Hà Nội',
      registrationDate: '20/12/2019',
      registrationType: 'Đăng ký kết hôn lần đầu',
      marriageStatus: 'Đang hôn nhân',
      signerName: 'Lê Văn C',
      signerPosition: 'Chủ tịch UBND Phường',
      implementer: 'Nguyễn Thị D',
      notes: ''
    },
    {
      id: '3',
      husbandName: 'Hoàng Minh Tuấn',
      husbandBirthDate: '25/02/1985',
      wifeName: 'Vũ Thị Hương',
      wifeBirthDate: '30/09/1987',
      marriageDate: '05/05/2021',
      status: 'error',
      hasError: true,
      errorMessage: 'Thiếu thông tin số định danh cá nhân của vợ',
      recordCode: 'KH-2021-002345',
      registrationNumber: '002345/2021',
      bookNumber: '15',
      pageNumber: '23',
      husbandEthnicity: 'Kinh',
      husbandNationality: 'Việt Nam',
      husbandResidence: '555 Trường Chinh, Thanh Xuân, Hà Nội',
      husbandIdIssueDate: '15/03/2010',
      husbandIdIssuePlace: 'Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư',
      husbandIdNumber: '001085002233',
      husbandPersonalId: '001085002233',
      husbandMarriageCount: 1,
      wifeEthnicity: 'Kinh',
      wifeNationality: 'Việt Nam',
      wifeResidence: '777 Kim Giang, Thanh Xuân, Hà Nội',
      wifeIdIssueDate: '20/06/2010',
      wifeIdIssuePlace: 'Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư',
      wifeIdNumber: '001087004455',
      wifePersonalId: '',
      wifeMarriageCount: 1,
      registrationPlace: 'UBND Phường Kim Giang, Quận Thanh Xuân, Hà Nội',
      registrationDate: '05/05/2021',
      registrationType: 'Đăng ký kết hôn lần đầu',
      marriageStatus: 'Đang hôn nhân',
      signerName: 'Phạm Văn E',
      signerPosition: 'Chủ tịch UBND Phường',
      implementer: 'Hoàng Thị F',
      notes: ''
    }
  ];

  return (
    <>
      {/* Value Entry Modal */}
      {valueModal.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden relative">
            {/* Header */}
            <div className="px-6 py-4 bg-[#007bff] text-white flex items-center justify-between">
              <h3 className="text-lg font-bold">Nhập giá trị lọc</h3>
              <button 
                onClick={() => setValueModal({ ...valueModal, isOpen: false })} 
                className="text-white hover:bg-white/20 p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kiểu dữ liệu</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                  value={valueModal.type}
                  onChange={(e) => setValueModal({ ...valueModal, type: e.target.value })}
                >
                  <option value="Text">Text</option>
                  <option value="Number">Number</option>
                  <option value="Date">Date</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Giá trị</label>
                <input 
                  type={valueModal.type === 'Date' ? 'date' : valueModal.type === 'Number' ? 'number' : 'text'}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  value={valueModal.value}
                  onChange={(e) => setValueModal({ ...valueModal, value: e.target.value })}
                  placeholder="Nhập giá trị..."
                  autoFocus
                />
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button 
                onClick={saveValue}
                className="px-6 py-2 bg-blue-600 text-white rounded font-medium text-sm hover:bg-blue-700 transition-colors"
              >
                Lưu
              </button>
              <button 
                onClick={() => setValueModal({ ...valueModal, isOpen: false })}
                className="px-6 py-2 bg-slate-500 text-white rounded font-medium text-sm hover:bg-slate-600 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] flex flex-col pointer-events-auto">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Danh sách dữ liệu</h2>
              <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                <span>Tổng số: <span className="font-medium text-slate-900">{totalRecords.toLocaleString()}</span></span>
                <span className="text-slate-300">|</span>
                <span>Mới: <span className="font-medium text-green-600">{newRecords.toLocaleString()}</span></span>
                <span className="text-slate-300">|</span>
                <span>Cập nhật: <span className="font-medium text-blue-600">{updatedRecords.toLocaleString()}</span></span>
                <span className="text-slate-300">|</span>
                <span>Lỗi: <span className="font-medium text-red-600">{errorRecords.toLocaleString()}</span></span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {activeTab === 'list' && (
              <>
                {/* Search & Actions */}
                <div className="p-4 border-b border-slate-200 flex-shrink-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`px-3 py-1.5 rounded flex items-center gap-2 text-sm font-medium transition-colors ${
                          isFilterOpen ? 'bg-blue-600 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Filter className="w-4 h-4" />
                        Lọc
                      </button>
                      <button
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className={`px-3 py-1.5 rounded flex items-center gap-2 text-sm font-medium transition-colors ${
                          isSortOpen ? 'bg-blue-600 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <ArrowUp className="w-4 h-4" />
                        Sắp xếp
                      </button>
                    </div>
                    
                    <button className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 flex items-center gap-2 text-sm">
                      <RefreshCw className="w-4 h-4" />
                      Tải lại
                    </button>
                  </div>

                  {/* Filter Panel */}
                  {isFilterOpen && (
                    <div className="bg-white border border-slate-200 rounded-lg p-5 mb-4 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <button 
                          onClick={() => {
                            const newId = Date.now().toString();
                            setFilterConditions([...filterConditions, { id: newId, logic: 'AND', field: '', operator: '=', type: 'Text', value: '' }]);
                          }}
                          className="px-3 py-1.5 border border-blue-500 text-blue-600 rounded flex items-center gap-2 text-sm font-medium hover:bg-blue-50"
                        >
                          <Plus className="w-4 h-4" />
                          Thêm điều kiện
                        </button>
                        <button onClick={() => setFilterConditions([])} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {filterConditions.map((condition, index) => (
                          <div key={condition.id} className="flex items-center gap-3">
                            <div className="w-20 flex-shrink-0">
                              {index > 0 && (
                                <select 
                                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                                  value={condition.logic}
                                  onChange={(e) => {
                                    const newConditions = [...filterConditions];
                                    newConditions[index].logic = e.target.value;
                                    setFilterConditions(newConditions);
                                  }}
                                >
                                  <option value="AND">AND</option>
                                  <option value="OR">OR</option>
                                </select>
                              )}
                            </div>
                            
                            <select 
                              className="flex-1 basis-0 w-full min-w-0 px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                              value={condition.field}
                              onChange={(e) => {
                                const newConditions = [...filterConditions];
                                newConditions[index].field = e.target.value;
                                setFilterConditions(newConditions);
                              }}
                            >
                              <option value="">Chọn trường</option>
                              <option value="husbandName">Họ tên chồng</option>
                              <option value="wifeName">Họ tên vợ</option>
                              <option value="marriageDate">Ngày kết hôn</option>
                              <option value="registrationNumber">Số đăng ký</option>
                            </select>

                            <select 
                              className="flex-1 basis-0 w-full min-w-0 px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                              value={condition.operator}
                              onChange={(e) => {
                                const newConditions = [...filterConditions];
                                newConditions[index].operator = e.target.value;
                                setFilterConditions(newConditions);
                              }}
                            >
                              <option value="=">Bằng (=)</option>
                              <option value="&gt;">Lớn hơn (&gt;)</option>
                              <option value="&lt;">Nhỏ hơn (&lt;)</option>
                              <option value="&gt;=">Lớn hơn bằng (&gt;=)</option>
                              <option value="&lt;=">Nhỏ hơn bằng (&lt;=)</option>
                              <option value="!=">Khác (!=)</option>
                              <option value="contains">Chứa</option>
                              <option value="starts">Bắt đầu</option>
                              <option value="ends">Kết thúc</option>
                            </select>

                            <div className="flex-1 basis-0 w-full min-w-0 flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded bg-white group/value">
                              <div className="flex-1 text-sm text-slate-900 truncate">
                                {condition.value || <span className="text-slate-400 font-mono">{"<?>"}</span>}
                              </div>
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  openValueModal(condition);
                                }}
                                className="p-1 hover:bg-slate-100 rounded text-blue-600 transition-colors"
                                title="Chỉnh sửa giá trị"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </div>

                            <button 
                              type="button"
                              onClick={() => setFilterConditions(filterConditions.filter(c => c.id !== condition.id))}
                              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                              title="Xóa điều kiện"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                        <button className="px-4 py-1.5 border border-blue-500 text-blue-600 rounded flex items-center gap-2 text-sm font-medium hover:bg-blue-50">
                          <Plus className="w-4 h-4" />
                          Điều kiện
                        </button>
                        <div className="ml-auto flex items-center gap-2">
                          <button className="px-6 py-1.5 bg-blue-600 text-white rounded font-medium text-sm hover:bg-blue-700 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Áp dụng
                          </button>
                          <button onClick={() => setFilterConditions([])} className="px-6 py-1.5 bg-slate-600 text-white rounded font-medium text-sm hover:bg-slate-700 flex items-center gap-2">
                            <XCircle className="w-4 h-4" />
                            Xóa bộ lọc
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">STT</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Họ tên Chồng</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Ngày sinh Chồng</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Họ tên Vợ</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Ngày sinh Vợ</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Ngày xác lập quan hệ hôn nhân</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Trạng thái</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 whitespace-nowrap">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {records.map((record, index) => (
                        <tr key={record.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-900">{index + 1}</td>
                          <td className="px-4 py-3 text-slate-900">{record.husbandName}</td>
                          <td className="px-4 py-3 text-slate-600">{record.husbandBirthDate}</td>
                          <td className="px-4 py-3 text-slate-900">{record.wifeName}</td>
                          <td className="px-4 py-3 text-slate-600">{record.wifeBirthDate}</td>
                          <td className="px-4 py-3 text-slate-600">{record.marriageDate}</td>
                          <td className="px-4 py-3">
                            {record.status === 'approved' && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs">
                                <CheckCircle className="w-3 h-3" />
                                Đã phê duyệt
                              </span>
                            )}
                            {record.status === 'pending' && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-md text-xs">
                                <AlertCircle className="w-3 h-3" />
                                Chờ duyệt
                              </span>
                            )}
                            {record.status === 'error' && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded-md text-xs">
                                <XCircle className="w-3 h-3" />
                                Lỗi
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setSelectedRecord(record)}
                              className="text-blue-600 hover:text-blue-700"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    Hiển thị <span className="font-medium text-slate-900">1-{records.length}</span> trong tổng số <span className="font-medium text-slate-900">{totalRecords}</span> bản ghi
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      className="px-3 py-1 border border-slate-300 text-slate-700 rounded hover:bg-slate-50 text-sm"
                      title="Trang trước"
                    >
                      Trước
                    </button>
                    <button title="Hành động" aria-label="Hành động" className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
                    <button title="Hành động" aria-label="Hành động" className="px-3 py-1 border border-slate-300 text-slate-700 rounded hover:bg-slate-50 text-sm">2</button>
                    <button title="Hành động" aria-label="Hành động" className="px-3 py-1 border border-slate-300 text-slate-700 rounded hover:bg-slate-50 text-sm">3</button>
                    <button 
                      className="px-3 py-1 border border-slate-300 text-slate-700 rounded hover:bg-slate-50 text-sm"
                      title="Trang sau"
                    >
                      Sau
                    </button>
                  </div>
                </div>
              </>
            )}



            {activeTab === 'sync' && (
              <div className="flex-1 overflow-auto p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-medium text-slate-900">Tổng số lần đồng bộ đợt 3 lần</h3>
                    <button className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" />
                      Làm mới
                    </button>
                  </div>
                </div>

                {/* Sync History Table */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">Thời gian</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">Trạng thái</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">Thêm mới</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">Cập nhật</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">Lỗi</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">Tổng số</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">Thời lượng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-slate-600">
                            <Calendar className="w-3 h-3" />
                            <span>09/12/2025 14:30:25</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                            <CheckCircle className="w-3 h-3" />
                            Thành công
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-blue-600">
                            <ArrowUp className="w-3 h-3" />
                            <span className="font-medium">150</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-900">45</td>
                        <td className="px-4 py-3 text-slate-900">0</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-slate-900">
                            <ArrowUp className="w-3 h-3" />
                            <span className="font-medium">195</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">2.5s</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-slate-600">
                            <Calendar className="w-3 h-3" />
                            <span>09/12/2025 10:15:10</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                            <CheckCircle className="w-3 h-3" />
                            Thành công
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-blue-600">
                            <ArrowUp className="w-3 h-3" />
                            <span className="font-medium">98</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-900">32</td>
                        <td className="px-4 py-3 text-slate-900">0</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-slate-900">
                            <ArrowUp className="w-3 h-3" />
                            <span className="font-medium">130</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">1.8s</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-slate-600">
                            <Calendar className="w-3 h-3" />
                            <span>08/12/2025 18:45:33</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs">
                            <AlertCircle className="w-3 h-3" />
                            Mất phần
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-blue-600">
                            <ArrowUp className="w-3 h-3" />
                            <span className="font-medium">120</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-900">28</td>
                        <td className="px-4 py-3 text-red-600 font-medium">5</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-slate-900">
                            <ArrowUp className="w-3 h-3" />
                            <span className="font-medium">153</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">3.2s</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-slate-600">
                            <Calendar className="w-3 h-3" />
                            <span>08/12/2025 14:20:15</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                            <CheckCircle className="w-3 h-3" />
                            Thành công
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-blue-600">
                            <ArrowUp className="w-3 h-3" />
                            <span className="font-medium">210</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-900">67</td>
                        <td className="px-4 py-3 text-slate-900">0</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-slate-900">
                            <ArrowUp className="w-3 h-3" />
                            <span className="font-medium">277</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">4.1s</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-slate-600">
                            <Calendar className="w-3 h-3" />
                            <span>08/12/2025 10:10:05</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                            <CheckCircle className="w-3 h-3" />
                            Thành công
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-blue-600">
                            <ArrowUp className="w-3 h-3" />
                            <span className="font-medium">88</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-900">19</td>
                        <td className="px-4 py-3 text-slate-900">0</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-slate-900">
                            <ArrowUp className="w-3 h-3" />
                            <span className="font-medium">107</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">1.5s</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">Hiển thị</span>
                      <select 
                        className="px-2 py-1 text-sm border border-slate-300 rounded"
                        title="Số bản ghi trên trang"
                      >
                      <option>10</option>
                      <option>20</option>
                      <option>50</option>
                    </select>
                    <span className="text-sm text-slate-600">bản ghi/trang</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-600">Hiển thị 1-10 / 12 bản ghi</span>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 border border-slate-300 text-slate-700 rounded hover:bg-slate-50 text-sm">
                        Trang 1 / 2
                      </button>
                      <button className="px-3 py-1 bg-slate-700 text-white rounded hover:bg-slate-800 text-sm">
                        Đóng
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[60]" onClick={() => setSelectedRecord(null)} />
          
          {/* Record Detail Modal */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
                <h3 className="text-lg font-semibold text-slate-900">Chi tiết bản ghi</h3>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600"
                  title="Đóng chi tiết"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 overflow-auto">
                {/* Tab: Thông tin hồ sơ */}
                <div className="mb-8">
                <div className="mb-6">
                  <div className="flex flex-col gap-3">
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Mã hồ sơ</div>
                      <div className="text-sm text-slate-900">{selectedRecord.recordCode || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Số đăng ký</div>
                      <div className="text-sm text-slate-900">{selectedRecord.registrationNumber || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Số quyển</div>
                      <div className="text-sm text-slate-900">{selectedRecord.bookNumber || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Trang số</div>
                      <div className="text-sm text-slate-900">{selectedRecord.pageNumber || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded col-span-2">
                      <div className="text-xs text-slate-600 mb-1">Tệp đính kèm</div>
                      <div className="text-sm text-blue-600 hover:underline cursor-pointer">{selectedRecord.fileId || 'Không có tệp đính kèm'}</div>
                    </div>
                  </div>
                </div>
                </div>

                {/* Tab: Thông tin bên chồng */}
                <div className="mb-8">
                <div className="mb-6">
                  <div className="flex flex-col gap-3">
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên chồng</div>
                      <div className="text-sm text-slate-900">{selectedRecord.husbandName}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Ngày, tháng, năm sinh</div>
                      <div className="text-sm text-slate-900">{selectedRecord.husbandBirthDate}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Dân tộc</div>
                      <div className="text-sm text-slate-900">{selectedRecord.husbandEthnicity || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Quốc tịch</div>
                      <div className="text-sm text-slate-900">{selectedRecord.husbandNationality || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded col-span-2">
                      <div className="text-xs text-slate-600 mb-1">Nơi cư trú</div>
                      <div className="text-sm text-slate-900">{selectedRecord.husbandResidence || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Ngày cấp giấy tờ tùy thân</div>
                      <div className="text-sm text-slate-900">{selectedRecord.husbandIdIssueDate || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Nơi cấp giấy tờ tùy thân</div>
                      <div className="text-sm text-slate-900">{selectedRecord.husbandIdIssuePlace || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Số giấy tờ tùy thân</div>
                      <div className="text-sm text-slate-900">{selectedRecord.husbandIdNumber || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Số định danh cá nhân</div>
                      <div className="text-sm text-slate-900">{selectedRecord.husbandPersonalId || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded col-span-2">
                      <div className="text-xs text-slate-600 mb-1">Số lần kết hôn</div>
                      <div className="text-sm text-slate-900">{selectedRecord.husbandMarriageCount || '-'}</div>
                    </div>
                  </div>
                </div>
                </div>

                {/* Tab: Thông tin bên vợ */}
                <div className="mb-8">
                <div className="mb-6">
                  <div className="flex flex-col gap-3">
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Họ, chữ đệm, tên vợ</div>
                      <div className="text-sm text-slate-900">{selectedRecord.wifeName}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Ngày, tháng, năm sinh</div>
                      <div className="text-sm text-slate-900">{selectedRecord.wifeBirthDate}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Dân tộc</div>
                      <div className="text-sm text-slate-900">{selectedRecord.wifeEthnicity || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Quốc tịch</div>
                      <div className="text-sm text-slate-900">{selectedRecord.wifeNationality || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded col-span-2">
                      <div className="text-xs text-slate-600 mb-1">Nơi cư trú</div>
                      <div className="text-sm text-slate-900">{selectedRecord.wifeResidence || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Ngày cấp giấy tờ tùy thân</div>
                      <div className="text-sm text-slate-900">{selectedRecord.wifeIdIssueDate || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Nơi cấp giấy tờ tùy thân</div>
                      <div className="text-sm text-slate-900">{selectedRecord.wifeIdIssuePlace || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Số giấy tờ tùy thân</div>
                      <div className="text-sm text-slate-900">{selectedRecord.wifeIdNumber || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Số định danh cá nhân</div>
                      <div className="text-sm text-slate-900">{selectedRecord.wifePersonalId || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded col-span-2">
                      <div className="text-xs text-slate-600 mb-1">Số lần kết hôn</div>
                      <div className="text-sm text-slate-900">{selectedRecord.wifeMarriageCount || '-'}</div>
                    </div>
                  </div>
                </div>
                </div>

                {/* Tab: Thông tin khác */}
                <div className="mb-8">
                <div className="mb-6">
                  <div className="flex flex-col gap-3">
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Nơi đăng ký</div>
                      <div className="text-sm text-slate-900">{selectedRecord.registrationPlace || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Ngày đăng ký</div>
                      <div className="text-sm text-slate-900">{selectedRecord.registrationDate || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded col-span-2">
                      <div className="text-xs text-slate-600 mb-1">Loại đăng ký</div>
                      <div className="text-sm text-slate-900">{selectedRecord.registrationType || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Số giấy chứng nhận kết hôn do cơ quan nước ngoài cấp</div>
                      <div className="text-sm text-slate-900">{selectedRecord.foreignCertificateNumber || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Ngày cấp giấy chứng nhận kết hôn do cơ quan nước ngoài cấp</div>
                      <div className="text-sm text-slate-900">{selectedRecord.foreignCertificateDate || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Tên cơ quan nước ngoài cấp giấy chứng nhận kết hôn</div>
                      <div className="text-sm text-slate-900">{selectedRecord.foreignAgencyName || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Quốc gia đã cấp giấy chứng nhận kết hôn</div>
                      <div className="text-sm text-slate-900">{selectedRecord.foreignCountry || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Ngày xác lập quan hệ hôn nhân</div>
                      <div className="text-sm text-slate-900">{selectedRecord.marriageDate || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Tình trạng hôn nhân</div>
                      <div className="text-sm text-slate-900">{selectedRecord.marriageStatus || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Người ký</div>
                      <div className="text-sm text-slate-900">{selectedRecord.signerName || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Chức vụ người ký</div>
                      <div className="text-sm text-slate-900">{selectedRecord.signerPosition || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded">
                      <div className="text-xs text-slate-600 mb-1">Người thực hiện</div>
                      <div className="text-sm text-slate-900">{selectedRecord.implementer || '-'}</div>
                    </div>
                    <div className="border border-slate-200 p-2 rounded col-span-2">
                      <div className="text-xs text-slate-600 mb-1">Ghi chú/ghi những nội dung thay đổi sau này</div>
                      <div className="text-sm text-slate-900">{selectedRecord.notes || '-'}</div>
                    </div>
                  </div>
                </div>
                </div>

                {/* Trạng thái lỗi - hiển thị ở tất cả các tab */}
                {selectedRecord.hasError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                    <div className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-red-900 mb-1">Lỗi dữ liệu</div>
                        <div className="text-sm text-red-700">{selectedRecord.errorMessage}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 flex-shrink-0 bg-white">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm"
                >
                  <XCircle className="w-4 h-4" />
                  Đóng
                </button>
                
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
