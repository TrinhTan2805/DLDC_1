import { Coins } from 'lucide-react';
import { GenericDataTable } from '../../common/GenericDataTable';

export function StateCompensationPage() {
  return (
    <GenericDataTable
      title="Hệ thống quản lý Bộ Tư Pháp bồi thường nhà nước"
      description="Quản lý hồ sơ bồi thường nhà nước"
      icon={Coins}
      iconColor="yellow"
      columns={[{ key: 'caseNumber', label: 'Số hồ sơ', sortable: true }, { key: 'applicantName', label: 'Người yêu cầu' }, { key: 'amount', label: 'Số tiền' }, { key: 'status', label: 'Trạng thái' }]}
      data={[{ id: 1, caseNumber: 'BT-001/2025', applicantName: 'Nguyễn Văn Y', amount: '50.000.000 đ', status: 'Đang xử lý', updatedAt: '09/12/2025' }]}
      searchFields={[{ label: 'Số hồ sơ', name: 'caseNumber', type: 'text' }]}
      detailFields={[{ label: 'Số hồ sơ', key: 'caseNumber' }, { label: 'Người yêu cầu', key: 'applicantName' }]}
      apiEndpoint="https://api.btp.gov.vn/v1/compensation/all"
      lastSyncTime="09/12/2025 11:45:35"
      onSync={() => alert('Đang đồng bộ dữ liệu bồi thường nhà nước...')}
    />
  );
}
