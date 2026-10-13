import { toast } from 'sonner';
import { Building2 } from 'lucide-react';
import { GenericDataTable } from '../../common/GenericDataTable';

const mockData = [
  { id: 1, documentNumber: 'NĐ 45/2025/NĐ-CP', title: 'Nghị định về thuế thu nhập doanh nghiệp', issueDate: '20/05/2025', effectiveDate: '01/07/2025', status: 'Có hiệu lực', updatedAt: '09/12/2025' },
];

export function GovernmentDocPage() {
  return (
    <GenericDataTable
      title="Văn bản Chính phủ"
      description="Quản lý văn bản do Chính phủ ban hành"
      icon={Building2}
      iconColor="blue"
      columns={[
        { key: 'documentNumber', label: 'Số/Ký hiệu', sortable: true },
        { key: 'title', label: 'Trích yếu', sortable: true },
        { key: 'issueDate', label: 'Ngày ban hành' },
        { key: 'status', label: 'Trạng thái' },
      ]}
      data={mockData}
      searchFields={[
        { label: 'Số/Ký hiệu', name: 'documentNumber', type: 'text' },
        { label: 'Trích yếu', name: 'title', type: 'text' },
      ]}
      detailFields={[
        { label: 'Số/Ký hiệu', key: 'documentNumber' },
        { label: 'Trích yếu', key: 'title' },
        { label: 'Ngày ban hành', key: 'issueDate' },
        { label: 'Ngày hiệu lực', key: 'effectiveDate' },
        { label: 'Trạng thái', key: 'status' },
        { label: 'Ngày cập nhật', key: 'updatedAt' },
      ]}
      apiEndpoint="https://api.btp.gov.vn/v1/legal-documents/government"
      lastSyncTime="09/12/2025 15:50:20"
      onSync={() => toast.info('Đang đồng bộ văn bản Chính phủ...')}
    />
  );
}
