import { ReconciliationTemplate } from './ReconciliationTemplate';

interface InternalReconciliationPageProps {
  databaseName: string;
  databaseCode: string;
}

const generateMockRecords = (dbCode: string, dbName: string) => {
  const records = [
    {
      id: `REC-${dbCode}-001`,
      datasetCode: `${dbCode}-2024-12`,
      datasetName: `${dbName} - Tháng 12/2024`,
      providerSystem: `Hệ thống ${dbName}`,
      dataType: dbName,
      recordCount: Math.floor(Math.random() * 500000) + 100000,
      receiveDate: '2024-12-20 10:15:00',
      status: 'matched' as const,
      statusText: 'Khớp dữ liệu',
      statusColor: 'bg-green-100 text-green-700 border-green-200',
      matchRate: 99.5 + Math.random() * 0.5,
      lastReconcileDate: '2024-12-20 10:30:00'
    },
    {
      id: `REC-${dbCode}-002`,
      datasetCode: `${dbCode}-2024-11`,
      datasetName: `${dbName} - Tháng 11/2024`,
      providerSystem: `Hệ thống ${dbName}`,
      dataType: dbName,
      recordCount: Math.floor(Math.random() * 500000) + 100000,
      receiveDate: '2024-11-20 15:30:00',
      status: 'mismatched' as const,
      statusText: 'Không khớp',
      statusColor: 'bg-orange-100 text-orange-700 border-orange-200',
      errorCount: Math.floor(Math.random() * 100) + 10,
      matchRate: 98 + Math.random() * 1.5,
      lastReconcileDate: '2024-11-20 16:00:00',
      isReportSent: true
    },
    {
      id: `REC-${dbCode}-003`,
      datasetCode: `${dbCode}-2024-10`,
      datasetName: `${dbName} - Tháng 10/2024`,
      providerSystem: `Hệ thống ${dbName}`,
      dataType: dbName,
      recordCount: Math.floor(Math.random() * 500000) + 100000,
      receiveDate: '2024-10-20 09:20:00',
      status: 'matched' as const,
      statusText: 'Khớp dữ liệu',
      statusColor: 'bg-green-100 text-green-700 border-green-200',
      matchRate: 99.8 + Math.random() * 0.2,
      lastReconcileDate: '2024-10-20 09:40:00'
    },
    {
      id: `REC-${dbCode}-004`,
      datasetCode: `${dbCode}-2024-09`,
      datasetName: `${dbName} - Tháng 9/2024`,
      providerSystem: `Hệ thống ${dbName}`,
      dataType: dbName,
      recordCount: Math.floor(Math.random() * 500000) + 100000,
      receiveDate: '2024-09-20 14:45:00',
      status: 'pending' as const,
      statusText: 'Đang xử lý',
      statusColor: 'bg-blue-100 text-blue-700 border-blue-200',
      lastReconcileDate: '2024-09-20 14:45:00'
    },
    {
      id: `REC-${dbCode}-005`,
      datasetCode: `${dbCode}-2024-08`,
      datasetName: `${dbName} - Tháng 8/2024`,
      providerSystem: `Hệ thống ${dbName}`,
      dataType: dbName,
      recordCount: Math.floor(Math.random() * 500000) + 100000,
      receiveDate: '2024-08-20 11:30:00',
      status: 'matched' as const,
      statusText: 'Khớp dữ liệu',
      statusColor: 'bg-green-100 text-green-700 border-green-200',
      matchRate: 99.7 + Math.random() * 0.3,
      lastReconcileDate: '2024-08-20 12:00:00'
    }
  ];

  return records;
};

export function InternalReconciliationPage({ databaseName, databaseCode }: InternalReconciliationPageProps) {
  const records = generateMockRecords(databaseCode, databaseName);

  return (
    <ReconciliationTemplate
      title={`Đối soát dữ liệu ${databaseName}`}
      records={records}
      hideSetupTab={true}
      hideLogTab={true}
    />
  );
}
