import { toast } from 'sonner';
import { Factory } from 'lucide-react';
import { GenericDataTable } from '../../common/GenericDataTable';

const mockData = [
  { id: 1, taxCode: '0123456789', businessName: 'Công ty TNHH ABC', businessType: 'TNHH', registrationDate: '10/01/2020', address: 'Quận 1, TP.HCM', capital: '10.000.000.000 đ', status: 'Hoạt động', updatedAt: '09/12/2025' },
  { id: 2, taxCode: '0987654321', businessName: 'Công ty Cổ phần XYZ', businessType: 'Cổ phần', registrationDate: '15/03/2021', address: 'Quận 3, TP.HCM', capital: '50.000.000.000 đ', status: 'Hoạt động', updatedAt: '09/12/2025' },
  { id: 3, taxCode: '0555555555', businessName: 'Doanh nghiệp tư nhân DEF', businessType: 'Tư nhân', registrationDate: '20/06/2022', address: 'Quận 7, TP.HCM', capital: '1.000.000.000 đ', status: 'Hoạt động', updatedAt: '09/12/2025' },
];

export function BusinessRegistryPage() {
  return (
    <GenericDataTable
      title="Hệ thống đăng ký kinh doanh"
      description="Quản lý hồ sơ đăng ký kinh doanh"
      icon={Factory}
      iconColor="cyan"
      columns={[
        { key: 'taxCode', label: 'Mã số thuế', sortable: true },
        { key: 'businessName', label: 'Tên doanh nghiệp', sortable: true },
        { key: 'businessType', label: 'Loại hình' },
        { key: 'registrationDate', label: 'Ngày đăng ký' },
        { key: 'capital', label: 'Vốn điều lệ' },
        { key: 'status', label: 'Trạng thái' },
      ]}
      data={mockData}
      searchFields={[
        { label: 'Mã số thuế', name: 'taxCode', type: 'text' },
        { label: 'Tên doanh nghiệp', name: 'businessName', type: 'text' },
        { label: 'Loại hình', name: 'businessType', type: 'select', options: ['TNHH', 'Cổ phần', 'Tư nhân'] },
        { label: 'Trạng thái', name: 'status', type: 'select', options: ['Hoạt động', 'Ngừng hoạt động', 'Giải thể'] },
      ]}
      detailFields={[
        { label: 'Mã số thuế', key: 'taxCode' },
        { label: 'Tên doanh nghiệp', key: 'businessName' },
        { label: 'Loại hình', key: 'businessType' },
        { label: 'Ngày đăng ký', key: 'registrationDate' },
        { label: 'Địa chỉ', key: 'address' },
        { label: 'Vốn điều lệ', key: 'capital' },
        { label: 'Trạng thái', key: 'status' },
        { label: 'Ngày cập nhật', key: 'updatedAt' },
      ]}
      apiEndpoint="https://api.btp.gov.vn/v1/business-registry/all"
      lastSyncTime="09/12/2025 14:50:40"
      onSync={() => toast.info('Đang đồng bộ dữ liệu đăng ký kinh doanh...')}
    />
  );
}
