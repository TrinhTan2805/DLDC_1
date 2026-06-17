import { FileUser } from 'lucide-react';
import { GenericDataTable } from '../../common/GenericDataTable';

const mockData = [
  { id: 1, type: 'Khai sinh', recordNumber: 'HT-KS-001/2025', fullName: 'Nguyễn Văn D', registrationDate: '15/01/2025', registrar: 'UBND Phường 1', status: 'Đã cấp', updatedAt: '09/12/2025' },
  { id: 2, type: 'Khai tử', recordNumber: 'HT-KT-002/2025', fullName: 'Trần Thị E', registrationDate: '20/02/2025', registrar: 'UBND Phường 2', status: 'Đã cấp', updatedAt: '09/12/2025' },
  { id: 3, type: 'Khai hôn nhân', recordNumber: 'HT-HN-003/2025', fullName: 'Lê Văn F & Phạm Thị G', registrationDate: '10/03/2025', registrar: 'UBND Quận 1', status: 'Đã cấp', updatedAt: '09/12/2025' },
];

export function CivilRegistryPage() {
  return (
    <GenericDataTable
      title="Hệ thống quản lý Bộ Tư Pháp hộ tịch"
      description="Quản lý toàn bộ hồ sơ hộ tịch"
      icon={FileUser}
      iconColor="blue"
      columns={[
        { key: 'type', label: 'Loại', sortable: true },
        { key: 'recordNumber', label: 'Số hồ sơ', sortable: true },
        { key: 'fullName', label: 'Họ tên' },
        { key: 'registrationDate', label: 'Ngày đăng ký' },
        { key: 'registrar', label: 'Cơ quan đăng ký' },
        { key: 'status', label: 'Trạng thái' },
      ]}
      data={mockData}
      searchFields={[
        { label: 'Số hồ sơ', name: 'recordNumber', type: 'text' },
        { label: 'Họ tên', name: 'fullName', type: 'text' },
        { label: 'Loại', name: 'type', type: 'select', options: ['Khai sinh', 'Khai tử', 'Khai hôn nhân', 'Khai ly hôn'] },
        { label: 'Trạng thái', name: 'status', type: 'select', options: ['Đã cấp', 'Đang xử lý', 'Hủy'] },
      ]}
      detailFields={[
        { label: 'Loại', key: 'type' },
        { label: 'Số hồ sơ', key: 'recordNumber' },
        { label: 'Họ tên', key: 'fullName' },
        { label: 'Ngày đăng ký', key: 'registrationDate' },
        { label: 'Cơ quan đăng ký', key: 'registrar' },
        { label: 'Trạng thái', key: 'status' },
        { label: 'Ngày cập nhật', key: 'updatedAt' },
      ]}
      apiEndpoint="https://api.btp.gov.vn/v1/civil-registry/all"
      lastSyncTime="09/12/2025 13:45:15"
      onSync={() => alert('Đang đồng bộ dữ liệu hộ tịch...')}
    />
  );
}
