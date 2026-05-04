export interface ReconciliationProcess {
  id: string;
  group: string;
  name: string;
  targetSystem: string;
  schedule: string;
  status: 'active' | 'inactive';
  lastRun?: string;
  lastStatus?: 'success' | 'failed';
}

export const reconciliationData: ReconciliationProcess[] = [
  {
    id: '662',
    group: 'Dữ liệu danh mục',
    name: 'Đối soát tổng hợp về dữ liệu Danh mục cung cấp cho các hệ thống khác',
    targetSystem: 'Hệ thống đích (Các Bộ/Ngành/Địa phương)',
    schedule: 'Định kỳ (Hàng ngày) / Theo yêu cầu',
    status: 'active',
    lastRun: '2026-05-04T02:00:00Z',
    lastStatus: 'success'
  },
  {
    id: '663',
    group: 'CSDL Hộ tịch điện tử',
    name: 'Đối soát tổng hợp về cung cấp dữ liệu Hộ tịch điện tử',
    targetSystem: 'Hệ thống Bộ Tư pháp',
    schedule: 'Định kỳ (Hàng tuần) / Theo yêu cầu',
    status: 'active',
  },
  {
    id: '664',
    group: 'Hệ thống quản lý hồ sơ quốc tịch',
    name: 'Đối soát tổng hợp về cung cấp dữ liệu hồ sơ quốc tịch',
    targetSystem: 'Hệ thống Bộ Tư pháp',
    schedule: 'Định kỳ (Hàng tháng) / Theo yêu cầu',
    status: 'active',
  },
  {
    id: '665',
    group: 'Cơ sở dữ liệu thi hành án dân sự',
    name: 'Đối soát tổng hợp về cung cấp dữ liệu thi hành án dân sự',
    targetSystem: 'Hệ thống THADS',
    schedule: 'Định kỳ (Hàng ngày) / Theo yêu cầu',
    status: 'active',
  },
  {
    id: '666',
    group: 'Cơ sở dữ liệu về biện pháp bảo đảm',
    name: 'Đối soát tổng hợp về cung cấp dữ liệu về biện pháp bảo đảm',
    targetSystem: 'Cục Đăng ký quốc gia Giao dịch bảo đảm',
    schedule: 'Định kỳ (Hàng tuần) / Theo yêu cầu',
    status: 'active',
  },
  {
    id: '667',
    group: 'CSDL quốc gia về pháp luật',
    name: 'Đối soát tổng hợp về cung cấp dữ liệu quốc gia về pháp luật',
    targetSystem: 'Cơ sở dữ liệu Quốc gia',
    schedule: 'Định kỳ (Hàng tháng) / Theo yêu cầu',
    status: 'active',
  },
  {
    id: '668',
    group: 'Cơ sở dữ liệu tương trợ tư pháp về dân sự',
    name: 'Đối soát tổng hợp về cung cấp dữ liệu tương trợ tư pháp về dân sự',
    targetSystem: 'Hệ thống Tương trợ tư pháp',
    schedule: 'Theo yêu cầu',
    status: 'inactive',
  },
  {
    id: '669',
    group: 'Hệ thống thông tin trợ giúp pháp lý',
    name: 'Đối soát tổng hợp về cung cấp dữ liệu thông tin trợ giúp pháp lý',
    targetSystem: 'Trung tâm Trợ giúp pháp lý',
    schedule: 'Định kỳ (Hàng tháng) / Theo yêu cầu',
    status: 'active',
  },
  {
    id: '670',
    group: 'CSDL phổ biến, giáo dục pháp luật',
    name: 'Đối soát tổng hợp về cung cấp dữ liệu phổ biến, giáo dục pháp luật và hoà giải cơ sở',
    targetSystem: 'Hệ thống PBGDPL',
    schedule: 'Theo yêu cầu',
    status: 'active',
  },
  {
    id: '671',
    group: 'CSDL quản lý đấu giá tài sản',
    name: 'Đối soát tổng hợp về cung cấp dữ liệu quản lý đấu giá tài sản',
    targetSystem: 'Cục Bổ trợ tư pháp',
    schedule: 'Định kỳ (Hàng tuần) / Theo yêu cầu',
    status: 'active',
  },
  {
    id: '672',
    group: 'CSDL Hợp tác quốc tế',
    name: 'Đối soát tổng hợp về cung cấp dữ liệu Hợp tác quốc tế',
    targetSystem: 'Vụ Hợp tác quốc tế',
    schedule: 'Định kỳ (Hàng tháng) / Theo yêu cầu',
    status: 'active',
  },
  {
    id: '673',
    group: 'Dữ liệu mở',
    name: 'Đối soát tổng hợp về cung cấp dữ liệu mở',
    targetSystem: 'Cổng Dữ liệu Quốc gia',
    schedule: 'Định kỳ (Hàng ngày) / Theo yêu cầu',
    status: 'active',
  },
  {
    id: '674',
    group: 'Dữ liệu chủ',
    name: 'Đối soát tổng hợp về cung cấp dữ liệu chủ',
    targetSystem: 'Hệ thống NDXP',
    schedule: 'Định kỳ (Hàng ngày) / Theo yêu cầu',
    status: 'active',
  }
];

export interface ReconciliationHistoryEntry {
  id: string;
  processId: string;
  runDate: string;
  runType: 'Định kỳ' | 'Yêu cầu';
  targetSystem: string;
  totalSent: number;
  totalMatched: number;
  discrepancies: number;
  status: 'Thành công' | 'Cảnh báo' | 'Lỗi';
  note?: string;
}

// Generate some mock history data for the processes
export const reconciliationHistoryData: Record<string, ReconciliationHistoryEntry[]> = {
  '662': [
    { id: 'h1', processId: '662', runDate: '2026-05-04 02:00:00', runType: 'Định kỳ', targetSystem: 'Bộ Tài nguyên và Môi trường', totalSent: 15420, totalMatched: 15420, discrepancies: 0, status: 'Thành công' },
    { id: 'h2', processId: '662', runDate: '2026-05-03 02:00:00', runType: 'Định kỳ', targetSystem: 'Bộ Tài chính', totalSent: 15420, totalMatched: 15400, discrepancies: 20, status: 'Cảnh báo', note: 'Lệch 20 bản ghi do chậm đồng bộ' },
    { id: 'h3', processId: '662', runDate: '2026-05-02 14:30:00', runType: 'Yêu cầu', targetSystem: 'Bộ Công an', totalSent: 15420, totalMatched: 15420, discrepancies: 0, status: 'Thành công' },
  ],
  '663': [
    { id: 'h4', processId: '663', runDate: '2026-05-01 01:00:00', runType: 'Định kỳ', targetSystem: 'Cơ sở dữ liệu Quốc gia', totalSent: 1250000, totalMatched: 1250000, discrepancies: 0, status: 'Thành công' },
    { id: 'h5', processId: '663', runDate: '2026-04-24 01:00:00', runType: 'Định kỳ', targetSystem: 'Cơ sở dữ liệu Quốc gia', totalSent: 1245000, totalMatched: 1244500, discrepancies: 500, status: 'Cảnh báo', note: 'Dữ liệu phát sinh mới trong ngày chưa cập nhật' },
  ]
};

// Auto generate empty arrays for other process IDs to prevent undefined errors
reconciliationData.forEach(proc => {
  if (!reconciliationHistoryData[proc.id]) {
    reconciliationHistoryData[proc.id] = [
      { id: `auto-${proc.id}-1`, processId: proc.id, runDate: '2026-05-01 08:00:00', runType: 'Định kỳ', targetSystem: proc.targetSystem, totalSent: 5000, totalMatched: 5000, discrepancies: 0, status: 'Thành công' }
    ];
  }
});
