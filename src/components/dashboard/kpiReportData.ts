export interface DataRecord {
  id: string;
  name: string;
  source: string;
  syncedCount: number;
  lastSync: string;
  status: 'success' | 'warning' | 'error' | 'draft';
  dataSizeLabel?: string;
  connectionType?: 'REST' | 'SOAP';
}

// slug (dùng trong URL) <-> nhãn KPI (dùng làm key tra cứu dữ liệu)
export const KPI_SLUG_TO_LABEL: { [slug: string]: string } = {
  'thu-thap': 'Thu thập',
  'xu-ly': 'Xử lý',
  'chia-se': 'Chia sẻ',
};

export const KPI_LABEL_TO_SLUG: { [label: string]: string } = {
  'Thu thập': 'thu-thap',
  'Xử lý': 'xu-ly',
  'Chia sẻ': 'chia-se',
};

export const detailedData: { [key: string]: DataRecord[] } = {
  // Tham khảo từ mockCollectionServices (Thiết lập thu thập)
  'Thu thập': [
    { id: '1', name: 'Thu thập Thông tin Bản án, quyết định có hiệu lực pháp luật từ Tòa án nhân dân tối cao', source: 'TAND Tối cao', syncedCount: 8625999, dataSizeLabel: '9.48 GB', lastSync: '19/12/2025 15:30:00', status: 'success', connectionType: 'REST' },
    { id: '2', name: 'Thu thập dữ liệu Diện người được trợ giúp pháp lý theo quy định pháp luật', source: 'Bộ Nội vụ', syncedCount: 1980450, dataSizeLabel: '2.13 GB', lastSync: '15/12/2025 08:00:00', status: 'error', connectionType: 'REST' },
    { id: '3', name: 'Thu thập Danh mục và mã các dân tộc Việt Nam từ Ủy ban Dân tộc', source: 'Ủy ban Dân tộc', syncedCount: 460320, dataSizeLabel: '512 MB', lastSync: '14/12/2025 09:15:00', status: 'error', connectionType: 'REST' },
    { id: '4', name: 'Thu thập Danh mục Quốc gia và Quốc tịch trên thế giới từ Bộ Ngoại giao', source: 'Bộ Ngoại giao', syncedCount: 79210, dataSizeLabel: '88 MB', lastSync: '14/12/2025 09:30:00', status: 'draft', connectionType: 'REST' },
    { id: '5', name: 'Thu thập dữ liệu đối tượng đang hưởng trợ giúp xã hội hàng tháng tại cộng đồng', source: 'Bộ LĐTBXH', syncedCount: 14200000, dataSizeLabel: '15.60 GB', lastSync: '18/12/2025 14:20:00', status: 'error', connectionType: 'SOAP' },
    { id: '6', name: 'Thu thập danh sách hộ nghèo, hộ cận nghèo theo chuẩn nghèo đa chiều', source: 'Bộ LĐTBXH', syncedCount: 6120500, dataSizeLabel: '6.72 GB', lastSync: '17/12/2025 16:45:00', status: 'warning', connectionType: 'REST' },
    { id: '7', name: 'Thu thập Thông tin người nhiễm HIV đang được quản lý điều trị', source: 'Bộ Y tế', syncedCount: 305600, dataSizeLabel: '340 MB', lastSync: '16/12/2025 10:00:00', status: 'success', connectionType: 'REST' },
    { id: '8', name: 'Thu thập Thông tin người khuyết tật đã được cấp giấy xác nhận khuyết tật', source: 'Bộ LĐTBXH', syncedCount: 951200, dataSizeLabel: '1.05 GB', lastSync: '18/12/2025 11:30:00', status: 'success', connectionType: 'REST' },
    { id: '9', name: 'Thu thập hồ sơ đăng ký khai sinh từ Hệ thống hộ tịch điện tử', source: 'Cục Hành chính tư pháp', syncedCount: 22560000, dataSizeLabel: '24.80 GB', lastSync: '19/12/2025 18:30:00', status: 'success', connectionType: 'REST' },
    { id: '10', name: 'Thu thập hồ sơ đăng ký kết hôn từ Hệ thống hộ tịch điện tử', source: 'Cục Hành chính tư pháp', syncedCount: 16700000, dataSizeLabel: '18.30 GB', lastSync: '19/12/2025 18:35:00', status: 'success', connectionType: 'REST' },
  ],
  'Xử lý': [
    { id: '1', name: 'CSDL A - Đã làm sạch', source: 'Quy trình xử lý', syncedCount: 1208945, lastSync: '11/12/2024 15:00', status: 'success' },
    { id: '2', name: 'CSDL B - Đã chuẩn hóa', source: 'Quy trình xử lý', syncedCount: 865234, lastSync: '11/12/2024 14:55', status: 'success' },
    { id: '3', name: 'CSDL C - Đã biến đổi', source: 'Quy trình xử lý', syncedCount: 534567, lastSync: '11/12/2024 14:50', status: 'success' },
    { id: '4', name: 'Biên tập danh mục A - Đã xử lý', source: 'Quy trình xử lý', syncedCount: 415678, lastSync: '11/12/2024 14:45', status: 'success' },
    { id: '5', name: 'Danh mục B - Đã xử lý', source: 'Quy trình xử lý', syncedCount: 348921, lastSync: '11/12/2024 14:40', status: 'success' },
    { id: '6', name: 'Danh mục C - Chờ xử lý', source: 'Quy trình xử lý', syncedCount: 267890, lastSync: '11/12/2024 14:35', status: 'warning' },
    { id: '7', name: 'Dịch vụ A - Đã xử lý', source: 'Quy trình xử lý', syncedCount: 228456, lastSync: '11/12/2024 14:30', status: 'success' },
    { id: '8', name: 'Dịch vụ B - Đã xử lý', source: 'Quy trình xử lý', syncedCount: 193487, lastSync: '11/12/2024 14:25', status: 'success' },
  ],
  'Chia sẻ': [
    { id: '1', name: 'API CSDL A', source: 'Dịch vụ chia sẻ', syncedCount: 45632, lastSync: '11/12/2024 15:30', status: 'success' },
    { id: '2', name: 'API CSDL B', source: 'Dịch vụ chia sẻ', syncedCount: 38945, lastSync: '11/12/2024 15:25', status: 'success' },
    { id: '3', name: 'API CSDL C', source: 'Dịch vụ chia sẻ', syncedCount: 27834, lastSync: '11/12/2024 15:20', status: 'success' },
    { id: '4', name: 'Export Biên tập danh mục A', source: 'Xuất dữ liệu', syncedCount: 15678, lastSync: '11/12/2024 15:15', status: 'success' },
    { id: '5', name: 'Export Danh mục B', source: 'Xuất dữ liệu', syncedCount: 12456, lastSync: '11/12/2024 15:10', status: 'success' },
    { id: '6', name: 'Đồng bộ Hệ thống A', source: 'Tích hợp', syncedCount: 9347, lastSync: '11/12/2024 15:05', status: 'success' },
    { id: '7', name: 'Đồng bộ Hệ thống B', source: 'Tích hợp', syncedCount: 7000, lastSync: '11/12/2024 15:00', status: 'success' },
  ],
};

// Xu hướng Thu thập - 7 ngày qua (dùng chung với thẻ KPI ở Tổng quan)
export const collectionTrendData = [
  { day: 'T2', value: 625000 },
  { day: 'T3', value: 638000 },
  { day: 'T4', value: 642000 },
  { day: 'T5', value: 655000 },
  { day: 'T6', value: 668000 },
  { day: 'T7', value: 672000 },
  { day: 'CN', value: 633000 },
];

// Xu hướng Thu thập theo Hệ thống nguồn - 12 tháng gần nhất (đủ dữ liệu để lọc theo Tháng/Quý/6 tháng/Năm)
export type SourceTrendMetric = 'records' | 'dataSize' | 'services';
export type SourceTrendGranularity = 'month' | 'quarter' | 'halfYear' | 'year';

export const SOURCE_TREND_MONTHS = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];

// Hệ số tăng trưởng theo tháng, áp lên giá trị cuối kỳ (hiện tại) của từng hệ thống nguồn - Th12 = giá trị hiện tại
const GROWTH_RATIOS = [0.28, 0.36, 0.44, 0.52, 0.60, 0.68, 0.75, 0.81, 0.87, 0.92, 0.96, 1.00];

// Các mốc lọc thời gian: mỗi kỳ lấy giá trị "chốt" (snapshot) tại tháng cuối kỳ, vì các chuỗi số là số luỹ kế
export const SOURCE_TREND_PERIODS: { [key in SourceTrendGranularity]: { label: string; monthIndex: number }[] } = {
  month: SOURCE_TREND_MONTHS.map((label, monthIndex) => ({ label, monthIndex })),
  quarter: [
    { label: 'Quý 1', monthIndex: 2 },
    { label: 'Quý 2', monthIndex: 5 },
    { label: 'Quý 3', monthIndex: 8 },
    { label: 'Quý 4', monthIndex: 11 },
  ],
  halfYear: [
    { label: 'Nửa đầu năm', monthIndex: 5 },
    { label: 'Nửa cuối năm', monthIndex: 11 },
  ],
  year: [
    { label: 'Cả năm', monthIndex: 11 },
  ],
};

const buildMonthlySeries = (finalValue: number) =>
  GROWTH_RATIOS.map(ratio => Math.round(finalValue * ratio));

// Tổng hợp từ dữ liệu 'Thu thập' ở trên: số bản ghi, dung lượng (MB) và số dịch vụ cuối kỳ theo từng hệ thống nguồn
const SOURCE_FINAL_TOTALS: { source: string; records: number; dataSizeMB: number; services: number }[] = [
  // Số dịch vụ (services) bên dưới là số liệu mô phỏng minh hoạ (mock), không phải số đếm thật từ mockCollectionServices
  { source: 'TAND Tối cao', records: 8625999, dataSizeMB: 9.48 * 1024, services: 18 },
  { source: 'Bộ Nội vụ', records: 1980450, dataSizeMB: 2.13 * 1024, services: 12 },
  { source: 'Ủy ban Dân tộc', records: 460320, dataSizeMB: 512, services: 9 },
  { source: 'Bộ Ngoại giao', records: 79210, dataSizeMB: 88, services: 7 },
  { source: 'Bộ LĐTBXH', records: 14200000 + 6120500 + 951200, dataSizeMB: (15.60 + 6.72 + 1.05) * 1024, services: 26 },
  { source: 'Bộ Y tế', records: 305600, dataSizeMB: 340, services: 14 },
  { source: 'Cục Hành chính tư pháp', records: 22560000 + 16700000, dataSizeMB: (24.80 + 18.30) * 1024, services: 21 },
  { source: 'Cục Quản lý thi hành án dân sự', records: 5200000, dataSizeMB: 4.2 * 1024, services: 16 },
  { source: 'Cục Đăng ký giao dịch bảo đảm và BTNN', records: 1850000, dataSizeMB: 1.6 * 1024, services: 11 },
  { source: 'Cục Kiểm tra văn bản và Quản lý xử lý vi phạm hành chính', records: 3400000, dataSizeMB: 2.9 * 1024, services: 19 },
  { source: 'Cục Bổ trợ tư pháp', records: 2600000, dataSizeMB: 2.1 * 1024, services: 17 },
  { source: 'Vụ Hợp tác quốc tế', records: 180000, dataSizeMB: 210, services: 8 },
  { source: 'Cục Kế hoạch - Tài chính', records: 950000, dataSizeMB: 780, services: 13 },
];

export const SOURCE_TREND_LIST = SOURCE_FINAL_TOTALS.map(t => t.source);

// { [metric]: { [source]: number[] } } - mỗi mảng có 12 phần tử tương ứng SOURCE_TREND_MONTHS
export const sourceTrendSeries: { [metric in SourceTrendMetric]: { [source: string]: number[] } } = {
  records: Object.fromEntries(SOURCE_FINAL_TOTALS.map(t => [t.source, buildMonthlySeries(t.records)])),
  dataSize: Object.fromEntries(SOURCE_FINAL_TOTALS.map(t => [t.source, buildMonthlySeries(t.dataSizeMB)])),
  services: Object.fromEntries(SOURCE_FINAL_TOTALS.map(t => [t.source, buildMonthlySeries(t.services)])),
};

export const formatDataSize = (value: number) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = value;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toLocaleString('vi-VN', { maximumFractionDigits: 2 })} ${units[unitIndex]}`;
};
