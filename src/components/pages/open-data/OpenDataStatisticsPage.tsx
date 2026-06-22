import { useState } from 'react';
import { Search, Filter, Download, FileText, File as FileIcon, BarChart3, PieChart as PieChartIcon, TrendingUp, Calendar, Eye, Activity, LineChart as LineChartIcon, RefreshCw } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer
} from 'recharts';

export function OpenDataStatisticsPage() {
  const [activeTab, setActiveTab] = useState<'search' | 'stats' | 'classification' | 'traffic'>('search');

  // --- MOCK DATA cho Tab Tìm kiếm ---
  const [searchFilter, setSearchFilter] = useState({ query: '', category: 'all', agency: 'all', format: 'all' });
  const mockDatasets = [
    { code: 'OD001', name: 'Danh mục văn bản pháp luật', category: 'Văn bản pháp luật', agency: 'Bộ Tư pháp', format: 'JSON, XML, CSV', status: 'Đã công bố', date: '01/01/2024' },
    { code: 'OD002', name: 'Thông tin đăng ký kinh doanh', category: 'Đăng ký kinh doanh', agency: 'Sở Kế hoạch', format: 'JSON, CSV', status: 'Đã công bố', date: '15/01/2024' },
    { code: 'OD003', name: 'Danh sách hành nghề công chứng', category: 'Công chứng', agency: 'Bộ Tư pháp', format: 'JSON, XML', status: 'Đang cập nhật', date: '01/02/2024' },
    { code: 'OD004', name: 'Thống kê hỗ trợ TGPL', category: 'TGPL', agency: 'Cục TGPL', format: 'JSON, CSV, Excel', status: 'Đã công bố', date: '10/03/2024' },
    { code: 'OD005', name: 'Danh mục hộ tịch (bản cũ)', category: 'Hộ tịch', agency: 'Cục Hộ tịch', format: 'CSV', status: 'Ngưng cập nhật', date: '01/01/2023' },
  ];

  // --- MOCK DATA cho Recharts ---
  // 1. Thống kê bộ dữ liệu theo lĩnh vực/Cơ quan (Bar Chart)
  const barData = [
    { name: 'Văn bản PL', datasets: 45 },
    { name: 'Đăng ký KD', datasets: 32 },
    { name: 'Công chứng', datasets: 28 },
    { name: 'Hộ tịch', datasets: 56 },
    { name: 'Thi hành án', datasets: 15 },
  ];

  // 2. Thống kê phân loại dữ liệu (Pie Chart / Donut)
  const pieData = [
    { name: 'Dữ liệu chuyên ngành', value: 450 },
    { name: 'Dữ liệu hành chính', value: 300 },
    { name: 'Dữ liệu không gian', value: 150 },
    { name: 'Dữ liệu IoT', value: 100 },
  ];
  const COLORS = ['#2563eb', '#3b82f6', '#8b5cf6', '#f59e0b'];

  // 3. Traffic Data (Line Chart) theo 6 tháng
  const trafficData = [
    { month: 'Tháng 7', views: 4500, downloads: 1200 },
    { month: 'Tháng 8', views: 5200, downloads: 1400 },
    { month: 'Tháng 9', views: 6100, downloads: 1650 },
    { month: 'Tháng 10', views: 5800, downloads: 1500 },
    { month: 'Tháng 11', views: 6500, downloads: 1900 },
    { month: 'Tháng 12', views: 7200, downloads: 2100 },
  ];

  // --- CHIA TAB COMPONENT RENDER ---

  const renderSearchTab = () => (
    <div className="space-y-6">
      {/* Bộ lọc tìm kiếm nâng cao */}
      <div className="bg-white p-4 rounded-lg border border-slate-200">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="relative col-span-2">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500" 
              placeholder="Từ khóa, mô tả tiêu đề dataset..."
              value={searchFilter.query}
              onChange={e => setSearchFilter({...searchFilter, query: e.target.value})}
            />
          </div>
          <select className="border border-slate-300 rounded-lg px-3 py-2 text-[13px] text-slate-700">
            <option>Tất cả cơ quan</option>
            <option>Bộ Tư pháp</option>
            <option>Sở Kế hoạch Đầu tư</option>
          </select>
          <select className="border border-slate-300 rounded-lg px-3 py-2 text-[13px] text-slate-700">
            <option>Tất cả chủ đề</option>
            <option>Văn bản pháp luật</option>
            <option>Hộ tịch</option>
            <option>Đăng ký kinh doanh</option>
          </select>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <select className="border border-slate-300 rounded-lg px-3 py-2 text-[13px] text-slate-700">
            <option>Tất cả định dạng</option>
            <option>JSON/API</option>
            <option>CSV/Excel</option>
          </select>
          <select className="border border-slate-300 rounded-lg px-3 py-2 text-[13px] text-slate-700">
            <option>Tất cả giấy phép</option>
            <option>CC-BY 4.0</option>
            <option>Giấy phép mở Việt Nam</option>
          </select>
          
          <div className="col-span-2 flex justify-end gap-3">
            <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Search className="w-4 h-4" /> Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mb-2">
        <button 
          onClick={() => alert("Đang tải xuống báo cáo dạng Excel...")}
          className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded flex items-center gap-2 hover:bg-blue-50 text-[13px] font-medium"
        >
          <FileText className="w-4 h-4" /> Xuất Excel
        </button>
        <button 
          onClick={() => alert("Đang tải xuống báo cáo dạng PDF...")}
          className="px-4 py-2 bg-red-600 text-white rounded flex items-center gap-2 hover:bg-red-700 text-[13px] font-medium"
        >
          <FileIcon className="w-4 h-4" /> Xuất PDF
        </button>
      </div>

      {/* Bảng kết quả */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full stats-table text-[13px] text-left">
          <thead className="text-xs text-slate-600 bg-slate-50 uppercase border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Mã Dataset</th>
              <th className="px-4 py-3">Tên & Mô tả</th>
              <th className="px-4 py-3">Chủ đề</th>
              <th className="px-4 py-3">Cơ quan</th>
              <th className="px-4 py-3">Định dạng</th>
              <th className="px-4 py-3">Lần cập nhật</th>
              <th className="px-4 py-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {mockDatasets.map((ds, idx) => (
              <tr key={idx} className="border-b last:border-0 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{ds.code}</td>
                <td className="px-4 py-3 text-slate-700">{ds.name}</td>
                <td className="px-4 py-3 text-slate-600">{ds.category}</td>
                <td className="px-4 py-3 text-slate-600">{ds.agency}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {ds.format.split(', ').map(f => (
                      <span key={f} className="px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded border border-blue-200">{f}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{ds.date}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-[13px] rounded-full ${
                    ds.status === 'Đã công bố' ? 'bg-blue-100 text-blue-700' :
                    ds.status === 'Đang cập nhật' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {ds.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderStatsTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg border border-slate-200 flex gap-4 items-center">
        <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Tiêu chí phân nhóm:</label>
        <select className="border border-slate-300 rounded px-3 py-1.5 text-[13px]">
          <option>Theo Chủ đề</option>
          <option>Theo Cơ quan công bố</option>
          <option>Theo Giấy phép</option>
        </select>
        <select className="border border-slate-300 rounded px-3 py-1.5 text-[13px]">
          <option>Thời gian: 1 Năm qua</option>
          <option>Toàn thời gian</option>
        </select>
        <button className="px-4 py-1.5 bg-blue-600 text-white rounded text-[13px] font-medium ml-auto">Tạo Báo Cáo</button>
        <button onClick={() => alert("Xuất Excel")} className="px-3 py-1.5 bg-slate-100 border border-slate-300 rounded text-[13px] flex gap-1 items-center hover:bg-slate-200 transition-colors"><FileText className="w-4 h-4"/> Excel</button>
        <button onClick={() => alert("Xuất PDF")} className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded text-[13px] flex gap-1 items-center hover:bg-red-100 transition-colors"><FileIcon className="w-4 h-4"/> PDF</button>
      </div>

      <div className="bg-white p-6 rounded-lg border border-slate-200">
        <h3 className="text-base font-semibold text-slate-800 mb-6 flex gap-2 items-center">
          <BarChart3 className="w-5 h-5 text-blue-600" /> Biểu đồ Thống kê Số lượng Bộ dữ liệu theo Chủ đề
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
              <RechartsTooltip cursor={{fill: '#F1F5F9'}} contentStyle={{borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="datasets" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={40} name="Số lượng Bộ dữ liệu" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderClassificationTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg border border-slate-200 flex gap-4 items-center">
        <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Tiêu chí phân loại:</label>
        <select className="border border-slate-300 rounded px-3 py-1.5 text-[13px]">
          <option>Theo Nguồn cung cấp</option>
          <option>Theo Định dạng dữ liệu</option>
        </select>
        <button className="px-4 py-1.5 bg-blue-600 text-white rounded text-[13px] font-medium ml-auto">Xử lý Dữ liệu</button>
        <button onClick={() => alert("Xuất Excel")} className="px-3 py-1.5 bg-slate-100 border border-slate-300 rounded text-[13px] flex gap-1 items-center hover:bg-slate-200 transition-colors"><FileText className="w-4 h-4"/> Excel</button>
        <button onClick={() => alert("Xuất PDF")} className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded text-[13px] flex gap-1 items-center hover:bg-red-100 transition-colors"><FileIcon className="w-4 h-4"/> PDF</button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h3 className="text-base font-semibold text-slate-800 mb-6 flex gap-2 items-center">
            <PieChartIcon className="w-5 h-5 text-purple-600" /> Tỷ trọng phân bổ Nhóm dữ liệu
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{borderRadius: '8px'}} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 font-semibold text-slate-800">
            Bảng Số liệu chi tiết
          </div>
          <table className="w-full stats-table text-[13px] text-left">
            <thead className="text-xs text-slate-500 uppercase border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3">Nguồn cung cấp / Nhóm</th>
                <th className="px-4 py-3 text-right">Tổng số DL</th>
                <th className="px-4 py-3 text-right">Tỷ lệ (%)</th>
              </tr>
            </thead>
            <tbody>
              {pieData.map((item, index) => (
                <tr key={index} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length]}}></div>
                    <span className="font-medium text-slate-700">{item.name}</span>
                  </td>
                  <td className="px-4 py-3 text-right">{item.value}</td>
                  <td className="px-4 py-3 text-right font-medium text-blue-600">
                    {((item.value / 1000) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-100 font-bold border-t border-slate-200">
                <td className="px-4 py-3">Tổng cộng</td>
                <td className="px-4 py-3 text-right">1000</td>
                <td className="px-4 py-3 text-right">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTrafficTab = () => (
    <div className="space-y-6">
      {/* Box filter giống ảnh mẫu */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-[15px] font-semibold text-slate-800 mb-4 flex gap-2 items-center">
          <TrendingUp className="w-5 h-5 text-blue-600" /> Thiết lập báo cáo truy cập
        </h3>
        <div className="flex items-end gap-6">
          <div className="flex-1">
            <label className="text-sm font-medium text-slate-700 block mb-1">Khoảng thời gian</label>
            <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>6 tháng gần nhất</option>
              <option>Năm nay</option>
              <option>Tháng này</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-slate-700 block mb-1">Chỉ số</label>
            <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>Lượt xem và tải</option>
              <option>Người dùng HĐ</option>
            </select>
          </div>
          <button className="px-8 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 flex items-center gap-2 h-[38px] transition-colors">
            <TrendingUp className="w-4 h-4" /> Tạo báo cáo
          </button>
          <button onClick={() => alert("Xuất File PDF!")} className="w-10 h-[38px] bg-red-600 text-white rounded-md flex items-center justify-center hover:bg-red-700 transition-colors">
            <FileIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { title: 'Tổng lượt xem', value: '35,320', trend: '+18%', icon: Eye, tColor: 'text-blue-600' },
          { title: 'Tổng lượt tải', value: '8,860', trend: '+22%', icon: Download, tColor: 'text-blue-600' },
          { title: 'Người dùng hoạt động', value: '2,450', trend: '+15%', icon: Activity, tColor: 'text-amber-500' },
          { title: 'Tỷ lệ chuyển đổi', value: '25.1%', trend: '+3.2%', icon: TrendingUp, tColor: 'text-purple-600' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="text-sm text-slate-500 mb-2 font-medium">{card.title}</div>
              <div className="text-3xl font-bold text-slate-800 mb-2">{card.value}</div>
            </div>
            <div className="text-xs font-semibold text-blue-600 mt-2">
              {card.trend} so với kỳ trước
            </div>
            <card.icon className={`w-5 h-5 absolute top-5 right-5 ${card.tColor} opacity-70`} />
          </div>
        ))}
      </div>

      {/* Line Chart Area */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 overflow-hidden">
        <h3 className="text-[15px] font-semibold text-slate-800 mb-6">Xu hướng truy cập theo thời gian</h3>
        <div className="w-full h-80 -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trafficData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="month" axisLine={true} tickLine={false} tick={{fill: '#64748B', fontSize: 13, dy: 10}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 13}} />
              <RechartsTooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: '10px' }} iconType="circle" />
              <Line 
                type="monotone" 
                dataKey="views" 
                name="Lượt xem" 
                stroke="#0ea5e9" 
                strokeWidth={3} 
                dot={{ r: 4, strokeWidth: 2, fill: 'white', stroke: '#0ea5e9' }} 
                activeDot={{ r: 6, strokeWidth: 0 }} 
              />
              <Line 
                type="monotone" 
                dataKey="downloads" 
                name="Lượt tải" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                dot={{ r: 4, strokeWidth: 2, fill: 'white', stroke: '#3b82f6' }} 
                activeDot={{ r: 6, strokeWidth: 0 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Horizontal Toolbar */}
      <div className="bg-white border border-slate-200 flex items-center justify-start rounded-none sm:rounded-lg shadow-sm border-x-0 sm:border-x px-2 pt-2">
        <button 
          onClick={() => setActiveTab('search')}
          className={`px-4 py-3 text-[13px] font-medium transition-colors flex items-center gap-2 border-b-2 ${activeTab === 'search' ? 'border-blue-600 text-blue-700 bg-blue-50 rounded-t' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <Search className="w-4 h-4" /> Tìm kiếm và lọc
        </button>
        <button 
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-3 text-[13px] font-medium transition-colors flex items-center gap-2 border-b-2 ${activeTab === 'stats' ? 'border-blue-600 text-blue-700 bg-blue-50 rounded-t' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <BarChart3 className="w-4 h-4" /> Báo cáo thống kê
        </button>
        <button 
          onClick={() => setActiveTab('classification')}
          className={`px-4 py-3 text-[13px] font-medium transition-colors flex items-center gap-2 border-b-2 ${activeTab === 'classification' ? 'border-blue-600 text-blue-700 bg-blue-50 rounded-t' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <PieChartIcon className="w-4 h-4" /> Báo cáo phân loại
        </button>
        <button 
          onClick={() => setActiveTab('traffic')}
          className={`px-4 py-3 text-[13px] font-medium transition-colors flex items-center gap-2 border-b-2 ${activeTab === 'traffic' ? 'border-blue-600 text-blue-700 bg-blue-50 rounded-t' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <LineChartIcon className="w-4 h-4" /> Thống kê lượt truy cập
        </button>
      </div>

      <div className="min-h-[600px] mt-4">
        {activeTab === 'search' && renderSearchTab()}
        {activeTab === 'stats' && renderStatsTab()}
        {activeTab === 'classification' && renderClassificationTab()}
        {activeTab === 'traffic' && renderTrafficTab()}
      </div>
    </div>
  );
}
