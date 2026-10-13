import { toast } from 'sonner';
import { FileText } from 'lucide-react';
import { GenericDataTable } from '../../common/GenericDataTable';

const mockData = [
  { id: 1, certificateNumber: 'GLH-001/2025', husbandName: 'Nguyễn Văn Z', wifeName: 'Trần Thị AA', divorceDate: '20/05/2025', court: 'TAND Quận 1', reason: 'Không hòa hợp', status: 'Đã cấp', updatedAt: '09/12/2025' },
];

export function DivorceCertificatePage() {
  return (
    <GenericDataTable
      title="Bản khai ly hôn"
      description="Quản lý giấy đăng ký ly hôn"
      icon={FileText}
      iconColor="orange"
      columns={[
        { key: 'certificateNumber', label: 'Số giấy', sortable: true },
        { key: 'husbandName', label: 'Chồng', sortable: true },
        { key: 'wifeName', label: 'Vợ', sortable: true },
        { key: 'divorceDate', label: 'Ngày ly hôn' },
        { key: 'court', label: 'Tòa án' },
        { key: 'status', label: 'Trạng thái' },
      ]}
      data={mockData}
      searchFields={[
        { label: 'Số giấy', name: 'certificateNumber', type: 'text' },
        { label: 'Tên chồng', name: 'husbandName', type: 'text' },
        { label: 'Tên vợ', name: 'wifeName', type: 'text' },
      ]}
      detailFields={[
        { label: 'Số giấy', key: 'certificateNumber' },
        { label: 'Chồng', key: 'husbandName' },
        { label: 'Vợ', key: 'wifeName' },
        { label: 'Ngày ly hôn', key: 'divorceDate' },
        { label: 'Tòa án', key: 'court' },
        { label: 'Lý do', key: 'reason' },
        { label: 'Trạng thái', key: 'status' },
        { label: 'Ngày cập nhật', key: 'updatedAt' },
      ]}
      apiEndpoint="https://api.btp.gov.vn/v1/civil-registry/divorce"
      lastSyncTime="09/12/2025 09:45:10"
      onSync={() => toast.info('Đang đồng bộ dữ liệu khai ly hôn...')}
    />
  );
}
