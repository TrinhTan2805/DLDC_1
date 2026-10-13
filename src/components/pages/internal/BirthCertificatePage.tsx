import { toast } from 'sonner';
import { Baby } from 'lucide-react';
import { GenericDataTable } from '../../common/GenericDataTable';

const mockData = [
  { id: 1, certificateNumber: 'GKS-001/2025', childName: 'Nguyễn Văn H', birthDate: '01/01/2025', birthPlace: 'BV Từ Dũ', fatherName: 'Nguyễn Văn I', motherName: 'Trần Thị K', registrar: 'UBND Phường 1', status: 'Đã cấp', updatedAt: '09/12/2025' },
  { id: 2, certificateNumber: 'GKS-002/2025', childName: 'Trần Thị L', birthDate: '15/01/2025', birthPlace: 'BV Phụ Sản', fatherName: 'Trần Văn M', motherName: 'Lê Thị N', registrar: 'UBND Phường 5', status: 'Đã cấp', updatedAt: '09/12/2025' },
  { id: 3, certificateNumber: 'GKS-003/2025', childName: 'Lê Văn O', birthDate: '20/02/2025', birthPlace: 'BV Hùng Vương', fatherName: 'Lê Văn P', motherName: 'Phạm Thị Q', registrar: 'UBND Phường 10', status: 'Đã cấp', updatedAt: '09/12/2025' },
];

export function BirthCertificatePage() {
  return (
    <GenericDataTable
      title="Bản khai sinh"
      description="Quản lý giấy khai sinh"
      icon={Baby}
      iconColor="pink"
      columns={[
        { key: 'certificateNumber', label: 'Số giấy', sortable: true },
        { key: 'childName', label: 'Tên trẻ', sortable: true },
        { key: 'birthDate', label: 'Ngày sinh' },
        { key: 'birthPlace', label: 'Nơi sinh' },
        { key: 'fatherName', label: 'Tên bố' },
        { key: 'motherName', label: 'Tên mẹ' },
        { key: 'status', label: 'Trạng thái' },
      ]}
      data={mockData}
      searchFields={[
        { label: 'Số giấy khai sinh', name: 'certificateNumber', type: 'text' },
        { label: 'Tên trẻ', name: 'childName', type: 'text' },
        { label: 'Tên bố', name: 'fatherName', type: 'text' },
        { label: 'Tên mẹ', name: 'motherName', type: 'text' },
      ]}
      detailFields={[
        { label: 'Số giấy khai sinh', key: 'certificateNumber' },
        { label: 'Tên trẻ', key: 'childName' },
        { label: 'Ngày sinh', key: 'birthDate' },
        { label: 'Nơi sinh', key: 'birthPlace' },
        { label: 'Tên bố', key: 'fatherName' },
        { label: 'Tên mẹ', key: 'motherName' },
        { label: 'Cơ quan đăng ký', key: 'registrar' },
        { label: 'Trạng thái', key: 'status' },
        { label: 'Ngày cập nhật', key: 'updatedAt' },
      ]}
      apiEndpoint="https://api.btp.gov.vn/v1/civil-registry/birth"
      lastSyncTime="09/12/2025 12:30:40"
      onSync={() => toast.info('Đang đồng bộ dữ liệu khai sinh...')}
    />
  );
}
