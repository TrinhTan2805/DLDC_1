import { StatsCards } from './StatsCards';
import { RecentActivities } from './RecentActivities';
import { QuickAccess } from './QuickAccess';
import { DataStatistics } from './DataStatistics';
import { Sidebar } from './Sidebar';
import { DataCollectionPage } from './pages/DataCollectionPage';
import { DataProcessingPage } from './pages/DataProcessingPage';
import { DataSearchPage } from './pages/DataSearchPage';
import { DataSharingPage } from './pages/DataSharingPage';
import { DataReconciliationPage } from './pages/DataReconciliationPage';
import { DataCleaningManagementPage } from './pages/DataCleaningManagementPage';
import { SystemAdminPage } from './pages/SystemAdminPage';
import { Bell, User, Search, Menu } from 'lucide-react';
import { useState } from 'react';
import imgLogo from "figma:asset/0b9fbf72a74cf9ec02b7371d312e91e368f930d8.png";

export function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <div>
              <h2 className="text-gray-900">Tổng quan Kho Dữ liệu</h2>
              <p className="text-gray-500 mt-1">Giám sát và quản lý toàn bộ dữ liệu tư pháp</p>
            </div>
            <StatsCards />
            <QuickAccess />
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-white">
                <h2 className="text-gray-800">Thống kê tình hình xử lý dữ liệu</h2>
                <p className="text-gray-500 text-sm mt-1">Biểu đồ theo dõi tình hình thu thập, xử lý và cung cấp dữ liệu</p>
              </div>
              <div className="p-6">
                <DataStatistics />
              </div>
            </div>
            <RecentActivities />
          </>
        );
      case 'data-collection':
        return <DataCollectionPage />;
      case 'data-processing':
        return <DataProcessingPage />;
      case 'data-search':
        return <DataSearchPage />;
      case 'data-sharing':
        return <DataSharingPage />;
      case 'data-reconciliation':
        return <DataReconciliationPage />;
      case 'data-cleaning-management':
        return <DataCleaningManagementPage />;
      case 'system-admin':
        return <SystemAdminPage />;
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">Chức năng đang được phát triển</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-700 to-red-600 text-white sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-red-800 rounded-lg lg:hidden"
              >
                <Menu className="w-6 h-6 text-white" />
              </button>
              <div className="flex items-center gap-3">
                <img src={imgLogo} alt="Logo" className="w-10 h-10" />
                <div>
                  <h1 className="text-white">
                    Kho DLDC
                  </h1>
                  <p className="text-red-100 text-sm">Hệ thống quản lý Bộ Tư Pháp Kho Dữ liệu Chung</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="w-5 h-5 text-red-200 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm văn bản, hồ sơ..."
                  className="pl-10 pr-4 py-2 bg-red-800 bg-opacity-50 border border-red-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 text-white placeholder-red-200 w-80"
                />
              </div>
              <button title="Hành động" aria-label="Hành động" className="p-2 hover:bg-red-800 rounded-lg relative">
                <Bell className="w-6 h-6 text-white" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-300 rounded-full"></span>
              </button>
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-red-800 bg-opacity-50 rounded-lg">
                <User className="w-5 h-5 text-white" />
                <span className="text-white text-sm">Quản trị viên</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout with Sidebar */}
      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
          <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6 overflow-x-hidden">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}