import { useState, ChangeEvent } from 'react';
import { Search, Filter, FileText, Download, Printer, ChevronDown } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const mockStatuses = [
  { name: 'Đang hoạt động', value: 345, color: '#10b981', textClass: 'text-emerald-500' },
  { name: 'Tạm dừng', value: 45, color: '#f59e0b', textClass: 'text-amber-500' },
  { name: 'Hết hiệu lực', value: 120, color: '#ef4444', textClass: 'text-red-500' },
  { name: 'Đang chờ duyệt', value: 25, color: '#3b82f6', textClass: 'text-blue-500' },
];

export function CategoryReportStatusPage() {
  const [filterValidity, setFilterValidity] = useState('all');

  const filteredStatuses = filterValidity === 'all' 
    ? mockStatuses 
    : filterValidity === 'valid' 
      ? mockStatuses.filter(s => s.name === 'Đang hoạt động' || s.name === 'Đang chờ duyệt')
      : mockStatuses.filter(s => s.name === 'Hết hiệu lực' || s.name === 'Tạm dừng');

  const total = filteredStatuses.reduce((acc, curr) => acc + curr.value, 0);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExportFile = (format: string) => {
    setShowExportMenu(false);
    alert(`Đang xuất dữ liệu sang định dạng ${format}...`);
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Trạng thái vòng đời</label>
              <select
                title="Trạng thái vòng đời"
                value={filterValidity}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterValidity(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">Toàn bộ trạng thái</option>
                <option value="valid">Nhóm đang hiệu lực</option>
                <option value="invalid">Nhóm đã đóng / Tạm ngưng</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-[200px] px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                <Search className="w-4 h-4" />
                Duyệt báo cáo
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto h-full pt-6 md:pt-0">

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowExportMenu(prev => !prev)}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors flex items-center gap-2 shadow-sm shadow-blue-600/20"
              >
                <FileText className="w-4 h-4" />
                Xuất File
                <ChevronDown className="w-4 h-4" />
              </button>
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-slate-200 bg-white shadow-xl z-20">
                  <button
                    type="button"
                    onClick={() => handleExportFile('Excel')}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm text-slate-700"
                  >
                    Excel
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExportFile('PDF')}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm text-slate-700"
                  >
                    PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportFile('CSV')}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm text-slate-700"
                  >
                    CSV
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Report Preview - A4 Style Paper */}
      <div className="bg-slate-200/50 p-4 sm:p-8 rounded-2xl flex justify-center overflow-x-auto">
        <div className="bg-white w-[210mm] min-h-[297mm] shadow-xl p-[20mm] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] relative">
          
          {/* Header - Quốc hiệu */}
          <div className="flex justify-between items-start mb-12">
            <div className="text-center w-1/2">
              <h4 className="font-bold text-sm uppercase">Cơ quan chủ quản</h4>
              <h4 className="font-bold text-sm uppercase">Bộ Tư pháp</h4>
              <div className="w-16 h-[1px] bg-black mx-auto mt-1"></div>
            </div>
            <div className="text-center w-1/2">
              <h4 className="font-bold text-sm uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
              <h4 className="font-bold text-sm">Độc lập - Tự do - Hạnh phúc</h4>
              <div className="w-32 h-[1px] bg-black mx-auto mt-1"></div>
              <p className="italic text-sm mt-2 text-right">Hà Nội, ngày 09 tháng 04 năm 2026</p>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold uppercase mb-2">Báo cáo Mức độ khả dụng</h1>
            <h2 className="text-lg font-bold uppercase">Phân tích tình trạng đóng / mở danh mục</h2>
          </div>

          {/* Content */}
          <div className="space-y-8 font-serif leading-relaxed text-justify">
            <section>
              <h3 className="font-bold text-lg mb-3">1. Số liệu cắt ngang vòng đời</h3>
              <p className="mb-2">
                Hệ thống thực hiện rà soát tự động <strong className="text-lg">{total}</strong> phiên bản danh mục lưu trữ. Kết quả truy xuất dữ liệu trạng thái thể hiện tỷ trọng rõ ràng theo biểu đồ tỷ lệ phần trăm phân nhóm tình trạng hệ thống:
              </p>
              
              {/* Chart */}
              <div className="h-72 mt-8 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={filteredStatuses}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {filteredStatuses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-4 mt-12">2. Diễn giải số liệu chi tiết</h3>
              {/* Data Table */}
              <table className="w-full text-sm border-collapse border border-slate-400 mt-4 text-left">
                <thead className="bg-slate-100 font-bold text-center">
                  <tr>
                    <th className="border border-slate-400 p-2 w-12">STT</th>
                    <th className="border border-slate-400 p-2">Trạng thái chuẩn hóa</th>
                    <th className="border border-slate-400 p-2">Tổng số tập dữ liệu (bộ)</th>
                    <th className="border border-slate-400 p-2">Tỷ trọng (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStatuses.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border border-slate-400 p-2 text-center">{idx + 1}</td>
                      <td className={`border border-slate-400 p-2 font-bold ${item.textClass}`}>{item.name}</td>
                      <td className="border border-slate-400 p-2 text-right">{item.value.toLocaleString()}</td>
                      <td className="border border-slate-400 p-2 text-right">
                        {((item.value / total) * 100).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold">
                    <td colSpan={2} className="border border-slate-400 p-2 text-center uppercase">Tổng cộng</td>
                    <td className="border border-slate-400 p-2 text-right">{total.toLocaleString()}</td>
                    <td className="border border-slate-400 p-2 text-right">100.00%</td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-4 italic">
                * Ghi chú: Số liệu "Đang hoạt động" là nhóm đang trực tiếp phục vụ API dữ liệu mở.
              </p>
            </section>
          </div>

          {/* Footer - Signatures */}
          <div className="flex justify-between items-start mt-20 text-center font-serif">
            <div className="w-1/2"></div>
            <div className="w-1/2">
              <h4 className="font-bold">NGƯỜI XUẤT BÁO CÁO</h4>
              <p className="text-sm italic mb-16">(Xác nhận hệ thống)</p>
              <h4 className="font-bold mt-16 placeholder">Hệ thống Hệ thống Quản trị</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
