import { useState } from 'react';
import { DateInput } from './collection/collectionUi';
import { Search, Database, FolderOpen, Lock, Download, Eye } from 'lucide-react';

const searchResults = [
  { id: 1, title: 'Nguyễn Văn A', type: 'master', category: 'Hộ tịch', cccd: '001234567890', dob: '01/01/1990', updated: '05/12/2025' },
  { id: 2, title: 'Trần Thị B', type: 'master', category: 'Quốc tịch', cccd: '001234567891', dob: '15/03/1985', updated: '04/12/2025' },
  { id: 3, title: 'Lê Văn C', type: 'open', category: 'Doanh nghiệp', cccd: '001234567892', dob: '20/06/1992', updated: '03/12/2025' },
  { id: 4, title: 'Phạm Thị D', type: 'shared', category: 'Thi hành án', cccd: '001234567893', dob: '10/11/1988', updated: '02/12/2025' },
];

export function DataSearchPage() {
  const [searchType, setSearchType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [birthDate, setBirthDate] = useState('');

  return (
    <div className="space-y-6">
      {/* Search Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => setSearchType('master')}
          className={`text-left p-6 rounded-lg border-2 transition-all ${
            searchType === 'master'
              ? 'border-red-600 bg-red-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${
              searchType === 'master' ? 'bg-red-100' : 'bg-blue-50'
            }`}>
              <Database className={`w-6 h-6 ${
                searchType === 'master' ? 'text-red-600' : 'text-blue-600'
              }`} />
            </div>
            <div className="flex-1">
              <h3 className="text-gray-900 mb-1">Dữ liệu chủ</h3>
              <p className="text-gray-500 text-sm">Tra cứu dữ liệu chủ của hệ thống</p>
              <p className="text-gray-700 mt-2">2,847,392 bản ghi</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setSearchType('open')}
          className={`text-left p-6 rounded-lg border-2 transition-all ${
            searchType === 'open'
              ? 'border-red-600 bg-red-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${
              searchType === 'open' ? 'bg-red-100' : 'bg-green-50'
            }`}>
              <FolderOpen className={`w-6 h-6 ${
                searchType === 'open' ? 'text-red-600' : 'text-green-600'
              }`} />
            </div>
            <div className="flex-1">
              <h3 className="text-gray-900 mb-1">Dữ liệu mở</h3>
              <p className="text-gray-500 text-sm">Tra cứu dữ liệu công khai</p>
              <p className="text-gray-700 mt-2">1,234,567 bản ghi</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setSearchType('shared')}
          className={`text-left p-6 rounded-lg border-2 transition-all ${
            searchType === 'shared'
              ? 'border-red-600 bg-red-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${
              searchType === 'shared' ? 'bg-red-100' : 'bg-purple-50'
            }`}>
              <Lock className={`w-6 h-6 ${
                searchType === 'shared' ? 'text-red-600' : 'text-purple-600'
              }`} />
            </div>
            <div className="flex-1">
              <h3 className="text-gray-900 mb-1">Dữ liệu dùng chung</h3>
              <p className="text-gray-500 text-sm">Tra cứu dữ liệu được chia sẻ</p>
              <p className="text-gray-700 mt-2">892,341 bản ghi</p>
            </div>
          </div>
        </button>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2 text-sm">CMND/CCCD</label>
              <input
                type="text"
                placeholder="Nhập số CMND/CCCD"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 text-sm">Họ và tên</label>
              <input
                type="text"
                placeholder="Nhập họ và tên"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-2 text-sm">Ngày sinh</label>
              <DateInput ariaLabel="Ngày sinh" value={birthDate} onChange={setBirthDate} />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 text-sm">Danh mục</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                <option>Tất cả</option>
                <option>Hộ tịch</option>
                <option>Quốc tịch</option>
                <option>Doanh nghiệp</option>
                <option>Thi hành án</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2 text-sm">Từ khóa</label>
              <input
                type="text"
                placeholder="Nhập từ khóa tìm kiếm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              <Search className="w-5 h-5" />
              Tìm kiếm
            </button>
            <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Đặt lại
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-900">Kết quả tìm kiếm</h3>
            <span className="text-gray-500 text-sm">{searchResults.length} kết quả</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700 text-sm">Họ và tên</th>
                <th className="px-6 py-3 text-left text-gray-700 text-sm">CMND/CCCD</th>
                <th className="px-6 py-3 text-left text-gray-700 text-sm">Ngày sinh</th>
                <th className="px-6 py-3 text-left text-gray-700 text-sm">Danh mục</th>
                <th className="px-6 py-3 text-left text-gray-700 text-sm">Loại dữ liệu</th>
                <th className="px-6 py-3 text-left text-gray-700 text-sm">Cập nhật</th>
                <th className="px-6 py-3 text-left text-gray-700 text-sm">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {searchResults.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{result.title}</td>
                  <td className="px-6 py-4 text-gray-600">{result.cccd}</td>
                  <td className="px-6 py-4 text-gray-600">{result.dob}</td>
                  <td className="px-6 py-4 text-gray-600">{result.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      result.type === 'master' ? 'bg-blue-100 text-blue-700' :
                      result.type === 'open' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {result.type === 'master' ? 'Dữ liệu chủ' :
                       result.type === 'open' ? 'Dữ liệu mở' : 'Dữ liệu dùng chung'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{result.updated}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded" title="Xem chi tiết" aria-label="Xem chi tiết">
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button title="Tải xuống" aria-label="Tải xuống" className="p-1 hover:bg-gray-100 rounded">
                        <Download className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
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
