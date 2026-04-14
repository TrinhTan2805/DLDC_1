import { Plus, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { AdvancedDataMapping } from './AdvancedDataMapping';

interface DataCollectionConfigSectionProps {
  testState: 'idle' | 'testing_connection' | 'connection_error' | 'testing_data' | 'data_error' | 'success';
  setTestState: Dispatch<SetStateAction<'idle' | 'testing_connection' | 'connection_error' | 'testing_data' | 'data_error' | 'success'>>;
  mockMode: 'success' | 'err_conn' | 'err_data';
  setMockMode: Dispatch<SetStateAction<'success' | 'err_conn' | 'err_data'>>;
  mappings: any[];
  setMappings: Dispatch<SetStateAction<any[]>>;
  handleTestConnection: () => void;
  resetTestState: () => void;
}

export function DataCollectionConfigSection({
  testState, mockMode, setMockMode, mappings, setMappings, handleTestConnection, resetTestState
}: DataCollectionConfigSectionProps) {

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

      {/* KHỐI KIỂM TRA KẾT NỐI VÀ ÁNH XẠ DỮ LIỆU */}
      <div className="pt-2 border-t border-slate-200">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Kiểm tra kết nối và Ánh xạ dữ liệu</h3>
        
        <div className="flex items-center gap-4 mb-4">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testState === 'testing_connection' || testState === 'testing_data'}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 transition-colors text-sm font-medium flex items-center gap-2"
          >
            {(testState === 'testing_connection' || testState === 'testing_data') && <Loader2 className="w-4 h-4 animate-spin" />}
            Kiểm tra kết nối
          </button>
          
          <div className="flex items-center gap-2 text-xs border border-orange-200 bg-orange-50 px-3 py-2 rounded-lg ml-auto">
            <span className="font-semibold text-orange-800">Chế độ Test (Mockup):</span>
            <label className="flex items-center gap-1 cursor-pointer"><input type="radio" checked={mockMode==='success'} onChange={()=>setMockMode('success')} name="mMode" /> Thành công</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="radio" checked={mockMode==='err_conn'} onChange={()=>setMockMode('err_conn')} name="mMode" /> Lỗi Kết nối</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="radio" checked={mockMode==='err_data'} onChange={()=>setMockMode('err_data')} name="mMode" /> Lỗi Dữ liệu</label>
          </div>
        </div>

        {/* Trạng thái Testing */}
        <div className="space-y-3">
          {testState === 'testing_connection' && (
             <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-center gap-2 animate-pulse border border-blue-200">
               <Loader2 className="w-4 h-4 animate-spin" /> Đang thực hiện kết nối tới hệ thống nguồn...
             </div>
          )}
          
          {testState === 'connection_error' && (
             <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm flex flex-col gap-2 border border-red-200">
               <div className="flex items-center gap-2 font-bold"><AlertCircle className="w-5 h-5"/> Lỗi kết nối dịch vụ</div>
               <p>Hệ thống không thể kết nối tới máy chủ thông qua các giao thức/thông tin cấu hình đã cung cấp (VD: Quá thời gian timeout 3000ms, Server nguồn từ chối kết nối).</p>
               <div className="mt-2">
                 <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('NAVIGATE_TO_LOG', { detail: { logId: 6 } }))} className="text-xs bg-white border border-red-300 px-3 py-1.5 rounded hover:bg-red-50 font-medium transition-colors">Xem chi tiết lỗi trong Nhật ký hoạt động</button>
               </div>
             </div>
          )}

          {testState === 'testing_data' && (
            <>
               <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2 border border-green-200">
                 <CheckCircle className="w-4 h-4" /> Kết nối thành công.
               </div>
               <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-center gap-2 animate-pulse border border-blue-200">
                 <Loader2 className="w-4 h-4 animate-spin" /> Đang tải mô hình dữ liệu mẫu (Data Schema/Payload)...
               </div>
            </>
          )}

          {testState === 'data_error' && (
            <>
               <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2 border border-green-200">
                 <CheckCircle className="w-4 h-4" /> Kết nối thành công.
               </div>
               <div className="p-4 bg-red-50 text-red-800 rounded-lg text-sm flex flex-col gap-2 border border-red-200">
                 <div className="flex items-center gap-2 font-bold"><AlertCircle className="w-5 h-5"/> Lỗi dữ liệu/Cấu trúc gói tin</div>
                 <p>Khởi tạo kết nối thành công, tuy nhiên định dạng dữ liệu trả về không tương thích hoặc rỗng (Empty Payload). Hệ thống không thể tiến hành Ánh xạ.</p>
                 <div className="mt-2">
                  <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('NAVIGATE_TO_LOG', { detail: { logId: 7 } }))} className="text-xs bg-white border border-red-300 px-3 py-1.5 rounded hover:bg-red-50 font-medium text-red-700 transition-colors">Xem chi tiết lỗi trong Nhật ký hoạt động</button>
                </div>
               </div>
            </>
          )}
          
          {testState === 'success' && (
             <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2 border border-green-200 font-medium">
               <CheckCircle className="w-5 h-5" /> Kết nối thành công! Đã nhận được dữ liệu mẫu, Sẵn sàng ánh xạ.
             </div>
          )}
        </div>
      </div>

      {/* ÁNH XẠ DỮ LIỆU */}
      {testState === 'success' && (
        <div className="mt-6 pt-6 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[800px]">
          <AdvancedDataMapping />
        </div>
      )}
    </div>
  );
}
