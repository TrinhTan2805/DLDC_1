import { toast } from 'sonner';
import { Scale } from 'lucide-react';
import { GenericDataTable } from '../../common/GenericDataTable';

export function MojDocPage() {
  return (
    <GenericDataTable
      title="Tài liệu chuyên ngành"
      description="Quản lý tài liệu chuyên ngành"
      icon={Scale}
      iconColor="violet"
      columns={[
        { key: 'documentNumber', label: 'Số/Ký hiệu', sortable: true },
        { key: 'title', label: 'Trích yếu', sortable: true },
        { key: 'issueDate', label: 'Ngày ban hành' },
        { key: 'status', label: 'Trạng thái' },
      ]}
      data={[
        { id: 1, documentNumber: 'TT 08/2025/TT-BTP', title: 'Thông tư hướng dẫn hộ tịch', issueDate: '10/04/2025', status: 'Có hiệu lực', updatedAt: '09/12/2025' },
      ]}
      searchFields={[
        { label: 'Số/Ký hiệu', name: 'documentNumber', type: 'text' },
        { label: 'Trích yếu', name: 'title', type: 'text' },
      ]}
      detailFields={[
        { label: 'Số/Ký hiệu', key: 'documentNumber' },
        { label: 'Trích yếu', key: 'title' },
        { label: 'Ngày ban hành', key: 'issueDate' },
        { label: 'Trạng thái', key: 'status' },
      ]}
      apiEndpoint="https://api.btp.gov.vn/v1/legal-documents/moj"
      lastSyncTime="09/12/2025 15:30:15"
      onSync={() => toast.info('Đang đồng bộ tài liệu chuyên ngành...')}
    />
  );
}
