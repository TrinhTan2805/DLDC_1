import { toast } from 'sonner';
import { ScrollText as DocumentText } from 'lucide-react';
import { GenericDataTable } from '../../common/GenericDataTable';

export function NotaryDocumentPage() {
  return (
    <GenericDataTable
      title="Văn bản công chứng"
      description="Quản lý văn bản công chứng"
      icon={DocumentText}
      iconColor="teal"
      columns={[{ key: 'documentNumber', label: 'Số VB', sortable: true }, { key: 'documentType', label: 'Loại VB' }, { key: 'status', label: 'Trạng thái' }]}
      data={[{ id: 1, documentNumber: 'VB-001/2025', documentType: 'Chứng thực chữ ký', status: 'Hoàn thành', updatedAt: '09/12/2025' }]}
      searchFields={[{ label: 'Số VB', name: 'documentNumber', type: 'text' }]}
      detailFields={[{ label: 'Số VB', key: 'documentNumber' }]}
      apiEndpoint="https://api.btp.gov.vn/v1/notary/documents"
      lastSyncTime="09/12/2025 14:40:25"
      onSync={() => toast.info('Đang đồng bộ văn bản công chứng...')}
    />
  );
}
