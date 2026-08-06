import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Activity, BarChart3, Download, Network, Share2, Server, Database, 
  AlertCircle, ChevronRight, X, Clock, HelpCircle, CheckCircle2, ArrowRightLeft,
  ChevronDown, Search, Check, Info
} from 'lucide-react';
import { ProvisionExportReportModal } from './modals/ProvisionExportReportModal';
import { ProvisionServiceModal } from './modals/ProvisionServiceModal';
import { AuditLogsTab } from './tabs/AuditLogsTab';
import { ScrollText } from 'lucide-react';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, Label, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// High-fidelity mock stats based on API
const apiMockStats: Record<string, {
  database: string;
  gatewayStatus: string;
  partners: Array<{ name: string; connection: 'active' | 'error' }>;
  totalRequests: number;
  successRate: string;
  avgLatency: string;
  chartData: any[];
  logs: any[];
  sourceConnection: 'active' | 'error';
}> = {
  'Lấy danh sách Hộ tịch': {
    database: 'CSDL Hộ tịch điện tử',
    gatewayStatus: 'Hoạt động tốt',
    partners: [
      { name: 'Sở Y tế tỉnh Bắc Ninh', connection: 'active' },
      { name: 'Sở Y tế tỉnh Quảng Ninh', connection: 'active' }
    ],
    totalRequests: 28450,
    successRate: '99.8%',
    avgLatency: '124 ms',
    sourceConnection: 'active',
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
    partners: [
      { name: 'Hệ thống THADS Quốc gia', connection: 'active' }
    ],
    totalRequests: 14200,
    successRate: '98.5%',
    avgLatency: '310 ms',
    sourceConnection: 'error',
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
    partners: [
      { name: 'Cục Giao dịch bảo đảm', connection: 'active' }
    ],
    totalRequests: 8900,
    successRate: '100%',
    avgLatency: '98 ms',
    sourceConnection: 'active',
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
  { id: 'Lấy danh sách Hộ tịch', name: 'Lấy danh sách Hộ tịch', database: 'CSDL Hộ tịch điện tử', code: 'SVC-HOTICH-001' },
  { id: 'Đồng bộ dữ liệu THADS', name: 'Đồng bộ dữ liệu THADS', database: 'Cơ sở dữ liệu THADS', code: 'SVC-THADS-001' },
  { id: 'Đọc thông tin Biện pháp bảo đảm', name: 'Đọc thông tin Biện pháp bảo đảm', database: 'CSDL Biện pháp bảo đảm', code: 'SVC-BPBD-001' }
];

const databases = Array.from(new Set(apiList.map(api => api.database)));

// Dữ liệu báo cáo thống kê theo ngày trong tháng (tổng hợp toàn hệ thống — UC2)
const reportBase = [150, 210, 180, 260, 300, 90, 70, 160, 230, 200, 280, 310, 100, 80, 170, 240, 190, 300, 290, 110, 75, 165, 225, 205, 295, 320, 95, 70, 180, 250];
const reportData = reportBase.map((v, i) => ({
  day: `${String(i + 1).padStart(2, '0')}/06`,
  luuLuong: v,
  luotTruyCap: Math.round(v * 3.5),
  thoiGianPhanHoi: Math.round(110 + v * 0.7),
  loiKetNoi: i % 9 === 0 ? 14 : (i % 5 === 0 ? 6 : 1),
}));

// Tỷ lệ lưu lượng yêu cầu theo CSDL/API [Unverified] - áp dụng cùng bộ lọc (CSDL/API/khoảng ngày) với tab Báo cáo thống kê
const REQUEST_SHARE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
// Khoảng thời gian mốc của bộ dữ liệu báo cáo (Tháng 06/2026) để tính tỷ lệ theo khoảng ngày đã chọn
const REQUEST_SHARE_BASELINE_START = new Date('2026-06-01').getTime();
const REQUEST_SHARE_BASELINE_END = new Date('2026-06-30').getTime();
const getRequestShareDateScale = (from: string, to: string) => {
  if (!from && !to) return 1;
  const start = from ? new Date(from).getTime() : REQUEST_SHARE_BASELINE_START;
  const end = to ? new Date(to).getTime() : REQUEST_SHARE_BASELINE_END;
  const totalDays = (REQUEST_SHARE_BASELINE_END - REQUEST_SHARE_BASELINE_START) / 86400000;
  const clampedStart = Math.max(start, REQUEST_SHARE_BASELINE_START);
  const clampedEnd = Math.min(end, REQUEST_SHARE_BASELINE_END);
  const selectedDays = Math.max(0, (clampedEnd - clampedStart) / 86400000);
  return totalDays > 0 ? Math.max(0.1, Math.min(1, selectedDays / totalDays)) : 1;
};

// Các loại báo cáo (UC2.1) — mỗi loại có kiểu biểu đồ phù hợp (UC2.2)
const reportTypes: Array<{ key: string; label: string; dataKey: string; unit: string; chart: 'area' | 'line' | 'threshold' | 'bar'; threshold?: number; color: string }> = [
  { key: 'luuluong', label: 'Lưu lượng dữ liệu', dataKey: 'luuLuong', unit: 'MB', chart: 'area', color: '#2563eb' },
  { key: 'truycap', label: 'Số lượt truy cập', dataKey: 'luotTruyCap', unit: 'lượt', chart: 'line', color: '#2563eb' },
  { key: 'phanhoi', label: 'Thời gian phản hồi', dataKey: 'thoiGianPhanHoi', unit: 'ms', chart: 'threshold', threshold: 250, color: '#2563eb' },
  { key: 'loi', label: 'Lỗi kết nối', dataKey: 'loiKetNoi', unit: 'lỗi', chart: 'bar', color: '#dc2626' },
];

export function DataProvisionMonitoringPage() {
  const [activeTab, setActiveTab] = useState<'luong_du_lieu' | 'bao_cao' | 'nhat_ky'>('bao_cao');
  const [showExportModal, setShowExportModal] = useState(false);
  
  // API monitoring select state
  const [selectedDatabase, setSelectedDatabase] = useState<string>('');
  const [selectedApi, setSelectedApi] = useState<string>('');
  
  // Pagination for detailed table
  const [tablePage, setTablePage] = useState(1);
  const tableItemsPerPage = 5;
  
  const filteredApis = selectedDatabase ? apiList.filter(api => api.database === selectedDatabase) : apiList;

  // Auto-select first API when database changes
  React.useEffect(() => {
    if (selectedDatabase && selectedApi !== '') {
      const isApiInDb = filteredApis.find(a => a.id === selectedApi);
      if (!isApiInDb && filteredApis.length > 0) {
        setSelectedApi(filteredApis[0].id);
      }
    }
  }, [selectedDatabase, filteredApis, selectedApi]);

  React.useEffect(() => {
    setTablePage(1);
  }, [selectedApi]);
  
  // Log Detail modal state
  const [selectedLog, setSelectedLog] = useState<any>(null);
  // API được chọn để xem chi tiết (modal chi tiết API)
  const [detailApi, setDetailApi] = useState<string | null>(null);
  // API đang xem sơ đồ luồng (null = hiển thị danh sách)
  const [flowApi, setFlowApi] = useState<string | null>(null);
  // Bộ lọc thời gian
  const [monFrom, setMonFrom] = useState('');
  const [monTo, setMonTo] = useState('');

  const isAllApi = selectedApi === '';
  const stats = apiMockStats[selectedApi] || apiMockStats[filteredApis[0]?.id] || apiMockStats['Lấy danh sách Hộ tịch'];

  // Tổng hợp số liệu khi chọn "Tất cả API"
  const aggregateStats = React.useMemo(() => {
    const list = filteredApis.map(a => apiMockStats[a.id]).filter(Boolean);
    const totalRequests = list.reduce((s, x) => s + x.totalRequests, 0);
    const wSuccess = totalRequests ? list.reduce((s, x) => s + x.totalRequests * parseFloat(x.successRate), 0) / totalRequests : 0;
    const wLatency = totalRequests ? list.reduce((s, x) => s + x.totalRequests * parseInt(x.avgLatency), 0) / totalRequests : 0;
    const hasError = list.some(x => x.sourceConnection === 'error' || (x.partners || []).some(p => p.connection === 'error'));
    const logs = list.flatMap(x => x.logs);
    return {
      totalRequests,
      successRate: wSuccess.toFixed(1) + '%',
      avgLatency: Math.round(wLatency) + ' ms',
      gatewayStatus: hasError ? 'Có cảnh báo' : 'Hoạt động tốt',
      logs,
    };
  }, [filteredApis]);

  const view = isAllApi ? aggregateStats : stats;
  // Danh sách API hiển thị trong tab Sơ đồ (lọc theo API đang chọn ở header)
  const listApis = isAllApi ? filteredApis : filteredApis.filter(a => a.id === selectedApi);

  const paginatedChartData = React.useMemo(() => {
    return stats.chartData.slice((tablePage - 1) * tableItemsPerPage, tablePage * tableItemsPerPage);
  }, [stats.chartData, tablePage, tableItemsPerPage]);

  // Loại báo cáo đang chọn (UC2.1)
  const [reportType, setReportType] = useState('luuluong');
  const currentReportType = reportTypes.find(r => r.key === reportType) || reportTypes[0];
  // Ngưỡng cảnh báo thời gian phản hồi (ms) — cấu hình được
  const [responseThreshold, setResponseThreshold] = useState(250);
  const paginatedReport = React.useMemo(() => {
    return reportData.slice((tablePage - 1) * tableItemsPerPage, tablePage * tableItemsPerPage);
  }, [tablePage, tableItemsPerPage]);

  // Tỷ lệ lưu lượng yêu cầu theo CSDL/API - áp dụng bộ lọc CSDL/API/khoảng ngày ở đầu trang
  const requestShareDateScale = getRequestShareDateScale(monFrom, monTo);
  const requestShareData = listApis.map((api, i) => ({
    name: api.name,
    value: Math.max(1, Math.round((apiMockStats[api.id]?.totalRequests || 0) * requestShareDateScale)),
    color: REQUEST_SHARE_COLORS[i % REQUEST_SHARE_COLORS.length],
  }));
  const requestShareTotal = requestShareData.reduce((sum, item) => sum + item.value, 0);

  const renderTablePagination = (totalItems: number) => {
    const totalPages = Math.ceil(totalItems / tableItemsPerPage) || 1;
    return (
      <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white sm:px-6 text-[13px] collection-pagination">
        <div className="flex items-center gap-2">
          <span className="text-slate-600">Hiển thị {tableItemsPerPage} bản ghi/trang</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-slate-600">
            {totalItems === 0 ? 0 : (tablePage - 1) * tableItemsPerPage + 1} - {Math.min(tablePage * tableItemsPerPage, totalItems)} / {totalItems}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTablePage(tablePage > 1 ? tablePage - 1 : tablePage)}
              disabled={tablePage === 1}
              className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
            >
              Trước
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setTablePage(page)}
                className={`px-3 py-1.5 border rounded-lg font-medium text-[13px] transition-colors ${
                  tablePage === page
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-[#e2e8f0] text-slate-600 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => {
                if (tablePage < totalPages) {
                  setTablePage(tablePage + 1);
                }
              }}
              disabled={tablePage === totalPages || totalItems === 0}
              className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="monitoring-page-root" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .monitoring-page-root *:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(svg):not(path):not(circle):not(rect):not(polyline):not(line) {
          font-size: 13px !important;
        }
        .monitoring-page-root .stat-card-title {
          font-size: 16px !important;
        }
      `}} />
      <div className="space-y-6">
        
        {/* Filter bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-[12px] text-slate-500 mb-1 font-medium">Cơ sở dữ liệu</label>
              <select
                value={selectedDatabase}
                onChange={(e) => setSelectedDatabase(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả CSDL</option>
                {databases.map(db => (<option key={db} value={db}>{db}</option>))}
              </select>
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-[12px] text-slate-500 mb-1 font-medium">API</label>
              <select
                value={selectedApi}
                onChange={(e) => setSelectedApi(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả API</option>
                {filteredApis.map(api => (<option key={api.id} value={api.id}>{api.name}</option>))}
              </select>
            </div>
            <div className="min-w-[150px]">
              <label className="block text-[12px] text-slate-500 mb-1 font-medium">Từ ngày</label>
              <input type="date" value={monFrom} onChange={(e) => setMonFrom(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="min-w-[150px]">
              <label className="block text-[12px] text-slate-500 mb-1 font-medium">Đến ngày</label>
              <input type="date" value={monTo} onChange={(e) => setMonTo(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button
              onClick={() => setShowExportModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors font-medium text-[13px] shadow-sm shrink-0"
            >
              <Download className="w-4 h-4 mr-2" />
              Xuất báo cáo
            </button>
          </div>
        </div>

        {/* Overview performance stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg shrink-0">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <span className="stat-card-title text-[16px] text-slate-500 block">Tổng số yêu cầu</span>
              <span className="text-xl font-bold text-slate-800 block">{view.totalRequests.toLocaleString()}</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <span className="stat-card-title text-[16px] text-slate-500 block">Tỷ lệ thành công</span>
              <span className="text-xl font-bold text-emerald-600 block">{view.successRate}</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg shrink-0">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <span className="stat-card-title text-[16px] text-slate-500 block">Thời gian phản hồi TB</span>
              <span className="text-xl font-bold text-blue-600 block">{view.avgLatency}</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg shrink-0">
              <Server className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <span className="stat-card-title text-[16px] text-slate-500 block">Trạng thái Cổng Gateway</span>
              <span className="text-xl font-bold text-slate-800 block flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full inline-block animate-pulse ${view.gatewayStatus.includes('cảnh báo') ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                {view.gatewayStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50/50">
            <nav className="flex space-x-6 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('bao_cao')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-[13px] flex items-center transition-colors ${
                  activeTab === 'bao_cao'
                    ? 'border-blue-600 text-blue-600 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Báo cáo thống kê
              </button>
              <button
                onClick={() => setActiveTab('luong_du_lieu')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-[13px] flex items-center transition-colors ${
                  activeTab === 'luong_du_lieu'
                    ? 'border-blue-600 text-blue-600 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Network className="w-4 h-4 mr-2" />
                Sơ đồ giám sát
              </button>
              <button
                onClick={() => setActiveTab('nhat_ky')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-[13px] flex items-center transition-colors ${
                  activeTab === 'nhat_ky'
                    ? 'border-blue-600 text-blue-600 font-semibold'
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
              
              {/* Danh sách API; bấm "Xem sơ đồ" để xem sơ đồ luồng chi tiết */}
              {flowApi ? (() => {
                const stats = apiMockStats[flowApi];
                const info = apiList.find(a => a.id === flowApi);
                if (!stats) return null;
                return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[13px] text-slate-600">
                    <Network className="w-4 h-4 text-blue-600" />
                    Sơ đồ luồng: <span className="font-semibold text-slate-800">{info?.name}</span>
                  </div>
                  <button onClick={() => setFlowApi(null)} className="px-3 py-1.5 text-[13px] text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 font-medium flex items-center gap-1.5">
                    <X className="w-4 h-4" /> Đóng
                  </button>
                </div>
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 flex items-center justify-center min-h-[300px] overflow-hidden">
                <div className="flex w-full max-w-5xl items-center relative">
                  
                  {/* SOURCE */}
                  <div className="relative flex flex-col items-center w-32 shrink-0 z-10">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-4 border-blue-500 shadow-sm relative z-10">
                      <Database className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="absolute top-full mt-3 flex flex-col items-center w-40 text-center">
                      <span className="text-xs font-bold text-slate-700">{stats.database}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Nguồn dữ liệu nội bộ</span>
                    </div>
                  </div>

                  {/* LINE: Source -> Gateway */}
                  <div className="flex-1 relative flex items-center justify-center z-0 px-2 min-w-[100px]">
                    <div className={`w-full h-1.5 rounded-full relative flex items-center justify-center overflow-hidden ${stats.sourceConnection === 'active' ? 'bg-slate-200' : 'bg-rose-100'}`}>
                      {stats.sourceConnection === 'active' ? (
                        <>
                          <div className="absolute left-0 h-full bg-emerald-500 w-1/2 animate-[pulse_1.5s_infinite] rounded-full"></div>
                          <ArrowRightLeft className="w-4 h-4 text-emerald-600 bg-white rounded-full relative z-10 p-0.5 shadow-sm" />
                        </>
                      ) : (
                        <>
                          <div className="w-full border-t-2 border-dashed border-rose-400 absolute"></div>
                          <X className="w-4 h-4 text-white bg-rose-500 rounded-full relative z-10 p-0.5 shadow-sm" />
                        </>
                      )}
                    </div>
                    <div className="absolute top-full mt-2">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full border whitespace-nowrap ${stats.sourceConnection === 'active' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-rose-600 bg-rose-50 border-rose-100'}`}>
                        {stats.sourceConnection === 'active' ? 'Kết nối ổn định' : 'Mất kết nối'}
                      </span>
                    </div>
                  </div>

                  {/* GATEWAY */}
                  <div className="relative flex flex-col items-center w-40 shrink-0 z-10">
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center border-4 border-blue-500 shadow-lg animate-in zoom-in duration-300 relative z-10">
                      <Server className="w-10 h-10 text-blue-600 animate-pulse" />
                    </div>
                    <div className="absolute top-full mt-3 flex flex-col items-center w-48 text-center">
                      <span className="text-xs font-extrabold text-slate-800">CỔNG API GATEWAY</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full mt-1 font-bold ${stats.gatewayStatus === 'Hoạt động tốt' || stats.gatewayStatus === 'Ổn định' ? 'bg-green-150 text-green-700' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                        {stats.gatewayStatus}
                      </span>
                    </div>
                  </div>

                  {/* TRUNK LINE FROM GATEWAY (only if multiple partners) */}
                  {stats.partners && stats.partners.length > 1 && (
                     <div className="w-6 h-1.5 bg-slate-200 z-0 -mr-0.5 rounded-l-full"></div>
                  )}

                  {/* PARTNERS CONTAINER */}
                  <div className={`flex-1 flex flex-col justify-center relative min-w-[150px] ${stats.partners && stats.partners.length === 1 ? 'pl-2' : ''}`}>
                    
                     {stats.partners && stats.partners.map((partner, idx) => (
                       <div key={idx} className={`flex items-center w-full relative ${stats.partners.length > 1 ? 'py-12' : 'py-0'}`}>
                         
                         {/* Vertical Trunk Piece for this row */}
                         {stats.partners.length > 1 && (
                           <div className="absolute left-0 w-1.5 bg-slate-200 z-0" 
                                style={{ 
                                  top: idx === 0 ? '50%' : '0', 
                                  bottom: idx === stats.partners.length - 1 ? '50%' : '0',
                                  borderTopLeftRadius: idx === 0 ? '9999px' : '0',
                                  borderTopRightRadius: idx === 0 ? '9999px' : '0',
                                  borderBottomLeftRadius: idx === stats.partners.length - 1 ? '9999px' : '0',
                                  borderBottomRightRadius: idx === stats.partners.length - 1 ? '9999px' : '0',
                                }}>
                           </div>
                         )}

                         {/* Line: Trunk/Gateway -> Partner */}
                         <div className="flex-1 relative flex items-center justify-center z-0 px-2">
                           <div className={`w-full h-1.5 ${stats.partners.length > 1 ? 'rounded-r-full' : 'rounded-full'} relative flex items-center justify-center overflow-hidden ${partner.connection === 'active' ? 'bg-slate-200' : 'bg-rose-100'}`}>
                              {partner.connection === 'active' ? (
                                <>
                                  <div className="absolute left-0 h-full bg-emerald-500 w-1/2 animate-[pulse_1.5s_infinite] rounded-full"></div>
                                  <ArrowRightLeft className="w-4 h-4 text-emerald-600 bg-white rounded-full relative z-10 p-0.5 shadow-sm" />
                                </>
                              ) : (
                                <>
                                  <div className="w-full border-t-2 border-dashed border-rose-400 absolute"></div>
                                  <X className="w-4 h-4 text-white bg-rose-500 rounded-full relative z-10 p-0.5 shadow-sm" />
                                </>
                              )}
                           </div>
                           <div className="absolute top-full mt-2">
                             <span className={`text-[10px] font-bold px-3 py-1 rounded-full border whitespace-nowrap ${partner.connection === 'active' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-rose-600 bg-rose-50 border-rose-100'}`}>
                               {partner.connection === 'active' ? 'Kết nối ổn định' : 'Mất kết nối'}
                             </span>
                           </div>
                         </div>

                         {/* PARTNER NODE */}
                         <div className="relative flex flex-col items-center w-32 shrink-0 z-10 ml-2">
                           <div className={`w-16 h-16 bg-white rounded-full flex items-center justify-center border-4 ${partner.connection === 'active' ? 'border-purple-500' : 'border-slate-300'} shadow-sm relative z-10`}>
                             <Share2 className={`w-8 h-8 ${partner.connection === 'active' ? 'text-purple-600' : 'text-slate-400'}`} />
                           </div>
                           <div className="absolute top-full mt-3 flex flex-col items-center w-48 text-center">
                             <span className="text-xs font-bold text-slate-700">{partner.name}</span>
                             <span className="text-[10px] text-slate-400 mt-0.5">Đơn vị khai thác API</span>
                           </div>
                         </div>
                         
                       </div>
                     ))}

                  </div>

                </div>
              </div>
              </div>
                );
              })() : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-[13px] font-semibold text-slate-600">
                    Danh sách API đang giám sát ({listApis.length})
                  </div>
                  <div className="divide-y divide-slate-100">
                    {listApis.map(api => {
                      const st = apiMockStats[api.id];
                      const err = !!st && (st.sourceConnection === 'error' || (st.partners || []).some(p => p.connection === 'error'));
                      return (
                        <div key={api.id} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-slate-50/70 transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className={`w-2 h-2 rounded-full inline-block shrink-0 ${err ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                            <div className="min-w-0">
                              <p className="text-[13px] font-medium text-slate-800 truncate">{api.name}</p>
                              <p className="text-[11px] text-slate-400 truncate">{api.database}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => setDetailApi(api.id)}
                              className="px-3 py-1.5 text-[13px] text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 font-medium flex items-center gap-1.5"
                            >
                              <Info className="w-4 h-4" /> Xem chi tiết
                            </button>
                            <button
                              onClick={() => setFlowApi(api.id)}
                              className="px-3 py-1.5 text-[13px] text-blue-600 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 font-medium flex items-center gap-1"
                            >
                              Xem sơ đồ <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          ) : activeTab === 'bao_cao' ? (
            <div className="space-y-6">

              {/* UC2.1 — Chọn loại báo cáo */}
              <div className="flex flex-wrap gap-2">
                {reportTypes.map(rt => (
                  <button
                    key={rt.key}
                    onClick={() => { setReportType(rt.key); setTablePage(1); }}
                    className={`px-4 py-2 rounded-lg text-[13px] font-medium border transition-colors ${
                      reportType === rt.key
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {rt.label}
                  </button>
                ))}
              </div>

              {/* UC2.2 — Biểu đồ trực quan (đổi theo loại báo cáo) */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2 text-blue-600" />
                    {currentReportType.label} theo ngày (Tháng 06/2026)
                  </h3>
                  <div className="flex items-center gap-3">
                    {currentReportType.key === 'phanhoi' && (
                      <div className="flex items-center gap-2">
                        <label className="text-[13px] text-slate-500">Ngưỡng cảnh báo:</label>
                        <input
                          type="number"
                          min={0}
                          value={responseThreshold}
                          onChange={(e) => setResponseThreshold(Number(e.target.value))}
                          className="w-20 px-2 py-1 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                        <span className="text-[13px] text-slate-500">ms</span>
                      </div>
                    )}
                    <span className="text-[13px] text-slate-500">Đơn vị: {currentReportType.unit}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="w-full" style={{ height: 320 }}>
                    <ResponsiveContainer width="100%" height={320}>
                      {currentReportType.chart === 'area' ? (
                        <AreaChart data={reportData} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                          <defs>
                            <linearGradient id="repArea" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="day" interval={0} tickFormatter={(v: any) => String(v).slice(0, 2)} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#e2e8f0' }} />
                          <YAxis tick={{ fill: '#64748b', fontSize: 13 }} axisLine={{ stroke: '#e2e8f0' }} />
                          <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px' }} />
                          <Area type="monotone" dataKey="luuLuong" name="Lưu lượng (MB)" stroke="#2563eb" strokeWidth={2} fill="url(#repArea)" />
                        </AreaChart>
                      ) : currentReportType.chart === 'bar' ? (
                        <BarChart data={reportData} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="day" interval={0} tickFormatter={(v: any) => String(v).slice(0, 2)} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#e2e8f0' }} />
                          <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 13 }} axisLine={{ stroke: '#e2e8f0' }} />
                          <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px' }} />
                          <Bar dataKey="loiKetNoi" name="Lỗi kết nối" fill="#dc2626" radius={[4, 4, 0, 0]} maxBarSize={18} />
                        </BarChart>
                      ) : (
                        <LineChart data={reportData} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="day" interval={0} tickFormatter={(v: any) => String(v).slice(0, 2)} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#e2e8f0' }} />
                          <YAxis tick={{ fill: '#64748b', fontSize: 13 }} axisLine={{ stroke: '#e2e8f0' }} />
                          <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px' }} />
                          {currentReportType.key === 'phanhoi' ? (
                            <ReferenceLine y={responseThreshold} stroke="#dc2626" strokeDasharray="4 3" label={{ value: `Ngưỡng ${responseThreshold}ms`, position: 'insideTopRight', fill: '#dc2626', fontSize: 11 }} />
                          ) : null}
                          <Line
                            type="monotone"
                            dataKey={currentReportType.dataKey}
                            name={`${currentReportType.label} (${currentReportType.unit})`}
                            stroke="#2563eb"
                            strokeWidth={2}
                            dot={currentReportType.key === 'phanhoi'
                              ? ((props: any) => {
                                  const over = props.payload[currentReportType.dataKey] > responseThreshold;
                                  return <circle key={props.index} cx={props.cx} cy={props.cy} r={over ? 4 : 0} fill="#dc2626" stroke="#fff" strokeWidth={1} />;
                                }) as any
                              : false}
                            activeDot={{ r: 4 }}
                          />
                        </LineChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Bảng chi tiết theo ngày + Biểu đồ cung cấp dữ liệu theo phương thức chia sẻ */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center">
                      <Database className="w-4 h-4 mr-2 text-blue-600" />
                      Dữ liệu chi tiết theo ngày — {currentReportType.label}
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-[13px] font-semibold text-slate-500 border-b border-slate-200 uppercase tracking-tight">
                        <tr>
                          <th className="px-6 py-3 font-semibold">Ngày</th>
                          <th className="px-6 py-3 font-semibold text-right">{currentReportType.label} ({currentReportType.unit})</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {paginatedReport.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-6 py-3 font-medium text-slate-700">{row.day}</td>
                            <td className="px-6 py-3 text-right font-mono text-slate-700">{(row as any)[currentReportType.dataKey].toLocaleString()}</td>
                          </tr>
                        ))}
                        {/* Summary row */}
                        <tr className="bg-slate-50/50 font-bold text-slate-800">
                          <td className="px-6 py-3">{currentReportType.key === 'phanhoi' ? 'Trung bình' : 'Tổng cộng'}</td>
                          <td className="px-6 py-3 text-right font-mono">
                            {currentReportType.key === 'phanhoi'
                              ? Math.round(reportData.reduce((acc, r) => acc + r.thoiGianPhanHoi, 0) / reportData.length).toLocaleString()
                              : reportData.reduce((acc, r) => acc + (r as any)[currentReportType.dataKey], 0).toLocaleString()}
                            {currentReportType.key === 'phanhoi' ? ' ms' : ''}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {renderTablePagination(reportData.length)}
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 flex flex-col h-full">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center mb-4">
                    <BarChart3 className="w-4 h-4 mr-2 text-blue-600" />
                    Tỷ lệ lưu lượng yêu cầu theo CSDL/API
                  </h3>
                  <div className="flex-1 flex flex-col justify-center min-h-0">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
                      <Pie
                        data={requestShareData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                        cornerRadius={4}
                        labelLine={false}
                        label={(props: any) => {
                          const RADIAN = Math.PI / 180;
                          const { cx, cy, midAngle, outerRadius: r, percent, index } = props;
                          const radius = r + 22;
                          const x = cx + radius * Math.cos(-midAngle * RADIAN);
                          const y = cy + radius * Math.sin(-midAngle * RADIAN);
                          const color = requestShareData[index].color;
                          return (
                            <text
                              x={x}
                              y={y}
                              fill={color}
                              textAnchor={x > cx ? 'start' : 'end'}
                              dominantBaseline="central"
                              fontSize={13}
                              fontWeight={700}
                            >
                              {`${Math.round(percent * 100)}%`}
                            </text>
                          );
                        }}
                      >
                        {requestShareData.map(entry => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                        <Label
                          position="center"
                          content={({ viewBox }: any) => {
                            const { cx, cy } = viewBox;
                            return (
                              <g>
                                <text x={cx} y={cy - 12} textAnchor="middle" dominantBaseline="central" fill="#64748b" fontSize={12}>
                                  Tổng số
                                </text>
                                <text x={cx} y={cy + 12} textAnchor="middle" dominantBaseline="central" fill="#0f172a" fontSize={22} fontWeight={700}>
                                  {requestShareTotal.toLocaleString('vi-VN')}
                                </text>
                              </g>
                            );
                          }}
                        />
                      </Pie>
                      <Tooltip formatter={(value: number) => value.toLocaleString('vi-VN')} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 mt-2 text-[13px]">
                    {requestShareData.map(item => (
                      <span key={item.name} className="flex items-center gap-1.5 text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                        {item.name}
                      </span>
                    ))}
                  </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <AuditLogsTab />
          )}
        </div>
      </div>

      {/* API Log Details Modal */}
      {selectedLog && createPortal(
        <div style={{ zIndex: 999999 }} className="monitoring-page-root fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
          <style dangerouslySetInnerHTML={{__html: `
            .monitoring-page-root *:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(svg):not(path):not(circle):not(rect):not(polyline):not(line) {
              font-size: 13px !important;
            }
          `}} />
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
              <div className={`p-4 rounded-lg border text-[13px] font-medium leading-relaxed ${
                selectedLog.type === 'ERROR' ? 'bg-rose-50 border-rose-200 text-rose-800' : selectedLog.type === 'WARN' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}>
                {selectedLog.message}
              </div>

              {/* Metadatas */}
              <div className="border border-slate-100 rounded-lg divide-y divide-slate-100">
                <div className="grid grid-cols-3 py-2.5 px-3">
                  <span className="text-[13px] font-medium text-slate-400">Thời gian log:</span>
                  <span className="text-[13px] text-slate-700 font-mono col-span-2">{selectedLog.time}</span>
                </div>
                <div className="grid grid-cols-3 py-2.5 px-3">
                  <span className="text-[13px] font-medium text-slate-400">Mức độ cảnh báo:</span>
                  <span className="text-[13px] col-span-2 font-semibold uppercase">{selectedLog.type}</span>
                </div>
                <div className="grid grid-cols-3 py-2.5 px-3">
                  <span className="text-[13px] font-medium text-slate-400">IP Đối tác khai thác:</span>
                  <span className="text-[13px] text-slate-700 font-mono col-span-2">{selectedLog.clientIp}</span>
                </div>
                <div className="grid grid-cols-3 py-2.5 px-3">
                  <span className="text-[13px] font-medium text-slate-400">Độ trễ phản hồi:</span>
                  <span className="text-[13px] text-blue-600 font-semibold font-mono col-span-2">{selectedLog.latency}</span>
                </div>
                <div className="grid grid-cols-3 py-2.5 px-3">
                  <span className="text-[13px] font-medium text-slate-400">Kích thước phản hồi:</span>
                  <span className="text-[13px] text-slate-700 font-mono col-span-2">{selectedLog.responseSize}</span>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-100 flex justify-end bg-slate-50">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 font-medium text-[13px] transition-colors shadow-sm animate-in fade-in"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      , document.body)}

      {/* API Detail modal — dùng lại popup "Xem chi tiết Dịch vụ" của màn Thiết lập điều phối */}
      {detailApi && (() => {
        const info = apiList.find(a => a.id === detailApi);
        if (!info) return null;
        const svc = {
          name: info.name,
          code: info.code,
          type: 'REST',
          protocol: 'HTTPS',
          method: 'GET',
          dataType: info.database,
          contextPath: '',
          description: '',
        };
        return (
          <ProvisionServiceModal
            isOpen={true}
            mode="view"
            service={svc}
            onClose={() => setDetailApi(null)}
          />
        );
      })()}

      {/* Reports exporting modal */}
      <ProvisionExportReportModal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)} 
      />

    </div>
  </div>
  );
}
