import { useState, ChangeEvent, ReactNode } from 'react';
import { Info, CheckCircle2, XCircle, FileText, KeyRound, ArrowRight } from 'lucide-react';
import { MasterDataEntity, ScopeType, DataSourceType } from '../../categoryTypes';
import { BaseModal } from '../../../../common/BaseModal';
import { ReviewResultCard } from './ReviewResultCard';
import { categoryTypeLabels } from '../../categoryConstants';

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
      <div className="flex items-center gap-1.5 text-[13px] text-slate-500 font-medium mb-1">
        {icon}
        {label}
      </div>
      <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-700 font-medium min-h-[34px]">
        {value ?? <span className="text-slate-400 italic">Chưa cập nhật</span>}
      </div>
    </div>
  );
}

function EmptyDetail({ label }: { label: string }) {
  return <div className="text-[13px] text-slate-400 italic py-6 text-center">{label}</div>;
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
      customHeaderIcon={
        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center mr-3 shrink-0">
          <Info className="w-5 h-5 text-blue-600" />
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
          {!viewOnly && (requestStatus === 'pending' || !requestStatus) ? (
            <div className="flex gap-2">
              <button
                onClick={() => { onReject(note); }}
                className="px-5 py-2.5 bg-red-500 text-white rounded-xl flex items-center gap-2 hover:bg-red-600 transition-all text-[13px] shadow-sm shadow-red-100"
              >
                <XCircle className="w-4 h-4" />
                Từ chối
              </button>
              <button
                onClick={() => { onApprove(note); }}
                className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl flex items-center gap-2 hover:bg-emerald-600 transition-all text-[13px] shadow-sm shadow-emerald-100"
              >
                <CheckCircle2 className="w-4 h-4" />
                Phê duyệt
              </button>
            </div>
          ) : null}
        </div>
      }
    >
      <div className="space-y-5">
        {showTabs && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
            {([
              { k: 'general', l: 'Thông tin chung' },
              { k: 'structure', l: 'Thuộc tính', c: attributes?.length },
              { k: 'relationship', l: 'Quan hệ', c: relationships?.length },
            ] as const).map(t => (
              <button
                key={t.k}
                onClick={() => setDetailTab(t.k)}
                className={`px-4 py-2 rounded-lg text-[13px] transition-all flex items-center gap-1.5 ${detailTab === t.k ? 'bg-white text-blue-600 shadow-sm font-medium' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                {t.l}
                {typeof t.c === 'number' && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold ${detailTab === t.k ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}`}>{t.c}</span>
                )}
              </button>
            ))}
          </div>
        )}

        {(!showTabs || detailTab === 'general') && (
          <div className="grid grid-cols-2 gap-4">
            <Field label="Phiên bản danh mục" value={`v${entity.version ?? 1}.0`} colSpan={2} />
            <Field label="Tên danh sách danh mục" value={entity.name} colSpan={2} />
            <Field label="Loại danh mục" value={entity.categoryType ? categoryTypeLabels[entity.categoryType] : undefined} colSpan={2} />
            <Field label="Cơ sở dữ liệu/Hệ thống" value={entity.databaseSystem} />
            <Field label="Đơn vị chủ quản" value={entity.managingAgency} />
            <Field label="Căn cứ" value={entity.canCu} colSpan={2} />
            <Field label="Phạm vi vĩ mô" value={entity.scope ? scopeLabels[entity.scope] : undefined} />
            <Field label="Nguồn dữ liệu" value={entity.dataSource ? dataSourceLabels[entity.dataSource] : undefined} />
            {!viewOnly && <Field label="Nội dung trình duyệt" value={submissionContent} colSpan={2} icon={<FileText className="w-4 h-4 text-slate-400" />} />}
          </div>
        )}

        {showTabs && detailTab === 'structure' && (
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            {attributes && attributes.length > 0 ? (
              <table className="w-full text-[13px]">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-500">Mã trường</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-500">Tên hiển thị</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-500">Kiểu dữ liệu</th>
                    <th className="px-4 py-2.5 text-center font-semibold text-slate-500">PK</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attributes.map((a, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="px-4 py-2.5 font-mono text-slate-700">{a.fieldName}</td>
                      <td className="px-4 py-2.5 text-slate-700">{a.displayName}</td>
                      <td className="px-4 py-2.5 text-slate-600">{a.dataType}</td>
                      <td className="px-4 py-2.5 text-center">{a.isPK ? <KeyRound className="w-4 h-4 text-amber-500 inline" /> : <span className="text-slate-300">—</span>}</td>
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
              <div key={i} className="flex items-center gap-2 flex-wrap border border-slate-200 rounded-xl px-4 py-3 text-[13px]">
                <span className="font-medium text-slate-800">{r.sourceEntityName}</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-800">{r.targetEntityName}</span>
                <span className="ml-auto px-2 py-0.5 rounded border bg-blue-50 text-blue-700 border-blue-200 text-[13px] font-semibold">{r.relationshipType}</span>
                <span className="text-slate-500 font-mono">FK: {r.foreignKey}</span>
              </div>
            )) : <EmptyDetail label="Chưa có quan hệ" />}
          </div>
        )}

        {viewOnly ? null : requestStatus === 'approved' || requestStatus === 'rejected' ? (
          <ReviewResultCard status={requestStatus} comment={reviewComment} />
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
