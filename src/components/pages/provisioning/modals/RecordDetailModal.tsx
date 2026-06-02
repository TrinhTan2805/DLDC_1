import React from 'react';
import { X } from 'lucide-react';

interface RecordDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordData: any; // We can type this strictly later if needed
}

export function RecordDetailModal({ isOpen, onClose, recordData }: RecordDetailModalProps) {
  if (!isOpen || !recordData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl border border-slate-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Chi tiết bản ghi</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Block 1 */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold text-slate-700 mb-1">Mã hồ sơ</p>
                <p className="text-sm text-slate-900">{recordData.maHoSo || 'XN-2023-001234'}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 mb-1">Số đăng ký</p>
                <p className="text-sm text-slate-900">{recordData.soDangKy || '001234/2023'}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 mb-1">Trang số</p>
                <p className="text-sm text-slate-900">{recordData.trangSo || '15'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold text-slate-700 mb-1">Tệp đính kèm</p>
                <p className="text-sm text-blue-600 font-medium cursor-pointer hover:underline">{recordData.tepDinhKem || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 mb-1">Số quyển</p>
                <p className="text-sm text-slate-900">{recordData.soQuyen || '1'}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 mb-1">Họ, chữ đệm, tên người được cấp</p>
                <p className="text-sm text-slate-900">{recordData.nguoiDuocCap || 'Nguyễn Văn Nam'}</p>
              </div>
            </div>

            <div className="col-span-2 border-t border-slate-100 my-2"></div>

            {/* Block 2 */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold text-slate-700 mb-1">Giới tính</p>
                <p className="text-sm text-slate-900">{recordData.gioiTinh || 'Nam'}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 mb-1">Nơi sinh</p>
                <p className="text-sm text-slate-900">{recordData.noiSinh || 'Hà Nội'}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 mb-1">Quốc tịch</p>
                <p className="text-sm text-slate-900">{recordData.quocTich || 'Việt Nam'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold text-slate-700 mb-1">Ngày, tháng, năm sinh</p>
                <p className="text-sm text-slate-900">{recordData.ngaySinh || '15/03/1990'}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 mb-1">Dân tộc</p>
                <p className="text-sm text-slate-900">{recordData.danToc || 'Kinh'}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 mb-1">Số GTTT</p>
                <p className="text-sm text-slate-900">{recordData.soGTTT || '001090001234'}</p>
              </div>
            </div>

            <div className="col-span-2 border-t border-slate-100 my-2"></div>

            {/* Block 3 */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold text-slate-700 mb-1">Ngày cấp GTTT</p>
                <p className="text-sm text-slate-900">{recordData.ngayCapGTTT || '01/01/2015'}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 mb-1">Số định danh cá nhân</p>
                <p className="text-sm text-slate-900">{recordData.soDinhDanh || '001090001234'}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 mb-1">Từ ngày</p>
                <p className="text-sm text-slate-900">{recordData.tuNgay || '01/01/2000'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold text-slate-700 mb-1">Nơi cấp GTTT</p>
                <p className="text-sm text-slate-900">{recordData.noiCapGTTT || 'Cục Cảnh sát QLHC về TTXH'}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 mb-1">Trong thời gian cư trú tại</p>
                <p className="text-sm text-slate-900">{recordData.thuongTru || '123 Láng Hạ, Đống Đa, Hà Nội'}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 mb-1">Đến ngày</p>
                <p className="text-sm text-slate-900">{recordData.denNgay || '10/10/2023'}</p>
              </div>
            </div>

            <div className="col-span-2 border-t border-slate-100 my-2"></div>

            {/* Block 4 */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold text-slate-700 mb-1">Tình trạng hôn nhân</p>
                <p className="text-sm font-medium text-blue-600">{recordData.tinhTrangHonNhan || 'Chưa đăng ký kết hôn'}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 mb-1">Họ, chữ đệm, tên người đề nghị</p>
                <p className="text-sm text-slate-900">{recordData.nguoiDeNghi || 'Nguyễn Văn Nam'}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 mb-1">Số GTTT người đề nghị</p>
                <p className="text-sm text-slate-900">{recordData.soGtttNguoiDeNghi || '001090001234'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold text-slate-700 mb-1">Mục đích sử dụng</p>
                <p className="text-sm text-slate-900">{recordData.mucDich || 'Đăng ký kết hôn'}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 mb-1">Quan hệ với người được cấp</p>
                <p className="text-sm text-slate-900">{recordData.quanHe || 'Bản thân'}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 mb-1">Ngày cấp GTTT người đề nghị</p>
                <p className="text-sm text-slate-900">{recordData.ngayCapGtttNguoiDeNghi || '01/01/2015'}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 flex items-center gap-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <X className="w-4 h-4" /> Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
