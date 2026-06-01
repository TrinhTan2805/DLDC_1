import { ReconciliationTemplate } from './ReconciliationTemplate';

const mockRecords = [
  {
    id: 'REC-EXT-CAT-001',
    datasetCode: 'DM-GIOITINH-2024-12',
    datasetName: 'Danh mục giới tính',
    providerSystem: 'Trung tâm dữ liệu Quốc gia',
    dataType: 'Danh mục',
    recordCount: 3,
    receiveDate: '2024-12-20 10:15:00',
    status: 'matched' as const,
    statusText: 'Khớp dữ liệu',
    statusColor: 'bg-green-100 text-green-700 border-green-200',
    matchRate: 100,
    lastReconcileDate: '2024-12-20 10:30:00'
  },
  {
    id: 'REC-EXT-CAT-002',
    datasetCode: 'DM-DANTOC-2024-12',
    datasetName: 'Danh mục dân tộc',
    providerSystem: 'Trung tâm dữ liệu Quốc gia',
    dataType: 'Danh mục',
    recordCount: 54,
    receiveDate: '2024-12-20 10:20:00',
    status: 'matched' as const,
    statusText: 'Khớp dữ liệu',
    statusColor: 'bg-green-100 text-green-700 border-green-200',
    matchRate: 100,
    lastReconcileDate: '2024-12-20 10:35:00'
  },
  {
    id: 'REC-EXT-CAT-003',
    datasetCode: 'DM-QUOCGIA-2024-12',
    datasetName: 'Danh mục quốc gia, quốc tịch',
    providerSystem: 'Trung tâm dữ liệu Quốc gia',
    dataType: 'Danh mục',
    recordCount: 195,
    receiveDate: '2024-12-19 15:30:00',
    status: 'mismatched' as const,
    statusText: 'Không khớp',
    statusColor: 'bg-orange-100 text-orange-700 border-orange-200',
    errorCount: 2,
    matchRate: 98.97,
    lastReconcileDate: '2024-12-19 16:00:00',
    isReportSent: true
  },
  {
    id: 'REC-EXT-CAT-004',
    datasetCode: 'DM-TONGIAO-2024-12',
    datasetName: 'Danh mục tôn giáo',
    providerSystem: 'Trung tâm dữ liệu Quốc gia',
    dataType: 'Danh mục',
    recordCount: 15,
    receiveDate: '2024-12-20 11:30:00',
    status: 'matched' as const,
    statusText: 'Khớp dữ liệu',
    statusColor: 'bg-green-100 text-green-700 border-green-200',
    matchRate: 100,
    lastReconcileDate: '2024-12-20 12:00:00'
  },
  {
    id: 'REC-EXT-CAT-005',
    datasetCode: 'DM-COQUAN-2024-12',
    datasetName: 'Danh mục cơ quan',
    providerSystem: 'Trung tâm dữ liệu Quốc gia',
    dataType: 'Danh mục',
    recordCount: 2450,
    receiveDate: '2024-12-18 09:20:00',
    status: 'pending' as const,
    statusText: 'Đang xử lý',
    statusColor: 'bg-blue-100 text-blue-700 border-blue-200',
    lastReconcileDate: '2024-12-18 09:20:00'
  },
  {
    id: 'REC-EXT-CAT-006',
    datasetCode: 'DM-DVHC-2024-12',
    datasetName: 'Danh mục đơn vị hành chính',
    providerSystem: 'Trung tâm dữ liệu Quốc gia',
    dataType: 'Danh mục',
    recordCount: 11162,
    receiveDate: '2024-12-17 08:15:00',
    status: 'matched' as const,
    statusText: 'Khớp dữ liệu',
    statusColor: 'bg-green-100 text-green-700 border-green-200',
    matchRate: 99.99,
    lastReconcileDate: '2024-12-17 08:45:00'
  },
  {
    id: 'REC-EXT-CAT-007',
    datasetCode: 'DM-MQHGD-2024-12',
    datasetName: 'Danh mục mối quan hệ gia đình',
    providerSystem: 'Trung tâm dữ liệu Quốc gia',
    dataType: 'Danh mục',
    recordCount: 25,
    receiveDate: '2024-12-21 14:45:00',
    status: 'matched' as const,
    statusText: 'Khớp dữ liệu',
    statusColor: 'bg-green-100 text-green-700 border-green-200',
    matchRate: 100,
    lastReconcileDate: '2024-12-21 15:00:00'
  },
  {
    id: 'REC-EXT-CAT-008',
    datasetCode: 'DM-GTTT-2024-12',
    datasetName: 'Danh mục giấy tờ tùy thân',
    providerSystem: 'Trung tâm dữ liệu Quốc gia',
    dataType: 'Danh mục',
    recordCount: 12,
    receiveDate: '2024-12-20 13:20:00',
    status: 'matched' as const,
    statusText: 'Khớp dữ liệu',
    statusColor: 'bg-green-100 text-green-700 border-green-200',
    matchRate: 100,
    lastReconcileDate: '2024-12-20 13:40:00'
  }
];

export function ExternalCategoriesReconciliationPage() {
  return (
    <ReconciliationTemplate
      title="Đối soát tổng hợp các danh mục từ Bộ ngành ngoài (qua Trung tâm dữ liệu Quốc gia)"
      records={mockRecords}
      hideSetupTab={true}
      hideLogTab={true}
      hideManualSync={true}
      hideExportExcel={true}
    />
  );
}
