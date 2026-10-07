import { useState, ChangeEvent, ReactNode } from 'react';
import { CheckCircle2, XCircle, FileText, KeyRound, ArrowRight } from 'lucide-react';
import { MasterDataEntity, ScopeType, DataSourceType } from '../../categoryTypes';
import { BaseModal } from '../../../../common/BaseModal';
import { ReviewResultCard } from './ReviewResultCard';
import { categoryTypeLabels } from '../../categoryConstants';
import { Badge, BTN_PRIMARY, BTN_OUTLINE, BTN_DESTRUCTIVE, LABEL_CLS, FIELD_LABEL, FIELD_VALUE, tabClass } from '../../../collection/collectionUi';

const TEXTAREA_CLS = 'w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none';
const TH_CLS = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD_CLS = 'px-3 py-1 text-[13px] text-black';
const TR_CLS = 'h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors';

export interface CategoryDetailAttr { fieldName: string; displayName: string; dataType: string; isPK?: boolean; }
export interface CategoryDetailRel { sourceEntityName: string; targetEntityName: string; relationshipType: string; foreignKey: string; }

interface CategoryInfoViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: MasterDataEntity | null;
  requestStatus?: string;
  submissionContent?: string;
  reviewComment?: string;
  onApprove: (note: string) => void;
  onReject: (note: string) => void;
  viewOnly?: boolean;
  attributes?: CategoryDetailAttr[];
  relationships?: CategoryDetailRel[];
}

const scopeLabels: Record<ScopeType, string> = {
  national: 'Cấp quốc gia',
  ministry: 'Cấp bộ',
  provincial: 'Cấp tỉnh',
  internal: 'Sử dụng nội bộ',
};

const dataSourceLabels: Record<DataSourceType, string> = {
  manual: 'Tự cập nhật trực tiếp',
  dldc: 'Đồng bộ Kho DLDC',
};

function Field({ label, value, colSpan = 1, icon }: { label: string; value?: string | number | null; colSpan?: number; icon?: ReactNode }) {
  return (
    <div className={colSpan === 2 ? 'col-span-2' : ''}>
      <div className={`${FIELD_LABEL} flex items-center gap-1.5`}>
        {icon}
        {label}
      </div>
      <div className={`${FIELD_VALUE} mt-1 whitespace-pre-wrap break-words`}>
        {value ?? <span className="text-[#94A3B8]">Chưa cập nhật</span>}
      </div>
    </div>
  );
}

function EmptyDetail({ label }: { label: string }) {
  return <div className="text-[13px] text-[#64748B] py-16 text-center">{label}</div>;
}

export function CategoryInfoViewModal({ isOpen, onClose, entity, requestStatus, submissionContent, reviewComment, onApprove, onReject, viewOnly = false, attributes, relationships }: CategoryInfoViewModalProps) {
  const [note, setNote] = useState('');
  const [detailTab, setDetailTab] = useState<'general' | 'structure' | 'relationship'>('general');
  const showTabs = viewOnly && (!!attributes || !!relationships);

  if (!isOpen || !entity) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={viewOnly ? 'Chi tiết danh mục' : 'Thông tin chung danh mục'}
      subtitle={viewOnly ? 'Thông tin chi tiết danh mục dùng chung' : 'Thông tin được cấu hình tại bước 1 — Thiết lập danh mục dùng chung'}
      maxWidth="max-w-2xl"
      footer={
        <>
          <button onClick={onClose} className={BTN_OUTLINE}>
            Đóng
          </button>
          {!viewOnly && (requestStatus === 'pending' || !requestStatus) ? (
            <>
              <button
                onClick={() => { onReject(note); }}
                className={BTN_DESTRUCTIVE}
              >
                <XCircle className="w-4 h-4" />
                Từ chối
              </button>
              <button
                onClick={() => { onApprove(note); }}
                className={BTN_PRIMARY}
              >
                <CheckCircle2 className="w-4 h-4" />
                Phê duyệt
              </button>
            </>
          ) : null}
        </>
      }
    >
      <div className="space-y-4">
        {showTabs && (
          <div className="flex items-center border-b border-[#E2E8F0]">
            {([
              { k: 'general', l: 'Thông tin chung' },
              { k: 'structure', l: 'Thuộc tính', c: attributes?.length },
              { k: 'relationship', l: 'Quan hệ', c: relationships?.length },
            ] as const).map(t => (
              <button
                key={t.k}
                onClick={() => setDetailTab(t.k)}
                className={tabClass(detailTab === t.k)}
              >
                {t.l}
                {typeof t.c === 'number' && (
                  <span className={`min-w-5 h-5 px-1.5 inline-flex items-center justify-center rounded-full text-[12px] font-medium tabular-nums ${detailTab === t.k ? 'bg-[#EAF3FF] text-[#155DFC]' : 'bg-[#F1F5F9] text-[#64748B]'}`}>{t.c}</span>
                )}
              </button>
            ))}
          </div>
        )}

        {(!showTabs || detailTab === 'general') && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Field label="Phiên bản danh mục" value={`v${entity.version ?? 1}.0`} colSpan={2} />
            <Field label="Tên danh sách danh mục" value={entity.name} colSpan={2} />
            <Field label="Loại danh mục" value={entity.categoryType ? categoryTypeLabels[entity.categoryType] : undefined} colSpan={2} />
            <Field label="Cơ sở dữ liệu/Hệ thống" value={entity.databaseSystem} />
            <Field label="Đơn vị chủ quản" value={entity.managingAgency} />
            <Field label="Căn cứ" value={entity.canCu} colSpan={2} />
            <Field label="Phạm vi vĩ mô" value={entity.scope ? scopeLabels[entity.scope] : undefined} />
            <Field label="Nguồn dữ liệu" value={entity.dataSource ? dataSourceLabels[entity.dataSource] : undefined} />
            {!viewOnly && <Field label="Nội dung trình duyệt" value={submissionContent} colSpan={2} icon={<FileText className="w-4 h-4 text-[#64748B]" />} />}
          </div>
        )}

        {showTabs && detailTab === 'structure' && (
          <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
            {attributes && attributes.length > 0 ? (
              <table className="w-full border-collapse collection-table text-[13px] text-left">
                <thead className="bg-[#F8FAFC]">
                  <tr className="h-[42px]">
                    <th className={TH_CLS}>Mã trường</th>
                    <th className={TH_CLS}>Tên hiển thị</th>
                    <th className={TH_CLS}>Kiểu dữ liệu</th>
                    <th className={`${TH_CLS} text-center w-20`}>PK</th>
                  </tr>
                </thead>
                <tbody>
                  {attributes.map((a, i) => (
                    <tr key={i} className={TR_CLS}>
                      <td className={TD_CLS}>{a.fieldName}</td>
                      <td className={TD_CLS}>{a.displayName}</td>
                      <td className={TD_CLS}>{a.dataType}</td>
                      <td className={`${TD_CLS} text-center`}>{a.isPK ? <KeyRound className="w-4 h-4 text-[#D97706] inline" /> : <span className="text-[#94A3B8]">—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <EmptyDetail label="Chưa có thuộc tính" />}
          </div>
        )}

        {showTabs && detailTab === 'relationship' && (
          <div className="space-y-2">
            {relationships && relationships.length > 0 ? relationships.map((r, i) => (
              <div key={i} className="flex items-center gap-2 flex-wrap bg-white border border-[#E2E8F0] rounded-lg px-4 py-3 text-[13px] text-[#020817]">
                <span>{r.sourceEntityName}</span>
                <ArrowRight className="w-4 h-4 text-[#94A3B8]" />
                <span>{r.targetEntityName}</span>
                <span className="ml-auto"><Badge label={r.relationshipType} variant="blue" /></span>
                <span className="text-[#64748B]">FK: {r.foreignKey}</span>
              </div>
            )) : <EmptyDetail label="Chưa có quan hệ" />}
          </div>
        )}

        {viewOnly ? null : requestStatus === 'approved' || requestStatus === 'rejected' ? (
          <ReviewResultCard status={requestStatus} comment={reviewComment} />
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
