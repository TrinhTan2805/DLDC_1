import { toast } from 'sonner';
import { Briefcase } from 'lucide-react';
import { GenericDataTable } from '../../common/GenericDataTable';

export function LegalAidCasePage() {
  return (
    <GenericDataTable
      title="Vụ việc trợ giúp pháp lý"
      description="Quản lý vụ việc trợ giúp pháp lý"
      icon={Briefcase}
      iconColor="amber"
      columns={[{ key: 'caseNumber', label: 'Số vụ việc', sortable: true }, { key: 'caseName', label: 'Tên vụ việc' }, { key: 'status', label: 'Trạng thái' }]}
      data={[{ id: 1, caseNumber: 'VV-001/2025', caseName: 'Tranh chấp lao động', status: 'Đang xử lý', updatedAt: '09/12/2025' }]}
      searchFields={[{ label: 'Số vụ việc', name: 'caseNumber', type: 'text' }]}
      detailFields={[{ label: 'Số vụ việc', key: 'caseNumber' }]}
      apiEndpoint="https://api.btp.gov.vn/v1/legal-aid/cases"
      lastSyncTime="09/12/2025 13:15:30"
      onSync={() => toast.info('Đang đồng bộ vụ việc trợ giúp pháp lý...')}
    />
  );
}
