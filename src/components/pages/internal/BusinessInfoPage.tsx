import { toast } from 'sonner';
import { Building } from 'lucide-react';
import { GenericDataTable } from '../../common/GenericDataTable';

export function BusinessInfoPage() {
  return (
    <GenericDataTable
      title="Thông tin doanh nghiệp"
      description="Quản lý thông tin doanh nghiệp"
      icon={Building}
      iconColor="indigo"
      columns={[{ key: 'taxCode', label: 'Mã số thuế', sortable: true }, { key: 'businessName', label: 'Tên DN' }, { key: 'status', label: 'Trạng thái' }]}
      data={[{ id: 1, taxCode: '0123456789', businessName: 'Công ty XYZ', status: 'Hoạt động', updatedAt: '09/12/2025' }]}
      searchFields={[{ label: 'Mã số thuế', name: 'taxCode', type: 'text' }]}
      detailFields={[{ label: 'Mã số thuế', key: 'taxCode' }]}
      apiEndpoint="https://api.btp.gov.vn/v1/business-registry/info"
      lastSyncTime="09/12/2025 14:10:20"
      onSync={() => toast.info('Đang đồng bộ thông tin doanh nghiệp...')}
    />
  );
}
