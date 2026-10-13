import { toast } from 'sonner';
import { FileBadge } from 'lucide-react';
import { GenericDataTable } from '../../common/GenericDataTable';

const mockData = [
  { id: 1, certificateNumber: 'GKT-001/2025', fullName: 'Nguyễn Văn R', deathDate: '05/03/2025', deathPlace: 'BV Chợ Rẫy', deathCause: 'Bệnh tim', age: '75', registrar: 'UBND Phường 3', status: 'Đã cấp', updatedAt: '09/12/2025' },
  { id: 2, certificateNumber: 'GKT-002/2025', fullName: 'Trần Thị S', deathDate: '10/04/2025', deathPlace: 'Tại nhà', deathCause: 'Tuổi già', age: '82', registrar: 'UBND Phường 7', status: 'Đã cấp', updatedAt: '09/12/2025' },
];

export function DeathCertificatePage() {
  return (
    <GenericDataTable
      title="Bản khai tử"
      description="Quản lý giấy khai tử"
      icon={FileBadge}
      iconColor="slate"
      columns={[
        { key: 'certificateNumber', label: 'Số giấy', sortable: true },
        { key: 'fullName', label: 'Họ tên', sortable: true },
        { key: 'deathDate', label: 'Ngày mất' },
        { key: 'age', label: 'Tuổi' },
        { key: 'deathPlace', label: 'Nơi mất' },
        { key: 'deathCause', label: 'Nguyên nhân' },
        { key: 'status', label: 'Trạng thái' },
      ]}
      data={mockData}
      searchFields={[
        { label: 'Số giấy khai tử', name: 'certificateNumber', type: 'text' },
        { label: 'Họ tên', name: 'fullName', type: 'text' },
      ]}
      detailFields={[
        { label: 'Số giấy khai tử', key: 'certificateNumber' },
        { label: 'Họ tên', key: 'fullName' },
        { label: 'Ngày mất', key: 'deathDate' },
        { label: 'Tuổi', key: 'age' },
        { label: 'Nơi mất', key: 'deathPlace' },
        { label: 'Nguyên nhân', key: 'deathCause' },
        { label: 'Cơ quan đăng ký', key: 'registrar' },
        { label: 'Trạng thái', key: 'status' },
        { label: 'Ngày cập nhật', key: 'updatedAt' },
      ]}
      apiEndpoint="https://api.btp.gov.vn/v1/civil-registry/death"
      lastSyncTime="09/12/2025 11:15:25"
      onSync={() => toast.info('Đang đồng bộ dữ liệu khai tử...')}
    />
  );
}
