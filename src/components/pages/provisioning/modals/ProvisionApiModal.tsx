import React, { useState, useEffect } from 'react';
import { X, User, Building2, Phone, Mail, Link, FileText, Eye, Download } from 'lucide-react';

interface ProvisionApiModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiData?: any;
  onSave?: (data: any) => void;
}

export function ProvisionApiModal({ isOpen, onClose, apiData, onSave }: ProvisionApiModalProps) {
  const [selectedServiceCode, setSelectedServiceCode] = useState('');
  const [agencyUnit, setAgencyUnit] = useState('');
  const [targetSystem, setTargetSystem] = useState('');
  
  // Contacts
  const [receiverName, setReceiverName] = useState('');
  const [receiverDept, setReceiverDept] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');

  // API Connection
  const [apiUrl, setApiUrl] = useState('');
  const [docUrl, setDocUrl] = useState('');

  // Times & Status
  const [startDate, setStartDate] = useState('01/05/2026');
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
      agency: 'Bộ Kế hoạch và Đầu tư',
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
      agency: 'UBND Huyện Tiên Du',
      targetSystem: 'Cổng thông tin pháp luật Huyện Tiên Du',
      contactName: 'Lê Văn D',
      dept: 'Phòng Tư pháp Huyện',
      phone: '0988888888',
      email: 'dunglv@tiendu.gov.vn',
      endpoint: 'https://api.dldc.gov.vn/api/v1/phapluat/search',
      doc: 'https://docs.dldc.gov.vn/api/phapluat-v1',
      startDate: '01/04/2026',
      status: 'Tạm ngưng'
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (apiData) {
        setSelectedServiceCode(apiData.code || 'SVC-HOTICH-001');
        setAgencyUnit(apiData.consumerUnit || '');
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
        setStartDate(apiData.time ? apiData.time.split(' ')[0] : '01/05/2026');
        setEndDate(apiData.endDate || '');
        setStatus(apiData.status || 'Đã cung cấp tài liệu');
      } else {
        // Clear forms
        setSelectedServiceCode('');
        setAgencyUnit('');
        setTargetSystem('');
        setReceiverName('');
        setReceiverDept('');
        setReceiverPhone('');
        setReceiverEmail('');
        setApiUrl('');
        setDocUrl('');
        setStartDate('01/05/2026');
        setEndDate('');
        setStatus('Đã cung cấp tài liệu');
      }
    }
  }, [isOpen, apiData]);

  const handleServiceChange = (code: string) => {
    setSelectedServiceCode(code);
    if (serviceDefaults[code]) {
      const s = serviceDefaults[code];
      setAgencyUnit(s.agency);
      setTargetSystem(s.targetSystem);
      setReceiverName(s.contactName);
      setReceiverDept(s.dept);
      setReceiverPhone(s.phone);
      setReceiverEmail(s.email);
      setApiUrl(s.endpoint);
      setDocUrl(s.doc);
      setStartDate(s.startDate);
      setStatus(s.status);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        consumerUnit: agencyUnit,
        receiverPoint: `${receiverName} - ${receiverPhone}`,
        receiverDept,
        receiverEmail,
        docUrl,
        time: `${startDate} 08:00:00`,
        endDate
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300 text-slate-800">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col border border-slate-200 overflow-hidden max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900">
            {apiData ? 'Cập nhật cấu hình API cung cấp' : 'Tạo mới API cung cấp'}
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
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-semibold cursor-pointer"
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

          {/* Agency Dropdown */}
          <div>
            <label className="block font-medium text-slate-700 mb-1.5">Cơ quan/Đơn vị nhận <span className="text-red-500">*</span></label>
            <select
              required
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-semibold cursor-pointer"
              value={agencyUnit}
              onChange={(e) => setAgencyUnit(e.target.value)}
            >
              <option value="">-- Chọn cơ quan/đơn vị nhận --</option>
              <option value="Bộ Kế hoạch và Đầu tư">Bộ Kế hoạch và Đầu tư</option>
              <option value="Sở Tài chính tỉnh Bắc Ninh">Sở Tài chính tỉnh Bắc Ninh</option>
              <option value="Sở Tư pháp tỉnh Bắc Ninh">Sở Tư pháp tỉnh Bắc Ninh</option>
              <option value="UBND Huyện Tiên Du">UBND Huyện Tiên Du</option>
            </select>
          </div>

          {/* Target System */}
          <div>
            <label className="block font-medium text-slate-700 mb-1.5">Hệ thống đích tích hợp API</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
              placeholder="Nhập tên hệ thống đích tích hợp..."
              value={targetSystem}
              onChange={(e) => setTargetSystem(e.target.value)}
            />
          </div>

          {/* Section: Contacts */}
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Thông tin Đầu mối tiếp nhận</h3>
            
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
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
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
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
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
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-mono"
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
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-mono"
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
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-mono"
                placeholder="https://api.dldc.gov.vn/api/v1/hotich/search"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
              />
            </div>
          </div>

          {/* Document URL */}
          <div>
            <label className="block font-medium text-slate-700 mb-1.5">Tài liệu API chia sẻ</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FileText className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-blue-600 font-medium font-mono"
                  placeholder="https://docs.dldc.gov.vn/api/hotich-v1"
                  value={docUrl}
                  onChange={(e) => setDocUrl(e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => window.open(docUrl || '#', '_blank')}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer text-slate-600"
                title="Xem trực tuyến"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => window.open(docUrl || '#', '_blank')}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer text-slate-600"
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
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-mono"
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
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-mono"
                  placeholder="dd/mm/yyyy"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              {/* Status */}
              <div className="md:col-span-2">
                <label className="block font-medium text-slate-700 mb-1.5">Trạng thái</label>
                <select
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-semibold cursor-pointer"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Đã cung cấp tài liệu">Đã cung cấp tài liệu</option>
                  <option value="Chưa cung cấp tài liệu">Chưa cung cấp tài liệu</option>
                  <option value="Tạm ngưng">Tạm ngưng</option>
                </select>
              </div>
            </div>
          </div>

        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3 bg-slate-50">
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
        </div>

      </div>
    </div>
  );
}
