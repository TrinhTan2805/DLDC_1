import React, { useState } from 'react';
import { X, History, Calendar } from 'lucide-react';
import { ApiVersionCompareModal } from './ApiVersionCompareModal';

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '';
  if (/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/.test(dateStr)) return dateStr;
  const spaceSplit = dateStr.split(' ');
  if (spaceSplit.length === 2) {
    const [dStr, tStr] = spaceSplit;
    const dParts = dStr.split('-');
    if (dParts.length === 3) {
      return `${dParts[2]}/${dParts[1]}/${dParts[0]} ${tStr}`;
    }
  }
  const parts = dateStr.split('-');
  if (parts.length === 3 && !dateStr.includes('T') && !dateStr.includes(' ')) {
    return `${parts[2]}/${parts[1]}/${parts[0]} 08:00:00`;
  }
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      const s = String(d.getSeconds()).padStart(2, '0');
      return `${day}/${month}/${year} ${h}:${m}:${s}`;
    }
  } catch (e) { }
  return dateStr;
};

interface ProvisionVersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiData: any;
}

export function ProvisionVersionHistoryModal({ isOpen, onClose, apiData }: ProvisionVersionHistoryModalProps) {
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareVersions, setCompareVersions] = useState({ verA: 'v1.2', verB: 'v1.1' });

  // Mock versions data based on the API
  const versions = [
    { id: 'v1.2', apiName: apiData?.name || 'Lấy danh sách Hộ tịch', createdBy: 'Admin Hệ thống', releaseDate: '2026-05-04 08:00:00', note: 'Cập nhật định dạng ngày sinh ISO 8601 và thêm trường quốc tịch', status: 'Kích hoạt' },
    { id: 'v1.1', apiName: apiData?.name || 'Lấy danh sách Hộ tịch', createdBy: 'Admin Hệ thống', releaseDate: '2026-03-10 10:30:00', note: 'Tối ưu hiệu năng truy vấn liên kết 3 bảng chính', status: 'Lưu trữ' },
    { id: 'v1.0', apiName: apiData?.name || 'Lấy danh sách Hộ tịch', createdBy: 'Hệ thống tự động', releaseDate: '2026-01-15 15:45:00', note: 'Bản phát hành đầu tiên công khai', status: 'Lưu trữ' }
  ];

  const handleViewDiff = (index: number) => {
    const verA = versions[index].id;
    let verB;
    if (index < versions.length - 1) {
      verB = versions[index + 1].id;
    } else {
      verB = 'Khởi tạo';
    }
    setCompareVersions({ verA, verB });
    setShowCompareModal(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-7xl flex flex-col border border-slate-200 overflow-hidden max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-sky-100 text-sky-600 rounded-lg">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Lịch sử phiên bản
              </h2>
              <p className="text-xs text-slate-500 font-medium">API: {apiData?.name}</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs border-b border-slate-200 uppercase tracking-wider whitespace-nowrap">
                  <th className="py-3 px-4 font-bold">Dịch vụ API</th>
                  <th className="py-3 px-4 font-bold">Phiên bản</th>
                  <th className="py-3 px-4 font-bold">Người cập nhật</th>
                  <th className="py-3 px-4 font-bold">Ngày phát hành</th>
                  <th className="py-3 px-4 font-bold">Ghi chú thay đổi</th>
                  <th className="py-3 px-4 font-bold">Trạng thái</th>
                  <th className="py-3 px-4 font-bold text-center">So sánh phiên bản</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {versions.map((ver, index) => (
                  <tr key={ver.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-slate-800 whitespace-nowrap">{ver.apiName}</td>
                    <td className="py-4 px-4">
                      <span className="font-mono text-xs font-extrabold text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded border border-indigo-100 whitespace-nowrap">
                        {ver.id}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-700 font-medium whitespace-nowrap">{ver.createdBy}</td>
                    <td className="py-4 px-4 text-slate-600 text-xs">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{formatDateTime(ver.releaseDate)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-500 text-xs max-w-sm leading-relaxed whitespace-pre-wrap">{ver.note}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap ${ver.status === 'Kích hoạt' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                        {ver.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleViewDiff(index)}
                        className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded font-bold text-xs transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ApiVersionCompareModal
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        apiName={apiData?.name || 'Lấy danh sách Hộ tịch'}
        versionA={compareVersions.verA}
        versionB={compareVersions.verB}
      />
    </div>
  );
}
