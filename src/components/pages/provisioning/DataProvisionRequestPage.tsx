import React, { useState } from 'react';
import { FileText, Search, Download, Share, XSquare, CheckSquare, Plus, Filter } from 'lucide-react';
import { ProvisionDataRequestModal } from './modals/ProvisionDataRequestModal';
import { ProvisionRequestApprovalModal } from './modals/ProvisionRequestApprovalModal';

export function DataProvisionRequestPage() {
  const [activeTab, setActiveTab] = useState<'tiep_nhan' | 'tra_cuu' | 'tao_dich_vu' | 'cong_bo'>('tiep_nhan');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Cung cấp dữ liệu theo yêu cầu</h2>
          <p className="text-slate-500 mt-1">Tiếp nhận yêu cầu, kết xuất và công bố dữ liệu thụ động</p>
        </div>
        <button 
          onClick={() => setShowRequestModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tạo yêu cầu kết xuất
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6 overflow-x-auto" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('tiep_nhan')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'tiep_nhan'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Tiếp nhận yêu cầu
            </button>
            <button
              onClick={() => setActiveTab('tra_cuu')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'tra_cuu'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Search className="w-4 h-4 mr-2" />
              Tra cứu & Kết xuất
            </button>
            <button
              onClick={() => setActiveTab('cong_bo')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'cong_bo'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Share className="w-4 h-4 mr-2" />
              Công bố dịch vụ
            </button>
          </nav>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm yêu cầu..."
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
                  <th className="py-3 px-4 font-medium">Mã YC</th>
                  <th className="py-3 px-4 font-medium">Cơ quan yêu cầu</th>
                  <th className="py-3 px-4 font-medium">Loại dữ liệu</th>
                  <th className="py-3 px-4 font-medium">Ngày yêu cầu</th>
                  <th className="py-3 px-4 font-medium">Trạng thái</th>
                  <th className="py-3 px-4 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-800">YC-2026-0429</td>
                  <td className="py-3 px-4 text-slate-600">Sở Nội vụ Lạng Sơn</td>
                  <td className="py-3 px-4 text-slate-600">Thống kê hộ tịch 2025</td>
                  <td className="py-3 px-4 text-slate-600">29/04/2026</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      Chờ xử lý
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button 
                      onClick={() => { setSelectedRequest({ code: 'YC-2026-0429' }); setShowApprovalModal(true); }}
                      className="text-amber-600 hover:text-amber-700 font-medium text-sm mr-3"
                    >
                      Duyệt
                    </button>
                    <button 
                      onClick={() => { setSelectedRequest({ code: 'YC-2026-0429' }); setShowApprovalModal(true); }}
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      Từ chối
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-800">YC-2026-0315</td>
                  <td className="py-3 px-4 text-slate-600">Công an Lạng Sơn</td>
                  <td className="py-3 px-4 text-slate-600">Danh sách thi hành án</td>
                  <td className="py-3 px-4 text-slate-600">15/03/2026</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Đã cung cấp
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">Tải dữ liệu</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ProvisionDataRequestModal 
        isOpen={showRequestModal} 
        onClose={() => setShowRequestModal(false)} 
      />

      <ProvisionRequestApprovalModal 
        isOpen={showApprovalModal} 
        onClose={() => setShowApprovalModal(false)} 
        requestData={selectedRequest}
      />
    </div>
  );
}
