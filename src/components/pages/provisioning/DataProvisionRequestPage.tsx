import React, { useMemo, useState } from 'react';
import { FileText, Search, Share, Plus, Filter, Download, XCircle, UploadCloud, CheckCircle } from 'lucide-react';
import { ProvisionDataRequestModal, CreateDataRequestPayload } from './modals/ProvisionDataRequestModal';
import { ProvisionRequestApprovalModal } from './modals/ProvisionRequestApprovalModal';

type ActiveTab = 'tiep_nhan' | 'tra_cuu' | 'tao_dich_vu' | 'cong_bo';
type RequestStatus = 'CHO_XU_LY' | 'DA_PHE_DUYET' | 'TU_CHOI' | 'DA_XUAT';

type DataRequest = {
  id: string;
  org: string;
  dataType: string;
  purpose: string;
  requestDate: string;
  fromDate?: string;
  toDate?: string;
  format: 'excel' | 'csv' | 'json' | 'xml';
  status: RequestStatus;
};

const statusLabel: Record<RequestStatus, string> = {
  CHO_XU_LY: 'Chờ xử lý',
  DA_PHE_DUYET: 'Đã phê duyệt',
  TU_CHOI: 'Từ chối',
  DA_XUAT: 'Đã kết xuất',
};

export function DataProvisionRequestPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('tiep_nhan');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DataRequest | null>(null);

  const [query, setQuery] = useState('');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'ALL' | RequestStatus>('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [filterToDate, setFilterToDate] = useState('');

  const [requests, setRequests] = useState<DataRequest[]>([
    {
      id: 'YC-2026-0429',
      org: 'Sở Nội vụ Lạng Sơn',
      dataType: 'Dữ liệu Hộ tịch điện tử',
      purpose: 'Thống kê tình hình biến động hộ tịch',
      requestDate: '2026-04-29',
      format: 'excel',
      status: 'CHO_XU_LY',
    },
    {
      id: 'YC-2026-0315',
      org: 'Công an Lạng Sơn',
      dataType: 'Dữ liệu Thi hành án',
      purpose: 'Đồng bộ danh sách đối tượng theo dõi',
      requestDate: '2026-03-15',
      format: 'csv',
      status: 'DA_XUAT',
    },
    {
      id: 'YC-2026-0518',
      org: 'Sở Tư pháp Lạng Sơn',
      dataType: 'Dữ liệu Lý lịch tư pháp',
      purpose: 'Tra cứu thông tin án tích',
      requestDate: '2026-05-18',
      format: 'json',
      status: 'DA_PHE_DUYET',
    },
  ]);

  const filteredRequests = useMemo(() => {
    return requests.filter((item) => {
      const q = query.trim().toLowerCase();
      const keywordOk =
        !q ||
        item.id.toLowerCase().includes(q) ||
        item.org.toLowerCase().includes(q) ||
        item.dataType.toLowerCase().includes(q);
      const statusOk = filterStatus === 'ALL' || item.status === filterStatus;
      const typeOk = filterType === 'ALL' || item.dataType === filterType;
      const fromOk = !filterFromDate || item.requestDate >= filterFromDate;
      const toOk = !filterToDate || item.requestDate <= filterToDate;
      return keywordOk && statusOk && typeOk && fromOk && toOk;
    });
  }, [requests, query, filterStatus, filterType, filterFromDate, filterToDate]);

  const dataTypeOptions = useMemo(() => ['ALL', ...Array.from(new Set(requests.map((item) => item.dataType)))], [requests]);

  const handleApprove = (id: string) => {
    setRequests((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'DA_PHE_DUYET' } : item)));
  };

  const handleReject = (id: string) => {
    setRequests((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'TU_CHOI' } : item)));
  };

  const handleCreateRequest = (payload: CreateDataRequestPayload) => {
    const newItem: DataRequest = {
      id: `YC-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      org: payload.org,
      dataType: payload.dataType,
      purpose: payload.purpose || 'Bổ sung theo yêu cầu',
      requestDate: new Date().toISOString().slice(0, 10),
      fromDate: payload.fromDate,
      toDate: payload.toDate,
      format: payload.format,
      status: 'CHO_XU_LY',
    };
    setRequests((prev) => [newItem, ...prev]);
    setActiveTab('tiep_nhan');
  };

  const handleExport = (id: string) => {
    setRequests((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'DA_XUAT' } : item)));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Cung cấp dữ liệu theo yêu cầu</h2>
          <p className="text-slate-500 mt-1">Tiếp nhận, tra cứu, kết xuất, công bố và hủy công bố dữ liệu theo yêu cầu</p>
        </div>
        <button onClick={() => setShowRequestModal(true)} className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Tạo yêu cầu
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            <button onClick={() => setActiveTab('tiep_nhan')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'tiep_nhan' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500'}`}>
              <FileText className="w-4 h-4 mr-2" />Tiếp nhận yêu cầu
            </button>
            <button onClick={() => setActiveTab('tra_cuu')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'tra_cuu' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500'}`}>
              <Search className="w-4 h-4 mr-2" />Tra cứu & Kết xuất
            </button>
            <button onClick={() => setActiveTab('cong_bo')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'cong_bo' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500'}`}>
              <Share className="w-4 h-4 mr-2" />Công bố dịch vụ
            </button>
          </nav>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} type="text" placeholder="Tìm theo mã YC, cơ quan, loại dữ liệu..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg" />
            </div>
            <button onClick={() => setShowAdvancedFilter((prev) => !prev)} className="flex items-center px-4 py-2 border border-slate-200 text-slate-600 rounded-lg">
              <Filter className="w-4 h-4 mr-2" />Bộ lọc nâng cao
            </button>
          </div>

          {showAdvancedFilter && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as 'ALL' | RequestStatus)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm">
                <option value="ALL">Tất cả trạng thái</option>
                <option value="CHO_XU_LY">Chờ xử lý</option>
                <option value="DA_PHE_DUYET">Đã phê duyệt</option>
                <option value="TU_CHOI">Từ chối</option>
                <option value="DA_XUAT">Đã kết xuất</option>
              </select>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm">
                {dataTypeOptions.map((type) => <option key={type} value={type}>{type === 'ALL' ? 'Tất cả loại dữ liệu' : type}</option>)}
              </select>
              <input type="date" value={filterFromDate} onChange={(e) => setFilterFromDate(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm" />
              <input type="date" value={filterToDate} onChange={(e) => setFilterToDate(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm" />
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                  <th className="py-3 px-4 font-medium">Mã YC</th><th className="py-3 px-4 font-medium">Đơn vị đề nghị</th><th className="py-3 px-4 font-medium">Nguồn CSDL yêu cầu</th><th className="py-3 px-4 font-medium">Mục đích khai thác</th><th className="py-3 px-4 font-medium">Ngày gửi</th><th className="py-3 px-4 font-medium">Trạng thái</th><th className="py-3 px-4 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredRequests.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-medium text-slate-800">{item.id}</td>
                    <td className="py-3 px-4 text-slate-600">{item.org}</td>
                    <td className="py-3 px-4 text-slate-600">{item.dataType}</td>
                    <td className="py-3 px-4 text-slate-600">{item.purpose}</td>
                    <td className="py-3 px-4 text-slate-600">{item.requestDate}</td>
                    <td className="py-3 px-4"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">{statusLabel[item.status]}</span></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1.5 flex-nowrap">
                        {activeTab === 'tiep_nhan' && item.status === 'CHO_XU_LY' && (
                          <button title="Tiếp nhận" onClick={() => { setSelectedRequest(item); setShowApprovalModal(true); }} className="p-1.5 bg-amber-500 text-white rounded-md shadow-sm hover:bg-amber-600 transition-colors"><CheckCircle className="w-4 h-4" /></button>
                        )}
                        {(activeTab === 'tra_cuu' || item.status === 'DA_PHE_DUYET' || item.status === 'DA_XUAT') && (
                          <button title="Xuất" onClick={() => handleExport(item.id)} className="p-1.5 bg-emerald-600 text-white rounded-md shadow-sm hover:bg-emerald-700 transition-colors"><Download className="w-4 h-4" /></button>
                        )}
                        {activeTab === 'cong_bo' && (
                          <>
                            <button title="Công bố" className="p-1.5 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors"><UploadCloud className="w-4 h-4" /></button>
                            <button title="Hủy" className="p-1.5 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 transition-colors"><XCircle className="w-4 h-4" /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ProvisionDataRequestModal isOpen={showRequestModal} onClose={() => setShowRequestModal(false)} onCreate={handleCreateRequest} />
      <ProvisionRequestApprovalModal isOpen={showApprovalModal} onClose={() => setShowApprovalModal(false)} requestData={selectedRequest} onApprove={handleApprove} onReject={(id) => handleReject(id)} />
    </div>
  );
}
