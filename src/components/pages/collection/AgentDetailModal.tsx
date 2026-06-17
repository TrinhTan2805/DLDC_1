import React, { useState } from 'react';
import { X, Search, Calendar, MinusCircle, Monitor, Database, History } from 'lucide-react';

interface AgentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export function AgentDetailModal({ isOpen, onClose, data }: AgentDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'agent' | 'history'>('agent');

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-sans backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-slate-200 flex flex-col" style={{ fontSize: '13px' }}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white rounded-t-lg shrink-0 text-slate-900">
          <h2 className="text-[16px] font-bold flex items-center gap-2 text-slate-800">
            <Monitor className="w-5 h-5 text-blue-600" /> Thông tin Trạm kết nối
          </h2>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="px-6 pt-4 border-b border-slate-200 bg-slate-50/50 shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('agent')}
              className={`px-6 py-2 rounded-t-lg font-medium text-[13px] transition-all ${
                activeTab === 'agent' 
                ? 'bg-white border-x border-t border-slate-200 text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Trạm kết nối
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-2 rounded-t-lg font-medium text-[13px] transition-all ${
                activeTab === 'history' 
                ? 'bg-white border-x border-t border-slate-200 text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Lịch sử thiết bị
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {activeTab === 'agent' ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-2 gap-8">
                {/* DIP - DB Agent */}
                <div className="space-y-4">
                  <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-600" /> DIP - DB Trạm kết nối
                  </h3>
                  <div className="border border-slate-200 rounded overflow-hidden">
                    <table className="w-full text-[13px]">
                      <tbody className="divide-y divide-slate-100">
                        <tr className="bg-slate-50/30">
                          <td className="px-4 py-2.5 font-bold text-slate-700 w-1/3 border-r border-slate-100 text-[11px] uppercase">ID:</td>
                          <td className="px-4 py-2.5 text-slate-600 font-mono">{data.dbAgentId || data.id}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2.5 font-bold text-slate-700 border-r border-slate-100 text-[11px] uppercase">Tên trạm:</td>
                          <td className="px-4 py-2.5 text-slate-600">{data.name}</td>
                        </tr>
                        <tr className="bg-slate-50/30">
                          <td className="px-4 py-2.5 font-bold text-slate-700 border-r border-slate-100 text-[11px] uppercase">Khóa trạm:</td>
                          <td className="px-4 py-2.5 text-slate-600 font-mono text-[11px] truncate max-w-[200px]" title={data.agentKey}>{data.agentKey}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2.5 font-bold text-slate-700 border-r border-slate-100 text-[11px] uppercase">Chu kỳ gọi:</td>
                          <td className="px-4 py-2.5 text-slate-600">{data.callCycle} giây</td>
                        </tr>
                        <tr className="bg-slate-50/30">
                          <td className="px-4 py-2.5 font-bold text-slate-700 border-r border-slate-100 text-[11px] uppercase">Cập nhật CSDL:</td>
                          <td className="px-4 py-2.5 text-slate-600">{data.lastDbUpdate}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2.5 font-bold text-slate-700 border-r border-slate-100 text-[11px] uppercase">Trạng thái trạm:</td>
                          <td className="px-4 py-2.5">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${data.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                              {data.status === 'active' ? 'Kích hoạt' : 'Không kích hoạt'}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* DIP - File Agent */}
                <div className="space-y-4">
                  <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-emerald-600" /> DIP - File Trạm kết nối
                  </h3>
                  <div className="border border-slate-200 rounded overflow-hidden">
                    <table className="w-full text-[13px]">
                      <tbody className="divide-y divide-slate-100">
                        <tr className="bg-slate-50/30">
                          <td className="px-4 py-2.5 font-bold text-slate-700 w-1/3 border-r border-slate-100 text-[11px] uppercase">ID:</td>
                          <td className="px-4 py-2.5 text-slate-600 font-mono">{data.fileAgent?.id}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2.5 font-bold text-slate-700 border-r border-slate-100 text-[11px] uppercase">URL:</td>
                          <td className="px-4 py-2.5 text-blue-600 underline font-mono text-[11px]">{data.fileAgent?.url}</td>
                        </tr>
                        <tr className="bg-slate-50/30">
                          <td className="px-4 py-2.5 font-bold text-slate-700 border-r border-slate-100 text-[11px] uppercase">Hoạt động:</td>
                          <td className="px-4 py-2.5">
                            <span className={`flex items-center gap-1.5 text-[13px] ${data.fileAgent?.isActive ? 'text-green-600' : 'text-red-600'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${data.fileAgent?.isActive ? 'bg-green-600' : 'bg-red-600'}`}></span>
                              {data.fileAgent?.isActive ? 'có hoạt động' : 'không hoạt động'}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2.5 font-bold text-slate-700 border-r border-slate-100 text-[11px] uppercase">Trạng thái:</td>
                          <td className="px-4 py-2.5 text-slate-600">
                            {data.fileAgent?.status === 'active' ? 'Kích hoạt' : 'Không kích hoạt'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Database List */}
              <div className="space-y-4">
                <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Database className="w-4 h-4 text-slate-600" /> Danh sách cơ sở dữ liệu
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                  <table className="w-full text-left text-[13px] border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                        <th className="px-4 py-3 border-r border-slate-200 text-center w-16">ID</th>
                        <th className="px-4 py-3 border-r border-slate-200">Tên CSDL</th>
                        <th className="px-4 py-3 border-r border-slate-200">Tên CSDL gốc</th>
                        <th className="px-4 py-3 border-r border-slate-200">Kiểu CSDL</th>
                        <th className="px-4 py-3 border-r border-slate-200">Trạng thái CSDL</th>
                        <th className="px-4 py-3 text-center w-12">#</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.databases?.map((db: any) => (
                        <tr key={db.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 border-r border-slate-100 text-center text-slate-500 font-mono text-[12px]">{db.id}</td>
                          <td className="px-4 py-3 border-r border-slate-100 font-medium text-slate-800">{db.name}</td>
                          <td className="px-4 py-3 border-r border-slate-100 text-slate-600 italic text-[13px]">{db.originalName}</td>
                          <td className="px-4 py-3 border-r border-slate-100 text-slate-600 font-bold text-[11px]">{db.type}</td>
                          <td className="px-4 py-3 border-r border-slate-100">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              db.status === 'DATA_UPDATED' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 
                              db.status === 'DATA_INCOMPLETED' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                              'bg-slate-50 text-slate-600 border border-slate-100'
                            }`}>
                              {db.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors">
                              <MinusCircle className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* History Filters */}
              <div className="bg-slate-50/80 p-6 rounded-xl border border-slate-200 space-y-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div className="flex items-center gap-4">
                    <label className="w-24 text-[13px] font-medium text-slate-700">Địa chỉ IP</label>
                    <input type="text" className="flex-1 px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-white h-10 text-[13px]" />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-24 text-[13px] font-medium text-slate-700">Tên máy chủ</label>
                    <input type="text" className="flex-1 px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-white h-10 text-[13px]" />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-24 text-[13px] font-medium text-slate-700">Hành động</label>
                    <input type="text" className="flex-1 px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-white h-10 text-[13px]" />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-24 text-[13px] font-medium text-slate-700">Loại</label>
                    <input type="text" className="flex-1 px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-white h-10 text-[13px]" />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-24 text-[13px] font-medium text-slate-700">Ngày</label>
                    <div className="flex-1 flex items-center gap-2">
                       <div className="relative flex-1">
                          <input 
                            type="date" 
                            className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none bg-white h-10 pr-10 text-[13px] text-slate-700" 
                          />
                          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                       </div>
                       <div className="relative flex-1">
                          <input 
                            type="date" 
                            className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none bg-white h-10 pr-10 text-[13px] text-slate-700" 
                          />
                          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                       </div>
                    </div>
                  </div>
                  <div className="flex justify-end items-end h-full">
                    <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm text-[13px]">
                      <Search className="w-4 h-4" /> Tìm kiếm
                    </button>
                  </div>
                </div>
              </div>

              {/* History Table */}
              <div className="space-y-4">
                <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <History className="w-4 h-4 text-slate-600" /> Danh sách lịch sử thiết bị
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                  <table className="w-full text-left text-[13px] border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                        <th className="px-6 py-3 border-r border-slate-200">Hành động</th>
                        <th className="px-6 py-3 border-r border-slate-200">Loại</th>
                        <th className="px-6 py-3 border-r border-slate-200">Trạm kết nối</th>
                        <th className="px-6 py-3 border-r border-slate-200">Địa chỉ IP</th>
                        <th className="px-6 py-3 border-r border-slate-200">Tên máy chủ</th>
                        <th className="px-6 py-3 border-r border-slate-200">Ngày</th>
                        <th className="px-6 py-3 text-center w-12">#</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {[...Array(10)].map((_, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-3 border-r border-slate-100 font-bold text-slate-800">NEW</td>
                          <td className="px-6 py-3 border-r border-slate-100 text-slate-600 font-bold">DATA_REQUEST</td>
                          <td className="px-6 py-3 border-r border-slate-100 text-slate-500 font-mono">{data.id}</td>
                          <td className="px-6 py-3 border-r border-slate-100 text-slate-600 font-mono text-[13px]">GS-HienLT52/10.86.142.136</td>
                          <td className="px-6 py-3 border-r border-slate-100 text-slate-600 font-mono">GS-HienLT52</td>
                          <td className="px-6 py-3 border-r border-slate-100 text-slate-600">11/20/2025</td>
                          <td className="px-6 py-3 text-center">
                            <button className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors">
                              <MinusCircle className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-8 py-2 text-[13px] font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
