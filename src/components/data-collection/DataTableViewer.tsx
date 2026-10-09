import { useState } from 'react';
import { X, Download, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface DataTableViewerProps {
  isOpen: boolean;
  onClose: () => void;
  fileTitle: string;
  dataType: string;
}

interface TableRow {
  [key: string]: any;
}

export function DataTableViewer({ isOpen, onClose, fileTitle, dataType }: DataTableViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  // Mock data based on data type
  const getMockData = (): { columns: string[]; rows: TableRow[] } => {
    if (dataType.includes('Hộ tịch')) {
      return {
        columns: ['STT', 'Họ và tên', 'Ngày sinh', 'Giới tính', 'Nơi sinh', 'Số giấy khai sinh', 'Ngày cấp'],
        rows: [
          {
            STT: 1,
            'Họ và tên': 'Nguyễn Văn An',
            'Ngày sinh': '15/03/2023',
            'Giới tính': 'Nam',
            'Nơi sinh': 'Bệnh viện Bạch Mai, Hà Nội',
            'Số giấy khai sinh': 'KS-2023-001234',
            'Ngày cấp': '20/03/2023',
          },
          {
            STT: 2,
            'Họ và tên': 'Trần Thị Bình',
            'Ngày sinh': '22/04/2023',
            'Giới tính': 'Nữ',
            'Nơi sinh': 'Bệnh viện Phụ sản Hà Nội',
            'Số giấy khai sinh': 'KS-2023-001235',
            'Ngày cấp': '25/04/2023',
          },
          {
            STT: 3,
            'Họ và tên': 'Lê Minh Cường',
            'Ngày sinh': '10/05/2023',
            'Giới tính': 'Nam',
            'Nơi sinh': 'Bệnh viện Việt Đức, Hà Nội',
            'Số giấy khai sinh': 'KS-2023-001236',
            'Ngày cấp': '12/05/2023',
          },
          {
            STT: 4,
            'Họ và tên': 'Phạm Thu Dung',
            'Ngày sinh': '18/06/2023',
            'Giới tính': 'Nữ',
            'Nơi sinh': 'Bệnh viện Hùng Vương, TP.HCM',
            'Số giấy khai sinh': 'KS-2023-001237',
            'Ngày cấp': '20/06/2023',
          },
          {
            STT: 5,
            'Họ và tên': 'Hoàng Văn Em',
            'Ngày sinh': '05/07/2023',
            'Giới tính': 'Nam',
            'Nơi sinh': 'Bệnh viện Nhi Trung ương',
            'Số giấy khai sinh': 'KS-2023-001238',
            'Ngày cấp': '08/07/2023',
          },
        ],
      };
    } else if (dataType.includes('Thi hành án')) {
      return {
        columns: ['STT', 'Số hồ sơ', 'Người nộp đơn', 'Đối tượng thi hành', 'Giá trị thi hành', 'Trạng thái', 'Ngày tiếp nhận'],
        rows: [
          {
            STT: 1,
            'Số hồ sơ': 'THA-2023-00567',
            'Người nộp đơn': 'Nguyễn Thị Mai',
            'Đối tượng thi hành': 'Công ty TNHH ABC',
            'Giá trị thi hành': '500,000,000 VNĐ',
            'Trạng thái': 'Đang thi hành',
            'Ngày tiếp nhận': '10/03/2023',
          },
          {
            STT: 2,
            'Số hồ sơ': 'THA-2023-00568',
            'Người nộp đơn': 'Trần Văn Bình',
            'Đối tượng thi hành': 'Lê Văn Cường',
            'Giá trị thi hành': '200,000,000 VNĐ',
            'Trạng thái': 'Hoàn thành',
            'Ngày tiếp nhận': '15/03/2023',
          },
          {
            STT: 3,
            'Số hồ sơ': 'THA-2023-00569',
            'Người nộp đơn': 'Phạm Thị Dung',
            'Đối tượng thi hành': 'Nguyễn Văn Em',
            'Giá trị thi hành': '150,000,000 VNĐ',
            'Trạng thái': 'Đang thi hành',
            'Ngày tiếp nhận': '20/03/2023',
          },
        ],
      };
    } else if (dataType.includes('Quốc tịch')) {
      return {
        columns: ['STT', 'Họ và tên', 'Ngày sinh', 'Quốc tịch cũ', 'Quốc tịch mới', 'Số quyết định', 'Ngày cấp'],
        rows: [
          {
            STT: 1,
            'Họ và tên': 'John Smith',
            'Ngày sinh': '15/08/1985',
            'Quốc tịch cũ': 'Mỹ',
            'Quốc tịch mới': 'Việt Nam',
            'Số quyết định': 'QT-2023-00123',
            'Ngày cấp': '25/05/2023',
          },
          {
            STT: 2,
            'Họ và tên': 'Marie Dubois',
            'Ngày sinh': '22/12/1990',
            'Quốc tịch cũ': 'Pháp',
            'Quốc tịch mới': 'Việt Nam',
            'Số quyết định': 'QT-2023-00124',
            'Ngày cấp': '30/05/2023',
          },
        ],
      };
    } else {
      return {
        columns: ['STT', 'Số hợp đồng', 'Loại hợp đồng', 'Bên A', 'Bên B', 'Giá trị', 'Ngày công chứng'],
        rows: [
          {
            STT: 1,
            'Số hợp đồng': 'CC-2023-00789',
            'Loại hợp đồng': 'Mua bán nhà đất',
            'Bên A': 'Nguyễn Văn An',
            'Bên B': 'Trần Thị Bình',
            'Giá trị': '3,500,000,000 VNĐ',
            'Ngày công chứng': '15/06/2023',
          },
          {
            STT: 2,
            'Số hợp đồng': 'CC-2023-00790',
            'Loại hợp đồng': 'Cho thuê nhà',
            'Bên A': 'Lê Văn Cường',
            'Bên B': 'Phạm Thị Dung',
            'Giá trị': '100,000,000 VNĐ/năm',
            'Ngày công chứng': '20/06/2023',
          },
          {
            STT: 3,
            'Số hợp đồng': 'CC-2023-00791',
            'Loại hợp đồng': 'Mua bán xe',
            'Bên A': 'Hoàng Văn Em',
            'Bên B': 'Vũ Thị Hoa',
            'Giá trị': '800,000,000 VNĐ',
            'Ngày công chứng': '25/06/2023',
          },
        ],
      };
    }
  };

  const { columns, rows } = getMockData();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h3 className="text-slate-900 mb-1">{fileTitle} - Dữ liệu chi tiết</h3>
            <p className="text-sm text-slate-600">{dataType}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              <Download className="w-4 h-4" />
              Xuất Excel
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Đóng" aria-label="Đóng"
            >
              <X className="w-6 h-6 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm trong bảng dữ liệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-colors">
              <Filter className="w-4 h-4" />
              Lọc
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto p-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-300">
                {columns.map((col) => (
                  <th
                    key={col}
                    className="text-left px-4 py-3 text-sm text-slate-700 whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-200 hover:bg-blue-50 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col} className="px-4 py-3 text-sm text-slate-900 whitespace-nowrap">
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer with Pagination */}
        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Hiển thị <span className="text-slate-900">{rows.length}</span> bản ghi
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-slate-300 rounded-lg hover:bg-white transition-colors disabled:cursor-not-allowed disabled:!bg-[#F1F5F9] disabled:!text-[#94A3B8] disabled:!border-[#E2E8F0] disabled:!shadow-none "
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                {currentPage}
              </div>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-2 border border-slate-300 rounded-lg hover:bg-white transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
