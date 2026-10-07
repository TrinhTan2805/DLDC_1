import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { BaseModal } from '../../../../common/BaseModal';
import { Badge, BTN_OUTLINE, FIELD_LABEL, FIELD_VALUE, tabClass } from '../../../collection/collectionUi';

// ── Exported types used by EntityVersionHistoryModal ─────────────────────────

export interface StructureCompareRow {
  changeType: 'added' | 'removed' | 'modified' | 'unchanged';
  fieldName: string;
  displayName: string;
  oldDataType?: string;
  newDataType?: string;
  oldExtra?: string;
  newExtra?: string;
}

export interface GeneralCompareRow {
  label: string;
  oldValue: string;
  newValue: string;
}

export interface RelationshipCompareRow {
  changeType: 'added' | 'removed' | 'modified' | 'unchanged';
  sourceEntity: string;
  targetEntity: string;
  oldRelType?: string;
  newRelType?: string;
}

export interface EntityVersionDiff {
  prevVersion: number;
  currentVersion: number;
  generalRows: GeneralCompareRow[];
  structureRows: StructureCompareRow[];
  relationshipRows: RelationshipCompareRow[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  entityName: string;
  diff: EntityVersionDiff;
}

type DiffTab = 'general' | 'structure' | 'relationship';

const relTypeColors: Record<string, string> = {
  '1-n': 'blue',
  'n-1': 'indigo',
  'n-n': 'purple',
  '1-1': 'emerald',
};

// Bảng so sánh: cùng khung/tiêu đề/hàng với quy chuẩn bảng (5.3); xóa = đỏ, thêm = xanh lá
const TABLE_WRAP = 'bg-white rounded-lg border border-[#E2E8F0] overflow-hidden';
const TH_CLS = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD_CLS = 'px-3 py-2 text-[13px] text-black';
const ROW_CLS = 'border-b border-[#E0E0E0] last:border-b-0';
const SEP_R = 'border-r border-[#E2E8F0]';
const OLD_HEAD = 'px-3 py-3 bg-[#FEF2F2] text-[#B91C1C] border-b border-[#FEE2E2] text-[13px] font-medium';
const NEW_HEAD = 'px-3 py-3 bg-[#F0FDF4] text-[#15803D] border-b border-[#DCFCE7] text-[13px] font-medium';
const ADDED_ROW = 'bg-[#F0FDF4]';
const REMOVED_ROW = 'bg-[#FEF2F2]';
const MODIFIED_ROW = 'bg-[#FFF7ED]';
const ADDED_TXT = 'text-[#15803D]';
const REMOVED_TXT = 'text-[#B91C1C] line-through';
const PLACEHOLDER_TD = 'px-3 py-2 text-center text-[13px] text-[#64748B]';
const EMPTY_TD = 'px-3 py-16 text-center text-[13px] text-[#64748B]';
const SUB_LINE = 'text-[13px] leading-[18px] mt-0.5';

export function EntityVersionDiffModal({ isOpen, onClose, entityName, diff }: Props) {
  const [activeTab, setActiveTab] = useState<DiffTab>('structure');

  if (!isOpen) return null;

  const { prevVersion, currentVersion, generalRows, structureRows, relationshipRows } = diff;

  const tabs: { key: DiffTab; label: string; count: number }[] = [
    { key: 'structure',    label: 'Cấu trúc',       count: structureRows.filter(r => r.changeType !== 'unchanged').length },
    { key: 'general',     label: 'Thông tin chung', count: generalRows.length },
    { key: 'relationship',label: 'Quan hệ',         count: relationshipRows.filter(r => r.changeType !== 'unchanged').length },
  ];

  const versionHead = (isNew: boolean, colSpan: number, extra = '') => (
    <th colSpan={colSpan} className={`${isNew ? NEW_HEAD : OLD_HEAD} ${extra}`}>
      <div className="flex items-center justify-between gap-2">
        <span>{isNew ? `PHIÊN BẢN MỚI (v${currentVersion}.0)` : `PHIÊN BẢN CŨ (v${prevVersion}.0)`}</span>
        <Badge label={isNew ? 'Sau cập nhật' : 'Trước cập nhật'} variant={isNew ? 'green' : 'red'} />
      </div>
    </th>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="So sánh phiên bản danh mục"
      subtitle={entityName}
      maxWidth="max-w-5xl"
      footer={
        <button onClick={onClose} className={BTN_OUTLINE}>
          Đóng so sánh
        </button>
      }
    >
      <div className="space-y-4">

        {/* Entity & Version Banner */}
        <div className="rounded-2xl border border-[#E2E8F0] p-4">
          <div className={FIELD_LABEL}>Danh mục được so sánh</div>
          <div className={`${FIELD_VALUE} mt-1`}>{entityName}</div>
          <div className="flex items-center gap-3 mt-3">
            <Badge label={`Phiên bản cũ   v${prevVersion}.0`} variant="red" />
            <ArrowRight className="w-4 h-4 text-[#94A3B8] shrink-0" />
            <Badge label={`Phiên bản mới   v${currentVersion}.0`} variant="green" />
          </div>
        </div>

        {/* Change-type Tabs */}
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

        {/* ── STRUCTURE TAB ─────────────────────────────────── */}
        {activeTab === 'structure' && (
          <div className={TABLE_WRAP}>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full border-collapse collection-table text-[13px] text-left">
                <thead>
                  <tr>
                    {versionHead(false, 2, SEP_R)}
                    {versionHead(true, 2)}
                  </tr>
                  <tr className="h-[42px] bg-[#F8FAFC] border-b border-[#E0E0E0]">
                    <th className={`${TH_CLS} ${SEP_R} w-[22%]`}>Trường thuộc tính</th>
                    <th className={`${TH_CLS} ${SEP_R} w-[28%]`}>Kiểu dữ liệu</th>
                    <th className={`${TH_CLS} ${SEP_R} w-[22%]`}>Trường thuộc tính</th>
                    <th className={`${TH_CLS} w-[28%]`}>Kiểu dữ liệu</th>
                  </tr>
                </thead>
                <tbody>
                  {structureRows.map((row, i) => {
                    if (row.changeType === 'added') {
                      return (
                        <tr key={i} className={`${ROW_CLS} ${ADDED_ROW}`}>
                          <td colSpan={2} className={`${PLACEHOLDER_TD} ${SEP_R}`}>
                            (Không tồn tại ở phiên bản cũ v{prevVersion}.0)
                          </td>
                          <td className={`${TD_CLS} ${SEP_R} ${ADDED_TXT}`}>
                            <div className="leading-[18px]">{row.fieldName}</div>
                            {row.displayName && <div className={SUB_LINE}>{row.displayName}</div>}
                          </td>
                          <td className={`${TD_CLS} ${ADDED_TXT}`}>{row.newDataType || '--'}</td>
                        </tr>
                      );
                    }
                    if (row.changeType === 'removed') {
                      return (
                        <tr key={i} className={`${ROW_CLS} ${REMOVED_ROW}`}>
                          <td className={`${TD_CLS} ${SEP_R} ${REMOVED_TXT}`}>
                            <div className="leading-[18px]">{row.fieldName}</div>
                            {row.displayName && <div className={SUB_LINE}>{row.displayName}</div>}
                          </td>
                          <td className={`${TD_CLS} ${SEP_R} ${REMOVED_TXT}`}>{row.oldDataType || '--'}</td>
                          <td colSpan={2} className={PLACEHOLDER_TD}>
                            (Đã lược bỏ ở phiên bản mới v{currentVersion}.0)
                          </td>
                        </tr>
                      );
                    }
                    if (row.changeType === 'modified') {
                      const typeChanged = row.oldDataType !== row.newDataType;
                      return (
                        <tr key={i} className={`${ROW_CLS} ${MODIFIED_ROW}`}>
                          <td className={`${TD_CLS} ${SEP_R}`}>
                            <div className="leading-[18px]">{row.fieldName}</div>
                            {row.displayName && <div className={`${SUB_LINE} text-[#64748B]`}>{row.displayName}</div>}
                          </td>
                          <td className={`${TD_CLS} ${SEP_R}`}>
                            <span className={typeChanged ? REMOVED_TXT : ''}>{row.oldDataType || '--'}</span>
                            {row.oldExtra && <div className={`${SUB_LINE} ${REMOVED_TXT}`}>{row.oldExtra}</div>}
                          </td>
                          <td className={`${TD_CLS} ${SEP_R}`}>
                            <div className="leading-[18px]">{row.fieldName}</div>
                            {row.displayName && <div className={`${SUB_LINE} text-[#64748B]`}>{row.displayName}</div>}
                          </td>
                          <td className={TD_CLS}>
                            <span className={typeChanged ? `${ADDED_TXT} font-medium` : ''}>{row.newDataType || '--'}</span>
                            {row.newExtra && <div className={`${SUB_LINE} ${ADDED_TXT}`}>{row.newExtra}</div>}
                          </td>
                        </tr>
                      );
                    }
                    // unchanged
                    return (
                      <tr key={i} className={`${ROW_CLS} bg-white hover:bg-[#F8FAFC] transition-colors`}>
                        <td className={`${TD_CLS} ${SEP_R}`}>
                          <div className="leading-[18px]">{row.fieldName}</div>
                          {row.displayName && <div className={`${SUB_LINE} text-[#64748B]`}>{row.displayName}</div>}
                        </td>
                        <td className={`${TD_CLS} ${SEP_R}`}>{row.oldDataType || '--'}</td>
                        <td className={`${TD_CLS} ${SEP_R}`}>
                          <div className="leading-[18px]">{row.fieldName}</div>
                          {row.displayName && <div className={`${SUB_LINE} text-[#64748B]`}>{row.displayName}</div>}
                        </td>
                        <td className={TD_CLS}>{row.newDataType || '--'}</td>
                      </tr>
                    );
                  })}
                  {structureRows.length === 0 && (
                    <tr>
                      <td colSpan={4} className={EMPTY_TD}>Không có thay đổi cấu trúc</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── GENERAL INFO TAB ──────────────────────────────── */}
        {activeTab === 'general' && (
          <div className={TABLE_WRAP}>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full border-collapse collection-table text-[13px] text-left">
                <thead>
                  <tr className="h-[42px] bg-[#F8FAFC] border-b border-[#E0E0E0]">
                    <th className={`${TH_CLS} w-[30%]`}>Trường thông tin</th>
                    <th className={`${TH_CLS} border-l border-[#E2E8F0] w-[35%]`}>
                      <div className="flex items-center gap-2">
                        <span>Phiên bản cũ (v{prevVersion}.0)</span>
                        <Badge label="Trước cập nhật" variant="red" />
                      </div>
                    </th>
                    <th className={`${TH_CLS} border-l border-[#E2E8F0] w-[35%]`}>
                      <div className="flex items-center gap-2">
                        <span>Phiên bản mới (v{currentVersion}.0)</span>
                        <Badge label="Sau cập nhật" variant="green" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {generalRows.map((row, i) => {
                    const changed = row.oldValue !== row.newValue;
                    return (
                      <tr key={i} className={`${ROW_CLS} ${changed ? MODIFIED_ROW : 'bg-white hover:bg-[#F8FAFC] transition-colors'}`}>
                        <td className={TD_CLS}>{row.label}</td>
                        <td className={`${TD_CLS} border-l border-[#E2E8F0] ${changed ? `${REMOVED_TXT} bg-[#FEF2F2]` : ''}`}>
                          {row.oldValue || '--'}
                        </td>
                        <td className={`${TD_CLS} border-l border-[#E2E8F0] ${changed ? `${ADDED_TXT} bg-[#F0FDF4]` : ''}`}>
                          {row.newValue || '--'}
                        </td>
                      </tr>
                    );
                  })}
                  {generalRows.length === 0 && (
                    <tr>
                      <td colSpan={3} className={EMPTY_TD}>Không có thay đổi thông tin chung</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── RELATIONSHIP TAB ──────────────────────────────── */}
        {activeTab === 'relationship' && (
          <div className={TABLE_WRAP}>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full border-collapse collection-table text-[13px] text-left">
                <thead>
                  <tr>
                    {versionHead(false, 3, SEP_R)}
                    {versionHead(true, 3)}
                  </tr>
                  <tr className="h-[42px] bg-[#F8FAFC] border-b border-[#E0E0E0]">
                    <th className={`${TH_CLS} ${SEP_R}`}>Danh mục nguồn</th>
                    <th className={`${TH_CLS} ${SEP_R}`}>Danh mục đích</th>
                    <th className={`${TH_CLS} ${SEP_R}`}>Loại</th>
                    <th className={`${TH_CLS} ${SEP_R}`}>Danh mục nguồn</th>
                    <th className={`${TH_CLS} ${SEP_R}`}>Danh mục đích</th>
                    <th className={TH_CLS}>Loại</th>
                  </tr>
                </thead>
                <tbody>
                  {relationshipRows.map((row, i) => {
                    const relBadge = (t?: string) => t
                      ? <Badge label={t} variant={relTypeColors[t] || 'slate'} />
                      : <span className="text-[#94A3B8]">--</span>;

                    if (row.changeType === 'added') return (
                      <tr key={i} className={`${ROW_CLS} ${ADDED_ROW}`}>
                        <td colSpan={3} className={`${PLACEHOLDER_TD} ${SEP_R}`}>
                          (Không tồn tại ở phiên bản cũ v{prevVersion}.0)
                        </td>
                        <td className={`${TD_CLS} ${SEP_R} ${ADDED_TXT}`}>{row.sourceEntity}</td>
                        <td className={`${TD_CLS} ${SEP_R} ${ADDED_TXT}`}>{row.targetEntity}</td>
                        <td className={TD_CLS}>{relBadge(row.newRelType)}</td>
                      </tr>
                    );
                    if (row.changeType === 'removed') return (
                      <tr key={i} className={`${ROW_CLS} ${REMOVED_ROW}`}>
                        <td className={`${TD_CLS} ${SEP_R} ${REMOVED_TXT}`}>{row.sourceEntity}</td>
                        <td className={`${TD_CLS} ${SEP_R} ${REMOVED_TXT}`}>{row.targetEntity}</td>
                        <td className={`${TD_CLS} ${SEP_R}`}>{relBadge(row.oldRelType)}</td>
                        <td colSpan={3} className={PLACEHOLDER_TD}>
                          (Đã lược bỏ ở phiên bản mới v{currentVersion}.0)
                        </td>
                      </tr>
                    );
                    if (row.changeType === 'modified') {
                      const typeChanged = row.oldRelType !== row.newRelType;
                      return (
                        <tr key={i} className={`${ROW_CLS} ${MODIFIED_ROW}`}>
                          <td className={`${TD_CLS} ${SEP_R}`}>{row.sourceEntity}</td>
                          <td className={`${TD_CLS} ${SEP_R}`}>{row.targetEntity}</td>
                          <td className={`${TD_CLS} ${SEP_R}`}>
                            {typeChanged ? <span className={REMOVED_TXT}>{row.oldRelType}</span> : relBadge(row.oldRelType)}
                          </td>
                          <td className={`${TD_CLS} ${SEP_R} ${ADDED_TXT}`}>{row.sourceEntity}</td>
                          <td className={`${TD_CLS} ${SEP_R} ${ADDED_TXT}`}>{row.targetEntity}</td>
                          <td className={TD_CLS}>{relBadge(row.newRelType)}</td>
                        </tr>
                      );
                    }
                    return (
                      <tr key={i} className={`${ROW_CLS} bg-white hover:bg-[#F8FAFC] transition-colors`}>
                        <td className={`${TD_CLS} ${SEP_R}`}>{row.sourceEntity}</td>
                        <td className={`${TD_CLS} ${SEP_R}`}>{row.targetEntity}</td>
                        <td className={`${TD_CLS} ${SEP_R}`}>{relBadge(row.oldRelType)}</td>
                        <td className={`${TD_CLS} ${SEP_R}`}>{row.sourceEntity}</td>
                        <td className={`${TD_CLS} ${SEP_R}`}>{row.targetEntity}</td>
                        <td className={TD_CLS}>{relBadge(row.newRelType)}</td>
                      </tr>
                    );
                  })}
                  {relationshipRows.length === 0 && (
                    <tr>
                      <td colSpan={6} className={EMPTY_TD}>Không có thay đổi quan hệ</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </BaseModal>
  );
}
