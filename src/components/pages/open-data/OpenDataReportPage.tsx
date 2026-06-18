import { useState } from 'react';
import { FileSearch, Search, Download, Filter, BarChart3, FileText, Calendar } from 'lucide-react';

interface SearchResult {
  id: string;
  code: string;
  name: string;
  category: string;
  publishDate: string;
  lastUpdate: string;
  downloadCount: number;
  format: string[];
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    code: 'OD001',
    name: 'Bộ dữ liệu A',
    category: 'Biên tập danh mục A',
    publishDate: '01/11/2024',
    lastUpdate: '10/12/2024',
    downloadCount: 1523,
    format: ['JSON', 'CSV']
  },
  {
    id: '2',
    code: 'OD002',
    name: 'Bộ dữ liệu B',
    category: 'Danh mục B',
    publishDate: '15/11/2024',
    lastUpdate: '09/12/2024',
    downloadCount: 856,
    format: ['JSON', 'Excel']
  },
  {
    id: '3',
    code: 'OD003',
    name: 'Bộ dữ liệu C',
    category: 'Danh mục C',
    publishDate: '01/12/2024',
    lastUpdate: '08/12/2024',
    downloadCount: 234,
    format: ['XML', 'CSV']
  },
];

export function OpenDataReportPage() {
  const [activeTab, setActiveTab] = useState<'search' | 'report'>('search');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');
  const [searchFormat, setSearchFormat] = useState('all');
  const [reportPeriod, setReportPeriod] = useState('month');

  const filteredResults = mockSearchResults.filter(result => {
    const matchesKeyword = result.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      result.code.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesCategory = searchCategory === 'all' || result.category === searchCategory;
    const matchesFormat = searchFormat === 'all' || result.format.includes(searchFormat);
    return matchesKeyword && matchesCategory && matchesFormat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-slate-900">Báo cáo và tìm kiếm dữ liệu mở</h1>
        <p className="text-sm text-slate-600 mt-1">Tìm kiếm và xem báo cáo thống kê về dữ liệu mở</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 px-6 py-3 text-sm transition-colors ${activeTab === 'search'
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <Search className="w-4 h-4" />
            Tìm kiếm
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-2 px-6 py-3 text-sm transition-colors ${activeTab === 'report'
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            <BarChart3 className="w-4 h-4" />
            Báo cáo
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Search Tab */}
          {activeTab === 'search' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <h3 className="text-sm text-slate-900 mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Bộ lọc tìm kiếm
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Từ khóa</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập từ khóa tìm kiếm..."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-700 mb-2">Danh mục</label>
                      <select
                        value={searchCategory}
                        onChange={(e) => setSearchCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">Tất cả danh mục</option>
                        <option value="Biên tập danh mục A">Biên tập danh mục A</option>
                        <option value="Danh mục B">Danh mục B</option>
                        <option value="Danh mục C">Danh mục C</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-700 mb-2">Định dạng</label>
                      <select
                        value={searchFormat}
                        onChange={(e) => setSearchFormat(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">Tất cả định dạng</option>
                        <option value="JSON">JSON</option>
                        <option value="CSV">CSV</option>
                        <option value="XML">XML</option>
                        <option value="Excel">Excel</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setSearchKeyword('');
                        setSearchCategory('all');
                        setSearchFormat('all');
                      }}
                      className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                    >
                      Đặt lại
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                      <Search className="w-4 h-4" />
                      Tìm kiếm
                    </button>
                  </div>
                </div>
              </div>

              {/* Search Results */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm text-slate-900">
                    Kết quả tìm kiếm ({filteredResults.length})
                  </h3>
                  <button className="px-4 py-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Xuất kết quả
                  </button>
                </div>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">STT</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Mã</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Tên bộ dữ liệu</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Danh mục</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Ngày công bố</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Định dạng</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Lượt tải</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredResults.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-8 text-center text-slate-500 text-sm">
                            Không tìm thấy kết quả nào
                          </td>
                        </tr>
                      ) : (
                        filteredResults.map((result, index) => (
                          <tr key={result.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 text-sm text-slate-700">{index + 1}</td>
                            <td className="px-4 py-3 text-sm">
                              <code className="px-2 py-0.5 bg-slate-100 text-blue-700 rounded text-xs">
                                {result.code}
                              </code>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-900">{result.name}</td>
                            <td className="px-4 py-3 text-sm text-slate-700">{result.category}</td>
                            <td className="px-4 py-3 text-sm text-slate-700">{result.publishDate}</td>
                            <td className="px-4 py-3 text-sm">
                              <div className="flex gap-1">
                                {result.format.map((fmt, i) => (
                                  <span key={i} className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                                    {fmt}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-700">{result.downloadCount.toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Report Tab */}
          {activeTab === 'report' && (
            <div className="space-y-4">
              {/* Report Filter */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm text-slate-700">Thời kỳ báo cáo:</label>
                  <select
                    value={reportPeriod}
                    onChange={(e) => setReportPeriod(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="week">Tuần này</option>
                    <option value="month">Tháng này</option>
                    <option value="quarter">Quý này</option>
                    <option value="year">Năm này</option>
                  </select>
                  <button className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Xuất báo cáo
                  </button>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="text-xs text-slate-600 mb-1">Tổng bộ dữ liệu</div>
                  <div className="text-2xl text-slate-900">{mockSearchResults.length}</div>
                  <div className="text-xs text-green-600 mt-1">+2 so với tháng trước</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="text-xs text-slate-600 mb-1">Tổng lượt tải</div>
                  <div className="text-2xl text-slate-900">
                    {mockSearchResults.reduce((sum, r) => sum + r.downloadCount, 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-green-600 mt-1">+15% so với tháng trước</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="text-xs text-slate-600 mb-1">Danh mục phổ biến</div>
                  <div className="text-sm text-slate-900 mt-1">Biên tập danh mục A</div>
                  <div className="text-xs text-slate-500 mt-1">567 lượt tải</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="text-xs text-slate-600 mb-1">Định dạng phổ biến</div>
                  <div className="text-sm text-slate-900 mt-1">JSON</div>
                  <div className="text-xs text-slate-500 mt-1">892 lượt tải</div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h4 className="text-sm text-slate-900 mb-4">Thống kê lượt tải theo danh mục</h4>
                  <div className="space-y-3">
                    {['Biên tập danh mục A', 'Danh mục B', 'Danh mục C'].map((category) => {
                      const count = mockSearchResults.filter(r => r.category === category).reduce((sum, r) => sum + r.downloadCount, 0);
                      const total = mockSearchResults.reduce((sum, r) => sum + r.downloadCount, 0);
                      const percentage = (count / total) * 100;
                      return (
                        <div key={category}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-700">{category}</span>
                            <span className="text-slate-900">{count.toLocaleString()} ({percentage.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h4 className="text-sm text-slate-900 mb-4">Thống kê theo định dạng</h4>
                  <div className="space-y-3">
                    {['JSON', 'CSV', 'XML', 'Excel'].map((format) => {
                      const count = mockSearchResults.filter(r => r.format.includes(format)).length;
                      const percentage = (count / mockSearchResults.length) * 100;
                      return (
                        <div key={format}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-700">{format}</span>
                            <span className="text-slate-900">{count} ({percentage.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
