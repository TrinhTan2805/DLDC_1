import { useState } from 'react';
import { Database, FileText, Clock } from 'lucide-react';
import { GenericDataTable } from '../../common/GenericDataTable';

export function ProcessingCivilRegistryPage() {
  // Sample data for the data table
  const sampleData = [
    { id: 1, recordId: 'HTD-2025-001234', fullName: 'Nguyễn Văn A', birthDate: '15/03/1990', idNumber: '001234567890', status: 'Đã xử lý' },
    { id: 2, recordId: 'HTD-2025-001235', fullName: 'Trần Thị B', birthDate: '20/08/1985', idNumber: '001234567891', status: 'Đang xử lý' },
    { id: 3, recordId: 'HTD-2025-001236', fullName: 'Lê Văn C', birthDate: '10/12/1992', idNumber: '001234567892', status: 'Đã xử lý' },
  ];

  const totalRecords = sampleData.length;
  const lastUpdated = '05/01/2026 14:30';

  return (
    <div className="space-y-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Summary Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs text-purple-700 mb-1">Tổng số bản ghi</div>
              <div className="text-2xl text-purple-900">{totalRecords.toLocaleString()}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs text-blue-700 mb-1">Cập nhật lần cuối</div>
              <div className="text-base text-blue-900">{lastUpdated}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <GenericDataTable
          title="Dữ liệu Hộ tịch điện tử"
          description="Danh sách dữ liệu từ CSDL Hộ tịch điện tử"
          icon={Database}
          iconColor="purple"
          columns={[
            { key: 'recordId', label: 'Mã bản ghi', sortable: true },
            { key: 'fullName', label: 'Họ và tên', sortable: true },
            { key: 'birthDate', label: 'Ngày sinh', sortable: true },
            { key: 'idNumber', label: 'Số CCCD', sortable: true },
            { key: 'status', label: 'Trạng thái', sortable: false }
          ]}
          data={sampleData}
          searchFields={[
            { label: 'Mã bản ghi', name: 'recordId', type: 'text' },
            { label: 'Họ và tên', name: 'fullName', type: 'text' },
            { label: 'Số CCCD', name: 'idNumber', type: 'text' }
          ]}
          detailFields={[
            { label: 'Mã bản ghi', key: 'recordId' },
            { label: 'Họ và tên', key: 'fullName' },
            { label: 'Ngày sinh', key: 'birthDate' },
            { label: 'Số CCCD', key: 'idNumber' },
            { label: 'Trạng thái', key: 'status' }
          ]}
        />
      </div>
    </div>
  );
}