import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, History, GitCompare } from 'lucide-react';
import { Badge, BTN_GHOST_ICON, ROW_ICON_BTN } from '../../collection/collectionUi';
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

  const TH = 'px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px]';
  const TD = 'px-3 py-1 text-left text-[13px] text-black';

  return createPortal(
    <div style={{ zIndex: 999999 }} className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl flex flex-col overflow-hidden max-h-[90vh] animate-in zoom-in-95 duration-200">

        {/* Header (mục 5.4) */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-blue-50 rounded-lg shrink-0">
              <History className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-[16px] font-medium text-[#020817] leading-6">
                Lịch sử phiên bản
              </h2>
              <p className="text-[13px] text-[#64748B] truncate">API: {apiData?.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={BTN_GHOST_ICON}
            aria-label="Đóng"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4">
          <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse collection-table text-[13px]">
                <thead className="bg-[#F8FAFC]">
                  <tr className="h-[42px]">
                    <th className={TH}>Dịch vụ API</th>
                    <th className={TH}>Phiên bản</th>
                    <th className={TH}>Người cập nhật</th>
                    <th className={TH}>Ngày phát hành</th>
                    <th className={TH}>Ghi chú thay đổi</th>
                    <th className={TH}>Trạng thái</th>
                    <th className={`${TH} text-center`}>So sánh phiên bản</th>
                  </tr>
                </thead>
                <tbody>
                  {versions.map((ver, index) => {
                    const [d, t] = formatDateTime(ver.releaseDate).split(' ');
                    return (
                      <tr key={ver.id} className="h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                        <td className={`${TD} whitespace-nowrap`}>{ver.apiName}</td>
                        <td className={`${TD} whitespace-nowrap`}>{ver.id}</td>
                        <td className={`${TD} whitespace-nowrap`}>{ver.createdBy}</td>
                        <td className={`${TD} whitespace-nowrap leading-[18px]`}>
                          <div>{d}</div>
                          {t && <div className="text-[#64748B]">{t}</div>}
                        </td>
                        <td className={`${TD} max-w-[360px] leading-[18px] whitespace-pre-wrap`}>{ver.note}</td>
                        <td className={TD}>
                          <Badge label={ver.status} variant={ver.status === 'Kích hoạt' ? 'green' : 'slate'} />
                        </td>
                        <td className={`${TD} text-center`}>
                          {/* Modal z-index 999999 cao hơn lớp tooltip chung (z-300) → dùng title thay tooltip */}
                          <button
                            type="button"
                            onClick={() => handleViewDiff(index)}
                            className={ROW_ICON_BTN}
                            aria-label="Xem chi tiết"
                            title="Xem chi tiết"
                          >
                            <GitCompare className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
  , document.body);
}
