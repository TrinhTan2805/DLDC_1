import { toast } from 'sonner';
import { Users } from 'lucide-react';
import { GenericDataTable } from '../../common/GenericDataTable';

export function LegalAidPersonPage() {
  return (
    <GenericDataTable
      title="Người được trợ giúp pháp lý"
      description="Quản lý thông tin người được trợ giúp pháp lý"
      icon={Users}
      iconColor="purple"
      columns={[{ key: 'fullName', label: 'Họ tên', sortable: true }, { key: 'idNumber', label: 'CCCD' }, { key: 'status', label: 'Trạng thái' }]}
      data={[{ id: 1, fullName: 'Nguyễn Văn X', idNumber: '001234567999', status: 'Đang được hỗ trợ', updatedAt: '09/12/2025' }]}
      searchFields={[{ label: 'Họ tên', name: 'fullName', type: 'text' }]}
      detailFields={[{ label: 'Họ tên', key: 'fullName' }]}
      apiEndpoint="https://api.btp.gov.vn/v1/legal-aid/persons"
      lastSyncTime="09/12/2025 12:50:45"
      onSync={() => toast.info('Đang đồng bộ người được trợ giúp pháp lý...')}
    />
  );
}
