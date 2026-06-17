import React, { useState } from 'react';
import { Filter, RefreshCcw, Eye, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { RecordDetailModal } from '../modals/RecordDetailModal';
import { ProvisionService } from '../../../../data/provisionServicesData';

interface TableColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
}

interface TableFilter {
  key: string;
  label: string;
  type: 'text' | 'select';
  options?: string[];
}

interface TableConfig {
  columns: TableColumn[];
  filters: TableFilter[];
  data: any[];
}

function generateTableConfig(serviceName: string): TableConfig {
  const name = serviceName.toLowerCase();
  
  if (name.includes('khai sinh')) {
    return {
      columns: [
        { key: 'maDinhDanh', label: 'Mã định danh' },
        { key: 'hoTenTre', label: 'Họ tên trẻ' },
        { key: 'ngaySinh', label: 'Ngày sinh' },
        { key: 'gioiTinh', label: 'Giới tính', align: 'center' },
        { key: 'hoTenMe', label: 'Họ tên mẹ' },
        { key: 'hoTenCha', label: 'Họ tên cha' },
        { key: 'trangThai', label: 'Trạng thái', align: 'center' }
      ],
      filters: [
        { key: 'maDinhDanh', label: 'Mã định danh / Họ tên trẻ', type: 'text' },
        { key: 'gioiTinh', label: 'Giới tính', type: 'select', options: ['Tất cả', 'Nam', 'Nữ'] },
        { key: 'trangThai', label: 'Trạng thái', type: 'select', options: ['Tất cả', 'Đã phê duyệt', 'Chờ duyệt', 'Lỗi'] }
      ],
      data: [
        { id: '1', maDinhDanh: '001223456789', hoTenTre: 'Nguyễn Văn Bé', ngaySinh: '01/01/2023', gioiTinh: 'Nam', hoTenMe: 'Trần Thị Mẹ', hoTenCha: 'Nguyễn Văn Cha', trangThai: 'Đã phê duyệt' },
        { id: '2', maDinhDanh: '001223456790', hoTenTre: 'Trần Thị Nhỏ', ngaySinh: '15/02/2023', gioiTinh: 'Nữ', hoTenMe: 'Lê Thị A', hoTenCha: 'Trần Văn B', trangThai: 'Chờ duyệt' },
        { id: '3', maDinhDanh: '001223456791', hoTenTre: 'Lê Hoàng C', ngaySinh: '20/03/2023', gioiTinh: 'Nam', hoTenMe: 'Phạm Thị D', hoTenCha: 'Lê Văn E', trangThai: 'Lỗi' }
      ]
    };
  }
  
  if (name.includes('kết hôn')) {
    return {
      columns: [
        { key: 'maHoSo', label: 'Mã hồ sơ' },
        { key: 'ngayDangKy', label: 'Ngày đăng ký' },
        { key: 'hoTenChong', label: 'Họ tên chồng' },
        { key: 'hoTenVo', label: 'Họ tên vợ' },
        { key: 'noiDangKy', label: 'Nơi đăng ký' },
        { key: 'trangThai', label: 'Trạng thái', align: 'center' }
      ],
      filters: [
        { key: 'maHoSo', label: 'Mã hồ sơ / Họ tên', type: 'text' },
        { key: 'trangThai', label: 'Trạng thái', type: 'select', options: ['Tất cả', 'Đã phê duyệt', 'Chờ duyệt', 'Lỗi'] }
      ],
      data: [
        { id: '1', maHoSo: 'KH-2023-001', ngayDangKy: '10/05/2023', hoTenChong: 'Nguyễn Văn A', hoTenVo: 'Trần Thị B', noiDangKy: 'UBND Phường 1', trangThai: 'Đã phê duyệt' },
        { id: '2', maHoSo: 'KH-2023-002', ngayDangKy: '12/05/2023', hoTenChong: 'Lê Văn C', hoTenVo: 'Phạm Thị D', noiDangKy: 'UBND Phường 2', trangThai: 'Chờ duyệt' },
        { id: '3', maHoSo: 'KH-2023-003', ngayDangKy: '15/05/2023', hoTenChong: 'Trần Văn E', hoTenVo: 'Nguyễn Thị F', noiDangKy: 'UBND Phường 3', trangThai: 'Đã phê duyệt' }
      ]
    };
  }

  if (name.includes('nhận cha, mẹ, con')) {
    return {
      columns: [
        { key: 'maHoSo', label: 'Mã hồ sơ' },
        { key: 'ngayDangKy', label: 'Ngày đăng ký' },
        { key: 'nguoiNhan', label: 'Người nhận' },
        { key: 'nguoiDuocNhan', label: 'Người được nhận' },
        { key: 'quanHe', label: 'Quan hệ' },
        { key: 'trangThai', label: 'Trạng thái', align: 'center' }
      ],
      filters: [
        { key: 'maHoSo', label: 'Mã hồ sơ / Tên người nhận', type: 'text' },
        { key: 'quanHe', label: 'Quan hệ', type: 'select', options: ['Tất cả', 'Cha - Con', 'Mẹ - Con'] },
        { key: 'trangThai', label: 'Trạng thái', type: 'select', options: ['Tất cả', 'Đã phê duyệt', 'Chờ duyệt', 'Lỗi'] }
      ],
      data: [
        { id: '1', maHoSo: 'NCMC-2023-01', ngayDangKy: '01/06/2023', nguoiNhan: 'Nguyễn Văn Cha', nguoiDuocNhan: 'Nguyễn Văn Con', quanHe: 'Cha - Con', trangThai: 'Đã phê duyệt' },
        { id: '2', maHoSo: 'NCMC-2023-02', ngayDangKy: '05/06/2023', nguoiNhan: 'Trần Thị Mẹ', nguoiDuocNhan: 'Trần Văn Con', quanHe: 'Mẹ - Con', trangThai: 'Chờ duyệt' }
      ]
    };
  }

  if (name.includes('tình trạng hôn nhân')) {
    return {
      columns: [
        { key: 'maHoSo', label: 'Mã THN' },
        { key: 'ngaySinh', label: 'Ngày sinh' },
        { key: 'soDinhDanh', label: 'Số định danh cá nhân' },
        { key: 'tinhTrangHonNhan', label: 'Tình trạng hôn nhân', align: 'center' },
        { key: 'nguoiDeNghi', label: 'Người đề nghị cấp' },
        { key: 'quanHe', label: 'Quan hệ', align: 'center' },
        { key: 'ngayCap', label: 'Ngày cấp' },
        { key: 'trangThai', label: 'Trạng thái', align: 'center' }
      ],
      filters: [
        { key: 'maHoSo', label: 'Mã THN / Số định danh', type: 'text' },
        { key: 'tinhTrangHonNhan', label: 'Tình trạng hôn nhân', type: 'select', options: ['Tất cả', 'Chưa đăng ký kết hôn', 'Đã ly hôn', 'Vợ chết'] },
        { key: 'trangThai', label: 'Trạng thái', type: 'select', options: ['Tất cả', 'Đã phê duyệt', 'Chờ duyệt', 'Lỗi'] }
      ],
      data: [
        { id: '1', maHoSo: 'XN-2023-001234', ngaySinh: '15/03/1990', soDinhDanh: '001090001234', tinhTrangHonNhan: 'Chưa đăng ký kết hôn', nguoiDeNghi: 'Nguyễn Văn Nam', quanHe: 'Bản thân', ngayCap: '10/10/2023', trangThai: 'Đã phê duyệt' },
        { id: '2', maHoSo: 'XN-2023-001235', ngaySinh: '20/05/1995', soDinhDanh: '036195005678', tinhTrangHonNhan: 'Đã ly hôn', nguoiDeNghi: 'Trần Thị Lan', quanHe: 'Bản thân', ngayCap: '05/12/2023', trangThai: 'Chờ duyệt' },
        { id: '3', maHoSo: 'XN-2023-001236', ngaySinh: '12/11/1988', soDinhDanh: '031088123456', tinhTrangHonNhan: 'Vợ chết', nguoiDeNghi: 'Hoàng Minh Tuấn', quanHe: 'Bản thân', ngayCap: '15/12/2023', trangThai: 'Lỗi' }
      ]
    };
  }

  // Default structure
  return {
    columns: [
      { key: 'maBanGhi', label: 'Mã bản ghi' },
      { key: 'ngayCapNhat', label: 'Ngày cập nhật' },
      { key: 'donViCungCap', label: 'Đơn vị cung cấp' },
      { key: 'trangThai', label: 'Trạng thái', align: 'center' }
    ],
    filters: [
      { key: 'search', label: 'Tìm kiếm', type: 'text' },
      { key: 'trangThai', label: 'Trạng thái', type: 'select', options: ['Tất cả', 'Đã phê duyệt', 'Chờ duyệt', 'Lỗi'] }
    ],
    data: [
      { id: '1', maBanGhi: 'REC-001', ngayCapNhat: '12/10/2023', donViCungCap: 'Hệ thống tự động', trangThai: 'Đã phê duyệt' },
      { id: '2', maBanGhi: 'REC-002', ngayCapNhat: '13/10/2023', donViCungCap: 'Cán bộ quản trị', trangThai: 'Chờ duyệt' }
    ]
  };
}

export function ServiceDataTable({ service }: { service: ProvisionService }) {
  const [showTableFilter, setShowTableFilter] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const config = generateTableConfig(service.name);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Đã phê duyệt':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3.5 h-3.5" /> {status}</span>;
      case 'Chờ duyệt':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200"><AlertCircle className="w-3.5 h-3.5" /> {status}</span>;
      case 'Lỗi':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200"><XCircle className="w-3.5 h-3.5" /> {status}</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      {/* Table Toolbar */}
      <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h3 className="font-bold text-slate-800 text-lg">{service.name.replace('Cung cấp Bộ dữ liệu ', '')}</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowTableFilter(!showTableFilter)}
            className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors shadow-sm ${showTableFilter ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
          >
            <Filter className="w-4 h-4" /> Lọc
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showTableFilter && (
        <div className="px-6 py-4 border-b border-slate-200 bg-white animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {config.filters.map(filter => (
              <div key={filter.key}>
                <label className="block text-xs font-bold text-slate-700 mb-1">{filter.label}</label>
                {filter.type === 'text' ? (
                  <input type="text" placeholder="Nhập từ khóa..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                ) : (
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {filter.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                )}
              </div>
            ))}
            <div className="flex items-end gap-2 md:col-start-4">
              <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">Áp dụng</button>
              <button 
                onClick={() => setShowTableFilter(false)}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              {config.columns.map(col => (
                <th key={col.key} className={`px-4 py-4 font-bold ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : ''}`}>
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-4 font-bold text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {config.data.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                {config.columns.map(col => (
                  <td key={col.key} className={`px-4 py-4 ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : ''} ${col.key.includes('ma') || col.key.includes('soDinhDanh') ? 'font-mono' : ''} ${col.key === 'trangThai' ? '' : 'text-slate-800'}`}>
                    {col.key === 'trangThai' ? getStatusBadge(row[col.key]) : row[col.key]}
                  </td>
                ))}
                <td className="px-4 py-4 text-center">
                  <button 
                    onClick={() => {
                      setSelectedRecord(row);
                      setShowRecordModal(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center text-sm text-slate-500">
          <span>Hiển thị</span>
          <select className="mx-2 border border-slate-300 rounded px-2 py-1 bg-white focus:outline-none focus:border-blue-500">
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
          <span>bản ghi/trang</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm text-slate-500 mr-4">1 - {config.data.length} / {config.data.length * 482}</span>
          <div className="flex bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden text-sm">
            <button className="px-3 py-1.5 text-slate-400 hover:bg-slate-50 border-r border-slate-200" disabled>Trước</button>
            <button className="px-3 py-1.5 bg-blue-600 text-white font-medium border-r border-slate-200">1</button>
            <button className="px-3 py-1.5 text-slate-600 hover:bg-slate-50 border-r border-slate-200">2</button>
            <button className="px-3 py-1.5 text-slate-600 hover:bg-slate-50 border-r border-slate-200">3</button>
            <button className="px-3 py-1.5 text-slate-600 hover:bg-slate-50">Sau</button>
          </div>
        </div>
      </div>

      {/* Dynamic Detail Modal */}
      <RecordDetailModal 
        isOpen={showRecordModal}
        onClose={() => setShowRecordModal(false)}
        recordData={selectedRecord}
        columns={config.columns}
      />
    </div>
  );
}
