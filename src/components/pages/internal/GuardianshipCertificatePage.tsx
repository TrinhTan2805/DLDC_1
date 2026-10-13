import { toast } from 'sonner';
import { Shield as ShieldIcon } from 'lucide-react';
import { GenericDataTable } from '../../common/GenericDataTable';

const mockData = [
  { id: 1, certificateNumber: 'GGH-001/2025', ward: 'Nguyễn Văn EE', guardian: 'Trần Văn FF', relationshipLabel: 'Ông nội', appointmentDate: '15/07/2025', court: 'TAND Quận 7', status: 'Đã cấp', updatedAt: '09/12/2025' },
];

export function GuardianshipCertificatePage() {
  return (
    <GenericDataTable
      title="Bản khai giám hộ"
      description="Quản lý giấy chỉ định người giám hộ"
      icon={ShieldIcon}
      iconColor="violet"
      columns={[
        { key: 'certificateNumber', label: 'Số giấy', sortable: true },
        { key: 'ward', label: 'Người được giám hộ', sortable: true },
        { key: 'guardian', label: 'Người giám hộ' },
        { key: 'appointmentDate', label: 'Ngày chỉ định' },
        { key: 'court', label: 'Tòa án' },
        { key: 'status', label: 'Trạng thái' },
      ]}
      data={mockData}
      searchFields={[
        { label: 'Số giấy', name: 'certificateNumber', type: 'text' },
        { label: 'Người được giám hộ', name: 'ward', type: 'text' },
        { label: 'Người giám hộ', name: 'guardian', type: 'text' },
      ]}
      detailFields={[
        { label: 'Số giấy', key: 'certificateNumber' },
        { label: 'Người được giám hộ', key: 'ward' },
        { label: 'Người giám hộ', key: 'guardian' },
        { label: 'Mối quan hệ', key: 'relationshipLabel' },
        { label: 'Ngày chỉ định', key: 'appointmentDate' },
        { label: 'Tòa án', key: 'court' },
        { label: 'Trạng thái', key: 'status' },
        { label: 'Ngày cập nhật', key: 'updatedAt' },
      ]}
      apiEndpoint="https://api.btp.gov.vn/v1/civil-registry/guardianship"
      lastSyncTime="09/12/2025 07:15:20"
      onSync={() => toast.info('Đang đồng bộ dữ liệu giám hộ...')}
    />
  );
}
