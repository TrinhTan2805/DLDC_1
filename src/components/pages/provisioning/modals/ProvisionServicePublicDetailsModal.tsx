import React from 'react';
import { X, Copy, Check } from 'lucide-react';

interface ProvisionServicePublicDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: any;
}

export function ProvisionServicePublicDetailsModal({ isOpen, onClose, service }: ProvisionServicePublicDetailsModalProps) {
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [copiedBody, setCopiedBody] = React.useState(false);

  if (!isOpen || !service) return null;

  // Generate high-fidelity details based on selected service
  const apiName = service.code ? `CSDL_${service.code.toUpperCase()}` : 'CSDL_DV_002';
  const dataType = 'INFO';
  const database = service.type === 'Dữ liệu Hộ tịch điện tử' 
    ? 'kho_du_lieu_dung_chung_dan_cu' 
    : 'kho_du_lieu_dung_chung_thi_hanh_an';
  const tableName = service.type === 'Dữ liệu Hộ tịch điện tử' 
    ? 'ho_tich_ca_nhan' 
    : 'thi_hang_an_dan_su';
  
  // Custom high-fidelity mock URL
  const sampleLink = `https://kdls.moj.gov.vn/public/public/api/${service.code || 'DV_002'}`;
  
  const requestBody = JSON.stringify({
    apiName: apiName,
    appKey: "<appKey>"
  }, null, 2);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sampleLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyBody = () => {
    navigator.clipboard.writeText(requestBody);
    setCopiedBody(true);
    setTimeout(() => setCopiedBody(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px] transition-all duration-300">
      {/* Modal card enlarged to max-w-5xl for extra wide screen layout */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Premium White Header as requested */}
        <div className="bg-white px-6 py-5 flex items-center justify-between border-b border-slate-100">
          <h3 className="text-slate-800 font-extrabold text-xl tracking-tight">Thông tin chi tiết API</h3>
          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-50 transition-colors"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal content - High-reliability Flexbox layout (label: 25% width, content: 75% width) to guarantee 100% full stretching */}
        <div className="p-6">
          <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100 w-full">
            
            {/* Tên Api */}
            <div className="flex flex-col md:flex-row items-center bg-white w-full">
              <div className="px-4 py-3 bg-slate-50/50 md:border-r border-slate-200 text-xs font-bold text-slate-700 md:w-1/4 flex items-center shrink-0 self-stretch">
                Tên Api:
              </div>
              <div className="px-4 py-3 flex-1 text-xs font-semibold text-slate-800 font-mono w-full">
                {apiName}
              </div>
            </div>

            {/* Loại dữ liệu trả về */}
            <div className="flex flex-col md:flex-row items-center bg-white w-full">
              <div className="px-4 py-3 bg-slate-50/50 md:border-r border-slate-200 text-xs font-bold text-slate-700 md:w-1/4 flex items-center shrink-0 self-stretch">
                Loại dữ liệu trả về:
              </div>
              <div className="px-4 py-3 flex-1 text-xs text-slate-800 font-bold uppercase w-full">
                {dataType}
              </div>
            </div>

            {/* Cơ sở dữ liệu */}
            <div className="flex flex-col md:flex-row items-center bg-white w-full">
              <div className="px-4 py-3 bg-slate-50/50 md:border-r border-slate-200 text-xs font-bold text-slate-700 md:w-1/4 flex items-center shrink-0 self-stretch">
                Cơ sở dữ liệu:
              </div>
              <div className="px-4 py-3 flex-1 text-xs text-slate-800 w-full">
                {database}
              </div>
            </div>

            {/* Tên bảng */}
            <div className="flex flex-col md:flex-row items-center bg-white w-full">
              <div className="px-4 py-3 bg-slate-50/50 md:border-r border-slate-200 text-xs font-bold text-slate-700 md:w-1/4 flex items-center shrink-0 self-stretch">
                Tên bảng:
              </div>
              <div className="px-4 py-3 flex-1 text-xs text-slate-800 font-mono w-full">
                {tableName}
              </div>
            </div>

            {/* Link mẫu - Wide full width block stretching to the right */}
            <div className="flex flex-col md:flex-row items-center bg-white w-full">
              <div className="px-4 py-3 bg-slate-50/50 md:border-r border-slate-200 text-xs font-bold text-slate-700 md:w-1/4 flex items-center shrink-0 self-stretch">
                Link mẫu:
              </div>
              <div className="px-4 py-3 flex-1 text-xs text-slate-800 flex items-center justify-between gap-4 w-full bg-white">
                <span className="font-mono text-slate-700 break-all select-all flex-1 pr-2 leading-relaxed border border-slate-100 p-2.5 bg-slate-50/30 rounded block w-full">
                  {sampleLink}
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="p-2 text-slate-400 hover:text-amber-600 hover:bg-slate-50 rounded border border-slate-200 transition-all shrink-0"
                  title="Sao chép Link"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Body - Stretches full to the right edge with height of 162px */}
            <div className="flex flex-col md:flex-row items-stretch bg-white w-full">
              <div className="px-4 py-3 bg-slate-50/50 md:border-r border-slate-200 text-xs font-bold text-slate-700 md:w-1/4 flex items-center shrink-0 self-stretch">
                Body:
              </div>
              <div className="px-4 py-3 flex-1 text-xs text-slate-800 flex items-start justify-between gap-4 w-full bg-white">
                <pre 
                  className="font-mono text-slate-800 p-5 bg-slate-50/70 rounded-lg border border-slate-200 flex-1 text-xs leading-loose overflow-x-auto whitespace-pre-wrap break-all block select-all font-semibold w-full"
                  style={{ height: '162px' }}
                >
                  {requestBody}
                </pre>
                <button
                  type="button"
                  onClick={handleCopyBody}
                  className="p-2 text-slate-400 hover:text-amber-600 hover:bg-slate-50 rounded border border-slate-200 transition-all shrink-0 mt-1"
                  title="Sao chép Body payload"
                >
                  {copiedBody ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Loại API */}
            <div className="flex flex-col md:flex-row items-center bg-white w-full">
              <div className="px-4 py-3 bg-slate-50/50 md:border-r border-slate-200 text-xs font-bold text-slate-700 md:w-1/4 flex items-center shrink-0 self-stretch">
                Loại API:
              </div>
              <div className="px-4 py-3 flex-1 text-xs text-slate-800 w-full">
                {service.isPublic ? 'Public' : 'Private'}
              </div>
            </div>

            {/* Trạng thái */}
            <div className="flex flex-col md:flex-row items-center bg-white w-full">
              <div className="px-4 py-3 bg-slate-50/50 md:border-r border-slate-200 text-xs font-bold text-slate-700 md:w-1/4 flex items-center shrink-0 self-stretch">
                Trạng thái:
              </div>
              <div className="px-4 py-3 flex-1 text-xs text-slate-800 flex items-center gap-2 w-full">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                <span className="font-bold text-emerald-600">Kích hoạt</span>
              </div>
            </div>

          </div>

          {/* Bottom actions block with enhanced bold close button - Black text, light gray background as requested */}
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-2.5 bg-[#E4E6EB] hover:bg-[#D8DADF] text-black font-extrabold text-sm rounded-lg shadow-sm hover:shadow hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest border border-slate-300"
            >
              Đóng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
