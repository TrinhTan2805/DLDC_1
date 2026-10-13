import { toast } from 'sonner';
import { Stamp } from 'lucide-react';
import { GenericDataTable } from '../../common/GenericDataTable';

const mockData = [
  { id: 1, contractNumber: 'CC-001/2025', contractType: 'Mua bán nhà đất', notaryOffice: 'Phòng công chứng số 1', parties: 'Nguyễn Văn A & Trần Thị B', notaryDate: '15/05/2025', notaryFee: '15.000.000 đ', status: 'Hoàn thành', updatedAt: '09/12/2025' },
  { id: 2, contractNumber: 'CC-002/2025', contractType: 'Cho thuê nhà', notaryOffice: 'Phòng công chứng số 2', parties: 'Lê Văn C & Phạm Thị D', notaryDate: '20/06/2025', notaryFee: '3.000.000 đ', status: 'Hoàn thành', updatedAt: '09/12/2025' },
  { id: 3, contractNumber: 'CC-003/2025', contractType: 'Vay tài sản', notaryOffice: 'Phòng công chứng số 3', parties: 'Võ Văn E & Ngô Thị F', notaryDate: '25/07/2025', notaryFee: '5.000.000 đ', status: 'Hoàn thành', updatedAt: '09/12/2025' },
];

export function NotarySystemPage() {
  return (
    <GenericDataTable
      title="Hệ thống công chứng"
      description="Quản lý hoạt động công chứng"
      icon={Stamp}
      iconColor="emerald"
      columns={[
        { key: 'contractNumber', label: 'Số hợp đồng', sortable: true },
        { key: 'contractType', label: 'Loại hợp đồng', sortable: true },
        { key: 'notaryOffice', label: 'Phòng công chứng' },
        { key: 'parties', label: 'Các bên' },
        { key: 'notaryDate', label: 'Ngày công chứng' },
        { key: 'status', label: 'Trạng thái' },
      ]}
      data={mockData}
      searchFields={[
        { label: 'Số hợp đồng', name: 'contractNumber', type: 'text' },
        { label: 'Loại hợp đồng', name: 'contractType', type: 'select', options: ['Mua bán nhà đất', 'Cho thuê nhà', 'Vay tài sản', 'Tặng cho'] },
        { label: 'Phòng công chứng', name: 'notaryOffice', type: 'text' },
      ]}
      detailFields={[
        { label: 'Số hợp đồng', key: 'contractNumber' },
        { label: 'Loại hợp đồng', key: 'contractType' },
        { label: 'Phòng công chứng', key: 'notaryOffice' },
        { label: 'Các bên tham gia', key: 'parties' },
        { label: 'Ngày công chứng', key: 'notaryDate' },
        { label: 'Phí công chứng', key: 'notaryFee' },
        { label: 'Trạng thái', key: 'status' },
        { label: 'Ngày cập nhật', key: 'updatedAt' },
      ]}
      apiEndpoint="https://api.btp.gov.vn/v1/notary/all"
      lastSyncTime="09/12/2025 15:25:50"
      onSync={() => toast.info('Đang đồng bộ dữ liệu công chứng...')}
    />
  );
}
