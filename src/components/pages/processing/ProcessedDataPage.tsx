import { useState } from 'react';
import { Search, Filter, Upload, Download, Eye, FileText, Clock } from 'lucide-react';

interface ProcessedDataPageProps {
  title: string;
  dataType: string;
  totalRecords?: number;
  lastUpdated?: string;
}

export function ProcessedDataPage({ 
  title, 
  dataType,
  totalRecords = 3,
  lastUpdated = '05/01/2026 14:30'
}: ProcessedDataPageProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data based on data type
  const getSampleData = () => {
    // Default structure for civil registry data
    if (dataType.includes('khai sinh') || dataType.includes('Hộ tịch')) {
      return [
        {
          id: 1,
          province: 'Không sửa',
          code: 'HTD-2025-001234',
          name: 'Nguyễn Văn A',
          birthDate: '15/03/1990',
          idNumber: '001234567890',
          status: 'Đã xử lý',
        },
        {
          id: 2,
          province: 'Không sửa',
          code: 'HTD-2025-001235',
          name: 'Trần Thị B',
          birthDate: '20/08/1985',
          idNumber: '001234567891',
          status: 'Đang xử lý',
        },
        {
          id: 3,
          province: 'Không sửa',
          code: 'HTD-2025-001236',
          name: 'Lê Văn C',
          birthDate: '10/12/1992',
          idNumber: '001234567892',
          status: 'Đã xử lý',
        },
      ];
    }

    // Default generic data
    return [
      {
        id: 1,
        province: 'Không sửa',
        code: 'DL-2025-001234',
        name: 'Dữ liệu A',
        birthDate: '15/03/2025',
        idNumber: '001234567890',
        status: 'Đã xử lý',
      },
      {
        id: 2,
        province: 'Không sửa',
        code: 'DL-2025-001235',
        name: 'Dữ liệu B',
        birthDate: '20/08/2025',
        idNumber: '001234567891',
        status: 'Đang xử lý',
      },
      {
        id: 3,
        province: 'Không sửa',
        code: 'DL-2025-001236',
        name: 'Dữ liệu C',
        birthDate: '10/12/2025',
        idNumber: '001234567892',
        status: 'Đã xử lý',
      },
    ];
  };

  const data = getSampleData();

  return (
    <div className="space-y-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-slate-600">Tổng số bản ghi</div>
              <div className="text-2xl font-semibold text-slate-900 mt-1">{totalRecords}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-slate-600">Cập nhật lần cuối</div>
              <div className="text-lg font-semibold text-slate-900 mt-1">{lastUpdated}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-slate-200 rounded-lg">
        {/* Search and Action Bar */}
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-700">
              <Filter className="w-4 h-4" />
              <span>Tìm kiếm nâng cao</span>
            </button>
            <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-700">
              <Upload className="w-4 h-4" />
              <span>Nhập</span>
            </button>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>Xuất</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  STT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  TỈNH/THÀNH
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  MÃ BẢN GHI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  HỌ VÀ TÊN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  NGÀY SINH
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  SỐ CCCD
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  TRẠNG THÁI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  THAO TÁC
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {row.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    {row.province}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {row.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {row.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {row.birthDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {row.idNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs rounded ${
                      row.status === 'Đã xử lý' 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-800" title="Xem chi tiết" aria-label="Xem chi tiết">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
