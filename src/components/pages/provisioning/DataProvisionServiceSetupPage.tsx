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
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/30 px-6 py-2 flex items-center justify-between">
          <nav className="flex space-x-12" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('setup')}
              className={`whitespace-nowrap py-4 px-2 border-b-2 font-bold text-xs uppercase tracking-[0.2em] flex items-center transition-all ${activeTab === 'setup'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300'
                }`}
            >
              <Settings className="w-4 h-4 mr-3" />
              Thiết lập dịch vụ
            </button>
            <button
              onClick={() => setActiveTab('approve')}
              className={`whitespace-nowrap py-4 px-2 border-b-2 font-bold text-xs uppercase tracking-[0.2em] flex items-center transition-all ${activeTab === 'approve'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300'
                }`}
            >
              <CheckCircle className="w-4 h-4 mr-3" />
              Kiểm tra & Phê duyệt
            </button>
            <button
              onClick={() => setActiveTab('publish')}
              className={`whitespace-nowrap py-4 px-2 border-b-2 font-bold text-xs uppercase tracking-[0.2em] flex items-center transition-all ${activeTab === 'publish'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300'
                }`}
            >
              <Share2 className="w-4 h-4 mr-3" />
              Công khai dịch vụ
            </button>
          </nav>

          <button
            onClick={() => { setSelectedService(null); setShowServiceModal(true); }}
            className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-lg flex items-center transition-all shadow-md shadow-amber-200 font-bold text-xs uppercase tracking-widest"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo mới
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'approve' ? (
            <div className="space-y-6">
              {/* Approval Sub-tabs */}
              <div className="flex border-b border-slate-100 mb-6">
                <button className="px-6 py-2 border-b-2 border-amber-500 text-amber-600 font-bold text-xs uppercase tracking-widest">
                  Tất cả (2)
                </button>
                <button className="px-6 py-2 border-b-2 border-transparent text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600">
                  Chờ phê duyệt (1)
                </button>
                <button className="px-6 py-2 border-b-2 border-transparent text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600">
                  Đã phê duyệt (1)
                </button>
                <button className="px-6 py-2 border-b-2 border-transparent text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600">
                  Từ chối (0)
                </button>
              </div>

              {/* Search Bar - Specific for Approval */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tra cứu dịch vụ phê duyệt..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                />
              </div>

              {/* Approval Cards List */}
              <div className="grid grid-cols-1 gap-4">
                {[
                  { name: 'DV_Hộ tịch điện tử', code: 'DV_001', type: 'Dữ liệu công dân', freq: 'Thời gian thực', protocol: 'REST API', status: 'pending', date: '2026-05-11' },
                  { name: 'DV_Thi hành án dân sự', code: 'DV_002', type: 'Thông tin bản án', freq: 'Hàng ngày', protocol: 'SOAP', status: 'approved', date: '2026-05-10' }
                ].map((item, idx) => (
                  <div key={idx} className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all group relative">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${item.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          <Activity className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-lg group-hover:text-amber-600 transition-colors">{item.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mã:</span>
                            <span className="text-xs font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded">{item.code}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.status === 'pending' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        }`}>
                          {item.status === 'pending' ? 'Chờ phê duyệt' : 'Đã công khai'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4 border-t border-slate-50">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Loại dữ liệu</p>
                        <p className="text-sm text-slate-700 font-medium">{item.type}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tần suất</p>
                        <p className="text-sm text-slate-700 font-medium">{item.freq}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Giao thức</p>
                        <p className="text-sm text-slate-700 font-medium font-mono">{item.protocol}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ngày tạo</p>
                        <p className="text-sm text-slate-700 font-medium">{item.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-50">
                      <button 
                        onClick={() => { setSelectedService(item); setShowServiceModal(true); }}
                        className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-widest"
                      >
                        Xem chi tiết
                      </button>
                      <button 
                        onClick={() => { setSelectedService(item); setShowApprovalModal(true); }}
                        className="px-4 py-2 text-xs font-bold text-red-500 hover:text-white border border-red-200 rounded-lg hover:bg-red-500 transition-all uppercase tracking-widest"
                      >
                        Từ chối
                      </button>
                      <button 
                        onClick={() => { setSelectedService(item); setShowApprovalModal(true); }}
                        className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all uppercase tracking-widest"
                      >
                        Phê duyệt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
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
                            if (activeTab === 'publish') setShowPublishModal(true);
                            else setShowServiceModal(true);
                          }}
                          className="text-amber-600 hover:text-amber-700 font-medium text-sm"
                        >
                          {activeTab === 'publish' ? 'Công khai' : 'Chi tiết'}
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
                            if (activeTab === 'publish') setShowPublishModal(true);
                            else setShowServiceModal(true);
                          }}
                          className="text-amber-600 hover:text-amber-700 font-medium text-sm"
                        >
                          {activeTab === 'publish' ? 'Công khai' : 'Chi tiết'}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      <ProvisionServiceModal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        onSave={(isPublic) => {
          if (isPublic) setActiveTab('publish');
        }}
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
