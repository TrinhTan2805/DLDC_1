import { Plus, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { AdvancedDataMapping } from './AdvancedDataMapping';

interface DataCollectionConfigSectionProps {
  resetTestState: () => void;
}

export function DataCollectionConfigSection({ resetTestState }: DataCollectionConfigSectionProps) {

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

  const TARGET_FIELDS_MOCK = [
    'id', 'ma_ho_so', 'so_dang_ky', 'so_quyen', 'trang_so', 
    'ho_ten_nguoi_duoc_cap', 'ngay_sinh', 'gioi_tinh', 'noi_sinh', 
    'ma_dan_toc', 'ma_quoc_tich', 'so_cmnd', 'so_cccd', 
    'dia_chi_cu_tru', 'tinh_trang_hon_nhan', 'nguoi_de_nghi', 
    'quan_he_nguoi_de_nghi', 'ly_do', 'ngay_cap'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm text-slate-700 mb-3">Cấu hình thu thập dữ liệu</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="sync-method" className="block text-sm text-slate-600 mb-1">
                Phương thức đồng bộ <span className="text-red-500">*</span>
              </label>
              <select 
                id="sync-method"
                title="Phương thức đồng bộ"
                onChange={resetTestState}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              >
                <option value="">Chọn phương thức</option>
                <option value="realtime">Real-time (Thời gian thực)</option>
                <option value="batch">Batch (Theo lô)</option>
                <option value="scheduled">Scheduled (Theo lịch)</option>
              </select>
            </div>
            <div>
              <label htmlFor="collection-frequency" className="block text-sm text-slate-600 mb-1">
                Tần suất thu thập
              </label>
              <select 
                id="collection-frequency"
                title="Tần suất thu thập"
                onChange={resetTestState}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              >
                <option value="">Chọn tần suất</option>
                <option value="manual">Theo yêu cầu (Thủ công)</option>
                <option value="hourly">Mỗi giờ</option>
                <option value="daily">Hàng ngày</option>
                <option value="weekly">Hàng tuần</option>
                <option value="monthly">Hàng tháng</option>
              </select>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
            <p className="text-xs text-blue-700">
              <strong>Lưu ý:</strong> Lịch thu thập sẽ tự động chạy theo cấu hình. Hệ thống sẽ gửi thông báo khi có lỗi xảy ra trong quá trình thu thập.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
