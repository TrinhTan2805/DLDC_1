import { toast } from 'sonner';
import { Users } from 'lucide-react';
import { GenericDataTable } from '../../common/GenericDataTable';

const mockData = [
  { id: 1, certificateNumber: 'NCMC-001/2025', childName: 'Nguyễn Văn BB', adoptiveParent: 'Trần Văn CC & Lê Thị DD', adoptionDate: '10/06/2025', registrar: 'UBND Quận 5', status: 'Đã cấp', updatedAt: '09/12/2025' },
];

export function AdoptionCertificatePage() {
  return (
    <GenericDataTable
      title="Bản khai nhận cha, mẹ, con"
      description="Quản lý giấy nhận con nuôi"
      icon={Users}
      iconColor="teal"
      columns={[
        { key: 'certificateNumber', label: 'Số giấy', sortable: true },
        { key: 'childName', label: 'Tên con', sortable: true },
        { key: 'adoptiveParent', label: 'Cha mẹ nhận' },
        { key: 'adoptionDate', label: 'Ngày nhận' },
        { key: 'registrar', label: 'Cơ quan đăng ký' },
        { key: 'status', label: 'Trạng thái' },
      ]}
      data={mockData}
      searchFields={[
        { label: 'Số giấy', name: 'certificateNumber', type: 'text' },
        { label: 'Tên con', name: 'childName', type: 'text' },
      ]}
      detailFields={[
        { label: 'Số giấy', key: 'certificateNumber' },
        { label: 'Tên con', key: 'childName' },
        { label: 'Cha mẹ nhận', key: 'adoptiveParent' },
        { label: 'Ngày nhận', key: 'adoptionDate' },
        { label: 'Cơ quan đăng ký', key: 'registrar' },
        { label: 'Trạng thái', key: 'status' },
        { label: 'Ngày cập nhật', key: 'updatedAt' },
      ]}
      apiEndpoint="https://api.btp.gov.vn/v1/civil-registry/adoption"
      lastSyncTime="09/12/2025 08:30:45"
      onSync={() => toast.info('Đang đồng bộ dữ liệu nhận con nuôi...')}
    />
  );
}
