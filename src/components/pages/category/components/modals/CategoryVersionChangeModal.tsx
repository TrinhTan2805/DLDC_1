import { useState, ChangeEvent } from 'react';
import { GitCompare, CheckCircle2, XCircle, Plus, Minus, RefreshCw, ChevronRight } from 'lucide-react';
import { MasterDataEntity, ApprovalRequest } from '../../categoryTypes';
import { BaseModal } from '../../../../common/BaseModal';
import { ReviewResultCard } from './ReviewResultCard';

// ── Kiểu dữ liệu nội bộ cho changes ──────────────────────────────────────────

interface GeneralChange {
  field: string;
  label: string;
  oldValue: string;
  newValue: string;
}

interface PropDiff {
  label: string;
  oldValue: string;
  newValue: string;
}

interface StructureChange {
  changeType: 'added' | 'modified' | 'removed';
  fieldName: string;
  displayName: string;
  dataType?: string;
  changedProps?: PropDiff[];
}

interface RelationshipChange {
  changeType: 'added' | 'modified' | 'removed';
  sourceEntityName: string;
  targetEntityName: string;
  relationshipType: string;
  changedProps?: PropDiff[];
}

export interface VersionChanges {
  prevVersion: number;
  currentVersion: number;
  generalChanges: GeneralChange[];
  structureChanges: StructureChange[];
  relationshipChanges: RelationshipChange[];
}

interface CategoryVersionChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: MasterDataEntity | null;
  request: ApprovalRequest | null;
  onApprove: (note: string) => void;
  onReject: (note: string) => void;
}

type DiffTab = 'general' | 'structure' | 'relationship';

const changeTypeMeta = {
  added: { label: 'Thêm mới', icon: Plus, bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', text: 'text-emerald-700' },
  modified: { label: 'Chỉnh sửa', icon: RefreshCw, bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700 border-amber-200', text: 'text-amber-700' },
  removed: { label: 'Xóa bỏ', icon: Minus, bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-600 border-red-200', text: 'text-red-600' },
};

export function CategoryVersionChangeModal({
  isOpen,
  onClose,
  entity,
  request,
  onApprove,
  onReject,
}: CategoryVersionChangeModalProps) {
  const [note, setNote] = useState('');
  const [activeTab, setActiveTab] = useState<DiffTab>('general');

  if (!isOpen || !entity || !request) return null;

  const changes = request.changes as VersionChanges | undefined;
  const prevVersion = changes?.prevVersion ?? 1;
  const currentVersion = changes?.currentVersion ?? 2;
  const generalChanges = changes?.generalChanges ?? [];
  const structureChanges = changes?.structureChanges ?? [];
  const relationshipChanges = changes?.relationshipChanges ?? [];

  const tabs: { key: DiffTab; label: string; count: number }[] = [
    { key: 'general', label: 'Thông tin chung', count: generalChanges.length },
    { key: 'structure', label: 'Cấu trúc', count: structureChanges.length },
    { key: 'relationship', label: 'Quan hệ', count: relationshipChanges.length },
  ];

  const totalChanges = generalChanges.length + structureChanges.length + relationshipChanges.length;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Xem chi tiết thay đổi"
      subtitle="So sánh phiên bản cũ và phiên bản mới đề xuất"
      maxWidth="max-w-4xl"
      customHeaderIcon={
        <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center mr-3 shrink-0">
          <GitCompare className="w-5 h-5 text-violet-600" />
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all text-[13px]"
          >
            Đóng
          </button>
          {(request?.status === 'pending' || !request?.status) && (
            <div className="flex gap-2">
              <button
                onClick={() => onReject(note)}
                className="px-5 py-2.5 bg-red-500 text-white rounded-xl flex items-center gap-2 hover:bg-red-600 transition-all text-[13px] shadow-sm shadow-red-100"
              >
                <XCircle className="w-4 h-4" />
                Từ chối
              </button>
              <button
                onClick={() => onApprove(note)}
                className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl flex items-center gap-2 hover:bg-emerald-600 transition-all text-[13px] shadow-sm shadow-emerald-100"
              >
                <CheckCircle2 className="w-4 h-4" />
                Phê duyệt
              </button>
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-5">

        {/* Tiêu đề danh mục + version badge */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[13px] text-slate-500 mb-0.5">Danh mục</div>
            <div className="text-[15px] font-bold text-slate-800">{entity.name}</div>
            <div className="text-[13px] text-slate-500 mt-0.5">{entity.code} · {request.requestedBy} · {request.requestedDate}</div>
          </div>
          <div className="shrink-0 flex items-center gap-2 px-4 py-2 bg-violet-50 border border-violet-200 rounded-xl">
            <span className="text-[13px] font-semibold text-violet-700">v{prevVersion}</span>
            <ChevronRight className="w-4 h-4 text-violet-400" />
            <span className="text-[13px] font-bold text-violet-900">v{currentVersion}</span>
          </div>
        </div>

        {/* Summary bar */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px]">
          <span className="text-slate-600 font-medium">{totalChanges} thay đổi tổng cộng:</span>
          {structureChanges.filter(c => c.changeType === 'added').length > 0 && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full font-medium">
              <Plus className="w-3 h-3" />
              {structureChanges.filter(c => c.changeType === 'added').length + relationshipChanges.filter(c => c.changeType === 'added').length} thêm mới
            </span>
          )}
          {(structureChanges.filter(c => c.changeType === 'modified').length + generalChanges.length) > 0 && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full font-medium">
              <RefreshCw className="w-3 h-3" />
              {structureChanges.filter(c => c.changeType === 'modified').length + generalChanges.length + relationshipChanges.filter(c => c.changeType === 'modified').length} chỉnh sửa
            </span>
          )}
          {(structureChanges.filter(c => c.changeType === 'removed').length + relationshipChanges.filter(c => c.changeType === 'removed').length) > 0 && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-red-50 border border-red-200 text-red-600 rounded-full font-medium">
              <Minus className="w-3 h-3" />
              {structureChanges.filter(c => c.changeType === 'removed').length + relationshipChanges.filter(c => c.changeType === 'removed').length} xóa bỏ
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-[13px] transition-all flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-white text-violet-600 shadow-sm font-medium'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold ${
                  activeTab === tab.key ? 'bg-violet-100 text-violet-700' : 'bg-slate-200 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Tab: Thông tin chung ── */}
        {activeTab === 'general' && (
          <div>
            {generalChanges.length === 0 ? (
              <EmptyChange label="Không có thay đổi thông tin chung" />
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-[13px]">
                  <thead className="bg-[#f8fafc] border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3 text-[13px] font-semibold text-slate-500 text-left w-48">Trường thông tin</th>
                      <th className="px-5 py-3 text-[13px] font-semibold text-slate-500 text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block"></span>
                          Giá trị cũ (v{prevVersion})
                        </div>
                      </th>
                      <th className="px-5 py-3 text-[13px] font-semibold text-slate-500 text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
                          Giá trị mới (v{currentVersion})
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {generalChanges.map((change, idx) => (
                      <tr key={idx} className="bg-amber-50/60 hover:bg-amber-50 transition-colors">
                        <td className="px-5 py-3 text-[13px] font-medium text-slate-700">{change.label}</td>
                        <td className="px-5 py-3 text-[13px]">
                          <span className="inline-block px-2.5 py-1 text-[13px] bg-red-50 border border-red-200 text-red-700 rounded-lg line-through decoration-red-400">
                            {change.oldValue || <span className="italic text-slate-400">Chưa có</span>}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-[13px]">
                          <span className="inline-block px-2.5 py-1 text-[13px] bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg font-medium">
                            {change.newValue || <span className="italic text-slate-400">Trống</span>}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Cấu trúc ── */}
        {activeTab === 'structure' && (
          <div className="space-y-3">
            {structureChanges.length === 0 ? (
              <EmptyChange label="Không có thay đổi cấu trúc trường dữ liệu" />
            ) : (
              structureChanges.map((change, idx) => {
                const meta = changeTypeMeta[change.changeType];
                const Icon = meta.icon;
                return (
                  <div key={idx} className={`border ${meta.border} rounded-xl overflow-hidden`}>
                    {/* Row header */}
                    <div className={`${meta.bg} px-5 py-3 flex items-center gap-3`}>
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[13px] font-semibold ${meta.badge}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {meta.label}
                      </span>
                      <span className="font-mono font-semibold text-slate-800 text-[13px]">{change.fieldName}</span>
                      <span className="text-slate-500 text-[13px]">·</span>
                      <span className="text-slate-600 text-[13px]">{change.displayName}</span>
                      {change.dataType && (
                        <span className="ml-auto px-2 py-0.5 bg-white border border-slate-200 rounded text-[13px] text-slate-600 font-medium">{change.dataType}</span>
                      )}
                    </div>
                    {/* Changed props */}
                    {change.changedProps && change.changedProps.length > 0 && (
                      <table className="w-full text-[13px] bg-white">
                        <thead className="border-b border-slate-100">
                          <tr>
                            <th className="px-5 py-2.5 font-semibold text-slate-500 text-left w-40">Thuộc tính</th>
                            <th className="px-5 py-2.5 font-semibold text-slate-500 text-left">
                              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block"></span>Cũ</span>
                            </th>
                            <th className="px-5 py-2.5 font-semibold text-slate-500 text-left">
                              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>Mới</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {change.changedProps.map((prop, pIdx) => (
                            <tr key={pIdx} className="hover:bg-slate-50/50">
                              <td className="px-5 py-2.5 text-slate-600 font-medium">{prop.label}</td>
                              <td className="px-5 py-2.5">
                                <span className="text-red-600 line-through decoration-red-400">{prop.oldValue}</span>
                              </td>
                              <td className="px-5 py-2.5">
                                <span className="text-emerald-700 font-medium">{prop.newValue}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    {/* Added/Removed: show full info */}
                    {change.changeType === 'added' && !change.changedProps && (
                      <div className="px-5 py-3 bg-white text-[13px] text-emerald-700">Trường mới được thêm vào cấu trúc.</div>
                    )}
                    {change.changeType === 'removed' && !change.changedProps && (
                      <div className="px-5 py-3 bg-white text-[13px] text-red-600">Trường bị xóa khỏi cấu trúc.</div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── Tab: Quan hệ ── */}
        {activeTab === 'relationship' && (
          <div className="space-y-3">
            {relationshipChanges.length === 0 ? (
              <EmptyChange label="Không có thay đổi quan hệ danh mục" />
            ) : (
              relationshipChanges.map((change, idx) => {
                const meta = changeTypeMeta[change.changeType];
                const Icon = meta.icon;
                return (
                  <div key={idx} className={`border ${meta.border} rounded-xl overflow-hidden`}>
                    <div className={`${meta.bg} px-5 py-3 flex items-center gap-3 flex-wrap`}>
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[13px] font-semibold ${meta.badge}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {meta.label}
                      </span>
                      <span className="font-medium text-slate-800 text-[13px]">{change.sourceEntityName}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-800 text-[13px]">{change.targetEntityName}</span>
                      <span className={`ml-auto px-2 py-0.5 rounded border text-[13px] font-semibold ${
                        change.relationshipType === '1-n' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        change.relationshipType === 'n-1' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        change.relationshipType === 'n-n' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        'bg-teal-50 text-teal-700 border-teal-200'
                      }`}>
                        {change.relationshipType}
                      </span>
                    </div>
                    {change.changedProps && change.changedProps.length > 0 && (
                      <table className="w-full text-[13px] bg-white">
                        <thead className="border-b border-slate-100">
                          <tr>
                            <th className="px-5 py-2.5 font-semibold text-slate-500 text-left w-40">Thuộc tính</th>
                            <th className="px-5 py-2.5 font-semibold text-slate-500 text-left">
                              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block"></span>Cũ</span>
                            </th>
                            <th className="px-5 py-2.5 font-semibold text-slate-500 text-left">
                              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>Mới</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {change.changedProps.map((prop, pIdx) => (
                            <tr key={pIdx} className="hover:bg-slate-50/50">
                              <td className="px-5 py-2.5 text-slate-600 font-medium">{prop.label}</td>
                              <td className="px-5 py-2.5 text-red-600 line-through decoration-red-400">{prop.oldValue}</td>
                              <td className="px-5 py-2.5 text-emerald-700 font-medium">{prop.newValue}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Ý kiến phê duyệt */}
        {request.status === 'approved' || request.status === 'rejected' ? (
          <ReviewResultCard status={request.status} comment={request.comments} />
        ) : (
          <div className="space-y-2">
            <label className="block text-[13px] font-semibold text-slate-700">Ý kiến phê duyệt</label>
            <textarea
              rows={3}
              value={note}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
              placeholder="Nhập ý kiến phê duyệt hoặc lý do từ chối (nếu có)..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
            />
          </div>
        )}

      </div>
    </BaseModal>
  );
}

function EmptyChange({ label }: { label: string }) {
  return (
    <div className="text-[13px] text-slate-400 italic py-6 text-center border border-dashed border-slate-200 rounded-xl">
      {label}
    </div>
  );
}
