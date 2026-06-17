import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Building2, Phone, Mail, Link, FileText, Eye, Download, Upload } from 'lucide-react';

const getTodayFormatted = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
};

interface ProvisionApiModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiData?: any;
  onSave?: (data: any) => void;
  mode?: 'view' | 'edit';
}

export function ProvisionApiModal({ isOpen, onClose, apiData, onSave, mode = 'edit' }: ProvisionApiModalProps) {
  const isViewMode = mode === 'view';
  const [selectedServiceCode, setSelectedServiceCode] = useState('');
  const [agencyUnits, setAgencyUnits] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [targetSystem, setTargetSystem] = useState('');
  
  // Contacts
  const [receiverName, setReceiverName] = useState('');
  const [receiverDept, setReceiverDept] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');

  // API Connection
  const [apiUrl, setApiUrl] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [docFile, setDocFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Times & Status
  const [startDate, setStartDate] = useState(getTodayFormatted());
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('Đã cung cấp tài liệu');

  const serviceDefaults: Record<string, {
    name: string;
    agency: string;
    targetSystem: string;
    contactName: string;
    dept: string;
    phone: string;
    email: string;
    endpoint: string;
    doc: string;
    startDate: string;
    status: string;
  }> = {
    'SVC-HOTICH-001': {
      name: 'API cung cấp dữ liệu Hộ tịch điện tử',
      agency: 'Bộ Kế hoạch và Đầu tư, Sở Tài chính tỉnh Bắc Ninh',
      targetSystem: 'Hệ thống Thông tin Quốc gia về Đăng ký Doanh nghiệp',
      contactName: 'Trần Văn Đạo',
      dept: 'Cục Quản lý Đăng ký Kinh doanh',
      phone: '0912345678',
      email: 'daotv@mpi.gov.vn',
      endpoint: 'https://api.dldc.gov.vn/api/v1/hotich/search',
      doc: 'https://docs.dldc.gov.vn/api/hotich-v1',
      startDate: '01/05/2026',
      status: 'Đã cung cấp tài liệu'
    },
    'SVC-THADS-002': {
      name: 'API đồng bộ dữ liệu thi hành án dân sự',
      agency: 'Sở Tài chính tỉnh Bắc Ninh',
      targetSystem: 'Hệ thống Quản lý Ngân sách và Tài chính',
      contactName: 'Trần Thị B',
      dept: 'Phòng Kế hoạch Tài chính',
      phone: '0912345678',
      email: 'thuybt@bacninh.gov.vn',
      endpoint: 'https://api.dldc.gov.vn/api/v1/thads/sync',
      doc: 'https://docs.dldc.gov.vn/api/thads-v2',
      startDate: '15/05/2026',
      status: 'Đã cung cấp tài liệu'
    },
    'SVC-BPBD-003': {
      name: 'API đọc thông tin Biện pháp bảo đảm',
      agency: 'Sở Tư pháp tỉnh Bắc Ninh',
      targetSystem: 'Hệ thống Thông tin Đăng ký Giao dịch Bảo đảm',
      contactName: 'Phạm Văn C',
      dept: 'Phòng Hành chính Tư pháp',
      phone: '0901234567',
      email: 'copv@bacninh.gov.vn',
      endpoint: 'https://api.dldc.gov.vn/api/v1/bpbd/get',
      doc: 'https://docs.dldc.gov.vn/api/bpbd-v1',
      startDate: '20/05/2026',
      status: 'Đã cung cấp tài liệu'
    },
    'SVC-PHAPLUAT-004': {
      name: 'API tra cứu Cơ sở dữ liệu Pháp luật',
      agency: 'Sở Thông tin và Truyền thông tỉnh Bắc Ninh',
      targetSystem: 'Hệ thống Quản lý Văn bản và Điều hành',
      contactName: 'Lê Văn D',
      dept: 'Phòng Công nghệ thông tin',
      phone: '0988888888',
      email: 'dunglv@bacninh.gov.vn',
      endpoint: 'https://api.dldc.gov.vn/api/v1/phapluat/search',
      doc: 'https://docs.dldc.gov.vn/api/phapluat-v1',
      startDate: '01/04/2026',
      status: 'Tạm ngưng'
    }
  };

  const agencyOptions = [
    'Bộ Kế hoạch và Đầu tư',
    'Sở Tài chính tỉnh Bắc Ninh',
    'Sở Tư pháp tỉnh Bắc Ninh',
    'Sở Thông tin và Truyền thông tỉnh Bắc Ninh'
  ];

  useEffect(() => {
    if (isOpen) {
      if (apiData) {
        setSelectedServiceCode(apiData.code || 'SVC-HOTICH-001');
        const units = apiData.consumerUnit
          ? apiData.consumerUnit.split(',').map((u: string) => u.trim()).filter(Boolean)
          : [];
        setAgencyUnits(units);
        setTargetSystem(apiData.targetSystem || 'Hệ thống Thông tin Quốc gia về Đăng ký Doanh nghiệp');
        
        // Parse contact details
        const receiverStr = apiData.receiverPoint || '';
        const nameParts = receiverStr.split(' - ');
        setReceiverName(nameParts[0] || '');
        setReceiverPhone(nameParts[1] || '');
        setReceiverDept(apiData.receiverDept || 'Cục Quản lý Đăng ký Kinh doanh');
        setReceiverEmail(apiData.receiverEmail || 'daotv@mpi.gov.vn');

        setApiUrl(apiData.endpoint ? `https://api.dldc.gov.vn${apiData.endpoint}` : '');
        setDocUrl(apiData.docUrl || 'https://docs.dldc.gov.vn/api/hotich-v1');
        setStartDate(apiData.time ? apiData.time.split(' ')[0] : getTodayFormatted());
        setEndDate(apiData.endDate || '');
        setStatus(apiData.status || 'Đã cung cấp tài liệu');
      } else {
        // Clear forms
        setSelectedServiceCode('');
        setAgencyUnits([]);
        setTargetSystem('');
        setReceiverName('');
        setReceiverDept('');
        setReceiverPhone('');
        setReceiverEmail('');
        setApiUrl('');
        setDocUrl('');
        setDocFile(null);
        setStartDate(getTodayFormatted());
        setEndDate('');
        setStatus('Đã cung cấp tài liệu');
      }
      setIsDropdownOpen(false);
    }
  }, [isOpen, apiData]);

  const handleServiceChange = (code: string) => {
    setSelectedServiceCode(code);
    
    // Check localStorage first
    const savedServices = localStorage.getItem('provision_services');
    if (savedServices) {
      try {
        const parsed = JSON.parse(savedServices);
        if (Array.isArray(parsed)) {
          const found = parsed.find(s => s.code === code);
          if (found) {
            const units = found.consumerUnit
              ? found.consumerUnit.split(',').map((u: string) => u.trim()).filter(Boolean)
              : [];
            setAgencyUnits(units);
            setStatus(found.status === 'published' ? 'Đã cung cấp tài liệu' : 'Chưa cung cấp tài liệu');
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (serviceDefaults[code]) {
      const s = serviceDefaults[code];
      setAgencyUnits(s.agency ? s.agency.split(',').map((u: string) => u.trim()).filter(Boolean) : []);
      setStatus(s.status);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (agencyUnits.length === 0) {
      alert('Vui lòng chọn ít nhất một cơ quan/đơn vị nhận!');
      return;
    }
    if (onSave) {
      const selectedService = serviceDefaults[selectedServiceCode];
      
      // Clean endpoint path from full URL
      let cleanEndpoint = apiUrl;
      if (apiUrl.startsWith('https://api.dldc.gov.vn')) {
        cleanEndpoint = apiUrl.replace('https://api.dldc.gov.vn', '');
      }

      onSave({
        ...apiData,
        code: selectedServiceCode || 'SVC-HOTICH-001',
        name: selectedService ? selectedService.name : 'API Cung cấp Mới',
        endpoint: cleanEndpoint,
        method: selectedServiceCode === 'SVC-THADS-002' || selectedServiceCode === 'SVC-KETHON-002' || selectedServiceCode === 'SVC-KHAITU-004' ? 'POST' : 'GET',
        version: apiData?.version || 'v1.0',
        status: status,
        consumerUnit: agencyUnits.join(', '),
        receiverPoint: `${receiverName} - ${receiverPhone}`,
        receiverDept,
        receiverEmail,
        docUrl: docFile ? docFile.name : docUrl,
        time: `${startDate} 08:00:00`,
        endDate
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div style={{ zIndex: 999999 }} className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 transition-all duration-300 text-slate-800 provision-api-modal-root">
      <style dangerouslySetInnerHTML={{__html: `
        .provision-api-modal-root *:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(svg):not(path):not(circle):not(rect):not(polyline):not(line) {
          font-size: 13px !important;
        }
      `}} />
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col border border-slate-200 overflow-hidden max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900">
            {isViewMode ? 'Chi tiết API cung cấp' : (apiData ? 'Cập nhật cấu hình API cung cấp' : 'Tạo mới API cung cấp')}
          </h2>
          <button title="Đóng" aria-label="Đóng"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar text-sm">
          
          {/* Service Dropdown */}
          <div>
            <label className="block font-medium text-slate-700 mb-1.5">Dịch vụ API được cấp <span className="text-red-500">*</span></label>
            <select
              required
              disabled={isViewMode}
              className={`w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-semibold ${isViewMode ? 'bg-slate-50 cursor-not-allowed' : 'bg-white cursor-pointer'}`}
              value={selectedServiceCode}
              onChange={(e) => handleServiceChange(e.target.value)}
            >
              <option value="">-- Chọn dịch vụ API --</option>
              <option value="SVC-HOTICH-001">API cung cấp dữ liệu Hộ tịch điện tử</option>
              <option value="SVC-THADS-002">API đồng bộ dữ liệu thi hành án dân sự</option>
              <option value="SVC-BPBD-003">API đọc thông tin Biện pháp bảo đảm</option>
              <option value="SVC-PHAPLUAT-004">API tra cứu Cơ sở dữ liệu Pháp luật</option>
            </select>
          </div>

          {/* Agency Multi-select (Combobox) -> Changed to Read-only Badge list */}
          <div>
            <label className="block font-medium text-slate-700 mb-1.5">Cơ quan/Đơn vị nhận <span className="text-red-500">*</span></label>
            <div 
              className="w-full min-h-[42px] px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg flex flex-wrap gap-1.5 items-center cursor-not-allowed select-none opacity-90"
            >
              {agencyUnits.length === 0 ? (
                <span className="text-slate-400 text-[13px] pl-1">-- Vui lòng chọn dịch vụ API phía trên --</span>
              ) : (
                agencyUnits.map(unit => (
                  <span 
                    key={unit} 
                    className="inline-flex items-center bg-slate-200 text-slate-700 text-[12px] font-semibold px-2.5 py-0.5 rounded-md border border-slate-300"
                  >
                    {unit}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Target System */}
          <div>
            <label className="block font-medium text-slate-700 mb-1.5">Hệ thống đích tích hợp API</label>
            <input
              type="text"
              disabled={isViewMode}
              className={`w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 ${isViewMode ? 'bg-slate-50 cursor-not-allowed' : 'bg-white'}`}
              placeholder="Nhập tên hệ thống đích tích hợp..."
              value={targetSystem}
              onChange={(e) => setTargetSystem(e.target.value)}
            />
          </div>

          {/* Section: Contacts */}
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Thông tin Đầu mối chủ quản dữ liệu</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Receiver Name */}
              <div>
                <label className="block font-medium text-slate-700 mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    disabled={isViewMode}
                    className={`w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 ${isViewMode ? 'bg-slate-50 cursor-not-allowed' : 'bg-white'}`}
                    placeholder="Trần Văn Đạo"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                  />
                </div>
              </div>

              {/* Receiver Dept */}
              <div>
                <label className="block font-medium text-slate-700 mb-1.5">Phòng / Đơn vị công tác</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    disabled={isViewMode}
                    className={`w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 ${isViewMode ? 'bg-slate-50 cursor-not-allowed' : 'bg-white'}`}
                    placeholder="Cục Quản lý Đăng ký Kinh doanh"
                    value={receiverDept}
                    onChange={(e) => setReceiverDept(e.target.value)}
                  />
                </div>
              </div>

              {/* Receiver Phone */}
              <div>
                <label className="block font-medium text-slate-700 mb-1.5">Số điện thoại</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    disabled={isViewMode}
                    className={`w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-mono ${isViewMode ? 'bg-slate-50 cursor-not-allowed' : 'bg-white'}`}
                    placeholder="0912345678"
                    value={receiverPhone}
                    onChange={(e) => setReceiverPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Receiver Email */}
              <div>
                <label className="block font-medium text-slate-700 mb-1.5">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    disabled={isViewMode}
                    className={`w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-mono ${isViewMode ? 'bg-slate-50 cursor-not-allowed' : 'bg-white'}`}
                    placeholder="daotv@mpi.gov.vn"
                    value={receiverEmail}
                    onChange={(e) => setReceiverEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* URL Endpoint */}
          <div>
            <label className="block font-medium text-slate-700 mb-1.5">URL Endpoint cung cấp dữ liệu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Link className="w-4 h-4" />
              </div>
              <input
                type="text"
                disabled={isViewMode}
                className={`w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-mono ${isViewMode ? 'bg-slate-50 cursor-not-allowed' : 'bg-white'}`}
                placeholder="https://api.dldc.gov.vn/api/v1/hotich/search"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
              />
            </div>
          </div>

          {/* Document File / URL */}
          <div>
            <label className="block font-medium text-slate-700 mb-1.5">Tài liệu API chia sẻ</label>
            <div className="flex gap-2">
              <div 
                className="relative flex-1 cursor-pointer group"
                onClick={() => { if (!isViewMode) fileInputRef.current?.click(); }}
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 group-hover:text-blue-500 transition-colors">
                  <FileText className="w-4 h-4" />
                </div>
                <div className={`w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium truncate min-h-[42px] flex items-center ${isViewMode ? 'bg-slate-50 cursor-not-allowed' : 'bg-white group-hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20'}`}>
                  {docFile ? docFile.name : (docUrl || 'Nhấn để đính kèm file tài liệu hướng dẫn...')}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setDocFile(e.target.files[0]);
                      setDocUrl('');
                    }
                  }}
                />
              </div>
              <button
                type="button"
                disabled={isViewMode}
                onClick={() => { if (!isViewMode) fileInputRef.current?.click(); }}
                className={`px-3 py-2 border border-slate-300 rounded-lg transition-colors text-slate-600 ${isViewMode ? 'bg-slate-50 cursor-not-allowed opacity-50' : 'bg-slate-100 hover:bg-slate-200 cursor-pointer'}`}
                title="Đính kèm tài liệu"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (docFile) {
                    const url = URL.createObjectURL(docFile);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = docFile.name;
                    a.click();
                    URL.revokeObjectURL(url);
                  } else if (docUrl) {
                    window.open(docUrl, '_blank');
                  }
                }}
                disabled={!docFile && !docUrl}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Tải về tài liệu"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Section: Status & Times */}
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Thời gian & Trạng thái</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label className="block font-medium text-slate-700 mb-1.5">Ngày bắt đầu hiệu lực <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  disabled={isViewMode}
                  className={`w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-mono ${isViewMode ? 'bg-slate-50 cursor-not-allowed' : 'bg-white'}`}
                  placeholder="dd/mm/yyyy"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block font-medium text-slate-700 mb-1.5">Ngày kết thúc hiệu lực</label>
                <input
                  type="text"
                  disabled={isViewMode}
                  className={`w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-mono ${isViewMode ? 'bg-slate-50 cursor-not-allowed' : 'bg-white'}`}
                  placeholder="dd/mm/yyyy"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3 bg-slate-50">
          {isViewMode ? (
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-bold cursor-pointer shadow-md text-[13px]"
            >
              Đóng
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition-colors font-bold cursor-pointer shadow-md"
              >
                Lưu cấu hình
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  , document.body);
}
