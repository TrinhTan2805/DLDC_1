import { toast } from 'sonner';
import { FileCheck } from 'lucide-react';
import { GenericDataTable } from '../../common/GenericDataTable';

export function NotaryContractPage() {
  return (
    <GenericDataTable
      title="Hợp đồng công chứng"
      description="Quản lý hợp đồng công chứng"
      icon={FileCheck}
      iconColor="green"
      columns={[
        { key: 'contractNumber', label: 'Số HĐ', sortable: true },
        { key: 'contractType', label: 'Loại HĐ', sortable: true },
        { key: 'parties', label: 'Các bên' },
        { key: 'notaryDate', label: 'Ngày công chứng' },
        { key: 'status', label: 'Trạng thái' },
      ]}
      data={[{ id: 1, contractNumber: 'HĐ-001/2025', contractType: 'Mua bán', parties: 'A & B', notaryDate: '15/05/2025', status: 'Hoàn thành', updatedAt: '09/12/2025' }]}
      searchFields={[{ label: 'Số HĐ', name: 'contractNumber', type: 'text' }]}
      detailFields={[{ label: 'Số HĐ', key: 'contractNumber' }, { label: 'Loại HĐ', key: 'contractType' }]}
      apiEndpoint="https://api.btp.gov.vn/v1/notary/contracts"
      lastSyncTime="09/12/2025 15:05:40"
      onSync={() => toast.info('Đang đồng bộ hợp đồng công chứng...')}
    />
  );
}
