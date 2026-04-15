import { useState, ChangeEvent } from 'react';
import { Search, FileText, Printer, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react';

const mockVersions = [
  { version: 'v3.0', date: '2024-03-15', status: 'active', desc: 'Bổ sung trường CCCD định danh thay vì CMND cũ. Chuẩn hóa format dữ liệu ngày tháng theo chuẩn ISO 8601.', user: 'admin_tudien' },
  { version: 'v2.1', date: '2023-11-20', status: 'archived', desc: 'Sửa đổi giới hạn độ dài trường "Nơi đăng ký hộ khẩu" lên 255 ký tự.', user: 'system_auto' },
  { version: 'v2.0', date: '2023-01-05', status: 'archived', desc: 'Cập nhật lại cấu trúc bảng 32 thuộc tính theo Thông tư mới.', user: 'admin_tudien' },
  { version: 'v1.0', date: '2022-06-10', status: 'archived', desc: 'Khởi tạo danh mục lần đầu đưa vào vận hành lõi dữ liệu.', user: 'root' },
];

export function CategoryReportVersionPage() {
  const [filterCategoryName, setFilterCategoryName] = useState('DM_HOTICH');
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
              <label className="block text-sm font-medium text-slate-700 mb-2">Tra cứu theo loại Danh mục cụ thể</label>
              <select
                title="Tên danh mục"
                value={filterCategoryName}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterCategoryName(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
              >
                <option value="DM_HOTICH">CSDL Hộ tịch điện tử Toàn quốc</option>
                <option value="DM_DANGKY_DN">Danh mục tra cứu Mã ngành Đăng ký Doanh nghiệp</option>
                <option value="DM_CONGCHUNG">Danh mục Phòng Công chứng nhà nước</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-[200px] px-4 py-2.5 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-900 transition-colors flex items-center justify-center gap-2">
                <Search className="w-4 h-4" />
                Truy xuất Log
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
              <h4 className="font-bold text-sm uppercase">Trung tâm Điều hành dữ liệu</h4>
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
            <h1 className="text-2xl font-bold uppercase mb-2">Biên bản Nhận dạng Hệ thống</h1>
            <h2 className="text-lg font-bold uppercase">Lịch sử Lập phiên bản (Versioning) Danh mục</h2>
            <p className="italic mt-2">Đối tượng truy xuất: <strong>{filterCategoryName}</strong></p>
          </div>

          {/* Content */}
          <div className="space-y-8 font-serif leading-relaxed text-justify">
            <section>
              <h3 className="font-bold text-lg mb-3">1. Khái quát quy trình Nâng cấp phiên bản</h3>
              <p className="mb-2">
                Danh mục <strong className="text-blue-700">{filterCategoryName}</strong> hiện đang được duy trì với lịch sử cập nhật minh bạch. Hệ thống quản lý mã nguồn (Data Repository) đã thực hiện ghi nhận {mockVersions.length} lần Release (phát hành) cấu trúc.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-4 mt-6">2. Lịch sử Thay đổi (Changelog Timeline)</h3>
              
              <div className="pl-4 mt-8 relative border-l-2 border-slate-300 ml-4 pb-4">
                {mockVersions.map((v, i) => (
                  <div key={i} className="mb-8 relative pl-6">
                    {/* Timeline Dot */}
                    <div className="absolute w-5 h-5 rounded-full bg-white border-4 border-emerald-600 left-[-35px] top-1"></div>
                    
                    <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg shadow-sm">
                      <div className="flex justify-between items-start mb-2 border-b border-slate-200 pb-2">
                        <div>
                          <h4 className="font-bold text-emerald-800 flex items-center gap-2">
                            Phiên bản {v.version}
                            {v.status === 'active' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                            {v.status === 'archived' && <AlertCircle className="w-4 h-4 text-slate-400" />}
                          </h4>
                          <span className="text-sm text-slate-500">Ngày phát hành: {v.date}</span>
                        </div>
                        <div>
                          <span className={`${v.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'} px-2 py-1 rounded text-xs font-bold uppercase tracking-wider`}>
                            {v.status === 'active' ? 'Current' : 'Archived'}
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-800 text-sm mt-2 font-sans font-medium">{v.desc}</p>
                      <p className="text-xs text-slate-500 mt-2 font-sans"># Người thực hiện thay đổi: <code className="bg-slate-200 px-1 py-0.5 rounded">{v.user}</code></p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-3 mt-6">3. Cam kết Tích hợp</h3>
              <p>
                Toàn bộ dữ liệu của phiên bản cũ (v1.0, v2.x) được cấu hình Fallback đảm bảo tính liên tục của các hệ thống cũ đang gọi API theo kiến trúc Legacy. Đảm bảo 100% không đứt gãy hệ thống.
              </p>
            </section>
          </div>

          {/* Footer - Signatures */}
          <div className="flex justify-between items-start mt-20 text-center font-serif">
            <div className="w-1/2">
               
            </div>
            <div className="w-1/2">
              <h4 className="font-bold">ĐẠI DIỆN HỘI ĐỒNG XÉT DUYỆT</h4>
              <p className="text-sm italic mb-16">(Xác nhận thông qua bản phát hành)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
