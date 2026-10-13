import { toast } from 'sonner';
import { useState, ChangeEvent } from 'react';
import { Search, FileText, Calendar, User, Download, Eye, Filter, ChevronDown, Globe, CheckCircle, AlertCircle, RefreshCw, XCircle, Share2, Clock, Ban } from 'lucide-react';
import { PublishConfigModal } from './components/modals/PublishConfigModal';
import { UnpublishModal } from './components/modals/UnpublishModal';


interface PublishedData {
  id: string;
  code: string;
  name: string;
  category: string;
  publishDate: string;
  publisher: string;
  format: string[];
  downloadCount: number;
  status: 'published' | 'updated' | 'deprecated' | 'ready';
  description: string;
  lastUpdate: string;
  scopes?: string[];
}

const mockPublishedData: PublishedData[] = [
  {
    id: '1',
    code: 'DMCB001',
    name: 'Danh mục văn bản pháp luật',
    category: 'Văn bản pháp luật',
    publishDate: '01/01/2024',
    publisher: 'Bộ Tư pháp',
    format: ['JSON', 'XML', 'CSV'],
    downloadCount: 1250,
    status: 'published',
    description: 'Danh mục văn bản quy phạm pháp luật được công bố công khai',
    lastUpdate: '25/12/2024',
    scopes: ['public']
  },
  {
    id: '2',
    code: 'DMCB002',
    name: 'Thông tin đăng ký kinh doanh',
    category: 'Đăng ký kinh doanh',
    publishDate: '15/01/2024',
    publisher: 'Bộ Tư pháp',
    format: ['JSON', 'CSV'],
    downloadCount: 3420,
    status: 'updated',
    description: 'Danh mục thông tin doanh nghiệp đăng ký kinh doanh',
    lastUpdate: '28/12/2024'
  },
  {
    id: '3',
    code: 'DMCB003',
    name: 'Danh sách tổ chức hành nghề công chứng',
    category: 'Công chứng',
    publishDate: '01/02/2024',
    publisher: 'Bộ Tư pháp',
    format: ['JSON', 'XML'],
    downloadCount: 850,
    status: 'published',
    description: 'Danh sách các tổ chức hành nghề công chứng trên toàn quốc',
    lastUpdate: '20/12/2024',
    scopes: ['extended', 'internal']
  },
  {
    id: '4',
    code: 'DMCB004',
    name: 'Thống kê hỗ trợ TGPL',
    category: 'TGPL',
    publishDate: '10/03/2024',
    publisher: 'Bộ Tư pháp',
    format: ['JSON', 'CSV', 'Excel'],
    downloadCount: 620,
    status: 'published',
    description: 'Thống kê các trường hợp được hỗ trợ trợ giúp pháp lý',
    lastUpdate: '15/12/2024',
    scopes: ['internal']
  },
  {
    id: '5',
    code: 'DMCB005',
    name: 'Danh mục hộ tịch (Phiên bản cũ)',
    category: 'Hộ tịch',
    publishDate: '01/01/2023',
    publisher: 'Bộ Tư pháp',
    format: ['CSV'],
    downloadCount: 450,
    status: 'deprecated',
    description: 'Phiên bản cũ - Đã ngưng cập nhật từ 01/01/2024',
    lastUpdate: '31/12/2023'
  },
  {
    id: '6',
    code: 'DMCB006',
    name: 'Danh mục quốc tịch',
    category: 'Hộ tịch',
    publishDate: '',
    publisher: 'Bộ Tư pháp',
    format: ['JSON', 'CSV'],
    downloadCount: 0,
    status: 'ready',
    description: 'Danh mục quốc tịch cập nhật 2026, đã duyệt và sẵn sàng công khai',
    lastUpdate: '10/01/2026'
  },
];

export function CategoryPublishedListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedData, setSelectedData] = useState<PublishedData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'publish' | 'unpublish'>('publish');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showUnpublishModal, setShowUnpublishModal] = useState(false);

  // Filter data
  const tabData = mockPublishedData.filter(item => {
    if (activeTab === 'publish') return true;
    return item.status === 'published';
  });

  const filteredData = tabData.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchSearch && matchStatus && matchCategory;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      published: 'bg-green-100 text-green-700 border-green-200',
      updated: 'bg-blue-100 text-blue-700 border-blue-200',
      deprecated: 'bg-orange-100 text-orange-700 border-orange-200',
      ready: 'bg-purple-100 text-purple-700 border-purple-200',
    };
    const labels = {
      published: 'Đã công bố',
      updated: 'Đã cập nhật',
      deprecated: 'Ngưng cập nhật',
      ready: 'Sẵn sàng công bố',
    };
    const icons = {
      published: CheckCircle,
      updated: RefreshCw,
      deprecated: XCircle,
      ready: Clock,
    };
    const Icon = icons[status as keyof typeof icons];
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs border rounded-full ${styles[status as keyof typeof styles]}`}>
        <Icon className="w-3 h-3" />
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const handleViewDetail = (item: PublishedData) => {
    setSelectedData(item);
    setShowDetailModal(true);
  };

  const handleDownload = (item: PublishedData, format: string) => {
    toast.info(`Tải xuống danh mục: ${item.name}\nĐịnh dạng: ${format}`);
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex bg-white px-2 pt-2 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('publish')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'publish' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
        >
          <Share2 className="w-4 h-4"/> Công khai danh mục
        </button>
        <button 
          onClick={() => setActiveTab('unpublish')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'unpublish' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
        >
          <Ban className="w-4 h-4"/> Hủy công khai danh mục
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              title="Tìm kiếm"
              placeholder="Tìm kiếm theo tên, mã danh mục..."
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <select
              title="Lĩnh vực"
              value={selectedCategory}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Tất cả lĩnh vực</option>
              <option value="Văn bản pháp luật">Văn bản pháp luật</option>
              <option value="Đăng ký kinh doanh">Đăng ký kinh doanh</option>
              <option value="Công chứng">Công chứng</option>
              <option value="TGPL">TGPL</option>
              <option value="Hộ tịch">Hộ tịch</option>
            </select>
          </div>
          <div>
            <select
              title="Trạng thái"
              value={selectedStatus}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="ready">Sẵn sàng công bố</option>
              <option value="published">Đã công bố</option>
              <option value="updated">Đã cập nhật</option>
              <option value="deprecated">Ngưng cập nhật</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Tổng danh mục công bố</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl text-slate-900">{mockPublishedData.length}</div>
        </div>
        <div className="bg-white border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-green-700">Đã công bố</span>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl text-green-700">
            {mockPublishedData.filter(d => d.status === 'published').length}
          </div>
        </div>
        <div className="bg-white border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-700">Đã cập nhật</span>
            <RefreshCw className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl text-blue-700">
            {mockPublishedData.filter(d => d.status === 'updated').length}
          </div>
        </div>
        <div className="bg-white border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-orange-700">Ngưng cập nhật</span>
            <XCircle className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl text-orange-700">
            {mockPublishedData.filter(d => d.status === 'deprecated').length}
          </div>
        </div>
      </div>

      {/* Data List */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">STT</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Mã danh mục</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Tên danh mục</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Lĩnh vực</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Ngày công bố</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Định dạng</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Lượt tải</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3">
                    <code className="px-2 py-0.5 bg-slate-100 text-indigo-700 rounded text-xs">
                      {item.code}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-slate-900">{item.name}</div>
                    <div className="text-xs text-slate-500">{item.description}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">{item.category}</td>
                  <td className="px-4 py-3 text-sm">{item.publishDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {item.format.map((fmt, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                          {fmt}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{item.downloadCount.toLocaleString()}</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleViewDetail(item)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {activeTab === 'publish' && (item.status === 'ready' || item.status === 'updated') && (
                        <button 
                          onClick={() => { setSelectedData(item); setShowPublishModal(true); }}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded" 
                          title="Công bố danh mục"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      )}
                      {activeTab === 'publish' && item.status === 'published' && (
                        <button className="p-1.5 text-amber-600 hover:bg-amber-50 rounded" title="Cập nhật thông tin công bố">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                      
                      {activeTab === 'unpublish' && item.status === 'published' && (
                        <button 
                          onClick={() => { setSelectedData(item); setShowUnpublishModal(true); }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded" 
                          title="Hủy công khai"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}

                      <div className="relative group">
                        <button className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded" title="Tải xuống">
                          <Download className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 mt-1 w-32 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                          {item.format.map((fmt, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleDownload(item, fmt)}
                              className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg"
                            >
                              {fmt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg text-slate-900">Chi tiết danh mục công bố</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="text-xl">×</span>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Mã danh mục</label>
                  <div className="text-sm text-slate-900">{selectedData.code}</div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Trạng thái</label>
                  <div>{getStatusBadge(selectedData.status)}</div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-slate-600 mb-1">Tên danh mục</label>
                  <div className="text-sm text-slate-900">{selectedData.name}</div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-slate-600 mb-1">Mô tả</label>
                  <div className="text-sm text-slate-900">{selectedData.description}</div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Lĩnh vực</label>
                  <div className="text-sm text-slate-900">{selectedData.category}</div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Đơn vị công bố</label>
                  <div className="text-sm text-slate-900">{selectedData.publisher}</div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Ngày công bố</label>
                  <div className="text-sm text-slate-900">{selectedData.publishDate}</div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Cập nhật mới nhất</label>
                  <div className="text-sm text-slate-900">{selectedData.lastUpdate}</div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Định dạng hỗ trợ</label>
                  <div className="flex gap-1">
                    {selectedData.format.map((fmt, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Lượt tải xuống</label>
                  <div className="text-sm text-slate-900">{selectedData.downloadCount.toLocaleString()}</div>
                </div>
              </div>

              {/* Download Section */}
              <div className="border-t border-slate-200 pt-6">
                <h4 className="text-sm text-slate-900 mb-3">Tải xuống danh mục</h4>
                <div className="grid grid-cols-3 gap-3">
                  {selectedData.format.map((fmt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleDownload(selectedData, fmt)}
                      className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Tải {fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end">
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

      {/* Publish Config Modal */}
      {showPublishModal && selectedData && (
        <PublishConfigModal
          isOpen={showPublishModal}
          onClose={() => {
            setShowPublishModal(false);
            setSelectedData(null);
          }}
          recordName={selectedData.name}
          onConfirm={(config) => {
            setShowPublishModal(false);
            setSelectedData(null);
            toast.success('Mã ' + selectedData.code + ' đã được công bố danh mục thành công. Số phạm vi đã chọn: ' + config.scopes.length);
          }}
        />
      )}

      {/* Unpublish Modal */}
      {showUnpublishModal && selectedData && (
        <UnpublishModal
          isOpen={showUnpublishModal}
          onClose={() => {
            setShowUnpublishModal(false);
            setSelectedData(null);
          }}
          recordName={selectedData.name}
          scopes={selectedData.scopes}
          onConfirm={(reason, selectedScopes) => {
            setShowUnpublishModal(false);
            setSelectedData(null);
            toast.success(`Mã ${selectedData.code} đã được ngừng công khai đối với các phạm vi đã chọn. Lý do: ${reason}`);
          }}
        />
      )}
    </div>
  );
}
