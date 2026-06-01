import * as React from 'react';
import { useState } from 'react';
import { Database, CheckCircle, AlertCircle, Clock, Search, Filter, Download, Eye, Send, Info, RefreshCw, Loader2, Settings, History, FileText, List, Calendar, X } from 'lucide-react';
import { ReconciliationServiceSetupTab } from './ReconciliationServiceSetupTab';
import { ReconciliationLogTab } from './ReconciliationLogTab';
import { ReconciliationHistoryTab } from './ReconciliationHistoryTab';
import { ReconciliationDetailModal } from './ReconciliationDetailModal';
import { StatusTag } from '../../common/StatusTag';


interface ReconciliationRecord {
  id: string;
  datasetCode: string;
  datasetName: string;
  providerSystem: string;
  dataType: string;
  recordCount: number;
  receiveDate: string;
  status: 'matched' | 'mismatched' | 'pending' | 'error';
  statusText: string;
  statusColor: string;
  errorCount?: number;
  matchRate?: number;
  lastReconcileDate?: string;
  isReportSent?: boolean;
}

type TabType = 'list' | 'setup' | 'log' | 'history';

interface ReconciliationTemplateProps {
  title: string;
  records: ReconciliationRecord[];
  hideSetupTab?: boolean;
  hideLogTab?: boolean;
  hideManualSync?: boolean;
  hideExportExcel?: boolean;
}

export function ReconciliationTemplate({ 
  title, 
  records, 
  hideSetupTab = false, 
  hideLogTab = false,
  hideManualSync = false,
  hideExportExcel = false
}: ReconciliationTemplateProps) {
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRecordCode, setSelectedRecordCode] = useState('');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ReconciliationRecord | null>(null);
  const [syncStatuses, setSyncStatuses] = useState<Record<string, 'idle' | 'sending' | 'sent' | 'received'>>({});
  const [filterSource, setFilterSource] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [historySearchTerm, setHistorySearchTerm] = useState('');

  // Pagination and collapsible filters states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  const handleViewHistory = () => {
    if (selectedRecordCode) {
      setHistorySearchTerm(selectedRecordCode);
      setActiveTab('history');
      setDetailModalOpen(false);
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    const matchesSource = filterSource === 'all' || record.providerSystem.toLowerCase().includes(filterSource.toLowerCase());
    
    // date comparison logic
    let matchesDate = true;
    if (dateFrom || dateTo) {
      const receiveDate = new Date(record.receiveDate.split(' ')[0]);
      if (dateFrom && receiveDate < new Date(dateFrom)) matchesDate = false;
      if (dateTo && receiveDate > new Date(dateTo)) matchesDate = false;
    }

    const matchesSearch = searchTerm === '' || 
      record.datasetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.datasetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.providerSystem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.dataType.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSource && matchesDate && matchesSearch;
  });

  const handleManualSync = () => {
    const initialStatuses: Record<string, 'sending'> = {};
    filteredRecords.forEach(r => { initialStatuses[r.id] = 'sending'; });
    setSyncStatuses(initialStatuses);

    filteredRecords.forEach((record, idx) => {
      setTimeout(() => {
        setSyncStatuses(prev => ({ ...prev, [record.id]: 'sent' }));
      }, 1000 + idx * 500);

      setTimeout(() => {
        setSyncStatuses(prev => ({ ...prev, [record.id]: 'received' }));
      }, 3000 + idx * 700);
    });
  };



  const matchedCount = records.filter(r => r.status === 'matched').length;
  const mismatchedCount = records.filter(r => r.status === 'mismatched').length;

  const tabs = [
    { id: 'list' as TabType, label: 'Danh sách đối soát' },
    ...(!hideSetupTab ? [{ id: 'setup' as TabType, label: 'Thiết lập dịch vụ' }] : []),
    { id: 'history' as TabType, label: 'Lịch sử đối soát' },
    ...(!hideLogTab ? [{ id: 'log' as TabType, label: 'Nhật ký đối soát' }] : []),
  ];

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }} className="space-y-4">
      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 -mx-6 -mt-6">
        <div className="flex gap-6">
          {tabs.map((tab) => {
            let IconComponent = Database;
            if (tab.id === 'setup') IconComponent = Settings;
            else if (tab.id === 'history') IconComponent = History;
            else if (tab.id === 'log') IconComponent = FileText;
            else if (tab.id === 'list') IconComponent = List;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1); // Reset page on tab change
                }}
                className={`flex items-center gap-2 pb-3 pt-4 text-[13px] font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'list' && (
        <div className="space-y-4 pt-4">
          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-[13px] text-slate-500">Tổng bộ dữ liệu</div>
                  <div className="text-base font-semibold text-slate-950">{records.length}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-[13px] text-slate-500">Khớp dữ liệu</div>
                  <div className="text-base font-semibold text-slate-950">{matchedCount}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-[13px] text-slate-500">Không khớp</div>
                  <div className="text-base font-semibold text-slate-950">{mismatchedCount}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="mb-6">
            {/* Row 1: Search and Buttons */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 flex items-center gap-3">
                <div className="relative flex-1">
                  <input aria-label="Input field"
                    type="text"
                    placeholder="Tìm kiếm theo mã hồ sơ đối soát, hệ thống cung cấp, loại đối soát..."
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center">
                  <Search className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-lg transition-colors shadow-sm flex items-center justify-center border ${
                    showFilters 
                      ? 'bg-blue-50 border-blue-200 text-blue-600' 
                      : 'bg-white border-[#e2e8f0] text-slate-600 hover:bg-slate-50'
                  }`}
                  title="Bộ lọc"
                >
                  {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex items-center gap-3">
                {!hideManualSync && (
                  <button
                    onClick={handleManualSync}
                    disabled={Object.values(syncStatuses).some(s => s === 'sending' || s === 'sent')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2 text-[13px] shadow-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`w-4 h-4 ${Object.values(syncStatuses).some(s => s === 'sending' || s === 'sent') ? 'animate-spin' : ''}`} />
                    Đồng bộ thủ công
                  </button>
                )}
                {!hideExportExcel && (
                  <button
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-2 text-[13px] shadow-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Xuất Excel
                  </button>
                )}
              </div>
            </div>

            {/* Row 2: Filters (Collapsible) */}
            {showFilters && (
              <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 grid grid-cols-4 gap-4 mt-4 animate-in slide-in-from-top-2 duration-200 shadow-sm relative">
                <div className="absolute -top-2 right-[200px] w-4 h-4 bg-slate-50 border-t border-l border-slate-200 transform rotate-45"></div>

                <div className="space-y-1.5 relative z-10">
                  <label className="text-[13px] font-medium text-slate-700">Hệ thống nguồn</label>
                  <select aria-label="Select box"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                    value={filterSource}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setFilterSource(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="all">Tất cả hệ thống</option>
                    <option value="Trung tâm dữ liệu Quốc gia">Trung tâm dữ liệu Quốc gia</option>
                    <option value="Hệ thống Hộ tịch">Hệ thống Hộ tịch</option>
                    <option value="Hệ thống Dân cư">Hệ thống Dân cư</option>
                  </select>
                </div>

                <div className="space-y-1.5 relative z-10">
                  <label className="text-[13px] font-medium text-slate-700">Trạng thái</label>
                  <select aria-label="Select box"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                    value={filterStatus}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setFilterStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="matched">Khớp dữ liệu</option>
                    <option value="mismatched">Không khớp</option>
                    <option value="pending">Đang xử lý</option>
                  </select>
                </div>

                <div className="space-y-1.5 relative z-10">
                  <label className="text-[13px] font-medium text-slate-700">Từ ngày</label>
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                    <input aria-label="Input field"
                      type="date"
                      className="w-full border-0 bg-transparent text-[13px] focus:outline-none text-slate-700 p-0"
                      value={dateFrom}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setDateFrom(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                </div>

                <div className="space-y-1.5 relative z-10">
                  <label className="text-[13px] font-medium text-slate-700">Đến ngày</label>
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                    <input aria-label="Input field"
                      type="date"
                      className="w-full border-0 bg-transparent text-[13px] focus:outline-none text-slate-700 p-0"
                      value={dateTo}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setDateTo(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Services Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse collection-table text-[13px]">
                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-[1]">
                  <tr>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap w-12 text-[13px]">STT</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Mã hồ sơ đối soát</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap text-[13px]">Hồ sơ dữ liệu cung cấp</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Loại đối soát</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Số bản ghi đối soát</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Ngày nhận</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Trạng thái</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Báo cáo sai lệch</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap text-[13px]">Tiến trình đồng bộ</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 whitespace-nowrap w-24 text-[13px]">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRecords
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((record, index) => (
                      <tr key={record.id} className="hover:bg-slate-50 transition-all group border-b border-slate-100">
                        <td className="px-4 py-3 text-center text-slate-500 font-medium text-[13px]">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-4 py-3 text-left text-[13px]">
                          <div className="font-medium text-slate-950 leading-snug text-[13px]">{record.datasetCode}</div>
                          <div className="text-slate-500 mt-1 text-[12px]">{record.providerSystem}</div>
                        </td>
                        <td className="px-4 py-3 text-left text-[13px]">
                          <div className="font-medium text-slate-950 leading-snug text-[13px]">{record.datasetName}</div>
                          <div className="text-slate-500 mt-1 text-[12px]">{record.providerSystem}</div>
                        </td>
                        <td className="px-4 py-3 text-center text-slate-600 font-medium text-[13px]">{record.dataType}</td>
                        <td className="px-4 py-3 text-center text-slate-950 font-semibold font-mono text-[13px]">
                          {record.recordCount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center text-slate-500 font-medium font-mono whitespace-nowrap text-[13px]">
                          {record.receiveDate.split(' ').map((part: string, i: number) => (
                            <div key={i}>{part}</div>
                          ))}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <StatusTag
                            label={record.statusText}
                            variant={
                              record.status === 'matched' ? 'green' :
                              record.status === 'mismatched' ? 'orange' :
                              record.status === 'pending' ? 'blue' : 'red'
                            }
                          />
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          {record.status === 'matched' ? (
                            <span className="text-[13px] text-slate-400 italic">Không có sai lệch</span>
                          ) : record.isReportSent ? (
                            <StatusTag
                              label="Đã gửi báo cáo"
                              variant="indigo"
                              icon={<Send className="w-3 h-3" />}
                            />
                          ) : (
                            <StatusTag
                              label="Chưa gửi báo cáo"
                              variant="amber"
                              icon={<Info className="w-3 h-3" />}
                            />
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {(() => {
                            const status = syncStatuses[record.id];
                            if (!status || status === 'idle') return <span className="text-xs text-slate-400">Chưa bắt đầu</span>;
                            return (
                              <div className="w-40 mx-auto">
                                <div className="flex items-center gap-2 mb-1.5 justify-center">
                                  {status === 'sending' && (
                                    <span className="text-xs font-medium text-blue-600 flex items-center gap-1.5">
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang gửi yêu cầu
                                    </span>
                                  )}
                                  {status === 'sent' && (
                                    <span className="text-xs font-medium text-amber-600 flex items-center gap-1.5">
                                      <Clock className="w-3.5 h-3.5 animate-pulse" /> Chờ phản hồi
                                    </span>
                                  )}
                                  {status === 'received' && (
                                    <span className="text-xs font-medium text-green-600 flex items-center gap-1.5">
                                      <CheckCircle className="w-3.5 h-3.5" /> Hoàn tất
                                    </span>
                                  )}
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                  <div 
                                    className={`h-full transition-all duration-1000 ease-in-out rounded-full ${
                                      status === 'received' ? 'bg-green-500 w-full' : 
                                      status === 'sent' ? 'bg-amber-500 w-2/3' : 
                                      status === 'sending' ? 'bg-blue-500 w-1/3' : 'bg-transparent w-0'
                                    }`}
                                  ></div>
                                </div>
                              </div>
                            );
                          })()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => {
                                setSelectedRecordCode(record.datasetCode);
                                setDetailModalOpen(true);
                                setSelectedRecord(record);
                              }}
                              className="p-1.5 text-slate-500 hover:text-[#2563eb] hover:bg-blue-50 rounded-[6px] transition-all"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-4 py-8 text-center text-slate-500">
                        Không tìm thấy dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white sm:px-6 collection-pagination text-[13px]">
              <div className="flex items-center gap-2">
                <span className="text-slate-600">Hiển thị</span>
                <select aria-label="Select record count" 
                  className="px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-[13px]"
                  title="Số bản ghi trên trang"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-slate-600">bản ghi/trang</span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-slate-600">
                  {filteredRecords.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredRecords.length)} / {filteredRecords.length}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
                  >
                    Trước
                  </button>
                  
                  {Array.from({ length: Math.ceil(filteredRecords.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 border rounded-lg font-medium text-[13px] transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-[#e2e8f0] text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
                      if (currentPage < totalPages) {
                        setCurrentPage(currentPage + 1);
                      }
                    }}
                    disabled={currentPage === Math.ceil(filteredRecords.length / itemsPerPage) || Math.ceil(filteredRecords.length / itemsPerPage) === 0}
                    className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium"
                  >
                    Sau
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'setup' && <ReconciliationServiceSetupTab />}
      {activeTab === 'log' && <ReconciliationLogTab />}
      {activeTab === 'history' && <ReconciliationHistoryTab initialSearchTerm={historySearchTerm} />}
      
      {/* Reconciliation Detail Modal */}
      <ReconciliationDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        recordCode={selectedRecordCode}
        record={selectedRecord}
        onViewHistory={handleViewHistory}
      />

    </div>
  );
}