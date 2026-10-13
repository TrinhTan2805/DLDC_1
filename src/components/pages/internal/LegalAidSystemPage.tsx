import { toast } from 'sonner';
import { HandHeart } from 'lucide-react';
import { GenericDataTable } from '../../common/GenericDataTable';

const mockData = [
  { id: 1, caseNumber: 'TGPL-001/2025', caseName: 'Tranh chấp lao động', applicantName: 'Nguyễn Văn G', caseType: 'Dân sự', aidCenter: 'Trung tâm TGPL TP.HCM', startDate: '10/02/2025', status: 'Đang xử lý', updatedAt: '09/12/2025' },
  { id: 2, caseNumber: 'TGPL-002/2025', caseName: 'Ly hôn và phân chia tài sản', applicantName: 'Trần Thị H', caseType: 'Hôn nhân gia đình', aidCenter: 'Trung tâm TGPL Hà Nội', startDate: '15/03/2025', status: 'Hoàn thành', updatedAt: '09/12/2025' },
];

export function LegalAidSystemPage() {
  return (
    <GenericDataTable
      title="Hệ thống trợ giúp pháp lý"
      description="Quản lý vụ việc trợ giúp pháp lý"
      icon={HandHeart}
      iconColor="rose"
      columns={[
        { key: 'caseNumber', label: 'Số hồ sơ', sortable: true },
        { key: 'caseName', label: 'Tên vụ việc', sortable: true },
        { key: 'applicantName', label: 'Người được trợ giúp' },
        { key: 'caseType', label: 'Loại vụ việc' },
        { key: 'aidCenter', label: 'Trung tâm TGPL' },
        { key: 'status', label: 'Trạng thái' },
      ]}
      data={mockData}
      searchFields={[
        { label: 'Số hồ sơ', name: 'caseNumber', type: 'text' },
        { label: 'Tên vụ việc', name: 'caseName', type: 'text' },
        { label: 'Người được trợ giúp', name: 'applicantName', type: 'text' },
        { label: 'Loại vụ việc', name: 'caseType', type: 'select', options: ['Dân sự', 'Hình sự', 'Hành chính', 'Hôn nhân gia đình'] },
      ]}
      detailFields={[
        { label: 'Số hồ sơ', key: 'caseNumber' },
        { label: 'Tên vụ việc', key: 'caseName' },
        { label: 'Người được trợ giúp', key: 'applicantName' },
        { label: 'Loại vụ việc', key: 'caseType' },
        { label: 'Trung tâm TGPL', key: 'aidCenter' },
        { label: 'Ngày tiếp nhận', key: 'startDate' },
        { label: 'Trạng thái', key: 'status' },
        { label: 'Ngày cập nhật', key: 'updatedAt' },
      ]}
      apiEndpoint="https://api.btp.gov.vn/v1/legal-aid/all"
      lastSyncTime="09/12/2025 13:30:25"
      onSync={() => toast.info('Đang đồng bộ dữ liệu trợ giúp pháp lý...')}
    />
  );
}
