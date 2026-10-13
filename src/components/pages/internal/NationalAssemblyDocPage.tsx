import { toast } from 'sonner';
import { Landmark } from 'lucide-react';
import { GenericDataTable } from '../../common/GenericDataTable';

const mockData = [
  { id: 1, documentNumber: 'Luật 12/2025/QH', title: 'Luật sửa đổi Bộ luật dân sự', issueDate: '15/06/2025', effectiveDate: '01/01/2026', session: 'Kỳ họp thứ 9', status: 'Có hiệu lực', updatedAt: '09/12/2025' },
];

export function NationalAssemblyDocPage() {
  return (
    <GenericDataTable
      title="Văn bản Quốc hội"
      description="Quản lý văn bản do Quốc hội ban hành"
      icon={Landmark}
      iconColor="red"
      columns={[
        { key: 'documentNumber', label: 'Số/Ký hiệu', sortable: true },
        { key: 'title', label: 'Trích yếu', sortable: true },
        { key: 'issueDate', label: 'Ngày ban hành' },
        { key: 'effectiveDate', label: 'Ngày hiệu lực' },
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
        { label: 'Kỳ họp', key: 'session' },
        { label: 'Trạng thái', key: 'status' },
        { label: 'Ngày cập nhật', key: 'updatedAt' },
      ]}
      apiEndpoint="https://api.btp.gov.vn/v1/legal-documents/national-assembly"
      lastSyncTime="09/12/2025 16:10:45"
      onSync={() => toast.info('Đang đồng bộ văn bản Quốc hội...')}
    />
  );
}
