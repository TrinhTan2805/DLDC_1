import { ReconciliationTemplate } from './ReconciliationTemplate';

const mockRecords = [
  {
    id: 'REC-COURT-001',
    datasetCode: 'BA-HINHSU-2024-12',
    datasetName: 'Bản án hình sự',
    providerSystem: 'TAND Tối cao',
    dataType: 'Bản án',
    recordCount: 398000,
    receiveDate: '2024-12-20 10:15:00',
    status: 'matched' as const,
    statusText: 'Khớp dữ liệu',
    statusColor: 'bg-green-100 text-green-700 border-green-200',
    matchRate: 99.95,
    lastReconcileDate: '2024-12-20 10:30:00'
  },
  {
    id: 'REC-COURT-002',
    datasetCode: 'QD-HINHSU-2024-12',
    datasetName: 'Quyết định hình sự',
    providerSystem: 'TAND Tối cao',
    dataType: 'Quyết định',
    recordCount: 125000,
    receiveDate: '2024-12-19 15:30:00',
    status: 'mismatched' as const,
    statusText: 'Không khớp',
    statusColor: 'bg-orange-100 text-orange-700 border-orange-200',
    errorCount: 45,
    matchRate: 99.96,
    lastReconcileDate: '2024-12-19 16:00:00',
    isReportSent: true
  },
  {
    id: 'REC-COURT-003',
    datasetCode: 'BA-DANSU-2024-11',
    datasetName: 'Bản án dân sự',
    providerSystem: 'TAND Tối cao',
    dataType: 'Bản án',
    recordCount: 387000,
    receiveDate: '2024-11-20 09:20:00',
    status: 'matched' as const,
    statusText: 'Khớp dữ liệu',
    statusColor: 'bg-green-100 text-green-700 border-green-200',
    matchRate: 100,
    lastReconcileDate: '2024-11-20 09:40:00'
  },
  {
    id: 'REC-COURT-004',
    datasetCode: 'QD-DANSU-2024-11',
    datasetName: 'Quyết định dân sự',
    providerSystem: 'TAND Tối cao',
    dataType: 'Quyết định',
    recordCount: 118000,
    receiveDate: '2024-11-19 14:45:00',
    status: 'matched' as const,
    statusText: 'Khớp dữ liệu',
    statusColor: 'bg-green-100 text-green-700 border-green-200',
    matchRate: 99.98,
    lastReconcileDate: '2024-11-19 15:00:00'
  },
  {
    id: 'REC-COURT-005',
    datasetCode: 'BA-HANHCHINH-2024-10',
    datasetName: 'Bản án hành chính',
    providerSystem: 'TAND Tối cao',
    dataType: 'Bản án',
    recordCount: 365000,
    receiveDate: '2024-10-20 11:30:00',
    status: 'matched' as const,
    statusText: 'Khớp dữ liệu',
    statusColor: 'bg-green-100 text-green-700 border-green-200',
    matchRate: 99.99,
    lastReconcileDate: '2024-10-20 12:00:00'
  }
];

export function ExternalCourtJudgmentReconciliationPage() {
  return (
    <ReconciliationTemplate
      title="Đối soát tổng hợp dữ liệu về Thông tin Bản án, quyết định"
      records={mockRecords}
      hideSetupTab={true}
      hideLogTab={true}
    />
  );
}
