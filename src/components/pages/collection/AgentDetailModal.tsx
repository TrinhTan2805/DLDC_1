import React, { useState } from 'react';
import { DateInput, Badge, RowIconAction, tabClass, BTN_PRIMARY, BTN_OUTLINE, BTN_GHOST_ICON, INPUT_CLS, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE, FILTER_GRID_CLS, FILTER_LABEL } from './collectionUi';
import { X, Search, MinusCircle } from 'lucide-react';

interface AgentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

// Tiêu đề khối có vạch xanh (compomennt.md mục 1 – H2)
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className={SECTION_TITLE}>
    <span className="w-1 h-4 bg-blue-600 rounded-full shrink-0" />
    {children}
  </h3>
);

// Cặp Nhãn – Giá trị (mục 5.17)
const Field = ({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) => (
  <div className={`space-y-1 min-w-0 ${wide ? 'col-span-2' : ''}`}>
    <div className={FIELD_LABEL}>{label}</div>
    <div className={`${FIELD_VALUE} break-words`}>{children}</div>
  </div>
);

const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px] text-left';
const TD = 'px-3 py-1 text-[13px] text-black text-left';
const TR = 'h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors';

const DB_STATUS_VARIANT: Record<string, string> = { DATA_UPDATED: 'blue', DATA_INCOMPLETED: 'amber' };

export function AgentDetailModal({ isOpen, onClose, data }: AgentDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'agent' | 'history'>('agent');
  const [historyFrom, setHistoryFrom] = useState('');
  const [historyTo, setHistoryTo] = useState('');

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="agent-detail-title" className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4 shrink-0">
          <h2 id="agent-detail-title" className="text-[16px] font-semibold text-[#020817]">
            Thông tin Trạm kết nối
          </h2>
          <button type="button" onClick={onClose} className={BTN_GHOST_ICON} aria-label="Đóng" title="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Navigation (5.9) */}
        <div className="px-6 border-b border-[#E2E8F0] shrink-0">
          <div className="flex">
            <button type="button" onClick={() => setActiveTab('agent')} className={tabClass(activeTab === 'agent')}>
              Trạm kết nối
            </button>
            <button type="button" onClick={() => setActiveTab('history')} className={tabClass(activeTab === 'history')}>
              Lịch sử thiết bị
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4">
          {activeTab === 'agent' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* DIP - DB Agent */}
                <div className="rounded-2xl border border-[#E2E8F0] p-4">
                  <SectionTitle>DIP - DB Trạm kết nối</SectionTitle>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <Field label="ID">{data.dbAgentId || data.id || '-'}</Field>
                    <Field label="Tên trạm">{data.name || '-'}</Field>
                    <Field label="Khóa trạm" wide><span className="break-all">{data.agentKey || '-'}</span></Field>
                    <Field label="Chu kỳ gọi">{data.callCycle != null && data.callCycle !== '' ? `${data.callCycle} giây` : '-'}</Field>
                    <Field label="Cập nhật CSDL">{data.lastDbUpdate || '-'}</Field>
                    <Field label="Trạng thái trạm">
                      <Badge
                        label={data.status === 'active' ? 'Kích hoạt' : 'Không kích hoạt'}
                        variant={data.status === 'active' ? 'green' : 'red'}
                      />
                    </Field>
                  </div>
                </div>

                {/* DIP - File Agent */}
                <div className="rounded-2xl border border-[#E2E8F0] p-4">
                  <SectionTitle>DIP - File Trạm kết nối</SectionTitle>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <Field label="ID" wide>{data.fileAgent?.id || '-'}</Field>
                    <Field label="URL" wide>
                      {data.fileAgent?.url ? <span className="text-[#155DFC] break-all">{data.fileAgent.url}</span> : '-'}
                    </Field>
                    <Field label="Hoạt động">
                      <Badge
                        label={data.fileAgent?.isActive ? 'có hoạt động' : 'không hoạt động'}
                        variant={data.fileAgent?.isActive ? 'green' : 'red'}
                      />
                    </Field>
                    <Field label="Trạng thái">
                      <Badge
                        label={data.fileAgent?.status === 'active' ? 'Kích hoạt' : 'Không kích hoạt'}
                        variant={data.fileAgent?.status === 'active' ? 'green' : 'slate'}
                      />
                    </Field>
                  </div>
                </div>
              </div>

              {/* Database List */}
              <div>
                <SectionTitle>Danh sách cơ sở dữ liệu</SectionTitle>
                <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse collection-table text-[13px]">
                      <thead className="bg-[#F8FAFC]">
                        <tr className="h-[42px]">
                          <th className={`${TH} w-16`}>ID</th>
                          <th className={TH}>Tên CSDL</th>
                          <th className={TH}>Tên CSDL gốc</th>
                          <th className={TH}>Kiểu CSDL</th>
                          <th className={TH}>Trạng thái CSDL</th>
                          <th className={`${TH} !text-center w-14`}>#</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.databases?.map((db: any) => (
                          <tr key={db.id} className={TR}>
                            <td className={`${TD} whitespace-nowrap`}>{db.id}</td>
                            <td className={`${TD} break-all`}>{db.name}</td>
                            <td className={`${TD} break-all`}>{db.originalName}</td>
                            <td className={`${TD} whitespace-nowrap`}>{db.type}</td>
                            <td className={TD}>
                              <Badge label={db.status} variant={DB_STATUS_VARIANT[db.status] || 'slate'} />
                            </td>
                            <td className={`${TD} !text-center`}>
                              <RowIconAction label="Xóa" onClick={() => {}}>
                                <MinusCircle className="w-4 h-4 text-[#DC2626]" />
                              </RowIconAction>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* History Filters */}
              <div className={`${FILTER_GRID_CLS} !mt-0`}>
                <div>
                  <label className={FILTER_LABEL}>Địa chỉ IP</label>
                  <input type="text" aria-label="Địa chỉ IP" className={INPUT_CLS} />
                </div>
                <div>
                  <label className={FILTER_LABEL}>Tên máy chủ</label>
                  <input type="text" aria-label="Tên máy chủ" className={INPUT_CLS} />
                </div>
                <div>
                  <label className={FILTER_LABEL}>Hành động</label>
                  <input type="text" aria-label="Hành động" className={INPUT_CLS} />
                </div>
                <div>
                  <label className={FILTER_LABEL}>Loại</label>
                  <input type="text" aria-label="Loại" className={INPUT_CLS} />
                </div>
                <div className="min-w-[280px]">
                  <label className={FILTER_LABEL}>Ngày</label>
                  <div className="flex items-center gap-2">
                    <DateInput ariaLabel="Từ ngày" value={historyFrom} onChange={setHistoryFrom} className="flex-1 min-w-0" />
                    <DateInput ariaLabel="Đến ngày" value={historyTo} onChange={setHistoryTo} className="flex-1 min-w-0" />
                  </div>
                </div>
                <div className="flex items-end justify-end">
                  <button type="button" className={BTN_PRIMARY}>
                    <Search className="w-4 h-4" /> Tìm kiếm
                  </button>
                </div>
              </div>

              {/* History Table */}
              <div>
                <SectionTitle>Danh sách lịch sử thiết bị</SectionTitle>
                <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse collection-table text-[13px]">
                      <thead className="bg-[#F8FAFC]">
                        <tr className="h-[42px]">
                          <th className={TH}>Hành động</th>
                          <th className={TH}>Loại</th>
                          <th className={TH}>Trạm kết nối</th>
                          <th className={TH}>Địa chỉ IP</th>
                          <th className={TH}>Tên máy chủ</th>
                          <th className={TH}>Ngày</th>
                          <th className={`${TH} !text-center w-14`}>#</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...Array(10)].map((_, i) => (
                          <tr key={i} className={TR}>
                            <td className={`${TD} whitespace-nowrap`}>NEW</td>
                            <td className={`${TD} whitespace-nowrap`}>DATA_REQUEST</td>
                            <td className={`${TD} whitespace-nowrap`}>{data.id}</td>
                            <td className={`${TD} whitespace-nowrap`}>GS-HienLT52/10.86.142.136</td>
                            <td className={`${TD} whitespace-nowrap`}>GS-HienLT52</td>
                            <td className={`${TD} whitespace-nowrap`}>20/11/2025</td>
                            <td className={`${TD} !text-center`}>
                              <RowIconAction label="Xóa" onClick={() => {}}>
                                <MinusCircle className="w-4 h-4 text-[#DC2626]" />
                              </RowIconAction>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3 shrink-0">
          <button type="button" onClick={onClose} className={BTN_OUTLINE}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
