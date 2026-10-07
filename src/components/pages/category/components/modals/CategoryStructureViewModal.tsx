import { useState, ChangeEvent } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { MasterDataEntity, MasterDataAttribute, EntityRelationship, FieldDataType, RelationshipType } from '../../categoryTypes';
import { BaseModal } from '../../../../common/BaseModal';
import { ReviewResultCard } from './ReviewResultCard';
import { Badge, TruncatedText, BTN_PRIMARY, BTN_OUTLINE, BTN_DESTRUCTIVE, LABEL_CLS, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE } from '../../../collection/collectionUi';

const TEXTAREA_CLS = 'w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none';
const TH_CLS = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD_CLS = 'px-3 py-1 text-[13px] text-black';
const TR_CLS = 'h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors';
const EMPTY_CLS = 'text-[13px] text-[#64748B] py-16 text-center bg-white border border-[#E2E8F0] rounded-lg';

interface CategoryStructureViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: MasterDataEntity | null;
  attributes: MasterDataAttribute[];
  relationships: EntityRelationship[];
  requestStatus?: string;
  reviewComment?: string;
  onApprove: (note: string) => void;
  onReject: (note: string) => void;
}

const fieldTypeLabels: Record<FieldDataType, string> = {
  string: 'Chuỗi (String)',
  number: 'Số (Number)',
  date: 'Ngày (Date)',
  datetime: 'Ngày giờ (DateTime)',
  boolean: 'Logic (Boolean)',
  text: 'Văn bản dài (Text)',
  email: 'Email',
  phone: 'Số điện thoại',
  url: 'URL',
};

const relationTypeColors: Record<RelationshipType, string> = {
  '1-n': 'blue',
  'n-1': 'indigo',
  'n-n': 'purple',
  '1-1': 'emerald',
};

export function CategoryStructureViewModal({
  isOpen,
  onClose,
  entity,
  attributes,
  relationships,
  requestStatus,
  reviewComment,
  onApprove,
  onReject,
}: CategoryStructureViewModalProps) {
  const [note, setNote] = useState('');

  if (!isOpen || !entity) return null;

  const entityRelationships = relationships.filter(
    r => r.sourceEntityId === entity.id || r.targetEntityId === entity.id
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Thông tin cấu trúc & quan hệ"
      subtitle="Cấu hình tại bước 2 & 3 — Thiết lập danh mục dùng chung"
      maxWidth="max-w-5xl"
      footer={
        <>
          <button onClick={onClose} className={BTN_OUTLINE}>
            Đóng
          </button>
          {(requestStatus === 'pending' || !requestStatus) && (
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
      <div className="space-y-6">

        {/* Tên danh mục */}
        <div>
          <div className={FIELD_LABEL}>Tên danh mục</div>
          <div className={`${FIELD_VALUE} mt-1`}>{entity.name}</div>
        </div>

        {/* Thiết lập cấu trúc */}
        <div>
          <div className={SECTION_TITLE}>
            Thiết lập cấu trúc
            <Badge label={`${attributes.length} trường`} variant="indigo" />
          </div>
          {attributes.length === 0 ? (
            <div className={EMPTY_CLS}>
              Chưa có trường dữ liệu nào
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full border-collapse collection-table text-[13px] text-left">
                  <thead className="bg-[#F8FAFC]">
                    <tr className="h-[42px]">
                      <th className={`${TH_CLS} w-12 text-center`}>STT</th>
                      <th className={TH_CLS}>Tên trường</th>
                      <th className={TH_CLS}>Tên hiển thị</th>
                      <th className={TH_CLS}>Kiểu dữ liệu</th>
                      <th className={`${TH_CLS} text-right`}>Độ dài</th>
                      <th className={TH_CLS}>Cấu hình khóa</th>
                      <th className={TH_CLS}>Ràng buộc</th>
                      <th className={TH_CLS}>Giá trị mặc định</th>
                      <th className={TH_CLS}>Quy tắc xác thực</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attributes.map((attr, idx) => (
                      <tr key={attr.id} className={TR_CLS}>
                        <td className={`${TD_CLS} text-center`}>{idx + 1}</td>
                        <td className={TD_CLS}>{attr.fieldName || '--'}</td>
                        <td className={TD_CLS}>{attr.displayName || '--'}</td>
                        <td className={`${TD_CLS} whitespace-nowrap`}>{attr.dataType ? (fieldTypeLabels[attr.dataType] ?? attr.dataType) : '--'}</td>
                        <td className={`${TD_CLS} text-right tabular-nums`}>{attr.length ?? '--'}</td>
                        <td className={TD_CLS}>
                          {attr.keyType === 'primary' || attr.keyType === 'foreign' ? (
                            <div className="flex gap-1.5 flex-wrap">
                              {attr.keyType === 'primary' && <Badge label="PK" variant="amber" />}
                              {attr.keyType === 'foreign' && <Badge label="FK" variant="emerald" />}
                            </div>
                          ) : (
                            <span className="text-[#94A3B8]">--</span>
                          )}
                        </td>
                        <td className={TD_CLS}>
                          {attr.required || attr.unique || (attr as any).indexed ? (
                            <div className="flex gap-1.5 flex-wrap">
                              {attr.required && <Badge label="REQ" variant="red" />}
                              {attr.unique   && <Badge label="UNI" variant="purple" />}
                              {(attr as any).indexed && <Badge label="IDX" variant="blue" />}
                            </div>
                          ) : (
                            <span className="text-[#94A3B8]">--</span>
                          )}
                        </td>
                        <td className={TD_CLS}>{attr.defaultValue || '--'}</td>
                        <td className={`${TD_CLS} max-w-[160px]`}><TruncatedText text={attr.validationRules || '--'} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Thiết lập quan hệ */}
        <div>
          <div className={SECTION_TITLE}>
            Thiết lập quan hệ
            <Badge label={`${entityRelationships.length} quan hệ`} variant="indigo" />
          </div>
          {entityRelationships.length === 0 ? (
            <div className={EMPTY_CLS}>
              Chưa có quan hệ nào
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full border-collapse collection-table text-[13px] text-left">
                  <thead className="bg-[#F8FAFC]">
                    <tr className="h-[42px]">
                      <th className={`${TH_CLS} w-16 text-center`}>STT</th>
                      <th className={TH_CLS}>Danh mục Nguồn</th>
                      <th className={TH_CLS}>Khóa Nguồn</th>
                      <th className={`${TH_CLS} w-28`}>Loại</th>
                      <th className={TH_CLS}>Danh mục Đích</th>
                      <th className={TH_CLS}>Khóa Đích</th>
                      <th className={TH_CLS}>Trường hiển thị</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entityRelationships.map((rel, idx) => {
                      const isSourceCurrent = rel.sourceEntityId === entity.id;
                      return (
                        <tr key={rel.id} className={TR_CLS}>
                          <td className={`${TD_CLS} text-center`}>{idx + 1}</td>
                          <td className={TD_CLS}>
                            <div className={isSourceCurrent ? 'text-blue-600' : 'text-black'}>
                              {rel.sourceEntityName || rel.sourceEntityId}
                            </div>
                          </td>
                          <td className={TD_CLS}>{rel.sourceKey || '--'}</td>
                          <td className={TD_CLS}>
                            <Badge label={rel.relationshipType} variant={relationTypeColors[rel.relationshipType]} />
                          </td>
                          <td className={TD_CLS}>
                            <div className={!isSourceCurrent ? 'text-blue-600' : 'text-black'}>
                              {rel.targetEntityName || rel.targetEntityId}
                            </div>
                          </td>
                          <td className={TD_CLS}>{rel.targetKey || '--'}</td>
                          <td className={TD_CLS}>
                            {rel.relationshipType === 'n-n' ? (
                              rel.mappingTable || '--'
                            ) : (
                              rel.targetDisplayField
                                ? rel.targetDisplayField
                                : <span className="text-[#94A3B8]">--</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Ý kiến phê duyệt */}
        {requestStatus === 'approved' || requestStatus === 'rejected' ? (
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
