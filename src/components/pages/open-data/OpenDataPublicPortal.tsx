import React, { useState } from 'react';
import { Search, Download, FileJson, FileSpreadsheet, FileText, Filter, Database, Calendar, Building, Globe, ChevronRight } from 'lucide-react';

const mockDatasets = [
  {
    id: 1,
    title: 'Danh mục Hộ tịch điện tử Toàn quốc',
    description: 'Bao gồm dữ liệu thống kê hộ tịch cơ bản, số liệu đăng ký khai sinh, kết hôn, khai tử.',
    provider: 'Cục Hộ tịch, quốc tịch, chứng thực',
    updateFrequency: 'Hàng tháng',
    lastUpdated: '15/05/2026',
    formats: ['CSV', 'JSON', 'XML'],
    downloads: 14500,
    category: 'Hành chính - Tư pháp',
  },
  {
    id: 2,
    title: 'Dữ liệu Cấp phép Hành nghề Luật sư',
    description: 'Danh sách và trạng thái hoạt động của các tổ chức hành nghề luật sư, cá nhân luật sư được cấp phép.',
    provider: 'Cục Bổ trợ tư pháp',
    updateFrequency: 'Hàng tuần',
    lastUpdated: '22/05/2026',
    formats: ['CSV', 'Excel'],
    downloads: 8200,
    category: 'Bổ trợ tư pháp',
  },
  {
    id: 3,
    title: 'Thống kê Thi hành án dân sự (Cấp Tỉnh)',
    description: 'Dữ liệu tổng hợp kết quả thi hành án dân sự, bao gồm số liệu đã thi hành xong và chưa có điều kiện.',
    provider: 'Tổng cục Thi hành án dân sự',
    updateFrequency: 'Hàng quý',
    lastUpdated: '01/04/2026',
    formats: ['CSV', 'JSON', 'XML', 'Excel'],
    downloads: 21300,
    category: 'Thi hành án',
  },
  {
    id: 4,
    title: 'Danh mục Tổ chức giám định Tư pháp',
    description: 'Thông tin liên hệ và lĩnh vực giám định của các tổ chức giám định tư pháp công lập và tư nhân.',
    provider: 'Cục Bổ trợ tư pháp',
    updateFrequency: 'Hàng năm',
    lastUpdated: '10/01/2026',
    formats: ['JSON', 'CSV'],
    downloads: 4100,
    category: 'Bổ trợ tư pháp',
  },
  {
    id: 5,
    title: 'Dữ liệu Báo cáo Trợ giúp pháp lý',
    description: 'Số liệu chi tiết về các vụ việc đã được trợ giúp pháp lý thành công trên 63 tỉnh thành.',
    provider: 'Cục Trợ giúp pháp lý',
    updateFrequency: 'Hàng quý',
    lastUpdated: '05/04/2026',
    formats: ['CSV', 'Excel'],
    downloads: 3200,
    category: 'Hành chính - Tư pháp',
  }
];

export function OpenDataPublicPortal() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const filteredData = mockDatasets.filter(ds => 
    (selectedCategory === 'Tất cả' || ds.category === selectedCategory) &&
    (ds.title.toLowerCase().includes(searchTerm.toLowerCase()) || ds.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getFormatIcon = (format: string) => {
    switch(format) {
      case 'JSON': return <FileJson className="w-4 h-4" />;
      case 'CSV': return <FileText className="w-4 h-4" />;
      case 'Excel': return <FileSpreadsheet className="w-4 h-4" />;
      case 'XML': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getFormatColor = (format: string) => {
    switch(format) {
      case 'JSON': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'CSV': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Excel': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'XML': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const handleDownload = (dataset: any, format: string) => {
    // Mock download action
    console.log(`Downloading ${dataset.title} in ${format} format...`);
    const mockData = `Dữ liệu mẫu của ${dataset.title}\nĐịnh dạng: ${format}`;
    const blob = new Blob([mockData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dataset.title.replace(/\s+/g, '_').toLowerCase()}.${format.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 opacity-10">
          <Globe className="w-64 h-64" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-3xl font-extrabold mb-4">Cổng Dữ Liệu Mở Ngành Tư Pháp</h1>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            Nền tảng chia sẻ dữ liệu công khai, minh bạch, phục vụ người dân, doanh nghiệp và các cơ quan nhà nước khai thác, sử dụng theo Nghị định 47/2020/NĐ-CP.
          </p>
          
          <div className="flex bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
            <div className="flex items-center flex-1 px-4">
              <Search className="w-5 h-5 text-blue-200 mr-3" />
              <input 
                type="text" 
                placeholder="Tìm kiếm tập dữ liệu, từ khóa..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-none text-white placeholder-blue-200 focus:outline-none py-2"
              />
            </div>
            <button className="bg-white text-blue-700 font-bold px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors shadow-sm">
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 shrink-0 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 flex items-center mb-4">
              <Filter className="w-4 h-4 mr-2 text-slate-500" />
              Lĩnh vực dữ liệu
            </h3>
            <div className="space-y-2">
              {['Tất cả', 'Hành chính - Tư pháp', 'Bổ trợ tư pháp', 'Thi hành án'].map(category => (
                <label key={category} className="flex items-center space-x-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="category" 
                    value={category}
                    checked={selectedCategory === category}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span className={`text-sm group-hover:text-blue-600 transition-colors ${selectedCategory === category ? 'text-blue-600 font-semibold' : 'text-slate-600'}`}>
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Định dạng hỗ trợ</h3>
            <div className="flex flex-wrap gap-2">
              {['CSV', 'JSON', 'Excel', 'XML'].map(fmt => (
                <span key={fmt} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md border border-slate-200">
                  {fmt}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Dataset List */}
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-slate-800">
              Kết quả tìm kiếm ({filteredData.length} tập dữ liệu)
            </h2>
            <select className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option>Mới cập nhật</option>
              <option>Tải nhiều nhất</option>
              <option>Tên (A-Z)</option>
            </select>
          </div>

          {filteredData.map(dataset => (
            <div key={dataset.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">
                      {dataset.category}
                    </span>
                    {dataset.downloads > 10000 && (
                      <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-100 flex items-center">
                        Phổ biến
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-blue-700 hover:text-blue-800 cursor-pointer mb-2 transition-colors">
                    {dataset.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed line-clamp-2">
                    {dataset.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center">
                      <Building className="w-3.5 h-3.5 mr-1.5" />
                      {dataset.provider}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1.5" />
                      Cập nhật: {dataset.lastUpdated} ({dataset.updateFrequency})
                    </div>
                    <div className="flex items-center">
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      {dataset.downloads.toLocaleString()} lượt tải
                    </div>
                  </div>
                </div>

                {/* Download Actions */}
                <div className="flex flex-col gap-2 min-w-[140px] shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tải về trực tiếp</span>
                  {dataset.formats.map(format => (
                    <button 
                      key={format}
                      onClick={() => handleDownload(dataset, format)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm font-medium transition-all hover:shadow-sm hover:-translate-y-0.5 ${getFormatColor(format)}`}
                    >
                      <div className="flex items-center">
                        {getFormatIcon(format)}
                        <span className="ml-2">{format}</span>
                      </div>
                      <Download className="w-3.5 h-3.5 opacity-70" />
                    </button>
                  ))}
                  <button className="flex items-center justify-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-semibold transition-colors mt-1">
                    Xem chi tiết <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredData.length === 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <Database className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-700 mb-2">Không tìm thấy tập dữ liệu</h3>
              <p className="text-slate-500">Vui lòng thử lại với từ khóa hoặc lĩnh vực khác.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
