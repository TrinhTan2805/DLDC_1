import { toast } from 'sonner';
import { BookOpen } from 'lucide-react';
import { GenericDataTable } from '../../common/GenericDataTable';

const mockData = [
  { id: 1, documentNumber: 'QH-001/2025', documentType: 'Luật', title: 'Luật Đất đai (sửa đổi)', issuingBody: 'Quốc hội', issueDate: '15/06/2025', effectiveDate: '01/01/2026', status: 'Có hiệu lực', updatedAt: '09/12/2025' },
  { id: 2, documentNumber: 'CP-045/2025', documentType: 'Nghị định', title: 'Nghị định về thuế GTGT', issuingBody: 'Chính phủ', issueDate: '20/05/2025', effectiveDate: '01/07/2025', status: 'Có hiệu lực', updatedAt: '09/12/2025' },
  { id: 3, documentNumber: 'TT-112/2025', documentType: 'Thông tư', title: 'Thông tư hướng dẫn công chứng', issuingBody: 'Cơ quan chuyên ngành', issueDate: '10/04/2025', effectiveDate: '01/06/2025', status: 'Có hiệu lực', updatedAt: '09/12/2025' },
];

export function LegalDocumentSystemPage() {
  return (
    <GenericDataTable
      title="Hệ thống văn bản pháp luật"
      description="Quản lý văn bản pháp luật toàn quốc"
      icon={BookOpen}
      iconColor="indigo"
      columns={[
        { key: 'documentNumber', label: 'Số/Ký hiệu', sortable: true },
        { key: 'documentType', label: 'Loại văn bản', sortable: true },
        { key: 'title', label: 'Trích yếu', sortable: true },
        { key: 'issuingBody', label: 'Cơ quan ban hành' },
        { key: 'issueDate', label: 'Ngày ban hành' },
        { key: 'status', label: 'Trạng thái' },
      ]}
      data={mockData}
      searchFields={[
        { label: 'Số/Ký hiệu', name: 'documentNumber', type: 'text' },
        { label: 'Trích yếu', name: 'title', type: 'text' },
        { label: 'Loại văn bản', name: 'documentType', type: 'select', options: ['Luật', 'Nghị định', 'Thông tư', 'Quyết định'] },
        { label: 'Cơ quan ban hành', name: 'issuingBody', type: 'select', options: ['Quốc hội', 'Chính phủ', 'Cơ quan chuyên ngành'] },
      ]}
      detailFields={[
        { label: 'Số/Ký hiệu', key: 'documentNumber' },
        { label: 'Loại văn bản', key: 'documentType' },
        { label: 'Trích yếu', key: 'title' },
        { label: 'Cơ quan ban hành', key: 'issuingBody' },
        { label: 'Ngày ban hành', key: 'issueDate' },
        { label: 'Ngày có hiệu lực', key: 'effectiveDate' },
        { label: 'Trạng thái', key: 'status' },
        { label: 'Ngày cập nhật', key: 'updatedAt' },
      ]}
      apiEndpoint="https://api.btp.gov.vn/v1/legal-documents/all"
      lastSyncTime="09/12/2025 16:40:35"
      onSync={() => toast.info('Đang đồng bộ dữ liệu văn bản pháp luật...')}
    />
  );
}
