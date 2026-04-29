import React, { useState } from 'react';
import { Activity, BarChart3, Download, Network, Share2, Server, Database, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { ProvisionExportReportModal } from './modals/ProvisionExportReportModal';

const mockData = [
  { name: 'T2', 'Luồng dữ liệu': 400, 'Lỗi kết nối': 24 },
  { name: 'T3', 'Luồng dữ liệu': 300, 'Lỗi kết nối': 13 },
  { name: 'T4', 'Luồng dữ liệu': 200, 'Lỗi kết nối': 98 },
  { name: 'T5', 'Luồng dữ liệu': 278, 'Lỗi kết nối': 39 },
  { name: 'T6', 'Luồng dữ liệu': 189, 'Lỗi kết nối': 48 },
  { name: 'T7', 'Luồng dữ liệu': 239, 'Lỗi kết nối': 38 },
  { name: 'CN', 'Luồng dữ liệu': 349, 'Lỗi kết nối': 43 },
];

export function DataProvisionMonitoringPage() {
  const [activeTab, setActiveTab] = useState<'luong_du_lieu' | 'bao_cao'>('luong_du_lieu');
  const [showExportModal, setShowExportModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Kiểm soát & Giám sát cung cấp</h2>
          <p className="text-slate-500 mt-1">Giám sát luồng dữ liệu và Báo cáo thống kê dịch vụ</p>
        </div>
        <button 
          onClick={() => setShowExportModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Download className="w-5 h-5 mr-2" />
          Xuất báo cáo
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('luong_du_lieu')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'luong_du_lieu'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Network className="w-4 h-4 mr-2" />
              Giám sát luồng dữ liệu
            </button>
            <button
              onClick={() => setActiveTab('bao_cao')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'bao_cao'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Báo cáo thống kê
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'luong_du_lieu' ? (
            <div className="space-y-6">
              {/* Flowchart Mockup */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 flex items-center justify-center min-h-[300px]">
                <div className="flex items-center justify-between w-full max-w-4xl relative">
                  {/* Source */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center border-4 border-blue-500 z-10">
                      <Database className="w-8 h-8 text-blue-600" />
                    </div>
                    <span className="mt-3 font-medium text-slate-700">CSDL Hộ tịch</span>
                  </div>

                  {/* Lines */}
                  <div className="absolute top-8 left-16 right-16 h-1 bg-slate-300 -z-0 overflow-hidden">
                    <div className="h-full bg-amber-500 w-1/2 animate-[pulse_2s_ease-in-out_infinite]"></div>
                  </div>

                  {/* Gateway */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center border-4 border-amber-500 z-10 shadow-lg">
                      <Server className="w-8 h-8 text-amber-600" />
                    </div>
                    <span className="mt-3 font-medium text-slate-700">API Gateway</span>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full mt-1">Hoạt động tốt</span>
                  </div>

                  {/* Destination */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center border-4 border-purple-500 z-10">
                      <Share2 className="w-8 h-8 text-purple-600" />
                    </div>
                    <span className="mt-3 font-medium text-slate-700">Công an tỉnh</span>
                  </div>
                </div>
              </div>

              {/* Error Logs */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" /> Cảnh báo & Lỗi kết nối gần đây
                </h3>
                <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                  <div className="text-sm text-red-800 font-medium">[10:45:22 29/04/2026] Timeout error connecting to CSDL Thi hành án. Retry 3 failed.</div>
                  <div className="text-sm text-amber-800 font-medium mt-2">[09:12:00 29/04/2026] High latency detected on API Gateway (850ms).</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-80 border border-slate-200 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-700 mb-4 text-center">Lưu lượng truy cập API (7 ngày)</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorLuong" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <RechartsTooltip />
                      <Area type="monotone" dataKey="Luồng dữ liệu" stroke="#f59e0b" fillOpacity={1} fill="url(#colorLuong)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-80 border border-slate-200 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-700 mb-4 text-center">Thống kê lỗi kết nối</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="Lỗi kết nối" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ProvisionExportReportModal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)} 
      />
    </div>
  );
}
