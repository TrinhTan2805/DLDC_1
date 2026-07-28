import { useState } from 'react';
import { Globe, Share2, Eye, Download, RefreshCw, CheckCircle, Link } from 'lucide-react';

export type PublishStatus = 'published' | 'draft' | 'updating';

export const PUBLISH_STATUS_LABELS: Record<PublishStatus, string> = {
  published: 'Đã công bố',
  draft: 'Bản nháp',
  updating: 'Đang cập nhật',
};

export const PUBLISH_STATUS_STYLES: Record<PublishStatus, string> = {
  published: 'bg-green-100 text-green-700 border-green-200',
  draft: 'bg-slate-100 text-slate-600 border-slate-200',
  updating: 'bg-amber-100 text-amber-700 border-amber-200',
};

interface PublishedDataset {
  id: string;
  code: string;
  name: string;
  category: string;
  publishDate: string;
  lastUpdate: string;
  format: string[];
  downloadCount: number;
  viewCount: number;
  status: PublishStatus;
  apiUrl: string;
}

const mockDatasets: PublishedDataset[] = [
  {
    id: '1',
    code: 'OD001',
    name: 'Bộ dữ liệu A',
    category: 'Biên tập danh mục A',
    publishDate: '01/11/2024',
    lastUpdate: '10/12/2024',
    format: ['JSON', 'CSV', 'XML'],
    downloadCount: 1523,
    viewCount: 8456,
    status: 'published',
    apiUrl: 'https://api.dldc.gov.vn/open-data/dataset-a'
  },
  {
    id: '2',
    code: 'OD002',
    name: 'Bộ dữ liệu B',
    category: 'Danh mục B',
    publishDate: '15/11/2024',
    lastUpdate: '09/12/2024',
    format: ['JSON', 'Excel'],
    downloadCount: 856,
    viewCount: 4231,
    status: 'published',
    apiUrl: 'https://api.dldc.gov.vn/open-data/dataset-b'
  },
  {
    id: '3',
    code: 'OD003',
    name: 'Bộ dữ liệu C',
    category: 'Danh mục C',
    publishDate: '01/12/2024',
    lastUpdate: '08/12/2024',
    format: ['JSON', 'CSV'],
    downloadCount: 234,
    viewCount: 1123,
    status: 'updating',
    apiUrl: 'https://api.dldc.gov.vn/open-data/dataset-c'
  },
];

export function OpenDataPublishPage() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDataset, setSelectedDataset] = useState<PublishedDataset | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredDatasets = filterStatus === 'all'
    ? mockDatasets
    : mockDatasets.filter(d => d.status === filterStatus);

  const getStatusBadge = (status: PublishStatus) => (
    <span className={`px-2 py-1 text-xs border rounded-full ${PUBLISH_STATUS_STYLES[status]}`}>
      {PUBLISH_STATUS_LABELS[status]}
    </span>
  );

  const stats = {
    total: mockDatasets.length,
    published: mockDatasets.filter(d => d.status === 'published').length,
    totalDownloads: mockDatasets.reduce((sum, d) => sum + d.downloadCount, 0),
    totalViews: mockDatasets.reduce((sum, d) => sum + d.viewCount, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-slate-900">Công bố dữ liệu mở</h1>
        <p className="text-sm text-slate-600 mt-1">Quản lý công bố và chia sẻ dữ liệu mở theo Nghị định 47/2020/NĐ-CP</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Tổng bộ dữ liệu</div>
              <div className="text-slate-900 mt-1">{stats.total}</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Đã công bố</div>
              <div className="text-slate-900 mt-1">{stats.published}</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Tổng lượt xem</div>
              <div className="text-slate-900 mt-1">{stats.totalViews.toLocaleString()}</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-xs text-slate-600">Tổng lượt tải</div>
              <div className="text-slate-900 mt-1">{stats.totalDownloads.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="published">Đã công bố</option>
          <option value="draft">Bản nháp</option>
          <option value="updating">Đang cập nhật</option>
        </select>
      </div>

      {/* Dataset List */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">STT</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Mã</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Tên bộ dữ liệu</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Danh mục</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Ngày công bố</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Định dạng</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Lượt xem</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Lượt tải</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDatasets.map((dataset, index) => (
                <tr key={dataset.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-700">{index + 1}</td>
                  <td className="px-4 py-3 text-sm">
                    <code className="px-2 py-0.5 bg-slate-100 text-emerald-700 rounded text-xs">
                      {dataset.code}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900">{dataset.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{dataset.category}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{dataset.publishDate}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-1">
                      {dataset.format.map((fmt, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                          {fmt}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">{dataset.viewCount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{dataset.downloadCount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">{getStatusBadge(dataset.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        title="Xem chi tiết"
                        onClick={() => {
                          setSelectedDataset(dataset);
                          setShowDetailModal(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded" title="Xem API">
                        <Link className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-amber-600 hover:bg-amber-50 rounded" title="Cập nhật">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedDataset && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-slate-900">Chi tiết bộ dữ liệu mở</h2>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600">
                <Eye className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Mã bộ dữ liệu</label>
                  <div className="text-sm text-slate-900">{selectedDataset.code}</div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Danh mục</label>
                  <div className="text-sm text-slate-900">{selectedDataset.category}</div>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Tên bộ dữ liệu</label>
                <div className="text-sm text-slate-900">{selectedDataset.name}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Ngày công bố</label>
                  <div className="text-sm text-slate-900">{selectedDataset.publishDate}</div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Cập nhật lần cuối</label>
                  <div className="text-sm text-slate-900">{selectedDataset.lastUpdate}</div>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">API Endpoint</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-slate-100 text-emerald-700 rounded text-sm">
                    {selectedDataset.apiUrl}
                  </code>
                  <button className="px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm">
                    Copy
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Định dạng</label>
                  <div className="flex gap-1">
                    {selectedDataset.format.map((fmt, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Lượt xem</label>
                  <div className="text-sm text-slate-900">{selectedDataset.viewCount.toLocaleString()}</div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Lượt tải</label>
                  <div className="text-sm text-slate-900">{selectedDataset.downloadCount.toLocaleString()}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
