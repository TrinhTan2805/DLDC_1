import * as React from 'react';
import { useState } from 'react';
import { Database, Plus, RefreshCw, Edit2, Trash2, Search } from 'lucide-react';
import { AddServiceConfigModal, ReconciliationApiConfigFormData } from './AddServiceConfigModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import {
  Badge, TruncatedText, RowIconAction, Pagination, BTN_PRIMARY, SEARCH_INPUT_CLS, SEARCH_BTN_CLS, normalizeSearch, isoToDisplayDate, toLocalIsoDate
} from '../collection/collectionUi';

// Bảng theo compomennt.md 5.3; căn lề 5.3.3
const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';
const NUM = 'text-right tabular-nums whitespace-nowrap';
const CONFIG_STATUS_VARIANT: Record<string, string> = { active: 'green', inactive: 'slate' };

interface APIConfig {
  id: string;
  systemName: string;
  systemCode: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  authType: string;
  status: 'active' | 'inactive';
  statusText: string;
  statusColor: string;
  lastCall: string;
  totalCalls: number;
}

export function ReconciliationServiceSetupTab() {
  const [searchTerm, setSearchTerm] = useState('');
  // Từ khóa đã áp dụng — chỉ cập nhật khi bấm Tìm kiếm / Enter (mục 5.19)
  const [appliedSearch, setAppliedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<APIConfig | null>(null);

  const [configs, setConfigs] = useState<APIConfig[]>([
    {
      id: 'API-001',
      systemName: 'Hệ thống Hộ tịch điện tử',
      systemCode: 'SPIS_HOTICH',
      endpoint: 'https://hotich.gov.vn/api/reconciliation',
      method: 'POST',
      authType: 'API Key',
      status: 'active',
      statusText: 'Hoạt động',
      statusColor: 'bg-green-100 text-green-700 border-green-200',
      lastCall: '2024-12-20 09:00:00',
      totalCalls: 24
    },
    {
      id: 'API-002',
      systemName: 'Hệ thống Đăng ký kinh doanh',
      systemCode: 'SPIS_DKKD',
      endpoint: 'https://dkkd.gov.vn/api/reconciliation',
      method: 'POST',
      authType: 'OAuth 2.0',
      status: 'active',
      statusText: 'Hoạt động',
      statusColor: 'bg-green-100 text-green-700 border-green-200',
      lastCall: '2024-12-19 16:30:00',
      totalCalls: 12
    },
    {
      id: 'API-003',
      systemName: 'Hệ thống Công chứng',
      systemCode: 'SPIS_CONGCHUNG',
      endpoint: 'https://congchung.gov.vn/api/reconciliation',
      method: 'POST',
      authType: 'API Key',
      status: 'active',
      statusText: 'Hoạt động',
      statusColor: 'bg-green-100 text-green-700 border-green-200',
      lastCall: '2024-12-16 11:20:00',
      totalCalls: 8
    }
  ]);

  const mapToFormData = (config: APIConfig): ReconciliationApiConfigFormData => ({
    systemName: config.systemName,
    systemCode: config.systemCode,
    endpoint: config.endpoint,
    method: config.method,
    authType: config.authType,
  });

  const runSearch = () => {
    setAppliedSearch(searchTerm);
    setCurrentPage(1);
  };

  const kw = normalizeSearch(appliedSearch);
  const filteredConfigs = configs.filter(config =>
    kw === '' ||
    [config.systemName, config.systemCode, config.endpoint].some(v => normalizeSearch(v).includes(kw))
  );
  const pagedConfigs = filteredConfigs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalApis = configs.length;
  const activeApis = configs.filter(c => c.status === 'active').length;
  const totalCalls = configs.reduce((sum, c) => sum + c.totalCalls, 0);

  const handleSaveConfig = (data: ReconciliationApiConfigFormData) => {
    if (isEditModalOpen && selectedConfig) {
      setConfigs((prev) =>
        prev.map((item) =>
          item.id === selectedConfig.id
            ? {
                ...item,
                systemName: data.systemName,
                systemCode: data.systemCode,
                endpoint: data.endpoint,
                method: data.method,
                authType: data.authType,
              }
            : item,
        ),
      );
      return;
    }

    const nextIndex = configs.length + 1;
    const today = toLocalIsoDate(new Date());
    setConfigs((prev) => [
      ...prev,
      {
        id: `API-${String(nextIndex).padStart(3, '0')}`,
        systemName: data.systemName,
        systemCode: data.systemCode,
        endpoint: data.endpoint,
        method: data.method,
        authType: data.authType,
        status: 'active',
        statusText: 'Hoạt động',
        statusColor: 'bg-green-100 text-green-700 border-green-200',
        lastCall: `${today} 00:00:00`,
        totalCalls: 0,
      },
    ]);
  };

  const handleDeleteConfig = () => {
    if (!selectedConfig) return;
    setConfigs((prev) => prev.filter((item) => item.id !== selectedConfig.id));
  };

  // Thẻ thống kê (mục 5.6.1)
  const statCards = [
    { label: 'Tổng cấu hình API', value: totalApis, icon: Database, tone: 'bg-blue-50 text-blue-600' },
    { label: 'Đang hoạt động', value: activeApis, icon: Database, tone: 'bg-green-50 text-green-600' },
    { label: 'Tổng số lần gọi', value: totalCalls, icon: RefreshCw, tone: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="space-y-4 pt-2">
      {/* Thẻ thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${card.tone}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[16px] text-[#64748B]">{card.label}</div>
                <div className="text-[16px] font-semibold text-[#0F172A] tabular-nums">{card.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Thanh tìm kiếm & thao tác (mục 5.19) */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-1.5">
          <input
            aria-label="Tìm kiếm cấu hình API"
            type="text"
            placeholder="Tìm kiếm hệ thống, endpoint..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
            className={SEARCH_INPUT_CLS}
          />
          <button type="button" aria-label="Tìm kiếm" title="Tìm kiếm" onClick={runSearch} className={SEARCH_BTN_CLS}>
            <Search className="w-5 h-5" />
          </button>
        </div>
        <button type="button" className={BTN_PRIMARY} onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Thêm cấu hình API
        </button>
      </div>

      {/* Bảng cấu hình API (mục 5.3) */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse collection-table text-[13px]">
            <thead className="bg-[#F8FAFC] sticky top-0 z-[1]">
              <tr className="h-[42px]">
                <th className={`${TH} text-left`}>Hệ thống đầu</th>
                <th className={`${TH} text-left`}>API Endpoint</th>
                <th className={`${TH} text-left`}>Phương thức</th>
                <th className={`${TH} text-left`}>Xác thực</th>
                <th className={`${TH} text-left`}>Trạng thái</th>
                <th className={`${TH} text-left`}>Lần gọi gần nhất</th>
                <th className={`${TH} text-right`}>Tổng lần gọi</th>
                <th className={`${TH} text-center w-24`}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pagedConfigs.map((config) => {
                const [d, t] = config.lastCall.split(' ');
                return (
                <tr key={config.id} className="h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors">
                  <td className={`${TD} text-left max-w-[360px] leading-[18px]`}>
                    <TruncatedText text={config.systemName} />
                    <TruncatedText text={config.systemCode} className="text-[#64748B]" />
                  </td>
                  <td className={`${TD} text-left max-w-[320px]`}>
                    <TruncatedText text={config.endpoint} />
                  </td>
                  <td className={`${TD} text-left whitespace-nowrap`}>
                    <Badge label={config.method} variant="blue" />
                  </td>
                  <td className={`${TD} text-left whitespace-nowrap`}>{config.authType}</td>
                  <td className={`${TD} text-left whitespace-nowrap`}>
                    <Badge label={config.statusText} variant={CONFIG_STATUS_VARIANT[config.status] || 'slate'} />
                  </td>
                  <td className={`${TD} text-left whitespace-nowrap leading-[18px]`}>
                    <div>{isoToDisplayDate(d) || d}</div>
                    {t && <div className="text-[#64748B]">{t}</div>}
                  </td>
                  <td className={`${TD} ${NUM}`}>{config.totalCalls.toLocaleString()}</td>
                  <td className={`${TD} text-center`}>
                    <div className="flex items-center justify-center gap-1">
                      <RowIconAction
                        label="Chỉnh sửa"
                        onClick={() => {
                          setSelectedConfig(config);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </RowIconAction>
                      <RowIconAction
                        label="Xóa"
                        onClick={() => {
                          setSelectedConfig(config);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </RowIconAction>
                    </div>
                  </td>
                </tr>
                );
              })}
              {filteredConfigs.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-16 text-center text-[13px] text-[#64748B]">
                    Không tìm thấy cấu hình API
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang (mục 5.14) */}
        <Pagination
          className="border-t border-[#E2E8F0]"
          currentPage={currentPage}
          totalItems={filteredConfigs.length}
          pageSize={itemsPerPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
        />
      </div>

      {/* Add/Edit Service Config Modal */}
      <AddServiceConfigModal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedConfig(null);
        }}
        isEdit={isEditModalOpen}
        initialData={selectedConfig ? mapToFormData(selectedConfig) : null}
        onSave={handleSaveConfig}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedConfig(null);
        }}
        onConfirm={() => {
          handleDeleteConfig();
        }}
        itemName={selectedConfig?.systemName}
      />
    </div>
  );
}
