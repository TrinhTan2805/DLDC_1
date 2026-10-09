import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Building2, Phone, Mail, Link, FileText, Eye, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Badge, BTN_GHOST_ICON, BTN_OUTLINE, BTN_PRIMARY, INPUT_CLS as BASE_INPUT_CLS, VIEW_FIELD_CLS, LABEL_CLS, REQUIRED_MARK, SECTION_TITLE } from '../../collection/collectionUi';
// Ô nhập chuẩn + quy tắc ô bị khóa ở màn Xem chi tiết (giá trị đen, placeholder xám)
const INPUT_CLS = `${BASE_INPUT_CLS} ${VIEW_FIELD_CLS}`;

const ICON_INPUT_CLS = INPUT_CLS + ' pl-9';
const INPUT_ICON_WRAP = 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]';
const ICON_BTN_CLS = BTN_OUTLINE + ' w-10 px-0 shrink-0';

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
      toast.error('Vui lòng chọn ít nhất một cơ quan/đơn vị nhận!');
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
    <div style={{ zIndex: 999999 }} className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center gap-4">
          <h2 className="text-[16px] font-semibold text-[#020817]">
            {isViewMode ? 'Chi tiết API cung cấp' : (apiData ? 'Cập nhật cấu hình API cung cấp' : 'Tạo mới API cung cấp')}
          </h2>
          <button type="button" title="Đóng" aria-label="Đóng" onClick={onClose} className={BTN_GHOST_ICON}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar text-[13px] text-[#020817]">

          {/* Service Dropdown */}
          <div>
            <label className={LABEL_CLS}>Dịch vụ API được cấp <span className={REQUIRED_MARK}>*</span></label>
            <select
              required
              disabled={isViewMode}
              className={`${INPUT_CLS} ${isViewMode ? '' : 'cursor-pointer'}`}
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
            <label className={LABEL_CLS}>Cơ quan/Đơn vị nhận <span className={REQUIRED_MARK}>*</span></label>
            <div className="w-full min-h-10 px-3 py-[6px] bg-[#F0F0F0] border border-[rgba(0,0,0,0.26)] rounded-lg flex flex-wrap gap-1.5 items-center cursor-not-allowed select-none">
              {agencyUnits.length === 0 ? (
                <span className="text-[#94A3B8] text-[13px]">-- Vui lòng chọn dịch vụ API phía trên --</span>
              ) : (
                agencyUnits.map(unit => (
                  <span key={unit} className="inline-flex items-center h-[26px] px-2 rounded-2xl border border-[rgba(0,0,0,0.26)] bg-white text-[13px] text-[#000000] whitespace-nowrap">{unit}</span>
                ))
              )}
            </div>
          </div>

          {/* Target System */}
          <div>
            <label className={LABEL_CLS}>Hệ thống đích tích hợp API</label>
            <input
              type="text"
              disabled={isViewMode}
              className={INPUT_CLS}
              placeholder="Nhập tên hệ thống đích tích hợp..."
              value={targetSystem}
              onChange={(e) => setTargetSystem(e.target.value)}
            />
          </div>

          {/* Section: Contacts */}
          <div className="rounded-2xl border border-[#E2E8F0] p-4">
            <h3 className={SECTION_TITLE}>Thông tin Đầu mối chủ quản dữ liệu</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Receiver Name */}
              <div>
                <label className={LABEL_CLS}>Họ và tên <span className={REQUIRED_MARK}>*</span></label>
                <div className="relative">
                  <div className={INPUT_ICON_WRAP}>
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    disabled={isViewMode}
                    className={ICON_INPUT_CLS}
                    placeholder="Trần Văn Đạo"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                  />
                </div>
              </div>

              {/* Receiver Dept */}
              <div>
                <label className={LABEL_CLS}>Phòng / Đơn vị công tác</label>
                <div className="relative">
                  <div className={INPUT_ICON_WRAP}>
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    disabled={isViewMode}
                    className={ICON_INPUT_CLS}
                    placeholder="Cục Quản lý Đăng ký Kinh doanh"
                    value={receiverDept}
                    onChange={(e) => setReceiverDept(e.target.value)}
                  />
                </div>
              </div>

              {/* Receiver Phone */}
              <div>
                <label className={LABEL_CLS}>Số điện thoại</label>
                <div className="relative">
                  <div className={INPUT_ICON_WRAP}>
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    disabled={isViewMode}
                    className={ICON_INPUT_CLS}
                    placeholder="0912345678"
                    value={receiverPhone}
                    onChange={(e) => setReceiverPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Receiver Email */}
              <div>
                <label className={LABEL_CLS}>Email</label>
                <div className="relative">
                  <div className={INPUT_ICON_WRAP}>
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    disabled={isViewMode}
                    className={ICON_INPUT_CLS}
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
            <label className={LABEL_CLS}>URL Endpoint cung cấp dữ liệu</label>
            <div className="relative">
              <div className={INPUT_ICON_WRAP}>
                <Link className="w-4 h-4" />
              </div>
              <input
                type="text"
                disabled={isViewMode}
                className={ICON_INPUT_CLS}
                placeholder="https://api.dldc.gov.vn/api/v1/hotich/search"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
              />
            </div>
          </div>

          {/* Document File / URL */}
          <div>
            <label className={LABEL_CLS}>Tài liệu API chia sẻ</label>
            <div className="flex gap-2">
              <div
                className={`relative flex-1 min-w-0 group ${isViewMode ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => { if (!isViewMode) fileInputRef.current?.click(); }}
              >
                <div className={`${INPUT_ICON_WRAP} transition-colors ${isViewMode ? '' : 'group-hover:text-blue-600'}`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div className={`w-full h-10 pl-9 pr-3 border rounded-lg text-[13px] flex items-center ${isViewMode ? 'bg-[#F0F0F0] border-[rgba(0,0,0,0.26)]' : 'bg-white border-[#E2E8F0] group-hover:border-[#94A3B8]'} ${(docFile || docUrl) ? (isViewMode ? 'text-[#000000]' : 'text-[#020817]') : 'text-[#94A3B8]'}`}>
                  <span className="truncate">{docFile ? docFile.name : (docUrl || 'Nhấn để đính kèm file tài liệu hướng dẫn...')}</span>
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
                className={ICON_BTN_CLS}
                title="Đính kèm tài liệu"
                aria-label="Đính kèm tài liệu"
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
                className={ICON_BTN_CLS}
                title="Tải về tài liệu"
                aria-label="Tải về tài liệu"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Section: Status & Times */}
          <div className="rounded-2xl border border-[#E2E8F0] p-4">
            <h3 className={SECTION_TITLE}>Thời gian & Trạng thái</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label className={LABEL_CLS}>Ngày bắt đầu hiệu lực <span className={REQUIRED_MARK}>*</span></label>
                <input
                  type="text"
                  required
                  disabled={isViewMode}
                  className={INPUT_CLS}
                  placeholder="dd/mm/yyyy"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              {/* End Date */}
              <div>
                <label className={LABEL_CLS}>Ngày kết thúc hiệu lực</label>
                <input
                  type="text"
                  disabled={isViewMode}
                  className={INPUT_CLS}
                  placeholder="dd/mm/yyyy"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
          {isViewMode ? (
            <button type="button" onClick={onClose} className={BTN_OUTLINE}>
              Đóng
            </button>
          ) : (
            <>
              <button type="button" onClick={onClose} className={BTN_OUTLINE}>
                Hủy bỏ
              </button>
              <button type="button" onClick={handleSubmit} className={BTN_PRIMARY}>
                Lưu cấu hình
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  , document.body);
}
