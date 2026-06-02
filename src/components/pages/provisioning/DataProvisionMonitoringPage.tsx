import React, { useState } from 'react';
import { 
  Activity, BarChart3, Download, Network, Share2, Server, Database, 
  AlertCircle, ChevronRight, X, Clock, HelpCircle, CheckCircle2, ArrowRightLeft,
  ChevronDown, Search, Check
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ProvisionExportReportModal } from './modals/ProvisionExportReportModal';
import { AuditLogsTab } from './tabs/AuditLogsTab';
import { ScrollText } from 'lucide-react';

// High-fidelity mock stats based on API
const apiMockStats: Record<string, {
  database: string;
  gatewayStatus: string;
  partnerSystem: string;
  totalRequests: number;
  successRate: string;
  avgLatency: string;
  chartData: any[];
  logs: any[];
}> = {
  'Lấy danh sách Hộ tịch': {
    database: 'CSDL Hộ tịch điện tử',
    gatewayStatus: 'Hoạt động tốt',
    partnerSystem: 'Sở Y tế tỉnh Bắc Ninh',
    totalRequests: 28450,
    successRate: '99.8%',
    avgLatency: '124 ms',
    chartData: [
      { name: 'T2', 'Luồng dữ liệu': 250, 'Lỗi kết nối': 2 },
      { name: 'T3', 'Luồng dữ liệu': 310, 'Lỗi kết nối': 1 },
      { name: 'T4', 'Luồng dữ liệu': 280, 'Lỗi kết nối': 3 },
      { name: 'T5', 'Luồng dữ liệu': 380, 'Lỗi kết nối': 0 },
      { name: 'T6', 'Luồng dữ liệu': 350, 'Lỗi kết nối': 2 },
      { name: 'T7', 'Luồng dữ liệu': 150, 'Lỗi kết nối': 0 },
      { name: 'CN', 'Luồng dữ liệu': 120, 'Lỗi kết nối': 0 },
    ],
    logs: [
      { time: '14:25:01 19/05/2026', type: 'INFO', message: 'API Request successful. Status 200 OK. Recieved token validation.', latency: '115ms', clientIp: '192.168.12.100', responseSize: '4.8 KB' },
      { time: '11:12:00 19/05/2026', type: 'WARN', message: 'High latency detected on API Gateway (850ms). DB Pool overload.', latency: '850ms', clientIp: '192.168.12.100', responseSize: '4.8 KB' },
      { time: '09:40:15 19/05/2026', type: 'INFO', message: 'API Request successful. Status 200 OK. Fetching records from table ho_tich_ca_nhan.', latency: '128ms', clientIp: '10.20.30.45', responseSize: '12.4 KB' }
    ]
  },
  'Đồng bộ dữ liệu THADS': {
    database: 'Cơ sở dữ liệu THADS',
    gatewayStatus: 'Ổn định',
    partnerSystem: 'Hệ thống THADS Quốc gia',
    totalRequests: 14200,
    successRate: '98.5%',
    avgLatency: '310 ms',
    chartData: [
      { name: 'T2', 'Luồng dữ liệu': 110, 'Lỗi kết nối': 8 },
      { name: 'T3', 'Luồng dữ liệu': 140, 'Lỗi kết nối': 12 },
      { name: 'T4', 'Luồng dữ liệu': 130, 'Lỗi kết nối': 5 },
      { name: 'T5', 'Luồng dữ liệu': 180, 'Lỗi kết nối': 20 },
      { name: 'T6', 'Luồng dữ liệu': 170, 'Lỗi kết nối': 4 },
      { name: 'T7', 'Luồng dữ liệu': 90, 'Lỗi kết nối': 1 },
      { name: 'CN', 'Luồng dữ liệu': 60, 'Lỗi kết nối': 0 },
    ],
    logs: [
      { time: '10:45:22 19/05/2026', type: 'ERROR', message: 'Timeout error connecting to CSDL Thi hành án. Connection pool depleted. Retry 3 failed.', latency: '5000ms', clientIp: '172.16.8.99', responseSize: '0 B' },
      { time: '08:15:30 19/05/2026', type: 'INFO', message: 'Sync complete. 45 civil judgements synchronized successfully.', latency: '310ms', clientIp: '172.16.8.99', responseSize: '84.2 KB' }
    ]
  },
  'Đọc thông tin Biện pháp bảo đảm': {
    database: 'CSDL Biện pháp bảo đảm',
    gatewayStatus: 'Hoạt động tốt',
    partnerSystem: 'Cục Giao dịch bảo đảm',
    totalRequests: 8900,
    successRate: '100%',
    avgLatency: '98 ms',
    chartData: [
      { name: 'T2', 'Luồng dữ liệu': 80, 'Lỗi kết nối': 0 },
      { name: 'T3', 'Luồng dữ liệu': 95, 'Lỗi kết nối': 0 },
      { name: 'T4', 'Luồng dữ liệu': 90, 'Lỗi kết nối': 0 },
      { name: 'T5', 'Luồng dữ liệu': 110, 'Lỗi kết nối': 0 },
      { name: 'T6', 'Luồng dữ liệu': 105, 'Lỗi kết nối': 0 },
      { name: 'T7', 'Luồng dữ liệu': 40, 'Lỗi kết nối': 0 },
      { name: 'CN', 'Luồng dữ liệu': 30, 'Lỗi kết nối': 0 },
    ],
    logs: [
      { time: '15:10:04 19/05/2026', type: 'INFO', message: 'Fetch collateral registration. Record ID: 94726-BD. Status 200 OK.', latency: '98ms', clientIp: '192.168.20.14', responseSize: '3.1 KB' }
    ]
  }
};

const apiList = [
  { id: 'Lấy danh sách Hộ tịch', name: 'Lấy danh sách Hộ tịch', database: 'CSDL Hộ tịch điện tử' },
  { id: 'Đồng bộ dữ liệu THADS', name: 'Đồng bộ dữ liệu THADS', database: 'Cơ sở dữ liệu THADS' },
  { id: 'Đọc thông tin Biện pháp bảo đảm', name: 'Đọc thông tin Biện pháp bảo đảm', database: 'CSDL Biện pháp bảo đảm' }
];

const databases = Array.from(new Set(apiList.map(api => api.database)));

export function DataProvisionMonitoringPage() {
  const [activeTab, setActiveTab] = useState<'luong_du_lieu' | 'bao_cao' | 'nhat_ky'>('luong_du_lieu');
  const [showExportModal, setShowExportModal] = useState(false);
  
  // API monitoring select state
  const [selectedDatabase, setSelectedDatabase] = useState<string>('');
  const [selectedApi, setSelectedApi] = useState<string>('Lấy danh sách Hộ tịch');
  
  const filteredApis = selectedDatabase ? apiList.filter(api => api.database === selectedDatabase) : apiList;

  // Auto-select first API when database changes
  React.useEffect(() => {
    if (selectedDatabase) {
      const isApiInDb = filteredApis.find(a => a.id === selectedApi);
      if (!isApiInDb && filteredApis.length > 0) {
        setSelectedApi(filteredApis[0].id);
      }
    }
  }, [selectedDatabase, filteredApis, selectedApi]);
  
  // Log Detail modal state
  const [selectedLog, setSelectedLog] = useState<any>(null);

  const stats = apiMockStats[selectedApi] || apiMockStats['Lấy danh sách Hộ tịch'];

  return (
    <div className="space-y-6">
      
      {/* Top Banner and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Kiểm soát & Giám sát cung cấp</h2>
          <p className="text-slate-500 mt-1">Giám sát hiệu năng kết nối API thời gian thực, lưu lượng Gateway và báo cáo logs</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          
          {/* Cascading API Selectors */}
          <div className="flex flex-col sm:flex-row items-center gap-0 bg-white border border-slate-200 rounded-lg p-1 shadow-sm shrink-0">
            
            {/* Database Selector */}
            <div className="flex items-center px-3 py-1.5 hover:bg-slate-50 rounded-md transition-colors border-b sm:border-b-0 sm:border-r border-slate-100">
              <Database className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
              <select
                value={selectedDatabase}
                onChange={(e) => setSelectedDatabase(e.target.value)}
                className="text-xs font-bold text-slate-600 bg-transparent focus:outline-none cursor-pointer max-w-[150px] truncate"
              >
                <option value="">Tất cả CSDL</option>
                {databases.map(db => (
                  <option key={db} value={db}>{db}</option>
                ))}
              </select>
            </div>

            {/* API Selector */}
            <div className="flex items-center px-3 py-1.5 hover:bg-slate-50 rounded-md transition-colors">
              <span className="text-[10px] font-bold text-slate-400 uppercase mr-2 shrink-0">API:</span>
              <select
                value={selectedApi}
                onChange={(e) => setSelectedApi(e.target.value)}
                className="text-xs font-extrabold text-amber-700 bg-transparent focus:outline-none cursor-pointer max-w-[200px] truncate"
              >
                {filteredApis.map(api => (
                  <option key={api.id} value={api.id}>{api.name}</option>
                ))}
              </select>
            </div>

          </div>

          <button 
            onClick={() => setShowExportModal(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors font-bold shadow-md hover:scale-[1.02] text-sm shrink-0"
          >
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Overview performance stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block">Tổng số yêu cầu (7 ngày)</span>
          <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{stats.totalRequests.toLocaleString()}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block">Tỷ lệ thành công</span>
          <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">{stats.successRate}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block">Độ trễ trung bình</span>
          <span className="text-2xl font-extrabold text-amber-600 mt-1 block">{stats.avgLatency}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block">Trạng thái Cổng Gateway</span>
          <span className="text-2xl font-extrabold text-slate-800 mt-1 block flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
            {stats.gatewayStatus}
          </span>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/50">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('luong_du_lieu')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm flex items-center transition-colors ${
                activeTab === 'luong_du_lieu'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Network className="w-4 h-4 mr-2" />
              Sơ đồ giám sát & Logs kết nối
            </button>
            <button
              onClick={() => setActiveTab('bao_cao')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm flex items-center transition-colors ${
                activeTab === 'bao_cao'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Báo cáo hiệu năng đồ thị
            </button>
            <button
              onClick={() => setActiveTab('nhat_ky')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm flex items-center transition-colors ${
                activeTab === 'nhat_ky'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <ScrollText className="w-4 h-4 mr-2" />
              Nhật ký khai thác (Audit Logs)
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'luong_du_lieu' ? (
            <div className="space-y-6">
              
              {/* Topology flowchart mapping to select API */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 flex items-center justify-center min-h-[250px]">
                <div className="flex items-center justify-between w-full max-w-4xl relative">
                  
                  {/* CSDL Source */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center border-4 border-blue-500 z-10 shadow-sm">
                      <Database className="w-8 h-8 text-blue-600" />
                    </div>
                    <span className="mt-3 text-xs font-bold text-slate-700">{stats.database}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Nguồn dữ liệu nội bộ</span>
                  </div>

                  {/* Flowing connector arrows */}
                  <div className="absolute top-8 left-16 right-16 h-1.5 bg-slate-200 -z-0 overflow-hidden rounded-full flex items-center justify-between">
                    <div className="h-full bg-amber-500 w-1/3 animate-[pulse_1.5s_infinite] rounded-full"></div>
                    <ArrowRightLeft className="w-4 h-4 text-slate-300 shrink-0 absolute left-1/2 -translate-x-1/2" />
                  </div>

                  {/* API Gateway core */}
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center border-4 border-amber-500 z-10 shadow-lg animate-in zoom-in duration-300">
                      <Server className="w-10 h-10 text-amber-600 animate-pulse" />
                    </div>
                    <span className="mt-3 text-xs font-extrabold text-slate-800">CỔNG API GATEWAY</span>
                    <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full mt-1 font-bold">
                      {stats.gatewayStatus}
                    </span>
                  </div>

                  {/* Partner destination system */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center border-4 border-purple-500 z-10 shadow-sm">
                      <Share2 className="w-8 h-8 text-purple-600" />
                    </div>
                    <span className="mt-3 text-xs font-bold text-slate-700">{stats.partnerSystem}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Đơn vị khai thác API</span>
                  </div>

                </div>
              </div>

              {/* Dynamic Connection logs for chosen API */}
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center uppercase tracking-wider">
                  <Activity className="w-4.5 h-4.5 text-amber-600 mr-1.5" /> 
                  Nhật ký kết nối gần đây
                </h3>
                
                <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100 bg-white">
                  {stats.logs.map((log, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setSelectedLog(log)}
                      className="p-4 hover:bg-slate-50/70 transition-all flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {log.type === 'INFO' && (
                            <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded text-[10px] font-bold">INFO</span>
                          )}
                          {log.type === 'WARN' && (
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px] font-bold">WARN</span>
                          )}
                          {log.type === 'ERROR' && (
                            <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[10px] font-bold">ERROR</span>
                          )}
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${log.type === 'ERROR' ? 'text-rose-700' : log.type === 'WARN' ? 'text-amber-700' : 'text-slate-700'}`}>
                            {log.message}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono block mt-1">Client: {log.clientIp} • Kích thước: {log.responseSize}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-mono block">{log.time}</span>
                          <span className="text-xs font-bold text-slate-600 font-mono mt-0.5 block">{log.latency}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Dynamic Recharts graphs showing dynamic stats based on chosen API */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-auto border border-slate-200 rounded-xl p-4 flex flex-col bg-white">
                  <h3 className="font-bold text-slate-700 mb-4 text-center text-xs uppercase tracking-wider">Lưu lượng truy cập API (7 ngày qua)</h3>
                  <div className="w-full h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorLuong" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 400]} axisLine={{ stroke: '#cbd5e1' }} tickLine={true} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} horizontal={true} />
                        <RechartsTooltip />
                        <Area type="linear" dataKey="Luồng dữ liệu" stroke="#f59e0b" fillOpacity={1} fill="url(#colorLuong)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="h-auto border border-slate-200 rounded-xl p-4 flex flex-col bg-white">
                  <h3 className="font-bold text-slate-700 mb-4 text-center text-xs uppercase tracking-wider">Thống kê lỗi / Cảnh báo kết nối</h3>
                  <div className="w-full h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} horizontal={true} />
                        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 50]} axisLine={{ stroke: '#cbd5e1' }} tickLine={true} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <RechartsTooltip />
                        <Bar dataKey="Lỗi kết nối" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={35} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Detailed Data Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mt-6">
                <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center">
                    <Database className="w-4 h-4 mr-2 text-amber-600" />
                    Dữ liệu chi tiết lưu lượng (7 ngày qua)
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-6 py-3 font-semibold border-b border-slate-200">Ngày</th>
                        <th className="px-6 py-3 font-semibold border-b border-slate-200 text-right">Lưu lượng truy cập</th>
                        <th className="px-6 py-3 font-semibold border-b border-slate-200 text-right">Lỗi kết nối</th>
                        <th className="px-6 py-3 font-semibold border-b border-slate-200 text-right">Tỷ lệ lỗi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {stats.chartData.map((row, idx) => {
                        const total = row['Luồng dữ liệu'] + row['Lỗi kết nối'];
                        const errorRate = total > 0 ? ((row['Lỗi kết nối'] / total) * 100).toFixed(1) : '0.0';
                        return (
                          <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-6 py-3 font-medium text-slate-700">{row.name}</td>
                            <td className="px-6 py-3 text-right text-slate-700 font-mono">{row['Luồng dữ liệu'].toLocaleString()}</td>
                            <td className="px-6 py-3 text-right font-mono">
                              {row['Lỗi kết nối'] > 0 ? (
                                <span className="text-rose-600 font-bold">{row['Lỗi kết nối'].toLocaleString()}</span>
                              ) : (
                                <span className="text-slate-400">0</span>
                              )}
                            </td>
                            <td className="px-6 py-3 text-right">
                              {row['Lỗi kết nối'] > 0 ? (
                                <span className="text-rose-600 font-medium">{errorRate}%</span>
                              ) : (
                                <span className="text-emerald-600 font-medium">0%</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      {/* Summary row */}
                      <tr className="bg-slate-50 font-bold text-slate-800">
                        <td className="px-6 py-3">Tổng cộng</td>
                        <td className="px-6 py-3 text-right font-mono">
                          {stats.chartData.reduce((acc, row) => acc + row['Luồng dữ liệu'], 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-3 text-right font-mono text-rose-600">
                          {stats.chartData.reduce((acc, row) => acc + row['Lỗi kết nối'], 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-3 text-right">
                          {((stats.chartData.reduce((acc, row) => acc + row['Lỗi kết nối'], 0) / 
                            (stats.chartData.reduce((acc, row) => acc + row['Luồng dữ liệu'] + row['Lỗi kết nối'], 0) || 1)) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}
          {activeTab === 'nhat_ky' && (
            <AuditLogsTab />
          )}
        </div>
      </div>

      {/* API Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <AlertCircle className={`w-5 h-5 ${selectedLog.type === 'ERROR' ? 'text-rose-500' : selectedLog.type === 'WARN' ? 'text-amber-500' : 'text-blue-500'}`} />
                <h3 className="text-base font-bold text-slate-800">Chi tiết nhật ký sự cố</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedLog(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content list */}
            <div className="p-5 space-y-4">
              
              {/* Error/Info message bubble */}
              <div className={`p-4 rounded-lg border text-xs font-semibold leading-relaxed ${
                selectedLog.type === 'ERROR' ? 'bg-rose-50 border-rose-200 text-rose-800' : selectedLog.type === 'WARN' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}>
                {selectedLog.message}
              </div>

              {/* Metadatas */}
              <div className="border border-slate-100 rounded-lg divide-y divide-slate-100">
                <div className="grid grid-cols-3 py-2.5 px-3">
                  <span className="text-xs font-bold text-slate-400">Thời gian log:</span>
                  <span className="text-xs text-slate-700 font-mono col-span-2">{selectedLog.time}</span>
                </div>
                <div className="grid grid-cols-3 py-2.5 px-3">
                  <span className="text-xs font-bold text-slate-400">Mức độ cảnh báo:</span>
                  <span className="text-xs col-span-2 font-bold uppercase">{selectedLog.type}</span>
                </div>
                <div className="grid grid-cols-3 py-2.5 px-3">
                  <span className="text-xs font-bold text-slate-400">IP Đối tác khai thác:</span>
                  <span className="text-xs text-slate-700 font-mono col-span-2">{selectedLog.clientIp}</span>
                </div>
                <div className="grid grid-cols-3 py-2.5 px-3">
                  <span className="text-xs font-bold text-slate-400">Độ trễ phản hồi:</span>
                  <span className="text-xs text-amber-600 font-bold font-mono col-span-2">{selectedLog.latency}</span>
                </div>
                <div className="grid grid-cols-3 py-2.5 px-3">
                  <span className="text-xs font-bold text-slate-400">Kích thước phản hồi:</span>
                  <span className="text-xs text-slate-700 font-mono col-span-2">{selectedLog.responseSize}</span>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-100 flex justify-end bg-slate-50">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-bold transition-all shadow-sm"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Reports exporting modal */}
      <ProvisionExportReportModal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)} 
      />

    </div>
  );
}
