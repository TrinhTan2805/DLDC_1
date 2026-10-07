import { useState, ChangeEvent, ReactNode } from 'react';
import { CheckCircle2, XCircle, ChevronRight, ArrowUpCircle, History, KeyRound } from 'lucide-react';
import { MasterDataEntity, ApprovalRequest } from '../../categoryTypes';
import { BaseModal } from '../../../../common/BaseModal';
import { ReviewResultCard } from './ReviewResultCard';
import { Badge, BTN_PRIMARY, BTN_OUTLINE, BTN_DESTRUCTIVE, LABEL_CLS, FIELD_LABEL, FIELD_VALUE, GROUP_TITLE, tabClass } from '../../../collection/collectionUi';

const TEXTAREA_CLS = 'w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none';
const TH_CLS = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD_CLS = 'px-3 py-1 text-[13px] text-black';
const TR_CLS = 'h-12 bg-white border-b border-[#E0E0E0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors';

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

const relTypeVariant = (type: string) =>
  type === '1-n' ? 'blue' :
  type === 'n-1' ? 'indigo' :
  type === 'n-n' ? 'purple' :
  'emerald';

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
      footer={
        <>
          <button onClick={onClose} className={BTN_OUTLINE}>
            Đóng
          </button>
          {(request?.status === 'pending' || !request?.status) && (
            <>
              <button onClick={() => onReject(note)} className={BTN_DESTRUCTIVE}>
                <XCircle className="w-4 h-4" />
                Từ chối
              </button>
              <button onClick={() => onApprove(note)} className={BTN_PRIMARY}>
                <CheckCircle2 className="w-4 h-4" />
                Phê duyệt
              </button>
            </>
          )}
        </>
      }
    >
      <div className="space-y-4">

        {/* Tiêu đề danh mục + version badge */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className={FIELD_LABEL}>Danh mục</div>
            <div className={`${FIELD_VALUE} mt-1`}>{entity.name}</div>
            <div className="text-[13px] text-[#64748B] mt-0.5">{entity.code} · {request.requestedBy} · {request.requestedDate}</div>
          </div>
          <div className="shrink-0 flex items-center gap-2 h-10 px-3 bg-[#EAF3FF] border border-[#BFDBFE] rounded-lg text-[13px]">
            <span className="text-[#64748B]">v{prevVersion}</span>
            <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
            <span className="font-medium text-[#155DFC]">v{currentVersion}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-[#E2E8F0]">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={tabClass(activeTab === tab.key)}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`min-w-5 h-5 px-1.5 inline-flex items-center justify-center rounded-full text-[12px] font-medium tabular-nums ${
                  activeTab === tab.key ? 'bg-[#EAF3FF] text-[#155DFC]' : 'bg-[#F1F5F9] text-[#64748B]'
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
          <div>
            <label className={LABEL_CLS}>Ý kiến phê duyệt</label>
            <textarea
              rows={3}
              value={note}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
              placeholder="Nhập ý kiến phê duyệt hoặc lý do từ chối (nếu có)..."
              className={TEXTAREA_CLS}
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
    <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden">
      <div
        className={`px-4 py-3 flex items-center gap-2 border-b ${
          isNew
            ? 'bg-[#F0FDF4] border-[#DCFCE7]'
            : 'bg-[#FEF2F2] border-[#FEE2E2]'
        }`}
      >
        <HeaderIcon className={`w-4 h-4 ${isNew ? 'text-[#16A34A]' : 'text-[#DC2626]'}`} />
        <span className={GROUP_TITLE}>
          {isNew ? 'Phiên bản mới' : 'Phiên bản cũ'} (v{version})
        </span>
      </div>
      <div className="bg-white">{children}</div>
    </div>
  );
}

function EmptyNote() {
  return (
    <div className="px-4 py-6 text-center text-[13px] text-[#64748B]">
      Không có dữ liệu
    </div>
  );
}

function GeneralList({ items }: { items: GeneralField[] }) {
  if (items.length === 0) return <EmptyNote />;
  return (
    <div className="divide-y divide-[#E0E0E0]">
      {items.map((item, idx) => (
        <div key={idx} className="px-4 py-2.5 flex items-start gap-3 text-[13px]">
          <span className={`w-44 shrink-0 ${FIELD_LABEL}`}>{item.label}</span>
          <span className={FIELD_VALUE}>{item.value || '-'}</span>
        </div>
      ))}
    </div>
  );
}

function StructureTable({ items }: { items: SnapField[] }) {
  if (items.length === 0) return <EmptyNote />;
  return (
    <table className="w-full border-collapse collection-table text-[13px] text-left">
      <thead className="bg-[#F8FAFC]">
        <tr className="h-[42px]">
          <th className={TH_CLS}>Mã trường</th>
          <th className={TH_CLS}>Tên hiển thị</th>
          <th className={TH_CLS}>Kiểu</th>
          <th className={`${TH_CLS} text-center w-16`}>PK</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, idx) => (
          <tr key={idx} className={TR_CLS}>
            <td className={TD_CLS}>{item.fieldName}</td>
            <td className={TD_CLS}>{item.displayName}</td>
            <td className={TD_CLS}>{item.dataType}</td>
            <td className={`${TD_CLS} text-center`}>
              {item.isPK ? (
                <KeyRound className="w-4 h-4 text-[#D97706] inline-block" />
              ) : (
                <span className="text-[#94A3B8]">—</span>
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
    <div className="divide-y divide-[#E0E0E0]">
      {items.map((item, idx) => (
        <div key={idx} className="px-4 py-3 flex items-center gap-3 flex-wrap text-[13px] text-[#020817]">
          <span>{item.sourceEntityName}</span>
          <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
          <span>{item.targetEntityName}</span>
          <Badge label={item.relationshipType} variant={relTypeVariant(item.relationshipType)} />
          <span className="ml-auto text-[#64748B]">
            FK: <span className="text-[#020817]">{item.foreignKey || '—'}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
