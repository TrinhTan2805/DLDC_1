import { useState, ChangeEvent, ReactNode } from 'react';
import { GitCompare, CheckCircle2, XCircle, ChevronRight, ArrowUpCircle, History, KeyRound } from 'lucide-react';
import { MasterDataEntity, ApprovalRequest } from '../../categoryTypes';
import { BaseModal } from '../../../../common/BaseModal';
import { ReviewResultCard } from './ReviewResultCard';

// ── Kiểu dữ liệu nội bộ cho changes (dạng snapshot old/new) ───────────────────

interface GeneralField {
  label: string;
  value: string;
}

interface SnapField {
  fieldName: string;
  displayName: string;
  dataType: string;
  isPK?: boolean;
}

interface SnapRel {
  sourceEntityName: string;
  targetEntityName: string;
  relationshipType: string;
  foreignKey: string;
}

export interface VersionChanges {
  prevVersion: number;
  currentVersion: number;
  general: { old: GeneralField[]; new: GeneralField[] };
  structure: { old: SnapField[]; new: SnapField[] };
  relationship: { old: SnapRel[]; new: SnapRel[] };
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

const emptySnapshot: VersionChanges = {
  prevVersion: 1,
  currentVersion: 2,
  general: { old: [], new: [] },
  structure: { old: [], new: [] },
  relationship: { old: [], new: [] },
};

const relTypeClass = (type: string) =>
  type === '1-n' ? 'bg-blue-50 text-blue-700 border-blue-200' :
  type === 'n-1' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
  type === 'n-n' ? 'bg-purple-50 text-purple-700 border-purple-200' :
  'bg-teal-50 text-teal-700 border-teal-200';

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

  const changes = (request.changes as VersionChanges | undefined) ?? emptySnapshot;
  const prevVersion = changes.prevVersion ?? 1;
  const currentVersion = changes.currentVersion ?? 2;
  const general = changes.general ?? emptySnapshot.general;
  const structure = changes.structure ?? emptySnapshot.structure;
  const relationship = changes.relationship ?? emptySnapshot.relationship;

  const tabs: { key: DiffTab; label: string; count: number }[] = [
    { key: 'general', label: 'Thông tin chung', count: general.new.length },
    { key: 'structure', label: 'Cấu trúc', count: structure.new.length },
    { key: 'relationship', label: 'Quan hệ', count: relationship.new.length },
  ];

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
          <div className="space-y-4">
            <VersionBlock variant="new" version={currentVersion}>
              <GeneralList items={general.new} />
            </VersionBlock>
            <VersionBlock variant="old" version={prevVersion}>
              <GeneralList items={general.old} />
            </VersionBlock>
          </div>
        )}

        {/* ── Tab: Cấu trúc ── */}
        {activeTab === 'structure' && (
          <div className="space-y-4">
            <VersionBlock variant="new" version={currentVersion}>
              <StructureTable items={structure.new} />
            </VersionBlock>
            <VersionBlock variant="old" version={prevVersion}>
              <StructureTable items={structure.old} />
            </VersionBlock>
          </div>
        )}

        {/* ── Tab: Quan hệ ── */}
        {activeTab === 'relationship' && (
          <div className="space-y-4">
            <VersionBlock variant="new" version={currentVersion}>
              <RelationshipList items={relationship.new} />
            </VersionBlock>
            <VersionBlock variant="old" version={prevVersion}>
              <RelationshipList items={relationship.old} />
            </VersionBlock>
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

// ── Khối một phiên bản (mới / cũ) ─────────────────────────────────────────────

function VersionBlock({
  variant,
  version,
  children,
}: {
  variant: 'new' | 'old';
  version: number;
  children: ReactNode;
}) {
  const isNew = variant === 'new';
  const HeaderIcon = isNew ? ArrowUpCircle : History;
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div
        className={`px-5 py-3 flex items-center gap-2 border-b ${
          isNew
            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
            : 'bg-red-50 text-red-600 border-red-100'
        }`}
      >
        <HeaderIcon className="w-4 h-4" />
        <span className="text-[13px] font-semibold">
          {isNew ? 'Phiên bản mới' : 'Phiên bản cũ'} (v{version})
        </span>
      </div>
      <div className="bg-white">{children}</div>
    </div>
  );
}

function EmptyNote() {
  return (
    <div className="px-5 py-6 text-center text-[13px] text-slate-400 italic">
      Không có dữ liệu
    </div>
  );
}

function GeneralList({ items }: { items: GeneralField[] }) {
  if (items.length === 0) return <EmptyNote />;
  return (
    <div className="divide-y divide-slate-100">
      {items.map((item, idx) => (
        <div key={idx} className="px-5 py-2.5 flex items-start gap-3 text-[13px]">
          <span className="w-44 shrink-0 font-medium text-slate-500">{item.label}</span>
          <span className="text-slate-800">{item.value || <span className="italic text-slate-400">—</span>}</span>
        </div>
      ))}
    </div>
  );
}

function StructureTable({ items }: { items: SnapField[] }) {
  if (items.length === 0) return <EmptyNote />;
  return (
    <table className="w-full text-[13px]">
      <thead className="bg-[#f8fafc] border-b border-slate-200">
        <tr>
          <th className="px-5 py-2.5 font-semibold text-slate-500 text-left">Mã trường</th>
          <th className="px-5 py-2.5 font-semibold text-slate-500 text-left">Tên hiển thị</th>
          <th className="px-5 py-2.5 font-semibold text-slate-500 text-left">Kiểu</th>
          <th className="px-5 py-2.5 font-semibold text-slate-500 text-center w-16">PK</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {items.map((item, idx) => (
          <tr key={idx} className="hover:bg-slate-50/50">
            <td className="px-5 py-2.5 font-mono font-semibold text-slate-800">{item.fieldName}</td>
            <td className="px-5 py-2.5 text-slate-600">{item.displayName}</td>
            <td className="px-5 py-2.5 text-slate-600">{item.dataType}</td>
            <td className="px-5 py-2.5 text-center">
              {item.isPK ? (
                <KeyRound className="w-4 h-4 text-amber-500 inline-block" />
              ) : (
                <span className="text-slate-300">—</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function RelationshipList({ items }: { items: SnapRel[] }) {
  if (items.length === 0) return <EmptyNote />;
  return (
    <div className="divide-y divide-slate-100">
      {items.map((item, idx) => (
        <div key={idx} className="px-5 py-3 flex items-center gap-3 flex-wrap text-[13px]">
          <span className="font-medium text-slate-800">{item.sourceEntityName}</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="font-medium text-slate-800">{item.targetEntityName}</span>
          <span className={`px-2 py-0.5 rounded border text-[13px] font-semibold ${relTypeClass(item.relationshipType)}`}>
            {item.relationshipType}
          </span>
          <span className="ml-auto text-slate-500">
            FK: <span className="font-mono text-slate-700">{item.foreignKey || '—'}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
