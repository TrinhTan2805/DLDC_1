import { useState, ChangeEvent } from 'react';
import { Search, Filter, FileText, Download, Printer, ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const mockDataList = [
  { category: 'Văn bản pháp luật', total: 45, recent: 12, agency: 'Bộ Tư pháp' },
  { category: 'Đăng ký kinh doanh', total: 120, recent: 34, agency: 'Cục Đăng ký KD' },
  { category: 'Công chứng', total: 30, recent: 5, agency: 'Cục Công chứng' },
  { category: 'Trợ giúp pháp lý', total: 85, recent: 20, agency: 'Cục TGPL' },
  { category: 'Hộ tịch điện tử', total: 210, recent: 56, agency: 'Cục Hộ tịch' },
];

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444']; // Tailwind colors

export function CategoryReportListPage() {
  const [filterAgency, setFilterAgency] = useState('all');
  const [dateRange, setDateRange] = useState('2024');

  const filteredData = filterAgency === 'all' 
    ? mockDataList 
    : mockDataList.filter(d => d.agency === filterAgency);

  const totalCategories = filteredData.reduce((acc, curr) => acc + curr.total, 0);
  const totalRecent = filteredData.reduce((acc, curr) => acc + curr.recent, 0);
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
          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Đơn vị quản lý</label>
              <select
                title="Đơn vị quản lý"
                value={filterAgency}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterAgency(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">Tất cả đơn vị</option>
                <option value="Bộ Tư pháp">Bộ Tư pháp</option>
                <option value="Cục Đăng ký KD">Cục Đăng ký kinh doanh</option>
                <option value="Cục Công chứng">Cục Công chứng</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Thời gian tạo (Năm)</label>
              <select
                title="Thời gian tạo"
                value={dateRange}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setDateRange(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">Toàn thời gian</option>
                <option value="2024">Năm 2024</option>
                <option value="2023">Năm 2023</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full px-4 py-2.5 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-900 transition-colors flex items-center justify-center gap-2">
                <Search className="w-4 h-4" />
                Truy xuất dữ liệu
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto h-full pt-6 md:pt-0">
            <button className="px-5 py-2.5 border border-slate-300 text-slate-700 bg-white rounded-xl hover:bg-slate-50 transition-colors font-medium flex items-center gap-2">
              <Printer className="w-4 h-4" />
              In báo cáo
            </button>
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
                    onClick={() => handleExportFile('XLS')}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm text-slate-700"
                  >
                    XLS
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportFile('DOCX')}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm text-slate-700"
                  >
                    DOCX
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
            <h1 className="text-2xl font-bold uppercase mb-2">Báo cáo Thống kê</h1>
            <h2 className="text-lg font-bold uppercase">Danh sách danh mục trên hệ thống thiết lập</h2>
            {dateRange !== 'all' && (
              <p className="italic mt-2">Kỳ báo cáo: Năm {dateRange}</p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-8 font-serif leading-relaxed text-justify">
            <section>
              <h3 className="font-bold text-lg mb-3">1. Tổng quan tình hình thiết lập danh mục</h3>
              <p className="mb-2">
                Tính đến thời điểm hiện tại, toàn hệ thống Kho dữ liệu dùng chung đã ghi nhận tổng cộng <strong className="text-lg">{totalCategories}</strong> danh mục dữ liệu được thiết lập và quản lý.
                Trong đó, có <strong>{totalRecent}</strong> danh mục được tạo mới hoặc cập nhật trong kỳ báo cáo hiển tại ({dateRange === 'all' ? 'Toàn thời gian' : `Năm ${dateRange}`}).
              </p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-4">2. Thống kê theo phân hệ / Đơn vị</h3>
              {/* Chart */}
              <div className="h-64 mt-4 mb-6 relative -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#374151' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#374151' }} />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="total" name="Tổng số bộ danh mục" radius={[4, 4, 0, 0]} maxBarSize={50}>
                      {filteredData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Data Table */}
              <table className="w-full text-sm border-collapse border border-slate-400 mt-4 text-left">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="border border-slate-400 p-2 text-center w-12">STT</th>
                    <th className="border border-slate-400 p-2">Tên chủ đề / Phân hệ</th>
                    <th className="border border-slate-400 p-2">Đơn vị quản lý</th>
                    <th className="border border-slate-400 p-2 text-right">Số lượng DM Cập mới</th>
                    <th className="border border-slate-400 p-2 text-right">Tổng số DM</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border border-slate-400 p-2 text-center">{idx + 1}</td>
                      <td className="border border-slate-400 p-2 font-medium">{item.category}</td>
                      <td className="border border-slate-400 p-2">{item.agency}</td>
                      <td className="border border-slate-400 p-2 text-right">{item.recent}</td>
                      <td className="border border-slate-400 p-2 text-right font-bold">{item.total}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold">
                    <td colSpan={3} className="border border-slate-400 p-2 text-center uppercase">Tổng cộng</td>
                    <td className="border border-slate-400 p-2 text-right">{totalRecent}</td>
                    <td className="border border-slate-400 p-2 text-right text-emerald-700">{totalCategories}</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-3">3. Nhận xét và đánh giá</h3>
              <p>
                Tiến độ số hóa và thiết lập danh mục đáp ứng tốt yêu cầu kỹ thuật của Đề án. Dữ liệu từ <strong>{filterAgency === 'all' ? 'nhiều cơ quan' : filterAgency}</strong> đã được đồng bộ chuẩn xác. Đề nghị tiếp tục rà soát các danh mục cũ để cập nhật phiên bản mới nhất.
              </p>
            </section>
          </div>

          {/* Footer - Signatures */}
          <div className="flex justify-between items-start mt-20 text-center font-serif">
            <div className="w-1/2">
              <h4 className="font-bold">Nơi nhận:</h4>
              <p className="text-sm italic">- Lãnh đạo Bộ (để b/c);</p>
              <p className="text-sm italic">- Lưu: VT, QLDL.</p>
            </div>
            <div className="w-1/2">
              <h4 className="font-bold">LÃNH ĐẠO CƠ QUAN / ĐƠN VỊ</h4>
              <p className="text-sm italic mb-16">(Ký, ghi rõ họ tên và đóng dấu)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
