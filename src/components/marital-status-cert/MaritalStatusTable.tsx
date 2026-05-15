import React from 'react';
import { Eye, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { MaritalStatusCertRecord } from '../MaritalStatusCertModal';

interface MaritalStatusTableProps {
  records: MaritalStatusCertRecord[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;
  totalRecords: number;
  onViewRecord: (record: MaritalStatusCertRecord) => void;
}

export function MaritalStatusTable({
  records,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  totalRecords,
  onViewRecord
}: MaritalStatusTableProps) {
  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Table Container */}
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full border-collapse collection-table" style={{ fontSize: '16px' }}>
          <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-center font-semibold text-slate-500 whitespace-nowrap w-12">STT</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-500 whitespace-nowrap">Người được cấp XNTTHN</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-500 whitespace-nowrap">Ngày sinh</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-500 whitespace-nowrap">Số định danh cá nhân</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-500 whitespace-nowrap">Tình trạng hôn nhân</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-500 whitespace-nowrap">Người đề nghị cấp</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-500 whitespace-nowrap">Quan hệ</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-500 whitespace-nowrap">Ngày cấp</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-500 whitespace-nowrap">Trạng thái</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-500 whitespace-nowrap">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((record, index) => (
              <tr key={record.id} className="hover:bg-slate-50 transition-all group">
                <td className="px-4 py-3 text-center text-slate-500 font-medium">
                  {((currentPage - 1) * itemsPerPage + index + 1).toString().padStart(2, '0')}
                </td>
                <td className="px-4 py-3 text-center font-semibold text-slate-900">{record.grantedPersonName}</td>
                <td className="px-4 py-3 text-center text-slate-600 font-medium font-mono">{record.grantedPersonBirthDate}</td>
                <td className="px-4 py-3 text-center text-slate-900 font-medium font-mono">{record.grantedPersonPersonalId}</td>
                <td className="px-4 py-3 text-center text-slate-600 font-medium">{record.maritalStatus}</td>
                <td className="px-4 py-3 text-center font-semibold text-slate-900">{record.requesterName}</td>
                <td className="px-4 py-3 text-center text-slate-600 font-medium">{record.requesterRelationship}</td>
                <td className="px-4 py-3 text-center text-slate-600 font-medium font-mono">{record.certIssueDate}</td>
                <td className="px-4 py-3 text-center">
                  {record.status === 'approved' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold uppercase tracking-wider border border-emerald-100 shadow-sm whitespace-nowrap" style={{ fontSize: '12px' }}>
                      <CheckCircle className="w-3.5 h-3.5" />
                      Đã phê duyệt
                    </span>
                  )}
                  {record.status === 'pending' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full font-bold uppercase tracking-wider border border-amber-100 shadow-sm whitespace-nowrap" style={{ fontSize: '12px' }}>
                      <AlertCircle className="w-3.5 h-3.5" />
                      Chờ duyệt
                    </span>
                  )}
                  {record.status === 'error' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 rounded-full font-bold uppercase tracking-wider border border-red-100 shadow-sm whitespace-nowrap" style={{ fontSize: '12px' }}>
                      <XCircle className="w-3.5 h-3.5" />
                      Lỗi
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onViewRecord(record)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
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

      {/* Pagination UI */}
      <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-white flex-wrap gap-4 collection-pagination" style={{ fontSize: '16px' }}>
        <div className="flex items-center gap-2">
          <span className="text-slate-600">Hiển thị</span>
          <select
            className="px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            title="Số bản ghi trên trang"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-slate-600">bản ghi/trang</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-slate-600">
            {totalRecords > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, totalRecords)} / {totalRecords}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
            >
              Trước
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = i + 1;
              if (totalPages > 5 && currentPage > 3) {
                pageNum = currentPage - 3 + i + 1;
                if (pageNum > totalPages) pageNum = totalPages - (4 - i);
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1.5 border rounded-lg font-medium transition-colors ${
                    currentPage === pageNum
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-[#e2e8f0] text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
