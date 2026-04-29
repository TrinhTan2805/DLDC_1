import React, { useState } from 'react';
import { Server, GitCompare, Shield, History, Search, Filter, Plus } from 'lucide-react';
import { ProvisionApiModal } from './modals/ProvisionApiModal';

export function DataProvisionApiManagementPage() {
  const [activeTab, setActiveTab] = useState<'api_cung_cap' | 'api_doi_soat' | 'phan_quyen' | 'phien_ban'>('api_cung_cap');
  const [showApiModal, setShowApiModal] = useState(false);
  const [selectedApi, setSelectedApi] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quản lý API Cung cấp & Đối soát</h2>
          <p className="text-slate-500 mt-1">Danh mục API, Phân quyền truy cập và Quản lý phiên bản</p>
        </div>
        <button 
          onClick={() => { setSelectedApi(null); setShowApiModal(true); }}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tạo API mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('api_cung_cap')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'api_cung_cap'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Server className="w-4 h-4 mr-2" />
              API Cung cấp dữ liệu
            </button>
            <button
              onClick={() => setActiveTab('api_doi_soat')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'api_doi_soat'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <GitCompare className="w-4 h-4 mr-2" />
              API Đối soát dữ liệu
            </button>
            <button
              onClick={() => setActiveTab('phan_quyen')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'phan_quyen'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Shield className="w-4 h-4 mr-2" />
              Phân quyền truy cập
            </button>
            <button
              onClick={() => setActiveTab('phien_ban')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'phien_ban'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <History className="w-4 h-4 mr-2" />
              Quản lý phiên bản
            </button>
          </nav>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm API..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
            <button className="flex items-center px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              Bộ lọc
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                  <th className="py-3 px-4 font-medium">Tên API</th>
                  <th className="py-3 px-4 font-medium">Endpoint</th>
                  <th className="py-3 px-4 font-medium">Phiên bản</th>
                  <th className="py-3 px-4 font-medium">Phương thức</th>
                  <th className="py-3 px-4 font-medium">Trạng thái</th>
                  <th className="py-3 px-4 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-800">Lấy danh sách Hộ tịch</td>
                  <td className="py-3 px-4 text-slate-600">/api/v1/hotich/list</td>
                  <td className="py-3 px-4 text-slate-600">v1.2</td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">GET</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Hoạt động
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button 
                      onClick={() => { setSelectedApi({ name: 'Lấy danh sách Hộ tịch', endpoint: '/api/v1/hotich/list', method: 'GET', version: 'v1.2' }); setShowApiModal(true); }}
                      className="text-amber-600 hover:text-amber-700 font-medium text-sm"
                    >
                      Cập nhật
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-800">Đối soát Bản án</td>
                  <td className="py-3 px-4 text-slate-600">/api/v1/doisoat/banan</td>
                  <td className="py-3 px-4 text-slate-600">v1.0</td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">POST</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Hoạt động
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-amber-600 hover:text-amber-700 font-medium text-sm">Cập nhật</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ProvisionApiModal 
        isOpen={showApiModal} 
        onClose={() => setShowApiModal(false)} 
        apiData={selectedApi} 
      />
    </div>
  );
}
