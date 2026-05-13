import { useState } from 'react';
import { Search, Download, Eye } from 'lucide-react';
import { StatusTag } from '../../common/StatusTag';

type TabType = 'access' | 'activity' | 'info';

interface ActivityLog {
  id: number;
  username: string;
  fullName: string;
  action: 'Đăng nhập' | 'Đăng xuất';
  timestamp: string;
  ip: string;
  browser: string;
  status: 'success' | 'failed';
}

export function UserActivityHistoryPage() {
  const [activeTab, setActiveTab] = useState<TabType>('access');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUser, setFilterUser] = useState('all');
  const [filterAction, setFilterAction] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Mock data
  const activityLogs: ActivityLog[] = [
    {
      id: 1,
      username: 'admin',
      fullName: 'Nguyễn Văn A',
      action: 'Đăng nhập',
      timestamp: '2023-12-19 08:30:15',
      ip: '192.168.1.100',
      browser: 'Chrome 120.0',
      status: 'success'
    },
    {
      id: 2,
      username: 'user1',
      fullName: 'Trần Thị B',
      action: 'Đăng nhập',
      timestamp: '2023-12-19 09:15:42',
      ip: '192.168.1.101',
      browser: 'Safari 17.2',
      status: 'failed'
    },
    {
      id: 3,
      username: 'user2',
      fullName: 'Lê Văn C',
      action: 'Đăng xuất',
      timestamp: '2023-12-19 10:20:33',
      ip: '192.168.1.102',
      browser: 'Firefox 121.0',
      status: 'success'
    },
    {
      id: 4,
      username: 'admin',
      fullName: 'Nguyễn Văn A',
      action: 'Đăng xuất',
      timestamp: '2023-12-19 17:30:45',
      ip: '192.168.1.100',
      browser: 'Chrome 120.0',
      status: 'success'
    }
  ];

  const tabs = [
    { id: 'access' as TabType, label: 'Lịch sử truy cập', icon: '🔐' },
    { id: 'activity' as TabType, label: 'Lịch sử hoạt động', icon: '⚡' },
    { id: 'info' as TabType, label: 'Thông tin khác', icon: 'ℹ️' }
  ];

  const handleViewDetail = (log: ActivityLog) => {
    alert(`Chi tiết hoạt động:\n\nNgười dùng: ${log.fullName} (${log.username})\nHành động: ${log.action}\nThời gian: ${log.timestamp}\nIP: ${log.ip}\nTrình duyệt: ${log.browser}\nTrạng thái: ${log.status === 'success' ? 'Thành công' : 'Thất bại'}`);
  };

  const handleExport = () => {
    alert('Đang xuất dữ liệu...');
  };

  return (
    <div className="flex-1 overflow-auto bg-slate-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-slate-900 mb-2">Lịch sử hoạt động</h1>
          <p className="text-sm text-slate-600">Theo dõi và quản lý lịch sử hoạt động của người dùng trong hệ thống</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          {/* Tabs */}
          <div className="border-b border-slate-200">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'access' && (
              <div className="space-y-4">
                {/* Filters */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="lg:col-span-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm người dùng, hành động..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Filter User */}
                  <div>
                    <select
                      value={filterUser}
                      onChange={(e) => setFilterUser(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Tất cả người dùng</option>
                      <option value="admin">admin</option>
                      <option value="user1">user1</option>
                      <option value="user2">user2</option>
                    </select>
                  </div>

                  {/* Filter Action */}
                  <div>
                    <select
                      value={filterAction}
                      onChange={(e) => setFilterAction(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Tất cả hành động</option>
                      <option value="login">Đăng nhập</option>
                      <option value="logout">Đăng xuất</option>
                    </select>
                  </div>

                  {/* Export Button */}
                  <div>
                    <button
                      onClick={handleExport}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Kết xuất
                    </button>
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Từ ngày</label>
                    <input
                      type="datetime-local"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Đến ngày</label>
                    <input
                      type="datetime-local"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Results Count */}
                <div className="text-sm text-slate-600">
                  Tổng số: <span className="font-medium text-slate-900">4 bản ghi</span>
                </div>

                {/* Table */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                            STT
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                            Người dùng
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                            Hành động
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                            Thời gian
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                            IP
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                            Trình duyệt
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                            Trạng thái
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-slate-700 uppercase tracking-wider">
                            Thao tác
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {activityLogs.map((log, index) => (
                          <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 text-sm text-slate-900">
                              {index + 1}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-blue-600">{log.username}</span>
                                <span className="text-xs text-slate-500">{log.fullName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-900">
                              {log.action}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-900">
                              {log.timestamp}
                            </td>
                            <td className="px-4 py-3 text-sm font-mono text-slate-900">
                              {log.ip}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-900">
                              {log.browser}
                            </td>
                            <td className="px-4 py-3">
                              <StatusTag 
                                label={log.status === 'success' ? 'Thành công' : 'Thất bại'} 
                                variant={log.status === 'success' ? 'green' : 'red'} 
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleViewDetail(log)}
                                className="inline-flex items-center justify-center w-8 h-8 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Xem chi tiết"
                              >
                                <Eye className="w-4 h-4" />
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

            {activeTab === 'activity' && (
              <div className="text-center py-12 text-slate-500">
                <p>Nội dung lịch sử hoạt động sẽ được hiển thị tại đây</p>
              </div>
            )}

            {activeTab === 'info' && (
              <div className="space-y-6">
                <h3 className="text-base font-medium text-slate-900">Thông tin hoạt động bổ sung</h3>
                
                {/* User Activity Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Last Login */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg">🔐</span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">Thời gian đăng nhập cuối</p>
                        <p className="text-sm font-medium text-slate-900">2023-12-19 11:05:20</p>
                      </div>
                    </div>
                  </div>

                  {/* Usage Frequency */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg">📊</span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">Tần suất sử dụng</p>
                        <p className="text-sm font-medium text-slate-900">38 lần/tuần</p>
                      </div>
                    </div>
                  </div>

                  {/* Last Logout */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg">🚪</span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">Thời gian đăng xuất</p>
                        <p className="text-sm font-medium text-slate-900">2023-12-19 17:30:45</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Stats Table */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                    <h4 className="text-sm font-medium text-slate-900">Chi tiết thống kê người dùng</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                            Người dùng
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                            Đăng nhập cuối
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                            Tần suất sử dụng
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                            Thời gian đăng xuất
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                            Tổng thời gian online
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-blue-600">admin</span>
                              <span className="text-xs text-slate-500">Nguyễn Văn A</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-900">
                            2023-12-19 11:05:20
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-slate-200 rounded-full h-2 max-w-[100px]">
                                <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                              </div>
                              <span className="text-sm text-slate-900">38 lần/tuần</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-900">
                            2023-12-19 17:30:45
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-900">
                            6h 25m
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-blue-600">user1</span>
                              <span className="text-xs text-slate-500">Trần Thị B</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-900">
                            2023-12-19 09:15:42
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-slate-200 rounded-full h-2 max-w-[100px]">
                                <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                              </div>
                              <span className="text-sm text-slate-900">25 lần/tuần</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-900">
                            2023-12-19 16:45:10
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-900">
                            7h 30m
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-blue-600">user2</span>
                              <span className="text-xs text-slate-500">Lê Văn C</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-900">
                            2023-12-19 10:20:33
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-slate-200 rounded-full h-2 max-w-[100px]">
                                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                              </div>
                              <span className="text-sm text-slate-900">15 lần/tuần</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-900">
                            2023-12-19 15:20:00
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-900">
                            5h 00m
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <strong>Lưu ý:</strong> Thông tin này được cập nhật theo thời gian thực. Tần suất sử dụng được tính dựa trên số lần đăng nhập và thao tác trong 7 ngày gần nhất.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}