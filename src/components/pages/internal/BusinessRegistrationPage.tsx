import { toast } from 'sonner';
import { FileText } from 'lucide-react';
import { GenericDataTable } from '../../common/GenericDataTable';

export function BusinessRegistrationPage() {
  return (
    <GenericDataTable
      title="Hồ sơ đăng ký doanh nghiệp"
      description="Quản lý hồ sơ đăng ký doanh nghiệp"
      icon={FileText}
      iconColor="sky"
      columns={[{ key: 'registrationNumber', label: 'Số hồ sơ', sortable: true }, { key: 'businessName', label: 'Tên DN' }, { key: 'status', label: 'Trạng thái' }]}
      data={[{ id: 1, registrationNumber: 'ĐK-001/2025', businessName: 'Công ty ABC', status: 'Đã duyệt', updatedAt: '09/12/2025' }]}
      searchFields={[{ label: 'Số hồ sơ', name: 'registrationNumber', type: 'text' }]}
      detailFields={[{ label: 'Số hồ sơ', key: 'registrationNumber' }]}
      apiEndpoint="https://api.btp.gov.vn/v1/business-registry/registrations"
      lastSyncTime="09/12/2025 14:25:55"
      onSync={() => toast.info('Đang đồng bộ hồ sơ đăng ký doanh nghiệp...')}
    />
  );
}
