import React, { useState } from 'react';
import { Settings, CheckCircle, XCircle, Share2, Search, Filter, Plus, FileText, Activity } from 'lucide-react';
import { ProvisionServiceModal } from './modals/ProvisionServiceModal';
import { ProvisionServiceApprovalModal } from './modals/ProvisionServiceApprovalModal';
import { ProvisionServicePublishModal } from './modals/ProvisionServicePublishModal';

export function DataProvisionServiceSetupPage() {
  const [activeTab, setActiveTab] = useState<'setup' | 'approve' | 'publish'>('setup');
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Thiết lập điều phối dữ liệu</h2>
          <p className="text-slate-500 mt-1">Thiết lập, phê duyệt và công khai dịch vụ cung cấp dữ liệu</p>
        </div>
        <button
          onClick={() => { setSelectedService(null); setShowServiceModal(true); }}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tạo mới dịch vụ
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('setup')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'setup'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
            >
              <Settings className="w-4 h-4 mr-2" />
              Thiết lập dịch vụ
            </button>
            <button
              onClick={() => setActiveTab('approve')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'approve'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Kiểm tra & Phê duyệt
            </button>
            <button
              onClick={() => setActiveTab('publish')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'publish'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Công khai dịch vụ
            </button>
          </nav>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm dịch vụ..."
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
                  <th className="py-3 px-4 font-medium">Tên dịch vụ</th>
                  <th className="py-3 px-4 font-medium">Loại dữ liệu</th>
                  <th className="py-3 px-4 font-medium">Tần suất</th>
                  <th className="py-3 px-4 font-medium">Giao thức</th>
                  <th className="py-3 px-4 font-medium">Trạng thái</th>
                  <th className="py-3 px-4 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-800">DV_Hộ tịch điện tử</td>
                  <td className="py-3 px-4 text-slate-600">Dữ liệu công dân</td>
                  <td className="py-3 px-4 text-slate-600">Thời gian thực</td>
                  <td className="py-3 px-4 text-slate-600">REST API</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Chờ phê duyệt
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedService({ name: 'DV_Hộ tịch điện tử', code: 'DV_001' });
                        if (activeTab === 'approve') setShowApprovalModal(true);
                        else if (activeTab === 'publish') setShowPublishModal(true);
                        else setShowServiceModal(true);
                      }}
                      className="text-amber-600 hover:text-amber-700 font-medium text-sm"
                    >
                      {activeTab === 'approve' ? 'Phê duyệt' : activeTab === 'publish' ? 'Công khai' : 'Chi tiết'}
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-800">DV_Thi hành án dân sự</td>
                  <td className="py-3 px-4 text-slate-600">Thông tin bản án</td>
                  <td className="py-3 px-4 text-slate-600">Hàng ngày</td>
                  <td className="py-3 px-4 text-slate-600">SOAP</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Đã công khai
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedService({ name: 'DV_Thi hành án dân sự', code: 'DV_002' });
                        if (activeTab === 'approve') setShowApprovalModal(true);
                        else if (activeTab === 'publish') setShowPublishModal(true);
                        else setShowServiceModal(true);
                      }}
                      className="text-amber-600 hover:text-amber-700 font-medium text-sm"
                    >
                      {activeTab === 'approve' ? 'Phê duyệt' : activeTab === 'publish' ? 'Công khai' : 'Chi tiết'}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ProvisionServiceModal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        service={selectedService}
      />

      <ProvisionServiceApprovalModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        service={selectedService}
      />

      <ProvisionServicePublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        service={selectedService}
      />
    </div>
  );
}
